import { DataTable, DoubleSidedImage } from '@/components/shared'
import { Card, Checkbox, Menu, Tag } from '@/components/ui'
import { apiSaveSignatureImage, getEstimateById } from '@/views/Dealer/Services/WorkflowService'
import TableCommon from '@/views/Dealer/Workflow/NewEstimate/TableCommon'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import Notification from '@/components/ui/Notification'

import Table from '@/components/ui/Table'
import SignaturePad from 'react-signature-pad-wrapper'
import { FaRegCheckCircle } from 'react-icons/fa'
import { IoIosCloseCircleOutline } from 'react-icons/io'
import { toast } from 'react-toastify'
import Toast from '@/components/ui/toast'

const { Tr, Th, Td, THead, TBody } = Table

const AuthorizeEmail = () => {
    const [estimate, setEstimate]: any = useState({})
    const [showPopup, setShowPopup] = useState(false)
    const [allSelectedServices, setallSelectedServices]: any = useState([])
    const [showSignaturePopup, setShowSignaturePopup] = useState(false)
    const signaturePadRef = useRef<SignaturePad>(null)

    const fetchEstimate = async () => {
        try {
            const urlPath = window.location.pathname // Get the full path
            const orderId = urlPath.split('/').pop() // Extract the ID from the path

            if (!orderId) throw new Error('Order ID not found in the URL.')

            const response = await getEstimateById(orderId)
            // console.log('getEstimateById:', response)

            if (response.status === 'success') {
                setEstimate(response.estimate) // Update the state with API data
                setServices(response.estimate)
            } else {
                throw new Error('Failed to fetch estimate.')
            }
        } catch (error) {
            console.error('Failed to fetch estimate:', error)
            toast.error('Unable to fetch estimate data.')
        }
    }

    const setServices = (estimate: any) => {
        if (estimate.services.length > 0) {
            let services: any = []
            estimate.services.map((service: any) => {
                services.push({
                    serviceTitle: service.serviceTitle,
                    serviceId: service._id,
                    isAuthorized: true,
                })
            })
            setallSelectedServices(services)
        }
    }

    useEffect(() => {
        fetchEstimate()
    }, [])


    const onCheck = (value: boolean, idx: number) => {
        let updatedServices = [...allSelectedServices]
        updatedServices[idx] = {
            ...updatedServices[idx], // Copy existing properties
            serviceTitle: updatedServices[idx].serviceTitle, // Retain the existing title
            isAuthorized: value, // Update the `isAuthorized` value
        }

        setallSelectedServices(updatedServices)
    }

    const Step1 = () => {
        return (
            <div className="text-center">
                <DoubleSidedImage
                    className="mx-auto mb-8"
                    src="/img/others/welcome.png"
                    darkModeSrc="/img/others/welcome-dark.png"
                    alt="Welcome"
                />
                <h3 className="mb-2">
                    <ul>
                        You have aleady authorized below service
                    </ul>
                </h3>
                <p className="text-base">
                </p>
            </div>
        )
    }

    return (
        <>
            {estimate && estimate.status === 'In Progress' || estimate.status === 'Invoices' ? <Step1 /> : (
                <div className="min-h-screen bg-gray-100 p-2 sm:p-4 pb-24">
                    {/* Header */}
                    <div className="flex justify-between items-center bg-white shadow p-3 sm:p-4 mb-4 rounded-lg">
                        <div>
                            <h2 className="text-base sm:text-lg font-semibold">247 Automotive</h2>
                            <p className="text-xs sm:text-sm text-gray-600">Order #{estimate.orderNo}</p>
                        </div>
                        <button className="text-blue-500 hover:underline">✕</button>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Main Content Section */}
                        <div className="bg-white shadow rounded-lg p-3 sm:p-4 w-full lg:w-3/4 mb-4 lg:mb-0">
                            {/* Services Header */}
                            <div className="flex flex-col sm:flex-row justify-between mb-4 sm:mb-6 gap-2">
                                <h3 className="text-base sm:text-lg font-medium">Select Services to Authorize</h3>
                                <Tag className="text-white bg-indigo-600 border-0 self-start sm:self-auto">
                                    {estimate.status}
                                </Tag>
                            </div>

                            {/* Scrollable Content with Max Height */}
                            <div
                                className="border-t border-gray-300 pt-4 overflow-y-auto"
                                style={{
                                    maxHeight: 'calc(100vh - 350px)',
                                    overflowX: 'hidden'
                                }}
                            >
                                {/* List of Services */}
                                <div className="space-y-4">
                                    <h3 className='text-sm sm:text-base mb-4'>{estimate.orderName}</h3>
                                    <div className="flex flex-col">
                                        {estimate && estimate.services &&
                                            estimate.services.length > 0 &&
                                            estimate.services.map(
                                                (service: any, idx: number) => (
                                                    <Card
                                                        key={idx}
                                                        className="mb-4 w-full"
                                                    >
                                                        <Menu>
                                                            <Menu.MenuCollapseArrowStart
                                                                className="justify-start"
                                                                expanded={true}
                                                                labelClass="justify-between w-full flex-wrap sm:flex-nowrap gap-2"
                                                                label={
                                                                    <>
                                                                        <span className="text-sm sm:text-base">{service.serviceTitle}</span>
                                                                        <div className="flex items-center gap-2 ml-auto">
                                                                            <span className="text-gray-700 text-sm sm:text-base">
                                                                                ${service.serviceGrandTotal?.toFixed(2)}
                                                                            </span>
                                                                            <Checkbox
                                                                                defaultChecked
                                                                                onChange={(e) => onCheck(e, idx)}
                                                                            />
                                                                        </div>
                                                                    </>
                                                                }
                                                            >
                                                                {/* Existing Labors Details Table */}
                                                                {service.labors.length > 0 && (
                                                                    <div className="mt-4 overflow-x-auto">
                                                                        <h3 className="text-base sm:text-lg font-semibold mb-2">Labor Details</h3>
                                                                        <Table className="min-w-full text-xs sm:text-sm">
                                                                            <THead>
                                                                                <Tr>
                                                                                    <Th className="text-left text-xs sm:text-sm">Labor</Th>
                                                                                    <Th className="text-left text-xs sm:text-sm">Technician</Th>
                                                                                    <Th className="text-left text-xs sm:text-sm">Hours</Th>
                                                                                    <Th className="text-left text-xs sm:text-sm">Rate/hr</Th>
                                                                                    <Th className="text-left text-xs sm:text-sm">Discount</Th>
                                                                                    <Th className="text-left text-xs sm:text-sm">Subtotal</Th>
                                                                                </Tr>
                                                                            </THead>
                                                                            <TBody>
                                                                                {service.labors.map((labor: any, idx: number) => (
                                                                                    <Tr key={idx}>
                                                                                        <Td>{labor.laborName || '-'}</Td>
                                                                                        <Td>{labor.technician || '-'}</Td>
                                                                                        <Td>{labor.hours || 0}</Td>
                                                                                        <Td>{labor.rate || '$0.00'}</Td>
                                                                                        <Td>
                                                                                            {labor.discount?.value > 0
                                                                                                ? `${labor.discount.type || ''} ${labor.discount.value}`
                                                                                                : 'N/A'}
                                                                                        </Td>
                                                                                        <Td>{labor.subtotal || '$0.00'}</Td>
                                                                                    </Tr>
                                                                                ))}
                                                                            </TBody>
                                                                        </Table>
                                                                        <hr className="my-4 border-gray-200" />
                                                                    </div>
                                                                )}

                                                                {/* Existing Parts Details Table */}
                                                                {service.parts.length > 0 && (
                                                                    <div className="mt-6 overflow-x-auto">
                                                                        <h3 className="text-base sm:text-lg font-semibold mb-2">Parts Details</h3>
                                                                        <Table className="min-w-full text-xs sm:text-sm">
                                                                            <THead>
                                                                                <Tr>
                                                                                    <Th className="text-left">Part</Th>
                                                                                    <Th className="text-left">Part#</Th>
                                                                                    <Th className="text-left">Bin</Th>
                                                                                    <Th className="text-left">Technician</Th>
                                                                                    <Th className="text-left">Qty</Th>
                                                                                    <Th className="text-left">Cost</Th>
                                                                                    <Th className="text-left">Price</Th>
                                                                                    <Th className="text-left">Discount</Th>
                                                                                    <Th className="text-left">Subtotal</Th>
                                                                                </Tr>
                                                                            </THead>
                                                                            <TBody>
                                                                                {service.parts.map((part: any, idx: number) => (
                                                                                    <Tr key={idx}>
                                                                                        <Td>{part.part || '-'}</Td>
                                                                                        <Td>{part.partHash || '-'}</Td>
                                                                                        <Td>{part.bin || '-'}</Td>
                                                                                        <Td>{part.technician || '-'}</Td>
                                                                                        <Td>{part.partQty || 0}</Td>
                                                                                        <Td>{part.partCost || '$0.00'}</Td>
                                                                                        <Td>{part.partPrice || '$0.00'}</Td>
                                                                                        <Td>
                                                                                            {part.discount?.value > 0
                                                                                                ? `${part.discount.type || ''} ${part.discount.value}`
                                                                                                : 'N/A'}
                                                                                        </Td>
                                                                                        <Td>{part.partSubtotal || '$0.00'}</Td>
                                                                                    </Tr>
                                                                                ))}
                                                                            </TBody>
                                                                        </Table>
                                                                        <hr className="my-4 border-gray-200" />
                                                                    </div>
                                                                )}

                                                                {/* Existing Tires Details Table */}
                                                                {service.tires && service.tires.length > 0 && (
                                                                    <div className="mt-6 overflow-x-auto">
                                                                        <h3 className="text-base sm:text-lg font-semibold mb-2">Tire Details</h3>
                                                                        <Table className="min-w-full text-xs sm:text-sm">
                                                                            <THead>
                                                                                <Tr>
                                                                                    <Th className="text-left">Tire</Th>
                                                                                    <Th className="text-left">Tire#</Th>
                                                                                    <Th className="text-left">Qty</Th>
                                                                                    <Th className="text-left">Cost</Th>
                                                                                    <Th className="text-left">Price</Th>
                                                                                    <Th className="text-left">Discount</Th>
                                                                                    <Th className="text-left">Subtotal</Th>
                                                                                </Tr>
                                                                            </THead>
                                                                            <TBody>
                                                                                {service.tires.map((tyre: any, idx: number) => {
                                                                                   console.log(tyre);
                                                                                   return <Tr key={idx}>
                                                                                        <Td>{tyre.tire || '-'}</Td>
                                                                                        <Td>{tyre.tireHash || '-'}</Td>
                                                                                        <Td>{tyre.tiresQty || 0}</Td>
                                                                                        <Td>{tyre.tireCost || '$0.00'}</Td>
                                                                                        <Td>{tyre.tirePrice || '$0.00'}</Td>
                                                                                        <Td>
                                                                                            {tyre.discount?.value > 0
                                                                                                ? `${tyre.discount.type || ''} ${tyre.discount.value}`
                                                                                                : 'N/A'}
                                                                                        </Td>
                                                                                        <Td>{tyre.tireSubtotal || '$0.00'}</Td>
                                                                                    </Tr>
                                                                                })}
                                                                            </TBody>
                                                                        </Table>
                                                                        <hr className="my-4 border-gray-200" />
                                                                    </div>
                                                                )}

                                                                {/* Existing Subcontract Details Table */}
                                                                {service.subcontract.length > 0 && (
                                                                    <div className="mt-6 overflow-x-auto">
                                                                        <h3 className="text-base sm:text-lg font-semibold mb-2">Subcontract Details</h3>
                                                                        <Table className="min-w-full text-xs sm:text-sm">
                                                                            <THead>
                                                                                <Tr>
                                                                                    <Th className="text-left">Subcontract</Th>
                                                                                    <Th className="text-left">Vendor</Th>
                                                                                    <Th className="text-left">Cost</Th>
                                                                                    <Th className="text-left">Price</Th>
                                                                                    <Th className="text-left">Discount</Th>
                                                                                    <Th className="text-left">Subtotal</Th>
                                                                                </Tr>
                                                                            </THead>
                                                                            <TBody>
                                                                                {service.subcontract.map((subcontract: any, idx: number) => (
                                                                                    <Tr key={idx}>
                                                                                        <Td>{subcontract.subcontractName || '-'}</Td>
                                                                                        <Td>{subcontract.vendor || '-'}</Td>
                                                                                        <Td>{subcontract.cost || '$0.00'}</Td>
                                                                                        <Td>{subcontract.price || '$0.00'}</Td>
                                                                                        <Td>
                                                                                            {subcontract.discount?.value > 0
                                                                                                ? `${subcontract.discount.type || ''} ${subcontract.discount.value}`
                                                                                                : 'N/A'}
                                                                                        </Td>
                                                                                        <Td>{subcontract.subTotal || '$0.00'}</Td>
                                                                                    </Tr>
                                                                                ))}
                                                                            </TBody>
                                                                        </Table>
                                                                    </div>
                                                                )}

                                                                {/* New Overall Discount Details Table */}
                                                                {service.discount.length > 0 && (
                                                                    <div className="mt-6">
                                                                        <h3 className="text-lg font-semibold mb-2">Service Discount Details</h3>
                                                                        <Table>
                                                                            <THead>
                                                                                <Tr>
                                                                                    <Th>Service Discount</Th>
                                                                                    <Th>Discount</Th>
                                                                                </Tr>
                                                                            </THead>
                                                                            <TBody>
                                                                                {service.discount.map((discount: any, idx: number) => (
                                                                                    <Tr key={idx}>
                                                                                        <Td>{discount.type || '-'}</Td>
                                                                                        <Td>{discount.value || '$0.00'}</Td>
                                                                                    </Tr>
                                                                                ))}
                                                                            </TBody>
                                                                        </Table>
                                                                    </div>
                                                                )}

                                                                {/* New Service Fee Details Table */}
                                                                {service.serviceFee.length > 0 && (
                                                                    <div className="mt-6">
                                                                        <h3 className="text-lg font-semibold mb-2">Service Fee Details</h3>
                                                                        <Table>
                                                                            <THead>
                                                                                <Tr>
                                                                                    <Th>Service Fee</Th>
                                                                                    <Th>Subtotal</Th>
                                                                                </Tr>
                                                                            </THead>
                                                                            <TBody>
                                                                                {service.serviceFee.map((fee: any, idx: number) => (
                                                                                    <Tr key={idx}>
                                                                                        <Td>{fee.fee || '-'}</Td>
                                                                                        <Td>{fee.feeSubtotal || '$0.00'}</Td>
                                                                                    </Tr>
                                                                                ))}
                                                                            </TBody>
                                                                        </Table>
                                                                        <hr className="my-4 border-gray-200" />
                                                                    </div>
                                                                )}


                                                            </Menu.MenuCollapseArrowStart>
                                                        </Menu>
                                                    </Card>
                                                ),
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Right Section - Customer Details */}
                        <div className="bg-white shadow rounded-lg p-3 sm:p-4 w-full lg:w-1/4 mb-4 lg:mb-0">
                            <h3 className="text-base sm:text-lg font-medium mb-4">Authorizations</h3>
                            <div className="text-xs sm:text-sm space-y-2">
                                {estimate ? (
                                    <>
                                        <p>
                                            <span className="font-medium">Customer:</span>{' '}
                                            {estimate.customer?.firstName || 'N/A'}
                                        </p>
                                        <p>
                                            <span className="font-medium">Phone:</span>{' '}
                                            {estimate.customer?.phoneNumber[0].number || 'N/A'}
                                        </p>
                                        <p>
                                            <span className="font-medium">Email:</span>{' '}
                                            {estimate.customer?.email ? (
                                                <a
                                                    href={`mailto:${estimate.customer.email}`}
                                                    className="text-blue-500 underline"
                                                >
                                                    {estimate.customer.email}
                                                </a>
                                            ) : (
                                                'N/A'
                                            )}
                                        </p>
                                        <p>
                                            <span className="font-medium">Vehicle:</span>{' '}
                                            {`${estimate?.vehicle?.year} ${estimate?.vehicle?.make} ${estimate?.vehicle?.model}` || 'N/A'}
                                        </p>
                                        <p>
                                            <span className="font-medium">VIN:</span>{' '}
                                            {estimate.vehicle?.vin || 'N/A'}
                                        </p>
                                    </>
                                ) : (
                                    <p>Loading customer information...</p>
                                )}
                            </div>
                        </div>
                    </div>


                    {/* Fixed Footer */}
                    <div
                        className="border-t border-gray-300 bg-white rounded-lg shadow fixed bottom-0 w-[96%] md:w-[73%] p-3 flex flex-col space-y-2 mx-auto"
                        style={{ maxHeight: "150px", overflowY: "auto" }} // Ensure footer height is limited and scrollable if needed
                    >
                        {/* Subtotal */}
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-xs md:text-sm font-medium">
                                Subtotal:
                            </span>
                            <span className="text-gray-900 text-xs md:text-sm font-medium">
                                ${estimate?.subTotal ? estimate?.subTotal : 0}
                            </span>
                        </div>

                        {/* Taxes */}
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-xs md:text-sm font-medium">
                                Taxes:
                            </span>
                            <span className="text-gray-900 text-xs md:text-sm font-medium">
                                ${estimate?.taxes ? estimate?.taxes : 0}
                            </span>
                        </div>

                        {/* Grand Total */}
                        <div className="flex justify-between items-center">
                            <span className="text-gray-900 text-sm md:text-base font-bold">
                                Grand Total:
                            </span>
                            <span className="text-gray-900 text-sm md:text-base font-bold">
                                ${Number(estimate?.grandTotal) ? Number(estimate?.grandTotal) : 0}
                            </span>
                        </div>

                        {/* Authorize Button */}
                        <button
                            className="bg-blue-700 text-white text-xs md:text-sm font-medium py-1.5 md:py-2 rounded-lg w-full mt-2"
                            onClick={() => setShowPopup(true)} // Open the popup
                        >
                            Authorize Service
                        </button>
                    </div>



                    {/* show pop up */}
                    {showPopup && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                            <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[30%] max-w-lg mx-auto">
                                {/* Heading */}
                                <div className="flex justify-between items-center border-b p-4 sm:p-6">
                                    <h3 className="text-base sm:text-xl font-semibold">
                                        Authorize Estimates
                                    </h3>
                                    <button
                                        className="text-gray-500 hover:text-gray-700"
                                        onClick={() => setShowPopup(!showPopup)}
                                    >
                                        ✕
                                    </button>
                                </div>
                                {/* Total Amount Section */}
                                <div className="bg-slate-50 p-3 sm:p-4 rounded-md text-base sm:text-lg font-bold text-center m-4 sm:m-6">
                                    Total Amount: ${estimate?.grandTotal}
                                </div>
                                <div className="flex flex-col gap-3 w-full px-4 sm:px-6">
                                    {allSelectedServices.map((service: any) => {
                                        console.log("All Services:", service)
                                        return (
                                            service.serviceTitle && (
                                                <span
                                                    key={service.serviceId}
                                                    className="flex items-center justify-between w-full">
                                                    {service.isAuthorized === true ? (
                                                        <div className="flex items-center text-sm sm:text-base">
                                                            <FaRegCheckCircle className="text-indigo-700 mr-2 flex-shrink-0" />{' '}
                                                            <span className="truncate">
                                                                {service.serviceTitle}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center text-sm sm:text-base">
                                                            <IoIosCloseCircleOutline className="text-indigo-700 mr-2 flex-shrink-0" />{' '}
                                                            <span className="truncate">
                                                                {service.serviceTitle}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <span className="ml-2 flex-shrink-0">
                                                        {service.serviceGrandTotal
                                                            ? `$${service.serviceGrandTotal}`
                                                            : ''}
                                                    </span>
                                                </span>
                                            )
                                        )
                                    })}
                                </div>

                                {/* Authorize Button */}
                                <div className="p-4 sm:p-6 mt-4">
                                    <button
                                        className="bg-blue-700 text-white py-2 px-4 rounded-lg text-sm sm:text-lg font-medium w-full"
                                        onClick={() => {
                                            setShowSignaturePopup(true) // Open signature popup
                                        }}
                                    >
                                        Authorize ${estimate?.grandTotal}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Signature Popup */}
                    {showSignaturePopup && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[40%] flex flex-col space-y-4">
                                {/* Signature Heading */}
                                <h3 className="text-lg font-bold text-center">
                                    Add Signature
                                </h3>

                                {/* Signature Pad */}
                                <div className="border border-gray-300 rounded-md bg-slate-50 p-4">
                                    {/* Using a package like react-signature-canvas for the signature */}
                                    <SignaturePad
                                        options={{
                                            minWidth: 1,
                                            maxWidth: 3,
                                            penColor: 'black',
                                            backgroundColor:
                                                'rgba(255, 255, 255, 0)',
                                        }}
                                        canvasProps={{
                                            className:
                                                'signature-canvas w-full h-40',
                                        }}
                                        ref={signaturePadRef}
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end space-x-4">
                                    <button
                                        className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg"
                                        onClick={() =>
                                            setShowSignaturePopup(false)
                                        } // Close signature popup
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg"
                                        onClick={() => {
                                            // Clear the signature pad
                                            signaturePadRef.current?.clear()
                                        }}
                                    >
                                        Reset
                                    </button>
                                    <button
                                        className="bg-blue-700 text-white py-2 px-4 rounded-lg"
                                        onClick={async () => {
                                            // Check if the signature pad is empty
                                            if (signaturePadRef.current?.isEmpty()) {
                                                Toast.push(
                                                    <Notification title="Error" type="warning">
                                                        No signature data found. Please sign before saving.
                                                    </Notification>
                                                );
                                                return; // Exit if the pad is empty
                                            }

                                            // Get the signature data from the signature pad
                                            const signatureData = signaturePadRef.current?.toDataURL();

                                            try {
                                                const urlPath = window.location.pathname // Get the full path
                                                const orderId = urlPath.split('/').pop()
                                                // Call the API to save the signature image
                                                const response = await apiSaveSignatureImage({
                                                    estimateId: orderId,
                                                    allSelectedServices: allSelectedServices,
                                                    signature: signatureData,
                                                });

                                                setTimeout(() => {
                                                    Toast.push(
                                                        <Notification title="Success" type="success">
                                                            Signature Image saved successfully!
                                                        </Notification>
                                                    );
                                                }, 400); // Delay of 1 second
                                            } catch (error: any) {
                                                // Handle any errors during the API call
                                                Toast.push(
                                                    <Notification title="Error" type="warning">
                                                        {error.message || 'Failed to save signature'}
                                                    </Notification>
                                                );
                                            }

                                            // Close the popup after handling
                                            setShowPopup(false);
                                            setShowSignaturePopup(false);
                                        }}
                                    >
                                        Save
                                    </button>


                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default AuthorizeEmail
