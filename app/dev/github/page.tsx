"use client"
import { useState } from "react"
import { createGithubIssue } from "@/lib/Github"

export default function GithubIssuePage() {
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [labels, setLabels] = useState("")
    const [result, setResult] = useState<any>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const labelArray = labels.split(",").map(label => label.trim()).filter(label => label !== "")
        const response = await createGithubIssue(title, body, labelArray)
        setResult(response)
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create GitHub Issue</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2">Body:</label>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="w-full p-2 border rounded h-32"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2">Labels (comma-separated):</label>
                    <input
                        type="text"
                        value={labels}
                        onChange={(e) => setLabels(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="bug, enhancement, documentation"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Create Issue
                </button>
            </form>

            {result && (
                <div className="mt-4 p-4 border rounded">
                    <h2 className="text-xl font-bold mb-2">Result:</h2>
                    {result.success ? (
                        <div className="text-green-600">
                            <p>Issue created successfully!</p>
                            <p>Issue number: {result.issueNumber}</p>
                            <a
                                href={result.issueUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                View Issue
                            </a>
                        </div>
                    ) : (
                        <div className="text-red-600">
                            <p>Error creating issue:</p>
                            <p>{result.error}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
