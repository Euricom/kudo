
import { type SelectProps } from "~/types";



function Select<T>({ label, options, value, onChange, displayLabel, valueLabel }: SelectProps<T>) {
    return (
        <>
            <div className="form-control w-full max-w-xs" data-cy={label}>
                <label className="label">
                    <span className="label-text">{label}</span>
                </label>
                <input value={value as string} onChange={onChange} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" list={label} data-cy="inputSelect" />
                <datalist id={label} className=" data-[]" data-cy="datalist" >
                    {options.map((x: T) => (
                        <option key={x[valueLabel] as string} value={x[displayLabel] as string} className="bg-black" data-cy="option">{x[displayLabel] as string}</option>
                    ))}
                </datalist>
            </div>
        </>
    );
}

export default Select;