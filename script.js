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
  
  function addCategory(categoryName, tasks = []) {
    // Create the category container
    const category = document.createElement("div");
    category.classList.add("category");
  
    // Create the category name element
    const categoryHeader = document.createElement("h3");
    categoryHeader.textContent = categoryName;
    categoryHeader.setAttribute("contenteditable", "true"); // Make it editable
  
    // Add delete button to the category header
    const deleteCategoryBtn = document.createElement("button");
    deleteCategoryBtn.textContent = "❌";
    deleteCategoryBtn.classList.add("delete-category-btn");
    deleteCategoryBtn.setAttribute("aria-label", "Delete category");
    deleteCategoryBtn.addEventListener("click", () => {
      deleteCategory(category);
    });
  
    // Create buttons for sorting tasks
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
  
    // Create buttons for filtering tasks
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
  
    // Append category name and delete button to category header
    categoryHeader.appendChild(deleteCategoryBtn);
    category.appendChild(categoryHeader);
  
    // Create task container
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");
  
    // Create task list (ul)
    const taskUl = document.createElement("ul");
    taskUl.classList.add("task-list");
    taskContainer.appendChild(taskUl);
  
    // Create form to add tasks under this category
    const taskForm = document.createElement("form");
    const taskInput = document.createElement("input");
    taskInput.type = "text";
    taskInput.placeholder = "Enter a task";
    const taskDateInput = document.createElement("input");
    taskDateInput.type = "date";
  
    // Create priority selection dropdown
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
  
    // Event listener to add task when form is submitted
    taskForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const taskText = taskInput.value.trim();
      const taskDate = taskDateInput.value;
      const taskPriority = prioritySelect.value;
      if (taskText === "") return;
      addTaskToCategory(taskText, taskDate, taskPriority, taskUl);
      taskInput.value = "";
      taskDateInput.value = "";
      prioritySelect.value = "Normal"; // Reset priority to default
      saveCategories(); // Save categories to localStorage
    });
  
    // Add event listener for "Enter" key to add task directly
    taskInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission
        const taskText = taskInput.value.trim();
        const taskDate = taskDateInput.value;
        const taskPriority = prioritySelect.value;
        if (taskText !== "") {
          addTaskToCategory(taskText, taskDate, taskPriority, taskUl);
          taskInput.value = "";
          taskDateInput.value = "";
          prioritySelect.value = "Normal"; // Reset priority to default
          saveCategories(); // Save categories to localStorage
        }
      }
    });
  
    // Append the task form and task container to the category
    category.appendChild(taskForm);
    category.appendChild(taskContainer);
  
    // Append sorting and filtering buttons to the category
    category.appendChild(sortDateBtn);
    category.appendChild(sortPriorityBtn);
    category.appendChild(showCompletedBtn);
    category.appendChild(showIncompleteBtn);
    category.appendChild(showAllBtn);
  
    // Add category to the category list
    categoryList.appendChild(category);
  
    // Load tasks into the task list for this category
    tasks.forEach((task) => addTaskToCategory(task.text, task.dueDate, task.priority, taskUl));
  
    // Enable task dragging for this category's task list
    enableTaskDragging(taskUl);
  }
  
  // Function to delete a category (completely remove it from DOM and localStorage)
  function deleteCategory(category) {
    // Remove from localStorage
    categories = categories.filter(cat => cat.name !== category.querySelector("h3").textContent.trim());
    saveCategories();
  
    // Remove from the DOM
    category.remove();
  }
  
  // Function to add a task to the specific category
  function addTaskToCategory(taskText, taskDate, taskPriority, taskUl) {
    const li = document.createElement("li");
    li.setAttribute("data-task-text", taskText);
    li.setAttribute("data-due-date", taskDate);
    li.setAttribute("data-priority", taskPriority);
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
  
    const completeBtn = document.createElement("button");
    completeBtn.classList.add("complete-btn");
    completeBtn.textContent = "✔";
    completeBtn.setAttribute("aria-label", "Mark task as completed");
    completeBtn.addEventListener("click", () => {
      li.classList.toggle("completed");
      completeBtn.classList.toggle("blue", li.classList.contains("completed"));
      saveCategories();
    });
  
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.setAttribute("aria-label", "Delete task");
    deleteBtn.addEventListener("click", () => {
      li.remove();
      saveCategories();
    });
  
    const taskTextElement = document.createElement("span");
    taskTextElement.setAttribute("contenteditable", "true");
    taskTextElement.textContent = taskText;
    taskTextElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const newTaskText = taskTextElement.textContent.trim();
        if (newTaskText) {
          saveCategories();
        } else {
          li.remove(); // If text is empty, remove the task
        }
      }
    });
  
    // Check if the task is empty when clicking away (blur event)
    taskTextElement.addEventListener("blur", () => {
      if (taskTextElement.textContent.trim() === "") {
        li.remove(); // If the task is empty, remove the task
        saveCategories();
      }
    });
  
    const dueDateSpan = document.createElement("span");
    dueDateSpan.classList.add("due-date");
    dueDateSpan.textContent = taskDate;
    dueDateSpan.setAttribute("contenteditable", "true");
  
    const prioritySpan = document.createElement("span");
    prioritySpan.classList.add("priority");
    prioritySpan.textContent = `Priority: ${taskPriority}`;
  
    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    li.appendChild(taskTextElement);
    li.appendChild(dueDateSpan);
    li.appendChild(prioritySpan);
  
    taskUl.appendChild(li);
  
    // Enable dragging for the new task
    enableTaskDragging(taskUl);
  }
  
  // Function to save categories and tasks to localStorage
  function saveCategories() {
    const categoryData = Array.from(categoryList.children).map((categoryDiv) => {
      const categoryName = categoryDiv.querySelector("h3").textContent.trim();
      const tasks = Array.from(categoryDiv.querySelectorAll(".task-list li")).map((taskLi) => ({
        text: taskLi.querySelector("span").textContent,
        dueDate: taskLi.querySelector(".due-date").textContent,
        priority: taskLi.querySelector(".priority").textContent.replace("Priority: ", ""),
      }));
      return { name: categoryName, tasks };
    });
  
    localStorage.setItem("categories", JSON.stringify(categoryData));
  }
  
  // Function to enable dragging for tasks
  function enableTaskDragging(taskUl) {
    let draggedItem = null;
  
    taskUl.querySelectorAll("li").forEach((task) => {
      task.addEventListener("dragstart", (e) => {
        draggedItem = e.target;
        draggedItem.classList.add("dragging");
      });
  
      task.addEventListener("dragend", () => {
        draggedItem.classList.remove("dragging");
        draggedItem = null;
      });
  
      task.addEventListener("dragover", (e) => {
        e.preventDefault();
      });
  
      task.addEventListener("drop", (e) => {
        e.preventDefault();
        if (draggedItem !== task) {
          const allItems = Array.from(taskUl.children);
          const draggedIndex = allItems.indexOf(draggedItem);
          const targetIndex = allItems.indexOf(task);
  
          if (draggedIndex < targetIndex) {
            taskUl.insertBefore(draggedItem, task.nextSibling);
          } else {
            taskUl.insertBefore(draggedItem, task);
          }
          saveCategories();
        }
      });
    });
  }
  
  // Sorting function for tasks by date
  function sortTasksByDate(category) {
    const taskList = category.querySelector(".task-list");
    const tasks = Array.from(taskList.children);
    tasks.sort((a, b) => {
      const dateA = new Date(a.querySelector(".due-date").textContent);
      const dateB = new Date(b.querySelector(".due-date").textContent);
      return dateA - dateB;
    });
  
    tasks.forEach((task) => {
      taskList.appendChild(task); // Re-append in the sorted order
    });
    saveCategories();
  }
  
  // Sorting function for tasks by priority
  function sortTasksByPriority(category) {
    const taskList = category.querySelector(".task-list");
    const tasks = Array.from(taskList.children);
    tasks.sort((a, b) => {
      const priorityA = a.querySelector(".priority").textContent.replace("Priority: ", "");
      const priorityB = b.querySelector(".priority").textContent.replace("Priority: ", "");
      const priorityOrder = { "Critical": 1, "Normal": 2, "Low": 3 };
      return priorityOrder[priorityA] - priorityOrder[priorityB];
    });
  
    tasks.forEach((task) => {
      taskList.appendChild(task); // Re-append in the sorted order
    });
    saveCategories();
  }
  
  // Filter tasks based on completion status
  // Filter tasks based on completion status
function filterTasks(category, status) {
  const taskList = category.querySelector(".task-list");
  const tasks = Array.from(taskList.children);

  tasks.forEach((task) => {
    const isCompleted = task.classList.contains("completed");
    if (status === "completed" && !isCompleted) {
      task.style.visibility = "hidden"; // Hides completed tasks
    } else if (status === "incomplete" && isCompleted) {
      task.style.visibility = "hidden"; // Hides incomplete tasks
    } else {
      task.style.visibility = "visible"; // Show all tasks
    }
  });
}

  
  categoryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const categoryName = categoryInput.value.trim();
    if (categoryName === "") return;
  
    categories.push({ name: categoryName, tasks: [] });
    saveCategories();
  
    addCategory(categoryName);
    categoryInput.value = ""; // Clear input after adding
  });
  
  // Load saved categories and tasks from localStorage
  categories.forEach((categoryData) => {
    addCategory(categoryData.name, categoryData.tasks);
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