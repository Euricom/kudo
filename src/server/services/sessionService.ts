import {
  SortPosibillities,
  type NewSessionDate,
  type NewSessionSpeaker,
  type SessionArray,
  type Session,
  type SessionDetail,
} from "~/types";
import { env } from "~/env.mjs";

export function sortDate({ sessions, sort }: SessionArray) {
  sessions.sort((a, b) => (a.date > b.date ? -1 : 1));
  const sorted = sessions.reduce((previous, current) => {
    if (previous[previous.length - 1]?.date !== current.date) {
      return [
        ...previous,
        {
          date: current.date,
          sessions: sessions.filter((s) => s.date === current.date),
        },
      ];
    } else return previous;
  }, [] as NewSessionDate[]);

  if (sort === SortPosibillities.DateA) {
    return sorted.reverse();
  }
  return sorted;
}
export function sortTitle({ sessions, sort }: SessionArray) {
  const sorted = sessions.sort((a, b) => (a.title > b.title ? 1 : -1));
  if (sort === SortPosibillities.TitleD) {
    return sorted.reverse();
  }
  return sorted;
}
export function sortSpeaker({ sessions, sort }: SessionArray) {
  const sorted: NewSessionSpeaker[] = sessions.reduce(
    (previous: NewSessionSpeaker[], current: Session) => {
      const speakerIds = current.speakerId.filter(
        (speakerId) => !previous.find((p) => p.speakerId === speakerId)
      );
      const speakers = speakerIds.map((speakerId) => ({
        speakerId: speakerId,
        sessions: sessions.filter((s) => s.speakerId.includes(speakerId)),
      }));

      return [...previous, ...speakers];
    },
    [] as NewSessionSpeaker[]
  );

  if (sort === SortPosibillities.SpeakerD) {
    return sorted.reverse();
  }
  return sorted;
}

export async function getAllSessions() {
  const result = (await fetch(`${env.SESSION_URL}`).then((result) =>
    result.json()
  )) as Session[];
  const mockdata = (await fetch(`${env.NEXTAUTH_URL}/api/sessions`).then(
    (result) => result.json()
  )) as Session[];
  return result.concat(mockdata).filter((s) => new Date(s.date) < new Date());
}

export async function getSessionsBySpeaker(id: string) {
  return await getAllSessions().then((result: Session[]) =>
    result.filter((r: Session) => r.speakerId.includes(id))
  );
}

export async function getSessionById(id: string): Promise<SessionDetail> {
  const mockdata = (await getAllSessions()).find((s) => s.id === id);

  if (!mockdata) {
    try {
      const result = await fetch(`${env.SESSION_URL}/${id}`).then(
        (result) => result.json() as Promise<SessionDetail>
      );
      return result;
    } catch (e) {
      return {} as SessionDetail;
    }
  }
  return {
    ...mockdata,
    date: [mockdata?.date],
  } as SessionDetail;
}
