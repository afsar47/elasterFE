import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface EstimateState {
    loading: boolean;

}

const initialState: EstimateState = {
    loading: false,

}
const estimateSlice = createSlice({
    name: 'allEstimates',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    }
})
export const {
} = estimateSlice.actions;


export default estimateSlice.reducer;
