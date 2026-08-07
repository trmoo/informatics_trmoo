/* ============================================================================
 * ui.js — 모든 탭이 함께 쓰는 화면 조각 만들기 도구
 *
 * 여기에 모아 둔 것
 *   h()        : 태그 하나를 만드는 가장 작은 도구 (다른 모든 것의 재료)
 *   card()     : 흰 상자
 *   answer()   : 학습지의 ( 괄호 정답 ) — 처음엔 가려 두고 [보기] 를 눌러야 열린다
 *   quizSet()  : 문제 여러 개 + 채점 + 힌트 + 해설
 *   bitRow()   : 눌러서 0↔1 을 바꾸는 비트 카드 줄
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

/**
 * 태그 하나를 만든다.
 *   h('div', { class: 'card' }, '글자', h('b', {}, '굵게'))
 * attrs 안에서 on으로 시작하는 키는 이벤트로 붙는다. (onclick, oninput …)
 */
export function h(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
    else if (k === 'html') e.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
    else e.setAttribute(k, v === true ? '' : v);
  }
  add(e, kids);
  return e;
}

/** 자식(문자열·노드·배열·null 섞여도 됨)을 붙인다. */
export function add(parent, kids) {
  for (const k of kids.flat(9)) {
    if (k === null || k === undefined || k === false) continue;
    parent.append(k instanceof Node ? k : document.createTextNode(String(k)));
  }
  return parent;
}

/** 안을 비운다. */
export function clear(e) {
  while (e.firstChild) e.removeChild(e.firstChild);
  return e;
}

/* ─────────────────────────────── 큰 틀 조각 ──────────────────────────── */

/** 흰 상자 하나. 제목은 생략 가능. */
export function card(title, ...kids) {
  return h('section', { class: 'card' }, title ? h('h3', {}, title) : null, ...kids);
}

/** 학습지 머리 — 번호 + 제목 + 성취기준 + 배움 목표 */
export function sheetHead(no, title, stds = [], goals = []) {
  return [
    h('div', { class: 'sheet-head' },
      no ? h('span', { class: 'sheet-no' }, no) : null,
      h('h2', {}, title),
      stds.map((s) => h('span', { class: 'std', title: '2022 개정 교육과정 성취기준' }, s)),
    ),
    goals.length
      ? h('div', { class: 'goals' }, h('ul', {}, goals.map((g) => h('li', {}, g))))
      : null,
  ];
}

/** 작은 안내 상자. kind: '' | 'warn' | 'bad' | 'ok' */
export function note(kind, ...kids) {
  return h('div', { class: 'note' + (kind ? ' ' + kind : '') }, ...kids);
}

/* ──────────────────────────── ( 괄호 정답 ) ──────────────────────────── */

/**
 * 학습지의 괄호 정답. 처음에는 가려져 있고 [보기] 를 눌러야 열린다.
 * 교사가 설명할 때는 화면 위쪽 [모두 열기] 로 한꺼번에 열 수 있다.
 */
export function answer(text) {
  const slot = h('span', { class: 'slot' }, text);
  const btn = h('button', { type: 'button' }, '보기');
  const box = h('span', { class: 'answer', 'data-answer': '1' }, slot, btn);
  btn.addEventListener('click', () => {
    const open = box.classList.toggle('open');
    btn.textContent = open ? '숨기기' : '보기';
  });
  return box;
}

/** 화면 안의 모든 ( 괄호 정답 ) 을 한꺼번에 열거나 닫는다. */
export function toggleAllAnswers(root, open) {
  root.querySelectorAll('.answer[data-answer]').forEach((box) => {
    box.classList.toggle('open', open);
    const b = box.querySelector('button');
    if (b) b.textContent = open ? '숨기기' : '보기';
  });
}

/* ──────────────────────────────── 문제 채점 ──────────────────────────── */

/** 답 비교용으로 문자열을 다듬는다 — 공백·대소문자·따옴표 차이를 무시한다. */
export function norm(s) {
  return String(s ?? '')
    .replace(/\s+/g, '')
    .replace(/[’‘]/g, "'")
    .replace(/[”“]/g, '"')
    .toLowerCase();
}

