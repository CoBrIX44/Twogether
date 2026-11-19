const puppeteer=require('puppeteer-core');
(async()=>{const [,,mode,a,b,out]=process.argv;
const br=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--allow-file-access-from-files','--font-render-hinting=none']});
const pg=await br.newPage();await pg.setViewport({width:1920,height:1080});
await pg.goto('file://'+process.cwd()+'/video.html');await pg.evaluate(()=>window.ready);
if(mode==='stills'){for(const t of a.split(',')){await pg.evaluate(t=>seek(t),+t);await pg.screenshot({path:`${out}/still_${t}.png`})}}
else{for(let f=+a;f<+b;f++){await pg.evaluate(t=>seek(t),f/30);await pg.screenshot({path:`${out}/f${String(f).padStart(4,'0')}.png`})}}
await br.close()})();
