/* ============================================================================
 * ip.js — 학습지 ⑧ Ⅰ-1.(2) 네트워크 환경 구성
 *   IP 주소를 넣고 CIDR 접두사 길이를 밀면 32개 비트가 네트워크(파랑)와
 *   호스트(주황)로 나뉘는 것을 눈으로 보게 한다.
 *   클래스·서브넷 마스크·네트워크 주소·브로드캐스트 주소·사용 가능 개수를
 *   모두 그 자리에서 다시 계산한다.
 *
 * © 2026 티쳐무 · 모든 권리 보유
 *
 * 무단 배포 및 상업적 이용을 금합니다. 학교 수업 목적으로만 이용해 주세요.
 * 그 밖의 이용(재배포·2차 저작물·수업 외 목적)은 먼저 문의해 주세요.
 * 오픈소스 라이선스를 붙이지 않았습니다 — 자세한 내용은 LICENSE 파일을 보세요.
 * ========================================================================== */

import { h, card, sheetHead, note, answer, quizSet, clear, comma, randInt } from '../../lib/ui.js';

/* ── IP 계산 (모두 부호 없는 32비트로 다룬다) ────────────────────────── */

const toInt = (o) => ((o[0] << 24) >>> 0) + (o[1] << 16) + (o[2] << 8) + o[3];
const toOct = (n) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];
const dotted = (n) => toOct(n).join('.');
const bin8 = (v) => v.toString(2).padStart(8, '0');

/** '192.168.0.1' 을 옥텟 4개로. 형식이 틀리면 null. */
function parseIp(s) {
  const m = String(s).trim().split('.');
  if (m.length !== 4) return null;
  const o = m.map((x) => (/^\d{1,3}$/.test(x) ? Number(x) : -1));
  return o.every((v) => v >= 0 && v <= 255) ? o : null;
}

/** 첫 옥텟의 상위 비트로 클래스를 가린다. (학습지 ⑧ 2.2 표) */
function classOf(first) {
  if (first < 128) return { name: 'A', bits: '0', mask: 8, range: '0 ~ 127' };
  if (first < 192) return { name: 'B', bits: '10', mask: 16, range: '128 ~ 191' };
  if (first < 224) return { name: 'C', bits: '110', mask: 24, range: '192 ~ 223' };
  if (first < 240) return { name: 'D', bits: '1110', mask: null, range: '224 ~ 239 (멀티캐스트)' };
  return { name: 'E', bits: '1111', mask: null, range: '240 ~ 255 (연구용)' };
}

/** 사설 IP 인지 (RFC1918). 학습지 ⑧ 3.1 ② */
function isPrivate(o) {
  if (o[0] === 10) return '10.0.0.0 ~ 10.255.255.255';
  if (o[0] === 172 && o[1] >= 16 && o[1] <= 31) return '172.16.0.0 ~ 172.31.255.255';
  if (o[0] === 192 && o[1] === 168) return '192.168.0.0 ~ 192.168.255.255';
  return null;
}

export function render(root) {
  root.append(...sheetHead('학습지 ⑧', 'Ⅰ-1. 네트워크의 구성 (2) 네트워크 환경 구성',
    ['[12정01-01]'],
    ['IP 주소의 개념과 종류를 구분하여 설명할 수 있다.',
     '서브넷 및 CIDR을 활용하여 네트워크 구조를 해석할 수 있다.',
     'IPv4의 한계와 해결 방안을 설명할 수 있다.']));

  root.append(lab());
  root.append(classTable());
  root.append(shortageCard());
  root.append(practice());
}

/* ══════════════════════════ ① IP 주소 실험실 ══════════════════════════ */

