const inputForm = document.querySelector("#add-todo-form");
const textBox = document.querySelector("#text-box");
const ourUl = document.querySelector("#todo-ul");
const submitButton = document.querySelector(".submit-button");
let counter = 0;
let textValues = [];
let strikethroughBoolean = {};
let nextId = 0;
let taskCounter = 0;

// If there is something in localStorage, strikethroughBoolean MUST have those values.
if (localStorage.getItem("strikethrough") !== null) {
    strikethroughBoolean = JSON.parse(localStorage.getItem("strikethrough"));
}

//Without this, when you refresh the page the TODO's are not in the same order.
for (let i = 0; i <= Object.keys(localStorage).length + 10; i++) {
    for (let j = 0; j <= Object.keys(localStorage).length + 10; j++) {
        if (Object.keys(localStorage)[j] === `task_${i}`) {
            textValues.push(Object.values(localStorage)[j]);
        }
    }
}

if (Object.keys(localStorage).length > 1) {
    taskNumberRefresher();
    paragraphIdRefresher();
}

//This is just a slight modification of toDoCreator(), we create a parameter 
//so we can pass in the values from textValues. Also, if the TODO had a strikethrough before refresh
//then it will also have a strikethrough after refresh.
function localStorageCreator(text) {
    const newLi = document.createElement("li");
    const newP = document.createElement("p");
    const xButton = document.createElement("button");
    const checkButton = document.createElement("button");
    
    newP.innerText = text;
    newP.id = "task_" + nextId;
    nextId++;
    xButton.innerHTML = "&cross;";
    checkButton.innerHTML = "&check;";
    xButton.classList.add("xbutton");
    checkButton.classList.add("checkbutton");

    newLi.append(checkButton);
    newLi.append(xButton);
    newLi.append(newP);

    if (localStorage.getItem("strikethrough") !== null) {
        if (JSON.parse(localStorage.getItem("strikethrough"))[`task_${taskCounter}`] === true) {
            newP.classList.add('strikethrough');
        }
    }
    
    taskCounter++;
    return newLi;
}

//This is our basic TODO creator. Everytime a TODO is created, 
//we put the paragraph text in local storage.
function toDoCreator() {
    const newLi = document.createElement("li");
    const newP = document.createElement("p")
    const xButton = document.createElement("button");
    const checkButton = document.createElement("button");
    
    newP.innerText = textBox.value;
    newP.id = "task_" + nextId;
    nextId++;
    xButton.innerHTML = "&cross;"
    checkButton.innerHTML = "&check;"
    xButton.classList.add("xbutton")
    checkButton.classList.add("checkbutton");
    localStorage.setItem("task_" + counter, textBox.value.trim());


    newLi.append(checkButton);
    newLi.append(xButton);
    newLi.append(newP);
    counter += 1;

    return newLi;
}

function taskNumberRefresher() {
    let localStorageDuplicate = JSON.stringify(localStorage);

    for (let i = 0; i < Object.keys(JSON.parse(localStorageDuplicate)).length + 5; i++) {
        delete localStorage["task_" + i];
    }
    
    
    for (let i = 0; i < Object.keys(JSON.parse(localStorageDuplicate)).length - 1; i++) {
        localStorage["task_" + i] = textValues[i];
    }
}

function paragraphIdRefresher() {
    for (let i = 0; i < ourUl.children.length; i++) {
        ourUl.children[i].lastChild.id = "task_" + i;
    }
}

//This is going to take the paragraph text in local storage, and use it to make new TODO's upon refresh.
for (let i = 0; i < textValues.length; i++) {
    ourUl.append(localStorageCreator(textValues[i]));
}

//Stop the page from refreshing upon submit, append TODO's to UL, and clear the input box.
inputForm.addEventListener("submit", function(event) {
    event.preventDefault();
    ourUl.append(toDoCreator());
    textBox.value = '';
})

//If the check is clicked, add a strikethrough to the corresponding TODO,
//and then inside of localStorage we will store whether or not that
//TODO has a strikethrough. If the X is clicked, remove the parent LI and remove the
//corresponding paragraph text from local storage.
ourUl.addEventListener("click", function(e) {
    if (e.target.classList.contains("checkbutton")) {
        let p = e.target.nextElementSibling.nextElementSibling

        if (p.classList.contains('strikethrough')) {
            strikethroughBoolean[p.id] = false;
            p.classList.toggle('strikethrough');
            localStorage.setItem("strikethrough", JSON.stringify(strikethroughBoolean));
        } else {
            strikethroughBoolean[p.id] = true;
            p.classList.toggle('strikethrough');
            localStorage.setItem("strikethrough", JSON.stringify(strikethroughBoolean));
        }
    }
    else if (e.target.classList.contains("xbutton")) {
        localStorage.removeItem(e.target.nextElementSibling.id);
        delete strikethroughBoolean[e.target.nextElementSibling.id]
        for (let i = 0; i < ourUl.childElementCount; i++) {
            if (e.target.nextElementSibling.id === `task_${i}`) {
                for (let j = i; j < ourUl.childElementCount; j++) {
                    if (`task_${j + 1}` in strikethroughBoolean) {
                        strikethroughBoolean[`task_${j}`] = strikethroughBoolean[`task_${j + 1}`];
                        delete strikethroughBoolean[`task_${j + 1}`]
                    }
                }
            }
        }
        localStorage.setItem("strikethrough", JSON.stringify(strikethroughBoolean));
        e.target.parentElement.remove();
    }
})

//If the check or X is moused over, turn the buttons red.
ourUl.addEventListener("mouseover", function(e) {
    if (e.target.tagName === "BUTTON") {
        e.target.classList.toggle("button-color");
    }
})
ourUl.addEventListener("mouseout", function(e) {
    if (e.target.tagName === "BUTTON") {
        e.target.classList.toggle("button-color");
    }
})

//If the ADD button is moused over, turn the button red.
submitButton.addEventListener("mouseover", function(e) {
    if (e.target.tagName === "BUTTON") {
        e.target.classList.toggle("button-color");
    }
})
submitButton.addEventListener("mouseout", function(e) {
    if (e.target.tagName === "BUTTON") {
        e.target.classList.toggle("button-color");
    }
})
