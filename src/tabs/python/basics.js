/* ============================================================================
 * basics.js — 학습지 ⑯⑰ 프로그램 개발 환경 · 자료형 · 표준입출력
 *   변수명 규칙 검사기, 자료형 판별 연습, 그리고 학습지의 예제 코드를
 *   「예상 → 실행 → 비교」 순서로 그대로 해 볼 수 있게 했다.
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

import { h, card, sheetHead, note, answer, quizSet, clear, shuffle } from '../../lib/ui.js';
import { runner, blankTask } from '../../lib/runner.js';

export function render(root) {
  root.append(...sheetHead('학습지 ⑯⑰', 'Ⅲ-2. 프로그래밍 — 개발 환경 · 자료형 · 표준입출력',
    ['[12정03-04]', '[12정03-05]'],
    ['파이썬 프로그래밍 언어의 개발 환경 및 특성을 이해할 수 있다.',
     '자료형에 적합한 변수를 정의하고 이를 활용한 프로그램을 작성할 수 있다.',
     '표준입출력문을 활용한 프로그램을 작성할 수 있다.']));

  root.append(langCard());
  root.append(printCard());
  root.append(varNameCard());
  root.append(typeCard());
  root.append(ioCard());
  root.append(castCard());
}

/* ══════════════════ ① 프로그래밍 언어 ══════════════════════════════ */

function langCard() {
  return card('① 프로그램과 프로그래밍 언어',
    h('ul', {},
      h('li', {}, h('b', {}, '프로그램'), ' — 알고리즘을 프로그래밍 언어로 컴퓨터에서 실행 가능한 ',
        answer('명령어'), '의 집합으로 구성한 것. ',
        h('span', { class: 'chip' }, answer('임베디드'), ' 프로그램: 휴대폰·TV·자동차 등 전자기기에 내장되는 프로그램')),
      h('li', {}, h('b', {}, '프로그래밍'), ' ≒ 코딩 — 문제를 해결하기 위해 프로그램을 만드는 과정'),
      h('li', {}, h('b', {}, answer('기계어')), ' — 컴퓨터가 알아듣는 유일한 언어. 0과 1로 구성된 이진코드')),

    h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', {}, answer('저급'), ' 언어 (low-level)'), h('th', {}, answer('고급'), ' 언어 (high-level)')),
      h('tr', {},
        h('td', { class: 'left' },
          h('ul', { style: { margin: 0, paddingLeft: '18px' } },
            h('li', {}, answer('기계'), ' 중심의 언어'),
            h('li', {}, '컴퓨터가 바로 실행하거나 간단히 변환하여 실행'),
            h('li', {}, '프로그래밍이 어려움'),
            h('li', {}, '① 기계어 ② ', answer('어셈블리어'), ' — 기계어를 영문 명령어로 표현한 언어'))),
        h('td', { class: 'left' },
          h('ul', { style: { margin: 0, paddingLeft: '18px' } },
            h('li', {}, answer('인간'), ' 중심의 언어'),
            h('li', {}, '사람이 이해하기 쉽고 사용하기 편리한 형태'),
            h('li', {}, '기계어로 변환하는 과정이 필요'),
            h('li', {}, '① 텍스트 기반: C, Python, Java, C++, JavaScript ② 블록 기반: 엔트리, 스크래치')))),
    )),

    h('h4', {}, '파이썬 (Python)'),
    h('ul', {},
      h('li', {}, '1991년, 귀도 반 로섬(Guido van Rossum)이 개발'),
      h('li', {}, '텍스트 기반, 범용 프로그래밍 언어 · 인터프리터 방식 · 확장자 ', h('code', { class: 'inline' }, '.py')),
      h('li', {}, '뛰어난 ', answer('생산성'), ' — ① 쉽고 직관적인 문법 ② 풍부한 ', answer('라이브러리'), ' (= 모듈)')),

    note('', h('b', {}, '이 앱의 파이썬에 대하여 '),
      '아래 실습 상자는 교실 인터넷이 끊겨도 돌아가도록 만든 ', h('b', {}, '수업용 미니 파이썬'), '입니다. ',
      '학습지에 나오는 문법(변수·자료형·연산자·입출력·if·while·for·리스트)은 진짜 파이썬과 똑같이 동작하지만, ',
      '모든 파이썬 기능을 다 담고 있지는 않습니다. 실제 과제는 IDLE 에서 해 보세요.'));
}

