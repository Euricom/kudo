import React from "react";
import { type SessionContextValue } from "~/types";


const SessionContext = React.createContext<SessionContextValue>({ session: "", setSession: () => { /* do nothing */ }, speaker: "", setSpeaker: () => { /* do nothing */ } });

export function SessionSpeakerProvider(props: React.PropsWithChildren<object>) {
    const [session, setSession] = React.useState<string>("");
    const [speaker, setSpeaker] = React.useState<string>("");
    return (
        <SessionContext.Provider value={{ session, setSession, speaker, setSpeaker }}>
            {props.children}
        </SessionContext.Provider>
    );
}


export function useSessionSpeaker(newSession: (string | undefined), newSpeaker: (string | undefined)) {
    const context = React.useContext(SessionContext);
    if (newSession !== undefined && newSpeaker !== undefined) {
        context.setSession(newSession);
        context.setSpeaker(newSpeaker);
    }
    return {
        data: {
            session: context.session,
            speaker: context.speaker
        }
    }

}