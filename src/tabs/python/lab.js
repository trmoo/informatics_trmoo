/* ============================================================================
 * lab.js — 파이썬 자유 실습실
 *   설치도 인터넷도 없이 그 자리에서 코드를 써 보는 곳.
 *   도전 과제는 실행 결과를 자동으로 채점한다.
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

import { h, card, sheetHead, note, clear } from '../../lib/ui.js';
import { runner } from '../../lib/runner.js';
import { runPython } from '../../lib/pymini.js';
import { norm } from '../../lib/ui.js';

export function render(root) {
  root.append(...sheetHead('', '파이썬 자유 실습실', [], []));
  root.append(freeCard());
  root.append(challengeCard());
  root.append(refCard());
}

/* ══════════════════ ① 자유 실습 ════════════════════════════════════ */

const TEMPLATES = {
  '빈 코드': '',
  '변수와 출력': `이름 = "홍길동"
나이 = 17
print(이름, "님은", 나이, "살입니다.")
print("내년에는", 나이 + 1, "살이 됩니다.")`,
  '입력받아 계산': `a = int(input("첫 번째 수: "))
b = int(input("두 번째 수: "))
print("합:", a + b)
print("차:", a - b)
print("곱:", a * b)
print("몫:", a // b)
print("나머지:", a % b)`,
  '조건문': `점수 = int(input("점수를 입력하세요: "))
if 점수 >= 90:
    print("A 등급")
elif 점수 >= 80:
    print("B 등급")
elif 점수 >= 70:
    print("C 등급")
else:
    print("D 등급")`,
  '반복문': `합 = 0
for i in range(1, 101):
    합 = 합 + i
print("1부터 100까지의 합은", 합)`,
  '중첩 반복문': `for i in range(1, 6):
    줄 = ""
    for j in range(i):
        줄 = 줄 + "★"
    print(줄)`,
  '리스트': `점수 = [88, 92, 75, 100, 63]
print("과목 수:", len(점수))
print("총점:", sum(점수))
print("평균:", sum(점수) / len(점수))
print("최고점:", max(점수))
print("최저점:", min(점수))

for i in range(len(점수)):
    print(i + 1, "번째 과목:", 점수[i])`,
  '함수 만들기': `def 넓이구하기(가로, 세로):
    return 가로 * 세로

print("3 x 4 =", 넓이구하기(3, 4))
print("7 x 5 =", 넓이구하기(7, 5))`,
  '무작위 수': `import random

for i in range(5):
    print("주사위:", random.randint(1, 6))`,
};

function freeCard() {
  const holder = h('div', {});
  let current = '변수와 출력';

  function load(name) {
    current = name;
    clear(holder);
    holder.append(runner({ code: TEMPLATES[name], minRows: 12, inputs: name === '입력받아 계산' ? '17\n5' : name === '조건문' ? '85' : '' }));
    paintPicker();
  }

  const picker = h('div', { class: 'row tight', style: { marginBottom: '12px' } });
  function paintPicker() {
    clear(picker);
    picker.append(h('span', { class: 'chip' }, '예제 불러오기'));
    Object.keys(TEMPLATES).forEach((k) => picker.append(h('button', {
      type: 'button', class: 'btn small' + (k === current ? '' : ' ghost'),
      onclick: () => load(k),
    }, k)));
  }

  load('변수와 출력');

  return card('① 자유롭게 써 보기',
    h('p', { class: 'lead' },
      '설치도 인터넷도 필요 없습니다. 코드를 고치고 [▶ 실행] 을 누르면 바로 결과가 나옵니다. ',
      h('span', { class: 'kbd' }, 'Tab'), ' 키로 들여쓰기를 할 수 있습니다.'),
    picker,
    holder);
}

/* ══════════════════ ② 도전 과제 ════════════════════════════════════ */

