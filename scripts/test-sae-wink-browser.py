"""Isolated component browser test. No full-app or deployment claims."""
import json, os, shutil, tempfile, time
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
checks = []
def check(name, ok):
    assert ok, name
    checks.append(name)
def observe(page, expression):
    deadline = time.monotonic() + 5
    while time.monotonic() < deadline:
        if page.evaluate(expression): return
        time.sleep(.05)
    raise AssertionError(expression)
class Handler(SimpleHTTPRequestHandler):
    def log_message(self, *_): pass
    def end_headers(self):
        self.send_header('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'")
        super().end_headers()
with tempfile.TemporaryDirectory() as td:
    site = Path(td)
    shutil.copytree(ROOT/'public/sae-wink', site/'sae-wink')
    (site/'index.html').write_text('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><button id="full">full</button><main id="world"></main><sae-wink world="peachfall" mark-count="6"></sae-wink><script type="module" src="/sae-wink/sae-wink.js"></script><script src="/fixture.js"></script></body></html>')
    (site/'fixture.js').write_text('window.proof={camera:0,keys:0,wheels:0,copied:""};window.addEventListener("sae-wink",()=>proof.camera++);window.addEventListener("wheel",()=>proof.wheels++);window.addEventListener("keydown",()=>proof.keys++);document.querySelector("#full").onclick=()=>document.querySelector("#world").requestFullscreen();document.addEventListener("fullscreenchange",()=>{(document.fullscreenElement||document.body).appendChild(document.querySelector("sae-wink"))});')
    server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=td))
    Thread(target=server.serve_forever,daemon=True).start()
    try:
        with sync_playwright() as p:
            kwargs={'headless':True}
            if os.environ.get('BROWSER_EXECUTABLE'):kwargs['executable_path']=os.environ['BROWSER_EXECUTABLE']
            browser=p.chromium.launch(**kwargs)
            page=browser.new_page(viewport={'width':1280,'height':800})
            errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
            page.goto(f'http://127.0.0.1:{server.server_port}/index.html?private=secret#secret')
            page.locator('.has-art').wait_for()
            check('same-origin sprite under strict CSP',page.locator('.art img').evaluate('(n)=>n.naturalWidth===96 && n.naturalHeight===192'))
            check('76px hit target',page.locator('.bubble').bounding_box()['width']==76)
            page.locator('.bubble').click();page.locator('dialog').wait_for(state='visible')
            check('local draft is truthfully labelled',page.locator('.status').inner_text()=='Local draft · not sent.')
            check('focus enters draft',page.locator('textarea').evaluate('(n)=>n.getRootNode().activeElement===n'))
            page.locator('textarea').fill('Continue the Peachfall scene.')
            before=page.evaluate('proof.wheels');page.locator('textarea').hover();page.mouse.wheel(0,100);time.sleep(.1)
            check('drawer wheel does not reach global gestures',page.evaluate('proof.wheels')==before)
            page.evaluate('Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:async(t)=>{proof.copied=t}}})')
            page.locator('.copy').click();observe(page,'proof.copied.length>0')
            text=page.evaluate('proof.copied')
            check('explicit copy preserves world and thought','World: peachfall. Route: /index.html. Local marks: 6.' in text and 'Continue the Peachfall scene.' in text)
            check('query and fragment excluded','secret' not in text and '?private' not in text)
            before=page.evaluate('proof.keys');page.keyboard.press('Escape');page.locator('dialog').wait_for(state='hidden')
            check('Escape closes drawer without reaching world',page.evaluate('proof.keys')==before)
            check('focus returns to eye',page.locator('.bubble').evaluate('(n)=>n.getRootNode().activeElement===n'))
            page.emulate_media(reduced_motion='reduce')
            check('reduced motion stops idle wink',page.locator('.art img').evaluate('(n)=>getComputedStyle(n).animationName')=='none')
            page.emulate_media(reduced_motion='no-preference');page.locator('.bubble').click();page.locator('.rest').click()
            check('rest holds eye closed',page.locator('sae-wink').get_attribute('resting') is not None)
            page.locator('.rest').click();page.keyboard.press('Escape')
            page.locator('#full').click();observe(page,'Boolean(document.fullscreenElement)');page.locator('.bubble').click()
            page.locator('dialog').wait_for(state='visible');page.keyboard.press('Escape')
            check('widget works inside fullscreen',page.evaluate('Boolean(document.fullscreenElement)'))
            page.evaluate('document.exitFullscreen()');observe(page,'!document.fullscreenElement')
            page.set_viewport_size({'width':390,'height':844});page.locator('.bubble').click()
            box=page.locator('dialog').bounding_box()
            check('mobile drawer in viewport',box['x']>=0 and box['y']>=0 and box['x']+box['width']<=390 and box['y']+box['height']<=844)
            page.evaluate('Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:async()=>{throw Error("denied")}}})');page.locator('.copy').click()
            observe(page,'document.querySelector("sae-wink").shadowRoot.querySelector(".status").textContent.startsWith("Clipboard unavailable")')
            check('clipboard failure preserves selectable draft','/anew · Grok ask' in page.locator('textarea').input_value())
            page.keyboard.press('Escape');page.evaluate('document.querySelector("sae-wink").addEventListener("sae:chat-request",e=>{e.preventDefault();proof.handled=true},{once:true})');page.locator('.bubble').click()
            check('existing host composer can handle request',page.evaluate('proof.handled===true') and not page.locator('dialog').is_visible())
            check('no camera-bound wink from widget',page.evaluate('proof.camera===0'))
            check('no JavaScript errors',not errors)
            browser.close()
    finally:server.shutdown()
print(json.dumps({'scope':'isolated component only','passed':len(checks),'checks':checks},indent=2))
