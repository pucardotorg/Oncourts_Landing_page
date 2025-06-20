import React from 'react';
import { TextField } from '../../ui/form';
import { newCaseSearchConfig } from '../../../data/newCaseSearchConfig';

interface CNRNumberFormProps {
  cnrNumber: string;
  onChange: (value: string) => void;
}

const CNRNumberForm: React.FC<CNRNumberFormProps> = ({ cnrNumber, onChange }) => {
  return (
    <div>
      <TextField
        label={newCaseSearchConfig.cnrNumber.label}
        value={cnrNumber}
        onChange={onChange}
        placeholder={newCaseSearchConfig.cnrNumber.placeholder}
        helperText={newCaseSearchConfig.cnrNumber.errorMessage} // Use errorMessage as helperText
        required={true} // CNR number is always required
        minLength={16}
        maxLength={16}
      />
    </div>
  );
};

export default CNRNumberForm;
