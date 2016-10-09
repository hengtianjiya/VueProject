function checkLogin(transition,route,success,error){
	if (transition.to.auth && !getCookie('company_pc_token')) {
		transition.redirect({ name: 'login',query : {redirect : transition.to.path}});
		location.reload();
	}else{
		transition.next();
	}
}
//有验证
function aJax(url,type,ready,param,success,error){
	var toast = new Pop();
	var tmpobj = {
		Company : {
			Info : {
				step : null
			},
			Message : {
				list : null
			}
		}
	};

	var p = $.extend(true,param,tmpobj);
    $('.loading-wrap').show();
    $.ajax({
        url: url,
        type: type,
        data: p,
        dataType: 'json',
        success: function(data) {
        	var errcode = data['Company_Info_step']['errcode'],
				message = data['Company_Info_step']['message'],
				_data = data['Company_Info_step']['data'],
				list = data['Company_Message_list']['data'];
			var obj = {};
			if (_data > 0) {
				obj['status'] = 0;
				obj['step'] = _data;
				if (location.hash.indexOf('/company/index') > -1 && !ready) {
					switch (_data){
						case 4:
							location.hash = '/company/index/3';
							break;
						case 5:
							location.hash = '/company/index/1';
							break;
						default:
							location.hash = '/company/index/' + _data;
							break;
					}
				};
			}else{
				obj['status'] = 1;
				obj['step'] = _data;
				if (location.hash.indexOf('/company/index') > -1 && !ready) {
					location.hash = '/company/index/3';
				};
			}
            $('.loading-wrap').hide();
            success && success(data,obj,list);
        },
        error: function(xhr, type) {
            $('.loading-wrap').hide();
            toast.init('Toast',{msg : '网络不给力，请刷新后重试~' , type : 'error' ,duration : 5000});
            error && error(xhr, type);
        }
    });
}
//没验证
function aJax2(url,type,param,success,error,load){
	var toast = new Pop();
	if (load != 0) {
    	$('.loading-wrap').show();
	};
    $.ajax({
        url: url,
        type: type,
        data: param,
        dataType: 'json',
        success: function(data) {
            $('.loading-wrap').hide();
            success && success(data);
        },
        error: function(xhr, type) {
            $('.loading-wrap').hide();
            toast.init('Toast',{msg : '网络不给力，请刷新后重试~' , type : 'error' ,duration : 5000});
            error && error(xhr, type);
        }
    });
}
function socketConnect(url,uid,msgfun,updatefun){
	var socket = io(url,{'multiplex': false});
    socket.on('connect', function(){
    	console.log(uid)
        socket.emit('login', uid);
    });
    // 后端推送来消息时
    socket.on('new_msg', function(msg){
        msgfun && msgfun(msg);
    });
    // 后端推送来在线数据时
    socket.on('update_online_count', function(online_stat){
        updatefun && updatefun(online_stat);
    });
}
function escape2Html(str) {
	var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
	return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
}
function getUserData(){
    if (getCookie('company_pc_token')) {
        return JSON.parse(getCookie('company_pc_userdata'));
    }else{
        return getCookie('company_pc_token');
    }
}
function routerUrl(route,query,type){
	var query = query,
		q = route.query,
		qr = q;
	if (type == 'del') {
		for (var k in query) {
			delete qr[k];
		};
	}else{
		qr = $.extend(true,q,query);
	}
	route.router.go({name : route.name , query : qr})
}
function changeStatus(env,route,e,tar){
	var val = $(e.target).val();
	var _this = env;
	var q = {};
	if(val == -1) {
		_this[tar] = null;
		q[tar] = _this[tar];
		routerUrl(route,q,'del');
	}else{
		_this[tar] = val;
		q[tar] = _this[tar];
		q['page'] = 1;
		routerUrl(route,q,'add');
	}
}
function checkCode(code,route){
    if (code == 110) {
    	delCookie('company_pc_token');
    	route.router.go({name : 'login',query : {redirect : route.path}});
    	location.reload();
    };
}
function countDown(e){
	var _this = this;
	clearTimeout(t);
	var t = setTimeout(function(){
		var text = e.text();
		var num = text.match(/\d+(\.\d+)?/g);
		var n;
		if (num != 0) {
			n = num-1;
			e.text(text.replace(/\d+(\.\d+)?/g,n));
			_this.countDown(e);
		}else{
			e.text(e.data('text'));
			e.prop('disabled',false);
		}
	},1000);
}
function getResumeStatus(value){
	var t;
	switch (value)
    {
        case 0:
            t = '新简历';
            break;
        case 1:
            t = '新简历';
            break;
        case 2:
            t = '未接通';
            break;
        case 3:
            t = '已发送面试邀请';
            break;
        case 5:
            t = '已发送入职信息';
            break;
        case 7:
            t = '已发送体检信息';
            break;
        case 9:
            t = '已录用';
            break;
        case 11:
            t = '放弃入职';
            break;
        case 12:
            t = '不匹配';
            break;
    }
    return t;
}
function checkResume(tabAct,notice,message,remark){
	if (!tabAct.length) {
		notice.text('请选择沟通结果');
		return false;
	};
	if (!message) {
		notice.text('请填写沟通结果');
		return false;
	};
	if (!remark) {
		notice.text('请填写沟通备注');
		return false;
	};
	notice.text('');
	return true;
}
function getFormatContent(items){
	for (var i = 0; i < items.length; i++) {
		$(items[i]).val($(items[i]).data('text'));
	};
}

