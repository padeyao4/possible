import {autoUpdater, UpdateInfo} from 'electron-updater';
import {dialog, ipcMain} from "electron";
import log from 'electron-log/main'
import {isDev} from "./util";

export function updater() {
  // 触发检查更新(此方法用于被渲染线程调用，例如页面点击检查更新按钮来调用此方法)
  ipcMain.handle('check-for-update', () => {
    log.info('触发检查更新');
    return autoUpdater.checkForUpdates()
  });

  // 设置自动下载为false(默认为true，检测到有更新就自动下载)
  autoUpdater.autoDownload = false;
  // 检测下载错误
  autoUpdater.on('error', (error) => {
    log.error('更新异常', error);
  });

  // 检测是否需要更新
  autoUpdater.on('checking-for-update', () => {
    log.info('正在检查更新……');
  });
  // 检测到可以更新时
  autoUpdater.on('update-available', (releaseInfo: UpdateInfo) => {
    log.info('检测到新版本，确认是否下载');
    const releaseNotes = releaseInfo.releaseNotes;
    let releaseContent = '';
    if (releaseNotes) {
      if (typeof releaseNotes === 'string') {
        releaseContent = <string>releaseNotes;
      } else {
        releaseNotes.forEach((releaseNote) => {
          releaseContent += `${releaseNote}\n`;
        });
      }
    } else {
      releaseContent = '暂无更新说明';
    }
    // 弹框确认是否下载更新（releaseContent是更新日志）
    dialog
      .showMessageBox({
        type: 'info',
        title: '应用有新的更新',
        detail: releaseContent,
        message: '发现新版本，是否现在更新？',
        buttons: ['否', '是']
      })
      .then(({response}) => {
        if (response === 1) {
          // 下载更新
          autoUpdater.downloadUpdate().then(r => log.debug(r));
        }
      });
  });
  // 检测到不需要更新时
  autoUpdater.on('update-not-available', () => {
    log.info('现在使用的就是最新版本，不用更新');
  });
  // 更新下载进度
  autoUpdater.on('download-progress', (progress) => {
    log.info('下载进度', progress);
  });
  // 当需要更新的内容下载完成后
  autoUpdater.on('update-downloaded', () => {
    log.info('下载完成，准备更新');
    dialog
      .showMessageBox({
        title: '安装更新',
        message: '更新下载完毕，应用将重启并进行安装'
      })
      .then(() => {
        // 退出并安装应用
        setImmediate(() => autoUpdater.quitAndInstall());
      });
  });
}

export function systemCaller() {
  ipcMain.handle('possible-version', () => {
    return 'undo'
  });
  ipcMain.handle('is-dev', () => {
    return isDev()
  })
}
