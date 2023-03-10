import Link from "next/link";
import { type Url } from "url";
import useWindowDimensions from "~/hooks/useWindowDimensions";
interface FabProps {
    text?: string
    icon?: React.ReactNode
    url: string
    urlWithParams?: Url | undefined
}

const FAB = ({ text, icon, url, urlWithParams = undefined }: FabProps) => {
    const { width } = useWindowDimensions();
    return (
        <>
            {/* <div className="flex w-full fixed bottom-0 justify-center mb-5">
        <button className="btn btn-circle btn-primary md:hidden">
            {icon}
        </button>
        <button className="btn btn-primary hidden md:block">
            <a>{text}</a>
        </button>
        </div> */}

            <div className="flex w-full fixed bottom-0 justify-center mb-5" data-cy='FAB'>
                <Link href={urlWithParams == undefined ? url : urlWithParams} className="btn btn-primary rounded-full">
                    {width < 768 ?
                        icon :
                        <><a>{text}</a></>
                    }
                </Link>
            </div>
        </>
    );
};

export default FAB;