import { Component, Input } from '@angular/core';
import makeBlockiesUrl from 'blockies-base64-svg'

@Component({
  selector: 'app-account-selector',
  templateUrl: './account-selector.component.html',
  styleUrls: ['./account-selector.component.css']
})
export class AccountSelectorComponent {

  @Input() activeAccount!: string;
  @Input() accounts!: string[];

  getBlockieFromAddress(address: string): string {
    return makeBlockiesUrl(address);
  }

}
