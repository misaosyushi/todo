# ToDo API

ToDoの登録, 更新, 削除, 検索を行います。

## API一覧

### `GET /todo`

#### Description

ToDo一覧を検索します

#### Request Header

| name | note |
| ---- | ---- |
| X-API-KEY | 必須 |


#### Request Query Parameters

| name | note | example |
| ---- | ---- | ---- |
| title | 検索したいToDoタイトルを設定します | title=本読む |

#### Request Body

なし

#### Response Body

| name | note |
| ---- | ---- |
| id | ID |
| title | タイトル |
| detail | 内容 |
| deadlineDate | 期限日 |
| status | ステータス(todo, inProgress, done) |

#### Example

```
curl --request GET \
  --url https://ecrkds1n2f.execute-api.ap-northeast-1.amazonaws.com/prod/todo \
  --header 'x-api-key: ${X-API-KEY}'
```

```
[
    {
        "detail": "fugafuga",
        "deadlineDate": "2020-11-26",
        "id": "ff6b0530-5212-4399-a318-0d8b0b88c7ac",
        "status": "todo",
        "title": "hoge"
    },
]
```

### `POST /todo`

#### Description

ToDoを作成します

#### Request Header

| name | note |
| ---- | ---- |
| X-API-KEY | 必須 |


#### Request Query Parameters

なし

#### Request Body

| name | note |
| ---- | ---- |
| title | タイトル |
| detail | 内容 |
| deadlineDate | 期限日 |
| status | ステータス(todo, inProgress, done) |

#### Response Body

なし

#### Example

```
curl --request POST \
  --url https://ecrkds1n2f.execute-api.ap-northeast-1.amazonaws.com/prod/todo \
  --header 'content-type: application/json' \
  --header 'x-api-key: ${X-API-KEY}' \
  --data '{\n    "detail": "fugafuga",\n    "deadlineDate": "2020-11-15",\n    "title": "hoge",\n    "status": "todo"\n}'
```


### `GET /todo/{id}`

#### Description

対象のToDoを取得します

#### Request Header

| name | note |
| ---- | ---- |
| X-API-KEY | 必須 |

#### Request Query Parameters

なし

#### Request Body

なし

#### Response Body

| name | note |
| ---- | ---- |
| id | ID |
| title | タイトル |
| detail | 内容 |
| deadlineDate | 期限日 |
| status | ステータス(todo, inProgress, done) |

#### Example

```
curl --request GET \
  --url https://ecrkds1n2f.execute-api.ap-northeast-1.amazonaws.com/prod/todo/1e2dcb85-bcd2-4712-b437-3263dedfa4ce \
  --header 'x-api-key: ${X-API-KEY}'
```

```
{
    "detail": "hogehoge",
    "deadlineDate": "2020-11-25",
    "id": "1e2dcb85-bcd2-4712-b437-3263dedfa4ce",
    "status": "done",
    "title": "hoge"
}
```

### `PUT /todo/{id}`

#### Description

対象のToDoを更新します

#### Request Header

| name | note |
| ---- | ---- |
| X-API-KEY | 必須 |

#### Request Query Parameters

なし

#### Request Body

| name | note |
| ---- | ---- |
| title | タイトル |
| detail | 内容 |
| deadlineDate | 期限日 |
| status | ステータス(todo, inProgress, done) |

#### Response Body

なし

#### Example

```
curl --request PUT \
  --url https://ecrkds1n2f.execute-api.ap-northeast-1.amazonaws.com/prod/todo/a89d60d4-48a3-4a84-8ed0-9f9c53bbd8e0 \
  --header 'content-type: application/json' \
  --header 'x-api-key: ${X-API-KEY}' \
  --data '{\n    "detail": "fugafuga",\n    "deadlineDate": "2020-11-15",\n    "title": "hoge",\n    "status": "todo"\n}'
```

### `DELETE /todo/{id}`

#### Description

対象のToDoを削除します

#### Request Header

| name | note |
| ---- | ---- |
| X-API-KEY | 必須 |

#### Request Query Parameters

なし

#### Request Body

なし

#### Response Body

なし

#### Example

```
curl --request DELETE \
  --url https://ecrkds1n2f.execute-api.ap-northeast-1.amazonaws.com/prod/todo/a89d60d4-48a3-4a84-8ed0-9f9c53bbd8e0 \
  --header 'x-api-key: ${X-API-KEY}'
```
