import React from "react";

type UtilButtonsContext = {
    buttons: React.ReactNode,
    setButtons: React.Dispatch<React.SetStateAction<React.ReactNode | null>>
}

const UtilButtonsContext = React.createContext<UtilButtonsContext>({ buttons: <></>, setButtons: () => { /* do nothing */ } });

export function UtilButtonsProvider(props: React.PropsWithChildren<object>) {
    const [buttons, setButtons] = React.useState<React.ReactNode | null>(null);
    return (
        <UtilButtonsContext.Provider value={{ buttons, setButtons }}>
            {props.children}
        </UtilButtonsContext.Provider>
    );
}

export function useUtilButtons(newValue: (React.ReactNode | undefined)) {
    const context = React.useContext(UtilButtonsContext);

    if (newValue !== undefined) {
        context.setButtons(newValue);
    }
    return context.buttons;
}

export function UtilButtonsContent({ children }: {
    children: React.ReactNode;
}) {
    useUtilButtons(children);
    return <></>;
}