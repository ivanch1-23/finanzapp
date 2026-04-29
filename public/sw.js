const CACHE_NAME = 'finanzapp-v2'
const urlsToCache = ['/', '/login', '/manifest.json']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch(() => {})
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((networkResponse) => {
        if (networkResponse.ok && event.request.url.startsWith(self.location.origin)) {
          const responseClone = networkResponse.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
        }
        return networkResponse
      }).catch(() => {
        return caches.match('/')
      })
    })
  )
})

self.addEventListener('push', (event) => {
  if (!event.data) return

  let data
  try {
    data = event.data.json()
  } catch {
    data = { title: 'FinanzApp', body: event.data.text(), icon: '/finanzapplogo.png' }
  }

  const options = {
    body: data.body || 'Recordatorio de pago',
    icon: data.icon || '/finanzapplogo.png',
    badge: '/finanzapplogo.png',
    tag: data.tag || 'finanzapp-reminder',
    data: data.data || {},
    vibrate: [200, 100, 200],
    requireInteraction: true,
    actions: [
      { action: 'markPaid', title: 'Marcar como pagado' },
      { action: 'view', title: 'Ver' }
    ]
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'FinanzApp', options)
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'markPaid') {
    event.waitUntil(
      clients.openWindow('/reminders')
    )
  } else if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/reminders')
    )
  } else {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification.tag)
})