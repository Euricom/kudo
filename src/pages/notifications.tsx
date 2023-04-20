import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import LoadingBar from "~/components/LoadingBar";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import NotificationCard from "~/components/notifications/NotificationCard";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { api } from "~/utils/api";

const Notifications: NextPage = () => {

  const user = useSession().data?.user

  const notificationQuery = api.notifications.getNotificationsById.useQuery({ id: user?.id ?? "" })
  const notifications = notificationQuery.data


  if (notificationQuery.isLoading || !notifications) {
    return <LoadingBar />
  }

  return (
    <>

      <NavigationBarContent>
        <h1>Notifications </h1>
      </NavigationBarContent>
      <UtilButtonsContent>
        <></>
      </UtilButtonsContent>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-start h-full align-middle">
        {notifications?.length === 0 ? <p>No notifications received yet</p> :
          <div className="flex flex-col justify-start rounded-3xl align-middle p-10 my-5 bg-base-100">
            <h1 className="text-3xl font-bold">Notifications</h1>
            {notifications.map(n => {
              return (
                <>
                  <div className="w-full flex flex-wrap justify-center">
                    <NotificationCard notification={n} />
                  </div>
                </>
              )
            })}
          </div>
        }
      </main>
    </>
  );
};

export default Notifications;