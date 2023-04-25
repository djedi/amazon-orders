const { chromium } = require("playwright");
const fs = require("fs");

// get account info from accounts.json
const accountData = require("./accounts.json");
const { exit } = require("process");

// First parameter is the name of the account to get orders for
// if an arg was passed in, use that, otherwise use all accounts
const accountName = process.argv[2] || "all";

let accounts = [];
Object.keys(accountData).forEach((key) => {
  if (accountName === "all" || accountName === key) {
    let account = accountData[key];
    account.name = key;
    accounts.push(account);
  }
});

// Remove orders.json if it exists
if (fs.existsSync("orders.json")) {
  fs.unlinkSync("orders.json");
}

let allOrders = [];

(async () => {
  const browser = await chromium.launch({
    headless: false,
  });

  // for each account, get orders
  for (const account of accounts) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://www.amazon.com/gp/sign-in.html");
    // await page.getByRole("link", { name: "Sign in", exact: true }).click();

    // Authenticate
    await page.waitForLoadState("domcontentloaded");
    const emailInputElem = await page.$("#ap_email");
    await emailInputElem.fill(account.email);
    await emailInputElem.press("Enter");
    await page.getByLabel("Password").fill(account.password);
    await page.getByLabel("Password").press("Enter");

    // Go to Orders page
    await page.getByRole("link", { name: "Returns & Orders" }).click();
    await page.waitForLoadState("domcontentloaded");

    // Get each order card
    const cards = await page.$$(".js-order-card");

    // For each card, get the order date, total amount and order number
    const orders = await Promise.all(
      cards.map(async (card) => {
        const order = { who: account.name };
        const [dateElem, totalElem, orderNumberElem] = await card.$$(
          ".a-color-secondary.value"
        );
        order.date = await (await dateElem.textContent()).trim();
        order.total = await (await totalElem.textContent()).trim();
        order.number = await (await orderNumberElem.textContent()).trim();

        const linkElems = await card.$$(
          ".a-box.shipment div.a-fixed-left-grid-col.yohtmlc-item.a-col-right .a-link-normal"
        );
        order.products = await Promise.all(
          linkElems.map(async (linkElem) => {
            return (await linkElem.textContent()).trim();
          })
        );

        return order;
      })
    );

    // add orders to allOrders
    allOrders = allOrders.concat(orders);

    // ---------------------
    await context.close();
  }
  await browser.close();

  // write orders to file
  fs.writeFileSync(`orders.json`, JSON.stringify(allOrders, null, 2));
})();
