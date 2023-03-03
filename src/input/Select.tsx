
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
        <select className="select select-bordered">
            <option disabled selected>Pick one</option>
            {options.map((x) => (
                <option key={x} value={x}>{x}</option>
            ))}
        </select>
        </div>
        </>
    );
};

export default Select;