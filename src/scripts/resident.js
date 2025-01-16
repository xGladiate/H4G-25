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
    const contentDiv = document.getElementById('content');

    // Map pages to their respective HTML file paths
    const pageFiles = {
        'earn': '/src/pages/resident/earn.html',
        'buy': '/src/pages/resident/buy.html',
        'resident-account': '/src/pages/resident/resident-account.html',
    };

    const pageFile = pageFiles[page];

    if (pageFile) {
        fetch(pageFile)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Page not found');
                }
                return response.text();
            })
            .then(html => {
                contentDiv.innerHTML = html;
            })
            .catch(error => {
                contentDiv.innerHTML = '<h2>Page not found!</h2>';
                console.error('Error loading page:', error);
            });
    } else {
        contentDiv.innerHTML = '<h2>Page not found!</h2>';
    }
}
