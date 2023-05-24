import { env } from "~/env.mjs";
import * as msal from "@azure/msal-node";
import { type UserWCount, type AADResponseUsers, type User } from "~/types";
import { type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { getAllSessions } from "./sessionService";
import { prisma } from "../db";

const msalConfig = {
  auth: {
    clientId: env.AZURE_AD_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${env.AZURE_AD_TENANT_ID}/`,
    clientSecret: env.AZURE_AD_CLIENT_SECRET,
  },
};
const tokenRequest = {
  scopes: ["https://graph.microsoft.com/.default"],
};

type QueryMode = "default" | "insensitive";

const getToken = async () => {
  const authenticationResult: msal.AuthenticationResult | null =
    await new msal.ConfidentialClientApplication(
      msalConfig
    ).acquireTokenByClientCredential(tokenRequest);

  const accessToken = authenticationResult?.accessToken;

  if (!accessToken) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred, please try again later.",
    });
  }
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  return options;
};

export const findAllUsers = async (): Promise<User[]> => {
  const options = await getToken();
  let users: User[] = [];
  let url = "https://graph.microsoft.com/v1.0/users";
  while (url != undefined) {
    const result: AADResponseUsers = (await fetch(url, options).then((r) =>
      r.json()
    )) as AADResponseUsers;
    users = users.concat(result.value);
    url = result["@odata.nextLink"];
  }
  return users;
};

export const findUserById = async (id: string): Promise<User> => {
  const options = await getToken();
  const user: User = (await fetch(
    "https://graph.microsoft.com/v1.0/users/" + id,
    options
  ).then((r) => r.json())) as User;
  return user;
};

export const findUserByIds = async (ids: string[]): Promise<User[]> => {
  const userPromises = ids.map((id) => findUserById(id));
  const users = await Promise.all(userPromises);
  return users;
};

export const findUserByName = async (id: string): Promise<User | undefined> => {
  const users = await findAllUsers();
  return users.find((user) => user.displayName === id);
};

export const findUserByNameForSlack = async (name: string) => {
  let user = await prisma.user.findFirst({
    where: {
      name: {
        contains: name,
        mode: "insensitive",
      },
    },
  });
  if (!user?.id) {
    const names = name.split(" ").map((n) => {
      return {
        name: {
          contains: n,
          mode: "insensitive" as QueryMode,
        },
      };
    });

    user = await prisma.user.findFirst({
      where: {
        AND: names,
      },
    });
  }
  return user;
};

export const findRelevantUsers = async (ctx: {
  prisma: PrismaClient;
}): Promise<UserWCount[]> => {
  const users = await findAllUsers();
  const kudos = await ctx.prisma.kudo.findMany({});
  const sessions = await getAllSessions();

  const usersWcount = users.map((user) => {
    return {
      user: user,
      sessionCount:
        sessions?.filter((session) => session.speakerId.includes(user.id))
          .length ?? 0,
      sendKudoCount:
        kudos?.filter((kudo) => kudo.userId === user.id).length ?? 0,
    };
  });

  return usersWcount.filter(
    (user) => user.sessionCount > 0 || user.sendKudoCount > 0
  );
};

export const getImageById = async (id: string) => {
  if (!id) {
    return;
  }
  const options = await getToken();
  const imageRes = await fetch(
    "https://graph.microsoft.com/v1.0/users/" + id.toString() + "/photo/$value",
    options
  );
  return imageRes;
};
