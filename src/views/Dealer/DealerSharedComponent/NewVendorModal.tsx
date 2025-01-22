import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Button, Notification } from '@/components/ui'
import BasicInfo from '../DealerLists/Dealers/DealersForm/BasicInfo'
import { useAppDispatch, useAppSelector } from '../Workflow/store'
import { useCallback, useState } from 'react'
import { getVendors } from '../DealerLists/Store'
import toast from '@/components/ui/toast'
import { apiNewVendor } from '../DealerLists/Services/DealerListServices'
import { cloneDeep } from 'lodash'
import { getAllVendors } from '../DealerInventory/store'

const validationSchema = Yup.object().shape({
    vendorName: Yup.string().required('Vendor Name is required'),
    vendorUrl: Yup.string().url('Invalid URL format'),
    vendorAccountNumber: Yup.string(),
    vendorAddress1: Yup.string(),
    vendorCity: Yup.string(),
    vendorState: Yup.string(),
    vendorZipCode: Yup.string(),
    vendorContactPerson: Yup.object().shape({
        firstName: Yup.string(),
        lastName: Yup.string(),
        contactType: Yup.string(),
        contactNumber: Yup.string(),
        email: Yup.string().email('Invalid email format'),
    })
})
const NewDealerModal = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch()
    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.dealer.tableData
    );
    // Toggle form on button click
    const handleButtonClick = () => {
        onClose(!isOpen) // Toggle form visibility
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
    const [loading, setLoading] = useState(false);
    if (!isOpen) return null

    return (
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
                            setLoading(true);
                            try {
                                const response = await apiNewVendor(values);
                                setLoading(false);
                                fetchData();
                                toast.push(
                                    <Notification title="Success" type="success">
                                        New Vendor Saved Successfully
                                    </Notification>,
                                );
                                getAllVendors()
                                handleButtonClick();
                                resetForm();
                            } catch (error: any) {
                                setLoading(false);
                                toast.push(
                                    <Notification title="Error" type="danger">
                                        {error.message ? error.message : "Server Error"}
                                    </Notification>,
                                );
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
    )
}

export default NewDealerModal
