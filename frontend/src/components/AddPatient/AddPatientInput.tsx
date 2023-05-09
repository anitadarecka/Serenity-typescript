import PropTypes from "prop-types";
import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
import "../../Tailwind.css";

interface NewPatient {
  lastname: null | string;
  firstname: null | string;
  mail: null | string;
  place: null | string;
  birth: null | string;
  phone: null | string;
}

interface AddPatientInputProps {
  name: string;
  id: number;
  type: string;
  classNameInput: string;
  classNameDiv: string;
  placeholder: string;
  label: string;
  value: string;
  addNewPatient: NewPatient;
  setAddNewPatient: Dispatch<SetStateAction<NewPatient>>;
}

function AddPatientInput({
  name,
  id,
  type,
  classNameInput,
  classNameDiv,
  placeholder,
  label,
  value,
  addNewPatient,
  setAddNewPatient,
}: AddPatientInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddNewPatient({
      ...addNewPatient,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div key={id} className={classNameDiv}>
      <label className="ml-1" htmlFor={name}>
        {label}
      </label>
      <input
        type={type}
        className={classNameInput}
        value={value}
        placeholder={placeholder}
        name={name}
        id={name}
        onChange={handleChange}
      />
    </div>
  );
}

const NewPatientPropTypes = {
  lastname: PropTypes.string,
  firstname: PropTypes.string,
  mail: PropTypes.string,
  place: PropTypes.string,
  birth: PropTypes.string,
  phone: PropTypes.string,
};

AddPatientInput.propTypes = {
  classNameDiv: PropTypes.string.isRequired,
  classNameInput: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  addNewPatient: PropTypes.shape(NewPatientPropTypes).isRequired,
  setAddNewPatient: PropTypes.func.isRequired,
};

export default AddPatientInput;
