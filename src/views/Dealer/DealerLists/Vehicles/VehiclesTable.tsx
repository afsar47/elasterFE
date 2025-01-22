import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { HiOutlinePlus } from 'react-icons/hi'; // Importing the plus icon from react-icons
import DataTable from '@/components/shared/DataTable';
import { getVehicles, useAppDispatch, useAppSelector, setVehicleTableData } from '../Store';
import { cloneDeep } from 'lodash';

// Define the proper structure for your columns based on ColumnDef
type ColumnDef<T> = {
    header: string;
    accessorKey: keyof T;
    sortable?: boolean;
};

// Define the type of data you will pass in
type VehicleData = {
    color: string;
    year: number;
    make: string;
    model: string;
    mileage: string;
    vin: string;
    licensePlate: string;
    unit: number;
    createdDate: string;
    tags?: string[];
};

const VehiclesTable = () => {
    

    const dispatch = useAppDispatch();

    // Fetching data and loading state from Redux
    const data = useAppSelector((state) => state.list.allVehicles);
    const loading = useAppSelector((state) => state.list.loading);
    const filterData = useAppSelector((state) => state.list.filterData);
    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.list.vehicleTableData
    );

    const fetchData = useCallback(() => {
        dispatch(getVehicles({ pageIndex, pageSize, sort, query, filterData }));
    }, [pageIndex, pageSize, sort, query, filterData, dispatch]);

    useEffect(() => {
        fetchData()
        
    }, [fetchData, pageIndex, pageSize, sort, filterData]);

    const tableData = useMemo(
        () => ({ pageIndex, pageSize, sort, query, total }),
        [pageIndex, pageSize, sort, query, total]
    );

    



    const [savedTags] = useState<string[]>(['Permanent', 'VIP', 'New', 'Returning']); // List of saved tags
    const [searchTerm, setSearchTerm] = useState<string>(''); // Search term for filtering tags
    const [selectedTags, setSelectedTags] = useState<Record<number, string[]>>({}); // Tags for each Vehicle by index

    const columns: ColumnDef<VehicleData>[] = useMemo(() => [
        { header: 'Color', accessorKey: 'color', sortable: true },
        { header: 'Year', accessorKey: 'year' },
        { header: 'Make', accessorKey: 'make' },
        { header: 'Model', accessorKey: 'model' },
        { header: 'Mileage', accessorKey: 'mileage' },
        { header: 'VIN', accessorKey: 'vin' },
        { header: 'License Plate', accessorKey: 'licensePlate' },
        { header: 'Unit#', accessorKey: 'unit' },
        { header: 'Created Date', accessorKey: 'createdDate' },
        {
            header: 'Tags',
            accessorKey: 'tags',
            // Custom cell renderer to include tag selection
            sortable: false,
            cell: (rowIndex: number) => (
                <div className="relative">
                    {selectedTags[rowIndex]?.map((tag, idx) => (
                        <span key={idx} style={{ marginRight: '8px' }}>
                            {tag} <button onClick={() => handleRemoveTag(rowIndex, tag)} className="ml-1 text-red-500">x</button>
                        </span>
                    ))}
                    {/* Updated Button with Styles */}
                    <button
                        style={{
                            backgroundColor: '#f0f0f0', // light grey background
                            width: '20px', // square shape
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '3px', // square with slightly rounded corners
                            border: '1px solid #fff', // optional border
                            cursor: 'pointer',
                        }}
                        // onClick={() => document.getElementById(`tagDropdown-${rowIndex}`)?.classList.toggle('hidden')}
                    >
                        <HiOutlinePlus size={24} color="#3457D5" /> {/* Blue color and size of the icon */}
                    </button>
                    
                    {/* Compact Dropdown for Tag Selection */}
                    <div
                        id={`tagDropdown-${rowIndex}`}
                        className="hidden absolute z-10 bg-white border border-gray-300 p-2 rounded shadow-md mt-2 w-48"
                    >
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mb-2 p-1 w-full border border-gray-300 rounded text-sm"
                        />
                        <ul className="max-h-32 overflow-y-auto text-sm">
                            {savedTags.filter(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())).map((tag, idx) => (
                                <li key={idx} className="flex items-center mb-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedTags[rowIndex]?.includes(tag) || false}
                                        onChange={() => handleAddTag(rowIndex, tag)}
                                        className="mr-2"
                                    />
                                    {tag}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ),
        },
    ], [selectedTags, searchTerm]);

    // Handler for adding a tag
    const handleAddTag = (rowIndex: number, tag: string) => {
        setSelectedTags(prevTags => {
            const newTags = prevTags[rowIndex] ? [...prevTags[rowIndex]] : [];
            if (!newTags.includes(tag)) {
                newTags.push(tag);
            }
            return { ...prevTags, [rowIndex]: newTags };
        });
    };

    // Handler for removing a tag
    const handleRemoveTag = (rowIndex: number, tag: string) => {
        setSelectedTags(prevTags => {
            const newTags = prevTags[rowIndex]?.filter(t => t !== tag) || [];
            return { ...prevTags, [rowIndex]: newTags };
        });
    };

    const onPaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData);
        newTableData.pageIndex = page;
        dispatch(setVehicleTableData(newTableData));
    };

    const onSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData);
        newTableData.pageSize = Number(value);
        newTableData.pageIndex = 1;
        dispatch(setVehicleTableData(newTableData));
    };

    const onSort = (sort: any) => {
        const newTableData = cloneDeep(tableData);
        newTableData.sort = sort;
        dispatch(setVehicleTableData(newTableData));
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

export default VehiclesTable;
