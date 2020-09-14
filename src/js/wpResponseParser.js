function processInfo(pageData) {
  let info = {};
  if (pageData.hasOwnProperty("acf")) {
    info.info = pageData.acf.hasOwnProperty("info") ? pageData.acf.info : "";
    info.officeName = pageData.acf.hasOwnProperty("office_name")
      ? pageData.acf.office_name
      : "";
    info.service = pageData.acf.hasOwnProperty("service")
      ? pageData.acf.service
      : "";
  }
  return {
    ...info,
    ...processBasicFields(pageData),
    ...processMetaFields(pageData),
    ...processContactFields(pageData),
  };
}

function processPosts(postsArray) {
  return postsArray
    .map((post) => processPost(post))
    .sort((a, b) => b.year - a.year);
}

function processPost(postData) {
  if (!postData) return {};
  return {
    ...processBasicFields(postData),
    ...processEmbeddedFields(postData),
    ...processAcfFields(postData),
  };
}

function processBasicFields(postData) {
  return {
    id: postData.id,
    slug: postData.slug,
    title: postData.title.rendered,
    content: postData.content.rendered,
    featured: postData.sticky,
  };
}

function processMetaFields(postData) {
  if (
    postData.hasOwnProperty("acf") &&
    postData.acf.hasOwnProperty("general")
  ) {
    return {
      title: postData.acf.general.title,
      keywords: postData.acf.general.keywords.split(/,\s/),
      description: postData.acf.general.description,
      image: {
        url: postData.acf.general.image.sizes.large,
        width: postData.acf.general.image.sizes["large-width"],
        height: postData.acf.general.image.sizes["large-height"],
      },
    };
  }

  return {};
}

function processContactFields(postData) {
  if (postData.hasOwnProperty("acf")) {
    let result = {};

    if (postData.acf.hasOwnProperty("contact")) {
      result.contact = {
        person: `${postData.acf.contact.first_name} ${postData.acf.contact.last_name}`,
        email: postData.acf.contact.email,
        tel: postData.acf.contact.phone_number,
      };
    }

    if (postData.acf.hasOwnProperty("address-1")) {
      result["address-1"] = {
        street: postData.acf["address-1"].street,
        zip: postData.acf["address-1"].zip_code,
        city: postData.acf["address-1"].city,
        country: postData.acf["address-1"].country,
      };
    }

    if (postData.acf.hasOwnProperty("address-2")) {
      result["address-2"] = {
        street: postData.acf["address-2"].street,
        zip: postData.acf["address-2"].zip_code,
        city: postData.acf["address-2"].city,
        country: postData.acf["address-2"].country,
      };
    }
    return result;
  }

  return {};
}

function processEmbeddedFields(postData) {
  if (postData.hasOwnProperty("_embedded")) {
    const [categories, tags] = postData._embedded["wp:term"];
    return {
      discipline: categories.map((category) =>
        category.name === "Uncategorized" ? "" : category.name
      ),
      client: tags.map((tag) => tag.name),
    };
  }

  return {};
}

function processAcfFields(postData) {
  if (postData.hasOwnProperty("acf")) {
    let result = {
      ...processProductFields(postData),
      ...processGalleryGrid(postData),
      projectInfo: postData.acf.project_info ?? "",
      titleImage: processImage(postData.acf.title_image),
      isFrameless: postData.acf.is_frameless ?? false,
      color: postData.acf.color ?? "#000000",
      year: parseInt(postData.acf.year, 10),
    };
    if (postData.acf.secondary_title_image) {
      result.secondaryTitleImage = processImage(postData.acf.title_image);
    }
    return result;
  }

  return {};
}

function processProductFields(postData) {
  if (
    postData.acf.hasOwnProperty("is_product") &&
    postData.acf.is_product == true
  ) {
    return {
      isProduct: true,
      productInfo: postData.acf.product_info,
      price: parseFloat(postData.acf.price),
    };
  }

  return { isProduct: false };
}

function processGalleryGrid(postData) {
  if (!postData.acf.hasOwnProperty("2d_gallery")) {
    return {};
  }
  if (typeof postData.acf["2d_gallery"] !== "object") {
    return {};
  }
  return {
    galleryGrid: postData.acf["2d_gallery"].map((row) => {
      return {
        headline: row.headline,
        media: row.media.map((column) => {
          return {
            type: column.select,
            media:
              column.select === "Image"
                ? processImage(column.image)
                : column.embedded_media,
          };
        }),
      };
    }),
  };
}

function processImage(imageObject) {
  if (!imageObject) return {};

  return {
    small: imageObject.sizes.thumbnail,
    smallWidth: imageObject.sizes["thumbnail-width"],
    smallHeight: imageObject.sizes["thumbnail-height"],
    medium: imageObject.sizes.medium,
    mediumWidth: imageObject.sizes["medium-width"],
    mediumHeight: imageObject.sizes["medium-height"],
    large: imageObject.sizes.large,
    largeWidth: imageObject.sizes["large-width"],
    largeHeight: imageObject.sizes["large-height"],
    full: imageObject.url,
    fullWidth: imageObject.width,
    fullHeight: imageObject.height,
    title: imageObject.title,
    alt: imageObject.alt,
    caption: imageObject.caption,
    description: imageObject.description,
    srcset: createSrcString(imageObject),
    sizes: createSrcSizes(imageObject),
  };
}

function createSrcString(imageObject) {
  return [
    `${imageObject.sizes.thumbnail} 150w`,
    `${imageObject.sizes.medium} 300w`,
    `${imageObject.sizes.large} 1024w`,
    `${imageObject.url} ${imageObject.width}w`,
  ].join(",");
}

// Needs more work
function createSrcSizes(imageObject) {
  return [
    "(max-width: 300px) 150px",
    "(max-width: 600px) 300px",
    "(max-width: 2000px) 1024px",
    `${imageObject.width}px`,
  ].join(",");
}

export { processPost, processPosts, processInfo };
