// ========== Navigation ==========
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Hamburger menu
hamburger?.addEventListener('click', () => {
    navMenu?.classList.toggle('active');
});

// Close menu when link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu?.classList.remove('active');
    });
});

// Smooth scroll function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: 'smooth' });
}

// ========== Calculator ==========
function calculate() {
    const num1 = parseFloat(document.getElementById('num1').value);
    const num2 = parseFloat(document.getElementById('num2').value);
    const operation = document.getElementById('operation').value;
    const resultDiv = document.getElementById('calcResult');

    if (isNaN(num1) || isNaN(num2)) {
        resultDiv.textContent = 'Ergebnis: Ungültige Eingabe';
        return;
    }

    let result;
    switch(operation) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '*':
            result = num1 * num2;
            break;
        case '/':
            if (num2 === 0) {
                resultDiv.textContent = 'Ergebnis: Division durch Null!';
                return;
            }
            result = num1 / num2;
            break;
    }

    resultDiv.textContent = `Ergebnis: ${result.toFixed(2)}`;
}

// ========== Todo Liste ==========
let todos = JSON.parse(localStorage.getItem('todos')) || [];

function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();

    if (text === '') {
        alert('Bitte geben Sie eine Aufgabe ein!');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(todo);
    saveTodos();
    renderTodos();
    input.value = '';
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

function renderTodos() {
    const list = document.getElementById('todoList');
    list.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <span onclick="toggleTodo(${todo.id})" style="flex: 1; cursor: pointer;">${todo.text}</span>
            <button class="todo-delete" onclick="deleteTodo(${todo.id})">✕</button>
        `;
        list.appendChild(li);
    });
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

document.getElementById('todoInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

renderTodos();

// ========== Color Generator ==========
function generateColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    setColor(color);
}

function setColor(color) {
    const preview = document.getElementById('colorPreview');
    const input = document.getElementById('colorHex');
    const info = document.getElementById('colorInfo');

    preview.style.backgroundColor = color;
    input.value = color.toUpperCase();
    info.textContent = `Farbe: ${color.toUpperCase()} - RGB: ${hexToRgb(color)}`;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        return `rgb(${r}, ${g}, ${b})`;
    }
    return 'ungültig';
}

const colorInput = document.getElementById('colorHex');
colorInput?.addEventListener('change', () => {
    let color = colorInput.value;
    if (!color.startsWith('#')) {
        color = '#' + color;
    }
    if (/^#[0-9A-F]{6}$/i.test(color)) {
        setColor(color);
    }
});

// Initial color
generateColor();

// ========== Weather Simulator ==========
function updateWeather() {
    const weatherType = document.getElementById('weatherType').value;
    const temp = parseInt(document.getElementById('tempSlider').value);
    const info = document.getElementById('weatherInfo');

    const weatherEmojis = {
        'sunny': '☀️',
        'cloudy': '☁️',
        'rainy': '🌧️',
        'snowy': '❄️'
    };

    const weatherText = {
        'sunny': 'Sonnig',
        'cloudy': 'Bewölkt',
        'rainy': 'Regnerisch',
        'snowy': 'Schneeig'
    };

    info.textContent = `${temp}°C - ${weatherEmojis[weatherType]} ${weatherText[weatherType]}`;
}

function updateTemp() {
    updateWeather();
}

updateWeather();

// ========== Text Converter ==========
function convertText(type) {
    const input = document.getElementById('textInput').value;
    const resultDiv = document.getElementById('convertResult');

    if (input === '') {
        resultDiv.textContent = '';
        return;
    }

    let result = '';
    switch(type) {
        case 'upper':
            result = input.toUpperCase();
            break;
        case 'lower':
            result = input.toLowerCase();
            break;
        case 'reverse':
            result = input.split('').reverse().join('');
            break;
    }

    resultDiv.textContent = result;
}

document.getElementById('textInput')?.addEventListener('input', () => {
    convertText('lower');
});

// ========== Timer ==========
let timerInterval = null;
let remainingSeconds = 0;

function startTimer() {
    if (timerInterval) return;

    const input = document.getElementById('timerSeconds');
    const seconds = parseInt(input.value);

    if (isNaN(seconds) || seconds <= 0) {
        alert('Bitte geben Sie eine gültige Anzahl von Sekunden ein!');
        return;
    }

    remainingSeconds = seconds;
    input.disabled = true;

    timerInterval = setInterval(() => {
        remainingSeconds--;
        updateTimerDisplay();

        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            input.disabled = false;
            alert('Zeit abgelaufen!');
            playTimerSound();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        document.getElementById('timerSeconds').disabled = false;
    }
}

function resetTimer() {
    stopTimer();
    remainingSeconds = 0;
    updateTimerDisplay();
    document.getElementById('timerSeconds').disabled = false;
}

function updateTimerDisplay() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const display = document.getElementById('timerDisplay');
    display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function playTimerSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

updateTimerDisplay();

// ========== Notes ==========
let notes = JSON.parse(localStorage.getItem('notes')) || [];

function addNote() {
    const titleInput = document.getElementById('noteTitle');
    const textInput = document.getElementById('noteText');

    const title = titleInput.value.trim();
    const text = textInput.value.trim();

    if (title === '' || text === '') {
        alert('Bitte füllen Sie Titel und Notiz aus!');
        return;
    }

    const note = {
        id: Date.now(),
        title: title,
        text: text,
        date: new Date().toLocaleString('de-DE')
    };

    notes.unshift(note);
    saveNotes();
    renderNotes();
    titleInput.value = '';
    textInput.value = '';
}

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveNotes();
    renderNotes();
}

function renderNotes() {
    const list = document.getElementById('notesList');
    list.innerHTML = '';

    notes.forEach(note => {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note-card';
        noteDiv.innerHTML = `
            <button class="note-delete" onclick="deleteNote(${note.id})">✕</button>
            <h4>${note.title}</h4>
            <p>${note.text}</p>
            <small style="color: #999;">${note.date}</small>
        `;
        list.appendChild(noteDiv);
    });
}

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

document.getElementById('noteTitle')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('noteText').focus();
    }
});

document.getElementById('noteText')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        addNote();
    }
});

renderNotes();

// ========== Contact Form ==========
document.querySelector('.contact-form form')?.addEventListener('submit', (e) => {
    submitForm(e);
});

function submitForm(event) {
    event.preventDefault();

    const formMessage = document.getElementById('formMessage');
    const form = event.target;

    // Simulate form submission
    formMessage.className = 'form-message success';
    formMessage.textContent = '✓ Nachricht erfolgreich versendet! Vielen Dank!';

    form.reset();

    setTimeout(() => {
        formMessage.className = 'form-message';
    }, 5000);
}

// ========== Initialize ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('Website geladen - Alle Tools sind einsatzbereit!');
});

// ========== Lightbox for portfolio gallery ==========
(() => {
    const imgs = Array.from(document.querySelectorAll('.masonry img'));
    if (!imgs.length) return;

    // Create lightbox elements
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Schliessen">✕</button>
            <button class="lightbox-prev" aria-label="Vorheriges">◀</button>
            <img src="" alt="" />
            <button class="lightbox-next" aria-label="Nächstes">▶</button>
        </div>
    `;
    document.body.appendChild(lb);

    const lbImg = lb.querySelector('img');
    const btnClose = lb.querySelector('.lightbox-close');
    const btnPrev = lb.querySelector('.lightbox-prev');
    const btnNext = lb.querySelector('.lightbox-next');

    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        const src = imgs[currentIndex].getAttribute('data-full') || imgs[currentIndex].src;
        const alt = imgs[currentIndex].alt || '';
        lbImg.src = src;
        lbImg.alt = alt;
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lb.classList.remove('active');
        lbImg.src = '';
        document.body.style.overflow = '';
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % imgs.length;
        openLightbox(currentIndex);
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + imgs.length) % imgs.length;
        openLightbox(currentIndex);
    }

    imgs.forEach((img, idx) => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => openLightbox(idx));
    });

    btnClose.addEventListener('click', closeLightbox);
    btnNext.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    btnPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

    lb.addEventListener('click', (e) => {
        if (e.target === lb) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lb.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
})();

// ========== Intro Gate Activation ==========
(() => {
    const enterBtn = document.getElementById('introEnter');
    if (!enterBtn) return;
    enterBtn.addEventListener('click', () => {
        document.body.classList.add('ready');
        // After animation hide gate completely
        setTimeout(() => {
            const gate = document.getElementById('introGate');
            if (gate) gate.remove();
            const site = document.getElementById('siteContent');
            site?.classList.remove('hidden');
        }, 700);
    });
})();

// ========== Course Filter (Card Grid) ==========
function applyCourseFilter(e){
    e.preventDefault();
    const value = document.getElementById('themeSelect')?.value.trim();
    const cards = document.querySelectorAll('.card-section .card');
    cards.forEach(c => {
        if(!value || c.dataset.theme === value){
            c.style.display = 'flex';
        } else {
            c.style.display = 'none';
        }
    });
}

function resetCourseFilter(){
    const sel = document.getElementById('themeSelect');
    if (sel) sel.value='';
    const cards = document.querySelectorAll('.card-section .card');
    cards.forEach(c => c.style.display='flex');
}
