## About The Project

This project is a simple authentication backend build with Node.js, Express, Json Web Token and MySQL database. 

### Built With

This project built with
* [NodeJs](https://nodejs.org/)
* [Express](https://expressjs.com/)
* [Mysql](https://www.mysql.com/)

## Getting started 

Please follow all the steps below.

### Prerequisites

install the environment 
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/andigaluh/auth-node-jwt-mysql.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create a database named *authdb* in your mysql server
4. Enter your credential in `.env.template` and save as `.env`
7. Start the project
   ```sh
    node server.js
   ```

## Endpoint

**Sign Up**
---
returns json data about sign up an user


* **URL**

  /api/auth/signup

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

  ```sh
    {
        "username" : "admin",
        "email": "admin@domain.com",
        "password" : "password-here",
        "roles" : ["admin", "supervisor", "operator", "engineer"]
    }
  ```

<!-- * **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"message":"Your data is successfully submited! The activation link has been sent to your email."}`
 
* **Error Response:**

  * **Code:** 400 Bad Request <br />
    **Content:** `{"message":"Failed! username is already in use!"}`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{"message":"Your data is successfully submited! The activation link has been sent to your email."}` -->

* **Sample Call:**

  ```sh
    curl --location --request POST 'http://localhost:8080/api/auth/signup' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "username" : "admin",
        "email": "admin@domain.com",
        "password" : "password-here",
        "roles" : ["admin","supervisor","operator","engineer"]
    }'
   ```

**Login**
---
returns json data about login an user


* **URL**

  /api/auth/signin

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

  ```sh
    {
        "username" : "admin",
        "password" : "password-here"
    }
  ```

* **Sample Call:**

  ```sh
    curl --location --request POST 'http://localhost:8080/api/auth/signin' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "username" : "admin",
        "password" : "password-here"
    }'
   ```

**Logout**
---
returns json data about logout an user


* **URL**

  /api/auth/logout

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

  None

* **Sample Call:**

   ```sh
    curl --location --request POST 'http://localhost:8080/api/auth/logout' \
    --header 'x-access-token: token-is-here'
   ```

**My profile**
---
returns json about data profile from user who is signed in


* **URL**

  /api/auth/me

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

  None

* **Sample Call:**

   ```sh
    curl --location --request GET 'http://localhost:8080/api/auth/me' \
    --header 'x-access-token: token-is-here'
   ```

**Update profile**
---
returns json about update data profile from user who is signed in


* **URL**

  /api/auth/me

* **Method:**

  `PUT`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

  ```sh
    {
        "username" : "username-edit"
    }
  ```

* **Sample Call:**

   ```sh
    curl --location --request PUT 'http://localhost:8080/api/auth/me' \
    --header 'x-access-token: token-is-here' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "username" : "username-edit"
    }'
   ```

**Change password**
---
returns json about change password from user who is signed in


* **URL**

  /api/auth/change-password

* **Method:**

  `PUT`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

  ```sh
    {
        "password" : "password-edit"
    }
  ```

* **Sample Call:**

   ```sh
    curl --location --request PUT 'http://localhost:8080/api/auth/change-password' \
    --header 'x-access-token: token-is-here' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "password" : "password-edit"
    }'
   ```

**Check valid email for forget password**
---
returns json about check valid email for forget password


* **URL**

  /api/auth/check-valid-email

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

  ```sh
    {
        "email" : "admin@domain.com"
    }
  ```

* **Sample Call:**

   ```sh
    curl --location --request POST 'http://localhost:8080/api/auth/check-valid-email' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "email" : "admin@domain.com"
    }'
   ```

**Check valid encrypted key**
---
returns json about check valid encrypted key for reset password


* **URL**

  /api/auth/check-valid-email-enc

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   ```sh
    id=encrypted-code-is-here
   ```

* **Data Params**

   None

* **Sample Call:**

   ```sh
    curl --location --request GET 'http://localhost:8080/api/auth/check-valid-email-enc?id=encrypted-code-is-here'
   ```

**Reset password**
---
returns json about reset password


* **URL**

  /api/auth/reset-password

* **Method:**

  `PUT`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

   ```sh
    {
        "email" : "admin@domain.com",
        "password" : "new-password-here"
    }
   ```

* **Sample Call:**

   ```sh
    curl --location --request PUT 'http://localhost:8080/api/auth/reset-password' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "email" : "admin@domain.com",
        "password" : "new-password-here"
    }'
   ```

**Public page**
---
returns json for public page

* **URL**

  /api/test/all

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

   None

* **Sample Call:**

   ```sh
    curl --location --request GET 'http://localhost:8080/api/test/all'
   ```

**User auth page**
---
returns json for user authorization

* **URL**

  /api/test/user

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

   None

* **Sample Call:**

   ```sh
    curl --location --request GET 'http://localhost:8080/api/test/user' \
    --header 'x-access-token: token-is-here'
   ```

**Supervisor auth page**
---
returns json for supervisor authorization

* **URL**

  /api/test/mod

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

   None

* **Sample Call:**

   ```sh
    curl --location --request GET 'http://localhost:8080/api/test/mod' \
    --header 'x-access-token: token-is-here'
   ```

**Admin auth page**
---
returns json for admin authorization

* **URL**

  /api/test/admin

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

   None

* **Sample Call:**

   ```sh
    curl --location --request GET 'http://localhost:8080/api/test/admin' \
    --header 'x-access-token: token-is-here'
   ```