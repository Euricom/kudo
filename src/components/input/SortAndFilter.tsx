import { useRouter } from "next/router"
import { FiSearch } from "react-icons/fi"
import { MdSort } from "react-icons/md"
import { type SortAndFilterProps, SortPosibillities } from "~/types"

function useVisibleSort() {
    const router = useRouter();

    return [
        {
            sort: SortPosibillities.DateA,
            routes: ['/', '/out', '/speaker/[...id]'],
        },
        {
            sort: SortPosibillities.DateD,
            routes: ['/', '/out', '/speaker/[...id]'],
        },
        {
            sort: SortPosibillities.SpeakerA,
            routes: ['/out', '/all'],
        },
        {
            sort: SortPosibillities.SpeakerD,
            routes: ['/out', '/all'],
        },
        {
            sort: SortPosibillities.TitleA,
            routes: ['/', '/out', '/speaker/[...id]'],
        },
        {
            sort: SortPosibillities.TitleD,
            routes: ['/', '/out', '/speaker/[...id]'],
        },
    ].filter((item) => item.routes.includes(router.pathname));
}


const SortAndFilter = ({ setSort, filter, setFilter }: SortAndFilterProps) => {
    const visibleSort = useVisibleSort();
    const router = useRouter()
    const query = router.query

    const changeSort = (newSort: SortPosibillities) => {
        setSort(newSort)
        router.replace({ query: { ...query, sort: newSort } }).catch(e => console.log(e))
    }

    const changeFilter = (newFilter: string) => {
        setFilter(newFilter)
        router.replace({ query: { ...query, searchtext: newFilter } }).catch(e => console.log(e))
    }
    return (
        <>
            <div className="w-full lg:w-1/2 p-5 z-40 flex justify-center gap-2 mx-auto">
                <div className="flex w-full max-w-md bg-base-100 rounded-full items-center px-4">
                    <FiSearch size={20} className="" />
                    <input type="text" value={filter} onChange={(e) => {
                        changeFilter(e.target.value)
                    }} placeholder={"Search..."} className="input w-full bg-transparent rounded-full p-3 focus:outline-none" />
                </div>
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-primary btn-circle m-1" data-cy='SettingsButton'><MdSort size={20} /></label>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                        {visibleSort.map((x) => {
                            return (
                                <>
                                    <li key={x.sort} className="btn btn-ghost normal-case" onClick={() => changeSort(x.sort)}>
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