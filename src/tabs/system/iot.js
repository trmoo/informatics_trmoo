/* ============================================================================
 * iot.js — 학습지 ② Ⅰ-2. 사물 인터넷
 *   센서 → 마이크로컨트롤러(규칙) → 액추에이터 로 이어지는 피지컬 컴퓨팅을
 *   학생이 직접 규칙을 써 넣어 만들어 보게 한다.
 *   환경 막대를 밀면 센서값이 바뀌고, 규칙이 판정되어 액추에이터가 실제로 움직인다.
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

import { h, card, sheetHead, note, answer, clear, quizSet } from '../../lib/ui.js';

/* ── 센서 (입력 장치) ─────────────────────────────────────────────────── */
const SENSORS = {
  temp:   { label: '온도 센서',   icon: '🌡️', unit: '℃',  min: -10, max: 40,  init: 22,  step: 1 },
  light:  { label: '조도 센서',   icon: '💡', unit: 'lux', min: 0,  max: 1000, init: 400, step: 10 },
  motion: { label: '인체 감지 센서', icon: '🚶', unit: '',  min: 0, max: 1, init: 0, step: 1, bool: true },
  door:   { label: '문 열림 센서', icon: '🚪', unit: '',   min: 0,  max: 1,   init: 0,   step: 1, bool: true },
  smoke:  { label: '연기 센서',   icon: '💨', unit: 'ppm', min: 0,  max: 500, init: 10,  step: 5 },
  hour:   { label: '시각',        icon: '🕐', unit: '시',  min: 0,  max: 23,  init: 14,  step: 1 },
};

/* ── 액추에이터 (출력 장치) ──────────────────────────────────────────── */
const ACTS = {
  lamp:   { label: '전등',        on: '💡 켜짐', off: '🔌 꺼짐' },
  aircon: { label: '에어컨',      on: '❄️ 가동', off: '⏸️ 정지' },
  heater: { label: '난방기',      on: '🔥 가동', off: '⏸️ 정지' },
  alarm:  { label: '경보음',      on: '🚨 울림', off: '🔇 조용' },
  push:   { label: '스마트폰 알림', on: '📲 보냄', off: '－ 없음' },
  lock:   { label: '자동 잠금',   on: '🔒 잠김', off: '🔓 열림' },
};

const OPS = { '>=': '이상이면', '<=': '이하면', '>': '보다 크면', '<': '보다 작으면', '==': '와(과) 같으면' };

export function render(root) {
  root.append(...sheetHead('학습지 ②', 'Ⅰ-2. 사물 인터넷',
    ['[12정01-02]', '[12정01-03]'],
    ['사물 인터넷의 구성과 동작 원리를 이해하고 설명할 수 있다.',
     '사물 인터넷으로 인한 개인 생활과 사회에 미친 영향력과 가치를 설명할 수 있다.']));

  root.append(conceptCard());
  root.append(lab());
  root.append(quizCard());
}

/* ══════════════════════ ① 개념 정리 ══════════════════════════════════ */

function conceptCard() {
  return card('① 사물 인터넷이란',
    h('p', {}, '생활 속 다양한 물건이 ', answer('인터넷'), '에 연결되어 데이터를 주고받을 수 있는 시스템. ',
      '컴퓨터뿐만 아니라 각종 사물에 ', answer('센서'), '와 ', answer('통신 장치'), '가 있어서 ',
      '사물과 사물 또는 사물과 사람이 인터넷으로 서로 연결된 환경.'),

    h('h4', {}, '피지컬 컴퓨팅 — 컴퓨터와 현실 세계를 연결하는 시스템'),
    h('div', { class: 'grid3' },
      pcPart('🌡️', '센서', '입력 장치', '온도, 밝기 등 주변의 상황을 인식한다'),
      pcPart('🧠', '마이크로컨트롤러', '처리 장치', '센서로 얻은 정보를 처리하고 액추에이터를 제어한다'),
      pcPart('💡', '액추에이터(구동기)', '출력 장치', '마이크로컨트롤러의 제어에 의해 물리적으로 동작한다')),

    h('h4', {}, '사물 인터넷의 구성과 동작'),
    h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', { class: 'left' }, '구성 요소'), h('th', {}, '동작')),
      h('tr', {}, h('td', { class: 'left' }, '① 사물 (= 디바이스)'), h('td', {}, '데이터 수집')),
      h('tr', {}, h('td', { class: 'left' }, '② ', answer('통신'), ' 장치 (≒ 네트워크)'), h('td', {}, '디바이스와 플랫폼 연결')),
      h('tr', {}, h('td', { class: 'left' }, '③ 데이터 ', answer('처리'), ' 및 ', answer('저장'), ' 장치 (≒ 플랫폼)'), h('td', {}, '데이터 분석 및 처리')),
      h('tr', {}, h('td', { class: 'left' }, '①~③ 요소를 제어·활용할 수 있는 소프트웨어'), h('td', {}, '사용자에 서비스 제공')),
    )));
}

