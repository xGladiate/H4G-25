let residentId = null;

function setResidentId(residentId) {
    localStorage.setItem('residentId', residentId); // Ensure this happens after login
}

function getResidentId() {
    return localStorage.getItem('residentId');
}

export { setResidentId, getResidentId };
