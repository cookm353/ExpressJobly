# Jobly Backend

This is the Express backend for Jobly, version 2.

To run this:

    node server.js
    
To run the tests:

    jest -i

## Routes

### Authorization/Authentication Endpoints

#### **`POST /auth/token`**

- Login route which accepts a username and password and returns a JWT which can be used for other requests
- Authorization level required: none

```JavaScript
{ username, password} => { token }
```

| Name | Description | Type |
| - | - | - |
| username | The user's username | string |
| password | The username's password | string |
| token | JSON web token | string |

#### **`POST /auth/register`**

- Registration route which accepts a username, password, first name, last name, and email address, and returns a token which can be used for other requests
- Authorization level required: none

```JavaScript
{ username, password, firstName, lastName, email } => { token }
```

| Name | Description | Type |
| - | - | - |
| username | User's username | string |
| password | Password associated with username | string |
| firstName | User's first name | string |
| lastName | User's last name | string |
| email | User's email address | string |
| token | JSON web token | string |

### User Endpoints

#### **`POST /users/`**

- Route which allows admins to create new users, including new admins
- Authorization level required: administrator

```JavaScript
{ user } => { token }

// Where {user} = { username, password, firstName, lastName, email }
```

| Name | Description | Type |
| - | - | - |
| username | User's username | string |
| password | Password associated with username | string |
| firstName | User's first name | string |
| lastName | User's last name | string |
| email | User's email address | string |
| token | JSON web token | string |

#### `GET /users/`

- Route which returns information for all users
- Authorization level required: administrator

```JavaScript
{ users: [ {username, firstName, lastName, email, isAdmin }, ... ] }
```

| Name | Description | Type |
| - | - | - |
| username | User's username | string |
| password | Password associated with username | string |
| firstName | User's first name | string |
| lastName | User's last name | string |
| email | User's email address | string |
| isAdmin | If user is an admin | boolean |

#### `GET /users/[username]`

- Route which returns information for a given user
- Authorization level required: administrator or user being looked up

```JavaScript
{ user: { username, firstName, lastName, isAdmin } }
```

| Name | Description | Type |
| - | - | - |
| username | User's username | string |
| password | Password associated with username | string |
| firstName | User's first name | string |
| lastName | User's last name | string |
| email | User's email address | string |
| isAdmin | If user is an admin | boolean |

#### `PATCH /users/[username]`

- Route which allows user information to be updated
- Allows for updating user's first name, last name, password, and email
- Authorization level required: administrator or user being updated

```JavaScript
{ firstName?, lastName?, password?, email? } => { user: { username, firstName, lastName, isAdmin } }
```

| Name | Description | Type |
| - | - | - |
| username | User's username | string |
| password | Password associated with username | string |
| firstName | User's first name | string |
| lastName | User's last name | string |
| email | User's email address | string |

#### `DELETE /users/[username]`

- Router which allows users to be deleted
- Authorization level required: administrator or user being updated

```JavaScript
=> { deleted: username}
```

| Name | Description | Type |
| - | - | - |
| username | User's username | string |

### Company Endpoints

#### `GET /companies/`

## Takeaways

- Always work on a separate branch when implementing a new feature, even if you're the only one working on a project
