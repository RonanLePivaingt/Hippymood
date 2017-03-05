// Mood list component
var data = {
    moods: []
};

Vue.component('mood-list', {
    props: ['moods'],
    template: '<div><template v-for="mood in moods"><button @click="play" :id="mood.id">{{ mood.name }}</button></template></div>',
    methods: {
        play: function(el) {
            console.log("Mood de l'id : " + el.target.id);
        }
    }
})

// Vue instance
var vm = new Vue({
    el: '#app',
    data: {
        message: 'Yop',
        link: 'http://jaimeleschips.fr',
        success: true,
        moods: []
    },
    methods: {
        close: function() {
            this.success = false
        }    
    },
    created: function() {
        console.log("The vue is created");
        this.$http.get('/moods').then(response => {
            // get body data
            console.log("Lets get a drink !");
            this.moods = response.body;

        }, response => {
            console.log("Shit it the fan !");
        });
    }
});
