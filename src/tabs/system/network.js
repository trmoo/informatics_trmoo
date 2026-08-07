/* ============================================================================
 * network.js — 학습지 ① Ⅰ-1.(1) 유무선 네트워크의 특성
 *   장비를 놓고 케이블로 잇고 데이터를 실제로 보내 본다.
 *   허브는 모든 포트로 뿌리고, 스위치는 목적지 포트로만 보낸다 —
 *   이 차이를 말로 설명하는 대신 눈으로 보게 하는 것이 이 화면의 목적이다.
 *
 * © 2026 티쳐무 · 모든 권리 보유
 *
 * 무단 배포 및 상업적 이용을 금합니다. 학교 수업 목적으로만 이용해 주세요.
 * 그 밖의 이용(재배포·2차 저작물·수업 외 목적)은 먼저 문의해 주세요.
 * 오픈소스 라이선스를 붙이지 않았습니다 — 자세한 내용은 LICENSE 파일을 보세요.
 * ========================================================================== */

import { h, card, sheetHead, note, answer, quizSet, clear, shuffle } from '../../lib/ui.js';

/* ── 장비 종류 정의 ────────────────────────────────────────────────────
 * kind: 'end'  단말 (데이터를 만들고 받는 통신의 주체)
 *       'net'  네트워크 장비 (중계)
 * ---------------------------------------------------------------------- */
const KINDS = {
  pc:     { label: '데스크톱', icon: '🖥️', kind: 'end', color: '#3c78d8' },
  laptop: { label: '노트북',   icon: '💻', kind: 'end', color: '#3c78d8' },
  phone:  { label: '스마트폰', icon: '📱', kind: 'end', color: '#3c78d8', wirelessOnly: true },
  printer:{ label: '프린터',   icon: '🖨️', kind: 'end', color: '#3c78d8' },
  hub:    { label: '허브',     icon: '🔀', kind: 'net', color: '#c9880f' },
  switch: { label: '스위치',   icon: '🎛️', kind: 'net', color: '#0f9d6e' },
  router: { label: '라우터',   icon: '🧭', kind: 'net', color: '#8b46d8' },
  ap:     { label: '무선 AP',  icon: '📶', kind: 'net', color: '#d9781e' },
  cloud:  { label: '인터넷',   icon: '☁️', kind: 'net', color: '#5a6675' },
};

const W = 980, H = 520, R = 34;   // 캔버스 논리 크기와 장비 반지름

export function render(root) {
  root.append(...sheetHead('학습지 ①', 'Ⅰ-1. 네트워크의 구성 (1) 유무선 네트워크의 특성',
    ['[12정01-01]'],
    ['컴퓨팅 시스템의 구성요소를 설명할 수 있다.', '유무선 네트워크의 특성을 이해할 수 있다.']));

  root.append(builder());
  root.append(scaleCard());
  root.append(compareCard());
  root.append(deviceQuiz());
}

/* ═══════════════════════ ① 네트워크 조립대 ═══════════════════════════ */

