const Session = () => {
    return (
        <>
            <div className="card bg-base-200 shadow-xl w-full h-fit md:w-96 bg-honeycomb bg-cover">
                <div className="bg-white bg-opacity-30 backdrop-blur-xs">
                    <div className="card-body">
                        <h2 className="card-title justify-center text-2xl bold">Title Session</h2>
                        <div className="flex">
                            <p className="text-lg">Name Speaker</p>
                            <p className="text-lg">Time slot</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Session;