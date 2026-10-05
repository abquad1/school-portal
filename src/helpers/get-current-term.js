import { prisma } from "../config/db.js";

export const getCurrentTerm = async () => {
  const sessionTerm = await prisma.sessionTerm.findFirst({
    where: { isCurrent: true },
  });

  if (!sessionTerm) {
    throw new Error("No current term found");
  }
  return sessionTerm;
};
