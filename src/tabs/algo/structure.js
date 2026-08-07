/* ============================================================================
 * structure.js — 학습지 ⑬ 문제 분해와 모델링
 *   ① 추상화·문제 분해 개념
 *   ② 선형 구조(리스트·스택·큐)를 직접 넣고 빼 본다
 *   ③ 비선형 구조(트리·그래프)
 *   ④ 분할정복 놀이공원 — 지도를 눌러 경로를 만들고 최단 경로를 찾는다
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

import { h, card, sheetHead, note, answer, quizSet, clear, drawNow } from '../../lib/ui.js';

export function render(root) {
  root.append(...sheetHead('학습지 ⑬', 'Ⅲ-1. 추상화와 알고리즘 (1) 문제 분해와 모델링',
    ['[12정03-01]'],
    ['복잡한 문제를 해결 가능한 작은 문제로 분해하여 문제를 해결할 수 있다.',
     '문제를 단순화하거나 구조화하는 모델링을 할 수 있다.']));

  root.append(abstractCard());
  root.append(linearCard());
  root.append(nonlinearCard());
  root.append(parkCard());
}

/* ══════════════════ ① 추상화 ═══════════════════════════════════════ */

function abstractCard() {
  return card('① 추상화 (Abstraction, 抽像化)',
    h('p', {}, '抽(뽑을 추) + 像(모양 상) + 化(될 화) — ',
      '문제의 복잡성을 줄이기 위하여 문제 해결에 필요한 ', h('b', {}, '핵심 요소를 추출'),
      '한 후 간결하고 이해하기 쉽게 만드는 것.'),

    h('div', { class: 'grid2', style: { margin: '14px 0' } },
      h('div', { class: 'note' },
        h('b', {}, '🛰️ 위성 지도'), h('br', {}),
        '건물, 나무, 도로, 자동차까지 있는 그대로 다 보입니다. 정확하지만 ',
        h('b', {}, '지하철 타는 데는 쓸모가 없습니다'), '.'),
      h('div', { class: 'note ok' },
        h('b', {}, '🚇 지하철 노선도'), h('br', {}),
        '실제 거리도 방향도 틀립니다. 대신 ', h('b', {}, '역의 순서와 환승역'),
        '만 남겼습니다 — 목적에 필요한 것만 뽑아낸 추상화입니다.')),

    h('h4', {}, '정보과학적 문제 해결 과정'),
    h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', { style: { width: '190px' } }, '단계'), h('th', { class: 'left' }, '하는 일'), h('th', { style: { width: '120px' } }, '핵심 능력')),
      h('tr', {}, h('th', {}, '문제 이해 및 분석'),
        h('td', { class: 'left' }, '문제의 구성요소 간 관계를 파악하여 자신의 언어로 정의 (현재 상태 / 목표 상태 / 조건). ',
          '핵심요소를 추출하여 해결하기 쉬운 형태로 표현'),
        h('td', {}, h('b', {}, '추상화'), h('br', {}), '핵심요소 추출, 문제 분해, 모델링')),
      h('tr', {}, h('th', {}, '문제 해결 방법 탐색'), h('td', { class: 'left' }, '순차·선택·반복 구조 등을 이용하여 해결 방법을 설계'), h('td', {}, '알고리즘의 설계')),
      h('tr', {}, h('th', {}, '프로그래밍 작성'), h('td', { class: 'left' }, '문제 해결 방법의 구현'), h('td', {}, h('b', {}, '자동화'))),
      h('tr', {}, h('th', {}, '실행 및 수정'), h('td', { class: 'left' }, '얼마나 정확하고 효율적으로 해결했는지 평가하고 다시 시도'), h('td', {}, '평가·개선')),
    )),

    h('p', { style: { marginTop: '14px' } },
      h('b', {}, '문제 분해'), ' — 복잡하고 커다란 문제를 해결하기 쉬운 여러 개의 작은 문제로 나누는 과정. ',
      h('b', {}, '모델링'), ' — 현상을 구성하는 핵심적인 요소들 간의 관계를 단순하고 명확하게 구조화하는 과정.'));
}

