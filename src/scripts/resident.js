function logout() {
    window.location.href = "index.html";
}

function acceptTask() {
    //Change the page to show that could not take any other task
    //Update the home page to indicate the new task
}

function completeTask(taskName) {
    //Allow confirmation of Task
    const userConfirmed = confirm(`Are you sure that you have completed "${taskName}"?`);
    if (userConfirmed) {
        alert(`You have successfully completed "${taskName}".`);
        // Here, you can also add logic to mark the task as accepted in your system.
    } else {
        alert(`Keep up the good work!`);
    }
}

function changeContent(page) {
	var contentDiv = document.getElementById('content');

	switch (page) {
		case 'earn':
			contentDiv.innerHTML = `
				<h2>
					Task Board
				</h2>
				<p>
                     Welcome to the Task Board!
                 </p>
				<p>
					These are the available tasks that can be accepted!
				</p>
				<p>
					Do complete them to earn vouchers to be used in the mama mart!
				</p>
			`;
			break;
		case 'buy':
			contentDiv.innerHTML = `
				<h2>Store</h2>
				<p>
					This is the mama mart store. Earn vouchers
					to purchase the goods in here!
				</p>
				<p>
					Note: Delivery of goods would be done by
					admins!
				</p>

				<form>
                    <div class="info-box">
                        <label for="name">
                            Wash Dishes for dinner (100 Points)
                            <button id="accept-button" onclick="acceptTask()" class="accept-button">Accept</button>
                        </label>
                    </div>
                </form>
			`;
			break;
		case 'resident-account':
			contentDiv.innerHTML =
				`<h2>Account Summary</h2>
				<p>
					Hello, here is your account summary!
				</p>
				<form>
                    <label for="name"><strong>Current Accepted Task</strong></label>
                    <div class="info-box" onclick="completeTask('taskName')">
                        Mop the level 3 floor.
                    <button id="complete-button" onclick="completeTask('taskName')" class="complete-button">Completed</button>
                    </div>
                    <label for="name"><strong>Voucher Balance</strong></label>
                    <div class="info-box">
                        100 Points
                    </div>
                    <label for="name"><strong>Transaction History</strong></label>
                    <div class="info-box">
                        21/1/2025    Pen    5 Points
                    </div>
                </form>`;
			break;

		default:
			contentDiv.innerHTML = '<h2>Page not found!</h2>';
	}
}
