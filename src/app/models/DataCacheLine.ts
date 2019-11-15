import { Lspi } from './Lspi';

interface IDataPoints {
    [key: number]: number;
  };

export class DataCacheLine {
    constructor(
      public Lspi: Lspi, 
      public LastUpDate: Date, 
      public StartTime: Date, 
      public EndTime: Date, 
      public MostRecentDataPointTime: Date,     
      public Data: IDataPoints
    ) {}
  }