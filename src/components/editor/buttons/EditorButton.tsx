import { type EditorButtonProps } from "~/types";

const EditorButton = ({
  type,
  children,
  icon,
  bgColor,
  onClick,
}: EditorButtonProps) => {
  return (
    <>
      <label
        htmlFor={`Modal-${type}`}
        className={"btn-secondary btn-circle btn"}
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
