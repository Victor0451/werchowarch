import serverlessMysql from "serverless-mysql";

export const sgi = serverlessMysql({
  config: {
    host: process.env.HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    database: process.env.SGI,
    user: process.env.USER,
    password: process.env.PASSWORD,
  },
});

export const arch = serverlessMysql({
  config: {
    host: process.env.HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    database: process.env.ARCHIVO,
    user: process.env.USER,
    password: process.env.PASSWORD,
  },
});
