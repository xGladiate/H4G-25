function logout() {
    window.location.href = "index.html";
}

function changeContent(page) {
    const contentDiv = document.getElementById('content');

    // Map pages to their respective HTML file paths
    const pageFiles = {
        'admin-account': '/src/pages/admin/admin-account.html',
        'inventory': '/src/pages/admin/inventory.html',
        'product-collection': '/src/pages/admin/product-collection.html',
		'voucher-approval': '/src/pages/admin/voucher-approval.html'
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
