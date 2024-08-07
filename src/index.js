const fs = require('fs');
const _ = require('./parse-header');
function RCEdit(data) {
  return new Promise((async function(resolve, reject) {
    if (data instanceof Uint8Array || data instanceof Buffer || data instanceof ArrayBuffer) {
      data = await Buffer.from(data);
    } else if (typeof data === 'string') {
      await new Promise((readFile, failedRead) => {
        fs.readFile(data, (err, val) => {
          if (err) failedRead(err);
          data = val;
          readFile();
        });
      });
    } else reject(new TypeError(`Data property needs to be on of the following: Uint8Array, Buffer, ArrayBuffer, String (file path).\nBut found "${typeof data}".`));
    this.PE = await _(data);
    resolve(this);
  }).bind({}));
}
module.exports = RCEdit;
