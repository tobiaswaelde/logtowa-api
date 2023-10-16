# CloudLogger Backend

<!-- #region badges -->
[![Quality Gate Status](https://sq.srv.tobiaswaelde.com/api/project_badges/measure?project=tobiaswaelde_cloud-logger-backend_AYs1m5fJPhYnLbS8eM75&metric=alert_status&token=sqb_3d39e1d1780a89e4556a708c98085dad1933e598)](https://sq.srv.tobiaswaelde.com/dashboard?id=tobiaswaelde_cloud-logger-backend_AYs1m5fJPhYnLbS8eM75)
[![Maintainability Rating](https://sq.srv.tobiaswaelde.com/api/project_badges/measure?project=tobiaswaelde_cloud-logger-backend_AYs1m5fJPhYnLbS8eM75&metric=sqale_rating&token=sqb_3d39e1d1780a89e4556a708c98085dad1933e598)](https://sq.srv.tobiaswaelde.com/dashboard?id=tobiaswaelde_cloud-logger-backend_AYs1m5fJPhYnLbS8eM75)
[![Security Rating](https://sq.srv.tobiaswaelde.com/api/project_badges/measure?project=tobiaswaelde_cloud-logger-backend_AYs1m5fJPhYnLbS8eM75&metric=security_rating&token=sqb_3d39e1d1780a89e4556a708c98085dad1933e598)](https://sq.srv.tobiaswaelde.com/dashboard?id=tobiaswaelde_cloud-logger-backend_AYs1m5fJPhYnLbS8eM75)
[![Vulnerabilities](https://sq.srv.tobiaswaelde.com/api/project_badges/measure?project=tobiaswaelde_cloud-logger-backend_AYs1m5fJPhYnLbS8eM75&metric=vulnerabilities&token=sqb_3d39e1d1780a89e4556a708c98085dad1933e598)](https://sq.srv.tobiaswaelde.com/dashboard?id=tobiaswaelde_cloud-logger-backend_AYs1m5fJPhYnLbS8eM75)
[![Bugs](https://sq.srv.tobiaswaelde.com/api/project_badges/measure?project=tobiaswaelde_cloud-logger-backend_AYs1m5fJPhYnLbS8eM75&metric=bugs&token=sqb_3d39e1d1780a89e4556a708c98085dad1933e598)](https://sq.srv.tobiaswaelde.com/dashboard?id=tobiaswaelde_cloud-logger-backend_AYs1m5fJPhYnLbS8eM75)
[![Duplicated Lines (%)](https://sq.srv.tobiaswaelde.com/api/project_badges/measure?project=tobiaswaelde_cloud-logger-backend_AYs1m5fJPhYnLbS8eM75&metric=duplicated_lines_density&token=sqb_3d39e1d1780a89e4556a708c98085dad1933e598)](https://sq.srv.tobiaswaelde.com/dashboard?id=tobiaswaelde_cloud-logger-backend_AYs1m5fJPhYnLbS8eM75)
<!-- #endregion -->

> [!WARNING]  
> This project is still in development. It will be usable as soon as it reaches v1.x

This is the backend of the CloudLogger. It receives the log messages and provides the API for the frontend.

## Environment
| Variable     | Description                                                              | Required | Default Value |
| ------------ | ------------------------------------------------------------------------ | -------- | ------------- |
| PORT         | The API port                                                             | no       | 3001          |
| LOG_LEVEL    | Level for console logs                                                   | no       | warn          |
| DB_HOST      | Host of the database                                                     | yes      |               |
| DB_PORT      | Port of the database                                                     | yes      | 5432          |
| DB_NAME      | Name of the database                                                     | yes      | cloud-logger  |
| DB_USERNAME  | User                                                                     | yes      |               |
| DB_PASSWORD  | Password                                                                 | yes      |               |
| DB_SECURE    | Flag if database connection is secure                                    | no       | true          |
| DB_SYNC      | Flag if database should be synced with the models                        | no       | false         |
| SOCKET_TOKEN | Token to authenticate socket connections. Used by the winston transport. | yes      |               |
| AUTH_TOKEN   | Token to authenticate API requests. Used by the frontend.                | yes      |               |

<!-- |              |                                                                          |          |               | -->