export class LineChartConfig {
    title: string;
    pieHole: number;
    width: number;
    height: number;
    hAxisFormat: string;

    constructor(title: string, pieHole: number, width: number, height: number, hAxisFormat: string) {
        this.title = title;
        this.pieHole = pieHole;
        this.width = width;
        this.height = height;
        this.hAxisFormat = hAxisFormat;
    }
}