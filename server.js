const http = require('http');
const path = require('path');
const fs = require('fs');
const ROOT = __dirname;
const PUBLIC = path.join(ROOT, 'public');
const DATA_FILE = path.join(ROOT, 'data', 'messages.json');
const PORT = process.env.PORT || 3000;
const projects = [
  { id:'nxt-drive', number:'01', category:'WEB DEVELOPMENT', type:'WEB', title:'nxt.drive', description:'A car discovery portal concept to explore models, compare specifications, watch reviews, estimate EMIs, and eventually add AI-assisted recommendations.', tags:['HTML','CSS','JavaScript'], accent:'car', status:'Concept / in progress', link:'' },
  { id:'line-follower', number:'02', category:'HARDWARE & ROBOTICS', type:'ROBOTICS', title:'Arduino Line Follower', description:'A robot-car experiment using IR sensors and a motor driver to detect a dark track and adjust its movement to follow the line.', tags:['Arduino','C/C++','IR sensors'], accent:'robot', status:'Learning / prototype', link:'' },
  { id:'isl-translation', number:'03', category:'AI & ACCESSIBILITY', type:'AI', title:'ISL Translation Concept', description:'An exploration of translating Indian Sign Language gestures into text and voice to make everyday communication more accessible.', tags:['Python','Computer vision','ISL'], accent:'sign', status:'Research / concept', link:'' }
];
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml' };
function send(res, code, data, type='application/json; charset=utf-8') { res.writeHead(code, {'Content-Type':type,'X-Content-Type-Options':'nosniff'}); res.end(type.startsWith('application/json') ? JSON.stringify(data) : data); }
function readBody(req) { return new Promise((resolve,reject)=>{ let body=''; req.on('data',chunk=>{body+=chunk; if(body.length>20000) reject(new Error('Request too large'));}); req.on('end',()=>{try{resolve(JSON.parse(body||'{}'));}catch{reject(new Error('Invalid JSON'));}}); req.on('error',reject); }); }
const server = http.createServer(async (req,res)=>{
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (req.method==='GET' && url.pathname==='/api/health') return send(res,200,{ok:true,service:'Chirag Portfolio API'});
  if (req.method==='GET' && url.pathname==='/api/projects') return send(res,200,{projects});
  if (req.method==='POST' && url.pathname==='/api/contact') {
    try {
      const body=await readBody(req); const {name,email,message,website}=body;
      if (website) return send(res,200,{ok:true,message:'Message received.'});
      if (![name,email,message].every(v=>typeof v==='string')) return send(res,400,{ok:false,message:'Please complete all fields.'});
      const clean={name:name.trim().slice(0,80),email:email.trim().slice(0,160),message:message.trim().slice(0,3000),createdAt:new Date().toISOString()};
      if(!clean.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email) || clean.message.length<10) return send(res,400,{ok:false,message:'Enter a valid name, email, and message (at least 10 characters).'});
      const messages=JSON.parse(fs.readFileSync(DATA_FILE,'utf8')); messages.push(clean); fs.writeFileSync(DATA_FILE,JSON.stringify(messages,null,2));
      return send(res,201,{ok:true,message:'Thanks! Your message has been saved.'});
    } catch(err) { return send(res,err.message==='Invalid JSON'?400:500,{ok:false,message:err.message==='Invalid JSON'?'Please send valid form data.':'Something went wrong. Please try again later.'}); }
  }
  if(req.method==='GET') {
    const pathname=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);
    const file=path.resolve(PUBLIC,'.'+pathname);
    if(!file.startsWith(PUBLIC+path.sep) && file!==path.join(PUBLIC,'index.html')) return send(res,403,{error:'Forbidden'});
    fs.readFile(file,(err,content)=>{if(err)return send(res,404,{error:'Not found'});send(res,200,content,mime[path.extname(file)]||'application/octet-stream');});
    return;
  }
  send(res,404,{error:'Not found'});
});
server.listen(PORT,()=>console.log(`Portfolio running at http://localhost:${PORT}`));
