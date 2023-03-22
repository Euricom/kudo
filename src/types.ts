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

export type Session = {
    id: number,
    title: string,
    date: string,
    speakerId: string,
}

export type SessionArray = {
    sessions: Session[]
}

export type temp = {
    id: string,
    Color: string,
    Title: string,
    Sticker: string,
}

export type AADResponseUsers = {
    value: User[]
    '@odata.nextLink': string
}
export type User = {
    businessPhones: string[],
    displayName: string,
    givenName: string,
    jobTitle: string,
    mail: string,
    mobilePhone: string,
    officeLocation: string,
    preferredLanguage: string,
    surname: string,
    userPrincipalName: string,
    id: string
}
export type SessionContextValue = {
    session: string;
    setSession: React.Dispatch<React.SetStateAction<string>>;
    speaker: string;
    setSpeaker: React.Dispatch<React.SetStateAction<string>>;
}
export type session = {
    id: number,
    title: string,
    date: string,
    speakerId: string,
}
export type SessionProps = {
    session: session
}