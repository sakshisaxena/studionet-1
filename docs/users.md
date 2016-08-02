# Users
|       Endpoint        |                         Description                         | Access Rights |
|-----------------------|-------------------------------------------------------------|---------------|
|    GET /api/users     |  Get a list of all users with basic information about each  |  Super Admin  |
|    POST /api/users    |                        Add a new user                       |  Super Admin  |
|  GET /api/users/:id   |                     Get a specific user                     |  Super Admin  |
|  PUT /api/users/:id   |                    Update a specific user                   |  Super Admin  |
| DELETE /api/users/:id |                    Delete a specific user                   |  Super Admin  |


## `GET /api/users`
Get a list of all users with basic information about each.

### Access Rights
Super Admin

### Parameters required
| Request Property |  Name  |   Type   |           Description           |
|------------------|--------|----------|---------------------------------|
|     req.user     |  User  |  Object  |  Available after user logs in.  |

### Example response
```json

```