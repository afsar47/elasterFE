import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllDealers, updateDealer } from '@/views/SuperAdmin/dealers/DealerServices';
import { toast } from 'react-toastify'; // Assuming react-toastify is used for showing toasts
import dayjs from 'dayjs';
import { apiGetAllBrand, apiGetAllCategtories, apiGetAllVendor, getAllFees, getAllPartsByPage, getAllTires,getAllTiresByPage } from '../../DealerLists/Services/DealerInventoryServices';
import { useAppSelector } from '.';
import Parts from '../parts/Parts';
import Fees from '../../DealerLists/Fees/Fees';
import { apiGetAllAppointment } from '../../DealerLists/Services/DealerListServices';

// Define dealer types
export interface Dealer {
    id: number
    fullname: string
    username: string
    email: string
    phoneNumber: string
    status: boolean
    lastOnline: number
    businessInfo?: {
        companyName: string
        address: string
        phoneNumber: string
        website: string
    }
}

export interface Tire {
    id: string // Assuming `id` will be a string (ObjectId)

    // General Information
    brand: string
    model: number
    size: string
    note: string
    url: string

    // Inventory & Pricing
    inventoryAndPrice: {
        part: string
        tireSku: string
        bin: string
        quantity: number
        min: number
        max: number
        cost: number
        retail: number
        markup: number
        margin: number
        pricingMatrix?: string
        taxable: boolean
        displaySerialOnEstimateAndInvoice: boolean
        displayPriceAndQuantityOnEstimateAndInvoice: boolean
        displayNoteOnEstimateAndInvoice: boolean
    }

    // Technical Specifications (Tech Specs)
    techSpecs: {
        category: string
        construction: string
        loadIndex: number
        loadRange: string
        outerDiameter: number
        maxTirePressure: number
        runFlat: boolean
        sidewallAspect: string
        sectionWidth: number
        serviceType: string
        speedRating: string
        treadDepth: number
        wheelDiameter: number
        treadwear: number
        traction: string
        temperature: string
    }

    // Metadata
    createdAt: Date
    updatedAt: Date
}

export interface InventoryState {
    allParts: Dealer[];
    allTires:Tire[];
    allFees: any[];
    loading: boolean;
    tableData: {
        pageIndex: number
        pageSize: number
        sort: string
        query: string
        total: number
    }
    partsTableData: {
        pageIndex: number
        pageSize: number
        sort: string
        query: string
        total: number
    }
    filterData: {
        category: string[]
        vendor: string[]
        brand: string[]
    }
    tiresTableData: {
        pageIndex: number
        pageSize: number
        sort: string
        query: string
        total: number
    }
    tiresFilterData: {
        dateOption: string
        startDate: string
        endDate: string
    }
    drawerOpen: boolean
    selectedDealer: Dealer | null
}

export interface InventoryState {
    allBrands: any[]
    allVendors: any[]
    allCategories: any[]
    allAppointment : any[]
}

// Initial state
const initialState: InventoryState = {
    allParts: [],
    allTires:[],
    allFees: [],
    allBrands: [],
    allVendors: [],
    allAppointment: [],
    allCategories: [],
    loading: false,
    tableData: {
        pageIndex: 1,
        pageSize: 10,
        sort: '',
        query: '',
        total: 0,
    },
    partsTableData: {
        pageIndex: 1,
        pageSize: 10,
        sort: '',
        query: '',
        total: 0,
    },
    filterData: {
        category: [],
        vendor: [],
        brand: [],
    },
    tiresTableData: {
        pageIndex: 1,
        pageSize: 10,
        sort: '',
        query: '',
        total: 0,
    },
    tiresFilterData: {
        dateOption: 'All',
        startDate: '',
        endDate: '',
    },
    drawerOpen: false,
    selectedDealer: null,
}
// Async function to fetch all parts
export const getParts = (params: any) => async (dispatch: any) => {
    try {
        dispatch(setLoading(true)) // Set loading to true before the API call

        const response = await getAllPartsByPage(params)

        if (response.data.status === 'success') {
            const parts = response.data.allParts.map((part: any) => ({
                id: part._id,
                partName: part.partName, // This should be changed
                partSerialNo: part.partSerialNo,
                partSku: part.partSku,
                note: part.note,
                available: part.quantity,
                minQuantity: part.minQuantity,
                maxQuantity: part.maxQuantity,
                bin: part.bin,
                cost: part.cost,
                retail: part.retail,
                brand: {
                    label: part?.brand?.label,
                    _id: part?.brand?._id,
                },
                category: {
                    label: part?.category?.categoryName,
                    _id: part?.category?._id,
                },
                dealer: part.dealer,
                vendor: {
                    label: part?.vendor?.vendorName,
                    _id: part?.vendor?._id,
                },
                reserved: part.reserved,
                onHand: part.onHand,
            }))
            dispatch(setPartsList(parts))

            // Update table data (such as pagination and total)
            dispatch(
                setPartsTableData({
                    total: parts.length, // Adjust this if needed
                    ...params, // Use other pagination params
                }),
            )
        } else {
            toast.error('Failed to fetch parts.')
        }
    } catch (error) {
        toast.error('An error occurred while fetching parts.')
    } finally {
        dispatch(setLoading(false)) // Set loading to false after API call
    }
}

