document.addEventListener("DOMContentLoaded", () => {
  const addTaskButton = document.getElementById("add-task-btn");
  const addCategoryButton = document.getElementById("add-category-btn");
  const showDropdown = document.getElementById("show-dropdown");
  const orderByDropdown = document.getElementById("order-dropdown");
  const taskList = document.getElementById("task-list");
  const taskForm = document.getElementById("task-form");
  const categoryForm = document.getElementById("category-form");
  const taskInput = document.getElementById("task-input");
  const dateInput = document.getElementById("date-input");
  const categoryInput = document.getElementById("category-input");
  const priorityInput = document.getElementById("priority-input");
  const newCategoryInput = document.getElementById("new-category-input");

  // Set the min attribute of the date picker to today's date
  const today = new Date();
const localDate = today.toLocaleDateString('en-CA'); // This will format it as YYYY-MM-DD based on local time
dateInput.setAttribute("min", localDate);


  // Set up initial state from localStorage
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let categories = JSON.parse(localStorage.getItem("categories")) || [];

  // Add event listeners
  addTaskButton.addEventListener("click", () => toggleTaskForm(true));
  addCategoryButton.addEventListener("click", () => toggleCategoryForm(true));

  document.getElementById("task-ok-btn").addEventListener("click", addTask);
  document
    .getElementById("category-ok-btn")
    .addEventListener("click", addCategory);

  showDropdown.addEventListener("change", filterTasksByCategory);
  orderByDropdown.addEventListener("change", sortTasks);

  // Functions

  // Toggle task form visibility
  function toggleTaskForm(show) {
    taskForm.style.display = show ? "block" : "none";
    if (!show) resetTaskForm();
  }

  // Toggle category form visibility
  function toggleCategoryForm(show) {
    categoryForm.style.display = show ? "block" : "none";
    if (!show) resetCategoryForm();
  }

  // Reset the task form
  function resetTaskForm() {
    taskInput.value = "";
    dateInput.value = "";
    priorityInput.value = "Normal";
    categoryInput.value = "";
  }

  // Reset the category form
  function resetCategoryForm() {
    newCategoryInput.value = "";
  }

  // Add a new task
  function addTask() {
    const taskText = taskInput.value.trim();
    const dueDate = dateInput.value;
    const priority = priorityInput.value;
    const category = categoryInput.value;

    if (taskText === "") return;

    const newTask = {
      text: taskText,
      dueDate,
      priority,
      category,
      completed: false,
    };

    tasks.push(newTask);
    saveData();
    renderTasks();
    toggleTaskForm(false);
  }

  // Add a new category
  function addCategory() {
    const category = newCategoryInput.value.trim();
    if (category && !categories.includes(category)) {
      categories.push(category);
      saveData();
      renderCategories();
      toggleCategoryForm(false);
    }
  }

  // Filter tasks by category or show all
  function filterTasksByCategory() {
    const selectedCategory = showDropdown.value;
    const filteredTasks = tasks.filter((task) => {
      return (
        selectedCategory === "ALL" ||
        task.category === selectedCategory ||
        (selectedCategory === "INCOMPLETE" && !task.completed)
      );
    });
    renderTasks(filteredTasks);
  }

  // Sort tasks by date or priority
  function sortTasks() {
    const sortBy = orderByDropdown.value;
    let sortedTasks;
    if (sortBy === "DATE") {
      sortedTasks = [...tasks].sort(
        (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
      );
    } else if (sortBy === "PRIORITY") {
      const priorityLevels = { Critical: 1, Normal: 2, Low: 3 };
      sortedTasks = [...tasks].sort(
        (a, b) => priorityLevels[a.priority] - priorityLevels[b.priority]
      );
    }
    renderTasks(sortedTasks);
  }

  // Render tasks in the list
  function renderTasks(taskListData = tasks) {
    taskList.innerHTML = ""; // Clear current task list

    // Add the header row
    const header = document.createElement("li");
    header.classList.add("task-header"); // Add class for styling

    header.innerHTML = `
      <span>Item Name</span>
      <span>Due Date</span>
      <span>Priority</span>
      <span>Category</span>
      <span>Complete</span>
      <span>Delete</span>
  `;

    taskList.appendChild(header); // Append the header to the task list

    // Render each task
    taskListData.forEach((task, index) => {
      const li = document.createElement("li");
      li.classList.add("task-item"); // Adding class for styling

      let taskHTML = `
          <span>${task.text}</span>
          <span>${task.dueDate}</span>
      `;

      // Add the priority bubble if a priority exists
      if (task.priority) {
        let priorityClass = "low"; // Default to low priority
        if (task.priority === "Critical") {
          priorityClass = "high"; // High priority is red
        } else if (task.priority === "Normal") {
          priorityClass = "medium"; // Medium priority is yellow
        }

        taskHTML += `<span class="bubble priority ${priorityClass}">${task.priority}</span>`;
      }

      // Add the category bubble if a category exists
      if (task.category) {
        const categoryIndex = categories.indexOf(task.category); // Find the category index
        const categoryColor = getCategoryColor(categoryIndex); // Get color based on category index
        taskHTML += `<span class="bubble category" style="background-color: ${categoryColor};">${task.category}</span>`;
      }

      // Add the completed status and delete button (one checkmark per task)
      taskHTML += `
          <span class="checkmark-container" data-index="${index}">
              <!-- Outer circle (just decorative) -->
              <div class="outer-circle"></div>
              <!-- Inner circle (clickable) -->
              <div class="inner-circle ${task.completed ? "checked" : ""}">
                  ${task.completed ? "✔" : ""}
              </div>
          </span>
          <span class="delete-btn-container">
              <button class="delete-btn" data-index="${index}">❌</button>
          </span>
      `;

      // Set the inner HTML for the task item
      li.innerHTML = taskHTML;

      // Add the task item to the list
      taskList.appendChild(li);

      // Add event listener for the inner circle to toggle completion
      const innerCircle = li.querySelector(".inner-circle");
      innerCircle.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent event from propagating to parent elements
        toggleComplete(index); // Toggle completion when inner circle is clicked
      });

      // Add event listener for the delete buttons
      const deleteButton = li.querySelector(".delete-btn");
      deleteButton.addEventListener("click", () => deleteTask(index));
    });
  }

  // Helper function to get the background color for the priority
  function getPriorityColor(priority) {
    const priorityColors = {
      Critical: "#ff6f61", // Red for Critical
      Normal: "#ffcc00", // Yellow for Normal
      Low: "#4caf50", // Green for Low
    };
    return priorityColors[priority] || "#fff"; // Default to white if undefined
  }

  // Function to get category color based on index (cycled)
  // Helper function to get the background color for the category
  function getCategoryColor(categoryIndex) {
    const pastelColors = [
      "#F8C8DC",
      "#F9F9C8",
      "#F5E1FF",
      "#D8F1F2",
      "#E1F7D5",
      "#F0F0D4", // Lighter pastel colors
      "#F8C8DC",
      "#F9F9C8",
      "#F5E1FF",
      "#D8F1F2",
      "#E1F7D5",
      "#F0F0D4", // Repeat for more variety
    ];
    return pastelColors[categoryIndex % pastelColors.length]; // Cycle through pastel colors
  }

  // Toggle task completion
  function toggleComplete(index) {
    if (index !== null && tasks[index]) {
      tasks[index].completed = !tasks[index].completed; // Toggle the completion status
      saveData(); // Save updated tasks to localStorage
  
      // Find the task list item that has the task at the specific index
      const taskItem = taskList.children[index + 1]; // Skip the header
      const checkmarkCircle = taskItem.querySelector(".inner-circle");
  
      // Array of unicorn images
      const unicornImages = [
        'https://images.vexels.com/media/users/3/300422/isolated/preview/13b76e494fb4c3be066067eb87211a9e-cute-otters-holding-hands.png',
        'https://png.pngtree.com/png-clipart/20241024/original/pngtree-cute-rainbow-unicorn-clipart-illustration-perfect-for-kids-png-image_16485172.png',
        'https://image.spreadshirtmedia.com/image-server/v1/designs/1031459131,width=178,height=178.png',
        'https://images.vexels.com/media/users/3/235729/isolated/preview/1f45cabb11f6aac3567b12b53ffa44ff-flying-profile-phoenix-bird-color-stroke.png',
      ];
  
      // If task is marked as completed
      if (tasks[index].completed) {
        checkmarkCircle.classList.add("checked");
  
        // Show unicorn and make it fly across the page with a random image
        const unicorn = document.querySelector(".unicorn");
        const randomImage = unicornImages[Math.floor(Math.random() * unicornImages.length)];
        unicorn.style.animation = "none"; // Reset animation
        unicorn.offsetHeight; // Trigger reflow to restart the animation
        unicorn.style.animation = "flyDiagonal 5s forwards"; // Apply the diagonal flying animation
        unicorn.style.backgroundImage = `url(${randomImage})`; // Set the random image
  
        // Only flip the first unicorn image (the otter one)
        if (randomImage === unicornImages[0]) {
          unicorn.style.transform = 'scaleX(-1)'; // Flip the otter image
        } else {
          unicorn.style.transform = 'scaleX(1)'; // Keep the others unflipped
        }
  
        // Add the rainbow gradient to the body
        document.body.classList.add("task-checked");
  
        // Remove the rainbow gradient after animation ends
        setTimeout(() => {
          document.body.classList.remove("task-checked");
        }, 5000); // Match the unicorn animation duration (5s)
      } else {
        checkmarkCircle.classList.remove("checked");
      }
  
      renderTasks(); // Re-render the tasks list to reflect changes
    }
  }
  
  
  
  
  

  // Delete task
  function deleteTask(index) {
    tasks.splice(index, 1); // Remove the task from the array
    saveData(); // Save the updated task list
    renderTasks(); // Re-render the tasks list
  }

  // Save tasks and categories to localStorage
  function saveData() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("categories", JSON.stringify(categories));
  }

  // Render categories in the "SHOW" dropdown and task form dropdown
  function renderCategories() {
    // Clear existing options to avoid duplicates
    showDropdown.innerHTML = "";

    // Add the placeholder option (SHOW)
    const showOption = document.createElement("option");
    showOption.value = "";
    showOption.disabled = true;
    showOption.selected = true;
    showOption.textContent = "SHOW"; // Or use 'Select a Category'
    showDropdown.appendChild(showOption);

    // Add the 'ALL' and 'INCOMPLETE' options (no color)
    showDropdown.appendChild(createOption("ALL", "All", "#F0E6F7")); // Light pastel purple
    showDropdown.appendChild(
      createOption("INCOMPLETE", "Incomplete", "#F0E6F7")
    ); // Light pastel purple

    // Add the categories to the dropdown dynamically with matching pastel colors
    categories.forEach((category, index) => {
      const categoryColor = getCategoryColor(index); // Get pastel color from the color array
      const option = createOption(category, category, categoryColor);
      showDropdown.appendChild(option);
    });

    // Populate the category input dropdown in the task form with matching pastel colors
    categoryInput.innerHTML = ""; // Clear existing options in the category dropdown
    categoryInput.appendChild(createOption("", "Select a category", "#F0E6F7")); // Default option

    categories.forEach((category, index) => {
      const categoryColor = getCategoryColor(index); // Get pastel color from the color array
      const option = createOption(category, category, categoryColor);
      categoryInput.appendChild(option);
    });

    // Update priority dropdown with pastel colors matching the priority levels
    updatePriorityDropdown(); // Call this function to update the priority dropdown
  }

  // Function to update the priority dropdown to use pastel colors
  function updatePriorityDropdown() {
    const priorityOptions = {
      Critical: "#ff6f61", // Red color for Critical
      Normal: "#F9F9C8", // Light pastel yellow for Normal
      Low: "#B7F7C1", // Light pastel green for Low
    };

    Array.from(orderByDropdown.options).forEach((option) => {
      if (option.value === "Critical") {
        option.style.backgroundColor = priorityOptions["Critical"];
      } else if (option.value === "Normal") {
        option.style.backgroundColor = priorityOptions["Normal"];
      } else if (option.value === "Low") {
        option.style.backgroundColor = priorityOptions["Low"];
      }
      option.style.color = "#5E3C7E"; // Dark purple text for better contrast
    });
  }

  // Helper function to create dropdown options with background color
  function createOption(value, text, bgColor) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;
    option.style.backgroundColor = bgColor; // Set the background color to pastel
    option.style.color = "#5E3C7E"; // Dark purple text color for better contrast
    return option;
  }

  // Initialize UI
  renderCategories();
  renderTasks();
});
