/* ============================================================================
 * control.js — 학습지 ⑳㉑㉒ 제어 구조의 응용
 *   선택구조(if) · 반복구조(while·for) · 중첩구조.
 *   「조건 갈림길 확인기」와 「range 탐험기」로 눈에 안 보이는 흐름을 보이게 했다.
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
  root.append(...sheetHead('학습지 ⑳㉑㉒', 'Ⅲ-2. 프로그래밍 (4) 제어 구조의 응용',
    ['[12정03-07]'],
    ['순차·선택·반복 구조를 이용하여 프로그램을 작성할 수 있다.',
     '중첩구조의 필요성을 설명하고 활용한 프로그램을 작성할 수 있다.']));

  root.append(threeCard());
  root.append(ifCard());
  root.append(branchLab());
  root.append(ifPractice());
  root.append(loopCard());
  root.append(rangeLab());
  root.append(loopPractice());
  root.append(nestedCard());
}

/* ══════════════════ ① 제어구조 세 가지 ═════════════════════════════ */

function threeCard() {
  return card('① 알고리즘 설계 구조 (제어구조)',
    h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', {}, '순차 구조'), h('th', {}, '선택 구조'), h('th', {}, '반복 구조')),
      h('tr', {},
        h('td', {}, answer('시간의 순서에 따라 실행')),
        h('td', {}, answer('선택에 따라 서로 다른 명령을 실행')),
        h('td', {}, answer('조건을 만족하는 동안 특정 동작을 반복 실행'))),
      h('tr', {},
        h('td', { class: 'left' }, h('span', { class: 'chip' }, '예'), ' 여행을 갈 때 서울-대구-부산-울산 순으로 이동하는 경로',
          h('br', {}), h('span', { class: 'chip' }, '예'), ' 종이학을 접는 순서'),
        h('td', { class: 'left' }, h('span', { class: 'chip' }, '예'), ' 전자레인지로 음식을 데우는 순서',
          h('br', {}), h('span', { class: 'chip' }, '예'), ' 성향 테스트 (“예/아니오” 선택에 따라 질문과 결과가 달라짐)'),
        h('td', { class: 'left' }, h('span', { class: 'chip' }, '예'), ' 연필을 100자루 깎는 동작',
          h('br', {}), '(1자루 깎는 과정을 100회 반복 / 다 깎은 연필이 100개가 될 때까지 반복)')),
    )),
    h('p', { style: { marginTop: '14px' } }, '☞ ', h('b', {}, '중첩구조'), ': 제어구조 내부에 또 다른 제어구조가 존재하는 것'));
}

/* ══════════════════ ② 선택구조 문법 ════════════════════════════════ */

function ifCard() {
  return card('② 선택구조 — 조건문',
    h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', {}, '단순 if문'), h('th', {}, 'if ~ else문'), h('th', {}, 'if ~ elif ~ else문')),
      h('tr', {},
        h('td', { class: 'left' }, h('pre', { class: 'code' }, 'if 조건:\n    실행 명령')),
        h('td', { class: 'left' }, h('pre', { class: 'code' }, 'if 조건:\n    실행 명령1\nelse:\n    실행 명령2')),
        h('td', { class: 'left' }, h('pre', { class: 'code' }, 'if 조건1:\n    실행 명령1\nelif 조건2:\n    실행 명령2\nelse:\n    실행 명령3'))),
    )),
    note('bad', h('b', {}, '※ 유의사항 '),
      h('ul', { style: { margin: '6px 0 0', paddingLeft: '20px' } },
        h('li', {}, '콜론(:)을 찍어서 아직 문장이 끝나지 않음을 표시'),
        h('li', {}, h('b', {}, '들여쓰기'), '(tab 1번 또는 스페이스 4번)로 블록을 구분 — 반드시 해야 함'),
        h('li', {}, 'elif, else 는 if 문과 ', h('b', {}, '같은 들여쓰기 수준'), '으로'),
        h('li', {}, 'else 문에는 조건 없이 콜론(:)만 붙임 · 경우에 따라 else 이하는 생략 가능'),
        h('li', {}, 'elif 는 else if 의 줄임말로, 조건에 따라 여러 번 사용 가능'))),

    h('h4', {}, '학습지 예제 — 실행해 보기'),
    runner({
      label: 'even_odd.py',
      code: `x = int(input('정수:'))   # 키보드 입력받아 정수형으로 x에 대입
if x % 2 == 0:            # x가 2로 나누어 떨어지면
    result = '짝수'
else:
    result = '홀수'
print(result)`,
      inputs: '10',
      predict: true,
      tip: '입력값을 17 로 바꿔 다시 실행해 보세요.',
    }),
    runner({
      label: 'pos_neg.py',
      code: `num = int(input("정수 입력:"))
if num < 0:
    print("음수이다.")
elif num == 0:
    print("0이다.")
else:
    print("양수이다.")`,
      inputs: '-10',
      predict: true,
      tip: '입력값을 0, 5 로 바꿔 세 갈래가 모두 동작하는지 확인해 보세요.',
    }),
    runner({
      label: 'pos_neg2.py — 중첩 조건문',
      code: `num = float(input("수 입력:"))
if num >= 0 :
    if num == 0 :
        print("0이다.")
    else:
        print("양수이다.")
else:
    print("음수이다.")`,
      inputs: '0.09',
      predict: true,
      tip: 'if~else 문장 안에는 여러 개의 if~else 문이 포함될 수 있습니다. 들여쓰기로 중첩의 수준을 나타냅니다.',
    }));
}

