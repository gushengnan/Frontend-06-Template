let http = require('http');
let fs = require('fs');

http.createServer(function (request, response) {
    console.log(request.headers);
    let outFile = fs.createWriteStream('../server/public/index.html');

    request.on('data', chunk => {
        outFile.write(chunk);
    });
    request.on('end', chunk => {
        if (chunk) {
            outFile.write(chunk);
        }
        outFile.end();
        response.end('success');
    });
}).listen(8082);