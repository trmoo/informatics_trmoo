/* ============================================================================
 * compress.js — 학습지 ⑩ 데이터 압축
 *   ① 런 렝스 부호화 : 문자열을 넣으면 압축 결과와 크기 변화를 바로 보여 준다.
 *      압축했는데 오히려 커지는 경우까지 눈으로 확인하게 하는 것이 핵심.
 *   ② 허프만 알고리즘 : 빈도를 넣으면 트리를 한 단계씩 조립하고,
 *      코드표·총 비트수·압축률을 계산하고, 비트열을 다시 문자로 되돌린다.
 *
 * © 2026 티쳐무 · 모든 권리 보유
 *
 * 무단 배포 및 상업적 이용을 금합니다. 학교 수업 목적으로만 이용해 주세요.
 * 그 밖의 이용(재배포·2차 저작물·수업 외 목적)은 먼저 문의해 주세요.
 * 오픈소스 라이선스를 붙이지 않았습니다 — 자세한 내용은 LICENSE 파일을 보세요.
 * ========================================================================== */

import { h, card, sheetHead, note, answer, quizSet, clear, comma, drawNow } from '../../lib/ui.js';

export function render(root) {
  root.append(...sheetHead('학습지 ⑩', 'Ⅱ-1. 데이터 압축과 암호화 (1) 데이터 압축',
    ['[12정02-01]'],
    ['디지털 데이터 압축의 개념과 필요성을 이해할 수 있다.',
     '문자 정보를 런 렝스 및 허프만 코드를 활용하여 효율적으로 표현할 수 있다.']));

  root.append(conceptCard());
  root.append(rleCard());
  root.append(huffmanCard());
  root.append(compareCard());
}

/* ══════════════════ 개념 ══════════════════════════════════════════════ */

function conceptCard() {
  return card('압축이란',
    h('p', {}, '문자, 이미지, 소리 등의 디지털 데이터 크기를 줄이는 것. ',
      '반복적인 특성을 이용하여 줄이거나, 불필요한 부분을 제거하는 등 다양한 접근법을 씁니다.'),
    h('p', {}, h('b', {}, '필요성'), ' — 컴퓨팅 시스템의 자원 사용량 ', answer('감소'), ', 데이터를 주고받을 때 전송 속도 ', answer('향상')),

    h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', { style: { width: '80px' } }, ''), h('th', {}, '무손실 압축'), h('th', {}, '손실 압축')),
      h('tr', {}, h('th', {}, '개념'),
        h('td', { class: 'left' }, '원래의 내용을 ', answer('유지'), '하며 데이터 크기를 줄이는 방법'),
        h('td', { class: 'left' }, '꼭 필요하지 않거나 사람이 잘 인식하지 못하는 부분을 ', answer('제거'), '하거나 유사한 값으로 ', answer('변경'), '하여 줄이는 방법')),
      h('tr', {}, h('th', {}, '특징'),
        h('td', { class: 'left' }, '손실 없이 원래대로 복원 가능. 정확한 정보를 저장해야 하는 숫자·문자 압축에 사용'),
        h('td', { class: 'left' }, '일부를 잃어버려 원본과 똑같이 복원 불가. 용량이 큰 이미지·소리 파일에 활용')),
      h('tr', {}, h('th', {}, '예'),
        h('td', { class: 'left mono' }, 'ZIP, PNG, GIF, 런 렝스, 허프만'),
        h('td', { class: 'left mono' }, 'JPEG, MP3, MP4')),
    )),

    h('div', { class: 'note ok', style: { marginTop: '14px' } },
      h('b', {}, '압축률'), ' = ', answer('원본'), ' 데이터의 크기 ÷ ', answer('압축된'), ' 데이터의 크기 ／ ',
      '압축률이 ', answer('클수록'), ' 더 효율적인 압축 방법입니다.'));
}

/* ══════════════════ ① 런 렝스 부호화 ═══════════════════════════════ */

/** 'AAAABBCCC' → [['A',4],['B',2],['C',3]] */
function runs(s) {
  const out = [];
  for (const c of s) {
    if (out.length && out[out.length - 1][0] === c) out[out.length - 1][1]++;
    else out.push([c, 1]);
  }
  return out;
}

