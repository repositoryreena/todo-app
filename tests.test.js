// Create a new list item.  Set the text content.  Set a custom attribute.  Return the li element.

function addTaskToList(taskText, dueDate) {
  if (!taskText.trim()) {
    return null; // Return null if taskText is empty or only contains spaces
  }

  const li = document.createElement("li");
  li.textContent = `${taskText} (Due: ${dueDate})`;
  li.setAttribute("data-dueDate", dueDate);
  return li;
}

// Filter the tasks array.  Return a new array containing only the tasks that match the condition provided inside the filter method.  Check if the completed property of each task matches the status passed to the function.  Check if task.completed is equal to status.  If the condition is true, that task will be included in the filtered result.

function filterTasks(tasks, status) {
  return tasks.filter((task) => task.completed === status);
}

// Remove the task from the original position.  Remove one element starting at the from index.  The splice method returns an array of the removed elements.  Use 0 to access the first and only element from the array returned by splice.  This task is now stored in the variable task and is removed from the tasks array.  Insert the task at the new position.  Return the updated array.

function reorderTasks(tasks, fromIndex, toIndex) {
  const task = tasks.splice(fromIndex, 1)[0];
  tasks.splice(toIndex, 0, task);
  return tasks;
}

// Test adding a task with due date
test("Add task to list with due date", () => {
  const taskText = "Test Task";
  const dueDate = "2025-03-01";
  const taskItem = addTaskToList(taskText, dueDate);
  expect(taskItem.textContent).toBe(`${taskText} (Due: ${dueDate})`);
  expect(taskItem.getAttribute("data-dueDate")).toBe(dueDate);
});

// Test filtering tasks by completion status
test("Filter tasks by completion status", () => {
  const tasks = [
    { completed: true, text: "Completed Task" },
    { completed: false, text: "Incomplete Task" },
  ];

  const completedTasks = filterTasks(tasks, true);
  expect(completedTasks.length).toBe(1);
  expect(completedTasks[0].text).toBe("Completed Task");

  const incompleteTasks = filterTasks(tasks, false);
  expect(incompleteTasks.length).toBe(1);
  expect(incompleteTasks[0].text).toBe("Incomplete Task");
});

// Test reordering tasks via drag-and-drop
test("Reorder tasks via drag and drop", () => {
  const tasks = [
    { text: "Task 1", completed: false },
    { text: "Task 2", completed: false },
    { text: "Task 3", completed: false },
  ];

  const reorderedTasks = reorderTasks(tasks, 0, 2);
  expect(reorderedTasks[0].text).toBe("Task 2");
  expect(reorderedTasks[2].text).toBe("Task 1");
});

// Test: Do not add empty task
test("Do not add empty task", () => {
  const taskText = "";
  const dueDate = "2025-03-01";
  const taskItem = addTaskToList(taskText, dueDate);
  expect(taskItem).toBeNull(); // Ensure no task is added if the task text is empty
});

// Test: Do not render HTML tags
test("Do not render HTML tags", () => {
  const taskText = "<strong>Injected HTML</strong>";
  const dueDate = "2025-03-01";
  const taskItem = addTaskToList(taskText, dueDate);
  expect(taskItem.textContent).toBe(
    "<strong>Injected HTML</strong> (Due: 2025-03-01)"
  ); // Check that HTML tags are escaped and not rendered
});

// Test: Do not add task with only a date
test("Do not add task with only a date", () => {
  const taskText = "";
  const dueDate = "2025-03-01";
  const taskItem = addTaskToList(taskText, dueDate);
  expect(taskItem).toBeNull(); // Ensure no task is added if only the date is provided
});

// Function to get the priority color based on the priority
function getPriorityColor(priority) {
  const priorityColors = {
    Critical: "#ff6f61",
    Normal: "#ffcc00",
    Low: "#4caf50",
  };

  return priorityColors[priority] || "#fff"; // Default to white for unknown priorities
}

// Test for Get priority color
test("Get priority color", () => {
  expect(getPriorityColor("Critical")).toBe("#ff6f61");
  expect(getPriorityColor("Normal")).toBe("#ffcc00");
  expect(getPriorityColor("Low")).toBe("#4caf50");
  expect(getPriorityColor("Non-existent")).toBe("#fff"); // Default to white for unknown priorities
});

// Assuming you have a function that toggles task completion and displays the unicorn animation.
function toggleTaskCompletionAndShowUnicorn(taskIndex) {
  const taskItem = document.querySelectorAll(".task-item")[taskIndex];
  const unicorn = document.querySelector(".unicorn");

  // Toggle task completion
  taskItem.classList.toggle("checked");

  // Show flying unicorn animation if task is marked as completed
  if (taskItem.classList.contains("checked")) {
    unicorn.style.display = "block";
    unicorn.style.animation = "flyDiagonal 5s forwards";
  } else {
    unicorn.style.display = "none";
  }
}

