import { FiSearch } from "react-icons/fi"
import { MdSort } from "react-icons/md"
import { type SortAndFilterProps, sortPosibillities } from "~/types"
import { useRouter } from "next/router"

function useVisibleSort() {
    const router = useRouter();

    return [
        {
            sort: sortPosibillities.DateA,
            routes: ['/', '/out', '/speaker/[...id]'],
        },
        {
            sort: sortPosibillities.DateD,
            routes: ['/', '/out', '/speaker/[...id]'],
        },
        {
            sort: sortPosibillities.SpeakerA,
            routes: ['/out', '/all'],
        },
        {
            sort: sortPosibillities.SpeakerD,
            routes: ['/out', '/all'],
        },
        {
            sort: sortPosibillities.TitleA,
            routes: ['/', '/out', '/speaker/[...id]'],
        },
        {
            sort: sortPosibillities.TitleD,
            routes: ['/', '/out', '/speaker/[...id]'],
        },
    ].filter((item) => item.routes.includes(router.pathname));
}

const SortAndFilter = ({ setSort, filter, setFilter }: SortAndFilterProps) => {
    const visibleSort = useVisibleSort();

    return (
        <>
            <div className="w-full lg:w-1/2 p-5 z-40 flex justify-center gap-2 mx-auto">
                <div className="flex w-full max-w-md bg-base-100 rounded-full items-center px-4">
                    <FiSearch size={20} className="" />
                    <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder={"Search..."} className="input w-full bg-transparent rounded-full p-3 focus:outline-none" />
                </div>
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-primary btn-circle m-1" data-cy='SettingsButton'><MdSort size={20} /></label>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                        {visibleSort.map((x) => {
                            return (
                                <>
                                    <li key={x.sort} className="btn btn-ghost" onClick={() => setSort(x.sort)}>
                                        {x.sort}
                                    </li>
                                </>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default SortAndFilter