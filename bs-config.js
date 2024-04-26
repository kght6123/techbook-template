/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */
module.exports = {
  proxy: {
    target: "localhost:3000",
    proxyReq: [
      (proxyReq) => {
        proxyReq.setHeader("X-Special-Proxy-Header", "foobar");
      },
    ],
    proxyRes: [
      (proxyRes, req, res) => {
        res.setHeader(
          "Cache-Control",
          "no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0",
        );
        res.setHeader("Pragma", "no-cache");
      },
    ],
  },
};
