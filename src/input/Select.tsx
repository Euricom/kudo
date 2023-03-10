interface SelectProps {
    label: string,
    options: Array<string>,
    value: string | undefined,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Select = ({ label, options, value, onChange }: SelectProps) => {
    console.log(options);

    return (
        <>
            <div className="form-control w-full max-w-xs" data-cy={label}>
                <label className="label">
                    <span className="label-text">{label}</span>
                </label>
                <input value={value} onChange={onChange} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" list={label} data-cy="inputSelect" />
                <datalist id={label} className=" data-[]">
                    {options.map((x) => (
                        <option key={x} value={x} className="bg-black">{x}</option>
                    ))}
                </datalist>
            </div>
        </>

        // <select className="select w-full max-w-xs">
        //     <option disabled selected>Pick your favorite Simpson</option>
        //     <option>Homer</option>
        //     <option>Marge</option>
        //     <option>Bart</option>
        //     <option>Lisa</option>
        //     <option>Maggie</option>
        // </select>
    );
};

export default Select;