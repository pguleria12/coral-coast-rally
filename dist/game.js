(()=>{var uv=Object.create;var Zf=Object.defineProperty;var hv=Object.getOwnPropertyDescriptor;var fv=Object.getOwnPropertyNames;var dv=Object.getPrototypeOf,pv=Object.prototype.hasOwnProperty;var mv=(n,e)=>()=>{try{return e||n((e={exports:{}}).exports,e),e.exports}catch(t){throw e=0,t}},wl=(n,e)=>{for(var t in e)Zf(n,t,{get:e[t],enumerable:!0})},gv=(n,e,t,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of fv(e))!pv.call(n,s)&&s!==t&&Zf(n,s,{get:()=>e[s],enumerable:!(i=hv(e,s))||i.enumerable});return n};var j0=(n,e,t)=>(t=n!=null?uv(dv(n)):{},gv(e||!n||!n.__esModule?Zf(t,"default",{value:n,enumerable:!0}):t,n));var tm=mv((b2,em)=>{"use strict";var ce={};ce.generateIdentifier=function(){return Math.random().toString(36).substring(2,12)};ce.localCName=ce.generateIdentifier();ce.splitLines=function(n){return n.trim().split(`
`).map(e=>e.trim())};ce.splitSections=function(n){return n.split(`
m=`).map((t,i)=>(i>0?"m="+t:t).trim()+`\r
`)};ce.getDescription=function(n){let e=ce.splitSections(n);return e&&e[0]};ce.getMediaSections=function(n){let e=ce.splitSections(n);return e.shift(),e};ce.matchPrefix=function(n,e){return ce.splitLines(n).filter(t=>t.indexOf(e)===0)};ce.parseCandidate=function(n){let e;n.indexOf("a=candidate:")===0?e=n.substring(12).split(" "):e=n.substring(10).split(" ");let t={foundation:e[0],component:{1:"rtp",2:"rtcp"}[e[1]]||e[1],protocol:e[2].toLowerCase(),priority:parseInt(e[3],10),ip:e[4],address:e[4],port:parseInt(e[5],10),type:e[7]};for(let i=8;i<e.length;i+=2)switch(e[i]){case"raddr":t.relatedAddress=e[i+1];break;case"rport":t.relatedPort=parseInt(e[i+1],10);break;case"tcptype":t.tcpType=e[i+1];break;case"ufrag":t.ufrag=e[i+1],t.usernameFragment=e[i+1];break;default:t[e[i]]===void 0&&(t[e[i]]=e[i+1]);break}return t};ce.writeCandidate=function(n){let e=[];e.push(n.foundation);let t=n.component;t==="rtp"?e.push(1):t==="rtcp"?e.push(2):e.push(t),e.push(n.protocol.toUpperCase()),e.push(n.priority),e.push(n.address||n.ip),e.push(n.port);let i=n.type;return e.push("typ"),e.push(i),i!=="host"&&n.relatedAddress&&n.relatedPort!==void 0&&(e.push("raddr"),e.push(n.relatedAddress),e.push("rport"),e.push(n.relatedPort)),n.tcpType&&n.protocol.toLowerCase()==="tcp"&&(e.push("tcptype"),e.push(n.tcpType)),(n.usernameFragment||n.ufrag)&&(e.push("ufrag"),e.push(n.usernameFragment||n.ufrag)),"candidate:"+e.join(" ")};ce.parseIceOptions=function(n){return n.substring(14).split(" ")};ce.parseRtpMap=function(n){let e=n.substring(9).split(" "),t={payloadType:parseInt(e.shift(),10)};return e=e[0].split("/"),t.name=e[0],t.clockRate=parseInt(e[1],10),t.channels=e.length===3?parseInt(e[2],10):1,t.numChannels=t.channels,t};ce.writeRtpMap=function(n){let e=n.payloadType;n.preferredPayloadType!==void 0&&(e=n.preferredPayloadType);let t=n.channels||n.numChannels||1;return"a=rtpmap:"+e+" "+n.name+"/"+n.clockRate+(t!==1?"/"+t:"")+`\r
`};ce.parseExtmap=function(n){let e=n.substring(9).split(" ");return{id:parseInt(e[0],10),direction:e[0].indexOf("/")>0?e[0].split("/")[1]:"sendrecv",uri:e[1],attributes:e.slice(2).join(" ")}};ce.writeExtmap=function(n){return"a=extmap:"+(n.id||n.preferredId)+(n.direction&&n.direction!=="sendrecv"?"/"+n.direction:"")+" "+n.uri+(n.attributes?" "+n.attributes:"")+`\r
`};ce.parseFmtp=function(n){let e={},t=n.substring(n.indexOf(" ")+1).split(";");for(let i=0;i<t.length;i++){let[s,...r]=t[i].trim().split("=");e[s.trim()]=r.length?r.join("="):void 0}return e};ce.writeFmtp=function(n){let e="",t=n.payloadType;if(n.preferredPayloadType!==void 0&&(t=n.preferredPayloadType),n.parameters&&Object.keys(n.parameters).length){let i=[];Object.keys(n.parameters).forEach(s=>{n.parameters[s]!==void 0?i.push(s+"="+n.parameters[s]):i.push(s)}),e+="a=fmtp:"+t+" "+i.join(";")+`\r
`}return e};ce.parseRtcpFb=function(n){let e=n.substring(n.indexOf(" ")+1).split(" ");return{type:e.shift(),parameter:e.join(" ")}};ce.writeRtcpFb=function(n){let e="",t=n.payloadType;return n.preferredPayloadType!==void 0&&(t=n.preferredPayloadType),n.rtcpFeedback&&n.rtcpFeedback.length&&n.rtcpFeedback.forEach(i=>{e+="a=rtcp-fb:"+t+" "+i.type+(i.parameter&&i.parameter.length?" "+i.parameter:"")+`\r
`}),e};ce.parseSsrcMedia=function(n){let e=n.indexOf(" "),t={ssrc:parseInt(n.substring(7,e),10)},i=n.indexOf(":",e);return i>-1?(t.attribute=n.substring(e+1,i),t.value=n.substring(i+1)):t.attribute=n.substring(e+1),t};ce.parseSsrcGroup=function(n){let e=n.substring(13).split(" ");return{semantics:e.shift(),ssrcs:e.map(t=>parseInt(t,10))}};ce.getMid=function(n){let e=ce.matchPrefix(n,"a=mid:")[0];if(e)return e.substring(6)};ce.parseFingerprint=function(n){let e=n.substring(14).split(" ");return{algorithm:e[0].toLowerCase(),value:e[1].toUpperCase()}};ce.getDtlsParameters=function(n,e){return{role:"auto",fingerprints:ce.matchPrefix(n+e,"a=fingerprint:").map(ce.parseFingerprint)}};ce.writeDtlsParameters=function(n,e){let t="a=setup:"+e+`\r
`;return n.fingerprints.forEach(i=>{t+="a=fingerprint:"+i.algorithm+" "+i.value+`\r
`}),t};ce.parseCryptoLine=function(n){let e=n.substring(9).split(" ");return{tag:parseInt(e[0],10),cryptoSuite:e[1],keyParams:e[2],sessionParams:e.slice(3)}};ce.writeCryptoLine=function(n){return"a=crypto:"+n.tag+" "+n.cryptoSuite+" "+(typeof n.keyParams=="object"?ce.writeCryptoKeyParams(n.keyParams):n.keyParams)+(n.sessionParams?" "+n.sessionParams.join(" "):"")+`\r
`};ce.parseCryptoKeyParams=function(n){if(n.indexOf("inline:")!==0)return null;let e=n.substring(7).split("|");return{keyMethod:"inline",keySalt:e[0],lifeTime:e[1],mkiValue:e[2]?e[2].split(":")[0]:void 0,mkiLength:e[2]?e[2].split(":")[1]:void 0}};ce.writeCryptoKeyParams=function(n){return n.keyMethod+":"+n.keySalt+(n.lifeTime?"|"+n.lifeTime:"")+(n.mkiValue&&n.mkiLength?"|"+n.mkiValue+":"+n.mkiLength:"")};ce.getCryptoParameters=function(n,e){return ce.matchPrefix(n+e,"a=crypto:").map(ce.parseCryptoLine)};ce.getIceParameters=function(n,e){let t=ce.matchPrefix(n+e,"a=ice-ufrag:")[0],i=ce.matchPrefix(n+e,"a=ice-pwd:")[0];return t&&i?{usernameFragment:t.substring(12),password:i.substring(10)}:null};ce.writeIceParameters=function(n){let e="a=ice-ufrag:"+n.usernameFragment+`\r
a=ice-pwd:`+n.password+`\r
`;return n.iceLite&&(e+=`a=ice-lite\r
`),e};ce.parseRtpParameters=function(n){let e={codecs:[],headerExtensions:[],fecMechanisms:[],rtcp:[]},i=ce.splitLines(n)[0].split(" ");e.profile=i[2];for(let r=3;r<i.length;r++){let o=i[r],a=ce.matchPrefix(n,"a=rtpmap:"+o+" ")[0];if(a){let c=ce.parseRtpMap(a),l=ce.matchPrefix(n,"a=fmtp:"+o+" ");switch(c.parameters=l.length?ce.parseFmtp(l[0]):{},c.rtcpFeedback=ce.matchPrefix(n,"a=rtcp-fb:"+o+" ").map(ce.parseRtcpFb),e.codecs.push(c),c.name.toUpperCase()){case"RED":case"ULPFEC":e.fecMechanisms.push(c.name.toUpperCase());break;default:break}}}ce.matchPrefix(n,"a=extmap:").forEach(r=>{e.headerExtensions.push(ce.parseExtmap(r))});let s=ce.matchPrefix(n,"a=rtcp-fb:* ").map(ce.parseRtcpFb);return e.codecs.forEach(r=>{s.forEach(o=>{r.rtcpFeedback.find(c=>c.type===o.type&&c.parameter===o.parameter)||r.rtcpFeedback.push(o)})}),e};ce.writeRtpDescription=function(n,e){let t="";t+="m="+n+" ",t+=e.codecs.length>0?"9":"0",t+=" "+(e.profile||"UDP/TLS/RTP/SAVPF")+" ",t+=e.codecs.map(s=>s.preferredPayloadType!==void 0?s.preferredPayloadType:s.payloadType).join(" ")+`\r
`,t+=`c=IN IP4 0.0.0.0\r
`,t+=`a=rtcp:9 IN IP4 0.0.0.0\r
`,e.codecs.forEach(s=>{t+=ce.writeRtpMap(s),t+=ce.writeFmtp(s),t+=ce.writeRtcpFb(s)});let i=0;return e.codecs.forEach(s=>{s.maxptime>i&&(i=s.maxptime)}),i>0&&(t+="a=maxptime:"+i+`\r
`),e.headerExtensions&&e.headerExtensions.forEach(s=>{t+=ce.writeExtmap(s)}),t};ce.parseRtpEncodingParameters=function(n){let e=[],t=ce.parseRtpParameters(n),i=t.fecMechanisms.indexOf("RED")!==-1,s=t.fecMechanisms.indexOf("ULPFEC")!==-1,r=ce.matchPrefix(n,"a=ssrc:").map(u=>ce.parseSsrcMedia(u)).filter(u=>u.attribute==="cname"),o=r.length>0&&r[0].ssrc,a,c=ce.matchPrefix(n,"a=ssrc-group:FID").map(u=>u.substring(17).split(" ").map(f=>parseInt(f,10)));c.length>0&&c[0].length>1&&c[0][0]===o&&(a=c[0][1]),t.codecs.forEach(u=>{if(u.name.toUpperCase()==="RTX"&&u.parameters.apt){let h={ssrc:o,codecPayloadType:parseInt(u.parameters.apt,10)};o&&a&&(h.rtx={ssrc:a}),e.push(h),i&&(h=JSON.parse(JSON.stringify(h)),h.fec={ssrc:o,mechanism:s?"red+ulpfec":"red"},e.push(h))}}),e.length===0&&o&&e.push({ssrc:o});let l=ce.matchPrefix(n,"b=");return l.length&&(l[0].indexOf("b=TIAS:")===0?l=parseInt(l[0].substring(7),10):l[0].indexOf("b=AS:")===0?l=parseInt(l[0].substring(5),10)*1e3*.95-2e3*8:l=void 0,e.forEach(u=>{u.maxBitrate=l})),e};ce.parseRtcpParameters=function(n){let e={},t=ce.matchPrefix(n,"a=ssrc:").map(r=>ce.parseSsrcMedia(r)).filter(r=>r.attribute==="cname")[0];t&&(e.cname=t.value,e.ssrc=t.ssrc);let i=ce.matchPrefix(n,"a=rtcp-rsize");e.reducedSize=i.length>0,e.compound=i.length===0;let s=ce.matchPrefix(n,"a=rtcp-mux");return e.mux=s.length>0,e};ce.writeRtcpParameters=function(n){let e="";return n.reducedSize&&(e+=`a=rtcp-rsize\r
`),n.mux&&(e+=`a=rtcp-mux\r
`),n.ssrc!==void 0&&n.cname&&(e+="a=ssrc:"+n.ssrc+" cname:"+n.cname+`\r
`),e};ce.parseMsid=function(n){let e,t=ce.matchPrefix(n,"a=msid:");if(t.length===1)return e=t[0].substring(7).split(" "),{stream:e[0],track:e[1]};let i=ce.matchPrefix(n,"a=ssrc:").map(s=>ce.parseSsrcMedia(s)).filter(s=>s.attribute==="msid");if(i.length>0)return e=i[0].value.split(" "),{stream:e[0],track:e[1]}};ce.parseSctpDescription=function(n){let e=ce.parseMLine(n),t=ce.matchPrefix(n,"a=max-message-size:"),i;t.length>0&&(i=parseInt(t[0].substring(19),10)),isNaN(i)&&(i=65536);let s=ce.matchPrefix(n,"a=sctp-port:");if(s.length>0)return{port:parseInt(s[0].substring(12),10),protocol:e.fmt,maxMessageSize:i};let r=ce.matchPrefix(n,"a=sctpmap:");if(r.length>0){let o=r[0].substring(10).split(" ");return{port:parseInt(o[0],10),protocol:o[1],maxMessageSize:i}}};ce.writeSctpDescription=function(n,e){let t=[];return n.protocol!=="DTLS/SCTP"?t=["m="+n.kind+" 9 "+n.protocol+" "+e.protocol+`\r
`,`c=IN IP4 0.0.0.0\r
`,"a=sctp-port:"+e.port+`\r
`]:t=["m="+n.kind+" 9 "+n.protocol+" "+e.port+`\r
`,`c=IN IP4 0.0.0.0\r
`,"a=sctpmap:"+e.port+" "+e.protocol+` 65535\r
`],e.maxMessageSize!==void 0&&t.push("a=max-message-size:"+e.maxMessageSize+`\r
`),t.join("")};ce.generateSessionId=function(){return Math.random().toString().substr(2,22)};ce.writeSessionBoilerplate=function(n,e,t){let i,s=e!==void 0?e:2;return n?i=n:i=ce.generateSessionId(),`v=0\r
o=`+(t||"thisisadapterortc")+" "+i+" "+s+` IN IP4 127.0.0.1\r
s=-\r
t=0 0\r
`};ce.getDirection=function(n,e){let t=ce.splitLines(n);for(let i=0;i<t.length;i++)switch(t[i]){case"a=sendrecv":case"a=sendonly":case"a=recvonly":case"a=inactive":return t[i].substring(2);default:}return e?ce.getDirection(e):"sendrecv"};ce.getKind=function(n){return ce.splitLines(n)[0].split(" ")[0].substring(2)};ce.isRejected=function(n){return n.split(" ",2)[1]==="0"};ce.parseMLine=function(n){let t=ce.splitLines(n)[0].substring(2).split(" ");return{kind:t[0],port:parseInt(t[1],10),protocol:t[2],fmt:t.slice(3).join(" ")}};ce.parseOLine=function(n){let t=ce.matchPrefix(n,"o=")[0].substring(2).split(" ");return{username:t[0],sessionId:t[1],sessionVersion:parseInt(t[2],10),netType:t[3],addressType:t[4],address:t[5]}};ce.isValidSDP=function(n){if(typeof n!="string"||n.length===0)return!1;let e=ce.splitLines(n);for(let t=0;t<e.length;t++)if(e[t].length<2||e[t].charAt(1)!=="=")return!1;return!0};typeof em=="object"&&(em.exports=ce)});var Gg=0,Od=1,Vg=2;var zr=1,Zo=2,Jo=3,Qi=0,Pn=1,bn=2,Rs=0,jo=1,Bi=2,Fd=3,Bd=4,Wg=5;var Hr=100,Xg=101,qg=102,Yg=103,$g=104,Kg=200,Zg=201,Jg=202,jg=203,kd=204,zd=205,Qg=206,ex=207,tx=208,nx=209,ix=210,sx=211,rx=212,ox=213,ax=214,eu=0,tu=1,nu=2,Do=3,iu=4,su=5,ru=6,ou=7,Hd=0,cx=1,lx=2,es=0,hc=1,fc=2,dc=3,pc=4,mc=5,Gr=6,gc=7,Td="attached",ux="detached",Gd=300,Vr=301,Qo=302,Pu=303,Iu=304,ei=1e3,kn=1001,No=1002,en=1003,Lu=1004;var Wr=1005;var hn=1006,ea=1007;var Mi=1008;var ri=1009,Vd=1010,Wd=1011,ta=1012,Du=1013,ki=1014,di=1015,pn=1016,Nu=1017,Uu=1018,Xr=1020,Xd=35902,qd=35899,Yd=1021,$d=1022,bi=1023,ys=1026,Cs=1027,Ou=1028,Fu=1029,er=1030,Bu=1031;var ku=1033,xc=33776,_c=33777,yc=33778,vc=33779,zu=35840,Hu=35841,Gu=35842,Vu=35843,Wu=36196,Xu=37492,qu=37496,Yu=37488,$u=37489,Sc=37490,Ku=37491,Zu=37808,Ju=37809,ju=37810,Qu=37811,eh=37812,th=37813,nh=37814,ih=37815,sh=37816,rh=37817,oh=37818,ah=37819,ch=37820,lh=37821,uh=36492,hh=36494,fh=36495,dh=36283,ph=36284,Mc=36285,mh=36286;var Rr=2300,Cr=2301,jl=2302,Ed=2303,wd=2400,Ad=2401,Rd=2402,hx=2500;var Kd=0,bc=1,na=2,fx=3200;var gh=0,dx=1,zi="",Lt="srgb",Cn="srgb-linear",Ga="linear",bt="srgb";var Ql=7680;var px=519,mx=512,gx=513,xx=514,Zd=515,_x=516,yx=517,Jd=518,jd=519,Qd=35044,qr=35048;var ep="300 es",_i=2e3,Uo=2001;function xv(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function _v(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function Oo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function vx(){let n=Oo("canvas");return n.style.display="block",n}var Q0={},Fo=null;function Va(...n){let e="THREE."+n.shift();Fo?Fo("log",e,...n):console.log(e,...n)}function Sx(n){let e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Be(...n){n=Sx(n);let e="THREE."+n.shift();if(Fo)Fo("warn",e,...n);else{let t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function qe(...n){n=Sx(n);let e="THREE."+n.shift();if(Fo)Fo("error",e,...n);else{let t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function Ar(...n){let e=n.join(" ");e in Q0||(Q0[e]=!0,Be(...n))}function Mx(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}var bx={[eu]:eu,[nu]:ru,[iu]:iu,[Do]:su,[tu]:tu,[ru]:nu,[ou]:ou,[su]:Do},Zi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){let i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){let i=this._listeners;if(i===void 0)return;let s=i[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let i=t[e.type];if(i!==void 0){e.target=this;let s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},Fn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],eg=1234567,Ba=Math.PI/180,Pr=180/Math.PI;function ts(){let n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Fn[n&255]+Fn[n>>8&255]+Fn[n>>16&255]+Fn[n>>24&255]+"-"+Fn[e&255]+Fn[e>>8&255]+"-"+Fn[e>>16&15|64]+Fn[e>>24&255]+"-"+Fn[t&63|128]+Fn[t>>8&255]+"-"+Fn[t>>16&255]+Fn[t>>24&255]+Fn[i&255]+Fn[i>>8&255]+Fn[i>>16&255]+Fn[i>>24&255]).toLowerCase()}function at(n,e,t){return Math.max(e,Math.min(t,n))}function tp(n,e){return(n%e+e)%e}function yv(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function vv(n,e,t){return n!==e?(t-n)/(e-n):0}function ka(n,e,t){return(1-t)*n+t*e}function Sv(n,e,t,i){return ka(n,e,1-Math.exp(-t*i))}function Mv(n,e=1){return e-Math.abs(tp(n,e*2)-e)}function bv(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function Tv(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Ev(n,e){return n+Math.floor(Math.random()*(e-n+1))}function wv(n,e){return n+Math.random()*(e-n)}function Av(n){return n*(.5-Math.random())}function Rv(n){n!==void 0&&(eg=n);let e=eg+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Cv(n){return n*Ba}function Pv(n){return n*Pr}function Iv(n){return n>0&&Number.isInteger(n)&&2**Math.round(Math.log2(n))===n}function Lv(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function np(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Dv(n,e,t,i,s){let r=Math.cos,o=Math.sin,a=r(t/2),c=o(t/2),l=r((e+i)/2),u=o((e+i)/2),h=r((e-i)/2),f=o((e-i)/2),d=r((i-e)/2),g=o((i-e)/2);switch(s){case"XYX":n.set(a*u,c*h,c*f,a*l);break;case"YZY":n.set(c*f,a*u,c*h,a*l);break;case"ZXZ":n.set(c*h,c*f,a*u,a*l);break;case"XZX":n.set(a*u,c*g,c*d,a*l);break;case"YXY":n.set(c*d,a*u,c*g,a*l);break;case"ZYZ":n.set(c*g,c*d,a*u,a*l);break;default:Be("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function xh(n){switch(n.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function ip(n,e){if(e.constructor===Float32Array)return n;let t=xh(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(n/t,-1)}function sp(n,e){if(e.constructor===Float32Array)return n;let t=xh(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(n*t)}var _h={DEG2RAD:Ba,RAD2DEG:Pr,generateUUID:ts,clamp:at,euclideanModulo:tp,mapLinear:yv,inverseLerp:vv,lerp:ka,damp:Sv,pingpong:Mv,smoothstep:bv,smootherstep:Tv,randInt:Ev,randFloat:wv,randFloatSpread:Av,seededRandom:Rv,degToRad:Cv,radToDeg:Pv,isPowerOfTwo:Iv,ceilPowerOfTwo:Lv,floorPowerOfTwo:np,setQuaternionFromProperEuler:Dv,normalize:sp,denormalize:ip},Ee=class{static{this.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=at(this.x,e.x,t.x),this.y=at(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=at(this.x,e,t),this.y=at(this.y,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(at(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(at(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*i-o*s+e.x,this.y=r*s+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},fn=class{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,o,a){let c=i[s+0],l=i[s+1],u=i[s+2],h=i[s+3],f=r[o+0],d=r[o+1],g=r[o+2],x=r[o+3];if(h!==x||c!==f||l!==d||u!==g){let p=c*f+l*d+u*g+h*x;p<0&&(f=-f,d=-d,g=-g,x=-x,p=-p);let m=1-a;if(p<.9995){let y=Math.acos(p),v=Math.sin(y);m=Math.sin(m*y)/v,a=Math.sin(a*y)/v,c=c*m+f*a,l=l*m+d*a,u=u*m+g*a,h=h*m+x*a}else{c=c*m+f*a,l=l*m+d*a,u=u*m+g*a,h=h*m+x*a;let y=1/Math.sqrt(c*c+l*l+u*u+h*h);c*=y,l*=y,u*=y,h*=y}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,s,r,o){let a=i[s],c=i[s+1],l=i[s+2],u=i[s+3],h=r[o],f=r[o+1],d=r[o+2],g=r[o+3];return e[t]=a*g+u*h+c*d-l*f,e[t+1]=c*g+u*f+l*h-a*d,e[t+2]=l*g+u*d+a*f-c*h,e[t+3]=u*g-a*h-c*f-l*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(i/2),u=a(s/2),h=a(r/2),f=c(i/2),d=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=f*u*h+l*d*g,this._y=l*d*h-f*u*g,this._z=l*u*g+f*d*h,this._w=l*u*h-f*d*g;break;case"YXZ":this._x=f*u*h+l*d*g,this._y=l*d*h-f*u*g,this._z=l*u*g-f*d*h,this._w=l*u*h+f*d*g;break;case"ZXY":this._x=f*u*h-l*d*g,this._y=l*d*h+f*u*g,this._z=l*u*g+f*d*h,this._w=l*u*h-f*d*g;break;case"ZYX":this._x=f*u*h-l*d*g,this._y=l*d*h+f*u*g,this._z=l*u*g-f*d*h,this._w=l*u*h+f*d*g;break;case"YZX":this._x=f*u*h+l*d*g,this._y=l*d*h+f*u*g,this._z=l*u*g-f*d*h,this._w=l*u*h-f*d*g;break;case"XZY":this._x=f*u*h-l*d*g,this._y=l*d*h-f*u*g,this._z=l*u*g+f*d*h,this._w=l*u*h+f*d*g;break;default:Be("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],u=t[6],h=t[10],f=i+a+h;if(f>0){let d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(u-c)*d,this._y=(r-l)*d,this._z=(o-s)*d}else if(i>a&&i>h){let d=2*Math.sqrt(1+i-a-h);this._w=(u-c)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+l)/d}else if(a>h){let d=2*Math.sqrt(1+a-i-h);this._w=(r-l)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(c+u)/d}else{let d=2*Math.sqrt(1+h-i-a);this._w=(o-s)/d,this._x=(r+l)/d,this._y=(c+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(at(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,u=t._w;return this._x=i*u+o*a+s*l-r*c,this._y=s*u+o*c+r*a-i*l,this._z=r*u+o*l+i*c-s*a,this._w=o*u-i*a-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,r=e._z,o=e._w,a=this.dot(e);a<0&&(i=-i,s=-s,r=-r,o=-o,a=-a);let c=1-t;if(a<.9995){let l=Math.acos(a),u=Math.sin(l);c=Math.sin(c*l)/u,t=Math.sin(t*l)/u,this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+o*t,this._onChangeCallback()}else this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+o*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},D=class{static{this.prototype.isVector3=!0}constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(tg.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(tg.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,i=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*s-a*i),u=2*(a*t-r*s),h=2*(r*i-o*t);return this.x=t+c*l+o*h-a*u,this.y=i+c*u+a*l-r*h,this.z=s+c*h+r*u-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=at(this.x,e.x,t.x),this.y=at(this.y,e.y,t.y),this.z=at(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=at(this.x,e,t),this.y=at(this.y,e,t),this.z=at(this.z,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(at(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-i*c,this.z=i*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Jf.copy(this).projectOnVector(e),this.sub(Jf)}reflect(e){return this.sub(Jf.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(at(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Jf=new D,tg=new fn,Ke=class{static{this.prototype.isMatrix3=!0}constructor(e,t,i,s,r,o,a,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,c,l)}set(e,t,i,s,r,o,a,c,l){let u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=t,u[4]=r,u[5]=c,u[6]=i,u[7]=o,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[3],c=i[6],l=i[1],u=i[4],h=i[7],f=i[2],d=i[5],g=i[8],x=s[0],p=s[3],m=s[6],y=s[1],v=s[4],S=s[7],T=s[2],M=s[5],_=s[8];return r[0]=o*x+a*y+c*T,r[3]=o*p+a*v+c*M,r[6]=o*m+a*S+c*_,r[1]=l*x+u*y+h*T,r[4]=l*p+u*v+h*M,r[7]=l*m+u*S+h*_,r[2]=f*x+d*y+g*T,r[5]=f*p+d*v+g*M,r[8]=f*m+d*S+g*_,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8];return t*o*u-t*a*l-i*r*u+i*a*c+s*r*l-s*o*c}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],h=u*o-a*l,f=a*c-u*r,d=l*r-o*c,g=t*h+i*f+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/g;return e[0]=h*x,e[1]=(s*l-u*i)*x,e[2]=(a*i-s*o)*x,e[3]=f*x,e[4]=(u*t-s*c)*x,e[5]=(s*r-a*t)*x,e[6]=d*x,e[7]=(i*c-l*t)*x,e[8]=(o*t-i*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*o+l*a)+o+e,-s*l,s*c,-s*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return Ar("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(jf.makeScale(e,t)),this}rotate(e){return Ar("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(jf.makeRotation(-e)),this}translate(e,t){return Ar("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(jf.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},jf=new Ke,ng=new Ke().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ig=new Ke().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Nv(){let n={enabled:!0,workingColorSpace:Cn,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===bt&&(s.r=_s(s.r),s.g=_s(s.g),s.b=_s(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===bt&&(s.r=Lo(s.r),s.g=Lo(s.g),s.b=Lo(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===zi?Ga:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[o].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Cn]:{primaries:e,whitePoint:i,transfer:Ga,toXYZ:ng,fromXYZ:ig,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Lt},outputColorSpaceConfig:{drawingBufferColorSpace:Lt}},[Lt]:{primaries:e,whitePoint:i,transfer:bt,toXYZ:ng,fromXYZ:ig,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Lt}}}),n}var et=Nv();function _s(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Lo(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var _o,au=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{_o===void 0&&(_o=Oo("canvas")),_o.width=e.width,_o.height=e.height;let s=_o.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=_o}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Oo("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=_s(r[o]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(_s(t[i]/255)*255):t[i]=_s(t[i]);return{data:t,width:e.width,height:e.height}}else return Be("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Uv=0,Bo=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Uv++}),this.uuid=ts(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Qf(s[o].image)):r.push(Qf(s[o]))}else r=Qf(s);i.url=r}return t||(e.images[this.uuid]=i),i}};function Qf(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?au.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Be("Texture: Unable to serialize Texture."),{})}var Ov=0,ed=new D,dn=class n extends Zi{constructor(e=n.DEFAULT_IMAGE,t=n.DEFAULT_MAPPING,i=kn,s=kn,r=hn,o=Mi,a=bi,c=ri,l=n.DEFAULT_ANISOTROPY,u=zi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ov++}),this.uuid=ts(),this.name="",this.source=new Bo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Ee(0,0),this.repeat=new Ee(1,1),this.center=new Ee(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ke,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(ed).x}get height(){return this.source.getSize(ed).y}get depth(){return this.source.getSize(ed).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let i=e[t];if(i===void 0){Be(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Be(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Gd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ei:e.x=e.x-Math.floor(e.x);break;case kn:e.x=e.x<0?0:1;break;case No:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ei:e.y=e.y-Math.floor(e.y);break;case kn:e.y=e.y<0?0:1;break;case No:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};dn.DEFAULT_IMAGE=null;dn.DEFAULT_MAPPING=Gd;dn.DEFAULT_ANISOTROPY=1;var dt=class{static{this.prototype.isVector4=!0}constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*i+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r,c=e.elements,l=c[0],u=c[4],h=c[8],f=c[1],d=c[5],g=c[9],x=c[2],p=c[6],m=c[10];if(Math.abs(u-f)<.01&&Math.abs(h-x)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+f)<.1&&Math.abs(h+x)<.1&&Math.abs(g+p)<.1&&Math.abs(l+d+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let v=(l+1)/2,S=(d+1)/2,T=(m+1)/2,M=(u+f)/4,_=(h+x)/4,b=(g+p)/4;return v>S&&v>T?v<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(v),s=M/i,r=_/i):S>T?S<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),i=M/s,r=b/s):T<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),i=_/r,s=b/r),this.set(i,s,r,t),this}let y=Math.sqrt((p-g)*(p-g)+(h-x)*(h-x)+(f-u)*(f-u));return Math.abs(y)<.001&&(y=1),this.x=(p-g)/y,this.y=(h-x)/y,this.z=(f-u)/y,this.w=Math.acos((l+d+m-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=at(this.x,e.x,t.x),this.y=at(this.y,e.y,t.y),this.z=at(this.z,e.z,t.z),this.w=at(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=at(this.x,e,t),this.y=at(this.y,e,t),this.z=at(this.z,e,t),this.w=at(this.w,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(at(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},cu=class extends Zi{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:hn,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new dt(0,0,e,t),this.scissorTest=!1,this.viewport=new dt(0,0,e,t),this.textures=[];let s=i.count;for(let r=0;r<s;r++)this.textures[r]=new dn({width:e,height:t,depth:i.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:hn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Bo(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},tn=class extends cu{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},Wa=class extends dn{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=en,this.minFilter=en,this.wrapR=kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var lu=class extends dn{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=en,this.minFilter=en,this.wrapR=kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var Ve=class n{static{this.prototype.isMatrix4=!0}constructor(e,t,i,s,r,o,a,c,l,u,h,f,d,g,x,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,c,l,u,h,f,d,g,x,p)}set(e,t,i,s,r,o,a,c,l,u,h,f,d,g,x,p){let m=this.elements;return m[0]=e,m[4]=t,m[8]=i,m[12]=s,m[1]=r,m[5]=o,m[9]=a,m[13]=c,m[2]=l,m[6]=u,m[10]=h,m[14]=f,m[3]=d,m[7]=g,m[11]=x,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,i=e.elements,s=1/yo.setFromMatrixColumn(e,0).length(),r=1/yo.setFromMatrixColumn(e,1).length(),o=1/yo.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,s=e.y,r=e.z,o=Math.cos(i),a=Math.sin(i),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){let f=o*u,d=o*h,g=a*u,x=a*h;t[0]=c*u,t[4]=-c*h,t[8]=l,t[1]=d+g*l,t[5]=f-x*l,t[9]=-a*c,t[2]=x-f*l,t[6]=g+d*l,t[10]=o*c}else if(e.order==="YXZ"){let f=c*u,d=c*h,g=l*u,x=l*h;t[0]=f+x*a,t[4]=g*a-d,t[8]=o*l,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=d*a-g,t[6]=x+f*a,t[10]=o*c}else if(e.order==="ZXY"){let f=c*u,d=c*h,g=l*u,x=l*h;t[0]=f-x*a,t[4]=-o*h,t[8]=g+d*a,t[1]=d+g*a,t[5]=o*u,t[9]=x-f*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){let f=o*u,d=o*h,g=a*u,x=a*h;t[0]=c*u,t[4]=g*l-d,t[8]=f*l+x,t[1]=c*h,t[5]=x*l+f,t[9]=d*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){let f=o*c,d=o*l,g=a*c,x=a*l;t[0]=c*u,t[4]=x-f*h,t[8]=g*h+d,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-l*u,t[6]=d*h+g,t[10]=f-x*h}else if(e.order==="XZY"){let f=o*c,d=o*l,g=a*c,x=a*l;t[0]=c*u,t[4]=-h,t[8]=l*u,t[1]=f*h+x,t[5]=o*u,t[9]=d*h-g,t[2]=g*h-d,t[6]=a*u,t[10]=x*h+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Fv,e,Bv)}lookAt(e,t,i){let s=this.elements;return li.subVectors(e,t),li.lengthSq()===0&&(li.z=1),li.normalize(),Gs.crossVectors(i,li),Gs.lengthSq()===0&&(Math.abs(i.z)===1?li.x+=1e-4:li.z+=1e-4,li.normalize(),Gs.crossVectors(i,li)),Gs.normalize(),Al.crossVectors(li,Gs),s[0]=Gs.x,s[4]=Al.x,s[8]=li.x,s[1]=Gs.y,s[5]=Al.y,s[9]=li.y,s[2]=Gs.z,s[6]=Al.z,s[10]=li.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[4],c=i[8],l=i[12],u=i[1],h=i[5],f=i[9],d=i[13],g=i[2],x=i[6],p=i[10],m=i[14],y=i[3],v=i[7],S=i[11],T=i[15],M=s[0],_=s[4],b=s[8],R=s[12],I=s[1],A=s[5],L=s[9],B=s[13],P=s[2],H=s[6],K=s[10],$=s[14],X=s[3],G=s[7],J=s[11],se=s[15];return r[0]=o*M+a*I+c*P+l*X,r[4]=o*_+a*A+c*H+l*G,r[8]=o*b+a*L+c*K+l*J,r[12]=o*R+a*B+c*$+l*se,r[1]=u*M+h*I+f*P+d*X,r[5]=u*_+h*A+f*H+d*G,r[9]=u*b+h*L+f*K+d*J,r[13]=u*R+h*B+f*$+d*se,r[2]=g*M+x*I+p*P+m*X,r[6]=g*_+x*A+p*H+m*G,r[10]=g*b+x*L+p*K+m*J,r[14]=g*R+x*B+p*$+m*se,r[3]=y*M+v*I+S*P+T*X,r[7]=y*_+v*A+S*H+T*G,r[11]=y*b+v*L+S*K+T*J,r[15]=y*R+v*B+S*$+T*se,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],u=e[2],h=e[6],f=e[10],d=e[14],g=e[3],x=e[7],p=e[11],m=e[15],y=c*d-l*f,v=a*d-l*h,S=a*f-c*h,T=o*d-l*u,M=o*f-c*u,_=o*h-a*u;return t*(x*y-p*v+m*S)-i*(g*y-p*T+m*M)+s*(g*v-x*T+m*_)-r*(g*S-x*M+p*_)}determinantAffine(){let e=this.elements,t=e[0],i=e[4],s=e[8],r=e[1],o=e[5],a=e[9],c=e[2],l=e[6],u=e[10];return t*(o*u-a*l)-i*(r*u-a*c)+s*(r*l-o*c)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],h=e[9],f=e[10],d=e[11],g=e[12],x=e[13],p=e[14],m=e[15],y=t*a-i*o,v=t*c-s*o,S=t*l-r*o,T=i*c-s*a,M=i*l-r*a,_=s*l-r*c,b=u*x-h*g,R=u*p-f*g,I=u*m-d*g,A=h*p-f*x,L=h*m-d*x,B=f*m-d*p,P=y*B-v*L+S*A+T*I-M*R+_*b;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let H=1/P;return e[0]=(a*B-c*L+l*A)*H,e[1]=(s*L-i*B-r*A)*H,e[2]=(x*_-p*M+m*T)*H,e[3]=(f*M-h*_-d*T)*H,e[4]=(c*I-o*B-l*R)*H,e[5]=(t*B-s*I+r*R)*H,e[6]=(p*S-g*_-m*v)*H,e[7]=(u*_-f*S+d*v)*H,e[8]=(o*L-a*I+l*b)*H,e[9]=(i*I-t*L-r*b)*H,e[10]=(g*M-x*S+m*y)*H,e[11]=(h*S-u*M-d*y)*H,e[12]=(a*R-o*A-c*b)*H,e[13]=(t*A-i*R+s*b)*H,e[14]=(x*v-g*T-p*y)*H,e[15]=(u*T-h*v+f*y)*H,this}scale(e){let t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),s=Math.sin(t),r=1-i,o=e.x,a=e.y,c=e.z,l=r*o,u=r*a;return this.set(l*o+i,l*a-s*c,l*c+s*a,0,l*a+s*c,u*a+i,u*c-s*o,0,l*c-s*a,u*c+s*o,r*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,o){return this.set(1,i,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){let s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,u=o+o,h=a+a,f=r*l,d=r*u,g=r*h,x=o*u,p=o*h,m=a*h,y=c*l,v=c*u,S=c*h,T=i.x,M=i.y,_=i.z;return s[0]=(1-(x+m))*T,s[1]=(d+S)*T,s[2]=(g-v)*T,s[3]=0,s[4]=(d-S)*M,s[5]=(1-(f+m))*M,s[6]=(p+y)*M,s[7]=0,s[8]=(g+v)*_,s[9]=(p-y)*_,s[10]=(1-(f+x))*_,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return i.set(1,1,1),t.identity(),this;let o=yo.set(s[0],s[1],s[2]).length(),a=yo.set(s[4],s[5],s[6]).length(),c=yo.set(s[8],s[9],s[10]).length();r<0&&(o=-o),Di.copy(this);let l=1/o,u=1/a,h=1/c;return Di.elements[0]*=l,Di.elements[1]*=l,Di.elements[2]*=l,Di.elements[4]*=u,Di.elements[5]*=u,Di.elements[6]*=u,Di.elements[8]*=h,Di.elements[9]*=h,Di.elements[10]*=h,t.setFromRotationMatrix(Di),i.x=o,i.y=a,i.z=c,this}makePerspective(e,t,i,s,r,o,a=_i,c=!1){let l=this.elements,u=2*r/(t-e),h=2*r/(i-s),f=(t+e)/(t-e),d=(i+s)/(i-s),g,x;if(c)g=r/(o-r),x=o*r/(o-r);else if(a===_i)g=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===Uo)g=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,s,r,o,a=_i,c=!1){let l=this.elements,u=2/(t-e),h=2/(i-s),f=-(t+e)/(t-e),d=-(i+s)/(i-s),g,x;if(c)g=1/(o-r),x=o/(o-r);else if(a===_i)g=-2/(o-r),x=-(o+r)/(o-r);else if(a===Uo)g=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=h,l[9]=0,l[13]=d,l[2]=0,l[6]=0,l[10]=g,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},yo=new D,Di=new Ve,Fv=new D(0,0,0),Bv=new D(1,1,1),Gs=new D,Al=new D,li=new D,sg=new Ve,rg=new fn,Fi=class n{constructor(e=0,t=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],u=s[9],h=s[2],f=s[6],d=s[10];switch(t){case"XYZ":this._y=Math.asin(at(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-at(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(at(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,d),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-at(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(at(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-at(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,d),this._y=0);break;default:Be("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return sg.makeRotationFromQuaternion(e),this.setFromRotationMatrix(sg,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return rg.setFromEuler(this),this.setFromQuaternion(rg,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Fi.DEFAULT_ORDER="XYZ";var Xa=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},kv=0,og=new D,vo=new fn,fs=new Ve,Rl=new D,Ca=new D,zv=new D,Hv=new fn,ag=new D(1,0,0),cg=new D(0,1,0),lg=new D(0,0,1),ug={type:"added"},Gv={type:"removed"},So={type:"childadded",child:null},td={type:"childremoved",child:null},kt=class n extends Zi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:kv++}),this.uuid=ts(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let e=new D,t=new Fi,i=new fn,s=new D(1,1,1);function r(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Ve},normalMatrix:{value:new Ke}}),this.matrix=new Ve,this.matrixWorld=new Ve,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Xa,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return vo.setFromAxisAngle(e,t),this.quaternion.multiply(vo),this}rotateOnWorldAxis(e,t){return vo.setFromAxisAngle(e,t),this.quaternion.premultiply(vo),this}rotateX(e){return this.rotateOnAxis(ag,e)}rotateY(e){return this.rotateOnAxis(cg,e)}rotateZ(e){return this.rotateOnAxis(lg,e)}translateOnAxis(e,t){return og.copy(e).applyQuaternion(this.quaternion),this.position.add(og.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ag,e)}translateY(e){return this.translateOnAxis(cg,e)}translateZ(e){return this.translateOnAxis(lg,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(fs.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Rl.copy(e):Rl.set(e,t,i);let s=this.parent;this.updateWorldMatrix(!0,!1),Ca.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?fs.lookAt(Ca,Rl,this.up):fs.lookAt(Rl,Ca,this.up),this.quaternion.setFromRotationMatrix(fs),s&&(fs.extractRotation(s.matrixWorld),vo.setFromRotationMatrix(fs),this.quaternion.premultiply(vo.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(qe("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ug),So.child=e,this.dispatchEvent(So),So.child=null):qe("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Gv),td.child=e,this.dispatchEvent(td),td.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),fs.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),fs.multiply(e.parent.matrixWorld)),e.applyMatrix4(fs),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ug),So.child=e,this.dispatchEvent(So),So.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){let o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ca,e,zv),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ca,Hv,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*s,r[13]+=i-r[1]*t-r[5]*i-r[9]*s,r[14]+=s-r[2]*t-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,i)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){let h=c[l];r(e.shapes,h)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){let a=o(e.geometries),c=o(e.materials),l=o(e.textures),u=o(e.images),h=o(e.shapes),f=o(e.skeletons),d=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),f.length>0&&(i.skeletons=f),d.length>0&&(i.animations=d),g.length>0&&(i.nodes=g)}return i.object=s,i;function o(a){let c=[];for(let l in a){let u=a[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let s=e.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};kt.DEFAULT_UP=new D(0,1,0);kt.DEFAULT_MATRIX_AUTO_UPDATE=!0;kt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Zt=class extends kt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Vv={type:"move"},ko=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Zt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Zt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Zt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(let x of e.hand.values()){let p=t.getJointPose(x,i),m=this._getHandJoint(l,x);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.quaternion,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}let u=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],f=u.position.distanceTo(h.position),d=.02,g=.005;l.inputState.pinching&&f>d+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=d-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.quaternion,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.quaternion,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Vv)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new Zt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},Tx={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Vs={h:0,s:0,l:0},Cl={h:0,s:0,l:0};function nd(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}var oe=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Lt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,et.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=et.workingColorSpace){return this.r=e,this.g=t,this.b=i,et.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=et.workingColorSpace){if(e=tp(e,1),t=at(t,0,1),i=at(i,0,1),t===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+t):i+t-i*t,o=2*i-r;this.r=nd(o,r,e+1/3),this.g=nd(o,r,e),this.b=nd(o,r,e-1/3)}return et.colorSpaceToWorking(this,s),this}setStyle(e,t=Lt){function i(r){r!==void 0&&parseFloat(r)<1&&Be("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,t);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Be("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);Be("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Lt){let i=Tx[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Be("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=_s(e.r),this.g=_s(e.g),this.b=_s(e.b),this}copyLinearToSRGB(e){return this.r=Lo(e.r),this.g=Lo(e.g),this.b=Lo(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Lt){return et.workingToColorSpace(Bn.copy(this),e),Math.round(at(Bn.r*255,0,255))*65536+Math.round(at(Bn.g*255,0,255))*256+Math.round(at(Bn.b*255,0,255))}getHexString(e=Lt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=et.workingColorSpace){et.workingToColorSpace(Bn.copy(this),t);let i=Bn.r,s=Bn.g,r=Bn.b,o=Math.max(i,s,r),a=Math.min(i,s,r),c,l,u=(a+o)/2;if(a===o)c=0,l=0;else{let h=o-a;switch(l=u<=.5?h/(o+a):h/(2-o-a),o){case i:c=(s-r)/h+(s<r?6:0);break;case s:c=(r-i)/h+2;break;case r:c=(i-s)/h+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=et.workingColorSpace){return et.workingToColorSpace(Bn.copy(this),t),e.r=Bn.r,e.g=Bn.g,e.b=Bn.b,e}getStyle(e=Lt){et.workingToColorSpace(Bn.copy(this),e);let t=Bn.r,i=Bn.g,s=Bn.b;return e!==Lt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(Vs),this.setHSL(Vs.h+e,Vs.s+t,Vs.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Vs),e.getHSL(Cl);let i=ka(Vs.h,Cl.h,t),s=ka(Vs.s,Cl.s,t),r=ka(Vs.l,Cl.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Bn=new oe;oe.NAMES=Tx;var qa=class n{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new oe(e),this.near=t,this.far=i}clone(){return new n(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},zo=class extends kt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Fi,this.environmentIntensity=1,this.environmentRotation=new Fi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Ni=new D,ds=new D,id=new D,ps=new D,Mo=new D,bo=new D,hg=new D,sd=new D,rd=new D,od=new D,ad=new dt,cd=new dt,ld=new dt,$s=class n{constructor(e=new D,t=new D,i=new D){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),Ni.subVectors(e,t),s.cross(Ni);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){Ni.subVectors(s,t),ds.subVectors(i,t),id.subVectors(e,t);let o=Ni.dot(Ni),a=Ni.dot(ds),c=Ni.dot(id),l=ds.dot(ds),u=ds.dot(id),h=o*l-a*a;if(h===0)return r.set(0,0,0),null;let f=1/h,d=(l*c-a*u)*f,g=(o*u-a*c)*f;return r.set(1-d-g,g,d)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,ps)===null?!1:ps.x>=0&&ps.y>=0&&ps.x+ps.y<=1}static getInterpolation(e,t,i,s,r,o,a,c){return this.getBarycoord(e,t,i,s,ps)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,ps.x),c.addScaledVector(o,ps.y),c.addScaledVector(a,ps.z),c)}static getInterpolatedAttribute(e,t,i,s,r,o){return ad.setScalar(0),cd.setScalar(0),ld.setScalar(0),ad.fromBufferAttribute(e,t),cd.fromBufferAttribute(e,i),ld.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(ad,r.x),o.addScaledVector(cd,r.y),o.addScaledVector(ld,r.z),o}static isFrontFacing(e,t,i,s){return Ni.subVectors(i,t),ds.subVectors(e,t),Ni.cross(ds).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ni.subVectors(this.c,this.b),ds.subVectors(this.a,this.b),Ni.cross(ds).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return n.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,s=this.b,r=this.c,o,a;Mo.subVectors(s,i),bo.subVectors(r,i),sd.subVectors(e,i);let c=Mo.dot(sd),l=bo.dot(sd);if(c<=0&&l<=0)return t.copy(i);rd.subVectors(e,s);let u=Mo.dot(rd),h=bo.dot(rd);if(u>=0&&h<=u)return t.copy(s);let f=c*h-u*l;if(f<=0&&c>=0&&u<=0&&c-u>0)return o=c/(c-u),t.copy(i).addScaledVector(Mo,o);od.subVectors(e,r);let d=Mo.dot(od),g=bo.dot(od);if(g>=0&&d<=g)return t.copy(r);let x=d*l-c*g;if(x<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(i).addScaledVector(bo,a);let p=u*g-d*h;if(p<=0&&h-u>=0&&d-g>=0)return hg.subVectors(r,s),a=(h-u)/(h-u+(d-g)),t.copy(s).addScaledVector(hg,a);let m=1/(p+x+f);return o=x*m,a=f*m,t.copy(i).addScaledVector(Mo,o).addScaledVector(bo,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},hi=class{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Ui.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Ui.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=Ui.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Ui):Ui.fromBufferAttribute(r,o),Ui.applyMatrix4(e.matrixWorld),this.expandByPoint(Ui);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Pl.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Pl.copy(i.boundingBox)),Pl.applyMatrix4(e.matrixWorld),this.union(Pl)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ui),Ui.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Pa),Il.subVectors(this.max,Pa),To.subVectors(e.a,Pa),Eo.subVectors(e.b,Pa),wo.subVectors(e.c,Pa),Ws.subVectors(Eo,To),Xs.subVectors(wo,Eo),br.subVectors(To,wo);let t=[0,-Ws.z,Ws.y,0,-Xs.z,Xs.y,0,-br.z,br.y,Ws.z,0,-Ws.x,Xs.z,0,-Xs.x,br.z,0,-br.x,-Ws.y,Ws.x,0,-Xs.y,Xs.x,0,-br.y,br.x,0];return!ud(t,To,Eo,wo,Il)||(t=[1,0,0,0,1,0,0,0,1],!ud(t,To,Eo,wo,Il))?!1:(Ll.crossVectors(Ws,Xs),t=[Ll.x,Ll.y,Ll.z],ud(t,To,Eo,wo,Il))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ui).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ui).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ms[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ms[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ms[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ms[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ms[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ms[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ms[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ms[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ms),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},ms=[new D,new D,new D,new D,new D,new D,new D,new D],Ui=new D,Pl=new hi,To=new D,Eo=new D,wo=new D,Ws=new D,Xs=new D,br=new D,Pa=new D,Il=new D,Ll=new D,Tr=new D;function ud(n,e,t,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){Tr.fromArray(n,r);let a=s.x*Math.abs(Tr.x)+s.y*Math.abs(Tr.y)+s.z*Math.abs(Tr.z),c=e.dot(Tr),l=t.dot(Tr),u=i.dot(Tr);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return!1}return!0}var on=new D,Dl=new Ee,Wv=0,$e=class extends Zi{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Wv++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Qd,this.updateRanges=[],this.gpuType=di,this.version=0,this._normalizationScale=e!==void 0?xh(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Dl.fromBufferAttribute(this,t),Dl.applyMatrix3(e),this.setXY(t,Dl.x,Dl.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)on.fromBufferAttribute(this,t),on.applyMatrix3(e),this.setXYZ(t,on.x,on.y,on.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)on.fromBufferAttribute(this,t),on.applyMatrix4(e),this.setXYZ(t,on.x,on.y,on.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)on.fromBufferAttribute(this,t),on.applyNormalMatrix(e),this.setXYZ(t,on.x,on.y,on.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)on.fromBufferAttribute(this,t),on.transformDirection(e),this.setXYZ(t,on.x,on.y,on.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=this._denormalize(i)),i}setComponent(e,t,i){return this.normalized&&(i=this._normalize(i)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){let t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):ip(e,this.array)}_normalize(e){let t=this._normalizationScale;return t!==void 0?Math.round(e*t):sp(e,this.array)}};var Ya=class extends $e{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var $a=class extends $e{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var st=class extends $e{constructor(e,t,i){super(new Float32Array(e),t,i)}},Xv=new hi,Ia=new D,hd=new D,ti=class{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):Xv.setFromPoints(e).getCenter(i);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ia.subVectors(e,this.center);let t=Ia.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Ia,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(hd.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ia.copy(e.center).add(hd)),this.expandByPoint(Ia.copy(e.center).sub(hd))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},qv=0,xi=new Ve,fd=new kt,Ao=new D,ui=new hi,La=new hi,vn=new D,mt=class n extends Zi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:qv++}),this.uuid=ts(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(xv(e)?$a:Ya)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new Ke().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return xi.makeRotationFromQuaternion(e),this.applyMatrix4(xi),this}rotateX(e){return xi.makeRotationX(e),this.applyMatrix4(xi),this}rotateY(e){return xi.makeRotationY(e),this.applyMatrix4(xi),this}rotateZ(e){return xi.makeRotationZ(e),this.applyMatrix4(xi),this}translate(e,t,i){return xi.makeTranslation(e,t,i),this.applyMatrix4(xi),this}scale(e,t,i){return xi.makeScale(e,t,i),this.applyMatrix4(xi),this}lookAt(e){return fd.lookAt(e),fd.updateMatrix(),this.applyMatrix4(fd.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ao).negate(),this.translate(Ao.x,Ao.y,Ao.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new st(i,3))}else{let i=Math.min(e.length,t.count);for(let s=0;s<i;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Be("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new hi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){qe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){let r=t[i];ui.setFromBufferAttribute(r),this.morphTargetsRelative?(vn.addVectors(this.boundingBox.min,ui.min),this.boundingBox.expandByPoint(vn),vn.addVectors(this.boundingBox.max,ui.max),this.boundingBox.expandByPoint(vn)):(this.boundingBox.expandByPoint(ui.min),this.boundingBox.expandByPoint(ui.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&qe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ti);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){qe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){let i=this.boundingSphere.center;if(ui.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];La.setFromBufferAttribute(a),this.morphTargetsRelative?(vn.addVectors(ui.min,La.min),ui.expandByPoint(vn),vn.addVectors(ui.max,La.max),ui.expandByPoint(vn)):(ui.expandByPoint(La.min),ui.expandByPoint(La.max))}ui.getCenter(i);let s=0;for(let r=0,o=e.count;r<o;r++)vn.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(vn));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)vn.fromBufferAttribute(a,l),c&&(Ao.fromBufferAttribute(e,l),vn.add(Ao)),s=Math.max(s,i.distanceToSquared(vn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&qe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){qe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,s=t.normal,r=t.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==i.count)&&(o=new $e(new Float32Array(4*i.count),4),this.setAttribute("tangent",o));let a=[],c=[],l=new Uint8Array(i.count);for(let R=0;R<i.count;R++)a[R]=new D,c[R]=new D;let u=new D,h=new D,f=new D,d=new Ee,g=new Ee,x=new Ee,p=new D,m=new D;function y(R,I,A){l[R]=l[I]=l[A]=1,u.fromBufferAttribute(i,R),h.fromBufferAttribute(i,I),f.fromBufferAttribute(i,A),d.fromBufferAttribute(r,R),g.fromBufferAttribute(r,I),x.fromBufferAttribute(r,A),h.sub(u),f.sub(u),g.sub(d),x.sub(d);let L=1/(g.x*x.y-x.x*g.y);isFinite(L)&&(p.copy(h).multiplyScalar(x.y).addScaledVector(f,-g.y).multiplyScalar(L),m.copy(f).multiplyScalar(g.x).addScaledVector(h,-x.x).multiplyScalar(L),a[R].add(p),a[I].add(p),a[A].add(p),c[R].add(m),c[I].add(m),c[A].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let R=0,I=v.length;R<I;++R){let A=v[R],L=A.start,B=A.count;for(let P=L,H=L+B;P<H;P+=3)y(e.getX(P+0),e.getX(P+1),e.getX(P+2))}let S=new D,T=new D,M=new D,_=new D;function b(R){M.fromBufferAttribute(s,R),_.copy(M);let I=a[R];S.copy(I),S.sub(M.multiplyScalar(M.dot(I))).normalize(),T.crossVectors(_,I);let L=T.dot(c[R])<0?-1:1;o.setXYZW(R,S.x,S.y,S.z,L)}for(let R=0,I=i.count;R<I;++R)l[R]&&b(R);this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new $e(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,d=i.count;f<d;f++)i.setXYZ(f,0,0,0);let s=new D,r=new D,o=new D,a=new D,c=new D,l=new D,u=new D,h=new D;if(e)for(let f=0,d=e.count;f<d;f+=3){let g=e.getX(f+0),x=e.getX(f+1),p=e.getX(f+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,x),o.fromBufferAttribute(t,p),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),a.fromBufferAttribute(i,g),c.fromBufferAttribute(i,x),l.fromBufferAttribute(i,p),a.add(u),c.add(u),l.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(x,c.x,c.y,c.z),i.setXYZ(p,l.x,l.y,l.z)}else for(let f=0,d=t.count;f<d;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),i.setXYZ(f+0,u.x,u.y,u.z),i.setXYZ(f+1,u.x,u.y,u.z),i.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)vn.fromBufferAttribute(e,t),vn.normalize(),e.setXYZ(t,vn.x,vn.y,vn.z)}toNonIndexed(){function e(a,c){let l=a.array,u=a.itemSize,h=a.normalized,f=new l.constructor(c.length*u),d=0,g=0;for(let x=0,p=c.length;x<p;x++){a.isInterleavedBufferAttribute?d=c[x]*a.data.stride+a.offset:d=c[x]*u;for(let m=0;m<u;m++)f[g++]=l[d++]}return new $e(f,u,h)}if(this.index===null)return Be("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new n,i=this.index.array,s=this.attributes;for(let a in s){let c=s[a],l=e(c,i);t.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let u=0,h=l.length;u<h;u++){let f=l[u],d=e(f,i);c.push(d)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let c in i){let l=i[c];e.data.attributes[c]=l.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],u=[];for(let h=0,f=l.length;h<f;h++){let d=l[h];u.push(d.toJSON(e.data))}u.length>0&&(s[c]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone());let s=e.attributes;for(let l in s){let u=s[l];this.setAttribute(l,u.clone(t))}let r=e.morphAttributes;for(let l in r){let u=[],h=r[l];for(let f=0,d=h.length;f<d;f++)u.push(h[f].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let l=0,u=o.length;l<u;l++){let h=o[l];this.addGroup(h.start,h.count,h.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ks=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Qd,this.updateRanges=[],this.version=0,this.uuid=ts()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[i+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=fg(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=this.array.slice(0).buffer);let i=new this.array.constructor(e.arrayBuffers[t]),s=new this.constructor(i,this.stride);return s.setUsage(this.usage),s}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=fg(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=Array.from(new Uint32Array(this.array.slice(0).buffer)));let i={uuid:this.uuid,buffer:t,type:this.array.constructor.name,stride:this.stride};return i.usage=this.usage,i}};function fg(n){return n.buffer._uuid===void 0&&(n.buffer._uuid=ts()),n.byteOffset===0&&n.byteLength===n.buffer.byteLength?n.buffer._uuid:n.buffer._uuid+":"+n.byteOffset+":"+n.byteLength}var Yn=new D,Zs=class n{constructor(e,t,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=s,this._normalizationScale=e!==void 0?xh(e.array):void 0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Yn.fromBufferAttribute(this,t),Yn.applyMatrix4(e),this.setXYZ(t,Yn.x,Yn.y,Yn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Yn.fromBufferAttribute(this,t),Yn.applyNormalMatrix(e),this.setXYZ(t,Yn.x,Yn.y,Yn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Yn.fromBufferAttribute(this,t),Yn.transformDirection(e),this.setXYZ(t,Yn.x,Yn.y,Yn.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=this._denormalize(i)),i}setComponent(e,t,i){return this.normalized&&(i=this._normalize(i)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=this._denormalize(t)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=this._denormalize(t)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=this._denormalize(t)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=this._denormalize(t)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),i=this._normalize(i)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s),r=this._normalize(r)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Va("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new $e(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new n(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Va("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(e){let t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):ip(e,this.data.array)}_normalize(e){let t=this._normalizationScale;return t!==void 0?Math.round(e*t):sp(e,this.data.array)}},dd=new D,Yv=new D,$v=new Ke,Oi=class{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let s=dd.subVectors(i,t).cross(Yv.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){let s=e.delta(dd),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let o=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(s,o)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||$v.getNormalMatrix(e),s=this.coplanarPoint(dd).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Kv=0,ni=class extends Zi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Kv++}),this.uuid=ts(),this.name="",this.type="Material",this.blending=jo,this.side=Qi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=kd,this.blendDst=zd,this.blendEquation=Hr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new oe(0,0,0),this.blendAlpha=0,this.depthFunc=Do,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=px,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ql,this.stencilZFail=Ql,this.stencilZPass=Ql,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){Be(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Be(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(i.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(i.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(i.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(i.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new oe().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new Oi().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new Ee().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Ee().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var gs=new D,pd=new D,Nl=new D,Ul=new D,Ir=class{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,gs)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=gs.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(gs.copy(this.origin).addScaledVector(this.direction,t),gs.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){pd.copy(e).add(t).multiplyScalar(.5),Nl.copy(t).sub(e).normalize(),Ul.copy(this.origin).sub(pd);let r=e.distanceTo(t)*.5,o=-this.direction.dot(Nl),a=Ul.dot(this.direction),c=-Ul.dot(Nl),l=Ul.lengthSq(),u=Math.abs(1-o*o),h,f,d,g;if(u>0)if(h=o*c-a,f=o*a-c,g=r*u,h>=0)if(f>=-g)if(f<=g){let x=1/u;h*=x,f*=x,d=h*(h+o*f+2*a)+f*(o*h+f+2*c)+l}else f=r,h=Math.max(0,-(o*f+a)),d=-h*h+f*(f+2*c)+l;else f=-r,h=Math.max(0,-(o*f+a)),d=-h*h+f*(f+2*c)+l;else f<=-g?(h=Math.max(0,-(-o*r+a)),f=h>0?-r:Math.min(Math.max(-r,-c),r),d=-h*h+f*(f+2*c)+l):f<=g?(h=0,f=Math.min(Math.max(-r,-c),r),d=f*(f+2*c)+l):(h=Math.max(0,-(o*r+a)),f=h>0?r:Math.min(Math.max(-r,-c),r),d=-h*h+f*(f+2*c)+l);else f=o>0?-r:r,h=Math.max(0,-(o*f+a)),d=-h*h+f*(f+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(pd).addScaledVector(Nl,f),d}intersectSphere(e,t){if(e.radius<0)return null;gs.subVectors(e.center,this.origin);let i=gs.dot(this.direction),s=gs.dot(gs)-i*i,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=i-o,c=i+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,o,a,c,l=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,f=this.origin;return l>=0?(i=(e.min.x-f.x)*l,s=(e.max.x-f.x)*l):(i=(e.max.x-f.x)*l,s=(e.min.x-f.x)*l),u>=0?(r=(e.min.y-f.y)*u,o=(e.max.y-f.y)*u):(r=(e.max.y-f.y)*u,o=(e.min.y-f.y)*u),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),h>=0?(a=(e.min.z-f.z)*h,c=(e.max.z-f.z)*h):(a=(e.max.z-f.z)*h,c=(e.min.z-f.z)*h),i>c||a>s)||((a>i||i!==i)&&(i=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,gs)!==null}intersectTriangle(e,t,i,s,r){let o=this.origin,a=this.direction,c=a.x,l=a.y,u=a.z,h=e.x-o.x,f=e.y-o.y,d=e.z-o.z,g=t.x-o.x,x=t.y-o.y,p=t.z-o.z,m=i.x-o.x,y=i.y-o.y,v=i.z-o.z,S=Math.abs(c),T=Math.abs(l),M=Math.abs(u),_,b,R,I,A,L,B,P,H,K,$,X;if(S>=T&&S>=M?(R=c,L=h,H=g,X=m,c>=0?(_=l,b=u,I=f,A=d,B=x,P=p,K=y,$=v):(_=u,b=l,I=d,A=f,B=p,P=x,K=v,$=y)):T>=M?(R=l,L=f,H=x,X=y,l>=0?(_=u,b=c,I=d,A=h,B=p,P=g,K=v,$=m):(_=c,b=u,I=h,A=d,B=g,P=p,K=m,$=v)):(R=u,L=d,H=p,X=v,u>=0?(_=c,b=l,I=h,A=f,B=g,P=x,K=m,$=y):(_=l,b=c,I=f,A=h,B=x,P=g,K=y,$=m)),R===0)return null;let G=_/R,J=b/R,se=1/R,ye=I-G*L,Le=A-J*L,j=B-G*H,N=P-J*H,U=K-G*X,W=$-J*X,k=U*N-W*j,ee=ye*W-Le*U,le=j*Le-N*ye;if(s){if(k<0||ee<0||le<0)return null}else if((k<0||ee<0||le<0)&&(k>0||ee>0||le>0))return null;let ae=k+ee+le;if(ae===0)return null;let Ie=se*(k*L+ee*H+le*X);return(ae>0?Ie<0:Ie>0)?null:this.at(Ie/ae,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Sn=class extends ni{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new oe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fi,this.combine=Hd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},dg=new Ve,Er=new Ir,Ol=new ti,pg=new D,Fl=new D,Bl=new D,kl=new D,md=new D,zl=new D,mg=new D,Hl=new D,We=class extends kt{constructor(e=new mt,t=new Sn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){zl.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let u=a[c],h=r[c];u!==0&&(md.fromBufferAttribute(h,e),o?zl.addScaledVector(md,u):zl.addScaledVector(md.sub(t),u))}t.add(zl)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ol.copy(i.boundingSphere),Ol.applyMatrix4(r),Er.copy(e.ray).recast(e.near),!(Ol.containsPoint(Er.origin)===!1&&(Er.intersectSphere(Ol,pg)===null||Er.origin.distanceToSquared(pg)>(e.far-e.near)**2))&&(dg.copy(r).invert(),Er.copy(e.ray).applyMatrix4(dg),!(i.boundingBox!==null&&Er.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Er)))}_computeIntersections(e,t,i){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,f=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=f.length;g<x;g++){let p=f[g],m=o[p.materialIndex],y=Math.max(p.start,d.start),v=Math.min(a.count,Math.min(p.start+p.count,d.start+d.count));for(let S=y,T=v;S<T;S+=3){let M=a.getX(S),_=a.getX(S+1),b=a.getX(S+2);s=Gl(this,m,e,i,l,u,h,M,_,b),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{let g=Math.max(0,d.start),x=Math.min(a.count,d.start+d.count);for(let p=g,m=x;p<m;p+=3){let y=a.getX(p),v=a.getX(p+1),S=a.getX(p+2);s=Gl(this,o,e,i,l,u,h,y,v,S),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,x=f.length;g<x;g++){let p=f[g],m=o[p.materialIndex],y=Math.max(p.start,d.start),v=Math.min(c.count,Math.min(p.start+p.count,d.start+d.count));for(let S=y,T=v;S<T;S+=3){let M=S,_=S+1,b=S+2;s=Gl(this,m,e,i,l,u,h,M,_,b),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{let g=Math.max(0,d.start),x=Math.min(c.count,d.start+d.count);for(let p=g,m=x;p<m;p+=3){let y=p,v=p+1,S=p+2;s=Gl(this,o,e,i,l,u,h,y,v,S),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}};function Zv(n,e,t,i,s,r,o,a){let c;if(e.side===Pn?c=i.intersectTriangle(o,r,s,!0,a):c=i.intersectTriangle(s,r,o,e.side===Qi,a),c===null)return null;Hl.copy(a),Hl.applyMatrix4(n.matrixWorld);let l=t.ray.origin.distanceTo(Hl);return l<t.near||l>t.far?null:{distance:l,point:Hl.clone(),object:n}}function Gl(n,e,t,i,s,r,o,a,c,l){n.getVertexPosition(a,Fl),n.getVertexPosition(c,Bl),n.getVertexPosition(l,kl);let u=Zv(n,e,t,i,Fl,Bl,kl,mg);if(u){let h=new D;$s.getBarycoord(mg,Fl,Bl,kl,h),s&&(u.uv=$s.getInterpolatedAttribute(s,a,c,l,h,new Ee)),r&&(u.uv1=$s.getInterpolatedAttribute(r,a,c,l,h,new Ee)),o&&(u.normal=$s.getInterpolatedAttribute(o,a,c,l,h,new D),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));let f={a,b:c,c:l,normal:new D,materialIndex:0};$s.getNormal(Fl,Bl,kl,f.normal),u.face=f,u.barycoord=h}return u}var Da=new dt,gg=new dt,xg=new dt,Jv=new dt,_g=new Ve,Vl=new D,gd=new ti,yg=new Ve,xd=new Ir,Ka=class extends We{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Td,this.bindMatrix=new Ve,this.bindMatrixInverse=new Ve,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new hi),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,Vl),this.boundingBox.expandByPoint(Vl)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new ti),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,Vl),this.boundingSphere.expandByPoint(Vl)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}raycast(e,t){let i=this.material,s=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),gd.copy(this.boundingSphere),gd.applyMatrix4(s),e.ray.intersectsSphere(gd)!==!1&&(yg.copy(s).invert(),xd.copy(e.ray).applyMatrix4(yg),!(this.boundingBox!==null&&xd.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,xd)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new dt,t=this.geometry.attributes.skinWeight;for(let i=0,s=t.count;i<s;i++){e.fromBufferAttribute(t,i);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(i,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Td?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===ux?this.bindMatrixInverse.copy(this.bindMatrix).invert():Be("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let i=this.skeleton,s=this.geometry;gg.fromBufferAttribute(s.attributes.skinIndex,e),xg.fromBufferAttribute(s.attributes.skinWeight,e),t.isVector4?(Da.copy(t),t.set(0,0,0,0)):(Da.set(t.x,t.y,t.z,1),t.set(0,0,0)),Da.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){let o=xg.getComponent(r);if(o!==0){let a=gg.getComponent(r);_g.multiplyMatrices(i.bones[a].matrixWorld,i.boneInverses[a]),t.addScaledVector(Jv.copy(Da).applyMatrix4(_g),o)}}return t.isVector4&&(t.w=Da.w),t.applyMatrix4(this.bindMatrixInverse)}},Ho=class extends kt{constructor(){super(),this.isBone=!0,this.type="Bone"}},Go=class extends dn{constructor(e=null,t=1,i=1,s,r,o,a,c,l=en,u=en,h,f){super(null,o,a,c,l,u,s,r,h,f),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},vg=new Ve,jv=new Ve,Za=class n{constructor(e=[],t=[]){this.uuid=ts(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.previousBoneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Be("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,s=this.bones.length;i<s;i++)this.boneInverses.push(new Ve)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let i=new Ve;this.bones[e]&&i.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let i=this.bones[e];i&&i.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let i=this.bones[e];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){let e=this.bones,t=this.boneInverses,i=this.boneMatrices,s=this.boneTexture;for(let r=0,o=e.length;r<o;r++){let a=e[r]?e[r].matrixWorld:jv;vg.multiplyMatrices(a,t[r]),vg.toArray(i,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new n(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let i=new Go(t,e,e,bi,di);return i.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=i,this}getBoneByName(e){for(let t=0,i=this.bones.length;t<i;t++){let s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null),this.previousBoneTexture!==null&&(this.previousBoneTexture.dispose(),this.previousBoneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let i=0,s=e.bones.length;i<s;i++){let r=e.bones[i],o=t[r];o===void 0&&(Be("Skeleton: No bone found with UUID:",r),o=new Ho),this.bones.push(o),this.boneInverses.push(new Ve().fromArray(e.boneInverses[i]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,i=this.boneInverses;for(let s=0,r=t.length;s<r;s++){let o=t[s];e.bones.push(o.uuid);let a=i[s];e.boneInverses.push(a.toArray())}return e}},vs=class extends $e{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ro=new Ve,Sg=new Ve,Wl=[],Mg=new hi,Qv=new Ve,Na=new We,Ua=new ti,Ji=class extends We{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new vs(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,Qv)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new hi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Ro),Mg.copy(e.boundingBox).applyMatrix4(Ro),this.boundingBox.union(Mg)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ti),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Ro),Ua.copy(e.boundingSphere).applyMatrix4(Ro),this.boundingSphere.union(Ua)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture!==null?e.morphTexture.clone():null,this.instanceColor=e.instanceColor!==null?e.instanceColor.clone():null,this.count=e.count,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,o=e*r+1;for(let a=0;a<i.length;a++)i[a]=s[o+a]}raycast(e,t){let i=this.matrixWorld,s=this.count;if(Na.geometry=this.geometry,Na.material=this.material,Na.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ua.copy(this.boundingSphere),Ua.applyMatrix4(i),e.ray.intersectsSphere(Ua)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ro),Sg.multiplyMatrices(i,Ro),Na.matrixWorld=Sg,Na.raycast(e,Wl);for(let o=0,a=Wl.length;o<a;o++){let c=Wl[o];c.instanceId=r,c.object=this,t.push(c)}Wl.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new vs(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new Go(new Float32Array(s*this.count),s,this.count,Ou,di));let r=this.morphTexture.source.data.data,o=0;for(let l=0;l<i.length;l++)o+=i[l];let a=this.geometry.morphTargetsRelative?1:1-o,c=s*e;return r[c]=a,r.set(i,c+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},wr=new ti,eS=new Ee(.5,.5),Xl=new D,Js=class{constructor(e=new Oi,t=new Oi,i=new Oi,s=new Oi,r=new Oi,o=new Oi){this.planes=[e,t,i,s,r,o]}set(e,t,i,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=_i,i=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],c=r[2],l=r[3],u=r[4],h=r[5],f=r[6],d=r[7],g=r[8],x=r[9],p=r[10],m=r[11],y=r[12],v=r[13],S=r[14],T=r[15];if(s[0].setComponents(l-o,d-u,m-g,T-y).normalize(),s[1].setComponents(l+o,d+u,m+g,T+y).normalize(),s[2].setComponents(l+a,d+h,m+x,T+v).normalize(),s[3].setComponents(l-a,d-h,m-x,T-v).normalize(),i)s[4].setComponents(c,f,p,S).normalize(),s[5].setComponents(l-c,d-f,m-p,T-S).normalize();else if(s[4].setComponents(l-c,d-f,m-p,T-S).normalize(),t===_i)s[5].setComponents(l+c,d+f,m+p,T+S).normalize();else if(t===Uo)s[5].setComponents(c,f,p,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),wr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),wr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(wr)}intersectsSprite(e){wr.center.set(0,0,0);let t=eS.distanceTo(e.center);return wr.radius=.7071067811865476+t,wr.applyMatrix4(e.matrixWorld),this.intersectsSphere(wr)}intersectsSphere(e){let t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let s=t[i];if(Xl.x=s.normal.x>0?e.max.x:e.min.x,Xl.y=s.normal.y>0?e.max.y:e.min.y,Xl.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Xl)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},bg=new Ve,uu=class n{constructor(){this.coordinateSystem=_i,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,i=this._frustums;for(let s=0;s<t.length;s++){let r=t[s];bg.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),i[s]===void 0&&(i[s]=new Js),i[s].setFromProjectionMatrix(bg,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){let t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,i=e._frustums;for(let s=0;s<e._count;s++)t[s]===void 0&&(t[s]=new Js),t[s].copy(i[s]);return this._count=e._count,this}clone(){return new n().copy(this)}};var Vo=class extends ni{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new oe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},hu=new D,fu=new D,Tg=new Ve,Oa=new Ir,ql=new ti,_d=new D,Eg=new D,Lr=class extends kt{constructor(e=new mt,t=new Vo){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)hu.fromBufferAttribute(t,s-1),fu.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=hu.distanceTo(fu);e.setAttribute("lineDistance",new st(i,1))}else Be("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ql.copy(i.boundingSphere),ql.applyMatrix4(s),ql.radius+=r,e.ray.intersectsSphere(ql)===!1)return;Tg.copy(s).invert(),Oa.copy(e.ray).applyMatrix4(Tg);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,u=i.index,f=i.attributes.position;if(u!==null){let d=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let x=d,p=g-1;x<p;x+=l){let m=u.getX(x),y=u.getX(x+1),v=Yl(this,e,Oa,c,m,y,x);v&&t.push(v)}if(this.isLineLoop){let x=u.getX(g-1),p=u.getX(d),m=Yl(this,e,Oa,c,x,p,g-1);m&&t.push(m)}}else{let d=Math.max(0,o.start),g=Math.min(f.count,o.start+o.count);for(let x=d,p=g-1;x<p;x+=l){let m=Yl(this,e,Oa,c,x,x+1,x);m&&t.push(m)}if(this.isLineLoop){let x=Yl(this,e,Oa,c,g-1,d,g-1);x&&t.push(x)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Yl(n,e,t,i,s,r,o){let a=n.geometry.attributes.position;if(hu.fromBufferAttribute(a,s),fu.fromBufferAttribute(a,r),t.distanceSqToSegment(hu,fu,_d,Eg)>i)return;_d.applyMatrix4(n.matrixWorld);let l=e.ray.origin.distanceTo(_d);if(!(l<e.near||l>e.far))return{distance:l,point:Eg.clone().applyMatrix4(n.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:n}}var wg=new D,Ag=new D,Dr=class extends Lr{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[];for(let s=0,r=t.count;s<r;s+=2)wg.fromBufferAttribute(t,s),Ag.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+wg.distanceTo(Ag);e.setAttribute("lineDistance",new st(i,1))}else Be("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},Ja=class extends Lr{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},js=class extends ni{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new oe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Rg=new Ve,Cd=new Ir,$l=new ti,Kl=new D,yi=class extends kt{constructor(e=new mt,t=new js){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),$l.copy(i.boundingSphere),$l.applyMatrix4(s),$l.radius+=r,e.ray.intersectsSphere($l)===!1)return;Rg.copy(s).invert(),Cd.copy(e.ray).applyMatrix4(Rg);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=i.index,h=i.attributes.position;if(l!==null){let f=Math.max(0,o.start),d=Math.min(l.count,o.start+o.count);for(let g=f,x=d;g<x;g++){let p=l.getX(g);Kl.fromBufferAttribute(h,p),Cg(Kl,p,c,s,e,t,this)}}else{let f=Math.max(0,o.start),d=Math.min(h.count,o.start+o.count);for(let g=f,x=d;g<x;g++)Kl.fromBufferAttribute(h,g),Cg(Kl,g,c,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Cg(n,e,t,i,s,r,o){let a=Cd.distanceSqToPoint(n);if(a<t){let c=new D;Cd.closestPointToPoint(n,c),c.applyMatrix4(i);let l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var ja=class extends dn{constructor(e=[],t=Vr,i,s,r,o,a,c,l,u){super(e,t,i,s,r,o,a,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Nr=class extends dn{constructor(e,t,i,s,r,o,a,c,l){super(e,t,i,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Ss=class extends dn{constructor(e,t,i=ki,s,r,o,a=en,c=en,l,u=ys,h=1){if(u!==ys&&u!==Cs)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:e,height:t,depth:h};super(f,s,r,o,a,c,u,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Bo(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Qa=class extends Ss{constructor(e,t=ki,i=Vr,s,r,o=en,a=en,c,l=ys){let u={width:e,height:e,depth:1},h=[u,u,u,u,u,u];super(e,e,t,i,s,r,o,a,c,l),this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},ec=class extends dn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},vt=class n extends mt{constructor(e=1,t=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],u=[],h=[],f=0,d=0;g("z","y","x",-1,-1,i,t,e,o,r,0),g("z","y","x",1,-1,i,t,-e,o,r,1),g("x","z","y",1,1,e,i,t,s,o,2),g("x","z","y",1,-1,e,i,-t,s,o,3),g("x","y","z",1,-1,e,t,i,s,r,4),g("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new st(l,3)),this.setAttribute("normal",new st(u,3)),this.setAttribute("uv",new st(h,2));function g(x,p,m,y,v,S,T,M,_,b,R){let I=S/_,A=T/b,L=S/2,B=T/2,P=M/2,H=_+1,K=b+1,$=0,X=0,G=new D;for(let J=0;J<K;J++){let se=J*A-B;for(let ye=0;ye<H;ye++){let Le=ye*I-L;G[x]=Le*y,G[p]=se*v,G[m]=P,l.push(G.x,G.y,G.z),G[x]=0,G[p]=0,G[m]=M>0?1:-1,u.push(G.x,G.y,G.z),h.push(ye/_),h.push(1-J/b),$+=1}}for(let J=0;J<b;J++)for(let se=0;se<_;se++){let ye=f+se+H*J,Le=f+se+H*(J+1),j=f+(se+1)+H*(J+1),N=f+(se+1)+H*J;c.push(ye,Le,N),c.push(Le,j,N),X+=6}a.addGroup(d,X,R),d+=X,f+=$}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var Tt=class n extends mt{constructor(e=1,t=1,i=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let u=[],h=[],f=[],d=[],g=0,x=[],p=i/2,m=0;y(),o===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(u),this.setAttribute("position",new st(h,3)),this.setAttribute("normal",new st(f,3)),this.setAttribute("uv",new st(d,2));function y(){let S=new D,T=new D,M=0,_=(t-e)/i;for(let b=0;b<=r;b++){let R=[],I=b/r,A=I*(t-e)+e;for(let L=0;L<=s;L++){let B=L/s,P=B*c+a,H=Math.sin(P),K=Math.cos(P);T.x=A*H,T.y=-I*i+p,T.z=A*K,h.push(T.x,T.y,T.z),S.set(H,_,K).normalize(),f.push(S.x,S.y,S.z),d.push(B,1-I),R.push(g++)}x.push(R)}for(let b=0;b<s;b++)for(let R=0;R<r;R++){let I=x[R][b],A=x[R+1][b],L=x[R+1][b+1],B=x[R][b+1];(e>0||R!==0)&&(u.push(I,A,B),M+=3),(t>0||R!==r-1)&&(u.push(A,L,B),M+=3)}l.addGroup(m,M,0),m+=M}function v(S){let T=g,M=new Ee,_=new D,b=0,R=S===!0?e:t,I=S===!0?1:-1;for(let L=1;L<=s;L++)h.push(0,p*I,0),f.push(0,I,0),d.push(.5,.5),g++;let A=g;for(let L=0;L<=s;L++){let P=L/s*c+a,H=Math.cos(P),K=Math.sin(P);_.x=R*K,_.y=p*I,_.z=R*H,h.push(_.x,_.y,_.z),f.push(0,I,0),M.x=H*.5+.5,M.y=K*.5*I+.5,d.push(M.x,M.y),g++}for(let L=0;L<s;L++){let B=T+L,P=A+L;S===!0?u.push(P,P+1,B):u.push(P+1,P,B),b+=3}l.addGroup(m,b,S===!0?1:2),m+=b}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},zn=class n extends Tt{constructor(e=1,t=1,i=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,i,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new n(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},du=class n extends mt{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};let r=[],o=[];a(s),l(i),u(),this.setAttribute("position",new st(r,3)),this.setAttribute("normal",new st(r.slice(),3)),this.setAttribute("uv",new st(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(y){let v=new D,S=new D,T=new D;for(let M=0;M<t.length;M+=3)d(t[M+0],v),d(t[M+1],S),d(t[M+2],T),c(v,S,T,y)}function c(y,v,S,T){let M=T+1,_=[];for(let b=0;b<=M;b++){_[b]=[];let R=y.clone().lerp(S,b/M),I=v.clone().lerp(S,b/M),A=M-b;for(let L=0;L<=A;L++)L===0&&b===M?_[b][L]=R:_[b][L]=R.clone().lerp(I,L/A)}for(let b=0;b<M;b++)for(let R=0;R<2*(M-b)-1;R++){let I=Math.floor(R/2);R%2===0?(f(_[b][I+1]),f(_[b+1][I]),f(_[b][I])):(f(_[b][I+1]),f(_[b+1][I+1]),f(_[b+1][I]))}}function l(y){let v=new D;for(let S=0;S<r.length;S+=3)v.x=r[S+0],v.y=r[S+1],v.z=r[S+2],v.normalize().multiplyScalar(y),r[S+0]=v.x,r[S+1]=v.y,r[S+2]=v.z}function u(){let y=new D;for(let v=0;v<r.length;v+=3){y.x=r[v+0],y.y=r[v+1],y.z=r[v+2];let S=p(y)/2/Math.PI+.5,T=m(y)/Math.PI+.5;o.push(S,1-T)}g(),h()}function h(){for(let y=0;y<o.length;y+=6){let v=o[y+0],S=o[y+2],T=o[y+4],M=Math.max(v,S,T),_=Math.min(v,S,T);M>.9&&_<.1&&(v<.2&&(o[y+0]+=1),S<.2&&(o[y+2]+=1),T<.2&&(o[y+4]+=1))}}function f(y){r.push(y.x,y.y,y.z)}function d(y,v){let S=y*3;v.x=e[S+0],v.y=e[S+1],v.z=e[S+2]}function g(){let y=new D,v=new D,S=new D,T=new D,M=new Ee,_=new Ee,b=new Ee;for(let R=0,I=0;R<r.length;R+=9,I+=6){y.set(r[R+0],r[R+1],r[R+2]),v.set(r[R+3],r[R+4],r[R+5]),S.set(r[R+6],r[R+7],r[R+8]),M.set(o[I+0],o[I+1]),_.set(o[I+2],o[I+3]),b.set(o[I+4],o[I+5]),T.copy(y).add(v).add(S).divideScalar(3);let A=p(T);x(M,I+0,y,A),x(_,I+2,v,A),x(b,I+4,S,A)}}function x(y,v,S,T){T<0&&y.x===1&&(o[v]=y.x-1),S.x===0&&S.z===0&&(o[v]=T/2/Math.PI+.5)}function p(y){return Math.atan2(y.z,-y.x)}function m(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.vertices,e.indices,e.radius,e.detail)}};var vi=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Be("Curve: .getPoint() not implemented.")}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),r+=i.distanceTo(s),t.push(r),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let i=this.getLengths(),s=0,r=i.length,o;t?o=t:o=e*i[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=i[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,i[s]===o)return s/(r-1);let u=i[s],f=i[s+1]-u,d=(o-u)/f;return(s+d)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),c=t||(o.isVector2?new Ee:new D);return c.copy(a).sub(o).normalize(),c}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){let i=new D,s=[],r=[],o=[],a=new D,c=new Ve;for(let d=0;d<=e;d++){let g=d/e;s[d]=this.getTangentAt(g,new D)}r[0]=new D,o[0]=new D;let l=Number.MAX_VALUE,u=Math.abs(s[0].x),h=Math.abs(s[0].y),f=Math.abs(s[0].z);u<=l&&(l=u,i.set(1,0,0)),h<=l&&(l=h,i.set(0,1,0)),f<=l&&i.set(0,0,1),a.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let d=1;d<=e;d++){if(r[d]=r[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(s[d-1],s[d]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(at(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(c.makeRotationAxis(a,g))}o[d].crossVectors(s[d],r[d])}if(t===!0){let d=Math.acos(at(r[0].dot(r[e]),-1,1));d/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(d=-d);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],d*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}},tc=class extends vi{constructor(e=0,t=0,i=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(e,t=new Ee){let i=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),f=c-this.aX,d=l-this.aY;c=f*u-d*h+this.aX,l=f*h+d*u+this.aY}return i.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},pu=class extends tc{constructor(e,t,i,s,r,o){super(e,t,i,i,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function rp(){let n=0,e=0,t=0,i=0;function s(r,o,a,c){n=r,e=a,t=-3*r+3*o-2*a-c,i=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,u,h){let f=(o-r)/l-(a-r)/(l+u)+(a-o)/u,d=(a-o)/u-(c-o)/(u+h)+(c-a)/h;f*=u,d*=u,s(o,a,f,d)},calc:function(r){let o=r*r,a=o*r;return n+e*r+t*o+i*a}}}var Pg=new D,Ig=new D,yd=new rp,vd=new rp,Sd=new rp,Wo=class extends vi{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new D){let i=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,u;this.closed||a>0?l=s[(a-1)%r]:(Ig.subVectors(s[0],s[1]).add(s[0]),l=Ig);let h=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?u=s[(a+2)%r]:(Pg.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=Pg),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,g=Math.pow(l.distanceToSquared(h),d),x=Math.pow(h.distanceToSquared(f),d),p=Math.pow(f.distanceToSquared(u),d);x<1e-4&&(x=1),g<1e-4&&(g=x),p<1e-4&&(p=x),yd.initNonuniformCatmullRom(l.x,h.x,f.x,u.x,g,x,p),vd.initNonuniformCatmullRom(l.y,h.y,f.y,u.y,g,x,p),Sd.initNonuniformCatmullRom(l.z,h.z,f.z,u.z,g,x,p)}else this.curveType==="catmullrom"&&(yd.initCatmullRom(l.x,h.x,f.x,u.x,this.tension),vd.initCatmullRom(l.y,h.y,f.y,u.y,this.tension),Sd.initCatmullRom(l.z,h.z,f.z,u.z,this.tension));return i.set(yd.calc(c),vd.calc(c),Sd.calc(c)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new D().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Lg(n,e,t,i,s){let r=(i-e)*.5,o=(s-t)*.5,a=n*n,c=n*a;return(2*t-2*i+r+o)*c+(-3*t+3*i-2*r-o)*a+r*n+t}function tS(n,e){let t=1-n;return t*t*e}function nS(n,e){return 2*(1-n)*n*e}function iS(n,e){return n*n*e}function za(n,e,t,i){return tS(n,e)+nS(n,t)+iS(n,i)}function sS(n,e){let t=1-n;return t*t*t*e}function rS(n,e){let t=1-n;return 3*t*t*n*e}function oS(n,e){return 3*(1-n)*n*n*e}function aS(n,e){return n*n*n*e}function Ha(n,e,t,i,s){return sS(n,e)+rS(n,t)+oS(n,i)+aS(n,s)}var mu=class extends vi{constructor(e=new Ee,t=new Ee,i=new Ee,s=new Ee){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new Ee){let i=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return i.set(Ha(e,s.x,r.x,o.x,a.x),Ha(e,s.y,r.y,o.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Xo=class extends vi{constructor(e=new D,t=new D,i=new D,s=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new D){let i=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return i.set(Ha(e,s.x,r.x,o.x,a.x),Ha(e,s.y,r.y,o.y,a.y),Ha(e,s.z,r.z,o.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},gu=class extends vi{constructor(e=new Ee,t=new Ee){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Ee){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Ee){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},xu=class extends vi{constructor(e=new D,t=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new D){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new D){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},_u=class extends vi{constructor(e=new Ee,t=new Ee,i=new Ee){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new Ee){let i=t,s=this.v0,r=this.v1,o=this.v2;return i.set(za(e,s.x,r.x,o.x),za(e,s.y,r.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ur=class extends vi{constructor(e=new D,t=new D,i=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new D){let i=t,s=this.v0,r=this.v1,o=this.v2;return i.set(za(e,s.x,r.x,o.x),za(e,s.y,r.y,o.y),za(e,s.z,r.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},yu=class extends vi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Ee){let i=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],u=s[o>s.length-2?s.length-1:o+1],h=s[o>s.length-3?s.length-1:o+2];return i.set(Lg(a,c.x,l.x,u.x,h.x),Lg(a,c.y,l.y,u.y,h.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new Ee().fromArray(s))}return this}},cS=Object.freeze({__proto__:null,ArcCurve:pu,CatmullRomCurve3:Wo,CubicBezierCurve:mu,CubicBezierCurve3:Xo,EllipseCurve:tc,LineCurve:gu,LineCurve3:xu,QuadraticBezierCurve:_u,QuadraticBezierCurve3:Ur,SplineCurve:yu});var qo=class n extends du{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}};var ii=class n extends mt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(i),c=Math.floor(s),l=a+1,u=c+1,h=e/a,f=t/c,d=[],g=[],x=[],p=[];for(let m=0;m<u;m++){let y=m*f-o;for(let v=0;v<l;v++){let S=v*h-r;g.push(S,-y,0),x.push(0,0,1),p.push(v/a),p.push(1-m/c)}}for(let m=0;m<c;m++)for(let y=0;y<a;y++){let v=y+l*m,S=y+l*(m+1),T=y+1+l*(m+1),M=y+1+l*m;d.push(v,S,M),d.push(S,T,M)}this.setIndex(d),this.setAttribute("position",new st(g,3)),this.setAttribute("normal",new st(x,3)),this.setAttribute("uv",new st(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.widthSegments,e.heightSegments)}};var $n=class n extends mt{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let c=Math.min(o+a,Math.PI),l=0,u=[],h=new D,f=new D,d=[],g=[],x=[],p=[];for(let m=0;m<=i;m++){let y=[],v=m/i,S=o+v*a,T=e*Math.cos(S),M=Math.sqrt(e*e-T*T),_=0;m===0&&o===0?_=.5/t:m===i&&c===Math.PI&&(_=-.5/t);for(let b=0;b<=t;b++){let R=b/t,I=s+R*r;h.x=-M*Math.cos(I),h.y=T,h.z=M*Math.sin(I),g.push(h.x,h.y,h.z),f.copy(h).normalize(),x.push(f.x,f.y,f.z),p.push(R+_,1-v),y.push(l++)}u.push(y)}for(let m=0;m<i;m++)for(let y=0;y<t;y++){let v=u[m][y+1],S=u[m][y],T=u[m+1][y],M=u[m+1][y+1];(m!==0||o>0)&&d.push(v,S,M),(m!==i-1||c<Math.PI)&&d.push(S,T,M)}this.setIndex(d),this.setAttribute("position",new st(g,3)),this.setAttribute("normal",new st(x,3)),this.setAttribute("uv",new st(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var nc=class n extends mt{constructor(e=1,t=.4,i=12,s=48,r=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:r,thetaStart:o,thetaLength:a},i=Math.floor(i),s=Math.floor(s);let c=[],l=[],u=[],h=[],f=new D,d=new D,g=new D;for(let x=0;x<=i;x++){let p=o+x/i*a;for(let m=0;m<=s;m++){let y=m/s*r;d.x=(e+t*Math.cos(p))*Math.cos(y),d.y=(e+t*Math.cos(p))*Math.sin(y),d.z=t*Math.sin(p),l.push(d.x,d.y,d.z),f.x=e*Math.cos(y),f.y=e*Math.sin(y),g.subVectors(d,f).normalize(),u.push(g.x,g.y,g.z),h.push(m/s),h.push(x/i)}}for(let x=1;x<=i;x++)for(let p=1;p<=s;p++){let m=(s+1)*x+p-1,y=(s+1)*(x-1)+p-1,v=(s+1)*(x-1)+p,S=(s+1)*x+p;c.push(m,y,S),c.push(y,v,S)}this.setIndex(c),this.setAttribute("position",new st(l,3)),this.setAttribute("normal",new st(u,3)),this.setAttribute("uv",new st(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}};var ic=class n extends mt{constructor(e=new Ur(new D(-1,-1,0),new D(-1,1,0),new D(1,1,0)),t=64,i=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:i,radialSegments:s,closed:r};let o=e.computeFrenetFrames(t,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new D,c=new D,l=new Ee,u=new D,h=[],f=[],d=[],g=[];x(),this.setIndex(g),this.setAttribute("position",new st(h,3)),this.setAttribute("normal",new st(f,3)),this.setAttribute("uv",new st(d,2));function x(){for(let v=0;v<t;v++)p(v);p(r===!1?t:0),y(),m()}function p(v){u=e.getPointAt(v/t,u);let S=o.normals[v],T=o.binormals[v];for(let M=0;M<=s;M++){let _=M/s*Math.PI*2,b=Math.sin(_),R=-Math.cos(_);c.x=R*S.x+b*T.x,c.y=R*S.y+b*T.y,c.z=R*S.z+b*T.z,c.normalize(),f.push(c.x,c.y,c.z),a.x=u.x+i*c.x,a.y=u.y+i*c.y,a.z=u.z+i*c.z,h.push(a.x,a.y,a.z)}}function m(){for(let v=1;v<=t;v++)for(let S=1;S<=s;S++){let T=(s+1)*(v-1)+(S-1),M=(s+1)*v+(S-1),_=(s+1)*v+S,b=(s+1)*(v-1)+S;g.push(T,M,b),g.push(M,_,b)}}function y(){for(let v=0;v<=t;v++)for(let S=0;S<=s;S++)l.x=v/t,l.y=S/s,d.push(l.x,l.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new n(new cS[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}};function Yr(n){let e={};for(let t in n){e[t]={};for(let i in n[t]){let s=n[t][i];if(Dg(s))s.isRenderTargetTexture?(Be("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(Dg(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();e[t][i]=r}else e[t][i]=s.slice();else e[t][i]=s}}return e}function Hn(n){let e={};for(let t=0;t<n.length;t++){let i=Yr(n[t]);for(let s in i)e[s]=i[s]}return e}function Dg(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function lS(n){let e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function op(n){let e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:et.workingColorSpace}var Hi={clone:Yr,merge:Hn},uS=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,hS=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,zt=class extends ni{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=uS,this.fragmentShader=hS,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Yr(e.uniforms),this.uniformsGroups=lS(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let i in e.uniforms){let s=e.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=t[s.value]||null;break;case"c":this.uniforms[i].value=new oe().setHex(s.value);break;case"v2":this.uniforms[i].value=new Ee().fromArray(s.value);break;case"v3":this.uniforms[i].value=new D().fromArray(s.value);break;case"v4":this.uniforms[i].value=new dt().fromArray(s.value);break;case"m3":this.uniforms[i].value=new Ke().fromArray(s.value);break;case"m4":this.uniforms[i].value=new Ve().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Yo=class extends zt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Rt=class extends ni{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new oe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new oe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=gh,this.normalScale=new Ee(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Mn=class extends Rt{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Ee(1,1),this.clearcoatNormalMap=null,this.diffuseRoughnessMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return at(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessMinimum=100,this.iridescenceThicknessMaximum=400,this.iridescenceThicknessMap=null,this.sheenColor=new oe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new oe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new oe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._diffuseRoughness=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get diffuseRoughness(){return this._diffuseRoughness}set diffuseRoughness(e){this._diffuseRoughness>0!=e>0&&this.version++,this._diffuseRoughness=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}get iridescenceThicknessRange(){return Ar('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),[this.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum]}set iridescenceThicknessRange(e){Ar('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),this.iridescenceThicknessMinimum=e[0],this.iridescenceThicknessMaximum=e[1]}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.diffuseRoughness=e.diffuseRoughness,this.diffuseRoughnessMap=e.diffuseRoughnessMap,this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum,this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var vu=class extends ni{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=fx,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Su=class extends ni{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Ys(n,e){return!n||n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function Fa(n){return n!==void 0&&n.inTangents!==void 0&&n.outTangents!==void 0}function fS(n){function e(s,r){return n[s]-n[r]}let t=n.length,i=new Array(t);for(let s=0;s!==t;++s)i[s]=s;return i.sort(e),i}function Ng(n,e,t){let i=n.length,s=new n.constructor(i);for(let r=0,o=0;o!==i;++r){let a=t[r]*e;for(let c=0;c!==e;++c)s[o++]=n[a+c]}return s}function dS(n,e,t,i){let s=1,r=n[0];for(;r!==void 0&&r[i]===void 0;)r=n[s++];if(r===void 0)return;let o=r[i];if(o!==void 0)if(Array.isArray(o))do o=r[i],o!==void 0&&(e.push(r.time),t.push(...o)),r=n[s++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[i],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=n[s++];while(r!==void 0);else do o=r[i],o!==void 0&&(e.push(r.time),t.push(o)),r=n[s++];while(r!==void 0)}var ji=class{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,s=t[i],r=t[i-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=i+2;;){if(s===void 0){if(e<r)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(r=s,s=t[++i],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(i=2,r=a);for(let c=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===c)break;if(s=r,r=t[--i-1],e>=r)break e}o=i,i=0;break t}break n}for(;i<o;){let a=i+o>>>1;e<t[a]?o=a:i=a+1}if(s=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=i[r+o];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Mu=class extends ji{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:wd,endingEnd:wd}}intervalChanged_(e,t,i){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Ad:r=e,a=2*t-i;break;case Rd:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=i}if(c===void 0)switch(this.getSettings_().endingEnd){case Ad:o=e,c=2*i-t;break;case Rd:o=1,c=i+s[1]-s[0];break;default:o=e-1,c=t}let l=(i-t)*.5,u=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(c-i),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,u=this._offsetPrev,h=this._offsetNext,f=this._weightPrev,d=this._weightNext,g=(i-t)/(s-t),x=g*g,p=x*g,m=-f*p+2*f*x-f*g,y=(1+f)*p+(-1.5-2*f)*x+(-.5+f)*g+1,v=(-1-d)*p+(1.5+d)*x+.5*g,S=d*p-d*x;for(let T=0;T!==a;++T)r[T]=m*o[u+T]+y*o[l+T]+v*o[c+T]+S*o[h+T];return r}},bu=class extends ji{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,u=(i-t)/(s-t),h=1-u;for(let f=0;f!==a;++f)r[f]=o[l+f]*h+o[c+f]*u;return r}},Tu=class extends ji{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Eu=class extends ji{interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,u=this.inTangents,h=this.outTangents;if(!u||!h){let g=(i-t)/(s-t),x=1-g;for(let p=0;p!==a;++p)r[p]=o[l+p]*x+o[c+p]*g;return r}let f=a*2,d=e-1;for(let g=0;g!==a;++g){let x=o[l+g],p=o[c+g],m=d*f+g*2,y=h[m],v=h[m+1],S=e*f+g*2,T=u[S],M=u[S+1],_=mS(i,t,y,T,s);r[g]=Ex(_,x,v,M,p)}return r}};function Ex(n,e,t,i,s){let r=1-n;return r*r*r*e+3*r*r*n*t+3*r*n*n*i+n*n*n*s}function pS(n,e,t,i,s){let r=1-n;return 3*r*r*(t-e)+6*r*n*(i-t)+3*n*n*(s-i)}function mS(n,e,t,i,s){let r=(n-e)/(s-e);for(let o=0;o<8;o++){let a=Ex(r,e,t,i,s)-n;if(Math.abs(a)<1e-10)break;let c=pS(r,e,t,i,s);if(Math.abs(c)<1e-10)break;r=Math.max(0,Math.min(1,r-a/c))}return r}var si=class{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ys(t,this.TimeBufferType),this.values=Ys(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:Ys(e.times,Array),values:Ys(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s),Fa(e.settings)&&(i.settings={inTangents:Ys(e.settings.inTangents,Array),outTangents:Ys(e.settings.outTangents,Array)})}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new Tu(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new bu(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Mu(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Eu(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Rr:t=this.InterpolantFactoryMethodDiscrete;break;case Cr:t=this.InterpolantFactoryMethodLinear;break;case jl:t=this.InterpolantFactoryMethodSmooth;break;case Ed:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Be("KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Rr;case this.InterpolantFactoryMethodLinear:return Cr;case this.InterpolantFactoryMethodSmooth:return jl;case this.InterpolantFactoryMethodBezier:return Ed}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e;Fa(this.settings)&&(Ug(this.settings.inTangents,e),Ug(this.settings.outTangents,e))}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e;Fa(this.settings)&&(Og(this.settings.inTangents,e),Og(this.settings.outTangents,e))}return this}trim(e,t){let i=this.times,s=i.length,r=0,o=s-1;for(;r!==s&&i[r]<e;)++r;for(;o!==-1&&i[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=i.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(qe("KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,s=this.values,r=i.length;r===0&&(qe("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let c=i[a];if(typeof c=="number"&&isNaN(c)){qe("KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){qe("KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(s!==void 0&&_v(s))for(let a=0,c=s.length;a!==c;++a){let l=s[a];if(isNaN(l)){qe("KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===jl,r=e.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=e[a],u=e[a+1];if(l!==u&&(a!==1||l!==e[0]))if(s)c=!0;else{let h=a*i,f=h-i,d=h+i;for(let g=0;g!==i;++g){let x=t[h+g];if(x!==t[f+g]||x!==t[d+g]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];let h=a*i,f=o*i;for(let d=0;d!==i;++d)t[f+d]=t[h+d]}++o}}if(r>0){e[o]=e[r];for(let a=r*i,c=o*i,l=0;l!==i;++l)t[c+l]=t[a+l];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,Fa(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function Ug(n,e){for(let t=0,i=n.length;t!==i;t+=2)n[t]+=e}function Og(n,e){for(let t=0,i=n.length;t!==i;t+=2)n[t]*=e}si.prototype.ValueTypeName="";si.prototype.TimeBufferType=Float32Array;si.prototype.ValueBufferType=Float32Array;si.prototype.DefaultInterpolation=Cr;var Ms=class extends si{constructor(e,t,i){super(e,t,i)}};Ms.prototype.ValueTypeName="bool";Ms.prototype.ValueBufferType=Array;Ms.prototype.DefaultInterpolation=Rr;Ms.prototype.InterpolantFactoryMethodLinear=void 0;Ms.prototype.InterpolantFactoryMethodSmooth=void 0;var sc=class extends si{constructor(e,t,i,s){super(e,t,i,s)}};sc.prototype.ValueTypeName="color";var bs=class extends si{constructor(e,t,i,s){super(e,t,i,s)}};bs.prototype.ValueTypeName="number";var wu=class extends ji{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(i-t)/(s-t),l=e*a;for(let u=l+a;l!==u;l+=4)fn.slerpFlat(r,0,o,l-a,o,l,c);return r}},Ts=class extends si{constructor(e,t,i,s){super(e,t,i,s)}InterpolantFactoryMethodLinear(e){return new wu(this.times,this.values,this.getValueSize(),e)}};Ts.prototype.ValueTypeName="quaternion";Ts.prototype.InterpolantFactoryMethodSmooth=void 0;var Es=class extends si{constructor(e,t,i){super(e,t,i)}};Es.prototype.ValueTypeName="string";Es.prototype.ValueBufferType=Array;Es.prototype.DefaultInterpolation=Rr;Es.prototype.InterpolantFactoryMethodLinear=void 0;Es.prototype.InterpolantFactoryMethodSmooth=void 0;var Qs=class extends si{constructor(e,t,i,s){super(e,t,i,s)}};Qs.prototype.ValueTypeName="vector";var rc=class{constructor(e="",t=-1,i=[],s=hx){this.name=e,this.tracks=i,this.duration=t,this.blendMode=s,this.uuid=ts(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],i=e.tracks,s=1/(e.fps||1);for(let o=0,a=i.length;o!==a;++o)t.push(xS(i[o]).scale(s));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){let t=[],i=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,o=i.length;r!==o;++r)t.push(si.toJSON(i[r]));return s}static CreateFromMorphTargetSequence(e,t,i,s){let r=t.length,o=[];for(let a=0;a<r;a++){let c=[],l=[];c.push((a+r-1)%r,a,(a+1)%r),l.push(0,1,0);let u=fS(c);c=Ng(c,1,u),l=Ng(l,1,u),!s&&c[0]===0&&(c.push(r),l.push(l[0])),o.push(new bs(".morphTargetInfluences["+t[a].name+"]",c,l).scale(1/i))}return new this(e,-1,o)}static findByName(e,t){let i=e;if(!Array.isArray(e)){let s=e;i=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<i.length;s++)if(i[s].name===t)return i[s];return null}static CreateClipsFromMorphTargetSequences(e,t,i){let s={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,c=e.length;a<c;a++){let l=e[a],u=l.name.match(r);if(u&&u.length>1){let h=u[1],f=s[h];f||(s[h]=f=[]),f.push(l)}}let o=[];for(let a in s)o.push(this.CreateFromMorphTargetSequence(a,s[a],t,i));return o}resetDuration(){let e=this.tracks,t=0;for(let i=0,s=e.length;i!==s;++i){let r=this.tracks[i];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let i=0;i<this.tracks.length;i++)e.push(this.tracks[i].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function gS(n){switch(n.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return bs;case"vector":case"vector2":case"vector3":case"vector4":return Qs;case"color":return sc;case"quaternion":return Ts;case"bool":case"boolean":return Ms;case"string":return Es}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+n)}function xS(n){if(n.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=gS(n.type);if(n.times===void 0){let i=[],s=[];dS(n.keys,i,s,"value"),n.times=i,n.values=s}let t;return e.parse!==void 0?t=e.parse(n):t=new e(n.name,n.times,n.values,n.interpolation),Fa(n.settings)&&(t.settings={inTangents:Ys(n.settings.inTangents,Float32Array),outTangents:Ys(n.settings.outTangents,Float32Array)}),t}var Ki={enabled:!1,files:{},add:function(n,e){this.enabled!==!1&&(Fg(n)||(this.files[n]=e))},get:function(n){if(this.enabled!==!1&&!Fg(n))return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}};function Fg(n){try{let e=n.slice(n.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}var Au=class{constructor(e,t,i){let s=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),c?c(u):u},this.setURLModifier=function(u){return c=u,this},this.addHandler=function(u,h){return l.push(u,h),this},this.removeHandler=function(u){let h=l.indexOf(u);return h!==-1&&l.splice(h,2),this},this.getHandler=function(u){for(let h=0,f=l.length;h<f;h+=2){let d=l[h],g=l[h+1];if(d.global&&(d.lastIndex=0),d.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},wx=new Au,Si=class{constructor(e){this.manager=e!==void 0?e:wx,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}setPriority(e){return this.priority=e,this}setCache(e){return this.cache=e,this}abort(){return this}};Si.DEFAULT_MATERIAL_NAME="__DEFAULT";var xs={},Pd=class extends Error{constructor(e,t){super(e),this.response=t}},ws=class extends Si{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,i,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=Ki.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(xs[e]!==void 0){xs[e].push({onLoad:t,onProgress:i,onError:s});return}xs[e]=[],xs[e].push({onLoad:t,onProgress:i,onError:s});let o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",priority:this.priority,cache:this.cache,signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&Be("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;let u=xs[e],h=l.body.getReader(),f=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),d=f?parseInt(f):0,g=d!==0,x=0,p=new ReadableStream({start(m){y();function y(){h.read().then(({done:v,value:S})=>{if(v)m.close();else{x+=S.byteLength;let T=new ProgressEvent("progress",{lengthComputable:g,loaded:x,total:d});for(let M=0,_=u.length;M<_;M++){let b=u[M];b.onProgress&&b.onProgress(T)}m.enqueue(S),y()}},v=>{m.error(v)})}}});return new Response(p)}else throw new Pd(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return l.json();default:if(a==="")return l.text();{let h=/charset="?([^;"\s]*)"?/i.exec(a),f=h&&h[1]?h[1].toLowerCase():void 0,d=new TextDecoder(f);return l.arrayBuffer().then(g=>d.decode(g))}}}).then(l=>{Ki.add(`file:${e}`,l);let u=xs[e];delete xs[e];for(let h=0,f=u.length;h<f;h++){let d=u[h];d.onLoad&&d.onLoad(l)}}).catch(l=>{let u=xs[e];if(u===void 0)throw this.manager.itemError(e),l;delete xs[e];for(let h=0,f=u.length;h<f;h++){let d=u[h];d.onError&&d.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Co=new WeakMap,Ru=class extends Si{constructor(e){super(e)}load(e,t,i,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=Ki.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);else{let h=Co.get(o);h===void 0&&(h=[],Co.set(o,h)),h.push({onLoad:t,onError:s})}return o}let a=Oo("img");function c(){u(),t&&t(this);let h=Co.get(this)||[];for(let f=0;f<h.length;f++){let d=h[f];d.onLoad&&d.onLoad(this)}Co.delete(this),r.manager.itemEnd(e)}function l(h){u(),s&&s(h),Ki.remove(`image:${e}`);let f=Co.get(this)||[];for(let d=0;d<f.length;d++){let g=f[d];g.onError&&g.onError(h)}Co.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),Ki.add(`image:${e}`,a),r.manager.itemStart(e),a.fetchPriority=this.priority,a.src=e,a}};var Or=class extends Si{constructor(e){super(e)}load(e,t,i,s){let r=new dn,o=new Ru(this.manager);return o.setPriority(this.priority),o.setCache(this.cache),o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},i,s),r}},Fr=class extends kt{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new oe(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},oc=class extends Fr{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(kt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new oe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Md=new Ve,Bg=new D,kg=new D,$o=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ee(512,512),this.mapType=ri,this.map=null,this.mapPass=null,this.matrix=new Ve,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Js,this._frameExtents=new Ee(1,1),this._viewportCount=1,this._viewports=[new dt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Bg.setFromMatrixPosition(e.matrixWorld),t.position.copy(Bg),kg.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(kg),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,i,s){Md.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),i.setFromProjectionMatrix(Md,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,o=s?s.z/r.x:1,a=s?s.w/r.y:1,c=s?s.x/r.x:0,l=s?s.y/r.y:0;e.coordinateSystem===Uo||e.reversedDepth?t.set(.5*o,0,0,.5*o+c,0,.5*a,0,.5*a+l,0,0,1,0,0,0,0,1):t.set(.5*o,0,0,.5*o+c,0,.5*a,0,.5*a+l,0,0,.5,.5,0,0,0,1),t.multiply(Md)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Zl=new D,Jl=new fn,$i=new D,ac=class extends kt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ve,this.projectionMatrix=new Ve,this.projectionMatrixInverse=new Ve,this.coordinateSystem=_i,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Zl,Jl,$i),$i.x===1&&$i.y===1&&$i.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Zl,Jl,$i.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(Zl,Jl,$i),$i.x===1&&$i.y===1&&$i.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Zl,Jl,$i.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},qs=new D,zg=new Ee,Hg=new Ee,Qt=class extends ac{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Pr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Ba*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Pr*2*Math.atan(Math.tan(Ba*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){qs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(qs.x,qs.y).multiplyScalar(-e/qs.z),qs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(qs.x,qs.y).multiplyScalar(-e/qs.z)}getViewSize(e,t){return this.getViewBounds(e,zg,Hg),t.subVectors(Hg,zg)}setViewOffset(e,t,i,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Ba*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*i/l,s*=o.width/c,i*=o.height/l}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Id=class extends $o{constructor(){super(new Qt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,i=Pr*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(i!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=i,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},Br=class extends Fr{constructor(e,t,i=0,s=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(kt.DEFAULT_UP),this.updateMatrix(),this.target=new kt,this.distance=i,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new Id}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Ld=class extends $o{constructor(){super(new Qt(90,1,.5,500)),this.isPointLightShadow=!0}},cc=class extends Fr{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new Ld}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},As=class extends ac{constructor(e=-1,t=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-e,o=i+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Dd=class extends $o{constructor(){super(new As(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},kr=class extends Fr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(kt.DEFAULT_UP),this.updateMatrix(),this.target=new kt,this.shadow=new Dd}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var fi=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var bd=new WeakMap,lc=class extends Si{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Be("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Be("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,i,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=Ki.get(`image-bitmap:${e}`);if(o!==void 0){if(r.manager.itemStart(e),o.then){o.then(l=>{bd.has(o)===!0?(s&&s(bd.get(o)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(l),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);return}let a={};a.credentials=this.withCredentials||this.crossOrigin!=="anonymous"?"include":"same-origin",a.headers=this.requestHeader,a.priority=this.priority,a.cache=this.cache,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let c=fetch(e,a).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(l){return Ki.add(`image-bitmap:${e}`,l),t&&t(l),r.manager.itemEnd(e),l}).catch(function(l){s&&s(l),bd.set(c,l),Ki.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});Ki.add(`image-bitmap:${e}`,c),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Po=-90,Io=1,Ko=class extends kt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Qt(Po,Io,e,t);s.layers=this.layers,this.add(s);let r=new Qt(Po,Io,e,t);r.layers=this.layers,this.add(r);let o=new Qt(Po,Io,e,t);o.layers=this.layers,this.add(o);let a=new Qt(Po,Io,e,t);a.layers=this.layers,this.add(a);let c=new Qt(Po,Io,e,t);c.layers=this.layers,this.add(c);let l=new Qt(Po,Io,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,s,r,o,a,c]=t;for(let l of t)this.remove(l);if(e===_i)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Uo)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,u]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let x=i.texture.mipmapsAutoUpdate;i.texture.mipmapsAutoUpdate=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,2,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,3,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(i,4,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),i.texture.mipmapsAutoUpdate=x,e.setRenderTarget(i,5,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(h,f,d),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},Cu=class extends Qt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}},uc=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=_S.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function _S(){this._document.hidden===!1&&this.reset()}var ap="\\[\\]\\.:\\/",yS=new RegExp("["+ap+"]","g"),cp="[^"+ap+"]",vS="[^"+ap.replace("\\.","")+"]",SS=/((?:WC+[\/:])*)/.source.replace("WC",cp),MS=/(WCOD+)?/.source.replace("WCOD",vS),bS=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",cp),TS=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",cp),ES=new RegExp("^"+SS+MS+bS+TS+"$"),wS=["material","materials","bones","map"],Nd=class{constructor(e,t,i){let s=i||Ot.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},Ot=class n{constructor(e,t,i){this.path=t,this.parsedPath=i||n.parseTrackName(t),this.node=n.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new n.Composite(e,t,i):new n(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(yS,"")}static parseTrackName(e){let t=ES.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);wS.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let c=i(a.children);if(c)return c}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=n.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Be("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let l=t.objectIndex;switch(i){case"materials":if(!e.material){qe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){qe("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){qe("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===l){l=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){qe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){qe("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){qe("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(l!==void 0){if(e[l]===void 0){qe("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let o=e[s];if(o===void 0){let l=t.nodeName;qe("PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){qe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){qe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ot.Composite=Nd;Ot.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ot.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ot.prototype.GetterByBindingType=[Ot.prototype._getValue_direct,Ot.prototype._getValue_array,Ot.prototype._getValue_arrayElement,Ot.prototype._getValue_toArray];Ot.prototype.SetterByBindingTypeAndVersioning=[[Ot.prototype._setValue_direct,Ot.prototype._setValue_direct_setNeedsUpdate,Ot.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ot.prototype._setValue_array,Ot.prototype._setValue_array_setNeedsUpdate,Ot.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ot.prototype._setValue_arrayElement,Ot.prototype._setValue_arrayElement_setNeedsUpdate,Ot.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ot.prototype._setValue_fromArray,Ot.prototype._setValue_fromArray_setNeedsUpdate,Ot.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Qw=new Float32Array(1);var Ud=class{static{this.prototype.isMatrix2=!0}constructor(e,t,i,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=i,r[3]=s,this}};function lp(n,e,t,i){let s=AS(i);switch(t){case Yd:return n*e;case Ou:return n*e/s.components*s.byteLength;case Fu:return n*e/s.components*s.byteLength;case er:return n*e*2/s.components*s.byteLength;case Bu:return n*e*2/s.components*s.byteLength;case $d:return n*e*3/s.components*s.byteLength;case bi:return n*e*4/s.components*s.byteLength;case ku:return n*e*4/s.components*s.byteLength;case xc:case _c:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case yc:case vc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Hu:case Vu:return Math.max(n,16)*Math.max(e,8)/4;case zu:case Gu:return Math.max(n,8)*Math.max(e,8)/2;case Wu:case Xu:case Yu:case $u:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case qu:case Sc:case Ku:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Zu:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ju:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case ju:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Qu:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case eh:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case th:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case nh:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case ih:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case sh:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case rh:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case oh:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case ah:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case ch:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case lh:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case uh:case hh:case fh:return Math.ceil(n/4)*Math.ceil(e/4)*16;case dh:case ph:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Mc:case mh:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function AS(n){switch(n){case ri:case Vd:return{byteLength:1,components:1};case ta:case Wd:case pn:return{byteLength:2,components:1};case Nu:case Uu:return{byteLength:2,components:4};case ki:case Du:case di:return{byteLength:4,components:1};case Xd:case qd:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"187"}}));typeof window<"u"&&(window.__THREE__?Be("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="187");function $x(){let n=null,e=!1,t=null,i=null;function s(r,o){i=n.requestAnimationFrame(s),t(r,o)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function CS(n){let e=new WeakMap;function t(a,c){let l=a.array,u=a.usage,h=l.byteLength,f=n.createBuffer();n.bindBuffer(c,f),n.bufferData(c,l,u),a.onUploadCallback();let d;if(l instanceof Float32Array)d=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)d=n.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?d=n.HALF_FLOAT:d=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=n.SHORT;else if(l instanceof Uint32Array)d=n.UNSIGNED_INT;else if(l instanceof Int32Array)d=n.INT;else if(l instanceof Int8Array)d=n.BYTE;else if(l instanceof Uint8Array)d=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,c,l){let u=c.array,h=c.updateRanges;if(n.bindBuffer(l,a),h.length===0)n.bufferSubData(l,0,u);else{h.sort((d,g)=>d.start-g.start);let f=0;for(let d=1;d<h.length;d++){let g=h[f],x=h[d];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++f,h[f]=x)}h.length=f+1;for(let d=0,g=h.length;d<g;d++){let x=h[d];n.bufferSubData(l,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=e.get(a);c&&(n.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var PS=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,IS=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,LS=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,DS=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,NS=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,US=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,OS=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,FS=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,BS=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,kS=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,zS=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,HS=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,GS=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,VS=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,WS=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,XS=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,qS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,YS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,$S=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,KS=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,ZS=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,JS=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,jS=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,QS=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,eM=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,tM=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,nM=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,iM=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,sM=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,rM="gl_FragColor = linearToOutputTexel( gl_FragColor );",oM=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,aM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,cM=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,lM=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,uM=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,hM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fM=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,dM=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,pM=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,mM=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gM=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,xM=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,_M=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,yM=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,vM=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,SM=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,MM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,bM=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,TM=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,EM=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,wM=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,AM=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,RM=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,CM=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,PM=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,IM=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,LM=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,DM=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,NM=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,UM=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,OM=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,FM=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,BM=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,kM=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,zM=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,HM=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,GM=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,VM=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,WM=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,XM=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,qM=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,YM=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,$M=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,KM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ZM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,JM=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,jM=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,QM=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,eb=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,tb=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,nb=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,ib=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,sb=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,rb=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ob=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ab=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,cb=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,lb=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ub=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,hb=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,fb=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,db=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,pb=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,mb=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,gb=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,xb=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,_b=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,yb=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,vb=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Sb=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Mb=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,bb=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Tb=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Eb=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,wb=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Ab=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Rb=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Cb=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Pb=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ib=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Lb=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Db=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Nb=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ub=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Ob=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Fb=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Bb=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,kb=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,zb=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hb=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Gb=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Vb=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Wb=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xb=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,qb=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Yb=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,$b=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Kb=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Zb=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Jb=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,jb=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Qb=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,eT=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tT=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,nT=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,iT=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,sT=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,rT=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,oT=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,aT=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,cT=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,tt={alphahash_fragment:PS,alphahash_pars_fragment:IS,alphamap_fragment:LS,alphamap_pars_fragment:DS,alphatest_fragment:NS,alphatest_pars_fragment:US,aomap_fragment:OS,aomap_pars_fragment:FS,batching_pars_vertex:BS,batching_vertex:kS,begin_vertex:zS,beginnormal_vertex:HS,bsdfs:GS,iridescence_fragment:VS,bumpmap_pars_fragment:WS,clipping_planes_fragment:XS,clipping_planes_pars_fragment:qS,clipping_planes_pars_vertex:YS,clipping_planes_vertex:$S,color_fragment:KS,color_pars_fragment:ZS,color_pars_vertex:JS,color_vertex:jS,common:QS,defaultnormal_vertex:eM,displacementmap_pars_vertex:tM,displacementmap_vertex:nM,emissivemap_fragment:iM,emissivemap_pars_fragment:sM,colorspace_fragment:rM,colorspace_pars_fragment:oM,envmap_fragment:aM,envmap_common_pars_fragment:cM,envmap_pars_fragment:lM,envmap_pars_vertex:uM,envmap_physical_pars_fragment:SM,envmap_vertex:hM,fog_vertex:fM,fog_pars_vertex:dM,fog_fragment:pM,fog_pars_fragment:mM,gradientmap_pars_fragment:gM,lightmap_pars_fragment:xM,lights_lambert_fragment:_M,lights_lambert_pars_fragment:yM,lights_pars_begin:vM,lights_toon_fragment:MM,lights_toon_pars_fragment:bM,lights_phong_fragment:TM,lights_phong_pars_fragment:EM,lights_physical_fragment:wM,lights_physical_pars_fragment:AM,lights_fragment_begin:RM,lights_fragment_maps:CM,lights_fragment_end:PM,lightprobes_pars_fragment:IM,logdepthbuf_fragment:LM,logdepthbuf_pars_fragment:DM,logdepthbuf_pars_vertex:NM,logdepthbuf_vertex:UM,map_fragment:OM,map_pars_fragment:FM,map_particle_fragment:BM,map_particle_pars_fragment:kM,metalnessmap_fragment:zM,metalnessmap_pars_fragment:HM,morphinstance_vertex:GM,morphcolor_vertex:VM,morphnormal_vertex:WM,morphtarget_pars_vertex:XM,morphtarget_vertex:qM,normal_fragment_begin:YM,normal_fragment_maps:$M,normal_pars_fragment:KM,normal_pars_vertex:ZM,normal_vertex:JM,normalmap_pars_fragment:jM,clearcoat_normal_fragment_begin:QM,clearcoat_normal_fragment_maps:eb,clearcoat_pars_fragment:tb,iridescence_pars_fragment:nb,opaque_fragment:ib,packing:sb,premultiplied_alpha_fragment:rb,project_vertex:ob,dithering_fragment:ab,dithering_pars_fragment:cb,roughnessmap_fragment:lb,roughnessmap_pars_fragment:ub,shadowmap_pars_fragment:hb,shadowmap_pars_vertex:fb,shadowmap_vertex:db,shadowmask_pars_fragment:pb,skinbase_vertex:mb,skinning_pars_vertex:gb,skinning_vertex:xb,skinnormal_vertex:_b,specularmap_fragment:yb,specularmap_pars_fragment:vb,tonemapping_fragment:Sb,tonemapping_pars_fragment:Mb,transmission_fragment:bb,transmission_pars_fragment:Tb,uv_pars_fragment:Eb,uv_pars_vertex:wb,uv_vertex:Ab,worldpos_vertex:Rb,background_vert:Cb,background_frag:Pb,backgroundCube_vert:Ib,backgroundCube_frag:Lb,cube_vert:Db,cube_frag:Nb,depth_vert:Ub,depth_frag:Ob,distance_vert:Fb,distance_frag:Bb,equirect_vert:kb,equirect_frag:zb,linedashed_vert:Hb,linedashed_frag:Gb,meshbasic_vert:Vb,meshbasic_frag:Wb,meshlambert_vert:Xb,meshlambert_frag:qb,meshmatcap_vert:Yb,meshmatcap_frag:$b,meshnormal_vert:Kb,meshnormal_frag:Zb,meshphong_vert:Jb,meshphong_frag:jb,meshphysical_vert:Qb,meshphysical_frag:eT,meshtoon_vert:tT,meshtoon_frag:nT,points_vert:iT,points_frag:sT,shadow_vert:rT,shadow_frag:oT,sprite_vert:aT,sprite_frag:cT},be={common:{diffuse:{value:new oe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ke}},envmap:{envMap:{value:null},envMapRotation:{value:new Ke},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ke},normalScale:{value:new Ee(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new oe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new oe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0},uvTransform:{value:new Ke}},sprite:{diffuse:{value:new oe(16777215)},opacity:{value:1},center:{value:new Ee(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}}},is={basic:{uniforms:Hn([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.fog]),vertexShader:tt.meshbasic_vert,fragmentShader:tt.meshbasic_frag},lambert:{uniforms:Hn([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.fog,be.lights,{emissive:{value:new oe(0)},envMapIntensity:{value:1}}]),vertexShader:tt.meshlambert_vert,fragmentShader:tt.meshlambert_frag},phong:{uniforms:Hn([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.fog,be.lights,{emissive:{value:new oe(0)},specular:{value:new oe(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:tt.meshphong_vert,fragmentShader:tt.meshphong_frag},standard:{uniforms:Hn([be.common,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.roughnessmap,be.metalnessmap,be.fog,be.lights,{emissive:{value:new oe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:tt.meshphysical_vert,fragmentShader:tt.meshphysical_frag},toon:{uniforms:Hn([be.common,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.gradientmap,be.fog,be.lights,{emissive:{value:new oe(0)}}]),vertexShader:tt.meshtoon_vert,fragmentShader:tt.meshtoon_frag},matcap:{uniforms:Hn([be.common,be.bumpmap,be.normalmap,be.displacementmap,be.fog,{matcap:{value:null}}]),vertexShader:tt.meshmatcap_vert,fragmentShader:tt.meshmatcap_frag},points:{uniforms:Hn([be.points,be.fog]),vertexShader:tt.points_vert,fragmentShader:tt.points_frag},dashed:{uniforms:Hn([be.common,be.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:tt.linedashed_vert,fragmentShader:tt.linedashed_frag},depth:{uniforms:Hn([be.common,be.displacementmap]),vertexShader:tt.depth_vert,fragmentShader:tt.depth_frag},normal:{uniforms:Hn([be.common,be.bumpmap,be.normalmap,be.displacementmap,{opacity:{value:1}}]),vertexShader:tt.meshnormal_vert,fragmentShader:tt.meshnormal_frag},sprite:{uniforms:Hn([be.sprite,be.fog]),vertexShader:tt.sprite_vert,fragmentShader:tt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:tt.background_vert,fragmentShader:tt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ke}},vertexShader:tt.backgroundCube_vert,fragmentShader:tt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:tt.cube_vert,fragmentShader:tt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:tt.equirect_vert,fragmentShader:tt.equirect_frag},distance:{uniforms:Hn([be.common,be.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:tt.distance_vert,fragmentShader:tt.distance_frag},shadow:{uniforms:Hn([be.lights,be.fog,{color:{value:new oe(0)},opacity:{value:1}}]),vertexShader:tt.shadow_vert,fragmentShader:tt.shadow_frag}};is.physical={uniforms:Hn([is.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ke},clearcoatNormalScale:{value:new Ee(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ke},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new Ke},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ke},sheen:{value:0},sheenColor:{value:new oe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ke},transmissionSamplerSize:{value:new Ee},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ke},attenuationDistance:{value:0},attenuationColor:{value:new oe(0)},specularColor:{value:new oe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ke},anisotropyVector:{value:new Ee},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ke}}]),vertexShader:tt.meshphysical_vert,fragmentShader:tt.meshphysical_frag};var yh={r:0,b:0,g:0},lT=new Ve,Kx=new Ke;Kx.set(-1,0,0,0,1,0,0,0,1);function uT(n,e,t,i,s,r){let o=new oe(0),a=s===!0?0:1,c,l,u=null,h=0,f=null;function d(y){let v=y.isScene===!0?y.background:null;if(v&&v.isTexture){let S=y.backgroundBlurriness>0;v=e.get(v,S)}return v}function g(y){let v=!1,S=d(y);S===null?p(o,a):S&&S.isColor&&(p(S,1),v=!0);let T=n.xr.getEnvironmentBlendMode();T==="additive"?t.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(n.autoClear||v)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function x(y,v){let S=d(v);S&&S.isCubeTexture?(l===void 0&&(l=new We(new vt(1,1,1),new zt({name:"BackgroundCubeMaterial",uniforms:Yr(is.backgroundCube.uniforms),vertexShader:is.backgroundCube.vertexShader,fragmentShader:is.backgroundCube.fragmentShader,side:Pn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(T,M,_){this.matrixWorld.copyPosition(_.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(l)),l.material.uniforms.envMap.value=S,l.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(lT.makeRotationFromEuler(v.backgroundRotation)).transpose(),S.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Kx),l.material.toneMapped=et.getTransfer(S.colorSpace)!==bt,(u!==S||h!==S.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,u=S,h=S.version,f=n.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null)):S&&S.isTexture&&(c===void 0&&(c=new We(new ii(2,2),new zt({name:"BackgroundMaterial",uniforms:Yr(is.background.uniforms),vertexShader:is.background.vertexShader,fragmentShader:is.background.fragmentShader,side:Qi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=S,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=et.getTransfer(S.colorSpace)!==bt,S.matrixAutoUpdate===!0&&S.updateMatrix(),c.material.uniforms.uvTransform.value.copy(S.matrix),(u!==S||h!==S.version||f!==n.toneMapping)&&(c.material.needsUpdate=!0,u=S,h=S.version,f=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function p(y,v){y.getRGB(yh,op(n)),t.buffers.color.setClear(yh.r,yh.g,yh.b,v,r)}function m(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(y,v=1){o.set(y),a=v,p(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(y){a=y,p(o,a)},render:g,addToRenderList:x,dispose:m}}function hT(n,e){let t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=f(null),r=s,o=!1;function a(A,L,B,P,H){let K=!1,$=h(A,P,B,L);r!==$&&(r=$,l(r.object)),K=d(A,P,B,H),K&&g(A,P,B,H),H!==null&&e.update(H,n.ELEMENT_ARRAY_BUFFER),(K||o)&&(o=!1,S(A,L,B,P),H!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function c(){return n.createVertexArray()}function l(A){return n.bindVertexArray(A)}function u(A){return n.deleteVertexArray(A)}function h(A,L,B,P){let H=P.wireframe===!0,K=i[L.id];K===void 0&&(K={},i[L.id]=K);let $=A.isInstancedMesh===!0?A.id:0,X=K[$];X===void 0&&(X={},K[$]=X);let G=X[B.id];G===void 0&&(G={},X[B.id]=G);let J=G[H];return J===void 0&&(J=f(c()),G[H]=J),J}function f(A){let L=[],B=[],P=[];for(let H=0;H<t;H++)L[H]=0,B[H]=0,P[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:B,attributeDivisors:P,object:A,attributes:{},index:null}}function d(A,L,B,P){let H=r.attributes,K=L.attributes,$=0,X=B.getAttributes();for(let G in X)if(X[G].location>=0){let se=H[G],ye=K[G];if(ye===void 0&&(G==="instanceMatrix"&&A.instanceMatrix&&(ye=A.instanceMatrix),G==="instanceColor"&&A.instanceColor&&(ye=A.instanceColor)),se===void 0||se.attribute!==ye||ye&&se.data!==ye.data)return!0;$++}return r.attributesNum!==$||r.index!==P}function g(A,L,B,P){let H={},K=L.attributes,$=0,X=B.getAttributes();for(let G in X)if(X[G].location>=0){let se=K[G];se===void 0&&(G==="instanceMatrix"&&A.instanceMatrix&&(se=A.instanceMatrix),G==="instanceColor"&&A.instanceColor&&(se=A.instanceColor));let ye={};ye.attribute=se,se&&se.data&&(ye.data=se.data),H[G]=ye,$++}r.attributes=H,r.attributesNum=$,r.index=P}function x(){let A=r.newAttributes;for(let L=0,B=A.length;L<B;L++)A[L]=0}function p(A){m(A,0)}function m(A,L){let B=r.newAttributes,P=r.enabledAttributes,H=r.attributeDivisors;B[A]=1,P[A]===0&&(n.enableVertexAttribArray(A),P[A]=1),H[A]!==L&&(n.vertexAttribDivisor(A,L),H[A]=L)}function y(){let A=r.newAttributes,L=r.enabledAttributes;for(let B=0,P=L.length;B<P;B++)L[B]!==A[B]&&(n.disableVertexAttribArray(B),L[B]=0)}function v(A,L,B,P,H,K,$){$===!0?n.vertexAttribIPointer(A,L,B,H,K):n.vertexAttribPointer(A,L,B,P,H,K)}function S(A,L,B,P){x();let H=P.attributes,K=B.getAttributes(),$=L.defaultAttributeValues;for(let X in K){let G=K[X];if(G.location>=0){let J=H[X];if(J===void 0&&(X==="instanceMatrix"&&A.instanceMatrix&&(J=A.instanceMatrix),X==="instanceColor"&&A.instanceColor&&(J=A.instanceColor)),J!==void 0){let se=J.normalized,ye=J.itemSize,Le=e.get(J);if(Le===void 0)continue;let j=Le.buffer,N=Le.type,U=Le.bytesPerElement,W=N===n.INT||N===n.UNSIGNED_INT||J.gpuType===Du;if(J.isInterleavedBufferAttribute){let k=J.data,ee=k.isInterleavedBuffer===!0?k.stride:k.itemSize,le=J.offset;if(k.isInstancedInterleavedBuffer||k.isInstancedBufferAttribute){for(let ae=0;ae<G.locationSize;ae++)m(G.location+ae,k.meshPerAttribute);A.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=k.meshPerAttribute*k.count)}else for(let ae=0;ae<G.locationSize;ae++)p(G.location+ae);n.bindBuffer(n.ARRAY_BUFFER,j);for(let ae=0;ae<G.locationSize;ae++)v(G.location+ae,ye/G.locationSize,N,se,ee*U,(le+ye/G.locationSize*ae)*U,W)}else{if(J.isInstancedBufferAttribute){for(let k=0;k<G.locationSize;k++)m(G.location+k,J.meshPerAttribute);A.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let k=0;k<G.locationSize;k++)p(G.location+k);n.bindBuffer(n.ARRAY_BUFFER,j);for(let k=0;k<G.locationSize;k++)v(G.location+k,ye/G.locationSize,N,se,ye*U,ye/G.locationSize*k*U,W)}}else if($!==void 0){let se=$[X];if(se!==void 0)switch(se.length){case 2:n.vertexAttrib2fv(G.location,se);break;case 3:n.vertexAttrib3fv(G.location,se);break;case 4:n.vertexAttrib4fv(G.location,se);break;default:n.vertexAttrib1fv(G.location,se)}}}}y()}function T(){R();for(let A in i){let L=i[A];for(let B in L){let P=L[B];for(let H in P){let K=P[H];for(let $ in K)u(K[$].object),delete K[$];delete P[H]}}delete i[A]}}function M(A){if(i[A.id]===void 0)return;let L=i[A.id];for(let B in L){let P=L[B];for(let H in P){let K=P[H];for(let $ in K)u(K[$].object),delete K[$];delete P[H]}}delete i[A.id]}function _(A){for(let L in i){let B=i[L];for(let P in B){let H=B[P];if(H[A.id]===void 0)continue;let K=H[A.id];for(let $ in K)u(K[$].object),delete K[$];delete H[A.id]}}}function b(A){for(let L in i){let B=i[L],P=A.isInstancedMesh===!0?A.id:0,H=B[P];if(H!==void 0){for(let K in H){let $=H[K];for(let X in $)u($[X].object),delete $[X];delete H[K]}delete B[P],Object.keys(B).length===0&&delete i[L]}}}function R(){I(),o=!0,r!==s&&(r=s,l(r.object))}function I(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:R,resetDefaultState:I,dispose:T,releaseStatesOfGeometry:M,releaseStatesOfObject:b,releaseStatesOfProgram:_,initAttributes:x,enableAttribute:p,disableUnusedAttributes:y}}function fT(n,e,t){let i;function s(c){i=c}function r(c,l){n.drawArrays(i,c,l),t.update(l,i,1)}function o(c,l,u){u!==0&&(n.drawArraysInstanced(i,c,l,u),t.update(l,i,u))}function a(c,l,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,l,0,u);let f=0;for(let d=0;d<u;d++)f+=l[d];t.update(f,i,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function dT(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let _=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(_.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(_){return!(_!==bi&&i.convert(_)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(_){let b=_===pn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(_!==ri&&_!==di&&!b&&i.convert(_)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function c(_){if(_==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";_="mediump"}return _==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",u=c(l);u!==l&&(Be("WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);let h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=t.logarithmicDepthBuffer===!0&&h===!1;t.reversedDepthBuffer===!0&&h===!1&&Be("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&h===!0&&Be("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");let d=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_TEXTURE_SIZE),p=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),m=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),S=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),T=n.getParameter(n.MAX_SAMPLES),M=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:f,reversedDepthBuffer:h,maxTextures:d,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:y,maxVaryings:v,maxFragmentUniforms:S,maxSamples:T,samples:M}}function pT(n){let e=this,t=null,i=0,s=!1,r=!1,o=new Oi,a=new Ke,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){let d=h.length!==0||f||i!==0||s;return s=f,i=h.length,d},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,f){t=u(h,f,0)},this.setState=function(h,f,d){let g=h.clippingPlanes,x=h.clipIntersection,p=h.clipShadows,m=n.get(h);if(!s||g===null||g.length===0||r&&!p)r?u(null):l();else{let y=r?0:i,v=y*4,S=m.clippingState||null;c.value=S,S=u(g,f,v,d);for(let T=0;T!==v;++T)S[T]=t[T];m.clippingState=S,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=y}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,f,d,g){let x=h!==null?h.length:0,p=null;if(x!==0){if(p=c.value,g!==!0||p===null){let m=d+x*4,y=f.matrixWorldInverse;a.getNormalMatrix(y),(p===null||p.length<m)&&(p=new Float32Array(m));for(let v=0,S=d;v!==x;++v,S+=4)o.copy(h[v]).applyMatrix4(y,a),o.normal.toArray(p,S),p[S+3]=o.constant}c.value=p,c.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,p}}var wc=class extends tn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new ja(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new vt(5,5,5),r=new zt({name:"CubemapFromEquirect",uniforms:Yr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Pn,blending:Rs});r.uniforms.tEquirect.value=t;let o=new We(s,r),a=t.minFilter;return t.minFilter===Mi&&(t.minFilter=hn),new Ko(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,s);e.setRenderTarget(r)}},Ax=256,mT=3,gT=20,Zx=256,Jx=16,xT=3,_T=new D,yT=new oe,sa=class n{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Ko(1,10,null),this._boxMesh=new We(new vt(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){let{size:o=256,position:a=_T}=r,c=this._renderer;this._setSize(o);let l=this._allocateTarget(),u=this._getSourceTarget(!0);t>0&&(u.texture.mipmapsAutoUpdate=!1);let h=c.autoClear,f=c.autoClearColor,d=c.autoClearDepth,g=c.autoClearStencil,x=e.background;c.autoClear=!0,c.autoClearColor=!0,c.autoClearDepth=!0,c.autoClearStencil=!0,x===null&&(e.background=c.getClearColor(yT));let p=new Ko(i,s,u);return p.position.copy(a),p.update(c,e),c.autoClear=h,c.autoClearColor=f,c.autoClearDepth=d,c.autoClearStencil=g,e.background=x,t>0&&(u.texture.mipmapsAutoUpdate=!0,this._blur(l,t)),this._applyPMREM(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Px(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Cx(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(Ax,np(e))}_fromTexture(e,t){e.mapping===Vr||e.mapping===Qo?this._setSize(e.image.length===0?Ax:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);let i=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(i),i}_allocateTarget(){let e=this._cubeSize,t=Rx(e,!1,!1),i=Math.log2(e)-mT;for(let s=0;s<=i;s++)t.texture.mipmaps.push({width:e>>s,height:e>>s});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){let t=this._cubeSize,i=this._sourceTarget;return(i===null||i.width!==t||e&&i.depthBuffer===!1)&&(i!==null&&i.dispose(),this._sourceTarget=Rx(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,i){let s=this._boxMesh,r=this._cubeCamera;s.material=i,r.renderTarget=e,r.activeMipmapLevel=t;let o=e.width>>t;e.viewport.set(0,0,o,o),r.update(this._renderer,s),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===Vr||e.mapping===Qo?(this._cubemapMaterial===null&&(this._cubemapMaterial=Px()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=Cx()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=vT(),this._integrationMaterial=ST());let t=this._cubeSize,i=e.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;let r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(t/Jx);for(let o=0;o<=i;o++){let a=n.lodToRoughness(o,i);if(o>i-xT)r.roughness.value=a,this._renderCube(e,o,this._integrationMaterial);else{let c=a>0?Math.log2(t)+.5*Math.log2(6/(Zx*Math.pow(a,4)))+.5:0;s.roughness.value=a,s.lodBias.value=c,this._renderCube(e,o,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=MT());let i=this._blurMaterial,s=i.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(e,0,i),s.envMap.value=e.texture,this._renderCube(r,0,i)}};function Rx(n,e,t){return new wc(n,{minFilter:Mi,generateMipmaps:e,type:pn,colorSpace:Cn,depthBuffer:t})}function Ac(n,e,t){return new zt({name:n,uniforms:e,vertexShader:tt.cube_vert,fragmentShader:t,side:Pn,blending:Rs,depthTest:!1,depthWrite:!1})}function vT(){return Ac("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Zx}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function ST(){return Ac("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Jx}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function MT(){return Ac("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${gT}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function Cx(){return Ac("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function Px(){return Ac("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function bT(n){let e=new WeakMap,t=new WeakMap,i=null;function s(f,d=!1){return f==null?null:d?o(f):r(f)}function r(f){if(f&&f.isTexture){let d=f.mapping;if(d===Pu||d===Iu)if(e.has(f)){let g=e.get(f).texture;return a(g,f.mapping)}else{let g=f.image;if(g&&g.height>0){let x=new wc(g.height);return x.fromEquirectangularTexture(n,f),e.set(f,x),f.addEventListener("dispose",l),a(x.texture,f.mapping)}else return null}}return f}function o(f){if(f&&f.isTexture&&f.isPMREMTexture!==!0){let d=f.mapping,g=d===Pu||d===Iu,x=d===Vr||d===Qo;if(g||x){let p=t.get(f),m=p!==void 0?p.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==m)return i===null&&(i=new sa(n)),p=g?i.fromEquirectangular(f,p):i.fromCubemap(f,p),p.texture.pmremVersion=f.pmremVersion,t.set(f,p),p.texture;if(p!==void 0)return p.texture;{let y=f.image;return g&&y&&y.height>0||x&&y&&c(y)?(i===null&&(i=new sa(n)),p=g?i.fromEquirectangular(f):i.fromCubemap(f),p.texture.pmremVersion=f.pmremVersion,t.set(f,p),f.addEventListener("dispose",u),p.texture):null}}}return f}function a(f,d){return d===Pu?f.mapping=Vr:d===Iu&&(f.mapping=Qo),f}function c(f){let d=0,g=6;for(let x=0;x<g;x++)f[x]!==void 0&&d++;return d===g}function l(f){let d=f.target;d.removeEventListener("dispose",l);let g=e.get(d);g!==void 0&&(e.delete(d),g.dispose())}function u(f){let d=f.target;d.removeEventListener("dispose",u);let g=t.get(d);g!==void 0&&(t.delete(d),g.dispose())}function h(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:h}}function TT(n){let e={};function t(i){if(e[i]!==void 0)return e[i];let s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let s=t(i);return s===null&&Ar("WebGLRenderer: "+i+" extension not supported."),s}}}function ET(n,e,t,i){let s={},r=new WeakMap,o=new FinalizationRegistry(g=>delete s[g]);function a(g){c(g.target)}function c(g){g.index!==null&&e.remove(g.index);for(let p in g.attributes)e.remove(g.attributes[p]);g.removeEventListener("dispose",a),delete s[g.id],o.unregister(g);let x=r.get(g);x&&(e.remove(x),r.delete(g)),i.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,t.memory.geometries--}function l(g,x){return s[x.id]!==void 0||(x.addEventListener("dispose",a),s[x.id]=new WeakRef(x),o.register(x,x.id,x),t.memory.geometries++),x}function u(g){let x=g.attributes;for(let p in x)e.update(x[p],n.ARRAY_BUFFER)}function h(g){let x=g.index,p=g.attributes.position,m=0;if(p===void 0)return;let y=x!==null?x.array.length:p.array.length/3-1,v=p.count>=65535?$a:Ya,S=new v(Math.ceil(y/3)*6,1),T=S.array;if(x!==null){let _=x.array;m=x.version;for(let b=0,R=0;b<y;b+=3){let I=_[b+0],A=_[b+1],L=_[b+2];T[R++]=I,T[R++]=A,T[R++]=A,T[R++]=L,T[R++]=L,T[R++]=I}}else{m=p.version;for(let _=0,b=0;_<y;_+=3){let R=_+0,I=_+1,A=_+2;T[b++]=R,T[b++]=I,T[b++]=I,T[b++]=A,T[b++]=A,T[b++]=R}}S.version=m;let M=r.get(g);M&&e.remove(M),r.set(g,S)}function f(g){let x=r.get(g);if(x){let p=g.index;p!==null&&x.version<p.version&&h(g)}else h(g);return r.get(g)}function d(){for(let g in s){let x=s[g].deref();x!==void 0&&c(x)}}return{get:l,update:u,getWireframeAttribute:f,dispose:d}}function wT(n,e,t){let i;function s(h){i=h}let r,o;function a(h){r=h.type,o=h.bytesPerElement}function c(h,f){n.drawElements(i,f,r,h*o),t.update(f,i,1)}function l(h,f,d){d!==0&&(n.drawElementsInstanced(i,f,r,h*o,d),t.update(f,i,d))}function u(h,f,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,r,h,0,d);let x=0;for(let p=0;p<d;p++)x+=f[p];t.update(x,i,1)}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function AT(n){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(r/3);break;case n.LINES:t.lines+=a*(r/2);break;case n.LINE_STRIP:t.lines+=a*(r-1);break;case n.LINE_LOOP:t.lines+=a*r;break;case n.POINTS:t.points+=a*r;break;default:qe("WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function RT(n,e,t){let i=new WeakMap,s=new dt;function r(o,a,c){let l=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0,f=i.get(a);if(f===void 0||f.count!==h){let R=function(){_.dispose(),i.delete(a),a.removeEventListener("dispose",R)};f!==void 0&&f.texture.dispose();let d=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],y=a.morphAttributes.color||[],v=0;d===!0&&(v=1),g===!0&&(v=2),x===!0&&(v=3);let S=a.attributes.position.count*v,T=1;S>e.maxTextureSize&&(T=Math.ceil(S/e.maxTextureSize),S=e.maxTextureSize);let M=new Float32Array(S*T*4*h),_=new Wa(M,S,T,h);_.type=di,_.needsUpdate=!0;let b=v*4;for(let I=0;I<h;I++){let A=p[I],L=m[I],B=y[I],P=S*T*4*I;for(let H=0;H<A.count;H++){let K=H*b;d===!0&&(s.fromBufferAttribute(A,H),M[P+K+0]=s.x,M[P+K+1]=s.y,M[P+K+2]=s.z,M[P+K+3]=0),g===!0&&(s.fromBufferAttribute(L,H),M[P+K+4]=s.x,M[P+K+5]=s.y,M[P+K+6]=s.z,M[P+K+7]=0),x===!0&&(s.fromBufferAttribute(B,H),M[P+K+8]=s.x,M[P+K+9]=s.y,M[P+K+10]=s.z,M[P+K+11]=B.itemSize===4?s.w:1)}}f={count:h,texture:_,size:new Ee(S,T)},i.set(a,f),a.addEventListener("dispose",R)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let d=0;for(let x=0;x<l.length;x++)d+=l[x];let g=a.morphTargetsRelative?1:1-d;c.getUniforms().setValue(n,"morphTargetBaseInfluence",g),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:r}}function CT(n,e,t,i,s){let r=new WeakMap;function o(l){let u=s.render.frame,h=l.geometry,f=e.get(l,h);if(r.get(f)!==u&&(e.update(f),r.set(f,u)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==u&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,u))),l.isSkinnedMesh){let d=l.skeleton;r.get(d)!==u&&(d.update(),r.set(d,u))}return f}function a(){r=new WeakMap}function c(l){let u=l.target;u.removeEventListener("dispose",c),i.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:o,dispose:a}}var PT={[hc]:"LINEAR_TONE_MAPPING",[fc]:"REINHARD_TONE_MAPPING",[dc]:"CINEON_TONE_MAPPING",[pc]:"ACES_FILMIC_TONE_MAPPING",[Gr]:"AGX_TONE_MAPPING",[gc]:"NEUTRAL_TONE_MAPPING",[mc]:"CUSTOM_TONE_MAPPING"};function IT(n,e,t,i,s,r){let o=new tn(e,t,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,c=null,l=null,u=new mt;u.setAttribute("position",new st([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute("uv",new st([0,2,0,0,2,0],2));let h=new Yo({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new We(u,h),d=new As(-1,1,1,-1,0,1),g=null,x=null,p=!1,m,y=null,v=[],S=!1;this.setSize=function(T,M){o.setSize(T,M),a!==null&&a.setSize(T,M),c!==null&&c.setSize(T,M);for(let _=0;_<v.length;_++){let b=v[_];b.setSize&&b.setSize(T,M)}},this.setEffects=function(T){v=T,S=v.length>0&&v[0].isRenderPass===!0;let M=o.width,_=o.height;v.length>0&&a===null&&(a=new tn(M,_,{type:pn,depthBuffer:!1,stencilBuffer:!1}),c=new tn(M,_,{type:pn,depthBuffer:!1,stencilBuffer:!1}));let b=s===!0&&v.some(R=>R.needsDepthTexture===!0);b!==(o.depthTexture!==null)&&(b===!0&&l===null&&(l=new Ss(M,_),r===!0&&(l.format=Cs,l.type=Xr)),o.dispose(),o.depthTexture=b?l:null,o.resolveDepthBuffer=b,o.storeMultisampledDepthBuffer=b);for(let R=0;R<v.length;R++){let I=v[R];I.setSize&&I.setSize(M,_),b&&I.needsDepthTexture===!0&&I.setDepthTexture&&I.setDepthTexture(l)}},this.begin=function(T,M){if(p||T.toneMapping===es&&v.length===0)return!1;if(y=M,M!==null){let _=M.width,b=M.height;(o.width!==_||o.height!==b)&&this.setSize(_,b)}return S===!1&&T.setRenderTarget(o),m=T.toneMapping,T.toneMapping=es,!0},this.hasRenderPass=function(){return S},this.end=function(T,M){T.toneMapping=m,p=!0;let _=o,b=a;for(let R=0;R<v.length;R++){let I=v[R];I.enabled!==!1&&(I.render(T,b,_,M),I.needsSwap!==!1&&(_=b,b=b===a?c:a))}if(g!==T.outputColorSpace||x!==T.toneMapping){g=T.outputColorSpace,x=T.toneMapping,h.defines={},et.getTransfer(g)===bt&&(h.defines.SRGB_TRANSFER="");let R=PT[x];R&&(h.defines[R]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=_.texture,T.setRenderTarget(y),T.render(f,d),y=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),c!==null&&c.dispose(),u.dispose(),h.dispose()}}var jx=new dn,Qx=new Ss(1,1),e_=new Qa(1),t_=new Wa,n_=new lu,i_=new ja,Ix=[],Lx=[],Dx=new Float32Array(16),Nx=new Float32Array(9),Ux=new Float32Array(4);function ra(n,e,t){let i=n[0];if(i<=0||i>0)return n;let s=e*t,r=Ix[s];if(r===void 0&&(r=new Float32Array(s),Ix[s]=r),e!==0){i.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(r,a)}return r}function mn(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function gn(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Mh(n,e){let t=Lx[e];t===void 0&&(t=new Int32Array(e),Lx[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function LT(n,e){let t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function DT(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(mn(t,e))return;n.uniform2fv(this.addr,e),gn(t,e)}}function NT(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(mn(t,e))return;n.uniform3fv(this.addr,e),gn(t,e)}}function UT(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(mn(t,e))return;n.uniform4fv(this.addr,e),gn(t,e)}}function OT(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(mn(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),gn(t,e)}else{if(mn(t,i))return;Ux.set(i),n.uniformMatrix2fv(this.addr,!1,Ux),gn(t,i)}}function FT(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(mn(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),gn(t,e)}else{if(mn(t,i))return;Nx.set(i),n.uniformMatrix3fv(this.addr,!1,Nx),gn(t,i)}}function BT(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(mn(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),gn(t,e)}else{if(mn(t,i))return;Dx.set(i),n.uniformMatrix4fv(this.addr,!1,Dx),gn(t,i)}}function kT(n,e){let t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function zT(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(mn(t,e))return;n.uniform2iv(this.addr,e),gn(t,e)}}function HT(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(mn(t,e))return;n.uniform3iv(this.addr,e),gn(t,e)}}function GT(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(mn(t,e))return;n.uniform4iv(this.addr,e),gn(t,e)}}function VT(n,e){let t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function WT(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(mn(t,e))return;n.uniform2uiv(this.addr,e),gn(t,e)}}function XT(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(mn(t,e))return;n.uniform3uiv(this.addr,e),gn(t,e)}}function qT(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(mn(t,e))return;n.uniform4uiv(this.addr,e),gn(t,e)}}function bh(n){return n.version===0&&(n.compareFunction=jd,n.needsUpdate=!0),n}function YT(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?r=bh(Qx):r=jx,t.setTexture2D(e||r,s)}function $T(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||n_,s)}function KT(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_CUBE_SHADOW?r=bh(e_):r=i_,t.setTextureCube(e||r,s)}function ZT(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||t_,s)}function JT(n){switch(n){case 5126:return LT;case 35664:return DT;case 35665:return NT;case 35666:return UT;case 35674:return OT;case 35675:return FT;case 35676:return BT;case 5124:case 35670:return kT;case 35667:case 35671:return zT;case 35668:case 35672:return HT;case 35669:case 35673:return GT;case 5125:return VT;case 36294:return WT;case 36295:return XT;case 36296:return qT;case 35678:case 36198:case 36298:case 36306:case 35682:return YT;case 35679:case 36299:case 36307:return $T;case 35680:case 36300:case 36308:case 36293:return KT;case 36289:case 36303:case 36311:case 36292:return ZT}}function jT(n,e){n.uniform1fv(this.addr,e)}function QT(n,e){let t=ra(e,this.size,2);n.uniform2fv(this.addr,t)}function e1(n,e){let t=ra(e,this.size,3);n.uniform3fv(this.addr,t)}function t1(n,e){let t=ra(e,this.size,4);n.uniform4fv(this.addr,t)}function n1(n,e){let t=ra(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function i1(n,e){let t=ra(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function s1(n,e){let t=ra(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function r1(n,e){n.uniform1iv(this.addr,e)}function o1(n,e){n.uniform2iv(this.addr,e)}function a1(n,e){n.uniform3iv(this.addr,e)}function c1(n,e){n.uniform4iv(this.addr,e)}function l1(n,e){n.uniform1uiv(this.addr,e)}function u1(n,e){n.uniform2uiv(this.addr,e)}function h1(n,e){n.uniform3uiv(this.addr,e)}function f1(n,e){n.uniform4uiv(this.addr,e)}function d1(n,e,t){let i=this.cache,s=e.length,r=Mh(t,s);mn(i,r)||(n.uniform1iv(this.addr,r),gn(i,r));let o;this.type===n.SAMPLER_2D_SHADOW?o=bh(Qx):o=jx;for(let a=0;a!==s;++a)t.setTexture2D(e[a]||o,r[a])}function p1(n,e,t){let i=this.cache,s=e.length,r=Mh(t,s);mn(i,r)||(n.uniform1iv(this.addr,r),gn(i,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||n_,r[o])}function m1(n,e,t){let i=this.cache,s=e.length,r=Mh(t,s);mn(i,r)||(n.uniform1iv(this.addr,r),gn(i,r));let o;this.type===n.SAMPLER_CUBE_SHADOW?o=bh(e_):o=i_;for(let a=0;a!==s;++a)t.setTextureCube(e[a]||o,r[a])}function g1(n,e,t){let i=this.cache,s=e.length,r=Mh(t,s);mn(i,r)||(n.uniform1iv(this.addr,r),gn(i,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||t_,r[o])}function x1(n){switch(n){case 5126:return jT;case 35664:return QT;case 35665:return e1;case 35666:return t1;case 35674:return n1;case 35675:return i1;case 35676:return s1;case 5124:case 35670:return r1;case 35667:case 35671:return o1;case 35668:case 35672:return a1;case 35669:case 35673:return c1;case 5125:return l1;case 36294:return u1;case 36295:return h1;case 36296:return f1;case 35678:case 36198:case 36298:case 36306:case 35682:return d1;case 35679:case 36299:case 36307:return p1;case 35680:case 36300:case 36308:case 36293:return m1;case 36289:case 36303:case 36311:case 36292:return g1}}var fp=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=JT(t.type)}},dp=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=x1(t.type)}},pp=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],i)}}},up=/(\w+)(\])?(\[|\.)?/g;function Ox(n,e){n.seq.push(e),n.map[e.id]=e}function _1(n,e,t){let i=n.name,s=i.length;for(up.lastIndex=0;;){let r=up.exec(i),o=up.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){Ox(t,l===void 0?new fp(a,n,e):new dp(a,n,e));break}else{let h=t.map[a];h===void 0&&(h=new pp(a),Ox(t,h)),t=h}}}var ia=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){let a=e.getActiveUniform(t,o),c=e.getUniformLocation(t,a.name);_1(a,c,this)}let s=[],r=[];for(let o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){let r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){let s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],c=i[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){let i=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&i.push(o)}return i}};function Fx(n,e,t){let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}var y1=37297,v1=0;function S1(n,e){let t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}var Bx=new Ke;function M1(n){et._getMatrix(Bx,et.workingColorSpace,n);let e=`mat3( ${Bx.elements.map(t=>t.toFixed(4))} )`;switch(et.getTransfer(n)){case Ga:return[e,"LinearTransferOETF"];case bt:return[e,"sRGBTransferOETF"];default:return Be("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function kx(n,e,t){let i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+S1(n.getShaderSource(e),a)}else return r}function b1(n,e){let t=M1(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}var T1={[hc]:"Linear",[fc]:"Reinhard",[dc]:"Cineon",[pc]:"ACESFilmic",[Gr]:"AgX",[gc]:"Neutral",[mc]:"Custom"};function E1(n,e){let t=T1[e];return t===void 0?(Be("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var vh=new D;function w1(){et.getLuminanceCoefficients(vh);let n=vh.x.toFixed(4),e=vh.y.toFixed(4),t=vh.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function A1(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ec).join(`
`)}function R1(n){let e=[];for(let t in n){let i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function C1(n,e){let t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(e,s),o=r.name,a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function Ec(n){return n!==""}function zx(n,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function Hx(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var P1=/^[ \t]*#include +<([\w\d./]+)>/gm;function mp(n){return n.replace(P1,I1)}function I1(n,e){let t=tt[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return mp(t)}var L1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Gx(n){return n.replace(L1,D1)}function D1(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Vx(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var N1={[zr]:"SHADOWMAP_TYPE_PCF",[Jo]:"SHADOWMAP_TYPE_VSM"};function U1(n){return N1[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var O1={[Qo]:"ENVMAP_MODE_REFRACTION"};function F1(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":O1[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}var B1={[Hd]:"ENVMAP_BLENDING_MULTIPLY",[cx]:"ENVMAP_BLENDING_MIX",[lx]:"ENVMAP_BLENDING_ADD"};function k1(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":B1[n.combine]||"ENVMAP_BLENDING_NONE"}function z1(n,e,t,i){let s=n.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,c=U1(t),l=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",u=F1(t),h=k1(t),f=A1(t),d=R1(r),g=s.createProgram(),x,p,m=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(x=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d].filter(Ec).join(`
`),x.length>0&&(x+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d].filter(Ec).join(`
`),p.length>0&&(p+=`
`)):(x=[Vx(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ec).join(`
`),p=[Vx(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==es?"#define TONE_MAPPING":"",t.toneMapping!==es?tt.tonemapping_pars_fragment:"",t.toneMapping!==es?E1("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",tt.colorspace_pars_fragment,b1("linearToOutputTexel",t.outputColorSpace),w1(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ec).join(`
`)),o=mp(o),o=zx(o,t),o=Hx(o,t),a=mp(a),a=zx(a,t),a=Hx(a,t),o=Gx(o),a=Gx(a),t.isRawShaderMaterial!==!0&&(m=`#version 300 es
`,x=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,p=["#define varying in",t.glslVersion===ep?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ep?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let y=m+x+o,v=m+p+a,S=Fx(s,s.VERTEX_SHADER,y),T=Fx(s,s.FRAGMENT_SHADER,v);s.attachShader(g,S),s.attachShader(g,T),t.index0AttributeName!==void 0?s.bindAttribLocation(g,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(g,0,"position"),s.linkProgram(g);function M(I){if(n.debug.checkShaderErrors){let A=s.getProgramInfoLog(g)||"",L=s.getShaderInfoLog(S)||"",B=s.getShaderInfoLog(T)||"",P=A.trim(),H=L.trim(),K=B.trim(),$=!0,X=!0;if(s.getProgramParameter(g,s.LINK_STATUS)===!1)if($=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,g,S,T);else{let G=kx(s,S,"vertex"),J=kx(s,T,"fragment");qe("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(g,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+P+`
`+G+`
`+J)}else P!==""?Be("WebGLProgram: Program Info Log:",P):(H===""||K==="")&&(X=!1);X&&(I.diagnostics={runnable:$,programLog:P,vertexShader:{log:H,prefix:x},fragmentShader:{log:K,prefix:p}})}s.deleteShader(S),s.deleteShader(T),_=new ia(s,g),b=C1(s,g)}let _;this.getUniforms=function(){return _===void 0&&M(this),_};let b;this.getAttributes=function(){return b===void 0&&M(this),b};let R=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=s.getProgramParameter(g,y1)),R},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(g),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=v1++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=S,this.fragmentShader=T,this}var H1=0,gp=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new xp(e),t.set(e,i)),i}},xp=class{constructor(e){this.id=H1++,this.code=e,this.usedTimes=0}};function G1(n){return n===er||n===Sc||n===Mc}function V1(n,e,t,i,s,r){let o=new Xa,a=new gp,c=new Set,l=[],u=new Map,h=i.logarithmicDepthBuffer,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function d(_){return c.add(_),_===0?"uv":`uv${_}`}function g(_,b,R,I,A,L){let B=I.fog,P=A.geometry,H=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?I.environment:null,K=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,$=e.get(_.envMap||H,K),X=f[_.type],G=i.precision;_.precision!==null&&(G=i.getMaxPrecision(_.precision),G!==_.precision&&Be("WebGLProgram.getParameters:",_.precision,"not supported, using",G,"instead."));let J=P.morphAttributes.position||P.morphAttributes.normal||P.morphAttributes.color,se=J!==void 0?J.length:0,ye=0;P.morphAttributes.position!==void 0&&(ye=1),P.morphAttributes.normal!==void 0&&(ye=2),P.morphAttributes.color!==void 0&&(ye=3);let Le,j,N,U;if(X){let Te=is[X];Le=Te.vertexShader,j=Te.fragmentShader}else{Le=_.vertexShader,j=_.fragmentShader;let Te=a.getVertexShaderStage(_),It=a.getFragmentShaderStage(_);a.update(_,Te,It),N=Te.id,U=It.id}let W=n.getRenderTarget(),k=n.state.buffers.depth.getReversed(),ee=A.isInstancedMesh===!0,le=A.isBatchedMesh===!0,ae=!!_.map,Ie=!!_.matcap,Ce=!!$,Ae=Ce&&$.isPMREMTexture===!0,Ze=!!_.aoMap,pt=!!_.lightMap,Dt=!!_.bumpMap&&_.wireframe===!1,ft=!!_.normalMap,Ln=!!_.displacementMap,Ct=!!_.emissiveMap,ln=!!_.metalnessMap,Dn=!!_.roughnessMap,Nn=_.anisotropy>0,z=_.clearcoat>0,gi=_.diffuseRoughness>0,Vt=_.dispersion>0,Wt=_.retroreflectivity>0,Me=_.iridescence>0,un=_.sheen>0,He=_.transmission>0,Je=Nn&&!!_.anisotropyMap,C=z&&!!_.clearcoatMap,E=z&&!!_.clearcoatNormalMap,q=z&&!!_.clearcoatRoughnessMap,ue=gi&&!!_.diffuseRoughnessMap,re=Me&&!!_.iridescenceMap,de=Me&&!!_.iridescenceThicknessMap,ve=un&&!!_.sheenColorMap,te=un&&!!_.sheenRoughnessMap,ne=!!_.specularMap,me=!!_.specularColorMap,O=!!_.specularIntensityMap,ie=He&&!!_.transmissionMap,Q=He&&!!_.thicknessMap,ge=!!_.gradientMap,fe=!!_.alphaMap,pe=_.alphaTest>0,ke=!!_.alphaHash,it=!!_.extensions,he=es;_.toneMapped&&(W===null||W.isXRRenderTarget===!0)&&(he=n.toneMapping);let ze=Ae?$.isCompressedCubeTexture?$.image[0].mipmaps:$.mipmaps:null,nt={shaderID:X,shaderType:_.type,shaderName:_.name,vertexShader:Le,fragmentShader:j,defines:_.defines,customVertexShaderID:N,customFragmentShaderID:U,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:G,batching:le,batchingColor:le&&A._colorsTexture!==null,instancing:ee,instancingColor:ee&&A.instanceColor!==null,instancingMorph:ee&&A.morphTexture!==null,outputColorSpace:W===null?n.outputColorSpace:W.isXRRenderTarget===!0?W.texture.colorSpace:et.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:ae,matcap:Ie,envMap:Ce,envMapMode:Ce&&$.mapping,envMapPMREM:Ae,envMapMaxLod:Ae?ze.length-1:null,envMapSize:Ae?ze[0].width:null,aoMap:Ze,lightMap:pt,bumpMap:Dt,normalMap:ft,displacementMap:Ln,emissiveMap:Ct,normalMapObjectSpace:ft&&_.normalMapType===dx,normalMapTangentSpace:ft&&_.normalMapType===gh,packedNormalMap:ft&&_.normalMapType===gh&&G1(_.normalMap.format),metalnessMap:ln,roughnessMap:Dn,anisotropy:Nn,anisotropyMap:Je,clearcoat:z,clearcoatMap:C,clearcoatNormalMap:E,clearcoatRoughnessMap:q,diffuseRoughness:gi,diffuseRoughnessMap:ue,dispersion:Vt,retroreflection:Wt,iridescence:Me,iridescenceMap:re,iridescenceThicknessMap:de,sheen:un,sheenColorMap:ve,sheenRoughnessMap:te,specularMap:ne,specularColorMap:me,specularIntensityMap:O,transmission:He,transmissionMap:ie,thicknessMap:Q,gradientMap:ge,opaque:_.transparent===!1&&_.blending===jo&&_.alphaToCoverage===!1,alphaMap:fe,alphaTest:pe,alphaHash:ke,combine:_.combine,mapUv:ae&&d(_.map.channel),aoMapUv:Ze&&d(_.aoMap.channel),lightMapUv:pt&&d(_.lightMap.channel),bumpMapUv:Dt&&d(_.bumpMap.channel),normalMapUv:ft&&d(_.normalMap.channel),displacementMapUv:Ln&&d(_.displacementMap.channel),emissiveMapUv:Ct&&d(_.emissiveMap.channel),metalnessMapUv:ln&&d(_.metalnessMap.channel),roughnessMapUv:Dn&&d(_.roughnessMap.channel),anisotropyMapUv:Je&&d(_.anisotropyMap.channel),clearcoatMapUv:C&&d(_.clearcoatMap.channel),clearcoatNormalMapUv:E&&d(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:q&&d(_.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:ue&&d(_.diffuseRoughnessMap.channel),iridescenceMapUv:re&&d(_.iridescenceMap.channel),iridescenceThicknessMapUv:de&&d(_.iridescenceThicknessMap.channel),sheenColorMapUv:ve&&d(_.sheenColorMap.channel),sheenRoughnessMapUv:te&&d(_.sheenRoughnessMap.channel),specularMapUv:ne&&d(_.specularMap.channel),specularColorMapUv:me&&d(_.specularColorMap.channel),specularIntensityMapUv:O&&d(_.specularIntensityMap.channel),transmissionMapUv:ie&&d(_.transmissionMap.channel),thicknessMapUv:Q&&d(_.thicknessMap.channel),alphaMapUv:fe&&d(_.alphaMap.channel),vertexTangents:!!P.attributes.tangent&&(ft||Nn),vertexNormals:!!P.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!P.attributes.color&&P.attributes.color.itemSize===4,pointsUvs:A.isPoints===!0&&!!P.attributes.uv&&(ae||fe),fog:!!B,useFog:_.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||P.attributes.normal===void 0&&ft===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:k,skinning:A.isSkinnedMesh===!0,hasPositionAttribute:P.attributes.position!==void 0,morphTargets:P.morphAttributes.position!==void 0,morphNormals:P.morphAttributes.normal!==void 0,morphColors:P.morphAttributes.color!==void 0,morphTargetsCount:se,morphTextureStride:ye,numSunLights:b.sun.length,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numSunLightShadows:b.sunShadowMap.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numLightProbeGrids:L.filter(Te=>Te.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:n.shadowMap.enabled&&R.length>0,shadowMapType:n.shadowMap.type,toneMapping:he,decodeVideoTexture:ae&&_.map.isVideoTexture===!0&&et.getTransfer(_.map.colorSpace)===bt,decodeVideoTextureEmissive:Ct&&_.emissiveMap.isVideoTexture===!0&&et.getTransfer(_.emissiveMap.colorSpace)===bt,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===bn,flipSided:_.side===Pn,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:it&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(it&&_.extensions.multiDraw===!0||le)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return nt.vertexUv1s=c.has(1),nt.vertexUv2s=c.has(2),nt.vertexUv3s=c.has(3),c.clear(),nt}function x(_){let b=[];if(_.shaderID?b.push(_.shaderID):(b.push(_.customVertexShaderID),b.push(_.customFragmentShaderID)),_.defines!==void 0)for(let R in _.defines)b.push(R),b.push(_.defines[R]);return _.isRawShaderMaterial===!1&&(p(b,_),m(b,_),b.push(n.outputColorSpace)),b.push(_.customProgramCacheKey),b.join()}function p(_,b){_.push(b.precision),_.push(b.outputColorSpace),_.push(b.envMapMode),_.push(b.envMapPMREM),_.push(b.envMapMaxLod),_.push(b.envMapSize),_.push(b.mapUv),_.push(b.alphaMapUv),_.push(b.lightMapUv),_.push(b.aoMapUv),_.push(b.bumpMapUv),_.push(b.normalMapUv),_.push(b.displacementMapUv),_.push(b.emissiveMapUv),_.push(b.metalnessMapUv),_.push(b.roughnessMapUv),_.push(b.anisotropyMapUv),_.push(b.clearcoatMapUv),_.push(b.clearcoatNormalMapUv),_.push(b.clearcoatRoughnessMapUv),_.push(b.diffuseRoughnessMapUv),_.push(b.iridescenceMapUv),_.push(b.iridescenceThicknessMapUv),_.push(b.sheenColorMapUv),_.push(b.sheenRoughnessMapUv),_.push(b.specularMapUv),_.push(b.specularColorMapUv),_.push(b.specularIntensityMapUv),_.push(b.transmissionMapUv),_.push(b.thicknessMapUv),_.push(b.combine),_.push(b.fogExp2),_.push(b.sizeAttenuation),_.push(b.morphTargetsCount),_.push(b.numSunLights),_.push(b.numDirLights),_.push(b.numPointLights),_.push(b.numSpotLights),_.push(b.numSpotLightMaps),_.push(b.numHemiLights),_.push(b.numRectAreaLights),_.push(b.numSunLightShadows),_.push(b.numDirLightShadows),_.push(b.numPointLightShadows),_.push(b.numSpotLightShadows),_.push(b.numSpotLightShadowsWithMaps),_.push(b.numLightProbes),_.push(b.numLightProbeGrids),_.push(b.shadowMapType),_.push(b.toneMapping),_.push(b.numClippingPlanes),_.push(b.numClipIntersection),_.push(b.depthPacking)}function m(_,b){o.disableAll(),b.instancing&&o.enable(0),b.instancingColor&&o.enable(1),b.instancingMorph&&o.enable(2),b.matcap&&o.enable(3),b.envMap&&o.enable(4),b.normalMapObjectSpace&&o.enable(5),b.normalMapTangentSpace&&o.enable(6),b.clearcoat&&o.enable(7),b.iridescence&&o.enable(8),b.alphaTest&&o.enable(9),b.vertexColors&&o.enable(10),b.vertexAlphas&&o.enable(11),b.vertexUv1s&&o.enable(12),b.vertexUv2s&&o.enable(13),b.vertexUv3s&&o.enable(14),b.vertexTangents&&o.enable(15),b.anisotropy&&o.enable(16),b.alphaHash&&o.enable(17),b.batching&&o.enable(18),b.dispersion&&o.enable(19),b.retroreflection&&o.enable(24),b.diffuseRoughness&&o.enable(25),b.batchingColor&&o.enable(20),b.gradientMap&&o.enable(21),b.packedNormalMap&&o.enable(22),b.vertexNormals&&o.enable(23),_.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),b.numLightProbeGrids>0&&o.enable(22),b.hasPositionAttribute&&o.enable(23),_.push(o.mask)}function y(_){let b=f[_.type],R;if(b){let I=is[b];R=Hi.clone(I.uniforms)}else R=_.uniforms;return R}function v(_,b){let R=u.get(b);return R!==void 0?++R.usedTimes:(R=new z1(n,b,_,s),l.push(R),u.set(b,R)),R}function S(_){if(--_.usedTimes===0){let b=l.indexOf(_);l[b]=l[l.length-1],l.pop(),u.delete(_.cacheKey),_.destroy()}}function T(_){a.remove(_)}function M(){a.dispose()}return{getParameters:g,getProgramCacheKey:x,getUniforms:y,acquireProgram:v,releaseProgram:S,releaseShaderCache:T,programs:l,dispose:M}}function W1(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,c){n.get(o)[a]=c}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function X1(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function Wx(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Xx(){let n=[],e=0,t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function o(f){let d=0;return f.isInstancedMesh&&(d+=2),f.isSkinnedMesh&&(d+=1),d}function a(f,d,g,x,p,m){let y=n[e];return y===void 0?(y={id:f.id,object:f,geometry:d,material:g,materialVariant:o(f),groupOrder:x,renderOrder:f.renderOrder,z:p,group:m},n[e]=y):(y.id=f.id,y.object=f,y.geometry=d,y.material=g,y.materialVariant=o(f),y.groupOrder=x,y.renderOrder=f.renderOrder,y.z=p,y.group=m),e++,y}function c(f,d,g,x,p,m,y){y.reversedDepth===!0&&(p=-p);let v=a(f,d,g,x,p,m);g.transmission>0?i.push(v):g.transparent===!0?s.push(v):t.push(v)}function l(f,d,g,x,p,m){let y=a(f,d,g,x,p,m);g.transmission>0?i.unshift(y):g.transparent===!0?s.unshift(y):t.unshift(y)}function u(f,d){t.length>1&&t.sort(f||X1),i.length>1&&i.sort(d||Wx),s.length>1&&s.sort(d||Wx)}function h(){for(let f=e,d=n.length;f<d;f++){let g=n[f];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:c,unshift:l,finish:h,sort:u}}function q1(){let n=new WeakMap;function e(i,s){let r=n.get(i),o;return r===void 0?(o=new Xx,n.set(i,[o])):s>=r.length?(o=new Xx,r.push(o)):o=r[s],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function Y1(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new D,color:new oe};break;case"SpotLight":t={position:new D,direction:new D,color:new oe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new oe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new oe,groundColor:new oe};break;case"RectAreaLight":t={color:new oe,position:new D,halfWidth:new D,halfHeight:new D};break}return n[e.id]=t,t}}}function $1(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ee};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ee};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ee,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}var K1=0;function Z1(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function J1(n){let e=new Y1,t=$1(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new D);let s=new D,r=new Ve,o=new Ve;function a(l){let u=0,h=0,f=0;for(let L=0;L<9;L++)i.probe[L].set(0,0,0);let d=0,g=0,x=0,p=0,m=0,y=0,v=0,S=0,T=0,M=0,_=0,b=0,R=0,I=0;l.sort(Z1);for(let L=0,B=l.length;L<B;L++){let P=l[L],H=P.color,K=P.intensity,$=P.distance,X=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===er?X=P.shadow.map.texture:X=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)u+=H.r*K,h+=H.g*K,f+=H.b*K;else if(P.isLightProbe){for(let G=0;G<9;G++)i.probe[G].addScaledVector(P.sh.coefficients[G],K);I++}else if(P.isSunLight){let G=e.get(P);if(G.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let J=P.shadow,se=t.get(P);se.shadowIntensity=J.intensity,se.shadowBias=J.bias,se.shadowNormalBias=J.normalBias,se.shadowRadius=J.radius,se.shadowMapSize.copy(J.mapSize).multiply(J.getFrameExtents()),i.sunShadow[g]=se,i.sunShadowMap[g]=X;let ye=J.getViewportCount();for(let Le=0;Le<ye;Le++)i.sunShadowMatrix[x+Le]=J.getMatrix(Le),i.sunShadowCascade[x+Le]=J._cascadeData[Le];x+=ye,g++}i.sun[d]=G,d++}else if(P.isDirectionalLight){let G=e.get(P);if(G.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let J=P.shadow,se=t.get(P);se.shadowIntensity=J.intensity,se.shadowBias=J.bias,se.shadowNormalBias=J.normalBias,se.shadowRadius=J.radius,se.shadowMapSize=J.mapSize,i.directionalShadow[p]=se,i.directionalShadowMap[p]=X,i.directionalShadowMatrix[p]=P.shadow.matrix,T++}i.directional[p]=G,p++}else if(P.isSpotLight){let G=e.get(P);G.position.setFromMatrixPosition(P.matrixWorld),G.color.copy(H).multiplyScalar(K),G.distance=$,G.coneCos=Math.cos(P.angle),G.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),G.decay=P.decay,i.spot[y]=G;let J=P.shadow;if(P.map&&(i.spotLightMap[b]=P.map,b++,J.updateMatrices(P),P.castShadow&&R++),i.spotLightMatrix[y]=J.matrix,P.castShadow){let se=t.get(P);se.shadowIntensity=J.intensity,se.shadowBias=J.bias,se.shadowNormalBias=J.normalBias,se.shadowRadius=J.radius,se.shadowMapSize=J.mapSize,i.spotShadow[y]=se,i.spotShadowMap[y]=X,_++}y++}else if(P.isRectAreaLight){let G=e.get(P);G.color.copy(H).multiplyScalar(K),G.halfWidth.set(P.width*.5,0,0),G.halfHeight.set(0,P.height*.5,0),i.rectArea[v]=G,v++}else if(P.isPointLight){let G=e.get(P);if(G.color.copy(P.color).multiplyScalar(P.intensity),G.distance=P.distance,G.decay=P.decay,P.castShadow){let J=P.shadow,se=t.get(P);se.shadowIntensity=J.intensity,se.shadowBias=J.bias,se.shadowNormalBias=J.normalBias,se.shadowRadius=J.radius,se.shadowMapSize=J.mapSize,se.shadowCameraNear=J.camera.near,se.shadowCameraFar=J.camera.far,i.pointShadow[m]=se,i.pointShadowMap[m]=X,i.pointShadowMatrix[m]=P.shadow.matrix,M++}i.point[m]=G,m++}else if(P.isHemisphereLight){let G=e.get(P);G.skyColor.copy(P.color).multiplyScalar(K),G.groundColor.copy(P.groundColor).multiplyScalar(K),i.hemi[S]=G,S++}}v>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=be.LTC_FLOAT_1,i.rectAreaLTC2=be.LTC_FLOAT_2):(i.rectAreaLTC1=be.LTC_HALF_1,i.rectAreaLTC2=be.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=f;let A=i.hash;(A.sunLength!==d||A.directionalLength!==p||A.pointLength!==m||A.spotLength!==y||A.rectAreaLength!==v||A.hemiLength!==S||A.numSunShadows!==g||A.numDirectionalShadows!==T||A.numPointShadows!==M||A.numSpotShadows!==_||A.numSpotMaps!==b||A.numLightProbes!==I)&&(i.sun.length=d,i.directional.length=p,i.spot.length=y,i.rectArea.length=v,i.point.length=m,i.hemi.length=S,i.sunShadow.length=g,i.sunShadowMap.length=g,i.sunShadowMatrix.length=x,i.sunShadowCascade.length=x,i.directionalShadow.length=T,i.directionalShadowMap.length=T,i.directionalShadowMatrix.length=T,i.pointShadow.length=M,i.pointShadowMap.length=M,i.pointShadowMatrix.length=M,i.spotShadow.length=_,i.spotShadowMap.length=_,i.spotLightMatrix.length=_+b-R,i.spotLightMap.length=b,i.numSpotLightShadowsWithMaps=R,i.numLightProbes=I,A.sunLength=d,A.directionalLength=p,A.pointLength=m,A.spotLength=y,A.rectAreaLength=v,A.hemiLength=S,A.numSunShadows=g,A.numDirectionalShadows=T,A.numPointShadows=M,A.numSpotShadows=_,A.numSpotMaps=b,A.numLightProbes=I,i.version=K1++)}function c(l,u){let h=0,f=0,d=0,g=0,x=0,p=0,m=u.matrixWorldInverse;for(let y=0,v=l.length;y<v;y++){let S=l[y];if(S.isSunLight){let T=i.sun[h];T.direction.setFromMatrixPosition(S.matrixWorld),T.direction.transformDirection(m),h++}else if(S.isDirectionalLight){let T=i.directional[f];T.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(m),f++}else if(S.isSpotLight){let T=i.spot[g];T.position.setFromMatrixPosition(S.matrixWorld),T.position.applyMatrix4(m),T.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(m),g++}else if(S.isRectAreaLight){let T=i.rectArea[x];T.position.setFromMatrixPosition(S.matrixWorld),T.position.applyMatrix4(m),o.identity(),r.copy(S.matrixWorld),r.premultiply(m),o.extractRotation(r),T.halfWidth.set(S.width*.5,0,0),T.halfHeight.set(0,S.height*.5,0),T.halfWidth.applyMatrix4(o),T.halfHeight.applyMatrix4(o),x++}else if(S.isPointLight){let T=i.point[d];T.position.setFromMatrixPosition(S.matrixWorld),T.position.applyMatrix4(m),d++}else if(S.isHemisphereLight){let T=i.hemi[p];T.direction.setFromMatrixPosition(S.matrixWorld),T.direction.transformDirection(m),p++}}}return{setup:a,setupView:c,state:i}}function qx(n){let e=new J1(n),t=[],i=[],s=[];function r(h){u.camera=h,t.length=0,i.length=0,s.length=0}function o(h){h.isLightProbeGrid?s.push(h):t.push(h)}function a(h){i.push(h)}function c(){e.setup(t),s.sort((h,f)=>h.priority-f.priority||h.id-f.id)}function l(h){e.setupView(t,h)}let u={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:c,setupLightsView:l,pushLight:o,pushShadow:a}}function j1(n){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new qx(n),e.set(s,[a])):r>=o.length?(a=new qx(n),o.push(a)):a=o[r],a}function i(){e=new WeakMap}return{get:t,dispose:i}}var Q1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,eE=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,tE=[new D(1,0,0),new D(-1,0,0),new D(0,1,0),new D(0,-1,0),new D(0,0,1),new D(0,0,-1)],nE=[new D(0,-1,0),new D(0,-1,0),new D(0,0,1),new D(0,0,-1),new D(0,-1,0),new D(0,-1,0)],Yx=new Ve,Tc=new D,hp=new D;function iE(n,e,t){let i=new Js,s=new Ee,r=new Ee,o=new dt,a=new vu,c=new Su,l={},u=t.maxTextureSize,h={[Qi]:Pn,[Pn]:Qi,[bn]:bn},f=new zt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ee},radius:{value:4}},vertexShader:Q1,fragmentShader:eE}),d=f.clone();d.defines.HORIZONTAL_PASS=1;let g=new mt;g.setAttribute("position",new $e(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new We(g,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=zr;let m=this.type;this.render=function(M,_,b){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||M.length===0)return;this.type===Zo&&(Be("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=zr);let R=n.getRenderTarget(),I=n.getActiveCubeFace(),A=n.getActiveMipmapLevel(),L=n.state;L.setBlending(Rs),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);let B=m!==this.type;B&&_.traverse(function(P){P.material&&(Array.isArray(P.material)?P.material.forEach(H=>H.needsUpdate=!0):P.material.needsUpdate=!0)});for(let P=0,H=M.length;P<H;P++){let K=M[P],$=K.shadow;if($===void 0){Be("WebGLShadowMap:",K,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;s.copy($.mapSize);let X=$.getFrameExtents();s.multiply(X),r.copy($.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/X.x),s.x=r.x*X.x,$.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/X.y),s.y=r.y*X.y,$.mapSize.y=r.y));let G=n.state.buffers.depth.getReversed();if($.camera._reversedDepth=G,$.map===null||B===!0){if($.map!==null&&($.map.depthTexture!==null&&($.map.depthTexture.dispose(),$.map.depthTexture=null),$.map.dispose()),this.type===Jo){if(K.isPointLight){Be("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}$.map=new tn(s.x,s.y,{format:er,type:pn,minFilter:hn,magFilter:hn,generateMipmaps:!1}),$.map.texture.name=K.name+".shadowMap",$.map.depthTexture=new Ss(s.x,s.y,di),$.map.depthTexture.name=K.name+".shadowMapDepth",$.map.depthTexture.format=ys,$.map.depthTexture.compareFunction=null,$.map.depthTexture.minFilter=en,$.map.depthTexture.magFilter=en}else K.isPointLight?($.map=new wc(s.x),$.map.depthTexture=new Qa(s.x,ki)):($.map=new tn(s.x,s.y),$.map.depthTexture=new Ss(s.x,s.y,ki)),$.map.depthTexture.name=K.name+".shadowMap",$.map.depthTexture.format=ys,this.type===zr?($.map.depthTexture.compareFunction=G?Jd:Zd,$.map.depthTexture.minFilter=hn,$.map.depthTexture.magFilter=hn):($.map.depthTexture.compareFunction=null,$.map.depthTexture.minFilter=en,$.map.depthTexture.magFilter=en);$.camera.updateProjectionMatrix()}$.map.isWebGLCubeRenderTarget!==!0&&($.map.width!==s.x||$.map.height!==s.y)&&$.map.setSize(s.x,s.y);let J=$.map.isWebGLCubeRenderTarget?6:$.getViewportCount();K.isPointLight!==!0&&$.updateMatrices(K,b);let se=($.camera.layers.mask&4294967294)!==0?$.camera.layers:b.layers;for(let ye=0;ye<J;ye++){let Le=$.getCamera(ye);if(K.isPointLight){let j=$.camera,N=$.matrix,U=K.distance||j.far;U!==j.far&&(j.far=U,j.updateProjectionMatrix()),Tc.setFromMatrixPosition(K.matrixWorld),j.position.copy(Tc),hp.copy(j.position),hp.add(tE[ye]),j.up.copy(nE[ye]),j.lookAt(hp),j.updateMatrixWorld(),N.makeTranslation(-Tc.x,-Tc.y,-Tc.z),Yx.multiplyMatrices(j.projectionMatrix,j.matrixWorldInverse),$._frustum.setFromProjectionMatrix(Yx,j.coordinateSystem,j.reversedDepth)}if($.map.isWebGLCubeRenderTarget)n.setRenderTarget($.map,ye),n.clear();else{ye===0&&(n.setRenderTarget($.map),n.clear());let j=$.getViewport(ye);o.set(r.x*j.x,r.y*j.y,r.x*j.z,r.y*j.w),L.viewport(o)}i=$.getFrustum(ye),S(_,b,Le,K,se,this.type)}$.isPointLightShadow!==!0&&this.type===Jo&&y($,b),$.needsUpdate=!1}m=this.type,p.needsUpdate=!1,n.setRenderTarget(R,I,A)};function y(M,_){let b=e.update(x);f.defines.VSM_SAMPLES!==M.blurSamples&&(f.defines.VSM_SAMPLES=M.blurSamples,d.defines.VSM_SAMPLES=M.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),M.mapPass===null?M.mapPass=new tn(s.x,s.y,{format:er,type:pn}):(M.mapPass.width!==M.map.width||M.mapPass.height!==M.map.height)&&M.mapPass.setSize(M.map.width,M.map.height),f.uniforms.shadow_pass.value=M.map.depthTexture,f.uniforms.resolution.value.set(M.map.width,M.map.height),f.uniforms.radius.value=M.radius,n.setRenderTarget(M.mapPass),n.clear(),n.renderBufferDirect(_,null,b,f,x,null),d.uniforms.shadow_pass.value=M.mapPass.texture,d.uniforms.resolution.value.set(M.map.width,M.map.height),d.uniforms.radius.value=M.radius,n.setRenderTarget(M.map),n.clear(),n.renderBufferDirect(_,null,b,d,x,null)}function v(M,_,b,R){let I=null,A=b.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(A!==void 0)I=A;else if(I=b.isPointLight===!0?c:a,n.localClippingEnabled&&_.clipShadows===!0&&Array.isArray(_.clippingPlanes)&&_.clippingPlanes.length!==0||_.displacementMap&&_.displacementScale!==0||_.alphaMap&&_.alphaTest>0||_.map&&_.alphaTest>0||_.alphaToCoverage===!0){let L=I.uuid,B=_.uuid,P=l[L];P===void 0&&(P={},l[L]=P);let H=P[B];H===void 0&&(H=I.clone(),P[B]=H,_.addEventListener("dispose",T)),I=H}if(I.visible=_.visible,I.wireframe=_.wireframe,R===Jo?I.side=_.shadowSide!==null?_.shadowSide:_.side:I.side=_.shadowSide!==null?_.shadowSide:h[_.side],I.alphaMap=_.alphaMap,I.alphaTest=_.alphaToCoverage===!0?.5:_.alphaTest,I.map=_.map,I.clipShadows=_.clipShadows,I.clippingPlanes=_.clippingPlanes,I.clipIntersection=_.clipIntersection,I.displacementMap=_.displacementMap,I.displacementScale=_.displacementScale,I.displacementBias=_.displacementBias,I.wireframeLinewidth=_.wireframeLinewidth,I.linewidth=_.linewidth,b.isPointLight===!0&&I.isMeshDistanceMaterial===!0){let L=n.properties.get(I);L.light=b}return I}function S(M,_,b,R,I,A){if(M.visible===!1)return;if(M.layers.test(I)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&A===Jo)&&(!M.frustumCulled||M.intersectsFrustum(i))){M.modelViewMatrix.multiplyMatrices(b.matrixWorldInverse,M.matrixWorld);let P=e.update(M),H=M.material;if(Array.isArray(H)){let K=P.groups;for(let $=0,X=K.length;$<X;$++){let G=K[$],J=H[G.materialIndex];if(J&&J.visible){let se=v(M,J,R,A);M.onBeforeShadow(n,M,_,b,P,se,G),n.renderBufferDirect(b,null,P,se,M,G),M.onAfterShadow(n,M,_,b,P,se,G)}}}else if(H.visible){let K=v(M,H,R,A);M.onBeforeShadow(n,M,_,b,P,K,null),n.renderBufferDirect(b,null,P,K,M,null),M.onAfterShadow(n,M,_,b,P,K,null)}}let B=M.children;for(let P=0,H=B.length;P<H;P++)S(B[P],_,b,R,I,A)}function T(M){M.target.removeEventListener("dispose",T);for(let b in l){let R=l[b],I=M.target.uuid;I in R&&(R[I].dispose(),delete R[I])}}}function sE(n,e){function t(){let O=!1,ie=new dt,Q=null,ge=new dt(0,0,0,0);return{setMask:function(fe){Q!==fe&&!O&&(n.colorMask(fe,fe,fe,fe),Q=fe)},setLocked:function(fe){O=fe},setClear:function(fe,pe,ke,it,he){he===!0&&(fe*=it,pe*=it,ke*=it),ie.set(fe,pe,ke,it),ge.equals(ie)===!1&&(n.clearColor(fe,pe,ke,it),ge.copy(ie))},reset:function(){O=!1,Q=null,ge.set(-1,0,0,0)}}}function i(){let O=!1,ie=!1,Q=null,ge=null,fe=null;return{setReversed:function(pe){if(ie!==pe){let ke=e.get("EXT_clip_control");pe?ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.ZERO_TO_ONE_EXT):ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.NEGATIVE_ONE_TO_ONE_EXT),ie=pe;let it=fe;fe=null,this.setClear(it)}},getReversed:function(){return ie},setTest:function(pe){pe?k(n.DEPTH_TEST):ee(n.DEPTH_TEST)},setMask:function(pe){Q!==pe&&!O&&(n.depthMask(pe),Q=pe)},setFunc:function(pe){if(ie&&(pe=bx[pe]),ge!==pe){switch(pe){case eu:n.depthFunc(n.NEVER);break;case tu:n.depthFunc(n.ALWAYS);break;case nu:n.depthFunc(n.LESS);break;case Do:n.depthFunc(n.LEQUAL);break;case iu:n.depthFunc(n.EQUAL);break;case su:n.depthFunc(n.GEQUAL);break;case ru:n.depthFunc(n.GREATER);break;case ou:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ge=pe}},setLocked:function(pe){O=pe},setClear:function(pe){fe!==pe&&(fe=pe,ie&&(pe=1-pe),n.clearDepth(pe))},reset:function(){O=!1,Q=null,ge=null,fe=null,ie=!1}}}function s(){let O=!1,ie=null,Q=null,ge=null,fe=null,pe=null,ke=null,it=null,he=null;return{setTest:function(ze){O||(ze?k(n.STENCIL_TEST):ee(n.STENCIL_TEST))},setMask:function(ze){ie!==ze&&!O&&(n.stencilMask(ze),ie=ze)},setFunc:function(ze,nt,Te){(Q!==ze||ge!==nt||fe!==Te)&&(n.stencilFunc(ze,nt,Te),Q=ze,ge=nt,fe=Te)},setOp:function(ze,nt,Te){(pe!==ze||ke!==nt||it!==Te)&&(n.stencilOp(ze,nt,Te),pe=ze,ke=nt,it=Te)},setLocked:function(ze){O=ze},setClear:function(ze){he!==ze&&(n.clearStencil(ze),he=ze)},reset:function(){O=!1,ie=null,Q=null,ge=null,fe=null,pe=null,ke=null,it=null,he=null}}}let r=new t,o=new i,a=new s,c={},l=new WeakMap,u={},h={},f={},d=new WeakMap,g=[],x=null,p=!1,m=null,y=null,v=null,S=null,T=null,M=null,_=null,b=new oe(0,0,0),R=0,I=!1,A=null,L=null,B=null,P=null,H=null,K=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),$=!1,X=0,G=n.getParameter(n.VERSION);G.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(G)[1]),$=X>=1):G.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),$=X>=2);let J=null,se={},ye=n.getParameter(n.SCISSOR_BOX),Le=n.getParameter(n.VIEWPORT),j=new dt().fromArray(ye),N=new dt().fromArray(Le);function U(O,ie,Q,ge){let fe=new Uint8Array(4),pe=n.createTexture();n.bindTexture(O,pe),n.texParameteri(O,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(O,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let ke=0;ke<Q;ke++)O===n.TEXTURE_3D||O===n.TEXTURE_2D_ARRAY?n.texImage3D(ie,0,n.RGBA,1,1,ge,0,n.RGBA,n.UNSIGNED_BYTE,fe):n.texImage2D(ie+ke,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,fe);return pe}let W={};W[n.TEXTURE_2D]=U(n.TEXTURE_2D,n.TEXTURE_2D,1),W[n.TEXTURE_CUBE_MAP]=U(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),W[n.TEXTURE_2D_ARRAY]=U(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),W[n.TEXTURE_3D]=U(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),k(n.DEPTH_TEST),o.setFunc(Do),Dt(!1),ft(Od),k(n.CULL_FACE),Ze(Rs);function k(O){u[O]!==!0&&(n.enable(O),u[O]=!0)}function ee(O){u[O]!==!1&&(n.disable(O),u[O]=!1)}function le(O,ie){return f[O]!==ie?(n.bindFramebuffer(O,ie),f[O]=ie,O===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=ie),O===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=ie),!0):!1}function ae(O,ie){let Q=g,ge=!1;if(O){Q=d.get(ie),Q===void 0&&(Q=[],d.set(ie,Q));let fe=O.textures;if(Q.length!==fe.length||Q[0]!==n.COLOR_ATTACHMENT0){for(let pe=0,ke=fe.length;pe<ke;pe++)Q[pe]=n.COLOR_ATTACHMENT0+pe;Q.length=fe.length,ge=!0}}else Q[0]!==n.BACK&&(Q[0]=n.BACK,ge=!0);ge&&n.drawBuffers(Q)}function Ie(O){return x!==O?(n.useProgram(O),x=O,!0):!1}let Ce={[Hr]:n.FUNC_ADD,[Xg]:n.FUNC_SUBTRACT,[qg]:n.FUNC_REVERSE_SUBTRACT};Ce[Yg]=n.MIN,Ce[$g]=n.MAX;let Ae={[Kg]:n.ZERO,[Zg]:n.ONE,[Jg]:n.SRC_COLOR,[kd]:n.SRC_ALPHA,[ix]:n.SRC_ALPHA_SATURATE,[tx]:n.DST_COLOR,[Qg]:n.DST_ALPHA,[jg]:n.ONE_MINUS_SRC_COLOR,[zd]:n.ONE_MINUS_SRC_ALPHA,[nx]:n.ONE_MINUS_DST_COLOR,[ex]:n.ONE_MINUS_DST_ALPHA,[sx]:n.CONSTANT_COLOR,[rx]:n.ONE_MINUS_CONSTANT_COLOR,[ox]:n.CONSTANT_ALPHA,[ax]:n.ONE_MINUS_CONSTANT_ALPHA};function Ze(O,ie,Q,ge,fe,pe,ke,it,he,ze){if(O===Rs){p===!0&&(ee(n.BLEND),p=!1);return}if(p===!1&&(k(n.BLEND),p=!0),O!==Wg){if(O!==m||ze!==I){if((y!==Hr||T!==Hr)&&(n.blendEquation(n.FUNC_ADD),y=Hr,T=Hr),ze)switch(O){case jo:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Bi:n.blendFunc(n.ONE,n.ONE);break;case Fd:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Bd:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:qe("WebGLState: Invalid blending: ",O);break}else switch(O){case jo:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Bi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Fd:qe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Bd:qe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:qe("WebGLState: Invalid blending: ",O);break}v=null,S=null,M=null,_=null,b.set(0,0,0),R=0,m=O,I=ze}return}fe=fe||ie,pe=pe||Q,ke=ke||ge,(ie!==y||fe!==T)&&(n.blendEquationSeparate(Ce[ie],Ce[fe]),y=ie,T=fe),(Q!==v||ge!==S||pe!==M||ke!==_)&&(n.blendFuncSeparate(Ae[Q],Ae[ge],Ae[pe],Ae[ke]),v=Q,S=ge,M=pe,_=ke),(it.equals(b)===!1||he!==R)&&(n.blendColor(it.r,it.g,it.b,he),b.copy(it),R=he),m=O,I=!1}function pt(O,ie){O.side===bn?ee(n.CULL_FACE):k(n.CULL_FACE);let Q=O.side===Pn;ie&&(Q=!Q),Dt(Q),O.blending===jo&&O.transparent===!1?Ze(Rs):Ze(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),o.setFunc(O.depthFunc),o.setTest(O.depthTest),o.setMask(O.depthWrite),r.setMask(O.colorWrite);let ge=O.stencilWrite;a.setTest(ge),ge&&(a.setMask(O.stencilWriteMask),a.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),a.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),Ct(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?k(n.SAMPLE_ALPHA_TO_COVERAGE):ee(n.SAMPLE_ALPHA_TO_COVERAGE)}function Dt(O){A!==O&&(O?n.frontFace(n.CW):n.frontFace(n.CCW),A=O)}function ft(O){O!==Gg?(k(n.CULL_FACE),O!==L&&(O===Od?n.cullFace(n.BACK):O===Vg?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ee(n.CULL_FACE),L=O}function Ln(O){O!==B&&($&&n.lineWidth(O),B=O)}function Ct(O,ie,Q){O?(k(n.POLYGON_OFFSET_FILL),(P!==ie||H!==Q)&&(P=ie,H=Q,o.getReversed()&&(ie=-ie,Q=-Q),n.polygonOffset(ie,Q))):ee(n.POLYGON_OFFSET_FILL)}function ln(O){O?k(n.SCISSOR_TEST):ee(n.SCISSOR_TEST)}function Dn(O){O===void 0&&(O=n.TEXTURE0+K-1),J!==O&&(n.activeTexture(O),J=O)}function Nn(O,ie,Q){Q===void 0&&(J===null?Q=n.TEXTURE0+K-1:Q=J);let ge=se[Q];ge===void 0&&(ge={type:void 0,texture:void 0},se[Q]=ge),(ge.type!==O||ge.texture!==ie)&&(J!==Q&&(n.activeTexture(Q),J=Q),n.bindTexture(O,ie||W[O]),ge.type=O,ge.texture=ie)}function z(){let O=se[J];O!==void 0&&O.type!==void 0&&(n.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function gi(){try{n.compressedTexImage2D(...arguments)}catch(O){qe("WebGLState:",O)}}function Vt(){try{n.compressedTexImage3D(...arguments)}catch(O){qe("WebGLState:",O)}}function Wt(){try{n.texSubImage2D(...arguments)}catch(O){qe("WebGLState:",O)}}function Me(){try{n.texSubImage3D(...arguments)}catch(O){qe("WebGLState:",O)}}function un(){try{n.compressedTexSubImage2D(...arguments)}catch(O){qe("WebGLState:",O)}}function He(){try{n.compressedTexSubImage3D(...arguments)}catch(O){qe("WebGLState:",O)}}function Je(){try{n.texStorage2D(...arguments)}catch(O){qe("WebGLState:",O)}}function C(){try{n.texStorage3D(...arguments)}catch(O){qe("WebGLState:",O)}}function E(){try{n.texImage2D(...arguments)}catch(O){qe("WebGLState:",O)}}function q(){try{n.texImage3D(...arguments)}catch(O){qe("WebGLState:",O)}}function ue(O){return h[O]!==void 0?h[O]:n.getParameter(O)}function re(O,ie){h[O]!==ie&&(n.pixelStorei(O,ie),h[O]=ie)}function de(O){j.equals(O)===!1&&(n.scissor(O.x,O.y,O.z,O.w),j.copy(O))}function ve(O){N.equals(O)===!1&&(n.viewport(O.x,O.y,O.z,O.w),N.copy(O))}function te(O,ie){let Q=l.get(ie);Q===void 0&&(Q=new WeakMap,l.set(ie,Q));let ge=Q.get(O);ge===void 0&&(ge=n.getUniformBlockIndex(ie,O.name),n.uniformBlockBinding(ie,ge,ge),Q.set(O,ge))}function ne(O,ie,Q){let fe=l.get(ie).get(O);c[fe]!==Q&&(n.bindBufferBase(n.UNIFORM_BUFFER,fe,Q),c[fe]=Q)}function me(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),u={},h={},J=null,se={},f={},c={},d=new WeakMap,g=[],x=null,p=!1,m=null,y=null,v=null,S=null,T=null,M=null,_=null,b=new oe(0,0,0),R=0,I=!1,A=null,L=null,B=null,P=null,H=null,j.set(0,0,n.canvas.width,n.canvas.height),N.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:k,disable:ee,bindFramebuffer:le,drawBuffers:ae,useProgram:Ie,setBlending:Ze,setMaterial:pt,setFlipSided:Dt,setCullFace:ft,setLineWidth:Ln,setPolygonOffset:Ct,setScissorTest:ln,activeTexture:Dn,bindTexture:Nn,unbindTexture:z,compressedTexImage2D:gi,compressedTexImage3D:Vt,texImage2D:E,texImage3D:q,pixelStorei:re,getParameter:ue,updateUBOMapping:te,uniformBlockBinding:ne,texStorage2D:Je,texStorage3D:C,texSubImage2D:Wt,texSubImage3D:Me,compressedTexSubImage2D:un,compressedTexSubImage3D:He,scissor:de,viewport:ve,reset:me}}function rE(n,e,t,i,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Ee,u=new WeakMap,h=new Set,f,d=new WeakMap,g=new Set,x=new FinalizationRegistry(C=>g.delete(C)),p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(C,E){return p?new OffscreenCanvas(C,E):Oo("canvas")}function y(C,E,q){let ue=1,re=Je(C);if((re.width>q||re.height>q)&&(ue=q/Math.max(re.width,re.height)),ue<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let de=Math.floor(ue*re.width),ve=Math.floor(ue*re.height);f===void 0&&(f=m(de,ve));let te=E?m(de,ve):f;return te.width=de,te.height=ve,te.getContext("2d").drawImage(C,0,0,de,ve),Be("WebGLRenderer: Texture has been resized from ("+re.width+"x"+re.height+") to ("+de+"x"+ve+")."),te}else return"data"in C&&Be("WebGLRenderer: Image in DataTexture is too big ("+re.width+"x"+re.height+")."),C;return C}function v(C){return C.generateMipmaps}function S(C){n.generateMipmap(C)}function T(C){return C.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?n.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function M(C,E,q,ue,re,de=!1){if(C!==null){if(n[C]!==void 0)return n[C];Be("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let ve;ue&&(ve=e.get("EXT_texture_norm16"),ve||Be("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let te=E;if(E===n.RED&&(q===n.FLOAT&&(te=n.R32F),q===n.HALF_FLOAT&&(te=n.R16F),q===n.UNSIGNED_BYTE&&(te=n.R8),q===n.UNSIGNED_SHORT&&ve&&(te=ve.R16_EXT),q===n.SHORT&&ve&&(te=ve.R16_SNORM_EXT)),E===n.RED_INTEGER&&(q===n.UNSIGNED_BYTE&&(te=n.R8UI),q===n.UNSIGNED_SHORT&&(te=n.R16UI),q===n.UNSIGNED_INT&&(te=n.R32UI),q===n.BYTE&&(te=n.R8I),q===n.SHORT&&(te=n.R16I),q===n.INT&&(te=n.R32I)),E===n.RG&&(q===n.FLOAT&&(te=n.RG32F),q===n.HALF_FLOAT&&(te=n.RG16F),q===n.UNSIGNED_BYTE&&(te=n.RG8),q===n.UNSIGNED_SHORT&&ve&&(te=ve.RG16_EXT),q===n.SHORT&&ve&&(te=ve.RG16_SNORM_EXT)),E===n.RG_INTEGER&&(q===n.UNSIGNED_BYTE&&(te=n.RG8UI),q===n.UNSIGNED_SHORT&&(te=n.RG16UI),q===n.UNSIGNED_INT&&(te=n.RG32UI),q===n.BYTE&&(te=n.RG8I),q===n.SHORT&&(te=n.RG16I),q===n.INT&&(te=n.RG32I)),E===n.RGB_INTEGER&&(q===n.UNSIGNED_BYTE&&(te=n.RGB8UI),q===n.UNSIGNED_SHORT&&(te=n.RGB16UI),q===n.UNSIGNED_INT&&(te=n.RGB32UI),q===n.BYTE&&(te=n.RGB8I),q===n.SHORT&&(te=n.RGB16I),q===n.INT&&(te=n.RGB32I)),E===n.RGBA_INTEGER&&(q===n.UNSIGNED_BYTE&&(te=n.RGBA8UI),q===n.UNSIGNED_SHORT&&(te=n.RGBA16UI),q===n.UNSIGNED_INT&&(te=n.RGBA32UI),q===n.BYTE&&(te=n.RGBA8I),q===n.SHORT&&(te=n.RGBA16I),q===n.INT&&(te=n.RGBA32I)),E===n.RGB&&(q===n.UNSIGNED_SHORT&&ve&&(te=ve.RGB16_EXT),q===n.SHORT&&ve&&(te=ve.RGB16_SNORM_EXT),q===n.UNSIGNED_INT_5_9_9_9_REV&&(te=n.RGB9_E5),q===n.UNSIGNED_INT_10F_11F_11F_REV&&(te=n.R11F_G11F_B10F)),E===n.RGBA){let ne=de?Ga:et.getTransfer(re);q===n.FLOAT&&(te=n.RGBA32F),q===n.HALF_FLOAT&&(te=n.RGBA16F),q===n.UNSIGNED_BYTE&&(te=ne===bt?n.SRGB8_ALPHA8:n.RGBA8),q===n.UNSIGNED_SHORT&&ve&&(te=ve.RGBA16_EXT),q===n.SHORT&&ve&&(te=ve.RGBA16_SNORM_EXT),q===n.UNSIGNED_SHORT_4_4_4_4&&(te=n.RGBA4),q===n.UNSIGNED_SHORT_5_5_5_1&&(te=n.RGB5_A1)}return(te===n.R16F||te===n.R32F||te===n.RG16F||te===n.RG32F||te===n.RGBA16F||te===n.RGBA32F)&&e.get("EXT_color_buffer_float"),te}function _(C,E){let q;return C?E===null||E===ki||E===Xr?q=n.DEPTH24_STENCIL8:E===di?q=n.DEPTH32F_STENCIL8:E===ta&&(q=n.DEPTH24_STENCIL8,Be("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===ki||E===Xr?q=n.DEPTH_COMPONENT24:E===di?q=n.DEPTH_COMPONENT32F:E===ta&&(q=n.DEPTH_COMPONENT16),q}function b(C,E){return v(C)===!0||C.isFramebufferTexture&&C.minFilter!==en&&C.minFilter!==hn?Math.log2(Math.max(E.width,E.height))+1:C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?E.mipmaps.length:1}function R(C){let E=new WeakRef(C);i.get(C).__ref=E,g.add(E),x.register(C,E,E)}function I(C){let E=i.get(C).__ref;E!==void 0&&(g.delete(E),x.unregister(E))}function A(C){B(C.target)}function L(C){P(C.target)}function B(C){C.removeEventListener("dispose",A),I(C),K(C),C.isVideoTexture&&u.delete(C),C.isHTMLTexture&&h.delete(C)}function P(C){C.removeEventListener("dispose",L),I(C),X(C)}function H(){for(let C of g){let E=C.deref();E!==void 0&&(E.isRenderTarget===!0?P(E):B(E))}g.clear(),h.clear()}function K(C){let E=i.get(C);if(E.__webglInit===void 0)return;let q=C.source,ue=d.get(q);if(ue){let re=ue[E.__cacheKey];re.usedTimes--,re.usedTimes===0&&$(C),Object.keys(ue).length===0&&d.delete(q)}i.remove(C)}function $(C){let E=i.get(C);n.deleteTexture(E.__webglTexture);let q=C.source,ue=d.get(q);delete ue[E.__cacheKey],o.memory.textures--}function X(C){let E=i.get(C);E.__depthDisposeCallback&&E.__depthDisposeCallback();let q=C.depthTexture;if(q&&q.renderTarget===C&&B(q),C.isWebGLCubeRenderTarget)for(let re=0;re<6;re++){if(Array.isArray(E.__webglFramebuffer[re]))for(let de=0;de<E.__webglFramebuffer[re].length;de++)n.deleteFramebuffer(E.__webglFramebuffer[re][de]);else n.deleteFramebuffer(E.__webglFramebuffer[re]);E.__webglDepthbuffer&&n.deleteRenderbuffer(E.__webglDepthbuffer[re])}else{if(Array.isArray(E.__webglFramebuffer))for(let re=0;re<E.__webglFramebuffer.length;re++)n.deleteFramebuffer(E.__webglFramebuffer[re]);else n.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&n.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&n.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let re=0;re<E.__webglColorRenderbuffer.length;re++)E.__webglColorRenderbuffer[re]&&n.deleteRenderbuffer(E.__webglColorRenderbuffer[re]);E.__webglDepthRenderbuffer&&n.deleteRenderbuffer(E.__webglDepthRenderbuffer)}let ue=C.textures;for(let re=0,de=ue.length;re<de;re++){let ve=i.get(ue[re]);ve.__webglTexture&&(n.deleteTexture(ve.__webglTexture),o.memory.textures--),i.remove(ue[re])}i.remove(C)}let G=0;function J(){G=0}function se(){return G}function ye(C){G=C}function Le(){let C=G;return C>=s.maxTextures&&Be("WebGLTextures: Trying to use "+(C+1)+" texture units while this GPU supports only "+s.maxTextures),G+=1,C}function j(C){let E=[];return E.push(C.wrapS),E.push(C.wrapT),E.push(C.wrapR||0),E.push(C.magFilter),E.push(C.minFilter),E.push(C.anisotropy),E.push(C.internalFormat),E.push(C.format),E.push(C.type),E.push(C.generateMipmaps),E.push(C.mipmapsAutoUpdate),E.push(C.premultiplyAlpha),E.push(C.flipY),E.push(C.unpackAlignment),E.push(C.colorSpace),E.join()}function N(C,E){let q=i.get(C);if(C.isVideoTexture&&un(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&q.__version!==C.version){let ue=C.image;if(ue===null)Be("WebGLRenderer: Texture marked for update but no image data found.");else if(ue.complete===!1)Be("WebGLRenderer: Texture marked for update but image is incomplete");else{pt(q,C,E);return}}else C.isExternalTexture&&(q.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,q.__webglTexture,n.TEXTURE0+E)}function U(C,E){let q=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&q.__version!==C.version){pt(q,C,E);return}else C.isExternalTexture&&(q.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,q.__webglTexture,n.TEXTURE0+E)}function W(C,E){let q=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&q.__version!==C.version){pt(q,C,E);return}t.bindTexture(n.TEXTURE_3D,q.__webglTexture,n.TEXTURE0+E)}function k(C,E){let q=i.get(C);if(C.version>0&&q.__version!==C.version){Dt(q,C,E);return}t.bindTexture(n.TEXTURE_CUBE_MAP,q.__webglTexture,n.TEXTURE0+E)}let ee={[ei]:n.REPEAT,[kn]:n.CLAMP_TO_EDGE,[No]:n.MIRRORED_REPEAT},le={[en]:n.NEAREST,[Lu]:n.NEAREST_MIPMAP_NEAREST,[Wr]:n.NEAREST_MIPMAP_LINEAR,[hn]:n.LINEAR,[ea]:n.LINEAR_MIPMAP_NEAREST,[Mi]:n.LINEAR_MIPMAP_LINEAR},ae={[mx]:n.NEVER,[jd]:n.ALWAYS,[gx]:n.LESS,[Zd]:n.LEQUAL,[xx]:n.EQUAL,[Jd]:n.GEQUAL,[_x]:n.GREATER,[yx]:n.NOTEQUAL};function Ie(C,E){if(E.type===di&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===hn||E.magFilter===ea||E.magFilter===Wr||E.magFilter===Mi||E.minFilter===hn||E.minFilter===ea||E.minFilter===Wr||E.minFilter===Mi)&&Be("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(C,n.TEXTURE_WRAP_S,ee[E.wrapS]),n.texParameteri(C,n.TEXTURE_WRAP_T,ee[E.wrapT]),(C===n.TEXTURE_3D||C===n.TEXTURE_2D_ARRAY)&&n.texParameteri(C,n.TEXTURE_WRAP_R,ee[E.wrapR]),n.texParameteri(C,n.TEXTURE_MAG_FILTER,le[E.magFilter]),n.texParameteri(C,n.TEXTURE_MIN_FILTER,le[E.minFilter]),E.compareFunction&&(n.texParameteri(C,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(C,n.TEXTURE_COMPARE_FUNC,ae[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===en||E.minFilter!==Wr&&E.minFilter!==Mi||E.type===di&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||i.get(E).__currentAnisotropy){let q=e.get("EXT_texture_filter_anisotropic");n.texParameterf(C,q.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,s.getMaxAnisotropy())),i.get(E).__currentAnisotropy=E.anisotropy}}}function Ce(C,E){let q=!1;C.__webglInit===void 0&&(C.__webglInit=!0,E.addEventListener("dispose",A),R(E));let ue=E.source,re=d.get(ue);re===void 0&&(re={},d.set(ue,re));let de=j(E);if(de!==C.__cacheKey){re[de]===void 0&&(re[de]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,q=!0),re[de].usedTimes++;let ve=re[C.__cacheKey];ve!==void 0&&(re[C.__cacheKey].usedTimes--,ve.usedTimes===0&&$(E)),C.__cacheKey=de,C.__webglTexture=re[de].texture}return q}function Ae(C,E,q){return Math.floor(Math.floor(C/q)/E)}function Ze(C,E,q,ue){let de=C.updateRanges;if(de.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,E.width,E.height,q,ue,E.data);else{de.sort((O,ie)=>O.start-ie.start);let ve=0;for(let O=1;O<de.length;O++){let ie=de[ve],Q=de[O],ge=ie.start+ie.count,fe=Ae(Q.start,E.width,4),pe=Ae(ie.start,E.width,4);Q.start<=ge+1&&fe===pe&&Ae(Q.start+Q.count-1,E.width,4)===fe?ie.count=Math.max(ie.count,Q.start+Q.count-ie.start):(++ve,de[ve]=Q)}de.length=ve+1;let te=t.getParameter(n.UNPACK_ROW_LENGTH),ne=t.getParameter(n.UNPACK_SKIP_PIXELS),me=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,E.width);for(let O=0,ie=de.length;O<ie;O++){let Q=de[O],ge=Math.floor(Q.start/4),fe=Math.ceil(Q.count/4),pe=ge%E.width,ke=Math.floor(ge/E.width),it=fe,he=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,pe),t.pixelStorei(n.UNPACK_SKIP_ROWS,ke),t.texSubImage2D(n.TEXTURE_2D,0,pe,ke,it,he,q,ue,E.data)}C.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,te),t.pixelStorei(n.UNPACK_SKIP_PIXELS,ne),t.pixelStorei(n.UNPACK_SKIP_ROWS,me)}}function pt(C,E,q){let ue=n.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(ue=n.TEXTURE_2D_ARRAY),E.isData3DTexture&&(ue=n.TEXTURE_3D);let re=Ce(C,E),de=E.source;t.bindTexture(ue,C.__webglTexture,n.TEXTURE0+q);let ve=i.get(de);if(de.version!==ve.__version||re===!0){if(t.activeTexture(n.TEXTURE0+q),(typeof ImageBitmap<"u"&&E.image instanceof ImageBitmap)===!1){let he=et.getPrimaries(et.workingColorSpace),ze=E.colorSpace===zi?null:et.getPrimaries(E.colorSpace),nt=E.colorSpace===zi||he===ze?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,E.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,nt)}t.pixelStorei(n.UNPACK_ALIGNMENT,E.unpackAlignment);let ne=y(E.image,!1,s.maxTextureSize);ne=He(E,ne);let me=r.convert(E.format,E.colorSpace),O=r.convert(E.type),ie=M(E.internalFormat,me,O,E.normalized,E.colorSpace,E.isVideoTexture);Ie(ue,E);let Q,ge=E.mipmaps,fe=E.isVideoTexture!==!0,pe=ve.__version===void 0||re===!0,ke=de.dataReady,it=b(E,ne);if(E.isDepthTexture)ie=_(E.format===Cs,E.type),pe&&(fe?t.texStorage2D(n.TEXTURE_2D,1,ie,ne.width,ne.height):t.texImage2D(n.TEXTURE_2D,0,ie,ne.width,ne.height,0,me,O,null));else if(E.isDataTexture)if(ge.length>0){fe&&pe&&t.texStorage2D(n.TEXTURE_2D,it,ie,ge[0].width,ge[0].height);for(let he=0,ze=ge.length;he<ze;he++)Q=ge[he],fe?ke&&t.texSubImage2D(n.TEXTURE_2D,he,0,0,Q.width,Q.height,me,O,Q.data):t.texImage2D(n.TEXTURE_2D,he,ie,Q.width,Q.height,0,me,O,Q.data);E.generateMipmaps=!1}else fe?(pe&&t.texStorage2D(n.TEXTURE_2D,it,ie,ne.width,ne.height),ke&&Ze(E,ne,me,O)):t.texImage2D(n.TEXTURE_2D,0,ie,ne.width,ne.height,0,me,O,ne.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){fe&&pe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,it,ie,ge[0].width,ge[0].height,ne.depth);for(let he=0,ze=ge.length;he<ze;he++)if(Q=ge[he],E.format!==bi)if(me!==null)if(fe){if(ke)if(E.layerUpdates.size>0){let nt=lp(Q.width,Q.height,E.format,E.type);for(let Te of E.layerUpdates){let It=Q.data.subarray(Te*nt/Q.data.BYTES_PER_ELEMENT,(Te+1)*nt/Q.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,he,0,0,Te,Q.width,Q.height,1,me,It)}}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,he,0,0,0,Q.width,Q.height,ne.depth,me,Q.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,he,ie,Q.width,Q.height,ne.depth,0,Q.data,0,0);else Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else fe?ke&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,he,0,0,0,Q.width,Q.height,ne.depth,me,O,Q.data):t.texImage3D(n.TEXTURE_2D_ARRAY,he,ie,Q.width,Q.height,ne.depth,0,me,O,Q.data);E.layerUpdates.size>0&&E.clearLayerUpdates()}else{fe&&pe&&t.texStorage2D(n.TEXTURE_2D,it,ie,ge[0].width,ge[0].height);for(let he=0,ze=ge.length;he<ze;he++)Q=ge[he],E.format!==bi?me!==null?fe?ke&&t.compressedTexSubImage2D(n.TEXTURE_2D,he,0,0,Q.width,Q.height,me,Q.data):t.compressedTexImage2D(n.TEXTURE_2D,he,ie,Q.width,Q.height,0,Q.data):Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):fe?ke&&t.texSubImage2D(n.TEXTURE_2D,he,0,0,Q.width,Q.height,me,O,Q.data):t.texImage2D(n.TEXTURE_2D,he,ie,Q.width,Q.height,0,me,O,Q.data)}else if(E.isDataArrayTexture)if(fe){if(pe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,it,ie,ne.width,ne.height,ne.depth),ke)if(E.layerUpdates.size>0){let he=lp(ne.width,ne.height,E.format,E.type);for(let ze of E.layerUpdates){let nt=ne.data.subarray(ze*he/ne.data.BYTES_PER_ELEMENT,(ze+1)*he/ne.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ze,ne.width,ne.height,1,me,O,nt)}E.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,me,O,ne.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,ie,ne.width,ne.height,ne.depth,0,me,O,ne.data);else if(E.isData3DTexture)fe?(pe&&t.texStorage3D(n.TEXTURE_3D,it,ie,ne.width,ne.height,ne.depth),ke&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,me,O,ne.data)):t.texImage3D(n.TEXTURE_3D,0,ie,ne.width,ne.height,ne.depth,0,me,O,ne.data);else if(E.isFramebufferTexture){if(pe)if(fe)t.texStorage2D(n.TEXTURE_2D,it,ie,ne.width,ne.height);else{let he=ne.width,ze=ne.height;for(let nt=0;nt<it;nt++)t.texImage2D(n.TEXTURE_2D,nt,ie,he,ze,0,me,O,null),he>>=1,ze>>=1}}else if(E.isHTMLTexture){if("texElementImage2D"in n){let he=n.canvas;if(he.hasAttribute("layoutsubtree")||he.setAttribute("layoutsubtree","true"),ne.parentNode!==he){he.appendChild(ne),h.add(E),he.onpaint=ze=>{let nt=ze.changedElements;for(let Te of h)nt.includes(Te.image)&&(Te.needsUpdate=!0)},he.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,ne);else{let nt=n.RGBA,Te=n.RGBA,It=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,nt,Te,It,ne)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(ge.length>0){if(fe&&pe){let he=Je(ge[0]);t.texStorage2D(n.TEXTURE_2D,it,ie,he.width,he.height)}for(let he=0,ze=ge.length;he<ze;he++)Q=ge[he],fe?ke&&t.texSubImage2D(n.TEXTURE_2D,he,0,0,me,O,Q):t.texImage2D(n.TEXTURE_2D,he,ie,me,O,Q);E.generateMipmaps=!1}else if(fe){if(pe){let he=Je(ne);t.texStorage2D(n.TEXTURE_2D,it,ie,he.width,he.height)}ke&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,me,O,ne)}else t.texImage2D(n.TEXTURE_2D,0,ie,me,O,ne);v(E)&&E.mipmapsAutoUpdate===!0&&S(ue),ve.__version=de.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function Dt(C,E,q){if(E.image.length!==6)return;let ue=Ce(C,E),re=E.source;t.bindTexture(n.TEXTURE_CUBE_MAP,C.__webglTexture,n.TEXTURE0+q);let de=i.get(re);if(re.version!==de.__version||ue===!0){t.activeTexture(n.TEXTURE0+q);let ve=et.getPrimaries(et.workingColorSpace),te=E.colorSpace===zi?null:et.getPrimaries(E.colorSpace),ne=E.colorSpace===zi||ve===te?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,E.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,E.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ne);let me=E.isCompressedTexture||E.image[0].isCompressedTexture,O=E.image[0]&&E.image[0].isDataTexture,ie=[];for(let Te=0;Te<6;Te++)!me&&!O?ie[Te]=y(E.image[Te],!0,s.maxCubemapSize):ie[Te]=O?E.image[Te].image:E.image[Te],ie[Te]=He(E,ie[Te]);let Q=ie[0],ge=r.convert(E.format,E.colorSpace),fe=r.convert(E.type),pe=M(E.internalFormat,ge,fe,E.normalized,E.colorSpace),ke=E.isVideoTexture!==!0,it=de.__version===void 0||ue===!0,he=re.dataReady,ze=b(E,Q);Ie(n.TEXTURE_CUBE_MAP,E);let nt;if(E.isDepthTexture){if(pe=_(E.format===Cs,E.type),it)if(ke)t.texStorage2D(n.TEXTURE_CUBE_MAP,1,pe,Q.width,Q.height);else for(let Te=0;Te<6;Te++)t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,pe,Q.width,Q.height,0,ge,fe,null)}else if(me){ke&&it&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ze,pe,Q.width,Q.height);for(let Te=0;Te<6;Te++){nt=ie[Te].mipmaps;for(let It=0;It<nt.length;It++){let _n=nt[It];E.format!==bi?ge!==null?ke?he&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,It,0,0,_n.width,_n.height,ge,_n.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,It,pe,_n.width,_n.height,0,_n.data):Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ke?he&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,It,0,0,_n.width,_n.height,ge,fe,_n.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,It,pe,_n.width,_n.height,0,ge,fe,_n.data)}}}else{if(nt=E.mipmaps,ke&&it){nt.length>0&&ze++;let Te=Je(ie[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ze,pe,Te.width,Te.height)}for(let Te=0;Te<6;Te++)if(O){ke?he&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,0,0,ie[Te].width,ie[Te].height,ge,fe,ie[Te].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,pe,ie[Te].width,ie[Te].height,0,ge,fe,ie[Te].data);for(let It=0;It<nt.length;It++){let zs=nt[It].image[Te].image;ke?he&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,It+1,0,0,zs.width,zs.height,ge,fe,zs.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,It+1,pe,zs.width,zs.height,0,ge,fe,zs.data)}}else{ke?he&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,0,0,ge,fe,ie[Te]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,pe,ge,fe,ie[Te]);for(let It=0;It<nt.length;It++){let _n=nt[It];ke?he&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,It+1,0,0,ge,fe,_n.image[Te]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,It+1,pe,ge,fe,_n.image[Te])}}}v(E)&&E.mipmapsAutoUpdate===!0&&S(n.TEXTURE_CUBE_MAP),de.__version=re.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function ft(C,E,q,ue,re,de){let ve=r.convert(q.format,q.colorSpace),te=r.convert(q.type),ne=M(q.internalFormat,ve,te,q.normalized,q.colorSpace),me=i.get(E),O=i.get(q);if(O.__renderTarget=E,!me.__hasExternalTextures){let ie=Math.max(1,E.width>>de),Q=Math.max(1,E.height>>de);re===n.TEXTURE_3D||re===n.TEXTURE_2D_ARRAY?t.texImage3D(re,de,ne,ie,Q,E.depth,0,ve,te,null):t.texImage2D(re,de,ne,ie,Q,0,ve,te,null)}t.bindFramebuffer(n.FRAMEBUFFER,C),Me(E)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ue,re,O.__webglTexture,0,Wt(E)):(re===n.TEXTURE_2D||re>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&re<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ue,re,O.__webglTexture,de),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ln(C,E,q){if(n.bindRenderbuffer(n.RENDERBUFFER,C),E.depthBuffer){let ue=E.depthTexture,re=ue&&ue.isDepthTexture?ue.type:null,de=_(E.stencilBuffer,re),ve=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;Me(E)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Wt(E),de,E.width,E.height):q?n.renderbufferStorageMultisample(n.RENDERBUFFER,Wt(E),de,E.width,E.height):n.renderbufferStorage(n.RENDERBUFFER,de,E.width,E.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,ve,n.RENDERBUFFER,C)}else{let ue=E.textures;for(let re=0;re<ue.length;re++){let de=ue[re],ve=r.convert(de.format,de.colorSpace),te=r.convert(de.type),ne=M(de.internalFormat,ve,te,de.normalized,de.colorSpace);Me(E)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Wt(E),ne,E.width,E.height):q?n.renderbufferStorageMultisample(n.RENDERBUFFER,Wt(E),ne,E.width,E.height):n.renderbufferStorage(n.RENDERBUFFER,ne,E.width,E.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Ct(C,E,q){let ue=E.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,C),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let re=i.get(E.depthTexture);re.__renderTarget=E;let de=ue?E.depthTexture.image[0]:E.depthTexture.image;(!re.__webglTexture||de.width!==E.width||de.height!==E.height)&&(de.width=E.width,de.height=E.height,E.depthTexture.needsUpdate=!0),ue?k(E.depthTexture,0):N(E.depthTexture,0);let ve=re.__webglTexture,te=Wt(E),ne=ue?n.TEXTURE_CUBE_MAP_POSITIVE_X+q:n.TEXTURE_2D,me=E.depthTexture.format===Cs?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(E.depthTexture.format===ys)Me(E)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,me,ne,ve,0,te):n.framebufferTexture2D(n.FRAMEBUFFER,me,ne,ve,0);else if(E.depthTexture.format===Cs)Me(E)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,me,ne,ve,0,te):n.framebufferTexture2D(n.FRAMEBUFFER,me,ne,ve,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ln(C){let E=i.get(C),q=C.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==C.depthTexture){let ue=C.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),ue){let re=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,ue.removeEventListener("dispose",re)};ue.addEventListener("dispose",re),E.__depthDisposeCallback=re}E.__boundDepthTexture=ue}if(C.depthTexture&&!E.__autoAllocateDepthBuffer)if(q)for(let ue=0;ue<6;ue++)Ct(E.__webglFramebuffer[ue],C,ue);else C.texture.mipmaps.length>0?Ct(E.__webglFramebuffer[0],C,0):Ct(E.__webglFramebuffer,C,0);else if(q){E.__webglDepthbuffer=[];for(let ue=0;ue<6;ue++)if(t.bindFramebuffer(n.FRAMEBUFFER,E.__webglFramebuffer[ue]),E.__webglDepthbuffer[ue]===void 0)E.__webglDepthbuffer[ue]=n.createRenderbuffer(),Ln(E.__webglDepthbuffer[ue],C,!1);else{let re=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,de=E.__webglDepthbuffer[ue];n.bindRenderbuffer(n.RENDERBUFFER,de),n.framebufferRenderbuffer(n.FRAMEBUFFER,re,n.RENDERBUFFER,de)}}else if(C.texture.mipmaps.length>0?t.bindFramebuffer(n.FRAMEBUFFER,E.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=n.createRenderbuffer(),Ln(E.__webglDepthbuffer,C,!1);else{let re=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,de=E.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,de),n.framebufferRenderbuffer(n.FRAMEBUFFER,re,n.RENDERBUFFER,de)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Dn(C,E,q){let ue=i.get(C);E!==void 0&&ft(ue.__webglFramebuffer,C,C.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),q!==void 0&&ln(C)}function Nn(C){let E=C.texture,q=i.get(C),ue=i.get(E);C.addEventListener("dispose",L),R(C);let re=C.textures,de=C.isWebGLCubeRenderTarget===!0,ve=re.length>1;if(ve||(ue.__webglTexture===void 0&&(ue.__webglTexture=n.createTexture()),ue.__version=E.version,o.memory.textures++),de){q.__webglFramebuffer=[];for(let te=0;te<6;te++)if(E.mipmaps.length>0){q.__webglFramebuffer[te]=[];for(let ne=0;ne<E.mipmaps.length;ne++)q.__webglFramebuffer[te][ne]=n.createFramebuffer()}else q.__webglFramebuffer[te]=n.createFramebuffer()}else{if(E.mipmaps.length>0){q.__webglFramebuffer=[];for(let te=0;te<E.mipmaps.length;te++)q.__webglFramebuffer[te]=n.createFramebuffer()}else q.__webglFramebuffer=n.createFramebuffer();if(ve)for(let te=0,ne=re.length;te<ne;te++){let me=i.get(re[te]);me.__webglTexture===void 0&&(me.__webglTexture=n.createTexture(),o.memory.textures++)}if(C.samples>0&&Me(C)===!1){q.__webglMultisampledFramebuffer=n.createFramebuffer(),q.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,q.__webglMultisampledFramebuffer);for(let te=0;te<re.length;te++){let ne=re[te];q.__webglColorRenderbuffer[te]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,q.__webglColorRenderbuffer[te]);let me=r.convert(ne.format,ne.colorSpace),O=r.convert(ne.type),ie=M(ne.internalFormat,me,O,ne.normalized,ne.colorSpace,C.isXRRenderTarget===!0),Q=Wt(C);n.renderbufferStorageMultisample(n.RENDERBUFFER,Q,ie,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+te,n.RENDERBUFFER,q.__webglColorRenderbuffer[te])}n.bindRenderbuffer(n.RENDERBUFFER,null),C.depthBuffer&&(q.__webglDepthRenderbuffer=n.createRenderbuffer(),Ln(q.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(de){t.bindTexture(n.TEXTURE_CUBE_MAP,ue.__webglTexture),Ie(n.TEXTURE_CUBE_MAP,E);for(let te=0;te<6;te++)if(E.mipmaps.length>0)for(let ne=0;ne<E.mipmaps.length;ne++)ft(q.__webglFramebuffer[te][ne],C,E,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+te,ne);else ft(q.__webglFramebuffer[te],C,E,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0);v(E)?S(n.TEXTURE_CUBE_MAP):E.mipmaps.length>0&&n.texParameteri(n.TEXTURE_CUBE_MAP,n.TEXTURE_MAX_LEVEL,E.mipmaps.length-1),t.unbindTexture()}else if(ve){for(let te=0,ne=re.length;te<ne;te++){let me=re[te],O=i.get(me),ie=n.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ie=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ie,O.__webglTexture),Ie(ie,me),ft(q.__webglFramebuffer,C,me,n.COLOR_ATTACHMENT0+te,ie,0),v(me)&&S(ie)}t.unbindTexture()}else{let te=n.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(te=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(te,ue.__webglTexture),Ie(te,E),E.mipmaps.length>0)for(let ne=0;ne<E.mipmaps.length;ne++)ft(q.__webglFramebuffer[ne],C,E,n.COLOR_ATTACHMENT0,te,ne);else ft(q.__webglFramebuffer,C,E,n.COLOR_ATTACHMENT0,te,0);v(E)?S(te):E.mipmaps.length>0&&n.texParameteri(te,n.TEXTURE_MAX_LEVEL,E.mipmaps.length-1),t.unbindTexture()}C.depthBuffer&&ln(C)}function z(C){let E=C.textures;for(let q=0,ue=E.length;q<ue;q++){let re=E[q];if(v(re)&&re.mipmapsAutoUpdate===!0){let de=T(C),ve=i.get(re).__webglTexture;t.bindTexture(de,ve),S(de),t.unbindTexture()}}}let gi=[];function Vt(C){if(C.samples>0){if(Me(C)===!1){let E=C.textures,q=C.width,ue=C.height,re=n.COLOR_BUFFER_BIT,de=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ve=i.get(C),te=E.length>1;if(te)for(let me=0;me<E.length;me++)t.bindFramebuffer(n.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,ve.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,ve.__webglMultisampledFramebuffer),C.texture.mipmaps.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ve.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ve.__webglFramebuffer);for(let me=0;me<E.length;me++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(re|=n.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(re|=n.STENCIL_BUFFER_BIT)),te){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,ve.__webglColorRenderbuffer[me]);let O=i.get(E[me]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,O,0)}n.blitFramebuffer(0,0,q,ue,0,0,q,ue,re,n.NEAREST),c===!0&&(gi.length=0,gi.push(n.COLOR_ATTACHMENT0+me),C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&gi.push(de),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,gi))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),te)for(let me=0;me<E.length;me++){t.bindFramebuffer(n.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.RENDERBUFFER,ve.__webglColorRenderbuffer[me]);let O=i.get(E[me]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,ve.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.TEXTURE_2D,O,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ve.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&c){let E=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[E])}}}function Wt(C){return Math.min(s.maxSamples,C.samples)}function Me(C){let E=i.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function un(C){let E=o.render.frame;u.get(C)!==E&&(u.set(C,E),C.update())}function He(C,E){let q=C.colorSpace,ue=C.format,re=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||q!==Cn&&q!==zi&&(et.getTransfer(q)===bt?(ue!==bi||re!==ri)&&Be("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):qe("WebGLTextures: Unsupported texture color space:",q)),E}function Je(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(l.width=C.naturalWidth||C.width,l.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(l.width=C.displayWidth,l.height=C.displayHeight):(l.width=C.width,l.height=C.height),l}this.allocateTextureUnit=Le,this.resetTextureUnits=J,this.getTextureUnits=se,this.setTextureUnits=ye,this.setTexture2D=N,this.setTexture2DArray=U,this.setTexture3D=W,this.setTextureCube=k,this.rebindTextures=Dn,this.setupRenderTarget=Nn,this.updateRenderTargetMipmap=z,this.updateMultisampleRenderTarget=Vt,this.setupDepthRenderbuffer=ln,this.setupFrameBufferTexture=ft,this.useMultisampledRTT=Me,this.dispose=H}function oE(n,e){function t(i,s=zi){let r,o=et.getTransfer(s);if(i===ri)return n.UNSIGNED_BYTE;if(i===Nu)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Uu)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Xd)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===qd)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Vd)return n.BYTE;if(i===Wd)return n.SHORT;if(i===ta)return n.UNSIGNED_SHORT;if(i===Du)return n.INT;if(i===ki)return n.UNSIGNED_INT;if(i===di)return n.FLOAT;if(i===pn)return n.HALF_FLOAT;if(i===Yd)return n.ALPHA;if(i===$d)return n.RGB;if(i===bi)return n.RGBA;if(i===ys)return n.DEPTH_COMPONENT;if(i===Cs)return n.DEPTH_STENCIL;if(i===Ou)return n.RED;if(i===Fu)return n.RED_INTEGER;if(i===er)return n.RG;if(i===Bu)return n.RG_INTEGER;if(i===ku)return n.RGBA_INTEGER;if(i===xc||i===_c||i===yc||i===vc)if(o===bt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===xc)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===_c)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===yc)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===vc)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===xc)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===_c)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===yc)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===vc)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===zu||i===Hu||i===Gu||i===Vu)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===zu)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Hu)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Gu)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Vu)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Wu||i===Xu||i===qu||i===Yu||i===$u||i===Sc||i===Ku)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Wu||i===Xu)return o===bt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===qu)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===Yu)return r.COMPRESSED_R11_EAC;if(i===$u)return r.COMPRESSED_SIGNED_R11_EAC;if(i===Sc)return r.COMPRESSED_RG11_EAC;if(i===Ku)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Zu||i===Ju||i===ju||i===Qu||i===eh||i===th||i===nh||i===ih||i===sh||i===rh||i===oh||i===ah||i===ch||i===lh)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Zu)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Ju)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===ju)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Qu)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===eh)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===th)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===nh)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===ih)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===sh)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===rh)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===oh)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===ah)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===ch)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===lh)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===uh||i===hh||i===fh)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===uh)return o===bt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===hh)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===fh)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===dh||i===ph||i===Mc||i===mh)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===dh)return r.COMPRESSED_RED_RGTC1_EXT;if(i===ph)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Mc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===mh)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Xr?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}var aE=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,cE=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,_p=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let i=new ec(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new zt({vertexShader:aE,fragmentShader:cE,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new We(new ii(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},yp=class extends Zi{constructor(e,t){super();let i=this,s=null,r=1,o=null,a="local-floor",c=1,l=null,u=null,h=null,f=null,d=null,g=null,x=typeof XRWebGLBinding<"u",p=new _p,m={},y=t.getContextAttributes(),v=null,S=null,T=[],M=[],_=new Ee,b=null,R=null,I=new Qt;I.viewport=new dt;let A=new Qt;A.viewport=new dt;let L=[I,A],B=new Cu,P=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let N=T[j];return N===void 0&&(N=new ko,T[j]=N),N.getTargetRaySpace()},this.getControllerGrip=function(j){let N=T[j];return N===void 0&&(N=new ko,T[j]=N),N.getGripSpace()},this.getHand=function(j){let N=T[j];return N===void 0&&(N=new ko,T[j]=N),N.getHandSpace()};function K(j){let N=M.indexOf(j.inputSource);if(N===-1)return;let U=T[N];U!==void 0&&(U.update(j.inputSource,j.frame,l||o),U.dispatchEvent({type:j.type,data:j.inputSource}))}function $(){s.removeEventListener("select",K),s.removeEventListener("selectstart",K),s.removeEventListener("selectend",K),s.removeEventListener("squeeze",K),s.removeEventListener("squeezestart",K),s.removeEventListener("squeezeend",K),s.removeEventListener("end",$),s.removeEventListener("inputsourceschange",X);for(let j=0;j<T.length;j++){let N=M[j];N!==null&&(M[j]=null,T[j].disconnect(N))}P=null,H=null,p.reset();for(let j in m)delete m[j];if(e.setRenderTarget(v),d=null,f=null,h=null,s=null,S=null,Le.stop(),i.isPresenting=!1,e.setPixelRatio(b),e.setSize(_.width,_.height,!1),R!==null){let j=R.camera;j.fov=R.fov,j.zoom=R.zoom,j.updateProjectionMatrix(),R=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){r=j,i.isPresenting===!0&&Be("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){a=j,i.isPresenting===!0&&Be("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(j){l=j},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return h===null&&x&&(h=new XRWebGLBinding(s,t)),h},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(j){if(s=j,s!==null){if(v=e.getRenderTarget(),s.addEventListener("select",K),s.addEventListener("selectstart",K),s.addEventListener("selectend",K),s.addEventListener("squeeze",K),s.addEventListener("squeezestart",K),s.addEventListener("squeezeend",K),s.addEventListener("end",$),s.addEventListener("inputsourceschange",X),y.xrCompatible!==!0&&await t.makeXRCompatible(),b=e.getPixelRatio(),e.getSize(_),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let U=null,W=null,k=null;y.depth&&(k=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,U=y.stencil?Cs:ys,W=y.stencil?Xr:ki);let ee={colorFormat:t.RGBA8,depthFormat:k,scaleFactor:r};h=this.getBinding(),f=h.createProjectionLayer(ee),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),S=new tn(f.textureWidth,f.textureHeight,{format:bi,type:ri,depthTexture:new Ss(f.textureWidth,f.textureHeight,W,void 0,void 0,void 0,void 0,void 0,void 0,U),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}else{let U={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,t,U),s.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),S=new tn(d.framebufferWidth,d.framebufferHeight,{format:bi,type:ri,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),Le.setContext(s),Le.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function X(j){for(let N=0;N<j.removed.length;N++){let U=j.removed[N],W=M.indexOf(U);W>=0&&(M[W]=null,T[W].disconnect(U))}for(let N=0;N<j.added.length;N++){let U=j.added[N],W=M.indexOf(U);if(W===-1){for(let ee=0;ee<T.length;ee++)if(ee>=M.length){M.push(U),W=ee;break}else if(M[ee]===null){M[ee]=U,W=ee;break}if(W===-1)break}let k=T[W];k&&k.connect(U)}}function G(j,N){N===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(N.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(s===null)return;let N=j.near,U=j.far;p.texture!==null&&(p.depthNear>0&&(N=p.depthNear),p.depthFar>0&&(U=p.depthFar)),B.near=A.near=I.near=N,B.far=A.far=I.far=U,(P!==B.near||H!==B.far)&&(s.updateRenderState({depthNear:B.near,depthFar:B.far}),P=B.near,H=B.far),B.layers.mask=j.layers.mask|6,I.layers.mask=B.layers.mask&-5,A.layers.mask=B.layers.mask&-3;let W=j.parent,k=B.cameras;G(B,W);for(let ee=0;ee<k.length;ee++)G(k[ee],W);B.projectionMatrix.copy(I.projectionMatrix),B.projectionMatrixInverse.copy(I.projectionMatrixInverse),R===null&&j.isPerspectiveCamera&&(R={camera:j,fov:j.fov,zoom:j.zoom}),J(j,B,W)};function J(j,N,U){U===null?j.matrix.copy(N.matrixWorld):(j.matrix.copy(U.matrixWorld),j.matrix.invert(),j.matrix.multiply(N.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(N.projectionMatrix),j.projectionMatrixInverse.copy(N.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=Pr*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return B},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(j){c=j,f!==null&&(f.fixedFoveation=j),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=j)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(B)},this.getCameraTexture=function(j){return m[j]};let se=null;function ye(j,N){if(u=N.getViewerPose(l||o),g=N,u!==null){let U=u.views;d!==null&&(e.setRenderTargetFramebuffer(S,d.framebuffer),e.setRenderTarget(S));let W=!1;U.length!==B.cameras.length&&(B.cameras.length=0,W=!0);for(let ae=0;ae<U.length;ae++){let Ie=U[ae],Ce=null;if(d!==null)Ce=d.getViewport(Ie);else{let Ze=h.getViewSubImage(f,Ie);Ce=Ze.viewport,ae===0&&(e.setRenderTargetTextures(S,Ze.colorTexture,Ze.depthStencilTexture),e.setRenderTarget(S))}let Ae=L[ae];Ae===void 0&&(Ae=new Qt,Ae.layers.enable(ae),Ae.viewport=new dt,L[ae]=Ae),Ae.matrix.fromArray(Ie.transform.matrix),Ae.matrix.decompose(Ae.position,Ae.quaternion,Ae.scale),Ae.projectionMatrix.fromArray(Ie.projectionMatrix),Ae.projectionMatrixInverse.copy(Ae.projectionMatrix).invert(),Ae.viewport.set(Ce.x,Ce.y,Ce.width,Ce.height),ae===0&&(B.matrix.copy(Ae.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale)),W===!0&&B.cameras.push(Ae)}let k=s.enabledFeatures;if(k&&k.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){h=i.getBinding();let ae=h.getDepthInformation(U[0]);ae&&ae.isValid&&ae.texture&&p.init(ae,s.renderState)}if(k&&k.includes("camera-access")&&x){e.state.unbindTexture(),h=i.getBinding();for(let ae=0;ae<U.length;ae++){let Ie=U[ae].camera;if(Ie){let Ce=m[Ie];Ce||(Ce=new ec,m[Ie]=Ce);let Ae=h.getCameraImage(Ie);Ce.sourceTexture=Ae}}}}for(let U=0;U<T.length;U++){let W=M[U],k=T[U];W!==null&&k!==void 0&&k.update(W,N,l||o)}se&&se(j,N),N.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:N}),g=null}let Le=new $x;Le.setAnimationLoop(ye),this.setAnimationLoop=function(j){se=j},this.dispose=function(){}}},lE=new Ve,s_=new Ke;s_.set(-1,0,0,0,1,0,0,0,1);function uE(n,e){function t(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function i(p,m){m.color.getRGB(p.fogColor.value,op(n)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function s(p,m,y,v,S){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(p,m):m.isMeshLambertMaterial?(r(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(p,m),h(p,m)):m.isMeshPhongMaterial?(r(p,m),u(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(p,m),f(p,m),m.isMeshPhysicalMaterial&&d(p,m,S)):m.isMeshMatcapMaterial?(r(p,m),g(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),x(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(o(p,m),m.isLineDashedMaterial&&a(p,m)):m.isPointsMaterial?c(p,m,y,v):m.isSpriteMaterial?l(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,t(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===Pn&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,t(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===Pn&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,t(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,t(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);let y=e.get(m),v=y.envMap,S=y.envMapRotation;v&&(p.envMap.value=v,p.envMapRotation.value.setFromMatrix4(lE.makeRotationFromEuler(S)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(s_),p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,p.aoMapTransform))}function o(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform))}function a(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function c(p,m,y,v){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*y,p.scale.value=v*.5,m.map&&(p.map.value=m.map,t(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function l(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function u(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function h(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function f(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function d(p,m,y){p.ior.value=m.ior,m.diffuseRoughness>0&&(p.diffuseRoughness.value=m.diffuseRoughness,m.diffuseRoughnessMap&&(p.diffuseRoughnessMap.value=m.diffuseRoughnessMap,t(m.diffuseRoughnessMap,p.diffuseRoughnessMapTransform))),m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Pn&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.retroreflectivity>0&&(p.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessMinimum,p.iridescenceThicknessMaximum.value=m.iridescenceThicknessMaximum,m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=y.texture,p.transmissionSamplerSize.value.set(y.width,y.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function x(p,m){let y=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(y.matrixWorld),p.nearDistance.value=y.shadow.camera.near,p.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function hE(n,e,t,i){let s={},r={};function o(y,v){let S=v.program;i.uniformBlockBinding(y,S,s[y.id])}function a(y,v){let S=s[y.id];S===void 0&&(g(y),S=c(y),s[y.id]=S,y.addEventListener("dispose",p));let T=v.program;i.updateUBOMapping(y,T);let M=e.render.frame;r[y.id]!==M&&(l(y),r[y.id]=M)}function c(y){let v=n.createBuffer(),S=y.__size,T=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,S,T),n.bindBuffer(n.UNIFORM_BUFFER,null),v}function l(y){let v=s[y.id],S=y.uniforms,T=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let M=0,_=S.length;M<_;M++){let b=S[M];if(Array.isArray(b))for(let R=0,I=b.length;R<I;R++)u(b[R],M,R,T);else u(b,M,0,T)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(y,v,S,T){if(f(y,v,S,T)===!0){let M=y.__offset,_=y.value;if(Array.isArray(_)){let b=0;for(let R=0;R<_.length;R++){let I=_[R],A=x(I,!0);h(I,y.__data,b),b+=A.storage/Float32Array.BYTES_PER_ELEMENT}}else h(_,y.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,M,y.__data)}}function h(y,v,S){typeof y=="number"||typeof y=="boolean"?v[S]=y:y.isMatrix3?(v[S]=y.elements[0],v[S+1]=y.elements[1],v[S+2]=y.elements[2],v[S+3]=0,v[S+4]=y.elements[3],v[S+5]=y.elements[4],v[S+6]=y.elements[5],v[S+7]=0,v[S+8]=y.elements[6],v[S+9]=y.elements[7],v[S+10]=y.elements[8],v[S+11]=0):ArrayBuffer.isView(y)?v.set(y.subarray(0,v.length-S),S):y.toArray(v,S)}function f(y,v,S,T){let M=y.value,_=v+"_"+S;if(Array.isArray(M)){T[_]===void 0&&(T[_]=[]);let b=T[_],R=!1;for(let I=0;I<M.length;I++)d(M[I],b,I)===!0&&(R=!0);return R}return d(M,T,_)}function d(y,v,S){if(v[S]===void 0)return typeof y=="number"||typeof y=="boolean"?v[S]=y:ArrayBuffer.isView(y)?v[S]=y.slice():v[S]=y.clone(),!0;{let T=v[S];if(typeof y=="number"||typeof y=="boolean"){if(T!==y)return v[S]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(T.equals(y)===!1)return T.copy(y),!0}}return!1}function g(y){let v=y.uniforms,S=0,T=16;for(let _=0,b=v.length;_<b;_++){let R=Array.isArray(v[_])?v[_]:[v[_]];for(let I=0,A=R.length;I<A;I++){let L=R[I],B=Array.isArray(L.value)?L.value:[L.value],P=Array.isArray(v[_])||Array.isArray(L.value),H=S;for(let $=0,X=B.length;$<X;$++){let G=B[$],J=x(G,P),se=S%T,ye=se%J.boundary,Le=se+ye;S+=ye,Le!==0&&T-Le<J.storage&&(S+=T-Le),$===0&&(H=S),S+=J.storage}let K=L.type==="int"?Int32Array:L.type==="uint"?Uint32Array:Float32Array;L.__data=new K((S-H)/Float32Array.BYTES_PER_ELEMENT),L.__offset=H}}let M=S%T;return M>0&&(S+=T-M),y.__size=S,y.__cache={},this}function x(y,v){let S={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(S.boundary=4,S.storage=4):y.isVector2?(S.boundary=8,S.storage=8):y.isVector3||y.isColor?(S.boundary=16,S.storage=12):y.isVector4?(S.boundary=16,S.storage=16):y.isMatrix3?(S.boundary=16,S.storage=48):y.isMatrix4?(S.boundary=16,S.storage=64):y.isTexture?Be("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(S.boundary=16,S.storage=y.byteLength):Be("WebGLRenderer: Unsupported uniform value type.",y),v===!0&&(S.boundary=16,S.storage=Math.ceil(S.storage/16)*16),S}function p(y){let v=y.target;v.removeEventListener("dispose",p),n.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function m(){for(let y in s)n.deleteBuffer(s[y]);s={},r={}}return{bind:o,update:a,dispose:m}}var fE=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),ns=null;function dE(){return ns===null&&(ns=new Go(fE,16,16,er,pn),ns.name="DFG_LUT",ns.minFilter=hn,ns.magFilter=hn,ns.wrapS=kn,ns.wrapT=kn,ns.generateMipmaps=!1,ns.needsUpdate=!0),ns}var Sh=class{constructor(e={}){let{canvas:t=vx(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:f=!1,outputBufferType:d=ri}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=o;let x=d,p=new Set([ku,Bu,Fu]),m=new Set([ri,ki,ta,Xr,Nu,Uu]),y=new Uint32Array(4),v=new Int32Array(4),S={textures:[],min:[],max:[],resolution:[]},T=null,M=null,_=[],b=[],R=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=es,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let I=this,A=!1,L=null,B=null,P=null,H=null;this._outputColorSpace=Lt;let K=0,$=0,X=null,G=-1,J=null,se=new dt,ye=new dt,Le=null,j=new oe(0),N=0,U=t.width,W=t.height,k=1,ee=null,le=null,ae=new dt(0,0,U,W),Ie=new dt(0,0,U,W),Ce=!1,Ae=new Js,Ze=new uu,pt=!1,Dt=!1,ft=new Ve,Ln=new D,Ct=new dt,ln={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Dn=!1;function Nn(){return X===null?k:1}let z=i;function gi(w,F){return t.getContext(w,F)}let Vt,Wt,Me,un,He,Je,C,E,q,ue,re,de,ve,te,ne,me,O,ie,Q,ge,fe,pe,ke;try{let w={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"187"}`),t.addEventListener("webglcontextlost",ze,!1),t.addEventListener("webglcontextrestored",nt,!1),t.addEventListener("webglcontextcreationerror",Te,!1),z===null){let F="webgl2";if(z=gi(F,w),z===null)throw gi(F)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}it()}catch(w){throw t.removeEventListener("webglcontextlost",ze,!1),t.removeEventListener("webglcontextrestored",nt,!1),t.removeEventListener("webglcontextcreationerror",Te,!1),qe("WebGLRenderer: "+w.message),w}function it(){Vt=new TT(z),Vt.init(),fe=new oE(z,Vt),Wt=new dT(z,Vt,e,fe),Me=new sE(z,Vt),Wt.reversedDepthBuffer&&f&&Me.buffers.depth.setReversed(!0),B=z.createFramebuffer(),P=z.createFramebuffer(),H=z.createFramebuffer(),un=new AT(z),He=new W1,Je=new rE(z,Vt,Me,He,Wt,fe,un),C=new bT(I),E=new CS(z),pe=new hT(z,E),q=new ET(z,E,un,pe),ue=new CT(z,q,E,pe,un),ie=new RT(z,Wt,Je),ne=new pT(He),re=new V1(I,C,Vt,Wt,pe,ne),de=new uE(I,He),ve=new q1,te=new j1(Vt),O=new uT(I,C,Me,ue,g,c),me=new iE(I,ue,Wt),ke=new hE(z,un,Wt,Me),Q=new fT(z,Vt,un),ge=new wT(z,Vt,un),un.programs=re.programs,I.capabilities=Wt,I.extensions=Vt,I.properties=He,I.renderLists=ve,I.shadowMap=me,I.state=Me,I.info=un}x!==ri&&(R=new IT(x,t.width,t.height,a,s,r));let he=new yp(I,z);this.xr=he,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){let w=Vt.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){let w=Vt.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return k},this.setPixelRatio=function(w){w!==void 0&&(k=w,this.setSize(U,W,!1))},this.getSize=function(w){return w.set(U,W)},this.setSize=function(w,F,Z=!0){if(he.isPresenting){Be("WebGLRenderer: Can't change size while VR device is presenting.");return}U=w,W=F,t.width=Math.floor(w*k),t.height=Math.floor(F*k),Z===!0&&(t.style.width=w+"px",t.style.height=F+"px"),R!==null&&R.setSize(t.width,t.height),this.setViewport(0,0,w,F)},this.getDrawingBufferSize=function(w){return w.set(U*k,W*k).floor()},this.setDrawingBufferSize=function(w,F,Z){U=w,W=F,k=Z,t.width=Math.floor(w*Z),t.height=Math.floor(F*Z),this.setViewport(0,0,w,F)},this.setEffects=function(w){if(x===ri){qe("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(w){for(let F=0;F<w.length;F++)if(w[F].isOutputPass===!0){Be("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}R.setEffects(w||[])},this.getCurrentViewport=function(w){return w.copy(se)},this.getViewport=function(w){return w.copy(ae)},this.setViewport=function(w,F,Z,V){w.isVector4?ae.set(w.x,w.y,w.z,w.w):ae.set(w,F,Z,V),Me.viewport(se.copy(ae).multiplyScalar(Nn()).round())},this.getScissor=function(w){return w.copy(Ie)},this.setScissor=function(w,F,Z,V){w.isVector4?Ie.set(w.x,w.y,w.z,w.w):Ie.set(w,F,Z,V),Me.scissor(ye.copy(Ie).multiplyScalar(Nn()).round())},this.getScissorTest=function(){return Ce},this.setScissorTest=function(w){Me.setScissorTest(Ce=w)},this.setOpaqueSort=function(w){ee=w},this.setTransparentSort=function(w){le=w},this.getClearColor=function(w){return w.copy(O.getClearColor())},this.setClearColor=function(){O.setClearColor(...arguments)},this.getClearAlpha=function(){return O.getClearAlpha()},this.setClearAlpha=function(){O.setClearAlpha(...arguments)},this.clear=function(w=!0,F=!0,Z=!0){let V=0;if(w){let Y=!1;if(X!==null){let Se=X.texture.format;Y=p.has(Se)}if(Y){let Se=X.texture.type,De=m.has(Se),xe=O.getClearColor(),we=O.getClearAlpha(),Fe=xe.r,Qe=xe.g,_t=xe.b;De?(y[0]=Fe,y[1]=Qe,y[2]=_t,y[3]=we,z.clearBufferuiv(z.COLOR,0,y)):(v[0]=Fe,v[1]=Qe,v[2]=_t,v[3]=we,z.clearBufferiv(z.COLOR,0,v))}else V|=z.COLOR_BUFFER_BIT}F&&(V|=z.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Z&&(V|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V!==0&&z.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(w){w.setRenderer(this),L=w},this.dispose=function(){t.removeEventListener("webglcontextlost",ze,!1),t.removeEventListener("webglcontextrestored",nt,!1),t.removeEventListener("webglcontextcreationerror",Te,!1),O.dispose(),ve.dispose(),te.dispose(),Je.dispose(),He.dispose(),C.dispose(),ue.dispose(),q.dispose(),pe.dispose(),ke.dispose(),re.dispose(),he.dispose(),he.removeEventListener("sessionstart",G0),he.removeEventListener("sessionend",V0),vr.stop()};function ze(w){w.preventDefault(),Va("WebGLRenderer: Context Lost."),A=!0}function nt(){Va("WebGLRenderer: Context Restored."),A=!1;let w=un.autoReset,F=me.enabled,Z=me.autoUpdate,V=me.needsUpdate,Y=me.type;it(),un.autoReset=w,me.enabled=F,me.autoUpdate=Z,me.needsUpdate=V,me.type=Y}function Te(w){qe("WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function It(w){let F=w.target;F.removeEventListener("dispose",It),_n(F)}function _n(w){zs(w),He.remove(w)}function zs(w){let F=He.get(w).programs;F!==void 0&&(F.forEach(function(Z){re.releaseProgram(Z)}),w.isShaderMaterial&&re.releaseShaderCache(w))}this.renderBufferDirect=function(w,F,Z,V,Y,Se){F===null&&(F=ln);let De=Y.isMesh&&Y.matrixWorld.determinantAffine()<0,xe=av(w,F,Z,V,Y);Me.setMaterial(V,De);let we=Z.index,Fe=1;if(V.wireframe===!0){if(we=q.getWireframeAttribute(Z),we===void 0)return;Fe=2}let Qe=Z.drawRange,_t=Z.attributes.position,Ne=Qe.start*Fe,yt=(Qe.start+Qe.count)*Fe;Se!==null&&(Ne=Math.max(Ne,Se.start*Fe),yt=Math.min(yt,(Se.start+Se.count)*Fe)),we!==null?(Ne=Math.max(Ne,0),yt=Math.min(yt,we.count)):_t!=null&&(Ne=Math.max(Ne,0),yt=Math.min(yt,_t.count));let rn=yt-Ne;if(rn<0||rn===1/0)return;pe.setup(Y,V,xe,Z,we);let Bt,Ut=Q;if(we!==null&&(Bt=E.get(we),Ut=ge,Ut.setIndex(Bt)),Y.isMesh)V.wireframe===!0?(Me.setLineWidth(V.wireframeLinewidth*Nn()),Ut.setMode(z.LINES)):Ut.setMode(z.TRIANGLES);else if(Y.isLine){let Un=V.linewidth;Un===void 0&&(Un=1),Me.setLineWidth(Un*Nn()),Y.isLineSegments?Ut.setMode(z.LINES):Y.isLineLoop?Ut.setMode(z.LINE_LOOP):Ut.setMode(z.LINE_STRIP)}else Y.isPoints?Ut.setMode(z.POINTS):Y.isSprite&&Ut.setMode(z.TRIANGLES);if(Y.isBatchedMesh)if(Vt.get("WEBGL_multi_draw"))Ut.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else{let Un=Y._multiDrawStarts,Ue=Y._multiDrawCounts,qn=Y._multiDrawCount,At=we?E.get(we).bytesPerElement:1,Sr=He.get(V).currentProgram.getUniforms();for(let On=0;On<qn;On++)Sr.setValue(z,"_gl_DrawID",On),Ut.render(Un[On]/At,Ue[On])}else if(Y.isInstancedMesh)Ut.renderInstances(Ne,rn,Y.count);else if(Z.isInstancedBufferGeometry){let Un=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,Ue=Math.min(Z.instanceCount,Un);Ut.renderInstances(Ne,rn,Ue)}else Ut.render(Ne,rn)};function H0(w,F,Z,V){L!==null&&w.isNodeMaterial&&L.setObject(V,w),pt===!0&&ne.setState(w,Z,!1),w.transparent===!0&&w.side===bn&&w.forceSinglePass===!1?(w.side=Pn,w.needsUpdate=!0,Ra(w,F,V),w.side=Qi,w.needsUpdate=!0,Ra(w,F,V),w.side=bn):Ra(w,F,V)}this.compile=function(w,F,Z=null){Z===null&&(Z=w),L!==null&&L.renderStart(w,F,Z),M=te.get(Z),M.init(F),b.push(M),Z.traverseVisible(function(Y){Y.isLight&&Y.layers.test(F.layers)&&(M.pushLight(Y),Y.castShadow&&M.pushShadow(Y))}),w!==Z&&w.traverseVisible(function(Y){Y.isLight&&Y.layers.test(F.layers)&&(M.pushLight(Y),Y.castShadow&&M.pushShadow(Y))}),M.setupLights(),L!==null&&L.updateLights(M.state.lightsArray),Dt=this.localClippingEnabled,pt=ne.init(this.clippingPlanes,Dt),pt===!0&&ne.setGlobalState(this.clippingPlanes,F),L!==null&&me.render(M.state.shadowsArray,Z,F);let V=new Set;return w.traverse(function(Y){if(!(Y.isMesh||Y.isPoints||Y.isLine||Y.isSprite))return;let Se=Y.material;if(Se)if(Array.isArray(Se))for(let De=0;De<Se.length;De++){let xe=Se[De];H0(xe,Z,F,Y),V.add(xe)}else H0(Se,Z,F,Y),V.add(Se)}),M=b.pop(),L!==null&&L.renderEnd(),V},this.compileAsync=function(w,F,Z=null){let V=this.compile(w,F,Z);return new Promise(Y=>{function Se(){if(V.forEach(function(De){let we=He.get(De).currentProgram;(we===void 0||we.isReady())&&V.delete(De)}),V.size===0){Y(w);return}setTimeout(Se,10)}Vt.get("KHR_parallel_shader_compile")!==null?Se():setTimeout(Se,10)})};let $f=null;function rv(w){$f&&$f(w)}function G0(){vr.stop()}function V0(){vr.start()}let vr=new $x;vr.setAnimationLoop(rv),typeof self<"u"&&vr.setContext(self),this.setAnimationLoop=function(w){$f=w,he.setAnimationLoop(w),w===null?vr.stop():vr.start()},he.addEventListener("sessionstart",G0),he.addEventListener("sessionend",V0),this.render=function(w,F){if(F!==void 0&&F.isCamera!==!0){qe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;L!==null&&L.renderStart(w,F);let Z=he.enabled===!0&&he.isPresenting===!0,V=R!==null&&(X===null||Z)&&R.begin(I,X);if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),he.enabled===!0&&he.isPresenting===!0&&(R===null||R.isCompositing()===!1)&&(he.cameraAutoUpdate===!0&&he.updateCamera(F),F=he.getCamera()),w.isScene===!0&&w.onBeforeRender(I,w,F,X),M=te.get(w,b.length),M.init(F),M.state.textureUnits=Je.getTextureUnits(),b.push(M),ft.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),F.isArrayCamera?Ze.setFromArrayCamera(F):Ae.setFromProjectionMatrix(ft,_i,F.reversedDepth),Dt=this.localClippingEnabled,pt=ne.init(this.clippingPlanes,Dt),T=ve.get(w,_.length),T.init(),_.push(T),this.info.render.frame++,he.enabled===!0&&he.isPresenting===!0){let De=I.xr.getDepthSensingMesh();De!==null&&Kf(De,F,-1/0,I.sortObjects)}Kf(w,F,0,I.sortObjects),T.finish(),L!==null&&L.updateLights(M.state.lightsArray),I.sortObjects===!0&&T.sort(ee,le),Dn=he.enabled===!1||he.isPresenting===!1||he.hasDepthSensing()===!1,Dn&&O.addToRenderList(T,w),this.info.autoReset===!0&&this.info.reset(),pt===!0&&ne.beginShadows();let Y=M.state.shadowsArray;if(me.render(Y,w,F),pt===!0&&ne.endShadows(),(V&&R.hasRenderPass())===!1){let De=T.opaque,xe=T.transmissive;if(M.setupLights(),F.isArrayCamera){let we=F.cameras;if(xe.length>0)for(let Fe=0,Qe=we.length;Fe<Qe;Fe++){let _t=we[Fe];X0(De,xe,w,_t)}Dn&&O.render(w);for(let Fe=0,Qe=we.length;Fe<Qe;Fe++){let _t=we[Fe];W0(T,w,_t,_t.viewport)}}else xe.length>0&&X0(De,xe,w,F),Dn&&O.render(w),W0(T,w,F)}X!==null&&$===0&&(Je.updateMultisampleRenderTarget(X),Je.updateRenderTargetMipmap(X)),V&&R.end(I),w.isScene===!0&&w.onAfterRender(I,w,F),pe.resetDefaultState(),G=-1,J=null,b.pop(),b.length>0?(M=b[b.length-1],Je.setTextureUnits(M.state.textureUnits),pt===!0&&ne.setGlobalState(I.clippingPlanes,M.state.camera)):M=null,_.pop(),_.length>0?T=_[_.length-1]:T=null,L!==null&&L.renderEnd()};function Kf(w,F,Z,V){if(w.visible===!1)return;if(w.layers.test(F.layers)){if(w.isGroup)Z=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(F);else if(w.isLight)M.pushLight(w),w.castShadow&&M.pushShadow(w);else if(w.isSprite){let De=F.isArrayCamera?Ze:Ae;if(!w.frustumCulled||w.intersectsFrustum(De)){V&&Ct.setFromMatrixPosition(w.matrixWorld).applyMatrix4(ft);let xe=ue.update(w),we=w.material;we.visible&&T.push(w,xe,we,Z,Ct.z,null,F)}}else if(w.isMesh||w.isLine||w.isPoints){let De=F.isArrayCamera?Ze:Ae;if(!w.frustumCulled||w.intersectsFrustum(De)){let xe=ue.update(w),we=w.material;if(V&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Ct.copy(w.boundingSphere.center)):(xe.boundingSphere===null&&xe.computeBoundingSphere(),Ct.copy(xe.boundingSphere.center)),Ct.applyMatrix4(w.matrixWorld).applyMatrix4(ft)),Array.isArray(we)){let Fe=xe.groups;for(let Qe=0,_t=Fe.length;Qe<_t;Qe++){let Ne=Fe[Qe],yt=we[Ne.materialIndex];yt&&yt.visible&&T.push(w,xe,yt,Z,Ct.z,Ne,F)}}else we.visible&&T.push(w,xe,we,Z,Ct.z,null,F)}}}let Se=w.children;for(let De=0,xe=Se.length;De<xe;De++)Kf(Se[De],F,Z,V)}function W0(w,F,Z,V){let{opaque:Y,transmissive:Se,transparent:De}=w;M.setupLightsView(Z),pt===!0&&ne.setGlobalState(I.clippingPlanes,Z),V&&Me.viewport(se.copy(V)),Y.length>0&&Tl(Y,F,Z),Se.length>0&&Tl(Se,F,Z),De.length>0&&Tl(De,F,Z),Me.buffers.depth.setTest(!0),Me.buffers.depth.setMask(!0),Me.buffers.color.setMask(!0),Me.setPolygonOffset(!1)}function X0(w,F,Z,V){if((Z.isScene===!0?Z.overrideMaterial:null)!==null)return;if(M.state.transmissionRenderTarget[V.id]===void 0){let Ne=Vt.has("EXT_color_buffer_half_float")||Vt.has("EXT_color_buffer_float");M.state.transmissionRenderTarget[V.id]=new tn(1,1,{generateMipmaps:!0,type:Ne?pn:ri,minFilter:Mi,samples:Math.max(4,Wt.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:et.workingColorSpace})}let Se=M.state.transmissionRenderTarget[V.id],De=V.viewport||se;Se.setSize(De.z*I.transmissionResolutionScale,De.w*I.transmissionResolutionScale);let xe=I.getRenderTarget(),we=I.getActiveCubeFace(),Fe=I.getActiveMipmapLevel();I.setRenderTarget(Se),I.getClearColor(j),N=I.getClearAlpha(),N<1&&I.setClearColor(16777215,.5),I.clear(),Dn&&O.render(Z);let Qe=I.toneMapping;I.toneMapping=es;let _t=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),M.setupLightsView(V),pt===!0&&ne.setGlobalState(I.clippingPlanes,V),Tl(w,Z,V),Je.updateMultisampleRenderTarget(Se),Je.updateRenderTargetMipmap(Se),Vt.has("WEBGL_multisampled_render_to_texture")===!1){let Ne=!1;for(let yt=0,rn=F.length;yt<rn;yt++){let Bt=F[yt],{object:Ut,geometry:Un,material:Ue,group:qn}=Bt;if(Ue.side===bn&&Ut.layers.test(V.layers)){let At=Ue.side;Ue.side=Pn,Ue.needsUpdate=!0,q0(Ut,Z,V,Un,Ue,qn),Ue.side=At,Ue.needsUpdate=!0,Ne=!0}}Ne===!0&&(Je.updateMultisampleRenderTarget(Se),Je.updateRenderTargetMipmap(Se))}I.setRenderTarget(xe,we,Fe),I.setClearColor(j,N),_t!==void 0&&(V.viewport=_t),I.toneMapping=Qe}function Tl(w,F,Z){let V=F.isScene===!0?F.overrideMaterial:null;for(let Y=0,Se=w.length;Y<Se;Y++){let De=w[Y],{object:xe,geometry:we,group:Fe}=De,Qe=De.material;Qe.allowOverride===!0&&V!==null&&(Qe=V),xe.layers.test(Z.layers)&&q0(xe,F,Z,we,Qe,Fe)}}function q0(w,F,Z,V,Y,Se){L!==null&&Y.isNodeMaterial&&L.setObject(w,Y),w.onBeforeRender(I,F,Z,V,Y,Se),w.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),Y.onBeforeRender(I,F,Z,V,w,Se),Y.transparent===!0&&Y.side===bn&&Y.forceSinglePass===!1?(Y.side=Pn,Y.needsUpdate=!0,I.renderBufferDirect(Z,F,V,Y,w,Se),Y.side=Qi,Y.needsUpdate=!0,I.renderBufferDirect(Z,F,V,Y,w,Se),Y.side=bn):I.renderBufferDirect(Z,F,V,Y,w,Se),w.onAfterRender(I,F,Z,V,Y,Se)}function Y0(w){let F=0;for(let Z of w)Z.texture!==null&&F++;return F}function Ra(w,F,Z){F.isScene!==!0&&(F=ln);let V=He.get(w),Y=M.state.lights,Se=M.state.shadowsArray,De=Y.state.version,xe=re.getParameters(w,Y.state,Se,F,Z,M.state.lightProbeGridArray),we=re.getProgramCacheKey(xe),Fe=V.programs;V.environment=w.isMeshStandardMaterial||w.isMeshLambertMaterial||w.isMeshPhongMaterial?F.environment:null,V.fog=F.fog;let Qe=w.isMeshStandardMaterial||w.isMeshLambertMaterial&&!w.envMap||w.isMeshPhongMaterial&&!w.envMap;V.envMap=C.get(w.envMap||V.environment,Qe),V.envMapRotation=V.environment!==null&&w.envMap===null?F.environmentRotation:w.envMapRotation,Fe===void 0&&(w.addEventListener("dispose",It),Fe=new Map,V.programs=Fe,V.programVariants=new Map);let _t=Fe.get(we);if(_t!==void 0){if(V.currentProgram===_t&&V.lightsStateVersion===De)return K0(w,xe),_t}else xe.uniforms=re.getUniforms(w),L!==null&&w.isNodeMaterial&&L.build(w,Z,xe),w.onBeforeCompile(xe,I),_t=re.acquireProgram(xe,we),Fe.set(we,_t),V.uniforms=xe.uniforms;let Ne=V.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Ne.clippingPlanes=ne.uniform),K0(w,xe),V.needsLights=lv(w),V.lightsStateVersion=De,V.needsLights&&(Ne.ambientLightColor.value=Y.state.ambient,Ne.lightProbe.value=Y.state.probe,Ne.sunLights.value=Y.state.sun,Ne.sunLightShadows.value=Y.state.sunShadow,Ne.directionalLights.value=Y.state.directional,Ne.directionalLightShadows.value=Y.state.directionalShadow,Ne.spotLights.value=Y.state.spot,Ne.spotLightShadows.value=Y.state.spotShadow,Ne.rectAreaLights.value=Y.state.rectArea,Ne.ltc_1.value=Y.state.rectAreaLTC1,Ne.ltc_2.value=Y.state.rectAreaLTC2,Ne.pointLights.value=Y.state.point,Ne.pointLightShadows.value=Y.state.pointShadow,Ne.hemisphereLights.value=Y.state.hemi,Ne.sunShadowMatrix.value=Y.state.sunShadowMatrix,Ne.sunShadowCascade.value=Y.state.sunShadowCascade,Ne.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,Ne.spotLightMatrix.value=Y.state.spotLightMatrix,Ne.spotLightMap.value=Y.state.spotLightMap,Ne.pointShadowMatrix.value=Y.state.pointShadowMatrix),V.numLightProbeGrids=Y0(M.state.lightProbeGridArray),V.currentProgram=_t,V.uniformsList=null,_t}function ov(w,F,Z,V,Y){let Se=He.get(w),De=Se.currentProgram.id+","+V+","+Y,xe=Se.programVariants.get(De);return xe===void 0?(xe=Ra(w,F,Z),Se.programVariants.set(De,xe)):(Se.currentProgram=xe,Se.uniformsList=null,Se.outputColorSpace=V,Se.toneMapping=Y),xe}function $0(w){if(w.uniformsList===null){let F=w.currentProgram.getUniforms();w.uniformsList=ia.seqWithValue(F.seq,w.uniforms)}return w.uniformsList}function K0(w,F){let Z=He.get(w);Z.outputColorSpace=F.outputColorSpace,Z.batching=F.batching,Z.batchingColor=F.batchingColor,Z.instancing=F.instancing,Z.instancingColor=F.instancingColor,Z.instancingMorph=F.instancingMorph,Z.skinning=F.skinning,Z.morphTargets=F.morphTargets,Z.morphNormals=F.morphNormals,Z.morphColors=F.morphColors,Z.morphTargetsCount=F.morphTargetsCount,Z.numClippingPlanes=F.numClippingPlanes,Z.numIntersection=F.numClipIntersection,Z.vertexAlphas=F.vertexAlphas,Z.vertexTangents=F.vertexTangents,Z.toneMapping=F.toneMapping}function av(w,F,Z,V,Y){F.isScene!==!0&&(F=ln),Je.resetTextureUnits();let Se=F.fog,De=V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial?F.environment:null,xe=X===null?I.outputColorSpace:X.isXRRenderTarget===!0?X.texture.colorSpace:et.workingColorSpace,we=V.isMeshStandardMaterial||V.isMeshLambertMaterial&&!V.envMap||V.isMeshPhongMaterial&&!V.envMap,Fe=C.get(V.envMap||De,we),Qe=V.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,_t=!!Z.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Ne=!!Z.morphAttributes.position,yt=!!Z.morphAttributes.normal,rn=!!Z.morphAttributes.color,Bt=es;V.toneMapped&&(X===null||X.isXRRenderTarget===!0)&&(Bt=I.toneMapping);let Ut=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,Un=Ut!==void 0?Ut.length:0,Ue=He.get(V),qn=M.state.lights;if(pt===!0&&(Dt===!0||w!==J)){let Yt=w===J&&V.id===G;ne.setState(V,w,Yt)}let At=!1,Sr=!1;V.version===Ue.__version?Ue.needsLights&&Ue.lightsStateVersion!==qn.state.version||Y.isBatchedMesh&&Ue.batching===!1||!Y.isBatchedMesh&&Ue.batching===!0||Y.isBatchedMesh&&Ue.batchingColor===!0&&Y._colorsTexture===null||Y.isBatchedMesh&&Ue.batchingColor===!1&&Y._colorsTexture!==null||Y.isInstancedMesh&&Ue.instancing===!1||!Y.isInstancedMesh&&Ue.instancing===!0||Y.isSkinnedMesh&&Ue.skinning===!1||!Y.isSkinnedMesh&&Ue.skinning===!0||Y.isInstancedMesh&&Ue.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&Ue.instancingColor===!1&&Y.instanceColor!==null||Y.isInstancedMesh&&Ue.instancingMorph===!0&&Y.morphTexture===null||Y.isInstancedMesh&&Ue.instancingMorph===!1&&Y.morphTexture!==null||Ue.envMap!==Fe||V.fog===!0&&Ue.fog!==Se||Ue.numClippingPlanes!==void 0&&(Ue.numClippingPlanes!==ne.numPlanes||Ue.numIntersection!==ne.numIntersection)||Ue.vertexAlphas!==Qe||Ue.vertexTangents!==_t||Ue.morphTargets!==Ne||Ue.morphNormals!==yt||Ue.morphColors!==rn||Ue.morphTargetsCount!==Un||Ue.numLightProbeGrids!==Y0(M.state.lightProbeGridArray)?At=!0:(Ue.outputColorSpace!==xe||Ue.toneMapping!==Bt)&&(Sr=!0):(At=!0,Ue.__version=V.version);let On=Ue.currentProgram;(At===!0||Sr===!0)&&(On=Sr===!0?ov(V,F,Y,xe,Bt):Ra(V,F,Y),L&&V.isNodeMaterial&&L.onUpdateProgram(V,On,Ue));let El=!1,Hs=!1,Mr=!1,Mt=On.getUniforms(),Rn=Ue.uniforms;if(Me.useProgram(On.program)&&(El=!0,Hs=!0,Mr=!0),V.id!==G&&(G=V.id,Hs=!0),El||J!==w){Me.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),Mt.setValue(z,"projectionMatrix",w.projectionMatrix),Mt.setValue(z,"viewMatrix",w.matrixWorldInverse);let yn=Mt.map.cameraPosition;yn!==void 0&&yn.setValue(z,Ln.setFromMatrixPosition(w.matrixWorld)),Wt.logarithmicDepthBuffer&&Mt.setValue(z,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&Mt.setValue(z,"isOrthographic",w.isOrthographicCamera===!0),J!==w&&(J=w,Hs=!0,Mr=!0)}if(Ue.needsLights&&(qn.state.sunShadowMap.length>0&&Mt.setValue(z,"sunShadowMap",qn.state.sunShadowMap,Je),qn.state.directionalShadowMap.length>0&&Mt.setValue(z,"directionalShadowMap",qn.state.directionalShadowMap,Je),qn.state.spotShadowMap.length>0&&Mt.setValue(z,"spotShadowMap",qn.state.spotShadowMap,Je),qn.state.pointShadowMap.length>0&&Mt.setValue(z,"pointShadowMap",qn.state.pointShadowMap,Je)),Y.isSkinnedMesh){Mt.setOptional(z,Y,"bindMatrix"),Mt.setOptional(z,Y,"bindMatrixInverse");let Yt=Y.skeleton;Yt&&(Yt.boneTexture===null&&Yt.computeBoneTexture(),Mt.setValue(z,"boneTexture",Yt.boneTexture,Je))}Y.isBatchedMesh&&(Mt.setOptional(z,Y,"batchingTexture"),Mt.setValue(z,"batchingTexture",Y._matricesTexture,Je),Mt.setOptional(z,Y,"batchingIdTexture"),Mt.setValue(z,"batchingIdTexture",Y._indirectTexture,Je),Mt.setOptional(z,Y,"batchingColorTexture"),Y._colorsTexture!==null&&Mt.setValue(z,"batchingColorTexture",Y._colorsTexture,Je));let Li=Z.morphAttributes;if((Li.position!==void 0||Li.normal!==void 0||Li.color!==void 0)&&ie.update(Y,Z,On),(Hs||Ue.receiveShadow!==Y.receiveShadow)&&(Ue.receiveShadow=Y.receiveShadow,Mt.setValue(z,"receiveShadow",Y.receiveShadow)),(V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial)&&V.envMap===null&&F.environment!==null&&(Rn.envMapIntensity.value=F.environmentIntensity),Rn.dfgLUT!==void 0&&(Rn.dfgLUT.value=dE()),Hs){if(Mt.setValue(z,"toneMappingExposure",I.toneMappingExposure),Ue.needsLights&&cv(Rn,Mr),Se&&V.fog===!0&&de.refreshFogUniforms(Rn,Se),de.refreshMaterialUniforms(Rn,V,k,W,M.state.transmissionRenderTarget[w.id]),Ue.needsLights&&Ue.numLightProbeGrids>0){let Yt=S,yn=0;for(let hs of M.state.lightProbeGridArray)hs.texture!==null&&(Yt.textures[yn]=hs.texture,Yt.min[yn]=hs.boundingBox.min,Yt.max[yn]=hs.boundingBox.max,Yt.resolution[yn]=hs.resolution,yn++);for(let hs in Yt)Yt[hs].length=yn;Rn.probesSH.value=Yt.textures,Rn.probesMin.value=Yt.min,Rn.probesMax.value=Yt.max,Rn.probesResolution.value=Yt.resolution}ia.upload(z,$0(Ue),Rn,Je)}if(V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(ia.upload(z,$0(Ue),Rn,Je),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&Mt.setValue(z,"center",Y.center),Mt.setValue(z,"modelViewMatrix",Y.modelViewMatrix),Mt.setValue(z,"normalMatrix",Y.normalMatrix),Mt.setValue(z,"modelMatrix",Y.matrixWorld),V.uniformsGroups!==void 0){let Yt=V.uniformsGroups;for(let yn=0,hs=Yt.length;yn<hs;yn++){let J0=Yt[yn];ke.update(J0,On),ke.bind(J0,On)}}return On}function cv(w,F){w.ambientLightColor.needsUpdate=F,w.lightProbe.needsUpdate=F,w.sunLights.needsUpdate=F,w.sunLightShadows.needsUpdate=F,w.directionalLights.needsUpdate=F,w.directionalLightShadows.needsUpdate=F,w.pointLights.needsUpdate=F,w.pointLightShadows.needsUpdate=F,w.spotLights.needsUpdate=F,w.spotLightShadows.needsUpdate=F,w.rectAreaLights.needsUpdate=F,w.hemisphereLights.needsUpdate=F}function lv(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return K},this.getActiveMipmapLevel=function(){return $},this.getRenderTarget=function(){return X},this.setRenderTargetTextures=function(w,F,Z){let V=He.get(w);V.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),He.get(w.texture).__webglTexture=F,He.get(w.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:Z,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,F){let Z=He.get(w);Z.__webglFramebuffer=F,Z.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(w,F=0,Z=0){X=w,K=F,$=Z;let V=null,Y=!1,Se=!1;if(w){let xe=He.get(w);if(xe.__useDefaultFramebuffer!==void 0){Me.bindFramebuffer(z.FRAMEBUFFER,xe.__webglFramebuffer),se.copy(w.viewport),ye.copy(w.scissor),Le=w.scissorTest,Me.viewport(se),Me.scissor(ye),Me.setScissorTest(Le),G=-1;return}else if(xe.__webglFramebuffer===void 0)Je.setupRenderTarget(w);else if(xe.__hasExternalTextures)Je.rebindTextures(w,He.get(w.texture).__webglTexture,He.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){let Qe=w.depthTexture;if(xe.__boundDepthTexture!==Qe){if(Qe!==null&&He.has(Qe)&&(w.width!==Qe.image.width||w.height!==Qe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Je.setupDepthRenderbuffer(w)}}let we=w.texture;(we.isData3DTexture||we.isDataArrayTexture||we.isCompressedArrayTexture)&&(Se=!0);let Fe=He.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Fe[F])?V=Fe[F][Z]:V=Fe[F],Y=!0):w.samples>0&&Je.useMultisampledRTT(w)===!1?V=He.get(w).__webglMultisampledFramebuffer:Array.isArray(Fe)?V=Fe[Z]:V=Fe,se.copy(w.viewport),ye.copy(w.scissor),Le=w.scissorTest}else se.copy(ae).multiplyScalar(k).floor(),ye.copy(Ie).multiplyScalar(k).floor(),Le=Ce;if(Z!==0&&(V=B),Me.bindFramebuffer(z.FRAMEBUFFER,V)&&Me.drawBuffers(w,V),Me.viewport(se),Me.scissor(ye),Me.setScissorTest(Le),Y){let xe=He.get(w.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+F,xe.__webglTexture,Z)}else if(Se){let xe=F;for(let we=0;we<w.textures.length;we++){let Fe=He.get(w.textures[we]);z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0+we,Fe.__webglTexture,Z,xe)}}else if(w!==null&&Z!==0){let xe=He.get(w.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,xe.__webglTexture,Z)}G=-1};function Z0(w){let F=He.get(w);return(F.__readFormat!==w.format||F.__readType!==w.type)&&(F.__readFormat=w.format,F.__readType=w.type,F.__formatReadable=Wt.textureFormatReadable(w.format),F.__typeReadable=Wt.textureTypeReadable(w.type)),F}this.readRenderTargetPixels=function(w,F,Z,V,Y,Se,De,xe=0){if(!(w&&w.isWebGLRenderTarget)){qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let we=He.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&De!==void 0&&(we=we[De],Array.isArray(we)&&(we=we[0])),we){Me.bindFramebuffer(z.FRAMEBUFFER,we);try{let Fe=w.textures[xe],Qe=Fe.format,_t=Fe.type;w.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+xe);let Ne=Z0(Fe);if(Ne.__formatReadable===!1){qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ne.__typeReadable===!1){qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=w.width-V&&Z>=0&&Z<=w.height-Y&&z.readPixels(F,Z,V,Y,fe.convert(Qe),fe.convert(_t),Se)}finally{let Fe=X!==null?He.get(X).__webglFramebuffer:null;Me.bindFramebuffer(z.FRAMEBUFFER,Fe)}}},this.readRenderTargetPixelsAsync=async function(w,F,Z,V,Y,Se,De,xe=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let we=He.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&De!==void 0&&(we=we[De],Array.isArray(we)&&(we=we[0])),we)if(F>=0&&F<=w.width-V&&Z>=0&&Z<=w.height-Y){Me.bindFramebuffer(z.FRAMEBUFFER,we);let Fe=w.textures[xe],Qe=Fe.format,_t=Fe.type;w.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+xe);let Ne=Z0(Fe);if(Ne.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ne.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let yt=z.createBuffer();z.bindBuffer(z.PIXEL_PACK_BUFFER,yt),z.bufferData(z.PIXEL_PACK_BUFFER,Se.byteLength,z.STREAM_READ),z.readPixels(F,Z,V,Y,fe.convert(Qe),fe.convert(_t),0),z.bindBuffer(z.PIXEL_PACK_BUFFER,null);let rn=X!==null?He.get(X).__webglFramebuffer:null;Me.bindFramebuffer(z.FRAMEBUFFER,rn);let Bt=z.fenceSync(z.SYNC_GPU_COMMANDS_COMPLETE,0);return z.flush(),await Mx(z,Bt,4),z.bindBuffer(z.PIXEL_PACK_BUFFER,yt),z.getBufferSubData(z.PIXEL_PACK_BUFFER,0,Se),z.bindBuffer(z.PIXEL_PACK_BUFFER,null),z.deleteBuffer(yt),z.deleteSync(Bt),Se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,F=null,Z=0){let V=Math.pow(2,-Z),Y=Math.floor(w.image.width*V),Se=Math.floor(w.image.height*V),De=F!==null?F.x:0,xe=F!==null?F.y:0;Je.setTexture2D(w,0),z.copyTexSubImage2D(z.TEXTURE_2D,Z,0,0,De,xe,Y,Se),Me.unbindTexture()},this.copyTextureToTexture=function(w,F,Z=null,V=null,Y=0,Se=0){let De,xe,we,Fe,Qe,_t,Ne,yt,rn,Bt=w.isCompressedTexture?w.mipmaps[Se]:w.image;if(Z!==null)De=Z.max.x-Z.min.x,xe=Z.max.y-Z.min.y,we=Z.isBox3?Z.max.z-Z.min.z:1,Fe=Z.min.x,Qe=Z.min.y,_t=Z.isBox3?Z.min.z:0;else{let Mt=Math.pow(2,-Y);De=Math.floor(Bt.width*Mt),xe=Math.floor(Bt.height*Mt),w.isDataArrayTexture?we=Bt.depth:w.isData3DTexture?we=Math.floor(Bt.depth*Mt):we=1,Fe=0,Qe=0,_t=0}V!==null?(Ne=V.x,yt=V.y,rn=V.z):(Ne=0,yt=0,rn=0);let Ut=fe.convert(F.format),Un=fe.convert(F.type),Ue;F.isData3DTexture?(Je.setTexture3D(F,0),Ue=z.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(Je.setTexture2DArray(F,0),Ue=z.TEXTURE_2D_ARRAY):(Je.setTexture2D(F,0),Ue=z.TEXTURE_2D),Me.activeTexture(z.TEXTURE0),Me.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,F.flipY),Me.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),Me.pixelStorei(z.UNPACK_ALIGNMENT,F.unpackAlignment);let qn=Me.getParameter(z.UNPACK_ROW_LENGTH),At=Me.getParameter(z.UNPACK_IMAGE_HEIGHT),Sr=Me.getParameter(z.UNPACK_SKIP_PIXELS),On=Me.getParameter(z.UNPACK_SKIP_ROWS),El=Me.getParameter(z.UNPACK_SKIP_IMAGES);Me.pixelStorei(z.UNPACK_ROW_LENGTH,Bt.width),Me.pixelStorei(z.UNPACK_IMAGE_HEIGHT,Bt.height),Me.pixelStorei(z.UNPACK_SKIP_PIXELS,Fe),Me.pixelStorei(z.UNPACK_SKIP_ROWS,Qe),Me.pixelStorei(z.UNPACK_SKIP_IMAGES,_t);let Hs=w.isDataArrayTexture||w.isData3DTexture,Mr=F.isDataArrayTexture||F.isData3DTexture;if(w.isDepthTexture){let Mt=He.get(w),Rn=He.get(F),Li=He.get(Mt.__renderTarget),Yt=He.get(Rn.__renderTarget);Me.bindFramebuffer(z.READ_FRAMEBUFFER,Li.__webglFramebuffer),Me.bindFramebuffer(z.DRAW_FRAMEBUFFER,Yt.__webglFramebuffer);for(let yn=0;yn<we;yn++)Hs&&(z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,He.get(w).__webglTexture,Y,_t+yn),z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,He.get(F).__webglTexture,Se,rn+yn)),z.blitFramebuffer(Fe,Qe,Fe+De,Qe+xe,Ne,yt,Ne+De,yt+xe,z.DEPTH_BUFFER_BIT,z.NEAREST);Me.bindFramebuffer(z.READ_FRAMEBUFFER,null),Me.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else if(Y!==0||w.isRenderTargetTexture||He.has(w)){let Mt=He.get(w),Rn=He.get(F);Me.bindFramebuffer(z.READ_FRAMEBUFFER,P),Me.bindFramebuffer(z.DRAW_FRAMEBUFFER,H);for(let Li=0;Li<we;Li++)Hs?z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,Mt.__webglTexture,Y,_t+Li):z.framebufferTexture2D(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,Mt.__webglTexture,Y),Mr?z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,Rn.__webglTexture,Se,rn+Li):z.framebufferTexture2D(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,Rn.__webglTexture,Se),Y!==0?z.blitFramebuffer(Fe,Qe,Fe+De,Qe+xe,Ne,yt,Ne+De,yt+xe,z.COLOR_BUFFER_BIT,z.NEAREST):Mr?z.copyTexSubImage3D(Ue,Se,Ne,yt,rn+Li,Fe,Qe,De,xe):z.copyTexSubImage2D(Ue,Se,Ne,yt,Fe,Qe,De,xe);Me.bindFramebuffer(z.READ_FRAMEBUFFER,null),Me.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else Mr?w.isDataTexture||w.isData3DTexture?z.texSubImage3D(Ue,Se,Ne,yt,rn,De,xe,we,Ut,Un,Bt.data):F.isCompressedArrayTexture?z.compressedTexSubImage3D(Ue,Se,Ne,yt,rn,De,xe,we,Ut,Bt.data):z.texSubImage3D(Ue,Se,Ne,yt,rn,De,xe,we,Ut,Un,Bt):w.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,Se,Ne,yt,De,xe,Ut,Un,Bt.data):w.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,Se,Ne,yt,Bt.width,Bt.height,Ut,Bt.data):z.texSubImage2D(z.TEXTURE_2D,Se,Ne,yt,De,xe,Ut,Un,Bt);Me.pixelStorei(z.UNPACK_ROW_LENGTH,qn),Me.pixelStorei(z.UNPACK_IMAGE_HEIGHT,At),Me.pixelStorei(z.UNPACK_SKIP_PIXELS,Sr),Me.pixelStorei(z.UNPACK_SKIP_ROWS,On),Me.pixelStorei(z.UNPACK_SKIP_IMAGES,El),Se===0&&F.generateMipmaps===!0&&F.mipmapsAutoUpdate===!0&&z.generateMipmap(Ue),Me.unbindTexture()},this.initRenderTarget=function(w){He.get(w).__webglFramebuffer===void 0&&Je.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?Je.setTextureCube(w,0):w.isData3DTexture?Je.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?Je.setTexture2DArray(w,0):Je.setTexture2D(w,0),Me.unbindTexture()},this.resetState=function(){K=0,$=0,X=null,Me.reset(),pe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return _i}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=et._getDrawingBufferColorSpace(e),t.unpackColorSpace=et._getUnpackColorSpace()}};var aa={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var pi=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},pE=new As(-1,1,1,-1,0,1),vp=class extends mt{constructor(){super(),this.setAttribute("position",new st([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new st([0,2,0,0,2,0],2))}},mE=new vp,tr=class{constructor(e){this._mesh=new We(mE,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,pE)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var ca=class extends pi{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof zt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Hi.clone(e.uniforms),this.material=new zt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new tr(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Rc=class extends pi{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){let s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},Th=class extends pi{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var Eh=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let i=e.getSize(new Ee);this._width=i.width,this._height=i.height,t=new tn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:pn}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new ca(aa),this.copyPass.material.blending=Rs,this.timer=new uc}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),i=!1;for(let s=0,r=this.passes.length;s<r;s++){let o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),o.needsSwap){if(i){let a=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}Rc!==void 0&&(o instanceof Rc?i=!0:o instanceof Th&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new Ee);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var wh=class extends pi{constructor(e,t,i=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new oe}render(e,t,i){let s=e.autoClear;e.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=s}};var r_={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new oe(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var la=class n extends pi{constructor(e,t=1,i,s){super(),this.strength=t,this.radius=i,this.threshold=s,this.resolution=e!==void 0?new Ee(e.x,e.y):new Ee(256,256),this.clearColor=new oe(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new tn(r,o,{type:pn,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){let h=new tn(r,o,{type:pn,depthBuffer:!1});h.texture.name="UnrealBloomPass.h"+u,h.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(h);let f=new tn(r,o,{type:pn,depthBuffer:!1});f.texture.name="UnrealBloomPass.v"+u,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),r=Math.round(r/2),o=Math.round(o/2)}let a=r_;this.highPassUniforms=Hi.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new zt({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let c=[6,10,14,18,22];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new Ee(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Hi.clone(aa.uniforms),this.blendMaterial=new zt({uniforms:this.copyUniforms,vertexShader:aa.vertexShader,fragmentShader:aa.fragmentShader,premultipliedAlpha:!0,blending:Bi,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new oe,this._oldClearAlpha=1,this._basic=new Sn,this._fsQuad=new tr(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(i,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(i,s),this.renderTargetsVertical[r].setSize(i,s),this.separableBlurMaterials[r].uniforms.invSize.value=new Ee(1/i,1/s),i=Math.round(i/2),s=Math.round(s/2)}render(e,t,i,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let a=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[c].uniforms.direction.value=n.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=n.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this._fsQuad.render(e),a=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=o}_getSeparableBlurMaterial(e){let t=[],i=e/3;for(let o=0;o<e;o++)t.push(.39894*Math.exp(-.5*o*o/(i*i))/i);let s=[],r=[];for(let o=1;o<e;o+=2){let a=t[o],c=o+1<e?t[o+1]:0,l=a+c;s.push((o*a+(o+1)*c)/l),r.push(l)}return new zt({defines:{KERNEL_PAIRS:s.length},uniforms:{colorTexture:{value:null},invSize:{value:new Ee(.5,.5)},direction:{value:new Ee(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:s},gaussianWeights:{value:r}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new zt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};la.BlurDirectionX=new Ee(1,0);la.BlurDirectionY=new Ee(0,1);var Cc={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var Ah=class extends pi{constructor(){super(),this.isOutputPass=!0,this.uniforms=Hi.clone(Cc.uniforms),this.material=new Yo({name:Cc.name,uniforms:this.uniforms,vertexShader:Cc.vertexShader,fragmentShader:Cc.fragmentShader}),this._fsQuad=new tr(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},et.getTransfer(this._outputColorSpace)===bt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===hc?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===fc?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===dc?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===pc?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Gr?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===gc?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===mc&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};function nr(n,e=!1){let t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},o={},a=n[0].morphTargetsRelative,c=new mt;c.morphTargetsRelative=a;let l=0;for(let u=0;u<n.length;++u){let h=n[u],f=0,d=0;if(t!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let g in h.attributes){if(!i.has(g))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+g+'" attribute exists among all geometries, or in none of them.'),null;r[g]===void 0&&(r[g]=[]),r[g].push(h.attributes[g]),f++}if(f!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(a!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let g in h.morphAttributes){if(!s.has(g))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;if(h.morphAttributes[g].length!==n[0].morphAttributes[g].length)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have the same number of morph targets for the "'+g+'" morph attribute.'),null;o[g]===void 0&&(o[g]=[]),o[g].push(h.morphAttributes[g]),d++}if(d!==s.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of morph attributes."),null;if(e){let g;if(t)g=h.index.count;else if(h.attributes.position!==void 0)g=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,g,u),l+=g}}if(t){let u=0,h=[];for(let f=0;f<n.length;++f){let d=n[f].index;for(let g=0;g<d.count;++g)h.push(d.getX(g)+u);u+=n[f].attributes.position.count}c.setIndex(h)}for(let u in r){let h=o_(r[u]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;c.setAttribute(u,h)}for(let u in o){let h=o[u][0].length;if(h!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[u]=[];for(let f=0;f<h;++f){let d=[];for(let x=0;x<o[u].length;++x)d.push(o[u][x][f]);let g=o_(d);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;c.morphAttributes[u].push(g)}}}return c}function o_(n){let e,t,i,s=-1,r=0;for(let l=0;l<n.length;++l){let u=n[l];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=u.normalized),i!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=u.gpuType),s!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.count*t}let o=new e(r),a=new $e(o,t,i),c=0;for(let l=0;l<n.length;++l){let u=n[l];if(u.isInterleavedBufferAttribute){let h=c/t;for(let f=0,d=u.count;f<d;f++)for(let g=0;g<t;g++){let x=u.getComponent(f,g);a.setComponent(f+h,g,x)}}else o.set(u.array,c);c+=u.count*t}return s!==void 0&&(a.gpuType=s),a}function Sp(n,e){if(e===Kd)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),n;if(e===na||e===bc){let t=n.getIndex();if(t===null){let r=[],o=n.getAttribute("position");if(o!==void 0){for(let a=0;a<o.count;a++)r.push(a);n.setIndex(r),t=n.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),n}let i=t.count-2,s=[];if(e===na)for(let r=1;r<=i;r++)s.push(t.getX(0)),s.push(t.getX(r)),s.push(t.getX(r+1));else for(let r=0;r<i;r++)r%2===0?(s.push(t.getX(r)),s.push(t.getX(r+1)),s.push(t.getX(r+2))):(s.push(t.getX(r+2)),s.push(t.getX(r+1)),s.push(t.getX(r)));return s.length/3!==i&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),n.setIndex(s),n.clearGroups(),n}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),n}var Mp=class{constructor(){this.encoder=new TextEncoder,this._pieces=[],this._parts=[]}append_buffer(e){this.flush(),this._parts.push(e)}append(e){this._pieces.push(e)}flush(){if(this._pieces.length>0){let e=new Uint8Array(this._pieces);this._parts.push(e),this._pieces=[]}}toArrayBuffer(){let e=[];for(let t of this._parts)e.push(t);return gE(e).buffer}};function gE(n){let e=0;for(let s of n)e+=s.byteLength;let t=new Uint8Array(e),i=0;for(let s of n){let r=new Uint8Array(s.buffer,s.byteOffset,s.byteLength);t.set(r,i),i+=s.byteLength}return t}function Ep(n){return new bp(n).unpack()}function wp(n){let e=new Tp,t=e.pack(n);return t instanceof Promise?t.then(()=>e.getBuffer()):e.getBuffer()}var bp=class{constructor(e){this.index=0,this.dataBuffer=e,this.dataView=new Uint8Array(this.dataBuffer),this.length=this.dataBuffer.byteLength}unpack(){let e=this.unpack_uint8();if(e<128)return e;if((e^224)<32)return(e^224)-32;let t;if((t=e^160)<=15)return this.unpack_raw(t);if((t=e^176)<=15)return this.unpack_string(t);if((t=e^144)<=15)return this.unpack_array(t);if((t=e^128)<=15)return this.unpack_map(t);switch(e){case 192:return null;case 193:return;case 194:return!1;case 195:return!0;case 202:return this.unpack_float();case 203:return this.unpack_double();case 204:return this.unpack_uint8();case 205:return this.unpack_uint16();case 206:return this.unpack_uint32();case 207:return this.unpack_uint64();case 208:return this.unpack_int8();case 209:return this.unpack_int16();case 210:return this.unpack_int32();case 211:return this.unpack_int64();case 212:return;case 213:return;case 214:return;case 215:return;case 216:return t=this.unpack_uint16(),this.unpack_string(t);case 217:return t=this.unpack_uint32(),this.unpack_string(t);case 218:return t=this.unpack_uint16(),this.unpack_raw(t);case 219:return t=this.unpack_uint32(),this.unpack_raw(t);case 220:return t=this.unpack_uint16(),this.unpack_array(t);case 221:return t=this.unpack_uint32(),this.unpack_array(t);case 222:return t=this.unpack_uint16(),this.unpack_map(t);case 223:return t=this.unpack_uint32(),this.unpack_map(t)}}unpack_uint8(){let e=this.dataView[this.index]&255;return this.index++,e}unpack_uint16(){let e=this.read(2),t=(e[0]&255)*256+(e[1]&255);return this.index+=2,t}unpack_uint32(){let e=this.read(4),t=((e[0]*256+e[1])*256+e[2])*256+e[3];return this.index+=4,t}unpack_uint64(){let e=this.read(8),t=((((((e[0]*256+e[1])*256+e[2])*256+e[3])*256+e[4])*256+e[5])*256+e[6])*256+e[7];return this.index+=8,t}unpack_int8(){let e=this.unpack_uint8();return e<128?e:e-256}unpack_int16(){let e=this.unpack_uint16();return e<32768?e:e-65536}unpack_int32(){let e=this.unpack_uint32();return e<2**31?e:e-2**32}unpack_int64(){let e=this.unpack_uint64();return e<2**63?e:e-2**64}unpack_raw(e){if(this.length<this.index+e)throw new Error(`BinaryPackFailure: index is out of range ${this.index} ${e} ${this.length}`);let t=this.dataBuffer.slice(this.index,this.index+e);return this.index+=e,t}unpack_string(e){let t=this.read(e),i=0,s="",r,o;for(;i<e;)r=t[i],r<160?(o=r,i++):(r^192)<32?(o=(r&31)<<6|t[i+1]&63,i+=2):(r^224)<16?(o=(r&15)<<12|(t[i+1]&63)<<6|t[i+2]&63,i+=3):(o=(r&7)<<18|(t[i+1]&63)<<12|(t[i+2]&63)<<6|t[i+3]&63,i+=4),s+=String.fromCodePoint(o);return this.index+=e,s}unpack_array(e){let t=new Array(e);for(let i=0;i<e;i++)t[i]=this.unpack();return t}unpack_map(e){let t={};for(let i=0;i<e;i++){let s=this.unpack();t[s]=this.unpack()}return t}unpack_float(){let e=this.unpack_uint32(),t=e>>31,i=(e>>23&255)-127,s=e&8388607|8388608;return(t===0?1:-1)*s*2**(i-23)}unpack_double(){let e=this.unpack_uint32(),t=this.unpack_uint32(),i=e>>31,s=(e>>20&2047)-1023,o=(e&1048575|1048576)*2**(s-20)+t*2**(s-52);return(i===0?1:-1)*o}read(e){let t=this.index;if(t+e<=this.length)return this.dataView.subarray(t,t+e);throw new Error("BinaryPackFailure: read index out of range")}},Tp=class{getBuffer(){return this._bufferBuilder.toArrayBuffer()}pack(e){if(typeof e=="string")this.pack_string(e);else if(typeof e=="number")Math.floor(e)===e?this.pack_integer(e):this.pack_double(e);else if(typeof e=="boolean")e===!0?this._bufferBuilder.append(195):e===!1&&this._bufferBuilder.append(194);else if(e===void 0)this._bufferBuilder.append(192);else if(typeof e=="object")if(e===null)this._bufferBuilder.append(192);else{let t=e.constructor;if(e instanceof Array){let i=this.pack_array(e);if(i instanceof Promise)return i.then(()=>this._bufferBuilder.flush())}else if(e instanceof ArrayBuffer)this.pack_bin(new Uint8Array(e));else if("BYTES_PER_ELEMENT"in e){let i=e;this.pack_bin(new Uint8Array(i.buffer,i.byteOffset,i.byteLength))}else if(e instanceof Date)this.pack_string(e.toString());else{if(e instanceof Blob)return e.arrayBuffer().then(i=>{this.pack_bin(new Uint8Array(i)),this._bufferBuilder.flush()});if(t==Object||t.toString().startsWith("class")){let i=this.pack_object(e);if(i instanceof Promise)return i.then(()=>this._bufferBuilder.flush())}else throw new Error(`Type "${t.toString()}" not yet supported`)}}else throw new Error(`Type "${typeof e}" not yet supported`);this._bufferBuilder.flush()}pack_bin(e){let t=e.length;if(t<=15)this.pack_uint8(160+t);else if(t<=65535)this._bufferBuilder.append(218),this.pack_uint16(t);else if(t<=4294967295)this._bufferBuilder.append(219),this.pack_uint32(t);else throw new Error("Invalid length");this._bufferBuilder.append_buffer(e)}pack_string(e){let t=this._textEncoder.encode(e),i=t.length;if(i<=15)this.pack_uint8(176+i);else if(i<=65535)this._bufferBuilder.append(216),this.pack_uint16(i);else if(i<=4294967295)this._bufferBuilder.append(217),this.pack_uint32(i);else throw new Error("Invalid length");this._bufferBuilder.append_buffer(t)}pack_array(e){let t=e.length;if(t<=15)this.pack_uint8(144+t);else if(t<=65535)this._bufferBuilder.append(220),this.pack_uint16(t);else if(t<=4294967295)this._bufferBuilder.append(221),this.pack_uint32(t);else throw new Error("Invalid length");let i=s=>{if(s<t){let r=this.pack(e[s]);return r instanceof Promise?r.then(()=>i(s+1)):i(s+1)}};return i(0)}pack_integer(e){if(e>=-32&&e<=127)this._bufferBuilder.append(e&255);else if(e>=0&&e<=255)this._bufferBuilder.append(204),this.pack_uint8(e);else if(e>=-128&&e<=127)this._bufferBuilder.append(208),this.pack_int8(e);else if(e>=0&&e<=65535)this._bufferBuilder.append(205),this.pack_uint16(e);else if(e>=-32768&&e<=32767)this._bufferBuilder.append(209),this.pack_int16(e);else if(e>=0&&e<=4294967295)this._bufferBuilder.append(206),this.pack_uint32(e);else if(e>=-2147483648&&e<=2147483647)this._bufferBuilder.append(210),this.pack_int32(e);else if(e>=-9223372036854776e3&&e<=9223372036854776e3)this._bufferBuilder.append(211),this.pack_int64(e);else if(e>=0&&e<=18446744073709552e3)this._bufferBuilder.append(207),this.pack_uint64(e);else throw new Error("Invalid integer")}pack_double(e){let t=0;e<0&&(t=1,e=-e);let i=Math.floor(Math.log(e)/Math.LN2),s=e/2**i-1,r=Math.floor(s*2**52),o=2**32,a=t<<31|i+1023<<20|r/o&1048575,c=r%o;this._bufferBuilder.append(203),this.pack_int32(a),this.pack_int32(c)}pack_object(e){let t=Object.keys(e),i=t.length;if(i<=15)this.pack_uint8(128+i);else if(i<=65535)this._bufferBuilder.append(222),this.pack_uint16(i);else if(i<=4294967295)this._bufferBuilder.append(223),this.pack_uint32(i);else throw new Error("Invalid length");let s=r=>{if(r<t.length){let o=t[r];if(e.hasOwnProperty(o)){this.pack(o);let a=this.pack(e[o]);if(a instanceof Promise)return a.then(()=>s(r+1))}return s(r+1)}};return s(0)}pack_uint8(e){this._bufferBuilder.append(e)}pack_uint16(e){this._bufferBuilder.append(e>>8),this._bufferBuilder.append(e&255)}pack_uint32(e){let t=e&4294967295;this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255)}pack_uint64(e){let t=e/4294967296,i=e%2**32;this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255),this._bufferBuilder.append((i&4278190080)>>>24),this._bufferBuilder.append((i&16711680)>>>16),this._bufferBuilder.append((i&65280)>>>8),this._bufferBuilder.append(i&255)}pack_int8(e){this._bufferBuilder.append(e&255)}pack_int16(e){this._bufferBuilder.append((e&65280)>>8),this._bufferBuilder.append(e&255)}pack_int32(e){this._bufferBuilder.append(e>>>24&255),this._bufferBuilder.append((e&16711680)>>>16),this._bufferBuilder.append((e&65280)>>>8),this._bufferBuilder.append(e&255)}pack_int64(e){let t=Math.floor(e/4294967296),i=e%2**32;this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255),this._bufferBuilder.append((i&4278190080)>>>24),this._bufferBuilder.append((i&16711680)>>>16),this._bufferBuilder.append((i&65280)>>>8),this._bufferBuilder.append(i&255)}constructor(){this._bufferBuilder=new Mp,this._textEncoder=new TextEncoder}};var c_=!0,l_=!0;function ua(n,e,t){let i=n.match(e);return i&&i.length>=t&&parseFloat(i[t],10)}function ss(n,e,t){if(!n.RTCPeerConnection)return;if(!Object.getOwnPropertyDescriptor(EventTarget.prototype,"addEventListener").writable){Pc("Unable to polyfill events");return}let s=n.RTCPeerConnection.prototype,r=s.addEventListener;s.addEventListener=function(a,c){if(a!==e)return r.apply(this,arguments);let l=u=>{let h=t(u);h&&(c.handleEvent?c.handleEvent(h):c(h))};return this._eventMap=this._eventMap||{},this._eventMap[e]||(this._eventMap[e]=new Map),this._eventMap[e].set(c,l),r.apply(this,[a,l])};let o=s.removeEventListener;s.removeEventListener=function(a,c){if(a!==e||!this._eventMap||!this._eventMap[e])return o.apply(this,arguments);if(!this._eventMap[e].has(c))return o.apply(this,arguments);let l=this._eventMap[e].get(c);return this._eventMap[e].delete(c),this._eventMap[e].size===0&&delete this._eventMap[e],Object.keys(this._eventMap).length===0&&delete this._eventMap,o.apply(this,[a,l])},Object.defineProperty(s,"on"+e,{get(){return this["_on"+e]},set(a){this["_on"+e]&&(this.removeEventListener(e,this["_on"+e]),delete this["_on"+e]),a&&this.addEventListener(e,this["_on"+e]=a)},enumerable:!0,configurable:!0})}function u_(n){return typeof n!="boolean"?new Error("Argument type: "+typeof n+". Please use a boolean."):(c_=n,n?"adapter.js logging disabled":"adapter.js logging enabled")}function h_(n){return typeof n!="boolean"?new Error("Argument type: "+typeof n+". Please use a boolean."):(l_=!n,"adapter.js deprecation warnings "+(n?"disabled":"enabled"))}function Pc(){if(typeof window=="object"){if(c_)return;typeof console<"u"&&typeof console.log=="function"&&console.log.apply(console,arguments)}}function ha(n,e){l_&&console.warn(n+" is deprecated, please use "+e+" instead.")}function f_(n){let e={browser:null,version:null};if(typeof n>"u"||!n.navigator||!n.navigator.userAgent)return e.browser="Not a browser.",e;let{navigator:t}=n;if(t.userAgentData&&t.userAgentData.brands){let i=t.userAgentData.brands.find(s=>s.brand==="Chromium");if(i){let s=parseInt(i.version,10);if(s>=90)return{browser:"chrome",version:s}}}if(t.mozGetUserMedia)e.browser="firefox",e.version=parseInt(ua(t.userAgent,/Firefox\/(\d+)\./,1));else if(t.webkitGetUserMedia||n.isSecureContext===!1&&n.webkitRTCPeerConnection)e.browser="chrome",e.version=parseInt(ua(t.userAgent,/Chrom(e|ium)\/(\d+)\./,2))||null;else if(n.RTCPeerConnection&&t.userAgent.match(/AppleWebKit\/(\d+)\./))e.browser="safari",e.version=parseInt(ua(t.userAgent,/AppleWebKit\/(\d+)\./,1)),e.supportsUnifiedPlan=n.RTCRtpTransceiver&&"currentDirection"in n.RTCRtpTransceiver.prototype,e._safariVersion=ua(t.userAgent,/Version\/(\d+(\.?\d+))/,1);else return e.browser="Not a supported browser.",e;return e}function a_(n){return Object.prototype.toString.call(n)==="[object Object]"}function Rp(n){return a_(n)?Object.keys(n).reduce(function(e,t){let i=a_(n[t]),s=i?Rp(n[t]):n[t],r=i&&!Object.keys(s).length;return s===void 0||r?e:Object.assign(e,{[t]:s})},{}):n}function Ap(n,e,t){!e||t.has(e.id)||(t.set(e.id,e),Object.keys(e).forEach(i=>{i.endsWith("Id")?Ap(n,n.get(e[i]),t):i.endsWith("Ids")&&e[i].forEach(s=>{Ap(n,n.get(s),t)})}))}function Cp(n,e,t){let i=t?"outbound-rtp":"inbound-rtp",s=new Map;if(e===null)return s;let r=[];return n.forEach(o=>{o.type==="track"&&o.trackIdentifier===e.id&&r.push(o)}),r.forEach(o=>{n.forEach(a=>{a.type===i&&a.trackId===o.id&&Ap(n,a,s)})}),s}var Ph={};wl(Ph,{fixNegotiationNeeded:()=>Up,shimAddTrackRemoveTrack:()=>Np,shimAddTrackRemoveTrackWithNative:()=>p_,shimGetSendersWithDtmf:()=>Lp,shimGetUserMedia:()=>Rh,shimMediaStream:()=>Pp,shimOnTrack:()=>Ip,shimPeerConnection:()=>Ch,shimSenderReceiverGetStats:()=>Dp});var d_=Pc;function Rh(n,e){if(e.version>=64)return;let t=n&&n.navigator;if(!t.mediaDevices)return;let i=function(a){if(typeof a!="object"||a.mandatory||a.optional)return a;let c={};return Object.keys(a).forEach(l=>{if(l==="require"||l==="advanced"||l==="mediaSource")return;let u=typeof a[l]=="object"?a[l]:{ideal:a[l]};u.exact!==void 0&&typeof u.exact=="number"&&(u.min=u.max=u.exact);let h=function(f,d){return f?f+d.charAt(0).toUpperCase()+d.slice(1):d==="deviceId"?"sourceId":d};if(u.ideal!==void 0){c.optional=c.optional||[];let f={};typeof u.ideal=="number"?(f[h("min",l)]=u.ideal,c.optional.push(f),f={},f[h("max",l)]=u.ideal,c.optional.push(f)):(f[h("",l)]=u.ideal,c.optional.push(f))}u.exact!==void 0&&typeof u.exact!="number"?(c.mandatory=c.mandatory||{},c.mandatory[h("",l)]=u.exact):["min","max"].forEach(f=>{u[f]!==void 0&&(c.mandatory=c.mandatory||{},c.mandatory[h(f,l)]=u[f])})}),a.advanced&&(c.optional=(c.optional||[]).concat(a.advanced)),c},s=function(a,c){if(e.version>=61)return c(a);if(a=JSON.parse(JSON.stringify(a)),a&&typeof a.audio=="object"){let l=function(u,h,f){h in u&&!(f in u)&&(u[f]=u[h],delete u[h])};a=JSON.parse(JSON.stringify(a)),l(a.audio,"autoGainControl","googAutoGainControl"),l(a.audio,"noiseSuppression","googNoiseSuppression"),a.audio=i(a.audio)}if(a&&typeof a.video=="object"){let l=a.video.facingMode;l=l&&(typeof l=="object"?l:{ideal:l});let u=e.version<66;if(l&&(l.exact==="user"||l.exact==="environment"||l.ideal==="user"||l.ideal==="environment")&&!(t.mediaDevices.getSupportedConstraints&&t.mediaDevices.getSupportedConstraints().facingMode&&!u)){delete a.video.facingMode;let h;if(l.exact==="environment"||l.ideal==="environment"?h=["back","rear"]:(l.exact==="user"||l.ideal==="user")&&(h=["front"]),h)return t.mediaDevices.enumerateDevices().then(f=>{f=f.filter(g=>g.kind==="videoinput");let d=f.find(g=>h.some(x=>g.label.toLowerCase().includes(x)));return!d&&f.length&&h.includes("back")&&(d=f[f.length-1]),d&&(a.video.deviceId=l.exact?{exact:d.deviceId}:{ideal:d.deviceId}),a.video=i(a.video),d_("chrome: "+JSON.stringify(a)),c(a)})}a.video=i(a.video)}return d_("chrome: "+JSON.stringify(a)),c(a)},r=function(a){return e.version>=64?a:{name:{PermissionDeniedError:"NotAllowedError",PermissionDismissedError:"NotAllowedError",InvalidStateError:"NotAllowedError",DevicesNotFoundError:"NotFoundError",ConstraintNotSatisfiedError:"OverconstrainedError",TrackStartError:"NotReadableError",MediaDeviceFailedDueToShutdown:"NotAllowedError",MediaDeviceKillSwitchOn:"NotAllowedError",TabCaptureError:"AbortError",ScreenCaptureError:"AbortError",DeviceCaptureError:"AbortError"}[a.name]||a.name,message:a.message,constraint:a.constraint||a.constraintName,toString(){return this.name+(this.message&&": ")+this.message}}},o=function(a,c,l){s(a,u=>{t.webkitGetUserMedia(u,c,h=>{l&&l(r(h))})})};if(t.getUserMedia=o.bind(t),t.mediaDevices.getUserMedia){let a=t.mediaDevices.getUserMedia.bind(t.mediaDevices);t.mediaDevices.getUserMedia=function(c){return s(c,l=>a(l).then(u=>{if(l.audio&&!u.getAudioTracks().length||l.video&&!u.getVideoTracks().length)throw u.getTracks().forEach(h=>{h.stop()}),new DOMException("","NotFoundError");return u},u=>Promise.reject(r(u))))}}}function Pp(n){n.MediaStream=n.MediaStream||n.webkitMediaStream}function Ip(n,e){if(!(e.version>102))if(typeof n=="object"&&n.RTCPeerConnection&&!("ontrack"in n.RTCPeerConnection.prototype)){Object.defineProperty(n.RTCPeerConnection.prototype,"ontrack",{get(){return this._ontrack},set(i){this._ontrack&&this.removeEventListener("track",this._ontrack),this.addEventListener("track",this._ontrack=i)},enumerable:!0,configurable:!0});let t=n.RTCPeerConnection.prototype.setRemoteDescription;n.RTCPeerConnection.prototype.setRemoteDescription=function(){return this._ontrackpoly||(this._ontrackpoly=s=>{s.stream.addEventListener("addtrack",r=>{let o;n.RTCPeerConnection.prototype.getReceivers?o=this.getReceivers().find(c=>c.track&&c.track.id===r.track.id):o={track:r.track};let a=new Event("track");a.track=r.track,a.receiver=o,a.transceiver={receiver:o},a.streams=[s.stream],this.dispatchEvent(a)}),s.stream.getTracks().forEach(r=>{let o;n.RTCPeerConnection.prototype.getReceivers?o=this.getReceivers().find(c=>c.track&&c.track.id===r.id):o={track:r};let a=new Event("track");a.track=r,a.receiver=o,a.transceiver={receiver:o},a.streams=[s.stream],this.dispatchEvent(a)})},this.addEventListener("addstream",this._ontrackpoly)),t.apply(this,arguments)}}else ss(n,"track",t=>(t.transceiver||Object.defineProperty(t,"transceiver",{value:{receiver:t.receiver}}),t))}function Lp(n){if(typeof n=="object"&&n.RTCPeerConnection&&!("getSenders"in n.RTCPeerConnection.prototype)&&"createDTMFSender"in n.RTCPeerConnection.prototype){let e=function(s,r){return{track:r,get dtmf(){return this._dtmf===void 0&&(r.kind==="audio"?this._dtmf=s.createDTMFSender(r):this._dtmf=null),this._dtmf},_pc:s}};if(!n.RTCPeerConnection.prototype.getSenders){n.RTCPeerConnection.prototype.getSenders=function(){return this._senders=this._senders||[],this._senders.slice()};let s=n.RTCPeerConnection.prototype.addTrack;n.RTCPeerConnection.prototype.addTrack=function(a,c){let l=s.apply(this,arguments);return l||(l=e(this,a),this._senders.push(l)),l};let r=n.RTCPeerConnection.prototype.removeTrack;n.RTCPeerConnection.prototype.removeTrack=function(a){r.apply(this,arguments);let c=this._senders.indexOf(a);c!==-1&&this._senders.splice(c,1)}}let t=n.RTCPeerConnection.prototype.addStream;n.RTCPeerConnection.prototype.addStream=function(r){this._senders=this._senders||[],t.apply(this,[r]),r.getTracks().forEach(o=>{this._senders.push(e(this,o))})};let i=n.RTCPeerConnection.prototype.removeStream;n.RTCPeerConnection.prototype.removeStream=function(r){this._senders=this._senders||[],i.apply(this,[r]),r.getTracks().forEach(o=>{let a=this._senders.find(c=>c.track===o);a&&this._senders.splice(this._senders.indexOf(a),1)})}}else if(typeof n=="object"&&n.RTCPeerConnection&&"getSenders"in n.RTCPeerConnection.prototype&&"createDTMFSender"in n.RTCPeerConnection.prototype&&n.RTCRtpSender&&!("dtmf"in n.RTCRtpSender.prototype)){let e=n.RTCPeerConnection.prototype.getSenders;n.RTCPeerConnection.prototype.getSenders=function(){let i=e.apply(this,[]);return i.forEach(s=>s._pc=this),i},Object.defineProperty(n.RTCRtpSender.prototype,"dtmf",{get(){return this._dtmf===void 0&&(this.track.kind==="audio"?this._dtmf=this._pc.createDTMFSender(this.track):this._dtmf=null),this._dtmf}})}}function Dp(n,e){if(e.version>=67||!(typeof n=="object"&&n.RTCPeerConnection&&n.RTCRtpSender&&n.RTCRtpReceiver))return;if(!("getStats"in n.RTCRtpSender.prototype)){let i=n.RTCPeerConnection.prototype.getSenders;i&&(n.RTCPeerConnection.prototype.getSenders=function(){let o=i.apply(this,[]);return o.forEach(a=>a._pc=this),o});let s=n.RTCPeerConnection.prototype.addTrack;s&&(n.RTCPeerConnection.prototype.addTrack=function(){let o=s.apply(this,arguments);return o._pc=this,o}),n.RTCRtpSender.prototype.getStats=function(){let o=this;return this._pc.getStats().then(a=>Cp(a,o.track,!0))}}if(!("getStats"in n.RTCRtpReceiver.prototype)){let i=n.RTCPeerConnection.prototype.getReceivers;i&&(n.RTCPeerConnection.prototype.getReceivers=function(){let r=i.apply(this,[]);return r.forEach(o=>o._pc=this),r}),ss(n,"track",s=>(s.receiver._pc=s.srcElement,s)),n.RTCRtpReceiver.prototype.getStats=function(){let r=this;return this._pc.getStats().then(o=>Cp(o,r.track,!1))}}if(!("getStats"in n.RTCRtpSender.prototype&&"getStats"in n.RTCRtpReceiver.prototype))return;let t=n.RTCPeerConnection.prototype.getStats;n.RTCPeerConnection.prototype.getStats=function(){if(arguments.length>0&&arguments[0]instanceof n.MediaStreamTrack){let s=arguments[0],r,o,a;return this.getSenders().forEach(c=>{c.track===s&&(r?a=!0:r=c)}),this.getReceivers().forEach(c=>(c.track===s&&(o?a=!0:o=c),c.track===s)),a||r&&o?Promise.reject(new DOMException("There are more than one sender or receiver for the track.","InvalidAccessError")):r?r.getStats():o?o.getStats():Promise.reject(new DOMException("There is no sender or receiver for the track.","InvalidAccessError"))}return t.apply(this,arguments)}}function p_(n){n.RTCPeerConnection.prototype.getLocalStreams=function(){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},Object.keys(this._shimmedLocalStreams).map(o=>this._shimmedLocalStreams[o][0])};let e=n.RTCPeerConnection.prototype.addTrack;n.RTCPeerConnection.prototype.addTrack=function(o,a){if(!a)return e.apply(this,arguments);this._shimmedLocalStreams=this._shimmedLocalStreams||{};let c=e.apply(this,arguments);return this._shimmedLocalStreams[a.id]?this._shimmedLocalStreams[a.id].indexOf(c)===-1&&this._shimmedLocalStreams[a.id].push(c):this._shimmedLocalStreams[a.id]=[a,c],c};let t=n.RTCPeerConnection.prototype.addStream;n.RTCPeerConnection.prototype.addStream=function(o){this._shimmedLocalStreams=this._shimmedLocalStreams||{},o.getTracks().forEach(l=>{if(this.getSenders().find(h=>h.track===l))throw new DOMException("Track already exists.","InvalidAccessError")});let a=this.getSenders();t.apply(this,arguments);let c=this.getSenders().filter(l=>a.indexOf(l)===-1);this._shimmedLocalStreams[o.id]=[o].concat(c)};let i=n.RTCPeerConnection.prototype.removeStream;n.RTCPeerConnection.prototype.removeStream=function(o){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},delete this._shimmedLocalStreams[o.id],i.apply(this,arguments)};let s=n.RTCPeerConnection.prototype.removeTrack;n.RTCPeerConnection.prototype.removeTrack=function(o){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},o&&Object.keys(this._shimmedLocalStreams).forEach(a=>{let c=this._shimmedLocalStreams[a].indexOf(o);c!==-1&&this._shimmedLocalStreams[a].splice(c,1),this._shimmedLocalStreams[a].length===1&&delete this._shimmedLocalStreams[a]}),s.apply(this,arguments)}}function Np(n,e){if(!n.RTCPeerConnection)return;if(n.RTCPeerConnection.prototype.addTrack&&e.version>=65)return p_(n);let t=n.RTCPeerConnection.prototype.getLocalStreams;n.RTCPeerConnection.prototype.getLocalStreams=function(){let u=t.apply(this);return this._reverseStreams=this._reverseStreams||{},u.map(h=>this._reverseStreams[h.id])};let i=n.RTCPeerConnection.prototype.addStream;n.RTCPeerConnection.prototype.addStream=function(u){if(this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{},u.getTracks().forEach(h=>{if(this.getSenders().find(d=>d.track===h))throw new DOMException("Track already exists.","InvalidAccessError")}),!this._reverseStreams[u.id]){let h=new n.MediaStream(u.getTracks());this._streams[u.id]=h,this._reverseStreams[h.id]=u,u=h}i.apply(this,[u])};let s=n.RTCPeerConnection.prototype.removeStream;n.RTCPeerConnection.prototype.removeStream=function(u){this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{},s.apply(this,[this._streams[u.id]||u]),delete this._reverseStreams[this._streams[u.id]?this._streams[u.id].id:u.id],delete this._streams[u.id]},n.RTCPeerConnection.prototype.addTrack=function(u,h){if(this.signalingState==="closed")throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.","InvalidStateError");let f=[].slice.call(arguments,1);if(f.length!==1||!f[0].getTracks().find(x=>x===u))throw new DOMException("The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.","NotSupportedError");if(this.getSenders().find(x=>x.track===u))throw new DOMException("Track already exists.","InvalidAccessError");this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{};let g=this._streams[h.id];if(g)g.addTrack(u),Promise.resolve().then(()=>{this.dispatchEvent(new Event("negotiationneeded"))});else{let x=new n.MediaStream([u]);this._streams[h.id]=x,this._reverseStreams[x.id]=h,this.addStream(x)}return this.getSenders().find(x=>x.track===u)};function r(l,u){let h=u.sdp;return Object.keys(l._reverseStreams||[]).forEach(f=>{let d=l._reverseStreams[f],g=l._streams[d.id];h=h.replace(new RegExp(g.id,"g"),d.id)}),new RTCSessionDescription({type:u.type,sdp:h})}function o(l,u){let h=u.sdp;return Object.keys(l._reverseStreams||[]).forEach(f=>{let d=l._reverseStreams[f],g=l._streams[d.id];h=h.replace(new RegExp(d.id,"g"),g.id)}),new RTCSessionDescription({type:u.type,sdp:h})}["createOffer","createAnswer"].forEach(function(l){let u=n.RTCPeerConnection.prototype[l],h={[l](){let f=arguments;return arguments.length&&typeof arguments[0]=="function"?u.apply(this,[g=>{let x=r(this,g);f[0].apply(null,[x])},g=>{f[1]&&f[1].apply(null,g)},arguments[2]]):u.apply(this,arguments).then(g=>r(this,g))}};n.RTCPeerConnection.prototype[l]=h[l]});let a=n.RTCPeerConnection.prototype.setLocalDescription;n.RTCPeerConnection.prototype.setLocalDescription=function(){return!arguments.length||!arguments[0].type?a.apply(this,arguments):(arguments[0]=o(this,arguments[0]),a.apply(this,arguments))};let c=Object.getOwnPropertyDescriptor(n.RTCPeerConnection.prototype,"localDescription");Object.defineProperty(n.RTCPeerConnection.prototype,"localDescription",{get(){let l=c.get.apply(this);return l.type===""?l:r(this,l)}}),n.RTCPeerConnection.prototype.removeTrack=function(u){if(this.signalingState==="closed")throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.","InvalidStateError");if(!u._pc)throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.","TypeError");if(!(u._pc===this))throw new DOMException("Sender was not created by this connection.","InvalidAccessError");this._streams=this._streams||{};let f;Object.keys(this._streams).forEach(d=>{this._streams[d].getTracks().find(x=>u.track===x)&&(f=this._streams[d])}),f&&(f.getTracks().length===1?this.removeStream(this._reverseStreams[f.id]):f.removeTrack(u.track),this.dispatchEvent(new Event("negotiationneeded")))}}function Ch(n,e){!n.RTCPeerConnection&&n.webkitRTCPeerConnection&&(n.RTCPeerConnection=n.webkitRTCPeerConnection),n.RTCPeerConnection&&e.version<53&&["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach(function(t){let i=n.RTCPeerConnection.prototype[t],s={[t](){return arguments[0]=new(t==="addIceCandidate"?n.RTCIceCandidate:n.RTCSessionDescription)(arguments[0]),i.apply(this,arguments)}};n.RTCPeerConnection.prototype[t]=s[t]})}function Up(n,e){e.version>102||ss(n,"negotiationneeded",t=>{let i=t.target;if(!((e.version<72||i.getConfiguration&&i.getConfiguration().sdpSemantics==="plan-b")&&i.signalingState!=="stable"))return t})}var Dh={};wl(Dh,{shimAddTransceiver:()=>Gp,shimCreateAnswer:()=>Xp,shimCreateOffer:()=>Wp,shimGetDisplayMedia:()=>m_,shimGetParameters:()=>Vp,shimGetStats:()=>Fp,shimGetUserMedia:()=>Ih,shimOnTrack:()=>Op,shimPeerConnection:()=>Lh,shimRTCDataChannel:()=>Hp,shimReceiverGetStats:()=>kp,shimRemoveStream:()=>zp,shimSenderGetStats:()=>Bp});function Ih(n,e){let t=n&&n.navigator;if(!t.mediaDevices)return;let i=n&&n.MediaStreamTrack;if(t.getUserMedia=function(s,r,o){ha("navigator.getUserMedia","navigator.mediaDevices.getUserMedia"),t.mediaDevices.getUserMedia(s).then(r,o)},!(e.version>55&&"autoGainControl"in t.mediaDevices.getSupportedConstraints())){let s=function(o,a,c){a in o&&!(c in o)&&(o[c]=o[a],delete o[a])},r=t.mediaDevices.getUserMedia.bind(t.mediaDevices);if(t.mediaDevices.getUserMedia=function(o){return typeof o=="object"&&typeof o.audio=="object"&&(o=JSON.parse(JSON.stringify(o)),s(o.audio,"autoGainControl","mozAutoGainControl"),s(o.audio,"noiseSuppression","mozNoiseSuppression")),r(o)},i&&i.prototype.getSettings){let o=i.prototype.getSettings;i.prototype.getSettings=function(){let a=o.apply(this,arguments);return s(a,"mozAutoGainControl","autoGainControl"),s(a,"mozNoiseSuppression","noiseSuppression"),a}}if(i&&i.prototype.applyConstraints){let o=i.prototype.applyConstraints;i.prototype.applyConstraints=function(a){return this.kind==="audio"&&typeof a=="object"&&(a=JSON.parse(JSON.stringify(a)),s(a,"autoGainControl","mozAutoGainControl"),s(a,"noiseSuppression","mozNoiseSuppression")),o.apply(this,[a])}}}}function m_(n,e){n.navigator.mediaDevices&&(n.navigator.mediaDevices&&"getDisplayMedia"in n.navigator.mediaDevices||(n.navigator.mediaDevices.getDisplayMedia=function(i){if(!(i&&i.video)){let s=new DOMException("getDisplayMedia without video constraints is undefined");return s.name="NotFoundError",s.code=8,Promise.reject(s)}return i.video===!0?i.video={mediaSource:e}:i.video.mediaSource=e,n.navigator.mediaDevices.getUserMedia(i)}))}function Op(n){typeof n=="object"&&n.RTCTrackEvent&&"receiver"in n.RTCTrackEvent.prototype&&!("transceiver"in n.RTCTrackEvent.prototype)&&Object.defineProperty(n.RTCTrackEvent.prototype,"transceiver",{get(){return{receiver:this.receiver}}})}function Lh(n,e){typeof n!="object"||!(n.RTCPeerConnection||n.mozRTCPeerConnection)||(!n.RTCPeerConnection&&n.mozRTCPeerConnection&&(n.RTCPeerConnection=n.mozRTCPeerConnection),e.version<53&&["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach(function(t){let i=n.RTCPeerConnection.prototype[t],s={[t](){return arguments[0]=new(t==="addIceCandidate"?n.RTCIceCandidate:n.RTCSessionDescription)(arguments[0]),i.apply(this,arguments)}};n.RTCPeerConnection.prototype[t]=s[t]}))}function Fp(n,e){if(typeof n!="object"||!(n.RTCPeerConnection||n.mozRTCPeerConnection)||e.version>=151)return;let t={inboundrtp:"inbound-rtp",outboundrtp:"outbound-rtp",candidatepair:"candidate-pair",localcandidate:"local-candidate",remotecandidate:"remote-candidate"},i=n.RTCPeerConnection.prototype.getStats;n.RTCPeerConnection.prototype.getStats=function(){let[r,o,a]=arguments;return this.signalingState==="closed"?Promise.resolve(new Map):i.apply(this,[r||null]).then(c=>{if(e.version<53&&!o)try{c.forEach(l=>{l.type=t[l.type]||l.type})}catch(l){if(l.name!=="TypeError")throw l;c.forEach((u,h)=>{c.set(h,Object.assign({},u,{type:t[u.type]||u.type}))})}return c}).then(o,a)}}function Bp(n){if(!(typeof n=="object"&&n.RTCPeerConnection&&n.RTCRtpSender)||n.RTCRtpSender&&"getStats"in n.RTCRtpSender.prototype)return;let e=n.RTCPeerConnection.prototype.getSenders;e&&(n.RTCPeerConnection.prototype.getSenders=function(){let s=e.apply(this,[]);return s.forEach(r=>r._pc=this),s});let t=n.RTCPeerConnection.prototype.addTrack;t&&(n.RTCPeerConnection.prototype.addTrack=function(){let s=t.apply(this,arguments);return s._pc=this,s}),n.RTCRtpSender.prototype.getStats=function(){return this.track?this._pc.getStats(this.track):Promise.resolve(new Map)}}function kp(n){if(!(typeof n=="object"&&n.RTCPeerConnection&&n.RTCRtpSender)||n.RTCRtpSender&&"getStats"in n.RTCRtpReceiver.prototype)return;let e=n.RTCPeerConnection.prototype.getReceivers;e&&(n.RTCPeerConnection.prototype.getReceivers=function(){let i=e.apply(this,[]);return i.forEach(s=>s._pc=this),i}),ss(n,"track",t=>(t.receiver._pc=t.srcElement,t)),n.RTCRtpReceiver.prototype.getStats=function(){return this._pc.getStats(this.track)}}function zp(n){!n.RTCPeerConnection||"removeStream"in n.RTCPeerConnection.prototype||(n.RTCPeerConnection.prototype.removeStream=function(t){ha("removeStream","removeTrack"),this.getSenders().forEach(i=>{i.track&&t.getTracks().includes(i.track)&&this.removeTrack(i)})})}function Hp(n){n.DataChannel&&!n.RTCDataChannel&&(n.RTCDataChannel=n.DataChannel)}function Gp(n,e){if(!(typeof n=="object"&&n.RTCPeerConnection)||e.version>=110)return;let t=n.RTCPeerConnection.prototype.addTransceiver;t&&(n.RTCPeerConnection.prototype.addTransceiver=function(){this.setParametersPromises=[];let s=arguments[1]&&arguments[1].sendEncodings;s===void 0&&(s=[]),s=[...s];let r=s.length>0;r&&s.forEach(a=>{if("rid"in a&&!/^[a-z0-9]{0,16}$/i.test(a.rid))throw new TypeError("Invalid RID value provided.");if("scaleResolutionDownBy"in a&&!(parseFloat(a.scaleResolutionDownBy)>=1))throw new RangeError("scale_resolution_down_by must be >= 1.0");if("maxFramerate"in a&&!(parseFloat(a.maxFramerate)>=0))throw new RangeError("max_framerate must be >= 0.0")});let o=t.apply(this,arguments);if(r){let{sender:a}=o,c=a.getParameters();(!("encodings"in c)||c.encodings.length===1&&Object.keys(c.encodings[0]).length===0)&&(c.encodings=s,a.sendEncodings=s,this.setParametersPromises.push(a.setParameters(c).then(()=>{delete a.sendEncodings}).catch(()=>{delete a.sendEncodings})))}return o})}function Vp(n,e){if(!(typeof n=="object"&&n.RTCRtpSender)||e.version>=110)return;let t=n.RTCRtpSender.prototype.getParameters;t&&(n.RTCRtpSender.prototype.getParameters=function(){let s=t.apply(this,arguments);return"encodings"in s||(s.encodings=[].concat(this.sendEncodings||[{}])),s})}function Wp(n,e){if(!(typeof n=="object"&&n.RTCPeerConnection)||e.version>=110)return;let t=n.RTCPeerConnection.prototype.createOffer;n.RTCPeerConnection.prototype.createOffer=function(){return this.setParametersPromises&&this.setParametersPromises.length?Promise.all(this.setParametersPromises).then(()=>t.apply(this,arguments)).finally(()=>{this.setParametersPromises=[]}):t.apply(this,arguments)}}function Xp(n,e){if(!(typeof n=="object"&&n.RTCPeerConnection)||e.version>=110)return;let t=n.RTCPeerConnection.prototype.createAnswer;n.RTCPeerConnection.prototype.createAnswer=function(){return this.setParametersPromises&&this.setParametersPromises.length?Promise.all(this.setParametersPromises).then(()=>t.apply(this,arguments)).finally(()=>{this.setParametersPromises=[]}):t.apply(this,arguments)}}var Nh={};wl(Nh,{shimAudioContext:()=>Qp,shimCallbacksAPI:()=>$p,shimConstraints:()=>g_,shimCreateOfferLegacy:()=>jp,shimGetUserMedia:()=>Kp,shimLocalStreamsAPI:()=>qp,shimRTCIceServerUrls:()=>Zp,shimRemoteStreamsAPI:()=>Yp,shimTrackEventTransceiver:()=>Jp});function qp(n){if(!(typeof n!="object"||!n.RTCPeerConnection)){if("getLocalStreams"in n.RTCPeerConnection.prototype||(n.RTCPeerConnection.prototype.getLocalStreams=function(){return this._localStreams||(this._localStreams=[]),this._localStreams}),!("addStream"in n.RTCPeerConnection.prototype)){let e=n.RTCPeerConnection.prototype.addTrack;n.RTCPeerConnection.prototype.addStream=function(i){this._localStreams||(this._localStreams=[]),this._localStreams.includes(i)||this._localStreams.push(i),i.getAudioTracks().forEach(s=>e.call(this,s,i)),i.getVideoTracks().forEach(s=>e.call(this,s,i))},n.RTCPeerConnection.prototype.addTrack=function(i,...s){return s&&s.forEach(r=>{this._localStreams?this._localStreams.includes(r)||this._localStreams.push(r):this._localStreams=[r]}),e.apply(this,arguments)}}"removeStream"in n.RTCPeerConnection.prototype||(n.RTCPeerConnection.prototype.removeStream=function(t){this._localStreams||(this._localStreams=[]);let i=this._localStreams.indexOf(t);if(i===-1)return;this._localStreams.splice(i,1);let s=t.getTracks();this.getSenders().forEach(r=>{s.includes(r.track)&&this.removeTrack(r)})})}}function Yp(n){if(!(typeof n!="object"||!n.RTCPeerConnection)&&("getRemoteStreams"in n.RTCPeerConnection.prototype||(n.RTCPeerConnection.prototype.getRemoteStreams=function(){return this._remoteStreams?this._remoteStreams:[]}),!("onaddstream"in n.RTCPeerConnection.prototype))){Object.defineProperty(n.RTCPeerConnection.prototype,"onaddstream",{get(){return this._onaddstream},set(t){this._onaddstream&&(this.removeEventListener("addstream",this._onaddstream),this.removeEventListener("track",this._onaddstreampoly)),this.addEventListener("addstream",this._onaddstream=t),this.addEventListener("track",this._onaddstreampoly=i=>{i.streams.forEach(s=>{if(this._remoteStreams||(this._remoteStreams=[]),this._remoteStreams.includes(s))return;this._remoteStreams.push(s);let r=new Event("addstream");r.stream=s,this.dispatchEvent(r)})})}});let e=n.RTCPeerConnection.prototype.setRemoteDescription;n.RTCPeerConnection.prototype.setRemoteDescription=function(){let i=this;return this._onaddstreampoly||this.addEventListener("track",this._onaddstreampoly=function(s){s.streams.forEach(r=>{if(i._remoteStreams||(i._remoteStreams=[]),i._remoteStreams.indexOf(r)>=0)return;i._remoteStreams.push(r);let o=new Event("addstream");o.stream=r,i.dispatchEvent(o)})}),e.apply(i,arguments)}}}function $p(n){if(typeof n!="object"||!n.RTCPeerConnection)return;let e=n.RTCPeerConnection.prototype,t=e.createOffer,i=e.createAnswer,s=e.setLocalDescription,r=e.setRemoteDescription,o=e.addIceCandidate;e.createOffer=function(l,u){let h=arguments.length>=2?arguments[2]:arguments[0],f=t.apply(this,[h]);return u?(f.then(l,u),Promise.resolve()):f},e.createAnswer=function(l,u){let h=arguments.length>=2?arguments[2]:arguments[0],f=i.apply(this,[h]);return u?(f.then(l,u),Promise.resolve()):f};let a=function(c,l,u){let h=s.apply(this,[c]);return u?(h.then(l,u),Promise.resolve()):h};e.setLocalDescription=a,a=function(c,l,u){let h=r.apply(this,[c]);return u?(h.then(l,u),Promise.resolve()):h},e.setRemoteDescription=a,a=function(c,l,u){let h=o.apply(this,[c]);return u?(h.then(l,u),Promise.resolve()):h},e.addIceCandidate=a}function Kp(n){let e=n&&n.navigator;if(e.mediaDevices&&e.mediaDevices.getUserMedia){let t=e.mediaDevices,i=t.getUserMedia.bind(t);e.mediaDevices.getUserMedia=s=>i(g_(s))}!e.getUserMedia&&e.mediaDevices&&e.mediaDevices.getUserMedia&&(e.getUserMedia=function(i,s,r){e.mediaDevices.getUserMedia(i).then(s,r)}.bind(e))}function g_(n){return n&&n.video!==void 0?Object.assign({},n,{video:Rp(n.video)}):n}function Zp(n){if(!n.RTCPeerConnection)return;let e=n.RTCPeerConnection;n.RTCPeerConnection=function(i,s){if(i&&i.iceServers){let r=[];for(let o=0;o<i.iceServers.length;o++){let a=i.iceServers[o];a.urls===void 0&&a.url?(ha("RTCIceServer.url","RTCIceServer.urls"),a=JSON.parse(JSON.stringify(a)),a.urls=a.url,delete a.url,r.push(a)):r.push(i.iceServers[o])}i.iceServers=r}return new e(i,s)},n.RTCPeerConnection.prototype=e.prototype,"generateCertificate"in e&&Object.defineProperty(n.RTCPeerConnection,"generateCertificate",{get(){return e.generateCertificate}})}function Jp(n){typeof n=="object"&&n.RTCTrackEvent&&"receiver"in n.RTCTrackEvent.prototype&&!("transceiver"in n.RTCTrackEvent.prototype)&&Object.defineProperty(n.RTCTrackEvent.prototype,"transceiver",{get(){return{receiver:this.receiver}}})}function jp(n){let e=n.RTCPeerConnection.prototype.createOffer;n.RTCPeerConnection.prototype.createOffer=function(i){if(i){typeof i.offerToReceiveAudio<"u"&&(i.offerToReceiveAudio=!!i.offerToReceiveAudio);let s=this.getTransceivers().find(o=>o.receiver.track.kind==="audio");i.offerToReceiveAudio===!1&&s?s.direction==="sendrecv"?s.setDirection?s.setDirection("sendonly"):s.direction="sendonly":s.direction==="recvonly"&&(s.setDirection?s.setDirection("inactive"):s.direction="inactive"):i.offerToReceiveAudio===!0&&!s&&this.addTransceiver("audio",{direction:"recvonly"}),typeof i.offerToReceiveVideo<"u"&&(i.offerToReceiveVideo=!!i.offerToReceiveVideo);let r=this.getTransceivers().find(o=>o.receiver.track.kind==="video");i.offerToReceiveVideo===!1&&r?r.direction==="sendrecv"?r.setDirection?r.setDirection("sendonly"):r.direction="sendonly":r.direction==="recvonly"&&(r.setDirection?r.setDirection("inactive"):r.direction="inactive"):i.offerToReceiveVideo===!0&&!r&&this.addTransceiver("video",{direction:"recvonly"})}return e.apply(this,arguments)}}function Qp(n){typeof n!="object"||n.AudioContext||(n.AudioContext=n.webkitAudioContext)}var nm={};wl(nm,{removeExtmapAllowMixed:()=>Fh,shimAddIceCandidateNullOrEmpty:()=>Nc,shimConnectionState:()=>Oh,shimMaxMessageSize:()=>Lc,shimParameterlessSetLocalDescription:()=>Uc,shimRTCIceCandidate:()=>Ic,shimRTCIceCandidateRelayProtocol:()=>Uh,shimSendThrowTypeError:()=>Dc});var fa=j0(tm());function Ic(n){if(!n.RTCIceCandidate||n.RTCIceCandidate&&"foundation"in n.RTCIceCandidate.prototype)return;let e=n.RTCIceCandidate;n.RTCIceCandidate=function(i){if(typeof i=="object"&&i.candidate&&i.candidate.indexOf("a=")===0&&(i=JSON.parse(JSON.stringify(i)),i.candidate=i.candidate.substring(2)),i.candidate&&i.candidate.length){let s=new e(i),r=fa.default.parseCandidate(i.candidate);for(let o in r)o in s||Object.defineProperty(s,o,{value:r[o]});return s.toJSON=function(){return{candidate:s.candidate,sdpMid:s.sdpMid,sdpMLineIndex:s.sdpMLineIndex,usernameFragment:s.usernameFragment}},s}return new e(i)},n.RTCIceCandidate.prototype=e.prototype,ss(n,"icecandidate",t=>(t.candidate&&Object.defineProperty(t,"candidate",{value:new n.RTCIceCandidate(t.candidate),writable:"false"}),t))}function Uh(n){!n.RTCIceCandidate||n.RTCIceCandidate&&"relayProtocol"in n.RTCIceCandidate.prototype||ss(n,"icecandidate",e=>{if(e.candidate){let t=fa.default.parseCandidate(e.candidate.candidate);t.type==="relay"&&(e.candidate.relayProtocol={0:"tls",1:"tcp",2:"udp"}[t.priority>>24])}return e})}function Lc(n,e){if(!n.RTCPeerConnection||e.browser==="chrome"&&e.version>102||e.browser==="firefox"&&e.version>=113)return;"sctp"in n.RTCPeerConnection.prototype||Object.defineProperty(n.RTCPeerConnection.prototype,"sctp",{get(){return typeof this._sctp>"u"?null:this._sctp}});let t=function(a){if(!a||!a.sdp)return!1;let c=fa.default.splitSections(a.sdp);return c.shift(),c.some(l=>{let u=fa.default.parseMLine(l);return u&&u.kind==="application"&&u.protocol.indexOf("SCTP")!==-1})},i=function(a){let c=a.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);if(c===null||c.length<2)return-1;let l=parseInt(c[1],10);return l!==l?-1:l},s=function(a){let c=65536;return e.browser==="firefox"&&(e.version<57?a===-1?c=16384:c=2147483637:e.version<60?c=e.version===57?65535:65536:c=2147483637),c},r=function(a,c){let l=65536;e.browser==="firefox"&&e.version===57&&(l=65535);let u=fa.default.matchPrefix(a.sdp,"a=max-message-size:");return u.length>0?l=parseInt(u[0].substring(19),10):e.browser==="firefox"&&c!==-1&&(l=2147483637),l},o=n.RTCPeerConnection.prototype.setRemoteDescription;n.RTCPeerConnection.prototype.setRemoteDescription=function(){if(this._sctp=null,e.browser==="chrome"&&e.version>=76){let{sdpSemantics:c}=this.getConfiguration();c==="plan-b"&&Object.defineProperty(this,"sctp",{get(){return typeof this._sctp>"u"?null:this._sctp},enumerable:!0,configurable:!0})}if(t(arguments[0])){let c=i(arguments[0]),l=s(c),u=r(arguments[0],c),h;l===0&&u===0?h=Number.POSITIVE_INFINITY:l===0||u===0?h=Math.max(l,u):h=Math.min(l,u);let f={};Object.defineProperty(f,"maxMessageSize",{get(){return h}}),this._sctp=f}return o.apply(this,arguments)}}function Dc(n,e){if(!(n.RTCPeerConnection&&"createDataChannel"in n.RTCPeerConnection.prototype)||e.browser==="chrome"&&e.version>=149||e.browser==="firefox"&&e.version>60)return;function t(s,r){let o=s.send;s.send=function(){let c=arguments[0],l=c.length||c.size||c.byteLength;if(s.readyState==="open"&&r.sctp&&l>r.sctp.maxMessageSize)throw new TypeError("Message too large (can send a maximum of "+r.sctp.maxMessageSize+" bytes)");return o.apply(s,arguments)}}let i=n.RTCPeerConnection.prototype.createDataChannel;n.RTCPeerConnection.prototype.createDataChannel=function(){let r=i.apply(this,arguments);return t(r,this),r},ss(n,"datachannel",s=>(t(s.channel,s.target),s))}function Oh(n){if(!n.RTCPeerConnection||"connectionState"in n.RTCPeerConnection.prototype)return;let e=n.RTCPeerConnection.prototype;Object.defineProperty(e,"connectionState",{get(){return{completed:"connected",checking:"connecting"}[this.iceConnectionState]||this.iceConnectionState},enumerable:!0,configurable:!0}),Object.defineProperty(e,"onconnectionstatechange",{get(){return this._onconnectionstatechange||null},set(t){this._onconnectionstatechange&&(this.removeEventListener("connectionstatechange",this._onconnectionstatechange),delete this._onconnectionstatechange),t&&this.addEventListener("connectionstatechange",this._onconnectionstatechange=t)},enumerable:!0,configurable:!0}),["setLocalDescription","setRemoteDescription"].forEach(t=>{let i=e[t];e[t]=function(){return this._connectionstatechangepoly||(this._connectionstatechangepoly=s=>{let r=s.target;if(r._lastConnectionState!==r.connectionState){r._lastConnectionState=r.connectionState;let o=new Event("connectionstatechange",s);r.dispatchEvent(o)}return s},this.addEventListener("iceconnectionstatechange",this._connectionstatechangepoly)),i.apply(this,arguments)}})}function Fh(n,e){if(!n.RTCPeerConnection||e.browser==="chrome"&&e.version>=71||e.browser==="safari"&&e._safariVersion>=13.1)return;let t=n.RTCPeerConnection.prototype.setRemoteDescription;n.RTCPeerConnection.prototype.setRemoteDescription=function(s){if(s&&s.sdp&&s.sdp.indexOf(`
a=extmap-allow-mixed`)!==-1){let r=s.sdp.split(`
`).filter(o=>o.trim()!=="a=extmap-allow-mixed").join(`
`);n.RTCSessionDescription&&s instanceof n.RTCSessionDescription?arguments[0]=new n.RTCSessionDescription({type:s.type,sdp:r}):s.sdp=r}return t.apply(this,arguments)}}function Nc(n,e){if(!(n.RTCPeerConnection&&n.RTCPeerConnection.prototype))return;let t=n.RTCPeerConnection.prototype.addIceCandidate;!t||t.length===0||(n.RTCPeerConnection.prototype.addIceCandidate=function(){return arguments[0]?(e.browser==="chrome"&&e.version<78||e.browser==="firefox"&&e.version<68||e.browser==="safari")&&arguments[0]&&arguments[0].candidate===""?Promise.resolve():t.apply(this,arguments):(arguments[1]&&arguments[1].apply(null),Promise.resolve())})}function Uc(n,e){if(!(n.RTCPeerConnection&&n.RTCPeerConnection.prototype))return;let t=n.RTCPeerConnection.prototype.setLocalDescription;!t||t.length===0||(n.RTCPeerConnection.prototype.setLocalDescription=function(){let s=arguments[0]||{};if(typeof s!="object"||s.type&&s.sdp)return t.apply(this,arguments);if(s={type:s.type,sdp:s.sdp},!s.type)switch(this.signalingState){case"stable":case"have-local-offer":case"have-remote-pranswer":s.type="offer";break;default:s.type="answer";break}return s.sdp||s.type!=="offer"&&s.type!=="answer"?t.apply(this,[s]):(s.type==="offer"?this.createOffer:this.createAnswer).apply(this).then(o=>t.apply(this,[o]))})}var xE=j0(tm());function x_({window:n}={},e={shimChrome:!0,shimFirefox:!0,shimSafari:!0}){let t=Pc,i=f_(n),s={browserDetails:i,commonShim:nm,extractVersion:ua,disableLog:u_,disableWarnings:h_,sdp:xE};switch(i.browser){case"chrome":if(!Ph||!Ch||!e.shimChrome)return t("Chrome shim is not included in this adapter release."),s;if(i.version===null)return t("Chrome shim can not determine version, not shimming."),s;t("adapter.js shimming chrome."),s.browserShim=Ph,Nc(n,i),Uc(n,i),Rh(n,i),Pp(n,i),Ch(n,i),Ip(n,i),Np(n,i),Lp(n,i),Dp(n,i),Up(n,i),Ic(n,i),Uh(n,i),Oh(n,i),Lc(n,i),Dc(n,i),Fh(n,i);break;case"firefox":if(!Dh||!Lh||!e.shimFirefox)return t("Firefox shim is not included in this adapter release."),s;t("adapter.js shimming firefox."),s.browserShim=Dh,Nc(n,i),Uc(n,i),Ih(n,i),Lh(n,i),Fp(n,i),Op(n,i),zp(n,i),Bp(n,i),kp(n,i),Hp(n,i),Gp(n,i),Vp(n,i),Wp(n,i),Xp(n,i),Ic(n,i),Oh(n,i),Lc(n,i),Dc(n,i);break;case"safari":if(!Nh||!e.shimSafari)return t("Safari shim is not included in this adapter release."),s;t("adapter.js shimming safari."),s.browserShim=Nh,Nc(n,i),Uc(n,i),Zp(n,i),jp(n,i),$p(n,i),qp(n,i),Yp(n,i),Jp(n,i),Kp(n,i),Qp(n,i),Ic(n,i),Uh(n,i),Lc(n,i),Dc(n,i),Fh(n,i);break;default:t("Unsupported browser!");break}return s}var _E=x_({window:typeof window>"u"?void 0:window}),im=_E;function Kr(n,e,t,i){Object.defineProperty(n,e,{get:t,set:i,enumerable:!0,configurable:!0})}var kh=class{constructor(){this.chunkedMTU=16300,this._dataCount=1,this.chunk=e=>{let t=[],i=e.byteLength,s=Math.ceil(i/this.chunkedMTU),r=0,o=0;for(;o<i;){let a=Math.min(i,o+this.chunkedMTU),c=e.slice(o,a),l={__peerData:this._dataCount,n:r,data:c,total:s};t.push(l),o=a,r++}return this._dataCount++,t}}};function yE(n){let e=0;for(let s of n)e+=s.byteLength;let t=new Uint8Array(e),i=0;for(let s of n)t.set(s,i),i+=s.byteLength;return t}var sm=im.default||im,Oc=new class{isWebRTCSupported(){return typeof RTCPeerConnection<"u"}isBrowserSupported(){let n=this.getBrowser(),e=this.getVersion();return this.supportedBrowsers.includes(n)?n==="chrome"?e>=this.minChromeVersion:n==="firefox"?e>=this.minFirefoxVersion:n==="safari"?!this.isIOS&&e>=this.minSafariVersion:!1:!1}getBrowser(){return sm.browserDetails.browser}getVersion(){return sm.browserDetails.version||0}isUnifiedPlanSupported(){let n=this.getBrowser(),e=sm.browserDetails.version||0;if(n==="chrome"&&e<this.minChromeVersion)return!1;if(n==="firefox"&&e>=this.minFirefoxVersion)return!0;if(!window.RTCRtpTransceiver||!("currentDirection"in RTCRtpTransceiver.prototype))return!1;let t,i=!1;try{t=new RTCPeerConnection,t.addTransceiver("audio"),i=!0}catch{}finally{t&&t.close()}return i}toString(){return`Supports:
    browser:${this.getBrowser()}
    version:${this.getVersion()}
    isIOS:${this.isIOS}
    isWebRTCSupported:${this.isWebRTCSupported()}
    isBrowserSupported:${this.isBrowserSupported()}
    isUnifiedPlanSupported:${this.isUnifiedPlanSupported()}`}constructor(){this.isIOS=typeof navigator<"u"?["iPad","iPhone","iPod"].includes(navigator.platform):!1,this.supportedBrowsers=["firefox","chrome","safari"],this.minFirefoxVersion=59,this.minChromeVersion=72,this.minSafariVersion=605}},vE=n=>!n||/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(n),y_=()=>Math.random().toString(36).slice(2),__={iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:["turn:eu-0.turn.peerjs.com:3478","turn:us-0.turn.peerjs.com:3478"],username:"peerjs",credential:"peerjsp"}],sdpSemantics:"unified-plan"},rm=class extends kh{noop(){}blobToArrayBuffer(e,t){let i=new FileReader;return i.onload=function(s){s.target&&t(s.target.result)},i.readAsArrayBuffer(e),i}binaryStringToArrayBuffer(e){let t=new Uint8Array(e.length);for(let i=0;i<e.length;i++)t[i]=e.charCodeAt(i)&255;return t.buffer}isSecure(){return location.protocol==="https:"}constructor(...e){super(...e),this.CLOUD_HOST="0.peerjs.com",this.CLOUD_PORT=443,this.chunkedBrowsers={Chrome:1,chrome:1},this.defaultConfig=__,this.browser=Oc.getBrowser(),this.browserVersion=Oc.getVersion(),this.pack=wp,this.unpack=Ep,this.supports=(function(){let t={browser:Oc.isBrowserSupported(),webRTC:Oc.isWebRTCSupported(),audioVideo:!1,data:!1,binaryBlob:!1,reliable:!1};if(!t.webRTC)return t;let i;try{i=new RTCPeerConnection(__),t.audioVideo=!0;let s;try{s=i.createDataChannel("_PEERJSTEST",{ordered:!0}),t.data=!0,t.reliable=!!s.ordered;try{s.binaryType="blob",t.binaryBlob=!Oc.isIOS}catch{}}catch{}finally{s&&s.close()}}catch{}finally{i&&i.close()}return t})(),this.validateId=vE,this.randomToken=y_}},oi=new rm,SE="PeerJS: ";var om=class{get logLevel(){return this._logLevel}set logLevel(e){this._logLevel=e}log(...e){this._logLevel>=3&&this._print(3,...e)}warn(...e){this._logLevel>=2&&this._print(2,...e)}error(...e){this._logLevel>=1&&this._print(1,...e)}setLogFunction(e){this._print=e}_print(e,...t){let i=[SE,...t];for(let s in i)i[s]instanceof Error&&(i[s]="("+i[s].name+") "+i[s].message);e>=3?console.log(...i):e>=2?console.warn("WARNING",...i):e>=1&&console.error("ERROR",...i)}constructor(){this._logLevel=0}},Oe=new om,dm={},ME=Object.prototype.hasOwnProperty,Kn="~";function Bc(){}Object.create&&(Bc.prototype=Object.create(null),new Bc().__proto__||(Kn=!1));function bE(n,e,t){this.fn=n,this.context=e,this.once=t||!1}function v_(n,e,t,i,s){if(typeof t!="function")throw new TypeError("The listener must be a function");var r=new bE(t,i||n,s),o=Kn?Kn+e:e;return n._events[o]?n._events[o].fn?n._events[o]=[n._events[o],r]:n._events[o].push(r):(n._events[o]=r,n._eventsCount++),n}function Bh(n,e){--n._eventsCount===0?n._events=new Bc:delete n._events[e]}function Vn(){this._events=new Bc,this._eventsCount=0}Vn.prototype.eventNames=function(){var e=[],t,i;if(this._eventsCount===0)return e;for(i in t=this._events)ME.call(t,i)&&e.push(Kn?i.slice(1):i);return Object.getOwnPropertySymbols?e.concat(Object.getOwnPropertySymbols(t)):e};Vn.prototype.listeners=function(e){var t=Kn?Kn+e:e,i=this._events[t];if(!i)return[];if(i.fn)return[i.fn];for(var s=0,r=i.length,o=new Array(r);s<r;s++)o[s]=i[s].fn;return o};Vn.prototype.listenerCount=function(e){var t=Kn?Kn+e:e,i=this._events[t];return i?i.fn?1:i.length:0};Vn.prototype.emit=function(e,t,i,s,r,o){var a=Kn?Kn+e:e;if(!this._events[a])return!1;var c=this._events[a],l=arguments.length,u,h;if(c.fn){switch(c.once&&this.removeListener(e,c.fn,void 0,!0),l){case 1:return c.fn.call(c.context),!0;case 2:return c.fn.call(c.context,t),!0;case 3:return c.fn.call(c.context,t,i),!0;case 4:return c.fn.call(c.context,t,i,s),!0;case 5:return c.fn.call(c.context,t,i,s,r),!0;case 6:return c.fn.call(c.context,t,i,s,r,o),!0}for(h=1,u=new Array(l-1);h<l;h++)u[h-1]=arguments[h];c.fn.apply(c.context,u)}else{var f=c.length,d;for(h=0;h<f;h++)switch(c[h].once&&this.removeListener(e,c[h].fn,void 0,!0),l){case 1:c[h].fn.call(c[h].context);break;case 2:c[h].fn.call(c[h].context,t);break;case 3:c[h].fn.call(c[h].context,t,i);break;case 4:c[h].fn.call(c[h].context,t,i,s);break;default:if(!u)for(d=1,u=new Array(l-1);d<l;d++)u[d-1]=arguments[d];c[h].fn.apply(c[h].context,u)}}return!0};Vn.prototype.on=function(e,t,i){return v_(this,e,t,i,!1)};Vn.prototype.once=function(e,t,i){return v_(this,e,t,i,!0)};Vn.prototype.removeListener=function(e,t,i,s){var r=Kn?Kn+e:e;if(!this._events[r])return this;if(!t)return Bh(this,r),this;var o=this._events[r];if(o.fn)o.fn===t&&(!s||o.once)&&(!i||o.context===i)&&Bh(this,r);else{for(var a=0,c=[],l=o.length;a<l;a++)(o[a].fn!==t||s&&!o[a].once||i&&o[a].context!==i)&&c.push(o[a]);c.length?this._events[r]=c.length===1?c[0]:c:Bh(this,r)}return this};Vn.prototype.removeAllListeners=function(e){var t;return e?(t=Kn?Kn+e:e,this._events[t]&&Bh(this,t)):(this._events=new Bc,this._eventsCount=0),this};Vn.prototype.off=Vn.prototype.removeListener;Vn.prototype.addListener=Vn.prototype.on;Vn.prefixed=Kn;Vn.EventEmitter=Vn;dm=Vn;var Zr={};Kr(Zr,"ConnectionType",()=>sr);Kr(Zr,"PeerErrorType",()=>an);Kr(Zr,"BaseConnectionErrorType",()=>am);Kr(Zr,"DataConnectionErrorType",()=>pm);Kr(Zr,"SerializationType",()=>Xh);Kr(Zr,"SocketEventType",()=>ir);Kr(Zr,"ServerMessageType",()=>Gn);var sr=(function(n){return n.Data="data",n.Media="media",n})({}),an=(function(n){return n.BrowserIncompatible="browser-incompatible",n.Disconnected="disconnected",n.InvalidID="invalid-id",n.InvalidKey="invalid-key",n.Network="network",n.PeerUnavailable="peer-unavailable",n.SslUnavailable="ssl-unavailable",n.ServerError="server-error",n.SocketError="socket-error",n.SocketClosed="socket-closed",n.UnavailableID="unavailable-id",n.WebRTC="webrtc",n})({}),am=(function(n){return n.NegotiationFailed="negotiation-failed",n.ConnectionClosed="connection-closed",n})({}),pm=(function(n){return n.NotOpenYet="not-open-yet",n.MessageToBig="message-too-big",n})({}),Xh=(function(n){return n.Binary="binary",n.BinaryUTF8="binary-utf8",n.JSON="json",n.None="raw",n})({}),ir=(function(n){return n.Message="message",n.Disconnected="disconnected",n.Error="error",n.Close="close",n})({}),Gn=(function(n){return n.Heartbeat="HEARTBEAT",n.Candidate="CANDIDATE",n.Offer="OFFER",n.Answer="ANSWER",n.Open="OPEN",n.Error="ERROR",n.IdTaken="ID-TAKEN",n.InvalidKey="INVALID-KEY",n.Leave="LEAVE",n.Expire="EXPIRE",n})({}),S_="1.5.5",cm=class extends dm.EventEmitter{constructor(e,t,i,s,r,o=5e3){super(),this.pingInterval=o,this._disconnected=!0,this._messagesQueue=[];let a=e?"wss://":"ws://";this._baseUrl=a+t+":"+i+s+"peerjs?key="+r}start(e,t){this._id=e;let i=`${this._baseUrl}&id=${e}&token=${t}`;this._socket||!this._disconnected||(this._socket=new WebSocket(i+"&version="+S_),this._disconnected=!1,this._socket.onmessage=s=>{let r;try{r=JSON.parse(s.data),Oe.log("Server message received:",r)}catch{Oe.log("Invalid server message",s.data);return}this.emit(ir.Message,r)},this._socket.onclose=s=>{this._disconnected||(Oe.log("Socket closed.",s),this._cleanup(),this._disconnected=!0,this.emit(ir.Disconnected))},this._socket.onopen=()=>{this._disconnected||(this._sendQueuedMessages(),Oe.log("Socket open"),this._scheduleHeartbeat())})}_scheduleHeartbeat(){this._wsPingTimer=setTimeout(()=>{this._sendHeartbeat()},this.pingInterval)}_sendHeartbeat(){if(!this._wsOpen()){Oe.log("Cannot send heartbeat, because socket closed");return}let e=JSON.stringify({type:Gn.Heartbeat});this._socket.send(e),this._scheduleHeartbeat()}_wsOpen(){return!!this._socket&&this._socket.readyState===1}_sendQueuedMessages(){let e=[...this._messagesQueue];this._messagesQueue=[];for(let t of e)this.send(t)}send(e){if(this._disconnected)return;if(!this._id){this._messagesQueue.push(e);return}if(!e.type){this.emit(ir.Error,"Invalid message");return}if(!this._wsOpen())return;let t=JSON.stringify(e);this._socket.send(t)}close(){this._disconnected||(this._cleanup(),this._disconnected=!0)}_cleanup(){this._socket&&(this._socket.onopen=this._socket.onmessage=this._socket.onclose=null,this._socket.close(),this._socket=void 0),clearTimeout(this._wsPingTimer)}},zh=class{constructor(e){this.connection=e}startConnection(e){let t=this._startPeerConnection();if(this.connection.peerConnection=t,this.connection.type===sr.Media&&e._stream&&this._addTracksToConnection(e._stream,t),e.originator){let i=this.connection,s={ordered:!!e.reliable},r=t.createDataChannel(i.label,s);i._initializeDataChannel(r),this._makeOffer()}else this.handleSDP("OFFER",e.sdp)}_startPeerConnection(){Oe.log("Creating RTCPeerConnection.");let e=new RTCPeerConnection(this.connection.provider.options.config);return this._setupListeners(e),e}_setupListeners(e){let t=this.connection.peer,i=this.connection.connectionId,s=this.connection.type,r=this.connection.provider;Oe.log("Listening for ICE candidates."),e.onicecandidate=o=>{!o.candidate||!o.candidate.candidate||(Oe.log(`Received ICE candidates for ${t}:`,o.candidate),r.socket.send({type:Gn.Candidate,payload:{candidate:o.candidate,type:s,connectionId:i},dst:t}))},e.oniceconnectionstatechange=()=>{switch(e.iceConnectionState){case"failed":Oe.log("iceConnectionState is failed, closing connections to "+t),this.connection.emitError(am.NegotiationFailed,"Negotiation of connection to "+t+" failed."),this.connection.close();break;case"closed":Oe.log("iceConnectionState is closed, closing connections to "+t),this.connection.emitError(am.ConnectionClosed,"Connection to "+t+" closed."),this.connection.close();break;case"disconnected":Oe.log("iceConnectionState changed to disconnected on the connection with "+t);break;case"completed":e.onicecandidate=()=>{};break}this.connection.emit("iceStateChanged",e.iceConnectionState)},Oe.log("Listening for data channel"),e.ondatachannel=o=>{Oe.log("Received data channel");let a=o.channel;r.getConnection(t,i)._initializeDataChannel(a)},Oe.log("Listening for remote stream"),e.ontrack=o=>{Oe.log("Received remote stream");let a=o.streams[0],c=r.getConnection(t,i);if(c.type===sr.Media){let l=c;this._addStreamToMediaConnection(a,l)}}}cleanup(){Oe.log("Cleaning up PeerConnection to "+this.connection.peer);let e=this.connection.peerConnection;if(!e)return;this.connection.peerConnection=null,e.onicecandidate=e.oniceconnectionstatechange=e.ondatachannel=e.ontrack=()=>{};let t=e.signalingState!=="closed",i=!1,s=this.connection.dataChannel;s&&(i=!!s.readyState&&s.readyState!=="closed"),(t||i)&&e.close()}async _makeOffer(){let e=this.connection.peerConnection,t=this.connection.provider;try{let i=await e.createOffer(this.connection.options.constraints);Oe.log("Created offer."),this.connection.options.sdpTransform&&typeof this.connection.options.sdpTransform=="function"&&(i.sdp=this.connection.options.sdpTransform(i.sdp)||i.sdp);try{await e.setLocalDescription(i),Oe.log("Set localDescription:",i,`for:${this.connection.peer}`);let s={sdp:i,type:this.connection.type,connectionId:this.connection.connectionId,metadata:this.connection.metadata};if(this.connection.type===sr.Data){let r=this.connection;s={...s,label:r.label,reliable:r.reliable,serialization:r.serialization}}t.socket.send({type:Gn.Offer,payload:s,dst:this.connection.peer})}catch(s){s!="OperationError: Failed to set local offer sdp: Called in wrong state: kHaveRemoteOffer"&&(t.emitError(an.WebRTC,s),Oe.log("Failed to setLocalDescription, ",s))}}catch(i){t.emitError(an.WebRTC,i),Oe.log("Failed to createOffer, ",i)}}async _makeAnswer(){let e=this.connection.peerConnection,t=this.connection.provider;try{let i=await e.createAnswer();Oe.log("Created answer."),this.connection.options.sdpTransform&&typeof this.connection.options.sdpTransform=="function"&&(i.sdp=this.connection.options.sdpTransform(i.sdp)||i.sdp);try{await e.setLocalDescription(i),Oe.log("Set localDescription:",i,`for:${this.connection.peer}`),t.socket.send({type:Gn.Answer,payload:{sdp:i,type:this.connection.type,connectionId:this.connection.connectionId},dst:this.connection.peer})}catch(s){t.emitError(an.WebRTC,s),Oe.log("Failed to setLocalDescription, ",s)}}catch(i){t.emitError(an.WebRTC,i),Oe.log("Failed to create answer, ",i)}}async handleSDP(e,t){t=new RTCSessionDescription(t);let i=this.connection.peerConnection,s=this.connection.provider;Oe.log("Setting remote description",t);let r=this;try{await i.setRemoteDescription(t),Oe.log(`Set remoteDescription:${e} for:${this.connection.peer}`),e==="OFFER"&&await r._makeAnswer()}catch(o){s.emitError(an.WebRTC,o),Oe.log("Failed to setRemoteDescription, ",o)}}async handleCandidate(e){Oe.log("handleCandidate:",e);try{await this.connection.peerConnection.addIceCandidate(e),Oe.log(`Added ICE candidate for:${this.connection.peer}`)}catch(t){this.connection.provider.emitError(an.WebRTC,t),Oe.log("Failed to handleCandidate, ",t)}}_addTracksToConnection(e,t){if(Oe.log(`add tracks from stream ${e.id} to peer connection`),!t.addTrack)return Oe.error("Your browser does't support RTCPeerConnection#addTrack. Ignored.");e.getTracks().forEach(i=>{t.addTrack(i,e)})}_addStreamToMediaConnection(e,t){Oe.log(`add stream ${e.id} to media connection ${t.connectionId}`),t.addStream(e)}},Hh=class extends dm.EventEmitter{emitError(e,t){Oe.error("Error:",t),this.emit("error",new lm(`${e}`,t))}},lm=class extends Error{constructor(e,t){typeof t=="string"?super(t):(super(),Object.assign(this,t)),this.type=e}},Gh=class extends Hh{get open(){return this._open}constructor(e,t,i){super(),this.peer=e,this.provider=t,this.options=i,this._open=!1,this.metadata=i.metadata}},Vh=class n extends Gh{static#e=this.ID_PREFIX="mc_";get type(){return sr.Media}get localStream(){return this._localStream}get remoteStream(){return this._remoteStream}constructor(e,t,i){super(e,t,i),this._localStream=this.options._stream,this.connectionId=this.options.connectionId||n.ID_PREFIX+oi.randomToken(),this._negotiator=new zh(this),this._localStream&&this._negotiator.startConnection({_stream:this._localStream,originator:!0})}_initializeDataChannel(e){this.dataChannel=e,this.dataChannel.onopen=()=>{Oe.log(`DC#${this.connectionId} dc connection success`),this.emit("willCloseOnRemote")},this.dataChannel.onclose=()=>{Oe.log(`DC#${this.connectionId} dc closed for:`,this.peer),this.close()}}addStream(e){Oe.log("Receiving stream",e),this._remoteStream=e,super.emit("stream",e)}handleMessage(e){let t=e.type,i=e.payload;switch(e.type){case Gn.Answer:this._negotiator.handleSDP(t,i.sdp),this._open=!0;break;case Gn.Candidate:this._negotiator.handleCandidate(i.candidate);break;default:Oe.warn(`Unrecognized message type:${t} from peer:${this.peer}`);break}}answer(e,t={}){if(this._localStream){Oe.warn("Local stream already exists on this MediaConnection. Are you answering a call twice?");return}this._localStream=e,t&&t.sdpTransform&&(this.options.sdpTransform=t.sdpTransform),this._negotiator.startConnection({...this.options._payload,_stream:e});let i=this.provider._getMessages(this.connectionId);for(let s of i)this.handleMessage(s);this._open=!0}close(){this._negotiator&&(this._negotiator.cleanup(),this._negotiator=null),this._localStream=null,this._remoteStream=null,this.provider&&(this.provider._removeConnection(this),this.provider=null),this.options&&this.options._stream&&(this.options._stream=null),this.open&&(this._open=!1,super.emit("close"))}},um=class{constructor(e){this._options=e}_buildRequest(e){let t=this._options.secure?"https":"http",{host:i,port:s,path:r,key:o}=this._options,a=new URL(`${t}://${i}:${s}${r}${o}/${e}`);return a.searchParams.set("ts",`${Date.now()}${Math.random()}`),a.searchParams.set("version",S_),fetch(a.href,{referrerPolicy:this._options.referrerPolicy})}async retrieveId(){try{let e=await this._buildRequest("id");if(e.status!==200)throw new Error(`Error. Status:${e.status}`);return e.text()}catch(e){Oe.error("Error retrieving ID",e);let t="";throw this._options.path==="/"&&this._options.host!==oi.CLOUD_HOST&&(t=" If you passed in a `path` to your self-hosted PeerServer, you'll also need to pass in that same path when creating a new Peer."),new Error("Could not get an ID from the server."+t)}}async listAllPeers(){try{let e=await this._buildRequest("peers");if(e.status!==200){if(e.status===401){let t="";throw this._options.host===oi.CLOUD_HOST?t="It looks like you're using the cloud server. You can email team@peerjs.com to enable peer listing for your API key.":t="You need to enable `allow_discovery` on your self-hosted PeerServer to use this feature.",new Error("It doesn't look like you have permission to list peers IDs. "+t)}throw new Error(`Error. Status:${e.status}`)}return e.json()}catch(e){throw Oe.error("Error retrieving list peers",e),new Error("Could not get list peers from the server."+e)}}},Wh=class n extends Gh{static#e=this.ID_PREFIX="dc_";static#t=this.MAX_BUFFERED_AMOUNT=8388608;get type(){return sr.Data}constructor(e,t,i){super(e,t,i),this.connectionId=this.options.connectionId||n.ID_PREFIX+y_(),this.label=this.options.label||this.connectionId,this.reliable=!!this.options.reliable,this._negotiator=new zh(this),this._negotiator.startConnection(this.options._payload||{originator:!0,reliable:this.reliable})}_initializeDataChannel(e){this.dataChannel=e,this.dataChannel.onopen=()=>{Oe.log(`DC#${this.connectionId} dc connection success`),this._open=!0,this.emit("open")},this.dataChannel.onmessage=t=>{Oe.log(`DC#${this.connectionId} dc onmessage:`,t.data)},this.dataChannel.onclose=()=>{Oe.log(`DC#${this.connectionId} dc closed for:`,this.peer),this.close()}}close(e){if(e?.flush){this.send({__peerData:{type:"close"}});return}this._negotiator&&(this._negotiator.cleanup(),this._negotiator=null),this.provider&&(this.provider._removeConnection(this),this.provider=null),this.dataChannel&&(this.dataChannel.onopen=null,this.dataChannel.onmessage=null,this.dataChannel.onclose=null,this.dataChannel=null),this.open&&(this._open=!1,super.emit("close"))}send(e,t=!1){if(!this.open){this.emitError(pm.NotOpenYet,"Connection is not open. You should listen for the `open` event before sending messages.");return}return this._send(e,t)}async handleMessage(e){let t=e.payload;switch(e.type){case Gn.Answer:await this._negotiator.handleSDP(e.type,t.sdp);break;case Gn.Candidate:await this._negotiator.handleCandidate(t.candidate);break;default:Oe.warn("Unrecognized message type:",e.type,"from peer:",this.peer);break}}},kc=class extends Wh{get bufferSize(){return this._bufferSize}_initializeDataChannel(e){super._initializeDataChannel(e),this.dataChannel.binaryType="arraybuffer",this.dataChannel.addEventListener("message",t=>this._handleDataMessage(t))}_bufferedSend(e){(this._buffering||!this._trySend(e))&&(this._buffer.push(e),this._bufferSize=this._buffer.length)}_trySend(e){if(!this.open)return!1;if(this.dataChannel.bufferedAmount>Wh.MAX_BUFFERED_AMOUNT)return this._buffering=!0,setTimeout(()=>{this._buffering=!1,this._tryBuffer()},50),!1;try{this.dataChannel.send(e)}catch(t){return Oe.error(`DC#:${this.connectionId} Error when sending:`,t),this._buffering=!0,this.close(),!1}return!0}_tryBuffer(){if(!this.open||this._buffer.length===0)return;let e=this._buffer[0];this._trySend(e)&&(this._buffer.shift(),this._bufferSize=this._buffer.length,this._tryBuffer())}close(e){if(e?.flush){this.send({__peerData:{type:"close"}});return}this._buffer=[],this._bufferSize=0,super.close()}constructor(...e){super(...e),this._buffer=[],this._bufferSize=0,this._buffering=!1}},Fc=class extends kc{close(e){super.close(e),this._chunkedData={}}constructor(e,t,i){super(e,t,i),this.chunker=new kh,this.serialization=Xh.Binary,this._chunkedData={}}_handleDataMessage({data:e}){let t=Ep(e),i=t.__peerData;if(i){if(i.type==="close"){this.close();return}this._handleChunk(t);return}this.emit("data",t)}_handleChunk(e){let t=e.__peerData,i=this._chunkedData[t]||{data:[],count:0,total:e.total};if(i.data[e.n]=new Uint8Array(e.data),i.count++,this._chunkedData[t]=i,i.total===i.count){delete this._chunkedData[t];let s=yE(i.data);this._handleDataMessage({data:s})}}_send(e,t){let i=wp(e);if(i instanceof Promise)return this._send_blob(i);if(!t&&i.byteLength>this.chunker.chunkedMTU){this._sendChunks(i);return}this._bufferedSend(i)}async _send_blob(e){let t=await e;if(t.byteLength>this.chunker.chunkedMTU){this._sendChunks(t);return}this._bufferedSend(t)}_sendChunks(e){let t=this.chunker.chunk(e);Oe.log(`DC#${this.connectionId} Try to send ${t.length} chunks...`);for(let i of t)this.send(i,!0)}},hm=class extends kc{_handleDataMessage({data:e}){super.emit("data",e)}_send(e,t){this._bufferedSend(e)}constructor(...e){super(...e),this.serialization=Xh.None}},fm=class extends kc{_handleDataMessage({data:e}){let t=this.parse(this.decoder.decode(e)),i=t.__peerData;if(i&&i.type==="close"){this.close();return}this.emit("data",t)}_send(e,t){let i=this.encoder.encode(this.stringify(e));if(i.byteLength>=oi.chunkedMTU){this.emitError(pm.MessageToBig,"Message too big for JSON channel");return}this._bufferedSend(i)}constructor(...e){super(...e),this.serialization=Xh.JSON,this.encoder=new TextEncoder,this.decoder=new TextDecoder,this.stringify=JSON.stringify,this.parse=JSON.parse}};var zc=class n extends Hh{static#e=this.DEFAULT_KEY="peerjs";get id(){return this._id}get options(){return this._options}get open(){return this._open}get socket(){return this._socket}get connections(){let e=Object.create(null);for(let[t,i]of this._connections)e[t]=i;return e}get destroyed(){return this._destroyed}get disconnected(){return this._disconnected}constructor(e,t){super(),this._serializers={raw:hm,json:fm,binary:Fc,"binary-utf8":Fc,default:Fc},this._id=null,this._lastServerId=null,this._destroyed=!1,this._disconnected=!1,this._open=!1,this._connections=new Map,this._lostMessages=new Map;let i;if(e&&e.constructor==Object?t=e:e&&(i=e.toString()),t={debug:0,host:oi.CLOUD_HOST,port:oi.CLOUD_PORT,path:"/",key:n.DEFAULT_KEY,token:oi.randomToken(),config:oi.defaultConfig,referrerPolicy:"strict-origin-when-cross-origin",serializers:{},...t},this._options=t,this._serializers={...this._serializers,...this.options.serializers},this._options.host==="/"&&(this._options.host=window.location.hostname),this._options.path&&(this._options.path[0]!=="/"&&(this._options.path="/"+this._options.path),this._options.path[this._options.path.length-1]!=="/"&&(this._options.path+="/")),this._options.secure===void 0&&this._options.host!==oi.CLOUD_HOST?this._options.secure=oi.isSecure():this._options.host==oi.CLOUD_HOST&&(this._options.secure=!0),this._options.logFunction&&Oe.setLogFunction(this._options.logFunction),Oe.logLevel=this._options.debug||0,this._api=new um(t),this._socket=this._createServerConnection(),!oi.supports.audioVideo&&!oi.supports.data){this._delayedAbort(an.BrowserIncompatible,"The current browser does not support WebRTC");return}if(i&&!oi.validateId(i)){this._delayedAbort(an.InvalidID,`ID "${i}" is invalid`);return}i?this._initialize(i):this._api.retrieveId().then(s=>this._initialize(s)).catch(s=>this._abort(an.ServerError,s))}_createServerConnection(){let e=new cm(this._options.secure,this._options.host,this._options.port,this._options.path,this._options.key,this._options.pingInterval);return e.on(ir.Message,t=>{this._handleMessage(t)}),e.on(ir.Error,t=>{this._abort(an.SocketError,t)}),e.on(ir.Disconnected,()=>{this.disconnected||(this.emitError(an.Network,"Lost connection to server."),this.disconnect())}),e.on(ir.Close,()=>{this.disconnected||this._abort(an.SocketClosed,"Underlying socket is already closed.")}),e}_initialize(e){this._id=e,this.socket.start(e,this._options.token)}_handleMessage(e){let t=e.type,i=e.payload,s=e.src;switch(t){case Gn.Open:this._lastServerId=this.id,this._open=!0,this.emit("open",this.id);break;case Gn.Error:this._abort(an.ServerError,i.msg);break;case Gn.IdTaken:this._abort(an.UnavailableID,`ID "${this.id}" is taken`);break;case Gn.InvalidKey:this._abort(an.InvalidKey,`API KEY "${this._options.key}" is invalid`);break;case Gn.Leave:Oe.log(`Received leave message from ${s}`),this._cleanupPeer(s),this._connections.delete(s);break;case Gn.Expire:this.emitError(an.PeerUnavailable,`Could not connect to peer ${s}`);break;case Gn.Offer:{let r=i.connectionId,o=this.getConnection(s,r);if(o&&(o.close(),Oe.warn(`Offer received for existing Connection ID:${r}`)),i.type===sr.Media){let c=new Vh(s,this,{connectionId:r,_payload:i,metadata:i.metadata});o=c,this._addConnection(s,o),this.emit("call",c)}else if(i.type===sr.Data){let c=new this._serializers[i.serialization](s,this,{connectionId:r,_payload:i,metadata:i.metadata,label:i.label,serialization:i.serialization,reliable:i.reliable});o=c,this._addConnection(s,o),this.emit("connection",c)}else{Oe.warn(`Received malformed connection type:${i.type}`);return}let a=this._getMessages(r);for(let c of a)o.handleMessage(c);break}default:{if(!i){Oe.warn(`You received a malformed message from ${s} of type ${t}`);return}let r=i.connectionId,o=this.getConnection(s,r);o&&o.peerConnection?o.handleMessage(e):r?this._storeMessage(r,e):Oe.warn("You received an unrecognized message:",e);break}}}_storeMessage(e,t){this._lostMessages.has(e)||this._lostMessages.set(e,[]),this._lostMessages.get(e).push(t)}_getMessages(e){let t=this._lostMessages.get(e);return t?(this._lostMessages.delete(e),t):[]}connect(e,t={}){if(t={serialization:"default",...t},this.disconnected){Oe.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect, or call reconnect on this peer if you believe its ID to still be available."),this.emitError(an.Disconnected,"Cannot connect to new Peer after disconnecting from server.");return}let i=new this._serializers[t.serialization](e,this,t);return this._addConnection(e,i),i}call(e,t,i={}){if(this.disconnected){Oe.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect."),this.emitError(an.Disconnected,"Cannot connect to new Peer after disconnecting from server.");return}if(!t){Oe.error("To call a peer, you must provide a stream from your browser's `getUserMedia`.");return}let s=new Vh(e,this,{...i,_stream:t});return this._addConnection(e,s),s}_addConnection(e,t){Oe.log(`add connection ${t.type}:${t.connectionId} to peerId:${e}`),this._connections.has(e)||this._connections.set(e,[]),this._connections.get(e).push(t)}_removeConnection(e){let t=this._connections.get(e.peer);if(t){let i=t.indexOf(e);i!==-1&&t.splice(i,1)}this._lostMessages.delete(e.connectionId)}getConnection(e,t){let i=this._connections.get(e);if(!i)return null;for(let s of i)if(s.connectionId===t)return s;return null}_delayedAbort(e,t){setTimeout(()=>{this._abort(e,t)},0)}_abort(e,t){Oe.error("Aborting!"),this.emitError(e,t),this._lastServerId?this.disconnect():this.destroy()}destroy(){this.destroyed||(Oe.log(`Destroy peer with ID:${this.id}`),this.disconnect(),this._cleanup(),this._destroyed=!0,this.emit("close"))}_cleanup(){for(let e of this._connections.keys())this._cleanupPeer(e),this._connections.delete(e);this.socket.removeAllListeners()}_cleanupPeer(e){let t=this._connections.get(e);if(t)for(let i of t)i.close()}disconnect(){if(this.disconnected)return;let e=this.id;Oe.log(`Disconnect peer with ID:${e}`),this._disconnected=!0,this._open=!1,this.socket.close(),this._lastServerId=e,this._id=null,this.emit("disconnected",e)}reconnect(){if(this.disconnected&&!this.destroyed)Oe.log(`Attempting reconnection to server with ID ${this._lastServerId}`),this._disconnected=!1,this._initialize(this._lastServerId);else{if(this.destroyed)throw new Error("This peer cannot reconnect to the server. It has already been destroyed.");if(!this.disconnected&&!this.open)Oe.error("In a hurry? We're still trying to make the initial connection!");else throw new Error(`Peer ${this.id} cannot reconnect because it is not disconnected from the server!`)}}listAllPeers(e=t=>{}){this._api.listAllPeers().then(t=>e(t)).catch(t=>this._abort(an.ServerError,t))}};var mm="coral-coast-rally-lobby-v1-k7q2z9",TE="ccr-k7q2z9-",EE=()=>Math.random().toString(36).slice(2,10),M_={debug:0};function b_(n){let e={me:null,id:null,nick:"",paint:0,look:null,status:"idle",online:!1,started:!1,lobbyConn:null,lobbyPeer:null,isLobby:!1,claiming:!1,roster:[],rosterMap:new Map,clients:new Map,room:null,hostConn:null,hostNick:"",pending:new Map},t=()=>Date.now(),i=(A,L)=>n.status&&n.status(A,L),s=()=>({id:e.id,nick:e.nick,status:e.status,paint:e.paint,seen:t()}),r=()=>({t:"hello",id:e.id,nick:e.nick,status:e.status,paint:e.paint,board:n.getBoard()});function o(A,L){if(e.nick=A,e.paint=L,e.started){g();return}e.started=!0,i("Connecting\u2026"),e.me=new zc(TE+EE(),M_),e.me.on("open",B=>{e.id=B,e.online=!0,a()}),e.me.on("connection",b),e.me.on("error",B=>{let P=String(B&&B.message||"");if(B.type==="peer-unavailable"){if(P.includes(mm))c();else if(e.room)for(let[H,K]of e.room.guests)P.includes(H)&&(K.state="offline",n.room(),setTimeout(()=>y(H),2500))}else["network","server-error","socket-error","socket-closed"].includes(B.type)&&i("Network problem \u2014 retrying\u2026","bad")}),e.me.on("disconnected",()=>setTimeout(()=>{e.me&&!e.me.destroyed&&e.me.disconnected&&e.me.reconnect()},1500)),setInterval(()=>{if(e.lobbyConn&&e.lobbyConn.open&&e.lobbyConn.send({t:"ping"}),e.isLobby){let B=!1;for(let[H,K]of e.rosterMap)H!==e.id&&t()-K.seen>22e3&&(e.rosterMap.delete(H),B=!0);let P=e.rosterMap.get(e.id);P&&(P.seen=t()),B&&h()}},5e3)}function a(){if(e.isLobby||!e.me||e.me.destroyed)return;let A=e.me.connect(mm,{serialization:"json",reliable:!0}),L=!1,B=setTimeout(()=>{if(!L){try{A.close()}catch{}c()}},7e3);A.on("open",()=>{L=!0,clearTimeout(B),e.lobbyConn=A,A.send(r()),i("Online","ok")}),A.on("data",d);let P=()=>{clearTimeout(B),e.lobbyConn===A&&(e.lobbyConn=null,i("Lobby moved \u2014 reconnecting\u2026"),setTimeout(c,300+Math.random()*1500))};A.on("close",P),A.on("error",P)}function c(){if(e.claiming||e.isLobby||e.lobbyConn&&e.lobbyConn.open)return;e.claiming=!0;let A=new zc(mm,M_);A.on("open",()=>{e.claiming=!1,e.isLobby=!0,e.lobbyPeer=A,i("Online","ok"),e.rosterMap.set(e.id,s()),h()}),A.on("connection",L=>{L.on("data",P=>l(L,P));let B=()=>{let P=e.clients.get(L);e.clients.delete(L),P&&(e.rosterMap.delete(P),h())};L.on("close",B),L.on("error",B)}),A.on("error",L=>{L.type==="unavailable-id"&&(e.claiming=!1,A.destroy(),setTimeout(a,400+Math.random()*900))}),A.on("disconnected",()=>{A.destroyed||setTimeout(()=>A.reconnect(),1e3)})}function l(A,L){if(!(!L||typeof L!="object")){if(L.t==="hello")e.clients.set(A,L.id),e.rosterMap.set(L.id,{id:L.id,nick:String(L.nick||"").slice(0,14),status:L.status,paint:L.paint|0,seen:t()}),Array.isArray(L.board)&&n.mergeBoard(L.board)?f():A.send({t:"board",e:n.getBoard()}),h();else if(L.t==="upd"){let B=e.rosterMap.get(L.id);B&&(B.status=L.status,B.nick=String(L.nick||B.nick).slice(0,14),B.paint=L.paint|0,B.seen=t(),h())}else if(L.t==="stat")L.e&&n.mergeBoard([L.e])&&f();else if(L.t==="ping"){let B=e.rosterMap.get(e.clients.get(A));B&&(B.seen=t())}}}function u(){return[...e.rosterMap.values()].map(({id:A,nick:L,status:B,paint:P})=>({id:A,nick:L,status:B,paint:P}))}function h(){let A=u();for(let L of e.clients.keys())L.open&&L.send({t:"roster",list:A});e.roster=A,n.roster(A)}function f(){let A=n.getBoard();for(let L of e.clients.keys())L.open&&L.send({t:"board",e:A});n.boardChanged()}function d(A){A&&(A.t==="roster"?(e.roster=A.list||[],n.roster(e.roster)):A.t==="board"&&(n.mergeBoard(A.e||[]),n.boardChanged()))}function g(){e.isLobby?(e.rosterMap.set(e.id,s()),h()):e.lobbyConn&&e.lobbyConn.open&&e.lobbyConn.send({t:"upd",id:e.id,nick:e.nick,status:e.status,paint:e.paint})}function x(A){e.status!==A&&(e.status=A,g())}function p(A){e.isLobby?n.mergeBoard([A])&&f():e.lobbyConn&&e.lobbyConn.open&&e.lobbyConn.send({t:"stat",e:A})}function m(A,L){if(!e.me||e.hostConn||e.room&&e.room.guests.has(A))return;e.room||(e.room={guests:new Map}),e.look=L;let B=e.roster.find($=>$.id===A),P=e.me.connect(A,{serialization:"json",reliable:!0}),H={id:A,conn:P,nick:B?B.nick:"?",state:"invited",look:null};e.room.guests.set(A,H),x("room"),n.room(),P.on("open",()=>P.send({t:"invite",id:e.id,nick:e.nick})),P.on("data",$=>{$&&($.t==="accept"?(H.state="ready",H.look=$.look,H.nick=String($.nick||H.nick).slice(0,14),n.room(),v()):$.t==="decline"?(H.state=$.busy?"busy":"declined",n.room(),setTimeout(()=>y(A),2500)):$.t==="s"&&n.guestState(A,$.d))});let K=()=>{e.room&&e.room.guests.get(A)===H&&(e.room.guests.delete(A),n.guestLeft(A),n.room(),v())};P.on("close",K),P.on("error",K)}function y(A){if(!e.room)return;let L=e.room.guests.get(A);if(L){e.room.guests.delete(A);try{L.conn.close()}catch{}n.room(),v()}}function v(){if(!e.room)return;let A=[e.nick,...[...e.room.guests.values()].filter(L=>L.state==="ready").map(L=>L.nick)];for(let L of e.room.guests.values())L.state==="ready"&&L.conn.open&&L.conn.send({t:"room",list:A})}function S(){return e.room?[...e.room.guests.values()].filter(A=>A.state==="ready"&&A.conn.open):[]}function T(A){if(e.room){for(let L of[...e.room.guests.values()])L.state!=="ready"&&y(L.id);M(A),x("racing")}}function M(A){if(e.room)for(let L of e.room.guests.values())L.state==="ready"&&L.conn.open&&L.conn.send(A)}function _(){if(e.room){for(let A of e.room.guests.values())try{A.conn.close()}catch{}e.room=null}if(e.hostConn){try{e.hostConn.close()}catch{}e.hostConn=null}x("idle"),n.room()}function b(A){let L=null;A.on("data",P=>{if(P)if(P.t==="invite"){if(L=P.id,e.hostConn||e.room||!n.canAccept()){A.send({t:"decline",busy:!0}),setTimeout(()=>A.close(),500);return}e.pending.set(P.id,A),n.invite({id:P.id,nick:String(P.nick||"?").slice(0,14)})}else e.hostConn===A&&(P.t==="start"?(x("racing"),n.start(P)):P.t==="S"?n.hostStates(P.l):P.t==="room"&&n.roomList(P.list))});let B=()=>{L&&e.pending.get(L)===A&&(e.pending.delete(L),n.inviteGone(L)),e.hostConn===A&&(e.hostConn=null,x("idle"),n.hostLeft())};A.on("close",B),A.on("error",B)}function R(A,L,B){let P=e.pending.get(A);if(!P)return!1;if(e.pending.delete(A),L&&P.open){for(let[H,K]of e.pending)K.send({t:"decline"}),setTimeout(()=>K.close(),400),n.inviteGone(H);return e.pending.clear(),e.hostConn=P,e.hostNick=(e.roster.find(H=>H.id===A)||{}).nick||"",P.send({t:"accept",nick:e.nick,look:B}),x("room"),!0}try{P.send({t:"decline"}),setTimeout(()=>P.close(),400)}catch{}return!1}function I(A){e.hostConn&&e.hostConn.open&&e.hostConn.send(A)}return{start:o,setStatus:x,reportStat:p,challenge:m,dropGuest:y,readyGuests:S,startRoom:T,broadcast:M,closeRoom:_,respond:R,toHost:I,get id(){return e.id},get online(){return e.online},get roster(){return e.roster},get room(){return e.room},get inRoomAsGuest(){return!!e.hostConn},get hostNick(){return e.hostNick},get status(){return e.status}}}var qh=n=>440*Math.pow(2,(n-69)/12);function wE(n){return()=>{n|=0,n=n+1831565813|0;let e=Math.imul(n^n>>>15,1|n);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}var T_=[0,2,4,5,7,9,11],AE=[0,2,3,5,7,9,10],RE=[0,1,4,5,7,8,10],gm=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],E_=[0,2,4,6,8,10,12,14],Hc=[2,6,10,14],w_={beach:{bpm:112,root:60,scale:T_,prog:[5,3,0,4],seed:7,lead:"flute",arp:"marimba",arpRate:1,cut:[600,4200],swing:.05,motif:[[0,3],[3,3],[6,2],[8,2],[10,4],[16,3],[19,3],[22,2],[24,6]],bass:[[0,0,2],[3,0,2],[6,12,1],[8,0,2],[11,0,2],[14,12,1]],drums:{kick:[0,4,8,12],clap:[4,12],ohat:Hc,shaker:gm},verse:{kick:[0,4,8,12],hat:Hc,shaker:gm}},desert:{bpm:100,root:52,scale:RE,prog:[0,1,0,6],seed:21,lead:"oud",arp:"pluck",arpRate:2,cut:[450,2400],swing:0,drone:!0,motif:[[0,2],[2,1],[3,3],[6,2],[8,6],[16,2],[18,2],[20,2],[22,2],[24,8]],bass:[[0,0,3],[6,0,2],[8,0,3],[12,0,2],[14,12,1]],drums:{kick:[0,7,10],clap:[4,12],dum:[0,8],tek:[3,6,10,14],tik:[1,5,9,13,15]},verse:{dum:[0,8],tek:[3,6,10,12,14],tik:[1,5,9,13,15]}},country:{bpm:124,root:55,scale:T_,prog:[0,4,5,3],seed:33,lead:"synth",arp:"pluck",arpRate:1,cut:[700,5e3],swing:.06,motif:[[0,2],[2,2],[4,2],[6,4],[10,2],[12,4],[16,2],[18,2],[20,2],[22,2],[24,8]],bass:[[0,0,2],[2,0,2],[6,0,2],[10,0,2],[14,12,2]],drums:{kick:[0,4,8,12],clap:[4,12],hat:E_,ohat:Hc},verse:{kick:[0,8],clap:[4,12],hat:E_}},snow:{bpm:86,root:62,scale:AE,prog:[0,3,6,4],seed:47,lead:"glass",arp:"marimba",arpRate:1,cut:[500,3800],swing:.03,stabs:[0,3,6,8,11,14],motif:[[0,4],[4,2],[6,4],[10,6],[16,3],[19,3],[22,6],[28,4]],bass:[[0,0,6],[6,0,4],[10,0,6]],drums:{kick:[0,10],clap:[8],hat:Hc,shaker:gm},verse:{kick:[0,10],shaker:Hc}}};function CE(n,e,t){let i=Math.floor(n.sampleRate*e),s=n.createBuffer(2,i,n.sampleRate);for(let r=0;r<2;r++){let o=s.getChannelData(r),a=0;for(let c=0;c<i;c++)a+=(Math.random()*2-1-a)*(.25+.6*(1-c/i)),o[c]=a*Math.pow(1-c/i,t)}return s}function xm(n,e){let t=n.createGain();t.gain.value=0,t.connect(e);let i=n.createDynamicsCompressor();i.threshold.value=-16,i.ratio.value=3.5,i.attack.value=.01,i.release.value=.2,i.connect(t);let s=n.createGain();s.gain.value=.9,s.connect(i);let r=n.createGain();r.connect(s);let o=n.createGain();o.connect(s);let a=n.createConvolver();a.buffer=CE(n,2,2.4);let c=n.createGain();c.gain.value=.5,a.connect(c),c.connect(s);let l=n.createDelay(2),u=n.createGain(),h=n.createBiquadFilter(),f=n.createGain();u.gain.value=.38,h.type="lowpass",h.frequency.value=2800,f.gain.value=.3,l.connect(h),h.connect(u),u.connect(l),h.connect(f),f.connect(s),f.connect(a);let d=n.createBuffer(1,n.sampleRate,n.sampleRate);{let N=d.getChannelData(0);for(let U=0;U<N.length;U++)N[U]=Math.random()*2-1}let g=(N,U,W,k,ee,le=1e-4,ae=0)=>{N.gain.setValueAtTime(1e-4,U),N.gain.linearRampToValueAtTime(k,U+W),N.gain.setTargetAtTime(le,U+W+ae,ee/3)},x=(N,U,W,k,ee=0)=>{let le=n.createOscillator();return le.type=N,le.frequency.setValueAtTime(U,W),le.detune.value=ee,le.start(W),le.stop(k),le},p=(N,U,W=.7)=>{let k=n.createBiquadFilter();return k.type=N,k.frequency.value=U,k.Q.value=W,k},m=(N,U)=>{let W=n.createStereoPanner();return W.pan.value=U,N.connect(W),W};function y(N,U,W=0,k=0){if(N.connect(U),W){let ee=n.createGain();ee.gain.value=W,N.connect(ee),ee.connect(a)}if(k){let ee=n.createGain();ee.gain.value=k,N.connect(ee),ee.connect(l)}}function v(N,U,W,k,ee=.008,le=5.2,ae=.18){let Ie=x("sine",le,W,k),Ce=n.createGain();Ce.gain.setValueAtTime(0,W),Ce.gain.linearRampToValueAtTime(U*ee,W+ae+.25),Ie.connect(Ce),Ce.connect(N.frequency)}let S=0,T={flute(N,U,W,k){let ee=U+k+.5,le=n.createGain(),ae=p("lowpass",3200);le.gain.setValueAtTime(1e-4,U),le.gain.linearRampToValueAtTime(W*.3,U+.04),le.gain.setTargetAtTime(W*.22,U+.05,.1),le.gain.setTargetAtTime(1e-4,U+k*.92,.07);for(let Dt of[-6,6]){let ft=x("triangle",N,U,ee,Dt);S&&Math.abs(Math.log2(N/S))<.6&&(ft.frequency.setValueAtTime(S,U),ft.frequency.exponentialRampToValueAtTime(N,U+.05)),v(ft,N,U,ee),ft.connect(ae)}let Ie=x("sine",N*2,U,ee),Ce=n.createGain();Ce.gain.value=.12,Ie.connect(Ce),Ce.connect(ae);let Ae=n.createBufferSource(),Ze=p("bandpass",N*2,1.5),pt=n.createGain();Ae.buffer=d,pt.gain.setValueAtTime(.5,U),pt.gain.setTargetAtTime(.12,U+.03,.05),Ae.connect(Ze),Ze.connect(pt),pt.connect(ae),Ae.start(U,Math.random()*.5),Ae.stop(ee),ae.connect(le),y(le,o,.35,.25)},synth(N,U,W,k){let ee=U+k+.4,le=n.createGain(),ae=p("lowpass",N*6,3);ae.frequency.setValueAtTime(N*9,U),ae.frequency.setTargetAtTime(N*3.5,U+.01,.15),le.gain.setValueAtTime(1e-4,U),le.gain.linearRampToValueAtTime(W*.17,U+.01),le.gain.setTargetAtTime(W*.13,U+.02,.12),le.gain.setTargetAtTime(1e-4,U+k*.9,.06);for(let[Ie,Ce,Ae]of[["sawtooth",-9,1],["sawtooth",9,1],["square",0,.5]]){let Ze=x(Ie,N*Ae,U,ee,Ce);S&&Math.abs(Math.log2(N/S))<.6&&(Ze.frequency.setValueAtTime(S*Ae,U),Ze.frequency.exponentialRampToValueAtTime(N*Ae,U+.04)),v(Ze,N*Ae,U,ee,.006),Ze.connect(ae)}ae.connect(le),y(le,o,.3,.3)},oud(N,U,W,k,ee){let le=k>ee*2.5?Math.round(k/ee):1;for(let ae=0;ae<le;ae++)T.pick(N,U+ae*ee,W*(ae?.7:1),le>1?ee*1.2:.7,ae===0)},pick(N,U,W,k,ee){let le=n.createGain(),ae=p("lowpass",N*8,5);ae.frequency.setValueAtTime(N*11,U),ae.frequency.exponentialRampToValueAtTime(N*1.4,U+.3),g(le,U,.003,W*.3,k);for(let[Ie,Ce]of[["sawtooth",-5],["square",5]]){let Ae=x(Ie,N,U,U+k+.3,Ce);ee&&(Ae.frequency.setValueAtTime(N*.975,U),Ae.frequency.exponentialRampToValueAtTime(N,U+.05)),Ae.connect(ae)}ae.connect(le),y(m(le,(Math.random()-.5)*.3),o,.4,.2)},glass(N,U,W,k){let ee=U+k+1.6,le=n.createGain();g(le,U,.01,W*.26,Math.max(.8,k*1.2));let ae=x("sine",N,U,ee),Ie=x("sine",N*2,U,ee),Ce=n.createGain();Ce.gain.setValueAtTime(N*.9,U),Ce.gain.exponentialRampToValueAtTime(N*.08,U+.6),Ie.connect(Ce),Ce.connect(ae.frequency),v(ae,N,U,ee,.005,4.5,.3);let Ae=x("triangle",N,U,ee,7),Ze=n.createGain();Ze.gain.setValueAtTime(0,U),Ze.gain.linearRampToValueAtTime(.4,U+.12),Ae.connect(Ze),Ze.connect(le),ae.connect(le),y(le,o,.5,.35)},marimba(N,U,W,k){let ee=n.createGain();g(ee,U,.002,W*.22,.4),x("sine",N,U,U+.6).connect(ee);let le=x("sine",N*4,U,U+.12),ae=n.createGain();g(ae,U,.001,.35,.06),le.connect(ae),ae.connect(ee),y(m(ee,k),r,.25,.3)},pluck(N,U,W,k){let ee=n.createGain(),le=p("lowpass",N*6,2);le.frequency.setValueAtTime(N*7,U),le.frequency.exponentialRampToValueAtTime(N*1.2,U+.2),g(ee,U,.002,W*.16,.26),x("sawtooth",N,U,U+.4,4).connect(le),x("sawtooth",N,U,U+.4,-4).connect(le),le.connect(ee),y(m(ee,k),r,.2,.3)},chord(N,U,W,k,ee,le){let ae=n.createGain(),Ie=p("lowpass",k,.9),Ce=U+W+.6;ae.gain.setValueAtTime(1e-4,U),ae.gain.linearRampToValueAtTime(ee,U+(le?.006:.03)),le||ae.gain.setValueAtTime(ee,U+W-.04),ae.gain.setTargetAtTime(1e-4,U+(le?.02:W-.04),le?W*.45:.1),le&&(Ie.frequency.setValueAtTime(k*1.6,U),Ie.frequency.exponentialRampToValueAtTime(k*.6,U+W)),N.forEach((Ae,Ze)=>{for(let[pt,Dt]of[[-11,-.7],[11,.7]]){let ft=x("sawtooth",Ae,U,Ce,pt+(Ze-1.5)*1.5);m(ft,Dt*(.6+Ze*.1)).connect(Ie)}}),Ie.connect(ae),y(ae,r,.35,0)},drone(N,U,W){let k=n.createGain(),ee=p("lowpass",500);k.gain.setValueAtTime(1e-4,U),k.gain.linearRampToValueAtTime(.06,U+.5),k.gain.setTargetAtTime(1e-4,U+W-.1,.15);for(let[le,ae]of[[.5,-6],[.5,6],[.75,0]])x("sawtooth",N*le,U,U+W+.6,ae).connect(ee);ee.connect(k),y(k,r,.4)},bass(N,U,W){let k=n.createGain(),ee=p("lowpass",200,4);ee.frequency.setValueAtTime(900,U),ee.frequency.setTargetAtTime(220,U+.005,.07),k.gain.setValueAtTime(1e-4,U),k.gain.linearRampToValueAtTime(.32,U+.006),k.gain.setTargetAtTime(1e-4,U+W*.85,.04),x("sawtooth",N,U,U+W+.3).connect(ee),ee.connect(k);let le=n.createGain();le.gain.value=.9,x("sine",N,U,U+W+.3).connect(le),le.connect(k),k.connect(r)},kick(N,U=1){let W=n.createGain(),k=x("sine",165,N,N+.45);k.frequency.exponentialRampToValueAtTime(48,N+.11),W.gain.setValueAtTime(1e-4,N),W.gain.linearRampToValueAtTime(U*.95,N+.003),W.gain.setTargetAtTime(1e-4,N+.06,.1),k.connect(W),W.connect(o),T.noise(N,U*.2,"highpass",3500,.7,.012,o),r.gain.setValueAtTime(.25,N),r.gain.setTargetAtTime(1,N+.02,.075)},noise(N,U,W,k,ee,le,ae,Ie=0,Ce=0){let Ae=n.createBufferSource(),Ze=p(W,k,ee),pt=n.createGain();Ae.buffer=d,g(pt,N,.001,U,le),Ae.connect(Ze),Ze.connect(pt),y(pt,ae,Ie),Ae.start(N,Ce||Math.random()*.5),Ae.stop(N+le*1.5+.1)},clap(N,U=1){for(let W of[0,.011,.023])T.noise(N+W,U*.28,"bandpass",1400,1.1,.025,o);T.noise(N+.03,U*.3,"bandpass",1300,.9,.16,o,.35)},snare(N,U){T.noise(N,U*.32,"bandpass",1900,.8,.12,o,.25);let W=n.createGain(),k=x("triangle",210,N,N+.1);g(W,N,.001,U*.18,.06),k.connect(W),W.connect(o)},tom(N,U,W,k,ee){let le=n.createGain(),ae=x("sine",W,N,N+ee+.1);ae.frequency.exponentialRampToValueAtTime(k,N+ee),g(le,N,.002,U,ee),ae.connect(le),y(le,o,.15)},riser(N,U){let W=n.createBufferSource(),k=p("bandpass",300,3),ee=n.createGain();W.buffer=d,W.loop=!0,k.frequency.setValueAtTime(300,N),k.frequency.exponentialRampToValueAtTime(9e3,N+U),ee.gain.setValueAtTime(1e-4,N),ee.gain.linearRampToValueAtTime(.16,N+U),ee.gain.setValueAtTime(1e-4,N+U+.01),W.connect(k),k.connect(ee),y(ee,o,.5),W.start(N),W.stop(N+U+.05)},impact(N){T.noise(N,.22,"highpass",5e3,.5,1.6,o,.6);let U=n.createGain(),W=x("sine",70,N,N+1.2);W.frequency.exponentialRampToValueAtTime(32,N+.9),g(U,N,.005,.5,.9),W.connect(U),U.connect(o)}},M={kick:N=>T.kick(N),clap:N=>T.clap(N),hat:(N,U)=>T.noise(N,U%4===2?.09:.055,"highpass",8e3,.8,.035,o),ohat:N=>T.noise(N,.085,"highpass",7500,.8,.2,o,.1),shaker:(N,U)=>T.noise(N,U%2?.03:.05,"bandpass",7e3,1.2,.045,o),dum:N=>T.tom(N,.6,140,70,.32),tek:N=>{T.noise(N,.2,"bandpass",3400,2,.05,o,.15),T.tom(N,.1,520,430,.05)},tik:N=>T.noise(N,.06,"bandpass",5200,3,.03,o)},_=(N,U,W=0)=>{let k=N.scale.length,ee=Math.floor(U/k);return N.root+N.scale[(U%k+k)%k]+12*(ee+W)},b=(N,U)=>[U,U+2,U+4,U+6].map(W=>{let k=_(N,W);for(;k<57;)k+=12;for(;k>=69;)k-=12;return qh(k)}).sort((W,k)=>W-k),R=N=>[N,N+2,N+4];function I(N){let U=wE(N.seed*101),W=(ae,Ie)=>{let Ce=ae,Ae=99;for(let Ze of R(Ie))for(let pt of[-7,0,7,14]){let Dt=Ze+pt;Math.abs(Dt-ae)<Ae&&(Ae=Math.abs(Dt-ae),Ce=Dt)}return Ce},k=[],ee=9;for(let[ae,Ie]of N.motif){let Ce=U();ee+=Ce<.35?-1:Ce<.7?1:Ce<.85?U()<.5?-2:2:0,ee=Math.max(5,Math.min(14,ee)),k.push([ae,Ie,ee])}let le=(ae,Ie)=>k.map(([Ce,Ae,Ze],pt)=>{let Dt=ae+(Ce>>4),ft=N.prog[Dt%4],Ln=Ce%8===0||Ae>=4?W(Ze,ft):Ze;return pt===k.length-1&&Ie!=null&&(Ln=W(Ie,ft)),[Dt*16+Ce%16,Ae,Ln]});return[...le(0),...le(2,11),...le(4),...le(6,7)]}let A=null,L=null,B=0,P=0,H=!1,K=0,$=0,X=0;function G(N,U){let W=N>>4,k=N&15,ee=60/A.bpm/4,le=ee*16,ae=A.prog[W%4],Ie=U+(k%2?A.swing*ee*2:0),Ce=K>.85,Ae=Ce&&W>=8,Ze=Ce&&W===7&&k>=12,pt=W%8,Dt=Ce?Ae?A.cut[1]:A.cut[0]+(A.cut[1]*.6-A.cut[0])*pt/7:A.cut[0],ft=b(A,ae);if(Ae&&A.stabs?A.stabs.includes(k)&&T.chord(ft,Ie,ee*2.2,Dt,.055):k===0&&T.chord(ft,Ie,le,Dt,Ce?.05:.06),A.drone&&k===0&&T.drone(qh(_(A,0,-1)),Ie,le),k%A.arpRate===0&&!Ze){let Ct=[...ft,ft[0]*2],ln=[0,1,2,3,4,3,2,1][k/A.arpRate%8];T[A.arp](Ct[ln]*(Ae?2:1),Ie,Ce?Ae?.8:.9:.6,k%4<2?-.35:.35)}if(Ce&&!Ze)for(let[Ct,ln,Dn]of A.bass)Ct===k&&T.bass(qh(_(A,ae,-2)+ln),Ie,Dn*ee);if(Ae){for(let[Ct,ln,Dn]of L)if(Ct===pt*16+k){let Nn=qh(_(A,Dn,0));T[A.lead](Nn,Ie,1,ln*ee,ee),X%2&&T[A.lead](Nn*2,Ie,.45,ln*ee,ee),S=Nn}}let Ln=Ae?A.drums:A.verse;if(!Ze)for(let Ct in Ln)Ln[Ct].includes(k)&&(Ce||Ct==="shaker"||Ct==="tik"||Ct==="hat")&&M[Ct](Ie,k);Ce&&(W===6&&k===0&&T.riser(Ie,le*2),W===7&&k%(k<8?2:1)===0&&T.snare(Ie,.35+.65*k/15),W===8&&k===0&&T.impact(Ie),W===15&&k>=12&&T.snare(Ie,.5+k*.03))}function J(){if(!A||!H)return;let N=n.currentTime+.15,U=60/A.bpm/4;for(P<n.currentTime-.2&&(P=n.currentTime+.05);P<N;)G(B,P),P+=U,B=(B+1)%256,B||X++}function se(N){let U=w_[N]||w_.beach;U!==A&&(A=U,L=I(A),B=0,X=0,S=0,P=n.currentTime+.1,l.delayTime.value=180/A.bpm/4)}function ye(N){H=!!N,H&&!$&&($=setInterval(J,25)),!H&&$&&(clearInterval($),$=0),t.gain.setTargetAtTime(H?K*.5:0,n.currentTime,.2),H&&(P=n.currentTime+.1)}function Le(N){Math.abs(N-K)<.01||(K=N,t.gain.setTargetAtTime(H?K*.5:0,n.currentTime,.4))}function j(N,U,W=1){A=null,se(N),K=W,t.gain.value=W*.5;let k=.05,ee=60/A.bpm/4;for(let le=0;k<U;le++,k+=ee)G(B,k),B=(B+1)%256,B||X++}return{setTheme:se,setOn:ye,setLevel:Le,prerender:j}}function A_(n){let e=new Map,t=new Map,i=n.clone();return R_(n,i,function(s,r){e.set(r,s),t.set(s,r)}),i.traverse(function(s){if(!s.isSkinnedMesh)return;let r=s,o=e.get(s),a=o.skeleton.bones;r.skeleton=o.skeleton.clone(),r.bindMatrix.copy(o.bindMatrix),r.skeleton.bones=a.map(function(c){return t.get(c)}),r.bind(r.skeleton,r.bindMatrix)}),i}function R_(n,e,t){t(n,e);for(let i=0;i<n.children.length;i++)R_(n.children[i],e.children[i],t)}var Yh=class extends Si{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Tm(t)}),this.register(function(t){return new Em(t)}),this.register(function(t){return new wm(t)}),this.register(function(t){return new Um(t)}),this.register(function(t){return new Om(t)}),this.register(function(t){return new Fm(t)}),this.register(function(t){return new Rm(t)}),this.register(function(t){return new Cm(t)}),this.register(function(t){return new Pm(t)}),this.register(function(t){return new Im(t)}),this.register(function(t){return new bm(t)}),this.register(function(t){return new Lm(t)}),this.register(function(t){return new Am(t)}),this.register(function(t){return new Nm(t)}),this.register(function(t){return new Dm(t)}),this.register(function(t){return new Sm(t)}),this.register(function(t){return new $h(t,ct.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new $h(t,ct.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new Bm(t)})}load(e,t,i,s){let r=this,o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){let l=fi.extractUrlBase(e);o=fi.resolveURL(l,this.path)}else o=fi.extractUrlBase(e);this.manager.itemStart(e);let a=function(l){s?s(l):console.error(l),r.manager.itemError(e),r.manager.itemEnd(e)},c=new ws(this.manager);c.setPriority(this.priority),c.setCache(this.cache),c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(l){try{r.parse(l,o,function(u){t(u),r.manager.itemEnd(e)},a)}catch(u){a(u)}},i,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,i,s){let r,o={},a={},c=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(c.decode(new Uint8Array(e,0,4))===D_){try{o[ct.KHR_BINARY_GLTF]=new km(e)}catch(h){s&&s(h);return}r=JSON.parse(o[ct.KHR_BINARY_GLTF].content)}else r=JSON.parse(c.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let l=new qm(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,priority:this.priority,cache:this.cache,withCredentials:this.withCredentials,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){let h=this.pluginCallbacks[u](l);h.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[h.name]=h,o[h.name]=!0}if(r.extensionsUsed)for(let u=0;u<r.extensionsUsed.length;++u){let h=r.extensionsUsed[u],f=r.extensionsRequired||[];switch(h){case ct.KHR_MATERIALS_UNLIT:o[h]=new Mm;break;case ct.KHR_DRACO_MESH_COMPRESSION:o[h]=new zm(r,this.dracoLoader);break;case ct.KHR_TEXTURE_TRANSFORM:o[h]=new Hm;break;case ct.KHR_MESH_QUANTIZATION:o[h]=new Gm;break;default:f.indexOf(h)>=0&&a[h]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+h+'".')}}l.setExtensions(o),l.setPlugins(a),l.parse(i,s)}parseAsync(e,t){let i=this;return new Promise(function(s,r){i.parse(e,t,s,r)})}};function PE(){let n={};return{get:function(e){return n[e]},add:function(e,t){n[e]=t},remove:function(e){delete n[e]},removeAll:function(){n={}}}}function $t(n,e,t){let i=n.json.materials[e];return i.extensions&&i.extensions[t]?i.extensions[t]:null}var ct={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DIFFUSE_ROUGHNESS:"KHR_materials_diffuse_roughness",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},Sm=class{constructor(e){this.parser=e,this.name=ct.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let i=0,s=t.length;i<s;i++){let r=t[i];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,i="light:"+e,s=t.cache.get(i);if(s)return s;let r=t.json,c=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e],l,u=new oe(16777215);c.color!==void 0&&u.setRGB(c.color[0],c.color[1],c.color[2],Cn);let h=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new kr(u),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new cc(u),l.distance=h;break;case"spot":l=new Br(u),l.distance=h,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),rs(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=t.createUniqueName(c.name||"light_"+e),s=Promise.resolve(l),t.cache.add(i,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,i=this.parser,r=i.json.nodes[e],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(c){return i._getNodeRef(t.cache,a,c)})}},Mm=class{constructor(){this.name=ct.KHR_MATERIALS_UNLIT}getMaterialType(){return Sn}extendParams(e,t,i){let s=[];e.color=new oe(1,1,1),e.opacity=1;let r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let o=r.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],Cn),e.opacity=o[3]}r.baseColorTexture!==void 0&&s.push(i.assignTexture(e,"map",r.baseColorTexture,Lt))}return Promise.all(s)}},bm=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let i=$t(this.parser,e,this.name);return i===null||i.emissiveStrength!==void 0&&(t.emissiveIntensity=i.emissiveStrength),Promise.resolve()}},Tm=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return $t(this.parser,e,this.name)!==null?Mn:null}extendMaterialParams(e,t){let i=$t(this.parser,e,this.name);if(i===null)return Promise.resolve();let s=[];if(i.clearcoatFactor!==void 0&&(t.clearcoat=i.clearcoatFactor),i.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",i.clearcoatTexture)),i.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=i.clearcoatRoughnessFactor),i.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",i.clearcoatRoughnessTexture)),i.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",i.clearcoatNormalTexture)),i.clearcoatNormalTexture.scale!==void 0)){let r=i.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Ee(r,r)}return Promise.all(s)}},Em=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_DIFFUSE_ROUGHNESS}getMaterialType(e){return $t(this.parser,e,this.name)!==null?Mn:null}extendMaterialParams(e,t){let i=$t(this.parser,e,this.name);if(i===null)return Promise.resolve();let s=[];return t.diffuseRoughness=i.diffuseRoughnessFactor!==void 0?i.diffuseRoughnessFactor:0,i.diffuseRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"diffuseRoughnessMap",i.diffuseRoughnessTexture)),Promise.all(s)}},wm=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_DISPERSION}getMaterialType(e){return $t(this.parser,e,this.name)!==null?Mn:null}extendMaterialParams(e,t){let i=$t(this.parser,e,this.name);return i===null||(t.dispersion=i.dispersion!==void 0?i.dispersion:0),Promise.resolve()}},Am=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return $t(this.parser,e,this.name)!==null?Mn:null}extendMaterialParams(e,t){let i=$t(this.parser,e,this.name);if(i===null)return Promise.resolve();let s=[];return i.iridescenceFactor!==void 0&&(t.iridescence=i.iridescenceFactor),i.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",i.iridescenceTexture)),i.iridescenceIor!==void 0&&(t.iridescenceIOR=i.iridescenceIor),i.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessMinimum=i.iridescenceThicknessMinimum),i.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessMaximum=i.iridescenceThicknessMaximum),i.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",i.iridescenceThicknessTexture)),Promise.all(s)}},Rm=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_SHEEN}getMaterialType(e){return $t(this.parser,e,this.name)!==null?Mn:null}extendMaterialParams(e,t){let i=$t(this.parser,e,this.name);if(i===null)return Promise.resolve();let s=[];if(t.sheenColor=new oe(0,0,0),t.sheenRoughness=0,t.sheen=1,i.sheenColorFactor!==void 0){let r=i.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],Cn)}return i.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=i.sheenRoughnessFactor),i.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",i.sheenColorTexture,Lt)),i.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",i.sheenRoughnessTexture)),Promise.all(s)}},Cm=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return $t(this.parser,e,this.name)!==null?Mn:null}extendMaterialParams(e,t){let i=$t(this.parser,e,this.name);if(i===null)return Promise.resolve();let s=[];return i.transmissionFactor!==void 0&&(t.transmission=i.transmissionFactor),i.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",i.transmissionTexture)),Promise.all(s)}},Pm=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_VOLUME}getMaterialType(e){return $t(this.parser,e,this.name)!==null?Mn:null}extendMaterialParams(e,t){let i=$t(this.parser,e,this.name);if(i===null)return Promise.resolve();let s=[];t.thickness=i.thicknessFactor!==void 0?i.thicknessFactor:0,i.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",i.thicknessTexture)),t.attenuationDistance=i.attenuationDistance||1/0;let r=i.attenuationColor||[1,1,1];return t.attenuationColor=new oe().setRGB(r[0],r[1],r[2],Cn),Promise.all(s)}},Im=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_IOR}getMaterialType(e){return $t(this.parser,e,this.name)!==null?Mn:null}extendMaterialParams(e,t){let i=$t(this.parser,e,this.name);return i===null||(t.ior=i.ior!==void 0?i.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},Lm=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_SPECULAR}getMaterialType(e){return $t(this.parser,e,this.name)!==null?Mn:null}extendMaterialParams(e,t){let i=$t(this.parser,e,this.name);if(i===null)return Promise.resolve();let s=[];t.specularIntensity=i.specularFactor!==void 0?i.specularFactor:1,i.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",i.specularTexture));let r=i.specularColorFactor||[1,1,1];return t.specularColor=new oe().setRGB(r[0],r[1],r[2],Cn),i.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",i.specularColorTexture,Lt)),Promise.all(s)}},Dm=class{constructor(e){this.parser=e,this.name=ct.EXT_MATERIALS_BUMP}getMaterialType(e){return $t(this.parser,e,this.name)!==null?Mn:null}extendMaterialParams(e,t){let i=$t(this.parser,e,this.name);if(i===null)return Promise.resolve();let s=[];return t.bumpScale=i.bumpFactor!==void 0?i.bumpFactor:1,i.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",i.bumpTexture)),Promise.all(s)}},Nm=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return $t(this.parser,e,this.name)!==null?Mn:null}extendMaterialParams(e,t){let i=$t(this.parser,e,this.name);if(i===null)return Promise.resolve();let s=[];return i.anisotropyStrength!==void 0&&(t.anisotropy=i.anisotropyStrength),i.anisotropyRotation!==void 0&&(t.anisotropyRotation=i.anisotropyRotation),i.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",i.anisotropyTexture)),Promise.all(s)}},Um=class{constructor(e){this.parser=e,this.name=ct.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,i=t.json,s=i.textures[e];if(!s.extensions||!s.extensions[this.name])return null;let r=s.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(i.extensionsRequired&&i.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,o)}},Om=class{constructor(e){this.parser=e,this.name=ct.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,i=this.parser,s=i.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=s.images[o.source],c=i.textureLoader;if(a.uri){let l=i.options.manager.getHandler(a.uri);l!==null&&(c=l)}return i.loadTextureImage(e,o.source,c)}},Fm=class{constructor(e){this.parser=e,this.name=ct.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,i=this.parser,s=i.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=s.images[o.source],c=i.textureLoader;if(a.uri){let l=i.options.manager.getHandler(a.uri);l!==null&&(c=l)}return i.loadTextureImage(e,o.source,c)}},$h=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,i=t.bufferViews[e];if(i.extensions&&i.extensions[this.name]){let s=i.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){let c=s.byteOffset||0,l=s.byteLength||0,u=s.count,h=s.byteStride,f=new Uint8Array(a,c,l);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(u,h,f,s.mode,s.filter).then(function(d){return d.buffer}):o.ready.then(function(){let d=new ArrayBuffer(u*h);return o.decodeGltfBuffer(new Uint8Array(d),u,h,f,s.mode,s.filter),d})})}else return null}},Bm=class{constructor(e){this.name=ct.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,i=t.nodes[e];if(!i.extensions||!i.extensions[this.name]||i.mesh===void 0)return null;let s=t.meshes[i.mesh];for(let l of s.primitives)if(l.mode!==Ti.TRIANGLES&&l.mode!==Ti.TRIANGLE_STRIP&&l.mode!==Ti.TRIANGLE_FAN&&l.mode!==void 0)return null;let o=i.extensions[this.name].attributes,a=[],c={};for(let l in o)a.push(this.parser.getDependency("accessor",o[l]).then(u=>(c[l]=u,c[l])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(l=>{let u=l.pop(),h=u.isGroup?u.children:[u],f=l[0].count,d=[];for(let g of h){let x=new Ve,p=new D,m=new fn,y=new D(1,1,1),v=new Ji(g.geometry,g.material,f);for(let T=0;T<f;T++)c.TRANSLATION&&p.fromBufferAttribute(c.TRANSLATION,T),c.ROTATION&&m.fromBufferAttribute(c.ROTATION,T),c.SCALE&&y.fromBufferAttribute(c.SCALE,T),v.setMatrixAt(T,x.compose(p,m,y));let S=null;for(let T in c)if(T==="_COLOR_0"){let M=c[T];v.instanceColor=new vs(M.array,M.itemSize,M.normalized)}else if(T!=="TRANSLATION"&&T!=="ROTATION"&&T!=="SCALE"){if(S===null){let _=v.geometry;S=new mt,S.name=_.name;for(let b in _.attributes)S.setAttribute(b,_.attributes[b]);for(let b in _.morphAttributes)S.morphAttributes[b]=_.morphAttributes[b];_.index!==null&&S.setIndex(_.index),S.morphTargetsRelative=_.morphTargetsRelative;for(let b of _.groups)S.addGroup(b.start,b.count,b.materialIndex);_.boundingBox!==null&&(S.boundingBox=_.boundingBox.clone()),_.boundingSphere!==null&&(S.boundingSphere=_.boundingSphere.clone()),S.drawRange.start=_.drawRange.start,S.drawRange.count=_.drawRange.count,S.userData=Object.assign({},_.userData),v.geometry=S}let M=c[T];S.setAttribute(T,new vs(M.array,M.itemSize,M.normalized))}kt.prototype.copy.call(v,g),this.parser.assignFinalMaterial(v),d.push(v)}return u.isGroup?(u.clear(),u.add(...d),u):d[0]}))}},D_="glTF",Gc=12,C_={JSON:1313821514,BIN:5130562},km=class{constructor(e){this.name=ct.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Gc),i=new TextDecoder;if(this.header={magic:i.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==D_)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let s=this.header.length-Gc,r=new DataView(e,Gc),o=0;for(;o<s;){let a=r.getUint32(o,!0);o+=4;let c=r.getUint32(o,!0);if(o+=4,c===C_.JSON){let l=new Uint8Array(e,Gc+o,a);this.content=i.decode(l)}else if(c===C_.BIN){let l=Gc+o;this.body=e.slice(l,l+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},zm=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=ct.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let i=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},c={},l={};for(let u in o){let h=Wm[u]||u.toLowerCase();a[h]=o[u]}for(let u in e.attributes){let h=Wm[u]||u.toLowerCase();if(o[u]!==void 0){let f=i.accessors[e.attributes[u]],d=da[f.componentType];l[h]=d.name,c[h]=f.normalized===!0}}return t.getDependency("bufferView",r).then(function(u){return new Promise(function(h,f){s.decodeDracoFile(u,function(d){for(let g in d.attributes){let x=d.attributes[g],p=c[g];p!==void 0&&(x.normalized=p)}h(d)},a,l,Cn,f)})})}},Hm=class{constructor(){this.name=ct.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let i=Math.cos(e.rotation),s=Math.sin(e.rotation);e.matrix.set(e.repeat.x*i,e.repeat.y*s,e.offset.x,-e.repeat.x*s,e.repeat.y*i,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},Gm=class{constructor(){this.name=ct.KHR_MESH_QUANTIZATION}},Kh=class extends ji{constructor(e,t,i,s){super(e,t,i,s)}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let o=0;o!==s;o++)t[o]=i[r+o];return t}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=a*2,l=a*3,u=s-t,h=(i-t)/u,f=h*h,d=f*h,g=e*l,x=g-l,p=-2*d+3*f,m=d-f,y=1-p,v=m-f+h;for(let S=0;S!==a;S++){let T=o[x+S+a],M=o[x+S+c]*u,_=o[g+S+a],b=o[g+S]*u;r[S]=y*T+v*M+p*_+m*b}return r}},IE=new fn,Vm=class extends Kh{interpolate_(e,t,i,s){let r=super.interpolate_(e,t,i,s);return IE.fromArray(r).normalize().toArray(r),r}},Ti={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},da={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},P_={9728:en,9729:hn,9984:Lu,9985:ea,9986:Wr,9987:Mi},I_={33071:kn,33648:No,10497:ei},_m={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Wm={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},rr={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},LE={CUBICSPLINE:void 0,LINEAR:Cr,STEP:Rr},ym={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function DE(n){return n.DefaultMaterial===void 0&&(n.DefaultMaterial=new Rt({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Qi})),n.DefaultMaterial}function Jr(n,e,t){for(let i in t.extensions)n[i]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[i]=t.extensions[i])}function rs(n,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(n.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function NE(n,e,t){let i=!1,s=!1,r=!1;for(let l=0,u=e.length;l<u;l++){let h=e[l];if(h.POSITION!==void 0&&(i=!0),h.NORMAL!==void 0&&(s=!0),h.COLOR_0!==void 0&&(r=!0),i&&s&&r)break}if(!i&&!s&&!r)return Promise.resolve(n);let o=[],a=[],c=[];for(let l=0,u=e.length;l<u;l++){let h=e[l];if(i){let f=h.POSITION!==void 0?t.getDependency("accessor",h.POSITION):n.attributes.position;o.push(f)}if(s){let f=h.NORMAL!==void 0?t.getDependency("accessor",h.NORMAL):n.attributes.normal;a.push(f)}if(r){let f=h.COLOR_0!==void 0?t.getDependency("accessor",h.COLOR_0):n.attributes.color;c.push(f)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c)]).then(function(l){let u=l[0],h=l[1],f=l[2];return i&&(n.morphAttributes.position=u),s&&(n.morphAttributes.normal=h),r&&(n.morphAttributes.color=f),n.morphTargetsRelative=!0,n})}function UE(n,e){if(n.updateMorphTargets(),e.weights!==void 0)for(let t=0,i=e.weights.length;t<i;t++)n.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(n.morphTargetInfluences.length===t.length){n.morphTargetDictionary={};for(let i=0,s=t.length;i<s;i++)n.morphTargetDictionary[t[i]]=i}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function OE(n){let e,t=n.extensions&&n.extensions[ct.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+vm(t.attributes):e=n.indices+":"+vm(n.attributes)+":"+n.mode,n.targets!==void 0)for(let i=0,s=n.targets.length;i<s;i++)e+=":"+vm(n.targets[i]);return e}function vm(n){let e="",t=Object.keys(n).sort();for(let i=0,s=t.length;i<s;i++)e+=t[i]+":"+n[t[i]]+";";return e}function Xm(n){switch(n){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function FE(n){return n.search(/\.jpe?g($|\?)/i)>0||n.search(/^data\:image\/jpeg/)===0?"image/jpeg":n.search(/\.webp($|\?)/i)>0||n.search(/^data\:image\/webp/)===0?"image/webp":n.search(/\.ktx2($|\?)/i)>0||n.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var BE=new Ve,qm=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new PE,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let i=!1,s=-1,r=!1,o=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let a=navigator.userAgent;i=/^((?!chrome|android).)*safari/i.test(a)===!0;let c=a.match(/Version\/(\d+)/);s=i&&c?parseInt(c[1],10):-1,r=a.indexOf("Firefox")>-1,o=r?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||i&&s<17||r&&o<98?(this.textureLoader=new Or(this.options.manager),this.textureLoader.setPriority(this.options.priority),this.textureLoader.setCache(this.options.cache)):(this.textureLoader=new lc(this.options.manager),this.textureLoader.setPriority(this.options.priority),this.textureLoader.setCache(this.options.cache)),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setWithCredentials(this.options.withCredentials),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new ws(this.options.manager),this.fileLoader.setPriority(this.options.priority),this.fileLoader.setCache(this.options.cache),this.fileLoader.setResponseType("arraybuffer"),(this.options.withCredentials||this.options.crossOrigin==="use-credentials")&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let i=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([i.getDependencies("scene"),i.getDependencies("animation"),i.getDependencies("camera")])}).then(function(o){let a={scene:o[0][s.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:s.asset,parser:i,userData:{}};return Jr(r,a,s),rs(a,s),Promise.all(i._invokeAll(function(c){return c.afterRoot&&c.afterRoot(a)})).then(function(){for(let c of a.scenes)c.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],i=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){let o=t[s].joints;for(let a=0,c=o.length;a<c;a++)e[o[a]].isBone=!0}for(let s=0,r=e.length;s<r;s++){let o=e[s];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(i[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,i){if(e.refs[t]<=1)return i;let s=i.clone(),r=(o,a)=>{let c=this.associations.get(o);c!=null&&this.associations.set(a,c);for(let[l,u]of o.children.entries())r(u,a.children[l])};return r(i,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let i=0;i<t.length;i++){let s=e(t[i]);if(s)return s}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let i=[];for(let s=0;s<t.length;s++){let r=e(t[s]);r&&i.push(r)}return i}getDependency(e,t){let i=e+":"+t,s=this.cache.get(i);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(i,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){let i=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,o){return i.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],i=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[ct.KHR_BINARY_GLTF].body);let s=this.options;return new Promise(function(r,o){i.load(fi.resolveURL(t.uri,s.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(i){let s=t.byteLength||0,r=t.byteOffset||0;return i.slice(r,r+s)})}loadAccessor(e){let t=this,i=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){let o=_m[s.type],a=da[s.componentType],c=s.normalized===!0,l=new a(s.count*o);return Promise.resolve(new $e(l,o,c))}let r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(o){let a=o[0],c=_m[s.type],l=da[s.componentType],u=l.BYTES_PER_ELEMENT,h=u*c,f=s.byteOffset||0,d=s.bufferView!==void 0?i.bufferViews[s.bufferView].byteStride:void 0,g=s.normalized===!0,x,p;if(d&&d!==h){let m=Math.floor(f/d),y="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+m+":"+s.count,v=t.cache.get(y);v||(x=new l(a,m*d,s.count*d/u),v=new Ks(x,d/u),t.cache.add(y,v)),p=new Zs(v,c,f%d/u,g)}else a===null?x=new l(s.count*c):x=new l(a,f,s.count*c),p=new $e(x,c,g);if(s.sparse!==void 0){let m=_m.SCALAR,y=da[s.sparse.indices.componentType],v=s.sparse.indices.byteOffset||0,S=s.sparse.values.byteOffset||0,T=new y(o[1],v,s.sparse.count*m),M=new l(o[2],S,s.sparse.count*c);a!==null&&(p=new $e(p.array.slice(),p.itemSize,p.normalized)),p.normalized=!1;for(let _=0,b=T.length;_<b;_++){let R=T[_];if(p.setX(R,M[_*c]),c>=2&&p.setY(R,M[_*c+1]),c>=3&&p.setZ(R,M[_*c+2]),c>=4&&p.setW(R,M[_*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}p.normalized=g}return p})}loadTexture(e){let t=this.json,i=this.options,r=t.textures[e].source,o=t.images[r],a=this.textureLoader;if(o.uri){let c=i.manager.getHandler(o.uri);c!==null&&(a=c)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,i){let s=this,r=this.json,o=r.textures[e],a=r.images[t],c=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[c])return this.textureCache[c];let l=this.loadImageSource(t,i).then(function(u){u.flipY=!1,u.name=o.name||a.name||"",u.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(u.name=a.uri);let f=(r.samplers||{})[o.sampler]||{};return u.magFilter=P_[f.magFilter]||hn,u.minFilter=P_[f.minFilter]||Mi,u.wrapS=I_[f.wrapS]||ei,u.wrapT=I_[f.wrapT]||ei,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==en&&u.minFilter!==hn,s.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(e,t){let i=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(f=>f.clone());let o=s.images[e],a=self.URL||self.webkitURL,c=o.uri||"",l=!1,u;if(t.isKTX2Loader===!0&&o.bufferView!==void 0)u=i.getDependency("bufferView",o.bufferView).then(function(f){return new Promise(function(d,g){t.parse(f,d,g)})});else{if(o.bufferView!==void 0)c=i.getDependency("bufferView",o.bufferView).then(function(f){l=!0;let d=new Blob([f],{type:o.mimeType});return c=a.createObjectURL(d),c});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");u=Promise.resolve(c).then(function(f){return new Promise(function(d,g){let x=d;t.isImageBitmapLoader===!0&&(x=function(p){let m=new dn(p);m.needsUpdate=!0,d(m)}),t.load(fi.resolveURL(f,r.path),x,void 0,g)})})}let h=u.then(function(f){return l===!0&&a.revokeObjectURL(c),rs(f,o),f.userData.mimeType=o.mimeType||FE(o.uri),f}).catch(function(f){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),f});return this.sourceCache[e]=h,h}assignTexture(e,t,i,s){let r=this;return this.getDependency("texture",i.index).then(function(o){if(!o)return null;if(i.texCoord!==void 0&&i.texCoord>0&&(o=o.clone(),o.channel=i.texCoord),r.extensions[ct.KHR_TEXTURE_TRANSFORM]){let a=i.extensions!==void 0?i.extensions[ct.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let c=r.associations.get(o);o=r.extensions[ct.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,c)}}return s!==void 0&&(o.colorSpace=s),e[t]=o,o})}assignFinalMaterial(e){let t=e.geometry,i=e.material,s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){let a="PointsMaterial:"+i.uuid,c=this.cache.get(a);c||(c=new js,ni.prototype.copy.call(c,i),c.color.copy(i.color),c.map=i.map,c.sizeAttenuation=!1,this.cache.add(a,c)),i=c}else if(e.isLine){let a="LineBasicMaterial:"+i.uuid,c=this.cache.get(a);c||(c=new Vo,ni.prototype.copy.call(c,i),c.color.copy(i.color),c.map=i.map,this.cache.add(a,c)),i=c}if(s||r||o){let a="ClonedMaterial:"+i.uuid+":";s&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let c=this.cache.get(a);c||(c=i.clone(),r&&(c.vertexColors=!0),o&&(c.flatShading=!0),s&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(a,c),this.associations.set(c,this.associations.get(i))),i=c}e.material=i}getMaterialType(){return Rt}loadMaterial(e){let t=this,i=this.json,s=this.extensions,r=i.materials[e],o,a={},c=r.extensions||{},l=[];if(c[ct.KHR_MATERIALS_UNLIT]){let h=s[ct.KHR_MATERIALS_UNLIT];o=h.getMaterialType(),l.push(h.extendParams(a,r,t))}else{let h=r.pbrMetallicRoughness||{};if(a.color=new oe(1,1,1),a.opacity=1,Array.isArray(h.baseColorFactor)){let f=h.baseColorFactor;a.color.setRGB(f[0],f[1],f[2],Cn),a.opacity=f[3]}h.baseColorTexture!==void 0&&l.push(t.assignTexture(a,"map",h.baseColorTexture,Lt)),a.metalness=h.metallicFactor!==void 0?h.metallicFactor:1,a.roughness=h.roughnessFactor!==void 0?h.roughnessFactor:1,h.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(a,"metalnessMap",h.metallicRoughnessTexture)),l.push(t.assignTexture(a,"roughnessMap",h.metallicRoughnessTexture))),o=this._invokeOne(function(f){return f.getMaterialType&&f.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(f){return f.extendMaterialParams&&f.extendMaterialParams(e,a)})))}r.doubleSided===!0&&(a.side=bn);let u=r.alphaMode||ym.OPAQUE;if(u===ym.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,u===ym.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==Sn&&(l.push(t.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new Ee(1,1),r.normalTexture.scale!==void 0)){let h=r.normalTexture.scale;a.normalScale.set(h,h)}if(r.occlusionTexture!==void 0&&o!==Sn&&(l.push(t.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==Sn){let h=r.emissiveFactor;a.emissive=new oe().setRGB(h[0],h[1],h[2],Cn)}return r.emissiveTexture!==void 0&&o!==Sn&&l.push(t.assignTexture(a,"emissiveMap",r.emissiveTexture,Lt)),Promise.all(l).then(function(){let h=new o(a);return r.name&&(h.name=r.name),rs(h,r),t.associations.set(h,{materials:e}),r.extensions&&Jr(s,h,r),h})}createUniqueName(e){let t=Ot.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,i=this.extensions,s=this.primitiveCache;function r(a){return i[ct.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(c){return L_(c,a,t)})}let o=[];for(let a=0,c=e.length;a<c;a++){let l=e[a],u=OE(l),h=s[u];if(h)o.push(h.promise);else{let f;l.extensions&&l.extensions[ct.KHR_DRACO_MESH_COMPRESSION]?f=r(l):f=L_(new mt,l,t),l.mode===Ti.TRIANGLE_STRIP?f=f.then(d=>Sp(d,bc)):l.mode===Ti.TRIANGLE_FAN&&(f=f.then(d=>Sp(d,na))),s[u]={primitive:l,promise:f},o.push(f)}}return Promise.all(o)}loadMesh(e){let t=this,i=this.json,s=this.extensions,r=i.meshes[e],o=r.primitives,a=[];for(let c=0,l=o.length;c<l;c++){let u=o[c].material===void 0?DE(this.cache):this.getDependency("material",o[c].material);a.push(u)}return a.push(t.loadGeometries(o)),Promise.all(a).then(async function(c){let l=c.slice(0,c.length-1),u=c[c.length-1],h=[];for(let d=0,g=u.length;d<g;d++){let x=u[d],p=o[d],m,y=l[d];if(p.mode===Ti.TRIANGLES||p.mode===Ti.TRIANGLE_STRIP||p.mode===Ti.TRIANGLE_FAN||p.mode===void 0){let v=r.isSkinnedMesh===!0,S=x.hasAttribute("skinIndex")&&x.hasAttribute("skinWeight");v&&S===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),m=v&&S?new Ka(x,y):new We(x,y),m.isSkinnedMesh===!0&&m.normalizeSkinWeights()}else if(p.mode===Ti.LINES)m=new Dr(x,y);else if(p.mode===Ti.LINE_STRIP)m=new Lr(x,y);else if(p.mode===Ti.LINE_LOOP)m=new Ja(x,y);else if(p.mode===Ti.POINTS)m=new yi(x,y);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+p.mode);Object.keys(m.geometry.morphAttributes).length>0&&UE(m,r),m.name=t.createUniqueName(r.name||"mesh_"+e),rs(m,r),p.extensions&&Jr(s,m,p),t.assignFinalMaterial(m),h.push(m)}for(let d=0,g=h.length;d<g;d++)t.associations.set(h[d],{meshes:e,primitives:d});if(h.length===1)return r.extensions&&Jr(s,h[0],r),h[0];let f=new Zt;r.extensions&&Jr(s,f,r),t.associations.set(f,{meshes:e});for(let d=0,g=h.length;d<g;d++)f.add(h[d]);return f})}loadCamera(e){let t,i=this.json.cameras[e],s=i[i.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return i.type==="perspective"?t=new Qt(_h.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):i.type==="orthographic"&&(t=new As(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),i.name&&(t.name=this.createUniqueName(i.name)),rs(t,i),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],i=[];for(let s=0,r=t.joints.length;s<r;s++)i.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?i.push(this.getDependency("accessor",t.inverseBindMatrices)):i.push(null),Promise.all(i).then(function(s){let r=s.pop(),o=s,a=[],c=[];for(let l=0,u=o.length;l<u;l++){let h=o[l];if(h){a.push(h);let f=new Ve;r!==null&&f.fromArray(r.array,l*16),c.push(f)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new Za(a,c)})}loadAnimation(e){let t=this.json,i=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,o=[],a=[],c=[],l=[],u=[];for(let h=0,f=s.channels.length;h<f;h++){let d=s.channels[h],g=s.samplers[d.sampler],x=d.target,p=x.node,m=s.parameters!==void 0?s.parameters[g.input]:g.input,y=s.parameters!==void 0?s.parameters[g.output]:g.output;x.node!==void 0&&(o.push(this.getDependency("node",p)),a.push(this.getDependency("accessor",m)),c.push(this.getDependency("accessor",y)),l.push(g),u.push(x))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c),Promise.all(l),Promise.all(u)]).then(function(h){let f=h[0],d=h[1],g=h[2],x=h[3],p=h[4],m=[];for(let v=0,S=f.length;v<S;v++){let T=f[v],M=d[v],_=g[v],b=x[v],R=p[v];if(T===void 0)continue;T.updateMatrix&&T.updateMatrix();let I=i._createAnimationTracks(T,M,_,b,R);if(I)for(let A=0;A<I.length;A++)m.push(I[A])}let y=new rc(r,void 0,m);return rs(y,s),y})}createNodeMesh(e){let t=this.json,i=this,s=t.nodes[e];return s.mesh===void 0?null:i.getDependency("mesh",s.mesh).then(function(r){let o=i._getNodeRef(i.meshCache,s.mesh,r);return s.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let c=0,l=s.weights.length;c<l;c++)a.morphTargetInfluences[c]=s.weights[c]}),o})}loadNode(e){let t=this.json,i=this,s=t.nodes[e],r=i._loadNodeShallow(e),o=[],a=s.children||[];for(let l=0,u=a.length;l<u;l++)o.push(i.getDependency("node",a[l]));let c=s.skin===void 0?Promise.resolve(null):i.getDependency("skin",s.skin);return Promise.all([r,Promise.all(o),c]).then(function(l){let u=l[0],h=l[1],f=l[2];f!==null&&u.traverse(function(d){d.isSkinnedMesh&&d.bind(f,BE)});for(let d=0,g=h.length;d<g;d++)u.add(h[d]);if(u.userData.pivot!==void 0&&h.length>0){let d=u.userData.pivot,g=h[0];u.pivot=new D().fromArray(d),u.position.x-=d[0],u.position.y-=d[1],u.position.z-=d[2],g.position.set(0,0,0),delete u.userData.pivot}return u})}_loadNodeShallow(e){let t=this.json,i=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let r=t.nodes[e],o=r.name?s.createUniqueName(r.name):"",a=[],c=s._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return c&&a.push(c),r.camera!==void 0&&a.push(s.getDependency("camera",r.camera).then(function(l){return s._getNodeRef(s.cameraCache,r.camera,l)})),s._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){a.push(l)}),this.nodeCache[e]=Promise.all(a).then(function(l){let u;if(r.isBone===!0?u=new Ho:l.length>1?u=new Zt:l.length===1?u=l[0]:u=new kt,u!==l[0])for(let h=0,f=l.length;h<f;h++)u.add(l[h]);if(r.name&&(u.userData.name=r.name,u.name=o),rs(u,r),r.extensions&&Jr(i,u,r),r.matrix!==void 0){let h=new Ve;h.fromArray(r.matrix),u.applyMatrix4(h)}else r.translation!==void 0&&u.position.fromArray(r.translation),r.rotation!==void 0&&u.quaternion.fromArray(r.rotation),r.scale!==void 0&&u.scale.fromArray(r.scale);if(!s.associations.has(u))s.associations.set(u,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){let h=s.associations.get(u);s.associations.set(u,{...h})}return s.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){let t=this.extensions,i=this.json.scenes[e],s=this,r=new Zt;i.name&&(r.name=s.createUniqueName(i.name)),rs(r,i),i.extensions&&Jr(t,r,i);let o=i.nodes||[],a=[];for(let c=0,l=o.length;c<l;c++)a.push(s.getDependency("node",o[c]));return Promise.all(a).then(function(c){for(let u=0,h=c.length;u<h;u++){let f=c[u];f.parent!==null?r.add(A_(f)):r.add(f)}let l=u=>{let h=new Map;for(let[f,d]of s.associations)(f instanceof ni||f instanceof dn)&&h.set(f,d);return u.traverse(f=>{let d=s.associations.get(f);d!=null&&h.set(f,d)}),h};return s.associations=l(r),r})}_createAnimationTracks(e,t,i,s,r){let o=[],a=e.name?e.name:e.uuid,c=[];function l(d){d.morphTargetInfluences&&c.push(d.name?d.name:d.uuid)}rr[r.path]===rr.weights?(l(e),e.isGroup&&e.children.forEach(l)):c.push(a);let u;switch(rr[r.path]){case rr.weights:u=bs;break;case rr.rotation:u=Ts;break;case rr.translation:case rr.scale:u=Qs;break;default:i.itemSize===1?u=bs:u=Qs;break}let h=s.interpolation!==void 0?LE[s.interpolation]:Cr,f=this._getArrayFromAccessor(i);for(let d=0,g=c.length;d<g;d++){let x=new u(c[d]+"."+rr[r.path],t.array,f,h);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(x),o.push(x)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let i=Xm(t.constructor),s=new Float32Array(t.length);for(let r=0,o=t.length;r<o;r++)s[r]=t[r]*i;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(i){let s=this instanceof Ts?Vm:Kh;return new s(this.times,this.values,this.getValueSize()/3,i)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function kE(n,e,t){let i=e.attributes,s=new hi;if(i.POSITION!==void 0){let a=t.json.accessors[i.POSITION],c=a.min,l=a.max;if(c!==void 0&&l!==void 0){if(s.set(new D(c[0],c[1],c[2]),new D(l[0],l[1],l[2])),a.normalized){let u=Xm(da[a.componentType]);s.min.multiplyScalar(u),s.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=e.targets;if(r!==void 0){let a=new D,c=new D;for(let l=0,u=r.length;l<u;l++){let h=r[l];if(h.POSITION!==void 0){let f=t.json.accessors[h.POSITION],d=f.min,g=f.max;if(d!==void 0&&g!==void 0){if(c.setX(Math.max(Math.abs(d[0]),Math.abs(g[0]))),c.setY(Math.max(Math.abs(d[1]),Math.abs(g[1]))),c.setZ(Math.max(Math.abs(d[2]),Math.abs(g[2]))),f.normalized){let x=Xm(da[f.componentType]);c.multiplyScalar(x)}a.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(a)}n.boundingBox=s;let o=new ti;s.getCenter(o.center),o.radius=s.min.distanceTo(s.max)/2,n.boundingSphere=o}function L_(n,e,t){let i=e.attributes,s=[];function r(o,a){return t.getDependency("accessor",o).then(function(c){n.setAttribute(a,c)})}for(let o in i){let a=Wm[o]||o.toLowerCase();a in n.attributes||s.push(r(i[o],a))}if(e.indices!==void 0&&!n.index){let o=t.getDependency("accessor",e.indices).then(function(a){n.setIndex(a)});s.push(o)}return et.workingColorSpace!==Cn&&"COLOR_0"in i&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${et.workingColorSpace}" not supported.`),rs(n,e),kE(n,e,t),Promise.all(s).then(function(){return e.targets!==void 0?NE(n,e.targets,t):n})}var Ym=new WeakMap,zE=new URL("../libs/draco/draco_decoder.wasm","https://localhost/assets/").toString(),HE=new URL("../libs/draco/draco_wasm_wrapper.js","https://localhost/assets/").toString(),GE=new URL("../libs/draco/draco_decoder.js","https://localhost/assets/").toString(),z2={js:new URL("../libs/draco/gltf/draco_wasm_wrapper.js","https://localhost/assets/").toString(),wasm:new URL("../libs/draco/gltf/draco_decoder.wasm","https://localhost/assets/").toString()},Zh=class extends Si{constructor(e){super(e),this.decoderPaths={js:HE,wasm:zE,dep_js:GE},this.decoderConfig={},this.decoderBinary=null,this.decoderPending=null,this.workerLimit=4,this.workerPool=[],this.workerNextTaskID=1,this.workerSourceURL="",this.defaultAttributeIDs={position:"POSITION",normal:"NORMAL",color:"COLOR",uv:"TEX_COORD"},this.defaultAttributeTypes={position:"Float32Array",normal:"Float32Array",color:"Float32Array",uv:"Float32Array"}}setDecoderPath(e){let{decoderPaths:t}=this;return typeof e=="object"?(t.js=e.js,t.wasm=e.wasm,t.dep_js=null):(t.js=fi.resolveURL("draco_wasm_wrapper.js",e),t.wasm=fi.resolveURL("draco_decoder.wasm",e),t.dep_js=fi.resolveURL("draco_decoder.js",e)),this}setDecoderConfig(e){return console.warn("THREE.DRACOLoader: setDecoderConfig to has been deprecated and will be removed in r194."),this.decoderConfig=e,this}setWorkerLimit(e){return this.workerLimit=e,this}load(e,t,i,s){let r=new ws(this.manager);r.setPriority(this.priority),r.setCache(this.cache),r.setPath(this.path),r.setResponseType("arraybuffer"),r.setRequestHeader(this.requestHeader),r.setWithCredentials(this.withCredentials),r.load(e,o=>{this.parse(o,t,s)},i,s)}parse(e,t,i=()=>{}){this.decodeDracoFile(e,t,null,null,Lt,i).catch(i)}decodeDracoFile(e,t,i,s,r=Cn,o=()=>{}){let a={attributeIDs:i||this.defaultAttributeIDs,attributeTypes:s||this.defaultAttributeTypes,useUniqueIDs:!!i,vertexColorSpace:r};return this.decodeGeometry(e,a).then(t).catch(o)}decodeGeometry(e,t){let i=JSON.stringify(t);if(Ym.has(e)){let c=Ym.get(e);if(c.key===i)return c.promise;if(e.byteLength===0)throw new Error("THREE.DRACOLoader: Unable to re-decode a buffer with different settings. Buffer has already been transferred.")}let s,r=this.workerNextTaskID++,o=e.byteLength,a=this._getWorker(r,o).then(c=>(s=c,new Promise((l,u)=>{s._callbacks[r]={resolve:l,reject:u},s.postMessage({type:"decode",id:r,taskConfig:t,buffer:e},[e])}))).then(c=>this._createGeometry(c.geometry));return a.catch(()=>!0).then(()=>{s&&r&&this._releaseTask(s,r)}),Ym.set(e,{key:i,promise:a}),a}_createGeometry(e){let t=new mt;e.index&&t.setIndex(new $e(e.index.array,1));for(let i=0;i<e.attributes.length;i++){let{name:s,array:r,itemSize:o,stride:a,vertexColorSpace:c}=e.attributes[i],l;if(o===a)l=new $e(r,o);else{let u=new Ks(r,a);l=new Zs(u,o,0)}s==="color"&&(this._assignVertexColorSpace(l,c),l.normalized=!(r instanceof Float32Array)),t.setAttribute(s,l)}return t}_assignVertexColorSpace(e,t){if(t!==Lt)return;let i=new oe;for(let s=0,r=e.count;s<r;s++)i.fromBufferAttribute(e,s),et.colorSpaceToWorking(i,Lt),e.setXYZ(s,i.r,i.g,i.b)}_loadLibrary(e,t){let i=new ws(this.manager);return i.setPriority(this.priority),i.setCache(this.cache),i.setResponseType(t),i.setWithCredentials(this.withCredentials),new Promise((s,r)=>{i.load(e,s,void 0,r)})}preload(){return this._initDecoder(),this}_initDecoder(){if(this.decoderPending)return this.decoderPending;let e=typeof WebAssembly!="object"||this.decoderConfig.type==="js",t=[],{decoderPaths:i}=this;if(e){if(i.dep_js===null)throw new Error("THREE.DRACOLoader: WebAssembly is required when using a custom decoder paths.");t.push(this._loadLibrary(i.dep_js,"text"))}else t.push(this._loadLibrary(i.js,"text")),t.push(this._loadLibrary(i.wasm,"arraybuffer"));return this.decoderPending=Promise.all(t).then(s=>{let r=s[0];e||(this.decoderConfig.wasmBinary=s[1]);let o=VE.toString(),a=["/* draco decoder */",r,"","/* worker */",o.substring(o.indexOf("{")+1,o.lastIndexOf("}"))].join(`
`);this.workerSourceURL=URL.createObjectURL(new Blob([a]))}),this.decoderPending}_getWorker(e,t){return this._initDecoder().then(()=>{if(this.workerPool.length<this.workerLimit){let s=new Worker(this.workerSourceURL);s._callbacks={},s._taskCosts={},s._taskLoad=0,s.postMessage({type:"init",decoderConfig:this.decoderConfig}),s.onmessage=function(r){let o=r.data;switch(o.type){case"decode":s._callbacks[o.id].resolve(o);break;case"error":s._callbacks[o.id].reject(o);break;default:console.error('THREE.DRACOLoader: Unexpected message, "'+o.type+'"')}},this.workerPool.push(s)}else this.workerPool.sort(function(s,r){return s._taskLoad>r._taskLoad?-1:1});let i=this.workerPool[this.workerPool.length-1];return i._taskCosts[e]=t,i._taskLoad+=t,i})}_releaseTask(e,t){e._taskLoad-=e._taskCosts[t],delete e._callbacks[t],delete e._taskCosts[t]}debug(){console.log("Task load: ",this.workerPool.map(e=>e._taskLoad))}dispose(){for(let e=0;e<this.workerPool.length;++e)this.workerPool[e].terminate();return this.workerPool.length=0,this.workerSourceURL!==""&&URL.revokeObjectURL(this.workerSourceURL),this}};function VE(){let n,e;onmessage=function(o){let a=o.data;switch(a.type){case"init":n=a.decoderConfig,e=new Promise(function(u){n.onModuleLoaded=function(h){u({draco:h})},DracoDecoderModule(n)});break;case"decode":let c=a.buffer,l=a.taskConfig;e.then(u=>{let h=u.draco,f=new h.Decoder;try{let d=t(h,f,new Int8Array(c),l),g=d.attributes.map(x=>x.array.buffer);d.index&&g.push(d.index.array.buffer),self.postMessage({type:"decode",id:a.id,geometry:d},g)}catch(d){console.error(d),self.postMessage({type:"error",id:a.id,error:d.message})}finally{h.destroy(f)}});break}};function t(o,a,c,l){let u=l.attributeIDs,h=l.attributeTypes,f,d,g=a.GetEncodedGeometryType(c);if(g===o.TRIANGULAR_MESH)f=new o.Mesh,d=a.DecodeArrayToMesh(c,c.byteLength,f);else if(g===o.POINT_CLOUD)f=new o.PointCloud,d=a.DecodeArrayToPointCloud(c,c.byteLength,f);else throw new Error("THREE.DRACOLoader: Unexpected geometry type.");if(!d.ok()||f.ptr===0)throw new Error("THREE.DRACOLoader: Decoding failed: "+d.error_msg());let x={index:null,attributes:[]};for(let p in u){let m=self[h[p]],y,v;if(l.useUniqueIDs)v=u[p],y=a.GetAttributeByUniqueId(f,v);else{if(v=a.GetAttributeId(f,o[u[p]]),v===-1)continue;y=a.GetAttribute(f,v)}let S=s(o,a,f,p,m,y);p==="color"&&(S.vertexColorSpace=l.vertexColorSpace),x.attributes.push(S)}return g===o.TRIANGULAR_MESH&&(x.index=i(o,a,f)),o.destroy(f),x}function i(o,a,c){let u=c.num_faces()*3,h=u*4,f=o._malloc(h);a.GetTrianglesUInt32Array(c,h,f);let d=new Uint32Array(o.HEAPF32.buffer,f,u).slice();return o._free(f),{array:d,itemSize:1}}function s(o,a,c,l,u,h){let f=c.num_points(),d=h.num_components(),g=r(o,u),x=d*u.BYTES_PER_ELEMENT,p=Math.ceil(x/4)*4,m=p/u.BYTES_PER_ELEMENT,y=f*x,v=f*p,S=o._malloc(y);a.GetAttributeDataArrayForAllPoints(c,h,g,y,S);let T=new u(o.HEAPF32.buffer,S,y/u.BYTES_PER_ELEMENT),M;if(x===p)M=T.slice();else{M=new u(v/u.BYTES_PER_ELEMENT);let _=0;for(let b=0;b<f;b++){for(let R=0;R<d;R++)M[_+R]=T[b*d+R];_+=m}}return o._free(S),{name:l,count:f,itemSize:d,array:M,stride:m}}function r(o,a){switch(a){case Float32Array:return o.DT_FLOAT32;case Int8Array:return o.DT_INT8;case Int16Array:return o.DT_INT16;case Int32Array:return o.DT_INT32;case Uint8Array:return o.DT_UINT8;case Uint16Array:return o.DT_UINT16;case Uint32Array:return o.DT_UINT32}}}var je={ready:!1,cars:{},props:{},tex:{},nrm:{},wear:{},debris:{}},or="assets/";function WE(n){let e=n.attributes.color;if(e){for(let t=0;t<e.count;t++)for(let i=0;i<e.itemSize&&i<3;i++){let s=e.getComponent(t,i);e.setComponent(t,i,s<=.04045?s/12.92:Math.pow((s+.055)/1.055,2.4))}e.needsUpdate=!0}}function Jh(n,e){return new Promise((t,i)=>n.load(e,t,void 0,i))}function $m(n,e){return new Promise((t,i)=>new Or().load(n,s=>{s.wrapS=s.wrapT=ei,s.anisotropy=8,s.colorSpace=e?Lt:zi,t(s)},void 0,i))}async function N_(){let n=new Zh;n.setDecoderPath(or+"draco/"),n.setDecoderConfig({type:"wasm"});let e=new Yh;e.setDRACOLoader(n);let t=["sand","cracked","grass","snow","gravel","mud","dirt"],i=["buggy_classic","buggy_sports","wheel_std","wheel_big"],s=Promise.all(i.map(u=>$m(or+`wear_${u}.jpg`,!1).then(h=>{h.flipY=!1,h.wrapS=h.wrapT=kn,h.userData.keep=!0,je.wear[u]=h}))),[r,o,a,c,...l]=await Promise.all([Jh(e,or+"cars.glb"),Jh(e,or+"props.glb"),Jh(e,or+"gate.glb"),Jh(e,or+"debris.glb"),...t.map(u=>$m(or+`tex_${u}.jpg`,!1)),...t.map(u=>$m(or+`nrm_${u}.jpg`,!1))]);await s,n.dispose(),r.scene.updateMatrixWorld(!0);for(let u of["buggy_classic","buggy_sports","wheel_std","wheel_big","rocket"]){let h=r.scene.getObjectByName(u);if(!h)throw new Error("missing "+u);h.position.set(0,0,0),h.rotation.set(0,0,0),h.scale.set(1,1,1),h.traverse(f=>{f.isMesh&&(f.userData.sharedGeo=!0,f.castShadow=!0)}),je.cars[u]=h}{let u=a.scene.getObjectByName("finish_gate");if(!u)throw new Error("missing finish_gate");u.position.set(0,0,0),u.rotation.set(0,0,0),u.scale.set(1,1,1),u.traverse(h=>{h.isMesh&&(h.geometry.userData.keep=!0,h.material.userData.keep=!0,h.castShadow=!0)}),je.gate=u}return o.scene.updateMatrixWorld(!0),o.scene.traverse(u=>{if(!u.isMesh)return;let h=u.geometry.clone();h.applyMatrix4(u.matrixWorld),["palm","pine","tree_trunk"].includes(u.name)&&WE(h),h.deleteAttribute("uv"),h.computeBoundingSphere(),h.userData.keep=!0,je.props[u.name]=h}),c.scene.updateMatrixWorld(!0),c.scene.traverse(u=>{if(!u.isMesh)return;let h=u.geometry.clone();h.applyMatrix4(u.matrixWorld),h.computeBoundingSphere(),h.userData.keep=!0,je.debris[u.name]=h}),t.forEach((u,h)=>{je.tex[u]=l[h],je.nrm[u]=l[h+t.length],l[h].userData.keep=l[h+t.length].userData.keep=!0}),je.ready=!0,je}var nn=(n,e,t)=>{let i=Math.min(1,Math.max(0,(t-n)/(e-n)));return i*i*(3-2*i)},tf={beach:{A:{tex:"sand",col:10454373,rough:.5,wet:.35,w:(n,e,t,i,s,r,o)=>Math.max(nn(1.6,.15,e),nn(.6,.72,r)*.7*nn(40,14,s))},B:{tex:"dirt",col:10521196,rough:.92,wet:0,w:(n,e,t,i,s,r,o)=>nn(22,9,s)*.75+nn(.66,.76,o)*.4},mark:11901558,markA:.85},desert:{A:{tex:"sand",col:14066794,rough:.95,wet:0,w:(n,e,t,i,s,r,o)=>nn(.55,.68,r)*nn(.88,.97,i)+nn(.66,.74,o)*.35},B:{tex:"dirt",col:9395516,rough:.9,wet:0,w:(n,e,t,i,s,r,o)=>Math.max(nn(.9,.74,i),nn(20,9,s)*.8)},mark:11039050,markA:.8},country:{A:{tex:"dirt",col:8018490,rough:.92,wet:0,w:(n,e,t,i,s,r,o)=>Math.max(nn(24,9.5,s)*.95,nn(.62,.72,r)*.8)*(.6+.4*nn(.8,.95,i))},B:{tex:"mud",col:4665887,rough:.6,wet:.9,w:(n,e,t,i,s,r,o)=>nn(.56,.68,o*.6+r*.4)*nn(50,14,s)*nn(.9,.97,i)},mark:6967094,markA:.85},snow:{A:{tex:"mud",col:10131600,rough:.55,wet:.5,w:(n,e,t,i,s,r,o)=>nn(22,10,s)*.85+nn(.68,.78,o)*.3*nn(40,15,s)},B:{tex:"gravel",col:6247496,rough:.9,wet:0,w:(n,e,t,i,s,r,o)=>Math.max(nn(.9,.74,i),nn(.7,.8,r)*.6)},mark:11121341,markA:.85}},Km=null;function U_(n){Km=n}function nf(n,e){if(!Km)return{a:0,b:0};let{a:t,b:i,GS:s,GN:r}=Km,o=s/r,a=Math.min(r-.001,Math.max(0,(n+s/2)/o)),c=Math.min(r-.001,Math.max(0,(e+s/2)/o)),l=a|0,u=c|0,h=a-l,f=c-u,d=r+1,g=u*d+l,x=p=>(p[g]*(1-h)+p[g+1]*h)*(1-f)+(p[g+d]*(1-h)+p[g+d+1]*h)*f;return{a:x(t),b:x(i)}}var XE=`
uniform sampler2D splatTexA, splatTexB, splatNrmA, splatNrmB, splatBaseTex; uniform vec3 splatColA, splatColB; uniform vec4 splatMat; uniform float splatBase;
varying vec2 vSplat; varying vec3 vSplatW;
`;function Zm(n,e,t=!1){let i=tf[e];if(!i||!je.ready||!je.tex[i.A.tex]||!je.tex[i.B.tex])return n;let s={splatTexA:{value:je.tex[i.A.tex]},splatTexB:{value:je.tex[i.B.tex]},splatNrmA:{value:je.nrm[i.A.tex]},splatNrmB:{value:je.nrm[i.B.tex]},splatColA:{value:new oe(i.A.col)},splatColB:{value:new oe(i.B.col)},splatMat:{value:new dt(i.A.rough,i.B.rough,i.A.wet,i.B.wet)},splatBase:{value:t?.75:1}};return n.onBeforeCompile=r=>{Object.assign(r.uniforms,s),r.vertexShader=`attribute vec2 splat; varying vec2 vSplat; varying vec3 vSplatW;
`+r.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
      vSplat = splat; vSplatW = (modelMatrix * vec4(position, 1.0)).xyz;`),r.fragmentShader=XE+r.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>
        vec2 sUv = vSplatW.xz / 7.0;
        float hA = (texture2D(splatTexA, sUv).r - 0.72) / 0.28, hB = (texture2D(splatTexB, sUv * 1.3).r - 0.72) / 0.28;
        // low-frequency blotches (the same detail maps sampled very large) so layer edges wander instead of following the grid
        float blot = ((texture2D(splatTexB, sUv * 0.045 + 0.31).r * 2.0 + texture2D(splatTexA, sUv * 0.11 + 0.7).r) / 3.0 - 0.72) / 0.28 - 0.5;
        float wA = smoothstep(0.42, 0.58, vSplat.x * splatBase + (hA - 0.5) * 0.35 + blot * 0.5);
        float wB = smoothstep(0.42, 0.58, vSplat.y * splatBase + (hB - 0.5) * 0.45 + blot * 0.6);
        vec3 cA = splatColA * (0.55 + 0.6 * hA), cB = splatColB * (0.55 + 0.6 * hB);
        // standing water in the hollows of wet layers
        float pudA = splatMat.z * smoothstep(0.32, 0.12, hA) * wA, pudB = splatMat.w * smoothstep(0.38, 0.14, hB) * wB;
        cA *= 1.0 - 0.45 * splatMat.z * smoothstep(0.7, 0.2, hA); cB *= 1.0 - 0.45 * splatMat.w * smoothstep(0.7, 0.2, hB);
        diffuseColor.rgb = mix(diffuseColor.rgb, cA, wA);
        diffuseColor.rgb = mix(diffuseColor.rgb, cB, wB);
        float sPud = max(pudA, pudB); diffuseColor.rgb *= 1.0 - 0.35 * sPud;`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
        roughnessFactor = mix(roughnessFactor, splatMat.x, wA); roughnessFactor = mix(roughnessFactor, splatMat.y, wB);
        roughnessFactor = mix(roughnessFactor, 0.08, sPud);`).replace("#include <normal_fragment_maps>",tt.normal_fragment_maps.replace("vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;",`vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
         mapN = mix(mapN, texture2D(splatNrmA, sUv).xyz * 2.0 - 1.0, wA);
         mapN = mix(mapN, texture2D(splatNrmB, sUv * 1.3).xyz * 2.0 - 1.0, wB);
         mapN.xy *= 1.0 - 0.9 * sPud;`))},n.customProgramCacheKey=()=>"splat"+(t?"R":"T"),n.needsUpdate=!0,n}var jr=24e3,qE=.9,YE=.75,ar=null,Gi,Vc,cr,pa,jh=0,ma=1/0,ga=-1,ef=0,Qh=new oe,O_=.5;function $E(){let n=document.createElement("canvas");n.width=64,n.height=128;let e=n.getContext("2d");e.clearRect(0,0,64,128);let t=e.createLinearGradient(0,0,64,0);t.addColorStop(0,"rgba(255,255,255,0)"),t.addColorStop(.07,"rgba(255,255,255,.35)"),t.addColorStop(.16,"rgba(105,105,105,.85)"),t.addColorStop(.84,"rgba(105,105,105,.85)"),t.addColorStop(.93,"rgba(255,255,255,.35)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,64,128),e.fillStyle="rgba(45,45,45,.95)";for(let s=-16;s<144;s+=32)for(let r of[-1,1])e.beginPath(),e.moveTo(32+r*3,s+6),e.lineTo(32+r*25,s+14),e.lineTo(32+r*25,s+24),e.lineTo(32+r*3,s+16),e.closePath(),e.fill();let i=new Nr(n);return i.wrapS=kn,i.wrapT=ei,i.anisotropy=8,i.colorSpace=Lt,i.userData.keep=!0,i}function F_(n){if(ar)return;Gi=new mt,Vc=new Float32Array(jr*4*3),cr=new Float32Array(jr*4*2),pa=new Float32Array(jr*4*4);let e=new Uint32Array(jr*6);for(let i=0;i<jr;i++){let s=i*4,r=i*6;e[r]=s,e[r+1]=s+2,e[r+2]=s+1,e[r+3]=s+1,e[r+4]=s+2,e[r+5]=s+3}Gi.setIndex(new $e(e,1)),Gi.setAttribute("position",new $e(Vc,3).setUsage(qr)),Gi.setAttribute("uv",new $e(cr,2).setUsage(qr)),Gi.setAttribute("color",new $e(pa,4).setUsage(qr)),Gi.setDrawRange(0,0);let t=new Rt({map:$E(),vertexColors:!0,transparent:!0,depthWrite:!1,roughness:.95,metalness:0,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-4});t.userData.keep=!0,ar=new We(Gi,t),ar.frustumCulled=!1,ar.receiveShadow=!0,ar.renderOrder=2,n.add(ar)}function Jm(n){jh=0,ef=0,ma=1/0,ga=-1,Gi&&Gi.setDrawRange(0,0);let e=tf[n];Qh.set(e?e.mark:3812384).convertSRGBToLinear(),O_=e?e.markA:.5}function B_(n,e,t,i,s,r,o,a){if(!ar)return;if(a<=.02){n.has=!1;return}if(!n.has||Math.hypot(e-n.x,i-n.z)>6){Object.assign(n,{has:!0,x:e,y:t,z:i,px:-r*o,pz:s*o,v:n.v||0,k:a});return}let c=Math.hypot(e-n.x,i-n.z);if(c<qE)return;let l=-(i-n.z)/c*o,u=(e-n.x)/c*o,h=jh;jh=(jh+1)%jr,ef=Math.min(jr,ef+1);let f=h*4,d=f*3,g=f*2,x=f*4,p=n.v+c/YE,m=(y,v,S,T,M,_,b)=>{Vc[d+y*3]=v,Vc[d+y*3+1]=S,Vc[d+y*3+2]=T,cr[g+y*2]=M,cr[g+y*2+1]=_,pa[x+y*4]=Qh.r,pa[x+y*4+1]=Qh.g,pa[x+y*4+2]=Qh.b,pa[x+y*4+3]=b*O_};m(0,n.x-n.px,n.y,n.z-n.pz,0,n.v,n.k),m(1,n.x+n.px,n.y,n.z+n.pz,1,n.v,n.k),m(2,e-l,t,i-u,0,p,a),m(3,e+l,t,i+u,1,p,a),Object.assign(n,{x:e,y:t,z:i,px:l,pz:u,v:p%64,k:a}),p>=64&&(cr[g+5]-=64,cr[g+7]-=64,cr[g+1]-=64,cr[g+3]-=64),ma=Math.min(ma,h),ga=Math.max(ga,h)}function k_(){if(!(!ar||ga<0)){for(let[n,e]of[["position",3],["uv",2],["color",4]]){let t=Gi.attributes[n];t.clearUpdateRanges(),t.addUpdateRange(ma*4*e,(ga-ma+1)*4*e),t.needsUpdate=!0}Gi.setDrawRange(0,ef*6),ma=1/0,ga=-1}}var Nt=(n,e,t)=>Math.max(e,Math.min(t,n)),Jn=(n,e,t)=>n+(e-n)*t,lt=(n,e,t)=>{let i=Nt((t-n)/(e-n),0,1);return i*i*(3-2*i)},dr=n=>{for(;n>Math.PI;)n-=Math.PI*2;for(;n<-Math.PI;)n+=Math.PI*2;return n};function X_(n){return()=>{n|=0,n=n+1831565813|0;let e=Math.imul(n^n>>>15,1|n);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}var pf=X_(20261117),_a=(n,e)=>{let t=Math.sin(n*127.1+e*311.7)*43758.5453;return t-Math.floor(t)};function xa(n,e){let t=Math.floor(n),i=Math.floor(e),s=n-t,r=e-i,o=s*s*(3-2*s),a=r*r*(3-2*r),c=_a(t,i),l=_a(t+1,i),u=_a(t,i+1),h=_a(t+1,i+1);return c+(l-c)*o+(u-c)*a+(c-l-u+h)*o*a}function Jt(n,e){let t=0,i=.5;for(let s=0;s<4;s++)t+=i*xa(n,e),n*=2.03,e*=2.03,i*=.5;return t}function Zn(n,e,t,i={}){let s=document.createElement("canvas");s.width=n,s.height=e,t(s.getContext("2d"),n,e);let r=new Nr(s);return r.colorSpace=Lt,r.anisotropy=8,i.repeat&&(r.wrapS=r.wrapT=ei),r}var jc=n=>(n.userData.keep=!0,n),Qc=3,Wn=8,q_=13,mf=46,Y_=21,$_=30,gf=new D(.48,.72,.38).normalize(),K_=/[?&]auto=1/.test(location.search),Vi=780,so=300,ya=Vi/so,Et=so+1,lr=Vi/2-2,i0=new Float32Array(Et*Et),af=new Float32Array(Et*Et),cf=(n,e)=>lt(352,386,Math.max(Math.abs(n),Math.abs(e))),jm=(n,e,t,i)=>Jn(n,i,cf(e,t)),KE=document.getElementById("game"),In=new Sh({canvas:KE,antialias:!0,powerPreference:"high-performance"});In.setPixelRatio(Math.min(devicePixelRatio,2));In.shadowMap.enabled=!0;In.shadowMap.type=Zo;In.toneMapping=Gr;In.toneMappingExposure=1.05;var Gt=new zo;Gt.fog=new qa(11065589,420,2400);var Z_=new Qt(62,1,.3,7e3),wi=new zt({side:Pn,depthWrite:!1,fog:!1,uniforms:{uSun:{value:gf},uZen:{value:new oe(742089)},uHor:{value:new oe(10475255)},uLow:{value:new oe(.45,.78,.9)},uSunK:{value:1},uSunCol:{value:new oe(1,.92,.75)},uGlow:{value:1}},vertexShader:"varying vec3 vDir; void main(){ vDir=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }",fragmentShader:`varying vec3 vDir; uniform vec3 uSun,uZen,uHor,uLow,uSunCol; uniform float uSunK,uGlow;
    void main(){ vec3 d=normalize(vDir); float h=max(d.y,0.);
      vec3 col=mix(uHor,uZen,pow(h,0.5)); col=mix(col,uLow,smoothstep(0.,-0.25,d.y)*0.6);
      float s=max(dot(d,uSun),0.); col+=uSunK*uSunCol*(smoothstep(0.9993,0.9997,s)*14.+(pow(s,24.)*0.28+pow(s,400.)*1.2)*uGlow);
      gl_FragColor=vec4(col,1.); }`}),Sa=new We(new $n(4e3,32,16),wi);Sa.frustumCulled=!1;Gt.add(Sa);var ZE=(()=>{let e=new Float32Array(5400),t=new D;for(let r=0;r<1800;r++){do t.set(Math.random()*2-1,Math.random(),Math.random()*2-1);while(t.lengthSq()>1||t.y<.04);t.normalize().multiplyScalar(3500),e.set([t.x,t.y,t.z],r*3)}let i=new mt;i.setAttribute("position",new $e(e,3));let s=new yi(i,new js({color:14674175,size:2.2,sizeAttenuation:!1,fog:!1,transparent:!0,opacity:.9,depthWrite:!1}));return s.frustumCulled=!1,s.visible=!1,Sa.add(s),s})(),$c=new oc(12574975,14266990,.6);Gt.add($c);var cn=new kr(16773330,3.6);cn.castShadow=!0;cn.shadow.mapSize.set(2048,2048);cn.shadow.bias=-4e-4;cn.shadow.normalBias=.06;Object.assign(cn.shadow.camera,{left:-75,right:75,top:75,bottom:-75,near:1,far:420});cn.shadow.camera.updateProjectionMatrix();Gt.add(cn,cn.target);var Qm=null;function JE(){let n=new zo;n.add(new We(Sa.geometry,wi));let e=new sa(In),t=e.fromScene(n,0,1,6e3).texture;e.dispose(),Qm&&Qm.dispose(),Qm=t,Gt.environment=t}var hf=jc(Zn(256,256,(n,e,t)=>{let i=n.createImageData(e,t);for(let s=0;s<e*t;s++){let r=215+Math.random()*40;i.data[s*4]=r,i.data[s*4+1]=r,i.data[s*4+2]=r,i.data[s*4+3]=255}n.putImageData(i,0,0),n.globalAlpha=.06,n.strokeStyle="#765",n.lineWidth=3;for(let s=0;s<26;s++){let r=s*10+3;n.beginPath();for(let o=0;o<=e;o+=8)n.lineTo(o,r+Math.sin(o/e*Math.PI*4+s)*2.5);n.stroke()}},{repeat:!0})),va=jc(new zt({transparent:!0,depthWrite:!1,fog:!0,uniforms:Hi.merge([be.fog,{uTime:{value:0},uSun:{value:gf},uShallow:{value:new oe(5828828)},uMid:{value:new oe(1229519)},uDeep:{value:new oe(679864)},uSky:{value:new oe(11132159)},uRain:{value:0}}]),vertexShader:`attribute float aDepth; uniform float uTime; varying float vDepth; varying vec3 vWorld;
    #include <fog_pars_vertex>
    void main(){ vDepth=aDepth; vec3 p=position; float k=clamp(-aDepth/3.,0.,1.);
      p.y+=(sin(p.x*0.07+uTime*1.1)+sin(p.z*0.09-uTime*0.9))*0.09*k;
      vec4 wp=modelMatrix*vec4(p,1.); vWorld=wp.xyz; vec4 mvPosition=viewMatrix*wp; gl_Position=projectionMatrix*mvPosition;
      #include <fog_vertex>
    }`,fragmentShader:`uniform float uTime,uRain; uniform vec3 uSun,uShallow,uMid,uDeep,uSky; varying float vDepth; varying vec3 vWorld;
    #include <fog_pars_fragment>
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
    void main(){ float d=clamp(-vDepth,0.,8.); vec2 uv=vWorld.xz; float t=uTime;
      vec2 g=0.10*vec2(cos(uv.x*0.35+t*1.3),cos(uv.y*0.4-t*1.1));
      g+=0.08*vec2(cos(uv.x*0.9-uv.y*0.6+t*1.9),cos(uv.y*1.1+uv.x*0.5-t*1.6));
      g+=0.06*vec2(cos(uv.x*2.3+uv.y*1.7+t*2.6),cos(uv.y*2.7-uv.x*1.3+t*2.2));
      g+=0.10*(vec2(noise(uv*0.8+t*0.5),noise(uv*0.8-t*0.5+7.))-0.5);
      g+=uRain*0.35*(vec2(noise(uv*6.+t*9.),noise(uv*6.-t*8.+3.))-0.5);
      vec3 n=normalize(vec3(-g.x,1.,-g.y)); vec3 v=normalize(cameraPosition-vWorld);
      float fres=pow(1.-max(dot(n,v),0.),4.);
      vec3 col=mix(uShallow,uMid,smoothstep(0.1,1.8,d)); col=mix(col,uDeep,smoothstep(1.4,6.5,d));
      float ca=noise(uv*0.9+vec2(t*0.6,-t*0.4))*noise(uv*1.7-vec2(t*0.5,t*0.7));
      col+=vec3(0.35,0.42,0.3)*ca*(1.-smoothstep(0.,3.5,d))*(1.-uRain);
      col=mix(col,uSky,fres*0.7);
      float spec=pow(max(dot(n,normalize(v+uSun)),0.),260.); col+=vec3(1.,.95,.8)*spec*3.*(1.-uRain*0.8);
      float fn=noise(uv*0.35+vec2(t*0.25,0.));
      float line=0.16+0.14*sin(t*1.3+fn*6.283);
      float foam=(1.-smoothstep(line,line+0.16,d))+(1.-smoothstep(0.,0.12,abs(d-0.55-0.25*sin(t*0.9+fn*9.))))*0.55;
      foam*=0.55+0.45*noise(uv*2.6+t*0.4); foam=clamp(foam,0.,1.)*step(0.004,d);
      col=mix(col,vec3(1.),foam);
      float a=max(max(mix(0.42,0.95,smoothstep(0.,2.6,d)),foam),fres);
      gl_FragColor=vec4(col,a);
      #include <fog_fragment>
    }`})),J_=jc(Zn(128,128,(n,e,t)=>{n.clearRect(0,0,e,t),n.fillStyle="rgba(20,120,255,.55)",n.fillRect(0,0,e,t),n.strokeStyle="#fff",n.lineWidth=12,n.lineJoin="miter";for(let i=-1;i<3;i++)n.beginPath(),n.moveTo(14,i*64+10),n.lineTo(64,i*64+48),n.lineTo(114,i*64+10),n.stroke()},{repeat:!0})),j_=jc(new Tt(.85,.85,.16,22));j_.rotateX(Math.PI/2);var Q_=jc(new Rt({color:16761370,metalness:1,roughness:.22,emissive:16751104,emissiveIntensity:.55})),ai=null,Wc=0,Re=0,Ls=1,ut,ht,mi,Xt,wn,An,ff,no,Kc=[],fr=[],io=null;function el(n,e,t=-1,i=40){let s=0,r=1e18;if(t<0){for(let o=0;o<Re;o+=6){let a=n-ut[o],c=e-ht[o],l=a*a+c*c;l<r&&(r=l,s=o)}t=s,i=6}for(let o=-i;o<=i;o++){let a=(t+o+Re)%Re,c=n-ut[a],l=e-ht[a],u=c*c+l*l;u<r&&(r=u,s=a)}return s}function ey(n,e,t){let i=Nt((e+Vi/2)/ya,0,so-.001),s=Nt((t+Vi/2)/ya,0,so-.001),r=i|0,o=s|0,a=i-r,c=s-o,l=o*Et+r;return(n[l]*(1-a)+n[l+1]*a)*(1-c)+(n[l+Et]*(1-a)+n[l+Et+1]*a)*c}var St=(n,e)=>ey(i0,n,e),s0=(n,e)=>ey(af,n,e),Ai=new kt,Ft=new oe,xn=null,r0=[];function Pt(n,e,t,i=!0){n.attributes.color&&!e.vertexColors&&(e.vertexColors=!0);let s=new Ji(n,e,Math.max(1,t.length));return s.count=t.length,t.forEach((r,o)=>{Ai.position.set(r.x,r.y,r.z),Ai.rotation.set(r.rx||0,r.ry||0,r.rz||0),r.s&&r.s.length?Ai.scale.set(r.s[0],r.s[1],r.s[2]):Ai.scale.setScalar(r.s||1),Ai.updateMatrix(),s.setMatrixAt(o,Ai.matrix),r.c!==void 0&&s.setColorAt(o,Ft.set(r.c))}),s.castShadow=i,s.receiveShadow=!0,xn.add(s),s}var ur=n=>je.ready&&je.props[n]||null,Qr=(n,e,t)=>{let i=ur(n>=2?"rock_big":"rock_small");if(!i)return Yc(n,e,t);let s=i.clone();return s.userData={},s},jE={beach:"sand",desert:"cracked",country:"grass",snow:"snow"};function ty(n,e,t=.7){let i=jE[e];!je.ready||!i||(n.map=je.tex[i],n.normalMap=je.nrm[i],n.normalScale.set(t,t),n.needsUpdate=!0)}function Yc(n,e,t=0){let i=new qo(1,n),s=i.attributes.position;for(let r=0;r<s.count;r++){let o=s.getX(r),a=s.getY(r),c=s.getZ(r),l=1+(Jt(o*1.7+c*.9+3+t,a*1.7-c*.6+8)-.47)*e;s.setXYZ(r,o*l,a*l,c*l)}return i.computeVertexNormals(),i}var Pe=n=>new Rt(Object.assign({roughness:.9},n)),Xc=(n,e,t,i=7)=>{let s=new D().subVectors(e,n),r=new Tt(t,t,s.length(),i),o=new fn().setFromUnitVectors(new D(0,1,0),s.clone().normalize());return r.applyQuaternion(o),r.translate(n.x+s.x/2,n.y+s.y/2,n.z+s.z/2),r},sf=(n,e)=>{let t=n.attributes.position,i=n.attributes.normal,s=new Float32Array(t.count*3),r=new oe;for(let o=0;o<t.count;o++)e(r,t.getX(o),t.getY(o),t.getZ(o),i?i.getY(o):1),s[o*3]=r.r,s[o*3+1]=r.g,s[o*3+2]=r.b;return n.setAttribute("color",new $e(s,3)),n},e0=(n,e)=>{let t=new Tt(n,n,e,3,1,!1,Math.PI/2);return t.rotateZ(Math.PI/2),t};function os(n,e,t,i,...s){let r=new Zt;return r.add(...s),r.position.set(n,e,t),r.rotation.y=i,r.traverse(o=>{o.isMesh&&(o.castShadow=o.receiveShadow=!0)}),xn.add(r),r}var rt=(n,e,t=0,i=0,s=0)=>{let r=new We(n,e);return r.position.set(t,i,s),r};function Tn(n,e,t,i,s=4e4){let r=[],o=0;for(;r.length<e&&o++<s;){let a=(n()-.5)*t*2,c=(n()-.5)*t*2,l=i(a,c,St(a,c),s0(a,c));l&&r.push(l)}return r}var eo=(n,e,t,i=2.6)=>Math.abs(St(n+3,e)-t)+Math.abs(St(n,e+3)-t)<i;function to(n,e,t,i,s){let r=new nc(e,t,12,30,Math.PI),o=r.attributes.position,a=r.attributes.normal,c=new Float32Array(o.count*3),l=new oe(i),u=new oe(s),h=new oe;for(let d=0;d<o.count;d++){let g=o.getX(d),x=o.getY(d),p=o.getZ(d),m=(Jt(g*.16+p*.3+n,x*.16-p*.2)-.5)*5.5,y=1+lt(9,0,x)*.5;o.setXYZ(d,g+a.getX(d)*(m+(y-1)*4),x+a.getY(d)*m*.8,(p+a.getZ(d)*m)*1.5*y),h.copy(l).multiplyScalar(.8+Jt(g*.4,x*.4)*.5).lerp(u,lt(.45,.8,a.getY(d))*lt(e*.7,e,x)),c[d*3]=h.r,c[d*3+1]=h.g,c[d*3+2]=h.b}r.setAttribute("color",new $e(c,3)),r.computeVertexNormals();let f=new We(r,Pe({vertexColors:!0,roughness:.92,flatShading:!0}));f.position.set(ut[n],mi[n]-3.5,ht[n]),f.rotation.y=Xt[n],f.castShadow=f.receiveShadow=!0,xn.add(f)}function z_(n){let e=new ic(new Ur(new D(0,-.6,0),new D(.5,4,0),new D(1.5,7.6,0)),8,.27,6),t=(o,a)=>{let c=new ii(a,o,2,6),l=c.attributes.position;for(let u=0;u<l.count;u++){let h=l.getX(u),f=(l.getY(u)+o/2)/o;l.setXYZ(u,f*o*.92,Math.sin(f*2.2)*1.3-f*f*2.7-Math.abs(h)*.4,h)}return c},i=[];for(let o=0;o<9;o++){let a=t(4.6,1.7);a.rotateZ((n()-.5)*.35),a.rotateY(o/9*Math.PI*2+n()*.3),a.translate(1.5,7.5,0),i.push(a)}for(let o=0;o<5;o++){let a=t(3.4,1.4);a.rotateZ(.55),a.rotateY(o/5*Math.PI*2+.4),a.translate(1.5,7.6,0),i.push(a)}let s=nr(i);s.computeVertexNormals();let r=Zn(64,256,(o,a,c)=>{o.clearRect(0,0,a,c),o.lineCap="round";for(let l=c-4;l>4;l-=5){let u=1-l/c,h=29*Math.pow(Math.sin(Math.PI*Math.min(1,u*.9+.1)),.5);o.strokeStyle=`hsl(${105+Math.random()*20},${55+Math.random()*15}%,${27+Math.random()*14}%)`,o.lineWidth=4.2,o.beginPath(),o.moveTo(32,l),o.lineTo(32-h,l-13),o.moveTo(32,l),o.lineTo(32+h,l-13),o.stroke()}o.strokeStyle="#6f8a2c",o.lineWidth=3,o.beginPath(),o.moveTo(32,c),o.lineTo(32,6),o.stroke()});return{trunk:e,leaf:s,trunkMat:Pe({color:10122064,roughness:.95}),leafMat:Pe({map:r,alphaTest:.45,side:bn,roughness:.75})}}function H_(n,e){let t=ur("palm");if(t){Pt(t,Pe({vertexColors:!0,side:bn,roughness:.8}),e);return}Pt(n.trunk,n.trunkMat,e),Pt(n.leaf,n.leafMat,e)}var rf=n=>n.map(([e,t])=>{let i=e*Math.PI/180;return new D(Math.cos(i)*t,0,Math.sin(i)*t)});function QE(n,e){let t=Pe({color:e,map:hf,roughness:1});t.map=hf,ty(t,ai&&ai.id,.5);for(let[i,s,r,o]of[[-6e3,6e3,lr,6e3],[-6e3,6e3,-6e3,-lr],[-6e3,-lr,-lr,lr],[lr,6e3,-lr,lr]]){let a=new ii(s-i,o-r);a.rotateX(-Math.PI/2);let c=rt(a,t,(i+s)/2,n-.02,(r+o)/2);c.receiveShadow=!0,xn.add(c)}}function G_(n,e,t,i,s,r,o,a,c,l,u,h){let f=[];for(let g=0;g<e;g++){let x=g/e*Math.PI*2+n()*.2,p=s+n()*(r-s),m=a+n()*(c-a);f.push({x:Math.cos(x)*p,y:o,z:Math.sin(x)*p,ry:n()*6,s:[m,l+n()*(u-l),m*(.7+n()*.5)],c:h?h(n):void 0})}let d=Pt(t,i,f,!1);return d.receiveShadow=!1,d}var lf=n=>235+22*Math.sin(3*n+.8)+12*Math.sin(5*n+2.1)+8*Math.sin(2*n),ew=[[0,16],[20,14],[40,18],[58,-12],[74,-16],[90,-6],[104,30],[112,80],[128,108],[150,94],[160,50],[172,16],[195,12],[215,-10],[232,-14],[248,20],[256,70],[250,115],[266,132],[284,100],[292,50],[305,16],[330,14]],V_=(n,e)=>{let t=n*Math.PI/180,i=lf(t)-e;return[Math.cos(t)*i,Math.sin(t)*i]},Kt=null,W_=[[0,215],[25,250],[40,262],[50,315],[62,318],[72,285],[82,250],[95,220],[112,178],[135,168],[160,188],[180,235],[205,280],[230,265],[250,215],[268,182],[290,172],[315,190],[340,200]],Ds={beach:{id:"beach",name:"Coral Coast",icon:"\u{1F3DD}\uFE0F",sub:"Tropical island",banner:"CORAL COAST",seed:11,sky:[742089,10475255,7587814],fog:[11065589,420,2400],hemi:[12574975,14266990,.6],sun:[16773330,3.6],exposure:1.05,env:.55,clouds:22,cloudCol:[16777215,10467020],water:[5828828,1229519,679864,11132159],ocean:!0,road:["#d2a96a","#8a6436","#f1d59c"],dust:[.9,.87,.82],grip:1,gate:1468671,cpts:()=>rf(ew.map(([n,e])=>[n,lf(n*Math.PI/180)-e])),baseH(n,e){let t=Math.hypot(n,e),i=Math.atan2(e,n),s=lf(i)-t;return s<0?Math.max(-8,s*.085)+.25*(xa(n*.05,e*.05)-.5):Math.min(s,45)*.035+.35*Jt(n*.06,e*.06)*lt(4,20,s)+lt(38,130,s)*(9+36*Jt(n*.012+5,e*.012+9))+26*lt(150,235,s)},paint(n,e,t,i,s,r){let a=Jt(e*.03+40,i*.03+12);n.set(15781770).multiplyScalar(.93+.14*xa(e*.11,i*.11)),t<.45&&n.lerp(Ft.set(12819554),1-lt(-.1,.45,t)),t<-.3&&n.lerp(Ft.set(15326382),lt(-.3,-2.5,t)*.9);let c=lt(2+a*2.2,4.2+a*2.2,t)*lt(Wn+6,Wn+16,r);c>0&&(n.lerp(Ft.set(5221930),c),n.lerp(Ft.set(2915636),c*lt(.35,.7,Jt(e*.05,i*.05)))),t>1.5&&n.lerp(Ft.set(9403755),lt(.86,.68,s))},scenery(n){let e=z_(n);H_(e,Tn(n,300,330,(d,g,x,p)=>p<17.5||x<.75||x>26||p>70&&n()<.72||!eo(d,g,x)?null:{x:d,y:x,z:g,ry:n()*6.3,rx:(n()-.5)*.12,rz:(n()-.5)*.12,s:.85+n()*.75})),Pt(Qr(1,.5),Pe({color:16777215,flatShading:!0}),Tn(n,420,310,(d,g,x,p)=>{if(p<19||x<3)return null;let m=1.4+n()*2.6;return{x:d,y:x+m*.25,z:g,ry:n()*6,s:[m,m*(.6+n()*.4),m],c:new oe().setHSL(.27+n()*.08,.6,.24+n()*.14)}}));let t=Tn(n,150,320,(d,g,x,p)=>{if(p<16||p>48||x<-1.2)return null;let m=.7+n()*n()*3.4;return{x:d,y:x+m*.2,z:g,ry:n()*6,rx:n(),s:[m*(.8+n()*.6),m*(.6+n()*.5),m],c:new oe().setHSL(.07+n()*.03,.14,.42+n()*.16)}}),i=[];for(let d=0;d<16;d++){let g=n()*Math.PI*2,x=lf(g)+48+n()*120,p=Math.cos(g)*x,m=Math.sin(g)*x,y=7+n()*13,v=y*(1.1+n()*1.1);t.push({x:p,y:v*.25,z:m,ry:n()*6,s:[y,v,y*(.8+n()*.4)],c:new oe().setHSL(.075,.2,.5+n()*.1)}),i.push({x:p,y:v*1.12,z:m,ry:n()*6,s:[y*.78,y*.22,y*.7],c:5811516})}Pt(Qr(2,.7),Pe({color:16777215,flatShading:!0}),t),Pt(Yc(1,.3),Pe({color:16777215,flatShading:!0}),i);let s=[16730716,16762938,2275566,16743121,16777215,4509818],r=Tn(n,46,310,(d,g,x,p)=>p<17||p>40||x<.5||x>1.9?null:{x:d,y:x,z:g,ry:n()*6,rz:(n()-.5)*.3,s:1+n()*.3,c:s[n()*s.length|0]}),o=new zn(2,.8,12);o.translate(0,2.6,0);let a=new Tt(.05,.05,2.7,6);a.translate(0,1.3,0),Pt(o,Pe({color:16777215,roughness:.6,side:bn}),r),Pt(a,Pe({color:15658734,roughness:.4}),r);let c=(d,g)=>el(...V_(d,g));to(c(128,108),22,6,10521202,5811516),to(c(224,-12),23,6.5,10521202,5811516),to(c(66,-14),23,6,10521202,5811516);{let[d,g]=V_(-16,-42),x=rt(Qr(2,.6),Pe({color:9732719,flatShading:!0}),0,-1,0);x.scale.set(17,8,15);let p=Zn(8,64,m=>{for(let y=0;y<4;y++)m.fillStyle=y%2?"#fff":"#e8323c",m.fillRect(0,y*16,8,16)});os(d,0,g,0,x,rt(new Tt(1.9,3.1,20,20),Pe({map:p,roughness:.55}),0,15.5,0),rt(new Tt(2.9,2.6,.6,20),Pe({color:2371645,roughness:.5}),0,25.8,0),rt(new Tt(1.5,1.5,2.6,12),hr(Pe({color:16774064,emissive:16766826,emissiveIntensity:2.5}),2.5,6),0,27.4,0),rt(new zn(2.2,2.4,12),Pe({color:15217212,roughness:.5}),0,29.9,0))}let l=Pe({color:12618322,roughness:.85}),u=Pe({color:8016434}),h=Pe({color:14859362,roughness:1,flatShading:!0}),f=(d,g,x)=>{let p=rt(new zn(5,3.2,4),h,0,6,0);p.rotation.y=Math.PI/4;let m=[[-3,-3],[3,-3],[-3,3],[3,3]].map(([y,v])=>rt(new Tt(.18,.18,6,6),u,y,-1.2,v));os(d,0,g,x,rt(new vt(7,.3,7),u,0,1.7,0),rt(new vt(5,2.6,5),l,0,3.15,0),p,...m)};for(let[d,g]of[[58,-12],[78,-14],[232,-14],[212,-10]]){let x=c(d,g);for(let p=0;p<3;p++){let m=(x+p*11)%Re,y=Math.sign(wn[m]*ut[m]+An[m]*ht[m])||1,v=y*(25+p%2*7);f(ut[m]+wn[m]*v,ht[m]+An[m]*v,Xt[m]+n())}}for(let d=0;d<7;d++){let g=n()*6.3,x=480+n()*500,p=new mt;p.setAttribute("position",new st([0,1.5,4,0,1.5,-4,0,17,-1],3)),p.computeVertexNormals(),os(Math.cos(g)*x,0,Math.sin(g)*x,n()*6,rt(new vt(3,1.6,11),Pe({color:16777215}),0,.5,0),rt(p,new Sn({color:[16777215,16734826,16765002][d%3],side:bn})))}}},desert:{id:"desert",name:"Dune Run",icon:"\u{1F335}",sub:"Desert canyons",banner:"DUNE RUN",seed:23,sky:[3108816,16177322,15250819],fog:[15978396,300,1900],hemi:[16770240,13074506,.65],sun:[16770751,4.2],exposure:1,env:.5,clouds:7,cloudCol:[16774890,14203024],water:[7336143,1487782,880522,12576511],ocean:!1,edgeH:4,edgeCol:15181404,road:["#b9773f","#7a4a22","#e0a768"],dust:[.93,.72,.5],grip:.97,gate:15229994,cpts:()=>rf([[0,250],[22,272],[45,245],[65,185],[82,155],[102,175],[122,240],[138,262],[147,312],[159,316],[168,285],[175,240],[188,195],[205,165],[226,200],[250,262],[275,282],[298,240],[316,180],[334,170],[350,215]]),baseH(n,e){let t=Math.hypot(n,e),i=2.5+6*Math.pow(Math.abs(Math.sin(n*.016+e*.007+5*Jt(n*.005+3,e*.005))),1.6)+3*Jt(n*.02,e*.02);return i+=20*lt(.6,.8,Jt(n*.006+20,e*.006-4)),i=Jn(i,-2.8,lt(60,24,t)),jm(i,n,e,this.edgeH)},paint(n,e,t,i,s,r){n.set(15379038).multiplyScalar(.9+.18*xa(e*.09,i*.09)),n.lerp(Ft.set(13665344),.5*lt(.45,.75,Jt(e*.02+7,i*.02))),t>6&&n.lerp(Ft.set(11818799),lt(.88,.7,s));let o=Math.hypot(e,i);o<85&&(n.lerp(Ft.set(12819554),lt(1.2,.2,t)),n.lerp(Ft.set(7317562),lt(85,55,o)*lt(.3,1.4,t)*.85)),n.lerp(Ft.set(this.edgeCol),cf(e,i))},scenery(n){let e=(c,l,u)=>new D(c,l,u),t=(c,l,u,h)=>{let f=new $n(c,8,6);return f.translate(l,u,h),f},i=ur("cactus")||nr([Xc(e(0,-.5,0),e(0,6,0),.48,9),t(.48,0,6,0),Xc(e(0,2.4,0),e(1.3,2.4,0),.32),Xc(e(1.3,2.4,0),e(1.3,4.6,0),.32),t(.32,1.3,4.6,0),Xc(e(0,3.2,0),e(-1.1,3.2,0),.3),Xc(e(-1.1,3.2,0),e(-1.1,5.1,0),.3),t(.3,-1.1,5.1,0)].map(c=>c.toNonIndexed&&c.index?c.toNonIndexed():c));Pt(i,Pe({color:16777215,roughness:.8}),Tn(n,140,340,(c,l,u,h)=>h<18||Math.hypot(c,l)<70||!eo(c,l,u,4)?null:{x:c,y:u,z:l,ry:n()*6,s:.7+n()*.7,c:new oe().setHSL(.3+n()*.04,.45,.32+n()*.08)})),Pt(Qr(1,.6),Pe({color:16777215,flatShading:!0}),Tn(n,260,340,(c,l,u,h)=>{if(h<16)return null;let f=.5+n()*.9;return{x:c,y:u+f*.3,z:l,ry:n()*6,s:[f*1.3,f*.8,f*1.3],c:new oe().setHSL(.13+n()*.05,.35,.3+n()*.1)}})),Pt(Qr(2,.7),Pe({color:16777215,flatShading:!0}),Tn(n,160,330,(c,l,u,h)=>{if(h<15||h>55)return null;let f=.8+n()*n()*4;return{x:c,y:u+f*.15,z:l,ry:n()*6,rx:n(),s:[f*(.8+n()*.6),f*(.5+n()*.5),f],c:new oe().setHSL(.04+n()*.03,.45,.38+n()*.12)}}));let s=new Tt(1,1.22,1,11,6);{let c=s.attributes.position;for(let l=0;l<c.count;l++){let u=c.getX(l),h=c.getY(l),f=c.getZ(l),d=1+(Jt(u*2+4,f*2+h)-.5)*.35;c.setXYZ(l,u*d,h,f*d)}s.translate(0,.5,0),s.computeVertexNormals()}sf(s,(c,l,u)=>c.set(12870714).lerp(Ft.set(15179882),(Math.sin(u*22)*.5+.5)*.45).lerp(Ft.set(9256740),lt(.3,0,u)*.5));let r=Pe({vertexColors:!0,flatShading:!0});Pt(s,r,Tn(n,9,330,(c,l,u,h)=>{if(h<55||Math.hypot(c,l)<90)return null;let f=14+n()*18;return{x:c,y:u-2,z:l,ry:n()*6,s:[f,16+n()*22,f*(.7+n()*.5)]}})),G_(n,30,s,r,520,1500,this.edgeH-3,50,130,40,130);let o=z_(n),a=[];for(let c=0;c<16;c++){let l=c/16*6.283+n()*.3,u=44+n()*22,h=Math.cos(l)*u,f=Math.sin(l)*u;a.push({x:h,y:St(h,f),z:f,ry:n()*6.3,rx:(n()-.5)*.15,rz:(n()-.5)*.15,s:.8+n()*.6})}H_(o,a);for(let c=0;c<3;c++){let l=.6+c*2.1,u=Math.cos(l)*70,h=Math.sin(l)*70;os(u,St(u,h),h,l,rt(new zn(4,4.2,4),Pe({color:[16115400,14243386,15909198][c],flatShading:!0}),0,2.1,0))}to(Math.round(Re*.28),23,6.5,12081715,14852198),to(Math.round(Re*.71),22,6,12081715,14852198)}},country:{id:"country",name:"Meadow Valley",icon:"\u{1F327}\uFE0F",sub:"Countryside \xB7 passing showers",banner:"MEADOW VALLEY",seed:37,sky:[2979030,12575735,9419136],fog:[12573935,320,2e3],hemi:[13625087,6982202,.65],sun:[16773850,3.4],exposure:1.02,env:.55,clouds:30,cloudCol:[16777215,11123145],water:[8833460,4165514,2776944,12375782],ocean:!1,edgeH:12,edgeCol:5938746,road:["#8d6b48","#5a3f26","#b08a60"],dust:[.55,.45,.32],grip:1,gate:3120708,weather:"rain",rainSky:[5924467,10397874,7307116],rainFog:[9411237,40,650],cpts:()=>rf([[0,240],[20,265],[42,255],[60,205],[74,152],[92,130],[112,152],[128,215],[148,268],[172,272],[194,225],[210,172],[228,158],[248,198],[268,250],[282,262],[292,312],[304,318],[314,290],[324,252],[338,232]]),river:(n,e)=>Math.abs(e-(60*Math.sin(n*.0085+.6)+25*Math.sin(n*.023+2))+20),baseH(n,e){let t=2+18*Jt(n*.0065+11,e*.0065+3)-5+7*lt(.55,.75,Jt(n*.004,e*.004+9));return t=Jn(t,-2,lt(26,7,this.river(n,e))),jm(t,n,e,this.edgeH)},paint(n,e,t,i,s,r){n.set(6270524).multiplyScalar(.88+.2*xa(e*.1,i*.1)),n.lerp(Ft.set(4164142),.6*lt(.4,.7,Jt(e*.03+3,i*.03)));let o=Math.floor((e+13)/62),a=Math.floor((i-7)/48),c=_a(o,a),l=lt(Wn+10,Wn+22,r)*lt(4,1.2,this.river(e,i)/8);c<.22?n.lerp(Ft.set(14271070).multiplyScalar(.92+.12*Math.sin(e*1.6)),l*.85):c<.34?n.lerp(Ft.set(9071170).multiplyScalar(.9+.15*Math.sin((e+i)*1.4)),l*.85):c<.45&&n.lerp(Ft.set(8831818),l*.6),t<.9&&n.lerp(Ft.set(8020032),lt(.9,-.2,t)),n.lerp(Ft.set(8223344),lt(.8,.62,s)),n.lerp(Ft.set(this.edgeCol),cf(e,i))},scenery(n){let e=(p,m,y,v,S=16)=>v>S&&y>.8&&this.river(p,m)>22&&eo(p,m,y,3),t=new Tt(.3,.45,3.6,7);t.translate(0,1.7,0);let i=nr([Yc(1,.45,1).scale(2.7,2.3,2.7).translate(0,5,0),Yc(1,.45,5).scale(1.9,1.7,1.9).translate(.9,6.6,.4)]),s=Tn(n,300,345,(p,m,y,v)=>!e(p,m,y,v,17)||v>60&&n()<.55?null:{x:p,y,z:m,ry:n()*6,s:.75+n()*.7,c:new oe().setHSL(.25+n()*.08,.55,.25+n()*.12)});Pt(ur("tree_trunk")||t,Pe({color:ur("tree_trunk")?16777215:7031342}),s.map(p=>({...p,c:void 0}))),Pt(ur("tree_canopy")||i,Pe({color:16777215,flatShading:!0}),s.map(p=>ur("tree_canopy")?{...p,c:new oe(p.c).multiplyScalar(1.5)}:p)),Pt(Qr(1,.4),Pe({color:16777215,flatShading:!0}),Tn(n,260,330,(p,m,y,v)=>{if(!e(p,m,y,v,15))return null;let S=1+n()*1.6;return{x:p,y:y+S*.2,z:m,ry:n()*6,s:[S*1.4,S*.7,S],c:new oe().setHSL(.27+n()*.06,.5,.22+n()*.1)}}));let r=Pe({color:15919832}),o=Pe({color:12071979}),a=Pe({color:4864566,flatShading:!0}),c=Pe({color:11022890,flatShading:!0}),l=Pe({color:16777215});Tn(n,7,300,(p,m,y,v)=>v>30&&v<75&&e(p,m,y,v,30)&&eo(p,m,y,1.2)?{x:p,z:m,h:y}:null).forEach((p,m)=>{let y=n()*6;m%3===2?os(p.x,p.h,p.z,y,rt(new vt(14,7,10),o,0,3.5,0),rt(e0(6.2,15),a,0,9.4,0),rt(new vt(.2,4.4,4),l,7.05,2.2,0)):os(p.x,p.h,p.z,y,rt(new vt(8,4.6,6),r,0,2.3,0),rt(e0(4.1,9),c,0,6.6,0),rt(new vt(.9,2.2,.9),Pe({color:9075312}),2.3,7.6,1.2))});for(let p of Tn(n,3,300,(m,y,v,S)=>S>34&&S<90&&e(m,y,v,S,34)?{x:m,z:y,h:v}:null)){let m=new Zt;for(let v=0;v<4;v++){let S=rt(new vt(.7,9,.15),l,0,4.6,0),T=new Zt;T.add(S),T.rotation.z=v*Math.PI/2,m.add(T)}m.position.set(0,13,1.9);let y=.8+n()*.6;r0.push(v=>{m.rotation.z+=v*y}),os(p.x,p.h,p.z,n()*6,rt(new Tt(1.5,2.6,13,8),r,0,6.5,0),rt(new zn(2.2,2.6,8),c,0,14.2,0),m)}let h=new Tt(1,1,1.5,14);h.rotateZ(Math.PI/2),h.translate(0,1,0),Pt(h,Pe({color:14730346}),Tn(n,46,330,(p,m,y,v)=>e(p,m,y,v,20)&&_a(Math.floor((p+13)/62),Math.floor((m-7)/48))<.22?{x:p,y,z:m,ry:n()*6}:null));let f=Tn(n,44,330,(p,m,y,v)=>e(p,m,y,v,22)?{x:p,y:y+.75,z:m,ry:n()*6,s:.8+n()*.3}:null);Pt(Yc(1,.25,9).scale(1,.75,1.35),Pe({color:16184298,flatShading:!0}),f),Pt(new vt(.5,.55,.65).translate(0,.25,1.35),Pe({color:2762278}),f);let d=[],g=[];for(let p=0;p<Re;p+=3)if(!(p%260>120||Math.abs(no[p])>.012))for(let m of[-1,1]){let y=m*(Wn+3.4),v=ut[p]+wn[p]*y,S=ht[p]+An[p]*y,T=St(v,S);if(T<.4)continue;d.push({x:v,y:T+.6,z:S});let M=(p+3)%Re,_=ut[M]+wn[M]*y,b=ht[M]+An[M]*y;for(let R of[.55,1.05])g.push({x:(v+_)/2,y:(T+St(_,b))/2+R,z:(S+b)/2,ry:Xt[p],s:[1,1,Math.hypot(_-v,b-S)]})}Pt(new vt(.22,1.25,.22),Pe({color:9069632}),d),Pt(new vt(.1,.14,1),Pe({color:10253392}),g);let x=[];for(let p=0;p<Re;p++)if(this.river(ut[p],ht[p])<20){let m=St(ut[p],ht[p])+.12;x.push({x:ut[p],y:m,z:ht[p],ry:Xt[p]});for(let y of[-1,1])p%2===0&&x.push({x:ut[p]+wn[p]*y*(Wn+1.4),y:m+.9,z:ht[p]+An[p]*y*(Wn+1.4),ry:Xt[p],s:[.25,1.8,.25]})}Pt(new vt(Wn*2+3,.18,1.35),Pe({color:9068348}),x)}},snow:{id:"snow",name:"Frost Peak",icon:"\u{1F3D4}\uFE0F",sub:"Snowy mountain \xB7 icy lake",banner:"FROST PEAK",seed:51,sky:[3963084,14215415,13162730],fog:[14477557,260,1600],hemi:[15135231,10135736,.75],sun:[16774374,3],exposure:.95,env:.6,clouds:18,cloudCol:[16777215,12110044],water:null,ocean:!1,edgeH:40,edgeCol:15660283,road:["#c9d4e2","#8796ab","#f1f5fb"],dust:[.96,.98,1],grip:.9,gate:2450411,weather:"snow",cpts:()=>rf(W_),init(){let[n,e]=W_[12],t=n*Math.PI/180;Kt={x:Math.cos(t)*e,z:Math.sin(t)*e,r:46}},baseH(n,e){let t=Math.hypot(n,e),i=3+115*Math.exp(-(t*t)/15625)+10*Jt(n*.012,e*.012)+14*lt(.6,.85,Jt(n*.005+7,e*.005+1));return Kt&&(i=Jn(i,1.2,lt(75,Kt.r,Math.hypot(n-Kt.x,e-Kt.z)))),jm(i,n,e,this.edgeH)},paint(n,e,t,i,s,r){n.set(15922940).multiplyScalar(.94+.08*xa(e*.12,i*.12)),n.lerp(Ft.set(13228268),.5*lt(.45,.7,Jt(e*.04+2,i*.04))),n.lerp(Ft.set(7041920),lt(.8,.6,s)),Kt&&n.lerp(Ft.set(10474220),lt(Kt.r+4,Kt.r-4,Math.hypot(e-Kt.x,i-Kt.z))*.9),n.lerp(Ft.set(this.edgeCol),cf(e,i))},scenery(n){let e=[[2.4,3.2,2.6],[1.9,2.8,4.3],[1.3,2.4,5.9]].map(([x,p,m])=>{let y=new zn(x,p,8,1,!0);return y.translate(0,m,0),y}),t=new Tt(.25,.35,2.4,6);t.translate(0,.9,0);let i=nr([...e.map(x=>x.toNonIndexed()),t.toNonIndexed()]);sf(i,(x,p,m,y)=>{let v=Math.hypot(p,y);m<1.4&&v<.4?x.set(5914154):x.set(2054714).lerp(Ft.set(16777215),lt(.9,.2,v/(.4+(7.2-m)*.5))*.9)});let s=Pe({vertexColors:!0,flatShading:!0,side:bn});Pt(ur("pine")||i,s,Tn(n,420,350,(x,p,m,y)=>y<17||y>70&&n()<.5||!eo(x,p,m,4)||Kt&&Math.hypot(x-Kt.x,p-Kt.z)<Kt.r+6?null:{x,y:m-.3,z:p,ry:n()*6,s:.8+n()*.9,c:new oe(1,1,1).multiplyScalar(.85+n()*.15)}));let r=sf(Qr(2,.7,3),(x,p,m,y,v)=>x.set(7370884).lerp(Ft.set(16054527),lt(.25,.6,v)));Pt(r,Pe({vertexColors:!0,flatShading:!0}),Tn(n,160,330,(x,p,m,y)=>{if(y<15||y>70)return null;let v=.8+n()*n()*5;return{x,y:m+v*.1,z:p,ry:n()*6,s:[v*(.8+n()*.6),v*(.6+n()*.6),v]}}));let o=new zn(1,1,9,6);{let x=o.attributes.position;for(let p=0;p<x.count;p++){let m=x.getX(p),y=x.getY(p),v=x.getZ(p),S=1+(Jt(m*3+2,v*3+y*2)-.5)*.5*(y<.49?1:0);x.setXYZ(p,m*S,y,v*S)}o.translate(0,.5,0),o.computeVertexNormals()}sf(o,(x,p,m)=>x.set(7173508).lerp(Ft.set(16185855),lt(.35,.55,m+(Jt(p*4,m*4)-.5)*.2))),G_(n,34,o,Pe({vertexColors:!0,flatShading:!0}),480,1500,this.edgeH-6,120,300,160,420);let a=Pe({color:6964784}),c=Pe({color:16054527,flatShading:!0}),l=hr(Pe({color:16769696,emissive:16758858,emissiveIntensity:1.6}),1.6,4);for(let x of Tn(n,6,320,(p,m,y,v)=>v>22&&v<50&&eo(p,m,y,1.6)?{x:p,z:m,h:y}:null))os(x.x,x.h,x.z,n()*6,rt(new vt(7,3.6,5.5),a,0,1.8,0),rt(e0(3.9,8.2),c,0,5.4,0),rt(new vt(1.4,1.1,.1),l,-1.6,2,2.78),rt(new vt(1.4,1.1,.1),l,1.6,2,2.78),rt(new vt(.8,2,.8),Pe({color:7829367}),2.4,6,-.8));let u=Pe({color:16777215,roughness:.8}),h=Pe({color:1118481}),f=Pe({color:16742938});for(let x of Tn(n,8,300,(p,m,y,v)=>v>14&&v<26&&eo(p,m,y,1.5)?{x:p,z:m,h:y}:null)){let p=rt(new zn(.12,.6,8),f,0,3.05,.6);p.rotation.x=Math.PI/2,os(x.x,x.h,x.z,n()*6,rt(new $n(1.1,14,10),u,0,.9,0),rt(new $n(.8,14,10),u,0,2.2,0),rt(new $n(.55,14,10),u,0,3.05,0),p,rt(new $n(.07,6,4),h,-.2,3.2,.48),rt(new $n(.07,6,4),h,.2,3.2,.48),rt(new Tt(.4,.4,.6,12),h,0,3.7,0))}to(Math.round(Re*.12),22,6,10467532,16777215),to(Math.round(Re*.82),23,6.5,10467532,16777215);let d=[];for(let x=20;x<Re;x+=46){let p=(x/46|0)%2?1:-1,m=p*(Wn+2.6),y=ut[x]+wn[x]*m,v=ht[x]+An[x]*m;d.push({x:y,y:St(y,v),z:v,ry:Xt[x],c:p>0?15087942:2450411})}let g=nr([new Tt(.06,.06,2.6,6).translate(0,1.3,0),new vt(.05,.9,1.2).translate(0,2.1,.6)]);Pt(g,Pe({color:16777215,roughness:.5}),d)}}},tl=Object.keys(Ds),Ps={rain:0,snow:0,target:0},tw=new D(80,46,80);function ny(n,e,t,i){let s=new mt,r=new Float32Array(n*(e?2:1)*3),o=new Float32Array(n*(e?2:1));for(let l=0;l<n;l++){let u=[Math.random(),Math.random(),Math.random()];for(let h=0;h<(e?2:1);h++){let f=e?l*2+h:l;r.set(u,f*3),o[f]=h}}s.setAttribute("position",new $e(r,3)),s.setAttribute("aEnd",new $e(o,1));let a=new zt({transparent:!0,depthWrite:!1,fog:!1,uniforms:{uTime:{value:0},uCam:{value:new D},uAmt:{value:0},uB:{value:tw},uScale:{value:600}},vertexShader:i,fragmentShader:t}),c=e?new Dr(s,a):new yi(s,a);return c.frustumCulled=!1,c.renderOrder=6,c.visible=!1,Gt.add(c),c}var iy="vec3 wrapPos(vec3 p){ return uCam + mod(p - uCam, uB) - uB * 0.5; }",Zc=ny(3200,!0,"varying float vA; void main(){ gl_FragColor=vec4(0.78,0.84,0.92,vA); }",`attribute float aEnd; uniform float uTime,uAmt; uniform vec3 uCam,uB; varying float vA; ${iy}
   void main(){ vec3 p=position*uB; p.y-=uTime*30.+position.x*13.; p.x+=uTime*4.; vec3 w=wrapPos(p); w-=vec3(4.,30.,0.)*0.045*aEnd;
     vec4 mv=modelViewMatrix*vec4(w,1.); vA=step(fract(position.z*7.31),uAmt)*0.42*smoothstep(1.,6.,-mv.z); gl_Position=projectionMatrix*mv; }`),Jc=ny(2600,!1,"varying float vA; void main(){ float r=length(gl_PointCoord-0.5); float a=smoothstep(0.5,0.1,r)*vA; if(a<0.01) discard; gl_FragColor=vec4(1.,1.,1.,a); }",`uniform float uTime,uAmt,uScale; uniform vec3 uCam,uB; varying float vA; ${iy}
   void main(){ vec3 p=position*uB; p.y-=uTime*(2.2+position.x*1.6); p.x+=sin(uTime*0.7+position.z*20.)*2.+uTime*1.2; p.z+=cos(uTime*0.5+position.x*17.)*2.;
     vec3 w=wrapPos(p); vec4 mv=modelViewMatrix*vec4(w,1.); vA=step(fract(position.z*5.17),uAmt)*0.9*smoothstep(0.8,4.,-mv.z);
     gl_PointSize=min((0.09+position.y*0.08)*uScale/max(-mv.z,0.1),24.); gl_Position=projectionMatrix*mv; }`);function sy(n,e){for(let t of[Zc,Jc])t.visible&&(t.material.uniforms.uCam.value.copy(n.position),t.material.uniforms.uScale.value=e)}var En={fog:new oe,near:0,far:0,zen:new oe,hor:new oe,low:new oe,cloud:new oe,sun:0,hemi:0,rainSky:null,rainFog:null},qc=new oe;function ry(n,e){for(let i of r0)i(n,e);let t=ai;if(t){if(va.uniforms.uTime.value=e,J_.offset.y=e*1.6%1,t.weather==="rain"){let i=Math.sin(e*.045+.5)+.7*Math.sin(e*.121+2.2);Ps.target=i>.25?1:0,Ps.rain+=Nt(Ps.target-Ps.rain,-n/6,n/6);let s=Ps.rain,r=En.rainFog,o=En.rainSky;Gt.fog.color.copy(En.fog).lerp(qc.set(r[0]),s),Gt.fog.near=Jn(En.near,r[1],s),Gt.fog.far=Jn(En.far,r[2],s),wi.uniforms.uZen.value.copy(En.zen).lerp(qc.set(o[0]),s),wi.uniforms.uHor.value.copy(En.hor).lerp(qc.set(o[1]),s),wi.uniforms.uLow.value.copy(En.low).lerp(qc.set(o[2]),s),wi.uniforms.uSunK.value=1-s,cn.intensity=En.sun*(1-.62*s),$c.intensity=En.hemi*(1-.25*s),va.uniforms.uRain.value=s,Zc.material.uniforms.uAmt.value=s,Zc.visible=s>.01;for(let a of df)a.color.copy(En.cloud).lerp(qc.set(Ei?1382948:8226708),s)}else t.weather==="snow"&&(Ps.snow=.75,Jc.material.uniforms.uAmt.value=.75,Jc.visible=!0);Zc.material.uniforms.uTime.value=Jc.material.uniforms.uTime.value=e}}function oy(n,e){let t=ai,i=t.grip;return Kt&&t.id==="snow"&&Math.hypot(n-Kt.x,e-Kt.z)<Kt.r&&(i*=.55),i*(1-.22*Ps.rain)}var nw=(n,e)=>!!(Kt&&ai&&ai.id==="snow"&&Math.hypot(n-Kt.x,e-Kt.z)<Kt.r),df=[];function iw(n){n.traverse(e=>{e.geometry&&!e.geometry.userData.keep&&e.geometry.dispose();let t=e.material?Array.isArray(e.material)?e.material:[e.material]:[];for(let i of t)if(!i.userData.keep){for(let s of["map","alphaMap"])i[s]&&!i[s].userData.keep&&i[s].dispose();i.dispose()}e.isInstancedMesh&&e.dispose()})}function xf(n){let e=Ds[n]||Ds.beach;ai=e,xn&&(Gt.remove(xn),iw(xn)),xn=new Zt,Gt.add(xn),r0.length=0,df.length=0,Kt=null;let t=X_(e.seed*7919);e.init&&e.init();let i=(a,c)=>e.baseH(a,c),s=new Wo(e.cpts(),!0,"centripetal");s.arcLengthDivisions=4e3,Wc=s.getLength(),Re=Math.round(Wc/1.5),Ls=Wc/Re,Is.n=Re,Is.len=Wc,Is.cp=e.cpts().length,ut=new Float32Array(Re),ht=new Float32Array(Re),mi=new Float32Array(Re),Xt=new Float32Array(Re),wn=new Float32Array(Re),An=new Float32Array(Re),ff=new Float32Array(Re),no=new Float32Array(Re);let r=s.getSpacedPoints(Re);for(let a=0;a<Re;a++)ut[a]=r[a].x,ht[a]=r[a].z,mi[a]=Math.max(i(ut[a],ht[a]),-.35);for(let a=0;a<3;a++){let c=new Float32Array(Re),l=14;for(let u=0;u<Re;u++){let h=0;for(let f=-l;f<=l;f++)h+=mi[(u+f+Re)%Re];c[u]=h/(2*l+1)}mi.set(c)}for(let a=0;a<Re;a++){let c=(a+Re-1)%Re,l=(a+1)%Re,u=ut[l]-ut[c],h=ht[l]-ht[c],f=Math.hypot(u,h);u/=f,h/=f,Xt[a]=Math.atan2(u,h),wn[a]=h,An[a]=-u}let o=new Float32Array(Re);for(let a=0;a<Re;a++)o[a]=dr(Xt[(a+4)%Re]-Xt[(a+Re-4)%Re])/(8*Ls);for(let a=0;a<Re;a++){let c=0;for(let l=-5;l<=5;l++)c+=o[(a+l+Re)%Re];no[a]=c/11,ff[a]=Math.min(80,Math.sqrt(40/Math.max(Math.abs(no[a]),1e-4)))}gt=rw(i);for(let a=0;a<Et;a++)for(let c=0;c<Et;c++){let l=-Vi/2+c*ya,u=-Vi/2+a*ya,h=el(l,u),f=Math.hypot(l-ut[h],u-ht[h]),d=mi[h];if(ly(l,u)){let g=cy(l,u),x=Math.hypot(l-gt.X[g],u-gt.Z[g]);x<f&&(f=x,d=gt.Y[g])}i0[a*Et+c]=Jn(d,i(l,u),lt(Wn+2,Wn+17,f)),af[a*Et+c]=f}Ps.rain=0,Ps.snow=0,Zc.visible=Jc.visible=!1,va.uniforms.uRain.value=0,o0.length=0;{let a=Pe({color:e.cloudCol[0],emissive:e.cloudCol[1],emissiveIntensity:.55,fog:!1});df.push(a);let c=new qo(1,2);for(let l=0;l<e.clouds;l++){let u=[],h=5+(t()*5|0);for(let x=0;x<h;x++){let p=c.clone(),m=.6+t()*.8;p.scale(m*1.5,m*.8,m),p.translate((x-h/2)*.95+t()*.4,t()*.35,(t()-.5)*1.1),u.push(p)}let f=new We(nr(u),a),d=t()*Math.PI*2,g=700+t()*1500;f.position.set(Math.cos(d)*g,(e.weather==="rain"?150:190)+t()*260,Math.sin(d)*g),f.scale.setScalar(45+t()*70),f.rotation.y=t()*6,xn.add(f)}}{let a=new Float32Array(Et*Et*3),c=new Float32Array(Et*Et*3),l=new Float32Array(Et*Et*2),u=[];for(let v=0;v<Et;v++)for(let S=0;S<Et;S++){let T=v*Et+S,M=-Vi/2+S*ya,_=-Vi/2+v*ya;a[T*3]=M,a[T*3+1]=i0[T],a[T*3+2]=_,l[T*2]=M/7,l[T*2+1]=_/7}for(let v=0;v<so;v++)for(let S=0;S<so;S++){let T=v*Et+S,M=T+1,_=T+Et,b=_+1;u.push(T,_,M,M,_,b)}let h=new mt;h.setAttribute("position",new $e(a,3)),h.setAttribute("uv",new $e(l,2)),h.setIndex(u),h.computeVertexNormals();let f=h.attributes.normal,d=new oe;for(let v=0;v<Et*Et;v++)e.paint(d,a[v*3],a[v*3+1],a[v*3+2],f.getY(v),af[v]),c[v*3]=d.r,c[v*3+1]=d.g,c[v*3+2]=d.b;h.setAttribute("color",new $e(c,3));let g=tf[e.id],x=new Float32Array(Et*Et*2),p=new Float32Array(Et*Et),m=new Float32Array(Et*Et);if(g)for(let v=0;v<Et*Et;v++){let S=a[v*3],T=a[v*3+1],M=a[v*3+2],_=f.getY(v),b=af[v],R=Jt(S*.03+11.3,M*.03-7.1),I=Jt(S*.11-3.7,M*.11+5.2);p[v]=x[v*2]=Nt(g.A.w(S,T,M,_,b,R,I),0,1),m[v]=x[v*2+1]=Nt(g.B.w(S,T,M,_,b,R,I),0,1)}h.setAttribute("splat",new $e(x,2)),U_({a:p,b:m,GS:Vi,GN:so});let y=new We(h,Pe({vertexColors:!0,map:hf,roughness:.95,metalness:0}));y.material.map=hf,ty(y.material,e.id),Zm(y.material,e.id),y.receiveShadow=!0,xn.add(y),e.ocean||QE(e.edgeH,e.edgeCol)}{let a=[-10.5,-8,-4,0,4,8,10.5],c=a.length,l=[],u=[],h=[],f=Math.round(Wc/14);for(let v=0;v<=Re;v++){let S=v%Re;for(let T=0;T<c;T++){let M=ut[S]+wn[S]*a[T],_=ht[S]+An[S]*a[T];l.push(M,St(M,_)+.14,_),u.push(T/(c-1),v/Re*f)}}for(let v=0;v<Re;v++)for(let S=0;S<c-1;S++){let T=v*c+S,M=T+1,_=T+c,b=_+1;h.push(T,_,M,M,_,b)}let d=new mt;d.setAttribute("position",new st(l,3)),d.setAttribute("uv",new st(u,2)),d.setIndex(h),d.computeVertexNormals();{let v=[];for(let S=0;S<l.length;S+=3){let T=nf(l[S],l[S+2]);v.push(T.a,T.b)}d.setAttribute("splat",new st(v,2))}let[g,x,p]=e.road,m=Zn(256,256,(v,S,T)=>{v.fillStyle=g,v.fillRect(0,0,S,T);for(let _=0;_<90;_++)v.globalAlpha=.05+Math.random()*.12,v.fillStyle=Math.random()<.6?x:p,v.fillRect(30+Math.random()*(S-60),0,1+Math.random()*4,T);if(e.id!=="beach"){v.globalAlpha=.18,v.fillStyle=x;for(let _ of[78,100,156,178])v.fillRect(_,0,9,T)}je.ready&&(v.globalAlpha=1,v.globalCompositeOperation="multiply",v.drawImage(je.tex.gravel.image,0,0,S,T),v.globalCompositeOperation="source-over"),v.globalAlpha=1,v.globalCompositeOperation="destination-in";let M=v.createLinearGradient(0,0,S,0);M.addColorStop(0,"rgba(0,0,0,0)"),M.addColorStop(.16,"rgba(0,0,0,.92)"),M.addColorStop(.84,"rgba(0,0,0,.92)"),M.addColorStop(1,"rgba(0,0,0,0)"),v.fillStyle=M,v.fillRect(0,0,S,T)},{repeat:!0}),y=new We(d,Pe({map:m,transparent:!0,depthWrite:!1,roughness:1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));je.ready&&(y.material.normalMap=je.nrm.gravel,y.material.normalScale.set(.8,.8),Zm(y.material,e.id,!0)),y.receiveShadow=!0,y.renderOrder=1,xn.add(y)}if(e.water){let a=va.uniforms;a.uShallow.value.set(e.water[0]),a.uMid.value.set(e.water[1]),a.uDeep.value.set(e.water[2]),a.uSky.value.set(e.water[3]);let c=200,l=new ii(Vi,Vi,c,c);l.rotateX(-Math.PI/2);let u=l.attributes.position,h=new Float32Array(u.count);for(let d=0;d<u.count;d++)h[d]=Math.min(St(u.getX(d),u.getZ(d)),.4);l.setAttribute("aDepth",new $e(h,1));let f=new We(l,va);if(f.renderOrder=2,xn.add(f),e.ocean){let d=new ii(9e3,9e3);d.rotateX(-Math.PI/2),d.setAttribute("aDepth",new $e(new Float32Array(4).fill(-9),1));let g=new We(d,va);g.position.y=-.06,g.renderOrder=2,xn.add(g)}}e.scenery(t);{let a=[],c=[],l=[],u=(f,d)=>gt&&d===gt.side&&(f>gt.a-6&&f<gt.a+46||f>gt.b-46&&f<gt.b+6);for(let f=0;f<Re;f+=7)for(let d of[-1,1]){if(u(f,d))continue;let g=d*(Wn+1.6),x=ut[f]+wn[f]*g,p=ht[f]+An[f]*g,m=St(x,p);a.push({x,y:Math.max(m,-.1)+.45,z:p,c:(f/7|0)%2?16777215:16724804}),l.push({x,y:Math.max(m,-.1)+.95,z:p})}Pt(new Tt(.2,.26,.9,8),Pe({color:16777215,roughness:.5}),a),Pt(new Tt(.21,.21,.12,8),hr(Pe({color:16756768,emissive:16752656,emissiveIntensity:.2}),.2,2.4),l,!1);for(let f=0;f<Re;f+=5)if(Math.abs(no[f])>.013&&!u(f,-Math.sign(no[f]))){let d=-Math.sign(no[f]),g=d*(Wn+4.2),x=ut[f]+wn[f]*g,p=ht[f]+An[f]*g;c.push({x,y:Math.max(St(x,p),0)+1.2,z:p,ry:Xt[f]+Math.PI-d*.5})}let h=Zn(128,64,(f,d,g)=>{f.fillStyle="#fff",f.fillRect(0,0,d,g),f.fillStyle="#ff2f45";for(let x=-1;x<5;x++)f.beginPath(),f.moveTo(x*32,0),f.lineTo(x*32+16,0),f.lineTo(x*32+40,32),f.lineTo(x*32+16,64),f.lineTo(x*32,64),f.lineTo(x*32+24,32),f.fill()});Pt(new vt(4.4,1.5,.15),Pe({map:h,roughness:.6}),c)}{let c=new Zt,l=Pe({color:e.gate,roughness:.4,metalness:.2});for(let p of[-1,1])c.add(rt(new Tt(.7,.9,11,14),l,p*14.6,5,0)),c.add(rt(new $n(1.1,14,10),hr(Pe({color:16762938,emissive:16754176,emissiveIntensity:.8}),.8,3),p*14.6,11.2,0));let u="#"+new oe(e.gate).getHexString(),h=Zn(1024,128,p=>{for(let m=0;m<4;m++)for(let y=0;y<32;y++)p.fillStyle=(y+m)%2?"#fff":"#111",p.fillRect(y*32,m*32,32,32);p.fillStyle=u,p.fillRect(222,14,580,100),p.fillStyle="#fff",p.font="italic 900 80px Avenir Next, Arial",p.textAlign="center",p.textBaseline="middle",p.fillText(e.banner,512,68)}),f=Pe({map:h,roughness:.6});if(je.ready&&je.gate){c.clear(),h.flipY=!1,h.needsUpdate=!0;let p={Gate:l,Banner:f,Bulb:hr(Pe({color:16762938,emissive:16754176,emissiveIntensity:.8}),.8,3),Lamp:hr(Pe({color:16777215,emissive:16773840,emissiveIntensity:.4}),.4,3)},m=je.gate.clone();m.traverse(y=>{y.isMesh&&p[y.material.name]&&(y.material=p[y.material.name])}),c.add(m)}else c.add(rt(new vt(29.5,3,.5),[l,l,l,l,f,f],0,9.4,0));c.position.set(ut[0],mi[0],ht[0]),c.rotation.y=Xt[0],c.traverse(p=>{p.isMesh&&(p.castShadow=!0)}),xn.add(c);let d=Zn(256,32,p=>{for(let m=0;m<2;m++)for(let y=0;y<16;y++)p.fillStyle=(y+m)%2?"#fff":"#111",p.fillRect(y*16,m*16,16,16)}),g=new ii(Wn*2+2,2.2);g.rotateX(-Math.PI/2);let x=new We(g,Pe({map:d,roughness:.8,polygonOffset:!0,polygonOffsetFactor:-6,polygonOffsetUnits:-6,transparent:!0,opacity:.92,depthWrite:!1}));x.position.set(ut[0],mi[0]+.1,ht[0]),x.rotation.y=Xt[0],x.renderOrder=3,x.receiveShadow=!0,xn.add(x)}Kc=[];{let a=new ii(5.2,8);a.rotateX(-Math.PI/2);let c=new Sn({map:J_,color:new oe(1,2.2,3.2),transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-8,polygonOffsetUnits:-8});for(let l of[.05,.17,.34,.5,.63,.8,.92]){let u=Math.round(l*Re),h=0;for(;h++<90&&(Math.abs(mi[(u+6)%Re]-mi[u])>.25||mi[u]<.2||nw(ut[u],ht[u]));)u=(u+1)%Re;let f=(t()-.5)*8,d=ut[u]+wn[u]*f,g=ht[u]+An[u]*f,x=new We(a,c);x.position.set(d,St(d,g)+.16,g),x.rotation.y=Xt[u],x.renderOrder=4,xn.add(x),Kc.push({i:u,lat:f})}}fr=[];for(let a=30;a<Re-30;a+=34){let c=[-5,0,5][t()*3|0],l=(t()-.5)*1.2;if(!Kc.some(u=>Math.abs(u.i-a)<14))for(let u=0;u<5;u++){let h=a+u*3,f=c+l*(u-2),d=ut[h]+wn[h]*f,g=ht[h]+An[h]*f;fr.push({x:d,y:Math.max(St(d,g),0)+1.15,z:g,t:0,ph:u*.5})}}return gt&&aw(t),io=new Ji(j_,Q_,fr.length),io.castShadow=!0,io.frustumCulled=!1,xn.add(io),ay(),e}var Ei=!1,o0=[],hr=(n,e,t)=>(n.userData.gd=e,n.userData.gn=t,o0.push(n),n),t0={sky:[264732,1714764,660528],fog:[924211,200,1300],hemi:[5271728,1317928,.5],sun:[11059455,1.1],exposure:1.18,env:.22,rainSky:[659224,1975600,1054238],rainFog:[1383462,40,520]};function a0(n){Ei=!!n,ai&&ay()}function ay(){let n=ai,e=Ei?Object.assign({},t0,n.id==="snow"?{hemi:[7377104,5925512,.7],exposure:1.05}:{}):n;wi.uniforms.uZen.value.set(e.sky[0]),wi.uniforms.uHor.value.set(e.sky[1]),wi.uniforms.uLow.value.set(e.sky[2]),wi.uniforms.uSunK.value=1,wi.uniforms.uSunCol.value.set(Ei?14674175:16772032),wi.uniforms.uGlow.value=Ei?.25:1,Gt.fog.color.set(e.fog[0]),Gt.fog.near=e.fog[1],Gt.fog.far=e.fog[2],$c.color.set(e.hemi[0]),$c.groundColor.set(e.hemi[1]),$c.intensity=e.hemi[2],cn.color.set(e.sun[0]),cn.intensity=e.sun[1],In.toneMappingExposure=e.exposure,Gt.environmentIntensity=e.env,Object.assign(En,{near:e.fog[1],far:e.fog[2],sun:e.sun[1],hemi:e.hemi[2],rainSky:Ei?t0.rainSky:n.rainSky,rainFog:Ei?t0.rainFog:n.rainFog}),En.fog.set(e.fog[0]),En.zen.set(e.sky[0]),En.hor.set(e.sky[1]),En.low.set(e.sky[2]),ZE.visible=Ei,En.cloud.set(Ei?2766160:n.cloudCol[0]);for(let t of df)t.color.copy(En.cloud),t.emissive.set(Ei?791592:n.cloudCol[1]);for(let t of o0)t.emissiveIntensity=Ei?t.userData.gn:t.userData.gd;Q_.emissiveIntensity=Ei?.9:.55,JE(),document.body.style.background="#"+new oe(e.sky[1]).getHexString()}var gt=null,uf=6.5,sw=9.5,Is={},of=n=>(Is.fail[n]=(Is.fail[n]||0)+1,null);function rw(n){let e=[];for(let t=70;t<Re-140;t+=5)for(let i=t+60;i<Math.min(Re-60,t+460);i+=5){let s=Math.hypot(ut[i]-ut[t],ht[i]-ht[t]),r=(i-t)*Ls;if(s<50||s>240||r<s*1.3)continue;let o=r-s*1.2;e.push({a:t,b:i,L:s,save:Math.min(o,150)-s*.05-Math.max(0,s-170)})}e.sort((t,i)=>i.save-t.save),Is.cand=e.length,Is.fail={};for(let t of e.slice(0,2500)){let i=ow(t.a,t.b,t.L,n);if(i)return i}return null}function ow(n,e,t,i){let s=new D(ut[n],0,ht[n]),r=new D(ut[e],0,ht[e]),o=new D(Math.sin(Xt[n]),0,Math.cos(Xt[n])),a=new D(Math.sin(Xt[e]),0,Math.cos(Xt[e])),c=new Xo(s,s.clone().addScaledVector(o,t*.24),r.clone().addScaledVector(a,-t*.24),r),l=c.getLength();if(l>(e-n)*Ls*.8)return of("len");for(let R=1;R<20;R++){let I=R/20,A=c.getPoint(I),L=I<.1||I>.9?0:I<.3||I>.7?21:30;if(L){for(let B=0;B<Re;B+=3){if(B>n-12&&B<n+50&&I<.35||B>e-50&&B<e+12&&I>.65)continue;let P=A.x-ut[B],H=A.z-ht[B];if(P*P+H*H<L*L)return of("clear")}if(Math.max(Math.abs(A.x),Math.abs(A.z))>330)return of("edge")}}let u=Math.max(20,Math.round(l/1.5)),h=c.getSpacedPoints(u-1),f=new Float32Array(u),d=new Float32Array(u),g=new Float32Array(u),x=new Float32Array(u),p=new Float32Array(u),m=new Float32Array(u);for(let R=0;R<u;R++){f[R]=h[R].x,d[R]=h[R].z;let I=R/(u-1),A=lt(0,.22,I)*lt(1,.78,I);g[R]=Jn(Jn(mi[n],mi[e],I),Math.max(i(f[R],d[R]),-.35),A)}let y=g;for(let R=0;R<3;R++){let I=new Float32Array(u);for(let A=0;A<u;A++){if(A<2||A>u-3){I[A]=y[A];continue}let L=0,B=0;for(let P=-8;P<=8;P++){let H=Nt(A+P,0,u-1);L+=y[H],B++}I[A]=L/B}y=I}for(let R=1;R<u;R++)if(Math.abs(y[R]-y[R-1])/1.5>.36)return of("slope");for(let R=0;R<u;R++){let I=Math.max(0,R-1),A=Math.min(u-1,R+1),L=f[A]-f[I],B=d[A]-d[I],P=Math.hypot(L,B)||1;L/=P,B/=P,x[R]=Math.atan2(L,B),p[R]=B,m[R]=-L}let v=1e9,S=-1e9,T=1e9,M=-1e9;for(let R=0;R<u;R++)v=Math.min(v,f[R]),S=Math.max(S,f[R]),T=Math.min(T,d[R]),M=Math.max(M,d[R]);let _=u>>1,b=Math.sign((f[_]-ut[n])*wn[n]+(d[_]-ht[n])*An[n])||1;return{a:n,b:e,M:u,X:f,Z:d,Y:y,H:x,NX:p,NZ:m,side:b,len:l,save:(e-n)*Ls-l,box:[v-30,S+30,T-30,M+30]}}function cy(n,e,t=-1){let i=gt,s=0,r=1e18,o=0,a=i.M-1;t>=0&&(o=Math.max(0,t-25),a=Math.min(i.M-1,t+25));for(let c=o;c<=a;c++){let l=n-i.X[c],u=e-i.Z[c],h=l*l+u*u;h<r&&(r=h,s=c)}return s}var ly=(n,e)=>gt&&n>gt.box[0]&&n<gt.box[1]&&e>gt.box[2]&&e<gt.box[3],n0={px:0,pz:0,nx:0,nz:0,hd:0,rw:Wn,wall:q_};function uy(n,e){let t=el(n.x,n.z,n.mi>=0?n.mi:n.idx,30);n.mi=t;let i=!1;if(gt&&(n.sc||e)&&ly(n.x,n.z)){let s=cy(n.x,n.z,n.sc?n.si:-1),r=Math.hypot(n.x-gt.X[s],n.z-gt.Z[s]),o=Math.hypot(n.x-ut[t],n.z-ht[t]);s>0&&s<gt.M-1&&(n.sc?r<o+.6:r<o-.6)&&(i=!0,n.si=s)}if(n.sc=i,i){let s=n.si;n.idx=Math.round(gt.a+s/(gt.M-1)*(gt.b-gt.a)),Object.assign(n0,{px:gt.X[s],pz:gt.Z[s],nx:gt.NX[s],nz:gt.NZ[s],hd:gt.H[s],rw:uf,wall:sw})}else n.idx=t,Object.assign(n0,{px:ut[t],pz:ht[t],nx:wn[t],nz:An[t],hd:Xt[t],rw:Wn,wall:q_});return n0}function aw(n){let e=gt,t=[-8.2,-6,-3,0,3,6,8.2],i=t.length,s=[],r=[],o=[];for(let M=0;M<e.M;M++)for(let _=0;_<i;_++){let b=e.X[M]+e.NX[M]*t[_],R=e.Z[M]+e.NZ[M]*t[_];s.push(b,St(b,R)+.06,R),r.push(_/(i-1),M*1.5/12)}for(let M=0;M<e.M-1;M++)for(let _=0;_<i-1;_++){let b=M*i+_,R=b+1,I=b+i,A=I+1;o.push(b,I,R,R,I,A)}let a=new mt;a.setAttribute("position",new st(s,3)),a.setAttribute("uv",new st(r,2)),a.setIndex(o),a.computeVertexNormals();let c=Zn(128,128,(M,_,b)=>{M.fillStyle="#8f8676",M.fillRect(0,0,_,b);for(let I=0;I<900;I++)M.fillStyle=`hsl(35,${8+Math.random()*10}%,${30+Math.random()*40}%)`,M.fillRect(Math.random()*_,Math.random()*b,1+Math.random()*3,1+Math.random()*3);M.globalCompositeOperation="destination-in";let R=M.createLinearGradient(0,0,_,0);R.addColorStop(0,"rgba(0,0,0,0)"),R.addColorStop(.18,"rgba(0,0,0,.95)"),R.addColorStop(.82,"rgba(0,0,0,.95)"),R.addColorStop(1,"rgba(0,0,0,0)"),M.fillStyle=R,M.fillRect(0,0,_,b)},{repeat:!0}),l=new We(a,Pe({map:c,transparent:!0,depthWrite:!1,roughness:1,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3}));l.receiveShadow=!0,l.renderOrder=1,xn.add(l);let u=Zn(512,384,(M,_,b)=>{M.fillStyle="#111",M.fillRect(0,0,_,b),M.fillStyle="#ffd21a",M.beginPath(),M.roundRect(10,10,_-20,b-20,26),M.fill(),M.lineWidth=10,M.strokeStyle="#111",M.beginPath(),M.roundRect(30,30,_-60,b-60,18),M.stroke(),M.fillStyle="#111",M.textAlign="center",M.textBaseline="middle",M.font="900 64px Avenir Next, Arial",M.fillText("\u{1F6A7}",_/2,92),M.font="italic 900 70px Avenir Next, Arial",M.fillText("WORK IN",_/2,178),M.fillText("PROGRESS",_/2,258),M.save(),M.beginPath(),M.rect(40,300,_-80,40),M.clip();for(let R=20;R<_;R+=48)M.beginPath(),M.moveTo(R,300),M.lineTo(R+24,300),M.lineTo(R-16,340),M.lineTo(R-40,340),M.fill();M.restore()}),h=hr(Pe({map:u,emissive:16777215,emissiveMap:u,emissiveIntensity:0,roughness:.5}),0,.55),f=Pe({color:7829367,roughness:.4,metalness:.6}),d=Math.min(e.M-1,9),g=e.side*(uf+3.4),x=e.X[d]+e.NX[d]*g,p=e.Z[d]+e.NZ[d]*g,m=St(x,p);os(x,m,p,e.H[d]+Math.PI-e.side*.35,rt(new vt(4.2,3.15,.14),[f,f,f,f,h,f],0,3.5,0),rt(new Tt(.09,.09,3.6,8),f,-1.5,1.4,-.1),rt(new Tt(.09,.09,3.6,8),f,1.5,1.4,-.1));let y=[],v=[];for(let M=2;M<Math.min(e.M,30);M+=4)for(let _ of[-1,1]){let b=_*(uf+1.2),R=e.X[M]+e.NX[M]*b,I=e.Z[M]+e.NZ[M]*b;y.push({x:R,y:St(R,I),z:I,ry:n()*6})}for(let M of[Math.round(e.M*.35),Math.round(e.M*.65)])for(let _ of[-1,1]){let b=_*(uf+2),R=e.X[M]+e.NX[M]*b,I=e.Z[M]+e.NZ[M]*b;v.push({x:R,y:St(R,I)+.9,z:I,ry:e.H[M]})}let S=nr([new zn(.34,.95,12).translate(0,.52,0),new vt(.75,.06,.75).translate(0,.03,0)]);Pt(S,hr(Pe({color:16738816,emissive:16730624,emissiveIntensity:.1,roughness:.5}),.1,.6),y);let T=Zn(128,32,(M,_,b)=>{M.fillStyle="#fff",M.fillRect(0,0,_,b),M.fillStyle="#e8232f";for(let R=-32;R<_;R+=32)M.beginPath(),M.moveTo(R,0),M.lineTo(R+16,0),M.lineTo(R+32,b),M.lineTo(R+16,b),M.fill()});Pt(new vt(.12,.7,3.6),Pe({map:T,roughness:.6}),v);for(let M=Math.round(e.M*.3);M<e.M*.75;M+=5)fr.push({x:e.X[M],y:Math.max(St(e.X[M],e.Z[M]),0)+1.15,z:e.Z[M],t:0,ph:M*.3})}var u0={shard_panel:{cap:70,metal:.35,rough:.35},shard_chip:{cap:50,metal:.1,rough:.5},bolt:{cap:40,metal:1,rough:.25},clod:{cap:70,metal:0,rough:.95}},cs={},cw=new Ve,hy=new fn,lw=new Fi,fy=new D,dy=new D,uw=new oe,hw=new oe(16777215),py=(n,e)=>Math.max(St(n,e),-.55);function fw(){if(cs.ready||!je.ready||!je.debris)return!!cs.ready;for(let[n,e]of Object.entries(u0)){let t=je.debris[n];if(!t)continue;let i=new Ji(t,new Rt({color:16777215,metalness:e.metal,roughness:e.rough}),e.cap);i.instanceMatrix.setUsage(qr),i.count=0,i.frustumCulled=!1,i.castShadow=!1,i.setColorAt(0,uw.set(16777215)),Gt.add(i),cs[n]={mesh:i,list:[],cap:e.cap}}return cs.ready=!0,!0}var pr=500,Wi=new Float32Array(pr*3),as=new Float32Array(pr*3),_f=new Float32Array(pr),my=new Float32Array(pr),gy=new Float32Array(pr),l0=new Float32Array(pr),c0=0,ro=new mt;ro.setAttribute("position",new $e(Wi,3));ro.setAttribute("aSize",new $e(gy,1));ro.setAttribute("aHeat",new $e(l0,1));var nl=new zt({transparent:!0,depthWrite:!1,blending:Bi,uniforms:{uScale:{value:600}},vertexShader:"attribute float aSize; attribute float aHeat; uniform float uScale; varying float vH; void main(){ vH = aHeat; vec4 mv = modelViewMatrix * vec4(position, 1.); gl_PointSize = min(aSize * uScale / max(-mv.z, 0.1), 40.); gl_Position = projectionMatrix * mv; }",fragmentShader:`varying float vH; void main(){ float r = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, r); if (a < 0.01 || vH <= 0.0) discard;
    vec3 c = mix(vec3(1.4, 0.25, 0.02), vec3(3.6, 1.7, 0.35), vH); gl_FragColor = vec4(c * a * vH, a * vH); }`}),h0=new yi(ro,nl);h0.frustumCulled=!1;h0.renderOrder=6;Gt.add(h0);function dw(n,e,t,i,s,r){let o=c0;c0=(c0+1)%pr,Wi[o*3]=n,Wi[o*3+1]=e,Wi[o*3+2]=t,as[o*3]=i,as[o*3+1]=s,as[o*3+2]=r,_f[o]=my[o]=.25+Math.random()*.45,gy[o]=.06+Math.random()*.08}function pw(n,e,t,i,s,r,o,a,c){let l=cs[n];if(!l)return;let u={x:e,y:t,z:i,vx:s,vy:r,vz:o,rx:Math.random()*6,ry:Math.random()*6,rz:Math.random()*6,wx:(Math.random()-.5)*22,wy:(Math.random()-.5)*22,wz:(Math.random()-.5)*22,life:5+Math.random()*3,scale:c,rest:!1};l.list.length>=l.cap&&l.list.shift(),l.list.push(u),u.color=a}function xy(n,e,t,i,s,r,o,a){fw();let c=10+Math.round(40*r);for(let f=0;f<c;f++){let d=5+Math.random()*12*(.5+r),g=Math.random()*Math.PI*2;dw(n,e,t,i*d*.7+Math.cos(g)*d*.5,1.5+Math.random()*6,s*d*.7+Math.sin(g)*d*.5)}let l=(f,d,g,x=1)=>{for(let p=0;p<d;p++){let m=2.5+Math.random()*6*(.4+r);pw(f,n+(Math.random()-.5)*.4,e+(Math.random()-.2)*.4,t+(Math.random()-.5)*.4,i*m+(Math.random()-.5)*4,2+Math.random()*5*(.5+r),s*m+(Math.random()-.5)*4,g,x*(.7+Math.random()*.6))}},u=new oe(o),h=new oe().setRGB(a[0],a[1],a[2]);l("shard_panel",Math.round(1+5*r),u),l("shard_chip",Math.round(1+3*r),u.clone().multiplyScalar(.85)),l("bolt",Math.round(3*r),null),l("clod",Math.round(2+5*r),h,1.2)}function _y(){for(let n in u0)cs[n]&&(cs[n].list.length=0,cs[n].mesh.count=0)}function yy(n,e){nl.uniforms.uScale.value=e;for(let t=0;t<pr;t++){if(_f[t]<=0){l0[t]=0;continue}_f[t]-=n,as[t*3+1]-=16*n,Wi[t*3]+=as[t*3]*n,Wi[t*3+1]+=as[t*3+1]*n,Wi[t*3+2]+=as[t*3+2]*n;let i=py(Wi[t*3],Wi[t*3+2]);Wi[t*3+1]<i&&(Wi[t*3+1]=i,as[t*3+1]*=-.35,as[t*3]*=.6,as[t*3+2]*=.6),l0[t]=Math.max(0,_f[t]/my[t])}if(ro.attributes.position.needsUpdate=ro.attributes.aHeat.needsUpdate=ro.attributes.aSize.needsUpdate=!0,!!cs.ready)for(let t in u0){let i=cs[t];if(!i)continue;let s=0;for(let r of i.list){if(r.life-=n,r.life<=0)continue;if(!r.rest){r.vy-=18*n,r.x+=r.vx*n,r.y+=r.vy*n,r.z+=r.vz*n,r.rx+=r.wx*n,r.ry+=r.wy*n,r.rz+=r.wz*n;let a=py(r.x,r.z)+.03*r.scale;r.y<a&&(r.y=a,r.vy=Math.abs(r.vy)*.3,r.vx*=.55,r.vz*=.55,r.wx*=.5,r.wy*=.5,r.wz*=.5,r.vy<.8&&Math.hypot(r.vx,r.vz)<.6&&(r.rest=!0,r.rx=Math.round(r.rx/Math.PI)*Math.PI,r.rz=Math.round(r.rz/Math.PI)*Math.PI))}let o=Math.min(1,r.life/.8);fy.set(r.x,r.y,r.z),hy.setFromEuler(lw.set(r.rx,r.ry,r.rz)),dy.setScalar(r.scale*o),i.mesh.setMatrixAt(s,cw.compose(fy,hy,dy)),i.mesh.setColorAt(s,r.color||hw),i.list[s++]=r}i.list.length=s,i.mesh.count=s,i.mesh.instanceMatrix.needsUpdate=!0,i.mesh.instanceColor&&(i.mesh.instanceColor.needsUpdate=!0)}}var yf=8,vf={mudCol:{value:new oe(7033142)}};function vy(n){return{wearAmt:{value:n},dmg:{value:Array.from({length:yf},()=>new dt(0,-99,0,0))},dmgN:0}}function Sy(n){for(let e of n.dmg.value)e.set(0,-99,0,0);n.dmgN=0}function My(n,e,t){for(let i of n.dmg.value)if(i.w>0&&Math.hypot(i.x-e.x,i.y-e.y,i.z-e.z)<.5){i.w=Math.min(1,i.w+t*.6);return}n.dmg.value[n.dmgN%yf].set(e.x,e.y,e.z,Math.min(1,t)),n.dmgN++}var mw=`
uniform sampler2D wearMap; uniform float wearAmt;
#ifdef WEAR_DECAL
uniform sampler2D decalSide, decalHood; uniform vec4 sideBox, hoodBox;
#endif
varying vec3 vWearNrm; uniform float wearScr; uniform vec3 mudCol; uniform vec4 dmg[${yf}];
varying vec3 vWearPos;
float wHash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float wNoise(vec3 x) { vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(wHash(i), wHash(i + vec3(1,0,0)), f.x), mix(wHash(i + vec3(0,1,0)), wHash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(wHash(i + vec3(0,0,1)), wHash(i + vec3(1,0,1)), f.x), mix(wHash(i + vec3(0,1,1)), wHash(i + vec3(1,1,1)), f.x), f.y), f.z); }
`;function f0(n,e,t,i=1,s=null){return n.defines=Object.assign(n.defines||{},{USE_UV:""},s?{WEAR_DECAL:""}:{}),n.userData.worn=!0,n.onBeforeCompile=r=>{r.uniforms.wearMap={value:e},r.uniforms.wearAmt=t.wearAmt,r.uniforms.wearScr={value:i},r.uniforms.mudCol=vf.mudCol,r.uniforms.dmg=t.dmg,s&&(r.uniforms.decalSide={value:s.side},r.uniforms.decalHood={value:s.hood},r.uniforms.sideBox={value:s.sideBox},r.uniforms.hoodBox={value:s.hoodBox}),r.vertexShader=`varying vec3 vWearPos; varying vec3 vWearNrm;
`+r.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
 vWearPos = position; vWearNrm = normal;`),r.fragmentShader=mw+r.fragmentShader.replace("#include <map_fragment>",`#include <map_fragment>
        vec3 wr = texture2D(wearMap, vUv).rgb;
        float dm = 0.0;
        for (int i = 0; i < ${yf}; i++) { float d = length(vWearPos - dmg[i].xyz) + (wNoise(vWearPos * 7.0) - 0.5) * 0.5; dm = max(dm, dmg[i].w * (1.0 - smoothstep(0.25, 1.05, d))); }
        float mudK = clamp(wr.b * (0.3 + wearAmt) * 1.7, 0.0, 1.0);
        float scrK = clamp(wr.g * (0.3 + wearAmt) * 2.0 + dm * smoothstep(0.3, 0.55, wNoise(vWearPos * vec3(26.0, 26.0, 3.0))), 0.0, 1.0) * wearScr;
        diffuseColor.rgb *= mix(1.0, wr.r * wr.r, min(1.0, 0.45 + wearAmt));
        #ifdef WEAR_DECAL
        { vec3 an = normalize(vWearNrm);
          if (abs(an.x) > 0.5) {   // side panels: read front-to-back on the right, back-to-front on the left, so text reads normally
            float L = sideBox.y - sideBox.x, u = an.x > 0.0 ? (sideBox.y - vWearPos.z) / L : (vWearPos.z - sideBox.x) / L, v = (vWearPos.y - sideBox.z) / (sideBox.w - sideBox.z);
            if (u > 0.0 && u < 1.0 && v > 0.0 && v < 1.0) { vec4 dc = texture2D(decalSide, vec2(u, v)); diffuseColor.rgb = mix(diffuseColor.rgb, dc.rgb, dc.a); } }
          if (an.y > 0.55) {       // bonnet number, upright for the chase camera
            vec2 q = vec2((hoodBox.y - vWearPos.x) / (hoodBox.y - hoodBox.x), (vWearPos.z - hoodBox.z) / (hoodBox.w - hoodBox.z));
            if (q.x > 0.0 && q.x < 1.0 && q.y > 0.0 && q.y < 1.0) { vec4 dc = texture2D(decalHood, q); diffuseColor.rgb = mix(diffuseColor.rgb, dc.rgb, dc.a); } } }
        #endif
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.5, 0.51, 0.53), scrK);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.03, 0.026, 0.024), dm * 0.85 * smoothstep(0.25, 0.6, wNoise(vWearPos * 4.0 + 4.0)));
        diffuseColor.rgb *= 1.0 - 0.35 * dm;
        diffuseColor.rgb = mix(diffuseColor.rgb, mudCol * (0.75 + 0.5 * wNoise(vWearPos * 11.0)), mudK);`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
        roughnessFactor = mix(roughnessFactor, 0.4, scrK * 0.6); roughnessFactor = mix(roughnessFactor, 0.95, max(mudK, dm * 0.5));`).replace("#include <metalnessmap_fragment>",`#include <metalnessmap_fragment>
        metalnessFactor = mix(metalnessFactor, 0.9, scrK); metalnessFactor *= 1.0 - mudK;`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
        if (dm > 0.01) normal = normalize(normal + dm * 1.1 * vec3(wNoise(vWearPos * 6.0) - 0.5, wNoise(vWearPos * 6.0 + 9.0) - 0.5, 0.0));`).replace("#include <lights_physical_fragment>",`#include <lights_physical_fragment>
        #ifdef USE_CLEARCOAT
          material.clearcoat *= 1.0 - max(mudK, max(scrK, dm));
        #endif`)},n.customProgramCacheKey=()=>"worn"+(n.isMeshPhysicalMaterial?"P":"S")+(s?"D":""),n.needsUpdate=!0,n}var Ea=(n,e)=>{try{let t=localStorage.getItem(n);return t?JSON.parse(t):e}catch{return e}},qt=tl.includes(Ea("ccr_track","beach"))?Ea("ccr_track","beach"):"beach",mo=!!Ea("ccr_night",!1);a0(mo);xf(qt);F_(Gt);Jm(qt);var sl=new Rt({color:1776672,roughness:.92}),jt=new Rt({color:2303532,roughness:.5,metalness:.6}),ls=new Rt({color:14673646,roughness:.15,metalness:1}),wf=new Set([sl,jt,ls]),gw=new D(0,1,0);function ci(n,e,t,i){let s=new D().subVectors(e,n),r=new We(new Tt(t,t,s.length(),7),i);return r.position.copy(n).addScaledVector(s,.5),r.quaternion.setFromUnitVectors(gw,s.normalize()),r}var xw=Zn(128,128,(n,e,t)=>{let i=n.createRadialGradient(64,64,4,64,64,64);i.addColorStop(0,"rgba(255,255,255,1)"),i.addColorStop(.5,"rgba(255,255,255,.45)"),i.addColorStop(1,"rgba(255,255,255,0)"),n.clearRect(0,0,e,t),n.fillStyle=i,n.fillRect(0,0,e,t)});function _w(n,e){let t=n.body==="sports",i=n.tyres==="big",s=i?.86:.62,r=i?.78:.52,o=s-.62,a=i?1.2:1.08,c=(X,G,J)=>new D(X,G+o,J),l=new Zt,u=new Zt;l.add(u);let h=new Mn({color:n.paint,roughness:n.metal?.12:.32,metalness:n.metal?1:.25,clearcoat:1,clearcoatRoughness:.1}),f=new Rt({color:n.rim,roughness:.3,metalness:.5,emissive:n.rim,emissiveIntensity:.9}),d=new Rt({color:16777215,roughness:.4}),g=new Rt({color:16777215,emissive:16773824,emissiveIntensity:2}),x=(X,G,J,se,ye,Le,j,N=0)=>{let U=new We(new vt(X,G,J),j);return U.position.set(se,ye+o,Le),U.rotation.x=N,u.add(U),U},p=new We(new $n(.27,14,10),new Rt({color:16777215,roughness:.25})),m=new We(new $n(.2,10,8),new Rt({color:1053980,roughness:.1,metalness:.8})),y=1.2,v=-2,S=null,T=vy(.5),M=je.ready&&je.cars[t?"buggy_sports":"buggy_classic"];if(M){let X=new Rt({color:n.paint,roughness:.7}),G=new Rt({color:n.rim,roughness:.35,metalness:.3}),J={Paint:h,Dark:jt,Chrome:ls,Tire:sl,Rim:f,Lamp:g,Suit:X,Accent:G},se=M.clone();se.position.y=o;let ye=je.wear[t?"buggy_sports":"buggy_classic"],Le={Paint:1,Accent:1,Dark:.7,Rim:.6,Seat:.25,Suit:.2,Helmet:.5,Tire:.15,Chrome:0},j={},N=e&&(t?{sideBox:new dt(-1.95,1.95,.64,1.1),hoodBox:new dt(-.62,.62,.55,1.75)}:{sideBox:new dt(-1.68,1.62,.7,1.24),hoodBox:new dt(-.62,.62,.62,1.72)});N&&Object.assign(N,Tw(n,e));let U=(W,k)=>j[W]||(j[W]=f0(wf.has(k)||!J[W]?k.clone():k,ye,T,Le[W],W==="Paint"||W==="Accent"?N:null));se.traverse(W=>{if(W.isMesh){let k=W.material.name,ee=J[k]||W.material;ye&&k in Le?W.material=U(k,ee):(W.material=ee,J[k]||wf.add(ee))}}),S=se,u.add(se),t&&(y=1.12,v=-2.25)}else if(t){x(1.62,.22,3.5,0,.66,0,jt),x(1.52,.3,1.6,0,.84,1.25,h,.14),x(.34,.02,1.62,0,1,1.25,d,.14),x(1.2,.05,.05,0,.88,2.05,g);for(let X of[-1,1])x(.44,.44,2.1,X*.84,.86,-.25,h),x(.46,.08,1.6,X*.84,1.1,-.25,jt);x(1,.32,1.25,0,.92,-.25,jt),x(1.05,.38,.05,0,1.18,.42,new Mn({color:10475775,roughness:.05,metalness:0,transmission:.6,transparent:!0,opacity:.55}),-.65),x(1.34,.5,1.2,0,1.05,-1.45,h,-.18),x(.5,.34,.55,0,1.42,-1,jt),x(2.3,.08,.62,0,1.98,-2.05,h);for(let X of[-1,1])x(.06,.55,.75,X*1.15,1.85,-2.05,jt),u.add(ci(c(X*.45,1.25,-1.85),c(X*.45,1.95,-2),.05,jt));for(let X of[-1,1])u.add(ci(c(X*.48,1,-.82),c(X*.44,1.78,-.86),.06,ls));if(u.add(ci(c(-.44,1.78,-.86),c(.44,1.78,-.86),.06,ls)),p.position.set(0,1.5+o,-.45),m.position.set(0,1.52+o,-.3),x(.34,.36,.24,0,1.18,-.45,new Rt({color:n.paint,roughness:.7})),!n.rocket)for(let X of[-1,1])u.add(ci(c(X*.3,1.2,-1.95),c(X*.3,1.1,-2.25),.08,ls));y=1.12,v=-2.25}else{x(1.5,.28,3,0,.78,0,jt),x(1.46,.42,1.25,0,1,1.15,h,.2),x(.5,.06,1.2,0,1.24,1.13,d,.2);for(let X of[-1,1])x(.34,.5,1.9,X*.86,.95,-.15,h),x(.16,.16,.1,X*.5,1.02,1.8,g);x(1.5,.5,.9,0,1.05,-1.25,h),x(.9,.3,.6,0,1.4,-1.3,jt),x(.62,.75,.2,0,1.3,-.62,jt),p.position.set(0,1.78+o,-.42),m.position.set(0,1.8+o,-.27),x(.34,.45,.24,0,1.38,-.42,new Rt({color:n.paint,roughness:.7}));for(let X of[-1,1])u.add(ci(c(X*.7,1.05,.62),c(X*.62,2.1,.05),.055,jt),ci(c(X*.62,2.1,.05),c(X*.62,2.1,-.95),.055,jt),ci(c(X*.62,2.1,-.95),c(X*.72,1.1,-1.6),.055,jt),ci(c(X*.62,2.1,-.5),c(X*.72,1.1,-.6),.045,jt),ci(c(X*.45,1.6,-1.75),c(X*.45,1.98,-1.85),.04,jt)),n.rocket||u.add(ci(c(X*.3,1.5,-1.5),c(X*.3,1.2,-2),.07,ls));u.add(ci(c(-.62,2.1,.05),c(.62,2.1,.05),.055,jt),ci(c(-.62,2.1,-.95),c(.62,2.1,-.95),.055,jt),ci(c(-.8,.72,1.86),c(.8,.72,1.86),.08,ls)),x(1.3,.06,1.05,0,2.15,-.45,h),x(1.9,.07,.5,0,2.02,-1.88,h);for(let X=0;X<4;X++){let G=new We(new Tt(.13,.13,.12,12),new Rt({color:16777215,emissive:16771496,emissiveIntensity:2.2}));G.rotation.x=Math.PI/2,G.position.set(-.48+X*.32,2.3+o,.08),u.add(G)}}M||u.add(p,m);let _=[],b=!!n.rocket,R=b&&je.ready&&je.cars.rocket;if(R)for(let X of[-1,1]){let G=X*.62,J=(t?1.38:1.45)+o,se=R.clone();se.position.set(G,J,-1.45),se.traverse(ye=>{if(ye.isMesh){let Le={Chrome:ls,Dark:jt}[ye.material.name];Le?ye.material=Le:wf.add(ye.material)}}),u.add(se),y=J,v=-2.3}else if(b)for(let X of[-1,1]){let G=X*.62,J=(t?1.38:1.45)+o,se=new We(new Tt(.2,.2,1.3,14),new Rt({color:15922423,roughness:.3,metalness:.7}));se.rotation.x=Math.PI/2,se.position.set(G,J,-1.45),u.add(se);let ye=new We(new zn(.2,.42,14),new Rt({color:16722493,roughness:.35,metalness:.4}));ye.rotation.x=Math.PI/2,ye.position.set(G,J,-.6),u.add(ye);let Le=new We(new Tt(.16,.25,.3,14,1,!0),jt);Le.rotation.x=Math.PI/2,Le.position.set(G,J,-2.2),u.add(Le);for(let j of[0,1,2]){let N=new We(new vt(.03,.26,.34),new Rt({color:16722493})),U=j*2.094;N.position.set(G+Math.sin(U)*.24,J+Math.cos(U)*.24,-1.95),N.rotation.z=-U,u.add(N)}y=J,v=-2.35}let I=b?new oe(4.5,1.7,.45):new oe(.5,2.2,4.5);for(let X of[-1,1]){let G=new zn(b?.22:.16,b?2.6:1.6,10);G.rotateX(-Math.PI/2),G.translate(0,0,b?-1.3:-.8);let J=new We(G,new Sn({color:I,transparent:!0,opacity:.85,blending:Bi,depthWrite:!1}));J.position.set(X*(b?.62:.3),b?y:y+o,v),J.visible=!1,u.add(J),_.push(J)}if(n.glow){let X=new We(new ii(3.2,4.6),new Sn({map:xw,color:new oe(n.glow).multiplyScalar(2.2),transparent:!0,opacity:.85,blending:Bi,depthWrite:!1}));X.rotation.x=-Math.PI/2,X.position.y=.08,X.renderOrder=3,l.add(X),_.glow=X}let A=[],L=je.ready&&je.wear[i?"wheel_big":"wheel_std"],B={},P=X=>{let G={Tire:sl,Rim:f,Dark:jt,Chrome:ls}[X];return G?L?B[X]||(B[X]=f0(G.clone(),L,T,{Tire:.15,Rim:.6,Dark:.7,Chrome:0}[X])):G:null},H=new Tt(s,s,r,22);H.rotateZ(Math.PI/2);let K=new Tt(s*.6,s*.6,r+.02,14);K.rotateZ(Math.PI/2);let $=new vt(r-.02,i?.14:.09,s*2.1);for(let[X,G,J]of[[1,1.18,1],[-1,1.18,1],[1,-1.2,0],[-1,-1.2,0]]){let se=X*a,ye=new Zt,Le=new Zt;ye.position.set(se,s,G),ye.add(Le);let j=je.ready&&je.cars[i?"wheel_big":"wheel_std"];if(j){let N=j.clone();N.scale.set(r,s,s),N.traverse(U=>{U.isMesh&&(U.material=P(U.material.name)||U.material)}),Le.add(N)}else{Le.add(new We(H,sl),new We(K,f));for(let W=0;W<(i?8:6);W++){let k=new We($,sl);k.rotation.x=W*Math.PI/(i?8:6),Le.add(k)}let N=new We(new vt(r+.06,.1,s),ls),U=N.clone();U.rotation.x=Math.PI/2,Le.add(N,U)}l.add(ye),A.push({pivot:ye,spin:Le,front:J}),u.add(ci(c(X*.6,.85,G),new D(se*.82,s+.04,G),i?.07:.05,jt))}return l.traverse(X=>{X.isMesh&&(X.castShadow=X.material.blending!==Bi)}),{G:l,body:u,wheels:A,flames:_,wr:s,wx:a,ww:r,wearU:T,dmgRoot:S}}function yw(n){n.G.traverse(e=>{e.isMesh&&(e.userData.sharedGeo||e.geometry.dispose(),wf.has(e.material)||e.material.dispose())})}var Pf=[{id:"lava",name:"Lava Red",col:15213359,rim:2849791,price:0},{id:"ocean",name:"Ocean Blue",col:1993727,rim:16765498,price:40},{id:"lime",name:"Lagoon Lime",col:6279967,rim:16727450,price:40},{id:"sunset",name:"Sunset Gold",col:16756736,rim:16727423,price:60},{id:"violet",name:"Neon Violet",col:9121013,rim:2291152,price:60},{id:"midnight",name:"Midnight",col:1711401,rim:16738816,price:80},{id:"pearl",name:"Pearl White",col:15921902,rim:49919,price:80},{id:"chrome",name:"Liquid Chrome",col:13226973,rim:16723592,price:300,metal:!0}],Oy=[{id:"magnet",name:"Coin Magnet",price:120,icon:"\u{1F9F2}",desc:"Pulls in coins from more than twice as far away."},{id:"tyres",name:"Monster Tyres",price:150,icon:"\u{1F6DE}",desc:"Huge knobbly tyres. Sand, grass and shallows barely slow you down."},{id:"drift",name:"Drift Kit",price:200,icon:"\u{1F300}",desc:"Drift boosts charge faster and fire 45% longer."},{id:"engine",name:"Turbo Engine",price:250,icon:"\u2699\uFE0F",desc:"+12% acceleration and +3% top speed."},{id:"rocket",name:"Rocket Boost",price:400,icon:"\u{1F680}",desc:"Twin rockets: nitro pushes harder (+55%) and burns 25% slower."},{id:"sports",name:"Sports Buggy",price:600,icon:"\u{1F3CE}\uFE0F",desc:"Low-slung race body: +5% top speed, +4% acceleration, sharper grip."},{id:"glow",name:"Neon Underglow",price:90,icon:"\u2728",desc:"Glows under your buggy in your rim colour. Pure style."}],vw=[30,20,14,10,7,5],Xn={get(n,e){try{let t=localStorage.getItem(n);return t?JSON.parse(t):e}catch{return e}},set(n,e){try{localStorage.setItem(n,JSON.stringify(e))}catch{}}},ho=Xn.get("ccr_profiles",{}),Fy=n=>({nick:n,coins:0,owned:["lava"],eq:{paint:"lava"},races:0,wins:0,best:0,lap:0,tb:{},earned:0,ts:0});function Hf(n){let e=n.toLowerCase();return ho[e]||(ho[e]=Fy(n),R0()),ho[e]}function R0(){Xn.set("ccr_profiles",ho)}function xl(n){return Pf.find(e=>e.id===n.eq.paint)||Pf[0]}function yr(n){let e=xl(n),t=n.eq;return{paint:e.col,rim:e.rim,metal:!!e.metal,body:t.sports?"sports":"classic",tyres:t.tyres?"big":"std",rocket:!!t.rocket,glow:t.glow?e.rim:0}}var _l={top:1,acc:1,grip:1,off:1,boost:1.36,burn:.3,magnet:1,drift:.55,driftT:.7};function Gf(n){let e=n.eq,t={..._l};return e.engine&&(t.acc*=1.12,t.top*=1.03),e.tyres&&(t.off=.4),e.sports&&(t.top*=1.05,t.acc*=1.04,t.grip=1.15),e.rocket&&(t.boost=1.55,t.burn=.225),e.drift&&(t.drift=.8,t.driftT=.5),e.magnet&&(t.magnet=2.3),t}var S0=[[1993727,16765498],[16761370,16730716],[2278750,16777215],[11032055,6220500],[16742938,3003647],[15213359,2849791]],fl=["Azul","Sunny","Mango","Orchid","Blaze","Coral"],C0=n=>({paint:S0[n][0],rim:S0[n][1],metal:!1,body:"classic",tyres:"std",rocket:!1,glow:0}),ll=Xn.get("ccr_board",{});function Sw(n){let e=Object.assign({},n.tb||{});return!e.beach&&n.best&&(e.beach=[n.best,n.lap||0]),e}function yl(n){return{nick:n.nick,wins:n.wins,races:n.races,best:n.best,lap:n.lap,tb:Sw(n),earned:n.earned,paint:xl(n).col,body:n.eq.sports?1:0,ts:n.ts}}var If=(n,e)=>n.tb&&n.tb[e]?n.tb[e]:e==="beach"&&n.best?[n.best,n.lap||0]:[0,0];function Aa(n){let e=!1;for(let t of n||[]){if(!t||typeof t.nick!="string"||!/^[\w \-]{2,14}$/.test(t.nick))continue;let i=t.nick.toLowerCase(),s=ll[i],r={};if(t.tb&&typeof t.tb=="object")for(let a of tl){let c=t.tb[a];Array.isArray(c)&&(r[a]=[+c[0]||0,+c[1]||0])}let o={nick:t.nick,wins:+t.wins|0,races:+t.races|0,best:+t.best||0,lap:+t.lap||0,tb:r,earned:+t.earned|0,paint:+t.paint|0,body:+t.body|0,ts:+t.ts||0};(!s||o.races>s.races||o.races===s.races&&o.ts>s.ts)&&(ll[i]=o,e=!0)}return e&&Xn.set("ccr_board",ll),e}var By=()=>Object.values(ll).sort((n,e)=>e.wins-n.wins||(If(n,qt)[0]||1e9)-(If(e,qt)[0]||1e9)||e.earned-n.earned);for(let n of Object.values(ho))Aa([yl(n)]);var ky=n=>n.k===5?.35:.3+.45*((Math.sin(n.k*12.9898)*43758.5453%1+1)%1),zy={beach:12756087,desert:12088387,country:4928547,snow:13226716};vf.mudCol.value.set(zy[qt]);var Ht=S0.map((n,e)=>({k:e,name:fl[e],model:null,lookKey:"",ctrl:"ai",st:_l,view:null,prof:null,x:0,y:0,z:0,h:0,vx:0,vz:0,vy:0,steer:0,surf:1,idx:0,mi:-1,sc:!1,si:0,dist:0,lap:-1,lat:0,off:0,grounded:!0,air:0,gPrev:0,up:new D(0,1,0),boostT:0,nitro:.5,drift:0,base:[.9,.925,.95,.97,.99,1][e],skill:1,lane:0,laneT:0,laneTarget:0,finished:!1,finishT:0,lapStart:0,bestLap:0,coins:0,wrongT:0,spin:0,emit:0,vf:0,vl:0,net:null,reward:null})),Mw=["REEF RAIDERS","SUNDOG RACING","MANGO MOTORSPORT","ORCHID WORKS","BLAZE RALLY","CORAL COAST"],Sf=["CORAL OIL","GRIPTEK","NITROX","DUNELINE","KNOBBY CO","TIDE FUEL"],bw=n=>{let e=n.ctrl==="ai"||n.bot?Mw[n.k]:(n.name||"RACER").toUpperCase().slice(0,14),t=0;for(let i of e)t=t*31+i.charCodeAt(0)>>>0;return{team:e,num:n.bot||n.ctrl==="ai"?[77,23,45,88,12,31][n.k]:2+t%97,sponsor:Sf[(n.k+t)%Sf.length],sponsor2:Sf[(n.k+t+3)%Sf.length]}},d0=new Map;function Tw(n,e){let t=[n.paint,n.rim,e.team,e.num,e.sponsor].join("|");if(d0.has(t))return d0.get(t);let i=new oe(n.paint),s=i.r*.3+i.g*.59+i.b*.11>.55,r=s?"#101318":"#ffffff",o=s?"rgba(255,255,255,.9)":"rgba(8,10,14,.9)",a="#"+new oe(n.rim).getHexString(),c=Zn(1024,160,(h,f,d)=>{h.clearRect(0,0,f,d),h.fillStyle=a,h.beginPath(),h.moveTo(40,150),h.lineTo(980,150),h.lineTo(1010,112),h.lineTo(300,120),h.lineTo(110,132),h.closePath(),h.fill(),h.fillStyle="rgba(10,12,16,.85)",h.beginPath(),h.moveTo(60,158),h.lineTo(990,158),h.lineTo(1e3,146),h.lineTo(80,150),h.closePath(),h.fill(),h.font='italic 900 78px "Arial Black", Arial, sans-serif',h.textAlign="center",h.textBaseline="middle",h.lineJoin="round",h.lineWidth=12,h.strokeStyle=o,h.strokeText(e.team,512,72,440),h.fillStyle=r,h.fillText(e.team,512,72,440),h.font="italic 800 26px Arial, sans-serif";for(let[g,x]of[[150,e.sponsor],[880,e.sponsor2]]){let p=Math.min(200,h.measureText(x).width+26);h.fillStyle="rgba(10,12,16,.8)",h.fillRect(g-p/2,46,p,40),h.fillStyle="#fff",h.fillText(x,g,67,190)}}),l=Zn(256,256,(h,f,d)=>{h.clearRect(0,0,f,d),h.fillStyle="#ffffff",h.strokeStyle="#0c0e12",h.lineWidth=10,h.beginPath(),h.arc(128,128,104,0,Math.PI*2),h.fill(),h.stroke(),h.fillStyle="#0c0e12",h.font='italic 900 128px "Arial Black", Arial, sans-serif',h.textAlign="center",h.textBaseline="middle",h.fillText(String(e.num),126,136,180)});c.userData.keep=l.userData.keep=!0;let u={side:c,hood:l};return d0.set(t,u),u}function xo(n,e){let t=bw(n),i=JSON.stringify(e)+t.team+t.num;if(i===n.lookKey&&n.model)return;let s=n.model&&n.model.G.position.clone();n.model&&(Gt.remove(n.model.G),yw(n.model)),n.model=_w(e,t),n.model.wearU.wearAmt.value=n.wear=ky(n),n.lookKey=i,n.look=e,Gt.add(n.model.G),s&&n.model.G.position.copy(s)}function Lf(n,e,t){e=(e+Re)%Re,n.x=ut[e]+wn[e]*t,n.z=ht[e]+An[e]*t,n.h=Xt[e],n.idx=e,n.mi=e,n.sc=!1,n.si=0,n.y=Math.max(St(n.x,n.z),-.55),n.gPrev=n.y,n.vx=n.vz=n.vy=0,n.vf=n.vl=0,n.steer=0,n.grounded=!0,n.air=0,n.up.set(0,1,0)}var sn="solo",wt=[],Df=!1,dl=Xn.get("ccr_split","lr"),P0=0,gr=0,ot="menu",M0=0,b0=9,vl=!1,p0=0;function Sl(){Ht.forEach((n,e)=>{Lf(n,Re-7-7*(e>>1),e%2?-3.6:3.6),n.dist=n.idx-Re,n.lap=-1,n.finished=!1,n.finishT=0,n.bestLap=0,n.coins=0,n.nitro=.5,n.boostT=0,n.lane=n.laneTarget=e%2?-3.6:3.6,n.laneT=2+pf()*3,n.wrongT=0,n.drift=0,n.auto=K_&&n.ctrl==="local",n.net=null,n.reward=null,n.spin=0,n.model&&(Sy(n.model.wearU),n.model.wearU.wearAmt.value=n.wear=ky(n))}),fr.forEach(n=>n.t=0),P0=0,gr=0,_y(),Jm(qt),Ht.forEach(n=>n.marks=null)}var ba=n=>n.ctrl==="local"||n.ctrl==="remote"&&!n.bot,il={throttle:0,steer:0,hand:!1,nitro:!1};function Ew(n,e,t){let i=Math.hypot(n.vx,n.vz),s=(n.idx+Math.floor(7+i*.42))%Re;n.laneT-=e,n.laneT<0&&(n.laneT=2+pf()*4,n.laneTarget=(pf()*2-1)*5.5),n.lane+=(n.laneTarget-n.lane)*e*.7;let r=ut[s]+wn[s]*n.lane,o=ht[s]+An[s]*n.lane;if(n.sc&&gt){let l=Math.min(gt.M-1,n.si+Math.floor(6+i*.3));r=gt.X[l],o=gt.Z[l]}let a=dr(Math.atan2(r-n.x,o-n.z)-n.h);t.steer=Nt(a*2.4,-1,1);let c=999;for(let l=0;l<54;l+=3){let u=ff[(n.idx+l)%Re]*(.94+n.base*.1)*n.st.top,h=Math.sqrt(u*u+56*l*Ls);h<c&&(c=h)}t.throttle=ot==="race"||ot==="finish"?i<c?1:i>c+4?-1:0:0,t.hand=!1,t.nitro=!1}function by(n,e,t){let i=n.st,s=Math.sin(n.h),r=Math.cos(n.h),o=n.vx*s+n.vz*r,a=n.vx*r-n.vz*s;n.surf=oy(n.x,n.z);let c=n.air<.1;n.ctrl==="local"&&!n.auto&&!n.finished&&(e.nitro&&n.nitro>0&&ot==="race"&&(n.nitro=Math.max(0,n.nitro-i.burn*t),n.boostT=Math.max(n.boostT,.12)),e.hand&&c&&Math.abs(a)>3.5&&o>12?n.drift+=t:(n.drift>i.driftT&&!e.hand&&(n.boostT=Math.max(n.boostT,Math.min(1.6,n.drift*i.drift)),Xi.boost(),uo(n.view,"DRIFT BOOST!",.6,!0)),e.hand||(n.drift=0)));let u=n.boostT>0;n.boostT=Math.max(0,n.boostT-t);let h=mf*n.skill*i.top*(u?i.boost:1);if(c){e.throttle>0?o+=Y_*i.acc*(u?1.9:1)*e.throttle*Math.max(0,1-o/h)*t:e.throttle<0?o>.5?o-=38*t:o-=14*t*Math.max(0,1+o/13):o-=o*.55*t,u&&o<h&&(o+=10*t);let _=n.gPrev<-.12?.1*i.off:0;o-=o*(.12+.7*n.off*i.off+_)*t,o>h&&(o-=(o-h)*1.2*t),a*=Math.exp(-(e.hand?2.1:9*i.grip*n.surf)*t),e.hand&&(o-=o*.3*t)}n.steer+=(e.steer-n.steer)*Math.min(1,t*7),n.h+=n.steer*2.15*i.grip*Nt(o/10,-1,1)/(1+Math.abs(o)/75)*(e.hand?1.5/i.grip:1)*(c?1:.2)*t,n.vx=s*o+r*a,n.vz=r*o-s*a,n.vf=o,n.vl=a,n.x+=n.vx*t,n.z+=n.vz*t;let f=n.idx,d=n.sc,g=uy(n,n.ctrl==="local");n.sc&&!d&&n.view&&!n.auto&&(uo(n.view,"\u{1F6A7} SECRET BYPASS!",1.1,!0),Xi.boost());let x=n.idx-f;x>Re/2&&(x-=Re),x<-Re/2&&(x+=Re),n.dist+=x;let p=g.nx,m=g.nz,y=g.wall,v=g.hd,S=(n.x-g.px)*p+(n.z-g.pz)*m;if(Math.abs(S)>y){let _=Math.sign(S),b=S-_*y;n.x-=p*b,n.z-=m*b,S=_*y;let R=n.vx*p+n.vz*m;R*_>0&&(Math.abs(R)>6&&Nf(n,n.x+p*_*1.15,n.y+.8,n.z+m*_*1.15,-p*_,-m*_,(Math.abs(R)-6)/16),n.vx-=p*R*1.25,n.vz-=m*R*1.25,n.vx*=.99,n.vz*=.99);let I=Math.abs(dr(n.h-v))<Math.PI/2?v:v+Math.PI;n.h+=dr(I-n.h)*Math.min(1,5*t)}n.lat=S,n.off=Nt((Math.abs(S)-g.rw-.5)/3.5,0,1);let T=Math.max(St(n.x,n.z),-.55);n.y<=T+.02?(n.vy=Nt((T-n.gPrev)/t,-40,26),n.y=T,!n.grounded&&n.air>.25&&Ty(n),n.grounded=!0,n.air=0):(n.vy-=$_*t,n.y+=n.vy*t,n.y<=T?(n.y=T,n.vy=0,n.air>.25&&Ty(n),n.grounded=!0,n.air=0):(n.grounded=!1,n.air+=t)),n.gPrev=T;for(let _ of Kc)!n.sc&&Math.abs(_.i-n.idx)<4&&Math.abs(_.lat-S)<3&&n.grounded&&n.boostT<1&&(n.boostT=1.6,n.view&&(Xi.boost(),uo(n.view,"BOOST!",.6,!0)));let M=Math.floor(n.dist/Re);if(M>n.lap&&!n.finished){if(n.lap>=0){let _=gr-n.lapStart;(!n.bestLap||_<n.bestLap)&&(n.bestLap=_)}n.lap=M,n.lapStart=gr,n.lap>=Qc?(n.finished=!0,n.finishT=gr,P0++,n.ctrl==="local"&&Uw(n)):n.view&&n.lap>0&&uo(n.view,n.lap===Qc-1?"FINAL LAP!":"LAP "+(n.lap+1),1.4,!0)}}function Ty(n){for(let e=0;e<14;e++)qy(n,!0);n.view&&(n.view.shake=.35)}var oo=new D;function Nf(n,e,t,i,s,r,o){if(n.hitT>0||!n.model)return;o=Nt(o,0,1),n.hitT=.28,xy(e,t,i,s,r,o,n.look?n.look.paint:13421772,ai.dust);let a=ai.dust;for(let c=0;c<6+10*o;c++)Uf(e,t-.4,i,s*3+(Math.random()-.5)*5,1+Math.random()*3,r*3+(Math.random()-.5)*5,.8+Math.random()*.6,.7+Math.random()*.6,a[0],a[1],a[2],.35);if(n.model.dmgRoot&&(n.model.dmgRoot.updateWorldMatrix(!0,!1),oo.set(e,t,i),n.model.dmgRoot.worldToLocal(oo),oo.set(Nt(oo.x,-.95,.95),Nt(oo.y,.8,1.9),Nt(oo.z,-1.9,1.75)),My(n.model.wearU,oo,.35+.65*o)),n.view&&(n.view.shake=Math.max(n.view.shake,.3+.9*o),Xi.crash(o),Xe.on&&navigator.vibrate))try{navigator.vibrate(15+Math.round(45*o))}catch{}}var Ri=n=>Math.round(n*100)/100;function Ey(n){return[n.k,Ri(n.x),Ri(n.y),Ri(n.z),Ri(n.h),Ri(n.vx),Ri(n.vy),Ri(n.vz),Ri(n.vf),Ri(n.vl),Ri(n.steer),n.dist,n.boostT>0?1:0,n.finished?Ri(n.finishT):0,n.coins,Ri(n.bestLap)]}function wy(n){let e=Ht[n[0]];!e||e.ctrl!=="remote"||!Array.isArray(n)||(e.net={x:+n[1],y:+n[2],z:+n[3],h:+n[4],vx:+n[5],vy:+n[6],vz:+n[7],t:performance.now()},e.vf=+n[8],e.vl=+n[9],e.steer=+n[10],e.dist=+n[11],e.boostT=n[12]?.15:0,e.coins=n[14]|0,e.bestLap=+n[15]||0,e.lap=Math.floor(e.dist/Re),n[13]&&!e.finished&&(e.finished=!0,e.finishT=+n[13],P0++))}function ww(n,e){let t=n.net;if(!t)return;let i=Math.min(.3,(performance.now()-t.t)/1e3),s=t.x+t.vx*i,r=t.z+t.vz*i,o=t.y+t.vy*i;Math.hypot(s-n.x,r-n.z)>18&&(n.x=s,n.z=r,n.y=o,n.h=t.h);let a=Math.min(1,e*12);n.x+=(s-n.x)*a,n.z+=(r-n.z)*a,n.y+=(Math.max(o,St(n.x,n.z))-n.y)*a,n.h+=dr(t.h-n.h)*a,n.vx=t.vx,n.vz=t.vz,n.vy=t.vy;let c=Math.max(St(n.x,n.z),-.55);n.y=Math.max(n.y,c),n.grounded=n.y<c+.25,n.air=n.grounded?0:n.air+e,n.gPrev=c,n.idx=el(n.x,n.z,n.idx,30)}var Yi=1400,fo=new Float32Array(Yi*3),ul=new Float32Array(Yi*4),T0=new Float32Array(Yi),co=new Float32Array(Yi*3),Af=new Float32Array(Yi),Hy=new Float32Array(Yi),Gy=new Float32Array(Yi),Vy=new Float32Array(Yi),m0=0,Wy=new Uint8Array(Yi),po=new mt;po.setAttribute("position",new $e(fo,3));po.setAttribute("aColor",new $e(ul,4));po.setAttribute("aSize",new $e(T0,1));var Xy=new zt({transparent:!0,depthWrite:!1,uniforms:{uScale:{value:600}},vertexShader:"attribute vec4 aColor; attribute float aSize; uniform float uScale; varying vec4 vC; void main(){ vC=aColor; vec4 mv=modelViewMatrix*vec4(position,1.); vC.a*=smoothstep(2.5,7.,-mv.z); gl_PointSize=min(aSize*uScale/max(-mv.z,0.1),160.); gl_Position=projectionMatrix*mv; }",fragmentShader:"varying vec4 vC; void main(){ float r=length(gl_PointCoord-0.5); float a=smoothstep(0.5,0.12,r)*vC.a; if(a<0.004) discard; gl_FragColor=vec4(vC.rgb,a); }"}),I0=new yi(po,Xy);I0.frustumCulled=!1;I0.renderOrder=5;Gt.add(I0);function Uf(n,e,t,i,s,r,o,a,c,l,u,h,f=0){let d=m0;Wy[d]=f,m0=(m0+1)%Yi,fo[d*3]=n,fo[d*3+1]=e,fo[d*3+2]=t,co[d*3]=i,co[d*3+1]=s,co[d*3+2]=r,Af[d]=Hy[d]=o,Gy[d]=a,Vy[d]=h,ul[d*4]=c,ul[d*4+1]=l,ul[d*4+2]=u}function qy(n,e){let t=Math.sin(n.h),i=Math.cos(n.h),s=(Math.random()<.5?-1:1)*1.05,r=n.x-t*1.3+i*s,o=n.z-i*1.3-t*s,a=n.gPrev<-.08,c=e?5:2.5,l=ai.dust;a?Uf(r,.15,o,-n.vx*.12+(Math.random()-.5)*5,3.5+Math.random()*5,-n.vz*.12+(Math.random()-.5)*5,.7+Math.random()*.4,.5+Math.random()*.6,.92,1,1,.75,1):Uf(r,n.y+.25,o,n.vx*.12+(Math.random()-.5)*c,.8+Math.random()*2.2,n.vz*.12+(Math.random()-.5)*c,.7+Math.random()*.6,.5+Math.random()*.5,l[0],l[1],l[2],(e?.3:.16)*(ai.id==="snow"?1.8:1))}function Aw(n){for(let e=0;e<Yi;e++){if(Af[e]<=0){T0[e]=0;continue}Af[e]-=n;let t=1-Af[e]/Hy[e],i=Wy[e];co[e*3+1]-=(i?14:1.2)*n,fo[e*3]+=co[e*3]*n,fo[e*3+1]+=co[e*3+1]*n,fo[e*3+2]+=co[e*3+2]*n,T0[e]=Gy[e]*(1+t*(i?1.2:3.2)),ul[e*4+3]=Vy[e]*(1-t)*Math.min(1,t*8)}po.attributes.position.needsUpdate=po.attributes.aColor.needsUpdate=po.attributes.aSize.needsUpdate=!0}var Ye=null,xr=!1,ks=null,lo=!0,Os,rl,ol,al,ao,cl,hl;function Vf(){if(!Ye)try{Ye=new(window.AudioContext||window.webkitAudioContext),Os=Ye.createGain(),Os.gain.value=.6,Os.connect(Ye.destination),ao=Ye.createBiquadFilter(),ao.type="lowpass",ao.frequency.value=500,al=Ye.createGain(),al.gain.value=0,ao.connect(al),al.connect(Os),rl=Ye.createOscillator(),rl.type="sawtooth",ol=Ye.createOscillator(),ol.type="square";let n=Ye.createGain();n.gain.value=.5,rl.connect(ao),ol.connect(n),n.connect(ao),rl.start(),ol.start(),hl=Ye.createBuffer(1,Ye.sampleRate*2,Ye.sampleRate);let e=hl.getChannelData(0);for(let s=0;s<e.length;s++)e[s]=Math.random()*2-1;let t=Ye.createBufferSource();t.buffer=hl,t.loop=!0;let i=Ye.createBiquadFilter();i.type="bandpass",i.frequency.value=900,i.Q.value=.4,cl=Ye.createGain(),cl.gain.value=0,t.connect(i),i.connect(cl),cl.connect(Os),t.start(),ks=xm(Ye,Os),ks.setTheme(qt),_r()}catch{Ye=null}}function Ns(n,e,t,i="sine",s=.2){if(!Ye||xr)return;let r=Ye.createOscillator(),o=Ye.createGain(),a=Ye.currentTime;r.type=i,r.frequency.setValueAtTime(n,a),r.frequency.exponentialRampToValueAtTime(e,a+t),o.gain.setValueAtTime(s,a),o.gain.exponentialRampToValueAtTime(.001,a+t),r.connect(o),o.connect(Os),r.start(a),r.stop(a+t+.02)}var Xi={coin(){Ns(1250,1300,.07,"square",.07),setTimeout(()=>Ns(1880,1900,.16,"square",.07),60)},beep(n){Ns(n?980:490,n?980:490,n?.6:.22,"square",.12)},boost(){if(!Ye||xr)return;let n=Ye.createBufferSource(),e=Ye.createBiquadFilter(),t=Ye.createGain(),i=Ye.currentTime;n.buffer=hl,e.type="bandpass",e.Q.value=1.2,e.frequency.setValueAtTime(300,i),e.frequency.exponentialRampToValueAtTime(3200,i+.5),t.gain.setValueAtTime(.35,i),t.gain.exponentialRampToValueAtTime(.001,i+.8),n.connect(e),e.connect(t),t.connect(Os),n.start(i),n.stop(i+.85)},win(){[523,659,784,1047].forEach((n,e)=>setTimeout(()=>Ns(n,n,.3,"triangle",.16),e*130))},buy(){[660,880,1320].forEach((n,e)=>setTimeout(()=>Ns(n,n*1.01,.12,"square",.06),e*70))},crash(n){if(!Ye||xr)return;let e=Ye.currentTime,t=Ye.createBufferSource(),i=Ye.createBiquadFilter(),s=Ye.createGain();t.buffer=hl,i.type="lowpass",i.frequency.setValueAtTime(5e3,e),i.frequency.exponentialRampToValueAtTime(300,e+.35),s.gain.setValueAtTime(.25+.45*n,e),s.gain.exponentialRampToValueAtTime(.001,e+.45),t.connect(i),i.connect(s),s.connect(Os),t.start(e,Math.random()),t.stop(e+.5),Ns(90,40,.25,"sine",.35+.3*n);for(let r of[520,783,1170])Ns(r*(.9+Math.random()*.2),r*.8,.18+.2*n,"square",.03+.03*n)},ping(){Ns(880,1320,.18,"triangle",.14),setTimeout(()=>Ns(1320,1760,.22,"triangle",.12),160)}};function _r(){let n=lo&&!xr;ks&&(ks.setLevel(ot==="race"||ot==="countdown"||ot==="finish"?1:.7),ks.setOn(n));let e=lo?"\u{1F3B5} Music: ON":"\u{1F507} Music: OFF";for(let t of["musicBtn","musicHud"]){let i=_e(t);i&&(i.textContent=t==="musicHud"?n?"\u{1F3B5}":"\u{1F507}":e,i.classList.toggle("off",!n))}}function L0(){z0(),lo=!lo,Xn.set("ccr_music",lo),lo&&(xr=!1),_r()}function Rw(){if(ks&&ks.setLevel(ot==="race"||ot==="countdown"||ot==="finish"?1:.7),!Ye||!wt.length)return;let n=wt.reduce((c,l)=>Math.abs(l.car.vf)>Math.abs(c.vf)?l.car:c,wt[0].car),e=Math.abs(n.vf),t=Nt(e/(mf*1.3),0,1),i=Math.min(4,t*5|0),s=t*5-i,r=62+i*16+s*85+(n.boostT>0?30:0),o=Ye.currentTime;rl.frequency.setTargetAtTime(r,o,.05),ol.frequency.setTargetAtTime(r*.5,o,.05),ao.frequency.setTargetAtTime(380+t*1500,o,.08);let a=!xr&&(ot==="race"||ot==="countdown"||ot==="finish")?1:0;al.gain.setTargetAtTime(a*(.05+t*.05),o,.1),cl.gain.setTargetAtTime(a*t*t*.12,o,.15)}var _e=n=>document.getElementById(n),Fs=n=>String(n).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),wa=n=>{if(!n)return"\u2014";let e=n/60|0,t=n-e*60;return e+":"+(t<10?"0":"")+t.toFixed(1)},Wf=n=>["st","nd","rd"][n-1]||"th",go=n=>"#"+(n>>>0).toString(16).padStart(6,"0"),Cw={uniforms:{tDiffuse:{value:null}},vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }",fragmentShader:`uniform sampler2D tDiffuse; varying vec2 vUv;
    void main(){ vec3 c=texture2D(tDiffuse,vUv).rgb; float l=dot(c,vec3(.2126,.7152,.0722));
      float sat=max(c.r,max(c.g,c.b))-min(c.r,min(c.g,c.b));
      c=mix(vec3(l),c,1.28+0.12*(1.-sat)); c=(c-0.5)*1.09+0.5;
      c*=mix(1.,0.82,smoothstep(0.45,0.95,length(vUv-0.5)*1.25));
      gl_FragColor=vec4(clamp(c,0.,1.),1.); }`},D0={high:{label:"High",pr:2,fps:0,menuFps:60,bloom:!0,shadow:2048},balanced:{label:"Balanced",pr:1.5,fps:60,menuFps:30,bloom:!0,shadow:2048},eco:{label:"Eco",pr:1,fps:60,menuFps:30,bloom:!1,shadow:1024}},Rf=D0[Ea("ccr_quality","balanced")]?Ea("ccr_quality","balanced"):"balanced",pl=()=>D0[Rf];function Yy(){let n=pl();cn.shadow.mapSize.x!==n.shadow&&(cn.shadow.mapSize.set(n.shadow,n.shadow),cn.shadow.map&&(cn.shadow.map.dispose(),cn.shadow.map=null)),In.shadowMap.type=n.shadow<2048?zr:Zo;for(let t of Pi)t.bloom.enabled=n.bloom;let e=_e("qualBtn");e&&(e.textContent="\u2699\uFE0F Graphics: "+n.label),Xf()}function Pw(){let n=Object.keys(D0);Rf=n[(n.indexOf(Rf)+1)%n.length],Xn.set("ccr_quality",Rf),Yy()}var Iw=`<div class="tl hud"><div class="panel"><div class="lbl">POSITION</div><div class="posBox"><span class="pos">6</span><small class="suf">th</small><span class="tot">/ 6</span></div></div>
  <div class="panel"><div class="lbl">LAP</div><div class="val"><span class="lap">1</span> / ${Qc}</div></div></div>
  <div class="tr hud"><div class="panel coinsBox"><div class="lbl">COINS</div><div class="val">\u25CF <span class="coins">0</span></div></div><div class="panel"><div class="lbl">TIME</div><div class="val time">0:00.0</div></div></div>
  <div class="bl hud panel"><canvas class="mini" width="336" height="336"></canvas></div>
  <div class="br hud panel"><div><span class="speed">0</span><span class="speedUnit">KM/H</span></div><div class="lbl" style="margin-top:6px">NITRO</div><div class="nitro"><div class="nitroFill"></div></div></div>
  <div class="wrong hud">\u27F2 WRONG WAY</div><div class="ptag hud"></div><div class="center hud"></div>`;function Ay(n,e){let t=new Eh(In,new tn(4,4,{type:pn,samples:4})),i=new la(new Ee(256,256),.25,.6,1.05);i.enabled=pl().bloom,t.addPass(new wh(Gt,e)),t.addPass(i),t.addPass(new Ah),t.addPass(new ca(Cw));let s=document.createElement("div");s.className="phud",s.innerHTML=Iw,_e("huds").appendChild(s);let r=a=>s.querySelector(a),o=r(".mini");return{i:n,cam:e,composer:t,bloom:i,el:s,car:null,camH:0,snap:!0,shake:0,rect:{x:0,y:0,w:1,h:1},flashT:0,sized:"",hud:{pos:r(".pos"),suf:r(".suf"),lap:r(".lap"),time:r(".time"),coins:r(".coins"),speed:r(".speed"),nitro:r(".nitroFill"),wrong:r(".wrong"),center:r(".center"),tag:r(".ptag"),mctx:o.getContext("2d")}}}var Pi=[Ay(0,Z_),Ay(1,new Qt(62,1,.3,7e3))];function uo(n,e,t,i){n&&(n.hud.center.textContent=e,n.hud.center.className="center hud show"+(i?" small":""),n.flashT=t)}var Of=document.createElement("canvas");Of.width=Of.height=336;var $y=336/640,Ff=n=>168+n*$y,Bf=n=>168+n*$y;function N0(){let n=Of.getContext("2d");n.clearRect(0,0,336,336),n.lineJoin=n.lineCap="round";let e=()=>{n.beginPath();for(let t=0;t<=Re;t+=4)n.lineTo(Ff(ut[t%Re]),Bf(ht[t%Re]));n.closePath()};n.strokeStyle="rgba(0,25,70,.6)",n.lineWidth=15,e(),n.stroke(),n.strokeStyle="#fff",n.lineWidth=8,e(),n.stroke(),n.fillStyle="#111",n.save(),n.translate(Ff(ut[0]),Bf(ht[0])),n.rotate(-Xt[0]),n.fillRect(-10,-2.5,20,5),n.restore()}N0();var Ry=[0,1].map(()=>{let n=new Br(16773590,0,75,.52,.55,1.4);return Gt.add(n,n.target),n}),E0=0;function Lw(){E0=mo?260:0}function Dw(n,e){if(Ry.forEach((r,o)=>{r.intensity=o===n&&e?E0:0}),!e||!E0)return;let t=Ry[n],i=Math.sin(e.h),s=Math.cos(e.h);t.position.set(e.x+i*1.9,e.y+1.5,e.z+s*1.9),t.target.position.set(e.x+i*22,e.y-.5,e.z+s*22),t.target.updateMatrixWorld()}function Ky(){return Ht.slice().sort((n,e)=>n.finished&&e.finished?n.finishT-e.finishT:n.finished?-1:e.finished?1:e.dist-n.dist)}var U0=()=>sn==="split"&&ot!=="menu"?2:1;function Xf(){let n=innerWidth,e=innerHeight,t=Math.min(devicePixelRatio,pl().pr),i=U0();In.setPixelRatio(t),In.setSize(n,e,!1);let s=i===1?[{x:0,y:0,w:n,h:e}]:dl==="tb"?[{x:0,y:0,w:n,h:Math.floor(e/2)},{x:0,y:Math.floor(e/2),w:n,h:e-Math.floor(e/2)}]:[{x:0,y:0,w:Math.floor(n/2),h:e},{x:Math.floor(n/2),y:0,w:n-Math.floor(n/2),h:e}];Pi.forEach((r,o)=>{let a=s[o];if(r.el.style.display=a?"":"none",!a)return;r.rect=a;let c=a.w+"x"+a.h+"@"+t;r.sized!==c&&(r.composer.setPixelRatio(t),r.composer.setSize(a.w,a.h),r.sized=c),r.cam.aspect=a.w/a.h,r.cam.updateProjectionMatrix(),Object.assign(r.el.style,{left:a.x+"px",top:a.y+"px",width:a.w+"px",height:a.h+"px"}),r.el.classList.toggle("compact",i>1&&(a.w<900||a.h<560))}),_e("divider").className=i>1?"on "+dl:""}addEventListener("resize",Xf);var g0=0;function Nw(n){for(let t of Pi)t.flashT>0&&(t.flashT-=n,t.flashT<=0&&(t.hud.center.className="center hud"));if(g0-=n,g0>0)return;g0=.05;let e=Ky();for(let t=0;t<U0();t++){let i=Pi[t],s=i.car,r=i.hud;if(!s)continue;let o=e.indexOf(s)+1;r.pos.textContent=o,r.suf.textContent=Wf(o),r.lap.textContent=Nt(s.lap+1,1,Qc),r.time.textContent=wa(gr)==="\u2014"?"0:00.0":wa(gr),r.speed.textContent=Math.round(Math.abs(s.vf)*3.6),r.nitro.style.width=s.nitro*100+"%",r.coins.textContent=s.coins,r.wrong.style.display=s.wrongT>1.2&&ot==="race"?"block":"none";let a=r.mctx;a.clearRect(0,0,336,336),a.drawImage(Of,0,0);for(let c of Ht)c!==s&&(a.beginPath(),a.arc(Ff(c.x),Bf(c.z),ba(c)?9.5:7,0,6.3),a.fillStyle=go(c.look.paint),a.fill(),a.lineWidth=ba(c)?3:2,a.strokeStyle=ba(c)?"#ffd23a":"#fff",a.stroke());a.beginPath(),a.arc(Ff(s.x),Bf(s.z),12,0,6.3),a.fillStyle=go(s.look.paint),a.fill(),a.lineWidth=4,a.strokeStyle="#fff",a.stroke()}}var Ge=null;function Ml(){sn="solo",Ht.forEach((n,e)=>{n.ctrl=e===5?"local":"ai",n.bot=e!==5,n.prof=e===5?Ge:null,n.name=e===5?Ge.nick:fl[e],n.st=e===5?Gf(Ge):_l,n.view=null,xo(n,e===5?yr(Ge):C0(e))}),wt=[{car:Ht[5],prof:Ge,pi:0}],O0()}function Zy(n){Ml(),sn="split";let e=Ht[4];e.ctrl="local",e.bot=!1,e.prof=n,e.name=n.nick,e.st=Gf(n),xo(e,yr(n)),wt.push({car:e,prof:n,pi:1}),O0()}function O0(){Pi.forEach((n,e)=>{n.car=wt[e]?wt[e].car:null,n.car&&(n.car.view=n),n.snap=!0,n.hud.tag.textContent=wt[e]?(sn==="split"?`P${e+1} \xB7 `:"")+wt[e].prof.nick:"",n.hud.tag.style.display=sn==="split"?"":"none"})}function bl(){z0(),Sl(),ot="countdown",M0=3.6,Xe.tiltOk&&jy(),b0=9,vl=!1,_e("menu").classList.add("hide"),_e("finish").classList.add("hide"),_e("huds").classList.add("on"),Pi.forEach(n=>{n.snap=!0,n.cam.clearViewOffset()}),Xf(),sn!=="online"&&xt&&xt.setStatus("racing")}function Uw(n){n.auto=!0;let e=Ht.filter(u=>u.finished&&u.finishT<=n.finishT).length,t=n.prof,i=sn==="online"?Ht.filter(u=>u!==n&&ba(u)&&!(u.finished&&u.finishT<n.finishT)).length:0,s=vw[e-1]||0,r=i*15,o=n.coins+s+r;n.reward={place:e,collected:n.coins,bonus:s,online:r,total:o},t.coins+=o,t.earned+=o,t.races++,e===1&&t.wins++;let a=t.tb||(t.tb={}),c=a[qt]||(qt==="beach"&&t.best?[t.best,t.lap||0]:[0,0]);a[qt]=[!c[0]||n.finishT<c[0]?n.finishT:c[0],n.bestLap&&(!c[1]||n.bestLap<c[1])?n.bestLap:c[1]],qt==="beach"&&(t.best=a.beach[0],t.lap=a.beach[1]),t.ts=Date.now(),R0();let l=yl(t);Aa([l]),xt&&xt.reportStat(l),uo(n.view,e===1?"WINNER!":`${e}${Wf(e)}!`,2,!1),e===1&&Xi.win(),wt.every(u=>u.car.finished)&&(ot="finish",setTimeout(Ow,2200))}function Ow(){vl=!0,Jy();let n=wt.length===1?wt[0].car.reward.place:0;_e("finTitle").innerHTML=sn==="split"?(()=>{let e=wt.slice().sort((t,i)=>t.car.reward.place-i.car.reward.place)[0];return`${Fs(e.prof.nick)} <span>WINS!</span>`})():n===1?"YOU <span>WIN!</span>":`${n}${Wf(n)} <span>PLACE</span>`,_e("againBtn").style.display=sn==="online"?"none":"",_e("menuBtn").textContent=sn==="online"?"BACK TO LOBBY":"MENU",_e("finish").classList.remove("hide"),_e("huds").classList.remove("on")}function Jy(){let e=Ky().map((t,i)=>`<div class="row ${t.ctrl==="local"?"me":""}"><span>${i+1}. <i class="dot" style="background:${go(t.look.paint)}"></i>${Fs(t.name)}${ba(t)&&t.ctrl!=="local"?" <em>racer</em>":""}</span><span>${t.finished?wa(t.finishT):t.ctrl==="remote"&&!t.bot?"racing\u2026":"\u2014"}</span></div>`).join("");for(let t of wt){let i=t.car.reward;i&&(e+=`<div class="earn"><b>${Fs(t.prof.nick)}</b> earned <span class="gold">\u25CF ${i.total}</span><small>${i.collected} collected + ${i.bonus} for ${i.place}${Wf(i.place)}${i.online?` + ${i.online} for beating racers`:""} \xB7 best lap ${wa(t.car.bestLap)} \xB7 wallet \u25CF ${t.prof.coins}</small></div>`)}_e("results").innerHTML=e}function Fw(){let n=sn==="online";n&&xt&&xt.closeRoom(),vl=!1,_e("finish").classList.add("hide"),_e("huds").classList.remove("on"),Ml(),Sl(),ot="menu",Xf(),xt&&xt.setStatus("idle"),Ii(n?"scrOnline":"scrMain")}_e("againBtn").onclick=()=>bl();_e("menuBtn").onclick=Fw;var ml={},x0={solo:{up:["KeyW","ArrowUp"],down:["KeyS","ArrowDown"],left:["KeyA","ArrowLeft"],right:["KeyD","ArrowRight"],drift:["Space"],nitro:["ShiftLeft","ShiftRight"]},p1:{up:["KeyW"],down:["KeyS"],left:["KeyA"],right:["KeyD"],drift:["Space"],nitro:["ShiftLeft"]},p2:{up:["ArrowUp"],down:["ArrowDown"],left:["ArrowLeft"],right:["ArrowRight"],drift:["Period","Numpad0"],nitro:["Slash","ShiftRight","NumpadEnter"]}},Bw=()=>{let n=document.activeElement;return n&&(n.tagName==="INPUT"||n.tagName==="TEXTAREA")};addEventListener("keydown",n=>{Bw()||(ml[n.code]=!0,["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space","Slash"].includes(n.code)&&n.preventDefault(),n.code==="KeyM"&&(xr=!xr,_r()),n.code==="KeyN"&&L0(),ot==="race"&&(n.code==="KeyR"&&wt[0]&&Lf(wt[0].car,wt[0].car.idx,0),n.code==="Backspace"&&wt[1]&&Lf(wt[1].car,wt[1].car.idx,0)),n.code==="Escape"&&ot==="menu"&&Ii("scrMain"))});addEventListener("keyup",n=>{ml[n.code]=!1});addEventListener("blur",()=>{for(let n in ml)ml[n]=!1});var Xe={l:0,r:0,b:0,n:0,d:0,on:!1,tilt:Ea("ccr_tilt",!0),tiltOk:!1,asked:!1,raw:0,zero:0,steer:0,lastEv:0},mr=Math.PI/180;function kw(n){if(n.beta==null||n.gamma==null)return;let e=n.beta*mr,t=n.gamma*mr,i=-Math.sin(t)*Math.cos(e),s=Math.sin(e),r=(((Qn.orientation&&Qn.orientation.angle!=null?Qn.orientation.angle:window.orientation)||0)%360+360)%360,o=r===90?-s:r===270?s:r===180?-i:i;Xe.raw=Math.asin(Nt(o,-1,1))/mr,Xe.lastEv=performance.now(),Xe.tiltOk||(Xe.tiltOk=!0,Xe.zero=Xe.raw,kf())}function Mf(){if(Xe.asked||Xe.granted)return;let n=window.DeviceOrientationEvent,e=()=>{Xe.granted=!0,addEventListener("deviceorientation",kw)};if(n){if(typeof n.requestPermission!="function")return e();Xe.asked=!0,n.requestPermission().then(t=>{Xe.asked=!1,t==="granted"?e():(Xe.tilt=!1,kf(),qi("Tilt not allowed \u2014 using \u25C0 \u25B6 buttons"))}).catch(()=>{Xe.asked=!1})}}var jy=()=>{Xe.zero=Xe.raw};function kf(){if(!Xe.on)return;let n=Xe.tilt&&Xe.tiltOk;_e("touch").classList.toggle("tilt",n);let e=_e("tiltBtn");e&&(e.textContent=Xe.tilt?"\u{1F4F1} Tilt steering: ON":"\u{1F4F1} Tilt steering: OFF (buttons)")}if("ontouchstart"in window||navigator.maxTouchPoints>0&&matchMedia("(pointer:coarse)").matches||/[?&]touch=1/.test(location.search)){Xe.on=!0,document.body.classList.add("touchui");for(let[r,o]of[["tL","l"],["tR","r"]]){let a=_e(r);a.addEventListener("touchstart",l=>{l.preventDefault(),Xe[o]=1,a.classList.add("on")},{passive:!1});let c=l=>{l.preventDefault(),Xe[o]=0,a.classList.remove("on")};a.addEventListener("touchend",c),a.addEventListener("touchcancel",c)}let n=_e("dial"),e=(r,o,a,c)=>{let l=(u,h)=>`${(100+Math.cos(u*mr)*h).toFixed(2)} ${(100+Math.sin(u*mr)*h).toFixed(2)}`;return`M${l(r,c)} A${c} ${c} 0 0 1 ${l(o,c)} L${l(o,a)} A${a} ${a} 0 0 0 ${l(r,a)} Z`},t=[["n",-150,-30,"NITRO","\u{1F525}"],["b",-30,90,"BRAKE","\u23EA"],["d",90,210,"DRIFT","\u{1F300}"]];n.innerHTML=`<svg viewBox="0 0 200 200">${t.map(([r,o,a,c,l])=>{let u=(o+a)/2,h=100+Math.cos(u*mr)*64,f=100+Math.sin(u*mr)*64;return`<path class="w w-${r}" d="${e(o+2,a-2,33,97)}"/><text x="${h}" y="${f-6}" class="ic">${l}</text><text x="${h}" y="${f+15}">${r==="b"?"BRAKE/REV":c}</text>`}).join("")}
    <circle cx="100" cy="100" r="29" class="hub"/><text x="100" y="98" class="hubt">AUTO</text><text x="100" y="112" class="hubt">GAS</text></svg>`;let i=r=>{r.preventDefault();let o=n.getBoundingClientRect(),a=o.left+o.width/2,c=o.top+o.height/2,l=o.width/2,u={n:0,b:0,d:0};for(let h of r.targetTouches){let f=h.clientX-a,d=h.clientY-c;if(Math.hypot(f,d)<l*.3)continue;let g=Math.atan2(d,f)/mr;g<-150&&(g+=360),u[g<-30?"n":g<90?"b":"d"]=1}for(let h of["n","b","d"])Xe[h]=u[h],n.querySelector(".w-"+h).classList.toggle("on",!!u[h])};for(let r of["touchstart","touchmove","touchend","touchcancel"])n.addEventListener(r,i,{passive:!1});_e("wheel").addEventListener("touchstart",r=>{r.preventDefault(),jy(),qi("Steering centred")},{passive:!1}),document.addEventListener("click",()=>{Xe.tilt&&Mf()},!0),document.addEventListener("touchend",()=>{Xe.tilt&&Mf()},!0),Xe.tilt&&typeof(window.DeviceOrientationEvent||{}).requestPermission!="function"&&Mf();let s=_e("tiltBtn");s&&(s.style.display="",s.onclick=()=>{Xe.tilt=!Xe.tilt,Xn.set("ccr_tilt",Xe.tilt),Xe.tilt&&Mf(),kf()}),kf()}var Cy=0;function zw(){let n=(navigator.getGamepads?[...navigator.getGamepads()]:[]).filter(Boolean);for(let e of wt){let t=e.inp||(e.inp={throttle:0,steer:0,hand:!1,nitro:!1}),i=sn==="split"?e.pi?x0.p2:x0.p1:x0.solo,s=u=>u.some(h=>ml[h]),r=s(i.down)?-1:s(i.up)?1:0,o=(s(i.left)?1:0)-(s(i.right)?1:0),a=s(i.drift),c=s(i.nitro),l=n[sn==="split"?e.pi:0];if(l){let u=f=>l.buttons[f]||{pressed:!1,value:0},h=l.axes[0]||0;Math.abs(h)>.14&&(o=-Math.sign(h)*Math.min(1,(Math.abs(h)-.14)/.8)),u(6).value>.2?r=-1:(u(7).value>.1||u(0).pressed)&&(r=Math.max(r,u(0).pressed?1:u(7).value)),a=a||u(2).pressed||u(5).pressed,c=c||u(1).pressed||u(4).pressed||u(3).pressed}if(sn!=="split"&&Xe.on){if(Xe.b?r=-1:r===0&&(r=1),Xe.tilt&&Xe.tiltOk){let u=Xe.raw-Xe.zero;u=Math.abs(u)<1.5?0:u-Math.sign(u)*1.5,Xe.steer=Nt(u/20,-1,1),o=Xe.steer;let h=Math.round(-Xe.steer*90);h!==Cy&&(Cy=h,_e("wheel").style.transform=`rotate(${h}deg)`)}else(Xe.l||Xe.r)&&(o=Xe.l-Xe.r);a=a||!!Xe.d,c=c||!!Xe.n}ot!=="race"&&(r=0,c=!1),t.throttle=r,t.steer=o,t.hand=a,t.nitro=c}}var Hw=["scrMain","scrNick","scrSplit","scrOnline","scrGarage","scrBoard"],Qn="scrMain",Ci=null;function Ii(n){Qn=n,Hw.forEach(e=>_e(e).classList.toggle("on",e===n)),_e("menu").classList.toggle("garage",n==="scrGarage"),_e("menu").classList.remove("hide"),n==="scrMain"&&Xw(),n==="scrGarage"&&tv(),n==="scrBoard"&&gl(),n==="scrOnline"&&us(),n==="scrNick"&&(_e("nickIn").value=Ge&&ho[Ge.nick.toLowerCase()]?Ge.nick:"",setTimeout(()=>_e("nickIn").focus(),50)),n!=="scrGarage"&&Ci&&Ci!==Ge&&(Ci=null),ot==="menu"&&wt[0]&&xo(wt[0].car,yr(n==="scrGarage"&&Ci?Ci:Ge))}function F0(){_e("trackSeg").innerHTML=tl.map(n=>{let e=Ds[n];return`<button class="${n===qt?"on":""}" data-t="${n}"><i>${e.icon}</i><b>${e.name}</b><small>${e.sub}</small></button>`}).join(""),document.querySelectorAll("#todSeg button").forEach(n=>n.classList.toggle("on",n.dataset.n==="1"===mo))}function B0(n,e){!tl.includes(n)||n===qt||(qt=n,e||Xn.set("ccr_track",n),xf(n),vf.mudCol.value.set(zy[n]),ks&&ks.setTheme(n),N0(),Sl(),Pi.forEach(t=>t.snap=!0),F0(),Qn==="scrBoard"&&gl(),Qn==="scrOnline"&&us())}function k0(n,e){n!==mo&&(mo=n,e||Xn.set("ccr_night",n),a0(n),F0(),Qn==="scrOnline"&&us())}lo=Xn.get("ccr_music",!0);_r();_e("musicBtn").onclick=L0;_e("qualBtn").onclick=Pw;_e("musicHud").onclick=n=>{n.stopPropagation(),L0()};var Us=null;function Gw(){let e=new ArrayBuffer(8864),t=new DataView(e),i=(s,r)=>{for(let o=0;o<r.length;o++)t.setUint8(s+o,r.charCodeAt(o))};return i(0,"RIFF"),t.setUint32(4,36+4410*2,!0),i(8,"WAVEfmt "),t.setUint32(16,16,!0),t.setUint16(20,1,!0),t.setUint16(22,1,!0),t.setUint32(24,44100,!0),t.setUint32(28,88200,!0),t.setUint16(32,2,!0),t.setUint16(34,16,!0),i(36,"data"),t.setUint32(40,4410*2,!0),URL.createObjectURL(new Blob([e],{type:"audio/wav"}))}var Vw=["touchend","click","keydown","pointerup"];function z0(){if(Vf(),!Ye)return;try{navigator.audioSession&&(navigator.audioSession.type="playback")}catch{}!navigator.audioSession&&!Us&&/iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent)&&navigator.maxTouchPoints>0&&(Us=document.createElement("audio"),Us.src=Gw(),Us.loop=!0,Us.setAttribute("playsinline",""),Us.volume=.01),Us&&Us.paused&&Us.play().catch(()=>{});let n=Ye.createBufferSource();n.buffer=Ye.createBuffer(1,1,22050),n.connect(Ye.destination),n.start(0),Ye.state!=="running"&&Ye.resume().then(_r,()=>{}),_r(),Ye.state==="running"&&qf(!1)}function qf(n){for(let e of Vw)(n?addEventListener:removeEventListener)(e,z0,!0)}qf(!0);addEventListener("pointerdown",()=>Vf(),{capture:!0,once:!0});document.addEventListener("visibilitychange",()=>{!Ye||document.hidden||Ye.state!=="running"&&(Ye.resume().then(_r,()=>{}),qf(!0))});var Ww=setInterval(()=>{Ye&&(clearInterval(Ww),Ye.addEventListener("statechange",()=>{Ye.state!=="running"?qf(!0):_r()}))},500);_e("trackSeg").addEventListener("click",n=>{let e=n.target.closest("[data-t]");e&&(Vf(),B0(e.dataset.t))});document.querySelectorAll("#todSeg button").forEach(n=>n.onclick=()=>k0(n.dataset.n==="1"));function Xw(){F0(),Ge&&(_e("nickLbl").textContent=Ge.nick,_e("walletLbl").textContent=Ge.coins,_e("statsLbl").textContent=`${Ge.wins} wins \xB7 ${Ge.races} races`)}document.querySelectorAll("[data-go]").forEach(n=>n.addEventListener("click",()=>{Vf(),Ii(n.dataset.go)}));var Yf=/^[A-Za-z0-9_\- ]{2,14}$/;function Qy(n){let e=n.trim().replace(/\s+/g," ");return Yf.test(e)?(Ge=Hf(e),Xn.set("ccr_nick",Ge.nick),_e("nickErr").textContent="",Ml(),Aa([yl(Ge)]),xt&&xt.start(Ge.nick,xl(Ge).col),!0):(_e("nickErr").textContent="2\u201314 letters, numbers, spaces, - or _",!1)}_e("nickGo").onclick=()=>{Qy(_e("nickIn").value)&&Ii("scrMain")};_e("nickIn").addEventListener("keydown",n=>{n.key==="Enter"&&_e("nickGo").click()});_e("bSolo").onclick=()=>{Ml(),bl()};function ev(){document.querySelectorAll("#layoutSeg button").forEach(n=>n.classList.toggle("on",n.dataset.l===dl)),_e("p1Lbl").textContent=Ge.nick}document.querySelectorAll("#layoutSeg button").forEach(n=>n.onclick=()=>{dl=n.dataset.l,Xn.set("ccr_split",dl),ev()});_e("bSplit").onclick=()=>{ev();let n=Xn.get("ccr_p2","");_e("p2In").value=n,Ii("scrSplit")};_e("p2Garage").onclick=()=>{let n=_e("p2In").value.trim();if(!Yf.test(n)||n.toLowerCase()===Ge.nick.toLowerCase()){_e("p2Err").textContent="Enter a different 2\u201314 character nickname first";return}Ci=Hf(n),Ii("scrGarage")};_e("splitGo").onclick=()=>{let n=_e("p2In").value.trim().replace(/\s+/g," ");if(!Yf.test(n)){_e("p2Err").textContent="Player 2 needs a 2\u201314 character nickname";return}if(n.toLowerCase()===Ge.nick.toLowerCase()){_e("p2Err").textContent="Pick a different nickname from Player 1";return}_e("p2Err").textContent="",Xn.set("ccr_p2",n);let e=Hf(n);Aa([yl(e)]),Zy(e),bl()};_e("bGarage").onclick=()=>{Ci=Ge,Ii("scrGarage")};function tv(){let n=Ci||Ge;_e("garWho").textContent=n.nick,_e("garCoins").textContent=n.coins;let e=s=>n.owned.includes(s);_e("paintGrid").innerHTML=Pf.map(s=>`<button class="swatch ${n.eq.paint===s.id?"sel":""}" data-paint="${s.id}" title="${s.name}">
    <i style="background:${s.metal?"linear-gradient(135deg,#f5f8fb,#8d99a6 45%,#e9eef3 60%,#7d8996)":go(s.col)};box-shadow:0 0 0 3px ${go(s.rim)} inset"></i>
    <span>${s.name}</span><b>${e(s.id)?n.eq.paint===s.id?"ON":"OWNED":"\u25CF "+s.price}</b></button>`).join(""),_e("partGrid").innerHTML=Oy.map(s=>{let r=e(s.id),o=!!n.eq[s.id],a=n.coins>=s.price;return`<div class="part ${o?"equipped":""}"><div class="ic">${s.icon}</div><div class="pt"><b>${s.name}</b><small>${s.desc}</small></div>
      ${r?`<button class="mini-btn ${o?"on":""}" data-eq="${s.id}">${o?"EQUIPPED":"EQUIP"}</button>`:`<button class="mini-btn buy" data-buy="${s.id}" ${a?"":"disabled"}>\u25CF ${s.price}</button>`}</div>`}).join("");let t=Gf(n),i=s=>`<i style="width:${Nt(s,0,1)*100}%"></i>`;_e("statBars").innerHTML=[["Top speed",(t.top-.95)/.15],["Acceleration",(t.acc-.95)/.25],["Off-road",(1.1-t.off)/.75],["Nitro",(t.boost-1.25)/.35],["Grip",(t.grip-.9)/.3]].map(([s,r])=>`<div class="sb"><span>${s}</span><div>${i(r)}</div></div>`).join(""),ot==="menu"&&xo(wt[0].car,yr(n))}_e("scrGarage").addEventListener("click",n=>{let e=Ci||Ge,t=n.target.closest("button");if(t){if(t.dataset.paint){let i=Pf.find(s=>s.id===t.dataset.paint);if(!e.owned.includes(i.id)){if(e.coins<i.price){qi(`Need \u25CF ${i.price-e.coins} more coins for ${i.name}`);return}e.coins-=i.price,e.owned.push(i.id),Xi.buy(),qi(`${i.name} paint unlocked!`)}e.eq.paint=i.id}else if(t.dataset.buy){let i=Oy.find(s=>s.id===t.dataset.buy);if(e.coins<i.price||e.owned.includes(i.id))return;e.coins-=i.price,e.owned.push(i.id),e.eq[i.id]=!0,Xi.buy(),qi(`${i.icon} ${i.name} installed!`)}else if(t.dataset.eq)e.eq[t.dataset.eq]=!e.eq[t.dataset.eq];else return;e.ts=Date.now(),R0(),Aa([yl(e)]),tv(),e===Ge&&xt&&xt.start(Ge.nick,xl(Ge).col)}});_e("garBack").onclick=()=>{let n=Ci&&Ci!==Ge?"scrSplit":"scrMain";Ci=null,Ii(n)};var w0="all";function gl(){let n=new Set((xt?xt.roster:[]).map(t=>t.nick.toLowerCase())),e=By();w0==="online"&&(e=e.filter(t=>n.has(t.nick.toLowerCase()))),document.querySelectorAll("#boardSeg button").forEach(t=>t.classList.toggle("on",t.dataset.f===w0)),_e("boardTrack").textContent=Ds[qt].icon+" "+Ds[qt].name,_e("boardBody").innerHTML=e.length?e.slice(0,100).map((t,i)=>`<tr class="${Ge&&t.nick.toLowerCase()===Ge.nick.toLowerCase()?"me":""}">
    <td class="rk">${i<3?["\u{1F947}","\u{1F948}","\u{1F949}"][i]:i+1}</td><td><i class="dot" style="background:${go(t.paint)}"></i>${Fs(t.nick)}${n.has(t.nick.toLowerCase())?' <em class="live">online</em>':""}${t.body?" <em>sports</em>":""}</td>
    <td>${t.wins}</td><td>${t.races}</td><td>${wa(If(t,qt)[0])}</td><td>${wa(If(t,qt)[1])}</td><td class="gold">\u25CF ${t.earned}</td></tr>`).join(""):'<tr><td colspan="7" class="empty">No racers yet \u2014 finish a race to get on the board.</td></tr>'}document.querySelectorAll("#boardSeg button").forEach(n=>n.onclick=()=>{w0=n.dataset.f,gl()});var Py=0;function qi(n){let e=_e("toast");e.textContent=n,e.classList.add("show"),clearTimeout(Py),Py=setTimeout(()=>e.classList.remove("show"),2600)}var Bs=[];function zf(){let n=Bs[0],e=_e("invite");if(!n){e.classList.remove("show");return}_e("invFrom").textContent=n.nick,e.classList.add("show"),Xi.ping()}_e("invYes").onclick=()=>{let n=Bs.shift();n&&(Bs=[],zf(),xt.respond(n.id,!0,yr(Ge))?(Ta=[n.nick,Ge.nick],Ii("scrOnline"),qi(`Joined ${n.nick}'s race \u2014 waiting for the start`)):qi("That challenge expired"))};_e("invNo").onclick=()=>{let n=Bs.shift();n&&xt.respond(n.id,!1),zf()};var Cf=[],Ta=[],A0={txt:"Offline",lvl:""};function us(){if(!xt)return;_e("netStatus").textContent=A0.txt,_e("netStatus").className="netst "+(A0.lvl||"");let n=Cf.filter(a=>a.id!==xt.id),e=xt.inRoomAsGuest,t=xt.room;_e("onlineCount").textContent=Cf.length?`${Cf.length} online`:"";let i={idle:"in menus",room:"in a race room",racing:"racing"};_e("rosterList").innerHTML=n.length?n.map(a=>{let c=t&&t.guests.get(a.id),l=e?"":c?`<span class="tagst ${c.state}">${{invited:"invited\u2026",ready:"ready \u2713",declined:"declined",busy:"busy",offline:"offline"}[c.state]}</span>`:`<button class="mini-btn buy" data-ch="${a.id}" ${a.status==="idle"?"":"disabled"}>CHALLENGE</button>`;return`<div class="racer"><i class="dot" style="background:${go(a.paint)}"></i><b>${Fs(a.nick)}</b><small>${i[a.status]||""}</small>${l}</div>`}).join(""):`<div class="empty">${xt.online?"Nobody else is online right now. Send a friend this page's link \u2014 when they open it, they appear here.":"Connecting\u2026"}</div>`;let s="";if(e)s=`<p>You're in <b>${Fs(xt.hostNick||Ta[0]||"a")}</b>'s race room.</p><div class="roomlist">${Ta.map(a=>`<span>${Fs(a)}</span>`).join("")}</div><p class="hint">Waiting for the host to start\u2026</p><button class="go small alt" id="roomLeave">LEAVE ROOM</button>`;else if(t&&t.guests.size){let a=[...t.guests.values()].filter(c=>c.state==="ready").length;s=`<p>Your race room \u2014 challenge more racers, then start. Empty grid slots are filled with bots.</p><div class="roomlist"><span>${Fs(Ge.nick)} (host)</span>${[...t.guests.values()].map(c=>`<span class="${c.state}">${Fs(c.nick)} \xB7 ${c.state}</span>`).join("")}</div>
      <button class="go" id="roomStart" ${a?"":"disabled"}>START RACE (${a+1} racers)</button><button class="go small alt" id="roomLeave">CANCEL ROOM</button>`}else s='<p class="hint">Hit <b>CHALLENGE</b> next to a racer. Challenge several to race up to 6 together.</p>';e||(s+=`<p class="hint">You host on <b>${Ds[qt].icon} ${Ds[qt].name}</b> \xB7 ${mo?"\u{1F319} night":"\u2600\uFE0F day"} \u2014 change both on the main menu.</p>`),_e("roomBox").innerHTML=s;let r=_e("roomStart");r&&(r.onclick=qw);let o=_e("roomLeave");o&&(o.onclick=()=>{xt.closeRoom(),Ta=[],us()})}_e("rosterList").addEventListener("click",n=>{let e=n.target.closest("[data-ch]");!e||!xt||(xt.challenge(e.dataset.ch,yr(Ge)),qi("Challenge sent!"),us())});_e("bOnline").onclick=()=>{xt&&xt.start(Ge.nick,xl(Ge).col),Ii("scrOnline")};function qw(){let n=xt.readyGuests().slice(0,5);if(!n.length)return;let e=[{id:xt.id,nick:Ge.nick,look:yr(Ge)},...n.map(i=>({id:i.id,nick:i.nick,look:i.look}))],t=[];e.forEach((i,s)=>{t[5-s]={id:i.id,nick:i.nick,look:nv(i.look)}});for(let i=0;i<6;i++)t[i]||(t[i]={ai:1,nick:fl[i],look:C0(i)});xt.startRoom({t:"start",slots:t,track:qt,night:mo}),iv(t,!0)}function nv(n){return n=n||{},{paint:+n.paint|0,rim:+n.rim|0,metal:!!n.metal,body:n.body==="sports"?"sports":"classic",tyres:n.tyres==="big"?"big":"std",rocket:!!n.rocket,glow:+n.glow|0}}function iv(n,e){!Array.isArray(n)||n.length!==6||(sn="online",Df=e,wt=[],Ht.forEach((t,i)=>{let s=n[i]||{ai:1,nick:fl[i],look:C0(i)};t.name=String(s.nick||fl[i]).slice(0,14),t.bot=!!s.ai,t.peer=s.id||null,t.view=null,t.prof=null,t.ctrl=s.id&&s.id===xt.id?"local":s.ai&&e?"ai":"remote",t.st=t.ctrl==="local"?Gf(Ge):_l,xo(t,t.ctrl==="local"?yr(Ge):nv(s.look)),t.ctrl==="local"&&(t.prof=Ge,wt.push({car:t,prof:Ge,pi:0}))}),wt.length&&(O0(),bl()))}var _0=0;function Yw(n){sn!=="online"||ot==="menu"||!xt||(_0-=n,!(_0>0)&&(_0=.05,Df?xt.broadcast({t:"S",l:Ht.map(Ey)}):xt.toHost({t:"s",d:Ey(wt[0].car)})))}function Iy(n,e){if(n.ctrl!=="remote")return;let t=n.net;t&&(n.x=t.x,n.z=t.z,n.y=t.y,n.h=t.h),n.ctrl="ai",n.st=_l,n.vf=Math.hypot(n.vx,n.vz),n.bot||(n.name+=" \u{1F916}"),n.bot=!0,e&&qi(e)}var xt=null;try{xt=b_({status:(n,e)=>{A0={txt:n,lvl:e},Qn==="scrOnline"&&us(),_e("netDot").className="netdot "+(e||""),_e("netDot").title=n},getBoard:()=>By().slice(0,100),mergeBoard:n=>Aa(n),boardChanged:()=>{Qn==="scrBoard"&&ot==="menu"&&gl()},roster:n=>{Cf=n,_e("onlineLbl").textContent=n.length>1?`${n.length-1} online`:"",ot==="menu"&&(Qn==="scrOnline"&&us(),Qn==="scrBoard"&&gl())},room:()=>{Qn==="scrOnline"&&ot==="menu"&&us()},canAccept:()=>ot==="menu"&&!!Ge,invite:n=>{ot==="menu"&&(Bs=Bs.filter(e=>e.id!==n.id),Bs.push(n),zf())},inviteGone:n=>{Bs=Bs.filter(e=>e.id!==n),zf()},roomList:n=>{Ta=(n||[]).map(String),Qn==="scrOnline"&&us()},start:n=>{B0(n.track,!0),k0(!!n.night,!0),iv(n.slots,!1)},hostStates:n=>{if(sn==="online"&&Array.isArray(n))for(let e of n)wy(e)},guestState:(n,e)=>{if(sn==="online"&&Df&&Array.isArray(e)){let t=Ht[e[0]];t&&t.peer===n&&wy(e)}},guestLeft:n=>{if(sn==="online"&&Df){let e=Ht.find(t=>t.peer===n);e&&!e.finished&&Iy(e,`${e.name} left \u2014 a bot takes over`)}},hostLeft:()=>{sn==="online"&&ot!=="menu"?(Ht.forEach(n=>{n.ctrl==="remote"&&!n.finished&&Iy(n)}),qi("Host disconnected \u2014 bots take over")):ot==="menu"&&(qi("The race room was closed"),Ta=[],Qn==="scrOnline"&&us())}})}catch{xt=null}var bf=0,Ly=performance.now(),Ma=0,jn=new D,Tf=new D,y0=new D,v0=new D,Ef=new D,Dy=new Ve,Ny=new fn;function $w(n,e){let i=Math.max(St(n.x+1.2,n.z),-.55)-Math.max(St(n.x-1.2,n.z),-.55),s=Math.max(St(n.x,n.z+1.2),-.55)-Math.max(St(n.x,n.z-1.2),-.55);n.grounded?y0.set(-i/(2*1.2),1,-s/(2*1.2)).normalize():y0.set(-Math.sin(n.h)*Nt(n.vy*.012,-.3,.3),1,-Math.cos(n.h)*Nt(n.vy*.012,-.3,.3)).normalize(),n.up.lerp(y0,Math.min(1,e*(n.grounded?10:3))).normalize(),Ef.set(Math.sin(n.h),0,Math.cos(n.h)),v0.crossVectors(n.up,Ef).normalize(),Ef.crossVectors(v0,n.up).normalize(),Dy.makeBasis(v0,n.up,Ef),Ny.setFromRotationMatrix(Dy);let r=n.model.G;r.position.set(n.x,n.y,n.z),r.quaternion.copy(Ny),n.model.body.rotation.z=Jn(n.model.body.rotation.z,Nt(-n.vl*.018+n.steer*Math.abs(n.vf)*.0022,-.16,.16),Math.min(1,e*8)),n.model.body.position.y=Math.sin(Ma*31+n.k)*.012*Math.min(1,Math.abs(n.vf)/10),n.spin+=n.vf/n.model.wr*e;for(let a of n.model.wheels)a.spin.rotation.x=n.spin,a.front&&(a.pivot.rotation.y=n.steer*.42);Zw(n,e);let o=n.boostT>0;for(let a of n.model.flames)a.visible=o,o&&a.scale.set(1+Math.random()*.5,1+Math.random()*.5,.8+Math.random()*.8);n.model.flames.glow&&(n.model.flames.glow.material.opacity=.7+Math.sin(Ma*6+n.k)*.15)}var Kw={country:1,snow:.6,beach:.25,desert:.15};function Zw(n,e){n.marks||(n.marks=[{},{}]);let t=Math.sin(n.h),i=Math.cos(n.h),s=n.model,r=Math.hypot(n.vx,n.vz),o=Nt((Math.abs(n.vl)-2)/6,0,1),a=n.boostT>0?.15:0,c=.45+.5*(n.off||0);for(let l=0;l<2;l++){let u=(l?-1:1)*s.wx,h=-1.2,f=n.x+i*u+t*h,d=n.z-t*u+i*h,g=St(f,d),x=!n.grounded||r<1||g<-.1?0:Nt(c+o*.6+a,0,1)*Math.min(1,r/4);B_(n.marks[l],f,g+(s0(f,d)<10.8?.19:.05),d,t,i,s.ww*.46,x)}if(n.grounded&&r>4&&s.wearU){let l=nf(n.x,n.z),u=(Kw[qt]||0)*l.b*(n.off>0?1:.5);u>.01&&(n.wear=Math.min(1,n.wear+u*e*.025*Math.min(1,r/20)),s.wearU.wearAmt.value=n.wear)}}function Jw(n,e){let t=n.car,i=n.cam;if(t){if(ot==="menu"||ot==="finish"&&vl){let s=ot==="menu"&&Qn==="scrGarage",r=s?8.2:9.5;bf+=e*(s?.35:.22),jn.set(t.x+Math.sin(bf)*r,t.y+(s?2.2:2.6)+Math.sin(bf*.7)*.8,t.z+Math.cos(bf)*r),jn.y=Math.max(jn.y,St(jn.x,jn.z)+1.2,.9),i.position.lerp(jn,n.snap?1:Math.min(1,e*3)),Tf.set(t.x,t.y+1.1,t.z),i.lookAt(Tf),i.fov=Jn(i.fov,50,Math.min(1,e*3)),n.snap=!1,n.camH=t.h;let o=n.rect.w,a=n.rect.h;s?o>760?i.setViewOffset(o,a,Math.min(260,o*.2),0,o,a):i.setViewOffset(o,a,0,a*.24,o,a):i.view&&i.view.enabled&&i.clearViewOffset()}else{let s=Nt(Math.abs(t.vf)/mf,0,1.4),r=t.boostT>0?1:0,o=Math.hypot(t.vx,t.vz)>6?Jn(0,dr(Math.atan2(t.vx,t.vz)-t.h),.45)+t.h:t.h;n.camH+=dr(o-n.camH)*Math.min(1,e*5.5),n.snap&&(n.camH=t.h);let a=8.2+s*1.6-r*.6,c=3.3+s*.3;if(jn.set(t.x-Math.sin(n.camH)*a,t.y+c,t.z-Math.cos(n.camH)*a),jn.y=Math.max(jn.y,St(jn.x,jn.z)+1.4,1),n.snap?(i.position.copy(jn),n.snap=!1):(i.position.x=jn.x,i.position.z=jn.z,i.position.y=Jn(i.position.y,jn.y,Math.min(1,e*7))),n.shake>0||r){let h=n.shake*.5+r*.05;i.position.x+=(Math.random()-.5)*h,i.position.y+=(Math.random()-.5)*h,n.shake=Math.max(0,n.shake-e*1.5)}Tf.set(t.x+Math.sin(t.h)*5,t.y+1.5,t.z+Math.cos(t.h)*5),i.lookAt(Tf),i.fov=Jn(i.fov,60+s*13+r*9,Math.min(1,e*4));let l=n.rect.w,u=n.rect.h;Xe.on?i.setViewOffset(l,u,0,u*(u>l?.13:.16),l,u):i.view&&i.view.enabled&&i.clearViewOffset()}i.updateProjectionMatrix()}}var Uy=0;function sv(n){requestAnimationFrame(sv);let e=ot==="menu"?pl().menuFps:pl().fps;if(e&&n-Uy<1e3/e-2)return;Uy=n;let t=Math.min(.05,(n-Ly)/1e3);if(Ly=n,Ma+=t,zw(),ot==="countdown"){M0-=t;let o=Math.ceil(M0-.6);o!==b0&&(b0=o,o>0?(Pi.forEach(a=>uo(a,String(o),.8)),Xi.beep(!1)):(Pi.forEach(a=>uo(a,"GO!",.9)),Xi.beep(!0),ot="race"))}if(ot==="race"&&(gr+=t),ot!=="menu"){let a=t/2,c=-1e9;for(let l of Ht)ba(l)&&(c=Math.max(c,l.dist));for(let l=0;l<2;l++){for(let u of Ht){if(u.ctrl==="remote"){l===0&&ww(u,t);continue}if(u.ctrl==="ai"||u.auto)Ew(u,a,il),u.finished&&(il.throttle=Math.hypot(u.vx,u.vz)>22?0:il.throttle),u.skill=u.ctrl==="local"?1:u.base*(1+Nt((c-u.dist)*Ls/500,-.1,.1)),by(u,il,a);else{u.skill=1;let h=wt.find(f=>f.car===u);by(u,h&&h.inp||il,a)}}for(let u=0;u<Ht.length;u++)for(let h=u+1;h<Ht.length;h++){let f=Ht[u],d=Ht[h],g=d.x-f.x,x=d.z-f.z,p=Math.hypot(g,x);if(p<2.7&&p>.001&&Math.abs(f.y-d.y)<1.6){let m=g/p,y=x/p,v=f.ctrl==="remote",S=d.ctrl==="remote";if(v&&S)continue;let T=v?0:S?1:.5,M=1-T,_=2.7-p;f.x-=m*_*T,f.z-=y*_*T,d.x+=m*_*M,d.z+=y*_*M;let b=(d.vx-f.vx)*m+(d.vz-f.vz)*y;if(b<-5){let R=(f.x+d.x)/2,I=(f.y+d.y)/2+.85,A=(f.z+d.z)/2,L=(-b-5)/14;Nf(f,R,I,A,-m,-y,L),Nf(d,R,I,A,m,y,L)}if(b<0){let R=-b*.65*2;f.vx-=m*R*T,f.vz-=y*R*T,d.vx+=m*R*M,d.vz+=y*R*M}}}}for(let l of wt){let u=l.car,h=u.idx,f=u.vx*Math.sin(Xt[h])+u.vz*Math.cos(Xt[h]);u.wrongT=f<-4&&!u.sc?u.wrongT+t:0}for(let l of fr){if(l.t>0){l.t-=t;continue}for(let u of wt){let h=u.car;if(h.finished)continue;let f=l.x-h.x,d=l.z-h.z,g=5.3*h.st.magnet*h.st.magnet;if(f*f+d*d<g&&Math.abs(l.y-h.y-1)<2.5+(h.st.magnet-1)*2){l.t=14,h.coins++,h.nitro=Math.min(1,h.nitro+.07),Xi.coin();for(let x=0;x<8;x++)Uf(l.x,l.y,l.z,(Math.random()-.5)*7,2+Math.random()*5,(Math.random()-.5)*7,.5,.35,1,.85,.2,.9);break}}}for(let l of Ht){let u=Math.abs(l.vf)+Math.abs(l.vl)*2;if(l.grounded&&u>7)for(l.emit+=t*(l.view?60:28)*Math.min(1,u/30)*(l.gPrev<-.08?1.6:1);l.emit>1;)l.emit--,qy(l)}Yw(t),vl&&(p0-=t,p0<=0&&(p0=.5,Jy()))}for(let o of Ht)$w(o,t),o.hitT>0&&(o.hitT-=t);fr.forEach((o,a)=>{Ai.position.set(o.x,o.y+Math.sin(Ma*3+o.ph)*.15,o.z),Ai.rotation.set(0,Ma*3.2+o.ph,0),Ai.scale.setScalar(o.t>0?1e-4:1),Ai.updateMatrix(),io.setMatrixAt(a,Ai.matrix)}),io.instanceMatrix.needsUpdate=!0,Aw(t),yy(t,nl.uniforms.uScale.value),k_(),ry(t,Ma),Lw(),Nw(t),Rw();let i=U0(),s=innerHeight,r=In.getPixelRatio();In.setScissorTest(i>1);for(let o=0;o<i;o++){let a=Pi[o],c=a.rect,l=a.car||Ht[5];Jw(a,t);let u=s-c.y-c.h;In.setViewport(c.x,u,c.w,c.h),In.setScissor(c.x,u,c.w,c.h),Xy.uniforms.uScale.value=nl.uniforms.uScale.value=c.h*r*.9,Sa.position.copy(a.cam.position),cn.target.position.set(Math.round(l.x/4)*4,l.y,Math.round(l.z/4)*4),cn.position.copy(cn.target.position).addScaledVector(gf,190),sy(a.cam,c.h*r*.9),Dw(o,a.car),a.composer.render(t)}}{let n=Xn.get("ccr_nick",""),e=+(()=>{try{return localStorage.getItem("ccr_best")}catch{return 0}})()||0;n&&Yf.test(n)?(Qy(n),Ii("scrMain")):(Ge=Fy("Racer"),e&&!Ge.best&&(Ge.best=e),Ml(),Ii("scrNick")),Sl(),Yy()}window.__game={SCDBG:Is,get SC(){return gt},get N(){return Re},get SP(){return Ls},get track(){return qt},setTrack:B0,setTimeOfDay:k0,placeCar:Lf,cars:Ht,views:Pi,get locals(){return wt},get state(){return ot},get mode(){return sn},get raceT(){return gr},startRace:bl,setupSplit:Zy,getProfile:Hf,get me(){return Ge},net:xt,renderer:In,profiles:ho,board:ll,ASSETS:je,setLook:xo,createMusic:xm,crash:Nf,get AC(){return Ye}};requestAnimationFrame(sv);/[?&]noassets=1/.test(location.search)||N_().then(()=>{xf(qt),N0(),Pi.forEach(n=>n.snap=!0),ot==="menu"&&Sl();for(let n of Ht)n.model&&n.look&&(n.lookKey="",xo(n,n.look))}).catch(n=>console.warn("Blender assets unavailable, using built-in models",n));})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
