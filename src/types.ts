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
    isPresentation?: boolean
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

export enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER",
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
    setFilter: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export type PresentationKudo = {
    id: string,
    x: number,
    y: number,
    rot: number,
    kudo: Kudo,
}
export enum CanvasShapes {
    Text,
    Sticker,
    Line,
    Rect
}

export type KonvaCanvasProps = {
    editorFunction: EditorFunctions | undefined,
    template: Template,
    thickness: number,
    color: string,
    fontFamily: string,
    setFunction: (type: EditorFunctions) => void,
    setStage: (stage: Konva.Stage) => void
}



export type Shapes = {
    type: CanvasShapes,
    id: string,
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    fill?: string,
    text?: string,
    tool?: string,
    points?: number[],
    thickness?: number,
    color?: string,
    align?: string,
    verticalAlign?: string,
    fontSize?: number,
    draggable?: boolean,
    rotation?: number,
}

export type CanvasTextProps = {
    container?: HTMLDivElement,
    shapeProps: Shapes,
    scale: number,
    isSelected: boolean,
    onSelect: () => void,
    onChange: (shapeProps: Shapes) => void,
    areaPosition: Vector2d,
    onDelete: (id: string) => void,
    onChangeEnd: (shapeProps: Shapes) => void,
    editorFunction: EditorFunctions
}

export enum EditorFunctions {
    Text = 'text',
    Draw = 'draw',
    Erase = 'erase',
    Sticker = 'sticker',
    Color = 'color',
    Clear = 'clear',
    Undo = 'undo',
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

export const Fonts = [
    "Helvetica",
    "Garamond",
    "Futura",
    "Bodoni",
    "Arial",
    "Times New Roman",
    "Verdana",
    "Rockwell",
    "FranklinGothic",
    "Univers",
    "Frutiger"]
