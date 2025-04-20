describe('config', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should define environment of testing', () => {
    process.env.NODE_ENV = 'test';
    process.env.PGHOST_TEST = 'localhost_test';
    process.env.PGDATABASE_TEST = 'test_db';
    process.env.PGPORT_TEST = '6543';
    process.env.PGUSER_TEST = 'test_user';
    process.env.PGPASSWORD_TEST = 'test_pass';

    const { config } = require('../config');

    expect(config.database.host).toEqual('localhost_test');
    expect(config.database.name).toEqual('test_db');
    expect(config.database.port).toEqual('6543');
    expect(config.database.user).toEqual('test_user');
    expect(config.database.password).toEqual('test_pass');
  });

  it('should define environment of production', () => {
    process.env.NODE_ENV = 'production';
    process.env.PGHOST = 'localhost_prod';
    process.env.PGDATABASE = 'prod_db';
    process.env.PGPORT = '5432';
    process.env.PGUSER = 'prod_user';
    process.env.PGPASSWORD = 'prod_pass';

    const { config } = require('../config');

    expect(config.database.host).toEqual('localhost_prod');
    expect(config.database.name).toEqual('prod_db');
    expect(config.database.port).toEqual('5432');
    expect(config.database.user).toEqual('prod_user');
    expect(config.database.password).toEqual('prod_pass');
  });
});
