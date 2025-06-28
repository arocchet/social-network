export async function storiesReaction(data: Record<string, any>) {
  try {
    const reponse = await fetch("api/private/reaction", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(data),
    });

    return reponse;
  } catch (error) {
    if (error instanceof Error)
      throw new Error("failed to update reaction: ", error);
    else console.log(error);
  }
}
