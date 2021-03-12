let http = require('http');
let fs = require('fs');
const archiver = require('archiver');

let request = http.request({
    hostname: '127.0.0.1',
    port: '8082',
    method: 'POST',
    headers: {
        'Content-Type': 'application/octet-stream',
        // 'Content-Length': stats.size
    }
}, response => {
    console.log(response);
});

const archive = archiver('zip', { zlib: { level: 9 } });
archive.directory('./sample/', false);
archive.finalize();

archive.pipe(request);

archive.on('end', () => {
    request.end();
});

