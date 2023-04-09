const assert = require("assert");
const expectCt = require(".");

function testWithValidArguments() {
  const testCases = [
    // Default max-age
    [undefined, "max-age=0"],
    [{}, "max-age=0"],
    [Object.create(null), "max-age=0"],
    [{ maxAge: undefined }, "max-age=0"],
    // Explicit max-age
    [{ maxAge: 123 }, "max-age=123"],
    [{ maxAge: 0 }, "max-age=0"],
    // Rounding
    [{ maxAge: 123.4 }, "max-age=123"],
    [{ maxAge: 123.5 }, "max-age=123"],
    // Other options
    [{ enforce: true }, "max-age=0, enforce"],
    [{ enforce: false }, "max-age=0"],
    [
      { reportUri: "https://example.com/report" },
      'max-age=0, report-uri="https://example.com/report"',
    ],
    // All options
    [
      { enforce: true, maxAge: 123, reportUri: "https://example.com/report" },
      'max-age=123, enforce, report-uri="https://example.com/report"',
    ],
  ];

  for (const [argument, expected] of testCases) {
    const fakeReq = {};

    const fakeRes = {
      headers: {},
      setHeader(name, value) {
        this.headers[name] = value;
      },
    };

    let wasNextCalled = false;
    const fakeNext = (...args) => {
      assert(!args.length, "next() should be called with no arguments");
      wasNextCalled = true;
    };

    expectCt(argument)(fakeReq, fakeRes, fakeNext);

    assert(fakeRes.headers["Expect-CT"], expected);
    assert(wasNextCalled, "next() should be called");
  }
}

function testWithInvalidMaxAge() {
  const testMaxAges = [-123, -0.1, Infinity, NaN, "123", BigInt(12)];

  for (const maxAge of testMaxAges) {
    let threw = false;
    try {
      expectCt({ maxAge });
    } catch (_) {
      threw = true;
    }
    assert(threw, `An error should be thrown for ${maxAge}`);
  }
}

testWithValidArguments();
testWithInvalidMaxAge();
