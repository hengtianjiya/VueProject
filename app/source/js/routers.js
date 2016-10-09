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
