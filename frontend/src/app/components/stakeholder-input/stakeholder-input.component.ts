import { Component, Input } from '@angular/core';
import { StakeholderReq } from 'src/app/models/requestModels';

@Component({
  selector: 'app-stakeholder-input',
  templateUrl: './stakeholder-input.component.html',
  styleUrls: ['./stakeholder-input.component.css']
})
export class StakeholderInputComponent {

  @Input() role!: string;
  @Input() model!: StakeholderReq;

}
