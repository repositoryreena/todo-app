document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("todo-form");
  const input = document.getElementById("task-input");
  const dateInput = document.getElementById("date-input");
  const taskList = document.getElementById("task-list");

  const completedButton = document.getElementById("completed");
  const incompletedButton = document.getElementById("incompleted");

// Select elements from DOM
const categoryForm = document.getElementById("category-form");
const categoryInput = document.getElementById("category-input");
const categoryList = document.getElementById("category-list");

// Initialize categories array
let categories = JSON.parse(localStorage.getItem("categories")) || [];

// Function to delete a category
function deleteCategory(category) {
  const categoryName = category.querySelector("h3").textContent.trim();
  const cleanedCategoryName = categoryName.replace(/❌/g, "");

  // Filter out the deleted category from the categories array
  categories = categories.filter(cat => cat.name !== cleanedCategoryName);

  // Now, remove the category from the DOM
  category.remove();

  saveCategories(); // Save categories to localStorage after removing a category

  console.log("Category deleted:", cleanedCategoryName);
}

// Function to save categories to localStorage
function saveCategories() {
  // Get the updated categories from the DOM
  const categoryData = Array.from(categoryList.children).map((categoryDiv) => {
    const categoryName = categoryDiv.querySelector("h3").textContent.trim();
    const cleanedCategoryName = categoryName.replace(/❌/g, "");

    const tasks = Array.from(categoryDiv.querySelectorAll(".task-list li")).map((taskLi) => ({
      text: taskLi.querySelector("span").textContent.trim(),
      dueDate: taskLi.querySelector(".due-date").textContent.trim(),
      priority: taskLi.querySelector(".priority").textContent.replace("Priority: ", ""),
      completed: taskLi.classList.contains("completed"),
    }));

    return { name: cleanedCategoryName, tasks };
  });

  // Save the updated categories array to localStorage
  localStorage.setItem("categories", JSON.stringify(categoryData));
  console.log("Categories saved to localStorage.");
}

// Function to load categories from localStorage and render them
function loadCategories() {
  categories.forEach((categoryData) => {
    addCategory(categoryData.name, categoryData.tasks);
  });
}

// Function to add a category to the DOM
function addCategory(categoryName, tasks = []) {
  const category = document.createElement("div");
  category.classList.add("category");

  const categoryHeader = document.createElement("h3");
  categoryHeader.textContent = categoryName;
  categoryHeader.setAttribute("contenteditable", "true");

  const deleteCategoryBtn = document.createElement("button");
  deleteCategoryBtn.textContent = "❌";
  deleteCategoryBtn.classList.add("delete-category-btn");
  deleteCategoryBtn.setAttribute("aria-label", "Delete category");
  deleteCategoryBtn.addEventListener("click", () => {
    deleteCategory(category);
  });

  const sortDateBtn = document.createElement("button");
  sortDateBtn.textContent = "Sort by Date";
  sortDateBtn.addEventListener("click", () => {
    sortTasksByDate(category);
  });

  const sortPriorityBtn = document.createElement("button");
  sortPriorityBtn.textContent = "Sort by Priority";
  sortPriorityBtn.addEventListener("click", () => {
    sortTasksByPriority(category);
  });

  const showCompletedBtn = document.createElement("button");
  showCompletedBtn.textContent = "Show Completed";
  showCompletedBtn.addEventListener("click", () => {
    filterTasks(category, 'completed');
  });

  const showIncompleteBtn = document.createElement("button");
  showIncompleteBtn.textContent = "Show Incomplete";
  showIncompleteBtn.addEventListener("click", () => {
    filterTasks(category, 'incomplete');
  });

  const showAllBtn = document.createElement("button");
  showAllBtn.textContent = "Show All";
  showAllBtn.addEventListener("click", () => {
    filterTasks(category, 'all');
  });

  categoryHeader.appendChild(deleteCategoryBtn);
  category.appendChild(categoryHeader);

  const taskContainer = document.createElement("div");
  taskContainer.classList.add("task-container");

  const taskUl = document.createElement("ul");
  taskUl.classList.add("task-list");
  taskContainer.appendChild(taskUl);

  const taskForm = document.createElement("form");
  const taskInput = document.createElement("input");
  taskInput.type = "text";
  taskInput.placeholder = "Enter a task";
  const taskDateInput = document.createElement("input");
  taskDateInput.type = "date";

  const prioritySelect = document.createElement("select");
  const priorities = ["Critical", "Normal", "Low"];
  priorities.forEach((priority) => {
    const option = document.createElement("option");
    option.value = priority;
    option.textContent = priority;
    prioritySelect.appendChild(option);
  });

  taskForm.appendChild(taskInput);
  taskForm.appendChild(taskDateInput);
  taskForm.appendChild(prioritySelect);

  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    const taskDate = taskDateInput.value;
    const taskPriority = prioritySelect.value;
    if (taskText === "") return;

    addTaskToCategory(taskText, taskDate, taskPriority, taskUl);
    taskInput.value = "";
    taskDateInput.value = "";
    prioritySelect.value = "Normal"; 

    saveCategories(); // Save categories to localStorage after adding a task
  });

  category.appendChild(taskForm);
  category.appendChild(taskContainer);

  category.appendChild(sortDateBtn);
  category.appendChild(sortPriorityBtn);
  category.appendChild(showCompletedBtn);
  category.appendChild(showIncompleteBtn);
  category.appendChild(showAllBtn);

  categoryList.appendChild(category);

  tasks.forEach((task) => addTaskToCategory(task.text, task.dueDate, task.priority, taskUl));

  enableTaskDragging(taskUl);

  console.log("Category added:", categoryName);
}

