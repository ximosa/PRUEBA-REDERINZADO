// Crear meta descripción al inicio
const metaDescription = document.createElement('meta');
metaDescription.setAttribute('name', 'description');
metaDescription.setAttribute('content', 'Cargando...');
document.head.insertBefore(metaDescription, document.head.firstChild);

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\{text}');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const siteID = 'expertoweb2.wordpress.com';
const postTitle = getParameterByName('title');
const postsContainer = document.getElementById('post-content');

document.addEventListener('DOMContentLoaded', () => {
    fetchPostContent(decodeURIComponent(postTitle));
});

async function fetchPostContent(title) {
    try {
        const response = await fetch(`https://public-api.wordpress.com/rest/v1.1/sites/${siteID}/posts?search=${title}`);
        const data = await response.json();

        if (data.posts && data.posts.length > 0) {
            const post = data.posts[0];
            
            // Limpiar y actualizar meta descripción
            const cleanExcerpt = post.excerpt
                .replace(/<[^>]*>/g, '')
                .replace(/\[&hellip;\]/g, '...')
                .replace(/&hellip;/g, '...')
                .trim()
                .substring(0, 160);

            metaDescription.setAttribute('content', cleanExcerpt);

            // Enlazar imágenes dentro del contenido del post
            const contentWithImageLinks = post.content.replace(/<img.+?src="(.+?)".+?>/g, (match, imageUrl) => `<a href="index.html?title=${encodeURIComponent(title)}"><img src="${imageUrl}" alt="${title}"></a>`);

            postsContainer.innerHTML = `<h1>${post.title}</h1>${contentWithImageLinks}`;

            if (post.categories) {
                const categoryLinks = Object.keys(post.categories).map(catSlug => `<a href="index.html?category=${catSlug}">${post.categories[catSlug].name}</a>`).join(', ');
                postsContainer.innerHTML += `<p>Categoría: ${categoryLinks}</p>`;
            }
        } else {
            postsContainer.innerHTML = "<p>Post no encontrado.</p>";
            metaDescription.setAttribute('content', 'Post no encontrado en el blog.');
        }

    } catch (error) {
        console.error('Error al obtener el contenido del post:', error);
        postsContainer.innerHTML = "<p>Error al cargar el post.</p>";
        metaDescription.setAttribute('content', 'Error al cargar el contenido del blog.');
    }
}
