import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { HiDotsHorizontal } from 'react-icons/hi'; // Importing the 3-dot icon
import { setTableData, useAppDispatch, useAppSelector } from '../Store';
import { getFees } from "../../../Dealer/DealerInventory/store/inventorySlice";
import { Button, Notification, toast } from '@/components/ui'
import BasicInfo from '../FeesForm/BasicInfo'  // Update path if needed
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import AddNewCategoryModal from '../../DealerSharedComponent/AddNewCategoryModal'
import { apiAddNewFee } from '../Services/DealerInventoryServices'
import { apiUpdateFee } from '../Services/DealerInventoryServices'
import { apiDeleteFee } from '../Services/DealerInventoryServices'

// Define the proper structure for your columns based on ColumnDef
type ColumnDef<T> = {
    header: string;
    accessorKey: keyof T;
    sortable?: boolean;
    cell?: (info: any) => JSX.Element; // Add custom rendering for specific cells
};

// Define the type of data you will pass in for FeesTable
type FeeData = {
    feeName: string;
    feeType: string;
    feeValue: number;
    feePercent: number;
    category: string;
};

const FeesTable = () => {
    const [AddCategoryModelOpen, setAddCategoryModelOpen] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const dispatch = useAppDispatch()
    let data = useAppSelector((state) => state.inventory.allFees);
    const originalData = useAppSelector((state) => state.inventory.allFees);
    const loading = useAppSelector((state) => state.inventory.loading);
    const filterData = useAppSelector((state) => state.inventory.filterData);
    const [isUpdate, setIsUpdate] = useState(false);  // Add this line

    data = data.map((fee: any) => ({
        ...fee, // Keep existing properties
        feeType:
            fee.feeType === "percentOfLineItem"
                ? "Percent of Line Item"
                : fee.feeType === "fixedDollar"
                    ? "Fixed"
                    : fee.feeType === "percentOfService"
                        ? "Percent of Service"
                        : fee.feeType // In case feeType has an unexpected value
    }));

    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.inventory.tableData
    );


    const fetchData = useCallback(() => {
        dispatch(getFees({ pageIndex, pageSize, sort, query, filterData }))
    }, [pageIndex, pageSize, sort, query, filterData, dispatch])

    useEffect(() => {
        fetchData()
    }, [fetchData, pageIndex, pageSize, sort, filterData])

    const tableData = useMemo(
        () => ({ pageIndex, pageSize, sort, query, total, filterData }),
        [pageIndex, pageSize, sort, query, total]
    )

    const [showMenu, setShowMenu] = useState<{ [key: string]: boolean }>({});

    // Handle show/hide of the menu
    const toggleMenu = (id: string) => {
        setShowMenu(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };


    const handleButtonClick = () => {
        setShowForm(!showForm)
    }
    const [selectedFee, setSelectedFee] = useState<any | null>(null);

    const handleAction = (action: string, id: string) => {

        const selectedFee = originalData.find((fee: any) => fee.id === id); // Assuming feeName is unique
         
        if (action === 'edit' && selectedFee) {
            setIsUpdate(true); // Set isUpdate to true when edit is clicked
            setShowForm(true);
            setSelectedFee(selectedFee);  // Store the selected fee in a state variable
        } else if (action === 'delete') {
            console.log(`Delete action for ID: ${id}`);
            // Call the delete API
            {
                apiDeleteFee(id);// API call to delete the fee
                fetchData();  // Refresh data after deletion
            }
        }
        setShowMenu(prev => ({
            ...prev,
            [id]: false,
        }));
    };


    const initialValues = {
        feeName: '',
        category: '',
        feeType: '',
        feeAmount: null,
    }

    const validationSchema = Yup.object().shape({
        feeName: Yup.string().required("Fee Name is required"),
        category: Yup.string().required("Category is required"),
        feeType: Yup.string().required("Fee Type is required"),
        feeAmount: Yup.number().when('feeType', {
            is: 'fixedDollar',
            then: (schema) => schema.required("Fee Amount is required for Fixed Dollar"),
            otherwise: (schema) => schema.notRequired(),
        }),
        percentOfLineItem: Yup.number().when('feeType', {
            is: 'percentOfLineItem',
            then: (schema) => schema.required("Percent of Line Item is required").max(100, "Cannot exceed 100%"),
            otherwise: (schema) => schema.notRequired(),
        }),
        percentOfService: Yup.number().when('feeType', {
            is: 'percentOfService',
            then: (schema) => schema.required("Percent of Service is required").max(100, "Cannot exceed 100%"),
            otherwise: (schema) => schema.notRequired(),
        }),
    });


    const columns: ColumnDef<FeeData>[] = useMemo(() => [
        { header: 'Name', accessorKey: 'feeName' },
        { header: 'Type', accessorKey: 'feeType' },
        { header: 'Value', accessorKey: 'feeValue' },
        { header: 'Percent', accessorKey: 'feePercent' },
        { header: 'Category', accessorKey: 'category.label' },
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
    ], [showMenu]);

    return (
        <div>
            <DataTable
                columns={columns}
                data={data}
            />
            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white w-[650px] h-[550px] rounded-lg shadow-lg relative border border-gray-200">
                        <div className="flex justify-between items-center p-3 border-b">
                            <h3 className="text-base font-semibold">New Fee</h3>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={handleButtonClick}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="overflow-y-auto p-4" style={{ height: 'calc(100% - 110px)' }}>
                            {/* <Formik
                                        initialValues={{
                                            feeName: selectedFee?.feeName || '',
                                            category: selectedFee?.category._id || '',
                                            feeType: selectedFee?.feeType || '',
                                            feeAmount: selectedFee?.feeValue || null,
                                        }}
                                        validationSchema={validationSchema}
                                        onSubmit={(values, { resetForm }) => {
                                            apiAddNewFee(values);
                                            getFees(tableData)
                                            resetForm()
                                            setShowForm(false)
                                        }}
                                    > */}
                            <Formik
                                initialValues={{
                                    feeName: selectedFee?.feeName || '',  // If updating, use the selectedFee
                                    category: selectedFee?.category._id || '',  // If updating, use selected category
                                    feeType: selectedFee?.feeType || '',
                                    feeAmount: selectedFee?.feeValue || null,
                                }}
                                validationSchema={validationSchema}
                                onSubmit={async (values, { resetForm }) => {
                                    
                                    console.log("All values of Fee : ",values)
                                    if (isUpdate) {
                                        // If it's an update, call the API to update the fee

                                        await apiUpdateFee(values, selectedFee?.id); // Make sure you have an API method for updating
                                        getFees(tableData);  // Fetch updated data
                                        resetForm();
                                        setShowForm(false);  // Close the form


                                    } else {
                                        // If it's a new fee, call the API to add the fee
                                        console.log("Fee s Values : ",values)
                                        await apiAddNewFee(values);
                                        toast.push(<Notification title="Success" type="success">New Category Saved Successfully</Notification>);
                                        console.log(isUpdate)
                                        getFees(tableData);  // Fetch updated data
                                        resetForm();
                                        setShowForm(false);  // Close the form
                                    }
                                }}
                            >

                                {({ touched, errors }) => (
                                    <Form>
                                        <BasicInfo
                                            touched={touched}
                                            errors={errors}
                                            setAddCategoryModelOpen={setAddCategoryModelOpen}
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 flex justify-end p-2 border-t bg-white">
                                            <Button
                                                variant="primary"
                                                type="button"
                                                className="bg-gray-300 mr-2 px-4 py-1.5"
                                                onClick={handleButtonClick}
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
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                            {AddCategoryModelOpen && (
                                <AddNewCategoryModal
                                    isOpen={AddCategoryModelOpen}
                                    onClose={() => setAddCategoryModelOpen(false)}
                                />
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default FeesTable;
