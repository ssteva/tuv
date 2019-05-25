import { Entity, resource, association, type } from 'aurelia-orm';
import {ensure} from 'aurelia-validation';

@resource('obim')
export class ObimEntity extends Entity {
  //@ensure(it => it.isNotEmpty().hasLengthBetween(3, 20))
  id = 0;

  sifra = "";
  naziv = "";
  primarna = null;
  sekundarna = null;
  tercijarna = null;
}


