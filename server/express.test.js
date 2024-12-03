const server = require('./server.js');
// const mongoose = require('mongoose');

describe('Validate web server', () => {
  afterAll(async () => {
    // await mongoose.disconnect();
    server.close();
  });

  test('check if the webserver is listening on port 8000', () => {
    const actualPort = server.address().port;
    expect(actualPort).toBe(8000);
  });
});