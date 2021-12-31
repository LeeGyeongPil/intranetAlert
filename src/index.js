const { app, BrowserWindow } = require('electron');
const { Menu, Tray } = require('electron');
const path = require('path');
const MsgCheck = require('./MsgCheck');
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let tray;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  tray = new Tray(path.join(__dirname, 'favicon.png')); 
  const myMenu = Menu.buildFromTemplate([
    {
      label: 'exit',
      type: 'normal',
      click: ()=>{ app.quit(); }
    }
  ])
  tray.setToolTip('IntranetMessageAlart')
  tray.setContextMenu(myMenu)

  setInterval(() => { MsgCheck.parser(); }, 30000)
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
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
