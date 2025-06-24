import { app, shell, BrowserWindow, ipcMain, dialog, protocol, net } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { PdfConverter } from './utils/pdfConverter'
import fs from 'fs'


// 注册安全协议
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'taximage',
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: true,
      corsEnabled: true
    }
  }
])

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
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

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // 传入URL taximage://c/Users/90309/Desktop/%E5%8F%91%E7%A5%A8/covimages/260-1.jpg
  // 正常的file协议URL file:///C:/Users/90309/Desktop/发票/covimages/260-1.jpg
  protocol.handle('taximage', (request) => {
    let filePath = request.url.replace('taximage://', '')
    // 修复Windows路径格式
    if (process.platform === 'win32') {
      // 处理盘符
      filePath = filePath.replace(/^([a-zA-Z])/, '$1:')
      filePath = filePath.replace(/\//g, '\\')
    }
    return net.fetch(`file://${filePath}`)
  })

})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.



ipcMain.handle('select-directory', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  if (canceled) {
    return []
  }

  console.log('filePaths', filePaths)

  const dirPath = filePaths[0]
  // 输出图片目录
  const imgDirPath = join(dirPath, 'covimages')
  if (!fs.existsSync(imgDirPath)) {
    fs.mkdirSync(imgDirPath)
  } else {
    fs.readdirSync(imgDirPath).forEach(file => {
      fs.unlinkSync(join(imgDirPath, file))
    })
  }

  // 遍历 pdf 文件，转为发票图片
  const pdfs = fs.readdirSync(dirPath).filter(file => file.endsWith('.pdf'))
  await Promise.all(pdfs.map(async pdf => {
    const inputPDF = join(dirPath, pdf)
    const outputPrefix = join(imgDirPath, pdf.replace('.pdf', ''))
    try {
      await PdfConverter.convertPdfToJpeg(inputPDF, outputPrefix)
    } catch (error) {
      console.error('PDF转换出错:', error)
    }
  }))
  console.log('imgDirPath', imgDirPath)
  // 遍历输出目录，获取图片路径
  const imgPaths = fs.readdirSync(imgDirPath).map(file => join(imgDirPath, file))
  console.log('imgPaths', imgPaths)
  return imgPaths
})


// 另存为pdf文件
ipcMain.handle('print-to-pdf', async (event,options) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  if (canceled) {
    return
  }

  const {direction} = options

  const outputPDF = join(filePaths[0], 'output.pdf')
  try {
    // 新建一个窗口
    const win = BrowserWindow.getFocusedWindow()
    const pdfData = await win?.webContents.printToPDF({
      printBackground: true,
      landscape: direction == 1 ? false : true,
      pageSize: 'A4',
      margins: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      },
    })
    fs.writeFileSync(outputPDF, pdfData!)
  } catch (error) {
    console.error('PDF转换出错:', error)
  }
})
