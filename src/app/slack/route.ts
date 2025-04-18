import { verifyRequest } from "@/server/slack";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
    const bodyStr = await verifyRequest(req);
    const body = JSON.parse(bodyStr);
    switch (body.type) {
        case "url_verification":
            return NextResponse.json({ challenge: body.challenge });
        case "event_callback":
            // Handle the event callback
            // You can use the body object to access the event data
            // For example, if you want to log the event type:
            console.log(`Event type: ${body.event.type}`);
            // You can also send a response back to Slack if needed
            return NextResponse.json({ status: 200 });
        default:
            console.error(`Unknown event type: ${body.type}`);
            return NextResponse.json({ status: 400 });
    }
}
