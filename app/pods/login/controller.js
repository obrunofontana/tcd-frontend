import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Controller.extend({
    session: service(),
    ajax: service(),
    messageError: null,
    idTemp: "",

    actions: {
        //Autenticação com API desenvolvida e que está rodando na porta 3000;
        async authenticate() {

            let { email, password } = this.getProperties('email', 'password');

            try {
                await this.session.authenticate('authenticator:token', { email, password });
            } catch (error) {
                this.set('errorMessage', error.error || error); //Mensagem apenas para dev...

                // console.log(this.get('errorMessage'));
                let lThis = this;

                let intervalo = setInterval(function () {
                    lThis.set('messageError', 'Usuário ou senha inválido'); //Utilizar este aqui por questões de segurança             
                }, 100);
                setTimeout(function () {
                    clearInterval(intervalo);
                    lThis.set('messageError', '');
                }, 5000);
            }

            if (this.session.isAuthenticated) {
                //Se autenticar, faço verificação se o usuário já possui um veiculo
                let currentUser = this.get('session.data.authenticated.user');              

                let vehicle = currentUser.vehicles == {} ? false : true; 

                if (vehicle) {   
                    this.transitionToRoute('home');                
                } else {                    
                    this.transitionToRoute('welcome');
                }
            }
        },
        //Registra um novo usuário
        async register() {

            //objeto user que será registrado
            let user = this.store.createRecord('user', {
                email: this.get('emailLogin'),
                password: this.get('passwordLogin'),
                name: this.get('name'),
                photo: "images/userDefault.svg",
                zipCode: "",
                state: "",
                city: "",
                address: "",
                destinationAddress: {},
                vehicles: {}
            });

            //Defino o email e senha se arequisição do post for bem sucedida chamo authenticação novamente;
            this.set('email', user.email);
            this.set('password', user.password);

            let lThis = this;


            user.save()
                .then(result => {

                    //Realizo a autenticação se ocorrer tudo certo com o cadastro do novo usuário
                    lThis.send('authenticate');

                })
                .catch(error => {
                    console.log('[ERROR]: ', error);
                });
        }
    }
});
