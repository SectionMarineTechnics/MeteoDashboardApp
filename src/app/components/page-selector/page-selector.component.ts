import { Component, OnInit, OnDestroy } from '@angular/core';
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
  currentUserId: number;
  pages: Page[];
  activeEditPage: Page;

  pageInfo_form: FormGroup;

  constructor(public settingsService: SettingsService, private layoutService: GridsterLayoutService, private router: Router, public auth: AuthService, private formBuilder: FormBuilder) {
    this.pageInfo_form = this.formBuilder.group({
      NewPageName: new FormControl("", Validators.required),
      EditPageName: new FormControl("", null),
    });
    this.pages = [];
    this.activeEditPage = null;
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  ngOnInit() {
    this.auth.userProfile$.subscribe(profile => {
      this.settingsService.getUsers().subscribe(users => {
        if (profile) {
          this.currentUserId = users.find(x => x.name == profile.name).id;
          if (this.currentUserId) {
            this.settingsService.getUser(this.currentUserId).subscribe(user => {
              this.currentUser = user;
              this.UpdatePages();
            });
          }
        }
      });
    });
  }

  ngOnDestroy() {
    console.log("PageSelectorComponent ngOnDestroy()");
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

    this.currentUser.Page.forEach(page => {
      this.settingsService.updatePage(page).subscribe();
    });
    this.layoutService.currentUser = this.currentUser;

    this.router.navigateByUrl('/');
  }

  UpdatePages() {
    this.pages = this.currentUser.Page.sort(function (a, b) {
      return a.position - b.position;
    });
  }

  deletePage(page: Page){
    console.log("deletePage()");
    
    const index: number = this.currentUser.Page.indexOf(page);
    if (index !== -1) {
      this.currentUser.Page.splice(index, 1);
      this.layoutService.currentUser = this.currentUser;
      this.settingsService.deletePage(page.page_id).subscribe();
      this.UpdatePages();      
    } 
  }

  changePage(page: Page){
    console.log("changePage()");
  }

  editPage(page: Page){
    console.log("editPage()");
    this.activeEditPage = page;
  }


  updatePageName(page: Page, name: string){
    page.name = name;
    this.settingsService.updatePage(page).subscribe();
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

  addDefaultPagesToCurrentUser() {
    if(confirm("Wens je de default pagina's toe te voegen?")) {
      this.settingsService.setUserToDefault(this.currentUser).subscribe( data => {
        this.settingsService.getUser(this.currentUserId).subscribe(user => {
          this.currentUser = user;
          this.UpdatePages();
        }); 
      });
    }
  }

  pageExist(){
    let newPageName: string = this.pageInfo_form.get("NewPageName").value;
    return this.currentUser.Page.find(x => x.name == newPageName) != undefined;
  }
}
