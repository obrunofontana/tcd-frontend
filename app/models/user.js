import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
    name: DS.attr('string'),
    email: DS.attr('string'),  
    password: DS.attr('string'),
    photo: DS.attr('string'),
    zipCode: DS.attr('string'),
    state: DS.attr('string'),
    city: DS.attr('string'),
    address: DS.attr('string'),
    destinationAddress: DS.attr(),
    vehicles: DS.attr()
});
