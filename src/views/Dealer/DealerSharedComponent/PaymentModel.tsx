import { Button, Card, Input } from '@/components/ui';
import React, { useEffect, useState } from 'react';
import { TbCash } from 'react-icons/tb';
import { apiRecordPayment } from '../Services/WorkflowService';

const PaymentModel = ({ handleClosePaymentModel, estimateData }: any) => {
    const [paymentDetails, setpaymentDetails]: any = useState({})

    useEffect(() => {
        const formattedDate = new Date().toISOString().slice(0, 10); // Extract 'YYYY-MM-DD'

        setpaymentDetails({
            estimateId: estimateData._id,
            amount: estimateData.grandTotal,
            date: formattedDate, // Use the formatted date here
            note: '',
        });
    }, [estimateData])

    const handleAddNote = (event: any) => {
        const updatedDetails = { ...paymentDetails, note: event.target.value }
        setpaymentDetails(updatedDetails)
    }

    const recordPayment = async() => {
        try {
            const response = await apiRecordPayment(paymentDetails);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-[650px] h-[450px] rounded-lg shadow-lg relative border border-gray-200">
                <div className="flex justify-between items-center p-3 border-b">
                    <h3 className="text-base font-semibold">Recieve Cash</h3>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => handleClosePaymentModel(false)}
                    >
                        ✕
                    </button>
                </div>
                <div className="overflow-hidden p-4 flex h-5/6">
                    <div className='w-7/12 mr-2'>
                        <Card>
                            <h5>${paymentDetails.amount && paymentDetails.amount.toFixed(2)}</h5>
                        </Card>
                        <br />
                        <div>
                            <label htmlFor="" className='font-black'>Date</label>
                            <Input value={paymentDetails.date} placeholder="Disabled Input" disabled />
                        </div>
                        <br />
                        <label htmlFor="" className='font-black'>Note</label>
                        <div>
                            <Input onChange={handleAddNote} value={paymentDetails.note || ''} placeholder="eg. Payment for entire order" />
                        </div>
                        <br />
                        <Button variant="solid" className='w-full' onClick={recordPayment}>
                            Record ${paymentDetails.amount && paymentDetails.amount.toFixed(2)}
                        </Button>
                    </div>
                    <div className="h-full border-l mr-2"></div>
                    <div className='w-6/12'>
                        <h5>Invoice #{estimateData.orderNo}</h5>
                        <div className='flex items-center justify-between mb-1 mt-4'>
                            <p>Not yet Authorized</p>
                            <p>$0.00</p>
                        </div>
                        <div className='flex items-center justify-between mb-2'>
                            <p>Authorized</p>
                            <p>$423.00</p>
                        </div>
                        <div className="w-full border-t"></div>
                        <div className='flex items-center justify-between mt-3 mb-2'>
                            <p className='font-extrabold'>Total Due</p>
                            <p className='font-extrabold'>$423.00</p>
                        </div>
                        <div className='flex items-center justify-between mb-2'>
                            <p>Paid To Date</p>
                            <p>$0.00</p>
                        </div>
                        <div className='flex items-center justify-between mb-2'>
                            <p>Amount</p>
                            <p>$423.00</p>
                        </div>
                        <div className="w-full border-t"></div>
                        <div className='flex text-emerald-400 font-extrabold items-center justify-between mt-3 mb-2'>
                            <p>Remaining</p>
                            <p>$423.00</p>
                        </div>

                        <div className='flex items-center justify-between mt-5 mb-2'>
                            <p className='font-semibold'>PAYMENTS</p>
                        </div>
                        <div className='flex items-center justify-between mb-2'>
                            <p>No transactios yet</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentModel