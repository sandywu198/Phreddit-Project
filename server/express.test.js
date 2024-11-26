const server = require('./server.js');
const mongoose = require('mongoose');

describe('Validate web server', () => {
  afterAll(async () => {
    console.log("\n disconnecting \n");
    await mongoose.disconnect();
    console.log("\n disconnected \n");
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log("\n server closed \n");
          resolve();
        }
      });
    });
    console.log("\n closed \n");
  }, 10000);

  test('check if the webserver is listening on port 8000', () => {
    const actualPort = server.address().port;
    expect(actualPort).toBe(8000);
  });
});