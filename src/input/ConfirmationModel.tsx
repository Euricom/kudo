type ModalProps = {
    prompt: string
    onCancel: () => void
    cancelLabel: string
    onSubmit: () => void
    submitLabel: string
  }
  
  //Later in aparte component folder
  const ConfirmationModal = ({prompt, onCancel, cancelLabel, onSubmit, submitLabel}: ModalProps) => {
    return (
      <>
        {/* Modal */}
        <input type="checkbox" className="modal-toggle" checked readOnly/>
        <div className="modal modal-bottom sm:modal-middle">
          <div className="modal-box form-control">
            <label className="label">
              <span className="label-text">{prompt}</span>
            </label>
            <div className="modal-action">
              <button className="btn" onClick={onCancel}>{cancelLabel}</button>
              <button className="btn text-error" onClick={onSubmit}>{submitLabel}</button>
            </div>
          </div>
        </div>
      </>
    )
  }

export default ConfirmationModal;