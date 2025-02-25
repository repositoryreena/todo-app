function addTaskToList(taskText) {
    const li = document.createElement("li");
    li.textContent = taskText;
    return li;
}

test("Add task to list", () => {
    const taskText = "Test Task";
    const taskItem = addTaskToList(taskText);
    expect(taskItem.textContent).toBe(taskText);
});