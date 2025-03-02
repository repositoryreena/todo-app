document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("todo-form");
  const input = document.getElementById("task-input");
  const dateInput = document.getElementById("date-input");
  const taskList = document.getElementById("task-list");

  const completedButton = document.getElementById("completed");
  const incompletedButton = document.getElementById("incompleted");

  const categoryForm = document.getElementById("category-form");
  const categoryInput = document.getElementById("category-input");
  const categoryList = document.getElementById("category-list");

  // Load stored categories from localStorage
  let categories = JSON.parse(localStorage.getItem("categories")) || [];

  // Function to add a new category
  function addCategory(categoryName) {
    const category = document.createElement("div");
    category.classList.add("category");
    category.textContent = categoryName;
    category.setAttribute("contenteditable", "true"); // Make it editable
    category.setAttribute("tabindex", "0"); // Allow it to be focusable for keyboard edits

    category.addEventListener("focus", () => {
      category.classList.add("editing");
    });

    category.addEventListener("blur", () => {
      category.classList.remove("editing");
      saveCategories(); // Save when user clicks away
      if (category.textContent.trim() === "") {
        deleteCategory(category); // Delete if empty
      }
    });

    // Allow editing the category name when the user presses Enter
    category.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission
        category.blur(); // Remove focus and save changes
        if (category.textContent.trim() === "") {
          deleteCategory(category); // Delete if empty
        }
      }
    });

    categoryList.appendChild(category);
  }

  // Function to delete a category (completely remove it from DOM and localStorage)
  function deleteCategory(category) {
    // Remove from localStorage
    categories = categories.filter(cat => cat !== category.textContent.trim());
    saveCategories();

    // Remove from the DOM
    category.remove();
  }

  // Event listener for category form submission
  categoryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const categoryName = categoryInput.value.trim();
    if (categoryName === "") return; // Don't allow empty categories

    categories.push(categoryName);
    saveCategories(); // Save to localStorage

    addCategory(categoryName);
    categoryInput.value = ""; // Clear input after adding
  });

  // Load saved categories from localStorage
  categories.forEach((category) => {
    addCategory(category);
  });

  // Function to save categories to localStorage
  function saveCategories() {
    const categoryNames = Array.from(categoryList.children).map((category) => category.textContent.trim());
    localStorage.setItem("categories", JSON.stringify(categoryNames));
  }

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
  function addTask(text) {
    const dateText = dateInput.value;
    const li = document.createElement("li");
    li.setAttribute("data-task-text", text);
    li.setAttribute("data-due-date", dateText);
    li.setAttribute("draggable", "true");

    // Create a drag handle with six dots in a 2x3 grid
    const dragHandle = document.createElement("div");
    dragHandle.classList.add("drag-handle");

    // Add six dots in a 2x3 grid
    dragHandle.innerHTML = `
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
  `;
    li.appendChild(dragHandle);

    const completeBtn = document.createElement("button");
    completeBtn.classList.add("complete-btn");
    completeBtn.textContent = "✔";
    completeBtn.setAttribute("aria-label", "Mark task as completed");
    completeBtn.addEventListener("click", () => {
      li.classList.toggle("completed");
      completeBtn.classList.toggle("blue", li.classList.contains("completed"));
      saveTasks();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.setAttribute("aria-label", "Delete task");
    deleteBtn.addEventListener("click", () => {
      li.remove();
      saveTasks();
    });

    const taskTextElement = document.createElement("span");
    taskTextElement.setAttribute("contenteditable", "true");
    taskTextElement.textContent = text;
    taskTextElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const newTaskText = taskTextElement.textContent.trim();
        if (newTaskText) {
          addTask(newTaskText);
          saveTasks();
        } else {
          li.remove(); // If text is empty, remove the task
        }
        taskTextElement.textContent = ""; // Reset the contenteditable field
      }
    });

    // Check if the task is empty when clicking away (blur event)
    taskTextElement.addEventListener("blur", () => {
      if (taskTextElement.textContent.trim() === "") {
        li.remove(); // If the task is empty, remove the task
        saveTasks();
      }
    });

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
          saveTasks();
        }
      }
    });

    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    li.appendChild(taskTextElement);
    li.appendChild(dueDateSpan);

    taskList.appendChild(li);

    // Dragging functionality (remains the same)
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