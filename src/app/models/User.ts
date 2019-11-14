import { Page } from './Page';
export class User {
    constructor(
      public id: number,
      public Page: Page[],

      public name: string,
      public login_time: Date,
      public login_count: number
    ) {}
  }