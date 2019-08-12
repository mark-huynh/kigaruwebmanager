// var child_process = require('child_process');
// child_process.exec("start cmd.exe /K cd /D C:/test");

// const { exec } = require('child_process');

// exec('dir', (err, stdout, stderr) => {
//   if (err) {
//     // node couldn't execute the command
//     return;
//   }

//   // the *entire* stdout and stderr (buffered)
//   console.log(`stdout: ${stdout}`);
//   console.log(`stderr: ${stderr}`);
// });


const util = require('util');
const exec = util.promisify(require('child_process').exec);

const as = 'asfdswer';

async function ls() {
  // await exec('git clone https://github.com/mark-huynh/test2.git && npm install');
  // console.log('Done');
  exec('py test.py ' + as)
}
ls();






// const spawn = require('child_process').spawn;
// const ls = spawn('python', ['test.py', 'arg1', 'arg2']);


// ls.stdout.on('data', (data) => {
//   console.log(`stdout: ${data}`);
// });


// const util = require('util');
// const exec = util.promisify(require('child_process').exec);

// async function ls() {
//   await exec('py test.py');
//   console.log('Done');
// }
// ls();