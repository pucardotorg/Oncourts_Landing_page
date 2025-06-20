import React from 'react';
import { TextField } from '../../ui/form';

interface CNRNumberFormProps {
  cnrNumber: string;
  onChange: (value: string) => void;
}

const CNRNumberForm: React.FC<CNRNumberFormProps> = ({ cnrNumber, onChange }) => {
  return (
    <div>
      <TextField
        label="CNR Number"
        value={cnrNumber}
        onChange={onChange}
        placeholder="Ex: KLKL123456789123"
        helperText="Format: CourtId + Number"
        required
        minLength={16}
        maxLength={16}
      />
    </div>
  );
};

export default CNRNumberForm;
