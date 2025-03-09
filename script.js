document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("todo-form");
  const input = document.getElementById("task-input");
  const dateInput = document.getElementById("date-input");
  const taskList = document.getElementById("task-list");

  const completedButton = document.getElementById("completed");
  const incompletedButton = document.getElementById("incompleted");

  // Get today's date in the format YYYY-MM-DD
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const dd = String(today.getDate()).padStart(2, "0");
  const todayString = `${yyyy}-${mm}-${dd}`;

  // Set the min attribute to today's date
  dateInput.setAttribute("min", todayString);

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const taskText = input.value.trim();
    if (taskText === "") return;
    addTask(taskText);
    saveTasks();
    input.value = "";
  });

  // FUNCTIONS

  function setupDragAndDrop(taskElement) {
    taskElement.addEventListener("dragstart", (e) => {
        draggedItem = e.target;
        draggedItem.classList.add("dragging");
    });

    taskElement.addEventListener("dragend", () => {
        draggedItem.classList.remove("dragging");
        draggedItem = null;
    });

    taskElement.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    taskElement.addEventListener("drop", (e) => {
        e.preventDefault();
        if (draggedItem !== taskElement) {
            const allItems = Array.from(taskList.children);
            const draggedIndex = allItems.indexOf(draggedItem);
            const targetIndex = allItems.indexOf(taskElement);

            if (draggedIndex < targetIndex) {
                taskElement.after(draggedItem);
            } else {
                taskElement.before(draggedItem);
            }
            saveTasks();  // Reorder tasks in local storage
        }
    });
}


  function deleteTask(taskElement) {
    taskElement.remove();
    saveTasks();  // Save to local storage after deletion
}

const deleteButton = document.createElement("button");
deleteButton.textContent = "❌";
deleteButton.addEventListener("click", () => deleteTask(taskElement));


  document.getElementById("order-date").addEventListener("click", () => {
    const tasksArray = Array.from(taskList.children);
    tasksArray.sort((a, b) => {
        const dateA = a.getAttribute("data-due-date");
        const dateB = b.getAttribute("data-due-date");
        return new Date(dateA) - new Date(dateB);  // Sort ascending
    });
    tasksArray.forEach((task) => taskList.appendChild(task)); // Re-append sorted tasks
});

document.getElementById("order-priority").addEventListener("click", () => {
  const tasksArray = Array.from(taskList.children);
  tasksArray.sort((a, b) => {
      const priorityA = a.getAttribute("data-priority");
      const priorityB = b.getAttribute("data-priority");

      const priorityLevels = {
          "Critical": 1,
          "Normal": 2,
          "Low": 3
      };

      return priorityLevels[priorityA] - priorityLevels[priorityB];  // Sort by priority level
  });

  tasksArray.forEach((task) => taskList.appendChild(task)); // Re-append sorted tasks
});

function toggleComplete(taskElement) {
  taskElement.classList.toggle("completed");
  saveTasks();  // Save to local storage after toggle
}

const completeButton = document.createElement("button");
completeButton.textContent = "✔";
completeButton.addEventListener("click", () => toggleComplete(taskElement));




  function filterByCategory() {
    const categoryDropdown = document.getElementById("category-input");
    const selectedCategory = categoryDropdown.value;
    const tasks = document.querySelectorAll("#task-list li");

    tasks.forEach((task) => {
        if (selectedCategory === "" || task.getAttribute("data-category") === selectedCategory) {
            task.style.display = "flex";
        } else {
            task.style.display = "none";
        }
    });
}

