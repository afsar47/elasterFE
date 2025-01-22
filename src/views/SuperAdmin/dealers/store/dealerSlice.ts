import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllDealers, updateDealer } from '@/views/SuperAdmin/dealers/DealerServices';
import { toast } from 'react-toastify'; // Assuming react-toastify is used for showing toasts
import dayjs from 'dayjs';

// Define dealer types
export interface Dealer {
    id: number;
    fullname: string;
    username:string;
    email: string;
    phoneNumber: string;
    status: boolean;
    lastOnline: number;
    businessInfo?: {
        companyName: string;
        address: string;
        phoneNumber: string;
        website: string;
    };
}

export interface DealerState {
    dealerList: Dealer[];
    loading: boolean;
    tableData: {
        pageIndex: number;
        pageSize: number;
        sort: string;
        query: string;
        total: number;
    };
    filterData: {
        status: string;
    };
    drawerOpen: boolean;
    selectedDealer: Dealer | null;
}

// Initial state
const initialState: DealerState = {
    dealerList: [],
    loading: false,
    tableData: {
        pageIndex: 1,
        pageSize: 10,
        sort: '',
        query: '',
        total: 0,
    },
    filterData: {
        status: '',
    },
    drawerOpen: false,
    selectedDealer: null,
};

// Async function to fetch dealers
export const getDealers = (params: any) => async (dispatch: any) => {
    try {
        dispatch(setLoading(true)); // Set loading to true before the API call

        const response = await getAllDealers();
        if (response.status === 'success') {
            const dealers = response.allDealers.map((dealer: any) => ({
                id: dealer._id,
                fullname: dealer.fullname, // This should be changed
                email: dealer.email,
                status: dealer.status,
                phoneNumber: dealer.phoneNumber,
                lastOnline: dayjs(dealer.updatedAt).unix(),
            }));

            dispatch(setDealerList(dealers));

            // Update table data (such as pagination and total)
            dispatch(
                setTableData({
                    total: dealers.length, // Adjust this if needed
                    ...params, // Use other pagination params
                })
            );
        } else {
            toast.error('Failed to fetch dealers.');
        }
    } catch (error) {
        toast.error('An error occurred while fetching dealers.');
    } finally {
        dispatch(setLoading(false)); // Set loading to false after API call
    }
};

// Async function to update a dealer
export const putDealer = (dealerId: number, dealer: Dealer) => async (dispatch: any) => {
    try {
        dispatch(setLoading(true));

        const response = await updateDealer(dealerId, dealer); // No need for dealer.id

            if (response.success) {
            
            dispatch(setDealerList(response.data.allDealers));
            toast.success('Dealer updated successfully!');
        dispatch(setLoading(false));
        // You can also dispatch an action to update the dealer in the state if needed.
        } else {
            toast.error('Failed to update the dealer.');
        }
    } catch (error) {
        toast.error('An error occurred while updating the dealer.');
    } finally {
        dispatch(setLoading(false));
    }
};

const dealerSlice = createSlice({
    name: 'allDealers',
    initialState,
    reducers: {
        setTableData: (state, action: PayloadAction<DealerState['tableData']>) => {
            state.tableData = action.payload;
        },
        setFilterData: (state, action: PayloadAction<DealerState['filterData']>) => {
            state.filterData = action.payload;
        },
        setDealerList: (state, action: PayloadAction<Dealer[]>) => {
            state.dealerList = action.payload;
        },
        setDrawerOpen: (state) => {
            state.drawerOpen = true;
        },
        setDrawerClose: (state) => {
            state.drawerOpen = false;
        },
        // setSelectedDealer: (state, action: PayloadAction<Dealer | null>) => {
        //     state.selectedDealer = action.payload;
        // },
        setSelectedDealer: (state, action) => {
            state.selectedDealer = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const {
    setTableData,
    setFilterData,
    setDealerList,
    setDrawerOpen,
    setDrawerClose,
    setSelectedDealer,
    setLoading,
} = dealerSlice.actions;

export default dealerSlice.reducer;