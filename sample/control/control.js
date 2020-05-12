function checkQueryParameObj(obj, key) {
	if (!obj || !obj[key]) {
		return null;
	} else {
		return obj[key];
	}
}

function checkZhichaObj(obj, key) {
	if (!obj || !obj[key]) {
		return {};
	} else {
		return obj[key];
	}
}
// 云行情判断code类型
// 调用方式eg:
// fnCodetype(000001,function(_codeType){
// 	console.log(_codeType)
// })
function fnCodetype(code, succ) {
	if (code) {
		$.ajax({
			type: 'POST',
			dataType: "jsonp",
			url: hq_queryUrl + "/v1/sh1/snap/" + code,
			data: {
				select: 'cpxxtype,cpxxsubtype'
			},
			jsonp: "callback",
			cache: false,
			success: function(resultData) {
				var retype = '';
				var codetype = resultData.snap[0];
				var codesubtype = resultData.snap[1];
				if (codetype) {
					switch (codetype) {
						case 'ES': //股票
							switch (codesubtype) {
								case 'ASH': //A股
									retype = 'astock';
									break;
								case 'BSH': //B股
									retype = 'bstock';
									break;
								case 'KSH': //科创板
									retype = 'kcbstock';
									break;

							}
							break;
						case 'EU': //基金
							retype = 'fund';
							break;
						case 'D': //债券
							switch (codesubtype) {
								case 'CRP': //债券回购
									retype = 'huigou';

									break;
								default:
									retype = 'bond';
							}
							break;

					}
				} else {
					//指数
					retype = 'index';

				}
				succ(retype);
			}
		})
	} else {
		succ(false);
	}


}

function parseJsContent(index) {
	var obj_index = {};
	$.ajax({
		url: "/home/public/querySearch/queryConfig/map.js?" + webVersion,
		type: 'get',
		async: false,
	}).done(function(data) {
		var map = eval(data);
		if (map.indexOf(index + "") != -1) {
			$.ajax({
				url: '/home/public/querySearch/queryConfig/' + index + '.js?' + webVersion,
				type: 'get',
				async: false,
			}).done(
				function(res) {
					// 存在col_id配置文件的情况
					obj_index = eval(res);
				})
		} else {
			obj_index = null;
		}
	})
	return obj_index;
}

function parseJsContentCB(index, callback) {
	var index_obj = {};
	$.ajax({
		url: "/home/public/querySearch/queryConfig/map.js?" + webVersion,
		type: 'get',
	}).done(function(data) {
		var map = mapsever;
		if (map.indexOf(index + "") != -1) {
			$.ajax({
				url: '/home/public/querySearch/queryConfig/' + index + '.js?' + webVersion,
				type: 'get',
			}).done(
				function(res) {
					// 存在col_id配置文件的情况
					index_obj = eval(res);
					callback(index_obj);
				})
		} else {
			callback(null);
		}
	})
}
// ajax请求 共通方法
function doCommonQuery(params, success) {
	$.ajax({
		url: sseQueryURL + 'commonQuery.do',
		type: 'post',
		// async: false,
		cache: false,
		dataType: "jsonp",
		jsonp: "jsonCallBack",
		jsonpCallback: "jsonpCallback" + Math.floor(Math.random() * (100000 + 1)),
		data: params,
		success: success
	});
}
/*
 * result是需要判断的对象数组
 * proArr是存放不需要判空属性的字符串数组
 * 该方法是为了判断result元素中非proArr属性是否有数据
 */
function arrayObjNodata(result, proArr) {
	var noData = true;
	if (result && result.length > 0) {
		for (var i = 0; i < result.length; i++) {
			for (pro in result[i]) {
				if (proArr.indexOf(pro) == -1) {
					var element = result[i][pro];
					if (element) {
						noData = false;
						break;
					}
				}
			}
			if (!noData) {
				break;
			}
		}
	}
	return noData;
}
// 判空处理
function isBlankOrNull(obj) {
	var res;
	if (obj) {
		var str = JSON.stringify(obj);
		res = (str == '[]' || str == '{}');
	} else {
		// null、''、undefined 
		var noneArr = [null, '', undefined];
		res = noneArr.indexOf(obj) != -1;
	}
	return res;
}
//全局分页显示条数
if (typeof(sitePageSize) == 'undefined') {
	var sitePageSize = 25;
}

/**
	text框回车触发按钮点击
	2015-12-03
	*/
var isSearchBut = $(".sse_con_query");
if (isSearchBut) {
	isSearchBut.find("input").keydown(function(e) {
		if (e.which == 13) {
			$(':focus').closest(".sse_con_query").find("#btnQuery").eq(0).click();
		}
	});
}

