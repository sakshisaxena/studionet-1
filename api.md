# API Documentation

### Routes List
|      Route      |      Resource     | 
| --------------  | ----------------- | 
|   /api/profile  |    User Profile   |
|   /api/modules  |      Modules      | 
|    /api/users   |       Users       |
| /api/moderators |     Moderators    |
|     /uploads    |      Uploads      |

### User Profile
|          Endpoint          |                   Description                  |  Access Rights  |
|----------------------------|------------------------------------------------|-----------------|
|    GET /api/profile/user   |    Retrieves the current user's information    |      User       |
|  GET /api/profile/modules  |  Retrieves all modules the current user is in  |      User       |

# User Profile
|          Endpoint          |                   Description                  |  Access Rights  |
|----------------------------|------------------------------------------------|-----------------|
|    GET /api/profile/user   |    Retrieves the current user's information    |      User       |
|  GET /api/profile/modules  |  Retrieves all modules the current user is in  |      User       |

## `GET /api/profile/user`
Retrieves the current user's information.

### Parameters required
| Request Property |  Name  |           Description           |
|------------------|--------|---------------------------------|
|     req.user     |  User  |  Available after user logs in.  |

### Example response
```json
{	
	"year": 2,
	"nusOpenId": "E123456",
	"canEdit": true,
	"name": "User",
	"lastLoggedIn": 1469442573896,
	"avatar": "/uploads/E123456/avatar",
	"superAdmin": true,
	"id": 87
}
```

## `GET /api/profile/modules`
Retrieves all the modules (and the role of the user in the module) the current user is in.

### Parameters required
| Request Property |  Name  |           Description           |
|------------------|--------|---------------------------------|
|     req.user     |  User  |  Available after user logs in.  |

### Example response
```json
[{
  "m":  { 
          "contributionTypes": ["weqwe","wew","eqw"],
          "code": "weqeqwe",
          "name": "qweq",
          "id": 129
        }, 
  "r": 
        { 
          "start": 129, 
          "end": 87,
          "type": "MEMBER",
          "properties": {
                          "role": "Admin"
                        },
          "id":48
        }
 },
 {
  "m":  {
          "contributionTypes": ["test"],
          "code": "test",
          "name": "test",
          "id": 121
          },
  "r": 	{
          "start": 121, 
          "end": 87, 
          "type": "MEMBER",
          "properties":	 {
                          "role": "Admin"
                        },
          "id": 44
        }
}]
```
