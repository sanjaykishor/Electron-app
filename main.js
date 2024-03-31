const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const tar = require("tar");
const path = require("path");
const mkdirp = require("mkdirp");
const { spawn } = require("child_process");

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "./preload.js"),
    },
  });

  mainWindow.loadFile("./views/home/index.html");

  mainWindow.webContents.openDevTools();

  ipcMain.on("file-upload", (event, filePath) => {
    if (!filePath.endsWith(".tar.gz")) {
      console.log("Invalid file type");
      mainWindow.webContents.send(
        "upload-error",
        "Please upload a .tar.gz file."
      );
      return;
    }

    if (fs.existsSync(path.join(__dirname, "uploads"))) {
      fs.rmdirSync(path.join(__dirname, "uploads"), { recursive: true });
    }

    if (!fs.existsSync(path.join(__dirname, "uploads"))) {
      mkdirp.sync(path.join(__dirname, "uploads"));
    }

    // Extract the tar.gz file
    tar
      .extract({
        file: filePath,
        cwd: path.join(__dirname, "uploads"),
      })
      .then(() => {
        // Check if uuu.auto script exists
        console.log("Extracted tar.gz file");
        const scriptPath = path.join(
          __dirname,
          "uploads/nand-flash",
          "uuu.auto"
        );
        if (!fs.existsSync(scriptPath)) {
          mainWindow.webContents.send(
            "upload-error",
            "uuu.auto script not found."
          );
          return;
        }

        mainWindow.webContents.send("upload-success", "Extracted tar.gz file");
      })
      .catch((error) => {
        event.sender.send("upload-error", error.message);
      });
  });

  ipcMain.on("start-flashing", () => {
    const scriptPath = path.join(__dirname, "uploads/nand-flash");
    mainWindow.webContents.send("progress-update", 0);

    console.log("Starting flashing");
    mainWindow.webContents.send("progress-update", 0.1);
    executeScript(scriptPath);
  });

  ipcMain.on("login", (event, username, password) => {
    console.log("Username:", username);
    console.log("Password:", password);

    if (username === "admin" && password === "admin") {
      mainWindow.webContents.send("login-success", "Login successful");
    } else {
      mainWindow.webContents.send("login-error", "Invalid username or password");
    }
    
  });

  function executeScript(scriptPath) {
    console.log("Executing script:", scriptPath);

    const child = spawn("uuu", ["-v", scriptPath]);

    // test
    setTimeout(()=>mainWindow.webContents.send("progress-update", 1), 5000);
    setTimeout(()=> mainWindow.webContents.send("flashing-success", "completed"), 10000); 

    child.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);

      if (data.toString().includes("done")) {
        mainWindow.webContents.send("progress-update", 1);
        setTimeout(()=> mainWindow.webContents.send("flashing-success", data.toString()), 500); 
      }
    });

    child.stderr.on("data", (data) => {
      console.log(`stderr: ${data}`);
      mainWindow.webContents.send("flash-err", data.toString());
    });

    child.on("exit", (code, signal) => {
      console.log(`Child process exited with code ${code}`);
    });

    child.on("error", (error) => {
      console.error(`Failed to start subprocess. ${error}`);
    });

    child.on("close", (code) => {
      console.log(`Child process exited with code ${code}`);
    });

    child.on("disconnect", () => {
      console.log("Child process disconnected");
    });

    child.on("message", (message, sendHandle) => {
      console.log(`Child process message: ${message}`);
    });
  }
}

app.whenReady().then(createMainWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
