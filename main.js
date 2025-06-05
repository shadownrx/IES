const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  const isDev = !app.isPackaged;

  // Ruta al icono: en dev usa __dirname, en prod usa resourcesPath
  const iconPath = isDev
    ? path.join(__dirname, 'public', 'escarapela.ico')
    : path.join(process.resourcesPath, 'escarapela.ico');

  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  mainWindow.loadURL('https://iestv-tuc.infd.edu.ar/aula/acceso.cgi');

  mainWindow.webContents.on('did-finish-load', () => {
  mainWindow.webContents.executeJavaScript(`window.customCSS.applyStyle();`);
});

  // Inyectar CSS moderno cuando la página carga
  mainWindow.webContents.on('did-finish-load', () => {
    const cssPath = path.join(__dirname, 'modern.css');
    if (fs.existsSync(cssPath)) {
      const css = fs.readFileSync(cssPath, 'utf8');
      mainWindow.webContents.insertCSS(css);
    } else {
      console.warn('No se encontró modern.css');
    }
  });

  // Menú personalizado
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
              message: 'Versión 0.0.1 - Edición Especial',
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

app.setPath('userData', path.join(__dirname, 'userdata'));

app.whenReady().then(createWindow);
