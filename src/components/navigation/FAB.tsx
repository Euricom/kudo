import Link from "next/link";
import useWindowDimensions from "~/hooks/useWindowDimensions";
import { type FabProps } from "~/types";

const FAB = ({
  text,
  icon,
  url,
  onClick,
  urlWithParams,
  disabled = false,
}: FabProps) => {
  const { width } = useWindowDimensions();

  return (
    <>
      <div
        className=" fixed bottom-7 left-1/2 z-50 -translate-x-1/2"
        data-cy="FAB"
      >
        {disabled ? (
          <button
            className="btn-outline btn-accent btn h-16 w-16 rounded-full md:w-fit"
            disabled
          >
            {width < 768 ? icon : <>{text}</>}
          </button>
        ) : !url && !urlWithParams ? (
          <button
            className="btn-accent btn h-16 w-16 rounded-full md:w-fit"
            onClick={onClick}
          >
            {width < 768 ? icon : <>{text}</>}
          </button>
        ) : (
          <Link
            href={urlWithParams ? urlWithParams : url ?? ""}
            className="btn-accent btn h-16 w-16 rounded-full md:w-fit"
            onClick={onClick}
          >
            {width < 768 ? icon : <>{text}</>}
          </Link>
        )}
      </div>
    </>
  );
};

export default FAB;