function lab() {
  const state = { oct: [192, 168, 1, 39], prefix: 24 };

  const ipInput = h('input', {
    type: 'text', class: 'mono', value: '192.168.1.39',
    style: { width: '190px', fontSize: '1.15rem', fontWeight: '800' },
  });

  const prefixInput = h('input', { type: 'range', min: 1, max: 32, value: 24, style: { flex: '1', minWidth: '220px' } });
  const prefixOut = h('b', { class: 'big-num' }, '/24');

  const bitsBox = h('div', {});
  const out = h('div', {});

  function redraw() {
    const p = parseIp(ipInput.value);
    if (p) state.oct = p;
    ipInput.style.borderColor = p ? 'var(--line)' : 'var(--bad)';
    state.prefix = Number(prefixInput.value);
    prefixOut.textContent = '/' + state.prefix;
    drawBits(bitsBox, state);
    drawResult(out, state);
  }

  ipInput.addEventListener('input', redraw);
  prefixInput.addEventListener('input', redraw);

  const presets = [
    ['192.168.1.39', 24, '학습지 예제 — C클래스 사설'],
    ['220.16.0.0', 28, '학습지 ▣ 220.16.0.0/28'],
    ['10.0.0.0', 26, '학습지 ▣ 중소기업 10.0.0.0/26'],
    ['20.168.1.30', 8, '학습지 ★★★ A클래스'],
    ['172.20.5.7', 16, 'B클래스 사설'],
  ];

  return card('① IP 주소 실험실 — 비트가 어디서 갈라지는지 보기',
    h('p', { class: 'lead' },
      'IP 주소를 고치거나 아래 막대를 밀어 보세요. 32개의 비트가 ',
      h('b', { style: { color: '#1e6fd9' } }, '네트워크 영역'), '과 ',
      h('b', { style: { color: '#d9781e' } }, '호스트 영역'), '으로 갈라지는 자리가 바로 움직입니다.'),

    h('div', { class: 'row', style: { marginBottom: '10px' } },
      h('label', { class: 'field' }, 'IP 주소'), ipInput,
      h('span', { class: 'spacer' }),
      h('label', { class: 'field' }, '서브넷 접두사 길이'), prefixInput, prefixOut),

    h('div', { class: 'row tight', style: { marginBottom: '14px' } },
      h('span', { class: 'chip' }, '바로 넣어 보기'),
      presets.map(([ip, pf, why]) => h('button', {
        type: 'button', class: 'btn ghost small', title: why,
        onclick: () => { ipInput.value = ip; prefixInput.value = pf; redraw(); },
      }, `${ip}/${pf}`))),

    bitsBox,
    out,
    (redraw(), null),
  );
}

/** 32비트를 옥텟 4묶음으로 그린다. 네트워크 비트는 파랑, 호스트 비트는 주황. */
function drawBits(box, st) {
  clear(box);
  const wrap = h('div', { class: 'row', style: { gap: '18px', marginBottom: '12px', alignItems: 'flex-start' } });

  st.oct.forEach((v, oi) => {
    const cells = h('div', { class: 'bits', style: { gap: '3px' } });
    for (let b = 0; b < 8; b++) {
      const idx = oi * 8 + b;                       // 0..31, 왼쪽부터 센 비트 자리
      const isNet = idx < st.prefix;
      cells.append(h('div', {
        class: 'bit ' + (isNet ? 'net' : 'host') + ' fixed',
        style: { width: '30px' },
      }, h('div', { class: 'v', style: { fontSize: '1rem' } }, bin8(v)[b])));
    }
    wrap.append(h('div', {},
      h('div', { style: { textAlign: 'center', fontWeight: '800', fontSize: '1.2rem', marginBottom: '4px' } }, String(v)),
      cells));
  });

  box.append(wrap);
  box.append(h('div', { class: 'legend' },
    h('span', {}, h('i', { style: { background: '#dcebff', border: '2px solid #1e6fd9' } }), `네트워크 ${st.prefix}비트`),
    h('span', {}, h('i', { style: { background: '#ffeedb', border: '2px solid #d9781e' } }), `호스트 ${32 - st.prefix}비트`),
  ));
}

