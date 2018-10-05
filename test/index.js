var expectCt = require('..')
var assert = require('assert')

describe('expectCt', function () {
  beforeEach(function () {
    var self = this

    this.headers = {}

    this.req = {}
    this.res = {
      setHeader: function (key, value) {
        self.headers[key] = value
      }
    }
  })

  it('sets the max-age to 0 when given no options', function (done) {
    expectCt()(this.req, this.res, function (err) {
      assert(err == null)
      assert.strictEqual(this.headers['Expect-CT'], 'max-age=0')

      done()
    }.bind(this))
  })

  it('sets the max-age to 0 when given an empty object', function (done) {
    expectCt({})(this.req, this.res, function (err) {
      assert(err == null)
      assert.strictEqual(this.headers['Expect-CT'], 'max-age=0')

      done()
    }.bind(this))
  })

  it('can set the max-age to an integer', function (done) {
    expectCt({
      maxAge: 123
    })(this.req, this.res, function (err) {
      assert(err == null)
      assert.strictEqual(this.headers['Expect-CT'], 'max-age=123')

      done()
    }.bind(this))
  })

  it('throws an error if max-age is not a positive number', function () {
    function test (value) {
      assert.throws(function () {
        expectCt({ maxAge: value })
      })
    }

    test(true)
    test(false)
    test('123')
    test([123])
    test(-1)
    test(-123)
  })

  it('can enable enforcement', function (done) {
    expectCt({
      enforce: true
    })(this.req, this.res, function (err) {
      assert(err == null)
      assert.strictEqual(this.headers['Expect-CT'], 'enforce, max-age=0')

      done()
    }.bind(this))
  })

  it('can explicitly disable enforcement', function (done) {
    expectCt({
      enforce: false
    })(this.req, this.res, function (err) {
      assert(err == null)
      assert.strictEqual(this.headers['Expect-CT'], 'max-age=0')

      done()
    }.bind(this))
  })

  it('can set a report-uri', function (done) {
    expectCt({
      reportUri: 'http://example.com/report'
    })(this.req, this.res, function (err) {
      assert(err == null)
      assert.strictEqual(this.headers['Expect-CT'], 'max-age=0, report-uri="http://example.com/report"')

      done()
    }.bind(this))
  })

  it('can set enforcement, max-age, and a report-uri', function (done) {
    expectCt({
      enforce: true,
      maxAge: 123,
      reportUri: 'http://example.com/report'
    })(this.req, this.res, function (err) {
      assert(err == null)
      assert.strictEqual(this.headers['Expect-CT'], 'enforce, max-age=123, report-uri="http://example.com/report"')

      done()
    }.bind(this))
  })

  it('names its function and middleware', function () {
    assert.strictEqual(expectCt.name, 'expectCt')
    assert.strictEqual(expectCt().name, 'expectCt')
  })
})
