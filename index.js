const spawn = require('child_process').spawn;

const isWin = process.platform === 'win32';
const ext = isWin ? '.cmd' : '';

const opts = { stdio: 'inherit' };

spawn(`ionic${ext}`, ['serve'], opts);
spawn(`gulp${ext}`, ['watch'], opts);
