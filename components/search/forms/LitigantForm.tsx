import React from "react";
import { TextField } from "../../ui/form";

interface LitigantFormProps {
  litigantName: string;
  onChange: (value: string) => void;
}

const LitigantForm: React.FC<LitigantFormProps> = ({
  litigantName,
  onChange,
}) => {
  return (
    <div className="col-span-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <TextField
            label="Litigant Name"
            value={litigantName}
            onChange={onChange}
            helperText="Minimum 3 characters needed"
            error={litigantName.length > 0 && litigantName.length < 3}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default LitigantForm;
