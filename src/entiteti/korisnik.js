import { Entity, resource, association, type } from 'aurelia-orm';
import {ensure} from 'aurelia-validation';

@resource('korisnik')
export class KorisnikEntity extends Entity {
  //@ensure(it => it.isNotEmpty().hasLengthBetween(3, 20))
  id = 0;

  korisnickoIme = "";
  ime = "";
  prezime = "";
  email = "";
  uloga = "";

}


