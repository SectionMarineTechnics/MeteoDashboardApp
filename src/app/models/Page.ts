import { Frame } from './frame';
export class Page {
    constructor(
      public page_id: number,
      public Frame: Frame[],
      public user_id: number,
      public name: string,
      public position: number
    ) {}
  }