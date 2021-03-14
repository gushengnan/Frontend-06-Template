const http = require('http');
const fs = require('fs');
const archiver = require('archiver');
const child_process = require('child_process');
const querystring = require('querystring');

const githubClientId = 'Iv1.a551f54c9e63b8ce';

// 1 打开 https://github.com/login/oauth/authorize
// Mac 上用 open 命令
child_process.exec(`start chrome.exe https://github.com/login/oauth/authorize?client_id=${githubClientId}`);

// 3 创建 server，接受 token，后点击发布
http.createServer(function (request, response) {
    let query = querystring.parse(request.url.match(/^\/\?([\s\S]+)$/)[1]);
    publish(query.token);
}).listen(8083);

function publish(token) {
    let request = http.request({
        hostname: '127.0.0.1',
        port: '8082',
        method: 'GET',
        path: `/publish?token=${token}`,
        headers: {
            'Content-Type': 'application/octet-stream',
            'User-Agent': 'toy-publish'
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
}
