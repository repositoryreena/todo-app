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
function renderTasks(taskListData = tasks) {
  taskList.innerHTML = ''; // Clear the task list before rendering
  taskListData.forEach((task, index) => {
      const li = document.createElement('li');
      li.classList.add('task-item'); // Adding class for styling

      // Set up priority and category colors based on dropdown values
      const priorityColor = getPriorityColor(task.priority);
      const categoryColor = getCategoryColor(task.category);

      li.innerHTML = `
          <span class="checkmark-container" data-index="${index}">
              <span class="checkmark ${task.completed ? 'checked' : ''}">&#10003;</span>
          </span>
          <span>${task.text}</span>
          <span class="task-priority bubble" style="background-color: ${priorityColor}">${task.priority}</span>
          <span class="task-category bubble" style="background-color: ${categoryColor}">${task.category}</span>
          <span>${task.dueDate}</span>
          <button class="delete-btn" data-index="${index}">❌</button>
      `;
      taskList.appendChild(li);

      // Add event listener for the checkmark containers
      const checkmarkContainers = li.querySelectorAll('.checkmark-container');
      checkmarkContainers.forEach(container => {
          container.addEventListener('click', (e) => {
              const index = e.currentTarget.getAttribute('data-index'); // Using currentTarget ensures we get the correct container's index
              toggleComplete(index); // Pass the correct index to toggleComplete
          });
      });

      // Add event listener for the delete buttons
      const deleteButtons = li.querySelectorAll('.delete-btn');
      deleteButtons.forEach(button => {
          button.addEventListener('click', (e) => {
              const index = e.currentTarget.getAttribute('data-index');
              deleteTask(index); // Handle task deletion
          });
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
function getCategoryColor(category) {
  const categoryColors = {
      'Work': '#ffb3ba',       // Light pink for Work
      'Personal': '#ffdfba',   // Light orange for Personal
      'Urgent': '#ffffba',     // Light yellow for Urgent
      'Others': '#baffc9'      // Light green for Others
  };
  return categoryColors[category] || '#bae1ff'; // Default to light blue if undefined
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