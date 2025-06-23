import styles from './fileloader.module.scss'
import { useDataContext } from '@renderer/contexts/DataContext'

function FileLoader(): React.JSX.Element {
  const {state,dispatch} = useDataContext()

  const selectPdfs = async ()=>{
    const pdfPaths = await window.api.selectDirectory()
    console.log('pdfPaths',pdfPaths)
    
  }



  return (
    <div className={styles.context}>
      <div>
        <button className={styles.selectDirBtn} onClick={selectPdfs}>选择目录</button>
        <ul id="fileList">
          {state.filePaths?.map((path)=>{
            return <li key={path}>{path}</li>
          })}
        </ul>
      </div>
    </div>
  )
}

export default FileLoader
