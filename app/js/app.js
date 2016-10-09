/*
   *  添加
   *  @param option => {
   		items => ele
   		item  => ele String
   		addCtl  => ele
   		delItem =>ele String
   		afterAdd => 添加完成后执行的回调
   		afterRemove => 移除完成后执行的回调
   	}
*/
var AddItem = function(){
	this.config = {
		beforeAdd : function(){ return true;},
		afterAdd : function(){},
		beforeRemove : function(){return true;},
		afterRemove : function(){}
	}
}
AddItem.prototype = {
	init : function(option){
		this.config = $.extend(true,this.config,option);
		this.$addCtl = this.config.addCtl;
		this.$wrap = this.config.items;
		this.item = this.config.item;
		this.del = this.config.delItem;
		this.$copy = $(this.$wrap.find(this.item)[0]);
		this.$html = this.$copy.clone();
		this.$h = this.$html[0].outerHTML;
		this.eventHandler();
	},
	eventHandler : function(){
		var _this = this;
		_this.$addCtl.on('click',function(){
			_this.addItem();
		})
		_this.$wrap.on('click',_this.del,function(){
			_this.removeItem($(this));
		})
	},
	addItem : function(){
		var _this = this;
		if (_this.config.beforeAdd()) {
			$(_this.$h).appendTo(_this.$wrap);
			_this.$wrap.find(_this.del).show();
			_this.$wrap.find(_this.del).eq(0).hide();
		};
		_this.config.afterAdd();
	},
	removeItem : function(ele){
		var _this = this;
		if (_this.config.beforeRemove(ele.closest(_this.item))) {
			ele.closest(_this.item).remove();
		}
		this.config.afterRemove(ele.closest(_this.item));
	}

}
/*
   *  调整简章
   *  @param option => {
   		wrap => wrap ele
   		order => order ele
   		item => moveable ele String
   		afterMove = function 移动完成后执行的方法
   	}
*/

var Catalog = function(){
	this.config = {
		afterMove : function(){}
	}
}
Catalog.prototype = {
	init : function(option){
		this.config = $.extend(true,this.config,option);
		this.$wrap = this.config.wrap;
		this.$wrap.Width = this.$wrap.width();
		this.$wrap.Height = this.$wrap.height();
		this.$wrap.Left = this.$wrap[0].offsetLeft;
		this.orderShow = this.config.order;
		if (!this.orderShow.length) return false;
		this.item = this.config.item;
		this.eventHandler();
	},
	eventHandler : function(){
		var _this = this;
		_this.$ele = null;
		_this.$wrap.on('mousedown',_this.item,function(e){
			_this.ele = e.currentTarget;
			_this.$ele = $(e.currentTarget);
			_this.Top = _this.ele.offsetTop;
			_this.Left = _this.ele.offsetLeft;
			_this.Width = _this.ele.offsetWidth;
			_this.Height = _this.ele.offsetHeight;
			_this.lastY = e.originalEvent.clientY;
			_this.order = _this.orderShow.val().length ? _this.orderShow.val().split(',') : [];
			_this.moveAble();
		})
		_this.$wrap.on('mouseup',_this.item,function(e){
			if (!_this.testEle()) return false;
			if (isNaN(_this.finalTop)) return false;
			var idx = _this.$wrap.find(_this.item).index(_this.$ele);
			var num = Math.floor(_this.finalTop / _this.Height);
			if (num < 0) return false;
			var tmp = parseInt(_this.order.splice(idx,1).toString());
			_this.order.splice(num,0,tmp);
			_this.orderShow.val(_this.order);
			if (num!=0) {
				_this.$ele.insertAfter(_this.$wrap.find(_this.item)[num]);
			}else{
				_this.$ele.insertBefore(_this.$wrap.find(_this.item)[num]);
			}
			_this.moveDisble();
		})
		_this.$wrap.on('mousemove',function(e){
			if (!_this.testEle()) return false;
			_this.finalTop = _this.Top + e.originalEvent.clientY - _this.lastY;
			if (_this.finalTop < 0) {
				_this.finalTop = 0;
				$(_this.item).trigger('mouseup');
				return false;
			};
			_this.$ele.css('top', _this.finalTop+'px');
		})
		_this.$wrap.on('mouseleave',function(e){
			if (!_this.testEle()) return false;
			$(_this.item).trigger('mouseup');
		})
	},
	testEle :function(){
		return this.$ele !== null ? true : false;
	},
	moveAble : function(){
		var _this = this;
		_this.$ele.css({
			'position':'absolute',
			'opacity' : 0.5
		});
		_this.$ele.addClass('moveable');
	},
	moveDisble : function(){
		var _this = this;
		if (!_this.testEle()) return false;
		_this.$ele.css({
			'position':'static',
			'opacity' : 1,
			'top' : ''
		});
		_this.$ele.removeClass('moveable');
		_this.$ele = null;
		_this.config.afterMove();
	}
}
/*
   *  选择座位组建
   *  @param option => {
   		column => number 列
   		row => number 行
   		floor => number 楼层
   		clickEnable => boolean 是否可点击
   	}
*/
function choseSeat(){
  	this.option = {
  		column : 26,
  		row : 14,
  		floor : 1,
  		clickEnable : true
  	}
}