// Test for Toggle task completion with unicorn flying
test("Toggle task completion with unicorn flying", () => {
  document.body.innerHTML = `
        <div class="task-item">Task 1</div>
        <div class="unicorn" style="display: none;"></div>
    `;

  toggleTaskCompletionAndShowUnicorn(0);
  const unicorn = document.querySelector(".unicorn");
  const taskItem = document.querySelector(".task-item");

  // Check if unicorn becomes visible
  expect(unicorn.style.display).toBe("block");
  expect(unicorn.style.animation).toBe("flyDiagonal 5s forwards"); // Check for flying animation

  // Now toggle the task back to incomplete
  toggleTaskCompletionAndShowUnicorn(0);
  expect(unicorn.style.display).toBe("none"); // Unicorn should disappear when task is incomplete again
});

// Function to render categories in a dropdown
function renderCategories(categories) {
  const categoryDropdown = document.querySelector("#categoryInput");

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.textContent = category;
    categoryDropdown.appendChild(option);
  });
}

// Test for Render categories
test("Render categories", () => {
  document.body.innerHTML = `<select id="categoryInput"></select>`;

  const categories = ["Work", "Personal", "Shopping"];
  renderCategories(categories);

  const categoryDropdown = document.querySelector("#categoryInput");
  const options = Array.from(categoryDropdown.options);

  expect(options.length).toBe(3);
  expect(options[0].textContent).toBe("Work");
  expect(options[1].textContent).toBe("Personal");
  expect(options[2].textContent).toBe("Shopping");
});

// Function to update the priority dropdown with colors
function updatePriorityDropdown() {
  const priorityDropdown = document.querySelector("#orderByDropdown");
  const priorityColors = [
    { text: "Critical", color: "#ff6f61" },
    { text: "Normal", color: "#ffcc00" },
    { text: "Low", color: "#4caf50" },
  ];

  priorityColors.forEach((priority) => {
    const option = document.createElement("option");
    option.textContent = priority.text;
    option.style.backgroundColor = priority.color;
    priorityDropdown.appendChild(option);
  });
}

// Test for Update priority dropdown with colors
test("Update priority dropdown with colors", () => {
  document.body.innerHTML = `<select id="orderByDropdown"></select>`;

  updatePriorityDropdown();

  const priorityDropdown = document.querySelector("#orderByDropdown");
  const options = Array.from(priorityDropdown.options);

  expect(options.length).toBe(3);
  expect(options[0].style.backgroundColor).toBe("rgb(255, 111, 97)"); // RGB value for #ff6f61
  expect(options[1].style.backgroundColor).toBe("rgb(255, 204, 0)"); // RGB value for #ffcc00
  expect(options[2].style.backgroundColor).toBe("rgb(76, 175, 80)"); // RGB value for #4caf50
});

// Function to delete a task from the tasks array
function deleteTask(tasks, taskIndex) {
  tasks.splice(taskIndex, 1);
}

// Test for Delete task
test("Delete task", () => {
  let tasks = [
    { text: "Task 1", completed: false },
    { text: "Task 2", completed: false },
  ];

  deleteTask(tasks, 0); // Delete the first task
  expect(tasks.length).toBe(1);
  expect(tasks[0].text).toBe("Task 2");
});

// Function to toggle completion and show flying unicorn
function toggleComplete(index, tasks) {
  const task = tasks[index];
  task.completed = !task.completed;
  const taskItem = document.querySelectorAll(".task-item")[index];

  if (task.completed) {
    taskItem.classList.add("checked");
    const unicorn = document.querySelector(".unicorn");
    unicorn.style.display = "block";
    unicorn.style.animation = "flyDiagonal 5s forwards";
  } else {
    taskItem.classList.remove("checked");
    const unicorn = document.querySelector(".unicorn");
    unicorn.style.display = "none";
  }
}

// Test for Toggle task completion and show flying unicorn
test("Toggle task completion and show flying unicorn", () => {
  const tasks = [{ text: "Task 1", completed: false }];
  document.body.innerHTML = `
        <div class="task-item">${tasks[0].text}</div>
        <div class="unicorn" style="display: none;"></div>
    `;

  toggleComplete(0, tasks);
  const taskItem = document.querySelector(".task-item");
  const unicorn = document.querySelector(".unicorn");

  // Task should be marked as completed and unicorn should be visible
  expect(taskItem.classList.contains("checked")).toBe(true);
  expect(unicorn.style.display).toBe("block");

  toggleComplete(0, tasks); // Toggle back to incomplete
  expect(taskItem.classList.contains("checked")).toBe(false);
  expect(unicorn.style.display).toBe("none");
});
