// Drawer.tsx
import React, { ReactNode, MouseEvent } from 'react';
import Drawer from '@/components/ui/Drawer'; // Adjust the import based on your project structure

// Define the prop types for ReusableDrawer
type ReusableDrawerProps = {
    icon?: ReactNode;  // Optional icon
    title: string;     // Title of the drawer
    children: ReactNode;  // Content of the drawer
    isOpen: boolean;   // Controls whether the drawer is open
    onClose: (e: MouseEvent) => void;  // Function to call when closing the drawer
};

const ReusableDrawer: React.FC<ReusableDrawerProps> = ({ icon, title, children, isOpen, onClose }) => {
    return (
        <div>
            {icon} {/* Render the icon if provided */}
            <Drawer
                title={title}
                isOpen={isOpen} // Use the isOpen prop here
                onClose={onClose} // Use the onClose prop here
                onRequestClose={onClose}
            >
                {children}
            </Drawer>
        </div>
    );
};

export default ReusableDrawer;
