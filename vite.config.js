import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 서비스 워커가 새로운 콘텐츠를 찾았을 때 자동으로 업데이트하도록 설정
      registerType: 'autoUpdate',
      
      // 오프라인에서 동작할 수 있도록 캐싱할 파일들을 지정
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3}']
      },

      // PWA 매니페스트 설정
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
            purpose: 'any maskable' // 안드로이드에서 아이콘이 잘리지 않게 함
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