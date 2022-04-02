const { app, BrowserWindow } = require('electron');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });
  // win.loadFile('./dist/index.html') // 打包时使用
  win.loadURL('http://localhost:8000'); // 调试时使用
};

app.whenReady().then(() => {
  createWindow();
});
