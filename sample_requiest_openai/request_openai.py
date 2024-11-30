import os
from openai import AzureOpenAI

# 環境変数からエンドポイントとキーを取得
endpoint = os.getenv("AOAI_ENDPOINT")
key = os.getenv("AOAI_KEY")
print(endpoint, key)

# クライアントの初期化
client = AzureOpenAI(azure_endpoint=endpoint, api_key=key, api_version="2024-07-01-preview")

# チャットの実行
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "こんにちは、元気ですか？"}
    ]
)

# 応答の表示
print(response.choices[0].message.content)