import {
    HiOutlineCube,
    HiOutlineCurrencyDollar,
    HiOutlineTag,
    HiPlusCircle,
} from 'react-icons/hi'
import { NumericFormat } from 'react-number-format'
import { Avatar, Card } from '@/components/ui'
import { Button } from '@/components/ui'
import { useState } from 'react'
import BasicInfo from './FleetsForm/BasicInfo'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'


const validationSchema = Yup.object().shape({
    name: Yup.string().required('Part Name is required'),
    brand: Yup.string(),
    part: Yup.number().required('Part# is required'),
    partSku: Yup.string(),
    note: Yup.string(),
    url: Yup.string().url('Invalid URL format'),
})


const FleetsStatistics = () => {
    const [showForm, setShowForm] = useState(false)

    // Toggle form on button click
    const handleButtonClick = () => {
        setShowForm(!showForm) // Toggle form visibility
    }

    const initialValues = {
        
    }

    return (
        <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Fleets</h2>
            <Button
                variant="solid"
                type="button"
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium flex items-center gap-1 px-3 py-1.5"
                onClick={handleButtonClick}
            >
                <HiPlusCircle className="h-4 w-4" />
                New Fleet
            </Button>
    
            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white w-[650px] h-[600px] rounded-lg shadow-lg relative border border-gray-200">
                        <div className="flex justify-between items-center p-3 border-b">
                            <h3 className="text-base font-semibold">New Fleet</h3>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={handleButtonClick}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="overflow-y-auto p-4" style={{ height: 'calc(100% - 110px)' }}>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {
                                    resetForm()
                                    setShowForm(false)
                                }}
                            >
                                {({ touched, errors }) => (
                                    <Form>
                                        {/* Pass the touched and errors to BasicInfo */}
                                        <BasicInfo
                                            touched={touched}
                                            errors={errors}
                                        />
                                    </Form>
                                )}
                            </Formik>
                        </div>
                        <div className="flex justify-end p-2 border-t">
                            <Button
                                variant="primary"
                                type="button"
                                className="bg-gray-300 mr-2 px-4 py-1.5"
                                onClick={handleButtonClick}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="solid"
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5"
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    
    </div>
    
    )
}

export default FleetsStatistics
