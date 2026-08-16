# このリポジトリについて
ITエンジニアであるユーザーが自らのポートフォリオサイトを構築するためのリポジトリです。
その最も重要な価値は以下のような人々に私に対する印象を与えつことです。

- **採用担当・面接官**: 「この人は指示なしで設計判断ができるか?」→ ADRとトレードオフの記述で回答
- **顧客**: 「うちの課題を解決してくれそうか? 費用感が分かるか?」→ シナリオ設定とコスト試算で回答
- **同業者・コミュニティ**: 「読む価値のある知見があるか?」→ Azure×GCP比較と設計ノートで回答。QiitaやX等での発信導線をサイトに付ける

## コンセプト
「作品集」ではなく「アーキテクチャカタログ」
1. **同一テーマの Azure / GCP 比較** — 「同じ要件をAzureとGCPでどう組むか、なぜサービス選定が変わるか」を語れる人は少ない。これを看板コンテンツにする
2. **各アーキテクチャを「ケーススタディ」形式で見せる** — 課題設定 → 設計判断 → 構成図 → コスト → コード。採用担当には設計力、顧客には課題解決力として同時に刺さる
3. **サイト自体がポートフォリオ** — サイトのインフラをTerraform + CI/CDで構築し、その構成図と仕組みも1つの作品として公開する(メタ的な最強のアピール)


## 対象リポジトリ・サイト
リポジトリ：[azure-learning](https://github.com/MasanaoAsato/azure-learning) / [google-cloud-learning](https://github.com/MasanaoAsato/google-cloud-learning)

GitHub: https://github.com/MasanaoAsato

Qiita: https://qiita.com/masa-asa

## フォルダについての補足
設計関連の資料を .design フォルダに格納しています。参照してください。

## コードについて
DRY原則に従う
コンテンツは再利用可能な形式に、追加削除、メンテナンスのしやすさを重要視する

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

For Astro-related implementation and review, use the project-local `astro-docs`
MCP server first so guidance is based on the current official documentation.

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

RTKが利用できる場合は、lean-ctxよりRTKを優先する

@RTK.md
