import { HandCashConnect } from '@handcash/sdk';

const appId = process.env.HANDCASH_APP_ID as string;
const appSecret = process.env.HANDCASH_APP_SECRET as string;

export const handCashConnect = new HandCashConnect({
  appId,
  appSecret,
});
