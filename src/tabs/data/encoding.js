/* ============================================================================
 * encoding.js — 학습지 ⑨ 문자·이미지·소리 정보의 부호화
 *   ① 문자 : 글자를 치면 아스키코드 비트열이 그대로 나온다
 *   ② 이미지 : 픽셀을 직접 칠하고 색 깊이를 바꿔 파일 크기를 계산한다
 *   ③ 소리 : 표본화 주기와 양자화 단계를 밀어 원래 소리와 얼마나 달라지는지 본다
 *
 * © 2026 티쳐무 · 모든 권리 보유
 *
 * 무단 배포 및 상업적 이용을 금합니다. 학교 수업 목적으로만 이용해 주세요.
 * 그 밖의 이용(재배포·2차 저작물·수업 외 목적)은 먼저 문의해 주세요.
 * 오픈소스 라이선스를 붙이지 않았습니다 — 자세한 내용은 LICENSE 파일을 보세요.
 * ========================================================================== */

import { h, card, sheetHead, note, answer, quizSet, clear, comma, drawNow } from '../../lib/ui.js';

export function render(root) {
  root.append(...sheetHead('학습지 ⑨', 'Ⅱ-1. 데이터 압축과 암호화 — 부호화와 복호화',
    ['[12정02-01] 선수 개념'],
    ['문자, 이미지, 소리 정보의 부호화 원리를 이해할 수 있다.']));

  root.append(card('부호화와 복호화',
    h('p', {}, '컴퓨터 내부에서는 숫자, 문자, 이미지, 소리, 동영상 등 ',
      h('b', {}, '모든 자료를 약속된 방법으로 0과 1의 코드(부호, code)로 표현'), '합니다.'),
    h('div', { class: 'grid2' },
      h('div', { class: 'note' },
        h('b', {}, answer('부호화'), ' (인코딩, encoding)'), h('br', {}),
        '사용자가 입력한 문자나 기호들을 컴퓨터가 이용할 수 있는 신호로 만드는 것. 데이터를 압축하는 과정을 포함하기도 함'),
      h('div', { class: 'note ok' },
        h('b', {}, answer('복호화'), ' (디코딩, decoding)'), h('br', {}),
        '부호화된 정보를 부호화되기 전으로 돌리는 처리. 부호화된 디지털 값을 원래의 정보로 변환하기 위해 필요'))));

  root.append(textCard());
  root.append(imageCard());
  root.append(soundCard());
}

/* ══════════════════ ① 문자 정보의 부호화 ════════════════════════════ */

