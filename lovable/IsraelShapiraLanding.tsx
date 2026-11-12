// @ts-nocheck
import { useEffect } from "react";
import Lenis from "lenis";
import "@/styles/israel-shapira.css";

/*
  Israel Shapira one-pager (Lovable / React).
  Ported 1:1 from the approved HTML preview (onepager/index.html): same markup, same CSS, same scroll engine.
  Setup:
  - npm i lenis
  - public/fonts/*.woff2 (almoni + almoni-tzar, licensed, from the web-design skill font library)
  - public/assets/img/* and public/assets/video/* (Magnific licensed photos + client reels)
  - index.html: <html lang="he" dir="rtl">
  TODO: replace 972000000000 / 050-000-0000 with Israel's phone; connect the form to Supabase or email.
*/

export default function IsraelShapiraLanding() {
  useEffect(() => {
    const cleanups = [];
    let alive = true;
    const addEventListener = (ev, fn, o) => { window.addEventListener(ev, fn, o); cleanups.push(() => window.removeEventListener(ev, fn, o)); };
    const requestAnimationFrame = (cb) => (alive ? window.requestAnimationFrame(cb) : 0);
    window.Lenis = Lenis;
    /* ---- scroll engine (verbatim from the preview) ---- */

const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const clamp = (v,a=0,b=1) => Math.min(b,Math.max(a,v));
const ease = t => t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
const isDesk = () => innerWidth > 900;

/* header + drawer */
const header = $('#header');
const setMenu = o => { document.body.classList.toggle('open',o); $('#menu').setAttribute('aria-expanded',o); };
$('#menu').onclick = () => setMenu(!document.body.classList.contains('open'));
$('#drawerClose').onclick = () => setMenu(false);
$$('#drawer a').forEach(a => a.addEventListener('click',()=>setMenu(false)));
addEventListener('keydown',e=>{ if(e.key==='Escape'){ setMenu(false); closeDD(); }});

/* Lenis smooth scroll */
let lenis = null;
if (window.Lenis && !RM){ lenis = new Lenis({lerp:.1}); (function raf(t){ lenis.raf(t); requestAnimationFrame(raf); })(performance.now()); }
window.siteLenis = lenis;
const headerH = () => header.offsetHeight;
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href'); if (id.length<2) return;
  const t = $(id); if(!t) return; e.preventDefault();
  if (lenis) lenis.scrollTo(t,{offset:id==='#top'?0:-headerH()+1,duration:1.4}); else t.scrollIntoView({behavior:RM?'auto':'smooth'});
}));
new MutationObserver(()=>{ if(lenis) document.body.classList.contains('open') ? lenis.stop() : lenis.start(); }).observe(document.body,{attributes:true,attributeFilter:['class']});

/* reveal */
const io = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }),{threshold:.12,rootMargin:'0px 0px -40px 0px'});
$$('.rv').forEach(el=>io.observe(el));

/* pinned helpers */
const prog = el => { const r = el.getBoundingClientRect(); return clamp(-r.top / (r.height - innerHeight)); };
const smooth = (p,n) => { const pos = p*(n-1), i = Math.floor(pos), f = pos - i; return Math.min(n-1, i + (1-Math.cos(Math.PI*clamp((f-.12)/.76)))/2); };
const stepped = (p,n) => { const pos = p*(n-1), i = Math.floor(pos), f = pos - i; return Math.min(n-1, i + ease(clamp((f-.3)/.4))); };

const heroInner = $('#heroInner'), heroBg = $('#heroBg');
const tcards = $$('.tcard'), tiul = $('#tiul');
const regWrap = $('[data-pin="regions"]'), regSlides = $$('.reg__slide'), regT = $$('.reg__t'), regNames = $$('#regNames span');
const svcWrap = $('[data-pin="services"]'), svcStage = $('#svcStage');
const layers = $$('.svc__layer'), labels = $$('.svc__label'), items = $$('.svc__item'), slot = $('#svcSlot');
const procWrap = $('[data-pin="process"]'), stepsEl = $$('.step'), procImgs = $$('.proc__visual img');
const fieldWrap = $('#fieldWrap'), track = $('#fieldTrack');
const disc = $('#disc'), discWord = $('#discWord'), discFg = $('#discFg'), discBg = $('.disc__bg');

const sizeField = () => {
  if (!isDesk()){ fieldWrap.style.height = ''; return; }
  fieldWrap.style.height = (track.scrollWidth - innerWidth + innerHeight) + 'px';
};


let lastProc = -1, regCur = 0, svcCur = 0;
function frame(){
  const vh = innerHeight, y = scrollY;
  if (!RM){
    /* hero: title rises out of frame, image drifts and scales */
    const hp = clamp(y / vh);
    heroInner.style.transform = `translate3d(0,${-hp*32}vh,0)`;
    heroInner.style.opacity = 1 - hp*1.5;
    heroBg.style.transform = `translate3d(0,${hp*18}%,0) scale(${1+hp*.06})`;
    /* tiul: staggered parallax */
    const tr = tiul.getBoundingClientRect(); const tp = (vh - tr.top) / (vh + tr.height);
    tcards.forEach(c => c.style.transform = `translate3d(0,${(tp-.5)*parseFloat(c.dataset.speed)*vh}px,0)`);
    /* network: word sinks behind the hiker, layers drift at different speeds */
    const dr = disc.getBoundingClientRect(); const dp = clamp((vh - dr.top) / (vh + dr.height));
    discWord.style.transform = `translate3d(0,${(dp-.5)*30}vh,0) scale(${1.14 - dp*.22})`;
    discBg.style.transform = `translate3d(0,${(dp-.5)*-6}%,0) scale(1.08)`;
    discFg.style.transform = `translate3d(0,${(dp-.5)*-6}%,0) scale(1.08)`;
  }

  if (isDesk()){
    /* regions: blur crossfade, title grows and flies out */
    const n = regSlides.length; regCur += (stepped(prog(regWrap), n) - regCur) * .09; const pos = regCur;
    regSlides.forEach((s,i)=>{
      const a = Math.abs(pos - i);
      s.style.opacity = clamp(1 - a);
      s.style.filter = a < .01 ? 'none' : `blur(${Math.min(a,1)*22}px)`;
      s.style.transform = `scale(${1 + Math.min(a,1)*.08})`;
    });
    regT.forEach((t,i)=>{
      const d = pos - i;
      if (d >= 0){
        t.style.opacity = clamp(1 - d*1.6);
        t.style.transform = `translate3d(${d*-28}vw,-50%,0) scale(${1 + d*1.6})`;
        t.style.filter = d < .01 ? 'none' : `blur(${clamp(d*2)*8}px)`;
      } else {
        t.style.opacity = clamp(1 + d*1.8);
        t.style.transform = `translate3d(0,calc(-50% + ${-d*70}px),0)`;
        t.style.filter = `blur(${clamp(-d*2)*10}px)`;
      }
    });
    const ri = Math.round(pos);
    $('#regNum').textContent = String(ri+1).padStart(2,'0');
    $('#regBar').style.transform = `scaleX(${pos/(n-1)})`;
    regNames.forEach((s,i)=>s.classList.toggle('on',i===ri));

    /* services: the next card expands into the background, the row slides along */
    const W = svcStage.clientWidth, H = svcStage.clientHeight;
    const sr = slot.getBoundingClientRect(), st = svcStage.getBoundingClientRect();
    const sx = sr.left - st.left, sy = sr.top - st.top, cw = sr.width, chh = sr.height, gap = 16;
    const m = layers.length; svcCur += (smooth(prog(svcWrap), m) - svcCur) * .08; const sp = svcCur;
    layers.forEach((L,k)=>{
      L.style.zIndex = k;
      const e = sp - (k-1);
      let x = sx, t = 0, vis = 1;
      if (k===0 || e>=1) t = 1;
      else if (e>0) t = ease(e);
      else { x = sx - (-e)*(cw+gap); if (x + cw < -40) vis = 0; }
      const L0 = x, T0 = sy, R0 = W - (x+cw), B0 = H - (sy+chh);
      L.style.clipPath = `inset(${T0*(1-t)}px ${R0*(1-t)}px ${B0*(1-t)}px ${L0*(1-t)}px round ${18*(1-t)}px)`;
      L.style.opacity = vis;
      L.classList.toggle('card', t<.5);
      const lab = labels[k];
      if (k===0){ lab.style.opacity = 0; }
      else {
        lab.style.opacity = vis * clamp(1 - Math.max(0,e)*3);
        lab.style.transform = `translate3d(${x}px,${sy + chh - 74}px,0)`;
        lab.style.width = cw + 'px';
      }
    });
    items.forEach((it,i)=>{
      const d = sp - i;
      it.style.opacity = clamp(1 - Math.abs(d)*1.7);
      it.style.transform = `translate3d(0,calc(-50% + ${d*-36}px),0)`;
      it.style.pointerEvents = Math.abs(d) < .3 ? 'auto' : 'none';
    });

    /* process: trail fills, steps activate, visual changes */
    const pp = prog(procWrap), ps = Math.min(3, Math.floor(pp*4));
    $('#stepFill').style.transform = `scaleY(${pp})`;
    if (ps !== lastProc){ lastProc = ps;
      stepsEl.forEach((s,i)=>s.classList.toggle('on', i<=ps));
      procImgs.forEach((im,i)=>im.classList.toggle('on', i===ps));
    }

    /* field: horizontal travel (RTL: track moves right) */
    const fp = prog(fieldWrap), extra = track.scrollWidth - innerWidth;
    track.style.transform = `translate3d(${fp*extra}px,0,0)`;
  } else {
    const r = procWrap.getBoundingClientRect(); const pp = clamp((vh*.7 - r.top) / r.height);
    $('#stepFill').style.transform = `scaleY(${pp})`;
    stepsEl.forEach((s,i)=>s.classList.toggle('on', pp >= i/4));
  }

  requestAnimationFrame(frame);
}

/* tiul captions: fill the full width of each image */
const fitCaps = () => $$('.tcard figcaption').forEach(c => { c.style.fontSize = '100px'; const w = c.clientWidth; c.style.fontSize = (100 * w / Math.max(1, c.scrollWidth)) + 'px'; });
fitCaps(); addEventListener('resize', fitCaps); if (document.fonts) document.fonts.ready.then(fitCaps);

/* buttons: a little compass that spins on hover */
$$('.btn').forEach(b => b.insertAdjacentHTML('afterbegin', '<svg class="cmp" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><g><path class="n1" d="M12 3.5l2.6 8.5h-5.2z"/><path class="n2" d="M12 20.5l2.6-8.5h-5.2z"/></g></svg>'));
sizeField(); addEventListener('resize', sizeField); addEventListener('load', sizeField);
requestAnimationFrame(frame);


