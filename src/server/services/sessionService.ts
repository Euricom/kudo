import {
  SortPosibillities,
  type NewSessionDate,
  type NewSessionSpeaker,
  type SessionArray,
  type Session,
} from "~/types";

function formatDate(date: string | undefined) {
  if (!date) return;
  const d = new Date(date);
  return [d.getFullYear(), d.getMonth(), d.getDate()].join("-");
}

export function sortDate({ sessions, sort }: SessionArray) {
  sessions.sort((a, b) => (a.date > b.date ? 1 : -1));
  const sorted = sessions.reduce((previous, current) => {
    if (
      formatDate(previous[previous.length - 1]?.date) !==
      formatDate(current.date)
    ) {
      return [
        ...previous,
        {
          date: current.date,
          sessions: sessions.filter(
            (s) => formatDate(s.date) === formatDate(current.date)
          ),
        },
      ];
    } else {
      return previous;
    }
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

export async function getAllSessions(): Promise<Session[]> {
  return fetch(
    "https://euri-event-management-api.azurewebsites.net/api/v1/Timeslot/4"
  )
    .then((resp) => resp.json())
    .then((events: any[]) =>
      events
        .reduce(
          (a, b) =>
            a.concat(b.sessions.map((x: any) => ({ ...x, date: b.start }))),
          []
        )
        .map((session: any) => ({
          id: session.id,
          date: session.date,
          title: session.topic,
          speakerId: session.speakers.map((x: any) => x.uuid),
        }))
    );
}

export async function getSessionsBySpeaker(id: string) {
  return getAllSessions().then((result: Session[]) =>
    result.filter((r: Session) => r.speakerId.includes(id))
  );
}

export async function getSessionById(id: string): Promise<Session | null> {
  return getAllSessions().then(
    (sessions) => sessions.find((y) => y.id == id) || null
  );
}
