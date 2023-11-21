# In-Memory Task Management Application API

Application allows users to create, view, update and delete tasks.

Data is stored in memory i.e all data is lost once the server is restarted.

Tasks would have:
- Title
- Description
- Due date
- Status (completed or pending)

Features
- ### User Authentication
	- User can register and log in during a session
  Sign Up
  Requires a JSON object containing fullname, email and password,
  path: /api/v1/auth/signup

  Example:
  ```json
  {
    "fullname" : "Willy wonka",
    "email": "Willywonka@gmail.com",
    "password": "123Willy"
  }
  ```

  Fullname must be at least 3 letters long,
  Email must be a valid format with '@' and '.com' such as the one in the example,
  Password should be at least 6 letters long, contain at least an uppercase letter and a digit.

  Example response:
  ```json
  {
    "message": 'user saved successfully',
    "data": {
      "id": "qf39gd-ENkufMrFLF9ZFl",
      "fullname": "Willy wonka",
      "email": "Willywonka@gmail.com"
    }
  }
  ```

  After sign up in the same session, users can also sign in
  path: /api/v1/auth/signin
  Requires a JSON object containing email and password

  Example request:
  ```json
  {
    "email": "Willywonka@gmail.com",
    "password": "123Willy"
  }
  ```
  
  if the provided values are correct as a registered user,

  Example response:
  ```json
  {
    data: {
      "id": "mXJut0--FazUfjec2L6bI",
      "fullname": "Willy wonka",
      "email": "Willywonka@gmail.com",
      "tasks": [],
      "num_of_tasks": 0
    }
  }
  ```




- Task Creation
	- Users can create tasks stored in server's memory
- Task Viewing
	- Tasks are retrievable from memory during session
- Task Updating
	- Any changes made to a task are updated in memory during session
- Task Deletion
	- Tasks can be deleted by the user.
	- Deleted tasks are removed from memory
- Task Status Update
	- Task status field can be toggled between pending and completed