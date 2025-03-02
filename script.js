document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("todo-form");
  const input = document.getElementById("task-input");
  const dateInput = document.getElementById("date-input");
  const taskList = document.getElementById("task-list");

  const completedButton = document.getElementById("completed");
  const incompletedButton = document.getElementById("incompleted");

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
                  li.remove();
              }
              taskTextElement.textContent = '';
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

      dueDateSpan.addEventListener("blur", () => {
          const newDueDate = dueDateSpan.textContent.trim();
          if (newDueDate) {
              li.setAttribute("data-due-date", newDueDate);
              dueDateSpan.textContent = newDueDate;
              saveTasks();
          }
      });

      li.appendChild(completeBtn);
      li.appendChild(deleteBtn);
      li.appendChild(taskTextElement);
      li.appendChild(dueDateSpan);

      taskList.appendChild(li);

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
