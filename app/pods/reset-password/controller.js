import Controller from '@ember/controller';



export default Controller.extend({

    actions: {
        rotaLogin() {
            this.transitionToRoute('login');
        }
    }

});
