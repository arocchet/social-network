import { db } from "../..";

interface RequestInput{
  groupId : string,
  seeker : string,
}

export async function sendRequestToJoinGroup(data : RequestInput) {

  const {groupId, seeker} = data;

  if (!groupId || !seeker) {
    throw new Error("Missing groupId or seeker");
  }

  const existingConversation = await db.conversation.findUnique({
    where: {
      id: groupId,
    },
  });

  if (!existingConversation) {
    throw new Error("Group not found");
  }

  const existingRequest = await db.groupJoinRequest.findUnique({
    where: {
      groupId_seeker: {
        groupId,
        seeker,
      },
    },
  });

  if (existingRequest) {
    throw new Error("Request already exists");
  }

  const requestCreated = await db.groupJoinRequest.create({
    data: {
      groupId,
      seeker,
      status: "PENDING",
    },
  });

  return requestCreated;
}
