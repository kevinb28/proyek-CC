const STATIC_ASSETS = [ 
	'./',
	
	'./detail.html',
	'./js/detail-main.js',

	'./read.html',
	'./js/read.js',

	'./latest-updates.html',
	'./js/latest-updates.js'
];

const STATIC_CACHE_NAME = 'manga-static';
const DYNAMIC_CACHE_NAME = 'manga-dynamic';

self.addEventListener('install', async evt => {
	 const cache = await caches.open(STATIC_CACHE_NAME);
	 cache.addAll(STATIC_ASSETS);
});

self.addEventListener('fetch', evt => {
	const req = evt.request;
	const url = new URL(req.url);

	// check where to fetch. from our own cache or network.
	if (url.origin == location.origin) {
		evt.respondWith(cacheFirst(req));
	} else {
		evt.respondWith(networkFirst(req));
	}
});

async function cacheFirst(req) {
	const cachedResponse = await caches.match(req);
	return cachedResponse || fetch(req);
}

async function networkFirst(req) {
	const cache = await caches.open(DYNAMIC_CACHE_NAME);
	try {
        // try go to network and fetch data 
		const res = await fetch(req);
		cache.put(req, res.clone());
		return res;
	} catch(error) {
        // look something on cache. 
		const cachedResponse = await cache.match(req);
		return cachedResponse;
	}
}

self.addEventListener('activate', (evt) => {
	evt.waitUntil( 
	    caches.keys().then((keyList) => { 
	        return Promise.all(keyList.map((key) => { 
	            if (key !== STATIC_CACHE_NAME) { 
	                console.log('[ServiceWorker] Removing old cache', key); 
	                return caches.delete(key); 
	            } 
	        }));
	    })
	); 
});
