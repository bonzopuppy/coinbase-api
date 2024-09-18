import { CBAppClient } from '../../src/index.js';

let accId = '';

describe('CBAppClient PRIVATE', () => {
  const account = {
    key: process.env.API_KEY_NAME,
    secret: process.env.API_PRIVATE_KEY,
  };

  const rest = new CBAppClient({
    apiKeyName: account.key,
    apiPrivateKey: account.secret,
  });

  it('should have credentials to test with', () => {
    expect(account.key).toBeDefined();
    expect(account.secret).toBeDefined();
  });

  describe('public endpoints', () => {
    it('should succeed making a GET request', async () => {
      const res = await rest.getFiatCurrencies();
      expect(res).toMatchObject({
        data: expect.any(Array),
      });
    });
  });

  describe('private endpoints', () => {
    describe('GET requests', () => {
      test('without params', async () => {
        const res = await rest.getAccounts();
        expect(res).toMatchObject({
          pagination: expect.any(Object),
          data: expect.any(Array),
        });
        accId = res.data[0].id;
      });

      test('with params', async () => {
        const res = await rest.getAccount({
          account_id: accId,
        });
        //console.log('res with params', res);
        expect(res).toMatchObject({
          data: expect.any(Object),
        });
      });
    });

    describe('POST requests', () => {
      test('with params as request body', async () => {
        try {
          const res = await rest.transferMoney({
            account_id: 'cff1d5a6-9f09-5645-8919-b998e7055170',
            type: 'transfer',
            to: '58542935-67b5-56e1-a3f9-42686e07fa40',
            amount: '1',
            currency: 'USDT',
          });

          console.log(`res "${expect.getState().currentTestName}"`, res);
          expect(res).toMatchObject({
            whatever: true,
          });
        } catch (e: any) {
          // These are deliberatly restricted API keys. If the response is a permission error, it confirms the sign + request was OK and permissions were denied.
          // console.log(`err "${expect.getState().currentTestName}"`, e?.body);
          const responseBody = e?.body.errors[0];
          expect(responseBody).toMatchObject({
            id: 'invalid_scope',
            message: expect.any(String),
            url: expect.any(String),
          });
        }
      });
    });
  });
});