/**
 * 锚点 Lichen  2016-02-25 10:07:25
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
function offsetTops(id) {
	$('html,body').animate({
		scrollTop: id.offset().top
	}, 100);
}

function bondUrlCheck(codeCheck) {
	var tBondCodeUrl = "";
	var subCodeCheck = codeCheck.substring(0, 3);
	if (subCodeCheck == "010" || subCodeCheck == "019" || subCodeCheck == "020") {
		tBondCodeUrl = "/assortment/bonds/list/info/basic/index.shtml";
	} else if (subCodeCheck == "130") {
		tBondCodeUrl = "/assortment/bonds/list/localinfo/basic/index.shtml";
	} else if (subCodeCheck == "120" || subCodeCheck == "124" || subCodeCheck == "127" || subCodeCheck == "122" || subCodeCheck == "132") {
		tBondCodeUrl = "/assortment/bonds/list/corporateinfo/basic/index.shtml";
	} else if (subCodeCheck == "110" || subCodeCheck == "113") {
		tBondCodeUrl = "/assortment/bonds/list/convertibleinfo/basic/index.shtml";
	} else if (subCodeCheck == "202" || subCodeCheck == "204" || subCodeCheck == "206") {
		tBondCodeUrl = "/assortment/bonds/list/repoinfo/basic/index.shtml";
	} else if (subCodeCheck == "126") {
		tBondCodeUrl = "/assortment/bonds/list/detachableinfo/basic/index.shtml";
	} else {
		tBondCodeUrl = "/assortment/bonds/list/info/basic/index.shtml";
	}
	return tBondCodeUrl;
}

//2015-12-2 14:49
//表格点击事件
function tdclickable() {
	require(['sse'], function(control) {
		preventLinks();
	});
}


function placeholderFun() {
	return 'placeholder' in document.createElement('input');
}

function placeholder() {
	return 'placeholder' in document.createElement('input');
}

function placeholderSupport() {
	return 'placeholder' in document.createElement('input');
}
// 浏览器是否支持input的placeholder

function placeholderSupportFun() {
	if (!placeholderFun()) {

		$('[placeholder]').focus(function() {

			var input = $(this);
			if (input.val() == input.attr('placeholder')) {
				input.val('');
				input.removeClass('placeholder');
			}

		}).blur(function() {
			var input = $(this);
			if (input.val() === '' || input.val() == input.attr('placeholder')) {
				input.addClass('placeholderSupport');
				input.val(input.attr('placeholder'));
			}
		}).blur();
	}
}


var getPage = function(obj) {
	if (obj.pageType == 'WCM') {
		if (obj.pageCount == 1) {
			obj.pageId.hide();
		} else {
			obj.pageId.show();
		}
	}
	var $this = this;
	this._createPage = function(obj) {
		var total_page = parseInt(obj.pageCount); //总页数
		if (obj.isStatic) { //判断处理WCM当前页面
			if (obj.pageIndex == 0) {
				obj.pageIndex = 1;
			} else {
				obj.pageIndex = obj.pageIndex + 1;
			}
		}
		if (obj.ajaxDataType == 'xml') { //判断处理WCM当前页面
			if (obj.pageIndex == 0) {
				obj.pageIndex = 1;
			}
		}
		var current_page = parseInt(obj.pageIndex); //当前页数

		var pager_length = obj.pageLength; //不包next 和 prev 必须为奇数
		var pager = new Array(pager_length);
		var header_length = obj.headerKeep; //头部预留页码
		var tailer_length = obj.footerKeep; //尾部预留页码
		//header_length + tailer_length 必须为偶数
		var main_length = pager_length - header_length - tailer_length; //必须为奇数
		var tagStr = obj.tagStr;
		var tagStr2 = obj.tagStr2;
		var classStr = obj.classStr;
		var idStr = obj.idStr;
		var nameStr = obj.nameStr;
		var disable_class = obj.disable;
		var select_class = obj.active;
		var extClass = obj.extClass;
		var i;
		var code = '';
		var mobileCode = '';
		var codeList = [];
		var numRel = '';

		if (total_page < current_page) {
			//alert('总页数不能小于当前页数');
			return false;
		}
		//判断总页数是不是小于 分页的长度，若小于则直接显示
		if (total_page <= pager_length) {
			for (i = 0; i < total_page; i++) {
				code += (i + 1 != current_page) ? $this.createTag({
					pageName: obj.pageName,
					pageExt: obj.pageExt,
					isStatic: obj.isStatic,
					tagStr: tagStr,
					classStr: classStr,
					idStr: idStr,
					nameStr: nameStr,
					a_html: i + 1
				}) : $this.createTag({
					pageName: obj.pageName,
					pageExt: obj.pageExt,
					isStatic: obj.isStatic,
					tagStr: tagStr,
					classStr: select_class,
					idStr: idStr,
					nameStr: nameStr,
					a_html: i + 1
				});
			}
		} else { //如果总页数大于分页长度，则为一下函数
			//先计算中心偏移量
			var offset = (pager_length - 1) / 2;
			//分三种情况，第一种左边没有...
			if (current_page <= offset + 1) {
				var tailer = '';
				//前header_length + main_length 个直接输出之后加一个...然后输出倒数的    tailer_length 个
				for (i = 0; i < header_length + main_length; i++) {
					code += (i + 1 != current_page) ? $this.createTag({
						pageName: obj.pageName,
						pageExt: obj.pageExt,
						isStatic: obj.isStatic,
						tagStr: tagStr,
						classStr: classStr,
						idStr: idStr,
						nameStr: nameStr,
						a_html: i + 1
					}) : $this.createTag({
						pageName: obj.pageName,
						pageExt: obj.pageExt,
						isStatic: obj.isStatic,
						tagStr: tagStr,
						classStr: select_class,
						idStr: idStr,
						nameStr: nameStr,
						a_html: i + 1
					});
				}
				code += $this.createTag({
					pageName: obj.pageName,
					pageExt: obj.pageExt,
					isStatic: obj.isStatic,
					tagStr: tagStr,
					classStr: classStr,
					idStr: idStr,
					nameStr: nameStr,
					a_html: '...'
				});
				for (i = total_page; i > total_page - tailer_length; i--) {
					tailer = $this.createTag({
						pageName: obj.pageName,
						pageExt: obj.pageExt,
						isStatic: obj.isStatic,
						tagStr: tagStr,
						classStr: classStr,
						idStr: idStr,
						nameStr: nameStr,
						a_html: i
					}) + tailer;
				}
				code += tailer;
			} else if (current_page >= total_page - offset) { //第二种情况是右边没有...
				var header = '';
				//后tailer_length + main_length 个直接输出之前加一个...然后拼接 最前面的 header_length 个
				for (i = total_page; i >= total_page - main_length - 1; i--) {
					code = ((current_page != i) ? $this.createTag({
						pageName: obj.pageName,
						pageExt: obj.pageExt,
						isStatic: obj.isStatic,
						tagStr: tagStr,
						classStr: classStr,
						idStr: idStr,
						nameStr: nameStr,
						a_html: i
					}) : $this.createTag({
						pageName: obj.pageName,
						pageExt: obj.pageExt,
						isStatic: obj.isStatic,
						tagStr: tagStr,
						classStr: select_class,
						idStr: idStr,
						nameStr: nameStr,
						a_html: i
					})) + code;
				}
				if (total_page != (pager_length + 1)) {
					code = $this.createTag({
						pageName: obj.pageName,
						pageExt: obj.pageExt,
						isStatic: obj.isStatic,
						tagStr: tagStr,
						classStr: classStr,
						idStr: idStr,
						nameStr: nameStr,
						a_html: '...'
					}) + code;
				}
				for (i = 0; i < header_length; i++) {
					header += $this.createTag({
						pageName: obj.pageName,
						pageExt: obj.pageExt,
						isStatic: obj.isStatic,
						tagStr: tagStr,
						classStr: classStr,
						idStr: idStr,
						nameStr: nameStr,
						a_html: i + 1
					});
				}
				code = header + code;
			} else { //最后一种情况，两边都有...
				var header = '';
				var tailer = '';
				//首先处理头部
				for (i = 0; i < header_length; i++) {
					header += $this.createTag({
						pageName: obj.pageName,
						pageExt: obj.pageExt,
						isStatic: obj.isStatic,
						tagStr: tagStr,
						classStr: classStr,
						idStr: idStr,
						nameStr: nameStr,
						a_html: i + 1
					});
				}
				header += $this.createTag({
					pageName: obj.pageName,
					pageExt: obj.pageExt,
					isStatic: obj.isStatic,
					tagStr: tagStr,
					classStr: classStr,
					idStr: idStr,
					nameStr: nameStr,
					a_html: '...'
				});
				//处理尾巴
				for (i = total_page; i > total_page - tailer_length; i--) {
					tailer = $this.createTag({
						pageName: obj.pageName,
						pageExt: obj.pageExt,
						isStatic: obj.isStatic,
						tagStr: tagStr,
						classStr: classStr,
						idStr: idStr,
						nameStr: nameStr,
						a_html: i
					}) + tailer;
				}
				tailer = $this.createTag({
					pageName: obj.pageName,
					pageExt: obj.pageExt,
					isStatic: obj.isStatic,
					tagStr: tagStr,
					classStr: classStr,
					idStr: idStr,
					nameStr: nameStr,
					a_html: '...'
				}) + tailer;
				//处理中间
				//计算main的中心点
				var offset_m = (main_length - 1) / 2;
				var partA = '';
				var partB = '';
				var j;
				var counter = (parseInt(current_page) + parseInt(offset_m));
				for (i = j = current_page; i <= counter; i++, j--) {
					partA = ((i == j) ? '' : $this.createTag({
						pageName: obj.pageName,
						pageExt: obj.pageExt,
						isStatic: obj.isStatic,
						tagStr: tagStr,
						classStr: classStr,
						idStr: idStr,
						nameStr: nameStr,
						a_html: j
					})) + partA;
					partB += (i == j) ? $this.createTag({
						pageName: obj.pageName,
						pageExt: obj.pageExt,
						isStatic: obj.isStatic,
						tagStr: tagStr,
						classStr: select_class,
						idStr: idStr,
						nameStr: nameStr,
						a_html: i
					}) : $this.createTag({
						pageName: obj.pageName,
						pageExt: obj.pageExt,
						isStatic: obj.isStatic,
						tagStr: tagStr,
						classStr: classStr,
						idStr: idStr,
						nameStr: nameStr,
						a_html: i
					});
				}
				//拼接
				code = header + partA + partB + tailer;

			}
		}

		var prev = (current_page == 1) ? $this.createTag({
			pageName: obj.pageName,
			pageExt: obj.pageExt,
			isStatic: obj.isStatic,
			tagStr: tagStr,
			classStr: disable_class,
			idStr: idStr,
			nameStr: nameStr,
			a_html: obj.prevName,
			classPage: obj.classPage
		}) : $this.createTag({
			pageName: obj.pageName,
			pageExt: obj.pageExt,
			isStatic: obj.isStatic,
			tagStr: tagStr,
			classStr: classStr,
			idStr: idStr,
			nameStr: nameStr,
			a_html: obj.prevName,
			classPage: obj.classPage
		});

		var prev2 = (current_page == 1) ? $this.createTag2({
			pageName: obj.pageName,
			pageExt: obj.pageExt,
			isStatic: obj.isStatic,
			tagStr: tagStr,
			tagStr2: tagStr2,
			classStr: disable_class,
			idStr: idStr,
			nameStr: nameStr,
			a_html: obj.prevName2,
			classPage: obj.classPage
		}) : $this.createTag2({
			pageName: obj.pageName,
			pageExt: obj.pageExt,
			isStatic: obj.isStatic,
			tagStr: tagStr,
			tagStr2: tagStr2,
			classStr: classStr,
			idStr: idStr,
			nameStr: nameStr,
			a_html: obj.prevName2,
			classPage: obj.classPage
		});

		if (1 != current_page) {
			prev = (current_page == 1) ? $this.createTag({
				pageName: obj.pageName,
				pageExt: obj.pageExt,
				isStatic: obj.isStatic,
				tagStr: tagStr,
				classStr: disable_class,
				idStr: idStr,
				nameStr: nameStr,
				a_html: obj.prevName,
				pageIndex: current_page,
				classPage: obj.classPage
			}) : $this.createTag({
				pageName: obj.pageName,
				pageExt: obj.pageExt,
				isStatic: obj.isStatic,
				tagStr: tagStr,
				classStr: classStr,
				idStr: idStr,
				nameStr: nameStr,
				a_html: obj.prevName,
				pageIndex: (current_page - 1),
				classPage: obj.classPage
			});
			prev2 = (current_page == 1) ? $this.createTag2({
				pageName: obj.pageName,
				pageExt: obj.pageExt,
				isStatic: obj.isStatic,
				tagStr: tagStr,
				tagStr2: tagStr2,
				classStr: disable_class,
				idStr: idStr,
				nameStr: nameStr,
				a_html: obj.prevName2,
				pageIndex: current_page,
				classPage: obj.classPage
			}) : $this.createTag2({
				pageName: obj.pageName,
				pageExt: obj.pageExt,
				isStatic: obj.isStatic,
				tagStr: tagStr,
				classStr: classStr,
				idStr: idStr,
				nameStr: nameStr,
				a_html: obj.prevName2,
				pageIndex: (current_page - 1),
				classPage: obj.classPage
			});
		}
		var next = (current_page == total_page) ? $this.createTag({
			pageName: obj.pageName,
			pageExt: obj.pageExt,
			isStatic: obj.isStatic,
			tagStr: tagStr,
			classStr: disable_class,
			idStr: idStr,
			nameStr: nameStr,
			a_html: obj.nextName,
			classPage: obj.classPage
		}) : $this.createTag({
			pageName: obj.pageName,
			pageExt: obj.pageExt,
			isStatic: obj.isStatic,
			tagStr: tagStr,
			classStr: classStr,
			idStr: idStr,
			nameStr: nameStr,
			a_html: obj.nextName,
			classPage: obj.classPage
		});
		var next2 = (current_page == total_page) ? $this.createTag2({
			pageName: obj.pageName,
			pageExt: obj.pageExt,
			isStatic: obj.isStatic,
			tagStr: tagStr,

			classStr: disable_class,
			idStr: idStr,
			nameStr: nameStr,
			a_html: obj.nextName2,
			classPage: obj.classPage
		}) : $this.createTag2({
			pageName: obj.pageName,
			pageExt: obj.pageExt,
			isStatic: obj.isStatic,
			tagStr: tagStr,
			tagStr2: tagStr2,
			classStr: classStr,
			idStr: idStr,
			nameStr: nameStr,
			a_html: obj.nextName2,
			classPage: obj.classPage
		});
		if (obj.pageCount != current_page) {
			next = (current_page == total_page) ? $this.createTag({
				pageName: obj.pageName,
				pageExt: obj.pageExt,
				isStatic: obj.isStatic,
				tagStr: tagStr,
				classStr: disable_class,
				idStr: idStr,
				nameStr: nameStr,
				a_html: obj.nextName,
				pageIndex: current_page,
				classPage: obj.classPage
			}) : $this.createTag({
				pageName: obj.pageName,
				pageExt: obj.pageExt,
				isStatic: obj.isStatic,
				tagStr: tagStr,
				classStr: classStr,
				idStr: idStr,
				nameStr: nameStr,
				a_html: obj.nextName,
				pageIndex: (current_page + 1),
				classPage: obj.classPage
			});
			next2 = (current_page == total_page) ? $this.createTag2({
				pageName: obj.pageName,
				pageExt: obj.pageExt,
				isStatic: obj.isStatic,
				tagStr: tagStr,

				classStr: disable_class,
				idStr: idStr,
				nameStr: nameStr,
				a_html: obj.nextName2,
				pageIndex: current_page,
				classPage: obj.classPage
			}) : $this.createTag2({
				pageName: obj.pageName,
				pageExt: obj.pageExt,
				isStatic: obj.isStatic,
				tagStr: tagStr,
				classStr: classStr,
				idStr: idStr,
				nameStr: nameStr,
				a_html: obj.nextName2,
				pageIndex: (current_page + 1),
				classPage: obj.classPage
			});
		}

		var codebutton = '<span page="' + obj.pageCount + '" id="pagebutton" class="codegobutton">GO</span>'
		var codeinputone = '<input id="ht_codeinput"  class="codeinput1"  type="text" value="">';
		code = prev + code + next + codeinputone + codebutton;
		var tempPrev = $(prev).find('a');
		var tempNext = $(next).find('a');
		var mobilePrev = '<button type="button" page="' + tempPrev.attr("page") + '" class="btn btn-default navbar-btn ' + tempPrev.attr("class") + '">上一页</button>';
		var mobileNext = '<button type="button" page="' + tempNext.attr("page") + '" class="btn btn-default navbar-btn next-page ' + tempNext.attr("class") + '">下一页</button>';
		mobileCode = mobilePrev + mobileNext;

		codeList.push(code);
		codeList.push(mobileCode);
		return codeList;

	}
	/**
	 * 计算分页URL值
	 */
	this._makeUrl = function(obj) {
		var _dataUrl = obj.dataUrl;
		var _pageIndex = obj.pageIndex;
		_dataUrl = _dataUrl.replace(".htm", '_' + _pageIndex + '.htm');
		if (_pageIndex > 1) {
			_dataUrl = _dataUrl.replace(_dataUrl.substring(_dataUrl.lastIndexOf("_")), '_' + _pageIndex + '.htm');
		} else {
			_dataUrl = _dataUrl.replace(_dataUrl.substring(_dataUrl.lastIndexOf("_")), '.htm');
		}
		return _dataUrl;
	}
	/**
	 * 	数据的填充
	 */
	this._showData = function(obj) {
		var $pageData = $(obj.pageData);
		$pageData.html("")
		for (var i = 0; i < xmlData.length; i++) {
			var strHTML = obj.ajaxData(xmlData[i]);
			$pageData.append(strHTML);
		}
		$pageData.find("a[href^='javascript']").each(function() {
			$(this).parent().html($(this).text());
			// console.log("a[href^='javascript']  this1");
		});
		tdclickable();

	}
	/**
	*	请求数据
		" style="display:none" ="20"  ="1" PAGE_NAME='/aboutus/mediacenter/hotandd/data' PAGE_EXT='htm' ></div>
		*/
	this._getData = function(obj) {
		$.ajax({
			type: obj.ajaxType,
			dataType: obj.ajaxDataType,
			url: $this._makeUrl(obj),
			success: function(xml) {
				var tempitem = $(xml).find("#createPage").attr("rel");
				// Li.chen  2016-12-07 11:46:35
				// if(tempitem != undefined){
				// 	xmlData = $(xml).find(tempitem);
				// }else{
				// 	xmlData = $(xml).find("dl");
				// }

				if (tempitem != undefined) {
					xmlData = $(xml).find(tempitem);
				}
				if ($(xml).find("dl").length > 0) {
					xmlData = $(xml).find("dl");
				} else if ($(xml).find("ul").length > 1) {
					xmlData = $(xml).find("ul:first");
				}

				obj.pageIndex = $(xml).find("#createPage").attr("PAGE_INDEX");
				obj.pageCount = $(xml).find("#createPage").attr("PAGE_COUNT");
				$this._showData(obj);
			},
			error: function(xml) {
				xmlData = null;
			}
		});
	}
	//创建标签
	this.createTag = function(obj) {
		classStr = (obj.classStr == '') ? '' : ' class="' + obj.classStr + '"';
		idStr = (obj.idStr == '') ? '' : ' id="' + obj.idStr + '"';
		nameStr = (obj.nameStr == '') ? '' : ' name="' + obj.nameStr + '"';
		//获取html
		var extStr = null;

		if (!isNaN(obj.a_html)) {
			numRel = 'page="' + obj.a_html + '"';
		} else {
			numRel = '';
		}

		var code = '';

		//判断是否上一页下一页
		if (obj.pageIndex != undefined) {
			numRel = 'page="' + obj.pageIndex + '"';
			var classPage = ' class="' + obj.classPage + '"';

			if (obj.tagStr == 'a') {
				if (obj.isStatic) {
					//
					if (obj.pageIndex == 1) {
						extStr = obj.pageName + "." + obj.pageExt;
					} else {
						extStr = obj.pageName + "_" + (obj.pageIndex - 1) + "." + obj.pageExt;
					}
					code = '<li page="page"><' + obj.tagStr + classPage + idStr + numRel + nameStr + ' href="' + extStr + '">' + obj.a_html + '</' + obj.tagStr + '></li>';
				} else {
					code = '<li page="page"><' + obj.tagStr + classPage + idStr + numRel + nameStr + ' href="javascript:;">' + obj.a_html + '</' + obj.tagStr + '></li>';
				}
			} else {
				code = '<li page="page"><' + obj.tagStr + classPage + idStr + numRel + nameStr + ' >' + obj.a_html + '</' + obj.tagStr + '></li>';

			}
		} else {
			if (obj.tagStr == 'a') {
				if (obj.isStatic) {
					if (numRel) {
						if (obj.a_html == 1) {
							extStr = obj.pageName + "." + obj.pageExt;
						} else {
							extStr = obj.pageName + "_" + (obj.a_html - 1) + "." + obj.pageExt;
						}
					} else {
						extStr = "javascript:;";
					}

					code = '<li page="page"><' + obj.tagStr + classStr + idStr + numRel + nameStr + ' href="' + extStr + '">' + obj.a_html + '</' + obj.tagStr + '></li>';
				} else {
					code = '<li page="page"><' + obj.tagStr + classStr + idStr + numRel + nameStr + ' href="javascript:;">' + obj.a_html + '</' + obj.tagStr + '></li>';
				}
			} else {
				code = '<li page="page"><' + obj.tagStr + classStr + idStr + numRel + nameStr + ' >' + obj.a_html + '</' + obj.tagStr + '></li>';

			}
		}

		return code;
	}

	this.createTag2 = function(obj) {
		var mobileCode = '';


		classStr = (obj.classStr == '') ? '' : ' class="' + obj.classStr + '"';
		idStr = (obj.idStr == '') ? '' : ' id="' + obj.idStr + '"';
		nameStr = (obj.nameStr == '') ? '' : ' name="' + obj.nameStr + '"';



		//获取html
		var extStr = null;

		if (isNaN(obj.a_html)) {
			numRel = 'page="' + obj.pageIndex + '"';
		} else {
			numRel = '';
		}

		//判断是否上一页下一页
		if (obj.pageIndex != undefined) {
			numRel = 'page="' + obj.pageIndex + '"';
			var classPage = ' class="' + obj.classPage + '"';

			if (obj.tagStr == 'a') {
				if (obj.isStatic) {
					//
					if (obj.pageIndex == 1) {
						extStr = obj.pageName + "." + obj.pageExt;
					} else {
						extStr = obj.pageName + "_" + (obj.pageIndex - 1) + "." + obj.pageExt;
					}
					mobileCode = '<button type="button" class="btn btn-default navbar-btn ' + obj.classPage + '" ' + numRel + '>' + obj.a_html + '</button>';
				} else {
					//page=2
					mobileCode = '<button type="button" class="btn btn-default navbar-btn ' + obj.classPage + '" ' + numRel + '>' + obj.a_html + '</button>';
				}
			} else {
				mobileCode = '<button type="button" class="btn btn-default navbar-btn ' + obj.classPage + '" ' + numRel + '>' + obj.a_html + '</button>';
			}
		} else {
			if (obj.tagStr == 'a') {
				if (obj.isStatic) {
					if (numRel) {
						if (obj.a_html == 1) {
							extStr = obj.pageName + "." + obj.pageExt;
						} else {
							extStr = obj.pageName + "_" + (obj.a_html - 1) + "." + obj.pageExt;
						}
					} else {
						extStr = "javascript:;";
					}

					mobileCode = '<button type="button" class="btn btn-default navbar-btn ' + obj.classPage + '" ' + numRel + '>' + obj.a_html + '</button>';
				} else {
					//page=""
					mobileCode = '<button type="button" class="btn btn-default navbar-btn ' + obj.classPage + '" ' + numRel + '>' + obj.a_html + '</button>';
				}
			} else {
				mobileCode = '<button type="button" class="btn btn-default navbar-btn ' + obj.classPage + '" ' + numRel + '>' + obj.a_html + '</button>';

			}
		}
		//mobileCode ='<button type="button" class="btn btn-default navbar-btn '+obj.classPage+'" '+ numRel +'>'+obj.a_html+'</button>';
		if (mobileCode.indexOf("下一页") > -1) {
			mobileCode = '<button type="button" class="btn btn-default navbar-btn next-page ' + obj.classPage + '" ' + numRel + '>' + obj.a_html + '</button>';
		}
		return mobileCode;
	}


	if (obj.pageType == "WCM") {
		if (!obj.isStatic) {
			$this._getData(obj);
		}
	} else {
		var results = obj.ajaxData();
		if (results != null) {
			obj.pageIndex = results.pageIndex;
			obj.pageCount = results.pageCount;
		}
	}
	var pageStr = $this._createPage(obj);



	if (pageStr) {
		var $page = obj.pageId.find('.pagination');
		var $pageMobile = obj.pageId.find('.mobile-page');
		$page.html(pageStr[0]);
		$pageMobile.html(pageStr[1]); //手机分页
		//绑定点击事件
		if (!obj.isStatic) {
			$page.unbind().delegate(obj.tagStr, 'click', function() {

				if ($page.parent().parent().parent() != null && $page.parent().parent().parent().length > 1) {
					offsetTops($page.parent().parent().parent().parent());
				} else {
					offsetTops($page.parent().parent().parent());
				};


				var $then = $(this);
				var page = $then.attr("page");
				if (page != undefined && !$then.hasClass(obj.active) && page != ' ' && page != ' ') {
					obj.pageIndex = page;
					var pageItem = $then.parent().parent().find('li');
					obj.pageCount = pageItem.eq(pageItem.length - 2).find('a').attr("page")
					pageStr = $this._createPage(obj);
					if (pageStr) {
						$page.html(pageStr[0]);
						$pageMobile.html(pageStr[1]);
					}
					if (obj.pageType == "WCM") {
						$this._getData(obj);
					} else {
						var results = {
							"pageIndex": obj.pageIndex,
							"pageCount": obj.pageCount
						};
						obj.ajaxData(results);
					}
				}
			});

			$page.delegate('#pagebutton', 'click', function(event) {
				event.stopImmediatePropagation();
				if ($page.parent().parent().parent() != null && $page.parent().parent().parent().length > 1) {
					offsetTops($page.parent().parent().parent().parent());
				} else {
					offsetTops($page.parent().parent().parent());
				};
				var $then = $(this);
				var allpage = parseInt($then.attr("page"));
				var page = parseInt($then.prev("#ht_codeinput").val());
				if (!isNaN(page)) {
					if (page > 0 && page <= allpage && page) {
						if (page != undefined && page != ' ') {
							obj.pageIndex = page;
							var pageItem = $then.parent().parent().find('li');
							obj.pageCount = pageItem.eq(pageItem.length - 2).find('a').attr("page")
							pageStr = $this._createPage(obj);
							if (pageStr) {
								$page.html(pageStr[0]);
								$pageMobile.html(pageStr[1]);
							}
							if (obj.pageType == "WCM") {
								$this._getData(obj);
							} else {
								var results = {
									"pageIndex": page,
									"pageCount": obj.pageCount
								};
								obj.ajaxData(results);
								return;
							}
						}
					} else {
						alert('请输入正确页码范围');
						return;
					}
				} else {
					alert("请输入数字！");
					return;
				}

			});
			$page.delegate("#ht_codeinput", "keyup", function(e) {
				var _this = $(this)
				var e = e || event,
					keycode = e.which || e.keyCode;
				if (e.keyCode == 13) {
					_this.next().trigger("click");
					_this.blur(); //处理事件
				}
			})



			$pageMobile.unbind().delegate('button', 'click', function() {

				// var top_sse_wrap_cn_con= $page.parent().parent().parent();
				// $('html,body').animate({scrollTop: top_sse_wrap_cn_con.offset().top}, 100);
				offsetTops($page.parent().parent().parent());

				var $then = $(this);
				var page = $then.attr("page");
				if (page != undefined && !$then.hasClass(obj.active) && page != ' ' && page != ' ' && page != "undefined") {
					obj.pageIndex = page;
					pageStr = $this._createPage(obj);
					if (pageStr) {
						$page.html(pageStr[0]);
						$pageMobile.html(pageStr[1]);
					}
					if (obj.pageType == "WCM") {
						$this._getData(obj);
					} else {
						var results = {
							"pageIndex": obj.pageIndex,
							"pageCount": obj.pageCount
						};
						obj.ajaxData(results);
					}
				}
			});
		}
	}

}

