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
  
    // Filter functions for completed and incompleted tasks
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
  
    // Add a task to the list
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
          li.classList.toggle("completed");
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
  
    // Save tasks to localStorage
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
  
    // Load tasks from localStorage
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
  