const http = require('http');
const fs = require('fs');
const path = require('path');
let currentPort = parseInt(process.env.PORT, 10) || 3030;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.vcf': 'text/vcard; charset=utf-8'
};

const handleRequest = (req, res) => {
  // Normalize URL
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(reqUrl.pathname);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API endpoint for future database / admin panel integration
  if (pathname === '/api/inquiry' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const inquiryDir = path.join(__dirname, 'data');
        if (!fs.existsSync(inquiryDir)) {
          fs.mkdirSync(inquiryDir, { recursive: true });
        }
        const inquiryFile = path.join(inquiryDir, 'inquiries.json');
        let inquiries = [];
        if (fs.existsSync(inquiryFile)) {
          try {
            inquiries = JSON.parse(fs.readFileSync(inquiryFile, 'utf8'));
          } catch (e) {
            inquiries = [];
          }
        }
        const newRecord = {
          id: 'INQ-' + Date.now(),
          timestamp: new Date().toISOString(),
          ...data
        };
        inquiries.unshift(newRecord);
        fs.writeFileSync(inquiryFile, JSON.stringify(inquiries, null, 2), 'utf8');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Talebiniz başarıyla kaydedildi.', id: newRecord.id }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Geçersiz veri biçimi.' }));
      }
    });
    return;
  }

  // API endpoint for projects listing
  if (pathname === '/api/projects' && req.method === 'GET') {
    const projectsFile = path.join(__dirname, 'data', 'projects.json');
    if (fs.existsSync(projectsFile)) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(fs.readFileSync(projectsFile, 'utf8'));
      return;
    }
  }

  // API endpoint for company info
  if (pathname === '/api/company' && req.method === 'GET') {
    const companyFile = path.join(__dirname, 'data', 'company.json');
    if (fs.existsSync(companyFile)) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(fs.readFileSync(companyFile, 'utf8'));
      return;
    }
  }

  // Clean URL: 301 Redirect .html requests to clean path (SEO friendly)
  if (pathname.endsWith('.html')) {
    const cleanPath = pathname === '/index.html' ? '/' : pathname.slice(0, -5);
    res.writeHead(301, {
      'Location': cleanPath + (reqUrl.search || '')
    });
    res.end();
    return;
  }

  // Root request
  if (pathname === '/') {
    pathname = '/index.html';
  }

  const filePath = path.join(__dirname, pathname);

  fs.stat(filePath, (err, stats) => {
    // If exact file does not exist, check if an .html file matches (e.g. /projeler -> projeler.html)
    if (err || !stats.isFile()) {
      const htmlPath = filePath + '.html';
      if (fs.existsSync(htmlPath)) {
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
        });
        fs.createReadStream(htmlPath).pipe(res);
        return;
      }

      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 - Sayfa Bulunamadı | Konfor Tasarım Mobilya</h1><p><a href="/">Ana Sayfaya Dön</a></p>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400'
    });
    fs.createReadStream(filePath).pipe(res);
  });
};

const server = http.createServer(handleRequest);

function startServer(portToTry) {
  server.listen(portToTry, () => {
    console.log(`====================================================`);
    console.log(`Konfor Tasarım Mobilya - Web Sunucusu Başlatıldı`);
    console.log(`URL: http://localhost:${portToTry}`);
    console.log(`Dizin: ${__dirname}`);
    console.log(`====================================================`);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${currentPort} kullanımda, bir sonraki port deneniyor...`);
    currentPort++;
    startServer(currentPort);
  } else {
    console.error('Sunucu hatası:', err);
  }
});

if (require.main === module) {
  startServer(currentPort);
}

module.exports = { server, handleRequest, MIME_TYPES };
