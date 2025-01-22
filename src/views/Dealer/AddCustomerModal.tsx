import React, { useState } from 'react';
import classNames from 'classnames';
import Segment from '@/components/ui/Segment';
import BasicInfo from './DealerLists/Customers/CustomersForm/BasicInfo'; // Individual form
import FleetInfo from './DealerLists/Fleets/FleetsForm/BasicInfo'; // Fleet form
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui'; // Button component

// Validation Schema for Formik
const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    phoneType: Yup.string().required('Phone Type is required'),
    phoneNumber: Yup.number().required('Phone Number is required'),
    email: Yup.string().required('Email is required'),
    additionalInfo: Yup.string(),
    address: Yup.string(),
    fees: Yup.number(),
});

const AddCustomerModal = ({ isOpen, onClose }: any) => {
    const [selectedSegment, setSelectedSegment] = useState<string>('Individual'); // Default selection

    const initialValues = {
        firstName: '',
        lastName: '',
        phoneType: '',
        phoneNumber: '',
        email: '',
        additionalInfo: '',
        address: '',
        fees: '',
    };

    const handleCancel = () => {
        setSelectedSegment('Individual'); // Reset to default selection on cancel
        onClose(); // Close the modal
    };

    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${isOpen ? 'block' : 'hidden'}`}>
            <div className="bg-white p-6 rounded shadow-md z-60 w-full max-w-3xl relative overflow-y-auto max-h-full">
                <h2 className="text-xl font-semibold mb-4">Select Customer Type</h2>

                {/* Segment selection (Individual/Fleet) */}
                <div className="border rounded-md mb-4">
                    <Segment className="w-full">
                        {['Individual', 'Fleet'].map((segment) => (
                            <Segment.Item key={segment} value={segment}>
                                {({ active, onSegmentItemClick }) => (
                                    <div
                                        className={classNames(
                                            'flex justify-center rounded-md py-2 px-3 cursor-pointer select-none w-full',
                                            (active || selectedSegment === segment)
                                                ? 'bg-blue-100'
                                                : 'bg-white'
                                        )}
                                        onClick={() => {
                                            setSelectedSegment(segment);
                                            onSegmentItemClick();
                                        }}
                                    >
                                        <span>{segment}</span>
                                    </div>
                                )}
                            </Segment.Item>
                        ))}
                    </Segment>
                </div>

                {/* Scrollable content */}
                {selectedSegment === 'Individual' && (
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => {
                            resetForm();
                        }}
                    >
                        {({ touched, errors }: any) => (
                            <Form>
                                <BasicInfo touched={touched} errors={errors} /> {/* Individual form */}
                                <div className="flex justify-end mt-4">
                                    <Button type="button" className="mr-2" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="solid">
                                        Save
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                )}

                {selectedSegment === 'Fleet' && (
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => {
                            resetForm();
                        }}
                    >
                        {({ touched, errors }) => (
                            <Form>
                                <FleetInfo touched={touched} errors={errors} /> {/* Fleet form */}
                                <div className="flex justify-end mt-4">
                                    <Button type="button" className="mr-2" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="solid">
                                        Save
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                )}
            </div>
        </div>
    );
};

export default AddCustomerModal;
