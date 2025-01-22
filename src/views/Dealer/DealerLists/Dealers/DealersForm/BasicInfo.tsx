import AdaptableCard from '@/components/shared/AdaptableCard'
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

type FormFieldsName = {
    vendorName: string,
    vendorUrl: string,
    vendorAccountNumber: number,
    vendorAddress1: string,
    vendorAddress2: string,
    vendorCountry: string,
    vendorCity: string,
    vendorState: string,
    vendorZipCode: string
    vendorContactPerson: {
        firstName: '',
        lastName: '',
        contactType: '',
        contactNumber: '',
        email: '',
    }
}

type BasicInfo = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
}

const BasicInfo = (props: BasicInfo) => {
    const { touched, errors } = props
    const [selectedContact, setSelectedContact] = useState<string | null>(null)
    const [showContactPersonForm, setShowContactPersonForm] = useState(false)

    return (
        <AdaptableCard divider className="mb-4 p-4">
            {/* Name and URL - Same Line */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <FormItem
                    label="Name"
                    invalid={(errors.vendorName && touched.vendorName) as boolean}
                    errorMessage={errors.vendorName}
                >
                    <Field
                        type="text"
                        autoComplete="off"
                        name="vendorName"
                        placeholder="Vendor Name"
                        component={Input}
                        className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500"
                    />
                </FormItem>
                <FormItem
                    label="URL"
                    invalid={(errors.vendorUrl && touched.vendorUrl) as boolean}
                    errorMessage={errors.vendorUrl}
                >
                    <Field
                        type="text"
                        autoComplete="off"
                        name="vendorUrl"
                        placeholder="URL"
                        component={Input}
                        className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500"
                    />
                </FormItem>
            </div>

            {/* Account Number - Single Line */}
            <FormItem
                label="Account Number"
                invalid={
                    (errors.vendorAccountNumber && touched.vendorAccountNumber) as boolean
                }
                errorMessage={errors.vendorAccountNumber}
            >
                <Field
                    type="text"
                    name="vendorAccountNumber"
                    placeholder="Account Number"
                    component={Input}
                    className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full"
                />
            </FormItem>

            {/* Country - Dropdown */}
            <FormItem
                label="Country"
                invalid={(errors.vendorCountry && touched.vendorCountry) as boolean}
                errorMessage={errors.vendorCountry}
            >
                <Field
                    as="select"
                    name="vendorCountry"
                    className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full h-11"
                >
                    {/* Add all country options here */}
                    <option value="" disabled>
                        Select Country
                    </option>
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    {/* Add more countries as needed */}
                </Field>
            </FormItem>

            {/* Address 1 - Single Line */}
            <FormItem
                label="Address 1"
                invalid={(errors.vendorAddress1 && touched.vendorAddress1) as boolean}
                errorMessage={errors.vendorAddress1}
            >
                <Field
                    type="text"
                    name="vendorAddress1"
                    placeholder="Address 1"
                    component={Input}
                    className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full"
                />
            </FormItem>

            {/* Address 2 - Single Line */}
            <FormItem
                label="Address 2"
                invalid={(errors.vendorAddress2 && touched.vendorAddress2) as boolean}
                errorMessage={errors.vendorAddress2}
            >
                <Field
                    type="text"
                    name="vendorAddress2"
                    placeholder="Address 2"
                    component={Input}
                    className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full"
                />
            </FormItem>

            {/* City, State, and Zip - Same Line */}
            <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="col-span-2">
                    <FormItem
                        label="City"
                        invalid={(errors.vendorCity && touched.vendorCity) as boolean}
                        errorMessage={errors.vendorCity}
                    >
                        <Field
                            type="text"
                            name="vendorCity"
                            placeholder="City"
                            component={Input}
                            className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full"
                        />
                    </FormItem>
                </div>
                <div className="col-span-1">
                    <FormItem
                        label="State"
                        invalid={(errors.vendorState && touched.vendorState) as boolean}
                        errorMessage={errors.vendorState}
                    >
                        <Field
                            type="text"
                            name="vendorState"
                            placeholder="State"
                            component={Input}
                            className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full"
                        />
                    </FormItem>
                </div>

                <div className="col-span-1">
                    <FormItem
                        label="Zip"
                        invalid={(errors.vendorZipCode && touched.vendorZipCode) as boolean}
                        errorMessage={errors.vendorZipCode}
                    >
                        <Field
                            type="text"
                            name="vendorZipCode"
                            placeholder="Zip"
                            component={Input}
                            className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full"
                        />
                    </FormItem>
                </div>
            </div>

            {/* Contact Person - Always Visible */}
            <div className="mb-4">
                <button
                    type="button"
                    className="w-full flex justify-between items-center bg-gray-100 p-2 rounded-md border border-gray-300 focus:outline-none"
                    onClick={() =>
                        setShowContactPersonForm(!showContactPersonForm)
                    }
                >
                    <span>Contact Person</span>
                    <span>{showContactPersonForm ? '-' : '+'}</span>
                </button>

                {showContactPersonForm && (
                    <div className="mt-2 p-2 border border-gray-300 rounded-md">
                        {/* First Name and Last Name - Same Line */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <FormItem
                                label="First Name"
                                invalid={
                                    (errors.vendorContactPerson?.firstName &&
                                        touched.vendorContactPerson?.firstName) as boolean
                                }
                                errorMessage={errors.vendorContactPerson?.firstName}
                            >
                                <Field
                                    type="text"
                                    name="vendorContactPerson.firstName"
                                    placeholder="First Name"
                                    component={Input}
                                    className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full"
                                />
                            </FormItem>
                            <FormItem
                                label="Last Name"
                                invalid={
                                    (errors.vendorContactPerson?.lastName &&
                                        touched.vendorContactPerson?.lastName) as boolean
                                }
                                errorMessage={errors.vendorContactPerson?.lastName}
                            >
                                <Field
                                    type="text"
                                    name="vendorContactPerson.lastName"
                                    placeholder="Last Name"
                                    component={Input}
                                    className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full"
                                />
                            </FormItem>
                        </div>

                        {/* Phone Type and Phone Number - Same Line */}
                        <div className="grid grid-cols-4 gap-4">
                            {/* Phone Type (1/4 width) */}
                            <div className="col-span-1">
                                <FormItem
                                    label="Phone"
                                    invalid={
                                        (errors.vendorContactPerson?.contactType &&
                                            touched.vendorContactPerson?.contactType) as boolean
                                    }
                                    errorMessage={errors.vendorContactPerson?.contactType}
                                >
                                    <Field
                                        as="select"
                                        name="vendorContactPerson.contactType"
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
                                        (errors.vendorContactPerson?.contactNumber &&
                                            touched.vendorContactPerson?.contactNumber) as boolean
                                    }
                                    errorMessage={errors.vendorContactPerson?.contactNumber}
                                >
                                    <Field
                                        name="vendorContactPerson.contactNumber"
                                        component={Input}
                                        placeholder="Phone Number"
                                        className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full mt-5"
                                    />
                                </FormItem>
                            </div>
                        </div>

                        {/* Email */}
                        <FormItem
                            label="Email"
                            invalid={(errors.vendorContactPerson?.email && touched.vendorContactPerson?.email) as boolean}
                            errorMessage={errors.vendorContactPerson?.email}
                        >
                            <Field
                                type="email"
                                name="vendorContactPerson.email"
                                placeholder="Email"
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
