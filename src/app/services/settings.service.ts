import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/User'
import { UserShort } from '../models/UserShort'
import { Page } from '../models/Page'
import { Frame } from '../models/Frame'
import { Frame_Element } from '../models/Frame_Element'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public Users: User[] = new Array<User>(0);

  /*settingsUrl: string = 'http://localhost:8090/Dashboard';*/
  /*settingsUrl: string = 'http://10.176.225.16:8090/Dashboard';*/
  settingsUrl: string = 'https://10.176.225.16/Dashboard';


  constructor(private httpClient: HttpClient) 
  { 

  }

  /*
  getUsers() {
    console.log('settingsService:getUsers()', 'GET ' + this.settingsUrl + '/SELECT_User_list');
    return this.httpClient.get<User[]>(this.settingsUrl + '/SELECT_User_list');
  }*/
  getUsers() {
   /*console.log('settingsService:getUsers()', 'GET ' + this.settingsUrl + '/SELECT_User_list');*/
    return this.httpClient.get<UserShort[]>(this.settingsUrl + '/SELECT_User_list');
  }

  getUser(userID: number) {
    /*console.log('settingsService:getUser()', 'GET ' + this.settingsUrl + '/SELECT_User');*/
    return this.httpClient.get<User>(this.settingsUrl + '/SELECT_User?userid=' + userID);
  }

  getPage(pageID: number) {
    /*console.log('settingsService:getPage()', 'GET ' + this.settingsUrl + '/SELECT_Page');*/
    return this.httpClient.get<Page>(this.settingsUrl + '/SELECT_Page?pageid=' + pageID);
  }

  getFrame(frameID: number) {
    /*console.log('settingsService:getUser()', 'GET ' + this.settingsUrl + '/SELECT_Frame');*/
    return this.httpClient.get<Frame>(this.settingsUrl + '/SELECT_Frame?frameid=' + frameID);
  }

  getFrame_Element(frameElementID: number) {
    /*console.log('settingsService:getUser()', 'GET ' + this.settingsUrl + '/SELECT_Frame_Element');*/
    return this.httpClient.get<Frame_Element>(this.settingsUrl + '/SELECT_Frame_Element?frameElementid=' + frameElementID);
  }


  setUserToDefault(user: User) {
    /*console.log('settingsService:SetUserToDefault()', 'UPDATE ' + this.settingsUrl + '/SET_User_default');*/
    return this.httpClient.post(this.settingsUrl + '/SET_User_default', user);  
  }


  updateUser(user: User){
    /*console.log('settingsService:updateUser()', 'UPDATE ' + this.settingsUrl + '/UPDATE_User');*/
    return this.httpClient.post<number>(this.settingsUrl + '/UPDATE_User', user);
  }

  updatePage(page: Page){
    /*console.log('settingsService:updatePage()', 'UPDATE ' + this.settingsUrl + '/UPDATE_Page');*/
    return this.httpClient.post<number>(this.settingsUrl + '/UPDATE_Page', page);
  }

  updateFrame(frame: Frame){
    /*console.log('settingsService:updateFrame()', 'UPDATE ' + this.settingsUrl + '/UPDATE_Frame');*/
    return this.httpClient.post<number>(this.settingsUrl + '/UPDATE_Frame', frame);
  }

  updateFrame_Element(frameElement: Frame_Element){
    /*console.log('settingsService:updateFrame_Element()', 'UPDATE ' + this.settingsUrl + '/UPDATE_Frame_Element');*/
    return this.httpClient.post<number>(this.settingsUrl + '/UPDATE_Frame_Element', frameElement);
  }

  deleteUser(userID: number) {
    /*console.log('settingsService:DeleteUser()', 'DELETE ' + this.settingsUrl + '/DELETE_User');*/
    return this.httpClient.delete(this.settingsUrl + '/DELETE_User?userid=' + userID);
  }

  deletePage(pageID: number) {
    /*console.log('settingsService:DeletePage()', 'DELETE ' + this.settingsUrl + '/DELETE_Page');*/
    return this.httpClient.delete(this.settingsUrl + '/DELETE_Page?pageid=' + pageID);
  }

  deleteFrame(frameID: number) {
    /*console.log('settingsService:DeleteFrame()', 'DELETE ' + this.settingsUrl + '/DELETE_Frame');*/
    return this.httpClient.delete(this.settingsUrl + '/DELETE_Frame?frameid=' + frameID);
  }

  deleteFrame_Element(frameElementID: number) {
    /*console.log('settingsService:DeleteFrame_Element()', 'DELETE ' + this.settingsUrl + '/DELETE_Frame_Element');*/
    return this.httpClient.delete(this.settingsUrl + '/DELETE_Frame_Element?frameElementid=' + frameElementID);
  }
}
