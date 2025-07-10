import {createEvent} from "@/lib/db/queries/groups/createEvent
import { respondError,respondSuccess } from '@/lib/server/api/response';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest, {params} : {params: {id: string} }){
    try{

        const eventOwner = req.headers.get("x-user-id");
        const {id : groupId } = params;
        const {description} = await req.json();

        if ( !groupId){
            return NextResponse.json(respondError("Missing or invalid "), {status : 401})
        }

        if(!eventOwner){
            return NextResponse.json(respondError("Missing event owner ID"),{status:400})
        }

        const event= await createEvent(eventOwner, groupId,description);
''
        return NextResponse.json(respondSuccess(event, "Event has created"), {status : 401 })
    }catch(error:any){
        return NextResponse.json(respondError(error.message || "Server error"), { status: 500 });
    }
}
)