/* ---- Waze-style route (custom scrollbar) ---- */
const route = $('#route'), rBase = $('#rBase'), rDone = $('#rDone'), rCar = $('#rCar');
const rLen = rBase.getTotalLength();
let rLast = -1, rTimer = 0, rDrag = false;
const foot = $('footer');
const maxY = () => Math.max(1, foot.getBoundingClientRect().top + scrollY - innerHeight * .55);
function routeTick(){
  if (!route.offsetWidth){ requestAnimationFrame(routeTick); return; }
  const p = clamp(scrollY / Math.max(1, maxY()));
  if (Math.abs(p - rLast) > .0004){
    if (rLast >= 0){ route.classList.add('moving'); clearTimeout(rTimer); rTimer = setTimeout(()=>route.classList.remove('moving'), 1100); }
    rLast = p;
    const W = route.clientWidth, H = route.clientHeight, pt = rBase.getPointAtLength(p * rLen);
    const x = pt.x / 34 * W, yy = pt.y / 1000 * H;
    rCar.style.transform = `translate3d(${x}px,${yy}px,0)`;
    rDone.setAttribute('stroke-dasharray', `${p*1000} 1000`);
    route.setAttribute('aria-valuenow', Math.round(p*100));
  }
  requestAnimationFrame(routeTick);
}
requestAnimationFrame(routeTick);
const routeTo = (e) => {
  const r = route.getBoundingClientRect(), p = clamp((e.clientY - r.top) / r.height), y = p * maxY();
  if (window.siteLenis) siteLenis.scrollTo(y, {immediate: rDrag}); else scrollTo(0, y);
};
route.addEventListener('pointerdown', e => { rDrag = true; route.setPointerCapture(e.pointerId); routeTo(e); });
route.addEventListener('pointermove', e => { if (rDrag) routeTo(e); });
const rUp = () => { rDrag = false; };
route.addEventListener('pointerup', rUp); route.addEventListener('pointercancel', rUp);


/* loader: hide after the logo has been drawn and the page is ready */
(() => {
  const ld = $('#loader'); if (!ld) return;
  const t0 = performance.now(), MIN = RM ? 0 : 3000;
  const done = () => { ld.classList.add('done'); document.body.classList.remove('loading'); };
  const go = () => setTimeout(done, Math.max(0, MIN - (performance.now() - t0)));
  if (document.readyState === 'complete') go(); else addEventListener('load', go, {once: true});
  setTimeout(done, 6000);
})();

const onS = () => header.classList.toggle('solid', scrollY > innerHeight*.6);
onS(); addEventListener('scroll', onS, {passive:true});

/* reels */
$$('.reel').forEach(r=>{
  const v = r.querySelector('video');
  r.addEventListener('click',()=>{
    if (v.paused){ $$('.reel video').forEach(o=>{ if(o!==v){ o.pause(); o.closest('.reel').classList.remove('playing'); }}); v.play(); r.classList.add('playing'); }
    else { v.pause(); r.classList.remove('playing'); }
  });
  v.addEventListener('ended',()=>r.classList.remove('playing'));
});

/* custom dropdown */
const dd = $('#dd'), ddBtn = dd.querySelector('button'), opts = [...dd.querySelectorAll('li')];
function closeDD(){ dd.classList.remove('open'); ddBtn.setAttribute('aria-expanded','false'); }
ddBtn.onclick = () => { const o = !dd.classList.contains('open'); dd.classList.toggle('open',o); ddBtn.setAttribute('aria-expanded',o); };
opts.forEach(li => li.onclick = () => { opts.forEach(o=>o.setAttribute('aria-selected','false')); li.setAttribute('aria-selected','true'); $('#ddVal').textContent = li.textContent; $('#ddInput').value = li.textContent; closeDD(); });
document.addEventListener('click', e => { if(!dd.contains(e.target)) closeDD(); });

/* WhatsApp bubble */
setTimeout(()=>$('#wa').classList.add('show'),3000);
setTimeout(()=>$('#wa').classList.remove('show'),10000);

