# Jobly Backend

This is the Express backend for Jobly, version 2.

To run this:

    node server.js
    
To run the tests:

    jest -i

## Routes

### Authorization/Authentication Endpoints

#### **`POST /auth/token`**

Login route which accepts a username and password and returns a JWT which can be used for other requests.

```JavaScript
{ username, password} => { token }
```

| Name | Description | Type |
| - | - | - |
| username | The user's username | string |
| password | The username's password | string |
| token | JSON web token | string |

#### **`POST /auth/register`**

Registration route which accepts a username, password, first name, last name, and email address, and returns a token which can be used for other requests.

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

Route which allows admins to create new users, including new admins.  T

```JavaScript
{ user } => { user, token }

// Where {user} = 
```

| Name | Description | Type |
| - | - | - |


#### `GET /users/`

### Company Endpoints

#### `GET /companies/`

## Takeaways

- Always work on a separate branch when implementing a new feature, even if you're the only one working on a project
