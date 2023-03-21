import { type Kudo } from "@prisma/client";
import { type Url } from "url";

export type AuthProps = {
    children?: React.ReactNode
}

export type Document = {
    documentMode?: number;
}

export type UtilButtonsContext = {
    buttons: React.ReactNode,
    setButtons: React.Dispatch<React.SetStateAction<React.ReactNode | null>>
}

export type SelectProps = {
    label: string,
    options: Array<string>,
    value: string | undefined,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}
export type KudoProps = {
    kudo: Kudo
}

export type FabProps = {
    text?: string
    icon?: React.ReactNode
    url: string | undefined
    onClick?: () => void
    urlWithParams?: Url | undefined
}
export type NavBarProps = {
    children?: React.ReactNode
}

export type TitleContextValue = {
    title: React.ReactNode;
    setTitle: React.Dispatch<React.SetStateAction<React.ReactNode | null>>;
}