// Function to add a task to a category
function addTaskToCategory(taskText, taskDate, taskPriority, taskUl) {
  const li = document.createElement("li");
  li.setAttribute("data-task-text", taskText);
  li.setAttribute("data-due-date", taskDate);
  li.setAttribute("data-priority", taskPriority);
  li.setAttribute("draggable", "true");

  const completeBtn = document.createElement("button");
  completeBtn.classList.add("complete-btn");
  completeBtn.textContent = "✔";
  completeBtn.addEventListener("click", () => {
    li.classList.toggle("completed");
    completeBtn.classList.toggle("blue", li.classList.contains("completed"));
    saveCategories(); // Save categories to localStorage after marking as completed
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.addEventListener("click", () => {
    li.remove();
    saveCategories(); // Save categories to localStorage after removing the task
  });

  const taskTextElement = document.createElement("span");
  taskTextElement.textContent = taskText;

  const dueDateSpan = document.createElement("span");
  dueDateSpan.classList.add("due-date");
  dueDateSpan.textContent = taskDate;

  const prioritySpan = document.createElement("span");
  prioritySpan.classList.add("priority");
  prioritySpan.textContent = `Priority: ${taskPriority}`;

  li.appendChild(completeBtn);
  li.appendChild(deleteBtn);
  li.appendChild(taskTextElement);
  li.appendChild(dueDateSpan);
  li.appendChild(prioritySpan);

  taskUl.appendChild(li);
}

// Sorting function for tasks by date
function sortTasksByDate(category) {
  const taskUl = category.querySelector(".task-list");
  const tasks = Array.from(taskUl.children);
  
  tasks.sort((a, b) => {
    const dateA = new Date(a.querySelector(".due-date").textContent);
    const dateB = new Date(b.querySelector(".due-date").textContent);
    return dateA - dateB;
  });

  tasks.forEach(task => taskUl.appendChild(task)); // Reorder tasks in the DOM
  saveCategories(); // Save updated order to localStorage
}

// Sorting function for tasks by priority
function sortTasksByPriority(category) {
  const taskUl = category.querySelector(".task-list");
  const tasks = Array.from(taskUl.children);

  tasks.sort((a, b) => {
    const priorityA = a.querySelector(".priority").textContent.replace("Priority: ", "");
    const priorityB = b.querySelector(".priority").textContent.replace("Priority: ", "");
    const priorityOrder = ["Critical", "Normal", "Low"];
    return priorityOrder.indexOf(priorityA) - priorityOrder.indexOf(priorityB);
  });

  tasks.forEach(task => taskUl.appendChild(task)); // Reorder tasks in the DOM
  saveCategories(); // Save updated order to localStorage
}

// Filtering tasks (Show Completed, Incomplete, All)
function filterTasks(category, filterType) {
  const taskUl = category.querySelector(".task-list");
  const tasks = Array.from(taskUl.children);

  tasks.forEach(task => {
    switch (filterType) {
      case 'completed':
        task.style.display = task.classList.contains("completed") ? "block" : "none";
        break;
      case 'incomplete':
        task.style.display = task.classList.contains("completed") ? "none" : "block";
        break;
      case 'all':
        task.style.display = "block";
        break;
    }
  });
}

// Enable drag and drop functionality
function enableTaskDragging(taskUl) {
  const tasks = Array.from(taskUl.children);
  
  tasks.forEach(task => {
    task.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text", task.innerHTML);
      event.dataTransfer.setData("task-index", Array.from(taskUl.children).indexOf(task));
    });

    task.addEventListener("dragover", (event) => {
      event.preventDefault(); // Allow the drop
    });

    task.addEventListener("drop", (event) => {
      event.preventDefault();

      const draggedTaskIndex = event.dataTransfer.getData("task-index");
      const targetTask = task;
      
      // Swap positions in the DOM
      const draggedTaskElement = taskUl.children[draggedTaskIndex];
      taskUl.insertBefore(draggedTaskElement, targetTask);
      
      saveCategories(); // Save categories to localStorage after reordering
    });
  });
}

