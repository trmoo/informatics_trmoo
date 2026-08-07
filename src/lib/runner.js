/* ============================================================================
 * runner.js — 파이썬 코드를 화면에서 실행해 보는 상자
 *
 *   runner()    : 코드를 고쳐 가며 자유롭게 실행하는 상자.
 *                 「예상 결과를 먼저 적고 → 실행해서 비교」 하는 학습지의 흐름을 그대로 옮겼다.
 *   blankTask() : 빈칸이 뚫린 코드. 빈칸을 채우고 실행하면 답과 출력 두 가지를 함께 채점한다.
 *
 *   해석기는 src/lib/pymini.js (교실 인터넷이 없어도 도는 미니 파이썬).
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

import { runPython } from './pymini.js';
import { h, clear, norm, note } from './ui.js';

/** 코드 안에 input( ) 이 있으면 「미리 넣어 둘 입력값」 칸이 필요하다. */
const needsInput = (code) => /\binput\s*\(/.test(code);

/** 여러 줄 텍스트를 자동으로 늘어나는 textarea 로. */
function codeArea(value, { readOnly = false, minRows = 3 } = {}) {
  const rows = Math.max(minRows, value.split('\n').length);
  const ta = h('textarea', {
    class: 'mono', rows, spellcheck: 'false',
    style: {
      width: '100%', background: '#1c2230', color: '#e6ebf3', border: '2px solid #2c3547',
      borderRadius: '10px', padding: '12px 14px', lineHeight: '1.55', fontSize: '0.98rem',
      resize: 'vertical', tabSize: '4',
    },
  });
  ta.value = value;
  if (readOnly) ta.readOnly = true;
  // Tab 키로 들여쓰기 (파이썬은 들여쓰기가 문법이므로 꼭 필요하다)
  ta.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const s = ta.selectionStart, en = ta.selectionEnd;
    ta.value = ta.value.slice(0, s) + '    ' + ta.value.slice(en);
    ta.selectionStart = ta.selectionEnd = s + 4;
  });
  return ta;
}

/** 실행 결과를 콘솔 상자에 그린다. */
function showResult(box, res) {
  clear(box);
  if (res.output) box.append(h('div', {}, res.output));
  if (!res.ok) {
    box.append(h('div', { class: 'err' }, res.error));
  } else if (!res.output) {
    box.append(h('div', { class: 'muted' }, '(출력이 없습니다)'));
  }
}

/* ══════════════════════════ 자유 실습 상자 ═══════════════════════════ */

/**
 * @param code    처음 들어 있을 코드
 * @param inputs  input( ) 이 읽어 갈 값들 (줄바꿈으로 구분한 문자열)
 * @param predict true 면 「예상 결과」 칸을 만든다
 * @param label   상자 위에 붙일 이름 (예: 'party.py')
 * @param tip     아래에 붙일 설명
 */
