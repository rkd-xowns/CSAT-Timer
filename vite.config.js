import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 1. 'injectManifest' 전략으로 변경
      strategies: 'injectManifest',
      // 2. 직접 작성할 서비스 워커 파일의 위치 지정
      srcDir: 'src',
      filename: 'sw.js',
      // 3. 개발 환경에서도 서비스 워커 활성화 (테스트 시 유용)
      devOptions: {
        enabled: true
      },
      // PWA 매니페스트 설정 (이 부분은 그대로 유지)
      manifest: {
        name: '수능시계 시뮬레이터',
        short_name: '수능시계',
        description: '수능 시간표에 맞춰 실전처럼 연습하는 시뮬레이터',
        start_url: '.',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#121212',
        theme_color: '#121212',
        icons: [
          {
            src: '/icons/192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/android-launchericon-512-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import purgeCss from 'vite-plugin-purgecss'; // 👈 중괄호{}가 없는지 확인!

// export default defineConfig({
//   plugins: [
//     react(),
//     purgeCss(),
//   ],
// });