choseSeat.prototype = {
	init : function(option){
		this.option = $.extend(true,this.option,option);
		this.getSeat();
		this.eventHandler();
	},
	eventHandler : function(){
		if (!this.option.clickEnable) return false;
		var _this = this;
		$('body').off('click',this.option.ele + ' li');
		$('body').on('click',this.option.ele + ' li',function(){
			var _event = $.Event('chosen.choseSeat')
			var _thisClass = $(this).find('div');
			var _limitEvent = $.Event('limit.choseSeat');
			if (_thisClass.hasClass('sold') || _thisClass.find('> span').length < 2 ) return false;

			var num = _thisClass.data('num');
			if ($('.chose-wrap .select').length >= num && !_thisClass.hasClass('select')) {
				//alert(_this.option.message);
				$(this).trigger(_limitEvent);
				return false;
			};

			if (_thisClass.hasClass('select')) {
				_thisClass.removeClass('select');
			}else{
				_thisClass.addClass('select');
			}
			$(this).trigger(_event);
			
		})
	},
	getSeat : function(){
		var r = this.option.row,
			c = this.option.column,
			w = 100 / c,
			_html = '';

		var _event = $.Event('shown.choseSeat');

		for ( var i = 1; i <= r; i++ ) {
			_html += '<ul>';
			for ( var j = 1; j <= c; j++ ) {
				var content = '',
					className = '',
					name = '';
				var h = this.option.data[i] ? '100%' : '';
				
				if (this.option.data[i]) {
					if (this.option.data[i][j]) {
						if (this.option.data[i][j]['direction'] == "down" || this.option.data[i][j]['direction'] == "up" || this.option.data[i][j]['direction'] == "left" || this.option.data[i][j]['direction'] == "right") {
							className += ' up';
							var data = this.addclass(this.option.floor,this.option.sale,this.option.save,i,j);
							className += data.className;
							name += data.name;
							content += '<span><span>'+this.option.data[i][j]['description']+'</span></span><span><span>'+name+'</span></span>';
							
						}else if(this.option.data[i][j]['direction'] == "col"){
							className += ' col';
							content += '<span><span>'+this.option.data[i][j]['description']+'</span></span>';
						}
					};
				};
				var _value = '';
				var _id = '';
				var _num = this.option.max_num;
				var _price = 0;
				if (this.option.data[i] && this.option.data[i][j]){
					_value = this.option.data[i][j]['value'];
					_id = this.option.data[i][j]['id'];
					if(this.option.data[i][j]['is_vip'] && name == ''){
						className += ' vip';
					}
					var _price = this.option.data[i][j]['price']/100;
				};

				_html += '<li style="width:'+w+'%;"><div data-num="'+_num+'" data-value="'+_value+'" data-id="'+_id+'" data-key="'+this.option.floor+'-'+i+'-'+j+'" class="'+className+'" data-floor="'+this.option.floor+'" style="padding-bottom:'+h+'" data-price="'+_price+'">'+content+'</div></li>';
			};
			_html += '</ul>';
		};
		$(this.option.ele).html(_html);
		$(this.option.ele).trigger(_event);
	},
	addclass : function(x,y,z,i,j){//x = this.option.floor; y = this.option.sale; z = this.option.save;
		var className = '';
		var name = '';
		if(y||z){
			if ((y && y[x]) || (z && z[x])) {
				if (y && this.isEmpty(y) && y[x][i] && y[x][i][j]) {
					className += ' sold';
					name = y[x][i][j]['name'];
				};
				if (z && this.isEmpty(z) && z[x][i] && z[x][i][j]) {
					className += ' select save';
				};
			};
		}
		return {
			className : className,
			name : name
		};
	},
	isEmpty : function(obj){
		var length = 0;
		if (obj instanceof Object) {
			for (var i in obj) {
				length += 1;
			}
		}else if(obj instanceof Array){
			length = obj.length;
		}
		return length;
	}
}
/*
   *  文件上传、
   *  @param option => {
   		ele => 触发事件的元素
		format => 上传文件的格式
		url => 上传文件的目标url
		param => 附加的param
		needCut => 是否需要裁切
		onread => 读文件时回调函数
		onloaderror => 上传时文件出错回调函数
		onprogress => 上传时回调函数
		onsuccess =>  图片上传成功时回调函数 
		oncomplete => 上传完成回调函数 
		onfailure => 上传失败回调函数 
   	}
*/

