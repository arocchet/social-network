import { updatedReaction } from "@/lib/db/queries/reaction/updatedReaction";
import { CreateReaction, ReactionSchemas } from "@/lib/schemas/reaction";
import { respondError, respondSuccess } from "@/lib/server/api/response";
import { parseOrThrow, ValidationError } from "@/lib/utils/validation";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json(respondError("Invalid user ID"), { status: 401 });
  }

  let parsedData: CreateReaction;
  try {
    parsedData = parseOrThrow(ReactionSchemas.Create, await req.json());
    console.log("✅ Parsed reaction data:", parsedData);
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        respondError("Invalid body", error.fieldErrors),
        { status: 400 }
      );
    }
    return NextResponse.json(
      respondError(
        error instanceof Error ? error.message : "Unexpected server error."
      ),
      { status: 500 }
    );
  }

  try {
    await updatedReaction(userId, parsedData);

    return NextResponse.json(respondSuccess(null), { status: 200 });
  } catch (error) {
    console.error("❌ Failed to updated reaction:", error);

    return NextResponse.json(
      respondError(
        error instanceof Error ? error.message : "Unexpected server error."
      ),
      { status: 500 }
    );
  }
}
