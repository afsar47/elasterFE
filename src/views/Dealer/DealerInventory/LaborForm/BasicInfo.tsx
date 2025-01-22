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
import type { ComponentType } from 'react'
import type { InputProps } from '@/components/ui/Input'

type FormFieldsName = {
    name: string
    brand: string
    note: string
    part: number
    partSku: number
    url :string
    quantity: number
    minQuantity: number
    maxQuantity: number
    dealer: string
    bin: number
    cost: number
    retail: number
    category: string
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

    return (
        <AdaptableCard divider className="mb-4 p-4">
    {/* Part Name and Brand */}
    <FormItem
        label="Part Name"
        invalid={(errors.name && touched.name) as boolean}
        errorMessage={errors.name}
    >
        <Field
            type="text"
            autoComplete="off"
            name="name"
            placeholder="Part Name"
            component={Input}
            className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-3/4"
            required
        />
    </FormItem>

    <FormItem
        label="Brand"
        invalid={(errors.brand && touched.brand) as boolean}
        errorMessage={errors.brand}
    >
        <Field
            type="text"
            autoComplete="off"
            name="brand"
            placeholder="Brand"
            component={Input}
            className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-3/4"
        />
    </FormItem>

    {/* Part# and SKU */}
    <div className="grid grid-cols-2 gap-4 mb-4">
        <FormItem
            label="Part#"
            invalid={(errors.part && touched.part) as boolean}
            errorMessage={errors.part}
        >
            <Field
                name="part"
                component={NumericFormatInput}
                placeholder="Part#"
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
                component={NumericFormatInput}
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
    <h3 className="text-lg font-bold text-gray-800 mb-3">Information</h3>
    <div className="grid grid-cols-2 gap-4 mb-4">
        <FormItem
            label="Quantity"
            invalid={(errors.quantity && touched.quantity) as boolean}
            errorMessage={errors.quantity}
        >
            <Field
                name="quantity"
                component={NumericFormatInput}
                placeholder="Quantity"
                className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
        </FormItem>

        <FormItem
            label="Min Quantity"
            invalid={(errors.minQuantity && touched.minQuantity) as boolean}
            errorMessage={errors.minQuantity}
        >
            <Field
                name="minQuantity"
                component={NumericFormatInput}
                placeholder="Min Quantity"
                className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
        </FormItem>
    </div>

    {/* Dealer, Bin, Category */}
    <div className="grid grid-cols-3 gap-4 mb-4">
        <FormItem
            label="Dealer"
            invalid={(errors.dealer && touched.dealer) as boolean}
            errorMessage={errors.dealer}
        >
            <Field
                type="text"
                name="dealer"
                placeholder="Dealer"
                component={Input}
                className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
        </FormItem>

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
            <Field
                as="select"
                name="category"
                className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full h-11"
            >
                <option value="">Select</option>
                <option value="category1">Category 1</option>
                <option value="category2">Category 2</option>
            </Field>
        </FormItem>
    </div>

    {/* Pricing Section */}
    <h3 className="text-lg font-bold text-gray-800 mb-3">Pricing</h3>
    <div className="grid grid-cols-2 gap-4 mb-4">
        <FormItem
            label="Cost"
            invalid={(errors.cost && touched.cost) as boolean}
            errorMessage={errors.cost}
        >
            <Field
                name="cost"
                component={NumericFormatInput}
                placeholder="Cost ($)"
                className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
        </FormItem>

        <FormItem
            label="Retail"
            invalid={(errors.retail && touched.retail) as boolean}
            errorMessage={errors.retail}
        >
            <Field
                name="retail"
                component={NumericFormatInput}
                placeholder="Retail ($)"
                className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
        </FormItem>
    </div>

    
</AdaptableCard>
    
    
    )
}

export default BasicInfo