var Fileupload = function(){
	this.config = {
		format : 'jpg|jpeg|png|gif',
		max_image_size : 2 * 1024 * 1024,
		url : '',
		param : {},
		fileFilter : [],
		fileLen : 0,
		needCut : false,
		onloaderror : function(){},
		onread : function(){},
		onprogress : function(){},
		onsuccess : function(){},
		oncomplete : function(){},
		onfailure : function(){}
	};
};
Fileupload.prototype = {
	init : function(option){
		this.config = $.extend(true,this.config,option);
		this.eventHandler();
	},
	eventHandler : function(){
		var _this = this;
	    _this.config.ele.off('change');
	    _this.config.ele.on('change',function(e){
	    	_this.funGetFile(e, this);
	    });
	},
	cutImg : function(img){
		var image = $('<img src="'+img+'"/>')[0];
		var img_width = image.width,
			img_width_span = image.width,
			img_height = image.height,
			img_height_span = image.height,
			img_X = 0,
			img_Y = 0;
		if (img_width > img_height) {
			img_width_span = img_height;
			img_X = (img_width - img_width_span) / 2;
		}else{
			img_height_span = img_width;
			img_Y = (img_height - img_height_span) / 2;
		}
		var result = this.getCutImg(img_width_span,img_height_span,img_X,img_Y,image);
		return result;
	},
	getCutImg : function(img_width_span,img_height_span,img_X,img_Y,image){
		canvas_width = img_width_span;
		canvas_height = img_height_span;
		canvas = document.createElement("canvas");
		canvas.width = canvas_width;   // 生成图片的宽
		canvas.height = canvas_height; // 生成图片的高
		var cxt = canvas.getContext("2d");
		cxt.fillStyle = "#ffffff";
		cxt.fillRect(0, 0, canvas_width, canvas_height);
		cxt.drawImage(image, img_X, img_Y, img_width_span, img_height_span, 0, 0, img_width_span, img_height_span);
		var out_data = canvas.toDataURL("image/jpeg");
		return out_data;
	},
	funGetFile : function(e,ele){
		var _this = this,
			files = e.target.files,
			index = 0;
		_this.config.fileFilter = [];
		_this.config.fileFilter = _this.config.fileFilter.concat(_this.filter(files));
		_this.config.fileLen = _this.config.fileFilter.length;
		function funAppendImage(){
			var file = _this.config.fileFilter[index];
			if (file) {
				var reader = new FileReader();
				reader.onload = function(e){
					file.timeStamp = e.timeStamp;
					if (!_this.config.needCut) {
	          			file.result = e.target.result;
					}else{
						file.result = _this.cutImg(e.target.result);
					}
	          		_this.config.onread && _this.config.onread(file,ele);
	          		_this.funUploadFile(file, ele);
	          		index++;
          			funAppendImage();
				};
				reader.readAsDataURL(file);
			}
		}
		funAppendImage();
	},
	funUploadFile : function(file,ele){
		var _this = this,
			xhr = new XMLHttpRequest(),
			formData = new FormData();

		if (xhr.upload) {
			xhr.upload.addEventListener('progress',function(e){
				var progress = Math.round(e.loaded / e.total * 100);
				_this.config.onprogress && _this.config.onprogress(file,progress,ele);
			},false);

			xhr.onreadystatechange = function(e){
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						_this.config.onsuccess && _this.config.onsuccess(file,$.parseJSON(xhr.responseText),ele);
					}
					_this.config.fileLen--;
					if (_this.config.fileLen <= 0) {
						_this.config.oncomplete && _this.config.oncomplete(file,ele);
						_this.config.fileLen = [];
						ele.setAttribute('value','');
					}else{
						_this.config.onfailure && _this.config.onfailure(file,ele);
						_this.config.fileLen = [];
						ele.setAttribute('value','');
					}
				};
			};
			formData.append("file", file);
			for(var key in _this.config.param){
				formData.append(key, _this.config.param[key]);
			}

			xhr.open("GET", _this.config.url, true);
			xhr.send(formData);
		}
	},
	filter : function(files){
		var arrFiles = [];
		for (var i = 0, file; file = files[i]; i++) {
			if (this.formatRegExp(file.name)) {
				if (file.size > this.config.max_image_size) {
					this.config.onloaderror && this.config.onloaderror('您上传的文件太大了！');
				}else{
					arrFiles.push(file);
				}
			}else{
				this.config.onloaderror && this.config.onloaderror('您上传文件的格式不符合规则哦！');
			}
		}
		return arrFiles;
	},
	formatRegExp : function(filename){
		return new RegExp('\.('+ this.config.format +')$', 'i').test(filename);
	}
};

