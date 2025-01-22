import { useRef } from 'react';
import Button from '@/components/ui/Button';
import {
    useAppDispatch,
    useAppSelector,
} from '@/store';
import FeesTableSearch from './FeesTableSearch'; // Adjusted to match Fees context
import FeesTableFilter from './FeesTableFilter'; // Adjusted to match Fees context
import cloneDeep from 'lodash/cloneDeep';
import type { TableQueries } from '@/@types/common';
import { HiDownload, HiOutlineAdjustments, HiOutlineSaveAs } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const FeesTableTools = () => {
    const dispatch = useAppDispatch();

    const handleInputChange = (val: string) => {
        return null; // Custom handler logic can be added as needed
    };

    return (
        <div className="md:flex items-center justify-between">
            <div className="md:flex items-center gap-4">
                <FeesTableSearch
                    onInputChange={handleInputChange}
                />
            </div>
            <div className="flex gap-2 items-center mb-4">
                <FeesTableFilter />
                <Link
                    download
                    className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
                    to="/data/fees-list.csv" // Adjusted link for fees export
                    target="_blank"
                >
                    <Button block size="sm" icon={<HiDownload />}>
                        Export
                    </Button>
                </Link>
                <Button 
                    size="sm" 
                    className="flex items-center gap-1" 
                >
                    <HiOutlineAdjustments className="text-lg" />
                    Customize
                </Button>
            </div>
        </div>
    );
};

export default FeesTableTools;
