const { exec } = require("child_process");

let tempts = 0;
function checkDatabase(command) {
  if (tempts > 10) return;
  exec(command, (err, stdout, stderr) => {
    console.log("err: ", err);
    console.log("stdout: ", stdout);
    console.log("stderr: ", stderr);
    if (err) {
      console.log("\nError\n\n");
      exec("docker-entrypoint.sh mysqld", (a, b, c) => console.log("Starting MySQL: ", a, b, c));
      return setTimeout(() => checkDatabase(command), 7000);
    }
    console.log("\nRunning\n\n");
    exec("npm run dev", (a, b, c) => console.log("Starting app: ", a, b, c));
  });
  tempts += 1;
}

checkDatabase("mysql -uclient -pclient-psw -e'select 1'");
