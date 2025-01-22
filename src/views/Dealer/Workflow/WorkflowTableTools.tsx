import Button from '@/components/ui/Button'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import { Link, useNavigate } from 'react-router-dom'
import WorkflowTableSearch from './WorkflowTableSearch'
import WorkflowFilter from './WorkflowFilter'
import { useState } from 'react'
import { apiAddNewEstimate } from '../Services/WorkflowService'

const WorkflowTableTools = () => {
    const [loading, setLoading] = useState(false)
    const [estimateId, setEstimateId] = useState('');
    const navigate = useNavigate();

    const onClick = async () => {
        setLoading(true)
        try {
            // Await the response from the API call
            const response = await apiAddNewEstimate({});
            setEstimateId(`${response.estimateId}-${response.estimateOrderNo}`); // Set the estimateId for reference if needed

            // Redirect the user to the new estimate page after successful creation
            navigate(`/dealer/workflow/order/${response.estimateId}-${response.estimateOrderNo}`);
        } catch (error: any) {
            console.error("Error creating new estimate:", error.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex flex-col lg:flex-row lg:items-center">
            <WorkflowTableSearch />
            <WorkflowFilter />
            <Link
                download
                className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
                to="/data/product-list.csv"
                target="_blank"
            >
                <Button block size="sm" icon={<HiDownload />}>
                    Export
                </Button>
            </Link>

            <Button
                onClick={onClick}
                className="mr-2 block lg:inline-block md:mb-0 mb-4"
                variant="solid"
                loading={loading}
                size="sm"
                icon={<HiPlusCircle />}
            >
                New Estimate
            </Button>
        </div>
    )
}

export default WorkflowTableTools