/* ══════════════════ ② 선형 구조 ════════════════════════════════════ */

function linearCard() {
  /* ── 리스트 ── */
  const listData = ['구글', '네이버', '네이트', '다음'];
  const listBox = h('div', { class: 'scroll-x' });
  function paintList() {
    clear(listBox);
    listBox.append(h('table', { class: 'tbl', style: { maxWidth: '640px' } },
      h('tr', {}, h('th', { class: 'left' }, '번호'), ...listData.map((_, i) => h('th', {}, String(i)))),
      h('tr', {}, h('th', { class: 'left' }, '검색엔진 사이트'), ...listData.map((v) => h('td', {}, v)))));
  }
  paintList();

  /* ── 스택 ── */
  const stack = [];
  const stackBox = h('div', { class: 'stackbox' });
  const stackLog = h('div', { style: { color: 'var(--ink-soft)', minHeight: '26px', fontWeight: '700' } });
  const stackInp = h('input', { type: 'text', value: 'A', style: { width: '80px', textAlign: 'center' } });

  function paintStack() {
    clear(stackBox);
    stack.forEach((v, i) => stackBox.append(h('div', {
      class: 'item',
      style: { background: i === stack.length - 1 ? 'var(--accent)' : '#9fb4d0' },
    }, v + (i === stack.length - 1 ? '  ← top' : ''))));
    if (!stack.length) stackBox.append(h('div', { style: { color: '#9aa5b4', textAlign: 'center', padding: '20px' } }, '비어 있음'));
  }
  paintStack();

  /* ── 큐 ── */
  const queue = [];
  const queueBox = h('div', { class: 'queuebox' });
  const queueLog = h('div', { style: { color: 'var(--ink-soft)', minHeight: '26px', fontWeight: '700' } });
  const queueInp = h('input', { type: 'text', value: 'A', style: { width: '80px', textAlign: 'center' } });

  function paintQueue() {
    clear(queueBox);
    if (!queue.length) { queueBox.append(h('div', { style: { color: '#9aa5b4', padding: '10px' } }, '비어 있음')); return; }
    queueBox.append(h('span', { class: 'chip' }, '앞(front) →'));
    queue.forEach((v, i) => queueBox.append(h('div', {
      class: 'item',
      style: { background: i === 0 ? 'var(--accent)' : '#9fb4d0' },
    }, v)));
    queueBox.append(h('span', { class: 'chip' }, '← 뒤(rear)'));
  }
  paintQueue();

  const nextLetter = (arr) => String.fromCharCode(65 + (arr.length % 26));

  return card('② 선형 구조로 모델링 — 자료들이 일렬로 연결된 구조',
    h('h4', { style: { marginTop: '0' } }, answer('리스트'), ' — 순서가 정해진 목록'),
    listBox,
    h('div', { class: 'row tight', style: { marginTop: '8px' } },
      h('button', {
        type: 'button', class: 'btn ghost small',
        onclick: () => { listData.push(`사이트${listData.length}`); paintList(); },
      }, '＋ 항목 추가'),
      h('button', {
        type: 'button', class: 'btn gray small',
        onclick: () => { listData.pop(); paintList(); },
      }, '－ 마지막 항목 빼기'),
      h('span', { style: { color: 'var(--ink-soft)' } }, '번호(인덱스)는 0부터 시작합니다.')),

    h('div', { class: 'grid2', style: { marginTop: '20px' } },
      /* 스택 */
      h('div', {},
        h('h4', { style: { marginTop: '0' } }, answer('스택'), ' — ', answer('후입 선출'), ' LIFO (Last-In, First-Out)'),
        h('div', {
          style: { background: 'var(--accent)', color: '#fff', fontWeight: '800', textAlign: 'center', padding: '6px', borderRadius: '10px 10px 0 0' },
        }, '↕ 넣고 빼는 곳이 한 군데뿐'),
        stackBox,
        h('div', { class: 'row tight', style: { marginTop: '8px' } },
          stackInp,
          h('button', {
            type: 'button', class: 'btn small',
            onclick: () => {
              const v = stackInp.value.trim() || nextLetter(stack);
              if (stack.length >= 7) return;
              stack.push(v); stackInp.value = nextLetter(stack);
              stackLog.textContent = `push("${v}") — 맨 위에 쌓았습니다.`;
              paintStack();
            },
          }, 'push (넣기)'),
          h('button', {
            type: 'button', class: 'btn ghost small',
            onclick: () => {
              if (!stack.length) { stackLog.textContent = '비어 있어서 뺄 것이 없습니다.'; return; }
              const v = stack.pop();
              stackLog.textContent = `pop() → "${v}" — 가장 나중에 넣은 것이 먼저 나옵니다.`;
              paintStack();
            },
          }, 'pop (빼기)')),
        stackLog,
        note('', '접시 쌓기, 되돌리기(Ctrl+Z), 웹 브라우저 뒤로 가기가 스택입니다.')),

      /* 큐 */
      h('div', {},
        h('h4', { style: { marginTop: '0' } }, answer('큐'), ' — ', answer('선입 선출'), ' FIFO (First-In, First-Out)'),
        h('div', {
          style: { background: 'var(--accent)', color: '#fff', fontWeight: '800', textAlign: 'center', padding: '6px', borderRadius: '10px 10px 0 0' },
        }, '→ 뒤로 넣고 앞으로 뺀다'),
        queueBox,
        h('div', { class: 'row tight', style: { marginTop: '8px' } },
          queueInp,
          h('button', {
            type: 'button', class: 'btn small',
            onclick: () => {
              const v = queueInp.value.trim() || nextLetter(queue);
              if (queue.length >= 7) return;
              queue.push(v); queueInp.value = nextLetter(queue);
              queueLog.textContent = `enqueue("${v}") — 맨 뒤에 줄을 섰습니다.`;
              paintQueue();
            },
          }, 'enqueue (넣기)'),
          h('button', {
            type: 'button', class: 'btn ghost small',
            onclick: () => {
              if (!queue.length) { queueLog.textContent = '비어 있어서 뺄 것이 없습니다.'; return; }
              const v = queue.shift();
              queueLog.textContent = `dequeue() → "${v}" — 가장 먼저 넣은 것이 먼저 나옵니다.`;
              paintQueue();
            },
          }, 'dequeue (빼기)')),
        queueLog,
        note('', '매표소 줄 서기, 프린터 인쇄 대기열, 게임 매칭 대기가 큐입니다.'))),

    h('h4', {}, '확인 문제'),
    quizSet([
      { q: '스택에 A, B, C를 순서대로 넣은 뒤 pop을 두 번 하면 나오는 순서는?',
        answer: ['CB', 'C,B', 'C B'], width: 150,
        hint: '위 스택에 직접 넣고 빼 보세요.',
        explain: '후입 선출이므로 가장 나중에 넣은 C가 먼저, 그 다음 B가 나옵니다.' },
      { q: '큐에 A, B, C를 순서대로 넣은 뒤 dequeue를 두 번 하면 나오는 순서는?',
        answer: ['AB', 'A,B', 'A B'], width: 150,
        explain: '선입 선출이므로 먼저 넣은 A가 먼저, 그 다음 B가 나옵니다.' },
      { q: '웹 브라우저의 「뒤로 가기」 기능에 알맞은 자료구조는?',
        type: 'choice', choices: ['스택', '큐', '트리'],
        answer: '스택',
        explain: '가장 최근에 본 페이지로 먼저 돌아가야 하므로 후입 선출인 스택을 씁니다.' },
    ], { revealOnWrong: true }));
}

