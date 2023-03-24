import Link from "next/link";
import useWindowDimensions from "~/hooks/useWindowDimensions";
import { type FabProps } from "~/types";


const FAB = ({ text, icon, url, onClick, urlWithParams = undefined }: FabProps) => {
    const { width } = useWindowDimensions();

    return (
        <>
            <div className=" fixed bottom-7 left-1/2 -translate-x-1/2 z-50" data-cy='FAB'>
                {url == undefined ?
                    <div className="btn btn-accent rounded-full" onClick={onClick}>
                        {width < 768 ?
                            icon :
                            <>{text}</>
                        }
                    </div>
                    :
                    <Link href={urlWithParams == undefined ? url : urlWithParams} className="btn btn-accent rounded-full h-16 w-16 md:w-fit" onClick={onClick}>
                        {width < 768 ?
                            icon :
                            <>{text}</>
                        }
                    </Link>
                }

            </div>
        </>
    );
};

export default FAB;