function rleCard() {
  const inp = h('input', {
    type: 'text', class: 'mono', value: 'AAAABBCCC',
    style: { width: '340px', fontSize: '1.15rem', letterSpacing: '2px' }, oninput: draw,
  });
  const view = h('div', {});
  const result = h('div', {});

  function draw() {
    const s = inp.value.toUpperCase();
    inp.value = s;
    clear(view); clear(result);
    if (!s) return;

    const rs = runs(s);
    const enc = rs.map(([c, n]) => c + n).join('');
    // 영문자 1글자, 숫자 1개 각각 1바이트로 계산한다 (학습지 규칙)
    const before = s.length;
    const after = enc.length;
    const ratio = after ? before / after : 0;

    // 묶음 색칠
    const palette = ['#e9f3ff', '#eefaf4', '#fff4e5', '#f7eefd', '#fdeeee', '#eef7f1'];
    const row = h('div', { class: 'row tight' });
    rs.forEach(([c, n], i) => {
      row.append(h('span', {
        style: {
          fontFamily: 'var(--mono)', fontSize: '1.25rem', fontWeight: '800', letterSpacing: '3px',
          padding: '6px 11px', borderRadius: '8px', background: palette[i % palette.length],
          border: '2px solid rgba(120,140,170,.3)',
        },
        title: `${c} 가 ${n}번`,
      }, c.repeat(n)));
      row.append(h('span', { style: { fontSize: '1.2rem', color: '#9aa5b4' } }, '→'));
      row.append(h('span', {
        class: 'chip',
        style: { fontFamily: 'var(--mono)', fontSize: '1.1rem', background: 'var(--accent)', color: '#fff' },
      }, `${c}${n}`));
      if (i < rs.length - 1) row.append(h('span', { style: { width: '10px' } }));
    });
    view.append(row);

    result.append(h('table', { class: 'tbl', style: { marginTop: '14px' } },
      h('tr', {}, h('th', { class: 'left', style: { width: '190px' } }, '원본'),
        h('td', { class: 'left mono' }, s), h('td', {}, `${before}바이트`)),
      h('tr', {}, h('th', { class: 'left' }, '압축 결과'),
        h('td', { class: 'left mono' }, enc), h('td', {}, `${after}바이트`)),
      h('tr', { class: ratio >= 1 ? 'hl' : '' }, h('th', { class: 'left' }, '압축률 (원본 ÷ 압축)'),
        h('td', { class: 'left mono', colspan: 2 },
          `${before} ÷ ${after} = ${ratio.toFixed(2)}`,
          ratio > 1 ? h('b', { style: { color: 'var(--ok)', marginLeft: '10px' } }, `✅ ${(100 - after / before * 100).toFixed(0)}% 줄었습니다`)
            : ratio === 1 ? h('b', { style: { color: 'var(--warn)', marginLeft: '10px' } }, '➖ 그대로입니다')
            : h('b', { style: { color: 'var(--bad)', marginLeft: '10px' } }, `❌ 오히려 ${after - before}바이트 늘었습니다!`))),
    ));

    if (ratio < 1) {
      result.append(note('bad',
        '반복되는 문자가 거의 없으면 「문자+1」이 계속 붙어 원본보다 커집니다. ',
        '런 렝스 부호화는 ', h('b', {}, '같은 값이 길게 이어질 때만'), ' 효율이 좋습니다.'));
    }
  }
  draw();

  const samples = ['AAAABBCCC', 'ABBBCCCCC', 'BBBBFFFFFFEEEETPPPRR', 'NOOOOOOOOOO', 'HURRAY', 'ABCDEFGHIJ', 'WWWWWWWWWWWWBBBWWWWWWWWWWWW'];

  return card('① 런 렝스(Run-Length) 부호화',
    h('p', {}, '데이터에서 같은 값이 연속해서 나타나는 것을 그 개수와 반복되는 값만으로 표현하는 방법. ',
      '동일한 문자가 연속으로 반복되는 부분을 ‘', answer('문자'), ' × ', answer('반복 횟수'), '’ 형태로 묶어서 표현합니다. ',
      '반복되는 문자가 ', answer('길게'), ' 나타날수록 압축 효율이 높습니다.'),

    h('div', { class: 'row', style: { margin: '14px 0 10px' } },
      h('label', { class: 'field' }, '원본 문자열'), inp),
    h('div', { class: 'row tight', style: { marginBottom: '14px' } },
      h('span', { class: 'chip' }, '눌러서 넣기'),
      samples.map((s) => h('button', {
        type: 'button', class: 'btn ghost small',
        onclick: () => { inp.value = s; draw(); },
      }, s.length > 14 ? s.slice(0, 12) + '…' : s))),

    view, result,

    h('h4', {}, '▣ 스스로 압축해 보기 (영문자 1글자, 숫자 1개 각각 1바이트로 가정)'),
    quizSet([
      { q: [h('span', { class: 'mono' }, 'AAAABBCCC'), ' 의 압축 결과는?'], answer: 'A4B2C3', width: 180,
        explain: 'A가 4번, B가 2번, C가 3번 → A4B2C3' },
      { q: [h('span', { class: 'mono' }, 'ABBBCCCCC'), ' 의 압축 결과는?'], answer: 'A1B3C5', width: 180,
        hint: '한 번만 나오는 문자도 개수 1을 반드시 붙여야 합니다.',
        explain: 'A가 1번, B가 3번, C가 5번 → A1B3C5' },
      { q: [h('span', { class: 'mono' }, 'BBBBFFFFFFEEEETPPPRR'), ' 의 압축 결과는?'], answer: 'B4F6E4T1P3R2', width: 220,
        explain: 'B4 F6 E4 T1 P3 R2 → B4F6E4T1P3R2 (원본 20바이트 → 12바이트)' },
      { q: ['<사례 A> ', h('span', { class: 'mono' }, 'NOOOOOOOOOO'), ' (총 11바이트) 의 압축 후 크기는?'],
        answer: '5', unit: '바이트', width: 120,
        explain: 'N1O10 → 글자 2개 + 숫자 3개 = 5바이트. 11 → 5로 크게 줄었습니다.' },
      { q: ['<사례 B> ', h('span', { class: 'mono' }, 'HURRAY'), ' (총 6바이트) 의 압축 후 크기는?'],
        answer: '10', unit: '바이트', width: 120,
        hint: '반복이 거의 없으면 어떻게 될까요? 위 실험실에 HURRAY 를 넣어 보세요.',
        explain: 'H1U1R2A1Y1 → 10바이트. 원본 6바이트보다 오히려 커졌습니다!' },
    ], { revealOnWrong: true }));
}

