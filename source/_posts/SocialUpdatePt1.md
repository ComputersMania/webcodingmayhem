---
title: How to share your feed on socials
desc: JavaScript tutorial about a script to post to socials given a feed
date: 2018-03-17 15:59:57
tags:
---

You think you need to promote your blog on social?  Here It is the way you can do this with your own script using node js.
In this first part we will go through the core functionalities you need for the script, as well as the basic coding skills you need to learn.
<!-- more -->
To jump straight to the code [clik here](#coding)


# Style of coding

For this project I'm going to use some advanced features of the language that are not yet mainstream on web browsers EcmaScript platform.

## ES6 syntax

Because I'm using node js, I have access to the latest additions to the JavaScript language, so you can expect to see some strange syntax.
For example instead of
```js
var sum = function(a, b) {
  return a+b;
};
```
you will see
```js
let sum = (a,b) => {
  return a+b
}
```
You can now use `(arguments)=> {}` instead of `function(arguments) {}`. You can also omit the semicolumn at the end of each line and use `let` statements. You can learn more about them [here](https://goo.gl/Vz2Wyi)

## Promises

Since most of the libraries I'm going to use are asynchronous, as it is becoming the standard in JavaScript, expecially when you need to contact a Web Api, I'm going to use promises instead of callback functions pretty much everywhere I can.
The major convinience of using Promises over Callbacks is that using them you are able to write asynchronous functions the same way you are used to write normal ones. You can do that since the addition in ES6 of async/awayt keywords. You can learn more about them in the [official documentation](https://goo.gl/pnjajU), but I'll probably talk about them in a future post.

# Main libraries

To build this script I used a couple of libraries.
You can install any of them with `npm i modulename`, given that you have node and npm installed.
Here there are the ones I'll be using in this post.

## Rss parser

`rss-parser` is a node module that automates parsing a rss feed asynchronously. Its main function is
```js
parser.parseURL(sitemap_url)
```
that returns a promise that resolves in an object representing the feed.

## Node persist

`node-persist` is another library useful for persistent storage. It stores the data in a plain json file. As it's not encrypted in anyway, it is not reccomended to store passwords of any type. It provides both sync and async methods: for example you can do
```js
storage.getItemSync('text').then(console.log)
```
but also
```js
console.log(storage.getItemSync('text'))
```
However note that the second option is going to make the routine to stop and wait until the information is retrieved.

## Google apis

`googleapis` is the official library to interface with google apis on node js. You can use it just for an api in the way we will see later. I'm using it to use the googl shortener web api.
Note that this library does not support promises now and probably it won't do so in the future, as noted in [this issue](https://goo.gl/pG9dPe). Infact its methods are callback functions, but you can build promises using the built in `util.promisify(function)` function.

# <a name="coding"></a> Code walkthrough

You can take a look to the code that I'm explaining in this post in [this gist](https://goo.gl/NnPTS5).

## Main routine

The main routine is very simple. I parse a feed with `parser.parseURL` and then I have a callback that runs a function for each item of the array of items it returns. For each of them I check asynchronously if it is valid for posting and if it is I log it's link to console and store it in a array that is persistently stored in a file.

Eventually I'll have some code to post to socials instead of just printing it out and I'll expose a webhook to run the routine as needed.

Now I'll explain how I do it in a clean and reliable fashion.

## Requires

In the first part of the code i require all the library I need. Some libraries are classes so you need to spawn an object of them as you can see here
```js
const Parser = require('rss-parser')
let parser = new Parser
```
others are just an object like
```js
let storage = require('node-persist')
```
This library also requires a call to a function to set the path of the db.

I also have some code to populate the db at first boot. It checks whether there are any items in the db, and if it is empty it adds an Array item to it.
```js
if (storage.values().length == 0) {
  storage.setItemSync('history', [])
}
```

The settings have to be provided as environmental variables for reasons I'll discuss at time of deploy. If a setting crucial to the task of the script I'll throw an error and exit.

Some functionalities are optional so I load the related libraries only if the keys are set as for googleapis:
```js
if (typeof process.env.GOOGLE_API_KEY !== 'undefined') {
  const {google} = require('googleapis')
}
```
Note that you should always use var when you are declaring something inside a block, for istance at line 33 I use var instead of let because otherwise it would not be reliable to refernce it from outside the block.

## Utility functions

I defined a function for each task I needed to accomplish, to make the code cleaner, easier to maintain and to avoid reusing it.

I tried to make only the function I'm using accessible to the rest of the code in the cleanest way ever.
So i defined `urlshortener` as an async function that returns directily the link I need after having extracted it from the response of the api.
```js
var shorten = async (link) => {
  try {
    var item = await shortenerpromise({
      key: process.env.GOOGLE_API_KEY,
      resource: {
        longUrl: link
      }
    })
  } catch(err) {
    throw err
  }
  return item.data.id
}
```
I also have a function to build modified urls in order to benefit from the custom campaign feature of google analytics. This one is very simple so I won't go into details of this one. You can learn more on how to build this urls [here](https://goo.gl/PqeSv4)

The `validate` function is needed in order to confirm that the item of the feed has not been publicized yet by the script and it is not too old.

## Error handling

Throughout all the code you can find catch blocks and throw commands. This are needed to handle possible errors the program may encounter. You should never ignore error handling because in a script like this that is going to run constantly you don't want the whole program to fail only because you failed to post on one platform.

## Conclusion

For now this is it. I will soon post another article on the implementation of actual posting platforms sooner than you think. If you want you can subscribe to my rss feed up in the navbar.

Here is the code we've covered so far.

<script src="https://gist.github.com/ComputersMania/4e2c90dd5be5b7384c66007d3f053a16.js"></script>
