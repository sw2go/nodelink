import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Observable } from 'rxjs';
import { NodeItem } from '../model/nodeitem';
import { NodeService } from '../service/node.service';

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

  constructor(private bsModalRef: BsModalRef, private nodeService: NodeService) { 
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
    if (this.targetNodeId == 'new')
      this.nodeService.addLinkAndNode(this.sourceNode.id, this.targetNodeName);
    else
      this.nodeService.addLink(this.sourceNode.id, this.targetNodeId);
    this.onClose.next(true);
    this.bsModalRef.hide();  
  }

  onCancel(): void {
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

}
