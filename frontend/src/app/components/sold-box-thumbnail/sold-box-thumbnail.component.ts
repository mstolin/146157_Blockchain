import { Component, Input } from '@angular/core';
import BoxSellRef from 'src/app/models/boxSellRef';

@Component({
  selector: 'app-sold-box-thumbnail',
  templateUrl: './sold-box-thumbnail.component.html',
  styleUrls: ['./sold-box-thumbnail.component.css']
})
export class SoldBoxThumbnailComponent {

  @Input() title!: string;
  @Input() sellRef!: BoxSellRef;

}
