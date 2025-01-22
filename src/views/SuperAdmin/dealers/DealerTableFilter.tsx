import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { setFilterData, setDealerList } from './store/index'
import {
    components,
    ControlProps,
    OptionProps,
    SingleValue,
} from 'react-select'
import { HiCheck } from 'react-icons/hi'
import { useAppDispatch, useAppSelector } from '@/store'
import { useRef, useState } from 'react'

type Option = {
    value: string
    label: string
    color: string
}

const { Control } = components

const options: Option[] = [
    { value: 'all', label: 'All', color: 'bg-gray-500' },
    { value: 'active', label: 'Active', color: 'bg-emerald-500' },
    { value: 'inactive', label: 'Inactive', color: 'bg-red-500' },
]

const CustomSelectOption = ({
    innerProps,
    label,
    data,
    isSelected,
}: OptionProps<Option>) => {
    return (
        <div
            className={`flex items-center justify-between p-2 cursor-pointer ${
                isSelected
                    ? 'bg-gray-100 dark:bg-gray-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
            {...innerProps}
        >
            <div className="flex items-center gap-2">
                <Badge innerClass={data.color} />
                <span>{label}</span>
            </div>
            {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
        </div>
    )
}

const CustomControl = ({ children, ...props }: ControlProps<Option>) => {
    const selected = props.getValue()[0]
    return (
        <Control {...props}>
            {selected && (
                <Badge
                    className="ltr:ml-4 rtl:mr-4"
                    innerClass={selected.color}
                />
            )}
            {children}
        </Control>
    )
}

const DealerTableFilter = () => {
    const dispatch = useAppDispatch()
    const alldealers = useAppSelector((state) => state.dealer.dealerList);
    const originalDealers = useRef([])
    const [selectedOption, setSelectedOption] = useState("all")

    // const { status } = useAppSelector(
    //     (state) => state.allDealers.data.filterData
    // )

    const onStatusFilterChange = (selected: SingleValue<Option>) => {
        if (!selected || !selected.value) return;
        setSelectedOption(selected.value)
        if (alldealers && alldealers.length && (!originalDealers.current || !originalDealers.current.length)) originalDealers.current = alldealers;

        if (selected.value === "all") return dispatch(setDealerList(originalDealers.current));

        let filteredDealers = originalDealers.current.filter(dealer => (selected.value === "active" && Boolean(dealer.status) === true) || (selected.value === "inactive" && Boolean(dealer.status) === false));
        dispatch(setDealerList(filteredDealers));
        // dispatch(setFilterData({ status: selected?.value }))
        // dispatch(setFilterData({ status: 'dealer' }))
    }

    return (
        <Select<Option>
            options={options}
            size="sm"
            className="mb-4 min-w-[130px]"
            components={{
                Option: CustomSelectOption,
                Control: CustomControl,
            }}
            value={options.filter((option) => option.value === selectedOption)}
            onChange={onStatusFilterChange}
            isSearchable={false}
        />
    )
}

export default DealerTableFilter
