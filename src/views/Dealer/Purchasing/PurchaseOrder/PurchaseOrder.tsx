import { useState, useMemo, useRef } from 'react';
import "./styles.css";
import DataTable from '@/components/shared/DataTable';
import type { ColumnDef, OnSortParam } from '@/components/shared/DataTable';
import { Field, Form, Formik, useFormik } from 'formik';
import SelectAndButton from '@/components/ui/SelectAndButton';
import { Button, FormContainer, FormItem, Input, Select } from '@/components/ui';
import { GrCubes } from "react-icons/gr";
import { FaCubesStacked } from "react-icons/fa6";
import { HiPlusCircle } from 'react-icons/hi';
import handleButtonClick from '../../DealerInventory/Tires/TiresStatistics';
import TiresTableTools from '../../DealerInventory/Tires/TiresTableTools'; // Import TiresTableTools component
import PartsTable from './addPartsTable';
import TiresTable from './addTiresTable';
import FeesTable from './addFeesTable';
import AddCustomerModal from '../../AddCustomerModal';
import Tooltip from '@/components/ui/Tooltip';
import { BiInfoSquare } from "react-icons/bi";
import { TbEditCircle } from "react-icons/tb";
import { AiTwotoneExclamationCircle } from "react-icons/ai";
import { GiCarWheel } from "react-icons/gi";
import { AiOutlineDollarCircle } from "react-icons/ai";
import AddNewCustomerModal from '../../DealerSharedComponent/AddNewCustomerModal';

type PurchaseOrder = {
    id: string;
    createdDate: string;
    order: string;
    notes: string;
    vendor: string; // Changed from vendor to vendor
    invoiceNum: string;
    items: number;
    total: string;
    status: any;
};

const selectStatusOptions = [
    {
        label: (
            <div className="flex items-center justify-start">
                <TbEditCircle className="mr-1" />
                <p>Draft</p>
            </div>
        ),
        value: 1,
    },
    {
        label: (
            <div className="flex items-center justify-start">
                <AiTwotoneExclamationCircle className="mr-1" />
                <p>Cancelled</p>
            </div>
        ),
        value: 2
    },
]

