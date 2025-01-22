import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import {
    getAllDealers,
    updateDealer,
} from '@/views/SuperAdmin/dealers/DealerServices'
import { toast } from 'react-toastify' // Assuming react-toastify is used for showing toasts
import dayjs from 'dayjs'
import { getAllVendors, getAllCustomers, getAllVehiclesByPage, getAllCustomersByPage } from '../Services/DealerListServices'
// import { setTableData } from '../../store';

// Define dealer types
export interface Vendor {
    id: number
    vendorName: string
    vendorUrl: string
    vendorAccountNumber: number
    vendorCountry: string
    vendorAddress1: string
    vendorAddress2: string
    vendorCity: string
    vendorState: string
    vendorZipCode: number
    vendorContactPerson: {
        firstName: string
        lastName: string
        contactType: string
        contactNumber: string
        email: string
    }
}
export interface Customer {
    id: number
    firstName: string
    lastName: string
    phoneNumber: Array<{
        type: string
        number: number
    }>
    email: string[]
    preferredContactMethod: string
    tags?: string
    note?: string
    referralSource?: string[] // Array to match `referralSource` type in schema
    company?: string // Simplified to match the schema's string type
    fleet?: string[] // Array to match `fleet` ObjectIds in schema
    paymentTerms?: string
    zipCode: string
    customerAddress: {
        country: string
        address1: string
        address2: string
        city: string
        state: string
        zipCode: string
    }
}
export interface Vehicle {
    id: number;
    image?: string;
    year: number;
    make: string;
    model: string;
    subModel?: string;
    transmission?: string;
    engineSize?: string;
    driveTrain?: string;
    type?: string;
    mileage?:string;
    // mileage: {
    //     value?: number;
    //     distance?: 'mi' | 'km';
    //     noVehicleOdometer?: boolean;
    // };
    licencePlate?: Array<{
        regionCode: string;
        plateNumber: string;
    }>;
    unit?: string;
    vin?: string;
    color?: string;
    productionDate?: string;
    note?: string; // Limited to 200 characters as per schema
    tags?: string; 
}

export interface DealerListState {
    tableData: {
        pageIndex: number
        pageSize: number
        sort: string
        query: string
        total: number
    }
    customerTableData: {
        pageIndex: number
        pageSize: number
        sort: string
        query: string
        total: number
    }
    vehicleTableData: {
        pageIndex: number
        pageSize: number
        sort: string
        query: string
        total: number
    }
    allVendors: Vendor[]
    allCustomers: Customer[]
    allVehicles:Vehicle[]
    loading: boolean
    vendorTableData: {
        pageIndex: number
        pageSize: number
        sort: string
        query: string
        total: number
    }
    filterData: {
        status: string
    }
    customerFilterData: {
        dateOption: string
        startDate: string
        endDate: string
    }
    vehicleFilterData: {
        dateOption: string
        startDate: string
        endDate: string
    }
    filterVendorData: {
        status: string
    }
    drawerOpen: boolean
    selectedDealer: Vendor | null
}

// Initial state
const initialState: DealerListState = {
    allVendors: [],
    allCustomers: [],
    allVehicles: [],
    loading: false,
    vendorTableData: {
        pageIndex: 1,
        pageSize: 10,
        sort: '',
        query: '',
        total: 0,
    },
    filterVendorData: {
        status: '',
    },
    filterData: {
        status: '',
    },
    customerFilterData: {
        dateOption: 'All',
        startDate: '',
        endDate: ''
    },
    vehicleFilterData: {
        dateOption: 'All',
        startDate: '',
        endDate: ''
    },
    drawerOpen: false,
    selectedDealer: null,
    tableData: {
        pageIndex: 1,
        pageSize: 10,
        sort: '',
        query: '',
        total: 0,
    },
    customerTableData: {
        pageIndex: 1,
        pageSize: 10,
        sort: '',
        query: '',
        total: 0,
    },
    vehicleTableData: {
        pageIndex: 1,
        pageSize: 10,
        sort: '',
        query: '',
        total: 0,
    },

}

// Async function to fetch dealers

export const getVendors = (params: any) => async (dispatch: any) => {
    try {
        dispatch(setLoading(true)) // Set loading to true before the API call

        const response = await getAllVendors()
        if (response.status === 'success') {
            const vendors = response.allVendors.map((vendor: any) => vendor)

            dispatch(setAllVendors(vendors))
        } else {
            toast.error('Failed to fetch parts.')
        }
    } catch (error) {
        toast.error('An error occurred while fetching parts.')
    } finally {
        dispatch(setLoading(false)) // Set loading to false after API call
    }
}


