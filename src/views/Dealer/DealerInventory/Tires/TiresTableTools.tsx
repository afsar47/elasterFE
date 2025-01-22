import { useRef } from 'react'
import Button from '@/components/ui/Button'
import {
    useAppDispatch,
    useAppSelector,
} from '@/store'
import TiresTableSearch from './TiresTableSearch'
import TiresTableFilter from './TiresTableFilter'
import cloneDeep from 'lodash/cloneDeep'
import type { TableQueries } from '@/@types/common'
import {HiDownload, HiOutlineAdjustments, HiOutlineSaveAs } from 'react-icons/hi'
import { Link } from 'react-router-dom'

const TiresTableTools = () => {
    const dispatch = useAppDispatch()

    const handleInputChange = (val: string) => {
        return (null)
    }

    return (
        <div className="md:flex items-center justify-between">
            <div className="md:flex items-center gap-4">
                <TiresTableSearch
                    onInputChange={handleInputChange}
                />
            </div>
            <div className="flex gap-2 items-center mb-4">
                <TiresTableFilter />
            <Link
                download
                className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
                to="/data/product-list.csv"
                target="_blank"
            >
                <Button block size="sm" icon={<HiDownload />}>
                    Export
                </Button>
            </Link>
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

export default TiresTableTools
