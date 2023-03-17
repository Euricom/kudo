import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { object, string } from "zod";
import { env } from "~/env.mjs";
import * as msal from "@azure/msal-node";



const inputGetById = object({
    id: string(),
})
type objectUsers = {
    value: user[]
}
type user = {
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

}

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

const getToken = async () => {
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






export const userRouter = createTRPCRouter({




    getAllUsers: protectedProcedure.query(async () => {

        const options = await getToken()
        return await fetch('https://graph.microsoft.com/v1.0/users', options).then(r => r.json()) as objectUsers

    }),

    getUserById: protectedProcedure.input(inputGetById).query(async ({ input }) => {
        const options = await getToken()
        return await fetch('https://graph.microsoft.com/v1.0/users/' + input.id, options).then(r => r.json()) as objectUsers
    }),




});
