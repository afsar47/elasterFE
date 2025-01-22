import React, { useState } from 'react';
import AdaptableCard from '@/components/shared/AdaptableCard'; // Reusing this component
import TiresStatistics from './TiresStatistics';
import TiresTableTools from './TiresTableTools';
import TiresTable from './TireTable';
import { Button } from '@/components/ui';

const Tires = () => {
    const [selectedTab, setSelectedTab] = useState("Active");

    return (
        <>
            <TiresStatistics />
            <div className="flex space-x-4 mt-4">
                <button
                    onClick={() => setSelectedTab("Active")}
                    className={`text-sm font-semibold ${selectedTab === "Active" ? "text-blue-500 underline" : "text-gray-600"}`}
                >
                    Active
                </button>
                <button
                    onClick={() => setSelectedTab("Archive")}
                    className={`text-sm font-semibold ${selectedTab === "Archive" ? "text-blue-500 underline" : "text-gray-600"}`}
                >
                    Archive
                </button>
            </div>

            <AdaptableCard className="h-full" bodyClass="h-full mt-4">
                <TiresTableTools />
                
                {selectedTab === "Active" ? (
                    <TiresTable />
                ) : (
                    <p className="text-gray-500 italic">No tires yet</p>
                )}
            </AdaptableCard>
        </>
    );
};

export default Tires;