document.getElementById("category-input").addEventListener("change", filterByCategory);


  function addCategoryToDropdown(category) {
    const categoryDropdown = document.getElementById("category-input");
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryDropdown.appendChild(option);
}



  // Function to add a new task
  function addTask(text) {
    const categoryInput = document.getElementById("category-input");
    const categoryText = categoryInput.value;
    const priorityInput = document.getElementById("priority-input");
    const priorityText = priorityInput.value;
    const dateText = dateInput.value;

    const li = document.createElement("li");
    li.setAttribute("data-task-text", text);
    li.setAttribute("data-category", categoryText);
    li.setAttribute("data-priority", priorityText);
    li.setAttribute("data-due-date", dateText);
    li.setAttribute("draggable", "true");

    // Create a drag handle with six dots in a 2x3 grid
    const dragHandle = document.createElement("div");
    dragHandle.classList.add("drag-handle");
    dragHandle.innerHTML = `
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
    `;
    li.appendChild(dragHandle);

    // Create the "complete" button
    const completeBtn = document.createElement("button");
    completeBtn.classList.add("complete-btn");
    completeBtn.textContent = "✔";
    completeBtn.setAttribute("aria-label", "Mark task as completed");
    completeBtn.addEventListener("click", () => {
        li.classList.toggle("completed");
        completeBtn.classList.toggle("blue", li.classList.contains("completed"));
        saveTasks();  // Save to local storage after marking as completed
    });

    // Create the "delete" button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.setAttribute("aria-label", "Delete task");
    deleteBtn.addEventListener("click", () => {
        li.remove();
        saveTasks();  // Save to local storage after deletion
    });

    // Task Text: editable span for task text
    const taskTextElement = document.createElement("span");
    taskTextElement.setAttribute("contenteditable", "true");
    taskTextElement.textContent = text;
    taskTextElement.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            const newTaskText = taskTextElement.textContent.trim();
            if (newTaskText) {
                li.setAttribute("data-task-text", newTaskText);
                saveTasks();  // Save updated task text to local storage
            } else {
                li.remove();  // Remove the task if text is empty
            }
        }
    });

    taskTextElement.addEventListener("blur", () => {
        const newText = taskTextElement.textContent.trim();
        if (newText !== text) {
            li.setAttribute("data-task-text", newText);
            saveTasks();  // Save updated task text to local storage
        }
    });

    // Due Date: editable span for task due date
    const dueDateSpan = document.createElement("span");
    dueDateSpan.classList.add("due-date");
    dueDateSpan.textContent = dateText;
    dueDateSpan.setAttribute("contenteditable", "true");

    dueDateSpan.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            const newDueDate = dueDateSpan.textContent.trim();
            if (newDueDate) {
                li.setAttribute("data-due-date", newDueDate);
                dueDateSpan.textContent = newDueDate;
                saveTasks();  // Save updated due date to local storage
            }
        }
    });

    // Add Category to the task (not needed for the layout change, but it's part of the task data)
    const categorySpan = document.createElement("span");
    categorySpan.classList.add("category");
    categorySpan.textContent = categoryText;

    // Priority: span to show task priority on the right of the due date
    const prioritySpan = document.createElement("span");
    prioritySpan.classList.add("priority");
    prioritySpan.textContent = priorityText;

    // Append the task components
    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    li.appendChild(taskTextElement);
    li.appendChild(dueDateSpan);
    li.appendChild(prioritySpan);  // Add the priority span after the due date

    // Append the task to the task list
    taskList.appendChild(li);

    // Setup drag-and-drop for the task
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
            saveTasks();  // Reorder tasks in local storage
        }
    });
}



  // Function to filter completed tasks
  function showCompletedTasks() {
    const lis = taskList.querySelectorAll("li");
    lis.forEach((li) => {
      if (li.classList.contains("completed")) {
        li.style.display = "flex";
      } else {
        li.style.display = "none";
      }
    });
  }

  // Function to filter incomplete tasks
  function showIncompleteTasks() {
    const lis = taskList.querySelectorAll("li");
    lis.forEach((li) => {
      if (!li.classList.contains("completed")) {
        li.style.display = "flex";
      } else {
        li.style.display = "none";
      }
    });
  }

  // Function to show all tasks
  function showAllTasks() {
    const lis = taskList.querySelectorAll("li");
    lis.forEach((li) => {
      li.style.display = "flex";
    });
  }

  // Event listeners for the "Completed" and "Incomplete" buttons
  completedButton.addEventListener("click", showCompletedTasks);
  incompletedButton.addEventListener("click", showIncompleteTasks);

  // Event listener for showing all tasks
  document.getElementById("show-all").addEventListener("click", showAllTasks);

  function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#task-list li").forEach((li) => {
        tasks.push({
            text: li.getAttribute("data-task-text"),
            category: li.getAttribute("data-category"),
            priority: li.getAttribute("data-priority"),
            completed: li.classList.contains("completed"),
            dueDate: li.getAttribute("data-due-date"),
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


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
      const prioritySpan = taskList.lastChild.querySelector(".priority");
      if (prioritySpan) {
          prioritySpan.textContent = task.priority;
      }
  });
}


  loadTasks();
});