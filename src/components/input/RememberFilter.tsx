import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { sortPosibillities, type FilterContextValue, type pages } from "~/types";


const FilterContext = React.createContext<FilterContextValue>({ pages: [], filters: [], sorts: [] });


export function useFilters(page?: pages, newFilter?: string, newSort?: sortPosibillities) {
    const router = useRouter()
    const context = React.useContext(FilterContext);
    useEffect(() => {
        router.events.on('routeChangeStart', (url: string) => {

            if (url === "/create") {
                context.pages = []
                context.filters = []
                context.sorts = []
            }

            if (page == url) {
                if (page !== undefined && newFilter !== undefined && newSort !== undefined) {
                    if (url === "/" || url === "/out" || url === "/all") {
                        if (context.pages.includes(page)) {
                            const index = context.pages.indexOf(page)
                            const filter = context.filters[index]
                            const sort = context.sorts[index]
                            context.pages = [page]
                            context.filters = [filter ?? ""]
                            context.sorts = [sort ?? sortPosibillities.DateD]
                        } else {
                            context.pages = []
                            context.filters = []
                            context.sorts = []
                        }
                    }
                }
            }

        });
    });

    if (page !== undefined && newFilter !== undefined && newSort !== undefined) {
        if (context.pages.includes(page)) {
            const index = context.pages.indexOf(page)
            context.filters.splice(index, 1, newFilter)
            context.sorts.splice(index, 1, newSort)
        } else {
            context.pages.push(page)
            context.filters.push(newFilter)
            context.sorts.push(newSort)
        }
    }
    return {
        data: {
            pages: context.pages,
            filters: context.filters,
            sorts: context.sorts,
        }
    }

}