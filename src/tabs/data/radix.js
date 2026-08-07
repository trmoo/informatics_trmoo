/* ============================================================================
 * radix.js — 학습지 ⑦ 수치 정보의 디지털 표현 (진수 변환)
 *   ① 네 가지 진법을 한 화면에서 동시에 보고
 *   ② 자릿값 전개식으로 왜 그 값인지 확인하고
 *   ③ 반복 나눗셈 과정을 한 줄씩 따라가고
 *   ④ 2진수를 3비트·4비트로 끊어 8진수·16진수로 바꾸는 것을 눈으로 본다.
 *
 * © 2026 티쳐무 · 모든 권리 보유
 *
 * 무단 배포 및 상업적 이용을 금합니다. 학교 수업 목적으로만 이용해 주세요.
 * 그 밖의 이용(재배포·2차 저작물·수업 외 목적)은 먼저 문의해 주세요.
 * 오픈소스 라이선스를 붙이지 않았습니다 — 자세한 내용은 LICENSE 파일을 보세요.
 * ========================================================================== */

import { h, card, sheetHead, note, answer, quizSet, clear, comma, randInt, pick, bitRow } from '../../lib/ui.js';

const DIGITS = '0123456789ABCDEF';
const sup = (n) => String(n).replace(/[0-9]/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]);

export function render(root) {
  root.append(...sheetHead('학습지 ⑦', 'Ⅱ-1. 데이터 압축과 암호화 — 디지털 데이터 표현 방법',
    ['[12정02-01] 선수 개념'],
    ['수치 정보의 디지털 표현 원리를 이해할 수 있다.']));

  root.append(tableCard());
  root.append(converterCard());
  root.append(divisionCard());
  root.append(splitCard());
  root.append(practiceCard());
}

/* ══════════════════ ① 0~15 대응표 (직접 채우기) ═════════════════════ */

function tableCard() {
  const mk = (from, to) => {
    const rows = [h('tr', {}, h('th', {}, '10진수'), h('th', {}, '2진수'), h('th', {}, '8진수'), h('th', {}, '16진수'))];
    for (let d = from; d <= to; d++) {
      rows.push(h('tr', {},
        h('th', {}, String(d)),
        cell(d.toString(2).padStart(4, '0'), 4),
        cell(d.toString(8), 3),
        cell(d.toString(16).toUpperCase(), 3)));
    }
    return h('table', { class: 'tbl' }, ...rows);
  };

  const cell = (correct, width) => {
    const inp = h('input', {
      type: 'text', class: 'mono',
      style: { width: width * 18 + 'px', textAlign: 'center', padding: '4px 6px' },
      oninput: () => {
        const v = inp.value.trim().toUpperCase().replace(/^0+(?=.)/, '');
        const c = correct.replace(/^0+(?=.)/, '');
        inp.style.borderColor = !v ? 'var(--line)' : v === c ? 'var(--ok)' : 'var(--bad)';
      },
    });
    return h('td', {}, inp);
  };

  const fill = (on) => {
    holder.querySelectorAll('input').forEach((i) => { i.value = ''; i.style.borderColor = 'var(--line)'; });
    if (!on) return;
    // 정답 채우기
    const tables = holder.querySelectorAll('table');
    let d = 0;
    tables.forEach((t) => {
      [...t.querySelectorAll('tr')].slice(1).forEach((tr) => {
        const [b, o, x] = [...tr.querySelectorAll('input')];
        b.value = d.toString(2).padStart(4, '0');
        o.value = d.toString(8);
        x.value = d.toString(16).toUpperCase();
        [b, o, x].forEach((i) => { i.style.borderColor = 'var(--ok)'; });
        d++;
      });
    });
  };

  const holder = h('div', { class: 'grid2' }, mk(0, 7), mk(8, 15));

  return card('① 진수의 종류 — 0부터 15까지 직접 채워 보기',
    h('p', {}, '▶ ', h('b', {}, '10진수'), ': 0~9 (10개) / ',
      h('b', {}, '2진수'), ': 0, 1 (2개) / ',
      h('b', {}, '8진수'), ': 0~7 (8개) / ',
      h('b', {}, '16진수'), ': 0~9, A~F (16개) 를 이용하여 수를 표현합니다. ',
      '수의 진법은 ', h('b', {}, '밑(base)'), '으로 표현하고, 십진수의 밑은 보통 생략합니다.'),
    h('p', { class: 'lead' }, '칸에 답을 쓰면 바로 맞았는지 테두리 색으로 알려 줍니다. (2진수는 네 자리로)'),
    holder,
    h('div', { class: 'row', style: { marginTop: '12px' } },
      h('button', { type: 'button', class: 'btn ghost', onclick: () => fill(true) }, '정답 채우기'),
      h('button', { type: 'button', class: 'btn gray', onclick: () => fill(false) }, '전부 지우기')));
}

