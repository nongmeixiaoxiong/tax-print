import styles from './fileloader.module.scss'
import { useDataContext } from '@renderer/contexts/DataContext'

function FileLoader(): React.JSX.Element {
  const { state, dispatch } = useDataContext()

  const selectPdfs = async () => {
    const imgPaths = await window.api.selectDirectory()
    console.log('imgPaths', imgPaths)
    dispatch({
      type: 'setImages',
      payload: imgPaths
    })
  }



  return (
    <div className={styles.context}>
      
        <div className={styles.btBox}>
          <button className={styles.selectDirBtn} onClick={selectPdfs}>选择目录</button>
        </div>
        <ul className={styles.imgBoxs}>
          {state.images?.map((path) => {
            return <li key={path}>
              <img src={`taximage://${path}`} alt={path}></img></li>
          })}
        </ul>
      </div>
    
  )
}

export default FileLoader
