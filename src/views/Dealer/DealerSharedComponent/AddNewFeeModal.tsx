import { NumericFormat } from 'react-number-format'
import { Avatar, Card } from '@/components/ui'
import { Button } from '@/components/ui'
import { useState } from 'react'
import BasicInfo from '../DealerLists/FeesForm/BasicInfo';  // Update path if needed
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import AddNewCategoryModal from './AddNewCategoryModal';
import { apiAddNewFee } from '../DealerLists/Services/DealerInventoryServices';
import { getFees } from '../DealerInventory/store';
import React, { useCallback, useEffect, useMemo } from 'react';
import { setTableData, useAppDispatch, useAppSelector } from '../DealerLists/Store/index';
import { validationSchema } from '../DealerLists/Fees/FeesStatistics';


const AddNewFeeModal = ({ handleButtonClick }: any) => {
    const [AddCategoryModelOpen, setAddCategoryModelOpen] = useState(false)
    const filterData = useAppSelector((state) => state.inventory.filterData);

    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.inventory.tableData
    );
    const tableData = useMemo(
        () => ({ pageIndex, pageSize, sort, query, total, filterData }),
        [pageIndex, pageSize, sort, query, total]
    )

    const initialValues = {
        feeName: '',
        category: '',
        feeType: '',
        feeAmount: null,
    }

    const [ category, setCategory ] = useState("");


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white w-[650px] h-[550px] rounded-lg shadow-lg relative border border-gray-200">
                            <div className="flex justify-between items-center p-3 border-b">
                                <h3 className="text-base font-semibold">New Fee</h3>
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
                                        apiAddNewFee(values);
                                        getFees(tableData)
                                        resetForm()
                                        // setShowForm(false)
                                    }}
                                >
                                    {({ touched, errors }) => (
                                        <Form>
                                            <BasicInfo
                                                touched={touched}
                                                errors={errors}
                                                setAddCategoryModelOpen={setAddCategoryModelOpen}
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 flex justify-end p-2 border-t bg-white">
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
                                        </Form>
                                    )}
                                </Formik>
                                {AddCategoryModelOpen && (
                                    <AddNewCategoryModal
                                        isOpen={AddCategoryModelOpen}
                                        onClose={() => setAddCategoryModelOpen(false)}
                                        onInputChange={(value) => setCategory(value)}
                                        category={category}
                                    />
                                )}
                            </div>

                        </div>
                    </div>
  )
}

export default AddNewFeeModal