/**
 * 调用表头排序方法
 * id  表格ID
 * pageNo  当前页码 loadPage回调方法返回的当前页码
 * @type {[type]}
 * Li.chen  2016-03-25 23:21:44
 */
/**
    	调用
	    orderByTitle({
	        id:$('.con_block'), //表格ID
	        pageNo:tableData.params["pageHelp.pageNo"], //当前页码
	        order:"sortName,direction",//排序字段名,排序条件
	        tempData:tempData, //loadPage 请求参数
	        method:ajaxSearch01  //loadPage 回调方法
	    });
	    */

/**
 * 表头排序
 * $order 全局变量  order属性
 * $orderIndex 全局变量  当前列坐标
 * @type {String}
 * Li.chen  2016-03-25 23:20:48
 */
var $order = "",
	$orderIndex = "";

function orderByTitle(obj) {
	//表头点击事件
	obj.id.find("table tr:first th a").click(function() {
		//获取当前列order属性值 赋值给默认参数  给全局变量赋值
		// $order = obj.tempData.params.order = $(this).attr("order");
		$order = $(this).attr("order");
		if (obj.order.split(",").length > 1) {
			obj.tempData.params[obj.order.split(",")[0]] = $order.split(",")[0];
			obj.tempData.params[obj.order.split(",")[1]] = $order.split(",")[1] == null || $order.split(",")[1] == "desc" ? "desc" : "asc";
			if ($order.indexOf(",") < 0) {
				$order = $order + "," + obj.tempData.params[obj.order.split(",")[1]];
			};
		} else {
			obj.tempData.params[obj.order] = $order;
		}
		//获取当页码 赋值给默认参数
		// tempData.params.begin = obj.pageNo;
		obj.tempData.params["pageHelp.pageNo"] = obj.pageNo;
		//获取当前列坐标 以便于表头重新绘制后改变order属性值
		$orderIndex = $(this).parent().index();
		//重新绘制分页 并请求数据
		loadPage(
			obj.tempData, //请求参数
			{
				pageSelect: obj.id //分页输出模块ID
			},
			obj.method //回调方法
		);
	})
	//获取当前th列
	var $parentTh = obj.id.find("table tr:first th");
	//获取默认列
	var defOrder = $parentTh.find("a[orderDeafult=true]");

	if (defOrder) {
		var _order = defOrder.attr("order");
		//判断显示上下箭头
		var _TT = _order.indexOf(",asc") > 0 ? "glyphicon-arrow-up" : "glyphicon-arrow-down";
		defOrder.attr("order", _order.indexOf(",asc") > 0 ? _order.replace(",asc", ",desc") : _order.replace(",desc", ",asc"));
		//删除箭头模块
		$parentTh.find("i.fgrey").remove();
		//重新添加箭头
		defOrder.parent().append('<i class="fgrey"><span style="color: #347BB7;" class="glyphicon ' + _TT + '" aria-hidden="true"></span></i>');
		//删除默认属性
		defOrder.removeAttr('orderDeafult');
	};

	//当$order不为空时再执行下面代码、否则最后一句append会默认给第一列增加箭头
	if ($order) {
		var $parent = obj.id.find("table tr:first th:eq(" + $orderIndex + ")");
		//重新赋值a标签order属性
		$parent.find("a").attr("order", $order.indexOf(",asc") > 0 ? $order.replace(",asc", ",desc") : $order.replace(",desc", ",asc"));
		//判断显示上下箭头
		var _TT = $order.indexOf(",asc") > 0 ? "glyphicon-arrow-up" : "glyphicon-arrow-down";
		//删除箭头模块
		$parentTh.find("i.fgrey").remove();
		//重新添加箭头
		$parent.append('<i class="fgrey"><span style="color: #347BB7;" class="glyphicon ' + _TT + '" aria-hidden="true"></span></i>');
	};
}

