import React, { useEffect } from "react";
import { UtilButtonsContext } from "~/types";
import { useRouter } from "next/router";



const UtilButtonsContext = React.createContext<UtilButtonsContext>({ buttons: <></>, setButtons: () => { /* do nothing */ } });

export function UtilButtonsProvider(props: React.PropsWithChildren<object>) {
    const [buttons, setButtons] = React.useState<React.ReactNode>('');
    const router = useRouter();

    useEffect(() => {
        router.events.on('routeChangeStart', () => {
            setButtons('');
        });
    }, [router]);

    return (
        <UtilButtonsContext.Provider value={{ buttons, setButtons }}>
            {props.children}
        </UtilButtonsContext.Provider>
    );
}

export function useUtilButtons(newValue: (React.ReactNode | undefined)) {
    const context = React.useContext(UtilButtonsContext);

    useEffect(() => {
        if (newValue !== undefined) {
            context.setButtons(newValue);
        }
    }, [context, newValue])

    return context.buttons;
}

export function UtilButtonsContent({ children }: {
    children: React.ReactNode;
}) {
    useUtilButtons(children);
    return <></>;
}