// Async function to fetch all tires
export const getTires = (data: any) => async (dispatch: any) => {
    try {
        dispatch(setLoading(true)) // Set loading to true before the API call

        // Make the API call to fetch all tires using the filter parameters
        const response = await getAllTiresByPage(data)
        if (response.status === 'success') {
            const tires = response.allTires.map((tire: any) => ({
                id: tire?._id,
                brand: tire?.brand,
                model: tire?.model,
                size: tire?.size,
                note: tire?.note,
                url: tire?.url,

                // Inventory & Pricing data

                part: tire?.inventoryAndPrice?.part,
                tireSku: tire?.inventoryAndPrice?.tireSku,
                bin: tire?.inventoryAndPrice?.bin,
                quantity: tire?.inventoryAndPrice?.quantity,
                min: tire?.inventoryAndPrice?.min,
                max: tire?.inventoryAndPrice?.max,
                cost: tire?.inventoryAndPrice?.cost,
                retail: tire?.inventoryAndPrice?.retail,
                markup: tire?.inventoryAndPrice?.markup,
                margin: tire?.inventoryAndPrice?.margin,
                pricingMatrix: tire?.inventoryAndPrice?.pricingMatrix,
                taxable: tire?.inventoryAndPrice?.taxable,
                displaySerialOnEstimateAndInvoice:
                    tire?.inventoryAndPrice?.displaySerialOnEstimateAndInvoice,
                displayPriceAndQuantityOnEstimateAndInvoice:
                    tire?.inventoryAndPrice
                        ?.displayPriceAndQuantityOnEstimateAndInvoice,
                displayNoteOnEstimateAndInvoice:
                    tire?.inventoryAndPrice?.displayNoteOnEstimateAndInvoice,

                // Technical Specifications (Tech Specs)

                category: tire?.techSpecs?.category,
                construction: tire?.techSpecs?.construction,
                loadIndex: tire?.techSpecs?.loadIndex,
                loadRange: tire?.techSpecs?.loadRange,
                outerDiameter: tire?.techSpecs?.outerDiameter,
                maxTirePressure: tire?.techSpecs?.maxTirePressure,
                runFlat: tire?.techSpecs?.runFlat,
                sidewallAspect: tire?.techSpecs?.sidewallAspect,
                sectionWidth: tire?.techSpecs?.sectionWidth,
                serviceType: tire?.techSpecs?.serviceType,
                speedRating: tire?.techSpecs?.speedRating,
                treadDepth: tire?.techSpecs?.treadDepth,
                wheelDiameter: tire?.techSpecs?.wheelDiameter,
                treadwear: tire?.techSpecs?.treadwear,
                traction: tire?.techSpecs?.traction,
                temperature: tire?.techSpecs?.temperature,

                // category: {
                //     label: tire?.category?.categoryName,
                //     _id: tire?.category?._id,
                // },
                // vendor: {
                //     label: tire?.vendor?.vendorName,
                //     _id: tire?.vendor?._id,
                // },
            }))

            // Dispatch the updated list of tires to the store
            dispatch(setAllTires(tires))
            dispatch(
                setTiresTableData({
                    total: response.totalTires, // Adjust this if needed
                    ...data, // Use other pagination params
                }),
            )
        } else {
            toast.error('Failed to fetch tires.')
        }
    } catch (error) {
        toast.error('An error occurred while fetching tires.')
    } finally {
        dispatch(setLoading(false)) // Set loading to false after API call
    }
};


export const getFees = (params: any) => async (dispatch: any) => {
    try {
        dispatch(setLoading(true)); // Set loading to true before the API call
        const response = await getAllFees(params.filterData);
        if (response.data.status === 'success') {
            const fees = response.data.allFees.map((fee: any) => ({
                id: fee._id,
                feeName: fee.feeName,
                feeValue: fee.feeType === "fixedDollar" ?  fee.feeAmount : "NA",
                feePercent: fee.feeType !== "fixedDollar" ? fee.feeAmount: "NA",
                feeType: fee.feeType,
                category: {
                    label: fee?.category?.categoryName,
                    _id: fee?.category?._id
                },
            }));
            dispatch(setFeesList(fees));
            // Update table data (such as pagination and total)
            dispatch(
                setTableData({
                    total: fees.length, // Adjust this if needed
                    ...params, // Use other pagination params
                })
            );
        } else {
            toast.error('Failed to fetch fees.');
        }
    } catch (error) {
        toast.error('An error occurred while fetching fees.');
    } finally {
        dispatch(setLoading(false)); // Set loading to false after API call
    }
};


// Async function to fetch all parts
export const getAllBrands = () => async (dispatch: any) => {
    try {
        dispatch(setLoading(true)) // Set loading to true before the API call

        const response = await apiGetAllBrand()
        if (response.status === 'success') {
            const allBrands = response.allBrands.map((brand: any) => ({
                value: brand._id,
                label: brand.label,
            }))

            dispatch(setAllBrandsData(allBrands))
        } else {
            toast.error('Failed to fetch all brands.')
        }
    } catch (error) {
        toast.error('An error occurred while fetching all brands.')
    } finally {
        dispatch(setLoading(false)) // Set loading to false after API call
    }
}

