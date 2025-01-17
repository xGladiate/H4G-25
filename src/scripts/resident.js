import supabase from './supabase.js';
import { getResidentId } from './shared.js';

// Define global variables
localStorage.setItem('acceptedTask', false); // Set the accepted task to false by default

// Function to log out
function logout() {
    window.location.href = "index.html";
}

async function acceptTask(taskId, taskDescription) {
    if (localStorage.getItem('acceptedTask') === 'true') {
        alert('You have already accepted a task. Please complete it before accepting another task.');
    } else {

        const residentId = getResidentId(); // Retrieve residentId from the shared module

        const { error: taskError } = await supabase
            .from('tasks')
            .update({ status: 'IN_PROGRESS', user_id: residentId }) // Update task status to 'IN_PROGRESS' and assign resident ID
            .eq('id', taskId);

        const { error: residentAccountError } = await supabase
            .from('resident_account')
            .update({ has_task: 'TRUE' })
            .eq('id', residentId);

        if (taskError) {
            console.error('Error accepting task:', taskError.message);
            alert('Failed to accept task. Try again.');
        } else if (residentAccountError) {
            console.error('Error accepting task:', residentAccountError.message);
            alert('Failed to accept task. Try again.');
        } else {
            alert(`You have successfully accepted "${taskDescription}"!`);
            localStorage.setItem('acceptedTask', true); // Set the accepted task to true
            // Optionally moves to the account page after accepting a task 
            await changeContent('resident-account');
        }
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
    const residentId = getResidentId(); // Retrieve residentId from the shared module
    if (!residentId) {
        console.error("Resident ID not set! Output: " + residentId);
        return [];
    }

    const { data: has_tasks, error } = await supabase
        .from("resident_account")
        .select("has_task")
        .eq("id", residentId);

    if (error) {
        console.error("Error fetching task status:", error.message);
        return [];
    }
    localStorage.setItem('acceptedTask', has_tasks[0].has_task);
}

// function to buy a product from the store
// @sharon: Need to reduce quantity of product in inventory by 1, need to reduce resident's point balance by the product price
async function buyProduct() {
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

async function changeContent(page) {
    const contentDiv = document.getElementById('content');

    switch (page) {
        case 'earn':
            // Fetch tasks and sort them by points in descending order
            const tasks = await fetchTasks();
            const residentTaskStatus = await fetchResidentTaskStatus();
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

            // Attach event listeners to the dynamically generated buttons
            document.querySelectorAll('.buy-button').forEach((button) => {
                button.addEventListener('click', async (e) => {
                    const productId = e.target.getAttribute('data-product-id');
                    const productPrice = e.target.getAttribute('data-price');
                    await buyProduct(productId, productPrice); // Pass product ID to the `buyProduct` function
                });
            });

            /*const productList = document.getElementById('product-list');
            products.forEach((product, index) => {
                const listProduct = document.createElement('div');
                listProduct.classList.add('product-item');

                // Add a rank based on the product's position
                const rank = index + 1;

                listItem.innerHTML = `
                    <div class="info-box">
                        <strong>#${rank}</strong> ${product.name} 
                        (${product.price} Points)
                        <button class="buy-button" data-product-id="${product.id}">
                            Buy
                        </button>
                    </div>
                `;
                productList.appendChild(listItem);
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
