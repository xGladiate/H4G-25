function logout() {
    window.location.href = "index.html";
}

function changeContent(page) {
	var contentDiv = document.getElementById('content');

	switch (page) {
		case 'earn':
			contentDiv.innerHTML = `
				<h2>
					Welcome to the Task Board!
				</h2>
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
                <div class="info-box">
                    Clear level 4 trash
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
