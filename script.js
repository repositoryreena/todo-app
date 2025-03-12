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
  
    const header = document.createElement("li");
    header.classList.add("task-header");
    header.innerHTML = `
      <span>Item Name</span>
      <span>Due Date</span>
      <span>Priority</span>
      <span>Category</span>
      <span>Complete</span>
      <span>Delete</span>
    `;
    taskList.appendChild(header);
  
    taskListData.forEach((task, index) => {
      const li = document.createElement("li");
      li.classList.add("task-item");
      li.setAttribute("draggable", true);  // Make the task item draggable
      li.dataset.index = index; // Store the index in data-index for reference
  
      let taskHTML = `
          <span>${task.text}</span>
          <span>${task.dueDate}</span>
      `;
  
      if (task.priority) {
        let priorityClass = "low";
        if (task.priority === "Critical") priorityClass = "high";
        else if (task.priority === "Normal") priorityClass = "medium";
  
        taskHTML += `<span class="bubble priority ${priorityClass}">${task.priority}</span>`;
      }
  
      if (task.category) {
        const categoryIndex = categories.indexOf(task.category);
        const categoryColor = getCategoryColor(categoryIndex);
        taskHTML += `<span class="bubble category" style="background-color: ${categoryColor};">${task.category}</span>`;
      }
  
      taskHTML += `
        <span class="checkmark-container" data-index="${index}">
          <div class="outer-circle"></div>
          <div class="inner-circle ${task.completed ? "checked" : ""}">
            ${task.completed ? "✔" : ""}
          </div>
        </span>
        <span class="delete-btn-container">
          <button class="delete-btn" data-index="${index}">❌</button>
        </span>
      `;
  
      li.innerHTML = taskHTML;
      taskList.appendChild(li);
  
      // Add event listener for completing task
      const innerCircle = li.querySelector(".inner-circle");
      innerCircle.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleComplete(index);
      });
  
      // Add event listener for delete button
      const deleteButton = li.querySelector(".delete-btn");
      deleteButton.addEventListener("click", () => deleteTask(index));
  
      // Add drag events
      li.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", index);
      });

      
  
      li.addEventListener("dragover", (e) => {
        e.preventDefault(); // Enable dropping
      });
  
      li.addEventListener("drop", (e) => {
        e.preventDefault();
        const draggedIndex = e.dataTransfer.getData("text/plain");
        const targetIndex = e.target.closest('li').dataset.index;
  
        // Swap tasks in the array and re-render
        const draggedTask = tasks[draggedIndex];
        tasks.splice(draggedIndex, 1);
        tasks.splice(targetIndex, 0, draggedTask);
        saveData();
        renderTasks();
      });
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
// Function to speak text using the Web Speech API
function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = 'en-US'; // Set language to English
  window.speechSynthesis.speak(speech);
}

