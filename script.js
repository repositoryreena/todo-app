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
  const localDate = today.toLocaleDateString("en-CA"); // This will format it as YYYY-MM-DD based on local time
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
  // This function will show or hide the task form based on the boolean value passed
  // It will also reset the form when hiding it
  function toggleTaskForm(show) {
    taskForm.style.display = show ? "block" : "none";
    if (!show) resetTaskForm();
  }

  // Toggle category form visibility
  // This function will show or hide the category form based on the boolean value passed
  // It will also reset the form when hiding it
  function toggleCategoryForm(show) {
    categoryForm.style.display = show ? "block" : "none";
    if (!show) resetCategoryForm();
  }

  // Reset the task form
  // This function will clear the input fields for adding a new task
  // It will also reset the dropdowns to their default values
  // This function will be called when the task form is hidden
  // to ensure the form is cleared for the next use
  function resetTaskForm() {
    taskInput.value = "";
    dateInput.value = "";
    priorityInput.value = "Normal";
    categoryInput.value = "";
  }

  // Reset the category form
  // This function will clear the input field for adding a new category
  // This function will be called when the category form is hidden
  // to ensure the form is cleared for the next use
  // It will also reset the dropdowns to their default values
  function resetCategoryForm() {
    newCategoryInput.value = "";
  }

  // Add a new task
  // This function will add a new task to the tasks array and re-render the tasks list
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
  // This function will add a new category to the categories array and re-render the categories
  // It will also save the updated categories to localStorage
  // This function will be called when the "OK" button is clicked in the category form
  // It will also hide the category form after adding the new category
  // If the category input is empty or already exists, it will not be added
  // The category input will be trimmed to remove any leading or trailing whitespace
  // The category will be added to the categories array and saved to localStorage
  // The categories will be re-rendered to reflect the new category
  // The category form will be hidden after adding the new category
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
  // This function will filter the tasks based on the selected category and re-render the tasks list
  // It will also sort the tasks based on the selected category
  // If "ALL" is selected, the tasks will be sorted by completion status and priority
  // If "INCOMPLETE" is selected, only incomplete tasks will be shown
  // If a specific category is selected, only tasks with that category will be shown
  // The tasks will be sorted by completion status and priority within the selected category
  function filterTasksByCategory() {
    const selectedCategory = showDropdown.value;

    // Filter tasks based on the selected category
    let filteredTasks = tasks.filter((task) => {
      return (
        selectedCategory === "ALL" ||
        task.category === selectedCategory ||
        (selectedCategory === "INCOMPLETE" && !task.completed)
      );
    });

    // If "ALL" is selected, modify the original tasks array in place
    if (selectedCategory === "ALL") {
      // Sort the original `tasks` array in place
      tasks.sort((a, b) => {
        // First, sort by completion status (Incomplete -> Complete)
        if (a.completed === b.completed) {
          // If completion status is the same, sort by priority (Critical -> Normal -> Low)
          const priorityLevels = { Critical: 1, Normal: 2, Low: 3 };
          return priorityLevels[a.priority] - priorityLevels[b.priority];
        } else {
          return a.completed ? 1 : -1; // Incomplete tasks first
        }
      });

      // Save the sorted tasks to localStorage
      localStorage.setItem("sortedTasks", JSON.stringify(tasks));

      // After sorting the original array, use it for rendering
      filteredTasks = [...tasks]; // Update filteredTasks to reflect the sorted `tasks`
    }

    // Render the tasks (filtered or sorted, depending on the category)
    renderTasks(filteredTasks);
  }

  // Load the tasks from localStorage when the page loads (if available)
  window.addEventListener("DOMContentLoaded", () => {
    const savedTasks = localStorage.getItem("sortedTasks");
    if (savedTasks) {
      tasks = JSON.parse(savedTasks);
      // After loading tasks from localStorage, you may want to re-render them
      renderTasks(tasks);
    }
  });

  // Sort tasks by date or priority
  // This function will sort the tasks based on the selected option and re-render the tasks list
  // If "DATE" is selected, the tasks will be sorted by due date (earliest to latest)
  // If "PRIORITY" is selected, the tasks will be sorted by priority (Critical -> Normal -> Low)
  // The sorted tasks will be saved to localStorage
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
  // This function will render the tasks in the task list based on the provided task data
  // It will also add event listeners for completing tasks and deleting tasks
  // The tasks will be rendered with the task text, due date, priority, category, completion status, and delete button
  // The tasks will be draggable to allow reordering
  // The completion status will be toggled when clicking the checkmark
  // The task will be deleted when clicking the delete button
  // The tasks will be re-rendered when the order changes
  // The tasks will be re-rendered when the category changes
  // The tasks will be re-rendered when a new task is added
  // The tasks will be re-rendered when a task is marked as complete
  // The tasks will be re-rendered when a task is deleted
  // The tasks will be re-rendered when the page loads
  // The tasks will be re-rendered when the page is refreshed
  // The tasks will be re-rendered when the page is closed and reopened
  // The tasks will be re-rendered when the browser is refreshed
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
      li.setAttribute("draggable", true); // Make the task item draggable
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
        const targetIndex = e.target.closest("li").dataset.index;

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
  // This function will return the color based on the priority level
  // The color will be red for Critical, yellow for Normal, and green for Low
  // If the priority is not recognized, it will default to
  // white to ensure the text is visible
  // The priority color will be used to style the priority bubble
  // The priority color will be used to style the task text
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
  // This function will return a pastel color based on the category index
  // The colors will cycle through a predefined array of pastel colors
  // The category color will be used to style the category bubble
  // The category color will be used to style the task text
  // The category color will be used to style the category dropdown
  // The category color will be used to style the task form dropdown
  // The category color will be used to style the category form dropdown
  // The category color will be used to style the category form input
  // The category color will be used to style the task form input
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
  // This function will speak the provided text using the Web Speech API
  // The language will be set to English (en-US) for consistent pronunciation
  // The text will be spoken using the default voice of the browser
  // The text will be spoken with the default rate, pitch, and volume
  // The text will be spoken asynchronously without waiting for completion
  function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US"; // Set language to English
    window.speechSynthesis.speak(speech);
  }

  // Modify the toggleComplete function to add speech
  // Modify the toggleComplete function to add the flying start from the bottom of the viewport
  // This function will toggle the completion status of a task and re-render the tasks list
  // It will also save the updated tasks to localStorage
  // The completion status will be toggled when clicking the checkmark
  // The task will be marked as complete when the checkmark is clicked
  // The task will be marked as incomplete when the checkmark is clicked again
  // The task list item will be updated with a checkmark when the task is complete
  // The task list item will be updated with a checkmark when the task is incomplete
  // The task list item will be updated with a unicorn image when the task is complete
  // The task list item will be updated with a rainbow gradient when the task is complete
  function toggleComplete(index) {
    if (index !== null && tasks[index]) {
      tasks[index].completed = !tasks[index].completed; // Toggle the completion status
      saveData(); // Save updated tasks to localStorage

      // Find the task list item that has the task at the specific index
      const taskItem = taskList.children[index + 1]; // Skip the header
      const checkmarkCircle = taskItem.querySelector(".inner-circle");

      // Array of unicorn images
      const unicornImages = [
        "https://images.vexels.com/media/users/3/300422/isolated/preview/13b76e494fb4c3be066067eb87211a9e-cute-otters-holding-hands.png",
        "https://png.pngtree.com/png-clipart/20241024/original/pngtree-cute-rainbow-unicorn-clipart-illustration-perfect-for-kids-png-image_16485172.png",
        "https://image.spreadshirtmedia.com/image-server/v1/designs/1031459131,width=178,height=178.png",
        "https://images.vexels.com/media/users/3/235729/isolated/preview/1f45cabb11f6aac3567b12b53ffa44ff-flying-profile-phoenix-bird-color-stroke.png",
        "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2ac48f00-ac85-4f4a-9495-7de757935cfd/dctgh43-0388601c-7d1b-4bbf-b7bc-95eddbf5a0da.png/v1/fill/w_1920,h_1920/mary_poppins_by_thatjoegunderson_dctgh43-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTkyMCIsInBhdGgiOiJcL2ZcLzJhYzQ4ZjAwLWFjODUtNGY0YS05NDk1LTdkZTc1NzkzNWNmZFwvZGN0Z2g0My0wMzg4NjAxYy03ZDFiLTRiYmYtYjdiYy05NWVkZGJmNWEwZGEucG5nIiwid2lkdGgiOiI8PTE5MjAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.MS6GVkQBH8O81AP63a4Omonwl5GhK2t2hw7moZDccd4",
        "https://www.drawingwars.com/assets/img/cartoons/how-to-draw-the-house-from-up-step-by-step/how-to-draw-the-house-from-up-step-by-step_transparent.png",
        "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c92b1cb3-0580-489f-8a32-ff0a3571b156/dg61upf-7696aa27-1685-4061-8807-a9967cc567ff.png/v1/fill/w_1280,h_501/superman_flying_by_godzilla200004444_dg61upf-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTAxIiwicGF0aCI6IlwvZlwvYzkyYjFjYjMtMDU4MC00ODlmLThhMzItZmYwYTM1NzFiMTU2XC9kZzYxdXBmLTc2OTZhYTI3LTE2ODUtNDA2MS04ODA3LWE5OTY3Y2M1NjdmZi5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.nASHHidWLFJ_H8_RfYSeEO8w-ewVx8oHwEJL-2HX1IQ",
        "https://pngimg.com/d/paper_plane_PNG20.png",
        "https://spaces-cdn.clipsafari.com/9onkiw666oziwcm3huevgbi9zrym",
        "https://static.vecteezy.com/system/resources/previews/049/326/102/non_2x/boy-flying-kite-free-png.png",
        "https://www.pngmart.com/files/17/Flying-Toothless-Transparent-Background.png",
        "https://www.tbsnews.net/sites/default/files/styles/infograph/public/images/2021/03/18/pngitem_4869353.png",
        "https://content.mycutegraphics.com/graphics/space/alien-flying-ufo.png",
        "https://www.nicepng.com/png/full/434-4349081_dumbo-flying-with-goggles-portable-network-graphics.png",
        "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/3175cc46-8efb-4992-a9c1-d0c0c6f194c4/dhjju9h-df66d794-6854-44ea-81a3-1cc2262cb324.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzMxNzVjYzQ2LThlZmItNDk5Mi1hOWMxLWQwYzBjNmYxOTRjNFwvZGhqanU5aC1kZjY2ZDc5NC02ODU0LTQ0ZWEtODFhMy0xY2MyMjYyY2IzMjQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.KC4Up5cSNTBG_JuvClCM6rBVUg0257NZITBX-FnZAj4",
        "https://www.disneyclips.com/images/images/hercules_pegasus.gif",
        "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/0a071573-3155-4a1f-8610-3289c87744e0/dgjeotl-f020baac-7fd7-4ca0-be82-2595c87dac6d.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzBhMDcxNTczLTMxNTUtNGExZi04NjEwLTMyODljODc3NDRlMFwvZGdqZW90bC1mMDIwYmFhYy03ZmQ3LTRjYTAtYmU4Mi0yNTk1Yzg3ZGFjNmQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.sV0cXa-o3gYfOzZUMp4gCQehePkiHkSrh_eos4mS5C0",
        "https://imgproxy.attic.sh/5H_M7UpFmeMa-kqGirC7irvMFKuWmdUKVl6P-OKFU-8/rs:fit:540:540:1:1/t:1:FF00FF:false:false/aHR0cHM6Ly9hdHRp/Yy5zaC8zeHptY3R1/cWR6OWVoYTlpNncw/dmpjcm54c3l4.webp",
        "https://www.petfed.org/images/blog/harry/Buckbeak.png",
        "https://www.ambiance-sticker.com/images/Image/sticker-et-velo-volant-ambiance-sticker-cinema-ET-bike-R005.png",
        "https://static.vecteezy.com/system/resources/thumbnails/024/599/761/small_2x/kawaii-shooting-star-over-white-png.png",
      ];
      // If task is marked as completed
      if (tasks[index].completed) {
        checkmarkCircle.classList.add("checked");

        // Show unicorn and make it fly across the page with a random image
        const unicorn = document.querySelector(".unicorn");

        // Make sure the unicorn is visible
        unicorn.style.display = "block"; // Make the unicorn visible

        // Get the position of the bottom of the viewport
        const viewportHeight = window.innerHeight;

        // Set initial position of the unicorn at the bottom of the screen
        unicorn.style.bottom = `-${viewportHeight}px`; // Place it below the viewport
        unicorn.style.left = `${Math.random() * 100}%`; // Randomize the starting horizontal position

        unicorn.style.animation = "none"; // Reset animation to restart it
        unicorn.offsetHeight; // Trigger reflow to restart the animation

        // Apply the flying animation (now starting from the bottom of the screen)
        unicorn.style.animation = "flyDiagonal 5s forwards"; // Apply the diagonal flying animation

        const randomImage =
          unicornImages[Math.floor(Math.random() * unicornImages.length)];
        unicorn.style.backgroundImage = `url(${randomImage})`; // Set the random image

        // Only flip the first unicorn image (the otter one)
        if (randomImage === unicornImages[0]) {
          unicorn.style.transform = "scaleX(-1)"; // Flip the otter image
        } else {
          unicorn.style.transform = "scaleX(1)"; // Keep the others unflipped
        }

        // Add the rainbow gradient to the body
        document.body.classList.add("task-checked");

        // Speak based on the image
        if (randomImage === unicornImages[0]) {
          speak("Stay otterly awesome!");
        } else if (randomImage === unicornImages[1]) {
          speak("Believe in magic.");
        } else if (randomImage === unicornImages[2]) {
          speak("I'm just here for the sparkle.");
        } else if (randomImage === unicornImages[3]) {
          speak("Rise from the ashes and soar higher than ever before.");
        } else if (randomImage === unicornImages[4]) {
          speak("Supercalifrajilistickexpialidocious");
        } else if (randomImage === unicornImages[5]) {
          speak("That’s the stuff!");
        } else if (randomImage === unicornImages[6]) {
          speak("Up, up, and away!");
        } else if (randomImage === unicornImages[7]) {
          speak("Even the smallest of dreams can soar high.");
        } else if (randomImage === unicornImages[8]) {
          speak("Fuel your dreams and shoot for the stars.");
        } else if (randomImage === unicornImages[9]) {
          speak("Let your spirit fly as high as the winds take you.");
        } else if (randomImage === unicornImages[10]) {
          speak("Together, we’ll fly into the unknown.");
        } else if (randomImage === unicornImages[11]) {
          speak(
            "All it takes is faith, trust, and a little bit of pixie dust."
          );
        } else if (randomImage === unicornImages[12]) {
          speak("The sky is not the limit—it’s just the beginning.");
        } else if (randomImage === unicornImages[13]) {
          speak("With a little faith and a big heart, anything is possible.");
        } else if (randomImage === unicornImages[14]) {
          speak("I'm like a shooting star, I've come so far.");
        } else if (randomImage === unicornImages[15]) {
          speak("Wings of freedom, boundless skies.");
        } else if (randomImage === unicornImages[16]) {
          speak("To infinity and beyond!");
        } else if (randomImage === unicornImages[17]) {
          speak("Diagonally");
        } else if (randomImage === unicornImages[18]) {
          speak("Fly with grace, land with honor.");
        } else if (randomImage === unicornImages[19]) {
          speak("You did it!");
        } else if (randomImage === unicornImages[20]) {
          speak("You've made your wish a reality! Keep shining bright!");
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
  // This function will delete a task from the tasks array and re-render the tasks list
  // It will also save the updated tasks to localStorage
  // The task will be deleted when clicking the delete button
  // The task will be removed from the tasks array when the delete button is clicked
  // The tasks will be re-rendered to reflect the updated task list
  // The tasks will be re-rendered to reflect the deleted task
  // The tasks will be re-rendered to reflect the changes
  function deleteTask(index) {
    tasks.splice(index, 1); // Remove the task from the array
    saveData(); // Save the updated task list
    renderTasks(); // Re-render the tasks list
  }

  // Save tasks and categories to localStorage
  // This function will save the tasks and categories to localStorage
  // It will convert the tasks and categories arrays to JSON strings before saving
  // The tasks will be saved to localStorage when a new task is added
  // The tasks will be saved to localStorage when a task is marked as complete
  function saveData() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("categories", JSON.stringify(categories));
  }

  // Render categories in the "SHOW" dropdown and task form dropdown
  // This function will render the categories in the dropdowns with pastel colors
  // It will also add the "ALL" and "INCOMPLETE" options to the dropdown
  // The categories will be rendered with pastel colors for better visual distinction
  // The categories will be rendered with pastel colors to match the priority levels
  // The categories will be rendered with pastel colors to match the task list items
  // The categories will be rendered with pastel colors to match the task bubbles
  // The categories will be rendered with pastel colors to match the task text
  // The categories will be rendered with pastel colors to match the task form dropdown
  // The categories will be rendered with pastel colors to match the category form dropdown
  // The categories will be rendered with pastel colors to match the category form input
  // The categories will be rendered with pastel colors to match the task form input
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
  // This function will update the priority dropdown with pastel colors
  // It will set the background color of each option to a pastel color
  // The pastel colors will match the priority levels for better visual distinction
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
  // This function will create an option element with a background color
  // It will set the value, text content, and background color of the option
  // The option will be styled with a pastel background color for better visual distinction
  // The option will be styled with a dark purple text color for better contrast
  // The option will be used for the category dropdown and task form dropdown
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
