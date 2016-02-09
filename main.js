var path = require('path')
var BrowserWindow = require('browser-window')
var util = require('util')
var app = require('electron').app
var ipc = require('electron').ipcMain

process.on('uncaughtException', function (err) {
  console.error(err)
  console.error(err.stack)
  process.exit(1)
})

app.on('ready', function () {
  var win = new BrowserWindow({ height: 700, width: 1200 });
  win.loadURL('file://' + __dirname + '/renderer/index.html');
  ipc.on('mocha-done', function (event, code) {
    process.exit(code)
  });
  ipc.on('mocha-error', function (event, data) {
    process.stderr.write(util.format('\nError encountered in %s: %s\n%s',
      path.relative(process.cwd(), data.filename),
      data.message,
      data.stack))
    process.exit(1)
  });
})
