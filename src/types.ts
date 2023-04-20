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
    speaker?: User,
}

export type SessionArray = {
    sessions: Session[],
    sort?: SortPosibillities
}

export type SessionListProps = {
    sessions: Session[],
    filterIn?: string,
    sortIn?: SortPosibillities,

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
    image?: string
}

export type UserWCount = {
    user: User,
    sessionCount: number
    sendKudoCount: number
    receiveKudoCount: number
}


export type SessionContextValue = {
    session: string;
    speaker: string;
    anonymous: boolean;
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
    DateA = 'Date Asc ↓ ',
    DateD = 'Date Desc ↑',
    SpeakerA = 'Speaker Asc ↓',
    SpeakerD = 'Speaker Desc ↑',
    TitleA = 'Title Asc ↓',
    TitleD = 'Title Desc ↑',
}


export type SortAndFilterProps = {
    setSort: React.Dispatch<React.SetStateAction<SortPosibillities>>;
    filter?: string
    setFilter: React.Dispatch<React.SetStateAction<string>>;
}

export type PresentationKudo = {
    id: string,
    x: number,
    y: number,
    rot: number,
    kudo: Kudo,
}

export type ImageData = {
    dataUrl: string;
}
export enum CanvasShapes {
    Text,
    Sticker,
    Line,
    Image,
    Rect,
    Circle,
}

export type KonvaCanvasProps = {
    editorFunction: EditorFunctions | undefined,
    template: Template,
    thickness: number,
    color: string,
    fontFamily: string,
    emoji?: EmojiObject,
    setFunction: (type: EditorFunctions) => void,
    setStage: (stage: Konva.Stage) => void
}

export type Shapes = {
    type: CanvasShapes,
    id: string,
    x?: number,
    y?: number,
    scale?: Vector2d,
    width?: number,
    height?: number,
    fill?: string,
    text?: string,
    image?: string,
    tool?: string,
    points?: number[],
    thickness?: number,
    color?: string,
    align?: string,
    verticalAlign?: string,
    fontSize?: number,
    draggable?: boolean,
    rotation?: number,
    radius?: number,
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
    Save  = 'save',
    None = 'none'
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

export type CanvasStickerProps = {
    shapeProps: Shapes,
    isSelected: boolean,
    editorFunction: EditorFunctions
    onSelect: () => void,
    onChange: (shapeProps: Shapes) => void,
    onDelete: (id: string) => void,
    onChangeEnd: (shapeProps: Shapes) => void,
}

export type CanvasImageProps = {
    shapeProps: Shapes,
    isSelected: boolean,
    editorFunction: EditorFunctions,
    onSelect: () => void,
    onChange: (shapeProps: Shapes) => void,
    onDelete: (id: string) => void,
}

export type RectangleProps = {
    shapeProps: Shapes,
    isSelected: boolean,
    editorFunction: EditorFunctions,
    onSelect: () => void,
    onChange: (shapeProps: Shapes) => void
    onDelete: (id: string) => void,
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

export enum Filter {
    Session = 'By session',
    User = 'By user',
    Flagged = 'Flagged',
}

export type EmojiObject = {
    id: string;
    name: string;
    native: string;
    unified: string;
    keywords: string[];
    shortcodes: string;
    emoticons: string[];
}
