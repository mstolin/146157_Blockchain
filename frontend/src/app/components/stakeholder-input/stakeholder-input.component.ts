import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stakeholder-input',
  templateUrl: './stakeholder-input.component.html',
  styleUrls: ['./stakeholder-input.component.css']
})
export class StakeholderInputComponent {

  @Input() role!: string;

}
