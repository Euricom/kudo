import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import LoadingBar from "~/components/LoadingBar";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import NotificationCard from "~/components/notifications/NotificationCard";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { api } from "~/utils/api";

const Notifications: NextPage = () => {

  const trpcContext = api.useContext();
  const user = useSession().data?.user

  const notificationQuery = api.notifications.getNotificationsById.useQuery({ id: user?.id ?? "" })
  const notifications = notificationQuery.data
  const readAllNotifications = api.notifications.readAllNotifications.useMutation({
    onMutate: async (newEntry) => {
      await trpcContext.notifications.getNotificationsById.cancel();
      trpcContext.notifications.getNotificationsById.setData({ id: user?.id ?? "" }, (prevEntries) => {
        const entry = prevEntries?.find(
          (entry) => entry.id === newEntry.id
        );
        if (entry) {
          entry.read = true;
        }
        return prevEntries;
      });
    },
    onSettled: async () => {
      await trpcContext.notifications.getNotificationsById.invalidate();
    },
  });

  if (notificationQuery.isLoading || !notifications) {
    return <LoadingBar />
  }

  const sortedNotifications = () => {
    return notifications.sort((a, b) => a.time < b.time ? 1 : -1)
  }

  async function handleReadAll() {
    await readAllNotifications.mutateAsync({ id: user?.id ?? "" })
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
        {sortedNotifications()?.length === 0 ? <p>No notifications received yet</p> :
          <div className="flex flex-col justify-start rounded-3xl align-middle p-10 my-5 bg-base-100">
            <div className="flex flex-row justify-evenly">
              <h1 className="text-3xl font-bold">Notifications</h1>
              <div className="btn btn-ghost text-lg" onClick={() => void handleReadAll()}>Read all</div>
            </div>
            {sortedNotifications().map(n => {
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