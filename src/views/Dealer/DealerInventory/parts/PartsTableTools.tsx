import { useRef } from 'react'
import Button from '@/components/ui/Button'
import {
    useAppDispatch,
    useAppSelector,
} from '@/store'
import PartsTableSearch from './PartsTableSearch'
import PartsTableFilter from './PartsTableFilter'
import cloneDeep from 'lodash/cloneDeep'
import type { TableQueries } from '@/@types/common'
import { HiDownload, HiOutlineAdjustments, HiOutlineSaveAs } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import * as XLSX from 'xlsx';

const PartsTableTools = () => {
    const dispatch = useAppDispatch()
    const data = useAppSelector((state) => state.inventory.allParts);

    const handleInputChange = (val: string) => {
        return (null)
    }

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "Parts Data.xlsx");
    }
    return (
        <div className="md:flex items-center justify-between">
            <div className="md:flex items-center gap-4">
                <PartsTableSearch
                    onInputChange={handleInputChange}
                />
            </div>
            <div className="flex gap-2 items-center mb-4">
                <PartsTableFilter />

                <Button block size="sm" onClick={exportToExcel} icon={<HiDownload />}>
                    Export
                </Button>
                <Button
                    size="sm"
                    className=" flex items-center gap-1"
                >
                    <HiOutlineAdjustments className="text-lg" />  {/* Customize icon */}
                    Customize
                </Button>
            </div>
        </div>
    )
}

export default PartsTableTools
