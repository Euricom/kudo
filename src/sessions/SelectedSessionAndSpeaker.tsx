import React from "react";
import { type SessionContextValue } from "~/types";


const SessionContext = React.createContext<SessionContextValue>({ session: "", setSession: () => { /* do nothing */ }, speaker: "", setSpeaker: () => { /* do nothing */ }, anonymous: false, setAnonymous: () => { /* do nothing */ } });

export function SessionSpeakerProvider(props: React.PropsWithChildren<object>) {
    const [session, setSession] = React.useState<string>("");
    const [speaker, setSpeaker] = React.useState<string>("");
    const [anonymous, setAnonymous] = React.useState<boolean>(false);
    return (
        <SessionContext.Provider value={{ session, setSession, speaker, setSpeaker, anonymous, setAnonymous }}>
            {props.children}
        </SessionContext.Provider>
    );
}


export function useSessionSpeaker(newSession: (string | undefined), newSpeaker: (string | undefined), anonymous: (string | undefined)) {
    const context = React.useContext(SessionContext);
    if (newSession !== undefined && newSpeaker !== undefined && anonymous !== undefined) {
        context.setSession(newSession);
        context.setSpeaker(newSpeaker);
        context.setAnonymous(anonymous === 'true' ? true : false);
    }
    return {
        data: {
            session: context.session,
            speaker: context.speaker,
            anonymous: context.anonymous
        }
    }

}