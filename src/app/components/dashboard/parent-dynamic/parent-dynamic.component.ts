import { Component, OnInit, Input } from '@angular/core';
import { Serie } from 'src/app/models/Serie';

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
