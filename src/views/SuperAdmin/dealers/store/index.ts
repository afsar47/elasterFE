    import { combineReducers } from '@reduxjs/toolkit'
    import reducers, { DealerState } from './dealerSlice'
    import { useSelector } from 'react-redux'
    import type { TypedUseSelectorHook } from 'react-redux'
    import type { RootState } from '@/store'

    // Directly use the dealer reducer without wrapping it in a 'data' key
    const reducer = reducers;

    export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

    export * from './dealerSlice'
    export { useAppDispatch } from '@/store'
    export default reducer
