import { Entity, resource, association, type } from 'aurelia-orm';
import {ensure} from 'aurelia-validation';

@resource('kontakt')
export class KontaktEntity extends Entity {
  //@ensure(it => it.isNotEmpty().hasLengthBetween(3, 20))
  id = 0;

  ime = "";
  oblast = "";
  telefon = "";
  email = "";  
  klijent = null;
}


