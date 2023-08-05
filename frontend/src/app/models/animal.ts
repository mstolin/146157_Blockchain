export default class Animal {
  private readonly _earTag: string;
  private readonly _name: string;
  private readonly _farm: string;
  private readonly _age: number;

  constructor(earTag: string, name: string, farm: string, age: number) {
    this._earTag = earTag;
    this._name = name;
    this._farm = farm;
    this._age = age;
  }

  get earTag() {
    return this._earTag
  }

  get name() {
    return this._name;
  }

  get farm() {
    return this._farm;
  }

  get age() {
    return this._age;
  }

}
