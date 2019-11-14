import { Frame_Element } from './Frame_Element';
export class Frame {
    constructor(
      public frame_id: number,
      public Frame_Element: Frame_Element[],
      public page_id: number,

      public name: string,
      public frame_type: number,
      public X: number,
      public Y: number,
      public width: number,
      public height: number
    ) {}
  }