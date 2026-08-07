/* ============================================================================
 * operator.js — 학습지 ⑱⑲ 연산자
 *   가장 큰 볼거리는 「연산자 우선순위 계산기」다.
 *   수식을 넣으면 어떤 연산자가 먼저 계산되는지 한 줄씩 지워 가며 보여 준다.
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
import { runner, blankTask } from '../../lib/runner.js';

export function render(root) {
  root.append(...sheetHead('학습지 ⑱⑲', 'Ⅲ-2. 프로그래밍 (1) 자료형 — 연산자',
    ['[12정03-04]'],
    ['다양한 연산자를 활용한 프로그램을 작성할 수 있다.']));

  root.append(tablesCard());
  root.append(precedenceCard());
  root.append(predictCard());
  root.append(practiceCard());
}

/* ══════════════════ ① 연산자 표 ════════════════════════════════════ */

function tablesCard() {
  const opRow = (op, fn, code, res) => h('tr', {},
    h('td', { class: 'mono', style: { fontWeight: '800', fontSize: '1.1rem' } }, op),
    h('td', { class: 'left' }, fn),
    h('td', { class: 'left mono' }, code),
    h('td', { class: 'mono', style: { fontWeight: '800', color: 'var(--accent)' } }, res));

  return card('① 연산자의 종류',
    h('p', {}, '▶ ', h('b', {}, '수식(expression)'), ': 피연산자들과 연산자들의 조합 ／ ',
      h('b', {}, '연산자(operator)'), ': 어떤 연산을 나타내는 기호 ／ ',
      h('b', {}, '피연산자(operand)'), ': 연산의 대상이 되는 것'),

    h('h4', {}, '2.1 산술 연산자'),
    h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', { style: { width: '70px' } }, '연산자'), h('th', {}, '기능'), h('th', { class: 'left' }, '코드'), h('th', { style: { width: '100px' } }, '실행결과')),
      opRow('+', '덧셈', '7 + 4', '11'),
      opRow('-', '뺄셈', '7 - 4', '3'),
      opRow('*', '곱셈', '7 * 4', '28'),
      opRow('**', '거듭제곱 (지수 계산)', '7 ** 4', '2401'),
      opRow('/', '실수 나눗셈', '7 / 4', '1.75'),
      opRow('//', '정수 나눗셈 (몫 연산자) ※ 소수점 이하는 버림', '7 // 4', '3'),
      opRow('%', '나머지 연산자 (퍼센트와 전혀 관련 없음)', '7 % 4', '3'),
    )),

    h('h4', {}, '2.2 비교 연산자 — 참이면 True, 거짓이면 False'),
    h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', { style: { width: '70px' } }, '연산자'), h('th', {}, '기능'), h('th', { class: 'left' }, '코드'), h('th', { style: { width: '100px' } }, '실행결과')),
      opRow('<', '작다', '10 < 3', 'False'),
      opRow('>', '크다', '10 > 3', 'True'),
      opRow('<=', '작거나 같다', '10 <= 10', 'True'),
      opRow('>=', '크거나 같다', '10 >= 10', 'True'),
      opRow('==', '같다', '10 == 3', 'False'),
      opRow('!=', '같지 않다', '10 != 3', 'True'),
    )),
    note('bad', '※ ', h('code', { class: 'inline' }, '=<'), ', ', h('code', { class: 'inline' }, '=>'), ', ',
      h('code', { class: 'inline' }, '=!'), ' 처럼 순서를 바꾸거나 ',
      h('code', { class: 'inline' }, '< ='), ', ', h('code', { class: 'inline' }, '= ='),
      ' 처럼 띄어쓰기를 하면 SyntaxError 가 발생합니다.'),

    h('h4', {}, '2.3 논리 연산자 — 진리표를 채워 봅시다'),
    h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', {}, 'A'), h('th', {}, 'B'),
        h('th', {}, 'A and B', h('br', {}), h('span', { style: { fontWeight: '400' } }, '논리곱(그리고)')),
        h('th', {}, 'A or B', h('br', {}), h('span', { style: { fontWeight: '400' } }, '논리합(또는)')),
        h('th', {}, 'not A', h('br', {}), h('span', { style: { fontWeight: '400' } }, '논리부정'))),
      h('tr', {}, h('td', {}, 'False'), h('td', {}, 'False'), h('td', {}, answer('False')), h('td', {}, answer('False')), h('td', {}, answer('True'))),
      h('tr', {}, h('td', {}, 'False'), h('td', {}, 'True'), h('td', {}, answer('False')), h('td', {}, answer('True')), h('td', {}, answer('True'))),
      h('tr', {}, h('td', {}, 'True'), h('td', {}, 'False'), h('td', {}, answer('False')), h('td', {}, answer('True')), h('td', {}, answer('False'))),
      h('tr', {}, h('td', {}, 'True'), h('td', {}, 'True'), h('td', {}, answer('True')), h('td', {}, answer('True')), h('td', {}, answer('False'))),
    )),

    h('h4', {}, '2.4 대입 연산자 · 2.5 포함 연산자'),
    h('div', { class: 'grid2' },
      h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
        h('tr', {}, h('th', {}, '연산자'), h('th', {}, '기능'), h('th', { class: 'left' }, '예')),
        h('tr', {}, h('td', { class: 'mono' }, '='), h('td', {}, '순수 대입'), h('td', { class: 'left mono' }, 'x = 10; x = x + 10/2 → 15.0')),
        h('tr', {}, h('td', { class: 'mono' }, '+=, -= 등'), h('td', {}, '축약형 대입'), h('td', { class: 'left mono' }, 'x = 10; x += 10/2 → 15.0')),
      )),
      h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
        h('tr', {}, h('th', {}, '연산자'), h('th', {}, '기능'), h('th', { class: 'left' }, '예')),
        h('tr', {}, h('td', { class: 'mono' }, 'in'), h('td', {}, '포함되어 있다'), h('td', { class: 'left mono' }, "'e' in 'cute' → True")),
        h('tr', {}, h('td', { class: 'mono' }, 'not in'), h('td', {}, '포함되어 있지 않다'), h('td', { class: 'left mono' }, "'a' not in 'cute' → True")),
      ))),
    note('warn', '※ ', h('code', { class: 'inline' }, '=+'), ', ', h('code', { class: 'inline' }, '=-'),
      ' 로 순서를 바꾸면 의도하지 않은 결과가 나오고, ', h('code', { class: 'inline' }, '+ ='),
      ' 처럼 띄어쓰기를 하면 SyntaxError 가 발생합니다.'));
}

