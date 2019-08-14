const electron = require("electron");
const url = require("url");
const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;
let modifyWindow;

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

function createModifyWindow(){
  modifyWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    width: 300,
    height: 200,
    title: "Modify items"
  });
  //load html file into window
  modifyWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "modifyWindow.html"),
      protocol: "file:",
      slashes: true
    })
  );

  modifyWindow.on("close", function() {
    modifyWindow = null;
  }); 
}

//Catch add:open
ipcMain.on("add:open", function(e, item) {
  createAddWindow();
  setTimeout(function() {
    addWindow.webContents.send("add:open", item);
  }, 1000); //TODO: Fix so it is done synchronously
});

//Catch remove:open

ipcMain.on("remove:open", function(e, item) {
  createModifyWindow();
  setTimeout(function() {
    modifyWindow.webContents.send("remove:open", item);
  }, 1000); //TODO: Fix so it is done synchronously
})

//Catch price:open
ipcMain.on("price:open", function(e, item) {
  createModifyWindow();
  setTimeout(function() {
    modifyWindow.webContents.send("price:open", item);
  }, 1000); //TODO: Fix so it is done synchronously
})





//Catch item:add
ipcMain.on("item:add", function(e, item) {
  addItem(item);
  mainWindow.webContents.send("item:add", item);
  addWindow.close();
});

//Catch item:remove
ipcMain.on("item:remove", function(e, item){
  removeItem(item);
  mainWindow.webContents.send("item:remove", item);
  modifyWindow.close();
})


//Catch item:price
ipcMain.on("item:price", function(e, item){
  priceItem(item);
  mainWindow.webContents.send("item:price", item);
  modifyWindow.close();
})


//Adding item to js file
function addItem(item) {
  exec("py adder.py " + item[0] + " " + item[1] + " " + item[2] + " " + item[3] + " " + item[4]);
}

//Removing item from js file
function removeItem(item){
  exec("py remove.py " + item[0] + " " + item[1]);
}

//Changing item price from js file
function priceItem(item){
  exec("py price.py " + item[0] + " " + item[1] + " " + item[2]);
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
