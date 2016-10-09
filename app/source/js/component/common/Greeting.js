Vue.component('Greeting', {
	template: '<input type="text" v-model="text"/>'+
	'<div>{{text}}</div>'
	,
	props: [
		'text'
	]
})