const PurchaseOrderPage = () => {
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

    // const [isModalOpen, setModalOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isReceived, setIsReceived] = useState(false); // State for received button
    const [note, setNote] = useState(''); // State for note input
    const [isNoteOpen, setIsNoteOpen] = useState(false); // Stat
    const [showAddParts, setShowAddParts] = useState(true);
    const [componentToShow, setComponentToShow] = useState("");
    const [subtotalchange,setsubtotalchange] = useState(0);
    const [partsTableRowCount,setPartsTableRowCount] = useState(0);
    const [tiresTableRowCount,setTiresTableRowCount] = useState(0);
    const [feesTableRowCount,setFeesTableRowCount] = useState(0);
    const [selectedVendor, setSelectedVendor] = useState(0);
    const [selectedWorkOrder, setSelectedWorkOrder] = useState(0);

    const [selectedParts, setSelectedParts] = useState({});
    const [selectedTires, setSelectedTires] = useState({});

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const formik = useFormik({
        initialValues: {
            poNumber: '',
            status: 0, // Set initial status to Draft
            vendor: '',
            workOrder: '',
            VendorInvoiceNumber: '',
            box: '',
        },
        onSubmit: (values) => {
            // Handle form submission
            closeModal(); // Close modal after submission
        },
    });

    const WorkOrderOptions = [
        { value: 'WorkOrder 1', label: 'WorkOrder 1' },
        { value: 'WorkOrder 2', label: 'WorkOrder 2' },
    ];
    
    const VendorOptions = [
        { value: 'vendor 1', label: 'Vendor 1' },
        { value: 'vendor 2', label: 'Vendor 2' },
    ];

    // Hardcoded data
    const data: PurchaseOrder[] = [
        { id: 'PO123', createdDate: '2024-10-01', order: 'Order123', notes: 'Sample notes', vendor: 'Vendor A', invoiceNum: 'INV001', items: 3, total: '$200', status: 'Draft' },
        { id: 'PO124', createdDate: '2024-10-02', order: 'Order124', notes: 'Sample notes', vendor: 'Vendor B', invoiceNum: 'INV002', items: 2, total: '$150', status: 'Cancelled' },
        // Other data entries can remain the same or be updated accordingly
    ];

    const columns: ColumnDef<PurchaseOrder>[] = useMemo(() => {
        return [
            {
                header: 'PO #',
                accessorKey: 'id',
            },
            {
                header: 'Created Date',
                accessorKey: 'createdDate',
            },
            {
                header: 'Order',
                accessorKey: 'order',
            },
            {
                header: 'Notes',
                accessorKey: 'notes',
            },
            {
                header: 'Vendor', // Changed from Vendor to Vendor
                accessorKey: 'vendor',
            },
            {
                header: 'Invoice Num',
                accessorKey: 'invoiceNum',
            },
            {
                header: 'Items',
                accessorKey: 'items',
            },
            {
                header: 'Total',
                accessorKey: 'total',
            },
            {
                header: 'Status',
                accessorKey: 'status',
            },
        ];
    }, []);

    const partsRowTableCount = useRef(0);
    const tiresRowTableCount = useRef(0);
    const feesRowTableCount = useRef(0);

    const handleAddItemClick = (part: string) => {
        // Logic for adding parts can go here
        setShowAddParts(false); // Remove the section on click
        setComponentToShow(part);
        if (part === "parts") setPartsTableRowCount(1);
        else if (part === "tires") setTiresTableRowCount(1);
        else if (part === "fees") setFeesTableRowCount(1);
    };

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
    const toggleNoteBox = () => {
        setIsNoteOpen(!isNoteOpen);
    };
    const handleOrderReceived = () => {
        setIsReceived(!isReceived);
    };
    function setFieldValue(arg0: string, value: unknown): void {
        throw new Error('Function not implemented.');
    }
    const [isAddCustomerModalOpen, setAddCustomerModalOpen] = useState(false);

    const handlesubtotalchange = (subtotal: any) => {
        setsubtotalchange(subtotal)
    }

    const getTablesToRender = () => {
        let tablesToRender = [];
        tablesToRender.push(partsTableMap[componentToShow]);
        if (componentToShow === "parts") {
            if (tiresTableRowCount >= 1) tablesToRender.push(partsTableMap["tires"]);
            if (feesTableRowCount >= 1) tablesToRender.push(partsTableMap["fees"]);
        } else if (componentToShow === "tires") {
            if (partsTableRowCount >= 1) tablesToRender.push(partsTableMap["parts"]);
            if (feesTableRowCount >= 1) tablesToRender.push(partsTableMap["fees"]);
        } else if (componentToShow === "fees") {
            if (partsTableRowCount >= 1) tablesToRender.push(partsTableMap["parts"]);
            if (tiresTableRowCount >= 1) tablesToRender.push(partsTableMap["tires"]);
        }

        return tablesToRender;
    }

    const handlePartsRemove = () => {
        setPartsTableRowCount(0);
        partsRowTableCount.current = 0;
        if (!tiresRowTableCount.current && !feesRowTableCount.current) {
            setComponentToShow("");
            setShowAddParts(true)
        }
    }

    const handleTiresRemove = () => {
        setTiresTableRowCount(0);
        tiresRowTableCount.current = 0;
        if (!partsRowTableCount.current && !feesRowTableCount.current) {
            setComponentToShow(""); setShowAddParts(true)
        }
    }

    const handleFeesRemove = () => {
        setFeesTableRowCount(0);
        feesRowTableCount.current = 0;
        if (!tiresRowTableCount.current && !partsRowTableCount.current) {
            setComponentToShow("");
            setShowAddParts(true);
        }
    }

    const partsTableMap = {
        parts: <PartsTable onPartSelect={(rowWiseMap: any) => setSelectedParts(rowWiseMap)} partsTableRowCount={partsTableRowCount} handleRemove={() => handlePartsRemove()} />,
        tires: <TiresTable onTireSelect={(rowWiseMap: any) => setSelectedTires(rowWiseMap)}  tiresTableRowCount={tiresTableRowCount} handleRemove={() => handleTiresRemove()} />,
        fees: <FeesTable feesTableRowCount={feesTableRowCount} handleRemove={() => handleFeesRemove()} handlesubtotalchange={handlesubtotalchange}/>,
    };

    function setAddPartModalOpen(arg0: boolean): void {
        throw new Error('Function not implemented.');
    }

    const handlePartsIncrement = () => {
        let a = partsTableRowCount;
        a++;
        setPartsTableRowCount(a);
        partsRowTableCount.current = a;
    }

    const handleTiresIncrement = () => {
        let a = tiresTableRowCount;
        a++;
        setTiresTableRowCount(a);
        tiresRowTableCount.current = a;
    }

    const handleFeesIncrement = () => {
        let a = feesTableRowCount;
        a++;
        setFeesTableRowCount(a);
        feesRowTableCount.current = a;
    }

    return (
        <div className="p-6 min-h-screen">
            {/* Header section */}
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Purchase Order</h1>
                <Button
                    variant="solid"
                    type="button"
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium flex items-center gap-1 px-3 py-1.5"
                    onClick={openModal}
                >
                    <HiPlusCircle className="h-4 w-4" />
                    New Purchase order
                </Button>
            </div>

            {/* Tools Section */}
            <TiresTableTools /> {/* Add the tools component here */}

            {/* Table Section */}
            <div className="overflow-x-auto">
                <DataTable<PurchaseOrder>
                    columns={columns}
                    data={data}
                    loading={false} // No loading since we're using hardcoded data
                    pagingData={{
                        total: data.length, // Total from hardcoded data
                        pageIndex: tableData.pageIndex,
                        pageSize: tableData.pageSize,
                    }}
                    onPaginationChange={handlePaginationChange}
                    onSelectChange={handleSelectChange}
                    onSort={handleSort}
                />
            </div>
            

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[1200px] max-h-[90vh] overflow-y-auto"> {/* Increased width and added scrollable behavior */}
                        <h2 className="text-2xl font-semibold mb-4">New Purchase Order</h2>
                        <div className="border-b border-gray-300 mb-4" /> {/* Line under the heading */}
                        <Formik
                            initialValues={{
                                poNumber: '',
                                status: 1, // Set initial status to Draft
                                vendor: '',
                                workOrder: '',
                                VendorInvoiceNumber: '',
                                box: '',
                                note: "",
                            }}
                            onSubmit={(values, { setSubmitting }) => {
                                let valuesToSubmit = values;
                                valuesToSubmit.vendor = selectedVendor.value;
                                valuesToSubmit.note = note;
                                valuesToSubmit.workOrder = selectedWorkOrder.value;
                                valuesToSubmit.ordered = isReceived;
                                valuesToSubmit.parts = Object.values(selectedParts);
                                valuesToSubmit.tires = Object.values(selectedTires);
                                valuesToSubmit.fees = subtotalchange;
                            }}
                        >
                        {({touched, errors, isSubmitting}) => (<Form>
                        <FormContainer>
                        {/* <form onSubmit={formik.handleSubmit} className="space-y-4"> */}
                            {/* Flex container for side-by-side layout */}
                            <div className="flex space-x-4"> {/* Adjusted space between fields */}
                                <div className="flex-1">
                                    <label className="flex items-center justify-start font-semibold mb-2">
                                        PO Number
                                        <Tooltip title="PO number will be chosen after saving">
                                            <span className="cursor-pointer"><BiInfoSquare className="ml-1 text-xs mt-0.5" /></span>
                                        </Tooltip>
                                    </label>
                                    <FormItem>
                                        <Field
                                            type="text"
                                            name="poNumber"
                                            className="input border border-gray-300 p-2.5 w-full bg-slate-100"
                                            component={Input}
                                            disabled
                                        />
                                    </FormItem>
                                </div>
                                <div className="flex-1">
                                    <label className="block font-semibold mb-2">Status</label>
                                    {/* <select
                                        name="status"
                                        onChange={formik.handleChange}
                                        value={formik.values.status}
                                        className="input border border-gray-300 p-2 w-full"
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select> */}
                                    <FormItem>
                                        <Field
                                            as="select"
                                            name="status"
                                            className="p-2 rounded-md w-full text-sm h-11 bg-transparent border border-x-gray-300"
                                        >
                                            {selectStatusOptions.map(val => (
                                                <option key={val.value} value={val.value}>{val.label}</option>
                                            ))}
                                        </Field>
                                    </FormItem>
                                </div>
                                <div className="flex-1">
                                    <label className="block font-semibold mb-2">Vendor</label>
                                    <FormItem>
                                        <SelectAndButton
                                            options={VendorOptions}
                                            addNewButtonLabel="Add New Vendor"
                                            onChange={(value) => setSelectedVendor(value)}
                                            placeholder="Select or Add Vendor"
                                            addNewClick={() => setAddCustomerModalOpen(true)}
                                            className="mb-4"
                                            value={selectedVendor}
                                            // name="vendor"
                                        />
                                    </FormItem>
                                </div>
                                <div className="flex-1">
                                    <label className="flex items-center justify-start font-semibold mb-2">
                                        Vendor Invoice Number
                                        <Tooltip title="Multiple invoices may be added using a comma (e.g 1234,5678).">
                                            <span className="cursor-pointer"><BiInfoSquare className="ml-1 text-xs mt-0.5" /></span>
                                        </Tooltip>
                                    </label>
                                    <FormItem>
                                        <Field
                                            type="text"
                                            name="VendorInvoiceNumber"
                                            component={Input}
                                            className="input border border-gray-300 p-2.5 w-full"
                                        />
                                    </FormItem>
                                    {/* <input
                                        type="text"
                                        name="VendorInvoiceNumber"
                                        // onChange={formik.handleChange}
                                        value={formik.values.VendorInvoiceNumber}
                                        className="input border border-gray-300 p-2.5 w-full"
                                    /> */}
                                </div>
                                                        {/* Total Section on the right */}
                                <div className="flex-1 flex flex-col justify-end items-end">
                                    <div className="text-right">
                                    <h3 className="text-lg font-semibold">Total</h3>
                                    <p className="text-xl font-bold">${subtotalchange}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='w-1/2 mb-4'>
                                <label className="block font-semibold mb-2">Work Order</label>
                                <Select
                                    placeholder="Please Select"
                                    options={WorkOrderOptions}
                                    onChange={(value) => setSelectedWorkOrder(value)}
                                    value={selectedWorkOrder}
                                />
                            </div>
                            <div className="flex justify-between items-center">
                            {/* Add Note Button */}
                            <Button
                                type="button" 
                                className="bg-transparent border-0 !text-blue-500 add-note-btn"
                                onClick={toggleNoteBox}
                            >
                                {isNoteOpen ? "Hide Note" : "Add Note"}
                            </Button>
                            
                          {/* Mark as Ordered Button */}
                            <Button
                                type="button"
                                className="bg-transparent !border-blue-500 !text-blue-500"
                                onClick={handleOrderReceived}
                            >
                                {isReceived ? "Ordered" : "Mark as Ordered"}
                            </Button>


                            </div>
                            {isNoteOpen && (
                                <div className="mt-4">
                                    <textarea
                                        rows={4}
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Add a note..."
                                        className="border border-gray-300 p-2 w-full"
                                        name="note"
                                    />
                                </div>
                            )}

                            {/* Silver line after notes */}
                            {/* <div className="border-b border-gray-300 mb-4" /> */}
                            
        <div>
            {showAddParts && ( // Conditional rendering based on state
                <>
                    <div className="border-b border-gray-300 mb-5 seperator-negative-margin" />
                    <div className="relative">
                        <div className="input border border-gray-300 w-full h-60 flex flex-col justify-center items-center text-center" style={{ resize: 'none' }}>
                            <FaCubesStacked className='mb-4' size={50} />
                            <p className='mb-4'>Add Parts or Tires to get started</p>
                            <div className="flex space-x-2 justify-center">
                                <Button
                                    variant="twoTone"
                                    type="button"
                                    className="text-sm text-blue-500 border-0 hover:underline flex items-center"
                                    onClick={() => handleAddItemClick("parts")}// This will remove the section
                                >
                                    <FaCubesStacked className='mr-2' />
                                    Add Parts
                                </Button>
                                <Button
                                    variant="twoTone"
                                    type="button"
                                    className="text-sm text-blue-500 border-0 hover:underline flex items-center"
                                    onClick={() => handleAddItemClick("tires")} // Add Tires logic can be similar
                                >
                                    <GiCarWheel className='mr-2' />
                                    Add Tires
                                </Button>
                                <Button
                                    variant="twoTone"
                                    type="button"
                                    className="text-sm text-blue-500 border-0 hover:underline flex items-center"
                                    onClick={() => handleAddItemClick("fees")}
                                >
                                    <AiOutlineDollarCircle className='mr-2' />
                                    Add Fees
                                </Button>

                            </div>
                        </div>
                    </div>
                </>
            )}
                {/* {!showAddParts && componentToShow && partsTableMap[componentToShow]} */}
                {!showAddParts && componentToShow && getTablesToRender()}
                {!showAddParts &&<div className="flex space-x-4 mt-4">
                <h3 className="text-lg font-semibold">Add</h3>
                <button type='button' className="bg-transparent text-blue-500 border-none" onClick={() => handlePartsIncrement()}>Parts</button>
                <button type='button' className="bg-transparent text-blue-500 border-none" onClick={() => handleTiresIncrement()} >Tires</button>
                <button type='button' className="bg-transparent text-blue-500 border-none" onClick={() => handleFeesIncrement()}>Fees</button>
            </div>}
        </div>  
                            {/* Buttons container with box */}      
                            <div className="flex  justify-end space-x-2">
                            <Button type="button" onClick={closeModal} className="bg-gray-300 hover:bg-gray-400">
                                    Cancel
                                </Button>
                            <Button
                                variant="solid"
                                type="submit"
                                size="md"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-large flex items-center gap-1 px-3 py-1.5"
                            >
                                Save
                            </Button> 
                            {/* <Button type="submit" className="!bg-blue-500 !text-gray-50">
                                    Save
                                </Button> */}                                
                            </div>
                            
                        {/* </form> */}
                        </FormContainer>
                        </Form>)}
                        </Formik>
                    </div>
                </div>
            )}

        {isAddCustomerModalOpen && (
                <AddNewCustomerModal
                        isOpen={isAddCustomerModalOpen}
                    onClose={() => setAddCustomerModalOpen(false)}
                    onCustomerAdded={(newCustomer: any) => setAddCustomerModalOpen(false)}
                />
            )}
        </div>
    );
};

export default PurchaseOrderPage;
