import { useRef } from 'react'
import Button from '@/components/ui/Button'
import {
    useAppDispatch,
    useAppSelector,
} from '@/store'
import VehiclesSearch from './VehiclesSearch'
import VehiclesFilter from './VehiclesFilter'
import cloneDeep from 'lodash/cloneDeep'
import type { TableQueries } from '@/@types/common'
import {HiDownload, HiOutlineAdjustments, HiOutlineSaveAs } from 'react-icons/hi'
import { Link } from 'react-router-dom'

const VehiclesTableTools = () => {
    const dispatch = useAppDispatch()

    const handleInputChange = (val: string) => {
        return (null)
    }

    return (
        <div className="md:flex items-center justify-between border-b border-gray-300">
            <div className="md:flex items-center gap-4">
                <VehiclesSearch
                    onInputChange={handleInputChange}
                />
            </div>
            <div className="flex gap-2 items-center mb-4">
                <VehiclesFilter />
                <Button 
                    size="sm" 
                    className=" flex items-center gap-1" 
                >
                    <HiOutlineAdjustments className="text-lg" />  
                    Customize
                </Button>
            </div>
        </div>
    )
}

export default VehiclesTableTools
