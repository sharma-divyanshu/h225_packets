var exec = require('child_process').exec;
function hell(){
  exec(cmd, function(error, stdout, stderr) {
                console.log(stdout)
            });
}
