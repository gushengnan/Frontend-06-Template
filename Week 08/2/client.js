const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const net = require('net');

class Request {
  constructor(options) {
    const { method = "GET", host, port = 80, path = '/', body = {}, headers = {} } = options;
    this.method = method;
    this.host = host;
    this.port = port;
    this.path = path;
    this.body = body;
    this.headers = headers;

    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    if (this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body);
    } else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');
    }

    this.headers['Content-Length'] = this.bodyText.length;
  }

  send() {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser;
      resolve('');
    });
  }
}

class ResponseParser {
  constructor() {

  }

  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i));
    }
  }

  receiveChar(char) {

  }
}



void async function () {
  let request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: '8088',
    path: '/',
    headers: {
      ['X-Foo2']: 'customed'
    },
    body: { name: 'winter' }
  })

  let response = await request.send();

  console.log(response);
}();