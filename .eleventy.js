const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

  // Copie des fichiers statiques
  eleventyConfig.addPassthroughCopy("src/css")
                .addPassthroughCopy("src/public")
                .addPassthroughCopy('CNAME');

  // Rafraichit le site lorsque les CSS sont modifiés
  eleventyConfig.addWatchTarget("src/css");

  // Liste des billets (triés du plus récent au plus ancien)
  // - on peut s'en passer ???
  eleventyConfig.addCollection("posts", function (collection) {
    return collection.getFilteredByGlob("src/_posts/**/*.md")
      .sort((a, b) => {
        return b.date - a.date;
      });
  });

  /**
   * Format a date with Luxon
   * https://www.webstoemp.com/blog/modular-code-nunjucks-eleventy/
   *
   * @param {String} date - string Date
   * @param {String} format - date format (Luxon)
   * @param {String} locale - locale
   * @returns {String} formatted date
   */
  eleventyConfig.addFilter("date", function(date, format, locale = "fr") {
    date = new Date(date);
    if (format === "iso") return DateTime.fromJSDate(date).toISO(); //++ ajout perso
    return DateTime.fromJSDate(date).setLocale(locale).toFormat(format);
  });

  // INUTILE: Filtre pour formatter les dates en yyyy-mm-dd
  eleventyConfig.addFilter("isodate", date => {
    return date.toISOString();        // yyyy-mm-ddThh:mm:ss.000Z 
  });

  // INUTILE: Filtre pour formatter les dates en yyyy-mm-dd
  eleventyConfig.addFilter("dashdate", date => {
    return date.toISOString()         // yyyy-mm-ddThh:mm:ss.000Z 
               .substring(0, 10);     // yyyy-mm-dd
  });

  // INUTILE: Filtre pour formatter les dates en yyyy/mm/dd
  eleventyConfig.addFilter("slashdate", date => {
    return date.toISOString()         // yyyy-mm-ddThh:mm:ss.000Z 
               .substring(0, 10)      // yyyy-mm-dd
               .replaceAll("-", "/"); // yyyy/mm/dd
  });

  // Imite le shortcode "post_url" de Jekyll
  // - ça simplifie la migration
  // - MAIS ça attend une chaine !!!
  // - voir aussi https://github.com/11ty/eleventy/issues/544#issuecomment-496523285
  eleventyConfig.addShortcode("post_url", function(url) {
    if (typeof url !== "string") return "/";
    return "/" + url.replace("-", "/").replace("-", "/").replace("-", "/") + "/";
  });

  // Génère une balise "a" avec hreflang "fr"
  eleventyConfig.addShortcode("goto_fr", function(title, url) {
    url = "/" + url.replace("-", "/").replace("-", "/").replace("-", "/") + "/";
    return  `<a href="${url}" hreflang="fr-FR">${title}</a>`
  });

  // Génère une balise "a" avec hreflang "en"
  eleventyConfig.addShortcode("goto_en", function(title, url) {
    url = "/" + url.replace("-", "/").replace("-", "/").replace("-", "/") + "/";
    return  `<a href="${url}" hreflang="en-US">${title}</a>`
  });

  // Génère le <script type="application/ld+json">
  // - site = _data/site.json
  // - post = un élément issu de collection.all
  eleventyConfig.addShortcode("scriptLdJson", function(site, post) {
    const data = {
      headline: site.title,
      dateModified: post.date,
      datePublished: post.date,
      description: post.data.excerpt,
      inLanguage: post.data.lang ?? site.lang,
      url: site.url + post.url,
      "@type":"BlogPosting",
      image: post.data.cover ? site.url + post.data.cover.image : "",
      mainEntityOfPage: {
        "@type":"WebPage",
        "@id": site.url + post.url
      },
      author: {
        "@type":"Person",
        name: site.author
      },
      "@context":"https://schema.org"
    };
    return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
  });

  // Génère une balise <figure> Pour afficher les images en tête des billets
  // - trouver un meilleur nom
  // - documenter comme "date"
  eleventyConfig.addFilter("coverFigure", function(cover) {
    // Rien à faire si pas d'image
    if (!cover) return "";
    // Cas où seule l'image est définie ("cover: une-image.jpg" dans le front matter)
    if (typeof cover === "string")
      return  `<figure class="cover-image"><img src="${cover}" /><figcaption>&nbsp;</figcaption></figure>`;
    // Rien à faire si c'est un objet sans image
    if (!cover?.image) return "";
    // Cas l'image est définie sous forme d'objet dans le front matter
    let html = `<figure class="cover-image"><img src="${cover.image}" alt="${cover.text ?? ""}" /><figcaption>`;
    if (cover.text)
      html += cover.link ? `<a href="${cover.link}">${cover.text}</a>` : cover.text;
    else
      html += "&nbsp;";
    html += "</figcaption></figure>";
    return html;
  });

  // https://github.com/11ty/eleventy-base-blog/blob/master/.eleventy.js
  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if(!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if( n < 0 ) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  // Set custom directories for input, output, includes, and data
  return {
    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",
    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk",
    //
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid"
    ]
  };
};
