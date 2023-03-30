import { type Kudo } from "@prisma/client";
import { api } from "~/utils/api";



export const FindAllKudosSortedByUserId = (id: string, sort: string): Kudo[] => {

    const array = ["a", "b", "c"]

    const sorting = sort.split(" ")

    const kudoQuery = api.kudos.getKudosByUserId.useQuery({ id: id });
    const kudos: Kudo[] = kudoQuery.data as Kudo[]
    const sessions = api.sessions.getAll.useQuery().data
    let sortedKudos: Kudo[] = []

    console.log(kudos);



    if (sorting[0] === "speaker" && kudos) {
        if (sorting[1] === "desc") {
            console.log("in speaker desc");
            sortedKudos = kudos.sort((a, b) => (sessions?.find(s => s.id === a.sessionId)?.speakerId ?? "a" > (sessions?.find(s => s.id === b.sessionId)?.speakerId ?? "b")) ? -1 : 1)
            console.log(sortedKudos);
        }
        else {
            console.log("in speaker asc");
            sortedKudos = kudos.sort((a, b) => ((sessions?.find(s => s.id === a.sessionId)?.speakerId) ?? "a" > (sessions?.find(s => s.id === b.sessionId)?.speakerId ?? "b")) ? 1 : -1)
            console.log(sortedKudos);
        }
    }
    if (sorting[0] === "session" && kudos) {
        if (sorting[1] === "desc") {
            console.log("in session desc");
            sortedKudos = kudos.sort((a, b) => ((sessions?.find(s => s.id === a.sessionId)?.title) ?? "a" > (sessions?.find(s => s.id === b.sessionId)?.title ?? "b")) ? -1 : 1)
            console.log(sortedKudos);
        }
        else {
            console.log("in session asc");
            sortedKudos = kudos.sort((a, b) => ((sessions?.find(s => s.id === a.sessionId)?.title) ?? "a" > (sessions?.find(s => s.id === b.sessionId)?.title ?? "b")) ? 1 : -1)
            console.log(sortedKudos);
        }
    }

    console.log("begin");
    console.log(sortedKudos);
    console.log(sortedKudos.reverse());
    console.log(sortedKudos);
    console.log(array);
    console.log(array.reverse());
    console.log(array);

    return sortedKudos;
};

