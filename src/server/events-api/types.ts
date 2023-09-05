export interface TimeSlot {
  id: number;
  start: string;
  duration: number;
  roomId: number;
  room: Room;
  scheduleId: number;
  sessions: Session[];
}

export interface Room {
  id: number;
  name: Name;
  capacity: number;
  roomType: number;
  eventId: number;
  availableMaterials: string[];
}

export type Name = "Roger";

export interface Session {
  id: number;
  topic: string;
  status: string;
  description: string;
  length: Length;
  language: Language[];
  speakers: Speaker[];
  host: null;
  tag: Tag;
  sessionMaterials: string[];
  tagId: number;
  eventId: number;
}

export type Language = "Dutch";

export type Length = "Classroom talk (45-60min)" | "Lightning talk (15-20min)";

export interface Speaker {
  displayName: string;
  uuid: string;
  mail: string;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
}