//webserivce分页
var loadPage = function(tData, obj, ajaxHtml) {
	//var url = "data.json?pagesize=10&page=1";
	var url = tData.url;
	//初始化数据
	showloading();
	jQuery.ajax({
		url: url,
		type: "POST",
		dataType: "jsonp",
		jsonp: "jsonCallBack",
		jsonpCallback: "jsonpCallback" + Math.floor(Math.random() * (100000 + 1)),
		data: tData.params,
		cache: false,
		success: function(dataJson) {
			if (dataJson && dataJson.error) {
				hideloading();
				return;
			}
			var results = {
				"pageIndex": tData.params['pageHelp.pageNo'],
				"pageCount": dataJson.pageHelp.pageCount,
				dataJson: dataJson.result
			}; //APP接口返回的数据
			//填充html页面
			if (tData.isPageing) {
				obj.pageSelect.find('.page-con-table').show();
				obj.pageSelect.find('.mobile-page').show();
			}
			if (results.pageCount == null || results.pageCount == 1 || results.pageCount == 0) {
				obj.pageSelect.find(".page-con-table").hide();

			} else {
				obj.pageSelect.find(".page-con-table").show();
			}

			ajaxHtml(tData, obj, results, tData.pageCache, dataJson);



			tdclickable();


			hideloading()
			getPage({
				pageId: obj.pageSelect, //分页输出ID选择器
				headerKeep: 1, //头部预留页码数量 headerKeep + footerKeep 必须为偶数
				footerKeep: 1, //尾部预留页码数量 headerKeep + footerKeep 必须为偶数
				pageLength: 5, //页码显示数量,必须为奇数
				tagStr: 'a', //使用标签
				tagStr2: 'button', //使用标签
				classStr: 'classStr', //标签class
				idStr: 'idStr', //标签id
				nameStr: 'nameStr', //标签name
				disable: 'disable', //不能点击class
				active: 'active', //标签选中class
				prevName: '<span aria-hidden="true"  class="glyphicon glyphicon-menu-left"></span>',
				prevName2: '上一页', //手机版的button内容
				nextName: '<span aria-hidden="true" class="glyphicon glyphicon-menu-right"></span>',
				nextName2: '下一页',
				classPage: 'classPage', //上下页class
				pageType: 'APP', //分页类型
				ajaxData: function($this) {
					/**
						pageIndex: 当前页码
						pageCount：共多少页码
						*/
					if ($this != undefined) {
						var tempData = tableData[obj.pageSelect.attr('id')];
						if (tempData != undefined) {
							tData.params = tempData.params;
						}
						tData.params["pageHelp.pageNo"] = $this.pageIndex;
						tData.params["pageHelp.beginPage"] = $this.pageIndex;
						tData.params["pageHelp.endPage"] = $this.pageIndex + 1;
						var search_zhgg = $('.search_zhgg');
						if (search_zhgg.length > 0) {

							tData.params.effective_date = tempData.params.effective_date;

						}

						//查询数据
						showloading();
						jQuery.ajax({
							url: url,
							dataType: "jsonp",
							jsonp: "jsonCallBack",
							jsonpCallback: "jsonpCallback" + Math.floor(Math.random() * (100000 + 1)),
							data: tData.params,
							async: false,
							cache: false,
							success: function(dataJson) {
								var results = {
									"pageIndex": $this.pageIndex,
									"pageCount": dataJson.pageHelp.pageCount,
									dataJson: dataJson.result
								}; //APP接口返回的数据
								ajaxHtml(tData, obj, results, true, dataJson);

								tdclickable();

							},
							complete: function() {
								hideloading();
							},
							error: function(e) {}
						});
					} else {
						return results;
					}

				}
			});

		},
		error: function(e) {}
	});
};



