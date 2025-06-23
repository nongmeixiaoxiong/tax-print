import { join } from 'path'
import { execFile } from 'child_process'
import { platform } from 'os'

export class PdfConverter {
  private static getPdfToCairoPath(): string {
    const isDev = process.env.NODE_ENV === 'development'
    const basePath = isDev 
      ? join(__dirname, '../../node_modules') 
      : join(__dirname, '../node_modules')
    
    const currentPlatform = platform()
    const platformPath = currentPlatform === 'win32'
      ? join('pdf-poppler', 'lib', 'win', 'poppler-0.51', 'bin', 'pdftocairo.exe')
      : currentPlatform === 'darwin'
      ? join('pdf-poppler', 'lib', 'osx', 'poppler-0.62', 'bin', 'pdftocairo')
      : (() => {
          throw new Error(`不支持的操作系统: ${currentPlatform}`)
        })()

    return join(basePath, platformPath)
  }

  public static async convertPdfToJpeg(
    inputPDF: string,
    outputPrefix: string,
    dpi: string = '300'
  ): Promise<void> {
    const args = ['-jpeg', '-r', dpi, inputPDF, outputPrefix]
    
    return new Promise((resolve, reject) => {
      execFile(this.getPdfToCairoPath(), args, (error) => {
        if (error) {
          console.error('❌ 转换失败：', error)
          reject(error)
          return
        }
        console.log('✅ 转换完成！图片保存于：', outputPrefix)
        resolve()
      })
    })
  }
}