/* ══════════════════ ③ 조건 갈림길 확인기 ═══════════════════════════ */

const BRANCH_DEMO = {
  score: {
    name: '성적 → 등급',
    input: { label: '점수', min: 0, max: 100, init: 82 },
    lines: [
      { t: 'score = int(input("점수: "))', k: 'plain' },
      { t: 'if score >= 90:', k: 'cond', test: (v) => v >= 90 },
      { t: '    print("A")', k: 'body', of: 1 },
      { t: 'elif score >= 80:', k: 'cond', test: (v) => v >= 80 },
      { t: '    print("B")', k: 'body', of: 3 },
      { t: 'elif score >= 70:', k: 'cond', test: (v) => v >= 70 },
      { t: '    print("C")', k: 'body', of: 5 },
      { t: 'else:', k: 'else' },
      { t: '    print("D")', k: 'body', of: 7 },
    ],
  },
  grade: {
    name: '내신 등급 → 수준 (학습지 ㉒)',
    input: { label: '내신 등급', min: 1, max: 9, init: 4 },
    lines: [
      { t: 'myGrade = 입력값', k: 'plain' },
      { t: 'if myGrade <= 3:', k: 'cond', test: (v) => v <= 3 },
      { t: '    myLevel = "상위권"', k: 'body', of: 1 },
      { t: 'elif myGrade <= 6:', k: 'cond', test: (v) => v <= 6 },
      { t: '    myLevel = "중위권"', k: 'body', of: 3 },
      { t: 'else:', k: 'else' },
      { t: '    myLevel = "하위권"', k: 'body', of: 5 },
    ],
  },
  weight: {
    name: '수하물 수수료 (학습지 ⑳ 실습지)',
    input: { label: '무게(kg)', min: 0, max: 40, init: 22 },
    lines: [
      { t: '무게 = float(input("수하물의 무게(kg)는?"))', k: 'plain' },
      { t: 'if 무게 >= 20:', k: 'cond', test: (v) => v >= 20 },
      { t: '    print("무거운 짐은 2만원을 내셔야 합니다.")', k: 'body', of: 1 },
      { t: 'else:', k: 'else' },
      { t: '    print("짐에 대한 수수료는 없습니다.")', k: 'body', of: 3 },
    ],
  },
};

