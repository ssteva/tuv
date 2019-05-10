import {inject} from 'aurelia-framework';
import {EntityManager} from 'aurelia-orm';
import {AltairCommon} from 'helper/altair_admin_common';
import {delayed} from 'aurelia-kendoui-bridge/common/decorators';
import {DialogService} from 'aurelia-dialog';
import {EditGrad} from './editgrad';
import {Endpoint} from 'aurelia-api';


@inject(EntityManager, AltairCommon, DialogService, Endpoint.of())
export class Grad {
    
    //gradovi =[];
    pageable = {
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
        pageSizes: true,
        buttonCount: 5
    };
    filterobj = {
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
            }
        }
    };

    constructor(em, ac, dialogService, lokalep){
        this.em = em;
        this.ac = ac;
        this.lokalep = lokalep;
        this.dialogService = dialogService;
        this.repoGrad = em.getRepository('mesto');
        //this.rest = rest;
        this.datasource = new kendo.data.DataSource({
            pageSize: 10,
            batch: false,
            //type: "aspnetmvc-ajax",
            //type: "odata",
            //data: this.gradovi,
            transport: {
                //read: (options) => {
                //    this.repoGrad.find()
                //        .then(result => {
                //            options.success(result);
                //        })
                //        .error(err => {
                //            toastr.error(err.statusText);           
                //        });
                    
                //},
                read: (o)=> {
                    //console.log(o);
                    this.lokalep.post('Mesto/PregledGrid', o.data)
                    //this.rest.request('POST', 'grad/PregledGrid', o.data)
                        .then(result => {
                            o.success(result);
                        })
                        .catch(err => {
                            console.log(err.statusText);
                        });
                    //this.rest.request('POST', 'api/grad', o.data)
                    //   .then(console.log)
                    //   .catch(console.error);
                    //this.repoGrad.find(o.data,{})
                    //    .then(result => {
                    //        o.success(result);
                    //    })
                    //    .catch(err => {
                    //        console.log(err.statusText);
                    //    });
                },
          
                //read : {
                //    //url: "api/Grad",
                //    url: "api/Grad",
                //    dataType: "json",
                //    type: "GET",
                //    accept: "application/json",
                //    contentType: "application/json; charset=utf-8",
                //    //beforeSend: (xhr) =>
                //    //{
                //    //    if(localStorage.)
                //    //    var auth = "Bearer " + token;
                //    //    xhr.setRequestHeader("Authorization", auth);
                //    //}
                //    //success:  function(result) {
                //    //    toastr.success("Uspešno snimljeno u bazu");
                //    //},
                //    //error:  function(result)  {
                //    //    toastr.error(result);
                //    //}
                //},
                update: {
                    url: "api/Grad",
                    dataType: "json",
                    type: "PUT",
                    accept: "application/json",
                    contentType: "application/json; charset=utf-8",
                    data: (model)=>{ 
                        return model;
                    }, // the "data" field contains paging, sorting, filtering and grouping data
                    success:  function(result) {
                        toastr.success("Uspešno snimljeno u bazu");
                    },
                    error:  function(result)  {
                        toastr.error(result.statusText);
                    }
                },
                destroy: {
                    url: "api/Grad",
                    dataType: "json",
                    type: "DELETE",
                    accept: "application/json",
                    contentType: "application/json; charset=utf-8"
                },
                parameterMap: function (model, operation) {
                    if (operation == "read") {
                        //return  model ;
                        //if (model.filter) {
                        //    model.filter.filters[0]["operater"] = model.filter.filters[0]["operator"];
                        //    delete model.filter.filters[0]["operator"];
                        //}
                        //return kendo.stringify(model);
                        //return model;
                    }
                }
                //update: (options) => {
                //    var data = options.data;
                //    options.success([data]);
                //    // Copy data back to dataList
                //    //dataList = dataSource.data().slice();
                //}
            },
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            schema: {
                data: "data",
                total: "total",
                model: {
                    id: "id",
                    fields: {
                        ptt: { type: 'string' },
                        naziv: { type: 'string' },
                    }
                }
            }
            //schema: {
            //    model: {
            //        id: "id",
            //        fields: {
            //            mesto: { type: 'string' },
            //            ptt: { type: 'string' },
            //            okrug: { type: 'string' },
            //            opstina: { type: 'string' }
            //        }
            //    }
            //}
        });
    }
    @delayed
    attached() {
        this.ac.altair_md.init();
        //this.repoGrad.find()
        //    .then(result => {
        //        this.gradovi = result;
        //        this.datasource.data(result);
        //    })
        //    .error(err => {
        //        toastr.error(err.statusText);           
        //    });
    }
    edit(obj) {
        //toastr.success("!");
        this.dialogService.open({ viewModel: EditGrad, model: obj })
            .then(result => {
                if (!result.wasCanceled) {
                    this.datasource.read();
                    //this.grid.refresh();
                }
            });
    }
    noviGrad() {
        this.dialogService.open({ viewModel: EditGrad, model: null })
    .then(result => {
        if (!result.wasCanceled) {
            this.datasource.read();
            //this.grid.refresh();
        }
    });
        //this.grid.dataSource.data(this.gradovi);
        //this.grid.dataSource.read();
        //toastr.success(this.datasource.hasChanges());
        //this.grid.refresh();

        //this.gradovi[0].mesto = "Ada2";
        //this.gradovi[0].update()
        //    .then(result => {
        //        console.log(1);
        //        this.grid.dataSource.data(this.gradovi);
        //    })
        //    .error(err => {
        //        toastr.error(err.statusText);           
        //    });
        
        //$(".k-link.k-pager-nav").bind('click', function(e) {
        //    console.log(1);
        //});
    }

    activate() {
       


        //return this.repoGrad.find()
        //    .then(result => {
        //        this.gradovi = result;   
        //        //toastr.success("1233");
        //        this.dataSource =  {
        //            transport: {
        //                read: "api/Grad/Get"
        //            }
        //            //pageSize: 10,
        //            //serverPaging: true
        //        }

        //    })
        //    .error(err => {
        //        toastr.error(err);           
        //    });
    }
}
