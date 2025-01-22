import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import {
    Field,
    FormikErrors,
    FormikTouched,
    FormikProps,
    Formik,
    FieldArray,
} from 'formik'
import { useState } from 'react'
import { HiDocumentText, HiMail, HiX } from 'react-icons/hi'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import { useFormikContext } from 'formik'
// import AddressInfo from './AddressInfo'
// import Dialog from '@/components/ui/Dialog';

interface FormFieldsName {
    phoneNumbers: Array<{
        type: string
        number: string
    }>
    email: string[]
    tags?: string[]
    notes?: string
    referralSource?: string
    company?: string
    fleet?: string
    paymentTerms?: 'onReceipt' | 'net30' | 'net60'
    address?: string
    fees?: number
}

// type AdditionalInfo = {
//     touched: FormikTouched<FormFieldsName>
//     errors: FormikErrors<FormFieldsName>
// }

const AdditionInfo = () => {
    const [showAdditionalInfo, setShowAdditionalInfo] = useState(false)
    const [isTagDialogOpen, setIsTagDialogOpen] = useState(false)
    const [isReferralDialogOpen, setIsReferralDialogOpen] = useState(false)
    const [isFleetDialogOpen, setIsFleetDialogOpen] = useState(false)
    const [selectedContact, setSelectedContact] = useState<string | null>(null)
    const { values, setFieldValue } = useFormikContext<any>()

    const initialValues: FormFieldsName = {
        phoneNumbers: [{ type: '', number: '' }], // Default one phone number
        email: [''], // Default one email
         tags: [],
        paymentTerms: 'onReceipt'
    }

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={(values, { resetForm }) => {
                resetForm()
            }}
            // Add your form submission logic here
        >
            {({ touched, errors }) => (
                <AdaptableCard>
                    <div className="mb-4">
                        <button
                            type="button"
                            className="w-full flex justify-between items-center bg-gray-200 p-2 rounded-md border border-gray-300 hover:bg-gray-300"
                            onClick={() =>
                                setShowAdditionalInfo(!showAdditionalInfo)
                            }
                        >
                            <span>Additional Info</span>
                            <span>{showAdditionalInfo ? <HiX /> : '+'}</span>
                        </button>

                        {showAdditionalInfo && (
                            <div className="mt-4">
                                {/* Tag FormItem */}
                                <FormItem label="Tag">
                                    <button
                                        type="button"
                                        onClick={() => setIsTagDialogOpen(true)}
                                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                    >
                                        <span>+</span> Add Tag
                                    </button>
                                </FormItem>

                                {/* Tag Dialog */}
                                {isTagDialogOpen && (
                                    <div
                                        className="fixed inset-0 flex items-center justify-center z-50"
                                        onClick={() =>
                                            setIsTagDialogOpen(false)
                                        }
                                    >
                                        <div
                                            className="bg-gray-50 p-6 rounded-md shadow-lg w-96 z-60 relative"
                                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the dialog
                                        >
                                            <h2 className="text-lg font-medium mb-4">
                                                Add Tag
                                            </h2>
                                            <FormItem label="Tag Name">
                                                <Input
                                                    placeholder=""
                                                    className=" bg-slate-100"
                                                />
                                            </FormItem>
                                            <div className="flex justify-end gap-2 mt-4">
                                                <Button
                                                    onClick={() =>
                                                        setIsTagDialogOpen(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="solid"
                                                    onClick={() =>
                                                        setIsTagDialogOpen(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    Save
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Notes Field */}
                                <FormItem label="Notes">
                                    <Field
                                        as="textarea"
                                        name="note"
                                        placeholder="Add a note..."
                                        rows={3}
                                        className="w-full bg-slate-50 border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 resize-none"
                                    />
                                </FormItem>

                                {/* Referral Source Dropdown */}
                                <FormItem label="Referral Source">
                                    <Field
                                        as="select"
                                        name="referralSource"
                                        className="border border-gray-300 outline-none p-1 rounded-md focus:ring-0 focus:ring-blue-300 bg-slate-50 h-11 w-full"
                                    >
                                        <option value="" disabled>
                                            Select Referral Source
                                        </option>
                                        <option value="friend">Friend</option>
                                        <option value="online">Online</option>
                                        <option value="other">Other</option>
                                    </Field>
                                    <div className="flex justify-start mt-2">
                                        <button
                                            type="button"
                                            className="text-blue-600 hover:text-blue-700"
                                            onClick={() =>
                                                setIsReferralDialogOpen(true)
                                            }
                                        >
                                            New Referral Source
                                        </button>
                                    </div>
                                </FormItem>

                                {/* Referral Source Dialog */}
                                {isReferralDialogOpen && (
                                    <div
                                        className="fixed inset-0 flex items-center justify-center z-50"
                                        onClick={() =>
                                            setIsReferralDialogOpen(false)
                                        }
                                    >
                                        <div
                                            className="bg-gray-50 p-6 rounded-md shadow-lg w-96 z-60 relative"
                                            onClick={(e) => e.stopPropagation()} // Prevent click from closing the dialog when inside
                                        >
                                            <h2 className="text-lg font-medium mb-4">
                                                New Referral Source
                                            </h2>

                                            <FormItem label="Name">
                                                <Input
                                                    placeholder=""
                                                    className="bg-slate-100"
                                                />
                                            </FormItem>
                                            <div className="flex justify-end gap-2 mt-4">
                                                <Button
                                                    onClick={() =>
                                                        setIsReferralDialogOpen(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="solid"
                                                    onClick={() =>
                                                        setIsReferralDialogOpen(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    Save
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Company Field */}
                                <FormItem label="Company">
                                    <Field
                                        type="text"
                                        name="company"
                                        placeholder="Enter company name"
                                        component={Input}
                                        className="border border-gray-300 outline-none p-1 rounded-md focus:ring-0 focus:ring-blue-300 bg-slate-50 w-full"
                                    />
                                </FormItem>

                                {/* Fleet Dropdown */}
                                <FormItem label="Fleet">
                                    <Field
                                        as="select"
                                        name="fleet"
                                        className="border border-gray-300 outline-none p-1 rounded-md focus:ring-0 focus:ring-blue-300 bg-slate-50 h-11 w-full"
                                    >
                                        <option value="" disabled>Select Fleet</option>
                                        <option value="small">Small</option>
                                        <option value="medium">Medium</option>
                                        <option value="large">Large</option>
                                    </Field>
                                    <div className="flex justify-start mt-2">
                                        <button
                                            type="button"
                                            className="text-blue-600 hover:text-blue-700"
                                            onClick={() =>
                                                setIsFleetDialogOpen(true)
                                            }
                                        >
                                            New Fleet
                                        </button>
                                    </div>
                                </FormItem>
                                {/* Fleet Dialog */}
                                {isFleetDialogOpen && (
                                    <div
                                        className="fixed inset-0 flex items-center justify-center z-50"
                                        onClick={() =>
                                            setIsFleetDialogOpen(false)
                                        }
                                    >
                                        <div
                                            className="bg-gray-50 p-6 rounded-md shadow-lg w-96 z-60 relative"
                                            onClick={(e) => e.stopPropagation()} // Prevent click from closing the dialog when inside
                                        >
                                            <h2 className="text-lg font-medium mb-4">
                                                New Fleet
                                            </h2>

                                            <div className="grid grid-cols-1 gap-4">
                                                <FormItem
                                                    label="Company Name"
                                                    // invalid={(errors.companyName && touched.companyName) as boolean}
                                                    // errorMessage={errors.companyName}
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="companyName"
                                                        placeholder="Company"
                                                        component={Input}
                                                        className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                                                        required
                                                    />
                                                </FormItem>
                                            </div>
                                            {/* Phone Numbers Section */}
                                            <FieldArray name="phoneNumbers">
                                                {({ push, remove }) => (
                                                    <div className="mb-4">
                                                        <label className="block mb-2 focus:ring-0 focus:ring-blue-300 bg-slate-50">
                                                            Phone Numbers
                                                        </label>

                                                        <Field name="phoneNumbers">
                                                            {({
                                                                form,
                                                            }: {
                                                                form: FormikProps<FormFieldsName>
                                                            }) => (
                                                                <div className="-space-y-2">
                                                                    {form.values.phoneNumbers?.map(
                                                                        (
                                                                            phone,
                                                                            index,
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className="flex items-start gap-2"
                                                                            >
                                                                                <div className="flex-1 grid grid-cols-4 gap-2">
                                                                                    <FormItem className="col-span-1">
                                                                                        <Field
                                                                                            as="select"
                                                                                            name={`phoneNumbers.${index}.type`}
                                                                                            className="border border-gray-300 outline-none p-1 rounded-md focus:ring-0 focus:ring-blue-300 bg-slate-50 w-full h-11"
                                                                                        >
                                                                                            <option value="mobile">
                                                                                                Mobile
                                                                                            </option>
                                                                                            <option value="work">
                                                                                                Work
                                                                                            </option>
                                                                                            <option value="home">
                                                                                                Home
                                                                                            </option>
                                                                                            <option value="office">
                                                                                                Office
                                                                                            </option>
                                                                                            <option value="other">
                                                                                                Other
                                                                                            </option>
                                                                                        </Field>
                                                                                    </FormItem>

                                                                                    <FormItem className="col-span-3">
                                                                                        <Field
                                                                                            type="text"
                                                                                            name={`phoneNumbers.${index}.number`}
                                                                                            placeholder="Phone Number"
                                                                                            component={
                                                                                                Input
                                                                                            }
                                                                                            className="border border-gray-300 outline-none p-1 rounded-md focus:ring-0 focus:ring-blue-300 bg-slate-50"
                                                                                        />
                                                                                    </FormItem>
                                                                                </div>

                                                                                {index >
                                                                                    0 && (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() =>
                                                                                            remove(
                                                                                                index,
                                                                                            )
                                                                                        }
                                                                                        className="text-black-500 hover:text-blue-700 hover:bg-gray-100 p-2 mt-1"
                                                                                    >
                                                                                        <HiX className="h-5 w-5" />
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        ),
                                                                    )}

                                                                    {/* Add Phone Button */}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            push(
                                                                                {
                                                                                    type: '',
                                                                                    number: '',
                                                                                },
                                                                            )
                                                                        }
                                                                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                                                    >
                                                                        Add
                                                                        Phone
                                                                        Number
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </Field>
                                                    </div>
                                                )}
                                            </FieldArray>

                                            {/* Email Section */}
                                            <FieldArray name="email">
                                                {({ push, remove }) => (
                                                    <div className="mb-4">
                                                        <label className="block mb-2 font-medium">
                                                            Email Addresses
                                                        </label>

                                                        <Field name="email">
                                                            {({
                                                                form,
                                                            }: {
                                                                form: FormikProps<FormFieldsName>
                                                            }) => (
                                                                <div className="-space-y-2">
                                                                    {form.values.email?.map(
                                                                        (
                                                                            email,
                                                                            index,
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className="flex items-center gap-2"
                                                                            >
                                                                                <FormItem
                                                                                    className="flex-1"
                                                                                    // invalid={
                                                                                    //     touched.email &&
                                                                                    //     Boolean(
                                                                                    //         errors
                                                                                    //             .email?.[
                                                                                    //             index
                                                                                    //         ],
                                                                                    //     )
                                                                                    // }
                                                                                    // errorMessage={
                                                                                    //     errors.email
                                                                                    // }
                                                                                >
                                                                                    <Field
                                                                                        type="email"
                                                                                        name={`email.${index}`}
                                                                                        placeholder="Enter email address"
                                                                                        component={
                                                                                            Input
                                                                                        }
                                                                                        className="border border-gray-300 outline-none p-1 rounded-md focus:ring-0 focus:ring-blue-300 bg-slate-50"
                                                                                    />
                                                                                </FormItem>

                                                                                {index >
                                                                                    0 && (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() =>
                                                                                            remove(
                                                                                                index,
                                                                                            )
                                                                                        }
                                                                                        className="-mt-6 text-black-500 hover:text-blue-700 hover:bg-gray-100 p-2"
                                                                                    >
                                                                                        <HiX className="h-5 w-5" />
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            )}
                                                        </Field>

                                                        {/* Add Email Button */}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                push('')
                                                            }
                                                            className="-mt-2 text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                                        >
                                                            Add Email
                                                        </button>
                                                    </div>
                                                )}
                                            </FieldArray>

                                            {/* Preferred Contact Method */}
                                            <FormItem label="Preferred Contact Method">
                                                <div className="grid grid-cols-3 gap-4 mb-4">
                                                    <button
                                                        type="button"
                                                        className={`flex items-center justify-center border border-gray-300 p-2 rounded-md w-full 
                                    ${selectedContact === 'sms' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'} 
                                    hover:bg-blue-100 focus:ring-0 border-blue-500 hover:text-blue-600`}
                                                        onClick={() =>
                                                            setSelectedContact(
                                                                'sms',
                                                            )
                                                        }
                                                    >
                                                        <HiDocumentText className="mr-2" />
                                                        <span>SMS</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className={`flex items-center justify-center border border-gray-300 p-2 rounded-md w-full 
                                    ${selectedContact === 'email' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'} 
                                    hover:bg-blue-100 focus:ring-0 border-blue-500 hover:text-blue-600`}
                                                        onClick={() =>
                                                            setSelectedContact(
                                                                'email',
                                                            )
                                                        }
                                                    >
                                                        <HiMail className="mr-2" />
                                                        <span>Email</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className={`flex items-center justify-center border border-gray-300 p-2 rounded-md w-full 
                                    ${selectedContact === 'call' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'} 
                                    hover:bg-blue-100 focus:ring-0 border-blue-500 hover:text-blue-600`}
                                                        onClick={() =>
                                                            setSelectedContact(
                                                                'call',
                                                            )
                                                        }
                                                    >
                                                        <span>Both</span>
                                                    </button>
                                                </div>
                                            </FormItem>

                                            <div className="flex justify-end gap-2 mt-4">
                                                <Button
                                                    onClick={() =>
                                                        setIsFleetDialogOpen(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="solid"
                                                    onClick={() =>
                                                        setIsFleetDialogOpen(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    Save
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Payment Terms Dropdown */}
                                <FormItem label="Payment Terms">
                                    <Field
                                        as="select"
                                        name="paymentTerms"
                                        className="border border-gray-300 outline-none p-1 rounded-md focus:ring-0 focus:ring-blue-300 bg-slate-50 h-11 w-full"
                                    >
                                        <option value="receipt">Receipt</option>
                                        <option value="net30">Net 30</option>
                                        <option value="net60">Net 60</option>
                                    </Field>
                                </FormItem>
                                <div className="flex items-center -mt-5">
                                    <Field
                                        type="checkbox"
                                        name="onShopDefault"
                                        className="mr-2"
                                        // onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        //     setFieldValue('onShopDefault', e.target.checked);
                                        //     if (e.target.checked) {
                                        //         setFieldValue('paymentTerms', 'receipt');
                                        //     }
                                        // }}
                                    />
                                    <label>On Shop Default</label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* <AddressInfo/> */}
                </AdaptableCard>
            )}
        </Formik>
    )
}

export default AdditionInfo
