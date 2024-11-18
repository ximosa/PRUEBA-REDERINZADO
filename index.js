const siteID = 'expertoweb2.wordpress.com';
const postsContainer = document.getElementById('posts');
const postsPerPage = 6;
let currentPage = 1;
let currentCategory = '';

async function fetchCategories() {
    try {
        const response = await fetch(`https://public-api.wordpress.com/rest/v1.1/sites/${siteID}/categories`);
        const data = await response.json();
        renderCategories(data.categories);
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
    }
}

function renderCategories(categories) {
    const categorySelect = document.getElementById('category-select');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.slug;
        option.text = category.name;
        categorySelect.appendChild(option);
    });

    categorySelect.addEventListener('change', () => {
        currentCategory = categorySelect.value;
        currentPage = 1;
        fetchPosts(currentPage, currentCategory);
    });
}

async function fetchPosts(page, category = '') {
    let apiUrl = `https://public-api.wordpress.com/rest/v1.1/sites/${siteID}/posts?number=${postsPerPage}&offset=${(page - 1) * postsPerPage}`;
    if (category) {
        apiUrl += `&category=${category}`;
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        renderPosts(data.posts);
        renderPagination(data.found, page, category); // Pasar la categoría a renderPagination
    } catch (error) {
        console.error('Error al obtener los posts:', error);
    }
}

function renderPosts(posts) {
    postsContainer.innerHTML = '';
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        const encodedTitle = encodeURIComponent(post.title);
        let postContent = '';


         // Obtener la primera imagen
        const firstImageRegex = /<img.+?src="(.+?)".+?>/; // Regex para extraer src de la primera img
        const firstImageMatch = post.content.match(firstImageRegex);
        const firstImageUrl = firstImageMatch ? firstImageMatch[1] : ''; // si no hay imagen dejarlo vacio.


        if (firstImageUrl) {
            postContent += `<a href="post.html?title=${encodedTitle}"><img class="round small" src="${firstImageUrl}" alt="${post.title}"></a>`;
        }

        postContent += `
            <h2><a href="post.html?title=${encodedTitle}">${post.title}</a></h2>
            <p>${post.excerpt}</p>
           
        `;
        postElement.innerHTML = postContent;  // Asignar a postElement


        postsContainer.appendChild(postElement);
    });
}


function renderPagination(totalPosts, currentPage, category = '') { // Aceptar categoría
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const paginationContainer = document.getElementById('pagination');

    if (totalPages > 1) {
        paginationContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('a');
            pageLink.href = '#';
            pageLink.textContent = i;
            pageLink.addEventListener('click', () => {
                currentPage = i;
                fetchPosts(currentPage, category); // Pasar la categoría a fetchPosts
            });

            if (i === currentPage) {
                pageLink.classList.add('active');
            }
            paginationContainer.appendChild(pageLink);
        }
    }
}

fetchCategories();
fetchPosts(currentPage);

