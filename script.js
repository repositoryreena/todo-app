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
  // The toggleTaskForm function controls the visibility of a task form on the webpage. It takes a boolean parameter show. If show is true, the form's display style is set to "block", making it visible. If show is false, the form's display style is set to "none", hiding it. Additionally, when the form is hidden (show is false), the function calls resetTaskForm(), which likely resets any input fields or data within the form to its default state. This function is typically used for showing or hiding the form based on user interaction.
  function toggleTaskForm(show) {
    taskForm.style.display = show ? "block" : "none";
    if (!show) resetTaskForm();
  }

  // Toggle category form visibility
  // The toggleCategoryForm function operates similarly to the toggleTaskForm function but controls the visibility of a category form instead. It takes a boolean parameter show. If show is true, the form's display style is set to "block", making the category form visible. If show is false, the form is hidden by setting its display style to "none". Additionally, when the form is hidden (show is false), the function calls resetCategoryForm(), which likely resets any input fields or data within the category form. This function is typically used to toggle the visibility and reset the category form based on user interaction.
  function toggleCategoryForm(show) {
    categoryForm.style.display = show ? "block" : "none";
    if (!show) resetCategoryForm();
  }

  // Reset the task form
  // The resetTaskForm function resets the values of various input fields within the task form to their default states. It sets the taskInput field (presumably for the task name or description) to an empty string, clearing any text entered. It also clears the dateInput field, removing any selected date. The priorityInput field is reset to "Normal," which likely represents the default priority level. Lastly, the categoryInput field is cleared, removing any selected category. This function is typically used to ensure the form starts with a clean slate, often after submitting a task or hiding the form.
  function resetTaskForm() {
    taskInput.value = "";
    dateInput.value = "";
    priorityInput.value = "Normal";
    categoryInput.value = "";
  }

  // Reset the category form
  // The resetCategoryForm function resets the category form by clearing the value of the newCategoryInput field, which is likely an input for creating or updating a category. By setting its value to an empty string, it ensures that the field is empty, providing a fresh state for the user to enter a new category. This function is typically used to reset the category form after submission or when the form is hidden.
  function resetCategoryForm() {
    newCategoryInput.value = "";
  }

  // Add a new task
  // The addTask function adds a new task to the task list. It first retrieves the values entered by the user: the task text from taskInput, the due date from dateInput, the priority from priorityInput, and the category from categoryInput. If the task text is empty (after trimming any spaces), the function exits early and does nothing. Otherwise, it creates a new task object with the provided values and sets the completed property to false by default. This new task is then added to the tasks array, the data is saved using saveData(), and the tasks are re-rendered with renderTasks(). Finally, the task form is hidden by calling toggleTaskForm(false). This function handles adding a task to the list and updating the interface accordingly.
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
  // The addCategory function adds a new category to the list of categories. It first retrieves the value entered by the user in the newCategoryInput field and trims any leading or trailing spaces. If the entered category is not empty and doesn't already exist in the categories array, it adds the category to the array, then calls saveData() to save the updated list, and renderCategories() to update the displayed categories. Finally, it hides the category form by calling toggleCategoryForm(false). This function ensures that only unique, non-empty categories are added and updates the data and interface accordingly.
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
  // The filterTasksByCategory function filters and sorts tasks based on the selected category from a dropdown (showDropdown). It first retrieves the selected category and then filters the tasks array based on the category value. If "ALL" is selected, it sorts the tasks array by completion status (placing incomplete tasks first) and then by priority (sorting from "Critical" to "Normal" to "Low"). If a specific category or "INCOMPLETE" is selected, it filters tasks accordingly. After filtering or sorting the tasks, it updates the filteredTasks array and calls renderTasks to update the task display. This function allows users to view tasks based on their category and completion status, and sorts them in a meaningful way when "ALL" is chosen.
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
      // After sorting the original array, use it for rendering
      filteredTasks = [...tasks]; // Update filteredTasks to reflect the sorted `tasks`
    }

    // Render the tasks (filtered or sorted, depending on the category)
    renderTasks(filteredTasks);
  }

  // Sort tasks by date or priority
  // The sortTasks function sorts the tasks based on the user's selection from a dropdown (orderByDropdown). It first retrieves the selected sorting option (sortBy), which can either be "DATE" or "PRIORITY". If "DATE" is selected, it creates a sorted version of the tasks array, ordering the tasks by their due date (earliest to latest). If "PRIORITY" is selected, it sorts the tasks based on priority, with "Critical" having the highest priority, followed by "Normal" and "Low" priorities. The sorting is done by creating a shallow copy of the tasks array to avoid modifying the original array directly. Once sorted, it calls renderTasks to update the task display with the sorted tasks. This function enables the user to view tasks sorted by either their due date or priority.
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
  // The renderTasks function is responsible for displaying a list of tasks on the webpage, updating the task list based on the provided taskListData (or the default tasks array). It first clears the current task list in the taskList container. Then, it creates and appends a header with column labels (Item Name, Due Date, Priority, Category, Complete, and Delete). After that, it iterates over each task in the provided data, generating a new list item (li) for each task.
  // For each task, the function sets up task details such as text, due date, priority (with different classes based on priority level), and category (with a corresponding color). It also adds a checkmark to indicate whether the task is completed and a delete button to remove the task. These elements are made interactive through event listeners: clicking the checkmark toggles the completion status, while clicking the delete button removes the task. Additionally, each task item is made draggable, with event listeners for drag-and-drop functionality. When a task is dragged and dropped, the order of tasks is updated, and the changes are saved.
  // Finally, the function calls renderTasks again after any changes, ensuring the task list is dynamically updated with each action, such as sorting, adding, completing, or deleting tasks. This function handles the dynamic display and interaction of tasks, including their sorting, dragging, and task management features.
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
  // The getPriorityColor function returns a color based on the priority level of a task. It takes a priority parameter and uses an object (priorityColors) to map the priority levels to specific colors: red (#ff6f61) for "Critical," yellow (#ffcc00) for "Normal," and green (#4caf50) for "Low." If the provided priority does not match any of the predefined values, the function defaults to returning white (#fff). This function is typically used to visually represent the priority of tasks by assigning a corresponding color.
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
  // The getCategoryColor function returns a pastel color based on the index of a category. It takes a categoryIndex parameter and uses an array (pastelColors) that contains several light pastel color values. The function ensures that it cycles through the array of pastel colors by using the modulo operator (%). This means that if the categoryIndex exceeds the length of the pastelColors array, it will loop back to the beginning, providing a repeating set of pastel colors. This function is typically used to assign a unique color to each category, ensuring a visually distinct but soft color scheme for different categories.
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
  // The speak function uses the Web Speech API to convert text into speech. It takes a text parameter, which is the content to be spoken. The function creates a new SpeechSynthesisUtterance object, which represents the speech to be synthesized. The lang property of the speech object is set to "en-US" to specify the language as English (US). Finally, the window.speechSynthesis.speak(speech) method is called to initiate the speech synthesis, causing the text to be read aloud by the browser. This function is typically used to add text-to-speech functionality to web applications.
  function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US"; // Set language to English
    window.speechSynthesis.speak(speech);
  }

  // Modify the toggleComplete function to add speech
  // Modify the toggleComplete function to add the flying start from the bottom of the viewport
  // The toggleComplete function toggles the completion status of a task, identified by the index parameter. It first checks if the provided index corresponds to a valid task. If so, it toggles the completed property of the task, saves the updated task list to localStorage, and re-renders the task list. Additionally, when a task is marked as completed, a random unicorn image from a predefined list is shown, along with a playful animation of the unicorn flying across the screen. The body of the page also gets a rainbow effect, and a corresponding voice message is spoken based on the selected unicorn image. The function further updates the UI by changing the appearance of the checkmark circle associated with the task to indicate its completion status, and it cleans up the animation effect once completed.
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
          speak("Super cali fraji listick expi ali docious");
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
  // The deleteTask function removes a task from the tasks array based on the provided index. It uses the splice method to delete the task at that specific index. After removing the task, the updated task list is saved to localStorage using the saveData function. Finally, the function re-renders the task list by calling renderTasks, ensuring the UI is updated to reflect the task's removal.
  function deleteTask(index) {
    tasks.splice(index, 1); // Remove the task from the array
    saveData(); // Save the updated task list
    renderTasks(); // Re-render the tasks list
  }

  // Save tasks and categories to localStorage
  // The saveData function stores the current state of the tasks and categories arrays in the browser's localStorage. It uses localStorage.setItem() to save each array as a string by first converting them into JSON format with JSON.stringify(). This ensures that the data persists even when the page is reloaded or the user returns later, as the arrays are stored locally on the user's device.
  function saveData() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("categories", JSON.stringify(categories));
  }

  // Render categories in the "SHOW" dropdown and task form dropdown
  // The renderCategories function updates the dropdown menus for category selection in the task management application. It starts by clearing any existing options in both the task filter dropdown (showDropdown) and the category input dropdown (categoryInput). It then adds a placeholder option to the filter dropdown and two static options, "ALL" and "INCOMPLETE," with a pastel purple color. The function dynamically populates both dropdowns with category options from the categories array, applying unique pastel colors using the getCategoryColor function. Additionally, it clears and updates the category input dropdown with options, including a default "Select a category" placeholder, and ensures that the priority dropdown is updated by calling the updatePriorityDropdown function, which likely applies corresponding pastel colors to priority levels.
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
  // The updatePriorityDropdown function customizes the appearance of the priority options in the dropdown menu. It defines a set of colors for the three priority levels: "Critical" (red), "Normal" (light pastel yellow), and "Low" (light pastel green). The function loops through each option in the orderByDropdown menu and applies the corresponding background color based on the option's value. It also sets the text color of all options to a dark purple (#5E3C7E) to ensure good contrast and readability. This enhances the visual presentation of the dropdown by making each priority level more distinguishable.
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
  // The createOption function generates an option element for use in a dropdown menu. It accepts three parameters: value, text, and bgColor. The function creates a new option element, sets its value attribute to the provided value, and its text content to the provided text. Additionally, it styles the option by setting its background color to the provided bgColor and the text color to a dark purple (#5E3C7E) for better contrast and readability. This function is used to dynamically create options for dropdown menus, ensuring they are visually distinct and accessible.
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
