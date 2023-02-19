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

#### **`POST /users/[username]/jobs/[id]`**

- Route which allows user to apply for a job
- Authorization level required: administrator or correct user

```JavaScript
=> { applied: jobId }
```

| Name | Description | Type |
| - | - | - |
| jobId | ID of job user has applied for | number |

#### **`GET /users/`**

- Route which returns information for all users
- Authorization level required: administrator

```JavaScript
{ users: [ {username, firstName, lastName, email, isAdmin, jobs: [ jobId, ... ] }, ... ] }
```

| Name | Description | Type |
| - | - | - |
| username | User's username | string |
| password | Password associated with username | string |
| firstName | User's first name | string |
| lastName | User's last name | string |
| email | User's email address | string |
| isAdmin | If user is an admin | boolean |
| jobId | ID of job user has applied for | number |

#### **`GET /users/[username]`**

- Route which returns information for a given user
- Authorization level required: administrator or user being looked up

```JavaScript
{ user: { username, firstName, lastName, isAdmin, jobs: [ jobId, ... ] } }
```

| Name | Description | Type |
| - | - | - |
| username | User's username | string |
| password | Password associated with username | string |
| firstName | User's first name | string |
| lastName | User's last name | string |
| email | User's email address | string |
| isAdmin | If user is an admin | boolean |
| jobId | ID of job user has applied for | number |

#### **`PATCH /users/[username]`**

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

#### **`DELETE /users/[username]`**

- Route which allows users to be deleted
- Authorization level required: administrator or user being updated

```JavaScript
=> { deleted: username}
```

| Name | Description | Type |
| - | - | - |
| username | User's username | string |

### Company Endpoints

### **`POST /companies`**

- Route allowing new jobs to be added
- Authorization level required: administrator

```JavaScript
{ company } => { company }
// Where company is { handle, name, description, numEmployees, logoUrl }
```

| Name | Description | Type |
| - | - | - |
| handle | Company handle (PK) | string |
| name | Company's name | string |
| description | Description of company | string |
| numEmployees | Current number of employees | number |
| logoUrl | URL for company's logo | string |

#### **`GET /companies/`**

- Route which returns information for all companies
- Authorization level required: none

```JavaScript
=> { companies: [ { company }, ...] }
// Where company is { handle, name, description, numEmployees, logoUrl }
```

| Name | Description | Type |
| - | - | - |
| handle | Company handle (PK) | string |
| name | Company's name | string |
| description | Description of company | string |
| numEmployees | Current number of employees | number |
| logoUrl | URL for company's logo | string |

#### **`GET /companies/[handle]`**

- Route which returns information for specified company
- Authorization level required: none

```JavaScript
=> { company: { company } }
// Where company is { handle, name, description, numEmployees, logoUrl }
```

| Name | Description | Type |
| - | - | - |
| handle | Company handle (PK) | string |
| name | Company's name | string |
| description | Description of company | string |
| numEmployees | Current number of employees | number |
| logoUrl | URL for company's logo | string |

#### **`PATCH /companies/[handle]`**

- Route which allows companies to be updated
- Allows for partial updates
- Name, description, numEmployees, and/or logoUrl can be updated
- Authorization level required: administrator

```JavaScript
{name, description, numEmployees, logoUrl} => {handle, name, description, numEmployees, logoUrl}
```

| Name | Description | Type |
| - | - | - |
| handle | Company handle (PK) | string |
| name | Company's name | string |
| description | Description of company | string |
| numEmployees | Current number of employees | number |
| logoUrl | URL for company's logo | string |

#### **`DELETE /companies/[handle]`**

- Route which allows a company to be deleted
- Authorization level required: administrator

```JavaScript
=> { deleted: handle }
```

| Name | Description | Type |
| - | - | - |
| handle | Company handle (PK) | string |

### Job Endpoints

#### **`POST /jobs`**

- Route allowing new job to be added
- Authorization level required: administrator

```JavaScript
{ title, salary, equity, company_handle } => { id, title, salary, equity, company_handle }
```

| Name | Description | Type |
| - | - | - |
| id | ID associated with job (PK) | number |
| title | Job's title | string |
| salary | Job's salary | number |
| equity | Job equity | string |
| company_handle | Handle of company (FK) | string |

#### **`GET /jobs`**

- Returns information on all jobs
- Authorization level required: none

```JavaScript
=> { jobs: [ { id, title, salary, equity, company_handle }, ... ] }
```

| Name | Description | Type |
| - | - | - |
| id | ID associated with job (PK) | number |
| title | Job's title | string |
| salary | Job's salary | number |
| equity | Job equity | string |
| company_handle | Handle of company (FK) | string |

#### **`GET /jobs/[id]`**

- Returns information on specified job
- Authorization level required: none

```JavaScript
=> { job: { id, title, salary, equity, company_handle } }
```

| Name | Description | Type |
| - | - | - |
| id | ID associated with job (PK) | number |
| title | Job's title | string |
| salary | Job's salary | number |
| equity | Job equity | string |
| company_handle | Handle of company (FK) | string |

#### **`PATCH /jobs/[id]`**

- Route allowing specified job to be selectively updated
- Title, salary, equity, and/or company handle can be updated
- Authorization level required: administrator

```JavaScript
{ field1, field2, ... } => { id, title, salary, equity, company_handle }
```

| Name | Description | Type |
| - | - | - |
| id | ID associated with job (PK) | number |
| title | Job's title | string |
| salary | Job's salary | number |
| equity | Job equity | string |
| company_handle | Handle of company (FK) | string |

#### **`DELETE /jobs/[id]`**

- Route allowing specified job to be deleted
- Authorization level required: administrator

```JavaScript
=> { deleted: id }
```

| Name | Description | Type |
| - | - | - |
| id | ID associated with job (PK) | number |

## Takeaways

- Always work on a separate branch when implementing a new feature, even if you're the only one working on a project
- Revamp work flow
  - Write tests before writing functions
  - After writing a route, add it to the docs
- If writing model from scratch, use mix of instance and static methods instead of just static methods