function getResumeTarget(status){
	var config = {
		'new' : [0,1],
		'process' : [2,3,5,7],
		'finish' : [9,11,12]
	}
	for (var k in config) {
		if ($.inArray(status, config[k]) > -1) {
			return k;
		};
	};
}
function getLocalResumeStatus(status){
	var tmpArr;
	if (!localStorage['resumeStatus'] || !localStorage['resumeStatus'].length) {
		tmpArr = [];
		tmpArr.push(status);
	}else{
		tmpArr = JSON.parse(localStorage['resumeStatus']);
		var idx = $.inArray(status,tmpArr);
		if (idx == -1) {
			tmpArr.push(status);
		}
	}
	localStorage['resumeStatus'] = JSON.stringify(tmpArr);
}
function removeLocalResumeStatus(status){
	var tmpArr;
	if (localStorage['resumeStatus']) {
		tmpArr = JSON.parse(localStorage['resumeStatus']);
		var idx = $.inArray(status,tmpArr);
		if (idx > -1) {
			tmpArr.splice(idx,1);
			if (tmpArr.length) {
				localStorage['resumeStatus'] = JSON.stringify(tmpArr);
			}else{
				localStorage.removeItem("resumeStatus");
			}
		}
	}
}
Vue.filter('getresumestatus',function(value){
	var cls = '',
		tmpArr;
	if (localStorage['resumeStatus']) {
		tmpArr = JSON.parse(localStorage['resumeStatus']);
		if ($.inArray(value,tmpArr) > -1) {
			cls = 'active';
		}
	}
	return cls;
})
Vue.filter('getmessage',function(value){
	var j = 0;
	for (var i = 0; i < value.length; i++) {
		if (value[i]['status'] == 0) {
			j += 1;
		};
	};
	return j;
})
Vue.filter('resumestatus',function(value){
    return getResumeStatus(value);
})
Vue.filter('floor',function(value){
	return getfloor(value);
})
Vue.filter('dateFormat',function(value){
	if (value) {
		return dateFormat('%Y-%M-%D', value);
	}else{
		return '';
	}
})
Vue.filter('dateFormat2',function(value){
	if (value) {
		return dateFormat('%Y年%M月%D日 %H:%I', value);
	}else{
		return '';
	}
})
Vue.filter('dateFormat3',function(value){
	if (value) {
		return dateFormat('%H:%I', value);
	}else{
		return '';
	}
})
Vue.filter('dateFormat4',function(value){
	if (value) {
		return dateFormat('%Y年%M月%D日', value);
	}else{
		return '';
	}
})
Vue.filter('testCatalog',function(cur,tar){
	if ($.inArray(cur.toString(),tar) > -1) {
		return true;
	}else{
		return false;
	}
})
Vue.filter('getselect',function(value,tar){
	var c = $.inArray(value,tar);
	if (c > -1) {
		return true;
	}else{
		return false;
	}
})
Vue.filter('getdeselect',function(value,tar){
	var c = $.inArray(value,tar);
	if (c > -1) {
		return false;
	}else{
		return true;
	}
})
Vue.filter('classCatalog',function(value){
	return 'cata-'+value.length;
})
Vue.filter('getprice',function(value){
	if (value) {
		return value/100;
	}else{
		return '';
	}
})

function time_run(id,time) {  
	var now_time = new Date();
	var end_time = new Date(time);
	if(now_time < end_time){

		var t = end_time.getTime() - now_time.getTime();

		var d = Math.floor(t/1000/60/60/24);
		var h = Math.floor(t/1000/60/60%24);
		var m = Math.floor(t/1000/60%60);
		var s = Math.floor(t/1000%60);
		// var ms = Math.floor(t/100%10);

		d = d >= 10 ? d : '0' + d;
		h = h >= 10 ? h : '0' + h;
		m = m >= 10 ? m : '0' + m;
		s = s >= 10 ? s : '0' + s;
		// ms = '0' + ms;

		id.html(d +'天' + h + '小时'+m+'分'+s+'秒')
	}else{
		var _record = id.attr('data-record');
		if (_record == 0) {
			id.html('已过期');
			_record++;
			id.attr('data-record',_record);
		};
	}
}