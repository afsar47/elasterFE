import { useState, useMemo } from 'react';
import DataTable from '@/components/shared/DataTable';
import type { ColumnDef, OnSortParam } from '@/components/shared/DataTable';
import { useFormik } from 'formik';
import TiresTableTools from '../../DealerInventory/Tires/TiresTableTools';
import Segment from '@/components/ui/Segment'; // Import Segment component

type ReturnOrder = {
    id: string;
    status: string;
    name: string;
    part: string;
    dealer: string;
    total: string;
    type: string;
    returnOrder: string;
    updatedDate: string;
    notes: string;
};

const ReturnsPage = () => {
    const [tableData, setTableData] = useState<{
        pageIndex: number;
        pageSize: number;
        sort: {
            order: '' | 'asc' | 'desc';
            key: string | number;
        };
        query: string;
        total: number;
    }>({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sort: {
            order: '',
            key: '',
        },
    });

    const [selectedSegment, setSelectedSegment] = useState<string>('all'); // State for selected segment

    const formik = useFormik({
        initialValues: {
            status: 'Draft',
            dealer: '',
            workOrder: '',
            DealerInvoiceNumber: '',
            box: '',
        },
        onSubmit: (values) => {
        },
    });

    const data: ReturnOrder[] = [
        { id: 'RT123', status: 'Draft', name: 'Item A', part: 'Part A', dealer: 'Dealer A', total: '$200', type: 'Type A', returnOrder: 'Return123', updatedDate: '2024-10-01', notes: 'Sample note' },
        { id: 'RT124', status: 'Cancelled', name: 'Item B', part: 'Part B', dealer: 'Dealer B', total: '$150', type: 'Type B', returnOrder: 'Return124', updatedDate: '2024-10-02', notes: 'Sample note' },
        // Add more data entries here
    ];

    const filteredData = useMemo(() => {
        if (selectedSegment === 'parts') {
            return data.filter(item => item.part !== ''); // Filter logic for parts
        } else if (selectedSegment === 'cores') {
            return data.filter(item => item.type === 'Core'); // Example filter logic for cores
        }
        return data; // Show all if 'all' is selected
    }, [selectedSegment, data]);

    const columns: ColumnDef<ReturnOrder>[] = useMemo(() => {
        return [
            {
                header: 'Status',
                accessorKey: 'status',
            },
            {
                header: 'Name',
                accessorKey: 'name',
            },
            {
                header: 'Part',
                accessorKey: 'part',
            },
            {
                header: 'Dealer',
                accessorKey: 'dealer',
            },
            {
                header: 'Total',
                accessorKey: 'total',
            },
            {
                header: 'Type',
                accessorKey: 'type',
            },
            {
                header: 'Return',
                accessorKey: 'returnOrder',
            },
            {
                header: 'Updated Date',
                accessorKey: 'updatedDate',
            },
            {
                header: 'Note',
                accessorKey: 'notes',
            },
        ];
    }, []);

    const handlePaginationChange = (pageIndex: number) => {
        setTableData((prevData) => ({ ...prevData, pageIndex }));
    };

    const handleSelectChange = (pageSize: number) => {
        setTableData((prevData) => ({ ...prevData, pageSize }));
    };

    const handleSort = ({ order, key }: OnSortParam) => {
        setTableData((prevData) => ({
            ...prevData,
            sort: { order, key },
        }));
    };

    return (
        <div className="p-6 min-h-screen">
            {/* Header section */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold mb-4">Returns</h1>

                {/* Segment Control and Search Bar Side by Side with Spacing */}
                <div className="flex justify-between items-center space-x-4">
                    {/* Segment Control */}
                    <Segment className='h-12'>
                        <Segment.Item 
                            value="all" 
                            onClick={() => setSelectedSegment('all')} // Update selected segment
                        >
                            All
                        </Segment.Item>
                        <Segment.Item 
                            value="parts" 
                            onClick={() => setSelectedSegment('parts')} // Update selected segment
                        >
                            Parts
                        </Segment.Item>
                        <Segment.Item 
                            value="cores" 
                            onClick={() => setSelectedSegment('cores')} // Update selected segment
                        >
                            Cores
                        </Segment.Item>
                    </Segment>

                    {/* Search Bar */}
                    <div className="flex-grow mt-2">
                        <TiresTableTools />
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
                <DataTable<ReturnOrder>
                    columns={columns}
                    data={filteredData} // Use filtered data based on selected segment
                    loading={false} // No loading since we're using hardcoded data
                    pagingData={{
                        total: filteredData.length,
                        pageIndex: tableData.pageIndex,
                        pageSize: tableData.pageSize,
                    }}
                    onPaginationChange={handlePaginationChange}
                    onSelectChange={handleSelectChange}
                    onSort={handleSort}
                />
            </div>
        </div>
    );
};

export default ReturnsPage;
