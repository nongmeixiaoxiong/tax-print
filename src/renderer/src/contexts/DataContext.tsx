import {createContext,useContext,useReducer,ReactNode,Dispatch} from 'react'

type State = {
    filePaths: string[] | null,
    images:string[] | null,
    setting:Object | null
}

type Action = {
    type: 'setFilePaths',
    payload: string[] | null
} | {
    type: 'setImages',
    payload: string[] | null
} | {
    type: 'setSetting',
    payload: Object | null
}

const initialState:State = {
    filePaths: null,
    images: null,
    setting: null
}

const reducer = (state:State,action:Action) => {
    switch (action.type) {
        case 'setFilePaths':
            return {
                ...state,
                filePaths: action.payload
            }
        case 'setImages':
            return {
                ...state,
                images: action.payload
            }
        case 'setSetting':
            return {
                ...state,
                setting: action.payload
            }
        default:
            throw new Error('Unknown action')
    }
}

const DataContext = createContext<{
    state:State,
    dispatch:Dispatch<Action>
}>({
    state:initialState,
    dispatch:()=>{}
})

export const DataProvider = ({children}:{children:ReactNode}) => {
    const [state,dispatch] = useReducer(reducer,initialState)
    return (
        <DataContext value={{state,dispatch}}>
            {children}
        </DataContext>
    )
}

export const useDataContext = () => {
    const context = useContext(DataContext)
    if(!context){
        throw new Error('useDataContext must be used within a DataProvider')
    }
    return context
}
