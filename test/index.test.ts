import connect from 'connect'
import request from 'supertest'
import { IncomingMessage, ServerResponse } from 'http'

import expectCt = require('..')

describe('expectCt', function () {
  function app (middleware: ReturnType<typeof expectCt>): connect.Server {
    const result = connect()
    result.use(middleware)
    result.use(function (_req: IncomingMessage, res: ServerResponse) {
      res.end('Hello world!')
    })
    return result
  }

  it('sets the max-age to 0 when given no options', async () => {
    await request(app(expectCt())).get('/')
      .expect('Expect-CT', 'max-age=0')
  })

  it('sets the max-age to 0 when given an empty object', async () => {
    await request(app(expectCt({}))).get('/')
      .expect('Expect-CT', 'max-age=0')
  })

  it('can set the max-age to an integer', async () => {
    await request(app(expectCt({maxAge: 123}))).get('/')
      .expect('Expect-CT', 'max-age=123')
  })

  it('throws an error if max-age is not a positive number', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    expect(expectCt.bind(null, {maxAge: true as any})).toThrow()
    expect(expectCt.bind(null, {maxAge: false as any})).toThrow()
    expect(expectCt.bind(null, {maxAge: '123' as any})).toThrow()
    expect(expectCt.bind(null, {maxAge: [123] as any})).toThrow()
    expect(expectCt.bind(null, {maxAge: -1})).toThrow()
    expect(expectCt.bind(null, {maxAge: -123})).toThrow()
    /* eslint-enable @typescript-eslint/no-explicit-any */
  })

  it('can enable enforcement', async () => {
    await request(app(expectCt({enforce: true}))).get('/')
      .expect('Expect-CT', 'enforce, max-age=0')
  })

  it('can explicitly disable enforcement', async () => {
    await request(app(expectCt({enforce: false}))).get('/')
      .expect('Expect-CT', 'max-age=0')
  })

  it('can set a report-uri', async () => {
    await request(app(expectCt({reportUri: 'https://example.com/report'}))).get('/')
      .expect('Expect-CT', 'max-age=0, report-uri="https://example.com/report"')
  })

  it('can set enforcement, max-age, and a report-uri', async () => {
    await request(app(expectCt({
      enforce: true,
      maxAge: 123,
      reportUri: 'https://example.com/report'
    }))).get('/')
      .expect('Expect-CT', 'enforce, max-age=123, report-uri="https://example.com/report"')
  })

  it('names its function and middleware', () => {
    expect(expectCt.name).toBe('expectCt')
    expect(expectCt().name).toBe( 'expectCt')
  })
})
