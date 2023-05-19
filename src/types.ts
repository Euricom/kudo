import { type Kudo, type Template } from "@prisma/client";
import { type Url } from "url";
import { type Vector2d } from "konva/lib/types";
import type Konva from "konva";

export type AuthProps = {
  children?: React.ReactNode;
};

export type Document = {
  documentMode?: number;
};

export type UtilButtonsContext = {
  buttons: React.ReactNode;
  setButtons: React.Dispatch<React.SetStateAction<React.ReactNode | null>>;
};

export type SelectProps<T> = {
  label: string;
  options: Array<T>;
  value: string | undefined;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  displayLabel: keyof T;
  valueLabel: keyof T;
};
export type KudoProps = {
  kudo: Kudo;
  isPresentation?: boolean;
};

export type FabProps = {
  disabled?: boolean;
  text?: string;
  icon?: React.ReactNode;
  url?: string;
  onClick?: () => void;
  urlWithParams?: Url;
};
export type MenuProps = {
  children?: React.ReactNode;
};

export type TitleContextValue = {
  title: React.ReactNode;
  setTitle: React.Dispatch<React.SetStateAction<React.ReactNode | null>>;
};

export type Session = {
  id: string;
  title: string;
  date: string;
  speakerId: string[];
};

export type SessionDetail = {
  id: string;
  title: string;
  date: string[];
  speakerId: string[];
};

export type SessionArray = {
  sessions: Session[];
  sort?: SortPosibillities;
};

export type SessionListProps = {
  sessions: Session[];
  filterIn?: string;
  sortIn?: SortPosibillities;
};

export type AADResponseUsers = {
  value: User[];
  "@odata.nextLink": string;
};

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export type User = {
  businessPhones: string[];
  displayName: string;
  givenName: string;
  jobTitle: string;
  mail: string;
  mobilePhone: string;
  officeLocation: string;
  preferredLanguage: string;
  surname: string;
  userPrincipalName: string;
  id: string;
};

export type UserWCount = {
  user: User;
  sessionCount: number;
  sendKudoCount: number;
  receiveKudoCount: number;
};

export type SessionContextValue = {
  session?: string;
  speaker?: string;
  anonymous: boolean;
};

export type SessionProps = {
  session: Session;
};

export type NewSessionDate = {
  date: string;
  sessions: Session[];
};

export type NewSessionSpeaker = {
  speakerId: string;
  sessions: Session[];
};

export enum SortPosibillities {
  DateD = "Date (New-Old)",
  DateA = "Date (Old-New)",
  SpeakerA = "Speaker (A-Z)",
  SpeakerD = "Speaker (Z-A)",
  TitleA = "Title (A-Z)",
  TitleD = "Title (Z-A)",
}

export type SortAndFilterProps = {
  setSort: React.Dispatch<React.SetStateAction<SortPosibillities>>;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  filter?: string;
  sort?: string;
};

export type PresentationKudo = {
  id: string;
  x: number;
  y: number;
  rot: number;
  kudo: Kudo;
};

export type ImageData = {
  dataUrl: string;
};
export enum CanvasShapes {
  Text,
  Sticker,
  Line,
  Image,
  Rect,
  Circle,
  BackgroundColor,
}

export type KonvaCanvasProps = {
  editorFunction: EditorFunctions | undefined;
  template: Template;
  thickness?: number;
  color: string;
  fontFamily?: string;
  emoji?: EmojiObject;
  anonymous?: boolean;
  setFunction: (type: EditorFunctions) => void;
  setStage: (stage: Konva.Stage) => void;
};

export type Shapes = {
  type: CanvasShapes;
  id: string;
  index?: number;
  x?: number;
  y?: number;
  scale?: Vector2d;
  width?: number;
  height?: number;
  fill?: string;
  text?: string;
  image?: string;
  tool?: string;
  points?: number[];
  thickness?: number;
  color?: string;
  align?: string;
  verticalAlign?: string;
  fontSize?: number;
  draggable?: boolean;
  rotation?: number;
  radius?: number;
  fontFamily?: string;
};

export enum EditorFunctions {
  Text = "text",
  Draw = "draw",
  Erase = "erase",
  PreSticker = "preSticker",
  PostSticker = "postSticker",
  Color = "color",
  Clear = "clear",
  Undo = "undo",
  Save = "save",
  Deselect = "deselect",
  Submit = "submit",
  None = "none",
}

export type CanvasTextProps = {
  shapeProps: Shapes;
  scale: number;
  isSelected: boolean;
  editorFunction: EditorFunctions;
  dialog?: HTMLDialogElement;
  onSelect: () => void;
  onChange: (shapeProps: Shapes) => void;
  onDelete: (id: string) => void;
  onChangeEnd: (shapeProps: Shapes) => void;
};

export type CanvasStickerProps = {
  shapeProps: Shapes;
  isSelected: boolean;
  editorFunction: EditorFunctions;
  onSelect: () => void;
  onChange: (shapeProps: Shapes) => void;
  onDelete: (id: string) => void;
  onChangeEnd: (shapeProps: Shapes) => void;
};

export type CanvasImageProps = {
  shapeProps: Shapes;
  isSelected: boolean;
  editorFunction: EditorFunctions;
  onSelect: () => void;
  onChange: (shapeProps: Shapes) => void;
  onDelete: (id: string) => void;
};

export type RectangleProps = {
  shapeProps: Shapes;
  isSelected: boolean;
  editorFunction: EditorFunctions;
  onSelect: () => void;
  onChange: (shapeProps: Shapes) => void;
  onDelete: (id: string) => void;
};

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
  "Frutiger",
];

export enum Filter {
  Session = "By session",
  User = "By user",
  Flagged = "Flagged",
}

export type EmojiObject = {
  id: string;
  name: string;
  native: string;
  unified: string;
  keywords: string[];
  shortcodes: string;
  emoticons: string[];
};

export type EditorButtonProps = {
  children?: React.ReactNode;
  type: string;
  icon: React.ReactNode;
  onClick: () => void;
  bgColor?: string;
};
