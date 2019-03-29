import { Component, Input } from '@angular/core';

type MenuItem = { text: string, show: boolean,  call: () => void };

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent {

  // for use in html-template
  public x: number;
  public y: number;
  private menuitems: MenuItem[];
  
  constructor() { 
    this.menuitems = null;
  }

  public show(x: number, y: number, menuitems: MenuItem[]) {
    this.x = x;
    this.y = y;
    this.menuitems = menuitems.filter( x => x.show);    
  }

  public hide() {
    this.x = 0;
    this.y = 0;
    this.menuitems = null;
  }

  public get visible(): boolean {
    return this.menuitems != null;  
  }

}
