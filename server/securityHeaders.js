const ONE_YEAR_SECONDS = 31_536_000;

export function securityHeaders({ production = false } = {}) {
  return function setSecurityHeaders(_req, res, next) {
    res.setHeader("Content-Security-Policy", "frame-ancestors 'none'");
    res.setHeader("Permissions-Policy", "camera=(), geolocation=(), microphone=(self), payment=(), usb=()");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");

    if (production) {
      res.setHeader("Strict-Transport-Security", `max-age=${ONE_YEAR_SECONDS}; includeSubDomains`);
    }

    next();
  };
}

export function applySecurityHeaders(app, options = {}) {
  app.disable("x-powered-by");
  app.use(securityHeaders(options));
}
