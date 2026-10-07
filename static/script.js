document.addEventListener(
    "DOMContentLoaded",
    loadTasks
);


// --------------------------------
// LOAD TASKS
// --------------------------------

async function loadTasks() {

    try {

        const response =
            await fetch("/items");

        const tasks =
            await response.json();

        displayTasks(tasks);

    } catch (error) {

        console.error(
            "Error loading tasks:",
            error
        );

    }
}


// --------------------------------
// DISPLAY TASKS
// --------------------------------

function displayTasks(tasks) {

    const pendingContainer =
        document.getElementById(
            "pendingTasks"
        );

    const completedContainer =
        document.getElementById(
            "completedTasks"
        );


    pendingContainer.innerHTML = "";

    completedContainer.innerHTML = "";


    const pendingTasks =
        tasks.filter(
            task => !task.completed
        );

    const completedTasks =
        tasks.filter(
            task => task.completed
        );


    // COUNTS

    document.getElementById(
        "pendingCount"
    ).textContent =
        pendingTasks.length;


    document.getElementById(
        "completedCount"
    ).textContent =
        completedTasks.length;


    document.getElementById(
        "pendingBadge"
    ).textContent =
        pendingTasks.length +
        (
            pendingTasks.length === 1
                ? " task"
                : " tasks"
        );


    document.getElementById(
        "completedBadge"
    ).textContent =
        completedTasks.length +
        (
            completedTasks.length === 1
                ? " task"
                : " tasks"
        );


    // --------------------------------
    // PENDING TASKS
    // --------------------------------

    if (pendingTasks.length === 0) {

        pendingContainer.innerHTML =
            `
            <div class="empty">
                🎉 No pending tasks!
            </div>
            `;

    } else {

        pendingTasks.forEach(
            task => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "task-card";


                card.innerHTML =
                    `
                    <div class="task-circle">
                        ○
                    </div>

                    <div class="task-text">
                        ${escapeHtml(task.task)}
                    </div>
                    `;


                card.addEventListener(
                    "click",
                    () => {
                        completeTask(task.id);
                    }
                );


                pendingContainer.appendChild(
                    card
                );

            }
        );

    }


    // --------------------------------
    // COMPLETED TASKS
    // --------------------------------

    if (completedTasks.length === 0) {

        completedContainer.innerHTML =
            `
            <div class="empty">
                No completed tasks yet.
            </div>
            `;

    } else {

        completedTasks.forEach(
            task => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "task-card completed-card";


                card.innerHTML =
                    `
                    <div class="task-circle">
                        ✓
                    </div>

                    <div class="task-text">
                        ${escapeHtml(task.task)}
                    </div>
                    `;


                completedContainer.appendChild(
                    card
                );

            }
        );

    }
}


// --------------------------------
// ADD TASK
// --------------------------------

async function addTask() {

    const input =
        document.getElementById(
            "taskInput"
        );


    const task =
        input.value.trim();


    if (!task) {

        input.focus();

        return;
    }


    try {

        const response =
            await fetch(
                "/items",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            task: task
                        })
                }
            );


        if (response.ok) {

            input.value = "";

            await loadTasks();

        }

    } catch (error) {

        console.error(
            "Error adding task:",
            error
        );

    }
}


// --------------------------------
// COMPLETE TASK
// --------------------------------

async function completeTask(id) {

    try {

        const response =
            await fetch(
                `/items/${id}`,
                {
                    method: "PUT"
                }
            );


        if (response.ok) {

            await loadTasks();

        }

    } catch (error) {

        console.error(
            "Error completing task:",
            error
        );

    }
}


// --------------------------------
// ESCAPE HTML
// --------------------------------

function escapeHtml(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent = text;

    return div.innerHTML;
}