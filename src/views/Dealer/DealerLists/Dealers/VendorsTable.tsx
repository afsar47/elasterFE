import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { HiOutlinePlus } from 'react-icons/hi'; // Importing the plus icon from react-icons
import DataTable from '@/components/shared/DataTable';
import { getVendors, useAppDispatch, useAppSelector } from '../Store';
import { getAllVendors } from '../../DealerInventory/store';

// Define the proper structure for your columns based on ColumnDef
type ColumnDef<T> = {
    header: string;
    accessorKey: keyof T;
    sortable?: boolean;
};

// Define the type of data you will pass in
type VendorData = {
    vendorName: string;
    vendorUrl: string;
    vendorAccountNumber: number;
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: number;
};

const VendorsTable = () => {
    const dispatch = useAppDispatch()
    const data = useAppSelector((state) => state.list.allVendors);
    const loading = useAppSelector((state) => state.list.loading);
    const filterData = useAppSelector((state) => state.list.filterData);

    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.dealer.tableData
    );


    const fetchData = useCallback(() => {
        dispatch(getVendors({ pageIndex, pageSize, sort, query, filterData }))
    }, [pageIndex, pageSize, sort, query, filterData, dispatch])

    useEffect(() => {
        fetchData()
    }, [fetchData, pageIndex, pageSize, sort, filterData])

    const tableData = useMemo(
        () => ({ pageIndex, pageSize, sort, query, total }),
        [pageIndex, pageSize, sort, query, total]
    )

    const [savedTags] = useState<string[]>(['Permanent', 'VIP', 'New', 'Returning']); // List of saved tags
    const [searchTerm, setSearchTerm] = useState<string>(''); // Search term for filtering tags
    const [selectedTags, setSelectedTags] = useState<Record<number, string[]>>({}); // Tags for each customer by index
    const columns: ColumnDef<VendorData>[] = useMemo(() => [
        { header: 'Name', accessorKey: 'vendorName', sortable: true },
        { header: 'URL', accessorKey: 'vendorUrl', sortable: true },
        { header: 'Account No.', accessorKey: 'vendorAccountNumber', sortable: true },
        { header: 'First Name', accessorKey: 'vendorContactPerson.firstName', sortable: true },
        { header: 'Last Name', accessorKey: 'vendorContactPerson.lastName', sortable: true },
        { header: 'Email', accessorKey: 'vendorContactPerson.email' },
        { header: 'Phone Number', accessorKey: 'vendorContactPerson.contactNumber' },
    ], []);

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

    return (
        <DataTable
            columns={columns}
            data={data}
        />
    );
};

export default VendorsTable;
