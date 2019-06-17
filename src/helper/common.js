﻿import { inject } from 'aurelia-framework'
import { Endpoint } from 'aurelia-api';
import { AuthService } from 'aurelia-authentication';
//import {EntityManager} from 'aurelia-orm';
@inject(AuthService, Endpoint.of())
export class Common {
  roles = ["Direktor", "Rukovodilac", "Izvršilac", "Administrator"];
  valute = ["EUR"]; //valute za kursnu listu
  valute2 = ["RSD", "EUR"]; //valute za ponudu
  labels = this.jezik === "en" ? { 'Ok': 'Yes', 'Cancel': 'No' } : { 'Ok': 'Da', 'Cancel': 'Ne' };
  vazenje = this.jezik === "en" ? ["Dan", "Mesec"] : ["Day", "Month"];
  poreskaStopa = 20;
  constructor(authService, repo) {
    this.repo = repo;
    this.authService = authService;
    let payload = this.authService.getTokenPayload();
    if (payload) {
      this.korisnik = payload.unique_name;
      this.role = payload.role;
      this.jezik = payload.Jezik;
    }
    this.pageable = this.jezik === "en" ? {
      refresh: true,
      pageSizes: [10, 30, 50, 100, 'All'],
      buttonCount: 5
    } : {
        messages: {
          display: "{0} - {1} of {2} redova", //{0} is the index of the first record on the page, {1} - index of the last record on the page, {2} is the total amount of records
          empty: "Broj redova za prikaz",
          page: "Strana",
          of: "od {0}", //{0} is total amount of pages
          itemsPerPage: "redova po strani",
          first: "Idi na prvu stranu",
          previous: "Idi na poslednju stranu",
          next: "Idi na sledeću stranu",
          last: "Idi na poslednju stranu",
          refresh: "Osveži"
        },
        refresh: true,
        pageSizes: [10, 30, 50, 100, 'All'],
        buttonCount: 5
      };

    this.filterobj = this.jezik === "sr"
      ? {
        messages: {
          info: "Prikaži podatke koji", // sets the text on top of the Filter menu
          filter: "Filter", // sets the text for the "Filter" button
          clear: "Poništi", // sets the text for the "Clear" button

          // when filtering boolean numbers
          isTrue: "custom is true", // sets the text for "isTrue" radio button
          isFalse: "custom is false", // sets the text for "isFalse" radio button

          //changes the text of the "And" and "Or" of the Filter menu
          and: "CustomAnd",
          or: "CustomOr"
        },
        extra: false,
        operators: {
          string: {
            contains: "Sadrže"
          },
          number: {
            eq: "je jednak",
            gt: "veći od",
            lt: "manji od"
          }
        }
      }
      : true;
  }
  activate() {
    this.dc.dajPoreskuStopu()
    then(res => {
      this.poreskaStopa = res;
    })
  }

  filterMenu(e) {
    //e.sender.dataSource.options.schema.model.fields[e.field].type == "date"
    if (e.field.includes("datum")) {
      let beginOperator = e.container.find("[data-role=dropdownlist]:eq(0)").data("kendoDropDownList");
      beginOperator.value("gte");
      beginOperator.trigger("change");

      let endOperator = e.container.find("[data-role=dropdownlist]:eq(2)").data("kendoDropDownList");
      endOperator.value("lte");
      endOperator.trigger("change");

      e.container.find(".k-dropdown").hide();
    }
  };
  datumDokumentaFilter =
    {
      extra: true,
      messages: {
        info: "Period od - do" // sets the text on top of the Filter menu
      },
      ui: (element) => {
        element.kendoDatePicker({
          format: "dd.MM.yyyy"
        });
      }
    };


}
