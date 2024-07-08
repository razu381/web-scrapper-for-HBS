const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const formData = {
    reason: "General interest",
    lastName: "shohidul islam",
    firstName: "Razu",
    country: "Bangladesh",
    region: "South Asia",
    institution: "Noakhali college",
    topic: "Emerging Markets",
    email: "sirazu52@gmail.com"
};

const logFile = path.join(__dirname, 'download_log.txt');

const logMessage = (message) => {
    const logEntry = `${new Date().toISOString()} - ${message}\n`;
    fs.appendFileSync(logFile, logEntry);
    console.log(message);
};

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        logMessage('Navigating to the main page');

        //change link here??????????????????????????
        await page.goto('https://www.hbs.edu/creating-emerging-markets/interviews/Pages/default.aspx?HBSGeographicArea=Africa');

        //????????????? change iteration here ?????????
        async function clickLoadMore(page, totalIteration = 0) {
            const loadMoreButtonSelector = 'a.facetctrl-ajax-nextpage';
        
            for (let i = 0; i < totalIteration; i++) {
                const loadMoreButton = await page.$(loadMoreButtonSelector);
                if (loadMoreButton) {
                    await page.evaluate(button => button.click(), loadMoreButton);
        
                    // Wait for 2 seconds
                    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
        
                    await page.waitForSelector(loadMoreButtonSelector, { visible: true }).catch(() => {
                        console.log('No "Load More Results" button found after waiting.');
                    });
                } else {
                    console.log('No "Load More Results" button found.');
                    break;
                }
                console.log(`Load more iteration = ${i + 1}`);
            }
        
            console.log(`Finished clicking ${totalIteration} times.`);
        }
        await clickLoadMore(page)        

        logMessage('Extracting the  links for "Download Transcript (pdf)"');
        const links = await page.evaluate(() => {
            const anchors = Array.from(document.querySelectorAll('a')).filter(a => a.textContent.includes("Download Transcript (pdf)"));
            return anchors.map(anchor => anchor.href);
        });

        logMessage(links.length)
        if (links.length > 0) {
            for (const descLink of links) {
                const pdfPage = await browser.newPage();
                try {
                    logMessage(`Processing link: ${descLink}`);
                    await pdfPage.goto(descLink);

                    logMessage('Filling the form');
                    await pdfPage.waitForSelector(`input[type="checkbox"][value="${formData.reason}"]`);
                    await pdfPage.type('input[name="3. Last Name"]', formData.lastName);
                    await pdfPage.type('input[name="4. First Name"]', formData.firstName);
                    await pdfPage.type('input[name="5. Country of Residence"]', formData.country);
                    await pdfPage.select('select[name="6. Region"]', formData.region);
                    await pdfPage.type('input[name="7. Institution"]', formData.institution);
                    await pdfPage.type('input[name="8. Research Topic"]', formData.topic);
                    await pdfPage.type('input[name="9. Email"]', formData.email);

                    logMessage('Submitting the form');
                    await Promise.all([
                        pdfPage.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 }),
                        pdfPage.evaluate(() => {
                            document.querySelector('form').submit();
                        })
                    ]);
                    logMessage('Form submitted');

                    await pdfPage.waitForSelector('a.btn.btn-right.pdf');
                    const pdfUrl = await pdfPage.evaluate(() => {
                        const link = document.querySelector('a.btn.btn-right.pdf');
                        return link ? link.href : null;
                    });

                    if (pdfUrl) {
                        logMessage('Adding PDF link to file');
                        fs.appendFileSync('pdflinks.txt', pdfUrl + '\n');
                        logMessage('Link added to links.txt');
                    } else {
                        logMessage('No PDF link found on Thank You page');
                    }

                } catch (error) {
                    logMessage(`Error processing link ${descLink}: ${error.message}`);
                } finally {
                    await pdfPage.close();
                }
            }
        } else {
            logMessage('No "Download Transcript (pdf)" link found');
        }

    } catch (error) {
        logMessage(`Error navigating to the main page or extracting links: ${error.message}`);
    } finally {
        await browser.close();
        logMessage('Browser closed');
    }
})();
