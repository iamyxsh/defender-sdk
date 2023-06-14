import { pick } from 'lodash';
import { rejectWithPlatformApiError } from './api';
import { PlatformApiResponseError } from './api-error';
import { mockAxiosError } from './__mocks__/axios-error';

const expectedRejectObjectStructure = {
  response: {
    status: 401,
    statusText: 'Unauthorized',
    data: { message: 'Unauthorized' },
  },
  message: 'Request failed with status code 401',
  request: { path: '/relayer', method: 'GET' },
};

describe('PlatformApiError', () => {
  test('request rejection reject with a PlatformApiResponseError that include message, request.path, request.method, response.status, response.statusText, response.data', async () => {
    try {
      await rejectWithPlatformApiError(mockAxiosError);
    } catch (error: any) {
      expect(error instanceof PlatformApiResponseError).toBe(true);

      expect(error.message).toStrictEqual(expectedRejectObjectStructure.message);
      expect(error.response).toStrictEqual(expectedRejectObjectStructure.response);
      expect(error.request).toStrictEqual(expectedRejectObjectStructure.request);
    }
  });

  test('throw an Error that is backward compatible with previous rejected object structure', async () => {
    const previousRejectionMethod = (error: any) =>
      Promise.reject({
        response: pick(error.response, 'status', 'statusText', 'data'),
        message: error.message,
        request: pick(error.request, 'path', 'method'),
      });

    try {
      await previousRejectionMethod(mockAxiosError);
    } catch (error: any) {
      expect(error).toStrictEqual(expectedRejectObjectStructure);
    }
  });
});
