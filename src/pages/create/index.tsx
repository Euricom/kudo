/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/navigation/FAB";
import { GrNext } from "react-icons/gr"
import { FcPodiumWithSpeaker, FcPodiumWithAudience } from "react-icons/fc"
import Select from "~/input/Select";
import { NavigationBarContent } from "~/navigation/NavBarTitle";
import { env } from "~/env.mjs";
import * as msal from "@azure/msal-node";
import axios, { AxiosRequestConfig } from 'axios';


// import { useMsal, useAccount } from "@azure/msal-react";

// import { trpc } from '~/utils/trpc';
// import { PublicClientApplication } from "@azure/msal-browser";
import { useState, useEffect } from "react";
import { trpc } from "~/utils/trpc";


type session = {
  Id: number,
  Title: string,
  Date: string,
  SpeakerId: string,
}

type result = {
  sessions: session[]
}


export async function getServerSideProps() {
  const msalConfig = {
    auth: {
      clientId: env.AZURE_AD_CLIENT_ID,
      authority: `https://login.microsoftonline.com/${env.AZURE_AD_TENANT_ID}/`,
      clientSecret: env.AZURE_AD_CLIENT_SECRET,
    },
  };


  //   const msalInstance: PublicClientApplication = new PublicClientApplication(msalConfig);
  //   const acquireAccessToken = async (msalInstance: PublicClientApplication) => {
  //     const activeAccount = msalInstance.getActiveAccount(); // This will only return a non-null value if you have logic somewhere else that calls the setActiveAccount API
  //     const accounts = msalInstance.getAllAccounts();
  // 
  //     if (!activeAccount && accounts.length === 0) {
  //       /*
  //       * User is not signed in. Throw error or wait for user to login.
  //       * Do not attempt to log a user in outside of the context of MsalProvider
  //       */
  //     }
  //     const request = {
  //       scopes: ["User.Read"],
  //       account: activeAccount || accounts[0]
  //     };
  // 
  //     const authResult = await msalInstance.acquireTokenSilent(request);
  // 
  //     return authResult.accessToken
  //   };
  //   const accessToken = acquireAccessToken(msalInstance);
  //   console.log(accessToken);






  const tokenRequest = {
    scopes: ['https://graph.microsoft.com/.default']
  };


  const { accessToken } = await new msal.ConfidentialClientApplication(
    msalConfig
  ).acquireTokenByClientCredential(tokenRequest);


  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
  };

  // const users = [];
  // let Url = 'https://graph.microsoft.com/v1.0/users';



  // const { data } = await getUsers(Url, options);
  // users.push(...data.value);
  // Url = data['@odata.nextLink'];



  //   async function callApi(endpoint, accessToken) {
  //     
  //     console.log('request made to web API at: ' + new Date().toString());

  //     try {
  //       const response = await axios.get(endpoint, options);
  //       return response.data;
  //     } catch (error) {
  //       console.log(error)
  //       return error;
  //     }
  //   }


  const result = await fetch('https://graph.microsoft.com/v1.0', options)/*.then(r=>r.json())*/

  console.log("voor");
  console.log(accessToken);
  console.log("tussen");
  console.log(result);
  console.log("na");

  return {
    props: {
      res: result,
    }
  }
}
// const getUsers = (url: string, options: AxiosRequestConfig) => {
//   return axios.get(url, options);
// }

const New: NextPage/*<{ res: any }>*/ = (/*{ res }*/) => {


  // const { instance, accounts, inProgress } = useMsal();
  //   const account = useAccount(accounts[0] || {});

  //   const [graphData, setGraphData] = useState(null);


  //   useEffect(() => {
  //     if (account) {
  //         instance.acquireTokenSilent({
  //             scopes: ["User.Read"],
  //             account: account
  //         }).then((response) => {
  //             if(response) {
  //                 callMsGraph(response.accessToken).then((result) => console.log(result));
  //             }
  //         });
  //     }
  // }, [account, instance]);



  console.log(res);


  const [session, setSession] = useState<string>("");
  const [speaker, setSpeaker] = useState<string>("");

  const result: result | undefined = trpc.sessions.getAll.useQuery().data
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
        <Select data-cy="SelectSpeaker" value={speaker} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSpeaker(e.target.value)} label="Speaker" options={data.map(x => x.id)} />
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

















































// import { type NextPage } from "next";
// import Head from "next/head";
// import FAB from "~/navigation/FAB";
// import { GrNext } from "react-icons/gr"
// import { FcPodiumWithSpeaker, FcPodiumWithAudience } from "react-icons/fc"
// import Select from "~/input/Select";
// import { NavigationBarContent } from "~/navigation/NavBarTitle";
// // import { env } from "~/env.mjs";
// // import * as msal from '@azure/msal-node';

// import { trpc } from '~/utils/trpc';

// import { useState } from "react";


// type session = {
//   Id: number,
//   Title: string,
//   Date: string,
//   SpeakerId: string,
// }

// type result = {
//   sessions: session[]
// }


// // export async function getServerSideProps() {
// //   const msalConfig = {
// //     auth: {
// //       clientId: env.AZURE_AD_CLIENT_ID,
// //       authority: `https://login.microsoftonline.com/${env.AZURE_AD_TENANT_ID}/`,
// //       clientSecret: env.AZURE_AD_CLIENT_SECRET,
// //     },
// //   };
// //   const tokenRequest = {
// //     scopes: ['https://graph.microsoft.com/.default'],
// //   };

// //   const { accessToken } = await new msal.ConfidentialClientApplication(
// //     msalConfig,
// //   ).acquireTokenByClientCredential(tokenRequest);

// //   const options = {
// //     headers: {
// //       Authorization: `Bearer ${accessToken}`,
// //     },
// //   };

// // const result = await fetch('https://graph.microsoft.com/v1.0/users/0b53d2c1-bc55-4ab3-a161-927d289257f2', options)
// // const data = result
// // console.log("voor");
// // console.log(accessToken);
// // console.log("tussen");
// // console.log(result);
// // console.log("na");

// // return {
// //   props: {
// //     res: accessToken,
// //   }
// // }
// // }



// const New: NextPage = () => {

//   const [session, setSession] = useState<string>("");
//   const [speaker, setSpeaker] = useState<string>("");

//   const result: result | undefined = trpc.sessions.getAll.useQuery().data
//   if (!result) {
//     return <div>Loading...</div>;
//   }
//   const data: session[] = result.sessions




//   return (
//     <>
//       <NavigationBarContent>
//         <h1>New</h1>
//       </NavigationBarContent>
//       <Head>
//         <title>eKudo</title>
//         <meta name="description" content="eKudo app" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <main className="flex flex-col items-center justify-center overflow-y-scroll h-full gap-5">
//         <FcPodiumWithSpeaker size={100} />
//         <Select data-cy="SelectSpeaker" value={speaker} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSpeaker(e.target.value)} label="Speaker" options={data.map(x => x.SpeakerId)} />
//         <FcPodiumWithAudience size={100} />
//         <Select data-cy="SelectSession" value={session} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSession(e.target.value)} label="Session" options={data.map(x => x.Title)} />
//         <label className="label cursor-pointer gap-5">
//           <input type="checkbox" className="checkbox" />
//           <span className="label-text">Hide my name.</span>
//         </label>
//       </main>
//       <FAB text={"Next"} icon={<GrNext />} url="/geenUrl" urlWithParams={{ pathname: "/create/templates", query: { session: session, speaker: speaker }, auth: null, hash: null, host: null, hostname: null, href: "/create/templates", path: null, protocol: null, search: null, slashes: null, port: null }} />
//     </>
//   );
// };

// export default New;