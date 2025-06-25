// app/api/private/stories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllStoriesGrouped, getStoriesByUserId } from '@/lib/server/stories/getStories';
import { parseCreateStory } from '@/lib/validations/parseFormData/storyValidation';
import { StorySchema } from '@/lib/validations/createStorySchemaZod';
import { createStoriesServer } from '@/lib/server/stories/createStories';

export async function GET(req: NextRequest) {
    try {
        const currentUserId = req.headers.get("x-user-id");

        if (!currentUserId) {
            return NextResponse.json({ message: "Invalid user ID." }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const publicOnly = searchParams.get('publicOnly') === 'true';

        let storiesData;

        if (userId) {
            // Récupérer les stories d'un utilisateur spécifique
            storiesData = await getStoriesByUserId(userId);



            return NextResponse.json({
                success: true,
                data: [{
                    user: storiesData[0]?.user || null,
                    stories: storiesData,
                    hasUnviewed: true
                }]
            }, { status: 200 });
        } else {
            // Récupérer toutes les stories groupées par utilisateur
            const storiesGroups = await getAllStoriesGrouped(currentUserId, publicOnly);

            return NextResponse.json({
                success: true,
                data: storiesGroups
            }, { status: 200 });
        }

    } catch (error) {
        console.error("Failed to fetch stories:", error);

        const message = error instanceof Error ? error.message : "Unknown server error.";
        return NextResponse.json({ message }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    try {
        const userId = req.headers.get("x-user-id");

        if (!userId) {
            return NextResponse.json({ message: "Invalid user ID." }, { status: 401 });
        }

        const formData = await req.formData();
        const story = parseCreateStory(formData);

        const parsed = StorySchema.safeParse(story);

        if (!parsed.success) {
            const errors = parsed.error.flatten().fieldErrors;
            return NextResponse.json(
                { message: "Validation failed", errors },
                { status: 400 }
            );
        }

        await createStoriesServer(story, userId);

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error("Post creation failed:", error);

        const message =
            error instanceof Error ? error.message : "Unknown server error.";

        return NextResponse.json({ message }, { status: 500 });
    }
}