// Async function to fetch all parts
export const getAllVendors = () => async (dispatch: any) => {
    try {
        dispatch(setLoading(true)) // Set loading to true before the API call
        const response = await apiGetAllVendor()
        if (response.status === 'success') {
            const allVendors = response.allVendors.map((vendor: any) => ({
                value: vendor._id,
                label: vendor.vendorName,
            }))
            dispatch(setAllVendorsData(allVendors))
        } else {
            toast.error('Failed to fetch all brands.')
        }
    } catch (error) {
        toast.error('An error occurred while fetching all brands.')
    } finally {
        dispatch(setLoading(false)) // Set loading to false after API call
    }
}

// Async function to fetch all parts
export const getAllCategtories = (type: string) => async (dispatch: any) => {
    try {
        dispatch(setLoading(true)) // Set loading to true before the API call

        const response = await apiGetAllCategtories()
        if (response.status === 'success') {
            let allCategories = []
            if (type === 'forTable') {
                allCategories = response.allCategories.map((category: any) => ({
                    value: category._id,
                    categoriesName: category.categoryName,
                    parts: category.parts,
                    tires: category.tires,
                    labor: category.labor,
                    fees: category.fees,
                    totalCount: category.totalCount,
                    subcategory: category.subcategory,
                }))
            } else if (type === 'forDropDown') {
                allCategories = response.allCategories.map((category: any) => ({
                    value: category._id,
                    label: category.categoryName,
                }))
            }

            dispatch(setAllCategoriesData(allCategories))
        } else {
            toast.error('Failed to fetch all categories.')
        }
    } catch (error) {
        toast.error('An error occurred while fetching all categories.')
    } finally {
        dispatch(setLoading(false)) // Set loading to false after API call
    }
}

export const getAllAppointment = () => async (dispatch: any) => {
    try {
        dispatch(setLoading(true)) // Set loading to true before the API call
        const response = await apiGetAllAppointment()
        console.log("All appointment : ", response)
        if (response.status === 'success') {
            const allAppointment = response.allAppointment.map((appointment: any) => ({
                id : appointment._id,
                title : appointment.title,
            }))
            dispatch(setAllAppointmentData(allAppointment))
        } else {
            toast.error('Failed to fetch all brands.')
        }
    } catch (error) {
        toast.error('An error occurred while fetching all brands.')
    } finally {
        dispatch(setLoading(false)) // Set loading to false after API call
    }
}

const InventorySlice = createSlice({
    name: 'allParts',
    initialState,
    reducers: {
        setTableData: (
            state,
            action: PayloadAction<InventoryState['tableData']>,
        ) => {
            state.tableData = action.payload
        },
        setPartsTableData: (
            state,
            action: PayloadAction<InventoryState['partsTableData']>,
        ) => {
            state.partsTableData = action.payload
        },
        setAllBrandsData: (state, action: PayloadAction<any[]>) => {
            state.allBrands = action.payload
        },
        setAllVendorsData: (state, action: PayloadAction<any[]>) => {
            state.allVendors = action.payload
        },
        setAllAppointmentData: (state, action: PayloadAction<any[]>) => {
            state.allAppointment = action.payload
        },
        setAllTires: (
            state,
            action: PayloadAction<InventoryState['allTires']>,
        ) => {
            state.allTires = action.payload
        },
        setAllCategoriesData: (state, action: PayloadAction<any[]>) => {
            state.allCategories = action.payload
        },
        setFilterData: (
            state,
            action: PayloadAction<InventoryState['filterData']>,
        ) => {
            state.filterData = action.payload
        },
        setTiresFilterData: (
            state,
            action: PayloadAction<InventoryState['tiresFilterData']>,
        ) => {
            state.tiresFilterData = action.payload
        },
        setPartsList: (state, action: PayloadAction<Dealer[]>) => {
            state.allParts = action.payload
        },
        setTiresTableData: (
            state,
            action: PayloadAction<InventoryState['tiresTableData']>,
        ) => {
            state.tiresTableData = action.payload
        },
        setFeesList: (state, action: PayloadAction<any[]>) => {
            state.allFees = action.payload;
        },
        setDrawerOpen: (state) => {
            state.drawerOpen = true
        },
        setDrawerClose: (state) => {
            state.drawerOpen = false
        },
        setSelectedDealer: (state, action) => {
            state.selectedDealer = action.payload
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
    },
})

export const {
    setAllTires,
    setTableData,
    setFilterData,
    setPartsList,
    setTiresTableData,
    setFeesList,
    setTiresFilterData,
    setDrawerOpen,
    setDrawerClose,
    setSelectedDealer,
    setLoading,
    setAllBrandsData,
    setAllVendorsData,
    setAllAppointmentData,
    setPartsTableData,
    setAllCategoriesData,
} = InventorySlice.actions

export default InventorySlice.reducer
