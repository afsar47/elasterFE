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
    ErrorMessage,
} from 'formik'
import { useCallback, useEffect, useState, type ComponentType } from 'react'
import type { InputProps } from '@/components/ui/Input'
import { Button } from '@/components/ui'
import SelectAndButton from '@/components/ui/SelectAndButton'
import AddNewBrandModal from '../../DealerSharedComponent/AddNewBrandModal'
import { getAllBrands, getAllCategtories, getAllVendors, setAllBrandsData, useAppDispatch, useAppSelector } from '../store'

type FormFieldsName = {
    partName: string
    note: string
    partSerialNo: number
    partSku: number
    url: string
    quantity: number
    minQuantity: number
    maxQuantity: number
    vendor: string
    bin: number
    cost: number
    retail: number
    category: string
    brand: string
    markup: number
    margin: number
}

type BasicInfo = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    setFieldValue: (field: keyof FormFieldsName, value: any, shouldValidate?: boolean) => void;
    setAddBrandModelOpen: (open: boolean) => void;
    setAddVendorModelOpen: (open: boolean) => void;
    setAddCategoryModelOpen: (open: boolean) => void;
}

const partInput = (props: InputProps) => {
    return <Input {...props} value={props.field.value} prefix="" />
}

const NumberInput = (props: InputProps) => {
    return <Input {...props} value={props.field.value} />
}

