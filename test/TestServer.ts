import { AnyObject, Headers, QueryParams, Server } from '@jovotech/framework';

export class TestServer<Request extends Record<any, any>, Response extends unknown> extends Server {
  $request: Request;
  declare $response: Response;
  $headers: Headers;

  constructor(request: Request = {} as Record<any, any>, headers: Headers = {}) {
    super();
    this.$request = request;
    this.$headers = headers;
  }

  setRequest(request: Request): void {
    this.$request = request;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setResponse(response: any): Promise<void> {
    this.$response = response;
  }

  fail(error: Error): Promise<void> | void {
    // eslint-disable-next-line no-console
    console.error('TestServer.fail:');
    // eslint-disable-next-line no-console
    console.error(error);
  }

  getNativeRequestHeaders(): Headers {
    return this.$headers;
  }

  setNativeRequestHeaders(headers: Headers): void {
    this.$headers = headers;
  }

  getQueryParams(): QueryParams {
    return {};
  }

  getRequestObject(): AnyObject {
    return this.$request;
  }

  hasWriteFileAccess(): boolean {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setResponseHeaders(header: Record<string, string>): void {}
}
