// From react.tips
import React from "react";

const Checkbox = ({ label, isSelected, onCheckboxChange, disabled = false }) => (
    <div className="form-check">
      <label>
        <input
          type="checkbox"
          name={label}
          checked={isSelected}
          onChange={onCheckboxChange}
          disabled={disabled}
          className="form-check-input"
        />
        {label}
      </label>
    </div>
  );

export default Checkbox;