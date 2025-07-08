import { fetcher } from "@/lib/server/api/fetcher";

export async function updatedReaction(data: Record<string, any>) {
  try {
    const reponse = await fetcher<void>("api/private/reaction", {
      method: "PUT",
      body: data,
    });
    console.log("data", data);
    return reponse;
  } catch (error) {
    if (error instanceof Error)
      throw new Error("failed to update reaction: ", error);
    else console.log(error);
  }
}