/*
	联动菜单
	option => Object
	{
		eleArr => Array  需要联动的元素数组(按层级传入)
		obj => Object  需要联动查找数据的对象
		onchange  => Function  onchange时所执行的回调
	}
*/
function Link(option){
	this.config = {
		onchange : function(){},
		onclear : function(){}
	}
}
Link.prototype = {
	init : function(option){
		this.config = $.extend(true,{},option);
		this.arr = this.config.eleArr;
		this.l = this.arr.length;  //联动层级
		if (this.l < 2) return false;
		this.obj = this.config.obj;
		this.callback = this.config.callback;
		this.eventHandler();
	},
	eventHandler : function(){
		var _this = this;
		for (var i = 0; i < _this.l; i++) {
			(function(i){
				_this.arr[i].on('change',function(){
					if($(this).val() == 0){
						var cur = i + 1,
							j = cur;
						/*如果不利用vue等双向绑定框架手动把后面的
						for (; cur < _this.l; cur++) {
							var a = $(_this.arr[cur].find('option')[0]).clone();
							var h = a[0].outerHTML;
							_this.arr[cur].html(h);
						};*/
						_this.config.onclear(j);
					}else{
						var k = '';
						if (i == 0) {
							k = '_' + _this.arr[i].val();
						}else{
							for (var m = 0; m <= i; m++) {
								k += '_' + _this.arr[m].val();
							};
						}
						var key = k.substr(1).split('_');
						_this.config.onchange(key,_this.arr[i + 1])
					}
				})
			})(i);
		};
	}
}

/*
   *  @param type => '提示种类'
   *  Toast
   *  @param option => {
   		msg => 弹出信息
		type => success||error 成功失败提示
		duration => 几秒后自动关闭
		toastCloseFun => function
   	}
   	*  Alert
   	*  @param option => {
   		title => 提示头
   		template => 提示内容
   		closeBtn => '关闭按钮上文字' || 可有可无
   		closeBtnStyle => '关闭按钮样式' || 可有可无
   		fucBtn => '自定义按钮' || 可有可无
   		mask => true
   		maskClickDisble => 关闭mask点击
   		alertShowFun => function
   		alertCloseFun => function
   	}
   	*  Modal
   	*  @param option => {
   		maskClickDisble => 关闭mask点击
   		modalEle => ele
   		closeBtn => ele String
   		modalShowFun => modal框显示后
   		modalHideFun => modal框关闭后
   	}
   	*  Modal返回的方法
   	   Show => Modal显示
   	   Hide => Modal隐藏
   	*  @param ele => 触发事件的元素
 */


