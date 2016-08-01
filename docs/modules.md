# Modules
|          Endpoint          |                            Description                           |  Access Rights  |
|----------------------------|------------------------------------------------------------------|-----------------|
|      GET /api/modules      |    Get a list of all modules with basic information about each   |      User       |
|      POST /api/modules     |                          Add a new module                        |   Super Admin   |
|    GET /api/modules/:id    |       Get a specific module with basic information about it      |      User       |
|    PUT /api/modules/:id    |                      Update a specific module                    |    Moderator    |
|  DELETE /api/modules/:id   |                      Delete a specific module                    |   Super Admin   |
| GET /api/modules/:id/users |       Get a specific module with basic information about it      |      User       |

## `GET /api/modules`
Get a list of all modules with basic information about each.

### Access Rights
User

### Parameters required
| Request Property |  Name  |   Type   |           Description           |
|------------------|--------|----------|---------------------------------|
|     req.user     |  User  |  Object  |  Available after user logs in.  |

### Example response
```json
[{
  "name": "123",
  "users": [{
             "id": 127,
             "role": "Admin"
            }],
  "contributionTypes": ["123","wdqw"],
  "code": "123",
  "id": 126
 },
 {
  "name": "test",
  "users": [{
             "id": 112,
             "role": "Admin"
            },
            {
             "id": 87,
             "role": "Admin"
            }],
  "contributionTypes": ["test"],
  "code": "test",
  "id": 121
}]
```

## `POST /api/modules`
Add a new module.

### Access Rights
Super Admin

### Parameters required
|    Request Property     |            Name             |   Type   |                   Description                   |
|-------------------------|-----------------------------|----------|-------------------------------------------------|
|         req.user        |            User             |  Object  |          Available after user logs in.          |
|         req.name        |         Module Name         |  String  |         Name of the module to be added.         |
|         req.code        |         Module Code         |  String  |         Code of the module to be added.         |
|  req.contributionTypes  |  Module Contribution Types  |   Array  |  Contribution Types of the module to be added.  |

### Example response
```json
{
  "contributionTypes": ["test"],
  "code": "test",
  "name": "test",
  "id": 121
}
```

## `GET /api/modules/:id`
Get a specific module with basic information about it.

### Access Rights
User

### Parameters required
| Request Property |     Name    |   Type   |           Description           |
|------------------|-------------|----------|---------------------------------|
|     req.user     |     User    |  Object  |  Available after user logs in.  |
|  req.params.id   |  Module Id  |  String  |  ID of the module in database.  |

### Example response
```json
{
  "name": "test",
  "users": [{
             "id": 112,
             "role": "Admin"
            },
            {
             "id": 87,
             "role": "Admin"
            }],
  "contributionTypes": ["test"],
  "code": "test",
  "id": 121
}
```

## `PUT /api/modules/:id`
Update a specific module.

### Access Rights
Moderator

### Parameters required
|    Request Property     |            Name             |   Type   |                       Description                        |
|-------------------------|-----------------------------|----------|----------------------------------------------------------|
|         req.user        |            User             |  Object  |              Available after user logs in.               |
|         req.name        |         Module Name         |  String  |         Name of the module to be added.                  |
|         req.code        |         Module Code         |  String  |         Code of the module to be added.                  |
|  req.contributionTypes  |  Module Contribution Types  |   Array  |  Contribution Types of the module to be added.           |

### Example response
```json

```