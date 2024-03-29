function parseMaxAge(value = 0) {
  if (value >= 0 && Number.isFinite(value)) {
    return Math.floor(value);
  } else {
    throw new Error(
      `Expect-CT: ${JSON.stringify(
        value
      )} is not a valid value for maxAge. Please choose a positive integer.`
    );
  }
}

function getHeaderValueFromOptions(options) {
  const directives = [`max-age=${parseMaxAge(options.maxAge)}`];

  if (options.enforce) {
    directives.push("enforce");
  }

  if (options.reportUri) {
    directives.push(`report-uri="${options.reportUri}"`);
  }

  return directives.join(", ");
}

function expectCt(options = {}) {
  const headerValue = getHeaderValueFromOptions(options);

  return function expectCtMiddleware(_req, res, next) {
    res.setHeader("Expect-CT", headerValue);
    next();
  };
}

module.exports = expectCt;