var Pop = function(){
};
Pop.prototype = {
	init : function(type,option){
		if (!this[type]) return false;
		this.type = type;
		this.option = option;
		this[type]();
	},
	Toast : function(){
		var _this = this;
		var t = $('<div class="toast '+_this.option.type+'">'+_this.option.msg+'</div>').appendTo(document.body).animate({'height': 60/96 +'rem'});
		setTimeout(function(){
			t.animate({'height':'0'},function(){
				t.remove();
				_this.option.toastCloseFun && _this.option.toastCloseFun();
			});
		}, (_this.option.duration || 3000));
	},
	Alert : function(){
		var _this = this;
		if (_this.option.mask) {
			this.$m = this.Mask();
			this.$m.appendTo(document.body);
		}
		var closeBtn = _this.option.closeBtn || '确定',
			fucBtn = _this.option.fucBtn || '',
			closeBtnStyle =  _this.option.closeBtnStyle || '';

		this.$a = $('<div class="alert animated slideInDown"><div class="alert-head">'+_this.option.title+'</div><div class="alert-content">'+_this.option.template+'</div><div class="alert-footer">'+fucBtn+'<button class="alert-btn '+closeBtnStyle+'">'+closeBtn+'</button></div></div>').appendTo(document.body);
		
		_this.option.alertShowFun && _this.option.alertShowFun();
		this.AlertEvent();
	},
	Modal : function(){
		var _this = this;
		_this.modal = _this.option.modalEle;
		_this.closeBtn = _this.option.closeBtn || '';
		_this.maskClickDisble = _this.option.maskClickDisble;
		_this.modal.modalShowFun = _this.option.modalShowFun || function(){};
		_this.modal.modalHideFun = _this.option.modalHideFun || function(){};
		_this.ModalEvent();
	},
	ModalEvent : function(){
		var _this = this;
		_this.modal.off();
		_this.modal.on('click',function(e){
			if (e.target != e.currentTarget) return true;
			if (_this.maskClickDisble) return false;
			_this.Hide();
			return false;
		})
		if (_this.closeBtn) {
			_this.modal.on('click',_this.closeBtn,function(){
				_this.modal.trigger('click');
			})
		};
	},
	Show : function(){
		var _this = this;
		if (_this.type != 'Modal') return false;
		$('body').css('overflow','hidden');
		_this.modal.show();
		_this.modal.removeClass('fadeOut').addClass('fadeIn');
		_this.modal.one('webkitAnimationEnd animationend',function(e){
			if (e.target != e.currentTarget) return false;
			_this.modal.modalShowFun();
		});
		return _this;
	},
	Hide : function(){
		var _this = this;
		if (_this.type != 'Modal') return false;
		$('body').css('overflow','auto');
		_this.modal.removeClass('fadeIn').addClass('fadeOut');
		_this.modal.one('webkitAnimationEnd animationend',function(e){
			if (e.target != e.currentTarget) return false;
			_this.modal.hide();
			_this.modal.modalHideFun();
		});
		return _this;
	},
	AlertEvent : function(){
		var _this = this;
		_this.eleArr = [];
		_this.eleArr.push(_this.$a);
		if (_this.option.mask) {
			_this.eleArr.push(_this.$m);
			_this.$m.off();
			_this.$m.on('click',function(){
				if (!_this.option.maskClickDisble) {
					_this.Remove();
				};
			});
		}
		_this.$a.off();
		_this.$a.on('click','.alert-btn',function(){
			_this.Remove();
		});
	},
	Mask : function(){
		return $('<div class="mask animated fadeIn"></div>');
	},
	Remove : function(){
		var timer = null,
			_this = this;
		if (_this.type != 'Alert') return false;
		_this.$m && _this.$m.removeClass('fadeIn').addClass('fadeOut');
		_this.$a.removeClass('slideInDown').addClass('slideOutUp');
		timer = setTimeout(function(){
			for (var i = 0; i < _this.eleArr.length; i++) {
				_this.eleArr[i].remove();
			}
			_this.option.alertCloseFun && _this.option.alertCloseFun();
		},1000);
		return _this;
	}
};
var Select = function(data) {
	this.$element = $('#'+data.target);
	this.inputWrap = '.form-control-select-input';
	this.$inputWrap = this.$element.find(this.inputWrap);
	this.Input = '.form-control-select-input input';
	this.$Input = this.$element.find(this.Input);
	this.deleteIcon = '.form-control-select-delete';
	this.$deleteIcon = this.$element.find(this.deleteIcon);
	this.wrap = '.form-control-select-wrap';
	this.$wrap = this.$element.find(this.wrap);
	this.searchInput = '.form-control-select-search > input';
	this.$searchInput = this.$element.find(this.searchInput);
	this.resultWrap = '.form-control-select-dialog';
	this.$resultWrap = this.$element.find(this.resultWrap);
	this.result = '.form-control-select-result';
	this.$result = this.$element.find(this.result);
	this.resultItem = '.form-control-select-result li';
	this.loading = '.form-control-select-dialog > .form-control-select-loading';
	this.$loading = this.$element.find(this.loading);
	this.none = '.form-control-select-dialog > .form-control-select-none';
	this.$none = this.$element.find(this.none);
	this.historyNone = '.form-control-select-dialog > .form-control-select-history-none';
	this.$historyNone = this.$element.find(this.historyNone);
	this.param = data.param;
	this.url = data.url;
	this.storage = data.storage;
	this.page = 1;
	this.flag = true;
	this.closeState = 'search-select-close';
	this.openState = 'search-select-open';
	this.active = 'active';
	this.getParam = data.getParam || function(data){
		return false;
	}
	this.getData = data.getData || function(data){
		return false;
	}
	this.afterSelect = data.afterSelect || function(text,id){
		return false;
	}
	this.afterDelete = data.afterDelete || function(text,id){
		return false;
	}
}
Select.prototype.init = function() {
	this.eventHandler();
}
Select.prototype.show = function() {
	this.$wrap.show();
	this.$searchInput.val('').focus();
	this.$inputWrap.removeClass(this.closeState).addClass(this.openState);
	this.getHistoryData();
}