function branchLab() {
  let key = 'score';
  let value = BRANCH_DEMO[key].input.init;

  const codeBox = h('div', {});
  const sliderBox = h('div', {});
  const pickBox = h('div', { class: 'row tight' });

  function draw() {
    const demo = BRANCH_DEMO[key];
    clear(codeBox);

    // 위에서부터 조건을 따져 내려가며, 처음으로 참이 된 조건의 몸통만 실행된다
    let decided = -1;
    const state = demo.lines.map(() => 'skip');
    for (let i = 0; i < demo.lines.length; i++) {
      const ln = demo.lines[i];
      if (ln.k === 'plain') { state[i] = 'run'; continue; }
      if (decided >= 0) { state[i] = ln.k === 'cond' ? 'never' : 'skip'; continue; }
      if (ln.k === 'cond') {
        const ok = ln.test(value);
        state[i] = ok ? 'true' : 'false';
        if (ok) decided = i;
      } else if (ln.k === 'else') {
        state[i] = 'true'; decided = i;
      }
    }
    demo.lines.forEach((ln, i) => {
      if (ln.k !== 'body') return;
      state[i] = state[ln.of] === 'true' ? 'run' : 'skip';
    });

    const pre = h('pre', { class: 'code', style: { lineHeight: '1.9' } });
    demo.lines.forEach((ln, i) => {
      const st = state[i];
      const bg = st === 'run' ? 'rgba(30,190,120,.28)' : st === 'true' ? 'rgba(30,190,120,.18)'
        : st === 'false' ? 'rgba(207,48,48,.16)' : st === 'never' ? 'transparent' : 'transparent';
      const color = st === 'skip' || st === 'never' ? '#6b7688' : '#e6ebf3';
      const mark = st === 'true' ? '  ✔ 참' : st === 'false' ? '  ✘ 거짓' : st === 'never' ? '  (검사하지 않음)' : '';
      pre.append(h('div', {
        style: { background: bg, color, borderRadius: '5px', padding: '0 6px' },
      }, ln.t, h('span', { style: { color: st === 'true' ? '#5ee0a8' : '#ff9a9a', fontWeight: '800' } }, mark)));
    });
    codeBox.append(pre);
  }

  function paintSlider() {
    const demo = BRANCH_DEMO[key];
    clear(sliderBox);
    const out = h('b', { class: 'big-num' }, String(value));
    const inp = h('input', {
      type: 'range', min: demo.input.min, max: demo.input.max, value,
      style: { flex: '1', minWidth: '200px' },
      oninput: () => { value = Number(inp.value); out.textContent = String(value); draw(); },
    });
    sliderBox.append(h('div', { class: 'row' }, h('label', { class: 'field' }, demo.input.label), inp, out));
  }

  function paintPick() {
    clear(pickBox);
    pickBox.append(h('span', { class: 'chip' }, '예제'));
    Object.entries(BRANCH_DEMO).forEach(([k, d]) => pickBox.append(h('button', {
      type: 'button', class: 'btn small' + (k === key ? '' : ' ghost'),
      onclick: () => { key = k; value = d.input.init; paintPick(); paintSlider(); draw(); },
    }, d.name)));
  }

  paintPick(); paintSlider(); draw();

  return card('③ 조건 갈림길 확인기 — 어느 줄이 실행될까',
    h('p', { class: 'lead' }, '막대를 밀어 값을 바꿔 보세요. ',
      h('b', { style: { color: '#12855a' } }, '초록색'), ' 줄이 실제로 실행되는 줄이고, ',
      h('b', { style: { color: '#cf3030' } }, '빨간색'), ' 은 조건이 거짓이라 건너뛰는 줄입니다.'),
    pickBox,
    h('div', { style: { height: '10px' } }),
    sliderBox,
    h('div', { style: { height: '10px' } }),
    codeBox,
    note('warn', h('b', {}, '중요 '),
      'elif 는 ', h('b', {}, '앞의 조건이 모두 거짓일 때만'), ' 검사합니다. ',
      '앞에서 참이 나오면 뒤의 조건은 아예 보지도 않습니다(회색). ',
      '그래서 조건을 쓰는 ', h('b', {}, '순서'), '가 아주 중요합니다. ',
      '「성적 → 등급」에서 if 와 elif 의 순서를 거꾸로(70 → 80 → 90) 쓰면 어떻게 될까요?'));
}

/* ══════════════════ ④ 선택구조 실습 ════════════════════════════════ */

