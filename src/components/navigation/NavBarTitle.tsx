import React, { useEffect } from "react";
import { type TitleContextValue } from "~/types";

const TitleContext = React.createContext<TitleContextValue>({
  title: <></>,
  setTitle: () => {
    /* do nothing */
  },
});

export function TitleProvider(props: React.PropsWithChildren<object>) {
  const [title, setTitle] = React.useState<React.ReactNode>("");
  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {props.children}
    </TitleContext.Provider>
  );
}

export function useTitle(newValue?: React.ReactNode) {
  const context = React.useContext(TitleContext);

  useEffect(() => {
    if (newValue !== undefined) {
      context.setTitle(newValue);
    }
  }, [context, newValue]);
  return context.title;
}
export function useSetTitle() {
  const context = React.useContext(TitleContext);
  return context.setTitle;
}
export function NavigationBarContent({
  children,
}: {
  children: React.ReactNode;
}) {
  useTitle(children);
  return <></>;
}
