import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-parent-dynamic',
  templateUrl: './parent-dynamic.component.html',
  styleUrls: ['./parent-dynamic.component.css']
})
export class ParentDynamicComponent implements OnInit {
  @Input() widget;
  @Input() resizeEvent;
  @Input() updateTimeEvent;

  constructor() { }

  ngOnInit() {
  }

}
