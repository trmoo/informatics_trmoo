/* ============================================================================
 * main.js — 정보 노트 실습실
 *   고등학교 1학년 「정보」 학습지 ①~㉒ 를 브라우저에서 직접 해 보는 앱.
 *
 *   화면 구성
 *     위쪽 큰 탭  = 대단원 (Ⅰ 컴퓨팅 시스템 / Ⅱ 데이터 / Ⅲ 알고리즘 / Ⅳ 파이썬)
 *     그 아래 알약 단추 = 학습지 번호
 *   주소창의 #대단원/학습지 로 위치가 남으므로 새로고침해도 보던 곳이 그대로 열린다.
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

import './style.css';
import { h, clear, toggleAllAnswers } from './lib/ui.js';

/* 학습지 모듈들 */
import * as network from './tabs/system/network.js';
import * as iot from './tabs/system/iot.js';
import * as ip from './tabs/system/ip.js';

import * as unit from './tabs/data/unit.js';
import * as radix from './tabs/data/radix.js';
import * as encoding from './tabs/data/encoding.js';
import * as compress from './tabs/data/compress.js';
import * as crypto from './tabs/data/crypto.js';
import * as bigdata from './tabs/data/bigdata.js';

import * as structure from './tabs/algo/structure.js';
import * as sort from './tabs/algo/sort.js';
import * as search from './tabs/algo/search.js';

import * as pybasics from './tabs/python/basics.js';
import * as pyoperator from './tabs/python/operator.js';
import * as pycontrol from './tabs/python/control.js';
import * as pylab from './tabs/python/lab.js';

/* ────────────────────────────── 화면 목록 ─────────────────────────── */

const TABS = [
  {
    id: 'system', title: 'Ⅰ. 컴퓨팅 시스템', color: 'var(--c-sys)',
    sheets: [
      { id: 'network', label: '① 네트워크의 구성', mod: network },
      { id: 'iot', label: '② 사물 인터넷', mod: iot },
      { id: 'ip', label: '⑧ 네트워크 환경 구성 (IP)', mod: ip },
    ],
  },
  {
    id: 'data', title: 'Ⅱ. 데이터', color: 'var(--c-data)',
    sheets: [
      { id: 'unit', label: '⑥ 자료 표현 원리', mod: unit },
      { id: 'radix', label: '⑦ 진수 변환', mod: radix },
      { id: 'encoding', label: '⑨ 부호화', mod: encoding },
      { id: 'compress', label: '⑩ 데이터 압축', mod: compress },
      { id: 'crypto', label: '⑪ 데이터 암호화', mod: crypto },
      { id: 'bigdata', label: '⑫ 빅데이터', mod: bigdata },
    ],
  },
  {
    id: 'algo', title: 'Ⅲ. 알고리즘', color: 'var(--c-algo)',
    sheets: [
      { id: 'structure', label: '⑬ 문제 분해와 모델링', mod: structure },
      { id: 'sort', label: '⑭ 정렬 알고리즘', mod: sort },
      { id: 'search', label: '⑮ 탐색 알고리즘', mod: search },
    ],
  },
  {
    id: 'python', title: 'Ⅳ. 파이썬', color: 'var(--c-py)',
    sheets: [
      { id: 'basics', label: '⑯⑰ 자료형과 입출력', mod: pybasics },
      { id: 'operator', label: '⑱⑲ 연산자', mod: pyoperator },
      { id: 'control', label: '⑳㉑㉒ 제어 구조', mod: pycontrol },
      { id: 'lab', label: '🧪 자유 실습실', mod: pylab },
    ],
  },
];

/* ────────────────────────────── 앱 그리기 ─────────────────────────── */

const app = document.getElementById('app');
let tabId = TABS[0].id;
let sheetId = TABS[0].sheets[0].id;
let answersOpen = false;

const tabBar = h('div', { class: 'tabs' });
const subNav = h('nav', { class: 'subnav' });
const main = h('main', {});