/* ══════════════════ ② 네 진법 동시 변환기 ═══════════════════════════ */

function converterCard() {
  let value = 27;
  const inputs = {};
  const expandBox = h('div', {});
  const bitsBox = h('div', { style: { marginTop: '12px' } });

  const BASES = [[10, '10진수'], [2, '2진수'], [8, '8진수'], [16, '16진수']];

  function setAll(from) {
    for (const [b] of BASES) {
      if (b === from) continue;
      inputs[b].value = value.toString(b).toUpperCase();
      inputs[b].style.borderColor = 'var(--line)';
    }
    drawExpand();
    drawBits();
  }

  function drawExpand() {
    clear(expandBox);
    for (const [b, name] of BASES) {
      if (b === 10) continue;
      const s = value.toString(b).toUpperCase();
      const terms = [...s].map((c, i) => {
        const p = s.length - 1 - i;
        return `${DIGITS.indexOf(c)}×${b}${sup(p)}`;
      });
      const nums = [...s].map((c, i) => DIGITS.indexOf(c) * b ** (s.length - 1 - i));
      expandBox.append(h('div', {
        style: { fontFamily: 'var(--mono)', fontSize: '1.02rem', padding: '7px 0', borderBottom: '1px solid var(--line-soft)' },
      },
        h('b', {}, `${s}₍${b}₎`), ' = ', terms.join(' + '),
        ' = ', nums.join(' + '), ' = ', h('b', { style: { color: 'var(--accent)' } }, comma(value))));
    }
  }

  function drawBits() {
    clear(bitsBox);
    if (value > 255) { bitsBox.append(h('span', { class: 'chip' }, '카드는 8비트(255)까지만 그립니다')); return; }
    const br = bitRow(8, {
      value, onChange: (v) => { value = v; inputs[10].value = String(v); setAll(-1); },
    });
    bitsBox.append(h('p', { style: { margin: '0 0 6px', color: 'var(--ink-soft)' } },
      '카드를 눌러 뒤집으면 위의 숫자들이 함께 바뀝니다.'), br.el);
  }

  const fields = BASES.map(([b, name]) => {
    const inp = h('input', {
      type: 'text', class: 'mono', value: value.toString(b).toUpperCase(),
      style: { width: b === 2 ? '210px' : '130px', fontSize: '1.15rem', fontWeight: '800' },
      oninput: () => {
        const raw = inp.value.trim().toUpperCase();
        const ok = raw !== '' && [...raw].every((c) => DIGITS.indexOf(c) >= 0 && DIGITS.indexOf(c) < b);
        inp.style.borderColor = ok ? 'var(--ok)' : 'var(--bad)';
        if (!ok) return;
        const v = parseInt(raw, b);
        if (!Number.isFinite(v) || v > 1e9) return;
        value = v;
        setAll(b);
      },
    });
    inputs[b] = inp;
    return h('div', { class: 'row', style: { marginBottom: '7px' } },
      h('span', { style: { width: '78px', fontWeight: '800' } }, name), inp);
  });

  drawExpand(); drawBits();

  return card('② 진법 변환기 — 네 가지를 한꺼번에',
    h('p', { class: 'lead' }, '아무 칸에나 숫자를 쓰면 나머지 세 칸이 함께 바뀝니다. 아래에 왜 그 값인지 전개식이 나옵니다.'),
    h('div', { class: 'grid2' },
      h('div', {}, fields,
        h('div', { class: 'row tight', style: { marginTop: '8px' } },
          h('span', { class: 'chip' }, '예제'),
          [1365, 27, 53, 854, 255, 4095].map((v) => h('button', {
            type: 'button', class: 'btn ghost small',
            onclick: () => { value = v; inputs[10].value = String(v); setAll(10); },
          }, String(v))))),
      h('div', {}, h('h4', { style: { marginTop: '0' } }, '자릿값 전개'), expandBox)),
    bitsBox);
}

