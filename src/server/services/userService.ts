
import { env } from "~/env.mjs";
import * as msal from "@azure/msal-node";
import { type UserWCount, type AADResponseUsers, type User, type SessionArray } from "~/types";
import { type PrismaClient, type Kudo } from "@prisma/client";


const msalConfig = {
    auth: {
        clientId: env.AZURE_AD_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${env.AZURE_AD_TENANT_ID}/`,
        clientSecret: env.AZURE_AD_CLIENT_SECRET,
    },
};
const tokenRequest = {
    scopes: ['https://graph.microsoft.com/.default']
};

export const getToken = async () => {
    const authenticationResult: msal.AuthenticationResult | null = await new msal.ConfidentialClientApplication(
        msalConfig
    ).acquireTokenByClientCredential(tokenRequest);

    const accessToken = authenticationResult?.accessToken

    if (!accessToken) {
        throw new Error()
    }
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    };
    return options
}


export const findAllUsers = async (): Promise<User[]> => {
    const options = await getToken()
    let users: User[] = []
    let url = 'https://graph.microsoft.com/v1.0/users'
    while (url != undefined) {
        const result: AADResponseUsers = await fetch(url, options).then(r => r.json()) as AADResponseUsers
        users = users.concat(result.value)
        url = result['@odata.nextLink'];
    }
    return users
};

export const findUserById = async (id: string): Promise<User> => {
    const options = await getToken()
    const user: User = await fetch('https://graph.microsoft.com/v1.0/users/' + id, options).then(r => r.json()) as User
    return user
};

export const findRelevantUsers = async (ctx: {prisma: PrismaClient}): Promise<UserWCount[]> => {
    const users = await findAllUsers()

    // Vragen aan Yannick: Is dit wel juist? Ik heb het gevoel dat ik hier iets fout doe.
    const kudos = await ctx.prisma.kudo.findMany({})
    const sessions = await fetch(`${env.SESSION_URL}`).then(result => result.json()) as SessionArray

    const returnUsers = users.map((user) => {
        return {
            user: user,
            sessionCount: sessions.sessions?.filter(session => session.speakerId === user.id).length ?? 0,
            sendKudoCount: kudos?.filter(kudo => kudo.userId === user.id).length ?? 0,
            receiveKudoCount: kudos?.filter(kudo => kudo.userId === user.id).length ?? 0,
        }
    })

    return returnUsers.filter(user => user.sessionCount > 0 || user.sendKudoCount > 0 || user.receiveKudoCount > 0)
};
