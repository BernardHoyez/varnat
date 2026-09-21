const CACHE_NAME = 'brise-cache-varnat-v1';
const PRECACHE_ASSETS = [
 './','./index.html','./flore.html','./faune.html','./fiche.html','./famille-vegetales.html','./generateur.html',
 './style.css','./manifest.json','./data/flore.json','./data/faune.json','./data/commentaires.json','./photos/_index.json',
 './icons/icon-192.png','./icons/icon-512.png'
];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(PRECACHE_ASSETS).catch(()=>{})));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>clients.claim()));});
self.addEventListener('fetch',e=>{
 const r=e.request; if(r.method!=='GET') return;
 const u=new URL(r.url);
 if(u.origin!==location.origin) return;
 if(r.mode==='navigate' || /\.(html|css|js|json)$/.test(u.pathname)){
   e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE_NAME).then(x=>x.put(r,c));return res;}).catch(()=>caches.match(r).then(x=>x||caches.match('./index.html'))));
 } else {
   e.respondWith(caches.match(r).then(c=>c||fetch(r).then(res=>{const cl=res.clone();caches.open(CACHE_NAME).then(x=>x.put(r,cl));return res;})));
 }
});