function ifPractice() {
  return card('④ 선택구조 실습 — 학습지 ⑳ 실습지',

    blankTask({
      label: 'weightCheck2.py',
      template: `수수료 = 0                    # 변수 수수료의 값을 0으로 초기화
짐_개수 = int(input("짐은 몇 개 입니까?"))
초과여부 = input("하나라도 짐의 무게가 20kg 이상입니까? (네: y, 아니오: n)")
if 짐_개수 {{0}} 2:
    print("2개 이상이면 3만원 추가됩니다.")
    수수료 {{1}} 30000
if 초과여부 {{2}} 'y':
    print("무거운 짐이 있어서 2만원 추가됩니다.")
    수수료 {{1}} 20000
print("총 수수료는", 수수료, "원입니다.")`,
      blanks: [
        { answer: '>=', width: 60, hint: '「2개 이상」 을 나타내는 비교연산자' },
        { answer: '+=', width: 60, hint: '기존 값에 더해서 다시 저장하는 축약형 대입 연산자' },
        { answer: '==', width: 60, hint: '같은지 비교하는 연산자' },
      ],
      inputs: '3\ny',
      expected: '짐은 몇 개 입니까?하나라도 짐의 무게가 20kg 이상입니까? (네: y, 아니오: n)2개 이상이면 3만원 추가됩니다.\n무거운 짐이 있어서 2만원 추가됩니다.\n총 수수료는 50000 원입니다.',
      explain: '두 조건이 서로 독립이므로 elif 가 아니라 if 두 개를 나란히 씁니다. 둘 다 참이면 30000 + 20000 = 50000원이 됩니다.',
      tip: '입력값을 1 / n 으로 바꿔 실행하면 수수료가 0원이 됩니다.',
    }),

    blankTask({
      label: 'compare.py — 두 정수 중 큰 수 출력',
      template: `x = int(input('첫 번째 정수: '))
y = int(input('두 번째 정수: '))
if x > y :
    print('큰 수는', {{0}} )
{{1}} x == y:
    print('두 정수가 같습니다.')
else:
    print('큰 수는', {{2}} )`,
      blanks: [
        { answer: 'x', width: 50, hint: 'x 가 더 클 때이므로…' },
        { answer: 'elif', width: 80, hint: 'else if 의 줄임말' },
        { answer: 'y', width: 50, hint: 'x 가 크지도 같지도 않으면 y 가 큽니다' },
      ],
      inputs: '7\n12',
      expected: '첫 번째 정수: 두 번째 정수: 큰 수는 12',
      explain: 'x > y 가 거짓, x == y 도 거짓이면 남은 경우는 y 가 큰 경우뿐입니다.',
    }),

    blankTask({
      label: 'daysOfMonth.py — 각 달의 마지막 날',
      template: `month = int(input("월을 입력하라: "))
if (month == 2) :
    print(str(month)+"월의 마지막 날은 29일")
elif (month == 4 {{0}} month == 6 {{0}} month == 9 {{0}} month == 11) :
    print(str(month)+"월의 마지막 날은 30일")
else:
    print(str(month)+"월의 마지막 날은 31일")`,
      blanks: [
        { answer: 'or', width: 60, hint: '4월이거나 6월이거나 9월이거나 11월이면 — 하나만 맞아도 됩니다' },
      ],
      inputs: '9',
      expected: '월을 입력하라: 9월의 마지막 날은 30일',
      explain: 'and 를 쓰면 「4월이면서 동시에 6월」이라는 불가능한 조건이 되어 항상 거짓이 됩니다. 반드시 or 입니다.',
      tip: '※ month 가 1 미만이거나 12 초과일 때 "올바르지 않은 입력" 을 출력하도록 코드를 고쳐 보세요.',
    }),

    blankTask({
      label: 'orange.py — 중첩 조건문',
      template: `품질 = input("품질을 입력: ")
가격 = int(input("오렌지 1개당 가격(원): "))
if 품질 == "신선":
    {{0}} 가격 < 1000:
        print("10개 산다.")
    {{1}}
        print("5개 산다.")
else:
    print("오렌지를 사지 않는다.")`,
      blanks: [
        { answer: 'if', width: 50, hint: '신선한 오렌지 안에서 다시 가격을 따집니다' },
        { answer: 'else:', width: 80, hint: '가격이 1000원 이상일 때. 콜론(:)까지 써야 합니다' },
      ],
      inputs: '신선\n1500',
      expected: '품질을 입력: 오렌지 1개당 가격(원): 5개 산다.',
      explain: '바깥 if 로 품질을 먼저 따지고, 그 안에서 다시 if 로 가격을 따지는 중첩 조건문입니다. 들여쓰기가 중첩의 수준을 나타냅니다.',
      tip: '품질을 「시듦」 으로 바꿔 실행해 보세요. 가격은 아예 따지지도 않습니다.',
    }));
}

/* ══════════════════ ⑤ 반복구조 문법 ════════════════════════════════ */

