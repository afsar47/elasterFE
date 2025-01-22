import { useState, useRef, forwardRef } from 'react';
import { HiOutlineFilter } from 'react-icons/hi';
import {
    useAppDispatch,
    useAppSelector,
} from '../Store/index';
import { FormItem, FormContainer } from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Drawer from '@/components/ui/Drawer';
import { Field, Form, Formik, FormikProps } from 'formik';
import Radio from '@/components/ui/Radio';
import type { MouseEvent } from 'react';

type FormModel = {
    dateOption: string;
    startDate: string;
    endDate: string;
}

type FilterFormProps = {
    onSubmitComplete?: () => void;
}

type DrawerFooterProps = {
    onSaveClick: (event: MouseEvent<HTMLButtonElement>) => void;
    onCancel: (event: MouseEvent<HTMLButtonElement>) => void;
}

const FilterForm = forwardRef<FormikProps<FormModel>, FilterFormProps>(
    ({ onSubmitComplete }, ref) => {
        const [dateOption, setDateOption] = useState(''); // State to manage selected date option

        const handleSubmit = (values: FormModel) => {
            onSubmitComplete?.();
            // dispatch(setFilterData(values))
        }

        return (
            <Formik
                innerRef={ref}
                initialValues={{
                    dateOption: 'custom',
                    startDate: '',
                    endDate: '',
                }}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => (
                    <Form>
                        {/* Created Date */}
                        <FormContainer>
                            <h4 className="font-bold mb-2">Created Date</h4>
                            <div className="mb-4 space-y-2">
                                <Radio
                                    name="dateOption"
                                    value="custom"
                                    checked={values.dateOption === 'custom'}
                                    onChange={() => {
                                        setFieldValue('dateOption', 'custom');
                                        setDateOption('custom');
                                    }}
                                    className="block mb-2"
                                >
                                    Custom
                                </Radio>
                                <br />
                                {values.dateOption === 'custom' && (
                                    <div className="mt-2 grid grid-cols-2 gap-4">
                                        <FormItem label="From:">
                                            <Field
                                                type="date"
                                                name="startDate"
                                                component={Input}
                                                className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full"
                                            />
                                        </FormItem>
                                        <FormItem label="To:">
                                            <Field
                                                type="date"
                                                name="endDate"
                                                component={Input}
                                                className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full"
                                            />
                                        </FormItem>
                                    </div>
                                )}
                                <Radio
                                    name="dateOption"
                                    value="today"
                                    checked={values.dateOption === 'today'}
                                    onChange={() => {
                                        setFieldValue('dateOption', 'today');
                                        setDateOption('today');
                                    }}
                                    className="block mb-2"
                                >
                                    Today
                                </Radio>
                                <br />

                                <Radio
                                    name="dateOption"
                                    value="yesterday"
                                    checked={values.dateOption === 'yesterday'}
                                    onChange={() => {
                                        setFieldValue('dateOption', 'yesterday');
                                        setDateOption('yesterday');
                                    }}
                                    className="block mb-2"
                                >
                                    Yesterday
                                </Radio>
                                <br />

                                <Radio
                                    name="dateOption"
                                    value="thisWeek"
                                    checked={values.dateOption === 'thisWeek'}
                                    onChange={() => {
                                        setFieldValue('dateOption', 'thisWeek');
                                        setDateOption('thisWeek');
                                    }}
                                    className="block mb-2"
                                >
                                    This Week 
                                </Radio>
                                <br />

                                <Radio
                                    name="dateOption"
                                    value="lastWeek"
                                    checked={values.dateOption === 'lastWeek'}
                                    onChange={() => {
                                        setFieldValue('dateOption', 'lastWeek');
                                        setDateOption('lastWeek');
                                    }}
                                    className="block mb-2"
                                >
                                    Last Week
                                </Radio>
                                <br />

                                <Radio
                                    name="dateOption"
                                    value="thisMonth"
                                    checked={values.dateOption === 'thisMonth'}
                                    onChange={() => {
                                        setFieldValue('dateOption', 'thisMonth');
                                        setDateOption('thisMonth');
                                    }}
                                    className="block mb-2"
                                >
                                    This Month
                                </Radio>
                                <br />

                                <Radio
                                    name="dateOption"
                                    value="lastMonth"
                                    checked={values.dateOption === 'lastMonth'}
                                    onChange={() => {
                                        setFieldValue('dateOption', 'lastMonth');
                                        setDateOption('lastMonth');
                                    }}
                                    className="block mb-2"
                                >
                                    Last Month
                                </Radio>
                                <br />

                                <Radio
                                    name="dateOption"
                                    value="yearToDate"
                                    checked={values.dateOption === 'yearToDate'}
                                    onChange={() => {
                                        setFieldValue('dateOption', 'yearToDate');
                                        setDateOption('yearToDate');
                                    }}
                                    className="block mb-2"
                                >
                                    Year to Date
                                </Radio>
                                <br />

                                <Radio
                                    name="dateOption"
                                    value="allTime"
                                    checked={values.dateOption === 'allTime'}
                                    onChange={() => {
                                        setFieldValue('dateOption', 'allTime');
                                        setDateOption('allTime');
                                    }}
                                    className="block mb-2"
                                >
                                    All Time
                                </Radio>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        );
    }
);

const DrawerFooter = ({ onSaveClick, onCancel }: DrawerFooterProps) => {
    return (
        <div className="text-right w-full">
            <Button size="sm" className="mr-2" onClick={onCancel}>
                Cancel
            </Button>
            <Button size="sm" variant="solid" onClick={onSaveClick}>
                Apply
            </Button>
        </div>
    );
}

const FleetsFilter = () => {
    const formikRef = useRef<FormikProps<FormModel>>(null);
    const [isOpen, setIsOpen] = useState(false);

    const openDrawer = () => {
        setIsOpen(true);
    };

    const onDrawerClose = () => {
        setIsOpen(false);
    };

    const formSubmit = () => {
        formikRef.current?.submitForm();
    };

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
    );
};

FilterForm.displayName = 'FilterForm';

export default FleetsFilter;
