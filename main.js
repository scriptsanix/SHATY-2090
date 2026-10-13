const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let janela;
let resizeStart = null;

function criarJanela() {
  janela = new BrowserWindow({
    width: 420,
    height: 720,
    minWidth: 340,
    minHeight: 500,
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    hasShadow: false,
    resizable: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  janela.loadFile("index.html");
  janela.on("closed", () => {
    janela = null;
    resizeStart = null;
  });
}

app.whenReady().then(() => {
  criarJanela();

  ipcMain.on("janela:minimizar", () => {
    janela?.minimize();
  });

  ipcMain.on("janela:fechar", () => {
    janela?.close();
  });

  ipcMain.on("janela:redimensionar-iniciar", (event, point) => {
    if (!janela || janela.isDestroyed()) return;
    const [x, y] = janela.getPosition();
    const [width, height] = janela.getSize();
    resizeStart = {
      mouseX: point.x,
      mouseY: point.y,
      x,
      y,
      width,
      height
    };
  });

  ipcMain.on("janela:redimensionar-mover", (event, point) => {
    if (!janela || janela.isDestroyed() || !resizeStart) return;
    const deltaX = point.x - resizeStart.mouseX;
    const deltaY = point.y - resizeStart.mouseY;
    const width = Math.max(340, resizeStart.width + deltaX);
    const height = Math.max(500, resizeStart.height + deltaY);
    janela.setBounds({
      x: resizeStart.x,
      y: resizeStart.y,
      width,
      height
    });
  });

  ipcMain.on("janela:redimensionar-fim", () => {
    resizeStart = null;
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      criarJanela();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
