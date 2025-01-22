import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { HiDotsHorizontal } from 'react-icons/hi'; // Importing the 3-dot icon
import { getTires, setTiresTableData, useAppDispatch, useAppSelector } from '../store';
import { cloneDeep } from 'lodash';
import { apiDeleteTire } from '../../DealerLists/Services/DealerInventoryServices';

// Define the proper structure for your columns based on ColumnDef
type ColumnDef<T> = {
    header: string;
    accessorKey: keyof T;
    sortable?: boolean;
    cell?: (info: any) => JSX.Element; // Add custom rendering for specific cells
};

// Define the type of data you will pass in
type TireData = {
    brand: string;
    model: string;
    size: string;
    note: string;
    url: string;
    tireSku: string;
    category: string;
    vendor: string;
    bin: string;
    cost: number;
    retail: number;
    available: number;
    reserved: number;
    onHand: number;

};

const TiresTable = () => {

    const dispatch = useAppDispatch();

    // Fetching data and loading state from Redux
    const data = useAppSelector((state) => state.inventory.allTires);
    // console.log("all tire data : ", data)
    
    const loading = useAppSelector((state) => state.inventory.loading);
    const filterData = useAppSelector((state) => state.inventory.filterData);
    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.inventory.tiresTableData
    );
    
        const originalData = useAppSelector((state) => state.inventory.allTires);
    const fetchData = useCallback(() => {
        dispatch(getTires({ pageIndex, pageSize, sort, query, filterData }));
    }, [pageIndex, pageSize, sort, query, filterData, dispatch]);

    useEffect(() => {
        fetchData()
    }, [fetchData, pageIndex, pageSize, sort, filterData]);

    const tableData = useMemo(
        () => ({ pageIndex, pageSize, sort, query, total }),
        [pageIndex, pageSize, sort, query, total]
    );

    const [showMenu, setShowMenu] = useState<{ [key: string]: boolean }>({});

    // Handle show/hide of the menu
    const toggleMenu = (id: string) => {
        setShowMenu(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleAction = (action: string, id: string) => {
        const selectedTire = originalData.find((tire :any)=> tire.id === id);
        if (action === 'delete') {
            console.log(`Delete action for ID: ${id}`);
            // Implement delete logic
            {
                apiDeleteTire(id);
                fetchData();
            }

        } else if (action === 'archive') {
            console.log(`Archive action for ID: ${id}`);
            // Implement archive logic
        }
        setShowMenu(prev => ({
            ...prev,
            [id]: false,
        }));
    };

    const columns: ColumnDef<TireData>[] = useMemo(() => [
        { header: 'Brand', accessorKey: 'brand' },
        { header: 'Model', accessorKey: 'model' },
        { header: 'Size', accessorKey: 'size' },
        { header: 'Note', accessorKey: 'note' },
        { header: 'URL', accessorKey: 'url' },
        { header: 'SKU', accessorKey: 'tireSku' },
        { header: 'Category', accessorKey: 'category' },
        { header: 'Vendor', accessorKey: 'vendor' },
        { header: 'Bin', accessorKey: 'bin' },
        { header: 'Cost', accessorKey: 'cost' },
        { header: 'Retail', accessorKey: 'retail' },
        { header: 'Available', accessorKey: 'available' },
        { header: 'Reserved', accessorKey: 'reserved' },
        { header: 'On Hand', accessorKey: 'onHand' },
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
                                    onClick={() => handleAction('delete', id)}
                                    className="block px-4 py-2 text-red-600 hover:bg-gray-200"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => handleAction('archive', id)}
                                    className="block px-4 py-2 text-blue-600 hover:bg-gray-200"
                                >
                                    Archive
                                </button>
                            </div>
                        )}
                    </div>
                );
            }
        }
    ], [showMenu]);

    const onPaginationChange = (page: number) => {
        const newTableData = { ...tableData, pageIndex: page };
        dispatch(setTiresTableData(newTableData));
    };

    const onSelectChange = (value: number) => {
        const newTableData = { ...tableData, pageSize: Number(value), pageIndex: 1 };
        dispatch(setTiresTableData(newTableData));
    };

    const onSort = (sort: any) => {
        const newTableData = { ...tableData, sort };
        dispatch(setTiresTableData(newTableData));
    };

    

    return (
        <>
        {data && columns ? (
            <DataTable
                columns={columns}
                data={data}
                loading={loading}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                pagingData={{
                    total: tableData.total as number,
                    pageIndex: tableData.pageIndex as number,
                    pageSize: tableData.pageSize as number,
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                onSort={onSort}
            />  
        ) : (
            <div>Loading...</div>
        )}
    </>
    );
};

export default TiresTable;