function pcPart(icon, name, role, desc) {
  return h('div', { style: { border: '1px solid var(--line)', borderRadius: '10px', padding: '14px', background: '#fbfcfe' } },
    h('div', { style: { fontSize: '2rem', textAlign: 'center' } }, icon),
    h('div', { style: { fontWeight: '800', textAlign: 'center', fontSize: '1.05rem' } }, name),
    h('div', { style: { textAlign: 'center' } }, h('span', { class: 'chip' }, role)),
    h('p', { style: { margin: '9px 0 0', color: 'var(--ink-soft)', fontSize: '0.94rem' } }, desc));
}

/* ══════════════════════ ② IoT 조립기 ═════════════════════════════════ */

function lab() {
  const env = Object.fromEntries(Object.entries(SENSORS).map(([k, s]) => [k, s.init]));
  let rules = [];
  let running = true;

  const sensorBox = h('div', {});
  const ruleBox = h('div', {});
  const actBox = h('div', { class: 'grid3' });
  const flowBox = h('div', { class: 'row', style: { gap: '6px', flexWrap: 'nowrap', overflowX: 'auto', marginBottom: '14px' } });
  const logBox = h('div', { class: 'console', style: { maxHeight: '200px' } });

  const prevOn = {};   // 직전 상태 — 바뀔 때만 기록을 남기려고 보관한다

  /* ── 흐름도 4단계 ── */
  const stages = [
    ['① 사물 (디바이스)', '데이터 수집'],
    ['② 통신 장치', '디바이스와 플랫폼 연결'],
    ['③ 플랫폼', '데이터 분석 및 처리'],
    ['④ 서비스', '사용자에 서비스 제공'],
  ];
  const stageEls = stages.map(([t, d], i) => {
    const box = h('div', {
      style: {
        flex: '1', minWidth: '160px', border: '2px solid var(--line)', borderRadius: '10px',
        padding: '10px 12px', background: '#fff', transition: 'all .2s',
      },
    }, h('div', { style: { fontWeight: '800' } }, t),
       h('div', { style: { color: 'var(--ink-soft)', fontSize: '0.88rem' } }, d));
    return box;
  });
  stageEls.forEach((e, i) => {
    flowBox.append(e);
    if (i < stageEls.length - 1) flowBox.append(h('div', { style: { fontSize: '1.5rem', color: '#9aa5b4' } }, '→'));
  });

  function pulseFlow() {
    stageEls.forEach((e, i) => setTimeout(() => {
      e.style.borderColor = 'var(--accent)';
      e.style.background = '#eef4ff';
      setTimeout(() => { e.style.borderColor = 'var(--line)'; e.style.background = '#fff'; }, 420);
    }, i * 130));
  }

  const log = (m, cls) => { logBox.append(h('div', { class: cls || '' }, m)); logBox.scrollTop = logBox.scrollHeight; };

  /* ── 센서 막대 ── */
  function paintSensors() {
    clear(sensorBox);
    for (const [key, s] of Object.entries(SENSORS)) {
      const out = h('b', { class: 'big-num', style: { fontSize: '1.1rem', minWidth: '86px', textAlign: 'right' } },
        s.bool ? (env[key] ? '감지됨' : '없음') : `${env[key]}${s.unit}`);
      const inp = h('input', {
        type: 'range', min: s.min, max: s.max, step: s.step, value: env[key],
        style: { flex: '1', minWidth: '120px' },
        oninput: () => {
          env[key] = Number(inp.value);
          out.textContent = s.bool ? (env[key] ? '감지됨' : '없음') : `${env[key]}${s.unit}`;
          evaluate();
        },
      });
      sensorBox.append(h('div', { class: 'row', style: { marginBottom: '4px' } },
        h('span', { style: { width: '150px', fontWeight: '700' } }, `${s.icon} ${s.label}`), inp, out));
    }
  }

  /* ── 규칙 편집 ── */
  function paintRules() {
    clear(ruleBox);
    if (!rules.length) {
      ruleBox.append(note('warn', '규칙이 하나도 없습니다. 아래 [＋ 규칙 추가] 를 누르거나 예제를 불러오세요.'));
    }
    rules.forEach((r, i) => {
      const sel = (opts, val, on) => {
        const s = h('select', { onchange: () => { on(s.value); evaluate(); } });
        for (const [v, label] of opts) s.append(h('option', { value: v, selected: v === val }, label));
        return s;
      };
      const sensorSel = sel(Object.entries(SENSORS).map(([k, v]) => [k, `${v.icon} ${v.label}`]), r.sensor,
        (v) => { r.sensor = v; paintRules(); });
      const opSel = sel(Object.entries(OPS), r.op, (v) => { r.op = v; });
      const valInp = h('input', {
        type: 'number', value: r.value, style: { width: '92px' },
        oninput: () => { r.value = Number(valInp.value); evaluate(); },
      });
      const actSel = sel(Object.entries(ACTS).map(([k, v]) => [k, v.label]), r.act, (v) => { r.act = v; });
      const onSel = sel([['1', '켜기 / 작동'], ['0', '끄기 / 정지']], r.on ? '1' : '0', (v) => { r.on = v === '1'; });

      ruleBox.append(h('div', {
        class: 'row tight',
        style: {
          border: '1px solid var(--line)', borderRadius: '9px', padding: '9px 12px',
          marginBottom: '7px', background: r.fired ? '#eefaf4' : '#fbfcfe',
        },
      },
        h('span', { class: 'chip' + (r.fired ? ' on' : '') }, `규칙 ${i + 1}`),
        h('b', {}, '만약'), sensorSel, h('span', {}, '값이'), valInp, opSel,
        h('b', {}, '→'), actSel, h('span', {}, '을(를)'), onSel,
        h('span', { class: 'spacer' }),
        h('button', {
          type: 'button', class: 'btn gray small',
          onclick: () => { rules.splice(i, 1); paintRules(); evaluate(); },
        }, '삭제')));
    });
  }

  /* ── 규칙 판정 → 액추에이터 상태 ── */
  function evaluate() {
    const state = Object.fromEntries(Object.keys(ACTS).map((k) => [k, false]));
    let fired = 0;

    rules.forEach((r) => {
      const v = env[r.sensor];
      const t = r.value;
      const ok = r.op === '>=' ? v >= t : r.op === '<=' ? v <= t
        : r.op === '>' ? v > t : r.op === '<' ? v < t : v === t;
      r.fired = ok;
      if (ok) { state[r.act] = r.on ? true : state[r.act]; if (!r.on) state[r.act] = false; fired++; }
    });

    clear(actBox);
    for (const [k, a] of Object.entries(ACTS)) {
      const on = state[k];
      actBox.append(h('div', {
        style: {
          border: `2px solid ${on ? 'var(--accent)' : 'var(--line)'}`, borderRadius: '10px',
          padding: '12px', textAlign: 'center', background: on ? '#eef4ff' : '#fff', transition: 'all .18s',
        },
      },
        h('div', { style: { fontWeight: '800' } }, a.label),
        h('div', { style: { fontSize: '1.25rem', marginTop: '4px' } }, on ? a.on : a.off)));

      if (running && prevOn[k] !== undefined && prevOn[k] !== on) {
        log(`${on ? '▶' : '■'} ${a.label} → ${on ? a.on : a.off}`, on ? '' : 'muted');
        pulseFlow();
      }
      prevOn[k] = on;
    }
    paintRulesHighlight();
    return fired;
  }

  function paintRulesHighlight() {
    [...ruleBox.children].forEach((el, i) => {
      const r = rules[i];
      if (!r || !el.style) return;
      el.style.background = r.fired ? '#eefaf4' : '#fbfcfe';
      const chip = el.querySelector('.chip');
      if (chip) chip.classList.toggle('on', !!r.fired);
    });
  }

  /* ── 예제 ── */
  const PRESETS = {
    intruder: {
      name: '🚨 스마트홈 침입 탐지',
      env: { motion: 1, hour: 3, door: 1, light: 20 },
      rules: [
        { sensor: 'motion', op: '==', value: 1, act: 'alarm', on: true },
        { sensor: 'motion', op: '==', value: 1, act: 'push', on: true },
        { sensor: 'door', op: '==', value: 1, act: 'lamp', on: true },
      ],
      tip: '집에 아무도 없는 새벽에 사람이 감지되면 경보를 울리고 주인 휴대폰으로 알림을 보냅니다. 「인체 감지 센서」 막대를 0으로 내려 보세요.',
    },
    light: {
      name: '💡 자동 조명',
      env: { light: 90, hour: 19 },
      rules: [{ sensor: 'light', op: '<', value: 200, act: 'lamp', on: true }],
      tip: '어두워지면 전등이 저절로 켜집니다. 「조도 센서」 막대를 좌우로 밀어 보세요.',
    },
    fire: {
      name: '🔥 화재 경보',
      env: { smoke: 220, temp: 38 },
      rules: [
        { sensor: 'smoke', op: '>=', value: 150, act: 'alarm', on: true },
        { sensor: 'smoke', op: '>=', value: 150, act: 'push', on: true },
        { sensor: 'smoke', op: '>=', value: 150, act: 'lock', on: false },
      ],
      tip: '연기가 짙어지면 경보를 울리고 문 잠금을 풉니다. 사람이 나갈 수 있어야 하니까요.',
    },
    farm: {
      name: '🌱 스마트 온실',
      env: { temp: 31, light: 120 },
      rules: [
        { sensor: 'temp', op: '>=', value: 28, act: 'aircon', on: true },
        { sensor: 'temp', op: '<=', value: 15, act: 'heater', on: true },
        { sensor: 'light', op: '<', value: 300, act: 'lamp', on: true },
      ],
      tip: '온도를 15℃ 아래로 내리면 난방기가, 28℃ 위로 올리면 에어컨이 돕니다.',
    },
  };

  function loadPreset(key) {
    const p = PRESETS[key];
    Object.entries(SENSORS).forEach(([k, s]) => { env[k] = s.init; });
    Object.assign(env, p.env);
    rules = p.rules.map((r) => ({ ...r }));
    clear(logBox);
    log(`📦 ${p.name} 을(를) 불러왔습니다.`);
    log(p.tip, 'muted');
    Object.keys(prevOn).forEach((k) => delete prevOn[k]);
    paintSensors(); paintRules(); evaluate();
  }

  paintSensors(); paintRules();
  loadPreset('intruder');

  return card('② 사물 인터넷 조립기 — 규칙을 직접 써서 움직여 보기',
    h('p', { class: 'lead' },
      '왼쪽에서 ', h('b', {}, '센서'), '가 읽는 값을 바꾸면, 가운데 ', h('b', {}, '규칙(마이크로컨트롤러)'),
      '이 판정하고, 오른쪽 ', h('b', {}, '액추에이터'), '가 실제로 움직입니다.'),

    flowBox,

    h('div', { class: 'row tight', style: { marginBottom: '14px' } },
      h('span', { class: 'chip' }, '예제 불러오기'),
      Object.entries(PRESETS).map(([k, p]) =>
        h('button', { type: 'button', class: 'btn ghost small', onclick: () => loadPreset(k) }, p.name))),

    h('div', { class: 'grid2' },
      h('div', {},
        h('h4', {}, '🌡️ 센서 — 주변 환경을 읽는다'),
        sensorBox,
        note('', '막대를 밀면 실제 환경이 바뀐 것처럼 센서값이 바뀝니다.')),
      h('div', {},
        h('h4', {}, '💡 액추에이터 — 실제로 움직이는 장치'),
        actBox)),

    h('h4', {}, '🧠 마이크로컨트롤러 — 내가 만드는 규칙'),
    ruleBox,
    h('div', { class: 'row tight' },
      h('button', {
        type: 'button', class: 'btn',
        onclick: () => {
          rules.push({ sensor: 'temp', op: '>=', value: 28, act: 'aircon', on: true });
          paintRules(); evaluate();
        },
      }, '＋ 규칙 추가'),
      h('button', {
        type: 'button', class: 'btn gray',
        onclick: () => { rules = []; paintRules(); evaluate(); },
      }, '규칙 모두 지우기')),

    h('h4', {}, '📲 서비스 기록'),
    logBox,

    note('warn', h('b', {}, '생각해 보기 '),
      '규칙을 「연기 센서가 150ppm 이상이면 자동 잠금을 끄기」 로 만들었습니다. 왜 잠그지 않고 풀까요? ',
      '사물 인터넷은 편리하지만, 규칙을 잘못 짜면 사람이 위험해질 수도 있습니다.'),
  );
}

