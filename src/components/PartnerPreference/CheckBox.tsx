// CheckBox.tsx
import React from 'react';

interface CheckboxProps {
    id: string;
    name: string;
    value: string;
    label: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ id, name, value, label, checked, onChange }) => {
    return (
        <div className="flex items-center">
            <input
                type="checkbox"
                id={id}
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                className="mr-2"
            />
            <label htmlFor={id}>{label}</label>
        </div>
    );
};

export default Checkbox;
