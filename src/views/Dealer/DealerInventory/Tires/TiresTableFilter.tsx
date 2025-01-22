import { useState, useRef, forwardRef } from 'react'
import { HiOutlineFilter, HiOutlineSearch } from 'react-icons/hi'
import {
    getTires,
    setTiresFilterData,
    useAppDispatch,
    useAppSelector,
} from '../store/index'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Drawer from '@/components/ui/Drawer'
import { Field, Form, Formik, FormikProps } from 'formik'
import type { MouseEvent } from 'react'

type FormModel = {
    categories: string[]
    dealers: string[]
    status: string[]
}

type FilterFormProps = {
    onSubmitComplete?: () => void
}

type DrawerFooterProps = {
    onSaveClick: (event: MouseEvent<HTMLButtonElement>) => void
    onCancel: (event: MouseEvent<HTMLButtonElement>) => void
}

const FilterForm = forwardRef<FormikProps<FormModel>, FilterFormProps>(
    ({ onSubmitComplete }, ref) => {
        const dispatch = useAppDispatch()
        const filterData = useAppSelector((state: any) => state.workflow.filterData)

        const categories = ['Syble Kling', 'Tyre', 'Category 3', 'Category 4'] // sample data
        const dealers = ['Dealer 1', 'Micah McKenzie'] // sample data
        const statuses = ['Reorder'] // sample data

        const handleSubmit = (values: FormModel) => {
            onSubmitComplete?.()
            // dispatch(setFilterData(values))
        }

        return (
            <Formik
                innerRef={ref}
                initialValues={{
                    categories: filterData.categories || [],
                    dealers: filterData.dealers || [],
                    status: filterData.status || [],
                }}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => (
                    <Form>
                        {/* Categories */}
                        <FormContainer>
                            <h4 className="font-bold mb-2">Categories</h4>
                            <Input
                                prefix={<HiOutlineSearch />}
                                placeholder="Search categories..."
                                className="mb-2"
                            />
                            {categories.map((category, index) => (
                                <Checkbox
                                    key={index}
                                    // label={category}
                                    // checked={values.categories.includes(category)}
                                    // onChange={() => {
                                    //     const updatedCategories = values.categories.includes(category)
                                    //         ? values.categories.filter((c) => c !== category)
                                    //         : [...values.categories, category]
                                    //     setFieldValue('categories', updatedCategories)
                                    // }}
                                />
                            ))}
                        </FormContainer>

                        {/* Dealers */}
                        <FormContainer>
                            <h4 className="font-bold mb-2">Dealers</h4>
                            <Input
                                prefix={<HiOutlineSearch />}
                                placeholder="Search dealers..."
                                className="mb-2"
                            />
                            {dealers.map((dealer, index) => (
                                <Checkbox
                                    key={index}
                                    // label={dealer}
                                    // checked={values.dealers.includes(dealer)}
                                    // onChange={() => {
                                    //     const updatedDealers = values.dealers.includes(dealer)
                                    //         ? values.dealers.filter((v) => v !== dealer)
                                    //         : [...values.dealers, dealer]
                                    //     setFieldValue('dealers', updatedDealers)
                                    // }}
                                />
                            ))}
                        </FormContainer>

                        {/* Status */}
                        <FormContainer>
                            <h4 className="font-bold mb-2">Status</h4>
                            {statuses.map((status, index) => (
                                <Checkbox
                                    key={index}
                                    // label={status}
                                    // checked={values.status.includes(status)}
                                    // onChange={() => {
                                    //     const updatedStatus = values.status.includes(status)
                                    //         ? values.status.filter((s) => s !== status)
                                    //         : [...values.status, status]
                                    //     setFieldValue('status', updatedStatus)
                                    // }}
                                />
                            ))}
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        )
    }
)

const DrawerFooter = ({ onSaveClick, onCancel }: DrawerFooterProps) => {
    return (
        <div className="text-right w-full">
            <Button size="sm" className="mr-2" onClick={onCancel}>
                Cancel
            </Button>
            <Button size="sm" variant="solid" onClick={onSaveClick}>
                Query
            </Button>
        </div>
    )
}

const TiresTableFilter = () => {
    const formikRef = useRef<FormikProps<FormModel>>(null)
    const [isOpen, setIsOpen] = useState(false)

    const openDrawer = () => {
        setIsOpen(true)
    }

    const onDrawerClose = () => {
        setIsOpen(false)
    }

    const formSubmit = () => {
        formikRef.current?.submitForm()
    }

    return (
        <>
            <Button
                size="sm"
                className="block md:inline-block ltr:md:-ml-1"
                icon={<HiOutlineFilter />}
                onClick={() => openDrawer()}
            >
                Filter
            </Button>
            <Drawer
                title="Filter"
                isOpen={isOpen}
                footer={
                    <DrawerFooter
                        onCancel={onDrawerClose}
                        onSaveClick={formSubmit}
                    />
                }
                onClose={onDrawerClose}
                onRequestClose={onDrawerClose}
            >
                <FilterForm ref={formikRef} onSubmitComplete={onDrawerClose} />
            </Drawer>
        </>
    )
}

FilterForm.displayName = 'FilterForm'

export default TiresTableFilter
