import { Component, OnInit } from '@angular/core';
import { NodeItem } from './../model/node';
import { LinkItem } from './../model/link'



@Component({
  selector: 'app-mygraph',
  templateUrl: './mygraph.component.html',
  styleUrls: ['./mygraph.component.scss']
})
export class MygraphComponent implements OnInit {

  nodeitems: NodeItem[];
  linkitems: LinkItem[];
  constructor() { 

    this.nodeitems = [
      new NodeItem("n1", "A"),
      new NodeItem("n2", "B"),
      new NodeItem("n3", "C"),
    ];

    this.linkitems = [
      new LinkItem("l1", "n1", "n2", "ab"),
      new LinkItem("l2", "n1", "n3", "ac")
    ];
  }

  ngOnInit() {

  }

  addNode() {


  }



}
