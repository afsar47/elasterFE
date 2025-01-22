import { HiX } from 'react-icons/hi'
import { Button } from '@/components/ui'

const AddNewVehicleDialog = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Add New Vehicle</h2>
                    <button onClick={onClose}>
                        <HiX className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                {/* Vehicle form */}
                <form>
                    <div className="mb-4">
                        <label htmlFor="vehicleName" className="block text-sm font-medium text-gray-700">Vehicle Name</label>
                        <input
                            id="vehicleName"
                            type="text"
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            placeholder="Enter vehicle name"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700">Vehicle Model</label>
                        <input
                            id="vehicleModel"
                            type="text"
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            placeholder="Enter vehicle model"
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="button"
                            variant="solid"
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={onClose} // Close the dialog
                        >
                            Add Vehicle
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddNewVehicleDialog
