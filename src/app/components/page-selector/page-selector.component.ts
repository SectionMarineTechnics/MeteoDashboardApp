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
  pages: Page[];

  pageInfo_form: FormGroup;

  constructor(public settingsService: SettingsService, private layoutService: GridsterLayoutService, private router: Router, public auth: AuthService, private formBuilder: FormBuilder) {
    this.pageInfo_form = this.formBuilder.group({
      NewPageName: new FormControl("", Validators.required),
      EditPageName: new FormControl("", null),
    });
    this.pages = [];
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  ngOnInit() {
    /*console.log("PageSelectorComponent ngOnInit");*/
    this.auth.userProfile$.subscribe(profile => {
      if (profile) {
        /*console.log("PageSelectorComponent ngOnInit profile.name: ", profile.name);*/


        /*this.layoutService.InitializeUserInfoWithAuth0ProfileName(profile.name);
        
        console.log("PageSelectorComponent ngOnInit InitializeUserInfoWithAuth0ProfileName");*/

        if(this.layoutService.currentUser == undefined)
        { 
          this.router.navigateByUrl('/');
        }
        else
        {
          this.UpdatePages();
        }

        /*console.log("PageSelectorComponent ngOnInit UpdatePages");*/
      }
    });
  }

  ngOnDestroy() {
    /*console.log("PageSelectorComponent ngOnDestroy()");*/
  }    

  drop(event: CdkDragDrop<string[]>) {
    /*console.log("drop page position");*/
    moveItemInArray(this.layoutService.currentUser.Page, event.previousIndex, event.currentIndex);

    let position: number = 1;
    this.layoutService.currentUser.Page.forEach(page => {
      page.position = position++;
      this.settingsService.updatePage(page).subscribe();
    });
    this.UpdatePages();
  }

  closeForm() {
    this.router.navigateByUrl('/');
  }

  submit() {
    this.layoutService.currentUser.Page.forEach(page => {
      this.settingsService.updatePage(page).subscribe();
    });

    this.layoutService.UpdateNavigationBar();

    this.router.navigateByUrl('/');
  }

  UpdatePages() {
    /*console.log("UpdatePages: ", this.layoutService.currentUser.Page);*/


    this.pages = this.layoutService.currentUser.Page.sort(function (a, b) {
      return a.position - b.position;
    });

    /*console.log("UpdatePages: ", this.pages);*/
  }

  deletePage(page: Page){
    /*console.log("deletePage()");*/
    if(confirm("Ben je zeker dat je de pagina " + page.name + " definitief wil verwijderen?")) {
      const index: number = this.layoutService.currentUser.Page.indexOf(page);
      if (index !== -1) {
        this.layoutService.currentUser.Page.splice(index, 1);
        this.settingsService.deletePage(page.page_id).subscribe();
        this.UpdatePages();      
      } 

      this.layoutService.UpdateNavigationBar();
    }
  }

  updatePageName(page: Page, name: string){
    page.name = name;
    this.settingsService.updatePage(page).subscribe();
  }

  addNewPage() {
    let newPage: Page = new Page(0, [], this.layoutService.currentUser.id, this.pageInfo_form.get("NewPageName").value, this.layoutService.getNexPagePosition());
    this.settingsService.updatePage(newPage).subscribe(page_id =>{
      newPage.page_id = page_id;
      this.layoutService.currentUser.Page.push(newPage);
      this.UpdatePages();
    });
  }

  addDefaultPagesToCurrentUser() {
    if(confirm("Wens je de default pagina's toe te voegen?")) {
      this.settingsService.setUserToDefault(this.layoutService.currentUser).subscribe( data => {
        this.settingsService.getUser(this.layoutService.currentUser.id).subscribe(user => { 
          this.layoutService.currentUser = user;
          this.UpdatePages();
        });
      });
    }
  }

  pageExist(){
    let newPageName: string = this.pageInfo_form.get("NewPageName").value;
    return this.layoutService.currentUser.Page.find(x => x.name == newPageName) != undefined;
  }
}
