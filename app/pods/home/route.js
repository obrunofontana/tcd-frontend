import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { observer } from '@ember/object';


export default Route.extend({
    session: service(),
    ajax: service(),
    zip: false,
    info: null,

    transitionHomeSelected: observer('zip', function () {

        if (!this.get('zip')) {

       

     
            this.transitionTo('home');

        } else {
            this.transitionTo('welcome');
        }

    }),

    model() {

             

        if (this.session.isAuthenticated) {

            let user = this.get('session.data.authenticated.user');
            let emailaux = this.get('session.data.authenticated.user.email');

           // console.log('usuario rota home' , user);


            let lThis = this;

            this.get('ajax').request('/users/email/' + emailaux)
                .then((result) => {
                    let aux = isEmpty(result.result.zipCode);//result.result.zipCode

                    return lThis.set('zip', aux);
                })
                .catch((e) => {
                    console.error(e);
                });

            //console.log('zip antes do time out', this.get('zip'));


            /*setTimeout(function () {

                console.log('zip code', lThis.get('zip'))

                if (!lThis.get('zip')) {

                    lThis.transitionTo('home');

                } else {
                    lThis.transitionTo('welcome');
                }

            }, 450);*/


            /*  
           Primeiro converter a palavra toda em lower case, depois atraves de uma expressao regular obter a 
           primeira letra e todas as letras que se seguem a um espaço em branco, 
           substituindo esta pela respectiva em letra maiuscula.
 
           A expressão regular:
 
           ?: - Faz com que a expressão entre parentesis não seja memorizada
           ^ - Faz o match à primeira letra da string
           | - Operador "ou"
           \s - Faz a um espaço em branco
           \S - Faz match a um caracter que não seja espaço em branco
       */
            /*user.name = user.name.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
                return a.toUpperCase();
            });*/

            this.set('info', user.vehicles);

            return user
        }
    },

    beforeModel() {
        //Mandar autenticar novamente
        let controllerLogin = this.controllerFor('login');

        //controllerLogin.send('authenticate');
        //console.log(controllerLogin);
    }
});
