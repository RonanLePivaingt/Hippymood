// Mood list component
var data = {
    moods: [],
    current: {}
};

Vue.component('mood-list', {
    props: ['moods'],
    template: '<div><template v-for="mood in moods"><button @click="play" :id="mood.id">{{ mood.name }}</button></template></div>',
    methods: {
        play: function(el) {
            console.log("Mood de l'id : " + el.target.id);
            vm.playGenre(el.target.id);
        }
    }
})

// HTML5 audio player component
Vue.component('player-html5', {
    props: ['current'],
    template: '<div><audio id="playerHTML5" autoplay="autoplay" :src="current.path"></audio><p>{{ current.path }}</p></div>',
    methods: {
        play: function(el) {
            console.log("Mood de l'id : " + el.target.id);
            vm.playGenre(el.target.id);
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
        moods: [],
        current: {},
        infos: {}
    },
    methods: {
        close: function() {
            this.success = false
        },
        playGenre: function(genreId) {
            console.log("Let's go : " + genreId);
            this.$http.get('/mood/' + genreId).then(response => {
                // get body data
                console.log(response.body);
                if (response.body.songs)
                    this.current = response.body.songs[0];
                this.infos = response.body.infos;
            }, response => {
                console.log("Shit it the fan !");
            });
        },
        resetSession: function() {
            this.$http.get('/admin/resetSession').then(response => {
                console.log("Session successfully reseted");
            }, response => {
                console.log("Shit it the fan !");
            });

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