/** 계산 결과 표 */
function drawResult(box, st) {
  clear(box);
  const ip = toInt(st.oct);
  const maskInt = st.prefix === 0 ? 0 : (0xffffffff << (32 - st.prefix)) >>> 0;
  const netInt = (ip & maskInt) >>> 0;
  const bcInt = (netInt | (~maskInt >>> 0)) >>> 0;
  const hostBits = 32 - st.prefix;
  const total = 2 ** hostBits;
  const usable = Math.max(0, total - 2);
  const cls = classOf(st.oct[0]);
  const priv = isPrivate(st.oct);

  const row = (k, v, tip) => h('tr', {},
    h('th', { class: 'left', style: { width: '210px' } }, k),
    h('td', { class: 'left mono' }, v),
    h('td', { class: 'left', style: { color: 'var(--ink-soft)', fontSize: '0.9rem' } }, tip || ''));

  box.append(h('div', { class: 'scroll-x', style: { marginTop: '14px' } },
    h('table', { class: 'tbl' },
      row('클래스', `${cls.name} 클래스`,
        `첫 옥텟 ${st.oct[0]} → 2진수 ${bin8(st.oct[0])} → 상위 비트가 ${cls.bits} (${cls.range})`),
      row('공인 / 사설', priv ? '사설 IP' : '공인 IP',
        priv ? `사설 대역 ${priv} 안에 있음 — 인터넷에서 직접 못 씀` : '인터넷에서 유일하게 식별되는 주소'),
      row('서브넷 마스크 (10진수)', dotted(maskInt), ''),
      row('서브넷 마스크 (2진수)', toOct(maskInt).map(bin8).join('.'), `앞에서부터 1이 ${st.prefix}개`),
      row('CIDR 표기', `${dotted(ip)}/${st.prefix}`, ''),
      row('네트워크 주소', dotted(netInt), '호스트 비트가 모두 0'),
      row('브로드캐스트 주소', dotted(bcInt), '호스트 비트가 모두 1'),
      row('전체 IP 주소 개수', `2^${hostBits} = ${comma(total)}개`, '네트워크 주소·브로드캐스트 주소 포함'),
      row('기기에 줄 수 있는 개수', `${comma(usable)}개`, '전체에서 네트워크 주소와 브로드캐스트 주소를 뺀 수'),
      row('호스트 주소 범위', total > 2 ? `${dotted(netInt + 1)} ~ ${dotted(bcInt - 1)}` : '없음', ''),
    )));

  // 호스트 비트가 적을 때는 주소를 전부 늘어놓아 준다 (학습지 220.16.0.0/28 표와 같은 모양)
  if (hostBits <= 5) {
    const list = h('div', { class: 'row tight', style: { marginTop: '12px' } });
    for (let i = 0; i < total; i++) {
      const cur = (netInt + i) >>> 0;
      const kind = i === 0 ? '네트워크' : i === total - 1 ? '브로드캐스트' : '호스트';
      list.append(h('span', {
        class: 'chip',
        style: {
          fontFamily: 'var(--mono)',
          background: i === 0 ? '#dcebff' : i === total - 1 ? '#ffe0e0' : '#eef7f1',
          color: i === 0 ? '#1e4f96' : i === total - 1 ? '#8f2626' : '#12674a',
        },
        title: kind + ' 주소',
      }, `${dotted(cur)} (${bin8(cur & 255).slice(0, 8 - hostBits)} ${bin8(cur & 255).slice(8 - hostBits)})`));
    }
    box.append(h('h4', {}, `이 네트워크가 가진 주소 ${total}개 전부`), list,
      h('div', { class: 'legend', style: { marginTop: '8px' } },
        h('span', {}, h('i', { style: { background: '#dcebff' } }), '네트워크 주소'),
        h('span', {}, h('i', { style: { background: '#eef7f1' } }), '기기에 줄 수 있는 호스트 주소'),
        h('span', {}, h('i', { style: { background: '#ffe0e0' } }), '브로드캐스트 주소')));
  }
}

/* ══════════════════════════ ② 클래스 체계 표 ══════════════════════════ */

