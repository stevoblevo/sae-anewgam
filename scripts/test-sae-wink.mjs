import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
// Explicit small unit fixture, not a browser or transport implementation.
globalThis.HTMLElement = class extends EventTarget {
  attributes = new Map();
  getAttribute(key) { return this.attributes.get(key) ?? null; }
  setAttribute(key, value) { this.attributes.set(key, value); }
};
const definitions = new Map();
globalThis.customElements = { get: (k) => definitions.get(k), define: (k, v) => definitions.set(k, v) };
globalThis.window = { location: { pathname: '/ball', search: '?private=secret', hash: '#private' } };
const { SaeWink } = await import('../public/sae-wink/sae-wink.js');
test('shared component registers once', () => assert.equal(definitions.get('sae-wink'), SaeWink));
test('context is small and route-only', () => assert.deepEqual(new SaeWink().context(), { world:'anewgam',route:'/ball',marks:0 }));
test('world is bounded and single-line', () => {const n = new SaeWink();n.setAttribute('world','peach\n'+ 'x'.repeat(200));assert.equal(n.context().world.length,160);assert.ok(!n.context().world.includes('\n'));});
test('mark count is clamped to existing flow maximum', () => {const n=new SaeWink();n.setAttribute('mark-count','999');assert.equal(n.context().marks,24);});
test('invalid mark count never becomes a claimed count', () => {for(const value of ['NaN','-2','1.5','Infinity']){const n=new SaeWink();n.setAttribute('mark-count',value);assert.equal(n.context().marks,0);}});
test('host composer may handle the new event without a camera event', () => {const n=new SaeWink();n.shadowRoot={};let seen=0;n.addEventListener('sae:chat-request',(e)=>{seen++;assert.equal(e.detail.context.route,'/ball');e.preventDefault();});n.addEventListener('sae-wink',()=>assert.fail('camera event'));n.open();assert.equal(seen,1);});
test('no host handler opens a local dialog, not a transport', () => {const n=new SaeWink();let shown=0,focused=0;const dialog={open:false,showModal:()=>shown++};const button={setAttribute:(k,v)=>assert.deepEqual([k,v],['aria-expanded','true'])};n.shadowRoot={querySelector:s=>s==='dialog'?dialog:s==='.bubble'?button:{focus:()=>focused++}};n.open();assert.equal(shown,1);assert.equal(focused,1);});
test('existing open drawer is not opened twice', () => {const n=new SaeWink();n.shadowRoot={querySelector:()=>({open:true,showModal:()=>assert.fail('reopened')})};n.open();});
test('new component does not import camera, networking or storage helpers', () => {const s=readFileSync(new URL('../public/sae-wink/sae-wink.js',import.meta.url),'utf8');for(const token of ['getUserMedia(', 'fetch(', 'WebSocket(', 'localStorage.', 'sessionStorage.', 'snapEye(', 'keepTake('])assert.ok(!s.includes(token),token);});
test('served sprite is the exact verified art derivative', () => {const b=readFileSync(new URL('../public/sae-wink/sae-wink-sprite.webp',import.meta.url));assert.equal(createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${b.length}\0`),b])).digest('hex'),'a149db36e6ebaca4435fc2dee8fd2ee5c51d6fdf');});
