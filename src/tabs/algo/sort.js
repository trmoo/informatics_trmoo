/* ============================================================================
 * sort.js — 학습지 ⑭ 정렬 알고리즘
 *   버블·선택·병합 정렬을 한 단계씩 재생하며 비교 횟수와 교환 횟수를 센다.
 *   세 알고리즘을 같은 자료로 한꺼번에 돌려 성능을 비교하는 화면도 있다.
 *
 * © 2026 티쳐무 · 모든 권리 보유
 *
 * 무단 배포 및 상업적 이용을 금합니다. 학교 수업 목적으로만 이용해 주세요.
 * 그 밖의 이용(재배포·2차 저작물·수업 외 목적)은 먼저 문의해 주세요.
 * 오픈소스 라이선스를 붙이지 않았습니다 — 자세한 내용은 LICENSE 파일을 보세요.
 * ========================================================================== */

import { h, card, sheetHead, note, answer, quizSet, clear, shuffle, randInt } from '../../lib/ui.js';

export function render(root) {
  root.append(...sheetHead('학습지 ⑭', 'Ⅲ-1. 추상화와 알고리즘 (2) 정렬 알고리즘',
    ['[12정03-02]'],
    ['알고리즘의 조건, 표현 방법을 설명할 수 있다.',
     '데이터를 정렬하는 다양한 알고리즘의 특징을 설명하고, 효율을 분석할 수 있다.']));

  root.append(algoBasics());
  root.append(visualizer());
  root.append(raceCard());
  root.append(quizCard());
}

/* ══════════════════ ① 알고리즘의 기초 ═══════════════════════════════ */

function algoBasics() {
  return card('① 알고리즘 (Algorithm)',
    h('p', {}, h('b', {}, '정의'), ' — 문제를 해결하기 위한 단계적인 절차나 방법'),

    h('h4', {}, '성립 요건 5가지'),
    h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', { style: { width: '60px' } }, ''), h('th', { style: { width: '130px' } }, '조건'), h('th', { class: 'left' }, '설명')),
      h('tr', {}, h('td', {}, '1'), h('td', {}, answer('입력')), h('td', { class: 'left' }, '외부에서 제공되는 데이터가 0개 이상 있다.')),
      h('tr', {}, h('td', {}, '2'), h('td', {}, answer('출력')), h('td', { class: 'left' }, '적어도 1가지 이상의 결과를 생성한다.')),
      h('tr', {}, h('td', {}, '3'), h('td', {}, answer('명확성')), h('td', { class: 'left' }, '각 명령어들은 그 의미가 명백하고 모호하지 않아야 한다.')),
      h('tr', {}, h('td', {}, '4'), h('td', {}, answer('유한성')), h('td', { class: 'left' }, '순차적인 실행을 하면 언젠가는 반드시 실행이 종료되어야 한다.')),
      h('tr', {}, h('td', {}, '5'), h('td', {}, answer('유효성')), h('td', { class: 'left' }, '원칙적으로 모든 명령들은 오류가 없이 실행 가능해야 한다.')),
    )),

    h('h4', {}, '표현 방법'),
    h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', { style: { width: '170px' } }, '방법'), h('th', { class: 'left' }, '특징')),
      h('tr', {}, h('td', {}, answer('자연어')), h('td', { class: 'left' }, '인간이 읽기 쉽다. 단어를 정확하게 정의하지 않으면 의미가 모호해질 우려가 있다.')),
      h('tr', {}, h('td', {}, answer('순서도')), h('td', { class: 'left' }, '직관적이고 이해하기 쉽다. 복잡한 알고리즘은 표현하기 복잡하다.')),
      h('tr', {}, h('td', {}, answer('의사 코드'), ' (pseudo-code)'), h('td', { class: 'left' },
        '알고리즘 기술에 가장 많이 사용된다. 자연어보다 구조적이고 프로그래밍 언어보다 덜 구체적이다. 문법 고려사항을 감출 수 있어 핵심에 집중할 수 있다.')),
      h('tr', {}, h('td', {}, answer('프로그래밍 언어')), h('td', { class: 'left' }, '가장 정확한 기술이 가능하다. 구체적인 사항들이 핵심 내용의 이해를 방해할 수 있다.')),
    )),

    h('h4', {}, '[참고] 순서도(flow chart) 기호'),
    h('div', { class: 'row', style: { gap: '22px', flexWrap: 'wrap' } },
      fcSym('원 ◯', '프로그램의 시작과 끝'),
      fcSym('직사각형 □', '명령어의 처리'),
      fcSym('마름모 ◇', '선택(판단)의 순간'),
      fcSym('평행사변형 ▱', '입력과 출력'),
      fcSym('화살표 →', '명령어의 처리 순서(흐름)')),

    h('h4', {}, '알고리즘 성능(효율성) 분석'),
    h('ul', {},
      h('li', {}, h('b', {}, '수행 시간의 ', answer('측정')), ' — 실제로 구현해서 걸린 시간을 잼. ',
        '하드웨어·언어·운영체제·컴파일러에 영향을 받아 성능 평가에 부적합'),
      h('li', {}, h('b', {}, answer('시간 복잡도')), ' — 프로그램을 구현하지 않고도 수행 시간을 분석. ',
        '알고리즘이 수행하는 ', h('b', {}, '연산의 횟수'), '를 입력 데이터의 개수 n에 대한 함수로 표현'),
      h('li', {}, h('b', {}, answer('공간 복잡도')), ' — 알고리즘이 사용하는 컴퓨터의 기억 공간 크기')));
}

