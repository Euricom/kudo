import { useRouter } from "next/router";
import { FiSearch } from "react-icons/fi";
import { MdSort } from "react-icons/md";
import { toast } from "react-toastify";
import { type SortAndFilterProps, SortPosibillities } from "~/types";

function useVisibleSort() {
  const router = useRouter();

  return [
    {
      sort: SortPosibillities.DateD,
      routes: [
        "/",
        "/out",
        "/speaker/[...id]",
        "/all/sessions",
        "/all/flagged",
        "/create",
      ],
    },
    {
      sort: SortPosibillities.DateA,
      routes: [
        "/",
        "/out",
        "/speaker/[...id]",
        "/all/sessions",
        "/all/flagged",
        "/create",
      ],
    },
    {
      sort: SortPosibillities.SpeakerA,
      routes: ["/out", "/all", "/all/sessions", "/all/flagged", "/create"],
    },
    {
      sort: SortPosibillities.SpeakerD,
      routes: ["/out", "/all", "/all/sessions", "/all/flagged", "/create"],
    },
    {
      sort: SortPosibillities.TitleA,
      routes: [
        "/",
        "/out",
        "/speaker/[...id]",
        "/all/sessions",
        "/all/flagged",
        "/create",
      ],
    },
    {
      sort: SortPosibillities.TitleD,
      routes: [
        "/",
        "/out",
        "/speaker/[...id]",
        "/all/sessions",
        "/all/flagged",
        "/create",
      ],
    },
  ].filter((item) => item.routes.includes(router.pathname));
}

const SortAndFilter = ({
  setSort,
  setFilter,
  sort,
  filter,
}: SortAndFilterProps) => {
  const visibleSort = useVisibleSort();
  const router = useRouter();
  const query = router.query;

  const changeSort = (newSort: SortPosibillities) => {
    setSort(newSort);
    void router
      .replace({ query: { ...query, sort: newSort } })
      .catch((e) => toast.error((e as Error).message));
  };

  const changeFilter = (newFilter: string) => {
    setFilter(newFilter);
    void router
      .replace({ query: { ...query, searchtext: newFilter } })
      .catch((e) => toast.error((e as Error).message));
  };
  return (
    <>
      <div className="z-40 mx-auto flex w-full justify-center gap-2 p-5 lg:w-1/2">
        <div className="flex w-full max-w-md items-center rounded-full bg-base-100 px-4">
          <FiSearch size={20} className="" />
          <input
            type="text"
            value={filter}
            onChange={(e) => {
              changeFilter(e.target.value);
            }}
            placeholder={"Search..."}
            className="input w-full rounded-full bg-transparent p-3 focus:outline-none"
          />
        </div>
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn-primary btn-circle btn m-1"
            data-cy="SettingsButton"
          >
            <MdSort size={20} />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box w-40 justify-center bg-base-100 p-2 shadow"
          >
            {visibleSort.map((x) => {
              return (
                <>
                  <li
                    key={x.sort}
                    className={`p-2 normal-case ${
                      x.sort === sort ||
                      (x.sort === visibleSort[0]?.sort && !sort)
                        ? "text-accent"
                        : ""
                    }`}
                    onClick={() => changeSort(x.sort)}
                  >
                    {x.sort}
                  </li>
                </>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SortAndFilter;