function isArray(object) {
	return object && typeof object === 'object' &&
		typeof object.length === 'number' &&
		typeof object.splice === 'function' &&
		//判断length属性是否是可枚举的 对于数组 将得到false
		!(object.propertyIsEnumerable('length'));
}

//====
/* ************* Name ***************
// Readme: Query拼装table样式
// Example usage:
// Requires: jQuery 1.8.3+
*******************************************/
var ajaxT01 = function(tableData, obj, results, pageCache) {
	var headArr = tableData.header;

	var dataJson = results.dataJson;
	var htmlArr = [];
	//拼装头部



	htmlArr.push('<tr>');
	for (var i = 0; i < headArr.length; ++i) {
		var head = headArr[i];
		if (head != undefined) {
			var headDesc = head[1];
			var headLen = headDesc.length;
			if (isArray(headDesc)) {
				htmlArr.push('<th>' + headDesc[0] + '</th>');
			} else {
				htmlArr.push('<th>' + headDesc + '</th>');
			}
		}

	}
	htmlArr.push('</tr>');
	//9.28新增
	if (dataJson != null) {
		if (dataJson.length < 1) {
			htmlArr.push("<tr><td colspan='50'>未找到，只有0条数据！</td></tr>");
		}
		//拼装内容
		for (var i = 0; i < dataJson.length; ++i) {
			var data = dataJson[i];

			htmlArr.push('<tr>');
			for (var j = 0; j < headArr.length; ++j) {
				var head = headArr[j];
				if (head != undefined) {
					var tags = head[2];
					var isBund = false;
					var newTags = "";
					if (tags != undefined) {
						var param = [];
						//解析是否有连接
						for (var k = 0; k < tags[1].length; ++k) {
							var tag = tags[1][k]
							var tempData = data[tag[1]];
							var tempTag = tag[1];
							if (tempTag == "y") {
								tempData = "y";
							} else if (tempTag == "w") {
								tempData = "w";
							}
							if (tags[0] == "BondCheck" && tag[0] == "BOND_CODE") {
								isBund = true;
								newTags = bondUrlCheck(tempData);
							}
							if (k == 0) {
								param.push("?" + tag[0] + '=' + tempData);
							} else {
								param.push("&" + tag[0] + '=' + tempData);
							}
						}
						var strA = '<a target="_blank" href="' + tags[0] + param.join("") + '">' + data[head[0]] + '</a>';
						var headDesc = head[0];
						if (isArray(headDesc)) {
							strA = '<a target="_blank" href="' + tags[0] + param.join("") + '">' + headDesc[1] + '</a>';
							//htmlArr.push('<td><div class="'+headDesc[1]+'">'+data[head[0]]+'</div></td>');
						}
						if (isBund) {
							strA = '<a target="_blank" href="' + newTags + param.join("") + '">' + data[head[0]] + '</a>';
						}
						htmlArr.push('<td>' + strA + '</td>');

					} else {
						if (head[0] == 'JUCK_BOND_TYPE') {
							if (head[1] == '是否投资者适当性管理禁止买入') {
								if (data[head[0]] == '01') {
									//htmlArr.push('<td>是</td><td>-</td>');
									htmlArr.push('<td>-</td>');
								} else if (data[head[0]] == '02') {
									htmlArr.push('<td>是</td>');
									//htmlArr.push('<td>-</td><td>是</td>');
								} else if (data[head[0]] == '03') {
									//htmlArr.push('<td>是</td><td>是</td>');
									htmlArr.push('<td>是</td>');
								} else {
									htmlArr.push('<td>-</td>');
									//htmlArr.push('<td>-</td><td>-</td>');
								}
							}
						} else {


							//var head = headArr[i];
							var headDesc = head[1];
							var headLen = headDesc.length;
							if (isArray(headDesc)) {
								var headTag = headDesc[2];
								if (headTag != undefined) {

									var param = [];
									//解析是否有连接
									for (var k = 0; k < headTag[1].length; ++k) {
										var tag = headTag[1][k]
										param.push(headTag[0]);
										if (k == 0) {
											param.push("?" + tag[0] + '=' + data[tag[1]]);
										} else {
											param.push("&" + tag[0] + '=' + data[tag[1]]);
										}
									}
									htmlArr.push('<td><div class="' + headDesc[1] + '"><a target="_blank" href="' + param.join("") + '">' + data[head[0]] + '</a></div></td>');
								} else {
									var tempData = data[head[0]];
									if (tempData != null) {
										htmlArr.push('<td><div class="' + headDesc[1] + '">' + data[head[0]] + '</div></td>');
									} else {
										htmlArr.push('<td><div class="' + headDesc[1] + '">-</div></td>');
									}
								}


							} else {
								var tempData = data[head[0]];
								if (tempData != null) { //债券列表是否为担保
									if ($(".sffdb").length > 0 && headDesc && headDesc.indexOf('是否非担保') !== -1) {
										var obj1 = {
											N: '否',
											Y: '是'
										}
										htmlArr.push('<td><div class="align_right">' + (obj1[tempData] || '-') + '</div></td>');
									} else {
										htmlArr.push('<td>' + data[head[0]] + '</td>');
									}
								} else {
									htmlArr.push('<td>-</td>');
								}

								//htmlArr.push('<th>'+headDesc+'</th>');
							}



						}

					}
				}
			}
			htmlArr.push('</tr>');

		}
		//第一页缓存不加载
		if (pageCache) {
			obj.pageSelect.find('.table').html(htmlArr.join(""));
			hideloading();
		}
	}

}

var Control = function(obj) {
	this.obj = obj;
}


/* ************* Name ***************
// Readme: T05特殊表格
// Example usage:陆志翔
// Requires: jQuery 1.8.3+
*******************************************/
Control.prototype.tableT05 = function(obj) {
	var $tabItemlina = obj.selected;
	var $nav = $tabItemlina.find('.nav-tabs');
	//var $navSub = $nav.find('li');
	var tabArr = []; //tab标头
	var $tabData = $tabItemlina.find(".tab-content");
	var tabDataArr = []; //tab内容
	//创建内容区域
	//var dataHtml = $tabData.clone();
	//dataHtml.find('.tab-pane').attr("id","panel-"+(i+1));
	//创建表格头部
	var tempArr = [];
	tempArr.push("<tbody>");
	//创建表格内容
	for (var k = 0; k < this.obj.data.list.length; ++k) {
		var items = this.obj.data.list[k];
		if (items != '') {
			if (this.obj.isStriped == true && k % 2 != 0) {
				tempArr.push("<tr class='greybg'>");
			} else {
				tempArr.push("<tr>");
			}
			tempArr.push("<th>" + items[0] + "</th>");
			for (var l = 1; l < items.length; ++l) {
				var item = items[l]
				tempArr.push("<td>" + item + "</td>");
			}
			tempArr.push("</tr>");
		}
	}
	tempArr.push("</tobdy>");
	$tabData.find('.table').html(tempArr.join(""));
	//tabDataArr.push(dataHtml.html());
	//$nav.html(tabArr.join(""));
	//$tabData.html(tabDataArr.join(""));
}

