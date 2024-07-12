# Budgeter (WIP)

Budgeter is a quite simple application which helps you to manage your money manually.<br>
It's just a personal project that has been made because I have always struggled to keep track of my payments and transactions that are paid in cash.

*Currently, it uses only the LocalStorage API to store data so it doesn't have a database or any backend services behind the application.*

---

## Options by pages
> Here, you can find helpful information about the possibilities of the application separated by pages.

### Home
- You can find a summary about your total balance that you can filter by budgets and currencies. Furthermore, you can do calculations about how much money you have based on the rate of a specific currency.
- Additionally, you can see a little preview about your recent transactions and your recent payments within your budgets.

### Budget Details
- It is basically the same as the homepage but it focuses only for the specific budget.
- You can add notes to budgets and you can manage these from this page.

### Transactions
- This page is designed to **manage transactions**.
- You can **create**, **delete**, **filter**, **search** or **put in order** your transactions as you want.

### Backup
- This page is designed to **manage backups**.
- You can create backups to **save the actual state of your budgets**. It doesn't need to be a whole backup of your data, you can select the budgets that you would like to save in a backup.
- You are able to **restore a saved backup**. If you restore a backup, it will not affect budgets that the backup doesn't contain.

---

## Core Logic of different data models
> Here, you can find information that could be useful to understand how the different data models look like and how they are related with each other. This makes it easier to recognize how you should use different options within the application.

### Budgets
- Every `budget` has its own balance with a **specified currency**.
- `Income & losses` are calculated by the created transactions and payments.
- You can `transfer money` between budgets. *(It won't be calculated as an income or loss on the affected budgets.)*
- Every budget has a `+` and `-` borrowment value. *(These are used for tracking transactions with the type of borrowment.)*
  | Value            | Description
  | :--------------- | :--------------------------------------------------------------------
  | `+` *(positive)* | The loans that you have borrowed from someone and are currently **increasing your balance**.<br>*(You might have to pay it back.)*
  | `-` *(negative)* | The loans that you have lent to someone and are currently **reducing your balance**.<br>*(This will likely be refunded.)*

- Additionally, you can add **notes** to a budget.

### Transactions
- There are **two types** of transactions.
  | Type           | Description
  | :------------- | :--------------------------------------------------------------------
  | `default`      | It is used in general. For instance, when you pay for something and you won't get back the money or when you got money from someone but you don't have to pay it back.
  | `borrow`       | It is used when you've borrowed money from someone and you have to pay it back or when you've lent money to someone and you'll get back that money.
  | *`(transfer)`* | *Transfers are basically transactions but you don't have any control above it.*

- Transactions have a `processed` state which means you can create transactions without affecting your current balance. In `borrowments` it is used to determine that the transaction has been already **paid back or not**.

### Payments
- There are **two types** of payments.
  | Type          | Description
  | :------------ | :--------------------------------------------------------------------
  | `+` *(plus)*  | Payments that *`increase`* your balance.
  | `-` *(minus)* | Payments that *`decrease`* your balance.

- In the UI, there is a simple markup logic behind the payments.
  | Color                 | Hex                                                                  | Description
  | :-------------------- | :------------------------------------------------------------------- | :-------------------
  | `yellow` *(accent)*   | ![#d79b23](https://placehold.co/15x15/d79b23/d79b23.png) *#d79b23* | Currently *`increases`* your balance.
  | `red` *(destructive)* | ![#e44444](https://placehold.co/15x15/e44444/e44444.png) *#e44444* | Currently *`decreases`* your balance.
  | `gray` *(muted)*      | ![#928b8b](https://placehold.co/15x15/928b8b/928b8b.png) *#928b8b* | Currently *doesn't affect* your balance at all.

---

### 3rd party APIs

| API                                                   | Used for
| :---------------------------------------------------- | :--------------------------------------------------------------------
| [ExchangeRate-API](https://www.exchangerate-api.com/) | - get available **currencies** with currency codes<br>- **rate conversion** between currencies

---

### TODO

- [ ] Authentication
- [ ] REST API
- [ ] Money splitter [#2](https://github.com/maateh/budgeter/issues/2)
- [ ] Wishlist
- [ ] Recurring transactions [#24](https://github.com/maateh/budgeter/issues/24)
