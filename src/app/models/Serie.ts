import { Lspi } from './Lspi';

export class Serie {
    constructor(
      public Lspi: Lspi, 
      public StartTime: Date, 
      public EndTime: Date, 
    ) {}
    public Name() {
      return this.Lspi.Name();
    };
  }