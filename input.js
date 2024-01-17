// input.js
$(document).ready(function () {
    $('#submitUsername').on('click', function () {
        const username = $('#githubUsername').val();
        if (username.trim() !== '') {
            // Redirect to index.html with the username as a parameter
            window.location.href = `index.html?username=${username}`;
        } else {
            alert('Please enter a valid GitHub username.');
        }
    });
});
