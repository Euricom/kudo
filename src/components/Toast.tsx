const Toast = ({ message, type }: { message: string[], type?: number }) => {
    const color = getClassname()

    function getClassname() {
        switch (type) {
            case 3: return "alert-info"
            case 2: return "alert-succes"
            case 1: return "alert-warning"
            default: return "alert-error"
        }
    }



    return (
        <>
            <div className="top-16 toast toast-top toast-end z-50">
                <div className={`alert ${color}`}>
                    <div>
                        <span>{message}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Toast