const { JSDOM, VirtualConsole } = require('jsdom');


async function crawlPage(baseURL, currentURL, pages) {
    if (!currentURL) return pages;

    const baseURLOBJ = new URL(baseURL);
    const currentURLOBJ = new URL(currentURL);

    if (baseURLOBJ.hostname !== currentURLOBJ.hostname) return pages;

    const normalizedCurrentURL = normalizeURL(currentURL);

    // Se a URL já foi mapeada, apenas incrementa e retorna
    if (pages[normalizedCurrentURL]) {
        pages[normalizedCurrentURL]++;
        return pages;
    }

    // Se for a primeira vez que encontramos a URL, inicializamos com 1
    pages[normalizedCurrentURL] = 1;
    console.log(`Active crawling ${currentURL}`);

    try {
        const resp = await fetch(currentURL);
        if (resp.status >  399) {
            console.log(`error in fetch with status ${resp.status}: ${currentURL}`);
            return pages;
        }

        const contentType = resp.headers.get("content-type");
        if (!contentType || !contentType.includes("text/html")){
            console.log(`Non html response content type: ${currentURL}, on page ${baseURL}`);
            return pages;
        }



        const htmlBody = await resp.text();
        const nextURLs = getURLsFromHTML(htmlBody, baseURL);

        for (const nextURL of nextURLs) {
            // Continua o rastreamento com a mesma estrutura `pages`
            await crawlPage(baseURL, nextURL, pages);

        }
    } catch (error) {
        console.error(`Error in fetch ${currentURL}: ${error.message}`);
    }

    return pages;
}




function getURLsFromHTML(htmlBody, baseURL) {
    const urls = [];
    const virtualConsole = new VirtualConsole();
    
    // Ignora mensagens de erro do CSS
    virtualConsole.on("error", (err) => {
        if (err.message.includes("Could not parse CSS stylesheet")) {
            return;
        }

    });

    const dom = new JSDOM(htmlBody, { virtualConsole });
    const links = dom.window.document.querySelectorAll("a");

    links.forEach((link) => {
        const href = link.getAttribute("href");
        if (!href) return;

        try {
            if (href.startsWith("/")) {
                urls.push(new URL(href, baseURL).href);
            } else {
                urls.push(new URL(href).href);
            }
        } catch (error) {
            return;
        }
    });

    return urls;
}


function normalizeURL(urlString) {
    const urlObj = new URL(urlString);
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
    return hostPath.endsWith('/') ? hostPath.slice(0, -1) : hostPath;
}


module.exports = {normalizeURL, getURLsFromHTML, crawlPage};