document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("todo-form");
    const input = document.getElementById("task-input");
    const dateInput = document.getElementById("date-input");
    const taskList = document.getElementById("task-list");

    let today = new Date();

    // Set hours, minutes, seconds, and milliseconds to zero
    today.setHours(0, 0, 0, 0);

    // Format the date to YYYY-MM-DD
    let formattedDate = today.toISOString().split('T')[0];

    // Set the min attribute
    dateInput.setAttribute("min", formattedDate);

    const completed = document.getElementById("completed");
    const incompleted = document.getElementById("incompleted");

    // Select all list elements.  Iterate over each task item.  Remove show filter and add hide filter.  Check for completed tasks.  Display completed tasks.
    function addIncompletedFilter() {
        const lis = taskList.querySelectorAll("li");
        lis.forEach((li) => {
            li.classList.remove("showFilter");
            li.classList.add("hideFilter");
            if (li.classList.contains("completed")) {
                li.classList.remove("hideFilter");
                li.classList.add("showFilter");
            }
        });
    }

    // Select all list items.  Iterate over each task item.  Remove show filter and add hide filter.  Check for incompleted tasks.  Display incompleted tasks.
    function addCompletedFilter() {
        const lis = taskList.querySelectorAll("li");
        lis.forEach((li) => {
            li.classList.remove("showFilter");
            li.classList.add("hideFilter");
            if (!li.classList.contains("completed")) {
                li.classList.remove("hideFilter");
                li.classList.add("showFilter");
            }
        });
    }

    incompleted.addEventListener("click", addCompletedFilter);
    completed.addEventListener("click", addIncompletedFilter);

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Form submission to add a task
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const taskText = input.value.trim();

        if (taskText === "") return;

        addTask(taskText);
        saveTasks();
        input.value = "";
    });

    let draggedItem = null;

    // Add a new task to a to do list in an HTML document.  Create a new list item.  Set the text content to whatever is passed in as the text argument.  The value of taskText is being passed as an argument to the addTask function in this part of the code: addTask(taskText).  A new button is created with a check mark.  When clicked it will toggle between completed and its default state.  The saveTasks function is called.  Create a delete button.  When clicked the li is removed from the DOM and the saveTasks function is called to update the task list.  The complete and delete buttons are appended to the li.  The li is appended to taskList which is a ul where tasks are listed.

    // Get the due date.  Mark the task draggable.  Allows the item to be dragged around the list.  Add drag and drop listeners.  When dragging starts (dragstart event), the task li that is being dragged is stored in the variable dragItem, and the class dragging is added to it to visually indicate that it is being dragged.  When the dragging ends (dragend event), the dragging class is removed from the dragged item, and draggedItem is set to null.  The dragover event allows the dragged item to be placed over another item by preventing the default behavior (which is to not allow dropping).  The drop event is triggered when the dragged task is dropped onto another task.  The event prevents the default drop behavior and then checks if the item being dragged is different from the target (the item being dropped onto).  It then reorders the tasks based on the indidces of the dragged item and the target item (li).  The dragged item is either inserted before or after the target item.  The task list is saved with the new order by calling saveTasks().  The task text is updated to include the due date.

    // Array.from creates a new shallow copied Array instance from an iterable or array like object.

    // Create the edit button.  Aria-label attribute with the value Edit task improves accessibility by providing a description for screen readers.  Add event listener for click.  Prompt the user for task text and due date.  Get the current task's text to pre fill the prompt for the task.  Get the current due date to pre-fill the prompt for the due date.  Update the task text.  The first child of the li is updated with the new task text.  Validate the date format using a regular expression.  Check if the date is not in the past.  If the date is in the past, an alert is shown to the user.  If the date is valid, the due date is updated and the displayed due date is updated.  If the date format is invalid an alert is shown.  Save tasks to local storage.

    function addTask(text) {
        const dateText = dateInput.value;
        const li = document.createElement("li");
        li.textContent = text;

        li.setAttribute("data-task-text", text);
        li.setAttribute("data-due-date", dateText);
        li.setAttribute("draggable", "true");

        // Add the due date to the task
        const dueDateSpan = document.createElement("span");
        dueDateSpan.classList.add("due-date");
        dueDateSpan.textContent = dateText;
        li.appendChild(dueDateSpan);

        // Add the complete button
const completeBtn = document.createElement("button");
completeBtn.classList.add("complete-btn");
completeBtn.textContent = "✔";
completeBtn.setAttribute("aria-label", "Mark task as completed");
completeBtn.addEventListener("click", () => {
    // Toggle the 'completed' class on the li (task item)
    li.classList.toggle("completed");

    // Only add the 'blue' class to the button when the task is completed
    if (li.classList.contains("completed")) {
        completeBtn.classList.add("blue");
    } else {
        completeBtn.classList.remove("blue");
    }

    // Optionally save tasks after completing
    saveTasks();
});




        // Add the delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.setAttribute("aria-label", "Delete task");
        deleteBtn.addEventListener("click", () => {
            li.remove();
            saveTasks();
        });

        // Add the edit button
        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️";
        editBtn.setAttribute("aria-label", "Edit task");
        editBtn.addEventListener("click", () => {
            const newTaskText = prompt("Edit your task:", li.getAttribute("data-task-text"));
            const newDueDate = prompt("Edit the due date (YYYY-MM-DD):", li.getAttribute("data-due-date"));

            // Validate and update the task text and due date if provided
            if (newTaskText && newTaskText.trim() !== "") {
                li.setAttribute("data-task-text", newTaskText);
                li.firstChild.textContent = newTaskText; // Update the task text
            }

            // Validate and update the due date
            if (newDueDate && newDueDate.trim() !== "") {
                // Validate the date format (optional)
                const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                if (dateRegex.test(newDueDate)) {
                    // Ensure the date is not in the past
                    const inputDate = new Date(newDueDate);
                    if (inputDate < today) {
                        alert("The due date cannot be in the past. Please select a valid date.");
                    } else {
                        li.setAttribute("data-due-date", newDueDate);
                        dueDateSpan.textContent = newDueDate; // Update the due date
                    }
                } else {
                    alert("Invalid date format. Please use YYYY-MM-DD.");
                }
            }

            saveTasks();
        });

        li.appendChild(completeBtn);
        li.appendChild(deleteBtn);
        li.appendChild(editBtn);
        taskList.appendChild(li);

        // Drag and drop functionality
        li.addEventListener("dragstart", (e) => {
            draggedItem = e.target;
            draggedItem.classList.add("dragging");
        });

        li.addEventListener("dragend", () => {
            draggedItem.classList.remove("dragging");
            draggedItem = null;
        });

        li.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        li.addEventListener("drop", (e) => {
            e.preventDefault();
            if (draggedItem !== li) {
                const allItems = Array.from(taskList.children);
                const draggedIndex = allItems.indexOf(draggedItem);
                const targetIndex = allItems.indexOf(li);

                if (draggedIndex < targetIndex) {
                    li.after(draggedItem);
                } else {
                    li.before(draggedItem);
                }
                saveTasks();
            }
        });
    }

    // Responsible for saving the current state of the task list including each task's text and completion status to the browser's local storage.  Create an empty tasks array.  Select all list items inside the task list - returns a NodeList of all the li elements that are children of the element with id="task=list".  Loop through each li element.  For each li the task text and completion status is collected and pushed into the tasks array.  The first child of an li is the text node containing the task text.  .textContent gets the text inside that node.  contains completed checks if the li element has the css class completed.  Returns true or false.  Each task is stored as an object with two properties: text and completed.  Save the tasks array to local storage.  The key used to store the data is "tasks".  This key will be used later to retrieve the tasks when the page is loaded.  Each time a tasks is added completed or deleted, this function will be called to update the saved list of tasks.  The tasks array would look like this: [ {text:"Buy groceries", completed: false}, {text:"Walk the dog", completed: true}]
    function saveTasks() {
        const tasks = [];
        document.querySelectorAll("#task-list li").forEach((li) => {
            tasks.push({
                text: li.getAttribute("data-task-text"),
                completed: li.classList.contains("completed"),
                dueDate: li.getAttribute("data-due-date"),
            });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // retrieve saved tasks from local storage.  Convert the string back into a Javascript object.  This returns the tasks as an array of objects.  If there is no data in local storage an empty array will be used as the default value.  Loop through each task object, recreate the tasks in the DOM, mark the task as completed if it's completed.  last child is the recently added child element of the task list container (the li element that was just added).

    // stringified and parsed are the same, the only difference is putting quotes around the array for stringified
    function loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        storedTasks.forEach((task) => {
            addTask(task.text);
            if (task.completed) {
                taskList.lastChild.classList.add("completed");
            }
            const dueDateSpan = taskList.lastChild.querySelector(".due-date");
            if (dueDateSpan) {
                dueDateSpan.textContent = task.dueDate;
            }
        });
    }

    loadTasks();
});
