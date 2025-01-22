import { Button, Skeleton } from '@/components/ui'
import BasicInfo from '../DealerLists/Vehicles/VehiclesForm/BasicInfo'
import { Formik, Form, FormikTouched } from 'formik'
import { validationSchema } from '../DealerLists/Vehicles/VehiclesStatistics'
import { useCallback, useEffect, useState } from 'react'
import { HiOutlineChevronLeft } from 'react-icons/hi'
import { AiOutlineCar } from 'react-icons/ai' // Import the car icon
import {
    apiAddNewVehicle,
    apiGetVehicleByVin,
    getAllCustomers,
    getAllVehicles,
} from '../DealerLists/Services/DealerListServices'
import { getVehicles, useAppDispatch } from '../DealerLists/Store'
import { useAppSelector } from '@/store'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

const AddNewVehicleModal = ({ handleButtonClick }: any) => {
    type VehicleFormFields = {
        image: any
        year: string
        make: string
        customerName: string;
        customerId : string;
        model: string
        subModel: string
        transmission: string
        engineSize: string
        drivetrain: string
        type: string
        mileage: string
        licenceType: string
        licenceNumber: string
        unit: string
        vin: string
        color: string
        productiondate: string
        note: string
    }
    const initialValues: VehicleFormFields = {
        image: '',
        year: '',
        make: '',
        model: '',
        customerName: '',
        customerId:'',
        subModel: '',
        transmission: '',
        engineSize: '',
        drivetrain: '',
        type: '',
        mileage: '',
        licenceType: '',
        licenceNumber: '',
        unit: '',
        vin: '',
        color: '',
        productiondate: '',
        note: '',
    }

    const [isFormVisible, setIsFormVisible] = useState(false) // Toggle form visibility
    const [searchQuery, setSearchQuery] = useState('') // Search query state
    const [isSearchVisible, setIsSearchVisible] = useState(true) // Toggle search visibility
    const [searchResults, setSearchResults] = useState<any[]>([]) // Search results state
    const [showSkelaton, setshowSkelaton] = useState(false)
    const [selectedVehicle, setSelectedVehicle]: any = useState(null)
    const [isFormOpen, setIsFormOpen] = useState(true)

    

    //   useEffect(() => {
    //     const fetchCustomers = async () => {
    //       try {
    //         const result = await getAllCustomers();
    //         console.log("All Customers: ", result.
    //             allCustomers
    //             );
    //         // setCustomers(result);
    //       } catch (error) {
    //         console.error("Error fetching customers: ", error);
    //       }
    //     };
    
    //     fetchCustomers();
    //   }, []);

    const dispatch = useAppDispatch()
    const fetchData = useCallback(() => {
        dispatch(getVehicles({}))
    }, [dispatch])

    const handleFormClose = () => {
        setIsFormOpen(false)
    }

    // Sample vehicle data (replace with real API data if necessary)

    const handleAddVehicleClick = () => {
        setIsFormVisible(true)
        setIsSearchVisible(false)
    }
    const filterData = useAppSelector((state) => state.list.filterData)
    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.list.vehicleTableData,
    )
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value
        setSearchQuery(query)
        setshowSkelaton(true)
        setTimeout(async () => {
            try {
                setSearchResults([])
                const response = await apiGetVehicleByVin(query) // Await the API call
                // Create a lookup table keyed by VariableId
                const resultLookup: Record<number, any> =
                    response.Results.reduce((acc: any, item: any) => {
                        acc[item.VariableId] = item.Value // Map VariableId to its Value
                        return acc
                    }, {})
                const vehicleInfo = {
                    vehicleName: resultLookup[28] || 'Unknown Vehicle', // Example: VariableId 28
                    engineInfo: resultLookup[29] || 'Unknown Engine', // Example: VariableId 29
                    vin: response.SearchCriteria.split(':')[1] || 'Unknown VIN', // Example: VariableId 30
                    countryCode: '🇺🇸', // Static or replace with relevant key
                }
                let results: any[] = searchResults
                results.push(vehicleInfo)
                setSearchResults([...results])
                setshowSkelaton(false)
            } catch (error) {
                console.log(error)
            }
        }, 2000)

        // Filter vehicles based on search query
        // const filteredResults = vehiclesData.filter(vehicle =>
        //     vehicle.vehicleName.toLowerCase().includes(query.toLowerCase())
        // );
        // setSearchResults(filteredResults);
    }

    const selectVehicle = async (index: number, setFieldValue: any) => {
        const selectedVehicle = searchResults[index]
        try {
            const response = await apiGetVehicleByVin(selectedVehicle.vin) // Await the API call
            // Create a lookup table keyed by VariableId

            // console.log("Selected Vehicle after customer add : ", response);

            const resultLookup: Record<number, any> = response.Results.reduce(
                (acc: any, item: any) => {
                    acc[item.VariableId] = item.Value // Map VariableId to its Value
                    return acc
                },
                {},
            )
            const vehicleInfo = {
                image: '',
                year: resultLookup[29] || '', // Example: VariableId 28
                make: resultLookup[26] || '', // Example: VariableId 28
                customerName : resultLookup[50] || '', 
                customerId : resultLookup[50] || '',
                model: resultLookup[28] || '', // Example: VariableId 29
                subModel: resultLookup[110] || '', // Example: VariableId 29
                transmission: resultLookup[37] || '', // Example: VariableId 29
                engineSize: resultLookup[28] || '', // Example: VariableId 29
                drivetrain: resultLookup[15] || '', // Example: VariableId 29
                type: resultLookup[39] || '', // Example: VariableId 29
                mileage: '', // Example: VariableId 29
                licenceType: '', // Example: VariableId 29
                licenceNumber: '', // Example: VariableId 29
                unit: '', // Example: VariableId 29
                vin: response.SearchCriteria.split(':')[1] || '', // Example: VariableId 30
                color: '', // Example: VariableId 29
                productiondate: '', // Example: VariableId 29
                note: '', // Example: VariableId 29
            }
            setSelectedVehicle(vehicleInfo)
            setIsFormVisible(true)
            setIsSearchVisible(false)
        } catch (error) {
            console.log(error)
        }
    }

    const handleBackToSearch = () => {
        setIsFormVisible(false)
        setIsSearchVisible(true)
    }

    const modalHeight = isFormVisible
        ? 'h-[600px]'
        : searchResults.length > 0 || searchQuery
          ? 'h-[400px]'
          : 'h-[200px]'

    return (
        <>
            {isFormOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div
                        className={`bg-white w-[650px] rounded-lg shadow-lg relative border border-gray-200 transition-all duration-300 ${modalHeight}`}
                    >
                        <div className="flex justify-between items-center p-3 border-b">
                            {isFormVisible && (
                                <button
                                    className="text-gray-500 hover:text-gray-700"
                                    onClick={handleBackToSearch}
                                >
                                    <HiOutlineChevronLeft className="text-xl" />
                                </button>
                            )}
                            <h3 className="text-base font-semibold">
                                New Vehicle
                            </h3>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={handleButtonClick}
                            >
                                ✕
                            </button>
                        </div>
                        <div
                            className="overflow-y-auto p-4"
                            style={{ height: 'calc(100% - 110px)' }}
                        >
                            <Formik
                                initialValues={selectedVehicle || initialValues}
                                validationSchema={validationSchema}
                                onSubmit={async (values, { resetForm }) => {
                                    try {
                                        // Convert to FormData
                                        const formData = new FormData()
                                        Object.keys(values).forEach((key) => {
                                            if (
                                                key === 'image' &&
                                                values.image
                                            ) {
                                                formData.append(
                                                    key,
                                                    values.image,
                                                ) // Add file to FormData
                                            } else {
                                                formData.append(
                                                    key,
                                                    values[key],
                                                ) // Add other fields
                                            }
                                        })

                                        await apiAddNewVehicle(formData) // Pass FormData to the API

                                        // Refresh vehicle list
                                        getVehicles({
                                            pageIndex,
                                            pageSize,
                                            sort,
                                            query,
                                            filterData,
                                        })
                                        fetchData()
                                        toast.push(
                                            <Notification
                                                title="Success"
                                                type="success"
                                            >
                                                New Tire Saved Successfully
                                            </Notification>,
                                        )

                                        // Reset form and close modal
                                        resetForm()
                                        handleFormClose()
                                        setIsFormVisible(false)
                                        setIsSearchVisible(false)
                                        console.log(
                                            'Vehicle added successfully:',
                                            values,
                                        )
                                    } catch (error) {
                                        console.error(
                                            'Error adding vehicle:',
                                            error,
                                        )
                                    }
                                }}
                            >
                                {({ touched, errors, setFieldValue }) => (
                                    <Form>
                                        {isSearchVisible && (
                                            <div className="mb-4">
                                                <input
                                                    type="text"
                                                    className="w-full p-2 border border-gray-300 rounded outline-none"
                                                    placeholder="Search Vehicles by Name..."
                                                    value={searchQuery}
                                                    onChange={
                                                        handleSearchChange
                                                    }
                                                />
                                                {searchQuery &&
                                                    searchResults.length >
                                                        0 && (
                                                        <div className="space-y-4 mt-4">
                                                            {searchResults.map(
                                                                (
                                                                    result,
                                                                    index,
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="flex items-center space-x-4 p-4 border-b border-gray-200 hover:bg-gray-100 transition duration-150"
                                                                        style={{
                                                                            cursor: 'pointer',
                                                                        }}
                                                                        onClick={() =>
                                                                            selectVehicle(
                                                                                index,
                                                                                setFieldValue,
                                                                            )
                                                                        }
                                                                    >
                                                                        <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full">
                                                                            <AiOutlineCar className="text-xl text-gray-600" />
                                                                        </div>
                                                                        <div className="flex-grow">
                                                                            <div className="text-sm font-semibold text-gray-900">
                                                                                {
                                                                                    result.vehicleName
                                                                                }
                                                                            </div>
                                                                            <div className="text-xs text-gray-500">
                                                                                <span>
                                                                                    {
                                                                                        result.engineInfo
                                                                                    }
                                                                                </span>{' '}
                                                                                <br />
                                                                                <span>
                                                                                    VIN:{' '}
                                                                                    {
                                                                                        result.vin
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex-shrink-0 text-xs text-blue-500">
                                                                            {
                                                                                result.countryCode
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    )}
                                                {searchQuery &&
                                                    searchResults.length ===
                                                        0 &&
                                                    showSkelaton && (
                                                        <div className="mt-4">
                                                            <Skeleton
                                                                animation={true}
                                                            />{' '}
                                                            <br />
                                                            <Skeleton
                                                                animation={true}
                                                            />
                                                            <br />
                                                            <Skeleton
                                                                animation={true}
                                                            />
                                                        </div>
                                                    )}
                                                {searchQuery &&
                                                    searchResults.length ===
                                                        0 &&
                                                    !showSkelaton && (
                                                        <div className="mt-2 text-gray-500">
                                                            No vehicles found
                                                        </div>
                                                    )}
                                            </div>
                                        )}

                                        {isFormVisible && (
                                            <>
                                                <BasicInfo
                                                    touched={
                                                        touched as FormikTouched<{
                                                            year: string
                                                            make: string
                                                            model: string
                                                        }>
                                                    }
                                                    errors={errors}
                                                    selectedVehicle={
                                                        selectedVehicle
                                                    }
                                                    setFieldValue={
                                                        setFieldValue
                                                    }
                                                />
                                                <div className="absolute bottom-0 left-0 right-0 flex justify-end p-2 border-t bg-white">
                                                    <Button
                                                        variant="primary"
                                                        type="button"
                                                        className="bg-gray-300 mr-2 px-4 py-1.5"
                                                        onClick={
                                                            handleButtonClick
                                                        }
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        variant="solid"
                                                        type="submit"
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5"
                                                    >
                                                        Save
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </Form>
                                )}
                            </Formik>
                        </div>

                        <div className="flex justify-between p-2 border-t">
                            {!isFormVisible && (
                                <div className="w-full flex justify-start">
                                    <p className="pt-2.5 font-bold">
                                        You can also
                                    </p>
                                    <Button
                                        variant="primary"
                                        type="button"
                                        className="bg-transparent border-none !text-blue-700 pl-1.5 hover:bg-transparent"
                                        onClick={handleAddVehicleClick}
                                    >
                                        add vehicle manually
                                    </Button>
                                </div>
                            )}
                            {/* <div className="flex justify-end w-full">
                        <Button
                            variant="primary"
                            type="button"
                            className="bg-gray-300 mr-2 px-4 py-1.5"
                            onClick={handleButtonClick}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="solid"
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5"
                        >
                            Save
                        </Button>
                    </div> */}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AddNewVehicleModal