function loopCard() {
  return card('⑤ 반복구조 — while문과 for문',
    h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', { colspan: 2 }, 'while문'), h('th', {}, 'for문')),
      h('tr', {}, h('th', {}, '조건을 만족하는 동안 반복'), h('th', {}, '무조건 반복'), h('th', {}, '특정 횟수만큼 반복')),
      h('tr', {},
        h('td', { class: 'left' }, h('pre', { class: 'code' }, 'while 조건:\n    실행 명령')),
        h('td', { class: 'left' }, h('pre', { class: 'code' }, 'while True:\n    실행 명령')),
        h('td', { class: 'left' }, h('pre', { class: 'code' }, 'for 변수 in range(반복 횟수):\n    실행 명령'))),
    )),
    note('bad', h('b', {}, '※ 유의사항 '),
      '콜론(:)을 찍어서 반복될 명령의 시작을 알립니다. ',
      h('b', {}, '들여쓰기를 하지 않으면 반복되지 않으며'), ', 여러 명령을 쓸 때 서로 다른 크기로 들여쓰면 오류가 납니다. ',
      'for 문으로 작성한 프로그램은 while 문으로도 대부분 구현 가능합니다.'),
    note('warn', h('b', {}, '무한루프 '),
      'while 문에서 조건이 False 로 바뀔 기회가 없어 코드가 무한히 반복되는 루프입니다. ',
      'IDLE 에서는 ', h('span', { class: 'kbd' }, 'Ctrl'), ' + ', h('span', { class: 'kbd' }, 'C'), ' 로 멈춥니다. ',
      '(이 앱에서는 출력이 3000줄을 넘으면 자동으로 멈춰 줍니다.)'),

    h('h4', {}, 'range( ) 함수'),
    h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', { class: 'left' }, '표현 형태'), h('th', { class: 'left' }, '의미')),
      h('tr', {}, h('td', { class: 'left mono' }, 'for 변수 in range(숫자)'), h('td', { class: 'left' }, '변수의 값이 0부터 ', answer('숫자 −1'), '까지 1씩 증가')),
      h('tr', {}, h('td', { class: 'left mono' }, 'for 변수 in range(시작값, 종료값, 증감값)'), h('td', { class: 'left' }, '변수의 값이 시작값에서 ', h('b', {}, '종료값 전까지'), ' 증감값만큼 변화')),
    )),
    h('p', {}, '※ for 문에서의 변수는 반복 횟수를 셀 때 사용되어 루프 ', answer('제어변수'), '라고 합니다.'),

    h('h4', {}, '▣ 결과를 예상하고 실행 결과와 비교해 보자'),
    runner({ code: `a = 1\nwhile a < 6:\n    print(a)\n    a = a + 1`, predict: true, minRows: 4 }),
    runner({
      code: `a = 1\nwhile a < 5:\n    print(a)`, predict: true, minRows: 3,
      tip: '⚠️ 이 코드는 무한루프입니다. a 값이 바뀌지 않아 조건이 영원히 참입니다. 실행하면 1이 3000줄 나오고 멈춥니다. 어떻게 고쳐야 할까요?',
    }),
    runner({ code: `for a in range(5):\n    print(a)`, predict: true, minRows: 3 }),
    runner({ code: `for a in range(0, 6, 1):\n    print(a)`, predict: true, minRows: 3 }));
}

/* ══════════════════ ⑥ range 탐험기 ═════════════════════════════════ */

