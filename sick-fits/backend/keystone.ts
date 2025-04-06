/* eslint-disable prettier/prettier */
import { config, createSchema } from '@keystone-next/keystone/schema'
import 'dotenv/config';
import { createAuth } from '@keystone-next/auth';
import { withItemData, statelessSessions } from '@keystone-next/keystone/session'
import { User } from './schemas/User';
import { Product } from './schemas/Product';



const databaseURL = process.env.DATABASE_URL;

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360,
  secret: process.env.COOKIE_SECRET
};

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password']
    // TODO: Add initial roles here
  }
});

export default withAuth(
  config({
    server: { 
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true
      },
    },
    db: {
      adapter: 'mongoose',
      url: databaseURL
    },
    lists: createSchema({
      User, Product
    }),
    ui: {
      // Only Show UI if login can pass this test
      isAccessAllowed: ({ session }) => {
        console.log(session);
        return !!session?.data;
      },
    },
    session: withItemData(statelessSessions(sessionConfig), {
      User: 'id'
    })
  }));