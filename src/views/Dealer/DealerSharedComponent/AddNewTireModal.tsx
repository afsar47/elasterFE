import { apiNewTire } from '../DealerLists/Services/DealerInventoryServices'
import { Button } from '@/components/ui'
import { useCallback, useState } from 'react'
import BasicInfo from '../../Dealer/DealerInventory/TiresForm/BasicInfo'
import { Formik, Form } from 'formik'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import {
    getTires,
    useAppDispatch,
    useAppSelector,
} from '../DealerInventory/store/index'
import { validationSchema } from '../DealerInventory/Tires/TiresStatistics'

const AddNewTireModal = ({ handleButtonClick }: any) => {

    const [isFormOpen, setIsFormOpen] = useState(true);

    const handleFormClose = () => {
        setIsFormOpen(false);
    };

    const dispatch = useAppDispatch()
    const fetchData = useCallback(() => {
        dispatch(getTires({}))
    }, [dispatch])

    const initialValues = {
        // General Information
        brand: '',
        model: '',
        size: '',
        note: '',
        url: '',

        // Inventory & Pricing Section
        inventoryAndPrice: {
        part: '',
        tireSku: '',
        bin: '',
        quantity: '',
        min: '',
        max: '',
        cost: '',
        retail: '',
        markup: '',
        margin: '',
        pricingMatrix: '',
        taxable: true,
        displaySerialOnEstimateAndInvoice: true,
        displayPriceAndQuantityOnEstimateAndInvoice: true,
        displayNoteOnEstimateAndInvoice: true,
        },

        // Technical Specifications (Tech Specs) Section
        techSpecs:{
            category: '',
            construction: '',
            loadIndex: '',
            loadRange: '',
            outerDiameter: '',
            maxTirePressure: '',
            runFlat: false,
            sidewallAspect: '',
            sectionWidth: '',
            serviceType: '',
            speedRating: '',
            treadDepth: '',
            wheelDiameter: '',
            treadwear: '',
            traction: '',
            temperature: '',
        },

        // Default Segment for Tabs
        segment: 'inventory',
    }

    

    return (
        <>
        {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-[650px] h-[600px] rounded-lg shadow-lg relative border border-gray-200">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-3 border-b">
                    <h3 className="text-base font-semibold">New Tire</h3>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={handleButtonClick}
                    >
                        ✕
                    </button>
                </div>

                {/* Form Section */}
              
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { resetForm }) => {
                        try {
                            const response = await apiNewTire(values)
                            fetchData()
                            toast.push(
                                <Notification title="Success" type="success">
                                    New Tire Saved Successfully
                                </Notification>,
                            )
                            resetForm()
                            handleFormClose();
                        } catch (error) {}
                    }}
                >
                    {({ touched, errors }) => (
                        <Form className="flex flex-col h-full">
                            {/* Scrollable Form Content */}
                            <div
                                className="overflow-y-auto p-4 flex-grow"
                                style={{ maxHeight: 'calc(100% - 60px)' }}
                            >
                                <BasicInfo touched={touched} errors={errors} />
                            </div>

                            {/* Fixed Footer with Buttons */}
                            <div className="border-t p-3 flex justify-end bg-white sticky bottom-0">
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
                            </div>
                        </Form>
                    )}
                </Formik>
                </div>
                </div>
            )}
            </>
            )
}

export default AddNewTireModal