/* ══════════════════ ③ 비선형 구조 ══════════════════════════════════ */

function nonlinearCard() {
  const cv = h('canvas', { class: 'stage', style: { aspectRatio: '5 / 2' } });

  function draw() {
    const W = 1000, H = 400;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = cv.clientWidth || W;
    cv.width = Math.round(cw * dpr); cv.height = Math.round(cw * dpr * H / W);
    const ctx = cv.getContext('2d');
    const s = cv.width / W;
    ctx.setTransform(s, 0, 0, s, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const node = (x, y, t, color) => {
      ctx.beginPath(); ctx.arc(x, y, 26, 0, Math.PI * 2);
      ctx.fillStyle = '#fff'; ctx.fill();
      ctx.lineWidth = 3; ctx.strokeStyle = color; ctx.stroke();
      ctx.font = '800 15px system-ui, sans-serif'; ctx.fillStyle = '#1b2430';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(t, x, y + 1);
    };
    const edge = (a, b, c, d, color, dash) => {
      ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d);
      ctx.strokeStyle = color; ctx.lineWidth = 3;
      ctx.setLineDash(dash || []); ctx.stroke(); ctx.setLineDash([]);
    };

    ctx.font = '800 17px system-ui, sans-serif'; ctx.fillStyle = '#5a6675'; ctx.textAlign = 'left';
    ctx.fillText('트리 — 계층으로 표현', 30, 30);
    ctx.fillText('그래프 — 선으로 연결하여 표현', 570, 30);

    // 트리
    const T = [[230, 80, '학교'], [120, 190, '1학년'], [230, 190, '2학년'], [340, 190, '3학년'],
               [70, 300, '1반'], [170, 300, '2반'], [290, 300, '1반'], [390, 300, '2반']];
    edge(230, 106, 120, 164, '#d9781e'); edge(230, 106, 230, 164, '#d9781e'); edge(230, 106, 340, 164, '#d9781e');
    edge(120, 216, 70, 274, '#d9781e'); edge(120, 216, 170, 274, '#d9781e');
    edge(340, 216, 290, 274, '#d9781e'); edge(340, 216, 390, 274, '#d9781e');
    T.forEach(([x, y, t]) => node(x, y, t, '#d9781e'));

    // 그래프
    const G = [[680, 100, 'A'], [850, 90, 'B'], [930, 230, 'C'], [780, 320, 'D'], [630, 250, 'E']];
    const GE = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 3], [1, 3]];
    GE.forEach(([a, b]) => edge(G[a][0], G[a][1], G[b][0], G[b][1], '#0f9d6e'));
    G.forEach(([x, y, t]) => node(x, y, t, '#0f9d6e'));
  }
  drawNow(draw);
  window.addEventListener('resize', draw);

  return card('③ 비선형 구조로 모델링 — 복잡한 관계, 계층적 구조',
    h('p', {}, '자료의 복잡한 관계, 계층적 구조를 표현할 때 사용하는 불규칙한 연결 형태의 구조입니다.'),
    cv,
    h('div', { class: 'grid2', style: { marginTop: '12px' } },
      h('div', { class: 'note' }, h('b', {}, answer('트리')), ' — 데이터와 데이터 사이의 관계를 ', answer('계층'), '으로 표현하기에 적합한 구조. ',
        '위에서 아래로 갈라지고, 돌아오는 길이 없습니다. (조직도, 폴더 구조, 허프만 트리)'),
      h('div', { class: 'note ok' }, h('b', {}, answer('그래프')), ' — 데이터와 데이터 관계를 ', answer('선'), '으로 연결하여 표현하는 구조. ',
        '어느 쪽으로든 이어질 수 있고 돌아올 수도 있습니다. (지하철 노선도, 친구 관계, 도로망)')));
}

