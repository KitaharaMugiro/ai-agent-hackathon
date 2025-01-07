import { NextResponse } from "next/server";
import { createGithubIssue } from "@/lib/Github";

export async function POST(req: Request) {
    try {
        const { title, body, labels } = await req.json();

        if (!title || !body) {
            return NextResponse.json(
                { error: "Title and body are required" },
                { status: 400 }
            );
        }

        const result = await createGithubIssue(title, body, labels);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error creating GitHub issue:", error);
        return NextResponse.json(
            { error: "Failed to create GitHub issue" },
            { status: 500 }
        );
    }
}