function textCard() {
  const inp = h('input', {
    type: 'text', value: 'Hello!', style: { width: '300px', fontSize: '1.1rem' }, oninput: draw,
  });
  const out = h('div', { class: 'scroll-x' });
  const sumBox = h('div', {});

  function draw() {
    const s = inp.value;
    clear(out); clear(sumBox);
    if (!s) return;

    const chars = [...s];
    const tbl = h('table', { class: 'tbl' },
      h('tr', {}, h('th', { class: 'left' }, '문자'),
        ...chars.map((c) => h('th', {}, c === ' ' ? '(공백)' : c))),
      h('tr', {}, h('th', { class: 'left' }, '10진 코드'),
        ...chars.map((c) => h('td', { class: 'mono' }, String(c.codePointAt(0))))),
      h('tr', {}, h('th', { class: 'left' }, '아스키 7비트'),
        ...chars.map((c) => {
          const cp = c.codePointAt(0);
          return h('td', { class: 'mono', style: { fontSize: '0.86rem' } },
            cp < 128 ? cp.toString(2).padStart(7, '0') : h('span', { style: { color: 'var(--bad)' } }, '범위 밖'));
        })),
      h('tr', {}, h('th', { class: 'left' }, '유니코드 16진'),
        ...chars.map((c) => h('td', { class: 'mono' }, 'U+' + c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')))),
    );
    out.append(tbl);

    const ascii = chars.filter((c) => c.codePointAt(0) < 128).length;
    const wide = chars.length - ascii;
    sumBox.append(
      h('div', { class: 'note ok', style: { marginTop: '12px' } },
        `글자 수 ${chars.length}개 → 아스키코드(7비트 고정)로 표현하면 `,
        h('b', {}, `${chars.length} × 7 = ${comma(chars.length * 7)}비트`),
        wide ? h('span', {}, ` (단, 한글 등 ${wide}자는 아스키 범위 밖이라 유니코드가 필요합니다)`) : null),
      wide ? note('warn',
        '한글 「가」 하나는 아스키코드로 표현할 수 없습니다. 전 세계 언어를 함께 담으려고 만든 것이 ',
        h('b', {}, '유니코드'), '이고, 16비트 이상을 씁니다.') : null,
    );
  }
  draw();

  /* 아스키 표 (출력 가능한 문자) */
  const asciiTable = () => {
    const rows = [];
    for (let base = 32; base < 127; base += 16) {
      const cells = [];
      for (let i = 0; i < 16 && base + i < 127; i++) {
        const cp = base + i;
        cells.push(h('td', {
          style: { cursor: 'pointer', padding: '3px 5px' },
          title: `${cp} = ${cp.toString(2).padStart(7, '0')}`,
          onclick: () => { inp.value += String.fromCharCode(cp); draw(); },
        },
          h('div', { style: { fontWeight: '800', fontSize: '1.05rem' } }, cp === 32 ? '␣' : String.fromCharCode(cp)),
          h('div', { style: { fontSize: '0.72rem', color: 'var(--ink-soft)', fontFamily: 'var(--mono)' } }, String(cp))));
      }
      rows.push(h('tr', {}, ...cells));
    }
    return h('table', { class: 'tbl' }, ...rows);
  };

  return card('① 문자 정보의 부호화 — 아스키코드',
    h('p', {}, h('b', {}, '아스키코드'), ' (ASCII, ', answer('American Standard'), ' Code for Information Interchange) — ',
      '영문 ', answer('대소문자'), ', ', answer('숫자'), ', ', answer('특수기호'), ' 등을 표현하기 위하여 ',
      h('b', {}, '고정길이 7비트'), '를 활용하는 표준코드. ',
      '33개의 출력 불가능한 제어 문자와 공백을 비롯한 95개의 출력 가능한 문자 등 ', h('b', {}, '총 128개'), ' 문자를 표현합니다.'),
    h('p', {}, h('b', {}, '유니코드'), ' (Unicode) — 전 세계의 언어를 동시에 표현하기 위하여 16개 이상의 비트를 활용하는 표준코드'),

    h('div', { class: 'row', style: { margin: '14px 0 10px' } },
      h('label', { class: 'field' }, '글자를 쳐 보세요'), inp,
      h('button', { type: 'button', class: 'btn gray small', onclick: () => { inp.value = ''; draw(); } }, '지우기')),
    out, sumBox,

    h('h4', {}, '아스키코드 표 — 글자를 누르면 위 칸에 붙습니다'),
    h('div', { class: 'scroll-x' }, asciiTable()));
}

/* ══════════════════ ② 이미지 정보의 부호화 ═════════════════════════ */

const DEPTHS = [
  { bits: 1, name: '흑백 (1비트)', colors: ['#ffffff', '#000000'] },
  { bits: 2, name: '4단계 회색 (2비트)', colors: ['#ffffff', '#aaaaaa', '#555555', '#000000'] },
  { bits: 3, name: '8색 (3비트)', colors: ['#ffffff', '#ff0000', '#ff8800', '#ffdd00', '#22aa44', '#2277dd', '#8844cc', '#000000'] },
  { bits: 8, name: '256색 (8비트)', colors: null },
  { bits: 24, name: '트루컬러 (24비트)', colors: null },
];

function imageCard() {
  let size = 16;
  let depthIdx = 0;
  let color = 1;
  let grid = new Array(size * size).fill(0);

  const cv = h('canvas', { class: 'stage', style: { aspectRatio: '1 / 1', maxWidth: '360px', cursor: 'crosshair' } });
  const zoomCv = h('canvas', { class: 'stage', style: { aspectRatio: '1 / 1', maxWidth: '360px' } });
  const paletteBox = h('div', { class: 'row tight', style: { margin: '10px 0' } });
  const sizeBox = h('div', {});

  const depth = () => DEPTHS[depthIdx];
  const palette = () => depth().colors || DEPTHS[2].colors;

  function draw() {
    const px = 360;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    [cv, zoomCv].forEach((c) => { c.width = px * dpr; c.height = px * dpr; });
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, px, px);
    const cell = px / size;
    const pal = palette();

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        ctx.fillStyle = pal[grid[y * size + x] % pal.length];
        ctx.fillRect(x * cell, y * cell, cell, cell);
      }
    }
    // 격자
    ctx.strokeStyle = 'rgba(120,140,170,.35)'; ctx.lineWidth = 1;
    for (let i = 0; i <= size; i++) {
      ctx.beginPath(); ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, px); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * cell); ctx.lineTo(px, i * cell); ctx.stroke();
    }

    // 확대해 보기 — 가운데 1/4 을 4배로 (계단현상 확인)
    const z = zoomCv.getContext('2d');
    z.setTransform(dpr, 0, 0, dpr, 0, 0);
    z.imageSmoothingEnabled = false;
    z.clearRect(0, 0, px, px);
    const half = Math.max(2, Math.floor(size / 4));
    const ox = Math.floor((size - half) / 2), oy = Math.floor((size - half) / 2);
    const zc = px / half;
    for (let y = 0; y < half; y++) {
      for (let x = 0; x < half; x++) {
        z.fillStyle = pal[grid[(oy + y) * size + (ox + x)] % pal.length];
        z.fillRect(x * zc, y * zc, zc, zc);
      }
    }
    z.strokeStyle = 'rgba(207,48,48,.5)'; z.lineWidth = 2;
    z.strokeRect(1, 1, px - 2, px - 2);

    drawSizeInfo();
  }

  function drawSizeInfo() {
    clear(sizeBox);
    const bits = size * size * depth().bits;
    const bytes = Math.ceil(bits / 8);
    sizeBox.append(h('table', { class: 'tbl' },
      h('tr', {}, h('th', { class: 'left' }, '해상도 (가로 픽셀 수 × 세로 픽셀 수)'), h('td', { class: 'mono' }, `${size} × ${size} = ${comma(size * size)}픽셀`)),
      h('tr', {}, h('th', { class: 'left' }, '픽셀 하나에 쓰는 비트'), h('td', { class: 'mono' }, `${depth().bits}비트 → 색 ${comma(2 ** depth().bits)}가지`)),
      h('tr', {}, h('th', { class: 'left' }, '전체 크기'), h('td', { class: 'mono' },
        `${comma(size * size)} × ${depth().bits} = ${comma(bits)}비트 = ${comma(bytes)}바이트`)),
      h('tr', { class: 'hl' }, h('th', { class: 'left' }, '만약 1920 × 1080 사진이라면'), h('td', { class: 'mono' },
        `1920 × 1080 × ${depth().bits}비트 = ${comma(Math.round(1920 * 1080 * depth().bits / 8 / 1024 / 1024 * 100) / 100)}MB`)),
    ));
  }

  function paintPalette() {
    clear(paletteBox);
    const pal = palette();
    paletteBox.append(h('span', { class: 'chip' }, '색'));
    pal.forEach((c, i) => {
      paletteBox.append(h('button', {
        type: 'button',
        style: {
          width: '34px', height: '34px', borderRadius: '8px', cursor: 'pointer',
          background: c, border: color === i ? '3px solid var(--accent)' : '2px solid #b9c3d1',
        },
        onclick: () => { color = i; paintPalette(); },
      }));
    });
  }

  /* 그리기 */
  let painting = false;
  const paintAt = (ev) => {
    const r = cv.getBoundingClientRect();
    const x = Math.floor(((ev.clientX - r.left) / r.width) * size);
    const y = Math.floor(((ev.clientY - r.top) / r.height) * size);
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    grid[y * size + x] = color;
    draw();
  };
  cv.addEventListener('pointerdown', (e) => { painting = true; cv.setPointerCapture(e.pointerId); paintAt(e); });
  cv.addEventListener('pointermove', (e) => { if (painting) paintAt(e); });
  cv.addEventListener('pointerup', () => { painting = false; });

  const sizeSel = h('select', {
    onchange: () => {
      size = Number(sizeSel.value);
      grid = new Array(size * size).fill(0);
      draw();
    },
  }, ...[8, 16, 32, 64].map((n) => h('option', { value: n, selected: n === 16 }, `${n} × ${n}`)));

  const depthSel = h('select', {
    onchange: () => {
      depthIdx = Number(depthSel.value);
      color = Math.min(color, palette().length - 1);
      paintPalette(); draw();
    },
  }, ...DEPTHS.map((d, i) => h('option', { value: i, selected: i === 0 }, d.name)));

  paintPalette();
  drawNow(draw);

  return card('② 이미지 정보의 부호화 — 직접 칠하고 크기를 계산해 보기',
    h('div', { class: 'scroll-x', style: { marginBottom: '16px' } }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', {}, '항목'), h('th', {}, '래스터 그래픽 방식 = ', answer('비트맵'), ' 방식'), h('th', {}, answer('벡터'), ' 그래픽 방식')),
      h('tr', {}, h('th', {}, '이미지 구성'), h('td', {}, '픽셀로 구성 ／ ', answer('해상도'), ' = 가로 픽셀 수 × 세로 픽셀 수'), h('td', {}, '수학적 계산을 통한 선과 곡선')),
      h('tr', {}, h('th', {}, '응용 분야'), h('td', {}, '사진, 디지털 아트, 웹 이미지 — 복잡한 이미지에 적합'), h('td', {}, '로고, 아이콘, 일러스트 — 단순하고 선명한 이미지에 적합')),
      h('tr', {}, h('th', {}, '파일 크기'), h('td', {}, '이미지 크기에 따라 파일 크기 증가'), h('td', {}, '이미지 복잡도에 따라 파일 크기 결정')),
      h('tr', {}, h('th', {}, '대표적인 파일 형식'), h('td', {}, 'BMP, PNG, GIF, JPEG'), h('td', {}, 'SVG')),
      h('tr', {}, h('th', {}, '이미지 확대 시'), h('td', {}, '화질 저하 및 ', h('b', {}, '계단현상'), ' 발생'), h('td', {}, '화질 손실 없음')),
    )),

    h('div', { class: 'row', style: { marginBottom: '4px' } },
      h('label', { class: 'field' }, '해상도'), sizeSel,
      h('label', { class: 'field' }, '색 깊이'), depthSel,
      h('span', { class: 'spacer' }),
      h('button', { type: 'button', class: 'btn gray small', onclick: () => { grid.fill(0); draw(); } }, '전부 지우기')),
    paletteBox,

    h('div', { class: 'grid2' },
      h('div', {}, h('h4', { style: { marginTop: '0' } }, '픽셀을 눌러 칠해 보세요'), cv),
      h('div', {}, h('h4', { style: { marginTop: '0' } }, '가운데를 확대하면 — 계단현상'), zoomCv)),

    h('h4', {}, '이 그림의 크기는 얼마일까'),
    sizeBox,
    note('warn', h('b', {}, '해 볼 것 '),
      '같은 그림을 그려 놓고 색 깊이를 「흑백(1비트)」 → 「트루컬러(24비트)」 로 바꿔 보세요. ',
      '픽셀 수는 그대로인데 파일 크기가 24배가 됩니다. 사진 파일이 큰 이유가 이것입니다.'));
}

