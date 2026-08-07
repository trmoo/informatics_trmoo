/* ============================================================================
 * unit.js — 학습지 ⑥ 컴퓨터의 자료 표현 원리
 *   아날로그와 디지털, 비트·바이트·워드, n비트로 표현할 수 있는 정보의 수,
 *   저장 용량 단위와 계산 문제.
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

import { h, card, sheetHead, note, answer, quizSet, clear, comma, randInt, pick, bitRow, drawNow } from '../../lib/ui.js';

export function render(root) {
  root.append(...sheetHead('학습지 ⑥', 'Ⅱ. 데이터 — 컴퓨터의 자료 표현 원리',
    ['[12정02-01] 선수 개념'],
    ['컴퓨터의 자료 표현 원리를 이해할 수 있다.']));

  root.append(analogCard());
  root.append(bitCard());
  root.append(capacityCard());
}

/* ══════════════════ ① 아날로그와 디지털 ══════════════════════════════ */

function analogCard() {
  const cv = h('canvas', { class: 'stage', style: { aspectRatio: '3 / 1' } });
  let levels = 8;

  function draw() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = 900, H = 300;
    const cw = cv.clientWidth || W;
    cv.width = Math.round(cw * dpr); cv.height = Math.round(cw * dpr / 3);
    const ctx = cv.getContext('2d');
    const s = cv.width / W;
    ctx.setTransform(s, 0, 0, s, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const f = (x) => H / 2 - Math.sin(x / 70) * 85 - Math.sin(x / 23) * 22;

    // 눈금선
    ctx.strokeStyle = '#eef1f7'; ctx.lineWidth = 1;
    for (let i = 0; i <= levels; i++) {
      const y = 30 + (H - 60) * i / levels;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // 아날로그 — 부드러운 곡선
    ctx.beginPath();
    for (let x = 0; x <= W; x++) { const y = f(x); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.strokeStyle = '#9aa5b4'; ctx.lineWidth = 3; ctx.stroke();

    // 디지털 — 정해진 단계로 끊어서 계단 모양
    const step = (H - 60) / levels;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 18) {
      const y = 30 + Math.round((f(x) - 30) / step) * step;
      const nx = Math.min(W, x + 18);
      ctx.lineTo(x, y); ctx.lineTo(nx, y);
    }
    ctx.strokeStyle = '#0f9d6e'; ctx.lineWidth = 3.5; ctx.stroke();

    ctx.font = '700 15px system-ui, sans-serif';
    ctx.fillStyle = '#7b8797'; ctx.fillText('아날로그 — 연속적으로 변화', 14, 22);
    ctx.fillStyle = '#0f9d6e'; ctx.fillText(`디지털 — ${levels}단계로 끊어서 불연속적으로`, 260, 22);
  }

  const sl = h('input', {
    type: 'range', min: 2, max: 64, value: 8, style: { flex: '1', minWidth: '200px' },
    oninput: () => { levels = Number(sl.value); out.textContent = `${levels}단계`; draw(); },
  });
  const out = h('b', { class: 'big-num', style: { fontSize: '1.1rem' } }, '8단계');

  drawNow(draw);
  window.addEventListener('resize', draw);

  return card('① 아날로그와 디지털',
    h('p', {}, h('b', {}, '아날로그'), ' — ', answer('연속적'), '으로 변화하는 값을 표현'),
    h('p', {}, h('b', {}, '디지털'), ' — 연속적으로 변화하는 값을 일정한 간격으로 끊어 ', answer('불연속적'), '인 값으로 표현. ',
      '컴퓨터 내부에는 전기가 흐르거나(on) 흐르지 않는(off) 두 가지 전기 신호만 표현할 수 있으므로, ',
      '생활 속 다양한 형태의 ', answer('아날로그'), ' 자료를 ', answer('1'), '과 ', answer('0'), '의 ',
      answer('이진수'), ' 체계를 사용하여 ', answer('디지털'), ' 값으로 변환한다.'),

    h('div', { class: 'row', style: { margin: '14px 0 10px' } },
      h('label', { class: 'field' }, '몇 단계로 끊을까?'), sl, out),
    cv,
    note('', '단계를 늘릴수록 초록 계단이 회색 곡선에 가까워집니다. ',
      '하지만 아무리 늘려도 완전히 같아지지는 않습니다 — 디지털은 미세한 차이를 표현하는 데 불리합니다. ',
      '대신 명확한 숫자로 표현되므로 편집·가공·저장이 쉽고 기기끼리 호환됩니다.'),
  );
}

/* ══════════════════ ② 비트와 정보 표현 수 ═══════════════════════════ */

function bitCard() {
  /* n비트 → 정보 개수 */
  const nOut = h('b', { class: 'big-num' }, '4비트');
  const resOut = h('div', { style: { marginTop: '10px' } });
  const cardsBox = h('div', { style: { marginTop: '12px' } });
  let n = 4;

  const nInput = h('input', {
    type: 'range', min: 1, max: 16, value: 4, style: { flex: '1', minWidth: '200px' },
    oninput: () => { n = Number(nInput.value); redraw(); },
  });

  let bits = null;
  function redraw() {
    nOut.textContent = `${n}비트`;
    clear(resOut);
    resOut.append(
      h('div', { style: { fontSize: '1.15rem' } },
        `${n}비트로 나타낼 수 있는 최대 정보의 개수 = 2`,
        h('sup', {}, String(n)), ' = ',
        h('b', { class: 'big-num' }, comma(2 ** n)), '개'),
      n >= 8 ? h('div', { style: { color: 'var(--ink-soft)' } },
        `참고: ${n}비트 = ${(n / 8).toFixed(n % 8 ? 3 : 0)}바이트`) : null,
    );

    clear(cardsBox);
    if (n <= 10) {
      const br = bitRow(n, { value: 0, onChange: (v) => { valOut.textContent = comma(v); } });
      bits = br;
      const valOut = h('b', { class: 'big-num' }, '0');
      cardsBox.append(
        h('p', { style: { margin: '0 0 8px', color: 'var(--ink-soft)' } },
          '카드를 눌러 뒤집어 보세요. (원이 그려진 카드는 1, 뒷면은 0)'),
        br.el,
        h('div', { class: 'row', style: { marginTop: '10px' } },
          h('span', {}, '지금 카드가 나타내는 십진수 = '), valOut,
          h('span', { class: 'spacer' }),
          h('button', { type: 'button', class: 'btn ghost small', onclick: () => { br.set(2 ** n - 1); valOut.textContent = comma(2 ** n - 1); } }, '전부 1로'),
          h('button', { type: 'button', class: 'btn gray small', onclick: () => { br.set(0); valOut.textContent = '0'; } }, '전부 0으로')));
    } else {
      cardsBox.append(note('', '카드는 10비트까지만 그립니다. 막대를 왼쪽으로 밀어 보세요.'));
    }
  }
  redraw();

  /* 학습지 ▣ 문제 — 정보 개수 → 최소 비트 수 */
  const infoItems = [
    { t: '동, 서, 남, 북', cnt: 4, bits: 2 },
    { t: '무지개 색깔(빨, 주, 노, 초, 파, 남, 보)', cnt: 7, bits: 3 },
    { t: '알파벳 대문자(A~Z)', cnt: 26, bits: 5 },
    { t: '가위·바위·보', cnt: 3, bits: 2 },
    { t: '한 학급 학생 35명', cnt: 35, bits: 6 },
    { t: '1년 열두 달', cnt: 12, bits: 4 },
  ];

  return card('② 비트와 정보 표현 수의 관계',
    h('div', { class: 'grid2' },
      h('div', {},
        h('h4', {}, '정보 단위'),
        h('ul', {},
          h('li', {}, h('b', {}, '비트(bit, BInary digiT)'), ' — 정보를 구성하는 최소 단위. 이진수 한 자릿수(0 또는 1)를 저장하는 공간'),
          h('li', {}, h('b', {}, '바이트(B, byte)'), ' — 비트가 연속적으로 ', answer('8'), '개 모인 정보 단위. 정보 표현의 기본 단위. ',
            h('span', { class: 'chip' }, '예 56비트 = 7바이트')),
          h('li', {}, h('b', {}, '워드(word)'), ' — 중앙처리장치에서 한 번에 처리할 수 있는 비트의 집합. 컴퓨터마다 크기가 다름')),
        note('warn', h('b', {}, '왜 하필 8비트일까? '),
          '아스키코드가 한 문자를 7비트로 저장했는데, 오류를 확인할 1비트를 더해 8비트가 되었습니다. ',
          '게다가 8은 2³이라 비트로 계산하는 컴퓨터에게 편리한 숫자였습니다.')),
      h('div', {},
        h('h4', {}, 'n비트로 몇 개를 표현할 수 있을까'),
        h('div', { class: 'row' }, h('label', { class: 'field' }, '비트 수'), nInput, nOut),
        resOut,
        cardsBox)),

    h('h4', {}, '▣ 다음 정보를 구분하여 표현하려면 최소 몇 비트가 필요할까?'),
    h('div', { class: 'note', style: { marginBottom: '12px' } },
      'x개의 정보를 표현하기 위한 최소 비트 수 n : ', h('b', {}, 'x ≤ 2ⁿ'), ' 을 만족하는 가장 작은 n'),
    quizSet(infoItems.map((it) => ({
      q: [it.t, ' → ', h('b', {}, `${it.cnt}개`), ' 의 정보를 표현하려면 최소 몇 비트?'],
      answer: [String(it.bits), it.bits + '비트'], unit: '비트', width: 110,
      hint: `2를 계속 곱해 보세요. ${it.cnt} 이상이 되는 첫 번째 2의 거듭제곱을 찾으면 됩니다.`,
      explain: `2^${it.bits - 1} = ${2 ** (it.bits - 1)} 은 ${it.cnt}보다 작고, 2^${it.bits} = ${2 ** it.bits} 은 ${it.cnt} 이상입니다. 따라서 ${it.bits}비트.`,
    })), { revealOnWrong: true }));
}

/* ══════════════════ ③ 저장 용량 단위와 계산 ═════════════════════════ */

const UNITS = [
  ['B', 'Byte', '= 8bits', '일', '한 문자'],
  ['KB', 'Kilo Byte', '= 1,024', '천', '대략 1/2페이지의 텍스트'],
  ['MB', 'Mega Byte', '= 1,048,576', '백만', '대략 책 1권, 고화질 사진 1장'],
  ['GB', 'Giga Byte', '= 1,073,741,824', '십억', '대략 영화 1편, 수천 장의 사진'],
  ['TB', 'Tera Byte', '= 1,024⁴', '조', '대략 수백 편의 영화'],
  ['PB', 'Peta Byte', '= 1,024⁵', '천조', '대규모 데이터 센터, 대기업의 연간 데이터 양'],
  ['EB', 'Exa Byte', '= 1,024⁶', '백경', '전 세계 인터넷 전체 트래픽 (1~2일 기준)'],
  ['ZB', 'Zetta Byte', '= 1,024⁷', '십해', '인류 전체 역사 문서·영상·오디오를 디지털화한 용량'],
  ['YB', 'Yotta Byte', '= 1,024⁸', '자', '지구 전체 데이터 저장의 한계 수준'],
];

function capacityCard() {
  /* 용량 변환기 */
  const valInp = h('input', { type: 'number', value: 3, style: { width: '110px' }, oninput: conv });
  const fromSel = h('select', { onchange: conv },
    ...['B', 'KB', 'MB', 'GB', 'TB'].map((u) => h('option', { value: u, selected: u === 'GB' }, u)));
  const convOut = h('div', { class: 'row tight', style: { marginTop: '10px' } });

  function conv() {
    const idx = ['B', 'KB', 'MB', 'GB', 'TB'].indexOf(fromSel.value);
    const bytes = Number(valInp.value || 0) * 1024 ** idx;
    clear(convOut);
    ['B', 'KB', 'MB', 'GB', 'TB'].forEach((u, i) => {
      const v = bytes / 1024 ** i;
      convOut.append(h('span', {
        class: 'chip' + (i === idx ? ' on' : ''),
        style: { fontFamily: 'var(--mono)', fontSize: '1rem' },
      }, `${v >= 1000 || Number.isInteger(v) ? comma(v) : v.toFixed(4).replace(/0+$/, '')} ${u}`));
    });
  }
  conv();

  /* 문제 생성기 */
  const probBox = h('div', {});
  function newProblem() {
    clear(probBox);
    const kind = randInt(1, 3);
    const gb = pick([3, 5, 8, 10, 16, 32]);
    const totalMB = gb * 1024;
    const fileMB = pick([120, 250, 350, 480, 700, 1500]);

    if (kind === 1) {
      const cnt = Math.floor(totalMB / fileMB);
      probBox.append(
        h('div', { class: 'note', style: { marginBottom: '12px' } },
          `${gb}GB의 저장 공간에 ${fileMB}MB 크기의 파일을 저장하려고 합니다. 최대 몇 개 저장할 수 있을까요?`),
        quizSet([
          { q: '먼저 전체 용량을 MB로 바꾸면?', answer: [String(totalMB), comma(totalMB)], unit: 'MB', width: 130,
            hint: '1GB = 1,024MB 입니다.', explain: `${gb} × 1,024 = ${comma(totalMB)}MB` },
          { q: '최대 몇 개 저장할 수 있나요?', answer: String(cnt), unit: '개', width: 110,
            hint: '나누고 나서 소수점 아래는 버립니다. 반쪽짜리 파일은 저장할 수 없으니까요.',
            explain: `${comma(totalMB)} ÷ ${fileMB} = ${(totalMB / fileMB).toFixed(3)}… → 최대 ${cnt}개` },
        ], { revealOnWrong: true }));
    } else if (kind === 2) {
      const cnt = Math.floor(totalMB / fileMB);
      const used = cnt * fileMB;
      const left = totalMB - used;
      probBox.append(
        h('div', { class: 'note', style: { marginBottom: '12px' } },
          `${gb}GB USB에 ${fileMB}MB 크기의 영상을 저장하려고 합니다. 최대 몇 개 저장할 수 있으며, 남는 용량은 몇 MB인가요?`),
        quizSet([
          { q: '최대 몇 개?', answer: String(cnt), unit: '개', width: 110,
            explain: `${comma(totalMB)}MB ÷ ${fileMB}MB = ${(totalMB / fileMB).toFixed(4)}… → ${cnt}개` },
          { q: '남는 용량은?', answer: [String(left), comma(left)], unit: 'MB', width: 130,
            hint: `쓴 용량 = ${fileMB} × ${cnt} 입니다.`,
            explain: `사용된 용량 ${fileMB} × ${cnt} = ${comma(used)}MB / 남는 용량 ${comma(totalMB)} − ${comma(used)} = ${comma(left)}MB` },
        ], { revealOnWrong: true }));
    } else {
      const reserve = pick([200, 250, 300, 500]);
      const usableMB = totalMB - reserve;
      const cnt = Math.floor(usableMB / fileMB);
      probBox.append(
        h('div', { class: 'note', style: { marginBottom: '12px' } },
          `${gb}GB 저장 공간에 ${fileMB}MB 파일을 저장하려고 합니다. 모두 저장한 후 남는 용량이 ${reserve}MB 이상이 되도록 하려면 최대 몇 개까지 저장할 수 있을까요?`),
        quizSet([
          { q: '파일 저장에 쓸 수 있는 용량은?', answer: [String(usableMB), comma(usableMB)], unit: 'MB', width: 140,
            explain: `${comma(totalMB)} − ${reserve} = ${comma(usableMB)}MB` },
          { q: '최대 몇 개?', answer: String(cnt), unit: '개', width: 110,
            explain: `${comma(usableMB)} ÷ ${fileMB} = ${(usableMB / fileMB).toFixed(3)}… → ${cnt}개` },
        ], { revealOnWrong: true }));
    }
  }
  newProblem();

  return card('③ 저장 용량 단위',
    h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', {}, '표기'), h('th', {}, '단위'), h('th', {}, '계산 (바이트 수)'), h('th', {}, '계량 단위'), h('th', { class: 'left' }, '생활 속 정보 크기와의 비교')),
      UNITS.map(([a, b, c, d, e]) => h('tr', {},
        h('th', {}, a), h('td', {}, b), h('td', { class: 'mono' }, c), h('td', {}, d), h('td', { class: 'left' }, e))),
    )),

    h('h4', {}, '용량 바꾸기'),
    h('div', { class: 'row' }, valInp, fromSel, h('span', {}, '는 다른 단위로 얼마?')),
    convOut,

    h('h4', {}, '▣ 저장 용량으로 파일 개수 구하기'),
    h('div', { class: 'row', style: { marginBottom: '12px' } },
      h('button', { type: 'button', class: 'btn', onclick: newProblem }, '새 문제 만들기')),
    probBox);
}
