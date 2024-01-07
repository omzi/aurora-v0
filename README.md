<p align="center" id="top">
	<img height="100px" src="public/images/logo.png" alt="Aurora Logo">
	<p align="center">✨ Your all-in-one solution for simplifying small business payments.</p>
</p>

<div align="center">

![](https://img.shields.io/github/stars/omzi/aurora-v0.svg?color=ff0)
![](https://img.shields.io/github/forks/omzi/aurora-v0.svg?color=ff0)
![](https://img.shields.io/github/languages/top/omzi/aurora-v0?color=222FE6)
![](https://img.shields.io/github/languages/code-size/omzi/aurora-v0?color=222FE6)
![](https://img.shields.io/github/issues/omzi/aurora-v0.svg)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?color=222FE6)](https://github.com/omzi/aurora-v0/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?color=222FE6)](https://opensource.org/licenses/MIT)
![](https://img.shields.io/twitter/follow/0xOmzi.svg?style=social&label=@0xOmzi)
![](https://img.shields.io/twitter/follow/titoonw.svg?style=social&label=@titoonw)
![](https://img.shields.io/twitter/follow/bohemiancode-x.svg?style=social&label=@bohemiancode-x)
![](https://img.shields.io/twitter/follow/Ademarymi.svg?style=social&label=@Ademarymi)

</div>

<br>
<h4><a href="https://aurora-v0.vercel.app/"><i>Live Demo</i> 🚀</a></h4>

---

## 📜 **About**

Aurora is your go-to application, designed to simplify small business payments. It provides a seamless platform for business owners to manage invoices, track payments, and streamline their financial processes.

## ⚙️ **Features**

- [x] Business Profile Setup
- [x] Customer Management
- [x] Real-time Analytics on the Dashboard
- [x] Invoice Creation and Management
- [x] Prevention of Duplicate Payments
- [ ] Automated Payment Reminders
- [ ] User Feedback Mechanisms
- [ ] Enhanced User Interface

## 🛠 **Tech Stack**

- **_Full Stack Framework:_** [Next.js](https://nextjs.org/)
- **_Database:_** [MongoDB](https://www.mongodb.com/) (w/ [Prisma](https://www.prisma.io/))
- **_Authentication:_** [NextAuth](https://next-auth.js.org/)
- **_Styling:_** [Tailwind CSS](https://tailwindcss.com/)
- **_Programming Language:_** [TypeScript](https://www.typescriptlang.org/)

## 🚩 **Prerequisites**

Ensure that your system meets the following requirements:

- [Node.js](https://nodejs.org/) version >= 18.18.0
- [npm](https://www.npmjs.com/) version >= 9.8.1

## ⚡ **Installation**

Before proceeding, make sure your system satisfies the prerequisites mentioned above. <br><br>
Firstly, clone the Aurora repository into your desired folder and navigate into it:

```shell
$ git clone https://github.com/omzi/aurora-v0 && cd aurora
```

Install the project dependencies using npm (or yarn if you prefer):

```shell
npm i
```

## ⚙ **Environment Variables**

Aurora requires certain environment variables to be set to function properly. Create a `.env` file in the root of your project and add the following variables:

```shell
NODE_ENV = # Your current environment
NEXTAUTH_SECRET = # Your NextAuth secret
NEXTAUTH_URL = # Eg: http://localhost:3000

EDGE_STORE_ACCESS_KEY = # Your EdgeStore access key
EDGE_STORE_SECRET_KEY = # Your EdgeStore secret key
BREVO_API_KEY = # Your Brevo API key

DATABASE_URL = # Your Database URL

PAYSTACK_TEST_PK = # Your Paystack test public key
PAYSTACK_TEST_SK = # Your Paystack test secret key
```

Explanation of the environment variables:

- **`NODE_ENV`**: Set it to `development` for local development.
- **`NEXTAUTH_SECRET`**: To generate a secret key for NextAuth, enter your terminal (or Git Bash) & type the following:
<ul>

```shell
openssl rand -base64 32
```

Set the value of **`NEXTAUTH_SECRET`** to the result.

</ul>

- **`NEXTAUTH_URL`**: Set it to the URL where your Aurora application is hosted during development.
  For external services:
- **`EDGE_STORE_ACCESS_KEY`** and **`EDGE_STORE_SECRET_KEY`**: These are access and secret keys for your [EdgeStore](https://edgestore.dev/) (for handling file uploads) service.
- **`BREVO_API_KEY`**: This is the API key for the Brevo (a transactional email provider) service.
- **`DATABASE_URL`**: Set it to the connection string of your MongoDB cluster.
- **`PAYSTACK_TEST_PK`**: Your [Paystack](https://paystack.com/) (for payments) test public key. If you don't a Paystack account, you'll have to [create one](https://dashboard.paystack.com/#/signup).
- **`PAYSTACK_TEST_SK`**: Your Paystack test secret key.

Once the environment variables are set, you can run Aurora locally with:

```shell
npm run dev
```

Visit the URL `http://localhost:3000/` in your browser to access the Aurora application.

## 👥 **Contributors**

- [Omezibe Obioha](https://github.com/omzi/) (@0xOmzi)
- [Tito Onwudinjo](https://github.com/titoonw/) (@titoonw)
- [Emmanuel Adisa](https://github.com/bohemiancode-x/) (@emmie_porsche)
- [Adebanjo Mary](https://github.com/Kaempy/) (@Ademarymi)

## 📄 **License**

This project is licensed under the MIT License. See the [`LICENSE`](./LICENSE) file for more details.

## ❌ **Disclaimer**

This project is a submission to the [Klusterthon 2023](https://www.kluster.africa/klusterthon/) organized by [Stutern](https://www.stutern.com/). It is **NOT** yet production-ready!

---

[Back To Top ↺](#top)

> Made with &#9829;
