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
		case 'account':
			contentDiv.innerHTML =
				`<h2>Account Summary</h2>
				<p>
					Hello NAME, here is your account summary!
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