Select.prototype.hide = function() {
	this.$inputWrap.removeClass(this.openState).addClass(this.closeState)
	this.$wrap.hide()
}

Select.prototype.eventHandler = function() {
	var _this = this;
	_this.$element.on('click', _this.inputWrap, function() {
		if ($(this).find('input').prop('disabled')) return false;
		if (_this.$inputWrap.hasClass(_this.closeState)) {
			_this.show()
		} else {
			_this.hide()
		}
	})
	
	_this.$element.on('blur', _this.searchInput, function() {
		window.setTimeout(function() {
			_this.hide()
		}, 300)
	})
	_this.$element.on('focus', _this.searchInput, function() {
		var _val = $.trim($(this).val());
		if (_val == '') {
			_this.getHistoryData();
		}
	})
	_this.$element.on('input', _this.searchInput, function() {
		var _val = $.trim($(this).val());
		_this.page = 1;
		if (_val != '') {
			_this.$historyNone.hide();
			_this.$loading.show()
			var param = _this.getParam({ 'keyword': _val, 'pageno': _this.page });
			if (!param) return false;
			$.getJSON(_this.url, param, function(data) {
				_this.$loading.hide();
				_this.data = _this.getData(data);
				if (!_this.data) return false;
				_this.$result.html(_this.getHighLight(_val, _this.data['data']))
				
				if (_this.page > _this.data['total'] - 1) {
					_this.next_page_url = null;
				}else{
					_this.next_page_url = _this.url;
				}
			})
		} else {
			_this.getHistoryData();
		}
	})

	_this.$element.on('click', _this.resultItem, function() {
		_this.getSelectItem($(this))
	})

	_this.$element.on('click', _this.deleteIcon, function() {
		_this.deleteSelectItem();
		$(this).hide();
	})

	_this.$resultWrap.scroll(function(e) {
		var _e = e.target;
		if (_e.scrollTop + _e.offsetHeight - _e.scrollHeight > -10) {
			if (_this.next_page_url != null) {
				if (_this.flag == false) {
					return false;
				}
			  	_this.flag = false;
			  	_this.page++;
				var _val = _this.$element.find(_this.searchInput).val();
				var param = _this.getParam({ 'keyword': _val, 'pageno': _this.page });
				if (!param) return false;
				$.getJSON(_this.next_page_url, param, function(data) {
					_this.data = _this.getData(data);
					var _html = _this.getHighLight(_val, _this.data['data']);
					_this.$result.append(_html)
					if (_this.page > _this.data['total'] - 1) {
						_this.next_page_url = null;
					}else{
						_this.next_page_url = _this.url;
					}
					_this.flag = true;
				})
			}
		};
	})
}
Select.prototype.getHistoryData = function() {
	var _storage = this.storage;
	if (localStorage[_storage] == undefined || localStorage.searchHistory == "" || localStorage.searchHistory == "[]") {
		this.$historyNone.show();
		this.data = '';
	} else {
		this.$historyNone.hide();
		var history = localStorage[_storage];
		this.data = JSON.parse(history);
		var _html = this.getDefaultResult(JSON.parse(history))
		this.$result.html(_html)
	}
}

