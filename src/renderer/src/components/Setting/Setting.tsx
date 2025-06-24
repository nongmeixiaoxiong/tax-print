import styles from './Setting.module.scss'
import classNames from 'classnames'
import { useDataContext } from '@renderer/contexts/DataContext'

interface LayoutItemProps {
  layout:{row:number,col:number,imgNum:number},
  className?:string,
  onClick?:() => void
}
// 纵向布局
function ColLayoutItem(props:LayoutItemProps):React.JSX.Element{
   const gridStyle = {
    gridTemplateRows:`repeat(${props.layout.row},1fr)`,
    gridTemplateColumns:`repeat(${props.layout.col},1fr)`,
    placeItems:'center'
  }
  console.log('props',props)
  // 在纵向，1*1，单图片时候，限制图片高度为50%，否则占满
  const taxBoxStyle = props.layout.row === 1 && props.layout.col === 1 && props.layout.imgNum === 1 ? {width:'100%',height:'50%'} : {width:'100%',height:'100%'}
  return <div className={classNames(styles.layoutItem,styles.colLayout,props.className)} style={gridStyle} onClick={props.onClick} >
   {Array.from({length:props.layout.imgNum}).map((_,index) => {
    return <div key={index} className={styles.taxBox} style={taxBoxStyle}>发票</div>
   })}
  </div>
}

// 横向布局
function RowLayoutItem(props:LayoutItemProps):React.JSX.Element{
   const gridStyle = {
    gridTemplateRows:`repeat(${props.layout.row},1fr)`,
    gridTemplateColumns:`repeat(${props.layout.col},1fr)`,
    placeItems:'center'
  }
  // 在横向，1*2，单图片时候，限制图片宽度为50%，否则占满
  const taxBoxStyle = props.layout.row === 1 && props.layout.col === 2 && props.layout.imgNum === 2 ? {width:'100%',height:'50%'} : {width:'100%',height:'100%'}

  return <div className={classNames(styles.layoutItem,styles.rowLayout,props.className)} style={gridStyle} onClick={props.onClick} >
   {Array.from({length:props.layout.imgNum}).map((_,index) => {
    return <div key={index} className={styles.taxBox} style={taxBoxStyle}>发票</div>
   })}
  </div>
}

interface LayoutProps {
  direction:number,
  layout:{row:number,col:number,imgNum:number},
  onChange:(type:{row:number,col:number,imgNum:number}) => void
}
function Layout(props:LayoutProps):React.JSX.Element{
  const {direction,layout,onChange} = props
  if(direction === 1){
    // 纵向
    return <div className={styles.layoutBoxs}> {[
      {layout:{row:1,col:1,imgNum:1}},
      {layout:{row:2,col:1,imgNum:1}},
      {layout:{row:2,col:1,imgNum:2}},
    ].map((item) => {
      return <ColLayoutItem layout={item.layout}  className={layout.row === item.layout.row && layout.col === item.layout.col && layout.imgNum === item.layout.imgNum ? styles.active : ''} onClick={()=>{onChange({row:item.layout.row,col:item.layout.col,imgNum:item.layout.imgNum})}} />
    })}</div>
  }else{
    // 横向
    return <div className={styles.layoutBoxs}> {[
      {layout:{row:1,col:1,imgNum:1}},
      {layout:{row:1,col:2,imgNum:2}},
      {layout:{row:2,col:2,imgNum:4}},
    ].map((item) => {
      return <RowLayoutItem layout={item.layout}  className={layout.row === item.layout.row && layout.col === item.layout.col && layout.imgNum === item.layout.imgNum ? styles.active : ''} onClick={()=>{onChange({row:item.layout.row,col:item.layout.col,imgNum:item.layout.imgNum})}} />
    })}</div>
  }
}

function Setting(): React.JSX.Element {
  const {state,dispatch} = useDataContext()


  const handlePrintToPdf = async () => {
    await window.api.printToPdf(
      {direction:state.setting.direction}
    )
  }

  return <div className={styles.settingBox}>
    <h2>打印设置</h2>
    <hr/>
    <div className={styles.settingItem}>
      <label>
        纸张方向
      </label>
      <div className={styles.valBox}>
        <span className={styles.radioBox}><input type='radio' name='direction' value='1'  checked={state.setting.direction === 1} onChange={()=>{
          dispatch({
            type:'setDirection',
            payload:1
          })
        }}/>纵向</span>
        <span className={styles.radioBox}><input type='radio' name='direction' value='2' checked={state.setting.direction === 2} onChange={()=>{
          dispatch({
            type:'setDirection',
            payload:2
          })
        }}/>横向</span>
      </div>
    </div>
    <div className={styles.settingItem}>
      <label>
        排版方式
      </label>
      <Layout direction={state.setting.direction} layout={state.setting.layout} onChange={payload=>{
        dispatch({
          type:'setLayout',
          payload:payload
        })
      }} />
    </div>
     <div className={styles.settingItem}>
      <input type="checkbox" checked={state.setting.showSplitLine} onChange={()=>{
        dispatch({
          type:'setShowSplitLine',
          payload:!state.setting.showSplitLine
        })
      }} />
      <label>
        添加裁剪线
      </label>
    </div>
    <h2>操作</h2>
    <hr/>
    <div className={styles.opBtnBoxs}>
      <button className={styles.opBtn} onClick={handlePrintToPdf}>另存为PDF文件</button>
      <button className={styles.opBtn} onClick={handlePrintToPdf}>打印</button>
    </div>
  </div>
}

export default Setting
