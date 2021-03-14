const http = require('http');
const https = require('https');
const unzipper = require('unzipper');
const querystring = require('querystring');

const clientId = 'Iv1.a551f54c9e63b8ce';
const clientSecret = '1175545d7e7ba6f656d51013e72cdf5bac9ff5db';

// 2 auth路由：接受 code，用 code、client_id、client_sectret 换 token
function auth(request, response) {
    let query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
    getToken(query.code, info => {
        response.write(`<a href="http://localhost:8083/?token=${info.access_token}">publish</a>`)
        response.end();
    });
}

function getToken(code, callback) {
    let request = https.request({
        hostname: 'github.com',
        path: `/login/oauth/access_token?code=${code}&client_id=${clientId}&client_secret=${clientSecret}`,
        port: 443,
        method: 'POST',
    }, (response) => {
        let body = '';
        response.on('data', chunk => {
            body += chunk.toString();
        });
        response.on('end', chunk => {
            if (chunk) {
                body += chunk.toString();
            }
            let o = querystring.parse(body);
            callback(o);
        });
    });
    request.end();
}

// 4 publish路由：用 token 获取用户信息，检查权限 接受发布
function getUser(token, callback) {
    let request = https.request({
        hostname: 'api.github.com',
        path: '/user',
        port: 443,
        method: 'POST',
        headers: { 'Authorization': `token ${token}` }
    }, (response) => {
        let body = '';
        response.on('data', chunk => {
            body += chunk.toString();
        });
        response.on('end', chunk => {
            if (chunk) {
                body += chunk.toString();
            }
            callback(JSON.parse(body));
        });
    });
    request.end();
}

function publish(request, response) {
    let query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
    if (query.token) {
        getUser(query.token, info => {
            if (info.login && info.login === 'gushengnan') {
                request.pipe(unzipper.Extract({ path: '../server/public/' }));
                request.on('end', () => {
                    response.end('success');
                });
            }
        });
    }
}

http.createServer(function (request, response) {
    if (request.url.match(/^\/auth\?/)) {
        return auth(request, response);
    }

    if (request.url.match(/^\/publish\?/)) {
        return publish(request, response);
    }
}).listen(8082);