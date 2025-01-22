import AdaptableCard from '@/components/shared/AdaptableCard'; // Reusing this component
import TiresStatistics from './FeesStatistics';
import FeesTableTools from './FeesTableTools';
import TiresTable from './FeesTable';


const Fees = () => {
    return (
        <>
            <TiresStatistics />
            <AdaptableCard className="h-full" bodyClass="h-full">
                <FeesTableTools />
                <TiresTable />
            </AdaptableCard>
        </>
        
    );
};

export default Fees;