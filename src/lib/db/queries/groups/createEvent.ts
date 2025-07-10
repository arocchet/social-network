import {db} from "@/lib/db";


export async function createEvent(eventOwner:string, groupId:string, title : string, description:string){
   
    const newEvent = await db.groupEvent.create({
        data : {
            eventOwner : eventOwner,
            groupId : groupId,
            title : title,
            description : description,
        }
    });
}