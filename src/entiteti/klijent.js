import { Entity, resource } from 'aurelia-orm';
//import {ensure} from 'aurelia-validation';

@resource('klijent')
export class KlijentEntity extends Entity {
  //@ensure(it => it.isNotEmpty().hasLengthBetween(3, 20))
  id = 0;

  naziv = "Proba";
  pib = "";
  adresa = "";
  mesto = "";
  drzava = "";
  kontakti = [];
}


