/* ============================================================================
 * search.js — 학습지 ⑮ 탐색 알고리즘
 *   순차 탐색과 이진 탐색을 나란히 돌려 비교 횟수의 차이를 보게 한다.
 *   「정렬되어 있어야 이진 탐색을 쓸 수 있다」 는 전제 조건도 직접 부딪혀 보게 한다.
 *
 * © 2026 티쳐무 · 모든 권리 보유
 *
 * 무단 배포 및 상업적 이용을 금합니다. 학교 수업 목적으로만 이용해 주세요.
 * 그 밖의 이용(재배포·2차 저작물·수업 외 목적)은 먼저 문의해 주세요.
 * 오픈소스 라이선스를 붙이지 않았습니다 — 자세한 내용은 LICENSE 파일을 보세요.
 * ========================================================================== */

import { h, card, sheetHead, note, answer, quizSet, clear, shuffle, randInt } from '../../lib/ui.js';

export function render(root) {
  root.append(...sheetHead('학습지 ⑮', 'Ⅲ-1. 추상화와 알고리즘 (3) 탐색 알고리즘',
    ['[12정03-03]'],
    ['데이터를 탐색하는 다양한 알고리즘의 특징을 설명할 수 있다.',
     '탐색 알고리즘의 효율을 비교·분석할 수 있다.']));

  root.append(conceptCard());
  root.append(visualizer());
  root.append(scaleCard());
  root.append(quizCard());
}

/* ══════════════════ ① 개념 ═════════════════════════════════════════ */

function conceptCard() {
  return card('① 탐색 (search) 알고리즘',
    h('p', {}, '많은 데이터에서 원하는 것을 찾는 과정. ',
      '검색 엔진, 데이터베이스, 전자 상거래, 추천 시스템 등 다양한 시스템에서 핵심적으로 활용됩니다.'),

    h('div', { class: 'grid2', style: { margin: '14px 0' } },
      h('div', { class: 'note' },
        h('b', {}, '⏱️ 시간에 민감한 작업'), h('br', {}),
        '주행 중인 자동차가 경로를 이탈했을 때, 내비게이션은 새로운 경로를 ',
        h('b', {}, '즉시'), ' 찾아내야 합니다.'),
      h('div', { class: 'note ok' },
        h('b', {}, '⚡ 효율성'), h('br', {}),
        '대규모 데이터셋을 수동으로 검색하면 오래 걸리고 오류도 쉽습니다. ',
        '잘 설계된 탐색 알고리즘은 사람의 개입을 최소화하면서 빠르고 정확하게 찾습니다.')),

    h('div', { class: 'grid2' },
      h('div', {},
        h('h4', { style: { marginTop: '0' } }, '1.2 순차(sequential) 탐색'),
        h('ul', {},
          h('li', {}, '처음부터 차례대로 비교하면서 하나씩 검사하는 방법'),
          h('li', {}, '한쪽 방향으로만 탐색하므로 ', h('b', {}, '선형(linear) 탐색'), '이라고도 함'),
          h('li', {}, '데이터가 ', h('b', {}, '정렬되어 있지 않아도'), ' 수행 가능'),
          h('li', {}, '찾는 데이터가 없거나 마지막에 있으면 전체 개수만큼 비교해야 함'))),
      h('div', {},
        h('h4', { style: { marginTop: '0' } }, '1.3 이진(binary) 탐색'),
        h('ul', {},
          h('li', {}, '주어진 데이터를 이분화하면서 원하는 데이터를 찾는 알고리즘'),
          h('li', {}, '탐색할 데이터를 반으로 나누어 탐색'),
          h('li', {}, '전제 조건 : 미리 ', answer('정렬'), '된 데이터')))),

    note('warn', h('b', {}, '1.4 성능 비교 '),
      '데이터의 ', answer('양'), '과 ', answer('정렬'), ' 상태에 따라 효율성이 달라집니다. ',
      '순차 탐색은 데이터의 수가 적을 때 효과적이고, 이진 탐색은 데이터가 반드시 정렬되어 있어야 적용할 수 있습니다.'));
}

/* ══════════════════ 탐색 단계 만들기 ═══════════════════════════════ */

