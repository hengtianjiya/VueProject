Vue.component('Greeting', {
	template: '<input type="text" v-model="text"/>'+
	'<div>{{text}}</div>'
	,
	props: [
		'text'
	]
})
var Index = Vue.extend({
	template : '<div>'+
		'<Greeting :text="greeting"></Greeting>'+
	'</div>',
	data: function(){
		return {
		    greeting: ''
		}
	},
	route: {
		activate : function (transition) {
			transition.next();
		},
		data : function(transition){
			setTimeout(function(){
				transition.next({
					greeting: 'hello world!'
				})
			},100)
		},
		deactivate : function (transition) {
			transition.next();
		}
	}
})

//vue filter
//vue router
var router = new VueRouter({
    hashbang: true,
    history: false,
    saveScrollPosition: true,
    transitionOnLoad: true
})
router.map({
	'/':{      
		name:'index',
		component: Index,
		auth: false
	}
})

var App = Vue.extend({});
router.start(App, '#app');

