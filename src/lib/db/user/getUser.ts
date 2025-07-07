import { db } from "@/lib/db";

type Params = {
  userId: string;
};

export async function getUser(params: Params) {
  try {
    const user = await db.user.findFirst({
     where: {
        id: params.userId,
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        banner: true,
        biography: true,
        lastName: true,
        birthDate: true,
        firstName: true,
        visibility: true,
      },
    });

    return user;
  } catch (err) {
    console.error("Error creating friendship:", err);
    throw new Error(
      err instanceof Error ? err.message : "Unexpected server error"
    );
  }
}
