import React from "react";
import { type SessionContextValue } from "~/types";

const SessionContext = React.createContext<SessionContextValue>({
  session: undefined,
  speaker: undefined,
  anonymous: false,
});

export function useSessionSpeaker(
  newSession?: string,
  newSpeaker?: string,
  anonymous?: string
) {
  const context = React.useContext(SessionContext);
  if (
    newSession !== undefined &&
    newSpeaker !== undefined &&
    anonymous !== undefined
  ) {
    context.session = newSession;
    context.speaker = newSpeaker;
    context.anonymous = anonymous === "true" ? true : false;
  }
  return {
    data: {
      session: context.session,
      speaker: context.speaker,
      anonymous: context.anonymous,
    },
  };
}