/* ══════════════════ ④ 분할정복 놀이공원 ═══════════════════════════ */

/* 지도 — 학습지의 놀이공원 활동을 이 화면에 맞게 다시 그린 것이다.
   좌표는 캔버스(1000×520) 기준. */
const PARK_NODES = {
  gate:    { x: 90,  y: 260, name: '출입구' },
  viking:  { x: 240, y: 90,  name: '바이킹' },
  food1:   { x: 400, y: 70,  name: '식당1' },
  coaster: { x: 560, y: 120, name: '롤러코스터' },
  train:   { x: 250, y: 220, name: '꼬마 기차' },
  bumper:  { x: 260, y: 350, name: '범퍼카' },
  kids:    { x: 230, y: 470, name: '어린이 놀이터' },
  ghost:   { x: 500, y: 300, name: '유령의 집' },
  wheel:   { x: 700, y: 210, name: '관람차' },
  food2:   { x: 760, y: 380, name: '식당2' },
  swing:   { x: 900, y: 250, name: '회전 그네' },
  valley:  { x: 890, y: 450, name: '신나는 계곡' },
};

const PARK_EDGES = [
  ['gate', 'viking', 4], ['viking', 'food1', 3], ['food1', 'coaster', 5], ['coaster', 'ghost', 3],
  ['gate', 'train', 6], ['train', 'ghost', 7],
  ['gate', 'bumper', 5], ['bumper', 'ghost', 6],
  ['gate', 'kids', 8], ['kids', 'ghost', 9],
  ['ghost', 'wheel', 10], ['coaster', 'wheel', 4], ['bumper', 'wheel', 5],
  ['wheel', 'swing', 9], ['wheel', 'food2', 3], ['food2', 'swing', 4], ['coaster', 'swing', 8],
  ['swing', 'valley', 12], ['food2', 'valley', 5], ['train', 'valley', 13], ['swing', 'train', 6],
];

