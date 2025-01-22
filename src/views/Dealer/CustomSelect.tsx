import Select, { SingleValue } from 'react-select';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  placeholder: string;
  options: Option[];
  onChange: (value: SingleValue<Option>) => void;
  className?: string;
  fixedOption?: {
    label: string;
    onClick: () => void;
  };
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  placeholder,
  options,
  onChange,
  className = '',
  fixedOption,
}) => {
  // Combine options with the fixed option placed at the bottom
  const combinedOptions = [
    ...options,
    ...(fixedOption ? [{ value: '', label: fixedOption.label }] : []),
  ];

  const handleChange = (selectedOption: SingleValue<Option>) => {
    if (selectedOption?.label === fixedOption?.label) {
      fixedOption.onClick(); // Trigger the fixed option action
      return; // Prevent selection from being registered
    }

    onChange(selectedOption); // Handle normal selection
  };

  return (
    <Select
      placeholder={placeholder}
      options={combinedOptions}
      onChange={handleChange}
      className={className}
      classNamePrefix="react-select"
      // This prop ensures the fixed option doesn't appear as selected
      value={null} 
    />
  );
};

export default CustomSelect;
