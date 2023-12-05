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

  #### Sign Up

  - Method: POST.
  - Endpoint: **/auth/signup**.

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

  Response:
  ```json
  {
    "message": 'user saved successfully',
    "data": {
      "userid": "qf39gd-ENkufMrFLF9ZFl",
      "fullname": "Willy wonka",
      "email": "Willywonka@gmail.com"
    }
  }
  ```
  #### Sign in

  - Method: POST.
  - Endpoint: **/auth/signin**.
  
  Request:
  ```json
  {
    "email": "Willywonka@gmail.com",
    "password": "123Willy"
  }
  ```
  
  if the provided values are correct as a registered user,

  Response:
  ```json
  {
    data: {
      "userid": "mXJut0--FazUfjec2L6bI",
      "fullname": "Willy wonka",
      "email": "Willywonka@gmail.com",
      "tasks": [],
      "num_of_tasks": 0
    }
  }
  ```


- ### Task Creation
	- Method: POST.
  - Endpoint: **/tasks/createTask**.
  
  status can also be added, can be either completed or pending, if status is not provided 'pending' is added by default.
  
  *NOTE* duedate is a string, it can be in any format for now, but it's a string.

  Request:
  ```JSON
  {
    "title": "Task title here",
    "description": "Describe task title here",
    "duedate": "04/11/1998"
  }
  ```

  Response:
  ```JSON
  {
    "message": "Task saved succesfully",
    "task": {
        "taskid": "9ktapmTHWcvn12xTPNyAB",
        "title": "Task title here",
        "description": "Describe task title here",
        "duedate": "04/11/1998",
        "status": "pending"
    }
  }
  ```

- ### Task Viewing
	- Endpoint: /tasks.
  - Method: GET.

    Response:
    ```JSON
      {
      "tasks": [
          {
              "taskid": "nyLsWYGai5Nh_b-ddSt8_",
              "title": "Task title here",
              "description": "Task description here",
              "duedate": "Jan_20_2024",
              "status": "pending"
          },
          {
              "taskid": "F2fkDiu3zp7",
              "title": "Enter task title here",
              "description": "Describe task here",
              "duedate": "30/12/2023",
              "status": "pending"
          },
          {
              "taskid": "xdwDcVJ27VkC_",
              "title": "Enter task title here",
              "description": "Describe task here",
              "duedate": "Nov 05 2023",
              "status": "completed"
          }
        ],
        "num_of_tasks": 3
      }
    ```

    Users can also retrieve a single task by passing the task id into the request paramter
    -Endpoint: /tasks/{task_id}.

    Request:
    ```request path: **/tasks/9ktapmTHWcvn12xTPNyAB**```

    Response:
  ```JSON
    {
      "taskid": "hhLhp5LsoA",
      "title": "Task title here",
      "description": "Describe task title here",
      "duedate": "04/11/1998",
      "status": "pending"
    }
  ```

- ### Task Updating
	- Method: PUT
  - Endpoint: **/tasks/{task_id}**.

  Request:
  Request path: **/tasks/rr6K2YuX-YqOe3l2pV4Wd**.

  body:  
  ```JSON
  {
    "title": "Task title here",
    "description": "Describe task title here",
    "duedate": "Nov 05 2023",
    "status": "completed"
  }
  ```
  Response:
  ```JSON
  {
    "message": "Task updated successfully",
    "updated_task": {
        "taskid": "rr6K2Yul2pV4Wd",
        "title": "Task title here",
        "description": "Describe task title here",
        "duedate": "Nov 05 2023",
        "status": "completed"
    },
  }
  ```

- ### Task Deletion
	- Method: DELETE.
  - Endpoint: **/tasks/{task_id}**.

  Request:
  ```Request path: **/tasks/rr6K2YuX-YqOe3l2pV4Wd**.```

  Response:
  ```JSON
  {
    "message": "Task deleted successfully"
  }
  ```
	- Deleted tasks are removed from memory


- Task Status Update
	- Task status field can be toggled between pending and completed
