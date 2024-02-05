const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const robot = require('robotjs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 375,
    height: 350,
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
app.on('ready', createWindow);

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
let autoClickInterval;

let isMouseButtonHold;
let holdMouseButton;

ipcMain.handle('start-autoclick', (req, data) => {
  if (!data || !data.input || !data.type || !data.repeat) return;
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
  if (!isMouseButtonHold){
    autoClickInterval = setInterval(buttonClick, interval, repeat);
  }
}

let currentNumber = 0;

let isProcessing = false;

function mouseButtonClick(input, type, repeat) {
  if (!isProcessing && repeat !== 'loop' && currentNumber < repeat) {
    isProcessing = true; // Set the flag to indicate that the function is processing
    currentNumber++;
    console.log(currentNumber);
    
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
    
    isProcessing = false; // Reset the flag when the function is done processing
  } else if (currentNumber >= repeat) {
    clearInterval(autoClickInterval);
    currentNumber = 0;
    mainWindow.webContents.send('autoclick-stopped', { success: true });
  }
}
