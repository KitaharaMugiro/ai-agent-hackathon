"use server"
import { Octokit } from '@octokit/rest';

export async function createGithubIssue(title: string, body: string, labels: string[] = []) {
    try {
        const octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN
        });

        if (!process.env.GITHUB_OWNER || !process.env.GITHUB_REPO) {
            throw new Error('GitHub configuration is missing');
        }

        const normalizedLabels = Array.isArray(labels) ? labels : [];

        const response = await octokit.issues.create({
            owner: process.env.GITHUB_OWNER,
            repo: process.env.GITHUB_REPO,
            title: title,
            body: body,
            labels: normalizedLabels
        });

        return {
            success: true,
            issueNumber: response.data.number,
            issueUrl: response.data.html_url
        };

    } catch (error) {
        console.error('GitHub Issue作成エラー:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : '不明なエラー'
        };
    }
}