const CHALLENGES = [
  {
    title: '① 인사하기',
    desc: '이름을 입력받아 「○○님, 반갑습니다!」 라고 출력하는 프로그램을 만드세요.',
    start: `이름 = input()\n`,
    inputs: '김하늘',
    expected: '김하늘님, 반갑습니다!',
    hint: 'print(이름 + "님, 반갑습니다!") 처럼 문자열을 이어 붙이거나, print(이름, "님, 반갑습니다!") 를 쓰면 사이에 공백이 들어갑니다.',
  },
  {
    title: '② 삼각형의 넓이',
    desc: '밑변과 높이를 차례로 입력받아 삼각형의 넓이를 출력하세요. (밑변 12, 높이 5 를 넣으면 30.0 이 나와야 합니다)',
    start: `밑변 = int(input())\n높이 = int(input())\n`,
    inputs: '12\n5',
    expected: '30.0',
    hint: '삼각형의 넓이는 밑변 × 높이 ÷ 2 입니다. / 를 쓰면 결과가 실수(float)가 됩니다.',
  },
  {
    title: '③ 짝수만 출력',
    desc: '1부터 20까지의 수 중에서 짝수만 한 줄에 하나씩 출력하세요.',
    start: `for i in range(1, 21):\n`,
    inputs: '',
    expected: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20].join('\n'),
    hint: 'i % 2 == 0 이면 짝수입니다. 또는 range(2, 21, 2) 로 처음부터 짝수만 만들 수도 있습니다.',
  },
  {
    title: '④ 별 쌓기',
    desc: '★ 을 1개, 2개, 3개, 4개, 5개 순서로 다섯 줄 출력하세요.',
    start: `for i in range(1, 6):\n`,
    inputs: '',
    expected: ['★', '★★', '★★★', '★★★★', '★★★★★'].join('\n'),
    hint: '문자열에 * 를 쓰면 반복됩니다. "★" * 3 → ★★★',
  },
  {
    title: '⑤ 최댓값 찾기',
    desc: '리스트 [23, 91, 47, 8, 76] 에서 가장 큰 수를 max( ) 를 쓰지 않고 반복문으로 찾아 출력하세요.',
    start: `점수 = [23, 91, 47, 8, 76]\n최댓값 = 점수[0]\n`,
    inputs: '',
    expected: '91',
    hint: '리스트를 하나씩 돌면서 지금까지의 최댓값보다 크면 최댓값을 바꿔 줍니다.',
  },
  {
    title: '⑥ 구구단 한 단',
    desc: '단을 입력받아 그 단의 구구단을 「3 * 1 = 3」 형식으로 9줄 출력하세요. (3 을 입력한 경우)',
    start: `단 = int(input())\n`,
    inputs: '3',
    expected: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `3 * ${i} = ${3 * i}`).join('\n'),
    hint: 'print(단, "*", i, "=", 단*i) 로 쓰면 쉼표가 공백을 만들어 줍니다.',
  },
  {
    title: '⑦ 학점 계산기',
    desc: '점수를 입력받아 90 이상 A, 80 이상 B, 70 이상 C, 그 외 D 를 출력하세요. (85 를 입력한 경우)',
    start: `점수 = int(input())\n`,
    inputs: '85',
    expected: 'B',
    hint: 'if ~ elif ~ else 를 씁니다. 조건을 큰 수부터 차례로 쓰는 것이 중요합니다.',
  },
  {
    title: '⑧ 카운트다운',
    desc: 'while 문을 써서 5부터 1까지 거꾸로 출력하고 마지막에 「발사!」 를 출력하세요.',
    start: `n = 5\n`,
    inputs: '',
    expected: '5\n4\n3\n2\n1\n발사!',
    hint: 'while n >= 1: 안에서 print(n) 하고 n 을 1씩 줄입니다. 반복이 끝난 뒤에 발사! 를 출력합니다.',
  },
];

