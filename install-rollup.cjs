const os = require("os");

if (os.platform() === "linux") {
  const { exec } = require("child_process");

  exec("npm install @rollup/rollup-linux-x64-gnu", (error, stdout, stderr) => {
    if (error) {
      console.error("Failed to install rollup-linux binary:", stderr);
    } else {
      console.log("Successfully installed rollup-linux binary");
    }
  });
} else {
  console.log("Skipping rollup-linux install on non-Linux platform.");
}
