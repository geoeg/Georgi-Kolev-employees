interface DropdownProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onOptionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  value,
  options,
  onOptionChange,
}: DropdownProps) => {
  return (
    <div>
      <label htmlFor="dropdown-menu">{label}</label>
      <select id="dropdown-menu" value={value} onChange={onOptionChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