// Load saved categories on page load
loadCategories();

// Handle adding a new category
categoryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const categoryName = categoryInput.value.trim();
  if (categoryName === "") return;

  const existingCategory = categories.find(cat => cat.name === categoryName);
  if (existingCategory) {
    console.log("Category already exists:", categoryName);
    return;
  }

  categories.push({ name: categoryName, tasks: [] });
  saveCategories();
  addCategory(categoryName);
  categoryInput.value = "";
});





  


  
  
  


  


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

  // Function to add a new task
  // function addTask(text) {
  //   const dateText = dateInput.value;
  //   const li = document.createElement("li");
  //   li.setAttribute("data-task-text", text);
  //   li.setAttribute("data-due-date", dateText);
  //   li.setAttribute("draggable", "true");

  //   // Create a drag handle with six dots in a 2x3 grid
  //   const dragHandle = document.createElement("div");
  //   dragHandle.classList.add("drag-handle");

  //   // Add six dots in a 2x3 grid
  //   dragHandle.innerHTML = `
  //     <div class="dot"></div>
  //     <div class="dot"></div>
  //     <div class="dot"></div>
  //     <div class="dot"></div>
  //     <div class="dot"></div>
  //     <div class="dot"></div>
  // `;
  //   li.appendChild(dragHandle);

  //   const completeBtn = document.createElement("button");
  //   completeBtn.classList.add("complete-btn");
  //   completeBtn.textContent = "✔";
  //   completeBtn.setAttribute("aria-label", "Mark task as completed");
  //   completeBtn.addEventListener("click", () => {
  //     li.classList.toggle("completed");
  //     completeBtn.classList.toggle("blue", li.classList.contains("completed"));
  //     saveTasks();
  //   });

  //   const deleteBtn = document.createElement("button");
  //   deleteBtn.textContent = "❌";
  //   deleteBtn.setAttribute("aria-label", "Delete task");
  //   deleteBtn.addEventListener("click", () => {
  //     li.remove();
  //     saveTasks();
  //   });

  //   const taskTextElement = document.createElement("span");
  //   taskTextElement.setAttribute("contenteditable", "true");
  //   taskTextElement.textContent = text;
  //   taskTextElement.addEventListener("keydown", (event) => {
  //     if (event.key === "Enter") {
  //       event.preventDefault();
  //       const newTaskText = taskTextElement.textContent.trim();
  //       if (newTaskText) {
  //         addTask(newTaskText);
  //         saveTasks();
  //       } else {
  //         li.remove(); // If text is empty, remove the task
  //       }
  //       taskTextElement.textContent = ""; // Reset the contenteditable field
  //     }
  //   });

  //   // Check if the task is empty when clicking away (blur event)
  //   taskTextElement.addEventListener("blur", () => {
  //     if (taskTextElement.textContent.trim() === "") {
  //       li.remove(); // If the task is empty, remove the task
  //       saveTasks();
  //     }
  //   });

  //   const dueDateSpan = document.createElement("span");
  //   dueDateSpan.classList.add("due-date");
  //   dueDateSpan.textContent = dateText;
  //   dueDateSpan.setAttribute("contenteditable", "true");

  //   dueDateSpan.addEventListener("keydown", (event) => {
  //     if (event.key === "Enter") {
  //       event.preventDefault();
  //       const newDueDate = dueDateSpan.textContent.trim();
  //       if (newDueDate) {
  //         li.setAttribute("data-due-date", newDueDate);
  //         dueDateSpan.textContent = newDueDate;
  //         saveTasks();
  //       }
  //     }
  //   });

  //   li.appendChild(completeBtn);
  //   li.appendChild(deleteBtn);
  //   li.appendChild(taskTextElement);
  //   li.appendChild(dueDateSpan);

  //   taskList.appendChild(li);

  //   // Dragging functionality (remains the same)
  //   li.addEventListener("dragstart", (e) => {
  //     draggedItem = e.target;
  //     draggedItem.classList.add("dragging");
  //   });

  //   li.addEventListener("dragend", () => {
  //     draggedItem.classList.remove("dragging");
  //     draggedItem = null;
  //   });

  //   li.addEventListener("dragover", (e) => {
  //     e.preventDefault();
  //   });

  //   li.addEventListener("drop", (e) => {
  //     e.preventDefault();
  //     if (draggedItem !== li) {
  //       const allItems = Array.from(taskList.children);
  //       const draggedIndex = allItems.indexOf(draggedItem);
  //       const targetIndex = allItems.indexOf(li);

  //       if (draggedIndex < targetIndex) {
  //         li.after(draggedItem);
  //       } else {
  //         li.before(draggedItem);
  //       }
  //       saveTasks();
  //     }
  //   });
  // }

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
    });
  }

  loadTasks();
});