/* ══════════════════════ ③ 확인 문제 ══════════════════════════════════ */

function quizCard() {
  return card('③ 확인 문제',
    quizSet([
      {
        q: '피지컬 컴퓨팅에서 온도, 밝기 등 주변의 상황을 인식하는 입력 장치는?',
        type: 'choice', choices: ['센서', '마이크로컨트롤러', '액추에이터', '플랫폼'],
        answer: '센서',
        explain: '센서(입력) → 마이크로컨트롤러(처리) → 액추에이터(출력) 순서입니다.',
      },
      {
        q: '사물 인터넷 구성 요소 중 「데이터 분석 및 처리」를 담당하는 것은?',
        type: 'choice', choices: ['사물(디바이스)', '통신 장치', '데이터 처리·저장 장치(플랫폼)', '서비스 소프트웨어'],
        answer: '데이터 처리·저장 장치(플랫폼)',
        explain: '① 사물=데이터 수집 ② 통신 장치=연결 ③ 플랫폼=분석·처리 ④ 소프트웨어=서비스 제공',
      },
      {
        q: '「어두워지면 전등을 켠다」 는 자동 조명에서 액추에이터에 해당하는 것은?',
        type: 'choice', choices: ['조도 센서', '전등', '와이파이', '스마트폰 앱'],
        answer: '전등',
        hint: '실제로 물리적으로 움직이는(빛을 내는) 쪽이 액추에이터입니다.',
        explain: '조도 센서가 입력, 전등이 출력(액추에이터)입니다.',
      },
      {
        q: '스마트폰이 케이블 없이 공유기에 붙을 수 있게 해 주는 장비는? (학습지 ① 복습)',
        type: 'choice', choices: ['허브', '무선 AP', '라우터', '전자 태그'],
        answer: '무선 AP',
        explain: '무선 AP가 유선 랜과 무선 랜을 이어 줍니다.',
      },
      {
        q: '사물 인터넷이 널리 퍼지면서 생길 수 있는 문제로 보기 어려운 것은?',
        type: 'choice',
        choices: ['해킹으로 집 안 카메라가 노출될 수 있다', '수집된 생활 데이터로 사생활이 드러날 수 있다',
                  '기기가 늘어 IP 주소가 더 모자라진다', '센서가 많아질수록 전기가 필요 없어진다'],
        answer: '센서가 많아질수록 전기가 필요 없어진다',
        explain: '센서와 통신 장치도 모두 전력을 씁니다. 오히려 전력 소비는 늘어납니다.',
      },
    ], { revealOnWrong: true }));
}
