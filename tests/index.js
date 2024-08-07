const path = require('path');
const rcedit = require('../src/index');
rcedit(path.join(__dirname, 'dnSpy.exe')).then((RCEdit) => {
  console.log(RCEdit);
});
