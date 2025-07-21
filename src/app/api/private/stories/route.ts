import { NextRequest, NextResponse } from "next/server";
import {
  getAllStoriesGrouped,
  getStoriesByUserId,
} from "@/lib/server/stories/getStories";
import { createStoriesServer } from "@/lib/server/stories/createStories";
import { CreateStory, StorySchemas } from "@/lib/schemas/stories";
import { respondError, respondSuccess } from "@/lib/server/api/response";
import { parseOrThrow, ValidationError } from "@/lib/utils/validation";
import { parseCreateStory } from "@/lib/parsers/formParsers";

export async function GET(req: NextRequest) {
  try {
    const currentUserId = req.headers.get("x-user-id");

    if (!currentUserId) {
      return NextResponse.json(
        { message: "Invalid user ID." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const publicOnly = searchParams.get("publicOnly") === "true";

    console.log("🔍 userId param:", userId);
    console.log("🔍 currentUserId:", currentUserId);
    console.log(
      "🔍 Will use branch:",
      userId ? "getStoriesByUserId" : "getAllStoriesGrouped"
    );

    let storiesData;

    if (userId) {
      const rawStories = await getStoriesByUserId(userId);
      console.log("🔍 Raw story _count:", rawStories[0]?._count);
      console.log(
        "🔍 Raw story reactions length:",
        rawStories[0]?.reactions?.length
      );
      const mappedStories = rawStories.map((story) => ({
        ...story,
        likesCount: story._count.reactions,
      }));

      console.log("🔍 Mapped story likesCount:", mappedStories[0]?.likesCount);

      return NextResponse.json(
        respondSuccess([
          {
            user: mappedStories[0]?.user || null,
            stories: mappedStories,
            hasUnviewed: true,
          },
        ]),
        { status: 200 }
      );
    } else {
      console.log("🔍 Using getAllStoriesGrouped branch");
      const rawStoriesGroups = await getAllStoriesGrouped(
        currentUserId,
        publicOnly
      );

      const mappedStoriesGroups = rawStoriesGroups.map((userGroup) => ({
        ...userGroup,
        stories: userGroup.stories.map((story: any) => ({
          ...story,
          likesCount: story._count.reactions,
        })),
      }));
      console.log(
        "🔍 Mapped stories groups first story likesCount:",
        mappedStoriesGroups[0]?.stories[0]?.likesCount
      );

      return NextResponse.json(respondSuccess(mappedStoriesGroups), {
        status: 200,
      });
    }
  } catch (error) {
    console.error("Failed to fetch stories:", error);

    const message =
      error instanceof Error ? error.message : "Unknown server error.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(respondError("Invalid user ID"), {
        status: 401,
      });
    }

    let parsedData: CreateStory;
    try {
      parsedData = parseOrThrow(
        StorySchemas.Create,
        parseCreateStory(await req.formData())
      );
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

    await createStoriesServer(parsedData, userId);

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