export const getCustomers = (data: any) => async (dispatch: any) => {
    try {
        dispatch(setLoading(true)) // Set loading to true before the API call

        const response = await getAllCustomersByPage(data)
        if (response.status === 'success') {

            const customers = response.allCustomers.map((customer: any) => ({
                id: customer._id,
                firstName: customer.firstName,
                lastName: customer.lastName,
                phone: `${customer.phoneNumber[0].type ? `${customer.phoneNumber[0].type}:` : 'NA'} ${customer.phoneNumber[0].number ? customer.phoneNumber[0].number : ''}`,
                // phoneNumber: `${customer.phoneNumber[0].type} ${customer.phoneNumber[0].number}`,
                email: customer.email,
                zipCode: customer.zipCode ? customer.zipCode : 'NA',
                preferredContactMethod: customer.preferredContactMethod,
                tags: customer.tags || '',
                note: customer.note || '',
                referralSource: customer.referralSource
                    ? customer.referralSource.map((ref: any) => ref._id)
                    : [],
                company: customer.company?.company || '',
                fleet: customer.fleet
                    ? customer.fleet.map((fleet: any) => fleet._id)
                    : [],
                paymentTerms: customer.paymentTerms || '',
                createdDate: customer.createdAt,
                orders: customer.orders ? customer.orders : 0,
                vehicles: customer.vehicles ? customer.vehicles : 0,
                customerAddress: {
                    country: customer.customerAddress?.country || '',
                    address1: customer.customerAddress?.address1 || '',
                    address2: customer.customerAddress?.address2 || '',
                    city: customer.customerAddress?.city || '',
                    state: customer.customerAddress?.state || '',
                    zipCode: customer.customerAddress?.zipCode || '',
                },
            }))

            dispatch(setAllCustomers(customers))
            dispatch(
                setCustomerTableData({
                    total: response.totalCustomers,
                    ...data,
                }),
            )
        } else {
            toast.error('Failed to fetch customer.')
        }
    } catch (error) {
        toast.error('An error occurred while fetching parts.')
    } finally {
        dispatch(setLoading(false)) // Set loading to false after API call
    }
}

export const getVehicles = (data: any) => async (dispatch: any) => {
    try {
        dispatch(setLoading(true)); // Set loading to true before the API call

        const response = await getAllVehiclesByPage(data);
        if (response.status === 'success') {

            const vehicles= response.allVehicles.map((vehicle: any) => ({
                id: vehicle._id,
                image: vehicle.image || '',
                year: vehicle.year,
                make: vehicle.make,
                model: vehicle.model,
                subModel: vehicle.subModel || '',
                transmission: vehicle.transmission || '',
                engineSize: vehicle.engineSize || '',
                driveTrain: vehicle.driveTrain || '',
                type: vehicle.type || '',
                // mileage: {
                //     value: vehicle.mileage?.value || null,
                //     distance: vehicle.mileage?.distance || 'mi',
                //     noVehicleOdometer: vehicle.mileage?.noVehicleOdometer || false,
                // },
                mileage:vehicle.mileage || '',
                licencePlate: vehicle.licencePlate
                    ? vehicle.licencePlate.map((plate: any) => ({
                        regionCode: plate.regionCode || '',
                        plateNumber: plate.plateNumber || '',
                    }))
                    : [],
                unit: vehicle.unit || '',
                vin: vehicle.vin || '',
                color: vehicle.color || '',
                productionDate: vehicle.productionDate || '',
                note: vehicle.note || '',
                tags: vehicle.tags || '',
            }));

            dispatch(setAllVehicles(vehicles));
            dispatch(
                setVehicleTableData({
                    total: response.allVehicles.length,
                    ...data,
                })
            );
        } else {
            toast.error('Failed to fetch vehicles.');
        }
    } catch (error) {
        toast.error('An error occurred while fetching vehicles.');
    } finally {
        dispatch(setLoading(false)); // Set loading to false after API call
    }
};

const DealerListSlice = createSlice({
    name: 'allVendors',
    initialState,
    reducers: {
        setTableData: (
            state,
            action: PayloadAction<DealerListState['tableData']>,
        ) => {
            state.tableData = action.payload
        },
        setCustomerTableData: (
            state,
            action: PayloadAction<DealerListState['customerTableData']>,
        ) => {
            state.customerTableData = action.payload
        },
        setVehicleTableData: (
            state,
            action: PayloadAction<DealerListState['vehicleTableData']>,
        ) => {
            state.vehicleTableData = action.payload
        },
        setAllVendors: (
            state,
            action: PayloadAction<DealerListState['allVendors']>,
        ) => {
            state.allVendors = action.payload
        },
        setAllCustomers: (
            state,
            action: PayloadAction<DealerListState['allCustomers']>,
        ) => {
            state.allCustomers = action.payload
        },
        setAllVehicles: (
            state,
            action: PayloadAction<DealerListState['allVehicles']>,
        ) => {
            state.allVehicles = action.payload
        },

        setFilterData: (
            state,
            action: PayloadAction<DealerListState['filterData']>,
        ) => {
            state.filterData = action.payload
        },
        setCustomerFilterData: (
            state,
            action: PayloadAction<DealerListState['customerFilterData']>,
        ) => {
            state.customerFilterData = action.payload
        },
        setVehicleFilterData: (
            state,
            action: PayloadAction<DealerListState['vehicleFilterData']>,
        ) => {
            state.vehicleFilterData = action.payload
        },
        setDrawerOpen: (state) => {
            state.drawerOpen = true
        },
        setDrawerClose: (state) => {
            state.drawerOpen = false
        },
        // setSelectedDealer: (state, action: PayloadAction<Vendor | null>) => {
        //     state.selectedDealer = action.payload;
        // },
        setSelectedDealer: (state, action) => {
            state.selectedDealer = action.payload
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
    },
})

export const {
    setTableData,
    setCustomerTableData,
    setVehicleTableData,
    setAllVendors,
    setAllCustomers,
    setAllVehicles,
    setFilterData,
    setDrawerOpen,
    setDrawerClose,
    setSelectedDealer,
    setCustomerFilterData,
    setVehicleFilterData,
    setLoading,
} = DealerListSlice.actions

export default DealerListSlice.reducer
