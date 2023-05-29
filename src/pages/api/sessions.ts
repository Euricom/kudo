import { type NextApiRequest, type NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const now = new Date();

  res.status(200).json([
    {
      id: "a",
      title: "Designing with Figma",
      date: new Date(2023, now.getMonth(), now.getDay(), 5, 0),
      speakerId: ["cdb23f58-65db-4b6b-b132-cf2d13d08e76"],
    },
    {
      id: "b",
      title: "React hooks",
      date: new Date(2023, now.getMonth(), now.getDay(), 5, 0),
      speakerId: ["5e1378cf-21d2-425d-97f2-f5cf91d9c0c2"],
    },
    // {
    //   id: "c",
    //   title: "UX/UI",
    //   date: new Date("2023-05-26T11:20:00"),
    //   speakerId: ["18d332af-2d5b-49e5-8c42-9168b3910f97"],
    // },
    // {
    //   id: "z",
    //   title: "Andere",
    //   date: new Date("2023-05-26T14:00:00"),
    //   speakerId: ["18d332af-2d5b-49e5-8c42-9168b3910f97"],
    // },
    {
      id: "d",
      title: "Typescript 5.0",
      date: new Date("02/18/2023"),
      speakerId: ["e1db4a6b-a5ac-40c8-83da-f3492b0f92db"],
    },
    {
      id: "e",
      title:
        "Everything you need to know about React Everything you need to know about React",
      date: new Date("01/16/2023"),
      speakerId: ["5e1378cf-21d2-425d-97f2-f5cf91d9c0c2"],
    },
    {
      id: "f",
      title: "Prisma, the connection to your database",
      date: new Date("02/02/2023"),
      speakerId: ["5e1378cf-21d2-425d-97f2-f5cf91d9c0c2"],
    },
    {
      id: "g",
      title: "Design survey results",
      date: new Date("01/21/2023"),
      speakerId: ["cdb23f58-65db-4b6b-b132-cf2d13d08e76"],
    },
    // {
    //   id: "h",
    //   title: "DevOps",
    //   date: new Date("01/18/2023"),
    //   speakerId: ["18d332af-2d5b-49e5-8c42-9168b3910f97"],
    // },
    {
      id: "i",
      title: "Next.js, the future",
      date: new Date("01/02/2023"),
      speakerId: ["5e1378cf-21d2-425d-97f2-f5cf91d9c0c2"],
    },
    // {
    //   id: "j",
    //   title: "NoSQL, the future of your database",
    //   date: new Date("12/23/2022"),
    //   speakerId: ["18d332af-2d5b-49e5-8c42-9168b3910f97"],
    // },
    {
      id: "k",
      title: "Java, is it still relevant",
      date: new Date("11/20/2022"),
      speakerId: ["a2e96214-3829-4abd-b98f-7bdd6d4f59b9"],
    },
    // {
    //   id: "l",
    //   title: "Comparison: Javascript or C#",
    //   date: new Date("11/7/2022"),
    //   speakerId: ["18d332af-2d5b-49e5-8c42-9168b3910f97"],
    // },
    // {
    //   id: "m",
    //   title: "Angular",
    //   date: new Date("11/1/2022"),
    //   speakerId: ["18d332af-2d5b-49e5-8c42-9168b3910f97"],
    // },
    {
      id: "p",
      title: "Agile vs Scrum",
      date: new Date("9/8/2022"),
      speakerId: ["63061de7-0a1f-471f-b9bd-5db02536157b"],
    },
    {
      id: "t",
      title: "Learn more about th core of Javascript",
      date: new Date("12/05/2022"),
      speakerId: ["e1db4a6b-a5ac-40c8-83da-f3492b0f92db"],
    },
  ]);
}