function fcSym(sym, desc) {
  return h('div', { style: { textAlign: 'center' } },
    h('div', { style: { fontSize: '1.6rem' } }, sym.split(' ')[1]),
    h('div', { style: { fontWeight: '800' } }, sym.split(' ')[0]),
    h('div', { style: { color: 'var(--ink-soft)', fontSize: '0.9rem' } }, desc));
}

/* ══════════════════ 정렬 알고리즘 — 단계 만들기 ═════════════════════ */

/**
 * 각 알고리즘을 한 단계씩 기록한다.
 * 한 단계(frame) = { arr, cmp:[i,j], hi:[i,j], done:[...], msg, c(비교), s(교환) }
 */
function bubbleFrames(src) {
  const a = src.slice(), F = [];
  let c = 0, s = 0;
  const done = [];
  const push = (cmp, hi, msg) => F.push({ arr: a.slice(), cmp: cmp || [], hi: hi || [], done: done.slice(), msg, c, s });
  push([], [], '시작 — 인접한 두 값을 비교하며 큰 값을 뒤로 보냅니다.');
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - 1 - i; j++) {
      c++;
      push([j, j + 1], [], `${a[j]} 와 ${a[j + 1]} 을 비교 (${c}번째 비교)`);
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]]; s++;
        push([], [j, j + 1], `${a[j + 1]} > ${a[j]} 이므로 자리를 바꿉니다 (${s}번째 교환)`);
      }
    }
    done.push(a.length - 1 - i);
    push([], [], `한 사이클 끝 — 가장 큰 값 ${a[a.length - 1 - i]} 이(가) 맨 뒤에 자리 잡았습니다.`);
  }
  done.push(0);
  push([], [], `정렬 완료! 비교 ${c}회, 교환 ${s}회`);
  return F;
}

