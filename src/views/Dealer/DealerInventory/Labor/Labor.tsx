import React from 'react';
import AdaptableCard from '@/components/shared/AdaptableCard'; // Reusing this component
import LaborStatistics from './LaborStatistics';
import LaborTableTools from './LaborTableTool';
import LaborTable from './LaborTable';

const Labor = () => {
    return (
        <>
            <LaborStatistics />
            <AdaptableCard className="h-full" bodyClass="h-full">
                <LaborTableTools />
                <LaborTable />
            </AdaptableCard>
        </>
        
    );
};

export default Labor;
