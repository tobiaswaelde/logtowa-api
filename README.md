# LogTowa Backend

<!-- #region badges -->
[![Quality Gate Status](https://sq.srv.tobiaswaelde.com/api/project_badges/measure?project=tobiaswaelde_cloud-logger-backend_AYs1m5fJPhYnLbS8eM75&metric=alert_status&token=sqb_3d39e1d1780a89e4556a708c98085dad1933e598)](https://sq.srv.tobiaswaelde.com/dashboard?id=tobiaswaelde_cloud-logger-backend_AYs1m5fJPhYnLbS8eM75)
[![Maintainability Rating](https://sq.srv.tobiaswaelde.com/api/project_badges/measure?project=tobiaswaelde_cloud-logger-backend_AYs1m5fJPhYnLbS8eM75&metric=sqale_rating&token=sqb_3d39e1d1780a89e4556a708c98085dad1933e598)](https://sq.srv.tobiaswaelde.com/dashboard?id=tobiaswaelde_cloud-logger-backend_AYs1m5fJPhYnLbS8eM75)
[![Security Rating](https://sq.srv.tobiaswaelde.com/api/project_badges/measure?project=tobiaswaelde_cloud-logger-backend_AYs1m5fJPhYnLbS8eM75&metric=security_rating&token=sqb_3d39e1d1780a89e4556a708c98085dad1933e598)](https://sq.srv.tobiaswaelde.com/dashboard?id=tobiaswaelde_cloud-logger-backend_AYs1m5fJPhYnLbS8eM75)
[![Vulnerabilities](https://sq.srv.tobiaswaelde.com/api/project_badges/measure?project=tobiaswaelde_cloud-logger-backend_AYs1m5fJPhYnLbS8eM75&metric=vulnerabilities&token=sqb_3d39e1d1780a89e4556a708c98085dad1933e598)](https://sq.srv.tobiaswaelde.com/dashboard?id=tobiaswaelde_cloud-logger-backend_AYs1m5fJPhYnLbS8eM75)
[![Bugs](https://sq.srv.tobiaswaelde.com/api/project_badges/measure?project=tobiaswaelde_cloud-logger-backend_AYs1m5fJPhYnLbS8eM75&metric=bugs&token=sqb_3d39e1d1780a89e4556a708c98085dad1933e598)](https://sq.srv.tobiaswaelde.com/dashboard?id=tobiaswaelde_cloud-logger-backend_AYs1m5fJPhYnLbS8eM75)
[![Duplicated Lines (%)](https://sq.srv.tobiaswaelde.com/api/project_badges/measure?project=tobiaswaelde_cloud-logger-backend_AYs1m5fJPhYnLbS8eM75&metric=duplicated_lines_density&token=sqb_3d39e1d1780a89e4556a708c98085dad1933e598)](https://sq.srv.tobiaswaelde.com/dashboard?id=tobiaswaelde_cloud-logger-backend_AYs1m5fJPhYnLbS8eM75)
<!-- #endregion -->

This is the LogTowa backend. It receives the log messages and provides the API for the frontend.

## Installation
### Docker
```yml
# docker-compose.yml
version: '3.9'

services:
  db:
    container_name: logtowa-db
    image: post
    restart: always
    ports:
      - '5432:5432'
    volumes:
      - ./data:/var/lib/postgresql/data/pgdata
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: logtowa
      PGDATA: /var/lib/postgresql/data/pgdata

  logtowa-api:
    container_name: logtowa-api
    image: tobiaswaelde/logtowa-app:latest
    restart: always
    ports:
      - '3001:3001'
    environment:
      PORT: 3001 # optional
      LOG_LEVEL: warn # optional
      DB_HOST: db
      DB_PORT: 5432
      DB_NAME: logtowa
      DB_USERNAME: root
      DB_PASSWORD: secret
      DB_SECURE: true # optional
      DB_SYNC: false # optional
      SOCKET_TOKEN: secret
      AUTH_TOKEN: secret
      RETENTION_ENABLED: true # optional
      RETENTION_CRON: '0 0 * * *' # optional
```

## Environment
| Variable          | Description                                                              | Required | Default Value |
| ----------------- | ------------------------------------------------------------------------ | -------- | ------------- |
| PORT              | The API port                                                             | no       | 3001          |
| LOG_LEVEL         | Level for console logs                                                   | no       | warn          |
| DB_HOST           | Host of the database                                                     | yes      |               |
| DB_PORT           | Port of the database                                                     | yes      | 5432          |
| DB_NAME           | Name of the database                                                     | yes      | logtowa       |
| DB_USERNAME       | User                                                                     | yes      |               |
| DB_PASSWORD       | Password                                                                 | yes      |               |
| DB_SECURE         | Flag if database connection is secure                                    | no       | true          |
| DB_SYNC           | Flag if database should be synced with the models                        | no       | false         |
| SOCKET_TOKEN      | Token to authenticate socket connections. Used by the winston transport. | yes      |               |
| AUTH_TOKEN        | Token to authenticate API requests. Used by the frontend.                | yes      |               |
| RETENTION_ENABLED | Flag if log retention is enabled                                         | no       | true          |
| RETENTION_CRON    | CRON schedule for log retention                                          | no       | '0 0 * * *'   |

<!-- |              |                                                                          |          |               | -->