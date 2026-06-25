const { chromium } = require("playwright");

const sizes = [
  [1440, 900],
  [1366, 768],
  [768, 1024],
  [390, 844],
];
const targetUrl = process.env.RESPONSIVE_URL || "http://127.0.0.1:5173";

(async () => {
  const browser = await chromium.launch({ headless: true });
  for (const [width, height] of sizes) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(targetUrl, {
      waitUntil: "networkidle",
      timeout: 30000,
    });
    const result = await page.evaluate(() => {
      const sidebar = document.querySelector("aside");
      const nav = document.querySelector("nav.fixed.inset-x-0.bottom-0");
      return {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
        title: document.title,
        sidebarDisplay: sidebar ? getComputedStyle(sidebar).display : "missing",
        bottomNavDisplay: nav ? getComputedStyle(nav).display : "missing",
      };
    });
    console.log(
      `${width}x${height} ${JSON.stringify(result)} overflow=${result.scrollWidth > result.clientWidth}`,
    );
    await page.close();
  }
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