Select.prototype.deleteSelectItem = function() {
	this.$Input.val('').removeAttr('data-id');
	this.afterDelete();
}

Select.prototype.getSelectItem = function(item) {
	this.$Input.val(item.text()).attr('data-id', item.data('id'))
	this.$searchInput.val('').blur();
	this.hide();
	var _html = this.getHighLight(item.text(), this.data);
	this.$result.html(_html)
	this.saveHistory(item.text(), item.data('id'));
	this.$deleteIcon.show();
	this.afterSelect(item.text(), item.data('id'))
}

Select.prototype.saveHistory = function(name, id) {
	var _storage = this.storage;
	var history = localStorage[_storage] ? JSON.parse(localStorage[_storage]) : '';
	var tmpHistory, tmpStr;

	if (history.length == 20) {
	  history.pop();
	};
	if (history == undefined || history == '') {
	  tmpHistory = [];
	} else {
	  tmpHistory = history;
	}
	tmpStr = '{"name":"' + name + '","id":"' + id + '"}';
	if (this.inArray(tmpStr, tmpHistory) >= 0) {
	  var i = this.inArray(tmpStr, tmpHistory);
	  tmpHistory.splice(i, 1);
	};
	tmpHistory.unshift(tmpStr);
	this.data = tmpHistory;
	localStorage[_storage] = JSON.stringify(tmpHistory);
}

Select.prototype.inArray = function(str, arr) {
	for (var i = 0; i <= arr.length; i++) {
		if (str.indexOf(arr[i]) != -1) {
			return i;
		}
	};
}

Select.prototype.getDefaultResult = function(data) {
	var _this = this;
	var _items = data;
	var _html = '';
	if (_items.length > 0) {
		for (var i = 0; i < _items.length; i++) {
		var _item;
		if (typeof _items[i] == 'string') {
			_item = JSON.parse(_items[i]);
		} else {
			_item = _items[i];
		}
			_html += '<li data-id="' + _item['name'] + '">' + _item['name'] + '</li>';
		};
		this.$historyNone.hide();
		this.$none.hide();
		this.$historyNone.hide();
		return _html;
	} else {
		this.$historyNone.show();
		return false;
	}
}

Select.prototype.getHighLight = function(val, data) {
	var _this = this;
	var _items = data;
	var _html = '';

	if (_items.length > 0) {
		for (var i = 0; i < _items.length; i++) {
			var _item;
			if (typeof _items[i] == 'string') {
				_item = JSON.parse(_items[i]);
			} else {
				_item = _items[i];
			}

			if (_item['name'].indexOf(val) != -1 && val != '') {
				_html += '<li data-id="' + _item['name'] + '">' + _item['name'].replace(val, '<em>' + val + '</em>') + '</li>';
			};
		};
		this.$historyNone.hide();
		this.$none.hide();
		this.$historyNone.hide();
		return _html;
	} else {
		this.$none.show();
		return false;
	}
}

