export class Frame_Element {
    constructor(
      public id: number,
      public fame_id: number,

      public LSPI_location: string,
      public LSPI_sensor: string,
      public LSPI_parameter: string,
      public LSPI_interval: number,
      public start_time: Date,
      public stop_time: Date,
      public auto_refresh_active: boolean,
      public auto_refresh_interval: number,
      public line_color: number,
      public line_type: number,

      public position: number      
    ) {}
  }