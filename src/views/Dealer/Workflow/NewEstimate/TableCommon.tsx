import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import "./styles.css";

import { VscClose } from "react-icons/vsc";

type Column = {
  header: string;
  accessor: string;
  render: (value: any, rowIndex: number, handleChange: (index: number, key: string, value: any) => void) => JSX.Element;
};

type Props = {
  columns: Column[];
  initialData: Record<string, any>[];
  addRowLabel?: string;
};

const TableCommon = forwardRef<unknown, Props>(({ columns, initialData, addRowLabel, serviceNo, updateParentData, tableName, className, onTableMount, setActiveServiceNo, servicesTableData }, ref) => {
  const [data, setData] = useState<Record<string, any>[]>(initialData);
  const dataRef = useRef([]);


  const handleChange = (index: number, values: object, prefill: boolean) => {
    const updatedData = (prefill ? dataRef.current : data).map((row, i) => {
      return i === index ? { ...row, ...values } : row
    });

    dataRef.current = updatedData;
    setData(updatedData);
    //  

    setActiveServiceNo(serviceNo);
    // debugger
    // console.log("--fired", updateParentData)
    updateParentData(serviceNo, updatedData, tableName);
  };


  const addRow = (prefill: boolean) => {
    const newRow = columns.reduce((acc, column) => {
      acc[column.accessor] = '';
      return acc;
    }, {} as Record<string, any>);
    setData((prev) => [...prev, newRow]);
    let filteredData = [...dataRef.current];
    filteredData = filteredData.filter(obj => {
      for (const key in obj) {
        if (obj[key] !== "" && obj[key] !== null && obj[key] !== undefined) {
          return true;
        }
      }
      return false;
    });
    let dataToSpread = prefill ? filteredData : dataRef.current;
    dataRef.current = [...dataToSpread, newRow];
    // console.log("-----addRow", dataRef.current, data);


    //  
    // if (tableName === 'parts' && dataRef.current.length > 1) {
    //   dataRef.current = dataRef.current.filter((elem: any) => elem.partQty !== '');
    // } else if (tableName === 'tires' && dataRef.current.length > 1) {
    //   dataRef.current = dataRef.current.filter((elem: any) => elem.tireQty !== '');
    // }
    // console.log("-1---dataRef.current", tableName, dataRef.current);

    setActiveServiceNo(serviceNo);
    updateParentData(serviceNo, [...dataRef.current, newRow], tableName);
  };

  // console.log("----dataRef.current", serviceNo);


  const removeRow = (index: number) => {
    debugger
    setActiveServiceNo(serviceNo);
    updateParentData(serviceNo, data.filter((_, i) => i !== index), tableName);
    setData((prev) => prev.filter((_, i) => i !== index));
    dataRef.current = dataRef.current.filter((_, i) => i !== index);
  };

  useImperativeHandle(ref, () => {
    return ({
      addRowExternally: addRow,
      removeRowExternally: (index: number) => removeRow(index),
      handleDataChange: handleChange,
    })
  });

  useEffect(() => {
    if (onTableMount) onTableMount();
  }, []);

  return (
    <div className={`custom-table border rounded-lg ${className}`}>
      <table className='w-full border-collapse'>
        <thead>
          <tr className='bg-gray-100'>
            {columns.map((column, colIndex) => (
              <th className='p-2' key={colIndex}>{column.header}</th>
            ))}
            <th className='p-2'></th> {/* Extra column for the delete button */}
          </tr>
        </thead>
        <tbody>
          {(servicesTableData && servicesTableData[serviceNo-1] && servicesTableData[serviceNo-1][tableName] && servicesTableData[serviceNo-1][tableName].length && servicesTableData[serviceNo-1][tableName] || data).map((row, rowIndex) =>
          (
            <tr key={rowIndex} className='border-y'>
              {columns.map((column, colIndex) => (
                <td key={colIndex} className='p-2'>
                  {column.render(row[column.accessor], rowIndex, handleChange, serviceNo)}
                </td>
              ))}
              <td className=''>
                <button onClick={() => removeRow(rowIndex)}><VscClose className='mr-2 hover:fill-red-500' /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {addRowLabel ? <button onClick={addRow} className="add-row-btn p-2 py-3 text-indigo-600 hover:text-indigo-400">
        + {addRowLabel}
      </button> : null}
    </div>
  );
});

export default TableCommon;
