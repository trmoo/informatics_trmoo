/* ============================================================================
 * crypto.js — 학습지 ⑪ 데이터 암호화
 *   치환형(문자를 바꾼다)과 전치형(자리를 바꾼다)을 직접 돌려 보고,
 *   단방향 암호화가 왜 되돌릴 수 없는지 손으로 확인하게 한다.
 *
 * Copyright 2026 trmoo
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================================== */

import { h, card, sheetHead, note, answer, quizSet, clear } from '../../lib/ui.js';

const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function render(root) {
  root.append(...sheetHead('학습지 ⑪', 'Ⅱ-1. 데이터 압축과 암호화 (2) 데이터 암호화',
    ['[12정02-02]'],
    ['데이터 암호화의 개념을 설명할 수 있다.',
     '암호화를 활용하여 데이터를 안전하게 관리하는 사례를 비교·분석할 수 있다.']));

  root.append(conceptCard());
  root.append(substitutionCard());
  root.append(transpositionCard());
  root.append(onewayCard());
  root.append(quizCard());
}

/* ══════════════════ 개념 ══════════════════════════════════════════════ */

function conceptCard() {
  return card('암호화란',
    h('p', {}, '데이터를 보호하기 위해 해독할 수 없도록 변경하여, 허가받지 않은 사람이 내용을 볼 수 없도록 하는 것.'),
    h('div', { class: 'grid3' },
      h('div', { class: 'note' }, h('b', {}, '평문'), h('br', {}), '암호화하기 전 읽을 수 있는 원본 메시지'),
      h('div', { class: 'note warn' }, h('b', {}, '암호문'), h('br', {}), '암호화를 적용하여 읽을 수 없는 메시지'),
      h('div', { class: 'note ok' }, h('b', {}, '복호화'), h('br', {}), '암호문을 허가받은 사람이 볼 수 있도록 해석하여 평문으로 복원하는 것')),

    h('h4', {}, '암호화의 목적'),
    h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', { style: { width: '130px' } }, '기밀성'), h('td', { class: 'left' }, '허락되지 않은 사용자 또는 객체가 정보의 내용을 알 수 없도록 하는 성질')),
      h('tr', {}, h('th', {}, '무결성'), h('td', { class: 'left' }, '허락되지 않은 사용자 또는 객체가 정보를 함부로 수정할 수 없도록 하는 성질')),
      h('tr', {}, h('th', {}, '인증'), h('td', { class: 'left' }, '사용자 또는 객체가 디지털 정체성을 식별함')),
      h('tr', {}, h('th', {}, '부인 방지'), h('td', { class: 'left' }, '정보를 보낸 사람이 나중에 보냈다는 것을 부인하지 못하도록 함')),
    )),

    h('h4', {}, '암호화의 사례'),
    h('ul', {},
      h('li', {}, h('b', {}, '비밀번호'), ' — ', h('b', {}, '단방향'), ' 암호화. 비밀번호 분실 시 기존 비밀번호를 알려주는 것이 아니라 새로운 비밀번호를 생성합니다.'),
      h('li', {}, h('b', {}, 'HTTPS'), ' (Hypertext Transfer Protocol ', answer('Secure'), ') — HTTP + 보안 기능. 사용자와 서버 간 통신을 암호화하여 정보를 보호합니다.')));
}

/* ══════════════════ ① 치환형 (시저 암호) ═══════════════════════════ */

