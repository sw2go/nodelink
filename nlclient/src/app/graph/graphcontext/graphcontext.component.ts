import { Component, OnInit, Input } from '@angular/core';
import { Store } from '../../state/store';
import { State } from '../../model/state';
import { Action } from '../../state/reducer';
import { NodeService } from '../../service/node.service';
import { Graph } from '@swimlane/ngx-graph';
import { sortGraphItems } from '../graphview/graphsortpolicy';
import { Observable } from 'rxjs';
import { GraphSettings } from '../../model/graphsettings';
import { ChangeAnalyzer } from '../../state/changeanalyzer';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-graphcontext',
  templateUrl: './graphcontext.component.html',
  styleUrls: ['./graphcontext.component.scss']
})
export class GraphContextComponent implements OnInit {

  @Input()
  graph: Graph;

  item$: Observable<GraphSettings>;

  constructor(private store: Store<State, Action>, private nodeservice: NodeService) {
    this.item$ = store.state$.pipe(
      map(x => ChangeAnalyzer.GraphSettingsChanged(x)),
      filter( x => x != null),
      map(x => { return x.settings; })
    )
  }

  ngOnInit() {
  }

  relayoutClicked() {
    let sorted = sortGraphItems(this.graph.nodes, this.graph.edges);
    this.store.sendAction({type: "UPDATESORTORDER", nodeIds: sorted.nodeIds, linkIds: sorted.linkIds });    
  }

  saveGraphToFile(aElementRef: any) {
    aElementRef.href = this.nodeservice.hrefGraphData();
  }

  loadGraphFromFile(file: File) {
    this.store.sendAction({ type: "READFROMFILE" , file: file });
  }

  changeName(name: string) {
    this.store.sendAction({ type: "UPDATESETTINGSNAME" , name: name });
  }

  addNode() {
    this.store.sendAction({ type: "ADDMODAL" , item: null})
  }

}
