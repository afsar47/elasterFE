import AdaptableCard from '@/components/shared/AdaptableCard'
import RichTextEditor from '@/components/shared/RichTextEditor'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import {
    Field,
    FormikErrors,
    FormikTouched,
    FieldProps,
    FieldInputProps,
} from 'formik'
import { useState, type ComponentType } from 'react'
import type { InputProps } from '@/components/ui/Input'
import { HiDocumentText, HiMail } from 'react-icons/hi'
import { values } from 'lodash'

type FormFieldsName = {
    companyName: string
    lastName: string
    phoneType: string
    phoneNumber: number
    email: string
    additionalInfo: string
    address: string
    fees: number
}

type BasicInfo = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
}
const partInput = (props: InputProps) => {
    return <Input {...props} value={props.field.value} prefix="" />
}

const NumberInput = (props: InputProps) => {
    return <Input {...props} value={props.field.value} />
}

const NumericFormatInput = ({
    onValueChange,
    ...rest
}: Omit<NumericFormatProps, 'form'> & {
    form: any
    field: FieldInputProps<unknown>
}) => {
    return (
        <NumericFormat
            customInput={Input as ComponentType}
            type="text"
            autoComplete="off"
            onValueChange={onValueChange}
            {...rest}
        />
    )
}

const BasicInfo = (props: BasicInfo) => {
    const { touched, errors } = props
    const [selectedContact, setSelectedContact] = useState<string | null>(null)
    const [showAdditionalInfo, setShowAdditionalInfo] = useState(false)
    const [showAddress, setShowAddress] = useState(false)
    const [showFees, setShowFees] = useState(false)

    function setFieldValue(arg0: string, arg1: string): void {
        throw new Error('Function not implemented.')
    }

    return (
        <AdaptableCard divider className="mb-4 p-4">
            {/* First Name and Last Name - Same Line */}
            <div className="grid grid-cols-1 gap-4 ">
                <FormItem
                    label="Company Name"
                    invalid={(errors.companyName && touched.companyName) as boolean}
                    errorMessage={errors.companyName}
                >
                    <Field
                        type="text"
                        autoComplete="off"
                        name="companyName"
                        placeholder="Company"
                        component={Input}
                        className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </FormItem>

            </div>

            {/* Phone Section */}

            <div className="grid grid-cols-4 gap-4">
                {/* Phone Type (1/4 width) */}
                <div className="col-span-1">
                    <FormItem
                        label="Phone"
                        invalid={
                            (errors.phoneType && touched.phoneType) as boolean
                        }
                        errorMessage={errors.phoneType}
                    >
                        <Field
                            as="select"
                            name="phoneType"
                            className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full h-11"
                        >
                            <option value="" disabled>
                                Mobile
                            </option>
                            <option value="work">Work</option>
                            <option value="home">Home</option>
                            <option value="office">Office</option>
                            <option value="other">Other</option>
                        </Field>
                    </FormItem>
                </div>

                {/* Phone Number (3/4 width) */}
                <div className="col-span-3">
                    <FormItem
                        label=""
                        invalid={
                            (errors.phoneNumber &&
                                touched.phoneNumber) as boolean
                        }
                        errorMessage={errors.phoneNumber}
                    >
                        <Field
                            name="phoneNumber"
                            component={partInput}
                            placeholder="Phone Number"
                            className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full mt-5"
                        />
                    </FormItem>
                </div>
            </div>

            {/* Email Field */}
            <FormItem
                label="Email"
                invalid={(errors.email && touched.email) as boolean}
                errorMessage={errors.email}
            >
                <Field
                    type="email"
                    autoComplete="off"
                    name="email"
                    placeholder="Email"
                    component={Input}
                    className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full"
                />
            </FormItem>

            {/* Continue with Additional Info, Address, etc. */}
            <FormItem label="Preferred Contact Method">
                <div className="grid grid-cols-3 gap-4 mb-4">
                    {/* SMS Button */}
                    <button
                        type="button"
                        className={`flex items-center justify-center border border-gray-300 p-2 rounded-md w-full 
                ${selectedContact === 'sms' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'} 
                hover:bg-blue-100 focus:ring-1 border-blue-500 hover:text-blue-600`}
                        onClick={() => setSelectedContact('sms')}
                    >
                        <HiDocumentText className="mr-2" />
                        <span>SMS</span>
                    </button>

                    {/* Email Button */}
                    <button
                        type="button"
                        className={`flex items-center justify-center border border-gray-300 p-2 rounded-md w-full 
                ${selectedContact === 'email' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'} 
                hover:bg-blue-100 focus:ring-1 border-blue-500 hover:text-blue-600`}
                        onClick={() => setSelectedContact('email')}
                    >
                        <HiMail className="mr-2" />
                        <span>Email</span>
                    </button>

                    {/* Both Button */}
                    <button
                        type="button"
                        className={`flex items-center justify-center border border-gray-300 p-2 rounded-md w-full 
                ${selectedContact === 'both' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'} 
                hover:bg-blue-100 focus:ring-1 border-blue-500 hover:text-blue-600`}
                        onClick={() => setSelectedContact('both')}
                    >
                        <span>Both</span>
                    </button>
                </div>
            </FormItem>
            {/* Additional Info */}
            <div className="mb-4">
                <button
                    type="button"
                    className="w-full flex justify-between items-center bg-gray-100 p-2 rounded-md border border-gray-300 focus:outline-none"
                    onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
                >
                    <span>Additional Info</span>
                    <span>{showAdditionalInfo ? '-' : '+'}</span>
                </button>

                {showAdditionalInfo && (
                    <div className="mt-2 p-2 border border-gray-300 rounded-md">
                        <FormItem
                            label="Details"
                            invalid={
                                (errors.additionalInfo &&
                                    touched.additionalInfo) as boolean
                            }
                            errorMessage={errors.additionalInfo}
                        >
                            <Field
                                type="text"
                                name="additionalInfo"
                                placeholder="Enter additional info"
                                component={Input}
                                className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full"
                            />
                        </FormItem>
                    </div>
                )}
            </div>

            {/* Address */}
            <div className="mb-4">
                <button
                    type="button"
                    className="w-full flex justify-between items-center bg-gray-100 p-2 rounded-md border border-gray-300 focus:outline-none"
                    onClick={() => setShowAddress(!showAddress)}
                >
                    <span>Address</span>
                    <span>{showAddress ? '-' : '+'}</span>
                </button>

                {showAddress && (
                    <div className="mt-2 p-2 border border-gray-300 rounded-md">
                        <FormItem
                            label="Address"
                            invalid={
                                (errors.address && touched.address) as boolean
                            }
                            errorMessage={errors.address}
                        >
                            <Field
                                type="text"
                                name="address"
                                placeholder="Enter address"
                                component={Input}
                                className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full"
                            />
                        </FormItem>
                    </div>
                )}
            </div>

            {/* Fees & Rates */}
            <div className="mb-4">
                <button
                    type="button"
                    className="w-full flex justify-between items-center bg-gray-100 p-2 rounded-md border border-gray-300 focus:outline-none"
                    onClick={() => setShowFees(!showFees)}
                >
                    <span>Fees & Rates</span>
                    <span>{showFees ? '-' : '+'}</span>
                </button>

                {showFees && (
                    <div className="mt-2 p-2 border border-gray-300 rounded-md">
                        <FormItem
                            label="Fees & Rates"
                            invalid={(errors.fees && touched.fees) as boolean}
                            errorMessage={errors.fees}
                        >
                            <Field
                                type="number"
                                name="fees"
                                placeholder="Enter fees and rates"
                                component={Input}
                                className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full"
                            />
                        </FormItem>
                    </div>
                )}
            </div>
        </AdaptableCard>
    )
}

export default BasicInfo
