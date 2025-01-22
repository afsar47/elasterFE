import { combineReducers } from '@reduxjs/toolkit'
import reducers, { DealerListState } from './dealerListSlice'
import { useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

// Directly use the dealer reducer without wrapping it in a 'data' key
const reducer = reducers;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export * from './dealerListSlice'
export { useAppDispatch } from '@/store'
export default reducer
