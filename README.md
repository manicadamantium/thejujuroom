# README #

### What is this repository for? ###

* Quick summary
* Version
* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

This site is built with [Eleventy](https://11ty.dev). This project is built to be a static website that connects to a serverless function. This is also hosted on [Netlify](https://netlify.com). Here's the summary of the files and folders

- `functions/` contains the serverless functions that deploy to Netlify. It is the "backend" code. Right now it only contains a file called `place-order.js` which sends an email to the seller whenever there's a new order placed. [Documentation for Netlify Functions](https://docs.netlify.com/functions/overview/) can be found on their website. This project followed the Overview and the [Build with JavaScript](https://docs.netlify.com/functions/build-with-javascript/) tutorial.
- `src/` folder contains all of our code and assets for the front end.
  - `src/assets/` folder contains the images, scripts, styles, and templates for our site.
    - `src/assets/images/` folder contains the images used in the site. It is statically served with no further processing. When using images in code, reference it as `/assets/images/your-image-file.jpeg` like so:
    ```html
    <img src="/assets/images/your-file.jpeg" alt="A sample image file.">
    ```
    - `src/assets/scripts/` folder contains all of our **front end** JavaScript. It contains the scripts for user interactions and requests.
      - `src/assets/scripts/__scripts.11ty.js` is a script that compiles our JavaScript files into one file, including dependencies pulled from `npm` JS files inside `components/` and `utilities/` folders
      - `components/` are JS wrappers around user interface components. They are moderately documented with comments as guide.
      - `components/Dialog.js` is a script that handles interactivity around modal components. If you want to create a modal dialog, you will need two things:
        - A `button` with a `data-dialog` attribute that contains the ID of the modal.
        - An element that will become the modal dialog with an ID that is referenced by the button.
        ```html
        <button data-dialog="id-of-modal">Dialog trigger</button>
        <div id="id-of-modal">...</div>
        ```
      - `components/Inventory.js` just fetches the price list. Use it to retrieve the products and feed it into the `ShoppingCart` object
      - `components/ShoppingCart.js` handles the shopping cart functionality

### How do I get set up? ###

* Summary of set up
* Configuration
* Dependencies
* Database configuration
* How to run tests
* Deployment instructions

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact