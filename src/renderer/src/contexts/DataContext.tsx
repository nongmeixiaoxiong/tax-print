import { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react'

type State = {
    images: string[] | null,
    setting: {
        direction:number,
        layout:{row:number,col:number,imgNum:number}, // 行*列 每页图片数量
        showSplitLine:boolean
    }
}

type Action =  {
    type: 'setImages',
    payload: string[] 
} | {
    type: 'setDirection',
    payload: number
} | {
    type: 'setLayout',
    payload: {row:number,col:number,imgNum:number}
} | {
    type:'setShowSplitLine',
    payload:boolean
}

const initialState: State = {
    images: [],
    setting: {
        'direction':1, // 1 纵向 2 横向
        'layout':{row:1,col:1,imgNum:1}, // 1行，1列 1张
        'showSplitLine':true, // 是否显示网格线
    }
}

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'setImages':
            return {
                ...state,
                images: action.payload
            }
        case 'setLayout':
            return {
                ...state,
                setting: {...state.setting,layout:action.payload}
            }
        case 'setDirection':
            // 重置排版数据
            return {
                ...state,
                setting: {...state.setting,direction:action.payload,layout:{row:1,col:1,imgNum:1}}
            }
        default:
            throw new Error('Unknown action')
    }
}

const DataContext = createContext<{
    state: State,
    dispatch: Dispatch<Action>
}>({
    state: initialState,
    dispatch: () => { }
})

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
        <DataContext value={{ state, dispatch }}>
            {children}
        </DataContext>
    )
}

export const useDataContext = () => {
    const context = useContext(DataContext)
    if (!context) {
        throw new Error('useDataContext must be used within a DataProvider')
    }
    return context
}
