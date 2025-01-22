import { SetStateAction, useEffect, useState } from 'react'
import { RootState } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import WorkflowTable from './WorkflowTable'
import WorkflowTableTools from './WorkflowTableTools'
import Segment from '@/components/ui/Segment'
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from 'react-beautiful-dnd'
import {
    HiOutlineChatAlt2,
    HiOutlineCalendar,
    HiOutlineClipboardCheck,
    HiOutlineLockClosed,
    HiOutlinePlus,
    HiOutlineDotsHorizontal,
} from 'react-icons/hi'
import { useAppSelector, useAppDispatch, getEstimatesByPage } from './store'
import PartsTable from '../DealerInventory/parts/PartsTable'
import TiresTable from '../DealerInventory/Tires/TireTable'

interface Estimate {
    id: any
    orderName: string
    inspectionStatus: string
    customer: string
    workflow: string
}

interface EstimateCardProps {
    orderTitle: string
    vehicleInfo: string
    customerName: string
    onMenuAction: (action: string) => void
}

const ProductList = () => {

    
    const [selectedValue, setSelectedValue] = useState<string | null>(null)

    const handleSegmentChange = (value: string) => {
        setSelectedValue(value)
    }

    const [estimatesByWorkflow, setestimatesByWorkflow]: any = useState([])

    const [activeHeading, setActiveHeading] = useState('parts')

    const handleHeadingChange = (heading: SetStateAction<string>) => {
        setActiveHeading(heading)
    }

    // const dispatch = useAppDispatch()

    // useEffect(() => {
    //     dispatch(getEstimatesByPage({}))
    // }, [])

    // Grouping estimates by workflow status
    // const groupedEstimates: Record<string, Estimate[]> = {
    //     estimates: [],
    //     droppedOff: [],
    //     inProgress: [],
    //     invoices: [],
    // }
    const estimates: any = useAppSelector(
        (state: RootState) => state.workflow.estimateList,
    )

    useEffect(() => {
        if (estimates && estimates.length > 0) {
            const grouped = estimates.reduce((acc: Record<string, any[]>, estimate: any) => {
                if (!estimate.workflow) {
                    console.warn('Estimate is missing workflow:', estimate);
                    return acc; // Skip invalid entries
                }
                if (!acc[estimate.workflow]) {
                    acc[estimate.workflow] = [];
                }
                acc[estimate.workflow].push(estimate);
                return acc;
            }, {});
            setestimatesByWorkflow(grouped);
        }  else {
            setestimatesByWorkflow({}); // Clear old data
        }
    }, [estimates]);
    

    // estimates.forEach((estimate:any) => {
    //     switch (estimate.workflow) {
    //         case 'Estimates':
    //             groupedEstimates.estimates.push(estimate)
    //             break
    //         case 'Dropped Off':
    //             groupedEstimates.droppedOff.push(estimate)
    //             break
    //         case 'In Progress':
    //             groupedEstimates.inProgress.push(estimate)
    //             break
    //         case 'Invoices':
    //             groupedEstimates.invoices.push(estimate)
    //             break
    //         default:
    //             break
    //     }
    // })

    const EstimateCard: React.FC<EstimateCardProps> = ({
        orderTitle,
        vehicleInfo,
        customerName,
        onMenuAction,
    }) => {
        const [menuOpen, setMenuOpen] = useState(false)

        const toggleMenu = () => {
            setMenuOpen(!menuOpen)
        }

        const handleMenuClick = (action: string) => {
            onMenuAction(action)
            setMenuOpen(false)
        }

        return (
            <div className="bg-white shadow-lg rounded-lg p-3 mb-4 w-full">
                <div className="absolute right-2 top-2">
                    <button onClick={toggleMenu} className="text-gray-600">
                        <HiOutlineDotsHorizontal className="w-5 h-5" />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-lg rounded-lg">
                            <button
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={() => handleMenuClick('Duplicate')}
                            >
                                Duplicate
                            </button>
                            <button
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={() => handleMenuClick('Archive')}
                            >
                                Archive
                            </button>
                            <button
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={() => handleMenuClick('Delete')}
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
                <h5 className="text-base font-medium mb-2">{orderTitle}</h5>
                <button className="flex items-center text-blue-500 px-3 py-1 mb-4">
                    <HiOutlinePlus className="w-5 h-5 mr-2" /> Add Tags
                </button>
                <p className="text-gray-700 mb-2">{vehicleInfo}</p>
                <p className="text-gray-700 mb-4">Customer: {customerName}</p>
                <div className="border-t border-gray-300 my-4"></div>
                <div className="flex items-center justify-between">
                    <div className="flex space-x-4">
                        <HiOutlineChatAlt2
                            className="text-gray-600 w-5 h-5 cursor-pointer"
                            title="Message"
                        />
                        <HiOutlineCalendar
                            className="text-gray-600 w-5 h-5 cursor-pointer"
                            title="Appointment"
                        />
                        <HiOutlineClipboardCheck
                            className="text-gray-600 w-5 h-5 cursor-pointer"
                            title="Inspection"
                        />
                    </div>
                    <HiOutlineLockClosed
                        className="text-gray-600 w-5 h-5 cursor-pointer"
                        title="Authorization"
                    />
                </div>
            </div>
        )
    }
    
    
    const handleMenuAction = (action: string) => {}

    const onDragEnd = (result: DropResult) => {
         
        
        const { source, destination, type } = result;
    
        console.log('Source:', source);
        console.log('Destination:', destination);
        if (!destination) return;
    
        if (type === 'ITEM') {
            const sourceList = estimatesByWorkflow[source.droppableId];
            const destinationList = estimatesByWorkflow[destination.droppableId];
    
            console.log('Moving from:', sourceList);
            console.log('Moving to:', destinationList);
    
            const [movedItem] = sourceList.splice(source.index, 1);
            destinationList.splice(destination.index, 0, movedItem);
        }
    };
    

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Workflow</h3>
                <WorkflowTableTools />
            </div>
            <Segment className="mb-4">
                <Segment.Item
                    value="columns"
                    onClick={() => handleSegmentChange('columns')}
                >
                    Columns
                </Segment.Item>
                <Segment.Item
                    value="lists-and-parts"
                    onClick={() => handleSegmentChange('lists-and-parts')}
                >
                    Lists
                </Segment.Item>
                <Segment.Item
                    value="time"
                    onClick={() => handleSegmentChange('time')}
                >
                    Parts & Tires
                </Segment.Item>
            </Segment>
            {selectedValue === 'columns' ? (
                <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
                    <div className="grid grid-cols-4 gap-4 h-[calc(100vh-170px)] overflow-hidden">
                        {Object.keys(estimatesByWorkflow).map((group, index) => {
                            return (
                            <Droppable 
                            key={index} 
                            droppableId='1234'
                            type="ITEM" 
                            >
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="border p-4 bg-gray-100 h-full overflow-auto flex flex-col"
                                    >
                                        <h4 className="text-lg font-semibold mb-4">
                                            {group}
                                        </h4>
                                        {estimatesByWorkflow[group].map(
                                            (estimate: any, index: number) => {  
                                                 
                                                if (!estimate || !estimate.id || !estimate.workflow) {
                                                    console.warn('Invalid Estimate:', estimate);
                                                    return null; // Skip invalid entries
                                                }
                                            
                                                const uniqueId = `${estimate.id}-${estimate.workflow}-${index}`;
                                                console.log('Draggable ID:', uniqueId);
                                                return(
                                                <Draggable
                                                    key={index}
                                                    draggableId='1234'
                                                    index={index}
                                                    
                                                >
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <EstimateCard
                                                                orderTitle={
                                                                    estimate.orderName
                                                                }
                                                                vehicleInfo={
                                                                    estimate.inspectionStatus
                                                                }
                                                                customerName={
                                                                    estimate.customer
                                                                }
                                                                onMenuAction={
                                                                    handleMenuAction
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )},
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        )})}
                    </div>
                </DragDropContext>
            ) : selectedValue === 'time' ? (
                <div className="h-[calc(100vh-170px)]">
                    <div className="flex space-x-2 mb-2">
                        <button
                            onClick={() => handleHeadingChange('parts')}
                            className={`px-4 py-2 rounded ${
                                activeHeading === 'parts'
                                    ? 'text-blue-500'
                                    : 'text-black'
                            }`}
                        >
                            Parts on Orders
                        </button>
                        <button
                            onClick={() => handleHeadingChange('tires')}
                            className={`px-4 py-2 rounded ${
                                activeHeading === 'tires'
                                    ? 'text-blue-500'
                                    : 'text-black'
                            }`}
                        >
                            Tires on Orders
                        </button>
                        <button
                            onClick={() => handleHeadingChange('returns')}
                            className={`px-4 py-2 rounded ${
                                activeHeading === 'returns'
                                    ? 'text-blue-500'
                                    : 'text-black'
                            }`}
                        >
                            Part Returns
                        </button>
                    </div>
                    {activeHeading === 'parts' ? (
                        <PartsTable />
                    ) : activeHeading === 'tires' ? (
                        <TiresTable />
                    ) : (
                        <div className="mt-4">
                            {/* Add part return table */}
                        </div>
                    )}
                </div>
            ) : (
                <WorkflowTable />
            )}
        </AdaptableCard>
    )
}

export default ProductList
