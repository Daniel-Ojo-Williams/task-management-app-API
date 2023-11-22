# In-Memory Task Management Application API

Application allows users to create, view, update and delete tasks.

Data is stored in memory i.e all data is lost once the server is restarted.

Tasks would have:
- Title
- Description
- Due date
- Status (completed or pending)

## Features
- ### User Authentication
	- User can register and log in during a session by sending a **POST** request.

  #### Sign Up

  Requires a JSON object containing fullname, email and password.

  ```path: /api/v1/auth/signup.```

  Example:
  ```json
  {
    "fullname" : "Willy wonka",
    "email": "Willywonka@gmail.com",
    "password": "123Willy"
  }
  ```

  Fullname must be at least 3 letters long.
  Email must be a valid format with '@' and '.com' such as the one in the example.
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
  #### Sign in

  After sign up in the same session, users can also sign in by sending a **POST** request.

  Requires a JSON object containing email and password.

  ```path: /api/v1/auth/signin.```
  
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


- ### Task Creation
	- Users can create tasks stored in server's memory by sending a **POST** request.

  Requiers a JSON object containing title, description, due_date.
  
  status can also be added, can be either completed or pending, if status is not provided 'pending' is added by default.
  
  *NOTE* due_date is a string, it can be in any format for now, but it's a string.

  Example request:
  ```JSON
  {
    "title": "Task title here",
    "description": "Describe task title here",
    "due_date": "04/11/1998"
  }
  ```

  Example response:
  ```JSON
  {
    "message": "Task saved succesfully",
    "task": {
        "id": "9ktapmTHWcvn12xTPNyAB",
        "title": "Task title here",
        "description": "Describe task title here",
        "due_date": "04/11/1998",
        "status": "pending"
    }
  }
  ```

- ### Task Viewing
	- Tasks are retrievable from memory during session by sending a **GET** request.
    Users can retrieve all their tasks.
    ```**path: /api/v1/tasks**.```

    Example response:
    ```JSON
      {
      "tasks": [
          {
              "id": "nyLsWYGai5Nh_b-ddSt8_",
              "title": "Task title here",
              "description": "Task description here",
              "due_date": "Jan_20_2024",
              "status": "pending"
          },
          {
              "id": "F2fk_kMkA55XoJDiu3zp7",
              "title": "Enter task title here",
              "description": "Describe task here",
              "due_date": "30/12/2023",
              "status": "pending"
          },
          {
              "id": "xdwDIv6G5mOycVJ27VkC_",
              "title": "Enter task title here",
              "description": "Describe task here",
              "due_date": "Nov 05 2023",
              "status": "completed"
          }
        ],
        "num_of_tasks": 3
      }
    ```

    Users can also retrieve a single task by passing the task id into the request paramter
    ```**path: /api/v1/tasks/{task_id}**.```

    Exapmle request:
    ```request path: **/api/v1/tasks/9ktapmTHWcvn12xTPNyAB**```

    Example response:
  ```JSON
    {
      "id": "hhLhgqT8vzSb3C6p5LsoA",
      "title": "Task title here",
      "description": "Describe task title here",
      "due_date": "04/11/1998",
      "status": "pending"
    }
  ```

- ### Task Updating
	- Any changes made to a task are updated in memory during session
  Users can make changes to tasks they created by sending a **PUT** request, providing the id of task to update.
  request requires { title, description, due_date }

  path: **/api/tasks/{id}**

  Example request:
  Request path: **/api/tasks/rr6K2YuX-YqOe3l2pV4Wd**.

  body:  
  ```JSON
  {
    "title": "Task title here",
    "description": "Describe task title here",
    "due_date": "Nov 05 2023",
    "status": "completed"
  }
  ```
  Example response:
  ```JSON
  {
    "message": "Task updated successfully",
    "updated_task": {
        "id": "rr6K2YuX-YqOe3l2pV4Wd",
        "title": "Task title here",
        "description": "Describe task title here",
        "due_date": "Nov 05 2023",
        "status": "completed"
    },
  }
  ```

- ### Task Deletion
	- Tasks can be deleted by the user.
  Users can delete a previously created tasks by providing the task id in a **DELETE** request.

  ```path: **/api/tasks/{id}**.```

  Example request:
  ```Request path: **/api/tasks/rr6K2YuX-YqOe3l2pV4Wd**.```

  Response:
  ```JSON
  {
    "message": "Task deleted successfully"
  }
  ```
	- Deleted tasks are removed from memory


- Task Status Update
	- Task status field can be toggled between pending and completed