function rangeLab() {
  let start = 0, stop = 10, step = 1;
  const out = h('div', {});

  function mkSlider(label, get, set, min, max) {
    const o = h('b', { class: 'big-num', style: { fontSize: '1.05rem', minWidth: '48px', textAlign: 'right' } }, String(get()));
    const i = h('input', {
      type: 'range', min, max, value: get(), style: { flex: '1', minWidth: '140px' },
      oninput: () => { set(Number(i.value)); o.textContent = i.value; draw(); },
    });
    return h('div', { class: 'row' }, h('label', { class: 'field', style: { width: '80px' } }, label), i, o);
  }

  function draw() {
    clear(out);
    const vals = [];
    if (step !== 0) {
      for (let v = start, n = 0; (step > 0 ? v < stop : v > stop) && n < 200; v += step, n++) vals.push(v);
    }

    const code = step === 1 && start === 0
      ? `for i in range(${stop}):`
      : step === 1
        ? `for i in range(${start}, ${stop}):`
        : `for i in range(${start}, ${stop}, ${step}):`;

    out.append(
      h('pre', { class: 'code', style: { marginBottom: '12px' } }, `${code}\n    print(i)`),
      h('div', { class: 'row tight', style: { marginBottom: '10px' } },
        h('span', { class: 'chip' }, `i 가 되는 값 ${vals.length}개`),
        vals.length
          ? vals.map((v) => h('span', {
              style: { fontFamily: 'var(--mono)', fontWeight: '800', padding: '5px 10px', borderRadius: '7px', background: '#e9f3ff', border: '2px solid #bcd7fb', color: '#1e4f96' },
            }, String(v)))
          : h('span', { style: { color: 'var(--bad)', fontWeight: '700' } }, '한 번도 반복하지 않습니다!')),
      h('table', { class: 'tbl', style: { maxWidth: '440px' } },
        h('tr', {}, h('th', {}, '반복 횟수'), h('th', {}, 'i 의 첫 값'), h('th', {}, 'i 의 마지막 값'), h('th', {}, '합계')),
        h('tr', {},
          h('td', { class: 'mono' }, String(vals.length)),
          h('td', { class: 'mono' }, vals.length ? String(vals[0]) : '－'),
          h('td', { class: 'mono' }, vals.length ? String(vals[vals.length - 1]) : '－'),
          h('td', { class: 'mono' }, String(vals.reduce((a, b) => a + b, 0))))));

    if (step > 0 && stop <= start) out.append(note('bad', '시작값이 종료값보다 크거나 같은데 증감값이 양수라 한 번도 실행되지 않습니다.'));
    if (step < 0 && stop >= start) out.append(note('bad', '증감값이 음수인데 종료값이 시작값보다 커서 한 번도 실행되지 않습니다.'));
  }
  draw();

  return card('⑥ range( ) 탐험기 — 몇 번 반복될까',
    h('p', { class: 'lead' }, '세 막대를 밀어 보세요. ',
      h('b', {}, '종료값은 포함되지 않는다'), '는 것이 가장 헷갈리는 부분입니다.'),
    mkSlider('시작값', () => start, (v) => { start = v; }, -10, 20),
    mkSlider('종료값', () => stop, (v) => { stop = v; }, -10, 20),
    mkSlider('증감값', () => step, (v) => { step = v; }, -5, 5),
    h('div', { class: 'row tight', style: { margin: '10px 0' } },
      h('span', { class: 'chip' }, '학습지 예제'),
      [[0, 5, 1], [0, 6, 1], [1, 10, 1], [0, 11, 1], [10, 0, -1]].map(([a, b, c]) => h('button', {
        type: 'button', class: 'btn ghost small',
        onclick: () => {
          start = a; stop = b; step = c;
          [...document.querySelectorAll('input[type=range]')];
          draw();
          // 막대 위치도 함께 맞춘다
          const rows = out.parentElement.querySelectorAll('input[type=range]');
          if (rows.length >= 3) {
            rows[0].value = a; rows[1].value = b; rows[2].value = c;
            rows.forEach((r) => { const o = r.nextSibling; if (o) o.textContent = r.value; });
          }
        },
      }, `range(${c === 1 && a === 0 ? b : c === 1 ? `${a}, ${b}` : `${a}, ${b}, ${c}`})`)),
    ),
    out);
}

/* ══════════════════ ⑦ 반복구조 실습 ════════════════════════════════ */

