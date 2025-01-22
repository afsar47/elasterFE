import { useState, useRef, forwardRef, useEffect, useCallback } from 'react'
import { HiOutlineFilter, HiOutlineSearch } from 'react-icons/hi'
import {
    getAllBrands,
    getAllCategtories,
    getAllVendors,
    setFilterData,
    useAppDispatch,
    useAppSelector,
} from '../store/index'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Drawer from '@/components/ui/Drawer'
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik'
import type { MouseEvent } from 'react'

type FormModel = {
    category: string[]
    vendor: string[]
    brand: string[]
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
        const filterData = useAppSelector((state: any) => state.inventory.filterData)

        const allBrands = useAppSelector((state) => state.inventory.allBrands);
        const allVendors = useAppSelector((state) => state.inventory.allVendors);
        const allCategories = useAppSelector((state) => state.inventory.allCategories);

        const handleSubmit = (values: FormModel) => {
            dispatch(setFilterData(values));
            onSubmitComplete?.()
        }

        const fetchData = useCallback(() => {
            dispatch(getAllBrands())
            dispatch(getAllVendors())
            dispatch(getAllCategtories('forDropDown'))
        }, [dispatch])

        useEffect(() => {
            fetchData()
        }, [fetchData])

        return (
            <Formik
                innerRef={ref}
                enableReinitialize // Ensure initial values are reset when filterData changes
                initialValues={{
                    category: filterData.category || [],
                    vendor: filterData.vendor || [],
                    brand: filterData.brand || [],
                }}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => (
                    <Form>
                        <FormContainer>
                            <FormItem>
                                <h6 className="mb-4">Part Category</h6>
                                <Field name="category">
                                    {({ field, form }: any) => (
                                        <Checkbox.Group
                                            vertical
                                            name="category"
                                            value={values.category}
                                            onChange={(options) =>
                                                form.setFieldValue(
                                                    field.name,
                                                    options
                                                )
                                            }
                                        >
                                            {allCategories.map((category: any) => (
                                                <Checkbox
                                                    key={category.value}
                                                    value={category.value}
                                                >
                                                    {category.label}
                                                </Checkbox>
                                            ))}
                                        </Checkbox.Group>
                                    )}
                                </Field>
                            </FormItem>

                            <FormItem>
                                <h6 className="mb-4">Part Vendor</h6>
                                <Field name="vendor">
                                    {({ field, form }: any) => (
                                        <Checkbox.Group
                                            vertical
                                            name="vendor"
                                            value={values.vendor}
                                            onChange={(options) =>
                                                form.setFieldValue(
                                                    field.name,
                                                    options
                                                )
                                            }
                                        >
                                            {allVendors.map((vendor: any) => (
                                                <Checkbox
                                                    key={vendor.value}
                                                    value={vendor.value}
                                                >
                                                    {vendor.label}
                                                </Checkbox>
                                            ))}
                                        </Checkbox.Group>
                                    )}
                                </Field>
                            </FormItem>

                            <FormItem>
                                <h6 className="mb-4">Part Brand</h6>
                                <Field name="brand">
                                    {({ field, form }: any) => (
                                        <Checkbox.Group
                                            vertical
                                            name="brand"
                                            value={values.brand}
                                            onChange={(options) =>
                                                form.setFieldValue(
                                                    field.name,
                                                    options
                                                )
                                            }
                                        >
                                            {allBrands.map((brand: any) => (
                                                <Checkbox
                                                    key={brand.value}
                                                    value={brand.value}
                                                >
                                                    {brand.label}
                                                </Checkbox>
                                            ))}
                                        </Checkbox.Group>
                                    )}
                                </Field>
                            </FormItem>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        )
    }
)

const DrawerFooter = ({ onSaveClick, onCancel }: DrawerFooterProps) => (
    <div className="text-right w-full">
        <Button size="sm" className="mr-2" onClick={onCancel}>
            Cancel
        </Button>
        <Button size="sm" variant="solid" onClick={onSaveClick}>
            Query
        </Button>
    </div>
)


const PartsTableFilter = () => {
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

export default PartsTableFilter
