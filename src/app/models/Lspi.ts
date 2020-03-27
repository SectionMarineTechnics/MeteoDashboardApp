export class Lspi {
    constructor(
      public Location: string,
      public Sensor: string,
      public Parameter: string,
      public Interval: number,

      public LocationDescription: string,
      public ParameterDescription: string,
      public unit: string
    ) {}
    public Name() {
      return this.Location + " " +  this.Sensor + " " + this.Parameter + " " +  String("0").repeat(Math.abs(3 - this.Interval.toString().length)) + this.Interval;
    };  
    public LongName() {
      return this.Location + " " +  this.Sensor + " " + this.Parameter + " " +  String("0").repeat(Math.abs(3 - this.Interval.toString().length)) + this.Interval + " (" + this.LocationDescription + ": " + this.ParameterDescription + " in " + this.unit + ")";
    };      
    public LspiName() {
      return this.Location + this.Sensor + this.Parameter + String("0").repeat(Math.abs(3 - this.Interval.toString().length)) + this.Interval;
    };  
  }