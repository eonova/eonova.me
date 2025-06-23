if (!self.define) {
  let e,
    a = {}
  const s = (s, c) => (
    (s = new URL(s + '.js', c).href),
    a[s] ||
      new Promise((a) => {
        if ('document' in self) {
          const e = document.createElement('script')
          ;(e.src = s), (e.onload = a), document.head.appendChild(e)
        } else (e = s), importScripts(s), a()
      }).then(() => {
        let e = a[s]
        if (!e) throw new Error(`Module ${s} didn’t register its module`)
        return e
      })
  )
  self.define = (c, n) => {
    const i = e || ('document' in self ? document.currentScript.src : '') || location.href
    if (a[i]) return
    let t = {}
    const r = (e) => s(e, i),
      o = { module: { uri: i }, exports: t, require: r }
    a[i] = Promise.all(c.map((e) => o[e] || r(e))).then((e) => (n(...e), t))
  }
}
define(['./workbox-3c9d0171'], function (e) {
  'use strict'
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: '/_next/static/4tk-GS8Eq9scnLxzbxcQf/_buildManifest.js',
          revision: 'a16e1c30f01e5d2e7b50dd9c292afa54',
        },
        {
          url: '/_next/static/4tk-GS8Eq9scnLxzbxcQf/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        { url: '/_next/static/chunks/126.493ada3f491ef87f.js', revision: '493ada3f491ef87f' },
        { url: '/_next/static/chunks/2406-b076d9ab286da9f7.js', revision: '4tk-GS8Eq9scnLxzbxcQf' },
        { url: '/_next/static/chunks/3605-0944fe6a07b5901b.js', revision: '4tk-GS8Eq9scnLxzbxcQf' },
        { url: '/_next/static/chunks/4006-080c8f2300d0ebe3.js', revision: '4tk-GS8Eq9scnLxzbxcQf' },
        { url: '/_next/static/chunks/4661-77ac4d935da5aed8.js', revision: '4tk-GS8Eq9scnLxzbxcQf' },
        { url: '/_next/static/chunks/610.b68706f3f98d2e48.js', revision: 'b68706f3f98d2e48' },
        { url: '/_next/static/chunks/6267-3fce4a6b3149e233.js', revision: '4tk-GS8Eq9scnLxzbxcQf' },
        { url: '/_next/static/chunks/8845-cfa0a6a04dbad06f.js', revision: '4tk-GS8Eq9scnLxzbxcQf' },
        {
          url: '/_next/static/chunks/animations-44ca5bd55440b041.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/%5B...rest%5D/page-709b705b12f394be.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(admin)/admin/album/page-5f4eca1de46bd284.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(admin)/admin/comments/page-ca163368d9c5226f.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(admin)/admin/friends/page-0b6d1fa2b9b2c8cd.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(admin)/admin/page-5e2f6151226c297c.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(admin)/admin/talk/page-594d85893b3d8938.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(admin)/admin/users/page-9727496bfeae5b64.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(admin)/layout-9f02b6d74ab4ae9c.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/about/page-fa6d0faf36e198d5.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/album/page-43263d55d167beae.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/archive/%5Bslug%5D/page-ed0b24857a6708e6.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/archive/page-888581721403dbb9.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/bangumi/page-7c8f9a6d7c6e0bef.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/books/page-26c47a5517f21d22.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/categories/%5Bslug%5D/page-f76c0dcfd6622e78.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/friends/page-c3c1cbea22cd1c4e.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/guestbook/loading-70f179e948690faa.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/guestbook/page-b3c5eeb8a25da12d.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/layout-e37c8cd2dd72c10e.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/links/page-cbee10d350391994.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/movies/page-3a866cabcaf2476f.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/notes/%5Bslug%5D/page-469d46e6e0ba9e48.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/notes/page-2e4bc6ad1333b749.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/page-78d8d5613c98e0c5.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/posts/%5Bslug%5D/page-2860eaba4d5d6feb.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/posts/page-9221bded4bcf0d07.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/projects/%5Bslug%5D/page-ccfccb76084a5559.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/projects/page-270c5be2e3ee4808.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/(main)/talk/page-019eb4061c94c805.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/error-16b6d9481ed278a4.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/layout-4407a51a713003df.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/(page)/not-found-6bfa8af6fc8a646b.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-5a9239499a081848.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/api/auth/%5B...all%5D/route-685471dd7934c52a.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/api/avatar/%5Bid%5D/route-d9ada66e93962e98.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/api/trpc/%5Btrpc%5D/route-a809e4cd6df497a2.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/manifest.webmanifest/route-58b7ec235040ca30.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/og/%5Bid%5D/route-5ae4fefbc704cf64.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/robots.txt/route-fe3fb68b43616b62.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/rss.xml/route-2f0e3c2b1b414c94.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/app/sitemap.xml/route-13034a8ae8667681.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        { url: '/_next/static/chunks/data-eace6c13fb464d8c.js', revision: '4tk-GS8Eq9scnLxzbxcQf' },
        { url: '/_next/static/chunks/main-4fa61e88fa471b13.js', revision: '4tk-GS8Eq9scnLxzbxcQf' },
        {
          url: '/_next/static/chunks/main-app-0a58bd960b14bcf5.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/pages/_app-ee56c11d9a322f94.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/pages/_error-f41be606e2aec3a8.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        { url: '/_next/static/chunks/ui-674a8c051aa59770.js', revision: '4tk-GS8Eq9scnLxzbxcQf' },
        {
          url: '/_next/static/chunks/utils-b22ea7f4116f3e42.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/vendor-0bdeb3117a923c2f.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        {
          url: '/_next/static/chunks/webpack-5a04a2ee03b7710c.js',
          revision: '4tk-GS8Eq9scnLxzbxcQf',
        },
        { url: '/_next/static/css/04cf26e2b915883d.css', revision: '04cf26e2b915883d' },
        { url: '/_next/static/css/250b401cd386ed38.css', revision: '250b401cd386ed38' },
        { url: '/_next/static/css/87af64c9ea977756.css', revision: '87af64c9ea977756' },
        { url: '/_next/static/css/a8a4c7ace12d61b8.css', revision: 'a8a4c7ace12d61b8' },
        { url: '/_next/static/css/b425159a50153f27.css', revision: 'b425159a50153f27' },
        { url: '/_next/static/css/cf134c2960ed2761.css', revision: 'cf134c2960ed2761' },
        { url: '/_next/static/css/d71f8ae66aac746b.css', revision: 'd71f8ae66aac746b' },
        { url: '/_next/static/css/dfb8ee20f712694e.css', revision: 'dfb8ee20f712694e' },
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
          s = e.url.pathname
        return !(!a || s.startsWith('/api/auth/callback') || !s.startsWith('/api/'))
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
          s = e.url.pathname,
          c = e.sameOrigin
        return (
          '1' === a.headers.get('RSC') &&
          '1' === a.headers.get('Next-Router-Prefetch') &&
          c &&
          !s.startsWith('/api/')
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
          s = e.url.pathname,
          c = e.sameOrigin
        return '1' === a.headers.get('RSC') && c && !s.startsWith('/api/')
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
