# to do list web app

This is a simple, interactive To-Do List Web App that allows users to manage their tasks by adding, editing, deleting, and marking tasks as completed. The app uses local storage to persist the tasks even after a page refresh, and it comes with automated tests to ensure the functionality works as expected.

## project overview

The goal of this project was to build a fully functional to-do list app while practicing JavaScript fundamentals like DOM manipulation, event handling, local storage, and automated testing with Jest. The app includes the following features:

- Add, edit, and delete tasks.
- Mark tasks as completed.
- Persist tasks in the browser using local storage.
- Write automated tests to verify app functionality using Jest.

## features
- Task Management: Add new tasks, edit existing ones, delete tasks, and mark them as completed.
- Persistence with Local Storage: Tasks persist across page reloads using localStorage.
- Task Completion: Users can mark tasks as completed, which visually strikes them through.
- Responsive Design: The app is designed to work on both desktop and mobile browsers.

## technologies used

- HTML: For structuring the app’s user interface.
- CSS: For styling the app and ensuring a responsive design.
- JavaScript: For implementing the logic (task adding, deleting, completion, and local storage).
- Jest: For automated testing to ensure that the app functions correctly

## how it works

### 1. Adding Tasks
Users can input a task into the input field and submit it by pressing the "Add Task" button. The task is then added to a dynamic list on the page.

### 2. Marking Tasks as Complete
Each task has a "✔" button that toggles the task's completion status. Completed tasks are visually represented by a strike-through and gray text.

### 3. Deleting Tasks
Tasks have a "❌" button to delete them from the list.

### 4. Persistence Using Local Storage
The app saves the list of tasks to the browser’s localStorage. When the page is reloaded, the tasks are retrieved from local storage and re-rendered on the page.

### 5. Automated Tests
The project includes test cases written with Jest to ensure the functionality works as expected. The tests cover the following:

- Adding tasks to the list
- Marking tasks as completed
- Deleting tasks
- Ensuring tasks persist across page reloads

## setup instructions

To run this project locally:

### 1. clone the repository
```
git clone https://github.com/your-username/todo-app.git
cd todo-app
```
### 2. open the project in a browser
simply open the index.html file in a browser to see the app in action
### 3. run automated tests
to run the tests, you need to install Jest:
1. install dependencies:
```
npm init -y
npm install --save-dev jest
```
2. add the following script to your package.json to run the tests:
```
"scripts":{
    "test":"jest"
}
```
3. run the tests:
```
npm test
```

## demo
you can view the live demo of the app here

## screenshots

## contributing
Contributions are welcome! If you have suggestions or improvements, feel free to fork the repository and submit a pull request. Before making major changes, please open an issue to discuss the changes you'd like to propose.

### how to contribute
1. Fork the repository
2. Create a feature branch (git checkout -b feature-name)
3. Commit your changes (git commit -am 'Add feature')
4. Push to the branch (git push origin feature-name)
5. Open a pull request

## license
This project is licensed under the MIT License. See the LICENSE file for more details.