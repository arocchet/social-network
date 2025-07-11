import { db } from "@/lib/db";

interface CreateEventInput {
  ownerId: string;
  groupId: string;
  title: string;
  description: string;
  datetime: string;

}

export async function createEvent(data: CreateEventInput) {
  const { ownerId, groupId, title, description,datetime } = data;

  const newEvent = await db.event.create({
    data: {
      title,
      description,
      datetime: new Date(datetime),
      groupId,
      ownerId
    },
  });

  return newEvent;
}
