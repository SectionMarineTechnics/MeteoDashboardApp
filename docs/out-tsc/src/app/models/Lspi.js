export class Lspi {
    constructor(Location, Sensor, Parameter, Interval) {
        this.Location = Location;
        this.Sensor = Sensor;
        this.Parameter = Parameter;
        this.Interval = Interval;
    }
    Name() {
        return this.Location + " " + this.Sensor + " " + this.Parameter + " " + String("0").repeat(Math.abs(3 - this.Interval.toString().length)) + this.Interval;
    }
    ;
    LspiName() {
        return this.Location + this.Sensor + this.Parameter + this.Interval;
    }
    ;
}
//# sourceMappingURL=Lspi.js.map