function classTable() {
  const r = (c, split, mask, bits, from, to, cnt) => h('tr', {},
    h('th', {}, c),
    h('td', { class: 'mono', style: { fontSize: '0.85rem' } }, split),
    h('td', { class: 'mono' }, mask),
    h('td', { class: 'mono' }, bits),
    h('td', { class: 'mono' }, from, ' ~ ', to),
    h('td', {}, cnt));

  return card('② IPv4의 클래스 체계 — 학습지 표 채우기',
    h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', {}, '클래스'), h('th', {}, '네트워크 + 호스트'), h('th', {}, '서브넷 마스크'),
        h('th', {}, '식별용 상위비트'), h('th', {}, '네트워크 주소'), h('th', {}, '네트워크별 사용 가능 IP 개수')),
      r('A', '네트워크 8비트 / 호스트 24비트', '255.0.0.0', '0', '0.0.0.0', '127.0.0.0', '2²⁴ = 16,777,216개'),
      r('B', '네트워크 16비트 / 호스트 16비트', '255.255.0.0', '10', '128.0.0.0', '191.0.0.0', '2¹⁶ = 65,536개'),
      r('C', '네트워크 24비트 / 호스트 8비트', '255.255.255.0', '110', '192.0.0.0', '223.255.255.255', '2⁸ = 256개'),
    )),
    h('div', { style: { marginTop: '14px' } },
      h('p', {}, '※ IP 주소의 클래스는 A, B, C로 갈수록 네트워크의 규모가 ', answer('작아진다'), '.'),
      h('p', {}, '※ 호스트 영역이 모두 0인 경우: ', answer('네트워크'), ' 주소 / 모두 1인 경우: ', answer('브로드캐스트'), ' 주소'),
      h('p', {}, '※ [참고] 0.0.0.0 : 현재 네트워크 전체, 127.0.0.0 : 자기 자신(localhost)')),
    note('', h('b', {}, '왜 A가 가장 클까? '),
      '네트워크 영역이 8비트로 짧다는 뜻은 나머지 24비트가 전부 호스트라는 뜻입니다. ',
      '한 네트워크 안에 들어갈 수 있는 기기가 많아지므로 네트워크 하나의 규모가 커집니다. ',
      '위 ① 실험실에서 접두사 길이를 /8 → /16 → /24 로 밀어 보면 호스트 칸이 줄어드는 것이 보입니다.'),
  );
}

/* ══════════════════ ③ IPv4 주소 부족과 해결책 ═════════════════════════ */

function shortageCard() {
  return card('③ IPv4는 왜 모자랄까 — 그리고 어떻게 버티고 있나',
    h('div', { class: 'grid2' },
      h('div', {},
        h('h4', {}, '모자란 이유'),
        h('ul', {},
          h('li', {}, '기기 수의 폭발적 증가 — 스마트폰·태블릿·IoT 기기'),
          h('li', {}, 'IPv4 주소는 2³² = 약 ', h('b', {}, '43억 개'), '뿐'),
          h('li', {}, '클래스 기반 할당은 안 쓰는 주소를 많이 남겨 고갈을 앞당김')),
        note('warn', '지구 인구가 약 80억 명입니다. 한 사람이 한 개씩만 가져도 이미 모자랍니다.')),
      h('div', {},
        h('h4', {}, '해결 방법 4가지'),
        h('ol', {},
          h('li', {}, h('b', {}, '유동 IP'), ' — 접속할 때만 빌려주고 끊으면 회수'),
          h('li', {}, h('b', {}, '사설 IP'), ' — 집·학교 안에서는 자유롭게 쓰고, 밖으로 나갈 때만 공유기의 공인 IP 하나를 나눠 씀'),
          h('li', {}, h('b', {}, 'CIDR'), ' — 클래스를 벗어나(classless) 필요한 크기만큼만 쪼개서 씀'),
          h('li', {}, h('b', {}, 'IPv6'), ' — 주소 길이를 128비트로 늘림')))),

    h('h4', {}, 'IPv4와 IPv6'),
    h('div', { class: 'scroll-x' }, h('table', { class: 'tbl' },
      h('tr', {}, h('th', {}, ''), h('th', {}, 'IPv4'), h('th', {}, 'IPv6')),
      h('tr', {}, h('th', {}, '주소 길이'), h('td', {}, answer('32'), '비트'), h('td', {}, answer('128'), '비트')),
      h('tr', {}, h('th', {}, '주소 개수'), h('td', {}, '2³² (약 43억 개)'), h('td', {}, '2¹²⁸ (사실상 무한에 가까움)')),
      h('tr', {}, h('th', {}, '표현 방식'), h('td', {}, '10진수, 점(.)으로 구분된 4개 옥텟'), h('td', {}, '16진수, 콜론(:)으로 구분된 8개 블록')),
      h('tr', {}, h('th', {}, '예시'), h('td', { class: 'mono' }, '192.168.0.1'),
        h('td', { class: 'mono', style: { fontSize: '0.85rem' } }, '2001:0db8:85a3:0000:0000:8a2e:0370:7334')),
    )),

    note('ok', h('b', {}, 'CIDR 이 왜 아끼는 방법일까? '),
      '기기 50대만 필요한 회사에 C클래스(256개)를 통째로 주면 200개가 놀게 됩니다. ',
      '/26 으로 주면 64개만 떼어 주고 나머지는 다른 회사에 줄 수 있습니다. ',
      '위 ① 실험실에서 10.0.0.0 을 /24 와 /26 으로 각각 놓고 개수를 비교해 보세요.'),
  );
}