/* ══════════════════ ② print() ═══════════════════════════════════════ */

function printCard() {
  return card('② 첫 코드 — print( )',
    h('p', {}, h('b', {}, '함수(function)'), ' — 특별한 작업을 수행하는 명령어들의 모임. ',
      '정의된 함수를 호출함으로써 실행시킵니다. 호출 형태는 ', h('code', { class: 'inline' }, '함수명(인수)'), '이고, ',
      h('b', {}, '인수(argument)'), '는 함수가 작업을 수행하는 데 필요한 데이터입니다.'),
    h('p', {}, '★ ', answer('주석'), ' — ', h('code', { class: 'inline' }, '#'), '를 이용하여 코드에 대한 설명을 작성. # 뒷부분은 실행에 영향을 주지 않습니다.'),

    runner({
      label: 'hello.py',
      code: `print('Hello World')  # 첫 코드
print("안녕하세요.", "여러분")
print("9*8은", 9*8, "입니다.\\n")
print("도레미" + "파솔라시")`,
      predict: true,
    }),

    note('warn', h('b', {}, '‘+’ 와 ‘,’ 의 차이 '),
      h('code', { class: 'inline' }, '+'), ' 로 문자열을 결합하면 띄어쓰기가 ', h('b', {}, '안 됩니다'), '. ',
      h('code', { class: 'inline' }, ','), ' 로 결합하면 띄어쓰기가 ', h('b', {}, '됩니다'), '. ',
      '위 코드에서 3번째 줄의 쉼표를 ', h('code', { class: 'inline' }, '+'), ' 로 바꿔 실행해 보세요 — 오류가 납니다. 왜 그럴까요?'),

    h('h4', {}, '일부러 틀려 보기 — 오류 문구 읽는 연습'),
    h('p', { class: 'lead' }, '아래 코드를 실행하면 오류가 납니다. 오류 문구를 읽고 무엇이 잘못됐는지 찾아 고쳐 보세요.'),
    runner({ code: `print(Hello World)`, minRows: 2 }),
    runner({ code: `print("Hello World)`, minRows: 2 }),
    note('', '▶ ', h('b', {}, '문자열(string)'), '은 큰따옴표(" ")나 작은따옴표(\' \') 안에 들어 있는 text 데이터 자료형입니다. ',
      '반드시 따옴표가 있어야 하고, 하나를 생략해도 오류가 발생합니다.'));
}

/* ══════════════════ ③ 변수명 규칙 검사기 ═══════════════════════════ */

const KEYWORDS = ['True', 'False', 'None', 'and', 'or', 'not', 'if', 'else', 'elif', 'for', 'while',
  'return', 'def', 'class', 'import', 'from', 'in', 'is', 'global', 'pass', 'break', 'continue',
  'try', 'except', 'finally', 'with', 'as', 'lambda', 'del', 'raise', 'yield', 'assert', 'nonlocal'];

/** 변수명이 규칙에 맞는지 하나하나 따져 본다. */
function checkName(name) {
  const rules = [];
  rules.push({ ok: name.length > 0, t: '비어 있지 않아야 한다' });
  rules.push({ ok: !/\s/.test(name), t: '이름 중간에 공백이 들어가면 안 된다' });
  rules.push({ ok: !/^\d/.test(name), t: '숫자로 시작할 수 없다' });
  rules.push({ ok: /^[A-Za-z_가-힣ㄱ-ㅎ][A-Za-z0-9_가-힣ㄱ-ㅎ]*$/.test(name) || name === '',
    t: '영문자·한글·숫자·언더바(_)만 쓸 수 있다' });
  rules.push({ ok: !KEYWORDS.includes(name), t: '파이썬 키워드는 변수명으로 쓸 수 없다' });
  return rules;
}

