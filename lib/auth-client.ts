"use client";

import { createAuthClient } from "better-auth/react";

const betterAuthClient = createAuthClient();

type AuthRequest = {
	name?: string;
	email: string;
	password: string;
};

async function postAuthRequest(path: string, body: AuthRequest) {
	const response = await fetch(path, {
		method: "POST",
		headers: { "content-type": "application/json" },
		credentials: "same-origin",
		body: JSON.stringify(body),
	});

	return {
		error: response.ok ? null : { status: response.status },
	};
}

export const authClient = {
	register: (body: AuthRequest & { name: string }) =>
		postAuthRequest("/api/auth/register", body),
	login: (body: AuthRequest) => postAuthRequest("/api/auth/login", body),
	signOut: () => betterAuthClient.signOut(),
};