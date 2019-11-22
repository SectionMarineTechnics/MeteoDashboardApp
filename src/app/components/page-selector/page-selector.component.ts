import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridsterLayoutService } from 'src/app/services/gridster-layout.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Page } from 'src/app/models/Page';
import { SettingsService } from 'src/app/services/settings.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/User';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-page-selector',
  templateUrl: './page-selector.component.html',
  styleUrls: ['./page-selector.component.css']
})
export class PageSelectorComponent implements OnInit {
  currentUser: User;
  pages: Page[];

  pageInfo_form: FormGroup;

  constructor(public settingsService: SettingsService, private layoutService: GridsterLayoutService, private router: Router, public auth: AuthService, private formBuilder: FormBuilder) {
    this.pageInfo_form = this.formBuilder.group({
      NewPageName: new FormControl("", Validators.required),
    });
    this.pages = [];
  }

  ngOnInit() {
    this.auth.userProfile$.subscribe(profile => {
      this.settingsService.getUsers().subscribe(users => {
        if (profile) {
          let currentUserId: number = users.find(x => x.name == profile.name).id;
          if (currentUserId) {
            this.settingsService.getUser(currentUserId).subscribe(user => {
              this.currentUser = user;
              this.UpdatePages();
            });
          }
        }
      });
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log("drop page position");
    moveItemInArray(this.currentUser.Page, event.previousIndex, event.currentIndex);

    let position: number = 1;
    this.currentUser.Page.forEach(page => {
      page.position = position++;
      this.settingsService.updatePage(page).subscribe();
    });
    this.layoutService.currentUser = this.currentUser;
    this.UpdatePages();
  }

  closeForm() {
    this.router.navigateByUrl('/');
  }

  submit() {
    //this.layoutService.updateItem(this.frameId, this.serieInfo_form.get("Titel").value, this.selectedLspis, this.serieInfo_form.get("Type").value);
    this.layoutService.currentUser = this.currentUser;

    this.router.navigateByUrl('/');
  }

  UpdatePages() {
    this.pages = this.currentUser.Page.sort(function (a, b) {
      return a.position - b.position;
    });
  }

  deletePage(page: Page){
    console.log("deletepage()");
    
    const index: number = this.currentUser.Page.indexOf(page);
    if (index !== -1) {
      this.currentUser.Page.splice(index, 1);
      this.layoutService.currentUser = this.currentUser;
      this.settingsService.deletePage(page.page_id).subscribe();
      this.UpdatePages();      
    } 
  }

  addNewPage() {
    let newPage: Page = new Page(0, [], this.layoutService.currentUser.id, this.pageInfo_form.get("NewPageName").value, this.layoutService.getNexPagePosition());
    this.layoutService.currentUser.Page.push(newPage);
    this.currentUser = this.layoutService.currentUser;
    this.settingsService.updatePage(newPage).subscribe( page => {
      this.settingsService.getUser(this.currentUser.id).subscribe(user => {
        this.currentUser = user;
        this.layoutService.currentUser = this.currentUser;
        this.UpdatePages();
      });
    });
  }

  pageExist(){
    let newPageName: string = this.pageInfo_form.get("NewPageName").value;
    return this.currentUser.Page.find(x => x.name == newPageName) != undefined;
  }
}