function seqFrames(arr, target) {
  const F = [];
  for (let i = 0; i < arr.length; i++) {
    F.push({ look: [i], lo: 0, hi: arr.length - 1, c: i + 1, found: arr[i] === target,
      msg: `${i + 1}번째 값 ${arr[i]} 와 ${target} 을(를) 비교` });
    if (arr[i] === target) {
      F.push({ look: [i], lo: 0, hi: arr.length - 1, c: i + 1, found: true, done: true,
        msg: `✅ 찾았습니다! ${i + 1}번째 자리, 비교 ${i + 1}회` });
      return F;
    }
  }
  F.push({ look: [], lo: 0, hi: arr.length - 1, c: arr.length, found: false, done: true,
    msg: `❌ 없습니다. 끝까지 ${arr.length}회 비교했습니다.` });
  return F;
}

function binFrames(arr, target) {
  const F = [];
  let lo = 0, hi = arr.length - 1, c = 0;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    c++;
    F.push({ look: [mid], lo, hi, c, found: arr[mid] === target,
      msg: `가운데 값 ${arr[mid]} 와 ${target} 을(를) 비교 (${c}번째)` });
    if (arr[mid] === target) {
      F.push({ look: [mid], lo, hi, c, found: true, done: true,
        msg: `✅ 찾았습니다! ${mid + 1}번째 자리, 비교 ${c}회` });
      return F;
    }
    if (arr[mid] < target) {
      lo = mid + 1;
      F.push({ look: [], lo, hi, c, msg: `${target} 이(가) 더 크므로 오른쪽 절반만 남깁니다.` });
    } else {
      hi = mid - 1;
      F.push({ look: [], lo, hi, c, msg: `${target} 이(가) 더 작으므로 왼쪽 절반만 남깁니다.` });
    }
  }
  F.push({ look: [], lo, hi, c, found: false, done: true, msg: `❌ 없습니다. 비교 ${c}회 만에 확인했습니다.` });
  return F;
}

/* ══════════════════ ② 나란히 보기 ══════════════════════════════════ */

