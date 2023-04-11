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

export type SelectProps<T> = {
    label: string,
    options: Array<T>,
    value: string | undefined,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    displayLabel: keyof T,
    valueLabel: keyof T,
}
export type KudoProps = {
    kudo: Kudo
}

export type FabProps = {
    text?: string
    icon?: React.ReactNode
    url?: string
    onClick?: () => void
    urlWithParams?: Url
}
export type MenuProps = {
    children?: React.ReactNode
}

export type TitleContextValue = {
    title: React.ReactNode;
    setTitle: React.Dispatch<React.SetStateAction<React.ReactNode | null>>;
}

export type Session = {
    id: string,
    title: string,
    date: string,
    speakerId: string,
}

export type SessionArray = {
    sessions: Session[],
    sort?: SortPosibillities
}

export type Temp = {
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
    anonymous: boolean;
    setAnonymous: React.Dispatch<React.SetStateAction<boolean>>;
}

export type SessionProps = {
    session: Session
}

export type NewSessionDate = {
    date: string,
    sessions: Session[]
}

export type NewSessionSpeaker = {
    speakerId: string,
    sessions: Session[]
}

export enum SortPosibillities {
    DateA = 'Date ↓',
    DateD = 'Date ↑',
    SpeakerA = 'Speaker ↓',
    SpeakerD = 'Speaker ↑',
    TitleA = 'Title ↓',
    TitleD = 'Title ↑',
}

export type SortAndFilterProps = {
    setSort: React.Dispatch<React.SetStateAction<SortPosibillities>>;
    filter?: string
    setFilter?: React.Dispatch<React.SetStateAction<string>>;
}

export type ImageData = {
    dataUrl: string;
}