/* ══════════════════ ③ 소리 정보의 부호화 ═══════════════════════════ */

function soundCard() {
  let rate = 20;     // 표본화 — 한 화면에 몇 개의 표본을 찍을까
  let bits = 3;      // 양자화 — 몇 비트로 단계를 나눌까

  const cv = h('canvas', { class: 'stage', style: { aspectRatio: '5 / 2' } });
  const info = h('div', {});
  const codeBox = h('div', { class: 'console', style: { maxHeight: '120px', marginTop: '10px' } });

  const wave = (x) => Math.sin(x * Math.PI * 2 * 1.5) * 0.55 + Math.sin(x * Math.PI * 2 * 3.7) * 0.25;

  function draw() {
    const W = 1000, H = 400;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = cv.clientWidth || W;
    cv.width = Math.round(cw * dpr); cv.height = Math.round(cw * dpr * H / W);
    const ctx = cv.getContext('2d');
    const s = cv.width / W;
    ctx.setTransform(s, 0, 0, s, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const levels = 2 ** bits;
    const pad = 30;
    const toY = (v) => H / 2 - v * (H / 2 - pad);

    // 양자화 눈금
    ctx.strokeStyle = '#e7ecf4'; ctx.lineWidth = 1;
    ctx.font = '11px var(--mono, monospace)'; ctx.fillStyle = '#9aa5b4'; ctx.textAlign = 'left';
    for (let i = 0; i < levels; i++) {
      const v = -1 + (2 * i) / (levels - 1);
      const y = toY(v);
      ctx.beginPath(); ctx.moveTo(46, y); ctx.lineTo(W, y); ctx.stroke();
      if (levels <= 16) ctx.fillText(i.toString(2).padStart(bits, '0'), 6, y + 4);
    }

    // 아날로그 원본
    ctx.beginPath();
    for (let px = 0; px <= W; px++) {
      const y = toY(wave(px / W));
      px ? ctx.lineTo(px, y) : ctx.moveTo(px, y);
    }
    ctx.strokeStyle = '#9aa5b4'; ctx.lineWidth = 2.5; ctx.stroke();

    // 표본화 + 양자화
    const samples = [];
    for (let i = 0; i <= rate; i++) {
      const x = i / rate;
      const raw = wave(x);
      const q = Math.round(((raw + 1) / 2) * (levels - 1));
      samples.push({ x: x * W, raw, q, v: -1 + (2 * q) / (levels - 1) });
    }

    // 계단 (양자화 결과)
    ctx.beginPath();
    samples.forEach((sp, i) => {
      const nx = i < samples.length - 1 ? samples[i + 1].x : W;
      const y = toY(sp.v);
      ctx.lineTo(sp.x, y); ctx.lineTo(nx, y);
    });
    ctx.strokeStyle = '#0f9d6e'; ctx.lineWidth = 3; ctx.stroke();

    // 표본 점 + 오차 막대
    samples.forEach((sp) => {
      ctx.beginPath();
      ctx.moveTo(sp.x, toY(sp.raw)); ctx.lineTo(sp.x, toY(sp.v));
      ctx.strokeStyle = 'rgba(207,48,48,.6)'; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.arc(sp.x, toY(sp.raw), 4, 0, Math.PI * 2);
      ctx.fillStyle = '#cf3030'; ctx.fill();
    });

    // 오차 크기 계산
    const err = samples.reduce((a, sp) => a + Math.abs(sp.raw - sp.v), 0) / samples.length;

    clear(info);
    info.append(h('table', { class: 'tbl' },
      h('tr', {}, h('th', { class: 'left', style: { width: '210px' } }, '① 표본화 (샘플링)'),
        h('td', { class: 'left' }, `한 구간을 ${rate}번 찍었습니다. 간격이 좁을수록 본래의 소리에 가까워집니다. `,
          h('span', { class: 'chip' }, '정보 손실 O'))),
      h('tr', {}, h('th', { class: 'left' }, '② 양자화'),
        h('td', { class: 'left' }, `${bits}비트 → ${comma(2 ** bits)}단계로 나누었습니다. 빨간 선이 버려진 값(오차)입니다. `,
          h('span', { class: 'chip' }, '정보 손실 O'))),
      h('tr', {}, h('th', { class: 'left' }, '③ 부호화'),
        h('td', { class: 'left' }, '양자화된 값을 이진코드로 바꿉니다. 값을 그대로 옮겨 적을 뿐입니다. ',
          h('span', { class: 'chip' }, '정보 손실 X'))),
      h('tr', { class: 'hl' }, h('th', { class: 'left' }, '평균 오차'),
        h('td', { class: 'left mono' }, err.toFixed(4), ' (0에 가까울수록 원음에 가깝다)')),
      h('tr', {}, h('th', { class: 'left' }, '자료 크기'),
        h('td', { class: 'left mono' }, `${rate + 1}개 표본 × ${bits}비트 = ${comma((rate + 1) * bits)}비트`)),
      h('tr', {}, h('th', { class: 'left' }, 'CD 음질이라면'),
        h('td', { class: 'left mono' },
          `44,100Hz × 16비트 × 2채널 × 60초 = ${comma(Math.round(44100 * 16 * 2 * 60 / 8 / 1024 / 1024 * 10) / 10)}MB (1분)`)),
    ));

    clear(codeBox);
    codeBox.append(h('div', { class: 'muted' }, '③ 부호화 결과 (앞에서부터)'));
    codeBox.append(h('div', {}, samples.slice(0, 40).map((sp) => sp.q.toString(2).padStart(bits, '0')).join(' ')
      + (samples.length > 40 ? ' …' : '')));
  }

  const rateInp = h('input', {
    type: 'range', min: 4, max: 120, value: rate, style: { flex: '1', minWidth: '160px' },
    oninput: () => { rate = Number(rateInp.value); rateOut.textContent = `${rate}회`; draw(); },
  });
  const rateOut = h('b', { class: 'big-num', style: { fontSize: '1.05rem' } }, `${rate}회`);

  const bitsInp = h('input', {
    type: 'range', min: 1, max: 8, value: bits, style: { flex: '1', minWidth: '160px' },
    oninput: () => { bits = Number(bitsInp.value); bitsOut.textContent = `${bits}비트 (${2 ** bits}단계)`; draw(); },
  });
  const bitsOut = h('b', { class: 'big-num', style: { fontSize: '1.05rem' } }, `${bits}비트 (${2 ** bits}단계)`);

  drawNow(draw);
  window.addEventListener('resize', draw);

  return card('③ 소리 정보의 부호화 — 웨이브(wav) 방식',
    h('p', { class: 'lead' }, '회색 곡선이 원래의 소리(아날로그), 초록 계단이 컴퓨터에 저장되는 값입니다. ',
      '빨간 선의 길이가 버려진 정보의 양입니다.'),
    h('div', { class: 'grid2', style: { marginBottom: '10px' } },
      h('div', { class: 'row' }, h('label', { class: 'field' }, '① 표본화 — 몇 번 찍을까'), rateInp, rateOut),
      h('div', { class: 'row' }, h('label', { class: 'field' }, '② 양자화 — 몇 단계로'), bitsInp, bitsOut)),
    cv,
    codeBox,
    h('h4', {}, '3단계 과정과 정보 손실'),
    info,
    note('warn', h('b', {}, '해 볼 것 '),
      '두 막대를 모두 최소로 내려 보세요. 계단이 원래 소리와 완전히 달라집니다. ',
      '그 다음 둘 다 최대로 올려 보세요 — 원음에 가까워지지만 자료 크기가 크게 늘어납니다. ',
      '음질과 파일 크기는 항상 맞바꾸는 관계입니다.'),

    h('h4', {}, '확인 문제'),
    quizSet([
      { q: '소리를 디지털로 바꾸는 3단계를 순서대로 쓰면?',
        type: 'choice', choices: ['부호화 → 표본화 → 양자화', '표본화 → 양자화 → 부호화', '양자화 → 표본화 → 부호화'],
        answer: '표본화 → 양자화 → 부호화',
        explain: '① 표본화(시간을 끊는다) → ② 양자화(값을 단계로 끊는다) → ③ 부호화(이진코드로 적는다)' },
      { q: '3단계 중 정보 손실이 일어나지 않는 단계는?',
        type: 'choice', choices: ['표본화', '양자화', '부호화'],
        answer: '부호화',
        hint: '이미 정해진 값을 다른 표기법으로 옮겨 적기만 하는 단계는 어디일까요?',
        explain: '부호화는 양자화된 값을 이진코드로 바꾸어 적을 뿐이므로 손실이 없습니다. 표본화와 양자화는 둘 다 손실이 있습니다.' },
      { q: '표본화 주기(찍는 간격)를 좁게 하면 어떻게 될까?',
        type: 'choice', choices: ['원음에 가까워지고 파일이 커진다', '원음에서 멀어지고 파일이 작아진다', '아무 변화 없다'],
        answer: '원음에 가까워지고 파일이 커진다',
        explain: '간격이 좁을수록 본래의 소리에 가까워지지만, 표본 개수가 늘어 자료 크기도 커집니다.' },
      { q: '해상도 1920×1080 사진을 트루컬러(24비트)로 저장하면 몇 바이트인가? (압축 없음)',
        answer: [String(1920 * 1080 * 3), comma(1920 * 1080 * 3)], unit: '바이트', width: 170,
        hint: '가로 × 세로 × (비트 수 ÷ 8) 로 계산합니다.',
        explain: `1920 × 1080 × 24비트 = ${comma(1920 * 1080 * 24)}비트 = ${comma(1920 * 1080 * 3)}바이트 ≒ ${(1920 * 1080 * 3 / 1024 / 1024).toFixed(1)}MB` },
    ], { revealOnWrong: true }));
}