export function runner({ code = '', inputs = '', predict = false, label = '', tip = null, minRows = 3 } = {}) {
  const original = code;
  const ta = codeArea(code, { minRows });
  const out = h('div', { class: 'console' }, h('div', { class: 'muted' }, '[실행] 을 누르면 결과가 여기에 나옵니다.'));

  const inpArea = h('textarea', {
    class: 'mono', rows: 2, placeholder: '한 줄에 하나씩',
    style: { width: '100%', padding: '8px 11px' },
  });
  inpArea.value = inputs;
  const inpWrap = h('div', { style: { display: needsInput(code) ? 'block' : 'none', marginTop: '10px' } },
    h('label', { class: 'field' }, '⌨️ 미리 넣어 둘 입력값'),
    h('div', { style: { color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '4px' } },
      'input( ) 이 위에서부터 한 줄씩 읽어 갑니다.'),
    inpArea);

  ta.addEventListener('input', () => {
    inpWrap.style.display = needsInput(ta.value) ? 'block' : 'none';
  });

  const predictArea = predict
    ? h('textarea', { class: 'mono', rows: 3, placeholder: '실행하기 전에 결과를 먼저 적어 보세요', style: { width: '100%', padding: '8px 11px' } })
    : null;

  const verdict = h('div', { style: { minHeight: '26px', fontWeight: '700', marginTop: '8px' } });

  function run() {
    const src = ta.value;
    const lines = inpArea.value.split('\n').filter((s, i, a) => !(i === a.length - 1 && s === ''));
    const res = runPython(src, { inputs: lines });
    showResult(out, res);

    if (predictArea) {
      const mine = predictArea.value.trim();
      if (!mine) {
        verdict.textContent = '';
      } else {
        const same = norm(mine) === norm(res.output || '');
        verdict.textContent = same ? '⭕ 예상과 실행 결과가 같습니다!' : '❌ 예상과 다릅니다. 왜 그런지 코드를 다시 읽어 보세요.';
        verdict.style.color = same ? 'var(--ok)' : 'var(--bad)';
      }
    }
  }

  return h('div', { style: { marginBottom: '18px' } },
    label ? h('div', { class: 'row', style: { marginBottom: '6px' } },
      h('span', { class: 'chip on', style: { fontFamily: 'var(--mono)' } }, label)) : null,
    ta,
    inpWrap,
    predictArea
      ? h('div', { style: { marginTop: '10px' } },
          h('label', { class: 'field' }, '✍️ 실행 결과를 예상해 봅시다'), predictArea)
      : null,
    h('div', { class: 'row', style: { margin: '10px 0' } },
      h('button', { type: 'button', class: 'btn', onclick: run }, '▶ 실행'),
      h('button', {
        type: 'button', class: 'btn gray small',
        onclick: () => { ta.value = original; clear(out); out.append(h('div', { class: 'muted' }, '코드를 처음 상태로 되돌렸습니다.')); verdict.textContent = ''; },
      }, '↺ 처음 코드로'),
      h('span', { class: 'spacer' }),
      h('span', { style: { color: 'var(--ink-soft)', fontSize: '0.9rem' } }, '코드를 직접 고쳐서 다시 실행해도 됩니다')),
    out,
    verdict,
    tip ? note('', tip) : null);
}

/* ══════════════════════════ 빈칸 채우기 상자 ═════════════════════════ */

/**
 * 빈칸이 뚫린 코드를 채우고 실행해서 채점한다.
 *
 * @param template 코드. 빈칸 자리에 {{0}}, {{1}} … 을 적는다
 * @param blanks   [{ answer: '문자열' 또는 [여러 정답], width, hint }]
 * @param inputs   input( ) 용 입력값
 * @param expected 이 코드가 올바르면 나와야 하는 출력 (여러 줄 문자열)
 * @param explain  해설
 */
