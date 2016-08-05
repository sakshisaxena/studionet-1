# API Documentation

## Outdated. Get entire graph information from /api/all

### Routes List
|      Route      |      Resource     | 
| --------------  | ----------------- | 
|   /api/profile  |    User Profile   |
|   /api/modules  |      Modules      | 
|    /api/users   |       Users       |
|     /uploads    |      Uploads      |
| /api/moderators |     Moderators    |

### User Profile
|          Endpoint          |                             Description                            |  Access Rights  |
|----------------------------|--------------------------------------------------------------------|-----------------|
|       GET /api/profile     |    Retrieves the current user's profile and modules information    |      User       |
|      PUT /api/profile      |              Update information about the current user             |      User       |
|    GET /api/profile/user   |          Retrieves the current user's profile information          |      User       |
|  GET /api/profile/modules  |            Retrieves all modules the current user is in            |      User       |

### Modules
|             Endpoint             |                            Description                           |  Access Rights  |
|----------------------------------|------------------------------------------------------------------|-----------------|
|         GET /api/modules         |    Get a list of all modules with basic information about each   |      User       |
|         POST /api/modules        |                          Add a new module                        |   Super Admin   |
|    GET /api/modules/:moduleId    |       Get a specific module with basic information about it      |      User       |
|    PUT /api/modules/:moduleId    |                      Update a specific module                    |    Moderator    |
|  DELETE /api/modules/:moduleId   |                      Delete a specific module                    |   Super Admin   |
| GET /api/modules/:moduleId/users |         Get all users that are part of a specific module.        |      User       |



### Users
|         Endpoint          |                         Description                         | Access Rights |
|---------------------------|-------------------------------------------------------------|---------------|
|      GET /api/users       |  Get a list of all users with basic information about each  |  Super Admin  |
|      POST /api/users      |       Add a new user not associated with any modules        |  Super Admin  |
|  GET /api/users/:userId   |         Get a specific user with basic information          |  Super Admin  |
|  PUT /api/users/:userId   |                    Update a specific user                   |  Super Admin  |
| DELETE /api/users/:userId |                    Delete a specific user                   |  Super Admin  |


### Uploads
|                  Endpoint                 |                           Description                          | Access Rights |
|-------------------------------------------|----------------------------------------------------------------|---------------|
|            POST /uploads/avatar           |            Upload a new avatar for the current user            |      User     |
|           POST /uploads/models            |            Upload a new model under the current user           |      User     |
|      GET /uploads/:nusOpenId/avatar       |                  Get a specific user's avatar                  |      User     |
|      GET /uploads/:nusOpenId/models       |  Get information about all models uploaded by a specific user  |      User     |
|  GET /uploads/:nusOpenId/models/:modelId  |      Download a specific model uploaded by a certain user      |      User     |