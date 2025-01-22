import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllDealers, updateDealer } from '@/views/SuperAdmin/dealers/DealerServices';
import { toast } from 'react-toastify'; // Assuming react-toastify is used for showing toasts
import dayjs from 'dayjs';
import { getAllCountAccToStatus, getAllEstimates, getAllEstimatesByPage } from '../../Services/WorkflowService';

// Define estimate types
export interface Estimate {
    _id: number;
    orderNo: number;
    orderName: string;
    customer: string;
    vehicle: string;
    grandTotal: string;
    dueDate: string;
    paymentTerms: string;
    paymentDueDate: string;
    paidStatus: string;
    status: string;
    inspectionStatus: string;
    orderStatus: string;
    isAuthorized: string;
    appointment: string;
    technician: string;
    createdDate: number;
    authorizedDate: number;
    invoiceDate: number;
    fullyPaidDate: number;
    workflowDate: number;
    messagedDate: number;
    tags: [];
}

export interface WorkflowState {
    estimateList: Estimate[];
    loading: boolean;
    tableData: {
        pageIndex: number;
        pageSize: number;
        sort: string;
        query: string;
        total: number;
    };
    workflowCountAccToStatus: [],
    filterData: {
        status: string;
    };
    drawerOpen: boolean;
    selectedDealer: Estimate | null;
}

// Initial state
const initialState: WorkflowState = {
    estimateList: [],
    loading: false,
    tableData: {
        pageIndex: 1,
        pageSize: 10,
        sort: '',
        query: '',
        total: 0,
    },
    workflowCountAccToStatus: [],
    filterData: {
        status: '',
    },
    drawerOpen: false,
    selectedDealer: null,
};

// Async function to fetch estimates
export const getEstimatesByPage = (params: any) => async (dispatch: any) => {
    try {
        dispatch(setLoading(true)); // Set loading to true before the API call

        // Call the API to get estimates
        const response = await getAllEstimatesByPage(params);

        if (response.status === 'success') {
            const estimates = response.allEstimates.map((estimate: any) => ({
                id: estimate._id,
                orderNo: estimate.orderNo,
                orderName: estimate.orderName,
                customer: estimate.customer,
                vehicle: estimate.vehicle,
                total: estimate.grandTotal, // Map total appropriately
                dueDate: estimate.dueDate,
                paymentTerms: estimate.paymentTerms,
                paymentDueDate: estimate.paymentDueDate,
                paidStatus: estimate.paidStatus,
                workflow: estimate.status,
                inspectionStatus: estimate.inspectionStatus,
                orderStatus: estimate.orderStatus,
                auth: estimate.isAuthorized,
                appointment: estimate.appointment,
                technician: estimate.technician,
                createdDate: dayjs(estimate.createdDate).unix(),
                authorizedDate: estimate.authorizedDate ? dayjs(estimate.authorizedDate).unix() : null,
                invoiceDate: estimate.invoiceDate ? dayjs(estimate.invoiceDate).unix() : null,
                fullyPaidDate: estimate.fullyPaidDate ? dayjs(estimate.fullyPaidDate).unix() : null,
                workflowDate: estimate.workflowDate ? dayjs(estimate.workflowDate).unix() : null,
                messagedDate: estimate.messagedDate ? dayjs(estimate.messagedDate).unix() : null,
                tags: estimate.tags,
            }));

            dispatch(setAllEstimatesList(estimates));

            // Update table data (such as pagination and total)
            dispatch(
                setTableData({
                    total: response.totalEstimates, // Use the totalEstimates from the API
                    ...params, // Include pagination params
                })
            );
        } else {
            toast.error('Failed to fetch estimates.');
        }
    } catch (error) {
        console.error('Error while fetching estimates:', error);
        toast.error('An error occurred while fetching estimates.');
    } finally {
        dispatch(setLoading(false)); // Set loading to false after API call
    }
};



export const getWorkflowTableCount = () => async (dispatch: any) => {
    try {
        dispatch(setLoading(true)); // Set loading to true before the API call
        // const response = await getAllCountAccToStatus();
        const response = {
            status: 'success',
            allCountAccToStatus: {
                all: {
                    id: 1,
                    statusName: 'All',
                    statusCount: 4
                },
                estimates: {
                    id: 2,
                    statusName: 'Estimates',
                    statusCount: 2
                },
                droppedOff: {
                    id: 3,
                    statusName: 'Dropped Off',
                    statusCount: 0
                },
                inProgress: {
                    id: 4,
                    statusName: 'In Progress',
                    statusCount: 0
                },
                invoices: {
                    id: 5,
                    statusName: 'Invoices',
                    statusCount: 0
                }
            }
        }

        if (response.status === 'success') {
            const allCountAccToStatus: any = response.allCountAccToStatus
            dispatch(setAllCountAccToStatus(allCountAccToStatus));
        } else {
            toast.error('Failed to fetch counts.');
        }
    } catch (error) {
        toast.error('An error occurred while fetching counts.');
    } finally {
        dispatch(setLoading(false)); // Set loading to false after API call
    }
}

// Async function to update a estimate
export const putDealer = (estimate: Estimate) => async (dispatch: any) => {
    try {
        dispatch(setLoading(true));

        const response = await updateDealer(estimate._id, estimate);

        if (response.data.status === 'success') {
            toast.success('Estimate updated successfully!');
            // You can also dispatch an action to update the estimate in the state if needed.
        } else {
            toast.error('Failed to update the estimate.');
        }
    } catch (error) {
        toast.error('An error occurred while updating the estimate.');
    } finally {
        dispatch(setLoading(false));
    }
};

const estimateSlice = createSlice({
    name: 'allEstimates',
    initialState,
    reducers: {
        setTableData: (state, action: PayloadAction<WorkflowState['tableData']>) => {
            state.tableData = action.payload;
        },
        setFilterData: (state, action: PayloadAction<WorkflowState['filterData']>) => {
            state.filterData = action.payload;
        },
        setAllEstimatesList: (state, action: PayloadAction<Estimate[]>) => {
            state.estimateList = action.payload;
        },
        setAllCountAccToStatus: (state, action: PayloadAction<WorkflowState['workflowCountAccToStatus']>) => {
            state.workflowCountAccToStatus = action.payload;
        },
        setDrawerOpen: (state) => {
            state.drawerOpen = true;
        },
        setDrawerClose: (state) => {
            state.drawerOpen = false;
        },
        setSelectedDealer: (state, action: PayloadAction<Estimate | null>) => {
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
    setAllEstimatesList,
    setDrawerOpen,
    setAllCountAccToStatus,
    setDrawerClose,
    setSelectedDealer,
    setLoading,
} = estimateSlice.actions;

export default estimateSlice.reducer;