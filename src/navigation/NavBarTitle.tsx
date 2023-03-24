import React from "react";
import { type TitleContextValue } from "~/types";

const TitleContext = React.createContext<TitleContextValue>({ title: <></>, setTitle: () => { /* do nothing */ } });

export function TitleProvider(props: React.PropsWithChildren<object>) {
    const [title, setTitle] = React.useState<React.ReactNode | null>(null);
    return (
        <TitleContext.Provider value={{ title, setTitle }}>
            {props.children}
        </TitleContext.Provider>
    );
}

export function useTitle(newValue: (React.ReactNode | undefined)) {
    const context = React.useContext(TitleContext);

    if (newValue !== undefined) {
        context.setTitle(newValue);
    }
    return context.title;
}

export function NavigationBarContent({ children }: {
    children: React.ReactNode;
}) {
    useTitle(children);
    return <></>;
}
