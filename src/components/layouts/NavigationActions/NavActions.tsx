import React, { useState } from 'react';
import { HiOutlineBell, HiOutlineSearch, HiOutlinePlus, HiOutlineClock, HiOutlineMail } from 'react-icons/hi';
import RecentlyViewedToggle from './RecentlyViewed';
import AddToggle from './Add';
import ReusableDrawer from './ReusableDrawer';

const NotificationButton = () => {
    const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
    const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false);

    const toggleNotificationDrawer = () => {
        setIsNotificationDrawerOpen(!isNotificationDrawerOpen);
    };

    const toggleMessageDrawer = () => {
        setIsMessageDrawerOpen(!isMessageDrawerOpen);
    };

    return (
        <div className="relative flex items-center gap-4">
            {/* Recently Viewed Button (Clock Icon) */}
            {/* <button className="p-2 bg-transparent rounded-full hover:bg-gray-100 focus:outline-none">
                <RecentlyViewedToggle />
            </button> */}

            {/* Search Button */}
            {/* <button className="p-2 bg-transparent rounded-full hover:bg-gray-100 focus:outline-none">
                <HiOutlineSearch className="text-2xl text-gray-600" />
            </button> */}

            {/* Notification Button */}
            <button onClick={toggleNotificationDrawer} className="p-2 bg-transparent rounded-full hover:bg-gray-100 focus:outline-none">
                <HiOutlineBell className="text-2xl text-gray-600" />
            </button>

            {/* Message Button */}
            <button onClick={toggleMessageDrawer} className="p-2 bg-transparent rounded-full hover:bg-gray-100 focus:outline-none">
                <HiOutlineMail className="text-2xl text-gray-600" />
            </button>

            {/* Add Button */}
            <button className="p-2 bg-transparent rounded-full hover:bg-gray-100 focus:outline-none">
                <AddToggle />
            </button>

            {/* Notification Drawer */}
            <ReusableDrawer
                title="Notifications"
                isOpen={isNotificationDrawerOpen}  // Pass state to control open/close
                onClose={() => setIsNotificationDrawerOpen(false)}  // Handle closing the drawer
            >
                Notification Drawer Content
            </ReusableDrawer>

            {/* Message Drawer */}
            <ReusableDrawer
                title="Messages"
                isOpen={isMessageDrawerOpen}  // Pass state to control open/close
                onClose={() => setIsMessageDrawerOpen(false)}  // Handle closing the drawer
            >
                Message Drawer Content
            </ReusableDrawer>
        </div>
    );
};

export default NotificationButton;
