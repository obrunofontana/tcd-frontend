import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';


export default Route.extend({
    session: service(),
    ajax: service(),

    model() {

        if (this.session.isAuthenticated) {

            let user = this.get('session.data.authenticated.user');
            let emailaux = this.get('session.data.authenticated.email');
            let zip = "";

            this.get('ajax').request('/users/email/' + emailaux)
                .then((result) => {
                    zip = result.zipCode
                })
                .catch((e) => {
                    console.error(e);
                });


            if (zip.length > 0) {
                this.transitionTo('home');

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
                user.name = user.name.toLowerCase().replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });

                //console.log(user);
                return user


            } else {
                this.transitionTo('welcome');
            }
        }

    }
});