/* ══════════════════ ③ 반복 N분법 (나눗셈 과정) ══════════════════════ */

function divisionCard() {
  const numInp = h('input', { type: 'number', value: 53, min: 0, max: 100000, style: { width: '120px' }, oninput: draw });
  const baseSel = h('select', { onchange: draw },
    ...[2, 8, 16].map((b) => h('option', { value: b }, `${b}진수로`)));
  const out = h('div', {});

  function draw() {
    const n0 = Math.max(0, Math.floor(Number(numInp.value) || 0));
    const b = Number(baseSel.value);
    clear(out);
    if (n0 === 0) { out.append(h('p', {}, '0은 그대로 0입니다.')); return; }

    const rows = [];
    let n = n0;
    while (n > 0) { rows.push([n, Math.floor(n / b), n % b]); n = Math.floor(n / b); }

    const tbl = h('table', { class: 'tbl', style: { maxWidth: '520px' } },
      h('tr', {}, h('th', {}, '단계'), h('th', {}, `${b} ) 나누어지는 수`), h('th', {}, '몫'), h('th', {}, '나머지')));
    rows.forEach(([cur, q, r], i) => {
      tbl.append(h('tr', { class: q === 0 ? 'hl' : '' },
        h('td', {}, `${i + 1}`),
        h('td', { class: 'mono' }, comma(cur)),
        h('td', { class: 'mono' }, comma(q)),
        h('td', { class: 'mono', style: { fontWeight: '800', color: 'var(--accent)', fontSize: '1.15rem' } },
          DIGITS[r])));
    });

    const digits = rows.map((r) => DIGITS[r[2]]).reverse().join('');
    out.append(tbl,
      h('div', { class: 'note ok', style: { marginTop: '12px' } },
        '가장 나중에 나온 나머지부터 거꾸로 읽으면 → ',
        h('b', { class: 'mono', style: { fontSize: '1.3rem' } }, digits),
        h('sub', {}, `(${b})`),
        ' ／ 확인: ', h('span', { class: 'mono' }, `${comma(n0)}₍₁₀₎ = ${digits}₍${b}₎`)),
      h('div', { style: { marginTop: '8px', color: 'var(--ink-soft)' } },
        '① 십진수를 ', h('b', {}, `${b}`), '(으)로 나누고 나머지를 기록한다 → ② 몫이 0이 될 때까지 반복한다 → ',
        '③ 가장 나중의 나머지부터 순서대로 나열한다.'));
  }
  draw();

  return card('③ 반복 N분법 — 나눗셈 과정을 한 줄씩',
    h('div', { class: 'row', style: { marginBottom: '12px' } },
      h('label', { class: 'field' }, '십진수'), numInp, baseSel,
      h('span', { class: 'spacer' }),
      h('span', { class: 'chip' }, '학습지 예제'),
      [[53, 2], [854, 8], [27, 2], [59, 8], [408, 8]].map(([v, b]) =>
        h('button', {
          type: 'button', class: 'btn ghost small',
          onclick: () => { numInp.value = v; baseSel.value = b; draw(); },
        }, `${v} → ${b}진수`))),
    out);
}

