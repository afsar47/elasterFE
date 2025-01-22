import AdaptableCard from '@/components/shared/AdaptableCard'
import DealersTable from './DealersTable'
import DealersTableTools from './DealerTableTools'


const Dealers = () => {
    return (
        <>
            <AdaptableCard className="h-full" bodyClass="h-full">
                <DealersTableTools />
                <DealersTable />
            </AdaptableCard>
        </>
    )
}

export default Dealers
