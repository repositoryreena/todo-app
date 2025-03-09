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

  const addCategoryBtn = document.getElementById("add-category-btn");
const newCategoryInput = document.getElementById("new-category-input");
const categorySelect = document.getElementById("category-input");


  // Set the min attribute to today's date
  dateInput.setAttribute("min", todayString);

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const taskText = input.value.trim();
    const dueDate = dateInput.value;  // Get the due date
    const priority = document.getElementById("priority-input").value;  // Get the selected priority
    const category = document.getElementById("category-input").value;  // Get the selected category

    if (taskText === "") return; // Don't add empty tasks

    // Add the task with all the details
    addTask(taskText, dueDate, priority, category);

    saveTasks();
    input.value = "";  // Clear the input fields after adding the task
});


    // Load categories from localStorage and populate the dropdown
    // Load tasks and categories from localStorage
    loadTasks();
    loadCategoriesFromLocalStorage();

    // Trigger the filter logic to ensure tasks are displayed based on selected category
    filterTasksByCategory();


  // FUNCTIONS

  // Show all tasks function
// function showAllTasks() {
//   const allTasks = document.querySelectorAll("#task-list li");
//   allTasks.forEach((task) => {
//       task.style.display = "flex";  // Show all tasks
//   });
// }

// // Event listener for "Show All Tasks" button
// document.getElementById("show-all-tasks").addEventListener("click", showAllTasks);


  document.getElementById("category-input").addEventListener("change", filterTasksByCategory);

function filterTasksByCategory() {
    const selectedCategory = document.getElementById("category-input").value;
    const tasks = taskList.querySelectorAll("li");

    tasks.forEach(task => {
        const taskCategory = task.getAttribute("data-category");

        if (selectedCategory === "" || taskCategory === selectedCategory) {
            task.style.display = "flex";  // Show task
        } else {
            task.style.display = "none";  // Hide task
        }
    });
}


function loadCategoriesFromLocalStorage() {
  const categories = JSON.parse(localStorage.getItem("categories")) || [];
  categorySelect.innerHTML = '';  // Clear the dropdown

  // Add the default "Select Category" option
  const defaultOption = document.createElement("option");
  defaultOption.value = '';
  defaultOption.textContent = 'Select Category';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  categorySelect.appendChild(defaultOption);

  // Add each saved category to the dropdown
  categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
  });
}




function saveCategoryToLocalStorage(category) {
  // Get the existing categories from localStorage
  let categories = JSON.parse(localStorage.getItem("categories")) || [];

  // Add the new category to the list
  categories.push(category);

  // Save the updated categories list back to localStorage
  localStorage.setItem("categories", JSON.stringify(categories));
}



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


function addCategoryToDropdown() {
  const newCategory = newCategoryInput.value.trim();

  // Ensure the category is not empty and not already in the dropdown
  if (newCategory && !categoryExists(newCategory)) {
      // Create a new option element for the category
      const option = document.createElement("option");
      option.value = newCategory;
      option.textContent = newCategory;

      // Append new category option to the dropdown
      categorySelect.appendChild(option);

      // Save the new category to localStorage
      saveCategoryToLocalStorage(newCategory);

      // Optionally, reset the input field
      newCategoryInput.value = "";
  } else {
      // Optional: You can add some validation message here if needed
      alert("Please enter a valid category or the category already exists.");
  }
}



function categoryExists(category) {
  const options = categorySelect.querySelectorAll("option");
  return Array.from(options).some(option => option.value === category);
}



addCategoryBtn.addEventListener("click", addCategoryToDropdown);




  // Function to add a new task
  function addTask(text, dueDate = "", priority = "", category = "", completed = false) {
    const li = document.createElement("li");
    li.setAttribute("data-task-text", text);
    li.setAttribute("data-due-date", dueDate);
    li.setAttribute("data-priority", priority);
    li.setAttribute("data-category", category);
    li.setAttribute("draggable", "true");

    // Create task elements
    const taskTextElement = document.createElement("span");
    taskTextElement.setAttribute("contenteditable", "true");
    taskTextElement.textContent = text;

    const dueDateSpan = document.createElement("span");
    dueDateSpan.classList.add("due-date");
    dueDateSpan.textContent = dueDate;  // Display the due date

    const prioritySpan = document.createElement("span");
    prioritySpan.classList.add("priority");
    prioritySpan.textContent = priority;  // Display the priority

    const categorySpan = document.createElement("span");
    categorySpan.classList.add("category");
    categorySpan.textContent = category;  // Display the category

    // Add complete button
    const completeBtn = document.createElement("button");
    completeBtn.classList.add("complete-btn");
    completeBtn.textContent = "✔";
    completeBtn.setAttribute("aria-label", "Mark task as completed");
    completeBtn.addEventListener("click", () => {
        li.classList.toggle("completed");
        completeBtn.classList.toggle("blue", li.classList.contains("completed"));
        saveTasks();
    });

    // Add delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.setAttribute("aria-label", "Delete task");
    deleteBtn.addEventListener("click", () => {
        li.remove();
        saveTasks();
    });

    // Append all elements to the task item
    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    li.appendChild(taskTextElement);
    li.appendChild(dueDateSpan);
    li.appendChild(prioritySpan);
    li.appendChild(categorySpan);

    // Mark as completed if needed
    if (completed) {
        li.classList.add("completed");
    }

    // Append the task to the task list
    taskList.appendChild(li);

    // Save tasks to localStorage after adding a new task
    saveTasks();
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
    const tasksArray = Array.from(taskList.children);  // Get all task list items
    
    // Reset any filtering (Show All resets all tasks, no filtering)
    tasksArray.forEach((task) => {
      task.style.display = "flex";  // Ensure all tasks are shown
    });
  
    // Sort tasks first by incomplete (false) before complete (true), then by priority
    tasksArray.sort((a, b) => {
      const aCompleted = a.classList.contains("completed");
      const bCompleted = b.classList.contains("completed");
  
      // Sort by incomplete tasks first (false) before completed tasks (true)
      if (aCompleted === bCompleted) {
        // If completion status is the same, sort by priority
        const priorityLevels = {
          "Critical": 1,
          "Normal": 2,
          "Low": 3
        };
  
        const aPriority = a.getAttribute("data-priority");
        const bPriority = b.getAttribute("data-priority");
  
        return priorityLevels[aPriority] - priorityLevels[bPriority];  // Sort by priority
      }
  
      // Otherwise, sort incomplete (false) before complete (true)
      return aCompleted - bCompleted;
    });
  
    // Append the sorted tasks back to the task list
    tasksArray.forEach(task => taskList.appendChild(task));  
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
            completed: li.classList.contains("completed"),
            dueDate: li.getAttribute("data-due-date"),
            priority: li.getAttribute("data-priority"),
            category: li.getAttribute("data-category"),
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}



function loadTasks() {
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Clear any existing tasks in the list before reloading
  taskList.innerHTML = '';

  storedTasks.forEach((task) => {
      // Pass all saved task data to addTask()
      addTask(task.text, task.dueDate, task.priority, task.category, task.completed);
  });
}




  loadTasks();
});