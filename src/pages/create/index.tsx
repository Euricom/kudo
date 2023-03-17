import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/navigation/FAB";
import { GrNext } from "react-icons/gr"
import { FcPodiumWithSpeaker, FcPodiumWithAudience } from "react-icons/fc"
import Select from "~/input/Select";
import { NavigationBarContent } from "~/navigation/NavBarTitle";
import { env } from "~/env.mjs";
import * as msal from "@azure/msal-node";
import { useState } from "react";
import { api } from "~/utils/api";


type session = {
  Id: number,
  Title: string,
  Date: string,
  SpeakerId: string,
}

type result = {
  sessions: session[]
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

type objectUsers = {
  value: user[]
}
export async function getServerSideProps() {
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
  const result: objectUsers = await fetch('https://graph.microsoft.com/v1.0/users', options).then(r => r.json()) as objectUsers


  return {
    props: {
      res: result.value,
    }
  }
}

const New: NextPage<{ res: user[] }> = ({ res }) => {


  console.log(res.length);

  res = res.filter(user => user.givenName !== null || user.surname !== null)
  console.log(res);


  const [session, setSession] = useState<string>("");
  const [speaker, setSpeaker] = useState<string>("");

  const result: result | undefined = api.sessions.getAll.useQuery().data
  if (!result) {
    return <div>Loading...</div>;
  }
  const data: session[] = result.sessions



  return (
    <>
      <NavigationBarContent>
        <h1>New</h1>
      </NavigationBarContent>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center overflow-y-scroll h-full gap-5">
        <FcPodiumWithSpeaker size={100} />
        <Select data-cy="SelectSpeaker" value={speaker} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSpeaker(e.target.value)} label="Speaker" options={res.map(x => x.displayName)} />
        <FcPodiumWithAudience size={100} />
        <Select data-cy="SelectSession" value={session} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSession(e.target.value)} label="Session" options={data.map(x => x.Title)} />
        <label className="label cursor-pointer gap-5">
          <input type="checkbox" className="checkbox" />
          <span className="label-text">Hide my name.</span>
        </label>
      </main>
      <FAB text={"Next"} icon={<GrNext />} url="/geenUrl" urlWithParams={{ pathname: "/create/templates", query: { session: session, speaker: speaker }, auth: null, hash: null, host: null, hostname: null, href: "/create/templates", path: null, protocol: null, search: null, slashes: null, port: null }} />
    </>
  );
};

export default New;