import { shell, BrowserWindow, desktopCapturer } from 'electron'
import { join } from 'path'

import icon from '../../../resources/icon.png?asset'

let controlWindow

export function createWindow() {
  // Create the browser window.
  controlWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  controlWindow.on('ready-to-show', () => {
    controlWindow.show()

    desktopCapturer.getSources({ types: ['screen'] }).then(async (sources) => {
      // for (const source of sources) {
      //   console.log(sources)
      controlWindow.webContents.send('set-source-id', sources[0].id)
      // }
    })
  })

  controlWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.

  controlWindow.loadFile(join(__dirname, '../../src/renderer/pages/control/index.html'))
}
