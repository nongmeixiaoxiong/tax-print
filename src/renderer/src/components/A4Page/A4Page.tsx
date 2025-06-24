import { useMemo } from 'react'
import styles from './a4Page.module.scss'
import { useDataContext } from '@renderer/contexts/DataContext'
import classNames from 'classnames'

function A4Page(): React.JSX.Element {
  const {state,dispatch:_} = useDataContext()

  // 计算需要多少页
  const pageNum = useMemo(()=>{
    return state.images?.length ? Math.ceil(state.images?.length / state.setting.layout.imgNum) : 0
  },[state.images,state.setting.layout.imgNum])

  const a4PageStyle = state.setting.direction == 1 ? {
    width: '210mm',
    height: '297mm',
  } : {
    width: '297mm',
    height: '210mm',
  }

  const gridStyle = {
    gridTemplateColumns: `repeat(${state.setting.layout.col},1fr)`,
    gridTemplateRows: `repeat(${state.setting.layout.row},1fr)`,
    gridGap: '8px',
    placeItems: 'center',
  }

  const getTaxImgStyle = ()=>{
    if(state.setting.direction == 1){
      return {width: '100%',height:'auto'}
    }
    return {width: '100%',height:'auto'}
  }

  return <div className={styles.a4PageBox} >
    {Array.from({length:pageNum}).map((_,index)=>{
      return <div className={classNames(styles.a4Page,styles.order)}  style={{...a4PageStyle,...gridStyle}} key={index}>
        {state.images?.slice(index * state.setting.layout.imgNum,index * state.setting.layout.imgNum + state.setting.layout.imgNum).map(path=>{
          return <img src={`taximage://${path}`} style={getTaxImgStyle()}></img>
        })}
      </div>
    })}
  </div>
}

export default A4Page
