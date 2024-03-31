const path = require("path");
const mkdirp = require("mkdirp");
const { exec, spawn } = require("child_process");

const scriptPath = path.join(__dirname, "uploads/nand-flash");

console.log(scriptPath);

// exec(`uuu -v ${scriptPath}`, (error, stdout, stderr) => {
//     if (error) {
//         console.error(`exec error: ${error}`);
//         return;
//     }
//     console.log(`stderr: ${stderr}`);
//     console.log(`stdout: ${stdout}`);
// });

const child = spawn("uuu", ["-v", scriptPath]);

child.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

child.stderr.on("data", (data) => {
  console.log(`stderr: ${data}`);
});

child.on("exit", (code, signal) => {
  console.log(`Child process exited with code ${code}`);
});

child.on("error", (error) => {
  console.error(`Failed to start subprocess. ${error}`);
});

// child.on("close", (code) => {
//   console.log(`Child process exited with code ${code}`);
// });

child.on("disconnect", () => {
  console.log("Child process disconnected");
});

child.on("message", (message, sendHandle) => {
  console.log(`Child process message: ${message}`);
});