function varNameCard() {
  const inp = h('input', {
    type: 'text', class: 'mono', value: 'firstName',
    style: { width: '260px', fontSize: '1.15rem' }, oninput: draw,
  });
  const out = h('div', {});

  function draw() {
    const name = inp.value;
    const rules = checkName(name);
    const allOk = rules.every((r) => r.ok);
    clear(out);
    out.append(
      h('div', { class: 'note ' + (allOk ? 'ok' : 'bad'), style: { fontSize: '1.1rem', marginBottom: '10px' } },
        allOk ? `⭕ 「${name}」 은(는) 쓸 수 있는 변수명입니다.` : `❌ 「${name}」 은(는) 쓸 수 없습니다.`),
      h('ul', { style: { listStyle: 'none', padding: 0, margin: 0 } },
        rules.map((r) => h('li', { style: { color: r.ok ? 'var(--ok)' : 'var(--bad)', fontWeight: '700', padding: '2px 0' } },
          (r.ok ? '✔ ' : '✘ ') + r.t))));
  }
  draw();

  const samples = ['age', 'Age', '_', '변수', '1st', 'True', 'first name', 'firstName', 'my_score', 'print'];

  return card('③ 변수와 변수명 규칙',
    h('p', {}, h('b', {}, '변수(variable)'), ' — 프로그램 실행에 필요한 값을 저장하기 위한 ', answer('메모리 공간'), '. ',
      '‘변할 수 있는 수’라는 의미로 언제든 값을 변경할 수 있습니다.'),
    h('p', {}, h('code', { class: 'inline' }, '='), ' (대입연산자) — ', h('b', {}, '같다는 의미가 아니라'),
      ' 오른쪽의 값을 왼쪽 변수에 저장(할당)한다는 의미입니다. 파이썬에서 변수는 ', h('b', {}, '값이 저장되는 순간에 생성'), '됩니다.'),

    h('div', { class: 'row', style: { margin: '14px 0 10px' } },
      h('label', { class: 'field' }, '변수명을 쳐 보세요'), inp),
    h('div', { class: 'row tight', style: { marginBottom: '12px' } },
      h('span', { class: 'chip' }, '눌러서 넣기'),
      samples.map((s) => h('button', {
        type: 'button', class: 'btn ghost small',
        onclick: () => { inp.value = s; draw(); },
      }, s))),
    out,

    note('warn', h('b', {}, '낙타체(camelCase) '),
      '변수의 첫 글자는 소문자로, 나머지 단어의 첫 글자는 대문자로 적는 방법입니다. ',
      h('code', { class: 'inline' }, 'firstName'), ' 처럼요. 낙타 등처럼 봉우리가 생겨서 붙은 이름입니다. ',
      '규칙은 아니지만 저장된 값을 알 수 있는 ', h('b', {}, '의미 있는 이름'), '을 쓰는 것이 좋습니다.'),

    h('h4', {}, '직접 실행해서 확인하기'),
    runner({
      code: `age = 18
Age = 19
print(age, Age)     # 대소문자를 구분한다

_ = 3
변수 = 123
print(_, 변수)      # 언더바와 한글도 변수명이 된다

score = 20
score = 30
print(score)        # 마지막에 저장된 값만 남는다`,
      predict: true,
    }),
    note('', '아래 두 줄을 위 코드에 붙여 실행해 보세요. 각각 어떤 오류가 나는지 확인해 봅시다.',
      h('pre', { class: 'code', style: { marginTop: '8px' } }, '1st = 100\nTrue = 100')));
}

/* ══════════════════ ④ 자료형 ═══════════════════════════════════════ */

const TYPE_ITEMS = [
  ['1', 'int'], ['3.14', 'float'], ['3.0', 'float'], ["'a'", 'str'], ["'ok'", 'str'],
  ['"컴퓨터"', 'str'], ['"15000"', 'str'], ['True', 'bool'], ['False', 'bool'],
  ["''", 'str'], ["'123'", 'str'], ['0', 'int'], ['-7', 'int'], ['2.5', 'float'], ["'3.14'", 'str'],
];

