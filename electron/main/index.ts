import { app, BrowserWindow, globalShortcut, ipcMain, Menu, shell, Tray } from 'electron';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import Store from 'electron-store';

// 消除安全告警
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const store = new Store() as any;

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, '../..');

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;
const preload = path.join(__dirname, '../preload/index.mjs');
const indexHtml = path.join(RENDERER_DIST, 'index.html');

// 隐藏菜单栏
Menu.setApplicationMenu(null);

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: path.join(process.env.VITE_PUBLIC, 'icon.png'),
    titleBarStyle: 'hidden',
    width: 850,
    height: 600,
    minWidth: 620,
    minHeight: 450,
    titleBarOverlay: {
      color: 'rgba(0,0,0,0)',
      height: 35
    },
    webPreferences: {
      preload
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    }
  });

  if (VITE_DEV_SERVER_URL) {
    // #298
    win.loadURL(VITE_DEV_SERVER_URL).then();
    // Open devTool if the app is not packaged
    // win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml).then();
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}

let tray = null;

app
  .whenReady()
  .then(() => {
    globalShortcut.register('Ctrl+Shift+I', () => {
      win.webContents.openDevTools();
    });
  })
  .then(createWindow)
  .then(() => {
    win.on('close', (e) => {
      e.preventDefault();
      win?.hide();
    });
  })
  .then(() => {
    const icon = path.join(process.env.VITE_PUBLIC, '32x32.png');
    tray = new Tray(icon);
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '打开',
        click: () => {
          if (win.isMinimized()) win.restore();
          if (!win.isVisible()) win.show();
          win.focus();
        }
      },
      {
        label: '退出',
        click: () => {
          app.exit(0);
        }
      }
    ]);
    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
      if (win.isMinimized()) win.restore();
      if (!win.isVisible()) win.show();
      win.focus();
    });
  });

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow().then();
  }
});

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`).then();
  } else {
    childWindow.loadFile(indexHtml, { hash: arg }).then();
  }
});

ipcMain.on('set-value', (_, arg) => {
  console.log('set-value', arg);
  store.set(arg.key, arg.value);
  store.openInEditor().then();
});

ipcMain.handle('get-value', (_, arg) => {
  console.log('get-value', store.get(arg.key));
  return store.get(arg.key);
});

ipcMain.handle('get-store-path', () => {
  return app.getPath('userData');
});
