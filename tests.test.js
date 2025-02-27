// Create a new list item.  Set the text content.  Set a custom attribute.  Return the li element.

function addTaskToList(taskText, dueDate) {
    const li = document.createElement("li");
    li.textContent = `${taskText} (Due: ${dueDate})`;
    li.setAttribute("data-dueDate", dueDate);
    return li;
}

// Filter the tasks array.  Return a new array containing only the tasks that match the condition provided inside the filter method.  Check if the completed property of each task matches the status passed to the function.  Check if task.completed is equal to status.  If the condition is true, that task will be included in the filtered result.

function filterTasks(tasks, status) {
    return tasks.filter(task => task.completed === status);
}

// Remove the task from the original position.  Remove one element starting at the from index.  The splice method returns an array of the removed elements.  Use 0 to access the first and only element from the array returned by splice.  This task is now stored in the variable task and is removed from the tasks array.  Insert the task at the new position.  Return the updated array.  

function reorderTasks(tasks, fromIndex, toIndex) {
    const task = tasks.splice(fromIndex, 1)[0];
    tasks.splice(toIndex, 0, task);
    return tasks;
}



// Test adding a task with due date
test("Add task to list with due date", () => {
    const taskText = "Test Task";
    const dueDate = "2025-03-01";
    const taskItem = addTaskToList(taskText, dueDate);
    expect(taskItem.textContent).toBe(`${taskText} (Due: ${dueDate})`);
    expect(taskItem.getAttribute("data-dueDate")).toBe(dueDate);
});

// Test filtering tasks by completion status
test("Filter tasks by completion status", () => {
    const tasks = [
        { completed: true, text: "Completed Task" },
        { completed: false, text: "Incomplete Task" },
    ];

    const completedTasks = filterTasks(tasks, true);
    expect(completedTasks.length).toBe(1);
    expect(completedTasks[0].text).toBe("Completed Task");

    const incompleteTasks = filterTasks(tasks, false);
    expect(incompleteTasks.length).toBe(1);
    expect(incompleteTasks[0].text).toBe("Incomplete Task");
});

// Test reordering tasks via drag-and-drop
test("Reorder tasks via drag and drop", () => {
    const tasks = [
        { text: "Task 1", completed: false },
        { text: "Task 2", completed: false },
        { text: "Task 3", completed: false },
    ];

    const reorderedTasks = reorderTasks(tasks, 0, 2);
    expect(reorderedTasks[0].text).toBe("Task 2");
    expect(reorderedTasks[2].text).toBe("Task 1");
});