function typeCard() {
  let items = shuffle(TYPE_ITEMS);
  let idx = 0, score = 0;
  const qBox = h('div', {});
  const btnBox = h('div', { class: 'row tight' });
  const logBox = h('div', { class: 'row tight', style: { flexWrap: 'wrap', marginTop: '12px' } });

  function paint() {
    clear(qBox); clear(btnBox);
    if (idx >= items.length) {
      qBox.append(h('div', { class: 'note ok', style: { fontSize: '1.1rem' } },
        `끝! ${items.length}문제 중 `, h('b', {}, `${score}개`), ' 정답.'));
      btnBox.append(h('button', {
        type: 'button', class: 'btn',
        onclick: () => { items = shuffle(TYPE_ITEMS); idx = 0; score = 0; clear(logBox); paint(); },
      }, '다시 하기'));
      return;
    }
    const [lit, ans] = items[idx];
    qBox.append(h('div', { style: { fontSize: '1.15rem', padding: '10px 0' } },
      `${idx + 1} / ${items.length}. `,
      h('code', { class: 'inline', style: { fontSize: '1.35rem', padding: '4px 12px' } }, `type(${lit})`),
      ' 의 결과는?'));
    ['int', 'float', 'str', 'bool'].forEach((t) => {
      btnBox.append(h('button', {
        type: 'button', class: 'btn' + (t === 'int' ? '' : ' ghost'),
        onclick: () => {
          const ok = t === ans;
          if (ok) score++;
          logBox.append(h('span', {
            class: 'chip',
            style: { fontFamily: 'var(--mono)', background: ok ? '#eefaf4' : '#fdeeee', color: ok ? 'var(--ok)' : 'var(--bad)', border: '1px solid currentColor' },
          }, `${ok ? '⭕' : '❌'} ${lit} → ${ans}`));
          idx++; paint();
        },
      }, `<class '${t}'>`));
    });
    btnBox.append(h('span', { class: 'spacer' }), h('span', { class: 'score' }, `${score}점`));
  }
  paint();

  return card('④ 자료형 (data type)',
    h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', { style: { width: '150px' } }, '자료형'), h('th', { class: 'left' }, '특성'), h('th', { style: { width: '150px' } }, '예시')),
      h('tr', {}, h('th', {}, '정수형 (int) ★'), h('td', { class: 'left', rowspan: 2 },
        '정수, 실수 등의 숫자로 이루어진 자료형. 실수형은 소수점이 존재. 주로 계산에 활용'), h('td', { class: 'mono' }, '1')),
      h('tr', {}, h('th', {}, '실수형 (float) ★'), h('td', { class: 'mono' }, '3.14 / 3.0')),
      h('tr', {}, h('th', {}, answer('문자열 (str)')), h('td', { class: 'left' },
        '0개 이상의 문자로 이루어진 자료형. 작은따옴표나 큰따옴표를 이용. ',
        h('b', {}, '※ 숫자도 따옴표로 묶으면 문자열로 인식')), h('td', { class: 'mono' }, "'a' / \"15000\"")),
      h('tr', {}, h('th', {}, answer('불 (bool)')), h('td', { class: 'left' }, '참(True)이나 거짓(False)의 논리값을 갖는 자료형'), h('td', { class: 'mono' }, 'True / False')),
    )),

    h('h4', {}, 'type( ) 판별 연습'),
    qBox, btnBox, logBox,

    h('h4', {}, '직접 확인해 보기'),
    runner({
      code: `a = 3
print(type(a))
print(type(3.14))
print(type(False))
print(type('a'))
print(type(''))
print(type('123'))`,
      predict: true,
      tip: '※ 숫자 vs 문자열 구분! \'123\', \'3.14\' 와 같이 숫자라도 따옴표가 있으면 문자열입니다.',
    }));
}

/* ══════════════════ ⑤ 표준입출력 ═══════════════════════════════════ */

