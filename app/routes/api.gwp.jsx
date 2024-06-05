import { json } from "@remix-run/node";
import db from '../db.server';

export async function loader(){
    let appData = await db.appData.findFirst({ 
        include: {
            generalSettings: true,
            tier1: true,
            tier2: true,
            tier3: true
        }
    });

    return json(appData);  
}