const puppeteer = require('puppeteer');
const fs = require('fs');


let count = 0;
const scrapeWebsite = async (req, res) => {
    const { url } = req.body;
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
    });

    try {
        const page = await browser.newPage();
        await page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 0,
        });

        const pageText = await page.evaluate(() => {
            const unwantedSelectors = ['header', 'footer', 'nav', '.navbar', '.footer', '.contact', '.about', '.newsletter'];
            unwantedSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => el.remove());
            });
            return document.body.innerText.trim();
        });

        if (pageText) {
            console.log(pageText);
            await page.close();
            await browser.close();
            count = count + 1
            fs.appendFileSync(`text ${count}.txt`, pageText);
            return res.json({
                success: 'Website scraped successfully',
            });
        } else {
            await page.close();
            await browser.close();
            return res.json({
                error: 'No text content found on the website',
            });
        }

    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        await browser.close();
        return res.json({
            error: 'Error scraping website',
        });
    }
};

module.exports = { scrapeWebsite };