function ioCard() {
  const codes = [
    { n: '①', code: `n1 = input()   # 15 입력\nprint(n1)`, inputs: '15' },
    { n: '②', code: `word = input()   # 파이썬 입력\nprint(word)`, inputs: '파이썬' },
    { n: '③', code: `p = input('숫자 입력: ')   # 0123 입력\nprint(p)`, inputs: '0123' },
    { n: '④', code: `a1 = input()   # 50 입력\na2 = input()   # 05 입력\nprint(a1 + a2)`, inputs: '50\n05' },
    { n: '⑤', code: `k = 30\nk = input()   # 40 입력\nprint(k)`, inputs: '40' },
    { n: '⑥', code: `h1 = input()   # 치킨 입력\nh2 = input()   # pizza 입력\nprint(h1+"h2")`, inputs: '치킨\npizza' },
  ];

  return card('⑤ 표준입출력',
    h('p', {}, '⌨️ 키보드 = ', answer('표준 입력'), ' 장치 ／ 🖥️ 모니터 = ', answer('표준 출력'), ' 장치'),
    h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', { style: { width: '110px' } }, ''), h('th', {}, '표준 입력'), h('th', {}, '표준 출력')),
      h('tr', {}, h('th', {}, '개념'),
        h('td', { class: 'left' }, '사용자로부터 ', answer('키보드'), '를 통해 자료를 한 줄씩 입력받는다. ',
          '숫자·문자 등 다양한 자료를 입력받을 수 있으며 자료형은 ', h('b', {}, answer('문자열'), '형'), '으로 저장된다.'),
        h('td', { class: 'left' }, '컴퓨터에서 처리한 결과를 ', answer('모니터'), '로 출력한다.')),
      h('tr', {}, h('th', {}, '활용 방식'), h('td', { class: 'mono' }, '변수명 = input(인수)'), h('td', { class: 'mono' }, 'print(인수)')),
      h('tr', {}, h('th', {}, '인수'), h('td', { class: 'left' }, '입력받을 내용을 안내하는 메시지 (\'문자열\', 생략 가능)'),
        h('td', { class: 'left' }, '출력할 내용. 변수, 값(숫자, \'문자열\', True, False) 등을 콤마로 구분')),
    )),

    note('bad', h('b', {}, '가장 많이 틀리는 곳 '),
      'input( ) 으로 받은 값은 ', h('b', {}, '무조건 문자열'), '입니다. ',
      '숫자를 넣어도 문자열이므로 ', h('code', { class: 'inline' }, "'50' + '05' = '5005'"),
      ' 가 됩니다. 계산하려면 반드시 ', h('code', { class: 'inline' }, 'int( )'), ' 로 바꿔야 합니다.'),

    h('h4', {}, '▣ 결과를 예상해 보고 실행 결과와 비교해 보자'),
    codes.map((c) => h('div', {},
      h('div', { class: 'row', style: { marginTop: '14px', marginBottom: '2px' } },
        h('span', { class: 'chip on' }, `코드 ${c.n}`)),
      runner({ code: c.code, inputs: c.inputs, predict: true, minRows: 3 }))));
}

/* ══════════════════ ⑥ 형 변환 ══════════════════════════════════════ */

