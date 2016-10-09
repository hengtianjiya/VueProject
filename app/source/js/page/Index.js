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
