import { useEffect, useRef } from 'react'
import Button from '@/components/ui/Button'
import {
    getDealers,
    setTableData,
    setFilterData,
    DealerState,
    useAppDispatch,
    setDealerList,
} from './store/index'
import DealerTableSearch from './DealerTableSearch'
import DealerTableFilter from './DealerTableFilter'
import cloneDeep from 'lodash/cloneDeep'
import { useAppSelector } from '@/store'

const DealersTableTools = () => {
    const dispatch = useAppDispatch()

    const inputRef = useRef<HTMLInputElement>(null)

    const tableData = useAppSelector(
        (state: any) => state.dealer.tableData
    )

    const alldealers = useAppSelector((state) => state.dealer.dealerList);
    const originalDealerData = useRef(alldealers)
    useEffect(() => {
        if(alldealers && alldealers.length && !originalDealerData.current.length) originalDealerData.current = alldealers
    }, [alldealers])

    const handleInputChange = (val: string) => {
        if (alldealers && alldealers.length && !originalDealerData.current.length) originalDealerData.current = alldealers
        if (typeof val === 'string' && val.length > 1) {
            let filtereddealers = alldealers.filter(dealer => {
                if(dealer.fullname.includes(val) || dealer.email.includes(val) || dealer.phoneNumber.includes(val)) {
                    return dealer
                }
            })
            dispatch(setDealerList(filtereddealers))
        }

        if (typeof val === 'string' && val.length === 0) {
            dispatch(setDealerList(originalDealerData.current))
        }
    }

    const fetchData = (data: any) => {
        dispatch(setTableData(data));
        dispatch(getDealers(data));
    }

    const onClearAll = () => {
        // if (alldealers && alldealers.length && !originalDealerData.current.length) originalDealerData.current = alldealers
        dispatch(setDealerList(originalDealerData.current))
        // const newTableData = cloneDeep(tableData)
        // newTableData.query = ''
        // if (inputRef.current) {
        //     inputRef.current.value = ''
        // }
        // dispatch(setFilterData({ status: '' }))
        // fetchData(newTableData)
    }

    return (
        <div className="md:flex items-center justify-between">
            <div className="md:flex items-center gap-4">
                <DealerTableSearch
                    ref={inputRef}
                    onInputChange={handleInputChange}
                />
                <DealerTableFilter />
            </div>
            <div className="mb-4">
                <Button size="sm" onClick={onClearAll}>
                    Clear All
                </Button>
            </div>
        </div>
    )
}

export default DealersTableTools
