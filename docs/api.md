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
|          Endpoint          |                             Description                            |  Access Rights  |
|----------------------------|--------------------------------------------------------------------|-----------------|
|       GET /api/profile     |    Retrieves the current user's profile and modules information    |      User       |
|    GET /api/profile/user   |          Retrieves the current user's profile information          |      User       |
|  GET /api/profile/modules  |            Retrieves all modules the current user is in            |      User       |

### Modules
|          Endpoint          |                            Description                           |  Access Rights  |
|----------------------------|------------------------------------------------------------------|-----------------|
|      GET /api/modules      |    Get a list of all modules with basic information about each   |      User       |
|      POST /api/modules     |                          Add a new module                        |   Super Admin   |
|    GET /api/modules/:id    |       Get a specific module with basic information about it      |      User       |
|    PUT /api/modules/:id    |                      Update a specific module                    |    Moderator    |
|  DELETE /api/modules/:id   |                      Delete a specific module                    |   Super Admin   |
| GET /api/modules/:id/users |       Get a specific module with basic information about it      |      User       |

### Users
|       Endpoint        |                         Description                         | Access Rights |
|-----------------------|-------------------------------------------------------------|---------------|
|    GET /api/users     |  Get a list of all users with basic information about each  |  Super Admin  |
|    POST /api/users    |                        Add a new user                       |  Super Admin  |
|  GET /api/users/:id   |         Get a specific user with basic information          |  Super Admin  |
|  PUT /api/users/:id   |                    Update a specific user                   |  Super Admin  |
| DELETE /api/users/:id |                    Delete a specific user                   |  Super Admin  |
