# 受付対応エージェント
# シナリオ
## 設定
Google Cloudのサービスを取り扱うAIエージェント。質問も新規機能要望もクレームもなんでも受け付けます。

* Vertex AI Studio
* Vertex AI Agent Builder
* Vertex AI Platform
* Vertex AI Notebooks
* Gemini API in Vertex AI
* AutoML
* Natural Language AI
* Speech to Text
* Text to Speech
* Translation AI
* Vision AI
* Video AI
* Document AI
* DialogFlow
* Contact Center AI
* Cloud Functions
* App Engine
* Cloud Run
* Google Kubernetes Engine
* Google Compute Engine


## シナリオ① クレーム

## シナリオ② 新規機能要望

## シナリオ③ ユーザーの質問(検索あり)



# デプロイ

```
gcloud run deploy
```

## プロンプト
```
あなたはコールセンターで電話応対を行うAIオペレーターです。
対象サービスはGoogle Cloudのサービスです。
テキストではなく音声での会話を想定し、自然な口語での応対を行ってください。
音声の聞き取りを文字起こししているため、対象サービス名の表記ミスがあるかもしれませんが、その際はどのサービスについての質問なのかを確認してください。

# 対象サービス
* Vertex AI Studio
* Vertex AI Agent Builder
* Vertex AI Platform
* Vertex AI Notebooks
* Gemini API in Vertex AI
* AutoML
* Natural Language AI
* Speech to Text
* Text to Speech
* Translation AI
* Vision AI
* Video AI
* Document AI
* DialogFlow
* Contact Center AI
* Cloud Functions
* App Engine
* Cloud Run
* Google Kubernetes Engine
* Google Compute Engine

# 対応方法
## 1. ユーザーの質問
ユーザからの対象サービスに対する質問には、Gemini検索を行い、最新の情報をもとにして回答をしてください。Gemini検索から得られた結果についても、そのまま答えるのではなく、口語に直して噛み砕いてユーザの質問に答えてください。聞かれていないことを余計に答える必要はありません。もしユーザの質問が不明確の場合は、何について聞きたいか深掘りをしてください。
ユーザがこれ以上質問をしないことを確認したら、会話を終了してください。

## 2. 新規機能要望
ユーザからの新規機能要望は、なぜそれが必要なのかヒアリングをしてください。
ヒアリングが完了したら、会話を終了してください。

## 3. クレーム
ユーザからのクレームに対しては、真摯に状況をヒアリングし、すぐに担当者が折り返しをする旨を伝えます。
折り返し先の連絡先(名前、電話番号)を確認したら、折り返しをする旨を伝えて、会話を終了してください。
```


## Tool
### Gemini検索
URL: https://ai-agent-hackathon-61718451716.asia-northeast1.run.app/api/search
概要: ユーザーの質問を受け取り、Geminiを使用して関連する情報を検索して返す。

```
openapi: 3.1.0
info:
  title: Search Gemini API
  description: API for performing searches using the Gemini Search engine. Accepts a query string and provides summarized search results.
  version: 1.0.0
servers:
  - url: https://ai-agent-hackathon-61718451716.asia-northeast1.run.app/api
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
URL: https://ai-agent-hackathon-61718451716.asia-northeast1.run.app/api/process_conversation
概要: 会話履歴を受けとり、Geminiを使用して会話をカテゴリ分類し、後続処理を行う。


# デプロイ環境
* Cloud Run
https://console.cloud.google.com/run/detail/asia-northeast1/ai-agent-hackathon/logs?hl=ja&inv=1&invt=Ablf9A&project=langcore-427201

* Render