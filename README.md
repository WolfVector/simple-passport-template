# Passport template

Simple passport template using google and azure providers

## Donwload

Download the repo using the `code` button above or do a git clone

```bash
$ git clone https://github.com/WolfVector/simple-passport-template.git
```

## Install

Just go to the path and execute the next command:

```bash
$ npm install
```

## Provider configuration

Inside the file `.env.example` there are some variables you will have to fill. Use the ones that you need. Once you have the variables, rename the file to `.env`

In the file `routes/auth.js` you will find the providers configuration. It is very important that you replace the callbackUrls with the ones you have in your Google and Azure account (redirect uri).

## Run in dev

```bash
$ npm run dev
```

This will run the application using nodemon, in this way you will be able to make changes and the server will restart automatically.

## Run in prod

```bash
$ npm run start
```
