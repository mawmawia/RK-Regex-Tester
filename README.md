# RK Regex Tester API

Test regex patterns against strings. Returns matches, indexes, and capture groups.

**Free tier: 100,000 requests/month.** No credit card.

## Endpoint

`GET /api/test`

### Query Parameters
| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `pattern` | string | Yes | Regex pattern without slashes |
| `flags` | string | No | Regex flags: g, i, m, s, u, y |
| `test` | string | Yes | String to test against |

### Example Request
