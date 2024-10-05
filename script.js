const tasks = document.getElementById("tasks");
const newItem = document.getElementById("newItem");

//empty array to store tasks
let items = [];

//check if the local storage has any tasks
if (localStorage.getItem("tasks")) {
  items = JSON.parse(localStorage.getItem("tasks"));
}
//dispaly all items
itemDisplay(items);

function addItem() {
  //check if there is data in the input
  if (newItem.value === "") {
    //alert it is not
    showToast(
      `<i class="fa-solid fa-triangle-exclamation"></i> Please enter a task`
    );
    return;
  }
  //add new task with the value in the input
  addtask(newItem.value);
  //clear the input
  newItem.value = "";
}

//add new task
function addtask(item) {
  //task info
  const data = {
    id: Date.now(),
    title: item,
    completed: false,
  };
  //adding to array of tasks
  items.push(data);
  //dispaly the new item
  itemDisplay(items);
  showToast(`<i class="fa-solid fa-circle-check"></i> Add`);
  //add it to local storage
  localAdd(items);
}

//displau items
function itemDisplay(items) {
  //clear tasks to not make any problem
  tasks.innerHTML = "";

  //loop for every task
  items.forEach((e) => {
    //creating a new div
    let div = document.createElement("div");
    div.className = "task";
    div.setAttribute("data-id", e.id);
    div.appendChild(document.createTextNode(e.title));
    //check if it is done or not
    if (e.completed) {
      div.classList.add("Done");
    }
    //create a new span
    let span = document.createElement("span");
    span.appendChild(document.createTextNode("Delete"));
    span.className = "delete";
    div.appendChild(span);

    let p = document.createElement("span");
    p.appendChild(document.createTextNode("Update"));
    p.className = "update";
    div.appendChild(p);

    //adding div an span to the parent
    tasks.appendChild(div);
  });
}

//localstorage add
function localAdd(items) {
  localStorage.setItem("tasks", JSON.stringify(items));
}

function localget() {
  //get tasks
  let data = localStorage.getItem("tasks");
  if (data) {
    let tasks = JSON.parse(data);
    itemDisplay(tasks);
  }
}

tasks.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    //remove from localstorage
    handleDelete(e.target.parentElement.getAttribute("data-id"));
    //remove from page
    e.target.parentElement.remove();
  }
  if (e.target.classList.contains("task")) {
    handleDone(e.target.getAttribute("data-id"));
    e.target.classList.toggle("Done");
  }
  if (e.target.classList.contains("update")) {
    handleUpdate(e.target.parentElement.getAttribute("data-id"));
  }
});

function handleDelete(id) {
  //see the maching element
  items = items.filter((item) => item.id != id);
  //update localstorage
  localAdd(items);
  showToast(`<i class="fa-solid fa-trash"></i> Deleted successfully`);
}

function handleDone(id) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id == id) {
      items[i].completed == false
        ? (items[i].completed = true)
        : (items[i].completed = false);
    }
  }
  localAdd(items);
  showToast(`<i class="fa-solid fa-check"></i> Checked successfully`);
}
function DeleteAll() {
  tasks.innerHTML = "";
  localStorage.removeItem("tasks");
  items = [];
  showToast(`<i class="fa-solid fa-trash"></i> Deleted All successfully`);
}

function handleUpdate(id) {
  const openInput = document.querySelector("div input.rewrite");

  if (openInput) {
    const parentDiv = openInput.parentElement;

    const originalData = items.find(
      (item) => item.id == parentDiv.getAttribute("data-id")
    ).title;

    parentDiv.textContent = originalData;

    // add the delete and update buttons
    let span = document.createElement("span");
    span.appendChild(document.createTextNode("Delete"));
    span.className = "delete";
    parentDiv.appendChild(span);

    let p = document.createElement("span");
    p.appendChild(document.createTextNode("Update"));
    p.className = "update";
    parentDiv.appendChild(p);
  }

  let taskDiv = document.querySelector(`div[data-id='${id}']`);

  // If there's already an input in this taskDiv do nothing
  if (taskDiv.querySelector("input")) {
    return;
  }

  let currentTitle = taskDiv.firstChild.textContent;
  taskDiv.textContent = ""; //clear the current content

  // Create an input field
  let input = document.createElement("input");
  input.type = "text";
  input.className = "rewrite";
  input.value = currentTitle;

  // Create a confirm button
  let confirmBtn = document.createElement("button");
  confirmBtn.textContent = "Confirm";
  confirmBtn.className = "confirm";

  taskDiv.appendChild(input);
  taskDiv.appendChild(confirmBtn);

  confirmBtn.addEventListener("click", () => {
    let newContent = input.value;

    // Update the task in the items array
    for (let i = 0; i < items.length; i++) {
      if (items[i].id == id) {
        items[i].title = newContent;
      }
    }
    // Update the display and localStorage
    itemDisplay(items);
    localAdd(items);
    showToast(`<i class="fa-solid fa-pen"></i> Updated successfully`);
  });
}

let toastBox = document.getElementById("toastBox");
function showToast(text) {
  let toast = document.createElement("div");
  toast.classList.add("toast");
  toast.innerHTML = text;
  toastBox.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}
