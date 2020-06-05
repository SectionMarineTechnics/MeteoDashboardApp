import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
let SettingsService = class SettingsService {
    constructor(httpClient) {
        this.httpClient = httpClient;
        this.Users = new Array(0);
        this.settingsUrl = 'http://localhost:8090/Dashboard';
    }
    /*
    getUsers() {
      console.log('settingsService:getUsers()', 'GET ' + this.settingsUrl + '/SELECT_User_list');
      return this.httpClient.get<User[]>(this.settingsUrl + '/SELECT_User_list');
    }*/
    getUsers() {
        console.log('settingsService:getUsers()', 'GET ' + this.settingsUrl + '/SELECT_User_list');
        return this.httpClient.get(this.settingsUrl + '/SELECT_User_list');
    }
    getUser(userID) {
        console.log('settingsService:getUser()', 'GET ' + this.settingsUrl + '/SELECT_User');
        return this.httpClient.get(this.settingsUrl + '/SELECT_User?userid=' + userID);
    }
    getPage(pageID) {
        console.log('settingsService:getPage()', 'GET ' + this.settingsUrl + '/SELECT_Page');
        return this.httpClient.get(this.settingsUrl + '/SELECT_Page?pageid=' + pageID);
    }
    getFrame(frameID) {
        console.log('settingsService:getUser()', 'GET ' + this.settingsUrl + '/SELECT_Frame');
        return this.httpClient.get(this.settingsUrl + '/SELECT_Frame?frameid=' + frameID);
    }
    getFrame_Element(frameElementID) {
        console.log('settingsService:getUser()', 'GET ' + this.settingsUrl + '/SELECT_Frame_Element');
        return this.httpClient.get(this.settingsUrl + '/SELECT_Frame_Element?frameElementid=' + frameElementID);
    }
    updateUser(user) {
        console.log('settingsService:updateUser()', 'UPDATE ' + this.settingsUrl + '/UPDATE_User');
        return this.httpClient.post(this.settingsUrl + '/UPDATE_User', user);
    }
    updatePage(page) {
        console.log('settingsService:updatePage()', 'UPDATE ' + this.settingsUrl + '/UPDATE_Page');
        return this.httpClient.post(this.settingsUrl + '/UPDATE_Page', page);
    }
    updateFrame(frame) {
        console.log('settingsService:updateFrame()', 'UPDATE ' + this.settingsUrl + '/UPDATE_Frame');
        return this.httpClient.post(this.settingsUrl + '/UPDATE_Frame', frame);
    }
    updateFrame_Element(frameElement) {
        console.log('settingsService:updateFrame_Element()', 'UPDATE ' + this.settingsUrl + '/UPDATE_Frame_Element');
        return this.httpClient.post(this.settingsUrl + '/UPDATE_Frame_Element', frameElement);
    }
    deleteUser(userID) {
        console.log('settingsService:DeleteUser()', 'DELETE ' + this.settingsUrl + '/DELETE_User');
        return this.httpClient.delete(this.settingsUrl + '/DELETE_User?userid=' + userID);
    }
    deletePage(pageID) {
        console.log('settingsService:DeletePage()', 'DELETE ' + this.settingsUrl + '/DELETE_Page');
        return this.httpClient.delete(this.settingsUrl + '/DELETE_Page?pageid=' + pageID);
    }
    deleteFrame(frameID) {
        console.log('settingsService:DeleteFrame()', 'DELETE ' + this.settingsUrl + '/DELETE_Frame');
        return this.httpClient.delete(this.settingsUrl + '/DELETE_Frame?frameid=' + frameID);
    }
    deleteFrame_Element(frameElementID) {
        console.log('settingsService:DeleteFrame_Element()', 'DELETE ' + this.settingsUrl + '/DELETE_Frame_Element');
        return this.httpClient.delete(this.settingsUrl + '/DELETE_Frame_Element?frameElementid=' + frameElementID);
    }
};
SettingsService = tslib_1.__decorate([
    Injectable({
        providedIn: 'root'
    })
], SettingsService);
export { SettingsService };
//# sourceMappingURL=settings.service.js.map