function loopPractice() {
  return card('⑦ 반복구조 실습',
    h('h4', { style: { marginTop: '0' } }, '1부터 10까지의 합 — 세 가지 방법'),
    runner({
      label: 'hap1.py — while문',
      code: `hap = 0               # 연산 결과를 저장할 변수 hap 선언
i = 1                 # while 반복문의 조건에 활용할 변수 i 선언
while i <= 10:        # i 가 10보다 작거나 같은 동안 실행 명령 반복
    hap = hap + i     # hap 에는 hap 의 기존값과 i 의 합을 저장
    i += 1            # i 값 1씩 증가
print("1부터 10까지의 합은", hap, "입니다.")`,
      predict: true,
      tip: 'i += 1 을 지우고 실행하면 어떻게 될까요? (무한루프가 되어 3000줄에서 멈춥니다)',
    }),
    runner({
      label: 'hap2.py — for문',
      code: `hap = 0
for i in range(11):   # i 를 0부터 10까지
    hap = hap + i
print("1부터 10까지의 합은", hap, "입니다.")`,
      predict: true,
      tip: 'range(11) 이 아니라 range(10) 이면 결과가 어떻게 달라질까요?',
    }),
    runner({
      label: 'hap3.py — 거꾸로 세는 for문',
      code: `hap = 0
for i in range(10, 0, -1):   # i 를 10부터 1까지 1씩 감소
    hap = hap + i
print("1부터 10까지의 합은", hap, "입니다.")`,
      predict: true,
    }),

    h('h4', {}, '▣ 구구단'),
    blankTask({
      label: 'gugudan2.py — 2단 출력',
      template: `for i in range({{0}}, {{1}}, 1):
    print("2 *", i , "=", 2 {{2}} i)`,
      blanks: [
        { answer: '1', width: 50, hint: '2단은 2×1 부터 시작합니다' },
        { answer: '10', width: 55, hint: '2×9 까지 나와야 합니다. 종료값은 포함되지 않는다는 것을 기억하세요' },
        { answer: '*', width: 45, hint: '곱셈 연산자' },
      ],
      expected: '2 * 1 = 2\n2 * 2 = 4\n2 * 3 = 6\n2 * 4 = 8\n2 * 5 = 10\n2 * 6 = 12\n2 * 7 = 14\n2 * 8 = 16\n2 * 9 = 18',
      explain: 'range(1, 10, 1) 은 1, 2, 3, …, 9 를 만듭니다. 종료값 10은 포함되지 않습니다.',
    }),

    note('warn', h('b', {}, '※ 생각해 보기 '),
      '① 구구단 2단을 출력하는 while 반복문을 작성해 보세요. ',
      '② 입력받은 자연수에 해당하는 구구단을 출력하는 코드를 작성해 보세요.'),
    runner({
      label: '스스로 해 보기',
      code: `# ① while 문으로 2단 출력하기
i = 1
while i <= 9:
    print("2 *", i, "=", 2*i)
    i += 1

# ② 입력받은 단 출력하기 — 아래 주석을 지우고 완성해 보세요
# dan = int(input("몇 단? "))
# for i in range(1, 10):
#     print(dan, "*", i, "=", dan*i)`,
      inputs: '7',
      minRows: 10,
    }));
}

/* ══════════════════ ⑧ 중첩구조 ═════════════════════════════════════ */