/* ══════════════════ 우선순위 계산기 — 수식 쪼개기 ═══════════════════ */

/* 파이썬 값을 문자열로. 정수와 실수를 구분해서 보여 준다. */
function repr(v) {
  if (typeof v === 'boolean') return v ? 'True' : 'False';
  if (typeof v === 'string') return `'${v}'`;
  if (typeof v === 'object' && v && v.f) return Number.isInteger(v.n) ? v.n.toFixed(1) : String(v.n);
  if (typeof v === 'object' && v) return String(v.n);
  return String(v);
}
const INT = (n) => ({ n, f: false });
const FLT = (n) => ({ n, f: true });
const numOf = (v) => (typeof v === 'boolean' ? (v ? 1 : 0) : v.n);
const isNum = (v) => typeof v === 'object' && v !== null && 'n' in v;

/** 수식을 토큰으로 쪼갠다. */
function tokenize(src) {
  const T = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    if (src.startsWith('not in', i)) { T.push({ t: 'op', v: 'not in' }); i += 6; continue; }
    const three = src.slice(i, i + 3);
    const two = src.slice(i, i + 2);
    if (two === '**' || two === '//' || two === '<=' || two === '>=' || two === '==' || two === '!=') {
      T.push({ t: 'op', v: two }); i += 2; continue;
    }
    if ('+-*/%<>()'.includes(c)) { T.push({ t: c === '(' || c === ')' ? c : 'op', v: c }); i++; continue; }
    if (/[0-9]/.test(c)) {
      let s = '';
      while (i < src.length && /[0-9.]/.test(src[i])) s += src[i++];
      T.push({ t: 'val', v: s.includes('.') ? FLT(parseFloat(s)) : INT(parseInt(s, 10)) });
      continue;
    }
    if (c === "'" || c === '"') {
      let s = ''; i++;
      while (i < src.length && src[i] !== c) s += src[i++];
      i++;
      T.push({ t: 'val', v: s });
      continue;
    }
    if (/[A-Za-z_가-힣]/.test(c)) {
      let s = '';
      while (i < src.length && /[A-Za-z0-9_가-힣]/.test(src[i])) s += src[i++];
      if (s === 'True') T.push({ t: 'val', v: true });
      else if (s === 'False') T.push({ t: 'val', v: false });
      else if (s === 'and' || s === 'or' || s === 'not' || s === 'in') T.push({ t: 'op', v: s });
      else T.push({ t: 'name', v: s });
      continue;
    }
    throw new Error(`알 수 없는 글자: ${c}`);
  }
  return T;
}

