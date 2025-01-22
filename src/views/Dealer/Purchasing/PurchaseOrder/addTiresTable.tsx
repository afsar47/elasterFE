import React, { useCallback, useEffect, useRef, useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import type { ColumnDef } from '@/components/shared/DataTable';
import SelectAndButton from '@/components/ui/SelectAndButton';
import { Formik, Form } from 'formik';
import { cloneDeep } from 'lodash';
import { apiNewPart } from '../../DealerLists/Services/DealerInventoryServices';
import { getParts, useAppDispatch } from '../../DealerInventory/store';
import { useAppSelector } from '@/store';
import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';
import BasicInfo from '../../DealerInventory/PartsForm/BasicInfo';
import PartsImage from '../../DealerInventory/PartsForm/PartsImage';
import { Button } from '@/components/ui';
import * as Yup from 'yup';
import TiresStatistics from '../../DealerInventory/Tires/TiresStatistics';
import { validationSchema } from '../../DealerLists/Customers/CustomersStatistics';

type Tire = {
    id: string;
    name: string;
    quantity: number;
    price: string;
    order: string;
    return: string;
    cost: string;
    subtotal: string;
    status: string;
};

const TiresTable = ({handleRemove, tiresTableRowCount, onTireSelect}) => {
    const [data, setData] = useState<Tire[]>([
        { id: 'F001', name: 'Fee A', quantity: 5, price: '$150', order: 'Order1', return: 'No', cost: '$120', subtotal: '$600', status: 'Available' },
    ]);

    const [selectedTire, setSelectedTire] = useState<object | null>({});
    const [addTireModalOpen, setAddTireModalOpen] = useState(false);

    const rowCountRef = useRef(0);

    const [newTire, setNewTire] = useState<Tire>({
        id: '',
        name: '',
        quantity: 0,
        price: '',
        order: '',
        return: '',
        cost: '',
        subtotal: '',
        status: ''
    });

    
    const handleRemoveRow = (id: string) => {
        setData((prevData) => prevData.filter(tire => tire.id !== id));
        if (data.length === 1) handleRemove();
    };

    useEffect(() => {
        if (tiresTableRowCount === 1) rowCountRef.current = 1;

        if (tiresTableRowCount > 1 && tiresTableRowCount !== rowCountRef.current) {
            rowCountRef.current = tiresTableRowCount;
            handleAddTire();
        }
    }, [ tiresTableRowCount ]);

    const initialValues = {
        brandName: '',
        size: '',
        part: '',
        partSku: '',
        note: '',
        url: '',
    }

    const tireOptions = data.map(tire => ({
        value: tire.id,
        label: tire.name,
    }));

    const columns: ColumnDef<Tire>[] = [
        {
            header: 'Tires',
            accessorKey: 'name',
            cell: (row) => (
                <div className="flex-1">
                    <SelectAndButton
                        key={row.row.original.id}
                        options={tireOptions}
                        addNewButtonLabel="Add New Tire"
                        onChange={(selectedOption) => {
                            let obj = { ...selectedTire };
                            obj[row.row.original.id] = selectedOption;
                            setSelectedTire(obj);
                            onTireSelect(obj);
                        }}
                        value={selectedTire[row.row.original.id]}
                        placeholder="Select or Add Tire"
                        addNewClick={() => setAddTireModalOpen(true)}
                        className="mb-4"
                    />
                </div>
            ),
        },
        { header: 'Tires#', accessorKey: 'id' },
        { header: 'Inventory', accessorKey: 'quantity' },
        { header: 'Order', accessorKey: 'order' },
        { header: 'Return', accessorKey: 'return' },
        { header: 'Cost', accessorKey: 'cost' },
        { header: 'Subtotal', accessorKey: 'subtotal' },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ row }) => (
                <div className="flex items-center">
                    <span>{row.original.status}</span>
                    <button
                        onClick={() => handleRemoveRow(row.original.id)}
                        className="ml-2 text-xl"
                        aria-label="Remove row"
                    >
                        ×
                    </button>
                </div>
            ),
        }   ,
    ];

    const filteredData = data;

    const handleAddTire = () => {
        const newId = `T00${data.length + 1}`;
        const tireToAdd = { ...newTire, id: newId, subtotal: `$${(newTire.quantity * parseFloat(newTire.cost.slice(1))).toFixed(2)}` };

        setData(prevData => [...prevData, tireToAdd]);
        setNewTire({ id: '', name: '', quantity: 0, price: '', order: '', return: '', cost: '', subtotal: '', status: '' });
        setAddTireModalOpen(false);
    };

    function setShowForm(arg0: boolean) {
        throw new Error('Function not implemented.');
    }

    return (
        <div className="overflow-x-auto ">
            {data.length > 0 && (
            <DataTable<Tire>
                columns={columns}
                data={filteredData}
                loading={false}
                onSelectChange={() => {}}
                onSort={() => {}}
            />)}

            {addTireModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-md w-[90vh] h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-semibold mb-4">Add New Tire</h2>
                        <div>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {
                                    resetForm()
                                    setShowForm(false)
                                }}
                            >
                                {({ touched, errors }) => (
                                    <Form>
                                        {/* Pass the touched and errors to BasicInfo */}
                                        <BasicInfo
                                            touched={touched}
                                            errors={errors}
                                        />                                       
                                    </Form>
                                )}
                            </Formik>
                            <div className="flex justify-end p-2 border-t">
                            <Button
                                variant="solid"
                                type="button"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5"
                                onClick={handleAddTire}
                            >
                                Save
                            </Button>
                            <Button
                                variant="primary"
                                type="button"
                                className="bg-gray-300 ml-2 px-4 py-1.5"
                                onClick={() => setAddTireModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TiresTable;
