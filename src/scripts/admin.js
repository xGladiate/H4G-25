function logout() {
    window.location.href = "index.html";
}

function changeContent(page) {
	var contentDiv = document.getElementById('content');

	switch (page) {
		case 'inventory':
			contentDiv.innerHTML = `
				<h2>
					Inventory
				</h2>
				<p>
					This section contains details of the mart inventory, such as the number of remaining products.
				</p>
			`;
			break;
		case 'voucher-approval':
			contentDiv.innerHTML = `
				<h2>Voucher Approval</h2>
				<p>
					This is the voucher approval section. Admins would check on the task completion status
					of the residents indicated before awarding them the allocated number of vouchers.
				</p>
			`;
			break;
		case 'product-collection':
			contentDiv.innerHTML =
				`<h2>Product Collection</h2>
				<p>
					This is the product collection tracker to track which product has not been collected by residents.
				</p>
				`;
			break;
        case 'admin-account':
            contentDiv.innerHTML =
                `<h2>Account Summary</h2>
                <p>
                    These are the summary of tasks that needs to be done.
                </p>
                <form>
                <label for="name">Name:</label>
                <input type="text" id="name" name="name"
                        placeholder="Your Name" required>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email"
                        placeholder="Your Email" required>
                <label for="message">Message:</label>
                <textarea id="message" name="message"
                            placeholder="Your Message"
                            rows="4" required>
                    </textarea>
                <button type="submit">Send Message</button>
                </form>`;
            break;

		default:
			contentDiv.innerHTML = '<h2>Page not found!</h2>';
	}
}
