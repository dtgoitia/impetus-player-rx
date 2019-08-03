import { ReplaySubject } from "rxjs";

class Errors {
  constructor() {
    this._errors = new ReplaySubject();
  }

  errors() {
    return this._errors.asObservable();
  }

  push(error) {
    this._errors.next(error);
  }
}

const errors = new Errors();

export default errors;
