import {
    HiOutlineCube,
    HiOutlineCurrencyDollar,
    HiOutlineTag,
    HiPlusCircle,
} from 'react-icons/hi'
import { NumericFormat } from 'react-number-format'
import { Avatar, Card, Notification } from '@/components/ui'
import { Button } from '@/components/ui'
import { useCallback, useState } from 'react'
import BasicInfo from './DealersForm/BasicInfo'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { getVendors, useAppDispatch, useAppSelector } from '../Store'
import { cloneDeep } from 'lodash'
import { apiNewVendor } from '../Services/DealerListServices'
import toast from '@/components/ui/toast'
import { getAllVendors } from '../../DealerInventory/store'


const validationSchema = Yup.object().shape({
    vendorName: Yup.string()
        .required('Vendor Name is required')
        .max(70, 'Vendor Name must be less than 70 characters'),
    vendorUrl: Yup.string()
        .url('Invalid URL format')
        .max(50, 'Vendor URL must be less than 50 characters'),
    vendorAccountNumber: Yup.string()
        .max(20, 'Vendor Account Number must be less than 20 characters'),
    vendorCountry: Yup.string()
        .max(200, 'Vendor Country must be less than 200 characters'),
    vendorAddress1: Yup.string()
        .max(200, 'Vendor Address 1 must be less than 200 characters'),
    vendorAddress2: Yup.string()
        .max(200, 'Vendor Address 2 must be less than 200 characters'),
    vendorCity: Yup.string()
        .max(200, 'Vendor City must be less than 200 characters'),
    vendorState: Yup.string()
        .max(30, 'Vendor State must be less than 30 characters'),
    vendorZipCode: Yup.number()
        .typeError('Vendor Zip Code must be a number')
        .max(999999, 'Vendor Zip Code must be less than 6 digits'), // Assuming Zip Code is up to 6 digits
    firstName: Yup.string()
        .max(20, 'First Name must be less than 20 characters'),
    lastName: Yup.string()
        .max(20, 'Last Name must be less than 20 characters'),
    contactType: Yup.string()
        .max(20, 'Contact Type must be less than 20 characters'),
    contactNumber: Yup.number()
        .typeError('Contact Number must be a number')
        .max(9999999999, 'Contact Number must be less than 10 digits'),
    email: Yup.string()
        .email('Invalid email format')
        .max(50, 'Email must be less than 50 characters'),
})


const VendorsStatistics = () => {
    const [showForm, setShowForm] = useState(false)
    const dispatch = useAppDispatch()
    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.dealer.tableData
    );
    // Toggle form on button click
    const handleButtonClick = () => {
        setShowForm(!showForm) // Toggle form visibility
    }

    const initialValues = {
        vendorName: '',
        vendorUrl: '',
        vendorAccountNumber: '',
        vendorAddress1: '',
        vendorAddress2: '',
        vendorCity: '',
        vendorState: '',
        vendorZipCode: '',
        vendorContactPerson: {
            firstName: '',
            lastName: '',
            contactType: '',
            contactNumber: '',
            email: '',
        }
    }


    const fetchData = useCallback(() => {
        dispatch(getVendors({ pageIndex, pageSize, sort, query }))
    }, [pageIndex, pageSize, sort, query, dispatch])

    const data = useAppSelector((state) => state.list.allVendors);

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-3 ">
                <h2 className="text-xl font-semibold">Vendors</h2>
                <Button
                    variant="solid"
                    type="button"
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium flex items-center gap-1 px-3 py-1.5"
                    onClick={handleButtonClick}
                >
                    <HiPlusCircle className="h-4 w-4" />
                    New Vendor
                </Button>

                {showForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white w-[650px] h-[600px] rounded-lg shadow-lg relative border border-gray-200">
                            <div className="flex justify-between items-center p-3 border-b">
                                <h3 className="text-base font-semibold">New Vendor</h3>
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
                                    onSubmit={async (values, { resetForm }) => {
                                        const formData = cloneDeep(values)
                                        try {
                                            const response = await apiNewVendor(values)
                                            fetchData();
                                            toast.push(
                                                <Notification title="Success" type="success">
                                                    New Vendor Saved Successfully
                                                </Notification>,

                                            )
                                            resetForm()
                                            getAllVendors()
                                            setShowForm(false)
                                        } catch (error: any) {
                                            console.error(
                                                'Error saving form:',
                                                error.message,
                                            )
                                            toast.push(
                                                <Notification title="Error" type="danger">
                                                    {error.message ? error.message : "Server Error"}
                                                </Notification>,

                                            )
                                        }
                                    }}
                                >
                                    {({ touched, errors }) => (
                                        <Form>
                                            {/* Pass the touched and errors to BasicInfo */}
                                            <BasicInfo
                                                touched={touched}
                                                errors={errors}
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 flex justify-end p-2 border-t bg-white">
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
                    </div>
                )}
            </div>

        </div>

    )
}

export default VendorsStatistics
