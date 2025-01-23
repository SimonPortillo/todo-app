// To-Do List App

// Select DOM elements
const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const searchInput = document.getElementById('search-input');
const todoList = document.getElementById('todo-list');

// Toggle dark mode
const toggleDarkModeButton = document.getElementById('toggle-dark-mode');
toggleDarkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Load to-dos from local storage
function loadTodos() {
    const todos = localStorage.getItem('todos');
    return todos ? JSON.parse(todos) : [];
}

// Save to-dos to local storage
function saveTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Render to-dos to the DOM
function renderTodos(filter = '') {
    const todos = loadTodos();
    todoList.innerHTML = '';

    todos.filter(todo => todo.text.toLowerCase().includes(filter.toLowerCase()))
         .forEach((todo, index) => {
             const li = document.createElement('li');
             li.className = 'todo-item';

             const header = document.createElement('div');
             header.className = 'header';

             const span = document.createElement('span');
             span.textContent = todo.text;
             span.className = todo.completed ? 'completed' : '';

             const buttonsContainer = document.createElement('div');
             buttonsContainer.className = 'buttons';

             const editButton = document.createElement('button');
             editButton.innerHTML = '<span class="material-symbols-outlined">edit</span>';
             editButton.addEventListener('click', (event) => {
                 event.stopPropagation();
                 editTodo(index);
             });

             const deleteButton = document.createElement('button');
             deleteButton.innerHTML = '<span class="material-symbols-outlined">remove</span>';
             deleteButton.addEventListener('click', (event) => {
                 event.stopPropagation();
                 deleteTodo(index);
             });

             const completeButton = document.createElement('button');
             completeButton.innerHTML = todo.completed 
                 ? '<span class="material-symbols-outlined">check_box</span>' 
                 : '<span class="material-symbols-outlined">check_box_outline_blank</span>';
             completeButton.addEventListener('click', (event) => {
                 event.stopPropagation();
                 toggleComplete(index);
             });

             const dragIndicator = document.createElement('button');
             dragIndicator.innerHTML = '<span class="material-symbols-outlined">drag_indicator</span>';
             dragIndicator.className = 'drag-indicator';

             buttonsContainer.appendChild(editButton);
             buttonsContainer.appendChild(deleteButton);
             buttonsContainer.appendChild(completeButton);
             buttonsContainer.appendChild(dragIndicator);

             header.appendChild(span);
             header.appendChild(buttonsContainer);

             const description = document.createElement('p');
             description.textContent = todo.description || '';
             description.className = 'description';
             description.style.display = 'none'; // Initially hide the description

             if (todo.description) {
                 li.addEventListener('click', () => {
                     const isVisible = description.style.display === 'block';
                     description.style.display = isVisible ? 'none' : 'block';
                     li.classList.toggle('expanded', !isVisible);
                 });
             }

             li.appendChild(header);
             li.appendChild(description);

             todoList.appendChild(li);
         });

    enableDragAndDrop();
}

// Add a new to-do
function addTodo() {
    const text = todoInput.value.trim();
    if (!text) return;

    const todos = loadTodos();
    todos.push({ text, completed: false });
    saveTodos(todos);

    todoInput.value = '';
    renderTodos();
}

// Edit a to-do
function editTodo(index) {
    const todos = loadTodos();
    const newText = prompt('Edit your to-do:', todos[index].text);
    const newDescription = prompt('Edit your description:', todos[index].description || '');
    if (newText !== null) {
        todos[index].text = newText.trim();
        todos[index].description = newDescription.trim();
        saveTodos(todos);
        renderTodos();
    }
}

// Delete a to-do
function deleteTodo(index) {
    const todos = loadTodos();
    todos.splice(index, 1);
    saveTodos(todos);
    renderTodos();
}

// Toggle to-do completion
function toggleComplete(index) {
    const todos = loadTodos();
    todos[index].completed = !todos[index].completed;
    saveTodos(todos);
    renderTodos();
}

// Enable drag and drop functionality
function enableDragAndDrop() {
    const draggables = document.querySelectorAll('.todo-item');
    const container = document.querySelector('.todo-list');

    draggables.forEach(draggable => {
        draggable.setAttribute('draggable', true);

        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        });

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
            saveNewOrder();
        });
    });

    container.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        const dragging = document.querySelector('.dragging');
        if (afterElement == null) {
            container.appendChild(dragging);
        } else {
            container.insertBefore(dragging, afterElement);
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.todo-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function saveNewOrder() {
    const todos = [];
    document.querySelectorAll('.todo-item').forEach(item => {
        const text = item.querySelector('span').textContent;
        const description = item.querySelector('.description').textContent;
        const completed = item.querySelector('span').classList.contains('completed');
        todos.push({ text, description, completed });
    });
    saveTodos(todos);
}

// Update the clock
function updateClock() {
    const clock = document.getElementById('clock');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clock.textContent = `${hours}:${minutes}:${seconds}`;
}

// Search to-dos
searchInput.addEventListener('input', () => {
    renderTodos(searchInput.value);
});

// Add event listener for add button
addButton.addEventListener('click', addTodo);

// Initial render
renderTodos();
enableDragAndDrop();
setInterval(updateClock, 1000);
updateClock();

function randomizeColorScheme() {
    const schemes = [
        'scheme-1',
        'scheme-2',
        'scheme-3',
        'scheme-4',
        // Add more schemes as needed
    ];
    const randomScheme = schemes[Math.floor(Math.random() * schemes.length)];
    document.documentElement.style.setProperty('--background-color', getComputedStyle(document.documentElement).getPropertyValue(`--${randomScheme}-background-color`));
    document.documentElement.style.setProperty('--text-color', getComputedStyle(document.documentElement).getPropertyValue(`--${randomScheme}-text-color`));
    document.documentElement.style.setProperty('--border-color', getComputedStyle(document.documentElement).getPropertyValue(`--${randomScheme}-border-color`));
    document.documentElement.style.setProperty('--button-bg-color', getComputedStyle(document.documentElement).getPropertyValue(`--${randomScheme}-button-bg-color`));
    document.documentElement.style.setProperty('--button-text-color', getComputedStyle(document.documentElement).getPropertyValue(`--${randomScheme}-button-text-color`));
    document.documentElement.style.setProperty('--button-hover-bg-color', getComputedStyle(document.documentElement).getPropertyValue(`--${randomScheme}-button-hover-bg-color`));
    document.documentElement.style.setProperty('--description-color', getComputedStyle(document.documentElement).getPropertyValue(`--${randomScheme}-description-color`));
}
