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

async function updateTaskStatusToCompleted() {
    const residentId = getResidentId(); // Retrieve residentId from the shared module
    const { error: taskError } = await supabase
        .from('tasks')
        .update({ status: 'COMPLETED', user_id: residentId }) // Update task status to 'IN_PROGRESS' and assign resident ID
        .eq('id', localStorage.getItem('currentTaskId'));

        //Move this to the admin side after the admin Checked button is being created
        const { error: residentAccountError } = await supabase
        .from('resident_account')
        .update({ has_task: 'FALSE' })
        .eq('id', residentId);

    if (taskError) {
        console.error('Error completing task:', taskError.message);
        alert('Failed to complete task. Try again.');
    } 
    
    if (residentAccountError) {
        console.error('Error completeing task:', residentAccountError.message);
        alert('Failed to complete task. Try again.');
    } 

    return; 
}


// Function to complete a task
async function completeTask(taskName) {
    const userConfirmed = confirm(`Are you sure that you have complete the task: "${taskName}"?`);
    if (userConfirmed) {
        await updateTaskStatusToCompleted();
        alert(`You have successfully completed "${taskName}".\n` + `Your submission would be sent to the admins to check before vouchers are allocated!`);
        localStorage.setItem('acceptedTask', false);
        await changeContent('resident-account');
    } else {
        alert(`Jiayou! You can do it!`);
    }
}

async function fetchAvailableProducts() {
    const { data: products, error } = await supabase
        .from('inventory')
        .select('name, point, id, quantity')
        .gt('quantity', 1); // Fetch only products with quantity > 0

        if (error) {
            console.error('Error fetching products:', error.message);
            return [];
        }
        return products;
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

async function fetchCurrentTask() {
    const residentId = getResidentId(); // Retrieve residentId from the shared module
    if (!residentId) {
        console.error("Resident ID not set! Output: " + residentId);
        return [];
    }

    const { data: has_tasks, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", residentId)
        .eq("status", "IN_PROGRESS");

    if (error) {
        console.error("Error fetching task details for users:", error.message);
        return [];
    }
    
    if (!has_tasks.length) {
        return [];
    }
    console.log(has_tasks);
    localStorage.setItem('currentTaskDesciption', has_tasks[0].description);
    localStorage.setItem('currentTaskPoint', has_tasks[0].point);
    localStorage.setItem('currentTaskId', has_tasks[0].id);
}

async function fetchCurrentPoints() {
    const residentId = getResidentId(); // Retrieve residentId from the shared module
    if (!residentId) {
        console.error("Resident ID not set! Output: " + residentId);
        return [];
    }

    const { data: currentPoint, error } = await supabase
        .from("resident_account")
        .select("points, name")
        .eq("id", residentId); 
    if (error) {
        console.error("Error fetching task details for users:", error.message);
        return [];
    }
    localStorage.setItem('currentPoint', currentPoint[0].points);
    localStorage.setItem('name', currentPoint[0].name);
}

// function to buy a product from the store
// @sharon: Need to reduce quantity of product in inventory by 1, need to reduce resident's point balance by the product price
async function buyProduct() {
}

async function changeContent(page) {
    const contentDiv = document.getElementById('content');

    switch (page) {
        case 'earn':
            // Fetch tasks and sort them by points in descending order
            const tasks = await fetchTasks();
            await fetchResidentTaskStatus();
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
                        (${task.point} Vouchers)
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
            // Fetch products and sort them by points in descending order
            const products = await fetchAvailableProducts();
            if (!products.length) {
                contentDiv.innerHTML = `
                    <h2>Store</h2>
                    <p>No products available at the moment. Please check back later!</p>
                `;
                return;
            }

            // Sort products by points (highest points first)
            products.sort((a, b) => b.point - a.point);


            contentDiv.innerHTML = `
                <h2>Store</h2>
                <p>Welcome to the mama mart store! Earn vouchers to purchase items here!</p>
                <p>Note: Delivery of goods will be handled by admins.</p>
                <div id="product-list"></div>
            `;

            const productList = document.getElementById('product-list');
            products.forEach((product, index) => {
                const listProduct = document.createElement('div');
                listProduct.classList.add('product-item');

                // Add a rank based on the product's position
                const rank = index + 1;

                listProduct.innerHTML = `
                    <div class="info-box">
                        <strong>#${rank}</strong> ${product.name} 
                        (${product.point} Vouchers)
                        <button class="buy-button" data-name="${product.name}" data-product-id="${product.id} data-product-id="${product.point}">
                            Buy
                        </button>
                    </div>
                `;
                productList.appendChild(listProduct);
            });

            // Attach event listeners to the dynamically generated buttons
            document.querySelectorAll('.buy-button').forEach((button) => {
                button.addEventListener('click', async (e) => {
                    const productId = e.target.getAttribute('data-product-id');
                    const productName = e.target.getAttribute('data-name');
                    const productPoint = e.target.getAttribute('data-point');
                    await buyProduct(productId, productName, productPoint); // Pass product ID to the `buyProduct` function
                });
            }); 

            break;

        case 'resident-account':
            let currentAcceptedTaskLabel = "You have no task currently!"; 
            let completeButtonHTML = ''; // Default: no button
            await fetchCurrentPoints();
            const name = localStorage.getItem('name');
            const currentPoint = localStorage.getItem('currentPoint');

            if (localStorage.getItem('acceptedTask') === 'true') {
                await fetchCurrentTask();
                const taskDescription = localStorage.getItem('currentTaskDesciption');
                const taskPoint = localStorage.getItem('currentTaskPoint');
                currentAcceptedTaskLabel = taskDescription + " (" + taskPoint + " Vouchers)"; 
                completeButtonHTML = `<button id="complete-button" class="complete-button">Mark as Completed</button>`;
            }
            
            contentDiv.innerHTML = `
                <h2>Account Summary</h2>
                <p>Hello ${name}! Here's your account summary:</p>
                <label for="name"><strong>Current Accepted Task</strong></label>
                <div class="info-box"> 
                    ${currentAcceptedTaskLabel}
                    ${completeButtonHTML}                
                </div>
                <label for="name"><strong>Voucher Balance</strong></label>
                <div class="info-box"> 
                    ${currentPoint} Points 
                </div>
                <label for="name"><strong>Transaction History</strong></label>
                <div class="info-box"> 
                    21/1/2025 - Pen - 5 Points
                </div>
            `;

            document.getElementById('complete-button').addEventListener('click', () => {
                completeTask(localStorage.getItem('currentTaskDesciption'));
            });
            break;

        default:
            contentDiv.innerHTML = '<h2>Page not found!</h2>';
    }
}

export { changeContent, logout }; // Export functions if needed for other files
