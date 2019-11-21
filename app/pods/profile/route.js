import Route from '@ember/routing/route';

export default Route.extend({
    ajax: Ember.inject.service(),

    brands: [],
    response: [],

    model() {
        return this.get('ajax').request('/brands')
            .then(data => {
                if (data.brands.length > 0) {
                    return data.brands;
                } else {
                    return this.getMarcas()
                        .then((data) => {
                            this.saveMarca(data);
                            return data;
                        })
                        .catch((e) => {
                            console.error(e);
                        });
                }

            })
            .catch((e) => {
                console.error(e);
            });
    },
    getMarcas() {
        return this.get('ajax').request('http://fipeapi.appspot.com/api/1/carros/marcas.json');
    },

    saveMarca(brands) {

        var auxLet = this;
        brands.forEach(brand => {

            //Objeto convertido em string
            let objBrand = JSON.stringify({
                key: brand.id,
                name: brand.name,
                fipeName: brand.fipe_name,
                order: brand.order
            });

            //console.log();
            auxLet.get('ajax').request('/brands', {
                method: 'POST',
                data: objBrand,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            })
                .then(data => {
                    return data;
                })
                .catch((e) => {
                    console.error(e);
                });

        });
    },

});



