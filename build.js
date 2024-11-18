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
        // Obtener posts de WordPress
        const response = await fetch('https://public-api.wordpress.com/rest/v1.1/sites/expertoweb2.wordpress.com/posts');
        const data = await response.json();
        
        // Crear directorio dist si no existe
        fs.mkdirSync('./dist', { recursive: true });
        
        // Copiar archivos estáticos
        fs.copyFileSync('./index.html', './dist/index.html');
        fs.copyFileSync('./post.js', './dist/post.js');
        
        // Generar páginas para cada post
        for (const post of data.posts) {
            const postPath = `./dist/${post.slug}`;
            fs.mkdirSync(postPath, { recursive: true });
            
            // Generar HTML con contenido pre-renderizado
            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="description" content="${post.excerpt.replace(/<[^>]*>/g, '').substring(0, 160)}">
                    <title>${post.title}</title>
                </head>
                <body>
                    <div id="post-content">
                        <h1>${post.title}</h1>
                        ${post.content}
                    </div>
                </body>
                </html>
            `;
            
            fs.writeFileSync(`${postPath}/index.html`, html);
        }
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
    
    await browser.close();
}

generateStaticPages();