/* ══════════════════ ④ 비트 분할 (2 ↔ 8·16진수) ═══════════════════════ */

function splitCard() {
  const inp = h('input', {
    type: 'text', class: 'mono', value: '10110101001100',
    style: { width: '340px', fontSize: '1.1rem' }, oninput: draw,
  });
  const groupSel = h('select', { onchange: draw },
    h('option', { value: '3' }, '3비트씩 → 8진수'),
    h('option', { value: '4' }, '4비트씩 → 16진수'));
  const out = h('div', {});

  function draw() {
    const bits = inp.value.replace(/[^01]/g, '');
    inp.style.borderColor = bits.length && bits.length === inp.value.replace(/\s/g, '').length ? 'var(--line)' : 'var(--bad)';
    const g = Number(groupSel.value);
    clear(out);
    if (!bits) return;

    // 오른쪽부터 g비트씩 끊는다 — 왼쪽이 모자라면 0을 채운다
    const pad = (g - (bits.length % g)) % g;
    const padded = '0'.repeat(pad) + bits;
    const groups = padded.match(new RegExp(`.{${g}}`, 'g'));

    const row1 = h('div', { class: 'row tight' });
    const row2 = h('div', { class: 'row tight', style: { marginTop: '6px' } });
    groups.forEach((gr, i) => {
      const v = parseInt(gr, 2);
      const isPad = i === 0 && pad > 0;
      row1.append(h('span', {
        class: 'chip',
        style: {
          fontFamily: 'var(--mono)', fontSize: '1.15rem', letterSpacing: '2px',
          background: isPad ? '#f4f6fa' : '#e9f3ff', color: isPad ? '#9aa5b4' : '#1e4f96',
          border: '2px solid ' + (isPad ? '#dfe4ec' : '#bcd7fb'),
        },
      }, gr));
      row2.append(h('span', {
        style: {
          display: 'inline-block', width: g * 15 + 24 + 'px', textAlign: 'center',
          fontFamily: 'var(--mono)', fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent)',
        },
      }, DIGITS[v]));
    });

    const result = groups.map((gr) => DIGITS[parseInt(gr, 2)]).join('');
    out.append(
      h('p', { style: { color: 'var(--ink-soft)', margin: '0 0 8px' } },
        `오른쪽부터 ${g}비트씩 끊어 각 묶음을 ${g === 3 ? '8' : '16'}진수 한 자리로 바꿉니다.`,
        pad ? ` (왼쪽이 ${pad}비트 모자라 0을 채웠습니다 — 회색 부분)` : ''),
      row1, row2,
      h('div', { class: 'note ok', style: { marginTop: '12px' } },
        h('span', { class: 'mono' }, bits), h('sub', {}, '(2)'), ' = ',
        h('b', { class: 'mono', style: { fontSize: '1.3rem' } }, result), h('sub', {}, `(${g === 3 ? 8 : 16})`)),
    );
  }
  draw();

  /* 반대 방향: 8·16진수 → 2진수 */
  const rInp = h('input', { type: 'text', class: 'mono', value: '5B2', style: { width: '160px', fontSize: '1.1rem' }, oninput: rDraw });
  const rSel = h('select', { onchange: rDraw },
    h('option', { value: '16' }, '16진수 → 4비트씩'),
    h('option', { value: '8' }, '8진수 → 3비트씩'));
  const rOut = h('div', {});

  function rDraw() {
    const b = Number(rSel.value);
    const g = b === 8 ? 3 : 4;
    const s = rInp.value.trim().toUpperCase();
    const ok = s && [...s].every((c) => DIGITS.indexOf(c) >= 0 && DIGITS.indexOf(c) < b);
    rInp.style.borderColor = ok ? 'var(--line)' : 'var(--bad)';
    clear(rOut);
    if (!ok) return;

    const row1 = h('div', { class: 'row tight' });
    const row2 = h('div', { class: 'row tight', style: { marginTop: '6px' } });
    [...s].forEach((c) => {
      const bin = DIGITS.indexOf(c).toString(2).padStart(g, '0');
      row1.append(h('span', {
        style: { display: 'inline-block', width: g * 15 + 24 + 'px', textAlign: 'center', fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--mono)', color: 'var(--accent)' },
      }, c));
      row2.append(h('span', {
        class: 'chip',
        style: { fontFamily: 'var(--mono)', fontSize: '1.15rem', letterSpacing: '2px', background: '#e9f3ff', color: '#1e4f96', border: '2px solid #bcd7fb' },
      }, bin));
    });
    rOut.append(
      h('p', { style: { color: 'var(--ink-soft)', margin: '0 0 8px' } },
        `각 ${b}진 숫자를 ${g}비트씩으로 바꿔 이어 붙입니다.`),
      row1, row2,
      h('div', { class: 'note ok', style: { marginTop: '12px' } },
        h('span', { class: 'mono' }, s), h('sub', {}, `(${b})`), ' = ',
        h('b', { class: 'mono', style: { fontSize: '1.2rem' } },
          [...s].map((c) => DIGITS.indexOf(c).toString(2).padStart(g, '0')).join('')), h('sub', {}, '(2)')));
  }
  rDraw();

  return card('④ 비트 분할 방법 — 2진수 ↔ 8·16진수',
    h('div', { class: 'scroll-x', style: { marginBottom: '16px' } }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', { style: { width: '80px' } }, ''), h('th', {}, '정수 이진수 ⇨ 8진수'), h('th', {}, '정수 이진수 ⇨ 16진수')),
      h('tr', {}, h('th', {}, '방법'),
        h('td', {}, '오른쪽부터 ', answer('3비트'), ' 씩 분할하여 변환'),
        h('td', {}, '오른쪽부터 ', answer('4비트'), ' 씩 분할하여 변환')),
      h('tr', {}, h('th', {}, '반대 방향'),
        h('td', {}, '각 8진 숫자에 대하여 ', answer('3비트'), ' 단위로 변환'),
        h('td', {}, '각 16진 숫자에 대하여 ', answer('4비트'), ' 단위로 변환')),
    )),
    h('h4', { style: { marginTop: '0' } }, '2진수 → 8진수 / 16진수'),
    h('div', { class: 'row', style: { marginBottom: '12px' } },
      h('label', { class: 'field' }, '2진수'), inp, groupSel,
      h('button', { type: 'button', class: 'btn ghost small', onclick: () => { inp.value = '10110101001100'; groupSel.value = '3'; draw(); } }, '학습지 예제 1'),
      h('button', { type: 'button', class: 'btn ghost small', onclick: () => { inp.value = '11101001101101'; groupSel.value = '4'; draw(); } }, '학습지 예제 2')),
    out,

    h('h4', {}, '8진수 / 16진수 → 2진수'),
    h('div', { class: 'row', style: { marginBottom: '12px' } },
      h('label', { class: 'field' }, '수'), rInp, rSel,
      h('button', { type: 'button', class: 'btn ghost small', onclick: () => { rInp.value = '5214'; rSel.value = '8'; rDraw(); } }, '5214₍₈₎'),
      h('button', { type: 'button', class: 'btn ghost small', onclick: () => { rInp.value = '5B2'; rSel.value = '16'; rDraw(); } }, '5B2₍₁₆₎')),
    rOut,

    note('warn', h('b', {}, '왜 3비트·4비트일까? '),
      '8 = 2³ 이라서 2진수 3자리가 8진수 1자리와 정확히 맞고, 16 = 2⁴ 이라서 2진수 4자리가 16진수 1자리와 맞습니다. ',
      '10진수는 2의 거듭제곱이 아니라서 이렇게 끊어 바꿀 수 없습니다.'),
  );
}

