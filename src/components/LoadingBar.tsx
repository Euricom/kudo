import Image from "next/image";
import Loading from "~/../public/images/Eurilogo.gif";

const LoadingBar = () => {
  return (
    <>
      <div className="grid h-full w-full place-items-center">
        <div className="aspect-square h-1/4 w-1/4">
          <Image src={Loading} alt="Loading" />
        </div>
      </div>
    </>
  );
};

export default LoadingBar;
