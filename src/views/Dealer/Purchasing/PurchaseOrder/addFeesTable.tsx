import React, { useEffect, useRef, useState } from 'react';

type Fee = {
    id: string;
    feeType: string;
    subtotal: string;
};

interface FeesTableProps {
    handlesubtotalchange: (value: string) => void;
}

const FeesTable: React.FC<FeesTableProps> = ({ handlesubtotalchange, handleRemove, feesTableRowCount }) => {
    const [data, setData] = useState<Fee[]>([
        { id: 'F001', feeType: '', subtotal: '0' }, // Default subtotal set to '0'
    ]);

    const [ newFee, setNewFee ] = useState<Fee>({
        id: "",
        feeType: "",
        subtotal: "",
    });

    const rowCountRef = useRef(0);

    const handleFeeChange = (id: string, field: keyof Fee, value: string) => {
        const newData = data.map((fee) =>
            fee.id === id ? { ...fee, [field]: value } : fee
        );
        setData(newData);

        if (field === 'subtotal') {
            handlesubtotalchange(value);
        }
    };

    const handleDelete = (id: string) => {
        const newData = data.filter((fee) => fee.id !== id);
        setData(newData);
        if (data.length === 1) handleRemove();
    };

    const handleAddFees = () => {
        const newId = `F00${data.length + 1}`;
        const feeToAdd = { ...newFee, id: newId, subtotal: newFee.subtotal, feeType: newFee.feeType };

        setData(prevData => [...prevData, feeToAdd]);
        setNewFee({ id: "", subtotal: "", feeType: "" });
    };

    useEffect(() => {
        if (feesTableRowCount === 1) rowCountRef.current = 1;

        if (feesTableRowCount > 1 && feesTableRowCount !== rowCountRef.current) {
            rowCountRef.current = feesTableRowCount;
            handleAddFees();
        }
    }, [ feesTableRowCount ]);

    if (data.length === 0) return null; // Hide the table if there are no rows

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fees
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subtotal
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((fee) => (
                        <tr key={fee.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                    type="text"
                                    value={fee.feeType}
                                    onChange={(e) => handleFeeChange(fee.id, 'feeType', e.target.value)}
                                    className="p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                                    placeholder="Enter Fee Type"
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap flex items-center">
                                <input
                                    type="text"
                                    value={fee.subtotal}
                                    onChange={(e) => handleFeeChange(fee.id, 'subtotal', e.target.value)}
                                    className="p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                                    placeholder="0"
                                />
                                <button
                                    onClick={() => handleDelete(fee.id)}
                                    className="ml-2"
                                >
                                    &#10005; {/* Cross icon */}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FeesTable;