/* ══════════════════ ② 허프만 알고리즘 ═══════════════════════════════ */

/**
 * 허프만 트리를 만든다.
 * 가장 낮은 빈도 둘을 골라 합치고, 그때 작은 쪽을 왼쪽(0)에 둔다.
 * 이렇게 해야 학습지의 정답 코드(a=1111, b=0, c=110, d=1110, e=10)와 같아진다.
 * steps 에 합치는 과정을 순서대로 남겨 화면에 보여 준다.
 */
function buildHuffman(freqs) {
  let nodes = freqs.map(([ch, f], i) => ({ ch, f, order: i, leaf: true }));
  const steps = [];
  if (nodes.length === 1) {
    const only = nodes[0];
    return { root: { f: only.f, left: only, right: null, leaf: false }, steps };
  }
  let vid = 0;
  while (nodes.length > 1) {
    // 빈도가 작은 순, 같으면 먼저 만들어진 순
    nodes.sort((a, b) => a.f - b.f || a.order - b.order);
    const [x, y] = nodes.splice(0, 2);
    const merged = { f: x.f + y.f, left: x, right: y, leaf: false, order: 1000 + vid, name: `x${++vid}` };
    steps.push({
      a: label(x), b: label(y), sum: merged.f, name: merged.name,
      rest: nodes.map((n) => `${label(n)}(${n.f})`).join(', ') || '없음',
    });
    nodes.push(merged);
  }
  return { root: nodes[0], steps };
}

const label = (n) => (n.leaf ? n.ch : n.name || '·');

/** 트리를 훑어 각 글자의 코드를 만든다. 왼쪽 0, 오른쪽 1. */
function codesOf(root) {
  const out = {};
  (function walk(n, code) {
    if (!n) return;
    if (n.leaf) { out[n.ch] = code || '0'; return; }
    walk(n.left, code + '0');
    walk(n.right, code + '1');
  })(root, '');
  return out;
}

