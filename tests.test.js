// This function takes a taskText and dueDate as arguments and creates a new list item element (li) with the task text and due date. The task text is displayed as the text content of the list item, and the due date is included in parentheses after the task text. The due date is also stored as a data attribute (data-dueDate) on the list item element. If the task text is empty or contains only spaces, the function returns null to indicate that no task should be added to the list. This function helps in creating task items with due dates for display in a task list.
function addTaskToList(taskText, dueDate) {
  if (!taskText.trim()) {
    return null; // Return null if taskText is empty or only contains spaces
  }

  const li = document.createElement("li");
  li.textContent = `${taskText} (Due: ${dueDate})`;
  li.setAttribute("data-dueDate", dueDate);
  return li;
}

// This function takes an array of tasks and a status (true or false) as arguments and filters the tasks based on their completion status. It uses the filter method to create a new array containing only tasks that match the specified completion status. The function returns the filtered array of tasks, which can be used to display completed or incomplete tasks separately. This function helps in organizing tasks based on their completion status.
function filterTasks(tasks, status) {
  return tasks.filter((task) => task.completed === status);
}

//This function takes an array of tasks, the index of the task to move (fromIndex), and the index to move the task to (toIndex) as arguments. It uses the splice method to remove the task at the fromIndex and then inserts the task at the toIndex in the same array. The function returns the updated array of tasks with the task reordered based on the specified indices. This function enables users to reorder tasks in a list by dragging and dropping them to different positions.
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
// The getPriorityColor function takes a priority as an argument and returns a corresponding color based on the priority level. It uses an object, priorityColors, to map priority levels (Critical, Normal, and Low) to specific hex color values: red (#ff6f61) for Critical, yellow (#ffcc00) for Normal, and green (#4caf50) for Low. If the function receives an unrecognized priority value, it defaults to returning white (#fff). This function helps in visually indicating different priority levels by color coding.
function getPriorityColor(priority) {
  const priorityColors = {
    Critical: "#ff6f61",
    Normal: "#ffcc00",
    Low: "#4caf50",
  };

  return priorityColors[priority] || "#fff"; // Default to white for unknown priorities
}

// Test for Get priority color
// This test verifies that the getPriorityColor function returns the correct color values for different priority levels. It checks the color values for Critical, Normal, Low, and a non-existent priority. The function should return the corresponding color value for known priorities and default to white (#fff) for unknown priorities.
test("Get priority color", () => {
  expect(getPriorityColor("Critical")).toBe("#ff6f61");
  expect(getPriorityColor("Normal")).toBe("#ffcc00");
  expect(getPriorityColor("Low")).toBe("#4caf50");
  expect(getPriorityColor("Non-existent")).toBe("#fff"); // Default to white for unknown priorities
});

// Assuming you have a function that toggles task completion and displays the unicorn animation.
// The toggleTaskCompletionAndShowUnicorn function is designed to toggle the completion state of a task and trigger a unicorn animation when a task is marked as completed. It takes a taskIndex as an argument, which corresponds to the index of a specific task in a list of elements with the class .task-item. First, it selects the task item and the unicorn element. When called, it toggles the checked class on the selected task, which is typically used to indicate that a task is completed. If the task is marked as completed (i.e., it contains the checked class), the function makes the unicorn visible and applies a flying animation (flyDiagonal) that lasts for 5 seconds. If the task is not completed (i.e., the checked class is removed), the unicorn is hidden. This function combines task management with a fun, animated effect.
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
// This test checks the behavior of the toggleTaskCompletionAndShowUnicorn function when toggling the completion state of a task. It simulates the process of marking a task as completed and then toggling it back to an incomplete state. The test verifies that the unicorn animation is displayed when a task is marked as completed and hidden when the task is incomplete. The function should show the unicorn flying animation when a task is completed and hide the unicorn when the task is incomplete.
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
// The renderCategories function populates a dropdown menu with category options based on an array of category names. It takes an array of category names as an argument and appends an option element for each category to the specified dropdown element. This function is useful for dynamically generating category options in a form or selection menu.
function renderCategories(categories) {
  const categoryDropdown = document.querySelector("#categoryInput");

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.textContent = category;
    categoryDropdown.appendChild(option);
  });
}

// Test for Render categories
// This test verifies that the renderCategories function correctly populates a dropdown menu with category options based on an array of category names. It creates a dropdown element with the id categoryInput and calls the renderCategories function with an array of category names. The test checks that the dropdown menu contains the correct number of options and that each option has the expected text content. 
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
// The updatePriorityDropdown function populates a dropdown menu with priority options and assigns a background color to each option based on the priority level. It creates option elements for each priority level (Critical, Normal, Low) and sets the background color of each option to a corresponding color value. This function enhances the visual representation of priority levels in a dropdown menu.
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
// The deleteTask function removes a task from an array of tasks based on the task index. It uses the splice method to remove the task at the specified index and updates the tasks array in place. This function allows users to delete tasks from a list by providing the index of the task to be removed.
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
// The toggleComplete function toggles the completion status of a task in a tasks array and visually indicates the completion state by adding or removing a checked class from the corresponding task item. If a task is marked as completed, the function displays a flying unicorn animation by setting the display property of the unicorn element to block and applying a flying animation. When the task is marked as incomplete, the unicorn is hidden by setting the display property to none. This function combines task completion management with a fun visual effect.
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
