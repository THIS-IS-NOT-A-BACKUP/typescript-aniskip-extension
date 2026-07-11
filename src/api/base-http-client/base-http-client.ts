import ky from 'ky';
import QueryString from 'qs';
import browser from 'webextension-polyfill';
import { Response, HttpClient, Config } from './base-http-client.types';
import { Message } from '../../scripts/background';
import { parseResponse } from '../../utils/http';

export abstract class BaseHttpClient implements HttpClient {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<D = any>(
    { route, params, ...rest }: Config,
    isCallingBackgroundScript: boolean = true
  ): Promise<Response<D>> {
    const url = `${this.baseUrl}${route}`;
    const config = {
      ...(params && {
        searchParams: QueryString.stringify(params, { encodeValuesOnly: true }),
      }),
      ...rest,
    };

    if (isCallingBackgroundScript) {
      const response = await browser.runtime.sendMessage({
        type: 'fetch',
        payload: { url, config },
      } as Message);

      return response as Response<D>;
    }

    let response;
    try {
      const succesfulResponse = await ky(url, config);

      response = {
        data: await parseResponse<D>(succesfulResponse),
        status: succesfulResponse.status,
        ok: true,
      };
    } catch (err: any) {
      if (!err.response) {
        return {
          data: { message: err.message } as D,
          status: 0,
          ok: false,
        };
      }

      response = {
        data: await parseResponse<D>(err.response),
        status: err.response.status,
        ok: false,
      };
    }

    return response;
  }
}
