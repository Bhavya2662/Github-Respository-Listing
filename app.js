$(document).ready(function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const username = urlParams.get('username');

    if (username) {
        // Fetch user info and repositories using the provided username
        fetchUserAndRepos(username);
    } else {
        // Fallback logic or default behavior (e.g., fetch info for a default user)
        fetchUserAndRepos('johnpapa');
    } // Replace with dynamic username input
    const perPage = 10; // Number of repositories per page
    const maxPage = 100; // Maximum number of pages to show
    let currentPage = 1; // Current page number
    let totalRepos = 0; // Total number of repositories
    let repos = []; // Array of repositories
    let filteredRepos = []; // Array of filtered repositories
 
    // Fetch user info and repositories
    function fetchUserAndRepos() {
        $.ajax({
            url: `https://api.github.com/users/${username}`,
            type: 'GET',
            success: function (user) {
                // Display user info
                $('#userImage').attr('src', user.avatar_url);
                $('#userName').text(user.name);
                $('#userBio').text(user.bio);
                // Add user location and Twitter link here
                $('#userLocation').text(user.location);
                $('#userTwitter').attr('href', `https://twitter.com/${user.twitter_username}`);
                // Add GitHub link here
                $('#userGitHub').attr('href', user.html_url);
            }
        });
 
        $.ajax({
            url: `https://api.github.com/users/${username}/repos`,
            type: 'GET',
            success: function (data) {
                repos = data;
                filteredRepos = data;
                totalRepos = data.length;
                displayRepos();
                displayPagination();
            }
        });
    }
 
    // Display repositories
    function displayRepos() {
        let output = '';
        let start = (currentPage - 1) * perPage;
        let end = Math.min(start + perPage, totalRepos);
        for (let i = start; i < end; i++) {
            let repo = filteredRepos[i];
            output += `
                <div class='col-sm-6'> <!-- Add col-sm-6 class here -->
                    <div class='card mb-3' style="border: 1px solid #ccc;"> <!-- Add border style here -->
                        <div class='card-body'>
                            <h5 style="color:#0000FF">${repo.name}</h5> 
                            ${repo.description ? `<p>${repo.description}</p>` : ''}
                            ${getTopics(repo)}
                        </div> 
                    </div>
                </div>`;
        }
        $('#repositories').html(output);
    }
 
    // Display pagination
    function displayPagination() {
        let output = '';
        let totalPages = Math.ceil(totalRepos / perPage);
        let maxPages = Math.min(totalPages, maxPage);
        // Add previous page link
        if (currentPage > 1) {
            output += `<li class="page-item"><a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a></li>`;
        }
        // Add page number links
        for (let i = 1; i <= maxPages; i++) {
            output += `<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        }
        // Add next page link
        if (currentPage < maxPages) {
            output += `<li class="page-item"><a class="page-link" href="#" data-page="${currentPage + 1}">Next</a></li>`;
        }
        $('#pagination').html(output);
    }
 
    // Fetch topics for a repository
    function getTopics(repo) {
        let output = '';
        $.ajax({
            url: `https://api.github.com/repos/${username}/${repo.name}/topics`,
            type: 'GET',
            headers: {
                'Accept': 'application/vnd.github.mercy-preview+json'
            },
            success: function (data) {
                let topics = data.names;
                if (topics.length > 0) {
                    output += '<div class="mt-2">';
                    $.each(topics, function (index, topic) {
                        output += `<span class="badge badge-primary mr-1">${topic}</span>`; // Change the color of the badges to blue
                    });
                    output += '</div>';
                }
                $(`#${repo.id}`).html(output);
            }
        });
        return `<div id="${repo.id}"></div>`; // Placeholder for topics
    }
 
    // Filter repositories by name or description
    function filterRepos(query) {
        filteredRepos = repos.filter(repo => repo.name.includes(query) || (repo.description && repo.description.includes(query)));
        totalRepos = filteredRepos.length;
        currentPage = 1;
        displayRepos();
        displayPagination();
    }
 
    // Handle pagination click
    $('#pagination').on('click', 'a', function (e) {
        e.preventDefault();
        currentPage = parseInt($(this).data('page'));
        displayRepos();
        displayPagination();
    });
 
    // Handle search button click
    $('#searchButton').on('click', function () {
        let query = $('#searchInput').val();
        filterRepos(query);
    });
 
    // Handle search input enter key press
    $('#searchInput').on('keypress', function (e) {
        if (e.which === 13) {
            let query = $(this).val();
            filterRepos(query);
        }
    });
 
    // Fetch user info and repositories on page load
    fetchUserAndRepos();
 });
 