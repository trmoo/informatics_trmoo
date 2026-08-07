/* ============================================================================
 * vite.config.js
 *
 * © 2026 티쳐무 · 모든 권리 보유
 *
 * 무단 배포 및 상업적 이용을 금합니다. 학교 수업 목적으로만 이용해 주세요.
 * 그 밖의 이용(재배포·2차 저작물·수업 외 목적)은 먼저 문의해 주세요.
 * 오픈소스 라이선스를 붙이지 않았습니다 — 자세한 내용은 LICENSE 파일을 보세요.
 * ========================================================================== */

import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// 교실 인터넷이 끊겨도 쓸 수 있도록 빌드 결과를 dist/index.html 한 파일로 묶는다.
// base: './' 는 깃허브 페이지의 하위 경로에서도 자원이 열리게 하기 위함.
export default defineConfig({
  base: './',
  plugins: [viteSingleFile()],
  // 개발 서버 포트. PORT 환경변수가 있으면 그것을 쓴다.
  server: { port: Number(process.env.PORT) || 5173 },
  // 압축할 때 /*! 로 시작하는 「법적 고지」 주석은 지우지 않고 그 자리에 남긴다.
  // (이것을 빼면 저작권 표시가 배포물에서 통째로 사라진다)
  esbuild: { legalComments: 'inline' },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // 묶인 코드 맨 위에 저작권 한 줄을 남긴다.
        // (소스 파일마다 붙여 둔 긴 주석은 압축 과정에서 지워지므로 여기서 다시 넣어 준다)
        banner: '/*! 정보 노트 실습실 | © 2026 티쳐무 · 모든 권리 보유 | '
          + '무단 배포 및 상업적 이용 금지 · 학교 수업 목적으로만 이용 | '
          + 'https://github.com/trmoo/informatics_trmoo */',
      },
    },
  },
});
