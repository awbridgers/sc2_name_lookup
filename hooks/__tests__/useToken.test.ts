import {renderHook, waitFor} from '@testing-library/react-native';
import {useToken} from '../useToken';

describe('use token hook', () => {
  beforeEach(()=>{
    jest.resetAllMocks();
  })
  it('should return empty string on fail', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue({});
    const {result} = renderHook(() => useToken('test', 'test'));
    await waitFor(() => {
      expect(result.current).toBe('');
    });
  });
  it('should return a token', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: () =>
        Promise.resolve({
          access_token: 'token',
        }),
    } as Response);
    const {result} = renderHook(() => useToken('test', 'test'));
    await waitFor(() => {
      expect(result.current).toBe('token');
    });
  });
  it('should return empty string on json fail', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: () => Promise.reject({}),
    } as Response);
    const log = jest.spyOn(console, 'log')
    const {result} = renderHook(()=>useToken('tesst', 'test'));
    await waitFor(()=>{
      expect(log).toHaveBeenCalled();
      expect(result.current).toBe('')
    })
  });
  it('should not call if token is already set', async () => { 
    const fetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      json: () =>
        Promise.resolve({
          access_token: 'token',
        }),
    } as Response);
    const {result} = renderHook(() => useToken('test', 'test'));
    await waitFor(() => {
      expect(result.current).toBe('token');
    });
    expect(fetch).toHaveBeenCalledTimes(1)
   })
});
