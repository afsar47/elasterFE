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
    useFormikContext,
} from 'formik'
import { useState, type ComponentType } from 'react'
import type { InputProps } from '@/components/ui/Input'
import { Segment } from '@/components/ui/Segment'
import Select from '@/components/ui/Select'
import CreatableSelect from 'react-select/creatable'
import { Switcher } from '@/components/ui'
import { values } from 'lodash'

type FormFieldsName = {
    // Top-level fields
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
};


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

const pricingMatrixOptions = [
    { value: 'pricingMatrix1', label: 'Pricing Matrix 1' },
    { value: 'pricingMatrix2', label: 'Pricing Matrix 2' },
]

const BasicInfo = (props: BasicInfo) => {
    const { touched, errors } = props
    const [isTaxable, setTaxable] = useState(true)
    const [isDisplayPart, setDisplayPart] = useState(true)
    const [isDisplayPrice, setDisplayPrice] = useState(true)
    const [isDisplayNote, setDisplayNote] = useState(true)
    const { values, setFieldValue } = useFormikContext<any>()
    const [outerDiameterUnit, setOuterDiameterUnit] = useState('in')
    const [sectionWidthUnit, setSectionWidthUnit] = useState('mm')
    const [treadDepthUnit, setTreadDepthUnit] = useState('mm')
    const [wheelDiameterUnit, setWheelDiameterUnit] = useState('in')
    const [activeTab, setActiveTab] = useState('inventory')

    const handleTabSwitch = (tab: string) => {
        setActiveTab(tab)
        setFieldValue('segment', tab)
    }

    return (
        <AdaptableCard divider className="mb-2 p-4">
            {/* Section 1: Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 -mb-4">
                <FormItem
                    label="Brand"
                    labelClass="block text-gray-800 dark:text-white font-semibold mb-1"
                    invalid={errors.brand && touched.brand}
                    errorMessage={errors.brand}
                >
                    <Field
                        type="text"
                        autoComplete="off"
                        name="brand"
                        placeholder="Select"
                        component={Input}
                        className="border border-gray-300 outline-none p-1 rounded-md focus:ring-0 focus:ring-blue-300 bg-slate-50"
                        required
                    />
                </FormItem>
                <FormItem
                    label="Model"
                    labelClass="block text-gray-800 dark:text-white font-semibold mb-1"
                    invalid={errors.model && touched.model}
                    errorMessage={errors.model}
                >
                    <Field
                        type="text"
                        autoComplete="off"
                        name="model"
                        placeholder="Select"
                        component={Input}
                        className="border border-gray-300 outline-none p-1 rounded-md focus:ring-0 focus:ring-blue-300 bg-slate-50"
                        required
                    />
                </FormItem>

                <FormItem
                    label="Size"
                    labelClass="block text-gray-800 dark:text-white font-semibold mb-1"
                    invalid={errors.size && touched.size}
                    errorMessage={errors.size}
                >
                    <Field
                        type="text"
                        autoComplete="off"
                        name="size"
                        placeholder="Size"
                        component={Input}
                        className="border border-gray-300 outline-none p-1 rounded-md focus:ring-0 focus:ring-blue-300 bg-slate-50"
                    />
                </FormItem>
            </div>

            {/* Section 2: Note & URL */}
            <FormItem
                label="Notes"
                labelClass="block text-gray-800 dark:text-white font-semibold mb-1"
                invalid={errors.note && touched.note}
                errorMessage={errors.note}
                className="mt-4"
            >
                <Field
                    as="textarea"
                    name="note"
                    placeholder="Add a note..."
                    rows={3}
                    className="w-full bg-slate-50 border border-gray-300 outline-none p-1 rounded-md focus:ring-0 focus:ring-blue-300 resize-none -mb-4"
                />
            </FormItem>

            <FormItem
                label="URL"
                labelClass="block text-gray-800 dark:text-white font-semibold mb-1"
                invalid={errors.url && touched.url}
                errorMessage={errors.url}
                className="mt-4"
            >
                <Field
                    type="text"
                    name="url"
                    placeholder="https://example.com"
                    component={Input}
                    className="border border-gray-300 outline-none p-1 rounded-md focus:ring-0 focus:ring-blue-300 bg-slate-50"
                />
            </FormItem>

            <div className="flex items-center space-x-4 mb-4">
                {/* Inventory & Pricing Button */}
                <button
                    type="button"
                    onClick={() => handleTabSwitch('inventory')}
                    className={`w-full p-3 border rounded ${
                        activeTab === 'inventory'
                            ? 'bg-blue-100 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-600'
                    }`}
                >
                    Inventory & Pricing
                </button>

                {/* Tech Specs Button */}
                <button
                    type="button"
                    onClick={() => handleTabSwitch('techSpecs')}
                    className={`w-full p-3 border rounded ${
                        activeTab === 'techSpecs'
                            ? 'bg-blue-100 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-600'
                    }`}
                >
                    Tech Specs
                </button>
            </div>

            {/* Inventory section */}
            <div className={activeTab === 'inventory' ? 'block' : 'hidden'}>
                {/* Section 3: Part Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <FormItem
                        label="Part #"
                        labelClass="block text-gray-800 dark:text-white font-semibold mb-1"
                        invalid={errors.inventoryAndPrice?.part && touched.inventoryAndPrice?.part}
                        errorMessage={errors.inventoryAndPrice?.part}
                    >
                        <Field
                            name="inventoryAndPrice.part"
                            component={Input}
                            // customInput={Input}
                            placeholder=" "
                            className="border border-gray-300 outline-none p-1 rounded-md focus:ring-0 focus:ring-blue-300 bg-slate-50"
                        />
                    </FormItem>

                    <FormItem
                        label="SKU"
                        labelClass="block text-gray-800 dark:text-white font-semibold mb-1"
                        invalid={errors.inventoryAndPrice?.tireSku && touched.inventoryAndPrice?.tireSku}
                        errorMessage={errors.inventoryAndPrice?.tireSku}
                    >
                        <Field
                            name="inventoryAndPrice.tireSku"
                            component={Input}
                            // customInput={Input}
                            placeholder=""
                            className="border border-gray-300 outline-none p-1 rounded-md focus:ring-0 focus:ring-blue-300 bg-slate-50"
                        />
                    </FormItem>

                    <FormItem
                        label="Bin"
                        labelClass="block text-gray-800 dark:text-white font-semibold mb-1"
                        invalid={errors.inventoryAndPrice?.bin && touched.inventoryAndPrice?.bin}
                        errorMessage={errors.inventoryAndPrice?.bin}
                    >
                        <Field
                            type="text"
                            name="inventoryAndPrice.bin"
                            placeholder=""
                            component={Input}
                            className="border border-gray-300 outline-none p-1 rounded-md focus:ring-0 focus:ring-blue-300 bg-slate-50"
                        />
                    </FormItem>
                </div>

                {/* Section 4: Inventory Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
                    <FormItem
                        label="Quantity"
                        labelClass="block text-gray-800 dark:text-white font-semibold mb-1"
                        invalid={errors.inventoryAndPrice?.quantity && touched.inventoryAndPrice?.quantity}
                        errorMessage={errors.inventoryAndPrice?.quantity}
                    >
                        <Field
                            name="inventoryAndPrice.quantity"
                            component={Input}
                            type="number"
                            placeholder=""
                            className="border border-gray-300 outline-none p-1 rounded-md focus:ring-0 focus:ring-blue-300 bg-slate-50"
                        />
                    </FormItem>

                    <FormItem
                        label="Min"
                        labelClass="block text-gray-800 dark:text-white font-semibold mb-1"
                        invalid={errors.inventoryAndPrice?.min && touched.inventoryAndPrice?.min}
                        errorMessage={errors.inventoryAndPrice?.min}
                    >
                        <Field
                            name="inventoryAndPrice.min"
                            component={Input}
                            type="number"
                            placeholder=""
                            className="border border-gray-300 outline-none p-1 rounded-md focus:ring-0 focus:ring-blue-300 bg-slate-50"
                        />
                    </FormItem>

                    <FormItem
                        label="Max"
                        labelClass="block text-gray-800 dark:text-white font-semibold mb-1"
                        invalid={errors.inventoryAndPrice?.max && touched.inventoryAndPrice?.max}
                        errorMessage={errors.inventoryAndPrice?.max}
                    >
                        <Field
                            name="inventoryAndPrice.max"
                            component={Input}
                            type="number"
                            placeholder=""
                            className="border border-gray-300 outline-none p-1 rounded-md focus:ring-0 focus:ring-blue-300 bg-slate-50"
                        />
                    </FormItem>
                </div>

                {/* Section 6: Pricing Information */}
                <FormItem
                    label="Pricing Matrix"
                    labelClass="block text-gray-800 dark:text-white font-semibold mb-1"
                    className="mt-0"
                >
                    <Select
                        options={pricingMatrixOptions}
                        placeholder="Select Pricing Matrix"
                        componentAs={CreatableSelect}
                        isClearable
                        className="bg-slate-50"
                    />
                </FormItem>

                {/* Cost & Retail */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 -mt-2">
                    <FormItem
                        label="Cost"
                        labelClass="block text-gray-800 dark:text-white font-semibold mb-1"
                        invalid={errors.inventoryAndPrice?.cost && touched.inventoryAndPrice?.cost}
                        errorMessage={errors.inventoryAndPrice?.cost}
                    >
                        <Field
                            name="inventoryAndPrice.cost"
                            component={Input}
                            type="number"
                            placeholder="Cost ($)"
                            className="border border-gray-300 outline-none p-1 rounded-md focus:ring-0 focus:ring-blue-300 bg-slate-50"
                        />
                    </FormItem>

                    <FormItem
                        label="Retail"
                        labelClass="block text-gray-800 dark:text-white font-semibold mb-1"
                        invalid={errors.inventoryAndPrice?.retail && touched.inventoryAndPrice?.retail}
                        errorMessage={errors.inventoryAndPrice?.retail}
                    >
                        <Field
                            name="inventoryAndPrice.retail"
                            component={Input}
                            type="number"
                            placeholder="Retail ($)"
                            className="border border-gray-300 outline-none p-1 rounded-md focus:ring-0 focus:ring-blue-300 bg-slate-50"
                        />
                    </FormItem>
                </div>

                {/* Section 7: Markup and Margin */}
                <div className="mt-0">
                    <FormItem
                        label="Markup"
                        labelClass="block text-gray-800 dark:text-white font-semibold mb-1"
                    >
                        <Segment>
                            <Segment.Item value="15">15%</Segment.Item>
                            <Segment.Item value="25">25%</Segment.Item>
                            <Segment.Item value="35">35%</Segment.Item>
                            <Segment.Item value="50">50%</Segment.Item>
                            <Segment.Item
                                value="custom"
                                className="w-full mb-4"
                            >
                                <Input
                                    placeholder="Enter"
                                    className="w-full border-none bg-transparent text-center -mt-2 placeholder-gray-600 pointer"
                                />
                            </Segment.Item>
                        </Segment>
                    </FormItem>

                    <FormItem
                        label="Margin"
                        labelClass="block text-gray-800 dark:text-white font-semibold mb-1"
                        className="mt-4"
                    >
                        <Segment>
                            <Segment.Item value="15">15%</Segment.Item>
                            <Segment.Item value="25">25%</Segment.Item>
                            <Segment.Item value="35">35%</Segment.Item>
                            <Segment.Item value="50">50%</Segment.Item>
                            <Segment.Item value="custom" className="w-full">
                                <Input
                                    placeholder="Enter"
                                    className="w-full border-none bg-transparent text-center -mt-2 placeholder-gray-600 pointer"
                                />
                            </Segment.Item>
                        </Segment>
                    </FormItem>
                </div>
                <hr />
                <div className="space-y-4 mt-6">
                    {/* Taxable*/}
                    <div>
                        <Switcher
                            defaultChecked={isTaxable}
                            onChange={() => setTaxable(!isTaxable)}
                        />
                        <span className="font-medium text-gray-700 ml-3 relative top-[4px]">
                            Taxable
                        </span>
                        {/* {isTaxExempt && (
                    // <Input
                    //     placeholder="Tax exemption details"
                    //     className="mt-2"
                    // />
                )} */}
                    </div>

                    {/* Display Parts on Estimate & Invoice*/}
                    <div>
                        <Switcher
                            defaultChecked={isDisplayPart}
                            onChange={() => setDisplayPart(!isDisplayPart)}
                        />
                        <span className="font-medium text-gray-700 ml-3 relative top-[4px]">
                            Display Part # on estimate & invoice
                        </span>
                        {/* {isTaxExempt && (
                    // <Input
                    //     placeholder="Tax exemption details"
                    //     className="mt-2"
                    // />
                )} */}
                    </div>

                    {/* Display Price & quantity*/}
                    <div>
                        <Switcher
                            defaultChecked={isDisplayPrice}
                            onChange={() => setDisplayPrice(!isDisplayPrice)}
                        />
                        <span className="font-medium text-gray-700 ml-3 relative top-[4px]">
                            Display price and quantity on estimate & invoice
                        </span>
                        {/* {isTaxExempt && (
                    // <Input
                    //     placeholder="Tax exemption details"
                    //     className="mt-2"
                    // />
                )} */}
                    </div>

                    {/* Display Note */}
                    <div>
                        <Switcher
                            defaultChecked={isDisplayNote}
                            onChange={() => setDisplayNote(!isDisplayNote)}
                        />
                        <span className="font-medium text-gray-700 ml-3 relative top-[4px]">
                            Display note on estimate & invoice
                        </span>
                        {/* {isTaxExempt && (
                    // <Input
                    //     placeholder="Tax exemption details"
                    //     className="mt-2"
                    // />
                )} */}
                    </div>
                </div>
            </div>

            {/* Tech Specs Section */}

            <div
                className={`${activeTab === 'techSpecs' ? 'block' : 'hidden'} `}
            >
                <h3 className="font-bold text-lg mb-4">Basic Info</h3>
                <div className="space-y-4 bg-slate-200 p-4 rounded-md">
                    {/* Category */}
                    <FormItem 
                    invalid={errors.techSpecs?.category && touched.techSpecs?.category}
                    errorMessage={errors.techSpecs?.category}
                    >
                        <div className="flex items-center space-x-4">
                            <label className="w-1/4">Category:</label>
                            <Field
                                type="text"
                                autoComplete="off"
                                name="techSpecs.category"
                                placeholder="e.g. AT"
                                component={Input}
                                className="w-3/4 border border-gray-300 outline-none rounded-md bg-white"
                                
                            />
                        </div>
                    </FormItem>
                    {/* Construction */}
                    <FormItem
                        labelClass="w-1/4"
                        invalid={errors.techSpecs?.construction && touched.techSpecs?.construction}
                        errorMessage={errors.techSpecs?.construction}
                    >
                        <div className="flex items-center space-x-4">
                            <label className="w-1/4">Construction:</label>
                            <Field
                                type="text"
                                autoComplete="off"
                                name="techSpecs.construction"
                                placeholder="e.g. R"
                                component={Input}
                                className="w-3/4 border border-gray-300 outline-none p-2 rounded-md bg-white"
                                
                            />
                        </div>
                    </FormItem>

                    {/* Load Index */}
                    <FormItem
                        invalid={errors.techSpecs?.loadIndex && touched.techSpecs?.loadIndex}
                        errorMessage={errors.techSpecs?.loadIndex}
                    >
                        <div className="flex items-center space-x-4">
                            <label className="w-1/4">Load Index:</label>
                            <Field
                                type="text"
                                autoComplete="off"
                                name="techSpecs.loadIndex"
                                placeholder="e.g. 90"
                                component={Input}
                                className="w-3/4 border border-gray-300 outline-none p-2 rounded-md bg-white"
                                
                            />
                        </div>
                    </FormItem>

                    {/* Load Range */}
                    <FormItem
                        invalid={errors.techSpecs?.loadRange && touched.techSpecs?.loadRange}
                        errorMessage={errors.techSpecs?.loadRange}
                    >
                        <div className="flex items-center space-x-4">
                            <label className="w-1/4">Load Range:</label>
                            <Field
                                type="text"
                                autoComplete="off"
                                name="techSpecs.loadRange"
                                placeholder="e.g. C"
                                component={Input}
                                className="w-3/4 border border-gray-300 outline-none p-2 rounded-md bg-white"
                                
                            />
                        </div>
                    </FormItem>

                    {/* Outer Diameter with Unit */}
                    <FormItem
                        invalid={errors.techSpecs?.outerDiameter && touched.techSpecs?.outerDiameter}
                        errorMessage={errors.techSpecs?.outerDiameter}
                    >
                        <div className="flex items-center space-x-4">
                            {/* Label with 1/4 width */}
                            <label className="w-1/4">Outer Diameter:</label>

                            {/* Input and Segment with 3/4 width */}
                            <div className="flex w-3/4 items-center space-x-4">
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="techSpecs.outerDiameter"
                                    placeholder="in"
                                    component={Input}
                                    className="w-full border border-gray-300 outline-none p-2 rounded-md bg-white"
                                    
                                />
                                <Segment
                                    value={outerDiameterUnit}
                                    // onChange={setOuterDiameterUnit}
                                    className="flex space-x-2"
                                >
                                    <Segment.Item value="mm">mm</Segment.Item>
                                    <Segment.Item value="in">in</Segment.Item>
                                </Segment>
                            </div>
                        </div>
                    </FormItem>

                    {/* Max Tire Pressure */}
                    <FormItem
                        invalid={errors.techSpecs?.maxTirePressure && touched.techSpecs?.maxTirePressure}
                        errorMessage={errors.techSpecs?.maxTirePressure}
                    >
                        <div className="flex items-center space-x-4">
                            <label className="w-1/4">Max Tire Pressure:</label>
                            <Field
                                type="text"
                                autoComplete="off"
                                name="techSpecs.maxTirePressure"
                                placeholder="psi"
                                component={Input}
                                className="w-3/4 border border-gray-300 outline-none p-2 rounded-md bg-white"
                                
                            />
                        </div>
                    </FormItem>

                    {/* Run Flat */}
                    <FormItem labelClass="block text-gray-800 dark:text-white font-semibold mb-1">
                        <div className="flex items-center space-x-4">
                            {/* Label with 1/4 width */}
                            <label className="w-1/4">Run Flat:</label>

                            {/* Buttons with 3/4 width */}
                            <div className="flex w-3/4 space-x-2">
                                <Field name="techSpecs.runFlat" type="radio" value="no">
                                    {({ field }: FieldProps) => (
                                        <button
                                            type="button"
                                            className={`w-full p-2 border rounded ${
                                                field.checked
                                                    ? 'bg-blue-100 border-blue-500 text-blue-600'
                                                    : 'bg-white border-gray-300 text-gray-600'
                                            }`}
                                            onClick={() =>
                                                field.onChange({
                                                    target: {
                                                        name: field.name,
                                                        value: 'no',
                                                    },
                                                })
                                            }
                                        >
                                            No
                                        </button>
                                    )}
                                </Field>
                                <Field name="techSpecs.runFlat" type="radio" value="yes">
                                    {({ field }: FieldProps) => (
                                        <button
                                            type="button"
                                            className={`w-full p-2 border rounded ${
                                                field.checked
                                                    ? 'bg-blue-100 border-blue-500 text-blue-600'
                                                    : 'bg-white border-gray-300 text-gray-600'
                                            }`}
                                            onClick={() =>
                                                field.onChange({
                                                    target: {
                                                        name: field.name,
                                                        value: 'yes',
                                                    },
                                                })
                                            }
                                        >
                                            Yes
                                        </button>
                                    )}
                                </Field>
                            </div>
                        </div>
                    </FormItem>

                    {/* side wall aspect */}
                    <FormItem
                        invalid={
                            errors.techSpecs?.sidewallAspect && touched.techSpecs?.sidewallAspect
                        }
                        errorMessage={errors.techSpecs?.sidewallAspect}
                    >
                        <div className="flex items-center space-x-4">
                            <label className="w-1/4">Sidewall Aspect:</label>
                            <Field
                                type="text"
                                autoComplete="off"
                                name="techSpecs.sidewallAspect"
                                placeholder="e.g. 60"
                                component={Input}
                                className="w-3/4 border border-gray-300 outline-none p-2 rounded-md bg-white"
                                
                            />
                        </div>
                    </FormItem>

                    {/* Section Width */}
                    <FormItem
                        invalid={errors.techSpecs?.sectionWidth && touched.techSpecs?.sectionWidth}
                        errorMessage={errors.techSpecs?.sectionWidth}
                    >
                        <div className="flex items-center space-x-4">
                            {/* Label with 1/4 width */}
                            <label className="w-1/4">Section Width:</label>

                            {/* Input and Segment with 3/4 width */}
                            <div className="flex w-3/4 items-center space-x-4">
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="techSpecs.sectionWidth"
                                    placeholder="mm"
                                    component={Input}
                                    className="w-full border border-gray-300 outline-none p-2 rounded-md bg-white"
                                    
                                />
                                <Segment
                                    value={sectionWidthUnit}
                                    // onChange={setSectionWidthUnit}
                                    className="flex space-x-2"
                                >
                                    <Segment.Item value="mm">mm</Segment.Item>
                                    <Segment.Item value="in">in</Segment.Item>
                                </Segment>
                            </div>
                        </div>
                    </FormItem>

                    {/* Service Type */}
                    <FormItem
                        invalid={errors.techSpecs?.serviceType && touched.techSpecs?.serviceType}
                        errorMessage={errors.techSpecs?.serviceType}
                    >
                        <div className="flex items-center space-x-4">
                            <label className="w-1/4">Service Type:</label>
                            <Field
                                type="text"
                                autoComplete="off"
                                name="techSpecs.serviceType"
                                placeholder="e.g. P"
                                component={Input}
                                className="w-3/4 border border-gray-300 outline-none p-2 rounded-md bg-white"
                                
                            />
                        </div>
                    </FormItem>

                    {/* Speed Rating */}
                    <FormItem
                        invalid={errors.techSpecs?.speedRating && touched.techSpecs?.speedRating}
                        errorMessage={errors.techSpecs?.speedRating}
                    >
                        <div className="flex items-center space-x-4">
                            <label className="w-1/4">Speed Rating:</label>
                            <Field
                                type="text"
                                autoComplete="off"
                                name="techSpecs.speedRating"
                                placeholder="e.g. V"
                                component={Input}
                                className="w-3/4 border border-gray-300 outline-none p-2 rounded-md bg-white"
                                
                            />
                        </div>
                    </FormItem>

                    {/* Tread Depth with Unit */}
                    <FormItem
                        invalid={errors.techSpecs?.treadDepth && touched.techSpecs?.treadDepth}
                        errorMessage={errors.techSpecs?.treadDepth}
                    >
                        <div className="flex items-center space-x-4">
                            {/* Label with 1/4 width */}
                            <label className="w-1/4">Tread Depth:</label>

                            {/* Input and Segment with 3/4 width */}
                            <div className="flex w-3/4 items-center space-x-4">
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="techSpecs.treadDepth"
                                    placeholder="mm"
                                    component={Input}
                                    className="w-full border border-gray-300 outline-none p-2 rounded-md bg-white"
                                    
                                />
                                <Segment
                                    value={treadDepthUnit}
                                    // onChange={setTreadDepthUnit}
                                    className="flex space-x-2"
                                >
                                    <Segment.Item value="mm">mm</Segment.Item>
                                    <Segment.Item value="in">in</Segment.Item>
                                </Segment>
                            </div>
                        </div>
                    </FormItem>

                    {/* Wheel Diameter with Unit */}
                    <FormItem
                        invalid={errors.techSpecs?.wheelDiameter && touched.techSpecs?.wheelDiameter}
                        errorMessage={errors.techSpecs?.wheelDiameter}
                    >
                        <div className="flex items-center space-x-4">
                            {/* Label with 1/4 width */}
                            <label className="w-1/4">Wheel Diameter:</label>

                            {/* Input and Segment with 3/4 width */}
                            <div className="flex w-3/4 items-center space-x-4">
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="techSpecs.wheelDiameter"
                                    placeholder="in"
                                    component={Input}
                                    className="w-full border border-gray-300 outline-none p-2 rounded-md bg-white"
                                    
                                />
                                <Segment
                                    value={wheelDiameterUnit}
                                    // onChange={setWheelDiameterUnit}
                                    className="flex space-x-2"
                                >
                                    <Segment.Item value="mm">mm</Segment.Item>
                                    <Segment.Item value="in">in</Segment.Item>
                                </Segment>
                            </div>
                        </div>
                    </FormItem>
                </div>

                <h3 className="font-bold text-lg mt-6">
                    Uniform Tire Quality Grading (UTGQ)
                </h3>
                <div className="mt-2 bg-slate-200 p-4 rounded-md">
                    {/* Treadwear */}
                    <FormItem
                        invalid={errors.techSpecs?.treadwear && touched.techSpecs?.treadwear}
                        errorMessage={errors.techSpecs?.treadwear}
                    >
                        <div className="flex items-center space-x-4">
                            <label className="w-1/4">Treadwear:</label>
                            <Field
                                type="text"
                                autoComplete="off"
                                name="techSpecs.treadwear"
                                placeholder=""
                                component={Input}
                                className="w-3/4 border border-gray-300 outline-none p-2 rounded-md bg-white"
                                
                            />
                        </div>
                    </FormItem>

                    {/* Traction */}
                    <FormItem
                        invalid={errors.techSpecs?.traction && touched.techSpecs?.traction}
                        errorMessage={errors.techSpecs?.traction}
                    >
                        <div className="flex items-center space-x-4">
                            <label className="w-1/4">Traction:</label>
                            <Field
                                type="text"
                                autoComplete="off"
                                name="techSpecs.traction"
                                placeholder=""
                                component={Input}
                                className="w-3/4 border border-gray-300 outline-none p-2 rounded-md bg-white"
                                
                            />
                        </div>
                    </FormItem>

                    {/* Temperature */}
                    <FormItem
                        invalid={errors.techSpecs?.temperature && touched.techSpecs?.temperature}
                        errorMessage={errors.techSpecs?.temperature}
                    >
                        <div className="flex items-center space-x-4">
                            <label className="w-1/4">Temperature:</label>
                            <Field
                                type="text"
                                autoComplete="off"
                                name="techSpecs.temperature"
                                placeholder=""
                                component={Input}
                                className="w-3/4 border border-gray-300 outline-none p-2 rounded-md bg-white"
                                
                            />
                        </div>
                    </FormItem>
                </div>
            </div>
        </AdaptableCard>
    )
}

export default BasicInfo
