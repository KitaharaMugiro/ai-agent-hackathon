# 受付対応エージェント
## プロンプト
```

```


## Tool
### Gemini検索
URL: https://ai-agent-hackathon.vercel.app/api/search
概要: ユーザーの質問を受け取り、Geminiを使用して関連する情報を検索して返す。

```
openapi: 3.1.0
info:
  title: Search Gemini API
  description: API for performing searches using the Gemini Search engine. Accepts a query string and provides summarized search results.
  version: 1.0.0
servers:
  - url: https://ai-agent-hackathon.vercel.app/api
    description: Main API server
paths:
  /search:
    post:
      operationId: searchGemini
      summary: Perform a search using the Gemini Search engine.
      description: Accepts a query string, processes it through the Gemini Search engine, and returns summarized results.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                query:
                  type: string
                  description: The search query string.
              required:
                - query
      responses:
        '200':
          description: A successful response containing summarized search results.
          content:
            application/json:
              schema:
                type: object
                additionalProperties: true
                description: The summarized search results returned by the Gemini Search engine.
        '400':
          description: Bad Request. Query is missing or invalid.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    description: Error message describing the issue.
        '500':
          description: Internal Server Error. Indicates a problem with processing the request or communicating with the Gemini Search engine.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    description: Error message describing the issue.

```

## 事後処理
URL: /api/process_conversation
概要: ユーザーの質問を受け取り、Geminiを使用して関連する情報を検索して返す。


