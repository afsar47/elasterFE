import React from 'react';
import PartsStatistic from './PartsStatistics';
import PartsTableTools from './PartsTableTools';
import PartsTable from './PartsTable';
import AdaptableCard from '@/components/shared/AdaptableCard'; // Reusing this component

const Parts = () => {
    return (
        <>
            <PartsStatistic />
            <AdaptableCard className="h-full" bodyClass="h-full">
                <PartsTableTools />
                <PartsTable />
            </AdaptableCard>
        </>
        
    );
};

export default Parts;
