/* ============================================================================
 * bigdata.js — 학습지 ⑫ 빅데이터의 개념과 분석
 *   3V 개념 정리, 정형·비정형 분류 연습,
 *   그리고 학습지의 「검색어 트렌드」 활동을 인터넷 없이도 해 볼 수 있도록
 *   직접 값을 넣어 선 그래프(시간 시각화)를 그리고 상관을 계산해 준다.
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

import { h, card, sheetHead, note, answer, clear, shuffle, quizSet, drawNow } from '../../lib/ui.js';

export function render(root) {
  root.append(...sheetHead('학습지 ⑫', 'Ⅱ-2. 빅데이터의 개념과 분석 (1) 빅데이터의 이해',
    ['[12정02-03]', '[12정02-04]'],
    ['빅데이터의 개념과 특징을 설명할 수 있다.']));

  root.append(conceptCard());
  root.append(sortGame());
  root.append(trendCard());
}

/* ══════════════════ ① 3V ═══════════════════════════════════════════ */

function conceptCard() {
  return card('① 빅데이터의 특징 3V',
    h('p', {}, h('b', {}, '빅데이터'), ' — 생성 주기가 짧은 방대한 규모의 디지털 데이터. ',
      '데이터를 수집·저장·관리·분석할 수 있는 역량을 넘어서, 대량의 데이터로부터 가치를 추출하고 결과를 분석하는 기술.'),

    h('div', { class: 'grid3', style: { margin: '16px 0' } },
      vCard('Volume', '규모', ['기술의 발전과 IT의 일상화로', ['디지털 ', '정보량'], '이 기하급수적으로 폭증']),
      vCard('Velocity', '속도', [['', '실시간성'], ' 정보 증가. 대규모 데이터 처리 및 가치 있는 현 정보 활용을 위해 처리·분석 속도가 중요']),
      vCard('Variety', '다양성', [['', '다양한 형태'], '의 자료를 처리'])),

    note('', '※ ', h('b', {}, '가치'), '(Value, 숨겨진 가치를 찾음), ',
      h('b', {}, '정확성'), '(Veracity, 유용하고 신뢰할 수 있는 데이터를 다룸)의 특징이 추가되기도 합니다.'),

    h('h4', {}, '데이터의 형태'),
    h('div', { class: 'grid2' },
      h('div', { class: 'note' },
        h('b', {}, answer('정형'), ' 데이터'), h('br', {}),
        '고정된 형식과 구조에 맞게 저장된 데이터', h('br', {}),
        h('span', { class: 'chip' }, '예 행과 열로 구별하는 표, 콤마(,)로 구별하는 CSV 형식')),
      h('div', { class: 'note warn' },
        h('b', {}, answer('비정형'), ' 데이터'), h('br', {}),
        '고정된 구조나 형태가 없는 데이터', h('br', {}),
        h('span', { class: 'chip' }, '예 이미지, 소리, 보고서(문서)'))));
}

function vCard(en, ko, parts) {
  const body = parts.map((p) => (Array.isArray(p) ? [p[0], answer(p[1])] : p));
  return h('div', { style: { border: '2px solid var(--accent)', borderRadius: '10px', padding: '14px', background: '#fbfcfe' } },
    h('div', { style: { fontWeight: '800', fontSize: '1.2rem', color: 'var(--accent)' } }, en),
    h('div', { class: 'chip', style: { marginBottom: '8px' } }, ko),
    h('div', {}, ...body.flat()));
}

/* ══════════════════ ② 정형 / 비정형 분류 게임 ═══════════════════════ */

const SAMPLES = [
  { t: '학급 학생들의 키와 몸무게를 적은 엑셀 표', a: '정형' },
  { t: '급식실 CCTV 영상', a: '비정형' },
  { t: '편의점 판매 내역 CSV 파일', a: '정형' },
  { t: '친구와 주고받은 카카오톡 대화 내용', a: '비정형' },
  { t: '학교 도서관의 도서 대출 기록 데이터베이스', a: '정형' },
  { t: '체육대회에서 찍은 사진 300장', a: '비정형' },
  { t: '기상청이 매시간 기록한 기온·습도 표', a: '정형' },
  { t: '유튜브에 올라온 강의 영상', a: '비정형' },
  { t: '수행평가로 제출한 한글 보고서 파일', a: '비정형' },
  { t: '온라인 쇼핑몰의 주문 번호·상품명·가격 목록', a: '정형' },
];

