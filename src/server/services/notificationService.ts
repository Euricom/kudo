import { type PrismaClient } from "@prisma/client";
import { adminList } from "../auth";

export const sendnotification = async (
  prisma: PrismaClient,
  message: string,
  link: string,
  userid: string,
  photo: string
) => {
  await prisma.notification.create({
    data: {
      message: message,
      link: link,
      userId: userid,
      photo: photo,
    },
  });
};

export const sendnotificationsToAdmins = (
  prisma: PrismaClient,
  message: string,
  link: string,
  photo: string
) => {
  const admins = adminList;
  admins.map(async (admin) => {
    await prisma.notification.create({
      data: {
        message: message,
        userId: admin,
        link: link,
        photo: photo,
      },
    });
  });
};
