import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Observable } from 'rxjs';
import { NodeItem } from '../model/nodeitem';
import { NodeService } from '../service/node.service';
import { Store } from '../state/store';
import { State, Action } from '../state/reducer';

@Component({
  selector: 'app-modal-add-node',
  templateUrl: './modal-add-node.component.html',
  styleUrls: ['./modal-add-node.component.scss']
})
export class ModalAddNodeComponent implements OnInit {

  sourceNode: NodeItem;   // is set by initialState in ModalOptions see: MygraphComponent.showAddLinkNode() 
  public onClose: Subject<boolean>;
  private targetNodeName: string;
  private targetNodeId: string;
  private dataValid: boolean;

  constructor(private bsModalRef: BsModalRef, private store: Store<State,Action>, private nodeService: NodeService) { 
  }

  ngOnInit() {
    this.onClose = new Subject();
    this.targetNodeName = '';
    this.targetNodeId = 'new';
    this.dataValid = false;
  }

  onNodeIdChanged(nodeid: string) {
    this.targetNodeId = nodeid;
    this.dataValid = (nodeid != 'new');
  }

  onNodeNameChanged(nodename: string) {
    this.targetNodeName = nodename;
    this.dataValid = (nodename.length > 0);
  }

  getOptionNodes(): Observable<NodeItem[]> {
    return this.nodeService.getLinkableNodes(this.sourceNode);
  }

  onConfirm(): void {
    if (this.targetNodeId == 'new' && !this.sourceNode) 
      this.sendAction({type: "ADDNODE", targetNodeName: this.targetNodeName});
    else if (this.targetNodeId == 'new' && this.sourceNode)
      this.sendAction({type: "ADDLINKANDNODE", sourceNodeId: this.sourceNode.id, targetNodeName: this.targetNodeName});
    else if (this.targetNodeId != 'new' && this.sourceNode)
      this.sendAction({type: "ADDLINK", sourceNodeId: this.sourceNode.id, targetNodeId: this.targetNodeId});
    else
      throw new Error("invalid action");    
  }

  sendAction(action: Action) {
    this.store.sendAction(action).subscribe(x => {
      this.onClose.next(true);
      this.bsModalRef.hide();  
    });
  }

  onCancel(): void {
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

}
