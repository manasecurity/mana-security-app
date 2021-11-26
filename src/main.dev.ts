/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  Menu,
  nativeImage,
  Notification,
  Tray,
  autoUpdater,
  dialog,
  ipcMain,
} from 'electron';
import Store from 'electron-store';
import * as Sentry from '@sentry/electron';

import MenuBuilder from './menu';
import { fetchOsquerySnapshot } from './utils/osquery/osqueryiAsync';
import statusWriteAsync from './utils/persist/statusAsync';
import appsVulnsWriteAsync from './utils/persist/appsVulnsAsync';
import analyticsWriteAsync from './utils/persist/analyticsAsync';
import subscriptionWriteAsync from './utils/persist/subscriptionAsync';

Store.initRenderer();

Sentry.init({
  dsn: 'https://2b4d70e7f67044b6ad37646d4efe0a81@o934854.ingest.sentry.io/5993134',
});

if (process.env.NODE_ENV === 'production') {
  const server = 'https://slack.manasecurity.com';
  const url = `${server}/update/${process.platform}/${
    process.arch
  }/${app.getVersion()}`;
  app.setName('mana-macos');

  console.log(url);

  autoUpdater.setFeedURL({ url });
  autoUpdater.checkForUpdates();

  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 10 * 60 * 1000);

  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail:
        'A new version has been downloaded. Restart the application to apply the updates.',
    };
    dialog
      .showMessageBox(dialogOpts)
      .then((returnValue) => {
        if (returnValue.response === 0) {
          autoUpdater.quitAndInstall();
        }
        return 0;
      })
      .catch(() => {
        // return 0;
      });
  });

  autoUpdater.on('error', message => {
    console.error('There was a problem updating the application');
    console.error(message);
  });
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

let tray: Tray | null = null;

const createTray = () => {
  const icon = getAssetPath('icon.png'); // required.
  const trayicon = nativeImage.createFromPath(icon);
  tray = new Tray(trayicon.resize({ width: 16 }));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open app...',
      click: () => {
        app.dock.show();
        if (mainWindow === null) {
          createWindow();
        } else {
          mainWindow?.show();
          mainWindow?.focus();
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Quit Mana Security',
      click: () => app.quit(),
    },
  ]);

  tray.setContextMenu(contextMenu);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  if (!tray) {
    createTray();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    minHeight: 600,
    minWidth: 800,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      // backgroundThrottling: false,
    },
    titleBarStyle: 'hiddenInset',
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  ipcMain.on('vulns-notification', (event, message) => {
    const { title, body } = message;
    if (title && body) new Notification({ title, body }).show();
  });

  ipcMain.on('persist:update-status', (event, StatusSlice) => {
    statusWriteAsync(StatusSlice);
  });

  ipcMain.on('persist:update-apps-vulns', (event, appsVulnsSlice) => {
    appsVulnsWriteAsync(appsVulnsSlice);
  });

  ipcMain.on('persist:update-analytics', (event, analyticsSlice) => {
    analyticsWriteAsync(analyticsSlice);
  });

  ipcMain.on('persist:update-subscription', (event, subscriptionSlice) => {
    subscriptionWriteAsync(subscriptionSlice);
  });

  ipcMain.handle('osquery:fetch-apps', fetchOsquerySnapshot);

  ipcMain.on('url:open-buy-link', () =>
    shell.openExternal('https://buy.manasecurity.com')
  );

  ipcMain.on('url:send-email-to-support-no-activation-code', () => {
    const subject = encodeURIComponent('Activation code issue');
    const body = encodeURIComponent(`Hey guys,

I did not receive an activation code. Could you assist me on the matter?

Cheers,`);
    shell.openExternal(
      `mailto:help@manasecurity.com?subject=${subject}&body=${body}`
    );
  });

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    // if (process.env.START_MINIMIZED) {
    //   mainWindow.minimize();
    // } else {
    //   mainWindow.show();
    //   mainWindow.focus();
    // }
    setTimeout(() => {
      if (process.env.START_MINIMIZED) {
        mainWindow.minimize();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }, 500);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
};

console.log(`process.execPath: ${process.execPath}`);
app.setLoginItemSettings({
  openAtLogin: true,
});

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  // if (process.platform !== 'darwin') {
  //   app.quit();
  // }
  app.dock.hide(); // for macOS
  mainWindow?.hide();
});

// app.whenReady().then(createWindow).catch(console.log);
app
  .whenReady()
  .then(() => {
    createWindow();
    return true;
  })
  .catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  } else {
    mainWindow.show();
  }
});