function visualizer() {
  let arr = [9, 18, 23, 32, 50, 61];
  let target = 32;
  let seq = [], bin = [], si = 0, bi = 0, timer = null;

  const seqBox = h('div', {});
  const binBox = h('div', {});
  const warnBox = h('div', {});

  const dataInp = h('input', { type: 'text', class: 'mono', value: arr.join(', '), style: { width: '280px' } });
  const targetInp = h('input', { type: 'number', value: target, style: { width: '90px' } });

  const isSorted = () => arr.every((v, i) => i === 0 || arr[i - 1] <= v);

  function build() {
    seq = seqFrames(arr, target);
    bin = isSorted() ? binFrames(arr, target) : [];
    si = 0; bi = 0;
    paint();
  }

  function cells(box, frames, i, title, color) {
    const f = frames[i] || { look: [], lo: 0, hi: arr.length - 1, c: 0 };
    clear(box);
    const row = h('div', { class: 'row tight', style: { flexWrap: 'wrap' } });
    arr.forEach((v, idx) => {
      const inRange = idx >= f.lo && idx <= f.hi;
      const looking = f.look.includes(idx);
      row.append(h('div', {
        style: {
          minWidth: '54px', textAlign: 'center', padding: '11px 6px', borderRadius: '9px',
          fontWeight: '800', fontSize: '1.15rem', fontFamily: 'var(--mono)',
          background: looking ? (f.found ? 'var(--ok)' : 'var(--warn)') : inRange ? '#fff' : '#eef1f7',
          color: looking ? '#fff' : inRange ? 'var(--ink)' : '#b3bcc9',
          border: '2px solid ' + (looking ? (f.found ? 'var(--ok)' : 'var(--warn)') : inRange ? '#c8d1de' : '#e9edf4'),
          transition: 'all .15s',
        },
      }, String(v)));
    });
    box.append(
      h('div', { class: 'row' }, h('b', { style: { fontSize: '1.08rem', color } }, title),
        h('span', { class: 'spacer' }),
        h('span', { class: 'score' }, `비교 ${f.c}회`)),
      row,
      h('div', { style: { minHeight: '26px', marginTop: '8px', color: 'var(--ink-soft)', fontWeight: '700' } }, f.msg || ''));
  }

  function paint() {
    cells(seqBox, seq, si, '순차 탐색', '#d9781e');
    clear(warnBox);
    if (!isSorted()) {
      clear(binBox);
      binBox.append(h('div', { class: 'row' }, h('b', { style: { fontSize: '1.08rem', color: '#1e6fd9' } }, '이진 탐색')),
        note('bad', h('b', {}, '이진 탐색을 쓸 수 없습니다. '),
          '자료가 오름차순으로 정렬되어 있지 않습니다. ',
          '가운데 값보다 크다고 오른쪽만 남기면, 왼쪽에 있는 답을 놓치게 됩니다.',
          h('div', { style: { marginTop: '8px' } },
            h('button', {
              type: 'button', class: 'btn small',
              onclick: () => { arr = arr.slice().sort((a, b) => a - b); dataInp.value = arr.join(', '); build(); },
            }, '오름차순으로 정렬하기'))));
    } else {
      cells(binBox, bin, bi, '이진 탐색', '#1e6fd9');
    }
  }

  function step() {
    let moved = false;
    if (si < seq.length - 1) { si++; moved = true; }
    if (bin.length && bi < bin.length - 1) { bi++; moved = true; }
    paint();
    return moved;
  }

  function play() {
    if (timer) { stop(); return; }
    playBtn.textContent = '⏸ 멈춤';
    timer = setInterval(() => { if (!step()) stop(); }, 700);
  }
  function stop() { clearInterval(timer); timer = null; playBtn.textContent = '▶ 재생'; }
  const playBtn = h('button', { type: 'button', class: 'btn', onclick: play }, '▶ 재생');

  function readData() {
    const nums = dataInp.value.split(/[,\s]+/).map(Number).filter(Number.isFinite);
    if (nums.length < 2) { dataInp.style.borderColor = 'var(--bad)'; return; }
    dataInp.style.borderColor = 'var(--line)';
    arr = nums.slice(0, 20);
    target = Number(targetInp.value);
    stop(); build();
  }

  build();

  return card('② 순차 탐색 vs 이진 탐색 — 같은 자료, 같은 목표',
    h('div', { class: 'row', style: { marginBottom: '10px' } },
      h('label', { class: 'field' }, '자료'), dataInp,
      h('label', { class: 'field' }, '찾는 값'), targetInp,
      h('button', { type: 'button', class: 'btn ghost small', onclick: readData }, '적용')),
    h('div', { class: 'row tight', style: { marginBottom: '14px' } },
      h('span', { class: 'chip' }, '빠른 설정'),
      [[9, '9'], [32, '32'], [61, '61'], [7, '없는 값 7']].map(([v, label]) => h('button', {
        type: 'button', class: 'btn ghost small',
        onclick: () => { dataInp.value = '9, 18, 23, 32, 50, 61'; targetInp.value = v; readData(); },
      }, `학습지 자료에서 ${label} 찾기`)),
      h('button', {
        type: 'button', class: 'btn ghost small',
        onclick: () => {
          const n = randInt(8, 15);
          const nums = shuffle([...Array(99)].map((_, i) => i + 1)).slice(0, n);
          dataInp.value = nums.join(', ');
          targetInp.value = nums[randInt(0, n - 1)];
          readData();
        },
      }, '🎲 정렬 안 된 무작위 자료')),

    h('div', { style: { border: '1px solid var(--line-soft)', borderRadius: '10px', padding: '14px', marginBottom: '12px', background: '#fffaf3' } }, seqBox),
    h('div', { style: { border: '1px solid var(--line-soft)', borderRadius: '10px', padding: '14px', background: '#f5f9ff' } }, binBox),
    warnBox,

    h('div', { class: 'row', style: { marginTop: '12px' } },
      h('button', { type: 'button', class: 'btn gray small', onclick: () => { stop(); si = 0; bi = 0; paint(); } }, '⏮ 처음'),
      playBtn,
      h('button', { type: 'button', class: 'btn gray small', onclick: () => { stop(); step(); } }, '다음 ▶'),
      h('button', {
        type: 'button', class: 'btn gray small',
        onclick: () => { stop(); si = seq.length - 1; bi = Math.max(0, bin.length - 1); paint(); },
      }, '끝 ⏭')),

    note('', '흐릿한 칸은 이진 탐색이 ', h('b', {}, '이미 볼 필요가 없다고 판단해 버린 범위'),
      '입니다. 한 번 비교할 때마다 남은 범위가 절반으로 줄어듭니다.'));
}

/* ══════════════════ ③ 자료가 많아지면 ══════════════════════════════ */

