import { HiPlusCircle, HiX } from 'react-icons/hi'
import { Button, FormItem } from '@/components/ui'
import { useCallback, useState } from 'react'
import BasicInfo from './VehiclesForm/BasicInfo'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import AddNewVehicleModal from '../../DealerSharedComponent/AddNewVehicleModal'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { apiNewVehicle } from '../Services/DealerListServices'
import { getVehicles, useAppDispatch, useAppSelector } from '../Store'

export type FormFields = {
    image?: string
    year: number
    make: string
    model: string
    subModel?: string
    transmission?: string
    engineSize?: string
    driveTrain?: string
    type?: string
    // mileage: {
    //     value?: number 
    //     distance?: 'mi' | 'km'
    //     noVehicleOdometer?: boolean
    // }
    mileage?: string
    licencePlate?: Array<{
        regionCode: string
        plateNumber: string
    }>
    unit?: string
    vin?: string
    color?: string
    productionDate?: string
    note?: string // Optional field for additional notes
    tags?: string // Optional tags, assuming a single string
}

export const validationSchema = Yup.object().shape({
    image: Yup.string(),
    year: Yup.number().required('Year is required'),
    make: Yup.string().required('Make is required'),
    model: Yup.string().required('Model is required'),

    // Optional fields
    subModel: Yup.string(),
    transmission: Yup.string(),
    engineSize: Yup.string(),
    driveTrain: Yup.string(),
    type: Yup.string(),
    mileage: Yup.string(),
    licenceType: Yup.string(),
    licenceNumber: Yup.string(),
    unit: Yup.string(),
    vin: Yup.string(),
    color: Yup.string(),
    productionDate: Yup.string(),
    note: Yup.string(),
    tags: Yup.string(),
})

const VehiclesStatistics = () => {
    const [showForm, setShowForm] = useState(false)

    const dispatch = useAppDispatch()
    const filterData = useAppSelector((state) => state.list.filterData)
    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.list.vehicleTableData,
    )

    const fetchData = useCallback(() => {
        dispatch(getVehicles({ pageIndex, pageSize, sort, query, filterData }))
    }, [pageIndex, pageSize, sort, query, filterData, dispatch])
    // Toggle form on button click

    // Toggle form on button click
    const handleButtonClick = () => {
        setShowForm(!showForm) // Toggle form visibility
    }

    const initialValues = {
        year: '', // Required field
        make: '', // Required field
        model: '', // Required field

        // Optional fields
        image: '',
        subModel: '',
        transmission: '',
        engineSize: '',
        driveTrain: '',
        type: '',
        mileage: '',
        licenceType: '',
        licenceNumber: '',
        unit: '',
        vin: '',
        color: '',
        productionDate: '',
        note: '',
        tags: '',
    }

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">Vehicles</h2>
                <Button
                    variant="solid"
                    type="button"
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium flex items-center gap-1 px-3 py-1.5"
                    onClick={handleButtonClick}
                >
                    <HiPlusCircle className="h-4 w-4" />
                    New Vehicle
                </Button>

                {showForm && (
                    <AddNewVehicleModal handleButtonClick={handleButtonClick} />
                )}
            </div>
        </div>
    )
}

export default VehiclesStatistics
