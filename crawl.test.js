const {normalizeURL, getURLsFromHTML} = require('./crawl.js');
const {test, expect} = require('@jest/globals');

test('normalizeURL strip protocol', () => {
    const input = 'https://blog.boot.dev/path';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toBe(expected);
});
test('normalizeURL strip protocol', () => {
    const input = 'https://blog.boot.dev/path/';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toBe(expected);
});

test('GetURLsFromHTML Absolute', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="https://blog.boot.dev/path">Link</a>
        </body>
    </html>
    `;
    const inputBaseURL = "https://blog.boot.dev";
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = ["https://blog.boot.dev/path"]; // Corrigido o valor esperado
    expect(actual).toEqual(expected); // Usando toEqual para comparar arrays
});
test('GetURLsFromHTML Relative', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="/path/">Link</a>
        </body>
    </html>
    `;
    const inputBaseURL = "https://blog.boot.dev";
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = ["https://blog.boot.dev/path/"]; // Corrigido o valor esperado
    expect(actual).toEqual(expected); // Usando toEqual para comparar arrays
});
test('GetURLsFromHTML bouth', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="https://blog.boot.dev/path1">Link blog path 1</a>
            <a href="/path2/">Link blog path 2</a>
        </body>
    </html>
    `;
    const inputBaseURL = "https://blog.boot.dev";
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = ["https://blog.boot.dev/path1", "https://blog.boot.dev/path2/"];
    expect(actual).toEqual(expected);
});

test('GetURLsFromHTML invalid', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="invalid">Link invalid</a>
        </body>
    </html>
    `;
    const inputBaseURL = "https://blog.boot.dev";
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = []; // URLs inválidas devem ser ignoradas
    expect(actual).toEqual(expected);
});



