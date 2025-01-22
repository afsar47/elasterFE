import React from 'react';
import FleetsStatistic from './FleetsStatistics';
import FleetsTable from './FleetsTable';
import AdaptableCard from '@/components/shared/AdaptableCard'; // Reusing this component
import FleetsTableTools from './FleetsTableTool';

const Fleets = () => {
    return (
        <>
            <FleetsStatistic />
            <AdaptableCard className="h-full" bodyClass="h-full">
                <FleetsTableTools />
                <FleetsTable />
            </AdaptableCard>
        </>
        
    );
};

export default Fleets;