const show = (T) => T.map((x) => (x.t === 'val' ? repr(x.v) : x.t === 'name' ? x.v : x.v)).join(' ')
  .replace(/\( /g, '(').replace(/ \)/g, ')');

/** 두 값에 연산자 하나를 적용한다. */
function apply(op, a, b) {
  if (op === 'in') return { t: 'val', v: String(b).includes(String(a)) };
  if (op === 'not in') return { t: 'val', v: !String(b).includes(String(a)) };
  if (op === 'and') return { t: 'val', v: truthy(a) ? b : a };
  if (op === 'or') return { t: 'val', v: truthy(a) ? a : b };

  if (typeof a === 'string' || typeof b === 'string') {
    if (op === '+' && typeof a === 'string' && typeof b === 'string') return { t: 'val', v: a + b };
    if (op === '==') return { t: 'val', v: a === b };
    if (op === '!=') return { t: 'val', v: a !== b };
    throw new Error(`문자열에는 ${op} 연산을 할 수 없습니다`);
  }

  const x = numOf(a), y = numOf(b);
  const bothInt = (!isNum(a) || !a.f) && (!isNum(b) || !b.f);
  const mk = (n, forceFloat) => ({ t: 'val', v: (bothInt && !forceFloat) ? INT(n) : FLT(n) });

  switch (op) {
    case '+': return mk(x + y);
    case '-': return mk(x - y);
    case '*': return mk(x * y);
    case '**': return mk(Math.pow(x, y));
    case '/': if (y === 0) throw new Error('0으로 나눌 수 없습니다'); return mk(x / y, true);
    case '//': if (y === 0) throw new Error('0으로 나눌 수 없습니다'); return mk(Math.floor(x / y));
    case '%': if (y === 0) throw new Error('0으로 나눌 수 없습니다'); return mk(((x % y) + y) % y);
    case '<': return { t: 'val', v: x < y };
    case '>': return { t: 'val', v: x > y };
    case '<=': return { t: 'val', v: x <= y };
    case '>=': return { t: 'val', v: x >= y };
    case '==': return { t: 'val', v: x === y };
    case '!=': return { t: 'val', v: x !== y };
    default: throw new Error(`모르는 연산자 ${op}`);
  }
}

const truthy = (v) => (typeof v === 'boolean' ? v : typeof v === 'string' ? v.length > 0 : v.n !== 0);

const LEVELS = [
  { ops: ['**'], right: true, name: '거듭제곱' },
  { ops: ['*', '/', '//', '%'], name: '곱셈·나눗셈·몫·나머지' },
  { ops: ['+', '-'], name: '덧셈·뺄셈' },
  { ops: ['<', '<=', '>', '>=', '==', '!=', 'in', 'not in'], name: '비교' },
  { ops: ['not'], unary: true, name: 'not (논리부정)' },
  { ops: ['and'], name: 'and (논리곱)' },
  { ops: ['or'], name: 'or (논리합)' },
];