function sortGame() {
  let items = shuffle(SAMPLES);
  let idx = 0, score = 0;

  const qBox = h('div', {});
  const bar = h('div', { class: 'row' });
  const boxA = h('div', { class: 'queuebox', style: { flexWrap: 'wrap', minHeight: '90px' } });
  const boxB = h('div', { class: 'queuebox', style: { flexWrap: 'wrap', minHeight: '90px' } });

  function paint() {
    clear(qBox); clear(bar);
    if (idx >= items.length) {
      qBox.append(h('div', { class: 'note ok', style: { fontSize: '1.15rem' } },
        `끝났습니다! ${items.length}문제 중 `, h('b', {}, `${score}개`), ' 정답.'));
      bar.append(h('button', {
        type: 'button', class: 'btn',
        onclick: () => { items = shuffle(SAMPLES); idx = 0; score = 0; clear(boxA); clear(boxB); paint(); },
      }, '다시 하기'));
      return;
    }
    const cur = items[idx];
    qBox.append(h('div', { style: { fontSize: '1.2rem', fontWeight: '700', padding: '12px 0' } },
      `${idx + 1} / ${items.length}. `, cur.t));

    const answerWith = (choice) => {
      const ok = choice === cur.a;
      if (ok) score++;
      (choice === '정형' ? boxA : boxB).append(h('div', {
        class: 'item',
        style: { background: ok ? 'var(--ok)' : 'var(--bad)', fontSize: '0.9rem', padding: '6px 11px' },
      }, (ok ? '⭕ ' : '❌ ') + cur.t));
      idx++;
      paint();
    };

    bar.append(
      h('button', { type: 'button', class: 'btn', onclick: () => answerWith('정형') }, '📊 정형 데이터'),
      h('button', { type: 'button', class: 'btn ghost', onclick: () => answerWith('비정형') }, '🖼️ 비정형 데이터'),
      h('span', { class: 'spacer' }),
      h('span', { class: 'score' }, `${score}점`));
  }
  paint();

  return card('② 정형일까 비정형일까 — 분류 연습',
    qBox, bar,
    h('div', { class: 'grid2', style: { marginTop: '14px' } },
      h('div', {}, h('h4', { style: { marginTop: '0' } }, '📊 정형이라고 답한 것'), boxA),
      h('div', {}, h('h4', { style: { marginTop: '0' } }, '🖼️ 비정형이라고 답한 것'), boxB)),
    note('', '판단 기준: ', h('b', {}, '행과 열로 깔끔하게 정리할 수 있으면 정형'),
      '입니다. 사진·영상·소리·자유롭게 쓴 글은 그렇게 정리할 수 없으므로 비정형입니다.'));
}

/* ══════════════════ ③ 검색어 트렌드 (시간 시각화) ═══════════════════ */

const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

/* 수업용으로 만든 가상의 값이다. 실제 검색량이 아니다. */
const DEMO = {
  '아이스크림 · 붕어빵': [
    { name: '아이스크림', v: [12, 14, 22, 38, 58, 82, 100, 95, 62, 35, 20, 14] },
    { name: '붕어빵', v: [72, 55, 28, 12, 6, 4, 3, 4, 10, 32, 68, 100] },
  ],
  '수능 · 수시 · 정시': [
    { name: '수능', v: [18, 15, 20, 22, 26, 34, 40, 48, 62, 78, 100, 44] },
    { name: '수시', v: [12, 14, 18, 22, 30, 40, 58, 92, 100, 55, 30, 18] },
    { name: '정시', v: [30, 20, 14, 12, 12, 14, 18, 22, 30, 44, 72, 100] },
  ],
  '독감 · 마스크': [
    { name: '독감', v: [88, 70, 40, 22, 14, 10, 9, 11, 18, 34, 62, 100] },
    { name: '마스크', v: [76, 62, 44, 30, 24, 18, 16, 18, 26, 38, 58, 84] },
  ],
};