/* ══════════════════ ⑤ 문제 풀기 ═════════════════════════════════════ */

function practiceCard() {
  const box = h('div', {});

  function build() {
    clear(box);
    const items = [];
    const kinds = [
      () => { const v = randInt(8, 63); return { q: [h('span', { class: 'mono' }, `(${v.toString(2)})₂`), ' = ( ? )₁₀'], answer: String(v), base: 10,
        hint: '오른쪽 자리부터 1, 2, 4, 8, 16… 을 붙이고 1인 자리만 더합니다.',
        explain: `${[...v.toString(2)].map((c, i, a) => `${c}×2${sup(a.length - 1 - i)}`).join(' + ')} = ${v}` }; },
      () => { const v = randInt(20, 200); return { q: [h('span', { class: 'mono' }, `(${v})₁₀`), ' = ( ? )₂'], answer: v.toString(2), base: 2,
        hint: '2로 계속 나누고 나머지를 거꾸로 읽습니다.', explain: `${v} → ${v.toString(2)}₍₂₎` }; },
      () => { const v = randInt(30, 500); return { q: [h('span', { class: 'mono' }, `(${v.toString(16).toUpperCase()})₁₆`), ' = ( ? )₁₀'], answer: String(v), base: 10,
        hint: 'A=10, B=11, C=12, D=13, E=14, F=15 입니다. 자리마다 16의 거듭제곱을 곱합니다.',
        explain: `${[...v.toString(16).toUpperCase()].map((c, i, a) => `${DIGITS.indexOf(c)}×16${sup(a.length - 1 - i)}`).join(' + ')} = ${v}` }; },
      () => { const v = randInt(30, 600); return { q: [h('span', { class: 'mono' }, `(${v})₁₀`), ' = ( ? )₈'], answer: v.toString(8), base: 8,
        hint: '8로 계속 나누고 나머지를 거꾸로 읽습니다.', explain: `${v} → ${v.toString(8)}₍₈₎` }; },
      () => { const v = randInt(1000, 60000); return { q: [h('span', { class: 'mono' }, `(${v.toString(2)})₂`), ' = ( ? )₁₆'], answer: v.toString(16).toUpperCase(), base: 16,
        hint: '오른쪽부터 4비트씩 끊어서 한 자리씩 바꿉니다.',
        explain: `${v.toString(2).padStart(Math.ceil(v.toString(2).length / 4) * 4, '0').match(/.{4}/g).join(' ')} → ${v.toString(16).toUpperCase()}₍₁₆₎` }; },
      () => { const v = randInt(1000, 60000); return { q: [h('span', { class: 'mono' }, `(${v.toString(16).toUpperCase()})₁₆`), ' = ( ? )₂'], answer: v.toString(2), base: 2,
        hint: '16진 숫자 하나를 4비트씩으로 펼칩니다.',
        explain: `${[...v.toString(16).toUpperCase()].map((c) => DIGITS.indexOf(c).toString(2).padStart(4, '0')).join(' ')} → ${v.toString(2)}` }; },
    ];
    kinds.forEach((f) => {
      const it = f();
      items.push({
        q: it.q, answer: it.answer, width: 200, hint: it.hint, explain: it.explain,
        check: (v) => v.trim().toUpperCase().replace(/^0+(?=.)/, '') === it.answer.replace(/^0+(?=.)/, ''),
      });
    });
    box.append(quizSet(items, { revealOnWrong: true }));
  }
  build();

  return card('⑤ ▣ 진법 간 변환을 해 보자',
    h('div', { class: 'row', style: { marginBottom: '12px' } },
      h('button', { type: 'button', class: 'btn', onclick: build }, '새 문제 만들기'),
      h('span', { style: { color: 'var(--ink-soft)' } }, '누를 때마다 숫자가 새로 바뀝니다.')),
    box);
}