const PriceInput = (props: InputProps) => {
    return <Input {...props} value={props.field.value} prefix="$" />
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
const MarginInput = (props: InputProps) => {
    return <Input {...props} value={props.field.value} suffix="%" />
}

const BasicInfo = (props: BasicInfo) => {
    const dispatch = useAppDispatch()
    const { touched, errors, setFieldValue, setAddBrandModelOpen, setAddVendorModelOpen, setAddCategoryModelOpen } = props

    const allBrands: any = useAppSelector((state) => state.inventory.allBrands);
    const allVendors: any = useAppSelector((state) => state.inventory.allVendors);
    const allCategtories: any = useAppSelector((state) => state.inventory.allCategories);

    const fetchData = useCallback(() => {
        dispatch(getAllBrands())
        dispatch(getAllVendors())
        dispatch(getAllCategtories('forDropDown'))
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])


    return (
        <>
            <AdaptableCard divider className="mb-4 p-4">
                {/* Part Name and Brand */}
                <FormItem
                    label="Part Name"
                    invalid={(errors.partName && touched.partName) as boolean}
                    errorMessage={errors.partName}
                >
                    <Field
                        type="text"
                        autoComplete="off"
                        name="partName"
                        placeholder="Part Name"
                        component={Input}
                        className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-3/4 "
                        required
                    />
                </FormItem>

                <FormItem label="Brand"
                    invalid={(errors.brand && touched.brand) as boolean}
                    errorMessage={errors.brand}
                >
                    <SelectAndButton
                        options={allBrands}
                        addNewButtonLabel="Add New Brand"
                        onChange={(value: any) => setFieldValue('brand', value.value)}
                        placeholder="Select or Add Brand"
                        addNewClick={() => setAddBrandModelOpen(true)}
                        className="mb-4"
                    />
                    <ErrorMessage name="customer" component="div" className="text-red-500 text-sm mb-2" />
                </FormItem>
 

                {/* Part# and SKU */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <FormItem
                        label="Part #"
                        invalid={(errors.partSerialNo && touched.partSerialNo) as boolean}
                        errorMessage={errors.partSerialNo}
                    >
                        <Field
                            name="partSerialNo"
                            type="number"
                            autoComplete="off"
                            component={Input}
                            placeholder="Part #"
                            className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500"
                        />
                    </FormItem>

                    <FormItem
                        label="SKU"
                        invalid={(errors.partSku && touched.partSku) as boolean}
                        errorMessage={errors.partSku}
                    >
                        <Field
                            name="partSku"
                            type="number"
                            autoComplete="off"
                            component={Input}
                            placeholder="SKU"
                            className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500"
                        />
                    </FormItem>
                </div>

                {/* Note */}
                <div className="mb-4">
                    <FormItem
                        label="Note"
                        invalid={(errors.note && touched.note) as boolean}
                        errorMessage={errors.note}
                    >
                        <Field
                            as="textarea"
                            name="note"
                            placeholder="Add a note..."
                            rows={3}
                            className="w-full border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 resize-none"
                        />
                    </FormItem>
                </div>

                {/* URL */}
                <FormItem
                    label="URL"
                    invalid={(errors.url && touched.url) as boolean}
                    errorMessage={errors.url}
                >
                    <Field
                        type="text"
                        autoComplete="off"
                        name="url"
                        placeholder="https://example.com"
                        component={Input}
                        className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500"
                    />
                </FormItem>

                {/* Information Section */}
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                    Information
                </h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <FormItem
                        label="Quantity"
                        invalid={(errors.quantity && touched.quantity) as boolean}
                        errorMessage={errors.quantity}
                    >
                        <Field
                            name="quantity"
                            type="number"
                            autoComplete="off"
                            component={Input}
                            placeholder="Quantity"
                            className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500"
                        />
                    </FormItem>

                    <FormItem
                        label="Min Quantity"
                        invalid={
                            (errors.minQuantity && touched.minQuantity) as boolean
                        }
                        errorMessage={errors.minQuantity}
                    >
                        <Field
                            name="minQuantity"
                            type="number"
                            autoComplete="off"
                            component={Input}
                            placeholder="Min Quantity"
                            className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500"
                        />
                    </FormItem>
                    <FormItem
                        label="Max Quantity"
                        invalid={
                            (errors.maxQuantity && touched.maxQuantity) as boolean
                        }
                        errorMessage={errors.maxQuantity}
                    >
                        <Field
                            name="maxQuantity"
                            type="number"
                            autoComplete="off"
                            component={Input}
                            placeholder="Max Quantity"
                            className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500"
                        />
                    </FormItem>
                </div>

                {/* Dealer, Bin, Category */}
                <FormItem label="Vendor"
                    invalid={(errors.vendor && touched.vendor) as boolean}
                    errorMessage={errors.vendor}
                >
                    <SelectAndButton
                        options={allVendors}
                        addNewButtonLabel="Add New Vendor"
                        onChange={(value: any) => setFieldValue('vendor', value.value)}
                        placeholder="Select or Add Vendor"
                        addNewClick={() => setAddVendorModelOpen(true)}
                        className="mb-4"
                    />
                    <ErrorMessage name="vendor" component="div" className="text-red-500 text-sm mb-2" />
                </FormItem>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <FormItem
                        label="Bin"
                        invalid={(errors.bin && touched.bin) as boolean}
                        errorMessage={errors.bin}
                    >
                        <Field
                            type="text"
                            name="bin"
                            placeholder="Bin"
                            component={Input}
                            className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500"
                        />
                    </FormItem>

                    <FormItem
                        label="Category"
                        invalid={(errors.category && touched.category) as boolean}
                        errorMessage={errors.category}
                    >
                        <SelectAndButton
                            options={allCategtories}
                            addNewButtonLabel="Add New Category"
                            onChange={(value: any) => setFieldValue('category', value.value)}
                            placeholder="Select or Add Category"
                            addNewClick={() => setAddCategoryModelOpen(true)}
                            className="mb-4"
                        />
                        <ErrorMessage name="category" component="div" className="text-red-500 text-sm mb-2" />
                    </FormItem>
                </div>

                {/* Pricing Section */}
                <h3 className="text-lg font-bold text-gray-800 mb-3">Pricing</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <FormItem
                        label="Cost ($)"
                        invalid={(errors.cost && touched.cost) as boolean}
                        errorMessage={errors.cost}
                    >
                        <Field name="cost">
                            {({ field, form }: FieldProps) => {
                                return (
                                    <NumericFormatInput
                                        form={form}
                                        field={field}
                                        placeholder="Cost"
                                        customInput={
                                            PriceInput as ComponentType
                                        }
                                        onValueChange={(e) => {
                                            form.setFieldValue(
                                                field.name,
                                                e.value
                                            )
                                        }}
                                    />
                                )
                            }}
                        </Field>
                    </FormItem>

                    <FormItem
                        label="Retail ($)"
                        invalid={(errors.retail && touched.retail) as boolean}
                        errorMessage={errors.retail}
                    >
                        <Field name="retail">
                            {({ field, form }: FieldProps) => {
                                return (
                                    <NumericFormatInput
                                        form={form}
                                        field={field}
                                        placeholder="Retail"
                                        customInput={
                                            PriceInput as ComponentType
                                        }
                                        onValueChange={(e) => {
                                            form.setFieldValue(
                                                field.name,
                                                e.value
                                            )
                                        }}
                                    />
                                )
                            }}
                        </Field>
                    </FormItem>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <FormItem
                        label="Markup (%)"
                        invalid={(errors.markup && touched.markup) as boolean}
                        errorMessage={errors.markup}
                    >
                        <Field name="markup">
                            {({ field, form }: FieldProps) => {
                                return (
                                    <NumericFormatInput
                                        form={form}
                                        field={field}
                                        placeholder="Markup"
                                        customInput={
                                            MarginInput as ComponentType
                                        }
                                        isAllowed={({ floatValue }) =>
                                            (floatValue as number) <= 100
                                        }
                                        onValueChange={(e) => {
                                            form.setFieldValue(
                                                field.name,
                                                e.value
                                            )
                                        }}
                                    />
                                )
                            }}
                        </Field>
                    </FormItem>

                    <FormItem
                        label="Margin (%)"
                        invalid={(errors.margin && touched.margin) as boolean}
                        errorMessage={errors.margin}
                    >
                        <Field name="margin">
                            {({ field, form }: FieldProps) => {
                                return (
                                    <NumericFormatInput
                                        form={form}
                                        field={field}
                                        placeholder="Margin"
                                        customInput={
                                            MarginInput as ComponentType
                                        }
                                        isAllowed={({ floatValue }) =>
                                            (floatValue as number) <= 100
                                        }
                                        onValueChange={(e) => {
                                            form.setFieldValue(
                                                field.name,
                                                e.value
                                            )
                                        }}
                                    />
                                )
                            }}
                        </Field>
                    </FormItem>
                </div>

            </AdaptableCard>
        </>
    )
}

export default BasicInfo
