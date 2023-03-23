
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

type AADResponseUsers = {
    value: User[]
    '@odata.nextLink': string
}
type AADResponseUser = {
    value: User
}
type User = {
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