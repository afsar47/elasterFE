import React from 'react';
import AdaptableCard from '@/components/shared/AdaptableCard'; // Reusing this component
import VendorsStatistics from './VendorsStatistics';
import VendorsTableTools from './VendorsTableTools';
import VendorsTable from './VendorsTable';

const Vendors = () => {
    return (
        <>
            <VendorsStatistics />
            <AdaptableCard className="h-full" bodyClass="h-full">
                <VendorsTableTools />
                <VendorsTable />
            </AdaptableCard>
        </>
        
    );
};

export default Vendors;