/**
 * 문제 묶음을 만든다.
 *
 * items 의 한 항목
 *   q       : 문제 (문자열 또는 노드 또는 노드 배열)
 *   type    : 'text'(기본) | 'choice' | 'ox'
 *   choices : type 이 choice 일 때 보기 배열
 *   answer  : 정답. 배열이면 그중 하나만 맞으면 정답
 *   check   : (입력값) => true/false  — answer 대신 직접 판정하고 싶을 때
 *   hint    : 힌트 문구
 *   explain : 해설 (채점 후 보임)
 *   place   : 입력칸 안내 문구
 *   width   : 입력칸 너비(px)
 */
export function quizSet(items, opts = {}) {
  const rows = [];
  const wrap = h('div', {});

  items.forEach((it, i) => {
    const row = h('div', { class: 'quiz' });
    const verdict = h('div', { class: 'verdict', style: { display: 'none' } });
    const explain = h('div', { class: 'explain', style: { display: 'none' } },
      it.explain ? [h('b', {}, '해설 '), it.explain] : null);
    let read = () => '';
    let paint = () => {};

    const qLine = h('div', { class: 'q' }, h('span', { class: 'num' }, `${i + 1}.`),
      ...(Array.isArray(it.q) ? it.q : [it.q]));

    let field;
    if (it.type === 'choice' || it.type === 'ox') {
      const choices = it.type === 'ox' ? ['O', 'X'] : it.choices;
      const name = `q${Math.random().toString(36).slice(2)}`;
      const btns = choices.map((c, ci) => {
        const b = h('button', { type: 'button', class: 'btn ghost small', 'data-v': String(ci) }, c);
        b.addEventListener('click', () => {
          btns.forEach((x) => x.classList.add('ghost'));
          b.classList.remove('ghost');
          b.dataset.picked = '1';
          btns.forEach((x) => { if (x !== b) delete x.dataset.picked; });
        });
        return b;
      });
      field = h('div', { class: 'row tight', 'data-name': name }, btns);
      read = () => {
        const p = btns.find((b) => b.dataset.picked);
        return p ? p.textContent : '';
      };
    } else {
      const inp = h('input', {
        type: 'text',
        class: 'mono',
        placeholder: it.place || '답 입력',
        style: { width: (it.width || 200) + 'px' },
      });
      inp.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') grade(); });
      field = h('div', { class: 'row tight' }, inp,
        it.unit ? h('span', { class: 'chip' }, it.unit) : null);
      read = () => inp.value;
      paint = (ok) => { inp.style.borderColor = ok ? 'var(--ok)' : 'var(--bad)'; };
    }

    const hintBox = it.hint ? h('div', { class: 'hintbox', style: { display: 'none' } },
      h('b', {}, '힌트 '), it.hint) : null;

    const hintBtn = it.hint
      ? h('button', {
          type: 'button', class: 'btn gray small',
          onclick: () => {
            const on = hintBox.style.display === 'none';
            hintBox.style.display = on ? 'block' : 'none';
          },
        }, '힌트')
      : null;

    function grade() {
      const v = read();
      if (norm(v) === '') return null;
      const ok = it.check
        ? !!it.check(v)
        : (Array.isArray(it.answer) ? it.answer : [it.answer]).some((a) => norm(a) === norm(v));
      row.classList.toggle('correct', ok);
      row.classList.toggle('wrong', !ok);
      verdict.style.display = 'block';
      verdict.className = 'verdict ' + (ok ? 'ok' : 'no');
      clear(verdict);
      add(verdict, [ok ? '⭕ 정답입니다.' : `❌ 다시 생각해 보세요.${opts.showAnswer === false ? '' : ''}`]);
      if (!ok && opts.revealOnWrong) {
        add(verdict, [' 정답: ', h('b', {}, String(Array.isArray(it.answer) ? it.answer[0] : it.answer))]);
      }
      if (it.explain) explain.style.display = 'block';
      paint(ok);
      return ok;
    }

    const checkBtn = h('button', { type: 'button', class: 'btn small', onclick: grade }, '확인');
    add(field, [checkBtn, hintBtn]);
    add(row, [qLine, field, hintBox, verdict, explain]);
    rows.push({ grade, reset: () => { row.className = 'quiz'; verdict.style.display = 'none'; } });
    wrap.append(row);
  });

  const scoreBox = h('span', { class: 'score' }, `0 / ${items.length}`);
  const bar = h('div', { class: 'row', style: { marginTop: '6px' } },
    h('button', {
      type: 'button', class: 'btn',
      onclick: () => {
        let ok = 0;
        rows.forEach((r) => { if (r.grade() === true) ok++; });
        scoreBox.textContent = `${ok} / ${items.length}`;
      },
    }, '전체 채점'),
    scoreBox,
  );

  return h('div', {}, wrap, bar);
}