function challengeCard() {
  const box = h('div', {});

  CHALLENGES.forEach((c) => {
    const ta = h('textarea', {
      class: 'mono', rows: Math.max(5, c.start.split('\n').length + 3), spellcheck: 'false',
      style: {
        width: '100%', background: '#1c2230', color: '#e6ebf3', border: '2px solid #2c3547',
        borderRadius: '10px', padding: '12px 14px', lineHeight: '1.55', fontSize: '0.98rem',
        resize: 'vertical', tabSize: '4',
      },
    });
    ta.value = c.start;
    ta.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      e.preventDefault();
      const s = ta.selectionStart;
      ta.value = ta.value.slice(0, s) + '    ' + ta.value.slice(ta.selectionEnd);
      ta.selectionStart = ta.selectionEnd = s + 4;
    });

    const out = h('div', { class: 'console' }, h('div', { class: 'muted' }, '[제출하고 채점] 을 눌러 보세요.'));
    const verdict = h('div', { style: { minHeight: '28px', fontWeight: '700', marginTop: '8px' } });
    const hintBox = h('div', { class: 'hintbox', style: { display: 'none' } }, h('b', {}, '힌트 '), c.hint);
    const wrap = h('div', { class: 'quiz', style: { padding: '16px 18px' } });

    function grade() {
      const lines = c.inputs.split('\n').filter((s, i, a) => !(i === a.length - 1 && s === ''));
      const res = runPython(ta.value, { inputs: lines });
      clear(out);
      if (res.output) out.append(h('div', {}, res.output));
      if (!res.ok) out.append(h('div', { class: 'err' }, res.error));
      else if (!res.output) out.append(h('div', { class: 'muted' }, '(출력이 없습니다)'));

      // 안내 문구(input 의 인수)가 섞여도 되도록, 기대 출력이 결과 안에 들어 있으면 정답으로 본다
      const got = norm(res.output || '');
      const want = norm(c.expected);
      const ok = res.ok && (got === want || got.endsWith(want));
      wrap.classList.toggle('correct', ok);
      wrap.classList.toggle('wrong', !ok);
      verdict.style.color = ok ? 'var(--ok)' : 'var(--bad)';
      verdict.textContent = ok ? '⭕ 정답입니다! 다음 과제로 넘어가세요.'
        : res.ok ? '❌ 결과가 다릅니다. 아래 「이렇게 나와야 합니다」와 비교해 보세요.'
        : '❌ 오류가 났습니다. 빨간 글씨를 읽어 보세요.';
    }

    wrap.append(
      h('div', { class: 'q', style: { fontSize: '1.08rem' } }, c.title),
      h('p', { style: { margin: '0 0 10px', color: 'var(--ink-soft)' } }, c.desc),
      c.inputs ? h('div', { class: 'row tight', style: { marginBottom: '8px' } },
        h('span', { class: 'chip' }, '입력값'),
        h('span', { class: 'mono' }, c.inputs.split('\n').join(' , '))) : null,
      ta,
      h('div', { class: 'row', style: { marginTop: '10px' } },
        h('button', { type: 'button', class: 'btn', onclick: grade }, '▶ 제출하고 채점'),
        h('button', {
          type: 'button', class: 'btn gray small',
          onclick: () => { hintBox.style.display = hintBox.style.display === 'none' ? 'block' : 'none'; },
        }, '힌트'),
        h('button', { type: 'button', class: 'btn gray small', onclick: () => { ta.value = c.start; } }, '↺ 처음으로')),
      hintBox,
      out,
      verdict,
      h('details', { style: { marginTop: '10px' } },
        h('summary', { style: { cursor: 'pointer', fontWeight: '700', color: 'var(--ink-soft)' } }, '이렇게 나와야 합니다'),
        h('pre', { class: 'code', style: { marginTop: '6px', background: '#eef7f1', color: '#12674a', border: '1px solid #c3e8d7' } }, c.expected)));

    box.append(wrap, h('div', { style: { height: '14px' } }));
  });

  return card('② 도전 과제 — 스스로 완성해 보기',
    h('p', { class: 'lead' }, '앞부분만 적어 두었습니다. 나머지를 채워 「이렇게 나와야 합니다」와 같은 결과가 나오게 만드세요.'),
    box);
}

/* ══════════════════ ③ 쓸 수 있는 문법 ══════════════════════════════ */

function refCard() {
  const row = (a, b) => h('tr', {}, h('td', { class: 'left mono' }, a), h('td', { class: 'left' }, b));
  return card('③ 이 실습실에서 쓸 수 있는 문법',
    h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', { class: 'left', style: { width: '46%' } }, '문법'), h('th', { class: 'left' }, '설명')),
      row('변수 = 값', '변수 만들기 (한글 변수명도 됩니다)'),
      row('print(a, b, sep=", ", end="")', '출력. sep 와 end 도 씁니다'),
      row('input("안내문")', '입력. 「미리 넣어 둘 입력값」 칸에서 한 줄씩 읽습니다'),
      row('int() float() str() bool() type()', '형 변환과 자료형 확인'),
      row('+ - * / // % **', '산술 연산자'),
      row('< <= > >= == != in not in', '비교·포함 연산자'),
      row('and or not', '논리 연산자'),
      row('if / elif / else', '선택구조'),
      row('while / for x in range(...)', '반복구조'),
      row('break / continue / pass', '반복 제어'),
      row('[1, 2, 3]  리스트[0]  len() sum() max() min()', '리스트'),
      row('def 이름(매개변수): ... return', '함수 정의'),
      row('class 이름: ... __init__ ... self', '클래스와 인스턴스'),
      row('import random / import math', 'random.randint( ), math.sqrt( ) 등'),
    )),
    note('warn', h('b', {}, '쓸 수 없는 것 '),
      '파일 입출력, 딕셔너리 일부 기능, 외부 라이브러리(pandas·numpy 등), turtle, tkinter 는 지원하지 않습니다. ',
      '이 실습실은 교실 인터넷이 끊겨도 학습지 내용을 실행해 볼 수 있게 만든 ', h('b', {}, '수업용 미니 파이썬'), '입니다. ',
      '수행평가 과제는 IDLE 이나 실제 파이썬에서 작성하세요.'));
}
