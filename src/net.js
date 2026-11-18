// Coral Coast Rally — serverless online play over WebRTC (PeerJS public broker).
// The first racer online claims a well-known "lobby" peer id and keeps the roster + leaderboard;
// if that tab closes, the remaining racers race to claim it again. Races are peer-to-peer:
// the challenger hosts (runs the bots and relays everyone's car state), guests send their own car.
import { Peer } from 'peerjs';

const LOBBY = 'coral-coast-rally-lobby-v1-k7q2z9';
const PFX = 'ccr-k7q2z9-';
const rid = () => Math.random().toString(36).slice(2, 10);
const OPTS = { debug: 0 };

export function createNet(cb) {
  const N = {
    me: null, id: null, nick: '', paint: 0, look: null, status: 'idle', online: false, started: false,
    lobbyConn: null, lobbyPeer: null, isLobby: false, claiming: false, roster: [],
    rosterMap: new Map(), clients: new Map(),
    room: null, hostConn: null, hostNick: '', pending: new Map(),
  };
  const now = () => Date.now();
  const status = (txt, lvl) => cb.status && cb.status(txt, lvl);
  const selfEntry = () => ({ id: N.id, nick: N.nick, status: N.status, paint: N.paint, seen: now() });
  const helloMsg = () => ({ t: 'hello', id: N.id, nick: N.nick, status: N.status, paint: N.paint, board: cb.getBoard() });

  // ── connection to the lobby ──
  function start(nick, paint) {
    N.nick = nick; N.paint = paint;
    if (N.started) { announce(); return; }
    N.started = true; status('Connecting…');
    N.me = new Peer(PFX + rid(), OPTS);
    N.me.on('open', (id) => { N.id = id; N.online = true; joinLobby(); });
    N.me.on('connection', onDirect);
    N.me.on('error', (e) => {
      const msg = String(e && e.message || '');
      if (e.type === 'peer-unavailable') {
        if (msg.includes(LOBBY)) tryHost();
        else if (N.room) { for (const [id, g] of N.room.guests) if (msg.includes(id)) { g.state = 'offline'; cb.room(); setTimeout(() => dropGuest(id), 2500); } }
      } else if (['network', 'server-error', 'socket-error', 'socket-closed'].includes(e.type)) status('Network problem — retrying…', 'bad');
    });
    N.me.on('disconnected', () => setTimeout(() => { if (N.me && !N.me.destroyed && N.me.disconnected) N.me.reconnect(); }, 1500));
    setInterval(() => {
      if (N.lobbyConn && N.lobbyConn.open) N.lobbyConn.send({ t: 'ping' });
      if (N.isLobby) { // prune silent racers
        let ch = false; for (const [id, e] of N.rosterMap) if (id !== N.id && now() - e.seen > 22000) { N.rosterMap.delete(id); ch = true; }
        const s = N.rosterMap.get(N.id); if (s) s.seen = now();
        if (ch) broadcastRoster();
      }
    }, 5000);
  }
  function joinLobby() {
    if (N.isLobby || !N.me || N.me.destroyed) return;
    const c = N.me.connect(LOBBY, { serialization: 'json', reliable: true });
    let opened = false;
    const to = setTimeout(() => { if (!opened) { try { c.close(); } catch (e) {} tryHost(); } }, 7000);
    c.on('open', () => { opened = true; clearTimeout(to); N.lobbyConn = c; c.send(helloMsg()); status('Online', 'ok'); });
    c.on('data', onLobbyData);
    const lost = () => { clearTimeout(to); if (N.lobbyConn === c) { N.lobbyConn = null; status('Lobby moved — reconnecting…'); setTimeout(tryHost, 300 + Math.random() * 1500); } };
    c.on('close', lost); c.on('error', lost);
  }
  function tryHost() {
    if (N.claiming || N.isLobby || (N.lobbyConn && N.lobbyConn.open)) return;
    N.claiming = true;
    const lp = new Peer(LOBBY, OPTS);
    lp.on('open', () => {
      N.claiming = false; N.isLobby = true; N.lobbyPeer = lp; status('Online', 'ok');
      N.rosterMap.set(N.id, selfEntry()); broadcastRoster();
    });
    lp.on('connection', (c) => {
      c.on('data', (d) => onClientMsg(c, d));
      const drop = () => { const id = N.clients.get(c); N.clients.delete(c); if (id) { N.rosterMap.delete(id); broadcastRoster(); } };
      c.on('close', drop); c.on('error', drop);
    });
    lp.on('error', (e) => {
      if (e.type === 'unavailable-id') { N.claiming = false; lp.destroy(); setTimeout(joinLobby, 400 + Math.random() * 900); }
    });
    lp.on('disconnected', () => { if (!lp.destroyed) setTimeout(() => lp.reconnect(), 1000); });
  }
  // lobby host side
  function onClientMsg(c, d) {
    if (!d || typeof d !== 'object') return;
    if (d.t === 'hello') {
      N.clients.set(c, d.id);
      N.rosterMap.set(d.id, { id: d.id, nick: String(d.nick || '').slice(0, 14), status: d.status, paint: d.paint | 0, seen: now() });
      if (Array.isArray(d.board) && cb.mergeBoard(d.board)) broadcastBoard(); else c.send({ t: 'board', e: cb.getBoard() });
      broadcastRoster();
    } else if (d.t === 'upd') {
      const e = N.rosterMap.get(d.id); if (e) { e.status = d.status; e.nick = String(d.nick || e.nick).slice(0, 14); e.paint = d.paint | 0; e.seen = now(); broadcastRoster(); }
    } else if (d.t === 'stat') {
      if (d.e && cb.mergeBoard([d.e])) broadcastBoard();
    } else if (d.t === 'ping') { const e = N.rosterMap.get(N.clients.get(c)); if (e) e.seen = now(); }
  }
  function rosterList() { return [...N.rosterMap.values()].map(({ id, nick, status, paint }) => ({ id, nick, status, paint })); }
  function broadcastRoster() { const list = rosterList(); for (const c of N.clients.keys()) if (c.open) c.send({ t: 'roster', list }); N.roster = list; cb.roster(list); }
  function broadcastBoard() { const e = cb.getBoard(); for (const c of N.clients.keys()) if (c.open) c.send({ t: 'board', e }); cb.boardChanged(); }
  // lobby client side
  function onLobbyData(d) {
    if (!d) return;
    if (d.t === 'roster') { N.roster = d.list || []; cb.roster(N.roster); }
    else if (d.t === 'board') { cb.mergeBoard(d.e || []); cb.boardChanged(); }
  }
  function announce() {
    if (N.isLobby) { N.rosterMap.set(N.id, selfEntry()); broadcastRoster(); }
    else if (N.lobbyConn && N.lobbyConn.open) N.lobbyConn.send({ t: 'upd', id: N.id, nick: N.nick, status: N.status, paint: N.paint });
  }
  function setStatus(s) { if (N.status !== s) { N.status = s; announce(); } }
  function reportStat(e) {
    if (N.isLobby) { if (cb.mergeBoard([e])) broadcastBoard(); }
    else if (N.lobbyConn && N.lobbyConn.open) N.lobbyConn.send({ t: 'stat', e });
  }

  // ── challenges / race rooms ──
  function challenge(tid, myLook) {
    if (!N.me || N.hostConn || (N.room && N.room.guests.has(tid))) return;
    if (!N.room) N.room = { guests: new Map() };
    N.look = myLook;
    const tgt = N.roster.find(r => r.id === tid);
    const c = N.me.connect(tid, { serialization: 'json', reliable: true });
    const g = { id: tid, conn: c, nick: tgt ? tgt.nick : '?', state: 'invited', look: null };
    N.room.guests.set(tid, g); setStatus('room'); cb.room();
    c.on('open', () => c.send({ t: 'invite', id: N.id, nick: N.nick }));
    c.on('data', (d) => {
      if (!d) return;
      if (d.t === 'accept') { g.state = 'ready'; g.look = d.look; g.nick = String(d.nick || g.nick).slice(0, 14); cb.room(); sendRoomList(); }
      else if (d.t === 'decline') { g.state = d.busy ? 'busy' : 'declined'; cb.room(); setTimeout(() => dropGuest(tid), 2500); }
      else if (d.t === 's') cb.guestState(tid, d.d);
    });
    const gone = () => { if (N.room && N.room.guests.get(tid) === g) { N.room.guests.delete(tid); cb.guestLeft(tid); cb.room(); sendRoomList(); } };
    c.on('close', gone); c.on('error', gone);
  }
  function dropGuest(id) { if (!N.room) return; const g = N.room.guests.get(id); if (!g) return; N.room.guests.delete(id); try { g.conn.close(); } catch (e) {} cb.room(); sendRoomList(); }
  function sendRoomList() {
    if (!N.room) return;
    const list = [N.nick, ...[...N.room.guests.values()].filter(g => g.state === 'ready').map(g => g.nick)];
    for (const g of N.room.guests.values()) if (g.state === 'ready' && g.conn.open) g.conn.send({ t: 'room', list });
  }
  function readyGuests() { return N.room ? [...N.room.guests.values()].filter(g => g.state === 'ready' && g.conn.open) : []; }
  function startRoom(msg) {
    if (!N.room) return;
    for (const g of [...N.room.guests.values()]) if (g.state !== 'ready') dropGuest(g.id);
    broadcast(msg); setStatus('racing');
  }
  function broadcast(msg) { if (N.room) for (const g of N.room.guests.values()) if (g.state === 'ready' && g.conn.open) g.conn.send(msg); }
  function closeRoom() {
    if (N.room) { for (const g of N.room.guests.values()) { try { g.conn.close(); } catch (e) {} } N.room = null; }
    if (N.hostConn) { try { N.hostConn.close(); } catch (e) {} N.hostConn = null; }
    setStatus('idle'); cb.room();
  }
  // incoming invite
  function onDirect(c) {
    let inviter = null;
    c.on('data', (d) => {
      if (!d) return;
      if (d.t === 'invite') {
        inviter = d.id;
        if (N.hostConn || N.room || !cb.canAccept()) { c.send({ t: 'decline', busy: true }); setTimeout(() => c.close(), 500); return; }
        N.pending.set(d.id, c); cb.invite({ id: d.id, nick: String(d.nick || '?').slice(0, 14) });
      } else if (N.hostConn === c) {
        if (d.t === 'start') { setStatus('racing'); cb.start(d); }
        else if (d.t === 'S') cb.hostStates(d.l);
        else if (d.t === 'room') cb.roomList(d.list);
      }
    });
    const gone = () => {
      if (inviter && N.pending.get(inviter) === c) { N.pending.delete(inviter); cb.inviteGone(inviter); }
      if (N.hostConn === c) { N.hostConn = null; setStatus('idle'); cb.hostLeft(); }
    };
    c.on('close', gone); c.on('error', gone);
  }
  function respond(id, yes, myLook) {
    const c = N.pending.get(id); if (!c) return false;
    N.pending.delete(id);
    if (yes && c.open) {
      for (const [oid, oc] of N.pending) { oc.send({ t: 'decline' }); setTimeout(() => oc.close(), 400); cb.inviteGone(oid); }
      N.pending.clear();
      N.hostConn = c; N.hostNick = (N.roster.find(r => r.id === id) || {}).nick || '';
      c.send({ t: 'accept', nick: N.nick, look: myLook }); setStatus('room'); return true;
    }
    try { c.send({ t: 'decline' }); setTimeout(() => c.close(), 400); } catch (e) {}
    return false;
  }
  function toHost(msg) { if (N.hostConn && N.hostConn.open) N.hostConn.send(msg); }

  return {
    start, setStatus, reportStat, challenge, dropGuest, readyGuests, startRoom, broadcast, closeRoom, respond, toHost,
    get id() { return N.id; }, get online() { return N.online; }, get roster() { return N.roster; }, get room() { return N.room; },
    get inRoomAsGuest() { return !!N.hostConn; }, get hostNick() { return N.hostNick; }, get status() { return N.status; },
  };
}
