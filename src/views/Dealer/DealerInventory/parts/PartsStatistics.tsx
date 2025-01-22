import {
    HiOutlineCube,
    HiOutlineCurrencyDollar,
    HiOutlineTag,
    HiPlusCircle,
} from 'react-icons/hi'
import { NumericFormat } from 'react-number-format'
import { Avatar, Card } from '@/components/ui'
import { Button } from '@/components/ui'
import { useCallback, useEffect, useState } from 'react'
import BasicInfo from '../PartsForm/BasicInfo'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import PartsImage from '../PartsForm/PartsImage'
import { cloneDeep } from 'lodash'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { apiNewPart } from '../../DealerLists/Services/DealerInventoryServices'
import { getParts, useAppDispatch, useAppSelector } from '../store'
import AddNewBrandModal from '../../DealerSharedComponent/AddNewBrandModal'
import DealersStatistics from '../../DealerLists/Dealers/VendorsStatistics'
import NewDealerModal from '../../DealerSharedComponent/NewVendorModal'
import AddNewCategoryModal from '../../DealerSharedComponent/AddNewCategoryModal'
import AddNewPartModal from '../../DealerSharedComponent/AddNewPartModal'

type StatisticCardProps = {
    icon: React.ReactNode
    avatarClass: string
    label: string
    value?: number
}

export const validationSchema = Yup.object().shape({
    partName: Yup.string().required('Part Name is required').max(70, 'Part Name must be less than 70 characters'),
    brand: Yup.string().required('Brand Name is required'),
    partSerialNo: Yup.number().required('Part# is required'),
    partSku: Yup.string(),
    note: Yup.string(),
    vendor: Yup.string(),
    url: Yup.string().url('Invalid URL format'),
})

const StatisticCard = (props: StatisticCardProps) => {
    const { icon, avatarClass, label, value } = props

    return (
        <Card bordered className="w-52 p-1 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Avatar className={avatarClass} icon={icon} />
                <div>
                    <span className="text-sm">{label}</span>
                    <h3 className="text-lg font-semibold">
                        <NumericFormat
                            thousandSeparator
                            displayType="text"
                            value={value}
                        />
                    </h3>
                </div>
            </div>
        </Card>
    )
}

const PartsStatistics = () => {
    const [showForm, setShowForm] = useState(false)

    // Toggle form on button click
    const handleButtonClick = () => {
        setShowForm(!showForm) // Toggle form visibility
    }

    const initialValues = {
        partName: '',
        note: '',
        partSerialNo: 0,
        partSku: '',
        url: '',
        quantity: 0,
        minQuantity: 0,
        maxQuantity: 0,
        vendor: '',
        bin: '',
        cost: '',
        retail: '',
        category: '',
        brand: '',
        markup: '',
        margin: '',
    }
    const dispatch = useAppDispatch()
    const filterData = useAppSelector((state) => state.inventory.filterData);
    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.dealer.tableData
    );
    const [AddBrandModelOpen, setAddBrandModelOpen] = useState(false)
    const [AddVendorModelOpen, setAddVendorModelOpen] = useState(false)
    const [AddCategoryModelOpen, setAddCategoryModelOpen] = useState(false)

    const [allPartDetail, setallPartDetail] = useState({
        total: 0,
        totalCost: 0,
        totalValue: 0
    })

    const fetchData = useCallback(() => {
        dispatch(getParts({ pageIndex, pageSize, sort, query, filterData }))
    }, [pageIndex, pageSize, sort, query, filterData, dispatch])

    const data = useAppSelector((state) => state.inventory.allParts);
    console.log("Quantity , Value , Cost : ", data);
    const { totalCost, totalValue } = data.reduce(
        (acc: any, part: any) => ({
            totalCost: acc.totalCost + (part.cost || 0),
            totalValue: acc.totalValue + (part.retail || 0)
        }),
        { totalCost: 0, totalValue: 0 }
    );

    useEffect(() => {
        setallPartDetail({
            total: data.length,
            totalCost: totalCost,
            totalValue: totalValue
        })
    }, [])

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">Parts</h2>
                <Button
                    variant="solid"
                    type="button"
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium flex items-center gap-1 px-3 py-1.5"
                    onClick={handleButtonClick}
                >
                    <HiPlusCircle className="h-4 w-4" />
                    New Parts
                </Button>

                {showForm && (
                    <AddNewPartModal handleButtonClick={handleButtonClick} />
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 max-w-2xl">
                <StatisticCard
                    icon={<HiOutlineCube />}
                    avatarClass="!bg-indigo-500"
                    label="Total Quantity"
                    value={allPartDetail.total}
                />
                <StatisticCard
                    icon={<HiOutlineCurrencyDollar />}
                    avatarClass="!bg-blue-400"
                    label="Total Cost"
                    value={allPartDetail.totalCost}
                />
                <StatisticCard
                    icon={<HiOutlineTag />}
                    avatarClass="!bg-emerald-400"
                    label="Total Value"
                    value={allPartDetail.totalValue}
                />
            </div>
        </div>

    )
}

export default PartsStatistics
