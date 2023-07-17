export default class Box {
  title: string;
  description: string;
  price: number;
  total: number;

  constructor(title: string, description: string, price: number, total: number) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.total = total;
  }

}
