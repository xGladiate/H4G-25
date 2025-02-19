# H4G-25

Below are the rough layout for our web application

## 1. Login Screen
- Both Resident and Admin are able to log in from the same login screen
- Forget Password works for both Resident and Admin, where an email would be sent to their respective registered email
- Based on the username entered, the system would determine whether the users are residents or admin
- Users would be directed to their homepage (Resident Homepage or Admin Homepage) accordingly 

## 2. Resident Screen
 - There will be 3 tabs in the resident screen: `Earn`, `Buy`, `Account`
 - Earn: This page would consist of the task details
 - Buy: This page would consist of the shop with products name, details and associated vouchers required to purchase that product
 - Account: This page would consist of the `Currently accepted task`, `Voucher Balance` and  `Transaction History`

## 3. Admin Screen
 - There will be 4 tabs in the resident screen: `Inventory`, `Voucher Balance`, `Product Collection` and `Account Balance`

## Future Consideration
 - Admins would be able to manage accounts, such as adding accounts and suspending accounts
 - Residents would be able to reset their password in the case when they forgot their password

## More Details
 - [Our Project Google Drive](https://drive.google.com/drive/folders/1OZFlyInFQFRLIg_nF6LDg6iF9TBZp75k)
 - [Our Planning Document](https://docs.google.com/document/d/1asOftW9DxqmLOkNGgwGRJ0LF5b2FCQBu2HflGBt7xXo/edit?usp=sharing)

## How to Start 
1. Download the code
2. Add the code to a new folder

### Method 1
3. Open the terminal and navigate to the folder containing the code
4. Run `python -m http.server 8000`
5. Open your web browser and navigate to [http://localhost:8000/](http://localhost:8000/), which should bring you to the login page of the web app

### Method 2
3. Open the code in VS Code
4. Download `live server` from `extensions`
5. Right-click on `index.html` at `src/pages/index.html`
6. Select `Open with Live Server`
7. Navigate to your browser, which should bring you to the login page of the web app

### Test Account 
Role: Admin
Username: 123
Password: 123

Role: Resident
Username: resident123
Password: password123
