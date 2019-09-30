import { Entity, resource, association, type } from 'aurelia-orm';
import { ensure } from 'aurelia-validation';

@resource('finansije')
export class FinansijeEntity extends Entity {
    //@ensure(it => it.isNotEmpty().hasLengthBetween(3, 20))
    id = 0;

    valuta = "RSD";
    

}


