import React, { Dispatch, SetStateAction } from "react";


type TitleContextType = {
    title: React.ReactNode;
    setTitle: Dispatch<SetStateAction<React.ReactNode | null>>;
}

const iTitleContextType = {
    title: <></>,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setTitle: () => { }
}

interface useTitleProps {
    newValue?: React.ReactNode;
}


interface NavigationBarContentProps {
    props: React.PropsWithChildren<object>
}





const TitleContext = React.createContext<TitleContextType>(iTitleContextType);

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
    console.log(children);

    useTitle(children);
    return <></>;
}