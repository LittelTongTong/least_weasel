define(["sseUtils"], function (sseUtils) {
    var companyCodePart = "[695012347]([0-9]{5})";
    var stockCodePart = "[69]([0-9]{5})";
    var popularize = {
        key: "VISITED_MENU",//访问过的栏目   cookie key
        codeIndex: { STOCK: 0, INDEX: 1, FUND: 2, BOND: 3, OPTIONS: 4, EBOND: 5, TBOND: 6, STOCK_FUND: 7 },
        //tagIndex:{js_code1:0,js_code2:1,js_code3:2,js_code4:3,js_code6:4},
        indexCode: { 0: "STOCK", 1: "INDEX", 2: "FUND", 3: "BOND", 4: "OPTIONS", 5: "EBOND", 6: "TBOND", 7: "STOCK_FUND"},

        //                     股票                            指数000开头                基金                  债券                         权证                  E 债券(1,2)打头              T债券(0)打头              股票＋基金
        codeCookieKeyArray: ["VISITED_STOCK_CODE", "VISITED_INDEX_CODE", "VISITED_FUND_CODE", "VISITED_BOND_CODE", "VISITED_OPTIONS_CODE", "VISITED_EBOND_CODE", "VISITED_TBOND_CODE", "VISITED_STOCK_FUND_CODE"],
        //                     股票代码正则            指数代码正则         基金代码正则              债券代码正则             权证代码正则            E债券代码正则         T债券代码正则
        codeExpStrArray: ["^[69]([0-9]{5})$", "^(000)([0-9]{3})$", "^[5][^8]([0-9]{4})$", "^[012347]([0-9]{5})$", "^(58)([0-9]{4})$", "^[12]([0-9]{5})$", "^[0]([0-9]{5})$", "^[69]([0-9]{5})|[5][^8]([0-9]{4})$"],
        keyCompanyCode: "VISITED_COMPANY_CODE",//访问过的公司代码   cookie key
        keySeeCookie: "seecookie",
        menuShowNumLmt: 5,//显示栏目数目的上限
        articleNumLmt: 5,//显示文章数目的上限
        menuNumLmt: 11,// cookie 中存储的栏目数目上限
        companyNumLmt: 20,//存储公司数目的上限
        companyNumShowLmt: 5,//显示公司数目的上限
        announcementNumLmt: 5,//公告数目的上限
        assistCodeShowNumLmt: 10,//提示代码上限
        repeatExeTimes: 10,//  重复执行次数
        repeatExeInterval: 500,//  重复执行时间间隔   毫秒
        searchResultConfig: { 2: { searchResultId: "desksearhTable", searchHistoryId: "desksearchHist" }, 3: { searchResultId: "searhTable", searchHistoryId: "searchHist" } },
        regExpStrCompanyCodePart: companyCodePart,
        regExpCompanyCode: new RegExp("^" + companyCodePart + "$"),
        regExpStrStockCodePart: stockCodePart,
        regExpStockCode: new RegExp("^" + stockCodePart + "$"),
        delimiter: ",",
        excludedMenu: "disclosure/listedinfo/announcement",//最新更新文章排除的栏目，披露-->最新公告
        dictionary:{"债券":"greenbondArray","资产支持证券":"greenzczczqArray","ETF":"greenetfArray","指数":"indexArray"},
        stockArray: [],
        fundArray: [],
        ebondArray: [],
        tbondArray: [],
        stockFundArray: [],
        bondArray: [],
        indexArray:[],
        greenbondArray:[],
        greenetfArray:[],
        greenzczczqArray:[],
        allProductArray: [],
        codeNameSplitExp: /\[|\]/g,
        deleteIconOriginalColor: "#999",
        deleteIconOriginalBgColor: "#fff",
        codeAssistActiveIndex: -1,
        initialTime: false,
        timeElapsed: 0,
        setOption: function (menuNumber, articleNumber) {
            this.menuShowNumLmt = menuNumber || this.menuShowNumLmt;
            this.articleNumLmt = articleNumber || this.articleNumLmt;
        },
        logVisitingMenu: function () {//记录当前访问的栏目

            var menuId = window.col_id;
            //if(/(\w+\.\w+\/home\/)$/i.test(window.location.href) || /(\w+\.\w+)$/i.test(window.location.href)){          //如果是网站首页  则不记录
            //if(/(\w+\.\w+\/home\/?)$/i.test(window.location.href) || /(\.sse\.com\.cn\/?)$/i.test(window.location.href)){          //如果是网站首页  则不记录
            if (/(\w+\.\w+\/home\/?)$/i.test(window.location.href) || /(\w+\.\w+\/?)$/i.test(window.location.href)) {          //如果是网站首页  则不记录
                return;
            }
            this.saveIntoCookie(menuId, this.key, this.menuNumLmt);

        },
        getLoggedMenu: function () {
            //return $.cookie(this.key) ? $.cookie(this.key) : "";
            return this.getCookie(this.key) ? this.getCookie(this.key) : "";
        },
        getLoggedStockCode: function () {
            return this.getLoggedCode(this.codeIndex.STOCK);
        },
        getLoggedFundCode: function () {
            return this.getLoggedCode(this.codeIndex.FUND);
        },
        getLoggedBondCode: function () {
            return this.getLoggedCode(this.codeIndex.BOND);
        },
        getLoggedEBondCode: function () {
            return this.getLoggedCode(this.codeIndex.EBOND);
        },
        getLoggedTBondCode: function () {
            return this.getLoggedCode(this.codeIndex.TBOND);
        },
        getLoggedOptionsCode: function () {
            return this.getLoggedCode(this.codeIndex.OPTIONS);
        },
        getLoggedStockFundCode: function () {
            return this.getLoggedCode(this.codeIndex.STOCK_FUND);
        },
        getLoggedCode: function (index) {
            //var codes = $.cookie(this.codeCookieKeyArray[index]);
            //if(codes){
            //    return JSON.parse(codes);
            //}
            //return [];

            var codes = this.getCookie(this.codeCookieKeyArray[index]);
            if (codes) {
                return JSON.parse(codes);
            }
            return [];
        },
        getLoggedCpyCode: function () {
            //return $.cookie(this.keyCpyCode) ? $.cookie(this.keyCpyCode) : "";
            return this.getCookie(this.keyCompanyCode) ? this.getCookie(this.keyCompanyCode) : "";
        },

        deleteCpyCodeFromCookie: function (val) {
            this.deleteFromCookie(val, this.keyCompanyCode);
        },
        deleteStockCodeFromCookie: function (val) {
            this.deleteFromCookie(val, this.codeCookieKeyArray[this.codeIndex.STOCK]);
        },
        deleteFundCodeFromCookie: function (val) {
            this.deleteFromCookie(val, this.codeCookieKeyArray[this.codeIndex.FUND]);
        },
        deleteBondCodeFromCookie: function (val) {
            this.deleteFromCookie(val, this.codeCookieKeyArray[this.codeIndex.BOND]);
        },
        deleteEBondCodeFromCookie: function (val) {
            this.deleteFromCookie(val, this.codeCookieKeyArray[this.codeIndex.EBOND]);
        },
        deleteTBondCodeFromCookie: function (val) {
            this.deleteFromCookie(val, this.codeCookieKeyArray[this.codeIndex.TBOND]);
        },
        deleteOptionsCodeFromCookie: function (val) {
            this.deleteFromCookie(val, this.codeCookieKeyArray[this.codeIndex.OPTIONS]);
        },
        deleteStockFundFromCookie: function (val) {
            this.deleteFromCookie(val, this.codeCookieKeyArray[this.codeIndex.STOCK_FUND]);
        },
        deleteCodeFromSeeCookie: function (val) {
            this.deleteFromCookie(val, this.keySeeCookie, true);
        },
        deleteFromCookie: function (val, key, isSavedAsStringValue) {
            val = String(val);
            //popularize.log("delete from cookie: val: "+val);
            var array = [];
            var loggedVals = popularize.getCookie(key);
            if (loggedVals.length > 0) {
                if (isSavedAsStringValue) {
                    array = loggedVals.split(popularize.delimiter);
                } else {
                    array = JSON.parse(loggedVals);
                }

                //popularize.log("before: ["+array.toString()+"]");
                var index = array.indexOf(val);
                if (index > -1) {       // 如果值已经存在移除数组中原来存在的值
                    array.splice(index, 1);
                }
                //popularize.log("after: ["+array.toString()+"]");
                if (isSavedAsStringValue) {
                    popularize.setCookie(key, array.join(popularize.delimiter));
                } else {
                    popularize.setCookie(key, JSON.stringify(array));
                }

            }

        },
        clear: function (key) {//清除cookie
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = this.getCookie(key);
            if (cval !== null) {
                document.cookie = key + "=" + cval + ";expires=" + exp.toGMTString();
            }
        },
        getCookie: function (key) {
            //return $.cookie(key) ? $.cookie(key) : "";


            var name = key + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) != -1) {
                    return unescape(c.substring(name.length, c.length));
                }
            }
            return "";


        },
        setCookie: function (key, val) {

            //$.cookie(k, v, { expires:7, path:'/'});
            //document.cookie = "domain=2016; expires=2026-06-27T06:18:39.000Z; path=/; domain="+document.domain.substr(document.domain.indexOf("."));

            val = escape(val);
            this.clear(key);
            var d = new Date();
            d.setTime(d.getTime() + (10000 * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            var domain = document.domain;
            domain = domain.substr(domain.indexOf("."));
            document.cookie = key + "=" + val + "; " + expires + "; path=/; domain=" + domain;
            // document.cookie = key + "=" + val + "; " + expires +"; path=/;";
        },
        getCodeCookieKey: function (code) {
            for (var i = 0; i < this.codeCookieKeyArray.length; i++) {

                if (new RegExp(this.codeExpStrArray[i]).test(code)) {
                    //popularize.log("code type: "+this.indexCode[i]);
                    return this.codeCookieKeyArray[i];
                }
            }
            //popularize.log("invalid code value: "+ code);
            return false;
        },
        writeMenuToPage: function (tagMenuList) {
            if (!tagMenuList) {
                return;
            }
            var loggedMenu = this.getLoggedMenu();
            if (loggedMenu && loggedMenu.length > 0) {

                var menuArray = JSON.parse(loggedMenu);
                var curMenuStr;
                var counter = 0;
                var html = ' <div class="a-button">';
                while ((curMenuStr = menuArray.pop()) != null && counter < this.menuShowNumLmt) {
                    //console.log("......."+curMenuStr);
                    var curMenu = sseMenuObj.formatNode(curMenuStr);
                    if (curMenu) {
                        var isSpecialNode = curMenu.label.indexOf("首页") != -1 || curMenu.label.indexOf("总貌") != -1 || curMenu.label.indexOf("总览") != -1;
                        if (isSpecialNode) {    //如果是专栏首页  则显示其父栏目  并在栏目名称后增加“专栏”两字
                            curMenu = sseMenuObj.formatNode(curMenu.pcode);
                            if (curMenu) {
                                var labelShow = curMenu["label"] + (curMenu["label"].indexOf("专栏") != -1 ? "" : "专栏");
                                html += "<a href='" + curMenu["href"] + "' target='_blank'><i class='arr-right'></i>" + labelShow + "</a>";
                            }
                        }
                        else {
                            html += "<a href='" + curMenu["href"] + "' target='_blank'><i class='arr-right'></i>" + curMenu["label"] + "</a>";
                        }

                        counter++;
                    }
                }
                html += '</div>';

                //console.log("html..."+html);
                $(tagMenuList).html("");
                $(tagMenuList).append(html);
            } else {
                $(tagMenuList).html('*本栏目内容根据您的历史访问记录推送');
            }
        },
        writeArticleToPage: function (tagArticleList) {
            if (!tagArticleList) {
                return;
            }
            var loggedMenu = this.getLoggedMenu();
            var finalMenuArray = [];
            if (loggedMenu && loggedMenu.length > 0) {

                var menuArray = JSON.parse(loggedMenu);
                var curMenuStr;
                var counter = 0;
                while ((curMenuStr = menuArray.pop()) != null) {
                    var curMenu = sseMenuObj.formatNode(curMenuStr);
                    if (!curMenu || curMenu["href"].indexOf(this.excludedMenu) != -1) {//如果当前是该排除的栏目 ，则跳过
                        continue;
                    }
                    var childrenNodes = sseMenuObj.getNodeChild();
                    finalMenuArray.push(curMenuStr);//添加当前栏目
                    if (childrenNodes && childrenNodes.length > 0) { //添加下面的全部子栏目
                        //finalMenuArray = finalMenuArray.concat(childrenNodes.split(";"));
                        for (var i = 0; i < childrenNodes.length; i++) {
                            var curChildNode = childrenNodes[i];
                            if (!curChildNode || curChildNode["href"].indexOf(this.excludedMenu) != -1) {
                                continue;
                            }
                            finalMenuArray.push(curChildNode["code"]);
                        }
                    }
                }
            }
            if (finalMenuArray.length > 0) {
                var searchword = "T_L cchannelcode T_E T_L" + finalMenuArray.join("T_D") + "T_R T_R";
                var queryURL = window.sseQueryURL || "http://query.sse.com/";
                $.ajax({
                    url: queryURL + "search/getSearchResult.do?search=qwjs",
                    type: "POST",
                    dataType: "jsonp",
                    jsonp: "jsonCallBack",
                    data: { "searchword": searchword, "page": "1", "orderby": "-CRELEASETIME", "perpage": "10" },
                    cache: false,
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    success: function (json) {
                        var articleList = json["data"];
                        if (articleList && articleList.length > 0) {
                            var html = '<div class="sse_list_1"><dl>';
                            for (var i = 0; i < articleList.length && i < popularize.articleNumLmt; i++) {
                                var article = articleList[i];
                                var title = article["CTITLE"];
                                var titleShow = "";
                                if (title != null && $.trim(title) != "") {
                                    titleShow = (title.length > 45 ? title.substr(0, 45) + "......" : title)
                                }
                                html += "<dd class='clearfix'><a href='" + article["CURL"] + "' title='" + title + "'>" + titleShow + "</a><span>" + article["CRELEASETIME"] + "</span></dd>";

                            }
                            html += '</dl></div>';
                            $(tagArticleList).html("");
                            $(tagArticleList).append(html);
                        } else {
                            $(tagArticleList).html("*本栏目内容根据您的历史访问记录推送");
                        }
                    },
                    error: function () {
                    }
                });
            } else {
                $(tagArticleList).html("*本栏目内容根据您的历史访问记录推送");
            }

        },
        log: function (message) {
            try {
                if (!window.console) {
                    window.console = {};
                    window.console.log = function () {
                        return;
                    }
                }
                window.console.log(message);
            } catch (e) {
            }
        },
        getProductArray: function (tagInput) {
            var productArray = [];
            if (tagInput.hasClass("js_code1")) {
                productArray = popularize.stockArray;
            }
            else if (tagInput.hasClass("js_code2")) {
                productArray = popularize.fundArray;
            }
            else if (tagInput.hasClass("js_code3")) {
                productArray = popularize.ebondArray;
            }
            else if (tagInput.hasClass("js_code4")) {
                productArray = popularize.tbondArray;
            }
            else if (tagInput.hasClass("js_code00")) {
                productArray = popularize.stockFundArray;
            }
            //else if(tagInput.hasClass("js_code5") ){
            else {
                productArray = popularize.allProductArray;
            }
            return productArray;
        },
        getCodesFromCookie: function (tagInput) {

            var historyCodeArray = [];
            if (tagInput.hasClass("js_code1")) {
                historyCodeArray = popularize.getLoggedStockCode();
            }
            else if (tagInput.hasClass("js_code2")) {
                historyCodeArray = popularize.getLoggedFundCode();
            }
            else if (tagInput.hasClass("js_code3")) {
                //historyCodeArray = popularize.getLoggedEBondCode();
                historyCodeArray = popularize.getLoggedBondCode();
            }
            else if (tagInput.hasClass("js_code4")) {
                //historyCodeArray = popularize.getLoggedTBondCode();
                historyCodeArray = popularize.getLoggedBondCode();
            }
            else if (tagInput.hasClass("js_code6")) {
                historyCodeArray = popularize.getLoggedOptionsCode();
            }
            else if (tagInput.hasClass("js_code00")) {
                historyCodeArray = popularize.getLoggedStockFundCode();
            }
            else {
                historyCodeArray = popularize.getLoggedCpyCode();
            }
            return historyCodeArray;
        },
        getHistoryCodesInfo: function (tagInput) {

            var cookieCodeArray = this.getCodesFromCookie(tagInput);
            var codeInfoArray = this.getProductArray(tagInput);

            var historyCodesInfo = [];
            for (var i = 0; i < cookieCodeArray.length; i++) {

                for (var j = 0; j < codeInfoArray.length; j++) {

                    if (codeInfoArray[j].val == cookieCodeArray[i]) {
                        historyCodesInfo.push(codeInfoArray[j]);
                        break;
                    }
                }
            }
            return historyCodesInfo;
        },
        bindEventToTagInputCode: function (tagInputCode) {

            //var tagAutoComplete = $("div#js_autocomplete");
            var tagAutoComplete = tagInputCode.siblings("div#js_autocomplete");
            if (tagAutoComplete.length == 0) {
                return;
            }
            var maxIndex = tagAutoComplete.find("a").length - 1;
            //var activeIndex = -1;
            popularize.codeAssistActiveIndex = -1
            //var originalColor2 = "#999";
            //var originalBgColor2 ="#fff";
            /*     tagInputCode.bind('input propertychange', function() {
                     popularize.showCodeAssist($(this).val(),$(this));
                 });*/


            var intervalWorks = [];
            tagInputCode.unbind().on("click", function (e) {
                e = e || event;
                e.stopPropagation();
                popularize.showHistoryCode($(this), false);

            })/*.bind('input propertychange', function() {
                popularize.showCodeAssist($(this).val(),$(this));
            })*/.keyup(function (e) {

                    e = e || event;
                    var keyCode = e.keyCode || e.which || e.charCode;//支持IE、FF
                    maxIndex = tagAutoComplete.find("a").length - 1;
                    if (keyCode == 40 || keyCode == 38) {
                        e.preventDefault();
                        popularize.autoCompleteUpDownKeyPressedHandle(keyCode, tagInputCode, tagAutoComplete, maxIndex);

                    }
                    else if (keyCode == 13) {// enter 键
                        var selectedItem = tagAutoComplete.find("ul>li.active>a");
                        if (selectedItem.length > 0) {
                            tagInputCode.val(selectedItem.attr("id"));
                        } else {
                            $(this).siblings("button#btnQuery").click();
                        }
                        tagAutoComplete.hide();
                        this.blur();

                        //$(this).siblings("button#btnQuery").click();
                        $(this).siblings("button#btnQuery").focus();


                        popularize.restoreAutoComplete(tagAutoComplete);
                    } else {
                        popularize.showCodeAssist($(this).val(), $(this));
                        popularize.codeAssistActiveIndex = -1;
                    }
                });
        },
        autoCompleteUpDownKeyPressedHandle: function (keyCode, tagInputCode, tagAutoComplete, maxIndex) {
            //下键
            if (keyCode == 40) {
                popularize.codeAssistActiveIndex++;
                if (popularize.codeAssistActiveIndex > maxIndex) {
                    popularize.codeAssistActiveIndex = 0;
                }
            }
            //上键
            else if (keyCode == 38) {
                popularize.codeAssistActiveIndex--;
                if (popularize.codeAssistActiveIndex < 0) {
                    popularize.codeAssistActiveIndex = maxIndex;
                }
            }
            var hasAssistCode = tagAutoComplete.find(">ul").children().length > 0;
            if (hasAssistCode) {
                //tagAutoComplete.find(">ul").show();
                tagAutoComplete.show();
            } else {
                tagAutoComplete.hide();
            }


            tagAutoComplete.find("ul>li").each(function (i, v) {
                if (i == popularize.codeAssistActiveIndex) {
                    var $this = $(this);
                    //popularize.log($this.html());
                    var tagPan = $this.find("span");
                    //popularize.log(tagPan.html());
                    tagPan.css("color", "#ff4949");
                    $this.css("background-color", "#337ab7");
                    $this.addClass("active");
                    tagInputCode.val($this.find(">a").attr("id"));
                }
                else {
                    var $this = $(this);
                    var tagPan = $this.find("span");
                    tagPan.css("color", popularize.deleteIconOriginalColor);
                    $this.css("background-color", popularize.deleteIconOriginalBgColor);
                    $this.removeClass("active");
                }
            });
        },
        restoreAutoComplete: function (tagAutoComplete) {

            tagAutoComplete.find("ul>li").each(function (i, v) {
                var $this = $(this);
                var tagPan = $this.find("span");
                tagPan.css("color", popularize.deleteIconOriginalColor);
                $this.css("background-color", popularize.deleteIconOriginalBgColor);
                $this.removeClass("active");
            });
            popularize.codeAssistActiveIndex = -1;
            tagAutoComplete.hide();
        },
        showCodeAssist: function (inputValue, tagInputCode) {
            var historyMatchedNum = this.showHistoryCode(tagInputCode, false);
            var _this =this;
            var tagInputCodeafter = tagInputCode.parent().next().find(".nav").children().hasClass("active");
            var js_code5 =tagInputCode.attr("class").indexOf("js_code5") !=-1;
             var js_code8 =tagInputCode.attr("class").indexOf("js_code8") !=-1;
            if(tagInputCodeafter && js_code5){
                var codeInfoArray=""
                tagInputCode.parent().next().find(".nav").children().each(function(){
                    if($(this).hasClass("active")){
                        var dictionary =_this.dictionary
                         codeInfoArray =_this[dictionary[$(this).text().trim()]];
                     }
                });
            }else if( js_code8){
                var codeInfoArray = _this.indexArray;
             
            }else{
                var codeInfoArray = this.getProductArray(tagInputCode);
            }         
            var codeInfoStr;
            var counter = 0;
            var _s = "";
            var remainingNum = popularize.assistCodeShowNumLmt - historyMatchedNum;
            if (remainingNum > 0) {
                for (var i = 0; i < codeInfoArray.length; i++) {
                    var obj = codeInfoArray[i];
                    if (tagInputCode.hasClass("js_code00")) {
                        if (new RegExp(popularize.codeExpStrArray[popularize.codeIndex.STOCK_FUND]).test(obj.val)) {
                            codeInfoStr = obj.val + "[" + obj.val2 + "][" + obj.val3 + "]";
                            if (codeInfoStr.indexOf(inputValue) > -1) {
                                var code = obj.val;
                                var name = obj.val2;
                                _s = _s + '<li><a href="javascript:;" id="' + code + '" special="' + code + '%"  >[' + code + ']' + name + '</a></li>';
                                counter++;
                                if (counter >= remainingNum) break;
                            }
                        };
                    } else {
                        codeInfoStr = obj.val + "[" + obj.val2 + "][" + obj.val3 + "]";
                        //kIndex = codeInfoStr.toLowerCase().indexOf(code.toLowerCase());
                        if (codeInfoStr.indexOf(inputValue) > -1) {
                            var code = obj.val;
                            var name = obj.val2;
                            _s = _s + '<li><a href="javascript:;" id="' + code + '" special="' + code + '%"  >[' + code + ']' + name + '</a></li>';
                            counter++;
                            if (counter >= remainingNum) break;
                        }
                    };
                }

                //var tagAutoComplete = $("#js_autocomplete");
                var tagAutoComplete = tagInputCode.siblings("div#js_autocomplete");

                popularize.adjustPosition(tagInputCode, tagAutoComplete);
                $(window).unbind().resize(function () {
                    popularize.adjustPosition(tagInputCode, tagAutoComplete);
                    $("a[special='601313%']").parent().remove();
                });

                //var tagPanMenu =  $("#js_panMenu");
                var tagPanMenu = tagAutoComplete.children("ul#js_panMenu");

                var isWrapperHide = inputValue == "" || _s == "";


                tagPanMenu.html(_s).find('a').unbind().click(function () {
                    var $this = $(this);
                    tagInputCode.val($this.attr('id'));
                    tagInputCode.siblings("button#btnQuery").focus();
                    tagAutoComplete.hide();
                });
                var hasAssistCode = tagAutoComplete.find(">ul").children().length > 0;

                if (!hasAssistCode) {
                    tagAutoComplete.hide();
                } else {
                    tagAutoComplete.show();

                }
            }
            $("a[special='601313%']").parent().remove();
            // $("special#601313").parent().hide();
        },
        showHistoryCode: function (tagInputCode, isWrapperHide) {
            var code = tagInputCode.val();
            //var tagAutoComplete = $("#js_autocomplete");
            var tagAutoComplete = tagInputCode.siblings("div#js_autocomplete");

            popularize.adjustPosition(tagInputCode, tagAutoComplete);
            $(window).unbind().resize(function () {
                popularize.adjustPosition(tagInputCode, tagAutoComplete);
            });
            //var tagPanMenuHistory = $("#js_panMenu_history");
            var tagPanMenuHistory = tagAutoComplete.children("ul#js_panMenu_history");
            var js_code5 =  $(".js_code5").length>0
            var js_code8 =  $(".js_code8").length>0
            var counter = 0;
            if (tagPanMenuHistory.length > 0 &&  !js_code5 && !js_code8) {         //history

                var historyCodesInfo = this.getHistoryCodesInfo(tagInputCode);
                var historyHtml = "";
                for (var j = historyCodesInfo.length - 1; j >= 0 && counter < popularize.assistCodeShowNumLmt; j--) {
                    var curCodeInfo = historyCodesInfo[j];
                    var codeInfoStr = curCodeInfo.val + "[" + curCodeInfo.val2 + "][" + curCodeInfo.val3 + "]";
                    if (!code || codeInfoStr.toLowerCase().indexOf(code.toLowerCase()) > -1) {
                        historyHtml += '<li><i></i>';
                        historyHtml += '<a href="javascript:;" style="display:inline-block;"  special="' + curCodeInfo.val + '%"   id="' + curCodeInfo.val + '" >[' + curCodeInfo.val + ']' + curCodeInfo.val2 + '</a>';
                        historyHtml += '<span class="glyphicon glyphicon-remove"  style="cursor:pointer;color:#999;background-color: transparent; position: absolute; right: 5px; line-height: 41px;" id="' + curCodeInfo.val + '" title="删除"></span>';
                        historyHtml += '</li>';
                        counter++
                    }

                }
                //isWrapperHide = isWrapperHide && (historyHtml == "");
                var hasAssistCode = tagAutoComplete.find(">ul").children().length > 0;

                 if (!hasAssistCode) {
                    tagAutoComplete.hide();
                } else {
                    $("div#js_autocomplete").hide();//隐藏所有
                   var tage  = tagInputCode.attr("class").indexOf("js_code5")!=-1
                    if(!tage){
                    tagAutoComplete.show();//显示当前
                    tagAutoComplete.find(">ul").show();
                    }
                }
                tagPanMenuHistory.html(historyHtml);

                tagPanMenuHistory.find('a').unbind().click(function () {
                    var $this = $(this);
                    tagInputCode.val($this.attr('id'));
                    tagInputCode.siblings("button#btnQuery").focus();
                    tagAutoComplete.hide();
                    $("a[special='601313%']").parent().remove();
                });
                $("a[special='601313%']").parent().remove();
                tagPanMenuHistory.find('span.glyphicon-remove').unbind().click(function (e) {
                    e = e || event;
                    e.stopPropagation();
                    var $this = $(this);
                    var code = $this.attr('id');
                    if (tagInputCode.hasClass("js_code1")) {
                        popularize.deleteStockCodeFromCookie(code);
                    }
                    else if (tagInputCode.hasClass("js_code2")) {
                        popularize.deleteFundCodeFromCookie(code);
                    }
                    else if (tagInputCode.hasClass("js_code3")) {
                        popularize.deleteBondCodeFromCookie(code);
                    }
                    else if (tagInputCode.hasClass("js_code4")) {
                        popularize.deleteBondCodeFromCookie(code);
                    }
                    else if (tagInputCode.hasClass("js_code6")) {
                        popularize.deleteOptionsCodeFromCookie(code);
                    }
                    else if (tagInputCode.hasClass("js_code00")) {
                        popularize.deleteStockFundFromCookie(code);
                    }
                    popularize.deleteCodeFromSeeCookie(code);
                    $this.parent().remove();
                });
                var originalColor;
                var originalBgColor;
                tagPanMenuHistory.find('>li').unbind().on("mouseover", function (e) {

                    var $this = $(this);
                    var tagPan = $this.find("span");
                    originalColor = tagPan.css("color");
                    //tagPan.css("color","red");
                    tagPan.css("color", "#ff4949");

                    originalBgColor = $this.css("background-color");
                    $this.css("background-color", "#337ab7");
                    $("a[special='601313%']").parent().remove();

                }).on("mouseout", function (e) {
                    var $this = $(this);
                    var tagPan = $this.find("span");
                    tagPan.css("color", originalColor);
                    $this.css("background-color", originalBgColor);
                    $("a[special='601313%']").parent().remove();
                });
            }
            return counter;
        },
        adjustPosition: function (tagInputCode, tagAutoComplete) {

            var posX = tagInputCode.position().left;
            var top = tagInputCode.position().top;
            var posY = top + tagInputCode.outerHeight();
            tagAutoComplete.css({ left: posX, top: posY });
            $("a[special='601313%']").parent().remove();
        },
        logVisitingCpy: function () {

            //中页面中的查询
            var inputCode = $("input#inputCode,input#inpCode");
            var btnQuery = $("button#btnQuery");
            var tagAutoComplete = $("div#js_autocomplete");
            if (inputCode.length > 0) {
                //this.bindEventToTagInputCode(inputCode);
                inputCode.each(function () {
                    popularize.bindEventToTagInputCode($(this));
                });
                $(document).on("click", function () {
                    popularize.restoreAutoComplete(tagAutoComplete);
                    //$("div#js_autocomplete").hide();
                });
            }
            if (btnQuery.length > 0) {
                btnQuery.on("click", function () {
                    //popularize.saveCpyIntoCookie($.trim(inputCode.val()),"",1);
                    var tagInputCode = $(this).siblings("input#inputCode");
                    var inputVal = tagInputCode.val();
                    popularize.saveCpyIntoCookie($.trim(inputVal), tagInputCode, 1);
                });
            }


            //大页面 右上角搜索
            var serinpt = $("#serinpt");
            var search_btn = $("input:button.search_btn");
            if (serinpt.length > 0 && search_btn.length > 0) {
                search_btn.on("click", function () {
                    popularize.saveCpyIntoCookie($.trim(serinpt.val()), "", 2);
                });

                //Li.chen 2016-02-26 13:59:28
                var liIndex = -1;
                serinpt.keyup(function (e) {
                    /* Act on the event */
                    var desksearhInput = $("#desksearhInput");
                    desksearhInput.find(">ul li").removeClass("active");
                    var liLen = desksearhInput.find(">ul li").length - 1;
                    e = e || event;
                    var keyCode = e.keyCode || e.which || e.charCode;//支持IE、FF
                    if (keyCode == 40) {
                        e.preventDefault();
                        liIndex++;
                        if (liIndex > liLen) {
                            liIndex = 0;
                        }
                        popularize.autoKeyListToInput(serinpt, liIndex, desksearhInput);
                    } else if (keyCode == 38) {
                        e.preventDefault();
                        liIndex--;
                        if (liIndex < 0) {
                            liIndex = liLen;
                        }
                        popularize.autoKeyListToInput(serinpt, liIndex, desksearhInput);
                    }
                });
            }


            //全文检索页面
            var searchword = $("#searchword");
            var query_btn = $("input:button.query_btn");
            if (searchword.length > 0 && query_btn.length > 0) {
                query_btn.on("click", function () {
                    popularize.saveCpyIntoCookie($.trim(searchword.val()), "", 3);
                });

                //Li.chen 2016-02-26 13:59:28
                var liIndex = -1;
                searchword.focus(function () {
                    // console.log(searhInput.find(">ul li").length);
                });
                searchword.keyup(function (e) {
                    /* Act on the event */
                    var searhInput = $("#searhInput");
                    searhInput.find(">ul li").removeClass("active");
                    var liLen = searhInput.find(">ul li").length - 1;
                    e = e || event;
                    var keyCode = e.keyCode || e.which || e.charCode;//支持IE、FF
                    if (keyCode == 40) {
                        e.preventDefault();
                        liIndex++;
                        if (liIndex > liLen) {
                            liIndex = 0;
                        }
                        popularize.autoKeyListToInput(searchword, liIndex, searhInput);
                    } else if (keyCode == 38) {
                        e.preventDefault();
                        liIndex--;
                        if (liIndex < 0) {
                            liIndex = liLen;
                        }
                        popularize.autoKeyListToInput(searchword, liIndex, searhInput);
                    }
                });
            }
            $(function () {
                popularize.bindOnclickToLink();
            });

        },
        autoKeyListToInput: function (inputId, zIndex, searhInput) {
            var active_li = searhInput.find(">ul li:eq(" + zIndex + ")").addClass("active");
            var active_li_text = active_li.attr("value");
            // var regx = new RegExp(/(\d{6})/);//匹配  [XXXXXX]XXXX
            // if (regx.test(active_li_text)) {
            //     inputId.val(active_li_text.match(regx)[0]);
            // }else{
            //     inputId.val(active_li_text);
            // }
            inputId.val(active_li_text);
        },
        bindOnclickToLink: function () {    //只记录股票代码

            //中页面中的链接
            var codePartMatchRegExpStr = popularize.regExpStrCompanyCodePart;
            var codeMatchRegExp = popularize.regExpCompanyCode;


            var isBindSuccess = false;
            var tagDivList = $("div.sse_list_1");
            var tagTabList = $("div.tabbable");
            var tagTableList = $("table.table");
            var allList = $.merge(tagDivList, tagTabList);
            allList = $.merge(allList, tagTableList);

            allList.on("click", "a", function (e) {
                var regExp1 = new RegExp("index.*\\.shtml\\?.*COMPANY_CODE=" + codePartMatchRegExpStr, "i");
                var regExp2 = new RegExp("((announcement)|(periodicreport)|(temporary))\\/index\\.shtml\\?productId=" + codePartMatchRegExpStr, "i");
                var regExp3 = new RegExp("announcement\\/c\\/((?:19|20)\\d\\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])\\/" + codePartMatchRegExpStr, "i");
                var regExp4 = new RegExp("summaries\\/indexDetail\\.shtml", "i");
                var regExp5 = new RegExp("\\/assortment\\/stock\\/list\\/companyIndex\\.shtml", "i");
                var regExp6 = new RegExp("index.*\\.shtml\\?.*FUNDID=" + codePartMatchRegExpStr, "i");
                var regExp7 = new RegExp("index.*\\.shtml\\?.*BOND_CODE=" + codePartMatchRegExpStr, "i");
                var regExp8 = new RegExp("creditasset\\/.*\\/c\\/" + companyCodePart, "i");
                var regExp9 = new RegExp("tenderoffer\\/.*detail.*\\.shtml\\?companyCode=" + companyCodePart, "i");
                if (this.href.match(regExp1)) {
                    var href = $(this).attr("href");
                    var identification = "company_code=";
                    var index = href.toLowerCase().indexOf(identification) + identification.length;
                    var cpyCode = href.substr(index, 6);
                    if (codeMatchRegExp.test(cpyCode)) {
                        popularize.saveCpyIntoCookie(cpyCode, "", 4);
                    }
                    else {
                        //popularize.log("非法的公司代码： "+cpyCode);
                    }
                }
                else if (this.href.match(regExp2)) {
                    var href = $(this).attr("href");
                    var identification = "productid=";
                    var index = href.toLowerCase().indexOf(identification) + identification.length;
                    var cpyCode = href.substr(index, 6);
                    if (codeMatchRegExp.test(cpyCode)) {
                        popularize.saveCpyIntoCookie(cpyCode, "", 4);
                    }
                    else {
                        //popularize.log("非法的公司代码： "+cpyCode);
                    }
                }
                else if (this.href.match(regExp3)) {
                    var href = $(this).attr("href");
                    var regExp = new RegExp(codePartMatchRegExpStr + "_", "i");
                    var index = href.search(regExp);
                    var cpyCode = href.substr(index, 6);
                    if (codeMatchRegExp.test(cpyCode)) {
                        popularize.saveCpyIntoCookie(cpyCode, "", 4);
                    }
                    else {
                        //popularize.log("非法的公司代码： "+cpyCode);
                    }

                }
                else if (this.href.match(regExp4)) {
                    var text = $.trim($(this).text());
                    //popularize.log("text: "+text);
                    var regExpText = new RegExp("^(\\(" + codePartMatchRegExpStr + "\\))", "i");
                    if (text.match(regExpText)) {
                        var text = $.trim($(this).text());
                        //(603169)“兰石重装”公布关于非公开发
                        var cpyCode = text.substr(0, 8).replace(/\(|\)/g, "");
                        if (codeMatchRegExp.test(cpyCode)) {
                            popularize.saveCpyIntoCookie(cpyCode, "", 4);
                        }
                        else {
                            //popularize.log("非法的公司代码： "+cpyCode);
                        }
                    }

                }
                else if (this.href.match(regExp5)) {
                    var text = $.trim($(this).text());
                    //popularize.log("text: "+text);
                    var regExpText = new RegExp(codePartMatchRegExpStr, "i");
                    if (text.match(regExpText)) {
                        var cpyCode = $.trim($(this).text());
                        if (codeMatchRegExp.test(cpyCode)) {
                            popularize.saveCpyIntoCookie(cpyCode, "", 4);
                        }
                        else {
                            //popularize.log("非法的公司代码： "+cpyCode);
                        }
                    }
                }
                else if (this.href.match(regExp6)) {
                    var href = $(this).attr("href");
                    var identification = "fundid=";
                    var index = href.toLowerCase().indexOf(identification) + identification.length;
                    var cpyCode = href.substr(index, 6);
                    if (codeMatchRegExp.test(cpyCode)) {
                        popularize.saveCpyIntoCookie(cpyCode, "", 4);
                    }
                    else {
                        //popularize.log("非法的公司代码： "+cpyCode);
                    }
                }
                else if (this.href.match(regExp7)) {
                    var href = $(this).attr("href");
                    var identification = "bond_code=";
                    var index = href.toLowerCase().indexOf(identification) + identification.length;
                    var cpyCode = href.substr(index, 6);
                    if (codeMatchRegExp.test(cpyCode)) {
                        popularize.saveCpyIntoCookie(cpyCode, "", 4);
                    }
                    else {
                        //popularize.log("非法的公司代码： "+cpyCode);
                    }
                }
                else if (this.href.match(regExp8)) {
                    var href = $(this).attr("href");
                    var regExp = new RegExp("\\/" + codePartMatchRegExpStr, "i");
                    var index = href.search(regExp);
                    var cpyCode = href.substr(index + 1, 6);
                    if (codeMatchRegExp.test(cpyCode)) {
                        popularize.saveCpyIntoCookie(cpyCode, "", 4);
                    }
                    else {
                        //popularize.log("非法的公司代码： "+cpyCode);
                    }
                }
                else if (this.href.match(regExp9)) {
                    var href = $(this).attr("href");
                    var identification = "companycode=";
                    var index = href.toLowerCase().indexOf(identification) + identification.length;
                    var cpyCode = href.substr(index, 6);
                    if (codeMatchRegExp.test(cpyCode)) {
                        popularize.saveCpyIntoCookie(cpyCode, "", 4);
                    }
                    else {
                        //popularize.log("非法的公司代码： "+cpyCode);
                    }
                }
            });
        },
        saveCpyIntoCookie: function (cpyCode, tagInputCode, indicator) {

            //popularize.log("indicator:"+indicator);
            if (indicator != 2 && indicator != 3) {   //    非大页面搜索 和全文检索   才做正则校验
                if (!popularize.regExpCompanyCode.test(cpyCode)) {      //验证是否符合公司代码规范  如：600000
                    //popularize.log("the company code doesn't meet the condition");
                    return;
                }
            }

            if (indicator == 1) {         //中页面查询     记录股票，基金，债券，期权 代码
                //popularize.log("cpyCode:"+cpyCode);
                //var regCompanyCode = new RegExp("^6([0-9]{5})$");

                var companyInfoObj = popularize.getCompanyInfoObj(cpyCode, tagInputCode);
                //popularize.log("--------------companyInfoObj-----------------");
                //popularize.log(companyInfoObj);
                if (!companyInfoObj) {    // 验证是否合法的公司代码， 存在数据库中
                    //popularize.log(cpyCode+" : company code is invalid");
                    return;
                }

                if (tagInputCode.hasClass("js_code1")) {   //股票查询页面
                    //popularize.log("股票查询页面");
                    //popularize.saveIntoCookie(cpyCode,popularize.keyCpyCode,popularize.cpyNumLmt);

                    popularize.saveIntoCookie(cpyCode, popularize.codeCookieKeyArray[popularize.codeIndex.STOCK], popularize.companyNumLmt);
                }
                else if (tagInputCode.hasClass("js_code2")) {//基金查询页面
                    //popularize.log("基金查询页面");
                    popularize.saveIntoCookie(cpyCode, popularize.codeCookieKeyArray[popularize.codeIndex.FUND], popularize.companyNumLmt);

                }
                else if (tagInputCode.hasClass("js_code3")) {//E债券查询页面
                    //popularize.log("债券查询页面");
                    //popularize.saveIntoCookie(cpyCode,popularize.codeCookieKeyArray[popularize.codeIndex.EBOND],popularize.cpyNumLmt);
                    popularize.saveIntoCookie(cpyCode, popularize.codeCookieKeyArray[popularize.codeIndex.BOND], popularize.companyNumLmt);

                }
                else if (tagInputCode.hasClass("js_code4")) {//T债券查询页面
                    //popularize.log("债券查询页面");
                    //popularize.saveIntoCookie(cpyCode,popularize.codeCookieKeyArray[popularize.codeIndex.TBOND],popularize.cpyNumLmt);
                    popularize.saveIntoCookie(cpyCode, popularize.codeCookieKeyArray[popularize.codeIndex.BOND], popularize.companyNumLmt);

                }
                else if (tagInputCode.hasClass("js_code6")) {//期权查询页面
                    //popularize.log("期权查询页面");
                    popularize.saveIntoCookie(cpyCode, popularize.codeCookieKeyArray[popularize.codeIndex.OPTIONS], popularize.companyNumLmt);

                }
                else if (tagInputCode.hasClass("js_code00")) {//基金＋股票代码
                    // popularize.log("基金＋股票代码");
                    popularize.saveIntoCookie(cpyCode, popularize.codeCookieKeyArray[popularize.codeIndex.STOCK_FUND], popularize.companyNumLmt);

                }
                else {
                    //popularize.log("未知代码类型: input tag with class:"+$("#inputCode").attr("class"));
                }

                popularize.saveIntoCookie(cpyCode, popularize.keyCompanyCode, popularize.companyNumLmt);
                var seeCookieValue = "[" + companyInfoObj.code + "]:" + companyInfoObj.name;     //  [600000]:浦发银行
                popularize.saveIntoCookie(seeCookieValue, popularize.keySeeCookie, popularize.companyNumLmt, true);
                //var cookieKey =  popularize.getCodeCookieKey(cpyCode);
                //if(cookieKey){
                //    popularize.saveIntoCookie(cpyCode,cookieKey,popularize.cpyNumLmt);
                //}

            }
            else if (indicator == 2 || indicator == 3) {  //大页面搜索   和全文检索
                if ($.isNumeric(cpyCode)) {   //如果输入的是数字  这必须满足公司代码规范  如：600000
                    if (!popularize.regExpCompanyCode.test(cpyCode)) {      //验证是否符合公司代码规范  如：600000
                        //popularize.log("the company code with wrong format");
                        return;
                    }
                }
                var companyInfoObj = popularize.getValidCompanyInfoObj(cpyCode, indicator);
                if (!companyInfoObj || !popularize.regExpCompanyCode.test(companyInfoObj.code)) {    // 验证是否合法的公司代码， 存在数据库中
                    //popularize.log(cpyCode+": company  is invalid");
                    return;
                }
                popularize.saveIntoCookie(companyInfoObj, popularize.keyCompanyCode, popularize.companyNumLmt);
                var cookieKey = popularize.getCodeCookieKey(companyInfoObj.code);
                if (cookieKey) {
                    popularize.saveIntoCookie(companyInfoObj.code, cookieKey, popularize.companyNumLmt);
                }
            }
            else if (indicator == 4) {        //页面中的链接
                popularize.saveIntoCookie(cpyCode, popularize.keyCompanyCode, popularize.companyNumLmt);
                var cookieKey = popularize.getCodeCookieKey(cpyCode);
                if (cookieKey) {
                    popularize.saveIntoCookie(cpyCode, cookieKey, popularize.companyNumLmt);
                    var companyInfo = popularize.getCompanyInfoStrFromDataJS(cpyCode);
                    if (companyInfo) {
                        //  [600000]:浦发银行
                        var seeCookieValue = "[" + companyInfo.code + "]:" + companyInfo.name;
                        popularize.saveIntoCookie(seeCookieValue, popularize.keySeeCookie, popularize.companyNumLmt, true);
                    }
                }
            }

        },
        saveIntoCookie: function (val, key, numLimit, isSavedAsStringValue) {
            val = String(val);
            var array = [];
            var loggedVals = popularize.getCookie(key);
            if (loggedVals.length > 0) {
                if (isSavedAsStringValue) {
                    array = loggedVals.split(popularize.delimiter);
                } else {
                    array = JSON.parse(loggedVals);
                }

                //popularize.log("before: ["+array.toString()+"]");
                var index = array.indexOf(val);
                if (index > -1) {       // 如果值已经存在移除数组中原来存在的值
                    array.splice(index, 1);
                }
                array.push(val);//将最近访问的值添加到数组的末尾
                if (array.length > numLimit) {//记录达到最大值时移除最老的值
                    array.shift();
                }
                //popularize.log("after: ["+array.toString()+"]");
            } else {
                array.push(val);
            }
            if (isSavedAsStringValue) {
                popularize.setCookie(key, array.join(popularize.delimiter));
            } else {
                popularize.setCookie(key, JSON.stringify(array));
            }

        },
        getCompanyInfoObj: function (cpyCode, tagInputCode) {//针对中页面查询的  公司代码合法性校验
            //popularize.log("cpyCode:"+cpyCode);
            var elemA = $("ul#js_panMenu_history>li>a[id='" + cpyCode + "']");
            //popularize.log("js_panMenu_history elem exists:"+elemA.length);
            if (elemA.length == 0) {    //如果js_panMenu_history 找不到  ，则找js_panMenu
                elemA = $("ul#js_panMenu>li>a[id='" + cpyCode + "']");
                //popularize.log("js_panMenu elem exists:"+elemA.length);
                if (elemA.length == 0) {   //如果s_panMenu 还找不到  ，则找数据js
                    var productArray = popularize.getProductArray(tagInputCode);
                    for (var i = 0; i < productArray.length; i++) {
                        var curCodeInfo = productArray[i];
                        if (curCodeInfo.val == cpyCode) {
                            //[600020]中原高速
                            //return"["+curCodeInfo.val+"]:"+ curCodeInfo.val2;
                            //return"["+curCodeInfo.val+"]:"+ curCodeInfo.val2;
                            return { code: curCodeInfo.val, name: curCodeInfo.val2 };
                            //return curCodeInfo.val;
                        }
                    }
                    //popularize.log("can't find["+cpyCode+"] in data js");
                }
            }
            /*<li><a href="javascript:;" id="600020">[600020]中原高速</a></li>*/
            if (elemA.length > 0) {
                //return  elemA.text();
                var text = elemA.text();
                //popularize.log("a text: "+text)
                var array = text.split(popularize.codeNameSplitExp);//["", "600004", "白云机场"]
                //popularize.log(array.join("|"));
                if (array.length == 2) {   //    IE  ["600004", "白云机场"]
                    return { code: array[0], name: array[1] };
                }
                else {////["", "600004", "白云机场"]
                    return { code: array[1], name: array[2] };
                }
                //return  elemA.attr("id");
            }
            return false;
        },
        getCompanyInfoStrFromDataJS: function (cpyCode) {//针对页面链接 通过产品代码 取得产品  代码加简称的信息[600020]中原高速

            var codeInfoArray = popularize.allProductArray;
            for (var i = 0; i < codeInfoArray.length; i++) {
                var curCodeInfo = codeInfoArray[i];
                if (curCodeInfo.val == cpyCode) {
                    //[600020]中原高速
                    //return"["+curCodeInfo.val+"]"+ curCodeInfo.val2;
                    return { code: curCodeInfo.val, name: curCodeInfo.val2 };
                }
            }
            return false;
        },
        getValidCompanyInfoObj: function (inputKeyword, indicator) {//针对大页面搜索按钮查询  公司代码,或公司简称合法性校验
            //popularize.log("inputKeyword:"+inputKeyword);
            var regContainsCpyCode; //new RegExp("^(\\[[6][0-9]{5}\\])");// 如  [600004]白云机场
            if ($.isNumeric(inputKeyword)) {
                regContainsCpyCode = new RegExp("^(\\[" + inputKeyword + "\\])")
            }
            else {
                regContainsCpyCode = new RegExp("^(\\[" + popularize.regExpStrCompanyCodePart + "\\])(" + inputKeyword + ")");
            }
            var searchResultId = popularize.searchResultConfig[indicator].searchResultId;
            this.log("searchResultId:" + searchResultId);
            var elemExpr = "ul#" + searchResultId + ">li>a";
            this.log("element expr:" + elemExpr);
            var elemsA = $(elemExpr);
            //popularize.log("elemsLi.length:"+elemsA.length);
            if (elemsA.length == 0) {   //如果找不到  就从历史记录中查找
                var searchHistoryId = popularize.searchResultConfig[indicator].searchHistoryId;
                this.log("searchHistoryId:" + searchHistoryId);
                var elemHistoryExpr = "ul#" + searchHistoryId + ">li>a";
                //popularize.log("element expr:"+elemHistoryExpr);
                elemsA = $(elemHistoryExpr);
                //popularize.log("history elemsLi.length:"+elemsA.length);
                if (elemsA.length == 0) {    //如果历史记录还找不到   则从data js查找        //返回空  说明为非法的公司信息
                    var matchedCompanyInfoObj = false;

                    var companyInfoObjArray = get_alldata();
                    var matchedArray = [];
                    for (var i = 0; i < companyInfoObjArray.length; i++) {
                        var curCompanyInfoObj = companyInfoObjArray[i];
                        if (curCompanyInfoObj) {
                            var companyInfoStr = curCompanyInfoObj.val + "[" + curCompanyInfoObj.val2 + "][" + curCompanyInfoObj.val3 + "]";
                            if (companyInfoStr.toLowerCase().indexOf(inputKeyword.toLowerCase()) > -1) {
                                matchedArray.push({ code: curCompanyInfoObj.val, name: curCompanyInfoObj.val2 });
                                if (matchedArray.length > 1) {  //如果匹配的记录 有多条则不记录
                                    return false;
                                }
                            }
                        }

                    }
                    if (matchedArray.length == 1) {
                        matchedCompanyInfoObj = matchedArray[0];
                    }
                    return matchedCompanyInfoObj;
                }
            }
            var resultArray = [];
            for (var i = 0; i < elemsA.length; i++) {
                var itemA = $(elemsA[i]);
                var textA = $.trim((itemA.text() || itemA.innerText));
                //popularize.log("textA:"+textA);
                if (regContainsCpyCode.test(textA)) {
                    resultArray.push(textA);
                    if (resultArray.length > 1) {  //如果匹配的记录 有多条则不记录
                        return false;
                    }
                }

            }
            if (resultArray.length == 1) {         //有且只有一条查询结果时才记录

                var array = resultArray[0].split(popularize.codeNameSplitExp);//["", "600004", "白云机场"]
                if (array.length == 2) {   //    IE  ["600004", "白云机场"]
                    return { code: array[0], name: array[1] };
                }
                else {////["", "600004", "白云机场"]
                    return { code: array[1], name: array[2] };
                }
            }
            return false;
        }, writeCompanyInfoToPage: function () {
            var tagLatestCompanyList = $("#latestCompanyList");
            if (tagLatestCompanyList.length) {
                var loggedCpyCodesStr = this.getLoggedCpyCode();
                var baseUrl = (window.hq_queryUrl || "http://222.73.229.236:8080") + "/v1/sh1/list/self/";
                var codeArray = JSON.parse(loggedCpyCodesStr);
                codeArray = codeArray.reverse();
                var codesStr = codeArray.join("_");
                var url = baseUrl + codesStr;
                //请求云行情生成表格。
                tagLatestCompanyList.html('*本栏目内容根据您的历史访问记录推送');
                $.ajax({
                    url: url,
                    type: "GET",
                    dataType: "jsonp",
                    jsonp: "callback",
                    data: { select: "code,name,last,chg_rate,change" },
                    cache: false,
                    success: function (json) {
                        var allListCode = [];
                        for (var j = 0; j < json.list.length; j++) {
                            allListCode.push(json.list[j][0]);
                        }
                        if (allListCode.indexOf(codeArray[0]) == -1) {
                            codeArray.shift();
                            var arr = [].concat(codeArray);
                            var htCookie = JSON.stringify(arr.reverse());
                            popularize.setCookie(popularize.keyCompanyCode, htCookie);
                        }
                        var productListObj = {};
                        var productInfoList = json["list"];
                        var hasData = productInfoList && productInfoList.length > 0;
                        var htmlStr = '<div class="table-responsive sse_table_T01" ><table class="table"><tbody><tr><th>证券<br/>代码</th><th>';
                        htmlStr += '证券<br/>简称</th><th>现价<br/><span class="sm-fz">(元)</span></th><th id="ht-zd">涨跌幅<span class="sm-fz">(%)</span><br/><span><span class="sm-fz">/</span>涨跌值</span></th></tr>';
                        var detailInfoLink = "#";
                        for (var j = 0; j < codeArray.length && j < popularize.companyNumShowLmt; j++) {
                            var code = codeArray[j];
                            var companyName = "";
                            var companyInfo = popularize.getCompanyInfoStrFromDataJS(code);
                            if (companyInfo) {
                                companyName = companyInfo.name;
                            }
                            //productListObj[code] = {code:code,name:companyName,curPrice:"--",priceChangeRatio:"--" };
                            productListObj[code] = false;
                            if (hasData) {
                                for (var i = 0; i < productInfoList.length; i++) {
                                    var obj = productInfoList[i];
                                    if (obj[0] == code) {
                                        if (code.substring(0, 3) == "204") {
                                            productListObj[code] = { code: code, name: obj[1], curPrice: obj[2], priceChangeRatio: obj[4] };
                                            break
                                        } else {
                                            productListObj[code] = { code: code, name: obj[1], curPrice: obj[2], priceChangeRatio: obj[3] + "%" };
                                            break
                                        }
                                    }
                                }
                            }
                            if (!productListObj[code]) {
                                continue;
                            }
                            if (new RegExp(popularize.codeExpStrArray[popularize.codeIndex.STOCK]).test(code)) {
                                detailInfoLink = "/assortment/stock/list/info/company/index.shtml?COMPANY_CODE=" + code;
                            }
                            if (new RegExp(popularize.codeExpStrArray[popularize.codeIndex.BOND]).test(code)) {
                                var ht_url = sseUtils.BondCodeSearthUrl(code)
                                detailInfoLink = ht_url ? ht_url + "?BOND_CODE=" + code + "&TYPE=y" : " ";
                            }
                            if (new RegExp(popularize.codeExpStrArray[popularize.codeIndex.FUND]).test(code)) {
                                detailInfoLink = "/assortment/fund/list/etfinfo/basic/index.shtml?FUNDID=" + code;
                            }
                            if (new RegExp(popularize.codeExpStrArray[popularize.codeIndex.INDEX]).test(code)) {
                                detailInfoLink = "/market/sseindex/indexlist/basic/index.shtml?COMPANY_CODE=" + code + "&INDEX_Code=" + code;
                            }
                            htmlStr += '<tr>';
                            htmlStr += detailInfoLink ? '<td><a href="' + detailInfoLink + '" target="_blank">' + productListObj[code].code + '</a></td>' : "<td>" + productListObj[code].code + "</td>";
                            htmlStr += '<td>' + productListObj[code].name + '</td>';
                            htmlStr += '<td><div class="align_right">' + productListObj[code].curPrice + '</div></td>';
                            htmlStr += '<td><div class="align_right">' + productListObj[code].priceChangeRatio + '</div></td>';
                            htmlStr += '</tr>';
                        }
                        htmlStr += '</tbody> </table></div>';
                        tagLatestCompanyList.html(htmlStr);
                    },
                    error: function (e) {

                    }
                });
            }
        },
        addDate: function (date, daysAdd) {

            var time = date.getTime();
            time = time + daysAdd * 24 * 60 * 60 * 1000;
            return new Date(time);
        },
        formatDate: function (date) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            month = month < 10 ? "0" + month : month;
            var day = date.getDate();
            day = day < 10 ? "0" + day : day;
            return year + "-" + month + "-" + day;
        },
        writeAnnoucementInfoToPage: function () {

            var tagLatestAnnoucementList = $("#latestAnnoucementList");
            if (tagLatestAnnoucementList.length > 0) {

                var loggedCpyCodesStr = this.getLoggedCpyCode();

                if (loggedCpyCodesStr && loggedCpyCodesStr.length > 0) {
                    var cpyCodeArray = JSON.parse(loggedCpyCodesStr);
                    var curCpyCode;
                    // var counter =0;
                    var wrapperHtmlStr = '<div class="sse_list_1"><dl></dl></div>';
                    tagLatestAnnoucementList.html(wrapperHtmlStr);
                    var baseUrl = sseQueryURL;
                    var now = new Date();
                    var beginDate = popularize.formatDate(popularize.addDate(now, -90));//取90天以内的信息
                    var endDate = popularize.formatDate(now);
                    //var code2InfoObj = {};
                    //  for(var i= cpyCodeArray.length-1; i>=0 && counter< this.announcementNumLmt; i--){
                    var cpylength = cpyCodeArray.length > 10 ? 10 : cpyCodeArray.length;
                    var curCpyCode = '';
                    for (var i = 0; i < cpylength; i++) {
                        curCpyCode += cpyCodeArray[i];
                        curCpyCode = i == cpylength - 1 ? curCpyCode : curCpyCode + '_';
                    }

                    var functionUrl = "security/stock/queryCompanyStatementNew.do";

                    var reportType = "ALL";
                    var reqUrl = baseUrl + functionUrl;
                    var params = {
                        isPagination: true,
                        productIds: curCpyCode,
                        // reportType2:"",
                        //  reportType:reportType,
                        //beginDate:beginDate,
                        //  endDate:endDate,
                        "pageHelp.pageSize": 15,
                        "pageHelp.pageCount": 1,
                        "pageHelp.pageNo": 1,
                        "pageHelp.beginPage": 1,
                        "pageHelp.cacheSize": 1,
                        "pageHelp.endPage": 1
                    };
                    //reqUrl = baseUrl + functionUrl;
                    $.ajax({
                        url: sseQueryURL + 'infodisplay/queryBulletinAllMoreCode.do?',
                        type: "POST",
                        dataType: "jsonp",
                        async: false,
                        jsonp: "jsonCallBack",
                        data: params,
                        cache: false,
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        success: function (json) {
                            //{stock_code:"600000",bulletin_date:"2015-11-13",bulletin_year:"2015",bulletin_large_type:"其它",bulletin_small_type:"null",bulletin_title:"浦发银行第五届监事会第四十八次会议决议公告",
                            // bulletin_file_url:"/disclosure/listedinfo/announcement/c/2015-11-13/600000_20151113_1.pdf",bulletin_time:"null",rtype:"",xbrlFlag:"false",bulletin_type:"2",startDate:"2015-08-13",endDate:"2015-11-13"}

                            var announcementInfoArray = json["result"];

                            //popularize.log(announcementInfoArray);
                            if (announcementInfoArray && announcementInfoArray.length > 0) {
                                for (var j = 0; j < announcementInfoArray.length; j++) {
                                    var announcementInfo = announcementInfoArray[j];
                                    if (announcementInfo) {
                                        //code2InfoObj[curCpyCode] = {title: announcementInfo["title"],linkUrl: announcementInfo["URL"],date:announcementInfo["SSEDate"]};
                                        ////popularize.log("after success code2InfoObj detail:");
                                        ////popularize.log(code2InfoObj);
                                        var title = announcementInfo["TITLE"];
                                        var titleShow = "";
                                        if (title != null && $.trim(title) != "") {
                                            titleShow = (title.length > 45 ? title.substr(0, 45) + "......" : title)
                                        }
                                        var linkUrl = announcementInfo["URL"];
                                        var date = announcementInfo["SSEDATE"];
                                        var itemHtmlStr = "";
                                        itemHtmlStr += '<dd class="clearfix">';
                                        itemHtmlStr += '<a href="' + linkUrl + '" title="' + title + '">' + titleShow + '</a><span>' + date + '</span>';
                                        itemHtmlStr += '</dd>';
                                        tagLatestAnnoucementList.find(">div>dl").append(itemHtmlStr);
                                    }
                                    j = j == 4 ? announcementInfoArray.length : j;
                                }
                            }
                            else {
                                tagLatestAnnoucementList.html('*本栏目内容根据您的历史访问记录推送');
                            }
                        },
                        error: function (e) {
                            //popularize.log(e);
                            //popularize.log("ajax 请求出错！");
                        }
                    });


                } else {
                    tagLatestAnnoucementList.html('*本栏目内容根据您的历史访问记录推送');
                }
            }
        },
        init: function () {
    
            var _this=this;
            if ($("#inputCode").length) {
                this.stockArray = get_data();
                this.fundArray = get_funddata();
                this.ebondArray = get_ebonddata();
                this.tbondArray = get_tbonddata();
                this.allProductArray = get_alldata();
                this.stockFundArray = get_alldata();
                // this.greenArray = function(){
                 if($("#inputCode").attr("class").indexOf("js_code5")!=-1 || $("#inputCode").attr("class").indexOf("js_code8")!=-1){
                    var _this = this;
                   var dictionary = _this.dictionary
                     $.ajax({
                            url : sseQueryURL + "lszq/lszqSearchData.do",
                            type : 'post',
                            async : false,
                            cache : false,
                           dataType : "jsonp",
                            jsonp : "jsonCallBack",
                            jsonpCallback: "jsonpCallback" + Math.floor(Math.random() * (100000 + 1)),
                            data:{
                               type:"lszq"     
                            },
                            success:function(data){
                                 var result = data.result;
                                 for(var j = 0; j < result.length; j++){
                                    var alltype = result[j].type;
                                    if(alltype=="指数"){
                                        _this["indexArray"].push(result[j]);  
                                    }else if(alltype=="资产支持证券"){
                                        _this["greenzczczqArray"].push(result[j]); 
                                    }else if(alltype=="ETF"){
                                        _this["greenetfArray"].push(result[j]); 
                                    }else if(alltype=="债券"){
                                        _this["greenbondArray"].push(result[j]); 
                                    }
                                 }
                    }
                  })
             
                }
                  
               
            }
            this.bondArray = this.ebondArray.concat(this.tbondArray);

        },
        process: function () {
            this.init();
          
            try {
                var tagMenuList = $("#latestMenuList");
                if (tagMenuList.length > 0) {
                    this.writeMenuToPage(tagMenuList);
                }
                else {
                    this.logVisitingMenu();
                }

                var tagArticleList = $("#latestArtileList");
                if (tagArticleList.length > 0) {

                    this.writeArticleToPage(tagArticleList);
                }
                this.logVisitingCpy();
                this.writeCompanyInfoToPage();
                this.writeAnnoucementInfoToPage();
            }
            catch (e) {
                //popularize.log(e);
            }
        },
        searchAutoKey: function () {
            //预留方法
        }

    }
    return popularize;
});
