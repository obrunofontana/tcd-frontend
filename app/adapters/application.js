import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import { inject as service } from '@ember/service';

export default DS.RESTAdapter.extend(DataAdapterMixin, {
    host: 'http://localhost:3000',    
    session: service(),

    authorize(xhr) {
        const token = this.get('session.data.authenticated.token');
        console.log(token);
        if (token) {
            console.log('bateu aque')
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
    }
});