function substitutionCard() {
  let shift = 3;
  let mode = 'enc';

  const inp = h('input', {
    type: 'text', class: 'mono', value: 'WAWOOINFORMATICS',
    style: { width: '100%', fontSize: '1.15rem', letterSpacing: '2px' }, oninput: draw,
  });
  const outBox = h('div', {});
  const stripBox = h('div', { class: 'scroll-x' });

  const shiftInp = h('input', {
    type: 'range', min: 1, max: 25, value: shift, style: { flex: '1', minWidth: '180px' },
    oninput: () => { shift = Number(shiftInp.value); shiftOut.textContent = `${shift}칸`; draw(); },
  });
  const shiftOut = h('b', { class: 'big-num', style: { fontSize: '1.05rem' } }, '3칸');

  const shiftBy = (s, k) => [...s.toUpperCase()].map((c) => {
    const i = AZ.indexOf(c);
    return i < 0 ? c : AZ[(i + k + 26) % 26];
  }).join('');

  function draw() {
    const src = inp.value.toUpperCase();
    inp.value = src;
    const k = mode === 'enc' ? shift : -shift;
    const res = shiftBy(src, k);

    clear(outBox);
    outBox.append(
      h('div', { class: 'note ' + (mode === 'enc' ? 'warn' : 'ok'), style: { fontFamily: 'var(--mono)', fontSize: '1.2rem', letterSpacing: '2px', wordBreak: 'break-all' } },
        h('b', {}, mode === 'enc' ? '암호문 ' : '평문 '), res),
      h('div', { class: 'row tight', style: { marginTop: '10px' } },
        h('button', {
          type: 'button', class: 'btn ghost small',
          onclick: () => { inp.value = res; draw(); },
        }, '↓ 결과를 위 칸에 넣기 (되돌려 보기)')));

    // 알파벳 대응표
    clear(stripBox);
    const r1 = h('tr', {}, h('th', { class: 'left' }, '평문'));
    const r2 = h('tr', {}, h('th', { class: 'left' }, '암호문'));
    for (let i = 0; i < 26; i++) {
      const used = src.includes(AZ[i]);
      r1.append(h('td', { class: 'mono', style: { padding: '3px 4px', background: used ? '#fff4e5' : '', fontWeight: used ? '800' : '400' } }, AZ[i]));
      r2.append(h('td', { class: 'mono', style: { padding: '3px 4px', background: used ? '#fff4e5' : '', fontWeight: used ? '800' : '400', color: used ? 'var(--accent)' : '' } }, AZ[(i + shift) % 26]));
    }
    stripBox.append(h('table', { class: 'tbl' }, r1, r2));
  }
  draw();

  return card('① 치환형 암호 — 시저 암호 돌려 보기',
    h('p', {}, '규칙에 따라 하나의 문자를 ', answer('다른 문자'), '로 바꿉니다. ',
      '아래는 알파벳을 정해진 칸 수만큼 뒤로 미는 ', h('b', {}, '시저 암호'), '입니다.'),

    h('div', { class: 'row', style: { marginBottom: '10px' } },
      h('label', { class: 'field' }, '몇 칸 뒤로?'), shiftInp, shiftOut,
      h('span', { class: 'spacer' }),
      h('button', {
        type: 'button', class: 'btn small',
        onclick: (e) => { mode = mode === 'enc' ? 'dec' : 'enc'; e.target.textContent = mode === 'enc' ? '🔒 암호화 중' : '🔓 복호화 중'; draw(); },
      }, '🔒 암호화 중')),

    h('div', { style: { marginBottom: '10px' } }, inp),
    outBox,
    h('h4', {}, '알파벳 대응표 (지금 쓴 글자는 노란색)'),
    stripBox,

    note('warn', h('b', {}, '약점 '),
      '시저 암호는 밀 수 있는 칸이 25가지뿐입니다. 25번만 다 해 보면 반드시 풀립니다. ',
      '실제 암호는 경우의 수를 천문학적으로 크게 만들어 이 「전부 해 보기」 공격을 막습니다.'));
}

/* ══════════════════ ② 전치형 (열 바꾸기) ═══════════════════════════ */