function castCard() {
  return card('⑥ 자료형 변환 (형 변환)',
    h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', { style: { width: '110px' } }, '함수'), h('th', {}, '의미'), h('th', { class: 'left' }, '예')),
      h('tr', {}, h('th', { class: 'mono' }, 'int()'), h('td', {}, '실수나 문자열을 정수형으로 변환'),
        h('td', { class: 'left mono' }, "int(3.14) → 3  (소수점 이하 버림)", h('br', {}), "int('3') → 3")),
      h('tr', {}, h('th', { class: 'mono' }, 'float()'), h('td', {}, '정수나 문자열을 실수형으로 변환'),
        h('td', { class: 'left mono' }, 'float(3) → 3.0', h('br', {}), "float('3.14') → 3.14")),
      h('tr', {}, h('th', { class: 'mono' }, 'str()'), h('td', {}, '정수나 실수를 문자열로 변환'),
        h('td', { class: 'left mono' }, "str(3) → '3'", h('br', {}), "str(3.14) → '3.14'")),
    )),

    h('h4', {}, '학습지 예제 — 빈칸을 채우고 실행해 봅시다'),

    blankTask({
      label: 'party.py',
      template: `num = {{0}}("참석자 수 입력: ")   # 사용자로부터 입력을 str형으로 받아 num에 저장
num = {{1}}(num)                      # num의 자료형을 int형으로 변환
숟가락 = num
젓가락 = num{{2}}2                     # num이 int형이므로 산술 연산이 가능
print("참석자 수:", num, "\\n숟가락 수:", 숟가락, "\\n젓가락 수:", 젓가락)`,
      blanks: [
        { answer: 'input', width: 90, hint: '사용자로부터 값을 입력받는 함수' },
        { answer: 'int', width: 70, hint: '문자열을 정수로 바꾸는 함수' },
        { answer: ['*'], width: 50, hint: '젓가락은 숟가락의 두 배입니다' },
      ],
      inputs: '20',
      expected: '참석자 수 입력: 참석자 수: 20 \n숟가락 수: 20 \n젓가락 수: 40',
      explain: 'input( ) 이 돌려주는 값은 문자열이므로 int( ) 로 바꿔야 곱셈을 할 수 있습니다. int( ) 없이 num*2 를 하면 "2020" 이 됩니다.',
    }),

    blankTask({
      label: 'age.py',
      template: `a = input('이름: ')
b = input('나이: ')
b = {{0}}(b)                # 변수 b의 자료형을 int형으로 변환
print(a,'님 안녕하세요?')
print({{1}}-b,'년 후면 20살이시네요!')`,
      blanks: [
        { answer: 'int', width: 70, hint: '나이는 계산해야 하므로 정수로 바꿉니다' },
        { answer: '20', width: 60, hint: '20살까지 몇 년 남았는지 구합니다' },
      ],
      inputs: '홍길동\n17',
      expected: '이름: 나이: 홍길동 님 안녕하세요?\n3 년 후면 20살이시네요!',
      explain: 'int(b) 로 바꾸지 않으면 20 - b 에서 「정수 − 문자열」이 되어 TypeError 가 납니다.',
    }),

    h('h4', {}, '확인 문제'),
    quizSet([
      { q: [h('code', { class: 'inline' }, "int('3.9')"), ' 를 실행하면?'],
        type: 'choice', choices: ['3', '4', '3.9', '오류가 난다'],
        answer: '오류가 난다',
        hint: '위 실습 상자에 직접 넣어 실행해 보세요.',
        explain: "int( ) 는 '3' 처럼 정수 모양의 문자열만 받습니다. '3.9' 는 ValueError 가 납니다. float('3.9') 를 먼저 해야 합니다." },
      { q: [h('code', { class: 'inline' }, 'int(3.9)'), ' 를 실행하면?'],
        answer: '3', width: 90,
        explain: '실수를 int( ) 로 바꾸면 반올림이 아니라 소수점 이하를 버립니다.' },
      { q: ['input( ) 으로 받은 값의 자료형은?'],
        type: 'choice', choices: ['int', 'float', 'str', '입력한 값에 따라 다르다'],
        answer: 'str',
        explain: '무엇을 입력하든 항상 문자열(str)로 저장됩니다.' },
      { q: [h('code', { class: 'inline' }, 'a=input()'), ' 에 50, ', h('code', { class: 'inline' }, 'b=input()'), ' 에 5 를 넣고 ',
        h('code', { class: 'inline' }, 'print(a+b)'), ' 하면?'],
        answer: ['505'], width: 110,
        hint: '문자열끼리의 + 는 이어 붙이기입니다.',
        explain: "'50' + '5' = '505'. 55 가 되게 하려면 int(a) + int(b) 로 써야 합니다." },
    ], { revealOnWrong: true }));
}
