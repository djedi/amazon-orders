# Amazon Order Scraper

This Node.js script uses Playwright to scrape the Amazon website and retrieve the order history for one or more accounts. The script logs in to each account, navigates to the orders page, and extracts information such as the order date, total amount, order number, and product names. The results are written to a JSON file called `orders.json`.

## Requirements

This script requires Node.js and Playwright to be installed on your machine.

## Usage

To use this script, follow these steps:

1. Clone this repository to your local machine.
2. Install the dependencies by running `npm install` or `yarn`.
3. Create an `accounts.json` file in the root directory of the project. This file should contain an object with one or more Amazon account credentials. Each account should have an `email` and `password` property. For example:

```json
{
  "myaccount": {
    "email": "myemail@example.com",
    "password": "mypassword"
  },
  "anotheraccount": {
    "email": "anotheremail@example.com",
    "password": "anotherpassword"
  }
}
```

4. Run the script with the following command: `node index.js [accountName]`. The `accountName` parameter is optional and can be used to specify a single account to retrieve orders for. If this parameter is not provided, orders for all accounts in `accounts.json` will be retrieved. For example:

```sh
node get_orders.js myaccount
```

## Output

The script will create a file called `orders.json` in the root directory of the project. This file will contain an array of orders, with each order represented by an object with the following properties:

- `who`: The name of the account that the order belongs to.
- `date`: The date the order was placed.
- `total`: The total cost of the order.
- `number`: The order number.
- `products`: An array of product names in the order.

## License

This project is licensed under the MIT License. See the LICENSE file for more information.
