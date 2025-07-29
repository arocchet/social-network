import { deleteReaction } from "@/lib/db/queries/reaction/deleteReaction";
import { respondError, respondSuccess } from "@/lib/server/api/response";
import { ValidationError } from "@/lib/utils/validation";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const userId = req.headers.get("x-user-id");
        const { id } = await params;

        if (!userId) {
            return NextResponse.json(respondError("Missing or invalid user ID"), { status: 401 });
        }

        if (!id) {
            return NextResponse.json(respondError("Content Id is required"), { status: 400 });
        }


        await deleteReaction(id, userId)

        return NextResponse.json(respondSuccess(null), { status: 200 });
    } catch (error) {
        console.error("❌ Failed to delete reaction:", error);

        if (error instanceof ValidationError) {
            return NextResponse.json(
                respondError("Validation failed", error.fieldErrors),
                { status: 400 }
            );
        }

        const message =
            error instanceof Error ? error.message : "Unknown server error.";

        return NextResponse.json(respondError(message), { status: 500 });
    }
}
