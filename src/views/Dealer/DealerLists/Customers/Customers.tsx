import React from 'react';
import CustomersStatistic from './CustomersStatistics';
import CustomersTableTools from './CustomersTableTools';
import CustomersTable from './CustomersTable';
import AdaptableCard from '@/components/shared/AdaptableCard'; // Reusing this component

const Customers = () => {
    return (
        <>
            <CustomersStatistic />
            <AdaptableCard className="h-full" bodyClass="h-full">
                <CustomersTableTools />
                <CustomersTable />
            </AdaptableCard>
        </>
        
    );
};

export default Customers;
