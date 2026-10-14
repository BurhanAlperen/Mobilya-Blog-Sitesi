const { handleRequest } = require('./server.js');
const { EventEmitter } = require('events');

function simulateRequest(method, urlPath, body = null) {
  return new Promise((resolve) => {
    const req = new EventEmitter();
    req.method = method;
    req.url = urlPath;
    req.headers = { host: 'localhost:3030' };

const { Writable } = require('stream');

class MockResponse extends Writable {
  constructor(resolve) {
    super();
    this.resolve = resolve;
    this.headers = {};
    this.statusCode = 200;
    this.body = '';
  }
  setHeader(k, v) { this.headers[k.toLowerCase()] = v; }
  writeHead(code, headers = {}) {
    this.statusCode = code;
    for (const [k, v] of Object.entries(headers)) {
      this.headers[k.toLowerCase()] = v;
    }
  }
  _write(chunk, encoding, callback) {
    this.body += chunk.toString();
    callback();
  }
  end(chunk) {
    if (chunk) this.body += chunk.toString();
    super.end();
    this.resolve({
      statusCode: this.statusCode,
      headers: this.headers,
      body: this.body
    });
  }
}

    const res = new MockResponse(resolve);

    // Call the server request handler
    handleRequest(req, res);

    if (body) {
      req.emit('data', JSON.stringify(body));
    }
    req.emit('end');
  });
}

async function runTests() {
  console.log('========================================================');
  console.log('Konfor Tasarım Mobilya - Temiz URL & Rota Testleri');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ [BAŞARILI] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [BAŞARISIZ] ${name}: ${err.message}`);
      failed++;
    }
  }

  // 1. Clean URLs
  await test('GET / => Ana Sayfa (200 OK)', async () => {
    const res = await simulateRequest('GET', '/');
    if (res.statusCode !== 200) throw new Error(`Beklenen 200, alınan: ${res.statusCode}`);
    if (!res.headers['content-type'].includes('text/html')) throw new Error('Geçersiz content-type');
  });

  await test('GET /projeler => Projeler Sayfası (200 OK)', async () => {
    const res = await simulateRequest('GET', '/projeler');
    if (res.statusCode !== 200) throw new Error(`Beklenen 200, alınan: ${res.statusCode}`);
    if (!res.headers['content-type'].includes('text/html')) throw new Error('Geçersiz content-type');
  });

  await test('GET /hakkimizda => Hakkımızda Sayfası (200 OK)', async () => {
    const res = await simulateRequest('GET', '/hakkimizda');
    if (res.statusCode !== 200) throw new Error(`Beklenen 200, alınan: ${res.statusCode}`);
    if (!res.headers['content-type'].includes('text/html')) throw new Error('Geçersiz content-type');
  });

  await test('GET /iletisim => İletişim Sayfası (200 OK)', async () => {
    const res = await simulateRequest('GET', '/iletisim');
    if (res.statusCode !== 200) throw new Error(`Beklenen 200, alınan: ${res.statusCode}`);
    if (!res.headers['content-type'].includes('text/html')) throw new Error('Geçersiz content-type');
  });

  await test('GET /projeler?cat=kurumsal => Parametreli Temiz URL (200 OK)', async () => {
    const res = await simulateRequest('GET', '/projeler?cat=kurumsal');
    if (res.statusCode !== 200) throw new Error(`Beklenen 200, alınan: ${res.statusCode}`);
  });

  // 2. 301 Redirects for .html
  await test('GET /projeler.html => 301 Redirect to /projeler', async () => {
    const res = await simulateRequest('GET', '/projeler.html');
    if (res.statusCode !== 301) throw new Error(`Beklenen 301, alınan: ${res.statusCode}`);
    if (res.headers['location'] !== '/projeler') throw new Error(`Beklenen /projeler, alınan: ${res.headers['location']}`);
  });

  await test('GET /hakkimizda.html => 301 Redirect to /hakkimizda', async () => {
    const res = await simulateRequest('GET', '/hakkimizda.html');
    if (res.statusCode !== 301) throw new Error(`Beklenen 301, alınan: ${res.statusCode}`);
    if (res.headers['location'] !== '/hakkimizda') throw new Error(`Beklenen /hakkimizda, alınan: ${res.headers['location']}`);
  });

  await test('GET /iletisim.html => 301 Redirect to /iletisim', async () => {
    const res = await simulateRequest('GET', '/iletisim.html');
    if (res.statusCode !== 301) throw new Error(`Beklenen 301, alınan: ${res.statusCode}`);
    if (res.headers['location'] !== '/iletisim') throw new Error(`Beklenen /iletisim, alınan: ${res.headers['location']}`);
  });

  await test('GET /index.html => 301 Redirect to /', async () => {
    const res = await simulateRequest('GET', '/index.html');
    if (res.statusCode !== 301) throw new Error(`Beklenen 301, alınan: ${res.statusCode}`);
    if (res.headers['location'] !== '/') throw new Error(`Beklenen /, alınan: ${res.headers['location']}`);
  });

  // 3. API Endpoints
  await test('GET /api/projects => JSON Proje Listesi (200 OK)', async () => {
    const res = await simulateRequest('GET', '/api/projects');
    if (res.statusCode !== 200) throw new Error(`Beklenen 200, alınan: ${res.statusCode}`);
    const data = JSON.parse(res.body);
    if (!Array.isArray(data) || data.length === 0) throw new Error('Geçersiz proje dizisi');
  });

  await test('GET /api/company => JSON Şirket Bilgileri (200 OK)', async () => {
    const res = await simulateRequest('GET', '/api/company');
    if (res.statusCode !== 200) throw new Error(`Beklenen 200, alınan: ${res.statusCode}`);
    const data = JSON.parse(res.body);
    if (!data.company || data.company.name !== 'Konfor Tasarım Mobilya') throw new Error('Geçersiz şirket verisi');
  });

  await test('POST /api/inquiry => Form Talebi Kaydetme (200 OK)', async () => {
    const res = await simulateRequest('POST', '/api/inquiry', {
      name: 'Test Proje',
      phone: '05374303560',
      projectType: 'Kurumsal Proje',
      details: 'Toplantı masası ve akustik panel'
    });
    if (res.statusCode !== 200) throw new Error(`Beklenen 200, alınan: ${res.statusCode}`);
    const data = JSON.parse(res.body);
    if (!data.success) throw new Error('Kayıt başarısız');
  });

  // 4. 404 Not Found
  await test('GET /olmayan-sayfa => 404 Bulunamadı', async () => {
    const res = await simulateRequest('GET', '/olmayan-sayfa');
    if (res.statusCode !== 404) throw new Error(`Beklenen 404, alınan: ${res.statusCode}`);
  });

  console.log(`\n========================================================`);
  console.log(`Sonuç: ${passed} Başarılı, ${failed} Hata.`);
  console.log(`========================================================`);

  if (failed > 0) process.exit(1);
}

runTests();