/* ─────────────────────────────── 비트 카드 ───────────────────────────── */

/**
 * 눌러서 0↔1 을 바꾸는 비트 카드 줄.
 * n 개의 카드를 만들고, 값이 바뀔 때마다 onChange(비트배열) 를 부른다.
 * showPlace 를 켜면 카드 아래에 자릿값(128·64·32…)을 적어 준다.
 */
export function bitRow(n, { value = 0, showPlace = true, onChange = null, readOnly = false } = {}) {
  const cells = [];
  const box = h('div', { class: 'bits' });

  const read = () => cells.reduce((acc, c, i) => acc + (c.dataset.on === '1' ? 2 ** (n - 1 - i) : 0), 0);

  for (let i = 0; i < n; i++) {
    const place = 2 ** (n - 1 - i);
    const on = (value >> (n - 1 - i)) & 1;
    const cell = h('div', { class: 'bit' + (on ? ' on' : '') + (readOnly ? ' fixed' : ''), 'data-on': String(on) },
      h('div', { class: 'v' }, String(on)),
      showPlace ? h('div', { class: 'p' }, String(place)) : null,
    );
    if (!readOnly) {
      cell.addEventListener('click', () => {
        const next = cell.dataset.on === '1' ? 0 : 1;
        cell.dataset.on = String(next);
        cell.classList.toggle('on', !!next);
        cell.querySelector('.v').textContent = String(next);
        if (onChange) onChange(read(), cells.map((c) => +c.dataset.on));
      });
    }
    cells.push(cell);
    box.append(cell);
  }

  return {
    el: box,
    read,
    set(v) {
      cells.forEach((c, i) => {
        const on = (v >> (n - 1 - i)) & 1;
        c.dataset.on = String(on);
        c.classList.toggle('on', !!on);
        c.querySelector('.v').textContent = String(on);
      });
    },
  };
}

/* ────────────────────────────── 자잘한 도구 ──────────────────────────── */

/** 숫자에 세 자리마다 콤마 */
export const comma = (n) => Number(n).toLocaleString('ko-KR');

/** 0 이상 max 미만의 정수 하나 */
export const randInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

/** 배열에서 하나 고르기 */
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/** 배열 섞기 (원본을 바꾸지 않는다) */
export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 캔버스를 처음 그릴 때 쓴다.
 * 먼저 곧바로 한 번 그리고(배경 탭이라 애니메이션 프레임이 오지 않아도 내용이 보이도록),
 * 화면 크기가 정해진 다음 프레임에 한 번 더 그려 해상도를 맞춘다.
 */
export function drawNow(fn) {
  try { fn(); } catch (e) { console.error(e); }
  requestAnimationFrame(fn);
}

/** 슬라이더 + 현재값 표시를 한 줄로 */
export function slider(label, { min, max, step = 1, value, unit = '', onInput }) {
  const out = h('b', { class: 'big-num', style: { fontSize: '1.15rem' } }, `${value}${unit}`);
  const inp = h('input', {
    type: 'range', min, max, step, value,
    style: { flex: '1', minWidth: '160px' },
    oninput: () => {
      out.textContent = `${inp.value}${unit}`;
      onInput(Number(inp.value));
    },
  });
  return { el: h('div', { class: 'row' }, h('label', { class: 'field' }, label), inp, out), input: inp };
}
