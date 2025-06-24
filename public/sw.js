if (!self.define) {
  let e,
    a = {}
  const i = (i, s) => (
    (i = new URL(i + '.js', s).href),
    a[i] ||
      new Promise((a) => {
        if ('document' in self) {
          const e = document.createElement('script')
          ;(e.src = i), (e.onload = a), document.head.appendChild(e)
        } else (e = i), importScripts(i), a()
      }).then(() => {
        let e = a[i]
        if (!e) throw new Error(`Module ${i} didn’t register its module`)
        return e
      })
  )
  self.define = (s, n) => {
    const c = e || ('document' in self ? document.currentScript.src : '') || location.href
    if (a[c]) return
    let t = {}
    const o = (e) => i(e, c),
      r = { module: { uri: c }, exports: t, require: o }
    a[c] = Promise.all(s.map((e) => r[e] || o(e))).then((e) => (n(...e), t))
  }
}
define(['./workbox-3c9d0171'], function (e) {
  'use strict'
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: '/_next/static/chunks/126.3edc46e1c1e8c255.js', revision: '3edc46e1c1e8c255' },
        { url: '/_next/static/chunks/2406-8647eb8bff75dff7.js', revision: 'ijHon2LoPWL7BSr_vOaz9' },
        { url: '/_next/static/chunks/3605-a113f5bcedc70c23.js', revision: 'ijHon2LoPWL7BSr_vOaz9' },
        { url: '/_next/static/chunks/4006-9f3f65cd7e87454f.js', revision: 'ijHon2LoPWL7BSr_vOaz9' },
        { url: '/_next/static/chunks/4661-01bb3b89c93442fb.js', revision: 'ijHon2LoPWL7BSr_vOaz9' },
        { url: '/_next/static/chunks/610.b68706f3f98d2e48.js', revision: 'b68706f3f98d2e48' },
        { url: '/_next/static/chunks/6267-6ec29e20be5b9875.js', revision: 'ijHon2LoPWL7BSr_vOaz9' },
        { url: '/_next/static/chunks/8845-c351de344813177f.js', revision: 'ijHon2LoPWL7BSr_vOaz9' },
        {
          url: '/_next/static/chunks/animations-44ca5bd55440b041.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/%5B...rest%5D/page-709b705b12f394be.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(admin)/admin/album/page-6707edf33ece0fad.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(admin)/admin/comments/page-40ad3002a8a8a918.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(admin)/admin/friends/page-a04b0ae2e0e0c2cd.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(admin)/admin/page-5e2f6151226c297c.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(admin)/admin/talk/page-ae4229c3accda556.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(admin)/admin/users/page-c7db1a982cd720e4.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(admin)/layout-73d70f42df835935.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/about/page-9e782ce6bcaa948d.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/album/page-3ccbccbec3b5b841.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/archive/%5Bslug%5D/page-ccd78c6e17e3bc57.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/archive/page-e331264504e4a0e0.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/bangumi/page-fc9104f6c26c6197.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/books/page-b286d9a0decbd03a.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/categories/%5Bslug%5D/page-c1566029a0b55675.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/friends/page-f0ccbf5f255566b2.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/guestbook/loading-468995f17c254564.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/guestbook/page-20c4e29478adfcc2.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/layout-e37c8cd2dd72c10e.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/links/page-af7e9e62e666e002.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/movies/page-bfc8d20ef67da425.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/notes/%5Bslug%5D/page-d111c751de21e0ce.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/notes/page-f4e39089bc861d86.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/page-42958649cb1047a0.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/posts/%5Bslug%5D/page-3e690494cb75e36f.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/posts/page-47c006b6666d495e.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/projects/%5Bslug%5D/page-0d84a24c8779fd3d.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/projects/page-639943b3d597bece.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/search/page-7409d9a6dfcf38ed.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/talk/page-f1ef906b8135db25.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/error-906b2a5dd5f7f11b.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/layout-a8a6652738479b65.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/(page)/not-found-6bfa8af6fc8a646b.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-5a9239499a081848.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/api/auth/%5B...all%5D/route-685471dd7934c52a.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/api/avatar/%5Bid%5D/route-d9ada66e93962e98.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/api/trpc/%5Btrpc%5D/route-a809e4cd6df497a2.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/manifest.webmanifest/route-58b7ec235040ca30.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/og/%5Bid%5D/route-5ae4fefbc704cf64.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/robots.txt/route-fe3fb68b43616b62.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/rss.xml/route-2f0e3c2b1b414c94.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/app/sitemap.xml/route-13034a8ae8667681.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        { url: '/_next/static/chunks/data-eace6c13fb464d8c.js', revision: 'ijHon2LoPWL7BSr_vOaz9' },
        { url: '/_next/static/chunks/main-4fa61e88fa471b13.js', revision: 'ijHon2LoPWL7BSr_vOaz9' },
        {
          url: '/_next/static/chunks/main-app-0a58bd960b14bcf5.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/pages/_app-ee56c11d9a322f94.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/pages/_error-f41be606e2aec3a8.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        { url: '/_next/static/chunks/ui-2cc77cbfa8ba9ad9.js', revision: 'ijHon2LoPWL7BSr_vOaz9' },
        {
          url: '/_next/static/chunks/utils-b22ea7f4116f3e42.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/vendor-0bdeb3117a923c2f.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        {
          url: '/_next/static/chunks/webpack-255db90d6d527098.js',
          revision: 'ijHon2LoPWL7BSr_vOaz9',
        },
        { url: '/_next/static/css/04cf26e2b915883d.css', revision: '04cf26e2b915883d' },
        { url: '/_next/static/css/0a9e0da31583777f.css', revision: '0a9e0da31583777f' },
        { url: '/_next/static/css/250b401cd386ed38.css', revision: '250b401cd386ed38' },
        { url: '/_next/static/css/87af64c9ea977756.css', revision: '87af64c9ea977756' },
        { url: '/_next/static/css/b425159a50153f27.css', revision: 'b425159a50153f27' },
        { url: '/_next/static/css/bdfe626d2c25fefa.css', revision: 'bdfe626d2c25fefa' },
        { url: '/_next/static/css/cf134c2960ed2761.css', revision: 'cf134c2960ed2761' },
        { url: '/_next/static/css/d71f8ae66aac746b.css', revision: 'd71f8ae66aac746b' },
        {
          url: '/_next/static/ijHon2LoPWL7BSr_vOaz9/_buildManifest.js',
          revision: 'fdc6d1837cc5e6d6ea884985e7c54b7e',
        },
        {
          url: '/_next/static/ijHon2LoPWL7BSr_vOaz9/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        {
          url: '/_next/static/media/028c0d39d2e8f589-s.p.woff2',
          revision: 'c47061a6ce9601b5dea8da0c9e847f79',
        },
        {
          url: '/_next/static/media/5b01f339abf2f1a5.p.woff2',
          revision: 'c36289c8eb40b089247060459534962c',
        },
        {
          url: '/_next/static/media/call-me.559ae03a.jpg',
          revision: '4dd6b51b9075ac911b5a36b284bc167b',
        },
        {
          url: '/favicon/android-chrome-192x192.png',
          revision: '2091744db18d8b85d88b122aa61ee32d',
        },
        {
          url: '/favicon/android-chrome-384x384.png',
          revision: '7122eb5a3f1052208caa1e52f889ab1d',
        },
        {
          url: '/favicon/android-chrome-512x512.png',
          revision: 'eaacb9496b7b4e1d33fd847c41110e2d',
        },
        { url: '/favicon/apple-touch-icon.png', revision: '90d4f46e7e5969c5fe0cd7a6327dbf72' },
        { url: '/favicon/favicon-16x16.png', revision: 'ac2a138765bb8ed592a3aa50fec6519b' },
        { url: '/favicon/favicon-32x32.ico', revision: '183f43fbc8b564e12375ead2bc226c18' },
        { url: '/favicon/favicon.svg', revision: '4246bc1d86dfdaf414a44acf9f55185b' },
        { url: '/favicon/site.webmanifest', revision: '7920a40c65a016cdab46d75086aeb217' },
        { url: '/images/about/badminton.png', revision: 'acf5df6cf83219b1e97fc271befac035' },
        { url: '/images/about/enfp.svg', revision: '663163a4dbf8b3a93ddd642a1e2eacf7' },
        { url: '/images/about/guitar.jpg', revision: 'a5fabb61de97e5ff9814024da30f14f6' },
        { url: '/images/about/intro-1.jpg', revision: 'b20b9e3830cb3b5bca6d9cf4396c3a24' },
        { url: '/images/about/intro-2.jpg', revision: '2818502c686576baa5fc634f678ce8ad' },
        { url: '/images/about/intro-3.jpg', revision: 'ac476fe76df727b1a11e6add4e687479' },
        { url: '/images/about/intro-4.jpg', revision: 'ea1e1ab4687707a16c64876aaa1acca6' },
        { url: '/images/about/intro-5.jpg', revision: '1ef4bbc076c03d66a84dc50032fc5b69' },
        { url: '/images/about/leo.png', revision: '06dd9596967666e5564664ca830d2f88' },
        { url: '/images/about/life.jpg', revision: '1e8da3bcedc184e2804e7630b7835ea3' },
        { url: '/images/about/music.png', revision: '2c0d932bd8cc5227e41757dd8e65e9b4' },
        { url: '/images/about/ylnx.jpg', revision: 'dc30be354aca21a6c461b4473307dddd' },
        { url: '/images/admire.jpg', revision: '50bc769ade463464986d30f8f2a1edd3' },
        { url: '/images/email/github.png', revision: 'a231b6aff82b34e79266206787f5fce7' },
        { url: '/images/email/x.png', revision: '3d9276c8b7c36acae89a7ccb450323d4' },
        {
          url: '/images/gradient-background-bottom.png',
          revision: 'fbc71cd395430ff54dc90bee7b19957e',
        },
        {
          url: '/images/gradient-background-top.png',
          revision: 'dadd5a2638b66e5c18eabc1d8d6326da',
        },
        { url: '/images/home/avatar.webp', revision: '44565f54f17e5b50cd7452c788f2b156' },
        { url: '/images/home/call-me.jpg', revision: '4dd6b51b9075ac911b5a36b284bc167b' },
        { url: '/images/og-background.png', revision: '46b7566cdc6c120530a3b1d9f9b9dbdc' },
        { url: '/images/og.png', revision: '2fececbef8d4e1479a343efe97e0daa4' },
        { url: '/images/projects/@eonova-ui.png', revision: 'f346eb8a6efcfd29909165121d53ea0c' },
        { url: '/images/projects/eonova.me.png', revision: 'f5e1950c260145ecbca33bad57f47eff' },
        { url: '/images/projects/internal/demo.gif', revision: '7b4ff887865f9ca38f36218d6a0ecf8d' },
        { url: '/images/projects/mini-react.png', revision: '280234bb3e4b922aeb9a113491c0371c' },
        {
          url: '/images/projects/online-playground.png',
          revision: '1c25f48e099781a2848b67f352d6a154',
        },
        { url: '/images/projects/sokoban.png', revision: '654a20c05fad8f9288261725adc74eae' },
        { url: '/images/projects/v3-directives.png', revision: '90b3d7ea9eed2fb5e84006e5099f677e' },
        { url: '/images/projects/vitesse-star.png', revision: 'db90b7a8100ba83da522c30fb2357694' },
        {
          url: '/images/projects/vscode-eonova-snippets.png',
          revision: 'db141ebb32915c79d5c4efd8009239ab',
        },
        { url: '/images/upyun-logo.png', revision: '6bdb8361db95808e6d8d196d37d8cbcc' },
        { url: '/swe-worker-5c72df51bb1f6ee0.js', revision: '76fdd3369f623a3edcf74ce2200bfdd0' },
        { url: '/videos/guitar.mp4', revision: 'b6ce5e15afff4b649dff4d3bc2dae486' },
        { url: '/videos/life.mp4', revision: '218412bca0a58d8997a0bca505481ad6' },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: function (e) {
              return _ref.apply(this, arguments)
            },
          },
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.googleapis\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-cache',
        plugins: [new e.ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 31536e3 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.gstatic\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-cache',
        plugins: [new e.ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 31536e3 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/static.+\.js$/i,
      new e.CacheFirst({
        cacheName: 'next-static-js-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp4|webm)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      function (e) {
        var a = e.sameOrigin,
          i = e.url.pathname
        return !(!a || i.startsWith('/api/auth/callback') || !i.startsWith('/api/'))
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      function (e) {
        var a = e.request,
          i = e.url.pathname,
          s = e.sameOrigin
        return (
          '1' === a.headers.get('RSC') &&
          '1' === a.headers.get('Next-Router-Prefetch') &&
          s &&
          !i.startsWith('/api/')
        )
      },
      new e.NetworkFirst({
        cacheName: 'pages-rsc-prefetch',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      function (e) {
        var a = e.request,
          i = e.url.pathname,
          s = e.sameOrigin
        return '1' === a.headers.get('RSC') && s && !i.startsWith('/api/')
      },
      new e.NetworkFirst({
        cacheName: 'pages-rsc',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      function (e) {
        var a = e.url.pathname
        return e.sameOrigin && !a.startsWith('/api/')
      },
      new e.NetworkFirst({
        cacheName: 'pages',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      function (e) {
        return !e.sameOrigin
      },
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 })],
      }),
      'GET',
    )
})
