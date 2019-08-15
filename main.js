const electron = require("electron");
const url = require("url");
const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs");


const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;
let modifyWindow;
let commitWindow;
const { dialog } = require('electron');


//Listen for app to be ready

app.on("ready", function() {
  //Create new window
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });

  setTimeout(() => {
    if (fs.existsSync('./kigaruweb')) {
      mainWindow.webContents.send("filesExist");
    }else{
      mainWindow.webContents.send("filesDontExist");
    }
  }, 1000) //FIX

  

  //load html file into window
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "mainWindow.html"),
      protocol: "file:",
      slashes: true
    })
    ); //same as passing in file://dirname/mainWindow.html
    
    mainWindow.on('close', function(event) { //   <---- Catch close event
      event.preventDefault();

      // The dialog box below will open, instead of your app closing.
      dialog.showMessageBox({
          message: "Are you sure you want to quit? All changes will be discarded",
          buttons: ["Yes", "No"]
      }, (response) => {
        if(response === 0)
        {
          unsaveQuit();
        }
      });
    });
  //build menu from template

  // const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  //insert menu
  // Menu.setApplicationMenu(mainMenu);

  //Quit everything when close
  mainWindow.on("closed", () => {
    app.exit();
  });
});

async function unsaveQuit(){
  await exec('cd kigaruweb && git reset --hard HEAD');
  app.exit();
}

//Handle creating a new window

function createAddWindow() {
  addWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    width: 800,
    height: 500,
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
    width: 800,
    height: 300,
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


function openCommitWindow(){
  commitWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    width: 800,
    height: 300,
    title: "Save Message",
    frame: false
  });
  //load html file into window
  commitWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "commitWindow.html"),
      protocol: "file:",
      slashes: true
    })
  );

  commitWindow.on("close", function() {
    commitWindow = null;
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


//Catch description:open
ipcMain.on("description:open", function(e, item) {
  createModifyWindow();
  setTimeout(function() {
    modifyWindow.webContents.send("description:open", item);
  }, 1000); //TODO: Fix so it is done synchronously
})


//Catch picture:open
ipcMain.on("picture:open", function(e, item) {
  createModifyWindow();
  setTimeout(function() {
    modifyWindow.webContents.send("picture:open", item);
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

//Catch item:description
ipcMain.on("item:description", function(e, item){
  descItem(item);
  mainWindow.webContents.send("item:description", item);
  modifyWindow.close();
})




//Catch final submit
ipcMain.on('finalSubmit', function(){
  let options = {
    buttons: ["Yes", "No", "Cancel"],
    message: "Are you sure you want to save and deploy the changes you made to the website? (Click simulate to check what your changes will look like)"
  }
  dialog.showMessageBox(options, (response) => {
    if(response === 0)
    {
      openCommitWindow();
    }
  })
})


//deploy function

async function deploy(item){
  await exec('cd kigaruweb && git add src && git commit -m "' + item);
  await exec('cd kigaruweb && git push');
  await exec('cd kigaruweb && npm run deploy');
  let options = {
    buttons: ["Ok"],
    message: "Deployed! The webpage should be updated within the next ~5 minutes"
  }
  dialog.showMessageBox(options, (reponse) => {
    mainWindow.close();
  });}

//blank commit message handle
ipcMain.on("blankCommit", function(){
  let options = {
    buttons: ["Ok"],
    message: "Please enter a save message"
  }
  dialog.showMessageBox(options);
})

//deploy handle
ipcMain.on("commitMessage", function(e, item){
  commitWindow.close();
  let options = {
    buttons: ["Ok"],
    message: "Deploying! This may take a while. Another pop up will pop up when page is deployed. DO NOT close the main window"
  }
  dialog.showMessageBox(options);
  deploy(item);
  
})

//Adding item to js file
function addItem(item) {
  exec("python adder.py " + item[0] + " " + item[1] + " " + item[2] + " " + item[3] + " " + item[4]);
}

//Removing item from js file
function removeItem(item){
  exec("python remove.py " + item[0] + " " + item[1]);
}

//Changing item price from js file
function priceItem(item){
  exec("python price.py " + item[0] + " " + item[1] + " " + item[2]);
}

//Changing item description from js file
function descItem(item){
  exec("python description.py " + item[0] + " " + item[1] + " " + item[2]);
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
