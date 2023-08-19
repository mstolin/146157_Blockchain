import { Component, Input } from '@angular/core';
import { BoxReq } from 'src/app/models/requestModels';

@Component({
  selector: 'app-box-input',
  templateUrl: './box-input.component.html',
  styleUrls: ['./box-input.component.css']
})
export class BoxInputComponent {

  @Input() boxIndex!: number;
  @Input() boxOffer!: BoxReq;

  @Input() set boxPrice(price: string) {
    this.boxOffer.price = BigInt(price);
  }


}
