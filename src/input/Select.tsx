
interface SelectProps  { 
    label: string,
    options: Array<string> 
}

const Select = ({ label, options}: SelectProps) => {
    return (
        <>
        <div className="form-control w-full max-w-xs">
        <label className="label">
            <span className="label-text">{label}</span>
        </label>
        <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" list={label}/>
        <datalist id={label} className=" data-[]">
            {options.map((x) => (
                <option key={x} value={x} className="bg-black">{x}</option>
            ))}
        </datalist>
        </div>
        </>
    );
};

export default Select;