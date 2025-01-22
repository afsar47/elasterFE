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
import BasicInfo from '../FeesForm/BasicInfo'  // Update path if needed
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import AddNewCategoryModal from '../../DealerSharedComponent/AddNewCategoryModal'
import { apiAddNewFee } from '../Services/DealerInventoryServices'
import { getFees } from '../../DealerInventory/store'
import React, { useCallback, useEffect, useMemo } from 'react';
import { setTableData, useAppDispatch, useAppSelector } from '../Store';
import AddNewFeeModal from '../../DealerSharedComponent/AddNewFeeModal'



type StatisticCardProps = {
    icon: React.ReactNode
    avatarClass: string
    label: string
    value?: number
}

export type FormFieldsName = {
    feeName: string,
    category: string
    feeType: string
    feeAmount: number,
}

export const validationSchema = Yup.object().shape({
    feeName: Yup.string().required("Fee Name is required"),
    category: Yup.string().required("Category is required"),
    feeType: Yup.string().required("Fee Type is required"),
    feeAmount: Yup.number().when('feeType', {
        is: 'fixedDollar',
        then: (schema) => schema.required("Fee Amount is required for Fixed Dollar"),
        otherwise: (schema) => schema.notRequired(),
    }),
    percentOfLineItem: Yup.number().when('feeType', {
        is: 'percentOfLineItem',
        then: (schema) => schema.required("Percent of Line Item is required").max(100, "Cannot exceed 100%"),
        otherwise: (schema) => schema.notRequired(),
    }),
    percentOfService: Yup.number().when('feeType', {
        is: 'percentOfService',
        then: (schema) => schema.required("Percent of Service is required").max(100, "Cannot exceed 100%"),
        otherwise: (schema) => schema.notRequired(),
    }),
});

const StatisticCard = (props: StatisticCardProps) => {
    const { icon, avatarClass, label, value } = props

    return (
        <div className="flex items-center">
            <Avatar className={avatarClass}>{icon}</Avatar>
            <div className="ml-2">
                <h4 className="text-sm font-medium">{label}</h4>
                <p className="text-lg font-bold">{value}</p>
            </div>
        </div>
    )
}

const FeesStatistics = () => {
    const [showForm, setShowForm] = useState(false)
    const [AddCategoryModelOpen, setAddCategoryModelOpen] = useState(false)
    const filterData = useAppSelector((state) => state.inventory.filterData);

    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.inventory.tableData
    );
    const tableData = useMemo(
        () => ({ pageIndex, pageSize, sort, query, total, filterData }),
        [pageIndex, pageSize, sort, query, total]
    )
    const handleButtonClick = () => {
        setShowForm(!showForm)
    }

    const initialValues = {
        feeName: '',
        category: '',
        feeType: '',
        feeAmount: null,
    }

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">Fees</h2>
                <Button
                    variant="solid"
                    type="button"
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium flex items-center gap-1 px-3 py-1.5"
                    onClick={handleButtonClick}
                >
                    <HiPlusCircle className="h-4 w-4" />
                    New Fee
                </Button>

                {showForm && (
                    <AddNewFeeModal handleButtonClick={handleButtonClick} />
                )}
            </div>
        </div>
    )
}

export default FeesStatistics;
