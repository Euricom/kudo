
import { env } from "~/env.mjs";
import * as msal from "@azure/msal-node";


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

export const findAllUsers = async (): Promise<objectUsers> => {
    const options = await getToken()
    return await fetch('https://graph.microsoft.com/v1.0/users', options).then(r => r.json()) as objectUsers

};

export const findUserById = async (id: string): Promise<objectUsers> => {
    const options = await getToken()
    return await fetch('https://graph.microsoft.com/v1.0/users/' + id, options).then(r => r.json()) as objectUsers
};