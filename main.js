const { app, BrowserWindow, Menu, dialog, Notification, nativeTheme } = require('electron');
const path = require('path');
const fs = require('fs');
const dns = require('dns');

let mainWindow;
let isConnected = null;

// Forzar modo oscuro
nativeTheme.themeSource = 'dark';

function createWindow() {
  const isDev = !app.isPackaged;

  const iconPath = isDev
    ? path.join(__dirname, 'public', 'escarapela.ico')
    : path.join(process.resourcesPath, 'escarapela.ico');

  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    icon: iconPath,
    backgroundColor: 'black',  // fondo oscuro
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  mainWindow.loadURL('https://iestv-tuc.infd.edu.ar/aula/acceso.cgi');

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.executeJavaScript(`window.customCSS.applyStyle();`);

    // Inyectar CSS para modo oscuro
    const darkCssPath = path.join(__dirname, 'dark-mode.css');
    if (fs.existsSync(darkCssPath)) {
      const css = fs.readFileSync(darkCssPath, 'utf8');
      mainWindow.webContents.insertCSS(css);
    }

    checkConnectionPeriodically();
  });

  mainWindow.webContents.on('did-finish-load', () => {
    const cssPath = path.join(__dirname, 'modern.css');
    if (fs.existsSync(cssPath)) {
      const css = fs.readFileSync(cssPath, 'utf8');
      mainWindow.webContents.insertCSS(css);
    } else {
      console.warn('No se encontró modern.css');
    }
  });

  const menuTemplate = [
    {
      label: 'Archivo',
      submenu: [
        {
          label: 'Versión',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Versión de la App',
              message: 'Versión 0.0.2 - Mejora en detección de conexión, notificaciones automáticas y modo oscuro',
              buttons: ['OK'],
              icon: iconPath
            });
          }
        },
        { type: 'separator' },
        { role: 'quit', label: 'Salir' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

function checkInternetConnection(callback) {
  dns.lookup('google.com', (err) => {
    if (err && err.code === "ENOTFOUND") {
      callback(false);
    } else {
      callback(true);
    }
  });
}

function showNotification(title, body) {
  new Notification({ title, body }).show();
}

function checkConnectionPeriodically() {
  checkInternetConnection((connected) => {
    if (connected !== isConnected) {
      isConnected = connected;
      if (connected) {
        showNotification('Conexión', 'Conectado a internet');
      } else {
        showNotification('Conexión', 'Sin conexión a internet');
      }
    }
  });

  setTimeout(checkConnectionPeriodically, 10000);
}

app.setPath('userData', path.join(__dirname, 'userdata'));

app.whenReady().then(createWindow);
