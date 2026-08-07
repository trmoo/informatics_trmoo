/* ============================================================================
 * vite.config.js
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

import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// 교실 인터넷이 끊겨도 쓸 수 있도록 빌드 결과를 dist/index.html 한 파일로 묶는다.
// base: './' 는 깃허브 페이지의 하위 경로에서도 자원이 열리게 하기 위함.
export default defineConfig({
  base: './',
  plugins: [viteSingleFile()],
  // 개발 서버 포트. PORT 환경변수가 있으면 그것을 쓴다.
  server: { port: Number(process.env.PORT) || 5173 },
  // 압축할 때 /*! … */ 로 시작하는 「법적 고지」 주석은 지우지 않고 그 자리에 남긴다.
  esbuild: { legalComments: 'inline' },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // 묶인 코드 맨 위에 저작권·라이선스 한 줄을 남긴다.
        // (소스 파일마다 붙여 둔 긴 주석은 압축 과정에서 지워지므로 여기서 다시 넣어 준다)
        banner: '/*! 정보 노트 실습실 (informatics-note-lab) | Copyright 2026 trmoo | '
          + 'SPDX-License-Identifier: Apache-2.0 | http://www.apache.org/licenses/LICENSE-2.0 */',
      },
    },
  },
});