function trendCard() {
  let series = DEMO['아이스크림 · 붕어빵'].map((s) => ({ name: s.name, v: s.v.slice() }));
  const cv = h('canvas', { class: 'stage', style: { aspectRatio: '2 / 1' } });
  const tableBox = h('div', { class: 'scroll-x' });
  const analysis = h('div', {});

  const COLORS = ['#1e6fd9', '#d9781e', '#0f9d6e', '#8b46d8'];

  function draw() {
    const W = 1000, H = 500;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = cv.clientWidth || W;
    cv.width = Math.round(cw * dpr); cv.height = Math.round(cw * dpr * H / W);
    const ctx = cv.getContext('2d');
    const s = cv.width / W;
    ctx.setTransform(s, 0, 0, s, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const L = 60, R = 24, T = 30, B = 54;
    const gw = W - L - R, gh = H - T - B;
    const max = Math.max(10, ...series.flatMap((x) => x.v));

    // 눈금
    ctx.strokeStyle = '#e7ecf4'; ctx.lineWidth = 1;
    ctx.font = '12px system-ui, sans-serif'; ctx.fillStyle = '#9aa5b4'; ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = T + gh - (gh * i) / 5;
      ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(W - R, y); ctx.stroke();
      ctx.fillText(String(Math.round((max * i) / 5)), L - 8, y + 4);
    }
    ctx.textAlign = 'center';
    MONTHS.forEach((m, i) => {
      const x = L + (gw * i) / (MONTHS.length - 1);
      ctx.fillText(m, x, H - B + 20);
    });

    // 선
    series.forEach((sr, si) => {
      ctx.beginPath();
      sr.v.forEach((v, i) => {
        const x = L + (gw * i) / (MONTHS.length - 1);
        const y = T + gh - (gh * v) / max;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      ctx.strokeStyle = COLORS[si % COLORS.length]; ctx.lineWidth = 3.5; ctx.stroke();

      // 점 + 최고점 표시
      const peak = sr.v.indexOf(Math.max(...sr.v));
      sr.v.forEach((v, i) => {
        const x = L + (gw * i) / (MONTHS.length - 1);
        const y = T + gh - (gh * v) / max;
        ctx.beginPath(); ctx.arc(x, y, i === peak ? 8 : 4.5, 0, Math.PI * 2);
        ctx.fillStyle = COLORS[si % COLORS.length]; ctx.fill();
        if (i === peak) {
          ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = COLORS[si % COLORS.length];
          ctx.font = '800 13px system-ui, sans-serif';
          ctx.fillText('최고점', x, y - 15);
          ctx.font = '12px system-ui, sans-serif';
        }
      });
    });

    // 범례
    ctx.textAlign = 'left'; ctx.font = '800 15px system-ui, sans-serif';
    series.forEach((sr, si) => {
      const x = L + si * 150;
      ctx.fillStyle = COLORS[si % COLORS.length];
      ctx.fillRect(x, 10, 22, 5);
      ctx.fillText(sr.name, x + 28, 18);
    });

    drawTable(); drawAnalysis();
  }

  function drawTable() {
    clear(tableBox);
    const head = h('tr', {}, h('th', { class: 'left' }, '키워드'), ...MONTHS.map((m) => h('th', {}, m)));
    const rows = series.map((sr, si) => h('tr', {},
      h('th', { class: 'left' }, h('input', {
        type: 'text', value: sr.name, style: { width: '110px', padding: '3px 7px', borderColor: COLORS[si % COLORS.length] },
        oninput: (e) => { sr.name = e.target.value; draw(); },
      })),
      ...sr.v.map((v, i) => h('td', {}, h('input', {
        type: 'number', class: 'mono', value: v, min: 0, max: 100,
        style: { width: '52px', padding: '3px', textAlign: 'center' },
        oninput: (e) => { sr.v[i] = Math.max(0, Math.min(100, Number(e.target.value) || 0)); draw(); },
      })))));
    tableBox.append(h('table', { class: 'tbl' }, head, ...rows));
  }

  /** 두 줄 사이의 상관계수 — 함께 오르내리면 1에 가깝고, 반대로 움직이면 -1에 가깝다. */
  function corr(a, b) {
    const n = a.length;
    const ma = a.reduce((x, y) => x + y, 0) / n, mb = b.reduce((x, y) => x + y, 0) / n;
    let sab = 0, sa = 0, sb = 0;
    for (let i = 0; i < n; i++) { sab += (a[i] - ma) * (b[i] - mb); sa += (a[i] - ma) ** 2; sb += (b[i] - mb) ** 2; }
    return sa && sb ? sab / Math.sqrt(sa * sb) : 0;
  }

  function drawAnalysis() {
    clear(analysis);
    const lines = series.map((sr) => {
      const peak = sr.v.indexOf(Math.max(...sr.v));
      const low = sr.v.indexOf(Math.min(...sr.v));
      return h('li', {}, h('b', {}, sr.name), ` — 가장 높았던 달: ${MONTHS[peak]} (${sr.v[peak]}), 가장 낮았던 달: ${MONTHS[low]} (${sr.v[low]})`);
    });
    analysis.append(h('ul', {}, lines));

    if (series.length >= 2) {
      const pairs = [];
      for (let i = 0; i < series.length; i++) {
        for (let j = i + 1; j < series.length; j++) {
          const c = corr(series[i].v, series[j].v);
          pairs.push(h('tr', {},
            h('td', { class: 'left' }, `${series[i].name} ↔ ${series[j].name}`),
            h('td', { class: 'mono' }, c.toFixed(2)),
            h('td', { class: 'left' },
              c > 0.6 ? '함께 오르내립니다 (양의 상관)' :
              c < -0.6 ? '한쪽이 오르면 다른 쪽이 내려갑니다 (음의 상관)' :
              '뚜렷한 관계가 보이지 않습니다')));
        }
      }
      analysis.append(h('h4', {}, '키워드 사이의 관계'),
        h('table', { class: 'tbl' },
          h('tr', {}, h('th', { class: 'left' }, '두 키워드'), h('th', {}, '상관계수'), h('th', { class: 'left' }, '읽는 법')),
          ...pairs));
    }
  }

  drawNow(draw);
  window.addEventListener('resize', draw);

  const worksheet = (label, place) => h('div', { style: { marginBottom: '10px' } },
    h('div', { style: { fontWeight: '700', marginBottom: '4px' } }, label),
    h('textarea', { rows: 2, placeholder: place, style: { width: '100%' } }));

  return card('③ 검색어 트렌드 — 시간 시각화로 추세 비교하기',
    h('p', { class: 'lead' },
      '아래 표의 숫자를 고치면 그래프가 바로 바뀝니다. ',
      '실제 수업에서는 ', h('b', {}, '구글 트렌드'), '(글로벌)나 ', h('b', {}, '네이버 데이터랩'),
      '(국내)에서 얻은 값을 옮겨 적어 보세요.'),
    note('warn', '아래 예시 숫자는 ', h('b', {}, '수업용으로 만든 가상 자료'), '입니다. 실제 검색량이 아닙니다.'),

    h('div', { class: 'row tight', style: { margin: '12px 0' } },
      h('span', { class: 'chip' }, '예시 불러오기'),
      Object.keys(DEMO).map((k) => h('button', {
        type: 'button', class: 'btn ghost small',
        onclick: () => { series = DEMO[k].map((s) => ({ name: s.name, v: s.v.slice() })); draw(); },
      }, k)),
      h('button', {
        type: 'button', class: 'btn gray small',
        onclick: () => { series = [{ name: '키워드1', v: new Array(12).fill(0) }, { name: '키워드2', v: new Array(12).fill(0) }]; draw(); },
      }, '빈 표로 시작')),

    cv,
    h('h4', {}, '값 넣기 (0~100)'),
    tableBox,
    h('div', { class: 'row tight', style: { marginTop: '10px' } },
      h('button', {
        type: 'button', class: 'btn small',
        onclick: () => { if (series.length < 4) { series.push({ name: `키워드${series.length + 1}`, v: new Array(12).fill(0) }); draw(); } },
      }, '＋ 키워드 추가'),
      h('button', {
        type: 'button', class: 'btn gray small',
        onclick: () => { if (series.length > 1) { series.pop(); draw(); } },
      }, '－ 키워드 빼기')),

    h('h4', {}, '그래프 읽기'),
    analysis,

    h('h4', {}, '▣ 활동지 — 분석 결과를 적어 봅시다'),
    worksheet('Q1. 선택한 키워드들의 검색량이 가장 높았던 시기(최고점)는 언제인가요?', '예: 아이스크림은 7월, 붕어빵은 12월'),
    worksheet('Q2. 그 시기에 검색량이 급증한 이유는 무엇일까요? (당시의 사회적 이슈나 뉴스를 찾아 원인을 유추해 보세요)', '예: 여름 더위가 절정에 이르렀기 때문이다'),
    worksheet('Q3. 키워드들 간의 검색량 변화에 어떤 차이점이나 상관관계가 있나요?', '위 상관계수 표를 참고해 적어 보세요'),
    worksheet('Q4. 이 분야가 앞으로 우리 사회에 어떤 영향을 미칠지 자신의 생각을 적어 봅시다.', ''),

    h('h4', {}, '확인 문제'),
    quizSet([
      { q: '빅데이터의 3V에 해당하지 않는 것은?',
        type: 'choice', choices: ['Volume(규모)', 'Velocity(속도)', 'Variety(다양성)', 'Visual(시각성)'],
        answer: 'Visual(시각성)',
        explain: '3V는 Volume, Velocity, Variety 입니다. 여기에 Value(가치), Veracity(정확성)가 추가되기도 합니다.' },
      { q: '시간에 따른 변화 추이를 나타내기에 가장 알맞은 그래프는?',
        type: 'choice', choices: ['원 그래프', '선 그래프', '산점도'],
        answer: '선 그래프',
        explain: '시간 시각화에는 선 그래프를 씁니다. 시간 순서대로 이어져 추세가 보입니다.' },
      { q: '두 키워드의 상관계수가 -0.9 라면?',
        type: 'choice', choices: ['함께 오르내린다', '한쪽이 오르면 다른 쪽은 내려간다', '아무 관계가 없다'],
        answer: '한쪽이 오르면 다른 쪽은 내려간다',
        hint: '위 「아이스크림 · 붕어빵」 예시를 불러와 상관계수를 확인해 보세요.',
        explain: '상관계수가 -1에 가까울수록 정반대로 움직입니다. 아이스크림과 붕어빵이 그런 예입니다.' },
    ], { revealOnWrong: true }));
}