function selectionFrames(src) {
  const a = src.slice(), F = [];
  let c = 0, s = 0;
  const done = [];
  const push = (cmp, hi, msg) => F.push({ arr: a.slice(), cmp: cmp || [], hi: hi || [], done: done.slice(), msg, c, s });
  push([], [], '시작 — 남은 값 중 최솟값을 찾아 맨 앞과 바꿉니다.');
  for (let i = 0; i < a.length - 1; i++) {
    let m = i;
    push([], [i], `${i + 1}번째 자리에 놓을 최솟값을 찾습니다.`);
    for (let j = i + 1; j < a.length; j++) {
      c++;
      push([m, j], [], `현재 최솟값 ${a[m]} 와 ${a[j]} 을 비교 (${c}번째 비교)`);
      if (a[j] < a[m]) { m = j; push([], [m], `더 작은 값 ${a[m]} 발견 — 최솟값 후보를 바꿉니다.`); }
    }
    if (m !== i) {
      [a[i], a[m]] = [a[m], a[i]]; s++;
      push([], [i, m], `최솟값 ${a[i]} 을(를) ${i + 1}번째 자리로 (${s}번째 교환)`);
    } else {
      push([], [i], `${a[i]} 이(가) 이미 제자리입니다 — 교환하지 않습니다.`);
    }
    done.push(i);
  }
  done.push(a.length - 1);
  push([], [], `정렬 완료! 비교 ${c}회, 교환 ${s}회`);
  return F;
}

function mergeFrames(src) {
  const a = src.slice(), F = [];
  let c = 0, s = 0;
  const push = (cmp, hi, msg) => F.push({ arr: a.slice(), cmp: cmp || [], hi: hi || [], done: [], msg, c, s });
  push([], [], '시작 — 반으로 계속 쪼갠 뒤, 합치면서 정렬합니다.');

  function sort(lo, hi) {
    if (hi - lo < 1) return;
    const mid = Math.floor((lo + hi) / 2);
    push([], range(lo, hi), `[${lo + 1}~${hi + 1}번째] 구간을 둘로 쪼갭니다.`);
    sort(lo, mid); sort(mid + 1, hi);

    const L = a.slice(lo, mid + 1), R = a.slice(mid + 1, hi + 1);
    push([], range(lo, hi), `[${L.join(',')}] 와 [${R.join(',')}] 를 합칩니다.`);
    let i = 0, j = 0, k = lo;
    while (i < L.length && j < R.length) {
      c++;
      if (L[i] <= R[j]) { a[k] = L[i++]; } else { a[k] = R[j++]; }
      s++;
      push([], [k], `앞쪽 ${L[i - 1] !== undefined && a[k] === L[i - 1] ? L[i - 1] : R[j - 1]} 을(를) 골라 놓습니다 (${c}번째 비교)`);
      k++;
    }
    while (i < L.length) { a[k] = L[i++]; s++; push([], [k], '남은 값을 그대로 옮깁니다 (비교하지 않음)'); k++; }
    while (j < R.length) { a[k] = R[j++]; s++; push([], [k], '남은 값을 그대로 옮깁니다 (비교하지 않음)'); k++; }
  }
  const range = (lo, hi) => [...Array(hi - lo + 1)].map((_, i) => lo + i);

  sort(0, a.length - 1);
  F.push({ arr: a.slice(), cmp: [], hi: [], done: a.map((_, i) => i), msg: `정렬 완료! 비교 ${c}회, 옮긴 횟수 ${s}회`, c, s });
  return F;
}

const ALGOS = {
  bubble: { name: '버블 정렬', make: bubbleFrames, swapLabel: '교환',
    desc: ['인접한 두 데이터를 서로 비교해 반복적으로 자리를 상호교환하며 정렬',
           '오름차순의 경우, 한 사이클이 끝나면 가장 마지막에 가장 큰 값이 위치한다'] },
  selection: { name: '선택 정렬', make: selectionFrames, swapLabel: '교환',
    desc: ['전체 데이터 중 최솟값(또는 최댓값)을 선택하여 맨 앞의 데이터와 자리를 교환하는 작업을 반복',
           '오름차순의 경우, 최솟값을 찾아 맨 앞의 값과 자리를 교체하는 과정을 반복'] },
  merge: { name: '병합 정렬', make: mergeFrames, swapLabel: '옮김',
    desc: ['정렬하려는 데이터를 균등한 두 개의 부분 집합으로 반복 분할한 뒤, 다시 합치면서 정렬',
           '비교 횟수가 버블·선택보다 적다 — 데이터가 많아질수록 차이가 크게 벌어진다'] },
};

/* ══════════════════ ② 정렬 시각화 ══════════════════════════════════ */