/** 가장 짧은 경로를 찾는다 (다익스트라). 돌아오는 경로와 총 시간을 함께 준다. */
function shortest(from, to) {
  const dist = {}, prev = {};
  Object.keys(PARK_NODES).forEach((k) => { dist[k] = Infinity; });
  dist[from] = 0;
  const left = new Set(Object.keys(PARK_NODES));
  while (left.size) {
    let cur = null;
    left.forEach((k) => { if (cur === null || dist[k] < dist[cur]) cur = k; });
    if (dist[cur] === Infinity) break;
    left.delete(cur);
    if (cur === to) break;
    PARK_EDGES.forEach(([a, b, w]) => {
      const nx = a === cur ? b : b === cur ? a : null;
      if (!nx || !left.has(nx)) return;
      if (dist[cur] + w < dist[nx]) { dist[nx] = dist[cur] + w; prev[nx] = cur; }
    });
  }
  const path = [];
  for (let c = to; c; c = prev[c]) { path.unshift(c); if (c === from) break; }
  return { time: dist[to], path };
}

const LEGS = [
  ['gate', 'ghost', '출입구 → 유령의 집'],
  ['ghost', 'wheel', '유령의 집 → 관람차'],
  ['wheel', 'swing', '관람차 → 회전 그네'],
  ['swing', 'valley', '회전 그네 → 신나는 계곡'],
];

