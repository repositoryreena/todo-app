document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("todo-form");
    const input = document.getElementById("task-input");
    const taskList = document.getElementById("task-list");

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const taskText = input.value.trim();
        if (taskText === "") return;

        addTask(taskText);
        saveTasks();
        input.value = "";
    });

    // Add a new task to a to do list in an HTML document.  Create a new list item.  Set the text content to whatever is passed in as the text argument.  The value of taskText is being passed as an argument to the addTask function in this part of the code: addTask(taskText).  A new button is created with a check mark.  When clicked it will toggle between completed and its default state.  The saveTasks function is called.  Create a delete button.  When clicked the li is removed from the DOM and the saveTasks function is called to update the task list.  The complete and delete buttons are appended to the li.  The li is appended to taskList which is a ul where tasks are listed.
    function addTask(text) {
        const li = document.createElement("li");
        li.textContent = text;

        const completeBtn = document.createElement("button");
        completeBtn.textContent = "✔";
        completeBtn.addEventListener("click", () => {
            li.classList.toggle("completed");
            saveTasks();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.addEventListener("click", () => {
            li.remove();
            saveTasks();
        });

        li.appendChild(completeBtn);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    }

    // Responsible for saving the current state of the task list including each task's text and completion status to the browser's local storage.  Create an empty tasks array.  Select all list items inside the task list - returns a NodeList of all the li elements that are children of the element with id="task=list".  Loop through each li element.  For each li the task text and completion status is collected and pushed into the tasks array.  The first child of an li is the text node containing the task text.  .textContent gets the text inside that node.  contains completed checks if the li element has the css class completed.  Returns true or false.  Each task is stored as an object with two properties: text and completed.  Save the tasks array to local storage.  Store the tasks array as a JSON string.  Local storage can only store string values.  The key used to store the data is "tasks".  This key will be used later to retrieve the tasks when the page is loaded.  Each time a tasks is added completed or deleted, this function will be called to update the saved list of tasks.  The tasks array would look like this: [ {text:"Buy groceries", completed: false}, {text:"Walk the dog", completed: true}]
    function saveTasks() {
        const tasks = [];
        document.querySelectorAll("#task-list li").forEach((li) => {
            tasks.push({ text: li.firstChild.textContent, completed: li.classList.contains("completed") });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // retrieve saved tasks from local storage.  Convert the string back into a Javascript object.  This returns the tasks as an array of objects.  If there is no data in local storage an empty array will be used as the default value.  Loop through each task object, recreate the tasks in the DOM, mark the task as completed if it's completed.  last child is the recently added child element of the task list container (the li element that was just added).  

    // stringified and parsed are the same, the only difference is putting quotes around the array for stringified
     
    function loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        storedTasks.forEach((task) => {
            addTask(task.text);
            if (task.completed) taskList.lastChild.classList.add("completed");
        });
    }

    loadTasks();
});