import { useRouter } from 'next/router';
import { FiSearch } from 'react-icons/fi';
import { GrEmoji } from "react-icons/gr"
import { BiPencil, BiPalette, BiText, BiSortDown } from "react-icons/bi"

export default function useVisibleButtons() {
    const router = useRouter();

    return [
        {
            Component: SearchIcon,
            key: 'searchButton',
            routes: ['/', '/out', '/all'],
        },
        {
            Component: SortIcon,
            key: 'sortButton',
            routes: ['/', '/out', '/all'],
        },
        {
            Component: DrawIcon,
            key: 'drawButton',
            routes: ['/create/editor'],
        },
        {
            Component: StickerIcon,
            key: 'stickerButton',
            routes: ['/create/editor'],
        },
        {
            Component: TextIcon,
            key: 'textButton',
            routes: ['/create/editor'],
        },
        {
            Component: ColorIcon,
            key: 'colorButton',
            routes: ['/create/editor'],
        },
    ].filter((item) => item.routes.includes(router.pathname));
}

function SearchIcon() {
    return (
        <>
            <button className="btn btn-ghost btn-circle">
                <FiSearch size={20} />
            </button>
        </>
    );
}
function SortIcon() {
    return (
        <>
            <button className="btn btn-ghost btn-circle">
                <BiSortDown size={20} />
            </button>
        </>
    );
}
function DrawIcon() {
    return (
        <>
            <button className="btn btn-ghost btn-circle">
                <BiPencil size={20} />
            </button>
        </>
    );
}
function StickerIcon() {
    return (
        <>
            <button className="btn btn-ghost btn-circle">
                <GrEmoji size={20} />
            </button>
        </>
    );
}
function TextIcon() {
    return (
        <>
            <button className="btn btn-ghost btn-circle">
                <BiText size={20} />
            </button>
        </>
    );
}
function ColorIcon() {
    return (
        <>
            <button className="btn btn-ghost btn-circle">
                <BiPalette size={20} />
            </button>
        </>
    );
}