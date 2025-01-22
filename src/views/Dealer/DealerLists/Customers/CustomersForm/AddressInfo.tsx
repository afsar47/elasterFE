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
import { HiX } from 'react-icons/hi'
// import FeesInfo from './FeesInfo'

const AddressInfo = () => {
    const [showAddress, setShowAddress] = useState(false)
    
    return (
        <AdaptableCard>
            {/* Address Section */}
            <div className="mb-4">
                <button
                    type="button"
                    className="w-full flex justify-between items-center bg-gray-200 p-2 rounded-md border border-gray-300 hover:bg-gray-300"
                    onClick={() => setShowAddress(!showAddress)}
                >
                    <span>Address</span>
                    <span>{showAddress ? <HiX /> : '+'}</span>
                </button>
                {showAddress && (
                    <>
                        {/* Country */}
                        <FormItem label="Country" className='mt-4'>
                            <Field
                                as="select"
                                name="country"
                                className="border border-gray-300 outline-none bg-slate-50 p-1 rounded-md focus:ring-2 focus:ring-indigo-500  w-full h-11"
                            >
                                <option value="" disabled>
                                    Select Country
                                </option>
                                <option value="India">India</option>
                                <option value="USA">USA</option>
                                {/* Add more countries as needed */}
                            </Field>
                        </FormItem>

                        {/* Address 1 */}
                        <FormItem
                            label="Address 1"
                            // invalid={(errors.address1 && touched.address1) as boolean}
                            // errorMessage={errors.address1}
                        >
                            <Field
                                type="text"
                                name="address1"
                                placeholder="Address 1"
                                component={Input}
                                className="border border-gray-300 outline-none bg-slate-50 p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full"
                            />
                        </FormItem>

                        {/* Address 2 */}
                        <FormItem
                            label="Address 2"
                            // invalid={(errors.address2 && touched.address2) as boolean}
                            // errorMessage={errors.address2}
                        >
                            <Field
                                type="text"
                                name="address2"
                                placeholder="Address 2"
                                component={Input}
                                className="border border-gray-300 outline-none bg-slate-50 p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full"
                            />
                        </FormItem>

                        {/* City, State, and Zip - Same Line */}
                        <div className="grid grid-cols-4 gap-4 mb-4">
                            <div className="col-span-2">
                                <FormItem
                                    label="City"
                                    // invalid={(errors.city && touched.city) as boolean}
                                    // errorMessage={errors.city}
                                >
                                    <Field
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        component={Input}
                                        className="border border-gray-300 outline-none bg-slate-50 p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full"
                                    />
                                </FormItem>
                            </div>
                            <div className="col-span-1">
                                <FormItem
                                    label="State"
                                    // invalid={(errors.state && touched.state) as boolean}
                                    // errorMessage={errors.state}
                                >
                                    <Field
                                        type="text"
                                        name="state"
                                        placeholder="State"
                                        component={Input}
                                        className="border border-gray-300 outline-none bg-slate-50 p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full"
                                    />
                                </FormItem>
                            </div>
                            <div className="col-span-1">
                                <FormItem
                                    label="ZipCode"
                                    // invalid={(errors.zip && touched.zip) as boolean}
                                    // errorMessage={errors.zip}
                                >
                                    <Field
                                        type="text"
                                        name="zipCode"
                                        placeholder="ZipCode"
                                        component={Input}
                                        className="border border-gray-300 outline-none bg-slate-50 p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full"
                                    />
                                </FormItem>
                            </div>
                        </div>
                    </>
                )}
            </div>

            
        </AdaptableCard>
    )
}

export default AddressInfo
