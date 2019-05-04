import { IncomingMessage, ServerResponse } from 'http';

interface ExpectCtOptions {
  maxAge?: number;
  enforce?: boolean;
  reportUri?: string;
}

function parseMaxAge (option: void | number): number {
  if (option === undefined) {
    return 0;
  }

  if (typeof option !== 'number' || option < 0) {
    throw new Error(`${option } is not a valid value for maxAge. Please choose a positive integer.`);
  }

  return option;
}

function getHeaderValueFromOptions (options?: ExpectCtOptions): string {
  options = options || {};

  const directives: string[] = [];

  if (options.enforce) {
    directives.push('enforce');
  }

  directives.push(`max-age=${parseMaxAge(options.maxAge)}`);

  if (options.reportUri) {
    directives.push(`report-uri="${options.reportUri}"`);
  }

  return directives.join(', ');
}

export = function expectCt (options?: ExpectCtOptions) {
  const headerValue = getHeaderValueFromOptions(options);

  return function expectCt (_req: IncomingMessage, res: ServerResponse, next: () => void) {
    res.setHeader('Expect-CT', headerValue);
    next();
  };
}
