document.addEventListener("DOMContentLoaded", () => {
  
  

  const addTaskButton = document.getElementById('add-task-btn');
  const addCategoryButton = document.getElementById('add-category-btn');
  const showDropdown = document.getElementById('show-dropdown');
  const orderByDropdown = document.getElementById('order-dropdown');
  const taskList = document.getElementById('task-list');
  const taskForm = document.getElementById('task-form');
  const categoryForm = document.getElementById('category-form');
  const taskInput = document.getElementById('task-input');
  const dateInput = document.getElementById('date-input');
  const categoryInput = document.getElementById('category-input');
  const priorityInput = document.getElementById('priority-input');
  const newCategoryInput = document.getElementById('new-category-input');

  // Set the min attribute of the date picker to today's date
  const today = new Date().toISOString().split('T')[0];  // Get today's date in YYYY-MM-DD format
  dateInput.setAttribute('min', today);

  // Set up initial state from localStorage
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let categories = JSON.parse(localStorage.getItem('categories')) || [];

  // Add event listeners
  addTaskButton.addEventListener('click', () => toggleTaskForm(true));
  addCategoryButton.addEventListener('click', () => toggleCategoryForm(true));

  document.getElementById('task-ok-btn').addEventListener('click', addTask);
  document.getElementById('category-ok-btn').addEventListener('click', addCategory);

  showDropdown.addEventListener('change', filterTasksByCategory);
  orderByDropdown.addEventListener('change', sortTasks);

  // Functions

  // Toggle task form visibility
  function toggleTaskForm(show) {
      taskForm.style.display = show ? 'block' : 'none';
      if (!show) resetTaskForm();
  }

  // Toggle category form visibility
  function toggleCategoryForm(show) {
      categoryForm.style.display = show ? 'block' : 'none';
      if (!show) resetCategoryForm();
  }

  // Reset the task form
  function resetTaskForm() {
      taskInput.value = '';
      dateInput.value = '';
      priorityInput.value = 'Normal';
      categoryInput.value = '';
  }

  // Reset the category form
  function resetCategoryForm() {
      newCategoryInput.value = '';
  }

  // Add a new task
  function addTask() {
      const taskText = taskInput.value.trim();
      const dueDate = dateInput.value;
      const priority = priorityInput.value;
      const category = categoryInput.value;

      if (taskText === '') return;

      const newTask = {
          text: taskText,
          dueDate,
          priority,
          category,
          completed: false
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
      const filteredTasks = tasks.filter(task => {
          return selectedCategory === 'ALL' ||
              task.category === selectedCategory ||
              (selectedCategory === 'INCOMPLETE' && !task.completed);
      });
      renderTasks(filteredTasks);
  }

  // Sort tasks by date or priority
  function sortTasks() {
      const sortBy = orderByDropdown.value;
      let sortedTasks;
      if (sortBy === 'DATE') {
          sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      } else if (sortBy === 'PRIORITY') {
          const priorityLevels = { 'Critical': 1, 'Normal': 2, 'Low': 3 };
          sortedTasks = [...tasks].sort((a, b) => priorityLevels[a.priority] - priorityLevels[b.priority]);
      }
      renderTasks(sortedTasks);
  }

  // Render tasks in the list
  // Render tasks in the list
// Render tasks in the list
// Render tasks in the list
// Render tasks in the list
// Render tasks in the list
// Render tasks in the list
// Render tasks in the list


// Render tasks in the list
function renderTasks(taskListData = tasks) {
  taskList.innerHTML = ''; // Clear current task list
  taskListData.forEach((task, index) => {
      const li = document.createElement('li');
      li.classList.add('task-item'); // Adding class for styling

      let taskHTML = `
          <span class="checkmark-container" data-index="${index}">
              <span class="checkmark ${task.completed ? 'checked' : ''}">&#10003;</span>
          </span>
          <span>${task.text}</span>
          <span>${task.dueDate}</span>
      `;

      // Add the priority bubble if a priority exists
      if (task.priority) {
          let priorityClass = 'low';  // Default to low priority
          if (task.priority === 'Critical') {
              priorityClass = 'high'; // High priority is red
          } else if (task.priority === 'Normal') {
              priorityClass = 'medium'; // Medium priority is yellow
          }

          taskHTML += `<span class="bubble priority ${priorityClass}">${task.priority}</span>`;
      }

      // Add the category bubble if a category exists
      if (task.category) {
          const categoryIndex = categories.indexOf(task.category); // Find the category index
          const categoryColor = getCategoryColor(categoryIndex); // Get color based on category index
          taskHTML += `<span class="bubble category" style="background-color: ${categoryColor};">${task.category}</span>`;
      }

      taskHTML += `<button class="delete-btn" data-index="${index}">❌</button>`;

      // Set the inner HTML for the task item
      li.innerHTML = taskHTML;

      // Add the task item to the list
      taskList.appendChild(li);
  });

  // Add event listener for the checkmark circles
  const checkmarkContainers = document.querySelectorAll('.checkmark-container');
  checkmarkContainers.forEach(container => {
      container.addEventListener('click', (e) => {
          const index = e.target.closest('.checkmark-container').getAttribute('data-index');
          toggleComplete(index); // Correctly pass the index to toggleComplete
      });
  });

  // Add event listener for the delete buttons
  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach(button => {
      button.addEventListener('click', (e) => {
          const index = e.target.getAttribute('data-index');
          deleteTask(index);
      });
  });
}






// Helper function to get the background color for the priority
function getPriorityColor(priority) {
  const priorityColors = {
      'Critical': '#ff6f61',  // Red for Critical
      'Normal': '#ffcc00',    // Yellow for Normal
      'Low': '#4caf50'        // Green for Low
  };
  return priorityColors[priority] || '#fff'; // Default to white if undefined
}

// Helper function to get the background color for the category
// Function to get category color based on index (cycled)
function getCategoryColor(categoryIndex) {
  const colors = [
      '#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#d6a7ff', // pastel colors
      '#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#d6a7ff'  // Repeat
  ];
  return colors[categoryIndex % colors.length]; // Cycle through the colors
}





  // Toggle task completion
  // Toggle task completion
// Toggle task completion
// Toggle task completion
// Toggle task completion
// Toggle task completion
// Toggle task completion
function toggleComplete(index) {
  if (index !== null && tasks[index]) {
      tasks[index].completed = !tasks[index].completed;
      saveData();  // Save updated tasks to localStorage

      // Apply the rainbow gradient on task completion
      if (tasks[index].completed) {
          document.body.classList.add('task-checked'); // Add class to apply gradient
          setTimeout(() => {
              document.body.classList.remove('task-checked'); // Remove class after animation ends
          }, 3000); // After 3 seconds, remove the gradient effect
      }

      renderTasks();  // Re-render the tasks list
  } else {
      console.error(`Task at index ${index} not found`);
  }
}









  // Delete task
  // Delete task
function deleteTask(index) {
  tasks.splice(index, 1);  // Remove the task from the array
  saveData();  // Save the updated task list
  renderTasks();  // Re-render the tasks list
}


  // Save tasks and categories to localStorage
  function saveData() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
      localStorage.setItem('categories', JSON.stringify(categories));
  }

  // Render categories in the "SHOW" dropdown
  // Render categories in the "SHOW" dropdown and task form dropdown
// Render categories in the "SHOW" dropdown and task form dropdown
function renderCategories() {
  // Clear existing options to avoid duplicates
  showDropdown.innerHTML = '';

  // Add the placeholder option (SHOW)
  const showOption = document.createElement('option');
  showOption.value = '';
  showOption.disabled = true;
  showOption.selected = true;
  showOption.textContent = 'SHOW'; // Or use 'Select a Category'
  showDropdown.appendChild(showOption);

  // Add the 'ALL' and 'INCOMPLETE' options
  const allOption = document.createElement('option');
  allOption.value = 'ALL';
  allOption.textContent = 'All';
  showDropdown.appendChild(allOption);

  const incompleteOption = document.createElement('option');
  incompleteOption.value = 'INCOMPLETE';
  incompleteOption.textContent = 'Incomplete';
  showDropdown.appendChild(incompleteOption);

  // Add the categories to the dropdown dynamically
  categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      showDropdown.appendChild(option);
  });

  // Populate the category input dropdown in the task form
  categoryInput.innerHTML = '';  // Clear existing options in the category dropdown
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Select a category';
  categoryInput.appendChild(defaultOption);

  categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryInput.appendChild(option);
  });
}



  // Initialize UI
  renderCategories();
  renderTasks();
});