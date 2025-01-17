import supabase from './supabase.js';

function logout() {
    window.location.href = "index.html";
}

function returnHome() {
    window.location.href = "admin.html";
}

// Function to fetch tasks accepted by residents
async function fetchAcceptedTasks() {
    const { data: tasks, error } = await supabase
        .from('tasks')
        .select('description, point, user_id, id')
        .eq('status', 'COMPLETED'); // Fetch tasks with 'COMPLETED' status

    if (error) {
        console.error('Error fetching accepted tasks:', error.message);
        return [];
    }
    return tasks;
}

async function fetchUserName(user_id) {
    const { data: credentials, error } = await supabase
        .from('credentials')
        .select('name') // Fetch name from credentials table
        .eq('id', user_id) // Match user_id from tasks with id in credentials
        .single(); // Use single() to get only one record

    if (error) {
        console.error('Error fetching user name:', error.message);
        return 'Unknown'; // Return 'Unknown' if no user is found or error occurs
    }
    return credentials?.name || 'Unknown'; // Return the name or 'Unknown' if it's not found
}

async function approveTask(taskId, rowElement) {
    console.log("Approving task with ID:", taskId); // Debug log
    const isApproved = window.confirm("Are you sure you want to approve this task?");

    if (!isApproved) {
        return; 
    }

    const { error } = await supabase
        .from('tasks')
        .update({ status: 'CHECKED' })
        .eq('id', taskId);

    if (error) {
        console.error('Error updating task status:', error.message);
        alert('Failed to approve task.');
        return;
    }

    alert('Task approved successfully!');

    if (rowElement) {
        rowElement.remove();
    }
    showAcceptedTasks();
}

// Function to display the list of accepted tasks
async function showAcceptedTasks() {
    const contentDiv = document.getElementById('content');
    const tasks = await fetchAcceptedTasks();

    if (!tasks.length) {
        contentDiv.innerHTML = `
            <h2>Pending Tasks for Approval</h2>
            <p>No tasks are currently in progress.</p>
        `;
        return;
    }

    contentDiv.innerHTML = `
        <h2 class="task-heading">Pending Tasks for Approval</h2>
        <table class="task-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Points</th>
                    <th>Name</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody id="task-list"></tbody>
        </table>
    `;

    const taskList = document.getElementById('task-list');
    for (let task of tasks) {
        const userName = await fetchUserName(task.user_id);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.description}</td>
            <td>${task.point}</td>
            <td>${userName}</td>
            <td>
                <button class="approve-button" data-task-id="${task.id}">Approve</button>          
            </td>
        `;
        const approveButton = row.querySelector('.approve-button');
        approveButton.addEventListener('click', () => approveTask(task.id, row));

        taskList.appendChild(row);
    };
}

// Change content based on selected admin page
function changeContent(page) {
    const contentDiv = document.getElementById('content');

    switch (page) {
        case 'inventory':
            contentDiv.innerHTML = `
                <h2>Inventory</h2>
                <p>This section contains details of the mart inventory, such as the number of remaining products.</p>
            `;
            break;
        case 'voucher-approval':
            showAcceptedTasks();
            contentDiv.innerHTML = `
                <h2>Voucher Approval</h2>
                <p>Admins check on the task completion status of residents before awarding them vouchers.</p>
            `;
            break;
        case 'product-collection':
            contentDiv.innerHTML = `
                <h2>Product Collection</h2>
                <p>This section tracks which products have not been collected by residents.</p>
            `;
            break;
        case 'admin-account':
            contentDiv.innerHTML = `
                <h2>Account Summary</h2>
                <p>Summary of admin tasks.</p>
                <form>
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" placeholder="Your Name" required>
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" placeholder="Your Email" required>
                    <label for="message">Message:</label>
                    <textarea id="message" name="message" placeholder="Your Message" rows="4" required></textarea>
                    <button type="submit">Send Message</button>
                </form>
            `;
            break;
        default:
            contentDiv.innerHTML = '<h2>Page not found!</h2>';
    }
}

export { logout, returnHome, changeContent };
