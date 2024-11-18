const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateStaticPages() {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    
    try {
        const response = await fetch('https://public-api.wordpress.com/rest/v1.1/sites/expertoweb2.wordpress.com/posts');
        const data = await response.json();
        
        // Crear directorio posts si no existe
        const postsDir = './dist/post';
        if (!fs.existsSync(postsDir)){
            fs.mkdirSync(postsDir);
        }
        
        for (const post of data.posts) {
            const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title}</title>
    <meta name="description" content="${post.excerpt.replace(/<[^>]*>/g, '').substring(0, 160)}">
    <meta name="keywords" content="experto wordpress, trabajos wordpres, Web Full-Stack">
    <link href="https://cdn.jsdelivr.net/npm/beercss@3.7.12/dist/cdn/beer.min.css" rel="stylesheet">
</head>
<body>
    <div id="header"></div>
    <main class="medium-padding" style="max-width: 750px; margin: 0 auto">
        <a class="button border secondary" href="../blog">Volver al blog</a>
        <article>
            <h1>${post.title}</h1>
            ${post.content}
        </article>
    </main>
    <div id="footer"></div>
    <script type="module" src="https://cdn.jsdelivr.net/npm/beercss@3.7.12/dist/cdn/beer.min.js"></script>
    <script src="../script.js"></script>
    <script src="../main.js"></script>
</body>
</html>`;
            
            // Guardar el archivo HTML
            fs.writeFileSync(`${postsDir}/${post.slug}.html`, html);
            console.log(`Generada página para: ${post.title}`);
        }
        
        console.log('Generación de páginas completada');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
    
    await browser.close();
}

generateStaticPages();