const answerBtn = h('button', {
  type: 'button', class: 'btn ghost small',
  onclick: () => {
    answersOpen = !answersOpen;
    toggleAllAnswers(main, answersOpen);
    answerBtn.textContent = answersOpen ? '🙈 정답 모두 숨기기' : '👁️ 정답 모두 보기';
  },
}, '👁️ 정답 모두 보기');

/* 교사용 안내 페이지는 public/설치안내.html 에 있고 빌드하면 dist/ 로 함께 복사된다.
   개발 서버에서도 dist 에서도 같은 상대 주소로 열린다. */
const guideBtn = h('a', {
  class: 'btn ghost small',
  href: './설치안내.html',
  target: '_blank',
  rel: 'noopener',
  style: { textDecoration: 'none' },
}, '📖 교사용 안내');

const topbar = h('header', { class: 'topbar' },
  h('div', { class: 'topbar-inner' },
    h('div', { class: 'brand' },
      h('h1', {}, '정보 노트 실습실'),
      h('span', { class: 'sub' }, '고등학교 1학년 「정보」 · 학습지 ①~㉒ 를 직접 해 보는 곳'),
      h('span', { class: 'spacer' }),
      guideBtn,
      answerBtn),
    tabBar));

function paintTabs() {
  clear(tabBar);
  TABS.forEach((t) => {
    tabBar.append(h('button', {
      type: 'button', role: 'tab', 'aria-selected': String(t.id === tabId),
      onclick: () => go(t.id, t.sheets[0].id),
    }, t.title));
  });
}

function paintSubNav() {
  clear(subNav);
  const tab = TABS.find((t) => t.id === tabId);
  tab.sheets.forEach((s) => {
    subNav.append(h('button', {
      type: 'button', 'aria-current': String(s.id === sheetId),
      onclick: () => go(tabId, s.id),
    }, s.label));
  });
}

function paintMain() {
  const tab = TABS.find((t) => t.id === tabId);
  const sheet = tab.sheets.find((s) => s.id === sheetId) || tab.sheets[0];
  document.documentElement.style.setProperty('--accent', tab.color);
  clear(main);
  try {
    sheet.mod.render(main);
  } catch (e) {
    main.append(h('div', { class: 'note bad' },
      h('b', {}, '이 화면을 그리는 중 문제가 생겼습니다. '), String(e && e.message)));
    console.error(e);
  }
  // 이전 화면에서 「정답 모두 보기」 를 켜 두었다면 새 화면에도 이어서 적용한다
  if (answersOpen) toggleAllAnswers(main, true);
  window.scrollTo({ top: 0 });
}

function go(t, s, fromHash) {
  tabId = t; sheetId = s;
  if (!fromHash) location.hash = `${t}/${s}`;
  paintTabs(); paintSubNav(); paintMain();
}

function readHash() {
  const [t, s] = location.hash.replace(/^#/, '').split('/');
  const tab = TABS.find((x) => x.id === t);
  if (!tab) return false;
  const sheet = tab.sheets.find((x) => x.id === s) || tab.sheets[0];
  go(tab.id, sheet.id, true);
  return true;
}

window.addEventListener('hashchange', () => readHash());

app.append(topbar, subNav, main,
  h('div', { class: 'footer' },
    h('div', {}, '정보 노트 실습실 · 2022 개정 교육과정 고등학교 「정보」 · 학생 개인정보를 저장하지 않습니다.'),
    h('div', { style: { marginTop: '6px' } },
      'Copyright 2026 trmoo · ',
      h('a', {
        href: 'http://www.apache.org/licenses/LICENSE-2.0',
        target: '_blank', rel: 'noopener',
        style: { color: 'inherit' },
      }, 'Apache License 2.0'),
      ' 에 따라 누구나 자유롭게 쓰고 고치고 나눌 수 있습니다.'),
    h('div', { style: { marginTop: '4px' } },
      '설치·수업 활용 안내는 함께 들어 있는 ',
      h('a', { href: './설치안내.html', target: '_blank', rel: 'noopener', style: { color: 'inherit' } }, '설치안내.html'),
      ' 을 보세요.')));

if (!readHash()) go(tabId, sheetId);
