document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("todo-form");
    const input = document.getElementById("task-input");
    const taskList = document.getElementById("task-list");

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const taskText = input.value.trim();
        if (taskText === "") return;

        addTask(taskText);
        saveTasks();
        input.value = "";
    });

    function addTask(text) {
        const li = document.createElement("li");
        li.textContent = text;

        const completeBtn = document.createElement("button");
        completeBtn.textContent = "✔";
        completeBtn.addEventListener("click", () => {
            li.classList.toggle("completed");
            saveTasks();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.addEventListener("click", () => {
            li.remove();
            saveTasks();
        });

        li.appendChild(completeBtn);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll("#task-list li").forEach((li) => {
            tasks.push({ text: li.firstChild.textContent, completed: li.classList.contains("completed") });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        storedTasks.forEach((task) => {
            addTask(task.text);
            if (task.completed) taskList.lastChild.classList.add("completed");
        });
    }

    loadTasks();
});