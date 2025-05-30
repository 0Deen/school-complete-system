const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');

let win;
let splash;
const server = 'http://localhost:3000/api/simba-systems/system/initialize'

const createWindow = () => {
    splash.close();

    win = new BrowserWindow({
        width: 1350,
        height: 800,
        show: false,
        center: true,
        titleBarStyle:'default',
        icon: path.join(__dirname, 'public', 'assets', 'logo', 'icon.png'),
        webPreferences: {
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
        },
    });

    win.loadFile(path.join(__dirname, 'public', 'html', 'common', 'login.html'));

    win.setMenu(null);

    win.once('ready-to-show', () => {
        win.show();
    });

    win.on('closed', () => {
        win = null;
    });
};

const createSplash = () => {
    splash = new BrowserWindow({
        width: 600,
        height: 300,
        frame: false,
        alwaysOnTop: true,
        transparent: true,
        center: true,
        resizable:false,
        icon: path.join(__dirname, 'public', 'assets', 'logo', 'icon.png'),
        webPreferences: {
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
        }
    });

    session.defaultSession.clearStorageData({
        storages: ['cookies']
    }).then(() => {
        console.log("Cookies cleared successfully.");
    }).catch((error) => {
        console.error("Error clearing cookies:", error);
    });

    splash.loadFile(path.join(__dirname, 'public', 'html', 'common', 'landing.html'));

    splash.webContents.on('did-finish-load', () => {
        splash.webContents.send('clear-local-storage');
    });
};

app.whenReady().then(() => {
    createSplash();
    setTimeout(createWindow, 3000);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('clear-local-storage', () => {
    splash.webContents.executeJavaScript('localStorage.clear();').then(() => {
        console.log('localStorage cleared');
    }).catch((error) => {
        console.error('Error clearing localStorage:', error);
    });
});