function nestedCard() {
  return card('⑧ 중첩구조 — 학습지 ㉒ 내신 등급 계산 프로그램',
    h('p', {}, '☞ ', h('b', {}, '중첩구조'), ': 제어구조 내부에 또 다른 제어구조가 존재하는 것'),

    h('h4', {}, 'Step 1. 문제 이해 및 분석'),
    h('ul', {},
      h('li', {}, h('b', {}, '처리'), ' — 학기별 평균 내신 등급 = (과목별 ‘단위 수 × 석차 등급’의 합) ÷ 학기 전체 단위 수',
        h('br', {}), '전체학기 평균 내신 등급 = (‘학기별 평균 내신 등급’의 합) ÷ 총 학기 수'),
      h('li', {}, h('b', {}, '입력'), ' — 여러 과목을 반복 입력, 여러 학기를 반복 입력 → ', h('b', {}, '중첩 반복구조')),
      h('li', {}, h('b', {}, '출력'), ' — 내신 등급에 따라 상위권(1~3) / 중위권(4~6) / 하위권(7~9) → ', h('b', {}, '중첩 선택구조'))),

    h('h4', {}, '먼저 중첩 for문 익히기 — 구구단 전체'),
    runner({
      code: `for dan in range(2, 10):        # 바깥 반복: 2단부터 9단까지
    print("=== ", dan, "단 ===")
    for i in range(1, 10):      # 안쪽 반복: 1부터 9까지
        print(dan, "*", i, "=", dan*i)`,
      predict: false,
      tip: '바깥 반복이 한 번 돌 때마다 안쪽 반복이 처음부터 끝까지 다 돕니다. 그래서 8 × 9 = 72줄이 출력됩니다.',
      minRows: 5,
    }),

    h('h4', {}, 'Step 3. 프로그래밍 — 빈칸을 채워 완성해 봅시다'),
    blankTask({
      label: 'myGrade.py',
      template: `print("[내신 등급 계산 프로그램]")
myGrade = 0
sumGrade = 0
termCount = int(input("계산할 학기 수 입력(1~6): "))
{{0}} i in range(termCount):          # 학기 수만큼 반복
    totUnit = 0
    totGrade = 0
    subjectCount = int(input("학기 과목 수 입력: "))
    {{1}} j in range(subjectCount):    # 그 학기의 과목 수만큼 반복 (중첩!)
        unit = int(input("과목 단위 수: "))
        grade = int(input("석차 등급: "))
        totUnit += unit
        totGrade += grade {{2}} unit
    termGrade = totGrade / totUnit
    sumGrade += termGrade
myGrade = sumGrade / termCount
print("전체 내신 등급은", myGrade, "입니다.")
if myGrade {{3}} 3:
    myLevel = "상위권"
elif myGrade <= 6:
    myLevel = "중위권"
else:
    myLevel = "하위권"
print("수준은", myLevel, "입니다.")`,
      blanks: [
        { answer: 'for', width: 55, hint: '정해진 횟수만큼 반복하는 반복문' },
        { answer: 'for', width: 55, hint: '바깥 반복 안에 들어가는 또 하나의 반복문' },
        { answer: '*', width: 45, hint: '단위 수 × 석차 등급' },
        { answer: '<=', width: 55, hint: '1~3등급이 상위권입니다' },
      ],
      inputs: '2\n2\n3\n2\n4\n1\n1\n2\n3',
      expected: `[내신 등급 계산 프로그램]
계산할 학기 수 입력(1~6): 학기 과목 수 입력: 과목 단위 수: 석차 등급: 과목 단위 수: 석차 등급: 학기 과목 수 입력: 과목 단위 수: 석차 등급: 전체 내신 등급은 2.2142857142857144 입니다.
수준은 상위권 입니다.`,
      explain: '1학기: (3×2 + 4×1) ÷ (3+4) = 10/7 ≒ 1.4286 / 2학기: (2×3) ÷ 2 = 3 / 전체: (1.4286 + 3) ÷ 2 ≒ 2.2143 → 상위권',
      tip: '「미리 넣어 둘 입력값」에는 학기 수 2 → (과목 수 2, 단위 3 등급 2, 단위 4 등급 1) → (과목 수 1, 단위 2 등급 3) 이 차례로 들어 있습니다.',
    }),

    h('h4', {}, '확인 문제'),
    quizSet([
      { q: [h('code', { class: 'inline' }, 'for i in range(3):'), ' 안에 ', h('code', { class: 'inline' }, 'for j in range(4):'),
        ' 가 들어 있다면 안쪽 print 는 몇 번 실행될까?'],
        answer: '12', unit: '번', width: 100,
        hint: '바깥이 한 번 돌 때마다 안쪽이 몇 번 도는지 생각해 보세요.',
        explain: '3 × 4 = 12번. 바깥 반복 1회마다 안쪽이 4번씩 돕니다.' },
      { q: [h('code', { class: 'inline' }, 'range(1, 10)'), ' 이 만드는 값은 몇 개?'],
        answer: '9', unit: '개', width: 100,
        explain: '1부터 9까지 9개. 종료값 10은 포함되지 않습니다.' },
      { q: ['while 문이 무한루프가 되는 가장 흔한 원인은?'],
        type: 'choice', choices: ['조건에 쓰인 변수의 값이 바뀌지 않아서', '들여쓰기를 해서', 'print 를 써서'],
        answer: '조건에 쓰인 변수의 값이 바뀌지 않아서',
        explain: '조건이 False 로 바뀔 기회가 없으면 영원히 반복합니다. 반복문 안에서 변수를 꼭 바꿔 주어야 합니다.' },
      { q: ['반복 횟수가 미리 정해져 있을 때 쓰기 좋은 반복문은?'],
        type: 'choice', choices: ['for문', 'while문', '둘 다 안 된다'],
        answer: 'for문',
        explain: '횟수가 정해져 있으면 for + range 가 간결합니다. 횟수와 상관없이 조건이 만족되는 동안 반복해야 하면 while 이 알맞습니다.' },
    ], { revealOnWrong: true }),

    note('ok', h('b', {}, '📄 수행평가 제출 안내 '),
      '코드파일의 이름을 「학번 이름」(예: 10901 딩동댕)으로 저장하고, 파이썬 소스코드 파일의 확장자는 ',
      h('code', { class: 'inline' }, '.py'), ' 입니다. ',
      '닫은 코드창을 다시 여는 방법 — ① File-Open-파일 클릭 ② 파일 아이콘 우클릭 - Edit with IDLE'));
}
