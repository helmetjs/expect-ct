# Expect-CT middleware

**The `Expect-CT` header has been deprecated and is no longer recommended.** [Chromium has enforced Certificate Transparency by default since version 107](https://chromestatus.com/feature/6244547273687040), making this header unnecessary. Firefox never implemented `Expect-CT`, relying on its own CT policy. Safari also does not support this header. This module will still be maintained but no new features will be added.

The `Expect-CT` HTTP header tells browsers to expect Certificate Transparency. For more, see [this blog post](https://scotthelme.co.uk/a-new-security-header-expect-ct/) and the [article on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect-CT).

Usage:

```javascript
const expectCt = require("expect-ct");

// Sets Expect-CT: max-age=123
app.use(expectCt({ maxAge: 123 }));

// Sets Expect-CT: enforce, max-age=123
app.use(
  expectCt({
    enforce: true,
    maxAge: 123,
  })
);

// Sets Expect-CT: enforce, max-age=30, report-uri="https://example.com/report"
app.use(
  expectCt({
    enforce: true,
    maxAge: 30,
    reportUri: "https://example.com/report",
  })
);
```
