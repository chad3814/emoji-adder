import { App } from '@slack/bolt';
import { NextRequest } from 'next/server';

let app: App | null = null;
export function getApp() {
    if (!app) {
        app = new App({
            clientId: process.env.SLACK_CLIENT_ID, // Client ID from environment
            clientSecret: process.env.SLACK_CLIENT_SECRET, // Client secret from environment
            signingSecret: process.env.SLACK_SIGNING_SECRET, // Signing secret from environment
        });
    }
    return app;
}

export async function verifyRequest(req: NextRequest): Promise<string> {
    // Extract the request body and headers
    const body = await req.text();
    const headers = Object.fromEntries(req.headers.entries());

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        enc.encode(process.env.SLACK_SIGNING_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify'],
    );
    const [version, signature] = headers['x-slack-signature'].split('=');
    if (version !== 'v0') {
        throw new Error('Invalid signature version');
    }
    const timestamp = headers['x-slack-request-timestamp'];
    const isValid = await crypto.subtle.verify(
        { name: 'HMAC', hash: 'SHA-256' },
        key,
        enc.encode(signature),
        enc.encode(`${version}:${timestamp}:${body}`),
    );
    if (!isValid) {
        throw new Error('Invalid signature');
    }
    return body;
}
