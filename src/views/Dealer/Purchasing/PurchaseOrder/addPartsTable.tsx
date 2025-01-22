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

    type Part = {
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

    const PartsTable = ({handleRemove, partsTableRowCount, onPartSelect}) => {
        const [data, setData] = useState<Part[]>([
            { id: 'P001', name: 'Part A', quantity: 5, price: '$100', order: 'Order1', return: 'No', cost: '$90', subtotal: '$500', status: 'Available' },
        ]);

        const [selectedPart, setSelectedPart] = useState<object | null>({});
        const [addPartModalOpen, setAddPartModalOpen] = useState(false);

        const rowCountRef = useRef(0);

        const [newPart, setNewPart] = useState<Part>({
            id: 'P002',
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
            setData((prevData) => prevData.filter(part => part.id !== id));
            if (data.length === 1) handleRemove();
        };

        const partOptions = data.map(part => ({
            value: part.id,
            label: part.name,
        }));

        const columns: ColumnDef<Part>[] = [
            {
                header: 'Parts',
                accessorKey: 'name',
                cell: (row) => (
                    <div className="flex-1">
                        <SelectAndButton
                            key={row.row.original.id}
                            options={partOptions}
                            addNewButtonLabel="Add New Part"
                            onChange={(selectedOption) => {
                                let obj = { ...selectedPart };
                                obj[row.row.original.id] = selectedOption;
                                setSelectedPart(obj);
                                onPartSelect(obj);
                            }}
                            value={selectedPart[row.row.original.id]}
                            placeholder="Select or Add Part"
                            addNewClick={() => setAddPartModalOpen(true)}
                            className="mb-4"
                        />
                    </div>
                ),
            },
            { header: 'Parts#', accessorKey: 'id' },
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
            }
            
            ,
        ];

        // const filteredData = data;

        const handleAddPart = () => {
            // Ensure new part has a unique ID
            const newId = `P00${data.length + 1}`; // Example ID generation
            const partToAdd = { ...newPart, id: newId, subtotal: `$${(newPart.quantity * parseFloat(newPart.cost.slice(1))).toFixed(2)}` };

            // Update data state with new part
            setData(prevData => [...prevData, partToAdd]);
            setNewPart({ id: '', name: '', quantity: 0, price: '', order: '', return: '', cost: '', subtotal: '', status: '' });
            setAddPartModalOpen(false);
        };

        useEffect(() => {
            if (partsTableRowCount === 1) rowCountRef.current = 1;

            if (partsTableRowCount > 1 && partsTableRowCount !== rowCountRef.current) {
                rowCountRef.current = partsTableRowCount;
                handleAddPart();
            }
        }, [ partsTableRowCount ]);

        const initialValues = {
            partName: '',
            note: '',
            partSerialNo: 0,
            partSku: '',
            url: '',
            quantity: 0,
            minQuantity: 0,
            maxQuantity: 0,
            vendor: '',
            bin: '',
            cost: 0,
            retail: 0,
            category: '',
            brand: '',
            inventory:'0',
        }

        const validationSchema = Yup.object().shape({
            partName: Yup.string().required('Part Name is required').max(70, 'Part Name must be less than 70 characters'),
            brand: Yup.string().required('Brand Name is required'),
            partSerialNo: Yup.number().required('Part# is required').max(20, 'Vendor Name must be less than 20 characters'),
            partSku: Yup.string(),
            note: Yup.string(),
            vendor: Yup.string(),
            url: Yup.string().url('Invalid URL format'),
        })

        const dispatch = useAppDispatch()
        const { pageIndex, pageSize, sort, query, total } = useAppSelector(
            (state) => state.dealer.tableData
        );

        const filterData = useAppSelector((state) => state.inventory.filterData);

        const fetchData = useCallback(() => {
            dispatch(getParts({ pageIndex, pageSize, sort, query, filterData }))
        }, [pageIndex, pageSize, sort, query, filterData, dispatch])

        const [allPartDetail, setallPartDetail] = useState({
            total: 0,
            totalCost: 0,
            totalValue: 0
        })

        const [showForm, setShowForm] = useState(false)

        const [AddBrandModelOpen, setAddBrandModelOpen] = useState(false)
        const [AddVendorModelOpen, setAddVendorModelOpen] = useState(false)
        const [AddCategoryModelOpen, setAddCategoryModelOpen] = useState(false)

        const handleButtonClick = () => {
            setShowForm(!showForm) // Toggle form visibility
        }

        return (
    <div className="overflow-x-auto">
            {data.length > 0 && (
                <DataTable<Part>
                    columns={columns}
                    data={data}
                    loading={false}
                    onSelectChange={() => {}}
                    onSort={() => {}}
                />
            )}
                                                {/* <div><Button
                                                    variant="solid"
                                                    type="button"
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5"
                                                    onClick={handleAddPart}
                                                >
                                                    add row
                                                </Button></div> */}
                {addPartModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 ">
                        <div className="bg-white p-6 rounded shadow-md  w-[90vh] h-[90vh] overflow-y-auto ">
                            <h2 className="text-lg font-semibold mb-4">Add New Part</h2>
                            <div>
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={async (values, { resetForm }) => {
                                        const formData = cloneDeep(values)
                                        try {
                                            const response = await apiNewPart(values)
                                            fetchData();
                                            const data = useAppSelector((state) => state.inventory.allParts);
                                            const { totalCost, totalValue } = data.reduce(
                                                (acc: any, part: any) => ({
                                                    totalCost: acc.totalCost + (part.cost || 0),
                                                    totalValue: acc.totalValue + (part.retail || 0)
                                                }),
                                                { totalCost: 0, totalValue: 0 }
                                            );
                                            setallPartDetail({
                                                total: data.length,
                                                totalCost: totalCost,
                                                totalValue: totalValue
                                            })
                                            toast.push(
                                                <Notification title="Success" type="success">
                                                    New Part Saved Successfully
                                                </Notification>,
                                            )
                                            resetForm()
                                            setShowForm(false)
                                        } catch (error: any) {
                                            console.error(
                                                'Error saving form:',
                                                error.message,
                                            )
                                            toast.push(
                                                <Notification title="Error" type="danger">
                                                    {error.message ? error.message : "Server Error"}
                                                </Notification>,

                                            )
                                        }
                                    }}
                                >
                                    {({ touched, errors, handleSubmit, setFieldValue }) =>
                                    (
                                        <Form onSubmit={handleSubmit}>
                                            {/* Pass the touched and errors to BasicInfo */}
                                            <BasicInfo
                                                touched={touched}
                                                errors={errors}
                                                setFieldValue={setFieldValue}
                                                setAddBrandModelOpen={setAddBrandModelOpen}
                                                setAddVendorModelOpen={setAddVendorModelOpen}
                                                setAddCategoryModelOpen={setAddCategoryModelOpen}
                                            />
                                            <PartsImage />

                                            <div className="relative bottom-0 left-0 right-0 flex justify-end p-2 border-t bg-white">
                                                <Button
                                                    variant="primary"
                                                    type="button"
                                                    className="bg-gray-300 mr-2 px-4 py-1.5"
                                                    onClick={() => setAddPartModalOpen(false)}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="solid"
                                                    type="submit"
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5"

                                                >
                                                    Save
                                                </Button>
                                                {/* <div className="mb-4">
    <Button onClick={handleAddPart} variant="primary" className="!bg-blue-500 hover:bg-blue-600 text-white">
        Add Part
    </Button>
</div> */}

                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                                {/* <button
                                    onClick={handleAddPart}
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                                    Add Part
                                </button>
                                <button
                                    onClick={() => setAddPartModalOpen(false)}
                                    className="mt-4 px-4 py-2 bg-gray-500 text-white rounded">
                                    Close
                                </button> */}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    export default PartsTable;