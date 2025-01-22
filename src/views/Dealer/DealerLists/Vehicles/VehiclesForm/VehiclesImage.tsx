import Upload from '@/components/ui/Upload';
import { FcImageFile } from 'react-icons/fc';
import { useState, useRef } from 'react';

const VehiclesImage = ({
    setFieldValue,
}: {
    setFieldValue: (field: string, value: any) => void;
}) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('File change detected');
        const file = event.target.files?.[0];

        if (file) {
            // File size validation
            if (file.size > 5 * 1024 * 1024) {
                setErrorMessage('File size should not exceed 5MB');
                setFieldValue('image', null);
                return;
            }
            // File type validation
            if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
                setErrorMessage('Only jpeg, png, and gif formats are supported');
                setFieldValue('image', null);
            }

            // Valid file, clear error and update form values
            setErrorMessage(null);
            setFieldValue('image', file); // Store the file object in the form
        }

        // Reset the input so the same file can be reselected
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileDialog = (text: string) => {
        console.log(text);
         
        if (fileInputRef.current) {
            console.log('Triggering file input dialog');
            fileInputRef.current.click();
        } else {
            console.error('fileInputRef is null');
        }
    };

    return (
        <div className="border rounded-md p-4">
            <Upload>
                <div className="my-10 text-center">
                    <button
                        type="button"
                        onClick={() =>triggerFileDialog('button')}
                        className="text-4xl mb-4 flex justify-center cursor-pointer"
                    >
                        <FcImageFile />
                    </button>
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={(e) => {
                            console.log('Input change triggered:', e.target.files?.[0]?.name);
                            handleFileChange(e);
                        }}
                    />
                    <button
                        type="button"
                        onClick={() =>triggerFileDialog('p tag')}
                        className="font-semibold text-gray-800 dark:text-white cursor-pointer"
                    >
                        Drop your image here, or{' '}
                        <span className="text-blue-500 underline">browse</span>
                    </button>
                    <p className="mt-1 opacity-60 dark:text-white">Support: jpeg, png, gif</p>
                </div>
            </Upload>
            {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
        </div>
    );
};

export default VehiclesImage;
