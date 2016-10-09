var router = new VueRouter({
    hashbang: true,
    history: false,
    saveScrollPosition: true,
    transitionOnLoad: true
})
var debug = false;
var api = '/api/';
if (debug) {
	var Ssocket = 'http://192.168.0.163:2120';
}else{
	var Ssocket = 'http://120.27.94.49:2120';
}
console.log(Ssocket)
router.map({
	'/':{       //登录页面
		name:'login',
		component: Login,
		auth: false
	},
	'/login/':{  //登录页面
		name:'login',
		component: Login,
		auth: false
	},
	'/register/':{  //注册页面
		name:'register',
		component: Register,
		auth: false
	},
	'/forgetpass/':{  //忘记密码
		name:'forgetpass',
		component: Forgetpass,
		auth: false
	},
	'/company/index/:step/':{//企业管理
		name:'home',
		component: Home,
		auth: true
	},
	'/company/package/buy/':{//购买套餐
		name:'packagebuy',
		component: Packagebuy,
		auth: true
	},
	'/company/package/record/':{//购买记录
		name:'packagerecord',
		component: Packagerecord,
		auth: true
	},
	'/company/package/invoice/':{//开票信息
		name:'packageinvoice',
		component: Packageinvoice,
		auth: true
	},
	'/job/add/':{//发布新职位
		name:'jobadd',
		component: Jobadd,
		auth: true
	},
	'/job/edit/:jobid':{//编辑职位
		name:'jobedit',
		component: Jobedit,
		auth: true
	},
	'/job/index/':{//所有职位
		name:'jobindex',
		component: Jobindex,
		auth: true
	},
	'/fair/apply/':{//预定招聘会展位
		name:'fairapply',
		component: Fairapply,
		auth: true
	},
	'/fair/index/':{//我的招聘会
		name:'fairindex',
		component: Fairindex,
		auth: true
	},
	'/fair/catalog/':{//招聘会简章
		name:'faircatalog',
		component: Faircatalog,
		auth: true
	},
	'/resume/new/':{ //新简历
		name:'resumenew',
		component: Resumenew,
		auth: true
	},
	'/resume/process/':{ //处理中的简历 
		name:'resumeprocess',
		component: Resumeprocess,
		auth: true
	},
	'/resume/finish/':{ //处理中的简历 
		name:'resumefinish',
		component: Resumefinish,
		auth: true
	},
	'/resume/all/':{ //处理中的简历 
		name:'resumeall',
		component: Resumeall,
		auth: true
	},
	'/changepass/':{ //修改密码 
		name:'changepass',
		component: Changepass,
		auth: true
	},
	'/auth/manage/':{ //修改密码 
		name:'authmanage',
		component: Authmanage,
		auth: true
	},
	'*' : {
		name:'notfound',
		component: Notfound,
		auth: false
	}
})
