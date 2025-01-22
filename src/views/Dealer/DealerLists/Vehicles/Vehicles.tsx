import React from 'react';
import VehiclesStatistic from './VehiclesStatistics';
import VehiclesTableTools from './VehiclesTableTools';
import VehiclesTable from './VehiclesTable';
import AdaptableCard from '@/components/shared/AdaptableCard'; // Reusing this component

const Vehicles = () => {

    return (
        <>
            <VehiclesStatistic />
            <AdaptableCard className="h-full" bodyClass="h-full">
                <VehiclesTableTools />
                <VehiclesTable />
            </AdaptableCard>
        </>
        
    );
};

export default Vehicles;
