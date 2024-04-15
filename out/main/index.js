"use strict";
const electron = require("electron");
const utils = require("@electron-toolkit/utils");
const path = require("path");
const icon = path.join(__dirname, "../../resources/icon.png");
let mainWindow;
function createWindow$1() {
  mainWindow = new electron.BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../../src/renderer/pages/main/index.html"));
  }
}
function send(channel, ...args) {
  mainWindow.webContents.send(channel, ...args);
}
let controlWindow;
function createWindow() {
  controlWindow = new electron.BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  controlWindow.on("ready-to-show", () => {
    controlWindow.show();
    electron.desktopCapturer.getSources({ types: ["screen"] }).then(async (sources) => {
      controlWindow.webContents.send("set-source-id", sources[0].id);
    });
  });
  controlWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  controlWindow.loadFile(path.join(__dirname, "../../src/renderer/pages/control/index.html"));
}
function handleIPC() {
  electron.ipcMain.handle("login", async () => {
    let code = Math.floor(Math.random() * (999999 - 1e5)) + 1e5;
    return code;
  });
  electron.ipcMain.on("control", (e, remoteCode) => {
    send("control-state-change", remoteCode, 1);
    createWindow();
  });
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  electron.ipcMain.on("ping", () => console.log("pong"));
  createWindow$1();
  handleIPC();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow$1();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
