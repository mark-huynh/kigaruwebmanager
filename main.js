const electron = require("electron");
const url = require("url");
const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

//Listen for app to be ready

app.on("ready", function() {
  //Create new window
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });
  //load html file into window
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "mainWindow.html"),
      protocol: "file:",
      slashes: true
    })
  ); //same as passing in file://dirname/mainWindow.html

  //build menu from template

  // const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  //insert menu
  // Menu.setApplicationMenu(mainMenu);

  //Quit everything when close
  mainWindow.on("closed", () => {
    app.quit();
  });
});

//Handle creating a new window

function createAddWindow() {
  addWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    width: 300,
    height: 200,
    title: "Add Menu item"
  });
  //load html file into window
  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "addWindow.html"),
      protocol: "file:",
      slashes: true
    })
  );

  addWindow.on("close", function() {
    addWindow = null;
  });
}

//Catch add:open
ipcMain.on("add:open", function(e, item) {
  createAddWindow();
  setTimeout(function() {
    addWindow.webContents.send("add:open", item);
  }, 1000); //TODO: Fix so it is done synchronously
});

//Catch item:add
ipcMain.on("item:add", function(e, item) {
  addItem(item);
  mainWindow.webContents.send("item:add", item);
  addWindow.close();
});

//Adding item to js file
async function addItem(item) {
//   exec("py test.py " + item[0] + " " + item[1] + " " + item[2]);
}

const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Add Item",
        click() {
          createAddWindow();
        }
      },
      {
        label: "Remove Item"
      },
      {
        label: "Quit",
        accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        }
      }
    ]
  }
];