/* ************* Name ***************
// Readme: T06特殊表格
// Example usage:吉金晶
// Requires: jQuery 1.8.3+
*******************************************/

Control.prototype.tableDiscolor = function(obj) {
	var $tabItem = obj.selected;
	var $nav = $tabItem.find('.nav-tabs');
	//var $navSub = $nav.find('li');
	var tabArr = []; //tab标头

	var $tabData = $tabItem.find(".tab-content");
	var tabDataArr = []; //tab内容
	for (var i = 0; i < tempData.length; ++i) {
		var itemData = tempData[i];
		//创建tab标头

		if (obj.isTab) {
			var item = $nav.clone();
			if (itemData.title == "") {
				itemData.title = i;
			}
			item.find('a').html(itemData.title);

			item.find('a').attr("href", "#panel-" + (i + 1));
			tabArr.push(item.html());
		}
		//创建内容区域
		var dataHtml = $tabData.clone();

		dataHtml.find('.tab-pane').attr("id", "panel-" + (i + 1));
		//创建表格头部
		var tempArr = [];
		tempArr.push("<tr><th class='w37'> </th>");
		for (var j = 0; j < tempData[i].header.length; ++j) {
			tempArr.push("<th>" + tempData[i].header[j][1] + "</th>");
		}
		tempArr.push("</tr>");
		//创建表格内容
		for (var k = 0; k < tempData[i].list.length; ++k) {
			var items = tempData[i].list[k];
			if (items.length != 0) {
				var comp = (items[(items.length - 1)]).trim();
				if (comp >= '26' && comp < '28') {
					tempArr.push("<tr><td class='w37'><img src='/images/ui/blue-ico.jpg'>");
				} else if (comp >= '28' && comp < '30') {
					tempArr.push("<tr><td class='w37'><img src='/images/ui/yellow-ico.jpg'>");
				} else if (comp >= '30') {
					tempArr.push("<tr><td class='w37'><img src='/images/ui/red-ico.jpg'>");
				}
			}

			//解析数据字段
			for (var l = 0; l < items.length; ++l) {
				var item = items[l]
				if (comp >= '26' && comp < '28') {
					if (!isNaN(item)) {
						tempArr.push("<td><i class='fblue ftarl'>" + item + "</i></td>");
					} else {
						tempArr.push("<td><i class='fblue'>" + item + "</i></td>");
					}
				} else if (comp >= '28' && comp < '30') {
					if (!isNaN(item)) {
						tempArr.push("<td><i class='fyellow ftarl'>" + item + "</i></td>");
					} else {
						tempArr.push("<td><i class='fyellow'>" + item + "</i></td>");
					}
				} else if (comp >= '30') {
					if (!isNaN(item)) {
						tempArr.push("<td><i class='fred ftarl'>" + item + "</i></td>");
					} else {
						tempArr.push("<td><i class='fred'>" + item + "</i></td>");
					}
				}

			}
			tempArr.push("</tr>");
		}

		dataHtml.find('.table').html(tempArr.join(""));
		tabDataArr.push(dataHtml.html());
		$tabItem.find('#desc').html(itemData.desc);
	}
	$nav.html(tabArr.join(""));
	$tabData.html(tabDataArr.join(""));

	$tabItem.find('.nav-tabs').find("li").eq(0).addClass("active").siblings().removeClass("active");
	$tabItem.find("#panel-1").addClass("active").siblings().removeClass("active");
};


Control.prototype.tableDisPlane = function(obj) {
	var $tabItemlina = obj.selected;
	var $nav = $tabItemlina.find('.nav-tabs');
	//var $navSub = $nav.find('li');
	var tabArr = []; //tab标头
	var $tabData = $tabItemlina.find(".tab-content");
	var tabDataArr = []; //tab内容
	for (var i = 0; i < this.obj.data.length; ++i) {
		var itemData = this.obj.data[i];
		//创建tab标头
		if (this.obj.isTab) {
			if (itemData.title != "") {
				var item = $nav.clone();
				item.find('a').html(itemData.title);
				item.find('a').attr("href", "#panel-" + (i + 1));
				tabArr.push(item.html());
			}
		}
		//创建内容区域
		var dataHtml = $tabData.clone();
		dataHtml.find('.tab-pane').attr("id", "panel-" + (i + 1));
		//创建表格头部
		var tempArr = [];
		var headerlength = this.obj.data[i].header.length;
		tempArr.push("<tr>");

		for (var j = 0; j < this.obj.data[i].header.length; ++j) {
			tempArr.push("<th>" + this.obj.data[i].header[j][1] + "</th>");
		}
		tempArr.push("</tr>");
		//创建表格内容
		var listLen = this.obj.data[i].list.length;
		if (listLen == 2) {
			tempArr.push("<tr><td colspan='50'>未找到，只有0条数据！</td></tr>");

		} else {
			for (var k = 0; k < listLen; ++k) {
				var items = this.obj.data[i].list[k];

				if (items.length != 0) {
					if (k < 1 || k == 3 || k == 6) {
						tempArr.push("<tr>");
					} else {
						tempArr.push("<tr class='turnover'>");
					}
				}

				//解析数据字段
				for (var l = 0; l < items.length; ++l) {
					var item = items[l]
					tempArr.push("<td class='trline'>" + item + "</td>");
				}
				if (items.length != 0) {
					tempArr.push("</tr>");
				}
			}
		}
		dataHtml.find('.table').html(tempArr.join("")).find("tr:even").addClass("greybg");
		tabDataArr.push(dataHtml.html());
	}
	$nav.html(tabArr.join(""));
	$tabData.html(tabDataArr.join(""));
	$tabItemlina.find('.nav-tabs').find("li").eq(0).addClass("active").siblings().removeClass("active");
	$tabItemlina.find("#panel-1").addClass("active").siblings().removeClass("active");
};



/* ************* Name ***************
// Readme: T01表格渲染
// Requires: jQuery 1.8.3+
//param:
	isTab:false,	//是否显示tab标签
	data:tempData,	//数据源
	isStriped:true	//是否隔行变色table
	*******************************************/
Control.prototype.tableT01 = function(obj) {
	var $selected = obj.selected;
	//创建表格头部
	var tempArr = [];
	var headerlength = this.obj.data.header.length;
	tempArr.push("<tr>");
	for (var j = 0; j < this.obj.data.header.length; ++j) {
		var itemT = this.obj.data.header[j];
		if (itemT != undefined) {
			var heardata = this.obj.data.header[j][1];
			var headDesc = heardata;
			if (heardata.indexOf("<th") > -1) {
				tempArr.push(heardata);
			} else {
				if (isArray(headDesc)) {
					tempArr.push('<th>' + headDesc[0] + '</th>');
				} else {
					tempArr.push("<th>" + heardata + "</th>");
				}
			}
		}
	}
	tempArr.push("</tr>");
	//创建表格内容
	var listLen = this.obj.data.list.length;
	if (listLen == 1) {
		tempArr.push("<tr><td colspan='50'>未找到，只有0条数据！</td></tr>");
	} else {
		for (var k = 0; k < listLen; ++k) {
			var items = this.obj.data.list[k];
			var tempItem = $.trim(items);
			if (tempItem.length != 0) {
				tempArr.push("<tr>");
				//解析数据字段
				for (var l = 0; l < items.length; ++l) {
					var item = items[l]
					tempArr.push("<td>" + item + "</td>");
				}
				tempArr.push("</tr>");
			}
		}
	}
	$selected.find('.table').html(tempArr.join("")).find('a').each(function() {
		$(this).attr("target", "_blank");
	});
	tdclickable();
};

