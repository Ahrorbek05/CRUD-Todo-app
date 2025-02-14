const formCreate = document.getElementById("form-create");
const formEdit = document.getElementById("form-edit");
const listGroupTodo = document.getElementById("list-group-todo");
const time = document.getElementById("time");
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
const fullDay = document.getElementById("full-day");
const hourEl = document.getElementById("hour");
const minuteEl = document.getElementById("minute");
const secondEl = document.getElementById("second");
const closeEl = document.getElementById("close");

let editItemId;

let todos = JSON.parse(localStorage.getItem("list"))
  ? JSON.parse(localStorage.getItem("list"))
  : [];

if (todos.length) showTodos();

// Time
function getTime() {
  const now = new Date();
  const date = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
  const month =
    now.getMonth() < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1;
  const year = now.getFullYear();
  const hour = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
  const minute =
    now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
  const second =
    now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month_title = now.getMonth();
  fullDay.textContent = `${date} ${months[month_title]}, ${year}`;
  hourEl.textContent = hour;
  minuteEl.textContent = minute;
  secondEl.textContent = second;

  return `${hour}:${minute}, ${date}.${month}.${year}`;
}
setInterval(getTime, 1000);

// Todos
function setTodos() {
  localStorage.setItem("list", JSON.stringify(todos));
}

function showTodos() {
  const todos = JSON.parse(localStorage.getItem("list"));
  listGroupTodo.innerHTML = "";
  todos.forEach((item, i) => {
    listGroupTodo.innerHTML += `
      <li id="todo-${i}" ondblclick="setCompleted(${i})"
        class="list-group-item d-flex justify-content-between align-items-center 
        ${item.completed ? "completed" : ""}" draggable="true">
        <span>${item.text}</span>
        <div class="d-flex align-items-center">
          <span class="opacity-50 me-2">${item.time}</span>
          <img onclick="editTodo(${i})" src="img/edit.svg" alt="edit icon" width="25" height="25" class="me-2">
          <img onclick="deletedTodo(${i})" src="img/delete.svg" alt="delete icon" width="25" height="25">
        </div>
      </li>
    `;
  });

  // Drag and drop event listeners
  document.querySelectorAll("#list-group-todo li").forEach((item) => {
    item.addEventListener("dragstart", drag);
  });
}

function showMessage(where, message) {
  document.getElementById(`${where}`).textContent = message;
  setTimeout(() => {
    document.getElementById(`${where}`).textContent = "";
  }, 3000);
}

// Add todo
formCreate.addEventListener("submit", (e) => {
  e.preventDefault();
  const todoText = formCreate["input-create"].value.trim();
  formCreate.reset();

  if (todoText.length) {
    todos.push({ text: todoText, time: getTime(), completed: false });
    setTodos();
    showTodos();
  } else {
    showMessage("message-create", "Please enter some text...");
  }
});

// Delete todo
function deletedTodo(id) {
  const deletedTodos = todos.filter((item, i) => i !== id);
  todos = deletedTodos;
  setTodos();
  showTodos();
}

// Set completed
function setCompleted(id) {
  const completedTodo = todos.map((item, i) => {
    if (id == i) {
      return { ...item, completed: !item.completed };
    } else {
      return { ...item };
    }
  });
  todos = completedTodo;
  setTodos();
  showTodos();
}

// Edit todo
formEdit.addEventListener("submit", (e) => {
  e.preventDefault();
  const todoText = formEdit["input-edit"].value.trim();
  formEdit.reset();

  if (todoText.length) {
    todos.splice(editItemId, 1, {
      text: todoText,
      time: getTime(),
      completed: false,
    });
    setTodos();
    showTodos();
    close();
  } else {
    showMessage("message-edit", "Please enter some text...");
  }
});

function editTodo(id) {
  open();
  editItemId = id;
}

// Modal functions
overlay.addEventListener("click", close);
closeEl.addEventListener("click", close);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") close();
});

function open() {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function close() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

// Drag and drop functions
function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const draggedElement = document.getElementById(data);
  const targetElement = event.target.closest("li");

  if (targetElement && draggedElement !== targetElement) {
    const todos = JSON.parse(localStorage.getItem("list"));
    const draggedIndex = Array.from(listGroupTodo.children).indexOf(
      draggedElement
    );
    const targetIndex = Array.from(listGroupTodo.children).indexOf(
      targetElement
    );

    // Swap elements in the array
    const temp = todos[draggedIndex];
    todos[draggedIndex] = todos[targetIndex];
    todos[targetIndex] = temp;

    // Save updated array to localStorage
    localStorage.setItem("list", JSON.stringify(todos));

    // Update UI
    showTodos();
  }
}

// Add event listeners for drag and drop
listGroupTodo.addEventListener("dragover", allowDrop);
listGroupTodo.addEventListener("drop", drop);