export function blankTask({ label = '', template, blanks, inputs = '', expected = null, explain = null, tip = null } = {}) {
  // 같은 번호의 빈칸이 코드에 여러 번 나올 수 있다 (예: {{0}} 를 두 곳에서 씀).
  // 그럴 때는 입력칸도 여러 개 생기므로, 한 곳에 치면 나머지도 함께 채워지게 묶어 둔다.
  const groups = [];                       // groups[번호] = [입력칸, 입력칸, …]
  const pre = h('pre', { class: 'code', style: { lineHeight: '2.0' } });

  // {{n}} 을 기준으로 잘라서 사이사이에 입력칸을 끼운다
  const parts = template.split(/\{\{(\d+)\}\}/);
  parts.forEach((p, i) => {
    if (i % 2 === 0) { if (p) pre.append(document.createTextNode(p)); return; }
    const bi = Number(p);
    const b = blanks[bi] || {};
    const inp = h('input', {
      type: 'text', class: 'mono blank', spellcheck: 'false',
      style: { width: (b.width || 90) + 'px' },
      placeholder: '?',
    });
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') grade(); });
    inp.addEventListener('input', () => {
      groups[bi].forEach((o) => { if (o !== inp) o.value = inp.value; });
    });
    (groups[bi] = groups[bi] || []).push(inp);
    pre.append(inp);
  });

  /** 번호별 대표 입력칸 (같은 번호는 값이 늘 같으므로 첫 번째만 보면 된다) */
  const fields = blanks.map((_, i) => (groups[i] && groups[i][0]) || null);
  const setValue = (i, v) => (groups[i] || []).forEach((o) => { o.value = v; });
  const paintBorder = (i, color) => (groups[i] || []).forEach((o) => { o.style.borderColor = color; });

  const out = h('div', { class: 'console' }, h('div', { class: 'muted' }, '빈칸을 채우고 [실행하고 채점] 을 눌러 보세요.'));
  const verdict = h('div', { style: { minHeight: '28px', fontWeight: '700', marginTop: '8px' } });
  const explainBox = h('div', { class: 'explain', style: { display: 'none' } }, explain ? [h('b', {}, '해설 '), explain] : null);

  const hintBox = h('div', { class: 'hintbox', style: { display: 'none' } },
    h('b', {}, '힌트 '),
    h('ul', { style: { margin: '4px 0 0', paddingLeft: '20px' } },
      blanks.map((b, i) => (b.hint ? h('li', {}, `${i + 1}번째 빈칸 — ${b.hint}`) : null))));

  function assemble() {
    let code = template;
    // 같은 번호가 여러 번 나올 수 있으므로 split/join 으로 전부 바꾼다
    fields.forEach((f, i) => { code = code.split(`{{${i}}}`).join(f ? (f.value || ' ') : ' '); });
    return code;
  }

  function grade() {
    const code = assemble();
    const lines = inputs.split('\n').filter((s, i, a) => !(i === a.length - 1 && s === ''));
    const res = runPython(code, { inputs: lines });
    showResult(out, res);

    // ① 빈칸이 정답과 같은지
    let blankOk = true;
    fields.forEach((f, i) => {
      if (!f) return;
      const acc = blanks[i].answer;
      const ok = (Array.isArray(acc) ? acc : [acc]).some((a) => norm(a) === norm(f.value));
      blankOk = blankOk && ok;
      paintBorder(i, f.value === '' ? '#8b96a8' : ok ? '#5ee0a8' : '#ff9a9a');
    });

    // ② 실행 결과가 기대한 출력과 같은지
    const outOk = expected === null ? res.ok : (res.ok && norm(res.output) === norm(expected));

    clear(verdict);
    if (blankOk && outOk) {
      verdict.style.color = 'var(--ok)';
      verdict.textContent = '⭕ 정답입니다! 실행 결과도 맞습니다.';
      if (explain) explainBox.style.display = 'block';
    } else if (outOk && !blankOk) {
      verdict.style.color = 'var(--warn)';
      verdict.textContent = '🔶 실행 결과는 맞지만, 모범 답안과 다르게 쓴 칸이 있습니다. (다른 방법도 정답일 수 있습니다)';
      if (explain) explainBox.style.display = 'block';
    } else {
      verdict.style.color = 'var(--bad)';
      verdict.textContent = res.ok
        ? '❌ 실행은 되었지만 결과가 다릅니다. 빨간 테두리 칸을 다시 살펴보세요.'
        : '❌ 오류가 났습니다. 위 빨간 글씨를 읽어 보세요.';
    }
  }

  return h('div', { class: 'quiz', style: { padding: '16px 18px', marginBottom: '18px' } },
    label ? h('div', { class: 'row', style: { marginBottom: '8px' } },
      h('span', { class: 'chip on', style: { fontFamily: 'var(--mono)' } }, label)) : null,
    pre,
    expected !== null
      ? h('div', { style: { marginTop: '10px' } },
          h('span', { class: 'chip' }, '이렇게 나와야 합니다'),
          h('pre', { class: 'code', style: { marginTop: '6px', background: '#eef7f1', color: '#12674a', border: '1px solid #c3e8d7' } }, expected))
      : null,
    h('div', { class: 'row', style: { marginTop: '12px' } },
      h('button', { type: 'button', class: 'btn', onclick: grade }, '▶ 실행하고 채점'),
      blanks.some((b) => b.hint)
        ? h('button', {
            type: 'button', class: 'btn gray small',
            onclick: () => { hintBox.style.display = hintBox.style.display === 'none' ? 'block' : 'none'; },
          }, '힌트')
        : null,
      h('button', {
        type: 'button', class: 'btn gray small',
        onclick: () => {
          blanks.forEach((b, i) => {
            setValue(i, Array.isArray(b.answer) ? b.answer[0] : b.answer);
            paintBorder(i, '#5ee0a8');
          });
        },
      }, '정답 채우기')),
    hintBox,
    out,
    verdict,
    explainBox,
    tip ? note('', tip) : null);
}
