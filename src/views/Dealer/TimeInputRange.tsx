import React from 'react';

const TimeInputRange = ({ value, setSelectedTimeRange }) => {
    const handleStartChange = (event) => {
        const startDate = new Date(value[0]);
        const [hours, minutes] = event.target.value.split(':');
        startDate.setHours(hours);
        startDate.setMinutes(minutes);
        setSelectedTimeRange([startDate, value[1]]);
    };

    const handleEndChange = (event) => {
        const endDate = new Date(value[1]);
        const [hours, minutes] = event.target.value.split(':');
        endDate.setHours(hours);
        endDate.setMinutes(minutes);
        setSelectedTimeRange([value[0], endDate]);
    };

    return (
        <div className="flex justify-between">
            <input
                type="time"
                value={value[0].toTimeString().split(' ')[0].substring(0, 5)}
                onChange={handleStartChange}
                className="border border-gray-300 rounded p-1"
            />
            <span className="mx-2">to</span>
            <input
                type="time"
                value={value[1].toTimeString().split(' ')[0].substring(0, 5)}
                onChange={handleEndChange}
                className="border border-gray-300 rounded p-1"
            />
        </div>
    );
};

export default TimeInputRange;
