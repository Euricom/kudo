import { type EditorButtonProps } from "~/types";

const EditorButton = ({
  type,
  children,
  ref,
  icon,
  bgColor,
  onClick,
}: EditorButtonProps) => {
  return (
    <>
      <div className="dropdown hidden lg:block">
        <label className="">
          <button
            onClick={onClick}
            className={"btn-secondary btn-circle btn "}
            style={{
              backgroundColor: bgColor ?? "transparent",
            }}
          >
            {icon}
          </button>
        </label>
        {children && (
          <>
            <dialog
              ref={ref}
              className="dropdown-content rounded-box absolute hidden bg-base-100 p-2 shadow md:block"
            >
              {children}
            </dialog>
          </>
        )}
      </div>
      <label
        htmlFor={`Modal-${type}`}
        className={"btn-secondary btn-circle btn lg:hidden"}
        style={{
          backgroundColor: bgColor ?? "transparent",
        }}
        onClick={onClick}
      >
        {icon}
      </label>
      <input type="checkbox" id={`Modal-${type}`} className="modal-toggle" />
      {children && (
        <>
          <label htmlFor={`Modal-${type}`} className="modal cursor-pointer">
            <label
              className="relative w-fit rounded-xl bg-base-100 p-5"
              htmlFor=" "
            >
              {children}
            </label>
          </label>
        </>
      )}
    </>
  );
};

export default EditorButton;
