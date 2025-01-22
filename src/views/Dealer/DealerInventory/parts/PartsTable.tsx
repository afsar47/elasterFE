import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { getParts, setDrawerOpen, setSelectedDealer, setPartsTableData, useAppDispatch, useAppSelector } from '../store';
import { cloneDeep } from 'lodash';
import { HiDotsHorizontal } from 'react-icons/hi'; // Importing the 3-dot icon
import useThemeClass from '@/utils/hooks/useThemeClass';
import AddNewPartModal from '../../DealerSharedComponent/AddNewPartModal'
import { apiDeletePart } from '../../DealerLists/Services/DealerInventoryServices'
import { apiNewPart } from '../../DealerLists/Services/DealerInventoryServices'
import { apiUpdatePart } from '../../DealerLists/Services/DealerInventoryServices'




// Define the proper structure for your columns based on ColumnDef
type ColumnDef<T> = {
    header: string;
    accessorKey: keyof T; // Change selector to match the keys in data
    sortable?: boolean; // Optional, as not all columns are sortable
};

// Define the type of data you will pass in
type PartData = {
    partName: string;
    brand: string;
    partSku: string;
    partSerialNo: number;
    category: string;
    dealer: string;
    cost: number;
    retail: number;
    available: number;
    reserved: number;
    onHand: number;
    minQuantity: number;
    maxQuantity: number;
};

const PartsTable = () => {
    const dispatch = useAppDispatch()
    const data = useAppSelector((state) => state.inventory.allParts);
    const loading = useAppSelector((state) => state.inventory.loading);
    const filterData = useAppSelector((state) => state.inventory.filterData);
    const [showMenu, setShowMenu] = useState<{ [key: string]: boolean }>({});
    const [showForm, setShowForm] = useState(false)
    const originalData = useAppSelector((state) => state.inventory.allParts);
    const [isUpdate, setIsUpdate] = useState(false);  // Add this line



    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.inventory.partsTableData
    );


    const fetchData = useCallback(() => {
        dispatch(getParts({ pageIndex, pageSize, sort, query, filterData }))
    }, [pageIndex, pageSize, sort, query, filterData, dispatch])

    useEffect(() => {
        fetchData()
    }, [fetchData, pageIndex, pageSize, sort, filterData])

    const partsTableData = useMemo(
        () => ({ pageIndex, pageSize, sort, query, total, filterData }),
        [pageIndex, pageSize, sort, query, total]
    )

    const ActionColumn = ({ row }: { row: any }) => {
        const { textTheme } = useThemeClass()
        const dispatch = useAppDispatch()
    
        const onEdit = () => {
            dispatch(setDrawerOpen())
            dispatch(setSelectedDealer(row))
        }
    
        return (
            <div
                className={`${textTheme} cursor-pointer select-none font-semibold`}
                onClick={onEdit}
            >
                Edit
            </div>
        ) 
    }

    const toggleMenu = (id: string) => {
        setShowMenu(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleButtonClick = () => {
        setShowForm(!showForm) // Toggle form visibility
    }

    const [selectedPart, setSelectedPart] = useState<any | null>(null);


    const handleAction = (action: string, id: string) => {

        const selectedPart = originalData.find((part: any) => part.id === id); // Assuming feeName is unique
         
        if (action === 'edit' && selectedPart) {
            setIsUpdate(true); // Set isUpdate to true when edit is clicked
            setShowForm(true);
            setSelectedPart(selectedPart);  
        } else if (action === 'delete') {
            console.log(`Delete action for ID: ${id}`);
            // Call the delete API
            {
                apiDeletePart(id);// API call to delete the fee
                fetchData();  // Refresh data after deletion
            }
        }
        setShowMenu(prev => ({
            ...prev,
            [id]: false,
        }));
    };

    const columns: any[] = useMemo(() => [
        { header: 'Name', accessorKey: 'partName', sortable: true },
        { header: 'Brand', accessorKey: 'brand.label' },
        { header: 'SKU', accessorKey: 'partSku' },
        { header: 'Part', accessorKey: 'partSerialNo' },
        { header: 'Category', accessorKey: 'category.label' },
        { header: 'Vendor', accessorKey: 'vendor.label' },
        { header: 'Cost', accessorKey: 'cost' },
        { header: 'Retail', accessorKey: 'retail' },
        { header: 'Available', accessorKey: 'available' },
        { header: 'Reserved', accessorKey: 'reserved' },
        { header: 'On Hand', accessorKey: 'onHand' },
        { header: 'Min', accessorKey: 'minQuantity' },
        { header: 'Max', accessorKey: 'maxQuantity' },
        {
            header: '',
            accessorKey: 'actions',
            cell: ({ row }: any) => {
                const id = row.original.id; // Get the row ID (you can use an index or unique identifier)
                return (
                    <div className="relative">
                        <button
                            onClick={() => toggleMenu(id)}
                            className="p-2 rounded-full text-gray-600 hover:bg-gray-200"
                        >
                            <HiDotsHorizontal />
                        </button>
                        {showMenu[id] && (
                            <div className="z-10 absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-md">
                                <button
                                    onClick={() => handleAction('edit', id)}
                                    className="block px-4 py-2 hover:bg-gray-200"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleAction('delete', id)}
                                    className="block px-4 py-2 text-red-600 hover:bg-gray-200"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                );
            }
        }
    ],[showMenu]);

    const onPaginationChange = (page: number) => {
        const newpartsTableData = cloneDeep(partsTableData)
        newpartsTableData.pageIndex = page
        dispatch(setPartsTableData(newpartsTableData))
    }

    const onSelectChange = (value: number) => {
        const newpartsTableData = cloneDeep(partsTableData)
        newpartsTableData.pageSize = Number(value)
        newpartsTableData.pageIndex = 1
        dispatch(setPartsTableData(newpartsTableData))
    }

    const onSort = (sort: any) => {
        const newpartsTableData = cloneDeep(partsTableData)
        newpartsTableData.sort = sort
        dispatch(setPartsTableData(newpartsTableData))
    }

    return (
    <div><DataTable
            columns={columns}
            data={data}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            loading={loading}
            pagingData={{
                total: partsTableData.total as number,
                pageIndex: partsTableData.pageIndex as number,
                pageSize: partsTableData.pageSize as number,
            }}
            onPaginationChange={onPaginationChange}
            onSelectChange={onSelectChange}
            onSort={onSort}
        />

        {showForm && (
            <AddNewPartModal handleButtonClick={handleButtonClick} />
        )}
    </div>

    );
};

export default PartsTable;
