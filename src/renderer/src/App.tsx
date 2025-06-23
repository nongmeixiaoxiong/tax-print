import FileLoader from "./components/FileLoader/FileLoader"
import A4Page from "./components/A4Page/A4Page"
import Setting from "./components/Setting/Setting"
import styles from './app.module.scss'


function App(): React.JSX.Element {

  return (
    <div  className={styles.app}>
      <div className={styles.file_loader}>
        <FileLoader />
      </div>
      <div className={styles.a4_page}>
        <A4Page />
      </div>
      <div className={styles.setting}>
        <Setting />
      </div>
    </div>
  )
}

export default App
