import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/navigation/FAB";
import { GrNext } from "react-icons/gr"
import { FcPodiumWithSpeaker, FcPodiumWithAudience } from "react-icons/fc"
import Select from "~/input/Select";
import { NavigationBarContent } from "~/navigation/NavBarTitle";

//{ "id": 1, "firstName": "Terry", "lastName": "Medhurst", "maidenName": "Smitham", "age": 50, "gender": "male", "email": "atuny0@sohu.com", "phone": "+63 791 675 8914", "username": "atuny0", "password": "9uQFF1Lh", "birthDate": "2000-12-25", "image": "https://robohash.org/hicveldicta.png", "bloodGroup": "A−", "height": 189, "weight": 75.4, "eyeColor": "Green", "hair": { "color": "Black", "type": "Strands" }, "domain": "slashdot.org", "ip": "117.29.86.254", "address": { "address": "1745 T Street Southeast", "city": "Washington", "coordinates": { "lat": 38.867033, "lng": -76.979235 }, "postalCode": "20020", "state": "DC" }, "macAddress": "13:69:BA:56:A3:74", "university": "Capitol University", "bank": { "cardExpire": "06/22", "cardNumber": "50380955204220685", "cardType": "maestro", "currency": "Peso", "iban": "NO17 0695 2754 967" }, "company": { "address": { "address": "629 Debbie Drive", "city": "Nashville", "coordinates": { "lat": 36.208114, "lng": -86.58621199999999 }, "postalCode": "37076", "state": "TN" }, "department": "Marketing", "name": "Blanda-O'Keefe", "title": "Help Desk Operator" }, "ein": "20-9487066", "ssn": "661-64-2976", "userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/12.0.702.0 Safari/534.24" },

type user = {
  id: number,
  firstName: string,
  lastName: string,
  maidenName: string,
}


export async function getServerSideProps() {
  const res = await fetch('https://dummyjson.com/users')
  const data = res.json()
  return {
    props: {
      res: data,
    }
  }
}



const New: NextPage<{ res: user[] }> = ({ res }) => {
  const speakers = ["Steve Jobs", "Bill Gates", "Steven Universe"];
  const sessions = ["Ted talk 1", "Gaming", "???"];
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
        <Select label="Speaker" options={speakers} />
        <FcPodiumWithAudience size={100} />
        <Select label="Session" options={sessions} />
        <label className="label cursor-pointer gap-5">
          <input type="checkbox" className="checkbox" />
          <span className="label-text">Hide my name.</span>
        </label>
      </main>
      <FAB text={"Next"} icon={<GrNext />} url="/create/templates" />
    </>
  );
};

export default New;