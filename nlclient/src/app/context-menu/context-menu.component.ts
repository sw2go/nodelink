import { Component, Input } from '@angular/core';
import { ContextMenuData } from '../model/contextmenudata';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent {

  @Input() context: ContextMenuData;
  
  constructor() { }

}