function transpositionCard() {
  let cols = 4;
  const inp = h('input', {
    type: 'text', class: 'mono', value: 'WAWOOINFORMATICS',
    style: { width: '100%', fontSize: '1.15rem', letterSpacing: '2px' }, oninput: draw,
  });
  const gridBox = h('div', { class: 'scroll-x' });
  const outBox = h('div', {});

  const colsInp = h('input', {
    type: 'range', min: 2, max: 8, value: cols, style: { flex: '1', minWidth: '160px' },
    oninput: () => { cols = Number(colsInp.value); colsOut.textContent = `${cols}개씩`; draw(); },
  });
  const colsOut = h('b', { class: 'big-num', style: { fontSize: '1.05rem' } }, '4개씩');

  function draw() {
    const s = inp.value.toUpperCase().replace(/\s/g, '');
    inp.value = inp.value.toUpperCase();
    clear(gridBox); clear(outBox);
    if (!s) return;

    const rows = Math.ceil(s.length / cols);
    const grid = [];
    for (let r = 0; r < rows; r++) {
      grid.push([...Array(cols)].map((_, c) => s[r * cols + c] ?? ''));
    }

    // 표: 가로로 채우고 세로로 읽는다
    const palette = ['#e9f3ff', '#eefaf4', '#fff4e5', '#f7eefd', '#fdeeee', '#eef7f1', '#f2f6fa', '#fff0f5'];
    const tbl = h('table', { class: 'tbl', style: { maxWidth: cols * 62 + 'px' } });
    grid.forEach((row) => {
      tbl.append(h('tr', {}, row.map((ch, c) => h('td', {
        class: 'mono',
        style: { fontSize: '1.3rem', fontWeight: '800', background: palette[c % palette.length], width: '56px', height: '46px' },
      }, ch || '·'))));
    });
    gridBox.append(tbl);

    // 세로로 읽기
    let enc = '';
    const pieces = [];
    for (let c = 0; c < cols; c++) {
      let piece = '';
      for (let r = 0; r < rows; r++) piece += grid[r][c] || '';
      pieces.push(piece);
      enc += piece;
    }

    outBox.append(
      h('div', { class: 'row tight', style: { marginTop: '12px' } },
        h('span', { class: 'chip' }, '세로로 읽으면'),
        pieces.map((p, i) => h('span', {
          class: 'mono',
          style: { padding: '6px 10px', borderRadius: '8px', fontWeight: '800', fontSize: '1.15rem', letterSpacing: '2px', background: palette[i % palette.length], border: '2px solid rgba(120,140,170,.3)' },
        }, p))),
      h('div', { class: 'note warn', style: { marginTop: '12px', fontFamily: 'var(--mono)', fontSize: '1.2rem', letterSpacing: '2px', wordBreak: 'break-all' } },
        h('b', {}, '암호문 '), enc),
      note('', '글자는 하나도 바뀌지 않았습니다. ', h('b', {}, '자리만 바뀌었습니다'),
        ' — 이것이 치환형과의 차이입니다. 알파벳 개수를 세어 보면 평문과 똑같습니다.'));
  }
  draw();

  return card('② 전치형 — 규칙에 따라 문자의 위치를 바꾸기',
    h('p', {}, '규칙에 따라 ', answer('문자의 위치'), '를 바꿉니다. ',
      '아래는 글자를 정해진 개수씩 끊어 표에 가로로 채운 뒤, ', h('b', {}, '세로로 읽어'), ' 암호문을 만드는 방법입니다.'),
    h('div', { class: 'row', style: { marginBottom: '10px' } },
      h('label', { class: 'field' }, '몇 개씩 끊을까?'), colsInp, colsOut,
      h('button', { type: 'button', class: 'btn ghost small', onclick: () => { inp.value = 'WAWOOINFORMATICS'; colsInp.value = 4; cols = 4; colsOut.textContent = '4개씩'; draw(); } }, '학습지 예제')),
    h('div', { style: { marginBottom: '12px' } }, inp),
    gridBox, outBox);
}

/* ══════════════════ ③ 단방향 암호화 ════════════════════════════════ */

/** 수업용 아주 작은 해시. 진짜 SHA-256 은 아니지만 성질(같은 입력→같은 출력, 되돌릴 수 없음)은 같다. */
function tinyHash(s) {
  let a = 0x811c9dc5, b = 0x1000193, c = 0x9e3779b9;
  for (let i = 0; i < s.length; i++) {
    const k = s.charCodeAt(i);
    a = (a ^ k) >>> 0; a = Math.imul(a, 16777619) >>> 0;
    b = (b + Math.imul(k + i + 1, 2654435761)) >>> 0;
    c = ((c << 5) - c + k + a) >>> 0;
  }
  return [a, b, c, (a ^ b ^ c) >>> 0].map((x) => x.toString(16).padStart(8, '0')).join('');
}

