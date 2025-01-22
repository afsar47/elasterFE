import { useMemo, useState, useEffect, useCallback } from 'react';
import Table from '@/components/ui/Table';
import Input from '@/components/ui/Input';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import { Button } from '@/components/ui';
import { rankItem } from '@tanstack/match-sorter-utils';
import { BsExclamationCircle } from "react-icons/bs";
import type { ColumnDef, FilterFn, ColumnFiltersState } from '@tanstack/react-table';
import type { InputHTMLAttributes } from 'react';
import { HiPlusCircle } from 'react-icons/hi';
import TableSearch from './CategoriesSearch';
import AddNewCategoryModal from '../../DealerSharedComponent/AddNewCategoryModal'; // Import the modal component
import { getAllCategtories, useAppDispatch, useAppSelector } from '../store';

interface DebouncedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'prefix'> {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
}
type CategoriesData = { 
    partName: string;
    parts:number;
    tires:number;
    labor:number;
    fees:number;
    totalCount:number;
    subcategory:number;
    
};

const { Tr, Th, Td, THead, TBody, Sorter } = Table;

function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: DebouncedInputProps) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <div className="flex justify-end">
            <div className="flex items-center mb-4">
                <span className="mr-2">Search:</span>
                <Input
                    {...props}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
        </div>
    );
}



const Categories = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [isAlertVisible, setIsAlertVisible] = useState(false); // State for alert visibility
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false); // State     for tracking unsaved changes
    const [categoryName,setCategoryName] = useState("");
    const dispatch = useAppDispatch()
    const data = useAppSelector((state) => state.inventory.allCategories);
    const loading = useAppSelector((state) => state.inventory.loading);
    const filterData = useAppSelector((state) => state.inventory.filterData);

    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.inventory.tableData
    );
    const fetchData = useCallback(() => {
        dispatch(getAllCategtories('forTable'))
    }, [pageIndex, pageSize, sort, query, filterData, dispatch])

    useEffect(() => {
        fetchData()
    }, [fetchData, pageIndex, pageSize, sort, filterData])

    const tableData = useMemo(
        () => ({ pageIndex, pageSize, sort, query, total, filterData }),
        [pageIndex, pageSize, sort, query, total]
    )


    const columns = useMemo<ColumnDef<CategoriesData>[]>(() => [
        {
            header: 'Name',
            accessorKey: 'CategoriesName',
            cell: info => info.getValue(),
            // Adjust width here using a custom Tailwind CSS class
        },
        { header: 'Parts', accessorKey: 'parts' },
        { header: 'Tires', accessorKey: 'tires' },
        { header: 'Labor', accessorKey: 'labor' },
        { header: 'Fees', accessorKey: 'fees' },
        { header: 'TotalCount', accessorKey: 'totalCount' },
        { header: 'Subcategory', accessorKey: 'subcategory' },
    ], []); 

    const table = useReactTable({
        data,
        columns,
        globalFilterFn: (row, columnId, value) => {
            const cellValue = row.getValue(columnId);
            return String(cellValue).toLowerCase().includes(value.toLowerCase());
        },
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });


    const handleNewCategoryClick = () => {
        setIsModalOpen(true); // Open the modal on button click
    };
    const handleInputChange = (value: any) => {
        setCategoryName(value);
        if (value && value.length) setHasUnsavedChanges(true);
        // setIsAlertVisible(true);
    };

    const handleDiscardChanges = () => {
        setIsModalOpen(false); // Close the modal
        setIsAlertVisible(false); // Close the alert
        setHasUnsavedChanges(false); // Reset unsaved changes
    };

    const handleKeepEditing = () => {
        setIsAlertVisible(false); // Close the alert but keep the modal open
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-3xl font-semibold">Line Item Categories</h2>
                    <p className="mb-4">Use line item categories to track your products and services better.</p>
                </div>
                <Button
                    variant="solid"
                    type="button"
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium flex items-center gap-1 px-3 py-1.5"
                    onClick={handleNewCategoryClick} // Attach the click handler
                >
                    <HiPlusCircle className="h-4 w-4" />
                    New Categories
                </Button>
            </div>
            <div className="flex items-center">
            <TableSearch onInputChange={setGlobalFilter} />
            </div>

            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th key={header.id} colSpan={header.colSpan} className='text-center'>
                                    {header.isPlaceholder ? null : (
                                        <div
                                            className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            <Sorter sort={header.column.getIsSorted()} />
                                        </div>
                                    )}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.map((row) => (
                        <Tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <Td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </TBody>
            </Table>
            {/* Render the AddNewCategoryModal component here */}
            <AddNewCategoryModal 
            
                            isOpen={isModalOpen} 
                            onClose={() => {
                                if (hasUnsavedChanges) {
                                    setIsAlertVisible(true); // Show alert if there are unsaved changes
                                } else {
                                    setIsModalOpen(false); // Close modal if no changes
                                }
                            }}
                            onInputChange={handleInputChange} // Call this function when an input changes
                        />

            {isAlertVisible && (
                            <div className="fixed inset-0 flex  justify-center z-50 bg-black bg-opacity-50">
                                <div className="bg-white h-80 p-5 shadow-md mt-10"
                                style={{ width: '33vw', height: '42vh', borderRadius:'10px' }}>
                                 <div className="flex justify-center mb-4">
                                <BsExclamationCircle style={{ color: 'red', fontSize: '3rem' }} />
                                </div>
                                    <h3 className="text-2xl font-bold text-center mb-2">Discard Changes?</h3>
                                    <p className="text-center mb-4">Any unsaved changes will be lost.</p>
                                    <div className='text-center'>
                                    <div> <Button style={{ width: '30vw' }} className='mb-4 !bg-red-600 text-white border-none' onClick={handleDiscardChanges}>Discard</Button></div>
                                        <div><Button style={{ width: '30vw' }} className=' !bg-blue-200 !text-blue-500 border-none' onClick={handleKeepEditing}>Keep Editing</Button></div>
                                </div>
                                </div>
                            </div>
                        )}
                    </>
        // </>
    );
};

export default Categories;