function huffmanCard() {
  let freqs = [['a', 12], ['b', 40], ['c', 15], ['d', 8], ['e', 25]];

  const editBox = h('div', {});
  const stepsBox = h('div', {});
  const cv = h('canvas', { class: 'stage', style: { aspectRatio: '2 / 1' } });
  const codeBox = h('div', {});
  const decodeBox = h('div', {});

  /* ── 빈도 편집 ── */
  function paintEdit() {
    clear(editBox);
    const tbl = h('table', { class: 'tbl', style: { maxWidth: '640px' } });
    const r1 = h('tr', {}, h('th', { class: 'left' }, '문자'));
    const r2 = h('tr', {}, h('th', { class: 'left' }, '빈도수'));
    const r3 = h('tr', {}, h('th', { class: 'left' }, ''));
    freqs.forEach((f, i) => {
      r1.append(h('td', {}, h('input', {
        type: 'text', class: 'mono', value: f[0], maxlength: 2,
        style: { width: '46px', textAlign: 'center', padding: '4px' },
        oninput: (e) => { freqs[i][0] = e.target.value || '?'; redraw(); },
      })));
      r2.append(h('td', {}, h('input', {
        type: 'number', class: 'mono', value: f[1], min: 1,
        style: { width: '68px', textAlign: 'center', padding: '4px' },
        oninput: (e) => { freqs[i][1] = Math.max(1, Number(e.target.value) || 1); redraw(); },
      })));
      r3.append(h('td', {}, h('button', {
        type: 'button', class: 'btn gray small',
        onclick: () => { if (freqs.length > 2) { freqs.splice(i, 1); paintEdit(); redraw(); } },
      }, '×')));
    });
    const total = freqs.reduce((a, f) => a + f[1], 0);
    r1.append(h('th', {}, '합계')); r2.append(h('th', {}, String(total))); r3.append(h('td', {}, ''));
    tbl.append(r1, r2, r3);
    editBox.append(tbl,
      h('div', { class: 'row tight', style: { marginTop: '10px' } },
        h('button', {
          type: 'button', class: 'btn small',
          onclick: () => { freqs.push([String.fromCharCode(97 + freqs.length), 5]); paintEdit(); redraw(); },
        }, '＋ 문자 추가'),
        h('button', {
          type: 'button', class: 'btn ghost small',
          onclick: () => { freqs = [['a', 12], ['b', 40], ['c', 15], ['d', 8], ['e', 25]]; paintEdit(); redraw(); },
        }, '학습지 예제로'),
        h('button', {
          type: 'button', class: 'btn ghost small',
          onclick: () => { freqs = [['a', 20], ['b', 20], ['c', 20], ['d', 20], ['e', 20]]; paintEdit(); redraw(); },
        }, '빈도가 모두 같을 때')));
  }

  /* ── 트리 그리기 ── */
  function drawTree(root) {
    const W = 1000, H = 500;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = cv.clientWidth || W;
    cv.width = Math.round(cw * dpr); cv.height = Math.round(cw * dpr * H / W);
    const ctx = cv.getContext('2d');
    const s = cv.width / W;
    ctx.setTransform(s, 0, 0, s, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // 잎을 왼쪽부터 차례로 놓고, 부모는 자식들의 가운데에 둔다
    let leafX = 0;
    const leaves = [];
    (function count(n) { if (!n) return; if (n.leaf) leaves.push(n); else { count(n.left); count(n.right); } })(root);
    const gap = W / (leaves.length + 1);

    let depth = 0;
    (function d(n, k) { if (!n) return; depth = Math.max(depth, k); d(n.left, k + 1); d(n.right, k + 1); })(root, 0);
    const vgap = Math.min(90, (H - 90) / Math.max(1, depth));

    (function place(n, k) {
      if (!n) return;
      if (n.leaf) { n._x = ++leafX * gap; n._y = 50 + k * vgap; return; }
      place(n.left, k + 1); place(n.right, k + 1);
      const xs = [n.left, n.right].filter(Boolean).map((c) => c._x);
      n._x = xs.reduce((a, b) => a + b, 0) / xs.length;
      n._y = 50 + k * vgap;
    })(root, 0);

    // 선
    (function line(n) {
      if (!n || n.leaf) return;
      [[n.left, '0'], [n.right, '1']].forEach(([c, bit]) => {
        if (!c) return;
        ctx.beginPath(); ctx.moveTo(n._x, n._y + 20); ctx.lineTo(c._x, c._y - 20);
        ctx.strokeStyle = bit === '0' ? '#1e6fd9' : '#d9781e';
        ctx.lineWidth = 3; ctx.stroke();
        ctx.font = '800 17px system-ui, sans-serif';
        ctx.fillStyle = bit === '0' ? '#1e6fd9' : '#d9781e';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const mx = (n._x + c._x) / 2, my = (n._y + c._y) / 2;
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(mx, my, 12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = bit === '0' ? '#1e6fd9' : '#d9781e';
        ctx.fillText(bit, mx, my + 1);
        line(c);
      });
    })(root);

    // 마디
    (function node(n) {
      if (!n) return;
      ctx.beginPath(); ctx.arc(n._x, n._y, 21, 0, Math.PI * 2);
      ctx.fillStyle = n.leaf ? '#0f9d6e' : '#fff';
      ctx.fill();
      ctx.lineWidth = 3; ctx.strokeStyle = n.leaf ? '#0b6f4e' : '#7b8797'; ctx.stroke();
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      if (n.leaf) {
        ctx.font = '800 17px system-ui, sans-serif'; ctx.fillStyle = '#fff';
        ctx.fillText(n.ch, n._x, n._y + 1);
        ctx.font = '700 13px system-ui, sans-serif'; ctx.fillStyle = '#1b2430';
        ctx.fillText(String(n.f), n._x, n._y + 36);
      } else {
        ctx.font = '800 15px system-ui, sans-serif'; ctx.fillStyle = '#1b2430';
        ctx.fillText(String(n.f), n._x, n._y + 1);
      }
      node(n.left); node(n.right);
    })(root);

    ctx.font = '700 14px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillStyle = '#1e6fd9'; ctx.fillText('왼쪽 = 0', 12, 20);
    ctx.fillStyle = '#d9781e'; ctx.fillText('오른쪽 = 1', 96, 20);
  }

  /* ── 전체 다시 그리기 ── */
  function redraw() {
    const { root, steps } = buildHuffman(freqs);
    const codes = codesOf(root);
    const total = freqs.reduce((a, f) => a + f[1], 0);
    const huffBits = freqs.reduce((a, [ch, f]) => a + f * codes[ch].length, 0);
    const asciiBits = total * 7;

    /* 합치는 과정 */
    clear(stepsBox);
    const list = h('ol', { style: { margin: '0', paddingLeft: '22px' } });
    steps.forEach((s) => list.append(h('li', { style: { marginBottom: '4px' } },
      '가장 작은 둘 ', h('b', { class: 'mono' }, s.a), ' 와(과) ', h('b', { class: 'mono' }, s.b),
      ' 를 합쳐 ', h('b', { class: 'mono' }, s.name), '(', h('b', {}, String(s.sum)), ') 를 만든다. ',
      h('span', { style: { color: 'var(--ink-soft)' } }, `남은 것: ${s.rest}`))));
    stepsBox.append(list);

    drawTree(root);

    /* 코드표 */
    clear(codeBox);
    const r1 = h('tr', {}, h('th', { class: 'left' }, '문자'));
    const r2 = h('tr', {}, h('th', { class: 'left' }, '빈도수'));
    const r3 = h('tr', {}, h('th', { class: 'left' }, '허프만 코드'));
    const r4 = h('tr', {}, h('th', { class: 'left' }, '코드 길이'));
    const r5 = h('tr', {}, h('th', { class: 'left' }, '빈도 × 길이'));
    freqs.forEach(([ch, f]) => {
      r1.append(h('td', { class: 'mono', style: { fontWeight: '800', fontSize: '1.1rem' } }, ch));
      r2.append(h('td', { class: 'mono' }, String(f)));
      r3.append(h('td', { class: 'mono', style: { fontWeight: '800', color: 'var(--accent)' } }, codes[ch]));
      r4.append(h('td', { class: 'mono' }, String(codes[ch].length)));
      r5.append(h('td', { class: 'mono' }, `${f}×${codes[ch].length}=${f * codes[ch].length}`));
    });
    r1.append(h('th', {}, '합계')); r2.append(h('th', {}, String(total)));
    r3.append(h('th', {}, '')); r4.append(h('th', {}, ''));
    r5.append(h('th', {}, comma(huffBits)));

    codeBox.append(h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' }, r1, r2, r3, r4, r5)),
      h('table', { class: 'tbl', style: { marginTop: '12px' } },
        h('tr', {}, h('th', { class: 'left', style: { width: '280px' } }, '아스키코드 (7비트 고정길이)'),
          h('td', { class: 'left mono' }, `${total} × 7 = ${comma(asciiBits)}비트`)),
        h('tr', {}, h('th', { class: 'left' }, '허프만 코드 (가변 길이)'),
          h('td', { class: 'left mono' }, `${freqs.map(([c, f]) => `${f}×${codes[c].length}`).join(' + ')} = ${comma(huffBits)}비트`)),
        h('tr', { class: 'hl' }, h('th', { class: 'left' }, '압축률 (아스키 ÷ 허프만)'),
          h('td', { class: 'left mono' }, `${comma(asciiBits)} ÷ ${comma(huffBits)} = `,
            h('b', { style: { fontSize: '1.15rem', color: 'var(--ok)' } }, (asciiBits / huffBits).toFixed(2)),
            `  (${(100 - huffBits / asciiBits * 100).toFixed(1)}% 줄었습니다)`))));

    /* 부호화·복호화 */
    clear(decodeBox);
    const encInp = h('input', { type: 'text', class: 'mono', value: freqs.map((f) => f[0]).join(''), style: { width: '220px' } });
    const encOut = h('span', { class: 'mono', style: { fontWeight: '800', color: 'var(--accent)', fontSize: '1.05rem' } });
    const doEnc = () => {
      const bad = [...encInp.value].find((c) => !(c in codes));
      encOut.textContent = bad ? `❌ '${bad}' 는 코드표에 없습니다` : [...encInp.value].map((c) => codes[c]).join(' ');
    };
    encInp.addEventListener('input', doEnc); doEnc();

    const decInp = h('input', { type: 'text', class: 'mono', value: '011010', style: { width: '220px' } });
    const decOut = h('span', { class: 'mono', style: { fontWeight: '800', color: 'var(--accent)', fontSize: '1.05rem' } });
    const doDec = () => {
      const bits = decInp.value.replace(/[^01]/g, '');
      let cur = '', out = '', ok = true;
      const inv = Object.fromEntries(Object.entries(codes).map(([c, b]) => [b, c]));
      for (const b of bits) {
        cur += b;
        if (inv[cur] !== undefined) { out += inv[cur]; cur = ''; }
        if (cur.length > 40) { ok = false; break; }
      }
      decOut.textContent = !bits ? '' : (!ok || cur) ? `${out}… ❓ 남은 비트 ${cur} 로는 글자를 만들 수 없습니다` : out;
    };
    decInp.addEventListener('input', doDec); doDec();

    decodeBox.append(
      h('div', { class: 'row', style: { marginBottom: '8px' } },
        h('label', { class: 'field', style: { width: '150px' } }, '부호화 (글자 → 비트)'), encInp, h('span', {}, '→'), encOut),
      h('div', { class: 'row' },
        h('label', { class: 'field', style: { width: '150px' } }, '복호화 (비트 → 글자)'), decInp, h('span', {}, '→'), decOut),
      note('', h('b', {}, '접두어 성질 '),
        '어떤 문자코드가 다른 문자코드의 접두어가 되면 안 됩니다. ',
        '예를 들어 a가 01이고 b가 010이면 a는 b의 앞부분과 겹쳐 구분할 수 없습니다. ',
        '허프만 트리는 글자를 모두 ', h('b', {}, '잎'), '에만 두기 때문에 이 성질이 저절로 지켜집니다 — ',
        '그래서 위 복호화 칸이 왼쪽부터 한 글자씩 정확히 잘라 낼 수 있습니다.'));
  }

  paintEdit();
  drawNow(redraw);

  return card('② 허프만 알고리즘 — 트리를 조립하고 코드를 뽑아 보기',
    h('p', {}, '각 문자의 빈도가 알려져 있는 문자열을 ', answer('압축'), '하는 데 사용합니다. ',
      '가장 많이 등장하는 글자에는 짧은 비트열을, 잘 나오지 않는 글자에는 긴 비트열을 사용하는 ',
      answer('가변'), ' 길이 코드입니다.'),
    h('div', { class: 'note', style: { marginBottom: '14px' } },
      h('b', {}, '만드는 방법 '),
      '① 가장 낮은 빈도수를 가진 두 문자 a, b를 선택하여 가상의 문자 x로 대치한다 (x의 빈도수 = a + b). ',
      '② 모든 문자가 트리에 포함될 때까지 반복한다. ',
      '③ 완성된 트리에서 각 서브 트리의 왼쪽에 0, 오른쪽에 1을 부여하여 코드를 결정한다.'),

    h('h4', { style: { marginTop: '0' } }, '문자와 빈도수 — 직접 고쳐 보세요'),
    editBox,

    h('h4', {}, '합치는 과정'),
    stepsBox,

    h('h4', {}, '완성된 허프만 트리'),
    cv,

    h('h4', {}, '허프만 코드표와 압축률'),
    codeBox,

    h('h4', {}, '직접 부호화·복호화 해 보기'),
    decodeBox,

    note('warn', h('b', {}, '해 볼 것 '),
      '[빈도가 모두 같을 때] 를 눌러 보세요. 모든 코드 길이가 비슷해져 압축 효과가 크게 줄어듭니다. ',
      '허프만은 ', h('b', {}, '특정 값의 출현 빈도가 크게 차이 날 때'), ' 효율이 좋습니다.'));
}

/* ══════════════════ ③ 두 방법 비교 ═════════════════════════════════ */

function compareCard() {
  return card('③ 런 렝스와 허프만 — 언제 무엇을 쓸까',
    h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', { style: { width: '160px' } }, '구분'), h('th', {}, '런 렝스 압축 (RLE)'), h('th', {}, '허프만 압축')),
      h('tr', {}, h('th', {}, '효율적인 경우'), h('td', {}, '동일한 데이터가 ', answer('길게 반복'), '될 때'), h('td', {}, '특정 값의 출현 ', answer('빈도가 크게 차이'), '날 때')),
      h('tr', {}, h('th', {}, '비효율적인 경우'), h('td', {}, '데이터가 자주 바뀌는 경우 (반복 거의 없음)'), h('td', {}, '모든 데이터의 빈도가 비슷한 경우')),
      h('tr', {}, h('th', {}, '코드 길이'), h('td', {}, '고정 형식 (문자 + 개수)'), h('td', {}, '가변 길이 — 자주 나오는 글자가 짧다')),
    )),
    h('h4', {}, '확인 문제'),
    quizSet([
      { q: '허프만 코드에서 가장 자주 나오는 글자의 코드 길이는?',
        type: 'choice', choices: ['가장 짧다', '가장 길다', '모두 같다'],
        answer: '가장 짧다',
        explain: '자주 나오는 글자를 짧게 만들어야 전체 비트 수가 줄어듭니다.' },
      { q: '학습지 예제(a12 b40 c15 d8 e25)에서 허프만 코드 011010 을 복호화하면?',
        answer: 'bce', width: 150,
        hint: 'b=0, e=10, c=110, d=1110, a=1111. 왼쪽부터 잘라 보세요.',
        explain: '0 | 110 | 10 → b, c, e 이므로 「bce」 입니다.' },
      { q: '학습지 예제에서 문자열 X를 허프만 코드로 표현하면 총 몇 비트인가?',
        answer: ['215', '215비트'], unit: '비트', width: 130,
        hint: '빈도 × 코드 길이를 모두 더합니다.',
        explain: '12×4 + 40×1 + 15×3 + 8×4 + 25×2 = 48 + 40 + 45 + 32 + 50 = 215비트' },
      { q: '위 문자열을 아스키코드(7비트 고정)로 표현하면 700비트다. 압축률은? (소수 둘째 자리까지)',
        answer: ['3.26', '3.3'], width: 130,
        hint: '압축률 = 원본 크기 ÷ 압축된 크기',
        explain: '700 ÷ 215 = 3.2558… ≒ 3.26. 즉 약 1/3 크기로 줄었습니다.' },
      { q: '데이터가 「ABABABABAB」 일 때 런 렝스 압축을 하면 어떻게 될까?',
        type: 'choice', choices: ['크게 줄어든다', '오히려 커진다', '변화 없다'],
        answer: '오히려 커진다',
        hint: '위 ① 실험실에 직접 넣어 보세요.',
        explain: 'A1B1A1B1A1B1A1B1A1B1 → 20바이트. 원본 10바이트의 두 배가 됩니다.' },
    ], { revealOnWrong: true }));
}
