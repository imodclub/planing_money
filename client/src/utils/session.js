// src/utils/session.js

import Cookies from 'js-cookie'; // นำเข้า default ของ js-cookie
import { kv } from '@vercel/kv';

export function getSessionId() {
    return Cookies.get('session-id');
}

export function setSessionId(sessionId) {
    Cookies.set('session-id', sessionId);
}

export function getSessionIdAndCreateIfMissing() {
    let sessionId = getSessionId();
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        setSessionId(sessionId);
    }
    return sessionId;
}

export async function set(key, value) {
    const sessionId = getSessionIdAndCreateIfMissing();
    await kv.hset(`session-${sessionId}`, { [key]: value });
}

export async function get(key) {
    const sessionId = getSessionId();
    if (!sessionId) {
        return null;
    }
    return await kv.hget(`session-${sessionId}`, key);
}