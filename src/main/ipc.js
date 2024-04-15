import { ipcMain } from 'electron'
import { send as sendMainWindow } from './windows/main'
import { createWindow as createControlWindow } from './windows/control'

export function handleIPC() {
  ipcMain.handle('login', async () => {
    let code = Math.floor(Math.random() * (999999 - 100000)) + 100000
    return code
  })

  ipcMain.on('control', (e, remoteCode) => {
    sendMainWindow('control-state-change', remoteCode, 1)
    createControlWindow()
  })
}
