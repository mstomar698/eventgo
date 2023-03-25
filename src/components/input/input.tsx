import React from 'react';

interface InputProps {
  placeholder?: string;
  name?: string;
  value?: string | number | readonly string[];
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = (props: InputProps) => {
  const {
    value = '',
    placeholder = 'some data',
    onChange = () => null,
    name = '',
  } = props;
  function triggerOnChangeEvent(e: any) {
    onChange(e);
  }

  return (
    <input
      type="text"
      className="input input-bordered w-full rounded-sm p-2"
      value={value}
      placeholder={placeholder}
      name={name}
      required
      onChange={triggerOnChangeEvent}
    />
  );
};

<Input />;
export default Input;