function onewayCard() {
  const a = h('input', { type: 'text', value: 'password1234', style: { width: '260px' }, oninput: draw });
  const b = h('input', { type: 'text', value: 'password1235', style: { width: '260px' }, oninput: draw });
  const out = h('div', {});

  function draw() {
    clear(out);
    const ha = tinyHash(a.value), hb = tinyHash(b.value);
    const diff = [...ha].filter((c, i) => c !== hb[i]).length;
    const paint = (s, other) => h('div', { class: 'mono', style: { wordBreak: 'break-all', fontSize: '1.02rem' } },
      [...s].map((c, i) => h('span', { style: { color: c === other[i] ? 'var(--ink)' : 'var(--bad)', fontWeight: c === other[i] ? '400' : '800' } }, c)));

    out.append(h('table', { class: 'tbl' },
      h('tr', {}, h('th', { class: 'left', style: { width: '150px' } }, '입력 ①'), h('td', { class: 'left mono' }, a.value || '(빈 값)')),
      h('tr', {}, h('th', { class: 'left' }, '① 의 암호화 결과'), h('td', { class: 'left' }, paint(ha, hb))),
      h('tr', {}, h('th', { class: 'left' }, '입력 ②'), h('td', { class: 'left mono' }, b.value || '(빈 값)')),
      h('tr', {}, h('th', { class: 'left' }, '② 의 암호화 결과'), h('td', { class: 'left' }, paint(hb, ha))),
      h('tr', { class: 'hl' }, h('th', { class: 'left' }, '다른 자리 수'), h('td', { class: 'left' }, `32자리 중 ${diff}자리가 다릅니다`)),
    ));
  }
  draw();

  return card('③ 단방향 암호화 — 되돌릴 수 없는 암호',
    h('p', {}, '웹사이트는 여러분의 비밀번호를 그대로 저장하지 않습니다. ',
      h('b', {}, '단방향 암호화'), '를 거친 결과만 저장하고, 로그인할 때마다 다시 암호화해서 그 결과가 같은지만 봅니다. ',
      '그래서 비밀번호를 잊으면 알려 주지 못하고 ', h('b', {}, '새 비밀번호를 만들게'), ' 하는 것입니다.'),
    h('div', { class: 'row', style: { marginBottom: '8px' } }, h('label', { class: 'field', style: { width: '70px' } }, '입력 ①'), a),
    h('div', { class: 'row', style: { marginBottom: '12px' } }, h('label', { class: 'field', style: { width: '70px' } }, '입력 ②'), b),
    out,
    note('warn', h('b', {}, '해 볼 것 '),
      '입력 ② 의 마지막 글자 하나만 바꿔 보세요. 결과가 거의 전부 달라집니다(빨간 글자). ',
      '이 성질 덕분에 결과만 보고 원래 비밀번호를 짐작할 수 없습니다.'),
    note('', h('b', {}, '참고 '),
      '여기 쓴 것은 원리를 보여 주기 위한 수업용 간단 함수입니다. ',
      '실제 서비스는 SHA-256 같은 표준 알고리즘에 소금값(salt)을 더해 훨씬 튼튼하게 만듭니다.'));
}

/* ══════════════════ ④ 확인 문제 ════════════════════════════════════ */

function quizCard() {
  return card('④ 확인 문제',
    quizSet([
      { q: ['시저 암호(3칸 뒤로)로 ', h('span', { class: 'mono' }, 'CAT'), ' 을 암호화하면?'],
        answer: 'FDW', width: 150,
        hint: 'C→F, A→D, T→W', explain: '각 글자를 알파벳에서 3칸 뒤로 밉니다. C+3=F, A+3=D, T+3=W' },
      { q: ['시저 암호(3칸)로 만든 암호문 ', h('span', { class: 'mono' }, 'KHOOR'), ' 를 복호화하면?'],
        answer: 'HELLO', width: 150,
        hint: '이번에는 3칸 앞으로 당깁니다.', explain: 'K-3=H, H-3=E, O-3=L, O-3=L, R-3=O → HELLO' },
      { q: ['평문 ', h('span', { class: 'mono' }, 'WAWOOINFORMATICS'), ' 를 4개씩 끊어 세로로 읽으면?'],
        answer: 'WOOTAIRIWNMCOFAS', width: 300,
        hint: '위 ② 전치형 실험실에 그대로 넣어 보세요.',
        explain: '표에 가로로 채우고 열마다 세로로 읽으면 WOOT / AIRI / WNMC / OFAS → WOOTAIRIWNMCOFAS' },
      { q: '전치형 암호의 특징으로 알맞은 것은?',
        type: 'choice', choices: ['글자가 다른 글자로 바뀐다', '글자는 그대로이고 순서만 바뀐다', '글자 개수가 늘어난다'],
        answer: '글자는 그대로이고 순서만 바뀐다',
        explain: '전치형은 위치만 바꾸므로 평문과 암호문의 글자 구성이 완전히 같습니다.' },
      { q: '비밀번호를 저장할 때 쓰는 암호화 방식은?',
        type: 'choice', choices: ['단방향 암호화', '양방향 암호화', '전치형 암호화'],
        answer: '단방향 암호화',
        explain: '복원할 필요가 없고 복원되면 오히려 위험하므로 단방향을 씁니다.' },
      { q: '「보낸 사람이 나중에 안 보냈다고 우기지 못하게 하는 것」에 해당하는 암호화의 목적은?',
        type: 'choice', choices: ['기밀성', '무결성', '인증', '부인 방지'],
        answer: '부인 방지',
        explain: '부인 방지 — 정보를 보낸 사람이 나중에 보냈다는 것을 부인하지 못하도록 합니다.' },
    ], { revealOnWrong: true }));
}