function builder() {
  /* 상태 */
  const st = {
    nodes: [],          // {id, type, x, y, name}
    links: [],          // {a, b, wireless}
    mode: 'move',       // move | link | erase | send
    placing: null,      // 팔레트에서 고른 장비 종류
    pending: null,      // 연결·전송을 위해 먼저 고른 장비
    drag: null,
    packets: [],        // 날아가는 데이터 조각
    nextId: 1,
  };

  const canvas = h('canvas', { class: 'stage', style: { aspectRatio: `${W} / ${H}` } });
  const ctx = canvas.getContext('2d');
  const logBox = h('div', { class: 'console', style: { marginTop: '12px' } });

  /* ── 로그 ── */
  function log(msg, cls) {
    logBox.append(h('div', { class: cls || '' }, msg));
    logBox.scrollTop = logBox.scrollHeight;
  }
  function logClear() { clear(logBox); }

  /* ── 좌표 변환 ── */
  function pos(ev) {
    const r = canvas.getBoundingClientRect();
    return { x: ((ev.clientX - r.left) / r.width) * W, y: ((ev.clientY - r.top) / r.height) * H };
  }
  const hit = (p) => st.nodes.slice().reverse().find((n) => Math.hypot(n.x - p.x, n.y - p.y) < R + 6);

  /* ── 장비 추가 ── */
  function addNode(type, x, y) {
    const same = st.nodes.filter((n) => n.type === type).length + 1;
    const n = { id: st.nextId++, type, x, y, name: `${KINDS[type].label}${same}` };
    st.nodes.push(n);
    return n;
  }

  /* ── 연결 ── */
  function connect(a, b) {
    if (a === b) return log('같은 장비끼리는 연결할 수 없습니다.', 'err');
    if (st.links.some((l) => (l.a === a.id && l.b === b.id) || (l.a === b.id && l.b === a.id)))
      return log('이미 연결되어 있습니다.', 'muted');

    const ka = KINDS[a.type], kb = KINDS[b.type];
    const mobile = (n, k) => k.wirelessOnly || (n.type === 'laptop');
    const wireless = (a.type === 'ap' && mobile(b, kb)) || (b.type === 'ap' && mobile(a, ka));

    if ((ka.wirelessOnly || kb.wirelessOnly) && !wireless)
      return log(`${a.name} ↔ ${b.name} : 스마트폰은 케이블 구멍이 없습니다. 무선 AP 를 거쳐야 합니다.`, 'err');

    st.links.push({ a: a.id, b: b.id, wireless });
    log(`🔗 ${a.name} ↔ ${b.name} 연결 (${wireless ? '무선 — 전자기파' : '유선 — 케이블'})`);
  }

  /* ── 경로 찾기 (너비 우선 탐색) ── */
  function pathOf(srcId, dstId) {
    const adj = new Map(st.nodes.map((n) => [n.id, []]));
    st.links.forEach((l) => { adj.get(l.a).push(l.b); adj.get(l.b).push(l.a); });
    const prev = new Map([[srcId, null]]);
    const q = [srcId];
    while (q.length) {
      const cur = q.shift();
      if (cur === dstId) break;
      for (const nx of adj.get(cur) || []) if (!prev.has(nx)) { prev.set(nx, cur); q.push(nx); }
    }
    if (!prev.has(dstId)) return null;
    const out = [];
    for (let c = dstId; c !== null; c = prev.get(c)) out.unshift(c);
    return out;
  }

  const byId = (id) => st.nodes.find((n) => n.id === id);

  /* ── 데이터 보내기 ── */
  function send(src, dst) {
    const path = pathOf(src.id, dst.id);
    if (!path) {
      log(`❌ ${src.name} 에서 ${dst.name} 로 가는 길이 없습니다. 케이블을 더 이어 보세요.`, 'err');
      return;
    }
    logClear();
    log(`📨 ${src.name} → ${dst.name} 로 데이터를 보냅니다. (거치는 장비 ${path.length - 2}개)`);

    let step = 0;
    const hop = () => {
      if (step >= path.length - 1) {
        log(`✅ ${dst.name} 도착! 데이터를 받았습니다.`, '');
        return;
      }
      const from = byId(path[step]), to = byId(path[step + 1]);
      const cur = byId(path[step]);

      // 허브를 지날 때는 모든 포트로 함께 뿌려진다 — 이것이 스위치와의 결정적 차이
      if (cur.type === 'hub' && step > 0) {
        const others = st.links
          .filter((l) => l.a === cur.id || l.b === cur.id)
          .map((l) => byId(l.a === cur.id ? l.b : l.a))
          .filter((n) => n.id !== to.id && n.id !== path[step - 1]);
        log(`🔀 ${cur.name}: 목적지를 모르므로 연결된 모든 포트로 똑같이 뿌립니다. (${others.length + 1}갈래)`, 'muted');
        others.forEach((o) => st.packets.push({ from: cur, to: o, t: 0, ghost: true }));
      } else if (cur.type === 'switch' && step > 0) {
        log(`🎛️ ${cur.name}: 주소를 보고 ${to.name} 쪽 포트로만 보냅니다. 다른 포트는 조용합니다.`);
      } else if (cur.type === 'router' && step > 0) {
        log(`🧭 ${cur.name}: 다른 네트워크로 나갑니다. 가장 빠른 경로를 골라 전달합니다.`);
      } else if (cur.type === 'ap' && step > 0) {
        log(`📶 ${cur.name}: 유선 랜과 무선 랜을 이어 줍니다. 여기서부터 전파로 바뀝니다.`);
      }

      const link = st.links.find((l) =>
        (l.a === from.id && l.b === to.id) || (l.a === to.id && l.b === from.id));
      st.packets.push({ from, to, t: 0, wireless: link?.wireless, onEnd: () => { step++; hop(); } });
    };
    hop();
  }

  /* ── 그리기 ── */
  function draw() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = canvas.clientWidth || W;
    if (canvas.width !== Math.round(cw * dpr)) {
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(cw * dpr * H / W);
    }
    const s = canvas.width / W;
    ctx.setTransform(s, 0, 0, s, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // 바탕 격자
    ctx.strokeStyle = '#eef1f7'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // 연결선
    st.links.forEach((l) => {
      const a = byId(l.a), b = byId(l.b);
      if (!a || !b) return;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = l.wireless ? '#d9781e' : '#7b8797';
      ctx.lineWidth = l.wireless ? 3 : 5;
      ctx.setLineDash(l.wireless ? [9, 7] : []);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // 장비
    st.nodes.forEach((n) => {
      const k = KINDS[n.type];
      const isPending = st.pending === n;
      ctx.beginPath(); ctx.arc(n.x, n.y, R, 0, Math.PI * 2);
      ctx.fillStyle = '#fff'; ctx.fill();
      ctx.lineWidth = isPending ? 6 : 3;
      ctx.strokeStyle = isPending ? '#cf3030' : k.color;
      ctx.stroke();
      ctx.font = '30px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(k.icon, n.x, n.y + 1);
      ctx.font = '700 15px system-ui, sans-serif';
      ctx.fillStyle = '#1b2430';
      ctx.fillText(n.name, n.x, n.y + R + 15);
    });

    // 날아가는 데이터
    st.packets.forEach((p) => {
      const x = p.from.x + (p.to.x - p.from.x) * p.t;
      const y = p.from.y + (p.to.y - p.from.y) * p.t;
      ctx.beginPath(); ctx.arc(x, y, p.ghost ? 7 : 11, 0, Math.PI * 2);
      ctx.fillStyle = p.ghost ? 'rgba(201,136,15,0.35)' : '#cf3030';
      ctx.fill();
      if (!p.ghost) {
        ctx.font = '700 11px system-ui, sans-serif';
        ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('D', x, y);
      }
    });

    // 안내
    if (!st.nodes.length) {
      ctx.font = '700 20px system-ui, sans-serif';
      ctx.fillStyle = '#9aa5b4'; ctx.textAlign = 'center';
      ctx.fillText('위의 장비 단추를 누른 뒤 이 판을 누르면 장비가 놓입니다.', W / 2, H / 2);
    }
  }

  /* ── 애니메이션 ── */
  function tick() {
    for (let i = st.packets.length - 1; i >= 0; i--) {
      const p = st.packets[i];
      p.t += 0.028;
      if (p.t >= 1) {
        st.packets.splice(i, 1);
        if (p.onEnd) p.onEnd();
      }
    }
    draw();
    requestAnimationFrame(tick);
  }

  /* ── 마우스·터치 ── */
  canvas.addEventListener('pointerdown', (ev) => {
    const p = pos(ev);
    const n = hit(p);

    if (st.placing) {
      const made = addNode(st.placing, p.x, p.y);
      log(`＋ ${made.name} 을(를) 놓았습니다.`);
      st.placing = null;
      paintPalette();
      return;
    }
    if (st.mode === 'erase') {
      if (!n) return;
      st.links = st.links.filter((l) => l.a !== n.id && l.b !== n.id);
      st.nodes = st.nodes.filter((x) => x !== n);
      log(`🗑️ ${n.name} 을(를) 지웠습니다.`);
      return;
    }
    if (st.mode === 'link' || st.mode === 'send') {
      if (!n) return;
      if (!st.pending) {
        st.pending = n;
        log(st.mode === 'link' ? `${n.name} 선택 — 이어질 상대를 누르세요.` : `${n.name} 선택 — 받을 장비를 누르세요.`, 'muted');
      } else {
        const a = st.pending; st.pending = null;
        if (st.mode === 'link') connect(a, n);
        else send(a, n);
      }
      return;
    }
    if (n) { st.drag = { n, dx: n.x - p.x, dy: n.y - p.y }; canvas.setPointerCapture(ev.pointerId); }
  });

  canvas.addEventListener('pointermove', (ev) => {
    if (!st.drag) return;
    const p = pos(ev);
    st.drag.n.x = Math.max(R, Math.min(W - R, p.x + st.drag.dx));
    st.drag.n.y = Math.max(R, Math.min(H - R - 16, p.y + st.drag.dy));
  });
  canvas.addEventListener('pointerup', () => { st.drag = null; });

  /* ── 팔레트·도구 단추 ── */
  const paletteBox = h('div', { class: 'row tight' });
  const toolBox = h('div', { class: 'row tight' });

  function paintPalette() {
    clear(paletteBox);
    paletteBox.append(h('span', { class: 'chip' }, '장비 놓기'));
    for (const [t, k] of Object.entries(KINDS)) {
      paletteBox.append(h('button', {
        type: 'button',
        class: 'btn small' + (st.placing === t ? '' : ' ghost'),
        onclick: () => { st.placing = st.placing === t ? null : t; st.pending = null; paintPalette(); },
      }, `${k.icon} ${k.label}`));
    }
  }

  function paintTools() {
    clear(toolBox);
    const modes = [['move', '✋ 옮기기'], ['link', '🔗 연결하기'], ['send', '📨 데이터 보내기'], ['erase', '🗑️ 지우기']];
    toolBox.append(h('span', { class: 'chip' }, '도구'));
    modes.forEach(([m, label]) => toolBox.append(h('button', {
      type: 'button', class: 'btn small' + (st.mode === m ? '' : ' ghost'),
      onclick: () => { st.mode = m; st.pending = null; st.placing = null; paintPalette(); paintTools(); },
    }, label)));
    toolBox.append(h('span', { class: 'spacer' }));
    toolBox.append(h('button', {
      type: 'button', class: 'btn gray small',
      onclick: () => { st.nodes = []; st.links = []; st.packets = []; st.nextId = 1; logClear(); log('판을 비웠습니다.'); },
    }, '전부 지우기'));
  }

  /* ── 미리 만들어 둔 예제 ── */
  function preset(which) {
    st.nodes = []; st.links = []; st.packets = []; st.nextId = 1; logClear();
    const mk = (t, x, y, name) => { const n = addNode(t, x, y); if (name) n.name = name; return n; };

    if (which === 'hub') {
      const hub = mk('hub', 490, 260, '허브');
      [[200, 110], [200, 410], [780, 110], [780, 410]].forEach(([x, y], i) => {
        const pc = mk('pc', x, y, `PC${i + 1}`);
        st.links.push({ a: hub.id, b: pc.id, wireless: false });
      });
      log('허브 하나에 PC 4대를 붙였습니다. [📨 데이터 보내기] 로 PC1 → PC3 을 보내 보세요.');
      log('허브는 목적지를 모르기 때문에 모든 포트로 똑같이 뿌립니다. 흐린 공이 그것입니다.', 'muted');
    } else if (which === 'switch') {
      const sw = mk('switch', 490, 260, '스위치');
      [[200, 110], [200, 410], [780, 110], [780, 410]].forEach(([x, y], i) => {
        const pc = mk('pc', x, y, `PC${i + 1}`);
        st.links.push({ a: sw.id, b: pc.id, wireless: false });
      });
      log('같은 모양을 스위치로 바꿨습니다. PC1 → PC3 을 보내면 다른 포트는 조용합니다.');
    } else if (which === 'home') {
      const cloud = mk('cloud', 850, 90, '인터넷');
      const router = mk('router', 620, 200, '공유기(라우터)');
      const sw = mk('switch', 380, 200, '스위치');
      const ap = mk('ap', 620, 390, '무선 AP');
      const pc = mk('pc', 150, 120, 'PC');
      const pr = mk('printer', 150, 300, '프린터');
      const ph = mk('phone', 380, 450, '스마트폰');
      const lt = mk('laptop', 850, 450, '노트북');
      const L = (a, b, w) => st.links.push({ a: a.id, b: b.id, wireless: !!w });
      L(cloud, router); L(router, sw); L(router, ap); L(sw, pc); L(sw, pr);
      L(ap, ph, true); L(ap, lt, true);
      log('집·교실 네트워크 예시입니다. 스마트폰 → 프린터, 노트북 → 인터넷 처럼 보내 보세요.');
      log('무선 구간은 주황 점선, 유선 구간은 회색 실선입니다.', 'muted');
    }
    draw();   // 배경 탭이라 애니메이션 프레임이 오지 않아도 바로 보이도록
  }

  paintPalette(); paintTools(); tick();
  preset('home');

  return card('① 네트워크 조립대 — 놓고, 잇고, 실제로 보내 보기',
    h('p', { class: 'lead' },
      '장비를 놓고 케이블로 이은 다음 데이터를 보내 보세요. ',
      h('b', {}, '허브'), '와 ', h('b', {}, '스위치'), '가 어떻게 다르게 움직이는지 아래 기록 창에 그대로 나옵니다.'),
    paletteBox,
    h('div', { style: { height: '8px' } }),
    toolBox,
    h('div', { class: 'row tight', style: { margin: '10px 0' } },
      h('span', { class: 'chip' }, '예제 불러오기'),
      h('button', { type: 'button', class: 'btn ghost small', onclick: () => preset('home') }, '🏠 집·교실 네트워크'),
      h('button', { type: 'button', class: 'btn ghost small', onclick: () => preset('hub') }, '🔀 허브 4대'),
      h('button', { type: 'button', class: 'btn ghost small', onclick: () => preset('switch') }, '🎛️ 스위치 4대'),
    ),
    canvas,
    logBox,
    note('warn', h('b', {}, '해 볼 것 '),
      '① 「허브 4대」 를 불러와 PC1 → PC3 을 보내 보세요. ② 「스위치 4대」 로 바꿔 같은 일을 해 보세요. ',
      '허브는 상관없는 PC 에까지 데이터가 갑니다. 여러 대가 동시에 보내면 서로 부딪히고(충돌), 그래서 요즘은 스위치를 씁니다.'),
  );
}

/* ══════════════════ ② 네트워크 규모에 따른 분류 ══════════════════════ */

function scaleCard() {
  const cases = [
    { t: '무선 이어폰과 스마트폰을 블루투스로 연결', a: 'PAN', why: '10m 내외, 개인의 활동 공간' },
    { t: '학교 컴퓨터실 안의 컴퓨터 30대를 스위치로 묶음', a: 'LAN', why: '집·사무실·학교 같은 가까운 지역' },
    { t: '서울시 전체 지하철역 안내 시스템을 하나로 연결', a: 'MAN', why: 'LAN과 WAN의 중간, 주로 도시 내' },
    { t: '한국의 은행과 미국의 은행이 송금 자료를 주고받음', a: 'WAN', why: '인터넷같이 지리적으로 먼 곳' },
    { t: '스마트워치가 내 휴대폰의 알림을 받아 옴', a: 'PAN', why: '개인 통신망' },
    { t: '집 공유기에 붙은 노트북·TV·스마트폰', a: 'LAN', why: '집 안이라는 가까운 지역' },
  ];

  const items = shuffle(cases).map((c) => ({
    q: c.t,
    type: 'choice', choices: ['PAN', 'LAN', 'MAN', 'WAN'],
    answer: c.a,
    explain: `${c.a} — ${c.why}`,
  }));

  return card('② 네트워크의 규모에 따른 분류 — 어디에 해당할까?',
    h('div', { class: 'scroll-x', style: { marginBottom: '16px' } }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', { style: { width: '90px' } }, '분류'), h('th', { class: 'left' }, '개념')),
      h('tr', {}, h('th', {}, 'PAN'), h('td', { class: 'left' },
        answer('Personal'), ' Area Network (개인 통신망) — 보통 10m 내외의 거리에서 개인의 활동 공간을 중심으로 장치들을 연결')),
      h('tr', {}, h('th', {}, 'LAN'), h('td', { class: 'left' },
        answer('Local'), ' Area Network (근거리 통신망) — 집, 사무실, 학교 등 가까운 지역을 묶는 네트워크')),
      h('tr', {}, h('th', {}, 'WAN'), h('td', { class: 'left' },
        answer('Wide'), ' Area Network (광역 통신망) — 인터넷같이 지리적으로 먼 곳을 연결')),
      h('tr', {}, h('th', {}, 'MAN'), h('td', { class: 'left' },
        answer('Metropolitan'), ' Area Network — LAN과 WAN의 중간 크기, 주로 도시 내의 통신에 사용')),
    )),
    quizSet(items, { revealOnWrong: true }));
}

/* ═══════════════════ ③ 유선 vs 무선 비교표 ═══════════════════════════ */

function compareCard() {
  const r = (label, wired, wireless) => h('tr', {},
    h('th', { style: { width: '120px' } }, label),
    h('td', { class: 'left' }, ...wired),
    h('td', { class: 'left' }, ...wireless));

  return card('③ 유선 네트워크와 무선 네트워크',
    h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', {}, ''), h('th', {}, '유선 네트워크'), h('th', {}, '무선 네트워크')),
      r('개념',
        [answer('광 케이블'), '이나 ', answer('이더넷 케이블'), '(= UTP 케이블) 등을 이용하여 구성'],
        ['무선 주파수, 전자기파를 이용하여 구성']),
      r('설치 비용',
        ['케이블을 벽이나 바닥에 직접 연결해야 하므로 초기 설치 비용이 비교적 높음'],
        ['별도의 케이블 연결이 없으므로 설치 비용이 비교적 저렴함']),
      r('확장 용이성',
        ['네트워크 확장 시 케이블의 추가 설치가 필요', h('br', {}), '장치 배치·활용에 ', answer('장소의 제약'), '을 받음'],
        ['장소의 제약 없이 자유롭게 기기 사용', h('br', {}), '사물과도 연결하여 ', answer('사물 인터넷'), '도 수행']),
      r('통신의 안정성',
        ['전파 간섭이 거의 발생하지 않아 안정적'],
        ['전자기파 간섭으로 속도 저하가 발생할 수 있으며 불안정']),
    )),
    h('h4', {}, '무선 네트워크 기술의 종류'),
    h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', { style: { width: '130px' } }, '종류'), h('th', { class: 'left' }, '특징')),
      h('tr', {}, h('th', {}, answer('전자 태그')), h('td', { class: 'left' },
        'RFID — 소형 반도체 칩이 내장된 태그·라벨·카드에 저장된 데이터를 무선 주파수로 읽어 내는 ',
        answer('인식'), ' 시스템. 교통 카드, 하이패스, 물류·재고 관리')),
      h('tr', {}, h('th', {}, answer('와이파이')), h('td', { class: 'left' }, '근거리에서 무선으로 고속 인터넷 통신을 할 수 있는 기술')),
      h('tr', {}, h('th', {}, answer('블루투스')), h('td', { class: 'left' },
        '10m 이내에서 무선으로 데이터를 주고받는 기술. ', h('b', {}, '페어링'), ': 두 개의 장치를 연결하는 과정')),
      h('tr', {}, h('th', {}, '디스플레이 공유'), h('td', { class: 'left' },
        '서로 다른 기기 간에 화면을 공유하는 기술. ', answer('미러링'), ': 화면 그대로 다른 기기에 전송')),
    )));
}

