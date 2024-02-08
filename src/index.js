const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const robot = require('robotjs');
const fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;
let running = false;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 425,
    height: 425,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  checkSettings();
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

function checkSettings(){
  if (fs.existsSync('settings.json')){
    return;
  } else {
    createDefaultSettings();
  }
}

app.whenReady().then(() => {
  // Register a global shortcut for F9
  globalShortcut.register('F9', () => {
    // Check the running state and perform actions accordingly
    if (!running) {
      running = true;
      mainWindow.webContents.send('background-hotkeys', { start: true });
    } else {
      mainWindow.webContents.send('background-hotkeys', { start: false });
      running = false;
    }
  });

  // Check for F9 shortcut even when the app is in the background
  app.on('browser-window-blur', () => {
    globalShortcut.register('F9', () => {
      if (!running) {
        running = true;
        mainWindow.webContents.send('background-hotkeys', { start: true });
      } else {
        mainWindow.webContents.send('background-hotkeys', { start: false });
        running = false;
      }
    });
  });

  // Unregister the global shortcut when the app is about to quit
  app.on('will-quit', () => {
    // Unregister the shortcut
    globalShortcut.unregister('F9');
    // Unregister the 'browser-window-blur' event
    app.removeAllListeners('browser-window-blur');
  });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
function createDefaultSettings() {
  const settings = {
    button: 'left',
    startDelayEnabled: 'false',
    startDelayTime: '1000',
    clickType: 'single',
    repeatEnabled: 'false',
    repeatCount: '1',
    alwaysOnTop: 'false',
    loop: 'true',

    interval: {
      hours: '0',
      minutes: '0',
      seconds: '0',
      milliseconds: '0',
    },
  };

  // Convert JavaScript object to JSON string
  const jsonString = JSON.stringify(settings, null, 2);

  // Write JSON string to a file (adjust the path as needed)
  fs.writeFileSync('settings.json', jsonString);

  console.log('Default settings file created successfully.');
}



let autoClickInterval;

let isMouseButtonHold;
let holdMouseButton;

ipcMain.handle('start-autoclick', (req, data) => {
  if (!data || !data.input || !data.type || !data.repeat) return;
  mouseButtonClick(data.input, data.type, data.repeat);
  startAutoClick(() => mouseButtonClick(data.input, data.type, data.repeat), data.interval);
});

ipcMain.handle('stop-autoclick', () => {
  if (isMouseButtonHold === true){
    robot.mouseToggle('up', holdMouseButton);
    isMouseButtonHold = false;
  }
  clearInterval(autoClickInterval);
});

function startAutoClick(buttonClick, interval, repeat){
  running = true;
  if (!isMouseButtonHold){
    autoClickInterval = setInterval(buttonClick, interval, repeat);
  }
}

let currentNumber = 0;

function mouseButtonClick(input, type, repeat) {
  switch (repeat){
    case 'loop':
      isProcessing = true;
      mouseButtonTypeInputs(input, type);  
      break;
    default:
      const repeatCount = parseInt(repeat);
      if (currentNumber < repeatCount){
        currentNumber++;
        mouseButtonTypeInputs(input, type);
      } else if (currentNumber === repeatCount) {
        if (isMouseButtonHold === true){
          robot.mouseToggle('up', holdMouseButton);
          isMouseButtonHold = false;
        }
        clearInterval(autoClickInterval);
        currentNumber = 0;
        running = false;
        mainWindow.webContents.send('autoclick-stopped', { success: true });
      }
      break;
  }
}


function mouseButtonTypeInputs(input, type){
  switch (type) {
    case 'single':
      robot.mouseClick(input);
      break;
    case 'double':
      robot.mouseClick(input);
      robot.mouseClick(input);
      break;
    case 'hold':
      isMouseButtonHold = true;
      holdMouseButton = input;
      robot.mouseToggle('down', input);
      break;
  }  
}

ipcMain.handle('always-on-top-handler', (req, data) => {
  if (!data) return;
  mainWindow.setAlwaysOnTop(data.request);
});

