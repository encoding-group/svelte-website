# robinweissenborn.de

[Design](https://xd.adobe.com/view/f319731e-013b-449e-b3a4-28f1928739d1-a64a/) (updated)

[Preview on Netlify](https://nostalgic-clarke-ad7627.netlify.app)

[Wordpress Backend](https://api.robinweissenborn.de/wp-admin)

## Development

Install and run

```
git clone git@github.com:encoding-group/robinweissenborn.de.git
cd robinweissenborn.de
npm install
npm run dev
```

## Deployment

See [Routify docs](https://routify.dev/guide/starter-Template/deployment).

## Wordpress setup

Let’s do as little modifications to wordpress as possible.

- Add "Short title" custom text field to posts
- Add a nested repeater field to posts, that let’s you create 2-dimensional galleries with either an image or a external video url
- Create 2 pages "Info" and "Imprint"
- Enable api

Cosmetic optionally:

- Rename "Tags" taxonomy to "Discipline"
- Rename "Category" taxonomy to "Client"

## Data schemas

```js
let imageObject = {
  caption: "",
  full:
    "https://admin.robinweissenborn.de/wp-content/uploads/2020/07/10-2500x1667-1.jpg",
  fullHeight: 1667,
  fullWidth: 2500,
  large:
    "https://admin.robinweissenborn.de/wp-content/uploads/2020/07/10-2500x1667-1-1024x683.jpg",
  largeHeight: 683,
  largeWidth: 1024,
  medium:
    "https://admin.robinweissenborn.de/wp-content/uploads/2020/07/10-2500x1667-1-300x200.jpg",
  mediumHeight: 200,
  mediumWidth: 300,
  small:
    "https://admin.robinweissenborn.de/wp-content/uploads/2020/07/10-2500x1667-1-150x150.jpg",
  smallHeight: 150,
  smallWidth: 150,
};

let galleryGrid = [
  [
    { type: "Image", media: imageObject },
    { type: "Video URL", media: "https://video-url.com" },
  ],
  [
    { type: "Image", media: imageObject },
    { type: "Video URL", media: "https://video-url.com" },
  ],
];

let postObject = {
  client: ["Kunde"], // category taxonomy
  content: "<p>lorem ipsum dolor sit amet...</p>", // HTML markup
  discipline: ["Poster"], // tags taxonomy
  galleryGrid: [Array(3), Array(3), Array(3)], // 2d Array
  id: 1,
  isProduct: true,
  price: 123.45, // exists only if isProduct is true
  productInfo: "lorem ipsum dolor sit amet...", // exists only if isProduct is true
  slug: "my-first-post",
  title: "Very long and original project title",
  titleShort: "Title", // custom text field
  titleImage: imageObject,
  year: 2019,
  featured: true, // wp sticky post, frue if this post should be shown on home page
};

let siteMetaDataObject = {
  title, // website site title get_bloginfo('name')
  description, // custom field on info page
  tags, // custom field on info page
  image, //custom field on info page
  contact: {
    name,
    mail,
    phone,
    address1: {
      street,
      zip,
      city,
      country
    }
    address2: {}
  },
};
```

### get post data

You can request data either by awaiting a promise or by providing a callback.

Awaiting a promise:

```js
async function someOtherFunction() {
  const posts = await getPosts();
  // do something with posts here...
}
```

Using a callback:

```js
getPosts((result) => {
  const posts = result;
  // do something with posts here ...
});
```

The same is possible for single posts and pages:

- `getPost(slug)` and `getPost(slug, callback)`
- `getPage(slug)` and `getPage(slug, callback)`

### get site data

Can either be site-settings or custom fields of the Info page. To be used in html head and on both pages, so it would be best to fetch this only once.

```js
const info = await getPage("info");
// Info:
// {
//   title: "Titel",
//   keywords: ["tag 1", "tag 2"],
//   description: "Text",
//   contact: {
//     person: "Name",
//     email: "e@mail.com",
//     tel: "+49123456789",
//     street: "Street",
//     zip: "01234",
//     city: "City",
//     country: "Germany",
//   },
//   image: "image-1000x1000px.jpg",
// };
```

## Routing

- `/` home
- `/info` info
- `/imprint` imprint
- `/portfolio` posts (not actually a worpress page)
- `/portfolio/my-first-post` single post

## routify-starter

This repository is based on [routify-starter](https://github.com/roxiness/routify-starter). Visit their repo for more information.