/** 한 단계만 계산한다. 더 계산할 것이 없으면 null. */
function stepOnce(T) {
  // ① 안쪽 괄호부터
  let open = -1;
  for (let i = 0; i < T.length; i++) {
    if (T[i].t === '(') open = i;
    if (T[i].t === ')') {
      const inner = T.slice(open + 1, i);
      if (inner.length === 1) {
        const out = T.slice(0, open).concat(inner, T.slice(i + 1));
        return { T: out, why: '괄호 안이 다 계산되었으므로 괄호를 벗깁니다.', op: '( )' };
      }
      const sub = stepOnce(inner);
      if (!sub) return null;
      return { T: T.slice(0, open + 1).concat(sub.T, T.slice(i)), why: sub.why, op: sub.op, inParen: true };
    }
  }

  // ② 단항 마이너스
  for (let i = 0; i < T.length; i++) {
    if (T[i].t === 'op' && T[i].v === '-' && T[i + 1] && T[i + 1].t === 'val' &&
        (i === 0 || T[i - 1].t === 'op' || T[i - 1].t === '(')) {
      const v = T[i + 1].v;
      if (!isNum(v)) continue;
      const nv = v.f ? FLT(-v.n) : INT(-v.n);
      return { T: T.slice(0, i).concat([{ t: 'val', v: nv }], T.slice(i + 2)),
        why: '앞에 붙은 마이너스(부호)를 먼저 처리합니다.', op: '-(부호)' };
    }
  }

  // ③ 우선순위가 높은 것부터
  for (const lv of LEVELS) {
    if (lv.unary) {
      for (let i = T.length - 1; i >= 0; i--) {
        if (T[i].t === 'op' && lv.ops.includes(T[i].v) && T[i + 1] && T[i + 1].t === 'val') {
          const v = { t: 'val', v: !truthy(T[i + 1].v) };
          return { T: T.slice(0, i).concat([v], T.slice(i + 2)),
            why: `${lv.name} 을(를) 계산합니다.`, op: `not ${repr(T[i + 1].v)} = ${repr(v.v)}` };
        }
      }
      continue;
    }
    const idxs = [];
    for (let i = 0; i < T.length; i++) if (T[i].t === 'op' && lv.ops.includes(T[i].v)) idxs.push(i);
    if (!idxs.length) continue;
    const i = lv.right ? idxs[idxs.length - 1] : idxs[0];
    const a = T[i - 1], b = T[i + 1];
    if (!a || !b || a.t !== 'val' || b.t !== 'val') continue;
    const res = apply(T[i].v, a.v, b.v);
    return {
      T: T.slice(0, i - 1).concat([res], T.slice(i + 2)),
      why: `${lv.name} — 이 줄에서 가장 우선순위가 높습니다.`,
      op: `${repr(a.v)} ${T[i].v} ${repr(b.v)} = ${repr(res.v)}`,
    };
  }
  return null;
}

/* ══════════════════ ② 우선순위 계산기 화면 ═════════════════════════ */

