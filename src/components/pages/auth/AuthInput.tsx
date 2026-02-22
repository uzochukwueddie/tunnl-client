import type { AuthInputProps } from '../../../types';

export function AuthInput({ id, name, type, label, placeholder, disabled = false, required = false }: AuthInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>
      {/*
        Uncontrolled input — no value/onChange props.
        The parent form uses a React 19 action, so FormData collects
        this input's value via `name` on submission instead of React state.
        `disabled` locks the field while the async action is in-flight (isPending).
      */}
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        className={`input ${type === 'password' ? 'font-display' : ''}`}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}
