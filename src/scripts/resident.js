import supabase from './supabase.js';

// Define global variables
// var residentId = null; // Global variable to store the resident ID
var accpetedTask = false; // Global variable to check if a task has been accepted

// Function to log out
function logout() {
    window.location.href = "index.html";
}

async function acceptTask(taskId, taskDescription) {
    await fetchResidentTaskStatus();
    if (accpetedTask) {
        alert('You have already accepted a task. Please complete it before accepting another task.');
    }
    const { data, error } = await supabase
        .from('tasks')
        .update({ status: 'IN_PROGRESS' })
        .eq('id', taskId);

    if (error) {
        console.error('Error accepting task:', error.message);
        alert('Failed to accept task. Try again.');
    } else {
        const { data, error } = await supabase
            .from('resident_account')
            .update({ has_task: 'TRUE' })
            .eq('id', residentId);
        alert(`You have successfully accepted "${taskDescription}"!`);
        // Optionally moves to the account page after accepting a task 
        await changeContent('resident-account');
    }
}


// Function to complete a task
async function completeTask(taskName) {
    const userConfirmed = confirm(`Are you sure that you have completed "${taskName}"?`);
    if (userConfirmed) {
        alert(`You have successfully completed "${taskName}".`);
        // Add any additional logic to update task status if needed
    } else {
        alert(`Keep up the good work!`);
    }
}

// Function to fetch tasks dynamically
async function fetchTasks() {
    const { data: tasks, error } = await supabase
        .from('tasks')
        .select('description, point, id, status')
        .eq('status', 'AVAILABLE'); // Fetch only available tasks

    if (error) {
        console.error('Error fetching tasks:', error.message);
        return [];
    }
    return tasks;
}

async function fetchResidentTaskStatus() {
    const { data: has_task, error: cannot_get_status } = await supabase
        .from(`resident_account`)
        .select('has_task')
        .eq('id', residentId); //check the task status of the user
    if (cannot_get_status) {
        console.error('Error fetching tasks:', error.message);
        return [];
    }
    accpetedTask = has_task === "TRUE" || has_task === "true";
    return; 
}

async function changeContent(page) {
    const contentDiv = document.getElementById('content');

    switch (page) {
        case 'earn':
            // Fetch tasks and sort them by points in descending order
            const tasks = await fetchTasks();
            if (!tasks.length) {
                contentDiv.innerHTML = `
                    <h2>Task Board</h2>
                    <p>No tasks available at the moment. Please check back later!</p>
                `;
                return;
            }

            // Sort tasks by points (highest points first)
            tasks.sort((a, b) => b.point - a.point);

            contentDiv.innerHTML = `
                <h2>Task Board</h2>
                <p>Welcome to the Task Board!</p>
                <p>Complete these tasks to earn vouchers for the mama mart!</p>
                <div id="task-list"></div>
            `;

            const taskList = document.getElementById('task-list');
            tasks.forEach((task, index) => {
                const listItem = document.createElement('div');
                listItem.classList.add('task-item');

                // Add a rank based on the task's position
                const rank = index + 1;

                listItem.innerHTML = `
                    <div class="info-box">
                        <strong>#${rank}</strong> ${task.description} 
                        (${task.point} Points)
                        <button class="accept-button" data-description="${task.description}" data-task-id="${task.id}">
                            Accept
                        </button>
                    </div>
                `;
                taskList.appendChild(listItem);
            });

            // Attach event listeners to the dynamically generated buttons
            document.querySelectorAll('.accept-button').forEach((button) => {
                button.addEventListener('click', async (e) => {
                    const taskId = e.target.getAttribute('data-task-id');
                    const taskDescription = e.target.getAttribute('data-description');
                    await acceptTask(taskId, taskDescription); // Pass task ID to the `acceptTask` function
                    accpeted_task = true; // Set to true after accepting a task
                });
            });
            break;

        case 'buy':
            contentDiv.innerHTML = `
                <h2>Store</h2>
                <p>Welcome to the mama mart store! Earn vouchers to purchase items here!</p>
                <p>Note: Delivery of goods will be handled by admins.</p>
                <form>
                    <div class="product-list-box">
                        <ol>
                            <label for="name">
                                Pen (5 Points)
                                <button id="buy-button" onclick="buyProduct()" class="buy-button">Buy</button>
                            </label>
                        </ol>
                        <ol>
                            <label for="name">
                                Basketball (15 Points)
                                <button id="buy-button" onclick="buyProduct()" class="buy-button">Buy</button>
                            </label>
                        </ol>
                        <ol>
                            <label for="name">
                                Pokemon Bedsheet (35 Points)
                                <button id="buy-button" onclick="buyProduct()" class="buy-button">Buy</button>
                            </label>
                        </ol>
                    </div>
                </form>
            `;

            /*const productList = document.getElementById('product-list');
            tasks.forEach((task, index) => {
                const listItem = document.createElement('div');
                listItem.classList.add('task-item');

                // Add a rank based on the task's position
                const rank = index + 1;

                listItem.innerHTML = `
                    <div class="info-box">
                        <strong>#${rank}</strong> ${task.description} 
                        (${task.point} Points)
                        <button class="accept-button" data-description="${task.description}" data-task-id="${task.id}">
                            Accept
                        </button>
                    </div>
                `;
                taskList.appendChild(listItem);
            });*/

            break;

        case 'resident-account':
            contentDiv.innerHTML = `
                <h2>Account Summary</h2>
                <p>Hello! Here's your account summary:</p>
                <div class="info-box"><strong>Current Accepted Task:</strong> Mop the level 3 floor.</div>
                <button id="complete-button" class="complete-button">Mark as Completed</button>
                <div class="info-box"><strong>Voucher Balance:</strong> 100 Points</div>
                <div class="info-box"><strong>Transaction History:</strong> 21/1/2025 - Pen - 5 Points</div>
            `;

            document.getElementById('complete-button').addEventListener('click', () => {
                completeTask('Mop the level 3 floor');
            });
            break;

        default:
            contentDiv.innerHTML = '<h2>Page not found!</h2>';
    }
}


export { changeContent, logout }; // Export functions if needed for other files
