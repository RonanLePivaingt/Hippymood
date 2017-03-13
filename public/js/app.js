// Mood list component
var data = {
    moods: [],
    current: {}
};

Vue.component('mood-list', {
    props: ['mood', 'currentmood'],
    template: '<button @click="play" :id="mood.id" class="mdc-button" :class="isActive">{{ mood.name }}</button>',
    methods: {
        play: function(el) {
            vm.playGenre(el.target.id);
        }
    },
    computed: {
        isActive: function() {
            // Return the CSS classes to apply to the current mood button
            return this.currentmood == this.mood.id ? 'mdc-button--accent mdc-button--raised' : '';
        }
    }

})

// HTML5 audio player component
Vue.component('player-html5', {
    props: ['current'],
    template: '<div><audio id="playerHTML5" autoplay="autoplay" :src="current.path"></audio><p>{{ current.path }}</p></div>',
    methods: {
        play: function(el) {
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
        playGenre: function(genreId) {
            this.$http.get('/mood/' + genreId).then(response => {
                // get body data
                if (response.body.songs)
                    this.current = response.body.songs[0];
                this.infos = response.body.infos;
            }, response => {
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
    computed: {
        currentmood: function() {
            return this.current.genreId;
        }
    },
    created: function() {
        console.log("The vue is created");
        this.$http.get('/moods').then(response => {
            // get body data
            this.moods = response.body;

        }, response => {
            console.log("Shit it the fan !");
        });
    }
});
