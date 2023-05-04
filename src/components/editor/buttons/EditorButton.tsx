import { type EditorButtonProps } from "~/types";

function EditorButton({ children, icon, bgColor, onClick }: EditorButtonProps) {
  return (
    <>
      <div className="md:dropdown">
        <label tabIndex={0} className="">
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
            <ul
              tabIndex={0}
              className="dropdown-content rounded-box absolute hidden bg-base-100 p-2 shadow md:block"
            >
              {children}
            </ul>
          </>
        )}
      </div>
    </>
  );
}

export default EditorButton;
