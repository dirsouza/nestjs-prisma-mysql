import { EException } from '../enum';

export class Exception extends Error {
  name: EException;

  constructor(name: EException, message: string) {
    super(message);
    this.name = name;
  }
}
