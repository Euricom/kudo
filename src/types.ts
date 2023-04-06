import { type Kudo, type Template } from "@prisma/client";
import { type Url } from "url";
import { type Vector2d } from 'konva/lib/types';
import type Konva from "konva";

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
    sort?: sortPosibillities
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

export type UserWCount = {
    user: User,
    sessionCount: number
    sendKudoCount: number
    receiveKudoCount: number
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

export type newSessionDate = {
    date: string,
    sessions: Session[]
}

export type newSessionSpeaker = {
    speakerId: string,
    sessions: Session[]
}

export enum sortPosibillities {
    DateA = 'Date ↓',
    DateD = 'Date ↑',
    SpeakerA = 'Speaker ↓',
    SpeakerD = 'Speaker ↑',
    TitleA = 'Title ↓',
    TitleD = 'Title ↑',
}

export type SortAndFilterProps = {
    setSort: React.Dispatch<React.SetStateAction<sortPosibillities>>;
    filter?: string
    setFilter?: React.Dispatch<React.SetStateAction<string>>;
}
export enum CanvasShapes {
    Text,
    Sticker,
    Rect
}

export type KonvaCanvasProps = {
    editorFunction: EditorFunctions | undefined,
    template: Template,
    thickness: number,
    color: string,
    setFunction: (type: EditorFunctions) => void,
    setStage: (stage: Konva.Stage) => void
}



export type Shapes = {
    type: CanvasShapes,
    id: string,
    x: number,
    y: number,
    width?: number,
    height?: number,
    fill?: string,
    text?: string,
}

export type LineProps = {
    tool: string,
    points: number[],
    thickness: number,
    color: string,
}

export type CanvasTextProps = {
    shapeProps: Shapes,
    scale: number,
    isSelected: boolean,
    onSelect: () => void,
    onChange: (shapeProps: Shapes) => void,
    areaPosition: Vector2d,
    fontSize: number,
}

export enum EditorFunctions {
    Text = 'text',
    Draw = 'draw',
    Erase = 'erase',
    Sticker = 'sticker',
    Color = 'color',
    Clear = 'clear',
    Submit = 'submit',
    None = 'none'
}


export type RectangleProps = {
    shapeProps: Shapes,
    scale: number,
    isSelected: boolean,
    onSelect: () => void,
    onChange: (shapeProps: Shapes) => void
}