/* ═══════════════════════════ ④ 문제 풀기 ══════════════════════════════ */

function practice() {
  const holder = h('div', {});
  const makeBtn = h('button', { type: 'button', class: 'btn', onclick: () => build() }, '새 문제 만들기');

  function build() {
    clear(holder);
    // 학생이 손으로 풀 만한 크기로 접두사를 고른다 (/24 ~ /30)
    const prefix = randInt(24, 30);
    const oct = [randInt(1, 223), randInt(0, 255), randInt(0, 255), randInt(0, 255)];
    const ip = toInt(oct);
    const maskInt = (0xffffffff << (32 - prefix)) >>> 0;
    const netInt = (ip & maskInt) >>> 0;
    const bcInt = (netInt | (~maskInt >>> 0)) >>> 0;
    const cls = classOf(oct[0]);
    const hostBits = 32 - prefix;

    holder.append(
      h('div', { class: 'note', style: { marginBottom: '14px' } },
        '어떤 컴퓨터의 IP 주소가 ',
        h('b', { class: 'mono', style: { fontSize: '1.2rem' } }, `${dotted(ip)}/${prefix}`),
        ' 입니다. 물음에 답하시오.'),
      quizSet([
        {
          q: ['이 IP 주소가 속한 클래스는? ', h('code', { class: 'inline' }, `첫 옥텟 ${oct[0]}`)],
          type: 'choice', choices: ['A', 'B', 'C', 'D'],
          answer: cls.name,
          hint: `${oct[0]} 을 2진수로 쓰면 ${bin8(oct[0])} 입니다. 맨 앞이 0이면 A, 10이면 B, 110이면 C.`,
          explain: `${oct[0]} 은 ${cls.range} 범위이므로 ${cls.name} 클래스입니다.`,
        },
        {
          q: '호스트에 할당되는 비트 수는 몇 비트인가?',
          answer: [String(hostBits), hostBits + '비트'], unit: '비트', width: 110,
          hint: '전체 32비트에서 네트워크 비트 수를 빼면 됩니다.',
          explain: `32 - ${prefix} = ${hostBits}비트`,
        },
        {
          q: '서브넷 마스크를 10진수로 쓰면?',
          answer: dotted(maskInt), width: 190,
          hint: `앞에서부터 1을 ${prefix}개 채우고 나머지를 0으로 둔 뒤, 8자리씩 끊어 10진수로 바꿉니다.`,
          explain: `2진수 ${toOct(maskInt).map(bin8).join('.')} → 10진수 ${dotted(maskInt)}`,
        },
        {
          q: '이 네트워크의 네트워크 주소는?',
          answer: dotted(netInt), width: 190,
          hint: '호스트 비트를 전부 0으로 바꾸면 됩니다.',
          explain: `IP와 서브넷 마스크의 각 비트를 비교해 둘 다 1인 자리만 1로 남기면 ${dotted(netInt)} 입니다.`,
        },
        {
          q: '이 네트워크의 브로드캐스트 주소는?',
          answer: dotted(bcInt), width: 190,
          hint: '호스트 비트를 전부 1로 바꾸면 됩니다.',
          explain: `네트워크 주소 ${dotted(netInt)} 에서 호스트 ${hostBits}비트를 모두 1로 → ${dotted(bcInt)}`,
        },
        {
          q: '전체 IP 주소 개수는? (네트워크 주소·브로드캐스트 주소 포함)',
          answer: [String(2 ** hostBits), comma(2 ** hostBits)], unit: '개', width: 130,
          hint: `2의 (호스트 비트 수)제곱입니다.`,
          explain: `2^${hostBits} = ${comma(2 ** hostBits)}개. 여기서 2개를 빼면 실제로 기기에 줄 수 있는 ${comma(2 ** hostBits - 2)}개.`,
        },
      ], { revealOnWrong: true }));
  }

  build();

  return card('④ 스스로 풀어 보기 — 문제는 누를 때마다 새로 만들어집니다',
    h('div', { class: 'row', style: { marginBottom: '12px' } }, makeBtn,
      h('span', { style: { color: 'var(--ink-soft)' } }, '틀려도 괜찮습니다. [확인] 을 누르면 정답과 풀이가 나옵니다.')),
    holder);
}