function precedenceCard() {
  const inp = h('input', {
    type: 'text', class: 'mono', value: '5 + 9 * 9 % 5',
    style: { width: '100%', fontSize: '1.2rem' }, oninput: draw,
  });
  const varInp = h('input', {
    type: 'text', class: 'mono', value: '', placeholder: '예:  x = 10, y = 20',
    style: { width: '320px' }, oninput: draw,
  });
  const out = h('div', {});

  function draw() {
    clear(out);
    let T;
    try {
      // 변수 정의를 먼저 읽어 이름을 값으로 바꾼다
      const vars = {};
      varInp.value.split(',').forEach((p) => {
        const m = p.split('=');
        if (m.length !== 2) return;
        const name = m[0].trim();
        try { vars[name] = tokenize(m[1])[0]?.v; } catch { /* 무시 */ }
      });
      T = tokenize(inp.value).map((tk) => {
        if (tk.t !== 'name') return tk;
        if (tk.v in vars && vars[tk.v] !== undefined) return { t: 'val', v: vars[tk.v] };
        throw new Error(`변수 ${tk.v} 의 값이 정해지지 않았습니다. 아래 「변수 정하기」 칸에 적어 주세요.`);
      });
      inp.style.borderColor = 'var(--line)';
    } catch (e) {
      inp.style.borderColor = 'var(--bad)';
      out.append(note('bad', e.message));
      return;
    }

    const rows = [h('tr', {}, h('th', { style: { width: '58px' } }, '단계'), h('th', { class: 'left' }, '수식'),
      h('th', { class: 'left', style: { width: '250px' } }, '계산한 것'), h('th', { class: 'left' }, '왜 이것부터?'))];
    rows.push(h('tr', {},
      h('td', {}, '시작'),
      h('td', { class: 'left mono', style: { fontSize: '1.15rem', fontWeight: '800' } }, show(T)),
      h('td', {}, ''), h('td', {}, '')));

    let n = 0;
    try {
      while (n < 40) {
        const s = stepOnce(T);
        if (!s) break;
        T = s.T; n++;
        rows.push(h('tr', { class: 'hl' },
          h('td', {}, String(n)),
          h('td', { class: 'left mono', style: { fontSize: '1.15rem', fontWeight: '800' } }, show(T)),
          h('td', { class: 'left mono', style: { color: 'var(--accent)', fontWeight: '800' } }, s.op),
          h('td', { class: 'left', style: { color: 'var(--ink-soft)', fontSize: '0.93rem' } }, s.why)));
      }
    } catch (e) {
      out.append(h('table', { class: 'tbl' }, ...rows), note('bad', e.message));
      return;
    }

    out.append(h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' }, ...rows)));
    if (T.length === 1 && T[0].t === 'val') {
      out.append(h('div', { class: 'note ok', style: { marginTop: '12px', fontSize: '1.2rem' } },
        '최종 결과 ▶ ', h('b', { class: 'mono', style: { fontSize: '1.4rem' } }, repr(T[0].v))));
    } else {
      out.append(note('warn', '여기까지만 계산할 수 있습니다. 이 계산기는 학습지에 나오는 연산자만 다룹니다.'));
    }
  }
  draw();

  const samples = [
    ['5 + 9 * 9 % 5', ''],
    ['5 ** 2 * (9 - 5)', ''],
    ['3 >= 6 - 3', ''],
    ['x != 5', 'x = 5'],
    ['x and y', 'x = False, y = True'],
    ['x > 20 / 5 or y < 10', 'x = 10, y = 20'],
    ['not y', 'y = True'],
    ['7 // 4 + 7 % 4', ''],
    ["'e' in 'cute'", ''],
    ['2 ** 3 ** 2', ''],
  ];

  return card('② 연산자 우선순위 계산기 — 무엇이 먼저 계산될까',
    h('div', { class: 'note', style: { marginBottom: '14px' } },
      h('b', {}, '우선순위 '),
      h('span', { class: 'mono' }, '** > *, /, //, % > +, - > <, <=, >, >=, ==, !=, in, not in > not > and > or'),
      h('br', {}),
      '같은 우선순위면 왼쪽에서 오른쪽으로 계산합니다. ',
      h('b', {}, '단, 지수(**)는 오른쪽에서 왼쪽으로'), ' 계산합니다. 소괄호가 있으면 어떤 연산자보다도 먼저 계산됩니다.'),

    h('div', { style: { marginBottom: '10px' } }, inp),
    h('div', { class: 'row', style: { marginBottom: '12px' } },
      h('label', { class: 'field' }, '변수 정하기'), varInp,
      h('span', { style: { color: 'var(--ink-soft)', fontSize: '0.9rem' } }, '수식에 변수를 쓸 때만 적으면 됩니다')),
    h('div', { class: 'row tight', style: { marginBottom: '14px' } },
      h('span', { class: 'chip' }, '예제'),
      samples.map(([e, v]) => h('button', {
        type: 'button', class: 'btn ghost small',
        onclick: () => { inp.value = e; varInp.value = v; draw(); },
      }, e))),
    out,
    note('warn', h('b', {}, '해 볼 것 '),
      h('code', { class: 'inline' }, '2 ** 3 ** 2'), ' 를 넣어 보세요. ',
      '왼쪽부터 계산하면 (2³)² = 64 지만, 지수는 오른쪽부터라서 2⁹ = 512 가 됩니다.'));
}

/* ══════════════════ ③ 예상해 보기 ══════════════════════════════════ */

function predictCard() {
  return card('③ ▣ 결과를 예상하고 실행 결과와 비교해 보자',
    h('h4', { style: { marginTop: '0' } }, '산술·비교 연산자'),
    runner({
      code: `print(5+9*9%5)
print(5**2*(9-5))
print(3 >= 6-3)
x = 10-5
print(x!=5)`,
      predict: true,
    }),
    h('h4', {}, '논리 연산자'),
    runner({
      code: `x = (100 != 100)
y = True
print(x and y)

x = 10
y = 20
print(x>20/5 or y<10)

x = 'a'
y = (x == 'a')
print(not y)`,
      predict: true,
    }),
    note('', '왜 그런 결과가 나왔는지 모르겠다면, 위 ② 계산기에 그 수식을 그대로 넣어 단계별로 확인해 보세요.'));
}

/* ══════════════════ ④ 학습지 ⑲ 실습 ═══════════════════════════════ */

function practiceCard() {
  return card('④ 학습지 ⑲ — 빈칸을 채우고 실행해 봅시다',

    blankTask({
      label: 'candy.py',
      template: `돈 = 5000
사탕가격 = 120
# 최대한 살 수 있는 사탕 수
사탕수 = 돈 {{0}} 사탕가격
print(사탕수)
# 최대한 사탕을 구입하고 남은 돈
잔돈 = 돈 {{1}} 사탕가격      # 잔돈 = 돈 - (사탕수 * 사탕가격) 과 같은 결과
print(잔돈)`,
      blanks: [
        { answer: '//', width: 60, hint: '나눗셈의 몫만 필요합니다. 사탕은 반쪽으로 살 수 없으니까요.' },
        { answer: '%', width: 60, hint: '나누고 남은 것을 구하는 연산자입니다.' },
      ],
      expected: '41\n80',
      explain: '5000 // 120 = 41 (몫), 5000 % 120 = 80 (나머지). / 를 쓰면 41.666… 이 나옵니다.',
    }),

    blankTask({
      label: 'timer.py',
      template: `sec = {{0}}("초를 입력하시오: ")   # 사용자로부터 값을 입력받는 함수
print(type(sec))                     # <class 'str'> 출력
sec = {{1}}(sec)                     # 문자열 값을 정수형으로 형 변환
print(type(sec))                     # <class 'int'> 출력
min = sec {{2}} 60                    # 분(min)을 구하기 위해 알맞은 연산자
remainder = sec {{3}} 60              # 초(remainder)를 구하기 위해 알맞은 연산자
{{4}}(min, remainder)`,
      blanks: [
        { answer: 'input', width: 90, hint: '표준 입력을 받는 함수' },
        { answer: 'int', width: 70, hint: '문자열 → 정수' },
        { answer: '//', width: 60, hint: '전체 초를 60으로 나눈 몫이 분입니다' },
        { answer: '%', width: 60, hint: '60으로 나눈 나머지가 남은 초입니다' },
        { answer: 'print', width: 90, hint: '화면에 출력하는 함수' },
      ],
      inputs: '150',
      expected: "초를 입력하시오: <class 'str'>\n<class 'int'>\n2 30",
      explain: '150초 = 150 // 60 = 2분, 150 % 60 = 30초. input( ) 이 돌려준 값은 항상 str 이므로 int( ) 로 바꿔야 // 와 % 를 쓸 수 있습니다.',
    }),

    blankTask({
      label: 'login.py',
      template: `id = "python"
pw = "1234"
answer1 = input("아이디: ")
answer2 = input("패스워드: ")
idCheck = (id {{0}} answer1)
pwCheck = (pw {{0}} answer2)
print(idCheck {{1}} pwCheck)`,
      blanks: [
        { answer: '==', width: 60, hint: '두 값이 같은지 비교하는 연산자입니다. = 하나는 대입입니다!' },
        { answer: 'and', width: 70, hint: '아이디도 맞고 패스워드도 맞아야 통과입니다.' },
      ],
      inputs: 'python\n1234',
      expected: '아이디: 패스워드: True',
      explain: '== 는 비교, = 는 대입입니다. 둘 다 맞아야 하므로 and 로 묶습니다. 입력값을 2345 로 바꿔 실행하면 False 가 나옵니다.',
      tip: '위 「미리 넣어 둘 입력값」을 python / 2345 로 바꿔 다시 실행해 보세요. False 가 나옵니다.',
    }),

    h('h4', {}, '확인 문제'),
    quizSet([
      { q: [h('code', { class: 'inline' }, '17 // 5'), ' 의 결과는?'], answer: '3', width: 100,
        explain: '몫 연산자. 17 ÷ 5 = 3.4 이므로 소수점 이하를 버려 3입니다.' },
      { q: [h('code', { class: 'inline' }, '17 % 5'), ' 의 결과는?'], answer: '2', width: 100,
        explain: '나머지 연산자. 17 = 5×3 + 2 이므로 나머지는 2입니다.' },
      { q: [h('code', { class: 'inline' }, '17 / 5'), ' 의 결과는?'], answer: '3.4', width: 100,
        explain: '/ 는 실수 나눗셈입니다. 결과는 항상 float 이 됩니다.' },
      { q: ['어떤 수가 짝수인지 판별하려면 어떤 연산자를 써야 할까?'],
        type: 'choice', choices: ['/', '//', '%', '**'],
        answer: '%',
        explain: '2로 나눈 나머지가 0이면 짝수입니다. x % 2 == 0' },
      { q: [h('code', { class: 'inline' }, "'a' not in 'cute'"), ' 의 결과는?'],
        type: 'choice', choices: ['True', 'False'],
        answer: 'True',
        explain: "'cute' 안에 'a' 가 없으므로 not in 은 True 입니다." },
    ], { revealOnWrong: true }));
}
