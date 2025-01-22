import { apiNewCustomer } from '../Services/DealerListServices'
import { HiPlusCircle, HiX } from 'react-icons/hi'
import { Button, FormItem } from '@/components/ui'
import { useCallback, useState } from 'react'
import BasicInfo from './CustomersForm/BasicInfo'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import AdditionInfo from './CustomersForm/AdditionalInfo'
import AddressInfo from './CustomersForm/AddressInfo'
import FeesInfo from './CustomersForm/FeesInfo'
import { getCustomers, useAppDispatch, useAppSelector } from '../Store'
import AddNewCustomerModal from '../../DealerSharedComponent/AddNewCustomerModal'

export type FormFieldsName = {
    // Basic Info
    firstName: string;
    lastName: string;
    phoneNumber: Array<{
        type: string;
        number: number;
    }>;
    email: string[];
    preferredContactMethod: string
    tags?: string;
    note?: string;
    referralSource?: string;
    company?: string;
    fleet?: string;
    paymentTerms?: string;
    customerAddress: {
        country: string;
        address1: string;
        address2?: string; // Optional if secondary address is not always required
        city: string;
        state: string;
        zipCode: string; // Assuming zipCode is a string due to potential formatting
    };
};


export const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    phoneNumber: Yup.array()
        .of(
            Yup.object().shape({
                type: Yup.string().required('Phone type is required'),
                number: Yup.number()
                    .typeError('Contact Number must be a number')
                    .max(9999999999, 'Contact Number must be less than 10 digits'),
            }),
        )
        .min(1, 'At least one phone number is required'),
    email: Yup.array()
        .of(Yup.string().email('Invalid email').required('Email is required'))
        .min(1, 'At least one email is required'),
    preferredContactMethod: Yup.string(),
    tags: Yup.string(),
    note: Yup.string(),
    referralSource: Yup.string(),
    company: Yup.string(),
    fleet: Yup.string(),
    paymentTerms: Yup.string(),
    address1: Yup.string(),
    address2: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    zipCode: Yup.string(),
})

const CustomersStatistics = () => {
    const [showForm, setShowForm] = useState(false)
    const [showFees, setShowFees] = useState(false)

    const dispatch = useAppDispatch()
    const filterData = useAppSelector((state) => state.list.filterData);
    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.list.customerTableData
    );

    const fetchData = useCallback(() => {
        dispatch(getCustomers({ pageIndex, pageSize, sort, query, filterData }))
    }, [pageIndex, pageSize, sort, query, filterData, dispatch])
    // Toggle form on button click
    const handleButtonClick = () => {
        setShowForm(!showForm) // Toggle form visibility
    }

    const initialValues = {
        firstName: '',
        lastName: '',
        phoneNumber: [{ type: 'mobile', number: '' }], // `number` is initialized with 0
        email: [''],
        preferredContactMethod: '', // Default to 'both' or another valid option if needed
        tags: '',
        note: '',
        referralSource: '',
        company: '',
        fleet: '',
        paymentTerms: '',
        customerAddress: {
            country: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            zipCode: '',
        }
    }

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">Customers</h2>
                <Button
                    variant="solid"
                    type="button"
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium flex items-center gap-1 px-3 py-1.5"
                    onClick={handleButtonClick}
                >
                    <HiPlusCircle className="h-4 w-4" />
                    New Customer
                </Button>

                {showForm && <AddNewCustomerModal handleButtonClick={handleButtonClick} />}
            </div>
        </div>
    )
}

export default CustomersStatistics
