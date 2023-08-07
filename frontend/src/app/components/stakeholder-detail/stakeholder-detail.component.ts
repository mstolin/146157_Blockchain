import { Component, Input } from '@angular/core';
import Stakeholder from 'src/app/models/stakeholder';
import makeBlockiesUrl from 'blockies-base64-svg'

@Component({
  selector: 'app-stakeholder-detail',
  templateUrl: './stakeholder-detail.component.html',
  styleUrls: ['./stakeholder-detail.component.css']
})
export class StakeholderDetailComponent {

  @Input() role!: string;
  @Input() stakeholder!: Stakeholder;

  getBlockieFromAddress(address: string): string {
    return makeBlockiesUrl(address);
  }

}