// Modify the toggleComplete function to add speech
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
      'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2ac48f00-ac85-4f4a-9495-7de757935cfd/dctgh43-0388601c-7d1b-4bbf-b7bc-95eddbf5a0da.png/v1/fill/w_1920,h_1920/mary_poppins_by_thatjoegunderson_dctgh43-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTkyMCIsInBhdGgiOiJcL2ZcLzJhYzQ4ZjAwLWFjODUtNGY0YS05NDk1LTdkZTc1NzkzNWNmZFwvZGN0Z2g0My0wMzg4NjAxYy03ZDFiLTRiYmYtYjdiYy05NWVkZGJmNWEwZGEucG5nIiwid2lkdGgiOiI8PTE5MjAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.MS6GVkQBH8O81AP63a4Omonwl5GhK2t2hw7moZDccd4',
      'https://www.drawingwars.com/assets/img/cartoons/how-to-draw-the-house-from-up-step-by-step/how-to-draw-the-house-from-up-step-by-step_transparent.png',
      'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c92b1cb3-0580-489f-8a32-ff0a3571b156/dg61upf-7696aa27-1685-4061-8807-a9967cc567ff.png/v1/fill/w_1280,h_501/superman_flying_by_godzilla200004444_dg61upf-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTAxIiwicGF0aCI6IlwvZlwvYzkyYjFjYjMtMDU4MC00ODlmLThhMzItZmYwYTM1NzFiMTU2XC9kZzYxdXBmLTc2OTZhYTI3LTE2ODUtNDA2MS04ODA3LWE5OTY3Y2M1NjdmZi5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.nASHHidWLFJ_H8_RfYSeEO8w-ewVx8oHwEJL-2HX1IQ',
      'https://pngimg.com/d/paper_plane_PNG20.png',
      'https://spaces-cdn.clipsafari.com/9onkiw666oziwcm3huevgbi9zrym',
      'https://static.vecteezy.com/system/resources/previews/049/326/102/non_2x/boy-flying-kite-free-png.png',
      'https://www.pngmart.com/files/17/Flying-Toothless-Transparent-Background.png',
      'https://www.tbsnews.net/sites/default/files/styles/infograph/public/images/2021/03/18/pngitem_4869353.png',
      'https://content.mycutegraphics.com/graphics/space/alien-flying-ufo.png',
      'https://www.nicepng.com/png/full/434-4349081_dumbo-flying-with-goggles-portable-network-graphics.png',
      'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/3175cc46-8efb-4992-a9c1-d0c0c6f194c4/dhjju9h-df66d794-6854-44ea-81a3-1cc2262cb324.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzMxNzVjYzQ2LThlZmItNDk5Mi1hOWMxLWQwYzBjNmYxOTRjNFwvZGhqanU5aC1kZjY2ZDc5NC02ODU0LTQ0ZWEtODFhMy0xY2MyMjYyY2IzMjQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.KC4Up5cSNTBG_JuvClCM6rBVUg0257NZITBX-FnZAj4',
      'https://www.disneyclips.com/images/images/hercules_pegasus.gif',
      'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/0a071573-3155-4a1f-8610-3289c87744e0/dgjeotl-f020baac-7fd7-4ca0-be82-2595c87dac6d.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzBhMDcxNTczLTMxNTUtNGExZi04NjEwLTMyODljODc3NDRlMFwvZGdqZW90bC1mMDIwYmFhYy03ZmQ3LTRjYTAtYmU4Mi0yNTk1Yzg3ZGFjNmQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.sV0cXa-o3gYfOzZUMp4gCQehePkiHkSrh_eos4mS5C0',
      'https://imgproxy.attic.sh/5H_M7UpFmeMa-kqGirC7irvMFKuWmdUKVl6P-OKFU-8/rs:fit:540:540:1:1/t:1:FF00FF:false:false/aHR0cHM6Ly9hdHRp/Yy5zaC8zeHptY3R1/cWR6OWVoYTlpNncw/dmpjcm54c3l4.webp',
      'https://www.petfed.org/images/blog/harry/Buckbeak.png',
      'https://www.ambiance-sticker.com/images/Image/sticker-et-velo-volant-ambiance-sticker-cinema-ET-bike-R005.png',
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

      // Speak based on the image
      if (randomImage === unicornImages[0]) {
        speak("Stay otterly awesome!");
      } else if (randomImage === unicornImages[1]) {
        speak("Believe in magic.");
      }else if (randomImage===unicornImages[2]){
        speak("I'm just here for the sparkle.")
      
      } else if (randomImage === unicornImages[3]) {
        speak("Rise from the ashes and soar higher than ever before.");
      }else if (randomImage === unicornImages[4]) {
        speak("Supercalifragilisticexpialidocious");
      }else if (randomImage === unicornImages[5]) {
        speak("Adventure is out there!");
      }else if (randomImage === unicornImages[6]) {
        speak("Up, up, and away!");
      }else if (randomImage === unicornImages[7]) {
        speak("Even the smallest of dreams can soar high.");
      }else if (randomImage === unicornImages[8]) {
        speak("Fuel your dreams and shoot for the stars.");
      }else if (randomImage === unicornImages[9]) {
        speak("Let your spirit fly as high as the winds take you.");
      }else if (randomImage === unicornImages[10]) {
        speak("Together, we’ll fly into the unknown.");
      }else if (randomImage === unicornImages[11]) {
        speak("All it takes is faith, trust, and a little bit of pixie dust.");
      }else if (randomImage === unicornImages[12]) {
        speak("The sky is not the limit—it’s just the beginning.");
      }else if (randomImage === unicornImages[13]) {
        speak("With a little faith and a big heart, anything is possible.");
      }
      else if (randomImage === unicornImages[14]) {
        speak("Do you trust me?");
      }
      else if (randomImage === unicornImages[15]) {
        speak("Wings of freedom, boundless skies.");
      }
      else if (randomImage === unicornImages[16]) {
        speak("To infinity and beyond!");
      }
      else if (randomImage === unicornImages[17]) {
        speak("Up, up, and away on a broomstick!");
      }
      else if (randomImage === unicornImages[18]) {
        speak("Fly with grace, land with honor.");
      }else if (randomImage === unicornImages[19]) {
        speak("Be good.")
      }

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