var DataService_1;
import * as tslib_1 from "tslib";
import { Injectable, EventEmitter } from '@angular/core';
import { Lspi } from '../models/Lspi';
import { DataCacheLine } from '../models/DataCacheLine';
let DataService = DataService_1 = class DataService {
    constructor(httpClient) {
        this.httpClient = httpClient;
        this.updateChartDataEvent = new EventEmitter();
        this.lspis = [];
        this.dataCache = [];
        this.lspis = [];
        this.loading = false;
        return DataService_1.instance = DataService_1.instance || this;
    }
    ClearCache() {
        let now = new Date();
        this.dataCache = this.dataCache.filter(element => (now.getTime() - element.LastUpDate.getTime()) < 1000 * 60 * 60);
    }
    GetData(widget, Version, StartTime, EndTime, SerieList) {
        let completeCacheLines = [];
        let inCompleteCacheLines = [];
        let emptyCacheLines = [];
        let ChartData;
        let ColumnNames;
        console.log("GetData();", Version, StartTime, EndTime, SerieList);
        SerieList.forEach((serie, index) => {
            let cacheLines = this.dataCache.filter(element => element.Lspi.LspiName() == serie.Lspi.LspiName());
            let found = false;
            cacheLines.forEach((cacheLine, cacheIndex) => {
                // Check if cacheline exist with needed data:
                if (!found) {
                    if (serie.StartTime.getTime() == cacheLine.StartTime.getTime()) {
                        // Check if all data is avaible ? 
                        if (cacheLine.EndTime.getTime() >= serie.EndTime.getTime()) {
                            // Reqeusted data was already completely requested from database and put in the cache 
                            if ((cacheLine.MostRecentDataPointTime.getTime() < serie.EndTime.getTime()) && (Date.now() - cacheLine.LastUpDate.getTime()) > 30000) {
                                // Still missing some datapoints from requested time region:
                                cacheLine.LastUpDate = new Date(Date.now()); // Update time stamp
                                inCompleteCacheLines.push(cacheLine);
                            }
                            else {
                                // All requested data is available:
                                cacheLine.LastUpDate = new Date(Date.now()); // Update time stamp
                                completeCacheLines.push(cacheLine);
                            }
                            found = true;
                        }
                        else {
                            // Some of the requested data is missing in the cache:
                            cacheLine.LastUpDate = new Date(Date.now()); // Update time stamp
                            inCompleteCacheLines.push(cacheLine);
                            found = true;
                        }
                    }
                }
            });
            if (!found) {
                // Reqeuested data is missing in the cache:
                emptyCacheLines.push(new DataCacheLine(serie.Lspi, new Date(Date.now()), StartTime, EndTime, StartTime, []));
            }
        });
        let startTimeInCompleteCacheLines = EndTime;
        inCompleteCacheLines.forEach((cacheLine, cacheIndex) => {
            if (cacheLine.EndTime < startTimeInCompleteCacheLines) {
                startTimeInCompleteCacheLines = cacheLine.EndTime;
            }
        });
        console.log("completeCacheLines before dataload: ", completeCacheLines);
        console.log("inCompleteCacheLines before dataload: ", inCompleteCacheLines);
        console.log("emptyCacheLines before dataload: ", emptyCacheLines);
        console.log("inCompleteCacheLines.length: ", inCompleteCacheLines.length);
        console.log("emptyCacheLines.length: ", emptyCacheLines.length);
        if (inCompleteCacheLines.length > 0 || emptyCacheLines.length > 0) {
            if (emptyCacheLines.length == 0) {
                this.loadDataFromServerInDataCache(widget, 0, startTimeInCompleteCacheLines, EndTime, SerieList, inCompleteCacheLines.concat(completeCacheLines), ChartData, ColumnNames, []);
            }
            else {
                let linesToUpdate = emptyCacheLines.concat(inCompleteCacheLines).concat(completeCacheLines);
                this.loadDataFromServerInDataCache(widget, 0, StartTime, EndTime, SerieList, linesToUpdate, ChartData, ColumnNames, emptyCacheLines);
            }
        }
        else {
            this.updateChartFromCache(widget, StartTime, EndTime, SerieList, completeCacheLines, ChartData, ColumnNames);
        }
    }
    updateChartFromCache(widget, StartTime, EndTime, SerieList, DataCache, ChartData, ColumnNames) {
        ColumnNames = [];
        ChartData = [];
        console.log("updateChartFromCache -> SerieList: ", SerieList);
        console.log("updateChartFromCache -> DataCache: ", DataCache);
        ColumnNames.push("Time");
        //ChartData.push([]);
        //ChartData[0].push({label: 'Time', id: 'Time', type: 'date'});
        let cacheLines = [];
        SerieList.forEach((serie, index) => {
            ColumnNames.push(serie.Lspi.LspiName());
            //ChartData[0].push({label: serie.Lspi.LspiName(), id: serie.Lspi.LspiName(), type: 'number'});
            cacheLines.push(DataCache.find(element => element.Lspi.LspiName() == serie.Lspi.LspiName()));
        });
        console.log("ColumnNames: ", ColumnNames);
        console.log("cacheLines: ", cacheLines);
        let firstCacheLine = true;
        cacheLines.forEach((cacheLine, index) => {
            //let cacheLineIndex: number = 1;
            let cacheLineIndex = 0;
            let highestDateKey = 0;
            for (let key in cacheLine.Data) {
                let dataValue = cacheLine.Data[key];
                if (Number(key) > highestDateKey) {
                    highestDateKey = Number(key);
                }
                if (firstCacheLine) {
                    ChartData.push([]);
                    //let time: string = new Date(Number(key)).toISOString().split('T')[0] + 'T' + new Date(Number(key)).toISOString().split('T')[1].slice(0,-5);
                    //ChartData[cacheLineIndex].push(time);          
                    ChartData[cacheLineIndex].push(new Date(Number(key)));
                }
                ChartData[cacheLineIndex].push(dataValue);
                cacheLineIndex++;
            }
            ;
            if (highestDateKey != 0) {
                cacheLine.MostRecentDataPointTime = new Date(highestDateKey);
            }
            firstCacheLine = false;
        });
        this.updateChartDataEvent.emit({ widget, ChartData, ColumnNames });
        console.log("ChartData: ", ChartData);
    }
    loadDataFromServerInDataCache(widget, Version, StartTime, EndTime, SerieList, DataCache, ChartData, ColumnNames, DataCacheLinesToAdd) {
        let lspiList = [];
        DataCache.forEach((cacheLine, cacheIndex) => {
            lspiList.push(cacheLine.Lspi);
        });
        //console.log("loadDataFromServerInDataCache: ", DataCache, lspiList, lspiList.length);
        if (lspiList.length > 0) {
            this.getDataFrameWithLspiList(Version, StartTime, EndTime, lspiList).then((dataFrame) => {
                if (typeof dataFrame == 'string') {
                    dataFrame = JSON.parse(dataFrame);
                }
                dataFrame.forEach((arrayItem, index) => {
                    //console.log("loadDataFromServerInDataCache: dataFrame.forEach: ", arrayItem);
                    let time;
                    for (var key in arrayItem) {
                        if (key == 'Time') {
                            time = new Date(arrayItem[key]);
                            //console.log("loadDataFromServerInDataCache: time: ", time);
                        }
                        else {
                            //console.log("loadDataFromServerInDataCache: value: ", arrayItem[key]);
                            let line = DataCache.find(element => element.Lspi.LspiName() == key);
                            //console.log("loadDataFromServerInDataCache update cachline: ", line);
                            // Put datapoint in cache if it didn't already exist:
                            //console.log("loadDataFromServerInDataCache line data: ", line.Data);
                            //console.log("loadDataFromServerInDataCache line data number of items: ", Object.keys(line.Data).length);
                            //console.log("line.Data[time.getTime()]: ", time.getTime(), line.Data[time.getTime()]);
                            if (line.Data[time.getTime()] == undefined) {
                                //console.log("loadDataFromServerInDataCache INITIAL insert: ", time.getTime(), arrayItem[key]);
                                line.Data[time.getTime()] = arrayItem[key];
                            }
                        }
                    }
                });
                //console.log("CacheLines after dataload: ", DataCache);
                this.updateChartFromCache(widget, StartTime, EndTime, SerieList, DataCache, ChartData, ColumnNames);
                this.dataCache = this.dataCache.concat(DataCacheLinesToAdd);
            });
        }
    }
    padZeroes(input, length) {
        return String("0").repeat(Math.abs(length - input.toString().length)) + input.toString();
    }
    getDataFrameWithLspiList(Version, StartTime, EndTime, LspiList) {
        let apiRequest = 'http://localhost:8090/GTSACQ/GetDataPoints?';
        LspiList.forEach((lspi, index) => {
            apiRequest += 'lspis=' + lspi.LspiName() + '&';
        });
        let formatted_startTime = StartTime.getFullYear() + "-" + this.padZeroes((StartTime.getMonth() + 1), 2) + "-" + this.padZeroes(StartTime.getDate(), 2) + " " + this.padZeroes(StartTime.getHours(), 2) + ":" + this.padZeroes(StartTime.getMinutes(), 2) + ":" + this.padZeroes(StartTime.getSeconds(), 2);
        let formatted_endTime = EndTime.getFullYear() + "-" + this.padZeroes((EndTime.getMonth() + 1), 2) + "-" + this.padZeroes(EndTime.getDate(), 2) + " " + this.padZeroes(EndTime.getHours(), 2) + ":" + this.padZeroes(EndTime.getMinutes(), 2) + ":" + this.padZeroes(EndTime.getSeconds(), 2);
        apiRequest += 'startTime=' + formatted_startTime + '&endTime=' + formatted_endTime + '&version=' + Version;
        console.log("Get data from API: " + apiRequest);
        return this.httpClient.get(apiRequest).toPromise();
    }
    getLSPIList() {
        let promise = new Promise((resolve, reject) => {
            let apiRequest = 'http://localhost:8090/GTSACQ/GetLSPIS';
            console.log("Get LSPI list from API: " + apiRequest);
            this.httpClient
                .get(apiRequest)
                .toPromise()
                .then((res) => {
                console.log("res: ", res);
                this.lspis = res.data.map(item => {
                    return new Lspi(item.LocationShortName, item.SensorShortName, item.ParameterShortName, item.Interval);
                });
                resolve();
            }, msg => {
                // Error
                reject(msg);
            });
        });
        return promise;
    }
};
DataService = DataService_1 = tslib_1.__decorate([
    Injectable({
        providedIn: 'root'
    })
], DataService);
export { DataService };
//# sourceMappingURL=data.service.js.map