// Initialize posts from localStorage
let posts = JSON.parse(localStorage.getItem('posts')) || [];

// Function to create a post
function createPost(content, image = null) {
    const newPost = {
        id: Date.now(),
        content: content,
        image: image,
        likes: 0,
        comments: []
    };

    // Save the new post in localStorage
    posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));

    // Re-render posts
    renderPosts();
}

// Function to render posts
function renderPosts() {
    const postFeed = document.querySelector('.post-feed');
    postFeed.innerHTML = '';  // Clear existing posts

    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.classList.add('post-card');
        postCard.setAttribute('data-id', post.id);

        let postImage = '';
        if (post.image) {
            postImage = `<img src="${post.image}" alt="Post Image">`;
        }

        postCard.innerHTML = `
            ${postImage}
            <p><strong>User</strong>: ${post.content}</p>
            <p><strong>Likes:</strong> ${post.likes}</p>
            <div class="likes-comments">
                <button class="like-btn" onclick="likePost(${post.id})">Like</button>
                <button class="comment-btn" onclick="openCommentModal(${post.id})">Comment</button>
            </div>
            <div class="comments">
                ${post.comments.map(comment => `<p>${comment}</p>`).join('')}
            </div>
        `;

        postFeed.appendChild(postCard);
    });
}

// Function to like a post
function likePost(postId) {
    const post = posts.find(p => p.id === postId);
    post.likes++;
    localStorage.setItem('posts', JSON.stringify(posts));
    renderPosts();
}

// Function to open the comment modal
function openCommentModal(postId) {
    const comment = prompt('Enter your comment:');
    if (comment) {
        const post = posts.find(p => p.id === postId);
        post.comments.push(comment);
        localStorage.setItem('posts', JSON.stringify(posts));
        renderPosts();
    }
}

// Handle the post creation form submission
document.querySelector('#create-post-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const postContent = document.querySelector('#post-content').value;
    const postImage = document.querySelector('#post-image').files[0];

    if (postImage) {
        const reader = new FileReader();
        reader.onload = function(e) {
            createPost(postContent, e.target.result);
        };
        reader.readAsDataURL(postImage);
    } else {
        createPost(postContent);
    }
});

// Initialize posts on page load
document.addEventListener('DOMContentLoaded', function() {
    renderPosts();
});
