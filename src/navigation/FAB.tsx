import Link from "next/link";
import useWindowDimensions from "~/hooks/useWindowDimensions";
import { type FabProps } from "~/types";


const FAB = ({ text, icon, url, onClick, urlWithParams}: FabProps) => {
    const { width } = useWindowDimensions();

    return (
        <>
            <div className="flex w-full fixed bottom-0 justify-center mb-5" data-cy='FAB'>
                {(!url && !urlWithParams) ? 
                    <div className="btn btn-primary rounded-full" onClick={onClick}>
                        {width < 768 ?
                            icon :
                            <>{text}</>
                        }
                    </div>
                    :
                    <Link href={urlWithParams ? urlWithParams : url??''} className="btn btn-primary rounded-full" onClick={onClick}>
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