var select = new Select({
	target : 'searchHistory',
	url : '/app/mock/data.json',
	storage : 'searchHistory',
	getData : function(data){
		if (data['Agent_Company_listName']['errcode'] != 0) {
			console.log('error')
			return false;
		}else{
			console.log()
			return {
				data : data['Agent_Company_listName']['data']['list'],
				total : Math.ceil(data['Agent_Company_listName']['data']['total']/20)
			};
		}
	},
	afterSelect : function(text,id){
		console.log(text)
		console.log(id)
	},
	afterDelete : function(){
		console.log('delete')
	},
	getParam : function(param){
		param.status = 99;
		var param = {
			Agent : {
				Company : {
					listName : param
				}
			}
		}
		return param;
	}
});
select.init();
/*
   *  下拉组建
   *  @param option => {
   		ele => 需要下拉的元素
   	}
*/
var DropDown = function(){}
DropDown.prototype = {
	init : function(option){
		this.config = $.extend(true,{},option);
		this.$drop = this.config.ele;
		this.$toggle = this.$drop.find('.dropdown-toggle');
		this.$menu = this.$drop.find('.dropdown-menu');
		this.eventHandler();
	},
	eventHandler : function(){
		var _this = this;
		_this.$drop.on('mouseover',function(){
			_this.$menu.show();
		})
		_this.$drop.on('mouseleave',function(){
			_this.$menu.hide();
		})
	}
}
/*
   *  分步组建
   *  @param option => {
   		nav => Boolean true||false 需不需要导航
   		steps => 步骤元素
   		stepNav => 步骤导航元素
   		nextEle => 下一步元素
   		preEle => 上一步元素
   		onNext => 下一步
   		onShow => 当前步骤显示时 
   		onPre => 上一步
   		onNavClick => 导航被点击时
   	}
   	暴露出的方法
   	Go  要显示的步骤
*/

var Step = function(){	
	this.index = 0;
	this.config = {
		onNext: function(){
			return true;
		},
		onShow: function(){},
		onPre: function(){
			return true;
		},
		onNavClick: function(){}
	}
}
Step.prototype = {
	init : function(option){
		this.config = $.extend(true,this.config,option);
		this.$steps = $(this.config.steps);
		this.limit = $(this.config.steps).length;
		this.navShow();
		this.eventHandler();
	},
	eventHandler : function(){
		var _this = this;
		$(_this.$steps).on('click',_this.config.nextEle,function(){
			if (_this.config.onNext(_this.index,this)) {
				var cur = _this.index;
				if (cur < _this.limit - 1) {
					_this.index = _this.index + 1;
					_this.nexPage(cur,_this.index);
				};
			}
		})
		$(_this.$steps).on('click',_this.config.preEle,function(){
			if (_this.config.onPre(_this.index,this)) {
				var cur = _this.index;
				if (cur > 0) {
					_this.index = _this.index - 1;
					_this.nexPage(cur,_this.index);
				};
			}
		})
	},
	nexPage : function(cur,next){
		var _this = this;
		if (next > cur) {
			if (!$(_this.$steps[cur]).hasClass('done')) {
				$(_this.$steps[cur]).addClass('done');
			};
			if (_this.config.nav && !$($(_this.config.nav)[cur]).hasClass('done')) {
				$($(_this.config.nav)[cur]).addClass('done');
			};
			$(_this.$steps[cur]).removeClass('active');
		}else{
			if (_this.config.nav) {
				$($(_this.config.nav)[cur]).removeClass('active');
			};
			$(_this.$steps[cur]).removeClass('active');
		}
		_this.navShow();
	},
	navShow : function(){
		$(this.$steps).removeClass('active');
		$(this.$steps[this.index]).addClass('active');
		if (this.config.nav) {
			$(this.config.stepNav[this.index]).addClass('active');
		};
		this.config.onShow(this.index);

	},
	Go : function(index){
		this.index = index;
		this.navShow();
		return this;
	}
}


/*
   *  Tab组建
   *  @param option => {
   		tabWrap => ele tab父元素
   		tab => String tab ele String
   		tabTar => ele tar 元素
   		tar => String tar ele String
   	}
*/
var Tab = function(){};
Tab.prototype = {
	init : function(option){
		this.config = option;
		this.$tabWrap = this.config.tabWrap;
		this.tab = this.config.tab;
		this.$tabTar = this.config.tabTar;
		this.tar = this.config.tar;
		this.eventHandler();
	},
	eventHandler : function(){
		var _this = this;
		_this.$tabWrap.off();
		_this.$tabWrap.on('click', _this.tab, function(){
			_this.$tabWrap.find(_this.tab).removeClass('active');
			_this.$tabTar.find(_this.tar).removeClass('active');
			$(this).addClass('active');
			var $tar = $($(this).attr('data-target'));
			$tar.addClass('active');
		})
	}
}
