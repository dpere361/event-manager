/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
})
let isProd = process.env.ENV === "production";

module.exports = {
    siteMetadata: {
        title: "Test",
        titleTemplate: "Test",
        description:
            "Test",
        siteUrl: "https://test.com", // No trailing slash allowed!
        image: "/images/favicon.ico", // Path to your image you placed in the 'static' folder
    },
    plugins: [
        "gatsby-plugin-remove-console",
        {
            resolve: "gatsby-plugin-robots-txt",
            options: {
                host: "https://test.com",
                sitemap: "https://test.com/sitemap.xml",
                policy: [{ userAgent: "*", allow: "/", disallow: "/checkout" }],
            },
        },
        "gatsby-plugin-react-helmet",
        {
            resolve: `gatsby-plugin-gtag`,
            options: {
                // your google analytics tracking id
                trackingId: `G-NMPRFMNMTX`,
                // Puts tracking script in the head instead of the body
                head: true,
                // enable ip anonymization
                anonymize: true,
            },
        },
        {
            resolve: "gatsby-plugin-google-tagmanager",
            options: {
                id: "GTM-5RBC8JC",

                // Include GTM in development.
                //
                // Defaults to false meaning GTM will only be loaded in production.
                includeInDevelopment: false,

                // datalayer to be set before GTM is loaded
                // should be an object or a function that is executed in the browser
                //
                // Defaults to null
                defaultDataLayer: { platform: "gatsby" },

                // Specify optional GTM environment details.
                // gtmAuth: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_AUTH_STRING",
                // gtmPreview: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_PREVIEW_NAME",
                dataLayerName: "bcpDataLayer",

                // Name of the event that is triggered
                // on every Gatsby route change.
                //
                // Defaults to gatsby-route-change
                // routeChangeEventName: "YOUR_ROUTE_CHANGE_EVENT_NAME",
            },
        },
        {
            resolve: `gatsby-plugin-sitemap`,
            options: {
                // Exclude specific pages or groups of pages using glob parameters
                // See: https://github.com/isaacs/minimatch
                // The example below will exclude the single `path/to/page` and all routes beginning with `category`
                exclude: ["/portal", "/portal/*", "/checkout", "/checkout/*"],
                query: `
                {
                site {
                    siteMetadata {
                    siteUrl
                    }
                }
                allSitePage {
                    edges {
                    node {
                        path
                    }
                    }
                }
                }
                `,
                serialize: ({ site, allSitePage }) => {
                    let pages = [];
                    allSitePage.edges.map(edge => { 
                        pages.push({
                            url: site.siteMetadata.siteUrl + edge.node.path,
                            changefreq: `daily`,
                            priority: edge.node.path === "/" ? 1.0 : 0.7,
                        });
                    });

                    return pages;
                },
            },
        },
    ],
};