function parkCard() {
  let leg = 0;
  let picked = [];    // 학생이 누른 순서

  const cv = h('canvas', { class: 'stage', style: { aspectRatio: '25 / 13', cursor: 'pointer' } });
  const info = h('div', {});
  const legBox = h('div', { class: 'row tight' });
  const resultBox = h('div', {});
  const totalBox = h('div', {});
  const found = {};   // 구간별로 학생이 찾은 최단 시간

  function draw() {
    const W = 1000, H = 520;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = cv.clientWidth || W;
    cv.width = Math.round(cw * dpr); cv.height = Math.round(cw * dpr * H / W);
    const ctx = cv.getContext('2d');
    const s = cv.width / W;
    ctx.setTransform(s, 0, 0, s, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const [from, to] = LEGS[leg];

    // 길
    PARK_EDGES.forEach(([a, b, w]) => {
      const A = PARK_NODES[a], B = PARK_NODES[b];
      const used = picked.some((p, i) => i < picked.length - 1 &&
        ((picked[i] === a && picked[i + 1] === b) || (picked[i] === b && picked[i + 1] === a)));
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y);
      ctx.strokeStyle = used ? '#cf3030' : '#c8d1de';
      ctx.lineWidth = used ? 6 : 3;
      ctx.stroke();

      const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
      ctx.beginPath(); ctx.arc(mx, my, 14, 0, Math.PI * 2);
      ctx.fillStyle = used ? '#cf3030' : '#fff'; ctx.fill();
      ctx.strokeStyle = used ? '#cf3030' : '#c8d1de'; ctx.lineWidth = 2; ctx.stroke();
      ctx.font = '800 13px system-ui, sans-serif';
      ctx.fillStyle = used ? '#fff' : '#5a6675';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(String(w), mx, my + 1);
    });

    // 장소
    Object.entries(PARK_NODES).forEach(([k, n]) => {
      const isStart = k === from, isEnd = k === to;
      const order = picked.indexOf(k);
      ctx.beginPath(); ctx.arc(n.x, n.y, 25, 0, Math.PI * 2);
      ctx.fillStyle = isStart ? '#0f9d6e' : isEnd ? '#cf3030' : order >= 0 ? '#ffe6e6' : '#fff';
      ctx.fill();
      ctx.lineWidth = order >= 0 ? 4 : 3;
      ctx.strokeStyle = isStart ? '#0b6f4e' : isEnd ? '#8f2626' : order >= 0 ? '#cf3030' : '#9aa5b4';
      ctx.stroke();
      if (order >= 0) {
        ctx.font = '800 15px system-ui, sans-serif';
        ctx.fillStyle = isStart || isEnd ? '#fff' : '#cf3030';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(String(order + 1), n.x, n.y + 1);
      }
      ctx.font = '700 14px system-ui, sans-serif';
      ctx.fillStyle = '#1b2430'; ctx.textAlign = 'center';
      ctx.fillText(n.name, n.x, n.y + 42);
    });
  }

  function pathTime(list) {
    let t = 0;
    for (let i = 0; i < list.length - 1; i++) {
      const e = PARK_EDGES.find(([a, b]) =>
        (a === list[i] && b === list[i + 1]) || (b === list[i] && a === list[i + 1]));
      if (!e) return null;
      t += e[2];
    }
    return t;
  }

  function paintInfo() {
    const [from, to, title] = LEGS[leg];
    clear(info);
    const t = pathTime(picked);
    info.append(
      h('div', { class: 'row' },
        h('span', { class: 'chip on' }, `${leg + 1}단계`),
        h('b', { style: { fontSize: '1.15rem' } }, title),
        h('span', { class: 'spacer' }),
        h('span', {}, '지금 경로: '),
        h('b', { class: 'mono' }, picked.length ? picked.map((k) => PARK_NODES[k].name).join(' → ') : '(장소를 눌러 보세요)'),
        t !== null && picked.length > 1 ? h('span', { class: 'score' }, `${t}분`) : null));
  }

  function paintLegs() {
    clear(legBox);
    legBox.append(h('span', { class: 'chip' }, '구간 고르기'));
    LEGS.forEach(([f, t, title], i) => {
      legBox.append(h('button', {
        type: 'button', class: 'btn small' + (i === leg ? '' : ' ghost'),
        onclick: () => { leg = i; picked = [LEGS[i][0]]; draw(); paintInfo(); paintLegs(); },
      }, `${i + 1}. ${title}${found[i] ? ' ✅' : ''}`));
    });
  }

  cv.addEventListener('pointerdown', (ev) => {
    const r = cv.getBoundingClientRect();
    const x = ((ev.clientX - r.left) / r.width) * 1000;
    const y = ((ev.clientY - r.top) / r.height) * 520;
    const hitKey = Object.keys(PARK_NODES).find((k) =>
      Math.hypot(PARK_NODES[k].x - x, PARK_NODES[k].y - y) < 30);
    if (!hitKey) return;

    const [from, to] = LEGS[leg];
    if (!picked.length) picked = [from];
    if (hitKey === picked[picked.length - 1]) { /* 같은 곳 다시 누르면 무시 */ }
    else if (picked.length > 1 && hitKey === picked[picked.length - 2]) picked.pop();   // 되돌리기
    else {
      const last = picked[picked.length - 1];
      const linked = PARK_EDGES.some(([a, b]) => (a === last && b === hitKey) || (b === last && a === hitKey));
      if (!linked) { flash('그 장소와는 길이 이어져 있지 않습니다.'); return; }
      picked.push(hitKey);
    }
    draw(); paintInfo();
    if (picked[picked.length - 1] === to) checkLeg();
  });

  function flash(msg) {
    clear(resultBox);
    resultBox.append(note('bad', msg));
  }

  function checkLeg() {
    const [from, to, title] = LEGS[leg];
    const mine = pathTime(picked);
    const best = shortest(from, to);
    clear(resultBox);

    const isBest = mine === best.time;
    if (isBest) found[leg] = best.time;

    resultBox.append(h('div', { class: 'note ' + (isBest ? 'ok' : 'warn') },
      h('b', {}, isBest ? '🎉 최단 경로를 찾았습니다! ' : '도착했습니다. 하지만 더 빠른 길이 있습니다. '),
      `내가 고른 길 ${mine}분`,
      isBest ? '' : ` / 가장 빠른 길 ${best.time}분`,
      isBest ? null : h('div', { style: { marginTop: '6px' } },
        h('button', {
          type: 'button', class: 'btn ghost small',
          onclick: () => {
            picked = best.path; draw(); paintInfo();
            clear(resultBox);
            resultBox.append(note('ok', `가장 빠른 길: ${best.path.map((k) => PARK_NODES[k].name).join(' → ')} = ${best.time}분`));
            found[leg] = best.time; paintLegs(); paintTotal();
          },
        }, '가장 빠른 길 보여 주기'))));

    paintLegs(); paintTotal();
  }

  function paintTotal() {
    clear(totalBox);
    const done = LEGS.map((_, i) => found[i]);
    const all = done.every((v) => v !== undefined);
    const tbl = h('table', { class: 'tbl' },
      h('tr', {}, h('th', { class: 'left' }, '구간'), h('th', {}, '최단 시간')),
      ...LEGS.map(([f, t, title], i) => h('tr', {},
        h('td', { class: 'left' }, `${i + 1}. ${title}`),
        h('td', { class: 'mono' }, found[i] !== undefined ? `${found[i]}분` : '아직'))),
      h('tr', { class: all ? 'hl' : '' },
        h('th', { class: 'left' }, '4단계 — 작은 문제의 해를 합치면'),
        h('th', {}, all ? `${done.reduce((a, b) => a + b, 0)}분` : '－')));
    totalBox.append(tbl);
    if (all) {
      totalBox.append(note('ok',
        h('b', {}, '분할정복 완성! '),
        '큰 문제(출입구에서 네 곳을 순서대로 도는 최단 경로)를 네 개의 작은 문제로 나누어 각각 풀고, ',
        '그 답을 모두 합쳐 전체 문제를 해결했습니다. 총 ',
        h('b', {}, `${done.reduce((a, b) => a + b, 0)}분`), ' 입니다.'));
    }
  }

  picked = [LEGS[0][0]];
  paintLegs(); paintInfo(); paintTotal();
  drawNow(draw);
  window.addEventListener('resize', draw);

  return card('④ 분할정복 — 놀이공원 최단 경로 찾기',
    h('div', { class: 'note', style: { marginBottom: '14px' } },
      h('b', {}, '분할정복(Divide and conquer) '),
      '복잡한 문제를 해결 가능한 작은 문제로 나누어 해결한 후, 작은 문제의 해답을 모아서 원래의 문제를 해결하는 기법. ',
      h('br', {}),
      '1단계: 큰 문제를 작은 문제로 나누기 → 2단계: 작은 문제를 해결하기 → 3단계: 작은 문제의 해를 합치기'),

    h('p', { class: 'lead' },
      '여름이는 출입구에서 ', h('b', {}, '유령의 집 → 관람차 → 회전 그네 → 신나는 계곡'),
      ' 순서로 타려고 합니다. 전체를 한 번에 풀기는 어려우니 ', h('b', {}, '네 구간으로 나누어'), ' 하나씩 풀어 봅시다. ',
      '지도에서 장소를 차례로 눌러 길을 만드세요. (선 위의 숫자는 이동 시간(분)입니다. 한 칸 되돌리려면 직전 장소를 다시 누르세요.)'),

    legBox,
    h('div', { style: { height: '10px' } }),
    info,
    cv,
    resultBox,
    h('h4', {}, '3~4단계 — 찾은 답 모으기'),
    totalBox);
}