/* form (preview only) */
const form = $('#leadForm'), toast = $('#toast');
form.addEventListener('submit', e => {
  e.preventDefault();
  if (!form.name.value.trim()){ form.name.focus(); return; }
  if (!form.phone.value.trim()){ form.phone.focus(); return; }
  form.reset(); toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),3500);
});

    return () => { alive = false; cleanups.forEach((c) => c()); window.siteLenis?.destroy?.(); };
  }, []);

  return (
    <div className="is-root">
<div className="loader" id="loader" aria-hidden="true">
  <div className="loader__logo">
    <img className="loader__art" src="assets/img/logo-full.jpg" alt="" />
    <img className="loader__name" src="assets/img/logo-full.jpg" alt="" />
    <img className="loader__tag" src="assets/img/logo-full.jpg" alt="" />
    <span className="loader__pen"></span>
  </div>
</div>

<svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
  <defs>
    <symbol id="navmap" viewBox="0 0 520 420" fill="none" stroke="currentColor">
      <g strokeWidth=".8" opacity=".55"><path d="M0 70H520M0 175H520M0 280H520M0 385H520M90 0V420M210 0V420M330 0V420M450 0V420" strokeDasharray="2 6" /></g>
      <g font-family="almoni,sans-serif" fontSize="11" fill="currentColor" stroke="none" opacity=".8"><text x="96" y="64">31°46′</text><text x="216" y="64">32°10′</text><text x="336" y="64">32°48′</text><text x="456" y="166">35°13′</text></g>
      <path d="M40 360C90 330 120 340 150 300S200 220 250 230 320 280 360 230 390 140 440 120 490 90 505 60" strokeWidth="2.2" strokeDasharray="7 7" strokeLinecap="round" />
      <g strokeWidth="1.6"><circle cx="40" cy="360" r="6" /><circle cx="250" cy="230" r="5" /><path d="M499 54l12 12M511 54l-12 12" /></g>
      <path d="M150 300c-4-10 4-18 10-18s14 8 10 18l-10 14z" strokeWidth="1.6" fill="currentColor" fill-opacity=".18" />
      <g transform="translate(400 300)" strokeWidth="1.3"><circle r="54" /><circle r="44" strokeDasharray="1.5 4" /><path d="M0-70V70M-70 0H70" strokeWidth=".7" /><path d="M0-62L10-10 0 0-10-10z" fill="currentColor" fill-opacity=".55" /><path d="M0 62L10 10 0 0-10 10z" /><path d="M-40-40l8 4M40-40l-4 8M-40 40l4-8M40 40l-8-4" strokeWidth=".9" /><text y="-74" text-anchor="middle" font-family="almoni-tzar,sans-serif" fontSize="16" fontWeight="800" fill="currentColor" stroke="none">N</text></g>
      <g strokeWidth=".9" opacity=".7"><path d="M60 120c40-30 90-30 120 0s70 30 100 0" /><path d="M70 140c40-24 80-24 106 0s66 24 96 0" /><path d="M84 160c34-18 66-18 88 0s56 18 82 0" /></g>
    </symbol>
    <symbol id="topo" viewBox="0 0 800 600" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M458 300C459 301 460 303 460 304C461 305 461 307 460 308C460 309 460 310 459 312C458 313 457 314 456 315C455 316 454 317 453 318C451 319 450 320 449 321C447 321 446 322 444 323C443 323 441 324 440 325C439 325 437 326 436 326C435 327 433 328 432 328C431 329 430 329 428 330C427 330 426 331 425 332C423 332 422 332 421 333C419 333 418 334 417 334C415 334 414 334 412 334C411 334 410 334 408 334C407 334 405 334 404 333C403 333 401 333 400 333C399 332 397 332 396 332C395 331 394 331 393 331C391 331 390 330 389 330C388 330 386 330 385 330C384 330 382 330 381 331C379 331 377 331 376 331C374 331 372 331 370 331C369 331 367 331 365 331C363 331 361 330 359 330C358 329 356 329 355 328C353 327 352 326 351 325C350 324 349 323 349 322C348 321 348 319 348 318C348 316 348 315 349 314C349 312 350 311 351 310C351 308 352 307 353 306C354 305 355 304 356 303C357 302 358 301 358 300C359 299 359 298 360 297C360 297 360 296 360 295C360 294 360 293 360 292C360 291 360 290 359 289C359 288 359 287 359 286C358 285 358 283 358 282C358 281 358 280 358 279C359 277 359 276 360 275C360 274 361 273 362 272C363 271 364 270 365 269C366 268 367 267 368 267C370 266 371 266 373 265C374 264 375 264 377 264C378 263 380 263 381 262C383 262 384 262 386 261C387 261 389 261 390 260C392 260 394 260 395 259C397 259 398 259 400 259C402 259 403 259 405 259C407 259 408 259 410 260C411 260 413 260 414 261C416 262 417 262 418 263C419 264 420 265 421 266C422 267 423 269 424 270C424 271 425 272 425 274C425 275 426 276 426 277C426 278 426 279 427 280C427 281 427 282 427 283C428 284 428 284 429 285C430 286 431 286 432 287C433 287 434 287 435 288C437 288 438 289 440 289C441 290 443 290 445 291C447 292 448 293 450 294C452 294 453 295 455 296C456 298 457 299 458 300Z" vectorEffect="non-scaling-stroke" />
      <path d="M539 295C541 298 542 301 543 304C544 307 544 310 543 312C543 315 541 318 539 321C538 323 535 326 533 328C530 330 527 332 523 334C520 336 517 338 513 339C509 341 506 342 502 343C499 344 495 345 492 346C489 347 486 348 483 349C480 350 477 351 475 352C472 354 469 355 467 356C464 357 462 358 459 359C457 360 454 361 452 362C449 363 446 364 443 365C441 365 438 366 435 366C432 367 429 367 426 367C423 367 420 367 418 367C415 367 412 366 409 366C406 366 403 365 401 365C398 364 395 364 393 363C390 363 387 362 385 362C382 362 379 362 376 362C373 362 370 362 367 362C363 362 360 362 356 362C353 362 349 363 345 362C341 362 337 362 333 361C329 361 325 360 322 359C318 358 315 357 312 355C309 353 306 351 304 349C302 347 300 344 299 342C298 339 298 336 298 333C298 330 298 327 299 324C300 322 302 319 303 316C305 313 307 310 309 308C311 306 313 303 315 301C316 299 318 297 320 295C321 293 322 291 323 289C324 288 324 286 324 284C324 282 324 280 323 278C323 276 322 274 322 272C321 269 320 267 319 264C319 262 318 259 318 256C317 253 317 251 317 248C318 245 318 242 319 240C321 237 322 235 324 232C326 230 328 228 331 226C333 224 336 223 339 221C342 220 345 219 348 218C352 217 355 216 359 215C362 215 365 214 369 214C372 213 376 213 379 213C382 212 386 212 389 212C392 212 396 211 399 211C402 211 406 211 409 211C412 211 416 211 419 211C422 212 426 212 429 213C432 213 435 214 438 215C441 217 444 218 446 220C449 221 451 223 453 225C455 228 457 230 458 232C460 234 461 237 462 239C463 242 464 244 465 246C466 248 466 250 467 252C468 254 469 256 470 258C471 259 472 260 474 262C475 263 477 264 480 265C482 266 485 267 488 268C491 269 495 270 498 271C502 272 506 274 510 275C513 277 517 278 521 280C525 282 528 285 531 287C534 290 537 292 539 295Z" vectorEffect="non-scaling-stroke" />
      <path d="M623 290C626 294 628 299 628 304C629 308 629 313 628 317C626 322 624 326 621 330C618 334 613 338 609 341C604 344 599 347 593 350C587 353 581 355 575 357C569 359 563 360 557 362C552 363 546 364 541 366C535 367 530 368 526 369C521 370 517 372 513 373C508 374 505 376 501 377C497 379 494 381 490 382C487 384 484 386 480 388C476 390 473 391 469 393C465 394 461 396 457 397C453 398 449 399 444 400C440 401 436 401 431 402C427 402 422 402 418 402C414 401 409 401 405 400C401 400 396 399 392 399C388 398 383 398 379 397C374 397 370 397 365 396C361 396 356 396 351 396C346 396 341 396 335 395C330 395 324 395 319 394C313 394 307 393 301 392C296 391 290 390 285 388C279 386 274 384 270 382C265 379 261 376 258 372C255 369 252 365 251 361C249 357 248 353 248 348C248 344 249 339 250 335C251 331 254 326 256 322C258 318 261 314 264 310C267 306 270 303 273 299C276 296 279 293 281 290C283 287 285 284 286 282C287 279 288 276 288 273C288 270 287 267 287 264C286 261 285 258 283 254C282 250 280 246 279 242C278 238 277 234 276 230C275 225 275 221 275 216C275 212 276 207 278 203C279 199 281 195 284 191C287 188 291 185 295 182C298 179 303 176 308 174C313 172 318 171 323 170C329 168 334 167 340 167C346 166 351 166 357 166C362 166 367 166 373 166C378 166 383 166 388 166C393 166 398 166 403 167C408 167 413 167 418 167C423 168 428 168 432 169C437 169 442 170 447 171C451 172 456 173 460 174C465 176 469 177 473 179C477 182 480 184 484 187C487 189 490 192 492 195C495 198 497 201 499 204C502 207 503 211 505 214C507 217 508 220 510 222C512 225 513 228 515 230C518 232 520 234 523 236C526 238 529 240 533 241C537 243 541 244 546 246C551 248 556 249 562 252C567 254 573 256 579 258C585 261 591 264 596 267C602 270 607 274 612 278C616 281 620 286 623 290Z" vectorEffect="non-scaling-stroke" />
      <path d="M708 285C711 291 713 297 714 303C714 310 714 316 711 322C709 328 705 334 701 339C696 344 690 349 683 353C676 358 668 362 660 365C651 368 643 371 634 373C625 375 617 377 608 378C600 380 592 381 585 382C577 383 570 384 564 386C558 387 552 388 547 390C541 391 537 393 532 395C527 397 523 400 519 402C515 405 511 408 507 411C502 414 498 417 493 419C489 422 484 425 479 427C474 430 468 432 463 434C457 436 451 437 445 438C439 439 433 440 427 440C421 441 415 441 409 440C402 440 396 440 390 439C384 438 378 437 372 437C366 436 359 435 353 434C347 434 340 433 334 432C327 431 320 431 313 430C306 429 299 428 292 427C284 426 277 425 270 423C262 421 255 419 248 417C241 414 235 411 229 407C223 404 218 400 214 395C209 390 206 385 204 380C201 375 200 369 200 363C199 357 200 351 202 345C204 339 206 333 209 328C212 322 216 317 220 312C224 307 228 302 232 298C235 293 239 289 242 285C245 281 247 277 249 274C250 270 251 266 251 262C251 258 251 254 250 250C248 246 247 241 245 236C243 231 240 226 239 220C237 215 235 209 234 203C232 197 232 190 232 184C232 178 233 172 235 166C237 161 240 155 243 150C247 145 252 140 258 136C263 133 270 129 276 127C283 124 291 122 298 121C306 120 314 119 322 119C329 118 337 119 345 119C353 119 360 120 367 121C375 122 382 123 388 124C395 124 402 125 408 126C415 127 421 127 427 128C433 129 439 129 445 130C452 131 458 132 464 132C470 133 475 135 481 136C487 137 493 139 498 141C503 143 509 146 514 148C518 151 523 154 527 157C531 161 535 164 539 168C542 171 545 175 548 179C551 182 554 186 557 189C560 193 563 196 566 199C570 202 573 205 578 207C582 210 587 212 592 215C597 217 603 220 609 222C616 225 623 228 630 231C637 234 645 237 653 240C660 244 668 248 675 253C682 257 688 262 694 268C699 273 704 279 708 285Z" vectorEffect="non-scaling-stroke" />
      <path d="M790 280C794 288 796 295 796 303C796 311 794 319 791 326C788 333 782 341 776 347C769 353 761 359 752 365C743 370 732 374 721 378C711 382 699 385 688 387C677 389 665 391 654 393C644 394 633 395 624 396C615 397 606 398 598 399C590 401 584 402 577 404C571 406 566 408 560 411C555 413 551 417 546 420C541 424 537 428 532 432C528 436 523 441 518 446C513 450 507 455 501 459C495 463 488 467 482 470C475 473 467 476 460 479C452 481 444 483 436 484C428 485 420 485 412 485C403 485 395 485 387 484C379 483 371 482 363 481C355 480 347 478 339 476C331 475 323 473 315 472C306 470 298 468 290 466C281 465 273 463 264 461C256 459 247 456 238 454C230 451 221 448 213 444C205 441 197 436 190 432C183 427 177 422 172 416C167 410 162 404 159 398C156 391 155 384 154 377C153 370 154 362 156 355C158 348 161 341 164 334C167 327 172 320 176 314C181 307 186 301 190 296C194 290 199 285 202 280C206 275 209 270 211 265C213 261 214 256 214 251C214 246 213 241 212 236C211 230 208 225 206 218C204 212 200 205 198 198C196 191 193 184 191 176C190 168 188 160 189 152C189 145 190 137 192 129C194 122 198 115 203 108C208 102 214 96 221 91C228 86 236 82 245 79C254 76 264 74 273 73C283 71 294 71 304 71C314 71 324 72 334 73C344 75 353 76 362 78C372 80 380 82 389 83C397 85 405 87 413 88C421 90 429 91 436 92C443 93 451 94 458 95C465 96 473 96 480 97C487 98 494 99 502 100C509 101 516 102 523 104C530 105 537 107 544 110C551 112 557 115 563 118C569 121 575 125 580 128C586 132 591 136 596 140C600 144 605 148 610 152C614 156 619 160 624 164C628 168 633 172 639 175C644 179 650 183 657 186C664 190 671 193 678 197C686 201 694 204 703 209C711 213 720 217 729 222C737 227 746 233 754 239C762 245 769 251 775 258C781 265 787 272 790 280Z" vectorEffect="non-scaling-stroke" />
      <path d="M868 275C871 284 872 293 872 302C871 312 869 321 864 329C859 338 853 346 844 354C836 361 826 368 814 374C803 380 790 385 777 389C764 393 750 396 737 399C723 402 709 403 697 405C684 406 671 407 660 408C649 409 639 410 630 411C621 413 613 414 606 416C599 419 593 421 588 425C582 429 577 433 573 438C568 443 563 448 559 454C554 460 549 467 543 473C537 479 531 486 524 492C517 498 510 505 501 510C493 515 484 520 475 523C465 527 455 530 445 532C435 534 424 536 414 536C404 536 393 536 383 535C372 534 362 532 352 530C342 528 332 525 323 522C313 520 303 517 294 514C284 511 275 507 265 504C256 501 246 498 237 494C227 491 217 487 208 483C199 479 189 475 180 470C171 465 163 460 155 454C147 448 140 442 134 435C128 429 123 421 119 414C115 406 113 398 112 389C111 381 111 372 113 364C114 356 117 347 121 339C124 331 129 323 133 315C138 308 144 301 148 294C153 287 158 281 162 275C166 269 169 263 172 257C174 252 175 246 176 240C176 234 175 228 173 221C172 215 169 208 167 200C164 193 160 185 157 176C154 168 151 159 149 149C147 140 146 130 146 121C146 111 147 102 150 93C153 84 157 75 163 67C168 60 176 52 185 47C193 41 203 36 214 32C225 29 237 26 249 25C261 24 274 24 286 24C299 25 311 27 323 29C335 31 347 34 358 36C369 39 380 42 390 45C400 48 409 50 419 53C428 55 436 57 445 58C454 60 462 61 470 61C479 62 487 62 496 63C504 63 513 63 522 64C531 64 540 65 549 66C557 66 567 68 575 69C584 71 593 73 601 76C609 79 618 82 625 86C633 89 640 93 647 98C654 102 661 107 667 111C674 116 680 121 687 126C693 131 699 136 706 140C713 145 720 150 727 155C735 160 743 165 751 170C760 175 769 180 778 186C786 192 796 198 805 204C814 210 823 217 831 225C839 232 847 240 853 249C859 257 865 266 868 275Z" vectorEffect="non-scaling-stroke" />
      <path d="M937 270C940 280 941 291 939 301C938 312 934 322 928 332C923 341 915 351 905 359C895 367 883 375 870 381C857 388 842 394 827 398C813 403 797 406 781 409C766 412 750 414 736 415C721 417 707 418 695 419C683 420 671 421 661 423C651 424 643 426 635 429C628 432 622 435 616 440C610 445 605 450 601 457C596 463 591 471 586 479C581 486 576 495 570 504C563 512 557 522 549 530C541 538 532 547 522 554C512 561 501 568 490 574C479 579 466 583 454 586C442 590 429 591 416 592C403 593 390 592 377 590C365 589 352 586 340 583C328 580 316 576 305 571C294 567 283 562 272 557C261 552 251 547 241 542C230 537 220 532 210 526C200 521 190 516 180 510C170 505 160 499 151 493C142 487 132 481 124 474C116 467 108 460 101 452C95 444 89 436 84 427C80 419 76 409 75 400C73 391 72 381 73 372C74 363 77 353 80 344C83 335 87 326 92 317C96 308 102 300 107 292C111 285 117 277 121 270C125 263 129 256 131 249C134 242 135 236 136 229C136 222 135 215 134 207C132 199 129 191 126 182C123 173 119 164 116 154C113 144 109 133 107 123C105 112 103 100 104 89C104 78 105 67 108 56C112 46 117 36 123 27C130 18 139 9 149 2C159 -4 171 -10 184 -14C196 -18 211 -21 225 -22C239 -23 254 -23 269 -22C284 -21 299 -18 313 -15C327 -13 341 -9 354 -5C367 -1 379 3 391 7C403 11 413 14 424 17C434 20 444 23 454 25C464 26 473 28 483 28C492 29 502 29 512 29C522 29 532 28 542 27C553 27 564 26 575 26C586 26 597 26 608 27C619 28 631 29 641 31C652 33 663 36 674 39C684 43 694 47 703 51C713 56 722 61 730 67C739 72 747 78 755 84C763 90 770 97 778 103C786 109 794 116 802 122C810 129 818 135 826 142C835 149 844 156 852 163C861 171 870 178 879 186C888 194 897 203 904 212C912 220 919 230 925 240C930 249 935 260 937 270Z" vectorEffect="non-scaling-stroke" />
      <path d="M998 265C999 276 999 288 997 299C995 311 990 322 984 333C977 343 968 353 957 362C947 372 933 380 919 387C905 394 889 401 873 406C857 411 840 415 823 418C807 421 790 423 774 425C759 427 744 429 731 430C717 432 705 433 694 435C684 438 675 440 667 444C659 448 653 452 647 458C641 464 636 471 631 480C626 488 622 497 616 507C611 517 606 528 599 539C592 550 584 562 575 573C566 583 556 594 544 604C533 613 520 622 506 629C493 636 478 642 463 646C448 650 432 652 417 653C402 653 386 652 371 650C356 648 341 644 327 639C313 634 299 628 287 622C274 616 262 608 250 601C238 594 227 586 217 579C206 572 196 564 186 557C175 549 165 542 156 535C146 527 136 520 127 512C117 505 108 498 99 490C91 482 82 474 75 465C68 456 61 447 56 438C50 429 46 419 43 409C40 399 39 389 38 379C38 369 39 358 41 348C44 338 47 328 51 318C55 309 60 300 64 291C69 282 74 273 78 265C82 257 85 249 88 241C90 233 92 225 93 217C93 209 92 201 91 192C89 183 87 173 84 163C81 153 77 143 74 131C71 120 67 108 65 96C63 84 61 71 62 58C62 46 64 33 67 21C71 9 77 -3 85 -13C92 -24 102 -33 114 -41C125 -49 139 -55 154 -60C168 -65 185 -68 201 -69C217 -70 235 -70 252 -68C269 -67 286 -63 302 -60C319 -56 335 -51 350 -46C365 -42 379 -36 392 -31C405 -27 417 -22 429 -18C441 -15 452 -11 463 -9C474 -7 484 -6 495 -5C506 -5 517 -6 528 -6C539 -7 551 -9 563 -10C575 -12 588 -14 601 -15C615 -16 628 -18 642 -18C656 -18 670 -18 684 -17C698 -15 712 -13 725 -10C738 -7 751 -3 763 2C775 7 786 13 797 19C807 26 817 33 827 40C836 48 845 56 853 64C862 72 870 80 878 89C886 97 894 106 902 114C910 123 917 132 925 141C933 150 941 160 949 169C956 179 964 189 971 199C977 209 983 220 988 231C992 242 996 254 998 265Z" vectorEffect="non-scaling-stroke" />
      <path d="M1048 260C1049 272 1048 285 1045 297C1042 309 1037 321 1030 332C1023 344 1013 355 1002 365C991 374 978 384 964 392C949 400 933 407 917 413C900 418 882 423 865 427C848 431 831 434 815 437C799 439 783 441 769 444C756 446 743 448 732 451C721 455 712 458 704 463C695 468 689 474 683 481C676 489 672 498 666 508C661 518 656 529 650 541C644 553 638 567 630 580C622 593 614 607 603 620C593 633 581 647 567 658C554 669 539 680 523 688C507 697 490 704 472 708C454 713 436 715 418 716C400 716 381 715 364 711C347 708 329 702 313 696C298 689 282 681 268 672C254 663 241 653 229 643C217 634 206 623 195 613C184 603 174 593 165 583C155 573 145 564 136 555C127 545 118 537 108 528C99 519 90 510 81 501C73 492 64 484 56 475C48 465 40 456 34 446C27 437 21 426 17 416C12 406 9 395 7 384C5 374 5 363 5 352C6 341 8 330 10 320C13 309 16 299 20 289C23 279 28 269 31 260C34 251 38 241 40 232C43 223 45 214 45 205C46 195 45 186 44 176C43 166 41 155 38 144C36 132 32 121 29 108C26 95 23 82 21 69C20 55 18 41 19 27C20 13 22 -2 27 -15C31 -28 38 -41 47 -53C56 -64 67 -75 80 -84C93 -93 108 -100 124 -105C141 -111 159 -114 178 -115C196 -117 216 -116 235 -114C254 -113 273 -109 292 -104C310 -100 328 -94 345 -88C362 -83 378 -76 393 -71C408 -65 421 -60 435 -55C448 -51 460 -47 472 -45C484 -42 496 -41 508 -41C520 -40 532 -41 545 -43C557 -44 571 -47 585 -50C599 -52 614 -55 629 -58C645 -60 661 -63 677 -64C694 -66 711 -67 728 -66C745 -66 762 -64 778 -61C794 -58 810 -54 824 -49C839 -44 853 -37 866 -30C878 -22 890 -14 901 -5C911 4 921 14 930 24C939 34 946 45 954 55C961 66 968 77 975 87C982 98 988 109 994 120C1001 131 1007 142 1013 153C1018 165 1024 176 1029 188C1034 199 1039 211 1042 223C1045 235 1048 248 1048 260Z" vectorEffect="non-scaling-stroke" />
    </symbol>
    <symbol id="i-wa" viewBox="0 0 24 24"><path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.740 1.21c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm5.8 14.03c-.25.69-1.44 1.32-1.98 1.37-.5.05-.98.24-3.3-.69-2.8-1.1-4.58-3.97-4.72-4.15-.14-.18-1.12-1.5-1.12-2.86 0-1.36.71-2.03.97-2.31.25-.28.55-.35.73-.35l.53.01c.17 0 .4-.06.62.48.25.6.84 2.04.91 2.19.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.03 1.12 1 2.07 1.31 2.36 1.46.29.15.46.12.63-.07.17-.2.73-.85.92-1.14.19-.29.39-.24.65-.15.27.1 1.7.8 1.99.95.29.15.48.22.55.34.07.12.07.69-.18 1.38Z" /></symbol>
    <symbol id="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></symbol>
    <symbol id="i-play" viewBox="0 0 24 24"><path fill="currentColor" d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></symbol>
    <symbol id="i-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></symbol>
    <symbol id="i-compass" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9.5" /><path d="m15.8 8.2-2.1 5.5-5.5 2.1 2.1-5.5 5.5-2.1Z" /></symbol>
    <symbol id="i-grad" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M22 9 12 4 2 9l10 5 10-5Z" /><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" /></symbol>
    <symbol id="i-book" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5.5C5.5 4 9 4 12 6c3-2 6.5-2 9-.5v13c-2.5-1.5-6-1.5-9 .5-3-2-6.5-2-9-.5v-13Z" /><path d="M12 6v13" /></symbol>
    <symbol id="i-tv" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2.5" y="6.5" width="19" height="13" rx="2.5" /><path d="m8 2.5 4 4 4-4" /></symbol>
    <symbol id="i-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></symbol>
    <symbol id="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9.5" /><path d="m8 12.5 2.7 2.7L16.5 9.5" /></symbol>
    <symbol id="i-yt" viewBox="0 0 24 24"><path fill="currentColor" d="M21.6 7.2a2.5 2.5 0 0 0-1.77-1.770C18.27 5 12 5 12 5s-6.27 0-7.83.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.77 1.77C5.73 19 12 19 12 19s6.27 0 7.83-.43a2.5 2.5 0 0 0 1.77-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" /></symbol>
    <symbol id="i-ig" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" /></symbol>
    <symbol id="i-tt" viewBox="0 0 24 24"><path fill="currentColor" d="M16.6 3c.3 2.2 1.7 3.8 4 4v3.1a7.4 7.4 0 0 1-4-1.2v6.3c0 3.2-2.4 5.8-5.8 5.8A5.7 5.7 0 0 1 5 15.3c0-3.6 3.2-6.2 6.8-5.6v3.3c-1.6-.5-3.4.6-3.4 2.3 0 1.4 1 2.4 2.4 2.4 1.5 0 2.5-1.1 2.5-2.7V3h3.3Z" /></symbol>
    <symbol id="i-fb" viewBox="0 0 24 24"><path fill="currentColor" d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9Z" /></symbol>
    <symbol id="i-drop" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.8S5.5 10 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 10 12 2.8 12 2.8Z" /><path d="M9 15a3 3 0 0 0 3 3" /></symbol>
    <symbol id="i-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12Z" /></symbol>
    <symbol id="i-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.1 4.2 2 2 0 0 1 3.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" /></symbol>
    <symbol id="i-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9.5" /><path d="M12 7v5l3 2" /></symbol>
  </defs>
</svg>


<header className="header" id="header">
  <a href="#top" className="logo" aria-label="ישראל שפירא, לראש העמוד">
    <img src="assets/img/avatar.jpg" alt="" width="44" height="44" />
    <span><b>ישראל שפירא</b><small>חוקר. מטייל. משפיע.</small></span>
  </a>
  <nav aria-label="ניווט ראשי">
    <a href="#about">נעים להכיר</a>
    <a href="#regions">איפה מטיילים</a>
    <a href="#services">לבעלי עסקים</a>
    <a href="#field">מהשטח</a>
    <a href="#community">הקהילה</a>
    <a href="#contact">צור קשר</a>
  </nav>
  <a className="btn btn-rust" href="#contact"><span className="long">לשיחת היכרות</span><span className="short">דברו איתי</span></a>
  <button className="menu" id="menu" type="button" aria-label="פתיחת תפריט" aria-expanded="false" aria-controls="drawer"><span></span></button>
</header>
<nav className="drawer" id="drawer" aria-label="תפריט נייד">
  <svg className="topo" viewBox="0 0 800 600" style={{ width: "170vw", left: "-55%", bottom: "-15%", color: "hsl(var(--sage))", opacity: ".07" }}><use href="#topo" /></svg>
  <button className="drawer__close" id="drawerClose" type="button" aria-label="סגירת תפריט">סגירה</button>
  <a href="#about">נעים להכיר</a>
  <a href="#regions">איפה מטיילים</a>
  <a href="#services">לבעלי עסקים</a>
  <a href="#field">מהשטח</a>
  <a href="#community">הקהילה</a>
  <a href="#contact">צור קשר</a>
</nav>

<main id="top">


<section className="hero dark" id="hero">
  <div className="hero__bg" id="heroBg"><img src="assets/img/hero-jezreel.jpg" alt="עמק יזרעאל והר תבור ביום בהיר" fetchPriority="high" /></div>
  <div className="hero__shade"></div>
  <svg className="topo" viewBox="0 0 800 600" aria-hidden="true"><use href="#topo" /></svg>
  <div className="hero__inner" id="heroInner">
    <h1>
      <span className="ln"><span>הציבור החרדי יוצא לטייל.</span></span>
      <span className="ln"><span>אני מביא אותו אליכם.</span></span>
    </h1>
    <p className="lead fade-in">עשור על השבילים ושם מוביל בתחום הטיולים בחברה החרדית.<br />אני מחבר בין אטרקציות, מלונות וצימרים<br />לבין הקהל שמחפש בדיוק אותם.</p>
    <div className="pair fade-in l2">
      <a className="btn btn-rust" href="#contact">בואו נדבר על העסק שלכם</a>
      <a className="btn btn-line" href="#field">לצפייה בעבודות</a>
    </div>
  </div>
  <div className="hero__bar">
    <div className="hint">גללו למסע</div>
  </div>
</section>


<section className="tiul dark" id="tiul">
  <svg className="topo" viewBox="0 0 800 600" aria-hidden="true" style={{ width: "min(1200px,160vw)", right: "-30%", top: "-10%" }}><use href="#topo" /></svg>
  <div className="tiul__row">
    <div className="tcard" data-speed="-.12"><figure><img src="assets/img/spring-tabgha.jpg" alt="מעיין זורם לכנרת בטבחה" loading="lazy" /><figcaption>מעיינות</figcaption></figure></div>
    <div className="tcard" data-speed=".08"><figure><img src="assets/img/trail-meron.jpg" alt="שביל הליכה בהר מירון" loading="lazy" /><figcaption>שבילים</figcaption></figure></div>
    <div className="tcard" data-speed="-.04"><figure><img src="assets/img/waterfall-oasis.jpg" alt="מפל בנווה מדבר" loading="lazy" /><figcaption>מפלים</figcaption></figure></div>
    <div className="tcard" data-speed=".14"><figure><img src="assets/img/galil-meron.jpg" alt="נוף ירוק בגליל העליון" loading="lazy" /><figcaption>נופים</figcaption></figure></div>
  </div>
  <h2 className="rv">כל טיול מתחיל<br /><em>במי שמוביל אותו.</em></h2>
  <p className="lead rv d1">אני מכיר כל מעיין, כל שביל וכל נקודת תצפית.<br />והקהל שלי יודע: כשישראל ממליץ, שווה לנסוע.</p>
</section>


<section className="about" id="about">
  <svg className="topo" viewBox="0 0 800 600" aria-hidden="true"><use href="#topo" /></svg>
  <svg className="navmap" viewBox="0 0 520 420" aria-hidden="true"><use href="#navmap" /></svg>
  <div className="about__grid">
    <div>
      <h2 className="rv">עשור על השבילים.<br /><em>בלב הקהל החרדי.</em></h2>
      <p className="lead rv d1">אני ישראל שפירא, מדריך טיולים מוסמך, חוקר שטח ויוצר תוכן.<br />מוביל טיולים לקהלים רחבים, מעביר סדנאות, ימי גיבוש והרצאות,<br />ובונה את הקהילה הגדולה של מטיילים חרדים בישראל.</p>
      <ul className="creds">
        <li className="rv"><span className="ic"><img className="ic3" src="assets/icons/compass.png" alt="" loading="lazy" /></span><span><b>מדריך טיולים מוסמך</b><span>עשור שלם של הדרכה בכל רחבי הארץ</span></span></li>
        <li className="rv d1"><span className="ic"><img className="ic3" src="assets/icons/grad.png" alt="" loading="lazy" /></span><span><b>בוגר 4 מוסדות אקדמיים</b><span>מכללת ירושלים · מכללת וינגייט · מכללת הרצוג · האוניברסיטה העברית</span></span></li>
        <li className="rv d2"><span className="ic"><img className="ic3" src="assets/icons/book.png" alt="" loading="lazy" /></span><span><b>מכשיר את הדור הבא של המדריכים</b><span>מעביר קורסי מדריכי טיולים מטעם אוניברסיטת חיפה</span></span></li>
        <li className="rv d3"><span className="ic"><img className="ic3" src="assets/icons/mic.png" alt="" loading="lazy" /></span><span><b>מרואיין בכל הערוצים</b><span>קול מוכר בתקשורת בנושאי טבע, טיולים ותיירות</span></span></li>
      </ul>
      <p className="quote rv">"המטרה שלי פשוטה:<br />שכל משפחה חרדית תכיר את הארץ,<br />ושכל מקום טוב יכיר אותה."</p>
    </div>
    <div className="portrait rv d2">
      <div className="frame"><img src="assets/img/israel.jpg" alt="ישראל שפירא בשביל ביער, עם תרמיל טיולים" /></div>
      <div className="chip"><img src="assets/img/ein-gedi.jpg" alt="מפל שולמית בעין גדי" loading="lazy" /></div>
      <div className="stamp" aria-label="10+ שנים בשטח">
        <svg className="stamp__ring" viewBox="0 0 200 200" aria-hidden="true">
                    <circle cx="100" cy="100" r="97" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
          <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
        <div className="stamp__text" aria-hidden="true"><span style={{ transform: "rotate(0.00deg)" }}>מ</span><span style={{ transform: "rotate(-8.18deg)" }}>ד</span><span style={{ transform: "rotate(-16.36deg)" }}>ר</span><span style={{ transform: "rotate(-24.55deg)" }}>י</span><span style={{ transform: "rotate(-32.73deg)" }}>ך</span><span style={{ transform: "rotate(-40.91deg)" }}>&nbsp;</span><span style={{ transform: "rotate(-49.09deg)" }}>ט</span><span style={{ transform: "rotate(-57.27deg)" }}>י</span><span style={{ transform: "rotate(-65.45deg)" }}>ו</span><span style={{ transform: "rotate(-73.64deg)" }}>ל</span><span style={{ transform: "rotate(-81.82deg)" }}>י</span><span style={{ transform: "rotate(-90.00deg)" }}>ם</span><span style={{ transform: "rotate(-98.18deg)" }}>&nbsp;</span><span style={{ transform: "rotate(-106.36deg)" }}>מ</span><span style={{ transform: "rotate(-114.55deg)" }}>ו</span><span style={{ transform: "rotate(-122.73deg)" }}>ס</span><span style={{ transform: "rotate(-130.91deg)" }}>מ</span><span style={{ transform: "rotate(-139.09deg)" }}>ך</span><span style={{ transform: "rotate(-147.27deg)" }}>&nbsp;</span><span style={{ transform: "rotate(-155.45deg)" }}>·</span><span style={{ transform: "rotate(-163.64deg)" }}>&nbsp;</span><span style={{ transform: "rotate(-171.82deg)" }}>ח</span><span style={{ transform: "rotate(-180.00deg)" }}>ו</span><span style={{ transform: "rotate(-188.18deg)" }}>ק</span><span style={{ transform: "rotate(-196.36deg)" }}>ר</span><span style={{ transform: "rotate(-204.55deg)" }}>&nbsp;</span><span style={{ transform: "rotate(-212.73deg)" }}>·</span><span style={{ transform: "rotate(-220.91deg)" }}>&nbsp;</span><span style={{ transform: "rotate(-229.09deg)" }}>מ</span><span style={{ transform: "rotate(-237.27deg)" }}>ט</span><span style={{ transform: "rotate(-245.45deg)" }}>י</span><span style={{ transform: "rotate(-253.64deg)" }}>י</span><span style={{ transform: "rotate(-261.82deg)" }}>ל</span><span style={{ transform: "rotate(-270.00deg)" }}>&nbsp;</span><span style={{ transform: "rotate(-278.18deg)" }}>·</span><span style={{ transform: "rotate(-286.36deg)" }}>&nbsp;</span><span style={{ transform: "rotate(-294.55deg)" }}>מ</span><span style={{ transform: "rotate(-302.73deg)" }}>ש</span><span style={{ transform: "rotate(-310.91deg)" }}>פ</span><span style={{ transform: "rotate(-319.09deg)" }}>י</span><span style={{ transform: "rotate(-327.27deg)" }}>ע</span><span style={{ transform: "rotate(-335.45deg)" }}>&nbsp;</span><span style={{ transform: "rotate(-343.64deg)" }}>·</span><span style={{ transform: "rotate(-351.82deg)" }}>&nbsp;</span></div>
        <div className="stamp__core"><b>10+</b><span>שנים בשטח</span></div>
      </div>
    </div>
  </div>
</section>


<section className="regions dark" id="regions">
  <div className="pinwrap" data-pin="regions" style={{ height: "calc(5 * 80vh + 100vh)" }}>
    <div className="pin">
      <div className="reg__slide"><img src="assets/img/galil-meron.jpg" alt="הר מירון בגליל העליון" /></div>
      <div className="reg__slide"><img src="assets/img/kinneret.jpg" alt="תצפית על הכנרת" /></div>
      <div className="reg__slide"><img src="assets/img/judea-masada.jpg" alt="מדבר יהודה וים המלח ממצדה" /></div>
      <div className="reg__slide"><img src="assets/img/ein-gedi.jpg" alt="מפל בשמורת עין גדי" /></div>
      <div className="reg__slide"><img src="assets/img/negev-ramon.jpg" alt="מכתש רמון בנגב" /></div>
      <div className="reg__head"><h2>איפה מטיילים איתי</h2></div>
      <div className="reg__titles">
        <div className="reg__t"><span className="loc"><i><img className="ic3" src="assets/icons/pin.png" alt="" loading="lazy" /></i>צפון · הגליל העליון</span><h3>הגליל</h3><p>מירון, נחלים ושבילים ירוקים. האזור שהקהל החרדי הכי אוהב, ועדיין מלא בפינות שאף אחד לא מכיר.</p></div>
        <div className="reg__t"><span className="loc"><i><img className="ic3" src="assets/icons/pin.png" alt="" loading="lazy" /></i>צפון · עמק הירדן</span><h3>הכנרת</h3><p>חופים, מעיינות ותצפיות. היעד המשפחתי הקלאסי לבין הזמנים, עם הרבה יותר ממה שרואים מהכביש.</p></div>
        <div className="reg__t"><span className="loc"><i><img className="ic3" src="assets/icons/pin.png" alt="" loading="lazy" /></i>מזרח · ים המלח</span><h3>מדבר יהודה</h3><p>מצדה, נחלי אכזב ושקט של מדבר. מסלולים לגברים, לבחורי ישיבות ולמשפחות.</p></div>
        <div className="reg__t"><span className="loc"><i><img className="ic3" src="assets/icons/pin.png" alt="" loading="lazy" /></i>המעיינות הנדירים</span><h3>עין גדי</h3><p>מפלים בלב המדבר. בדיוק בשביל מקומות כאלה נולד "המעיינות הנדירים", הערוץ שמגלה לקהילה מקומות מים נסתרים.</p></div>
        <div className="reg__t"><span className="loc"><i><img className="ic3" src="assets/icons/pin.png" alt="" loading="lazy" /></i>דרום · הנגב</span><h3>הנגב</h3><p>מכתש רמון, לילות כוכבים ומרחבים אינסופיים. חוויה שמשנה פרספקטיבה, לקבוצות ולמשפחות.</p></div>
      </div>
      <div className="reg__nav">
        <span className="num" id="regNum">01</span><span style={{ opacity: ".6" }}>/ 05</span>
        <div className="bar"><i id="regBar"></i></div>
      </div>
    </div>
  </div>
  <div className="mob">
    <h2>איפה מטיילים איתי:<br /><em>מהגליל ועד הנגב.</em></h2>
    <article className="mcard rv"><img src="assets/img/galil-meron.jpg" alt="" loading="lazy" /><span className="loc">צפון</span><h3>הגליל</h3><p>מירון, נחלים ושבילים ירוקים.</p></article>
    <article className="mcard rv"><img src="assets/img/kinneret.jpg" alt="" loading="lazy" /><span className="loc">עמק הירדן</span><h3>הכנרת</h3><p>חופים, מעיינות ותצפיות.</p></article>
    <article className="mcard rv"><img src="assets/img/judea-masada.jpg" alt="" loading="lazy" /><span className="loc">ים המלח</span><h3>מדבר יהודה</h3><p>מצדה, נחלי אכזב ושקט של מדבר.</p></article>
    <article className="mcard rv"><img src="assets/img/ein-gedi.jpg" alt="" loading="lazy" /><span className="loc">המעיינות הנדירים</span><h3>עין גדי</h3><p>מפלים בלב המדבר.</p></article>
    <article className="mcard rv"><img src="assets/img/negev-ramon.jpg" alt="" loading="lazy" /><span className="loc">דרום</span><h3>הנגב</h3><p>מכתש רמון ומרחבים אינסופיים.</p></article>
  </div>
</section>


<section className="services dark" id="services">
  <div className="pinwrap" data-pin="services" style={{ height: "calc(5 * 80vh + 100vh)" }}>
    <div className="pin" id="svcStage">
      <div className="svc__layer"><img src="assets/img/galilee-view.jpg" alt="" /></div>
      <div className="svc__layer"><img src="assets/img/trail-meron.jpg" alt="" /></div>
      <div className="svc__layer"><img src="assets/img/waterfall-oasis.jpg" alt="" /></div>
      <div className="svc__layer"><img src="assets/img/spring-tabgha.jpg" alt="" /></div>
      <div className="svc__layer"><img src="assets/img/hero-jezreel.jpg" alt="" /></div>
      <div className="svc__layer"><img src="assets/img/negev-ramon.jpg" alt="" /></div>
      <div className="svc__slot" id="svcSlot"></div>
      <div className="svc__labels">
        <div className="svc__label"><i>01</i>שיווק ופרסום</div>
        <div className="svc__label"><i>02</i>ימי נטוורקינג</div>
        <div className="svc__label"><i>03</i>טיולים מודרכים</div>
        <div className="svc__label"><i>04</i>סדנאות וגיבוש</div>
        <div className="svc__label"><i>05</i>הרצאות</div>
        <div className="svc__label"><i>06</i>קורס מדריכים</div>
      </div>
      <div className="svc__head"><h2>לבעלי עסקים <em>ולמטיילים</em></h2></div>
      <div className="svc__text">
        <div className="svc__item"><h3>שיווק ופרסום לאתרי תיירות</h3><p>אני מגיע, חווה את המקום ומספר עליו לקהילה שלי בסרטונים, בסטטוסים ובערוצים שבהם הקהל החרדי באמת נמצא. תוכן שנראה כמו המלצה מחבר, לא כמו פרסומת.</p><a className="btn btn-rust" href="#contact">לבדיקת התאמה</a></div>
        <div className="svc__item"><h3>ימי נטוורקינג בטבע</h3><p>גם מטיילים וגם עושים עסקים. מסלול מודרך והיכרויות אמיתיות, קשרים שנבנים על השביל ומחזיקים הרבה אחרי.</p><a className="btn btn-rust" href="#network">ליום הבא</a></div>
        <div className="svc__item"><h3>טיולים מודרכים</h3><p>מסלולים מותאמים למשפחות, ישיבות, מוסדות וקהילות. מהמעיין הנסתר ועד התצפית הגדולה.</p><a className="btn btn-rust" href="#contact">לתיאום טיול</a></div>
        <div className="svc__item"><h3>סדנאות וימי גיבוש</h3><p>סדנאות לעצמאים בטבע וימי גיבוש לצוותים. לנשום, לחשוב ולצמוח מחוץ למשרד.</p><a className="btn btn-rust" href="#contact">לפרטים</a></div>
        <div className="svc__item"><h3>הרצאות</h3><p>הרצאות מרתקות על טבע, ארץ ישראל ומסע, לקהילות, כנסים וארגונים.</p><a className="btn btn-rust" href="#contact">להזמנת הרצאה</a></div>
        <div className="svc__item"><h3>קורס מדריכי טיולים</h3><p>הכשרת הדור הבא של המדריכים מטעם אוניברסיטת חיפה,<br />מהשטח ועם ניסיון של עשור.</p><a className="btn btn-rust" href="#contact">להצטרפות</a></div>
      </div>
    </div>
  </div>
  <div className="mob">
    <h2>לבעלי עסקים<br /><em>ולמטיילים.</em></h2>
    <article className="mcard rv"><img src="assets/img/galilee-view.jpg" alt="" loading="lazy" /><h3>שיווק ופרסום לאתרי תיירות</h3><p>תוכן שנראה כמו המלצה מחבר, בערוצים שבהם הקהל החרדי נמצא.</p></article>
    <article className="mcard rv"><img src="assets/img/trail-meron.jpg" alt="" loading="lazy" /><h3>ימי נטוורקינג בטבע</h3><p>גם מטיילים, גם עושים עסקים.</p></article>
    <article className="mcard rv"><img src="assets/img/waterfall-oasis.jpg" alt="" loading="lazy" /><h3>טיולים מודרכים</h3><p>למשפחות, ישיבות, מוסדות וקהילות.</p></article>
    <article className="mcard rv"><img src="assets/img/spring-tabgha.jpg" alt="" loading="lazy" /><h3>סדנאות וימי גיבוש</h3><p>לנשום, לחשוב ולצמוח מחוץ למשרד.</p></article>
    <article className="mcard rv"><img src="assets/img/hero-jezreel.jpg" alt="" loading="lazy" /><h3>הרצאות</h3><p>טבע, ארץ ישראל ומסע.</p></article>
    <article className="mcard rv"><img src="assets/img/negev-ramon.jpg" alt="" loading="lazy" /><h3>קורס מדריכי טיולים</h3><p>מטעם אוניברסיטת חיפה.</p></article>
  </div>
</section>


<section className="press" aria-label="ערוצים וגופים שעבדתי איתם">
  <div className="press__band"><div className="press__track"><div className="press__copy"><div className="plogo pl-kan11"><img src="assets/logos/kan11-mono.svg" alt="כאן 11" loading="lazy" /></div><div className="plogo pl-reshet13"><img src="assets/logos/reshet13-mono.svg" alt="רשת 13" loading="lazy" /></div><div className="plogo pl-news13"><img src="assets/logos/news13-mono.svg" alt="חדשות 13" loading="lazy" /></div><div className="plogo pl-haifa-univ"><img src="assets/logos/haifa-univ.svg" alt="אוניברסיטת חיפה" loading="lazy" /></div><div className="plogo pl-kan11"><img src="assets/logos/kan11-mono.svg" alt="כאן 11" loading="lazy" /></div><div className="plogo pl-reshet13"><img src="assets/logos/reshet13-mono.svg" alt="רשת 13" loading="lazy" /></div><div className="plogo pl-news13"><img src="assets/logos/news13-mono.svg" alt="חדשות 13" loading="lazy" /></div><div className="plogo pl-haifa-univ"><img src="assets/logos/haifa-univ.svg" alt="אוניברסיטת חיפה" loading="lazy" /></div><div className="plogo pl-kan11"><img src="assets/logos/kan11-mono.svg" alt="כאן 11" loading="lazy" /></div><div className="plogo pl-reshet13"><img src="assets/logos/reshet13-mono.svg" alt="רשת 13" loading="lazy" /></div><div className="plogo pl-news13"><img src="assets/logos/news13-mono.svg" alt="חדשות 13" loading="lazy" /></div><div className="plogo pl-haifa-univ"><img src="assets/logos/haifa-univ.svg" alt="אוניברסיטת חיפה" loading="lazy" /></div></div><div className="press__copy" aria-hidden="true"><div className="plogo pl-kan11"><img src="assets/logos/kan11-mono.svg" alt="" data-a="כאן 11" loading="lazy" /></div><div className="plogo pl-reshet13"><img src="assets/logos/reshet13-mono.svg" alt="" data-a="רשת 13" loading="lazy" /></div><div className="plogo pl-news13"><img src="assets/logos/news13-mono.svg" alt="" data-a="חדשות 13" loading="lazy" /></div><div className="plogo pl-haifa-univ"><img src="assets/logos/haifa-univ.svg" alt="" data-a="אוניברסיטת חיפה" loading="lazy" /></div><div className="plogo pl-kan11"><img src="assets/logos/kan11-mono.svg" alt="" data-a="כאן 11" loading="lazy" /></div><div className="plogo pl-reshet13"><img src="assets/logos/reshet13-mono.svg" alt="" data-a="רשת 13" loading="lazy" /></div><div className="plogo pl-news13"><img src="assets/logos/news13-mono.svg" alt="" data-a="חדשות 13" loading="lazy" /></div><div className="plogo pl-haifa-univ"><img src="assets/logos/haifa-univ.svg" alt="" data-a="אוניברסיטת חיפה" loading="lazy" /></div><div className="plogo pl-kan11"><img src="assets/logos/kan11-mono.svg" alt="" data-a="כאן 11" loading="lazy" /></div><div className="plogo pl-reshet13"><img src="assets/logos/reshet13-mono.svg" alt="" data-a="רשת 13" loading="lazy" /></div><div className="plogo pl-news13"><img src="assets/logos/news13-mono.svg" alt="" data-a="חדשות 13" loading="lazy" /></div><div className="plogo pl-haifa-univ"><img src="assets/logos/haifa-univ.svg" alt="" data-a="אוניברסיטת חיפה" loading="lazy" /></div></div></div></div>
</section>


<section className="why">
  <svg className="navmap" viewBox="0 0 520 420" aria-hidden="true"><use href="#navmap" /></svg>
  <div className="why__grid">
    <div className="why__intro">
      <h2 className="rv">יש לכם מקום מדהים.<br /><em>חסר לכם קהל?</em></h2>
      <p className="lead rv d1" style={{ color: "hsl(var(--stone))" }}>הציבור החרדי הוא קהל נאמן, משפחתי ועצום,<br />אבל הוא לא נמצא איפה שכולם מפרסמים.<br />אני כבר שם.</p>
      <div className="chips rv d2">
        <span className="chip"><i><img className="ic3" src="assets/icons/ferris.png" alt="" loading="lazy" /></i>אטרקציות ופארקים</span>
        <span className="chip"><i><img className="ic3" src="assets/icons/hotel.png" alt="" loading="lazy" /></i>מלונות ובתי הארחה</span>
        <span className="chip"><i><img className="ic3" src="assets/icons/cabin.png" alt="" loading="lazy" /></i>צימרים ווילות</span>
        <span className="chip"><i><img className="ic3" src="assets/icons/tent.png" alt="" loading="lazy" /></i>מתחמי אירוח וגיבוש</span>
      </div>
    </div>
    <div className="why__list">
      <div className="wi rv"><span className="n">01</span><div><h3>קהל שסומך עליי</h3><p>הקהילה שלי לא בוחרת מקום לפי מודעה,<br />היא בוחרת לפי מי שהיא סומכת עליו.<br />האמון הזה עובר אליכם.</p></div></div>
      <div className="wi rv d1"><span className="n">02</span><div><h3>נוכחות בערוצים הסגורים</h3><p>ערוצי ווטסאפ, ערוץ בנטפרי, צ'אט בגוגל ורשתות.<br />בדיוק במקומות שבהם הקהל החרדי צורך תוכן.</p></div></div>
      <div className="wi rv d2"><span className="n">03</span><div><h3>תוכן שמוכר בלי למכור</h3><p>אני מגיע לשטח, חווה ומצלם.<br />התוצאה: סרטונים אותנטיים שמביאים הזמנות, לא רק צפיות.</p></div></div>
    </div>
  </div>
</section>


<section className="process" id="process">
  <div className="pinwrap" data-pin="process" style={{ height: "calc(4 * 70vh + 100vh)" }}>
    <div className="pin">
      <svg className="topo" viewBox="0 0 800 600" aria-hidden="true"><use href="#topo" /></svg>
      <div className="proc__stage">
        <div className="proc__side">
          <h2>ארבע תחנות<br /><em>בדרך ללקוחות.</em></h2>
          <ol className="steps">
            <span className="fill" id="stepFill"></span>
            <li className="step on"><span className="dot"><img className="ic3" src="assets/icons/n1.png" alt="1" /></span><h3>שיחת היכרות</h3><p>מבינים מה המקום שלכם מציע, למי הוא מתאים ומה היעד.</p></li>
            <li className="step"><span className="dot"><img className="ic3" src="assets/icons/n2.png" alt="2" /></span><h3>מגיע לשטח</h3><p>אני חווה את המקום בעצמי, כי אני ממליץ רק על מה שאני מאמין בו.</p></li>
            <li className="step"><span className="dot"><img className="ic3" src="assets/icons/n3.png" alt="3" /></span><h3>יוצרים תוכן</h3><p>סרטונים וסטוריז אותנטיים, בשפה ובטון שהקהל החרדי מתחבר אליהם.</p></li>
            <li className="step"><span className="dot"><img className="ic3" src="assets/icons/n4.png" alt="4" /></span><h3>הקהל מגיע</h3><p>הפצה בכל הערוצים והקהילות, ושיחות טלפון שמתחילות להיכנס.</p></li>
          </ol>
        </div>
        <div className="proc__visual">
          <img className="on" src="assets/img/portrait.jpg" alt="ישראל שפירא" style={{ objectPosition: "center 20%" }} />
          <img src="assets/video/reel3.jpg" alt="ביקור במתחם אירוח" />
          <img src="assets/video/reel2.jpg" alt="צילום תוכן בבריכה בטבע" />
          <img src="assets/video/reel5.jpg" alt="מתחם אירוח מוכן לאורחים" />
        </div>
      </div>
    </div>
  </div>
</section>


<section className="field" id="field">
  <div className="pinwrap" data-pin="field" id="fieldWrap">
    <div className="pin">
      <div className="field__track" id="fieldTrack">
        <div className="field__intro">
          <h2>ככה זה נראה<br /><em>כשאני מגיע.</em></h2>
          <p className="lead">מבחר סרטונים ממקומות שהבאתי אליהם את הקהל.<br />לחצו על סרטון כדי לצפות.</p>
        </div>
        <div className="field__reels">
          <div className="reel"><video src="assets/video/reel1.mp4" poster="assets/video/reel1.jpg" playsInline preload="none"></video><button className="play" aria-label="הפעלת סרטון: מתחם כיפות במדבר"><i><svg><use href="#i-play" /></svg></i><b>מתחם כיפות במדבר</b><span>20 דקות מירושלים</span></button></div>
          <div className="reel"><video src="assets/video/reel2.mp4" poster="assets/video/reel2.jpg" playsInline preload="none"></video><button className="play" aria-label="הפעלת סרטון: באר ובריכה בטבע"><i><svg><use href="#i-play" /></svg></i><b>באר ובריכה בטבע</b><span>15 דקות ממודיעין עילית</span></button></div>
          <div className="reel"><video src="assets/video/reel3.mp4" poster="assets/video/reel3.jpg" playsInline preload="none"></video><button className="play" aria-label="הפעלת סרטון: אחוזת אברהם"><i><svg><use href="#i-play" /></svg></i><b>אחוזת אברהם</b><span>מתחם אירוח למשפחות</span></button></div>
          <div className="reel"><video src="assets/video/reel4.mp4" poster="assets/video/reel4.jpg" playsInline preload="none"></video><button className="play" aria-label="הפעלת סרטון: הטבה לעוקבים"><i><svg><use href="#i-play" /></svg></i><b>הטבה בלעדית לעוקבים</b><span>שיתוף פעולה עם בית עסק</span></button></div>
          <div className="reel"><video src="assets/video/reel5.mp4" poster="assets/video/reel5.jpg" playsInline preload="none"></video><button className="play" aria-label="הפעלת סרטון: מלון בוטיק"><i><svg><use href="#i-play" /></svg></i><b>מלון בוטיק עם בריכות</b><span>13 חדרים · 1,500 מ"ר</span></button></div>
        </div>
      </div>
    </div>
  </div>
</section>


<section className="network" id="network">
  <div className="disc" id="disc">
    <img className="disc__bg" src="assets/img/network-hiker.jpg" alt="מטייל עם תרמיל על רכס, מביט אל עמק ירוק" loading="lazy" />
    <div className="disc__word" id="discWord" aria-hidden="true">נטוורקינג</div>
    <img className="disc__fg" id="discFg" src="assets/img/network-hiker-cut.png" alt="" loading="lazy" />
  </div>
  <div className="net__body">
    <svg className="topo" viewBox="0 0 800 600" aria-hidden="true"><use href="#topo" /></svg>
    <h2 className="net__h rv">גם מטיילים.<br /><em>גם עושים עסקים.</em></h2>
    <ul className="net__list">
      <li className="rv"><i><img className="ic3" src="assets/icons/backpack.png" alt="" loading="lazy" /></i><b>מסלול מודרך</b><span>מותאם לקבוצה,<br />בקצב נוח לכולם</span></li>
      <li className="rv d1"><i><img className="ic3" src="assets/icons/people.png" alt="" loading="lazy" /></i><b>היכרויות אמיתיות</b><span>בעלי עסקים<br />מתחומים משלימים</span></li>
      <li className="rv d2"><i><img className="ic3" src="assets/icons/chat.png" alt="" loading="lazy" /></i><b>שיחות שנשארות</b><span>קשרים שנבנים על השביל<br />ומחזיקים</span></li>
    </ul>
    <p className="lead net__lead rv d1">יום אחד בשטח<br />שמחליף עשר פגישות במשרד.</p>
    <a className="btn btn-rust net__cta rv d2" href="#contact">להרשמה ליום הבא</a>
  </div>
</section>


<section className="community dark" id="community">
  <svg className="topo" viewBox="0 0 800 600" aria-hidden="true"><use href="#topo" /></svg>
  <div className="sec-head">
    <div>
      <h2 className="rv">מטיילים איתי<br /><em>בכל ערוץ.</em></h2>
    </div>
    <p className="lead rv d1 to-left" style={{ color: "hsl(var(--cream)/.8)" }}>מסלולים, מעיינות נסתרים והמלצות, ישר לטלפון.<br />בחרו את הערוץ שנוח לכם.</p>
  </div>
  <div className="ch-grid">
    <a className="ch big rv" href="https://channel.israelshapira.com" target="_blank" rel="noopener"><img className="ch__bg" src="assets/img/spring-tabgha.jpg" alt="" loading="lazy" /><span className="ic"><img className="ic3" src="assets/icons/drop.png" alt="" loading="lazy" /></span><span><b>המעיינות הנדירים</b><span>הערוץ בנטפרי: המקומות שאף אחד עוד לא מכיר</span></span><svg className="arr"><use href="#i-arrow" /></svg></a>
    <a className="ch rv" style={{ "--tint": "142 68% 40%" }} href="https://whatsapp.com/channel/0029VaKwhBJDDmFMr271lu2S" target="_blank" rel="noopener"><span className="ic"><img className="ic3" src="assets/icons/whatsapp.png" alt="" loading="lazy" /></span><span><b>ערוץ הווטסאפ</b><span>עדכונים ומסלולים</span></span><svg className="arr"><use href="#i-arrow" /></svg></a>
    <a className="ch rv d1" style={{ "--tint": "205 85% 48%" }} href="https://forms.gle/zjmyZazE2Z7CBLLHA" target="_blank" rel="noopener"><span className="ic"><img className="ic3" src="assets/icons/gchat.png" alt="" loading="lazy" /></span><span><b>הצ'אט בגוגל</b><span>הצטרפות דרך טופס קצר</span></span><svg className="arr"><use href="#i-arrow" /></svg></a>
    <a className="ch rv d2" style={{ "--tint": "0 75% 50%" }} href="https://youtube.com/channel/UCOkbVLgjU1xOhOZoKdm82cA" target="_blank" rel="noopener"><span className="ic"><img className="ic3" src="assets/icons/youtube.png" alt="" loading="lazy" /></span><span><b>יוטיוב</b><span>סרטוני טיולים מלאים</span></span><svg className="arr"><use href="#i-arrow" /></svg></a>
    <a className="ch rv" style={{ "--tint": "330 70% 55%" }} href="https://instagram.com/israel_shapira_travels" target="_blank" rel="noopener"><span className="ic"><img className="ic3" src="assets/icons/instagram.png" alt="" loading="lazy" /></span><span><b>אינסטגרם</b><span>@israel_shapira_travels</span></span><svg className="arr"><use href="#i-arrow" /></svg></a>
    <a className="ch rv d1" style={{ "--tint": "178 70% 36%" }} href="https://www.tiktok.com/@user611937327755949" target="_blank" rel="noopener"><span className="ic"><img className="ic3" src="assets/icons/tiktok.png" alt="" loading="lazy" /></span><span><b>טיקטוק</b><span>רגעים קצרים מהשטח</span></span><svg className="arr"><use href="#i-arrow" /></svg></a>
    <a className="ch rv d2" style={{ "--tint": "220 70% 55%" }} href="https://www.facebook.com/share/14wAL1mBdbT/" target="_blank" rel="noopener"><span className="ic"><img className="ic3" src="assets/icons/facebook.png" alt="" loading="lazy" /></span><span><b>פייסבוק</b><span>הקהילה הרחבה</span></span><svg className="arr"><use href="#i-arrow" /></svg></a>
  </div>
  <svg className="ccut" viewBox="0 0 1440 170" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 52C150 18 290 70 440 58S690 6 860 30 1120 96 1260 62 1400 26 1440 40" fill="none" stroke="hsl(var(--sage))" strokeOpacity=".35" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
    <path d="M0 78C170 42 300 96 470 84S700 30 880 56 1110 120 1270 88 1390 58 1440 66" fill="none" stroke="hsl(var(--cream))" strokeOpacity=".35" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
    <path d="M0 104C190 68 320 128 500 112S720 56 900 84 1100 150 1280 116 1380 92 1440 96V170H0Z" fill="hsl(var(--cream))" />
  </svg>
</section>


<section className="contact" id="contact">
  <svg className="topo" viewBox="0 0 800 600" aria-hidden="true"><use href="#topo" /></svg>
  <div className="contact__grid">
    <div>
      <h2 className="rv">יש לכם מקום<br />ששווה לטייל אליו?<br /><em>בואו נביא אליו קהל.</em></h2>
      <p className="lead rv d1">ספרו לי על העסק שלכם,<br />ואחזור אליכם לשיחת היכרות קצרה, בלי התחייבות.</p>
      <div className="ways rv d2">
        
        <a className="way" href="tel:+972000000000"><i><img className="ic3" src="assets/icons/phone.png" alt="" loading="lazy" /></i><b>חייגו</b><span dir="ltr">050-000-0000</span></a>
        <a className="way" href="https://wa.me/972000000000" target="_blank" rel="noopener"><i><img className="ic3" src="assets/icons/whatsapp.png" alt="" loading="lazy" /></i><b>ווטסאפ</b><span>מענה מהיר</span></a>
        <div className="way"><i><img className="ic3" src="assets/icons/clock.png" alt="" loading="lazy" /></i><b>זמינות</b><span>א'-ה' · 9:00-19:00</span></div>
      </div>
    </div>
    <form className="card rv d2" id="leadForm" noValidate>
      <h3>נשמח להכיר</h3>
      <div className="field-row">
        <div className="f"><label htmlFor="f-name">שם מלא</label><input id="f-name" name="name" required autoComplete="name" /></div>
        <div className="f"><label htmlFor="f-phone">טלפון</label><input id="f-phone" name="phone" type="tel" required autoComplete="tel" dir="ltr" style={{ textAlign: "right" }} /></div>
      </div>
      <div className="f">
        <span className="lbl" id="ddLbl">סוג העסק או הפנייה</span>
        <div className="dd" id="dd">
          <button type="button" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="ddLbl ddVal"><span id="ddVal">אטרקציה</span><svg><use href="#i-down" /></svg></button>
          <ul role="listbox" aria-labelledby="ddLbl">
            <li role="option" aria-selected="true">אטרקציה</li><li role="option">מלון או בית הארחה</li><li role="option">צימר או וילה</li><li role="option">מתחם אירוח</li><li role="option">יום נטוורקינג</li><li role="option">טיול, סדנה או הרצאה</li><li role="option">אחר</li>
          </ul>
          <input type="hidden" name="type" id="ddInput" defaultValue="אטרקציה" />
        </div>
      </div>
      <div className="f"><label htmlFor="f-msg">ספרו לי בקצרה</label><textarea id="f-msg" name="message"></textarea></div>
      <button className="btn btn-rust" type="submit">שליחה <svg><use href="#i-arrow" /></svg></button>
    </form>
  </div>
</section>
</main>

<footer className="dark">
  <div className="foot">
    <div>
      <a href="#top" className="logo"><img src="assets/img/avatar.jpg" alt="" width="44" height="44" /><span><b>ישראל שפירא</b><small>חוקר. מטייל. משפיע.</small></span></a>
      <p>מדריך טיולים מוסמך ומשפיען טבע ותיירות. מחבר בין הציבור החרדי לבין המקומות היפים בארץ.</p>
      <div className="socials">
        <a href="https://youtube.com/channel/UCOkbVLgjU1xOhOZoKdm82cA" target="_blank" rel="noopener" aria-label="יוטיוב"><img className="ic3" src="assets/icons/youtube.png" alt="" loading="lazy" /></a>
        <a href="https://instagram.com/israel_shapira_travels" target="_blank" rel="noopener" aria-label="אינסטגרם"><img className="ic3" src="assets/icons/instagram.png" alt="" loading="lazy" /></a>
        <a href="https://www.tiktok.com/@user611937327755949" target="_blank" rel="noopener" aria-label="טיקטוק"><img className="ic3" src="assets/icons/tiktok.png" alt="" loading="lazy" /></a>
        <a href="https://www.facebook.com/share/14wAL1mBdbT/" target="_blank" rel="noopener" aria-label="פייסבוק"><img className="ic3" src="assets/icons/facebook.png" alt="" loading="lazy" /></a>
        <a href="https://whatsapp.com/channel/0029VaKwhBJDDmFMr271lu2S" target="_blank" rel="noopener" aria-label="ערוץ ווטסאפ"><img className="ic3" src="assets/icons/whatsapp.png" alt="" loading="lazy" /></a>
      </div>
    </div>
    <div><h4>ניווט</h4><ul><li><a href="#about">נעים להכיר</a></li><li><a href="#regions">איפה מטיילים</a></li><li><a href="#services">לבעלי עסקים</a></li><li><a href="#field">מהשטח</a></li></ul></div>
    <div><h4>הקהילה</h4><ul><li><a href="https://channel.israelshapira.com" target="_blank" rel="noopener">המעיינות הנדירים</a></li><li><a href="https://whatsapp.com/channel/0029VaKwhBJDDmFMr271lu2S" target="_blank" rel="noopener">ערוץ הווטסאפ</a></li><li><a href="https://forms.gle/zjmyZazE2Z7CBLLHA" target="_blank" rel="noopener">הצ'אט בגוגל</a></li></ul></div>
    <div><h4>יצירת קשר</h4><ul><li><a href="https://wa.me/972000000000">ווטסאפ</a></li><li><a href="tel:+972000000000" dir="ltr">050-000-0000</a></li><li>א'-ה' · 9:00-19:00</li></ul></div>
  </div>
  <div className="legal">
    <span>© 2026 ישראל שפירא · כל הזכויות שמורות · <a href="#">הצהרת נגישות</a> · <a href="#">מדיניות פרטיות</a></span>
    <span>בניית אתרים ואפליקציות · לייזר פרוליך</span>
  </div>
</footer>

<div className="wa" id="wa">
  
  <a href="https://wa.me/972000000000" target="_blank" rel="noopener" aria-label="שיחה בווטסאפ"><img className="ic3" src="assets/icons/whatsapp.png" alt="" loading="lazy" /></a>
  <span className="bubble">רוצים קהל חרדי? דברו איתי</span>
</div>
<div className="route" id="route" role="scrollbar" aria-label="התקדמות בדף" aria-orientation="vertical" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabIndex="-1">
  <svg className="road" viewBox="0 0 34 1000" preserveAspectRatio="none" aria-hidden="true">
    <path className="r-base" id="rBase" vectorEffect="non-scaling-stroke" d="M17 0C30 70 4 140 17 220S30 360 17 440 4 580 17 660 30 800 17 880 10 960 17 1000" />
    <path className="r-done" id="rDone" vectorEffect="non-scaling-stroke" pathLength="1000" strokeDasharray="0 1000" d="M17 0C30 70 4 140 17 220S30 360 17 440 4 580 17 660 30 800 17 880 10 960 17 1000" />
    <path className="r-line" vectorEffect="non-scaling-stroke" d="M17 0C30 70 4 140 17 220S30 360 17 440 4 580 17 660 30 800 17 880 10 960 17 1000" />
  </svg>
  <span className="r-start"></span><span className="r-end"></span>
  <div className="car" id="rCar"><img src="assets/icons/pin.png" alt="" /></div>
</div>
<div className="toast" id="toast" role="status">תודה! אחזור אליכם בהקדם</div>
    </div>
  );
}
