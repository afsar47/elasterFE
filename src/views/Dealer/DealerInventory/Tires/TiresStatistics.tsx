import {
    HiOutlineCube,
    HiOutlineCurrencyDollar,
    HiOutlineTag,
    HiPlusCircle,
} from 'react-icons/hi'
import { NumericFormat } from 'react-number-format'
import { Avatar, Card } from '@/components/ui'
import { Button } from '@/components/ui'
import { useState } from 'react'
import * as Yup from 'yup'
import AddNewTireModal from '../../DealerSharedComponent/AddNewTireModal'
import { useAppSelector } from '../store'

type StatisticCardProps = {
    icon: React.ReactNode
    avatarClass: string
    label: string
    value?: number
}

export type FormFields = {
    brand: string;
    model: number;
    size: string;
    note: string;
    url: string;

    // Inventory & Pricing
    inventoryAndPrice: {
        part: string;
        tireSku: string;
        bin: string;
        quantity: number;
        min: number;
        max: number;
        cost: number;
        retail: number;
        markup: number;
        margin: number;
        pricingMatrix?: string;
        taxable: boolean;
        displaySerialOnEstimateAndInvoice: boolean;
        displayPriceAndQuantityOnEstimateAndInvoice: boolean;
        displayNoteOnEstimateAndInvoice: boolean;
    };

    // Technical Specifications (Tech Specs)
    techSpecs: {
        category: string;
        construction: string;
        loadIndex: number;
        loadRange: string;
        outerDiameter: number;
        maxTirePressure: number;
        runFlat: boolean;
        sidewallAspect: string;
        sectionWidth: number;
        serviceType: string;
        speedRating: string;
        treadDepth: number;
        wheelDiameter: number;
        treadwear: number;
        traction: string;
        temperature: string;
    };
}


export const validationSchema = Yup.object().shape({
    brand: Yup.string()
        .required('Brand is required')
        .max(30, 'Must be less than 30 characters'),
    model: Yup.number()
        .min(0, 'Model cannot be negative'),
    size: Yup.string()
        .max(20, 'Size must be less than 20 characters'),
    note: Yup.string()
        .max(200, 'Note must be less than 200 characters'),
    url: Yup.string()
        .max(50, 'URL must be less than 50 characters'),

    // Inventory & Pricing validation
    inventoryAndPrice: Yup.object().shape({
        part: Yup.string().max(10, 'Part must be less than 10 characters'),
        tireSku: Yup.string().max(10, 'SKU must be less than 10 characters'),
        bin: Yup.string().max(30, 'Bin must be less than 30 characters'),
        quantity: Yup.number().min(0, 'Quantity cannot be negative'),
        min: Yup.number().min(0, 'Minimum quantity cannot be negative'),
        max: Yup.number().min(0, 'Maximum quantity cannot be negative'),
        cost: Yup.number().min(0, 'Cost cannot be negative'),
        retail: Yup.number().min(0, 'Retail cannot be negative'),
        markup: Yup.number().min(0, 'Markup cannot be negative'),
        margin: Yup.number().min(0, 'Margin cannot be negative'),
        pricingMatrix: Yup.string(),
        taxable: Yup.boolean(),
        displaySerialOnEstimateAndInvoice: Yup.boolean(),
        displayPriceAndQuantityOnEstimateAndInvoice: Yup.boolean(),
        displayNoteOnEstimateAndInvoice: Yup.boolean(),
    }),

    // Technical Specifications (Tech Specs) validation
    techSpecs: Yup.object().shape({
        category: Yup.string()
            .required('Category is required')
            .max(50, 'Must be less than 50 characters'),
        construction: Yup.string().max(50, 'Construction must be less than 50 characters'),
        loadIndex: Yup.number(),
        loadRange: Yup.string()
            .max(10, 'Load Range must be less than 10 characters'),
        outerDiameter: Yup.number()
            .min(0, 'Outer Diameter cannot be negative'),
        maxTirePressure: Yup.number()
            .min(0, 'Max Tire Pressure cannot be negative'),
        runFlat: Yup.boolean(),
        sidewallAspect: Yup.string()
            .max(10, 'Sidewall Aspect must be less than 10 characters'),
        sectionWidth: Yup.number()
            .min(0, 'Section Width cannot be negative'),
        serviceType: Yup.string()
            .max(20, 'Service Type must be less than 20 characters'),
        speedRating: Yup.string()
            .max(5, 'Speed Rating must be less than 5 characters'),
        treadDepth: Yup.number()
            .min(0, 'Tread Depth cannot be negative'),
        wheelDiameter: Yup.number()
            .min(0, 'Wheel Diameter cannot be negative'),
        treadwear: Yup.number()
            .min(0, 'Treadwear cannot be negative'),
        traction: Yup.string()
            .max(10, 'Traction must be less than 10 characters'),
        temperature: Yup.string()
            .max(10, 'Temperature must be less than 10 characters'),
    }),
});



const StatisticCard = (props: StatisticCardProps) => {
    const { icon, avatarClass, label, value } = props

    return (
        <Card bordered className="w-52 p-1 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Avatar className={avatarClass} icon={icon} />
                <div>
                    <span className="text-sm">{label}</span>
                    <h3 className="text-lg font-semibold">
                        <NumericFormat
                            thousandSeparator
                            displayType="text"
                            value={value}
                        />
                    </h3>
                </div>
            </div>
        </Card>
    )
}

const TiresStatistics = () => {
    const [showForm, setShowForm] = useState(false)
const data = useAppSelector((state) => state.inventory.allTires);
    // Toggle form on button click
    console.log("Data in Tires Statistics : ", data);
    
    const handleButtonClick = () => {
        setShowForm(!showForm) // Toggle form visibility
    }

    return (
        <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Tires</h2>
            <Button
                variant="solid"
                type="button"
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium flex items-center gap-1 px-3 py-1.5"
                onClick={handleButtonClick}
            >
                <HiPlusCircle className="h-4 w-4" />
                New Tires
            </Button>
            {showForm && <AddNewTireModal handleButtonClick={handleButtonClick} />}

    
            {/* {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white w-[650px] h-[600px] rounded-lg shadow-lg relative border border-gray-200">
                        <div className="flex justify-between items-center p-3 border-b">
                            <h3 className="text-base font-semibold">New Tire</h3>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={handleButtonClick}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="overflow-y-auto p-4" style={{ height: 'calc(100% - 110px)' }}>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {
                                    resetForm()
                                    setShowForm(false)
                                }}
                            >
                                {({ touched, errors }) => (
                                    <Form>
                                        <BasicInfo
                                            touched={touched}
                                            errors={errors}
                                        />
                                    </Form>
                                )}
                            </Formik>
                        </div>
                        <div className="flex justify-end p-2 border-t">
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
                    </div>
                </div>
            )} */}

            

        </div>
    
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 max-w-2xl">
            <StatisticCard
                icon={<HiOutlineCube />}
                avatarClass="!bg-indigo-500"
                label="Total Quantity"
                value={20}
            />
            <StatisticCard
                icon={<HiOutlineCurrencyDollar />}
                avatarClass="!bg-blue-400"
                label="Total Cost"
                value={400}
            />
            <StatisticCard
                icon={<HiOutlineTag />}
                avatarClass="!bg-emerald-400"
                label="Total Value"
                value={700}
            />
        </div>

    </div>
    
    )
}

export default TiresStatistics
