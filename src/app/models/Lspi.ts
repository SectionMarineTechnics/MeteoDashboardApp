export class Lspi {
    constructor(
      public Location: string,
      public Sensor: string,
      public Parameter: string,
      public Interval: number
    ) {}
    public Name() {
      return this.Location + " " +  this.Sensor + " " + this.Parameter + " " +  String("0").repeat(Math.abs(3 - this.Interval.toString().length)) + this.Interval;
    };  
    public LspiName() {
      return this.Location + this.Sensor + this.Parameter + String("0").repeat(Math.abs(3 - this.Interval.toString().length)) + this.Interval;
    };  
  }