import Route from '@ember/routing/route';

export default Route.extend({

    model() {
        return {
            welcomeTitle: "Seja Bem Vindo!",
            welcomeContent: "Agradecemos por ter você aqui, estamos aqui para ajudar você encontrar um parceiro para dividir as despesas de locomoção no dia a dia e também ajudar o trânsito da cidade diminuindo o volume de carros em circulação!",
            welcomePropos: "A Proposta da Rodizcar é realizar o controle de rodizio de carros do seu grupo, seja de amigos ou de outros Rodizer's! Para você que possui um carro seleciona a opção POSSUO MEU CARRO, para você que não tem seu carro não se desespere, selecione a opção DIVIDIR DESPESAS e encontre pessoas que queiram dividir as despesas, tais como gasolina, reparos etc. Mais uma vez Seja Bem Vindo!"
        }
    }
});
