function $(){}function H(t,e){for(const n in e)t[n]=e[n];return t}function I(t){return t&&typeof t=="object"&&typeof t.then=="function"}function B(t){return t()}function L(){return Object.create(null)}function y(t){t.forEach(B)}function O(t){return typeof t=="function"}function at(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function G(t){return Object.keys(t).length===0}function J(t,...e){if(t==null)return $;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function ot(t,e,n){t.$$.on_destroy.push(J(e,n))}function ft(t,e,n,r){if(t){const i=P(t,e,n,r);return t[0](i)}}function P(t,e,n,r){return t[1]&&r?H(n.ctx.slice(),t[1](r(e))):n.ctx}function dt(t,e,n,r){if(t[2]&&r){const i=t[2](r(n));if(e.dirty===void 0)return i;if(typeof i=="object"){const s=[],c=Math.max(e.dirty.length,i.length);for(let a=0;a<c;a+=1)s[a]=e.dirty[a]|i[a];return s}return e.dirty|i}return e.dirty}function _t(t,e,n,r,i,s){if(i){const c=P(e,n,r,s);t.p(c,i)}}function ht(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let r=0;r<n;r++)e[r]=-1;return e}return-1}function mt(t){return t??""}let v=!1;function K(){v=!0}function Q(){v=!1}function R(t,e,n,r){for(;t<e;){const i=t+(e-t>>1);n(i)<=r?t=i+1:e=i}return t}function U(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const u=[];for(let l=0;l<e.length;l++){const f=e[l];f.claim_order!==void 0&&u.push(f)}e=u}const n=new Int32Array(e.length+1),r=new Int32Array(e.length);n[0]=-1;let i=0;for(let u=0;u<e.length;u++){const l=e[u].claim_order,f=(i>0&&e[n[i]].claim_order<=l?i+1:R(1,i,_=>e[n[_]].claim_order,l))-1;r[u]=n[f]+1;const o=f+1;n[o]=u,i=Math.max(o,i)}const s=[],c=[];let a=e.length-1;for(let u=n[i]+1;u!=0;u=r[u-1]){for(s.push(e[u-1]);a>=u;a--)c.push(e[a]);a--}for(;a>=0;a--)c.push(e[a]);s.reverse(),c.sort((u,l)=>u.claim_order-l.claim_order);for(let u=0,l=0;u<c.length;u++){for(;l<s.length&&c[u].claim_order>=s[l].claim_order;)l++;const f=l<s.length?s[l]:null;t.insertBefore(c[u],f)}}function W(t,e){if(v){for(U(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function pt(t,e,n){v&&!n?W(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function V(t){t.parentNode&&t.parentNode.removeChild(t)}function yt(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function X(t){return document.createElement(t)}function j(t){return document.createTextNode(t)}function bt(){return j(" ")}function gt(){return j("")}function xt(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function $t(t){return function(e){return e.preventDefault(),t.call(this,e)}}function vt(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function Y(t){return Array.from(t.childNodes)}function Z(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function D(t,e,n,r,i=!1){Z(t);const s=(()=>{for(let c=t.claim_info.last_index;c<t.length;c++){const a=t[c];if(e(a)){const u=n(a);return u===void 0?t.splice(c,1):t[c]=u,i||(t.claim_info.last_index=c),a}}for(let c=t.claim_info.last_index-1;c>=0;c--){const a=t[c];if(e(a)){const u=n(a);return u===void 0?t.splice(c,1):t[c]=u,i?u===void 0&&t.claim_info.last_index--:t.claim_info.last_index=c,a}}return r()})();return s.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,s}function tt(t,e,n,r){return D(t,i=>i.nodeName===e,i=>{const s=[];for(let c=0;c<i.attributes.length;c++){const a=i.attributes[c];n[a.name]||s.push(a.name)}s.forEach(c=>i.removeAttribute(c))},()=>r(e))}function wt(t,e,n){return tt(t,e,n,X)}function et(t,e){return D(t,n=>n.nodeType===3,n=>{const r=""+e;if(n.data.startsWith(r)){if(n.data.length!==r.length)return n.splitText(r.length)}else n.data=r},()=>j(e),!0)}function kt(t){return et(t," ")}function Et(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function Nt(t,e){t.value=e??""}function jt(t,e,n,r){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,r?"important":"")}function At(t,e,n){t.classList[n?"add":"remove"](e)}function St(t,e){return new t(e)}let p;function d(t){p=t}function A(){if(!p)throw new Error("Function called outside component initialization");return p}function Ct(t){A().$$.on_mount.push(t)}function Mt(t){A().$$.after_update.push(t)}const m=[],T=[],g=[],k=[],q=Promise.resolve();let E=!1;function z(){E||(E=!0,q.then(S))}function Lt(){return z(),q}function N(t){g.push(t)}function Tt(t){k.push(t)}const w=new Set;let b=0;function S(){const t=p;do{for(;b<m.length;){const e=m[b];b++,d(e),nt(e.$$)}for(d(null),m.length=0,b=0;T.length;)T.pop()();for(let e=0;e<g.length;e+=1){const n=g[e];w.has(n)||(w.add(n),n())}g.length=0}while(m.length);for(;k.length;)k.pop()();E=!1,w.clear(),d(t)}function nt(t){if(t.fragment!==null){t.update(),y(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(N)}}const x=new Set;let h;function rt(){h={r:0,c:[],p:h}}function it(){h.r||y(h.c),h=h.p}function F(t,e){t&&t.i&&(x.delete(t),t.i(e))}function ct(t,e,n,r){if(t&&t.o){if(x.has(t))return;x.add(t),h.c.push(()=>{x.delete(t),r&&(n&&t.d(1),r())}),t.o(e)}else r&&r()}function Bt(t,e){const n=e.token={};function r(i,s,c,a){if(e.token!==n)return;e.resolved=a;let u=e.ctx;c!==void 0&&(u=u.slice(),u[c]=a);const l=i&&(e.current=i)(u);let f=!1;e.block&&(e.blocks?e.blocks.forEach((o,_)=>{_!==s&&o&&(rt(),ct(o,1,1,()=>{e.blocks[_]===o&&(e.blocks[_]=null)}),it())}):e.block.d(1),l.c(),F(l,1),l.m(e.mount(),e.anchor),f=!0),e.block=l,e.blocks&&(e.blocks[s]=l),f&&S()}if(I(t)){const i=A();if(t.then(s=>{d(i),r(e.then,1,e.value,s),d(null)},s=>{if(d(i),r(e.catch,2,e.error,s),d(null),!e.hasCatch)throw s}),e.current!==e.pending)return r(e.pending,0),!0}else{if(e.current!==e.then)return r(e.then,1,e.value,t),!0;e.resolved=t}}function Ot(t,e,n){const r=e.slice(),{resolved:i}=t;t.current===t.then&&(r[t.value]=i),t.current===t.catch&&(r[t.error]=i),t.block.p(r,n)}function Pt(t,e,n,r){const i=t.$$.props[e];i!==void 0&&(t.$$.bound[i]=n,r===void 0&&n(t.$$.ctx[i]))}function Dt(t){t&&t.c()}function qt(t,e){t&&t.l(e)}function ut(t,e,n,r){const{fragment:i,after_update:s}=t.$$;i&&i.m(e,n),r||N(()=>{const c=t.$$.on_mount.map(B).filter(O);t.$$.on_destroy?t.$$.on_destroy.push(...c):y(c),t.$$.on_mount=[]}),s.forEach(N)}function lt(t,e){const n=t.$$;n.fragment!==null&&(y(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function st(t,e){t.$$.dirty[0]===-1&&(m.push(t),z(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function zt(t,e,n,r,i,s,c,a=[-1]){const u=p;d(t);const l=t.$$={fragment:null,ctx:[],props:s,update:$,not_equal:i,bound:L(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(u?u.$$.context:[])),callbacks:L(),dirty:a,skip_bound:!1,root:e.target||u.$$.root};c&&c(l.root);let f=!1;if(l.ctx=n?n(t,e.props||{},(o,_,...C)=>{const M=C.length?C[0]:_;return l.ctx&&i(l.ctx[o],l.ctx[o]=M)&&(!l.skip_bound&&l.bound[o]&&l.bound[o](M),f&&st(t,o)),_}):[],l.update(),f=!0,y(l.before_update),l.fragment=r?r(l.ctx):!1,e.target){if(e.hydrate){K();const o=Y(e.target);l.fragment&&l.fragment.l(o),o.forEach(V)}else l.fragment&&l.fragment.c();e.intro&&F(t.$$.fragment),ut(t,e.target,e.anchor,e.customElement),Q(),S()}d(u)}class Ft{$destroy(){lt(this,1),this.$destroy=$}$on(e,n){if(!O(n))return $;const r=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return r.push(n),()=>{const i=r.indexOf(n);i!==-1&&r.splice(i,1)}}$set(e){this.$$set&&!G(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{Lt as A,$ as B,ft as C,_t as D,ht as E,dt as F,W as G,ot as H,T as I,Pt as J,mt as K,At as L,Tt as M,yt as N,xt as O,Nt as P,y as Q,Bt as R,Ft as S,Ot as T,$t as U,bt as a,pt as b,kt as c,it as d,gt as e,F as f,rt as g,V as h,zt as i,Mt as j,X as k,wt as l,Y as m,vt as n,Ct as o,jt as p,j as q,et as r,at as s,ct as t,Et as u,St as v,Dt as w,qt as x,ut as y,lt as z};