function scaleCard() {
  const rows = [10, 100, 1000, 10000, 1000000, 1000000000];
  return card('③ 자료가 많아지면 얼마나 차이 날까',
    h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', {}, '자료 개수'), h('th', {}, '순차 탐색 (최악)'), h('th', {}, '이진 탐색 (최악)'), h('th', { class: 'left' }, '차이')),
      ...rows.map((n) => {
        const b = Math.ceil(Math.log2(n + 1));
        return h('tr', { class: n >= 1000000 ? 'hl' : '' },
          h('td', { class: 'mono' }, n.toLocaleString()),
          h('td', { class: 'mono' }, n.toLocaleString() + '회'),
          h('td', { class: 'mono', style: { fontWeight: '800', color: 'var(--ok)' } }, b + '회'),
          h('td', { class: 'left' }, `약 ${Math.round(n / b).toLocaleString()}배 빠름`));
      }),
    )),
    note('ok', h('b', {}, '10억 개 중에서 30번 만에 '),
      '이진 탐색은 한 번 비교할 때마다 후보를 절반으로 줄입니다. ',
      '10억을 절반씩 30번 나누면 1개가 남습니다(2³⁰ ≒ 10억). ',
      '전화번호부에서 이름을 찾을 때 우리가 하는 방법이 바로 이진 탐색입니다.'),
    note('warn', h('b', {}, '그런데 공짜는 아닙니다. '),
      '이진 탐색을 쓰려면 먼저 정렬을 해 두어야 합니다. ',
      '자료를 딱 한 번만 찾을 거라면 정렬하는 시간이 더 걸릴 수도 있습니다. ',
      '여러 번 찾을 자료라면 한 번 정렬해 두는 것이 훨씬 이득입니다.'));
}

/* ══════════════════ ④ 확인 문제 ════════════════════════════════════ */

function quizCard() {
  return card('④ 확인 문제 — 정렬된 자료 [9, 18, 23, 32, 50, 61]',
    quizSet([
      { q: '9를 찾을 때 순차 탐색의 비교 횟수는?', answer: '1', unit: '회', width: 100,
        explain: '9는 첫 번째 값이므로 한 번 비교하면 바로 찾습니다.' },
      { q: '9를 찾을 때 이진 탐색의 비교 횟수는?', answer: '2', unit: '회', width: 100,
        hint: '가운데(3번째, 23)부터 봅니다.',
        explain: '① 가운데 23과 비교 → 9가 더 작으므로 왼쪽 [9, 18] ② 가운데 9와 비교 → 찾음. 총 2회.' },
      { q: '32를 찾을 때 순차 탐색의 비교 횟수는?', answer: '4', unit: '회', width: 100,
        explain: '9, 18, 23, 32 순서로 네 번 비교합니다.' },
      { q: '32를 찾을 때 이진 탐색의 비교 횟수는?', answer: '3', unit: '회', width: 100,
        explain: '① 23과 비교 → 오른쪽 [32,50,61] ② 50과 비교 → 왼쪽 [32] ③ 32와 비교 → 찾음. 총 3회.' },
      { q: '61을 찾을 때 순차 탐색의 비교 횟수는?', answer: '6', unit: '회', width: 100,
        explain: '마지막 값이므로 전체 개수만큼 여섯 번 비교합니다.' },
      { q: '61을 찾을 때 이진 탐색의 비교 횟수는?', answer: '3', unit: '회', width: 100,
        explain: '① 23 ② 50 ③ 61 → 3회. 순차 탐색의 절반입니다.' },
      { q: '이진 탐색을 쓰기 위한 전제 조건은?',
        type: 'choice', choices: ['데이터가 정렬되어 있어야 한다', '데이터가 100개 이상이어야 한다', '데이터가 숫자여야 한다'],
        answer: '데이터가 정렬되어 있어야 한다',
        hint: '위 ② 에서 「정렬 안 된 무작위 자료」를 넣어 보세요.',
        explain: '정렬되어 있지 않으면 「가운데보다 크니 오른쪽만 보면 된다」는 판단이 성립하지 않습니다.' },
      { q: '데이터가 정렬되어 있지 않아도 쓸 수 있는 탐색 방법은?',
        type: 'choice', choices: ['순차 탐색', '이진 탐색', '둘 다 안 된다'],
        answer: '순차 탐색',
        explain: '순차 탐색은 처음부터 하나씩 다 보므로 순서와 상관없습니다.' },
    ], { revealOnWrong: true }));
}
