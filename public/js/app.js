var vm = new Vue({
    el: '#app',
    data: {
        message: 'Yop',
        link: 'http://jaimeleschips.fr',
        success: true
    },
    methods: {
        close: function() {
            this.success = false
        }
    }
});
