import { useRef } from 'react'
import Button from '@/components/ui/Button'
import {
    useAppDispatch,
    useAppSelector,
} from '@/store'
import DealersSearch from './VendorsSearch'
import cloneDeep from 'lodash/cloneDeep'
import type { TableQueries } from '@/@types/common'
import { HiOutlineAdjustments } from 'react-icons/hi'
import { Link } from 'react-router-dom'

const VendorsTableTools = () => {
    const dispatch = useAppDispatch()

    const handleInputChange = (val: string) => {
        return (null)
    }

    return (
        <div className="md:flex items-center justify-between border-b border-gray-300">
            <div className="md:flex items-center gap-4">
                <DealersSearch
                    onInputChange={handleInputChange}
                />
            </div>
            <div className="flex gap-2 items-center mb-4">
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

export default VendorsTableTools
