(()=>{var _y=Object.create;var Mf=Object.defineProperty;var xy=Object.getOwnPropertyDescriptor;var yy=Object.getOwnPropertyNames;var vy=Object.getPrototypeOf,Sy=Object.prototype.hasOwnProperty;var My=(n,e)=>()=>{try{return e||n((e={exports:{}}).exports,e),e.exports}catch(t){throw e=0,t}},al=(n,e)=>{for(var t in e)Mf(n,t,{get:e[t],enumerable:!0})},by=(n,e,t,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of yy(e))!Sy.call(n,s)&&s!==t&&Mf(n,s,{get:()=>e[s],enumerable:!(i=xy(e,s))||i.enumerable});return n};var v0=(n,e,t)=>(t=n!=null?_y(vy(n)):{},by(e||!n||!n.__esModule?Mf(t,"default",{value:n,enumerable:!0}):t,n));var Ap=My((yC,wp)=>{"use strict";var ce={};ce.generateIdentifier=function(){return Math.random().toString(36).substring(2,12)};ce.localCName=ce.generateIdentifier();ce.splitLines=function(n){return n.trim().split(`
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
`};ce.getDirection=function(n,e){let t=ce.splitLines(n);for(let i=0;i<t.length;i++)switch(t[i]){case"a=sendrecv":case"a=sendonly":case"a=recvonly":case"a=inactive":return t[i].substring(2);default:}return e?ce.getDirection(e):"sendrecv"};ce.getKind=function(n){return ce.splitLines(n)[0].split(" ")[0].substring(2)};ce.isRejected=function(n){return n.split(" ",2)[1]==="0"};ce.parseMLine=function(n){let t=ce.splitLines(n)[0].substring(2).split(" ");return{kind:t[0],port:parseInt(t[1],10),protocol:t[2],fmt:t.slice(3).join(" ")}};ce.parseOLine=function(n){let t=ce.matchPrefix(n,"o=")[0].substring(2).split(" ");return{username:t[0],sessionId:t[1],sessionVersion:parseInt(t[2],10),netType:t[3],addressType:t[4],address:t[5]}};ce.isValidSDP=function(n){if(typeof n!="string"||n.length===0)return!1;let e=ce.splitLines(n);for(let t=0;t<e.length;t++)if(e[t].length<2||e[t].charAt(1)!=="=")return!1;return!0};typeof wp=="object"&&(wp.exports=ce)});var ug=0,cd=1,hg=2;var Rr=1,Uo=2,Fo=3,Xi=0,Cn=1,Sn=2,Ss=0,Bo=1,Ms=2,ld=3,ud=4,fg=5;var Cr=100,dg=101,pg=102,mg=103,gg=104,_g=200,xg=201,yg=202,vg=203,hd=204,fd=205,Sg=206,Mg=207,bg=208,Tg=209,Eg=210,wg=211,Ag=212,Rg=213,Cg=214,Ol=0,Ul=1,Fl=2,yo=3,Bl=4,kl=5,zl=6,Hl=7,dd=0,Pg=1,Ig=2,qi=0,Ka=1,Za=2,Ja=3,ja=4,Qa=5,Pr=6,ec=7,Zf="attached",Lg="detached",pd=300,Ir=301,ko=302,hu=303,fu=304,gi=1e3,jn=1001,vo=1002,Zt=1003,du=1004;var Lr=1005;var un=1006,zo=1007;var yi=1008;var ii=1009,md=1010,gd=1011,Ho=1012,pu=1013,Oi=1014,ui=1015,fn=1016,mu=1017,gu=1018,Dr=1020,_d=35902,xd=35899,yd=1021,vd=1022,vi=1023,hs=1026,bs=1027,_u=1028,xu=1029,Ys=1030,yu=1031;var vu=1033,tc=33776,nc=33777,ic=33778,sc=33779,Su=35840,Mu=35841,bu=35842,Tu=35843,Eu=36196,wu=37492,Au=37496,Ru=37488,Cu=37489,rc=37490,Pu=37491,Iu=37808,Lu=37809,Du=37810,Nu=37811,Ou=37812,Uu=37813,Fu=37814,Bu=37815,ku=37816,zu=37817,Hu=37818,Gu=37819,Vu=37820,Wu=37821,Xu=36492,qu=36494,Yu=36495,$u=36283,Ku=36284,oc=36285,Zu=36286;var _r=2300,xr=2301,Dl=2302,Jf=2303,jf=2400,Qf=2401,ed=2402,Dg=2500;var Sd=0,ac=1,Go=2,Ng=3200;var Ju=0,Og=1,Ui="",Dt="srgb",An="srgb-linear",Ea="linear",St="srgb";var Nl=7680;var Ug=519,Fg=512,Bg=513,kg=514,Md=515,zg=516,Hg=517,bd=518,Td=519,Ed=35044;var wd="300 es",mi=2e3,So=2001;function Ty(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Ey(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function Mo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Gg(){let n=Mo("canvas");return n.style.display="block",n}var S0={},bo=null;function wa(...n){let e="THREE."+n.shift();bo?bo("log",e,...n):console.log(e,...n)}function Vg(n){let e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Be(...n){n=Vg(n);let e="THREE."+n.shift();if(bo)bo("warn",e,...n);else{let t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function Ve(...n){n=Vg(n);let e="THREE."+n.shift();if(bo)bo("error",e,...n);else{let t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function gr(...n){let e=n.join(" ");e in S0||(S0[e]=!0,Be(...n))}function Wg(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}var Xg={[Ol]:Ol,[Fl]:zl,[Bl]:Bl,[yo]:kl,[Ul]:Ul,[zl]:Fl,[Hl]:Hl,[kl]:yo},Gi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){let i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){let i=this._listeners;if(i===void 0)return;let s=i[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let i=t[e.type];if(i!==void 0){e.target=this;let s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},Un=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],M0=1234567,Sa=Math.PI/180,yr=180/Math.PI;function Yi(){let n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Un[n&255]+Un[n>>8&255]+Un[n>>16&255]+Un[n>>24&255]+"-"+Un[e&255]+Un[e>>8&255]+"-"+Un[e>>16&15|64]+Un[e>>24&255]+"-"+Un[t&63|128]+Un[t>>8&255]+"-"+Un[t>>16&255]+Un[t>>24&255]+Un[i&255]+Un[i>>8&255]+Un[i>>16&255]+Un[i>>24&255]).toLowerCase()}function st(n,e,t){return Math.max(e,Math.min(t,n))}function Ad(n,e){return(n%e+e)%e}function wy(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function Ay(n,e,t){return n!==e?(t-n)/(e-n):0}function Ma(n,e,t){return(1-t)*n+t*e}function Ry(n,e,t,i){return Ma(n,e,1-Math.exp(-t*i))}function Cy(n,e=1){return e-Math.abs(Ad(n,e*2)-e)}function Py(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function Iy(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Ly(n,e){return n+Math.floor(Math.random()*(e-n+1))}function Dy(n,e){return n+Math.random()*(e-n)}function Ny(n){return n*(.5-Math.random())}function Oy(n){n!==void 0&&(M0=n);let e=M0+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Uy(n){return n*Sa}function Fy(n){return n*yr}function By(n){return n>0&&Number.isInteger(n)&&2**Math.round(Math.log2(n))===n}function ky(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Rd(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function zy(n,e,t,i,s){let r=Math.cos,o=Math.sin,a=r(t/2),c=o(t/2),l=r((e+i)/2),u=o((e+i)/2),h=r((e-i)/2),f=o((e-i)/2),d=r((i-e)/2),g=o((i-e)/2);switch(s){case"XYX":n.set(a*u,c*h,c*f,a*l);break;case"YZY":n.set(c*f,a*u,c*h,a*l);break;case"ZXZ":n.set(c*h,c*f,a*u,a*l);break;case"XZX":n.set(a*u,c*g,c*d,a*l);break;case"YXY":n.set(c*d,a*u,c*g,a*l);break;case"ZYZ":n.set(c*g,c*d,a*u,a*l);break;default:Be("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function ju(n){switch(n.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function Cd(n,e){if(e.constructor===Float32Array)return n;let t=ju(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(n/t,-1)}function Pd(n,e){if(e.constructor===Float32Array)return n;let t=ju(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(n*t)}var Qu={DEG2RAD:Sa,RAD2DEG:yr,generateUUID:Yi,clamp:st,euclideanModulo:Ad,mapLinear:wy,inverseLerp:Ay,lerp:Ma,damp:Ry,pingpong:Cy,smoothstep:Py,smootherstep:Iy,randInt:Ly,randFloat:Dy,randFloatSpread:Ny,seededRandom:Oy,degToRad:Uy,radToDeg:Fy,isPowerOfTwo:By,ceilPowerOfTwo:ky,floorPowerOfTwo:Rd,setQuaternionFromProperEuler:zy,normalize:Pd,denormalize:Cd},Ee=class{static{this.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(st(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(st(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*i-o*s+e.x,this.y=r*s+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Rn=class{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,o,a){let c=i[s+0],l=i[s+1],u=i[s+2],h=i[s+3],f=r[o+0],d=r[o+1],g=r[o+2],_=r[o+3];if(h!==_||c!==f||l!==d||u!==g){let p=c*f+l*d+u*g+h*_;p<0&&(f=-f,d=-d,g=-g,_=-_,p=-p);let m=1-a;if(p<.9995){let y=Math.acos(p),v=Math.sin(y);m=Math.sin(m*y)/v,a=Math.sin(a*y)/v,c=c*m+f*a,l=l*m+d*a,u=u*m+g*a,h=h*m+_*a}else{c=c*m+f*a,l=l*m+d*a,u=u*m+g*a,h=h*m+_*a;let y=1/Math.sqrt(c*c+l*l+u*u+h*h);c*=y,l*=y,u*=y,h*=y}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,s,r,o){let a=i[s],c=i[s+1],l=i[s+2],u=i[s+3],h=r[o],f=r[o+1],d=r[o+2],g=r[o+3];return e[t]=a*g+u*h+c*d-l*f,e[t+1]=c*g+u*f+l*h-a*d,e[t+2]=l*g+u*d+a*f-c*h,e[t+3]=u*g-a*h-c*f-l*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(i/2),u=a(s/2),h=a(r/2),f=c(i/2),d=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=f*u*h+l*d*g,this._y=l*d*h-f*u*g,this._z=l*u*g+f*d*h,this._w=l*u*h-f*d*g;break;case"YXZ":this._x=f*u*h+l*d*g,this._y=l*d*h-f*u*g,this._z=l*u*g-f*d*h,this._w=l*u*h+f*d*g;break;case"ZXY":this._x=f*u*h-l*d*g,this._y=l*d*h+f*u*g,this._z=l*u*g+f*d*h,this._w=l*u*h-f*d*g;break;case"ZYX":this._x=f*u*h-l*d*g,this._y=l*d*h+f*u*g,this._z=l*u*g-f*d*h,this._w=l*u*h+f*d*g;break;case"YZX":this._x=f*u*h+l*d*g,this._y=l*d*h+f*u*g,this._z=l*u*g-f*d*h,this._w=l*u*h-f*d*g;break;case"XZY":this._x=f*u*h-l*d*g,this._y=l*d*h-f*u*g,this._z=l*u*g+f*d*h,this._w=l*u*h+f*d*g;break;default:Be("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],u=t[6],h=t[10],f=i+a+h;if(f>0){let d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(u-c)*d,this._y=(r-l)*d,this._z=(o-s)*d}else if(i>a&&i>h){let d=2*Math.sqrt(1+i-a-h);this._w=(u-c)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+l)/d}else if(a>h){let d=2*Math.sqrt(1+a-i-h);this._w=(r-l)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(c+u)/d}else{let d=2*Math.sqrt(1+h-i-a);this._w=(o-s)/d,this._x=(r+l)/d,this._y=(c+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(st(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,u=t._w;return this._x=i*u+o*a+s*l-r*c,this._y=s*u+o*c+r*a-i*l,this._z=r*u+o*l+i*c-s*a,this._w=o*u-i*a-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,r=e._z,o=e._w,a=this.dot(e);a<0&&(i=-i,s=-s,r=-r,o=-o,a=-a);let c=1-t;if(a<.9995){let l=Math.acos(a),u=Math.sin(l);c=Math.sin(c*l)/u,t=Math.sin(t*l)/u,this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+o*t,this._onChangeCallback()}else this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+o*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},N=class{static{this.prototype.isVector3=!0}constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(b0.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(b0.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,i=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*s-a*i),u=2*(a*t-r*s),h=2*(r*i-o*t);return this.x=t+c*l+o*h-a*u,this.y=i+c*u+a*l-r*h,this.z=s+c*h+r*u-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this.z=st(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this.z=st(this.z,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(st(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-i*c,this.z=i*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return bf.copy(this).projectOnVector(e),this.sub(bf)}reflect(e){return this.sub(bf.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(st(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},bf=new N,b0=new Rn,qe=class{static{this.prototype.isMatrix3=!0}constructor(e,t,i,s,r,o,a,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,c,l)}set(e,t,i,s,r,o,a,c,l){let u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=t,u[4]=r,u[5]=c,u[6]=i,u[7]=o,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[3],c=i[6],l=i[1],u=i[4],h=i[7],f=i[2],d=i[5],g=i[8],_=s[0],p=s[3],m=s[6],y=s[1],v=s[4],S=s[7],E=s[2],M=s[5],x=s[8];return r[0]=o*_+a*y+c*E,r[3]=o*p+a*v+c*M,r[6]=o*m+a*S+c*x,r[1]=l*_+u*y+h*E,r[4]=l*p+u*v+h*M,r[7]=l*m+u*S+h*x,r[2]=f*_+d*y+g*E,r[5]=f*p+d*v+g*M,r[8]=f*m+d*S+g*x,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8];return t*o*u-t*a*l-i*r*u+i*a*c+s*r*l-s*o*c}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],h=u*o-a*l,f=a*c-u*r,d=l*r-o*c,g=t*h+i*f+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return e[0]=h*_,e[1]=(s*l-u*i)*_,e[2]=(a*i-s*o)*_,e[3]=f*_,e[4]=(u*t-s*c)*_,e[5]=(s*r-a*t)*_,e[6]=d*_,e[7]=(i*c-l*t)*_,e[8]=(o*t-i*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*o+l*a)+o+e,-s*l,s*c,-s*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return gr("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Tf.makeScale(e,t)),this}rotate(e){return gr("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Tf.makeRotation(-e)),this}translate(e,t){return gr("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Tf.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Tf=new qe,T0=new qe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),E0=new qe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Hy(){let n={enabled:!0,workingColorSpace:An,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===St&&(s.r=us(s.r),s.g=us(s.g),s.b=us(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===St&&(s.r=xo(s.r),s.g=xo(s.g),s.b=xo(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ui?Ea:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[o].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[An]:{primaries:e,whitePoint:i,transfer:Ea,toXYZ:T0,fromXYZ:E0,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Dt},outputColorSpaceConfig:{drawingBufferColorSpace:Dt}},[Dt]:{primaries:e,whitePoint:i,transfer:St,toXYZ:T0,fromXYZ:E0,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Dt}}}),n}var Je=Hy();function us(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function xo(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var io,Gl=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{io===void 0&&(io=Mo("canvas")),io.width=e.width,io.height=e.height;let s=io.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=io}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Mo("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=us(r[o]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(us(t[i]/255)*255):t[i]=us(t[i]);return{data:t,width:e.width,height:e.height}}else return Be("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Gy=0,To=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Gy++}),this.uuid=Yi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Ef(s[o].image)):r.push(Ef(s[o]))}else r=Ef(s);i.url=r}return t||(e.images[this.uuid]=i),i}};function Ef(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Gl.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Be("Texture: Unable to serialize Texture."),{})}var Vy=0,wf=new N,hn=class n extends Gi{constructor(e=n.DEFAULT_IMAGE,t=n.DEFAULT_MAPPING,i=jn,s=jn,r=un,o=yi,a=vi,c=ii,l=n.DEFAULT_ANISOTROPY,u=Ui){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Vy++}),this.uuid=Yi(),this.name="",this.source=new To(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Ee(0,0),this.repeat=new Ee(1,1),this.center=new Ee(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qe,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(wf).x}get height(){return this.source.getSize(wf).y}get depth(){return this.source.getSize(wf).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let i=e[t];if(i===void 0){Be(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Be(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==pd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case gi:e.x=e.x-Math.floor(e.x);break;case jn:e.x=e.x<0?0:1;break;case vo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case gi:e.y=e.y-Math.floor(e.y);break;case jn:e.y=e.y<0?0:1;break;case vo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};hn.DEFAULT_IMAGE=null;hn.DEFAULT_MAPPING=pd;hn.DEFAULT_ANISOTROPY=1;var _t=class{static{this.prototype.isVector4=!0}constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*i+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r,c=e.elements,l=c[0],u=c[4],h=c[8],f=c[1],d=c[5],g=c[9],_=c[2],p=c[6],m=c[10];if(Math.abs(u-f)<.01&&Math.abs(h-_)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+f)<.1&&Math.abs(h+_)<.1&&Math.abs(g+p)<.1&&Math.abs(l+d+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let v=(l+1)/2,S=(d+1)/2,E=(m+1)/2,M=(u+f)/4,x=(h+_)/4,b=(g+p)/4;return v>S&&v>E?v<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(v),s=M/i,r=x/i):S>E?S<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),i=M/s,r=b/s):E<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),i=x/r,s=b/r),this.set(i,s,r,t),this}let y=Math.sqrt((p-g)*(p-g)+(h-_)*(h-_)+(f-u)*(f-u));return Math.abs(y)<.001&&(y=1),this.x=(p-g)/y,this.y=(h-_)/y,this.z=(f-u)/y,this.w=Math.acos((l+d+m-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this.z=st(this.z,e.z,t.z),this.w=st(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this.z=st(this.z,e,t),this.w=st(this.w,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(st(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Vl=class extends Gi{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:un,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new _t(0,0,e,t),this.scissorTest=!1,this.viewport=new _t(0,0,e,t),this.textures=[];let s=i.count;for(let r=0;r<s;r++)this.textures[r]=new hn({width:e,height:t,depth:i.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:un,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new To(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Jt=class extends Vl{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},Aa=class extends hn{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Zt,this.minFilter=Zt,this.wrapR=jn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Wl=class extends hn{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Zt,this.minFilter=Zt,this.wrapR=jn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var Xe=class n{static{this.prototype.isMatrix4=!0}constructor(e,t,i,s,r,o,a,c,l,u,h,f,d,g,_,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,c,l,u,h,f,d,g,_,p)}set(e,t,i,s,r,o,a,c,l,u,h,f,d,g,_,p){let m=this.elements;return m[0]=e,m[4]=t,m[8]=i,m[12]=s,m[1]=r,m[5]=o,m[9]=a,m[13]=c,m[2]=l,m[6]=u,m[10]=h,m[14]=f,m[3]=d,m[7]=g,m[11]=_,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,i=e.elements,s=1/so.setFromMatrixColumn(e,0).length(),r=1/so.setFromMatrixColumn(e,1).length(),o=1/so.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,s=e.y,r=e.z,o=Math.cos(i),a=Math.sin(i),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){let f=o*u,d=o*h,g=a*u,_=a*h;t[0]=c*u,t[4]=-c*h,t[8]=l,t[1]=d+g*l,t[5]=f-_*l,t[9]=-a*c,t[2]=_-f*l,t[6]=g+d*l,t[10]=o*c}else if(e.order==="YXZ"){let f=c*u,d=c*h,g=l*u,_=l*h;t[0]=f+_*a,t[4]=g*a-d,t[8]=o*l,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=d*a-g,t[6]=_+f*a,t[10]=o*c}else if(e.order==="ZXY"){let f=c*u,d=c*h,g=l*u,_=l*h;t[0]=f-_*a,t[4]=-o*h,t[8]=g+d*a,t[1]=d+g*a,t[5]=o*u,t[9]=_-f*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){let f=o*u,d=o*h,g=a*u,_=a*h;t[0]=c*u,t[4]=g*l-d,t[8]=f*l+_,t[1]=c*h,t[5]=_*l+f,t[9]=d*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){let f=o*c,d=o*l,g=a*c,_=a*l;t[0]=c*u,t[4]=_-f*h,t[8]=g*h+d,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-l*u,t[6]=d*h+g,t[10]=f-_*h}else if(e.order==="XZY"){let f=o*c,d=o*l,g=a*c,_=a*l;t[0]=c*u,t[4]=-h,t[8]=l*u,t[1]=f*h+_,t[5]=o*u,t[9]=d*h-g,t[2]=g*h-d,t[6]=a*u,t[10]=_*h+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Wy,e,Xy)}lookAt(e,t,i){let s=this.elements;return oi.subVectors(e,t),oi.lengthSq()===0&&(oi.z=1),oi.normalize(),Ns.crossVectors(i,oi),Ns.lengthSq()===0&&(Math.abs(i.z)===1?oi.x+=1e-4:oi.z+=1e-4,oi.normalize(),Ns.crossVectors(i,oi)),Ns.normalize(),cl.crossVectors(oi,Ns),s[0]=Ns.x,s[4]=cl.x,s[8]=oi.x,s[1]=Ns.y,s[5]=cl.y,s[9]=oi.y,s[2]=Ns.z,s[6]=cl.z,s[10]=oi.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[4],c=i[8],l=i[12],u=i[1],h=i[5],f=i[9],d=i[13],g=i[2],_=i[6],p=i[10],m=i[14],y=i[3],v=i[7],S=i[11],E=i[15],M=s[0],x=s[4],b=s[8],R=s[12],I=s[1],A=s[5],L=s[9],B=s[13],P=s[2],H=s[6],K=s[10],$=s[14],X=s[3],G=s[7],J=s[11],se=s[15];return r[0]=o*M+a*I+c*P+l*X,r[4]=o*x+a*A+c*H+l*G,r[8]=o*b+a*L+c*K+l*J,r[12]=o*R+a*B+c*$+l*se,r[1]=u*M+h*I+f*P+d*X,r[5]=u*x+h*A+f*H+d*G,r[9]=u*b+h*L+f*K+d*J,r[13]=u*R+h*B+f*$+d*se,r[2]=g*M+_*I+p*P+m*X,r[6]=g*x+_*A+p*H+m*G,r[10]=g*b+_*L+p*K+m*J,r[14]=g*R+_*B+p*$+m*se,r[3]=y*M+v*I+S*P+E*X,r[7]=y*x+v*A+S*H+E*G,r[11]=y*b+v*L+S*K+E*J,r[15]=y*R+v*B+S*$+E*se,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],u=e[2],h=e[6],f=e[10],d=e[14],g=e[3],_=e[7],p=e[11],m=e[15],y=c*d-l*f,v=a*d-l*h,S=a*f-c*h,E=o*d-l*u,M=o*f-c*u,x=o*h-a*u;return t*(_*y-p*v+m*S)-i*(g*y-p*E+m*M)+s*(g*v-_*E+m*x)-r*(g*S-_*M+p*x)}determinantAffine(){let e=this.elements,t=e[0],i=e[4],s=e[8],r=e[1],o=e[5],a=e[9],c=e[2],l=e[6],u=e[10];return t*(o*u-a*l)-i*(r*u-a*c)+s*(r*l-o*c)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],h=e[9],f=e[10],d=e[11],g=e[12],_=e[13],p=e[14],m=e[15],y=t*a-i*o,v=t*c-s*o,S=t*l-r*o,E=i*c-s*a,M=i*l-r*a,x=s*l-r*c,b=u*_-h*g,R=u*p-f*g,I=u*m-d*g,A=h*p-f*_,L=h*m-d*_,B=f*m-d*p,P=y*B-v*L+S*A+E*I-M*R+x*b;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let H=1/P;return e[0]=(a*B-c*L+l*A)*H,e[1]=(s*L-i*B-r*A)*H,e[2]=(_*x-p*M+m*E)*H,e[3]=(f*M-h*x-d*E)*H,e[4]=(c*I-o*B-l*R)*H,e[5]=(t*B-s*I+r*R)*H,e[6]=(p*S-g*x-m*v)*H,e[7]=(u*x-f*S+d*v)*H,e[8]=(o*L-a*I+l*b)*H,e[9]=(i*I-t*L-r*b)*H,e[10]=(g*M-_*S+m*y)*H,e[11]=(h*S-u*M-d*y)*H,e[12]=(a*R-o*A-c*b)*H,e[13]=(t*A-i*R+s*b)*H,e[14]=(_*v-g*E-p*y)*H,e[15]=(u*E-h*v+f*y)*H,this}scale(e){let t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),s=Math.sin(t),r=1-i,o=e.x,a=e.y,c=e.z,l=r*o,u=r*a;return this.set(l*o+i,l*a-s*c,l*c+s*a,0,l*a+s*c,u*a+i,u*c-s*o,0,l*c-s*a,u*c+s*o,r*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,o){return this.set(1,i,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){let s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,u=o+o,h=a+a,f=r*l,d=r*u,g=r*h,_=o*u,p=o*h,m=a*h,y=c*l,v=c*u,S=c*h,E=i.x,M=i.y,x=i.z;return s[0]=(1-(_+m))*E,s[1]=(d+S)*E,s[2]=(g-v)*E,s[3]=0,s[4]=(d-S)*M,s[5]=(1-(f+m))*M,s[6]=(p+y)*M,s[7]=0,s[8]=(g+v)*x,s[9]=(p-y)*x,s[10]=(1-(f+_))*x,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return i.set(1,1,1),t.identity(),this;let o=so.set(s[0],s[1],s[2]).length(),a=so.set(s[4],s[5],s[6]).length(),c=so.set(s[8],s[9],s[10]).length();r<0&&(o=-o),Ii.copy(this);let l=1/o,u=1/a,h=1/c;return Ii.elements[0]*=l,Ii.elements[1]*=l,Ii.elements[2]*=l,Ii.elements[4]*=u,Ii.elements[5]*=u,Ii.elements[6]*=u,Ii.elements[8]*=h,Ii.elements[9]*=h,Ii.elements[10]*=h,t.setFromRotationMatrix(Ii),i.x=o,i.y=a,i.z=c,this}makePerspective(e,t,i,s,r,o,a=mi,c=!1){let l=this.elements,u=2*r/(t-e),h=2*r/(i-s),f=(t+e)/(t-e),d=(i+s)/(i-s),g,_;if(c)g=r/(o-r),_=o*r/(o-r);else if(a===mi)g=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===So)g=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,s,r,o,a=mi,c=!1){let l=this.elements,u=2/(t-e),h=2/(i-s),f=-(t+e)/(t-e),d=-(i+s)/(i-s),g,_;if(c)g=1/(o-r),_=o/(o-r);else if(a===mi)g=-2/(o-r),_=-(o+r)/(o-r);else if(a===So)g=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=h,l[9]=0,l[13]=d,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},so=new N,Ii=new Xe,Wy=new N(0,0,0),Xy=new N(1,1,1),Ns=new N,cl=new N,oi=new N,w0=new Xe,A0=new Rn,fs=class n{constructor(e=0,t=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],u=s[9],h=s[2],f=s[6],d=s[10];switch(t){case"XYZ":this._y=Math.asin(st(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-st(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(st(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,d),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-st(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(st(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-st(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,d),this._y=0);break;default:Be("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return w0.makeRotationFromQuaternion(e),this.setFromRotationMatrix(w0,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return A0.setFromEuler(this),this.setFromQuaternion(A0,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};fs.DEFAULT_ORDER="XYZ";var Ra=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},qy=0,R0=new N,ro=new Rn,ss=new Xe,ll=new N,fa=new N,Yy=new N,$y=new Rn,C0=new N(1,0,0),P0=new N(0,1,0),I0=new N(0,0,1),L0={type:"added"},Ky={type:"removed"},oo={type:"childadded",child:null},Af={type:"childremoved",child:null},Ft=class n extends Gi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:qy++}),this.uuid=Yi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let e=new N,t=new fs,i=new Rn,s=new N(1,1,1);function r(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Xe},normalMatrix:{value:new qe}}),this.matrix=new Xe,this.matrixWorld=new Xe,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ra,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ro.setFromAxisAngle(e,t),this.quaternion.multiply(ro),this}rotateOnWorldAxis(e,t){return ro.setFromAxisAngle(e,t),this.quaternion.premultiply(ro),this}rotateX(e){return this.rotateOnAxis(C0,e)}rotateY(e){return this.rotateOnAxis(P0,e)}rotateZ(e){return this.rotateOnAxis(I0,e)}translateOnAxis(e,t){return R0.copy(e).applyQuaternion(this.quaternion),this.position.add(R0.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(C0,e)}translateY(e){return this.translateOnAxis(P0,e)}translateZ(e){return this.translateOnAxis(I0,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ss.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?ll.copy(e):ll.set(e,t,i);let s=this.parent;this.updateWorldMatrix(!0,!1),fa.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ss.lookAt(fa,ll,this.up):ss.lookAt(ll,fa,this.up),this.quaternion.setFromRotationMatrix(ss),s&&(ss.extractRotation(s.matrixWorld),ro.setFromRotationMatrix(ss),this.quaternion.premultiply(ro.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ve("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(L0),oo.child=e,this.dispatchEvent(oo),oo.child=null):Ve("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Ky),Af.child=e,this.dispatchEvent(Af),Af.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ss.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ss.multiply(e.parent.matrixWorld)),e.applyMatrix4(ss),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(L0),oo.child=e,this.dispatchEvent(oo),oo.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){let o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fa,e,Yy),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fa,$y,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*s,r[13]+=i-r[1]*t-r[5]*i-r[9]*s,r[14]+=s-r[2]*t-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,i)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){let h=c[l];r(e.shapes,h)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){let a=o(e.geometries),c=o(e.materials),l=o(e.textures),u=o(e.images),h=o(e.shapes),f=o(e.skeletons),d=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),f.length>0&&(i.skeletons=f),d.length>0&&(i.animations=d),g.length>0&&(i.nodes=g)}return i.object=s,i;function o(a){let c=[];for(let l in a){let u=a[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let s=e.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Ft.DEFAULT_UP=new N(0,1,0);Ft.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Yt=class extends Ft{constructor(){super(),this.isGroup=!0,this.type="Group"}},Zy={type:"move"},Eo=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Yt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Yt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Yt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(let _ of e.hand.values()){let p=t.getJointPose(_,i),m=this._getHandJoint(l,_);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.quaternion,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}let u=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],f=u.position.distanceTo(h.position),d=.02,g=.005;l.inputState.pinching&&f>d+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=d-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.quaternion,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.quaternion,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Zy)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new Yt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},qg={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Os={h:0,s:0,l:0},ul={h:0,s:0,l:0};function Rf(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}var ae=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Dt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Je.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=Je.workingColorSpace){return this.r=e,this.g=t,this.b=i,Je.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=Je.workingColorSpace){if(e=Ad(e,1),t=st(t,0,1),i=st(i,0,1),t===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+t):i+t-i*t,o=2*i-r;this.r=Rf(o,r,e+1/3),this.g=Rf(o,r,e),this.b=Rf(o,r,e-1/3)}return Je.colorSpaceToWorking(this,s),this}setStyle(e,t=Dt){function i(r){r!==void 0&&parseFloat(r)<1&&Be("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,t);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Be("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);Be("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Dt){let i=qg[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Be("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=us(e.r),this.g=us(e.g),this.b=us(e.b),this}copyLinearToSRGB(e){return this.r=xo(e.r),this.g=xo(e.g),this.b=xo(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Dt){return Je.workingToColorSpace(Fn.copy(this),e),Math.round(st(Fn.r*255,0,255))*65536+Math.round(st(Fn.g*255,0,255))*256+Math.round(st(Fn.b*255,0,255))}getHexString(e=Dt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Je.workingColorSpace){Je.workingToColorSpace(Fn.copy(this),t);let i=Fn.r,s=Fn.g,r=Fn.b,o=Math.max(i,s,r),a=Math.min(i,s,r),c,l,u=(a+o)/2;if(a===o)c=0,l=0;else{let h=o-a;switch(l=u<=.5?h/(o+a):h/(2-o-a),o){case i:c=(s-r)/h+(s<r?6:0);break;case s:c=(r-i)/h+2;break;case r:c=(i-s)/h+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=Je.workingColorSpace){return Je.workingToColorSpace(Fn.copy(this),t),e.r=Fn.r,e.g=Fn.g,e.b=Fn.b,e}getStyle(e=Dt){Je.workingToColorSpace(Fn.copy(this),e);let t=Fn.r,i=Fn.g,s=Fn.b;return e!==Dt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(Os),this.setHSL(Os.h+e,Os.s+t,Os.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Os),e.getHSL(ul);let i=Ma(Os.h,ul.h,t),s=Ma(Os.s,ul.s,t),r=Ma(Os.l,ul.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Fn=new ae;ae.NAMES=qg;var Ca=class n{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new ae(e),this.near=t,this.far=i}clone(){return new n(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},wo=class extends Ft{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new fs,this.environmentIntensity=1,this.environmentRotation=new fs,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Li=new N,rs=new N,Cf=new N,os=new N,ao=new N,co=new N,D0=new N,Pf=new N,If=new N,Lf=new N,Df=new _t,Nf=new _t,Of=new _t,zs=class n{constructor(e=new N,t=new N,i=new N){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),Li.subVectors(e,t),s.cross(Li);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){Li.subVectors(s,t),rs.subVectors(i,t),Cf.subVectors(e,t);let o=Li.dot(Li),a=Li.dot(rs),c=Li.dot(Cf),l=rs.dot(rs),u=rs.dot(Cf),h=o*l-a*a;if(h===0)return r.set(0,0,0),null;let f=1/h,d=(l*c-a*u)*f,g=(o*u-a*c)*f;return r.set(1-d-g,g,d)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,os)===null?!1:os.x>=0&&os.y>=0&&os.x+os.y<=1}static getInterpolation(e,t,i,s,r,o,a,c){return this.getBarycoord(e,t,i,s,os)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,os.x),c.addScaledVector(o,os.y),c.addScaledVector(a,os.z),c)}static getInterpolatedAttribute(e,t,i,s,r,o){return Df.setScalar(0),Nf.setScalar(0),Of.setScalar(0),Df.fromBufferAttribute(e,t),Nf.fromBufferAttribute(e,i),Of.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(Df,r.x),o.addScaledVector(Nf,r.y),o.addScaledVector(Of,r.z),o}static isFrontFacing(e,t,i,s){return Li.subVectors(i,t),rs.subVectors(e,t),Li.cross(rs).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Li.subVectors(this.c,this.b),rs.subVectors(this.a,this.b),Li.cross(rs).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return n.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,s=this.b,r=this.c,o,a;ao.subVectors(s,i),co.subVectors(r,i),Pf.subVectors(e,i);let c=ao.dot(Pf),l=co.dot(Pf);if(c<=0&&l<=0)return t.copy(i);If.subVectors(e,s);let u=ao.dot(If),h=co.dot(If);if(u>=0&&h<=u)return t.copy(s);let f=c*h-u*l;if(f<=0&&c>=0&&u<=0&&c-u>0)return o=c/(c-u),t.copy(i).addScaledVector(ao,o);Lf.subVectors(e,r);let d=ao.dot(Lf),g=co.dot(Lf);if(g>=0&&d<=g)return t.copy(r);let _=d*l-c*g;if(_<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(i).addScaledVector(co,a);let p=u*g-d*h;if(p<=0&&h-u>=0&&d-g>=0)return D0.subVectors(r,s),a=(h-u)/(h-u+(d-g)),t.copy(s).addScaledVector(D0,a);let m=1/(p+_+f);return o=_*m,a=f*m,t.copy(i).addScaledVector(ao,o).addScaledVector(co,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},ci=class{constructor(e=new N(1/0,1/0,1/0),t=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Di.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Di.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=Di.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Di):Di.fromBufferAttribute(r,o),Di.applyMatrix4(e.matrixWorld),this.expandByPoint(Di);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),hl.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),hl.copy(i.boundingBox)),hl.applyMatrix4(e.matrixWorld),this.union(hl)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Di),Di.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(da),fl.subVectors(this.max,da),lo.subVectors(e.a,da),uo.subVectors(e.b,da),ho.subVectors(e.c,da),Us.subVectors(uo,lo),Fs.subVectors(ho,uo),fr.subVectors(lo,ho);let t=[0,-Us.z,Us.y,0,-Fs.z,Fs.y,0,-fr.z,fr.y,Us.z,0,-Us.x,Fs.z,0,-Fs.x,fr.z,0,-fr.x,-Us.y,Us.x,0,-Fs.y,Fs.x,0,-fr.y,fr.x,0];return!Uf(t,lo,uo,ho,fl)||(t=[1,0,0,0,1,0,0,0,1],!Uf(t,lo,uo,ho,fl))?!1:(dl.crossVectors(Us,Fs),t=[dl.x,dl.y,dl.z],Uf(t,lo,uo,ho,fl))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Di).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Di).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(as[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),as[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),as[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),as[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),as[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),as[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),as[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),as[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(as),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},as=[new N,new N,new N,new N,new N,new N,new N,new N],Di=new N,hl=new ci,lo=new N,uo=new N,ho=new N,Us=new N,Fs=new N,fr=new N,da=new N,fl=new N,dl=new N,dr=new N;function Uf(n,e,t,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){dr.fromArray(n,r);let a=s.x*Math.abs(dr.x)+s.y*Math.abs(dr.y)+s.z*Math.abs(dr.z),c=e.dot(dr),l=t.dot(dr),u=i.dot(dr);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return!1}return!0}var nn=new N,pl=new Ee,Jy=0,gt=class extends Gi{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Jy++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Ed,this.updateRanges=[],this.gpuType=ui,this.version=0,this._normalizationScale=e!==void 0?ju(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)pl.fromBufferAttribute(this,t),pl.applyMatrix3(e),this.setXY(t,pl.x,pl.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)nn.fromBufferAttribute(this,t),nn.applyMatrix3(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)nn.fromBufferAttribute(this,t),nn.applyMatrix4(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)nn.fromBufferAttribute(this,t),nn.applyNormalMatrix(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)nn.fromBufferAttribute(this,t),nn.transformDirection(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=this._denormalize(i)),i}setComponent(e,t,i){return this.normalized&&(i=this._normalize(i)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){let t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):Cd(e,this.array)}_normalize(e){let t=this._normalizationScale;return t!==void 0?Math.round(e*t):Pd(e,this.array)}};var Pa=class extends gt{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var Ia=class extends gt{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var rt=class extends gt{constructor(e,t,i){super(new Float32Array(e),t,i)}},jy=new ci,pa=new N,Ff=new N,Qn=class{constructor(e=new N,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):jy.setFromPoints(e).getCenter(i);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;pa.subVectors(e,this.center);let t=pa.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(pa,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ff.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(pa.copy(e.center).add(Ff)),this.expandByPoint(pa.copy(e.center).sub(Ff))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Qy=0,pi=new Xe,Bf=new Ft,fo=new N,ai=new ci,ma=new ci,xn=new N,vt=class n extends Gi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Qy++}),this.uuid=Yi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ty(e)?Ia:Pa)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new qe().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return pi.makeRotationFromQuaternion(e),this.applyMatrix4(pi),this}rotateX(e){return pi.makeRotationX(e),this.applyMatrix4(pi),this}rotateY(e){return pi.makeRotationY(e),this.applyMatrix4(pi),this}rotateZ(e){return pi.makeRotationZ(e),this.applyMatrix4(pi),this}translate(e,t,i){return pi.makeTranslation(e,t,i),this.applyMatrix4(pi),this}scale(e,t,i){return pi.makeScale(e,t,i),this.applyMatrix4(pi),this}lookAt(e){return Bf.lookAt(e),Bf.updateMatrix(),this.applyMatrix4(Bf.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(fo).negate(),this.translate(fo.x,fo.y,fo.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new rt(i,3))}else{let i=Math.min(e.length,t.count);for(let s=0;s<i;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Be("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ci);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ve("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){let r=t[i];ai.setFromBufferAttribute(r),this.morphTargetsRelative?(xn.addVectors(this.boundingBox.min,ai.min),this.boundingBox.expandByPoint(xn),xn.addVectors(this.boundingBox.max,ai.max),this.boundingBox.expandByPoint(xn)):(this.boundingBox.expandByPoint(ai.min),this.boundingBox.expandByPoint(ai.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ve('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Qn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ve("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(e){let i=this.boundingSphere.center;if(ai.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];ma.setFromBufferAttribute(a),this.morphTargetsRelative?(xn.addVectors(ai.min,ma.min),ai.expandByPoint(xn),xn.addVectors(ai.max,ma.max),ai.expandByPoint(xn)):(ai.expandByPoint(ma.min),ai.expandByPoint(ma.max))}ai.getCenter(i);let s=0;for(let r=0,o=e.count;r<o;r++)xn.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(xn));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)xn.fromBufferAttribute(a,l),c&&(fo.fromBufferAttribute(e,l),xn.add(fo)),s=Math.max(s,i.distanceToSquared(xn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ve('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ve("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,s=t.normal,r=t.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==i.count)&&(o=new gt(new Float32Array(4*i.count),4),this.setAttribute("tangent",o));let a=[],c=[],l=new Uint8Array(i.count);for(let R=0;R<i.count;R++)a[R]=new N,c[R]=new N;let u=new N,h=new N,f=new N,d=new Ee,g=new Ee,_=new Ee,p=new N,m=new N;function y(R,I,A){l[R]=l[I]=l[A]=1,u.fromBufferAttribute(i,R),h.fromBufferAttribute(i,I),f.fromBufferAttribute(i,A),d.fromBufferAttribute(r,R),g.fromBufferAttribute(r,I),_.fromBufferAttribute(r,A),h.sub(u),f.sub(u),g.sub(d),_.sub(d);let L=1/(g.x*_.y-_.x*g.y);isFinite(L)&&(p.copy(h).multiplyScalar(_.y).addScaledVector(f,-g.y).multiplyScalar(L),m.copy(f).multiplyScalar(g.x).addScaledVector(h,-_.x).multiplyScalar(L),a[R].add(p),a[I].add(p),a[A].add(p),c[R].add(m),c[I].add(m),c[A].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let R=0,I=v.length;R<I;++R){let A=v[R],L=A.start,B=A.count;for(let P=L,H=L+B;P<H;P+=3)y(e.getX(P+0),e.getX(P+1),e.getX(P+2))}let S=new N,E=new N,M=new N,x=new N;function b(R){M.fromBufferAttribute(s,R),x.copy(M);let I=a[R];S.copy(I),S.sub(M.multiplyScalar(M.dot(I))).normalize(),E.crossVectors(x,I);let L=E.dot(c[R])<0?-1:1;o.setXYZW(R,S.x,S.y,S.z,L)}for(let R=0,I=i.count;R<I;++R)l[R]&&b(R);this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new gt(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,d=i.count;f<d;f++)i.setXYZ(f,0,0,0);let s=new N,r=new N,o=new N,a=new N,c=new N,l=new N,u=new N,h=new N;if(e)for(let f=0,d=e.count;f<d;f+=3){let g=e.getX(f+0),_=e.getX(f+1),p=e.getX(f+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,p),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),a.fromBufferAttribute(i,g),c.fromBufferAttribute(i,_),l.fromBufferAttribute(i,p),a.add(u),c.add(u),l.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(p,l.x,l.y,l.z)}else for(let f=0,d=t.count;f<d;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),i.setXYZ(f+0,u.x,u.y,u.z),i.setXYZ(f+1,u.x,u.y,u.z),i.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)xn.fromBufferAttribute(e,t),xn.normalize(),e.setXYZ(t,xn.x,xn.y,xn.z)}toNonIndexed(){function e(a,c){let l=a.array,u=a.itemSize,h=a.normalized,f=new l.constructor(c.length*u),d=0,g=0;for(let _=0,p=c.length;_<p;_++){a.isInterleavedBufferAttribute?d=c[_]*a.data.stride+a.offset:d=c[_]*u;for(let m=0;m<u;m++)f[g++]=l[d++]}return new gt(f,u,h)}if(this.index===null)return Be("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new n,i=this.index.array,s=this.attributes;for(let a in s){let c=s[a],l=e(c,i);t.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let u=0,h=l.length;u<h;u++){let f=l[u],d=e(f,i);c.push(d)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let c in i){let l=i[c];e.data.attributes[c]=l.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],u=[];for(let h=0,f=l.length;h<f;h++){let d=l[h];u.push(d.toJSON(e.data))}u.length>0&&(s[c]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone());let s=e.attributes;for(let l in s){let u=s[l];this.setAttribute(l,u.clone(t))}let r=e.morphAttributes;for(let l in r){let u=[],h=r[l];for(let f=0,d=h.length;f<d;f++)u.push(h[f].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let l=0,u=o.length;l<u;l++){let h=o[l];this.addGroup(h.start,h.count,h.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Hs=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Ed,this.updateRanges=[],this.version=0,this.uuid=Yi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[i+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=N0(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=this.array.slice(0).buffer);let i=new this.array.constructor(e.arrayBuffers[t]),s=new this.constructor(i,this.stride);return s.setUsage(this.usage),s}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=N0(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=Array.from(new Uint32Array(this.array.slice(0).buffer)));let i={uuid:this.uuid,buffer:t,type:this.array.constructor.name,stride:this.stride};return i.usage=this.usage,i}};function N0(n){return n.buffer._uuid===void 0&&(n.buffer._uuid=Yi()),n.byteOffset===0&&n.byteLength===n.buffer.byteLength?n.buffer._uuid:n.buffer._uuid+":"+n.byteOffset+":"+n.byteLength}var Xn=new N,Gs=class n{constructor(e,t,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=s,this._normalizationScale=e!==void 0?ju(e.array):void 0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Xn.fromBufferAttribute(this,t),Xn.applyMatrix4(e),this.setXYZ(t,Xn.x,Xn.y,Xn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Xn.fromBufferAttribute(this,t),Xn.applyNormalMatrix(e),this.setXYZ(t,Xn.x,Xn.y,Xn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Xn.fromBufferAttribute(this,t),Xn.transformDirection(e),this.setXYZ(t,Xn.x,Xn.y,Xn.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=this._denormalize(i)),i}setComponent(e,t,i){return this.normalized&&(i=this._normalize(i)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=this._denormalize(t)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=this._denormalize(t)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=this._denormalize(t)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=this._denormalize(t)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),i=this._normalize(i)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s),r=this._normalize(r)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){wa("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new gt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new n(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){wa("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(e){let t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):Cd(e,this.data.array)}_normalize(e){let t=this._normalizationScale;return t!==void 0?Math.round(e*t):Pd(e,this.data.array)}},kf=new N,ev=new N,tv=new qe,Ni=class{constructor(e=new N(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let s=kf.subVectors(i,t).cross(ev.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){let s=e.delta(kf),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let o=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(s,o)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||tv.getNormalMatrix(e),s=this.coplanarPoint(kf).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},nv=0,ei=class extends Gi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:nv++}),this.uuid=Yi(),this.name="",this.type="Material",this.blending=Bo,this.side=Xi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=hd,this.blendDst=fd,this.blendEquation=Cr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ae(0,0,0),this.blendAlpha=0,this.depthFunc=yo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ug,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Nl,this.stencilZFail=Nl,this.stencilZPass=Nl,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){Be(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Be(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(i.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(i.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(i.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(i.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new ae().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new Ni().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new Ee().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Ee().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var cs=new N,zf=new N,ml=new N,gl=new N,vr=class{constructor(e=new N,t=new N(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,cs)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=cs.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(cs.copy(this.origin).addScaledVector(this.direction,t),cs.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){zf.copy(e).add(t).multiplyScalar(.5),ml.copy(t).sub(e).normalize(),gl.copy(this.origin).sub(zf);let r=e.distanceTo(t)*.5,o=-this.direction.dot(ml),a=gl.dot(this.direction),c=-gl.dot(ml),l=gl.lengthSq(),u=Math.abs(1-o*o),h,f,d,g;if(u>0)if(h=o*c-a,f=o*a-c,g=r*u,h>=0)if(f>=-g)if(f<=g){let _=1/u;h*=_,f*=_,d=h*(h+o*f+2*a)+f*(o*h+f+2*c)+l}else f=r,h=Math.max(0,-(o*f+a)),d=-h*h+f*(f+2*c)+l;else f=-r,h=Math.max(0,-(o*f+a)),d=-h*h+f*(f+2*c)+l;else f<=-g?(h=Math.max(0,-(-o*r+a)),f=h>0?-r:Math.min(Math.max(-r,-c),r),d=-h*h+f*(f+2*c)+l):f<=g?(h=0,f=Math.min(Math.max(-r,-c),r),d=f*(f+2*c)+l):(h=Math.max(0,-(o*r+a)),f=h>0?r:Math.min(Math.max(-r,-c),r),d=-h*h+f*(f+2*c)+l);else f=o>0?-r:r,h=Math.max(0,-(o*f+a)),d=-h*h+f*(f+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(zf).addScaledVector(ml,f),d}intersectSphere(e,t){if(e.radius<0)return null;cs.subVectors(e.center,this.origin);let i=cs.dot(this.direction),s=cs.dot(cs)-i*i,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=i-o,c=i+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,o,a,c,l=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,f=this.origin;return l>=0?(i=(e.min.x-f.x)*l,s=(e.max.x-f.x)*l):(i=(e.max.x-f.x)*l,s=(e.min.x-f.x)*l),u>=0?(r=(e.min.y-f.y)*u,o=(e.max.y-f.y)*u):(r=(e.max.y-f.y)*u,o=(e.min.y-f.y)*u),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),h>=0?(a=(e.min.z-f.z)*h,c=(e.max.z-f.z)*h):(a=(e.max.z-f.z)*h,c=(e.min.z-f.z)*h),i>c||a>s)||((a>i||i!==i)&&(i=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,cs)!==null}intersectTriangle(e,t,i,s,r){let o=this.origin,a=this.direction,c=a.x,l=a.y,u=a.z,h=e.x-o.x,f=e.y-o.y,d=e.z-o.z,g=t.x-o.x,_=t.y-o.y,p=t.z-o.z,m=i.x-o.x,y=i.y-o.y,v=i.z-o.z,S=Math.abs(c),E=Math.abs(l),M=Math.abs(u),x,b,R,I,A,L,B,P,H,K,$,X;if(S>=E&&S>=M?(R=c,L=h,H=g,X=m,c>=0?(x=l,b=u,I=f,A=d,B=_,P=p,K=y,$=v):(x=u,b=l,I=d,A=f,B=p,P=_,K=v,$=y)):E>=M?(R=l,L=f,H=_,X=y,l>=0?(x=u,b=c,I=d,A=h,B=p,P=g,K=v,$=m):(x=c,b=u,I=h,A=d,B=g,P=p,K=m,$=v)):(R=u,L=d,H=p,X=v,u>=0?(x=c,b=l,I=h,A=f,B=g,P=_,K=m,$=y):(x=l,b=c,I=f,A=h,B=_,P=g,K=y,$=m)),R===0)return null;let G=x/R,J=b/R,se=1/R,ye=I-G*L,Le=A-J*L,j=B-G*H,D=P-J*H,O=K-G*X,W=$-J*X,k=O*D-W*j,ee=ye*W-Le*O,le=j*Le-D*ye;if(s){if(k<0||ee<0||le<0)return null}else if((k<0||ee<0||le<0)&&(k>0||ee>0||le>0))return null;let oe=k+ee+le;if(oe===0)return null;let Ie=se*(k*L+ee*H+le*X);return(oe>0?Ie<0:Ie>0)?null:this.at(Ie/oe,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},yn=class extends ei{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ae(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fs,this.combine=dd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},O0=new Xe,pr=new vr,_l=new Qn,U0=new N,xl=new N,yl=new N,vl=new N,Hf=new N,Sl=new N,F0=new N,Ml=new N,Ye=class extends Ft{constructor(e=new vt,t=new yn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){Sl.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let u=a[c],h=r[c];u!==0&&(Hf.fromBufferAttribute(h,e),o?Sl.addScaledVector(Hf,u):Sl.addScaledVector(Hf.sub(t),u))}t.add(Sl)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),_l.copy(i.boundingSphere),_l.applyMatrix4(r),pr.copy(e.ray).recast(e.near),!(_l.containsPoint(pr.origin)===!1&&(pr.intersectSphere(_l,U0)===null||pr.origin.distanceToSquared(U0)>(e.far-e.near)**2))&&(O0.copy(r).invert(),pr.copy(e.ray).applyMatrix4(O0),!(i.boundingBox!==null&&pr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,pr)))}_computeIntersections(e,t,i){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,f=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){let p=f[g],m=o[p.materialIndex],y=Math.max(p.start,d.start),v=Math.min(a.count,Math.min(p.start+p.count,d.start+d.count));for(let S=y,E=v;S<E;S+=3){let M=a.getX(S),x=a.getX(S+1),b=a.getX(S+2);s=bl(this,m,e,i,l,u,h,M,x,b),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{let g=Math.max(0,d.start),_=Math.min(a.count,d.start+d.count);for(let p=g,m=_;p<m;p+=3){let y=a.getX(p),v=a.getX(p+1),S=a.getX(p+2);s=bl(this,o,e,i,l,u,h,y,v,S),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){let p=f[g],m=o[p.materialIndex],y=Math.max(p.start,d.start),v=Math.min(c.count,Math.min(p.start+p.count,d.start+d.count));for(let S=y,E=v;S<E;S+=3){let M=S,x=S+1,b=S+2;s=bl(this,m,e,i,l,u,h,M,x,b),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{let g=Math.max(0,d.start),_=Math.min(c.count,d.start+d.count);for(let p=g,m=_;p<m;p+=3){let y=p,v=p+1,S=p+2;s=bl(this,o,e,i,l,u,h,y,v,S),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}};function iv(n,e,t,i,s,r,o,a){let c;if(e.side===Cn?c=i.intersectTriangle(o,r,s,!0,a):c=i.intersectTriangle(s,r,o,e.side===Xi,a),c===null)return null;Ml.copy(a),Ml.applyMatrix4(n.matrixWorld);let l=t.ray.origin.distanceTo(Ml);return l<t.near||l>t.far?null:{distance:l,point:Ml.clone(),object:n}}function bl(n,e,t,i,s,r,o,a,c,l){n.getVertexPosition(a,xl),n.getVertexPosition(c,yl),n.getVertexPosition(l,vl);let u=iv(n,e,t,i,xl,yl,vl,F0);if(u){let h=new N;zs.getBarycoord(F0,xl,yl,vl,h),s&&(u.uv=zs.getInterpolatedAttribute(s,a,c,l,h,new Ee)),r&&(u.uv1=zs.getInterpolatedAttribute(r,a,c,l,h,new Ee)),o&&(u.normal=zs.getInterpolatedAttribute(o,a,c,l,h,new N),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));let f={a,b:c,c:l,normal:new N,materialIndex:0};zs.getNormal(xl,yl,vl,f.normal),u.face=f,u.barycoord=h}return u}var ga=new _t,B0=new _t,k0=new _t,sv=new _t,z0=new Xe,Tl=new N,Gf=new Qn,H0=new Xe,Vf=new vr,La=class extends Ye{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Zf,this.bindMatrix=new Xe,this.bindMatrixInverse=new Xe,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new ci),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,Tl),this.boundingBox.expandByPoint(Tl)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Qn),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,Tl),this.boundingSphere.expandByPoint(Tl)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}raycast(e,t){let i=this.material,s=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Gf.copy(this.boundingSphere),Gf.applyMatrix4(s),e.ray.intersectsSphere(Gf)!==!1&&(H0.copy(s).invert(),Vf.copy(e.ray).applyMatrix4(H0),!(this.boundingBox!==null&&Vf.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Vf)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new _t,t=this.geometry.attributes.skinWeight;for(let i=0,s=t.count;i<s;i++){e.fromBufferAttribute(t,i);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(i,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Zf?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Lg?this.bindMatrixInverse.copy(this.bindMatrix).invert():Be("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let i=this.skeleton,s=this.geometry;B0.fromBufferAttribute(s.attributes.skinIndex,e),k0.fromBufferAttribute(s.attributes.skinWeight,e),t.isVector4?(ga.copy(t),t.set(0,0,0,0)):(ga.set(t.x,t.y,t.z,1),t.set(0,0,0)),ga.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){let o=k0.getComponent(r);if(o!==0){let a=B0.getComponent(r);z0.multiplyMatrices(i.bones[a].matrixWorld,i.boneInverses[a]),t.addScaledVector(sv.copy(ga).applyMatrix4(z0),o)}}return t.isVector4&&(t.w=ga.w),t.applyMatrix4(this.bindMatrixInverse)}},Ao=class extends Ft{constructor(){super(),this.isBone=!0,this.type="Bone"}},Ro=class extends hn{constructor(e=null,t=1,i=1,s,r,o,a,c,l=Zt,u=Zt,h,f){super(null,o,a,c,l,u,s,r,h,f),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},G0=new Xe,rv=new Xe,Da=class n{constructor(e=[],t=[]){this.uuid=Yi(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.previousBoneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Be("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,s=this.bones.length;i<s;i++)this.boneInverses.push(new Xe)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let i=new Xe;this.bones[e]&&i.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let i=this.bones[e];i&&i.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let i=this.bones[e];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){let e=this.bones,t=this.boneInverses,i=this.boneMatrices,s=this.boneTexture;for(let r=0,o=e.length;r<o;r++){let a=e[r]?e[r].matrixWorld:rv;G0.multiplyMatrices(a,t[r]),G0.toArray(i,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new n(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let i=new Ro(t,e,e,vi,ui);return i.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=i,this}getBoneByName(e){for(let t=0,i=this.bones.length;t<i;t++){let s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null),this.previousBoneTexture!==null&&(this.previousBoneTexture.dispose(),this.previousBoneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let i=0,s=e.bones.length;i<s;i++){let r=e.bones[i],o=t[r];o===void 0&&(Be("Skeleton: No bone found with UUID:",r),o=new Ao),this.bones.push(o),this.boneInverses.push(new Xe().fromArray(e.boneInverses[i]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,i=this.boneInverses;for(let s=0,r=t.length;s<r;s++){let o=t[s];e.bones.push(o.uuid);let a=i[s];e.boneInverses.push(a.toArray())}return e}},ds=class extends gt{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},po=new Xe,V0=new Xe,El=[],W0=new ci,ov=new Xe,_a=new Ye,xa=new Qn,Vs=class extends Ye{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ds(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,ov)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ci),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,po),W0.copy(e.boundingBox).applyMatrix4(po),this.boundingBox.union(W0)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Qn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,po),xa.copy(e.boundingSphere).applyMatrix4(po),this.boundingSphere.union(xa)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture!==null?e.morphTexture.clone():null,this.instanceColor=e.instanceColor!==null?e.instanceColor.clone():null,this.count=e.count,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,o=e*r+1;for(let a=0;a<i.length;a++)i[a]=s[o+a]}raycast(e,t){let i=this.matrixWorld,s=this.count;if(_a.geometry=this.geometry,_a.material=this.material,_a.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),xa.copy(this.boundingSphere),xa.applyMatrix4(i),e.ray.intersectsSphere(xa)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,po),V0.multiplyMatrices(i,po),_a.matrixWorld=V0,_a.raycast(e,El);for(let o=0,a=El.length;o<a;o++){let c=El[o];c.instanceId=r,c.object=this,t.push(c)}El.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new ds(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new Ro(new Float32Array(s*this.count),s,this.count,_u,ui));let r=this.morphTexture.source.data.data,o=0;for(let l=0;l<i.length;l++)o+=i[l];let a=this.geometry.morphTargetsRelative?1:1-o,c=s*e;return r[c]=a,r.set(i,c+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},mr=new Qn,av=new Ee(.5,.5),wl=new N,Ws=class{constructor(e=new Ni,t=new Ni,i=new Ni,s=new Ni,r=new Ni,o=new Ni){this.planes=[e,t,i,s,r,o]}set(e,t,i,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=mi,i=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],c=r[2],l=r[3],u=r[4],h=r[5],f=r[6],d=r[7],g=r[8],_=r[9],p=r[10],m=r[11],y=r[12],v=r[13],S=r[14],E=r[15];if(s[0].setComponents(l-o,d-u,m-g,E-y).normalize(),s[1].setComponents(l+o,d+u,m+g,E+y).normalize(),s[2].setComponents(l+a,d+h,m+_,E+v).normalize(),s[3].setComponents(l-a,d-h,m-_,E-v).normalize(),i)s[4].setComponents(c,f,p,S).normalize(),s[5].setComponents(l-c,d-f,m-p,E-S).normalize();else if(s[4].setComponents(l-c,d-f,m-p,E-S).normalize(),t===mi)s[5].setComponents(l+c,d+f,m+p,E+S).normalize();else if(t===So)s[5].setComponents(c,f,p,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),mr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),mr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(mr)}intersectsSprite(e){mr.center.set(0,0,0);let t=av.distanceTo(e.center);return mr.radius=.7071067811865476+t,mr.applyMatrix4(e.matrixWorld),this.intersectsSphere(mr)}intersectsSphere(e){let t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let s=t[i];if(wl.x=s.normal.x>0?e.max.x:e.min.x,wl.y=s.normal.y>0?e.max.y:e.min.y,wl.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(wl)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},X0=new Xe,Xl=class n{constructor(){this.coordinateSystem=mi,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,i=this._frustums;for(let s=0;s<t.length;s++){let r=t[s];X0.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),i[s]===void 0&&(i[s]=new Ws),i[s].setFromProjectionMatrix(X0,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){let t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,i=e._frustums;for(let s=0;s<e._count;s++)t[s]===void 0&&(t[s]=new Ws),t[s].copy(i[s]);return this._count=e._count,this}clone(){return new n().copy(this)}};var Co=class extends ei{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ae(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},ql=new N,Yl=new N,q0=new Xe,ya=new vr,Al=new Qn,Wf=new N,Y0=new N,Sr=class extends Ft{constructor(e=new vt,t=new Co){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)ql.fromBufferAttribute(t,s-1),Yl.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=ql.distanceTo(Yl);e.setAttribute("lineDistance",new rt(i,1))}else Be("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Al.copy(i.boundingSphere),Al.applyMatrix4(s),Al.radius+=r,e.ray.intersectsSphere(Al)===!1)return;q0.copy(s).invert(),ya.copy(e.ray).applyMatrix4(q0);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,u=i.index,f=i.attributes.position;if(u!==null){let d=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let _=d,p=g-1;_<p;_+=l){let m=u.getX(_),y=u.getX(_+1),v=Rl(this,e,ya,c,m,y,_);v&&t.push(v)}if(this.isLineLoop){let _=u.getX(g-1),p=u.getX(d),m=Rl(this,e,ya,c,_,p,g-1);m&&t.push(m)}}else{let d=Math.max(0,o.start),g=Math.min(f.count,o.start+o.count);for(let _=d,p=g-1;_<p;_+=l){let m=Rl(this,e,ya,c,_,_+1,_);m&&t.push(m)}if(this.isLineLoop){let _=Rl(this,e,ya,c,g-1,d,g-1);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Rl(n,e,t,i,s,r,o){let a=n.geometry.attributes.position;if(ql.fromBufferAttribute(a,s),Yl.fromBufferAttribute(a,r),t.distanceSqToSegment(ql,Yl,Wf,Y0)>i)return;Wf.applyMatrix4(n.matrixWorld);let l=e.ray.origin.distanceTo(Wf);if(!(l<e.near||l>e.far))return{distance:l,point:Y0.clone().applyMatrix4(n.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:n}}var $0=new N,K0=new N,Mr=class extends Sr{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[];for(let s=0,r=t.count;s<r;s+=2)$0.fromBufferAttribute(t,s),K0.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+$0.distanceTo(K0);e.setAttribute("lineDistance",new rt(i,1))}else Be("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},Na=class extends Sr{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},Xs=class extends ei{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ae(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Z0=new Xe,td=new vr,Cl=new Qn,Pl=new N,Vi=class extends Ft{constructor(e=new vt,t=new Xs){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Cl.copy(i.boundingSphere),Cl.applyMatrix4(s),Cl.radius+=r,e.ray.intersectsSphere(Cl)===!1)return;Z0.copy(s).invert(),td.copy(e.ray).applyMatrix4(Z0);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=i.index,h=i.attributes.position;if(l!==null){let f=Math.max(0,o.start),d=Math.min(l.count,o.start+o.count);for(let g=f,_=d;g<_;g++){let p=l.getX(g);Pl.fromBufferAttribute(h,p),J0(Pl,p,c,s,e,t,this)}}else{let f=Math.max(0,o.start),d=Math.min(h.count,o.start+o.count);for(let g=f,_=d;g<_;g++)Pl.fromBufferAttribute(h,g),J0(Pl,g,c,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function J0(n,e,t,i,s,r,o){let a=td.distanceSqToPoint(n);if(a<t){let c=new N;td.closestPointToPoint(n,c),c.applyMatrix4(i);let l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var Oa=class extends hn{constructor(e=[],t=Ir,i,s,r,o,a,c,l,u){super(e,t,i,s,r,o,a,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Ua=class extends hn{constructor(e,t,i,s,r,o,a,c,l){super(e,t,i,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}};var ps=class extends hn{constructor(e,t,i=Oi,s,r,o,a=Zt,c=Zt,l,u=hs,h=1){if(u!==hs&&u!==bs)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:e,height:t,depth:h};super(f,s,r,o,a,c,u,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new To(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Fa=class extends ps{constructor(e,t=Oi,i=Ir,s,r,o=Zt,a=Zt,c,l=hs){let u={width:e,height:e,depth:1},h=[u,u,u,u,u,u];super(e,e,t,i,s,r,o,a,c,l),this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Ba=class extends hn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},xt=class n extends vt{constructor(e=1,t=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],u=[],h=[],f=0,d=0;g("z","y","x",-1,-1,i,t,e,o,r,0),g("z","y","x",1,-1,i,t,-e,o,r,1),g("x","z","y",1,1,e,i,t,s,o,2),g("x","z","y",1,-1,e,i,-t,s,o,3),g("x","y","z",1,-1,e,t,i,s,r,4),g("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new rt(l,3)),this.setAttribute("normal",new rt(u,3)),this.setAttribute("uv",new rt(h,2));function g(_,p,m,y,v,S,E,M,x,b,R){let I=S/x,A=E/b,L=S/2,B=E/2,P=M/2,H=x+1,K=b+1,$=0,X=0,G=new N;for(let J=0;J<K;J++){let se=J*A-B;for(let ye=0;ye<H;ye++){let Le=ye*I-L;G[_]=Le*y,G[p]=se*v,G[m]=P,l.push(G.x,G.y,G.z),G[_]=0,G[p]=0,G[m]=M>0?1:-1,u.push(G.x,G.y,G.z),h.push(ye/x),h.push(1-J/b),$+=1}}for(let J=0;J<b;J++)for(let se=0;se<x;se++){let ye=f+se+H*J,Le=f+se+H*(J+1),j=f+(se+1)+H*(J+1),D=f+(se+1)+H*J;c.push(ye,Le,D),c.push(Le,j,D),X+=6}a.addGroup(d,X,R),d+=X,f+=$}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var Mt=class n extends vt{constructor(e=1,t=1,i=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let u=[],h=[],f=[],d=[],g=0,_=[],p=i/2,m=0;y(),o===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(u),this.setAttribute("position",new rt(h,3)),this.setAttribute("normal",new rt(f,3)),this.setAttribute("uv",new rt(d,2));function y(){let S=new N,E=new N,M=0,x=(t-e)/i;for(let b=0;b<=r;b++){let R=[],I=b/r,A=I*(t-e)+e;for(let L=0;L<=s;L++){let B=L/s,P=B*c+a,H=Math.sin(P),K=Math.cos(P);E.x=A*H,E.y=-I*i+p,E.z=A*K,h.push(E.x,E.y,E.z),S.set(H,x,K).normalize(),f.push(S.x,S.y,S.z),d.push(B,1-I),R.push(g++)}_.push(R)}for(let b=0;b<s;b++)for(let R=0;R<r;R++){let I=_[R][b],A=_[R+1][b],L=_[R+1][b+1],B=_[R][b+1];(e>0||R!==0)&&(u.push(I,A,B),M+=3),(t>0||R!==r-1)&&(u.push(A,L,B),M+=3)}l.addGroup(m,M,0),m+=M}function v(S){let E=g,M=new Ee,x=new N,b=0,R=S===!0?e:t,I=S===!0?1:-1;for(let L=1;L<=s;L++)h.push(0,p*I,0),f.push(0,I,0),d.push(.5,.5),g++;let A=g;for(let L=0;L<=s;L++){let P=L/s*c+a,H=Math.cos(P),K=Math.sin(P);x.x=R*K,x.y=p*I,x.z=R*H,h.push(x.x,x.y,x.z),f.push(0,I,0),M.x=H*.5+.5,M.y=K*.5*I+.5,d.push(M.x,M.y),g++}for(let L=0;L<s;L++){let B=E+L,P=A+L;S===!0?u.push(P,P+1,B):u.push(P+1,P,B),b+=3}l.addGroup(m,b,S===!0?1:2),m+=b}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Bn=class n extends Mt{constructor(e=1,t=1,i=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,i,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new n(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},$l=class n extends vt{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};let r=[],o=[];a(s),l(i),u(),this.setAttribute("position",new rt(r,3)),this.setAttribute("normal",new rt(r.slice(),3)),this.setAttribute("uv",new rt(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(y){let v=new N,S=new N,E=new N;for(let M=0;M<t.length;M+=3)d(t[M+0],v),d(t[M+1],S),d(t[M+2],E),c(v,S,E,y)}function c(y,v,S,E){let M=E+1,x=[];for(let b=0;b<=M;b++){x[b]=[];let R=y.clone().lerp(S,b/M),I=v.clone().lerp(S,b/M),A=M-b;for(let L=0;L<=A;L++)L===0&&b===M?x[b][L]=R:x[b][L]=R.clone().lerp(I,L/A)}for(let b=0;b<M;b++)for(let R=0;R<2*(M-b)-1;R++){let I=Math.floor(R/2);R%2===0?(f(x[b][I+1]),f(x[b+1][I]),f(x[b][I])):(f(x[b][I+1]),f(x[b+1][I+1]),f(x[b+1][I]))}}function l(y){let v=new N;for(let S=0;S<r.length;S+=3)v.x=r[S+0],v.y=r[S+1],v.z=r[S+2],v.normalize().multiplyScalar(y),r[S+0]=v.x,r[S+1]=v.y,r[S+2]=v.z}function u(){let y=new N;for(let v=0;v<r.length;v+=3){y.x=r[v+0],y.y=r[v+1],y.z=r[v+2];let S=p(y)/2/Math.PI+.5,E=m(y)/Math.PI+.5;o.push(S,1-E)}g(),h()}function h(){for(let y=0;y<o.length;y+=6){let v=o[y+0],S=o[y+2],E=o[y+4],M=Math.max(v,S,E),x=Math.min(v,S,E);M>.9&&x<.1&&(v<.2&&(o[y+0]+=1),S<.2&&(o[y+2]+=1),E<.2&&(o[y+4]+=1))}}function f(y){r.push(y.x,y.y,y.z)}function d(y,v){let S=y*3;v.x=e[S+0],v.y=e[S+1],v.z=e[S+2]}function g(){let y=new N,v=new N,S=new N,E=new N,M=new Ee,x=new Ee,b=new Ee;for(let R=0,I=0;R<r.length;R+=9,I+=6){y.set(r[R+0],r[R+1],r[R+2]),v.set(r[R+3],r[R+4],r[R+5]),S.set(r[R+6],r[R+7],r[R+8]),M.set(o[I+0],o[I+1]),x.set(o[I+2],o[I+3]),b.set(o[I+4],o[I+5]),E.copy(y).add(v).add(S).divideScalar(3);let A=p(E);_(M,I+0,y,A),_(x,I+2,v,A),_(b,I+4,S,A)}}function _(y,v,S,E){E<0&&y.x===1&&(o[v]=y.x-1),S.x===0&&S.z===0&&(o[v]=E/2/Math.PI+.5)}function p(y){return Math.atan2(y.z,-y.x)}function m(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.vertices,e.indices,e.radius,e.detail)}};var _i=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Be("Curve: .getPoint() not implemented.")}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),r+=i.distanceTo(s),t.push(r),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let i=this.getLengths(),s=0,r=i.length,o;t?o=t:o=e*i[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=i[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,i[s]===o)return s/(r-1);let u=i[s],f=i[s+1]-u,d=(o-u)/f;return(s+d)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),c=t||(o.isVector2?new Ee:new N);return c.copy(a).sub(o).normalize(),c}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){let i=new N,s=[],r=[],o=[],a=new N,c=new Xe;for(let d=0;d<=e;d++){let g=d/e;s[d]=this.getTangentAt(g,new N)}r[0]=new N,o[0]=new N;let l=Number.MAX_VALUE,u=Math.abs(s[0].x),h=Math.abs(s[0].y),f=Math.abs(s[0].z);u<=l&&(l=u,i.set(1,0,0)),h<=l&&(l=h,i.set(0,1,0)),f<=l&&i.set(0,0,1),a.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let d=1;d<=e;d++){if(r[d]=r[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(s[d-1],s[d]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(st(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(c.makeRotationAxis(a,g))}o[d].crossVectors(s[d],r[d])}if(t===!0){let d=Math.acos(st(r[0].dot(r[e]),-1,1));d/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(d=-d);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],d*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}},ka=class extends _i{constructor(e=0,t=0,i=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(e,t=new Ee){let i=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),f=c-this.aX,d=l-this.aY;c=f*u-d*h+this.aX,l=f*h+d*u+this.aY}return i.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Kl=class extends ka{constructor(e,t,i,s,r,o){super(e,t,i,i,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Id(){let n=0,e=0,t=0,i=0;function s(r,o,a,c){n=r,e=a,t=-3*r+3*o-2*a-c,i=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,u,h){let f=(o-r)/l-(a-r)/(l+u)+(a-o)/u,d=(a-o)/u-(c-o)/(u+h)+(c-a)/h;f*=u,d*=u,s(o,a,f,d)},calc:function(r){let o=r*r,a=o*r;return n+e*r+t*o+i*a}}}var j0=new N,Q0=new N,Xf=new Id,qf=new Id,Yf=new Id,Po=class extends _i{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new N){let i=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,u;this.closed||a>0?l=s[(a-1)%r]:(Q0.subVectors(s[0],s[1]).add(s[0]),l=Q0);let h=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?u=s[(a+2)%r]:(j0.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=j0),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,g=Math.pow(l.distanceToSquared(h),d),_=Math.pow(h.distanceToSquared(f),d),p=Math.pow(f.distanceToSquared(u),d);_<1e-4&&(_=1),g<1e-4&&(g=_),p<1e-4&&(p=_),Xf.initNonuniformCatmullRom(l.x,h.x,f.x,u.x,g,_,p),qf.initNonuniformCatmullRom(l.y,h.y,f.y,u.y,g,_,p),Yf.initNonuniformCatmullRom(l.z,h.z,f.z,u.z,g,_,p)}else this.curveType==="catmullrom"&&(Xf.initCatmullRom(l.x,h.x,f.x,u.x,this.tension),qf.initCatmullRom(l.y,h.y,f.y,u.y,this.tension),Yf.initCatmullRom(l.z,h.z,f.z,u.z,this.tension));return i.set(Xf.calc(c),qf.calc(c),Yf.calc(c)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new N().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function eg(n,e,t,i,s){let r=(i-e)*.5,o=(s-t)*.5,a=n*n,c=n*a;return(2*t-2*i+r+o)*c+(-3*t+3*i-2*r-o)*a+r*n+t}function cv(n,e){let t=1-n;return t*t*e}function lv(n,e){return 2*(1-n)*n*e}function uv(n,e){return n*n*e}function ba(n,e,t,i){return cv(n,e)+lv(n,t)+uv(n,i)}function hv(n,e){let t=1-n;return t*t*t*e}function fv(n,e){let t=1-n;return 3*t*t*n*e}function dv(n,e){return 3*(1-n)*n*n*e}function pv(n,e){return n*n*n*e}function Ta(n,e,t,i,s){return hv(n,e)+fv(n,t)+dv(n,i)+pv(n,s)}var Zl=class extends _i{constructor(e=new Ee,t=new Ee,i=new Ee,s=new Ee){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new Ee){let i=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return i.set(Ta(e,s.x,r.x,o.x,a.x),Ta(e,s.y,r.y,o.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Io=class extends _i{constructor(e=new N,t=new N,i=new N,s=new N){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new N){let i=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return i.set(Ta(e,s.x,r.x,o.x,a.x),Ta(e,s.y,r.y,o.y,a.y),Ta(e,s.z,r.z,o.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Jl=class extends _i{constructor(e=new Ee,t=new Ee){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Ee){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Ee){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},jl=class extends _i{constructor(e=new N,t=new N){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new N){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new N){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ql=class extends _i{constructor(e=new Ee,t=new Ee,i=new Ee){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new Ee){let i=t,s=this.v0,r=this.v1,o=this.v2;return i.set(ba(e,s.x,r.x,o.x),ba(e,s.y,r.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},br=class extends _i{constructor(e=new N,t=new N,i=new N){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new N){let i=t,s=this.v0,r=this.v1,o=this.v2;return i.set(ba(e,s.x,r.x,o.x),ba(e,s.y,r.y,o.y),ba(e,s.z,r.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},eu=class extends _i{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Ee){let i=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],u=s[o>s.length-2?s.length-1:o+1],h=s[o>s.length-3?s.length-1:o+2];return i.set(eg(a,c.x,l.x,u.x,h.x),eg(a,c.y,l.y,u.y,h.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new Ee().fromArray(s))}return this}},mv=Object.freeze({__proto__:null,ArcCurve:Kl,CatmullRomCurve3:Po,CubicBezierCurve:Zl,CubicBezierCurve3:Io,EllipseCurve:ka,LineCurve:Jl,LineCurve3:jl,QuadraticBezierCurve:Ql,QuadraticBezierCurve3:br,SplineCurve:eu});var Lo=class n extends $l{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}};var ti=class n extends vt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(i),c=Math.floor(s),l=a+1,u=c+1,h=e/a,f=t/c,d=[],g=[],_=[],p=[];for(let m=0;m<u;m++){let y=m*f-o;for(let v=0;v<l;v++){let S=v*h-r;g.push(S,-y,0),_.push(0,0,1),p.push(v/a),p.push(1-m/c)}}for(let m=0;m<c;m++)for(let y=0;y<a;y++){let v=y+l*m,S=y+l*(m+1),E=y+1+l*(m+1),M=y+1+l*m;d.push(v,S,M),d.push(S,E,M)}this.setIndex(d),this.setAttribute("position",new rt(g,3)),this.setAttribute("normal",new rt(_,3)),this.setAttribute("uv",new rt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.widthSegments,e.heightSegments)}};var qn=class n extends vt{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let c=Math.min(o+a,Math.PI),l=0,u=[],h=new N,f=new N,d=[],g=[],_=[],p=[];for(let m=0;m<=i;m++){let y=[],v=m/i,S=o+v*a,E=e*Math.cos(S),M=Math.sqrt(e*e-E*E),x=0;m===0&&o===0?x=.5/t:m===i&&c===Math.PI&&(x=-.5/t);for(let b=0;b<=t;b++){let R=b/t,I=s+R*r;h.x=-M*Math.cos(I),h.y=E,h.z=M*Math.sin(I),g.push(h.x,h.y,h.z),f.copy(h).normalize(),_.push(f.x,f.y,f.z),p.push(R+x,1-v),y.push(l++)}u.push(y)}for(let m=0;m<i;m++)for(let y=0;y<t;y++){let v=u[m][y+1],S=u[m][y],E=u[m+1][y],M=u[m+1][y+1];(m!==0||o>0)&&d.push(v,S,M),(m!==i-1||c<Math.PI)&&d.push(S,E,M)}this.setIndex(d),this.setAttribute("position",new rt(g,3)),this.setAttribute("normal",new rt(_,3)),this.setAttribute("uv",new rt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var za=class n extends vt{constructor(e=1,t=.4,i=12,s=48,r=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:r,thetaStart:o,thetaLength:a},i=Math.floor(i),s=Math.floor(s);let c=[],l=[],u=[],h=[],f=new N,d=new N,g=new N;for(let _=0;_<=i;_++){let p=o+_/i*a;for(let m=0;m<=s;m++){let y=m/s*r;d.x=(e+t*Math.cos(p))*Math.cos(y),d.y=(e+t*Math.cos(p))*Math.sin(y),d.z=t*Math.sin(p),l.push(d.x,d.y,d.z),f.x=e*Math.cos(y),f.y=e*Math.sin(y),g.subVectors(d,f).normalize(),u.push(g.x,g.y,g.z),h.push(m/s),h.push(_/i)}}for(let _=1;_<=i;_++)for(let p=1;p<=s;p++){let m=(s+1)*_+p-1,y=(s+1)*(_-1)+p-1,v=(s+1)*(_-1)+p,S=(s+1)*_+p;c.push(m,y,S),c.push(y,v,S)}this.setIndex(c),this.setAttribute("position",new rt(l,3)),this.setAttribute("normal",new rt(u,3)),this.setAttribute("uv",new rt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}};var Ha=class n extends vt{constructor(e=new br(new N(-1,-1,0),new N(-1,1,0),new N(1,1,0)),t=64,i=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:i,radialSegments:s,closed:r};let o=e.computeFrenetFrames(t,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new N,c=new N,l=new Ee,u=new N,h=[],f=[],d=[],g=[];_(),this.setIndex(g),this.setAttribute("position",new rt(h,3)),this.setAttribute("normal",new rt(f,3)),this.setAttribute("uv",new rt(d,2));function _(){for(let v=0;v<t;v++)p(v);p(r===!1?t:0),y(),m()}function p(v){u=e.getPointAt(v/t,u);let S=o.normals[v],E=o.binormals[v];for(let M=0;M<=s;M++){let x=M/s*Math.PI*2,b=Math.sin(x),R=-Math.cos(x);c.x=R*S.x+b*E.x,c.y=R*S.y+b*E.y,c.z=R*S.z+b*E.z,c.normalize(),f.push(c.x,c.y,c.z),a.x=u.x+i*c.x,a.y=u.y+i*c.y,a.z=u.z+i*c.z,h.push(a.x,a.y,a.z)}}function m(){for(let v=1;v<=t;v++)for(let S=1;S<=s;S++){let E=(s+1)*(v-1)+(S-1),M=(s+1)*v+(S-1),x=(s+1)*v+S,b=(s+1)*(v-1)+S;g.push(E,M,b),g.push(M,x,b)}}function y(){for(let v=0;v<=t;v++)for(let S=0;S<=s;S++)l.x=v/t,l.y=S/s,d.push(l.x,l.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new n(new mv[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}};function Nr(n){let e={};for(let t in n){e[t]={};for(let i in n[t]){let s=n[t][i];if(tg(s))s.isRenderTargetTexture?(Be("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(tg(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();e[t][i]=r}else e[t][i]=s.slice();else e[t][i]=s}}return e}function kn(n){let e={};for(let t=0;t<n.length;t++){let i=Nr(n[t]);for(let s in i)e[s]=i[s]}return e}function tg(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function gv(n){let e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Ld(n){let e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}var Fi={clone:Nr,merge:kn},_v=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,xv=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ht=class extends ei{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=_v,this.fragmentShader=xv,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Nr(e.uniforms),this.uniformsGroups=gv(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let i in e.uniforms){let s=e.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=t[s.value]||null;break;case"c":this.uniforms[i].value=new ae().setHex(s.value);break;case"v2":this.uniforms[i].value=new Ee().fromArray(s.value);break;case"v3":this.uniforms[i].value=new N().fromArray(s.value);break;case"v4":this.uniforms[i].value=new _t().fromArray(s.value);break;case"m3":this.uniforms[i].value=new qe().fromArray(s.value);break;case"m4":this.uniforms[i].value=new Xe().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Do=class extends Ht{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Nt=class extends ei{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ae(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ae(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ju,this.normalScale=new Ee(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fs,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},vn=class extends Nt{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Ee(1,1),this.clearcoatNormalMap=null,this.diffuseRoughnessMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return st(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessMinimum=100,this.iridescenceThicknessMaximum=400,this.iridescenceThicknessMap=null,this.sheenColor=new ae(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ae(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ae(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._diffuseRoughness=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get diffuseRoughness(){return this._diffuseRoughness}set diffuseRoughness(e){this._diffuseRoughness>0!=e>0&&this.version++,this._diffuseRoughness=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}get iridescenceThicknessRange(){return gr('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),[this.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum]}set iridescenceThicknessRange(e){gr('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),this.iridescenceThicknessMinimum=e[0],this.iridescenceThicknessMaximum=e[1]}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.diffuseRoughness=e.diffuseRoughness,this.diffuseRoughnessMap=e.diffuseRoughnessMap,this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum,this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var tu=class extends ei{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ng,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},nu=class extends ei{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function ks(n,e){return!n||n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function va(n){return n!==void 0&&n.inTangents!==void 0&&n.outTangents!==void 0}function yv(n){function e(s,r){return n[s]-n[r]}let t=n.length,i=new Array(t);for(let s=0;s!==t;++s)i[s]=s;return i.sort(e),i}function ng(n,e,t){let i=n.length,s=new n.constructor(i);for(let r=0,o=0;o!==i;++r){let a=t[r]*e;for(let c=0;c!==e;++c)s[o++]=n[a+c]}return s}function vv(n,e,t,i){let s=1,r=n[0];for(;r!==void 0&&r[i]===void 0;)r=n[s++];if(r===void 0)return;let o=r[i];if(o!==void 0)if(Array.isArray(o))do o=r[i],o!==void 0&&(e.push(r.time),t.push(...o)),r=n[s++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[i],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=n[s++];while(r!==void 0);else do o=r[i],o!==void 0&&(e.push(r.time),t.push(o)),r=n[s++];while(r!==void 0)}var Wi=class{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,s=t[i],r=t[i-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=i+2;;){if(s===void 0){if(e<r)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(r=s,s=t[++i],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(i=2,r=a);for(let c=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===c)break;if(s=r,r=t[--i-1],e>=r)break e}o=i,i=0;break t}break n}for(;i<o;){let a=i+o>>>1;e<t[a]?o=a:i=a+1}if(s=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=i[r+o];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},iu=class extends Wi{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:jf,endingEnd:jf}}intervalChanged_(e,t,i){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Qf:r=e,a=2*t-i;break;case ed:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=i}if(c===void 0)switch(this.getSettings_().endingEnd){case Qf:o=e,c=2*i-t;break;case ed:o=1,c=i+s[1]-s[0];break;default:o=e-1,c=t}let l=(i-t)*.5,u=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(c-i),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,u=this._offsetPrev,h=this._offsetNext,f=this._weightPrev,d=this._weightNext,g=(i-t)/(s-t),_=g*g,p=_*g,m=-f*p+2*f*_-f*g,y=(1+f)*p+(-1.5-2*f)*_+(-.5+f)*g+1,v=(-1-d)*p+(1.5+d)*_+.5*g,S=d*p-d*_;for(let E=0;E!==a;++E)r[E]=m*o[u+E]+y*o[l+E]+v*o[c+E]+S*o[h+E];return r}},su=class extends Wi{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,u=(i-t)/(s-t),h=1-u;for(let f=0;f!==a;++f)r[f]=o[l+f]*h+o[c+f]*u;return r}},ru=class extends Wi{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}},ou=class extends Wi{interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,u=this.inTangents,h=this.outTangents;if(!u||!h){let g=(i-t)/(s-t),_=1-g;for(let p=0;p!==a;++p)r[p]=o[l+p]*_+o[c+p]*g;return r}let f=a*2,d=e-1;for(let g=0;g!==a;++g){let _=o[l+g],p=o[c+g],m=d*f+g*2,y=h[m],v=h[m+1],S=e*f+g*2,E=u[S],M=u[S+1],x=Mv(i,t,y,E,s);r[g]=Yg(x,_,v,M,p)}return r}};function Yg(n,e,t,i,s){let r=1-n;return r*r*r*e+3*r*r*n*t+3*r*n*n*i+n*n*n*s}function Sv(n,e,t,i,s){let r=1-n;return 3*r*r*(t-e)+6*r*n*(i-t)+3*n*n*(s-i)}function Mv(n,e,t,i,s){let r=(n-e)/(s-e);for(let o=0;o<8;o++){let a=Yg(r,e,t,i,s)-n;if(Math.abs(a)<1e-10)break;let c=Sv(r,e,t,i,s);if(Math.abs(c)<1e-10)break;r=Math.max(0,Math.min(1,r-a/c))}return r}var ni=class{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=ks(t,this.TimeBufferType),this.values=ks(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:ks(e.times,Array),values:ks(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s),va(e.settings)&&(i.settings={inTangents:ks(e.settings.inTangents,Array),outTangents:ks(e.settings.outTangents,Array)})}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new ru(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new su(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new iu(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new ou(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case _r:t=this.InterpolantFactoryMethodDiscrete;break;case xr:t=this.InterpolantFactoryMethodLinear;break;case Dl:t=this.InterpolantFactoryMethodSmooth;break;case Jf:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Be("KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return _r;case this.InterpolantFactoryMethodLinear:return xr;case this.InterpolantFactoryMethodSmooth:return Dl;case this.InterpolantFactoryMethodBezier:return Jf}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e;va(this.settings)&&(ig(this.settings.inTangents,e),ig(this.settings.outTangents,e))}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e;va(this.settings)&&(sg(this.settings.inTangents,e),sg(this.settings.outTangents,e))}return this}trim(e,t){let i=this.times,s=i.length,r=0,o=s-1;for(;r!==s&&i[r]<e;)++r;for(;o!==-1&&i[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=i.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Ve("KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,s=this.values,r=i.length;r===0&&(Ve("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let c=i[a];if(typeof c=="number"&&isNaN(c)){Ve("KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){Ve("KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(s!==void 0&&Ey(s))for(let a=0,c=s.length;a!==c;++a){let l=s[a];if(isNaN(l)){Ve("KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===Dl,r=e.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=e[a],u=e[a+1];if(l!==u&&(a!==1||l!==e[0]))if(s)c=!0;else{let h=a*i,f=h-i,d=h+i;for(let g=0;g!==i;++g){let _=t[h+g];if(_!==t[f+g]||_!==t[d+g]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];let h=a*i,f=o*i;for(let d=0;d!==i;++d)t[f+d]=t[h+d]}++o}}if(r>0){e[o]=e[r];for(let a=r*i,c=o*i,l=0;l!==i;++l)t[c+l]=t[a+l];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,va(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function ig(n,e){for(let t=0,i=n.length;t!==i;t+=2)n[t]+=e}function sg(n,e){for(let t=0,i=n.length;t!==i;t+=2)n[t]*=e}ni.prototype.ValueTypeName="";ni.prototype.TimeBufferType=Float32Array;ni.prototype.ValueBufferType=Float32Array;ni.prototype.DefaultInterpolation=xr;var ms=class extends ni{constructor(e,t,i){super(e,t,i)}};ms.prototype.ValueTypeName="bool";ms.prototype.ValueBufferType=Array;ms.prototype.DefaultInterpolation=_r;ms.prototype.InterpolantFactoryMethodLinear=void 0;ms.prototype.InterpolantFactoryMethodSmooth=void 0;var Ga=class extends ni{constructor(e,t,i,s){super(e,t,i,s)}};Ga.prototype.ValueTypeName="color";var gs=class extends ni{constructor(e,t,i,s){super(e,t,i,s)}};gs.prototype.ValueTypeName="number";var au=class extends Wi{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(i-t)/(s-t),l=e*a;for(let u=l+a;l!==u;l+=4)Rn.slerpFlat(r,0,o,l-a,o,l,c);return r}},_s=class extends ni{constructor(e,t,i,s){super(e,t,i,s)}InterpolantFactoryMethodLinear(e){return new au(this.times,this.values,this.getValueSize(),e)}};_s.prototype.ValueTypeName="quaternion";_s.prototype.InterpolantFactoryMethodSmooth=void 0;var xs=class extends ni{constructor(e,t,i){super(e,t,i)}};xs.prototype.ValueTypeName="string";xs.prototype.ValueBufferType=Array;xs.prototype.DefaultInterpolation=_r;xs.prototype.InterpolantFactoryMethodLinear=void 0;xs.prototype.InterpolantFactoryMethodSmooth=void 0;var qs=class extends ni{constructor(e,t,i,s){super(e,t,i,s)}};qs.prototype.ValueTypeName="vector";var Va=class{constructor(e="",t=-1,i=[],s=Dg){this.name=e,this.tracks=i,this.duration=t,this.blendMode=s,this.uuid=Yi(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],i=e.tracks,s=1/(e.fps||1);for(let o=0,a=i.length;o!==a;++o)t.push(Tv(i[o]).scale(s));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){let t=[],i=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,o=i.length;r!==o;++r)t.push(ni.toJSON(i[r]));return s}static CreateFromMorphTargetSequence(e,t,i,s){let r=t.length,o=[];for(let a=0;a<r;a++){let c=[],l=[];c.push((a+r-1)%r,a,(a+1)%r),l.push(0,1,0);let u=yv(c);c=ng(c,1,u),l=ng(l,1,u),!s&&c[0]===0&&(c.push(r),l.push(l[0])),o.push(new gs(".morphTargetInfluences["+t[a].name+"]",c,l).scale(1/i))}return new this(e,-1,o)}static findByName(e,t){let i=e;if(!Array.isArray(e)){let s=e;i=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<i.length;s++)if(i[s].name===t)return i[s];return null}static CreateClipsFromMorphTargetSequences(e,t,i){let s={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,c=e.length;a<c;a++){let l=e[a],u=l.name.match(r);if(u&&u.length>1){let h=u[1],f=s[h];f||(s[h]=f=[]),f.push(l)}}let o=[];for(let a in s)o.push(this.CreateFromMorphTargetSequence(a,s[a],t,i));return o}resetDuration(){let e=this.tracks,t=0;for(let i=0,s=e.length;i!==s;++i){let r=this.tracks[i];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let i=0;i<this.tracks.length;i++)e.push(this.tracks[i].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function bv(n){switch(n.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return gs;case"vector":case"vector2":case"vector3":case"vector4":return qs;case"color":return Ga;case"quaternion":return _s;case"bool":case"boolean":return ms;case"string":return xs}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+n)}function Tv(n){if(n.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=bv(n.type);if(n.times===void 0){let i=[],s=[];vv(n.keys,i,s,"value"),n.times=i,n.values=s}let t;return e.parse!==void 0?t=e.parse(n):t=new e(n.name,n.times,n.values,n.interpolation),va(n.settings)&&(t.settings={inTangents:ks(n.settings.inTangents,Float32Array),outTangents:ks(n.settings.outTangents,Float32Array)}),t}var Hi={enabled:!1,files:{},add:function(n,e){this.enabled!==!1&&(rg(n)||(this.files[n]=e))},get:function(n){if(this.enabled!==!1&&!rg(n))return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}};function rg(n){try{let e=n.slice(n.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}var cu=class{constructor(e,t,i){let s=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),c?c(u):u},this.setURLModifier=function(u){return c=u,this},this.addHandler=function(u,h){return l.push(u,h),this},this.removeHandler=function(u){let h=l.indexOf(u);return h!==-1&&l.splice(h,2),this},this.getHandler=function(u){for(let h=0,f=l.length;h<f;h+=2){let d=l[h],g=l[h+1];if(d.global&&(d.lastIndex=0),d.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},$g=new cu,xi=class{constructor(e){this.manager=e!==void 0?e:$g,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}setPriority(e){return this.priority=e,this}setCache(e){return this.cache=e,this}abort(){return this}};xi.DEFAULT_MATERIAL_NAME="__DEFAULT";var ls={},nd=class extends Error{constructor(e,t){super(e),this.response=t}},ys=class extends xi{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,i,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=Hi.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(ls[e]!==void 0){ls[e].push({onLoad:t,onProgress:i,onError:s});return}ls[e]=[],ls[e].push({onLoad:t,onProgress:i,onError:s});let o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",priority:this.priority,cache:this.cache,signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&Be("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;let u=ls[e],h=l.body.getReader(),f=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),d=f?parseInt(f):0,g=d!==0,_=0,p=new ReadableStream({start(m){y();function y(){h.read().then(({done:v,value:S})=>{if(v)m.close();else{_+=S.byteLength;let E=new ProgressEvent("progress",{lengthComputable:g,loaded:_,total:d});for(let M=0,x=u.length;M<x;M++){let b=u[M];b.onProgress&&b.onProgress(E)}m.enqueue(S),y()}},v=>{m.error(v)})}}});return new Response(p)}else throw new nd(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return l.json();default:if(a==="")return l.text();{let h=/charset="?([^;"\s]*)"?/i.exec(a),f=h&&h[1]?h[1].toLowerCase():void 0,d=new TextDecoder(f);return l.arrayBuffer().then(g=>d.decode(g))}}}).then(l=>{Hi.add(`file:${e}`,l);let u=ls[e];delete ls[e];for(let h=0,f=u.length;h<f;h++){let d=u[h];d.onLoad&&d.onLoad(l)}}).catch(l=>{let u=ls[e];if(u===void 0)throw this.manager.itemError(e),l;delete ls[e];for(let h=0,f=u.length;h<f;h++){let d=u[h];d.onError&&d.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var mo=new WeakMap,lu=class extends xi{constructor(e){super(e)}load(e,t,i,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=Hi.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);else{let h=mo.get(o);h===void 0&&(h=[],mo.set(o,h)),h.push({onLoad:t,onError:s})}return o}let a=Mo("img");function c(){u(),t&&t(this);let h=mo.get(this)||[];for(let f=0;f<h.length;f++){let d=h[f];d.onLoad&&d.onLoad(this)}mo.delete(this),r.manager.itemEnd(e)}function l(h){u(),s&&s(h),Hi.remove(`image:${e}`);let f=mo.get(this)||[];for(let d=0;d<f.length;d++){let g=f[d];g.onError&&g.onError(h)}mo.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),Hi.add(`image:${e}`,a),r.manager.itemStart(e),a.fetchPriority=this.priority,a.src=e,a}};var Tr=class extends xi{constructor(e){super(e)}load(e,t,i,s){let r=new hn,o=new lu(this.manager);return o.setPriority(this.priority),o.setCache(this.cache),o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},i,s),r}},Er=class extends Ft{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ae(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Wa=class extends Er{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ft.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ae(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},$f=new Xe,og=new N,ag=new N,No=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ee(512,512),this.mapType=ii,this.map=null,this.mapPass=null,this.matrix=new Xe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ws,this._frameExtents=new Ee(1,1),this._viewportCount=1,this._viewports=[new _t(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;og.setFromMatrixPosition(e.matrixWorld),t.position.copy(og),ag.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(ag),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,i,s){$f.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),i.setFromProjectionMatrix($f,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,o=s?s.z/r.x:1,a=s?s.w/r.y:1,c=s?s.x/r.x:0,l=s?s.y/r.y:0;e.coordinateSystem===So||e.reversedDepth?t.set(.5*o,0,0,.5*o+c,0,.5*a,0,.5*a+l,0,0,1,0,0,0,0,1):t.set(.5*o,0,0,.5*o+c,0,.5*a,0,.5*a+l,0,0,.5,.5,0,0,0,1),t.multiply($f)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Il=new N,Ll=new Rn,zi=new N,Xa=class extends Ft{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Xe,this.projectionMatrix=new Xe,this.projectionMatrixInverse=new Xe,this.coordinateSystem=mi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Il,Ll,zi),zi.x===1&&zi.y===1&&zi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Il,Ll,zi.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(Il,Ll,zi),zi.x===1&&zi.y===1&&zi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Il,Ll,zi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Bs=new N,cg=new Ee,lg=new Ee,Kt=class extends Xa{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=yr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Sa*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return yr*2*Math.atan(Math.tan(Sa*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Bs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Bs.x,Bs.y).multiplyScalar(-e/Bs.z),Bs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Bs.x,Bs.y).multiplyScalar(-e/Bs.z)}getViewSize(e,t){return this.getViewBounds(e,cg,lg),t.subVectors(lg,cg)}setViewOffset(e,t,i,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Sa*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*i/l,s*=o.width/c,i*=o.height/l}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},id=class extends No{constructor(){super(new Kt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,i=yr*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(i!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=i,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},wr=class extends Er{constructor(e,t,i=0,s=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Ft.DEFAULT_UP),this.updateMatrix(),this.target=new Ft,this.distance=i,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new id}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},sd=class extends No{constructor(){super(new Kt(90,1,.5,500)),this.isPointLightShadow=!0}},qa=class extends Er{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new sd}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},vs=class extends Xa{constructor(e=-1,t=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-e,o=i+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},rd=class extends No{constructor(){super(new vs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ar=class extends Er{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ft.DEFAULT_UP),this.updateMatrix(),this.target=new Ft,this.shadow=new rd}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var li=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var Kf=new WeakMap,Ya=class extends xi{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Be("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Be("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,i,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=Hi.get(`image-bitmap:${e}`);if(o!==void 0){if(r.manager.itemStart(e),o.then){o.then(l=>{Kf.has(o)===!0?(s&&s(Kf.get(o)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(l),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);return}let a={};a.credentials=this.withCredentials||this.crossOrigin!=="anonymous"?"include":"same-origin",a.headers=this.requestHeader,a.priority=this.priority,a.cache=this.cache,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let c=fetch(e,a).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(l){return Hi.add(`image-bitmap:${e}`,l),t&&t(l),r.manager.itemEnd(e),l}).catch(function(l){s&&s(l),Kf.set(c,l),Hi.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});Hi.add(`image-bitmap:${e}`,c),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var go=-90,_o=1,Oo=class extends Ft{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Kt(go,_o,e,t);s.layers=this.layers,this.add(s);let r=new Kt(go,_o,e,t);r.layers=this.layers,this.add(r);let o=new Kt(go,_o,e,t);o.layers=this.layers,this.add(o);let a=new Kt(go,_o,e,t);a.layers=this.layers,this.add(a);let c=new Kt(go,_o,e,t);c.layers=this.layers,this.add(c);let l=new Kt(go,_o,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,s,r,o,a,c]=t;for(let l of t)this.remove(l);if(e===mi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===So)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,u]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let _=i.texture.mipmapsAutoUpdate;i.texture.mipmapsAutoUpdate=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,2,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,3,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(i,4,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),i.texture.mipmapsAutoUpdate=_,e.setRenderTarget(i,5,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(h,f,d),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},uu=class extends Kt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}},$a=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=Ev.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function Ev(){this._document.hidden===!1&&this.reset()}var Dd="\\[\\]\\.:\\/",wv=new RegExp("["+Dd+"]","g"),Nd="[^"+Dd+"]",Av="[^"+Dd.replace("\\.","")+"]",Rv=/((?:WC+[\/:])*)/.source.replace("WC",Nd),Cv=/(WCOD+)?/.source.replace("WCOD",Av),Pv=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Nd),Iv=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Nd),Lv=new RegExp("^"+Rv+Cv+Pv+Iv+"$"),Dv=["material","materials","bones","map"],od=class{constructor(e,t,i){let s=i||Lt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},Lt=class n{constructor(e,t,i){this.path=t,this.parsedPath=i||n.parseTrackName(t),this.node=n.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new n.Composite(e,t,i):new n(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(wv,"")}static parseTrackName(e){let t=Lv.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);Dv.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let c=i(a.children);if(c)return c}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=n.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Be("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let l=t.objectIndex;switch(i){case"materials":if(!e.material){Ve("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ve("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ve("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===l){l=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ve("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ve("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){Ve("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(l!==void 0){if(e[l]===void 0){Ve("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let o=e[s];if(o===void 0){let l=t.nodeName;Ve("PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Ve("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ve("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Lt.Composite=od;Lt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Lt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Lt.prototype.GetterByBindingType=[Lt.prototype._getValue_direct,Lt.prototype._getValue_array,Lt.prototype._getValue_arrayElement,Lt.prototype._getValue_toArray];Lt.prototype.SetterByBindingTypeAndVersioning=[[Lt.prototype._setValue_direct,Lt.prototype._setValue_direct_setNeedsUpdate,Lt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Lt.prototype._setValue_array,Lt.prototype._setValue_array_setNeedsUpdate,Lt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Lt.prototype._setValue_arrayElement,Lt.prototype._setValue_arrayElement_setNeedsUpdate,Lt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Lt.prototype._setValue_fromArray,Lt.prototype._setValue_fromArray_setNeedsUpdate,Lt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var $E=new Float32Array(1);var ad=class{static{this.prototype.isMatrix2=!0}constructor(e,t,i,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=i,r[3]=s,this}};function Od(n,e,t,i){let s=Nv(i);switch(t){case yd:return n*e;case _u:return n*e/s.components*s.byteLength;case xu:return n*e/s.components*s.byteLength;case Ys:return n*e*2/s.components*s.byteLength;case yu:return n*e*2/s.components*s.byteLength;case vd:return n*e*3/s.components*s.byteLength;case vi:return n*e*4/s.components*s.byteLength;case vu:return n*e*4/s.components*s.byteLength;case tc:case nc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case ic:case sc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Mu:case Tu:return Math.max(n,16)*Math.max(e,8)/4;case Su:case bu:return Math.max(n,8)*Math.max(e,8)/2;case Eu:case wu:case Ru:case Cu:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Au:case rc:case Pu:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Iu:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Lu:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Du:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Nu:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Ou:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Uu:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Fu:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Bu:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case ku:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case zu:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Hu:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Gu:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Vu:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Wu:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Xu:case qu:case Yu:return Math.ceil(n/4)*Math.ceil(e/4)*16;case $u:case Ku:return Math.ceil(n/4)*Math.ceil(e/4)*8;case oc:case Zu:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Nv(n){switch(n){case ii:case md:return{byteLength:1,components:1};case Ho:case gd:case fn:return{byteLength:2,components:1};case mu:case gu:return{byteLength:2,components:4};case Oi:case pu:case ui:return{byteLength:4,components:1};case _d:case xd:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"187"}}));typeof window<"u"&&(window.__THREE__?Be("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="187");function g_(){let n=null,e=!1,t=null,i=null;function s(r,o){i=n.requestAnimationFrame(s),t(r,o)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function Uv(n){let e=new WeakMap;function t(a,c){let l=a.array,u=a.usage,h=l.byteLength,f=n.createBuffer();n.bindBuffer(c,f),n.bufferData(c,l,u),a.onUploadCallback();let d;if(l instanceof Float32Array)d=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)d=n.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?d=n.HALF_FLOAT:d=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=n.SHORT;else if(l instanceof Uint32Array)d=n.UNSIGNED_INT;else if(l instanceof Int32Array)d=n.INT;else if(l instanceof Int8Array)d=n.BYTE;else if(l instanceof Uint8Array)d=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,c,l){let u=c.array,h=c.updateRanges;if(n.bindBuffer(l,a),h.length===0)n.bufferSubData(l,0,u);else{h.sort((d,g)=>d.start-g.start);let f=0;for(let d=1;d<h.length;d++){let g=h[f],_=h[d];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++f,h[f]=_)}h.length=f+1;for(let d=0,g=h.length;d<g;d++){let _=h[d];n.bufferSubData(l,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=e.get(a);c&&(n.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var Fv=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Bv=`#ifdef USE_ALPHAHASH
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
#endif`,kv=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,zv=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Hv=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Gv=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Vv=`#ifdef USE_AOMAP
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
#endif`,Wv=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Xv=`#ifdef USE_BATCHING
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
#endif`,qv=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Yv=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,$v=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Kv=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Zv=`#ifdef USE_IRIDESCENCE
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
#endif`,Jv=`#ifdef USE_BUMPMAP
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
#endif`,jv=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Qv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,eS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,tS=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,nS=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,iS=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,sS=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,rS=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,oS=`#define PI 3.141592653589793
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
} // validated`,aS=`vec3 transformedNormal = objectNormal;
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
#endif`,cS=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,lS=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,uS=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,hS=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,fS="gl_FragColor = linearToOutputTexel( gl_FragColor );",dS=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,pS=`#ifdef USE_ENVMAP
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
#endif`,mS=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,gS=`#ifdef USE_ENVMAP
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
#endif`,_S=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,xS=`#ifdef USE_ENVMAP
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
#endif`,yS=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,vS=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,SS=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,MS=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,bS=`#ifdef USE_GRADIENTMAP
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
}`,TS=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ES=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,wS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,AS=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,RS=`#ifdef USE_ENVMAP
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
#endif`,CS=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,PS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,IS=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,LS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,DS=`PhysicalMaterial material;
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
#endif`,NS=`uniform sampler2D dfgLUT;
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
}`,OS=`
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
#endif`,US=`#if defined( RE_IndirectDiffuse )
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
#endif`,FS=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,BS=`#if NUM_LIGHT_PROBE_GRIDS > 0
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
#endif`,kS=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,zS=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,HS=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,GS=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,VS=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,WS=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,XS=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,qS=`#if defined( USE_POINTS_UV )
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
#endif`,YS=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,$S=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,KS=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ZS=`#if defined( USE_MORPHCOLORS )
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
#endif`,JS=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,jS=`#ifdef USE_MORPHTARGETS
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
#endif`,QS=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,eM=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,tM=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,nM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,iM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,sM=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,rM=`#ifdef USE_NORMALMAP
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
#endif`,oM=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,aM=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,cM=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,lM=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,uM=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,hM=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,fM=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,dM=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,pM=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,mM=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,gM=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,_M=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,xM=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,yM=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,vM=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,SM=`float getShadowMask() {
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
}`,MM=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,bM=`#ifdef USE_SKINNING
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
#endif`,TM=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,EM=`#ifdef USE_SKINNING
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
#endif`,wM=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,AM=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,RM=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,CM=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,PM=`#ifdef USE_TRANSMISSION
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
#endif`,IM=`#ifdef USE_TRANSMISSION
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
#endif`,LM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,DM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,NM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,OM=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,UM=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,FM=`uniform sampler2D t2D;
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
}`,BM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,kM=`uniform float backgroundBlurriness;
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
}`,zM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,HM=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,GM=`#include <common>
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
}`,VM=`#if DEPTH_PACKING == 3200
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
}`,WM=`#define DISTANCE
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
}`,XM=`#define DISTANCE
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
}`,qM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,YM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$M=`uniform float scale;
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
}`,KM=`uniform vec3 diffuse;
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
}`,ZM=`#include <common>
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
}`,JM=`uniform vec3 diffuse;
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
}`,jM=`#define LAMBERT
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
}`,QM=`#define LAMBERT
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
}`,eb=`#define MATCAP
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
}`,tb=`#define MATCAP
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
}`,nb=`#define NORMAL
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
}`,ib=`#define NORMAL
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
}`,sb=`#define PHONG
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
}`,rb=`#define PHONG
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
}`,ob=`#define STANDARD
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
}`,ab=`#define STANDARD
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
}`,cb=`#define TOON
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
}`,lb=`#define TOON
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
}`,ub=`uniform float size;
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
}`,hb=`uniform vec3 diffuse;
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
}`,fb=`#include <common>
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
}`,db=`uniform vec3 color;
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
}`,pb=`uniform float rotation;
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
}`,mb=`uniform vec3 diffuse;
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
}`,tt={alphahash_fragment:Fv,alphahash_pars_fragment:Bv,alphamap_fragment:kv,alphamap_pars_fragment:zv,alphatest_fragment:Hv,alphatest_pars_fragment:Gv,aomap_fragment:Vv,aomap_pars_fragment:Wv,batching_pars_vertex:Xv,batching_vertex:qv,begin_vertex:Yv,beginnormal_vertex:$v,bsdfs:Kv,iridescence_fragment:Zv,bumpmap_pars_fragment:Jv,clipping_planes_fragment:jv,clipping_planes_pars_fragment:Qv,clipping_planes_pars_vertex:eS,clipping_planes_vertex:tS,color_fragment:nS,color_pars_fragment:iS,color_pars_vertex:sS,color_vertex:rS,common:oS,defaultnormal_vertex:aS,displacementmap_pars_vertex:cS,displacementmap_vertex:lS,emissivemap_fragment:uS,emissivemap_pars_fragment:hS,colorspace_fragment:fS,colorspace_pars_fragment:dS,envmap_fragment:pS,envmap_common_pars_fragment:mS,envmap_pars_fragment:gS,envmap_pars_vertex:_S,envmap_physical_pars_fragment:RS,envmap_vertex:xS,fog_vertex:yS,fog_pars_vertex:vS,fog_fragment:SS,fog_pars_fragment:MS,gradientmap_pars_fragment:bS,lightmap_pars_fragment:TS,lights_lambert_fragment:ES,lights_lambert_pars_fragment:wS,lights_pars_begin:AS,lights_toon_fragment:CS,lights_toon_pars_fragment:PS,lights_phong_fragment:IS,lights_phong_pars_fragment:LS,lights_physical_fragment:DS,lights_physical_pars_fragment:NS,lights_fragment_begin:OS,lights_fragment_maps:US,lights_fragment_end:FS,lightprobes_pars_fragment:BS,logdepthbuf_fragment:kS,logdepthbuf_pars_fragment:zS,logdepthbuf_pars_vertex:HS,logdepthbuf_vertex:GS,map_fragment:VS,map_pars_fragment:WS,map_particle_fragment:XS,map_particle_pars_fragment:qS,metalnessmap_fragment:YS,metalnessmap_pars_fragment:$S,morphinstance_vertex:KS,morphcolor_vertex:ZS,morphnormal_vertex:JS,morphtarget_pars_vertex:jS,morphtarget_vertex:QS,normal_fragment_begin:eM,normal_fragment_maps:tM,normal_pars_fragment:nM,normal_pars_vertex:iM,normal_vertex:sM,normalmap_pars_fragment:rM,clearcoat_normal_fragment_begin:oM,clearcoat_normal_fragment_maps:aM,clearcoat_pars_fragment:cM,iridescence_pars_fragment:lM,opaque_fragment:uM,packing:hM,premultiplied_alpha_fragment:fM,project_vertex:dM,dithering_fragment:pM,dithering_pars_fragment:mM,roughnessmap_fragment:gM,roughnessmap_pars_fragment:_M,shadowmap_pars_fragment:xM,shadowmap_pars_vertex:yM,shadowmap_vertex:vM,shadowmask_pars_fragment:SM,skinbase_vertex:MM,skinning_pars_vertex:bM,skinning_vertex:TM,skinnormal_vertex:EM,specularmap_fragment:wM,specularmap_pars_fragment:AM,tonemapping_fragment:RM,tonemapping_pars_fragment:CM,transmission_fragment:PM,transmission_pars_fragment:IM,uv_pars_fragment:LM,uv_pars_vertex:DM,uv_vertex:NM,worldpos_vertex:OM,background_vert:UM,background_frag:FM,backgroundCube_vert:BM,backgroundCube_frag:kM,cube_vert:zM,cube_frag:HM,depth_vert:GM,depth_frag:VM,distance_vert:WM,distance_frag:XM,equirect_vert:qM,equirect_frag:YM,linedashed_vert:$M,linedashed_frag:KM,meshbasic_vert:ZM,meshbasic_frag:JM,meshlambert_vert:jM,meshlambert_frag:QM,meshmatcap_vert:eb,meshmatcap_frag:tb,meshnormal_vert:nb,meshnormal_frag:ib,meshphong_vert:sb,meshphong_frag:rb,meshphysical_vert:ob,meshphysical_frag:ab,meshtoon_vert:cb,meshtoon_frag:lb,points_vert:ub,points_frag:hb,shadow_vert:fb,shadow_frag:db,sprite_vert:pb,sprite_frag:mb},be={common:{diffuse:{value:new ae(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qe}},envmap:{envMap:{value:null},envMapRotation:{value:new qe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qe},normalScale:{value:new Ee(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ae(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new ae(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0},uvTransform:{value:new qe}},sprite:{diffuse:{value:new ae(16777215)},opacity:{value:1},center:{value:new Ee(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}}},Ki={basic:{uniforms:kn([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.fog]),vertexShader:tt.meshbasic_vert,fragmentShader:tt.meshbasic_frag},lambert:{uniforms:kn([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.fog,be.lights,{emissive:{value:new ae(0)},envMapIntensity:{value:1}}]),vertexShader:tt.meshlambert_vert,fragmentShader:tt.meshlambert_frag},phong:{uniforms:kn([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.fog,be.lights,{emissive:{value:new ae(0)},specular:{value:new ae(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:tt.meshphong_vert,fragmentShader:tt.meshphong_frag},standard:{uniforms:kn([be.common,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.roughnessmap,be.metalnessmap,be.fog,be.lights,{emissive:{value:new ae(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:tt.meshphysical_vert,fragmentShader:tt.meshphysical_frag},toon:{uniforms:kn([be.common,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.gradientmap,be.fog,be.lights,{emissive:{value:new ae(0)}}]),vertexShader:tt.meshtoon_vert,fragmentShader:tt.meshtoon_frag},matcap:{uniforms:kn([be.common,be.bumpmap,be.normalmap,be.displacementmap,be.fog,{matcap:{value:null}}]),vertexShader:tt.meshmatcap_vert,fragmentShader:tt.meshmatcap_frag},points:{uniforms:kn([be.points,be.fog]),vertexShader:tt.points_vert,fragmentShader:tt.points_frag},dashed:{uniforms:kn([be.common,be.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:tt.linedashed_vert,fragmentShader:tt.linedashed_frag},depth:{uniforms:kn([be.common,be.displacementmap]),vertexShader:tt.depth_vert,fragmentShader:tt.depth_frag},normal:{uniforms:kn([be.common,be.bumpmap,be.normalmap,be.displacementmap,{opacity:{value:1}}]),vertexShader:tt.meshnormal_vert,fragmentShader:tt.meshnormal_frag},sprite:{uniforms:kn([be.sprite,be.fog]),vertexShader:tt.sprite_vert,fragmentShader:tt.sprite_frag},background:{uniforms:{uvTransform:{value:new qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:tt.background_vert,fragmentShader:tt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new qe}},vertexShader:tt.backgroundCube_vert,fragmentShader:tt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:tt.cube_vert,fragmentShader:tt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:tt.equirect_vert,fragmentShader:tt.equirect_frag},distance:{uniforms:kn([be.common,be.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:tt.distance_vert,fragmentShader:tt.distance_frag},shadow:{uniforms:kn([be.lights,be.fog,{color:{value:new ae(0)},opacity:{value:1}}]),vertexShader:tt.shadow_vert,fragmentShader:tt.shadow_frag}};Ki.physical={uniforms:kn([Ki.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qe},clearcoatNormalScale:{value:new Ee(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qe},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new qe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qe},sheen:{value:0},sheenColor:{value:new ae(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qe},transmissionSamplerSize:{value:new Ee},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qe},attenuationDistance:{value:0},attenuationColor:{value:new ae(0)},specularColor:{value:new ae(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qe},anisotropyVector:{value:new Ee},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qe}}]),vertexShader:tt.meshphysical_vert,fragmentShader:tt.meshphysical_frag};var eh={r:0,b:0,g:0},gb=new Xe,__=new qe;__.set(-1,0,0,0,1,0,0,0,1);function _b(n,e,t,i,s,r){let o=new ae(0),a=s===!0?0:1,c,l,u=null,h=0,f=null;function d(y){let v=y.isScene===!0?y.background:null;if(v&&v.isTexture){let S=y.backgroundBlurriness>0;v=e.get(v,S)}return v}function g(y){let v=!1,S=d(y);S===null?p(o,a):S&&S.isColor&&(p(S,1),v=!0);let E=n.xr.getEnvironmentBlendMode();E==="additive"?t.buffers.color.setClear(0,0,0,1,r):E==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(n.autoClear||v)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function _(y,v){let S=d(v);S&&S.isCubeTexture?(l===void 0&&(l=new Ye(new xt(1,1,1),new Ht({name:"BackgroundCubeMaterial",uniforms:Nr(Ki.backgroundCube.uniforms),vertexShader:Ki.backgroundCube.vertexShader,fragmentShader:Ki.backgroundCube.fragmentShader,side:Cn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(E,M,x){this.matrixWorld.copyPosition(x.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(l)),l.material.uniforms.envMap.value=S,l.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(gb.makeRotationFromEuler(v.backgroundRotation)).transpose(),S.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(__),l.material.toneMapped=Je.getTransfer(S.colorSpace)!==St,(u!==S||h!==S.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,u=S,h=S.version,f=n.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null)):S&&S.isTexture&&(c===void 0&&(c=new Ye(new ti(2,2),new Ht({name:"BackgroundMaterial",uniforms:Nr(Ki.background.uniforms),vertexShader:Ki.background.vertexShader,fragmentShader:Ki.background.fragmentShader,side:Xi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=S,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=Je.getTransfer(S.colorSpace)!==St,S.matrixAutoUpdate===!0&&S.updateMatrix(),c.material.uniforms.uvTransform.value.copy(S.matrix),(u!==S||h!==S.version||f!==n.toneMapping)&&(c.material.needsUpdate=!0,u=S,h=S.version,f=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function p(y,v){y.getRGB(eh,Ld(n)),t.buffers.color.setClear(eh.r,eh.g,eh.b,v,r)}function m(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(y,v=1){o.set(y),a=v,p(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(y){a=y,p(o,a)},render:g,addToRenderList:_,dispose:m}}function xb(n,e){let t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=f(null),r=s,o=!1;function a(A,L,B,P,H){let K=!1,$=h(A,P,B,L);r!==$&&(r=$,l(r.object)),K=d(A,P,B,H),K&&g(A,P,B,H),H!==null&&e.update(H,n.ELEMENT_ARRAY_BUFFER),(K||o)&&(o=!1,S(A,L,B,P),H!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function c(){return n.createVertexArray()}function l(A){return n.bindVertexArray(A)}function u(A){return n.deleteVertexArray(A)}function h(A,L,B,P){let H=P.wireframe===!0,K=i[L.id];K===void 0&&(K={},i[L.id]=K);let $=A.isInstancedMesh===!0?A.id:0,X=K[$];X===void 0&&(X={},K[$]=X);let G=X[B.id];G===void 0&&(G={},X[B.id]=G);let J=G[H];return J===void 0&&(J=f(c()),G[H]=J),J}function f(A){let L=[],B=[],P=[];for(let H=0;H<t;H++)L[H]=0,B[H]=0,P[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:B,attributeDivisors:P,object:A,attributes:{},index:null}}function d(A,L,B,P){let H=r.attributes,K=L.attributes,$=0,X=B.getAttributes();for(let G in X)if(X[G].location>=0){let se=H[G],ye=K[G];if(ye===void 0&&(G==="instanceMatrix"&&A.instanceMatrix&&(ye=A.instanceMatrix),G==="instanceColor"&&A.instanceColor&&(ye=A.instanceColor)),se===void 0||se.attribute!==ye||ye&&se.data!==ye.data)return!0;$++}return r.attributesNum!==$||r.index!==P}function g(A,L,B,P){let H={},K=L.attributes,$=0,X=B.getAttributes();for(let G in X)if(X[G].location>=0){let se=K[G];se===void 0&&(G==="instanceMatrix"&&A.instanceMatrix&&(se=A.instanceMatrix),G==="instanceColor"&&A.instanceColor&&(se=A.instanceColor));let ye={};ye.attribute=se,se&&se.data&&(ye.data=se.data),H[G]=ye,$++}r.attributes=H,r.attributesNum=$,r.index=P}function _(){let A=r.newAttributes;for(let L=0,B=A.length;L<B;L++)A[L]=0}function p(A){m(A,0)}function m(A,L){let B=r.newAttributes,P=r.enabledAttributes,H=r.attributeDivisors;B[A]=1,P[A]===0&&(n.enableVertexAttribArray(A),P[A]=1),H[A]!==L&&(n.vertexAttribDivisor(A,L),H[A]=L)}function y(){let A=r.newAttributes,L=r.enabledAttributes;for(let B=0,P=L.length;B<P;B++)L[B]!==A[B]&&(n.disableVertexAttribArray(B),L[B]=0)}function v(A,L,B,P,H,K,$){$===!0?n.vertexAttribIPointer(A,L,B,H,K):n.vertexAttribPointer(A,L,B,P,H,K)}function S(A,L,B,P){_();let H=P.attributes,K=B.getAttributes(),$=L.defaultAttributeValues;for(let X in K){let G=K[X];if(G.location>=0){let J=H[X];if(J===void 0&&(X==="instanceMatrix"&&A.instanceMatrix&&(J=A.instanceMatrix),X==="instanceColor"&&A.instanceColor&&(J=A.instanceColor)),J!==void 0){let se=J.normalized,ye=J.itemSize,Le=e.get(J);if(Le===void 0)continue;let j=Le.buffer,D=Le.type,O=Le.bytesPerElement,W=D===n.INT||D===n.UNSIGNED_INT||J.gpuType===pu;if(J.isInterleavedBufferAttribute){let k=J.data,ee=k.isInterleavedBuffer===!0?k.stride:k.itemSize,le=J.offset;if(k.isInstancedInterleavedBuffer||k.isInstancedBufferAttribute){for(let oe=0;oe<G.locationSize;oe++)m(G.location+oe,k.meshPerAttribute);A.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=k.meshPerAttribute*k.count)}else for(let oe=0;oe<G.locationSize;oe++)p(G.location+oe);n.bindBuffer(n.ARRAY_BUFFER,j);for(let oe=0;oe<G.locationSize;oe++)v(G.location+oe,ye/G.locationSize,D,se,ee*O,(le+ye/G.locationSize*oe)*O,W)}else{if(J.isInstancedBufferAttribute){for(let k=0;k<G.locationSize;k++)m(G.location+k,J.meshPerAttribute);A.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let k=0;k<G.locationSize;k++)p(G.location+k);n.bindBuffer(n.ARRAY_BUFFER,j);for(let k=0;k<G.locationSize;k++)v(G.location+k,ye/G.locationSize,D,se,ye*O,ye/G.locationSize*k*O,W)}}else if($!==void 0){let se=$[X];if(se!==void 0)switch(se.length){case 2:n.vertexAttrib2fv(G.location,se);break;case 3:n.vertexAttrib3fv(G.location,se);break;case 4:n.vertexAttrib4fv(G.location,se);break;default:n.vertexAttrib1fv(G.location,se)}}}}y()}function E(){R();for(let A in i){let L=i[A];for(let B in L){let P=L[B];for(let H in P){let K=P[H];for(let $ in K)u(K[$].object),delete K[$];delete P[H]}}delete i[A]}}function M(A){if(i[A.id]===void 0)return;let L=i[A.id];for(let B in L){let P=L[B];for(let H in P){let K=P[H];for(let $ in K)u(K[$].object),delete K[$];delete P[H]}}delete i[A.id]}function x(A){for(let L in i){let B=i[L];for(let P in B){let H=B[P];if(H[A.id]===void 0)continue;let K=H[A.id];for(let $ in K)u(K[$].object),delete K[$];delete H[A.id]}}}function b(A){for(let L in i){let B=i[L],P=A.isInstancedMesh===!0?A.id:0,H=B[P];if(H!==void 0){for(let K in H){let $=H[K];for(let X in $)u($[X].object),delete $[X];delete H[K]}delete B[P],Object.keys(B).length===0&&delete i[L]}}}function R(){I(),o=!0,r!==s&&(r=s,l(r.object))}function I(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:R,resetDefaultState:I,dispose:E,releaseStatesOfGeometry:M,releaseStatesOfObject:b,releaseStatesOfProgram:x,initAttributes:_,enableAttribute:p,disableUnusedAttributes:y}}function yb(n,e,t){let i;function s(c){i=c}function r(c,l){n.drawArrays(i,c,l),t.update(l,i,1)}function o(c,l,u){u!==0&&(n.drawArraysInstanced(i,c,l,u),t.update(l,i,u))}function a(c,l,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,l,0,u);let f=0;for(let d=0;d<u;d++)f+=l[d];t.update(f,i,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function vb(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let x=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(x.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(x){return!(x!==vi&&i.convert(x)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(x){let b=x===fn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(x!==ii&&x!==ui&&!b&&i.convert(x)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function c(x){if(x==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";x="mediump"}return x==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",u=c(l);u!==l&&(Be("WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);let h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=t.logarithmicDepthBuffer===!0&&h===!1;t.reversedDepthBuffer===!0&&h===!1&&Be("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&h===!0&&Be("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");let d=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),p=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),m=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),S=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),E=n.getParameter(n.MAX_SAMPLES),M=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:f,reversedDepthBuffer:h,maxTextures:d,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:y,maxVaryings:v,maxFragmentUniforms:S,maxSamples:E,samples:M}}function Sb(n){let e=this,t=null,i=0,s=!1,r=!1,o=new Ni,a=new qe,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){let d=h.length!==0||f||i!==0||s;return s=f,i=h.length,d},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,f){t=u(h,f,0)},this.setState=function(h,f,d){let g=h.clippingPlanes,_=h.clipIntersection,p=h.clipShadows,m=n.get(h);if(!s||g===null||g.length===0||r&&!p)r?u(null):l();else{let y=r?0:i,v=y*4,S=m.clippingState||null;c.value=S,S=u(g,f,v,d);for(let E=0;E!==v;++E)S[E]=t[E];m.clippingState=S,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,f,d,g){let _=h!==null?h.length:0,p=null;if(_!==0){if(p=c.value,g!==!0||p===null){let m=d+_*4,y=f.matrixWorldInverse;a.getNormalMatrix(y),(p===null||p.length<m)&&(p=new Float32Array(m));for(let v=0,S=d;v!==_;++v,S+=4)o.copy(h[v]).applyMatrix4(y,a),o.normal.toArray(p,S),p[S+3]=o.constant}c.value=p,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,p}}var uc=class extends Jt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Oa(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new xt(5,5,5),r=new Ht({name:"CubemapFromEquirect",uniforms:Nr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Cn,blending:Ss});r.uniforms.tEquirect.value=t;let o=new Ye(s,r),a=t.minFilter;return t.minFilter===yi&&(t.minFilter=un),new Oo(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,s);e.setRenderTarget(r)}},Kg=256,Mb=3,bb=20,x_=256,y_=16,Tb=3,Eb=new N,wb=new ae,Wo=class n{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Oo(1,10,null),this._boxMesh=new Ye(new xt(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){let{size:o=256,position:a=Eb}=r,c=this._renderer;this._setSize(o);let l=this._allocateTarget(),u=this._getSourceTarget(!0);t>0&&(u.texture.mipmapsAutoUpdate=!1);let h=c.autoClear,f=c.autoClearColor,d=c.autoClearDepth,g=c.autoClearStencil,_=e.background;c.autoClear=!0,c.autoClearColor=!0,c.autoClearDepth=!0,c.autoClearStencil=!0,_===null&&(e.background=c.getClearColor(wb));let p=new Oo(i,s,u);return p.position.copy(a),p.update(c,e),c.autoClear=h,c.autoClearColor=f,c.autoClearDepth=d,c.autoClearStencil=g,e.background=_,t>0&&(u.texture.mipmapsAutoUpdate=!0,this._blur(l,t)),this._applyPMREM(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=jg(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Jg(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(Kg,Rd(e))}_fromTexture(e,t){e.mapping===Ir||e.mapping===ko?this._setSize(e.image.length===0?Kg:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);let i=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(i),i}_allocateTarget(){let e=this._cubeSize,t=Zg(e,!1,!1),i=Math.log2(e)-Mb;for(let s=0;s<=i;s++)t.texture.mipmaps.push({width:e>>s,height:e>>s});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){let t=this._cubeSize,i=this._sourceTarget;return(i===null||i.width!==t||e&&i.depthBuffer===!1)&&(i!==null&&i.dispose(),this._sourceTarget=Zg(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,i){let s=this._boxMesh,r=this._cubeCamera;s.material=i,r.renderTarget=e,r.activeMipmapLevel=t;let o=e.width>>t;e.viewport.set(0,0,o,o),r.update(this._renderer,s),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===Ir||e.mapping===ko?(this._cubemapMaterial===null&&(this._cubemapMaterial=jg()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=Jg()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=Ab(),this._integrationMaterial=Rb());let t=this._cubeSize,i=e.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;let r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(t/y_);for(let o=0;o<=i;o++){let a=n.lodToRoughness(o,i);if(o>i-Tb)r.roughness.value=a,this._renderCube(e,o,this._integrationMaterial);else{let c=a>0?Math.log2(t)+.5*Math.log2(6/(x_*Math.pow(a,4)))+.5:0;s.roughness.value=a,s.lodBias.value=c,this._renderCube(e,o,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=Cb());let i=this._blurMaterial,s=i.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(e,0,i),s.envMap.value=e.texture,this._renderCube(r,0,i)}};function Zg(n,e,t){return new uc(n,{minFilter:yi,generateMipmaps:e,type:fn,colorSpace:An,depthBuffer:t})}function hc(n,e,t){return new Ht({name:n,uniforms:e,vertexShader:tt.cube_vert,fragmentShader:t,side:Cn,blending:Ss,depthTest:!1,depthWrite:!1})}function Ab(){return hc("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${x_}u

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
	`)}function Rb(){return hc("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:y_}},`

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
	`)}function Cb(){return hc("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${bb}
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
	`)}function Jg(){return hc("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

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
	`)}function jg(){return hc("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function Pb(n){let e=new WeakMap,t=new WeakMap,i=null;function s(f,d=!1){return f==null?null:d?o(f):r(f)}function r(f){if(f&&f.isTexture){let d=f.mapping;if(d===hu||d===fu)if(e.has(f)){let g=e.get(f).texture;return a(g,f.mapping)}else{let g=f.image;if(g&&g.height>0){let _=new uc(g.height);return _.fromEquirectangularTexture(n,f),e.set(f,_),f.addEventListener("dispose",l),a(_.texture,f.mapping)}else return null}}return f}function o(f){if(f&&f.isTexture&&f.isPMREMTexture!==!0){let d=f.mapping,g=d===hu||d===fu,_=d===Ir||d===ko;if(g||_){let p=t.get(f),m=p!==void 0?p.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==m)return i===null&&(i=new Wo(n)),p=g?i.fromEquirectangular(f,p):i.fromCubemap(f,p),p.texture.pmremVersion=f.pmremVersion,t.set(f,p),p.texture;if(p!==void 0)return p.texture;{let y=f.image;return g&&y&&y.height>0||_&&y&&c(y)?(i===null&&(i=new Wo(n)),p=g?i.fromEquirectangular(f):i.fromCubemap(f),p.texture.pmremVersion=f.pmremVersion,t.set(f,p),f.addEventListener("dispose",u),p.texture):null}}}return f}function a(f,d){return d===hu?f.mapping=Ir:d===fu&&(f.mapping=ko),f}function c(f){let d=0,g=6;for(let _=0;_<g;_++)f[_]!==void 0&&d++;return d===g}function l(f){let d=f.target;d.removeEventListener("dispose",l);let g=e.get(d);g!==void 0&&(e.delete(d),g.dispose())}function u(f){let d=f.target;d.removeEventListener("dispose",u);let g=t.get(d);g!==void 0&&(t.delete(d),g.dispose())}function h(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:h}}function Ib(n){let e={};function t(i){if(e[i]!==void 0)return e[i];let s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let s=t(i);return s===null&&gr("WebGLRenderer: "+i+" extension not supported."),s}}}function Lb(n,e,t,i){let s={},r=new WeakMap,o=new FinalizationRegistry(g=>delete s[g]);function a(g){c(g.target)}function c(g){g.index!==null&&e.remove(g.index);for(let p in g.attributes)e.remove(g.attributes[p]);g.removeEventListener("dispose",a),delete s[g.id],o.unregister(g);let _=r.get(g);_&&(e.remove(_),r.delete(g)),i.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,t.memory.geometries--}function l(g,_){return s[_.id]!==void 0||(_.addEventListener("dispose",a),s[_.id]=new WeakRef(_),o.register(_,_.id,_),t.memory.geometries++),_}function u(g){let _=g.attributes;for(let p in _)e.update(_[p],n.ARRAY_BUFFER)}function h(g){let _=g.index,p=g.attributes.position,m=0;if(p===void 0)return;let y=_!==null?_.array.length:p.array.length/3-1,v=p.count>=65535?Ia:Pa,S=new v(Math.ceil(y/3)*6,1),E=S.array;if(_!==null){let x=_.array;m=_.version;for(let b=0,R=0;b<y;b+=3){let I=x[b+0],A=x[b+1],L=x[b+2];E[R++]=I,E[R++]=A,E[R++]=A,E[R++]=L,E[R++]=L,E[R++]=I}}else{m=p.version;for(let x=0,b=0;x<y;x+=3){let R=x+0,I=x+1,A=x+2;E[b++]=R,E[b++]=I,E[b++]=I,E[b++]=A,E[b++]=A,E[b++]=R}}S.version=m;let M=r.get(g);M&&e.remove(M),r.set(g,S)}function f(g){let _=r.get(g);if(_){let p=g.index;p!==null&&_.version<p.version&&h(g)}else h(g);return r.get(g)}function d(){for(let g in s){let _=s[g].deref();_!==void 0&&c(_)}}return{get:l,update:u,getWireframeAttribute:f,dispose:d}}function Db(n,e,t){let i;function s(h){i=h}let r,o;function a(h){r=h.type,o=h.bytesPerElement}function c(h,f){n.drawElements(i,f,r,h*o),t.update(f,i,1)}function l(h,f,d){d!==0&&(n.drawElementsInstanced(i,f,r,h*o,d),t.update(f,i,d))}function u(h,f,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,r,h,0,d);let _=0;for(let p=0;p<d;p++)_+=f[p];t.update(_,i,1)}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function Nb(n){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(r/3);break;case n.LINES:t.lines+=a*(r/2);break;case n.LINE_STRIP:t.lines+=a*(r-1);break;case n.LINE_LOOP:t.lines+=a*r;break;case n.POINTS:t.points+=a*r;break;default:Ve("WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function Ob(n,e,t){let i=new WeakMap,s=new _t;function r(o,a,c){let l=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0,f=i.get(a);if(f===void 0||f.count!==h){let R=function(){x.dispose(),i.delete(a),a.removeEventListener("dispose",R)};f!==void 0&&f.texture.dispose();let d=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],y=a.morphAttributes.color||[],v=0;d===!0&&(v=1),g===!0&&(v=2),_===!0&&(v=3);let S=a.attributes.position.count*v,E=1;S>e.maxTextureSize&&(E=Math.ceil(S/e.maxTextureSize),S=e.maxTextureSize);let M=new Float32Array(S*E*4*h),x=new Aa(M,S,E,h);x.type=ui,x.needsUpdate=!0;let b=v*4;for(let I=0;I<h;I++){let A=p[I],L=m[I],B=y[I],P=S*E*4*I;for(let H=0;H<A.count;H++){let K=H*b;d===!0&&(s.fromBufferAttribute(A,H),M[P+K+0]=s.x,M[P+K+1]=s.y,M[P+K+2]=s.z,M[P+K+3]=0),g===!0&&(s.fromBufferAttribute(L,H),M[P+K+4]=s.x,M[P+K+5]=s.y,M[P+K+6]=s.z,M[P+K+7]=0),_===!0&&(s.fromBufferAttribute(B,H),M[P+K+8]=s.x,M[P+K+9]=s.y,M[P+K+10]=s.z,M[P+K+11]=B.itemSize===4?s.w:1)}}f={count:h,texture:x,size:new Ee(S,E)},i.set(a,f),a.addEventListener("dispose",R)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let d=0;for(let _=0;_<l.length;_++)d+=l[_];let g=a.morphTargetsRelative?1:1-d;c.getUniforms().setValue(n,"morphTargetBaseInfluence",g),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:r}}function Ub(n,e,t,i,s){let r=new WeakMap;function o(l){let u=s.render.frame,h=l.geometry,f=e.get(l,h);if(r.get(f)!==u&&(e.update(f),r.set(f,u)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==u&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,u))),l.isSkinnedMesh){let d=l.skeleton;r.get(d)!==u&&(d.update(),r.set(d,u))}return f}function a(){r=new WeakMap}function c(l){let u=l.target;u.removeEventListener("dispose",c),i.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:o,dispose:a}}var Fb={[Ka]:"LINEAR_TONE_MAPPING",[Za]:"REINHARD_TONE_MAPPING",[Ja]:"CINEON_TONE_MAPPING",[ja]:"ACES_FILMIC_TONE_MAPPING",[Pr]:"AGX_TONE_MAPPING",[ec]:"NEUTRAL_TONE_MAPPING",[Qa]:"CUSTOM_TONE_MAPPING"};function Bb(n,e,t,i,s,r){let o=new Jt(e,t,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,c=null,l=null,u=new vt;u.setAttribute("position",new rt([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute("uv",new rt([0,2,0,0,2,0],2));let h=new Do({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),f=new Ye(u,h),d=new vs(-1,1,1,-1,0,1),g=null,_=null,p=!1,m,y=null,v=[],S=!1;this.setSize=function(E,M){o.setSize(E,M),a!==null&&a.setSize(E,M),c!==null&&c.setSize(E,M);for(let x=0;x<v.length;x++){let b=v[x];b.setSize&&b.setSize(E,M)}},this.setEffects=function(E){v=E,S=v.length>0&&v[0].isRenderPass===!0;let M=o.width,x=o.height;v.length>0&&a===null&&(a=new Jt(M,x,{type:fn,depthBuffer:!1,stencilBuffer:!1}),c=new Jt(M,x,{type:fn,depthBuffer:!1,stencilBuffer:!1}));let b=s===!0&&v.some(R=>R.needsDepthTexture===!0);b!==(o.depthTexture!==null)&&(b===!0&&l===null&&(l=new ps(M,x),r===!0&&(l.format=bs,l.type=Dr)),o.dispose(),o.depthTexture=b?l:null,o.resolveDepthBuffer=b,o.storeMultisampledDepthBuffer=b);for(let R=0;R<v.length;R++){let I=v[R];I.setSize&&I.setSize(M,x),b&&I.needsDepthTexture===!0&&I.setDepthTexture&&I.setDepthTexture(l)}},this.begin=function(E,M){if(p||E.toneMapping===qi&&v.length===0)return!1;if(y=M,M!==null){let x=M.width,b=M.height;(o.width!==x||o.height!==b)&&this.setSize(x,b)}return S===!1&&E.setRenderTarget(o),m=E.toneMapping,E.toneMapping=qi,!0},this.hasRenderPass=function(){return S},this.end=function(E,M){E.toneMapping=m,p=!0;let x=o,b=a;for(let R=0;R<v.length;R++){let I=v[R];I.enabled!==!1&&(I.render(E,b,x,M),I.needsSwap!==!1&&(x=b,b=b===a?c:a))}if(g!==E.outputColorSpace||_!==E.toneMapping){g=E.outputColorSpace,_=E.toneMapping,h.defines={},Je.getTransfer(g)===St&&(h.defines.SRGB_TRANSFER="");let R=Fb[_];R&&(h.defines[R]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=x.texture,E.setRenderTarget(y),E.render(f,d),y=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),c!==null&&c.dispose(),u.dispose(),h.dispose()}}var v_=new hn,S_=new ps(1,1),M_=new Fa(1),b_=new Aa,T_=new Wl,E_=new Oa,Qg=[],e_=[],t_=new Float32Array(16),n_=new Float32Array(9),i_=new Float32Array(4);function Xo(n,e,t){let i=n[0];if(i<=0||i>0)return n;let s=e*t,r=Qg[s];if(r===void 0&&(r=new Float32Array(s),Qg[s]=r),e!==0){i.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(r,a)}return r}function dn(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function pn(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function ih(n,e){let t=e_[e];t===void 0&&(t=new Int32Array(e),e_[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function kb(n,e){let t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function zb(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dn(t,e))return;n.uniform2fv(this.addr,e),pn(t,e)}}function Hb(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(dn(t,e))return;n.uniform3fv(this.addr,e),pn(t,e)}}function Gb(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dn(t,e))return;n.uniform4fv(this.addr,e),pn(t,e)}}function Vb(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(dn(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),pn(t,e)}else{if(dn(t,i))return;i_.set(i),n.uniformMatrix2fv(this.addr,!1,i_),pn(t,i)}}function Wb(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(dn(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),pn(t,e)}else{if(dn(t,i))return;n_.set(i),n.uniformMatrix3fv(this.addr,!1,n_),pn(t,i)}}function Xb(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(dn(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),pn(t,e)}else{if(dn(t,i))return;t_.set(i),n.uniformMatrix4fv(this.addr,!1,t_),pn(t,i)}}function qb(n,e){let t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Yb(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dn(t,e))return;n.uniform2iv(this.addr,e),pn(t,e)}}function $b(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(dn(t,e))return;n.uniform3iv(this.addr,e),pn(t,e)}}function Kb(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dn(t,e))return;n.uniform4iv(this.addr,e),pn(t,e)}}function Zb(n,e){let t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Jb(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dn(t,e))return;n.uniform2uiv(this.addr,e),pn(t,e)}}function jb(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(dn(t,e))return;n.uniform3uiv(this.addr,e),pn(t,e)}}function Qb(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dn(t,e))return;n.uniform4uiv(this.addr,e),pn(t,e)}}function sh(n){return n.version===0&&(n.compareFunction=Td,n.needsUpdate=!0),n}function eT(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?r=sh(S_):r=v_,t.setTexture2D(e||r,s)}function tT(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||T_,s)}function nT(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_CUBE_SHADOW?r=sh(M_):r=E_,t.setTextureCube(e||r,s)}function iT(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||b_,s)}function sT(n){switch(n){case 5126:return kb;case 35664:return zb;case 35665:return Hb;case 35666:return Gb;case 35674:return Vb;case 35675:return Wb;case 35676:return Xb;case 5124:case 35670:return qb;case 35667:case 35671:return Yb;case 35668:case 35672:return $b;case 35669:case 35673:return Kb;case 5125:return Zb;case 36294:return Jb;case 36295:return jb;case 36296:return Qb;case 35678:case 36198:case 36298:case 36306:case 35682:return eT;case 35679:case 36299:case 36307:return tT;case 35680:case 36300:case 36308:case 36293:return nT;case 36289:case 36303:case 36311:case 36292:return iT}}function rT(n,e){n.uniform1fv(this.addr,e)}function oT(n,e){let t=Xo(e,this.size,2);n.uniform2fv(this.addr,t)}function aT(n,e){let t=Xo(e,this.size,3);n.uniform3fv(this.addr,t)}function cT(n,e){let t=Xo(e,this.size,4);n.uniform4fv(this.addr,t)}function lT(n,e){let t=Xo(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function uT(n,e){let t=Xo(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function hT(n,e){let t=Xo(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function fT(n,e){n.uniform1iv(this.addr,e)}function dT(n,e){n.uniform2iv(this.addr,e)}function pT(n,e){n.uniform3iv(this.addr,e)}function mT(n,e){n.uniform4iv(this.addr,e)}function gT(n,e){n.uniform1uiv(this.addr,e)}function _T(n,e){n.uniform2uiv(this.addr,e)}function xT(n,e){n.uniform3uiv(this.addr,e)}function yT(n,e){n.uniform4uiv(this.addr,e)}function vT(n,e,t){let i=this.cache,s=e.length,r=ih(t,s);dn(i,r)||(n.uniform1iv(this.addr,r),pn(i,r));let o;this.type===n.SAMPLER_2D_SHADOW?o=sh(S_):o=v_;for(let a=0;a!==s;++a)t.setTexture2D(e[a]||o,r[a])}function ST(n,e,t){let i=this.cache,s=e.length,r=ih(t,s);dn(i,r)||(n.uniform1iv(this.addr,r),pn(i,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||T_,r[o])}function MT(n,e,t){let i=this.cache,s=e.length,r=ih(t,s);dn(i,r)||(n.uniform1iv(this.addr,r),pn(i,r));let o;this.type===n.SAMPLER_CUBE_SHADOW?o=sh(M_):o=E_;for(let a=0;a!==s;++a)t.setTextureCube(e[a]||o,r[a])}function bT(n,e,t){let i=this.cache,s=e.length,r=ih(t,s);dn(i,r)||(n.uniform1iv(this.addr,r),pn(i,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||b_,r[o])}function TT(n){switch(n){case 5126:return rT;case 35664:return oT;case 35665:return aT;case 35666:return cT;case 35674:return lT;case 35675:return uT;case 35676:return hT;case 5124:case 35670:return fT;case 35667:case 35671:return dT;case 35668:case 35672:return pT;case 35669:case 35673:return mT;case 5125:return gT;case 36294:return _T;case 36295:return xT;case 36296:return yT;case 35678:case 36198:case 36298:case 36306:case 35682:return vT;case 35679:case 36299:case 36307:return ST;case 35680:case 36300:case 36308:case 36293:return MT;case 36289:case 36303:case 36311:case 36292:return bT}}var Bd=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=sT(t.type)}},kd=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=TT(t.type)}},zd=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],i)}}},Ud=/(\w+)(\])?(\[|\.)?/g;function s_(n,e){n.seq.push(e),n.map[e.id]=e}function ET(n,e,t){let i=n.name,s=i.length;for(Ud.lastIndex=0;;){let r=Ud.exec(i),o=Ud.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){s_(t,l===void 0?new Bd(a,n,e):new kd(a,n,e));break}else{let h=t.map[a];h===void 0&&(h=new zd(a),s_(t,h)),t=h}}}var Vo=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){let a=e.getActiveUniform(t,o),c=e.getUniformLocation(t,a.name);ET(a,c,this)}let s=[],r=[];for(let o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){let r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){let s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],c=i[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){let i=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&i.push(o)}return i}};function r_(n,e,t){let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}var wT=37297,AT=0;function RT(n,e){let t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}var o_=new qe;function CT(n){Je._getMatrix(o_,Je.workingColorSpace,n);let e=`mat3( ${o_.elements.map(t=>t.toFixed(4))} )`;switch(Je.getTransfer(n)){case Ea:return[e,"LinearTransferOETF"];case St:return[e,"sRGBTransferOETF"];default:return Be("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function a_(n,e,t){let i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+RT(n.getShaderSource(e),a)}else return r}function PT(n,e){let t=CT(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}var IT={[Ka]:"Linear",[Za]:"Reinhard",[Ja]:"Cineon",[ja]:"ACESFilmic",[Pr]:"AgX",[ec]:"Neutral",[Qa]:"Custom"};function LT(n,e){let t=IT[e];return t===void 0?(Be("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var th=new N;function DT(){Je.getLuminanceCoefficients(th);let n=th.x.toFixed(4),e=th.y.toFixed(4),t=th.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function NT(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(lc).join(`
`)}function OT(n){let e=[];for(let t in n){let i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function UT(n,e){let t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(e,s),o=r.name,a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function lc(n){return n!==""}function c_(n,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function l_(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var FT=/^[ \t]*#include +<([\w\d./]+)>/gm;function Hd(n){return n.replace(FT,BT)}function BT(n,e){let t=tt[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return Hd(t)}var kT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function u_(n){return n.replace(kT,zT)}function zT(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function h_(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}var HT={[Rr]:"SHADOWMAP_TYPE_PCF",[Fo]:"SHADOWMAP_TYPE_VSM"};function GT(n){return HT[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var VT={[ko]:"ENVMAP_MODE_REFRACTION"};function WT(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":VT[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}var XT={[dd]:"ENVMAP_BLENDING_MULTIPLY",[Pg]:"ENVMAP_BLENDING_MIX",[Ig]:"ENVMAP_BLENDING_ADD"};function qT(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":XT[n.combine]||"ENVMAP_BLENDING_NONE"}function YT(n,e,t,i){let s=n.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,c=GT(t),l=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",u=WT(t),h=qT(t),f=NT(t),d=OT(r),g=s.createProgram(),_,p,m=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(_=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d].filter(lc).join(`
`),_.length>0&&(_+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d].filter(lc).join(`
`),p.length>0&&(p+=`
`)):(_=[h_(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(lc).join(`
`),p=[h_(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==qi?"#define TONE_MAPPING":"",t.toneMapping!==qi?tt.tonemapping_pars_fragment:"",t.toneMapping!==qi?LT("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",tt.colorspace_pars_fragment,PT("linearToOutputTexel",t.outputColorSpace),DT(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(lc).join(`
`)),o=Hd(o),o=c_(o,t),o=l_(o,t),a=Hd(a),a=c_(a,t),a=l_(a,t),o=u_(o),a=u_(a),t.isRawShaderMaterial!==!0&&(m=`#version 300 es
`,_=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+_,p=["#define varying in",t.glslVersion===wd?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===wd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let y=m+_+o,v=m+p+a,S=r_(s,s.VERTEX_SHADER,y),E=r_(s,s.FRAGMENT_SHADER,v);s.attachShader(g,S),s.attachShader(g,E),t.index0AttributeName!==void 0?s.bindAttribLocation(g,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(g,0,"position"),s.linkProgram(g);function M(I){if(n.debug.checkShaderErrors){let A=s.getProgramInfoLog(g)||"",L=s.getShaderInfoLog(S)||"",B=s.getShaderInfoLog(E)||"",P=A.trim(),H=L.trim(),K=B.trim(),$=!0,X=!0;if(s.getProgramParameter(g,s.LINK_STATUS)===!1)if($=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,g,S,E);else{let G=a_(s,S,"vertex"),J=a_(s,E,"fragment");Ve("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(g,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+P+`
`+G+`
`+J)}else P!==""?Be("WebGLProgram: Program Info Log:",P):(H===""||K==="")&&(X=!1);X&&(I.diagnostics={runnable:$,programLog:P,vertexShader:{log:H,prefix:_},fragmentShader:{log:K,prefix:p}})}s.deleteShader(S),s.deleteShader(E),x=new Vo(s,g),b=UT(s,g)}let x;this.getUniforms=function(){return x===void 0&&M(this),x};let b;this.getAttributes=function(){return b===void 0&&M(this),b};let R=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=s.getProgramParameter(g,wT)),R},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(g),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=AT++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=S,this.fragmentShader=E,this}var $T=0,Gd=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new Vd(e),t.set(e,i)),i}},Vd=class{constructor(e){this.id=$T++,this.code=e,this.usedTimes=0}};function KT(n){return n===Ys||n===rc||n===oc}function ZT(n,e,t,i,s,r){let o=new Ra,a=new Gd,c=new Set,l=[],u=new Map,h=i.logarithmicDepthBuffer,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function d(x){return c.add(x),x===0?"uv":`uv${x}`}function g(x,b,R,I,A,L){let B=I.fog,P=A.geometry,H=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?I.environment:null,K=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,$=e.get(x.envMap||H,K),X=f[x.type],G=i.precision;x.precision!==null&&(G=i.getMaxPrecision(x.precision),G!==x.precision&&Be("WebGLProgram.getParameters:",x.precision,"not supported, using",G,"instead."));let J=P.morphAttributes.position||P.morphAttributes.normal||P.morphAttributes.color,se=J!==void 0?J.length:0,ye=0;P.morphAttributes.position!==void 0&&(ye=1),P.morphAttributes.normal!==void 0&&(ye=2),P.morphAttributes.color!==void 0&&(ye=3);let Le,j,D,O;if(X){let Te=Ki[X];Le=Te.vertexShader,j=Te.fragmentShader}else{Le=x.vertexShader,j=x.fragmentShader;let Te=a.getVertexShaderStage(x),Ct=a.getFragmentShaderStage(x);a.update(x,Te,Ct),D=Te.id,O=Ct.id}let W=n.getRenderTarget(),k=n.state.buffers.depth.getReversed(),ee=A.isInstancedMesh===!0,le=A.isBatchedMesh===!0,oe=!!x.map,Ie=!!x.matcap,Ce=!!$,Ae=Ce&&$.isPMREMTexture===!0,$e=!!x.aoMap,ht=!!x.lightMap,Pt=!!x.bumpMap&&x.wireframe===!1,ut=!!x.normalMap,In=!!x.displacementMap,At=!!x.emissiveMap,cn=!!x.metalnessMap,Ln=!!x.roughnessMap,Dn=x.anisotropy>0,z=x.clearcoat>0,di=x.diffuseRoughness>0,kt=x.dispersion>0,zt=x.retroreflectivity>0,Me=x.iridescence>0,ln=x.sheen>0,He=x.transmission>0,Ke=Dn&&!!x.anisotropyMap,C=z&&!!x.clearcoatMap,T=z&&!!x.clearcoatNormalMap,q=z&&!!x.clearcoatRoughnessMap,ue=di&&!!x.diffuseRoughnessMap,re=Me&&!!x.iridescenceMap,de=Me&&!!x.iridescenceThicknessMap,ve=ln&&!!x.sheenColorMap,te=ln&&!!x.sheenRoughnessMap,ne=!!x.specularMap,me=!!x.specularColorMap,U=!!x.specularIntensityMap,ie=He&&!!x.transmissionMap,Q=He&&!!x.thicknessMap,ge=!!x.gradientMap,fe=!!x.alphaMap,pe=x.alphaTest>0,ke=!!x.alphaHash,et=!!x.extensions,he=qi;x.toneMapped&&(W===null||W.isXRRenderTarget===!0)&&(he=n.toneMapping);let ze=Ae?$.isCompressedCubeTexture?$.image[0].mipmaps:$.mipmaps:null,Qe={shaderID:X,shaderType:x.type,shaderName:x.name,vertexShader:Le,fragmentShader:j,defines:x.defines,customVertexShaderID:D,customFragmentShaderID:O,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:G,batching:le,batchingColor:le&&A._colorsTexture!==null,instancing:ee,instancingColor:ee&&A.instanceColor!==null,instancingMorph:ee&&A.morphTexture!==null,outputColorSpace:W===null?n.outputColorSpace:W.isXRRenderTarget===!0?W.texture.colorSpace:Je.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:oe,matcap:Ie,envMap:Ce,envMapMode:Ce&&$.mapping,envMapPMREM:Ae,envMapMaxLod:Ae?ze.length-1:null,envMapSize:Ae?ze[0].width:null,aoMap:$e,lightMap:ht,bumpMap:Pt,normalMap:ut,displacementMap:In,emissiveMap:At,normalMapObjectSpace:ut&&x.normalMapType===Og,normalMapTangentSpace:ut&&x.normalMapType===Ju,packedNormalMap:ut&&x.normalMapType===Ju&&KT(x.normalMap.format),metalnessMap:cn,roughnessMap:Ln,anisotropy:Dn,anisotropyMap:Ke,clearcoat:z,clearcoatMap:C,clearcoatNormalMap:T,clearcoatRoughnessMap:q,diffuseRoughness:di,diffuseRoughnessMap:ue,dispersion:kt,retroreflection:zt,iridescence:Me,iridescenceMap:re,iridescenceThicknessMap:de,sheen:ln,sheenColorMap:ve,sheenRoughnessMap:te,specularMap:ne,specularColorMap:me,specularIntensityMap:U,transmission:He,transmissionMap:ie,thicknessMap:Q,gradientMap:ge,opaque:x.transparent===!1&&x.blending===Bo&&x.alphaToCoverage===!1,alphaMap:fe,alphaTest:pe,alphaHash:ke,combine:x.combine,mapUv:oe&&d(x.map.channel),aoMapUv:$e&&d(x.aoMap.channel),lightMapUv:ht&&d(x.lightMap.channel),bumpMapUv:Pt&&d(x.bumpMap.channel),normalMapUv:ut&&d(x.normalMap.channel),displacementMapUv:In&&d(x.displacementMap.channel),emissiveMapUv:At&&d(x.emissiveMap.channel),metalnessMapUv:cn&&d(x.metalnessMap.channel),roughnessMapUv:Ln&&d(x.roughnessMap.channel),anisotropyMapUv:Ke&&d(x.anisotropyMap.channel),clearcoatMapUv:C&&d(x.clearcoatMap.channel),clearcoatNormalMapUv:T&&d(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:q&&d(x.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:ue&&d(x.diffuseRoughnessMap.channel),iridescenceMapUv:re&&d(x.iridescenceMap.channel),iridescenceThicknessMapUv:de&&d(x.iridescenceThicknessMap.channel),sheenColorMapUv:ve&&d(x.sheenColorMap.channel),sheenRoughnessMapUv:te&&d(x.sheenRoughnessMap.channel),specularMapUv:ne&&d(x.specularMap.channel),specularColorMapUv:me&&d(x.specularColorMap.channel),specularIntensityMapUv:U&&d(x.specularIntensityMap.channel),transmissionMapUv:ie&&d(x.transmissionMap.channel),thicknessMapUv:Q&&d(x.thicknessMap.channel),alphaMapUv:fe&&d(x.alphaMap.channel),vertexTangents:!!P.attributes.tangent&&(ut||Dn),vertexNormals:!!P.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!P.attributes.color&&P.attributes.color.itemSize===4,pointsUvs:A.isPoints===!0&&!!P.attributes.uv&&(oe||fe),fog:!!B,useFog:x.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||P.attributes.normal===void 0&&ut===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:k,skinning:A.isSkinnedMesh===!0,hasPositionAttribute:P.attributes.position!==void 0,morphTargets:P.morphAttributes.position!==void 0,morphNormals:P.morphAttributes.normal!==void 0,morphColors:P.morphAttributes.color!==void 0,morphTargetsCount:se,morphTextureStride:ye,numSunLights:b.sun.length,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numSunLightShadows:b.sunShadowMap.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numLightProbeGrids:L.filter(Te=>Te.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:n.shadowMap.enabled&&R.length>0,shadowMapType:n.shadowMap.type,toneMapping:he,decodeVideoTexture:oe&&x.map.isVideoTexture===!0&&Je.getTransfer(x.map.colorSpace)===St,decodeVideoTextureEmissive:At&&x.emissiveMap.isVideoTexture===!0&&Je.getTransfer(x.emissiveMap.colorSpace)===St,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Sn,flipSided:x.side===Cn,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:et&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(et&&x.extensions.multiDraw===!0||le)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Qe.vertexUv1s=c.has(1),Qe.vertexUv2s=c.has(2),Qe.vertexUv3s=c.has(3),c.clear(),Qe}function _(x){let b=[];if(x.shaderID?b.push(x.shaderID):(b.push(x.customVertexShaderID),b.push(x.customFragmentShaderID)),x.defines!==void 0)for(let R in x.defines)b.push(R),b.push(x.defines[R]);return x.isRawShaderMaterial===!1&&(p(b,x),m(b,x),b.push(n.outputColorSpace)),b.push(x.customProgramCacheKey),b.join()}function p(x,b){x.push(b.precision),x.push(b.outputColorSpace),x.push(b.envMapMode),x.push(b.envMapPMREM),x.push(b.envMapMaxLod),x.push(b.envMapSize),x.push(b.mapUv),x.push(b.alphaMapUv),x.push(b.lightMapUv),x.push(b.aoMapUv),x.push(b.bumpMapUv),x.push(b.normalMapUv),x.push(b.displacementMapUv),x.push(b.emissiveMapUv),x.push(b.metalnessMapUv),x.push(b.roughnessMapUv),x.push(b.anisotropyMapUv),x.push(b.clearcoatMapUv),x.push(b.clearcoatNormalMapUv),x.push(b.clearcoatRoughnessMapUv),x.push(b.diffuseRoughnessMapUv),x.push(b.iridescenceMapUv),x.push(b.iridescenceThicknessMapUv),x.push(b.sheenColorMapUv),x.push(b.sheenRoughnessMapUv),x.push(b.specularMapUv),x.push(b.specularColorMapUv),x.push(b.specularIntensityMapUv),x.push(b.transmissionMapUv),x.push(b.thicknessMapUv),x.push(b.combine),x.push(b.fogExp2),x.push(b.sizeAttenuation),x.push(b.morphTargetsCount),x.push(b.numSunLights),x.push(b.numDirLights),x.push(b.numPointLights),x.push(b.numSpotLights),x.push(b.numSpotLightMaps),x.push(b.numHemiLights),x.push(b.numRectAreaLights),x.push(b.numSunLightShadows),x.push(b.numDirLightShadows),x.push(b.numPointLightShadows),x.push(b.numSpotLightShadows),x.push(b.numSpotLightShadowsWithMaps),x.push(b.numLightProbes),x.push(b.numLightProbeGrids),x.push(b.shadowMapType),x.push(b.toneMapping),x.push(b.numClippingPlanes),x.push(b.numClipIntersection),x.push(b.depthPacking)}function m(x,b){o.disableAll(),b.instancing&&o.enable(0),b.instancingColor&&o.enable(1),b.instancingMorph&&o.enable(2),b.matcap&&o.enable(3),b.envMap&&o.enable(4),b.normalMapObjectSpace&&o.enable(5),b.normalMapTangentSpace&&o.enable(6),b.clearcoat&&o.enable(7),b.iridescence&&o.enable(8),b.alphaTest&&o.enable(9),b.vertexColors&&o.enable(10),b.vertexAlphas&&o.enable(11),b.vertexUv1s&&o.enable(12),b.vertexUv2s&&o.enable(13),b.vertexUv3s&&o.enable(14),b.vertexTangents&&o.enable(15),b.anisotropy&&o.enable(16),b.alphaHash&&o.enable(17),b.batching&&o.enable(18),b.dispersion&&o.enable(19),b.retroreflection&&o.enable(24),b.diffuseRoughness&&o.enable(25),b.batchingColor&&o.enable(20),b.gradientMap&&o.enable(21),b.packedNormalMap&&o.enable(22),b.vertexNormals&&o.enable(23),x.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),b.numLightProbeGrids>0&&o.enable(22),b.hasPositionAttribute&&o.enable(23),x.push(o.mask)}function y(x){let b=f[x.type],R;if(b){let I=Ki[b];R=Fi.clone(I.uniforms)}else R=x.uniforms;return R}function v(x,b){let R=u.get(b);return R!==void 0?++R.usedTimes:(R=new YT(n,b,x,s),l.push(R),u.set(b,R)),R}function S(x){if(--x.usedTimes===0){let b=l.indexOf(x);l[b]=l[l.length-1],l.pop(),u.delete(x.cacheKey),x.destroy()}}function E(x){a.remove(x)}function M(){a.dispose()}return{getParameters:g,getProgramCacheKey:_,getUniforms:y,acquireProgram:v,releaseProgram:S,releaseShaderCache:E,programs:l,dispose:M}}function JT(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,c){n.get(o)[a]=c}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function jT(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function f_(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function d_(){let n=[],e=0,t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function o(f){let d=0;return f.isInstancedMesh&&(d+=2),f.isSkinnedMesh&&(d+=1),d}function a(f,d,g,_,p,m){let y=n[e];return y===void 0?(y={id:f.id,object:f,geometry:d,material:g,materialVariant:o(f),groupOrder:_,renderOrder:f.renderOrder,z:p,group:m},n[e]=y):(y.id=f.id,y.object=f,y.geometry=d,y.material=g,y.materialVariant=o(f),y.groupOrder=_,y.renderOrder=f.renderOrder,y.z=p,y.group=m),e++,y}function c(f,d,g,_,p,m,y){y.reversedDepth===!0&&(p=-p);let v=a(f,d,g,_,p,m);g.transmission>0?i.push(v):g.transparent===!0?s.push(v):t.push(v)}function l(f,d,g,_,p,m){let y=a(f,d,g,_,p,m);g.transmission>0?i.unshift(y):g.transparent===!0?s.unshift(y):t.unshift(y)}function u(f,d){t.length>1&&t.sort(f||jT),i.length>1&&i.sort(d||f_),s.length>1&&s.sort(d||f_)}function h(){for(let f=e,d=n.length;f<d;f++){let g=n[f];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:c,unshift:l,finish:h,sort:u}}function QT(){let n=new WeakMap;function e(i,s){let r=n.get(i),o;return r===void 0?(o=new d_,n.set(i,[o])):s>=r.length?(o=new d_,r.push(o)):o=r[s],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function e1(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new N,color:new ae};break;case"SpotLight":t={position:new N,direction:new N,color:new ae,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new N,color:new ae,distance:0,decay:0};break;case"HemisphereLight":t={direction:new N,skyColor:new ae,groundColor:new ae};break;case"RectAreaLight":t={color:new ae,position:new N,halfWidth:new N,halfHeight:new N};break}return n[e.id]=t,t}}}function t1(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ee};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ee};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ee,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}var n1=0;function i1(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function s1(n){let e=new e1,t=t1(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new N);let s=new N,r=new Xe,o=new Xe;function a(l){let u=0,h=0,f=0;for(let L=0;L<9;L++)i.probe[L].set(0,0,0);let d=0,g=0,_=0,p=0,m=0,y=0,v=0,S=0,E=0,M=0,x=0,b=0,R=0,I=0;l.sort(i1);for(let L=0,B=l.length;L<B;L++){let P=l[L],H=P.color,K=P.intensity,$=P.distance,X=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===Ys?X=P.shadow.map.texture:X=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)u+=H.r*K,h+=H.g*K,f+=H.b*K;else if(P.isLightProbe){for(let G=0;G<9;G++)i.probe[G].addScaledVector(P.sh.coefficients[G],K);I++}else if(P.isSunLight){let G=e.get(P);if(G.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let J=P.shadow,se=t.get(P);se.shadowIntensity=J.intensity,se.shadowBias=J.bias,se.shadowNormalBias=J.normalBias,se.shadowRadius=J.radius,se.shadowMapSize.copy(J.mapSize).multiply(J.getFrameExtents()),i.sunShadow[g]=se,i.sunShadowMap[g]=X;let ye=J.getViewportCount();for(let Le=0;Le<ye;Le++)i.sunShadowMatrix[_+Le]=J.getMatrix(Le),i.sunShadowCascade[_+Le]=J._cascadeData[Le];_+=ye,g++}i.sun[d]=G,d++}else if(P.isDirectionalLight){let G=e.get(P);if(G.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let J=P.shadow,se=t.get(P);se.shadowIntensity=J.intensity,se.shadowBias=J.bias,se.shadowNormalBias=J.normalBias,se.shadowRadius=J.radius,se.shadowMapSize=J.mapSize,i.directionalShadow[p]=se,i.directionalShadowMap[p]=X,i.directionalShadowMatrix[p]=P.shadow.matrix,E++}i.directional[p]=G,p++}else if(P.isSpotLight){let G=e.get(P);G.position.setFromMatrixPosition(P.matrixWorld),G.color.copy(H).multiplyScalar(K),G.distance=$,G.coneCos=Math.cos(P.angle),G.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),G.decay=P.decay,i.spot[y]=G;let J=P.shadow;if(P.map&&(i.spotLightMap[b]=P.map,b++,J.updateMatrices(P),P.castShadow&&R++),i.spotLightMatrix[y]=J.matrix,P.castShadow){let se=t.get(P);se.shadowIntensity=J.intensity,se.shadowBias=J.bias,se.shadowNormalBias=J.normalBias,se.shadowRadius=J.radius,se.shadowMapSize=J.mapSize,i.spotShadow[y]=se,i.spotShadowMap[y]=X,x++}y++}else if(P.isRectAreaLight){let G=e.get(P);G.color.copy(H).multiplyScalar(K),G.halfWidth.set(P.width*.5,0,0),G.halfHeight.set(0,P.height*.5,0),i.rectArea[v]=G,v++}else if(P.isPointLight){let G=e.get(P);if(G.color.copy(P.color).multiplyScalar(P.intensity),G.distance=P.distance,G.decay=P.decay,P.castShadow){let J=P.shadow,se=t.get(P);se.shadowIntensity=J.intensity,se.shadowBias=J.bias,se.shadowNormalBias=J.normalBias,se.shadowRadius=J.radius,se.shadowMapSize=J.mapSize,se.shadowCameraNear=J.camera.near,se.shadowCameraFar=J.camera.far,i.pointShadow[m]=se,i.pointShadowMap[m]=X,i.pointShadowMatrix[m]=P.shadow.matrix,M++}i.point[m]=G,m++}else if(P.isHemisphereLight){let G=e.get(P);G.skyColor.copy(P.color).multiplyScalar(K),G.groundColor.copy(P.groundColor).multiplyScalar(K),i.hemi[S]=G,S++}}v>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=be.LTC_FLOAT_1,i.rectAreaLTC2=be.LTC_FLOAT_2):(i.rectAreaLTC1=be.LTC_HALF_1,i.rectAreaLTC2=be.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=f;let A=i.hash;(A.sunLength!==d||A.directionalLength!==p||A.pointLength!==m||A.spotLength!==y||A.rectAreaLength!==v||A.hemiLength!==S||A.numSunShadows!==g||A.numDirectionalShadows!==E||A.numPointShadows!==M||A.numSpotShadows!==x||A.numSpotMaps!==b||A.numLightProbes!==I)&&(i.sun.length=d,i.directional.length=p,i.spot.length=y,i.rectArea.length=v,i.point.length=m,i.hemi.length=S,i.sunShadow.length=g,i.sunShadowMap.length=g,i.sunShadowMatrix.length=_,i.sunShadowCascade.length=_,i.directionalShadow.length=E,i.directionalShadowMap.length=E,i.directionalShadowMatrix.length=E,i.pointShadow.length=M,i.pointShadowMap.length=M,i.pointShadowMatrix.length=M,i.spotShadow.length=x,i.spotShadowMap.length=x,i.spotLightMatrix.length=x+b-R,i.spotLightMap.length=b,i.numSpotLightShadowsWithMaps=R,i.numLightProbes=I,A.sunLength=d,A.directionalLength=p,A.pointLength=m,A.spotLength=y,A.rectAreaLength=v,A.hemiLength=S,A.numSunShadows=g,A.numDirectionalShadows=E,A.numPointShadows=M,A.numSpotShadows=x,A.numSpotMaps=b,A.numLightProbes=I,i.version=n1++)}function c(l,u){let h=0,f=0,d=0,g=0,_=0,p=0,m=u.matrixWorldInverse;for(let y=0,v=l.length;y<v;y++){let S=l[y];if(S.isSunLight){let E=i.sun[h];E.direction.setFromMatrixPosition(S.matrixWorld),E.direction.transformDirection(m),h++}else if(S.isDirectionalLight){let E=i.directional[f];E.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(m),f++}else if(S.isSpotLight){let E=i.spot[g];E.position.setFromMatrixPosition(S.matrixWorld),E.position.applyMatrix4(m),E.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(m),g++}else if(S.isRectAreaLight){let E=i.rectArea[_];E.position.setFromMatrixPosition(S.matrixWorld),E.position.applyMatrix4(m),o.identity(),r.copy(S.matrixWorld),r.premultiply(m),o.extractRotation(r),E.halfWidth.set(S.width*.5,0,0),E.halfHeight.set(0,S.height*.5,0),E.halfWidth.applyMatrix4(o),E.halfHeight.applyMatrix4(o),_++}else if(S.isPointLight){let E=i.point[d];E.position.setFromMatrixPosition(S.matrixWorld),E.position.applyMatrix4(m),d++}else if(S.isHemisphereLight){let E=i.hemi[p];E.direction.setFromMatrixPosition(S.matrixWorld),E.direction.transformDirection(m),p++}}}return{setup:a,setupView:c,state:i}}function p_(n){let e=new s1(n),t=[],i=[],s=[];function r(h){u.camera=h,t.length=0,i.length=0,s.length=0}function o(h){h.isLightProbeGrid?s.push(h):t.push(h)}function a(h){i.push(h)}function c(){e.setup(t),s.sort((h,f)=>h.priority-f.priority||h.id-f.id)}function l(h){e.setupView(t,h)}let u={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:c,setupLightsView:l,pushLight:o,pushShadow:a}}function r1(n){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new p_(n),e.set(s,[a])):r>=o.length?(a=new p_(n),o.push(a)):a=o[r],a}function i(){e=new WeakMap}return{get:t,dispose:i}}var o1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,a1=`uniform sampler2D shadow_pass;
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
}`,c1=[new N(1,0,0),new N(-1,0,0),new N(0,1,0),new N(0,-1,0),new N(0,0,1),new N(0,0,-1)],l1=[new N(0,-1,0),new N(0,-1,0),new N(0,0,1),new N(0,0,-1),new N(0,-1,0),new N(0,-1,0)],m_=new Xe,cc=new N,Fd=new N;function u1(n,e,t){let i=new Ws,s=new Ee,r=new Ee,o=new _t,a=new tu,c=new nu,l={},u=t.maxTextureSize,h={[Xi]:Cn,[Cn]:Xi,[Sn]:Sn},f=new Ht({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ee},radius:{value:4}},vertexShader:o1,fragmentShader:a1}),d=f.clone();d.defines.HORIZONTAL_PASS=1;let g=new vt;g.setAttribute("position",new gt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new Ye(g,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Rr;let m=this.type;this.render=function(M,x,b){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||M.length===0)return;this.type===Uo&&(Be("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Rr);let R=n.getRenderTarget(),I=n.getActiveCubeFace(),A=n.getActiveMipmapLevel(),L=n.state;L.setBlending(Ss),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);let B=m!==this.type;B&&x.traverse(function(P){P.material&&(Array.isArray(P.material)?P.material.forEach(H=>H.needsUpdate=!0):P.material.needsUpdate=!0)});for(let P=0,H=M.length;P<H;P++){let K=M[P],$=K.shadow;if($===void 0){Be("WebGLShadowMap:",K,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;s.copy($.mapSize);let X=$.getFrameExtents();s.multiply(X),r.copy($.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/X.x),s.x=r.x*X.x,$.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/X.y),s.y=r.y*X.y,$.mapSize.y=r.y));let G=n.state.buffers.depth.getReversed();if($.camera._reversedDepth=G,$.map===null||B===!0){if($.map!==null&&($.map.depthTexture!==null&&($.map.depthTexture.dispose(),$.map.depthTexture=null),$.map.dispose()),this.type===Fo){if(K.isPointLight){Be("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}$.map=new Jt(s.x,s.y,{format:Ys,type:fn,minFilter:un,magFilter:un,generateMipmaps:!1}),$.map.texture.name=K.name+".shadowMap",$.map.depthTexture=new ps(s.x,s.y,ui),$.map.depthTexture.name=K.name+".shadowMapDepth",$.map.depthTexture.format=hs,$.map.depthTexture.compareFunction=null,$.map.depthTexture.minFilter=Zt,$.map.depthTexture.magFilter=Zt}else K.isPointLight?($.map=new uc(s.x),$.map.depthTexture=new Fa(s.x,Oi)):($.map=new Jt(s.x,s.y),$.map.depthTexture=new ps(s.x,s.y,Oi)),$.map.depthTexture.name=K.name+".shadowMap",$.map.depthTexture.format=hs,this.type===Rr?($.map.depthTexture.compareFunction=G?bd:Md,$.map.depthTexture.minFilter=un,$.map.depthTexture.magFilter=un):($.map.depthTexture.compareFunction=null,$.map.depthTexture.minFilter=Zt,$.map.depthTexture.magFilter=Zt);$.camera.updateProjectionMatrix()}$.map.isWebGLCubeRenderTarget!==!0&&($.map.width!==s.x||$.map.height!==s.y)&&$.map.setSize(s.x,s.y);let J=$.map.isWebGLCubeRenderTarget?6:$.getViewportCount();K.isPointLight!==!0&&$.updateMatrices(K,b);let se=($.camera.layers.mask&4294967294)!==0?$.camera.layers:b.layers;for(let ye=0;ye<J;ye++){let Le=$.getCamera(ye);if(K.isPointLight){let j=$.camera,D=$.matrix,O=K.distance||j.far;O!==j.far&&(j.far=O,j.updateProjectionMatrix()),cc.setFromMatrixPosition(K.matrixWorld),j.position.copy(cc),Fd.copy(j.position),Fd.add(c1[ye]),j.up.copy(l1[ye]),j.lookAt(Fd),j.updateMatrixWorld(),D.makeTranslation(-cc.x,-cc.y,-cc.z),m_.multiplyMatrices(j.projectionMatrix,j.matrixWorldInverse),$._frustum.setFromProjectionMatrix(m_,j.coordinateSystem,j.reversedDepth)}if($.map.isWebGLCubeRenderTarget)n.setRenderTarget($.map,ye),n.clear();else{ye===0&&(n.setRenderTarget($.map),n.clear());let j=$.getViewport(ye);o.set(r.x*j.x,r.y*j.y,r.x*j.z,r.y*j.w),L.viewport(o)}i=$.getFrustum(ye),S(x,b,Le,K,se,this.type)}$.isPointLightShadow!==!0&&this.type===Fo&&y($,b),$.needsUpdate=!1}m=this.type,p.needsUpdate=!1,n.setRenderTarget(R,I,A)};function y(M,x){let b=e.update(_);f.defines.VSM_SAMPLES!==M.blurSamples&&(f.defines.VSM_SAMPLES=M.blurSamples,d.defines.VSM_SAMPLES=M.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),M.mapPass===null?M.mapPass=new Jt(s.x,s.y,{format:Ys,type:fn}):(M.mapPass.width!==M.map.width||M.mapPass.height!==M.map.height)&&M.mapPass.setSize(M.map.width,M.map.height),f.uniforms.shadow_pass.value=M.map.depthTexture,f.uniforms.resolution.value.set(M.map.width,M.map.height),f.uniforms.radius.value=M.radius,n.setRenderTarget(M.mapPass),n.clear(),n.renderBufferDirect(x,null,b,f,_,null),d.uniforms.shadow_pass.value=M.mapPass.texture,d.uniforms.resolution.value.set(M.map.width,M.map.height),d.uniforms.radius.value=M.radius,n.setRenderTarget(M.map),n.clear(),n.renderBufferDirect(x,null,b,d,_,null)}function v(M,x,b,R){let I=null,A=b.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(A!==void 0)I=A;else if(I=b.isPointLight===!0?c:a,n.localClippingEnabled&&x.clipShadows===!0&&Array.isArray(x.clippingPlanes)&&x.clippingPlanes.length!==0||x.displacementMap&&x.displacementScale!==0||x.alphaMap&&x.alphaTest>0||x.map&&x.alphaTest>0||x.alphaToCoverage===!0){let L=I.uuid,B=x.uuid,P=l[L];P===void 0&&(P={},l[L]=P);let H=P[B];H===void 0&&(H=I.clone(),P[B]=H,x.addEventListener("dispose",E)),I=H}if(I.visible=x.visible,I.wireframe=x.wireframe,R===Fo?I.side=x.shadowSide!==null?x.shadowSide:x.side:I.side=x.shadowSide!==null?x.shadowSide:h[x.side],I.alphaMap=x.alphaMap,I.alphaTest=x.alphaToCoverage===!0?.5:x.alphaTest,I.map=x.map,I.clipShadows=x.clipShadows,I.clippingPlanes=x.clippingPlanes,I.clipIntersection=x.clipIntersection,I.displacementMap=x.displacementMap,I.displacementScale=x.displacementScale,I.displacementBias=x.displacementBias,I.wireframeLinewidth=x.wireframeLinewidth,I.linewidth=x.linewidth,b.isPointLight===!0&&I.isMeshDistanceMaterial===!0){let L=n.properties.get(I);L.light=b}return I}function S(M,x,b,R,I,A){if(M.visible===!1)return;if(M.layers.test(I)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&A===Fo)&&(!M.frustumCulled||M.intersectsFrustum(i))){M.modelViewMatrix.multiplyMatrices(b.matrixWorldInverse,M.matrixWorld);let P=e.update(M),H=M.material;if(Array.isArray(H)){let K=P.groups;for(let $=0,X=K.length;$<X;$++){let G=K[$],J=H[G.materialIndex];if(J&&J.visible){let se=v(M,J,R,A);M.onBeforeShadow(n,M,x,b,P,se,G),n.renderBufferDirect(b,null,P,se,M,G),M.onAfterShadow(n,M,x,b,P,se,G)}}}else if(H.visible){let K=v(M,H,R,A);M.onBeforeShadow(n,M,x,b,P,K,null),n.renderBufferDirect(b,null,P,K,M,null),M.onAfterShadow(n,M,x,b,P,K,null)}}let B=M.children;for(let P=0,H=B.length;P<H;P++)S(B[P],x,b,R,I,A)}function E(M){M.target.removeEventListener("dispose",E);for(let b in l){let R=l[b],I=M.target.uuid;I in R&&(R[I].dispose(),delete R[I])}}}function h1(n,e){function t(){let U=!1,ie=new _t,Q=null,ge=new _t(0,0,0,0);return{setMask:function(fe){Q!==fe&&!U&&(n.colorMask(fe,fe,fe,fe),Q=fe)},setLocked:function(fe){U=fe},setClear:function(fe,pe,ke,et,he){he===!0&&(fe*=et,pe*=et,ke*=et),ie.set(fe,pe,ke,et),ge.equals(ie)===!1&&(n.clearColor(fe,pe,ke,et),ge.copy(ie))},reset:function(){U=!1,Q=null,ge.set(-1,0,0,0)}}}function i(){let U=!1,ie=!1,Q=null,ge=null,fe=null;return{setReversed:function(pe){if(ie!==pe){let ke=e.get("EXT_clip_control");pe?ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.ZERO_TO_ONE_EXT):ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.NEGATIVE_ONE_TO_ONE_EXT),ie=pe;let et=fe;fe=null,this.setClear(et)}},getReversed:function(){return ie},setTest:function(pe){pe?k(n.DEPTH_TEST):ee(n.DEPTH_TEST)},setMask:function(pe){Q!==pe&&!U&&(n.depthMask(pe),Q=pe)},setFunc:function(pe){if(ie&&(pe=Xg[pe]),ge!==pe){switch(pe){case Ol:n.depthFunc(n.NEVER);break;case Ul:n.depthFunc(n.ALWAYS);break;case Fl:n.depthFunc(n.LESS);break;case yo:n.depthFunc(n.LEQUAL);break;case Bl:n.depthFunc(n.EQUAL);break;case kl:n.depthFunc(n.GEQUAL);break;case zl:n.depthFunc(n.GREATER);break;case Hl:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ge=pe}},setLocked:function(pe){U=pe},setClear:function(pe){fe!==pe&&(fe=pe,ie&&(pe=1-pe),n.clearDepth(pe))},reset:function(){U=!1,Q=null,ge=null,fe=null,ie=!1}}}function s(){let U=!1,ie=null,Q=null,ge=null,fe=null,pe=null,ke=null,et=null,he=null;return{setTest:function(ze){U||(ze?k(n.STENCIL_TEST):ee(n.STENCIL_TEST))},setMask:function(ze){ie!==ze&&!U&&(n.stencilMask(ze),ie=ze)},setFunc:function(ze,Qe,Te){(Q!==ze||ge!==Qe||fe!==Te)&&(n.stencilFunc(ze,Qe,Te),Q=ze,ge=Qe,fe=Te)},setOp:function(ze,Qe,Te){(pe!==ze||ke!==Qe||et!==Te)&&(n.stencilOp(ze,Qe,Te),pe=ze,ke=Qe,et=Te)},setLocked:function(ze){U=ze},setClear:function(ze){he!==ze&&(n.clearStencil(ze),he=ze)},reset:function(){U=!1,ie=null,Q=null,ge=null,fe=null,pe=null,ke=null,et=null,he=null}}}let r=new t,o=new i,a=new s,c={},l=new WeakMap,u={},h={},f={},d=new WeakMap,g=[],_=null,p=!1,m=null,y=null,v=null,S=null,E=null,M=null,x=null,b=new ae(0,0,0),R=0,I=!1,A=null,L=null,B=null,P=null,H=null,K=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),$=!1,X=0,G=n.getParameter(n.VERSION);G.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(G)[1]),$=X>=1):G.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),$=X>=2);let J=null,se={},ye=n.getParameter(n.SCISSOR_BOX),Le=n.getParameter(n.VIEWPORT),j=new _t().fromArray(ye),D=new _t().fromArray(Le);function O(U,ie,Q,ge){let fe=new Uint8Array(4),pe=n.createTexture();n.bindTexture(U,pe),n.texParameteri(U,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(U,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let ke=0;ke<Q;ke++)U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY?n.texImage3D(ie,0,n.RGBA,1,1,ge,0,n.RGBA,n.UNSIGNED_BYTE,fe):n.texImage2D(ie+ke,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,fe);return pe}let W={};W[n.TEXTURE_2D]=O(n.TEXTURE_2D,n.TEXTURE_2D,1),W[n.TEXTURE_CUBE_MAP]=O(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),W[n.TEXTURE_2D_ARRAY]=O(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),W[n.TEXTURE_3D]=O(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),k(n.DEPTH_TEST),o.setFunc(yo),Pt(!1),ut(cd),k(n.CULL_FACE),$e(Ss);function k(U){u[U]!==!0&&(n.enable(U),u[U]=!0)}function ee(U){u[U]!==!1&&(n.disable(U),u[U]=!1)}function le(U,ie){return f[U]!==ie?(n.bindFramebuffer(U,ie),f[U]=ie,U===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=ie),U===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=ie),!0):!1}function oe(U,ie){let Q=g,ge=!1;if(U){Q=d.get(ie),Q===void 0&&(Q=[],d.set(ie,Q));let fe=U.textures;if(Q.length!==fe.length||Q[0]!==n.COLOR_ATTACHMENT0){for(let pe=0,ke=fe.length;pe<ke;pe++)Q[pe]=n.COLOR_ATTACHMENT0+pe;Q.length=fe.length,ge=!0}}else Q[0]!==n.BACK&&(Q[0]=n.BACK,ge=!0);ge&&n.drawBuffers(Q)}function Ie(U){return _!==U?(n.useProgram(U),_=U,!0):!1}let Ce={[Cr]:n.FUNC_ADD,[dg]:n.FUNC_SUBTRACT,[pg]:n.FUNC_REVERSE_SUBTRACT};Ce[mg]=n.MIN,Ce[gg]=n.MAX;let Ae={[_g]:n.ZERO,[xg]:n.ONE,[yg]:n.SRC_COLOR,[hd]:n.SRC_ALPHA,[Eg]:n.SRC_ALPHA_SATURATE,[bg]:n.DST_COLOR,[Sg]:n.DST_ALPHA,[vg]:n.ONE_MINUS_SRC_COLOR,[fd]:n.ONE_MINUS_SRC_ALPHA,[Tg]:n.ONE_MINUS_DST_COLOR,[Mg]:n.ONE_MINUS_DST_ALPHA,[wg]:n.CONSTANT_COLOR,[Ag]:n.ONE_MINUS_CONSTANT_COLOR,[Rg]:n.CONSTANT_ALPHA,[Cg]:n.ONE_MINUS_CONSTANT_ALPHA};function $e(U,ie,Q,ge,fe,pe,ke,et,he,ze){if(U===Ss){p===!0&&(ee(n.BLEND),p=!1);return}if(p===!1&&(k(n.BLEND),p=!0),U!==fg){if(U!==m||ze!==I){if((y!==Cr||E!==Cr)&&(n.blendEquation(n.FUNC_ADD),y=Cr,E=Cr),ze)switch(U){case Bo:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ms:n.blendFunc(n.ONE,n.ONE);break;case ld:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ud:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Ve("WebGLState: Invalid blending: ",U);break}else switch(U){case Bo:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ms:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case ld:Ve("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ud:Ve("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ve("WebGLState: Invalid blending: ",U);break}v=null,S=null,M=null,x=null,b.set(0,0,0),R=0,m=U,I=ze}return}fe=fe||ie,pe=pe||Q,ke=ke||ge,(ie!==y||fe!==E)&&(n.blendEquationSeparate(Ce[ie],Ce[fe]),y=ie,E=fe),(Q!==v||ge!==S||pe!==M||ke!==x)&&(n.blendFuncSeparate(Ae[Q],Ae[ge],Ae[pe],Ae[ke]),v=Q,S=ge,M=pe,x=ke),(et.equals(b)===!1||he!==R)&&(n.blendColor(et.r,et.g,et.b,he),b.copy(et),R=he),m=U,I=!1}function ht(U,ie){U.side===Sn?ee(n.CULL_FACE):k(n.CULL_FACE);let Q=U.side===Cn;ie&&(Q=!Q),Pt(Q),U.blending===Bo&&U.transparent===!1?$e(Ss):$e(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),r.setMask(U.colorWrite);let ge=U.stencilWrite;a.setTest(ge),ge&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),At(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?k(n.SAMPLE_ALPHA_TO_COVERAGE):ee(n.SAMPLE_ALPHA_TO_COVERAGE)}function Pt(U){A!==U&&(U?n.frontFace(n.CW):n.frontFace(n.CCW),A=U)}function ut(U){U!==ug?(k(n.CULL_FACE),U!==L&&(U===cd?n.cullFace(n.BACK):U===hg?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ee(n.CULL_FACE),L=U}function In(U){U!==B&&($&&n.lineWidth(U),B=U)}function At(U,ie,Q){U?(k(n.POLYGON_OFFSET_FILL),(P!==ie||H!==Q)&&(P=ie,H=Q,o.getReversed()&&(ie=-ie,Q=-Q),n.polygonOffset(ie,Q))):ee(n.POLYGON_OFFSET_FILL)}function cn(U){U?k(n.SCISSOR_TEST):ee(n.SCISSOR_TEST)}function Ln(U){U===void 0&&(U=n.TEXTURE0+K-1),J!==U&&(n.activeTexture(U),J=U)}function Dn(U,ie,Q){Q===void 0&&(J===null?Q=n.TEXTURE0+K-1:Q=J);let ge=se[Q];ge===void 0&&(ge={type:void 0,texture:void 0},se[Q]=ge),(ge.type!==U||ge.texture!==ie)&&(J!==Q&&(n.activeTexture(Q),J=Q),n.bindTexture(U,ie||W[U]),ge.type=U,ge.texture=ie)}function z(){let U=se[J];U!==void 0&&U.type!==void 0&&(n.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function di(){try{n.compressedTexImage2D(...arguments)}catch(U){Ve("WebGLState:",U)}}function kt(){try{n.compressedTexImage3D(...arguments)}catch(U){Ve("WebGLState:",U)}}function zt(){try{n.texSubImage2D(...arguments)}catch(U){Ve("WebGLState:",U)}}function Me(){try{n.texSubImage3D(...arguments)}catch(U){Ve("WebGLState:",U)}}function ln(){try{n.compressedTexSubImage2D(...arguments)}catch(U){Ve("WebGLState:",U)}}function He(){try{n.compressedTexSubImage3D(...arguments)}catch(U){Ve("WebGLState:",U)}}function Ke(){try{n.texStorage2D(...arguments)}catch(U){Ve("WebGLState:",U)}}function C(){try{n.texStorage3D(...arguments)}catch(U){Ve("WebGLState:",U)}}function T(){try{n.texImage2D(...arguments)}catch(U){Ve("WebGLState:",U)}}function q(){try{n.texImage3D(...arguments)}catch(U){Ve("WebGLState:",U)}}function ue(U){return h[U]!==void 0?h[U]:n.getParameter(U)}function re(U,ie){h[U]!==ie&&(n.pixelStorei(U,ie),h[U]=ie)}function de(U){j.equals(U)===!1&&(n.scissor(U.x,U.y,U.z,U.w),j.copy(U))}function ve(U){D.equals(U)===!1&&(n.viewport(U.x,U.y,U.z,U.w),D.copy(U))}function te(U,ie){let Q=l.get(ie);Q===void 0&&(Q=new WeakMap,l.set(ie,Q));let ge=Q.get(U);ge===void 0&&(ge=n.getUniformBlockIndex(ie,U.name),n.uniformBlockBinding(ie,ge,ge),Q.set(U,ge))}function ne(U,ie,Q){let fe=l.get(ie).get(U);c[fe]!==Q&&(n.bindBufferBase(n.UNIFORM_BUFFER,fe,Q),c[fe]=Q)}function me(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),u={},h={},J=null,se={},f={},c={},d=new WeakMap,g=[],_=null,p=!1,m=null,y=null,v=null,S=null,E=null,M=null,x=null,b=new ae(0,0,0),R=0,I=!1,A=null,L=null,B=null,P=null,H=null,j.set(0,0,n.canvas.width,n.canvas.height),D.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:k,disable:ee,bindFramebuffer:le,drawBuffers:oe,useProgram:Ie,setBlending:$e,setMaterial:ht,setFlipSided:Pt,setCullFace:ut,setLineWidth:In,setPolygonOffset:At,setScissorTest:cn,activeTexture:Ln,bindTexture:Dn,unbindTexture:z,compressedTexImage2D:di,compressedTexImage3D:kt,texImage2D:T,texImage3D:q,pixelStorei:re,getParameter:ue,updateUBOMapping:te,uniformBlockBinding:ne,texStorage2D:Ke,texStorage3D:C,texSubImage2D:zt,texSubImage3D:Me,compressedTexSubImage2D:ln,compressedTexSubImage3D:He,scissor:de,viewport:ve,reset:me}}function f1(n,e,t,i,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Ee,u=new WeakMap,h=new Set,f,d=new WeakMap,g=new Set,_=new FinalizationRegistry(C=>g.delete(C)),p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(C,T){return p?new OffscreenCanvas(C,T):Mo("canvas")}function y(C,T,q){let ue=1,re=Ke(C);if((re.width>q||re.height>q)&&(ue=q/Math.max(re.width,re.height)),ue<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let de=Math.floor(ue*re.width),ve=Math.floor(ue*re.height);f===void 0&&(f=m(de,ve));let te=T?m(de,ve):f;return te.width=de,te.height=ve,te.getContext("2d").drawImage(C,0,0,de,ve),Be("WebGLRenderer: Texture has been resized from ("+re.width+"x"+re.height+") to ("+de+"x"+ve+")."),te}else return"data"in C&&Be("WebGLRenderer: Image in DataTexture is too big ("+re.width+"x"+re.height+")."),C;return C}function v(C){return C.generateMipmaps}function S(C){n.generateMipmap(C)}function E(C){return C.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?n.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function M(C,T,q,ue,re,de=!1){if(C!==null){if(n[C]!==void 0)return n[C];Be("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let ve;ue&&(ve=e.get("EXT_texture_norm16"),ve||Be("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let te=T;if(T===n.RED&&(q===n.FLOAT&&(te=n.R32F),q===n.HALF_FLOAT&&(te=n.R16F),q===n.UNSIGNED_BYTE&&(te=n.R8),q===n.UNSIGNED_SHORT&&ve&&(te=ve.R16_EXT),q===n.SHORT&&ve&&(te=ve.R16_SNORM_EXT)),T===n.RED_INTEGER&&(q===n.UNSIGNED_BYTE&&(te=n.R8UI),q===n.UNSIGNED_SHORT&&(te=n.R16UI),q===n.UNSIGNED_INT&&(te=n.R32UI),q===n.BYTE&&(te=n.R8I),q===n.SHORT&&(te=n.R16I),q===n.INT&&(te=n.R32I)),T===n.RG&&(q===n.FLOAT&&(te=n.RG32F),q===n.HALF_FLOAT&&(te=n.RG16F),q===n.UNSIGNED_BYTE&&(te=n.RG8),q===n.UNSIGNED_SHORT&&ve&&(te=ve.RG16_EXT),q===n.SHORT&&ve&&(te=ve.RG16_SNORM_EXT)),T===n.RG_INTEGER&&(q===n.UNSIGNED_BYTE&&(te=n.RG8UI),q===n.UNSIGNED_SHORT&&(te=n.RG16UI),q===n.UNSIGNED_INT&&(te=n.RG32UI),q===n.BYTE&&(te=n.RG8I),q===n.SHORT&&(te=n.RG16I),q===n.INT&&(te=n.RG32I)),T===n.RGB_INTEGER&&(q===n.UNSIGNED_BYTE&&(te=n.RGB8UI),q===n.UNSIGNED_SHORT&&(te=n.RGB16UI),q===n.UNSIGNED_INT&&(te=n.RGB32UI),q===n.BYTE&&(te=n.RGB8I),q===n.SHORT&&(te=n.RGB16I),q===n.INT&&(te=n.RGB32I)),T===n.RGBA_INTEGER&&(q===n.UNSIGNED_BYTE&&(te=n.RGBA8UI),q===n.UNSIGNED_SHORT&&(te=n.RGBA16UI),q===n.UNSIGNED_INT&&(te=n.RGBA32UI),q===n.BYTE&&(te=n.RGBA8I),q===n.SHORT&&(te=n.RGBA16I),q===n.INT&&(te=n.RGBA32I)),T===n.RGB&&(q===n.UNSIGNED_SHORT&&ve&&(te=ve.RGB16_EXT),q===n.SHORT&&ve&&(te=ve.RGB16_SNORM_EXT),q===n.UNSIGNED_INT_5_9_9_9_REV&&(te=n.RGB9_E5),q===n.UNSIGNED_INT_10F_11F_11F_REV&&(te=n.R11F_G11F_B10F)),T===n.RGBA){let ne=de?Ea:Je.getTransfer(re);q===n.FLOAT&&(te=n.RGBA32F),q===n.HALF_FLOAT&&(te=n.RGBA16F),q===n.UNSIGNED_BYTE&&(te=ne===St?n.SRGB8_ALPHA8:n.RGBA8),q===n.UNSIGNED_SHORT&&ve&&(te=ve.RGBA16_EXT),q===n.SHORT&&ve&&(te=ve.RGBA16_SNORM_EXT),q===n.UNSIGNED_SHORT_4_4_4_4&&(te=n.RGBA4),q===n.UNSIGNED_SHORT_5_5_5_1&&(te=n.RGB5_A1)}return(te===n.R16F||te===n.R32F||te===n.RG16F||te===n.RG32F||te===n.RGBA16F||te===n.RGBA32F)&&e.get("EXT_color_buffer_float"),te}function x(C,T){let q;return C?T===null||T===Oi||T===Dr?q=n.DEPTH24_STENCIL8:T===ui?q=n.DEPTH32F_STENCIL8:T===Ho&&(q=n.DEPTH24_STENCIL8,Be("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===Oi||T===Dr?q=n.DEPTH_COMPONENT24:T===ui?q=n.DEPTH_COMPONENT32F:T===Ho&&(q=n.DEPTH_COMPONENT16),q}function b(C,T){return v(C)===!0||C.isFramebufferTexture&&C.minFilter!==Zt&&C.minFilter!==un?Math.log2(Math.max(T.width,T.height))+1:C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?T.mipmaps.length:1}function R(C){let T=new WeakRef(C);i.get(C).__ref=T,g.add(T),_.register(C,T,T)}function I(C){let T=i.get(C).__ref;T!==void 0&&(g.delete(T),_.unregister(T))}function A(C){B(C.target)}function L(C){P(C.target)}function B(C){C.removeEventListener("dispose",A),I(C),K(C),C.isVideoTexture&&u.delete(C),C.isHTMLTexture&&h.delete(C)}function P(C){C.removeEventListener("dispose",L),I(C),X(C)}function H(){for(let C of g){let T=C.deref();T!==void 0&&(T.isRenderTarget===!0?P(T):B(T))}g.clear(),h.clear()}function K(C){let T=i.get(C);if(T.__webglInit===void 0)return;let q=C.source,ue=d.get(q);if(ue){let re=ue[T.__cacheKey];re.usedTimes--,re.usedTimes===0&&$(C),Object.keys(ue).length===0&&d.delete(q)}i.remove(C)}function $(C){let T=i.get(C);n.deleteTexture(T.__webglTexture);let q=C.source,ue=d.get(q);delete ue[T.__cacheKey],o.memory.textures--}function X(C){let T=i.get(C);T.__depthDisposeCallback&&T.__depthDisposeCallback();let q=C.depthTexture;if(q&&q.renderTarget===C&&B(q),C.isWebGLCubeRenderTarget)for(let re=0;re<6;re++){if(Array.isArray(T.__webglFramebuffer[re]))for(let de=0;de<T.__webglFramebuffer[re].length;de++)n.deleteFramebuffer(T.__webglFramebuffer[re][de]);else n.deleteFramebuffer(T.__webglFramebuffer[re]);T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer[re])}else{if(Array.isArray(T.__webglFramebuffer))for(let re=0;re<T.__webglFramebuffer.length;re++)n.deleteFramebuffer(T.__webglFramebuffer[re]);else n.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&n.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let re=0;re<T.__webglColorRenderbuffer.length;re++)T.__webglColorRenderbuffer[re]&&n.deleteRenderbuffer(T.__webglColorRenderbuffer[re]);T.__webglDepthRenderbuffer&&n.deleteRenderbuffer(T.__webglDepthRenderbuffer)}let ue=C.textures;for(let re=0,de=ue.length;re<de;re++){let ve=i.get(ue[re]);ve.__webglTexture&&(n.deleteTexture(ve.__webglTexture),o.memory.textures--),i.remove(ue[re])}i.remove(C)}let G=0;function J(){G=0}function se(){return G}function ye(C){G=C}function Le(){let C=G;return C>=s.maxTextures&&Be("WebGLTextures: Trying to use "+(C+1)+" texture units while this GPU supports only "+s.maxTextures),G+=1,C}function j(C){let T=[];return T.push(C.wrapS),T.push(C.wrapT),T.push(C.wrapR||0),T.push(C.magFilter),T.push(C.minFilter),T.push(C.anisotropy),T.push(C.internalFormat),T.push(C.format),T.push(C.type),T.push(C.generateMipmaps),T.push(C.mipmapsAutoUpdate),T.push(C.premultiplyAlpha),T.push(C.flipY),T.push(C.unpackAlignment),T.push(C.colorSpace),T.join()}function D(C,T){let q=i.get(C);if(C.isVideoTexture&&ln(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&q.__version!==C.version){let ue=C.image;if(ue===null)Be("WebGLRenderer: Texture marked for update but no image data found.");else if(ue.complete===!1)Be("WebGLRenderer: Texture marked for update but image is incomplete");else{ht(q,C,T);return}}else C.isExternalTexture&&(q.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,q.__webglTexture,n.TEXTURE0+T)}function O(C,T){let q=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&q.__version!==C.version){ht(q,C,T);return}else C.isExternalTexture&&(q.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,q.__webglTexture,n.TEXTURE0+T)}function W(C,T){let q=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&q.__version!==C.version){ht(q,C,T);return}t.bindTexture(n.TEXTURE_3D,q.__webglTexture,n.TEXTURE0+T)}function k(C,T){let q=i.get(C);if(C.version>0&&q.__version!==C.version){Pt(q,C,T);return}t.bindTexture(n.TEXTURE_CUBE_MAP,q.__webglTexture,n.TEXTURE0+T)}let ee={[gi]:n.REPEAT,[jn]:n.CLAMP_TO_EDGE,[vo]:n.MIRRORED_REPEAT},le={[Zt]:n.NEAREST,[du]:n.NEAREST_MIPMAP_NEAREST,[Lr]:n.NEAREST_MIPMAP_LINEAR,[un]:n.LINEAR,[zo]:n.LINEAR_MIPMAP_NEAREST,[yi]:n.LINEAR_MIPMAP_LINEAR},oe={[Fg]:n.NEVER,[Td]:n.ALWAYS,[Bg]:n.LESS,[Md]:n.LEQUAL,[kg]:n.EQUAL,[bd]:n.GEQUAL,[zg]:n.GREATER,[Hg]:n.NOTEQUAL};function Ie(C,T){if(T.type===ui&&e.has("OES_texture_float_linear")===!1&&(T.magFilter===un||T.magFilter===zo||T.magFilter===Lr||T.magFilter===yi||T.minFilter===un||T.minFilter===zo||T.minFilter===Lr||T.minFilter===yi)&&Be("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(C,n.TEXTURE_WRAP_S,ee[T.wrapS]),n.texParameteri(C,n.TEXTURE_WRAP_T,ee[T.wrapT]),(C===n.TEXTURE_3D||C===n.TEXTURE_2D_ARRAY)&&n.texParameteri(C,n.TEXTURE_WRAP_R,ee[T.wrapR]),n.texParameteri(C,n.TEXTURE_MAG_FILTER,le[T.magFilter]),n.texParameteri(C,n.TEXTURE_MIN_FILTER,le[T.minFilter]),T.compareFunction&&(n.texParameteri(C,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(C,n.TEXTURE_COMPARE_FUNC,oe[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===Zt||T.minFilter!==Lr&&T.minFilter!==yi||T.type===ui&&e.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||i.get(T).__currentAnisotropy){let q=e.get("EXT_texture_filter_anisotropic");n.texParameterf(C,q.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,s.getMaxAnisotropy())),i.get(T).__currentAnisotropy=T.anisotropy}}}function Ce(C,T){let q=!1;C.__webglInit===void 0&&(C.__webglInit=!0,T.addEventListener("dispose",A),R(T));let ue=T.source,re=d.get(ue);re===void 0&&(re={},d.set(ue,re));let de=j(T);if(de!==C.__cacheKey){re[de]===void 0&&(re[de]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,q=!0),re[de].usedTimes++;let ve=re[C.__cacheKey];ve!==void 0&&(re[C.__cacheKey].usedTimes--,ve.usedTimes===0&&$(T)),C.__cacheKey=de,C.__webglTexture=re[de].texture}return q}function Ae(C,T,q){return Math.floor(Math.floor(C/q)/T)}function $e(C,T,q,ue){let de=C.updateRanges;if(de.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,T.width,T.height,q,ue,T.data);else{de.sort((U,ie)=>U.start-ie.start);let ve=0;for(let U=1;U<de.length;U++){let ie=de[ve],Q=de[U],ge=ie.start+ie.count,fe=Ae(Q.start,T.width,4),pe=Ae(ie.start,T.width,4);Q.start<=ge+1&&fe===pe&&Ae(Q.start+Q.count-1,T.width,4)===fe?ie.count=Math.max(ie.count,Q.start+Q.count-ie.start):(++ve,de[ve]=Q)}de.length=ve+1;let te=t.getParameter(n.UNPACK_ROW_LENGTH),ne=t.getParameter(n.UNPACK_SKIP_PIXELS),me=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,T.width);for(let U=0,ie=de.length;U<ie;U++){let Q=de[U],ge=Math.floor(Q.start/4),fe=Math.ceil(Q.count/4),pe=ge%T.width,ke=Math.floor(ge/T.width),et=fe,he=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,pe),t.pixelStorei(n.UNPACK_SKIP_ROWS,ke),t.texSubImage2D(n.TEXTURE_2D,0,pe,ke,et,he,q,ue,T.data)}C.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,te),t.pixelStorei(n.UNPACK_SKIP_PIXELS,ne),t.pixelStorei(n.UNPACK_SKIP_ROWS,me)}}function ht(C,T,q){let ue=n.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(ue=n.TEXTURE_2D_ARRAY),T.isData3DTexture&&(ue=n.TEXTURE_3D);let re=Ce(C,T),de=T.source;t.bindTexture(ue,C.__webglTexture,n.TEXTURE0+q);let ve=i.get(de);if(de.version!==ve.__version||re===!0){if(t.activeTexture(n.TEXTURE0+q),(typeof ImageBitmap<"u"&&T.image instanceof ImageBitmap)===!1){let he=Je.getPrimaries(Je.workingColorSpace),ze=T.colorSpace===Ui?null:Je.getPrimaries(T.colorSpace),Qe=T.colorSpace===Ui||he===ze?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Qe)}t.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment);let ne=y(T.image,!1,s.maxTextureSize);ne=He(T,ne);let me=r.convert(T.format,T.colorSpace),U=r.convert(T.type),ie=M(T.internalFormat,me,U,T.normalized,T.colorSpace,T.isVideoTexture);Ie(ue,T);let Q,ge=T.mipmaps,fe=T.isVideoTexture!==!0,pe=ve.__version===void 0||re===!0,ke=de.dataReady,et=b(T,ne);if(T.isDepthTexture)ie=x(T.format===bs,T.type),pe&&(fe?t.texStorage2D(n.TEXTURE_2D,1,ie,ne.width,ne.height):t.texImage2D(n.TEXTURE_2D,0,ie,ne.width,ne.height,0,me,U,null));else if(T.isDataTexture)if(ge.length>0){fe&&pe&&t.texStorage2D(n.TEXTURE_2D,et,ie,ge[0].width,ge[0].height);for(let he=0,ze=ge.length;he<ze;he++)Q=ge[he],fe?ke&&t.texSubImage2D(n.TEXTURE_2D,he,0,0,Q.width,Q.height,me,U,Q.data):t.texImage2D(n.TEXTURE_2D,he,ie,Q.width,Q.height,0,me,U,Q.data);T.generateMipmaps=!1}else fe?(pe&&t.texStorage2D(n.TEXTURE_2D,et,ie,ne.width,ne.height),ke&&$e(T,ne,me,U)):t.texImage2D(n.TEXTURE_2D,0,ie,ne.width,ne.height,0,me,U,ne.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){fe&&pe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,et,ie,ge[0].width,ge[0].height,ne.depth);for(let he=0,ze=ge.length;he<ze;he++)if(Q=ge[he],T.format!==vi)if(me!==null)if(fe){if(ke)if(T.layerUpdates.size>0){let Qe=Od(Q.width,Q.height,T.format,T.type);for(let Te of T.layerUpdates){let Ct=Q.data.subarray(Te*Qe/Q.data.BYTES_PER_ELEMENT,(Te+1)*Qe/Q.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,he,0,0,Te,Q.width,Q.height,1,me,Ct)}}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,he,0,0,0,Q.width,Q.height,ne.depth,me,Q.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,he,ie,Q.width,Q.height,ne.depth,0,Q.data,0,0);else Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else fe?ke&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,he,0,0,0,Q.width,Q.height,ne.depth,me,U,Q.data):t.texImage3D(n.TEXTURE_2D_ARRAY,he,ie,Q.width,Q.height,ne.depth,0,me,U,Q.data);T.layerUpdates.size>0&&T.clearLayerUpdates()}else{fe&&pe&&t.texStorage2D(n.TEXTURE_2D,et,ie,ge[0].width,ge[0].height);for(let he=0,ze=ge.length;he<ze;he++)Q=ge[he],T.format!==vi?me!==null?fe?ke&&t.compressedTexSubImage2D(n.TEXTURE_2D,he,0,0,Q.width,Q.height,me,Q.data):t.compressedTexImage2D(n.TEXTURE_2D,he,ie,Q.width,Q.height,0,Q.data):Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):fe?ke&&t.texSubImage2D(n.TEXTURE_2D,he,0,0,Q.width,Q.height,me,U,Q.data):t.texImage2D(n.TEXTURE_2D,he,ie,Q.width,Q.height,0,me,U,Q.data)}else if(T.isDataArrayTexture)if(fe){if(pe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,et,ie,ne.width,ne.height,ne.depth),ke)if(T.layerUpdates.size>0){let he=Od(ne.width,ne.height,T.format,T.type);for(let ze of T.layerUpdates){let Qe=ne.data.subarray(ze*he/ne.data.BYTES_PER_ELEMENT,(ze+1)*he/ne.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ze,ne.width,ne.height,1,me,U,Qe)}T.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,me,U,ne.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,ie,ne.width,ne.height,ne.depth,0,me,U,ne.data);else if(T.isData3DTexture)fe?(pe&&t.texStorage3D(n.TEXTURE_3D,et,ie,ne.width,ne.height,ne.depth),ke&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,me,U,ne.data)):t.texImage3D(n.TEXTURE_3D,0,ie,ne.width,ne.height,ne.depth,0,me,U,ne.data);else if(T.isFramebufferTexture){if(pe)if(fe)t.texStorage2D(n.TEXTURE_2D,et,ie,ne.width,ne.height);else{let he=ne.width,ze=ne.height;for(let Qe=0;Qe<et;Qe++)t.texImage2D(n.TEXTURE_2D,Qe,ie,he,ze,0,me,U,null),he>>=1,ze>>=1}}else if(T.isHTMLTexture){if("texElementImage2D"in n){let he=n.canvas;if(he.hasAttribute("layoutsubtree")||he.setAttribute("layoutsubtree","true"),ne.parentNode!==he){he.appendChild(ne),h.add(T),he.onpaint=ze=>{let Qe=ze.changedElements;for(let Te of h)Qe.includes(Te.image)&&(Te.needsUpdate=!0)},he.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,ne);else{let Qe=n.RGBA,Te=n.RGBA,Ct=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,Qe,Te,Ct,ne)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(ge.length>0){if(fe&&pe){let he=Ke(ge[0]);t.texStorage2D(n.TEXTURE_2D,et,ie,he.width,he.height)}for(let he=0,ze=ge.length;he<ze;he++)Q=ge[he],fe?ke&&t.texSubImage2D(n.TEXTURE_2D,he,0,0,me,U,Q):t.texImage2D(n.TEXTURE_2D,he,ie,me,U,Q);T.generateMipmaps=!1}else if(fe){if(pe){let he=Ke(ne);t.texStorage2D(n.TEXTURE_2D,et,ie,he.width,he.height)}ke&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,me,U,ne)}else t.texImage2D(n.TEXTURE_2D,0,ie,me,U,ne);v(T)&&T.mipmapsAutoUpdate===!0&&S(ue),ve.__version=de.version,T.onUpdate&&T.onUpdate(T)}C.__version=T.version}function Pt(C,T,q){if(T.image.length!==6)return;let ue=Ce(C,T),re=T.source;t.bindTexture(n.TEXTURE_CUBE_MAP,C.__webglTexture,n.TEXTURE0+q);let de=i.get(re);if(re.version!==de.__version||ue===!0){t.activeTexture(n.TEXTURE0+q);let ve=Je.getPrimaries(Je.workingColorSpace),te=T.colorSpace===Ui?null:Je.getPrimaries(T.colorSpace),ne=T.colorSpace===Ui||ve===te?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ne);let me=T.isCompressedTexture||T.image[0].isCompressedTexture,U=T.image[0]&&T.image[0].isDataTexture,ie=[];for(let Te=0;Te<6;Te++)!me&&!U?ie[Te]=y(T.image[Te],!0,s.maxCubemapSize):ie[Te]=U?T.image[Te].image:T.image[Te],ie[Te]=He(T,ie[Te]);let Q=ie[0],ge=r.convert(T.format,T.colorSpace),fe=r.convert(T.type),pe=M(T.internalFormat,ge,fe,T.normalized,T.colorSpace),ke=T.isVideoTexture!==!0,et=de.__version===void 0||ue===!0,he=re.dataReady,ze=b(T,Q);Ie(n.TEXTURE_CUBE_MAP,T);let Qe;if(T.isDepthTexture){if(pe=x(T.format===bs,T.type),et)if(ke)t.texStorage2D(n.TEXTURE_CUBE_MAP,1,pe,Q.width,Q.height);else for(let Te=0;Te<6;Te++)t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,pe,Q.width,Q.height,0,ge,fe,null)}else if(me){ke&&et&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ze,pe,Q.width,Q.height);for(let Te=0;Te<6;Te++){Qe=ie[Te].mipmaps;for(let Ct=0;Ct<Qe.length;Ct++){let gn=Qe[Ct];T.format!==vi?ge!==null?ke?he&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,Ct,0,0,gn.width,gn.height,ge,gn.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,Ct,pe,gn.width,gn.height,0,gn.data):Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ke?he&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,Ct,0,0,gn.width,gn.height,ge,fe,gn.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,Ct,pe,gn.width,gn.height,0,ge,fe,gn.data)}}}else{if(Qe=T.mipmaps,ke&&et){Qe.length>0&&ze++;let Te=Ke(ie[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ze,pe,Te.width,Te.height)}for(let Te=0;Te<6;Te++)if(U){ke?he&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,0,0,ie[Te].width,ie[Te].height,ge,fe,ie[Te].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,pe,ie[Te].width,ie[Te].height,0,ge,fe,ie[Te].data);for(let Ct=0;Ct<Qe.length;Ct++){let Ls=Qe[Ct].image[Te].image;ke?he&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,Ct+1,0,0,Ls.width,Ls.height,ge,fe,Ls.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,Ct+1,pe,Ls.width,Ls.height,0,ge,fe,Ls.data)}}else{ke?he&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,0,0,ge,fe,ie[Te]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,pe,ge,fe,ie[Te]);for(let Ct=0;Ct<Qe.length;Ct++){let gn=Qe[Ct];ke?he&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,Ct+1,0,0,ge,fe,gn.image[Te]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,Ct+1,pe,ge,fe,gn.image[Te])}}}v(T)&&T.mipmapsAutoUpdate===!0&&S(n.TEXTURE_CUBE_MAP),de.__version=re.version,T.onUpdate&&T.onUpdate(T)}C.__version=T.version}function ut(C,T,q,ue,re,de){let ve=r.convert(q.format,q.colorSpace),te=r.convert(q.type),ne=M(q.internalFormat,ve,te,q.normalized,q.colorSpace),me=i.get(T),U=i.get(q);if(U.__renderTarget=T,!me.__hasExternalTextures){let ie=Math.max(1,T.width>>de),Q=Math.max(1,T.height>>de);re===n.TEXTURE_3D||re===n.TEXTURE_2D_ARRAY?t.texImage3D(re,de,ne,ie,Q,T.depth,0,ve,te,null):t.texImage2D(re,de,ne,ie,Q,0,ve,te,null)}t.bindFramebuffer(n.FRAMEBUFFER,C),Me(T)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ue,re,U.__webglTexture,0,zt(T)):(re===n.TEXTURE_2D||re>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&re<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ue,re,U.__webglTexture,de),t.bindFramebuffer(n.FRAMEBUFFER,null)}function In(C,T,q){if(n.bindRenderbuffer(n.RENDERBUFFER,C),T.depthBuffer){let ue=T.depthTexture,re=ue&&ue.isDepthTexture?ue.type:null,de=x(T.stencilBuffer,re),ve=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;Me(T)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,zt(T),de,T.width,T.height):q?n.renderbufferStorageMultisample(n.RENDERBUFFER,zt(T),de,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,de,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,ve,n.RENDERBUFFER,C)}else{let ue=T.textures;for(let re=0;re<ue.length;re++){let de=ue[re],ve=r.convert(de.format,de.colorSpace),te=r.convert(de.type),ne=M(de.internalFormat,ve,te,de.normalized,de.colorSpace);Me(T)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,zt(T),ne,T.width,T.height):q?n.renderbufferStorageMultisample(n.RENDERBUFFER,zt(T),ne,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,ne,T.width,T.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function At(C,T,q){let ue=T.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,C),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let re=i.get(T.depthTexture);re.__renderTarget=T;let de=ue?T.depthTexture.image[0]:T.depthTexture.image;(!re.__webglTexture||de.width!==T.width||de.height!==T.height)&&(de.width=T.width,de.height=T.height,T.depthTexture.needsUpdate=!0),ue?k(T.depthTexture,0):D(T.depthTexture,0);let ve=re.__webglTexture,te=zt(T),ne=ue?n.TEXTURE_CUBE_MAP_POSITIVE_X+q:n.TEXTURE_2D,me=T.depthTexture.format===bs?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(T.depthTexture.format===hs)Me(T)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,me,ne,ve,0,te):n.framebufferTexture2D(n.FRAMEBUFFER,me,ne,ve,0);else if(T.depthTexture.format===bs)Me(T)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,me,ne,ve,0,te):n.framebufferTexture2D(n.FRAMEBUFFER,me,ne,ve,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function cn(C){let T=i.get(C),q=C.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==C.depthTexture){let ue=C.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),ue){let re=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,ue.removeEventListener("dispose",re)};ue.addEventListener("dispose",re),T.__depthDisposeCallback=re}T.__boundDepthTexture=ue}if(C.depthTexture&&!T.__autoAllocateDepthBuffer)if(q)for(let ue=0;ue<6;ue++)At(T.__webglFramebuffer[ue],C,ue);else C.texture.mipmaps.length>0?At(T.__webglFramebuffer[0],C,0):At(T.__webglFramebuffer,C,0);else if(q){T.__webglDepthbuffer=[];for(let ue=0;ue<6;ue++)if(t.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[ue]),T.__webglDepthbuffer[ue]===void 0)T.__webglDepthbuffer[ue]=n.createRenderbuffer(),In(T.__webglDepthbuffer[ue],C,!1);else{let re=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,de=T.__webglDepthbuffer[ue];n.bindRenderbuffer(n.RENDERBUFFER,de),n.framebufferRenderbuffer(n.FRAMEBUFFER,re,n.RENDERBUFFER,de)}}else if(C.texture.mipmaps.length>0?t.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=n.createRenderbuffer(),In(T.__webglDepthbuffer,C,!1);else{let re=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,de=T.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,de),n.framebufferRenderbuffer(n.FRAMEBUFFER,re,n.RENDERBUFFER,de)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ln(C,T,q){let ue=i.get(C);T!==void 0&&ut(ue.__webglFramebuffer,C,C.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),q!==void 0&&cn(C)}function Dn(C){let T=C.texture,q=i.get(C),ue=i.get(T);C.addEventListener("dispose",L),R(C);let re=C.textures,de=C.isWebGLCubeRenderTarget===!0,ve=re.length>1;if(ve||(ue.__webglTexture===void 0&&(ue.__webglTexture=n.createTexture()),ue.__version=T.version,o.memory.textures++),de){q.__webglFramebuffer=[];for(let te=0;te<6;te++)if(T.mipmaps.length>0){q.__webglFramebuffer[te]=[];for(let ne=0;ne<T.mipmaps.length;ne++)q.__webglFramebuffer[te][ne]=n.createFramebuffer()}else q.__webglFramebuffer[te]=n.createFramebuffer()}else{if(T.mipmaps.length>0){q.__webglFramebuffer=[];for(let te=0;te<T.mipmaps.length;te++)q.__webglFramebuffer[te]=n.createFramebuffer()}else q.__webglFramebuffer=n.createFramebuffer();if(ve)for(let te=0,ne=re.length;te<ne;te++){let me=i.get(re[te]);me.__webglTexture===void 0&&(me.__webglTexture=n.createTexture(),o.memory.textures++)}if(C.samples>0&&Me(C)===!1){q.__webglMultisampledFramebuffer=n.createFramebuffer(),q.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,q.__webglMultisampledFramebuffer);for(let te=0;te<re.length;te++){let ne=re[te];q.__webglColorRenderbuffer[te]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,q.__webglColorRenderbuffer[te]);let me=r.convert(ne.format,ne.colorSpace),U=r.convert(ne.type),ie=M(ne.internalFormat,me,U,ne.normalized,ne.colorSpace,C.isXRRenderTarget===!0),Q=zt(C);n.renderbufferStorageMultisample(n.RENDERBUFFER,Q,ie,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+te,n.RENDERBUFFER,q.__webglColorRenderbuffer[te])}n.bindRenderbuffer(n.RENDERBUFFER,null),C.depthBuffer&&(q.__webglDepthRenderbuffer=n.createRenderbuffer(),In(q.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(de){t.bindTexture(n.TEXTURE_CUBE_MAP,ue.__webglTexture),Ie(n.TEXTURE_CUBE_MAP,T);for(let te=0;te<6;te++)if(T.mipmaps.length>0)for(let ne=0;ne<T.mipmaps.length;ne++)ut(q.__webglFramebuffer[te][ne],C,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+te,ne);else ut(q.__webglFramebuffer[te],C,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0);v(T)?S(n.TEXTURE_CUBE_MAP):T.mipmaps.length>0&&n.texParameteri(n.TEXTURE_CUBE_MAP,n.TEXTURE_MAX_LEVEL,T.mipmaps.length-1),t.unbindTexture()}else if(ve){for(let te=0,ne=re.length;te<ne;te++){let me=re[te],U=i.get(me),ie=n.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ie=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ie,U.__webglTexture),Ie(ie,me),ut(q.__webglFramebuffer,C,me,n.COLOR_ATTACHMENT0+te,ie,0),v(me)&&S(ie)}t.unbindTexture()}else{let te=n.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(te=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(te,ue.__webglTexture),Ie(te,T),T.mipmaps.length>0)for(let ne=0;ne<T.mipmaps.length;ne++)ut(q.__webglFramebuffer[ne],C,T,n.COLOR_ATTACHMENT0,te,ne);else ut(q.__webglFramebuffer,C,T,n.COLOR_ATTACHMENT0,te,0);v(T)?S(te):T.mipmaps.length>0&&n.texParameteri(te,n.TEXTURE_MAX_LEVEL,T.mipmaps.length-1),t.unbindTexture()}C.depthBuffer&&cn(C)}function z(C){let T=C.textures;for(let q=0,ue=T.length;q<ue;q++){let re=T[q];if(v(re)&&re.mipmapsAutoUpdate===!0){let de=E(C),ve=i.get(re).__webglTexture;t.bindTexture(de,ve),S(de),t.unbindTexture()}}}let di=[];function kt(C){if(C.samples>0){if(Me(C)===!1){let T=C.textures,q=C.width,ue=C.height,re=n.COLOR_BUFFER_BIT,de=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ve=i.get(C),te=T.length>1;if(te)for(let me=0;me<T.length;me++)t.bindFramebuffer(n.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,ve.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,ve.__webglMultisampledFramebuffer),C.texture.mipmaps.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ve.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ve.__webglFramebuffer);for(let me=0;me<T.length;me++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(re|=n.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(re|=n.STENCIL_BUFFER_BIT)),te){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,ve.__webglColorRenderbuffer[me]);let U=i.get(T[me]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,U,0)}n.blitFramebuffer(0,0,q,ue,0,0,q,ue,re,n.NEAREST),c===!0&&(di.length=0,di.push(n.COLOR_ATTACHMENT0+me),C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&di.push(de),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,di))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),te)for(let me=0;me<T.length;me++){t.bindFramebuffer(n.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.RENDERBUFFER,ve.__webglColorRenderbuffer[me]);let U=i.get(T[me]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,ve.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.TEXTURE_2D,U,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ve.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&c){let T=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[T])}}}function zt(C){return Math.min(s.maxSamples,C.samples)}function Me(C){let T=i.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function ln(C){let T=o.render.frame;u.get(C)!==T&&(u.set(C,T),C.update())}function He(C,T){let q=C.colorSpace,ue=C.format,re=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||q!==An&&q!==Ui&&(Je.getTransfer(q)===St?(ue!==vi||re!==ii)&&Be("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ve("WebGLTextures: Unsupported texture color space:",q)),T}function Ke(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(l.width=C.naturalWidth||C.width,l.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(l.width=C.displayWidth,l.height=C.displayHeight):(l.width=C.width,l.height=C.height),l}this.allocateTextureUnit=Le,this.resetTextureUnits=J,this.getTextureUnits=se,this.setTextureUnits=ye,this.setTexture2D=D,this.setTexture2DArray=O,this.setTexture3D=W,this.setTextureCube=k,this.rebindTextures=Ln,this.setupRenderTarget=Dn,this.updateRenderTargetMipmap=z,this.updateMultisampleRenderTarget=kt,this.setupDepthRenderbuffer=cn,this.setupFrameBufferTexture=ut,this.useMultisampledRTT=Me,this.dispose=H}function d1(n,e){function t(i,s=Ui){let r,o=Je.getTransfer(s);if(i===ii)return n.UNSIGNED_BYTE;if(i===mu)return n.UNSIGNED_SHORT_4_4_4_4;if(i===gu)return n.UNSIGNED_SHORT_5_5_5_1;if(i===_d)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===xd)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===md)return n.BYTE;if(i===gd)return n.SHORT;if(i===Ho)return n.UNSIGNED_SHORT;if(i===pu)return n.INT;if(i===Oi)return n.UNSIGNED_INT;if(i===ui)return n.FLOAT;if(i===fn)return n.HALF_FLOAT;if(i===yd)return n.ALPHA;if(i===vd)return n.RGB;if(i===vi)return n.RGBA;if(i===hs)return n.DEPTH_COMPONENT;if(i===bs)return n.DEPTH_STENCIL;if(i===_u)return n.RED;if(i===xu)return n.RED_INTEGER;if(i===Ys)return n.RG;if(i===yu)return n.RG_INTEGER;if(i===vu)return n.RGBA_INTEGER;if(i===tc||i===nc||i===ic||i===sc)if(o===St)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===tc)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===nc)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ic)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===sc)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===tc)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===nc)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ic)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===sc)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Su||i===Mu||i===bu||i===Tu)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Su)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Mu)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===bu)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Tu)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Eu||i===wu||i===Au||i===Ru||i===Cu||i===rc||i===Pu)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Eu||i===wu)return o===St?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Au)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===Ru)return r.COMPRESSED_R11_EAC;if(i===Cu)return r.COMPRESSED_SIGNED_R11_EAC;if(i===rc)return r.COMPRESSED_RG11_EAC;if(i===Pu)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Iu||i===Lu||i===Du||i===Nu||i===Ou||i===Uu||i===Fu||i===Bu||i===ku||i===zu||i===Hu||i===Gu||i===Vu||i===Wu)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Iu)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Lu)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Du)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Nu)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ou)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Uu)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Fu)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Bu)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===ku)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===zu)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Hu)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Gu)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Vu)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Wu)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Xu||i===qu||i===Yu)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Xu)return o===St?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===qu)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Yu)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===$u||i===Ku||i===oc||i===Zu)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===$u)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Ku)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===oc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Zu)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Dr?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}var p1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,m1=`
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

}`,Wd=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let i=new Ba(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new Ht({vertexShader:p1,fragmentShader:m1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ye(new ti(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Xd=class extends Gi{constructor(e,t){super();let i=this,s=null,r=1,o=null,a="local-floor",c=1,l=null,u=null,h=null,f=null,d=null,g=null,_=typeof XRWebGLBinding<"u",p=new Wd,m={},y=t.getContextAttributes(),v=null,S=null,E=[],M=[],x=new Ee,b=null,R=null,I=new Kt;I.viewport=new _t;let A=new Kt;A.viewport=new _t;let L=[I,A],B=new uu,P=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let D=E[j];return D===void 0&&(D=new Eo,E[j]=D),D.getTargetRaySpace()},this.getControllerGrip=function(j){let D=E[j];return D===void 0&&(D=new Eo,E[j]=D),D.getGripSpace()},this.getHand=function(j){let D=E[j];return D===void 0&&(D=new Eo,E[j]=D),D.getHandSpace()};function K(j){let D=M.indexOf(j.inputSource);if(D===-1)return;let O=E[D];O!==void 0&&(O.update(j.inputSource,j.frame,l||o),O.dispatchEvent({type:j.type,data:j.inputSource}))}function $(){s.removeEventListener("select",K),s.removeEventListener("selectstart",K),s.removeEventListener("selectend",K),s.removeEventListener("squeeze",K),s.removeEventListener("squeezestart",K),s.removeEventListener("squeezeend",K),s.removeEventListener("end",$),s.removeEventListener("inputsourceschange",X);for(let j=0;j<E.length;j++){let D=M[j];D!==null&&(M[j]=null,E[j].disconnect(D))}P=null,H=null,p.reset();for(let j in m)delete m[j];if(e.setRenderTarget(v),d=null,f=null,h=null,s=null,S=null,Le.stop(),i.isPresenting=!1,e.setPixelRatio(b),e.setSize(x.width,x.height,!1),R!==null){let j=R.camera;j.fov=R.fov,j.zoom=R.zoom,j.updateProjectionMatrix(),R=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){r=j,i.isPresenting===!0&&Be("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){a=j,i.isPresenting===!0&&Be("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(j){l=j},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return h===null&&_&&(h=new XRWebGLBinding(s,t)),h},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(j){if(s=j,s!==null){if(v=e.getRenderTarget(),s.addEventListener("select",K),s.addEventListener("selectstart",K),s.addEventListener("selectend",K),s.addEventListener("squeeze",K),s.addEventListener("squeezestart",K),s.addEventListener("squeezeend",K),s.addEventListener("end",$),s.addEventListener("inputsourceschange",X),y.xrCompatible!==!0&&await t.makeXRCompatible(),b=e.getPixelRatio(),e.getSize(x),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let O=null,W=null,k=null;y.depth&&(k=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,O=y.stencil?bs:hs,W=y.stencil?Dr:Oi);let ee={colorFormat:t.RGBA8,depthFormat:k,scaleFactor:r};h=this.getBinding(),f=h.createProjectionLayer(ee),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),S=new Jt(f.textureWidth,f.textureHeight,{format:vi,type:ii,depthTexture:new ps(f.textureWidth,f.textureHeight,W,void 0,void 0,void 0,void 0,void 0,void 0,O),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}else{let O={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,t,O),s.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),S=new Jt(d.framebufferWidth,d.framebufferHeight,{format:vi,type:ii,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),Le.setContext(s),Le.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function X(j){for(let D=0;D<j.removed.length;D++){let O=j.removed[D],W=M.indexOf(O);W>=0&&(M[W]=null,E[W].disconnect(O))}for(let D=0;D<j.added.length;D++){let O=j.added[D],W=M.indexOf(O);if(W===-1){for(let ee=0;ee<E.length;ee++)if(ee>=M.length){M.push(O),W=ee;break}else if(M[ee]===null){M[ee]=O,W=ee;break}if(W===-1)break}let k=E[W];k&&k.connect(O)}}function G(j,D){D===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(D.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(s===null)return;let D=j.near,O=j.far;p.texture!==null&&(p.depthNear>0&&(D=p.depthNear),p.depthFar>0&&(O=p.depthFar)),B.near=A.near=I.near=D,B.far=A.far=I.far=O,(P!==B.near||H!==B.far)&&(s.updateRenderState({depthNear:B.near,depthFar:B.far}),P=B.near,H=B.far),B.layers.mask=j.layers.mask|6,I.layers.mask=B.layers.mask&-5,A.layers.mask=B.layers.mask&-3;let W=j.parent,k=B.cameras;G(B,W);for(let ee=0;ee<k.length;ee++)G(k[ee],W);B.projectionMatrix.copy(I.projectionMatrix),B.projectionMatrixInverse.copy(I.projectionMatrixInverse),R===null&&j.isPerspectiveCamera&&(R={camera:j,fov:j.fov,zoom:j.zoom}),J(j,B,W)};function J(j,D,O){O===null?j.matrix.copy(D.matrixWorld):(j.matrix.copy(O.matrixWorld),j.matrix.invert(),j.matrix.multiply(D.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(D.projectionMatrix),j.projectionMatrixInverse.copy(D.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=yr*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return B},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(j){c=j,f!==null&&(f.fixedFoveation=j),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=j)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(B)},this.getCameraTexture=function(j){return m[j]};let se=null;function ye(j,D){if(u=D.getViewerPose(l||o),g=D,u!==null){let O=u.views;d!==null&&(e.setRenderTargetFramebuffer(S,d.framebuffer),e.setRenderTarget(S));let W=!1;O.length!==B.cameras.length&&(B.cameras.length=0,W=!0);for(let oe=0;oe<O.length;oe++){let Ie=O[oe],Ce=null;if(d!==null)Ce=d.getViewport(Ie);else{let $e=h.getViewSubImage(f,Ie);Ce=$e.viewport,oe===0&&(e.setRenderTargetTextures(S,$e.colorTexture,$e.depthStencilTexture),e.setRenderTarget(S))}let Ae=L[oe];Ae===void 0&&(Ae=new Kt,Ae.layers.enable(oe),Ae.viewport=new _t,L[oe]=Ae),Ae.matrix.fromArray(Ie.transform.matrix),Ae.matrix.decompose(Ae.position,Ae.quaternion,Ae.scale),Ae.projectionMatrix.fromArray(Ie.projectionMatrix),Ae.projectionMatrixInverse.copy(Ae.projectionMatrix).invert(),Ae.viewport.set(Ce.x,Ce.y,Ce.width,Ce.height),oe===0&&(B.matrix.copy(Ae.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale)),W===!0&&B.cameras.push(Ae)}let k=s.enabledFeatures;if(k&&k.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){h=i.getBinding();let oe=h.getDepthInformation(O[0]);oe&&oe.isValid&&oe.texture&&p.init(oe,s.renderState)}if(k&&k.includes("camera-access")&&_){e.state.unbindTexture(),h=i.getBinding();for(let oe=0;oe<O.length;oe++){let Ie=O[oe].camera;if(Ie){let Ce=m[Ie];Ce||(Ce=new Ba,m[Ie]=Ce);let Ae=h.getCameraImage(Ie);Ce.sourceTexture=Ae}}}}for(let O=0;O<E.length;O++){let W=M[O],k=E[O];W!==null&&k!==void 0&&k.update(W,D,l||o)}se&&se(j,D),D.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:D}),g=null}let Le=new g_;Le.setAnimationLoop(ye),this.setAnimationLoop=function(j){se=j},this.dispose=function(){}}},g1=new Xe,w_=new qe;w_.set(-1,0,0,0,1,0,0,0,1);function _1(n,e){function t(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function i(p,m){m.color.getRGB(p.fogColor.value,Ld(n)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function s(p,m,y,v,S){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(p,m):m.isMeshLambertMaterial?(r(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(p,m),h(p,m)):m.isMeshPhongMaterial?(r(p,m),u(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(p,m),f(p,m),m.isMeshPhysicalMaterial&&d(p,m,S)):m.isMeshMatcapMaterial?(r(p,m),g(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),_(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(o(p,m),m.isLineDashedMaterial&&a(p,m)):m.isPointsMaterial?c(p,m,y,v):m.isSpriteMaterial?l(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,t(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===Cn&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,t(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===Cn&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,t(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,t(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);let y=e.get(m),v=y.envMap,S=y.envMapRotation;v&&(p.envMap.value=v,p.envMapRotation.value.setFromMatrix4(g1.makeRotationFromEuler(S)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(w_),p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,p.aoMapTransform))}function o(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform))}function a(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function c(p,m,y,v){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*y,p.scale.value=v*.5,m.map&&(p.map.value=m.map,t(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function l(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function u(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function h(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function f(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function d(p,m,y){p.ior.value=m.ior,m.diffuseRoughness>0&&(p.diffuseRoughness.value=m.diffuseRoughness,m.diffuseRoughnessMap&&(p.diffuseRoughnessMap.value=m.diffuseRoughnessMap,t(m.diffuseRoughnessMap,p.diffuseRoughnessMapTransform))),m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Cn&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.retroreflectivity>0&&(p.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessMinimum,p.iridescenceThicknessMaximum.value=m.iridescenceThicknessMaximum,m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=y.texture,p.transmissionSamplerSize.value.set(y.width,y.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function _(p,m){let y=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(y.matrixWorld),p.nearDistance.value=y.shadow.camera.near,p.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function x1(n,e,t,i){let s={},r={};function o(y,v){let S=v.program;i.uniformBlockBinding(y,S,s[y.id])}function a(y,v){let S=s[y.id];S===void 0&&(g(y),S=c(y),s[y.id]=S,y.addEventListener("dispose",p));let E=v.program;i.updateUBOMapping(y,E);let M=e.render.frame;r[y.id]!==M&&(l(y),r[y.id]=M)}function c(y){let v=n.createBuffer(),S=y.__size,E=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,S,E),n.bindBuffer(n.UNIFORM_BUFFER,null),v}function l(y){let v=s[y.id],S=y.uniforms,E=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let M=0,x=S.length;M<x;M++){let b=S[M];if(Array.isArray(b))for(let R=0,I=b.length;R<I;R++)u(b[R],M,R,E);else u(b,M,0,E)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(y,v,S,E){if(f(y,v,S,E)===!0){let M=y.__offset,x=y.value;if(Array.isArray(x)){let b=0;for(let R=0;R<x.length;R++){let I=x[R],A=_(I,!0);h(I,y.__data,b),b+=A.storage/Float32Array.BYTES_PER_ELEMENT}}else h(x,y.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,M,y.__data)}}function h(y,v,S){typeof y=="number"||typeof y=="boolean"?v[S]=y:y.isMatrix3?(v[S]=y.elements[0],v[S+1]=y.elements[1],v[S+2]=y.elements[2],v[S+3]=0,v[S+4]=y.elements[3],v[S+5]=y.elements[4],v[S+6]=y.elements[5],v[S+7]=0,v[S+8]=y.elements[6],v[S+9]=y.elements[7],v[S+10]=y.elements[8],v[S+11]=0):ArrayBuffer.isView(y)?v.set(y.subarray(0,v.length-S),S):y.toArray(v,S)}function f(y,v,S,E){let M=y.value,x=v+"_"+S;if(Array.isArray(M)){E[x]===void 0&&(E[x]=[]);let b=E[x],R=!1;for(let I=0;I<M.length;I++)d(M[I],b,I)===!0&&(R=!0);return R}return d(M,E,x)}function d(y,v,S){if(v[S]===void 0)return typeof y=="number"||typeof y=="boolean"?v[S]=y:ArrayBuffer.isView(y)?v[S]=y.slice():v[S]=y.clone(),!0;{let E=v[S];if(typeof y=="number"||typeof y=="boolean"){if(E!==y)return v[S]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(E.equals(y)===!1)return E.copy(y),!0}}return!1}function g(y){let v=y.uniforms,S=0,E=16;for(let x=0,b=v.length;x<b;x++){let R=Array.isArray(v[x])?v[x]:[v[x]];for(let I=0,A=R.length;I<A;I++){let L=R[I],B=Array.isArray(L.value)?L.value:[L.value],P=Array.isArray(v[x])||Array.isArray(L.value),H=S;for(let $=0,X=B.length;$<X;$++){let G=B[$],J=_(G,P),se=S%E,ye=se%J.boundary,Le=se+ye;S+=ye,Le!==0&&E-Le<J.storage&&(S+=E-Le),$===0&&(H=S),S+=J.storage}let K=L.type==="int"?Int32Array:L.type==="uint"?Uint32Array:Float32Array;L.__data=new K((S-H)/Float32Array.BYTES_PER_ELEMENT),L.__offset=H}}let M=S%E;return M>0&&(S+=E-M),y.__size=S,y.__cache={},this}function _(y,v){let S={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(S.boundary=4,S.storage=4):y.isVector2?(S.boundary=8,S.storage=8):y.isVector3||y.isColor?(S.boundary=16,S.storage=12):y.isVector4?(S.boundary=16,S.storage=16):y.isMatrix3?(S.boundary=16,S.storage=48):y.isMatrix4?(S.boundary=16,S.storage=64):y.isTexture?Be("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(S.boundary=16,S.storage=y.byteLength):Be("WebGLRenderer: Unsupported uniform value type.",y),v===!0&&(S.boundary=16,S.storage=Math.ceil(S.storage/16)*16),S}function p(y){let v=y.target;v.removeEventListener("dispose",p),n.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function m(){for(let y in s)n.deleteBuffer(s[y]);s={},r={}}return{bind:o,update:a,dispose:m}}var y1=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),$i=null;function v1(){return $i===null&&($i=new Ro(y1,16,16,Ys,fn),$i.name="DFG_LUT",$i.minFilter=un,$i.magFilter=un,$i.wrapS=jn,$i.wrapT=jn,$i.generateMipmaps=!1,$i.needsUpdate=!0),$i}var nh=class{constructor(e={}){let{canvas:t=Gg(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:f=!1,outputBufferType:d=ii}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=o;let _=d,p=new Set([vu,yu,xu]),m=new Set([ii,Oi,Ho,Dr,mu,gu]),y=new Uint32Array(4),v=new Int32Array(4),S={textures:[],min:[],max:[],resolution:[]},E=null,M=null,x=[],b=[],R=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=qi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let I=this,A=!1,L=null,B=null,P=null,H=null;this._outputColorSpace=Dt;let K=0,$=0,X=null,G=-1,J=null,se=new _t,ye=new _t,Le=null,j=new ae(0),D=0,O=t.width,W=t.height,k=1,ee=null,le=null,oe=new _t(0,0,O,W),Ie=new _t(0,0,O,W),Ce=!1,Ae=new Ws,$e=new Xl,ht=!1,Pt=!1,ut=new Xe,In=new N,At=new _t,cn={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ln=!1;function Dn(){return X===null?k:1}let z=i;function di(w,F){return t.getContext(w,F)}let kt,zt,Me,ln,He,Ke,C,T,q,ue,re,de,ve,te,ne,me,U,ie,Q,ge,fe,pe,ke;try{let w={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"187"}`),t.addEventListener("webglcontextlost",ze,!1),t.addEventListener("webglcontextrestored",Qe,!1),t.addEventListener("webglcontextcreationerror",Te,!1),z===null){let F="webgl2";if(z=di(F,w),z===null)throw di(F)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}et()}catch(w){throw t.removeEventListener("webglcontextlost",ze,!1),t.removeEventListener("webglcontextrestored",Qe,!1),t.removeEventListener("webglcontextcreationerror",Te,!1),Ve("WebGLRenderer: "+w.message),w}function et(){kt=new Ib(z),kt.init(),fe=new d1(z,kt),zt=new vb(z,kt,e,fe),Me=new h1(z,kt),zt.reversedDepthBuffer&&f&&Me.buffers.depth.setReversed(!0),B=z.createFramebuffer(),P=z.createFramebuffer(),H=z.createFramebuffer(),ln=new Nb(z),He=new JT,Ke=new f1(z,kt,Me,He,zt,fe,ln),C=new Pb(I),T=new Uv(z),pe=new xb(z,T),q=new Lb(z,T,ln,pe),ue=new Ub(z,q,T,pe,ln),ie=new Ob(z,zt,Ke),ne=new Sb(He),re=new ZT(I,C,kt,zt,pe,ne),de=new _1(I,He),ve=new QT,te=new r1(kt),U=new _b(I,C,Me,ue,g,c),me=new u1(I,ue,zt),ke=new x1(z,ln,zt,Me),Q=new yb(z,kt,ln),ge=new Db(z,kt,ln),ln.programs=re.programs,I.capabilities=zt,I.extensions=kt,I.properties=He,I.renderLists=ve,I.shadowMap=me,I.state=Me,I.info=ln}_!==ii&&(R=new Bb(_,t.width,t.height,a,s,r));let he=new Xd(I,z);this.xr=he,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){let w=kt.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){let w=kt.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return k},this.setPixelRatio=function(w){w!==void 0&&(k=w,this.setSize(O,W,!1))},this.getSize=function(w){return w.set(O,W)},this.setSize=function(w,F,Z=!0){if(he.isPresenting){Be("WebGLRenderer: Can't change size while VR device is presenting.");return}O=w,W=F,t.width=Math.floor(w*k),t.height=Math.floor(F*k),Z===!0&&(t.style.width=w+"px",t.style.height=F+"px"),R!==null&&R.setSize(t.width,t.height),this.setViewport(0,0,w,F)},this.getDrawingBufferSize=function(w){return w.set(O*k,W*k).floor()},this.setDrawingBufferSize=function(w,F,Z){O=w,W=F,k=Z,t.width=Math.floor(w*Z),t.height=Math.floor(F*Z),this.setViewport(0,0,w,F)},this.setEffects=function(w){if(_===ii){Ve("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(w){for(let F=0;F<w.length;F++)if(w[F].isOutputPass===!0){Be("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}R.setEffects(w||[])},this.getCurrentViewport=function(w){return w.copy(se)},this.getViewport=function(w){return w.copy(oe)},this.setViewport=function(w,F,Z,V){w.isVector4?oe.set(w.x,w.y,w.z,w.w):oe.set(w,F,Z,V),Me.viewport(se.copy(oe).multiplyScalar(Dn()).round())},this.getScissor=function(w){return w.copy(Ie)},this.setScissor=function(w,F,Z,V){w.isVector4?Ie.set(w.x,w.y,w.z,w.w):Ie.set(w,F,Z,V),Me.scissor(ye.copy(Ie).multiplyScalar(Dn()).round())},this.getScissorTest=function(){return Ce},this.setScissorTest=function(w){Me.setScissorTest(Ce=w)},this.setOpaqueSort=function(w){ee=w},this.setTransparentSort=function(w){le=w},this.getClearColor=function(w){return w.copy(U.getClearColor())},this.setClearColor=function(){U.setClearColor(...arguments)},this.getClearAlpha=function(){return U.getClearAlpha()},this.setClearAlpha=function(){U.setClearAlpha(...arguments)},this.clear=function(w=!0,F=!0,Z=!0){let V=0;if(w){let Y=!1;if(X!==null){let Se=X.texture.format;Y=p.has(Se)}if(Y){let Se=X.texture.type,De=m.has(Se),_e=U.getClearColor(),we=U.getClearAlpha(),Fe=_e.r,Ze=_e.g,pt=_e.b;De?(y[0]=Fe,y[1]=Ze,y[2]=pt,y[3]=we,z.clearBufferuiv(z.COLOR,0,y)):(v[0]=Fe,v[1]=Ze,v[2]=pt,v[3]=we,z.clearBufferiv(z.COLOR,0,v))}else V|=z.COLOR_BUFFER_BIT}F&&(V|=z.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Z&&(V|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V!==0&&z.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(w){w.setRenderer(this),L=w},this.dispose=function(){t.removeEventListener("webglcontextlost",ze,!1),t.removeEventListener("webglcontextrestored",Qe,!1),t.removeEventListener("webglcontextcreationerror",Te,!1),U.dispose(),ve.dispose(),te.dispose(),Ke.dispose(),He.dispose(),C.dispose(),ue.dispose(),q.dispose(),pe.dispose(),ke.dispose(),re.dispose(),he.dispose(),he.removeEventListener("sessionstart",u0),he.removeEventListener("sessionend",h0),lr.stop()};function ze(w){w.preventDefault(),wa("WebGLRenderer: Context Lost."),A=!0}function Qe(){wa("WebGLRenderer: Context Restored."),A=!1;let w=ln.autoReset,F=me.enabled,Z=me.autoUpdate,V=me.needsUpdate,Y=me.type;et(),ln.autoReset=w,me.enabled=F,me.autoUpdate=Z,me.needsUpdate=V,me.type=Y}function Te(w){Ve("WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Ct(w){let F=w.target;F.removeEventListener("dispose",Ct),gn(F)}function gn(w){Ls(w),He.remove(w)}function Ls(w){let F=He.get(w).programs;F!==void 0&&(F.forEach(function(Z){re.releaseProgram(Z)}),w.isShaderMaterial&&re.releaseShaderCache(w))}this.renderBufferDirect=function(w,F,Z,V,Y,Se){F===null&&(F=cn);let De=Y.isMesh&&Y.matrixWorld.determinantAffine()<0,_e=py(w,F,Z,V,Y);Me.setMaterial(V,De);let we=Z.index,Fe=1;if(V.wireframe===!0){if(we=q.getWireframeAttribute(Z),we===void 0)return;Fe=2}let Ze=Z.drawRange,pt=Z.attributes.position,Ne=Ze.start*Fe,mt=(Ze.start+Ze.count)*Fe;Se!==null&&(Ne=Math.max(Ne,Se.start*Fe),mt=Math.min(mt,(Se.start+Se.count)*Fe)),we!==null?(Ne=Math.max(Ne,0),mt=Math.min(mt,we.count)):pt!=null&&(Ne=Math.max(Ne,0),mt=Math.min(mt,pt.count));let tn=mt-Ne;if(tn<0||tn===1/0)return;pe.setup(Y,V,_e,Z,we);let Ut,It=Q;if(we!==null&&(Ut=T.get(we),It=ge,It.setIndex(Ut)),Y.isMesh)V.wireframe===!0?(Me.setLineWidth(V.wireframeLinewidth*Dn()),It.setMode(z.LINES)):It.setMode(z.TRIANGLES);else if(Y.isLine){let Nn=V.linewidth;Nn===void 0&&(Nn=1),Me.setLineWidth(Nn*Dn()),Y.isLineSegments?It.setMode(z.LINES):Y.isLineLoop?It.setMode(z.LINE_LOOP):It.setMode(z.LINE_STRIP)}else Y.isPoints?It.setMode(z.POINTS):Y.isSprite&&It.setMode(z.TRIANGLES);if(Y.isBatchedMesh)if(kt.get("WEBGL_multi_draw"))It.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else{let Nn=Y._multiDrawStarts,Oe=Y._multiDrawCounts,Wn=Y._multiDrawCount,Et=we?T.get(we).bytesPerElement:1,ur=He.get(V).currentProgram.getUniforms();for(let On=0;On<Wn;On++)ur.setValue(z,"_gl_DrawID",On),It.render(Nn[On]/Et,Oe[On])}else if(Y.isInstancedMesh)It.renderInstances(Ne,tn,Y.count);else if(Z.isInstancedBufferGeometry){let Nn=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,Oe=Math.min(Z.instanceCount,Nn);It.renderInstances(Ne,tn,Oe)}else It.render(Ne,tn)};function l0(w,F,Z,V){L!==null&&w.isNodeMaterial&&L.setObject(V,w),ht===!0&&ne.setState(w,Z,!1),w.transparent===!0&&w.side===Sn&&w.forceSinglePass===!1?(w.side=Cn,w.needsUpdate=!0,ha(w,F,V),w.side=Xi,w.needsUpdate=!0,ha(w,F,V),w.side=Sn):ha(w,F,V)}this.compile=function(w,F,Z=null){Z===null&&(Z=w),L!==null&&L.renderStart(w,F,Z),M=te.get(Z),M.init(F),b.push(M),Z.traverseVisible(function(Y){Y.isLight&&Y.layers.test(F.layers)&&(M.pushLight(Y),Y.castShadow&&M.pushShadow(Y))}),w!==Z&&w.traverseVisible(function(Y){Y.isLight&&Y.layers.test(F.layers)&&(M.pushLight(Y),Y.castShadow&&M.pushShadow(Y))}),M.setupLights(),L!==null&&L.updateLights(M.state.lightsArray),Pt=this.localClippingEnabled,ht=ne.init(this.clippingPlanes,Pt),ht===!0&&ne.setGlobalState(this.clippingPlanes,F),L!==null&&me.render(M.state.shadowsArray,Z,F);let V=new Set;return w.traverse(function(Y){if(!(Y.isMesh||Y.isPoints||Y.isLine||Y.isSprite))return;let Se=Y.material;if(Se)if(Array.isArray(Se))for(let De=0;De<Se.length;De++){let _e=Se[De];l0(_e,Z,F,Y),V.add(_e)}else l0(Se,Z,F,Y),V.add(Se)}),M=b.pop(),L!==null&&L.renderEnd(),V},this.compileAsync=function(w,F,Z=null){let V=this.compile(w,F,Z);return new Promise(Y=>{function Se(){if(V.forEach(function(De){let we=He.get(De).currentProgram;(we===void 0||we.isReady())&&V.delete(De)}),V.size===0){Y(w);return}setTimeout(Se,10)}kt.get("KHR_parallel_shader_compile")!==null?Se():setTimeout(Se,10)})};let vf=null;function fy(w){vf&&vf(w)}function u0(){lr.stop()}function h0(){lr.start()}let lr=new g_;lr.setAnimationLoop(fy),typeof self<"u"&&lr.setContext(self),this.setAnimationLoop=function(w){vf=w,he.setAnimationLoop(w),w===null?lr.stop():lr.start()},he.addEventListener("sessionstart",u0),he.addEventListener("sessionend",h0),this.render=function(w,F){if(F!==void 0&&F.isCamera!==!0){Ve("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;L!==null&&L.renderStart(w,F);let Z=he.enabled===!0&&he.isPresenting===!0,V=R!==null&&(X===null||Z)&&R.begin(I,X);if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),he.enabled===!0&&he.isPresenting===!0&&(R===null||R.isCompositing()===!1)&&(he.cameraAutoUpdate===!0&&he.updateCamera(F),F=he.getCamera()),w.isScene===!0&&w.onBeforeRender(I,w,F,X),M=te.get(w,b.length),M.init(F),M.state.textureUnits=Ke.getTextureUnits(),b.push(M),ut.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),F.isArrayCamera?$e.setFromArrayCamera(F):Ae.setFromProjectionMatrix(ut,mi,F.reversedDepth),Pt=this.localClippingEnabled,ht=ne.init(this.clippingPlanes,Pt),E=ve.get(w,x.length),E.init(),x.push(E),this.info.render.frame++,he.enabled===!0&&he.isPresenting===!0){let De=I.xr.getDepthSensingMesh();De!==null&&Sf(De,F,-1/0,I.sortObjects)}Sf(w,F,0,I.sortObjects),E.finish(),L!==null&&L.updateLights(M.state.lightsArray),I.sortObjects===!0&&E.sort(ee,le),Ln=he.enabled===!1||he.isPresenting===!1||he.hasDepthSensing()===!1,Ln&&U.addToRenderList(E,w),this.info.autoReset===!0&&this.info.reset(),ht===!0&&ne.beginShadows();let Y=M.state.shadowsArray;if(me.render(Y,w,F),ht===!0&&ne.endShadows(),(V&&R.hasRenderPass())===!1){let De=E.opaque,_e=E.transmissive;if(M.setupLights(),F.isArrayCamera){let we=F.cameras;if(_e.length>0)for(let Fe=0,Ze=we.length;Fe<Ze;Fe++){let pt=we[Fe];d0(De,_e,w,pt)}Ln&&U.render(w);for(let Fe=0,Ze=we.length;Fe<Ze;Fe++){let pt=we[Fe];f0(E,w,pt,pt.viewport)}}else _e.length>0&&d0(De,_e,w,F),Ln&&U.render(w),f0(E,w,F)}X!==null&&$===0&&(Ke.updateMultisampleRenderTarget(X),Ke.updateRenderTargetMipmap(X)),V&&R.end(I),w.isScene===!0&&w.onAfterRender(I,w,F),pe.resetDefaultState(),G=-1,J=null,b.pop(),b.length>0?(M=b[b.length-1],Ke.setTextureUnits(M.state.textureUnits),ht===!0&&ne.setGlobalState(I.clippingPlanes,M.state.camera)):M=null,x.pop(),x.length>0?E=x[x.length-1]:E=null,L!==null&&L.renderEnd()};function Sf(w,F,Z,V){if(w.visible===!1)return;if(w.layers.test(F.layers)){if(w.isGroup)Z=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(F);else if(w.isLight)M.pushLight(w),w.castShadow&&M.pushShadow(w);else if(w.isSprite){let De=F.isArrayCamera?$e:Ae;if(!w.frustumCulled||w.intersectsFrustum(De)){V&&At.setFromMatrixPosition(w.matrixWorld).applyMatrix4(ut);let _e=ue.update(w),we=w.material;we.visible&&E.push(w,_e,we,Z,At.z,null,F)}}else if(w.isMesh||w.isLine||w.isPoints){let De=F.isArrayCamera?$e:Ae;if(!w.frustumCulled||w.intersectsFrustum(De)){let _e=ue.update(w),we=w.material;if(V&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),At.copy(w.boundingSphere.center)):(_e.boundingSphere===null&&_e.computeBoundingSphere(),At.copy(_e.boundingSphere.center)),At.applyMatrix4(w.matrixWorld).applyMatrix4(ut)),Array.isArray(we)){let Fe=_e.groups;for(let Ze=0,pt=Fe.length;Ze<pt;Ze++){let Ne=Fe[Ze],mt=we[Ne.materialIndex];mt&&mt.visible&&E.push(w,_e,mt,Z,At.z,Ne,F)}}else we.visible&&E.push(w,_e,we,Z,At.z,null,F)}}}let Se=w.children;for(let De=0,_e=Se.length;De<_e;De++)Sf(Se[De],F,Z,V)}function f0(w,F,Z,V){let{opaque:Y,transmissive:Se,transparent:De}=w;M.setupLightsView(Z),ht===!0&&ne.setGlobalState(I.clippingPlanes,Z),V&&Me.viewport(se.copy(V)),Y.length>0&&rl(Y,F,Z),Se.length>0&&rl(Se,F,Z),De.length>0&&rl(De,F,Z),Me.buffers.depth.setTest(!0),Me.buffers.depth.setMask(!0),Me.buffers.color.setMask(!0),Me.setPolygonOffset(!1)}function d0(w,F,Z,V){if((Z.isScene===!0?Z.overrideMaterial:null)!==null)return;if(M.state.transmissionRenderTarget[V.id]===void 0){let Ne=kt.has("EXT_color_buffer_half_float")||kt.has("EXT_color_buffer_float");M.state.transmissionRenderTarget[V.id]=new Jt(1,1,{generateMipmaps:!0,type:Ne?fn:ii,minFilter:yi,samples:Math.max(4,zt.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Je.workingColorSpace})}let Se=M.state.transmissionRenderTarget[V.id],De=V.viewport||se;Se.setSize(De.z*I.transmissionResolutionScale,De.w*I.transmissionResolutionScale);let _e=I.getRenderTarget(),we=I.getActiveCubeFace(),Fe=I.getActiveMipmapLevel();I.setRenderTarget(Se),I.getClearColor(j),D=I.getClearAlpha(),D<1&&I.setClearColor(16777215,.5),I.clear(),Ln&&U.render(Z);let Ze=I.toneMapping;I.toneMapping=qi;let pt=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),M.setupLightsView(V),ht===!0&&ne.setGlobalState(I.clippingPlanes,V),rl(w,Z,V),Ke.updateMultisampleRenderTarget(Se),Ke.updateRenderTargetMipmap(Se),kt.has("WEBGL_multisampled_render_to_texture")===!1){let Ne=!1;for(let mt=0,tn=F.length;mt<tn;mt++){let Ut=F[mt],{object:It,geometry:Nn,material:Oe,group:Wn}=Ut;if(Oe.side===Sn&&It.layers.test(V.layers)){let Et=Oe.side;Oe.side=Cn,Oe.needsUpdate=!0,p0(It,Z,V,Nn,Oe,Wn),Oe.side=Et,Oe.needsUpdate=!0,Ne=!0}}Ne===!0&&(Ke.updateMultisampleRenderTarget(Se),Ke.updateRenderTargetMipmap(Se))}I.setRenderTarget(_e,we,Fe),I.setClearColor(j,D),pt!==void 0&&(V.viewport=pt),I.toneMapping=Ze}function rl(w,F,Z){let V=F.isScene===!0?F.overrideMaterial:null;for(let Y=0,Se=w.length;Y<Se;Y++){let De=w[Y],{object:_e,geometry:we,group:Fe}=De,Ze=De.material;Ze.allowOverride===!0&&V!==null&&(Ze=V),_e.layers.test(Z.layers)&&p0(_e,F,Z,we,Ze,Fe)}}function p0(w,F,Z,V,Y,Se){L!==null&&Y.isNodeMaterial&&L.setObject(w,Y),w.onBeforeRender(I,F,Z,V,Y,Se),w.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),Y.onBeforeRender(I,F,Z,V,w,Se),Y.transparent===!0&&Y.side===Sn&&Y.forceSinglePass===!1?(Y.side=Cn,Y.needsUpdate=!0,I.renderBufferDirect(Z,F,V,Y,w,Se),Y.side=Xi,Y.needsUpdate=!0,I.renderBufferDirect(Z,F,V,Y,w,Se),Y.side=Sn):I.renderBufferDirect(Z,F,V,Y,w,Se),w.onAfterRender(I,F,Z,V,Y,Se)}function m0(w){let F=0;for(let Z of w)Z.texture!==null&&F++;return F}function ha(w,F,Z){F.isScene!==!0&&(F=cn);let V=He.get(w),Y=M.state.lights,Se=M.state.shadowsArray,De=Y.state.version,_e=re.getParameters(w,Y.state,Se,F,Z,M.state.lightProbeGridArray),we=re.getProgramCacheKey(_e),Fe=V.programs;V.environment=w.isMeshStandardMaterial||w.isMeshLambertMaterial||w.isMeshPhongMaterial?F.environment:null,V.fog=F.fog;let Ze=w.isMeshStandardMaterial||w.isMeshLambertMaterial&&!w.envMap||w.isMeshPhongMaterial&&!w.envMap;V.envMap=C.get(w.envMap||V.environment,Ze),V.envMapRotation=V.environment!==null&&w.envMap===null?F.environmentRotation:w.envMapRotation,Fe===void 0&&(w.addEventListener("dispose",Ct),Fe=new Map,V.programs=Fe,V.programVariants=new Map);let pt=Fe.get(we);if(pt!==void 0){if(V.currentProgram===pt&&V.lightsStateVersion===De)return _0(w,_e),pt}else _e.uniforms=re.getUniforms(w),L!==null&&w.isNodeMaterial&&L.build(w,Z,_e),w.onBeforeCompile(_e,I),pt=re.acquireProgram(_e,we),Fe.set(we,pt),V.uniforms=_e.uniforms;let Ne=V.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Ne.clippingPlanes=ne.uniform),_0(w,_e),V.needsLights=gy(w),V.lightsStateVersion=De,V.needsLights&&(Ne.ambientLightColor.value=Y.state.ambient,Ne.lightProbe.value=Y.state.probe,Ne.sunLights.value=Y.state.sun,Ne.sunLightShadows.value=Y.state.sunShadow,Ne.directionalLights.value=Y.state.directional,Ne.directionalLightShadows.value=Y.state.directionalShadow,Ne.spotLights.value=Y.state.spot,Ne.spotLightShadows.value=Y.state.spotShadow,Ne.rectAreaLights.value=Y.state.rectArea,Ne.ltc_1.value=Y.state.rectAreaLTC1,Ne.ltc_2.value=Y.state.rectAreaLTC2,Ne.pointLights.value=Y.state.point,Ne.pointLightShadows.value=Y.state.pointShadow,Ne.hemisphereLights.value=Y.state.hemi,Ne.sunShadowMatrix.value=Y.state.sunShadowMatrix,Ne.sunShadowCascade.value=Y.state.sunShadowCascade,Ne.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,Ne.spotLightMatrix.value=Y.state.spotLightMatrix,Ne.spotLightMap.value=Y.state.spotLightMap,Ne.pointShadowMatrix.value=Y.state.pointShadowMatrix),V.numLightProbeGrids=m0(M.state.lightProbeGridArray),V.currentProgram=pt,V.uniformsList=null,pt}function dy(w,F,Z,V,Y){let Se=He.get(w),De=Se.currentProgram.id+","+V+","+Y,_e=Se.programVariants.get(De);return _e===void 0?(_e=ha(w,F,Z),Se.programVariants.set(De,_e)):(Se.currentProgram=_e,Se.uniformsList=null,Se.outputColorSpace=V,Se.toneMapping=Y),_e}function g0(w){if(w.uniformsList===null){let F=w.currentProgram.getUniforms();w.uniformsList=Vo.seqWithValue(F.seq,w.uniforms)}return w.uniformsList}function _0(w,F){let Z=He.get(w);Z.outputColorSpace=F.outputColorSpace,Z.batching=F.batching,Z.batchingColor=F.batchingColor,Z.instancing=F.instancing,Z.instancingColor=F.instancingColor,Z.instancingMorph=F.instancingMorph,Z.skinning=F.skinning,Z.morphTargets=F.morphTargets,Z.morphNormals=F.morphNormals,Z.morphColors=F.morphColors,Z.morphTargetsCount=F.morphTargetsCount,Z.numClippingPlanes=F.numClippingPlanes,Z.numIntersection=F.numClipIntersection,Z.vertexAlphas=F.vertexAlphas,Z.vertexTangents=F.vertexTangents,Z.toneMapping=F.toneMapping}function py(w,F,Z,V,Y){F.isScene!==!0&&(F=cn),Ke.resetTextureUnits();let Se=F.fog,De=V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial?F.environment:null,_e=X===null?I.outputColorSpace:X.isXRRenderTarget===!0?X.texture.colorSpace:Je.workingColorSpace,we=V.isMeshStandardMaterial||V.isMeshLambertMaterial&&!V.envMap||V.isMeshPhongMaterial&&!V.envMap,Fe=C.get(V.envMap||De,we),Ze=V.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,pt=!!Z.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Ne=!!Z.morphAttributes.position,mt=!!Z.morphAttributes.normal,tn=!!Z.morphAttributes.color,Ut=qi;V.toneMapped&&(X===null||X.isXRRenderTarget===!0)&&(Ut=I.toneMapping);let It=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,Nn=It!==void 0?It.length:0,Oe=He.get(V),Wn=M.state.lights;if(ht===!0&&(Pt===!0||w!==J)){let Wt=w===J&&V.id===G;ne.setState(V,w,Wt)}let Et=!1,ur=!1;V.version===Oe.__version?Oe.needsLights&&Oe.lightsStateVersion!==Wn.state.version||Y.isBatchedMesh&&Oe.batching===!1||!Y.isBatchedMesh&&Oe.batching===!0||Y.isBatchedMesh&&Oe.batchingColor===!0&&Y._colorsTexture===null||Y.isBatchedMesh&&Oe.batchingColor===!1&&Y._colorsTexture!==null||Y.isInstancedMesh&&Oe.instancing===!1||!Y.isInstancedMesh&&Oe.instancing===!0||Y.isSkinnedMesh&&Oe.skinning===!1||!Y.isSkinnedMesh&&Oe.skinning===!0||Y.isInstancedMesh&&Oe.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&Oe.instancingColor===!1&&Y.instanceColor!==null||Y.isInstancedMesh&&Oe.instancingMorph===!0&&Y.morphTexture===null||Y.isInstancedMesh&&Oe.instancingMorph===!1&&Y.morphTexture!==null||Oe.envMap!==Fe||V.fog===!0&&Oe.fog!==Se||Oe.numClippingPlanes!==void 0&&(Oe.numClippingPlanes!==ne.numPlanes||Oe.numIntersection!==ne.numIntersection)||Oe.vertexAlphas!==Ze||Oe.vertexTangents!==pt||Oe.morphTargets!==Ne||Oe.morphNormals!==mt||Oe.morphColors!==tn||Oe.morphTargetsCount!==Nn||Oe.numLightProbeGrids!==m0(M.state.lightProbeGridArray)?Et=!0:(Oe.outputColorSpace!==_e||Oe.toneMapping!==Ut)&&(ur=!0):(Et=!0,Oe.__version=V.version);let On=Oe.currentProgram;(Et===!0||ur===!0)&&(On=ur===!0?dy(V,F,Y,_e,Ut):ha(V,F,Y),L&&V.isNodeMaterial&&L.onUpdateProgram(V,On,Oe));let ol=!1,Ds=!1,hr=!1,yt=On.getUniforms(),wn=Oe.uniforms;if(Me.useProgram(On.program)&&(ol=!0,Ds=!0,hr=!0),V.id!==G&&(G=V.id,Ds=!0),ol||J!==w){Me.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),yt.setValue(z,"projectionMatrix",w.projectionMatrix),yt.setValue(z,"viewMatrix",w.matrixWorldInverse);let _n=yt.map.cameraPosition;_n!==void 0&&_n.setValue(z,In.setFromMatrixPosition(w.matrixWorld)),zt.logarithmicDepthBuffer&&yt.setValue(z,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&yt.setValue(z,"isOrthographic",w.isOrthographicCamera===!0),J!==w&&(J=w,Ds=!0,hr=!0)}if(Oe.needsLights&&(Wn.state.sunShadowMap.length>0&&yt.setValue(z,"sunShadowMap",Wn.state.sunShadowMap,Ke),Wn.state.directionalShadowMap.length>0&&yt.setValue(z,"directionalShadowMap",Wn.state.directionalShadowMap,Ke),Wn.state.spotShadowMap.length>0&&yt.setValue(z,"spotShadowMap",Wn.state.spotShadowMap,Ke),Wn.state.pointShadowMap.length>0&&yt.setValue(z,"pointShadowMap",Wn.state.pointShadowMap,Ke)),Y.isSkinnedMesh){yt.setOptional(z,Y,"bindMatrix"),yt.setOptional(z,Y,"bindMatrixInverse");let Wt=Y.skeleton;Wt&&(Wt.boneTexture===null&&Wt.computeBoneTexture(),yt.setValue(z,"boneTexture",Wt.boneTexture,Ke))}Y.isBatchedMesh&&(yt.setOptional(z,Y,"batchingTexture"),yt.setValue(z,"batchingTexture",Y._matricesTexture,Ke),yt.setOptional(z,Y,"batchingIdTexture"),yt.setValue(z,"batchingIdTexture",Y._indirectTexture,Ke),yt.setOptional(z,Y,"batchingColorTexture"),Y._colorsTexture!==null&&yt.setValue(z,"batchingColorTexture",Y._colorsTexture,Ke));let Pi=Z.morphAttributes;if((Pi.position!==void 0||Pi.normal!==void 0||Pi.color!==void 0)&&ie.update(Y,Z,On),(Ds||Oe.receiveShadow!==Y.receiveShadow)&&(Oe.receiveShadow=Y.receiveShadow,yt.setValue(z,"receiveShadow",Y.receiveShadow)),(V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial)&&V.envMap===null&&F.environment!==null&&(wn.envMapIntensity.value=F.environmentIntensity),wn.dfgLUT!==void 0&&(wn.dfgLUT.value=v1()),Ds){if(yt.setValue(z,"toneMappingExposure",I.toneMappingExposure),Oe.needsLights&&my(wn,hr),Se&&V.fog===!0&&de.refreshFogUniforms(wn,Se),de.refreshMaterialUniforms(wn,V,k,W,M.state.transmissionRenderTarget[w.id]),Oe.needsLights&&Oe.numLightProbeGrids>0){let Wt=S,_n=0;for(let is of M.state.lightProbeGridArray)is.texture!==null&&(Wt.textures[_n]=is.texture,Wt.min[_n]=is.boundingBox.min,Wt.max[_n]=is.boundingBox.max,Wt.resolution[_n]=is.resolution,_n++);for(let is in Wt)Wt[is].length=_n;wn.probesSH.value=Wt.textures,wn.probesMin.value=Wt.min,wn.probesMax.value=Wt.max,wn.probesResolution.value=Wt.resolution}Vo.upload(z,g0(Oe),wn,Ke)}if(V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(Vo.upload(z,g0(Oe),wn,Ke),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&yt.setValue(z,"center",Y.center),yt.setValue(z,"modelViewMatrix",Y.modelViewMatrix),yt.setValue(z,"normalMatrix",Y.normalMatrix),yt.setValue(z,"modelMatrix",Y.matrixWorld),V.uniformsGroups!==void 0){let Wt=V.uniformsGroups;for(let _n=0,is=Wt.length;_n<is;_n++){let y0=Wt[_n];ke.update(y0,On),ke.bind(y0,On)}}return On}function my(w,F){w.ambientLightColor.needsUpdate=F,w.lightProbe.needsUpdate=F,w.sunLights.needsUpdate=F,w.sunLightShadows.needsUpdate=F,w.directionalLights.needsUpdate=F,w.directionalLightShadows.needsUpdate=F,w.pointLights.needsUpdate=F,w.pointLightShadows.needsUpdate=F,w.spotLights.needsUpdate=F,w.spotLightShadows.needsUpdate=F,w.rectAreaLights.needsUpdate=F,w.hemisphereLights.needsUpdate=F}function gy(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return K},this.getActiveMipmapLevel=function(){return $},this.getRenderTarget=function(){return X},this.setRenderTargetTextures=function(w,F,Z){let V=He.get(w);V.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),He.get(w.texture).__webglTexture=F,He.get(w.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:Z,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,F){let Z=He.get(w);Z.__webglFramebuffer=F,Z.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(w,F=0,Z=0){X=w,K=F,$=Z;let V=null,Y=!1,Se=!1;if(w){let _e=He.get(w);if(_e.__useDefaultFramebuffer!==void 0){Me.bindFramebuffer(z.FRAMEBUFFER,_e.__webglFramebuffer),se.copy(w.viewport),ye.copy(w.scissor),Le=w.scissorTest,Me.viewport(se),Me.scissor(ye),Me.setScissorTest(Le),G=-1;return}else if(_e.__webglFramebuffer===void 0)Ke.setupRenderTarget(w);else if(_e.__hasExternalTextures)Ke.rebindTextures(w,He.get(w.texture).__webglTexture,He.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){let Ze=w.depthTexture;if(_e.__boundDepthTexture!==Ze){if(Ze!==null&&He.has(Ze)&&(w.width!==Ze.image.width||w.height!==Ze.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Ke.setupDepthRenderbuffer(w)}}let we=w.texture;(we.isData3DTexture||we.isDataArrayTexture||we.isCompressedArrayTexture)&&(Se=!0);let Fe=He.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Fe[F])?V=Fe[F][Z]:V=Fe[F],Y=!0):w.samples>0&&Ke.useMultisampledRTT(w)===!1?V=He.get(w).__webglMultisampledFramebuffer:Array.isArray(Fe)?V=Fe[Z]:V=Fe,se.copy(w.viewport),ye.copy(w.scissor),Le=w.scissorTest}else se.copy(oe).multiplyScalar(k).floor(),ye.copy(Ie).multiplyScalar(k).floor(),Le=Ce;if(Z!==0&&(V=B),Me.bindFramebuffer(z.FRAMEBUFFER,V)&&Me.drawBuffers(w,V),Me.viewport(se),Me.scissor(ye),Me.setScissorTest(Le),Y){let _e=He.get(w.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+F,_e.__webglTexture,Z)}else if(Se){let _e=F;for(let we=0;we<w.textures.length;we++){let Fe=He.get(w.textures[we]);z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0+we,Fe.__webglTexture,Z,_e)}}else if(w!==null&&Z!==0){let _e=He.get(w.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,_e.__webglTexture,Z)}G=-1};function x0(w){let F=He.get(w);return(F.__readFormat!==w.format||F.__readType!==w.type)&&(F.__readFormat=w.format,F.__readType=w.type,F.__formatReadable=zt.textureFormatReadable(w.format),F.__typeReadable=zt.textureTypeReadable(w.type)),F}this.readRenderTargetPixels=function(w,F,Z,V,Y,Se,De,_e=0){if(!(w&&w.isWebGLRenderTarget)){Ve("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let we=He.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&De!==void 0&&(we=we[De],Array.isArray(we)&&(we=we[0])),we){Me.bindFramebuffer(z.FRAMEBUFFER,we);try{let Fe=w.textures[_e],Ze=Fe.format,pt=Fe.type;w.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+_e);let Ne=x0(Fe);if(Ne.__formatReadable===!1){Ve("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ne.__typeReadable===!1){Ve("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=w.width-V&&Z>=0&&Z<=w.height-Y&&z.readPixels(F,Z,V,Y,fe.convert(Ze),fe.convert(pt),Se)}finally{let Fe=X!==null?He.get(X).__webglFramebuffer:null;Me.bindFramebuffer(z.FRAMEBUFFER,Fe)}}},this.readRenderTargetPixelsAsync=async function(w,F,Z,V,Y,Se,De,_e=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let we=He.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&De!==void 0&&(we=we[De],Array.isArray(we)&&(we=we[0])),we)if(F>=0&&F<=w.width-V&&Z>=0&&Z<=w.height-Y){Me.bindFramebuffer(z.FRAMEBUFFER,we);let Fe=w.textures[_e],Ze=Fe.format,pt=Fe.type;w.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+_e);let Ne=x0(Fe);if(Ne.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ne.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let mt=z.createBuffer();z.bindBuffer(z.PIXEL_PACK_BUFFER,mt),z.bufferData(z.PIXEL_PACK_BUFFER,Se.byteLength,z.STREAM_READ),z.readPixels(F,Z,V,Y,fe.convert(Ze),fe.convert(pt),0),z.bindBuffer(z.PIXEL_PACK_BUFFER,null);let tn=X!==null?He.get(X).__webglFramebuffer:null;Me.bindFramebuffer(z.FRAMEBUFFER,tn);let Ut=z.fenceSync(z.SYNC_GPU_COMMANDS_COMPLETE,0);return z.flush(),await Wg(z,Ut,4),z.bindBuffer(z.PIXEL_PACK_BUFFER,mt),z.getBufferSubData(z.PIXEL_PACK_BUFFER,0,Se),z.bindBuffer(z.PIXEL_PACK_BUFFER,null),z.deleteBuffer(mt),z.deleteSync(Ut),Se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,F=null,Z=0){let V=Math.pow(2,-Z),Y=Math.floor(w.image.width*V),Se=Math.floor(w.image.height*V),De=F!==null?F.x:0,_e=F!==null?F.y:0;Ke.setTexture2D(w,0),z.copyTexSubImage2D(z.TEXTURE_2D,Z,0,0,De,_e,Y,Se),Me.unbindTexture()},this.copyTextureToTexture=function(w,F,Z=null,V=null,Y=0,Se=0){let De,_e,we,Fe,Ze,pt,Ne,mt,tn,Ut=w.isCompressedTexture?w.mipmaps[Se]:w.image;if(Z!==null)De=Z.max.x-Z.min.x,_e=Z.max.y-Z.min.y,we=Z.isBox3?Z.max.z-Z.min.z:1,Fe=Z.min.x,Ze=Z.min.y,pt=Z.isBox3?Z.min.z:0;else{let yt=Math.pow(2,-Y);De=Math.floor(Ut.width*yt),_e=Math.floor(Ut.height*yt),w.isDataArrayTexture?we=Ut.depth:w.isData3DTexture?we=Math.floor(Ut.depth*yt):we=1,Fe=0,Ze=0,pt=0}V!==null?(Ne=V.x,mt=V.y,tn=V.z):(Ne=0,mt=0,tn=0);let It=fe.convert(F.format),Nn=fe.convert(F.type),Oe;F.isData3DTexture?(Ke.setTexture3D(F,0),Oe=z.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(Ke.setTexture2DArray(F,0),Oe=z.TEXTURE_2D_ARRAY):(Ke.setTexture2D(F,0),Oe=z.TEXTURE_2D),Me.activeTexture(z.TEXTURE0),Me.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,F.flipY),Me.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),Me.pixelStorei(z.UNPACK_ALIGNMENT,F.unpackAlignment);let Wn=Me.getParameter(z.UNPACK_ROW_LENGTH),Et=Me.getParameter(z.UNPACK_IMAGE_HEIGHT),ur=Me.getParameter(z.UNPACK_SKIP_PIXELS),On=Me.getParameter(z.UNPACK_SKIP_ROWS),ol=Me.getParameter(z.UNPACK_SKIP_IMAGES);Me.pixelStorei(z.UNPACK_ROW_LENGTH,Ut.width),Me.pixelStorei(z.UNPACK_IMAGE_HEIGHT,Ut.height),Me.pixelStorei(z.UNPACK_SKIP_PIXELS,Fe),Me.pixelStorei(z.UNPACK_SKIP_ROWS,Ze),Me.pixelStorei(z.UNPACK_SKIP_IMAGES,pt);let Ds=w.isDataArrayTexture||w.isData3DTexture,hr=F.isDataArrayTexture||F.isData3DTexture;if(w.isDepthTexture){let yt=He.get(w),wn=He.get(F),Pi=He.get(yt.__renderTarget),Wt=He.get(wn.__renderTarget);Me.bindFramebuffer(z.READ_FRAMEBUFFER,Pi.__webglFramebuffer),Me.bindFramebuffer(z.DRAW_FRAMEBUFFER,Wt.__webglFramebuffer);for(let _n=0;_n<we;_n++)Ds&&(z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,He.get(w).__webglTexture,Y,pt+_n),z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,He.get(F).__webglTexture,Se,tn+_n)),z.blitFramebuffer(Fe,Ze,Fe+De,Ze+_e,Ne,mt,Ne+De,mt+_e,z.DEPTH_BUFFER_BIT,z.NEAREST);Me.bindFramebuffer(z.READ_FRAMEBUFFER,null),Me.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else if(Y!==0||w.isRenderTargetTexture||He.has(w)){let yt=He.get(w),wn=He.get(F);Me.bindFramebuffer(z.READ_FRAMEBUFFER,P),Me.bindFramebuffer(z.DRAW_FRAMEBUFFER,H);for(let Pi=0;Pi<we;Pi++)Ds?z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,yt.__webglTexture,Y,pt+Pi):z.framebufferTexture2D(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,yt.__webglTexture,Y),hr?z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,wn.__webglTexture,Se,tn+Pi):z.framebufferTexture2D(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,wn.__webglTexture,Se),Y!==0?z.blitFramebuffer(Fe,Ze,Fe+De,Ze+_e,Ne,mt,Ne+De,mt+_e,z.COLOR_BUFFER_BIT,z.NEAREST):hr?z.copyTexSubImage3D(Oe,Se,Ne,mt,tn+Pi,Fe,Ze,De,_e):z.copyTexSubImage2D(Oe,Se,Ne,mt,Fe,Ze,De,_e);Me.bindFramebuffer(z.READ_FRAMEBUFFER,null),Me.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else hr?w.isDataTexture||w.isData3DTexture?z.texSubImage3D(Oe,Se,Ne,mt,tn,De,_e,we,It,Nn,Ut.data):F.isCompressedArrayTexture?z.compressedTexSubImage3D(Oe,Se,Ne,mt,tn,De,_e,we,It,Ut.data):z.texSubImage3D(Oe,Se,Ne,mt,tn,De,_e,we,It,Nn,Ut):w.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,Se,Ne,mt,De,_e,It,Nn,Ut.data):w.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,Se,Ne,mt,Ut.width,Ut.height,It,Ut.data):z.texSubImage2D(z.TEXTURE_2D,Se,Ne,mt,De,_e,It,Nn,Ut);Me.pixelStorei(z.UNPACK_ROW_LENGTH,Wn),Me.pixelStorei(z.UNPACK_IMAGE_HEIGHT,Et),Me.pixelStorei(z.UNPACK_SKIP_PIXELS,ur),Me.pixelStorei(z.UNPACK_SKIP_ROWS,On),Me.pixelStorei(z.UNPACK_SKIP_IMAGES,ol),Se===0&&F.generateMipmaps===!0&&F.mipmapsAutoUpdate===!0&&z.generateMipmap(Oe),Me.unbindTexture()},this.initRenderTarget=function(w){He.get(w).__webglFramebuffer===void 0&&Ke.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?Ke.setTextureCube(w,0):w.isData3DTexture?Ke.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?Ke.setTexture2DArray(w,0):Ke.setTexture2D(w,0),Me.unbindTexture()},this.resetState=function(){K=0,$=0,X=null,Me.reset(),pe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return mi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Je._getDrawingBufferColorSpace(e),t.unpackColorSpace=Je._getUnpackColorSpace()}};var qo={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};var hi=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},S1=new vs(-1,1,1,-1,0,1),qd=class extends vt{constructor(){super(),this.setAttribute("position",new rt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new rt([0,2,0,0,2,0],2))}},M1=new qd,$s=class{constructor(e){this._mesh=new Ye(M1,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,S1)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var Yo=class extends hi{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Ht?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Fi.clone(e.uniforms),this.material=new Ht({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new $s(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var fc=class extends hi{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){let s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},oh=class extends hi{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var ah=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let i=e.getSize(new Ee);this._width=i.width,this._height=i.height,t=new Jt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:fn}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Yo(qo),this.copyPass.material.blending=Ss,this.timer=new $a}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),i=!1;for(let s=0,r=this.passes.length;s<r;s++){let o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),o.needsSwap){if(i){let a=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}fc!==void 0&&(o instanceof fc?i=!0:o instanceof oh&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new Ee);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var ch=class extends hi{constructor(e,t,i=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new ae}render(e,t,i){let s=e.autoClear;e.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=s}};var A_={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new ae(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};var $o=class n extends hi{constructor(e,t=1,i,s){super(),this.strength=t,this.radius=i,this.threshold=s,this.resolution=e!==void 0?new Ee(e.x,e.y):new Ee(256,256),this.clearColor=new ae(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new Jt(r,o,{type:fn,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){let h=new Jt(r,o,{type:fn,depthBuffer:!1});h.texture.name="UnrealBloomPass.h"+u,h.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(h);let f=new Jt(r,o,{type:fn,depthBuffer:!1});f.texture.name="UnrealBloomPass.v"+u,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),r=Math.round(r/2),o=Math.round(o/2)}let a=A_;this.highPassUniforms=Fi.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Ht({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let c=[6,10,14,18,22];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new Ee(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new N(1,1,1),new N(1,1,1),new N(1,1,1),new N(1,1,1),new N(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Fi.clone(qo.uniforms),this.blendMaterial=new Ht({uniforms:this.copyUniforms,vertexShader:qo.vertexShader,fragmentShader:qo.fragmentShader,premultipliedAlpha:!0,blending:Ms,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new ae,this._oldClearAlpha=1,this._basic=new yn,this._fsQuad=new $s(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(i,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(i,s),this.renderTargetsVertical[r].setSize(i,s),this.separableBlurMaterials[r].uniforms.invSize.value=new Ee(1/i,1/s),i=Math.round(i/2),s=Math.round(s/2)}render(e,t,i,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let a=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[c].uniforms.direction.value=n.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=n.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this._fsQuad.render(e),a=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=o}_getSeparableBlurMaterial(e){let t=[],i=e/3;for(let o=0;o<e;o++)t.push(.39894*Math.exp(-.5*o*o/(i*i))/i);let s=[],r=[];for(let o=1;o<e;o+=2){let a=t[o],c=o+1<e?t[o+1]:0,l=a+c;s.push((o*a+(o+1)*c)/l),r.push(l)}return new Ht({defines:{KERNEL_PAIRS:s.length},uniforms:{colorTexture:{value:null},invSize:{value:new Ee(.5,.5)},direction:{value:new Ee(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:s},gaussianWeights:{value:r}},vertexShader:`

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

				}`})}_getCompositeMaterial(e){return new Ht({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

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

				}`})}};$o.BlurDirectionX=new Ee(1,0);$o.BlurDirectionY=new Ee(0,1);var dc={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};var lh=class extends hi{constructor(){super(),this.isOutputPass=!0,this.uniforms=Fi.clone(dc.uniforms),this.material=new Do({name:dc.name,uniforms:this.uniforms,vertexShader:dc.vertexShader,fragmentShader:dc.fragmentShader}),this._fsQuad=new $s(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Je.getTransfer(this._outputColorSpace)===St&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Ka?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Za?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Ja?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===ja?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Pr?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===ec?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Qa&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};function Ks(n,e=!1){let t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},o={},a=n[0].morphTargetsRelative,c=new vt;c.morphTargetsRelative=a;let l=0;for(let u=0;u<n.length;++u){let h=n[u],f=0,d=0;if(t!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let g in h.attributes){if(!i.has(g))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+g+'" attribute exists among all geometries, or in none of them.'),null;r[g]===void 0&&(r[g]=[]),r[g].push(h.attributes[g]),f++}if(f!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(a!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let g in h.morphAttributes){if(!s.has(g))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;if(h.morphAttributes[g].length!==n[0].morphAttributes[g].length)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have the same number of morph targets for the "'+g+'" morph attribute.'),null;o[g]===void 0&&(o[g]=[]),o[g].push(h.morphAttributes[g]),d++}if(d!==s.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of morph attributes."),null;if(e){let g;if(t)g=h.index.count;else if(h.attributes.position!==void 0)g=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,g,u),l+=g}}if(t){let u=0,h=[];for(let f=0;f<n.length;++f){let d=n[f].index;for(let g=0;g<d.count;++g)h.push(d.getX(g)+u);u+=n[f].attributes.position.count}c.setIndex(h)}for(let u in r){let h=R_(r[u]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;c.setAttribute(u,h)}for(let u in o){let h=o[u][0].length;if(h!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[u]=[];for(let f=0;f<h;++f){let d=[];for(let _=0;_<o[u].length;++_)d.push(o[u][_][f]);let g=R_(d);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;c.morphAttributes[u].push(g)}}}return c}function R_(n){let e,t,i,s=-1,r=0;for(let l=0;l<n.length;++l){let u=n[l];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=u.normalized),i!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=u.gpuType),s!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.count*t}let o=new e(r),a=new gt(o,t,i),c=0;for(let l=0;l<n.length;++l){let u=n[l];if(u.isInterleavedBufferAttribute){let h=c/t;for(let f=0,d=u.count;f<d;f++)for(let g=0;g<t;g++){let _=u.getComponent(f,g);a.setComponent(f+h,g,_)}}else o.set(u.array,c);c+=u.count*t}return s!==void 0&&(a.gpuType=s),a}function Yd(n,e){if(e===Sd)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),n;if(e===Go||e===ac){let t=n.getIndex();if(t===null){let r=[],o=n.getAttribute("position");if(o!==void 0){for(let a=0;a<o.count;a++)r.push(a);n.setIndex(r),t=n.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),n}let i=t.count-2,s=[];if(e===Go)for(let r=1;r<=i;r++)s.push(t.getX(0)),s.push(t.getX(r)),s.push(t.getX(r+1));else for(let r=0;r<i;r++)r%2===0?(s.push(t.getX(r)),s.push(t.getX(r+1)),s.push(t.getX(r+2))):(s.push(t.getX(r+2)),s.push(t.getX(r+1)),s.push(t.getX(r)));return s.length/3!==i&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),n.setIndex(s),n.clearGroups(),n}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),n}var $d=class{constructor(){this.encoder=new TextEncoder,this._pieces=[],this._parts=[]}append_buffer(e){this.flush(),this._parts.push(e)}append(e){this._pieces.push(e)}flush(){if(this._pieces.length>0){let e=new Uint8Array(this._pieces);this._parts.push(e),this._pieces=[]}}toArrayBuffer(){let e=[];for(let t of this._parts)e.push(t);return b1(e).buffer}};function b1(n){let e=0;for(let s of n)e+=s.byteLength;let t=new Uint8Array(e),i=0;for(let s of n){let r=new Uint8Array(s.buffer,s.byteOffset,s.byteLength);t.set(r,i),i+=s.byteLength}return t}function Jd(n){return new Kd(n).unpack()}function jd(n){let e=new Zd,t=e.pack(n);return t instanceof Promise?t.then(()=>e.getBuffer()):e.getBuffer()}var Kd=class{constructor(e){this.index=0,this.dataBuffer=e,this.dataView=new Uint8Array(this.dataBuffer),this.length=this.dataBuffer.byteLength}unpack(){let e=this.unpack_uint8();if(e<128)return e;if((e^224)<32)return(e^224)-32;let t;if((t=e^160)<=15)return this.unpack_raw(t);if((t=e^176)<=15)return this.unpack_string(t);if((t=e^144)<=15)return this.unpack_array(t);if((t=e^128)<=15)return this.unpack_map(t);switch(e){case 192:return null;case 193:return;case 194:return!1;case 195:return!0;case 202:return this.unpack_float();case 203:return this.unpack_double();case 204:return this.unpack_uint8();case 205:return this.unpack_uint16();case 206:return this.unpack_uint32();case 207:return this.unpack_uint64();case 208:return this.unpack_int8();case 209:return this.unpack_int16();case 210:return this.unpack_int32();case 211:return this.unpack_int64();case 212:return;case 213:return;case 214:return;case 215:return;case 216:return t=this.unpack_uint16(),this.unpack_string(t);case 217:return t=this.unpack_uint32(),this.unpack_string(t);case 218:return t=this.unpack_uint16(),this.unpack_raw(t);case 219:return t=this.unpack_uint32(),this.unpack_raw(t);case 220:return t=this.unpack_uint16(),this.unpack_array(t);case 221:return t=this.unpack_uint32(),this.unpack_array(t);case 222:return t=this.unpack_uint16(),this.unpack_map(t);case 223:return t=this.unpack_uint32(),this.unpack_map(t)}}unpack_uint8(){let e=this.dataView[this.index]&255;return this.index++,e}unpack_uint16(){let e=this.read(2),t=(e[0]&255)*256+(e[1]&255);return this.index+=2,t}unpack_uint32(){let e=this.read(4),t=((e[0]*256+e[1])*256+e[2])*256+e[3];return this.index+=4,t}unpack_uint64(){let e=this.read(8),t=((((((e[0]*256+e[1])*256+e[2])*256+e[3])*256+e[4])*256+e[5])*256+e[6])*256+e[7];return this.index+=8,t}unpack_int8(){let e=this.unpack_uint8();return e<128?e:e-256}unpack_int16(){let e=this.unpack_uint16();return e<32768?e:e-65536}unpack_int32(){let e=this.unpack_uint32();return e<2**31?e:e-2**32}unpack_int64(){let e=this.unpack_uint64();return e<2**63?e:e-2**64}unpack_raw(e){if(this.length<this.index+e)throw new Error(`BinaryPackFailure: index is out of range ${this.index} ${e} ${this.length}`);let t=this.dataBuffer.slice(this.index,this.index+e);return this.index+=e,t}unpack_string(e){let t=this.read(e),i=0,s="",r,o;for(;i<e;)r=t[i],r<160?(o=r,i++):(r^192)<32?(o=(r&31)<<6|t[i+1]&63,i+=2):(r^224)<16?(o=(r&15)<<12|(t[i+1]&63)<<6|t[i+2]&63,i+=3):(o=(r&7)<<18|(t[i+1]&63)<<12|(t[i+2]&63)<<6|t[i+3]&63,i+=4),s+=String.fromCodePoint(o);return this.index+=e,s}unpack_array(e){let t=new Array(e);for(let i=0;i<e;i++)t[i]=this.unpack();return t}unpack_map(e){let t={};for(let i=0;i<e;i++){let s=this.unpack();t[s]=this.unpack()}return t}unpack_float(){let e=this.unpack_uint32(),t=e>>31,i=(e>>23&255)-127,s=e&8388607|8388608;return(t===0?1:-1)*s*2**(i-23)}unpack_double(){let e=this.unpack_uint32(),t=this.unpack_uint32(),i=e>>31,s=(e>>20&2047)-1023,o=(e&1048575|1048576)*2**(s-20)+t*2**(s-52);return(i===0?1:-1)*o}read(e){let t=this.index;if(t+e<=this.length)return this.dataView.subarray(t,t+e);throw new Error("BinaryPackFailure: read index out of range")}},Zd=class{getBuffer(){return this._bufferBuilder.toArrayBuffer()}pack(e){if(typeof e=="string")this.pack_string(e);else if(typeof e=="number")Math.floor(e)===e?this.pack_integer(e):this.pack_double(e);else if(typeof e=="boolean")e===!0?this._bufferBuilder.append(195):e===!1&&this._bufferBuilder.append(194);else if(e===void 0)this._bufferBuilder.append(192);else if(typeof e=="object")if(e===null)this._bufferBuilder.append(192);else{let t=e.constructor;if(e instanceof Array){let i=this.pack_array(e);if(i instanceof Promise)return i.then(()=>this._bufferBuilder.flush())}else if(e instanceof ArrayBuffer)this.pack_bin(new Uint8Array(e));else if("BYTES_PER_ELEMENT"in e){let i=e;this.pack_bin(new Uint8Array(i.buffer,i.byteOffset,i.byteLength))}else if(e instanceof Date)this.pack_string(e.toString());else{if(e instanceof Blob)return e.arrayBuffer().then(i=>{this.pack_bin(new Uint8Array(i)),this._bufferBuilder.flush()});if(t==Object||t.toString().startsWith("class")){let i=this.pack_object(e);if(i instanceof Promise)return i.then(()=>this._bufferBuilder.flush())}else throw new Error(`Type "${t.toString()}" not yet supported`)}}else throw new Error(`Type "${typeof e}" not yet supported`);this._bufferBuilder.flush()}pack_bin(e){let t=e.length;if(t<=15)this.pack_uint8(160+t);else if(t<=65535)this._bufferBuilder.append(218),this.pack_uint16(t);else if(t<=4294967295)this._bufferBuilder.append(219),this.pack_uint32(t);else throw new Error("Invalid length");this._bufferBuilder.append_buffer(e)}pack_string(e){let t=this._textEncoder.encode(e),i=t.length;if(i<=15)this.pack_uint8(176+i);else if(i<=65535)this._bufferBuilder.append(216),this.pack_uint16(i);else if(i<=4294967295)this._bufferBuilder.append(217),this.pack_uint32(i);else throw new Error("Invalid length");this._bufferBuilder.append_buffer(t)}pack_array(e){let t=e.length;if(t<=15)this.pack_uint8(144+t);else if(t<=65535)this._bufferBuilder.append(220),this.pack_uint16(t);else if(t<=4294967295)this._bufferBuilder.append(221),this.pack_uint32(t);else throw new Error("Invalid length");let i=s=>{if(s<t){let r=this.pack(e[s]);return r instanceof Promise?r.then(()=>i(s+1)):i(s+1)}};return i(0)}pack_integer(e){if(e>=-32&&e<=127)this._bufferBuilder.append(e&255);else if(e>=0&&e<=255)this._bufferBuilder.append(204),this.pack_uint8(e);else if(e>=-128&&e<=127)this._bufferBuilder.append(208),this.pack_int8(e);else if(e>=0&&e<=65535)this._bufferBuilder.append(205),this.pack_uint16(e);else if(e>=-32768&&e<=32767)this._bufferBuilder.append(209),this.pack_int16(e);else if(e>=0&&e<=4294967295)this._bufferBuilder.append(206),this.pack_uint32(e);else if(e>=-2147483648&&e<=2147483647)this._bufferBuilder.append(210),this.pack_int32(e);else if(e>=-9223372036854776e3&&e<=9223372036854776e3)this._bufferBuilder.append(211),this.pack_int64(e);else if(e>=0&&e<=18446744073709552e3)this._bufferBuilder.append(207),this.pack_uint64(e);else throw new Error("Invalid integer")}pack_double(e){let t=0;e<0&&(t=1,e=-e);let i=Math.floor(Math.log(e)/Math.LN2),s=e/2**i-1,r=Math.floor(s*2**52),o=2**32,a=t<<31|i+1023<<20|r/o&1048575,c=r%o;this._bufferBuilder.append(203),this.pack_int32(a),this.pack_int32(c)}pack_object(e){let t=Object.keys(e),i=t.length;if(i<=15)this.pack_uint8(128+i);else if(i<=65535)this._bufferBuilder.append(222),this.pack_uint16(i);else if(i<=4294967295)this._bufferBuilder.append(223),this.pack_uint32(i);else throw new Error("Invalid length");let s=r=>{if(r<t.length){let o=t[r];if(e.hasOwnProperty(o)){this.pack(o);let a=this.pack(e[o]);if(a instanceof Promise)return a.then(()=>s(r+1))}return s(r+1)}};return s(0)}pack_uint8(e){this._bufferBuilder.append(e)}pack_uint16(e){this._bufferBuilder.append(e>>8),this._bufferBuilder.append(e&255)}pack_uint32(e){let t=e&4294967295;this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255)}pack_uint64(e){let t=e/4294967296,i=e%2**32;this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255),this._bufferBuilder.append((i&4278190080)>>>24),this._bufferBuilder.append((i&16711680)>>>16),this._bufferBuilder.append((i&65280)>>>8),this._bufferBuilder.append(i&255)}pack_int8(e){this._bufferBuilder.append(e&255)}pack_int16(e){this._bufferBuilder.append((e&65280)>>8),this._bufferBuilder.append(e&255)}pack_int32(e){this._bufferBuilder.append(e>>>24&255),this._bufferBuilder.append((e&16711680)>>>16),this._bufferBuilder.append((e&65280)>>>8),this._bufferBuilder.append(e&255)}pack_int64(e){let t=Math.floor(e/4294967296),i=e%2**32;this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255),this._bufferBuilder.append((i&4278190080)>>>24),this._bufferBuilder.append((i&16711680)>>>16),this._bufferBuilder.append((i&65280)>>>8),this._bufferBuilder.append(i&255)}constructor(){this._bufferBuilder=new $d,this._textEncoder=new TextEncoder}};var P_=!0,I_=!0;function Ko(n,e,t){let i=n.match(e);return i&&i.length>=t&&parseFloat(i[t],10)}function Zi(n,e,t){if(!n.RTCPeerConnection)return;if(!Object.getOwnPropertyDescriptor(EventTarget.prototype,"addEventListener").writable){pc("Unable to polyfill events");return}let s=n.RTCPeerConnection.prototype,r=s.addEventListener;s.addEventListener=function(a,c){if(a!==e)return r.apply(this,arguments);let l=u=>{let h=t(u);h&&(c.handleEvent?c.handleEvent(h):c(h))};return this._eventMap=this._eventMap||{},this._eventMap[e]||(this._eventMap[e]=new Map),this._eventMap[e].set(c,l),r.apply(this,[a,l])};let o=s.removeEventListener;s.removeEventListener=function(a,c){if(a!==e||!this._eventMap||!this._eventMap[e])return o.apply(this,arguments);if(!this._eventMap[e].has(c))return o.apply(this,arguments);let l=this._eventMap[e].get(c);return this._eventMap[e].delete(c),this._eventMap[e].size===0&&delete this._eventMap[e],Object.keys(this._eventMap).length===0&&delete this._eventMap,o.apply(this,[a,l])},Object.defineProperty(s,"on"+e,{get(){return this["_on"+e]},set(a){this["_on"+e]&&(this.removeEventListener(e,this["_on"+e]),delete this["_on"+e]),a&&this.addEventListener(e,this["_on"+e]=a)},enumerable:!0,configurable:!0})}function L_(n){return typeof n!="boolean"?new Error("Argument type: "+typeof n+". Please use a boolean."):(P_=n,n?"adapter.js logging disabled":"adapter.js logging enabled")}function D_(n){return typeof n!="boolean"?new Error("Argument type: "+typeof n+". Please use a boolean."):(I_=!n,"adapter.js deprecation warnings "+(n?"disabled":"enabled"))}function pc(){if(typeof window=="object"){if(P_)return;typeof console<"u"&&typeof console.log=="function"&&console.log.apply(console,arguments)}}function Zo(n,e){I_&&console.warn(n+" is deprecated, please use "+e+" instead.")}function N_(n){let e={browser:null,version:null};if(typeof n>"u"||!n.navigator||!n.navigator.userAgent)return e.browser="Not a browser.",e;let{navigator:t}=n;if(t.userAgentData&&t.userAgentData.brands){let i=t.userAgentData.brands.find(s=>s.brand==="Chromium");if(i){let s=parseInt(i.version,10);if(s>=90)return{browser:"chrome",version:s}}}if(t.mozGetUserMedia)e.browser="firefox",e.version=parseInt(Ko(t.userAgent,/Firefox\/(\d+)\./,1));else if(t.webkitGetUserMedia||n.isSecureContext===!1&&n.webkitRTCPeerConnection)e.browser="chrome",e.version=parseInt(Ko(t.userAgent,/Chrom(e|ium)\/(\d+)\./,2))||null;else if(n.RTCPeerConnection&&t.userAgent.match(/AppleWebKit\/(\d+)\./))e.browser="safari",e.version=parseInt(Ko(t.userAgent,/AppleWebKit\/(\d+)\./,1)),e.supportsUnifiedPlan=n.RTCRtpTransceiver&&"currentDirection"in n.RTCRtpTransceiver.prototype,e._safariVersion=Ko(t.userAgent,/Version\/(\d+(\.?\d+))/,1);else return e.browser="Not a supported browser.",e;return e}function C_(n){return Object.prototype.toString.call(n)==="[object Object]"}function ep(n){return C_(n)?Object.keys(n).reduce(function(e,t){let i=C_(n[t]),s=i?ep(n[t]):n[t],r=i&&!Object.keys(s).length;return s===void 0||r?e:Object.assign(e,{[t]:s})},{}):n}function Qd(n,e,t){!e||t.has(e.id)||(t.set(e.id,e),Object.keys(e).forEach(i=>{i.endsWith("Id")?Qd(n,n.get(e[i]),t):i.endsWith("Ids")&&e[i].forEach(s=>{Qd(n,n.get(s),t)})}))}function tp(n,e,t){let i=t?"outbound-rtp":"inbound-rtp",s=new Map;if(e===null)return s;let r=[];return n.forEach(o=>{o.type==="track"&&o.trackIdentifier===e.id&&r.push(o)}),r.forEach(o=>{n.forEach(a=>{a.type===i&&a.trackId===o.id&&Qd(n,a,s)})}),s}var fh={};al(fh,{fixNegotiationNeeded:()=>ap,shimAddTrackRemoveTrack:()=>op,shimAddTrackRemoveTrackWithNative:()=>U_,shimGetSendersWithDtmf:()=>sp,shimGetUserMedia:()=>uh,shimMediaStream:()=>np,shimOnTrack:()=>ip,shimPeerConnection:()=>hh,shimSenderReceiverGetStats:()=>rp});var O_=pc;function uh(n,e){if(e.version>=64)return;let t=n&&n.navigator;if(!t.mediaDevices)return;let i=function(a){if(typeof a!="object"||a.mandatory||a.optional)return a;let c={};return Object.keys(a).forEach(l=>{if(l==="require"||l==="advanced"||l==="mediaSource")return;let u=typeof a[l]=="object"?a[l]:{ideal:a[l]};u.exact!==void 0&&typeof u.exact=="number"&&(u.min=u.max=u.exact);let h=function(f,d){return f?f+d.charAt(0).toUpperCase()+d.slice(1):d==="deviceId"?"sourceId":d};if(u.ideal!==void 0){c.optional=c.optional||[];let f={};typeof u.ideal=="number"?(f[h("min",l)]=u.ideal,c.optional.push(f),f={},f[h("max",l)]=u.ideal,c.optional.push(f)):(f[h("",l)]=u.ideal,c.optional.push(f))}u.exact!==void 0&&typeof u.exact!="number"?(c.mandatory=c.mandatory||{},c.mandatory[h("",l)]=u.exact):["min","max"].forEach(f=>{u[f]!==void 0&&(c.mandatory=c.mandatory||{},c.mandatory[h(f,l)]=u[f])})}),a.advanced&&(c.optional=(c.optional||[]).concat(a.advanced)),c},s=function(a,c){if(e.version>=61)return c(a);if(a=JSON.parse(JSON.stringify(a)),a&&typeof a.audio=="object"){let l=function(u,h,f){h in u&&!(f in u)&&(u[f]=u[h],delete u[h])};a=JSON.parse(JSON.stringify(a)),l(a.audio,"autoGainControl","googAutoGainControl"),l(a.audio,"noiseSuppression","googNoiseSuppression"),a.audio=i(a.audio)}if(a&&typeof a.video=="object"){let l=a.video.facingMode;l=l&&(typeof l=="object"?l:{ideal:l});let u=e.version<66;if(l&&(l.exact==="user"||l.exact==="environment"||l.ideal==="user"||l.ideal==="environment")&&!(t.mediaDevices.getSupportedConstraints&&t.mediaDevices.getSupportedConstraints().facingMode&&!u)){delete a.video.facingMode;let h;if(l.exact==="environment"||l.ideal==="environment"?h=["back","rear"]:(l.exact==="user"||l.ideal==="user")&&(h=["front"]),h)return t.mediaDevices.enumerateDevices().then(f=>{f=f.filter(g=>g.kind==="videoinput");let d=f.find(g=>h.some(_=>g.label.toLowerCase().includes(_)));return!d&&f.length&&h.includes("back")&&(d=f[f.length-1]),d&&(a.video.deviceId=l.exact?{exact:d.deviceId}:{ideal:d.deviceId}),a.video=i(a.video),O_("chrome: "+JSON.stringify(a)),c(a)})}a.video=i(a.video)}return O_("chrome: "+JSON.stringify(a)),c(a)},r=function(a){return e.version>=64?a:{name:{PermissionDeniedError:"NotAllowedError",PermissionDismissedError:"NotAllowedError",InvalidStateError:"NotAllowedError",DevicesNotFoundError:"NotFoundError",ConstraintNotSatisfiedError:"OverconstrainedError",TrackStartError:"NotReadableError",MediaDeviceFailedDueToShutdown:"NotAllowedError",MediaDeviceKillSwitchOn:"NotAllowedError",TabCaptureError:"AbortError",ScreenCaptureError:"AbortError",DeviceCaptureError:"AbortError"}[a.name]||a.name,message:a.message,constraint:a.constraint||a.constraintName,toString(){return this.name+(this.message&&": ")+this.message}}},o=function(a,c,l){s(a,u=>{t.webkitGetUserMedia(u,c,h=>{l&&l(r(h))})})};if(t.getUserMedia=o.bind(t),t.mediaDevices.getUserMedia){let a=t.mediaDevices.getUserMedia.bind(t.mediaDevices);t.mediaDevices.getUserMedia=function(c){return s(c,l=>a(l).then(u=>{if(l.audio&&!u.getAudioTracks().length||l.video&&!u.getVideoTracks().length)throw u.getTracks().forEach(h=>{h.stop()}),new DOMException("","NotFoundError");return u},u=>Promise.reject(r(u))))}}}function np(n){n.MediaStream=n.MediaStream||n.webkitMediaStream}function ip(n,e){if(!(e.version>102))if(typeof n=="object"&&n.RTCPeerConnection&&!("ontrack"in n.RTCPeerConnection.prototype)){Object.defineProperty(n.RTCPeerConnection.prototype,"ontrack",{get(){return this._ontrack},set(i){this._ontrack&&this.removeEventListener("track",this._ontrack),this.addEventListener("track",this._ontrack=i)},enumerable:!0,configurable:!0});let t=n.RTCPeerConnection.prototype.setRemoteDescription;n.RTCPeerConnection.prototype.setRemoteDescription=function(){return this._ontrackpoly||(this._ontrackpoly=s=>{s.stream.addEventListener("addtrack",r=>{let o;n.RTCPeerConnection.prototype.getReceivers?o=this.getReceivers().find(c=>c.track&&c.track.id===r.track.id):o={track:r.track};let a=new Event("track");a.track=r.track,a.receiver=o,a.transceiver={receiver:o},a.streams=[s.stream],this.dispatchEvent(a)}),s.stream.getTracks().forEach(r=>{let o;n.RTCPeerConnection.prototype.getReceivers?o=this.getReceivers().find(c=>c.track&&c.track.id===r.id):o={track:r};let a=new Event("track");a.track=r,a.receiver=o,a.transceiver={receiver:o},a.streams=[s.stream],this.dispatchEvent(a)})},this.addEventListener("addstream",this._ontrackpoly)),t.apply(this,arguments)}}else Zi(n,"track",t=>(t.transceiver||Object.defineProperty(t,"transceiver",{value:{receiver:t.receiver}}),t))}function sp(n){if(typeof n=="object"&&n.RTCPeerConnection&&!("getSenders"in n.RTCPeerConnection.prototype)&&"createDTMFSender"in n.RTCPeerConnection.prototype){let e=function(s,r){return{track:r,get dtmf(){return this._dtmf===void 0&&(r.kind==="audio"?this._dtmf=s.createDTMFSender(r):this._dtmf=null),this._dtmf},_pc:s}};if(!n.RTCPeerConnection.prototype.getSenders){n.RTCPeerConnection.prototype.getSenders=function(){return this._senders=this._senders||[],this._senders.slice()};let s=n.RTCPeerConnection.prototype.addTrack;n.RTCPeerConnection.prototype.addTrack=function(a,c){let l=s.apply(this,arguments);return l||(l=e(this,a),this._senders.push(l)),l};let r=n.RTCPeerConnection.prototype.removeTrack;n.RTCPeerConnection.prototype.removeTrack=function(a){r.apply(this,arguments);let c=this._senders.indexOf(a);c!==-1&&this._senders.splice(c,1)}}let t=n.RTCPeerConnection.prototype.addStream;n.RTCPeerConnection.prototype.addStream=function(r){this._senders=this._senders||[],t.apply(this,[r]),r.getTracks().forEach(o=>{this._senders.push(e(this,o))})};let i=n.RTCPeerConnection.prototype.removeStream;n.RTCPeerConnection.prototype.removeStream=function(r){this._senders=this._senders||[],i.apply(this,[r]),r.getTracks().forEach(o=>{let a=this._senders.find(c=>c.track===o);a&&this._senders.splice(this._senders.indexOf(a),1)})}}else if(typeof n=="object"&&n.RTCPeerConnection&&"getSenders"in n.RTCPeerConnection.prototype&&"createDTMFSender"in n.RTCPeerConnection.prototype&&n.RTCRtpSender&&!("dtmf"in n.RTCRtpSender.prototype)){let e=n.RTCPeerConnection.prototype.getSenders;n.RTCPeerConnection.prototype.getSenders=function(){let i=e.apply(this,[]);return i.forEach(s=>s._pc=this),i},Object.defineProperty(n.RTCRtpSender.prototype,"dtmf",{get(){return this._dtmf===void 0&&(this.track.kind==="audio"?this._dtmf=this._pc.createDTMFSender(this.track):this._dtmf=null),this._dtmf}})}}function rp(n,e){if(e.version>=67||!(typeof n=="object"&&n.RTCPeerConnection&&n.RTCRtpSender&&n.RTCRtpReceiver))return;if(!("getStats"in n.RTCRtpSender.prototype)){let i=n.RTCPeerConnection.prototype.getSenders;i&&(n.RTCPeerConnection.prototype.getSenders=function(){let o=i.apply(this,[]);return o.forEach(a=>a._pc=this),o});let s=n.RTCPeerConnection.prototype.addTrack;s&&(n.RTCPeerConnection.prototype.addTrack=function(){let o=s.apply(this,arguments);return o._pc=this,o}),n.RTCRtpSender.prototype.getStats=function(){let o=this;return this._pc.getStats().then(a=>tp(a,o.track,!0))}}if(!("getStats"in n.RTCRtpReceiver.prototype)){let i=n.RTCPeerConnection.prototype.getReceivers;i&&(n.RTCPeerConnection.prototype.getReceivers=function(){let r=i.apply(this,[]);return r.forEach(o=>o._pc=this),r}),Zi(n,"track",s=>(s.receiver._pc=s.srcElement,s)),n.RTCRtpReceiver.prototype.getStats=function(){let r=this;return this._pc.getStats().then(o=>tp(o,r.track,!1))}}if(!("getStats"in n.RTCRtpSender.prototype&&"getStats"in n.RTCRtpReceiver.prototype))return;let t=n.RTCPeerConnection.prototype.getStats;n.RTCPeerConnection.prototype.getStats=function(){if(arguments.length>0&&arguments[0]instanceof n.MediaStreamTrack){let s=arguments[0],r,o,a;return this.getSenders().forEach(c=>{c.track===s&&(r?a=!0:r=c)}),this.getReceivers().forEach(c=>(c.track===s&&(o?a=!0:o=c),c.track===s)),a||r&&o?Promise.reject(new DOMException("There are more than one sender or receiver for the track.","InvalidAccessError")):r?r.getStats():o?o.getStats():Promise.reject(new DOMException("There is no sender or receiver for the track.","InvalidAccessError"))}return t.apply(this,arguments)}}function U_(n){n.RTCPeerConnection.prototype.getLocalStreams=function(){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},Object.keys(this._shimmedLocalStreams).map(o=>this._shimmedLocalStreams[o][0])};let e=n.RTCPeerConnection.prototype.addTrack;n.RTCPeerConnection.prototype.addTrack=function(o,a){if(!a)return e.apply(this,arguments);this._shimmedLocalStreams=this._shimmedLocalStreams||{};let c=e.apply(this,arguments);return this._shimmedLocalStreams[a.id]?this._shimmedLocalStreams[a.id].indexOf(c)===-1&&this._shimmedLocalStreams[a.id].push(c):this._shimmedLocalStreams[a.id]=[a,c],c};let t=n.RTCPeerConnection.prototype.addStream;n.RTCPeerConnection.prototype.addStream=function(o){this._shimmedLocalStreams=this._shimmedLocalStreams||{},o.getTracks().forEach(l=>{if(this.getSenders().find(h=>h.track===l))throw new DOMException("Track already exists.","InvalidAccessError")});let a=this.getSenders();t.apply(this,arguments);let c=this.getSenders().filter(l=>a.indexOf(l)===-1);this._shimmedLocalStreams[o.id]=[o].concat(c)};let i=n.RTCPeerConnection.prototype.removeStream;n.RTCPeerConnection.prototype.removeStream=function(o){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},delete this._shimmedLocalStreams[o.id],i.apply(this,arguments)};let s=n.RTCPeerConnection.prototype.removeTrack;n.RTCPeerConnection.prototype.removeTrack=function(o){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},o&&Object.keys(this._shimmedLocalStreams).forEach(a=>{let c=this._shimmedLocalStreams[a].indexOf(o);c!==-1&&this._shimmedLocalStreams[a].splice(c,1),this._shimmedLocalStreams[a].length===1&&delete this._shimmedLocalStreams[a]}),s.apply(this,arguments)}}function op(n,e){if(!n.RTCPeerConnection)return;if(n.RTCPeerConnection.prototype.addTrack&&e.version>=65)return U_(n);let t=n.RTCPeerConnection.prototype.getLocalStreams;n.RTCPeerConnection.prototype.getLocalStreams=function(){let u=t.apply(this);return this._reverseStreams=this._reverseStreams||{},u.map(h=>this._reverseStreams[h.id])};let i=n.RTCPeerConnection.prototype.addStream;n.RTCPeerConnection.prototype.addStream=function(u){if(this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{},u.getTracks().forEach(h=>{if(this.getSenders().find(d=>d.track===h))throw new DOMException("Track already exists.","InvalidAccessError")}),!this._reverseStreams[u.id]){let h=new n.MediaStream(u.getTracks());this._streams[u.id]=h,this._reverseStreams[h.id]=u,u=h}i.apply(this,[u])};let s=n.RTCPeerConnection.prototype.removeStream;n.RTCPeerConnection.prototype.removeStream=function(u){this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{},s.apply(this,[this._streams[u.id]||u]),delete this._reverseStreams[this._streams[u.id]?this._streams[u.id].id:u.id],delete this._streams[u.id]},n.RTCPeerConnection.prototype.addTrack=function(u,h){if(this.signalingState==="closed")throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.","InvalidStateError");let f=[].slice.call(arguments,1);if(f.length!==1||!f[0].getTracks().find(_=>_===u))throw new DOMException("The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.","NotSupportedError");if(this.getSenders().find(_=>_.track===u))throw new DOMException("Track already exists.","InvalidAccessError");this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{};let g=this._streams[h.id];if(g)g.addTrack(u),Promise.resolve().then(()=>{this.dispatchEvent(new Event("negotiationneeded"))});else{let _=new n.MediaStream([u]);this._streams[h.id]=_,this._reverseStreams[_.id]=h,this.addStream(_)}return this.getSenders().find(_=>_.track===u)};function r(l,u){let h=u.sdp;return Object.keys(l._reverseStreams||[]).forEach(f=>{let d=l._reverseStreams[f],g=l._streams[d.id];h=h.replace(new RegExp(g.id,"g"),d.id)}),new RTCSessionDescription({type:u.type,sdp:h})}function o(l,u){let h=u.sdp;return Object.keys(l._reverseStreams||[]).forEach(f=>{let d=l._reverseStreams[f],g=l._streams[d.id];h=h.replace(new RegExp(d.id,"g"),g.id)}),new RTCSessionDescription({type:u.type,sdp:h})}["createOffer","createAnswer"].forEach(function(l){let u=n.RTCPeerConnection.prototype[l],h={[l](){let f=arguments;return arguments.length&&typeof arguments[0]=="function"?u.apply(this,[g=>{let _=r(this,g);f[0].apply(null,[_])},g=>{f[1]&&f[1].apply(null,g)},arguments[2]]):u.apply(this,arguments).then(g=>r(this,g))}};n.RTCPeerConnection.prototype[l]=h[l]});let a=n.RTCPeerConnection.prototype.setLocalDescription;n.RTCPeerConnection.prototype.setLocalDescription=function(){return!arguments.length||!arguments[0].type?a.apply(this,arguments):(arguments[0]=o(this,arguments[0]),a.apply(this,arguments))};let c=Object.getOwnPropertyDescriptor(n.RTCPeerConnection.prototype,"localDescription");Object.defineProperty(n.RTCPeerConnection.prototype,"localDescription",{get(){let l=c.get.apply(this);return l.type===""?l:r(this,l)}}),n.RTCPeerConnection.prototype.removeTrack=function(u){if(this.signalingState==="closed")throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.","InvalidStateError");if(!u._pc)throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.","TypeError");if(!(u._pc===this))throw new DOMException("Sender was not created by this connection.","InvalidAccessError");this._streams=this._streams||{};let f;Object.keys(this._streams).forEach(d=>{this._streams[d].getTracks().find(_=>u.track===_)&&(f=this._streams[d])}),f&&(f.getTracks().length===1?this.removeStream(this._reverseStreams[f.id]):f.removeTrack(u.track),this.dispatchEvent(new Event("negotiationneeded")))}}function hh(n,e){!n.RTCPeerConnection&&n.webkitRTCPeerConnection&&(n.RTCPeerConnection=n.webkitRTCPeerConnection),n.RTCPeerConnection&&e.version<53&&["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach(function(t){let i=n.RTCPeerConnection.prototype[t],s={[t](){return arguments[0]=new(t==="addIceCandidate"?n.RTCIceCandidate:n.RTCSessionDescription)(arguments[0]),i.apply(this,arguments)}};n.RTCPeerConnection.prototype[t]=s[t]})}function ap(n,e){e.version>102||Zi(n,"negotiationneeded",t=>{let i=t.target;if(!((e.version<72||i.getConfiguration&&i.getConfiguration().sdpSemantics==="plan-b")&&i.signalingState!=="stable"))return t})}var mh={};al(mh,{shimAddTransceiver:()=>pp,shimCreateAnswer:()=>_p,shimCreateOffer:()=>gp,shimGetDisplayMedia:()=>F_,shimGetParameters:()=>mp,shimGetStats:()=>lp,shimGetUserMedia:()=>dh,shimOnTrack:()=>cp,shimPeerConnection:()=>ph,shimRTCDataChannel:()=>dp,shimReceiverGetStats:()=>hp,shimRemoveStream:()=>fp,shimSenderGetStats:()=>up});function dh(n,e){let t=n&&n.navigator;if(!t.mediaDevices)return;let i=n&&n.MediaStreamTrack;if(t.getUserMedia=function(s,r,o){Zo("navigator.getUserMedia","navigator.mediaDevices.getUserMedia"),t.mediaDevices.getUserMedia(s).then(r,o)},!(e.version>55&&"autoGainControl"in t.mediaDevices.getSupportedConstraints())){let s=function(o,a,c){a in o&&!(c in o)&&(o[c]=o[a],delete o[a])},r=t.mediaDevices.getUserMedia.bind(t.mediaDevices);if(t.mediaDevices.getUserMedia=function(o){return typeof o=="object"&&typeof o.audio=="object"&&(o=JSON.parse(JSON.stringify(o)),s(o.audio,"autoGainControl","mozAutoGainControl"),s(o.audio,"noiseSuppression","mozNoiseSuppression")),r(o)},i&&i.prototype.getSettings){let o=i.prototype.getSettings;i.prototype.getSettings=function(){let a=o.apply(this,arguments);return s(a,"mozAutoGainControl","autoGainControl"),s(a,"mozNoiseSuppression","noiseSuppression"),a}}if(i&&i.prototype.applyConstraints){let o=i.prototype.applyConstraints;i.prototype.applyConstraints=function(a){return this.kind==="audio"&&typeof a=="object"&&(a=JSON.parse(JSON.stringify(a)),s(a,"autoGainControl","mozAutoGainControl"),s(a,"noiseSuppression","mozNoiseSuppression")),o.apply(this,[a])}}}}function F_(n,e){n.navigator.mediaDevices&&(n.navigator.mediaDevices&&"getDisplayMedia"in n.navigator.mediaDevices||(n.navigator.mediaDevices.getDisplayMedia=function(i){if(!(i&&i.video)){let s=new DOMException("getDisplayMedia without video constraints is undefined");return s.name="NotFoundError",s.code=8,Promise.reject(s)}return i.video===!0?i.video={mediaSource:e}:i.video.mediaSource=e,n.navigator.mediaDevices.getUserMedia(i)}))}function cp(n){typeof n=="object"&&n.RTCTrackEvent&&"receiver"in n.RTCTrackEvent.prototype&&!("transceiver"in n.RTCTrackEvent.prototype)&&Object.defineProperty(n.RTCTrackEvent.prototype,"transceiver",{get(){return{receiver:this.receiver}}})}function ph(n,e){typeof n!="object"||!(n.RTCPeerConnection||n.mozRTCPeerConnection)||(!n.RTCPeerConnection&&n.mozRTCPeerConnection&&(n.RTCPeerConnection=n.mozRTCPeerConnection),e.version<53&&["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach(function(t){let i=n.RTCPeerConnection.prototype[t],s={[t](){return arguments[0]=new(t==="addIceCandidate"?n.RTCIceCandidate:n.RTCSessionDescription)(arguments[0]),i.apply(this,arguments)}};n.RTCPeerConnection.prototype[t]=s[t]}))}function lp(n,e){if(typeof n!="object"||!(n.RTCPeerConnection||n.mozRTCPeerConnection)||e.version>=151)return;let t={inboundrtp:"inbound-rtp",outboundrtp:"outbound-rtp",candidatepair:"candidate-pair",localcandidate:"local-candidate",remotecandidate:"remote-candidate"},i=n.RTCPeerConnection.prototype.getStats;n.RTCPeerConnection.prototype.getStats=function(){let[r,o,a]=arguments;return this.signalingState==="closed"?Promise.resolve(new Map):i.apply(this,[r||null]).then(c=>{if(e.version<53&&!o)try{c.forEach(l=>{l.type=t[l.type]||l.type})}catch(l){if(l.name!=="TypeError")throw l;c.forEach((u,h)=>{c.set(h,Object.assign({},u,{type:t[u.type]||u.type}))})}return c}).then(o,a)}}function up(n){if(!(typeof n=="object"&&n.RTCPeerConnection&&n.RTCRtpSender)||n.RTCRtpSender&&"getStats"in n.RTCRtpSender.prototype)return;let e=n.RTCPeerConnection.prototype.getSenders;e&&(n.RTCPeerConnection.prototype.getSenders=function(){let s=e.apply(this,[]);return s.forEach(r=>r._pc=this),s});let t=n.RTCPeerConnection.prototype.addTrack;t&&(n.RTCPeerConnection.prototype.addTrack=function(){let s=t.apply(this,arguments);return s._pc=this,s}),n.RTCRtpSender.prototype.getStats=function(){return this.track?this._pc.getStats(this.track):Promise.resolve(new Map)}}function hp(n){if(!(typeof n=="object"&&n.RTCPeerConnection&&n.RTCRtpSender)||n.RTCRtpSender&&"getStats"in n.RTCRtpReceiver.prototype)return;let e=n.RTCPeerConnection.prototype.getReceivers;e&&(n.RTCPeerConnection.prototype.getReceivers=function(){let i=e.apply(this,[]);return i.forEach(s=>s._pc=this),i}),Zi(n,"track",t=>(t.receiver._pc=t.srcElement,t)),n.RTCRtpReceiver.prototype.getStats=function(){return this._pc.getStats(this.track)}}function fp(n){!n.RTCPeerConnection||"removeStream"in n.RTCPeerConnection.prototype||(n.RTCPeerConnection.prototype.removeStream=function(t){Zo("removeStream","removeTrack"),this.getSenders().forEach(i=>{i.track&&t.getTracks().includes(i.track)&&this.removeTrack(i)})})}function dp(n){n.DataChannel&&!n.RTCDataChannel&&(n.RTCDataChannel=n.DataChannel)}function pp(n,e){if(!(typeof n=="object"&&n.RTCPeerConnection)||e.version>=110)return;let t=n.RTCPeerConnection.prototype.addTransceiver;t&&(n.RTCPeerConnection.prototype.addTransceiver=function(){this.setParametersPromises=[];let s=arguments[1]&&arguments[1].sendEncodings;s===void 0&&(s=[]),s=[...s];let r=s.length>0;r&&s.forEach(a=>{if("rid"in a&&!/^[a-z0-9]{0,16}$/i.test(a.rid))throw new TypeError("Invalid RID value provided.");if("scaleResolutionDownBy"in a&&!(parseFloat(a.scaleResolutionDownBy)>=1))throw new RangeError("scale_resolution_down_by must be >= 1.0");if("maxFramerate"in a&&!(parseFloat(a.maxFramerate)>=0))throw new RangeError("max_framerate must be >= 0.0")});let o=t.apply(this,arguments);if(r){let{sender:a}=o,c=a.getParameters();(!("encodings"in c)||c.encodings.length===1&&Object.keys(c.encodings[0]).length===0)&&(c.encodings=s,a.sendEncodings=s,this.setParametersPromises.push(a.setParameters(c).then(()=>{delete a.sendEncodings}).catch(()=>{delete a.sendEncodings})))}return o})}function mp(n,e){if(!(typeof n=="object"&&n.RTCRtpSender)||e.version>=110)return;let t=n.RTCRtpSender.prototype.getParameters;t&&(n.RTCRtpSender.prototype.getParameters=function(){let s=t.apply(this,arguments);return"encodings"in s||(s.encodings=[].concat(this.sendEncodings||[{}])),s})}function gp(n,e){if(!(typeof n=="object"&&n.RTCPeerConnection)||e.version>=110)return;let t=n.RTCPeerConnection.prototype.createOffer;n.RTCPeerConnection.prototype.createOffer=function(){return this.setParametersPromises&&this.setParametersPromises.length?Promise.all(this.setParametersPromises).then(()=>t.apply(this,arguments)).finally(()=>{this.setParametersPromises=[]}):t.apply(this,arguments)}}function _p(n,e){if(!(typeof n=="object"&&n.RTCPeerConnection)||e.version>=110)return;let t=n.RTCPeerConnection.prototype.createAnswer;n.RTCPeerConnection.prototype.createAnswer=function(){return this.setParametersPromises&&this.setParametersPromises.length?Promise.all(this.setParametersPromises).then(()=>t.apply(this,arguments)).finally(()=>{this.setParametersPromises=[]}):t.apply(this,arguments)}}var gh={};al(gh,{shimAudioContext:()=>Ep,shimCallbacksAPI:()=>vp,shimConstraints:()=>B_,shimCreateOfferLegacy:()=>Tp,shimGetUserMedia:()=>Sp,shimLocalStreamsAPI:()=>xp,shimRTCIceServerUrls:()=>Mp,shimRemoteStreamsAPI:()=>yp,shimTrackEventTransceiver:()=>bp});function xp(n){if(!(typeof n!="object"||!n.RTCPeerConnection)){if("getLocalStreams"in n.RTCPeerConnection.prototype||(n.RTCPeerConnection.prototype.getLocalStreams=function(){return this._localStreams||(this._localStreams=[]),this._localStreams}),!("addStream"in n.RTCPeerConnection.prototype)){let e=n.RTCPeerConnection.prototype.addTrack;n.RTCPeerConnection.prototype.addStream=function(i){this._localStreams||(this._localStreams=[]),this._localStreams.includes(i)||this._localStreams.push(i),i.getAudioTracks().forEach(s=>e.call(this,s,i)),i.getVideoTracks().forEach(s=>e.call(this,s,i))},n.RTCPeerConnection.prototype.addTrack=function(i,...s){return s&&s.forEach(r=>{this._localStreams?this._localStreams.includes(r)||this._localStreams.push(r):this._localStreams=[r]}),e.apply(this,arguments)}}"removeStream"in n.RTCPeerConnection.prototype||(n.RTCPeerConnection.prototype.removeStream=function(t){this._localStreams||(this._localStreams=[]);let i=this._localStreams.indexOf(t);if(i===-1)return;this._localStreams.splice(i,1);let s=t.getTracks();this.getSenders().forEach(r=>{s.includes(r.track)&&this.removeTrack(r)})})}}function yp(n){if(!(typeof n!="object"||!n.RTCPeerConnection)&&("getRemoteStreams"in n.RTCPeerConnection.prototype||(n.RTCPeerConnection.prototype.getRemoteStreams=function(){return this._remoteStreams?this._remoteStreams:[]}),!("onaddstream"in n.RTCPeerConnection.prototype))){Object.defineProperty(n.RTCPeerConnection.prototype,"onaddstream",{get(){return this._onaddstream},set(t){this._onaddstream&&(this.removeEventListener("addstream",this._onaddstream),this.removeEventListener("track",this._onaddstreampoly)),this.addEventListener("addstream",this._onaddstream=t),this.addEventListener("track",this._onaddstreampoly=i=>{i.streams.forEach(s=>{if(this._remoteStreams||(this._remoteStreams=[]),this._remoteStreams.includes(s))return;this._remoteStreams.push(s);let r=new Event("addstream");r.stream=s,this.dispatchEvent(r)})})}});let e=n.RTCPeerConnection.prototype.setRemoteDescription;n.RTCPeerConnection.prototype.setRemoteDescription=function(){let i=this;return this._onaddstreampoly||this.addEventListener("track",this._onaddstreampoly=function(s){s.streams.forEach(r=>{if(i._remoteStreams||(i._remoteStreams=[]),i._remoteStreams.indexOf(r)>=0)return;i._remoteStreams.push(r);let o=new Event("addstream");o.stream=r,i.dispatchEvent(o)})}),e.apply(i,arguments)}}}function vp(n){if(typeof n!="object"||!n.RTCPeerConnection)return;let e=n.RTCPeerConnection.prototype,t=e.createOffer,i=e.createAnswer,s=e.setLocalDescription,r=e.setRemoteDescription,o=e.addIceCandidate;e.createOffer=function(l,u){let h=arguments.length>=2?arguments[2]:arguments[0],f=t.apply(this,[h]);return u?(f.then(l,u),Promise.resolve()):f},e.createAnswer=function(l,u){let h=arguments.length>=2?arguments[2]:arguments[0],f=i.apply(this,[h]);return u?(f.then(l,u),Promise.resolve()):f};let a=function(c,l,u){let h=s.apply(this,[c]);return u?(h.then(l,u),Promise.resolve()):h};e.setLocalDescription=a,a=function(c,l,u){let h=r.apply(this,[c]);return u?(h.then(l,u),Promise.resolve()):h},e.setRemoteDescription=a,a=function(c,l,u){let h=o.apply(this,[c]);return u?(h.then(l,u),Promise.resolve()):h},e.addIceCandidate=a}function Sp(n){let e=n&&n.navigator;if(e.mediaDevices&&e.mediaDevices.getUserMedia){let t=e.mediaDevices,i=t.getUserMedia.bind(t);e.mediaDevices.getUserMedia=s=>i(B_(s))}!e.getUserMedia&&e.mediaDevices&&e.mediaDevices.getUserMedia&&(e.getUserMedia=function(i,s,r){e.mediaDevices.getUserMedia(i).then(s,r)}.bind(e))}function B_(n){return n&&n.video!==void 0?Object.assign({},n,{video:ep(n.video)}):n}function Mp(n){if(!n.RTCPeerConnection)return;let e=n.RTCPeerConnection;n.RTCPeerConnection=function(i,s){if(i&&i.iceServers){let r=[];for(let o=0;o<i.iceServers.length;o++){let a=i.iceServers[o];a.urls===void 0&&a.url?(Zo("RTCIceServer.url","RTCIceServer.urls"),a=JSON.parse(JSON.stringify(a)),a.urls=a.url,delete a.url,r.push(a)):r.push(i.iceServers[o])}i.iceServers=r}return new e(i,s)},n.RTCPeerConnection.prototype=e.prototype,"generateCertificate"in e&&Object.defineProperty(n.RTCPeerConnection,"generateCertificate",{get(){return e.generateCertificate}})}function bp(n){typeof n=="object"&&n.RTCTrackEvent&&"receiver"in n.RTCTrackEvent.prototype&&!("transceiver"in n.RTCTrackEvent.prototype)&&Object.defineProperty(n.RTCTrackEvent.prototype,"transceiver",{get(){return{receiver:this.receiver}}})}function Tp(n){let e=n.RTCPeerConnection.prototype.createOffer;n.RTCPeerConnection.prototype.createOffer=function(i){if(i){typeof i.offerToReceiveAudio<"u"&&(i.offerToReceiveAudio=!!i.offerToReceiveAudio);let s=this.getTransceivers().find(o=>o.receiver.track.kind==="audio");i.offerToReceiveAudio===!1&&s?s.direction==="sendrecv"?s.setDirection?s.setDirection("sendonly"):s.direction="sendonly":s.direction==="recvonly"&&(s.setDirection?s.setDirection("inactive"):s.direction="inactive"):i.offerToReceiveAudio===!0&&!s&&this.addTransceiver("audio",{direction:"recvonly"}),typeof i.offerToReceiveVideo<"u"&&(i.offerToReceiveVideo=!!i.offerToReceiveVideo);let r=this.getTransceivers().find(o=>o.receiver.track.kind==="video");i.offerToReceiveVideo===!1&&r?r.direction==="sendrecv"?r.setDirection?r.setDirection("sendonly"):r.direction="sendonly":r.direction==="recvonly"&&(r.setDirection?r.setDirection("inactive"):r.direction="inactive"):i.offerToReceiveVideo===!0&&!r&&this.addTransceiver("video",{direction:"recvonly"})}return e.apply(this,arguments)}}function Ep(n){typeof n!="object"||n.AudioContext||(n.AudioContext=n.webkitAudioContext)}var Rp={};al(Rp,{removeExtmapAllowMixed:()=>yh,shimAddIceCandidateNullOrEmpty:()=>xc,shimConnectionState:()=>xh,shimMaxMessageSize:()=>gc,shimParameterlessSetLocalDescription:()=>yc,shimRTCIceCandidate:()=>mc,shimRTCIceCandidateRelayProtocol:()=>_h,shimSendThrowTypeError:()=>_c});var Jo=v0(Ap());function mc(n){if(!n.RTCIceCandidate||n.RTCIceCandidate&&"foundation"in n.RTCIceCandidate.prototype)return;let e=n.RTCIceCandidate;n.RTCIceCandidate=function(i){if(typeof i=="object"&&i.candidate&&i.candidate.indexOf("a=")===0&&(i=JSON.parse(JSON.stringify(i)),i.candidate=i.candidate.substring(2)),i.candidate&&i.candidate.length){let s=new e(i),r=Jo.default.parseCandidate(i.candidate);for(let o in r)o in s||Object.defineProperty(s,o,{value:r[o]});return s.toJSON=function(){return{candidate:s.candidate,sdpMid:s.sdpMid,sdpMLineIndex:s.sdpMLineIndex,usernameFragment:s.usernameFragment}},s}return new e(i)},n.RTCIceCandidate.prototype=e.prototype,Zi(n,"icecandidate",t=>(t.candidate&&Object.defineProperty(t,"candidate",{value:new n.RTCIceCandidate(t.candidate),writable:"false"}),t))}function _h(n){!n.RTCIceCandidate||n.RTCIceCandidate&&"relayProtocol"in n.RTCIceCandidate.prototype||Zi(n,"icecandidate",e=>{if(e.candidate){let t=Jo.default.parseCandidate(e.candidate.candidate);t.type==="relay"&&(e.candidate.relayProtocol={0:"tls",1:"tcp",2:"udp"}[t.priority>>24])}return e})}function gc(n,e){if(!n.RTCPeerConnection||e.browser==="chrome"&&e.version>102||e.browser==="firefox"&&e.version>=113)return;"sctp"in n.RTCPeerConnection.prototype||Object.defineProperty(n.RTCPeerConnection.prototype,"sctp",{get(){return typeof this._sctp>"u"?null:this._sctp}});let t=function(a){if(!a||!a.sdp)return!1;let c=Jo.default.splitSections(a.sdp);return c.shift(),c.some(l=>{let u=Jo.default.parseMLine(l);return u&&u.kind==="application"&&u.protocol.indexOf("SCTP")!==-1})},i=function(a){let c=a.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);if(c===null||c.length<2)return-1;let l=parseInt(c[1],10);return l!==l?-1:l},s=function(a){let c=65536;return e.browser==="firefox"&&(e.version<57?a===-1?c=16384:c=2147483637:e.version<60?c=e.version===57?65535:65536:c=2147483637),c},r=function(a,c){let l=65536;e.browser==="firefox"&&e.version===57&&(l=65535);let u=Jo.default.matchPrefix(a.sdp,"a=max-message-size:");return u.length>0?l=parseInt(u[0].substring(19),10):e.browser==="firefox"&&c!==-1&&(l=2147483637),l},o=n.RTCPeerConnection.prototype.setRemoteDescription;n.RTCPeerConnection.prototype.setRemoteDescription=function(){if(this._sctp=null,e.browser==="chrome"&&e.version>=76){let{sdpSemantics:c}=this.getConfiguration();c==="plan-b"&&Object.defineProperty(this,"sctp",{get(){return typeof this._sctp>"u"?null:this._sctp},enumerable:!0,configurable:!0})}if(t(arguments[0])){let c=i(arguments[0]),l=s(c),u=r(arguments[0],c),h;l===0&&u===0?h=Number.POSITIVE_INFINITY:l===0||u===0?h=Math.max(l,u):h=Math.min(l,u);let f={};Object.defineProperty(f,"maxMessageSize",{get(){return h}}),this._sctp=f}return o.apply(this,arguments)}}function _c(n,e){if(!(n.RTCPeerConnection&&"createDataChannel"in n.RTCPeerConnection.prototype)||e.browser==="chrome"&&e.version>=149||e.browser==="firefox"&&e.version>60)return;function t(s,r){let o=s.send;s.send=function(){let c=arguments[0],l=c.length||c.size||c.byteLength;if(s.readyState==="open"&&r.sctp&&l>r.sctp.maxMessageSize)throw new TypeError("Message too large (can send a maximum of "+r.sctp.maxMessageSize+" bytes)");return o.apply(s,arguments)}}let i=n.RTCPeerConnection.prototype.createDataChannel;n.RTCPeerConnection.prototype.createDataChannel=function(){let r=i.apply(this,arguments);return t(r,this),r},Zi(n,"datachannel",s=>(t(s.channel,s.target),s))}function xh(n){if(!n.RTCPeerConnection||"connectionState"in n.RTCPeerConnection.prototype)return;let e=n.RTCPeerConnection.prototype;Object.defineProperty(e,"connectionState",{get(){return{completed:"connected",checking:"connecting"}[this.iceConnectionState]||this.iceConnectionState},enumerable:!0,configurable:!0}),Object.defineProperty(e,"onconnectionstatechange",{get(){return this._onconnectionstatechange||null},set(t){this._onconnectionstatechange&&(this.removeEventListener("connectionstatechange",this._onconnectionstatechange),delete this._onconnectionstatechange),t&&this.addEventListener("connectionstatechange",this._onconnectionstatechange=t)},enumerable:!0,configurable:!0}),["setLocalDescription","setRemoteDescription"].forEach(t=>{let i=e[t];e[t]=function(){return this._connectionstatechangepoly||(this._connectionstatechangepoly=s=>{let r=s.target;if(r._lastConnectionState!==r.connectionState){r._lastConnectionState=r.connectionState;let o=new Event("connectionstatechange",s);r.dispatchEvent(o)}return s},this.addEventListener("iceconnectionstatechange",this._connectionstatechangepoly)),i.apply(this,arguments)}})}function yh(n,e){if(!n.RTCPeerConnection||e.browser==="chrome"&&e.version>=71||e.browser==="safari"&&e._safariVersion>=13.1)return;let t=n.RTCPeerConnection.prototype.setRemoteDescription;n.RTCPeerConnection.prototype.setRemoteDescription=function(s){if(s&&s.sdp&&s.sdp.indexOf(`
a=extmap-allow-mixed`)!==-1){let r=s.sdp.split(`
`).filter(o=>o.trim()!=="a=extmap-allow-mixed").join(`
`);n.RTCSessionDescription&&s instanceof n.RTCSessionDescription?arguments[0]=new n.RTCSessionDescription({type:s.type,sdp:r}):s.sdp=r}return t.apply(this,arguments)}}function xc(n,e){if(!(n.RTCPeerConnection&&n.RTCPeerConnection.prototype))return;let t=n.RTCPeerConnection.prototype.addIceCandidate;!t||t.length===0||(n.RTCPeerConnection.prototype.addIceCandidate=function(){return arguments[0]?(e.browser==="chrome"&&e.version<78||e.browser==="firefox"&&e.version<68||e.browser==="safari")&&arguments[0]&&arguments[0].candidate===""?Promise.resolve():t.apply(this,arguments):(arguments[1]&&arguments[1].apply(null),Promise.resolve())})}function yc(n,e){if(!(n.RTCPeerConnection&&n.RTCPeerConnection.prototype))return;let t=n.RTCPeerConnection.prototype.setLocalDescription;!t||t.length===0||(n.RTCPeerConnection.prototype.setLocalDescription=function(){let s=arguments[0]||{};if(typeof s!="object"||s.type&&s.sdp)return t.apply(this,arguments);if(s={type:s.type,sdp:s.sdp},!s.type)switch(this.signalingState){case"stable":case"have-local-offer":case"have-remote-pranswer":s.type="offer";break;default:s.type="answer";break}return s.sdp||s.type!=="offer"&&s.type!=="answer"?t.apply(this,[s]):(s.type==="offer"?this.createOffer:this.createAnswer).apply(this).then(o=>t.apply(this,[o]))})}var T1=v0(Ap());function k_({window:n}={},e={shimChrome:!0,shimFirefox:!0,shimSafari:!0}){let t=pc,i=N_(n),s={browserDetails:i,commonShim:Rp,extractVersion:Ko,disableLog:L_,disableWarnings:D_,sdp:T1};switch(i.browser){case"chrome":if(!fh||!hh||!e.shimChrome)return t("Chrome shim is not included in this adapter release."),s;if(i.version===null)return t("Chrome shim can not determine version, not shimming."),s;t("adapter.js shimming chrome."),s.browserShim=fh,xc(n,i),yc(n,i),uh(n,i),np(n,i),hh(n,i),ip(n,i),op(n,i),sp(n,i),rp(n,i),ap(n,i),mc(n,i),_h(n,i),xh(n,i),gc(n,i),_c(n,i),yh(n,i);break;case"firefox":if(!mh||!ph||!e.shimFirefox)return t("Firefox shim is not included in this adapter release."),s;t("adapter.js shimming firefox."),s.browserShim=mh,xc(n,i),yc(n,i),dh(n,i),ph(n,i),lp(n,i),cp(n,i),fp(n,i),up(n,i),hp(n,i),dp(n,i),pp(n,i),mp(n,i),gp(n,i),_p(n,i),mc(n,i),xh(n,i),gc(n,i),_c(n,i);break;case"safari":if(!gh||!e.shimSafari)return t("Safari shim is not included in this adapter release."),s;t("adapter.js shimming safari."),s.browserShim=gh,xc(n,i),yc(n,i),Mp(n,i),Tp(n,i),vp(n,i),xp(n,i),yp(n,i),bp(n,i),Sp(n,i),Ep(n,i),mc(n,i),_h(n,i),gc(n,i),_c(n,i),yh(n,i);break;default:t("Unsupported browser!");break}return s}var E1=k_({window:typeof window>"u"?void 0:window}),Cp=E1;function Ur(n,e,t,i){Object.defineProperty(n,e,{get:t,set:i,enumerable:!0,configurable:!0})}var Sh=class{constructor(){this.chunkedMTU=16300,this._dataCount=1,this.chunk=e=>{let t=[],i=e.byteLength,s=Math.ceil(i/this.chunkedMTU),r=0,o=0;for(;o<i;){let a=Math.min(i,o+this.chunkedMTU),c=e.slice(o,a),l={__peerData:this._dataCount,n:r,data:c,total:s};t.push(l),o=a,r++}return this._dataCount++,t}}};function w1(n){let e=0;for(let s of n)e+=s.byteLength;let t=new Uint8Array(e),i=0;for(let s of n)t.set(s,i),i+=s.byteLength;return t}var Pp=Cp.default||Cp,vc=new class{isWebRTCSupported(){return typeof RTCPeerConnection<"u"}isBrowserSupported(){let n=this.getBrowser(),e=this.getVersion();return this.supportedBrowsers.includes(n)?n==="chrome"?e>=this.minChromeVersion:n==="firefox"?e>=this.minFirefoxVersion:n==="safari"?!this.isIOS&&e>=this.minSafariVersion:!1:!1}getBrowser(){return Pp.browserDetails.browser}getVersion(){return Pp.browserDetails.version||0}isUnifiedPlanSupported(){let n=this.getBrowser(),e=Pp.browserDetails.version||0;if(n==="chrome"&&e<this.minChromeVersion)return!1;if(n==="firefox"&&e>=this.minFirefoxVersion)return!0;if(!window.RTCRtpTransceiver||!("currentDirection"in RTCRtpTransceiver.prototype))return!1;let t,i=!1;try{t=new RTCPeerConnection,t.addTransceiver("audio"),i=!0}catch{}finally{t&&t.close()}return i}toString(){return`Supports:
    browser:${this.getBrowser()}
    version:${this.getVersion()}
    isIOS:${this.isIOS}
    isWebRTCSupported:${this.isWebRTCSupported()}
    isBrowserSupported:${this.isBrowserSupported()}
    isUnifiedPlanSupported:${this.isUnifiedPlanSupported()}`}constructor(){this.isIOS=typeof navigator<"u"?["iPad","iPhone","iPod"].includes(navigator.platform):!1,this.supportedBrowsers=["firefox","chrome","safari"],this.minFirefoxVersion=59,this.minChromeVersion=72,this.minSafariVersion=605}},A1=n=>!n||/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(n),H_=()=>Math.random().toString(36).slice(2),z_={iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:["turn:eu-0.turn.peerjs.com:3478","turn:us-0.turn.peerjs.com:3478"],username:"peerjs",credential:"peerjsp"}],sdpSemantics:"unified-plan"},Ip=class extends Sh{noop(){}blobToArrayBuffer(e,t){let i=new FileReader;return i.onload=function(s){s.target&&t(s.target.result)},i.readAsArrayBuffer(e),i}binaryStringToArrayBuffer(e){let t=new Uint8Array(e.length);for(let i=0;i<e.length;i++)t[i]=e.charCodeAt(i)&255;return t.buffer}isSecure(){return location.protocol==="https:"}constructor(...e){super(...e),this.CLOUD_HOST="0.peerjs.com",this.CLOUD_PORT=443,this.chunkedBrowsers={Chrome:1,chrome:1},this.defaultConfig=z_,this.browser=vc.getBrowser(),this.browserVersion=vc.getVersion(),this.pack=jd,this.unpack=Jd,this.supports=(function(){let t={browser:vc.isBrowserSupported(),webRTC:vc.isWebRTCSupported(),audioVideo:!1,data:!1,binaryBlob:!1,reliable:!1};if(!t.webRTC)return t;let i;try{i=new RTCPeerConnection(z_),t.audioVideo=!0;let s;try{s=i.createDataChannel("_PEERJSTEST",{ordered:!0}),t.data=!0,t.reliable=!!s.ordered;try{s.binaryType="blob",t.binaryBlob=!vc.isIOS}catch{}}catch{}finally{s&&s.close()}}catch{}finally{i&&i.close()}return t})(),this.validateId=A1,this.randomToken=H_}},si=new Ip,R1="PeerJS: ";var Lp=class{get logLevel(){return this._logLevel}set logLevel(e){this._logLevel=e}log(...e){this._logLevel>=3&&this._print(3,...e)}warn(...e){this._logLevel>=2&&this._print(2,...e)}error(...e){this._logLevel>=1&&this._print(1,...e)}setLogFunction(e){this._print=e}_print(e,...t){let i=[R1,...t];for(let s in i)i[s]instanceof Error&&(i[s]="("+i[s].name+") "+i[s].message);e>=3?console.log(...i):e>=2?console.warn("WARNING",...i):e>=1&&console.error("ERROR",...i)}constructor(){this._logLevel=0}},Ue=new Lp,kp={},C1=Object.prototype.hasOwnProperty,Yn="~";function Mc(){}Object.create&&(Mc.prototype=Object.create(null),new Mc().__proto__||(Yn=!1));function P1(n,e,t){this.fn=n,this.context=e,this.once=t||!1}function G_(n,e,t,i,s){if(typeof t!="function")throw new TypeError("The listener must be a function");var r=new P1(t,i||n,s),o=Yn?Yn+e:e;return n._events[o]?n._events[o].fn?n._events[o]=[n._events[o],r]:n._events[o].push(r):(n._events[o]=r,n._eventsCount++),n}function vh(n,e){--n._eventsCount===0?n._events=new Mc:delete n._events[e]}function Hn(){this._events=new Mc,this._eventsCount=0}Hn.prototype.eventNames=function(){var e=[],t,i;if(this._eventsCount===0)return e;for(i in t=this._events)C1.call(t,i)&&e.push(Yn?i.slice(1):i);return Object.getOwnPropertySymbols?e.concat(Object.getOwnPropertySymbols(t)):e};Hn.prototype.listeners=function(e){var t=Yn?Yn+e:e,i=this._events[t];if(!i)return[];if(i.fn)return[i.fn];for(var s=0,r=i.length,o=new Array(r);s<r;s++)o[s]=i[s].fn;return o};Hn.prototype.listenerCount=function(e){var t=Yn?Yn+e:e,i=this._events[t];return i?i.fn?1:i.length:0};Hn.prototype.emit=function(e,t,i,s,r,o){var a=Yn?Yn+e:e;if(!this._events[a])return!1;var c=this._events[a],l=arguments.length,u,h;if(c.fn){switch(c.once&&this.removeListener(e,c.fn,void 0,!0),l){case 1:return c.fn.call(c.context),!0;case 2:return c.fn.call(c.context,t),!0;case 3:return c.fn.call(c.context,t,i),!0;case 4:return c.fn.call(c.context,t,i,s),!0;case 5:return c.fn.call(c.context,t,i,s,r),!0;case 6:return c.fn.call(c.context,t,i,s,r,o),!0}for(h=1,u=new Array(l-1);h<l;h++)u[h-1]=arguments[h];c.fn.apply(c.context,u)}else{var f=c.length,d;for(h=0;h<f;h++)switch(c[h].once&&this.removeListener(e,c[h].fn,void 0,!0),l){case 1:c[h].fn.call(c[h].context);break;case 2:c[h].fn.call(c[h].context,t);break;case 3:c[h].fn.call(c[h].context,t,i);break;case 4:c[h].fn.call(c[h].context,t,i,s);break;default:if(!u)for(d=1,u=new Array(l-1);d<l;d++)u[d-1]=arguments[d];c[h].fn.apply(c[h].context,u)}}return!0};Hn.prototype.on=function(e,t,i){return G_(this,e,t,i,!1)};Hn.prototype.once=function(e,t,i){return G_(this,e,t,i,!0)};Hn.prototype.removeListener=function(e,t,i,s){var r=Yn?Yn+e:e;if(!this._events[r])return this;if(!t)return vh(this,r),this;var o=this._events[r];if(o.fn)o.fn===t&&(!s||o.once)&&(!i||o.context===i)&&vh(this,r);else{for(var a=0,c=[],l=o.length;a<l;a++)(o[a].fn!==t||s&&!o[a].once||i&&o[a].context!==i)&&c.push(o[a]);c.length?this._events[r]=c.length===1?c[0]:c:vh(this,r)}return this};Hn.prototype.removeAllListeners=function(e){var t;return e?(t=Yn?Yn+e:e,this._events[t]&&vh(this,t)):(this._events=new Mc,this._eventsCount=0),this};Hn.prototype.off=Hn.prototype.removeListener;Hn.prototype.addListener=Hn.prototype.on;Hn.prefixed=Yn;Hn.EventEmitter=Hn;kp=Hn;var Fr={};Ur(Fr,"ConnectionType",()=>Js);Ur(Fr,"PeerErrorType",()=>sn);Ur(Fr,"BaseConnectionErrorType",()=>Dp);Ur(Fr,"DataConnectionErrorType",()=>zp);Ur(Fr,"SerializationType",()=>Ah);Ur(Fr,"SocketEventType",()=>Zs);Ur(Fr,"ServerMessageType",()=>zn);var Js=(function(n){return n.Data="data",n.Media="media",n})({}),sn=(function(n){return n.BrowserIncompatible="browser-incompatible",n.Disconnected="disconnected",n.InvalidID="invalid-id",n.InvalidKey="invalid-key",n.Network="network",n.PeerUnavailable="peer-unavailable",n.SslUnavailable="ssl-unavailable",n.ServerError="server-error",n.SocketError="socket-error",n.SocketClosed="socket-closed",n.UnavailableID="unavailable-id",n.WebRTC="webrtc",n})({}),Dp=(function(n){return n.NegotiationFailed="negotiation-failed",n.ConnectionClosed="connection-closed",n})({}),zp=(function(n){return n.NotOpenYet="not-open-yet",n.MessageToBig="message-too-big",n})({}),Ah=(function(n){return n.Binary="binary",n.BinaryUTF8="binary-utf8",n.JSON="json",n.None="raw",n})({}),Zs=(function(n){return n.Message="message",n.Disconnected="disconnected",n.Error="error",n.Close="close",n})({}),zn=(function(n){return n.Heartbeat="HEARTBEAT",n.Candidate="CANDIDATE",n.Offer="OFFER",n.Answer="ANSWER",n.Open="OPEN",n.Error="ERROR",n.IdTaken="ID-TAKEN",n.InvalidKey="INVALID-KEY",n.Leave="LEAVE",n.Expire="EXPIRE",n})({}),V_="1.5.5",Np=class extends kp.EventEmitter{constructor(e,t,i,s,r,o=5e3){super(),this.pingInterval=o,this._disconnected=!0,this._messagesQueue=[];let a=e?"wss://":"ws://";this._baseUrl=a+t+":"+i+s+"peerjs?key="+r}start(e,t){this._id=e;let i=`${this._baseUrl}&id=${e}&token=${t}`;this._socket||!this._disconnected||(this._socket=new WebSocket(i+"&version="+V_),this._disconnected=!1,this._socket.onmessage=s=>{let r;try{r=JSON.parse(s.data),Ue.log("Server message received:",r)}catch{Ue.log("Invalid server message",s.data);return}this.emit(Zs.Message,r)},this._socket.onclose=s=>{this._disconnected||(Ue.log("Socket closed.",s),this._cleanup(),this._disconnected=!0,this.emit(Zs.Disconnected))},this._socket.onopen=()=>{this._disconnected||(this._sendQueuedMessages(),Ue.log("Socket open"),this._scheduleHeartbeat())})}_scheduleHeartbeat(){this._wsPingTimer=setTimeout(()=>{this._sendHeartbeat()},this.pingInterval)}_sendHeartbeat(){if(!this._wsOpen()){Ue.log("Cannot send heartbeat, because socket closed");return}let e=JSON.stringify({type:zn.Heartbeat});this._socket.send(e),this._scheduleHeartbeat()}_wsOpen(){return!!this._socket&&this._socket.readyState===1}_sendQueuedMessages(){let e=[...this._messagesQueue];this._messagesQueue=[];for(let t of e)this.send(t)}send(e){if(this._disconnected)return;if(!this._id){this._messagesQueue.push(e);return}if(!e.type){this.emit(Zs.Error,"Invalid message");return}if(!this._wsOpen())return;let t=JSON.stringify(e);this._socket.send(t)}close(){this._disconnected||(this._cleanup(),this._disconnected=!0)}_cleanup(){this._socket&&(this._socket.onopen=this._socket.onmessage=this._socket.onclose=null,this._socket.close(),this._socket=void 0),clearTimeout(this._wsPingTimer)}},Mh=class{constructor(e){this.connection=e}startConnection(e){let t=this._startPeerConnection();if(this.connection.peerConnection=t,this.connection.type===Js.Media&&e._stream&&this._addTracksToConnection(e._stream,t),e.originator){let i=this.connection,s={ordered:!!e.reliable},r=t.createDataChannel(i.label,s);i._initializeDataChannel(r),this._makeOffer()}else this.handleSDP("OFFER",e.sdp)}_startPeerConnection(){Ue.log("Creating RTCPeerConnection.");let e=new RTCPeerConnection(this.connection.provider.options.config);return this._setupListeners(e),e}_setupListeners(e){let t=this.connection.peer,i=this.connection.connectionId,s=this.connection.type,r=this.connection.provider;Ue.log("Listening for ICE candidates."),e.onicecandidate=o=>{!o.candidate||!o.candidate.candidate||(Ue.log(`Received ICE candidates for ${t}:`,o.candidate),r.socket.send({type:zn.Candidate,payload:{candidate:o.candidate,type:s,connectionId:i},dst:t}))},e.oniceconnectionstatechange=()=>{switch(e.iceConnectionState){case"failed":Ue.log("iceConnectionState is failed, closing connections to "+t),this.connection.emitError(Dp.NegotiationFailed,"Negotiation of connection to "+t+" failed."),this.connection.close();break;case"closed":Ue.log("iceConnectionState is closed, closing connections to "+t),this.connection.emitError(Dp.ConnectionClosed,"Connection to "+t+" closed."),this.connection.close();break;case"disconnected":Ue.log("iceConnectionState changed to disconnected on the connection with "+t);break;case"completed":e.onicecandidate=()=>{};break}this.connection.emit("iceStateChanged",e.iceConnectionState)},Ue.log("Listening for data channel"),e.ondatachannel=o=>{Ue.log("Received data channel");let a=o.channel;r.getConnection(t,i)._initializeDataChannel(a)},Ue.log("Listening for remote stream"),e.ontrack=o=>{Ue.log("Received remote stream");let a=o.streams[0],c=r.getConnection(t,i);if(c.type===Js.Media){let l=c;this._addStreamToMediaConnection(a,l)}}}cleanup(){Ue.log("Cleaning up PeerConnection to "+this.connection.peer);let e=this.connection.peerConnection;if(!e)return;this.connection.peerConnection=null,e.onicecandidate=e.oniceconnectionstatechange=e.ondatachannel=e.ontrack=()=>{};let t=e.signalingState!=="closed",i=!1,s=this.connection.dataChannel;s&&(i=!!s.readyState&&s.readyState!=="closed"),(t||i)&&e.close()}async _makeOffer(){let e=this.connection.peerConnection,t=this.connection.provider;try{let i=await e.createOffer(this.connection.options.constraints);Ue.log("Created offer."),this.connection.options.sdpTransform&&typeof this.connection.options.sdpTransform=="function"&&(i.sdp=this.connection.options.sdpTransform(i.sdp)||i.sdp);try{await e.setLocalDescription(i),Ue.log("Set localDescription:",i,`for:${this.connection.peer}`);let s={sdp:i,type:this.connection.type,connectionId:this.connection.connectionId,metadata:this.connection.metadata};if(this.connection.type===Js.Data){let r=this.connection;s={...s,label:r.label,reliable:r.reliable,serialization:r.serialization}}t.socket.send({type:zn.Offer,payload:s,dst:this.connection.peer})}catch(s){s!="OperationError: Failed to set local offer sdp: Called in wrong state: kHaveRemoteOffer"&&(t.emitError(sn.WebRTC,s),Ue.log("Failed to setLocalDescription, ",s))}}catch(i){t.emitError(sn.WebRTC,i),Ue.log("Failed to createOffer, ",i)}}async _makeAnswer(){let e=this.connection.peerConnection,t=this.connection.provider;try{let i=await e.createAnswer();Ue.log("Created answer."),this.connection.options.sdpTransform&&typeof this.connection.options.sdpTransform=="function"&&(i.sdp=this.connection.options.sdpTransform(i.sdp)||i.sdp);try{await e.setLocalDescription(i),Ue.log("Set localDescription:",i,`for:${this.connection.peer}`),t.socket.send({type:zn.Answer,payload:{sdp:i,type:this.connection.type,connectionId:this.connection.connectionId},dst:this.connection.peer})}catch(s){t.emitError(sn.WebRTC,s),Ue.log("Failed to setLocalDescription, ",s)}}catch(i){t.emitError(sn.WebRTC,i),Ue.log("Failed to create answer, ",i)}}async handleSDP(e,t){t=new RTCSessionDescription(t);let i=this.connection.peerConnection,s=this.connection.provider;Ue.log("Setting remote description",t);let r=this;try{await i.setRemoteDescription(t),Ue.log(`Set remoteDescription:${e} for:${this.connection.peer}`),e==="OFFER"&&await r._makeAnswer()}catch(o){s.emitError(sn.WebRTC,o),Ue.log("Failed to setRemoteDescription, ",o)}}async handleCandidate(e){Ue.log("handleCandidate:",e);try{await this.connection.peerConnection.addIceCandidate(e),Ue.log(`Added ICE candidate for:${this.connection.peer}`)}catch(t){this.connection.provider.emitError(sn.WebRTC,t),Ue.log("Failed to handleCandidate, ",t)}}_addTracksToConnection(e,t){if(Ue.log(`add tracks from stream ${e.id} to peer connection`),!t.addTrack)return Ue.error("Your browser does't support RTCPeerConnection#addTrack. Ignored.");e.getTracks().forEach(i=>{t.addTrack(i,e)})}_addStreamToMediaConnection(e,t){Ue.log(`add stream ${e.id} to media connection ${t.connectionId}`),t.addStream(e)}},bh=class extends kp.EventEmitter{emitError(e,t){Ue.error("Error:",t),this.emit("error",new Op(`${e}`,t))}},Op=class extends Error{constructor(e,t){typeof t=="string"?super(t):(super(),Object.assign(this,t)),this.type=e}},Th=class extends bh{get open(){return this._open}constructor(e,t,i){super(),this.peer=e,this.provider=t,this.options=i,this._open=!1,this.metadata=i.metadata}},Eh=class n extends Th{static#e=this.ID_PREFIX="mc_";get type(){return Js.Media}get localStream(){return this._localStream}get remoteStream(){return this._remoteStream}constructor(e,t,i){super(e,t,i),this._localStream=this.options._stream,this.connectionId=this.options.connectionId||n.ID_PREFIX+si.randomToken(),this._negotiator=new Mh(this),this._localStream&&this._negotiator.startConnection({_stream:this._localStream,originator:!0})}_initializeDataChannel(e){this.dataChannel=e,this.dataChannel.onopen=()=>{Ue.log(`DC#${this.connectionId} dc connection success`),this.emit("willCloseOnRemote")},this.dataChannel.onclose=()=>{Ue.log(`DC#${this.connectionId} dc closed for:`,this.peer),this.close()}}addStream(e){Ue.log("Receiving stream",e),this._remoteStream=e,super.emit("stream",e)}handleMessage(e){let t=e.type,i=e.payload;switch(e.type){case zn.Answer:this._negotiator.handleSDP(t,i.sdp),this._open=!0;break;case zn.Candidate:this._negotiator.handleCandidate(i.candidate);break;default:Ue.warn(`Unrecognized message type:${t} from peer:${this.peer}`);break}}answer(e,t={}){if(this._localStream){Ue.warn("Local stream already exists on this MediaConnection. Are you answering a call twice?");return}this._localStream=e,t&&t.sdpTransform&&(this.options.sdpTransform=t.sdpTransform),this._negotiator.startConnection({...this.options._payload,_stream:e});let i=this.provider._getMessages(this.connectionId);for(let s of i)this.handleMessage(s);this._open=!0}close(){this._negotiator&&(this._negotiator.cleanup(),this._negotiator=null),this._localStream=null,this._remoteStream=null,this.provider&&(this.provider._removeConnection(this),this.provider=null),this.options&&this.options._stream&&(this.options._stream=null),this.open&&(this._open=!1,super.emit("close"))}},Up=class{constructor(e){this._options=e}_buildRequest(e){let t=this._options.secure?"https":"http",{host:i,port:s,path:r,key:o}=this._options,a=new URL(`${t}://${i}:${s}${r}${o}/${e}`);return a.searchParams.set("ts",`${Date.now()}${Math.random()}`),a.searchParams.set("version",V_),fetch(a.href,{referrerPolicy:this._options.referrerPolicy})}async retrieveId(){try{let e=await this._buildRequest("id");if(e.status!==200)throw new Error(`Error. Status:${e.status}`);return e.text()}catch(e){Ue.error("Error retrieving ID",e);let t="";throw this._options.path==="/"&&this._options.host!==si.CLOUD_HOST&&(t=" If you passed in a `path` to your self-hosted PeerServer, you'll also need to pass in that same path when creating a new Peer."),new Error("Could not get an ID from the server."+t)}}async listAllPeers(){try{let e=await this._buildRequest("peers");if(e.status!==200){if(e.status===401){let t="";throw this._options.host===si.CLOUD_HOST?t="It looks like you're using the cloud server. You can email team@peerjs.com to enable peer listing for your API key.":t="You need to enable `allow_discovery` on your self-hosted PeerServer to use this feature.",new Error("It doesn't look like you have permission to list peers IDs. "+t)}throw new Error(`Error. Status:${e.status}`)}return e.json()}catch(e){throw Ue.error("Error retrieving list peers",e),new Error("Could not get list peers from the server."+e)}}},wh=class n extends Th{static#e=this.ID_PREFIX="dc_";static#t=this.MAX_BUFFERED_AMOUNT=8388608;get type(){return Js.Data}constructor(e,t,i){super(e,t,i),this.connectionId=this.options.connectionId||n.ID_PREFIX+H_(),this.label=this.options.label||this.connectionId,this.reliable=!!this.options.reliable,this._negotiator=new Mh(this),this._negotiator.startConnection(this.options._payload||{originator:!0,reliable:this.reliable})}_initializeDataChannel(e){this.dataChannel=e,this.dataChannel.onopen=()=>{Ue.log(`DC#${this.connectionId} dc connection success`),this._open=!0,this.emit("open")},this.dataChannel.onmessage=t=>{Ue.log(`DC#${this.connectionId} dc onmessage:`,t.data)},this.dataChannel.onclose=()=>{Ue.log(`DC#${this.connectionId} dc closed for:`,this.peer),this.close()}}close(e){if(e?.flush){this.send({__peerData:{type:"close"}});return}this._negotiator&&(this._negotiator.cleanup(),this._negotiator=null),this.provider&&(this.provider._removeConnection(this),this.provider=null),this.dataChannel&&(this.dataChannel.onopen=null,this.dataChannel.onmessage=null,this.dataChannel.onclose=null,this.dataChannel=null),this.open&&(this._open=!1,super.emit("close"))}send(e,t=!1){if(!this.open){this.emitError(zp.NotOpenYet,"Connection is not open. You should listen for the `open` event before sending messages.");return}return this._send(e,t)}async handleMessage(e){let t=e.payload;switch(e.type){case zn.Answer:await this._negotiator.handleSDP(e.type,t.sdp);break;case zn.Candidate:await this._negotiator.handleCandidate(t.candidate);break;default:Ue.warn("Unrecognized message type:",e.type,"from peer:",this.peer);break}}},bc=class extends wh{get bufferSize(){return this._bufferSize}_initializeDataChannel(e){super._initializeDataChannel(e),this.dataChannel.binaryType="arraybuffer",this.dataChannel.addEventListener("message",t=>this._handleDataMessage(t))}_bufferedSend(e){(this._buffering||!this._trySend(e))&&(this._buffer.push(e),this._bufferSize=this._buffer.length)}_trySend(e){if(!this.open)return!1;if(this.dataChannel.bufferedAmount>wh.MAX_BUFFERED_AMOUNT)return this._buffering=!0,setTimeout(()=>{this._buffering=!1,this._tryBuffer()},50),!1;try{this.dataChannel.send(e)}catch(t){return Ue.error(`DC#:${this.connectionId} Error when sending:`,t),this._buffering=!0,this.close(),!1}return!0}_tryBuffer(){if(!this.open||this._buffer.length===0)return;let e=this._buffer[0];this._trySend(e)&&(this._buffer.shift(),this._bufferSize=this._buffer.length,this._tryBuffer())}close(e){if(e?.flush){this.send({__peerData:{type:"close"}});return}this._buffer=[],this._bufferSize=0,super.close()}constructor(...e){super(...e),this._buffer=[],this._bufferSize=0,this._buffering=!1}},Sc=class extends bc{close(e){super.close(e),this._chunkedData={}}constructor(e,t,i){super(e,t,i),this.chunker=new Sh,this.serialization=Ah.Binary,this._chunkedData={}}_handleDataMessage({data:e}){let t=Jd(e),i=t.__peerData;if(i){if(i.type==="close"){this.close();return}this._handleChunk(t);return}this.emit("data",t)}_handleChunk(e){let t=e.__peerData,i=this._chunkedData[t]||{data:[],count:0,total:e.total};if(i.data[e.n]=new Uint8Array(e.data),i.count++,this._chunkedData[t]=i,i.total===i.count){delete this._chunkedData[t];let s=w1(i.data);this._handleDataMessage({data:s})}}_send(e,t){let i=jd(e);if(i instanceof Promise)return this._send_blob(i);if(!t&&i.byteLength>this.chunker.chunkedMTU){this._sendChunks(i);return}this._bufferedSend(i)}async _send_blob(e){let t=await e;if(t.byteLength>this.chunker.chunkedMTU){this._sendChunks(t);return}this._bufferedSend(t)}_sendChunks(e){let t=this.chunker.chunk(e);Ue.log(`DC#${this.connectionId} Try to send ${t.length} chunks...`);for(let i of t)this.send(i,!0)}},Fp=class extends bc{_handleDataMessage({data:e}){super.emit("data",e)}_send(e,t){this._bufferedSend(e)}constructor(...e){super(...e),this.serialization=Ah.None}},Bp=class extends bc{_handleDataMessage({data:e}){let t=this.parse(this.decoder.decode(e)),i=t.__peerData;if(i&&i.type==="close"){this.close();return}this.emit("data",t)}_send(e,t){let i=this.encoder.encode(this.stringify(e));if(i.byteLength>=si.chunkedMTU){this.emitError(zp.MessageToBig,"Message too big for JSON channel");return}this._bufferedSend(i)}constructor(...e){super(...e),this.serialization=Ah.JSON,this.encoder=new TextEncoder,this.decoder=new TextDecoder,this.stringify=JSON.stringify,this.parse=JSON.parse}};var Tc=class n extends bh{static#e=this.DEFAULT_KEY="peerjs";get id(){return this._id}get options(){return this._options}get open(){return this._open}get socket(){return this._socket}get connections(){let e=Object.create(null);for(let[t,i]of this._connections)e[t]=i;return e}get destroyed(){return this._destroyed}get disconnected(){return this._disconnected}constructor(e,t){super(),this._serializers={raw:Fp,json:Bp,binary:Sc,"binary-utf8":Sc,default:Sc},this._id=null,this._lastServerId=null,this._destroyed=!1,this._disconnected=!1,this._open=!1,this._connections=new Map,this._lostMessages=new Map;let i;if(e&&e.constructor==Object?t=e:e&&(i=e.toString()),t={debug:0,host:si.CLOUD_HOST,port:si.CLOUD_PORT,path:"/",key:n.DEFAULT_KEY,token:si.randomToken(),config:si.defaultConfig,referrerPolicy:"strict-origin-when-cross-origin",serializers:{},...t},this._options=t,this._serializers={...this._serializers,...this.options.serializers},this._options.host==="/"&&(this._options.host=window.location.hostname),this._options.path&&(this._options.path[0]!=="/"&&(this._options.path="/"+this._options.path),this._options.path[this._options.path.length-1]!=="/"&&(this._options.path+="/")),this._options.secure===void 0&&this._options.host!==si.CLOUD_HOST?this._options.secure=si.isSecure():this._options.host==si.CLOUD_HOST&&(this._options.secure=!0),this._options.logFunction&&Ue.setLogFunction(this._options.logFunction),Ue.logLevel=this._options.debug||0,this._api=new Up(t),this._socket=this._createServerConnection(),!si.supports.audioVideo&&!si.supports.data){this._delayedAbort(sn.BrowserIncompatible,"The current browser does not support WebRTC");return}if(i&&!si.validateId(i)){this._delayedAbort(sn.InvalidID,`ID "${i}" is invalid`);return}i?this._initialize(i):this._api.retrieveId().then(s=>this._initialize(s)).catch(s=>this._abort(sn.ServerError,s))}_createServerConnection(){let e=new Np(this._options.secure,this._options.host,this._options.port,this._options.path,this._options.key,this._options.pingInterval);return e.on(Zs.Message,t=>{this._handleMessage(t)}),e.on(Zs.Error,t=>{this._abort(sn.SocketError,t)}),e.on(Zs.Disconnected,()=>{this.disconnected||(this.emitError(sn.Network,"Lost connection to server."),this.disconnect())}),e.on(Zs.Close,()=>{this.disconnected||this._abort(sn.SocketClosed,"Underlying socket is already closed.")}),e}_initialize(e){this._id=e,this.socket.start(e,this._options.token)}_handleMessage(e){let t=e.type,i=e.payload,s=e.src;switch(t){case zn.Open:this._lastServerId=this.id,this._open=!0,this.emit("open",this.id);break;case zn.Error:this._abort(sn.ServerError,i.msg);break;case zn.IdTaken:this._abort(sn.UnavailableID,`ID "${this.id}" is taken`);break;case zn.InvalidKey:this._abort(sn.InvalidKey,`API KEY "${this._options.key}" is invalid`);break;case zn.Leave:Ue.log(`Received leave message from ${s}`),this._cleanupPeer(s),this._connections.delete(s);break;case zn.Expire:this.emitError(sn.PeerUnavailable,`Could not connect to peer ${s}`);break;case zn.Offer:{let r=i.connectionId,o=this.getConnection(s,r);if(o&&(o.close(),Ue.warn(`Offer received for existing Connection ID:${r}`)),i.type===Js.Media){let c=new Eh(s,this,{connectionId:r,_payload:i,metadata:i.metadata});o=c,this._addConnection(s,o),this.emit("call",c)}else if(i.type===Js.Data){let c=new this._serializers[i.serialization](s,this,{connectionId:r,_payload:i,metadata:i.metadata,label:i.label,serialization:i.serialization,reliable:i.reliable});o=c,this._addConnection(s,o),this.emit("connection",c)}else{Ue.warn(`Received malformed connection type:${i.type}`);return}let a=this._getMessages(r);for(let c of a)o.handleMessage(c);break}default:{if(!i){Ue.warn(`You received a malformed message from ${s} of type ${t}`);return}let r=i.connectionId,o=this.getConnection(s,r);o&&o.peerConnection?o.handleMessage(e):r?this._storeMessage(r,e):Ue.warn("You received an unrecognized message:",e);break}}}_storeMessage(e,t){this._lostMessages.has(e)||this._lostMessages.set(e,[]),this._lostMessages.get(e).push(t)}_getMessages(e){let t=this._lostMessages.get(e);return t?(this._lostMessages.delete(e),t):[]}connect(e,t={}){if(t={serialization:"default",...t},this.disconnected){Ue.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect, or call reconnect on this peer if you believe its ID to still be available."),this.emitError(sn.Disconnected,"Cannot connect to new Peer after disconnecting from server.");return}let i=new this._serializers[t.serialization](e,this,t);return this._addConnection(e,i),i}call(e,t,i={}){if(this.disconnected){Ue.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect."),this.emitError(sn.Disconnected,"Cannot connect to new Peer after disconnecting from server.");return}if(!t){Ue.error("To call a peer, you must provide a stream from your browser's `getUserMedia`.");return}let s=new Eh(e,this,{...i,_stream:t});return this._addConnection(e,s),s}_addConnection(e,t){Ue.log(`add connection ${t.type}:${t.connectionId} to peerId:${e}`),this._connections.has(e)||this._connections.set(e,[]),this._connections.get(e).push(t)}_removeConnection(e){let t=this._connections.get(e.peer);if(t){let i=t.indexOf(e);i!==-1&&t.splice(i,1)}this._lostMessages.delete(e.connectionId)}getConnection(e,t){let i=this._connections.get(e);if(!i)return null;for(let s of i)if(s.connectionId===t)return s;return null}_delayedAbort(e,t){setTimeout(()=>{this._abort(e,t)},0)}_abort(e,t){Ue.error("Aborting!"),this.emitError(e,t),this._lastServerId?this.disconnect():this.destroy()}destroy(){this.destroyed||(Ue.log(`Destroy peer with ID:${this.id}`),this.disconnect(),this._cleanup(),this._destroyed=!0,this.emit("close"))}_cleanup(){for(let e of this._connections.keys())this._cleanupPeer(e),this._connections.delete(e);this.socket.removeAllListeners()}_cleanupPeer(e){let t=this._connections.get(e);if(t)for(let i of t)i.close()}disconnect(){if(this.disconnected)return;let e=this.id;Ue.log(`Disconnect peer with ID:${e}`),this._disconnected=!0,this._open=!1,this.socket.close(),this._lastServerId=e,this._id=null,this.emit("disconnected",e)}reconnect(){if(this.disconnected&&!this.destroyed)Ue.log(`Attempting reconnection to server with ID ${this._lastServerId}`),this._disconnected=!1,this._initialize(this._lastServerId);else{if(this.destroyed)throw new Error("This peer cannot reconnect to the server. It has already been destroyed.");if(!this.disconnected&&!this.open)Ue.error("In a hurry? We're still trying to make the initial connection!");else throw new Error(`Peer ${this.id} cannot reconnect because it is not disconnected from the server!`)}}listAllPeers(e=t=>{}){this._api.listAllPeers().then(t=>e(t)).catch(t=>this._abort(sn.ServerError,t))}};var Hp="coral-coast-rally-lobby-v1-k7q2z9",I1="ccr-k7q2z9-",L1=()=>Math.random().toString(36).slice(2,10),W_={debug:0};function X_(n){let e={me:null,id:null,nick:"",paint:0,look:null,status:"idle",online:!1,started:!1,lobbyConn:null,lobbyPeer:null,isLobby:!1,claiming:!1,roster:[],rosterMap:new Map,clients:new Map,room:null,hostConn:null,hostNick:"",pending:new Map},t=()=>Date.now(),i=(A,L)=>n.status&&n.status(A,L),s=()=>({id:e.id,nick:e.nick,status:e.status,paint:e.paint,seen:t()}),r=()=>({t:"hello",id:e.id,nick:e.nick,status:e.status,paint:e.paint,board:n.getBoard()});function o(A,L){if(e.nick=A,e.paint=L,e.started){g();return}e.started=!0,i("Connecting\u2026"),e.me=new Tc(I1+L1(),W_),e.me.on("open",B=>{e.id=B,e.online=!0,a()}),e.me.on("connection",b),e.me.on("error",B=>{let P=String(B&&B.message||"");if(B.type==="peer-unavailable"){if(P.includes(Hp))c();else if(e.room)for(let[H,K]of e.room.guests)P.includes(H)&&(K.state="offline",n.room(),setTimeout(()=>y(H),2500))}else["network","server-error","socket-error","socket-closed"].includes(B.type)&&i("Network problem \u2014 retrying\u2026","bad")}),e.me.on("disconnected",()=>setTimeout(()=>{e.me&&!e.me.destroyed&&e.me.disconnected&&e.me.reconnect()},1500)),setInterval(()=>{if(e.lobbyConn&&e.lobbyConn.open&&e.lobbyConn.send({t:"ping"}),e.isLobby){let B=!1;for(let[H,K]of e.rosterMap)H!==e.id&&t()-K.seen>22e3&&(e.rosterMap.delete(H),B=!0);let P=e.rosterMap.get(e.id);P&&(P.seen=t()),B&&h()}},5e3)}function a(){if(e.isLobby||!e.me||e.me.destroyed)return;let A=e.me.connect(Hp,{serialization:"json",reliable:!0}),L=!1,B=setTimeout(()=>{if(!L){try{A.close()}catch{}c()}},7e3);A.on("open",()=>{L=!0,clearTimeout(B),e.lobbyConn=A,A.send(r()),i("Online","ok")}),A.on("data",d);let P=()=>{clearTimeout(B),e.lobbyConn===A&&(e.lobbyConn=null,i("Lobby moved \u2014 reconnecting\u2026"),setTimeout(c,300+Math.random()*1500))};A.on("close",P),A.on("error",P)}function c(){if(e.claiming||e.isLobby||e.lobbyConn&&e.lobbyConn.open)return;e.claiming=!0;let A=new Tc(Hp,W_);A.on("open",()=>{e.claiming=!1,e.isLobby=!0,e.lobbyPeer=A,i("Online","ok"),e.rosterMap.set(e.id,s()),h()}),A.on("connection",L=>{L.on("data",P=>l(L,P));let B=()=>{let P=e.clients.get(L);e.clients.delete(L),P&&(e.rosterMap.delete(P),h())};L.on("close",B),L.on("error",B)}),A.on("error",L=>{L.type==="unavailable-id"&&(e.claiming=!1,A.destroy(),setTimeout(a,400+Math.random()*900))}),A.on("disconnected",()=>{A.destroyed||setTimeout(()=>A.reconnect(),1e3)})}function l(A,L){if(!(!L||typeof L!="object")){if(L.t==="hello")e.clients.set(A,L.id),e.rosterMap.set(L.id,{id:L.id,nick:String(L.nick||"").slice(0,14),status:L.status,paint:L.paint|0,seen:t()}),Array.isArray(L.board)&&n.mergeBoard(L.board)?f():A.send({t:"board",e:n.getBoard()}),h();else if(L.t==="upd"){let B=e.rosterMap.get(L.id);B&&(B.status=L.status,B.nick=String(L.nick||B.nick).slice(0,14),B.paint=L.paint|0,B.seen=t(),h())}else if(L.t==="stat")L.e&&n.mergeBoard([L.e])&&f();else if(L.t==="ping"){let B=e.rosterMap.get(e.clients.get(A));B&&(B.seen=t())}}}function u(){return[...e.rosterMap.values()].map(({id:A,nick:L,status:B,paint:P})=>({id:A,nick:L,status:B,paint:P}))}function h(){let A=u();for(let L of e.clients.keys())L.open&&L.send({t:"roster",list:A});e.roster=A,n.roster(A)}function f(){let A=n.getBoard();for(let L of e.clients.keys())L.open&&L.send({t:"board",e:A});n.boardChanged()}function d(A){A&&(A.t==="roster"?(e.roster=A.list||[],n.roster(e.roster)):A.t==="board"&&(n.mergeBoard(A.e||[]),n.boardChanged()))}function g(){e.isLobby?(e.rosterMap.set(e.id,s()),h()):e.lobbyConn&&e.lobbyConn.open&&e.lobbyConn.send({t:"upd",id:e.id,nick:e.nick,status:e.status,paint:e.paint})}function _(A){e.status!==A&&(e.status=A,g())}function p(A){e.isLobby?n.mergeBoard([A])&&f():e.lobbyConn&&e.lobbyConn.open&&e.lobbyConn.send({t:"stat",e:A})}function m(A,L){if(!e.me||e.hostConn||e.room&&e.room.guests.has(A))return;e.room||(e.room={guests:new Map}),e.look=L;let B=e.roster.find($=>$.id===A),P=e.me.connect(A,{serialization:"json",reliable:!0}),H={id:A,conn:P,nick:B?B.nick:"?",state:"invited",look:null};e.room.guests.set(A,H),_("room"),n.room(),P.on("open",()=>P.send({t:"invite",id:e.id,nick:e.nick})),P.on("data",$=>{$&&($.t==="accept"?(H.state="ready",H.look=$.look,H.nick=String($.nick||H.nick).slice(0,14),n.room(),v()):$.t==="decline"?(H.state=$.busy?"busy":"declined",n.room(),setTimeout(()=>y(A),2500)):$.t==="s"&&n.guestState(A,$.d))});let K=()=>{e.room&&e.room.guests.get(A)===H&&(e.room.guests.delete(A),n.guestLeft(A),n.room(),v())};P.on("close",K),P.on("error",K)}function y(A){if(!e.room)return;let L=e.room.guests.get(A);if(L){e.room.guests.delete(A);try{L.conn.close()}catch{}n.room(),v()}}function v(){if(!e.room)return;let A=[e.nick,...[...e.room.guests.values()].filter(L=>L.state==="ready").map(L=>L.nick)];for(let L of e.room.guests.values())L.state==="ready"&&L.conn.open&&L.conn.send({t:"room",list:A})}function S(){return e.room?[...e.room.guests.values()].filter(A=>A.state==="ready"&&A.conn.open):[]}function E(A){if(e.room){for(let L of[...e.room.guests.values()])L.state!=="ready"&&y(L.id);M(A),_("racing")}}function M(A){if(e.room)for(let L of e.room.guests.values())L.state==="ready"&&L.conn.open&&L.conn.send(A)}function x(){if(e.room){for(let A of e.room.guests.values())try{A.conn.close()}catch{}e.room=null}if(e.hostConn){try{e.hostConn.close()}catch{}e.hostConn=null}_("idle"),n.room()}function b(A){let L=null;A.on("data",P=>{if(P)if(P.t==="invite"){if(L=P.id,e.hostConn||e.room||!n.canAccept()){A.send({t:"decline",busy:!0}),setTimeout(()=>A.close(),500);return}e.pending.set(P.id,A),n.invite({id:P.id,nick:String(P.nick||"?").slice(0,14)})}else e.hostConn===A&&(P.t==="start"?(_("racing"),n.start(P)):P.t==="S"?n.hostStates(P.l):P.t==="room"&&n.roomList(P.list))});let B=()=>{L&&e.pending.get(L)===A&&(e.pending.delete(L),n.inviteGone(L)),e.hostConn===A&&(e.hostConn=null,_("idle"),n.hostLeft())};A.on("close",B),A.on("error",B)}function R(A,L,B){let P=e.pending.get(A);if(!P)return!1;if(e.pending.delete(A),L&&P.open){for(let[H,K]of e.pending)K.send({t:"decline"}),setTimeout(()=>K.close(),400),n.inviteGone(H);return e.pending.clear(),e.hostConn=P,e.hostNick=(e.roster.find(H=>H.id===A)||{}).nick||"",P.send({t:"accept",nick:e.nick,look:B}),_("room"),!0}try{P.send({t:"decline"}),setTimeout(()=>P.close(),400)}catch{}return!1}function I(A){e.hostConn&&e.hostConn.open&&e.hostConn.send(A)}return{start:o,setStatus:_,reportStat:p,challenge:m,dropGuest:y,readyGuests:S,startRoom:E,broadcast:M,closeRoom:x,respond:R,toHost:I,get id(){return e.id},get online(){return e.online},get roster(){return e.roster},get room(){return e.room},get inRoomAsGuest(){return!!e.hostConn},get hostNick(){return e.hostNick},get status(){return e.status}}}var Rh=n=>440*Math.pow(2,(n-69)/12);function D1(n){return()=>{n|=0,n=n+1831565813|0;let e=Math.imul(n^n>>>15,1|n);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}var q_=[0,2,4,5,7,9,11],N1=[0,2,3,5,7,9,10],O1=[0,1,4,5,7,8,10],Gp=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],Y_=[0,2,4,6,8,10,12,14],Ec=[2,6,10,14],$_={beach:{bpm:112,root:60,scale:q_,prog:[5,3,0,4],seed:7,lead:"flute",arp:"marimba",arpRate:1,cut:[600,4200],swing:.05,motif:[[0,3],[3,3],[6,2],[8,2],[10,4],[16,3],[19,3],[22,2],[24,6]],bass:[[0,0,2],[3,0,2],[6,12,1],[8,0,2],[11,0,2],[14,12,1]],drums:{kick:[0,4,8,12],clap:[4,12],ohat:Ec,shaker:Gp},verse:{kick:[0,4,8,12],hat:Ec,shaker:Gp}},desert:{bpm:100,root:52,scale:O1,prog:[0,1,0,6],seed:21,lead:"oud",arp:"pluck",arpRate:2,cut:[450,2400],swing:0,drone:!0,motif:[[0,2],[2,1],[3,3],[6,2],[8,6],[16,2],[18,2],[20,2],[22,2],[24,8]],bass:[[0,0,3],[6,0,2],[8,0,3],[12,0,2],[14,12,1]],drums:{kick:[0,7,10],clap:[4,12],dum:[0,8],tek:[3,6,10,14],tik:[1,5,9,13,15]},verse:{dum:[0,8],tek:[3,6,10,12,14],tik:[1,5,9,13,15]}},country:{bpm:124,root:55,scale:q_,prog:[0,4,5,3],seed:33,lead:"synth",arp:"pluck",arpRate:1,cut:[700,5e3],swing:.06,motif:[[0,2],[2,2],[4,2],[6,4],[10,2],[12,4],[16,2],[18,2],[20,2],[22,2],[24,8]],bass:[[0,0,2],[2,0,2],[6,0,2],[10,0,2],[14,12,2]],drums:{kick:[0,4,8,12],clap:[4,12],hat:Y_,ohat:Ec},verse:{kick:[0,8],clap:[4,12],hat:Y_}},snow:{bpm:86,root:62,scale:N1,prog:[0,3,6,4],seed:47,lead:"glass",arp:"marimba",arpRate:1,cut:[500,3800],swing:.03,stabs:[0,3,6,8,11,14],motif:[[0,4],[4,2],[6,4],[10,6],[16,3],[19,3],[22,6],[28,4]],bass:[[0,0,6],[6,0,4],[10,0,6]],drums:{kick:[0,10],clap:[8],hat:Ec,shaker:Gp},verse:{kick:[0,10],shaker:Ec}}};function U1(n,e,t){let i=Math.floor(n.sampleRate*e),s=n.createBuffer(2,i,n.sampleRate);for(let r=0;r<2;r++){let o=s.getChannelData(r),a=0;for(let c=0;c<i;c++)a+=(Math.random()*2-1-a)*(.25+.6*(1-c/i)),o[c]=a*Math.pow(1-c/i,t)}return s}function Vp(n,e){let t=n.createGain();t.gain.value=0,t.connect(e);let i=n.createDynamicsCompressor();i.threshold.value=-16,i.ratio.value=3.5,i.attack.value=.01,i.release.value=.2,i.connect(t);let s=n.createGain();s.gain.value=.9,s.connect(i);let r=n.createGain();r.connect(s);let o=n.createGain();o.connect(s);let a=n.createConvolver();a.buffer=U1(n,2,2.4);let c=n.createGain();c.gain.value=.5,a.connect(c),c.connect(s);let l=n.createDelay(2),u=n.createGain(),h=n.createBiquadFilter(),f=n.createGain();u.gain.value=.38,h.type="lowpass",h.frequency.value=2800,f.gain.value=.3,l.connect(h),h.connect(u),u.connect(l),h.connect(f),f.connect(s),f.connect(a);let d=n.createBuffer(1,n.sampleRate,n.sampleRate);{let D=d.getChannelData(0);for(let O=0;O<D.length;O++)D[O]=Math.random()*2-1}let g=(D,O,W,k,ee,le=1e-4,oe=0)=>{D.gain.setValueAtTime(1e-4,O),D.gain.linearRampToValueAtTime(k,O+W),D.gain.setTargetAtTime(le,O+W+oe,ee/3)},_=(D,O,W,k,ee=0)=>{let le=n.createOscillator();return le.type=D,le.frequency.setValueAtTime(O,W),le.detune.value=ee,le.start(W),le.stop(k),le},p=(D,O,W=.7)=>{let k=n.createBiquadFilter();return k.type=D,k.frequency.value=O,k.Q.value=W,k},m=(D,O)=>{let W=n.createStereoPanner();return W.pan.value=O,D.connect(W),W};function y(D,O,W=0,k=0){if(D.connect(O),W){let ee=n.createGain();ee.gain.value=W,D.connect(ee),ee.connect(a)}if(k){let ee=n.createGain();ee.gain.value=k,D.connect(ee),ee.connect(l)}}function v(D,O,W,k,ee=.008,le=5.2,oe=.18){let Ie=_("sine",le,W,k),Ce=n.createGain();Ce.gain.setValueAtTime(0,W),Ce.gain.linearRampToValueAtTime(O*ee,W+oe+.25),Ie.connect(Ce),Ce.connect(D.frequency)}let S=0,E={flute(D,O,W,k){let ee=O+k+.5,le=n.createGain(),oe=p("lowpass",3200);le.gain.setValueAtTime(1e-4,O),le.gain.linearRampToValueAtTime(W*.3,O+.04),le.gain.setTargetAtTime(W*.22,O+.05,.1),le.gain.setTargetAtTime(1e-4,O+k*.92,.07);for(let Pt of[-6,6]){let ut=_("triangle",D,O,ee,Pt);S&&Math.abs(Math.log2(D/S))<.6&&(ut.frequency.setValueAtTime(S,O),ut.frequency.exponentialRampToValueAtTime(D,O+.05)),v(ut,D,O,ee),ut.connect(oe)}let Ie=_("sine",D*2,O,ee),Ce=n.createGain();Ce.gain.value=.12,Ie.connect(Ce),Ce.connect(oe);let Ae=n.createBufferSource(),$e=p("bandpass",D*2,1.5),ht=n.createGain();Ae.buffer=d,ht.gain.setValueAtTime(.5,O),ht.gain.setTargetAtTime(.12,O+.03,.05),Ae.connect($e),$e.connect(ht),ht.connect(oe),Ae.start(O,Math.random()*.5),Ae.stop(ee),oe.connect(le),y(le,o,.35,.25)},synth(D,O,W,k){let ee=O+k+.4,le=n.createGain(),oe=p("lowpass",D*6,3);oe.frequency.setValueAtTime(D*9,O),oe.frequency.setTargetAtTime(D*3.5,O+.01,.15),le.gain.setValueAtTime(1e-4,O),le.gain.linearRampToValueAtTime(W*.17,O+.01),le.gain.setTargetAtTime(W*.13,O+.02,.12),le.gain.setTargetAtTime(1e-4,O+k*.9,.06);for(let[Ie,Ce,Ae]of[["sawtooth",-9,1],["sawtooth",9,1],["square",0,.5]]){let $e=_(Ie,D*Ae,O,ee,Ce);S&&Math.abs(Math.log2(D/S))<.6&&($e.frequency.setValueAtTime(S*Ae,O),$e.frequency.exponentialRampToValueAtTime(D*Ae,O+.04)),v($e,D*Ae,O,ee,.006),$e.connect(oe)}oe.connect(le),y(le,o,.3,.3)},oud(D,O,W,k,ee){let le=k>ee*2.5?Math.round(k/ee):1;for(let oe=0;oe<le;oe++)E.pick(D,O+oe*ee,W*(oe?.7:1),le>1?ee*1.2:.7,oe===0)},pick(D,O,W,k,ee){let le=n.createGain(),oe=p("lowpass",D*8,5);oe.frequency.setValueAtTime(D*11,O),oe.frequency.exponentialRampToValueAtTime(D*1.4,O+.3),g(le,O,.003,W*.3,k);for(let[Ie,Ce]of[["sawtooth",-5],["square",5]]){let Ae=_(Ie,D,O,O+k+.3,Ce);ee&&(Ae.frequency.setValueAtTime(D*.975,O),Ae.frequency.exponentialRampToValueAtTime(D,O+.05)),Ae.connect(oe)}oe.connect(le),y(m(le,(Math.random()-.5)*.3),o,.4,.2)},glass(D,O,W,k){let ee=O+k+1.6,le=n.createGain();g(le,O,.01,W*.26,Math.max(.8,k*1.2));let oe=_("sine",D,O,ee),Ie=_("sine",D*2,O,ee),Ce=n.createGain();Ce.gain.setValueAtTime(D*.9,O),Ce.gain.exponentialRampToValueAtTime(D*.08,O+.6),Ie.connect(Ce),Ce.connect(oe.frequency),v(oe,D,O,ee,.005,4.5,.3);let Ae=_("triangle",D,O,ee,7),$e=n.createGain();$e.gain.setValueAtTime(0,O),$e.gain.linearRampToValueAtTime(.4,O+.12),Ae.connect($e),$e.connect(le),oe.connect(le),y(le,o,.5,.35)},marimba(D,O,W,k){let ee=n.createGain();g(ee,O,.002,W*.22,.4),_("sine",D,O,O+.6).connect(ee);let le=_("sine",D*4,O,O+.12),oe=n.createGain();g(oe,O,.001,.35,.06),le.connect(oe),oe.connect(ee),y(m(ee,k),r,.25,.3)},pluck(D,O,W,k){let ee=n.createGain(),le=p("lowpass",D*6,2);le.frequency.setValueAtTime(D*7,O),le.frequency.exponentialRampToValueAtTime(D*1.2,O+.2),g(ee,O,.002,W*.16,.26),_("sawtooth",D,O,O+.4,4).connect(le),_("sawtooth",D,O,O+.4,-4).connect(le),le.connect(ee),y(m(ee,k),r,.2,.3)},chord(D,O,W,k,ee,le){let oe=n.createGain(),Ie=p("lowpass",k,.9),Ce=O+W+.6;oe.gain.setValueAtTime(1e-4,O),oe.gain.linearRampToValueAtTime(ee,O+(le?.006:.03)),le||oe.gain.setValueAtTime(ee,O+W-.04),oe.gain.setTargetAtTime(1e-4,O+(le?.02:W-.04),le?W*.45:.1),le&&(Ie.frequency.setValueAtTime(k*1.6,O),Ie.frequency.exponentialRampToValueAtTime(k*.6,O+W)),D.forEach((Ae,$e)=>{for(let[ht,Pt]of[[-11,-.7],[11,.7]]){let ut=_("sawtooth",Ae,O,Ce,ht+($e-1.5)*1.5);m(ut,Pt*(.6+$e*.1)).connect(Ie)}}),Ie.connect(oe),y(oe,r,.35,0)},drone(D,O,W){let k=n.createGain(),ee=p("lowpass",500);k.gain.setValueAtTime(1e-4,O),k.gain.linearRampToValueAtTime(.06,O+.5),k.gain.setTargetAtTime(1e-4,O+W-.1,.15);for(let[le,oe]of[[.5,-6],[.5,6],[.75,0]])_("sawtooth",D*le,O,O+W+.6,oe).connect(ee);ee.connect(k),y(k,r,.4)},bass(D,O,W){let k=n.createGain(),ee=p("lowpass",200,4);ee.frequency.setValueAtTime(900,O),ee.frequency.setTargetAtTime(220,O+.005,.07),k.gain.setValueAtTime(1e-4,O),k.gain.linearRampToValueAtTime(.32,O+.006),k.gain.setTargetAtTime(1e-4,O+W*.85,.04),_("sawtooth",D,O,O+W+.3).connect(ee),ee.connect(k);let le=n.createGain();le.gain.value=.9,_("sine",D,O,O+W+.3).connect(le),le.connect(k),k.connect(r)},kick(D,O=1){let W=n.createGain(),k=_("sine",165,D,D+.45);k.frequency.exponentialRampToValueAtTime(48,D+.11),W.gain.setValueAtTime(1e-4,D),W.gain.linearRampToValueAtTime(O*.95,D+.003),W.gain.setTargetAtTime(1e-4,D+.06,.1),k.connect(W),W.connect(o),E.noise(D,O*.2,"highpass",3500,.7,.012,o),r.gain.setValueAtTime(.25,D),r.gain.setTargetAtTime(1,D+.02,.075)},noise(D,O,W,k,ee,le,oe,Ie=0,Ce=0){let Ae=n.createBufferSource(),$e=p(W,k,ee),ht=n.createGain();Ae.buffer=d,g(ht,D,.001,O,le),Ae.connect($e),$e.connect(ht),y(ht,oe,Ie),Ae.start(D,Ce||Math.random()*.5),Ae.stop(D+le*1.5+.1)},clap(D,O=1){for(let W of[0,.011,.023])E.noise(D+W,O*.28,"bandpass",1400,1.1,.025,o);E.noise(D+.03,O*.3,"bandpass",1300,.9,.16,o,.35)},snare(D,O){E.noise(D,O*.32,"bandpass",1900,.8,.12,o,.25);let W=n.createGain(),k=_("triangle",210,D,D+.1);g(W,D,.001,O*.18,.06),k.connect(W),W.connect(o)},tom(D,O,W,k,ee){let le=n.createGain(),oe=_("sine",W,D,D+ee+.1);oe.frequency.exponentialRampToValueAtTime(k,D+ee),g(le,D,.002,O,ee),oe.connect(le),y(le,o,.15)},riser(D,O){let W=n.createBufferSource(),k=p("bandpass",300,3),ee=n.createGain();W.buffer=d,W.loop=!0,k.frequency.setValueAtTime(300,D),k.frequency.exponentialRampToValueAtTime(9e3,D+O),ee.gain.setValueAtTime(1e-4,D),ee.gain.linearRampToValueAtTime(.16,D+O),ee.gain.setValueAtTime(1e-4,D+O+.01),W.connect(k),k.connect(ee),y(ee,o,.5),W.start(D),W.stop(D+O+.05)},impact(D){E.noise(D,.22,"highpass",5e3,.5,1.6,o,.6);let O=n.createGain(),W=_("sine",70,D,D+1.2);W.frequency.exponentialRampToValueAtTime(32,D+.9),g(O,D,.005,.5,.9),W.connect(O),O.connect(o)}},M={kick:D=>E.kick(D),clap:D=>E.clap(D),hat:(D,O)=>E.noise(D,O%4===2?.09:.055,"highpass",8e3,.8,.035,o),ohat:D=>E.noise(D,.085,"highpass",7500,.8,.2,o,.1),shaker:(D,O)=>E.noise(D,O%2?.03:.05,"bandpass",7e3,1.2,.045,o),dum:D=>E.tom(D,.6,140,70,.32),tek:D=>{E.noise(D,.2,"bandpass",3400,2,.05,o,.15),E.tom(D,.1,520,430,.05)},tik:D=>E.noise(D,.06,"bandpass",5200,3,.03,o)},x=(D,O,W=0)=>{let k=D.scale.length,ee=Math.floor(O/k);return D.root+D.scale[(O%k+k)%k]+12*(ee+W)},b=(D,O)=>[O,O+2,O+4,O+6].map(W=>{let k=x(D,W);for(;k<57;)k+=12;for(;k>=69;)k-=12;return Rh(k)}).sort((W,k)=>W-k),R=D=>[D,D+2,D+4];function I(D){let O=D1(D.seed*101),W=(oe,Ie)=>{let Ce=oe,Ae=99;for(let $e of R(Ie))for(let ht of[-7,0,7,14]){let Pt=$e+ht;Math.abs(Pt-oe)<Ae&&(Ae=Math.abs(Pt-oe),Ce=Pt)}return Ce},k=[],ee=9;for(let[oe,Ie]of D.motif){let Ce=O();ee+=Ce<.35?-1:Ce<.7?1:Ce<.85?O()<.5?-2:2:0,ee=Math.max(5,Math.min(14,ee)),k.push([oe,Ie,ee])}let le=(oe,Ie)=>k.map(([Ce,Ae,$e],ht)=>{let Pt=oe+(Ce>>4),ut=D.prog[Pt%4],In=Ce%8===0||Ae>=4?W($e,ut):$e;return ht===k.length-1&&Ie!=null&&(In=W(Ie,ut)),[Pt*16+Ce%16,Ae,In]});return[...le(0),...le(2,11),...le(4),...le(6,7)]}let A=null,L=null,B=0,P=0,H=!1,K=0,$=0,X=0;function G(D,O){let W=D>>4,k=D&15,ee=60/A.bpm/4,le=ee*16,oe=A.prog[W%4],Ie=O+(k%2?A.swing*ee*2:0),Ce=K>.85,Ae=Ce&&W>=8,$e=Ce&&W===7&&k>=12,ht=W%8,Pt=Ce?Ae?A.cut[1]:A.cut[0]+(A.cut[1]*.6-A.cut[0])*ht/7:A.cut[0],ut=b(A,oe);if(Ae&&A.stabs?A.stabs.includes(k)&&E.chord(ut,Ie,ee*2.2,Pt,.055):k===0&&E.chord(ut,Ie,le,Pt,Ce?.05:.06),A.drone&&k===0&&E.drone(Rh(x(A,0,-1)),Ie,le),k%A.arpRate===0&&!$e){let At=[...ut,ut[0]*2],cn=[0,1,2,3,4,3,2,1][k/A.arpRate%8];E[A.arp](At[cn]*(Ae?2:1),Ie,Ce?Ae?.8:.9:.6,k%4<2?-.35:.35)}if(Ce&&!$e)for(let[At,cn,Ln]of A.bass)At===k&&E.bass(Rh(x(A,oe,-2)+cn),Ie,Ln*ee);if(Ae){for(let[At,cn,Ln]of L)if(At===ht*16+k){let Dn=Rh(x(A,Ln,0));E[A.lead](Dn,Ie,1,cn*ee,ee),X%2&&E[A.lead](Dn*2,Ie,.45,cn*ee,ee),S=Dn}}let In=Ae?A.drums:A.verse;if(!$e)for(let At in In)In[At].includes(k)&&(Ce||At==="shaker"||At==="tik"||At==="hat")&&M[At](Ie,k);Ce&&(W===6&&k===0&&E.riser(Ie,le*2),W===7&&k%(k<8?2:1)===0&&E.snare(Ie,.35+.65*k/15),W===8&&k===0&&E.impact(Ie),W===15&&k>=12&&E.snare(Ie,.5+k*.03))}function J(){if(!A||!H)return;let D=n.currentTime+.15,O=60/A.bpm/4;for(P<n.currentTime-.2&&(P=n.currentTime+.05);P<D;)G(B,P),P+=O,B=(B+1)%256,B||X++}function se(D){let O=$_[D]||$_.beach;O!==A&&(A=O,L=I(A),B=0,X=0,S=0,P=n.currentTime+.1,l.delayTime.value=180/A.bpm/4)}function ye(D){H=!!D,H&&!$&&($=setInterval(J,25)),!H&&$&&(clearInterval($),$=0),t.gain.setTargetAtTime(H?K*.5:0,n.currentTime,.2),H&&(P=n.currentTime+.1)}function Le(D){Math.abs(D-K)<.01||(K=D,t.gain.setTargetAtTime(H?K*.5:0,n.currentTime,.4))}function j(D,O,W=1){A=null,se(D),K=W,t.gain.value=W*.5;let k=.05,ee=60/A.bpm/4;for(let le=0;k<O;le++,k+=ee)G(B,k),B=(B+1)%256,B||X++}return{setTheme:se,setOn:ye,setLevel:Le,prerender:j}}var Wp=8,Ch={mudCol:{value:new ae(7033142)}};function K_(n){return{wearAmt:{value:n},dmg:{value:Array.from({length:Wp},()=>new _t(0,-99,0,0))},dmgN:0}}function Z_(n){for(let e of n.dmg.value)e.set(0,-99,0,0);n.dmgN=0}var F1=`
uniform sampler2D wearMap; uniform float wearAmt;
#ifdef WEAR_DECAL
uniform sampler2D decalSide, decalHood; uniform vec4 sideBox, hoodBox;
#endif
varying vec3 vWearNrm; uniform float wearScr; uniform vec3 mudCol; uniform vec4 dmg[${Wp}];
varying vec3 vWearPos;
float wHash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float wNoise(vec3 x) { vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(wHash(i), wHash(i + vec3(1,0,0)), f.x), mix(wHash(i + vec3(0,1,0)), wHash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(wHash(i + vec3(0,0,1)), wHash(i + vec3(1,0,1)), f.x), mix(wHash(i + vec3(0,1,1)), wHash(i + vec3(1,1,1)), f.x), f.y), f.z); }
`;function Xp(n,e,t,i=1,s=null){return n.defines=Object.assign(n.defines||{},{USE_UV:""},s?{WEAR_DECAL:""}:{}),n.userData.worn=!0,n.onBeforeCompile=r=>{r.uniforms.wearMap={value:e},r.uniforms.wearAmt=t.wearAmt,r.uniforms.wearScr={value:i},r.uniforms.mudCol=Ch.mudCol,r.uniforms.dmg=t.dmg,s&&(r.uniforms.decalSide={value:s.side},r.uniforms.decalHood={value:s.hood},r.uniforms.sideBox={value:s.sideBox},r.uniforms.hoodBox={value:s.hoodBox}),r.vertexShader=`varying vec3 vWearPos; varying vec3 vWearNrm;
`+r.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
 vWearPos = position; vWearNrm = normal;`),r.fragmentShader=F1+r.fragmentShader.replace("#include <map_fragment>",`#include <map_fragment>
        vec3 wr = texture2D(wearMap, vUv).rgb;
        float dm = 0.0;
        for (int i = 0; i < ${Wp}; i++) { float d = length(vWearPos - dmg[i].xyz) + (wNoise(vWearPos * 7.0) - 0.5) * 0.45; dm = max(dm, dmg[i].w * (1.0 - smoothstep(0.12, 0.8, d))); }
        float mudK = clamp(wr.b * (0.3 + wearAmt) * 1.7, 0.0, 1.0);
        float scrK = clamp(wr.g * (0.3 + wearAmt) * 2.0 + dm * smoothstep(0.42, 0.6, wNoise(vWearPos * vec3(30.0, 30.0, 4.0))), 0.0, 1.0) * wearScr;
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
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.035, 0.03, 0.028), dm * 0.6 * smoothstep(0.3, 0.7, wNoise(vWearPos * 3.0 + 4.0)));
        diffuseColor.rgb = mix(diffuseColor.rgb, mudCol * (0.75 + 0.5 * wNoise(vWearPos * 11.0)), mudK);`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
        roughnessFactor = mix(roughnessFactor, 0.4, scrK * 0.6); roughnessFactor = mix(roughnessFactor, 0.95, max(mudK, dm * 0.5));`).replace("#include <metalnessmap_fragment>",`#include <metalnessmap_fragment>
        metalnessFactor = mix(metalnessFactor, 0.9, scrK); metalnessFactor *= 1.0 - mudK;`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
        if (dm > 0.01) normal = normalize(normal + dm * 0.55 * vec3(wNoise(vWearPos * 6.0) - 0.5, wNoise(vWearPos * 6.0 + 9.0) - 0.5, 0.0));`).replace("#include <lights_physical_fragment>",`#include <lights_physical_fragment>
        #ifdef USE_CLEARCOAT
          material.clearcoat *= 1.0 - max(mudK, max(scrK, dm));
        #endif`)},n.customProgramCacheKey=()=>"worn"+(n.isMeshPhysicalMaterial?"P":"S")+(s?"D":""),n.needsUpdate=!0,n}function J_(n){let e=new Map,t=new Map,i=n.clone();return j_(n,i,function(s,r){e.set(r,s),t.set(s,r)}),i.traverse(function(s){if(!s.isSkinnedMesh)return;let r=s,o=e.get(s),a=o.skeleton.bones;r.skeleton=o.skeleton.clone(),r.bindMatrix.copy(o.bindMatrix),r.skeleton.bones=a.map(function(c){return t.get(c)}),r.bind(r.skeleton,r.bindMatrix)}),i}function j_(n,e,t){t(n,e);for(let i=0;i<n.children.length;i++)j_(n.children[i],e.children[i],t)}var Ph=class extends xi{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new jp(t)}),this.register(function(t){return new Qp(t)}),this.register(function(t){return new em(t)}),this.register(function(t){return new lm(t)}),this.register(function(t){return new um(t)}),this.register(function(t){return new hm(t)}),this.register(function(t){return new nm(t)}),this.register(function(t){return new im(t)}),this.register(function(t){return new sm(t)}),this.register(function(t){return new rm(t)}),this.register(function(t){return new Jp(t)}),this.register(function(t){return new om(t)}),this.register(function(t){return new tm(t)}),this.register(function(t){return new cm(t)}),this.register(function(t){return new am(t)}),this.register(function(t){return new Kp(t)}),this.register(function(t){return new Ih(t,ot.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Ih(t,ot.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new fm(t)})}load(e,t,i,s){let r=this,o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){let l=li.extractUrlBase(e);o=li.resolveURL(l,this.path)}else o=li.extractUrlBase(e);this.manager.itemStart(e);let a=function(l){s?s(l):console.error(l),r.manager.itemError(e),r.manager.itemEnd(e)},c=new ys(this.manager);c.setPriority(this.priority),c.setCache(this.cache),c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(l){try{r.parse(l,o,function(u){t(u),r.manager.itemEnd(e)},a)}catch(u){a(u)}},i,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,i,s){let r,o={},a={},c=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(c.decode(new Uint8Array(e,0,4))===ix){try{o[ot.KHR_BINARY_GLTF]=new dm(e)}catch(h){s&&s(h);return}r=JSON.parse(o[ot.KHR_BINARY_GLTF].content)}else r=JSON.parse(c.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let l=new vm(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,priority:this.priority,cache:this.cache,withCredentials:this.withCredentials,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){let h=this.pluginCallbacks[u](l);h.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[h.name]=h,o[h.name]=!0}if(r.extensionsUsed)for(let u=0;u<r.extensionsUsed.length;++u){let h=r.extensionsUsed[u],f=r.extensionsRequired||[];switch(h){case ot.KHR_MATERIALS_UNLIT:o[h]=new Zp;break;case ot.KHR_DRACO_MESH_COMPRESSION:o[h]=new pm(r,this.dracoLoader);break;case ot.KHR_TEXTURE_TRANSFORM:o[h]=new mm;break;case ot.KHR_MESH_QUANTIZATION:o[h]=new gm;break;default:f.indexOf(h)>=0&&a[h]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+h+'".')}}l.setExtensions(o),l.setPlugins(a),l.parse(i,s)}parseAsync(e,t){let i=this;return new Promise(function(s,r){i.parse(e,t,s,r)})}};function B1(){let n={};return{get:function(e){return n[e]},add:function(e,t){n[e]=t},remove:function(e){delete n[e]},removeAll:function(){n={}}}}function Xt(n,e,t){let i=n.json.materials[e];return i.extensions&&i.extensions[t]?i.extensions[t]:null}var ot={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DIFFUSE_ROUGHNESS:"KHR_materials_diffuse_roughness",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},Kp=class{constructor(e){this.parser=e,this.name=ot.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let i=0,s=t.length;i<s;i++){let r=t[i];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,i="light:"+e,s=t.cache.get(i);if(s)return s;let r=t.json,c=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e],l,u=new ae(16777215);c.color!==void 0&&u.setRGB(c.color[0],c.color[1],c.color[2],An);let h=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new Ar(u),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new qa(u),l.distance=h;break;case"spot":l=new wr(u),l.distance=h,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),Ji(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=t.createUniqueName(c.name||"light_"+e),s=Promise.resolve(l),t.cache.add(i,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,i=this.parser,r=i.json.nodes[e],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(c){return i._getNodeRef(t.cache,a,c)})}},Zp=class{constructor(){this.name=ot.KHR_MATERIALS_UNLIT}getMaterialType(){return yn}extendParams(e,t,i){let s=[];e.color=new ae(1,1,1),e.opacity=1;let r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let o=r.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],An),e.opacity=o[3]}r.baseColorTexture!==void 0&&s.push(i.assignTexture(e,"map",r.baseColorTexture,Dt))}return Promise.all(s)}},Jp=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let i=Xt(this.parser,e,this.name);return i===null||i.emissiveStrength!==void 0&&(t.emissiveIntensity=i.emissiveStrength),Promise.resolve()}},jp=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Xt(this.parser,e,this.name)!==null?vn:null}extendMaterialParams(e,t){let i=Xt(this.parser,e,this.name);if(i===null)return Promise.resolve();let s=[];if(i.clearcoatFactor!==void 0&&(t.clearcoat=i.clearcoatFactor),i.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",i.clearcoatTexture)),i.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=i.clearcoatRoughnessFactor),i.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",i.clearcoatRoughnessTexture)),i.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",i.clearcoatNormalTexture)),i.clearcoatNormalTexture.scale!==void 0)){let r=i.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Ee(r,r)}return Promise.all(s)}},Qp=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_DIFFUSE_ROUGHNESS}getMaterialType(e){return Xt(this.parser,e,this.name)!==null?vn:null}extendMaterialParams(e,t){let i=Xt(this.parser,e,this.name);if(i===null)return Promise.resolve();let s=[];return t.diffuseRoughness=i.diffuseRoughnessFactor!==void 0?i.diffuseRoughnessFactor:0,i.diffuseRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"diffuseRoughnessMap",i.diffuseRoughnessTexture)),Promise.all(s)}},em=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Xt(this.parser,e,this.name)!==null?vn:null}extendMaterialParams(e,t){let i=Xt(this.parser,e,this.name);return i===null||(t.dispersion=i.dispersion!==void 0?i.dispersion:0),Promise.resolve()}},tm=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Xt(this.parser,e,this.name)!==null?vn:null}extendMaterialParams(e,t){let i=Xt(this.parser,e,this.name);if(i===null)return Promise.resolve();let s=[];return i.iridescenceFactor!==void 0&&(t.iridescence=i.iridescenceFactor),i.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",i.iridescenceTexture)),i.iridescenceIor!==void 0&&(t.iridescenceIOR=i.iridescenceIor),i.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessMinimum=i.iridescenceThicknessMinimum),i.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessMaximum=i.iridescenceThicknessMaximum),i.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",i.iridescenceThicknessTexture)),Promise.all(s)}},nm=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_SHEEN}getMaterialType(e){return Xt(this.parser,e,this.name)!==null?vn:null}extendMaterialParams(e,t){let i=Xt(this.parser,e,this.name);if(i===null)return Promise.resolve();let s=[];if(t.sheenColor=new ae(0,0,0),t.sheenRoughness=0,t.sheen=1,i.sheenColorFactor!==void 0){let r=i.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],An)}return i.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=i.sheenRoughnessFactor),i.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",i.sheenColorTexture,Dt)),i.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",i.sheenRoughnessTexture)),Promise.all(s)}},im=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Xt(this.parser,e,this.name)!==null?vn:null}extendMaterialParams(e,t){let i=Xt(this.parser,e,this.name);if(i===null)return Promise.resolve();let s=[];return i.transmissionFactor!==void 0&&(t.transmission=i.transmissionFactor),i.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",i.transmissionTexture)),Promise.all(s)}},sm=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_VOLUME}getMaterialType(e){return Xt(this.parser,e,this.name)!==null?vn:null}extendMaterialParams(e,t){let i=Xt(this.parser,e,this.name);if(i===null)return Promise.resolve();let s=[];t.thickness=i.thicknessFactor!==void 0?i.thicknessFactor:0,i.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",i.thicknessTexture)),t.attenuationDistance=i.attenuationDistance||1/0;let r=i.attenuationColor||[1,1,1];return t.attenuationColor=new ae().setRGB(r[0],r[1],r[2],An),Promise.all(s)}},rm=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_IOR}getMaterialType(e){return Xt(this.parser,e,this.name)!==null?vn:null}extendMaterialParams(e,t){let i=Xt(this.parser,e,this.name);return i===null||(t.ior=i.ior!==void 0?i.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},om=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Xt(this.parser,e,this.name)!==null?vn:null}extendMaterialParams(e,t){let i=Xt(this.parser,e,this.name);if(i===null)return Promise.resolve();let s=[];t.specularIntensity=i.specularFactor!==void 0?i.specularFactor:1,i.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",i.specularTexture));let r=i.specularColorFactor||[1,1,1];return t.specularColor=new ae().setRGB(r[0],r[1],r[2],An),i.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",i.specularColorTexture,Dt)),Promise.all(s)}},am=class{constructor(e){this.parser=e,this.name=ot.EXT_MATERIALS_BUMP}getMaterialType(e){return Xt(this.parser,e,this.name)!==null?vn:null}extendMaterialParams(e,t){let i=Xt(this.parser,e,this.name);if(i===null)return Promise.resolve();let s=[];return t.bumpScale=i.bumpFactor!==void 0?i.bumpFactor:1,i.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",i.bumpTexture)),Promise.all(s)}},cm=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Xt(this.parser,e,this.name)!==null?vn:null}extendMaterialParams(e,t){let i=Xt(this.parser,e,this.name);if(i===null)return Promise.resolve();let s=[];return i.anisotropyStrength!==void 0&&(t.anisotropy=i.anisotropyStrength),i.anisotropyRotation!==void 0&&(t.anisotropyRotation=i.anisotropyRotation),i.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",i.anisotropyTexture)),Promise.all(s)}},lm=class{constructor(e){this.parser=e,this.name=ot.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,i=t.json,s=i.textures[e];if(!s.extensions||!s.extensions[this.name])return null;let r=s.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(i.extensionsRequired&&i.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,o)}},um=class{constructor(e){this.parser=e,this.name=ot.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,i=this.parser,s=i.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=s.images[o.source],c=i.textureLoader;if(a.uri){let l=i.options.manager.getHandler(a.uri);l!==null&&(c=l)}return i.loadTextureImage(e,o.source,c)}},hm=class{constructor(e){this.parser=e,this.name=ot.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,i=this.parser,s=i.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=s.images[o.source],c=i.textureLoader;if(a.uri){let l=i.options.manager.getHandler(a.uri);l!==null&&(c=l)}return i.loadTextureImage(e,o.source,c)}},Ih=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,i=t.bufferViews[e];if(i.extensions&&i.extensions[this.name]){let s=i.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){let c=s.byteOffset||0,l=s.byteLength||0,u=s.count,h=s.byteStride,f=new Uint8Array(a,c,l);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(u,h,f,s.mode,s.filter).then(function(d){return d.buffer}):o.ready.then(function(){let d=new ArrayBuffer(u*h);return o.decodeGltfBuffer(new Uint8Array(d),u,h,f,s.mode,s.filter),d})})}else return null}},fm=class{constructor(e){this.name=ot.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,i=t.nodes[e];if(!i.extensions||!i.extensions[this.name]||i.mesh===void 0)return null;let s=t.meshes[i.mesh];for(let l of s.primitives)if(l.mode!==Si.TRIANGLES&&l.mode!==Si.TRIANGLE_STRIP&&l.mode!==Si.TRIANGLE_FAN&&l.mode!==void 0)return null;let o=i.extensions[this.name].attributes,a=[],c={};for(let l in o)a.push(this.parser.getDependency("accessor",o[l]).then(u=>(c[l]=u,c[l])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(l=>{let u=l.pop(),h=u.isGroup?u.children:[u],f=l[0].count,d=[];for(let g of h){let _=new Xe,p=new N,m=new Rn,y=new N(1,1,1),v=new Vs(g.geometry,g.material,f);for(let E=0;E<f;E++)c.TRANSLATION&&p.fromBufferAttribute(c.TRANSLATION,E),c.ROTATION&&m.fromBufferAttribute(c.ROTATION,E),c.SCALE&&y.fromBufferAttribute(c.SCALE,E),v.setMatrixAt(E,_.compose(p,m,y));let S=null;for(let E in c)if(E==="_COLOR_0"){let M=c[E];v.instanceColor=new ds(M.array,M.itemSize,M.normalized)}else if(E!=="TRANSLATION"&&E!=="ROTATION"&&E!=="SCALE"){if(S===null){let x=v.geometry;S=new vt,S.name=x.name;for(let b in x.attributes)S.setAttribute(b,x.attributes[b]);for(let b in x.morphAttributes)S.morphAttributes[b]=x.morphAttributes[b];x.index!==null&&S.setIndex(x.index),S.morphTargetsRelative=x.morphTargetsRelative;for(let b of x.groups)S.addGroup(b.start,b.count,b.materialIndex);x.boundingBox!==null&&(S.boundingBox=x.boundingBox.clone()),x.boundingSphere!==null&&(S.boundingSphere=x.boundingSphere.clone()),S.drawRange.start=x.drawRange.start,S.drawRange.count=x.drawRange.count,S.userData=Object.assign({},x.userData),v.geometry=S}let M=c[E];S.setAttribute(E,new ds(M.array,M.itemSize,M.normalized))}Ft.prototype.copy.call(v,g),this.parser.assignFinalMaterial(v),d.push(v)}return u.isGroup?(u.clear(),u.add(...d),u):d[0]}))}},ix="glTF",wc=12,Q_={JSON:1313821514,BIN:5130562},dm=class{constructor(e){this.name=ot.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,wc),i=new TextDecoder;if(this.header={magic:i.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==ix)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let s=this.header.length-wc,r=new DataView(e,wc),o=0;for(;o<s;){let a=r.getUint32(o,!0);o+=4;let c=r.getUint32(o,!0);if(o+=4,c===Q_.JSON){let l=new Uint8Array(e,wc+o,a);this.content=i.decode(l)}else if(c===Q_.BIN){let l=wc+o;this.body=e.slice(l,l+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},pm=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=ot.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let i=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},c={},l={};for(let u in o){let h=xm[u]||u.toLowerCase();a[h]=o[u]}for(let u in e.attributes){let h=xm[u]||u.toLowerCase();if(o[u]!==void 0){let f=i.accessors[e.attributes[u]],d=jo[f.componentType];l[h]=d.name,c[h]=f.normalized===!0}}return t.getDependency("bufferView",r).then(function(u){return new Promise(function(h,f){s.decodeDracoFile(u,function(d){for(let g in d.attributes){let _=d.attributes[g],p=c[g];p!==void 0&&(_.normalized=p)}h(d)},a,l,An,f)})})}},mm=class{constructor(){this.name=ot.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let i=Math.cos(e.rotation),s=Math.sin(e.rotation);e.matrix.set(e.repeat.x*i,e.repeat.y*s,e.offset.x,-e.repeat.x*s,e.repeat.y*i,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},gm=class{constructor(){this.name=ot.KHR_MESH_QUANTIZATION}},Lh=class extends Wi{constructor(e,t,i,s){super(e,t,i,s)}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let o=0;o!==s;o++)t[o]=i[r+o];return t}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=a*2,l=a*3,u=s-t,h=(i-t)/u,f=h*h,d=f*h,g=e*l,_=g-l,p=-2*d+3*f,m=d-f,y=1-p,v=m-f+h;for(let S=0;S!==a;S++){let E=o[_+S+a],M=o[_+S+c]*u,x=o[g+S+a],b=o[g+S]*u;r[S]=y*E+v*M+p*x+m*b}return r}},k1=new Rn,_m=class extends Lh{interpolate_(e,t,i,s){let r=super.interpolate_(e,t,i,s);return k1.fromArray(r).normalize().toArray(r),r}},Si={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},jo={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},ex={9728:Zt,9729:un,9984:du,9985:zo,9986:Lr,9987:yi},tx={33071:jn,33648:vo,10497:gi},qp={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},xm={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},js={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},z1={CUBICSPLINE:void 0,LINEAR:xr,STEP:_r},Yp={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function H1(n){return n.DefaultMaterial===void 0&&(n.DefaultMaterial=new Nt({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Xi})),n.DefaultMaterial}function Br(n,e,t){for(let i in t.extensions)n[i]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[i]=t.extensions[i])}function Ji(n,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(n.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function G1(n,e,t){let i=!1,s=!1,r=!1;for(let l=0,u=e.length;l<u;l++){let h=e[l];if(h.POSITION!==void 0&&(i=!0),h.NORMAL!==void 0&&(s=!0),h.COLOR_0!==void 0&&(r=!0),i&&s&&r)break}if(!i&&!s&&!r)return Promise.resolve(n);let o=[],a=[],c=[];for(let l=0,u=e.length;l<u;l++){let h=e[l];if(i){let f=h.POSITION!==void 0?t.getDependency("accessor",h.POSITION):n.attributes.position;o.push(f)}if(s){let f=h.NORMAL!==void 0?t.getDependency("accessor",h.NORMAL):n.attributes.normal;a.push(f)}if(r){let f=h.COLOR_0!==void 0?t.getDependency("accessor",h.COLOR_0):n.attributes.color;c.push(f)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c)]).then(function(l){let u=l[0],h=l[1],f=l[2];return i&&(n.morphAttributes.position=u),s&&(n.morphAttributes.normal=h),r&&(n.morphAttributes.color=f),n.morphTargetsRelative=!0,n})}function V1(n,e){if(n.updateMorphTargets(),e.weights!==void 0)for(let t=0,i=e.weights.length;t<i;t++)n.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(n.morphTargetInfluences.length===t.length){n.morphTargetDictionary={};for(let i=0,s=t.length;i<s;i++)n.morphTargetDictionary[t[i]]=i}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function W1(n){let e,t=n.extensions&&n.extensions[ot.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+$p(t.attributes):e=n.indices+":"+$p(n.attributes)+":"+n.mode,n.targets!==void 0)for(let i=0,s=n.targets.length;i<s;i++)e+=":"+$p(n.targets[i]);return e}function $p(n){let e="",t=Object.keys(n).sort();for(let i=0,s=t.length;i<s;i++)e+=t[i]+":"+n[t[i]]+";";return e}function ym(n){switch(n){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function X1(n){return n.search(/\.jpe?g($|\?)/i)>0||n.search(/^data\:image\/jpeg/)===0?"image/jpeg":n.search(/\.webp($|\?)/i)>0||n.search(/^data\:image\/webp/)===0?"image/webp":n.search(/\.ktx2($|\?)/i)>0||n.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var q1=new Xe,vm=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new B1,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let i=!1,s=-1,r=!1,o=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let a=navigator.userAgent;i=/^((?!chrome|android).)*safari/i.test(a)===!0;let c=a.match(/Version\/(\d+)/);s=i&&c?parseInt(c[1],10):-1,r=a.indexOf("Firefox")>-1,o=r?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||i&&s<17||r&&o<98?(this.textureLoader=new Tr(this.options.manager),this.textureLoader.setPriority(this.options.priority),this.textureLoader.setCache(this.options.cache)):(this.textureLoader=new Ya(this.options.manager),this.textureLoader.setPriority(this.options.priority),this.textureLoader.setCache(this.options.cache)),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setWithCredentials(this.options.withCredentials),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new ys(this.options.manager),this.fileLoader.setPriority(this.options.priority),this.fileLoader.setCache(this.options.cache),this.fileLoader.setResponseType("arraybuffer"),(this.options.withCredentials||this.options.crossOrigin==="use-credentials")&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let i=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([i.getDependencies("scene"),i.getDependencies("animation"),i.getDependencies("camera")])}).then(function(o){let a={scene:o[0][s.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:s.asset,parser:i,userData:{}};return Br(r,a,s),Ji(a,s),Promise.all(i._invokeAll(function(c){return c.afterRoot&&c.afterRoot(a)})).then(function(){for(let c of a.scenes)c.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],i=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){let o=t[s].joints;for(let a=0,c=o.length;a<c;a++)e[o[a]].isBone=!0}for(let s=0,r=e.length;s<r;s++){let o=e[s];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(i[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,i){if(e.refs[t]<=1)return i;let s=i.clone(),r=(o,a)=>{let c=this.associations.get(o);c!=null&&this.associations.set(a,c);for(let[l,u]of o.children.entries())r(u,a.children[l])};return r(i,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let i=0;i<t.length;i++){let s=e(t[i]);if(s)return s}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let i=[];for(let s=0;s<t.length;s++){let r=e(t[s]);r&&i.push(r)}return i}getDependency(e,t){let i=e+":"+t,s=this.cache.get(i);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(i,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){let i=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,o){return i.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],i=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[ot.KHR_BINARY_GLTF].body);let s=this.options;return new Promise(function(r,o){i.load(li.resolveURL(t.uri,s.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(i){let s=t.byteLength||0,r=t.byteOffset||0;return i.slice(r,r+s)})}loadAccessor(e){let t=this,i=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){let o=qp[s.type],a=jo[s.componentType],c=s.normalized===!0,l=new a(s.count*o);return Promise.resolve(new gt(l,o,c))}let r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(o){let a=o[0],c=qp[s.type],l=jo[s.componentType],u=l.BYTES_PER_ELEMENT,h=u*c,f=s.byteOffset||0,d=s.bufferView!==void 0?i.bufferViews[s.bufferView].byteStride:void 0,g=s.normalized===!0,_,p;if(d&&d!==h){let m=Math.floor(f/d),y="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+m+":"+s.count,v=t.cache.get(y);v||(_=new l(a,m*d,s.count*d/u),v=new Hs(_,d/u),t.cache.add(y,v)),p=new Gs(v,c,f%d/u,g)}else a===null?_=new l(s.count*c):_=new l(a,f,s.count*c),p=new gt(_,c,g);if(s.sparse!==void 0){let m=qp.SCALAR,y=jo[s.sparse.indices.componentType],v=s.sparse.indices.byteOffset||0,S=s.sparse.values.byteOffset||0,E=new y(o[1],v,s.sparse.count*m),M=new l(o[2],S,s.sparse.count*c);a!==null&&(p=new gt(p.array.slice(),p.itemSize,p.normalized)),p.normalized=!1;for(let x=0,b=E.length;x<b;x++){let R=E[x];if(p.setX(R,M[x*c]),c>=2&&p.setY(R,M[x*c+1]),c>=3&&p.setZ(R,M[x*c+2]),c>=4&&p.setW(R,M[x*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}p.normalized=g}return p})}loadTexture(e){let t=this.json,i=this.options,r=t.textures[e].source,o=t.images[r],a=this.textureLoader;if(o.uri){let c=i.manager.getHandler(o.uri);c!==null&&(a=c)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,i){let s=this,r=this.json,o=r.textures[e],a=r.images[t],c=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[c])return this.textureCache[c];let l=this.loadImageSource(t,i).then(function(u){u.flipY=!1,u.name=o.name||a.name||"",u.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(u.name=a.uri);let f=(r.samplers||{})[o.sampler]||{};return u.magFilter=ex[f.magFilter]||un,u.minFilter=ex[f.minFilter]||yi,u.wrapS=tx[f.wrapS]||gi,u.wrapT=tx[f.wrapT]||gi,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==Zt&&u.minFilter!==un,s.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(e,t){let i=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(f=>f.clone());let o=s.images[e],a=self.URL||self.webkitURL,c=o.uri||"",l=!1,u;if(t.isKTX2Loader===!0&&o.bufferView!==void 0)u=i.getDependency("bufferView",o.bufferView).then(function(f){return new Promise(function(d,g){t.parse(f,d,g)})});else{if(o.bufferView!==void 0)c=i.getDependency("bufferView",o.bufferView).then(function(f){l=!0;let d=new Blob([f],{type:o.mimeType});return c=a.createObjectURL(d),c});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");u=Promise.resolve(c).then(function(f){return new Promise(function(d,g){let _=d;t.isImageBitmapLoader===!0&&(_=function(p){let m=new hn(p);m.needsUpdate=!0,d(m)}),t.load(li.resolveURL(f,r.path),_,void 0,g)})})}let h=u.then(function(f){return l===!0&&a.revokeObjectURL(c),Ji(f,o),f.userData.mimeType=o.mimeType||X1(o.uri),f}).catch(function(f){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),f});return this.sourceCache[e]=h,h}assignTexture(e,t,i,s){let r=this;return this.getDependency("texture",i.index).then(function(o){if(!o)return null;if(i.texCoord!==void 0&&i.texCoord>0&&(o=o.clone(),o.channel=i.texCoord),r.extensions[ot.KHR_TEXTURE_TRANSFORM]){let a=i.extensions!==void 0?i.extensions[ot.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let c=r.associations.get(o);o=r.extensions[ot.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,c)}}return s!==void 0&&(o.colorSpace=s),e[t]=o,o})}assignFinalMaterial(e){let t=e.geometry,i=e.material,s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){let a="PointsMaterial:"+i.uuid,c=this.cache.get(a);c||(c=new Xs,ei.prototype.copy.call(c,i),c.color.copy(i.color),c.map=i.map,c.sizeAttenuation=!1,this.cache.add(a,c)),i=c}else if(e.isLine){let a="LineBasicMaterial:"+i.uuid,c=this.cache.get(a);c||(c=new Co,ei.prototype.copy.call(c,i),c.color.copy(i.color),c.map=i.map,this.cache.add(a,c)),i=c}if(s||r||o){let a="ClonedMaterial:"+i.uuid+":";s&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let c=this.cache.get(a);c||(c=i.clone(),r&&(c.vertexColors=!0),o&&(c.flatShading=!0),s&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(a,c),this.associations.set(c,this.associations.get(i))),i=c}e.material=i}getMaterialType(){return Nt}loadMaterial(e){let t=this,i=this.json,s=this.extensions,r=i.materials[e],o,a={},c=r.extensions||{},l=[];if(c[ot.KHR_MATERIALS_UNLIT]){let h=s[ot.KHR_MATERIALS_UNLIT];o=h.getMaterialType(),l.push(h.extendParams(a,r,t))}else{let h=r.pbrMetallicRoughness||{};if(a.color=new ae(1,1,1),a.opacity=1,Array.isArray(h.baseColorFactor)){let f=h.baseColorFactor;a.color.setRGB(f[0],f[1],f[2],An),a.opacity=f[3]}h.baseColorTexture!==void 0&&l.push(t.assignTexture(a,"map",h.baseColorTexture,Dt)),a.metalness=h.metallicFactor!==void 0?h.metallicFactor:1,a.roughness=h.roughnessFactor!==void 0?h.roughnessFactor:1,h.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(a,"metalnessMap",h.metallicRoughnessTexture)),l.push(t.assignTexture(a,"roughnessMap",h.metallicRoughnessTexture))),o=this._invokeOne(function(f){return f.getMaterialType&&f.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(f){return f.extendMaterialParams&&f.extendMaterialParams(e,a)})))}r.doubleSided===!0&&(a.side=Sn);let u=r.alphaMode||Yp.OPAQUE;if(u===Yp.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,u===Yp.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==yn&&(l.push(t.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new Ee(1,1),r.normalTexture.scale!==void 0)){let h=r.normalTexture.scale;a.normalScale.set(h,h)}if(r.occlusionTexture!==void 0&&o!==yn&&(l.push(t.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==yn){let h=r.emissiveFactor;a.emissive=new ae().setRGB(h[0],h[1],h[2],An)}return r.emissiveTexture!==void 0&&o!==yn&&l.push(t.assignTexture(a,"emissiveMap",r.emissiveTexture,Dt)),Promise.all(l).then(function(){let h=new o(a);return r.name&&(h.name=r.name),Ji(h,r),t.associations.set(h,{materials:e}),r.extensions&&Br(s,h,r),h})}createUniqueName(e){let t=Lt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,i=this.extensions,s=this.primitiveCache;function r(a){return i[ot.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(c){return nx(c,a,t)})}let o=[];for(let a=0,c=e.length;a<c;a++){let l=e[a],u=W1(l),h=s[u];if(h)o.push(h.promise);else{let f;l.extensions&&l.extensions[ot.KHR_DRACO_MESH_COMPRESSION]?f=r(l):f=nx(new vt,l,t),l.mode===Si.TRIANGLE_STRIP?f=f.then(d=>Yd(d,ac)):l.mode===Si.TRIANGLE_FAN&&(f=f.then(d=>Yd(d,Go))),s[u]={primitive:l,promise:f},o.push(f)}}return Promise.all(o)}loadMesh(e){let t=this,i=this.json,s=this.extensions,r=i.meshes[e],o=r.primitives,a=[];for(let c=0,l=o.length;c<l;c++){let u=o[c].material===void 0?H1(this.cache):this.getDependency("material",o[c].material);a.push(u)}return a.push(t.loadGeometries(o)),Promise.all(a).then(async function(c){let l=c.slice(0,c.length-1),u=c[c.length-1],h=[];for(let d=0,g=u.length;d<g;d++){let _=u[d],p=o[d],m,y=l[d];if(p.mode===Si.TRIANGLES||p.mode===Si.TRIANGLE_STRIP||p.mode===Si.TRIANGLE_FAN||p.mode===void 0){let v=r.isSkinnedMesh===!0,S=_.hasAttribute("skinIndex")&&_.hasAttribute("skinWeight");v&&S===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),m=v&&S?new La(_,y):new Ye(_,y),m.isSkinnedMesh===!0&&m.normalizeSkinWeights()}else if(p.mode===Si.LINES)m=new Mr(_,y);else if(p.mode===Si.LINE_STRIP)m=new Sr(_,y);else if(p.mode===Si.LINE_LOOP)m=new Na(_,y);else if(p.mode===Si.POINTS)m=new Vi(_,y);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+p.mode);Object.keys(m.geometry.morphAttributes).length>0&&V1(m,r),m.name=t.createUniqueName(r.name||"mesh_"+e),Ji(m,r),p.extensions&&Br(s,m,p),t.assignFinalMaterial(m),h.push(m)}for(let d=0,g=h.length;d<g;d++)t.associations.set(h[d],{meshes:e,primitives:d});if(h.length===1)return r.extensions&&Br(s,h[0],r),h[0];let f=new Yt;r.extensions&&Br(s,f,r),t.associations.set(f,{meshes:e});for(let d=0,g=h.length;d<g;d++)f.add(h[d]);return f})}loadCamera(e){let t,i=this.json.cameras[e],s=i[i.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return i.type==="perspective"?t=new Kt(Qu.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):i.type==="orthographic"&&(t=new vs(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),i.name&&(t.name=this.createUniqueName(i.name)),Ji(t,i),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],i=[];for(let s=0,r=t.joints.length;s<r;s++)i.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?i.push(this.getDependency("accessor",t.inverseBindMatrices)):i.push(null),Promise.all(i).then(function(s){let r=s.pop(),o=s,a=[],c=[];for(let l=0,u=o.length;l<u;l++){let h=o[l];if(h){a.push(h);let f=new Xe;r!==null&&f.fromArray(r.array,l*16),c.push(f)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new Da(a,c)})}loadAnimation(e){let t=this.json,i=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,o=[],a=[],c=[],l=[],u=[];for(let h=0,f=s.channels.length;h<f;h++){let d=s.channels[h],g=s.samplers[d.sampler],_=d.target,p=_.node,m=s.parameters!==void 0?s.parameters[g.input]:g.input,y=s.parameters!==void 0?s.parameters[g.output]:g.output;_.node!==void 0&&(o.push(this.getDependency("node",p)),a.push(this.getDependency("accessor",m)),c.push(this.getDependency("accessor",y)),l.push(g),u.push(_))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c),Promise.all(l),Promise.all(u)]).then(function(h){let f=h[0],d=h[1],g=h[2],_=h[3],p=h[4],m=[];for(let v=0,S=f.length;v<S;v++){let E=f[v],M=d[v],x=g[v],b=_[v],R=p[v];if(E===void 0)continue;E.updateMatrix&&E.updateMatrix();let I=i._createAnimationTracks(E,M,x,b,R);if(I)for(let A=0;A<I.length;A++)m.push(I[A])}let y=new Va(r,void 0,m);return Ji(y,s),y})}createNodeMesh(e){let t=this.json,i=this,s=t.nodes[e];return s.mesh===void 0?null:i.getDependency("mesh",s.mesh).then(function(r){let o=i._getNodeRef(i.meshCache,s.mesh,r);return s.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let c=0,l=s.weights.length;c<l;c++)a.morphTargetInfluences[c]=s.weights[c]}),o})}loadNode(e){let t=this.json,i=this,s=t.nodes[e],r=i._loadNodeShallow(e),o=[],a=s.children||[];for(let l=0,u=a.length;l<u;l++)o.push(i.getDependency("node",a[l]));let c=s.skin===void 0?Promise.resolve(null):i.getDependency("skin",s.skin);return Promise.all([r,Promise.all(o),c]).then(function(l){let u=l[0],h=l[1],f=l[2];f!==null&&u.traverse(function(d){d.isSkinnedMesh&&d.bind(f,q1)});for(let d=0,g=h.length;d<g;d++)u.add(h[d]);if(u.userData.pivot!==void 0&&h.length>0){let d=u.userData.pivot,g=h[0];u.pivot=new N().fromArray(d),u.position.x-=d[0],u.position.y-=d[1],u.position.z-=d[2],g.position.set(0,0,0),delete u.userData.pivot}return u})}_loadNodeShallow(e){let t=this.json,i=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let r=t.nodes[e],o=r.name?s.createUniqueName(r.name):"",a=[],c=s._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return c&&a.push(c),r.camera!==void 0&&a.push(s.getDependency("camera",r.camera).then(function(l){return s._getNodeRef(s.cameraCache,r.camera,l)})),s._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){a.push(l)}),this.nodeCache[e]=Promise.all(a).then(function(l){let u;if(r.isBone===!0?u=new Ao:l.length>1?u=new Yt:l.length===1?u=l[0]:u=new Ft,u!==l[0])for(let h=0,f=l.length;h<f;h++)u.add(l[h]);if(r.name&&(u.userData.name=r.name,u.name=o),Ji(u,r),r.extensions&&Br(i,u,r),r.matrix!==void 0){let h=new Xe;h.fromArray(r.matrix),u.applyMatrix4(h)}else r.translation!==void 0&&u.position.fromArray(r.translation),r.rotation!==void 0&&u.quaternion.fromArray(r.rotation),r.scale!==void 0&&u.scale.fromArray(r.scale);if(!s.associations.has(u))s.associations.set(u,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){let h=s.associations.get(u);s.associations.set(u,{...h})}return s.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){let t=this.extensions,i=this.json.scenes[e],s=this,r=new Yt;i.name&&(r.name=s.createUniqueName(i.name)),Ji(r,i),i.extensions&&Br(t,r,i);let o=i.nodes||[],a=[];for(let c=0,l=o.length;c<l;c++)a.push(s.getDependency("node",o[c]));return Promise.all(a).then(function(c){for(let u=0,h=c.length;u<h;u++){let f=c[u];f.parent!==null?r.add(J_(f)):r.add(f)}let l=u=>{let h=new Map;for(let[f,d]of s.associations)(f instanceof ei||f instanceof hn)&&h.set(f,d);return u.traverse(f=>{let d=s.associations.get(f);d!=null&&h.set(f,d)}),h};return s.associations=l(r),r})}_createAnimationTracks(e,t,i,s,r){let o=[],a=e.name?e.name:e.uuid,c=[];function l(d){d.morphTargetInfluences&&c.push(d.name?d.name:d.uuid)}js[r.path]===js.weights?(l(e),e.isGroup&&e.children.forEach(l)):c.push(a);let u;switch(js[r.path]){case js.weights:u=gs;break;case js.rotation:u=_s;break;case js.translation:case js.scale:u=qs;break;default:i.itemSize===1?u=gs:u=qs;break}let h=s.interpolation!==void 0?z1[s.interpolation]:xr,f=this._getArrayFromAccessor(i);for(let d=0,g=c.length;d<g;d++){let _=new u(c[d]+"."+js[r.path],t.array,f,h);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(_),o.push(_)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let i=ym(t.constructor),s=new Float32Array(t.length);for(let r=0,o=t.length;r<o;r++)s[r]=t[r]*i;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(i){let s=this instanceof _s?_m:Lh;return new s(this.times,this.values,this.getValueSize()/3,i)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function Y1(n,e,t){let i=e.attributes,s=new ci;if(i.POSITION!==void 0){let a=t.json.accessors[i.POSITION],c=a.min,l=a.max;if(c!==void 0&&l!==void 0){if(s.set(new N(c[0],c[1],c[2]),new N(l[0],l[1],l[2])),a.normalized){let u=ym(jo[a.componentType]);s.min.multiplyScalar(u),s.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=e.targets;if(r!==void 0){let a=new N,c=new N;for(let l=0,u=r.length;l<u;l++){let h=r[l];if(h.POSITION!==void 0){let f=t.json.accessors[h.POSITION],d=f.min,g=f.max;if(d!==void 0&&g!==void 0){if(c.setX(Math.max(Math.abs(d[0]),Math.abs(g[0]))),c.setY(Math.max(Math.abs(d[1]),Math.abs(g[1]))),c.setZ(Math.max(Math.abs(d[2]),Math.abs(g[2]))),f.normalized){let _=ym(jo[f.componentType]);c.multiplyScalar(_)}a.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(a)}n.boundingBox=s;let o=new Qn;s.getCenter(o.center),o.radius=s.min.distanceTo(s.max)/2,n.boundingSphere=o}function nx(n,e,t){let i=e.attributes,s=[];function r(o,a){return t.getDependency("accessor",o).then(function(c){n.setAttribute(a,c)})}for(let o in i){let a=xm[o]||o.toLowerCase();a in n.attributes||s.push(r(i[o],a))}if(e.indices!==void 0&&!n.index){let o=t.getDependency("accessor",e.indices).then(function(a){n.setIndex(a)});s.push(o)}return Je.workingColorSpace!==An&&"COLOR_0"in i&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Je.workingColorSpace}" not supported.`),Ji(n,e),Y1(n,e,t),Promise.all(s).then(function(){return e.targets!==void 0?G1(n,e.targets,t):n})}var Sm=new WeakMap,$1=new URL("../libs/draco/draco_decoder.wasm","https://localhost/assets/").toString(),K1=new URL("../libs/draco/draco_wasm_wrapper.js","https://localhost/assets/").toString(),Z1=new URL("../libs/draco/draco_decoder.js","https://localhost/assets/").toString(),FC={js:new URL("../libs/draco/gltf/draco_wasm_wrapper.js","https://localhost/assets/").toString(),wasm:new URL("../libs/draco/gltf/draco_decoder.wasm","https://localhost/assets/").toString()},Dh=class extends xi{constructor(e){super(e),this.decoderPaths={js:K1,wasm:$1,dep_js:Z1},this.decoderConfig={},this.decoderBinary=null,this.decoderPending=null,this.workerLimit=4,this.workerPool=[],this.workerNextTaskID=1,this.workerSourceURL="",this.defaultAttributeIDs={position:"POSITION",normal:"NORMAL",color:"COLOR",uv:"TEX_COORD"},this.defaultAttributeTypes={position:"Float32Array",normal:"Float32Array",color:"Float32Array",uv:"Float32Array"}}setDecoderPath(e){let{decoderPaths:t}=this;return typeof e=="object"?(t.js=e.js,t.wasm=e.wasm,t.dep_js=null):(t.js=li.resolveURL("draco_wasm_wrapper.js",e),t.wasm=li.resolveURL("draco_decoder.wasm",e),t.dep_js=li.resolveURL("draco_decoder.js",e)),this}setDecoderConfig(e){return console.warn("THREE.DRACOLoader: setDecoderConfig to has been deprecated and will be removed in r194."),this.decoderConfig=e,this}setWorkerLimit(e){return this.workerLimit=e,this}load(e,t,i,s){let r=new ys(this.manager);r.setPriority(this.priority),r.setCache(this.cache),r.setPath(this.path),r.setResponseType("arraybuffer"),r.setRequestHeader(this.requestHeader),r.setWithCredentials(this.withCredentials),r.load(e,o=>{this.parse(o,t,s)},i,s)}parse(e,t,i=()=>{}){this.decodeDracoFile(e,t,null,null,Dt,i).catch(i)}decodeDracoFile(e,t,i,s,r=An,o=()=>{}){let a={attributeIDs:i||this.defaultAttributeIDs,attributeTypes:s||this.defaultAttributeTypes,useUniqueIDs:!!i,vertexColorSpace:r};return this.decodeGeometry(e,a).then(t).catch(o)}decodeGeometry(e,t){let i=JSON.stringify(t);if(Sm.has(e)){let c=Sm.get(e);if(c.key===i)return c.promise;if(e.byteLength===0)throw new Error("THREE.DRACOLoader: Unable to re-decode a buffer with different settings. Buffer has already been transferred.")}let s,r=this.workerNextTaskID++,o=e.byteLength,a=this._getWorker(r,o).then(c=>(s=c,new Promise((l,u)=>{s._callbacks[r]={resolve:l,reject:u},s.postMessage({type:"decode",id:r,taskConfig:t,buffer:e},[e])}))).then(c=>this._createGeometry(c.geometry));return a.catch(()=>!0).then(()=>{s&&r&&this._releaseTask(s,r)}),Sm.set(e,{key:i,promise:a}),a}_createGeometry(e){let t=new vt;e.index&&t.setIndex(new gt(e.index.array,1));for(let i=0;i<e.attributes.length;i++){let{name:s,array:r,itemSize:o,stride:a,vertexColorSpace:c}=e.attributes[i],l;if(o===a)l=new gt(r,o);else{let u=new Hs(r,a);l=new Gs(u,o,0)}s==="color"&&(this._assignVertexColorSpace(l,c),l.normalized=!(r instanceof Float32Array)),t.setAttribute(s,l)}return t}_assignVertexColorSpace(e,t){if(t!==Dt)return;let i=new ae;for(let s=0,r=e.count;s<r;s++)i.fromBufferAttribute(e,s),Je.colorSpaceToWorking(i,Dt),e.setXYZ(s,i.r,i.g,i.b)}_loadLibrary(e,t){let i=new ys(this.manager);return i.setPriority(this.priority),i.setCache(this.cache),i.setResponseType(t),i.setWithCredentials(this.withCredentials),new Promise((s,r)=>{i.load(e,s,void 0,r)})}preload(){return this._initDecoder(),this}_initDecoder(){if(this.decoderPending)return this.decoderPending;let e=typeof WebAssembly!="object"||this.decoderConfig.type==="js",t=[],{decoderPaths:i}=this;if(e){if(i.dep_js===null)throw new Error("THREE.DRACOLoader: WebAssembly is required when using a custom decoder paths.");t.push(this._loadLibrary(i.dep_js,"text"))}else t.push(this._loadLibrary(i.js,"text")),t.push(this._loadLibrary(i.wasm,"arraybuffer"));return this.decoderPending=Promise.all(t).then(s=>{let r=s[0];e||(this.decoderConfig.wasmBinary=s[1]);let o=J1.toString(),a=["/* draco decoder */",r,"","/* worker */",o.substring(o.indexOf("{")+1,o.lastIndexOf("}"))].join(`
`);this.workerSourceURL=URL.createObjectURL(new Blob([a]))}),this.decoderPending}_getWorker(e,t){return this._initDecoder().then(()=>{if(this.workerPool.length<this.workerLimit){let s=new Worker(this.workerSourceURL);s._callbacks={},s._taskCosts={},s._taskLoad=0,s.postMessage({type:"init",decoderConfig:this.decoderConfig}),s.onmessage=function(r){let o=r.data;switch(o.type){case"decode":s._callbacks[o.id].resolve(o);break;case"error":s._callbacks[o.id].reject(o);break;default:console.error('THREE.DRACOLoader: Unexpected message, "'+o.type+'"')}},this.workerPool.push(s)}else this.workerPool.sort(function(s,r){return s._taskLoad>r._taskLoad?-1:1});let i=this.workerPool[this.workerPool.length-1];return i._taskCosts[e]=t,i._taskLoad+=t,i})}_releaseTask(e,t){e._taskLoad-=e._taskCosts[t],delete e._callbacks[t],delete e._taskCosts[t]}debug(){console.log("Task load: ",this.workerPool.map(e=>e._taskLoad))}dispose(){for(let e=0;e<this.workerPool.length;++e)this.workerPool[e].terminate();return this.workerPool.length=0,this.workerSourceURL!==""&&URL.revokeObjectURL(this.workerSourceURL),this}};function J1(){let n,e;onmessage=function(o){let a=o.data;switch(a.type){case"init":n=a.decoderConfig,e=new Promise(function(u){n.onModuleLoaded=function(h){u({draco:h})},DracoDecoderModule(n)});break;case"decode":let c=a.buffer,l=a.taskConfig;e.then(u=>{let h=u.draco,f=new h.Decoder;try{let d=t(h,f,new Int8Array(c),l),g=d.attributes.map(_=>_.array.buffer);d.index&&g.push(d.index.array.buffer),self.postMessage({type:"decode",id:a.id,geometry:d},g)}catch(d){console.error(d),self.postMessage({type:"error",id:a.id,error:d.message})}finally{h.destroy(f)}});break}};function t(o,a,c,l){let u=l.attributeIDs,h=l.attributeTypes,f,d,g=a.GetEncodedGeometryType(c);if(g===o.TRIANGULAR_MESH)f=new o.Mesh,d=a.DecodeArrayToMesh(c,c.byteLength,f);else if(g===o.POINT_CLOUD)f=new o.PointCloud,d=a.DecodeArrayToPointCloud(c,c.byteLength,f);else throw new Error("THREE.DRACOLoader: Unexpected geometry type.");if(!d.ok()||f.ptr===0)throw new Error("THREE.DRACOLoader: Decoding failed: "+d.error_msg());let _={index:null,attributes:[]};for(let p in u){let m=self[h[p]],y,v;if(l.useUniqueIDs)v=u[p],y=a.GetAttributeByUniqueId(f,v);else{if(v=a.GetAttributeId(f,o[u[p]]),v===-1)continue;y=a.GetAttribute(f,v)}let S=s(o,a,f,p,m,y);p==="color"&&(S.vertexColorSpace=l.vertexColorSpace),_.attributes.push(S)}return g===o.TRIANGULAR_MESH&&(_.index=i(o,a,f)),o.destroy(f),_}function i(o,a,c){let u=c.num_faces()*3,h=u*4,f=o._malloc(h);a.GetTrianglesUInt32Array(c,h,f);let d=new Uint32Array(o.HEAPF32.buffer,f,u).slice();return o._free(f),{array:d,itemSize:1}}function s(o,a,c,l,u,h){let f=c.num_points(),d=h.num_components(),g=r(o,u),_=d*u.BYTES_PER_ELEMENT,p=Math.ceil(_/4)*4,m=p/u.BYTES_PER_ELEMENT,y=f*_,v=f*p,S=o._malloc(y);a.GetAttributeDataArrayForAllPoints(c,h,g,y,S);let E=new u(o.HEAPF32.buffer,S,y/u.BYTES_PER_ELEMENT),M;if(_===p)M=E.slice();else{M=new u(v/u.BYTES_PER_ELEMENT);let x=0;for(let b=0;b<f;b++){for(let R=0;R<d;R++)M[x+R]=E[b*d+R];x+=m}}return o._free(S),{name:l,count:f,itemSize:d,array:M,stride:m}}function r(o,a){switch(a){case Float32Array:return o.DT_FLOAT32;case Int8Array:return o.DT_INT8;case Int16Array:return o.DT_INT16;case Int32Array:return o.DT_INT32;case Uint8Array:return o.DT_UINT8;case Uint16Array:return o.DT_UINT16;case Uint32Array:return o.DT_UINT32}}}var bt={ready:!1,cars:{},props:{},tex:{},nrm:{},wear:{}},kr="assets/";function j1(n){let e=n.attributes.color;if(e){for(let t=0;t<e.count;t++)for(let i=0;i<e.itemSize&&i<3;i++){let s=e.getComponent(t,i);e.setComponent(t,i,s<=.04045?s/12.92:Math.pow((s+.055)/1.055,2.4))}e.needsUpdate=!0}}function Mm(n,e){return new Promise((t,i)=>n.load(e,t,void 0,i))}function bm(n,e){return new Promise((t,i)=>new Tr().load(n,s=>{s.wrapS=s.wrapT=gi,s.anisotropy=8,s.colorSpace=e?Dt:Ui,t(s)},void 0,i))}async function sx(){let n=new Dh;n.setDecoderPath(kr+"draco/"),n.setDecoderConfig({type:"wasm"});let e=new Ph;e.setDRACOLoader(n);let t=["sand","cracked","grass","snow","gravel"],i=["buggy_classic","buggy_sports","wheel_std","wheel_big"],s=Promise.all(i.map(l=>bm(kr+`wear_${l}.jpg`,!1).then(u=>{u.flipY=!1,u.wrapS=u.wrapT=jn,u.userData.keep=!0,bt.wear[l]=u}))),[r,o,a,...c]=await Promise.all([Mm(e,kr+"cars.glb"),Mm(e,kr+"props.glb"),Mm(e,kr+"gate.glb"),...t.map(l=>bm(kr+`tex_${l}.jpg`,!1)),...t.map(l=>bm(kr+`nrm_${l}.jpg`,!1))]);await s,n.dispose(),r.scene.updateMatrixWorld(!0);for(let l of["buggy_classic","buggy_sports","wheel_std","wheel_big","rocket"]){let u=r.scene.getObjectByName(l);if(!u)throw new Error("missing "+l);u.position.set(0,0,0),u.rotation.set(0,0,0),u.scale.set(1,1,1),u.traverse(h=>{h.isMesh&&(h.userData.sharedGeo=!0,h.castShadow=!0)}),bt.cars[l]=u}{let l=a.scene.getObjectByName("finish_gate");if(!l)throw new Error("missing finish_gate");l.position.set(0,0,0),l.rotation.set(0,0,0),l.scale.set(1,1,1),l.traverse(u=>{u.isMesh&&(u.geometry.userData.keep=!0,u.material.userData.keep=!0,u.castShadow=!0)}),bt.gate=l}return o.scene.updateMatrixWorld(!0),o.scene.traverse(l=>{if(!l.isMesh)return;let u=l.geometry.clone();u.applyMatrix4(l.matrixWorld),["palm","pine","tree_trunk"].includes(l.name)&&j1(u),u.deleteAttribute("uv"),u.computeBoundingSphere(),u.userData.keep=!0,bt.props[l.name]=u}),t.forEach((l,u)=>{bt.tex[l]=c[u],bt.nrm[l]=c[u+t.length],c[u].userData.keep=c[u+t.length].userData.keep=!0}),bt.ready=!0,bt}var on=(n,e,t)=>Math.max(e,Math.min(t,n)),Kn=(n,e,t)=>n+(e-n)*t,at=(n,e,t)=>{let i=on((t-n)/(e-n),0,1);return i*i*(3-2*i)},ir=n=>{for(;n>Math.PI;)n-=Math.PI*2;for(;n<-Math.PI;)n+=Math.PI*2;return n};function ux(n){return()=>{n|=0,n=n+1831565813|0;let e=Math.imul(n^n>>>15,1|n);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}var Vh=ux(20261117),ea=(n,e)=>{let t=Math.sin(n*127.1+e*311.7)*43758.5453;return t-Math.floor(t)};function Qo(n,e){let t=Math.floor(n),i=Math.floor(e),s=n-t,r=e-i,o=s*s*(3-2*s),a=r*r*(3-2*r),c=ea(t,i),l=ea(t+1,i),u=ea(t,i+1),h=ea(t+1,i+1);return c+(l-c)*o+(u-c)*a+(c-l-u+h)*o*a}function rn(n,e){let t=0,i=.5;for(let s=0;s<4;s++)t+=i*Qo(n,e),n*=2.03,e*=2.03,i*=.5;return t}function $n(n,e,t,i={}){let s=document.createElement("canvas");s.width=n,s.height=e,t(s.getContext("2d"),n,e);let r=new Ua(s);return r.colorSpace=Dt,r.anisotropy=8,i.repeat&&(r.wrapS=r.wrapT=gi),r}var Oc=n=>(n.userData.keep=!0,n),Uc=3,Gn=8,hx=13,Wh=46,fx=21,dx=30,Xh=new N(.48,.72,.38).normalize(),px=/[?&]auto=1/.test(location.search),Qi=780,ia=300,ta=Qi/ia,Gt=ia+1,Qs=Qi/2-2,Cm=new Float32Array(Gt*Gt),Pm=new Float32Array(Gt*Gt),Fh=(n,e)=>at(352,386,Math.max(Math.abs(n),Math.abs(e))),Tm=(n,e,t,i)=>Kn(n,i,Fh(e,t)),Q1=document.getElementById("game"),Pn=new nh({canvas:Q1,antialias:!0,powerPreference:"high-performance"});Pn.setPixelRatio(Math.min(devicePixelRatio,2));Pn.shadowMap.enabled=!0;Pn.shadowMap.type=Uo;Pn.toneMapping=Pr;Pn.toneMappingExposure=1.05;var jt=new wo;jt.fog=new Ca(11065589,420,2400);var mx=new Kt(62,1,.3,7e3),bi=new Ht({side:Cn,depthWrite:!1,fog:!1,uniforms:{uSun:{value:Xh},uZen:{value:new ae(742089)},uHor:{value:new ae(10475255)},uLow:{value:new ae(.45,.78,.9)},uSunK:{value:1},uSunCol:{value:new ae(1,.92,.75)},uGlow:{value:1}},vertexShader:"varying vec3 vDir; void main(){ vDir=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }",fragmentShader:`varying vec3 vDir; uniform vec3 uSun,uZen,uHor,uLow,uSunCol; uniform float uSunK,uGlow;
    void main(){ vec3 d=normalize(vDir); float h=max(d.y,0.);
      vec3 col=mix(uHor,uZen,pow(h,0.5)); col=mix(col,uLow,smoothstep(0.,-0.25,d.y)*0.6);
      float s=max(dot(d,uSun),0.); col+=uSunK*uSunCol*(smoothstep(0.9993,0.9997,s)*14.+(pow(s,24.)*0.28+pow(s,400.)*1.2)*uGlow);
      gl_FragColor=vec4(col,1.); }`}),sa=new Ye(new qn(4e3,32,16),bi);sa.frustumCulled=!1;jt.add(sa);var eE=(()=>{let e=new Float32Array(5400),t=new N;for(let r=0;r<1800;r++){do t.set(Math.random()*2-1,Math.random(),Math.random()*2-1);while(t.lengthSq()>1||t.y<.04);t.normalize().multiplyScalar(3500),e.set([t.x,t.y,t.z],r*3)}let i=new vt;i.setAttribute("position",new gt(e,3));let s=new Vi(i,new Xs({color:14674175,size:2.2,sizeAttenuation:!1,fog:!1,transparent:!0,opacity:.9,depthWrite:!1}));return s.frustumCulled=!1,s.visible=!1,sa.add(s),s})(),Ic=new Wa(12574975,14266990,.6);jt.add(Ic);var an=new Ar(16773330,3.6);an.castShadow=!0;an.shadow.mapSize.set(2048,2048);an.shadow.bias=-4e-4;an.shadow.normalBias=.06;Object.assign(an.shadow.camera,{left:-75,right:75,top:75,bottom:-75,near:1,far:420});an.shadow.camera.updateProjectionMatrix();jt.add(an,an.target);var Em=null;function tE(){let n=new wo;n.add(new Ye(sa.geometry,bi));let e=new Wo(Pn),t=e.fromScene(n,0,1,6e3).texture;e.dispose(),Em&&Em.dispose(),Em=t,jt.environment=t}var zh=Oc($n(256,256,(n,e,t)=>{let i=n.createImageData(e,t);for(let s=0;s<e*t;s++){let r=215+Math.random()*40;i.data[s*4]=r,i.data[s*4+1]=r,i.data[s*4+2]=r,i.data[s*4+3]=255}n.putImageData(i,0,0),n.globalAlpha=.06,n.strokeStyle="#765",n.lineWidth=3;for(let s=0;s<26;s++){let r=s*10+3;n.beginPath();for(let o=0;o<=e;o+=8)n.lineTo(o,r+Math.sin(o/e*Math.PI*4+s)*2.5);n.stroke()}},{repeat:!0})),na=Oc(new Ht({transparent:!0,depthWrite:!1,fog:!0,uniforms:Fi.merge([be.fog,{uTime:{value:0},uSun:{value:Xh},uShallow:{value:new ae(5828828)},uMid:{value:new ae(1229519)},uDeep:{value:new ae(679864)},uSky:{value:new ae(11132159)},uRain:{value:0}}]),vertexShader:`attribute float aDepth; uniform float uTime; varying float vDepth; varying vec3 vWorld;
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
    }`})),gx=Oc($n(128,128,(n,e,t)=>{n.clearRect(0,0,e,t),n.fillStyle="rgba(20,120,255,.55)",n.fillRect(0,0,e,t),n.strokeStyle="#fff",n.lineWidth=12,n.lineJoin="miter";for(let i=-1;i<3;i++)n.beginPath(),n.moveTo(14,i*64+10),n.lineTo(64,i*64+48),n.lineTo(114,i*64+10),n.stroke()},{repeat:!0})),_x=Oc(new Mt(.85,.85,.16,22));_x.rotateX(Math.PI/2);var xx=Oc(new Nt({color:16761370,metalness:1,roughness:.22,emissive:16751104,emissiveIntensity:.55})),Ei=null,Ac=0,Re=0,ws=1,ct,lt,fi,Vt,Tn,En,Hh,Vr,Lc=[],nr=[],Wr=null;function Fc(n,e,t=-1,i=40){let s=0,r=1e18;if(t<0){for(let o=0;o<Re;o+=6){let a=n-ct[o],c=e-lt[o],l=a*a+c*c;l<r&&(r=l,s=o)}t=s,i=6}for(let o=-i;o<=i;o++){let a=(t+o+Re)%Re,c=n-ct[a],l=e-lt[a],u=c*c+l*l;u<r&&(r=u,s=a)}return s}function yx(n,e,t){let i=on((e+Qi/2)/ta,0,ia-.001),s=on((t+Qi/2)/ta,0,ia-.001),r=i|0,o=s|0,a=i-r,c=s-o,l=o*Gt+r;return(n[l]*(1-a)+n[l+1]*a)*(1-c)+(n[l+Gt]*(1-a)+n[l+Gt+1]*a)*c}var wt=(n,e)=>yx(Cm,n,e),nE=(n,e)=>yx(Pm,n,e),Ti=new Ft,Ot=new ae,mn=null,Im=[];function Rt(n,e,t,i=!0){n.attributes.color&&!e.vertexColors&&(e.vertexColors=!0);let s=new Vs(n,e,Math.max(1,t.length));return s.count=t.length,t.forEach((r,o)=>{Ti.position.set(r.x,r.y,r.z),Ti.rotation.set(r.rx||0,r.ry||0,r.rz||0),r.s&&r.s.length?Ti.scale.set(r.s[0],r.s[1],r.s[2]):Ti.scale.setScalar(r.s||1),Ti.updateMatrix(),s.setMatrixAt(o,Ti.matrix),r.c!==void 0&&s.setColorAt(o,Ot.set(r.c))}),s.castShadow=i,s.receiveShadow=!0,mn.add(s),s}var er=n=>bt.ready&&bt.props[n]||null,zr=(n,e,t)=>{let i=er(n>=2?"rock_big":"rock_small");if(!i)return Pc(n,e,t);let s=i.clone();return s.userData={},s},iE={beach:"sand",desert:"cracked",country:"grass",snow:"snow"};function vx(n,e,t=.7){let i=iE[e];!bt.ready||!i||(n.map=bt.tex[i],n.normalMap=bt.nrm[i],n.normalScale.set(t,t),n.needsUpdate=!0)}function Pc(n,e,t=0){let i=new Lo(1,n),s=i.attributes.position;for(let r=0;r<s.count;r++){let o=s.getX(r),a=s.getY(r),c=s.getZ(r),l=1+(rn(o*1.7+c*.9+3+t,a*1.7-c*.6+8)-.47)*e;s.setXYZ(r,o*l,a*l,c*l)}return i.computeVertexNormals(),i}var Pe=n=>new Nt(Object.assign({roughness:.9},n)),Rc=(n,e,t,i=7)=>{let s=new N().subVectors(e,n),r=new Mt(t,t,s.length(),i),o=new Rn().setFromUnitVectors(new N(0,1,0),s.clone().normalize());return r.applyQuaternion(o),r.translate(n.x+s.x/2,n.y+s.y/2,n.z+s.z/2),r},Nh=(n,e)=>{let t=n.attributes.position,i=n.attributes.normal,s=new Float32Array(t.count*3),r=new ae;for(let o=0;o<t.count;o++)e(r,t.getX(o),t.getY(o),t.getZ(o),i?i.getY(o):1),s[o*3]=r.r,s[o*3+1]=r.g,s[o*3+2]=r.b;return n.setAttribute("color",new gt(s,3)),n},wm=(n,e)=>{let t=new Mt(n,n,e,3,1,!1,Math.PI/2);return t.rotateZ(Math.PI/2),t};function ji(n,e,t,i,...s){let r=new Yt;return r.add(...s),r.position.set(n,e,t),r.rotation.y=i,r.traverse(o=>{o.isMesh&&(o.castShadow=o.receiveShadow=!0)}),mn.add(r),r}var nt=(n,e,t=0,i=0,s=0)=>{let r=new Ye(n,e);return r.position.set(t,i,s),r};function Mn(n,e,t,i,s=4e4){let r=[],o=0;for(;r.length<e&&o++<s;){let a=(n()-.5)*t*2,c=(n()-.5)*t*2,l=i(a,c,wt(a,c),nE(a,c));l&&r.push(l)}return r}var Hr=(n,e,t,i=2.6)=>Math.abs(wt(n+3,e)-t)+Math.abs(wt(n,e+3)-t)<i;function Gr(n,e,t,i,s){let r=new za(e,t,12,30,Math.PI),o=r.attributes.position,a=r.attributes.normal,c=new Float32Array(o.count*3),l=new ae(i),u=new ae(s),h=new ae;for(let d=0;d<o.count;d++){let g=o.getX(d),_=o.getY(d),p=o.getZ(d),m=(rn(g*.16+p*.3+n,_*.16-p*.2)-.5)*5.5,y=1+at(9,0,_)*.5;o.setXYZ(d,g+a.getX(d)*(m+(y-1)*4),_+a.getY(d)*m*.8,(p+a.getZ(d)*m)*1.5*y),h.copy(l).multiplyScalar(.8+rn(g*.4,_*.4)*.5).lerp(u,at(.45,.8,a.getY(d))*at(e*.7,e,_)),c[d*3]=h.r,c[d*3+1]=h.g,c[d*3+2]=h.b}r.setAttribute("color",new gt(c,3)),r.computeVertexNormals();let f=new Ye(r,Pe({vertexColors:!0,roughness:.92,flatShading:!0}));f.position.set(ct[n],fi[n]-3.5,lt[n]),f.rotation.y=Vt[n],f.castShadow=f.receiveShadow=!0,mn.add(f)}function rx(n){let e=new Ha(new br(new N(0,-.6,0),new N(.5,4,0),new N(1.5,7.6,0)),8,.27,6),t=(o,a)=>{let c=new ti(a,o,2,6),l=c.attributes.position;for(let u=0;u<l.count;u++){let h=l.getX(u),f=(l.getY(u)+o/2)/o;l.setXYZ(u,f*o*.92,Math.sin(f*2.2)*1.3-f*f*2.7-Math.abs(h)*.4,h)}return c},i=[];for(let o=0;o<9;o++){let a=t(4.6,1.7);a.rotateZ((n()-.5)*.35),a.rotateY(o/9*Math.PI*2+n()*.3),a.translate(1.5,7.5,0),i.push(a)}for(let o=0;o<5;o++){let a=t(3.4,1.4);a.rotateZ(.55),a.rotateY(o/5*Math.PI*2+.4),a.translate(1.5,7.6,0),i.push(a)}let s=Ks(i);s.computeVertexNormals();let r=$n(64,256,(o,a,c)=>{o.clearRect(0,0,a,c),o.lineCap="round";for(let l=c-4;l>4;l-=5){let u=1-l/c,h=29*Math.pow(Math.sin(Math.PI*Math.min(1,u*.9+.1)),.5);o.strokeStyle=`hsl(${105+Math.random()*20},${55+Math.random()*15}%,${27+Math.random()*14}%)`,o.lineWidth=4.2,o.beginPath(),o.moveTo(32,l),o.lineTo(32-h,l-13),o.moveTo(32,l),o.lineTo(32+h,l-13),o.stroke()}o.strokeStyle="#6f8a2c",o.lineWidth=3,o.beginPath(),o.moveTo(32,c),o.lineTo(32,6),o.stroke()});return{trunk:e,leaf:s,trunkMat:Pe({color:10122064,roughness:.95}),leafMat:Pe({map:r,alphaTest:.45,side:Sn,roughness:.75})}}function ox(n,e){let t=er("palm");if(t){Rt(t,Pe({vertexColors:!0,side:Sn,roughness:.8}),e);return}Rt(n.trunk,n.trunkMat,e),Rt(n.leaf,n.leafMat,e)}var Oh=n=>n.map(([e,t])=>{let i=e*Math.PI/180;return new N(Math.cos(i)*t,0,Math.sin(i)*t)});function sE(n,e){let t=Pe({color:e,map:zh,roughness:1});t.map=zh,vx(t,Ei&&Ei.id,.5);for(let[i,s,r,o]of[[-6e3,6e3,Qs,6e3],[-6e3,6e3,-6e3,-Qs],[-6e3,-Qs,-Qs,Qs],[Qs,6e3,-Qs,Qs]]){let a=new ti(s-i,o-r);a.rotateX(-Math.PI/2);let c=nt(a,t,(i+s)/2,n-.02,(r+o)/2);c.receiveShadow=!0,mn.add(c)}}function ax(n,e,t,i,s,r,o,a,c,l,u,h){let f=[];for(let g=0;g<e;g++){let _=g/e*Math.PI*2+n()*.2,p=s+n()*(r-s),m=a+n()*(c-a);f.push({x:Math.cos(_)*p,y:o,z:Math.sin(_)*p,ry:n()*6,s:[m,l+n()*(u-l),m*(.7+n()*.5)],c:h?h(n):void 0})}let d=Rt(t,i,f,!1);return d.receiveShadow=!1,d}var Bh=n=>235+22*Math.sin(3*n+.8)+12*Math.sin(5*n+2.1)+8*Math.sin(2*n),rE=[[0,16],[20,14],[40,18],[58,-12],[74,-16],[90,-6],[104,30],[112,80],[128,108],[150,94],[160,50],[172,16],[195,12],[215,-10],[232,-14],[248,20],[256,70],[250,115],[266,132],[284,100],[292,50],[305,16],[330,14]],cx=(n,e)=>{let t=n*Math.PI/180,i=Bh(t)-e;return[Math.cos(t)*i,Math.sin(t)*i]},qt=null,lx=[[0,215],[25,250],[40,262],[50,315],[62,318],[72,285],[82,250],[95,220],[112,178],[135,168],[160,188],[180,235],[205,280],[230,265],[250,215],[268,182],[290,172],[315,190],[340,200]],As={beach:{id:"beach",name:"Coral Coast",icon:"\u{1F3DD}\uFE0F",sub:"Tropical island",banner:"CORAL COAST",seed:11,sky:[742089,10475255,7587814],fog:[11065589,420,2400],hemi:[12574975,14266990,.6],sun:[16773330,3.6],exposure:1.05,env:.55,clouds:22,cloudCol:[16777215,10467020],water:[5828828,1229519,679864,11132159],ocean:!0,road:["#d2a96a","#8a6436","#f1d59c"],dust:[.9,.87,.82],grip:1,gate:1468671,cpts:()=>Oh(rE.map(([n,e])=>[n,Bh(n*Math.PI/180)-e])),baseH(n,e){let t=Math.hypot(n,e),i=Math.atan2(e,n),s=Bh(i)-t;return s<0?Math.max(-8,s*.085)+.25*(Qo(n*.05,e*.05)-.5):Math.min(s,45)*.035+.35*rn(n*.06,e*.06)*at(4,20,s)+at(38,130,s)*(9+36*rn(n*.012+5,e*.012+9))+26*at(150,235,s)},paint(n,e,t,i,s,r){let a=rn(e*.03+40,i*.03+12);n.set(15781770).multiplyScalar(.93+.14*Qo(e*.11,i*.11)),t<.45&&n.lerp(Ot.set(12819554),1-at(-.1,.45,t)),t<-.3&&n.lerp(Ot.set(15326382),at(-.3,-2.5,t)*.9);let c=at(2+a*2.2,4.2+a*2.2,t)*at(Gn+6,Gn+16,r);c>0&&(n.lerp(Ot.set(5221930),c),n.lerp(Ot.set(2915636),c*at(.35,.7,rn(e*.05,i*.05)))),t>1.5&&n.lerp(Ot.set(9403755),at(.86,.68,s))},scenery(n){let e=rx(n);ox(e,Mn(n,300,330,(d,g,_,p)=>p<17.5||_<.75||_>26||p>70&&n()<.72||!Hr(d,g,_)?null:{x:d,y:_,z:g,ry:n()*6.3,rx:(n()-.5)*.12,rz:(n()-.5)*.12,s:.85+n()*.75})),Rt(zr(1,.5),Pe({color:16777215,flatShading:!0}),Mn(n,420,310,(d,g,_,p)=>{if(p<19||_<3)return null;let m=1.4+n()*2.6;return{x:d,y:_+m*.25,z:g,ry:n()*6,s:[m,m*(.6+n()*.4),m],c:new ae().setHSL(.27+n()*.08,.6,.24+n()*.14)}}));let t=Mn(n,150,320,(d,g,_,p)=>{if(p<16||p>48||_<-1.2)return null;let m=.7+n()*n()*3.4;return{x:d,y:_+m*.2,z:g,ry:n()*6,rx:n(),s:[m*(.8+n()*.6),m*(.6+n()*.5),m],c:new ae().setHSL(.07+n()*.03,.14,.42+n()*.16)}}),i=[];for(let d=0;d<16;d++){let g=n()*Math.PI*2,_=Bh(g)+48+n()*120,p=Math.cos(g)*_,m=Math.sin(g)*_,y=7+n()*13,v=y*(1.1+n()*1.1);t.push({x:p,y:v*.25,z:m,ry:n()*6,s:[y,v,y*(.8+n()*.4)],c:new ae().setHSL(.075,.2,.5+n()*.1)}),i.push({x:p,y:v*1.12,z:m,ry:n()*6,s:[y*.78,y*.22,y*.7],c:5811516})}Rt(zr(2,.7),Pe({color:16777215,flatShading:!0}),t),Rt(Pc(1,.3),Pe({color:16777215,flatShading:!0}),i);let s=[16730716,16762938,2275566,16743121,16777215,4509818],r=Mn(n,46,310,(d,g,_,p)=>p<17||p>40||_<.5||_>1.9?null:{x:d,y:_,z:g,ry:n()*6,rz:(n()-.5)*.3,s:1+n()*.3,c:s[n()*s.length|0]}),o=new Bn(2,.8,12);o.translate(0,2.6,0);let a=new Mt(.05,.05,2.7,6);a.translate(0,1.3,0),Rt(o,Pe({color:16777215,roughness:.6,side:Sn}),r),Rt(a,Pe({color:15658734,roughness:.4}),r);let c=(d,g)=>Fc(...cx(d,g));Gr(c(128,108),22,6,10521202,5811516),Gr(c(224,-12),23,6.5,10521202,5811516),Gr(c(66,-14),23,6,10521202,5811516);{let[d,g]=cx(-16,-42),_=nt(zr(2,.6),Pe({color:9732719,flatShading:!0}),0,-1,0);_.scale.set(17,8,15);let p=$n(8,64,m=>{for(let y=0;y<4;y++)m.fillStyle=y%2?"#fff":"#e8323c",m.fillRect(0,y*16,8,16)});ji(d,0,g,0,_,nt(new Mt(1.9,3.1,20,20),Pe({map:p,roughness:.55}),0,15.5,0),nt(new Mt(2.9,2.6,.6,20),Pe({color:2371645,roughness:.5}),0,25.8,0),nt(new Mt(1.5,1.5,2.6,12),tr(Pe({color:16774064,emissive:16766826,emissiveIntensity:2.5}),2.5,6),0,27.4,0),nt(new Bn(2.2,2.4,12),Pe({color:15217212,roughness:.5}),0,29.9,0))}let l=Pe({color:12618322,roughness:.85}),u=Pe({color:8016434}),h=Pe({color:14859362,roughness:1,flatShading:!0}),f=(d,g,_)=>{let p=nt(new Bn(5,3.2,4),h,0,6,0);p.rotation.y=Math.PI/4;let m=[[-3,-3],[3,-3],[-3,3],[3,3]].map(([y,v])=>nt(new Mt(.18,.18,6,6),u,y,-1.2,v));ji(d,0,g,_,nt(new xt(7,.3,7),u,0,1.7,0),nt(new xt(5,2.6,5),l,0,3.15,0),p,...m)};for(let[d,g]of[[58,-12],[78,-14],[232,-14],[212,-10]]){let _=c(d,g);for(let p=0;p<3;p++){let m=(_+p*11)%Re,y=Math.sign(Tn[m]*ct[m]+En[m]*lt[m])||1,v=y*(25+p%2*7);f(ct[m]+Tn[m]*v,lt[m]+En[m]*v,Vt[m]+n())}}for(let d=0;d<7;d++){let g=n()*6.3,_=480+n()*500,p=new vt;p.setAttribute("position",new rt([0,1.5,4,0,1.5,-4,0,17,-1],3)),p.computeVertexNormals(),ji(Math.cos(g)*_,0,Math.sin(g)*_,n()*6,nt(new xt(3,1.6,11),Pe({color:16777215}),0,.5,0),nt(p,new yn({color:[16777215,16734826,16765002][d%3],side:Sn})))}}},desert:{id:"desert",name:"Dune Run",icon:"\u{1F335}",sub:"Desert canyons",banner:"DUNE RUN",seed:23,sky:[3108816,16177322,15250819],fog:[15978396,300,1900],hemi:[16770240,13074506,.65],sun:[16770751,4.2],exposure:1,env:.5,clouds:7,cloudCol:[16774890,14203024],water:[7336143,1487782,880522,12576511],ocean:!1,edgeH:4,edgeCol:15181404,road:["#b9773f","#7a4a22","#e0a768"],dust:[.93,.72,.5],grip:.97,gate:15229994,cpts:()=>Oh([[0,250],[22,272],[45,245],[65,185],[82,155],[102,175],[122,240],[138,262],[147,312],[159,316],[168,285],[175,240],[188,195],[205,165],[226,200],[250,262],[275,282],[298,240],[316,180],[334,170],[350,215]]),baseH(n,e){let t=Math.hypot(n,e),i=2.5+6*Math.pow(Math.abs(Math.sin(n*.016+e*.007+5*rn(n*.005+3,e*.005))),1.6)+3*rn(n*.02,e*.02);return i+=20*at(.6,.8,rn(n*.006+20,e*.006-4)),i=Kn(i,-2.8,at(60,24,t)),Tm(i,n,e,this.edgeH)},paint(n,e,t,i,s,r){n.set(15379038).multiplyScalar(.9+.18*Qo(e*.09,i*.09)),n.lerp(Ot.set(13665344),.5*at(.45,.75,rn(e*.02+7,i*.02))),t>6&&n.lerp(Ot.set(11818799),at(.88,.7,s));let o=Math.hypot(e,i);o<85&&(n.lerp(Ot.set(12819554),at(1.2,.2,t)),n.lerp(Ot.set(7317562),at(85,55,o)*at(.3,1.4,t)*.85)),n.lerp(Ot.set(this.edgeCol),Fh(e,i))},scenery(n){let e=(c,l,u)=>new N(c,l,u),t=(c,l,u,h)=>{let f=new qn(c,8,6);return f.translate(l,u,h),f},i=er("cactus")||Ks([Rc(e(0,-.5,0),e(0,6,0),.48,9),t(.48,0,6,0),Rc(e(0,2.4,0),e(1.3,2.4,0),.32),Rc(e(1.3,2.4,0),e(1.3,4.6,0),.32),t(.32,1.3,4.6,0),Rc(e(0,3.2,0),e(-1.1,3.2,0),.3),Rc(e(-1.1,3.2,0),e(-1.1,5.1,0),.3),t(.3,-1.1,5.1,0)].map(c=>c.toNonIndexed&&c.index?c.toNonIndexed():c));Rt(i,Pe({color:16777215,roughness:.8}),Mn(n,140,340,(c,l,u,h)=>h<18||Math.hypot(c,l)<70||!Hr(c,l,u,4)?null:{x:c,y:u,z:l,ry:n()*6,s:.7+n()*.7,c:new ae().setHSL(.3+n()*.04,.45,.32+n()*.08)})),Rt(zr(1,.6),Pe({color:16777215,flatShading:!0}),Mn(n,260,340,(c,l,u,h)=>{if(h<16)return null;let f=.5+n()*.9;return{x:c,y:u+f*.3,z:l,ry:n()*6,s:[f*1.3,f*.8,f*1.3],c:new ae().setHSL(.13+n()*.05,.35,.3+n()*.1)}})),Rt(zr(2,.7),Pe({color:16777215,flatShading:!0}),Mn(n,160,330,(c,l,u,h)=>{if(h<15||h>55)return null;let f=.8+n()*n()*4;return{x:c,y:u+f*.15,z:l,ry:n()*6,rx:n(),s:[f*(.8+n()*.6),f*(.5+n()*.5),f],c:new ae().setHSL(.04+n()*.03,.45,.38+n()*.12)}}));let s=new Mt(1,1.22,1,11,6);{let c=s.attributes.position;for(let l=0;l<c.count;l++){let u=c.getX(l),h=c.getY(l),f=c.getZ(l),d=1+(rn(u*2+4,f*2+h)-.5)*.35;c.setXYZ(l,u*d,h,f*d)}s.translate(0,.5,0),s.computeVertexNormals()}Nh(s,(c,l,u)=>c.set(12870714).lerp(Ot.set(15179882),(Math.sin(u*22)*.5+.5)*.45).lerp(Ot.set(9256740),at(.3,0,u)*.5));let r=Pe({vertexColors:!0,flatShading:!0});Rt(s,r,Mn(n,9,330,(c,l,u,h)=>{if(h<55||Math.hypot(c,l)<90)return null;let f=14+n()*18;return{x:c,y:u-2,z:l,ry:n()*6,s:[f,16+n()*22,f*(.7+n()*.5)]}})),ax(n,30,s,r,520,1500,this.edgeH-3,50,130,40,130);let o=rx(n),a=[];for(let c=0;c<16;c++){let l=c/16*6.283+n()*.3,u=44+n()*22,h=Math.cos(l)*u,f=Math.sin(l)*u;a.push({x:h,y:wt(h,f),z:f,ry:n()*6.3,rx:(n()-.5)*.15,rz:(n()-.5)*.15,s:.8+n()*.6})}ox(o,a);for(let c=0;c<3;c++){let l=.6+c*2.1,u=Math.cos(l)*70,h=Math.sin(l)*70;ji(u,wt(u,h),h,l,nt(new Bn(4,4.2,4),Pe({color:[16115400,14243386,15909198][c],flatShading:!0}),0,2.1,0))}Gr(Math.round(Re*.28),23,6.5,12081715,14852198),Gr(Math.round(Re*.71),22,6,12081715,14852198)}},country:{id:"country",name:"Meadow Valley",icon:"\u{1F327}\uFE0F",sub:"Countryside \xB7 passing showers",banner:"MEADOW VALLEY",seed:37,sky:[2979030,12575735,9419136],fog:[12573935,320,2e3],hemi:[13625087,6982202,.65],sun:[16773850,3.4],exposure:1.02,env:.55,clouds:30,cloudCol:[16777215,11123145],water:[8833460,4165514,2776944,12375782],ocean:!1,edgeH:12,edgeCol:5938746,road:["#8d6b48","#5a3f26","#b08a60"],dust:[.55,.45,.32],grip:1,gate:3120708,weather:"rain",rainSky:[5924467,10397874,7307116],rainFog:[9411237,40,650],cpts:()=>Oh([[0,240],[20,265],[42,255],[60,205],[74,152],[92,130],[112,152],[128,215],[148,268],[172,272],[194,225],[210,172],[228,158],[248,198],[268,250],[282,262],[292,312],[304,318],[314,290],[324,252],[338,232]]),river:(n,e)=>Math.abs(e-(60*Math.sin(n*.0085+.6)+25*Math.sin(n*.023+2))+20),baseH(n,e){let t=2+18*rn(n*.0065+11,e*.0065+3)-5+7*at(.55,.75,rn(n*.004,e*.004+9));return t=Kn(t,-2,at(26,7,this.river(n,e))),Tm(t,n,e,this.edgeH)},paint(n,e,t,i,s,r){n.set(6270524).multiplyScalar(.88+.2*Qo(e*.1,i*.1)),n.lerp(Ot.set(4164142),.6*at(.4,.7,rn(e*.03+3,i*.03)));let o=Math.floor((e+13)/62),a=Math.floor((i-7)/48),c=ea(o,a),l=at(Gn+10,Gn+22,r)*at(4,1.2,this.river(e,i)/8);c<.22?n.lerp(Ot.set(14271070).multiplyScalar(.92+.12*Math.sin(e*1.6)),l*.85):c<.34?n.lerp(Ot.set(9071170).multiplyScalar(.9+.15*Math.sin((e+i)*1.4)),l*.85):c<.45&&n.lerp(Ot.set(8831818),l*.6),t<.9&&n.lerp(Ot.set(8020032),at(.9,-.2,t)),n.lerp(Ot.set(8223344),at(.8,.62,s)),n.lerp(Ot.set(this.edgeCol),Fh(e,i))},scenery(n){let e=(p,m,y,v,S=16)=>v>S&&y>.8&&this.river(p,m)>22&&Hr(p,m,y,3),t=new Mt(.3,.45,3.6,7);t.translate(0,1.7,0);let i=Ks([Pc(1,.45,1).scale(2.7,2.3,2.7).translate(0,5,0),Pc(1,.45,5).scale(1.9,1.7,1.9).translate(.9,6.6,.4)]),s=Mn(n,300,345,(p,m,y,v)=>!e(p,m,y,v,17)||v>60&&n()<.55?null:{x:p,y,z:m,ry:n()*6,s:.75+n()*.7,c:new ae().setHSL(.25+n()*.08,.55,.25+n()*.12)});Rt(er("tree_trunk")||t,Pe({color:er("tree_trunk")?16777215:7031342}),s.map(p=>({...p,c:void 0}))),Rt(er("tree_canopy")||i,Pe({color:16777215,flatShading:!0}),s.map(p=>er("tree_canopy")?{...p,c:new ae(p.c).multiplyScalar(1.5)}:p)),Rt(zr(1,.4),Pe({color:16777215,flatShading:!0}),Mn(n,260,330,(p,m,y,v)=>{if(!e(p,m,y,v,15))return null;let S=1+n()*1.6;return{x:p,y:y+S*.2,z:m,ry:n()*6,s:[S*1.4,S*.7,S],c:new ae().setHSL(.27+n()*.06,.5,.22+n()*.1)}}));let r=Pe({color:15919832}),o=Pe({color:12071979}),a=Pe({color:4864566,flatShading:!0}),c=Pe({color:11022890,flatShading:!0}),l=Pe({color:16777215});Mn(n,7,300,(p,m,y,v)=>v>30&&v<75&&e(p,m,y,v,30)&&Hr(p,m,y,1.2)?{x:p,z:m,h:y}:null).forEach((p,m)=>{let y=n()*6;m%3===2?ji(p.x,p.h,p.z,y,nt(new xt(14,7,10),o,0,3.5,0),nt(wm(6.2,15),a,0,9.4,0),nt(new xt(.2,4.4,4),l,7.05,2.2,0)):ji(p.x,p.h,p.z,y,nt(new xt(8,4.6,6),r,0,2.3,0),nt(wm(4.1,9),c,0,6.6,0),nt(new xt(.9,2.2,.9),Pe({color:9075312}),2.3,7.6,1.2))});for(let p of Mn(n,3,300,(m,y,v,S)=>S>34&&S<90&&e(m,y,v,S,34)?{x:m,z:y,h:v}:null)){let m=new Yt;for(let v=0;v<4;v++){let S=nt(new xt(.7,9,.15),l,0,4.6,0),E=new Yt;E.add(S),E.rotation.z=v*Math.PI/2,m.add(E)}m.position.set(0,13,1.9);let y=.8+n()*.6;Im.push(v=>{m.rotation.z+=v*y}),ji(p.x,p.h,p.z,n()*6,nt(new Mt(1.5,2.6,13,8),r,0,6.5,0),nt(new Bn(2.2,2.6,8),c,0,14.2,0),m)}let h=new Mt(1,1,1.5,14);h.rotateZ(Math.PI/2),h.translate(0,1,0),Rt(h,Pe({color:14730346}),Mn(n,46,330,(p,m,y,v)=>e(p,m,y,v,20)&&ea(Math.floor((p+13)/62),Math.floor((m-7)/48))<.22?{x:p,y,z:m,ry:n()*6}:null));let f=Mn(n,44,330,(p,m,y,v)=>e(p,m,y,v,22)?{x:p,y:y+.75,z:m,ry:n()*6,s:.8+n()*.3}:null);Rt(Pc(1,.25,9).scale(1,.75,1.35),Pe({color:16184298,flatShading:!0}),f),Rt(new xt(.5,.55,.65).translate(0,.25,1.35),Pe({color:2762278}),f);let d=[],g=[];for(let p=0;p<Re;p+=3)if(!(p%260>120||Math.abs(Vr[p])>.012))for(let m of[-1,1]){let y=m*(Gn+3.4),v=ct[p]+Tn[p]*y,S=lt[p]+En[p]*y,E=wt(v,S);if(E<.4)continue;d.push({x:v,y:E+.6,z:S});let M=(p+3)%Re,x=ct[M]+Tn[M]*y,b=lt[M]+En[M]*y;for(let R of[.55,1.05])g.push({x:(v+x)/2,y:(E+wt(x,b))/2+R,z:(S+b)/2,ry:Vt[p],s:[1,1,Math.hypot(x-v,b-S)]})}Rt(new xt(.22,1.25,.22),Pe({color:9069632}),d),Rt(new xt(.1,.14,1),Pe({color:10253392}),g);let _=[];for(let p=0;p<Re;p++)if(this.river(ct[p],lt[p])<20){let m=wt(ct[p],lt[p])+.12;_.push({x:ct[p],y:m,z:lt[p],ry:Vt[p]});for(let y of[-1,1])p%2===0&&_.push({x:ct[p]+Tn[p]*y*(Gn+1.4),y:m+.9,z:lt[p]+En[p]*y*(Gn+1.4),ry:Vt[p],s:[.25,1.8,.25]})}Rt(new xt(Gn*2+3,.18,1.35),Pe({color:9068348}),_)}},snow:{id:"snow",name:"Frost Peak",icon:"\u{1F3D4}\uFE0F",sub:"Snowy mountain \xB7 icy lake",banner:"FROST PEAK",seed:51,sky:[3963084,14215415,13162730],fog:[14477557,260,1600],hemi:[15135231,10135736,.75],sun:[16774374,3],exposure:.95,env:.6,clouds:18,cloudCol:[16777215,12110044],water:null,ocean:!1,edgeH:40,edgeCol:15660283,road:["#c9d4e2","#8796ab","#f1f5fb"],dust:[.96,.98,1],grip:.9,gate:2450411,weather:"snow",cpts:()=>Oh(lx),init(){let[n,e]=lx[12],t=n*Math.PI/180;qt={x:Math.cos(t)*e,z:Math.sin(t)*e,r:46}},baseH(n,e){let t=Math.hypot(n,e),i=3+115*Math.exp(-(t*t)/15625)+10*rn(n*.012,e*.012)+14*at(.6,.85,rn(n*.005+7,e*.005+1));return qt&&(i=Kn(i,1.2,at(75,qt.r,Math.hypot(n-qt.x,e-qt.z)))),Tm(i,n,e,this.edgeH)},paint(n,e,t,i,s,r){n.set(15922940).multiplyScalar(.94+.08*Qo(e*.12,i*.12)),n.lerp(Ot.set(13228268),.5*at(.45,.7,rn(e*.04+2,i*.04))),n.lerp(Ot.set(7041920),at(.8,.6,s)),qt&&n.lerp(Ot.set(10474220),at(qt.r+4,qt.r-4,Math.hypot(e-qt.x,i-qt.z))*.9),n.lerp(Ot.set(this.edgeCol),Fh(e,i))},scenery(n){let e=[[2.4,3.2,2.6],[1.9,2.8,4.3],[1.3,2.4,5.9]].map(([_,p,m])=>{let y=new Bn(_,p,8,1,!0);return y.translate(0,m,0),y}),t=new Mt(.25,.35,2.4,6);t.translate(0,.9,0);let i=Ks([...e.map(_=>_.toNonIndexed()),t.toNonIndexed()]);Nh(i,(_,p,m,y)=>{let v=Math.hypot(p,y);m<1.4&&v<.4?_.set(5914154):_.set(2054714).lerp(Ot.set(16777215),at(.9,.2,v/(.4+(7.2-m)*.5))*.9)});let s=Pe({vertexColors:!0,flatShading:!0,side:Sn});Rt(er("pine")||i,s,Mn(n,420,350,(_,p,m,y)=>y<17||y>70&&n()<.5||!Hr(_,p,m,4)||qt&&Math.hypot(_-qt.x,p-qt.z)<qt.r+6?null:{x:_,y:m-.3,z:p,ry:n()*6,s:.8+n()*.9,c:new ae(1,1,1).multiplyScalar(.85+n()*.15)}));let r=Nh(zr(2,.7,3),(_,p,m,y,v)=>_.set(7370884).lerp(Ot.set(16054527),at(.25,.6,v)));Rt(r,Pe({vertexColors:!0,flatShading:!0}),Mn(n,160,330,(_,p,m,y)=>{if(y<15||y>70)return null;let v=.8+n()*n()*5;return{x:_,y:m+v*.1,z:p,ry:n()*6,s:[v*(.8+n()*.6),v*(.6+n()*.6),v]}}));let o=new Bn(1,1,9,6);{let _=o.attributes.position;for(let p=0;p<_.count;p++){let m=_.getX(p),y=_.getY(p),v=_.getZ(p),S=1+(rn(m*3+2,v*3+y*2)-.5)*.5*(y<.49?1:0);_.setXYZ(p,m*S,y,v*S)}o.translate(0,.5,0),o.computeVertexNormals()}Nh(o,(_,p,m)=>_.set(7173508).lerp(Ot.set(16185855),at(.35,.55,m+(rn(p*4,m*4)-.5)*.2))),ax(n,34,o,Pe({vertexColors:!0,flatShading:!0}),480,1500,this.edgeH-6,120,300,160,420);let a=Pe({color:6964784}),c=Pe({color:16054527,flatShading:!0}),l=tr(Pe({color:16769696,emissive:16758858,emissiveIntensity:1.6}),1.6,4);for(let _ of Mn(n,6,320,(p,m,y,v)=>v>22&&v<50&&Hr(p,m,y,1.6)?{x:p,z:m,h:y}:null))ji(_.x,_.h,_.z,n()*6,nt(new xt(7,3.6,5.5),a,0,1.8,0),nt(wm(3.9,8.2),c,0,5.4,0),nt(new xt(1.4,1.1,.1),l,-1.6,2,2.78),nt(new xt(1.4,1.1,.1),l,1.6,2,2.78),nt(new xt(.8,2,.8),Pe({color:7829367}),2.4,6,-.8));let u=Pe({color:16777215,roughness:.8}),h=Pe({color:1118481}),f=Pe({color:16742938});for(let _ of Mn(n,8,300,(p,m,y,v)=>v>14&&v<26&&Hr(p,m,y,1.5)?{x:p,z:m,h:y}:null)){let p=nt(new Bn(.12,.6,8),f,0,3.05,.6);p.rotation.x=Math.PI/2,ji(_.x,_.h,_.z,n()*6,nt(new qn(1.1,14,10),u,0,.9,0),nt(new qn(.8,14,10),u,0,2.2,0),nt(new qn(.55,14,10),u,0,3.05,0),p,nt(new qn(.07,6,4),h,-.2,3.2,.48),nt(new qn(.07,6,4),h,.2,3.2,.48),nt(new Mt(.4,.4,.6,12),h,0,3.7,0))}Gr(Math.round(Re*.12),22,6,10467532,16777215),Gr(Math.round(Re*.82),23,6.5,10467532,16777215);let d=[];for(let _=20;_<Re;_+=46){let p=(_/46|0)%2?1:-1,m=p*(Gn+2.6),y=ct[_]+Tn[_]*m,v=lt[_]+En[_]*m;d.push({x:y,y:wt(y,v),z:v,ry:Vt[_],c:p>0?15087942:2450411})}let g=Ks([new Mt(.06,.06,2.6,6).translate(0,1.3,0),new xt(.05,.9,1.2).translate(0,2.1,.6)]);Rt(g,Pe({color:16777215,roughness:.5}),d)}}},Bc=Object.keys(As),Ts={rain:0,snow:0,target:0},oE=new N(80,46,80);function Sx(n,e,t,i){let s=new vt,r=new Float32Array(n*(e?2:1)*3),o=new Float32Array(n*(e?2:1));for(let l=0;l<n;l++){let u=[Math.random(),Math.random(),Math.random()];for(let h=0;h<(e?2:1);h++){let f=e?l*2+h:l;r.set(u,f*3),o[f]=h}}s.setAttribute("position",new gt(r,3)),s.setAttribute("aEnd",new gt(o,1));let a=new Ht({transparent:!0,depthWrite:!1,fog:!1,uniforms:{uTime:{value:0},uCam:{value:new N},uAmt:{value:0},uB:{value:oE},uScale:{value:600}},vertexShader:i,fragmentShader:t}),c=e?new Mr(s,a):new Vi(s,a);return c.frustumCulled=!1,c.renderOrder=6,c.visible=!1,jt.add(c),c}var Mx="vec3 wrapPos(vec3 p){ return uCam + mod(p - uCam, uB) - uB * 0.5; }",Dc=Sx(3200,!0,"varying float vA; void main(){ gl_FragColor=vec4(0.78,0.84,0.92,vA); }",`attribute float aEnd; uniform float uTime,uAmt; uniform vec3 uCam,uB; varying float vA; ${Mx}
   void main(){ vec3 p=position*uB; p.y-=uTime*30.+position.x*13.; p.x+=uTime*4.; vec3 w=wrapPos(p); w-=vec3(4.,30.,0.)*0.045*aEnd;
     vec4 mv=modelViewMatrix*vec4(w,1.); vA=step(fract(position.z*7.31),uAmt)*0.42*smoothstep(1.,6.,-mv.z); gl_Position=projectionMatrix*mv; }`),Nc=Sx(2600,!1,"varying float vA; void main(){ float r=length(gl_PointCoord-0.5); float a=smoothstep(0.5,0.1,r)*vA; if(a<0.01) discard; gl_FragColor=vec4(1.,1.,1.,a); }",`uniform float uTime,uAmt,uScale; uniform vec3 uCam,uB; varying float vA; ${Mx}
   void main(){ vec3 p=position*uB; p.y-=uTime*(2.2+position.x*1.6); p.x+=sin(uTime*0.7+position.z*20.)*2.+uTime*1.2; p.z+=cos(uTime*0.5+position.x*17.)*2.;
     vec3 w=wrapPos(p); vec4 mv=modelViewMatrix*vec4(w,1.); vA=step(fract(position.z*5.17),uAmt)*0.9*smoothstep(0.8,4.,-mv.z);
     gl_PointSize=min((0.09+position.y*0.08)*uScale/max(-mv.z,0.1),24.); gl_Position=projectionMatrix*mv; }`);function bx(n,e){for(let t of[Dc,Nc])t.visible&&(t.material.uniforms.uCam.value.copy(n.position),t.material.uniforms.uScale.value=e)}var bn={fog:new ae,near:0,far:0,zen:new ae,hor:new ae,low:new ae,cloud:new ae,sun:0,hemi:0,rainSky:null,rainFog:null},Cc=new ae;function Tx(n,e){for(let i of Im)i(n,e);let t=Ei;if(t){if(na.uniforms.uTime.value=e,gx.offset.y=e*1.6%1,t.weather==="rain"){let i=Math.sin(e*.045+.5)+.7*Math.sin(e*.121+2.2);Ts.target=i>.25?1:0,Ts.rain+=on(Ts.target-Ts.rain,-n/6,n/6);let s=Ts.rain,r=bn.rainFog,o=bn.rainSky;jt.fog.color.copy(bn.fog).lerp(Cc.set(r[0]),s),jt.fog.near=Kn(bn.near,r[1],s),jt.fog.far=Kn(bn.far,r[2],s),bi.uniforms.uZen.value.copy(bn.zen).lerp(Cc.set(o[0]),s),bi.uniforms.uHor.value.copy(bn.hor).lerp(Cc.set(o[1]),s),bi.uniforms.uLow.value.copy(bn.low).lerp(Cc.set(o[2]),s),bi.uniforms.uSunK.value=1-s,an.intensity=bn.sun*(1-.62*s),Ic.intensity=bn.hemi*(1-.25*s),na.uniforms.uRain.value=s,Dc.material.uniforms.uAmt.value=s,Dc.visible=s>.01;for(let a of Gh)a.color.copy(bn.cloud).lerp(Cc.set(Mi?1382948:8226708),s)}else t.weather==="snow"&&(Ts.snow=.75,Nc.material.uniforms.uAmt.value=.75,Nc.visible=!0);Dc.material.uniforms.uTime.value=Nc.material.uniforms.uTime.value=e}}function Ex(n,e){let t=Ei,i=t.grip;return qt&&t.id==="snow"&&Math.hypot(n-qt.x,e-qt.z)<qt.r&&(i*=.55),i*(1-.22*Ts.rain)}var aE=(n,e)=>!!(qt&&Ei&&Ei.id==="snow"&&Math.hypot(n-qt.x,e-qt.z)<qt.r),Gh=[];function cE(n){n.traverse(e=>{e.geometry&&!e.geometry.userData.keep&&e.geometry.dispose();let t=e.material?Array.isArray(e.material)?e.material:[e.material]:[];for(let i of t)if(!i.userData.keep){for(let s of["map","alphaMap"])i[s]&&!i[s].userData.keep&&i[s].dispose();i.dispose()}e.isInstancedMesh&&e.dispose()})}function qh(n){let e=As[n]||As.beach;Ei=e,mn&&(jt.remove(mn),cE(mn)),mn=new Yt,jt.add(mn),Im.length=0,Gh.length=0,qt=null;let t=ux(e.seed*7919);e.init&&e.init();let i=(a,c)=>e.baseH(a,c),s=new Po(e.cpts(),!0,"centripetal");s.arcLengthDivisions=4e3,Ac=s.getLength(),Re=Math.round(Ac/1.5),ws=Ac/Re,Es.n=Re,Es.len=Ac,Es.cp=e.cpts().length,ct=new Float32Array(Re),lt=new Float32Array(Re),fi=new Float32Array(Re),Vt=new Float32Array(Re),Tn=new Float32Array(Re),En=new Float32Array(Re),Hh=new Float32Array(Re),Vr=new Float32Array(Re);let r=s.getSpacedPoints(Re);for(let a=0;a<Re;a++)ct[a]=r[a].x,lt[a]=r[a].z,fi[a]=Math.max(i(ct[a],lt[a]),-.35);for(let a=0;a<3;a++){let c=new Float32Array(Re),l=14;for(let u=0;u<Re;u++){let h=0;for(let f=-l;f<=l;f++)h+=fi[(u+f+Re)%Re];c[u]=h/(2*l+1)}fi.set(c)}for(let a=0;a<Re;a++){let c=(a+Re-1)%Re,l=(a+1)%Re,u=ct[l]-ct[c],h=lt[l]-lt[c],f=Math.hypot(u,h);u/=f,h/=f,Vt[a]=Math.atan2(u,h),Tn[a]=h,En[a]=-u}let o=new Float32Array(Re);for(let a=0;a<Re;a++)o[a]=ir(Vt[(a+4)%Re]-Vt[(a+Re-4)%Re])/(8*ws);for(let a=0;a<Re;a++){let c=0;for(let l=-5;l<=5;l++)c+=o[(a+l+Re)%Re];Vr[a]=c/11,Hh[a]=Math.min(80,Math.sqrt(40/Math.max(Math.abs(Vr[a]),1e-4)))}ft=uE(i);for(let a=0;a<Gt;a++)for(let c=0;c<Gt;c++){let l=-Qi/2+c*ta,u=-Qi/2+a*ta,h=Fc(l,u),f=Math.hypot(l-ct[h],u-lt[h]),d=fi[h];if(Rx(l,u)){let g=Ax(l,u),_=Math.hypot(l-ft.X[g],u-ft.Z[g]);_<f&&(f=_,d=ft.Y[g])}Cm[a*Gt+c]=Kn(d,i(l,u),at(Gn+2,Gn+17,f)),Pm[a*Gt+c]=f}Ts.rain=0,Ts.snow=0,Dc.visible=Nc.visible=!1,na.uniforms.uRain.value=0,Lm.length=0;{let a=Pe({color:e.cloudCol[0],emissive:e.cloudCol[1],emissiveIntensity:.55,fog:!1});Gh.push(a);let c=new Lo(1,2);for(let l=0;l<e.clouds;l++){let u=[],h=5+(t()*5|0);for(let _=0;_<h;_++){let p=c.clone(),m=.6+t()*.8;p.scale(m*1.5,m*.8,m),p.translate((_-h/2)*.95+t()*.4,t()*.35,(t()-.5)*1.1),u.push(p)}let f=new Ye(Ks(u),a),d=t()*Math.PI*2,g=700+t()*1500;f.position.set(Math.cos(d)*g,(e.weather==="rain"?150:190)+t()*260,Math.sin(d)*g),f.scale.setScalar(45+t()*70),f.rotation.y=t()*6,mn.add(f)}}{let a=new Float32Array(Gt*Gt*3),c=new Float32Array(Gt*Gt*3),l=new Float32Array(Gt*Gt*2),u=[];for(let _=0;_<Gt;_++)for(let p=0;p<Gt;p++){let m=_*Gt+p,y=-Qi/2+p*ta,v=-Qi/2+_*ta;a[m*3]=y,a[m*3+1]=Cm[m],a[m*3+2]=v,l[m*2]=y/7,l[m*2+1]=v/7}for(let _=0;_<ia;_++)for(let p=0;p<ia;p++){let m=_*Gt+p,y=m+1,v=m+Gt,S=v+1;u.push(m,v,y,y,v,S)}let h=new vt;h.setAttribute("position",new gt(a,3)),h.setAttribute("uv",new gt(l,2)),h.setIndex(u),h.computeVertexNormals();let f=h.attributes.normal,d=new ae;for(let _=0;_<Gt*Gt;_++)e.paint(d,a[_*3],a[_*3+1],a[_*3+2],f.getY(_),Pm[_]),c[_*3]=d.r,c[_*3+1]=d.g,c[_*3+2]=d.b;h.setAttribute("color",new gt(c,3));let g=new Ye(h,Pe({vertexColors:!0,map:zh,roughness:.95,metalness:0}));g.material.map=zh,vx(g.material,e.id),g.receiveShadow=!0,mn.add(g),e.ocean||sE(e.edgeH,e.edgeCol)}{let a=[-10.5,-8,-4,0,4,8,10.5],c=a.length,l=[],u=[],h=[],f=Math.round(Ac/14);for(let v=0;v<=Re;v++){let S=v%Re;for(let E=0;E<c;E++){let M=ct[S]+Tn[S]*a[E],x=lt[S]+En[S]*a[E];l.push(M,wt(M,x)+.07,x),u.push(E/(c-1),v/Re*f)}}for(let v=0;v<Re;v++)for(let S=0;S<c-1;S++){let E=v*c+S,M=E+1,x=E+c,b=x+1;h.push(E,x,M,M,x,b)}let d=new vt;d.setAttribute("position",new rt(l,3)),d.setAttribute("uv",new rt(u,2)),d.setIndex(h),d.computeVertexNormals();let[g,_,p]=e.road,m=$n(256,256,(v,S,E)=>{v.fillStyle=g,v.fillRect(0,0,S,E);for(let x=0;x<90;x++)v.globalAlpha=.05+Math.random()*.12,v.fillStyle=Math.random()<.6?_:p,v.fillRect(30+Math.random()*(S-60),0,1+Math.random()*4,E);if(e.id!=="beach"){v.globalAlpha=.18,v.fillStyle=_;for(let x of[78,100,156,178])v.fillRect(x,0,9,E)}bt.ready&&(v.globalAlpha=1,v.globalCompositeOperation="multiply",v.drawImage(bt.tex.gravel.image,0,0,S,E),v.globalCompositeOperation="source-over"),v.globalAlpha=1,v.globalCompositeOperation="destination-in";let M=v.createLinearGradient(0,0,S,0);M.addColorStop(0,"rgba(0,0,0,0)"),M.addColorStop(.16,"rgba(0,0,0,.92)"),M.addColorStop(.84,"rgba(0,0,0,.92)"),M.addColorStop(1,"rgba(0,0,0,0)"),v.fillStyle=M,v.fillRect(0,0,S,E)},{repeat:!0}),y=new Ye(d,Pe({map:m,transparent:!0,depthWrite:!1,roughness:1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));bt.ready&&(y.material.normalMap=bt.nrm.gravel,y.material.normalScale.set(.8,.8)),y.receiveShadow=!0,y.renderOrder=1,mn.add(y)}if(e.water){let a=na.uniforms;a.uShallow.value.set(e.water[0]),a.uMid.value.set(e.water[1]),a.uDeep.value.set(e.water[2]),a.uSky.value.set(e.water[3]);let c=200,l=new ti(Qi,Qi,c,c);l.rotateX(-Math.PI/2);let u=l.attributes.position,h=new Float32Array(u.count);for(let d=0;d<u.count;d++)h[d]=Math.min(wt(u.getX(d),u.getZ(d)),.4);l.setAttribute("aDepth",new gt(h,1));let f=new Ye(l,na);if(f.renderOrder=2,mn.add(f),e.ocean){let d=new ti(9e3,9e3);d.rotateX(-Math.PI/2),d.setAttribute("aDepth",new gt(new Float32Array(4).fill(-9),1));let g=new Ye(d,na);g.position.y=-.06,g.renderOrder=2,mn.add(g)}}e.scenery(t);{let a=[],c=[],l=[],u=(f,d)=>ft&&d===ft.side&&(f>ft.a-6&&f<ft.a+46||f>ft.b-46&&f<ft.b+6);for(let f=0;f<Re;f+=7)for(let d of[-1,1]){if(u(f,d))continue;let g=d*(Gn+1.6),_=ct[f]+Tn[f]*g,p=lt[f]+En[f]*g,m=wt(_,p);a.push({x:_,y:Math.max(m,-.1)+.45,z:p,c:(f/7|0)%2?16777215:16724804}),l.push({x:_,y:Math.max(m,-.1)+.95,z:p})}Rt(new Mt(.2,.26,.9,8),Pe({color:16777215,roughness:.5}),a),Rt(new Mt(.21,.21,.12,8),tr(Pe({color:16756768,emissive:16752656,emissiveIntensity:.2}),.2,2.4),l,!1);for(let f=0;f<Re;f+=5)if(Math.abs(Vr[f])>.013&&!u(f,-Math.sign(Vr[f]))){let d=-Math.sign(Vr[f]),g=d*(Gn+4.2),_=ct[f]+Tn[f]*g,p=lt[f]+En[f]*g;c.push({x:_,y:Math.max(wt(_,p),0)+1.2,z:p,ry:Vt[f]+Math.PI-d*.5})}let h=$n(128,64,(f,d,g)=>{f.fillStyle="#fff",f.fillRect(0,0,d,g),f.fillStyle="#ff2f45";for(let _=-1;_<5;_++)f.beginPath(),f.moveTo(_*32,0),f.lineTo(_*32+16,0),f.lineTo(_*32+40,32),f.lineTo(_*32+16,64),f.lineTo(_*32,64),f.lineTo(_*32+24,32),f.fill()});Rt(new xt(4.4,1.5,.15),Pe({map:h,roughness:.6}),c)}{let c=new Yt,l=Pe({color:e.gate,roughness:.4,metalness:.2});for(let p of[-1,1])c.add(nt(new Mt(.7,.9,11,14),l,p*14.6,5,0)),c.add(nt(new qn(1.1,14,10),tr(Pe({color:16762938,emissive:16754176,emissiveIntensity:.8}),.8,3),p*14.6,11.2,0));let u="#"+new ae(e.gate).getHexString(),h=$n(1024,128,p=>{for(let m=0;m<4;m++)for(let y=0;y<32;y++)p.fillStyle=(y+m)%2?"#fff":"#111",p.fillRect(y*32,m*32,32,32);p.fillStyle=u,p.fillRect(222,14,580,100),p.fillStyle="#fff",p.font="italic 900 80px Avenir Next, Arial",p.textAlign="center",p.textBaseline="middle",p.fillText(e.banner,512,68)}),f=Pe({map:h,roughness:.6});if(bt.ready&&bt.gate){c.clear(),h.flipY=!1,h.needsUpdate=!0;let p={Gate:l,Banner:f,Bulb:tr(Pe({color:16762938,emissive:16754176,emissiveIntensity:.8}),.8,3),Lamp:tr(Pe({color:16777215,emissive:16773840,emissiveIntensity:.4}),.4,3)},m=bt.gate.clone();m.traverse(y=>{y.isMesh&&p[y.material.name]&&(y.material=p[y.material.name])}),c.add(m)}else c.add(nt(new xt(29.5,3,.5),[l,l,l,l,f,f],0,9.4,0));c.position.set(ct[0],fi[0],lt[0]),c.rotation.y=Vt[0],c.traverse(p=>{p.isMesh&&(p.castShadow=!0)}),mn.add(c);let d=$n(256,32,p=>{for(let m=0;m<2;m++)for(let y=0;y<16;y++)p.fillStyle=(y+m)%2?"#fff":"#111",p.fillRect(y*16,m*16,16,16)}),g=new ti(Gn*2+2,2.2);g.rotateX(-Math.PI/2);let _=new Ye(g,Pe({map:d,roughness:.8,polygonOffset:!0,polygonOffsetFactor:-6,polygonOffsetUnits:-6,transparent:!0,opacity:.92,depthWrite:!1}));_.position.set(ct[0],fi[0]+.1,lt[0]),_.rotation.y=Vt[0],_.renderOrder=3,_.receiveShadow=!0,mn.add(_)}Lc=[];{let a=new ti(5.2,8);a.rotateX(-Math.PI/2);let c=new yn({map:gx,color:new ae(1,2.2,3.2),transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-8,polygonOffsetUnits:-8});for(let l of[.05,.17,.34,.5,.63,.8,.92]){let u=Math.round(l*Re),h=0;for(;h++<90&&(Math.abs(fi[(u+6)%Re]-fi[u])>.25||fi[u]<.2||aE(ct[u],lt[u]));)u=(u+1)%Re;let f=(t()-.5)*8,d=ct[u]+Tn[u]*f,g=lt[u]+En[u]*f,_=new Ye(a,c);_.position.set(d,wt(d,g)+.16,g),_.rotation.y=Vt[u],_.renderOrder=4,mn.add(_),Lc.push({i:u,lat:f})}}nr=[];for(let a=30;a<Re-30;a+=34){let c=[-5,0,5][t()*3|0],l=(t()-.5)*1.2;if(!Lc.some(u=>Math.abs(u.i-a)<14))for(let u=0;u<5;u++){let h=a+u*3,f=c+l*(u-2),d=ct[h]+Tn[h]*f,g=lt[h]+En[h]*f;nr.push({x:d,y:Math.max(wt(d,g),0)+1.15,z:g,t:0,ph:u*.5})}}return ft&&fE(t),Wr=new Vs(_x,xx,nr.length),Wr.castShadow=!0,Wr.frustumCulled=!1,mn.add(Wr),wx(),e}var Mi=!1,Lm=[],tr=(n,e,t)=>(n.userData.gd=e,n.userData.gn=t,Lm.push(n),n),Am={sky:[264732,1714764,660528],fog:[924211,200,1300],hemi:[5271728,1317928,.5],sun:[11059455,1.1],exposure:1.18,env:.22,rainSky:[659224,1975600,1054238],rainFog:[1383462,40,520]};function Dm(n){Mi=!!n,Ei&&wx()}function wx(){let n=Ei,e=Mi?Object.assign({},Am,n.id==="snow"?{hemi:[7377104,5925512,.7],exposure:1.05}:{}):n;bi.uniforms.uZen.value.set(e.sky[0]),bi.uniforms.uHor.value.set(e.sky[1]),bi.uniforms.uLow.value.set(e.sky[2]),bi.uniforms.uSunK.value=1,bi.uniforms.uSunCol.value.set(Mi?14674175:16772032),bi.uniforms.uGlow.value=Mi?.25:1,jt.fog.color.set(e.fog[0]),jt.fog.near=e.fog[1],jt.fog.far=e.fog[2],Ic.color.set(e.hemi[0]),Ic.groundColor.set(e.hemi[1]),Ic.intensity=e.hemi[2],an.color.set(e.sun[0]),an.intensity=e.sun[1],Pn.toneMappingExposure=e.exposure,jt.environmentIntensity=e.env,Object.assign(bn,{near:e.fog[1],far:e.fog[2],sun:e.sun[1],hemi:e.hemi[2],rainSky:Mi?Am.rainSky:n.rainSky,rainFog:Mi?Am.rainFog:n.rainFog}),bn.fog.set(e.fog[0]),bn.zen.set(e.sky[0]),bn.hor.set(e.sky[1]),bn.low.set(e.sky[2]),eE.visible=Mi,bn.cloud.set(Mi?2766160:n.cloudCol[0]);for(let t of Gh)t.color.copy(bn.cloud),t.emissive.set(Mi?791592:n.cloudCol[1]);for(let t of Lm)t.emissiveIntensity=Mi?t.userData.gn:t.userData.gd;xx.emissiveIntensity=Mi?.9:.55,tE(),document.body.style.background="#"+new ae(e.sky[1]).getHexString()}var ft=null,kh=6.5,lE=9.5,Es={},Uh=n=>(Es.fail[n]=(Es.fail[n]||0)+1,null);function uE(n){let e=[];for(let t=70;t<Re-140;t+=5)for(let i=t+60;i<Math.min(Re-60,t+460);i+=5){let s=Math.hypot(ct[i]-ct[t],lt[i]-lt[t]),r=(i-t)*ws;if(s<50||s>240||r<s*1.3)continue;let o=r-s*1.2;e.push({a:t,b:i,L:s,save:Math.min(o,150)-s*.05-Math.max(0,s-170)})}e.sort((t,i)=>i.save-t.save),Es.cand=e.length,Es.fail={};for(let t of e.slice(0,2500)){let i=hE(t.a,t.b,t.L,n);if(i)return i}return null}function hE(n,e,t,i){let s=new N(ct[n],0,lt[n]),r=new N(ct[e],0,lt[e]),o=new N(Math.sin(Vt[n]),0,Math.cos(Vt[n])),a=new N(Math.sin(Vt[e]),0,Math.cos(Vt[e])),c=new Io(s,s.clone().addScaledVector(o,t*.24),r.clone().addScaledVector(a,-t*.24),r),l=c.getLength();if(l>(e-n)*ws*.8)return Uh("len");for(let R=1;R<20;R++){let I=R/20,A=c.getPoint(I),L=I<.1||I>.9?0:I<.3||I>.7?21:30;if(L){for(let B=0;B<Re;B+=3){if(B>n-12&&B<n+50&&I<.35||B>e-50&&B<e+12&&I>.65)continue;let P=A.x-ct[B],H=A.z-lt[B];if(P*P+H*H<L*L)return Uh("clear")}if(Math.max(Math.abs(A.x),Math.abs(A.z))>330)return Uh("edge")}}let u=Math.max(20,Math.round(l/1.5)),h=c.getSpacedPoints(u-1),f=new Float32Array(u),d=new Float32Array(u),g=new Float32Array(u),_=new Float32Array(u),p=new Float32Array(u),m=new Float32Array(u);for(let R=0;R<u;R++){f[R]=h[R].x,d[R]=h[R].z;let I=R/(u-1),A=at(0,.22,I)*at(1,.78,I);g[R]=Kn(Kn(fi[n],fi[e],I),Math.max(i(f[R],d[R]),-.35),A)}let y=g;for(let R=0;R<3;R++){let I=new Float32Array(u);for(let A=0;A<u;A++){if(A<2||A>u-3){I[A]=y[A];continue}let L=0,B=0;for(let P=-8;P<=8;P++){let H=on(A+P,0,u-1);L+=y[H],B++}I[A]=L/B}y=I}for(let R=1;R<u;R++)if(Math.abs(y[R]-y[R-1])/1.5>.36)return Uh("slope");for(let R=0;R<u;R++){let I=Math.max(0,R-1),A=Math.min(u-1,R+1),L=f[A]-f[I],B=d[A]-d[I],P=Math.hypot(L,B)||1;L/=P,B/=P,_[R]=Math.atan2(L,B),p[R]=B,m[R]=-L}let v=1e9,S=-1e9,E=1e9,M=-1e9;for(let R=0;R<u;R++)v=Math.min(v,f[R]),S=Math.max(S,f[R]),E=Math.min(E,d[R]),M=Math.max(M,d[R]);let x=u>>1,b=Math.sign((f[x]-ct[n])*Tn[n]+(d[x]-lt[n])*En[n])||1;return{a:n,b:e,M:u,X:f,Z:d,Y:y,H:_,NX:p,NZ:m,side:b,len:l,save:(e-n)*ws-l,box:[v-30,S+30,E-30,M+30]}}function Ax(n,e,t=-1){let i=ft,s=0,r=1e18,o=0,a=i.M-1;t>=0&&(o=Math.max(0,t-25),a=Math.min(i.M-1,t+25));for(let c=o;c<=a;c++){let l=n-i.X[c],u=e-i.Z[c],h=l*l+u*u;h<r&&(r=h,s=c)}return s}var Rx=(n,e)=>ft&&n>ft.box[0]&&n<ft.box[1]&&e>ft.box[2]&&e<ft.box[3],Rm={px:0,pz:0,nx:0,nz:0,hd:0,rw:Gn,wall:hx};function Cx(n,e){let t=Fc(n.x,n.z,n.mi>=0?n.mi:n.idx,30);n.mi=t;let i=!1;if(ft&&(n.sc||e)&&Rx(n.x,n.z)){let s=Ax(n.x,n.z,n.sc?n.si:-1),r=Math.hypot(n.x-ft.X[s],n.z-ft.Z[s]),o=Math.hypot(n.x-ct[t],n.z-lt[t]);s>0&&s<ft.M-1&&(n.sc?r<o+.6:r<o-.6)&&(i=!0,n.si=s)}if(n.sc=i,i){let s=n.si;n.idx=Math.round(ft.a+s/(ft.M-1)*(ft.b-ft.a)),Object.assign(Rm,{px:ft.X[s],pz:ft.Z[s],nx:ft.NX[s],nz:ft.NZ[s],hd:ft.H[s],rw:kh,wall:lE})}else n.idx=t,Object.assign(Rm,{px:ct[t],pz:lt[t],nx:Tn[t],nz:En[t],hd:Vt[t],rw:Gn,wall:hx});return Rm}function fE(n){let e=ft,t=[-8.2,-6,-3,0,3,6,8.2],i=t.length,s=[],r=[],o=[];for(let M=0;M<e.M;M++)for(let x=0;x<i;x++){let b=e.X[M]+e.NX[M]*t[x],R=e.Z[M]+e.NZ[M]*t[x];s.push(b,wt(b,R)+.06,R),r.push(x/(i-1),M*1.5/12)}for(let M=0;M<e.M-1;M++)for(let x=0;x<i-1;x++){let b=M*i+x,R=b+1,I=b+i,A=I+1;o.push(b,I,R,R,I,A)}let a=new vt;a.setAttribute("position",new rt(s,3)),a.setAttribute("uv",new rt(r,2)),a.setIndex(o),a.computeVertexNormals();let c=$n(128,128,(M,x,b)=>{M.fillStyle="#8f8676",M.fillRect(0,0,x,b);for(let I=0;I<900;I++)M.fillStyle=`hsl(35,${8+Math.random()*10}%,${30+Math.random()*40}%)`,M.fillRect(Math.random()*x,Math.random()*b,1+Math.random()*3,1+Math.random()*3);M.globalCompositeOperation="destination-in";let R=M.createLinearGradient(0,0,x,0);R.addColorStop(0,"rgba(0,0,0,0)"),R.addColorStop(.18,"rgba(0,0,0,.95)"),R.addColorStop(.82,"rgba(0,0,0,.95)"),R.addColorStop(1,"rgba(0,0,0,0)"),M.fillStyle=R,M.fillRect(0,0,x,b)},{repeat:!0}),l=new Ye(a,Pe({map:c,transparent:!0,depthWrite:!1,roughness:1,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3}));l.receiveShadow=!0,l.renderOrder=1,mn.add(l);let u=$n(512,384,(M,x,b)=>{M.fillStyle="#111",M.fillRect(0,0,x,b),M.fillStyle="#ffd21a",M.beginPath(),M.roundRect(10,10,x-20,b-20,26),M.fill(),M.lineWidth=10,M.strokeStyle="#111",M.beginPath(),M.roundRect(30,30,x-60,b-60,18),M.stroke(),M.fillStyle="#111",M.textAlign="center",M.textBaseline="middle",M.font="900 64px Avenir Next, Arial",M.fillText("\u{1F6A7}",x/2,92),M.font="italic 900 70px Avenir Next, Arial",M.fillText("WORK IN",x/2,178),M.fillText("PROGRESS",x/2,258),M.save(),M.beginPath(),M.rect(40,300,x-80,40),M.clip();for(let R=20;R<x;R+=48)M.beginPath(),M.moveTo(R,300),M.lineTo(R+24,300),M.lineTo(R-16,340),M.lineTo(R-40,340),M.fill();M.restore()}),h=tr(Pe({map:u,emissive:16777215,emissiveMap:u,emissiveIntensity:0,roughness:.5}),0,.55),f=Pe({color:7829367,roughness:.4,metalness:.6}),d=Math.min(e.M-1,9),g=e.side*(kh+3.4),_=e.X[d]+e.NX[d]*g,p=e.Z[d]+e.NZ[d]*g,m=wt(_,p);ji(_,m,p,e.H[d]+Math.PI-e.side*.35,nt(new xt(4.2,3.15,.14),[f,f,f,f,h,f],0,3.5,0),nt(new Mt(.09,.09,3.6,8),f,-1.5,1.4,-.1),nt(new Mt(.09,.09,3.6,8),f,1.5,1.4,-.1));let y=[],v=[];for(let M=2;M<Math.min(e.M,30);M+=4)for(let x of[-1,1]){let b=x*(kh+1.2),R=e.X[M]+e.NX[M]*b,I=e.Z[M]+e.NZ[M]*b;y.push({x:R,y:wt(R,I),z:I,ry:n()*6})}for(let M of[Math.round(e.M*.35),Math.round(e.M*.65)])for(let x of[-1,1]){let b=x*(kh+2),R=e.X[M]+e.NX[M]*b,I=e.Z[M]+e.NZ[M]*b;v.push({x:R,y:wt(R,I)+.9,z:I,ry:e.H[M]})}let S=Ks([new Bn(.34,.95,12).translate(0,.52,0),new xt(.75,.06,.75).translate(0,.03,0)]);Rt(S,tr(Pe({color:16738816,emissive:16730624,emissiveIntensity:.1,roughness:.5}),.1,.6),y);let E=$n(128,32,(M,x,b)=>{M.fillStyle="#fff",M.fillRect(0,0,x,b),M.fillStyle="#e8232f";for(let R=-32;R<x;R+=32)M.beginPath(),M.moveTo(R,0),M.lineTo(R+16,0),M.lineTo(R+32,b),M.lineTo(R+16,b),M.fill()});Rt(new xt(.12,.7,3.6),Pe({map:E,roughness:.6}),v);for(let M=Math.round(e.M*.3);M<e.M*.75;M+=5)nr.push({x:e.X[M],y:Math.max(wt(e.X[M],e.Z[M]),0)+1.15,z:e.Z[M],t:0,ph:M*.3})}var ca=(n,e)=>{try{let t=localStorage.getItem(n);return t?JSON.parse(t):e}catch{return e}},Qt=Bc.includes(ca("ccr_track","beach"))?ca("ccr_track","beach"):"beach",Qr=!!ca("ccr_night",!1);Dm(Qr);qh(Qt);var zc=new Nt({color:1776672,roughness:.92}),$t=new Nt({color:2303532,roughness:.5,metalness:.6}),es=new Nt({color:14673646,roughness:.15,metalness:1}),jh=new Set([zc,$t,es]),dE=new N(0,1,0);function ri(n,e,t,i){let s=new N().subVectors(e,n),r=new Ye(new Mt(t,t,s.length(),7),i);return r.position.copy(n).addScaledVector(s,.5),r.quaternion.setFromUnitVectors(dE,s.normalize()),r}var pE=$n(128,128,(n,e,t)=>{let i=n.createRadialGradient(64,64,4,64,64,64);i.addColorStop(0,"rgba(255,255,255,1)"),i.addColorStop(.5,"rgba(255,255,255,.45)"),i.addColorStop(1,"rgba(255,255,255,0)"),n.clearRect(0,0,e,t),n.fillStyle=i,n.fillRect(0,0,e,t)});function mE(n,e){let t=n.body==="sports",i=n.tyres==="big",s=i?.86:.62,r=i?.78:.52,o=s-.62,a=i?1.2:1.08,c=(X,G,J)=>new N(X,G+o,J),l=new Yt,u=new Yt;l.add(u);let h=new vn({color:n.paint,roughness:n.metal?.12:.32,metalness:n.metal?1:.25,clearcoat:1,clearcoatRoughness:.1}),f=new Nt({color:n.rim,roughness:.3,metalness:.5,emissive:n.rim,emissiveIntensity:.9}),d=new Nt({color:16777215,roughness:.4}),g=new Nt({color:16777215,emissive:16773824,emissiveIntensity:2}),_=(X,G,J,se,ye,Le,j,D=0)=>{let O=new Ye(new xt(X,G,J),j);return O.position.set(se,ye+o,Le),O.rotation.x=D,u.add(O),O},p=new Ye(new qn(.27,14,10),new Nt({color:16777215,roughness:.25})),m=new Ye(new qn(.2,10,8),new Nt({color:1053980,roughness:.1,metalness:.8})),y=1.2,v=-2,S=null,E=K_(.5),M=bt.ready&&bt.cars[t?"buggy_sports":"buggy_classic"];if(M){let X=new Nt({color:n.paint,roughness:.7}),G=new Nt({color:n.rim,roughness:.35,metalness:.3}),J={Paint:h,Dark:$t,Chrome:es,Tire:zc,Rim:f,Lamp:g,Suit:X,Accent:G},se=M.clone();se.position.y=o;let ye=bt.wear[t?"buggy_sports":"buggy_classic"],Le={Paint:1,Accent:1,Dark:.7,Rim:.6,Seat:.25,Suit:.2,Helmet:.5,Tire:.15,Chrome:0},j={},D=e&&(t?{sideBox:new _t(-1.95,1.95,.64,1.1),hoodBox:new _t(-.62,.62,.55,1.75)}:{sideBox:new _t(-1.68,1.62,.7,1.24),hoodBox:new _t(-.62,.62,.62,1.72)});D&&Object.assign(D,SE(n,e));let O=(W,k)=>j[W]||(j[W]=Xp(jh.has(k)||!J[W]?k.clone():k,ye,E,Le[W],W==="Paint"||W==="Accent"?D:null));se.traverse(W=>{if(W.isMesh){let k=W.material.name,ee=J[k]||W.material;ye&&k in Le?W.material=O(k,ee):(W.material=ee,J[k]||jh.add(ee))}}),S=se,u.add(se),t&&(y=1.12,v=-2.25)}else if(t){_(1.62,.22,3.5,0,.66,0,$t),_(1.52,.3,1.6,0,.84,1.25,h,.14),_(.34,.02,1.62,0,1,1.25,d,.14),_(1.2,.05,.05,0,.88,2.05,g);for(let X of[-1,1])_(.44,.44,2.1,X*.84,.86,-.25,h),_(.46,.08,1.6,X*.84,1.1,-.25,$t);_(1,.32,1.25,0,.92,-.25,$t),_(1.05,.38,.05,0,1.18,.42,new vn({color:10475775,roughness:.05,metalness:0,transmission:.6,transparent:!0,opacity:.55}),-.65),_(1.34,.5,1.2,0,1.05,-1.45,h,-.18),_(.5,.34,.55,0,1.42,-1,$t),_(2.3,.08,.62,0,1.98,-2.05,h);for(let X of[-1,1])_(.06,.55,.75,X*1.15,1.85,-2.05,$t),u.add(ri(c(X*.45,1.25,-1.85),c(X*.45,1.95,-2),.05,$t));for(let X of[-1,1])u.add(ri(c(X*.48,1,-.82),c(X*.44,1.78,-.86),.06,es));if(u.add(ri(c(-.44,1.78,-.86),c(.44,1.78,-.86),.06,es)),p.position.set(0,1.5+o,-.45),m.position.set(0,1.52+o,-.3),_(.34,.36,.24,0,1.18,-.45,new Nt({color:n.paint,roughness:.7})),!n.rocket)for(let X of[-1,1])u.add(ri(c(X*.3,1.2,-1.95),c(X*.3,1.1,-2.25),.08,es));y=1.12,v=-2.25}else{_(1.5,.28,3,0,.78,0,$t),_(1.46,.42,1.25,0,1,1.15,h,.2),_(.5,.06,1.2,0,1.24,1.13,d,.2);for(let X of[-1,1])_(.34,.5,1.9,X*.86,.95,-.15,h),_(.16,.16,.1,X*.5,1.02,1.8,g);_(1.5,.5,.9,0,1.05,-1.25,h),_(.9,.3,.6,0,1.4,-1.3,$t),_(.62,.75,.2,0,1.3,-.62,$t),p.position.set(0,1.78+o,-.42),m.position.set(0,1.8+o,-.27),_(.34,.45,.24,0,1.38,-.42,new Nt({color:n.paint,roughness:.7}));for(let X of[-1,1])u.add(ri(c(X*.7,1.05,.62),c(X*.62,2.1,.05),.055,$t),ri(c(X*.62,2.1,.05),c(X*.62,2.1,-.95),.055,$t),ri(c(X*.62,2.1,-.95),c(X*.72,1.1,-1.6),.055,$t),ri(c(X*.62,2.1,-.5),c(X*.72,1.1,-.6),.045,$t),ri(c(X*.45,1.6,-1.75),c(X*.45,1.98,-1.85),.04,$t)),n.rocket||u.add(ri(c(X*.3,1.5,-1.5),c(X*.3,1.2,-2),.07,es));u.add(ri(c(-.62,2.1,.05),c(.62,2.1,.05),.055,$t),ri(c(-.62,2.1,-.95),c(.62,2.1,-.95),.055,$t),ri(c(-.8,.72,1.86),c(.8,.72,1.86),.08,es)),_(1.3,.06,1.05,0,2.15,-.45,h),_(1.9,.07,.5,0,2.02,-1.88,h);for(let X=0;X<4;X++){let G=new Ye(new Mt(.13,.13,.12,12),new Nt({color:16777215,emissive:16771496,emissiveIntensity:2.2}));G.rotation.x=Math.PI/2,G.position.set(-.48+X*.32,2.3+o,.08),u.add(G)}}M||u.add(p,m);let x=[],b=!!n.rocket,R=b&&bt.ready&&bt.cars.rocket;if(R)for(let X of[-1,1]){let G=X*.62,J=(t?1.38:1.45)+o,se=R.clone();se.position.set(G,J,-1.45),se.traverse(ye=>{if(ye.isMesh){let Le={Chrome:es,Dark:$t}[ye.material.name];Le?ye.material=Le:jh.add(ye.material)}}),u.add(se),y=J,v=-2.3}else if(b)for(let X of[-1,1]){let G=X*.62,J=(t?1.38:1.45)+o,se=new Ye(new Mt(.2,.2,1.3,14),new Nt({color:15922423,roughness:.3,metalness:.7}));se.rotation.x=Math.PI/2,se.position.set(G,J,-1.45),u.add(se);let ye=new Ye(new Bn(.2,.42,14),new Nt({color:16722493,roughness:.35,metalness:.4}));ye.rotation.x=Math.PI/2,ye.position.set(G,J,-.6),u.add(ye);let Le=new Ye(new Mt(.16,.25,.3,14,1,!0),$t);Le.rotation.x=Math.PI/2,Le.position.set(G,J,-2.2),u.add(Le);for(let j of[0,1,2]){let D=new Ye(new xt(.03,.26,.34),new Nt({color:16722493})),O=j*2.094;D.position.set(G+Math.sin(O)*.24,J+Math.cos(O)*.24,-1.95),D.rotation.z=-O,u.add(D)}y=J,v=-2.35}let I=b?new ae(4.5,1.7,.45):new ae(.5,2.2,4.5);for(let X of[-1,1]){let G=new Bn(b?.22:.16,b?2.6:1.6,10);G.rotateX(-Math.PI/2),G.translate(0,0,b?-1.3:-.8);let J=new Ye(G,new yn({color:I,transparent:!0,opacity:.85,blending:Ms,depthWrite:!1}));J.position.set(X*(b?.62:.3),b?y:y+o,v),J.visible=!1,u.add(J),x.push(J)}if(n.glow){let X=new Ye(new ti(3.2,4.6),new yn({map:pE,color:new ae(n.glow).multiplyScalar(2.2),transparent:!0,opacity:.85,blending:Ms,depthWrite:!1}));X.rotation.x=-Math.PI/2,X.position.y=.08,X.renderOrder=3,l.add(X),x.glow=X}let A=[],L=bt.ready&&bt.wear[i?"wheel_big":"wheel_std"],B={},P=X=>{let G={Tire:zc,Rim:f,Dark:$t,Chrome:es}[X];return G?L?B[X]||(B[X]=Xp(G.clone(),L,E,{Tire:.15,Rim:.6,Dark:.7,Chrome:0}[X])):G:null},H=new Mt(s,s,r,22);H.rotateZ(Math.PI/2);let K=new Mt(s*.6,s*.6,r+.02,14);K.rotateZ(Math.PI/2);let $=new xt(r-.02,i?.14:.09,s*2.1);for(let[X,G,J]of[[1,1.18,1],[-1,1.18,1],[1,-1.2,0],[-1,-1.2,0]]){let se=X*a,ye=new Yt,Le=new Yt;ye.position.set(se,s,G),ye.add(Le);let j=bt.ready&&bt.cars[i?"wheel_big":"wheel_std"];if(j){let D=j.clone();D.scale.set(r,s,s),D.traverse(O=>{O.isMesh&&(O.material=P(O.material.name)||O.material)}),Le.add(D)}else{Le.add(new Ye(H,zc),new Ye(K,f));for(let W=0;W<(i?8:6);W++){let k=new Ye($,zc);k.rotation.x=W*Math.PI/(i?8:6),Le.add(k)}let D=new Ye(new xt(r+.06,.1,s),es),O=D.clone();O.rotation.x=Math.PI/2,Le.add(D,O)}l.add(ye),A.push({pivot:ye,spin:Le,front:J}),u.add(ri(c(X*.6,.85,G),new N(se*.82,s+.04,G),i?.07:.05,$t))}return l.traverse(X=>{X.isMesh&&(X.castShadow=X.material.blending!==Ms)}),{G:l,body:u,wheels:A,flames:x,wr:s,wearU:E,dmgRoot:S}}function gE(n){n.G.traverse(e=>{e.isMesh&&(e.userData.sharedGeo||e.geometry.dispose(),jh.has(e.material)||e.material.dispose())})}var sf=[{id:"lava",name:"Lava Red",col:15213359,rim:2849791,price:0},{id:"ocean",name:"Ocean Blue",col:1993727,rim:16765498,price:40},{id:"lime",name:"Lagoon Lime",col:6279967,rim:16727450,price:40},{id:"sunset",name:"Sunset Gold",col:16756736,rim:16727423,price:60},{id:"violet",name:"Neon Violet",col:9121013,rim:2291152,price:60},{id:"midnight",name:"Midnight",col:1711401,rim:16738816,price:80},{id:"pearl",name:"Pearl White",col:15921902,rim:49919,price:80},{id:"chrome",name:"Liquid Chrome",col:13226973,rim:16723592,price:300,metal:!0}],Vx=[{id:"magnet",name:"Coin Magnet",price:120,icon:"\u{1F9F2}",desc:"Pulls in coins from more than twice as far away."},{id:"tyres",name:"Monster Tyres",price:150,icon:"\u{1F6DE}",desc:"Huge knobbly tyres. Sand, grass and shallows barely slow you down."},{id:"drift",name:"Drift Kit",price:200,icon:"\u{1F300}",desc:"Drift boosts charge faster and fire 45% longer."},{id:"engine",name:"Turbo Engine",price:250,icon:"\u2699\uFE0F",desc:"+12% acceleration and +3% top speed."},{id:"rocket",name:"Rocket Boost",price:400,icon:"\u{1F680}",desc:"Twin rockets: nitro pushes harder (+55%) and burns 25% slower."},{id:"sports",name:"Sports Buggy",price:600,icon:"\u{1F3CE}\uFE0F",desc:"Low-slung race body: +5% top speed, +4% acceleration, sharper grip."},{id:"glow",name:"Neon Underglow",price:90,icon:"\u2728",desc:"Glows under your buggy in your rim colour. Pure style."}],_E=[30,20,14,10,7,5],Vn={get(n,e){try{let t=localStorage.getItem(n);return t?JSON.parse(t):e}catch{return e}},set(n,e){try{localStorage.setItem(n,JSON.stringify(e))}catch{}}},Zr=Vn.get("ccr_profiles",{}),Wx=n=>({nick:n,coins:0,owned:["lava"],eq:{paint:"lava"},races:0,wins:0,best:0,lap:0,tb:{},earned:0,ts:0});function df(n){let e=n.toLowerCase();return Zr[e]||(Zr[e]=Wx(n),Zm()),Zr[e]}function Zm(){Vn.set("ccr_profiles",Zr)}function jc(n){return sf.find(e=>e.id===n.eq.paint)||sf[0]}function cr(n){let e=jc(n),t=n.eq;return{paint:e.col,rim:e.rim,metal:!!e.metal,body:t.sports?"sports":"classic",tyres:t.tyres?"big":"std",rocket:!!t.rocket,glow:t.glow?e.rim:0}}var Qc={top:1,acc:1,grip:1,off:1,boost:1.36,burn:.3,magnet:1,drift:.55,driftT:.7};function pf(n){let e=n.eq,t={...Qc};return e.engine&&(t.acc*=1.12,t.top*=1.03),e.tyres&&(t.off=.4),e.sports&&(t.top*=1.05,t.acc*=1.04,t.grip=1.15),e.rocket&&(t.boost=1.55,t.burn=.225),e.drift&&(t.drift=.8,t.driftT=.5),e.magnet&&(t.magnet=2.3),t}var Gm=[[1993727,16765498],[16761370,16730716],[2278750,16777215],[11032055,6220500],[16742938,3003647],[15213359,2849791]],Yc=["Azul","Sunny","Mango","Orchid","Blaze","Coral"],Jm=n=>({paint:Gm[n][0],rim:Gm[n][1],metal:!1,body:"classic",tyres:"std",rocket:!1,glow:0}),Xc=Vn.get("ccr_board",{});function xE(n){let e=Object.assign({},n.tb||{});return!e.beach&&n.best&&(e.beach=[n.best,n.lap||0]),e}function el(n){return{nick:n.nick,wins:n.wins,races:n.races,best:n.best,lap:n.lap,tb:xE(n),earned:n.earned,paint:jc(n).col,body:n.eq.sports?1:0,ts:n.ts}}var rf=(n,e)=>n.tb&&n.tb[e]?n.tb[e]:e==="beach"&&n.best?[n.best,n.lap||0]:[0,0];function ua(n){let e=!1;for(let t of n||[]){if(!t||typeof t.nick!="string"||!/^[\w \-]{2,14}$/.test(t.nick))continue;let i=t.nick.toLowerCase(),s=Xc[i],r={};if(t.tb&&typeof t.tb=="object")for(let a of Bc){let c=t.tb[a];Array.isArray(c)&&(r[a]=[+c[0]||0,+c[1]||0])}let o={nick:t.nick,wins:+t.wins|0,races:+t.races|0,best:+t.best||0,lap:+t.lap||0,tb:r,earned:+t.earned|0,paint:+t.paint|0,body:+t.body|0,ts:+t.ts||0};(!s||o.races>s.races||o.races===s.races&&o.ts>s.ts)&&(Xc[i]=o,e=!0)}return e&&Vn.set("ccr_board",Xc),e}var Xx=()=>Object.values(Xc).sort((n,e)=>e.wins-n.wins||(rf(n,Qt)[0]||1e9)-(rf(e,Qt)[0]||1e9)||e.earned-n.earned);for(let n of Object.values(Zr))ua([el(n)]);var qx=n=>n.k===5?.35:.3+.45*((Math.sin(n.k*12.9898)*43758.5453%1+1)%1),Yx={beach:12756087,desert:12088387,country:4928547,snow:13226716};Ch.mudCol.value.set(Yx[Qt]);var Bt=Gm.map((n,e)=>({k:e,name:Yc[e],model:null,lookKey:"",ctrl:"ai",st:Qc,view:null,prof:null,x:0,y:0,z:0,h:0,vx:0,vz:0,vy:0,steer:0,surf:1,idx:0,mi:-1,sc:!1,si:0,dist:0,lap:-1,lat:0,off:0,grounded:!0,air:0,gPrev:0,up:new N(0,1,0),boostT:0,nitro:.5,drift:0,base:[.9,.925,.95,.97,.99,1][e],skill:1,lane:0,laneT:0,laneTarget:0,finished:!1,finishT:0,lapStart:0,bestLap:0,coins:0,wrongT:0,spin:0,emit:0,vf:0,vl:0,net:null,reward:null})),yE=["REEF RAIDERS","SUNDOG RACING","MANGO MOTORSPORT","ORCHID WORKS","BLAZE RALLY","CORAL COAST"],Yh=["CORAL OIL","GRIPTEK","NITROX","DUNELINE","KNOBBY CO","TIDE FUEL"],vE=n=>{let e=n.ctrl==="ai"||n.bot?yE[n.k]:(n.name||"RACER").toUpperCase().slice(0,14),t=0;for(let i of e)t=t*31+i.charCodeAt(0)>>>0;return{team:e,num:n.bot||n.ctrl==="ai"?[77,23,45,88,12,31][n.k]:2+t%97,sponsor:Yh[(n.k+t)%Yh.length],sponsor2:Yh[(n.k+t+3)%Yh.length]}},Nm=new Map;function SE(n,e){let t=[n.paint,n.rim,e.team,e.num,e.sponsor].join("|");if(Nm.has(t))return Nm.get(t);let i=new ae(n.paint),s=i.r*.3+i.g*.59+i.b*.11>.55,r=s?"#101318":"#ffffff",o=s?"rgba(255,255,255,.9)":"rgba(8,10,14,.9)",a="#"+new ae(n.rim).getHexString(),c=$n(1024,160,(h,f,d)=>{h.clearRect(0,0,f,d),h.fillStyle=a,h.beginPath(),h.moveTo(40,150),h.lineTo(980,150),h.lineTo(1010,112),h.lineTo(300,120),h.lineTo(110,132),h.closePath(),h.fill(),h.fillStyle="rgba(10,12,16,.85)",h.beginPath(),h.moveTo(60,158),h.lineTo(990,158),h.lineTo(1e3,146),h.lineTo(80,150),h.closePath(),h.fill(),h.font='italic 900 78px "Arial Black", Arial, sans-serif',h.textAlign="center",h.textBaseline="middle",h.lineJoin="round",h.lineWidth=12,h.strokeStyle=o,h.strokeText(e.team,512,72,440),h.fillStyle=r,h.fillText(e.team,512,72,440),h.font="italic 800 26px Arial, sans-serif";for(let[g,_]of[[150,e.sponsor],[880,e.sponsor2]]){let p=Math.min(200,h.measureText(_).width+26);h.fillStyle="rgba(10,12,16,.8)",h.fillRect(g-p/2,46,p,40),h.fillStyle="#fff",h.fillText(_,g,67,190)}}),l=$n(256,256,(h,f,d)=>{h.clearRect(0,0,f,d),h.fillStyle="#ffffff",h.strokeStyle="#0c0e12",h.lineWidth=10,h.beginPath(),h.arc(128,128,104,0,Math.PI*2),h.fill(),h.stroke(),h.fillStyle="#0c0e12",h.font='italic 900 128px "Arial Black", Arial, sans-serif',h.textAlign="center",h.textBaseline="middle",h.fillText(String(e.num),126,136,180)});c.userData.keep=l.userData.keep=!0;let u={side:c,hood:l};return Nm.set(t,u),u}function no(n,e){let t=vE(n),i=JSON.stringify(e)+t.team+t.num;if(i===n.lookKey&&n.model)return;let s=n.model&&n.model.G.position.clone();n.model&&(jt.remove(n.model.G),gE(n.model)),n.model=mE(e,t),n.model.wearU.wearAmt.value=n.wear=qx(n),n.lookKey=i,n.look=e,jt.add(n.model.G),s&&n.model.G.position.copy(s)}function of(n,e,t){e=(e+Re)%Re,n.x=ct[e]+Tn[e]*t,n.z=lt[e]+En[e]*t,n.h=Vt[e],n.idx=e,n.mi=e,n.sc=!1,n.si=0,n.y=Math.max(wt(n.x,n.z),-.55),n.gPrev=n.y,n.vx=n.vz=n.vy=0,n.vf=n.vl=0,n.steer=0,n.grounded=!0,n.air=0,n.up.set(0,1,0)}var en="solo",Tt=[],af=!1,$c=Vn.get("ccr_split","lr"),jm=0,or=0,it="menu",Vm=0,Wm=9,tl=!1,Om=0;function nl(){Bt.forEach((n,e)=>{of(n,Re-7-7*(e>>1),e%2?-3.6:3.6),n.dist=n.idx-Re,n.lap=-1,n.finished=!1,n.finishT=0,n.bestLap=0,n.coins=0,n.nitro=.5,n.boostT=0,n.lane=n.laneTarget=e%2?-3.6:3.6,n.laneT=2+Vh()*3,n.wrongT=0,n.drift=0,n.auto=px&&n.ctrl==="local",n.net=null,n.reward=null,n.spin=0,n.model&&(Z_(n.model.wearU),n.model.wearU.wearAmt.value=n.wear=qx(n))}),nr.forEach(n=>n.t=0),jm=0,or=0}var oa=n=>n.ctrl==="local"||n.ctrl==="remote"&&!n.bot,kc={throttle:0,steer:0,hand:!1,nitro:!1};function ME(n,e,t){let i=Math.hypot(n.vx,n.vz),s=(n.idx+Math.floor(7+i*.42))%Re;n.laneT-=e,n.laneT<0&&(n.laneT=2+Vh()*4,n.laneTarget=(Vh()*2-1)*5.5),n.lane+=(n.laneTarget-n.lane)*e*.7;let r=ct[s]+Tn[s]*n.lane,o=lt[s]+En[s]*n.lane;if(n.sc&&ft){let l=Math.min(ft.M-1,n.si+Math.floor(6+i*.3));r=ft.X[l],o=ft.Z[l]}let a=ir(Math.atan2(r-n.x,o-n.z)-n.h);t.steer=on(a*2.4,-1,1);let c=999;for(let l=0;l<54;l+=3){let u=Hh[(n.idx+l)%Re]*(.94+n.base*.1)*n.st.top,h=Math.sqrt(u*u+56*l*ws);h<c&&(c=h)}t.throttle=it==="race"||it==="finish"?i<c?1:i>c+4?-1:0:0,t.hand=!1,t.nitro=!1}function Px(n,e,t){let i=n.st,s=Math.sin(n.h),r=Math.cos(n.h),o=n.vx*s+n.vz*r,a=n.vx*r-n.vz*s;n.surf=Ex(n.x,n.z);let c=n.air<.1;n.ctrl==="local"&&!n.auto&&!n.finished&&(e.nitro&&n.nitro>0&&it==="race"&&(n.nitro=Math.max(0,n.nitro-i.burn*t),n.boostT=Math.max(n.boostT,.12)),e.hand&&c&&Math.abs(a)>3.5&&o>12?n.drift+=t:(n.drift>i.driftT&&!e.hand&&(n.boostT=Math.max(n.boostT,Math.min(1.6,n.drift*i.drift)),ns.boost(),Kr(n.view,"DRIFT BOOST!",.6,!0)),e.hand||(n.drift=0)));let u=n.boostT>0;n.boostT=Math.max(0,n.boostT-t);let h=Wh*n.skill*i.top*(u?i.boost:1);if(c){e.throttle>0?o+=fx*i.acc*(u?1.9:1)*e.throttle*Math.max(0,1-o/h)*t:e.throttle<0?o>.5?o-=38*t:o-=14*t*Math.max(0,1+o/13):o-=o*.55*t,u&&o<h&&(o+=10*t);let x=n.gPrev<-.12?.1*i.off:0;o-=o*(.12+.7*n.off*i.off+x)*t,o>h&&(o-=(o-h)*1.2*t),a*=Math.exp(-(e.hand?2.1:9*i.grip*n.surf)*t),e.hand&&(o-=o*.3*t)}n.steer+=(e.steer-n.steer)*Math.min(1,t*7),n.h+=n.steer*2.15*i.grip*on(o/10,-1,1)/(1+Math.abs(o)/75)*(e.hand?1.5/i.grip:1)*(c?1:.2)*t,n.vx=s*o+r*a,n.vz=r*o-s*a,n.vf=o,n.vl=a,n.x+=n.vx*t,n.z+=n.vz*t;let f=n.idx,d=n.sc,g=Cx(n,n.ctrl==="local");n.sc&&!d&&n.view&&!n.auto&&(Kr(n.view,"\u{1F6A7} SECRET BYPASS!",1.1,!0),ns.boost());let _=n.idx-f;_>Re/2&&(_-=Re),_<-Re/2&&(_+=Re),n.dist+=_;let p=g.nx,m=g.nz,y=g.wall,v=g.hd,S=(n.x-g.px)*p+(n.z-g.pz)*m;if(Math.abs(S)>y){let x=Math.sign(S),b=S-x*y;n.x-=p*b,n.z-=m*b,S=x*y;let R=n.vx*p+n.vz*m;R*x>0&&(n.vx-=p*R*1.25,n.vz-=m*R*1.25,n.vx*=.99,n.vz*=.99);let I=Math.abs(ir(n.h-v))<Math.PI/2?v:v+Math.PI;n.h+=ir(I-n.h)*Math.min(1,5*t)}n.lat=S,n.off=on((Math.abs(S)-g.rw-.5)/3.5,0,1);let E=Math.max(wt(n.x,n.z),-.55);n.y<=E+.02?(n.vy=on((E-n.gPrev)/t,-40,26),n.y=E,!n.grounded&&n.air>.25&&Ix(n),n.grounded=!0,n.air=0):(n.vy-=dx*t,n.y+=n.vy*t,n.y<=E?(n.y=E,n.vy=0,n.air>.25&&Ix(n),n.grounded=!0,n.air=0):(n.grounded=!1,n.air+=t)),n.gPrev=E;for(let x of Lc)!n.sc&&Math.abs(x.i-n.idx)<4&&Math.abs(x.lat-S)<3&&n.grounded&&n.boostT<1&&(n.boostT=1.6,n.view&&(ns.boost(),Kr(n.view,"BOOST!",.6,!0)));let M=Math.floor(n.dist/Re);if(M>n.lap&&!n.finished){if(n.lap>=0){let x=or-n.lapStart;(!n.bestLap||x<n.bestLap)&&(n.bestLap=x)}n.lap=M,n.lapStart=or,n.lap>=Uc?(n.finished=!0,n.finishT=or,jm++,n.ctrl==="local"&&LE(n)):n.view&&n.lap>0&&Kr(n.view,n.lap===Uc-1?"FINAL LAP!":"LAP "+(n.lap+1),1.4,!0)}}function Ix(n){for(let e=0;e<14;e++)Qx(n,!0);n.view&&(n.view.shake=.35)}var wi=n=>Math.round(n*100)/100;function Lx(n){return[n.k,wi(n.x),wi(n.y),wi(n.z),wi(n.h),wi(n.vx),wi(n.vy),wi(n.vz),wi(n.vf),wi(n.vl),wi(n.steer),n.dist,n.boostT>0?1:0,n.finished?wi(n.finishT):0,n.coins,wi(n.bestLap)]}function Dx(n){let e=Bt[n[0]];!e||e.ctrl!=="remote"||!Array.isArray(n)||(e.net={x:+n[1],y:+n[2],z:+n[3],h:+n[4],vx:+n[5],vy:+n[6],vz:+n[7],t:performance.now()},e.vf=+n[8],e.vl=+n[9],e.steer=+n[10],e.dist=+n[11],e.boostT=n[12]?.15:0,e.coins=n[14]|0,e.bestLap=+n[15]||0,e.lap=Math.floor(e.dist/Re),n[13]&&!e.finished&&(e.finished=!0,e.finishT=+n[13],jm++))}function bE(n,e){let t=n.net;if(!t)return;let i=Math.min(.3,(performance.now()-t.t)/1e3),s=t.x+t.vx*i,r=t.z+t.vz*i,o=t.y+t.vy*i;Math.hypot(s-n.x,r-n.z)>18&&(n.x=s,n.z=r,n.y=o,n.h=t.h);let a=Math.min(1,e*12);n.x+=(s-n.x)*a,n.z+=(r-n.z)*a,n.y+=(Math.max(o,wt(n.x,n.z))-n.y)*a,n.h+=ir(t.h-n.h)*a,n.vx=t.vx,n.vz=t.vz,n.vy=t.vy;let c=Math.max(wt(n.x,n.z),-.55);n.y=Math.max(n.y,c),n.grounded=n.y<c+.25,n.air=n.grounded?0:n.air+e,n.gPrev=c,n.idx=Fc(n.x,n.z,n.idx,30)}var ki=1400,Jr=new Float32Array(ki*3),qc=new Float32Array(ki*4),Xm=new Float32Array(ki),Yr=new Float32Array(ki*3),Qh=new Float32Array(ki),$x=new Float32Array(ki),Kx=new Float32Array(ki),Zx=new Float32Array(ki),Um=0,Jx=new Uint8Array(ki),jr=new vt;jr.setAttribute("position",new gt(Jr,3));jr.setAttribute("aColor",new gt(qc,4));jr.setAttribute("aSize",new gt(Xm,1));var jx=new Ht({transparent:!0,depthWrite:!1,uniforms:{uScale:{value:600}},vertexShader:"attribute vec4 aColor; attribute float aSize; uniform float uScale; varying vec4 vC; void main(){ vC=aColor; vec4 mv=modelViewMatrix*vec4(position,1.); vC.a*=smoothstep(2.5,7.,-mv.z); gl_PointSize=min(aSize*uScale/max(-mv.z,0.1),160.); gl_Position=projectionMatrix*mv; }",fragmentShader:"varying vec4 vC; void main(){ float r=length(gl_PointCoord-0.5); float a=smoothstep(0.5,0.12,r)*vC.a; if(a<0.004) discard; gl_FragColor=vec4(vC.rgb,a); }"}),Qm=new Vi(jr,jx);Qm.frustumCulled=!1;Qm.renderOrder=5;jt.add(Qm);function qm(n,e,t,i,s,r,o,a,c,l,u,h,f=0){let d=Um;Jx[d]=f,Um=(Um+1)%ki,Jr[d*3]=n,Jr[d*3+1]=e,Jr[d*3+2]=t,Yr[d*3]=i,Yr[d*3+1]=s,Yr[d*3+2]=r,Qh[d]=$x[d]=o,Kx[d]=a,Zx[d]=h,qc[d*4]=c,qc[d*4+1]=l,qc[d*4+2]=u}function Qx(n,e){let t=Math.sin(n.h),i=Math.cos(n.h),s=(Math.random()<.5?-1:1)*1.05,r=n.x-t*1.3+i*s,o=n.z-i*1.3-t*s,a=n.gPrev<-.08,c=e?5:2.5,l=Ei.dust;a?qm(r,.15,o,-n.vx*.12+(Math.random()-.5)*5,3.5+Math.random()*5,-n.vz*.12+(Math.random()-.5)*5,.7+Math.random()*.4,.5+Math.random()*.6,.92,1,1,.75,1):qm(r,n.y+.25,o,n.vx*.12+(Math.random()-.5)*c,.8+Math.random()*2.2,n.vz*.12+(Math.random()-.5)*c,.7+Math.random()*.6,.5+Math.random()*.5,l[0],l[1],l[2],(e?.3:.16)*(Ei.id==="snow"?1.8:1))}function TE(n){for(let e=0;e<ki;e++){if(Qh[e]<=0){Xm[e]=0;continue}Qh[e]-=n;let t=1-Qh[e]/$x[e],i=Jx[e];Yr[e*3+1]-=(i?14:1.2)*n,Jr[e*3]+=Yr[e*3]*n,Jr[e*3+1]+=Yr[e*3+1]*n,Jr[e*3+2]+=Yr[e*3+2]*n,Xm[e]=Kx[e]*(1+t*(i?1.2:3.2)),qc[e*4+3]=Zx[e]*(1-t)*Math.min(1,t*8)}jr.attributes.position.needsUpdate=jr.attributes.aColor.needsUpdate=jr.attributes.aSize.needsUpdate=!0}var je=null,eo=!1,Is=null,$r=!0,sr,Hc,Gc,Vc,qr,Wc,ef;function mf(){if(!je)try{je=new(window.AudioContext||window.webkitAudioContext),sr=je.createGain(),sr.gain.value=.6,sr.connect(je.destination),qr=je.createBiquadFilter(),qr.type="lowpass",qr.frequency.value=500,Vc=je.createGain(),Vc.gain.value=0,qr.connect(Vc),Vc.connect(sr),Hc=je.createOscillator(),Hc.type="sawtooth",Gc=je.createOscillator(),Gc.type="square";let n=je.createGain();n.gain.value=.5,Hc.connect(qr),Gc.connect(n),n.connect(qr),Hc.start(),Gc.start(),ef=je.createBuffer(1,je.sampleRate*2,je.sampleRate);let e=ef.getChannelData(0);for(let s=0;s<e.length;s++)e[s]=Math.random()*2-1;let t=je.createBufferSource();t.buffer=ef,t.loop=!0;let i=je.createBiquadFilter();i.type="bandpass",i.frequency.value=900,i.Q.value=.4,Wc=je.createGain(),Wc.gain.value=0,t.connect(i),i.connect(Wc),Wc.connect(sr),t.start(),Is=Vp(je,sr),Is.setTheme(Qt),ar()}catch{je=null}}function Xr(n,e,t,i="sine",s=.2){if(!je||eo)return;let r=je.createOscillator(),o=je.createGain(),a=je.currentTime;r.type=i,r.frequency.setValueAtTime(n,a),r.frequency.exponentialRampToValueAtTime(e,a+t),o.gain.setValueAtTime(s,a),o.gain.exponentialRampToValueAtTime(.001,a+t),r.connect(o),o.connect(sr),r.start(a),r.stop(a+t+.02)}var ns={coin(){Xr(1250,1300,.07,"square",.07),setTimeout(()=>Xr(1880,1900,.16,"square",.07),60)},beep(n){Xr(n?980:490,n?980:490,n?.6:.22,"square",.12)},boost(){if(!je||eo)return;let n=je.createBufferSource(),e=je.createBiquadFilter(),t=je.createGain(),i=je.currentTime;n.buffer=ef,e.type="bandpass",e.Q.value=1.2,e.frequency.setValueAtTime(300,i),e.frequency.exponentialRampToValueAtTime(3200,i+.5),t.gain.setValueAtTime(.35,i),t.gain.exponentialRampToValueAtTime(.001,i+.8),n.connect(e),e.connect(t),t.connect(sr),n.start(i),n.stop(i+.85)},win(){[523,659,784,1047].forEach((n,e)=>setTimeout(()=>Xr(n,n,.3,"triangle",.16),e*130))},buy(){[660,880,1320].forEach((n,e)=>setTimeout(()=>Xr(n,n*1.01,.12,"square",.06),e*70))},ping(){Xr(880,1320,.18,"triangle",.14),setTimeout(()=>Xr(1320,1760,.22,"triangle",.12),160)}};function ar(){let n=$r&&!eo;Is&&(Is.setLevel(it==="race"||it==="countdown"||it==="finish"?1:.7),Is.setOn(n));let e=$r?"\u{1F3B5} Music: ON":"\u{1F507} Music: OFF";for(let t of["musicBtn","musicHud"]){let i=xe(t);i&&(i.textContent=t==="musicHud"?n?"\u{1F3B5}":"\u{1F507}":e,i.classList.toggle("off",!n))}}function e0(){c0(),$r=!$r,Vn.set("ccr_music",$r),$r&&(eo=!1),ar()}function EE(){if(Is&&Is.setLevel(it==="race"||it==="countdown"||it==="finish"?1:.7),!je||!Tt.length)return;let n=Tt.reduce((c,l)=>Math.abs(l.car.vf)>Math.abs(c.vf)?l.car:c,Tt[0].car),e=Math.abs(n.vf),t=on(e/(Wh*1.3),0,1),i=Math.min(4,t*5|0),s=t*5-i,r=62+i*16+s*85+(n.boostT>0?30:0),o=je.currentTime;Hc.frequency.setTargetAtTime(r,o,.05),Gc.frequency.setTargetAtTime(r*.5,o,.05),qr.frequency.setTargetAtTime(380+t*1500,o,.08);let a=!eo&&(it==="race"||it==="countdown"||it==="finish")?1:0;Vc.gain.setTargetAtTime(a*(.05+t*.05),o,.1),Wc.gain.setTargetAtTime(a*t*t*.12,o,.15)}var xe=n=>document.getElementById(n),Cs=n=>String(n).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),la=n=>{if(!n)return"\u2014";let e=n/60|0,t=n-e*60;return e+":"+(t<10?"0":"")+t.toFixed(1)},gf=n=>["st","nd","rd"][n-1]||"th",to=n=>"#"+(n>>>0).toString(16).padStart(6,"0"),wE={uniforms:{tDiffuse:{value:null}},vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }",fragmentShader:`uniform sampler2D tDiffuse; varying vec2 vUv;
    void main(){ vec3 c=texture2D(tDiffuse,vUv).rgb; float l=dot(c,vec3(.2126,.7152,.0722));
      float sat=max(c.r,max(c.g,c.b))-min(c.r,min(c.g,c.b));
      c=mix(vec3(l),c,1.28+0.12*(1.-sat)); c=(c-0.5)*1.09+0.5;
      c*=mix(1.,0.82,smoothstep(0.45,0.95,length(vUv-0.5)*1.25));
      gl_FragColor=vec4(clamp(c,0.,1.),1.); }`},t0={high:{label:"High",pr:2,fps:0,menuFps:60,bloom:!0,shadow:2048},balanced:{label:"Balanced",pr:1.5,fps:60,menuFps:30,bloom:!0,shadow:2048},eco:{label:"Eco",pr:1,fps:60,menuFps:30,bloom:!1,shadow:1024}},tf=t0[ca("ccr_quality","balanced")]?ca("ccr_quality","balanced"):"balanced",Kc=()=>t0[tf];function ey(){let n=Kc();an.shadow.mapSize.x!==n.shadow&&(an.shadow.mapSize.set(n.shadow,n.shadow),an.shadow.map&&(an.shadow.map.dispose(),an.shadow.map=null)),Pn.shadowMap.type=n.shadow<2048?Rr:Uo;for(let t of Ri)t.bloom.enabled=n.bloom;let e=xe("qualBtn");e&&(e.textContent="\u2699\uFE0F Graphics: "+n.label),_f()}function AE(){let n=Object.keys(t0);tf=n[(n.indexOf(tf)+1)%n.length],Vn.set("ccr_quality",tf),ey()}var RE=`<div class="tl hud"><div class="panel"><div class="lbl">POSITION</div><div class="posBox"><span class="pos">6</span><small class="suf">th</small><span class="tot">/ 6</span></div></div>
  <div class="panel"><div class="lbl">LAP</div><div class="val"><span class="lap">1</span> / ${Uc}</div></div></div>
  <div class="tr hud"><div class="panel coinsBox"><div class="lbl">COINS</div><div class="val">\u25CF <span class="coins">0</span></div></div><div class="panel"><div class="lbl">TIME</div><div class="val time">0:00.0</div></div></div>
  <div class="bl hud panel"><canvas class="mini" width="336" height="336"></canvas></div>
  <div class="br hud panel"><div><span class="speed">0</span><span class="speedUnit">KM/H</span></div><div class="lbl" style="margin-top:6px">NITRO</div><div class="nitro"><div class="nitroFill"></div></div></div>
  <div class="wrong hud">\u27F2 WRONG WAY</div><div class="ptag hud"></div><div class="center hud"></div>`;function Nx(n,e){let t=new ah(Pn,new Jt(4,4,{type:fn,samples:4})),i=new $o(new Ee(256,256),.25,.6,1.05);i.enabled=Kc().bloom,t.addPass(new ch(jt,e)),t.addPass(i),t.addPass(new lh),t.addPass(new Yo(wE));let s=document.createElement("div");s.className="phud",s.innerHTML=RE,xe("huds").appendChild(s);let r=a=>s.querySelector(a),o=r(".mini");return{i:n,cam:e,composer:t,bloom:i,el:s,car:null,camH:0,snap:!0,shake:0,rect:{x:0,y:0,w:1,h:1},flashT:0,sized:"",hud:{pos:r(".pos"),suf:r(".suf"),lap:r(".lap"),time:r(".time"),coins:r(".coins"),speed:r(".speed"),nitro:r(".nitroFill"),wrong:r(".wrong"),center:r(".center"),tag:r(".ptag"),mctx:o.getContext("2d")}}}var Ri=[Nx(0,mx),Nx(1,new Kt(62,1,.3,7e3))];function Kr(n,e,t,i){n&&(n.hud.center.textContent=e,n.hud.center.className="center hud show"+(i?" small":""),n.flashT=t)}var cf=document.createElement("canvas");cf.width=cf.height=336;var ty=336/640,lf=n=>168+n*ty,uf=n=>168+n*ty;function n0(){let n=cf.getContext("2d");n.clearRect(0,0,336,336),n.lineJoin=n.lineCap="round";let e=()=>{n.beginPath();for(let t=0;t<=Re;t+=4)n.lineTo(lf(ct[t%Re]),uf(lt[t%Re]));n.closePath()};n.strokeStyle="rgba(0,25,70,.6)",n.lineWidth=15,e(),n.stroke(),n.strokeStyle="#fff",n.lineWidth=8,e(),n.stroke(),n.fillStyle="#111",n.save(),n.translate(lf(ct[0]),uf(lt[0])),n.rotate(-Vt[0]),n.fillRect(-10,-2.5,20,5),n.restore()}n0();var Ox=[0,1].map(()=>{let n=new wr(16773590,0,75,.52,.55,1.4);return jt.add(n,n.target),n}),Ym=0;function CE(){Ym=Qr?260:0}function PE(n,e){if(Ox.forEach((r,o)=>{r.intensity=o===n&&e?Ym:0}),!e||!Ym)return;let t=Ox[n],i=Math.sin(e.h),s=Math.cos(e.h);t.position.set(e.x+i*1.9,e.y+1.5,e.z+s*1.9),t.target.position.set(e.x+i*22,e.y-.5,e.z+s*22),t.target.updateMatrixWorld()}function ny(){return Bt.slice().sort((n,e)=>n.finished&&e.finished?n.finishT-e.finishT:n.finished?-1:e.finished?1:e.dist-n.dist)}var i0=()=>en==="split"&&it!=="menu"?2:1;function _f(){let n=innerWidth,e=innerHeight,t=Math.min(devicePixelRatio,Kc().pr),i=i0();Pn.setPixelRatio(t),Pn.setSize(n,e,!1);let s=i===1?[{x:0,y:0,w:n,h:e}]:$c==="tb"?[{x:0,y:0,w:n,h:Math.floor(e/2)},{x:0,y:Math.floor(e/2),w:n,h:e-Math.floor(e/2)}]:[{x:0,y:0,w:Math.floor(n/2),h:e},{x:Math.floor(n/2),y:0,w:n-Math.floor(n/2),h:e}];Ri.forEach((r,o)=>{let a=s[o];if(r.el.style.display=a?"":"none",!a)return;r.rect=a;let c=a.w+"x"+a.h+"@"+t;r.sized!==c&&(r.composer.setPixelRatio(t),r.composer.setSize(a.w,a.h),r.sized=c),r.cam.aspect=a.w/a.h,r.cam.updateProjectionMatrix(),Object.assign(r.el.style,{left:a.x+"px",top:a.y+"px",width:a.w+"px",height:a.h+"px"}),r.el.classList.toggle("compact",i>1&&(a.w<900||a.h<560))}),xe("divider").className=i>1?"on "+$c:""}addEventListener("resize",_f);var Fm=0;function IE(n){for(let t of Ri)t.flashT>0&&(t.flashT-=n,t.flashT<=0&&(t.hud.center.className="center hud"));if(Fm-=n,Fm>0)return;Fm=.05;let e=ny();for(let t=0;t<i0();t++){let i=Ri[t],s=i.car,r=i.hud;if(!s)continue;let o=e.indexOf(s)+1;r.pos.textContent=o,r.suf.textContent=gf(o),r.lap.textContent=on(s.lap+1,1,Uc),r.time.textContent=la(or)==="\u2014"?"0:00.0":la(or),r.speed.textContent=Math.round(Math.abs(s.vf)*3.6),r.nitro.style.width=s.nitro*100+"%",r.coins.textContent=s.coins,r.wrong.style.display=s.wrongT>1.2&&it==="race"?"block":"none";let a=r.mctx;a.clearRect(0,0,336,336),a.drawImage(cf,0,0);for(let c of Bt)c!==s&&(a.beginPath(),a.arc(lf(c.x),uf(c.z),oa(c)?9.5:7,0,6.3),a.fillStyle=to(c.look.paint),a.fill(),a.lineWidth=oa(c)?3:2,a.strokeStyle=oa(c)?"#ffd23a":"#fff",a.stroke());a.beginPath(),a.arc(lf(s.x),uf(s.z),12,0,6.3),a.fillStyle=to(s.look.paint),a.fill(),a.lineWidth=4,a.strokeStyle="#fff",a.stroke()}}var Ge=null;function il(){en="solo",Bt.forEach((n,e)=>{n.ctrl=e===5?"local":"ai",n.bot=e!==5,n.prof=e===5?Ge:null,n.name=e===5?Ge.nick:Yc[e],n.st=e===5?pf(Ge):Qc,n.view=null,no(n,e===5?cr(Ge):Jm(e))}),Tt=[{car:Bt[5],prof:Ge,pi:0}],s0()}function iy(n){il(),en="split";let e=Bt[4];e.ctrl="local",e.bot=!1,e.prof=n,e.name=n.nick,e.st=pf(n),no(e,cr(n)),Tt.push({car:e,prof:n,pi:1}),s0()}function s0(){Ri.forEach((n,e)=>{n.car=Tt[e]?Tt[e].car:null,n.car&&(n.car.view=n),n.snap=!0,n.hud.tag.textContent=Tt[e]?(en==="split"?`P${e+1} \xB7 `:"")+Tt[e].prof.nick:"",n.hud.tag.style.display=en==="split"?"":"none"})}function sl(){c0(),nl(),it="countdown",Vm=3.6,We.tiltOk&&ry(),Wm=9,tl=!1,xe("menu").classList.add("hide"),xe("finish").classList.add("hide"),xe("huds").classList.add("on"),Ri.forEach(n=>{n.snap=!0,n.cam.clearViewOffset()}),_f(),en!=="online"&&dt&&dt.setStatus("racing")}function LE(n){n.auto=!0;let e=Bt.filter(u=>u.finished&&u.finishT<=n.finishT).length,t=n.prof,i=en==="online"?Bt.filter(u=>u!==n&&oa(u)&&!(u.finished&&u.finishT<n.finishT)).length:0,s=_E[e-1]||0,r=i*15,o=n.coins+s+r;n.reward={place:e,collected:n.coins,bonus:s,online:r,total:o},t.coins+=o,t.earned+=o,t.races++,e===1&&t.wins++;let a=t.tb||(t.tb={}),c=a[Qt]||(Qt==="beach"&&t.best?[t.best,t.lap||0]:[0,0]);a[Qt]=[!c[0]||n.finishT<c[0]?n.finishT:c[0],n.bestLap&&(!c[1]||n.bestLap<c[1])?n.bestLap:c[1]],Qt==="beach"&&(t.best=a.beach[0],t.lap=a.beach[1]),t.ts=Date.now(),Zm();let l=el(t);ua([l]),dt&&dt.reportStat(l),Kr(n.view,e===1?"WINNER!":`${e}${gf(e)}!`,2,!1),e===1&&ns.win(),Tt.every(u=>u.car.finished)&&(it="finish",setTimeout(DE,2200))}function DE(){tl=!0,sy();let n=Tt.length===1?Tt[0].car.reward.place:0;xe("finTitle").innerHTML=en==="split"?(()=>{let e=Tt.slice().sort((t,i)=>t.car.reward.place-i.car.reward.place)[0];return`${Cs(e.prof.nick)} <span>WINS!</span>`})():n===1?"YOU <span>WIN!</span>":`${n}${gf(n)} <span>PLACE</span>`,xe("againBtn").style.display=en==="online"?"none":"",xe("menuBtn").textContent=en==="online"?"BACK TO LOBBY":"MENU",xe("finish").classList.remove("hide"),xe("huds").classList.remove("on")}function sy(){let e=ny().map((t,i)=>`<div class="row ${t.ctrl==="local"?"me":""}"><span>${i+1}. <i class="dot" style="background:${to(t.look.paint)}"></i>${Cs(t.name)}${oa(t)&&t.ctrl!=="local"?" <em>racer</em>":""}</span><span>${t.finished?la(t.finishT):t.ctrl==="remote"&&!t.bot?"racing\u2026":"\u2014"}</span></div>`).join("");for(let t of Tt){let i=t.car.reward;i&&(e+=`<div class="earn"><b>${Cs(t.prof.nick)}</b> earned <span class="gold">\u25CF ${i.total}</span><small>${i.collected} collected + ${i.bonus} for ${i.place}${gf(i.place)}${i.online?` + ${i.online} for beating racers`:""} \xB7 best lap ${la(t.car.bestLap)} \xB7 wallet \u25CF ${t.prof.coins}</small></div>`)}xe("results").innerHTML=e}function NE(){let n=en==="online";n&&dt&&dt.closeRoom(),tl=!1,xe("finish").classList.add("hide"),xe("huds").classList.remove("on"),il(),nl(),it="menu",_f(),dt&&dt.setStatus("idle"),Ci(n?"scrOnline":"scrMain")}xe("againBtn").onclick=()=>sl();xe("menuBtn").onclick=NE;var Zc={},Bm={solo:{up:["KeyW","ArrowUp"],down:["KeyS","ArrowDown"],left:["KeyA","ArrowLeft"],right:["KeyD","ArrowRight"],drift:["Space"],nitro:["ShiftLeft","ShiftRight"]},p1:{up:["KeyW"],down:["KeyS"],left:["KeyA"],right:["KeyD"],drift:["Space"],nitro:["ShiftLeft"]},p2:{up:["ArrowUp"],down:["ArrowDown"],left:["ArrowLeft"],right:["ArrowRight"],drift:["Period","Numpad0"],nitro:["Slash","ShiftRight","NumpadEnter"]}},OE=()=>{let n=document.activeElement;return n&&(n.tagName==="INPUT"||n.tagName==="TEXTAREA")};addEventListener("keydown",n=>{OE()||(Zc[n.code]=!0,["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space","Slash"].includes(n.code)&&n.preventDefault(),n.code==="KeyM"&&(eo=!eo,ar()),n.code==="KeyN"&&e0(),it==="race"&&(n.code==="KeyR"&&Tt[0]&&of(Tt[0].car,Tt[0].car.idx,0),n.code==="Backspace"&&Tt[1]&&of(Tt[1].car,Tt[1].car.idx,0)),n.code==="Escape"&&it==="menu"&&Ci("scrMain"))});addEventListener("keyup",n=>{Zc[n.code]=!1});addEventListener("blur",()=>{for(let n in Zc)Zc[n]=!1});var We={l:0,r:0,b:0,n:0,d:0,on:!1,tilt:ca("ccr_tilt",!0),tiltOk:!1,asked:!1,raw:0,zero:0,steer:0,lastEv:0},rr=Math.PI/180;function UE(n){if(n.beta==null||n.gamma==null)return;let e=n.beta*rr,t=n.gamma*rr,i=-Math.sin(t)*Math.cos(e),s=Math.sin(e),r=(((Jn.orientation&&Jn.orientation.angle!=null?Jn.orientation.angle:window.orientation)||0)%360+360)%360,o=r===90?-s:r===270?s:r===180?-i:i;We.raw=Math.asin(on(o,-1,1))/rr,We.lastEv=performance.now(),We.tiltOk||(We.tiltOk=!0,We.zero=We.raw,hf())}function $h(){if(We.asked||We.granted)return;let n=window.DeviceOrientationEvent,e=()=>{We.granted=!0,addEventListener("deviceorientation",UE)};if(n){if(typeof n.requestPermission!="function")return e();We.asked=!0,n.requestPermission().then(t=>{We.asked=!1,t==="granted"?e():(We.tilt=!1,hf(),Bi("Tilt not allowed \u2014 using \u25C0 \u25B6 buttons"))}).catch(()=>{We.asked=!1})}}var ry=()=>{We.zero=We.raw};function hf(){if(!We.on)return;let n=We.tilt&&We.tiltOk;xe("touch").classList.toggle("tilt",n);let e=xe("tiltBtn");e&&(e.textContent=We.tilt?"\u{1F4F1} Tilt steering: ON":"\u{1F4F1} Tilt steering: OFF (buttons)")}if("ontouchstart"in window||navigator.maxTouchPoints>0&&matchMedia("(pointer:coarse)").matches||/[?&]touch=1/.test(location.search)){We.on=!0,document.body.classList.add("touchui");for(let[r,o]of[["tL","l"],["tR","r"]]){let a=xe(r);a.addEventListener("touchstart",l=>{l.preventDefault(),We[o]=1,a.classList.add("on")},{passive:!1});let c=l=>{l.preventDefault(),We[o]=0,a.classList.remove("on")};a.addEventListener("touchend",c),a.addEventListener("touchcancel",c)}let n=xe("dial"),e=(r,o,a,c)=>{let l=(u,h)=>`${(100+Math.cos(u*rr)*h).toFixed(2)} ${(100+Math.sin(u*rr)*h).toFixed(2)}`;return`M${l(r,c)} A${c} ${c} 0 0 1 ${l(o,c)} L${l(o,a)} A${a} ${a} 0 0 0 ${l(r,a)} Z`},t=[["n",-150,-30,"NITRO","\u{1F525}"],["b",-30,90,"BRAKE","\u23EA"],["d",90,210,"DRIFT","\u{1F300}"]];n.innerHTML=`<svg viewBox="0 0 200 200">${t.map(([r,o,a,c,l])=>{let u=(o+a)/2,h=100+Math.cos(u*rr)*64,f=100+Math.sin(u*rr)*64;return`<path class="w w-${r}" d="${e(o+2,a-2,33,97)}"/><text x="${h}" y="${f-6}" class="ic">${l}</text><text x="${h}" y="${f+15}">${r==="b"?"BRAKE/REV":c}</text>`}).join("")}
    <circle cx="100" cy="100" r="29" class="hub"/><text x="100" y="98" class="hubt">AUTO</text><text x="100" y="112" class="hubt">GAS</text></svg>`;let i=r=>{r.preventDefault();let o=n.getBoundingClientRect(),a=o.left+o.width/2,c=o.top+o.height/2,l=o.width/2,u={n:0,b:0,d:0};for(let h of r.targetTouches){let f=h.clientX-a,d=h.clientY-c;if(Math.hypot(f,d)<l*.3)continue;let g=Math.atan2(d,f)/rr;g<-150&&(g+=360),u[g<-30?"n":g<90?"b":"d"]=1}for(let h of["n","b","d"])We[h]=u[h],n.querySelector(".w-"+h).classList.toggle("on",!!u[h])};for(let r of["touchstart","touchmove","touchend","touchcancel"])n.addEventListener(r,i,{passive:!1});xe("wheel").addEventListener("touchstart",r=>{r.preventDefault(),ry(),Bi("Steering centred")},{passive:!1}),document.addEventListener("click",()=>{We.tilt&&$h()},!0),document.addEventListener("touchend",()=>{We.tilt&&$h()},!0),We.tilt&&typeof(window.DeviceOrientationEvent||{}).requestPermission!="function"&&$h();let s=xe("tiltBtn");s&&(s.style.display="",s.onclick=()=>{We.tilt=!We.tilt,Vn.set("ccr_tilt",We.tilt),We.tilt&&$h(),hf()}),hf()}var Ux=0;function FE(){let n=(navigator.getGamepads?[...navigator.getGamepads()]:[]).filter(Boolean);for(let e of Tt){let t=e.inp||(e.inp={throttle:0,steer:0,hand:!1,nitro:!1}),i=en==="split"?e.pi?Bm.p2:Bm.p1:Bm.solo,s=u=>u.some(h=>Zc[h]),r=s(i.down)?-1:s(i.up)?1:0,o=(s(i.left)?1:0)-(s(i.right)?1:0),a=s(i.drift),c=s(i.nitro),l=n[en==="split"?e.pi:0];if(l){let u=f=>l.buttons[f]||{pressed:!1,value:0},h=l.axes[0]||0;Math.abs(h)>.14&&(o=-Math.sign(h)*Math.min(1,(Math.abs(h)-.14)/.8)),u(6).value>.2?r=-1:(u(7).value>.1||u(0).pressed)&&(r=Math.max(r,u(0).pressed?1:u(7).value)),a=a||u(2).pressed||u(5).pressed,c=c||u(1).pressed||u(4).pressed||u(3).pressed}if(en!=="split"&&We.on){if(We.b?r=-1:r===0&&(r=1),We.tilt&&We.tiltOk){let u=We.raw-We.zero;u=Math.abs(u)<1.5?0:u-Math.sign(u)*1.5,We.steer=on(u/20,-1,1),o=We.steer;let h=Math.round(-We.steer*90);h!==Ux&&(Ux=h,xe("wheel").style.transform=`rotate(${h}deg)`)}else(We.l||We.r)&&(o=We.l-We.r);a=a||!!We.d,c=c||!!We.n}it!=="race"&&(r=0,c=!1),t.throttle=r,t.steer=o,t.hand=a,t.nitro=c}}var BE=["scrMain","scrNick","scrSplit","scrOnline","scrGarage","scrBoard"],Jn="scrMain",Ai=null;function Ci(n){Jn=n,BE.forEach(e=>xe(e).classList.toggle("on",e===n)),xe("menu").classList.toggle("garage",n==="scrGarage"),xe("menu").classList.remove("hide"),n==="scrMain"&&GE(),n==="scrGarage"&&cy(),n==="scrBoard"&&Jc(),n==="scrOnline"&&ts(),n==="scrNick"&&(xe("nickIn").value=Ge&&Zr[Ge.nick.toLowerCase()]?Ge.nick:"",setTimeout(()=>xe("nickIn").focus(),50)),n!=="scrGarage"&&Ai&&Ai!==Ge&&(Ai=null),it==="menu"&&Tt[0]&&no(Tt[0].car,cr(n==="scrGarage"&&Ai?Ai:Ge))}function r0(){xe("trackSeg").innerHTML=Bc.map(n=>{let e=As[n];return`<button class="${n===Qt?"on":""}" data-t="${n}"><i>${e.icon}</i><b>${e.name}</b><small>${e.sub}</small></button>`}).join(""),document.querySelectorAll("#todSeg button").forEach(n=>n.classList.toggle("on",n.dataset.n==="1"===Qr))}function o0(n,e){!Bc.includes(n)||n===Qt||(Qt=n,e||Vn.set("ccr_track",n),qh(n),Ch.mudCol.value.set(Yx[n]),Is&&Is.setTheme(n),n0(),nl(),Ri.forEach(t=>t.snap=!0),r0(),Jn==="scrBoard"&&Jc(),Jn==="scrOnline"&&ts())}function a0(n,e){n!==Qr&&(Qr=n,e||Vn.set("ccr_night",n),Dm(n),r0(),Jn==="scrOnline"&&ts())}$r=Vn.get("ccr_music",!0);ar();xe("musicBtn").onclick=e0;xe("qualBtn").onclick=AE;xe("musicHud").onclick=n=>{n.stopPropagation(),e0()};var Rs=null;function kE(){let e=new ArrayBuffer(8864),t=new DataView(e),i=(s,r)=>{for(let o=0;o<r.length;o++)t.setUint8(s+o,r.charCodeAt(o))};return i(0,"RIFF"),t.setUint32(4,36+4410*2,!0),i(8,"WAVEfmt "),t.setUint32(16,16,!0),t.setUint16(20,1,!0),t.setUint16(22,1,!0),t.setUint32(24,44100,!0),t.setUint32(28,88200,!0),t.setUint16(32,2,!0),t.setUint16(34,16,!0),i(36,"data"),t.setUint32(40,4410*2,!0),URL.createObjectURL(new Blob([e],{type:"audio/wav"}))}var zE=["touchend","click","keydown","pointerup"];function c0(){if(mf(),!je)return;try{navigator.audioSession&&(navigator.audioSession.type="playback")}catch{}!navigator.audioSession&&!Rs&&/iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent)&&navigator.maxTouchPoints>0&&(Rs=document.createElement("audio"),Rs.src=kE(),Rs.loop=!0,Rs.setAttribute("playsinline",""),Rs.volume=.01),Rs&&Rs.paused&&Rs.play().catch(()=>{});let n=je.createBufferSource();n.buffer=je.createBuffer(1,1,22050),n.connect(je.destination),n.start(0),je.state!=="running"&&je.resume().then(ar,()=>{}),ar(),je.state==="running"&&xf(!1)}function xf(n){for(let e of zE)(n?addEventListener:removeEventListener)(e,c0,!0)}xf(!0);addEventListener("pointerdown",()=>mf(),{capture:!0,once:!0});document.addEventListener("visibilitychange",()=>{!je||document.hidden||je.state!=="running"&&(je.resume().then(ar,()=>{}),xf(!0))});var HE=setInterval(()=>{je&&(clearInterval(HE),je.addEventListener("statechange",()=>{je.state!=="running"?xf(!0):ar()}))},500);xe("trackSeg").addEventListener("click",n=>{let e=n.target.closest("[data-t]");e&&(mf(),o0(e.dataset.t))});document.querySelectorAll("#todSeg button").forEach(n=>n.onclick=()=>a0(n.dataset.n==="1"));function GE(){r0(),Ge&&(xe("nickLbl").textContent=Ge.nick,xe("walletLbl").textContent=Ge.coins,xe("statsLbl").textContent=`${Ge.wins} wins \xB7 ${Ge.races} races`)}document.querySelectorAll("[data-go]").forEach(n=>n.addEventListener("click",()=>{mf(),Ci(n.dataset.go)}));var yf=/^[A-Za-z0-9_\- ]{2,14}$/;function oy(n){let e=n.trim().replace(/\s+/g," ");return yf.test(e)?(Ge=df(e),Vn.set("ccr_nick",Ge.nick),xe("nickErr").textContent="",il(),ua([el(Ge)]),dt&&dt.start(Ge.nick,jc(Ge).col),!0):(xe("nickErr").textContent="2\u201314 letters, numbers, spaces, - or _",!1)}xe("nickGo").onclick=()=>{oy(xe("nickIn").value)&&Ci("scrMain")};xe("nickIn").addEventListener("keydown",n=>{n.key==="Enter"&&xe("nickGo").click()});xe("bSolo").onclick=()=>{il(),sl()};function ay(){document.querySelectorAll("#layoutSeg button").forEach(n=>n.classList.toggle("on",n.dataset.l===$c)),xe("p1Lbl").textContent=Ge.nick}document.querySelectorAll("#layoutSeg button").forEach(n=>n.onclick=()=>{$c=n.dataset.l,Vn.set("ccr_split",$c),ay()});xe("bSplit").onclick=()=>{ay();let n=Vn.get("ccr_p2","");xe("p2In").value=n,Ci("scrSplit")};xe("p2Garage").onclick=()=>{let n=xe("p2In").value.trim();if(!yf.test(n)||n.toLowerCase()===Ge.nick.toLowerCase()){xe("p2Err").textContent="Enter a different 2\u201314 character nickname first";return}Ai=df(n),Ci("scrGarage")};xe("splitGo").onclick=()=>{let n=xe("p2In").value.trim().replace(/\s+/g," ");if(!yf.test(n)){xe("p2Err").textContent="Player 2 needs a 2\u201314 character nickname";return}if(n.toLowerCase()===Ge.nick.toLowerCase()){xe("p2Err").textContent="Pick a different nickname from Player 1";return}xe("p2Err").textContent="",Vn.set("ccr_p2",n);let e=df(n);ua([el(e)]),iy(e),sl()};xe("bGarage").onclick=()=>{Ai=Ge,Ci("scrGarage")};function cy(){let n=Ai||Ge;xe("garWho").textContent=n.nick,xe("garCoins").textContent=n.coins;let e=s=>n.owned.includes(s);xe("paintGrid").innerHTML=sf.map(s=>`<button class="swatch ${n.eq.paint===s.id?"sel":""}" data-paint="${s.id}" title="${s.name}">
    <i style="background:${s.metal?"linear-gradient(135deg,#f5f8fb,#8d99a6 45%,#e9eef3 60%,#7d8996)":to(s.col)};box-shadow:0 0 0 3px ${to(s.rim)} inset"></i>
    <span>${s.name}</span><b>${e(s.id)?n.eq.paint===s.id?"ON":"OWNED":"\u25CF "+s.price}</b></button>`).join(""),xe("partGrid").innerHTML=Vx.map(s=>{let r=e(s.id),o=!!n.eq[s.id],a=n.coins>=s.price;return`<div class="part ${o?"equipped":""}"><div class="ic">${s.icon}</div><div class="pt"><b>${s.name}</b><small>${s.desc}</small></div>
      ${r?`<button class="mini-btn ${o?"on":""}" data-eq="${s.id}">${o?"EQUIPPED":"EQUIP"}</button>`:`<button class="mini-btn buy" data-buy="${s.id}" ${a?"":"disabled"}>\u25CF ${s.price}</button>`}</div>`}).join("");let t=pf(n),i=s=>`<i style="width:${on(s,0,1)*100}%"></i>`;xe("statBars").innerHTML=[["Top speed",(t.top-.95)/.15],["Acceleration",(t.acc-.95)/.25],["Off-road",(1.1-t.off)/.75],["Nitro",(t.boost-1.25)/.35],["Grip",(t.grip-.9)/.3]].map(([s,r])=>`<div class="sb"><span>${s}</span><div>${i(r)}</div></div>`).join(""),it==="menu"&&no(Tt[0].car,cr(n))}xe("scrGarage").addEventListener("click",n=>{let e=Ai||Ge,t=n.target.closest("button");if(t){if(t.dataset.paint){let i=sf.find(s=>s.id===t.dataset.paint);if(!e.owned.includes(i.id)){if(e.coins<i.price){Bi(`Need \u25CF ${i.price-e.coins} more coins for ${i.name}`);return}e.coins-=i.price,e.owned.push(i.id),ns.buy(),Bi(`${i.name} paint unlocked!`)}e.eq.paint=i.id}else if(t.dataset.buy){let i=Vx.find(s=>s.id===t.dataset.buy);if(e.coins<i.price||e.owned.includes(i.id))return;e.coins-=i.price,e.owned.push(i.id),e.eq[i.id]=!0,ns.buy(),Bi(`${i.icon} ${i.name} installed!`)}else if(t.dataset.eq)e.eq[t.dataset.eq]=!e.eq[t.dataset.eq];else return;e.ts=Date.now(),Zm(),ua([el(e)]),cy(),e===Ge&&dt&&dt.start(Ge.nick,jc(Ge).col)}});xe("garBack").onclick=()=>{let n=Ai&&Ai!==Ge?"scrSplit":"scrMain";Ai=null,Ci(n)};var $m="all";function Jc(){let n=new Set((dt?dt.roster:[]).map(t=>t.nick.toLowerCase())),e=Xx();$m==="online"&&(e=e.filter(t=>n.has(t.nick.toLowerCase()))),document.querySelectorAll("#boardSeg button").forEach(t=>t.classList.toggle("on",t.dataset.f===$m)),xe("boardTrack").textContent=As[Qt].icon+" "+As[Qt].name,xe("boardBody").innerHTML=e.length?e.slice(0,100).map((t,i)=>`<tr class="${Ge&&t.nick.toLowerCase()===Ge.nick.toLowerCase()?"me":""}">
    <td class="rk">${i<3?["\u{1F947}","\u{1F948}","\u{1F949}"][i]:i+1}</td><td><i class="dot" style="background:${to(t.paint)}"></i>${Cs(t.nick)}${n.has(t.nick.toLowerCase())?' <em class="live">online</em>':""}${t.body?" <em>sports</em>":""}</td>
    <td>${t.wins}</td><td>${t.races}</td><td>${la(rf(t,Qt)[0])}</td><td>${la(rf(t,Qt)[1])}</td><td class="gold">\u25CF ${t.earned}</td></tr>`).join(""):'<tr><td colspan="7" class="empty">No racers yet \u2014 finish a race to get on the board.</td></tr>'}document.querySelectorAll("#boardSeg button").forEach(n=>n.onclick=()=>{$m=n.dataset.f,Jc()});var Fx=0;function Bi(n){let e=xe("toast");e.textContent=n,e.classList.add("show"),clearTimeout(Fx),Fx=setTimeout(()=>e.classList.remove("show"),2600)}var Ps=[];function ff(){let n=Ps[0],e=xe("invite");if(!n){e.classList.remove("show");return}xe("invFrom").textContent=n.nick,e.classList.add("show"),ns.ping()}xe("invYes").onclick=()=>{let n=Ps.shift();n&&(Ps=[],ff(),dt.respond(n.id,!0,cr(Ge))?(aa=[n.nick,Ge.nick],Ci("scrOnline"),Bi(`Joined ${n.nick}'s race \u2014 waiting for the start`)):Bi("That challenge expired"))};xe("invNo").onclick=()=>{let n=Ps.shift();n&&dt.respond(n.id,!1),ff()};var nf=[],aa=[],Km={txt:"Offline",lvl:""};function ts(){if(!dt)return;xe("netStatus").textContent=Km.txt,xe("netStatus").className="netst "+(Km.lvl||"");let n=nf.filter(a=>a.id!==dt.id),e=dt.inRoomAsGuest,t=dt.room;xe("onlineCount").textContent=nf.length?`${nf.length} online`:"";let i={idle:"in menus",room:"in a race room",racing:"racing"};xe("rosterList").innerHTML=n.length?n.map(a=>{let c=t&&t.guests.get(a.id),l=e?"":c?`<span class="tagst ${c.state}">${{invited:"invited\u2026",ready:"ready \u2713",declined:"declined",busy:"busy",offline:"offline"}[c.state]}</span>`:`<button class="mini-btn buy" data-ch="${a.id}" ${a.status==="idle"?"":"disabled"}>CHALLENGE</button>`;return`<div class="racer"><i class="dot" style="background:${to(a.paint)}"></i><b>${Cs(a.nick)}</b><small>${i[a.status]||""}</small>${l}</div>`}).join(""):`<div class="empty">${dt.online?"Nobody else is online right now. Send a friend this page's link \u2014 when they open it, they appear here.":"Connecting\u2026"}</div>`;let s="";if(e)s=`<p>You're in <b>${Cs(dt.hostNick||aa[0]||"a")}</b>'s race room.</p><div class="roomlist">${aa.map(a=>`<span>${Cs(a)}</span>`).join("")}</div><p class="hint">Waiting for the host to start\u2026</p><button class="go small alt" id="roomLeave">LEAVE ROOM</button>`;else if(t&&t.guests.size){let a=[...t.guests.values()].filter(c=>c.state==="ready").length;s=`<p>Your race room \u2014 challenge more racers, then start. Empty grid slots are filled with bots.</p><div class="roomlist"><span>${Cs(Ge.nick)} (host)</span>${[...t.guests.values()].map(c=>`<span class="${c.state}">${Cs(c.nick)} \xB7 ${c.state}</span>`).join("")}</div>
      <button class="go" id="roomStart" ${a?"":"disabled"}>START RACE (${a+1} racers)</button><button class="go small alt" id="roomLeave">CANCEL ROOM</button>`}else s='<p class="hint">Hit <b>CHALLENGE</b> next to a racer. Challenge several to race up to 6 together.</p>';e||(s+=`<p class="hint">You host on <b>${As[Qt].icon} ${As[Qt].name}</b> \xB7 ${Qr?"\u{1F319} night":"\u2600\uFE0F day"} \u2014 change both on the main menu.</p>`),xe("roomBox").innerHTML=s;let r=xe("roomStart");r&&(r.onclick=VE);let o=xe("roomLeave");o&&(o.onclick=()=>{dt.closeRoom(),aa=[],ts()})}xe("rosterList").addEventListener("click",n=>{let e=n.target.closest("[data-ch]");!e||!dt||(dt.challenge(e.dataset.ch,cr(Ge)),Bi("Challenge sent!"),ts())});xe("bOnline").onclick=()=>{dt&&dt.start(Ge.nick,jc(Ge).col),Ci("scrOnline")};function VE(){let n=dt.readyGuests().slice(0,5);if(!n.length)return;let e=[{id:dt.id,nick:Ge.nick,look:cr(Ge)},...n.map(i=>({id:i.id,nick:i.nick,look:i.look}))],t=[];e.forEach((i,s)=>{t[5-s]={id:i.id,nick:i.nick,look:ly(i.look)}});for(let i=0;i<6;i++)t[i]||(t[i]={ai:1,nick:Yc[i],look:Jm(i)});dt.startRoom({t:"start",slots:t,track:Qt,night:Qr}),uy(t,!0)}function ly(n){return n=n||{},{paint:+n.paint|0,rim:+n.rim|0,metal:!!n.metal,body:n.body==="sports"?"sports":"classic",tyres:n.tyres==="big"?"big":"std",rocket:!!n.rocket,glow:+n.glow|0}}function uy(n,e){!Array.isArray(n)||n.length!==6||(en="online",af=e,Tt=[],Bt.forEach((t,i)=>{let s=n[i]||{ai:1,nick:Yc[i],look:Jm(i)};t.name=String(s.nick||Yc[i]).slice(0,14),t.bot=!!s.ai,t.peer=s.id||null,t.view=null,t.prof=null,t.ctrl=s.id&&s.id===dt.id?"local":s.ai&&e?"ai":"remote",t.st=t.ctrl==="local"?pf(Ge):Qc,no(t,t.ctrl==="local"?cr(Ge):ly(s.look)),t.ctrl==="local"&&(t.prof=Ge,Tt.push({car:t,prof:Ge,pi:0}))}),Tt.length&&(s0(),sl()))}var km=0;function WE(n){en!=="online"||it==="menu"||!dt||(km-=n,!(km>0)&&(km=.05,af?dt.broadcast({t:"S",l:Bt.map(Lx)}):dt.toHost({t:"s",d:Lx(Tt[0].car)})))}function Bx(n,e){if(n.ctrl!=="remote")return;let t=n.net;t&&(n.x=t.x,n.z=t.z,n.y=t.y,n.h=t.h),n.ctrl="ai",n.st=Qc,n.vf=Math.hypot(n.vx,n.vz),n.bot||(n.name+=" \u{1F916}"),n.bot=!0,e&&Bi(e)}var dt=null;try{dt=X_({status:(n,e)=>{Km={txt:n,lvl:e},Jn==="scrOnline"&&ts(),xe("netDot").className="netdot "+(e||""),xe("netDot").title=n},getBoard:()=>Xx().slice(0,100),mergeBoard:n=>ua(n),boardChanged:()=>{Jn==="scrBoard"&&it==="menu"&&Jc()},roster:n=>{nf=n,xe("onlineLbl").textContent=n.length>1?`${n.length-1} online`:"",it==="menu"&&(Jn==="scrOnline"&&ts(),Jn==="scrBoard"&&Jc())},room:()=>{Jn==="scrOnline"&&it==="menu"&&ts()},canAccept:()=>it==="menu"&&!!Ge,invite:n=>{it==="menu"&&(Ps=Ps.filter(e=>e.id!==n.id),Ps.push(n),ff())},inviteGone:n=>{Ps=Ps.filter(e=>e.id!==n),ff()},roomList:n=>{aa=(n||[]).map(String),Jn==="scrOnline"&&ts()},start:n=>{o0(n.track,!0),a0(!!n.night,!0),uy(n.slots,!1)},hostStates:n=>{if(en==="online"&&Array.isArray(n))for(let e of n)Dx(e)},guestState:(n,e)=>{if(en==="online"&&af&&Array.isArray(e)){let t=Bt[e[0]];t&&t.peer===n&&Dx(e)}},guestLeft:n=>{if(en==="online"&&af){let e=Bt.find(t=>t.peer===n);e&&!e.finished&&Bx(e,`${e.name} left \u2014 a bot takes over`)}},hostLeft:()=>{en==="online"&&it!=="menu"?(Bt.forEach(n=>{n.ctrl==="remote"&&!n.finished&&Bx(n)}),Bi("Host disconnected \u2014 bots take over")):it==="menu"&&(Bi("The race room was closed"),aa=[],Jn==="scrOnline"&&ts())}})}catch{dt=null}var Kh=0,kx=performance.now(),ra=0,Zn=new N,Zh=new N,zm=new N,Hm=new N,Jh=new N,zx=new Xe,Hx=new Rn;function XE(n,e){let i=Math.max(wt(n.x+1.2,n.z),-.55)-Math.max(wt(n.x-1.2,n.z),-.55),s=Math.max(wt(n.x,n.z+1.2),-.55)-Math.max(wt(n.x,n.z-1.2),-.55);n.grounded?zm.set(-i/(2*1.2),1,-s/(2*1.2)).normalize():zm.set(-Math.sin(n.h)*on(n.vy*.012,-.3,.3),1,-Math.cos(n.h)*on(n.vy*.012,-.3,.3)).normalize(),n.up.lerp(zm,Math.min(1,e*(n.grounded?10:3))).normalize(),Jh.set(Math.sin(n.h),0,Math.cos(n.h)),Hm.crossVectors(n.up,Jh).normalize(),Jh.crossVectors(Hm,n.up).normalize(),zx.makeBasis(Hm,n.up,Jh),Hx.setFromRotationMatrix(zx);let r=n.model.G;r.position.set(n.x,n.y,n.z),r.quaternion.copy(Hx),n.model.body.rotation.z=Kn(n.model.body.rotation.z,on(-n.vl*.018+n.steer*Math.abs(n.vf)*.0022,-.16,.16),Math.min(1,e*8)),n.model.body.position.y=Math.sin(ra*31+n.k)*.012*Math.min(1,Math.abs(n.vf)/10),n.spin+=n.vf/n.model.wr*e;for(let a of n.model.wheels)a.spin.rotation.x=n.spin,a.front&&(a.pivot.rotation.y=n.steer*.42);let o=n.boostT>0;for(let a of n.model.flames)a.visible=o,o&&a.scale.set(1+Math.random()*.5,1+Math.random()*.5,.8+Math.random()*.8);n.model.flames.glow&&(n.model.flames.glow.material.opacity=.7+Math.sin(ra*6+n.k)*.15)}function qE(n,e){let t=n.car,i=n.cam;if(t){if(it==="menu"||it==="finish"&&tl){let s=it==="menu"&&Jn==="scrGarage",r=s?8.2:9.5;Kh+=e*(s?.35:.22),Zn.set(t.x+Math.sin(Kh)*r,t.y+(s?2.2:2.6)+Math.sin(Kh*.7)*.8,t.z+Math.cos(Kh)*r),Zn.y=Math.max(Zn.y,wt(Zn.x,Zn.z)+1.2,.9),i.position.lerp(Zn,n.snap?1:Math.min(1,e*3)),Zh.set(t.x,t.y+1.1,t.z),i.lookAt(Zh),i.fov=Kn(i.fov,50,Math.min(1,e*3)),n.snap=!1,n.camH=t.h;let o=n.rect.w,a=n.rect.h;s?o>760?i.setViewOffset(o,a,Math.min(260,o*.2),0,o,a):i.setViewOffset(o,a,0,a*.24,o,a):i.view&&i.view.enabled&&i.clearViewOffset()}else{let s=on(Math.abs(t.vf)/Wh,0,1.4),r=t.boostT>0?1:0,o=Math.hypot(t.vx,t.vz)>6?Kn(0,ir(Math.atan2(t.vx,t.vz)-t.h),.45)+t.h:t.h;n.camH+=ir(o-n.camH)*Math.min(1,e*5.5),n.snap&&(n.camH=t.h);let a=8.2+s*1.6-r*.6,c=3.3+s*.3;if(Zn.set(t.x-Math.sin(n.camH)*a,t.y+c,t.z-Math.cos(n.camH)*a),Zn.y=Math.max(Zn.y,wt(Zn.x,Zn.z)+1.4,1),n.snap?(i.position.copy(Zn),n.snap=!1):(i.position.x=Zn.x,i.position.z=Zn.z,i.position.y=Kn(i.position.y,Zn.y,Math.min(1,e*7))),n.shake>0||r){let h=n.shake*.5+r*.05;i.position.x+=(Math.random()-.5)*h,i.position.y+=(Math.random()-.5)*h,n.shake=Math.max(0,n.shake-e*1.5)}Zh.set(t.x+Math.sin(t.h)*5,t.y+1.5,t.z+Math.cos(t.h)*5),i.lookAt(Zh),i.fov=Kn(i.fov,60+s*13+r*9,Math.min(1,e*4));let l=n.rect.w,u=n.rect.h;We.on?i.setViewOffset(l,u,0,u*(u>l?.13:.16),l,u):i.view&&i.view.enabled&&i.clearViewOffset()}i.updateProjectionMatrix()}}var Gx=0;function hy(n){requestAnimationFrame(hy);let e=it==="menu"?Kc().menuFps:Kc().fps;if(e&&n-Gx<1e3/e-2)return;Gx=n;let t=Math.min(.05,(n-kx)/1e3);if(kx=n,ra+=t,FE(),it==="countdown"){Vm-=t;let o=Math.ceil(Vm-.6);o!==Wm&&(Wm=o,o>0?(Ri.forEach(a=>Kr(a,String(o),.8)),ns.beep(!1)):(Ri.forEach(a=>Kr(a,"GO!",.9)),ns.beep(!0),it="race"))}if(it==="race"&&(or+=t),it!=="menu"){let a=t/2,c=-1e9;for(let l of Bt)oa(l)&&(c=Math.max(c,l.dist));for(let l=0;l<2;l++){for(let u of Bt){if(u.ctrl==="remote"){l===0&&bE(u,t);continue}if(u.ctrl==="ai"||u.auto)ME(u,a,kc),u.finished&&(kc.throttle=Math.hypot(u.vx,u.vz)>22?0:kc.throttle),u.skill=u.ctrl==="local"?1:u.base*(1+on((c-u.dist)*ws/500,-.1,.1)),Px(u,kc,a);else{u.skill=1;let h=Tt.find(f=>f.car===u);Px(u,h&&h.inp||kc,a)}}for(let u=0;u<Bt.length;u++)for(let h=u+1;h<Bt.length;h++){let f=Bt[u],d=Bt[h],g=d.x-f.x,_=d.z-f.z,p=Math.hypot(g,_);if(p<2.7&&p>.001&&Math.abs(f.y-d.y)<1.6){let m=g/p,y=_/p,v=f.ctrl==="remote",S=d.ctrl==="remote";if(v&&S)continue;let E=v?0:S?1:.5,M=1-E,x=2.7-p;f.x-=m*x*E,f.z-=y*x*E,d.x+=m*x*M,d.z+=y*x*M;let b=(d.vx-f.vx)*m+(d.vz-f.vz)*y;if(b<0){let R=-b*.65*2;f.vx-=m*R*E,f.vz-=y*R*E,d.vx+=m*R*M,d.vz+=y*R*M}}}}for(let l of Tt){let u=l.car,h=u.idx,f=u.vx*Math.sin(Vt[h])+u.vz*Math.cos(Vt[h]);u.wrongT=f<-4&&!u.sc?u.wrongT+t:0}for(let l of nr){if(l.t>0){l.t-=t;continue}for(let u of Tt){let h=u.car;if(h.finished)continue;let f=l.x-h.x,d=l.z-h.z,g=5.3*h.st.magnet*h.st.magnet;if(f*f+d*d<g&&Math.abs(l.y-h.y-1)<2.5+(h.st.magnet-1)*2){l.t=14,h.coins++,h.nitro=Math.min(1,h.nitro+.07),ns.coin();for(let _=0;_<8;_++)qm(l.x,l.y,l.z,(Math.random()-.5)*7,2+Math.random()*5,(Math.random()-.5)*7,.5,.35,1,.85,.2,.9);break}}}for(let l of Bt){let u=Math.abs(l.vf)+Math.abs(l.vl)*2;if(l.grounded&&u>7)for(l.emit+=t*(l.view?60:28)*Math.min(1,u/30)*(l.gPrev<-.08?1.6:1);l.emit>1;)l.emit--,Qx(l)}WE(t),tl&&(Om-=t,Om<=0&&(Om=.5,sy()))}for(let o of Bt)XE(o,t);nr.forEach((o,a)=>{Ti.position.set(o.x,o.y+Math.sin(ra*3+o.ph)*.15,o.z),Ti.rotation.set(0,ra*3.2+o.ph,0),Ti.scale.setScalar(o.t>0?1e-4:1),Ti.updateMatrix(),Wr.setMatrixAt(a,Ti.matrix)}),Wr.instanceMatrix.needsUpdate=!0,TE(t),Tx(t,ra),CE(),IE(t),EE();let i=i0(),s=innerHeight,r=Pn.getPixelRatio();Pn.setScissorTest(i>1);for(let o=0;o<i;o++){let a=Ri[o],c=a.rect,l=a.car||Bt[5];qE(a,t);let u=s-c.y-c.h;Pn.setViewport(c.x,u,c.w,c.h),Pn.setScissor(c.x,u,c.w,c.h),jx.uniforms.uScale.value=c.h*r*.9,sa.position.copy(a.cam.position),an.target.position.set(Math.round(l.x/4)*4,l.y,Math.round(l.z/4)*4),an.position.copy(an.target.position).addScaledVector(Xh,190),bx(a.cam,c.h*r*.9),PE(o,a.car),a.composer.render(t)}}{let n=Vn.get("ccr_nick",""),e=+(()=>{try{return localStorage.getItem("ccr_best")}catch{return 0}})()||0;n&&yf.test(n)?(oy(n),Ci("scrMain")):(Ge=Wx("Racer"),e&&!Ge.best&&(Ge.best=e),il(),Ci("scrNick")),nl(),ey()}window.__game={SCDBG:Es,get SC(){return ft},get N(){return Re},get SP(){return ws},get track(){return Qt},setTrack:o0,setTimeOfDay:a0,placeCar:of,cars:Bt,views:Ri,get locals(){return Tt},get state(){return it},get mode(){return en},get raceT(){return or},startRace:sl,setupSplit:iy,getProfile:df,get me(){return Ge},net:dt,renderer:Pn,profiles:Zr,board:Xc,ASSETS:bt,setLook:no,createMusic:Vp,get AC(){return je}};requestAnimationFrame(hy);/[?&]noassets=1/.test(location.search)||sx().then(()=>{qh(Qt),n0(),Ri.forEach(n=>n.snap=!0),it==="menu"&&nl();for(let n of Bt)n.model&&n.look&&(n.lookKey="",no(n,n.look))}).catch(n=>console.warn("Blender assets unavailable, using built-in models",n));})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
