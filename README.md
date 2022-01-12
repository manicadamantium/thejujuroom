# README #

### What is this repository for? ###

This site is built with [Eleventy](https://11ty.dev). This project is built to be a static website that connects to a serverless function. This is also hosted on [Netlify](https://netlify.com). Here's the summary of the files and folders

- `functions/` contains the serverless functions that deploy to Netlify. It is the "backend" code. Right now it only contains a file called `place-order.js` which sends an email to the seller whenever there's a new order placed. [Documentation for Netlify Functions](https://docs.netlify.com/functions/overview/) can be found on their website. This project followed the Overview and the [Build with JavaScript](https://docs.netlify.com/functions/build-with-javascript/) tutorial.
- `src/` folder contains all of our code and assets for the front end.
  - `src/assets/` folder contains the images, scripts, styles, and templates for our site.
    - `src/assets/images/` folder contains the images used in the site. It is statically served with no further processing. When using images in code, reference it as `/assets/images/your-image-file.jpeg` like so:
    ```html
    <img src="/assets/images/your-file.jpeg" alt="A sample image file.">
    ```
    - `src/assets/scripts/` folder contains all of our **front end** JavaScript. It contains the scripts for user interactions and requests.
      - `__scripts.11ty.js` is a script that compiles our JavaScript files into one file, including dependencies pulled from `npm` JS files inside `components/` and `utilities/` folders
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
      - `utilities/` are JS utilities. It currently only has one file, `dom-helpers`, which contain aliases for commonly-used DOM functions like `querySelector` and `querySelectorAll`.
      - `index.js` is the main script.
    -`src/assets/styles` folder contains all of our SCSS stylesheets
      - `__styles.11ty.js` compiles the SCSS stylesheets into CSS files.
        - To add more CSS files (e.g. stylesheets that are only used in specific pages), add an entry inside the `ENTRY_POINTS` variable.
        - The entry key will be the filename without the `.css` extension. The entry value will be the filename of the source SCSS file.
    - `src/assets/views/` contains the templates and partials of our pages. The templating language is [Nunjucks](https://mozilla.github.io/nunjucks/templating.html).
      - `components/` folder contains the partials that are reused in different parts of the pages.
        - `age-verification.njk` is the modal that appears on page load to verify the user's age.
        - `card.njk` is the template for the product cards that appear in the shopping section.
        - `checkout.njk` contains the modal dialogs that make up the whole checkout process. This is controlled by code found inside `src/assets/scripts/index.js`.
      - `layouts/` folder contains the page templates for pages. Currently it only has `base.njk`.
  - `src/collections/` - contains the different collections used by Eleventy to generate the webpages.
    - `api/` contains the templates for JSON APIs that the site uses. It currently only has `prices.njk`.
      - `api.json` contains the base configuration for all of the `*.njk` files inside this folder. It provides the default permalink for each JSON file.
      - `prices.njk` contains the template for the `/api/v1.0.0/prices.json` API endpoint. The JSON file this produces is then downloaded by `index.js` as reference for the `ShoppingCartManager`. The data for this comes from `src/data/prices.json`.
    - `pages/` contains the pages for the site
      - `pages.json` provides the base configuration for all of the `*.njk` files inside this folder.
      - `index.njk` - the homepage of the site.
      - `terms-and-conditions.njk` - the Terms & Conditions page.
  - `src/config` contains config files for Eleventy
    - `collections.js` defines the collections that Eleventy will create pages for. If you want to add a new collection, like blog posts, just add a new folder for that in `src/collections` and add that path in this file.
    - `filters.js` defines custom filters. More information about filters can be found in the [Eleventy documentation](https://www.11ty.dev/docs/filters/).
    - `passthroughs.js` defines the paths that Eleventy will ignore and serve as is. This includes images and custom fonts, if any. If there are other files you wish to be served statically, put them in this file.
    - `shortcodes.js` defines custom shortcodes. More information about shortcodes can be found in the [Eleventy documentation](https://www.11ty.dev/docs/shortcodes/).
    - `plugins.js` defines the plugins you want Eleventy to use during page render. More information about shortcodes can be found in the [Eleventy documentation](https://www.11ty.dev/docs/plugins/)
    - `watchtargets.js` defines the paths Eleventy will watch for changes. If any file in these paths changes, Eleventy will trigger the rendering process and refresh your browser to reflect the changes.
  - `src/data` contains configuration that are used inside `njk` files. Information about Eleventy data files can be found in the [Eleventy documentation](https://www.11ty.dev/docs/data-global/)
    - `prices.json` contains the products and their details. Inside `*.njk` files, they are accessible via the `prices` object/variable
    - `site.json` contains the details about the site. Values here are accessible via `site` object.
- `.eleventy.js` the entry point of Eleventy. This normally doesn't change because any changes to the configs are done inside the files found in `src/config`. However, if you want to change it, it is just a NodeJS file.
- `.nvmrc` contains the version of `node` used to render. Change this to the version of `node` you are using. Netlify will look at this to check which version it will use to render and deploy the site.
- `.env` file contains other configs, and public/private API keys, if any. The git repository does not contain this file, you will need to create this file. **DO NOT INCLUDE THIS FILE IN YOUR GIT COMMITS**. Variables saved in this file are needed for local development. For the production environment, Netlify's site settings provides the Environment Settings. Remember to trigger deploy everytime you change the variables in Netlify.
  - `PLACEMENT_ENDPOINT` the path of the `place-order` function.
  - `SENDGRID_API_KEY` the SendGrid API key used for sending emails. Check the Netlify settings for the saved value. Production and development value for this variable is the same.
  - `RECEIVER_EMAIL` the email address that receives the order placements. For testing, use your email.


### How do I get set up? ###

* Summary of set up
* Configuration
* Dependencies
* Database configuration
* How to run tests
* Deployment instructions

1. Install dependencies
```bash
npm install
```
2. Install Netlify CLI ([Documentation](https://docs.netlify.com/cli/get-started/))
```bash
# Install netlify-cli
npm install netlify-cli -g

# login to your Netlify account
netlify login
```
3. Run dev server
```bash
netlify dev
```
  - Every change to files defined by `src/config/watchtargets.js` will trigger a render and refresh your browser to reflect changes.

4. To deploy, commit your changes and merge them with `origin/main` branch. This will automatically trigger a deploy in Netlify.


### Who do I talk to? ###

* Francis Rubio (francis@hatchup.ca)