function visualizer() {
  let data = [50, 23, 9, 18, 61, 32];
  let algo = 'bubble';
  let frames = [], idx = 0, timer = null, speed = 420;

  const barsBox = h('div', { class: 'bars' });
  const msgBox = h('div', { style: { minHeight: '28px', fontWeight: '700', margin: '10px 0' } });
  const statBox = h('div', { class: 'row' });
  const descBox = h('div', {});
  const algoBox = h('div', { class: 'row tight' });

  const dataInp = h('input', {
    type: 'text', class: 'mono', value: data.join(', '),
    style: { width: '280px' },
  });

  function build() {
    frames = ALGOS[algo].make(data);
    idx = 0;
    paint();
    clear(descBox);
    descBox.append(h('ul', {}, ALGOS[algo].desc.map((d) => h('li', {}, d))));
  }

  function paint() {
    const f = frames[idx] || { arr: data, cmp: [], hi: [], done: [], msg: '', c: 0, s: 0 };
    const max = Math.max(...f.arr, 1);
    clear(barsBox);
    f.arr.forEach((v, i) => {
      const cls = f.done.includes(i) ? 'done' : f.hi.includes(i) ? 'swap' : f.cmp.includes(i) ? 'cmp' : '';
      barsBox.append(h('div', {
        class: 'bar ' + cls,
        style: { height: `${Math.max(12, (v / max) * 100)}%` },
      }, String(v)));
    });
    msgBox.textContent = f.msg || '';
    clear(statBox);
    statBox.append(
      h('span', { class: 'score' }, `단계 ${idx + 1} / ${frames.length}`),
      h('span', { class: 'score', style: { background: '#fff6e5', color: '#b8860b' } }, `비교 ${f.c}회`),
      h('span', { class: 'score', style: { background: '#fdeeee', color: '#cf3030' } }, `${ALGOS[algo].swapLabel} ${f.s}회`));
  }

  function step(d) {
    idx = Math.max(0, Math.min(frames.length - 1, idx + d));
    paint();
  }

  function play() {
    if (timer) { stop(); return; }
    playBtn.textContent = '⏸ 멈춤';
    timer = setInterval(() => {
      if (idx >= frames.length - 1) { stop(); return; }
      step(1);
    }, speed);
  }
  function stop() { clearInterval(timer); timer = null; playBtn.textContent = '▶ 재생'; }

  const playBtn = h('button', { type: 'button', class: 'btn', onclick: play }, '▶ 재생');

  const speedInp = h('input', {
    type: 'range', min: 60, max: 900, step: 30, value: 900 - speed + 60,
    style: { width: '130px' },
    oninput: () => { speed = 960 - Number(speedInp.value); if (timer) { stop(); play(); } },
  });

  function paintAlgo() {
    clear(algoBox);
    algoBox.append(h('span', { class: 'chip' }, '알고리즘'));
    for (const [k, v] of Object.entries(ALGOS)) {
      algoBox.append(h('button', {
        type: 'button', class: 'btn small' + (algo === k ? '' : ' ghost'),
        onclick: () => { stop(); algo = k; paintAlgo(); build(); },
      }, v.name));
    }
  }

  function readData() {
    const nums = dataInp.value.split(/[,\s]+/).map(Number).filter((n) => Number.isFinite(n) && n >= 0 && n <= 99);
    if (nums.length < 2) { dataInp.style.borderColor = 'var(--bad)'; return; }
    dataInp.style.borderColor = 'var(--line)';
    data = nums.slice(0, 12);
    stop(); build();
  }

  paintAlgo(); build();

  return card('② 정렬 알고리즘 시각화 — 한 단계씩 따라가기',
    algoBox,
    h('div', { style: { height: '8px' } }),
    descBox,

    h('div', { class: 'row', style: { margin: '12px 0' } },
      h('label', { class: 'field' }, '자료'), dataInp,
      h('button', { type: 'button', class: 'btn ghost small', onclick: readData }, '이 자료로'),
      h('button', {
        type: 'button', class: 'btn ghost small',
        onclick: () => { dataInp.value = '50, 23, 9, 18, 61, 32'; readData(); },
      }, '학습지 자료'),
      h('button', {
        type: 'button', class: 'btn ghost small',
        onclick: () => {
          const n = randInt(6, 10);
          dataInp.value = shuffle([...Array(99)].map((_, i) => i + 1)).slice(0, n).join(', ');
          readData();
        },
      }, '🎲 무작위 자료')),

    barsBox,
    h('div', { class: 'legend', style: { marginTop: '8px' } },
      h('span', {}, h('i', { style: { background: '#b8860b' } }), '비교 중'),
      h('span', {}, h('i', { style: { background: '#cf3030' } }), '교환·이동'),
      h('span', {}, h('i', { style: { background: '#12855a' } }), '자리 확정'),
      h('span', {}, h('i', { style: { background: '#9fb4d0' } }), '아직')),
    msgBox,
    statBox,

    h('div', { class: 'row', style: { marginTop: '12px' } },
      h('button', { type: 'button', class: 'btn gray small', onclick: () => { stop(); idx = 0; paint(); } }, '⏮ 처음'),
      h('button', { type: 'button', class: 'btn gray small', onclick: () => { stop(); step(-1); } }, '◀ 이전'),
      playBtn,
      h('button', { type: 'button', class: 'btn gray small', onclick: () => { stop(); step(1); } }, '다음 ▶'),
      h('button', { type: 'button', class: 'btn gray small', onclick: () => { stop(); idx = frames.length - 1; paint(); } }, '끝 ⏭'),
      h('span', { class: 'spacer' }),
      h('label', { class: 'field' }, '속도'), speedInp));
}

/* ══════════════════ ③ 세 알고리즘 한꺼번에 비교 ═════════════════════ */

function raceCard() {
  const out = h('div', {});
  const inp = h('input', { type: 'text', class: 'mono', value: '50, 23, 9, 18, 61, 32', style: { width: '300px' } });

  function run() {
    const nums = inp.value.split(/[,\s]+/).map(Number).filter(Number.isFinite);
    if (nums.length < 2) return;
    const data = nums.slice(0, 30);
    clear(out);

    const rows = Object.entries(ALGOS).map(([k, v]) => {
      const F = v.make(data);
      const last = F[F.length - 1];
      return { name: v.name, c: last.c, s: last.s, label: v.swapLabel };
    });
    const maxC = Math.max(...rows.map((r) => r.c), 1);

    out.append(h('table', { class: 'tbl' },
      h('tr', {}, h('th', { class: 'left' }, '알고리즘'), h('th', {}, '비교 횟수'), h('th', {}, '교환·이동 횟수'), h('th', { class: 'left' }, '비교 횟수 막대')),
      ...rows.map((r) => h('tr', { class: r.c === Math.min(...rows.map((x) => x.c)) ? 'hl' : '' },
        h('td', { class: 'left' }, r.name),
        h('td', { class: 'mono', style: { fontWeight: '800', fontSize: '1.1rem' } }, String(r.c)),
        h('td', { class: 'mono' }, `${r.s} (${r.label})`),
        h('td', { class: 'left' }, h('div', {
          style: {
            height: '20px', borderRadius: '5px', background: 'var(--accent)',
            width: `${(r.c / maxC) * 100}%`, minWidth: '3px',
          },
        }))))));

    out.append(note('',
      `자료 ${data.length}개 기준입니다. 자료 개수를 늘려 보세요 — `,
      h('b', {}, '병합 정렬'), '과 나머지 둘의 차이가 점점 크게 벌어집니다. ',
      '버블·선택은 대략 n²/2번, 병합은 대략 n×log₂n 번 비교하기 때문입니다.'));

    const n = data.length;
    out.append(h('table', { class: 'tbl', style: { marginTop: '12px' } },
      h('tr', {}, h('th', {}, '자료 개수 n'), h('th', {}, 'n(n−1)/2 (버블·선택)'), h('th', {}, '약 n×log₂n (병합)')),
      ...[10, 100, 1000, 10000].map((m) => h('tr', { class: m === 10 ? '' : '' },
        h('td', {}, m.toLocaleString()),
        h('td', { class: 'mono' }, ((m * (m - 1)) / 2).toLocaleString()),
        h('td', { class: 'mono' }, Math.round(m * Math.log2(m)).toLocaleString())))));
  }
  run();

  return card('③ 세 알고리즘 성능 비교 — 같은 자료로 한꺼번에',
    h('div', { class: 'row', style: { marginBottom: '12px' } },
      h('label', { class: 'field' }, '자료'), inp,
      h('button', { type: 'button', class: 'btn', onclick: run }, '비교하기'),
      h('button', {
        type: 'button', class: 'btn ghost small',
        onclick: () => { inp.value = shuffle([...Array(200)].map((_, i) => i + 1)).slice(0, 20).join(', '); run(); },
      }, '🎲 20개 무작위'),
      h('button', {
        type: 'button', class: 'btn ghost small',
        onclick: () => { inp.value = [...Array(20)].map((_, i) => i + 1).join(', '); run(); },
      }, '이미 정렬된 20개')),
    out,
    note('warn', h('b', {}, '생각해 보기 '),
      '「이미 정렬된 20개」를 넣어 보세요. 버블 정렬은 교환을 한 번도 하지 않지만 비교는 그대로 190번 합니다. ',
      '정렬하고자 하는 데이터들의 특징에 따라 알고리즘의 성능이 달라질 수 있습니다.'));
}

