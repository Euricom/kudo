import { FiSearch } from "react-icons/fi"
import { MdSort } from "react-icons/md"
import { type SortAndFilterProps, sortPosibillities } from "~/types"
import { useFilters } from "./RememberFilter"

const SortAndFilter = ({ page, sort, setSort, filter, setFilter }: SortAndFilterProps) => {


    useFilters(page, filter ?? "", sort);


    return (
        <>
            <div className="w-full lg:w-1/2 p-5 z-40 flex justify-center gap-2 mx-auto">
                <div className="flex w-full max-w-md bg-base-100 rounded-full items-center px-4">
                    <FiSearch size={20} className="" />
                    <input type="text" value={filter} onChange={(e) => {
                        setFilter(e.target.value)
                    }} placeholder={"Search..."} className="input w-full bg-transparent rounded-full p-3 focus:outline-none" />
                </div>
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-primary btn-circle m-1" data-cy='SettingsButton'><MdSort size={20} /></label>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">

                        <li className="btn btn-ghost" onClick={() => setSort(sortPosibillities.DateD)}>
                            {sortPosibillities.DateD}
                        </li>
                        <li className="btn btn-ghost" onClick={() => setSort(sortPosibillities.DateA)}>
                            {sortPosibillities.DateA}
                        </li>
                        <li className="btn btn-ghost" onClick={() => setSort(sortPosibillities.SpeakerA)}>
                            {sortPosibillities.SpeakerA}
                        </li>
                        <li className="btn btn-ghost" onClick={() => setSort(sortPosibillities.SpeakerD)}>
                            {sortPosibillities.SpeakerD}
                        </li>
                        <li className="btn btn-ghost" onClick={() => setSort(sortPosibillities.TitleA)}>
                            {sortPosibillities.TitleA}
                        </li>
                        <li className="btn btn-ghost" onClick={() => setSort(sortPosibillities.TitleD)}>
                            {sortPosibillities.TitleD}
                        </li>

                    </ul>
                </div>
            </div>
        </>
    )
}

export default SortAndFilter