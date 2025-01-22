import { useState, useRef, forwardRef } from 'react';
import { HiOutlineFilter } from 'react-icons/hi';
import {
    getVehicles,
    setVehicleFilterData,
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
        const dispatch = useAppDispatch()
        const { pageIndex, pageSize, sort, query, total } = useAppSelector(
            (state) => state.list.vehicleTableData
        );
        const [dateOption, setDateOption] = useState(''); // State to manage selected date option

        const formatDate = (date: Date) => date.toISOString().split("T")[0];

        const handleSubmit = (values: any) => {
            console.log('Submitting filter values:', values);
            dispatch(setVehicleFilterData(values));
            dispatch(getVehicles(values)); // Pass `values` directly here
            onSubmitComplete?.();
        };

        const getLastWeekDates = () => {
            const today = new Date();
            const dayOfWeek = today.getDay();

            const lastWeekStart = new Date(today);
            lastWeekStart.setDate(today.getDate() - dayOfWeek - 7);

            const lastWeekEnd = new Date(lastWeekStart);
            lastWeekEnd.setDate(lastWeekStart.getDate() + 6);

            return {
                start: formatDate(lastWeekStart),
                end: formatDate(lastWeekEnd),
            };
        }

        const getCurrentMonthDates = () => {
            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

            return {
                start: formatDate(startOfMonth),
                end: formatDate(endOfMonth),
            };
        }

        const getLastMonthDates = () => {
            const today = new Date();
            const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

            return {
                start: formatDate(startOfLastMonth),
                end: formatDate(endOfLastMonth),
            };
        }

        const getCurrentYearToDate = () => {
            const today = new Date();
            const startOfYear = new Date(today.getFullYear(), 0, 1);

            return {
                start: formatDate(startOfYear),
                end: formatDate(today),
            };
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
                                </Radio> <br />
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
                                        const today = formatDate(new Date());
                                        setFieldValue('dateOption', 'today');
                                        setFieldValue('startDate', today);
                                        setFieldValue('endDate', today);
                                        setDateOption('today');
                                    }}
                                    className="block mb-2"
                                >
                                    Today
                                </Radio> <br />
                                <Radio
                                    name="dateOption"
                                    value="yesterday"
                                    checked={values.dateOption === 'yesterday'}
                                    onChange={() => {
                                        const yesterday = new Date();
                                        yesterday.setDate(yesterday.getDate() - 1);
                                        const formattedDate = formatDate(yesterday);
                                        setFieldValue('dateOption', 'yesterday');
                                        setFieldValue('startDate', formattedDate);
                                        setFieldValue('endDate', formattedDate);
                                        setDateOption('yesterday');
                                    }}
                                    className="block mb-2"
                                >
                                    Yesterday
                                </Radio> <br />
                                <Radio
                                    name="dateOption"
                                    value="thisWeek"
                                    checked={values.dateOption === 'thisWeek'}
                                    onChange={() => {
                                        const today = new Date();
                                        const startOfWeek = new Date(today);
                                        startOfWeek.setDate(today.getDate() - today.getDay());
                                        const endOfWeek = new Date(startOfWeek);
                                        endOfWeek.setDate(startOfWeek.getDate() + 6);
                                        setFieldValue('dateOption', 'thisWeek');
                                        setFieldValue('startDate', formatDate(startOfWeek));
                                        setFieldValue('endDate', formatDate(endOfWeek));
                                        setDateOption('thisWeek');
                                    }}
                                    className="block mb-2"
                                >
                                    This Week
                                </Radio> <br />
                                <Radio
                                    name="dateOption"
                                    value="lastWeek"
                                    checked={values.dateOption === 'lastWeek'}
                                    onChange={() => {
                                        const { start, end } = getLastWeekDates();
                                        setFieldValue('dateOption', 'lastWeek');
                                        setFieldValue('startDate', start);
                                        setFieldValue('endDate', end);
                                        setDateOption('lastWeek');
                                    }}
                                    className="block mb-2"
                                >
                                    Last Week
                                </Radio> <br />
                                <Radio
                                    name="dateOption"
                                    value="thisMonth"
                                    checked={values.dateOption === 'thisMonth'}
                                    onChange={() => {
                                        const { start, end } = getCurrentMonthDates();
                                        setFieldValue('dateOption', 'thisMonth');
                                        setFieldValue('startDate', start);
                                        setFieldValue('endDate', end);
                                        setDateOption('thisMonth');
                                    }}
                                    className="block mb-2"
                                >
                                    This Month
                                </Radio> <br />
                                <Radio
                                    name="dateOption"
                                    value="lastMonth"
                                    checked={values.dateOption === 'lastMonth'}
                                    onChange={() => {
                                        const { start, end } = getLastMonthDates();
                                        setFieldValue('dateOption', 'lastMonth');
                                        setFieldValue('startDate', start);
                                        setFieldValue('endDate', end);
                                        setDateOption('lastMonth');
                                    }}
                                    className="block mb-2"
                                >
                                    Last Month
                                </Radio> <br />
                                <Radio
                                    name="dateOption"
                                    value="yearToDate"
                                    checked={values.dateOption === 'yearToDate'}
                                    onChange={() => {
                                        const { start, end } = getCurrentYearToDate();
                                        setFieldValue('dateOption', 'yearToDate');
                                        setFieldValue('startDate', start);
                                        setFieldValue('endDate', end);
                                        setDateOption('yearToDate');
                                    }}
                                    className="block mb-2"
                                >
                                    Year to Date
                                </Radio> <br />
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

const VehiclesFilter = () => {
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

export default VehiclesFilter;
