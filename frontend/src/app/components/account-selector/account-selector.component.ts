import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-account-selector',
  templateUrl: './account-selector.component.html',
  styleUrls: ['./account-selector.component.css']
})
export class AccountSelectorComponent {

  @Input() selectedAccount!: string;
  @Input() accounts!: string[];

}