/* ══════════════════ ④ 확인 문제 ════════════════════════════════════ */

function quizCard() {
  return card('④ 확인 문제 — 학습지 ▣ 자료 [50, 23, 9, 18, 61, 32]',
    quizSet([
      { q: '버블 정렬로 오름차순 정렬할 때 비교 횟수는?', answer: '15', unit: '회', width: 110,
        hint: '5 + 4 + 3 + 2 + 1 을 계산해 보세요. 위 시각화에서 [끝] 을 눌러도 확인됩니다.',
        explain: 'n=6이므로 5+4+3+2+1 = 15회. 자료가 어떻게 놓여 있든 비교 횟수는 항상 같습니다.' },
      { q: '버블 정렬로 오름차순 정렬할 때 교환 횟수는?', answer: '7', unit: '회', width: 110,
        hint: '위 시각화에서 버블 정렬을 끝까지 재생해 보세요.',
        explain: '교환은 7회입니다. 교환 횟수는 자료가 놓인 순서에 따라 달라집니다.' },
      { q: '선택 정렬의 비교 횟수는?', answer: '15', unit: '회', width: 110,
        explain: '선택 정렬도 5+4+3+2+1 = 15회 비교합니다. 비교 횟수는 버블과 같습니다.' },
      { q: '병합 정렬의 비교 횟수는?', answer: '10', unit: '회', width: 110,
        hint: '위 시각화에서 병합 정렬을 끝까지 재생해 보세요.',
        explain: '10회입니다. 같은 자료인데 비교 횟수가 버블·선택의 2/3입니다.' },
      { q: '「인접한 두 데이터를 비교해 자리를 바꾸며, 한 사이클이 끝나면 가장 큰 값이 맨 뒤에 놓이는」 정렬은?',
        type: 'choice', choices: ['버블 정렬', '선택 정렬', '병합 정렬'],
        answer: '버블 정렬',
        explain: '버블(거품) 정렬 — 큰 값이 거품처럼 뒤로 떠오릅니다.' },
      { q: '정렬 알고리즘의 성능을 판단하는 첫 번째 기준은?',
        type: 'choice', choices: ['비교 횟수', '코드 줄 수', '변수 개수'],
        answer: '비교 횟수',
        explain: '비교 횟수가 가장 적은 알고리즘이 효율적이고, 비교 횟수가 같다면 교환 횟수로 판단합니다.' },
    ], { revealOnWrong: true }));
}