function checkData(v) {
	var entry = {
		"'": "&apos;",
		'"': '&quot;',
		'<': '&lt;',
		'>': '&gt;'
	};
	v = v.replace(/(['")-><&\\\/\.])/g, function($0) {
		return entry[$0] || $0;
	});
	return v;
}
var getValue = function(pram1) {
	var str = window.location.search;
	var params = '';

	if (str.indexOf(pram1) != -1) {
		var pos_start = str.indexOf(pram1) + pram1.length + 1;
		var pos_end = str.indexOf("&", pos_start);
		if (pos_end == -1) {
			params = str.substring(pos_start);
		} else {
			params = str.substring(pos_start, pos_end);
		}
		return mergerByAbsorption(params);
	} else {
		return "";
	}
};

var mergerByAbsorption = function(code) {
	var new_code = '';
	if (code != '' && code != null) {
		if (code == '601313') {
			new_code = '601360';
		} else {
			new_code = code;
		}
	}
	return new_code;
}

$(function() {

	var $tableRootT01 = $(".js_tableT01");

	$tableRootT01.each(function() {
		var $this = $(this);
		var tabData = $this.attr("id");
		var tempData = tableData[tabData];
		var descdiv = $this.find(".sse_table_conment");
		var timediv = $this.find(".sse_table_title2");

		if (tempData != undefined) {
			//调用T01普通一维表格

			if (tempData.desc != undefined) {
				if (tempData.desc != "" && descdiv.length > 0) {
					descdiv.show();
					descdiv.find("p").html(tempData.desc);
				}
			}

			if (tempData.time != undefined) {

				if (tempData.time != "" && timediv.length > 0) {
					timediv.show();
					timediv.find("p").html(tempData.time);
				}
			}

			var control = new Control({
				isTab: true, //是否显示tab标签
				data: tempData, //数据源
				isStriped: true //是否隔行变色table
			});
			var $tabData = $("#" + tabData);
			control.tableT01({
				selected: $tabData
			});
			if (tempData.isPageing) {
				loadPage(tempData, {
					pageSelect: $tabData
				}, ajaxT01);
			}
		}
	});



	var $tableRootT05 = $(".js_tableT05");
	$tableRootT05.each(function() {
		var $this = $(this);
		var tabData = $this.attr("id");
		var tempData = tableData[tabData];

		if (tempData != undefined) {
			//调用T01普通一维表格
			var control = new Control({
				isTab: true, //是否显示tab标签
				data: tempData, //数据源
				isStriped: true //是否隔行变色table
			});
			var $tabData = $("#" + tabData);
			control.tableT05({
				selected: $tabData
			});
			if (tempData.isPageing) {
				loadPage(tempData, {
					pageSelect: $tabData
				}, ajaxT01);
			}
		}

	});



	//var tableFun ={};

	/* ************* Name ***************
	// Readme: T03分级表格渲染
	// Example usage: 乔琳娜
	// Requires: jQuery 1.8.3+
	//param:
		isTab:false,	//是否显示tab标签
		data:tempData,	//数据源
		isStriped:true	//是否隔行变色table
		*******************************************/

	var tableT03 = function(tempData) {

		var headArr = tempData.header;

		var tempArr = [];
		//拼装头部

		tempArr.push('<thead><tr>');
		for (var i = 0; i < headArr.length; ++i) {
			var head = headArr[i];
			if (i == 0) {
				tempArr.push('<th><b>' + head[1] + '</b></th>');
			} else {
				tempArr.push('<th><div class="td_text_center"><em>' + head[1] + '</em></div></th>');
			}


		}
		tempArr.push('</thead></tr>');
		//创建表格内容
		var listLen = tempData.list.length;
		if (listLen == 1) {
			tempArr.push("<tr><td colspan='50'>未找到，只有0条数据！</td></tr>");

		} else {
			tempArr.push('<tbody>')
			for (var k = 0; k < listLen; ++k) {
				var items = tempData.list[k];

				if (items.length != 0) {
					if (k == 0 || k == 3 || k == 4) {
						tempArr.push("<tr class='level_1'>");
					} else {
						tempArr.push("<tr class='level_2'>");
					}
				}
				//解析数据字段
				for (var l = 0; l < items.length; ++l) {
					var item = items[l]
					if (l == 0) {
						tempArr.push("<td><em>" + item + "</em></td>");
					} else {
						tempArr.push("<td><i>" + item + "</i></td>");
					}

				}
				if (items.length != 0) {
					tempArr.push("</tr>");
				}
			}
			tempArr.push('</tbody>')
		}
		$(".js_tableT03").find('.table').html(tempArr.join(""));
		if (tempData.desc != undefined && tempData.desc != "") {
			$(".js_tableT03").find(".sse_table_conment").find("p").html(tempData.desc);
		}
		if (tempData.time != undefined && tempData.time != "") {
			$(".js_tableT03").find(".sse_table_title2").show().find("p").html(tempData.time);
		}
	};


	var $tableRootT03 = $(".js_tableT03");
	var $this = $tableRootT03;
	var tabData = $this.attr("id");
	var tempData = tableData[tabData];
	var count = $tableRootT03.length;
	if (count > 0) {
		tableT03(tempData);
	}


	var share = function(obj) {
		var loc = obj.URL;
		var url = window.location.href;
		var title = $(".article-infor").find("h2").html();
		if (obj.TYPE == "1") {
			var siteUrl = url.substring(0, url.indexOf('.com.cn') + 8);
			var gourl = loc + "&title=" + title + "&url=" + url + "&appkey=" + obj.APPKEY + "&site=" + siteUrl + "&pic=" + obj.PIC;
			window.open(gourl, "_blank");
		} else {
			var gourl = loc + "?title=" + title + "&url=" + url + "&appkey=" + obj.APPKEY + "&pic=" + obj.PIC + "&summary=" + obj.SUMMARY + "&ralateUid=" + obj.RELATEUID;
			window.open(gourl, "_blank");
		}

	}

	function Sina() {
		share({
			TYPE: '2',
			URL: 'http://service.weibo.com/share/share.php',
			SOURCE: 'bookmark',
			APPKEY: '',
			PIC: '',
			SUMMARY: '',
			RELATEUID: ''
		});
	}

	function Tencent() {
		share({
			TYPE: '1',
			URL: 'http://share.v.t.qq.com/index.php?c=share&a=index',
			APPKEY: '',
			PIC: '',
			SITE: ''
		});
	}
	$(".sinaico").on("click", function() {
		Sina();
	});

	$(".tencentico").on("click", function() {
		Tencent();
	});

});



/**
 * 用于query分页
 */
var loadPaging = function(tData, obj, ajaxHtml) {
	//var url = "data.json?pagesize=10&page=1";
	var url = tData.url;
	//初始化数据

	jQuery.ajax({
		url: url,
		type: "POST",
		dataType: "jsonp",
		jsonp: "jsonCallBack",
		jsonpCallback: "jsonpCallback" + Math.floor(Math.random() * (100000 + 1)),
		data: tData.params,
		cache: false,
		success: function(dataJson) {
			var results = {
				"pageIndex": "1",
				"pageCount": dataJson.pageHelp.pageCount,
				dataJson: dataJson.result
			}; //APP接口返回的数据

			//防止一个页面多个分页显示错误
			if (!results.pageCount || results.pageCount == 1 || results.pageCount == 0) {
				obj.pageSelect.find('.page-con-table').hide();
				obj.pageSelect.find('.mobile-page').hide();
				// ajaxHtml(tData, obj, results, tData.pageCache, dataJson);
				// return;
			} else {
				//填充html页面
				if (tData.isPageing) {
					obj.pageSelect.find('.page-con-table').show();
					obj.pageSelect.find('.mobile-page').show();
				}
				// $(".page-con-table").show();
			}

			ajaxHtml(tData, obj, results, tData.pageCache, dataJson);
			getPage({
				pageId: obj.pageSelect, //分页输出ID选择器
				headerKeep: 1, //头部预留页码数量 headerKeep + footerKeep 必须为偶数
				footerKeep: 1, //尾部预留页码数量 headerKeep + footerKeep 必须为偶数
				pageLength: 5, //页码显示数量,必须为奇数
				tagStr: 'a', //使用标签
				tagStr2: 'button', //使用标签
				classStr: 'classStr', //标签class
				idStr: 'idStr', //标签id
				nameStr: 'nameStr', //标签name
				disable: 'disable', //不能点击class
				active: 'active', //标签选中class
				prevName: '<span aria-hidden="true"  class="glyphicon glyphicon-menu-left"></span>',
				prevName2: '上一页', //手机版的button内容
				nextName: '<span aria-hidden="true" class="glyphicon glyphicon-menu-right"></span>',
				nextName2: '下一页',
				classPage: 'classPage', //上下页class
				pageType: 'APP', //分页类型
				ajaxData: function($this) {
					/**
						pageIndex: 当前页码
						pageCount：共多少页码
						*/
					if ($this != undefined) {
						/*var tempData = tableData[obj.pageSelect.attr('id')];
						if(tempData!=undefined){
							tData.params = tempData.params;
						}*/
						tData.params["pageHelp.pageNo"] = $this.pageIndex;
						tData.params["pageHelp.beginPage"] = $this.pageIndex;
						tData.params["pageHelp.endPage"] = $this.pageIndex + 1;

						//查询数据
						showloading();
						jQuery.ajax({
							url: url,
							dataType: "jsonp",
							jsonp: "jsonCallBack",
							jsonpCallback: "jsonpCallback" + Math.floor(Math.random() * (100000 + 1)),
							data: tData.params,
							async: false,
							cache: false,
							success: function(dataJson) {
								var results = {
									"pageIndex": $this.pageIndex,
									"pageCount": dataJson.pageHelp.pageCount,
									dataJson: dataJson.result
								}; //APP接口返回的数据
								ajaxHtml(tData, obj, results, true, dataJson);
							},
							complete: function() {
								hideloading();
							},
							error: function(e) {}
						});
					} else {
						return results;
					}

				}
			});

		},
		error: function(e) {}
	});
};


Number.prototype.toFixedx = function(len) {
	if (!len) {
		len = 2;
	}
	var add = 0;
	var s, temp;
	var s1 = this + "";
	var isLessThanZero = false;
	if (Number(s1) < 0) {
		isLessThanZero = true;
		s1 = String(-(Number(s1)));
	}
	var start = s1.indexOf(".");
	if (start == -1) {
		s1 += ".";
		for (var i = 0; i < len; i++) {
			s1 += "0";
		}
		return s1;
	}
	var substr = s1.split(".");
	var decimal = substr[1];
	if (decimal.length <= len) {
		if (isLessThanZero) {
			s1 = -(Number(s1));
		}
		return s1;
	}
	if (s1.substr(start + len + 1, 1) >= 5) {
		add = 1;
	}
	var temp = Math.pow(10, len);
	s = Math.floor(s1 * temp) + add;
	var t;
	if (isLessThanZero) {
		t = -(Number(s / temp));
	} else {
		t = Number(s / temp);
	}
	return t;
};

//如果cell值时空值则赋个其他的值给它
var ifEmptyThenSetToOther = function(cellDate) {
	if (cellDate == null || cellDate == undefined || jQuery.trim(cellDate) == "null") {
		return "-";
	}
	return cellDate;
};


var Fractional = function(value, n) {
	if (isNaN(value)) {
		return ifEmptyThenSetToOther(value);
	}
	var ps = String(value).split(".");
	if (ps.length == 1) {
		return ifEmptyThenSetToOther(value);
	}
	var num = Number(value);
	if (num == 0) {
		return num;
	}
	return num.toFixedx(n);
};

var dateFormatter = function(d) {
	if (d == null || d == undefined || d == "null") {
		return "-";
	} else {
		return Fractional(d, 2);
	}
};



$(function() {
	//加载数据样式
	function insertItem(data) {
		var items = $(data).html();
		/**
		 * 屏蔽“上海证券交易所”字样   小梅提
		 * @param  {[type]} $("div.sse_wrap_cn_con div.list_pxtz").length > 0 [description]
		 * @return {[type]}                        [description]
		 */
		// if ($("div.sse_wrap_cn_con div.list_pxtz").length > 0) {
		// 	items = items.replace(/上海证券交易所/g,"");
		// };
		return items;
	}
	var $pageList = $(".js_listPage");
	if ($pageList.length > 0) {
		var $dataUrl = $pageList.find('#createPage').attr("page_name") + ".htm";
		getPage({
			pageId: $('.js_pageTable'), //分页输出ID选择器
			pageData: $pageList.attr("rel"), //数据输出选择器
			headerKeep: 1, //头部预留页码数量 headerKeep + footerKeep 必须为偶数
			footerKeep: 1, //尾部预留页码数量 headerKeep + footerKeep 必须为偶数
			pageLength: 7, //页码显示数量,必须为奇数
			tagStr: 'a', //使用标签
			classStr: 'classStr', //标签class
			idStr: 'idStr', //标签id
			nameStr: 'nameStr', //标签name
			disable: 'disable', //不能点击class
			active: 'active', //标签选中class
			prevName: '<span aria-hidden="true"  class="glyphicon glyphicon-menu-left"></span>',
			prevName2: '上一页', //手机版的button内容
			nextName: '<span aria-hidden="true" class="glyphicon glyphicon-menu-right"></span>',
			nextName2: '下一页',
			pageCount: $("#createPage").attr("page_count"),
			pageIndex: $("#createPage").attr("page_index"),
			classPage: 'classPage', //上下页class
			pageType: 'WCM', //分页类型
			ajaxData: insertItem, //异步请求
			ajaxType: 'post', //请求类型
			ajaxDataType: 'html', //数据类型
			dataUrl: $dataUrl //数据URL
		});
	}



	var $createPage = $(".js_createPage");
	if ($createPage.length > 0) {
		$createPage.each(function() {
			var $this = $(this);
			var $pageId = $this.siblings('.js_pageTable');
			var $rel = $this.find($this.attr("rel"));
			var $dataUrl = $this.find('.createPage').attr("page_name") + ".htm";
			var $pageCount = $this.find('.createPage').attr("page_count");
			var $pageIndex = $this.find('.createPage').attr("page_index");
			getPage({
				pageId: $pageId, //分页输出ID选择器
				pageData: $rel, //数据输出选择器
				headerKeep: 1, //头部预留页码数量 headerKeep + footerKeep 必须为偶数
				footerKeep: 1, //尾部预留页码数量 headerKeep + footerKeep 必须为偶数
				pageLength: 7, //页码显示数量,必须为奇数
				tagStr: 'a', //使用标签
				classStr: 'classStr', //标签class
				idStr: 'idStr', //标签id
				nameStr: 'nameStr', //标签name
				disable: 'disable', //不能点击class
				active: 'active', //标签选中class
				prevName: '<span aria-hidden="true"  class="glyphicon glyphicon-menu-left"></span>',
				prevName2: '上一页', //手机版的button内容
				nextName: '<span aria-hidden="true" class="glyphicon glyphicon-menu-right"></span>',
				nextName2: '下一页',
				pageCount: $pageCount,
				pageIndex: $pageIndex,
				classPage: 'classPage', //上下页class
				pageType: 'WCM', //分页类型
				ajaxData: insertItem, //异步请求
				ajaxType: 'post', //请求类型
				ajaxDataType: 'html', //数据类型
				dataUrl: $dataUrl //数据URL
			});
		});
	}
});


var fixedTablex = function() {
	// 2016-01-20 15:57:30
	require(['fixedTable'], function() {
		fixtables.initFixedTable();
	});
	// var fixedColumns = $(".fixedTables");
	// var isIElt7 = document.all && !document.querySelector;
	// if (fixedColumns.length && !isIElt7) {
	// 	var options = {
	// 		fixedColumnAttr : "fixedcol",
	// 		fixedColumnInsideWrap:".sse_table_T01",
	// 		fixedColumnClass : "fixedcolumn",
	// 		fixedTableWrapper : $("<div class='textfixedcolumnWrap'>")
	// 	};
	// 	fixedColumns.each(function(thisIndex,thisElement) {
	// 		var $this = $(thisElement);
	// 		var $allTr = $this.find("tr");
	// 		var fixedIndex = parseInt( $(thisElement).attr(options.fixedColumnAttr) );
	// 		var isth = $allTr.eq(0).find("th");
	// 		var istd = $allTr.eq(0).find("td");
	// 		var $forCountElemen; //获取用于计算宽度的元素
	// 		var countWidth = 0; //初始化计算的宽度
	// 		if (isth.length) { $forCountElemen = isth;}
	// 		if (istd.length) { $forCountElemen = istd;}
	// 		if (!isth.length && !isth.length) {return;}
	// 		$forCountElemen = $forCountElemen.eq(fixedIndex).prevAll();
	// 		$forCountElemen.each(function(i,el) {
	// 			var $el = $(el);
	// 			countWidth = countWidth + $el.outerWidth();
	// 		});
	// 		//console.log(countWidth);
	// 		var floadDiv = $('<div class="tableFloadColumn">');
	// 		$this.find(options.fixedColumnInsideWrap).append(floadDiv);
	// 		floadDiv.css({
	// 			overflow : 'hidden',
	// 			position: "absolute",
	// 			top: '0px',
	// 			left: '0px'
	// 		});
	// 		floadDiv.append(  $this.find("table").clone() );
	// 		floadDiv.width( countWidth );
	// 		$this.find(options.fixedColumnInsideWrap).css({
	// 			'margin-left':countWidth,
	// 			'overflow':'auto'
	// 		});
	// 		$this.find(options.fixedColumnInsideWrap).find("table").eq(0).css({
	// 			marginLeft: -countWidth
	// 		});
	// 	});
	// }
}

if ($('.fixedTables2').length > 0) {
	var fixedColumns = $(".fixedTables2");
	var isIElt7 = document.all && !document.querySelector;
	if (fixedColumns.length && !isIElt7) {
		var options = {
			fixedColumnAttr: "fixedcol",
			fixedColumnInsideWrap: ".sse_table_T01",
			fixedColumnClass: "fixedcolumn",
			fixedTableWrapper: $("<div class='textfixedcolumnWrap'>")
		};
		fixedColumns.each(function(thisIndex, thisElement) {
			var $this = $(thisElement);
			var $allTr = $this.find("tr");
			var fixedIndex = parseInt($(thisElement).attr(options.fixedColumnAttr));
			var isth = $allTr.eq(0).find("th");
			var istd = $allTr.eq(0).find("td");
			var $forCountElemen; //获取用于计算宽度的元素
			var countWidth = 0; //初始化计算的宽度
			if (isth.length) {
				$forCountElemen = isth;
			}
			if (istd.length) {
				$forCountElemen = istd;
			}
			if (!isth.length && !isth.length) {
				return;
			}
			$forCountElemen = $forCountElemen.eq(fixedIndex).prevAll();
			$forCountElemen.each(function(i, el) {
				var $el = $(el);
				countWidth = countWidth + $el.outerWidth();
			});
			//console.log(countWidth);
			var floadDiv = $('<div class="tableFloadColumn">');
			$this.find(options.fixedColumnInsideWrap).append(floadDiv);
			floadDiv.css({
				overflow: 'hidden',
				position: "absolute",
				top: '0px',
				left: '0px'
			});
			floadDiv.append($this.find("table").clone());
			floadDiv.width(countWidth);
			$this.find(options.fixedColumnInsideWrap).css({
				'margin-left': countWidth,
				'overflow': 'auto'
			});
			$this.find(options.fixedColumnInsideWrap).find("table").eq(0).css({
				marginLeft: -countWidth
			});
		});
	}
}

String.prototype.startsWithx = function(s) {
	if (s == null || s == "" || this.length == 0 || s.length > this.length) {
		return false;
	}
	if (this.substr(0, s.length) == s) {
		return true;
	} else {
		return false;
	}
	return true;
};

String.prototype.endsWithx = function(s) {
	if (s == null || s == "" || this.length == 0 || s.length > this.length) {
		return false;
	}
	if (this.substring(this.length - s.length) == s) {
		return true;
	} else {
		return false;
	}
	return true;
};
// 日期格式化 参数为字符串 eg: yyyy-MM-dd
Date.prototype.format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

function deschtmlshow(desc, searchdate, htmladd) {
	/*desc 日 = day 月 = mon 年 = year */
	/*searchdate yyyy-mm-dd*/
	var nowtime = get_systemDate_global()
	htmladd.hide();
	var monthnow = nowtime.substring(0, 7).replace(/\-/g, "");
	var yearnow = nowtime.substring(0, 4).replace(/\-/g, "");
	if (desc == 'day') {
		//	htmladd.show().find('p').html('*数据统计截止前1交易日');
	} else if (desc == 'mon') {
		searchdate = searchdate.substring(0, 7).replace(/\-/g, "");
		if (searchdate == monthnow) {
			htmladd.show().find('p').html('*本月度数据统计截止前1交易日');
		} else {
			htmladd.hide();
		}
	} else if (desc == 'year') {
		searchdate = searchdate.substring(0, 4).replace(/\-/g, "");
		if (searchdate == yearnow) {
			htmladd.show().find('p').html('*本年度数据统计截止前1交易月');
		} else {
			htmladd.hide();
		}
	}
};

define([], function() {
	var page = {};
	page.init = function() {



	}
	return page;
});