let http = require('http');
const unzipper = require('unzipper');

http.createServer(function (request, response) {
    console.log('request received')
    request.pipe(unzipper.Extract({ path: '../server/public/' }));
    response.write('success');

}).listen(8082);