/* ═════════════════ ④ 네트워크 장비 역할 문제 ════════════════════════ */

function deviceQuiz() {
  return card('④ 네트워크 장비의 역할 — 확인 문제',
    quizSet([
      {
        q: '여러 대의 컴퓨팅 시스템과 주변 장치를 연결하여 하나의 네트워크를 만드는 장비는?',
        type: 'choice', choices: ['허브·스위치', '라우터', '무선 AP', '전자 태그'],
        answer: '허브·스위치',
        explain: '허브와 스위치는 하나의 네트워크 안에서 데이터를 전송할 수 있게 하는 장비입니다.',
      },
      {
        q: '서로 다른 네트워크 사이에 위치하면서 데이터가 전송되는 최적화된 경로를 지정하는 장비는?',
        type: 'choice', choices: ['허브', '스위치', '라우터', '무선 AP'],
        answer: '라우터',
        explain: '라우터는 내부 네트워크와 외부 네트워크를 연결하고 최적 경로를 지정합니다.',
      },
      {
        q: '유선 랜과 무선 랜을 연결하여 와이파이를 쓸 수 있게 하는 장치는?',
        type: 'choice', choices: ['허브', '라우터', '무선 AP', '스위치'],
        answer: '무선 AP',
        explain: '무선 AP(액세스 포인트)가 유선 랜과 무선 랜을 이어 줍니다.',
      },
      {
        q: '데이터를 생성하고 받아들이는 통신의 주체(노트북, 스마트폰 등)를 무엇이라 하는가?',
        type: 'choice', choices: ['컴퓨팅 시스템', '전송 매체', '네트워크 장비', '프로토콜'],
        answer: '컴퓨팅 시스템',
        explain: '네트워크의 구성요소는 ① 컴퓨팅 시스템 ② 전송 매체 ③ 네트워크 장비 세 가지입니다.',
      },
      {
        q: '광 케이블, 이더넷 케이블처럼 데이터가 움직이는 통로에 해당하는 구성요소는?',
        type: 'choice', choices: ['컴퓨팅 시스템', '전송 매체', '네트워크 장비', '액추에이터'],
        answer: '전송 매체',
        explain: '전송 매체는 컴퓨팅 시스템과 네트워크 장비를 유·무선으로 연결해 주는 통로입니다.',
      },
      {
        q: '허브 대신 스위치를 쓰면 좋은 까닭으로 알맞은 것은?',
        type: 'choice',
        choices: ['모든 포트로 뿌려서 빠르다', '목적지 포트로만 보내 충돌이 줄어든다', '케이블이 필요 없다', '주소를 쓰지 않아도 된다'],
        answer: '목적지 포트로만 보내 충돌이 줄어든다',
        hint: '위 ① 조립대에서 허브와 스위치를 각각 실행해 보세요.',
        explain: '허브는 받은 데이터를 모든 포트로 뿌리므로 여러 대가 동시에 보내면 충돌이 납니다. 스위치는 주소를 보고 해당 포트로만 보냅니다.',
      },
    ], { revealOnWrong: true }));
}
