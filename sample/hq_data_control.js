/**
 * Update Tanmm  2017-05-18 12:19:45
 * @return {[type]} [description]
 */
Number.prototype.toFixednew = function(scale) {
    var s = this + "";
    if (!scale) scale = 0;
    if (s.indexOf(".") == -1) s += ".";
    s += new Array(scale + 1).join("0");
    if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (scale + 1) + "})?)\\d*$").test(s)) {
        var s = "0" + RegExp.$2,
            pm = RegExp.$1,
            a = RegExp.$3.length,
            b = true;
        if (a == scale + 2) {
            a = s.match(/\d/g);
            if (parseInt(a[a.length - 1]) > 4) {
                for (var i = a.length - 2; i >= 0; i--) {
                    a[i] = parseInt(a[i]) + 1;
                    if (a[i] == 10) {
                        a[i] = 0;
                        b = i != 1;
                    } else
                        break;
                }
            }
            s = a.join("").replace(new RegExp("(\\d+)(\\d{" + scale + "})\\d$"), "$1.$2");
        }
        if (b) s = s.substr(1);
        return (pm + s).replace(/\.$/, "");
    }
    return this + "";
}

function checkBrowser() {
    var str = navigator.userAgent;
    if (str.indexOf('IE 8') >= 0 || str.indexOf('IE 7') >= 0) {
        return false;
    } else {
        return true;
    }
}

function subStringNum(a, num) {
    var a_type = typeof(a);
    if (a_type == "number") {
        var aStr = a.toString();
        var aArr = aStr.split('.');
    } else if (a_type == "string") {
        var aArr = a.split('.');
    }

    if (aArr.length > 1) {
        a = aArr[0] + "." + aArr[1].substr(0, num);
    }
    return Math.abs(a)
}

function checkStatus(tradephase) {
    if (tradephase != null && tradephase != "") {
        tradephase = tradephase.replace(/\s/ig, '');
        if (tradephase != null && tradephase != "") {
            tradephase = tradephase.substr(0, 1);
            switch (tradephase) {
                case "S":
                    tradephase = "开市前";
                    break;
                case "C":
                    tradephase = "集合竞价";
                    break;
                case "D":
                    tradephase = "集合竞价结束";
                    break;
                case "T":
                    tradephase = "连续竞价";
                    break;
                case "B":
                    tradephase = "午间休市";
                    break;
                case "E":
                    tradephase = "闭市";
                    break;
                case "P":
                    tradephase = "停牌";
                    break;
                case "M":
                    tradephase = "熔断(可恢复)";
                    // tradephase = "";
                    break;
                case "N":
                    tradephase = "熔断(至闭市)";

                    // tradephase = "";
                    break;
                case "U":
                    tradephase = "收盘集合竞价";

                    // tradephase = "";
                    break;
            }
        }
    }
    return tradephase;
}

//var hq_queryUrl = "http://222.73.229.236:8080";
//hq_queryUrl+"
//Comparative(比较对象，对象)
/*日期加个-*/
function turnDateAddLine(turnDate) {
    return turnDate.substring(0, 4) + '-' + turnDate.substring(4, 6) + '-' + turnDate.substring(6, 8);
}
//首页-披露-上市公司信息-最新公告
function fn_bulletin(seeCode) {
    var _jsHref = siteUrl + "\/js\/common\/stocks\/new\/" + seeCode + ".js?_=" + Math.round(Math.random() * 9999999);
    $("head").append("<script src='" + _jsHref + "'><\/script>");
    op_calendar({
        code: seeCode,
        id: $(".conp_block_3 .sse_list_5 ul"),
        num: 3
    });
    $.getScript(_jsHref, function() {
        $(".conp_block_2 .sse_list_1").html("");
        bulletinList({
            id: $(".conp_block_2 .sse_list_1"),
            codeMethod: "get_" + seeCode + "()",
            code: seeCode,
            num: 5
        });
        $(".conp_block_1 .dt_table_1 .tdleft .title").html("--");
        $(".conp_block_1 .dt_table_1 .tdright .number2").html("--");
        $(".conp_block_1 .dt_table_1 .tdleft .number1").html(seeCode);
        $(".conp_block_1 .dt_table_1 .tdright .number3").html("").removeClass().addClass("number3");
        //$(".conp_block_1 .dt_table_2 .tdleft .nums .num1").html("<b style='font-size:16px;'>当日最高：</b>--");
        //$(".conp_block_1 .dt_table_2 .tdright .nums .num1").html("<b style='font-size:16px;'>当日最低：</b>--");
        hq_bulletin({
            code: seeCode,
            c1: $(".conp_block_1 .dt_table_1 .tdleft .title"),
            c2: $(".conp_block_1 .dt_table_1 .tdright .number2"),
            c3: $(".conp_block_1 .dt_table_1 .tdleft .number1"),
            c4: $(".conp_block_1 .dt_table_1 .tdright .number3")
            //c5:$(".conp_block_1 .dt_table_2 .tdleft .nums .num1"),
            //c6:$(".conp_block_1 .dt_table_2 .tdright .nums .num1")
        });
        //$(".conp_block_3 .sse_list_5").css({"height":"240px"});

        $(".download_and_feedback .modal_feedback").attr("target", "_blank");
        $(".download_and_feedback .modal_feedback").attr("href", "http://sns.sseinfo.com/company.do?stockcode=" + seeCode);
    });
}
/**
    最新公告－行情
    http://222.73.229.236:8080/v1/sh1/dayk/600000?select=date,high,low&period=year&begin=-2&end=-1
    */
function hq_bulletin(obj) {
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/list/self/" + obj.code,
        jsonp: "callback",
        data: {
            select: 'code,last,name,high,low,chg_rate,tradephase'
        },
        cache: false,
        success: function(resultData) {
            var qqhqList = resultData.list;
            var _isShow = qqhqList[0][6];
            //console.log(qqhqList);
            obj.c1.html(qqhqList[0][2]);
            obj.c2.html(qqhqList[0][1].toFixed(2));
            obj.c3.html(qqhqList[0][0]);

            if (_isShow.replace(/\s/ig, '') == "P1") {
                obj.c2.html("停牌");
                obj.c4.html("");
                //obj.c5.html("--");
                //obj.c6.html("--");
            } else {
                var _chg_rate = qqhqList[0][5];
                if (_chg_rate > 0) {
                    obj.c4.removeClass('down').addClass('up');
                    obj.c4.html("<i class='icons'></i>" + _chg_rate.toFixed(2) + "%");
                } else {
                    obj.c4.removeClass('up').addClass('down');
                    obj.c4.html("<i class='icons'></i>" + _chg_rate.toFixed(2) + "%");
                }

                //obj.c5.html("<b style='font-size:16px;'>当日最高：</b>"+qqhqList[0][3]);
                //obj.c6.html("<b style='font-size:16px;'>当日最低：</b>"+qqhqList[0][4]);
            }
        }
    })
}

function op_calendar(obj) {
    //showloading();
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: sseQueryURL + "commonSoaQuery.do",
        jsonp: "jsonCallBack",
        data: {
            isPagination: true, //是否分页
            stockCode: obj.code,
            order: "tradeBeginDate|desc",
            tradeBeginDate: "19700101", //开始时间
            tradeEndDate: get_systemDate_global().replace(/\-/g, ''), //结束时间
            sqlId: 'PL_SCRL_SCRLB', //SQLID
            'pageHelp.pageNo': 1, //当前页码
            'pageHelp.beginPage': 1, //开始页码
            'pageHelp.cacheSize': 1, //缓存条数
            'pageHelp.endPage': 1,
            'pageHelp.pageSize': 5 //每页显示条数
        },
        cache: false,
        success: function(resultData) {
            var _result = resultData.result;
            var table_tfp = [];
            if (_result != null && _result != "") {
                if (_result.length < obj.num) {
                    obj.num = _result.length;
                }
                for (var i = 0; i < obj.num; i++) {
                    //table_tfp.push("<li>"+_result[i]['stockAbbr']+"["+_result[i]['stockCode']+"]:"+_result[i]['title']+"</li>");
                    //table_tfp.push("<li title='"+_result[i]['title']+"'>"+_result[i]['title']+"<span>"+turnDateAddLine(_result[i]['tradeBeginDate'])+"</span></li>");
                    table_tfp.push("<li title='" + _result[i]['title'] + "'><span>" + turnDateAddLine(_result[i]['tradeBeginDate']) + "</span>" + _result[i]['bizTypeDesc'] + "<p>" + _result[i]['title'] + "</p></li>");
                }
            } else {
                table_tfp.push("<li>无相关数据</li>");
            }
            obj.id.html(table_tfp.join(""));
            $(".conp_block_3 .sse_title_common_wrap .sse_title_common .hidden-xs").attr({
                "href": "/disclosure/dealinstruc/calendar/detail.shtml?_staDate=&_indexCode=" + obj.code,
                "target": "_blank"
            });
            //hideloading();
        }
    })
}
/**
    最新公告
    */
function bulletinList(obj) {
    var _t = eval(obj.codeMethod);
    var _Arrbulletin = [];
    obj.num = _t.length >= obj.num ? obj.num : _t.length;
    _Arrbulletin.push("<dl>");
    for (var i = 0; i < obj.num; i++) {
        var bulletin_file_url = _t[i]["bulletin_file_url"];
        var bulletin_title = _t[i]["bulletin_title"];
        var bulletin_date = _t[i]["bulletin_date"];
        _Arrbulletin.push("<dd data-time='" + bulletin_date + "'>");
        _Arrbulletin.push("<a href='" + staticUrl + bulletin_file_url + "' title='" + bulletin_title + "'>" + bulletin_title + "</a>");
        _Arrbulletin.push("<a href='" + staticUrl + bulletin_file_url + "' class='hidden-xs'></a>");
        _Arrbulletin.push("<span>" + bulletin_date + "</span>");
        _Arrbulletin.push("</dd>");
    }
    _Arrbulletin.push("</dl>");
    obj.id.html(_Arrbulletin.join(""));
    $(".conp_block_2 .sse_title_common_wrap .sse_title_common .hidden-xs").attr({
        "href": "/assortment/stock/list/info/announcement/index.shtml?productId=" + obj.code,
        "target": "_blank"
    });
}


/************************************************************************************************************************/
/************************************************************************************************************************/
/************************************************************************************************************************/

//把时间日期格式转化成utc格式
function convertDateToUTC(date) {
    //return Number(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes()))-Number(8 * 3600 * 1000);
    return Number(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()));
}

/**
    时间处理
    */
var dateConvert = function(obj) {
    var data = obj.data;
    var _open = obj.open;
    var _last = obj.last;
    //循环处理事件
    for (var i = 0; i < data.line.length; i++) {
        var staTime = data.line[i][0] + '';
        if (staTime.length < 6) {
            staTime = '0' + staTime.substring(0, staTime.length - 2);
        } else {
            staTime = staTime.substring(0, staTime.length - 2);
        }
        var _staDate = data.date + staTime;
        var year = _staDate.substring(0, 4);
        var month = _staDate.substring(4, 6);
        var day = _staDate.substring(6, 8);
        var hour = _staDate.substring(8, 10);
        var minute = _staDate.substring(10);

        if (minute != '00') {
            if (minute.indexOf('0') != 0) {
                minute = parseInt(Number(minute));
                if (minute <= 9) {
                    minute = '0' + minute;
                }
            } else {
                minute = minute.substring(1);
                minute = parseInt(Number(minute));
                if (minute <= 9) {
                    minute = '0' + minute;
                }
            }
        }

        data.line[i][0] = year + month + day + fn_hour(hour) + minute;
    }

    // if (data.line.length > 0) {
    //     data.line[0][1] = _open;
    //     data.line[data.line.length - 1][1] = _last;
    // }

    return data;
}

var fn_hour = function(obj) {
    obj = obj + '';
    if (obj.indexOf('0') != 0) {
        obj = parseInt(Number(obj) - 8);
        if (obj <= 9) {
            obj = '0' + obj;
        }

    } else {
        obj = obj.substring(1);
        obj = parseInt(Number(obj) - 8);
        if (obj <= 9) {
            obj = '0' + obj;
        }

    }
    return obj;
}

//根据代码判断代码所属类型
function judgmType(_code) {
    var _Acode = ['600', '601', '603']; //A股
    var _Bcode = ['900']; //B股
    var _Jjcode = ['51', '50']; //基金
    var _Zqcode = ['009', '010', '129', '110', '126', '019', '113']; //债券
    var _Hgcode = ['201', '202', '203', '204', '206']; //回购
    var _Zscode = ['8999']; //指数,后四位比较
    // var _Kcbcode = ['688']; //科创板
    var _cod = _code.substring(0, 3);

    //A股
    if (_code == "706056" || _code == "706055") {
        return "yuyue";
    }

    for (var i = 0; i < _Acode.length; i++) {
        if (_Acode[i] == _cod) {
            return "astock";
        }

    }

    //B股
    for (var i = 0; i < _Bcode.length; i++) {
        if (_Bcode[i] == _cod) {
            return "bstock";
        }

    }

    //基金
    for (var i = 0; i < _Jjcode.length; i++) {
        var _jjCod = _code.substring(0, 2);
        if (_Jjcode[i] == _jjCod) {
            return "fund";
        }

    }

    //债券
    for (var i = 0; i < _Zqcode.length; i++) {
        if (_Zqcode[i] == _cod) {
            return "bond";
        }

    }

    //指数
    for (var i = 0; i < _Zscode.length; i++) {
        if (_code.substring(0, 2) == "00") {
            var _zsCod = _code.substring(2);
            if (Number(_Zscode[i]) >= Number(_zsCod)) {
                return "index";
            }

        }

    }

    //回购
    for (var i = 0; i < _Hgcode.length; i++) {
        if (_Hgcode[i] == _cod) {
            return "huigou";
        }

    }

    return "astock";
}


/***********************************************************************************************************/
/***********************************************************************************************************/
/**********************************************公司债实时行情 2015-11-09**************************************/
/***********************************************************************************************************/
/***********************************************************************************************************/

function ajaxGetMarketTabsInit() {
    iniPage(1, 0);
    $(".tabbable .nav-tabs li a").click(function() {
        var _mth = $(this).attr("href").substring(1).split("-")[0];
        if (_mth == "ajaxGetShfiTab") {
            windowOpen(bondUrl + '/data/quote/tradeinfo/price/');
        } else if (_mth == "ajaxGetBondTab") {
            iniPage(1, 0);
        }

    });
    $("#tableData_ajaxGetMarketTabs .mobile-page button").click(function() {
        if (!$(this).hasClass('next-page')) {
            //下一页
            var _nex = $("#tableData_ajaxGetMarketTabs .pagination li:first a");
            if (typeof(_nex.attr("ipn")) != "undefined") {
                iniPage(_nex.attr("ipn"), _nex.attr("page"));
                //初始化分页
                pageNav.go({
                    id: $("#tableData_ajaxGetMarketTabs .pagination"),
                    method: iniPage,
                    p: Number(_nex.attr("ipn")),
                    pn: Number(_nex.attr("page"))
                });
            }

        } else {
            //上一页
            var _pag = $("#tableData_ajaxGetMarketTabs .pagination li:last a");
            if (typeof(_pag.attr("ipn")) != "undefined") {
                iniPage(_pag.attr("ipn"), _pag.attr("page"));
                //初始化分页
                pageNav.go({
                    id: $("#tableData_ajaxGetMarketTabs .pagination"),
                    method: iniPage,
                    p: Number(_pag.attr("ipn")),
                    pn: Number(_pag.attr("page"))
                });
            }

        }

    });
}

function iniPage(p, pn) {
    var _pageNum = sitePageSize,
        _page = 0;
    if (p != null) {
        _page = p;
    }

    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/list/exchange/bond",
        jsonp: "callback",
        data: {
            select: 'code'
        },
        cache: false,
        success: function(resultData) {
            var codeList = resultData.list;
            var _data = new Array();
            var _arrIndex = 0;
            for (var i = 0; i < codeList.length; i++) {
                var _code = codeList[i]
                if (122000 <= _code && _code <= 122499) {
                    _data[_arrIndex] = _code;
                    _arrIndex++;
                }

            }

            var pageCount = 0;
            if (_data.length % _pageNum == 0) {
                pageCount = _data.length / _pageNum;
            } else {
                pageCount = parseInt(_data.length / _pageNum) + 1;
            }

            ajaxGetBondTab({
                id: $("#tableData_ajaxGetMarketTabs .search_MarketTabs"),
                dateid: $("#tableData_ajaxGetMarketTabs .sse_table_title2 p"),
                data: _data,
                total: _data.length,
                pageIndex: _page,
                pageNum: _pageNum,
                pageCount: pageCount,
                isPage: true
            });
        }
    })
}

function ajaxGetBondTab(obj) {
    var staIndex = Number((obj.pageIndex - 1) * obj.pageNum);
    var endIndex = Number((obj.pageIndex - 1) * obj.pageNum + obj.pageNum);
    var _codeList = "";
    for (var i = staIndex; i < endIndex; i++) {
        if (i < endIndex - 1) {
            _codeList += obj.data[i] + "_";
        } else {
            _codeList += obj.data[i];
        }

    }

    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/list/self/" + _codeList,
        jsonp: "callback",
        data: {
            select: 'code,name,open,high,low,last,prev_close,chg_rate,volume,amount,tradephase,change,amp_rate',
            order: 'code,ase'
        },
        cache: false,
        success: function(resultData) {
            var nowTime = "" + resultData.time;
            if (nowTime.length == 5) {
                nowTime = "0" + resultData.time;
            }
            var _sysDateTime = resultData.date + "" + nowTime;
            //更新时间
            _sysDateTime = _sysDateTime.substring(0, 4) + "-" + _sysDateTime.substring(4, 6) + "-" + _sysDateTime.substring(6, 8) +
                " " + _sysDateTime.substring(8, 10) + ":" + _sysDateTime.substring(10, 12) + ":" + _sysDateTime.substring(12);

            //更新时间
            obj.dateid.parent().show();
            obj.dateid.html("更新时间： " + _sysDateTime);
            var qqhqList = resultData.list;
            var qqhq_table = [];
            qqhq_table.push("<thead><tr>" +
                //"<th>序号</th>"+
                "<th>证券代码</th>" +
                "<th>证券简称</th>" +
                "<th>最新</th>" +
                "<th>涨跌幅</th>" +
                "<th>涨跌</th>" +
                "<th>成交量(手)</th>" +
                "<th>成交额(万元)</th>" +
                "<th>前收</th>" +
                "<th>开盘</th>" +
                "<th>最高</th>" +
                "<th>最低</th>" +
                "<th>振幅</th>" +
                "</tr></thead>");
            for (var i = 0; i < qqhqList.length; i++) {
                var _gdCode = Number(qqhqList[i][0]);
                if (_gdCode >= 122000 && _gdCode <= 123499) {
                    var _isShow = qqhqList[i][10];
                    if (_isShow.replace(/\s/ig, '') == "C1") {
                        obj.dateid.html("集合竞价中 更新时间： " + _sysDateTime);
                    }
                    qqhq_table.push("<tr>");
                    //qqhq_table.push("<td>"+(i+((obj.page-1)*obj.pageNum)+1)+"</td>");//id
                    //qqhq_table.push("<td><a href='/assortment/stock/list/info/company/index.shtml?COMPANY_CODE="+qqhqList[i][0]+"'>"+qqhqList[i][0]+"</a></td>");//code
                    qqhq_table.push("<td>" + qqhqList[i][0] + "</td>"); //code
                    qqhq_table.push("<td>" + qqhqList[i][1] + "</td>"); //name

                    var _last = "<td style='text-align: right;" + Comparative(qqhqList[i][5], qqhqList[i][6]) + "'>" + qqhqList[i][5].toFixed(2) + "</td>"; //last
                    var _chg_rate = "<td style='text-align: right;" + Comparative(qqhqList[i][7], 0) + "'>" + qqhqList[i][7].toFixed(2) + "%</td>"; //chg_rate
                    var _change = "<td style='text-align: right;" + Comparative(qqhqList[i][7], 0) + "'>" + qqhqList[i][11].toFixed(2) + "</td>"; //change
                    var _volume = "<td style='text-align: right;'>" + (qqhqList[i][8] / 100).toFixed(0) + "</td>"; //volume
                    var _amount = "<td style='text-align: right;'>" + (qqhqList[i][9] / 10000).toFixed(2) + "</td>"; //amount
                    var _prev_close = "<td style='text-align: right;'>" + qqhqList[i][6].toFixed(2) + "</td>"; //prev_close
                    var _open = "<td style='text-align: right;" + Comparative(qqhqList[i][2], qqhqList[i][6]) + "'>" + qqhqList[i][2].toFixed(2) + "</td>"; //open
                    var _high = "<td style='text-align: right;" + Comparative(qqhqList[i][3], qqhqList[i][6]) + "'>" + qqhqList[i][3].toFixed(2) + "</td>"; //high
                    var _low = "<td style='text-align: right;" + Comparative(qqhqList[i][4], qqhqList[i][6]) + "'>" + qqhqList[i][4].toFixed(2) + "</td>"; //low
                    var _amp_rate = "<td style='text-align: right;" + Comparative(qqhqList[i][4], qqhqList[i][6]) + "'>" + qqhqList[i][12].toFixed(2) + "％</td>"; //amp_rate
                    if (qqhqList[i][5].toFixed(2) == 0) {
                        _last = "<td style='text-align: right;'>暂无成交</td>";
                        _chg_rate = "<td style='text-align: right;'>--</td>";
                        _change = "<td style='text-align: right;'>--</td>";
                        _volume = "<td style='text-align: right;'>--</td>";
                        _amount = "<td style='text-align: right;'>--</td>";
                        _prev_close = "<td style='text-align: right;'>--</td>";
                        _open = "<td style='text-align: right;'>--</td>";
                        _high = "<td style='text-align: right;'>--</td>";
                        _low = "<td style='text-align: right;'>--</td>";
                        _amp_rate = "<td style='text-align: right;'>--</td>";
                    }
                    if (_isShow.replace(/\s/ig, '') == "P1") {
                        _last = "<td style='text-align: right;'>停牌</td>";
                        _chg_rate = "<td style='text-align: right;'>--</td>";
                        _change = "<td style='text-align: right;'>--</td>";
                        _volume = "<td style='text-align: right;'>--</td>";
                        _amount = "<td style='text-align: right;'>--</td>";
                        _prev_close = "<td style='text-align: right;'>--</td>";
                        _open = "<td style='text-align: right;'>--</td>";
                        _high = "<td style='text-align: right;'>--</td>";
                        _low = "<td style='text-align: right;'>--</td>";
                        _amp_rate = "<td style='text-align: right;'>--</td>";
                    }

                    qqhq_table.push(_last); //last
                    qqhq_table.push(_chg_rate); //chg_rate
                    qqhq_table.push(_change); //change
                    qqhq_table.push(_volume); //volume
                    qqhq_table.push(_amount); //amount
                    qqhq_table.push(_prev_close); //prev_close
                    qqhq_table.push(_open); //open
                    qqhq_table.push(_high); //high
                    qqhq_table.push(_low); //low
                    qqhq_table.push(_amp_rate); //amp_rate

                    qqhq_table.push("</tr>");
                }

            }
            obj.id.html(qqhq_table.join(""));
            if (obj.isPage) {
                if (obj.pageCount > 1) {
                    //初始化分页
                    pageNav.go({
                        id: $("#tableData_ajaxGetMarketTabs .pagination"),
                        method: iniPage,
                        p: obj.pageIndex,
                        pn: obj.pageCount
                    });
                    $(".pagination").parent().parent().show();
                    $("#tableData_ajaxGetMarketTabs .page-con-table").show();
                }
            }

        }
    })
}
/***********************************************************************************************************/
/***********************************************************************************************************/
/**********************************************行情列表 2015-11-09*******************************************/
/***********************************************************************************************************/
/***********************************************************************************************************/
//var hq_queryUrl = "http://222.73.229.236:8080";

var _MarketTabOrder = "",
    _orderIndex = ""; //排序临时变量
function marketSearchInit() {
    _MarketTabOrder = "";
    _orderIndex = "";
    var _pageNum = sitePageSize,
        _page = 1;
    ajaxGetMarketTab({
        code: 'equity',
        id: $("#tableData_marketTabList .search_tabList"),
        dateid: $("#tableData_marketTabList .sse_table_title2 p"),
        tbaName: "gp",
        begin: Number(_page * _pageNum - _pageNum),
        end: Number(_pageNum * _page),
        page: Number(_page),
        pageNum: Number(_pageNum),
        order: "",
        orderIndex: "",
        isPage: true
    });

    $(".tabbable .nav-tabs li a").click(function() {
        _MarketTabOrder = "";
        _orderIndex = "";
        if ($(this).attr("href").indexOf("link") > 0) {
            window.location.href = "/assortment/options/price/";
        } else {
            var _code = $(this).attr("href").substring(1).split("-")[0];
            var _tbaName = $(this).attr("href").substring(1).split("-")[1];
            ajaxGetMarketTab({
                code: _code,
                id: $("#tableData_marketTabList .search_tabList"),
                dateid: $("#tableData_marketTabList .sse_table_title2 p"),
                tbaName: _tbaName,
                begin: Number(_page * _pageNum - _pageNum),
                end: Number(_pageNum * _page),
                page: Number(_page),
                pageNum: Number(_pageNum),
                order: "",
                orderIndex: _orderIndex,
                isPage: true
            });
        }
    });
    $("#tableData_marketTabList").on("click", ".nav-tabs a", function() {
        _MarketTabOrder = "";
        _orderIndex = "";
        var _code = $(this).attr("href").substring(1).split("-")[0];
        var _tbaName = $(this).attr("href").substring(1).split("-")[1];
        // if (_code == "kshare") {
        //     $(".search_tabList").html("");
        //     // $(".sse_table_title2").html("");
        //     if ($(".isKcbTag").length == 0) {
        //         $(".tdclickable").append("<p class='isKcbTag' style='text-align:center;margin-top: 20px;'>暂无数据</p>");
        //     }
        //     $(".page-con-table .pagination").html("");
        // }
        if (_code == "kcdrshare") {
            var qqhq_table = [];
            qqhq_table.push("<thead><tr>" +
                "<th>序号</th>" +
                "<th><a href='javascript:;' order='code' >证券代码</a></th>" +
                "<th><a href='javascript:;' order='name' >证券简称</a></th>" +
                "<th>类型</th>" +
                "<th><a href='javascript:;' order='last' >最新</a></th>" +
                "<th><a href='javascript:;' order='chg_rate' >涨跌幅</a></th>" +
                "<th><a href='javascript:;' order='change' >涨跌</a></th>" +
                "<th><a href='javascript:;' order='volume' >成交量(手)</a></th>" +
                "<th><a href='javascript:;' order='amount' >成交额(万元)</a></th>" +
                "<th><a href='javascript:;' order='prev_close' >前收</a></th>" +
                "<th><a href='javascript:;' order='open' >开盘</a></th>" +
                "<th><a href='javascript:;' order='high' >最高</a></th>" +
                "<th><a href='javascript:;' order='low' >最低</a></th>" +
                "<th><a href='javascript:;' order='amp_rate' >振幅</a></th>" +
                "</tr></thead><tbody><tr ><td colspan='50'>对不起，找到0条数据！</td></tr></tbody>");
            $("#tableData_marketTabList .search_tabList").html(qqhq_table.join(""));
            $(".page-con-table .pagination").html("");
        } else {
            ajaxGetMarketTab({
                code: _code,
                id: $("#tableData_marketTabList .search_tabList"),
                dateid: $("#tableData_marketTabList .sse_table_title2 p"),
                tbaName: _tbaName,
                begin: Number(_page * _pageNum - _pageNum),
                end: Number(_pageNum * _page),
                page: Number(_page),
                pageNum: Number(_pageNum),
                order: "",
                orderIndex: _orderIndex,
                isPage: true
            });
        }


    });

    $("#tableData_marketTabList .mobile-page button").click(function() {
        if (!$(this).hasClass('next-page')) {
            //下一页
            var _nex = $("#tableData_marketTabList .pagination li:first a");
            if (typeof(_nex.attr("ipn")) != "undefined") {
                marketInitPage(_nex.attr("ipn"), _nex.attr("page"));
                //初始化分页
                pageNav.go({
                    id: $("#tableData_marketTabList .pagination"),
                    method: marketInitPage,
                    p: Number(_nex.attr("ipn")),
                    pn: Number(_nex.attr("page"))
                });
            }

        } else {
            //上一页
            var _pag = $("#tableData_marketTabList .pagination li:last a");
            if (typeof(_pag.attr("ipn")) != "undefined") {
                marketInitPage(_pag.attr("ipn"), _pag.attr("page"));
                //初始化分页
                pageNav.go({
                    id: $("#tableData_marketTabList .pagination"),
                    method: marketInitPage,
                    p: Number(_pag.attr("ipn")),
                    pn: Number(_pag.attr("page"))
                });
            }

        }

    });
}

function marketInitPage(p, pn) {
    var _pageNum = sitePageSize,
        _page = 1;
    var _code = 'equity';
    var _tbaName = 'gp';
    if ($("#stockTab").length > 0) {
        $("#stockTab li").each(function() {
            if ($(this).hasClass('active')) {
                _code = $(this).find("a").attr("href").substring(1).split("-")[0];
                _tbaName = $(this).find("a").attr("href").substring(1).split("-")[1];

            }

        });
    } else {
        $(".tabbable .nav-tabs li").each(function() {
            if ($(this).hasClass('active')) {
                _code = $(this).find("a").attr("href").substring(1).split("-")[0];
                _tbaName = $(this).find("a").attr("href").substring(1).split("-")[1];
            }

        });
    }

    ajaxGetMarketTab({
        code: _code,
        id: $("#tableData_marketTabList .search_tabList"),
        dateid: $("#tableData_marketTabList .sse_table_title2 p"),
        tbaName: _tbaName,
        begin: Number(p * _pageNum - _pageNum),
        end: Number(_pageNum * p),
        page: Number(p),
        pageNum: Number(_pageNum),
        order: _MarketTabOrder,
        orderIndex: _orderIndex,
        isPage: false
    });
}

function refTableList() {
    //_MarketTabOrder="";
    //_orderIndex="";
    //当前页刷新
    var _pag = $("#tableData_marketTabList .pagination li:last a");
    var _active = $("#tableData_marketTabList .pagination li .active").attr("page");
    if (typeof(_pag.attr("ipn")) != "undefined") {
        marketInitPage(_active, _pag.attr("page"));
        //初始化分页
        pageNav.go({
            id: $("#tableData_marketTabList .pagination"),
            method: marketInitPage,
            p: Number(_active),
            pn: Number(_pag.attr("page"))
        });
    }

}

function ajaxGetMarketTab(obj) {
    require(['sseUtils'], function(sseUtils) {
        if (_MarketTabOrder != "") {
            obj.order = _MarketTabOrder;
        }
        var isStockTabStr = '';
        var isStock = false;
        var selectOpt;
        // if ($(".tabbable .nav-tabs li.active a").attr('href') == '#equity-gp') {
        //     isStock = true;
        // }
        if (obj.code == 'equity' || obj.code == 'ashare' || obj.code == 'bshare' || obj.code == 'kshare') {
            isStock = true;
        }
        // if (obj.code == 'kcdr' || obj.code == 'kashare') {
        //     obj.id.html('');
        //     if ($(".table-responsive.sse_table_T01.tdclickable h5").length > 0) {

        //     } else {
        //         $(".table-responsive.sse_table_T01.tdclickable").append('<h5 style= "text-align:center">暂无数据</h5>');
        //     }
        //     $('.page-con-table .pagination').html('');
        // } else(
        //     $(".table-responsive.sse_table_T01.tdclickable h5").remove();
        // )

        // obj.id.html('');
        // $('.page-con-table .pagination').html('');
        if (isStock && $(".js_isKcb").length > 0) {
            selectOpt = 'code,name,open,high,low,last,prev_close,chg_rate,volume,amount,tradephase,change,amp_rate,cpxxsubtype,cpxxprodusta';
            isStockTabStr += '<ul id="stockTab" class="nav nav-tabs" data-active-element="0"><li class="active"><a href="#equity-gp" data-toggle="tab">全部板块\
                            </a></li><li><a href="#ashare-gp" data-toggle="tab">主板A股\
                            </a></li><li><a href="#bshare-gp" data-toggle="tab">主板B股\
                            </a></li><li><a href="#kshare-gp" data-toggle="tab">科创板\
                            </a></ul>';
            if ($('#tableData_marketTabList #stockTab').length > 0) {

            } else {
                $('#tableData_marketTabList').prepend(isStockTabStr);
            }

        } else {
            selectOpt = 'code,name,open,high,low,last,prev_close,chg_rate,volume,amount,tradephase,change,amp_rate,cpxxsubtype';
            if ($('#tableData_marketTabList #stockTab').length > 0) {
                $('#tableData_marketTabList #stockTab').remove();
            }
        }

        $.ajax({
            type: 'POST',
            dataType: "jsonp",
            url: hq_queryUrl + "/v1/sh1/list/exchange/" + obj.code,
            jsonp: "callback",
            data: {
                select: selectOpt,
                order: obj.order,
                begin: obj.begin,
                end: obj.end
            },
            cache: false,
            success: function(resultData) {
                $(".tdclickable .isKcbTag").remove();
                showloading();
                var nowTime = "" + resultData.time;
                var isStockTh = '';

                if (nowTime.length == 5) {
                    nowTime = "0" + resultData.time;
                }
                var _sysDateTime = resultData.date + "" + nowTime;
                //更新时间
                _sysDateTime = _sysDateTime.substring(0, 4) + "-" + _sysDateTime.substring(4, 6) + "-" + _sysDateTime.substring(6, 8) +
                    " " + _sysDateTime.substring(8, 10) + ":" + _sysDateTime.substring(10, 12) + ":" + _sysDateTime.substring(12);

                //集合竞价中
                obj.dateid.parent().show();
                //obj.dateid.parent().html('<p>更新时间： '+_sysDateTime+'</p>');
                obj.dateid.html("更新时间： " + _sysDateTime + "<a href='javascript:;' class='download-export refTable'>刷新</a>");
                var qqhqList = resultData.list;


                if (isStock) {
                    isStockTh += "<th>类型</th>";
                }
                var qqhq_table = [];
                qqhq_table.push("<thead><tr>" +
                    "<th>序号</th>" +
                    "<th><a href='javascript:;' order='code' >证券代码</a></th>" +
                    "<th><a href='javascript:;' order='name' >证券简称</a></th>" +
                    isStockTh +
                    "<th><a href='javascript:;' order='last' >最新</a></th>" +
                    "<th><a href='javascript:;' order='chg_rate' >涨跌幅</a></th>" +
                    "<th><a href='javascript:;' order='change' >涨跌</a></th>" +
                    "<th><a href='javascript:;' order='volume' >成交量(手)</a></th>" +
                    "<th><a href='javascript:;' order='amount' >成交额(" + (obj.tbaName == "zs" ? "亿元" : "万元") + ")</a></th>" +
                    "<th><a href='javascript:;' order='prev_close' >前收</a></th>" +
                    "<th><a href='javascript:;' order='open' >开盘</a></th>" +
                    "<th><a href='javascript:;' order='high' >最高</a></th>" +
                    "<th><a href='javascript:;' order='low' >最低</a></th>" +
                    "<th><a href='javascript:;' order='amp_rate' >振幅</a></th>" +
                    "</tr></thead>");
                if (qqhqList == null || qqhqList.length == 0 || qqhqList == undefined) {
                    qqhq_table.push("<tbody><tr><td colspan='50'>暂无数据</td></tr></tbody>")
                } else {
                    for (var i = 0; i < qqhqList.length; i++) {
                        var _isShow = qqhqList[i][10];

                        if (_isShow.replace(/\s/ig, '') == "C1") {
                            obj.dateid.html("集合竞价中 更新时间： " + _sysDateTime);
                        }
                        var _hLink = "";
                        var bkType = '';


                        if (obj.tbaName == "gp") {
                            _hLink = "/assortment/stock/list/info/company/index.shtml?COMPANY_CODE=" + qqhqList[i][0];
                        } else if (obj.tbaName == "jj") {
                            _hLink = "/assortment/fund/list/etfinfo/basic/index.shtml?FUNDID=" + qqhqList[i][0];
                        } else if (obj.tbaName == "zq") {
                            //                    _hLink = "/assortment/bonds/list/info/basic/index.shtml?BOND_CODE=" + qqhqList[i][0] + "&TYPE=y";
                            _hLink = sseUtils.BondCodeSearthUrl(qqhqList[i][0]) ? sseUtils.BondCodeSearthUrl(qqhqList[i][0]) + "?BOND_CODE=" + qqhqList[i][0] + "&TYPE=y" : "";
                        } else if (obj.tbaName == "zs") {
                            _hLink = "/market/sseindex/indexlist/basic/index.shtml?COMPANY_CODE=" + qqhqList[i][0] + "&INDEX_Code=" + qqhqList[i][0];
                        }

                        qqhq_table.push("<tr>");
                        qqhq_table.push("<td>" + (i + ((obj.page - 1) * obj.pageNum) + 1) + "</td>"); //id
                        qqhq_table.push(_hLink ? "<td><a href='" + _hLink + "'>" + qqhqList[i][0] + "</a></td>" : "<td>" + qqhqList[i][0] + "</td>"); //code
                        qqhq_table.push("<td>" + qqhqList[i][1] + "</td>"); //name
                        if (isStock) {
                            if (qqhqList[i][13] == "KSH") {
                                // var isKcbcdrArr = qqhqList[i][14].split('');

                                // var _code4 = qqhqList[i][0].substring(0, 4);
                                // if (isKcbcdrArr[4] == 'Y') {
                                //     bkType = '科创板CDR';
                                // } else {
                                bkType = '科创板';
                                // }
                            } else if (qqhqList[i][13] == "ASH") {
                                bkType = '主板A股';
                            } else if (qqhqList[i][13] == "BSH") {
                                bkType = '主板B股';
                            }
                            qqhq_table.push("<td>" + bkType + "</td>"); //name
                        }
                        var _last = "<td style='text-align: right;" + Comparative(qqhqList[i][5], qqhqList[i][6]) + "'>" + qqhqList[i][5].toFixed(2) + "</td>"; //last
                        var _chg_rate = "<td style='text-align: right;" + Comparative(qqhqList[i][7], 0) + "'>" + qqhqList[i][7].toFixed(2) + "%</td>"; //chg_rate
                        var _change = "<td style='text-align: right;" + Comparative(qqhqList[i][7], 0) + "'>" + qqhqList[i][11].toFixed(2) + "</td>"; //change
                        var _volume = "<td style='text-align: right;'>" + (qqhqList[i][8] / 100).toFixed(0) + "</td>"; //volume
                        var _amount = "<td style='text-align: right;'>" + (qqhqList[i][9] / 10000).toFixed(2) + "</td>"; //amount
                        var _prev_close = "<td style='text-align: right;'>" + qqhqList[i][6].toFixed(2) + "</td>"; //prev_close
                        var _open = "<td style='text-align: right;" + Comparative(qqhqList[i][2], qqhqList[i][6]) + "'>" + qqhqList[i][2].toFixed(2) + "</td>"; //open
                        var _high = "<td style='text-align: right;" + Comparative(qqhqList[i][3], qqhqList[i][6]) + "'>" + qqhqList[i][3].toFixed(2) + "</td>"; //high
                        var _low = "<td style='text-align: right;" + Comparative(qqhqList[i][4], qqhqList[i][6]) + "'>" + qqhqList[i][4].toFixed(2) + "</td>"; //low
                        var _amp_rate = "<td style='text-align: right;'>" + qqhqList[i][12].toFixed(2) + "％</td>"; //amp_rate

                        if (obj.tbaName == "gp") {
                            if (qqhqList[i][5].toFixed(2) == 0) {
                                _last = "<td style='text-align: right;'>暂无成交</td>";
                                _chg_rate = "<td style='text-align: right;'>--</td>";
                                _change = "<td style='text-align: right;'>--</td>";
                                _volume = "<td style='text-align: right;'>--</td>";
                                _amount = "<td style='text-align: right;'>--</td>";
                                _prev_close = "<td style='text-align: right;'>" + qqhqList[i][6].toFixed(2) + "</td>"; //prev_close;
                                _open = "<td style='text-align: right;'>--</td>";
                                _high = "<td style='text-align: right;'>--</td>";
                                _low = "<td style='text-align: right;'>--</td>";
                                _amp_rate = "<td style='text-align: right;'>--</td>";
                            }

                        } else if (obj.tbaName == "jj") {
                            _last = "<td style='text-align: right;" + Comparative(qqhqList[i][5], qqhqList[i][6]) + "'>" + qqhqList[i][5].toFixed(3) + "</td>"; //last
                            _change = "<td style='text-align: right;" + Comparative(qqhqList[i][7], 0) + "'>" + qqhqList[i][11].toFixed(3) + "</td>"; //change
                            _prev_close = "<td style='text-align: right;'>" + qqhqList[i][6].toFixed(3) + "</td>"; //prev_close
                            _open = "<td style='text-align: right;" + Comparative(qqhqList[i][2], qqhqList[i][6]) + "'>" + qqhqList[i][2].toFixed(3) + "</td>"; //open
                            _high = "<td style='text-align: right;" + Comparative(qqhqList[i][3], qqhqList[i][6]) + "'>" + qqhqList[i][3].toFixed(3) + "</td>"; //high
                            _low = "<td style='text-align: right;" + Comparative(qqhqList[i][4], qqhqList[i][6]) + "'>" + qqhqList[i][4].toFixed(3) + "</td>"; //low
                            //_volume = "<td style='text-align: right;'>"+(qqhqList[i][8]/100).toFixed(2)+"</td>";//volume
                            _amount = "<td style='text-align: right;'>" + (qqhqList[i][9] / 10000).toFixed(2) + "</td>"; //amount

                            if (qqhqList[i][5].toFixed(2) == 0) {
                                _last = "<td style='text-align: right;'>暂无成交</td>";
                                _chg_rate = "<td style='text-align: right;'>--</td>";
                                _change = "<td style='text-align: right;'>--</td>";
                                _volume = "<td style='text-align: right;'>--</td>";
                                _amount = "<td style='text-align: right;'>--</td>";
                                _prev_close = "<td style='text-align: right;'>" + qqhqList[i][6].toFixed(2) + "</td>"; //prev_close;
                                _open = "<td style='text-align: right;'>--</td>";
                                _high = "<td style='text-align: right;'>--</td>";
                                _low = "<td style='text-align: right;'>--</td>";
                                _amp_rate = "<td style='text-align: right;'>--</td>";
                            }

                        } else if (obj.tbaName == "zq") {
                            _volume = "<td style='text-align: right;'>" + qqhqList[i][8] + "</td>"; //volume
                            if (qqhqList[i][5].toFixed(2) == 0) {
                                _last = "<td style='text-align: right;'>暂无成交</td>";
                                _chg_rate = "<td style='text-align: right;'>--</td>";
                                _change = "<td style='text-align: right;'>--</td>";
                                _volume = "<td style='text-align: right;'>--</td>";
                                _amount = "<td style='text-align: right;'>--</td>";
                                _prev_close = "<td style='text-align: right;'>" + qqhqList[i][6].toFixed(2) + "</td>"; //prev_close;
                                _open = "<td style='text-align: right;'>--</td>";
                                _high = "<td style='text-align: right;'>--</td>";
                                _low = "<td style='text-align: right;'>--</td>";
                                _amp_rate = "<td style='text-align: right;'>--</td>";
                            }


                        } else if (obj.tbaName == "zs") {
                            _volume = "<td style='text-align: right;'>" + qqhqList[i][8] + "</td>"; //volume
                            _amount = "<td style='text-align: right;'>" + (qqhqList[i][9] / 100000000).toFixed(2) + "</td>"; //amount
                        }
                        if (_isShow.replace(/\s/ig, '') == "P1") {
                            _last = "<td style='text-align: right;'>停牌</td>";
                            _chg_rate = "<td style='text-align: right;'>--</td>";
                            _change = "<td style='text-align: right;'>--</td>";
                            _volume = "<td style='text-align: right;'>--</td>";
                            _amount = "<td style='text-align: right;'>--</td>";
                            _prev_close = "<td style='text-align: right;'>--</td>";
                            _open = "<td style='text-align: right;'>--</td>";
                            _high = "<td style='text-align: right;'>--</td>";
                            _low = "<td style='text-align: right;'>--</td>";
                            _amp_rate = "<td style='text-align: right;'>--</td>";
                        }

                        qqhq_table.push(_last); //last
                        qqhq_table.push(_chg_rate); //chg_rate
                        qqhq_table.push(_change); //change
                        qqhq_table.push(_volume); //volume
                        qqhq_table.push(_amount); //amount
                        qqhq_table.push(_prev_close); //prev_close
                        qqhq_table.push(_open); //open
                        qqhq_table.push(_high); //high
                        qqhq_table.push(_low); //low
                        qqhq_table.push(_amp_rate); //amp_rate

                        qqhq_table.push("</tr>");
                    }
                }
                obj.id.html(qqhq_table.join(""));
                //重新注册order
                if (obj.orderIndex != "") {
                    $("#tableData_marketTabList .search_tabList tr th a").each(function() {
                        if ($(this).text() == obj.orderIndex) {
                            var _order = obj.order;
                            if (_order.indexOf(",") < 0) {
                                $(this).attr("order", _order + ",ase");
                                $(this).parent().append('<i class="fgrey"><span style="color: #347BB7;" class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span></i>');
                            } else {
                                $(this).attr("order", _order.substring(0, _order.indexOf(",")));
                                $(this).parent().append('<i class="fgrey"><span style="color: #347BB7;" class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span></i>');
                            }

                        }

                    });
                }

                if (obj.isPage) {
                    //初始化分页
                    var _pageNum = obj.pageNum;
                    var _total = resultData.total;
                    var pageNum = _total / _pageNum;
                    if (_total % _pageNum > 0) {
                        pageNum = parseInt(_total / _pageNum) + 1;
                    }
                    // window.console&&console.log("_pageNum:"+_pageNum+";_total:"+_total+";pageNum:"+pageNum);
                    if (pageNum > 1) {
                        //初始化分页
                        pageNav.go({
                            id: $("#tableData_marketTabList .pagination"),
                            method: marketInitPage,
                            p: 1,
                            pn: pageNum
                        });
                        $(".pagination").parent().parent().show();
                        $("#tableData_marketTabList .page-con-table").show();
                    } else {
                        $(".pagination").parent().parent().hide();
                        $("#tableData_marketTabList .page-con-table").hide();
                    }
                }

                //初始化点击事件－排序
                $("#tableData_marketTabList .search_tabList tr th a").click(function() {
                    _MarketTabOrder = $(this).attr("order");
                    _orderIndex = $(this).text();
                    ajaxGetMarketTab({
                        code: obj.code,
                        id: $("#tableData_marketTabList .search_tabList"),
                        dateid: $("#tableData_marketTabList .sse_table_title2 p"),
                        begin: obj.begin,
                        end: obj.end,
                        pageNum: obj.pageNum,
                        page: obj.page,
                        tbaName: obj.tbaName,
                        order: $(this).attr("order"),
                        orderIndex: $(this).text(),
                        isPage: false
                    });
                });
                obj.dateid.find(".refTable").click(function() {
                    refTableList();
                });
                hideloading();
            },
            error: function(err) {

            }

        })
    })
}
/***********************************************************************************************************/
/***********************************************************************************************************/
/**********************************************延时行情 -11-06*******************************************/
/***********************************************************************************************************/
/***********************************************************************************************************/
function delayInit() {
    var _code = getValue('COMPANY_CODE');
    if (_code == "") {
        _code = getValue('FUNDID');
        if (_code == "") {
            _code = getValue('BOND_CODE');
        }
    }

    if (!checkBrowser()) {
        $('.delayAjax_hq #market_ticker').html('<center style="margin-top:80px;"><span class="nal" style="color: #ccc;font-size: 16px;">当前浏览器不支持HTML5行情<br/>请使用IE9及以上版本浏览器</span></center>');
    }

    delayInitMethod({
        id: $('.delayAjax_hq #market_ticker'),
        detId: $(".delayAjax_hq #pad01"),
        code: _code
    });
    // $(".delayAjax_hq .right").remove(".sse_table_title2").append('<div class="sse_table_title2"><p>' + get_systemDate_global() + '</p></div>');
}


function delayInitMethod(obj) {
    fnCodetype(obj.code, function(_codType) {
        if (_codType) {

            switch (_codType) {
                case "astock": //A股
                    delay_snapAjax({
                        id: obj.id,
                        detId: obj.detId,
                        code: obj.code
                    });
                    break;
                case "bstock": //B股
                    delay_snapAjax({
                        id: obj.id,
                        detId: obj.detId,
                        code: obj.code
                    });
                    break;
                case "kcbstock": //科创板
                    delay_snapAjax_kcb({
                        id: obj.id,
                        detId: obj.detId,
                        code: obj.code
                    });
                    break;
                case "fund": //基金
                    delay_snapAjax_jj({
                        id: obj.id,
                        detId: obj.detId,
                        code: obj.code
                    });
                    break;
                case "bond": //债券
                    delay_snapAjax({
                        id: obj.id,
                        detId: obj.detId,
                        code: obj.code
                    });
                    break;
                case "index": //指数
                    delay_snapAjax_zs({
                        id: obj.id,
                        detId: obj.detId,
                        code: obj.code
                    });
                    break;
                case "huigou": //回购
                    delay_snapAjax({
                        id: obj.id,
                        detId: obj.detId,
                        code: obj.code,
                        type: 'huigou'
                    });
                    break;
            }
        }
    })
}

/******************************************************股票*****************************************************/
function delay_snapAjax_jj(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/snap/" + obj.code,
        jsonp: "callback",
        data: {
            select: 'name,last,chg_rate,change,open,prev_close,high,low,tradephase,cpxxextendname'
        },
        cache: false,
        success: function(resultData) {
            var _code = resultData.code;
            var pad01Arr = [];
            var _snap_val = resultData.snap;

            var color;

            var _name = _snap_val[0]; //名称
            var _xj = _snap_val[1].toFixed(3); //现价
            var _zs = _snap_val[5]; //昨收
            var _zd = _snap_val[3]; //涨跌
            var _zdf = _snap_val[2].toFixed(2) + ''; //涨跌幅,有问题，应该在涨跌判断以后再取两位小数
            var _high = _snap_val[6]; //最高价
            var _low = _snap_val[7]; //最低价
            var _open = _snap_val[4]; //开盘价
            var _tradephase = _snap_val[8];
            var _kwjc = _snap_val[9] ? _snap_val[9] : '-'; //扩位简称

            var classes;

            function zhangdie(y) {
                if (y > _snap_val[5]) {
                    classes = "col_red";
                } else if (y < _snap_val[5]) {
                    classes = "col_green";
                } else {
                    classes = "col_color";
                }
                return ("<span class=" + classes + ">" + y + "</span>")
            }

            if (_zs != _xj) {
                if (_zd > 0) {
                    _zd = "+" + _zd;
                    classes = "col_red";
                } else {
                    //_zdf = "-"+_zdf;
                    classes = "col_green";
                }
            } else {
                classs = "col_color";
            }
            pad01Arr.push("<table><tr class='tr_a'><td class='td_a'>" + _code + "</td><td class='td_b'>" + _name + "</td></tr>");
            if (_kwjc != '-') {
                pad01Arr.push("<tr class='tr_a js_jjkwjc'><td colspan='2' class='td_b'>" + _kwjc + "</td></tr>");
                $('.delayAjax_hq').css('height', '350px');
                $('.delayAjax_hq #pad01').css('height', '130px');
            }

            pad01Arr.push("<tr class='tr_b'><td class='td_a' rowspan='2'>" + zhangdie(_xj) + "</td><td class='td_b " + classes + "'>" + _zd + "</td></tr><tr class='tr_c'><td class='" + classes + "'>" + _zdf + "%</td></tr></table>");

            obj.detId.html(pad01Arr.join(""));



            if (resultData.snap.length < 1) {
                obj.id.html('<center style="margin-top:80px;"><span class="nal" style="color: #ccc;font-size: 20px;">暂无走势信息</span></center>');
            }

            if (_tradephase.replace(/\s/ig, '') == "P1") {
                obj.id.html('<center style="margin-top:80px;"><span class="nal" style="color: #ccc;font-size: 20px;">停牌中</span></center>');
            } else if (_tradephase.replace(/\s/ig, '') == "C1") {
                obj.id.html('<center style="margin-top:80px;"><span class="nal" style="color: #ccc;font-size: 20px;">集合竞价中</span></center>');
            } else {
                if (checkBrowser()) {
                    delay_ajax_jj({
                        id: obj.id,
                        code: _code,
                        last: _xj,
                        codeName: _name,
                        open: _open,
                        high: _high,
                        low: _low,
                        prev_close: _zs
                    });
                }

            }
        }
    })
}

function delay_ajax_jj(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/line/" + obj.code,
        data: {
            begin: 0,
            end: -1,
            select: 'time,price,volume'
        },
        jsonp: "callback",
        cache: false,
        success: function(resultData) {
            var dd = resultData;
            var d = dateConvert({
                data: dd,
                last: obj.last,
                open: obj.open
            });
            //var data = null;
            var data = d.line;
            //没数据时不显示图表
            if (data.length == 0) {
                obj.id.html("<div class='chart_container'></div>");
                return;
            }
            $(".delayAjax_hq .right").remove(".sse_table_title2").append('<div class="sse_table_title2"><p>' + turnDateAddLine(resultData.date + "") + '</p></div>');
            Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                lang: {
                    loading: "加载中",
                    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    noData: "没有数据",
                    numericSymbols: ["千", "兆", "G", "T", "P", "E"],
                    printChart: "打印图表",
                    resetZoom: "恢复缩放",
                    resetZoomTitle: "恢复图表",
                    shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    thousandsSep: ",",
                    weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
                }
            });
            //初始化开------------------------
            var groupingUnits = [
                [
                    'minute', // unit name
                    [1] // allowed multiples
                ]
            ];
            var avg_pxyAxisMin; //Y轴最小值
            var avg_pxyAxisMax; //Y轴最大值 
            var percentageyAxisMin; //Y轴百分比最小
            var percentageyAxisMax; //Y轴百分比最大
            var volume_yAxisMin; //成交量最小
            var volume_yAxisMax; //成交量最大
            var red = "#ff0000";
            var blue = "#00a800";
            var price_trend = [],
                volume = [], //成交量
                i = 0;
            //图表上的成交量第一条的数据红绿的判断 是根据昨日的收盘价preclose_px 和今日的最新价last_px进行对比
            //同时获取的昨日收盘价  用于涨幅的计算
            var isFirstLineColorflag = true;
            //保存昨收数据
            var yesterdayClose;
            //容错判断
            if (data != undefined && data != null && data.length == 0) {
                try {
                    failCallback();
                } catch (e) {

                }
                return;
            }
            //今开
            var open_px = data[i][1];
            //昨收
            //var preclose_px=data[i][3];
            var preclose_px = d.prev_close;
            yesterdayClose = preclose_px;
            isFirstLineColorflag = open_px > preclose_px ? true : false;
            // split the data set into price_trend and volume
            //数据处理
            for (i; i < data.length; i += 1) {
                var _dates = data[i][0] + "";
                var _hours = _dates.substring(8, 10);
                var dateUTC = getDateUTCOrNot(_dates, true);
                var business_amount = data[i][2];
                var columnColor = red;
                if (i == 0) { //第一笔的 红绿柱 判断依据是根据 今天开盘价与昨日收盘价比较
                    if (isFirstLineColorflag == false) {
                        columnColor = blue;
                    }
                    avg_pxyAxisMin = data[i][1];
                    avg_pxyAxisMax = data[i][1];
                    percentageyAxisMin = Number(100 * (data[i][1] / yesterdayClose - 1));
                    percentageyAxisMax = Number(100 * (data[i][1] / yesterdayClose - 1));
                    volume_yAxisMin = data[i][2];
                    volume_yAxisMax = data[i][2];
                } else {
                    //除了第一笔，其它都是  返回的 last_px 与前一个对比
                    if (data[i - 1][1] - data[i][1] > 0) {
                        columnColor = blue;
                    }
                }
                avg_pxyAxisMin = avg_pxyAxisMin > data[i][1] ? data[i][1] : avg_pxyAxisMin;
                avg_pxyAxisMax = avg_pxyAxisMax > data[i][1] ? avg_pxyAxisMax : data[i][1];
                percentageyAxisMin = percentageyAxisMin > Number(100 * (data[i][1] / yesterdayClose - 1)) ? Number(100 * (data[i][1] / yesterdayClose - 1)) : percentageyAxisMin;
                percentageyAxisMax = percentageyAxisMax > Number(100 * (data[i][1] / yesterdayClose - 1)) ? percentageyAxisMax : Number(100 * (data[i][1] / yesterdayClose - 1));
                volume_yAxisMin = volume_yAxisMin > business_amount ? business_amount : volume_yAxisMin;
                volume_yAxisMax = volume_yAxisMax > business_amount ? volume_yAxisMax : business_amount;
                //将数据放入 price_trend volume 数组中

                price_trend.push({
                    x: dateUTC,
                    y: Number(data[i][1])
                });
                volume.push({
                    x: dateUTC,
                    y: Number(business_amount),
                    color: columnColor
                });
            }

            //将剩下的时间信息补全
            appendTimeMessage(price_trend, volume, data);
            //常量本地化
            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });

            var date;
            if (data.length > 0) {
                date = data[data.length - 1][0] + "";
                var dArr = new Array();
                for (var hh = 0; hh < 5; hh++) {
                    var numb;
                    if (hh == 0) {
                        numb = Number(date.slice(0, 4));
                    } else {
                        numb = Number(date.slice((hh - 1) * 2 + 4, hh * 2 + 4));
                    }

                    dArr.push(numb);
                }
            }
            var last_dataTime = new Date(dArr[0], dArr[1] - 1, dArr[2], dArr[3], dArr[4]);
            var $reporting = $("#report");
            $reporting.html("");
            // Create the chart
            var am_startTime = new Date(last_dataTime);
            am_startTime.setHours(1, 30, 0, 0);
            var am_startTimeUTC = convertDateToUTC(am_startTime);
            var am_midTime = new Date(last_dataTime);
            am_midTime.setHours(2, 30, 0, 0);
            var am_midTimeUTC = convertDateToUTC(am_midTime);

            //股票交易早上最后的时间
            var am_lastTime = new Date(last_dataTime);
            am_lastTime.setHours(3, 30, 0, 0);
            var am_lastTimeUTC = convertDateToUTC(am_lastTime);

            //股票交易下午最后的时间
            var pm_startTime = new Date(last_dataTime);
            pm_startTime.setHours(5, 1, 0, 0);
            var pm_startTimeUTC = convertDateToUTC(pm_startTime);

            var pm_midTime = new Date(last_dataTime);
            pm_midTime.setHours(6, 0, 0, 0);
            var pm_midTimeUTC = convertDateToUTC(pm_midTime);

            var pm_lastTime = new Date(last_dataTime);
            pm_lastTime.setHours(7, 0, 0, 0);
            var pm_lastTimeUTC = convertDateToUTC(pm_lastTime);
            //----------------------------------------------------------
            // Create the chart
            obj.id.highcharts('StockChart', {
                chart: {
                    //关闭平移
                    panning: false,
                    zoomType: 'none',
                    pinchType: 'none',
                    renderTo: "line_map",
                    margin: [10, 1, 20, 50],
                    spacing: [0, 0, 0, 0],
                    plotBorderColor: '#3C94C4',
                    plotBorderWidth: 0, //边框
                    events: {
                        load: function() {
                            var chart = obj.id.highcharts(); // Highcharts构造函数
                            //基准线
                            chart.yAxis[0].addPlotLine({ //在x轴上增加
                                value: yesterdayClose, //在值为2的地方             //在x轴上增加
                                width: 2, //标示线的宽度为2px
                                color: '#CCC', //标示线的颜色
                                zIndex: 1,
                                id: 'plot-line-' //标示线的id，在删除该标示线的时候需要该id标示
                            });
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    valueDecinale: 2,
                    useHTML: true,
                    formatter: function() {
                        //var _name = this.points[1].series.name;
                        var _name = obj.codeName;
                        var _date = Highcharts.dateFormat('%b%e日,%A,%H:%M', this.x);
                        var _y = this.points[0].y.toFixed(3);
                        return '<p style="margin:0px;padding:0px;font-size:14px;"><span>' + _name + '   </span><span style="' + Comparative(_y, obj.prev_close) + ';">' + _y + '</span></p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>';
                        //var _yy = this.points[2].y;
                        //return '<p style="margin:0px;padding:0px;font-size:14px;">' + _name +  ' <span style="'+Comparative(_y,obj.prev_close)+';float:right;">'+_y+ '</span></p><p style="margin:0px;padding:0px;font-size:14px;">'+
                        //'成交量：' + ' <span style="float:right;">'+(_yy).toFixed(0)+ '</p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>'
                    }
                },
                plotOptions: {
                    series: {
                        /*关闭动画*/
                        animation: false
                    }
                },
                rangeSelector: {
                    enabled: false
                },
                /*导出配置*/
                exporting: {
                    enabled: false
                },
                /*创建者信息*/
                credits: {
                    enabled: false
                },
                /*下部时间拖拉选择*/
                navigator: {
                    enabled: false,
                    /*关闭时间选择*/
                    baseseries: 10
                },
                scrollbar: {
                    enabled: false /*关闭下方滚动条*/
                },
                /*底部滚动条*/
                scrollbar: {
                    enabled: false
                },
                xAxis: {
                    //type: 'datetime',
                    ordinal: false,
                    breaks: [{ // Nights
                        breakSize: 1,
                        from: am_lastTimeUTC,
                        to: pm_startTimeUTC
                    }],
                    //minRange: 14 * 24 * 36000, // fourteen days
                    showFirstLabel: true,
                    showLastLabel: true,
                    scrollbar: {
                        enabled: true
                    },
                    labels: {
                        // staggerLines:5
                        style: { //字体样式
                            font: 'normal 12px'
                        },
                        formatter: function() {
                            //var returnTime=Highcharts.dateFormat('%H:%M', this.value-Number(8 * 3600 * 1000));
                            var returnTime = Highcharts.dateFormat('%H:%M', this.value);
                            if (returnTime == "09:30") {
                                return '<span style="margin-left:33px;color:#aaa">09:30</span>';
                            }
                            if (returnTime == "11:30") {
                                return '<span style="color:#aaa">11:30/13:00</span>';
                            }
                            if (returnTime == "10:30") {
                                return "";
                            }
                            if (returnTime == "14:00") {
                                return "";
                            }
                            if (returnTime == "15:00") {
                                return '<span style="margin-right:35px;color:#aaa">15:00</span>';
                            }
                            return returnTime;
                        },
                        y: 15,
                        //x:10,
                        step: 1,
                        useHTML: true
                    },
                    tickLength: 5,
                    tickPositioner: function() {
                        var positions = [am_startTimeUTC, am_midTimeUTC, am_lastTimeUTC, pm_midTimeUTC, pm_lastTimeUTC];
                        //var positions = [am_startTimeUTC,  am_lastTimeUTC,pm_lastTimeUTC];
                        return positions;
                    },
                    gridLineDashStyle: 'ShortDash',
                    gridLineColor: '#f2f2f2',
                    gridLineWidth: 1
                },
                yAxis: [{
                        opposite: true, //是否把它显示到另一边（右边）
                        labels: {
                            enabled: false
                        },
                        title: {
                            text: ''
                        },
                        top: '0%',
                        height: '100%',
                        lineWidth: 0,
                        showFirstLabel: false,
                        showLastLabel: false,
                        gridLineWidth: 0,
                        x: 0,
                        y: 0,
                        tickPositioner: function() { //以yesterdayClose为界限，统一间隔值，从 最小到最大步进
                            positions = [
                                (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(3), (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(3),
                                obj.prev_close.toFixed(3), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(3), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(3)
                            ];
                            return positions;
                        }
                    }, //y1
                    {
                        opposite: false, //是否把它显示到另一边（右边）
                        showFirstLabel: true,
                        showLastLabel: true,
                        labels: {
                            enabled: true,
                            overflow: 'justify',
                            style: { //字体样式
                                font: 'normal 12px'
                            },
                            align: 'right',
                            x: -5,
                            y: 5,
                            formatter: function() { //最新价  px_last/preclose昨收盘-1
                                //return 100*(((this.value/yesterdayClose)-1).toFixed(4))+"%";
                                return '<span style="color:#aaa;">' + this.value + '</span>';
                            }
                        },
                        useHTML: true,
                        title: {
                            text: ''
                        },
                        lineWidth: 1,
                        top: '0%',
                        height: '100%',
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        tickPositioner: function() {
                            return positions;
                        }
                    }
                ],
                series: [{
                    name: obj.codeName,
                    data: price_trend,
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    name: obj.codeName,
                    data: price_trend,
                    type: 'area',
                    cursor: 'pointer',
                    onSeries: 'candlestick',
                    color: 'transparent',
                    style: {
                        fontSize: '0px',
                        fontWeight: '0',
                        textAlign: 'center'
                    },
                    zIndex: -1000,
                    yAxis: 1,
                    dataGrouping: {
                        units: groupingUnits
                    }
                }]
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //返回错误信息
            //console.log("Ajax返回错误信息:"+XMLHttpRequest.status+"~"+XMLHttpRequest.readyState+"~"+textStatus);
        }
    });
}

/******************************************************股票*****************************************************/
function delay_snapAjax(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/snap/" + obj.code,
        jsonp: "callback",
        data: {
            select: 'name,last,chg_rate,change,open,prev_close,high,low,tradephase'
        },
        cache: false,
        success: function(resultData) {
            var _code = resultData.code;
            var pad01Arr = [];
            var _snap_val = resultData.snap;

            var color;

            var _name = _snap_val[0]; //名称
            var _xj = _snap_val[1]; //现价
            var _zs = _snap_val[5]; //昨收
            var _zd = _snap_val[3] ? '<span class="updowns">涨跌值</span>' + _snap_val[3] : ""; //涨跌
            var _zdf = _snap_val[2].toFixed(2) + ''; //涨跌幅,有问题，应该在涨跌判断以后再取两位小数
            var _high = _snap_val[6]; //最高价
            var _low = _snap_val[7]; //最低价
            var _open = _snap_val[4]; //开盘价
            var _tradephase = _snap_val[8];

            var classes;

            function zhangdie(y) {
                if (y > _snap_val[5]) {
                    classes = "col_red";
                } else if (y < _snap_val[5]) {
                    classes = "col_green";
                } else {
                    classes = "col_color";
                }
                return ("<span class=" + classes + ">" + y + "</span>")
            }

            if (_zs != _xj) {
                if (_zd > 0) {
                    _zd = "+" + _zd;
                    classes = "col_red";
                } else {
                    //_zdf = "-"+_zdf;
                    classes = "col_green";
                }
            } else {
                classs = "col_color";
            }

            if (obj.type == 'huigou') {
                //新需求，回购下
                pad01Arr.push("<table><tr class='tr_a'><td class='td_a'>" + _code + "</td><td class='td_b'>" + _name + "</td></tr><tr class='tr_b'><td class='td_a' rowspan='2'>" + zhangdie(_xj.toFixed(3)) + "</td><td class='td_b w120 " + classes + "'>" + _zd + "</td></tr><tr class='tr_c'><td class='td_b w120 " + classes + "' id='ht-ap'></td></tr></table>");
            } else {
                pad01Arr.push("<table><tr class='tr_a'><td class='td_a'>" + _code + "</td><td class='td_b'>" + _name + "</td></tr><tr class='tr_b'><td class='td_a' rowspan='2'>" + zhangdie(_xj) + "</td><td class='td_b w120 " + classes + "'>" + _zd + "</td></tr><tr class='tr_c'><td class='td_b w120 " + classes + "'>" + _zdf + "%</td></tr></table>");
            }
            obj.detId.html(pad01Arr.join(""));
            if (resultData.snap.length < 1) {
                obj.id.html('<center style="margin-top:80px;"><span class="nal" style="color: #ccc;font-size: 20px;">暂无走势信息</span></center>');
            }

            if (_tradephase.replace(/\s/ig, '') == "P1") {
                obj.id.html('<center style="margin-top:80px;"><span class="nal" style="color: #ccc;font-size: 20px;">停牌中</span></center>');
            } else if (_tradephase.replace(/\s/ig, '') == "C1") {
                obj.id.html('<center style="margin-top:80px;"><span class="nal" style="color: #ccc;font-size: 20px;">集合竞价中</span></center>');
            } else {
                if (checkBrowser()) {
                    if (obj.type == 'huigou') {
                        $.ajax({
                            type: 'POST',
                            dataType: "jsonp",
                            url: hq_queryUrl + "/v1/sh1/snap/" + obj.code,
                            data: {
                                select: 'cpxxprodusta'
                            },
                            jsonp: "callback",
                            cache: false,
                            success: function(resultData) {
                                var data = resultData.snap[0]


                                var this_code = data[6]


                                if (this_code == "S") {
                                    delay_ajax_hg({
                                        id: obj.id,
                                        code: _code,
                                        last: _xj,
                                        codeName: _name,
                                        open: _open,
                                        high: _high,
                                        low: _low,
                                        prev_close: _zs,
                                        flag: true
                                    })
                                } else {
                                    delay_ajax_hg({
                                        id: obj.id,
                                        code: _code,
                                        last: _xj,
                                        codeName: _name,
                                        open: _open,
                                        high: _high,
                                        low: _low,
                                        prev_close: _zs
                                    })
                                }
                            }


                        })
                    } else {
                        delay_ajax({
                            id: obj.id,
                            code: _code,
                            last: _xj,
                            codeName: _name,
                            open: _open,
                            high: _high,
                            low: _low,
                            prev_close: _zs
                        });
                    }

                }
            }
        }
    })
}
/******************************************************股票科创板*****************************************************/
function delay_snapAjax_kcb(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/snap/" + obj.code,
        jsonp: "callback",
        data: {
            select: 'name,last,chg_rate,change,open,prev_close,high,low,tradephase,cpxxprodusta'
        },
        cache: false,
        success: function(resultData) {
            var _code = resultData.code;
            var pad01Arr = [];
            var _snap_val = resultData.snap;

            var color;

            var _name = _snap_val[0]; //名称
            var _xj = _snap_val[1]; //现价
            var _zs = _snap_val[5]; //昨收
            var _zd = _snap_val[3] ? '<span class="updowns">涨跌值</span>' + _snap_val[3] : ""; //涨跌
            var _zdf = _snap_val[2].toFixed(2) + ''; //涨跌幅,有问题，应该在涨跌判断以后再取两位小数
            var _high = _snap_val[6]; //最高价
            var _low = _snap_val[7]; //最低价
            var _open = _snap_val[4]; //开盘价
            var _tradephase = _snap_val[8];
            // var url_kcb = "/images/icon_kcb.png";

            var _cpztxx = _snap_val[9]; //产品状态信息
            var _cpztxx_arr = _cpztxx.split('');
            var showU = "";
            var showW = "";
            var showC = "";
            // if (_code.substring(0, 4) == '6889') {

            // }
            var showK = "<a href='javascript:void(0);' class='icon_kcb_k' title=''></a>";
            if (_cpztxx_arr[4] == "Y") {
                showC = "<a href='javascript:void(0);' class='icon_kcb_c' title=''></a>";
            }
            if (_cpztxx_arr[7] == "U") {
                showU += "<a href='javascript:void(0);' class='icon_kcb_u' title=''></a>";
            }
            if (_cpztxx_arr[8] == "W") {
                showW += "<a href='javascript:void(0);' class='icon_kcb_w' title=''></a>";
            }
            // var url_kcbU = "/images/icon_kcbU.png";
            // var url_kcbW = "/images/icon_kcbW.png";
            // var url_kcb = "/images/icon_kcb.png";
            // var showU = "";
            // var showW = "";
            // var showK = "<a href='javascript:void(0);' title='' style='cursor: default;display: inline-block;width:16px;height:16px;background:url(" + url_kcb + ");background-size:100%;background-repeat: no-repeat;background-position: center;'></a>";
            // if (_cpztxx_arr[7] == "U") {
            //     showU += "<a href='javascript:void(0);' title='' style='cursor: default;display: inline-block;width:16px;height:16px;background:url(" + url_kcbU + ");background-size:100%;background-repeat: no-repeat;background-position: center;'></a>";
            // }
            // if (_cpztxx_arr[8] == "W") {
            //     showW += "<a href='javascript:void(0);' title='' style='cursor: default;display: inline-block;width:16px;height:16px;background:url(" + url_kcbW + ");background-size:100%;background-repeat: no-repeat;background-position: center;'></a>";
            // }
            var classes;

            function zhangdie(y) {
                if (y > _snap_val[5]) {
                    classes = "col_red";
                } else if (y < _snap_val[5]) {
                    classes = "col_green";
                } else {
                    classes = "col_color";
                }
                return ("<span class=" + classes + ">" + y + "</span>")
            }

            if (_zs != _xj) {
                if (_zd > 0) {
                    _zd = "+" + _zd;
                    classes = "col_red";
                } else {
                    //_zdf = "-"+_zdf;
                    classes = "col_green";
                }
            } else {
                classs = "col_color";
            }
            $(".delayAjax_hq").css("height", "320px");
            $(".delayAjax_hq #pad01").css("height", "95px");


            pad01Arr.push("<table><tr class='tr_a'><td class='td_a'>" + _code + "</td></tr><tr><td class='td_a' style='font-size:18px' colspan='2'>" + _name + showK + showU + showW + showC + "</td></tr><tr class='tr_b'><td class='td_a' rowspan='2'>" + zhangdie(_xj) + "</td><td class='td_b w120 " + classes + "'>" + _zd + "</td></tr><tr class='tr_c'><td class='td_b w120 " + classes + "'>" + _zdf + "%</td></tr></table>");

            obj.detId.html(pad01Arr.join(""));
            if (resultData.snap.length < 1) {
                obj.id.html('<center style="margin-top:80px;"><span class="nal" style="color: #ccc;font-size: 20px;">暂无走势信息</span></center>');
            }

            if (_tradephase.replace(/\s/ig, '') == "P1") {
                obj.id.html('<center style="margin-top:80px;"><span class="nal" style="color: #ccc;font-size: 20px;">停牌中</span></center>');
            } else if (_tradephase.replace(/\s/ig, '') == "C1") {
                obj.id.html('<center style="margin-top:80px;"><span class="nal" style="color: #ccc;font-size: 20px;">集合竞价中</span></center>');
            } else {
                if (checkBrowser()) {

                    delay_ajax_kcb({
                        id: obj.id,
                        code: _code,
                        last: _xj,
                        codeName: _name,
                        open: _open,
                        high: _high,
                        low: _low,
                        prev_close: _zs
                    });
                }


            }
        }
    })
}
// function selectBuyBack(code){

//   $.ajax({
//     type: 'POST',
//     dataType: "jsonp",
//     url: hq_queryUrl + "/v1/sh1/snap/" +code,
//     data: {
//         begin: 0,
//         end: -1,
//         select: 'cpxxprodusta'
//     },
//     jsonp: "callback",
//     cache: false,
//     success: function(resultData) {

//         var data = resultData.snap[0]
//         for (var i = 0; i<data.length; i++) {
//          if(data[i]){
//             ccc =data[i]
//         }   
//     }
// }})
// };

//回购新需求
function delay_ajax_hg(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/line/" + obj.code,
        data: {
            begin: 0,
            end: -1,
            select: 'time,price,volume,avg_price'
        },
        jsonp: "callback",
        cache: false,
        success: function(resultData) {
            var dd = resultData;
            var resultDataline = resultData.line
            if (resultDataline.length > 0) {
                var linelist = resultDataline[resultDataline.length - 1];
                var ap = linelist[3];
                $("#ht-ap").html("<span class='updowns'>均价</span>" + ap)
            }
            var d = dateConvert({
                data: dd,
                last: obj.last,
                open: obj.open
            });
            //var data = null;
            var data = d.line;
            //没数据时不显示图表
            if (data.length == 0) {
                obj.id.html("<div class='chart_container'></div>");
                return;
            }
            $(".delayAjax_hq .right").remove(".sse_table_title2").append('<div class="sse_table_title2"><p>' + turnDateAddLine(resultData.date + "") + '</p></div>');

            Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                lang: {
                    loading: "加载中",
                    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    noData: "没有数据",
                    numericSymbols: ["千", "兆", "G", "T", "P", "E"],
                    printChart: "打印图表",
                    resetZoom: "恢复缩放",
                    resetZoomTitle: "恢复图表",
                    shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    thousandsSep: ",",
                    weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
                }
            });
            //初始化开------------------------
            var groupingUnits = [
                [
                    'minute', // unit name
                    [1] // allowed multiples
                ]
            ];
            var avg_pxyAxisMin; //Y轴最小值
            var avg_pxyAxisMax; //Y轴最大值 
            var percentageyAxisMin; //Y轴百分比最小
            var percentageyAxisMax; //Y轴百分比最大
            var volume_yAxisMin; //成交量最小
            var volume_yAxisMax; //成交量最大
            var red = "#ff0000";
            var blue = "#00a800";
            var price_trend = [],
                avg_prices = [],
                volume = [], //成交量
                i = 0;
            //图表上的成交量第一条的数据红绿的判断 是根据昨日的收盘价preclose_px 和今日的最新价last_px进行对比
            //同时获取的昨日收盘价  用于涨幅的计算
            var isFirstLineColorflag = true;
            //保存昨收数据
            var yesterdayClose;
            //容错判断
            if (data != undefined && data != null && data.length == 0) {
                try {
                    failCallback();
                } catch (e) {

                }
                return;
            }
            //今开
            var open_px = data[i][1];
            //昨收
            //var preclose_px=data[i][3];
            var preclose_px = d.prev_close;
            yesterdayClose = preclose_px;
            isFirstLineColorflag = open_px > preclose_px ? true : false;
            // split the data set into price_trend and volume
            //数据处理
            for (i; i < data.length; i += 1) {
                var _dates = data[i][0] + "";
                var _hours = _dates.substring(8, 10);
                var dateUTC = getDateUTCOrNot(_dates, true);
                var business_amount = data[i][2];
                var columnColor = red;
                if (i == 0) { //第一笔的 红绿柱 判断依据是根据 今天开盘价与昨日收盘价比较
                    if (isFirstLineColorflag == false) {
                        columnColor = blue;
                    }
                    avg_pxyAxisMin = data[i][1];
                    avg_pxyAxisMax = data[i][1];
                    percentageyAxisMin = Number(100 * (data[i][1] / yesterdayClose - 1));
                    percentageyAxisMax = Number(100 * (data[i][1] / yesterdayClose - 1));
                    volume_yAxisMin = data[i][2];
                    volume_yAxisMax = data[i][2];
                } else {
                    //除了第一笔，其它都是  返回的 last_px 与前一个对比
                    if (data[i - 1][1] - data[i][1] > 0) {
                        columnColor = blue;
                    }
                    business_amount = data[i][2] - data[i - 1][2];
                }
                avg_pxyAxisMin = avg_pxyAxisMin > data[i][1] ? data[i][1] : avg_pxyAxisMin;
                avg_pxyAxisMax = avg_pxyAxisMax > data[i][1] ? avg_pxyAxisMax : data[i][1];
                percentageyAxisMin = percentageyAxisMin > Number(100 * (data[i][1] / yesterdayClose - 1)) ? Number(100 * (data[i][1] / yesterdayClose - 1)) : percentageyAxisMin;
                percentageyAxisMax = percentageyAxisMax > Number(100 * (data[i][1] / yesterdayClose - 1)) ? percentageyAxisMax : Number(100 * (data[i][1] / yesterdayClose - 1));
                // = Math.min(_vol);
                //volume_yAxisMax=Math.max(_vol);
                //将数据放入 price_trend volume 数组中

                price_trend.push({
                    x: dateUTC,
                    y: Number(data[i][1])
                });
                avg_prices.push({
                    x: dateUTC,
                    y: Number(data[i][3])
                });
                volume.push({
                    x: dateUTC,
                    y: Number(data[i][2])
                });
            }
            if (obj.flag) {
                //将剩下的时间信息补全
                appendTimeMessage(price_trend, volume, data, true);
                //将剩下的时间信息补全
                appendTimeMessage(avg_prices, volume, data, true);

            } else {
                appendTimeMessage(price_trend, volume, data);
                //将剩下的时间信息补全
                appendTimeMessage(avg_prices, volume, data);
            }



            //11:30～13:01
            var date;
            if (data.length > 0) {
                date = data[data.length - 1][0] + "";
                var dArr = new Array();
                for (var hh = 0; hh < 5; hh++) {
                    var numb;
                    if (hh == 0) {
                        numb = Number(date.slice(0, 4));
                    } else {
                        numb = Number(date.slice((hh - 1) * 2 + 4, hh * 2 + 4));
                    }

                    dArr.push(numb);
                }
            }

            var last_dataTime = new Date(dArr[0], dArr[1] - 1, dArr[2], dArr[3], dArr[4]);
            var $reporting = $("#report");
            $reporting.html("");
            // Create the chart
            var am_startTime = new Date(last_dataTime);
            am_startTime.setHours(1, 30, 0, 0);
            var am_startTimeUTC = convertDateToUTC(am_startTime);
            var am_midTime = new Date(last_dataTime);
            am_midTime.setHours(2, 30, 0, 0);
            var am_midTimeUTC = convertDateToUTC(am_midTime);

            //股票交易早上最后的时间
            var am_lastTime = new Date(last_dataTime);
            am_lastTime.setHours(3, 30, 0, 0);
            var am_lastTimeUTC = convertDateToUTC(am_lastTime);

            //股票交易下午最后的时间
            var pm_startTime = new Date(last_dataTime);
            pm_startTime.setHours(5, 1, 0, 0);
            var pm_startTimeUTC = convertDateToUTC(pm_startTime);

            var pm_midTime = new Date(last_dataTime);
            pm_midTime.setHours(6, 0, 0, 0);
            var pm_midTimeUTC = convertDateToUTC(pm_midTime);

            var pm_lastTime = new Date(last_dataTime);
            pm_lastTime.setHours(7, 0, 0, 0);
            var pm_lastTimeUTC = convertDateToUTC(pm_lastTime);
            var pm_lastTimenew = new Date(last_dataTime);
            pm_lastTimenew.setHours(7, 30, 0, 0);
            var pm_lastTimeUTCnew = convertDateToUTC(pm_lastTimenew);

            //----------------------------------------------------------
            // Create the chart
            obj.id.highcharts('StockChart', {
                chart: {
                    //关闭平移
                    panning: false,
                    zoomType: 'none',
                    pinchType: 'none',
                    renderTo: "line_map",
                    margin: [10, 1, 20, 50],
                    spacing: [0, 0, 0, 0],
                    plotBorderColor: '#3C94C4',
                    plotBorderWidth: 0, //边框
                    events: {
                        load: function() {
                            var chart = obj.id.highcharts(); // Highcharts构造函数
                            //基准线
                            chart.yAxis[0].addPlotLine({ //在x轴上增加
                                value: yesterdayClose, //在值为2的地方             //在x轴上增加
                                width: 2, //标示线的宽度为2px
                                color: '#CCC', //标示线的颜色
                                zIndex: 1,
                                id: 'plot-line-' //标示线的id，在删除该标示线的时候需要该id标示
                            });
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    valueDecinale: 2,
                    useHTML: true,
                    formatter: function() {
                        var _name = obj.codeName;
                        var _date = Highcharts.dateFormat('%b%e日,%A,%H:%M', this.x);
                        var _y = this.points[1].y.toFixed(3);
                        var _avg = this.points[0].y.toFixed(3);
                        return '<p style="margin:0px;padding:0px;font-size:14px;"><span style="color:rgb(52, 109, 164);font-size:10px;">\u25CF</span><span>' + _name + '   </span><span style="' + Comparative(_y, obj.prev_close) + ';">' + _y + '</span></p><p style="margin:0px;padding:0px;font-size:14px;"><span style="color:rgb(160, 217, 255);font-size:10px;">\u25C6</span> <span>' +
                            '均价：  </span>' + ' <span style="' + Comparative(_avg, obj.prev_close) + ';">' + _avg + '</span></p><p style="margin:0px;padding:0px;font-size:14px;"></p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>';
                    }
                },
                plotOptions: {
                    series: {
                        /*关闭动画*/
                        animation: false
                    }
                },
                rangeSelector: {
                    enabled: false
                },
                /*导出配置*/
                exporting: {
                    enabled: false
                },
                /*创建者信息*/
                credits: {
                    enabled: false
                },
                /*下部时间拖拉选择*/
                navigator: {
                    enabled: false,
                    /*关闭时间选择*/
                    baseseries: 10
                },
                scrollbar: {
                    enabled: false /*关闭下方滚动条*/
                },
                /*底部滚动条*/
                scrollbar: {
                    enabled: false
                },
                xAxis: {
                    //type: 'datetime',
                    ordinal: false,
                    breaks: [{ // Nights
                        breakSize: 1,
                        from: am_lastTimeUTC,
                        to: pm_startTimeUTC
                    }],
                    //minRange: 14 * 24 * 36000, // fourteen days
                    showFirstLabel: true,
                    showLastLabel: true,
                    scrollbar: {
                        enabled: true
                    },
                    labels: {
                        // staggerLines:5
                        style: { //字体样式
                            font: 'normal 12px'
                        },
                        formatter: function() {
                            //var returnTime=Highcharts.dateFormat('%H:%M', this.value-Number(8 * 3600 * 1000));
                            var returnTime = Highcharts.dateFormat('%H:%M', this.value);
                            if (returnTime == "09:30") {
                                return '<span style="margin-left:33px;color:#aaa">09:30</span>';
                            }
                            if (returnTime == "11:30") {
                                return '<span style="color:#aaa">11:30/13:00</span>';
                            }
                            if (returnTime == "10:30") {
                                return "";
                            }
                            if (returnTime == "14:00") {
                                return "";
                            }
                            if (obj.flag) {
                                if (returnTime == "15:00") {
                                    return '<span style="display:none">15:00</span>';
                                }
                                if (returnTime == "15:30") {
                                    return '<span style="margin-right:35px;color:#aaa">15:30</span>';
                                }
                            } else {
                                if (returnTime == "15:00") {
                                    return '<span style="margin-right:35px;color:#aaa">15:00</span>';
                                }
                            }



                            return returnTime;
                        },
                        y: 15,
                        //x:10,
                        step: 1,
                        useHTML: true
                    },
                    tickLength: obj.flag ? 6 : 5,
                    tickPositioner: function() {
                        if (obj.flag) {
                            var positions = [am_startTimeUTC, am_midTimeUTC, am_lastTimeUTC, pm_midTimeUTC, pm_lastTimeUTC, pm_lastTimeUTCnew];
                        } else {
                            var positions = [am_startTimeUTC, am_midTimeUTC, am_lastTimeUTC, pm_midTimeUTC, pm_lastTimeUTC];
                        }
                        return positions;
                    },
                    gridLineDashStyle: 'ShortDash',
                    gridLineColor: '#f2f2f2',
                    gridLineWidth: 1
                },
                yAxis: [{
                        opposite: false, //是否把它显示到另一边（右边）
                        labels: {
                            align: 'right',
                            x: -5,
                            y: 5,
                            useHTML: true,
                            formatter: function() {
                                // return "<span style=" + Comparative(this.value, obj.prev_close) + ">" + this.value + "</span>"
                                return this.value;
                            }
                        },
                        lineWidth: 1,
                        showFirstLabel: true,
                        showLastLabel: true,
                        gridLineWidth: 0,
                        tickPositioner: function() { //以yesterdayClose为界限，统一间隔值，从 最小到最大步进
                            positions = [
                                (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(3), (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(3),
                                obj.prev_close.toFixed(3), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(3), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(3)
                            ];
                            return positions;
                        }
                    }, //y1
                    {
                        opposite: true, //是否把它显示到另一边（右边）
                        showFirstLabel: true,
                        showLastLabel: true,
                        labels: {
                            align: 'left',
                            // x: -5,
                            // y: 5,
                            useHTML: true,
                            formatter: function() {
                                return "<span style=" + Comparative(this.value, 0) + ">" + this.value + "</span>"
                            }
                        },
                        lineWidth: 1,
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        tickPositioner: function() {
                            var gapping = (Math.abs((Math.max(Math.abs(obj.high), Math.abs(obj.low)) - obj.prev_close))).toFixed(3);
                            positions = [
                                "-" + gapping,
                                "-" + gapping / 2,
                                '0.000',
                                "+" + gapping / 2,
                                "+" + gapping
                            ];
                            return positions;
                        }
                    }
                ],
                series: [{
                    name: obj.codeName,
                    data: avg_prices,
                    yAxis: 0,
                    color: 'rgb(160, 217, 255)',
                    marker: {
                        symbol: 'diamond'
                    },
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    name: obj.codeName,
                    data: price_trend,
                    yAxis: 0,
                    type: 'line',
                    cursor: 'pointer',
                    onSeries: 'candlestick',
                    color: 'rgb(52, 109, 164)',
                    marker: {
                        symbol: 'circle'
                    },
                    fillColor: {
                        linearGradient: { //渐变方向
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    dataGrouping: {
                        units: groupingUnits
                    }
                }]
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //返回错误信息
            //console.log("Ajax返回错误信息:"+XMLHttpRequest.status+"~"+XMLHttpRequest.readyState+"~"+textStatus);
        }
    });
}

function delay_ajax(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/line/" + obj.code,
        data: {
            begin: 0,
            end: -1,
            select: 'time,price,volume'
        },
        jsonp: "callback",
        cache: false,
        success: function(resultData) {
            var dd = resultData;
            var d = dateConvert({
                data: dd,
                last: obj.last,
                open: obj.open
            });
            //var data = null;
            var data = d.line;
            //没数据时不显示图表
            if (data.length == 0) {
                obj.id.html("<div class='chart_container'></div>");
                return;
            }
            $(".delayAjax_hq .right").remove(".sse_table_title2").append('<div class="sse_table_title2"><p>' + turnDateAddLine(resultData.date + "") + '</p></div>');
            Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                lang: {
                    loading: "加载中",
                    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    noData: "没有数据",
                    numericSymbols: ["千", "兆", "G", "T", "P", "E"],
                    printChart: "打印图表",
                    resetZoom: "恢复缩放",
                    resetZoomTitle: "恢复图表",
                    shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    thousandsSep: ",",
                    weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
                }
            });
            //初始化开------------------------
            var groupingUnits = [
                [
                    'minute', // unit name
                    [1] // allowed multiples
                ]
            ];
            var avg_pxyAxisMin; //Y轴最小值
            var avg_pxyAxisMax; //Y轴最大值 
            var percentageyAxisMin; //Y轴百分比最小
            var percentageyAxisMax; //Y轴百分比最大
            var volume_yAxisMin; //成交量最小
            var volume_yAxisMax; //成交量最大
            var red = "#ff0000";
            var blue = "#00a800";
            var price_trend = [],
                volume = [], //成交量
                i = 0;
            //图表上的成交量第一条的数据红绿的判断 是根据昨日的收盘价preclose_px 和今日的最新价last_px进行对比
            //同时获取的昨日收盘价  用于涨幅的计算
            var isFirstLineColorflag = true;
            //保存昨收数据
            var yesterdayClose;
            //容错判断
            if (data != undefined && data != null && data.length == 0) {
                try {
                    failCallback();
                } catch (e) {

                }
                return;
            }
            //今开
            var open_px = data[i][1];
            //昨收
            //var preclose_px=data[i][3];
            var preclose_px = d.prev_close;
            yesterdayClose = preclose_px;
            isFirstLineColorflag = open_px > preclose_px ? true : false;
            // split the data set into price_trend and volume
            //数据处理
            for (i; i < data.length; i += 1) {
                var _dates = data[i][0] + "";
                var _hours = _dates.substring(8, 10);
                var dateUTC = getDateUTCOrNot(_dates, true);
                var business_amount = data[i][2];
                var columnColor = red;
                if (i == 0) { //第一笔的 红绿柱 判断依据是根据 今天开盘价与昨日收盘价比较
                    if (isFirstLineColorflag == false) {
                        columnColor = blue;
                    }
                    avg_pxyAxisMin = data[i][1];
                    avg_pxyAxisMax = data[i][1];
                    percentageyAxisMin = Number(100 * (data[i][1] / yesterdayClose - 1));
                    percentageyAxisMax = Number(100 * (data[i][1] / yesterdayClose - 1));
                    volume_yAxisMin = data[i][2];
                    volume_yAxisMax = data[i][2];
                } else {
                    //除了第一笔，其它都是  返回的 last_px 与前一个对比
                    if (data[i - 1][1] - data[i][1] > 0) {
                        columnColor = blue;
                    }
                }
                avg_pxyAxisMin = avg_pxyAxisMin > data[i][1] ? data[i][1] : avg_pxyAxisMin;
                avg_pxyAxisMax = avg_pxyAxisMax > data[i][1] ? avg_pxyAxisMax : data[i][1];
                percentageyAxisMin = percentageyAxisMin > Number(100 * (data[i][1] / yesterdayClose - 1)) ? Number(100 * (data[i][1] / yesterdayClose - 1)) : percentageyAxisMin;
                percentageyAxisMax = percentageyAxisMax > Number(100 * (data[i][1] / yesterdayClose - 1)) ? percentageyAxisMax : Number(100 * (data[i][1] / yesterdayClose - 1));
                volume_yAxisMin = volume_yAxisMin > business_amount ? business_amount : volume_yAxisMin;
                volume_yAxisMax = volume_yAxisMax > business_amount ? volume_yAxisMax : business_amount;
                //将数据放入 price_trend volume 数组中

                price_trend.push({
                    x: dateUTC,
                    y: Number(data[i][1])
                });
                volume.push({
                    x: dateUTC,
                    y: Number(business_amount),
                    color: columnColor
                });
            }

            //将剩下的时间信息补全
            appendTimeMessage(price_trend, volume, data);
            //常量本地化
            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });

            var date;
            if (data.length > 0) {
                date = data[data.length - 1][0] + "";
                var dArr = new Array();
                for (var hh = 0; hh < 5; hh++) {
                    var numb;
                    if (hh == 0) {
                        numb = Number(date.slice(0, 4));
                    } else {
                        numb = Number(date.slice((hh - 1) * 2 + 4, hh * 2 + 4));
                    }

                    dArr.push(numb);
                }
            }
            var last_dataTime = new Date(dArr[0], dArr[1] - 1, dArr[2], dArr[3], dArr[4]);
            var $reporting = $("#report");
            $reporting.html("");
            // Create the chart
            var am_startTime = new Date(last_dataTime);
            am_startTime.setHours(1, 30, 0, 0);
            var am_startTimeUTC = convertDateToUTC(am_startTime);
            var am_midTime = new Date(last_dataTime);
            am_midTime.setHours(2, 30, 0, 0);
            var am_midTimeUTC = convertDateToUTC(am_midTime);

            //股票交易早上最后的时间
            var am_lastTime = new Date(last_dataTime);
            am_lastTime.setHours(3, 30, 0, 0);
            var am_lastTimeUTC = convertDateToUTC(am_lastTime);

            //股票交易下午最后的时间
            var pm_startTime = new Date(last_dataTime);
            pm_startTime.setHours(5, 1, 0, 0);
            var pm_startTimeUTC = convertDateToUTC(pm_startTime);

            var pm_midTime = new Date(last_dataTime);
            pm_midTime.setHours(6, 0, 0, 0);
            var pm_midTimeUTC = convertDateToUTC(pm_midTime);

            var pm_lastTime = new Date(last_dataTime);
            pm_lastTime.setHours(7, 0, 0, 0);
            var pm_lastTimeUTC = convertDateToUTC(pm_lastTime);
            //----------------------------------------------------------
            // Create the chart
            obj.id.highcharts('StockChart', {
                chart: {
                    //关闭平移
                    panning: false,
                    zoomType: 'none',
                    pinchType: 'none',
                    renderTo: "line_map",
                    margin: [10, 1, 20, 50],
                    spacing: [0, 0, 0, 0],
                    plotBorderColor: '#3C94C4',
                    plotBorderWidth: 0, //边框
                    events: {
                        load: function() {
                            var chart = obj.id.highcharts(); // Highcharts构造函数
                            //基准线
                            chart.yAxis[0].addPlotLine({ //在x轴上增加
                                value: yesterdayClose, //在值为2的地方             //在x轴上增加
                                width: 2, //标示线的宽度为2px
                                color: '#CCC', //标示线的颜色
                                zIndex: 1,
                                id: 'plot-line-' //标示线的id，在删除该标示线的时候需要该id标示
                            });
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    valueDecinale: 2,
                    useHTML: true,
                    formatter: function() {
                        //var _name = this.points[1].series.name;
                        var _name = obj.codeName;
                        var _date = Highcharts.dateFormat('%b%e日,%A,%H:%M', this.x);
                        var _y = this.points[0].y.toFixed(2);
                        return '<p style="margin:0px;padding:0px;font-size:14px;"><span>' + _name + '   </span><span style="' + Comparative(_y, obj.prev_close) + ';">' + _y + '</span></p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>';
                        //var _yy = this.points[2].y;
                        //return '<p style="margin:0px;padding:0px;font-size:14px;">' + _name +  ' <span style="'+Comparative(_y,obj.prev_close)+';float:right;">'+_y+ '</span></p><p style="margin:0px;padding:0px;font-size:14px;">'+
                        //'成交量：' + ' <span style="float:right;">'+(_yy).toFixed(0)+ '</p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>'
                    }
                },
                plotOptions: {
                    series: {
                        /*关闭动画*/
                        animation: false
                    }
                },
                rangeSelector: {
                    enabled: false
                },
                /*导出配置*/
                exporting: {
                    enabled: false
                },
                /*创建者信息*/
                credits: {
                    enabled: false
                },
                /*下部时间拖拉选择*/
                navigator: {
                    enabled: false,
                    /*关闭时间选择*/
                    baseseries: 10
                },
                scrollbar: {
                    enabled: false /*关闭下方滚动条*/
                },
                /*底部滚动条*/
                scrollbar: {
                    enabled: false
                },
                xAxis: {
                    //type: 'datetime',
                    ordinal: false,
                    breaks: [{ // Nights
                        breakSize: 1,
                        from: am_lastTimeUTC,
                        to: pm_startTimeUTC
                    }],
                    //minRange: 14 * 24 * 36000, // fourteen days
                    showFirstLabel: true,
                    showLastLabel: true,
                    scrollbar: {
                        enabled: true
                    },
                    labels: {
                        // staggerLines:5
                        style: { //字体样式
                            font: 'normal 12px'
                        },
                        formatter: function() {
                            //var returnTime=Highcharts.dateFormat('%H:%M', this.value-Number(8 * 3600 * 1000));
                            var returnTime = Highcharts.dateFormat('%H:%M', this.value);
                            if (returnTime == "09:30") {
                                return '<span style="margin-left:33px;color:#aaa">09:30</span>';
                            }
                            if (returnTime == "11:30") {
                                return '<span style="color:#aaa">11:30/13:00</span>';
                            }
                            if (returnTime == "10:30") {
                                return "";
                            }
                            if (returnTime == "14:00") {
                                return "";
                            }
                            if (returnTime == "15:00") {
                                return '<span style="margin-right:35px;color:#aaa">15:00</span>';
                            }
                            return returnTime;
                        },
                        y: 15,
                        //x:10,
                        step: 1,
                        useHTML: true
                    },
                    tickLength: 5,
                    tickPositioner: function() {
                        var positions = [am_startTimeUTC, am_midTimeUTC, am_lastTimeUTC, pm_midTimeUTC, pm_lastTimeUTC];
                        //var positions = [am_startTimeUTC,  am_lastTimeUTC,pm_lastTimeUTC];
                        return positions;
                    },
                    gridLineDashStyle: 'ShortDash',
                    gridLineColor: '#f2f2f2',
                    gridLineWidth: 1
                },
                yAxis: [{
                        opposite: true, //是否把它显示到另一边（右边）
                        labels: {
                            enabled: false
                        },
                        title: {
                            text: ''
                        },
                        top: '0%',
                        height: '100%',
                        lineWidth: 0,
                        showFirstLabel: false,
                        showLastLabel: false,
                        gridLineWidth: 0,
                        x: 0,
                        y: 0,
                        tickPositioner: function() { //以yesterdayClose为界限，统一间隔值，从 最小到最大步进
                            positions = [
                                (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(2), (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(2),
                                obj.prev_close.toFixed(2), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(2), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(2)
                            ];
                            return positions;
                        }
                    }, //y1
                    {
                        opposite: false, //是否把它显示到另一边（右边）
                        showFirstLabel: true,
                        showLastLabel: true,
                        labels: {
                            enabled: true,
                            overflow: 'justify',
                            style: { //字体样式
                                font: 'normal 12px'
                            },
                            align: 'right',
                            x: -5,
                            y: 5,
                            formatter: function() { //最新价  px_last/preclose昨收盘-1
                                //return 100*(((this.value/yesterdayClose)-1).toFixed(4))+"%";
                                return '<span style="color:#aaa;">' + this.value + '</span>';
                            }
                        },
                        useHTML: true,
                        title: {
                            text: ''
                        },
                        lineWidth: 1,
                        top: '0%',
                        height: '100%',
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        tickPositioner: function() {
                            return positions;
                        }
                    }
                ],
                series: [{
                    name: obj.codeName,
                    data: price_trend,
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    name: obj.codeName,
                    data: price_trend,
                    type: 'area',
                    cursor: 'pointer',
                    onSeries: 'candlestick',
                    color: 'transparent',
                    style: {
                        fontSize: '0px',
                        fontWeight: '0',
                        textAlign: 'center'
                    },
                    zIndex: -1000,
                    yAxis: 1,
                    dataGrouping: {
                        units: groupingUnits
                    }
                }]
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //返回错误信息
            //console.log("Ajax返回错误信息:"+XMLHttpRequest.status+"~"+XMLHttpRequest.readyState+"~"+textStatus);
        }
    });
}

function delay_ajax_kcb(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/line/" + obj.code,
        data: {
            begin: 0,
            end: -1,
            select: 'time,price,volume,avg_prices'
        },
        jsonp: "callback",
        cache: false,
        success: function(resultData) {
            var dd = resultData;
            var d = dateConvert({
                data: dd,
                last: obj.last,
                open: obj.open
            });
            //var data = null;
            var data = d.line;
            //没数据时不显示图表
            if (data.length == 0) {
                obj.id.html("<div class='chart_container'></div>");
                return;
            }
            if ($(".delayAjax_hq .right .sse_table_title2 p").length > 0) {
                $(".delayAjax_hq .right .sse_table_title2 p").html(turnDateAddLine(resultData.date + ""));
            } else {
                $(".delayAjax_hq .right").append('<div class="sse_table_title2"><p>' + turnDateAddLine(resultData.date + "") + '</p></div>');
            }

            Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                lang: {
                    loading: "加载中",
                    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    noData: "没有数据",
                    numericSymbols: ["千", "兆", "G", "T", "P", "E"],
                    printChart: "打印图表",
                    resetZoom: "恢复缩放",
                    resetZoomTitle: "恢复图表",
                    shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    thousandsSep: ",",
                    weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
                }
            });
            //初始化开------------------------
            var groupingUnits = [
                [
                    'minute', // unit name
                    [1] // allowed multiples
                ]
            ];
            var avg_pxyAxisMin; //Y轴最小值
            var avg_pxyAxisMax; //Y轴最大值 
            var percentageyAxisMin; //Y轴百分比最小
            var percentageyAxisMax; //Y轴百分比最大
            var volume_yAxisMin; //成交量最小
            var volume_yAxisMax; //成交量最大
            var red = "#ff0000";
            var blue = "#00a800";
            var price_trend = [],
                price_trend_h = [],
                avg_prices = [],
                aa_1,
                volume = [], //成交量
                i = 0;
            //图表上的成交量第一条的数据红绿的判断 是根据昨日的收盘价preclose_px 和今日的最新价last_px进行对比
            //同时获取的昨日收盘价  用于涨幅的计算
            var isFirstLineColorflag = true;
            //保存昨收数据
            var yesterdayClose;
            //容错判断
            if (data != undefined && data != null && data.length == 0) {
                try {
                    failCallback();
                } catch (e) {

                }
                return;
            }
            //今开
            var open_px = data[i][1];
            //昨收
            //var preclose_px=data[i][3];
            var preclose_px = d.prev_close;
            yesterdayClose = preclose_px;
            isFirstLineColorflag = open_px > preclose_px ? true : false;
            // split the data set into price_trend and volume
            //数据处理
            for (i; i < data.length; i += 1) {
                var _dates = data[i][0] + "";
                var _hours = _dates.substring(8, 10);
                var dateUTC = getDateUTCOrNot(_dates, true);
                var business_amount = data[i][2];
                var columnColor = red;
                if (i == 0) { //第一笔的 红绿柱 判断依据是根据 今天开盘价与昨日收盘价比较
                    if (isFirstLineColorflag == false) {
                        columnColor = blue;
                    }
                    avg_pxyAxisMin = data[i][1];
                    avg_pxyAxisMax = data[i][1];
                    percentageyAxisMin = Number(100 * (data[i][1] / yesterdayClose - 1));
                    percentageyAxisMax = Number(100 * (data[i][1] / yesterdayClose - 1));
                    volume_yAxisMin = data[i][2];
                    volume_yAxisMax = data[i][2];
                } else {
                    //除了第一笔，其它都是  返回的 last_px 与前一个对比
                    if (data[i - 1][1] - data[i][1] > 0) {
                        columnColor = blue;
                    }
                }
                avg_pxyAxisMin = avg_pxyAxisMin > data[i][1] ? data[i][1] : avg_pxyAxisMin;
                avg_pxyAxisMax = avg_pxyAxisMax > data[i][1] ? avg_pxyAxisMax : data[i][1];
                percentageyAxisMin = percentageyAxisMin > Number(100 * (data[i][1] / yesterdayClose - 1)) ? Number(100 * (data[i][1] / yesterdayClose - 1)) : percentageyAxisMin;
                percentageyAxisMax = percentageyAxisMax > Number(100 * (data[i][1] / yesterdayClose - 1)) ? percentageyAxisMax : Number(100 * (data[i][1] / yesterdayClose - 1));
                volume_yAxisMin = volume_yAxisMin > business_amount ? business_amount : volume_yAxisMin;
                volume_yAxisMax = volume_yAxisMax > business_amount ? volume_yAxisMax : business_amount;
                //将数据放入 price_trend volume 数组中

                if (i < 241) {
                    price_trend.push({
                        x: dateUTC,
                        y: Number(data[i][1])
                    });
                }
                if (i >= 241) {

                    price_trend_h.push({
                        x: dateUTC,
                        y: Number(data[i][1])
                    });
                }
                if (i == 241) {
                    aa_1 = data[i][2]
                }

                avg_prices.push({
                    x: dateUTC,
                    y: Number(data[i][3])
                });
                volume.push({
                    x: dateUTC,
                    y: Number(business_amount),
                    color: columnColor
                });
            }

            //将剩下的时间信息补全
            appendTimeMessage(price_trend, volume, data, true);
            appendTimeMessage(avg_prices, volume, data, true);
            //常量本地化
            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });
            // console.log("科创板数组为：" + price_trend)
            var date;
            if (data.length > 0) {
                date = data[data.length - 1][0] + "";
                var dArr = new Array();
                for (var hh = 0; hh < 5; hh++) {
                    var numb;
                    if (hh == 0) {
                        numb = Number(date.slice(0, 4));
                    } else {
                        numb = Number(date.slice((hh - 1) * 2 + 4, hh * 2 + 4));
                    }

                    dArr.push(numb);
                }
            }
            var last_dataTime = new Date(dArr[0], dArr[1] - 1, dArr[2], dArr[3], dArr[4]);
            var $reporting = $("#report");
            $reporting.html("");
            // Create the chart
            var am_startTime = new Date(last_dataTime);
            am_startTime.setHours(1, 30, 0, 0);
            var am_startTimeUTC = convertDateToUTC(am_startTime);
            var am_midTime = new Date(last_dataTime);
            am_midTime.setHours(2, 30, 0, 0);
            var am_midTimeUTC = convertDateToUTC(am_midTime);

            //股票交易早上最后的时间
            var am_lastTime = new Date(last_dataTime);
            am_lastTime.setHours(3, 30, 0, 0);
            var am_lastTimeUTC = convertDateToUTC(am_lastTime);

            //股票交易下午最后的时间
            var pm_startTime = new Date(last_dataTime);
            pm_startTime.setHours(5, 1, 0, 0);
            var pm_startTimeUTC = convertDateToUTC(pm_startTime);

            var pm_midTime = new Date(last_dataTime);
            pm_midTime.setHours(6, 0, 0, 0);
            var pm_midTimeUTC = convertDateToUTC(pm_midTime);

            var pm_lastTime = new Date(last_dataTime);
            pm_lastTime.setHours(7, 0, 0, 0);
            var pm_lastTimeUTC = convertDateToUTC(pm_lastTime);

            var pm_lastTime_kcb = new Date(last_dataTime);
            pm_lastTime_kcb.setHours(7, 0, 0, 0);
            var pm_lastTime_kcb = convertDateToUTC(pm_lastTime_kcb);

            var pm_startTime_kcb = new Date(last_dataTime);
            pm_startTime_kcb.setHours(7, 5, 0, 0);
            var pm_startTime_kcb = convertDateToUTC(pm_startTime_kcb);

            var pm_lastTimeone = new Date(last_dataTime);
            pm_lastTimeone.setHours(7, 30, 0, 0)
            var pm_lastTimeoneUTC = convertDateToUTC(pm_lastTimeone);
            //----------------------------------------------------------
            // Create the chart
            obj.id.highcharts('StockChart', {
                chart: {
                    //关闭平移
                    panning: false,
                    zoomType: 'none',
                    pinchType: 'none',
                    renderTo: "line_map",
                    margin: [10, 1, 20, 50],
                    spacing: [0, 0, 0, 0],
                    plotBorderColor: '#3C94C4',
                    plotBorderWidth: 0, //边框
                    events: {
                        load: function() {
                            var chart = obj.id.highcharts(); // Highcharts构造函数
                            //基准线
                            chart.yAxis[0].addPlotLine({ //在x轴上增加
                                value: yesterdayClose, //在值为2的地方             //在x轴上增加
                                width: 2, //标示线的宽度为2px
                                color: '#CCC', //标示线的颜色
                                zIndex: 1,
                                id: 'plot-line-' //标示线的id，在删除该标示线的时候需要该id标示
                            });
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    valueDecinale: 2,
                    useHTML: true,
                    formatter: function() {
                        //var _name = this.points[1].series.name;
                        var _name = obj.codeName;
                        var _date = Highcharts.dateFormat('%b%e日,%A,%H:%M', this.x);
                        var _y = this.points[0].y.toFixed(2);
                        return '<p style="margin:0px;padding:0px;font-size:14px;"><span>' + _name + '   </span><span style="' + Comparative(_y, obj.prev_close) + ';">' + _y + '</span></p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>';
                        //var _yy = this.points[2].y;
                        //return '<p style="margin:0px;padding:0px;font-size:14px;">' + _name +  ' <span style="'+Comparative(_y,obj.prev_close)+';float:right;">'+_y+ '</span></p><p style="margin:0px;padding:0px;font-size:14px;">'+
                        //'成交量：' + ' <span style="float:right;">'+(_yy).toFixed(0)+ '</p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>'
                    }
                },
                plotOptions: {
                    series: {
                        /*关闭动画*/
                        animation: false
                    }
                },
                rangeSelector: {
                    enabled: false
                },
                /*导出配置*/
                exporting: {
                    enabled: false
                },
                /*创建者信息*/
                credits: {
                    enabled: false
                },
                /*下部时间拖拉选择*/
                navigator: {
                    enabled: false,
                    /*关闭时间选择*/
                    baseseries: 10
                },
                scrollbar: {
                    enabled: false /*关闭下方滚动条*/
                },
                /*底部滚动条*/
                scrollbar: {
                    enabled: false
                },
                xAxis: {
                    //type: 'datetime',
                    ordinal: false,
                    breaks: [{ // Nights
                        breakSize: 1,
                        from: am_lastTimeUTC,
                        to: pm_startTimeUTC
                    }, {
                        from: pm_lastTime_kcb,
                        to: pm_startTime_kcb,
                        breakSize: 1
                    }],
                    //minRange: 14 * 24 * 36000, // fourteen days
                    showFirstLabel: true,
                    showLastLabel: true,
                    scrollbar: {
                        enabled: true
                    },
                    labels: {
                        // staggerLines:5
                        style: { //字体样式
                            font: 'normal 12px'
                        },
                        formatter: function() {
                            //var returnTime=Highcharts.dateFormat('%H:%M', this.value-Number(8 * 3600 * 1000));
                            var returnTime = Highcharts.dateFormat('%H:%M', this.value);
                            if (returnTime == "09:30") {
                                return '<span style="margin-left:25px;color:#aaa">09:30</span>';
                            }
                            if (returnTime == "11:30") {
                                return '<span style="color:#aaa">11:30/13:00</span>';
                            }
                            if (returnTime == "10:30") {
                                return "";
                            }
                            if (returnTime == "14:00") {
                                return "";
                            }
                            if (returnTime == "15:00") {
                                return '';
                            }
                            if (returnTime == "15:30") {
                                return '<span style="margin-right:35px;color:#aaa"">15:30</span>';
                            }


                            return returnTime;
                        },
                        y: 15,
                        //x:10,
                        step: 1,
                        useHTML: true
                    },
                    tickLength: 5,
                    tickPositioner: function() {
                        var positions = [am_startTimeUTC, am_midTimeUTC, am_lastTimeUTC, pm_midTimeUTC, pm_lastTimeUTC, pm_lastTimeoneUTC];
                        //var positions = [am_startTimeUTC,  am_lastTimeUTC,pm_lastTimeUTC];
                        return positions;
                    },
                    gridLineDashStyle: 'ShortDash',
                    gridLineColor: '#f2f2f2',
                    gridLineWidth: 1
                },
                yAxis: [{
                        opposite: true, //是否把它显示到另一边（右边）
                        labels: {
                            enabled: false
                        },
                        title: {
                            text: ''
                        },
                        top: '0%',
                        height: '100%',
                        lineWidth: 0,
                        showFirstLabel: false,
                        showLastLabel: false,
                        gridLineWidth: 0,
                        x: 0,
                        y: 0,
                        tickPositioner: function() { //以yesterdayClose为界限，统一间隔值，从 最小到最大步进
                            positions = [
                                (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(2), (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(2),
                                obj.prev_close.toFixed(2), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(2), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(2)
                            ];
                            return positions;
                        }
                    }, //y1
                    {
                        opposite: false, //是否把它显示到另一边（右边）
                        showFirstLabel: true,
                        showLastLabel: true,
                        labels: {
                            enabled: true,
                            overflow: 'justify',
                            style: { //字体样式
                                font: 'normal 12px'
                            },
                            align: 'right',
                            x: -5,
                            y: 5,
                            formatter: function() { //最新价  px_last/preclose昨收盘-1
                                //return 100*(((this.value/yesterdayClose)-1).toFixed(4))+"%";
                                return '<span style="color:#aaa;">' + this.value + '</span>';
                            }
                        },
                        useHTML: true,
                        title: {
                            text: ''
                        },
                        lineWidth: 1,
                        top: '0%',
                        height: '100%',
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        tickPositioner: function() {
                            return positions;
                        }
                    }
                ],
                series: [{
                    name: obj.codeName,
                    data: price_trend,
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    name: obj.codeName,
                    data: price_trend,
                    type: 'area',
                    cursor: 'pointer',
                    onSeries: 'candlestick',
                    color: 'transparent',
                    style: {
                        fontSize: '0px',
                        fontWeight: '0',
                        textAlign: 'center'
                    },
                    zIndex: -1000,
                    yAxis: 1,
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    name: obj.codeName,
                    data: price_trend_h,
                    yAxis: 0,
                    color: '#f22',
                    marker: {
                        fillColor: '#f22',
                        lineWidth: 1,
                        symbol: 'circle',
                        lineColor: '#f1a8a8'
                    },
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    name: obj.codeName,
                    data: price_trend_h,
                    type: 'line',
                    cursor: 'pointer',
                    onSeries: 'candlestick',
                    color: '#f22',
                    style: {
                        fontSize: '0px',
                        fontWeight: '0',
                        textAlign: 'center'
                    },
                    marker: {
                        fillColor: '#f22',
                        lineWidth: 1,
                        symbol: 'circle',
                        lineColor: '#f1a8a8'
                    },
                    zIndex: -1000,
                    yAxis: 1,
                    fillColor: {
                        linearGradient: { //渐变方向
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    dataGrouping: {
                        units: groupingUnits
                    }
                }]
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //返回错误信息
            //console.log("Ajax返回错误信息:"+XMLHttpRequest.status+"~"+XMLHttpRequest.readyState+"~"+textStatus);
        }
    });
}

/******************************************************指数*****************************************************/
function delay_snapAjax_zs(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/snap/" + obj.code,
        jsonp: "callback",
        data: {
            select: 'name,last,chg_rate,change,open,prev_close,high,low,tradephase'
        },
        cache: false,
        success: function(resultData) {
            var _code = resultData.code;
            var pad01Arr = [];
            var _snap_val = resultData.snap;

            var color;

            var _name = _snap_val[0]; //名称
            var _xj = _snap_val[1]; //现价
            var _zs = _snap_val[5]; //昨收
            var _zd = _snap_val[3]; //涨跌
            var _zdf = _snap_val[2].toFixed(2) + ''; //涨跌幅,有问题，应该在涨跌判断以后再取两位小数
            var _high = _snap_val[6]; //最高价
            var _low = _snap_val[7]; //最低价
            var _open = _snap_val[4]; //开盘价
            var _tradephase = _snap_val[8];

            var classes;

            function zhangdie(y) {
                if (y > _snap_val[5]) {
                    classes = "col_red";
                } else if (y < _snap_val[5]) {
                    classes = "col_green";
                } else {
                    classes = "col_color";
                }
                return ("<span class=" + classes + ">" + y + "</span>")
            }

            if (_zs != _xj) {
                if (_zd > 0) {
                    _zd = "+" + _zd;
                    classes = "col_red";
                } else {
                    //_zdf = "-"+_zdf;
                    classes = "col_green";
                }
            } else {
                classs = "col_color";
            }
            // pad01Arr.push("<table><tr><td>" +_code +"</td><td>"+ _name + "</td></tr><tr><td rowspan='2'>" + zhangdie(_xj) + "</td><td class='" + classes + "'>" + _zd + "</td></tr><tr><td class='"
            //     + classes + "'>" + _zdf + "%</td></tr></table>");
            pad01Arr.push("<table><tr class='tr_a'><td class='td_a'>" + _code + "</td><td class='td_b'>" + _name + "</td></tr><tr class='tr_b'><td class='td_a' rowspan='2'>" + zhangdie(_xj) + "</td><td class='td_b " + classes + "'>" + _zd + "</td></tr><tr class='tr_c'><td class='" + classes + "'>" + _zdf + "%</td></tr></table>");
            obj.detId.html(pad01Arr.join(""));
            if (resultData.snap.length < 1) {
                obj.id.html('<center style="margin-top:80px;"><span class="nal" style="color: #ccc;font-size: 20px;">暂无走势信息</span></center>');
            }

            if (_tradephase.replace(/\s/ig, '') == "P1") {
                obj.id.html('<center style="margin-top:80px;"><span class="nal" style="color: #ccc;font-size: 20px;">停牌中</span></center>');
            } else if (_tradephase.replace(/\s/ig, '') == "C1") {
                obj.id.html('<center style="margin-top:80px;"><span class="nal" style="color: #ccc;font-size: 20px;">集合竞价中</span></center>');
            } else {
                if (checkBrowser()) {
                    delay_ajax_zs({
                        id: obj.id,
                        code: _code,
                        last: _xj,
                        codeName: _name,
                        open: _open,
                        high: _high,
                        low: _low,
                        prev_close: _zs
                    });
                }

            }
        }
    })
}

function delay_ajax_zs(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/line/" + obj.code,
        data: {
            begin: 0,
            end: -1,
            select: 'time,price,volume'
        },
        jsonp: "callback",
        cache: false,
        success: function(resultData) {
            var dd = resultData;
            var d = dateConvert({
                data: dd,
                last: obj.last,
                open: obj.open
            });
            //var data = null;
            var data = d.line;
            //没数据时不显示图表
            if (data.length == 0) {
                obj.id.html("<div class='chart_container'></div>");
                return;
            }
            $(".delayAjax_hq .right").remove(".sse_table_title2").append('<div class="sse_table_title2"><p>' + turnDateAddLine(resultData.date + "") + '</p></div>');
            Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                lang: {
                    loading: "加载中",
                    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    noData: "没有数据",
                    numericSymbols: ["千", "兆", "G", "T", "P", "E"],
                    printChart: "打印图表",
                    resetZoom: "恢复缩放",
                    resetZoomTitle: "恢复图表",
                    shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    thousandsSep: ",",
                    weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
                }
            });
            //初始化开------------------------
            var groupingUnits = [
                [
                    'minute', // unit name
                    [1] // allowed multiples
                ]
            ];
            var avg_pxyAxisMin; //Y轴最小值
            var avg_pxyAxisMax; //Y轴最大值 
            var percentageyAxisMin; //Y轴百分比最小
            var percentageyAxisMax; //Y轴百分比最大
            var volume_yAxisMin; //成交量最小
            var volume_yAxisMax; //成交量最大
            var red = "#ff0000";
            var blue = "#00a800";
            var price_trend = [],
                volume = [], //成交量
                i = 0;
            //图表上的成交量第一条的数据红绿的判断 是根据昨日的收盘价preclose_px 和今日的最新价last_px进行对比
            //同时获取的昨日收盘价  用于涨幅的计算
            var isFirstLineColorflag = true;
            //保存昨收数据
            var yesterdayClose;
            //容错判断
            if (data != undefined && data != null && data.length == 0) {
                try {
                    failCallback();
                } catch (e) {

                }
                return;
            }
            //今开
            var open_px = data[i][1];
            //昨收
            //var preclose_px=data[i][3];
            var preclose_px = d.prev_close;
            yesterdayClose = preclose_px;
            isFirstLineColorflag = open_px > preclose_px ? true : false;
            // split the data set into price_trend and volume
            //数据处理
            for (i; i < data.length; i += 1) {
                var _dates = data[i][0] + "";
                var _hours = _dates.substring(8, 10);
                var dateUTC = getDateUTCOrNot(_dates, true);
                var business_amount = data[i][2];
                var columnColor = red;
                if (i == 0) { //第一笔的 红绿柱 判断依据是根据 今天开盘价与昨日收盘价比较
                    if (isFirstLineColorflag == false) {
                        columnColor = blue;
                    }
                    avg_pxyAxisMin = data[i][1];
                    avg_pxyAxisMax = data[i][1];
                    percentageyAxisMin = Number(100 * (data[i][1] / yesterdayClose - 1));
                    percentageyAxisMax = Number(100 * (data[i][1] / yesterdayClose - 1));
                    volume_yAxisMin = data[i][2];
                    volume_yAxisMax = data[i][2];
                } else {
                    //除了第一笔，其它都是  返回的 last_px 与前一个对比
                    if (data[i - 1][1] - data[i][1] > 0) {
                        columnColor = blue;
                    }
                }
                avg_pxyAxisMin = avg_pxyAxisMin > data[i][1] ? data[i][1] : avg_pxyAxisMin;
                avg_pxyAxisMax = avg_pxyAxisMax > data[i][1] ? avg_pxyAxisMax : data[i][1];
                percentageyAxisMin = percentageyAxisMin > Number(100 * (data[i][1] / yesterdayClose - 1)) ? Number(100 * (data[i][1] / yesterdayClose - 1)) : percentageyAxisMin;
                percentageyAxisMax = percentageyAxisMax > Number(100 * (data[i][1] / yesterdayClose - 1)) ? percentageyAxisMax : Number(100 * (data[i][1] / yesterdayClose - 1));
                volume_yAxisMin = volume_yAxisMin > business_amount ? business_amount : volume_yAxisMin;
                volume_yAxisMax = volume_yAxisMax > business_amount ? volume_yAxisMax : business_amount;
                //将数据放入 price_trend volume 数组中

                price_trend.push({
                    x: dateUTC,
                    y: Number(data[i][1])
                });
                volume.push({
                    x: dateUTC,
                    y: Number(business_amount),
                    color: columnColor
                });
            }

            //将剩下的时间信息补全
            appendTimeMessage(price_trend, volume, data);
            //常量本地化
            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });

            var date;
            if (data.length > 0) {
                date = data[data.length - 1][0] + "";
                var dArr = new Array();
                for (var hh = 0; hh < 5; hh++) {
                    var numb;
                    if (hh == 0) {
                        numb = Number(date.slice(0, 4));
                    } else {
                        numb = Number(date.slice((hh - 1) * 2 + 4, hh * 2 + 4));
                    }

                    dArr.push(numb);
                }
            }
            var last_dataTime = new Date(dArr[0], dArr[1] - 1, dArr[2], dArr[3], dArr[4]);
            var $reporting = $("#report");
            $reporting.html("");
            // Create the chart
            var am_startTime = new Date(last_dataTime);
            am_startTime.setHours(1, 30, 0, 0);
            var am_startTimeUTC = convertDateToUTC(am_startTime);
            var am_midTime = new Date(last_dataTime);
            am_midTime.setHours(2, 30, 0, 0);
            var am_midTimeUTC = convertDateToUTC(am_midTime);

            //股票交易早上最后的时间
            var am_lastTime = new Date(last_dataTime);
            am_lastTime.setHours(3, 30, 0, 0);
            var am_lastTimeUTC = convertDateToUTC(am_lastTime);

            //股票交易下午最后的时间
            var pm_startTime = new Date(last_dataTime);
            pm_startTime.setHours(5, 1, 0, 0);
            var pm_startTimeUTC = convertDateToUTC(pm_startTime);

            var pm_midTime = new Date(last_dataTime);
            pm_midTime.setHours(6, 0, 0, 0);
            var pm_midTimeUTC = convertDateToUTC(pm_midTime);

            var pm_lastTime = new Date(last_dataTime);
            pm_lastTime.setHours(7, 0, 0, 0);
            var pm_lastTimeUTC = convertDateToUTC(pm_lastTime);
            //----------------------------------------------------------
            // Create the chart
            obj.id.highcharts('StockChart', {
                chart: {
                    //关闭平移
                    panning: false,
                    zoomType: 'none',
                    pinchType: 'none',
                    renderTo: "line_map",
                    margin: [10, 1, 20, 55],
                    spacing: [0, 0, 0, 0],
                    plotBorderColor: '#3C94C4',
                    plotBorderWidth: 0, //边框
                    events: {
                        load: function() {
                            var chart = obj.id.highcharts(); // Highcharts构造函数
                            //基准线
                            chart.yAxis[0].addPlotLine({ //在x轴上增加
                                value: yesterdayClose, //在值为2的地方             //在x轴上增加
                                width: 2, //标示线的宽度为2px
                                color: '#CCC', //标示线的颜色
                                zIndex: 1,
                                id: 'plot-line-' //标示线的id，在删除该标示线的时候需要该id标示
                            });
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    valueDecinale: 2,
                    useHTML: true,
                    formatter: function() {
                        //var _name = this.points[1].series.name;
                        var _name = obj.codeName;
                        var _date = Highcharts.dateFormat('%b%e日,%A,%H:%M', this.x);
                        var _y = this.points[0].y.toFixed(2);
                        return '<p style="margin:0px;padding:0px;font-size:14px;"><span>' + _name + '   </span><span style="' + Comparative(_y, obj.prev_close) + ';">' + _y + '</span></p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>';
                        //var _yy = this.points[2].y;
                        //return '<p style="margin:0px;padding:0px;font-size:14px;">' + _name +  ' <span style="'+Comparative(_y,obj.prev_close)+';float:right;">'+_y+ '</span></p><p style="margin:0px;padding:0px;font-size:14px;">'+
                        //'成交量：' + ' <span style="float:right;">'+(_yy).toFixed(0)+ '</p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>'
                    }
                },
                plotOptions: {
                    series: {
                        /*关闭动画*/
                        animation: false
                    }
                },
                rangeSelector: {
                    enabled: false
                },
                /*导出配置*/
                exporting: {
                    enabled: false
                },
                /*创建者信息*/
                credits: {
                    enabled: false
                },
                /*下部时间拖拉选择*/
                navigator: {
                    enabled: false,
                    /*关闭时间选择*/
                    baseseries: 10
                },
                scrollbar: {
                    enabled: false /*关闭下方滚动条*/
                },
                /*底部滚动条*/
                scrollbar: {
                    enabled: false
                },
                xAxis: {
                    //type: 'datetime',
                    ordinal: false,
                    breaks: [{ // Nights
                        breakSize: 1,
                        from: am_lastTimeUTC,
                        to: pm_startTimeUTC
                    }],
                    //minRange: 14 * 24 * 36000, // fourteen days
                    showFirstLabel: true,
                    showLastLabel: true,
                    scrollbar: {
                        enabled: true
                    },
                    labels: {
                        // staggerLines:5
                        style: { //字体样式
                            font: 'normal 12px'
                        },
                        formatter: function() {
                            //var returnTime=Highcharts.dateFormat('%H:%M', this.value-Number(8 * 3600 * 1000));
                            var returnTime = Highcharts.dateFormat('%H:%M', this.value);
                            if (returnTime == "09:30") {
                                return '<span style="margin-left:33px;color:#aaa">09:30</span>';
                            }
                            if (returnTime == "11:30") {
                                return '<span style="color:#aaa">11:30/13:00</span>';
                            }
                            if (returnTime == "10:30") {
                                return "";
                            }
                            if (returnTime == "14:00") {
                                return "";
                            }
                            if (returnTime == "15:00") {
                                return '<span style="margin-right:35px;color:#aaa">15:00</span>';
                            }
                            return returnTime;
                        },
                        y: 15,
                        //x:10,
                        step: 1,
                        useHTML: true
                    },
                    tickLength: 5,
                    tickPositioner: function() {
                        var positions = [am_startTimeUTC, am_midTimeUTC, am_lastTimeUTC, pm_midTimeUTC, pm_lastTimeUTC];
                        //var positions = [am_startTimeUTC,  am_lastTimeUTC,pm_lastTimeUTC];
                        return positions;
                    },
                    gridLineDashStyle: 'ShortDash',
                    gridLineColor: '#f2f2f2',
                    gridLineWidth: 1
                },
                yAxis: [{
                        opposite: true, //是否把它显示到另一边（右边）
                        labels: {
                            enabled: false
                        },
                        title: {
                            text: ''
                        },
                        top: '0%',
                        height: '100%',
                        lineWidth: 0,
                        showFirstLabel: false,
                        showLastLabel: false,
                        gridLineWidth: 0,
                        x: 0,
                        y: 0,
                        tickPositioner: function() { //以yesterdayClose为界限，统一间隔值，从 最小到最大步进
                            positions = [
                                (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(2), (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(2),
                                obj.prev_close.toFixed(2), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(2), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(2)
                            ];
                            return positions;
                        }
                    }, //y1
                    {
                        opposite: false, //是否把它显示到另一边（右边）
                        showFirstLabel: true,
                        showLastLabel: true,
                        labels: {
                            enabled: true,
                            overflow: 'justify',
                            style: { //字体样式
                                font: 'normal 12px'
                            },
                            align: 'right',
                            x: -5,
                            y: 5,
                            formatter: function() { //最新价  px_last/preclose昨收盘-1
                                //return 100*(((this.value/yesterdayClose)-1).toFixed(4))+"%";
                                return '<span style="color:#aaa;">' + this.value + '</span>';
                            }
                        },
                        useHTML: true,
                        title: {
                            text: ''
                        },
                        lineWidth: 1,
                        top: '0%',
                        height: '100%',
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        tickPositioner: function() {
                            return positions;
                        }
                    }
                ],
                series: [{
                    name: obj.codeName,
                    data: price_trend,
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    name: obj.codeName,
                    data: price_trend,
                    type: 'area',
                    cursor: 'pointer',
                    onSeries: 'candlestick',
                    color: 'transparent',
                    style: {
                        fontSize: '0px',
                        fontWeight: '0',
                        textAlign: 'center'
                    },
                    zIndex: -1000,
                    yAxis: 1,
                    dataGrouping: {
                        units: groupingUnits
                    }
                }]
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //返回错误信息
            //console.log("Ajax返回错误信息:"+XMLHttpRequest.status+"~"+XMLHttpRequest.readyState+"~"+textStatus);
        }
    });
}
/***********************************************************************************************************/
/***********************************************************************************************************/
/******************************首页-数据-行情信息-行情走势 -10-29***********************************/
/***********************************************************************************************************/
/***********************************************************************************************************/
function marketLineIni() {
    var _ist = true;

    marketLineIniMethod(_ist);

    $(".search_market_L #marketLine").click(function() {
        _ist = true;
        marketLineIniMethod(_ist);
    });
    $(".search_market_L #marketKline").click(function() {
        _ist = false;
        marketLineIniMethod(_ist);
    });
    $(".search_market_L #inputCode").keydown(function(e) {
        if (e.which == 13) { // enter 键
            _ist = true;
            marketLineIniMethod(_ist);
        }
    });

    if (!checkBrowser()) {
        //$('#market_ticker').css({"border":"1px dotted #ccc"});
        $('#market_ticker').html("<center style='margin-top:35%'><span class='nal' style='color: #ccc;'>当前浏览器不支持HTML5行情<br/>请使用IE9及以上版本浏览器</span></center>");
    }


    $(document).keydown(function(e) {
        if (e.which == 13) { // enter 键
            _ist = true;
            marketLineIniMethod(_ist);
        }
    });
    window.setInterval(function() {
        marketLineIniMethod(_ist);
    }, 30000);
}

function marketLineIniMethod(_ist) {
    var code = $(".search_market_L #inputCode").val();
    fnCodetype(code, function(_codType) {
        if (_codType) {
            switch (_codType) {
                case "astock": //A股
                    $(".search_market_L_hq").removeClass("isKcb isJj");
                    market_snapAjax($(".search_market_L #inputCode").val(), _ist);
                    break;
                case "bstock": //B股
                    $(".search_market_L_hq").removeClass("isKcb isGdr isJj");
                    market_snapAjax_qq($(".search_market_L #inputCode").val(), _ist);
                    break;
                case "kcbstock": //科创板
                    $(".search_market_L_hq").addClass("isKcb");
                    $(".search_market_L_hq").removeClass("isGdr isJj");
                    market_snapAjax_kcb($(".search_market_L #inputCode").val(), _ist);
                    break;
                case "fund": //基金
                    $(".search_market_L_hq").addClass("isJj");
                    $(".search_market_L_hq").removeClass("isKcb isGdr");
                    market_snapAjax_jj($(".search_market_L #inputCode").val(), _ist);
                    break;
                case "bond": //债券
                    $(".search_market_L_hq").removeClass("isKcb isGdr isJj");
                    market_snapAjax_zq($(".search_market_L #inputCode").val(), _ist);
                    break;
                case "index": //指数
                    $(".search_market_L_hq").removeClass("isKcb isGdr isJj");
                    market_snapAjax_zs($(".search_market_L #inputCode").val(), _ist);
                    break;
                case "huigou": //回购
                    $(".search_market_L_hq").removeClass("isKcb isGdr isJj");
                    market_snapAjax_hg($(".search_market_L #inputCode").val(), _ist);
                    break;
            }
        }
    })



}

function market_snapAjax_yuyue(_codeS, _ins) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/snap/" + _codeS,
        jsonp: "callback",
        data: {
            select: 'name,last,chg_rate,change,amount,volume,open,prev_close,ask,bid,high,low,tradephase'
        },
        cache: false,
        success: function(resultData) {
            var _code = resultData.code;
            var pad01Arr = [];
            var pad02Arr = [];
            var pad03Arr = [];
            var _snap_val = resultData.snap;
            var _date = resultData.date + "";
            var _dDate = _date.substring(0, _date.length - 4) + "-" + _date.substring(_date.length - 4, _date.length - 2) + "-" + _date.substring(_date.length - 2);
            var _timer = resultData.time + "";
            var _dTime = _timer.substring(0, _timer.length - 4) + ":" + _timer.substring(_timer.length - 4, _timer.length - 2);
            var color;

            var _name = _snap_val[0]; //名称
            var _xj = _snap_val[1]; //现价
            var _zs = _snap_val[7]; //昨收
            var _zd = _snap_val[3].toFixed(3); //涨跌
            var _zdf = _snap_val[2].toFixed(3) + ''; //涨跌幅,有问题，应该在涨跌判断以后再取两位小数
            var _cje = _snap_val[4]; //成交额
            var _cjl = _snap_val[5]; //成交量
            var _mm5 = _snap_val[8]; //卖盘五档
            var _m5 = _snap_val[9]; //买盘五档
            var _high = _snap_val[10]; //最高价
            var _low = _snap_val[11]; //最低价
            var _open = _snap_val[6]; //开盘价
            var _tradephase = _snap_val[12];
            _cje = _cje / 10000;

            var classes;

            function zhangdie(y) {
                if (y > _snap_val[7]) {
                    classes = "col_red";
                } else if (y < _snap_val[7]) {
                    classes = "col_green";
                } else {
                    classes = "col_color";
                }
                return ("<span class='first_span " + classes + "''>" + y + "</span>")
            }

            if (_zs != _xj) {
                if (_zd > 0) {
                    _zd = "+" + _zd;
                    classes = "col_red";
                } else {
                    //_zdf = "-"+_zdf;
                    classes = "col_green";
                }
            } else {
                classs = "col_color";
            }
            pad01Arr.push("<table cellspacing='0' cellpadding='0'><tr class='first_tr'><td class='first_td'><h1>" + _code + "</h1></td><td class='last_td'><h1>" + _name +
                "</h1></td></tr><tr><td class='first_td' rowspan=2><h2>" + zhangdie(_xj.toFixed(3)) + "</h2></td><td class='last_td'><h3 class='" + classes + "'>" + _zd +
                "</h3></td></tr><tr><td class='last_td'><h3 class='" + classes + "'>" + _zdf + "%</h3></td></tr></table>");
            pad02Arr.push(
                "<ul class='mm5'><li>卖五" + zhangdie(_mm5[8].toFixed(3)) + "<span class='last_span'>" + Math.round(_mm5[9] / 100) +
                "</span></li><li>卖四" + zhangdie(_mm5[6].toFixed(3)) + "<span class='last_span'>" + Math.round(_mm5[7] / 100) +
                "</span></li><li>卖三" + zhangdie(_mm5[4].toFixed(3)) + "<span class='last_span'>" + Math.round(_mm5[5] / 100) +
                "</span></li><li>卖二" + zhangdie(_mm5[2].toFixed(3)) + "<span class='last_span'>" + Math.round(_mm5[3] / 100) +
                "</span></li><li class='last_li'>卖一" + zhangdie(_mm5[0].toFixed(3)) + "<span class='last_span'>" + Math.round(_mm5[1] / 100) + "</span></li></ul>" +
                "<ul class='m5'><li class='first_li'>买一" + zhangdie(_m5[0].toFixed(3)) + "<span class='last_span'>" + Math.round(_m5[1] / 100) +
                "</span></li><li>买二" + zhangdie(_m5[2].toFixed(3)) + "<span class='last_span'>" + Math.round(_m5[3] / 100) +
                "</span></li><li>买三" + zhangdie(_m5[4].toFixed(3)) + "<span class='last_span'>" + Math.round(_m5[5] / 100) +
                "</span></li><li>买四" + zhangdie(_m5[6].toFixed(3)) + "<span class='last_span'>" + Math.round(_m5[7] / 100) +
                "</span></li><li>买五" + zhangdie(_m5[8].toFixed(3)) + "<span class='last_span'>" + Math.round(_m5[9] / 100) + "</span></li></ul>"
            );
            pad03Arr.push(
                "<table><tr><td class='td_a'>昨收</td><td class='td_b' style='color:#999;'>" + _zs.toFixed(3) + "</td><td class='td_c'>最高</td><td class='td_d'>" + zhangdie(_high.toFixed(3)) +
                "</td></tr><tr><td class='td_a'>开盘</td><td class='td_b'>" + zhangdie(_open.toFixed(3)) + "</td><td class='td_c'>最低</td><td class='td_d'>" + zhangdie(_low.toFixed(3)) +
                "</td></tr><tr><td class='td_a' colspan='2'>成交量</td><td class='td_b' colspan='2' style='color:#999;'>" + (_cjl / 100).toFixed(0) +
                " 手</td></tr><tr><td class='td_a'>时间</td><td class='td_b' colspan='3' style='color:#999;'>" + _dDate + " " + _dTime + "</td></tr>" +
                "</table>"
            );
            $("#pad01").html(pad01Arr.join(""));
            $("#pad02").html(pad02Arr.join(""));
            $("#pad03").html(pad03Arr.join(""));

            if (_ins) {
                if (resultData.snap.length < 1) {
                    $('#market_ticker').html('<center style="margin-top:45%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 40px;">暂无走势信息</span></center>');
                }

                if (_tradephase.replace(/\s/ig, '') == "P1") {
                    $('#market_ticker').html('<center style="margin-top:45%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 40px;">停牌中</span></center>');
                } else if (_tradephase.replace(/\s/ig, '') == "C1") {
                    $('#market_ticker').html('<center style="margin-top:45%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 40px;">集合竞价中</span></center>');
                } else {
                    if (checkBrowser()) {
                        $('#market_ticker').html("")
                        // market_ajax_qq({
                        //     id: $('#market_ticker'),
                        //     code: _code,
                        //     last: _xj,
                        //     codeName: _name,
                        //     open: _open,
                        //     high: _high,
                        //     low: _low,
                        //     prev_close: _zs
                        // });
                    }
                }
            } else {
                if (checkBrowser()) {
                    $('#market_ticker').html("")
                }
            }
        }
    })
}

/*
-----------------------------------------------------------首页-数据-行情信息-行情走势－股票------------------------------------------------------
*/
function market_snapAjax(_codeS, _ins) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/snap/" + _codeS,
        jsonp: "callback",
        data: {
            select: 'name,last,chg_rate,change,amount,volume,open,prev_close,ask,bid,high,low,tradephase,hlt_tag,gdr_ratio,gdr_prevpx,gdr_currency'
        },
        cache: false,
        success: function(resultData) {
            var _code = resultData.code;
            var pad01Arr = [];
            var pad02Arr = [];
            var pad03Arr = [];
            var _snap_val = resultData.snap;
            var _date = resultData.date + "";
            var _dDate = _date.substring(0, _date.length - 4) + "-" + _date.substring(_date.length - 4, _date.length - 2) + "-" + _date.substring(_date.length - 2);
            var _timer = resultData.time + "";
            var _dTime = _timer.substring(0, _timer.length - 4) + ":" + _timer.substring(_timer.length - 4, _timer.length - 2);
            var color;

            var _name = _snap_val[0]; //名称
            var _xj = _snap_val[1]; //现价
            var _zs = _snap_val[7]; //昨收
            var _zd = _snap_val[3]; //涨跌
            var _zdf = _snap_val[2].toFixed(2) + ''; //涨跌幅,有问题，应该在涨跌判断以后再取两位小数
            var _cje = _snap_val[4]; //成交额
            var _cjl = _snap_val[5]; //成交量
            var _mm5 = _snap_val[8]; //卖盘五档
            var _m5 = _snap_val[9]; //买盘五档
            var _high = _snap_val[10]; //最高价
            var _low = _snap_val[11]; //最低价
            var _open = _snap_val[6]; //开盘价
            var _tradephase = _snap_val[12];
            _cje = _cje / 10000;
            var _hlt_tag = _snap_val[13]; //沪伦通子类别标识
            var _gdr_ratio = _snap_val[14]; //GDR转换比例
            var _gdr_prevpx = _snap_val[15]; //GDR昨日收盘价
            var _gdr_currency = _snap_val[16]; //GDR币种
            var showGdr = '',
                showGdrratio = '',
                showGdrprevpx = '';
            if (_hlt_tag == 'G') {
                $(".search_market_L_hq").addClass("isGdr");
                showGdr += "<a href='javascript:void(0);' class='icon_g' title=''></a>";
                if (_gdr_ratio != null && _gdr_ratio != "") {
                    showGdrratio += "<tr><td class='td_a' colspan='2'>GDR转换比例</td><td class='td_b' colspan='2' style='color:#999;'>" + _gdr_ratio + "</td></tr>";
                }
                showGdrprevpx += "<tr><td class='td_a' colspan='2'>GDR昨日收盘价</td><td class='td_b' colspan='2' style='color:#999;'>" + _gdr_prevpx + _gdr_currency + "</td></tr>";

            } else {
                $(".search_market_L_hq").removeClass("isGdr");
            }
            var classes;

            function zhangdie(y) {
                if (y > _snap_val[7]) {
                    classes = "col_red";
                } else if (y < _snap_val[7]) {
                    classes = "col_green";
                } else {
                    classes = "col_color";
                }
                return ("<span class='first_span " + classes + "''>" + y + "</span>")
            }

            if (_zs != _xj) {
                if (_zd > 0) {
                    _zd = "+" + _zd;
                    classes = "col_red";
                } else {
                    //_zdf = "-"+_zdf;
                    classes = "col_green";
                }
            } else {
                classs = "col_color";
            }
            pad01Arr.push("<table cellspacing='0' cellpadding='0'><tr class='first_tr'><td class='first_td'><h1>" + _code + "</h1></td><td class='last_td'><h1>" + _name + showGdr +
                "</h1></td></tr><tr><td class='first_td' rowspan=2><h2>" + zhangdie(_xj.toFixed(2)) + "</h2></td><td class='last_td'><h3 class='" + classes + "'>" + _zd +
                "</h3></td></tr><tr><td class='last_td'><h3 class='" + classes + "'>" + _zdf + "%</h3></td></tr></table>");
            pad02Arr.push(
                "<ul class='mm5'><li>卖五" + zhangdie(_mm5[8].toFixed(2)) + "<span class='last_span'>" + Math.round(_mm5[9] / 100) +
                "</span></li><li>卖四" + zhangdie(_mm5[6].toFixed(2)) + "<span class='last_span'>" + Math.round(_mm5[7] / 100) +
                "</span></li><li>卖三" + zhangdie(_mm5[4].toFixed(2)) + "<span class='last_span'>" + Math.round(_mm5[5] / 100) +
                "</span></li><li>卖二" + zhangdie(_mm5[2].toFixed(2)) + "<span class='last_span'>" + Math.round(_mm5[3] / 100) +
                "</span></li><li class='last_li'>卖一" + zhangdie(_mm5[0].toFixed(2)) + "<span class='last_span'>" + Math.round(_mm5[1] / 100) + "</span></li></ul>" +
                "<ul class='m5'><li class='first_li'>买一" + zhangdie(_m5[0].toFixed(2)) + "<span class='last_span'>" + Math.round(_m5[1] / 100) +
                "</span></li><li>买二" + zhangdie(_m5[2].toFixed(2)) + "<span class='last_span'>" + Math.round(_m5[3] / 100) +
                "</span></li><li>买三" + zhangdie(_m5[4].toFixed(2)) + "<span class='last_span'>" + Math.round(_m5[5] / 100) +
                "</span></li><li>买四" + zhangdie(_m5[6].toFixed(2)) + "<span class='last_span'>" + Math.round(_m5[7] / 100) +
                "</span></li><li>买五" + zhangdie(_m5[8].toFixed(2)) + "<span class='last_span'>" + Math.round(_m5[9] / 100) + "</span></li></ul>"
            );
            pad03Arr.push(
                "<table><tr><td class='td_a'>昨收</td><td class='td_b' style='color:#999;'>" + _zs.toFixed(2) + "</td><td class='td_c'>最高</td><td class='td_d'>" + zhangdie(_high.toFixed(2)) +
                "</td></tr><tr><td class='td_a'>开盘</td><td class='td_b'>" + zhangdie(_open.toFixed(2)) + "</td><td class='td_c'>最低</td><td class='td_d'>" + zhangdie(_low.toFixed(2)) +
                "</td></tr><tr><td class='td_a' colspan='2'>成交量</td><td class='td_b' colspan='2' style='color:#999;'>" + (_cjl / 100).toFixed(0) +
                " 手</td></tr><tr><td class='td_a' colspan='2'>成交额</td><td class='td_b' colspan='2' style='color:#999;'>" + _cje.toFixed(0) + " 万元</td></tr>" +
                "<tr><td class='td_a'>时间</td><td class='td_b' colspan='3' style='color:#999;'>" + _dDate + " " + _dTime + "</td></tr>" +
                "<tr><td class='td_a' colspan='2'>交易状态</td><td class='td_b' colspan='2' style='color:#999;'>" + checkStatus(_tradephase) + "</td></tr>" +
                showGdrprevpx + showGdrratio + "</table>"
            );
            $("#pad01").html(pad01Arr.join(""));
            $("#pad02").html(pad02Arr.join(""));
            $("#pad03").html(pad03Arr.join(""));

            if (_ins) {
                if (resultData.snap.length < 1) {
                    $('#market_ticker').html('<center style="margin-top:45%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 40px;">暂无走势信息</span></center>');
                }

                if (_tradephase.replace(/\s/ig, '') == "P1") {
                    $('#market_ticker').html('<center style="margin-top:45%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 40px;">停牌中</span></center>');
                } else if (_tradephase.replace(/\s/ig, '') == "C1") {
                    $('#market_ticker').html('<center style="margin-top:45%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 40px;">集合竞价中</span></center>');
                } else {
                    if (checkBrowser()) {
                        market_ajax({
                            id: $('#market_ticker'),
                            code: _code,
                            last: _xj,
                            codeName: _name,
                            open: _open,
                            high: _high,
                            low: _low,
                            prev_close: _zs
                        });
                    }

                }
            } else {
                if (checkBrowser()) {
                    kLinedaykAjax(_code);
                }
            }
        }
    })
}

function market_snapAjax_kcb(_codeS, _ins) {
    //Ajax获取根据参数获取结果集
    // $(".search_market_L_hq #pad01").css("height", "130px");
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/snap/" + _codeS,
        jsonp: "callback",
        data: {
            select: 'name,last,chg_rate,change,amount,volume,open,prev_close,ask,bid,high,low,tradephase,up_limit,down_limit,fp_volume,fp_amount,cpxxprodusta,cpxxlmttype,fp_phase'
        },
        cache: false,
        success: function(resultData) {
            var _code = resultData.code;
            var pad01Arr = [];
            var pad02Arr = [];
            var pad03Arr = [];
            var _snap_val = resultData.snap;
            var _date = resultData.date + "";
            var _dDate = _date.substring(0, _date.length - 4) + "-" + _date.substring(_date.length - 4, _date.length - 2) + "-" + _date.substring(_date.length - 2);
            var _timer = resultData.time + "";
            var _dTime = _timer.substring(0, _timer.length - 4) + ":" + _timer.substring(_timer.length - 4, _timer.length - 2);
            var color;
            var _name = _snap_val[0]; //名称
            var _xj = _snap_val[1]; //现价
            var _zs = _snap_val[7]; //昨收
            var _zd = _snap_val[3]; //涨跌
            var _zdf = _snap_val[2].toFixed(2) + ''; //涨跌幅,有问题，应该在涨跌判断以后再取两位小数
            var _cje = _snap_val[4]; //成交额
            var _cjl = _snap_val[5]; //成交量
            var _mm5 = _snap_val[8]; //卖盘五档
            var _m5 = _snap_val[9]; //买盘五档
            var _high = _snap_val[10]; //最高价
            var _low = _snap_val[11]; //最低价
            var _open = _snap_val[6]; //开盘价
            var _ztjg = _snap_val[13]; //涨停价格
            var _dtjg = _snap_val[14]; //跌停价格
            var _phcjl = _snap_val[15]; //盘后交易量
            var _phcje = _snap_val[16]; //盘后交易额
            var _isShowjg = _snap_val[18]; //是否显示涨停、跌停价格
            if (_isShowjg == 'P') {
                _ztjg = '-';
                _dtjg = '-';
            } else {
                _ztjg = _ztjg.toFixed(2);
                _dtjg = _dtjg.toFixed(2);
            }

            var _tradephase = _snap_val[12];
            var _phjyjd = _snap_val[19]; //盘后交易阶段
            var _phjyjd_arr = _phjyjd.split('');
            var phjyjd;

            if (_phjyjd_arr[0] == 'I') {
                phjyjd = '开市前';
            }
            if (_phjyjd_arr[0] == 'A') {
                phjyjd = '集中撮合';
            }
            if (_phjyjd_arr[0] == 'H') {
                phjyjd = '连续交易';
            }
            if (_phjyjd_arr[0] == 'D') {
                phjyjd = '闭市';
            }
            if (_phjyjd_arr[0] == 'F') {
                phjyjd = '停牌';
            }
            _cje = _cje / 10000;
            _phcje = _phcje / 10000;
            var _cpztxx = _snap_val[17]; //产品状态信息
            var _cpztxx_arr = _cpztxx.split('');
            // var url_kcbU = "/images/icon_kcbU.png";
            // var url_kcbW = "/images/icon_kcbW.png";
            // var url_kcb = "/images/icon_kcb.png";
            var showU = "";
            var showW = "";
            var showC = "";

            var showK = "<a href='javascript:void(0);' class='icon_kcb_k' title=''></a>";
            if (_cpztxx_arr[4] == "Y") {
                showC = "<a href='javascript:void(0);' class='icon_kcb_c' title=''></a>";
            }
            if (_cpztxx_arr[7] == "U") {
                showU += "<a href='javascript:void(0);' class='icon_kcb_u' title=''></a>";
            }
            if (_cpztxx_arr[8] == "W") {
                showW += "<a href='javascript:void(0);' class='icon_kcb_w' title=''></a>";
            }
            var classes;

            function zhangdie(y) {
                if (y > _snap_val[7]) {
                    classes = "col_red";
                } else if (y < _snap_val[7]) {
                    classes = "col_green";
                } else {
                    classes = "col_color";
                }
                return ("<span class='first_span " + classes + "''>" + y + "</span>")
            }

            if (_zs != _xj) {
                if (_zd > 0) {
                    _zd = "+" + _zd;
                    classes = "col_red";
                } else {
                    //_zdf = "-"+_zdf;
                    classes = "col_green";
                }
            } else {
                classs = "col_color";
            }


            pad01Arr.push("<table cellspacing='0' cellpadding='0' style='height:130px;'><tr class='first_tr'><td colspan='2' class='first_td'><h1>" + _code +
                "</h1></td></tr><tr  class='first_tr'><td colspan='2' class='first_td'><h1>" + _name + showK + showU + showW + showC + "</h1></td></tr><tr><td class='first_td' rowspan=2><h2>" +
                zhangdie(_xj.toFixed(2)) + "</h2></td><td class='last_td'><h3 class='" + classes + "'>" + _zd +
                "</h3></td></tr><tr><td class='last_td'><h3 class='" + classes + "'>" + _zdf + "%</h3></td></tr></table>");
            pad02Arr.push(
                "<ul class='mm5'><li>卖五" + zhangdie(_mm5[8].toFixed(2)) + "<span class='last_span'>" + Math.round(_mm5[9] / 100) +
                "</span></li><li>卖四" + zhangdie(_mm5[6].toFixed(2)) + "<span class='last_span'>" + Math.round(_mm5[7] / 100) +
                "</span></li><li>卖三" + zhangdie(_mm5[4].toFixed(2)) + "<span class='last_span'>" + Math.round(_mm5[5] / 100) +
                "</span></li><li>卖二" + zhangdie(_mm5[2].toFixed(2)) + "<span class='last_span'>" + Math.round(_mm5[3] / 100) +
                "</span></li><li class='last_li'>卖一" + zhangdie(_mm5[0].toFixed(2)) + "<span class='last_span'>" + Math.round(_mm5[1] / 100) + "</span></li></ul>" +
                "<ul class='m5'><li class='first_li'>买一" + zhangdie(_m5[0].toFixed(2)) + "<span class='last_span'>" + Math.round(_m5[1] / 100) +
                "</span></li><li>买二" + zhangdie(_m5[2].toFixed(2)) + "<span class='last_span'>" + Math.round(_m5[3] / 100) +
                "</span></li><li>买三" + zhangdie(_m5[4].toFixed(2)) + "<span class='last_span'>" + Math.round(_m5[5] / 100) +
                "</span></li><li>买四" + zhangdie(_m5[6].toFixed(2)) + "<span class='last_span'>" + Math.round(_m5[7] / 100) +
                "</span></li><li>买五" + zhangdie(_m5[8].toFixed(2)) + "<span class='last_span'>" + Math.round(_m5[9] / 100) + "</span></li></ul>"
            );
            pad03Arr.push(
                "<table><tr><td class='td_a'>昨收</td><td class='td_b' style='color:#999;'>" + _zs.toFixed(2) + "</td><td class='td_c'>最高</td><td class='td_d'>" + zhangdie(_high.toFixed(2)) +
                "</td></tr><tr><td class='td_a'>开盘</td><td class='td_b'>" + zhangdie(_open.toFixed(2)) + "</td><td class='td_c'>最低</td><td class='td_d'>" + zhangdie(_low.toFixed(2)) +
                "</td></tr><tr><td class='td_a' colspan=''>涨停</td><td class='td_b' colspan='' style='color:#999;'>" + _ztjg + "</td>" +
                "<td class='td_c' colspan=''>跌停</td><td class='td_b' colspan='' style='color:#999;'>" + _dtjg + "</td></tr>" +
                "</td></tr><tr><td class='td_a' colspan='2'>成交量</td><td class='td_b' colspan='2' style='color:#999;'>" + (_cjl / 100).toFixed(0) +
                " 手</td></tr><tr><td class='td_a' colspan='2'>成交额</td><td class='td_b' colspan='2' style='color:#999;'>" + _cje.toFixed(0) + " 万元</td></tr>" +
                "</td></tr><tr><td class='td_a' colspan='2'>交易状态</td><td class='td_b' colspan='2' style='color:#999;'>" + checkStatus(_tradephase) + "</td></tr>" +
                "</td></tr><tr><td class='td_a' colspan='2'>盘后成交量</td><td class='td_b' colspan='2' style='color:#999;'>" + (_phcjl / 100).toFixed(0) + " 手</td></tr>" +
                "</td></tr><tr><td class='td_a' colspan='2'>盘后成交额</td><td class='td_b' colspan='2' style='color:#999;'>" + _phcje.toFixed(0) + " 万元</td></tr>" +
                "</td></tr><tr><td class='td_a' colspan='2'>盘后交易状态</td><td class='td_b' colspan='2' style='color:#999;'>" + phjyjd + "</td></tr>" +

                "<tr><td class='td_a'>时间</td><td class='td_b' colspan='3' style='color:#999;'>" + _dDate + " " + _dTime + "</td></tr>"

            );
            $("#pad01").html(pad01Arr.join(""));
            $("#pad02").html(pad02Arr.join(""));
            $("#pad03").html(pad03Arr.join(""));

            if (_ins) {
                if (resultData.snap.length < 1) {
                    $('#market_ticker').html('<center style="margin-top:45%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 40px;">暂无走势信息</span></center>');
                }

                if (_tradephase.replace(/\s/ig, '') == "P1") {
                    $('#market_ticker').html('<center style="margin-top:45%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 40px;">停牌中</span></center>');
                } else if (_tradephase.replace(/\s/ig, '') == "C1") {
                    $('#market_ticker').html('<center style="margin-top:45%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 40px;">集合竞价中</span></center>');
                } else {
                    if (checkBrowser()) {
                        market_ajax_kcb({
                            id: $('#market_ticker'),
                            code: _code,
                            last: _xj,
                            codeName: _name,
                            open: _open,
                            high: _high,
                            low: _low,
                            prev_close: _zs
                        });
                    }

                }
            } else {
                if (checkBrowser()) {
                    kLinedaykAjax(_code);
                }
            }
        }
    })
}

/**

    kline

    */

function kLinedaykAjax(_codeS) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/dayk/" + _codeS,
        jsonp: "callback",
        data: {
            select: 'date,open,high,low,close,volume',
            begin: -300,
            end: -1
        },
        cache: false,
        success: function(resultData) {
            //console.log(resultData.kline);
            kLineshow(resultData);
        }
    });
}


function kLineshow(data) {
    var _Codesz = data.code;
    data = data.kline;
    // split the data set into ohlc and volume
    var ohlc = [],
        volume = [],
        dataLength = data.length;

    for (i = 0; i < dataLength; i++) {
        var _dates = data[i][0];
        _dates = getDateUTCOrNot(_dates, true);
        ohlc.push([
            _dates, // the date
            data[i][1], // open
            data[i][2], // high
            data[i][3], // low
            data[i][4] // close
        ]);
        // console.log(ohlc);
        volume.push([
            _dates, // the date
            data[i][5] // the volume
        ])
    }

    // set the allowed units for data grouping
    var groupingUnits = [
        [
            'day', // unit name
            [1] // allowed multiples
        ]
    ];

    var originalDrawPoints = Highcharts.seriesTypes.column.prototype.drawPoints;
    Highcharts.seriesTypes.column.prototype.drawPoints = function() {
        var merge = Highcharts.merge,
            series = this,
            chart = this.chart,
            points = series.points,
            i = points.length;
        while (i--) {
            var candlePoint = chart.series[0].points[i];
            if (candlePoint.open != undefined && candlePoint.close != undefined) {
                var color = (candlePoint.open < candlePoint.close) ? '#DD2200' : '#33AA11';
                var seriesPointAttr = merge(series.pointAttr);
                seriesPointAttr[''].fill = color;
                seriesPointAttr.hover.fill = Highcharts.Color(color).brighten(0.3).get();
                seriesPointAttr.select.fill = color;
            } else {
                var seriesPointAttr = merge(series.pointAttr);
            }
            points[i].pointAttr = seriesPointAttr;
        }
        originalDrawPoints.call(this);
    }

    Highcharts.setOptions({
        global: {
            useUTC: false
        },
        lang: {
            loading: "加载中",
            months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            noData: "没有数据",
            numericSymbols: ["千", "兆", "G", "T", "P", "E"],
            printChart: "打印图表",
            resetZoom: "恢复缩放",
            resetZoomTitle: "恢复图表",
            shortMonths: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
            thousandsSep: ",",
            weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
            rangeSelectorZoom: "",
            rangeSelectorFrom: "",
            rangeSelectorTo: "至"
        }
    });
    $('#market_ticker').highcharts('StockChart', {
        chart: {
            margin: [15, 15, 25, 52],
            spacing: [0, 0, 15, 0],
            plotBorderColor: '#3C94C4',
            plotBorderWidth: 0, //边框
            backgroundColor: 0
        },
        tooltip: {
            valueDecinale: 2
        },
        plotOptions: {
            series: {
                animation: false
            },
            candlestick: {
                upColor: '#dd2200',
                upLineColor: '#dd2200',
                color: '#33aa11',
                lineColor: '#33aa11'
            }
        },
        rangeSelector: {
            /*时间段切换按钮*/
            //enabled: false,
            buttons: [{
                type: 'day',
                count: 100,
                text: '三月'
            }, {
                type: 'week',
                count: 26,
                text: '半年'
            }, {
                type: 'month',
                count: 12,
                text: '一年'
            }],
            inputBoxWidth: 90,
            inputDateFormat: '%Y-%b-%e',
            inputPosition: {
                x: -15,
                y: 15
            },
            selected: 0
        },
        navigator: {
            xAxis: {
                labels: {
                    enabled: false
                }
            },
            height: 40 //时间轴高度
        },
        scrollbar: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        yAxis: [{
            opposite: false, //是否把它显示到另一边（右边）
            showFirstLabel: true,
            showLastLabel: true,
            /*labels: {
                align: 'right',
                x: -5,
                style: {
                    color: '#808080'
                }
            },*/
            labels: {
                align: 'right',
                x: -2,
                y: 5,
                useHTML: true,
                formatter: function() {
                    return "<span>" + this.value.toFixed(2) + "</span>"
                }
            },
            height: '68%',
            lineWidth: 1,
            style: {
                color: '#ffff11'
            },
            gridLineColor: '#cccccc',
            gridLineDashStyle: 'ShortDash'
        }, {
            opposite: false, //是否把它显示到另一边（右边）
            //showFirstLabel: true,
            //showLastLabel:true,
            labels: {
                enabled: false
            },
            top: '70%',
            height: '30%',
            offset: 0,
            lineWidth: 1,
            gridLineColor: '#dddddd'
        }],
        xAxis: {
            labels: {
                style: {
                    color: '#808080',
                    fontWight: 'normal'
                },
                formatter: function() {
                    var returnTime = Highcharts.dateFormat('%b/%e', this.value);
                    return returnTime;
                }
            },
            gridLineColor: '#606060',
            alternateGridColor: '',
            minorGridLineColor: '#dddddd',
            minorTickColor: '#dddddd',
            tickColor: '#dddddd'
        },
        series: [{
            type: 'candlestick',
            name: _Codesz,
            data: ohlc,
            dataGrouping: {
                units: groupingUnits
            }
        }, {
            type: 'column',
            name: '成交量',
            data: volume,
            yAxis: 1,
            dataGrouping: {
                units: groupingUnits
            }
        }]
    });
}

/**

    日内走势

    */
function market_ajax(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/line/" + obj.code,
        data: {
            begin: 0,
            end: -1,
            select: 'time,price,volume'
        },
        jsonp: "callback",
        cache: false,
        success: function(resultData) {
            var dd = resultData;
            var d = dateConvert({
                data: dd,
                last: obj.last,
                open: obj.open
            });
            //var data = null;
            var data = d.line;
            //console.log(data[4][1]);
            //console.log(resultData.line[4][1]);
            //没数据时不显示图表
            if (data == null) {
                obj.id.css({
                    "border": "1px dotted #ccc"
                });
                obj.id.html("<span class='nal'>暂无走势信息</span>");
                return;
            }

            Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                lang: {
                    loading: "加载中",
                    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    noData: "没有数据",
                    numericSymbols: ["0手", "万手", "G", "T", "P", "E"],
                    printChart: "打印图表",
                    resetZoom: "恢复缩放",
                    resetZoomTitle: "恢复图表",
                    shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    thousandsSep: ",",
                    weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
                }
            });
            //初始化开------------------------
            var groupingUnits = [
                [
                    'minute', // unit name
                    [1] // allowed multiples
                ]
            ];
            var avg_pxyAxisMin; //Y轴最小值
            var avg_pxyAxisMax; //Y轴最大值 
            var percentageyAxisMin; //Y轴百分比最小
            var percentageyAxisMax; //Y轴百分比最大
            var volume_yAxisMin; //成交量最小
            var volume_yAxisMax; //成交量最大
            var red = "#ff0000";
            var blue = "#00a800";
            var price_trend = [],
                volume = [], //成交量
                i = 0;
            //图表上的成交量第一条的数据红绿的判断 是根据昨日的收盘价preclose_px 和今日的最新价last_px进行对比
            //同时获取的昨日收盘价  用于涨幅的计算
            var isFirstLineColorflag = true;
            //保存昨收数据
            var yesterdayClose;
            //容错判断
            if (data != undefined && data != null && data.length == 0) {
                try {
                    failCallback();
                } catch (e) {

                }
                return;
            }
            //今开
            var open_px = data[i][1];
            //昨收
            //var preclose_px=data[i][3];
            var preclose_px = d.prev_close;
            yesterdayClose = preclose_px;
            isFirstLineColorflag = open_px > preclose_px ? true : false;
            // split the data set into price_trend and volume
            //数据处理

            for (i; i < data.length; i += 1) {
                var _dates = data[i][0] + "";
                var _hours = _dates.substring(8, 10);
                var dateUTC = getDateUTCOrNot(_dates, true);
                var business_amount = data[i][2];
                var columnColor = red;
                if (i == 0) { //第一笔的 红绿柱 判断依据是根据 今天开盘价与昨日收盘价比较
                    if (isFirstLineColorflag == false) {
                        columnColor = blue;
                    }
                    avg_pxyAxisMin = data[i][1];
                    avg_pxyAxisMax = data[i][1];
                    percentageyAxisMin = Number(100 * (data[i][1] / yesterdayClose - 1));
                    percentageyAxisMax = Number(100 * (data[i][1] / yesterdayClose - 1));
                    volume_yAxisMin = data[i][2];
                    volume_yAxisMax = data[i][2];
                } else {
                    //除了第一笔，其它都是  返回的 last_px 与前一个对比
                    if (data[i - 1][1] - data[i][1] > 0) {
                        columnColor = blue;
                    }
                    business_amount = data[i][2] - data[i - 1][2];
                }
                avg_pxyAxisMin = avg_pxyAxisMin > data[i][1] ? data[i][1] : avg_pxyAxisMin;
                avg_pxyAxisMax = avg_pxyAxisMax > data[i][1] ? avg_pxyAxisMax : data[i][1];
                percentageyAxisMin = percentageyAxisMin > Number(100 * (data[i][1] / yesterdayClose - 1)) ? Number(100 * (data[i][1] / yesterdayClose - 1)) : percentageyAxisMin;
                percentageyAxisMax = percentageyAxisMax > Number(100 * (data[i][1] / yesterdayClose - 1)) ? percentageyAxisMax : Number(100 * (data[i][1] / yesterdayClose - 1));
                // = Math.min(_vol);
                //volume_yAxisMax=Math.max(_vol);
                //将数据放入 price_trend volume 数组中

                price_trend.push({
                    x: dateUTC,
                    y: Number(data[i][1])
                });
                volume.push({
                    x: dateUTC,
                    y: Number(data[i][2])
                });
            }
            //console.log(data[4][1]);
            //console.log(price_trend[4].y);
            //将剩下的时间信息补全
            appendTimeMessage(price_trend, volume, data);


            //11:30～13:01
            var date;
            if (data.length > 0) {
                date = data[data.length - 1][0] + "";
                var dArr = new Array();
                for (var hh = 0; hh < 5; hh++) {
                    var numb;
                    if (hh == 0) {
                        numb = Number(date.slice(0, 4));
                    } else {
                        numb = Number(date.slice((hh - 1) * 2 + 4, hh * 2 + 4));
                    }

                    dArr.push(numb);
                }
            }
            var last_dataTime = new Date(dArr[0], dArr[1] - 1, dArr[2], dArr[3], dArr[4]);
            var $reporting = $("#report");
            $reporting.html("");
            // Create the chart
            var am_startTime = new Date(last_dataTime);
            am_startTime.setHours(1, 30, 0, 0);
            var am_startTimeUTC = convertDateToUTC(am_startTime);
            var am_midTime = new Date(last_dataTime);
            am_midTime.setHours(2, 30, 0, 0);
            var am_midTimeUTC = convertDateToUTC(am_midTime);

            //股票交易早上最后的时间
            var am_lastTime = new Date(last_dataTime);
            am_lastTime.setHours(3, 30, 0, 0);
            var am_lastTimeUTC = convertDateToUTC(am_lastTime);

            //股票交易下午最后的时间
            var pm_startTime = new Date(last_dataTime);
            pm_startTime.setHours(5, 1, 0, 0);
            var pm_startTimeUTC = convertDateToUTC(pm_startTime);

            var pm_midTime = new Date(last_dataTime);
            pm_midTime.setHours(6, 0, 0, 0);
            var pm_midTimeUTC = convertDateToUTC(pm_midTime);

            var pm_lastTime = new Date(last_dataTime);
            pm_lastTime.setHours(7, 0, 0, 0);
            var pm_lastTimeUTC = convertDateToUTC(pm_lastTime);


            //----------------------------------------------------------
            // Create the chart
            obj.id.highcharts('StockChart', {
                chart: {
                    //关闭平移
                    panning: false,
                    zoomType: 'none',
                    pinchType: 'none',
                    renderTo: "line_map",
                    margin: [15, 68, 20, 60],
                    spacing: [0, 0, 0, 0],
                    plotBorderColor: '#3C94C4',
                    plotBorderWidth: 0, //边框
                    events: {
                        load: function() {
                            var chart = obj.id.highcharts(); // Highcharts构造函数
                            //基准线
                            chart.yAxis[0].addPlotLine({ //在x轴上增加
                                value: yesterdayClose, //在值为2的地方             //在x轴上增加
                                width: 2, //标示线的宽度为2px
                                color: '#CCC', //标示线的颜色
                                zIndex: 1,
                                id: 'plot-line-' //标示线的id，在删除该标示线的时候需要该id标示
                            });
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    valueDecinale: 2,
                    useHTML: true,
                    formatter: function() {
                        //console.log(this);
                        //var _name = this.points[1].series.name;
                        var _name = obj.codeName;
                        var _date = Highcharts.dateFormat('%b%e日,%A,%H:%M', this.x);
                        var _y = this.points[0].y.toFixed(2);
                        var _yy = this.points[2].y; //yy2
                        return '<p style="margin:0px;padding:0px;font-size:14px;"><span>' + _name + '   </span><span style="' + Comparative(_y, obj.prev_close) + ';">' + _y + '</span></p><p style="margin:0px;padding:0px;font-size:14px;"><span>' +
                            '成交量：  </span>' + ' <span>' + (_yy / 100).toFixed(0) + '</span></p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>';
                    }
                },
                plotOptions: {
                    series: {
                        /*关闭动画*/
                        animation: false
                    }
                },
                rangeSelector: {
                    enabled: false
                },
                /*导出配置*/
                exporting: {
                    enabled: false
                },
                /*创建者信息*/
                credits: {
                    enabled: false
                },
                /*下部时间拖拉选择*/
                navigator: {
                    enabled: false,
                    /*关闭时间选择*/
                    baseseries: 10
                },
                scrollbar: {
                    enabled: false /*关闭下方滚动条*/
                },
                /*底部滚动条*/
                scrollbar: {
                    enabled: false
                },

                xAxis: {
                    //type: 'datetime',
                    ordinal: false,
                    breaks: [{ // Nights
                        breakSize: 1,
                        from: am_lastTimeUTC,
                        to: pm_startTimeUTC
                    }],
                    //minRange: 14 * 24 * 36000, // fourteen days
                    showFirstLabel: true,
                    showLastLabel: true,
                    scrollbar: {
                        enabled: true
                    },
                    labels: {
                        // staggerLines:5
                        style: { //字体样式
                            font: 'normal 12px Verdana, sans-serif'
                        },
                        formatter: function() {
                            //var returnTime=Highcharts.dateFormat('%H:%M', this.value-Number(8 * 3600 * 1000));
                            var returnTime = Highcharts.dateFormat('%H:%M', this.value);
                            if (returnTime == "09:30") {
                                return '<span style="margin-left:25px;color:#aaa">09:30</span>';
                            }
                            if (returnTime == "11:30") {
                                return '<span style="color:#aaa">11:30/13:00</span>';
                            }
                            if (returnTime == "10:30") {
                                return "";
                            }
                            if (returnTime == "14:00") {
                                return "";
                            }
                            if (returnTime == "15:00") {
                                return '<span style="margin-right:25px;color:#aaa">15:00</span>';
                            }
                            return returnTime;

                        },
                        y: 15,
                        step: 1,
                        useHTML: true
                    },
                    tickLength: 5,
                    tickPositioner: function() {
                        var positions = [am_startTimeUTC, am_midTimeUTC, am_lastTimeUTC, pm_midTimeUTC, pm_lastTimeUTC];
                        //var positions = [am_startTimeUTC,  am_lastTimeUTC,pm_lastTimeUTC];
                        return positions;
                    },
                    gridLineDashStyle: 'ShortDash',
                    gridLineColor: '#f2f2f2',
                    gridLineWidth: 1
                },
                yAxis: [{
                        opposite: false, //是否把它显示到另一边（右边）
                        labels: {
                            align: 'right',
                            x: -2,
                            y: 5,
                            useHTML: true,
                            formatter: function() {
                                return "<span style=" + Comparative(this.value, obj.prev_close) + ">" + this.value + "</span>"
                            }
                        },
                        height: '72%',
                        lineWidth: 1,
                        showFirstLabel: true,
                        showLastLabel: true,
                        gridLineWidth: 0,
                        tickPositioner: function() { //以yesterdayClose为界限，统一间隔值，从 最小到最大步进
                            positions = [
                                (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(2), (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(2),
                                obj.prev_close.toFixed(2), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(2), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(2)
                            ];
                            return positions;
                        }
                    }, //y1
                    {
                        opposite: true, //是否把它显示到另一边（右边）
                        showFirstLabel: true,
                        showLastLabel: true,
                        labels: {
                            align: 'left',
                            x: 0,
                            y: 5,
                            useHTML: true,
                            formatter: function() {
                                return "<span style=" + Comparative(this.value, 0) + ">" + this.value + "%</span>"
                            }
                        },
                        lineWidth: 0,
                        top: '0%',
                        height: '72%',
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        tickPositioner: function() { //以yesterdayClose为界限，统一间隔值，从 最小到最大步进
                            positions = [
                                (((obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))) / obj.prev_close - 1) * 100).toFixed(2), (((obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2) / obj.prev_close - 1) * 100).toFixed(2),
                                '0.00', (((obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2) / obj.prev_close - 1) * 100).toFixed(2), (((obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))) / obj.prev_close - 1) * 100).toFixed(2)
                            ];
                            return positions;
                        }
                    }, {
                        labels: {
                            align: 'right',
                            x: -3,
                            y: 0,
                            style: {
                                color: '#666666'
                            }
                        },
                        showFirstLabel: false,
                        top: '75%',
                        height: '25%',
                        offset: 0,
                        lineWidth: 1,
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        opposite: false
                    }
                ],
                series: [{
                    name: obj.codeName,
                    data: price_trend,
                    yAxis: 0,
                    color: '#7cb5ec',
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    name: obj.codeName,
                    data: price_trend,
                    type: 'line',
                    cursor: 'pointer',
                    onSeries: 'candlestick',
                    color: 'transparent',
                    style: {
                        fontSize: '0px',
                        fontWeight: '0',
                        textAlign: 'center'
                    },
                    zIndex: -1000,
                    yAxis: 1,
                    fillColor: {
                        linearGradient: { //渐变方向
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    type: 'column',
                    name: '成交量',
                    data: volume,
                    //color:'#7cb5ec',
                    yAxis: 2,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    borderWidth: 0.1
                }]
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //返回错误信息
            //console.log("Ajax返回错误信息:"+XMLHttpRequest.status+"~"+XMLHttpRequest.readyState+"~"+textStatus);
        }
    });
}


function market_ajax_kcb(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/line/" + obj.code,
        data: {
            begin: 0,
            end: -1,
            select: 'time,price,volume,avg_price'
        },
        jsonp: "callback",
        cache: false,
        success: function(resultData) {
            var line = resultData.line
            if (line.length > 0) {
                $("#ht-apj").html(line[line.length - 1][3])
            }
            var dd = resultData;
            var d = dateConvert({
                data: dd,
                last: obj.last,
                open: obj.open
            });
            //var data = null;
            var data = d.line;
            //没数据时不显示图表
            if (data == null) {
                obj.id.css({
                    "border": "1px dotted #ccc"
                });
                obj.id.html("<span class='nal'>暂无走势信息</span>");
                return;
            }

            Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                lang: {
                    loading: "加载中",
                    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    noData: "没有数据",
                    numericSymbols: ["千", "百万", "G", "T", "P", "E"],
                    printChart: "打印图表",
                    resetZoom: "恢复缩放",
                    resetZoomTitle: "恢复图表",
                    shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    thousandsSep: ",",
                    weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
                }
            });
            //初始化开------------------------
            var groupingUnits = [
                [
                    'minute', // unit name
                    [1] // allowed multiples
                ]
            ];
            var avg_pxyAxisMin; //Y轴最小值
            var avg_pxyAxisMax; //Y轴最大值 
            var percentageyAxisMin; //Y轴百分比最小
            var percentageyAxisMax; //Y轴百分比最大
            var volume_yAxisMin; //成交量最小
            var volume_yAxisMax; //成交量最大
            var red = "#ff0000";
            var blue = "#00a800";
            var price_trend = [],
                price_trend_h = [],
                avg_prices = [],
                aa_1,
                volume_h = [],
                volume = [], //成交量
                i = 0;
            //图表上的成交量第一条的数据红绿的判断 是根据昨日的收盘价preclose_px 和今日的最新价last_px进行对比
            //同时获取的昨日收盘价  用于涨幅的计算
            var isFirstLineColorflag = true;
            //保存昨收数据
            var yesterdayClose;
            //容错判断
            if (data != undefined && data != null && data.length == 0) {
                try {
                    failCallback();
                } catch (e) {

                }
                return;
            }
            //今开
            var open_px = data[i][1];
            //昨收
            //var preclose_px=data[i][3];
            var preclose_px = d.prev_close;
            yesterdayClose = preclose_px;
            isFirstLineColorflag = open_px > preclose_px ? true : false;
            // split the data set into price_trend and volume
            //数据处理
            for (i; i < data.length; i += 1) {
                var _dates = data[i][0] + "";
                var _hours = _dates.substring(8, 10);
                var dateUTC = getDateUTCOrNot(_dates, true);
                var business_amount = data[i][2];
                var columnColor = red;
                if (i == 0) { //第一笔的 红绿柱 判断依据是根据 今天开盘价与昨日收盘价比较
                    if (isFirstLineColorflag == false) {
                        columnColor = blue;
                    }
                    avg_pxyAxisMin = data[i][1];
                    avg_pxyAxisMax = data[i][1];
                    percentageyAxisMin = Number(100 * (data[i][1] / yesterdayClose - 1));
                    percentageyAxisMax = Number(100 * (data[i][1] / yesterdayClose - 1));
                    volume_yAxisMin = data[i][2];
                    volume_yAxisMax = data[i][2];
                } else {
                    //除了第一笔，其它都是  返回的 last_px 与前一个对比
                    if (data[i - 1][1] - data[i][1] > 0) {
                        columnColor = blue;
                    }
                    business_amount = data[i][2] - data[i - 1][2];
                }
                avg_pxyAxisMin = avg_pxyAxisMin > data[i][1] ? data[i][1] : avg_pxyAxisMin;
                avg_pxyAxisMax = avg_pxyAxisMax > data[i][1] ? avg_pxyAxisMax : data[i][1];
                percentageyAxisMin = percentageyAxisMin > Number(100 * (data[i][1] / yesterdayClose - 1)) ? Number(100 * (data[i][1] / yesterdayClose - 1)) : percentageyAxisMin;
                percentageyAxisMax = percentageyAxisMax > Number(100 * (data[i][1] / yesterdayClose - 1)) ? percentageyAxisMax : Number(100 * (data[i][1] / yesterdayClose - 1));
                // = Math.min(_vol);
                //volume_yAxisMax=Math.max(_vol);
                //将数据放入 price_trend volume 数组中
                if (i < 241) {
                    price_trend.push({
                        x: dateUTC,
                        y: Number(data[i][1])
                    });
                    volume.push({
                        x: dateUTC,
                        y: Number(data[i][2])
                    });
                }
                if (i >= 241) {

                    price_trend_h.push({
                        x: dateUTC,
                        y: Number(data[i][1])
                    });
                    volume_h.push({
                        x: dateUTC,
                        y: Number(data[i][2])
                    });
                }
                if (i == 241) {
                    aa_1 = data[i][2]
                }

                avg_prices.push({
                    x: dateUTC,
                    y: Number(data[i][3])
                });
                // volume.push({
                //     x: dateUTC,
                //     y: Number(data[i][2])
                // });
            }

            //将剩下的时间信息补全
            appendTimeMessage(price_trend, volume, data, true);
            //将剩下的时间信息补全
            appendTimeMessage(avg_prices, volume, data, true);



            //11:30～13:01
            var date;
            if (data.length > 0) {
                date = data[data.length - 1][0] + "";
                var dArr = new Array();
                for (var hh = 0; hh < 5; hh++) {
                    var numb;
                    if (hh == 0) {
                        numb = Number(date.slice(0, 4));
                    } else {
                        numb = Number(date.slice((hh - 1) * 2 + 4, hh * 2 + 4));
                    }

                    dArr.push(numb);
                }
            }
            var last_dataTime = new Date(dArr[0], dArr[1] - 1, dArr[2], dArr[3], dArr[4]);
            var $reporting = $("#report");
            $reporting.html("");
            // Create the chart
            var am_startTime = new Date(last_dataTime);
            am_startTime.setHours(1, 30, 0, 0);
            var am_startTimeUTC = convertDateToUTC(am_startTime);
            var am_midTime = new Date(last_dataTime);
            am_midTime.setHours(2, 30, 0, 0);
            var am_midTimeUTC = convertDateToUTC(am_midTime);

            //股票交易早上最后的时间
            var am_lastTime = new Date(last_dataTime);
            am_lastTime.setHours(3, 30, 0, 0);
            var am_lastTimeUTC = convertDateToUTC(am_lastTime);

            //股票交易下午最后的时间
            var pm_startTime = new Date(last_dataTime);
            pm_startTime.setHours(5, 1, 0, 0);
            var pm_startTimeUTC = convertDateToUTC(pm_startTime);



            var pm_midTime = new Date(last_dataTime);
            pm_midTime.setHours(6, 0, 0, 0);
            var pm_midTimeUTC = convertDateToUTC(pm_midTime);

            var pm_lastTime = new Date(last_dataTime);
            pm_lastTime.setHours(7, 0, 0, 0);
            var pm_lastTimeUTC = convertDateToUTC(pm_lastTime);

            var pm_lastTime_kcb = new Date(last_dataTime);
            pm_lastTime_kcb.setHours(7, 0, 0, 0);
            var pm_lastTime_kcb = convertDateToUTC(pm_lastTime_kcb);

            var pm_startTime_kcb = new Date(last_dataTime);
            pm_startTime_kcb.setHours(7, 5, 0, 0);
            var pm_startTime_kcb = convertDateToUTC(pm_startTime_kcb);

            var pm_lastTimeone = new Date(last_dataTime);
            pm_lastTimeone.setHours(7, 30, 0, 0)
            var pm_lastTimeoneUTC = convertDateToUTC(pm_lastTimeone);
            //----------------------------------------------------------
            // Create the chart
            obj.id.highcharts('StockChart', {
                chart: {
                    //关闭平移
                    panning: false,
                    zoomType: 'none',
                    pinchType: 'none',
                    renderTo: "line_map",
                    margin: [15, 68, 20, 60],
                    spacing: [0, 0, 0, 0],
                    plotBorderColor: '#3C94C4',
                    plotBorderWidth: 0, //边框
                    events: {
                        load: function() {
                            var chart = obj.id.highcharts(); // Highcharts构造函数
                            //基准线
                            chart.yAxis[0].addPlotLine({ //在x轴上增加
                                value: yesterdayClose, //在值为2的地方             //在x轴上增加
                                width: 2, //标示线的宽度为2px
                                color: '#CCC', //标示线的颜色
                                zIndex: 1,
                                id: 'plot-line-' //标示线的id，在删除该标示线的时候需要该id标示
                            });
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    valueDecinale: 2,
                    useHTML: true,
                    formatter: function() {
                        var _name = obj.codeName;
                        var _date = Highcharts.dateFormat('%b%e日,%A,%H:%M', this.x);
                        var _y = this.points[0].y.toFixed(2);
                        var _yy = this.points[1] ? this.points[1].y : aa_1; //yy2
                        return '<p style="margin:0px;padding:0px;font-size:14px;"><span>' + _name + '   </span><span style="' + Comparative(_y, obj.prev_close) + ';">' + _y + '</span></p><p style="margin:0px;padding:0px;font-size:14px;"><span>' +
                            '成交量：  </span>' + ' <span>' + _yy + '</span></p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>';
                    }
                },
                plotOptions: {
                    series: {
                        /*关闭动画*/
                        animation: false,
                        fillColor: '#F22',
                        lineWidth: 2,
                        lineColor: null // inherit from series
                    },
                    dataLabels: {
                        align: '', // 数据列的水平对齐方式
                        enabled: false, //如何设置为true，数据列自动显示列的信息，默认false
                        backgroundColor: '#7cb5ec', // 数据标签背景颜色
                        borderColor: '#7cb5ec', // 数据标签边框颜色
                        borderWidth: 1, //数据标签边框宽度
                        borderRadius: 5, // 数据标签边框圆角
                        color: '#7cb5ec', // 数据标签字体颜色
                        format: '{y}unit', // 数据标签显示内容格式化
                        formatter: function() {
                            // 数据标签内容格式化函数
                        }
                        // padding : 5 // 数据标签的内边距
                        //  x: 0, // 坐标显示位置
                        //  y: -20 // y轴显示
                    }
                },
                rangeSelector: {
                    enabled: false
                },
                /*导出配置*/
                exporting: {
                    enabled: false
                },
                /*创建者信息*/
                credits: {
                    enabled: false
                },
                /*下部时间拖拉选择*/
                navigator: {
                    enabled: false,
                    /*关闭时间选择*/
                    baseseries: 10
                },
                scrollbar: {
                    enabled: false /*关闭下方滚动条*/
                },
                /*底部滚动条*/
                scrollbar: {
                    enabled: false
                },

                xAxis: {
                    //type: 'datetime',
                    ordinal: false,
                    breaks: [{ // Nights
                        breakSize: 1,
                        from: am_lastTimeUTC,
                        to: pm_startTimeUTC
                    }, {
                        from: pm_lastTime_kcb,
                        to: pm_startTime_kcb,
                        breakSize: 1
                    }],
                    //minRange: 14 * 24 * 36000, // fourteen days
                    showFirstLabel: true,
                    showLastLabel: true,
                    scrollbar: {
                        enabled: true
                    },
                    labels: {
                        // staggerLines:5
                        style: { //字体样式
                            font: 'normal 12px Verdana, sans-serif'
                        },
                        formatter: function() {
                            //var returnTime=Highcharts.dateFormat('%H:%M', this.value-Number(8 * 3600 * 1000));
                            var returnTime = Highcharts.dateFormat('%H:%M', this.value);
                            if (returnTime == "09:30") {
                                return '<span style="margin-left:25px;color:#aaa">09:30</span>';
                            }
                            if (returnTime == "11:30") {
                                return '<span style="color:#aaa">11:30/13:00</span>';
                            }
                            if (returnTime == "10:30") {
                                return "";
                            }
                            if (returnTime == "14:00") {
                                return "";
                            }
                            if (returnTime == "15:00") {
                                return '<span style="margin-right:80px;color:#aaa">15:00/15:05</span>';
                            }
                            if (returnTime == "15:30") {
                                return '<span style="margin-right:25px;color:#aaa">15:30</span>';
                            }

                            return returnTime;

                        },
                        y: 15,
                        step: 1,
                        useHTML: true
                    },
                    tickLength: 6,
                    tickPositioner: function() {
                        var positions = [am_startTimeUTC, am_midTimeUTC, am_lastTimeUTC, pm_midTimeUTC, pm_lastTimeUTC, pm_lastTimeoneUTC];
                        return positions;
                    },
                    gridLineDashStyle: 'ShortDash',
                    gridLineColor: '#f2f2f2',
                    gridLineWidth: 1
                },
                yAxis: [{
                        opposite: false, //是否把它显示到另一边（右边）
                        labels: {
                            align: 'right',
                            x: -2,
                            y: 5,
                            useHTML: true,
                            formatter: function() {
                                return "<span style=" + Comparative(this.value, obj.prev_close) + ">" + this.value + "</span>"
                            }
                        },
                        height: '72%',
                        lineWidth: 1,
                        showFirstLabel: true,
                        showLastLabel: true,
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        tickPositioner: function() { //以yesterdayClose为界限，统一间隔值，从 最小到最大步进
                            positions = [
                                (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixednew(2), (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixednew(2),
                                obj.prev_close.toFixednew(2), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixednew(2), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixednew(2)
                            ];
                            return positions;
                        }
                    }, //y1
                    {
                        opposite: true, //是否把它显示到另一边（右边）
                        showFirstLabel: true,
                        showLastLabel: true,
                        labels: {
                            align: 'left',
                            x: 0,
                            y: 5,
                            useHTML: true,
                            formatter: function() {
                                return "<span style=" + Comparative(this.value, 0) + ">" + this.value + "%</span>"
                            }
                        },
                        lineWidth: 0,
                        top: '0%',
                        height: '72%',
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        tickPositioner: function() { //以yesterdayClose为界限，统一间隔值，从 最小到最大步进
                            positions = [
                                (((obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))) / obj.prev_close - 1) * 100).toFixed(2), (((obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2) / obj.prev_close - 1) * 100).toFixed(2),
                                '0.00', (((obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2) / obj.prev_close - 1) * 100).toFixed(2), (((obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))) / obj.prev_close - 1) * 100).toFixed(2)
                            ];
                            return positions;
                        }
                    }, {
                        labels: {
                            align: 'right',
                            x: -3,
                            y: 0,
                            style: {
                                color: '#666666'
                            }
                        },
                        showFirstLabel: false,
                        top: '75%',
                        height: '25%',
                        offset: 0,
                        lineWidth: 1,
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        opposite: false
                    }
                ],
                series: [{
                    name: obj.codeName,
                    data: price_trend,
                    yAxis: 0,
                    color: '#7cb5ec',
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    type: 'column',
                    name: '成交量',
                    data: volume,
                    //color:'#7cb5ec',
                    yAxis: 2,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    borderWidth: 0.1
                }, {
                    name: obj.codeName,
                    data: price_trend_h,
                    yAxis: 0,
                    color: '#f22',
                    marker: {
                        fillColor: '#f22',
                        lineWidth: 1,
                        symbol: 'circle',
                        lineColor: '#f1a8a8'
                    },
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    type: 'column',
                    name: '成交量',
                    data: volume_h,
                    color: '#f22',
                    yAxis: 2,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    borderWidth: 0.1
                }]
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //返回错误信息
            //console.log("Ajax返回错误信息:"+XMLHttpRequest.status+"~"+XMLHttpRequest.readyState+"~"+textStatus);
        }
    });
}

/*


-----------------------------------------------------------首页-数据-行情信息-行情走势－B股------------------------------------------------------
*/
function market_snapAjax_qq(_codeS, _ins) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/snap/" + _codeS,
        jsonp: "callback",
        data: {
            select: 'name,last,chg_rate,change,amount,volume,open,prev_close,ask,bid,high,low,tradephase'
        },
        cache: false,
        success: function(resultData) {
            var _code = resultData.code;
            var pad01Arr = [];
            var pad02Arr = [];
            var pad03Arr = [];
            var _snap_val = resultData.snap;
            var _date = resultData.date + "";
            var _dDate = _date.substring(0, _date.length - 4) + "-" + _date.substring(_date.length - 4, _date.length - 2) + "-" + _date.substring(_date.length - 2);
            var _timer = resultData.time + "";
            var _dTime = _timer.substring(0, _timer.length - 4) + ":" + _timer.substring(_timer.length - 4, _timer.length - 2);
            var color;

            var _name = _snap_val[0]; //名称
            var _xj = _snap_val[1]; //现价
            var _zs = _snap_val[7]; //昨收
            var _zd = _snap_val[3].toFixed(3); //涨跌
            var _zdf = _snap_val[2].toFixed(3) + ''; //涨跌幅,有问题，应该在涨跌判断以后再取两位小数
            var _cje = _snap_val[4]; //成交额
            var _cjl = _snap_val[5]; //成交量
            var _mm5 = _snap_val[8]; //卖盘五档
            var _m5 = _snap_val[9]; //买盘五档
            var _high = _snap_val[10]; //最高价
            var _low = _snap_val[11]; //最低价
            var _open = _snap_val[6]; //开盘价
            var _tradephase = _snap_val[12];
            _cje = _cje / 10000;

            var classes;

            function zhangdie(y) {
                if (y > _snap_val[7]) {
                    classes = "col_red";
                } else if (y < _snap_val[7]) {
                    classes = "col_green";
                } else {
                    classes = "col_color";
                }
                return ("<span class='first_span " + classes + "''>" + y + "</span>")
            }

            if (_zs != _xj) {
                if (_zd > 0) {
                    _zd = "+" + _zd;
                    classes = "col_red";
                } else {
                    //_zdf = "-"+_zdf;
                    classes = "col_green";
                }
            } else {
                classs = "col_color";
            }
            pad01Arr.push("<table cellspacing='0' cellpadding='0'><tr class='first_tr'><td class='first_td'><h1>" + _code + "</h1></td><td class='last_td'><h1>" + _name +
                "</h1></td></tr><tr><td class='first_td' rowspan=2><h2>" + zhangdie(_xj.toFixed(3)) + "</h2></td><td class='last_td'><h3 class='" + classes + "'>" + _zd +
                "</h3></td></tr><tr><td class='last_td'><h3 class='" + classes + "'>" + _zdf + "%</h3></td></tr></table>");
            pad02Arr.push(
                "<ul class='mm5'><li>卖五" + zhangdie(_mm5[8].toFixed(3)) + "<span class='last_span'>" + Math.round(_mm5[9] / 100) +
                "</span></li><li>卖四" + zhangdie(_mm5[6].toFixed(3)) + "<span class='last_span'>" + Math.round(_mm5[7] / 100) +
                "</span></li><li>卖三" + zhangdie(_mm5[4].toFixed(3)) + "<span class='last_span'>" + Math.round(_mm5[5] / 100) +
                "</span></li><li>卖二" + zhangdie(_mm5[2].toFixed(3)) + "<span class='last_span'>" + Math.round(_mm5[3] / 100) +
                "</span></li><li class='last_li'>卖一" + zhangdie(_mm5[0].toFixed(3)) + "<span class='last_span'>" + Math.round(_mm5[1] / 100) + "</span></li></ul>" +
                "<ul class='m5'><li class='first_li'>买一" + zhangdie(_m5[0].toFixed(3)) + "<span class='last_span'>" + Math.round(_m5[1] / 100) +
                "</span></li><li>买二" + zhangdie(_m5[2].toFixed(3)) + "<span class='last_span'>" + Math.round(_m5[3] / 100) +
                "</span></li><li>买三" + zhangdie(_m5[4].toFixed(3)) + "<span class='last_span'>" + Math.round(_m5[5] / 100) +
                "</span></li><li>买四" + zhangdie(_m5[6].toFixed(3)) + "<span class='last_span'>" + Math.round(_m5[7] / 100) +
                "</span></li><li>买五" + zhangdie(_m5[8].toFixed(3)) + "<span class='last_span'>" + Math.round(_m5[9] / 100) + "</span></li></ul>"
            );
            pad03Arr.push(
                "<table><tr><td class='td_a'>昨收</td><td class='td_b' style='color:#999;'>" + _zs.toFixed(3) + "</td><td class='td_c'>最高</td><td class='td_d'>" + zhangdie(_high.toFixed(3)) +
                "</td></tr><tr><td class='td_a'>开盘</td><td class='td_b'>" + zhangdie(_open.toFixed(3)) + "</td><td class='td_c'>最低</td><td class='td_d'>" + zhangdie(_low.toFixed(3)) +
                "</td></tr><tr><td class='td_a' colspan='2'>成交量</td><td class='td_b' colspan='2' style='color:#999;'>" + (_cjl / 100).toFixed(0) +
                " 手</td></tr><tr><td class='td_a' colspan='2'>成交额</td><td class='td_b' colspan='2' style='color:#999;'>" + _cje.toFixed(0) + " 万美元</td></tr>" +
                "<tr><td class='td_a'>时间</td><td class='td_b' colspan='3' style='color:#999;'>" + _dDate + " " + _dTime + "</td></tr>" +
                "<tr><td class='td_a' colspan='2'>交易状态</td><td class='td_b' colspan='2' style='color:#999;'>" + checkStatus(_tradephase) + "</td></tr></table>"
            );
            $("#pad01").html(pad01Arr.join(""));
            $("#pad02").html(pad02Arr.join(""));
            $("#pad03").html(pad03Arr.join(""));

            if (_ins) {
                if (resultData.snap.length < 1) {
                    $('#market_ticker').html('<center style="margin-top:45%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 40px;">暂无走势信息</span></center>');
                }

                if (_tradephase.replace(/\s/ig, '') == "P1") {
                    $('#market_ticker').html('<center style="margin-top:45%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 40px;">停牌中</span></center>');
                } else if (_tradephase.replace(/\s/ig, '') == "C1") {
                    $('#market_ticker').html('<center style="margin-top:45%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 40px;">集合竞价中</span></center>');
                } else {
                    if (checkBrowser()) {

                        market_ajax_qq({
                            id: $('#market_ticker'),
                            code: _code,
                            last: _xj,
                            codeName: _name,
                            open: _open,
                            high: _high,
                            low: _low,
                            prev_close: _zs
                        });
                    }
                }
            } else {
                if (checkBrowser()) {
                    kLinedaykAjax_qq(_code);
                }
            }
        }
    })
}

/**

    kline

    */

function kLinedaykAjax_qq(_codeS) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/dayk/" + _codeS,
        jsonp: "callback",
        data: {
            select: 'date,open,high,low,close,volume',
            begin: -300,
            end: -1
        },
        cache: false,
        success: function(resultData) {
            //console.log(resultData.kline);
            kLineshow_qq(resultData);
        }
    });
}


function kLineshow_qq(data) {
    var _Codesz = data.code;
    data = data.kline;
    // split the data set into ohlc and volume
    var ohlc = [],
        volume = [],
        dataLength = data.length;

    for (i = 0; i < dataLength; i++) {
        var _dates = data[i][0];
        _dates = getDateUTCOrNot(_dates, true);
        ohlc.push([
            _dates, // the date
            data[i][1], // open
            data[i][2], // high
            data[i][3], // low
            data[i][4] // close
        ]);
        // console.log(ohlc);
        volume.push([
            _dates, // the date
            data[i][5] // the volume
        ])
    }

    // set the allowed units for data grouping
    var groupingUnits = [
        [
            'day', // unit name
            [1] // allowed multiples
        ]
    ];

    var originalDrawPoints = Highcharts.seriesTypes.column.prototype.drawPoints;
    Highcharts.seriesTypes.column.prototype.drawPoints = function() {
        var merge = Highcharts.merge,
            series = this,
            chart = this.chart,
            points = series.points,
            i = points.length;
        while (i--) {
            var candlePoint = chart.series[0].points[i];
            if (candlePoint.open != undefined && candlePoint.close != undefined) {
                var color = (candlePoint.open < candlePoint.close) ? '#DD2200' : '#33AA11';
                var seriesPointAttr = merge(series.pointAttr);
                seriesPointAttr[''].fill = color;
                seriesPointAttr.hover.fill = Highcharts.Color(color).brighten(0.3).get();
                seriesPointAttr.select.fill = color;
            } else {
                var seriesPointAttr = merge(series.pointAttr);
            }
            points[i].pointAttr = seriesPointAttr;
        }
        originalDrawPoints.call(this);
    }

    Highcharts.setOptions({
        global: {
            useUTC: false
        },
        lang: {
            loading: "加载中",
            months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            noData: "没有数据",
            numericSymbols: ["千", "兆", "G", "T", "P", "E"],
            printChart: "打印图表",
            resetZoom: "恢复缩放",
            resetZoomTitle: "恢复图表",
            shortMonths: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
            thousandsSep: ",",
            weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
            rangeSelectorZoom: "",
            rangeSelectorFrom: "",
            rangeSelectorTo: "至"
        }
    });
    $('#market_ticker').highcharts('StockChart', {
        chart: {
            margin: [15, 15, 25, 45],
            spacing: [0, 0, 15, 0],
            plotBorderColor: '#3C94C4',
            plotBorderWidth: 0, //边框
            backgroundColor: 0
        },
        tooltip: {
            valueDecinale: 2
        },
        plotOptions: {
            series: {
                animation: false
            },
            candlestick: {
                upColor: '#dd2200',
                upLineColor: '#dd2200',
                color: '#33aa11',
                lineColor: '#33aa11'
            }
        },
        rangeSelector: {
            /*时间段切换按钮*/
            //enabled: false,
            buttons: [{
                type: 'day',
                count: 100,
                text: '三月'
            }, {
                type: 'week',
                count: 26,
                text: '半年'
            }, {
                type: 'month',
                count: 12,
                text: '一年'
            }],
            inputBoxWidth: 90,
            inputDateFormat: '%Y-%b-%e',
            inputPosition: {
                x: -15,
                y: 15
            },
            selected: 0
        },
        navigator: {
            xAxis: {
                labels: {
                    enabled: false
                }
            },
            height: 40 //时间轴高度
        },
        scrollbar: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        yAxis: [{
            opposite: false, //是否把它显示到另一边（右边）
            showFirstLabel: true,
            showLastLabel: true,
            /*labels: {
                align: 'right',
                x: -5,
                style: {
                    color: '#808080'
                }
            },*/
            labels: {
                align: 'right',
                x: -2,
                y: 5,
                useHTML: true,
                formatter: function() {
                    return "<span>" + this.value.toFixed(3) + "</span>"
                }
            },
            height: '68%',
            lineWidth: 1,
            style: {
                color: '#ffff11'
            },
            gridLineColor: '#cccccc',
            gridLineDashStyle: 'ShortDash'
        }, {
            opposite: false, //是否把它显示到另一边（右边）
            //showFirstLabel: true,
            //showLastLabel:true,
            labels: {
                enabled: false
            },
            top: '70%',
            height: '30%',
            offset: 0,
            lineWidth: 1,
            gridLineColor: '#dddddd'
        }],
        xAxis: {
            labels: {
                style: {
                    color: '#808080',
                    fontWight: 'normal'
                },
                formatter: function() {
                    var returnTime = Highcharts.dateFormat('%b/%e', this.value);
                    return returnTime;
                }
            },
            gridLineColor: '#606060',
            alternateGridColor: '',
            minorGridLineColor: '#dddddd',
            minorTickColor: '#dddddd',
            tickColor: '#dddddd'
        },
        series: [{
            type: 'candlestick',
            name: _Codesz,
            data: ohlc,
            dataGrouping: {
                units: groupingUnits
            }
        }, {
            type: 'column',
            name: '成交量',
            data: volume,
            yAxis: 1,
            dataGrouping: {
                units: groupingUnits
            }
        }]
    });
}

/**

    日内走势

    */
function market_ajax_qq(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/line/" + obj.code,
        data: {
            begin: 0,
            end: -1,
            select: 'time,price,volume'
        },
        jsonp: "callback",
        cache: false,
        success: function(resultData) {
            var dd = resultData;
            var d = dateConvert({
                data: dd,
                last: obj.last,
                open: obj.open
            });
            //var data = null;
            var data = d.line;
            //没数据时不显示图表
            if (data == null) {
                obj.id.css({
                    "border": "1px dotted #ccc"
                });
                obj.id.html("<span class='nal'>暂无走势信息</span>");
                return;
            }

            Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                lang: {
                    loading: "加载中",
                    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    noData: "没有数据",
                    numericSymbols: ["0手", "万手", "G", "T", "P", "E"],
                    printChart: "打印图表",
                    resetZoom: "恢复缩放",
                    resetZoomTitle: "恢复图表",
                    shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    thousandsSep: ",",
                    weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
                }
            });
            //初始化开------------------------
            var groupingUnits = [
                [
                    'minute', // unit name
                    [1] // allowed multiples
                ]
            ];
            var avg_pxyAxisMin; //Y轴最小值
            var avg_pxyAxisMax; //Y轴最大值 
            var percentageyAxisMin; //Y轴百分比最小
            var percentageyAxisMax; //Y轴百分比最大
            var volume_yAxisMin; //成交量最小
            var volume_yAxisMax; //成交量最大
            var red = "#ff0000";
            var blue = "#00a800";
            var price_trend = [],
                volume = [], //成交量
                i = 0;
            //图表上的成交量第一条的数据红绿的判断 是根据昨日的收盘价preclose_px 和今日的最新价last_px进行对比
            //同时获取的昨日收盘价  用于涨幅的计算
            var isFirstLineColorflag = true;
            //保存昨收数据
            var yesterdayClose;
            //容错判断
            if (data != undefined && data != null && data.length == 0) {
                try {
                    failCallback();
                } catch (e) {

                }
                return;
            }
            //今开
            var open_px = data[i][1];
            //昨收
            //var preclose_px=data[i][3];
            var preclose_px = d.prev_close;
            yesterdayClose = preclose_px;
            isFirstLineColorflag = open_px > preclose_px ? true : false;
            // split the data set into price_trend and volume
            //数据处理
            for (i; i < data.length; i += 1) {
                var _dates = data[i][0] + "";
                var _hours = _dates.substring(8, 10);
                var dateUTC = getDateUTCOrNot(_dates, true);
                var business_amount = data[i][2];
                var columnColor = red;
                if (i == 0) { //第一笔的 红绿柱 判断依据是根据 今天开盘价与昨日收盘价比较
                    if (isFirstLineColorflag == false) {
                        columnColor = blue;
                    }
                    avg_pxyAxisMin = data[i][1];
                    avg_pxyAxisMax = data[i][1];
                    percentageyAxisMin = Number(100 * (data[i][1] / yesterdayClose - 1));
                    percentageyAxisMax = Number(100 * (data[i][1] / yesterdayClose - 1));
                    volume_yAxisMin = data[i][2];
                    volume_yAxisMax = data[i][2];
                } else {
                    //除了第一笔，其它都是  返回的 last_px 与前一个对比
                    if (data[i - 1][1] - data[i][1] > 0) {
                        columnColor = blue;
                    }
                    business_amount = data[i][2] - data[i - 1][2];
                }
                avg_pxyAxisMin = avg_pxyAxisMin > data[i][1] ? data[i][1] : avg_pxyAxisMin;
                avg_pxyAxisMax = avg_pxyAxisMax > data[i][1] ? avg_pxyAxisMax : data[i][1];
                percentageyAxisMin = percentageyAxisMin > Number(100 * (data[i][1] / yesterdayClose - 1)) ? Number(100 * (data[i][1] / yesterdayClose - 1)) : percentageyAxisMin;
                percentageyAxisMax = percentageyAxisMax > Number(100 * (data[i][1] / yesterdayClose - 1)) ? percentageyAxisMax : Number(100 * (data[i][1] / yesterdayClose - 1));
                // = Math.min(_vol);
                //volume_yAxisMax=Math.max(_vol);
                //将数据放入 price_trend volume 数组中

                price_trend.push({
                    x: dateUTC,
                    y: Number(data[i][1])
                });
                volume.push({
                    x: dateUTC,
                    y: Number(data[i][2])
                });
            }

            //将剩下的时间信息补全
            appendTimeMessage(price_trend, volume, data);


            //11:30～13:01
            var date;
            if (data.length > 0) {
                date = data[data.length - 1][0] + "";
                var dArr = new Array();
                for (var hh = 0; hh < 5; hh++) {
                    var numb;
                    if (hh == 0) {
                        numb = Number(date.slice(0, 4));
                    } else {
                        numb = Number(date.slice((hh - 1) * 2 + 4, hh * 2 + 4));
                    }

                    dArr.push(numb);
                }
            }
            var last_dataTime = new Date(dArr[0], dArr[1] - 1, dArr[2], dArr[3], dArr[4]);
            var $reporting = $("#report");
            $reporting.html("");
            // Create the chart
            var am_startTime = new Date(last_dataTime);
            am_startTime.setHours(1, 30, 0, 0);
            var am_startTimeUTC = convertDateToUTC(am_startTime);
            var am_midTime = new Date(last_dataTime);
            am_midTime.setHours(2, 30, 0, 0);
            var am_midTimeUTC = convertDateToUTC(am_midTime);

            //股票交易早上最后的时间
            var am_lastTime = new Date(last_dataTime);
            am_lastTime.setHours(3, 30, 0, 0);
            var am_lastTimeUTC = convertDateToUTC(am_lastTime);

            //股票交易下午最后的时间
            var pm_startTime = new Date(last_dataTime);
            pm_startTime.setHours(5, 1, 0, 0);
            var pm_startTimeUTC = convertDateToUTC(pm_startTime);

            var pm_midTime = new Date(last_dataTime);
            pm_midTime.setHours(6, 0, 0, 0);
            var pm_midTimeUTC = convertDateToUTC(pm_midTime);

            var pm_lastTime = new Date(last_dataTime);
            pm_lastTime.setHours(7, 0, 0, 0);
            var pm_lastTimeUTC = convertDateToUTC(pm_lastTime);


            //----------------------------------------------------------
            // Create the chart
            obj.id.highcharts('StockChart', {
                chart: {
                    //关闭平移
                    panning: false,
                    zoomType: 'none',
                    pinchType: 'none',
                    renderTo: "line_map",
                    margin: [15, 48, 20, 50],
                    spacing: [0, 0, 0, 0],
                    plotBorderColor: '#3C94C4',
                    plotBorderWidth: 0, //边框
                    events: {
                        load: function() {
                            var chart = obj.id.highcharts(); // Highcharts构造函数
                            //基准线
                            chart.yAxis[0].addPlotLine({ //在x轴上增加
                                value: yesterdayClose, //在值为2的地方             //在x轴上增加
                                width: 2, //标示线的宽度为2px
                                color: '#CCC', //标示线的颜色
                                zIndex: 1,
                                id: 'plot-line-' //标示线的id，在删除该标示线的时候需要该id标示
                            });
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    valueDecinale: 2,
                    useHTML: true,
                    formatter: function() {
                        //console.log(this);
                        //var _name = this.points[1].series.name;
                        var _name = obj.codeName;
                        var _date = Highcharts.dateFormat('%b%e日,%A,%H:%M', this.x);
                        var _y = this.points[0].y.toFixed(3);
                        var _yy = this.points[2].y; //yy2
                        return '<p style="margin:0px;padding:0px;font-size:14px;"><span>' + _name + '   </span><span style="' + Comparative(_y, obj.prev_close) + ';">' + _y + '</span></p><p style="margin:0px;padding:0px;font-size:14px;"><span>' +
                            '成交量：  </span>' + ' <span>' + (_yy / 100).toFixed(0) + '</span></p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>';
                    }
                },
                plotOptions: {
                    series: {
                        /*关闭动画*/
                        animation: false
                    }
                },
                rangeSelector: {
                    enabled: false
                },
                /*导出配置*/
                exporting: {
                    enabled: false
                },
                /*创建者信息*/
                credits: {
                    enabled: false
                },
                /*下部时间拖拉选择*/
                navigator: {
                    enabled: false,
                    /*关闭时间选择*/
                    baseseries: 10
                },
                scrollbar: {
                    enabled: false /*关闭下方滚动条*/
                },
                /*底部滚动条*/
                scrollbar: {
                    enabled: false
                },

                xAxis: {
                    //type: 'datetime',
                    ordinal: false,
                    breaks: [{ // Nights
                        breakSize: 1,
                        from: am_lastTimeUTC,
                        to: pm_startTimeUTC
                    }],
                    //minRange: 14 * 24 * 36000, // fourteen days
                    showFirstLabel: true,
                    showLastLabel: true,
                    scrollbar: {
                        enabled: true
                    },
                    labels: {
                        // staggerLines:5
                        style: { //字体样式
                            font: 'normal 12px Verdana, sans-serif'
                        },
                        formatter: function() {
                            //var returnTime=Highcharts.dateFormat('%H:%M', this.value-Number(8 * 3600 * 1000));
                            var returnTime = Highcharts.dateFormat('%H:%M', this.value);
                            if (returnTime == "09:30") {
                                return '<span style="margin-left:25px;color:#aaa">09:30</span>';
                            }
                            if (returnTime == "11:30") {
                                return '<span style="color:#aaa">11:30/13:00</span>';
                            }
                            if (returnTime == "10:30") {
                                return "";
                            }
                            if (returnTime == "14:00") {
                                return "";
                            }
                            if (returnTime == "15:00") {
                                return '<span style="margin-right:25px;color:#aaa">15:00</span>';
                            }
                            return returnTime;

                        },
                        y: 15,
                        step: 1,
                        useHTML: true
                    },
                    tickLength: 5,
                    tickPositioner: function() {
                        var positions = [am_startTimeUTC, am_midTimeUTC, am_lastTimeUTC, pm_midTimeUTC, pm_lastTimeUTC];
                        //var positions = [am_startTimeUTC,  am_lastTimeUTC,pm_lastTimeUTC];
                        return positions;
                    },
                    gridLineDashStyle: 'ShortDash',
                    gridLineColor: '#f2f2f2',
                    gridLineWidth: 1
                },
                yAxis: [{
                        opposite: false, //是否把它显示到另一边（右边）
                        labels: {
                            align: 'right',
                            x: -2,
                            y: 5,
                            useHTML: true,
                            formatter: function() {
                                return "<span style=" + Comparative(this.value, obj.prev_close) + ">" + this.value + "</span>"
                            }
                        },
                        height: '72%',
                        lineWidth: 1,
                        showFirstLabel: true,
                        showLastLabel: true,
                        gridLineWidth: 0,
                        tickPositioner: function() { //以yesterdayClose为界限，统一间隔值，从 最小到最大步进
                            positions = [
                                (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(3), (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(3),
                                obj.prev_close.toFixed(3), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(3), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(3)
                            ];
                            return positions;

                        }
                    }, //y1
                    {
                        opposite: true, //是否把它显示到另一边（右边）
                        showFirstLabel: true,
                        showLastLabel: true,
                        labels: {
                            align: 'left',
                            x: 0,
                            y: 5,
                            useHTML: true,
                            formatter: function() {
                                return "<span style=" + Comparative(this.value, 0) + ">" + this.value + "%</span>"
                            }
                        },
                        lineWidth: 0,
                        top: '0%',
                        height: '72%',
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        tickPositioner: function() { //以yesterdayClose为界限，统一间隔值，从 最小到最大步进
                            positions = [
                                (((obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))) / obj.prev_close - 1) * 100).toFixed(2), (((obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2) / obj.prev_close - 1) * 100).toFixed(2),
                                '0.00', (((obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2) / obj.prev_close - 1) * 100).toFixed(2), (((obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))) / obj.prev_close - 1) * 100).toFixed(2)
                            ];
                            return positions;
                        }
                    }, {
                        labels: {
                            align: 'right',
                            x: -3,
                            y: 0,
                            style: {
                                color: '#666666'
                            }
                        },
                        showFirstLabel: false,
                        top: '75%',
                        height: '25%',
                        offset: 0,
                        lineWidth: 1,
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        opposite: false
                    }
                ],
                series: [{
                    name: obj.codeName,
                    data: price_trend,
                    yAxis: 0,
                    color: '#7cb5ec',
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    name: obj.codeName,
                    data: price_trend,
                    type: 'line',
                    cursor: 'pointer',
                    onSeries: 'candlestick',
                    color: 'transparent',
                    style: {
                        fontSize: '0px',
                        fontWeight: '0',
                        textAlign: 'center'
                    },
                    zIndex: -1000,
                    yAxis: 1,
                    fillColor: {
                        linearGradient: { //渐变方向
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    type: 'column',
                    name: '成交量',
                    data: volume,
                    //color:'#7cb5ec',
                    yAxis: 2,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    borderWidth: 0.1
                }]
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //返回错误信息
            //console.log("Ajax返回错误信息:"+XMLHttpRequest.status+"~"+XMLHttpRequest.readyState+"~"+textStatus);
        }
    });
}
/*
-----------------------------------------------------------首页-数据-行情信息-行情走势－指数------------------------------------------------------
*/
function market_snapAjax_zs(_codeS, _ins) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/snap/" + _codeS,
        jsonp: "callback",
        data: {
            select: 'name,last,chg_rate,change,amount,volume,open,prev_close,ask,bid,high,low,tradephase'
        },
        cache: false,
        success: function(resultData) {
            var _code = resultData.code;
            var pad01Arr = [];
            var pad02Arr = [];
            var pad03Arr = [];
            var _snap_val = resultData.snap;
            var _date = resultData.date + "";
            var _dDate = _date.substring(0, _date.length - 4) + "-" + _date.substring(_date.length - 4, _date.length - 2) + "-" + _date.substring(_date.length - 2);
            var _timer = resultData.time + "";
            var _dTime = _timer.substring(0, _timer.length - 4) + ":" + _timer.substring(_timer.length - 4, _timer.length - 2);
            var color;

            var _name = _snap_val[0]; //名称
            var _xj = _snap_val[1]; //现价
            var _zs = _snap_val[7]; //昨收
            var _zd = _snap_val[3].toFixed(2); //涨跌
            var _zdf = _snap_val[2].toFixed(2) + ''; //涨跌幅,有问题，应该在涨跌判断以后再取两位小数
            var _cje = _snap_val[4]; //成交额
            var _cjl = _snap_val[5]; //成交量
            var _mm5 = _snap_val[8]; //卖盘五档
            var _m5 = _snap_val[9]; //买盘五档
            var _high = _snap_val[10]; //最高价
            var _low = _snap_val[11]; //最低价
            var _open = _snap_val[6]; //开盘价
            var _tradephase = _snap_val[12];
            _cje = _cje / 100000000;

            var classes;

            function zhangdie(y) {
                if (y > _snap_val[7]) {
                    classes = "col_red";
                } else if (y < _snap_val[7]) {
                    classes = "col_green";
                } else {
                    classes = "col_color";
                }
                return ("<span class='first_span " + classes + "''>" + y + "</span>")
            }

            if (_zs != _xj) {
                if (_zd > 0) {
                    _zd = "+" + _zd;
                    classes = "col_red";
                } else {
                    //_zdf = "-"+_zdf;
                    classes = "col_green";
                }
            } else {
                classs = "col_color";
            }
            pad01Arr.push("<table cellspacing='0' cellpadding='0'><tr class='first_tr'><td class='first_td'><h1>" + _code + "</h1></td><td class='last_td'><h1>" + _name +
                "</h1></td></tr><tr><td class='first_td' rowspan=2><h2>" + zhangdie(_xj.toFixed(2)) + "</h2></td><td class='last_td'><h3 class='" + classes + "'>" + _zd +
                "</h3></td></tr><tr><td class='last_td'><h3 class='" + classes + "'>" + _zdf + "%</h3></td></tr></table>");
            pad02Arr.push(
                "<ul class='mm5'><li>卖五" + zhangdie(_mm5[8].toFixed(2)) + "<span class='last_span'>" + Math.round(_mm5[9] / 100) +
                "</span></li><li>卖四" + zhangdie(_mm5[6].toFixed(2)) + "<span class='last_span'>" + Math.round(_mm5[7] / 100) +
                "</span></li><li>卖三" + zhangdie(_mm5[4].toFixed(2)) + "<span class='last_span'>" + Math.round(_mm5[5] / 100) +
                "</span></li><li>卖二" + zhangdie(_mm5[2].toFixed(2)) + "<span class='last_span'>" + Math.round(_mm5[3] / 100) +
                "</span></li><li class='last_li'>卖一" + zhangdie(_mm5[0].toFixed(2)) + "<span class='last_span'>" + Math.round(_mm5[1] / 100) + "</span></li></ul>" +
                "<ul class='m5'><li class='first_li'>买一" + zhangdie(_m5[0].toFixed(2)) + "<span class='last_span'>" + Math.round(_m5[1] / 100) +
                "</span></li><li>买二" + zhangdie(_m5[2].toFixed(2)) + "<span class='last_span'>" + Math.round(_m5[3] / 100) +
                "</span></li><li>买三" + zhangdie(_m5[4].toFixed(2)) + "<span class='last_span'>" + Math.round(_m5[5] / 100) +
                "</span></li><li>买四" + zhangdie(_m5[6].toFixed(2)) + "<span class='last_span'>" + Math.round(_m5[7] / 100) +
                "</span></li><li>买五" + zhangdie(_m5[8].toFixed(2)) + "<span class='last_span'>" + Math.round(_m5[9] / 100) + "</span></li></ul>"
            );
            pad03Arr.push(
                "<table><tr><td class='td_a'>昨收</td><td class='td_b' style='color:#999;'>" + _zs.toFixed(2) + "</td><td class='td_c'>最高</td><td class='td_d'>" + zhangdie(_high.toFixed(2)) +
                "</td></tr><tr><td class='td_a'>开盘</td><td class='td_b'>" + zhangdie(_open.toFixed(2)) + "</td><td class='td_c'>最低</td><td class='td_d'>" + zhangdie(_low.toFixed(2)) +
                "</td></tr><tr><td class='td_a' colspan='2'>成交量</td><td class='td_b' colspan='2' style='color:#999;'>" + (_cjl / 10000).toFixed(0) +
                " 万手</td></tr><tr><td class='td_a' colspan='2'>成交额</td><td class='td_b' colspan='2' style='color:#999;'>" + _cje.toFixed(2) + " 亿元</td></tr>" +
                "<tr><td class='td_a'>时间</td><td class='td_b' colspan='3' style='color:#999;'>" + _dDate + " " + _dTime + "</td></tr></table>"
            );
            $("#pad01").html(pad01Arr.join(""));
            $("#pad02").html(pad02Arr.join(""));
            $("#pad03").html(pad03Arr.join(""));

            if (_ins) {
                if (resultData.snap.length < 1) {
                    $('#market_ticker').html('<center style="margin-top:45%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 40px;">暂无走势信息</span></center>');
                }
                if (_tradephase.replace(/\s/ig, '') == "P1") {
                    $('#market_ticker').html('<center style="margin-top:45%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 40px;">停牌中</span></center>');
                } else if (_tradephase.replace(/\s/ig, '') == "C1") {
                    $('#market_ticker').html('<center style="margin-top:45%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 40px;">集合竞价中</span></center>');
                } else {
                    if (checkBrowser()) {
                        market_ajax_zs({
                            id: $('#market_ticker'),
                            code: _code,
                            last: _xj,
                            codeName: _name,
                            open: _open,
                            high: _high,
                            low: _low,
                            prev_close: _zs
                        });
                    }
                }
            } else {
                if (checkBrowser()) {
                    kLinedaykAjax_zs(_code);
                }
            }
        }
    })
}

/**

    kline

    */

function kLinedaykAjax_zs(_codeS) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        // url: "http://www.hcharts.cn/datas/jsonp.php?filename=aapl-ohlcv.json",
        url: hq_queryUrl + "/v1/sh1/dayk/" + _codeS,
        jsonp: "callback",
        data: {
            select: 'date,open,high,low,close,volume',
            begin: -300,
            end: -1
        },
        cache: false,
        success: function(resultData) {
            //console.log(resultData.kline);
            kLineshow_zs(resultData);
        }
    });
}


function kLineshow_zs(data) {
    var _Codesz = data.code;
    data = data.kline;
    // split the data set into ohlc and volume
    var ohlc = [],
        volume = [],
        dataLength = data.length;

    for (i = 0; i < dataLength; i++) {
        var _dates = data[i][0];
        _dates = getDateUTCOrNot(_dates, true);
        ohlc.push([
            _dates, // the date
            data[i][1], // open
            data[i][2], // high
            data[i][3], // low
            data[i][4] // close
        ]);
        // console.log(ohlc);
        volume.push([
            _dates, // the date
            data[i][5] // the volume
        ])
    }

    // set the allowed units for data grouping
    var groupingUnits = [
        [
            'day', // unit name
            [1] // allowed multiples
        ]
    ];

    var originalDrawPoints = Highcharts.seriesTypes.column.prototype.drawPoints;
    Highcharts.seriesTypes.column.prototype.drawPoints = function() {
        var merge = Highcharts.merge,
            series = this,
            chart = this.chart,
            points = series.points,
            i = points.length;
        while (i--) {
            var candlePoint = chart.series[0].points[i];
            if (candlePoint.open != undefined && candlePoint.close != undefined) {
                var color = (candlePoint.open < candlePoint.close) ? '#DD2200' : '#33AA11';
                var seriesPointAttr = merge(series.pointAttr);
                seriesPointAttr[''].fill = color;
                seriesPointAttr.hover.fill = Highcharts.Color(color).brighten(0.3).get();
                seriesPointAttr.select.fill = color;
            } else {
                var seriesPointAttr = merge(series.pointAttr);
            }
            points[i].pointAttr = seriesPointAttr;
        }
        originalDrawPoints.call(this);
    }

    Highcharts.setOptions({
        global: {
            useUTC: false
        },
        lang: {
            loading: "加载中",
            months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            noData: "没有数据",
            numericSymbols: ["千", "兆", "G", "T", "P", "E"],
            printChart: "打印图表",
            resetZoom: "恢复缩放",
            resetZoomTitle: "恢复图表",
            shortMonths: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
            thousandsSep: ",",
            weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
            rangeSelectorZoom: "",
            rangeSelectorFrom: "",
            rangeSelectorTo: "至"
        }
    });
    $('#market_ticker').highcharts('StockChart', {
        chart: {
            margin: [15, 15, 25, 40],
            spacing: [0, 0, 15, 0],
            plotBorderColor: '#3C94C4',
            plotBorderWidth: 0, //边框
            backgroundColor: 0
        },
        tooltip: {
            valueDecinale: 2
        },
        plotOptions: {
            series: {
                animation: false
            },
            candlestick: {
                upColor: '#dd2200',
                upLineColor: '#dd2200',
                color: '#33aa11',
                lineColor: '#33aa11'
            }
        },
        rangeSelector: {
            /*时间段切换按钮*/
            //enabled: false,
            buttons: [{
                type: 'day',
                count: 100,
                text: '三月'
            }, {
                type: 'week',
                count: 26,
                text: '半年'
            }, {
                type: 'month',
                count: 12,
                text: '一年'
            }],
            inputBoxWidth: 90,
            inputDateFormat: '%Y-%b-%e',
            inputPosition: {
                x: -15,
                y: 15
            },
            selected: 0
        },
        navigator: {
            xAxis: {
                labels: {
                    enabled: false
                }
            },
            height: 40 //时间轴高度
        },
        scrollbar: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        yAxis: [{
            opposite: false, //是否把它显示到另一边（右边）
            showFirstLabel: true,
            showLastLabel: true,
            /*labels: {
                align: 'right',
                x: -5,
                style: {
                    color: '#808080'
                }
            },*/
            labels: {
                align: 'right',
                x: -2,
                y: 5,
                useHTML: true,
                formatter: function() {
                    return "<span>" + this.value.toFixed(0) + "</span>"
                }
            },
            height: '68%',
            lineWidth: 1,
            style: {
                color: '#ffff11'
            },
            gridLineColor: '#cccccc',
            gridLineDashStyle: 'ShortDash'
        }, {
            opposite: false, //是否把它显示到另一边（右边）
            //showFirstLabel: true,
            //showLastLabel:true,
            labels: {
                enabled: false
            },
            top: '70%',
            height: '30%',
            offset: 0,
            lineWidth: 1,
            gridLineColor: '#dddddd'
        }],
        xAxis: {
            labels: {
                style: {
                    color: '#808080',
                    fontWight: 'normal'
                },
                formatter: function() {
                    var returnTime = Highcharts.dateFormat('%b/%e', this.value);
                    return returnTime;
                }
            },
            gridLineColor: '#606060',
            alternateGridColor: '',
            minorGridLineColor: '#dddddd',
            minorTickColor: '#dddddd',
            tickColor: '#dddddd'
        },
        series: [{
            type: 'candlestick',
            name: _Codesz,
            data: ohlc,
            dataGrouping: {
                units: groupingUnits
            }
        }, {
            type: 'column',
            name: '成交量',
            data: volume,
            yAxis: 1,
            dataGrouping: {
                units: groupingUnits
            }
        }]
    });
}
/**

    日内走势

    */
function market_ajax_zs(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/line/" + obj.code,
        data: {
            begin: 0,
            end: -1,
            select: 'time,price,volume'
        },
        jsonp: "callback",
        cache: false,
        success: function(resultData) {

            var dd = resultData;
            var d = dateConvert({
                data: dd,
                last: obj.last,
                open: obj.open
            });
            //var data = null;
            var data = d.line;
            //没数据时不显示图表
            if (data == null) {
                obj.id.css({
                    "border": "1px dotted #ccc"
                });
                obj.id.html("<span class='nal'>暂无走势信息</span>");
                return;
            }

            Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                lang: {
                    loading: "加载中",
                    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    noData: "没有数据",
                    numericSymbols: ["000", "百万手", "G", "T", "P", "E"],
                    printChart: "打印图表",
                    resetZoom: "恢复缩放",
                    resetZoomTitle: "恢复图表",
                    shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    thousandsSep: ",",
                    weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
                }
            });
            //初始化开------------------------
            var groupingUnits = [
                [
                    'minute', // unit name
                    [1] // allowed multiples
                ]
            ];
            var avg_pxyAxisMin; //Y轴最小值
            var avg_pxyAxisMax; //Y轴最大值 
            var percentageyAxisMin; //Y轴百分比最小
            var percentageyAxisMax; //Y轴百分比最大
            var volume_yAxisMin; //成交量最小
            var volume_yAxisMax; //成交量最大
            var red = "#ff0000";
            var blue = "#00a800";
            var price_trend = [],
                volume = [], //成交量
                i = 0;
            //图表上的成交量第一条的数据红绿的判断 是根据昨日的收盘价preclose_px 和今日的最新价last_px进行对比
            //同时获取的昨日收盘价  用于涨幅的计算
            var isFirstLineColorflag = true;
            //保存昨收数据
            var yesterdayClose;
            //容错判断
            if (data != undefined && data != null && data.length == 0) {
                try {
                    failCallback();
                } catch (e) {

                }
                return;
            }
            //今开
            var open_px = data[i][1];
            //昨收
            //var preclose_px=data[i][3];
            var preclose_px = d.prev_close;
            yesterdayClose = preclose_px;
            isFirstLineColorflag = open_px > preclose_px ? true : false;
            // split the data set into price_trend and volume
            //数据处理
            for (i; i < data.length; i += 1) {
                var _dates = data[i][0] + "";
                var _hours = _dates.substring(8, 10);
                var dateUTC = getDateUTCOrNot(_dates, true);
                var business_amount = data[i][2];
                var columnColor = red;
                if (i == 0) { //第一笔的 红绿柱 判断依据是根据 今天开盘价与昨日收盘价比较
                    if (isFirstLineColorflag == false) {
                        columnColor = blue;
                    }
                    avg_pxyAxisMin = data[i][1];
                    avg_pxyAxisMax = data[i][1];
                    percentageyAxisMin = Number(100 * (data[i][1] / yesterdayClose - 1));
                    percentageyAxisMax = Number(100 * (data[i][1] / yesterdayClose - 1));
                    volume_yAxisMin = data[i][2];
                    volume_yAxisMax = data[i][2];
                } else {
                    //除了第一笔，其它都是  返回的 last_px 与前一个对比
                    if (data[i - 1][1] - data[i][1] > 0) {
                        columnColor = blue;
                    }
                    business_amount = data[i][2] - data[i - 1][2];
                }
                avg_pxyAxisMin = avg_pxyAxisMin > data[i][1] ? data[i][1] : avg_pxyAxisMin;
                avg_pxyAxisMax = avg_pxyAxisMax > data[i][1] ? avg_pxyAxisMax : data[i][1];
                percentageyAxisMin = percentageyAxisMin > Number(100 * (data[i][1] / yesterdayClose - 1)) ? Number(100 * (data[i][1] / yesterdayClose - 1)) : percentageyAxisMin;
                percentageyAxisMax = percentageyAxisMax > Number(100 * (data[i][1] / yesterdayClose - 1)) ? percentageyAxisMax : Number(100 * (data[i][1] / yesterdayClose - 1));
                // = Math.min(_vol);
                //volume_yAxisMax=Math.max(_vol);
                //将数据放入 price_trend volume 数组中

                price_trend.push({
                    x: dateUTC,
                    y: Number(data[i][1])
                });
                volume.push({
                    x: dateUTC,
                    y: Number(data[i][2])
                });
            }

            //将剩下的时间信息补全
            appendTimeMessage(price_trend, volume, data);


            //11:30～13:01
            var date;
            if (data.length > 0) {
                date = data[data.length - 1][0] + "";
                var dArr = new Array();
                for (var hh = 0; hh < 5; hh++) {
                    var numb;
                    if (hh == 0) {
                        numb = Number(date.slice(0, 4));
                    } else {
                        numb = Number(date.slice((hh - 1) * 2 + 4, hh * 2 + 4));
                    }

                    dArr.push(numb);
                }
            }
            var last_dataTime = new Date(dArr[0], dArr[1] - 1, dArr[2], dArr[3], dArr[4]);
            var $reporting = $("#report");
            $reporting.html("");
            // Create the chart
            var am_startTime = new Date(last_dataTime);
            am_startTime.setHours(1, 30, 0, 0);
            var am_startTimeUTC = convertDateToUTC(am_startTime);
            var am_midTime = new Date(last_dataTime);
            am_midTime.setHours(2, 30, 0, 0);
            var am_midTimeUTC = convertDateToUTC(am_midTime);

            //股票交易早上最后的时间
            var am_lastTime = new Date(last_dataTime);
            am_lastTime.setHours(3, 30, 0, 0);
            var am_lastTimeUTC = convertDateToUTC(am_lastTime);

            //股票交易下午最后的时间
            var pm_startTime = new Date(last_dataTime);
            pm_startTime.setHours(5, 1, 0, 0);
            var pm_startTimeUTC = convertDateToUTC(pm_startTime);

            var pm_midTime = new Date(last_dataTime);
            pm_midTime.setHours(6, 0, 0, 0);
            var pm_midTimeUTC = convertDateToUTC(pm_midTime);

            var pm_lastTime = new Date(last_dataTime);
            pm_lastTime.setHours(7, 0, 0, 0);
            var pm_lastTimeUTC = convertDateToUTC(pm_lastTime);


            //----------------------------------------------------------
            // Create the chart
            obj.id.highcharts('StockChart', {
                chart: {
                    //关闭平移
                    panning: false,
                    zoomType: 'none',
                    pinchType: 'none',
                    renderTo: "line_map",
                    margin: [15, 48, 20, 62],
                    spacing: [0, 0, 0, 0],
                    plotBorderColor: '#3C94C4',
                    plotBorderWidth: 0, //边框
                    events: {
                        load: function() {
                            var chart = obj.id.highcharts(); // Highcharts构造函数
                            //基准线
                            chart.yAxis[0].addPlotLine({ //在x轴上增加
                                value: yesterdayClose, //在值为2的地方             //在x轴上增加
                                width: 2, //标示线的宽度为2px
                                color: '#CCC', //标示线的颜色
                                zIndex: 1,
                                id: 'plot-line-' //标示线的id，在删除该标示线的时候需要该id标示
                            });
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    valueDecinale: 2,
                    useHTML: true,
                    formatter: function() {
                        //var _name = this.points[1].series.name;
                        var _name = obj.codeName;
                        var _date = Highcharts.dateFormat('%b%e日,%A,%H:%M', this.x);
                        var _y = this.points[0].y.toFixed(2);
                        var _yy = this.points[2].y; //yy2
                        return '<p style="margin:0px;padding:0px;font-size:14px;"><span>' + _name + '   </span><span style="' + Comparative(_y, obj.prev_close) + ';">' + _y + '</span></p><p style="margin:0px;padding:0px;font-size:14px;"><span>' +
                            '成交量：  </span>' + ' <span>' + (_yy / 100).toFixed(0) + '</span></p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>';
                    }
                },
                plotOptions: {
                    series: {
                        /*关闭动画*/
                        animation: false
                    }
                },
                rangeSelector: {
                    enabled: false
                },
                /*导出配置*/
                exporting: {
                    enabled: false
                },
                /*创建者信息*/
                credits: {
                    enabled: false
                },
                /*下部时间拖拉选择*/
                navigator: {
                    enabled: false,
                    /*关闭时间选择*/
                    baseseries: 10
                },
                scrollbar: {
                    enabled: false /*关闭下方滚动条*/
                },
                /*底部滚动条*/
                scrollbar: {
                    enabled: false
                },

                xAxis: {
                    //type: 'datetime',
                    ordinal: false,
                    breaks: [{ // Nights
                        breakSize: 1,
                        from: am_lastTimeUTC,
                        to: pm_startTimeUTC
                    }],
                    //minRange: 14 * 24 * 36000, // fourteen days
                    showFirstLabel: true,
                    showLastLabel: true,
                    scrollbar: {
                        enabled: true
                    },
                    labels: {
                        // staggerLines:5
                        style: { //字体样式
                            font: 'normal 12px Verdana, sans-serif'
                        },
                        formatter: function() {
                            //var returnTime=Highcharts.dateFormat('%H:%M', this.value-Number(8 * 3600 * 1000));
                            var returnTime = Highcharts.dateFormat('%H:%M', this.value);
                            if (returnTime == "09:30") {
                                return '<span style="margin-left:25px;color:#aaa">09:30</span>';
                            }
                            if (returnTime == "11:30") {
                                return '<span style="color:#aaa">11:30/13:00</span>';
                            }
                            if (returnTime == "10:30") {
                                return "";
                            }
                            if (returnTime == "14:00") {
                                return "";
                            }
                            if (returnTime == "15:00") {
                                return '<span style="margin-right:25px;color:#aaa">15:00</span>';
                            }
                            return returnTime;

                        },
                        y: 15,
                        step: 1,
                        useHTML: true
                    },
                    tickLength: 5,
                    tickPositioner: function() {
                        var positions = [am_startTimeUTC, am_midTimeUTC, am_lastTimeUTC, pm_midTimeUTC, pm_lastTimeUTC];
                        //var positions = [am_startTimeUTC,  am_lastTimeUTC,pm_lastTimeUTC];
                        return positions;
                    },
                    gridLineDashStyle: 'ShortDash',
                    gridLineColor: '#f2f2f2',
                    gridLineWidth: 1
                },
                yAxis: [{
                        opposite: false, //是否把它显示到另一边（右边）
                        labels: {
                            align: 'right',
                            x: -2,
                            y: 5,
                            useHTML: true,
                            formatter: function() {
                                return "<span style=" + Comparative(this.value, obj.prev_close) + ">" + this.value + "</span>"
                            }
                        },
                        height: '72%',
                        lineWidth: 1,
                        showFirstLabel: true,
                        showLastLabel: true,
                        gridLineWidth: 0,
                        tickPositioner: function() { //以yesterdayClose为界限，统一间隔值，从 最小到最大步进
                            positions = [
                                (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(2), (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(2),
                                obj.prev_close.toFixed(2), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(2), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(2)
                            ];
                            return positions;
                        }
                    }, //y1
                    {
                        opposite: true, //是否把它显示到另一边（右边）
                        showFirstLabel: true,
                        showLastLabel: true,
                        labels: {
                            align: 'left',
                            x: 0,
                            y: 5,
                            useHTML: true,
                            formatter: function() {
                                return "<span style=" + Comparative(this.value, 0) + ">" + this.value + "%</span>"
                            }
                        },
                        lineWidth: 0,
                        top: '0%',
                        height: '72%',
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        tickPositioner: function() { //以yesterdayClose为界限，统一间隔值，从 最小到最大步进
                            positions = [
                                (((obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))) / obj.prev_close - 1) * 100).toFixed(2), (((obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2) / obj.prev_close - 1) * 100).toFixed(2),
                                '0.00', (((obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2) / obj.prev_close - 1) * 100).toFixed(2), (((obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))) / obj.prev_close - 1) * 100).toFixed(2)
                            ];
                            return positions;
                        }
                    }, {
                        labels: {
                            align: 'right',
                            x: -3,
                            y: 0,
                            style: {
                                color: '#666666'
                            }
                        },
                        showFirstLabel: false,
                        top: '75%',
                        height: '25%',
                        offset: 0,
                        lineWidth: 1,
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        opposite: false
                    }
                ],
                series: [{
                    name: obj.codeName,
                    data: price_trend,
                    yAxis: 0,
                    color: '#7cb5ec',
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    name: obj.codeName,
                    data: price_trend,
                    type: 'line',
                    cursor: 'pointer',
                    onSeries: 'candlestick',
                    color: 'transparent',
                    style: {
                        fontSize: '0px',
                        fontWeight: '0',
                        textAlign: 'center'
                    },
                    zIndex: -1000,
                    yAxis: 1,
                    fillColor: {
                        linearGradient: { //渐变方向
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    type: 'column',
                    name: '成交量',
                    data: volume,
                    //color:'#7cb5ec',
                    yAxis: 2,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    borderWidth: 0.1
                }]
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //返回错误信息
            //console.log("Ajax返回错误信息:"+XMLHttpRequest.status+"~"+XMLHttpRequest.readyState+"~"+textStatus);
        }
    });
}
/*
-----------------------------------------------------------首页-数据-行情信息-行情走势－基金------------------------------------------------------
*/
function market_snapAjax_jj(_codeS, _ins) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/snap/" + _codeS,
        jsonp: "callback",
        data: {
            select: 'name,last,chg_rate,change,amount,volume,open,prev_close,ask,bid,high,low,tradephase,cpxxextendname'
        },
        cache: false,
        success: function(resultData) {
            var _code = resultData.code;
            var pad01Arr = [];
            var pad02Arr = [];
            var pad03Arr = [];
            var _snap_val = resultData.snap;
            var _date = resultData.date + "";
            var _dDate = _date.substring(0, _date.length - 4) + "-" + _date.substring(_date.length - 4, _date.length - 2) + "-" + _date.substring(_date.length - 2);
            var _timer = resultData.time + "";
            var _dTime = _timer.substring(0, _timer.length - 4) + ":" + _timer.substring(_timer.length - 4, _timer.length - 2);
            var color;

            var _name = _snap_val[0]; //名称
            var _xj = _snap_val[1]; //现价
            var _zs = _snap_val[7]; //昨收
            var _zd = _snap_val[3].toFixed(3); //涨跌
            var _zdf = _snap_val[2].toFixed(2) + ''; //涨跌幅,有问题，应该在涨跌判断以后再取两位小数
            var _cje = _snap_val[4]; //成交额
            var _cjl = _snap_val[5]; //成交量
            var _mm5 = _snap_val[8]; //卖盘五档
            var _m5 = _snap_val[9]; //买盘五档
            var _high = _snap_val[10]; //最高价
            var _low = _snap_val[11]; //最低价
            var _open = _snap_val[6]; //开盘价
            var _tradephase = _snap_val[12];
            var _kwjc = _snap_val[13] ? _snap_val[13] : '-'; //扩位简称

            _cje = _cje / 10000;

            var classes;

            function zhangdie(y) {
                if (y > _snap_val[7]) {
                    classes = "col_red";
                } else if (y < _snap_val[7]) {
                    classes = "col_green";
                } else {
                    classes = "col_color";
                }
                return ("<span class='first_span " + classes + "''>" + y + "</span>")
            }

            if (_zs != _xj) {
                if (_zd > 0) {
                    _zd = "+" + _zd;
                    classes = "col_red";
                } else {
                    //_zdf = "-"+_zdf;
                    classes = "col_green";
                }
            } else {
                classs = "col_color";
            }
            pad01Arr.push("<table cellspacing='0' cellpadding='0'><tr class='first_tr'><td class='first_td'><h1>" + _code + "</h1></td><td class='last_td'><h1>" + _name +
                "</h1></td></tr>");
            if (_kwjc == '-') {
                $('.search_market_L_hq').removeClass('isJj');
                $('.js_jjkwjc').remove();
            } else {
                pad01Arr.push("<tr class='first_tr js_jjkwjc'><td colspan='2' class='first_td'><h1 style='text-align:right;' class=''>" + _kwjc + "</h1></td></tr>");
            }
            pad01Arr.push("<tr><td class='first_td' rowspan=2><h2>" + zhangdie(_xj.toFixed(3)) + "</h2></td><td class='last_td'><h3 class='" + classes + "'>" + _zd +
                "</h3></td></tr><tr><td class='last_td'><h3 class='" + classes + "'>" + _zdf + "%</h3></td></tr></table>");
            pad02Arr.push(
                "<ul class='mm5'><li>卖五" + zhangdie(_mm5[8].toFixed(3)) + "<span class='last_span'>" + Math.round(_mm5[9] / 100) +
                "</span></li><li>卖四" + zhangdie(_mm5[6].toFixed(3)) + "<span class='last_span'>" + Math.round(_mm5[7] / 100) +
                "</span></li><li>卖三" + zhangdie(_mm5[4].toFixed(3)) + "<span class='last_span'>" + Math.round(_mm5[5] / 100) +
                "</span></li><li>卖二" + zhangdie(_mm5[2].toFixed(3)) + "<span class='last_span'>" + Math.round(_mm5[3] / 100) +
                "</span></li><li class='last_li'>卖一" + zhangdie(_mm5[0].toFixed(3)) + "<span class='last_span'>" + Math.round(_mm5[1] / 100) + "</span></li></ul>" +
                "<ul class='m5'><li class='first_li'>买一" + zhangdie(_m5[0].toFixed(3)) + "<span class='last_span'>" + Math.round(_m5[1] / 100) +
                "</span></li><li>买二" + zhangdie(_m5[2].toFixed(3)) + "<span class='last_span'>" + Math.round(_m5[3] / 100) +
                "</span></li><li>买三" + zhangdie(_m5[4].toFixed(3)) + "<span class='last_span'>" + Math.round(_m5[5] / 100) +
                "</span></li><li>买四" + zhangdie(_m5[6].toFixed(3)) + "<span class='last_span'>" + Math.round(_m5[7] / 100) +
                "</span></li><li>买五" + zhangdie(_m5[8].toFixed(3)) + "<span class='last_span'>" + Math.round(_m5[9] / 100) + "</span></li></ul>"
            );
            pad03Arr.push(
                "<table><tr><td class='td_a'>昨收</td><td class='td_b' style='color:#999;'>" + _zs.toFixed(3) + "</td><td class='td_c'>最高</td><td class='td_d'>" + zhangdie(_high.toFixed(3)) +
                "</td></tr><tr><td class='td_a'>开盘</td><td class='td_b'>" + zhangdie(_open.toFixed(3)) + "</td><td class='td_c'>最低</td><td class='td_d'>" + zhangdie(_low.toFixed(3)) +
                "</td></tr><tr><td class='td_a' colspan='2'>成交量</td><td class='td_b' colspan='2' style='color:#999;'>" + (_cjl / 100).toFixed(0) +
                " 手</td></tr><tr><td class='td_a' colspan='2'>成交额</td><td class='td_b' colspan='2' style='color:#999;'>" + _cje.toFixed(0) + " 万元</td></tr>" +
                "<tr><td class='td_a'>时间</td><td class='td_b' colspan='3' style='color:#999;'>" + _dDate + " " + _dTime + "</td></tr>" +
                "<tr><td class='td_a' colspan='2'>交易状态</td><td class='td_b' colspan='2' style='color:#999;'>" + checkStatus(_tradephase) + "</td></tr></table>"
            );

            $("#pad01").html(pad01Arr.join(""));
            $("#pad02").html(pad02Arr.join(""));
            $("#pad03").html(pad03Arr.join(""));

            if (_ins) {
                if (resultData.snap.length < 1) {
                    $('#market_ticker').html('<center style="margin-top:45%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 40px;">暂无走势信息</span></center>');
                }
                if (_tradephase.replace(/\s/ig, '') == "P1") {
                    $('#market_ticker').html('<center style="margin-top:45%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 40px;">停牌中</span></center>');
                } else if (_tradephase.replace(/\s/ig, '') == "C1") {
                    $('#market_ticker').html('<center style="margin-top:45%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 40px;">集合竞价中</span></center>');
                } else {
                    if (checkBrowser()) {
                        market_ajax_jj({
                            id: $('#market_ticker'),
                            code: _code,
                            last: _xj,
                            codeName: _name,
                            open: _open,
                            high: _high,
                            low: _low,
                            prev_close: _zs
                        });
                    }
                }
            } else {
                if (checkBrowser()) {
                    kLinedaykAjax_jj(_code);
                }
            }
        }
    })
}

/**

    kline

    */

function kLinedaykAjax_jj(_codeS) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        // url: "http://www.hcharts.cn/datas/jsonp.php?filename=aapl-ohlcv.json",
        url: hq_queryUrl + "/v1/sh1/dayk/" + _codeS,
        jsonp: "callback",
        data: {
            select: 'date,open,high,low,close,volume',
            begin: -300,
            end: -1
        },
        cache: false,
        success: function(resultData) {
            //console.log(resultData.kline);
            kLineshow_jj(resultData);
        }
    });
}


function kLineshow_jj(data) {
    var _Codesz = data.code;
    data = data.kline;
    // split the data set into ohlc and volume
    var ohlc = [],
        volume = [],
        dataLength = data.length;

    for (i = 0; i < dataLength; i++) {
        var _dates = data[i][0];
        _dates = getDateUTCOrNot(_dates, true);
        ohlc.push([
            _dates, // the date
            data[i][1], // open
            data[i][2], // high
            data[i][3], // low
            data[i][4] // close
        ]);
        // console.log(ohlc);
        volume.push([
            _dates, // the date
            data[i][5] // the volume
        ])
    }

    // set the allowed units for data grouping
    var groupingUnits = [
        [
            'day', // unit name
            [1] // allowed multiples
        ]
    ];

    var originalDrawPoints = Highcharts.seriesTypes.column.prototype.drawPoints;
    Highcharts.seriesTypes.column.prototype.drawPoints = function() {
        var merge = Highcharts.merge,
            series = this,
            chart = this.chart,
            points = series.points,
            i = points.length;
        while (i--) {
            var candlePoint = chart.series[0].points[i];
            if (candlePoint.open != undefined && candlePoint.close != undefined) {
                var color = (candlePoint.open < candlePoint.close) ? '#DD2200' : '#33AA11';
                var seriesPointAttr = merge(series.pointAttr);
                seriesPointAttr[''].fill = color;
                seriesPointAttr.hover.fill = Highcharts.Color(color).brighten(0.3).get();
                seriesPointAttr.select.fill = color;
            } else {
                var seriesPointAttr = merge(series.pointAttr);
            }
            points[i].pointAttr = seriesPointAttr;
        }
        originalDrawPoints.call(this);
    }

    Highcharts.setOptions({
        global: {
            useUTC: false
        },
        lang: {
            loading: "加载中",
            months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            noData: "没有数据",
            numericSymbols: ["千", "兆", "G", "T", "P", "E"],
            printChart: "打印图表",
            resetZoom: "恢复缩放",
            resetZoomTitle: "恢复图表",
            shortMonths: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
            thousandsSep: ",",
            weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
            rangeSelectorZoom: "",
            rangeSelectorFrom: "",
            rangeSelectorTo: "至"
        }
    });
    $('#market_ticker').highcharts('StockChart', {
        chart: {
            margin: [15, 15, 25, 40],
            spacing: [0, 0, 15, 0],
            plotBorderColor: '#3C94C4',
            plotBorderWidth: 0, //边框
            backgroundColor: 0
        },
        tooltip: {
            valueDecinale: 2
        },
        plotOptions: {
            series: {
                animation: false
            },
            candlestick: {
                upColor: '#dd2200',
                upLineColor: '#dd2200',
                color: '#33aa11',
                lineColor: '#33aa11'
            }
        },
        rangeSelector: {
            /*时间段切换按钮*/
            //enabled: false,
            buttons: [{
                type: 'day',
                count: 100,
                text: '三月'
            }, {
                type: 'week',
                count: 26,
                text: '半年'
            }, {
                type: 'month',
                count: 12,
                text: '一年'
            }],
            inputBoxWidth: 90,
            inputDateFormat: '%Y-%b-%e',
            inputPosition: {
                x: -15,
                y: 15
            },
            selected: 0
        },
        navigator: {
            xAxis: {
                labels: {
                    enabled: false
                }
            },
            height: 40 //时间轴高度
        },
        scrollbar: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        yAxis: [{
            opposite: false, //是否把它显示到另一边（右边）
            showFirstLabel: true,
            showLastLabel: true,
            /*labels: {
                align: 'right',
                x: -5,
                style: {
                    color: '#808080'
                }
            },*/
            labels: {
                align: 'right',
                x: -2,
                y: 5,
                useHTML: true,
                formatter: function() {
                    return "<span>" + this.value.toFixed(3) + "</span>"
                }
            },
            height: '68%',
            lineWidth: 1,
            style: {
                color: '#ffff11'
            },
            gridLineColor: '#cccccc',
            gridLineDashStyle: 'ShortDash'
        }, {
            opposite: false, //是否把它显示到另一边（右边）
            //showFirstLabel: true,
            //showLastLabel:true,
            labels: {
                enabled: false
            },
            top: '70%',
            height: '30%',
            offset: 0,
            lineWidth: 1,
            gridLineColor: '#dddddd'
        }],
        xAxis: {
            labels: {
                style: {
                    color: '#808080',
                    fontWight: 'normal'
                },
                formatter: function() {
                    var returnTime = Highcharts.dateFormat('%b/%e', this.value);
                    return returnTime;
                }
            },
            gridLineColor: '#606060',
            alternateGridColor: '',
            minorGridLineColor: '#dddddd',
            minorTickColor: '#dddddd',
            tickColor: '#dddddd'
        },
        series: [{
            type: 'candlestick',
            name: _Codesz,
            data: ohlc,
            dataGrouping: {
                units: groupingUnits
            }
        }, {
            type: 'column',
            name: '成交量',
            data: volume,
            yAxis: 1,
            dataGrouping: {
                units: groupingUnits
            }
        }]
    });
}

/**

    日内走势

    */
function market_ajax_jj(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/line/" + obj.code,
        data: {
            begin: 0,
            end: -1,
            select: 'time,price,volume'
        },
        jsonp: "callback",
        cache: false,
        success: function(resultData) {
            var dd = resultData;
            var d = dateConvert({
                data: dd,
                last: obj.last,
                open: obj.open
            });
            //var data = null;
            var data = d.line;
            //没数据时不显示图表
            if (data == null) {
                obj.id.css({
                    "border": "1px dotted #ccc"
                });
                obj.id.html("<span class='nal'>暂无走势信息</span>");
                return;
            }

            Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                lang: {
                    loading: "加载中",
                    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    noData: "没有数据",
                    numericSymbols: ["千", "兆", "G", "T", "P", "E"],
                    printChart: "打印图表",
                    resetZoom: "恢复缩放",
                    resetZoomTitle: "恢复图表",
                    shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    thousandsSep: ",",
                    weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
                }
            });
            //初始化开------------------------
            var groupingUnits = [
                [
                    'minute', // unit name
                    [1] // allowed multiples
                ]
            ];
            var avg_pxyAxisMin; //Y轴最小值
            var avg_pxyAxisMax; //Y轴最大值 
            var percentageyAxisMin; //Y轴百分比最小
            var percentageyAxisMax; //Y轴百分比最大
            var volume_yAxisMin; //成交量最小
            var volume_yAxisMax; //成交量最大
            var red = "#ff0000";
            var blue = "#00a800";
            var price_trend = [],
                volume = [], //成交量
                i = 0;
            //图表上的成交量第一条的数据红绿的判断 是根据昨日的收盘价preclose_px 和今日的最新价last_px进行对比
            //同时获取的昨日收盘价  用于涨幅的计算
            var isFirstLineColorflag = true;
            //保存昨收数据
            var yesterdayClose;
            //容错判断
            if (data != undefined && data != null && data.length == 0) {
                try {
                    failCallback();
                } catch (e) {

                }
                return;
            }
            //今开
            var open_px = data[i][1];
            //昨收
            //var preclose_px=data[i][3];
            var preclose_px = d.prev_close;
            yesterdayClose = preclose_px;
            isFirstLineColorflag = open_px > preclose_px ? true : false;
            // split the data set into price_trend and volume
            //数据处理
            for (i; i < data.length; i += 1) {
                var _dates = data[i][0] + "";
                var _hours = _dates.substring(8, 10);
                var dateUTC = getDateUTCOrNot(_dates, true);
                var business_amount = data[i][2];
                var columnColor = red;
                if (i == 0) { //第一笔的 红绿柱 判断依据是根据 今天开盘价与昨日收盘价比较
                    if (isFirstLineColorflag == false) {
                        columnColor = blue;
                    }
                    avg_pxyAxisMin = data[i][1];
                    avg_pxyAxisMax = data[i][1];
                    percentageyAxisMin = Number(100 * (data[i][1] / yesterdayClose - 1));
                    percentageyAxisMax = Number(100 * (data[i][1] / yesterdayClose - 1));
                    volume_yAxisMin = data[i][2];
                    volume_yAxisMax = data[i][2];
                } else {
                    //除了第一笔，其它都是  返回的 last_px 与前一个对比
                    if (data[i - 1][1] - data[i][1] > 0) {
                        columnColor = blue;
                    }
                    business_amount = data[i][2] - data[i - 1][2];
                }
                avg_pxyAxisMin = avg_pxyAxisMin > data[i][1] ? data[i][1] : avg_pxyAxisMin;
                avg_pxyAxisMax = avg_pxyAxisMax > data[i][1] ? avg_pxyAxisMax : data[i][1];
                percentageyAxisMin = percentageyAxisMin > Number(100 * (data[i][1] / yesterdayClose - 1)) ? Number(100 * (data[i][1] / yesterdayClose - 1)) : percentageyAxisMin;
                percentageyAxisMax = percentageyAxisMax > Number(100 * (data[i][1] / yesterdayClose - 1)) ? percentageyAxisMax : Number(100 * (data[i][1] / yesterdayClose - 1));
                // = Math.min(_vol);
                //volume_yAxisMax=Math.max(_vol);
                //将数据放入 price_trend volume 数组中

                price_trend.push({
                    x: dateUTC,
                    y: Number(data[i][1])
                });
                volume.push({
                    x: dateUTC,
                    y: Number(data[i][2])
                });
            }

            //将剩下的时间信息补全
            appendTimeMessage(price_trend, volume, data);


            //11:30～13:01
            var date;
            if (data.length > 0) {
                date = data[data.length - 1][0] + "";
                var dArr = new Array();
                for (var hh = 0; hh < 5; hh++) {
                    var numb;
                    if (hh == 0) {
                        numb = Number(date.slice(0, 4));
                    } else {
                        numb = Number(date.slice((hh - 1) * 2 + 4, hh * 2 + 4));
                    }

                    dArr.push(numb);
                }
            }
            var last_dataTime = new Date(dArr[0], dArr[1] - 1, dArr[2], dArr[3], dArr[4]);
            var $reporting = $("#report");
            $reporting.html("");
            // Create the chart
            var am_startTime = new Date(last_dataTime);
            am_startTime.setHours(1, 30, 0, 0);
            var am_startTimeUTC = convertDateToUTC(am_startTime);
            var am_midTime = new Date(last_dataTime);
            am_midTime.setHours(2, 30, 0, 0);
            var am_midTimeUTC = convertDateToUTC(am_midTime);

            //股票交易早上最后的时间
            var am_lastTime = new Date(last_dataTime);
            am_lastTime.setHours(3, 30, 0, 0);
            var am_lastTimeUTC = convertDateToUTC(am_lastTime);

            //股票交易下午最后的时间
            var pm_startTime = new Date(last_dataTime);
            pm_startTime.setHours(5, 1, 0, 0);
            var pm_startTimeUTC = convertDateToUTC(pm_startTime);

            var pm_midTime = new Date(last_dataTime);
            pm_midTime.setHours(6, 0, 0, 0);
            var pm_midTimeUTC = convertDateToUTC(pm_midTime);

            var pm_lastTime = new Date(last_dataTime);
            pm_lastTime.setHours(7, 0, 0, 0);
            var pm_lastTimeUTC = convertDateToUTC(pm_lastTime);


            //----------------------------------------------------------
            // Create the chart
            obj.id.highcharts('StockChart', {
                chart: {
                    //关闭平移
                    panning: false,
                    zoomType: 'none',
                    pinchType: 'none',
                    renderTo: "line_map",
                    margin: [15, 48, 20, 45],
                    spacing: [0, 0, 0, 0],
                    plotBorderColor: '#3C94C4',
                    plotBorderWidth: 0, //边框
                    events: {
                        load: function() {
                            var chart = obj.id.highcharts(); // Highcharts构造函数
                            //基准线
                            chart.yAxis[0].addPlotLine({ //在x轴上增加
                                value: yesterdayClose, //在值为2的地方             //在x轴上增加
                                width: 2, //标示线的宽度为2px
                                color: '#CCC', //标示线的颜色
                                zIndex: 1,
                                id: 'plot-line-' //标示线的id，在删除该标示线的时候需要该id标示
                            });
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    valueDecinale: 2,
                    useHTML: true,
                    formatter: function() {
                        //var _name = this.points[1].series.name;
                        var _name = obj.codeName;
                        var _date = Highcharts.dateFormat('%b%e日,%A,%H:%M', this.x);
                        var _y = this.points[0].y.toFixed(3);
                        var _yy = this.points[2].y; //yy2
                        return '<p style="margin:0px;padding:0px;font-size:14px;"><span>' + _name + '   </span><span style="' + Comparative(_y, obj.prev_close) + ';">' + _y + '</span></p><p style="margin:0px;padding:0px;font-size:14px;"><span>' +
                            '成交量：  </span>' + ' <span>' + (_yy / 100).toFixed(0) + '</span></p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>';
                    }
                },
                plotOptions: {
                    series: {
                        /*关闭动画*/
                        animation: false
                    }
                },
                rangeSelector: {
                    enabled: false
                },
                /*导出配置*/
                exporting: {
                    enabled: false
                },
                /*创建者信息*/
                credits: {
                    enabled: false
                },
                /*下部时间拖拉选择*/
                navigator: {
                    enabled: false,
                    /*关闭时间选择*/
                    baseseries: 10
                },
                scrollbar: {
                    enabled: false /*关闭下方滚动条*/
                },
                /*底部滚动条*/
                scrollbar: {
                    enabled: false
                },

                xAxis: {
                    //type: 'datetime',
                    ordinal: false,
                    breaks: [{ // Nights
                        breakSize: 1,
                        from: am_lastTimeUTC,
                        to: pm_startTimeUTC
                    }],
                    //minRange: 14 * 24 * 36000, // fourteen days
                    showFirstLabel: true,
                    showLastLabel: true,
                    scrollbar: {
                        enabled: true
                    },
                    labels: {
                        // staggerLines:5
                        style: { //字体样式
                            font: 'normal 12px Verdana, sans-serif'
                        },
                        formatter: function() {
                            //var returnTime=Highcharts.dateFormat('%H:%M', this.value-Number(8 * 3600 * 1000));
                            var returnTime = Highcharts.dateFormat('%H:%M', this.value);
                            if (returnTime == "09:30") {
                                return '<span style="margin-left:25px;color:#aaa">09:30</span>';
                            }
                            if (returnTime == "11:30") {
                                return '<span style="color:#aaa">11:30/13:00</span>';
                            }
                            if (returnTime == "10:30") {
                                return "";
                            }
                            if (returnTime == "14:00") {
                                return "";
                            }
                            if (returnTime == "15:00") {
                                return '<span style="margin-right:25px;color:#aaa">15:00</span>';
                            }
                            return returnTime;

                        },
                        y: 15,
                        step: 1,
                        useHTML: true
                    },
                    tickLength: 5,
                    tickPositioner: function() {
                        var positions = [am_startTimeUTC, am_midTimeUTC, am_lastTimeUTC, pm_midTimeUTC, pm_lastTimeUTC];
                        //var positions = [am_startTimeUTC,  am_lastTimeUTC,pm_lastTimeUTC];
                        return positions;
                    },
                    gridLineDashStyle: 'ShortDash',
                    gridLineColor: '#f2f2f2',
                    gridLineWidth: 1
                },
                yAxis: [{
                        opposite: false, //是否把它显示到另一边（右边）
                        labels: {
                            align: 'right',
                            x: -2,
                            y: 5,
                            useHTML: true,
                            formatter: function() {
                                return "<span style=" + Comparative(this.value, obj.prev_close) + ">" + this.value + "</span>"
                            }
                        },
                        height: '72%',
                        lineWidth: 1,
                        showFirstLabel: true,
                        showLastLabel: true,
                        gridLineWidth: 0,
                        tickPositioner: function() { //以yesterdayClose为界限，统一间隔值，从 最小到最大步进
                            positions = [
                                (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(3), (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(3),
                                obj.prev_close.toFixed(3), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(3), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(3)
                            ];
                            return positions;
                        }
                    }, //y1
                    {
                        opposite: true, //是否把它显示到另一边（右边）
                        showFirstLabel: true,
                        showLastLabel: true,
                        labels: {
                            align: 'left',
                            x: 0,
                            y: 5,
                            useHTML: true,
                            formatter: function() {
                                return "<span style=" + Comparative(this.value, 0) + ">" + this.value + "%</span>"
                            }
                        },
                        lineWidth: 0,
                        top: '0%',
                        height: '72%',
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        tickPositioner: function() { //以yesterdayClose为界限，统一间隔值，从 最小到最大步进
                            positions = [
                                (((obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))) / obj.prev_close - 1) * 100).toFixed(2), (((obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2) / obj.prev_close - 1) * 100).toFixed(2),
                                '0.00', (((obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2) / obj.prev_close - 1) * 100).toFixed(2), (((obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))) / obj.prev_close - 1) * 100).toFixed(2)
                            ];
                            return positions;
                        }
                    }, {
                        labels: {
                            align: 'right',
                            x: -3,
                            y: 0,
                            style: {
                                color: '#666666'
                            }
                        },
                        showFirstLabel: false,
                        top: '75%',
                        height: '25%',
                        offset: 0,
                        lineWidth: 1,
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        opposite: false
                    }
                ],
                series: [{
                    name: obj.codeName,
                    data: price_trend,
                    yAxis: 0,
                    color: '#7cb5ec',
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    name: obj.codeName,
                    data: price_trend,
                    type: 'line',
                    cursor: 'pointer',
                    onSeries: 'candlestick',
                    color: 'transparent',
                    style: {
                        fontSize: '0px',
                        fontWeight: '0',
                        textAlign: 'center'
                    },
                    zIndex: -1000,
                    yAxis: 1,
                    fillColor: {
                        linearGradient: { //渐变方向
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    type: 'column',
                    name: '成交量',
                    data: volume,
                    //color:'#7cb5ec',
                    yAxis: 2,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    borderWidth: 0.1
                }]
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //返回错误信息
            //console.log("Ajax返回错误信息:"+XMLHttpRequest.status+"~"+XMLHttpRequest.readyState+"~"+textStatus);
        }
    });
}
/*
-----------------------------------------------------------首页-数据-行情信息-行情走势－债券------------------------------------------------------
*/
function market_snapAjax_zq(_codeS, _ins) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/snap/" + _codeS,
        jsonp: "callback",
        data: {
            select: 'name,last,chg_rate,change,amount,volume,open,prev_close,ask,bid,high,low,tradephase'
        },
        cache: false,
        success: function(resultData) {
            var _code = resultData.code;
            var pad01Arr = [];
            var pad02Arr = [];
            var pad03Arr = [];
            var _snap_val = resultData.snap;
            var _date = resultData.date + "";
            var _dDate = _date.substring(0, _date.length - 4) + "-" + _date.substring(_date.length - 4, _date.length - 2) + "-" + _date.substring(_date.length - 2);
            var _timer = resultData.time + "";
            var _dTime = _timer.substring(0, _timer.length - 4) + ":" + _timer.substring(_timer.length - 4, _timer.length - 2);
            var color;

            var _name = _snap_val[0]; //名称
            var _xj = _snap_val[1]; //现价
            var _zs = _snap_val[7]; //昨收
            var _zd = _snap_val[3].toFixed(2); //涨跌
            var _zdf = _snap_val[2].toFixed(2) + ''; //涨跌幅,有问题，应该在涨跌判断以后再取两位小数
            var _cje = _snap_val[4]; //成交额
            var _cjl = _snap_val[5]; //成交量
            var _mm5 = _snap_val[8]; //卖盘五档
            var _m5 = _snap_val[9]; //买盘五档
            var _high = _snap_val[10]; //最高价
            var _low = _snap_val[11]; //最低价
            var _open = _snap_val[6]; //开盘价
            var _tradephase = _snap_val[12];
            _cje = _cje / 10000;

            var classes;

            function zhangdie(y) {
                if (y > _snap_val[7]) {
                    classes = "col_red";
                } else if (y < _snap_val[7]) {
                    classes = "col_green";
                } else {
                    classes = "col_color";
                }
                return ("<span class='first_span " + classes + "''>" + y + "</span>")
            }

            if (_zs != _xj) {
                if (_zd > 0) {
                    _zd = "+" + _zd;
                    classes = "col_red";
                } else {
                    //_zdf = "-"+_zdf;
                    classes = "col_green";
                }
            } else {
                classs = "col_color";
            }
            pad01Arr.push("<table cellspacing='0' cellpadding='0'><tr class='first_tr'><td class='first_td'><h1>" + _code + "</h1></td><td class='last_td'><h1>" + _name +
                "</h1></td></tr><tr><td class='first_td' rowspan=2><h2>" + zhangdie(_xj.toFixed(2)) + "</h2></td><td class='last_td'><h3 class='" + classes + "'>" + _zd +
                "</h3></td></tr><tr><td class='last_td'><h3 class='" + classes + "'>" + _zdf + "%</h3></td></tr></table>");
            pad02Arr.push(
                "<ul class='mm5'><li>卖五" + zhangdie(_mm5[8].toFixed(2)) + "<span class='last_span'>" + _mm5[9] +
                "</span></li><li>卖四" + zhangdie(_mm5[6].toFixed(2)) + "<span class='last_span'>" + _mm5[7] +
                "</span></li><li>卖三" + zhangdie(_mm5[4].toFixed(2)) + "<span class='last_span'>" + _mm5[5] +
                "</span></li><li>卖二" + zhangdie(_mm5[2].toFixed(2)) + "<span class='last_span'>" + _mm5[3] +
                "</span></li><li class='last_li'>卖一" + zhangdie(_mm5[0].toFixed(2)) + "<span class='last_span'>" + _mm5[1] + "</span></li></ul>" +
                "<ul class='m5'><li class='first_li'>买一" + zhangdie(_m5[0].toFixed(2)) + "<span class='last_span'>" + _m5[1] +
                "</span></li><li>买二" + zhangdie(_m5[2].toFixed(2)) + "<span class='last_span'>" + _m5[3] +
                "</span></li><li>买三" + zhangdie(_m5[4].toFixed(2)) + "<span class='last_span'>" + _m5[5] +
                "</span></li><li>买四" + zhangdie(_m5[6].toFixed(2)) + "<span class='last_span'>" + _m5[7] +
                "</span></li><li>买五" + zhangdie(_m5[8].toFixed(2)) + "<span class='last_span'>" + _m5[9] + "</span></li></ul>"
            );
            pad03Arr.push(
                "<table><tr><td class='td_a'>昨收</td><td class='td_b' style='color:#999;'>" + _zs.toFixed(2) + "</td><td class='td_c'>最高</td><td class='td_d'>" + zhangdie(_high.toFixed(2)) +
                "</td></tr><tr><td class='td_a'>开盘</td><td class='td_b'>" + zhangdie(_open.toFixed(2)) + "</td><td class='td_c'>最低</td><td class='td_d'>" + zhangdie(_low.toFixed(2)) +
                "</td></tr><tr><td class='td_a' colspan='2'>成交量</td><td class='td_b' colspan='2' style='color:#999;'>" + _cjl.toFixed(0) +
                " 手</td></tr><tr><td class='td_a' colspan='2'>成交额</td><td class='td_b' colspan='2' style='color:#999;'>" + _cje.toFixed(0) + " 万元</td></tr>" +
                "<tr><td class='td_a'>时间</td><td class='td_b' colspan='3' style='color:#999;'>" + _dDate + " " + _dTime + "</td></tr>" +
                "<tr><td class='td_a' colspan='2'>交易状态</td><td class='td_b' colspan='2' style='color:#999;'>" + checkStatus(_tradephase) + "</td></tr></table>"
            );
            $("#pad01").html(pad01Arr.join(""));
            $("#pad02").html(pad02Arr.join(""));
            $("#pad03").html(pad03Arr.join(""));

            if (_ins) {
                if (resultData.snap.length < 1) {
                    $('#market_ticker').html('<center style="margin-top:45%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 40px;">暂无走势信息</span></center>');
                }
                if (_tradephase.replace(/\s/ig, '') == "P1") {
                    $('#market_ticker').html('<center style="margin-top:45%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 40px;">停牌中</span></center>');
                } else if (_tradephase.replace(/\s/ig, '') == "C1") {
                    $('#market_ticker').html('<center style="margin-top:45%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 40px;">集合竞价中</span></center>');
                } else {
                    if (checkBrowser()) {
                        market_ajax_zq({
                            id: $('#market_ticker'),
                            code: _code,
                            last: _xj,
                            codeName: _name,
                            open: _open,
                            high: _high,
                            low: _low,
                            prev_close: _zs
                        });
                    }
                }
            } else {
                if (checkBrowser()) {
                    kLinedaykAjax_zq(_code);
                }
            }
        }
    })
}

/**

    kline

    */

function kLinedaykAjax_zq(_codeS) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        // url: "http://www.hcharts.cn/datas/jsonp.php?filename=aapl-ohlcv.json",
        url: hq_queryUrl + "/v1/sh1/dayk/" + _codeS,
        jsonp: "callback",
        data: {
            select: 'date,open,high,low,close,volume',
            begin: -300,
            end: -1
        },
        cache: false,
        success: function(resultData) {
            //console.log(resultData.kline);
            kLineshow_zq(resultData);
        }
    });
}


function kLineshow_zq(data) {
    var _Codesz = data.code;
    data = data.kline;
    // split the data set into ohlc and volume
    var ohlc = [],
        volume = [],
        dataLength = data.length;

    for (i = 0; i < dataLength; i++) {
        var _dates = data[i][0];
        _dates = getDateUTCOrNot(_dates, true);
        ohlc.push([
            _dates, // the date
            data[i][1], // open
            data[i][2], // high
            data[i][3], // low
            data[i][4] // close
        ]);
        // console.log(ohlc);
        volume.push([
            _dates, // the date
            data[i][5] // the volume
        ])
    }

    // set the allowed units for data grouping
    var groupingUnits = [
        [
            'day', // unit name
            [1] // allowed multiples
        ]
    ];

    var originalDrawPoints = Highcharts.seriesTypes.column.prototype.drawPoints;
    Highcharts.seriesTypes.column.prototype.drawPoints = function() {
        var merge = Highcharts.merge,
            series = this,
            chart = this.chart,
            points = series.points,
            i = points.length;
        while (i--) {
            var candlePoint = chart.series[0].points[i];
            if (candlePoint.open != undefined && candlePoint.close != undefined) {
                var color = (candlePoint.open < candlePoint.close) ? '#DD2200' : '#33AA11';
                var seriesPointAttr = merge(series.pointAttr);
                seriesPointAttr[''].fill = color;
                seriesPointAttr.hover.fill = Highcharts.Color(color).brighten(0.3).get();
                seriesPointAttr.select.fill = color;
            } else {
                var seriesPointAttr = merge(series.pointAttr);
            }
            points[i].pointAttr = seriesPointAttr;
        }
        originalDrawPoints.call(this);
    }

    Highcharts.setOptions({
        global: {
            useUTC: false
        },
        lang: {
            loading: "加载中",
            months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            noData: "没有数据",
            numericSymbols: ["千", "兆", "G", "T", "P", "E"],
            printChart: "打印图表",
            resetZoom: "恢复缩放",
            resetZoomTitle: "恢复图表",
            shortMonths: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
            thousandsSep: ",",
            weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
            rangeSelectorZoom: "",
            rangeSelectorFrom: "",
            rangeSelectorTo: "至"
        }
    });
    $('#market_ticker').highcharts('StockChart', {
        chart: {
            margin: [15, 15, 25, 48],
            spacing: [0, 0, 15, 0],
            plotBorderColor: '#3C94C4',
            plotBorderWidth: 0, //边框
            backgroundColor: 0
        },
        tooltip: {
            valueDecinale: 2
        },
        plotOptions: {
            series: {
                animation: false
            },
            candlestick: {
                upColor: '#dd2200',
                upLineColor: '#dd2200',
                color: '#33aa11',
                lineColor: '#33aa11'
            }
        },
        rangeSelector: {
            /*时间段切换按钮*/
            //enabled: false,
            buttons: [{
                type: 'day',
                count: 100,
                text: '三月'
            }, {
                type: 'week',
                count: 26,
                text: '半年'
            }, {
                type: 'month',
                count: 12,
                text: '一年'
            }],
            inputBoxWidth: 90,
            inputDateFormat: '%Y-%b-%e',
            inputPosition: {
                x: -15,
                y: 15
            },
            selected: 0
        },
        navigator: {
            xAxis: {
                labels: {
                    enabled: false
                }
            },
            height: 40 //时间轴高度
        },
        scrollbar: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        yAxis: [{
            opposite: false, //是否把它显示到另一边（右边）
            showFirstLabel: true,
            showLastLabel: true,
            /*labels: {
                align: 'right',
                x: -5,
                style: {
                    color: '#808080'
                }
            },*/
            labels: {
                align: 'right',
                x: -2,
                y: 5,
                useHTML: true,
                formatter: function() {
                    return "<span>" + this.value.toFixed(2) + "</span>"
                }
            },
            height: '68%',
            lineWidth: 1,
            style: {
                color: '#ffff11'
            },
            gridLineColor: '#cccccc',
            gridLineDashStyle: 'ShortDash'
        }, {
            opposite: false, //是否把它显示到另一边（右边）
            //showFirstLabel: true,
            //showLastLabel:true,
            labels: {
                enabled: false
            },
            top: '70%',
            height: '30%',
            offset: 0,
            lineWidth: 1,
            gridLineColor: '#dddddd'
        }],
        xAxis: {
            labels: {
                style: {
                    color: '#808080',
                    fontWight: 'normal'
                },
                formatter: function() {
                    var returnTime = Highcharts.dateFormat('%b/%e', this.value);
                    return returnTime;
                }
            },
            gridLineColor: '#606060',
            alternateGridColor: '',
            minorGridLineColor: '#dddddd',
            minorTickColor: '#dddddd',
            tickColor: '#dddddd'
        },
        series: [{
            type: 'candlestick',
            name: _Codesz,
            data: ohlc,
            dataGrouping: {
                units: groupingUnits
            }
        }, {
            type: 'column',
            name: '成交量',
            data: volume,
            yAxis: 1,
            dataGrouping: {
                units: groupingUnits
            }
        }]
    });
}

/**

    日内走势

    */
function market_ajax_zq(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/line/" + obj.code,
        data: {
            begin: 0,
            end: -1,
            select: 'time,price,volume'
        },
        jsonp: "callback",
        cache: false,
        success: function(resultData) {
            var dd = resultData;
            var d = dateConvert({
                data: dd,
                last: obj.last,
                open: obj.open
            });
            //var data = null;
            var data = d.line;
            //没数据时不显示图表
            if (data == null) {
                obj.id.css({
                    "border": "1px dotted #ccc"
                });
                obj.id.html("<span class='nal'>暂无走势信息</span>");
                return;
            }

            Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                lang: {
                    loading: "加载中",
                    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    noData: "没有数据",
                    numericSymbols: ["千", "兆", "G", "T", "P", "E"],
                    printChart: "打印图表",
                    resetZoom: "恢复缩放",
                    resetZoomTitle: "恢复图表",
                    shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    thousandsSep: ",",
                    weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
                }
            });
            //初始化开------------------------
            var groupingUnits = [
                [
                    'minute', // unit name
                    [1] // allowed multiples
                ]
            ];
            var avg_pxyAxisMin; //Y轴最小值
            var avg_pxyAxisMax; //Y轴最大值 
            var percentageyAxisMin; //Y轴百分比最小
            var percentageyAxisMax; //Y轴百分比最大
            var volume_yAxisMin; //成交量最小
            var volume_yAxisMax; //成交量最大
            var red = "#ff0000";
            var blue = "#00a800";
            var price_trend = [],
                volume = [], //成交量
                i = 0;
            //图表上的成交量第一条的数据红绿的判断 是根据昨日的收盘价preclose_px 和今日的最新价last_px进行对比
            //同时获取的昨日收盘价  用于涨幅的计算
            var isFirstLineColorflag = true;
            //保存昨收数据
            var yesterdayClose;
            //容错判断
            if (data != undefined && data != null && data.length == 0) {
                try {
                    failCallback();
                } catch (e) {

                }
                return;
            }
            //今开
            var open_px = data[i][1];
            //昨收
            //var preclose_px=data[i][3];
            var preclose_px = d.prev_close;
            yesterdayClose = preclose_px;
            isFirstLineColorflag = open_px > preclose_px ? true : false;
            // split the data set into price_trend and volume
            //数据处理
            for (i; i < data.length; i += 1) {
                var _dates = data[i][0] + "";
                var _hours = _dates.substring(8, 10);
                var dateUTC = getDateUTCOrNot(_dates, true);
                var business_amount = data[i][2];
                var columnColor = red;
                if (i == 0) { //第一笔的 红绿柱 判断依据是根据 今天开盘价与昨日收盘价比较
                    if (isFirstLineColorflag == false) {
                        columnColor = blue;
                    }
                    avg_pxyAxisMin = data[i][1];
                    avg_pxyAxisMax = data[i][1];
                    percentageyAxisMin = Number(100 * (data[i][1] / yesterdayClose - 1));
                    percentageyAxisMax = Number(100 * (data[i][1] / yesterdayClose - 1));
                    volume_yAxisMin = data[i][2];
                    volume_yAxisMax = data[i][2];
                } else {
                    //除了第一笔，其它都是  返回的 last_px 与前一个对比
                    if (data[i - 1][1] - data[i][1] > 0) {
                        columnColor = blue;
                    }
                    business_amount = data[i][2] - data[i - 1][2];
                }
                avg_pxyAxisMin = avg_pxyAxisMin > data[i][1] ? data[i][1] : avg_pxyAxisMin;
                avg_pxyAxisMax = avg_pxyAxisMax > data[i][1] ? avg_pxyAxisMax : data[i][1];
                percentageyAxisMin = percentageyAxisMin > Number(100 * (data[i][1] / yesterdayClose - 1)) ? Number(100 * (data[i][1] / yesterdayClose - 1)) : percentageyAxisMin;
                percentageyAxisMax = percentageyAxisMax > Number(100 * (data[i][1] / yesterdayClose - 1)) ? percentageyAxisMax : Number(100 * (data[i][1] / yesterdayClose - 1));
                // = Math.min(_vol);
                //volume_yAxisMax=Math.max(_vol);
                //将数据放入 price_trend volume 数组中

                price_trend.push({
                    x: dateUTC,
                    y: Number(data[i][1])
                });
                volume.push({
                    x: dateUTC,
                    y: Number(data[i][2])
                });
            }

            //将剩下的时间信息补全
            appendTimeMessage(price_trend, volume, data);


            //11:30～13:01
            var date;
            if (data.length > 0) {
                date = data[data.length - 1][0] + "";
                var dArr = new Array();
                for (var hh = 0; hh < 5; hh++) {
                    var numb;
                    if (hh == 0) {
                        numb = Number(date.slice(0, 4));
                    } else {
                        numb = Number(date.slice((hh - 1) * 2 + 4, hh * 2 + 4));
                    }

                    dArr.push(numb);
                }
            }
            var last_dataTime = new Date(dArr[0], dArr[1] - 1, dArr[2], dArr[3], dArr[4]);
            var $reporting = $("#report");
            $reporting.html("");
            // Create the chart
            var am_startTime = new Date(last_dataTime);
            am_startTime.setHours(1, 30, 0, 0);
            var am_startTimeUTC = convertDateToUTC(am_startTime);
            var am_midTime = new Date(last_dataTime);
            am_midTime.setHours(2, 30, 0, 0);
            var am_midTimeUTC = convertDateToUTC(am_midTime);

            //股票交易早上最后的时间
            var am_lastTime = new Date(last_dataTime);
            am_lastTime.setHours(3, 30, 0, 0);
            var am_lastTimeUTC = convertDateToUTC(am_lastTime);

            //股票交易下午最后的时间
            var pm_startTime = new Date(last_dataTime);
            pm_startTime.setHours(5, 1, 0, 0);
            var pm_startTimeUTC = convertDateToUTC(pm_startTime);

            var pm_midTime = new Date(last_dataTime);
            pm_midTime.setHours(6, 0, 0, 0);
            var pm_midTimeUTC = convertDateToUTC(pm_midTime);

            var pm_lastTime = new Date(last_dataTime);
            pm_lastTime.setHours(7, 0, 0, 0);
            var pm_lastTimeUTC = convertDateToUTC(pm_lastTime);


            //----------------------------------------------------------
            // Create the chart
            obj.id.highcharts('StockChart', {
                chart: {
                    //关闭平移
                    panning: false,
                    zoomType: 'none',
                    pinchType: 'none',
                    renderTo: "line_map",
                    margin: [15, 48, 20, 55],
                    spacing: [0, 0, 0, 0],
                    plotBorderColor: '#3C94C4',
                    plotBorderWidth: 0, //边框
                    events: {
                        load: function() {
                            var chart = obj.id.highcharts(); // Highcharts构造函数
                            //基准线
                            chart.yAxis[0].addPlotLine({ //在x轴上增加
                                value: yesterdayClose, //在值为2的地方             //在x轴上增加
                                width: 2, //标示线的宽度为2px
                                color: '#CCC', //标示线的颜色
                                zIndex: 1,
                                id: 'plot-line-' //标示线的id，在删除该标示线的时候需要该id标示
                            });
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    valueDecinale: 2,
                    useHTML: true,
                    formatter: function() {
                        //var _name = this.points[1].series.name;
                        var _name = obj.codeName;
                        var _date = Highcharts.dateFormat('%b%e日,%A,%H:%M', this.x);
                        var _y = this.points[0].y.toFixed(2);
                        var _yy = this.points[2].y; //yy2
                        return '<p style="margin:0px;padding:0px;font-size:14px;"><span>' + _name + '   </span><span style="' + Comparative(_y, obj.prev_close) + ';">' + _y + '</span></p><p style="margin:0px;padding:0px;font-size:14px;"><span>' +
                            '成交量：  </span>' + ' <span>' + (_yy / 100).toFixed(0) + '</span></p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>';
                    }
                },
                plotOptions: {
                    series: {
                        /*关闭动画*/
                        animation: false
                    }
                },
                rangeSelector: {
                    enabled: false
                },
                /*导出配置*/
                exporting: {
                    enabled: false
                },
                /*创建者信息*/
                credits: {
                    enabled: false
                },
                /*下部时间拖拉选择*/
                navigator: {
                    enabled: false,
                    /*关闭时间选择*/
                    baseseries: 10
                },
                scrollbar: {
                    enabled: false /*关闭下方滚动条*/
                },
                /*底部滚动条*/
                scrollbar: {
                    enabled: false
                },

                xAxis: {
                    //type: 'datetime',
                    ordinal: false,
                    breaks: [{ // Nights
                        breakSize: 1,
                        from: am_lastTimeUTC,
                        to: pm_startTimeUTC
                    }],
                    //minRange: 14 * 24 * 36000, // fourteen days
                    showFirstLabel: true,
                    showLastLabel: true,
                    scrollbar: {
                        enabled: true
                    },
                    labels: {
                        // staggerLines:5
                        style: { //字体样式
                            font: 'normal 12px Verdana, sans-serif'
                        },
                        formatter: function() {
                            //var returnTime=Highcharts.dateFormat('%H:%M', this.value-Number(8 * 3600 * 1000));
                            var returnTime = Highcharts.dateFormat('%H:%M', this.value);
                            if (returnTime == "09:30") {
                                return '<span style="margin-left:25px;color:#aaa">09:30</span>';
                            }
                            if (returnTime == "11:30") {
                                return '<span style="color:#aaa">11:30/13:00</span>';
                            }
                            if (returnTime == "10:30") {
                                return "";
                            }
                            if (returnTime == "14:00") {
                                return "";
                            }
                            if (returnTime == "15:00") {
                                return '<span style="margin-right:25px;color:#aaa">15:00</span>';
                            }
                            return returnTime;

                        },
                        y: 15,
                        step: 1,
                        useHTML: true
                    },
                    tickLength: 5,
                    tickPositioner: function() {
                        var positions = [am_startTimeUTC, am_midTimeUTC, am_lastTimeUTC, pm_midTimeUTC, pm_lastTimeUTC];
                        //var positions = [am_startTimeUTC,  am_lastTimeUTC,pm_lastTimeUTC];
                        return positions;
                    },
                    gridLineDashStyle: 'ShortDash',
                    gridLineColor: '#f2f2f2',
                    gridLineWidth: 1
                },
                yAxis: [{
                        opposite: false, //是否把它显示到另一边（右边）
                        labels: {
                            align: 'right',
                            x: -2,
                            y: 5,
                            useHTML: true,
                            formatter: function() {
                                return "<span style=" + Comparative(this.value, obj.prev_close) + ">" + this.value + "</span>"
                            }
                        },
                        height: '72%',
                        lineWidth: 1,
                        showFirstLabel: true,
                        showLastLabel: true,
                        gridLineWidth: 0,
                        tickPositioner: function() { //以yesterdayClose为界限，统一间隔值，从 最小到最大步进
                            positions = [
                                (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(2), (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(2),
                                obj.prev_close.toFixed(2), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(2), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(2)
                            ];
                            return positions;
                        }
                    }, //y1
                    {
                        opposite: true, //是否把它显示到另一边（右边）
                        showFirstLabel: true,
                        showLastLabel: true,
                        labels: {
                            align: 'left',
                            x: 0,
                            y: 5,
                            useHTML: true,
                            formatter: function() {
                                return "<span style=" + Comparative(this.value, 0) + ">" + this.value + "%</span>"
                            }
                        },
                        lineWidth: 0,
                        top: '0%',
                        height: '72%',
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        tickPositioner: function() { //以yesterdayClose为界限，统一间隔值，从 最小到最大步进
                            positions = [
                                (((obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))) / obj.prev_close - 1) * 100).toFixed(2), (((obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2) / obj.prev_close - 1) * 100).toFixed(2),
                                '0.00', (((obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2) / obj.prev_close - 1) * 100).toFixed(2), (((obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))) / obj.prev_close - 1) * 100).toFixed(2)
                            ];
                            return positions;
                        }
                    }, {
                        labels: {
                            align: 'right',
                            x: -3,
                            y: 0,
                            style: {
                                color: '#666666'
                            },
                            enabled: false
                        },
                        showFirstLabel: false,
                        top: '75%',
                        height: '25%',
                        offset: 0,
                        lineWidth: 1,
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        opposite: false
                    }
                ],
                series: [{
                    name: obj.codeName,
                    data: price_trend,
                    yAxis: 0,
                    color: '#7cb5ec',
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    name: obj.codeName,
                    data: price_trend,
                    type: 'line',
                    cursor: 'pointer',
                    onSeries: 'candlestick',
                    color: 'transparent',
                    style: {
                        fontSize: '0px',
                        fontWeight: '0',
                        textAlign: 'center'
                    },
                    zIndex: -1000,
                    yAxis: 1,
                    fillColor: {
                        linearGradient: { //渐变方向
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    type: 'column',
                    name: '成交量',
                    data: volume,
                    //color:'#7cb5ec',
                    yAxis: 2,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    borderWidth: 0.1
                }]
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //返回错误信息
            //console.log("Ajax返回错误信息:"+XMLHttpRequest.status+"~"+XMLHttpRequest.readyState+"~"+textStatus);
        }
    });
}

/*
-----------------------------------------------------------首页-数据-行情信息-行情走势－回购------------------------------------------------------
*/
function market_snapAjax_hg(_codeS, _ins) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/snap/" + _codeS,
        jsonp: "callback",
        data: {
            select: 'name,last,chg_rate,change,amount,volume,open,prev_close,ask,bid,high,low,tradephase'
        },
        cache: false,
        success: function(resultData) {
            var _code = resultData.code;
            var pad01Arr = [];
            var pad02Arr = [];
            var pad03Arr = [];
            var _snap_val = resultData.snap;
            var _date = resultData.date + "";
            var _dDate = _date.substring(0, _date.length - 4) + "-" + _date.substring(_date.length - 4, _date.length - 2) + "-" + _date.substring(_date.length - 2);
            var _timer = resultData.time + "";
            var _dTime = _timer.substring(0, _timer.length - 4) + ":" + _timer.substring(_timer.length - 4, _timer.length - 2);
            var color;

            var _name = _snap_val[0]; //名称
            var _xj = _snap_val[1]; //现价
            var _zs = _snap_val[7]; //昨收
            var _zd = _snap_val[3].toFixed(3); //涨跌
            var _zdf = _snap_val[2].toFixed(2) + ''; //涨跌幅,有问题，应该在涨跌判断以后再取两位小数
            var _cje = _snap_val[4]; //成交额
            var _cjl = _snap_val[5]; //成交量
            var _mm5 = _snap_val[8]; //卖盘五档
            var _m5 = _snap_val[9]; //买盘五档
            var _high = _snap_val[10]; //最高价
            var _low = _snap_val[11]; //最低价
            var _open = _snap_val[6]; //开盘价
            var _tradephase = _snap_val[12];
            _cje = _cje / 10000;

            var classes;

            function zhangdie(y) {
                if (y > _snap_val[7]) {
                    classes = "col_red";
                } else if (y < _snap_val[7]) {
                    classes = "col_green";
                } else {
                    classes = "col_color";
                }
                return ("<span class='first_span " + classes + "''>" + y + "</span>")
            }

            if (_zs != _xj) {
                if (_zd > 0) {
                    _zd = "+" + _zd;
                    classes = "col_red";
                } else {
                    //_zdf = "-"+_zdf;
                    classes = "col_green";
                }
            } else {
                classs = "col_color";
            }
            // pad01Arr.push("<table cellspacing='0' cellpadding='0'><tr class='first_tr'><td class='first_td'><h1>" + _code + "</h1></td><td class='last_td'><h1>" + _name +
            //     "</h1></td></tr><tr><td class='first_td' rowspan=2><h2>" + zhangdie(_xj.toFixed(3)) + "</h2></td><td class='last_td'><h3 class='" + classes + "'>" + _zd +
            //     "</h3></td></tr><tr><td class='last_td'><h3 class='" + classes + "'>" + _zdf + "%</h3></td></tr></table>");
            pad01Arr.push("<table cellspacing='0' cellpadding='0'><tr class='first_tr'><td class='first_td'><h1>" + _code + "</h1></td><td class='last_td'><h1>" + _name +
                "</h1></td></tr><tr><td class='first_td' rowspan=2><h2>" + zhangdie(_xj.toFixed(3)) + "</h2></td><td class='last_td w120'><span class='fl'>涨跌值</span><h3 class='" + classes + "'>" + _zd +
                "</h3></td></tr><tr><td class='last_td w120'><span class='fl'>均价</span><h3 id='ht-apj' class='" + classes + "'></h3></td></tr></table>");
            pad02Arr.push(
                "<ul class='mm5'><li>卖五" + zhangdie(_mm5[8].toFixed(3)) + "<span class='last_span'>" + _mm5[9] +
                "</span></li><li>卖四" + zhangdie(_mm5[6].toFixed(3)) + "<span class='last_span'>" + _mm5[7] +
                "</span></li><li>卖三" + zhangdie(_mm5[4].toFixed(3)) + "<span class='last_span'>" + _mm5[5] +
                "</span></li><li>卖二" + zhangdie(_mm5[2].toFixed(3)) + "<span class='last_span'>" + _mm5[3] +
                "</span></li><li class='last_li'>卖一" + zhangdie(_mm5[0].toFixed(3)) + "<span class='last_span'>" + _mm5[1] + "</span></li></ul>" +
                "<ul class='m5'><li class='first_li'>买一" + zhangdie(_m5[0].toFixed(3)) + "<span class='last_span'>" + _m5[1] +
                "</span></li><li>买二" + zhangdie(_m5[2].toFixed(3)) + "<span class='last_span'>" + _m5[3] +
                "</span></li><li>买三" + zhangdie(_m5[4].toFixed(3)) + "<span class='last_span'>" + _m5[5] +
                "</span></li><li>买四" + zhangdie(_m5[6].toFixed(3)) + "<span class='last_span'>" + _m5[7] +
                "</span></li><li>买五" + zhangdie(_m5[8].toFixed(3)) + "<span class='last_span'>" + _m5[9] + "</span></li></ul>"
            );
            pad03Arr.push(
                "<table><tr><td class='td_a'>昨收</td><td class='td_b' style='color:#999;'>" + _zs.toFixed(3) + "</td><td class='td_c'>最高</td><td class='td_d'>" + zhangdie(_high.toFixed(3)) +
                "</td></tr><tr><td class='td_a'>开盘</td><td class='td_b'>" + zhangdie(_open.toFixed(3)) + "</td><td class='td_c'>最低</td><td class='td_d'>" + zhangdie(_low.toFixed(3)) +
                "</td></tr><tr><td class='td_a' colspan='2'>成交量</td><td class='td_b' colspan='2' style='color:#999;'>" + _cjl +
                " 手</td></tr><tr><td class='td_a' colspan='2'>成交额</td><td class='td_b' colspan='2' style='color:#999;'>" + _cje.toFixed(0) + " 万元</td></tr>" +
                "<tr><td class='td_a'>时间</td><td class='td_b' colspan='3' style='color:#999;'>" + _dDate + " " + _dTime + "</td></tr>" +
                "<tr><td class='td_a' colspan='2'>交易状态</td><td class='td_b' colspan='2' style='color:#999;'>" + checkStatus(_tradephase) + "</td></tr></table>"
            );
            $("#pad01").html(pad01Arr.join(""));
            $("#pad02").html(pad02Arr.join(""));
            $("#pad03").html(pad03Arr.join(""));

            if (_ins) {
                if (resultData.snap.length < 1) {
                    $('#market_ticker').html('<center style="margin-top:45%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 40px;">暂无走势信息</span></center>');
                }
                if (_tradephase.replace(/\s/ig, '') == "P1") {
                    $('#market_ticker').html('<center style="margin-top:45%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 40px;">停牌中</span></center>');
                } else if (_tradephase.replace(/\s/ig, '') == "C1") {
                    $('#market_ticker').html('<center style="margin-top:45%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 40px;">集合竞价中</span></center>');
                } else {
                    if (checkBrowser()) {
                        $.ajax({
                            type: 'POST',
                            dataType: "jsonp",
                            url: hq_queryUrl + "/v1/sh1/snap/" + _codeS,
                            data: {
                                select: 'cpxxprodusta'
                            },
                            jsonp: "callback",
                            cache: false,
                            success: function(resultData) {
                                var data = resultData.snap[0]
                                var this_code = data[6]
                                if (this_code == "S") {
                                    market_ajax_hg({
                                        id: $('#market_ticker'),
                                        code: _code,
                                        last: _xj,
                                        codeName: _name,
                                        open: _open,
                                        high: _high,
                                        low: _low,
                                        prev_close: _zs,
                                        flag: true
                                    });
                                } else {
                                    market_ajax_hg({
                                        id: $('#market_ticker'),
                                        code: _code,
                                        last: _xj,
                                        codeName: _name,
                                        open: _open,
                                        high: _high,
                                        low: _low,
                                        prev_close: _zs
                                    });
                                }
                            }
                        })
                    }
                }
            } else {
                if (checkBrowser()) {
                    kLinedaykAjax_hg(_code);
                }
            }
        }
    })
}

/**

    kline

    */

function kLinedaykAjax_hg(_codeS) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        // url: "http://www.hcharts.cn/datas/jsonp.php?filename=aapl-ohlcv.json",
        url: hq_queryUrl + "/v1/sh1/dayk/" + _codeS,
        jsonp: "callback",
        data: {
            select: 'date,open,high,low,close,volume,avg',
            begin: -300,
            end: -1
        },
        cache: false,
        success: function(resultData) {
            //console.log(resultData.kline);
            kLineshow_hg(resultData);
            var kline = resultData.kline
            if ($("#ht-apj").length > 0 && kline.length > 0) {
                $("#ht-apj").html(kline[kline.length - 1][6])
            }
        }
    });
}


function kLineshow_hg(data) {
    var _Codesz = data.code;
    data = data.kline;
    // split the data set into ohlc and volume
    var ohlc = [],
        volume = [],
        dataLength = data.length;

    for (i = 0; i < dataLength; i++) {
        var _dates = data[i][0];
        _dates = getDateUTCOrNot(_dates, true);
        ohlc.push([
            _dates, // the date
            data[i][1], // open
            data[i][2], // high
            data[i][3], // low
            data[i][4] // close
        ]);
        // console.log(ohlc);
        volume.push([
            _dates, // the date
            data[i][5] // the volume
        ])
    }

    // set the allowed units for data grouping
    var groupingUnits = [
        [
            'day', // unit name
            [1] // allowed multiples
        ]
    ];

    var originalDrawPoints = Highcharts.seriesTypes.column.prototype.drawPoints;
    Highcharts.seriesTypes.column.prototype.drawPoints = function() {
        var merge = Highcharts.merge,
            series = this,
            chart = this.chart,
            points = series.points,
            i = points.length;
        while (i--) {
            var candlePoint = chart.series[0].points[i];
            if (candlePoint.open != undefined && candlePoint.close != undefined) {
                var color = (candlePoint.open < candlePoint.close) ? '#DD2200' : '#33AA11';
                var seriesPointAttr = merge(series.pointAttr);
                seriesPointAttr[''].fill = color;
                seriesPointAttr.hover.fill = Highcharts.Color(color).brighten(0.3).get();
                seriesPointAttr.select.fill = color;
            } else {
                var seriesPointAttr = merge(series.pointAttr);
            }
            points[i].pointAttr = seriesPointAttr;
        }
        originalDrawPoints.call(this);
    }

    Highcharts.setOptions({
        global: {
            useUTC: false
        },
        lang: {
            loading: "加载中",
            months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            noData: "没有数据",
            numericSymbols: ["千", "兆", "G", "T", "P", "E"],
            printChart: "打印图表",
            resetZoom: "恢复缩放",
            resetZoomTitle: "恢复图表",
            shortMonths: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
            thousandsSep: ",",
            weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
            rangeSelectorZoom: "",
            rangeSelectorFrom: "",
            rangeSelectorTo: "至"
        }
    });
    $('#market_ticker').highcharts('StockChart', {
        chart: {
            margin: [15, 15, 25, 40],
            spacing: [0, 0, 15, 0],
            plotBorderColor: '#3C94C4',
            plotBorderWidth: 0, //边框
            backgroundColor: 0
        },
        tooltip: {
            valueDecinale: 2
        },
        plotOptions: {
            series: {
                animation: false
            },
            candlestick: {
                upColor: '#dd2200',
                upLineColor: '#dd2200',
                color: '#33aa11',
                lineColor: '#33aa11'
            }
        },
        rangeSelector: {
            /*时间段切换按钮*/
            //enabled: false,
            buttons: [{
                type: 'day',
                count: 100,
                text: '三月'
            }, {
                type: 'week',
                count: 26,
                text: '半年'
            }, {
                type: 'month',
                count: 12,
                text: '一年'
            }],
            inputBoxWidth: 90,
            inputDateFormat: '%Y-%b-%e',
            inputPosition: {
                x: -15,
                y: 15
            },
            selected: 0
        },
        navigator: {
            xAxis: {
                labels: {
                    enabled: false
                }
            },
            height: 40 //时间轴高度
        },
        scrollbar: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        yAxis: [{
            opposite: false, //是否把它显示到另一边（右边）
            showFirstLabel: false,
            showLastLabel: true,
            /*labels: {
                align: 'right',
                x: -5,
                style: {
                    color: '#808080'
                }
            },*/
            labels: {
                align: 'right',
                x: -2,
                y: 5,
                useHTML: true,
                formatter: function() {
                    return "<span>" + this.value.toFixed(1) + "%</span>"
                }
            },
            height: '68%',
            lineWidth: 1,
            style: {
                color: '#ffff11'
            },
            gridLineColor: '#cccccc',
            gridLineDashStyle: 'ShortDash'
        }, {
            opposite: false, //是否把它显示到另一边（右边）
            //showFirstLabel: true,
            //showLastLabel:true,
            labels: {
                enabled: false
            },
            top: '70%',
            height: '30%',
            offset: 0,
            lineWidth: 1,
            gridLineColor: '#dddddd'
        }],
        xAxis: {
            labels: {
                style: {
                    color: '#808080',
                    fontWight: 'normal'
                },
                formatter: function() {
                    var returnTime = Highcharts.dateFormat('%b/%e', this.value);
                    return returnTime;
                }
            },
            gridLineColor: '#606060',
            alternateGridColor: '',
            minorGridLineColor: '#dddddd',
            minorTickColor: '#dddddd',
            tickColor: '#dddddd'
        },
        series: [{
            type: 'candlestick',
            name: _Codesz,
            data: ohlc,
            dataGrouping: {
                units: groupingUnits
            }
        }, {
            type: 'column',
            name: '成交量',
            data: volume,
            yAxis: 1,
            dataGrouping: {
                units: groupingUnits
            }
        }]
    });
}

/**

    日内走势

    */
function market_ajax_hg(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/line/" + obj.code,
        data: {
            begin: 0,
            end: -1,
            select: 'time,price,volume,avg_price'
        },
        jsonp: "callback",
        cache: false,
        success: function(resultData) {
            var line = resultData.line
            if (line.length > 0) {
                $("#ht-apj").html(line[line.length - 1][3])
            }
            var dd = resultData;
            var d = dateConvert({
                data: dd,
                last: obj.last,
                open: obj.open
            });
            //var data = null;
            var data = d.line;
            //没数据时不显示图表
            if (data == null) {
                obj.id.css({
                    "border": "1px dotted #ccc"
                });
                obj.id.html("<span class='nal'>暂无走势信息</span>");
                return;
            }

            Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                lang: {
                    loading: "加载中",
                    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    noData: "没有数据",
                    numericSymbols: ["千", "兆", "G", "T", "P", "E"],
                    printChart: "打印图表",
                    resetZoom: "恢复缩放",
                    resetZoomTitle: "恢复图表",
                    shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    thousandsSep: ",",
                    weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
                }
            });
            //初始化开------------------------
            var groupingUnits = [
                [
                    'minute', // unit name
                    [1] // allowed multiples
                ]
            ];
            var avg_pxyAxisMin; //Y轴最小值
            var avg_pxyAxisMax; //Y轴最大值 
            var percentageyAxisMin; //Y轴百分比最小
            var percentageyAxisMax; //Y轴百分比最大
            var volume_yAxisMin; //成交量最小
            var volume_yAxisMax; //成交量最大
            var red = "#ff0000";
            var blue = "#00a800";
            var price_trend = [],
                avg_prices = [],
                volume = [], //成交量
                i = 0;
            //图表上的成交量第一条的数据红绿的判断 是根据昨日的收盘价preclose_px 和今日的最新价last_px进行对比
            //同时获取的昨日收盘价  用于涨幅的计算
            var isFirstLineColorflag = true;
            //保存昨收数据
            var yesterdayClose;
            //容错判断
            if (data != undefined && data != null && data.length == 0) {
                try {
                    failCallback();
                } catch (e) {

                }
                return;
            }
            //今开
            var open_px = data[i][1];
            //昨收
            //var preclose_px=data[i][3];
            var preclose_px = d.prev_close;
            yesterdayClose = preclose_px;
            isFirstLineColorflag = open_px > preclose_px ? true : false;
            // split the data set into price_trend and volume
            //数据处理
            for (i; i < data.length; i += 1) {
                var _dates = data[i][0] + "";
                var _hours = _dates.substring(8, 10);
                var dateUTC = getDateUTCOrNot(_dates, true);
                var business_amount = data[i][2];
                var columnColor = red;
                if (i == 0) { //第一笔的 红绿柱 判断依据是根据 今天开盘价与昨日收盘价比较
                    if (isFirstLineColorflag == false) {
                        columnColor = blue;
                    }
                    avg_pxyAxisMin = data[i][1];
                    avg_pxyAxisMax = data[i][1];
                    percentageyAxisMin = Number(100 * (data[i][1] / yesterdayClose - 1));
                    percentageyAxisMax = Number(100 * (data[i][1] / yesterdayClose - 1));
                    volume_yAxisMin = data[i][2];
                    volume_yAxisMax = data[i][2];
                } else {
                    //除了第一笔，其它都是  返回的 last_px 与前一个对比
                    if (data[i - 1][1] - data[i][1] > 0) {
                        columnColor = blue;
                    }
                    business_amount = data[i][2] - data[i - 1][2];
                }
                avg_pxyAxisMin = avg_pxyAxisMin > data[i][1] ? data[i][1] : avg_pxyAxisMin;
                avg_pxyAxisMax = avg_pxyAxisMax > data[i][1] ? avg_pxyAxisMax : data[i][1];
                percentageyAxisMin = percentageyAxisMin > Number(100 * (data[i][1] / yesterdayClose - 1)) ? Number(100 * (data[i][1] / yesterdayClose - 1)) : percentageyAxisMin;
                percentageyAxisMax = percentageyAxisMax > Number(100 * (data[i][1] / yesterdayClose - 1)) ? percentageyAxisMax : Number(100 * (data[i][1] / yesterdayClose - 1));
                // = Math.min(_vol);
                //volume_yAxisMax=Math.max(_vol);
                //将数据放入 price_trend volume 数组中

                price_trend.push({
                    x: dateUTC,
                    y: Number(data[i][1])
                });
                avg_prices.push({
                    x: dateUTC,
                    y: Number(data[i][3])
                });
                volume.push({
                    x: dateUTC,
                    y: Number(data[i][2])
                });
            }
            if (obj.flag) {
                //将剩下的时间信息补全
                appendTimeMessage(price_trend, volume, data, true);
                //将剩下的时间信息补全
                appendTimeMessage(avg_prices, volume, data, true);
            } else {
                //将剩下的时间信息补全
                appendTimeMessage(price_trend, volume, data);
                //将剩下的时间信息补全
                appendTimeMessage(avg_prices, volume, data);
            }



            //11:30～13:01
            var date;
            if (data.length > 0) {
                date = data[data.length - 1][0] + "";
                var dArr = new Array();
                for (var hh = 0; hh < 5; hh++) {
                    var numb;
                    if (hh == 0) {
                        numb = Number(date.slice(0, 4));
                    } else {
                        numb = Number(date.slice((hh - 1) * 2 + 4, hh * 2 + 4));
                    }

                    dArr.push(numb);
                }
            }
            var last_dataTime = new Date(dArr[0], dArr[1] - 1, dArr[2], dArr[3], dArr[4]);
            var $reporting = $("#report");
            $reporting.html("");
            // Create the chart
            var am_startTime = new Date(last_dataTime);
            am_startTime.setHours(1, 30, 0, 0);
            var am_startTimeUTC = convertDateToUTC(am_startTime);
            var am_midTime = new Date(last_dataTime);
            am_midTime.setHours(2, 30, 0, 0);
            var am_midTimeUTC = convertDateToUTC(am_midTime);

            //股票交易早上最后的时间
            var am_lastTime = new Date(last_dataTime);
            am_lastTime.setHours(3, 30, 0, 0);
            var am_lastTimeUTC = convertDateToUTC(am_lastTime);

            //股票交易下午最后的时间
            var pm_startTime = new Date(last_dataTime);
            pm_startTime.setHours(5, 1, 0, 0);
            var pm_startTimeUTC = convertDateToUTC(pm_startTime);

            var pm_midTime = new Date(last_dataTime);
            pm_midTime.setHours(6, 0, 0, 0);
            var pm_midTimeUTC = convertDateToUTC(pm_midTime);

            var pm_lastTime = new Date(last_dataTime);
            pm_lastTime.setHours(7, 0, 0, 0);
            var pm_lastTimeUTC = convertDateToUTC(pm_lastTime);

            var pm_lastTimeone = new Date(last_dataTime);
            pm_lastTimeone.setHours(7, 30, 0, 0)
            var pm_lastTimeoneUTC = convertDateToUTC(pm_lastTimeone);
            //----------------------------------------------------------
            // Create the chart
            obj.id.highcharts('StockChart', {
                chart: {
                    //关闭平移
                    panning: false,
                    zoomType: 'none',
                    pinchType: 'none',
                    renderTo: "line_map",
                    margin: [15, 52, 20, 55],
                    spacing: [0, 0, 0, 0],
                    plotBorderColor: '#3C94C4',
                    plotBorderWidth: 0, //边框
                    events: {
                        load: function() {
                            var chart = obj.id.highcharts(); // Highcharts构造函数
                            //基准线
                            chart.yAxis[0].addPlotLine({ //在x轴上增加
                                value: yesterdayClose, //在值为2的地方             //在x轴上增加
                                width: 2, //标示线的宽度为2px
                                color: '#CCC', //标示线的颜色
                                zIndex: 1,
                                id: 'plot-line-' //标示线的id，在删除该标示线的时候需要该id标示
                            });
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    valueDecinale: 2,
                    useHTML: true,
                    formatter: function() {
                        var _name = obj.codeName;
                        var _date = Highcharts.dateFormat('%b%e日,%A,%H:%M', this.x);
                        var _y = this.points[1].y.toFixed(3);
                        var _avg = this.points[0].y.toFixed(3);
                        var _yy = this.points[3].y; //yy3
                        return '<p style="margin:0px;padding:0px;font-size:14px;"><span style="color:rgb(52, 109, 164);font-size:10px;">\u25CF</span><span>' + _name + '   </span><span style="' + Comparative(_y, obj.prev_close) + ';">' + _y + '</span></p><p style="margin:0px;padding:0px;font-size:14px;"><span style="color:rgb(160, 217, 255);font-size:10px;">\u25C6</span> <span>' +
                            '均价：  </span>' + ' <span style="' + Comparative(_avg, obj.prev_close) + ';">' + _avg + '</span></p><p style="margin:0px;padding:0px;font-size:14px;"><span>' +
                            '成交量：  </span>' + ' <span>' + (_yy / 100).toFixed(0) + '</span></p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>';
                    }
                },
                plotOptions: {
                    series: {
                        /*关闭动画*/
                        animation: false
                    }
                },
                rangeSelector: {
                    enabled: false
                },
                /*导出配置*/
                exporting: {
                    enabled: false
                },
                /*创建者信息*/
                credits: {
                    enabled: false
                },
                /*下部时间拖拉选择*/
                navigator: {
                    enabled: false,
                    /*关闭时间选择*/
                    baseseries: 10
                },
                scrollbar: {
                    enabled: false /*关闭下方滚动条*/
                },
                /*底部滚动条*/
                scrollbar: {
                    enabled: false
                },

                xAxis: {
                    //type: 'datetime',
                    ordinal: false,
                    breaks: [{ // Nights
                        breakSize: 1,
                        from: am_lastTimeUTC,
                        to: pm_startTimeUTC
                    }],
                    //minRange: 14 * 24 * 36000, // fourteen days
                    showFirstLabel: true,
                    showLastLabel: true,
                    scrollbar: {
                        enabled: true
                    },
                    labels: {
                        // staggerLines:5
                        style: { //字体样式
                            font: 'normal 12px Verdana, sans-serif'
                        },
                        formatter: function() {
                            //var returnTime=Highcharts.dateFormat('%H:%M', this.value-Number(8 * 3600 * 1000));
                            var returnTime = Highcharts.dateFormat('%H:%M', this.value);
                            if (returnTime == "09:30") {
                                return '<span style="margin-left:25px;color:#aaa">09:30</span>';
                            }
                            if (returnTime == "11:30") {
                                return '<span style="color:#aaa">11:30/13:00</span>';
                            }
                            if (returnTime == "10:30") {
                                return "";
                            }
                            if (returnTime == "14:00") {
                                return "";
                            }
                            if (returnTime == "15:00") {
                                return '<span style="display:none">15:00</span>';
                            }
                            if (returnTime == "15:30") {
                                return '<span style="margin-right:25px;color:#aaa">15:30</span>';
                            }

                            return returnTime;

                        },
                        y: 15,
                        step: 1,
                        useHTML: true
                    },
                    tickLength: 6,
                    tickPositioner: function() {
                        var positions = [am_startTimeUTC, am_midTimeUTC, am_lastTimeUTC, pm_midTimeUTC, pm_lastTimeUTC, pm_lastTimeoneUTC];
                        return positions;
                    },
                    gridLineDashStyle: 'ShortDash',
                    gridLineColor: '#f2f2f2',
                    gridLineWidth: 1
                },
                yAxis: [{
                        opposite: false, //是否把它显示到另一边（右边）
                        labels: {
                            align: 'right',
                            x: -2,
                            y: 5,
                            useHTML: true,
                            formatter: function() {
                                return "<span style=" + Comparative(this.value, obj.prev_close) + ">" + this.value + "</span>"
                            }
                        },
                        height: '72%',
                        lineWidth: 1,
                        showFirstLabel: true,
                        showLastLabel: true,
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        tickPositioner: function() { //以yesterdayClose为界限，统一间隔值，从 最小到最大步进
                            positions = [
                                (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixednew(3), (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixednew(3),
                                obj.prev_close.toFixednew(3), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixednew(3), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixednew(3)
                            ];
                            return positions;
                        }
                    }, //y1
                    {
                        opposite: true, //是否把它显示到另一边（右边）
                        showFirstLabel: true,
                        showLastLabel: true,
                        labels: {
                            align: 'left',
                            x: 0,
                            y: 5,
                            useHTML: true,
                            formatter: function() {
                                return "<span style=" + Comparative(this.value, 0) + ">" + this.value + "</span>"
                            }
                        },
                        lineWidth: 0,
                        gridLineWidth: 0,
                        offset: 1,
                        top: '0%',
                        height: '54%',
                        tickPositioner: function() {
                            var lab1 = (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)));
                            var lab2 = (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2);
                            var lab3 = obj.prev_close;
                            var newlab1 = lab1 - lab3;
                            var newlab2 = lab2 - lab3;
                            newlab1 = Math.abs(newlab1)
                            newlab2 = Math.abs(newlab2)
                            positions = [
                                "-" + newlab2.toFixednew(3),
                                "-" + newlab1.toFixednew(3),
                                '0.000',
                                "+" + newlab2.toFixednew(3),
                                "+" + newlab1.toFixednew(3),
                            ];
                            return positions;
                        }
                    }, {
                        labels: {
                            align: 'right',
                            x: -3,
                            y: 0,
                            style: {
                                color: '#666666'
                            },
                            enabled: false
                        },
                        showFirstLabel: false,
                        top: '75%',
                        height: '25%',
                        offset: 0,
                        lineWidth: 1,
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        opposite: false
                    }
                ],
                series: [{
                    name: obj.codeName,
                    data: avg_prices,
                    yAxis: 0,
                    color: 'rgb(160, 217, 255)',
                    marker: {
                        symbol: 'diamond'
                    },
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    name: obj.codeName,
                    data: price_trend,
                    yAxis: 0,
                    color: 'rgb(52, 109, 164)',
                    marker: {
                        symbol: 'circle'
                    },
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    name: obj.codeName,
                    data: price_trend,
                    type: 'line',
                    cursor: 'pointer',
                    onSeries: 'candlestick',
                    color: 'transparent',
                    style: {
                        fontSize: '0px',
                        fontWeight: '0',
                        textAlign: 'center'
                    },
                    zIndex: -1000,
                    yAxis: 1,
                    fillColor: {
                        linearGradient: { //渐变方向
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    type: 'column',
                    name: '成交量',
                    data: volume,
                    //color:'#7cb5ec',
                    yAxis: 2,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    borderWidth: 0.1
                }]
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //返回错误信息
            //console.log("Ajax返回错误信息:"+XMLHttpRequest.status+"~"+XMLHttpRequest.readyState+"~"+textStatus);
        }
    });
}
/***********************************************************************************************************/
/***********************************************************************************************************/
/******************************首页-数据-行情信息总览-市场数据 -09-18***********************************/
/***********************************************************************************************************/
/***********************************************************************************************************/
var _inpCode = "000001";

function dataScsjSearchInit() {
    _inpCode = "000001";
    var $scsj_btnQuery = $('.cScshSearch #btnQuery'); //按钮
    var $scsj_inputCode = $('.cScshSearch #inputCode'); //输入框
    var $searchPData = $("#tableData_hq_scsj_search #tack_con"); //图形模块
    var $tack_tab = $("#tableData_hq_scsj_search #tack_tab"); //详情

    if (!checkBrowser()) {
        //$searchPData.css({"border":"1px dotted #ccc"});
        $searchPData.html("<center style='margin-top:35%'><span class='nal' style='color: #ccc;'>当前浏览器不支持HTML5行情<br/>请使用IE9及以上版本浏览器</span></center>");
    }


    dataScsjSearchInitMethod({
        id: $searchPData,
        code: _inpCode,
        dtId: $tack_tab
    });

    $scsj_btnQuery.click(function() {
        _inpCode = $scsj_inputCode.val();
        if (_inpCode.length != 6) {
            alert("请输入正确的股票代码");
        } else {
            dataScsjSearchInitMethod({
                id: $searchPData,
                code: _inpCode,
                dtId: $tack_tab
            });
        }
    });
    /*$scsj_inputCode.keydown(function(e){
        if(e.which==13){ // enter 键
            _inpCode = $scsj_inputCode.val();
            if(_inpCode.length != 6){
                alert("请输入正确的股票代码");
            }else{
                dataScsjSearchInitMethod({
                    id:$searchPData,
                    code:_inpCode,
                    dtId:$tack_tab
                });
            }
        }
    }); 

    $(document).keydown(function(e){
        if(e.which==13){ // enter 键
            _inpCode = $scsj_inputCode.val();
            if(_inpCode.length != 6){
                alert("请输入正确的股票代码");
            }else{
                dataScsjSearchInitMethod({
                    id:$searchPData,
                    code:_inpCode,
                    dtId:$tack_tab
                });
            }
        }
    });  */

    window.setInterval(function() {
        dataScsjSearchInitMethod({
            id: $searchPData,
            code: _inpCode,
            dtId: $tack_tab
        });
    }, 15000);

}

function dataScsjSearchInitMethod(obj) {

    fnCodetype(obj.code, function(_codType) {
        if (_codType) {
            switch (_codType) {
                case "astock": //A股，
                    $("#tableData_hq_scsj_search").removeClass('hq_scsj_kcb');
                    dataScsjAjax({
                        id: obj.id,
                        code: obj.code,
                        dtId: obj.dtId
                    });
                    break;

                case "bstock": //B股
                    $("#tableData_hq_scsj_search").removeClass('hq_scsj_kcb');
                    dataScsjAjax_qq({
                        id: obj.id,
                        code: obj.code,
                        dtId: obj.dtId
                    });
                    break;
                case "kcbstock": //科创板
                    $("#tableData_hq_scsj_search").addClass('hq_scsj_kcb');
                    dataScsjAjax_kcb({
                        id: obj.id,
                        code: obj.code,
                        dtId: obj.dtId
                    });
                    break;
                case "fund": //基金
                    $("#tableData_hq_scsj_search").removeClass('hq_scsj_kcb');
                    dataScsjAjax_jj({
                        id: obj.id,
                        code: obj.code,
                        dtId: obj.dtId
                    });
                    break;
                case "bond": //债券
                    $("#tableData_hq_scsj_search").removeClass('hq_scsj_kcb');
                    dataScsjAjax_zq({
                        id: obj.id,
                        code: obj.code,
                        dtId: obj.dtId
                    });
                    break;
                case "index": //指数
                    $("#tableData_hq_scsj_search").removeClass('hq_scsj_kcb');
                    dataScsjAjax_zs({
                        id: obj.id,
                        code: obj.code,
                        dtId: obj.dtId
                    });
                    break;
                case "huigou": //回购
                    $("#tableData_hq_scsj_search").removeClass('hq_scsj_kcb');
                    dataScsjAjax_hg({
                        id: obj.id,
                        code: obj.code,
                        dtId: obj.dtId
                    });
                    break;

            }
        }
    })



    //window.console.log("首页-数据-行情信息总览-市场数据-codeType:"+_codType);

}


function dataScsjAjax_yuyue(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/list/self/" + obj.code,
        jsonp: "callback",
        data: {
            select: 'last,open,name,high,low,change,chg_rate,prev_close,volume,amount,tradephase'
        },
        cache: false,
        success: function(resultData) {
            var _snap_val = resultData.list;
            var _date = resultData.date + "";
            var _dDate = _date.substring(0, _date.length - 4) + "-" + _date.substring(_date.length - 4, _date.length - 2) + "-" + _date.substring(_date.length - 2);
            var _timer = resultData.time + "";
            var _dTime = _timer.substring(0, _timer.length - 4) + ":" + _timer.substring(_timer.length - 4, _timer.length - 2) + ":" + _timer.substring(_timer.length - 2);
            var _last = _snap_val[0][0];
            var _open = _snap_val[0][1];
            var _name = _snap_val[0][2];
            var _high = _snap_val[0][3];
            var _low = _snap_val[0][4];
            var _change = _snap_val[0][5];
            var _chg_rate = _snap_val[0][6];
            var _prev_close = _snap_val[0][7];
            var _volume = _snap_val[0][8];
            var _amount = _snap_val[0][9];
            var _tradephase = _snap_val[0][10];
            obj.dtId.find("h1:eq(0)").html(obj.code);
            obj.dtId.find("h1:eq(1)").html(_name);
            var detaTab = [];
            detaTab.push("<li><span class='span_a'>现价</span><span class='span_b' style='" + Comparative(_last, _prev_close) + "'>" + _last.toFixed(3) + "</span></li>");
            detaTab.push("<li><span class='span_a'>涨跌</span><span class='span_b' style='" + Comparative(_change, 0) + "'>" + _change.toFixed(3) + "</span></li>");
            detaTab.push("<li><span class='span_a'>涨跌幅</span><span class='span_b' style='" + Comparative(_chg_rate, 0) + "'>" + _chg_rate.toFixed(2) + "%</span></li>");
            detaTab.push("<li><span class='span_a'>昨收</span><span class='span_b'>" + _prev_close.toFixed(3) + "</span></li>");
            detaTab.push("<li><span class='span_a'>开盘</span><span class='span_b' style='" + Comparative(_open, _prev_close) + "'>" + _open.toFixed(3) + "</span></li>");
            detaTab.push("<li><span class='span_a'>最高</span><span class='span_b' style='" + Comparative(_high, _prev_close) + "'>" + _high.toFixed(3) + "</span></li>");
            detaTab.push("<li><span class='span_a'>最低</span><span class='span_b' style='" + Comparative(_low, _prev_close) + "'>" + _low.toFixed(3) + "</span></li>");
            detaTab.push("<li><span class='span_a'>总量</span><span class='span_b'>" + Number(_volume / 100).toFixed(0) + " 手</span></li>");
            detaTab.push("<li><span class='span_a'>总额</span><span class='span_b'>" + Number(_amount / 10000).toFixed(0) + " 万美元</span></li>");
            detaTab.push("<li><span class='span_a'>时间</span><span class='span_b'>" + _dTime + "</span></li>");
            detaTab.push("<li><span class='span_a'>日期</span><span class='span_b'>" + _dDate + "</span></li>"); //===== by WHJ
            detaTab.push("<li><span class='span_a'>交易状态</span><span class='span_b'>" + checkStatus(_tradephase) + "</span></li>");
            obj.dtId.find("ul").html(detaTab.join(""));

            if (_tradephase.replace(/\s/ig, '') == "P1") {
                obj.id.html('<center style="margin-top:40%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 20px;">停牌中</span></center>');
            } else if (_tradephase.replace(/\s/ig, '') == "C1") {
                obj.id.html('<center style="margin-top:40%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 20px;">集合竞价中</span></center>');
            } else {
                if (checkBrowser()) {
                    dataScsjSearch_qq({
                        id: obj.id,
                        code: obj.code,
                        last: _last,
                        codeName: _name,
                        open: _open,
                        high: _high,
                        low: _low,
                        prev_close: _prev_close
                    });
                }
            }
        }
    })
}
/*
-----------------------------------------------------------首页-数据-行情信息总览-市场数据－A股票------------------------------------------------------
*/
function dataScsjAjax(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/list/self/" + obj.code,
        jsonp: "callback",
        data: {
            select: 'last,open,name,high,low,change,chg_rate,prev_close,volume,amount,tradephase'
        },
        cache: false,
        success: function(resultData) {
            var _snap_val = resultData.list;
            var _timer = resultData.time + "";
            var _date = resultData.date + "";
            var _dDate = _date.substring(0, _date.length - 4) + "-" + _date.substring(_date.length - 4, _date.length - 2) + "-" + _date.substring(_date.length - 2);
            var _dTime = _timer.substring(0, _timer.length - 4) + ":" + _timer.substring(_timer.length - 4, _timer.length - 2) + ":" + _timer.substring(_timer.length - 2);
            var _last = _snap_val[0][0];
            var _open = _snap_val[0][1];
            var _name = _snap_val[0][2];
            var _high = _snap_val[0][3];
            var _low = _snap_val[0][4];
            var _change = _snap_val[0][5];
            var _chg_rate = _snap_val[0][6];
            var _prev_close = _snap_val[0][7];
            var _volume = _snap_val[0][8];
            var _amount = _snap_val[0][9];
            var _tradephase = _snap_val[0][10];
            obj.dtId.find("h1:eq(0)").html(obj.code);
            obj.dtId.find("h1:eq(1)").html(_name);
            var detaTab = [];
            detaTab.push("<li><span class='span_a'>现价</span><span class='span_b' style='" + Comparative(_last, _prev_close) + "'>" + _last.toFixed(2) + "</span></li>");
            detaTab.push("<li><span class='span_a'>涨跌</span><span class='span_b' style='" + Comparative(_change, 0) + "'>" + _change.toFixed(2) + "</span></li>");
            detaTab.push("<li><span class='span_a'>涨跌幅</span><span class='span_b' style='" + Comparative(_chg_rate, 0) + "'>" + _chg_rate.toFixed(2) + "%</span></li>");
            detaTab.push("<li><span class='span_a'>昨收</span><span class='span_b'>" + _prev_close.toFixed(2) + "</span></li>");
            detaTab.push("<li><span class='span_a'>开盘</span><span class='span_b' style='" + Comparative(_open, _prev_close) + "'>" + _open.toFixed(2) + "</span></li>");
            detaTab.push("<li><span class='span_a'>最高</span><span class='span_b' style='" + Comparative(_high, _prev_close) + "'>" + _high.toFixed(2) + "</span></li>");
            detaTab.push("<li><span class='span_a'>最低</span><span class='span_b' style='" + Comparative(_low, _prev_close) + "'>" + _low.toFixed(2) + "</span></li>");
            detaTab.push("<li><span class='span_a'>总量</span><span class='span_b'>" + Number(_volume / 100).toFixed(0) + " 手</span></li>");
            detaTab.push("<li><span class='span_a'>总额</span><span class='span_b'>" + Number(_amount / 10000).toFixed(0) + " 万元</span></li>");
            detaTab.push("<li><span class='span_a'>时间</span><span class='span_b'>" + _dTime + "</span></li>");
            detaTab.push("<li><span class='span_a'>日期</span><span class='span_b'>" + _dDate + "</span></li>"); //===== by WHJ
            detaTab.push("<li><span class='span_a'>交易状态</span><span class='span_b'>" + checkStatus(_tradephase) + "</span></li>");


            obj.dtId.find("ul").html(detaTab.join(""));


            if (_tradephase.replace(/\s/ig, '') == "P1") {
                obj.id.html('<center style="margin-top:40%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 20px;">停牌中</span></center>');
            } else if (_tradephase.replace(/\s/ig, '') == "C1") {
                obj.id.html('<center style="margin-top:40%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 20px;">集合竞价中</span></center>');
            } else {
                if (checkBrowser()) {
                    dataScsjSearch({
                        id: obj.id,
                        code: obj.code,
                        last: _last,
                        codeName: _name,
                        open: _open,
                        high: _high,
                        low: _low,
                        prev_close: _prev_close
                    });
                }


            }
        }
    })
}
/*
-----------------------------------------------------------首页-数据-行情信息总览-市场数据－科创板------------------------------------------------------
*/
function dataScsjAjax_kcb(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/list/self/" + obj.code,
        jsonp: "callback",
        data: {
            select: 'last,open,name,high,low,change,chg_rate,prev_close,volume,amount,tradephase,up_limit,down_limit,fp_volume,fp_amount,cpxxprodusta'
        },
        cache: false,
        success: function(resultData) {
            var _code = obj.code;
            var _snap_val = resultData.list;
            var _timer = resultData.time + "";
            var _date = resultData.date + "";
            var _dDate = _date.substring(0, _date.length - 4) + "-" + _date.substring(_date.length - 4, _date.length - 2) + "-" + _date.substring(_date.length - 2);
            var _dTime = _timer.substring(0, _timer.length - 4) + ":" + _timer.substring(_timer.length - 4, _timer.length - 2) + ":" + _timer.substring(_timer.length - 2);
            var _last = _snap_val[0][0];
            var _open = _snap_val[0][1];
            var _name = _snap_val[0][2];
            var _high = _snap_val[0][3];
            var _low = _snap_val[0][4];
            var _change = _snap_val[0][5];
            var _chg_rate = _snap_val[0][6];
            var _prev_close = _snap_val[0][7];
            var _volume = _snap_val[0][8];
            var _amount = _snap_val[0][9];
            var _tradephase = _snap_val[0][10];
            var _ztj = _snap_val[0][11]; //涨停价
            var _dtj = _snap_val[0][12]; //跌停价
            var _phzl = _snap_val[0][13]; //盘后总量
            var _phze = _snap_val[0][14]; //盘后总额
            _phze = _phze / 10000;
            var _cpztxx = _snap_val[0][15]; //是否显示U  W
            var _cpztxx_arr = _cpztxx.split('');

            var showU = "";
            var showW = "";
            var showC = "";
            if (_cpztxx_arr[4] == "Y") {
                showC = "<a href='javascript:void(0);' class='icon_kcb_c' title=''></a>";
            }
            var showK = "<a href='javascript:void(0);' class='icon_kcb_12 icon_kcb_k ' title=''></a>";
            if (_cpztxx_arr[7] == "U") {
                showU += "<a href='javascript:void(0);' class='icon_kcb_12 icon_kcb_u' title=''></a>";
            }
            if (_cpztxx_arr[8] == "W") {
                showW += "<a href='javascript:void(0);' class='icon_kcb_12 icon_kcb_w' title=''></a>";
            }
            // var url_kcbU = "/images/icon_kcbU.png";
            // var url_kcbW = "/images/icon_kcbW.png";
            // var url_kcb = "/images/icon_kcb.png";
            // var showK = "<a href='javascript:void(0);' title='' style='cursor: default;display: inline-block;width:12px;height:12px;background:url(" + url_kcb + ");background-size:100%;background-repeat: no-repeat;background-position: center;'></a>";
            // if (_cpztxx_arr[7] == "U") {
            //     showU += "<a href='javascript:void(0);' title='' style='cursor: default;display: inline-block;width:12px;height:12px;background:url(" + url_kcbU + ");background-size:100%;background-repeat: no-repeat;background-position: center;'></a>";
            // }
            // if (_cpztxx_arr[8] == "W") {
            //     showW += "<a href='javascript:void(0);' title='' style='cursor: default;display: inline-block;width:12px;height:12px;background:url(" + url_kcbW + ");background-size:100%;background-repeat: no-repeat;background-position: center;'></a>";
            // }

            obj.dtId.find("h1:eq(0)").html('');
            obj.dtId.find("h1:eq(1)").html('');
            // obj.dtId.find("h1:eq(1)").html("科创板一").css({
            //     'float': 'none',
            //     'margin-left': '4px'
            // });
            var detaTab = [];
            detaTab.push("<li class='sp1'><span class='span_a' style='font-size: 16px;color: #444;font-weight: bold;'>" + obj.code + "</li>");
            detaTab.push("<li class='sp1'><span class='span_a' style='font-size: 16px;color: #444;font-weight: bold;margin-bottom:10px;'>" + _name + showK + showU + showW + showC + "</li>");
            detaTab.push("<li><span class='span_a'>现价</span><span class='span_b' style='" + Comparative(_last, _prev_close) + "'>" + _last.toFixed(2) + "</span></li>");
            detaTab.push("<li><span class='span_a'>涨跌</span><span class='span_b' style='" + Comparative(_change, 0) + "'>" + _change.toFixed(2) + "</span></li>");
            detaTab.push("<li><span class='span_a'>涨跌幅</span><span class='span_b' style='" + Comparative(_chg_rate, 0) + "'>" + _chg_rate.toFixed(2) + "%</span></li>");
            detaTab.push("<li><span class='span_a'>昨收</span><span class='span_b'>" + _prev_close.toFixed(2) + "</span></li>");
            detaTab.push("<li><span class='span_a'>开盘</span><span class='span_b' style='" + Comparative(_open, _prev_close) + "'>" + _open.toFixed(2) + "</span></li>");
            detaTab.push("<li><span class='span_a'>最高</span><span class='span_b' style='" + Comparative(_high, _prev_close) + "'>" + _high.toFixed(2) + "</span></li>");
            detaTab.push("<li><span class='span_a'>最低</span><span class='span_b' style='" + Comparative(_low, _prev_close) + "'>" + _low.toFixed(2) + "</span></li>");
            detaTab.push("<li><span class='span_a'>总量</span><span class='span_b'>" + _volume + "</span></li>");
            detaTab.push("<li><span class='span_a'>总额</span><span class='span_b'>" + Number(_amount / 10000).toFixed(0) + " 万元</span></li>");
            // detaTab.push("<li><span class='span_a'>涨停价</span><span class='span_b'>" + _ztj.toFixed(2) + "</span></li>");
            // detaTab.push("<li><span class='span_a'>跌停价</span><span class='span_b'>" + _dtj.toFixed(2) + "</span></li>");
            detaTab.push("<li><span class='span_a'>盘后总量</span><span class='span_b'>" + _phzl.toFixed(0) + "</span></li>");
            detaTab.push("<li><span class='span_a'>盘后总额</span><span class='span_b'>" + _phze.toFixed(0) + " 万元</span></li>");
            detaTab.push("<li><span class='span_a'>时间</span><span class='span_b'>" + _dTime + "</span></li>");
            detaTab.push("<li><span class='span_a'>日期</span><span class='span_b'>" + _dDate + "</span></li>"); //===== by WHJ
            // detaTab.push("<li><span class='span_a'>交易状态</span><span class='span_b'>" + checkStatus(_tradephase) + "</span></li>");


            obj.dtId.find("ul").html(detaTab.join(""));


            if (_tradephase.replace(/\s/ig, '') == "P1") {
                obj.id.html('<center style="margin-top:40%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 20px;">停牌中</span></center>');
            } else if (_tradephase.replace(/\s/ig, '') == "C1") {
                obj.id.html('<center style="margin-top:40%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 20px;">集合竞价中</span></center>');
            } else {
                if (checkBrowser()) {
                    dataScsjSearch_kcb({
                        id: obj.id,
                        code: obj.code,
                        last: _last,
                        codeName: _name,
                        open: _open,
                        high: _high,
                        low: _low,
                        prev_close: _prev_close
                    });
                }


            }
        }
    })
}

function dataScsjSearch(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        //v1/sh1/list/self/
        url: hq_queryUrl + "/v1/sh1/line/" + obj.code,
        data: {
            begin: 0,
            end: -1,
            select: 'time,price,volume'
        },
        jsonp: "callback",
        cache: false,
        success: function(resultData) {
            var dd = resultData;
            var d = dateConvert({
                data: dd,
                last: obj.last,
                open: obj.open
            });
            //var data = null;
            var data = d.line;
            //没数据时不显示图表
            if (data.length == 0) {
                //obj.id.html("<div class='chart_container'></div>");
                obj.id.css({
                    "border": "1px solid #CCC"
                });
                return;
            }
            Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                lang: {
                    loading: "加载中",
                    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    noData: "没有数据",
                    numericSymbols: ["千", "兆", "G", "T", "P", "E"],
                    printChart: "打印图表",
                    resetZoom: "恢复缩放",
                    resetZoomTitle: "恢复图表",
                    shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    thousandsSep: ",",
                    weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
                }
            });
            //初始化开------------------------
            var groupingUnits = [
                [
                    'minute', // unit name
                    [1] // allowed multiples
                ]
            ];
            var avg_pxyAxisMin; //Y轴最小值
            var avg_pxyAxisMax; //Y轴最大值 
            var percentageyAxisMin; //Y轴百分比最小
            var percentageyAxisMax; //Y轴百分比最大
            var volume_yAxisMin; //成交量最小
            var volume_yAxisMax; //成交量最大
            var red = "#ff0000";
            var blue = "#00a800";
            var price_trend = [],
                volume = [], //成交量
                i = 0;
            //图表上的成交量第一条的数据红绿的判断 是根据昨日的收盘价preclose_px 和今日的最新价last_px进行对比
            //同时获取的昨日收盘价  用于涨幅的计算
            var isFirstLineColorflag = true;
            //保存昨收数据
            var yesterdayClose;
            //容错判断
            if (data != undefined && data != null && data.length == 0) {
                try {
                    failCallback();
                } catch (e) {

                }
                return;
            }
            //今开
            var open_px = data[i][1];
            //昨收
            //var preclose_px=data[i][3];
            var preclose_px = d.prev_close;
            yesterdayClose = preclose_px;
            isFirstLineColorflag = open_px > preclose_px ? true : false;
            // split the data set into price_trend and volume
            //数据处理
            for (i; i < data.length; i += 1) {
                var _dates = data[i][0] + "";
                var _hours = _dates.substring(8, 10);
                var dateUTC = getDateUTCOrNot(_dates, true);
                var business_amount = data[i][2];
                var columnColor = red;
                if (i == 0) { //第一笔的 红绿柱 判断依据是根据 今天开盘价与昨日收盘价比较
                    if (isFirstLineColorflag == false) {
                        columnColor = blue;
                    }
                    avg_pxyAxisMin = data[i][1];
                    avg_pxyAxisMax = data[i][1];
                    percentageyAxisMin = Number(100 * (data[i][1] / yesterdayClose - 1));
                    percentageyAxisMax = Number(100 * (data[i][1] / yesterdayClose - 1));
                    volume_yAxisMin = data[i][2];
                    volume_yAxisMax = data[i][2];
                } else {
                    //除了第一笔，其它都是  返回的 last_px 与前一个对比
                    if (data[i - 1][1] - data[i][1] > 0) {
                        columnColor = blue;
                    }
                    business_amount = data[i][2] - data[i - 1][2];
                }
                avg_pxyAxisMin = avg_pxyAxisMin > data[i][1] ? data[i][1] : avg_pxyAxisMin;
                avg_pxyAxisMax = avg_pxyAxisMax > data[i][1] ? avg_pxyAxisMax : data[i][1];
                percentageyAxisMin = percentageyAxisMin > Number(100 * (data[i][1] / yesterdayClose - 1)) ? Number(100 * (data[i][1] / yesterdayClose - 1)) : percentageyAxisMin;
                percentageyAxisMax = percentageyAxisMax > Number(100 * (data[i][1] / yesterdayClose - 1)) ? percentageyAxisMax : Number(100 * (data[i][1] / yesterdayClose - 1));
                volume_yAxisMin = volume_yAxisMin > business_amount ? business_amount : volume_yAxisMin;
                volume_yAxisMax = volume_yAxisMax > business_amount ? volume_yAxisMax : business_amount;
                //将数据放入 price_trend volume 数组中

                price_trend.push({
                    x: dateUTC,
                    y: Number(data[i][1])
                });
                volume.push({
                    x: dateUTC,
                    y: Number(business_amount),
                    color: columnColor
                });
            }

            //将剩下的时间信息补全
            appendTimeMessage(price_trend, volume, data);
            //常量本地化
            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });

            var date;
            if (data.length > 0) {
                date = data[data.length - 1][0] + "";
                var dArr = new Array();
                for (var hh = 0; hh < 5; hh++) {
                    var numb;
                    if (hh == 0) {
                        numb = Number(date.slice(0, 4));
                    } else {
                        numb = Number(date.slice((hh - 1) * 2 + 4, hh * 2 + 4));
                    }

                    dArr.push(numb);
                }
            }
            var last_dataTime = new Date(dArr[0], dArr[1] - 1, dArr[2], dArr[3], dArr[4]);
            var $reporting = $("#report");
            $reporting.html("");
            // Create the chart
            var am_startTime = new Date(last_dataTime);
            am_startTime.setHours(1, 30, 0, 0);
            var am_startTimeUTC = convertDateToUTC(am_startTime);
            var am_midTime = new Date(last_dataTime);
            am_midTime.setHours(2, 30, 0, 0);
            var am_midTimeUTC = convertDateToUTC(am_midTime);

            //股票交易早上最后的时间
            var am_lastTime = new Date(last_dataTime);
            am_lastTime.setHours(3, 30, 0, 0);
            var am_lastTimeUTC = convertDateToUTC(am_lastTime);

            //股票交易下午最后的时间
            var pm_startTime = new Date(last_dataTime);
            pm_startTime.setHours(5, 1, 0, 0);
            var pm_startTimeUTC = convertDateToUTC(pm_startTime);

            var pm_midTime = new Date(last_dataTime);
            pm_midTime.setHours(6, 0, 0, 0);
            var pm_midTimeUTC = convertDateToUTC(pm_midTime);

            var pm_lastTime = new Date(last_dataTime);
            pm_lastTime.setHours(7, 0, 0, 0);
            var pm_lastTimeUTC = convertDateToUTC(pm_lastTime);


            //----------------------------------------------------------
            // Create the chart
            obj.id.highcharts('StockChart', {
                chart: {
                    //关闭平移
                    panning: false,
                    zoomType: 'none',
                    pinchType: 'none',
                    renderTo: "line_map",
                    margin: [10, 5, 20, 48],
                    spacing: [0, 0, 0, 0],
                    plotBorderColor: '#3C94C4',
                    plotBorderWidth: 0, //边框
                    events: {
                        load: function() {
                            var chart = obj.id.highcharts(); // Highcharts构造函数
                            //基准线
                            chart.yAxis[0].addPlotLine({ //在x轴上增加
                                value: yesterdayClose, //在值为2的地方             //在x轴上增加
                                width: 2, //标示线的宽度为2px
                                color: '#CCC', //标示线的颜色
                                zIndex: 1,
                                id: 'plot-line-' //标示线的id，在删除该标示线的时候需要该id标示
                            });
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    valueDecinale: 2,
                    useHTML: true,
                    formatter: function() {
                        //var _name = this.points[1].series.name;
                        //console.log(this);
                        var _name = obj.codeName;
                        var _date = Highcharts.dateFormat('%b%e日,%A,%H:%M', this.x);
                        var _y = this.points[0].y.toFixed(2);
                        return '<p style="margin:0px;padding:0px;font-size:14px;"><span>' + _name + '   </span><span style="' + Comparative(_y, obj.prev_close) + ';">' + _y + '</span></p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>';
                        //var _yy = this.points[2].y;
                        //return '<p style="margin:0px;padding:0px;font-size:14px;">' + _name +  ' <span style="'+Comparative(_y,obj.prev_close)+';float:right;">'+_y+ '</span></p><p style="margin:0px;padding:0px;font-size:14px;">'+
                        //'成交量：' + ' <span style="float:right;">'+(_yy).toFixed(0)+ '</p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>'
                    }
                },
                plotOptions: {
                    series: {
                        /*关闭动画*/
                        animation: false
                    }
                },
                rangeSelector: {
                    enabled: false
                },
                /*导出配置*/
                exporting: {
                    enabled: false
                },
                /*创建者信息*/
                credits: {
                    enabled: false
                },
                /*下部时间拖拉选择*/
                navigator: {
                    enabled: false,
                    /*关闭时间选择*/
                    baseseries: 10
                },
                scrollbar: {
                    enabled: false /*关闭下方滚动条*/
                },
                /*底部滚动条*/
                scrollbar: {
                    enabled: false
                },

                xAxis: {
                    //type: 'datetime',
                    ordinal: false,
                    breaks: [{ // Nights
                        breakSize: 1,
                        from: am_lastTimeUTC,
                        to: pm_startTimeUTC
                    }],
                    //minRange: 14 * 24 * 36000, // fourteen days
                    showFirstLabel: true,
                    showLastLabel: true,
                    scrollbar: {
                        enabled: true
                    },
                    labels: {
                        // staggerLines:5
                        style: { //字体样式
                            font: 'normal 12px'
                        },
                        formatter: function() {
                            //var returnTime=Highcharts.dateFormat('%H:%M', this.value-Number(8 * 3600 * 1000));
                            var returnTime = Highcharts.dateFormat('%H:%M', this.value);
                            if (returnTime == "09:30") {
                                return '<span style="margin-left:33px;color:#aaa">09:30</span>';
                            }
                            if (returnTime == "11:30") {
                                return '<span style="color:#aaa">11:30/13:00</span>';
                            }
                            if (returnTime == "10:30") {
                                return "";
                            }
                            if (returnTime == "14:00") {
                                return "";
                            }
                            if (returnTime == "15:00") {
                                return '<span style="margin-right:35px;color:#aaa">15:00</span>';
                            }
                            return returnTime;

                        },
                        y: 15,
                        step: 1,
                        useHTML: true
                    },
                    tickLength: 5,
                    tickPositioner: function() {
                        var positions = [am_startTimeUTC, am_midTimeUTC, am_lastTimeUTC, pm_midTimeUTC, pm_lastTimeUTC];
                        //var positions = [am_startTimeUTC,  am_lastTimeUTC,pm_lastTimeUTC];
                        return positions;
                    },
                    gridLineDashStyle: 'ShortDash',
                    gridLineColor: '#f2f2f2',
                    gridLineWidth: 1
                },
                yAxis: [{
                        opposite: false, //是否把它显示到另一边（右边）
                        labels: {
                            enabled: false
                        },
                        title: {
                            text: ''
                        },
                        top: '0%',
                        height: '100%',
                        width: '90%',
                        lineWidth: 0,
                        showFirstLabel: false,
                        showLastLabel: false,
                        gridLineWidth: 0,
                        x: 0,
                        y: 0,
                        tickPositioner: function() { //以yesterdayClose为界限，统一间隔值，从 最小到最大步进
                            positions = [
                                (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(2), (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(2),
                                obj.prev_close.toFixed(2), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(2), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(2)
                            ];
                            return positions;
                        }
                    }, //y1
                    {
                        opposite: false, //是否把它显示到另一边（右边）
                        showFirstLabel: true,
                        showLastLabel: true,
                        labels: {
                            enabled: true,
                            overflow: 'justify',
                            style: { //字体样式
                                font: 'normal 12px'
                            },
                            align: 'right',
                            x: -5,
                            y: 6,
                            formatter: function() { //最新价  px_last/preclose昨收盘-1
                                //return 100*(((this.value/yesterdayClose)-1).toFixed(4))+"%";
                                return '<span style="color:#aaa;">' + this.value + '</span>';
                            }
                        },
                        useHTML: true,
                        title: {
                            text: ''
                        },
                        lineWidth: 0.5,
                        top: '0%',
                        height: '100%',
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        tickPositioner: function() {
                            return positions;
                        }
                    }
                ],
                series: [{
                    name: obj.codeName,
                    data: price_trend,
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    name: obj.codeName,
                    data: price_trend,
                    type: 'line',
                    lineWidth: 0.5,
                    cursor: 'pointer',
                    onSeries: 'candlestick',
                    color: 'transparent',
                    style: {
                        fontSize: '0px',
                        fontWeight: '0',
                        textAlign: 'center'
                    },
                    zIndex: -1000,
                    yAxis: 1,
                    fillColor: {
                        linearGradient: { //渐变方向
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    dataGrouping: {
                        units: groupingUnits
                    }
                }]
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //返回错误信息
            //console.log("Ajax返回错误信息:"+XMLHttpRequest.status+"~"+XMLHttpRequest.readyState+"~"+textStatus);
        }
    });
}

function dataScsjSearch_kcb(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        //v1/sh1/list/self/
        url: hq_queryUrl + "/v1/sh1/line/" + obj.code,
        data: {
            begin: 0,
            end: -1,
            select: 'time,price,volume,avg_price'
        },
        jsonp: "callback",
        cache: false,
        success: function(resultData) {
            var dd = resultData;
            var d = dateConvert({
                data: dd,
                last: obj.last,
                open: obj.open
            });
            //var data = null;
            var data = d.line;
            //没数据时不显示图表
            if (data.length == 0) {
                //obj.id.html("<div class='chart_container'></div>");
                obj.id.css({
                    "border": "1px solid #CCC"
                });
                return;
            }
            Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                lang: {
                    loading: "加载中",
                    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    noData: "没有数据",
                    numericSymbols: ["千", "百万", "G", "T", "P", "E"],
                    printChart: "打印图表",
                    resetZoom: "恢复缩放",
                    resetZoomTitle: "恢复图表",
                    shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    thousandsSep: ",",
                    weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
                }
            });
            //初始化开------------------------
            var groupingUnits = [
                [
                    'minute', // unit name
                    [1] // allowed multiples
                ]
            ];
            var avg_pxyAxisMin; //Y轴最小值
            var avg_pxyAxisMax; //Y轴最大值 
            var percentageyAxisMin; //Y轴百分比最小
            var percentageyAxisMax; //Y轴百分比最大
            var volume_yAxisMin; //成交量最小
            var volume_yAxisMax; //成交量最大
            var red = "#ff0000";
            var blue = "#00a800";
            var price_trend = [],
                price_trend_h = [],
                aa_1,
                avg_prices = [],
                volume = [], //成交量
                i = 0;
            //图表上的成交量第一条的数据红绿的判断 是根据昨日的收盘价preclose_px 和今日的最新价last_px进行对比
            //同时获取的昨日收盘价  用于涨幅的计算
            var isFirstLineColorflag = true;
            //保存昨收数据
            var yesterdayClose;
            //容错判断
            if (data != undefined && data != null && data.length == 0) {
                try {
                    failCallback();
                } catch (e) {

                }
                return;
            }
            //今开
            var open_px = data[i][1];
            //昨收
            //var preclose_px=data[i][3];
            var preclose_px = d.prev_close;
            yesterdayClose = preclose_px;
            isFirstLineColorflag = open_px > preclose_px ? true : false;
            // split the data set into price_trend and volume
            //数据处理
            for (i; i < data.length; i += 1) {
                var _dates = data[i][0] + "";
                var _hours = _dates.substring(8, 10);
                var dateUTC = getDateUTCOrNot(_dates, true);
                var business_amount = data[i][2];
                var columnColor = red;
                if (i == 0) { //第一笔的 红绿柱 判断依据是根据 今天开盘价与昨日收盘价比较
                    if (isFirstLineColorflag == false) {
                        columnColor = blue;
                    }
                    avg_pxyAxisMin = data[i][1];
                    avg_pxyAxisMax = data[i][1];
                    percentageyAxisMin = Number(100 * (data[i][1] / yesterdayClose - 1));
                    percentageyAxisMax = Number(100 * (data[i][1] / yesterdayClose - 1));
                    volume_yAxisMin = data[i][2];
                    volume_yAxisMax = data[i][2];
                } else {
                    //除了第一笔，其它都是  返回的 last_px 与前一个对比
                    if (data[i - 1][1] - data[i][1] > 0) {
                        columnColor = blue;
                    }
                    business_amount = data[i][2] - data[i - 1][2];
                }
                avg_pxyAxisMin = avg_pxyAxisMin > data[i][1] ? data[i][1] : avg_pxyAxisMin;
                avg_pxyAxisMax = avg_pxyAxisMax > data[i][1] ? avg_pxyAxisMax : data[i][1];
                percentageyAxisMin = percentageyAxisMin > Number(100 * (data[i][1] / yesterdayClose - 1)) ? Number(100 * (data[i][1] / yesterdayClose - 1)) : percentageyAxisMin;
                percentageyAxisMax = percentageyAxisMax > Number(100 * (data[i][1] / yesterdayClose - 1)) ? percentageyAxisMax : Number(100 * (data[i][1] / yesterdayClose - 1));
                volume_yAxisMin = volume_yAxisMin > business_amount ? business_amount : volume_yAxisMin;
                volume_yAxisMax = volume_yAxisMax > business_amount ? volume_yAxisMax : business_amount;
                //将数据放入 price_trend volume 数组中
                if (i < 241) {
                    price_trend.push({
                        x: dateUTC,
                        y: Number(data[i][1])
                    });
                }
                if (i >= 241) {

                    price_trend_h.push({
                        x: dateUTC,
                        y: Number(data[i][1])
                    });
                }
                if (i == 241) {
                    aa_1 = data[i][2]
                }

                avg_prices.push({
                    x: dateUTC,
                    y: Number(data[i][3])
                });

                // price_trend.push({
                //     x: dateUTC,
                //     y: Number(data[i][1])
                // });
                volume.push({
                    x: dateUTC,
                    y: Number(business_amount),
                    color: columnColor
                });
            }

            //将剩下的时间信息补全
            appendTimeMessage(price_trend, volume, data, true);
            appendTimeMessage(avg_prices, volume, data, true);
            //常量本地化
            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });

            var date;
            if (data.length > 0) {
                date = data[data.length - 1][0] + "";
                var dArr = new Array();
                for (var hh = 0; hh < 5; hh++) {
                    var numb;
                    if (hh == 0) {
                        numb = Number(date.slice(0, 4));
                    } else {
                        numb = Number(date.slice((hh - 1) * 2 + 4, hh * 2 + 4));
                    }

                    dArr.push(numb);
                }
            }
            var last_dataTime = new Date(dArr[0], dArr[1] - 1, dArr[2], dArr[3], dArr[4]);
            var $reporting = $("#report");
            $reporting.html("");
            // Create the chart
            var am_startTime = new Date(last_dataTime);
            am_startTime.setHours(1, 30, 0, 0);
            var am_startTimeUTC = convertDateToUTC(am_startTime);
            var am_midTime = new Date(last_dataTime);
            am_midTime.setHours(2, 30, 0, 0);
            var am_midTimeUTC = convertDateToUTC(am_midTime);

            //股票交易早上最后的时间
            var am_lastTime = new Date(last_dataTime);
            am_lastTime.setHours(3, 30, 0, 0);
            var am_lastTimeUTC = convertDateToUTC(am_lastTime);

            //股票交易下午最后的时间
            var pm_startTime = new Date(last_dataTime);
            pm_startTime.setHours(5, 1, 0, 0);
            var pm_startTimeUTC = convertDateToUTC(pm_startTime);

            var pm_midTime = new Date(last_dataTime);
            pm_midTime.setHours(6, 0, 0, 0);
            var pm_midTimeUTC = convertDateToUTC(pm_midTime);

            var pm_lastTime = new Date(last_dataTime);
            pm_lastTime.setHours(7, 0, 0, 0);
            var pm_lastTimeUTC = convertDateToUTC(pm_lastTime);

            var pm_lastTimeone = new Date(last_dataTime);
            pm_lastTimeone.setHours(7, 30, 0, 0);
            var pm_lastTimeoneUTC = convertDateToUTC(pm_lastTimeone);


            var pm_lastTime_kcb = new Date(last_dataTime);
            pm_lastTime_kcb.setHours(7, 0, 0, 0);
            var pm_lastTime_kcb = convertDateToUTC(pm_lastTime_kcb);

            var pm_startTime_kcb = new Date(last_dataTime);
            pm_startTime_kcb.setHours(7, 5, 0, 0);
            var pm_startTime_kcb = convertDateToUTC(pm_startTime_kcb);
            //----------------------------------------------------------
            // Create the chart
            obj.id.highcharts('StockChart', {
                chart: {
                    //关闭平移
                    panning: false,
                    zoomType: 'none',
                    pinchType: 'none',
                    renderTo: "line_map",
                    margin: [10, 5, 20, 48],
                    spacing: [0, 0, 0, 0],
                    plotBorderColor: '#3C94C4',
                    plotBorderWidth: 0, //边框
                    events: {
                        load: function() {
                            var chart = obj.id.highcharts(); // Highcharts构造函数
                            //基准线
                            chart.yAxis[0].addPlotLine({ //在x轴上增加
                                value: yesterdayClose, //在值为2的地方             //在x轴上增加
                                width: 2, //标示线的宽度为2px
                                color: '#CCC', //标示线的颜色
                                zIndex: 1,
                                id: 'plot-line-' //标示线的id，在删除该标示线的时候需要该id标示
                            });
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    valueDecinale: 2,
                    useHTML: true,
                    formatter: function() {
                        //var _name = this.points[1].series.name;
                        //console.log(this);
                        var _name = obj.codeName;
                        var _date = Highcharts.dateFormat('%b%e日,%A,%H:%M', this.x);
                        var _y = this.points[0].y.toFixed(2);
                        return '<p style="margin:0px;padding:0px;font-size:14px;"><span>' + _name + '   </span><span style="' + Comparative(_y, obj.prev_close) + ';">' + _y + '</span></p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>';
                        //var _yy = this.points[2].y;
                        //return '<p style="margin:0px;padding:0px;font-size:14px;">' + _name +  ' <span style="'+Comparative(_y,obj.prev_close)+';float:right;">'+_y+ '</span></p><p style="margin:0px;padding:0px;font-size:14px;">'+
                        //'成交量：' + ' <span style="float:right;">'+(_yy).toFixed(0)+ '</p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>'
                    }
                },
                plotOptions: {
                    series: {
                        /*关闭动画*/
                        animation: false
                    }
                },
                rangeSelector: {
                    enabled: false
                },
                /*导出配置*/
                exporting: {
                    enabled: false
                },
                /*创建者信息*/
                credits: {
                    enabled: false
                },
                /*下部时间拖拉选择*/
                navigator: {
                    enabled: false,
                    /*关闭时间选择*/
                    baseseries: 10
                },
                scrollbar: {
                    enabled: false /*关闭下方滚动条*/
                },
                /*底部滚动条*/
                scrollbar: {
                    enabled: false
                },

                xAxis: {
                    //type: 'datetime',
                    ordinal: false,
                    breaks: [{ // Nights
                        breakSize: 1,
                        from: am_lastTimeUTC,
                        to: pm_startTimeUTC
                    }, {
                        from: pm_lastTime_kcb,
                        to: pm_startTime_kcb,
                        breakSize: 1
                    }],
                    //minRange: 14 * 24 * 36000, // fourteen days
                    showFirstLabel: true,
                    showLastLabel: true,
                    scrollbar: {
                        enabled: true
                    },
                    labels: {
                        // staggerLines:5
                        style: { //字体样式
                            font: 'normal 12px'
                        },
                        formatter: function() {
                            var returnTime = Highcharts.dateFormat('%H:%M', this.value);
                            if (returnTime == "09:30") {
                                return '<span style="margin-left:25px;color:#aaa">09:30</span>';
                            }
                            if (returnTime == "11:30") {
                                return '<span style="color:#aaa">11:30/13:00</span>';
                            }
                            if (returnTime == "10:30") {
                                return "";
                            }
                            if (returnTime == "14:00") {
                                return "";
                            }
                            if (returnTime == "15:00") {
                                return '';
                            }
                            if (returnTime == "15:30") {
                                return '<span style="margin-right:40px;color:#aaa">15:30</span>';
                            }

                            return returnTime;

                        },
                        y: 15,
                        step: 1,
                        useHTML: true
                    },
                    tickLength: 5,
                    tickPositioner: function() {
                        var positions = [am_startTimeUTC, am_midTimeUTC, am_lastTimeUTC, pm_midTimeUTC, pm_lastTimeUTC, pm_lastTimeoneUTC];
                        //var positions = [am_startTimeUTC,  am_lastTimeUTC,pm_lastTimeUTC];
                        return positions;
                    },
                    gridLineDashStyle: 'ShortDash',
                    gridLineColor: '#f2f2f2',
                    gridLineWidth: 1
                },
                yAxis: [{
                        opposite: false, //是否把它显示到另一边（右边）
                        labels: {
                            enabled: false
                        },
                        title: {
                            text: ''
                        },
                        top: '0%',
                        height: '100%',
                        width: '90%',
                        lineWidth: 0,
                        showFirstLabel: false,
                        showLastLabel: false,
                        gridLineWidth: 0,
                        x: 0,
                        y: 0,
                        tickPositioner: function() { //以yesterdayClose为界限，统一间隔值，从 最小到最大步进
                            positions = [
                                (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(2), (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(2),
                                obj.prev_close.toFixed(2), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(2), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(2)
                            ];
                            return positions;
                        }
                    }, //y1
                    {
                        opposite: false, //是否把它显示到另一边（右边）
                        showFirstLabel: true,
                        showLastLabel: true,
                        labels: {
                            enabled: true,
                            overflow: 'justify',
                            style: { //字体样式
                                font: 'normal 12px'
                            },
                            align: 'right',
                            x: -5,
                            y: 6,
                            formatter: function() { //最新价  px_last/preclose昨收盘-1
                                //return 100*(((this.value/yesterdayClose)-1).toFixed(4))+"%";
                                return '<span style="color:#aaa;">' + this.value + '</span>';
                            }
                        },
                        useHTML: true,
                        title: {
                            text: ''
                        },
                        lineWidth: 0.5,
                        top: '0%',
                        height: '100%',
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        tickPositioner: function() {
                            return positions;
                        }
                    }
                ],
                series: [{
                    name: obj.codeName,
                    data: price_trend,
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    name: obj.codeName,
                    data: price_trend,
                    type: 'line',
                    lineWidth: 0.5,
                    cursor: 'pointer',
                    onSeries: 'candlestick',
                    color: 'transparent',
                    style: {
                        fontSize: '0px',
                        fontWeight: '0',
                        textAlign: 'center'
                    },
                    zIndex: -1000,
                    yAxis: 1,
                    fillColor: {
                        linearGradient: { //渐变方向
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    name: obj.codeName,
                    data: price_trend_h,
                    yAxis: 0,
                    color: '#f22',
                    marker: {
                        fillColor: '#f22',
                        lineWidth: 1,
                        symbol: 'circle',
                        lineColor: '#f1a8a8'
                    },
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    name: obj.codeName,
                    data: price_trend_h,
                    type: 'line',
                    lineWidth: 0.5,
                    cursor: 'pointer',
                    onSeries: 'candlestick',
                    color: '#f22',
                    style: {
                        fontSize: '0px',
                        fontWeight: '0',
                        textAlign: 'center'
                    },
                    marker: {
                        fillColor: '#f22',
                        lineWidth: 1,
                        symbol: 'circle',
                        lineColor: '#f1a8a8'
                    },
                    zIndex: -1000,
                    yAxis: 1,
                    fillColor: {
                        linearGradient: { //渐变方向
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    dataGrouping: {
                        units: groupingUnits
                    }
                }]
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //返回错误信息
            //console.log("Ajax返回错误信息:"+XMLHttpRequest.status+"~"+XMLHttpRequest.readyState+"~"+textStatus);
        }
    });
}


/*
-----------------------------------------------------------首页-数据-行情信息总览-市场数据－基金------------------------------------------------------
*/
function dataScsjAjax_jj(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/list/self/" + obj.code,
        jsonp: "callback",
        data: {
            select: 'last,open,name,high,low,change,chg_rate,prev_close,volume,amount,tradephase'
        },
        cache: false,
        success: function(resultData) {
            var _snap_val = resultData.list;
            var _date = resultData.date + "";
            var _dDate = _date.substring(0, _date.length - 4) + "-" + _date.substring(_date.length - 4, _date.length - 2) + "-" + _date.substring(_date.length - 2);
            var _timer = resultData.time + "";
            var _dTime = _timer.substring(0, _timer.length - 4) + ":" + _timer.substring(_timer.length - 4, _timer.length - 2) + ":" + _timer.substring(_timer.length - 2);
            var _last = _snap_val[0][0];
            var _open = _snap_val[0][1];
            var _name = _snap_val[0][2];
            var _high = _snap_val[0][3];
            var _low = _snap_val[0][4];
            var _change = _snap_val[0][5];
            var _chg_rate = _snap_val[0][6];
            var _prev_close = _snap_val[0][7];
            var _volume = _snap_val[0][8];
            var _amount = _snap_val[0][9];
            var _tradephase = _snap_val[0][10];
            obj.dtId.find("h1:eq(0)").html(obj.code);
            obj.dtId.find("h1:eq(1)").html(_name);
            var detaTab = [];
            detaTab.push("<li><span class='span_a'>现价</span><span class='span_b' style='" + Comparative(_last, _prev_close) + "'>" + _last.toFixed(3) + "</span></li>");
            detaTab.push("<li><span class='span_a'>涨跌</span><span class='span_b' style='" + Comparative(_change, 0) + "'>" + _change.toFixed(3) + "</span></li>");
            detaTab.push("<li><span class='span_a'>涨跌幅</span><span class='span_b' style='" + Comparative(_chg_rate, 0) + "'>" + _chg_rate.toFixed(2) + "%</span></li>");
            detaTab.push("<li><span class='span_a'>昨收</span><span class='span_b'>" + _prev_close.toFixed(3) + "</span></li>");
            detaTab.push("<li><span class='span_a'>开盘</span><span class='span_b' style='" + Comparative(_open, _prev_close) + "'>" + _open.toFixed(3) + "</span></li>");
            detaTab.push("<li><span class='span_a'>最高</span><span class='span_b' style='" + Comparative(_high, _prev_close) + "'>" + _high.toFixed(3) + "</span></li>");
            detaTab.push("<li><span class='span_a'>最低</span><span class='span_b' style='" + Comparative(_low, _prev_close) + "'>" + _low.toFixed(3) + "</span></li>");
            detaTab.push("<li><span class='span_a'>总量</span><span class='span_b'>" + Number(_volume / 100).toFixed(0) + " 手</span></li>");
            detaTab.push("<li><span class='span_a'>总额</span><span class='span_b'>" + Number(_amount / 10000).toFixed(0) + " 万元</span></li>");
            detaTab.push("<li><span class='span_a'>时间</span><span class='span_b'>" + _dTime + "</span></li>");
            detaTab.push("<li><span class='span_a'>日期</span><span class='span_b'>" + _dDate + "</span></li>"); //===== by WHJ
            detaTab.push("<li><span class='span_a'>交易状态</span><span class='span_b'>" + checkStatus(_tradephase) + "</span></li>");
            obj.dtId.find("ul").html(detaTab.join(""));

            if (_tradephase.replace(/\s/ig, '') == "P1") {
                obj.id.html('<center style="margin-top:40%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 20px;">停牌中</span></center>');
            } else if (_tradephase.replace(/\s/ig, '') == "C1") {
                obj.id.html('<center style="margin-top:40%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 20px;">集合竞价中</span></center>');
            } else {
                if (checkBrowser()) {
                    dataScsjSearch_jj({
                        id: obj.id,
                        code: obj.code,
                        last: _last,
                        codeName: _name,
                        open: _open,
                        high: _high,
                        low: _low,
                        prev_close: _prev_close
                    });
                }
            }
        }
    })
}

function dataScsjSearch_jj(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        //v1/sh1/list/self/
        url: hq_queryUrl + "/v1/sh1/line/" + obj.code,
        data: {
            begin: 0,
            end: -1,
            select: 'time,price,volume'
        },
        jsonp: "callback",
        cache: false,
        success: function(resultData) {
            var dd = resultData;
            var d = dateConvert({
                data: dd,
                last: obj.last,
                open: obj.open
            });
            //var data = null;
            var data = d.line;
            //没数据时不显示图表
            if (data.length == 0) {
                //obj.id.html("<div class='chart_container'></div>");
                obj.id.css({
                    "border": "1px solid #CCC"
                });
                return;
            }
            Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                lang: {
                    loading: "加载中",
                    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    noData: "没有数据",
                    numericSymbols: ["千", "兆", "G", "T", "P", "E"],
                    printChart: "打印图表",
                    resetZoom: "恢复缩放",
                    resetZoomTitle: "恢复图表",
                    shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    thousandsSep: ",",
                    weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
                }
            });
            //初始化开------------------------
            var groupingUnits = [
                [
                    'minute', // unit name
                    [1] // allowed multiples
                ]
            ];
            var avg_pxyAxisMin; //Y轴最小值
            var avg_pxyAxisMax; //Y轴最大值 
            var percentageyAxisMin; //Y轴百分比最小
            var percentageyAxisMax; //Y轴百分比最大
            var volume_yAxisMin; //成交量最小
            var volume_yAxisMax; //成交量最大
            var red = "#ff0000";
            var blue = "#00a800";
            var price_trend = [],
                volume = [], //成交量
                i = 0;
            //图表上的成交量第一条的数据红绿的判断 是根据昨日的收盘价preclose_px 和今日的最新价last_px进行对比
            //同时获取的昨日收盘价  用于涨幅的计算
            var isFirstLineColorflag = true;
            //保存昨收数据
            var yesterdayClose;
            //容错判断
            if (data != undefined && data != null && data.length == 0) {
                try {
                    failCallback();
                } catch (e) {

                }
                return;
            }
            //今开
            var open_px = data[i][1];
            //昨收
            //var preclose_px=data[i][3];
            var preclose_px = d.prev_close;
            yesterdayClose = preclose_px;
            isFirstLineColorflag = open_px > preclose_px ? true : false;
            // split the data set into price_trend and volume
            //数据处理
            for (i; i < data.length; i += 1) {
                var _dates = data[i][0] + "";
                var _hours = _dates.substring(8, 10);
                var dateUTC = getDateUTCOrNot(_dates, true);
                var business_amount = data[i][2];
                var columnColor = red;
                if (i == 0) { //第一笔的 红绿柱 判断依据是根据 今天开盘价与昨日收盘价比较
                    if (isFirstLineColorflag == false) {
                        columnColor = blue;
                    }
                    avg_pxyAxisMin = data[i][1];
                    avg_pxyAxisMax = data[i][1];
                    percentageyAxisMin = Number(100 * (data[i][1] / yesterdayClose - 1));
                    percentageyAxisMax = Number(100 * (data[i][1] / yesterdayClose - 1));
                    volume_yAxisMin = data[i][2];
                    volume_yAxisMax = data[i][2];
                } else {
                    //除了第一笔，其它都是  返回的 last_px 与前一个对比
                    if (data[i - 1][1] - data[i][1] > 0) {
                        columnColor = blue;
                    }
                    business_amount = data[i][2] - data[i - 1][2];
                }
                avg_pxyAxisMin = avg_pxyAxisMin > data[i][1] ? data[i][1] : avg_pxyAxisMin;
                avg_pxyAxisMax = avg_pxyAxisMax > data[i][1] ? avg_pxyAxisMax : data[i][1];
                percentageyAxisMin = percentageyAxisMin > Number(100 * (data[i][1] / yesterdayClose - 1)) ? Number(100 * (data[i][1] / yesterdayClose - 1)) : percentageyAxisMin;
                percentageyAxisMax = percentageyAxisMax > Number(100 * (data[i][1] / yesterdayClose - 1)) ? percentageyAxisMax : Number(100 * (data[i][1] / yesterdayClose - 1));
                volume_yAxisMin = volume_yAxisMin > business_amount ? business_amount : volume_yAxisMin;
                volume_yAxisMax = volume_yAxisMax > business_amount ? volume_yAxisMax : business_amount;
                //将数据放入 price_trend volume 数组中

                price_trend.push({
                    x: dateUTC,
                    y: Number(data[i][1])
                });
                volume.push({
                    x: dateUTC,
                    y: Number(business_amount),
                    color: columnColor
                });
            }

            //将剩下的时间信息补全
            appendTimeMessage(price_trend, volume, data);
            //常量本地化
            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });

            var date;
            if (data.length > 0) {
                date = data[data.length - 1][0] + "";
                var dArr = new Array();
                for (var hh = 0; hh < 5; hh++) {
                    var numb;
                    if (hh == 0) {
                        numb = Number(date.slice(0, 4));
                    } else {
                        numb = Number(date.slice((hh - 1) * 2 + 4, hh * 2 + 4));
                    }

                    dArr.push(numb);
                }
            }
            var last_dataTime = new Date(dArr[0], dArr[1] - 1, dArr[2], dArr[3], dArr[4]);
            var $reporting = $("#report");
            $reporting.html("");
            // Create the chart
            var am_startTime = new Date(last_dataTime);
            am_startTime.setHours(1, 30, 0, 0);
            var am_startTimeUTC = convertDateToUTC(am_startTime);
            var am_midTime = new Date(last_dataTime);
            am_midTime.setHours(2, 30, 0, 0);
            var am_midTimeUTC = convertDateToUTC(am_midTime);

            //股票交易早上最后的时间
            var am_lastTime = new Date(last_dataTime);
            am_lastTime.setHours(3, 30, 0, 0);
            var am_lastTimeUTC = convertDateToUTC(am_lastTime);

            //股票交易下午最后的时间
            var pm_startTime = new Date(last_dataTime);
            pm_startTime.setHours(5, 1, 0, 0);
            var pm_startTimeUTC = convertDateToUTC(pm_startTime);

            var pm_midTime = new Date(last_dataTime);
            pm_midTime.setHours(6, 0, 0, 0);
            var pm_midTimeUTC = convertDateToUTC(pm_midTime);

            var pm_lastTime = new Date(last_dataTime);
            pm_lastTime.setHours(7, 0, 0, 0);
            var pm_lastTimeUTC = convertDateToUTC(pm_lastTime);


            //----------------------------------------------------------
            // Create the chart
            obj.id.highcharts('StockChart', {
                chart: {
                    //关闭平移
                    panning: false,
                    zoomType: 'none',
                    pinchType: 'none',
                    renderTo: "line_map",
                    margin: [10, 5, 20, 46],
                    spacing: [0, 0, 0, 0],
                    plotBorderColor: '#3C94C4',
                    plotBorderWidth: 0, //边框
                    events: {
                        load: function() {
                            var chart = obj.id.highcharts(); // Highcharts构造函数
                            //基准线
                            chart.yAxis[0].addPlotLine({ //在x轴上增加
                                value: yesterdayClose, //在值为2的地方             //在x轴上增加
                                width: 2, //标示线的宽度为2px
                                color: '#CCC', //标示线的颜色
                                zIndex: 1,
                                id: 'plot-line-' //标示线的id，在删除该标示线的时候需要该id标示
                            });
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    valueDecinale: 2,
                    useHTML: true,
                    formatter: function() {
                        //var _name = this.points[1].series.name;
                        //console.log(this);
                        var _name = obj.codeName;
                        var _date = Highcharts.dateFormat('%b%e日,%A,%H:%M', this.x);
                        var _y = this.points[0].y.toFixed(3);
                        return '<p style="margin:0px;padding:0px;font-size:14px;"><span>' + _name + '   </span><span style="' + Comparative(_y, obj.prev_close) + ';">' + _y + '</span></p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>';
                        //var _yy = this.points[2].y;
                        //return '<p style="margin:0px;padding:0px;font-size:14px;">' + _name +  ' <span style="'+Comparative(_y,obj.prev_close)+';float:right;">'+_y+ '</span></p><p style="margin:0px;padding:0px;font-size:14px;">'+
                        //'成交量：' + ' <span style="float:right;">'+(_yy).toFixed(0)+ '</p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>'
                    }
                },
                plotOptions: {
                    series: {
                        /*关闭动画*/
                        animation: false
                    }
                },
                rangeSelector: {
                    enabled: false
                },
                /*导出配置*/
                exporting: {
                    enabled: false
                },
                /*创建者信息*/
                credits: {
                    enabled: false
                },
                /*下部时间拖拉选择*/
                navigator: {
                    enabled: false,
                    /*关闭时间选择*/
                    baseseries: 10
                },
                scrollbar: {
                    enabled: false /*关闭下方滚动条*/
                },
                /*底部滚动条*/
                scrollbar: {
                    enabled: false
                },

                xAxis: {
                    //type: 'datetime',
                    ordinal: false,
                    breaks: [{ // Nights
                        breakSize: 1,
                        from: am_lastTimeUTC,
                        to: pm_startTimeUTC
                    }],
                    //minRange: 14 * 24 * 36000, // fourteen days
                    showFirstLabel: true,
                    showLastLabel: true,
                    scrollbar: {
                        enabled: true
                    },
                    labels: {
                        // staggerLines:5
                        style: { //字体样式
                            font: 'normal 12px'
                        },
                        formatter: function() {
                            //var returnTime=Highcharts.dateFormat('%H:%M', this.value-Number(8 * 3600 * 1000));
                            var returnTime = Highcharts.dateFormat('%H:%M', this.value);
                            if (returnTime == "09:30") {
                                return '<span style="margin-left:33px;color:#aaa">09:30</span>';
                            }
                            if (returnTime == "11:30") {
                                return '<span style="color:#aaa">11:30/13:00</span>';
                            }
                            if (returnTime == "10:30") {
                                return "";
                            }
                            if (returnTime == "14:00") {
                                return "";
                            }
                            if (returnTime == "15:00") {
                                return '<span style="margin-right:35px;color:#aaa">15:00</span>';
                            }
                            return returnTime;

                        },
                        y: 15,
                        step: 1,
                        useHTML: true
                    },
                    tickLength: 5,
                    tickPositioner: function() {
                        var positions = [am_startTimeUTC, am_midTimeUTC, am_lastTimeUTC, pm_midTimeUTC, pm_lastTimeUTC];
                        //var positions = [am_startTimeUTC,  am_lastTimeUTC,pm_lastTimeUTC];
                        return positions;
                    },
                    gridLineDashStyle: 'ShortDash',
                    gridLineColor: '#f2f2f2',
                    gridLineWidth: 1
                },
                yAxis: [{
                        opposite: false, //是否把它显示到另一边（右边）
                        labels: {
                            enabled: false
                        },
                        title: {
                            text: ''
                        },
                        top: '0%',
                        height: '100%',
                        width: '90%',
                        lineWidth: 0,
                        showFirstLabel: false,
                        showLastLabel: false,
                        gridLineWidth: 0,
                        x: 0,
                        y: 0,
                        tickPositioner: function() { //以yesterdayClose为界限，统一间隔值，从 最小到最大步进
                            positions = [
                                (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(3), (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(3),
                                obj.prev_close.toFixed(3), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(3), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(3)
                            ];
                            return positions;
                        }
                    }, //y1
                    {
                        opposite: false, //是否把它显示到另一边（右边）
                        showFirstLabel: true,
                        showLastLabel: true,
                        labels: {
                            enabled: true,
                            overflow: 'justify',
                            style: { //字体样式
                                font: 'normal 12px'
                            },
                            align: 'right',
                            x: -5,
                            y: 6,
                            formatter: function() { //最新价  px_last/preclose昨收盘-1
                                //return 100*(((this.value/yesterdayClose)-1).toFixed(4))+"%";
                                return '<span style="color:#aaa;">' + this.value + '</span>';
                            }
                        },
                        useHTML: true,
                        title: {
                            text: ''
                        },
                        lineWidth: 0.5,
                        top: '0%',
                        height: '100%',
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        tickPositioner: function() {
                            return positions;
                        }
                    }
                ],
                series: [{
                    name: obj.codeName,
                    data: price_trend,
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    name: obj.codeName,
                    data: price_trend,
                    type: 'line',
                    lineWidth: 0.5,
                    cursor: 'pointer',
                    onSeries: 'candlestick',
                    color: 'transparent',
                    style: {
                        fontSize: '0px',
                        fontWeight: '0',
                        textAlign: 'center'
                    },
                    zIndex: -1000,
                    yAxis: 1,
                    fillColor: {
                        linearGradient: { //渐变方向
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    dataGrouping: {
                        units: groupingUnits
                    }
                }]
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //返回错误信息
            //console.log("Ajax返回错误信息:"+XMLHttpRequest.status+"~"+XMLHttpRequest.readyState+"~"+textStatus);
        }
    });
}
/*
-----------------------------------------------------------首页-数据-行情信息总览-市场数据－B股------------------------------------------------------
*/
function dataScsjAjax_qq(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/list/self/" + obj.code,
        jsonp: "callback",
        data: {
            select: 'last,open,name,high,low,change,chg_rate,prev_close,volume,amount,tradephase'
        },
        cache: false,
        success: function(resultData) {
            var _snap_val = resultData.list;
            var _date = resultData.date + "";
            var _dDate = _date.substring(0, _date.length - 4) + "-" + _date.substring(_date.length - 4, _date.length - 2) + "-" + _date.substring(_date.length - 2);
            var _timer = resultData.time + "";
            var _dTime = _timer.substring(0, _timer.length - 4) + ":" + _timer.substring(_timer.length - 4, _timer.length - 2) + ":" + _timer.substring(_timer.length - 2);
            var _last = _snap_val[0][0];
            var _open = _snap_val[0][1];
            var _name = _snap_val[0][2];
            var _high = _snap_val[0][3];
            var _low = _snap_val[0][4];
            var _change = _snap_val[0][5];
            var _chg_rate = _snap_val[0][6];
            var _prev_close = _snap_val[0][7];
            var _volume = _snap_val[0][8];
            var _amount = _snap_val[0][9];
            var _tradephase = _snap_val[0][10];
            obj.dtId.find("h1:eq(0)").html(obj.code);
            obj.dtId.find("h1:eq(1)").html(_name);
            var detaTab = [];
            detaTab.push("<li><span class='span_a'>现价</span><span class='span_b' style='" + Comparative(_last, _prev_close) + "'>" + _last.toFixed(3) + "</span></li>");
            detaTab.push("<li><span class='span_a'>涨跌</span><span class='span_b' style='" + Comparative(_change, 0) + "'>" + _change.toFixed(3) + "</span></li>");
            detaTab.push("<li><span class='span_a'>涨跌幅</span><span class='span_b' style='" + Comparative(_chg_rate, 0) + "'>" + _chg_rate.toFixed(2) + "%</span></li>");
            detaTab.push("<li><span class='span_a'>昨收</span><span class='span_b'>" + _prev_close.toFixed(3) + "</span></li>");
            detaTab.push("<li><span class='span_a'>开盘</span><span class='span_b' style='" + Comparative(_open, _prev_close) + "'>" + _open.toFixed(3) + "</span></li>");
            detaTab.push("<li><span class='span_a'>最高</span><span class='span_b' style='" + Comparative(_high, _prev_close) + "'>" + _high.toFixed(3) + "</span></li>");
            detaTab.push("<li><span class='span_a'>最低</span><span class='span_b' style='" + Comparative(_low, _prev_close) + "'>" + _low.toFixed(3) + "</span></li>");
            detaTab.push("<li><span class='span_a'>总量</span><span class='span_b'>" + Number(_volume / 100).toFixed(0) + " 手</span></li>");
            detaTab.push("<li><span class='span_a'>总额</span><span class='span_b'>" + Number(_amount / 10000).toFixed(0) + " 万美元</span></li>");
            detaTab.push("<li><span class='span_a'>时间</span><span class='span_b'>" + _dTime + "</span></li>");
            detaTab.push("<li><span class='span_a'>日期</span><span class='span_b'>" + _dDate + "</span></li>"); //===== by WHJ
            detaTab.push("<li><span class='span_a'>交易状态</span><span class='span_b'>" + checkStatus(_tradephase) + "</span></li>");
            obj.dtId.find("ul").html(detaTab.join(""));

            if (_tradephase.replace(/\s/ig, '') == "P1") {
                obj.id.html('<center style="margin-top:40%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 20px;">停牌中</span></center>');
            } else if (_tradephase.replace(/\s/ig, '') == "C1") {
                obj.id.html('<center style="margin-top:40%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 20px;">集合竞价中</span></center>');
            } else {
                if (checkBrowser()) {
                    dataScsjSearch_qq({
                        id: obj.id,
                        code: obj.code,
                        last: _last,
                        codeName: _name,
                        open: _open,
                        high: _high,
                        low: _low,
                        prev_close: _prev_close
                    });
                }
            }
        }
    })
}

function dataScsjSearch_qq(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        //v1/sh1/list/self/
        url: hq_queryUrl + "/v1/sh1/line/" + obj.code,
        data: {
            begin: 0,
            end: -1,
            select: 'time,price,volume'
        },
        jsonp: "callback",
        cache: false,
        success: function(resultData) {
            var dd = resultData;
            var d = dateConvert({
                data: dd,
                last: obj.last,
                open: obj.open
            });
            //var data = null;
            var data = d.line;
            //没数据时不显示图表
            if (data.length == 0) {
                //obj.id.html("<div class='chart_container'></div>");
                obj.id.css({
                    "border": "1px solid #CCC"
                });
                return;
            }
            Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                lang: {
                    loading: "加载中",
                    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    noData: "没有数据",
                    numericSymbols: ["千", "兆", "G", "T", "P", "E"],
                    printChart: "打印图表",
                    resetZoom: "恢复缩放",
                    resetZoomTitle: "恢复图表",
                    shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    thousandsSep: ",",
                    weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
                }
            });
            //初始化开------------------------
            var groupingUnits = [
                [
                    'minute', // unit name
                    [1] // allowed multiples
                ]
            ];
            var avg_pxyAxisMin; //Y轴最小值
            var avg_pxyAxisMax; //Y轴最大值 
            var percentageyAxisMin; //Y轴百分比最小
            var percentageyAxisMax; //Y轴百分比最大
            var volume_yAxisMin; //成交量最小
            var volume_yAxisMax; //成交量最大
            var red = "#ff0000";
            var blue = "#00a800";
            var price_trend = [],
                volume = [], //成交量
                i = 0;
            //图表上的成交量第一条的数据红绿的判断 是根据昨日的收盘价preclose_px 和今日的最新价last_px进行对比
            //同时获取的昨日收盘价  用于涨幅的计算
            var isFirstLineColorflag = true;
            //保存昨收数据
            var yesterdayClose;
            //容错判断
            if (data != undefined && data != null && data.length == 0) {
                try {
                    failCallback();
                } catch (e) {

                }
                return;
            }
            //今开
            var open_px = data[i][1];
            //昨收
            //var preclose_px=data[i][3];
            var preclose_px = d.prev_close;
            yesterdayClose = preclose_px;
            isFirstLineColorflag = open_px > preclose_px ? true : false;
            // split the data set into price_trend and volume
            //数据处理
            for (i; i < data.length; i += 1) {
                var _dates = data[i][0] + "";
                var _hours = _dates.substring(8, 10);
                var dateUTC = getDateUTCOrNot(_dates, true);
                var business_amount = data[i][2];
                var columnColor = red;
                if (i == 0) { //第一笔的 红绿柱 判断依据是根据 今天开盘价与昨日收盘价比较
                    if (isFirstLineColorflag == false) {
                        columnColor = blue;
                    }
                    avg_pxyAxisMin = data[i][1];
                    avg_pxyAxisMax = data[i][1];
                    percentageyAxisMin = Number(100 * (data[i][1] / yesterdayClose - 1));
                    percentageyAxisMax = Number(100 * (data[i][1] / yesterdayClose - 1));
                    volume_yAxisMin = data[i][2];
                    volume_yAxisMax = data[i][2];
                } else {
                    //除了第一笔，其它都是  返回的 last_px 与前一个对比
                    if (data[i - 1][1] - data[i][1] > 0) {
                        columnColor = blue;
                    }
                    business_amount = data[i][2] - data[i - 1][2];
                }
                avg_pxyAxisMin = avg_pxyAxisMin > data[i][1] ? data[i][1] : avg_pxyAxisMin;
                avg_pxyAxisMax = avg_pxyAxisMax > data[i][1] ? avg_pxyAxisMax : data[i][1];
                percentageyAxisMin = percentageyAxisMin > Number(100 * (data[i][1] / yesterdayClose - 1)) ? Number(100 * (data[i][1] / yesterdayClose - 1)) : percentageyAxisMin;
                percentageyAxisMax = percentageyAxisMax > Number(100 * (data[i][1] / yesterdayClose - 1)) ? percentageyAxisMax : Number(100 * (data[i][1] / yesterdayClose - 1));
                volume_yAxisMin = volume_yAxisMin > business_amount ? business_amount : volume_yAxisMin;
                volume_yAxisMax = volume_yAxisMax > business_amount ? volume_yAxisMax : business_amount;
                //将数据放入 price_trend volume 数组中

                price_trend.push({
                    x: dateUTC,
                    y: Number(data[i][1])
                });
                volume.push({
                    x: dateUTC,
                    y: Number(business_amount),
                    color: columnColor
                });
            }

            //将剩下的时间信息补全
            appendTimeMessage(price_trend, volume, data);
            //常量本地化
            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });

            var date;
            if (data.length > 0) {
                date = data[data.length - 1][0] + "";
                var dArr = new Array();
                for (var hh = 0; hh < 5; hh++) {
                    var numb;
                    if (hh == 0) {
                        numb = Number(date.slice(0, 4));
                    } else {
                        numb = Number(date.slice((hh - 1) * 2 + 4, hh * 2 + 4));
                    }

                    dArr.push(numb);
                }
            }
            var last_dataTime = new Date(dArr[0], dArr[1] - 1, dArr[2], dArr[3], dArr[4]);
            var $reporting = $("#report");
            $reporting.html("");
            // Create the chart
            var am_startTime = new Date(last_dataTime);
            am_startTime.setHours(1, 30, 0, 0);
            var am_startTimeUTC = convertDateToUTC(am_startTime);
            var am_midTime = new Date(last_dataTime);
            am_midTime.setHours(2, 30, 0, 0);
            var am_midTimeUTC = convertDateToUTC(am_midTime);

            //股票交易早上最后的时间
            var am_lastTime = new Date(last_dataTime);
            am_lastTime.setHours(3, 30, 0, 0);
            var am_lastTimeUTC = convertDateToUTC(am_lastTime);

            //股票交易下午最后的时间
            var pm_startTime = new Date(last_dataTime);
            pm_startTime.setHours(5, 1, 0, 0);
            var pm_startTimeUTC = convertDateToUTC(pm_startTime);

            var pm_midTime = new Date(last_dataTime);
            pm_midTime.setHours(6, 0, 0, 0);
            var pm_midTimeUTC = convertDateToUTC(pm_midTime);

            var pm_lastTime = new Date(last_dataTime);
            pm_lastTime.setHours(7, 0, 0, 0);
            var pm_lastTimeUTC = convertDateToUTC(pm_lastTime);


            //----------------------------------------------------------
            // Create the chart
            obj.id.highcharts('StockChart', {
                chart: {
                    //关闭平移
                    panning: false,
                    zoomType: 'none',
                    pinchType: 'none',
                    renderTo: "line_map",
                    margin: [10, 5, 20, 52],
                    spacing: [0, 0, 0, 0],
                    plotBorderColor: '#3C94C4',
                    plotBorderWidth: 0, //边框
                    events: {
                        load: function() {
                            var chart = obj.id.highcharts(); // Highcharts构造函数
                            //基准线
                            chart.yAxis[0].addPlotLine({ //在x轴上增加
                                value: yesterdayClose, //在值为2的地方             //在x轴上增加
                                width: 2, //标示线的宽度为2px
                                color: '#CCC', //标示线的颜色
                                zIndex: 1,
                                id: 'plot-line-' //标示线的id，在删除该标示线的时候需要该id标示
                            });
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    valueDecinale: 2,
                    useHTML: true,
                    formatter: function() {
                        //var _name = this.points[1].series.name;
                        //console.log(this);
                        var _name = obj.codeName;
                        var _date = Highcharts.dateFormat('%b%e日,%A,%H:%M', this.x);
                        var _y = this.points[0].y.toFixed(3);
                        return '<p style="margin:0px;padding:0px;font-size:14px;"><span>' + _name + '   </span><span style="' + Comparative(_y, obj.prev_close) + ';">' + _y + '</span></p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>';
                        //var _yy = this.points[2].y;
                        //return '<p style="margin:0px;padding:0px;font-size:14px;">' + _name +  ' <span style="'+Comparative(_y,obj.prev_close)+';float:right;">'+_y+ '</span></p><p style="margin:0px;padding:0px;font-size:14px;">'+
                        //'成交量：' + ' <span style="float:right;">'+(_yy).toFixed(0)+ '</p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>'
                    }
                },
                plotOptions: {
                    series: {
                        /*关闭动画*/
                        animation: false
                    }
                },
                rangeSelector: {
                    enabled: false
                },
                /*导出配置*/
                exporting: {
                    enabled: false
                },
                /*创建者信息*/
                credits: {
                    enabled: false
                },
                /*下部时间拖拉选择*/
                navigator: {
                    enabled: false,
                    /*关闭时间选择*/
                    baseseries: 10
                },
                scrollbar: {
                    enabled: false /*关闭下方滚动条*/
                },
                /*底部滚动条*/
                scrollbar: {
                    enabled: false
                },

                xAxis: {
                    //type: 'datetime',
                    ordinal: false,
                    breaks: [{ // Nights
                        breakSize: 1,
                        from: am_lastTimeUTC,
                        to: pm_startTimeUTC
                    }],
                    //minRange: 14 * 24 * 36000, // fourteen days
                    showFirstLabel: true,
                    showLastLabel: true,
                    scrollbar: {
                        enabled: true
                    },
                    labels: {
                        // staggerLines:5
                        style: { //字体样式
                            font: 'normal 12px'
                        },
                        formatter: function() {
                            //var returnTime=Highcharts.dateFormat('%H:%M', this.value-Number(8 * 3600 * 1000));
                            var returnTime = Highcharts.dateFormat('%H:%M', this.value);
                            if (returnTime == "09:30") {
                                return '<span style="margin-left:33px;color:#aaa">09:30</span>';
                            }
                            if (returnTime == "11:30") {
                                return '<span style="color:#aaa">11:30/13:00</span>';
                            }
                            if (returnTime == "10:30") {
                                return "";
                            }
                            if (returnTime == "14:00") {
                                return "";
                            }
                            if (returnTime == "15:00") {
                                return '<span style="margin-right:35px;color:#aaa">15:00</span>';
                            }
                            return returnTime;

                        },
                        y: 15,
                        step: 1,
                        useHTML: true
                    },
                    tickLength: 5,
                    tickPositioner: function() {
                        var positions = [am_startTimeUTC, am_midTimeUTC, am_lastTimeUTC, pm_midTimeUTC, pm_lastTimeUTC];
                        //var positions = [am_startTimeUTC,  am_lastTimeUTC,pm_lastTimeUTC];
                        return positions;
                    },
                    gridLineDashStyle: 'ShortDash',
                    gridLineColor: '#f2f2f2',
                    gridLineWidth: 1
                },
                yAxis: [{
                        opposite: false, //是否把它显示到另一边（右边）
                        labels: {
                            enabled: false
                        },
                        title: {
                            text: ''
                        },
                        top: '0%',
                        height: '100%',
                        width: '90%',
                        lineWidth: 0,
                        showFirstLabel: false,
                        showLastLabel: false,
                        gridLineWidth: 0,
                        x: 0,
                        y: 0,
                        tickPositioner: function() { //以yesterdayClose为界限，统一间隔值，从 最小到最大步进
                            positions = [
                                (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(3), (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(3),
                                obj.prev_close.toFixed(3), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(3), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(3)
                            ];
                            return positions;
                        }
                    }, //y1
                    {
                        opposite: false, //是否把它显示到另一边（右边）
                        showFirstLabel: true,
                        showLastLabel: true,
                        labels: {
                            enabled: true,
                            overflow: 'justify',
                            style: { //字体样式
                                font: 'normal 12px'
                            },
                            align: 'right',
                            x: -5,
                            y: 6,
                            formatter: function() { //最新价  px_last/preclose昨收盘-1
                                //return 100*(((this.value/yesterdayClose)-1).toFixed(4))+"%";
                                return '<span style="color:#aaa;">' + this.value + '</span>';
                            }
                        },
                        useHTML: true,
                        title: {
                            text: ''
                        },
                        lineWidth: 0.5,
                        top: '0%',
                        height: '100%',
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        tickPositioner: function() {
                            return positions;
                        }
                    }
                ],
                series: [{
                    name: obj.codeName,
                    data: price_trend,
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    name: obj.codeName,
                    data: price_trend,
                    type: 'line',
                    lineWidth: 0.5,
                    cursor: 'pointer',
                    onSeries: 'candlestick',
                    color: 'transparent',
                    style: {
                        fontSize: '0px',
                        fontWeight: '0',
                        textAlign: 'center'
                    },
                    zIndex: -1000,
                    yAxis: 1,
                    fillColor: {
                        linearGradient: { //渐变方向
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    dataGrouping: {
                        units: groupingUnits
                    }
                }]
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //返回错误信息
            //console.log("Ajax返回错误信息:"+XMLHttpRequest.status+"~"+XMLHttpRequest.readyState+"~"+textStatus);
        }
    });
}
/*
-----------------------------------------------------------首页-数据-行情信息总览-市场数据－债券------------------------------------------------------
*/
function dataScsjAjax_zq(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/list/self/" + obj.code,
        jsonp: "callback",
        data: {
            select: 'last,open,name,high,low,change,chg_rate,prev_close,volume,amount,tradephase'
        },
        cache: false,
        success: function(resultData) {
            var _snap_val = resultData.list;
            var _date = resultData.date + "";
            var _dDate = _date.substring(0, _date.length - 4) + "-" + _date.substring(_date.length - 4, _date.length - 2) + "-" + _date.substring(_date.length - 2);
            var _timer = resultData.time + "";
            var _dTime = _timer.substring(0, _timer.length - 4) + ":" + _timer.substring(_timer.length - 4, _timer.length - 2) + ":" + _timer.substring(_timer.length - 2);
            var _last = _snap_val[0][0];
            var _open = _snap_val[0][1];
            var _name = _snap_val[0][2];
            var _high = _snap_val[0][3];
            var _low = _snap_val[0][4];
            var _change = _snap_val[0][5];
            var _chg_rate = _snap_val[0][6];
            var _prev_close = _snap_val[0][7];
            var _volume = _snap_val[0][8];
            var _amount = _snap_val[0][9];
            var _tradephase = _snap_val[0][10];
            obj.dtId.find("h1:eq(0)").html(obj.code);
            obj.dtId.find("h1:eq(1)").html(_name);
            var detaTab = [];
            detaTab.push("<li><span class='span_a'>现价</span><span class='span_b' style='" + Comparative(_last, _prev_close) + "'>" + _last.toFixed(2) + "</span></li>");
            detaTab.push("<li><span class='span_a'>涨跌</span><span class='span_b' style='" + Comparative(_change, 0) + "'>" + _change.toFixed(2) + "</span></li>");
            detaTab.push("<li><span class='span_a'>涨跌幅</span><span class='span_b' style='" + Comparative(_chg_rate, 0) + "'>" + _chg_rate.toFixed(2) + "%</span></li>");
            detaTab.push("<li><span class='span_a'>昨收</span><span class='span_b'>" + _prev_close.toFixed(2) + "</span></li>");
            detaTab.push("<li><span class='span_a'>开盘</span><span class='span_b' style='" + Comparative(_open, _prev_close) + "'>" + _open.toFixed(2) + "</span></li>");
            detaTab.push("<li><span class='span_a'>最高</span><span class='span_b' style='" + Comparative(_high, _prev_close) + "'>" + _high.toFixed(2) + "</span></li>");
            detaTab.push("<li><span class='span_a'>最低</span><span class='span_b' style='" + Comparative(_low, _prev_close) + "'>" + _low.toFixed(2) + "</span></li>");
            detaTab.push("<li><span class='span_a'>总量</span><span class='span_b'>" + Number(_volume).toFixed(0) + " 手</span></li>");
            detaTab.push("<li><span class='span_a'>总额</span><span class='span_b'>" + Number(_amount / 10000).toFixed(0) + " 万元</span></li>");
            detaTab.push("<li><span class='span_a'>时间</span><span class='span_b'>" + _dTime + "</span></li>");
            detaTab.push("<li><span class='span_a'>日期</span><span class='span_b'>" + _dDate + "</span></li>"); //===== by WHJ
            detaTab.push("<li><span class='span_a'>交易状态</span><span class='span_b'>" + checkStatus(_tradephase) + "</span></li>");
            obj.dtId.find("ul").html(detaTab.join(""));

            if (_tradephase.replace(/\s/ig, '') == "P1") {
                obj.id.html('<center style="margin-top:40%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 20px;">停牌中</span></center>');
            } else if (_tradephase.replace(/\s/ig, '') == "C1") {
                obj.id.html('<center style="margin-top:40%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 20px;">集合竞价中</span></center>');
            } else {
                if (checkBrowser()) {
                    dataScsjSearch_zq({
                        id: obj.id,
                        code: obj.code,
                        last: _last,
                        codeName: _name,
                        open: _open,
                        high: _high,
                        low: _low,
                        prev_close: _prev_close
                    });
                }
            }
        }
    })
}

function dataScsjSearch_zq(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        //v1/sh1/list/self/
        url: hq_queryUrl + "/v1/sh1/line/" + obj.code,
        data: {
            begin: 0,
            end: -1,
            select: 'time,price,volume'
        },
        jsonp: "callback",
        cache: false,
        success: function(resultData) {
            var dd = resultData;
            var d = dateConvert({
                data: dd,
                last: obj.last,
                open: obj.open
            });
            //var data = null;
            var data = d.line;
            //没数据时不显示图表
            if (data.length == 0) {
                //obj.id.html("<div class='chart_container'></div>");
                obj.id.css({
                    "border": "1px solid #CCC"
                });
                return;
            }
            Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                lang: {
                    loading: "加载中",
                    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    noData: "没有数据",
                    numericSymbols: ["千", "兆", "G", "T", "P", "E"],
                    printChart: "打印图表",
                    resetZoom: "恢复缩放",
                    resetZoomTitle: "恢复图表",
                    shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    thousandsSep: ",",
                    weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
                }
            });
            //初始化开------------------------
            var groupingUnits = [
                [
                    'minute', // unit name
                    [1] // allowed multiples
                ]
            ];
            var avg_pxyAxisMin; //Y轴最小值
            var avg_pxyAxisMax; //Y轴最大值 
            var percentageyAxisMin; //Y轴百分比最小
            var percentageyAxisMax; //Y轴百分比最大
            var volume_yAxisMin; //成交量最小
            var volume_yAxisMax; //成交量最大
            var red = "#ff0000";
            var blue = "#00a800";
            var price_trend = [],
                volume = [], //成交量
                i = 0;
            //图表上的成交量第一条的数据红绿的判断 是根据昨日的收盘价preclose_px 和今日的最新价last_px进行对比
            //同时获取的昨日收盘价  用于涨幅的计算
            var isFirstLineColorflag = true;
            //保存昨收数据
            var yesterdayClose;
            //容错判断
            if (data != undefined && data != null && data.length == 0) {
                try {
                    failCallback();
                } catch (e) {

                }
                return;
            }
            //今开
            var open_px = data[i][1];
            //昨收
            //var preclose_px=data[i][3];
            var preclose_px = d.prev_close;
            yesterdayClose = preclose_px;
            isFirstLineColorflag = open_px > preclose_px ? true : false;
            // split the data set into price_trend and volume
            //数据处理
            for (i; i < data.length; i += 1) {
                var _dates = data[i][0] + "";
                var _hours = _dates.substring(8, 10);
                var dateUTC = getDateUTCOrNot(_dates, true);
                var business_amount = data[i][2];
                var columnColor = red;
                if (i == 0) { //第一笔的 红绿柱 判断依据是根据 今天开盘价与昨日收盘价比较
                    if (isFirstLineColorflag == false) {
                        columnColor = blue;
                    }
                    avg_pxyAxisMin = data[i][1];
                    avg_pxyAxisMax = data[i][1];
                    percentageyAxisMin = Number(100 * (data[i][1] / yesterdayClose - 1));
                    percentageyAxisMax = Number(100 * (data[i][1] / yesterdayClose - 1));
                    volume_yAxisMin = data[i][2];
                    volume_yAxisMax = data[i][2];
                } else {
                    //除了第一笔，其它都是  返回的 last_px 与前一个对比
                    if (data[i - 1][1] - data[i][1] > 0) {
                        columnColor = blue;
                    }
                    business_amount = data[i][2] - data[i - 1][2];
                }
                avg_pxyAxisMin = avg_pxyAxisMin > data[i][1] ? data[i][1] : avg_pxyAxisMin;
                avg_pxyAxisMax = avg_pxyAxisMax > data[i][1] ? avg_pxyAxisMax : data[i][1];
                percentageyAxisMin = percentageyAxisMin > Number(100 * (data[i][1] / yesterdayClose - 1)) ? Number(100 * (data[i][1] / yesterdayClose - 1)) : percentageyAxisMin;
                percentageyAxisMax = percentageyAxisMax > Number(100 * (data[i][1] / yesterdayClose - 1)) ? percentageyAxisMax : Number(100 * (data[i][1] / yesterdayClose - 1));
                volume_yAxisMin = volume_yAxisMin > business_amount ? business_amount : volume_yAxisMin;
                volume_yAxisMax = volume_yAxisMax > business_amount ? volume_yAxisMax : business_amount;
                //将数据放入 price_trend volume 数组中

                price_trend.push({
                    x: dateUTC,
                    y: Number(data[i][1])
                });
                volume.push({
                    x: dateUTC,
                    y: Number(business_amount),
                    color: columnColor
                });
            }

            //将剩下的时间信息补全
            appendTimeMessage(price_trend, volume, data);
            //常量本地化
            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });

            var date;
            if (data.length > 0) {
                date = data[data.length - 1][0] + "";
                var dArr = new Array();
                for (var hh = 0; hh < 5; hh++) {
                    var numb;
                    if (hh == 0) {
                        numb = Number(date.slice(0, 4));
                    } else {
                        numb = Number(date.slice((hh - 1) * 2 + 4, hh * 2 + 4));
                    }

                    dArr.push(numb);
                }
            }
            var last_dataTime = new Date(dArr[0], dArr[1] - 1, dArr[2], dArr[3], dArr[4]);
            var $reporting = $("#report");
            $reporting.html("");
            // Create the chart
            var am_startTime = new Date(last_dataTime);
            am_startTime.setHours(1, 30, 0, 0);
            var am_startTimeUTC = convertDateToUTC(am_startTime);
            var am_midTime = new Date(last_dataTime);
            am_midTime.setHours(2, 30, 0, 0);
            var am_midTimeUTC = convertDateToUTC(am_midTime);

            //股票交易早上最后的时间
            var am_lastTime = new Date(last_dataTime);
            am_lastTime.setHours(3, 30, 0, 0);
            var am_lastTimeUTC = convertDateToUTC(am_lastTime);

            //股票交易下午最后的时间
            var pm_startTime = new Date(last_dataTime);
            pm_startTime.setHours(5, 1, 0, 0);
            var pm_startTimeUTC = convertDateToUTC(pm_startTime);

            var pm_midTime = new Date(last_dataTime);
            pm_midTime.setHours(6, 0, 0, 0);
            var pm_midTimeUTC = convertDateToUTC(pm_midTime);

            var pm_lastTime = new Date(last_dataTime);
            pm_lastTime.setHours(7, 0, 0, 0);
            var pm_lastTimeUTC = convertDateToUTC(pm_lastTime);


            //----------------------------------------------------------
            // Create the chart
            obj.id.highcharts('StockChart', {
                chart: {
                    //关闭平移
                    panning: false,
                    zoomType: 'none',
                    pinchType: 'none',
                    renderTo: "line_map",
                    margin: [10, 5, 20, 52],
                    spacing: [0, 0, 0, 0],
                    plotBorderColor: '#3C94C4',
                    plotBorderWidth: 0, //边框
                    events: {
                        load: function() {
                            var chart = obj.id.highcharts(); // Highcharts构造函数
                            //基准线
                            chart.yAxis[0].addPlotLine({ //在x轴上增加
                                value: yesterdayClose, //在值为2的地方             //在x轴上增加
                                width: 2, //标示线的宽度为2px
                                color: '#CCC', //标示线的颜色
                                zIndex: 1,
                                id: 'plot-line-' //标示线的id，在删除该标示线的时候需要该id标示
                            });
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    valueDecinale: 2,
                    useHTML: true,
                    formatter: function() {
                        //var _name = this.points[1].series.name;
                        //console.log(this);
                        var _name = obj.codeName;
                        var _date = Highcharts.dateFormat('%b%e日,%A,%H:%M', this.x);
                        var _y = this.points[0].y.toFixed(2);
                        return '<p style="margin:0px;padding:0px;font-size:14px;"><span>' + _name + '   </span><span style="' + Comparative(_y, obj.prev_close) + ';">' + _y + '</span></p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>';
                        //var _yy = this.points[2].y;
                        //return '<p style="margin:0px;padding:0px;font-size:14px;">' + _name +  ' <span style="'+Comparative(_y,obj.prev_close)+';float:right;">'+_y+ '</span></p><p style="margin:0px;padding:0px;font-size:14px;">'+
                        //'成交量：' + ' <span style="float:right;">'+(_yy).toFixed(0)+ '</p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>'
                    }
                },
                plotOptions: {
                    series: {
                        /*关闭动画*/
                        animation: false
                    }
                },
                rangeSelector: {
                    enabled: false
                },
                /*导出配置*/
                exporting: {
                    enabled: false
                },
                /*创建者信息*/
                credits: {
                    enabled: false
                },
                /*下部时间拖拉选择*/
                navigator: {
                    enabled: false,
                    /*关闭时间选择*/
                    baseseries: 10
                },
                scrollbar: {
                    enabled: false /*关闭下方滚动条*/
                },
                /*底部滚动条*/
                scrollbar: {
                    enabled: false
                },

                xAxis: {
                    //type: 'datetime',
                    ordinal: false,
                    breaks: [{ // Nights
                        breakSize: 1,
                        from: am_lastTimeUTC,
                        to: pm_startTimeUTC
                    }],
                    //minRange: 14 * 24 * 36000, // fourteen days
                    showFirstLabel: true,
                    showLastLabel: true,
                    scrollbar: {
                        enabled: true
                    },
                    labels: {
                        // staggerLines:5
                        style: { //字体样式
                            font: 'normal 12px'
                        },
                        formatter: function() {
                            //var returnTime=Highcharts.dateFormat('%H:%M', this.value-Number(8 * 3600 * 1000));
                            var returnTime = Highcharts.dateFormat('%H:%M', this.value);
                            if (returnTime == "09:30") {
                                return '<span style="margin-left:33px;color:#aaa">09:30</span>';
                            }
                            if (returnTime == "11:30") {
                                return '<span style="color:#aaa">11:30/13:00</span>';
                            }
                            if (returnTime == "10:30") {
                                return "";
                            }
                            if (returnTime == "14:00") {
                                return "";
                            }
                            if (returnTime == "15:00") {
                                return '<span style="margin-right:35px;color:#aaa">15:00</span>';
                            }
                            return returnTime;

                        },
                        y: 15,
                        step: 1,
                        useHTML: true
                    },
                    tickLength: 5,
                    tickPositioner: function() {
                        var positions = [am_startTimeUTC, am_midTimeUTC, am_lastTimeUTC, pm_midTimeUTC, pm_lastTimeUTC];
                        //var positions = [am_startTimeUTC,  am_lastTimeUTC,pm_lastTimeUTC];
                        return positions;
                    },
                    gridLineDashStyle: 'ShortDash',
                    gridLineColor: '#f2f2f2',
                    gridLineWidth: 1
                },
                yAxis: [{
                        opposite: false, //是否把它显示到另一边（右边）
                        labels: {
                            enabled: false
                        },
                        title: {
                            text: ''
                        },
                        top: '0%',
                        height: '100%',
                        width: '90%',
                        lineWidth: 0,
                        showFirstLabel: false,
                        showLastLabel: false,
                        gridLineWidth: 0,
                        x: 0,
                        y: 0,
                        tickPositioner: function() { //以yesterdayClose为界限，统一间隔值，从 最小到最大步进
                            positions = [
                                (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(2), (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(2),
                                obj.prev_close.toFixed(2), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(2), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(2)
                            ];
                            return positions;
                        }
                    }, //y1
                    {
                        opposite: false, //是否把它显示到另一边（右边）
                        showFirstLabel: true,
                        showLastLabel: true,
                        labels: {
                            enabled: true,
                            overflow: 'justify',
                            style: { //字体样式
                                font: 'normal 12px'
                            },
                            align: 'right',
                            x: -5,
                            y: 6,
                            formatter: function() { //最新价  px_last/preclose昨收盘-1
                                //return 100*(((this.value/yesterdayClose)-1).toFixed(4))+"%";
                                return '<span style="color:#aaa;">' + this.value + '</span>';
                            }
                        },
                        useHTML: true,
                        title: {
                            text: ''
                        },
                        lineWidth: 0.5,
                        top: '0%',
                        height: '100%',
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        tickPositioner: function() {
                            return positions;
                        }
                    }
                ],
                series: [{
                    name: obj.codeName,
                    data: price_trend,
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    name: obj.codeName,
                    data: price_trend,
                    type: 'line',
                    lineWidth: 0.5,
                    cursor: 'pointer',
                    onSeries: 'candlestick',
                    color: 'transparent',
                    style: {
                        fontSize: '0px',
                        fontWeight: '0',
                        textAlign: 'center'
                    },
                    zIndex: -1000,
                    yAxis: 1,
                    fillColor: {
                        linearGradient: { //渐变方向
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    dataGrouping: {
                        units: groupingUnits
                    }
                }]
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //返回错误信息
            //console.log("Ajax返回错误信息:"+XMLHttpRequest.status+"~"+XMLHttpRequest.readyState+"~"+textStatus);
        }
    });
}
/*
-----------------------------------------------------------首页-数据-行情信息总览-市场数据－指数------------------------------------------------------
*/
function dataScsjAjax_zs(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/list/self/" + obj.code,
        jsonp: "callback",
        data: {
            select: 'last,open,name,high,low,change,chg_rate,prev_close,volume,amount,tradephase'
        },
        cache: false,
        success: function(resultData) {
            var _snap_val = resultData.list;
            var _date = resultData.date + "";
            var _dDate = _date.substring(0, _date.length - 4) + "-" + _date.substring(_date.length - 4, _date.length - 2) + "-" + _date.substring(_date.length - 2);
            var _timer = resultData.time + "";
            var _dTime = _timer.substring(0, _timer.length - 4) + ":" + _timer.substring(_timer.length - 4, _timer.length - 2) + ":" + _timer.substring(_timer.length - 2);
            var _last = _snap_val[0][0];
            var _open = _snap_val[0][1];
            var _name = _snap_val[0][2];
            var _high = _snap_val[0][3];
            var _low = _snap_val[0][4];
            var _change = _snap_val[0][5];
            var _chg_rate = _snap_val[0][6];
            var _prev_close = _snap_val[0][7];
            var _volume = _snap_val[0][8];
            var _amount = _snap_val[0][9];
            obj.dtId.find("h1:eq(0)").html(obj.code);
            obj.dtId.find("h1:eq(1)").html(_name);
            var detaTab = [];
            detaTab.push("<li><span class='span_a'>现价</span><span class='span_b' style='" + Comparative(_last, _prev_close) + "'>" + _last.toFixed(2) + "</span></li>");
            detaTab.push("<li><span class='span_a'>涨跌</span><span class='span_b' style='" + Comparative(_change, 0) + "'>" + _change.toFixed(2) + "</span></li>");
            detaTab.push("<li><span class='span_a'>涨跌幅</span><span class='span_b' style='" + Comparative(_chg_rate, 0) + "'>" + _chg_rate.toFixed(2) + "%</span></li>");
            detaTab.push("<li><span class='span_a'>昨收</span><span class='span_b'>" + _prev_close.toFixed(2) + "</span></li>");
            detaTab.push("<li><span class='span_a'>开盘</span><span class='span_b' style='" + Comparative(_open, _prev_close) + "'>" + _open.toFixed(2) + "</span></li>");
            detaTab.push("<li><span class='span_a'>最高</span><span class='span_b' style='" + Comparative(_high, _prev_close) + "'>" + _high.toFixed(2) + "</span></li>");
            detaTab.push("<li><span class='span_a'>最低</span><span class='span_b' style='" + Comparative(_low, _prev_close) + "'>" + _low.toFixed(2) + "</span></li>");
            detaTab.push("<li><span class='span_a'>总量</span><span class='span_b'>" + (_volume / 10000).toFixed(0) + " 万手</span></li>");
            detaTab.push("<li><span class='span_a'>总额</span><span class='span_b'>" + Number(_amount / 100000000).toFixed(2) + " 亿元</span></li>");
            detaTab.push("<li><span class='span_a'>时间</span><span class='span_b'>" + _dTime + "</span></li>");
            detaTab.push("<li><span class='span_a'>日期</span><span class='span_b'>" + _dDate + "</span></li>"); //===== by WHJ
            obj.dtId.find("ul").html(detaTab.join(""));
            //=================
            //console.log(_dDate);
            //=========================

            var _tradephase = _snap_val[0][10];
            if (_tradephase.replace(/\s/ig, '') == "P1") {
                obj.id.html('<center style="margin-top:40%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 20px;">停牌中</span></center>');
            } else if (_tradephase.replace(/\s/ig, '') == "C1") {
                obj.id.html('<center style="margin-top:40%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 20px;">集合竞价中</span></center>');
            } else {
                if (checkBrowser()) {
                    dataScsjSearch_zs({
                        id: obj.id,
                        code: obj.code,
                        last: _last,
                        codeName: _name,
                        open: _open,
                        high: _high,
                        low: _low,
                        prev_close: _prev_close
                    });
                }
            }
        }
    })
}

function dataScsjSearch_zs(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        //v1/sh1/list/self/
        url: hq_queryUrl + "/v1/sh1/line/" + obj.code,
        data: {
            begin: 0,
            end: -1,
            select: 'time,price,volume'
        },
        jsonp: "callback",
        cache: false,
        success: function(resultData) {
            var dd = resultData;
            var d = dateConvert({
                data: dd,
                last: obj.last,
                open: obj.open
            });
            //var data = null;
            var data = d.line;
            //没数据时不显示图表
            if (data.length == 0) {
                //obj.id.html("<div class='chart_container'></div>");
                obj.id.css({
                    "border": "1px solid #CCC"
                });
                return;
            }
            Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                lang: {
                    loading: "加载中",
                    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    noData: "没有数据",
                    numericSymbols: ["千", "兆", "G", "T", "P", "E"],
                    printChart: "打印图表",
                    resetZoom: "恢复缩放",
                    resetZoomTitle: "恢复图表",
                    shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    thousandsSep: ",",
                    weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
                }
            });
            //初始化开------------------------
            var groupingUnits = [
                [
                    'minute', // unit name
                    [1] // allowed multiples
                ]
            ];
            var avg_pxyAxisMin; //Y轴最小值
            var avg_pxyAxisMax; //Y轴最大值 
            var percentageyAxisMin; //Y轴百分比最小
            var percentageyAxisMax; //Y轴百分比最大
            var volume_yAxisMin; //成交量最小
            var volume_yAxisMax; //成交量最大
            var red = "#ff0000";
            var blue = "#00a800";
            var price_trend = [],
                volume = [], //成交量
                i = 0;
            //图表上的成交量第一条的数据红绿的判断 是根据昨日的收盘价preclose_px 和今日的最新价last_px进行对比
            //同时获取的昨日收盘价  用于涨幅的计算
            var isFirstLineColorflag = true;
            //保存昨收数据
            var yesterdayClose;
            //容错判断
            if (data != undefined && data != null && data.length == 0) {
                try {
                    failCallback();
                } catch (e) {

                }
                return;
            }
            //今开
            var open_px = data[i][1];
            //昨收
            //var preclose_px=data[i][3];
            var preclose_px = d.prev_close;
            yesterdayClose = preclose_px;
            isFirstLineColorflag = open_px > preclose_px ? true : false;
            // split the data set into price_trend and volume
            //数据处理
            for (i; i < data.length; i += 1) {
                var _dates = data[i][0] + "";
                var _hours = _dates.substring(8, 10);
                var dateUTC = getDateUTCOrNot(_dates, true);
                var business_amount = data[i][2];
                var columnColor = red;
                if (i == 0) { //第一笔的 红绿柱 判断依据是根据 今天开盘价与昨日收盘价比较
                    if (isFirstLineColorflag == false) {
                        columnColor = blue;
                    }
                    avg_pxyAxisMin = data[i][1];
                    avg_pxyAxisMax = data[i][1];
                    percentageyAxisMin = Number(100 * (data[i][1] / yesterdayClose - 1));
                    percentageyAxisMax = Number(100 * (data[i][1] / yesterdayClose - 1));
                    volume_yAxisMin = data[i][2];
                    volume_yAxisMax = data[i][2];
                } else {
                    //除了第一笔，其它都是  返回的 last_px 与前一个对比
                    if (data[i - 1][1] - data[i][1] > 0) {
                        columnColor = blue;
                    }
                    business_amount = data[i][2] - data[i - 1][2];
                }
                avg_pxyAxisMin = avg_pxyAxisMin > data[i][1] ? data[i][1] : avg_pxyAxisMin;
                avg_pxyAxisMax = avg_pxyAxisMax > data[i][1] ? avg_pxyAxisMax : data[i][1];
                percentageyAxisMin = percentageyAxisMin > Number(100 * (data[i][1] / yesterdayClose - 1)) ? Number(100 * (data[i][1] / yesterdayClose - 1)) : percentageyAxisMin;
                percentageyAxisMax = percentageyAxisMax > Number(100 * (data[i][1] / yesterdayClose - 1)) ? percentageyAxisMax : Number(100 * (data[i][1] / yesterdayClose - 1));
                volume_yAxisMin = volume_yAxisMin > business_amount ? business_amount : volume_yAxisMin;
                volume_yAxisMax = volume_yAxisMax > business_amount ? volume_yAxisMax : business_amount;
                //将数据放入 price_trend volume 数组中

                price_trend.push({
                    x: dateUTC,
                    y: Number(data[i][1])
                });
                volume.push({
                    x: dateUTC,
                    y: Number(business_amount),
                    color: columnColor
                });
            }

            //将剩下的时间信息补全
            appendTimeMessage(price_trend, volume, data);
            //常量本地化
            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });

            var date;
            if (data.length > 0) {
                date = data[data.length - 1][0] + "";
                var dArr = new Array();
                for (var hh = 0; hh < 5; hh++) {
                    var numb;
                    if (hh == 0) {
                        numb = Number(date.slice(0, 4));
                    } else {
                        numb = Number(date.slice((hh - 1) * 2 + 4, hh * 2 + 4));
                    }

                    dArr.push(numb);
                }
            }
            var last_dataTime = new Date(dArr[0], dArr[1] - 1, dArr[2], dArr[3], dArr[4]);
            var $reporting = $("#report");
            $reporting.html("");
            // Create the chart
            var am_startTime = new Date(last_dataTime);
            am_startTime.setHours(1, 30, 0, 0);
            var am_startTimeUTC = convertDateToUTC(am_startTime);
            var am_midTime = new Date(last_dataTime);
            am_midTime.setHours(2, 30, 0, 0);
            var am_midTimeUTC = convertDateToUTC(am_midTime);

            //股票交易早上最后的时间
            var am_lastTime = new Date(last_dataTime);
            am_lastTime.setHours(3, 30, 0, 0);
            var am_lastTimeUTC = convertDateToUTC(am_lastTime);

            //股票交易下午最后的时间
            var pm_startTime = new Date(last_dataTime);
            pm_startTime.setHours(5, 1, 0, 0);
            var pm_startTimeUTC = convertDateToUTC(pm_startTime);

            var pm_midTime = new Date(last_dataTime);
            pm_midTime.setHours(6, 0, 0, 0);
            var pm_midTimeUTC = convertDateToUTC(pm_midTime);

            var pm_lastTime = new Date(last_dataTime);
            pm_lastTime.setHours(7, 0, 0, 0);
            var pm_lastTimeUTC = convertDateToUTC(pm_lastTime);


            //----------------------------------------------------------
            // Create the chart
            obj.id.highcharts('StockChart', {
                chart: {
                    //关闭平移
                    panning: false,
                    zoomType: 'none',
                    pinchType: 'none',
                    renderTo: "line_map",
                    margin: [10, 5, 20, 63],
                    spacing: [0, 0, 0, 0],
                    plotBorderColor: '#3C94C4',
                    plotBorderWidth: 0, //边框
                    events: {
                        load: function() {
                            var chart = obj.id.highcharts(); // Highcharts构造函数
                            //基准线
                            chart.yAxis[0].addPlotLine({ //在x轴上增加
                                value: yesterdayClose, //在值为2的地方             //在x轴上增加
                                width: 2, //标示线的宽度为2px
                                color: '#CCC', //标示线的颜色
                                zIndex: 1,
                                id: 'plot-line-' //标示线的id，在删除该标示线的时候需要该id标示
                            });
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    valueDecinale: 2,
                    useHTML: true,
                    formatter: function() {
                        //var _name = this.points[1].series.name;
                        //console.log(this);
                        var _name = obj.codeName;
                        var _date = Highcharts.dateFormat('%b%e日,%A,%H:%M', this.x);
                        var _y = this.points[0].y.toFixed(2);
                        return '<p style="margin:0px;padding:0px;font-size:14px;"><span>' + _name + '   </span><span style="' + Comparative(_y, obj.prev_close) + ';">' + _y + '</span></p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>';
                        //var _yy = this.points[2].y;
                        //return '<p style="margin:0px;padding:0px;font-size:14px;">' + _name +  ' <span style="'+Comparative(_y,obj.prev_close)+';float:right;">'+_y+ '</span></p><p style="margin:0px;padding:0px;font-size:14px;">'+
                        //'成交量：' + ' <span style="float:right;">'+(_yy).toFixed(0)+ '</p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>'
                    }
                },
                plotOptions: {
                    series: {
                        /*关闭动画*/
                        animation: false
                    }
                },
                rangeSelector: {
                    enabled: false
                },
                /*导出配置*/
                exporting: {
                    enabled: false
                },
                /*创建者信息*/
                credits: {
                    enabled: false
                },
                /*下部时间拖拉选择*/
                navigator: {
                    enabled: false,
                    /*关闭时间选择*/
                    baseseries: 10
                },
                scrollbar: {
                    enabled: false /*关闭下方滚动条*/
                },
                /*底部滚动条*/
                scrollbar: {
                    enabled: false
                },

                xAxis: {
                    //type: 'datetime',
                    ordinal: false,
                    breaks: [{ // Nights
                        breakSize: 1,
                        from: am_lastTimeUTC,
                        to: pm_startTimeUTC
                    }],
                    //minRange: 14 * 24 * 36000, // fourteen days
                    showFirstLabel: true,
                    showLastLabel: true,
                    scrollbar: {
                        enabled: true
                    },
                    labels: {
                        // staggerLines:5
                        style: { //字体样式
                            font: 'normal 12px'
                        },
                        formatter: function() {
                            //var returnTime=Highcharts.dateFormat('%H:%M', this.value-Number(8 * 3600 * 1000));
                            var returnTime = Highcharts.dateFormat('%H:%M', this.value);
                            if (returnTime == "09:30") {
                                return '<span style="margin-left:33px;color:#aaa">09:30</span>';
                            }
                            if (returnTime == "11:30") {
                                return '<span style="color:#aaa">11:30/13:00</span>';
                            }
                            if (returnTime == "10:30") {
                                return "";
                            }
                            if (returnTime == "14:00") {
                                return "";
                            }
                            if (returnTime == "15:00") {
                                return '<span style="margin-right:35px;color:#aaa">15:00</span>';
                            }
                            return returnTime;

                        },
                        y: 15,
                        step: 1,
                        useHTML: true
                    },
                    tickLength: 5,
                    tickPositioner: function() {
                        var positions = [am_startTimeUTC, am_midTimeUTC, am_lastTimeUTC, pm_midTimeUTC, pm_lastTimeUTC];
                        //var positions = [am_startTimeUTC,  am_lastTimeUTC,pm_lastTimeUTC];
                        return positions;
                    },
                    gridLineDashStyle: 'ShortDash',
                    gridLineColor: '#f2f2f2',
                    gridLineWidth: 1
                },
                yAxis: [{
                        opposite: false, //是否把它显示到另一边（右边）
                        labels: {
                            enabled: false
                        },
                        title: {
                            text: ''
                        },
                        top: '0%',
                        height: '100%',
                        width: '90%',
                        lineWidth: 0,
                        showFirstLabel: false,
                        showLastLabel: false,
                        gridLineWidth: 0,
                        x: 0,
                        y: 0,
                        tickPositioner: function() { //以yesterdayClose为界限，统一间隔值，从 最小到最大步进
                            positions = [
                                (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(2), (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(2),
                                obj.prev_close.toFixed(2), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(2), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(2)
                            ];
                            return positions;
                        }
                    }, //y1
                    {
                        opposite: false, //是否把它显示到另一边（右边）
                        showFirstLabel: true,
                        showLastLabel: true,
                        labels: {
                            enabled: true,
                            overflow: 'justify',
                            style: { //字体样式
                                font: 'normal 12px'
                            },
                            align: 'right',
                            x: -5,
                            y: 6,
                            formatter: function() { //最新价  px_last/preclose昨收盘-1
                                //return 100*(((this.value/yesterdayClose)-1).toFixed(4))+"%";
                                return '<span style="color:#aaa;">' + this.value + '</span>';
                            }
                        },
                        useHTML: true,
                        title: {
                            text: ''
                        },
                        lineWidth: 0.5,
                        top: '0%',
                        height: '100%',
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        tickPositioner: function() {
                            return positions;
                        }
                    }
                ],
                series: [{
                    name: obj.codeName,
                    data: price_trend,
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    name: obj.codeName,
                    data: price_trend,
                    type: 'line',
                    lineWidth: 0.5,
                    cursor: 'pointer',
                    onSeries: 'candlestick',
                    color: 'transparent',
                    style: {
                        fontSize: '0px',
                        fontWeight: '0',
                        textAlign: 'center'
                    },
                    zIndex: -1000,
                    yAxis: 1,
                    fillColor: {
                        linearGradient: { //渐变方向
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    dataGrouping: {
                        units: groupingUnits
                    }
                }]
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //返回错误信息
            //console.log("Ajax返回错误信息:"+XMLHttpRequest.status+"~"+XMLHttpRequest.readyState+"~"+textStatus);
        }
    });
}
/*
-----------------------------------------------------------首页-数据-行情信息总览-市场数据－回购------------------------------------------------------
*/
function dataScsjAjax_hg(obj) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/list/self/" + obj.code,
        jsonp: "callback",
        data: {
            select: 'last,open,name,high,low,change,chg_rate,prev_close,volume,amount,tradephase'
        },
        cache: false,
        success: function(resultData) {
            var _snap_val = resultData.list;
            var _date = resultData.date + "";
            var _dDate = _date.substring(0, _date.length - 4) + "-" + _date.substring(_date.length - 4, _date.length - 2) + "-" + _date.substring(_date.length - 2);
            var _timer = resultData.time + "";
            var _dTime = _timer.substring(0, _timer.length - 4) + ":" + _timer.substring(_timer.length - 4, _timer.length - 2) + ":" + _timer.substring(_timer.length - 2);
            var _last = _snap_val[0][0];
            var _open = _snap_val[0][1];
            var _name = _snap_val[0][2];
            var _high = _snap_val[0][3];
            var _low = _snap_val[0][4];
            var _change = _snap_val[0][5];
            var _chg_rate = _snap_val[0][6];
            var _prev_close = _snap_val[0][7];
            var _volume = _snap_val[0][8];
            var _amount = _snap_val[0][9];
            var _tradephase = _snap_val[0][10];
            obj.dtId.find("h1:eq(0)").html(obj.code);
            obj.dtId.find("h1:eq(1)").html(_name);
            var detaTab = [];
            detaTab.push("<li><span class='span_a'>现价</span><span class='span_b' style='" + Comparative(_last, _prev_close) + "'>" + _last.toFixed(3) + "</span></li>");
            detaTab.push("<li><span class='span_a'>涨跌</span><span class='span_b' style='" + Comparative(_change, 0) + "'>" + _change.toFixed(3) + "</span></li>");
            // detaTab.push("<li><span class='span_a'>涨跌幅</span><span class='span_b' style='" + Comparative(_chg_rate, 0) + "'>" + _chg_rate.toFixed(2) + "%</span></li>");
            detaTab.push("<li><span class='span_a'>昨收</span><span class='span_b'>" + _prev_close.toFixed(3) + "</span></li>");
            detaTab.push("<li><span class='span_a'>开盘</span><span class='span_b' style='" + Comparative(_open, _prev_close) + "'>" + _open.toFixed(3) + "</span></li>");
            detaTab.push("<li><span class='span_a'>最高</span><span class='span_b' style='" + Comparative(_high, _prev_close) + "'>" + _high.toFixed(3) + "</span></li>");
            detaTab.push("<li><span class='span_a'>最低</span><span class='span_b' style='" + Comparative(_low, _prev_close) + "'>" + _low.toFixed(3) + "</span></li>");
            detaTab.push("<li><span class='span_a'>总量</span><span class='span_b'>" + Number(_volume / 10000).toFixed(0) + " 万手</span></li>");
            detaTab.push("<li><span class='span_a'>总额</span><span class='span_b'>" + Number(_amount / 100000000).toFixed(0) + " 亿元</span></li>");
            detaTab.push("<li><span class='span_a'>时间</span><span class='span_b'>" + _dTime + "</span></li>");
            detaTab.push("<li><span class='span_a'>日期</span><span class='span_b'>" + _dDate + "</span></li>"); //===== by WHJ
            detaTab.push("<li><span class='span_a'>交易状态</span><span class='span_b'>" + checkStatus(_tradephase) + "</span></li>");
            obj.dtId.find("ul").html(detaTab.join(""));

            if (_tradephase.replace(/\s/ig, '') == "P1") {
                obj.id.html('<center style="margin-top:40%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 20px;">停牌中</span></center>');
            } else if (_tradephase.replace(/\s/ig, '') == "C1") {
                obj.id.html('<center style="margin-top:40%;"><span class="nal" style="margin-top: 50%;color: #ccc;font-size: 20px;">集合竞价中</span></center>');
            } else {
                if (checkBrowser()) {
                    $.ajax({
                        type: 'POST',
                        dataType: "jsonp",
                        url: hq_queryUrl + "/v1/sh1/snap/" + obj.code,
                        data: {
                            select: 'cpxxprodusta'
                        },
                        jsonp: "callback",
                        cache: false,
                        success: function(resultData) {
                            var data = resultData.snap[0]
                            var this_code = data[6]
                            if (this_code == "S") {
                                dataScsjSearch_hg({
                                    id: obj.id,
                                    code: obj.code,
                                    last: _last,
                                    codeName: _name,
                                    open: _open,
                                    high: _high,
                                    low: _low,
                                    prev_close: _prev_close,
                                    flag: true
                                });
                            } else {
                                dataScsjSearch_hg({
                                    id: obj.id,
                                    code: obj.code,
                                    last: _last,
                                    codeName: _name,
                                    open: _open,
                                    high: _high,
                                    low: _low,
                                    prev_close: _prev_close
                                });
                            }


                        }

                    })
                }
            }
        }
    })
}

function dataScsjSearch_hg(obj) {
    //Ajax获取根据参数获取结果集
    var select = obj.flag ? "time,price,volume,avg_price" : "time,price,volume"
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        //v1/sh1/list/self/
        url: hq_queryUrl + "/v1/sh1/line/" + obj.code,
        data: {
            begin: 0,
            end: -1,
            select: select
        },
        jsonp: "callback",
        cache: false,
        success: function(resultData) {
            var dd = resultData;
            var d = dateConvert({
                data: dd,
                last: obj.last,
                open: obj.open
            });
            //var data = null;
            var data = d.line;
            //没数据时不显示图表
            if (data.length == 0) {
                //obj.id.html("<div class='chart_container'></div>");
                obj.id.css({
                    "border": "1px solid #CCC"
                });
                return;
            }
            Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                lang: {
                    loading: "加载中",
                    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    noData: "没有数据",
                    numericSymbols: ["千", "兆", "G", "T", "P", "E"],
                    printChart: "打印图表",
                    resetZoom: "恢复缩放",
                    resetZoomTitle: "恢复图表",
                    shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    thousandsSep: ",",
                    weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
                }
            });
            //初始化开------------------------
            var groupingUnits = [
                [
                    'minute', // unit name
                    [1] // allowed multiples
                ]
            ];
            var avg_pxyAxisMin; //Y轴最小值
            var avg_pxyAxisMax; //Y轴最大值 
            var percentageyAxisMin; //Y轴百分比最小
            var percentageyAxisMax; //Y轴百分比最大
            var volume_yAxisMin; //成交量最小
            var volume_yAxisMax; //成交量最大
            var red = "#ff0000";
            var blue = "#00a800";
            var price_trend = [],
                volume = [],
                avg_prices = [],
                //成交量
                i = 0;
            //图表上的成交量第一条的数据红绿的判断 是根据昨日的收盘价preclose_px 和今日的最新价last_px进行对比
            //同时获取的昨日收盘价  用于涨幅的计算
            var isFirstLineColorflag = true;
            //保存昨收数据
            var yesterdayClose;
            //容错判断
            if (data != undefined && data != null && data.length == 0) {
                try {
                    failCallback();
                } catch (e) {

                }
                return;
            }
            //今开
            var open_px = data[i][1];
            //昨收
            //var preclose_px=data[i][3];
            var preclose_px = d.prev_close;
            yesterdayClose = preclose_px;
            isFirstLineColorflag = open_px > preclose_px ? true : false;
            // split the data set into price_trend and volume
            //数据处理
            for (i; i < data.length; i += 1) {
                var _dates = data[i][0] + "";
                var _hours = _dates.substring(8, 10);
                var dateUTC = getDateUTCOrNot(_dates, true);
                var business_amount = data[i][2];
                var columnColor = red;
                if (i == 0) { //第一笔的 红绿柱 判断依据是根据 今天开盘价与昨日收盘价比较
                    if (isFirstLineColorflag == false) {
                        columnColor = blue;
                    }
                    avg_pxyAxisMin = data[i][1];
                    avg_pxyAxisMax = data[i][1];
                    percentageyAxisMin = Number(100 * (data[i][1] / yesterdayClose - 1));
                    percentageyAxisMax = Number(100 * (data[i][1] / yesterdayClose - 1));
                    volume_yAxisMin = data[i][2];
                    volume_yAxisMax = data[i][2];
                } else {
                    //除了第一笔，其它都是  返回的 last_px 与前一个对比
                    if (data[i - 1][1] - data[i][1] > 0) {
                        columnColor = blue;
                    }
                    business_amount = data[i][2] - data[i - 1][2];
                }
                avg_pxyAxisMin = avg_pxyAxisMin > data[i][1] ? data[i][1] : avg_pxyAxisMin;
                avg_pxyAxisMax = avg_pxyAxisMax > data[i][1] ? avg_pxyAxisMax : data[i][1];
                percentageyAxisMin = percentageyAxisMin > Number(100 * (data[i][1] / yesterdayClose - 1)) ? Number(100 * (data[i][1] / yesterdayClose - 1)) : percentageyAxisMin;
                percentageyAxisMax = percentageyAxisMax > Number(100 * (data[i][1] / yesterdayClose - 1)) ? percentageyAxisMax : Number(100 * (data[i][1] / yesterdayClose - 1));
                volume_yAxisMin = volume_yAxisMin > business_amount ? business_amount : volume_yAxisMin;
                volume_yAxisMax = volume_yAxisMax > business_amount ? volume_yAxisMax : business_amount;
                //将数据放入 price_trend volume 数组中

                price_trend.push({
                    x: dateUTC,
                    y: Number(data[i][1])
                });
                avg_prices.push({
                    x: dateUTC,
                    y: Number(data[i][3])
                });
                volume.push({
                    x: dateUTC,
                    y: Number(business_amount),
                    color: columnColor
                });

            }

            //将剩下的时间信息补全
            if (obj.flag) {
                appendTimeMessage(price_trend, volume, data, true);
            } else {
                appendTimeMessage(price_trend, volume, data);
            }

            //常量本地化
            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });

            var date;
            if (data.length > 0) {
                date = data[data.length - 1][0] + "";
                var dArr = new Array();
                for (var hh = 0; hh < 5; hh++) {
                    var numb;
                    if (hh == 0) {
                        numb = Number(date.slice(0, 4));
                    } else {
                        numb = Number(date.slice((hh - 1) * 2 + 4, hh * 2 + 4));
                    }

                    dArr.push(numb);
                }
            }
            var last_dataTime = new Date(dArr[0], dArr[1] - 1, dArr[2], dArr[3], dArr[4]);
            var $reporting = $("#report");
            $reporting.html("");
            // Create the chart
            var am_startTime = new Date(last_dataTime);
            am_startTime.setHours(1, 30, 0, 0);
            var am_startTimeUTC = convertDateToUTC(am_startTime);
            var am_midTime = new Date(last_dataTime);
            am_midTime.setHours(2, 30, 0, 0);
            var am_midTimeUTC = convertDateToUTC(am_midTime);

            //股票交易早上最后的时间
            var am_lastTime = new Date(last_dataTime);
            am_lastTime.setHours(3, 30, 0, 0);
            var am_lastTimeUTC = convertDateToUTC(am_lastTime);

            //股票交易下午最后的时间
            var pm_startTime = new Date(last_dataTime);
            pm_startTime.setHours(5, 1, 0, 0);
            var pm_startTimeUTC = convertDateToUTC(pm_startTime);

            var pm_midTime = new Date(last_dataTime);
            pm_midTime.setHours(6, 0, 0, 0);
            var pm_midTimeUTC = convertDateToUTC(pm_midTime);

            var pm_lastTime = new Date(last_dataTime);
            pm_lastTime.setHours(7, 0, 0, 0);
            var pm_lastTimeUTC = convertDateToUTC(pm_lastTime);
            if (obj.flag) {
                var pm_lastTimeone = new Date(last_dataTime);
                pm_lastTimeone.setHours(7, 30, 0, 0);
                var pm_lastTimeUTCone = convertDateToUTC(pm_lastTimeone);
            }

            //----------------------------------------------------------
            // Create the chart
            obj.id.highcharts('StockChart', {
                chart: {
                    //关闭平移
                    panning: false,
                    zoomType: 'none',
                    pinchType: 'none',
                    renderTo: "line_map",
                    margin: [10, 5, 20, 48],
                    spacing: [0, 0, 0, 0],
                    plotBorderColor: '#3C94C4',
                    plotBorderWidth: 0, //边框
                    events: {
                        load: function() {
                            var chart = obj.id.highcharts(); // Highcharts构造函数
                            //基准线
                            chart.yAxis[0].addPlotLine({ //在x轴上增加
                                value: yesterdayClose, //在值为2的地方             //在x轴上增加
                                width: 2, //标示线的宽度为2px
                                color: '#CCC', //标示线的颜色
                                zIndex: 1,
                                id: 'plot-line-' //标示线的id，在删除该标示线的时候需要该id标示
                            });
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    valueDecinale: 2,
                    useHTML: true,
                    formatter: function() {
                        //var _name = this.points[1].series.name;
                        //console.log(this);
                        var _name = obj.codeName;
                        var _date = Highcharts.dateFormat('%b%e日,%A,%H:%M', this.x);
                        var _y = this.points[0].y.toFixed(3);
                        return '<p style="margin:0px;padding:0px;font-size:14px;"><span>' + _name + '   </span><span style="' + Comparative(_y, obj.prev_close) + ';">' + _y + '</span></p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>';
                        //var _yy = this.points[2].y;
                        //return '<p style="margin:0px;padding:0px;font-size:14px;">' + _name +  ' <span style="'+Comparative(_y,obj.prev_close)+';float:right;">'+_y+ '</span></p><p style="margin:0px;padding:0px;font-size:14px;">'+
                        //'成交量：' + ' <span style="float:right;">'+(_yy).toFixed(0)+ '</p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>'
                    }
                },
                plotOptions: {
                    series: {
                        /*关闭动画*/
                        animation: false
                    }
                },
                rangeSelector: {
                    enabled: false
                },
                /*导出配置*/
                exporting: {
                    enabled: false
                },
                /*创建者信息*/
                credits: {
                    enabled: false
                },
                /*下部时间拖拉选择*/
                navigator: {
                    enabled: false,
                    /*关闭时间选择*/
                    baseseries: 10
                },
                scrollbar: {
                    enabled: false /*关闭下方滚动条*/
                },
                /*底部滚动条*/
                scrollbar: {
                    enabled: false
                },

                xAxis: {
                    //type: 'datetime',
                    ordinal: false,
                    breaks: [{ // Nights
                        breakSize: 1,
                        from: am_lastTimeUTC,
                        to: pm_startTimeUTC
                    }],
                    //minRange: 14 * 24 * 36000, // fourteen days
                    showFirstLabel: true,
                    showLastLabel: true,
                    scrollbar: {
                        enabled: true
                    },
                    labels: {
                        // staggerLines:5
                        style: { //字体样式
                            font: 'normal 12px'
                        },
                        formatter: function() {
                            //var returnTime=Highcharts.dateFormat('%H:%M', this.value-Number(8 * 3600 * 1000));
                            var returnTime = Highcharts.dateFormat('%H:%M', this.value);
                            if (returnTime == "09:30") {
                                return '<span style="margin-left:33px;color:#aaa">09:30</span>';
                            }
                            if (returnTime == "11:30") {
                                return '<span style="color:#aaa">11:30/13:00</span>';
                            }
                            if (returnTime == "10:30") {
                                return "";
                            }
                            if (returnTime == "14:00") {
                                return "";
                            }

                            if (obj.flag) {
                                if (returnTime == "15:00") {
                                    return '<span style="display:none">15:00</span>';
                                }

                                if (returnTime == "15:30") {
                                    return '<span style="margin-right:25px;color:#aaa">15:30</span>';
                                }

                            } else {
                                if (returnTime == "15:00") {
                                    return '<span style="margin-right:25px;color:#aaa">15:00</span>';
                                }

                            }


                            return returnTime;

                        },
                        y: 15,
                        step: 1,
                        useHTML: true
                    },
                    tickLength: 5,
                    tickPositioner: function() {
                        if (obj.flag) {
                            var positions = [am_startTimeUTC, am_midTimeUTC, am_lastTimeUTC, pm_midTimeUTC, pm_lastTimeUTC, pm_lastTimeUTCone];
                        } else {
                            var positions = [am_startTimeUTC, am_midTimeUTC, am_lastTimeUTC, pm_midTimeUTC, pm_lastTimeUTC];
                        }

                        //var positions = [am_startTimeUTC,  am_lastTimeUTC,pm_lastTimeUTC];
                        return positions;
                    },
                    gridLineDashStyle: 'ShortDash',
                    gridLineColor: '#f2f2f2',
                    gridLineWidth: 1
                },
                yAxis: [{
                        opposite: false, //是否把它显示到另一边（右边）
                        labels: {
                            enabled: false
                        },
                        title: {
                            text: ''
                        },
                        top: '0%',
                        height: '100%',
                        width: '90%',
                        lineWidth: 0,
                        showFirstLabel: false,
                        showLastLabel: false,
                        gridLineWidth: 0,
                        x: 0,
                        y: 0,
                        tickPositioner: function() { //以yesterdayClose为界限，统一间隔值，从 最小到最大步进
                            positions = [
                                (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(3), (obj.prev_close - Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(3),
                                obj.prev_close.toFixed(3), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low)) / 2).toFixed(3), (obj.prev_close + Math.max(Math.abs(obj.high - obj.prev_close), Math.abs(obj.prev_close - obj.low))).toFixed(3)
                            ];
                            return positions;
                        }
                    }, //y1
                    {
                        opposite: false, //是否把它显示到另一边（右边）
                        showFirstLabel: true,
                        showLastLabel: true,
                        labels: {
                            enabled: true,
                            overflow: 'justify',
                            style: { //字体样式
                                font: 'normal 12px'
                            },
                            align: 'right',
                            x: -5,
                            y: 6,
                            formatter: function() { //最新价  px_last/preclose昨收盘-1
                                //return 100*(((this.value/yesterdayClose)-1).toFixed(4))+"%";
                                return '<span style="color:#aaa;">' + this.value + '</span>';
                            }
                        },
                        useHTML: true,
                        title: {
                            text: ''
                        },
                        lineWidth: 0.5,
                        top: '0%',
                        height: '100%',
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        tickPositioner: function() {
                            return positions;
                        }
                    }
                ],
                series: [{
                    name: obj.codeName,
                    data: price_trend,
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    name: obj.codeName,
                    data: avg_prices,
                    yAxis: 0,
                    color: 'rgb(160, 217, 255)',
                    marker: {
                        symbol: 'diamond'
                    },
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    name: obj.codeName,
                    data: price_trend,
                    type: 'line',
                    lineWidth: 0.5,
                    cursor: 'pointer',
                    onSeries: 'candlestick',
                    color: 'transparent',
                    style: {
                        fontSize: '0px',
                        fontWeight: '0',
                        textAlign: 'center'
                    },
                    zIndex: -1000,
                    yAxis: 1,
                    fillColor: {
                        linearGradient: { //渐变方向
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    dataGrouping: {
                        units: groupingUnits
                    }
                }]
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //返回错误信息
            //console.log("Ajax返回错误信息:"+XMLHttpRequest.status+"~"+XMLHttpRequest.readyState+"~"+textStatus);
        }
    });
}

/***********************************************************************************************************/
/***********************************************************************************************************/
/******************************************上市开放式基金（LOF） -09-15*********************************/
/***********************************************************************************************************/
/***********************************************************************************************************/
var $lofKfsInitPg = 1;

// 获取501 基金代码
function getLofCode501() {
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/list/exchange/lof",
        jsonp: "callback",
        cache: false,
        success: function(resultData) {
            var codeList = resultData.list;
            var _codeStr = "";
            for (var i = 0; i < codeList.length; i++) {
                var _code = codeList[i][0];
                _code = _code.substring(0, 3)
                if (_code == 501) {
                    _codeStr += "_" + codeList[i][0];
                    _codeStr = _codeStr.substr(1);
                };
            };
        }
    });
}

function lofKfsInit(p, pn) {
    //分级LOF基金行情 ID
    var $tableData_hq_lofKfs_table = $("#tableData_hq_lofKfs table"); //内容表格
    var $tableData_hq_lofKfs_title2 = $("#tableData_hq_lofKfs .sse_table_title2"); //二级标题
    var $tableData_hq_lofKfs_pagination = $("#tableData_hq_lofKfs .pagination"); //分页
    var $pageNum = sitePageSize;
    $lofKfsInitPg = p;

    // 获取501 基金代码
    var _codeStr = "";
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/list/exchange/lof",
        jsonp: "callback",
        cache: false,
        success: function(resultData) {
            var codeList = resultData.list;
            for (var i = 0; i < codeList.length; i++) {
                var _code = codeList[i][0];
                _code = _code.substring(0, 3)
                if (_code == 501) {
                    _codeStr += "_" + codeList[i][0];
                    // _codeStr = _codeStr.substr(1);
                };
            };
            console.log(_codeStr.substr(1));
            ajaxGetLofFj({
                id: $tableData_hq_lofKfs_table,
                pagination: $tableData_hq_lofKfs_pagination,
                pageIndex: $lofKfsInitPg * $pageNum - $pageNum,
                pagesize: $lofKfsInitPg * $pageNum,
                pageNum: $pageNum,
                url: "/assortment/fund/list/lofinfo/basic/index.shtml?FUNDID=",
                method: lofKfsInit,
                code: _codeStr.substr(1),
                tits: $tableData_hq_lofKfs_title2
            });
        }
    });

    // ajaxGetLofFj({
    //     id: $tableData_hq_lofKfs_table,
    //     pagination: $tableData_hq_lofKfs_pagination,
    //     pageIndex: $lofKfsInitPg * $pageNum - $pageNum,
    //     pagesize: $lofKfsInitPg * $pageNum,
    //     pageNum: $pageNum,
    //     url: "/assortment/fund/list/lofinfo/basic/index.shtml?FUNDID=",
    //     method: lofKfsInit,
    //     code: "501000_501001",
    //     tits: $tableData_hq_lofKfs_title2
    // });
    window.setInterval(function() {
        ajaxGetLofFj({
            id: $tableData_hq_lofKfs_table,
            pagination: $tableData_hq_lofKfs_pagination,
            pageIndex: $lofKfsInitPg * $pageNum - $pageNum,
            pagesize: $lofKfsInitPg * $pageNum,
            url: "/assortment/fund/list/lofinfo/basic/index.shtml?FUNDID=",
            pageNum: $pageNum,
            method: lofKfsInit,
            code: _codeStr,
            tits: $tableData_hq_lofKfs_title2
        });
    }, 15000);
}

/***********************************************************************************************************/
/***********************************************************************************************************/
/******************************************分级LOF基金行情 2015-09-15***************************************/
/***********************************************************************************************************/
/***********************************************************************************************************/
var $lofFjInitPg = 1;

function lofFjInit(p, pn) {
    //分级LOF基金行情 ID
    var $tableData_hq_lofjj_table = $("#tableData_hq_lofjj table"); //内容表格
    var $tableData_hq_lofjj_title2 = $("#tableData_hq_lofjj .sse_table_title2"); //二级标题
    var $tableData_hq_lofjj_pagination = $("#tableData_hq_lofjj .pagination"); //分页
    var $pageNum = sitePageSize;
    $lofFjInitPg = p;
    ajaxGetLofFj({
        id: $tableData_hq_lofjj_table,
        pagination: $tableData_hq_lofjj_pagination,
        pageIndex: $lofFjInitPg * $pageNum - $pageNum,
        pagesize: $lofFjInitPg * $pageNum,
        url: "/assortment/fund/list/fjlofinfo/basic/index.shtml?FUNDID=",
        pageNum: $pageNum,
        method: lofFjInit,
        code: allcode,
        tits: $tableData_hq_lofjj_title2
    });
    window.setInterval(function() {
        ajaxGetLofFj({
            id: $tableData_hq_lofjj_table,
            pagination: $tableData_hq_lofjj_pagination,
            pageIndex: $lofFjInitPg * $pageNum - $pageNum,
            pagesize: $lofFjInitPg * $pageNum,
            url: "/assortment/fund/list/fjlofinfo/basic/index.shtml?FUNDID=",
            pageNum: $pageNum,
            method: lofFjInit,
            code: allcode,
            tits: $tableData_hq_lofjj_title2
        });
    }, 15000);
}
/**
    合约到期月份(list) 
    */
var _isPage = true;

function ajaxGetLofFj(obj) {
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/list/self/" + obj.code,
        jsonp: "callback",
        data: {
            select: 'code,name,open,high,low,last,prev_close,chg_rate,volume,amount'
        },
        cache: false,
        success: function(resultData) {
            var nowTime = "" + resultData.time;
            if (nowTime.length == 5) {
                nowTime = "0" + resultData.time;
            }
            var _sysDateTime = resultData.date + "" + nowTime;
            //更新时间
            obj.tits.show();
            obj.tits.find("p").html("更新时间： " + _sysDateTime.substring(0, 4) + "-" + _sysDateTime.substring(4, 6) + "-" + _sysDateTime.substring(6, 8) +
                " " + _sysDateTime.substring(8, 10) + ":" + _sysDateTime.substring(10, 12) + ":" + _sysDateTime.substring(12));

            var qqhqList = resultData.list;
            var _total = resultData.total;
            var qqhq_table = [];
            //qqhq_table.push("<tr><th>证券代码</th><th>证券简介</th><th>开盘价</th><th>最高价</th><th>最低价</th><th>当前价</th><th>前日收盘价</th><th>涨跌幅</th><th>成交量(手)</th><th>成交金额(万)</th><th></th></tr>");
            qqhq_table.push("<tr><th>证券代码</th><th>证券简介</th><th>开盘价</th><th>最高价</th><th>最低价</th><th>当前价</th><th>前日收盘价</th><th>涨跌幅</th><th>成交量(手)</th><th>成交额(万元)</th></tr>");
            obj.pagesize = obj.pagesize < _total ? obj.pagesize : _total;
            for (var i = obj.pageIndex; i < obj.pagesize; i++) {
                qqhq_table.push("<tr>");
                qqhq_table.push("<td><a href='" + obj.url + qqhqList[i][0] + "' target='_blank'>" + qqhqList[i][0] + "</a></td>");
                qqhq_table.push("<td>" + qqhqList[i][1] + "</td>");
                qqhq_table.push("<td style='text-align: right;" + Comparative(qqhqList[i][2], qqhqList[i][6]) + "'>" + qqhqList[i][2].toFixed(3) + "</td>");
                qqhq_table.push("<td style='text-align: right;" + Comparative(qqhqList[i][3], qqhqList[i][6]) + "'>" + qqhqList[i][3].toFixed(3) + "</td>");
                qqhq_table.push("<td style='text-align: right;" + Comparative(qqhqList[i][4], qqhqList[i][6]) + "'>" + qqhqList[i][4].toFixed(3) + "</td>");
                qqhq_table.push("<td style='text-align: right;" + Comparative(qqhqList[i][5], qqhqList[i][6]) + "'>" + qqhqList[i][5].toFixed(3) + "</td>");
                qqhq_table.push("<td style='text-align: right;'>" + qqhqList[i][6].toFixed(3) + "</td>");
                qqhq_table.push("<td style='text-align: right;" + Comparative(qqhqList[i][7], 0) + "'>" + qqhqList[i][7].toFixed(2) + "%</td>");
                qqhq_table.push("<td style='text-align: right;'>" + (qqhqList[i][8] / 100).toFixed(0) + "</td>");
                qqhq_table.push("<td style='text-align: right;'>" + (qqhqList[i][9] / 10000).toFixed(3) + "</td>");
                //qqhq_table.push("<td><a href='javascript:;'>行情</a></td>");
                qqhq_table.push("</tr>");
            }
            obj.id.html(qqhq_table.join(""));

            /****************************分页****************************/
            if (_isPage) {
                var pageNum = _total / obj.pageNum;
                if (_total % obj.pageNum > 0) {
                    pageNum = parseInt(_total / obj.pageNum) + 1;
                }
                if (pageNum > 1) {
                    //初始化分页
                    pageNav.go({
                        id: obj.pagination,
                        desc: obj.desc,
                        method: obj.method,
                        p: 1,
                        pn: pageNum
                    });
                    obj.pagination.parent().parent().show();
                    $("#tableData_hq_lofjj .page-con-table").show();
                }

                _isPage = false;
            }
        }
    })
}

/***********************************************************************************************************/
/***********************************************************************************************************/
/*************************************************延时行情 2015-09-15***************************************/
/***********************************************************************************************************/
/***********************************************************************************************************/

function hq_yshqInit() {
    //标的证券(snap) ID
    var $qqhq_snap_table = $("#tableData_qqhq_snapL table");
    var $qqhq_snap_table_title2 = $("#tableData_qqhq_snapL .sse_table_title2");
    //合约到期月份
    var $qqhq_list_table = $("#tableData_qqhq_listL table");
    var $qqhq_list_table_title2 = $("#tableData_qqhq_listL .sse_table_title2");
    //标的证券(snap)  select ID
    var $code_select_id = $("#code_select_snapL");
    $code_select_id.html('<option>请选择</option><option code="510050" selected="selected">510050</option>');
    //$code_select_id.html('<option code="510050" selected="selected">510050</option><option code="510180">510180</option><option code="510300">510300</option><option code="510010">510010</option><option code="510020">510020</option><option code="510060">510060</option>');
    require(['multipleselect'], function() {
        $code_select_id.multipleSelect({
            width: '100%',
            selectAll: false,
            single: true,
            multipleWidth: false,
            maxHeight: 250,
            placeholder: "请选择",
            countSelected: false,
            allSelected: false,
            onClick: function(obj) {
                if (typeof(tableFun) != 'undefined') {
                    var objFun = tableFun[obj.label];
                    if (objFun != undefined) {
                        objFun();
                    }
                }
            }
        });
        //下拉框的选中值可以按如下方式获取,注意要加id属性
        // var single_select_1 = $('#single_select_1').multipleSelect('getSelects');
        // console.log(single_select_1);
    });
    //合约到期月份  select ID
    var $date_select_id = $("#date_select_snapL");


    //获取select初始化值
    var $codes = '510050';
    //获取合约日期
    var $date = $date_select_id.find("option:selected").attr("date");

    //初始化时间
    var $date = ajaxGetListDate({
        id: $date_select_id,
        code: $codes,
        tbid: $qqhq_list_table,
        tits: $qqhq_snap_table_title2,
        titss: $qqhq_list_table_title2
    });

    //select 选择code 重构 标的证券(snap) 
    $code_select_id.change(function() {

        //获取合约日期
        $date = $date_select_id.find("option:selected").attr("date");
        //获取证券code
        $codes = $(this).find("option:selected").attr("code");

        //标的证券(snap) 
        ajaxGetSnap({
            code: $codes,
            id: $qqhq_snap_table,
            tits: $qqhq_snap_table_title2
        });

        //合约到期月份(list)
        ajaxGetList({
            code: $codes + "_" + $date.substring(2),
            id: $qqhq_list_table,
            c: $codes + "C" + $date,
            tits: $qqhq_list_table_title2
        });
    });

    //select 选择合约到期月份重构 合约到期月份(list)
    $date_select_id.change(function() {


        //获取合约日期
        $date = $(this).find("option:selected").attr("date");
        //获取证券code
        $codes = $code_select_id.find("option:selected").attr("code");

        //合约到期月份(list)
        ajaxGetList({
            code: $codes + "_" + $date.substring(2),
            id: $qqhq_list_table,
            c: $codes + "C" + $date,
            tits: $qqhq_list_table_title2
        });
    });

    //初始化 标的证券(snap) 
    ajaxGetSnap({
        code: $codes,
        id: $qqhq_snap_table,
        tits: $qqhq_snap_table_title2
    });



    window.setInterval(function() {
        //获取合约日期
        $date = $date_select_id.find("option:selected").attr("date");
        //初始化 合约到期月份(list)
        ajaxGetList({
            code: $codes + "_" + $date.substring(2),
            id: $qqhq_list_table,
            c: $codes + "C" + $date,
            tits: $qqhq_list_table_title2
        });
    }, 60000);

}

/**
    合约到期月份(list) 
    */
function ajaxGetList(obj) {
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sho/list/tstyle/" + obj.code,
        jsonp: "callback",
        data: {
            select: 'contractid,last,chg_rate,presetpx,exepx'
        },
        cache: false,
        success: function(resultData) {
            var nowTime = "" + resultData.time;
            if (nowTime.length == 5) {
                nowTime = "0" + resultData.time;
            }
            var _sysDateTime = resultData.date + "" + nowTime;
            //更新时间
            obj.tits.show();
            obj.tits.find("p").html("更新时间： " + _sysDateTime.substring(0, 4) + "-" + _sysDateTime.substring(4, 6) + "-" + _sysDateTime.substring(6, 8) +
                " " + _sysDateTime.substring(8, 10) + ":" + _sysDateTime.substring(10, 12) + ":" + _sysDateTime.substring(12));

            //title赋值
            var _dd = obj.code.substring(obj.code.indexOf("_") + 1);

            var qqhqData = resultData;
            var qqhqList = resultData.list;
            var _total = qqhqData.total;
            var qqhq_table = [];
            qqhq_table.push('<tr><th colspan="4" class="T_deep_grey">认购</th><th class="T_deep_grey T_border" id="_mth_title">' + _dd + '月份</th><th colspan="4" class="T_deep_grey">认沽</th></tr>');
            qqhq_table.push("<tr class='T_light_grey'><th>合约交易代码</th><th>当前价</th><th>涨跌幅</th><th>前结价</th><th>行权价</th><th>合约交易代码</th><th>当前价</th><th>涨跌幅</th><th>前结价</th></tr>");
            for (var i = 0; i < _total; i++) {
                var qList = qqhqList[i];
                if (qList[0].indexOf(obj.c) >= 0) {
                    qqhq_table.push("<tr>");
                    //认购 
                    var c_cup = qList[0].substring(0, 7); //交易代码 up
                    var c_cdown = qList[0].substring(7); //交易代码 down
                    var c_flag = qList[0].substring(11, 12) == "M" ? "" : qList[0].substring(11, 12); //行权价标识
                    // var c_flag = qList[0].substring(11,12);//行权价标识
                    var c_xqj = qList[4]; //行权价
                    var c_last = qList[1];
                    var c_presetpx = qList[3];
                    var qqhq_Clist_class = T_Comparative(c_last, c_presetpx);

                    if (Number(c_last) == 0) {
                        c_last = "--";
                    } else {
                        c_last = c_last.toFixed(4)
                    }

                    qqhq_table.push("<td><span>" + c_cup + "<br/>" + c_cdown + "</span></td><td class='" + qqhq_Clist_class + "'>" + c_last + "</td><td class='" + qqhq_Clist_class + "'>" + qqhqList[i][2].toFixed(2) + "%</td><td>" + c_presetpx.toFixed(4) + "</td>");
                    qqhq_table.push("<td class='T_light_grey'>" + Number(c_xqj).toFixed(3) + c_flag + "</td>"); //行权价

                    //认沽
                    for (var j = 0; j < _total; j++) {
                        if (qqhqList[j][0] == qqhqList[i][0].replace("C", "P")) {
                            var p_pup = qqhqList[j][0].substring(0, qqhqList[j][0].indexOf("P") + 1); //交易代码 up
                            var p_pdown = qqhqList[j][0].substring(qqhqList[j][0].indexOf("P") + 1); //交易代码 down

                            var p_last = qqhqList[j][1];

                            var p_presetpx = qqhqList[j][3];

                            var qqhq_Plist_class = T_Comparative(p_last, p_presetpx);

                            if (Number(p_last) == 0) {
                                p_last = "--";
                            } else {
                                p_last = p_last.toFixed(4);
                            }

                            qqhq_table.push("<td><span>" + p_pup + "<br/>" + p_pdown + "</span></td><td class='" + qqhq_Plist_class + "'>" + p_last + "</td><td class='" + qqhq_Plist_class + "'>" + qqhqList[j][2].toFixed(2) + "%</td><td>" + p_presetpx.toFixed(4) + "</td>");
                        }
                    }
                    qqhq_table.push("</tr>");
                }
            }
            obj.id.html(qqhq_table.join(""));
        }
    })
}
/**
    比较大小 赋值变色
    */
function T_Comparative(fir, las) {
    var _cls = "";
    if (Number(fir) > Number(las)) {
        _cls = "T-red";
    } else if (Number(fir) < Number(las)) {
        _cls = "T-green";
    }
    return _cls;
}

//获取合约日期
function ajaxGetListDate(obj) {
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sho/list/exchange/expiremonth",
        jsonp: "callback",
        data: {
            select: 'expiremonth'
        },
        cache: false,
        success: function(resultData) {
            var _listDate = resultData.list;
            var qqhq_date = [];
            for (var i = 0; i < _listDate.length; i++) {
                var _year = (_listDate[i] + "").substring(0, 4);
                var _ye = (_listDate[i] + "").substring(2, 4);
                var _mth = (_listDate[i] + "").substring(4);
                var _th = _ye + _mth;
                qqhq_date.push("<option date='" + _th + "'>" + _year + "年" + _mth + "月</option>");
            }
            obj.id.html(qqhq_date.join(""));
            obj.id.find("option:first").attr("selected", "selected");
            require(['multipleselect'], function() {
                obj.id.multipleSelect({
                    width: '100%',
                    selectAll: false,
                    single: true,
                    multipleWidth: false,
                    maxHeight: 250,
                    placeholder: "请选择",
                    countSelected: false,
                    allSelected: false,
                    onClick: function(obj) {
                        if (typeof(tableFun) != 'undefined') {
                            var objFun = tableFun[obj.label];
                            if (objFun != undefined) {
                                objFun();
                            }
                        }
                    }
                });
                //下拉框的选中值可以按如下方式获取,注意要加id属性
                // var single_select_1 = $('#single_select_1').multipleSelect('getSelects');
                // console.log(single_select_1);
            });

            //var _sysDateTime = resultData.date+""+resultData.time;
            //更新时间
            //$("#tDate_time").html("更新时间： "+_sysDateTime.substring(0,4)+"-"+_sysDateTime.substring(4,6)+"-"+_sysDateTime.substring(6,8)+
            //" "+_sysDateTime.substring(8,10)+":"+_sysDateTime.substring(10,12)+":"+_sysDateTime.substring(12));

            //初始化 合约到期月份(list)
            ajaxGetList({
                code: obj.code + "_" + obj.id.find("option:first").attr("date").substring(2),
                id: obj.tbid,
                c: obj.code + "C" + obj.id.find("option:first").attr("date"),
                tits: obj.titss
            });
        }
    })
}

/**
    标的证券(snap) 
    */
function ajaxGetSnap(obj) {
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/list/self/" + obj.code,
        jsonp: "callback",
        data: {
            select: 'code,name,last,change,chg_rate,amp_rate,volume,amount,prev_close'
        },
        cache: false,
        success: function(resultData) {
            var qqhqList = resultData.list;

            var nowTime = "" + resultData.time;
            if (nowTime.length == 5) {
                nowTime = "0" + resultData.time;
            }
            var _sysDateTime = resultData.date + "" + nowTime;
            //更新时间
            obj.tits.show();
            obj.tits.find("p").html("更新时间： " + _sysDateTime.substring(0, 4) + "-" + _sysDateTime.substring(4, 6) + "-" + _sysDateTime.substring(6, 8) +
                " " + _sysDateTime.substring(8, 10) + ":" + _sysDateTime.substring(10, 12) + ":" + _sysDateTime.substring(12));


            var qqhq_table = [];
            qqhq_table.push("<tr><th>代码</th><th>名称</th><th>当前价</th><th>涨跌</th><th>涨跌幅</th><th>振幅</th><th>成交量(手)</th><th>成交额(万元)</th></tr>");
            for (var i = 0; i < qqhqList.length; i++) {
                qqhq_table.push("<tr>");
                qqhq_table.push("<td desc='code'>" + qqhqList[i][0] + "</td>");
                qqhq_table.push("<td desc='name'>" + qqhqList[i][1] + "</td>");

                var qqhq_last = qqhqList[i][2];
                var qqhq_change = qqhqList[i][3];
                var qqhq_prev_close = qqhqList[i][8];

                var qqhq_class = Comparative(qqhq_last, qqhq_prev_close);

                qqhq_table.push("<td desc='last'  style='text-align: right;" + qqhq_class + "'>" + qqhq_last.toFixed(3) + "</td>");
                qqhq_table.push("<td desc='change' style='text-align: right;" + qqhq_class + "'>" + qqhq_change.toFixed(3) + "</td>");
                qqhq_table.push("<td desc='chg_rate' style='text-align: right;" + qqhq_class + "'>" + qqhqList[i][4] + "%</td>");
                qqhq_table.push("<td desc='amp_rate' style='text-align: right;'>" + qqhqList[i][5] + "%</td>");
                qqhq_table.push("<td desc='volume' style='text-align: right;'>" + (qqhqList[i][6] / 100).toFixed(0) + "</td>");
                var qqhq_amount = qqhqList[i][7] / 10000;
                qqhq_table.push("<td desc='amount'>" + qqhq_amount.toFixed(3) + "</td>");
                qqhq_table.push("</tr>");
            }
            obj.id.html(qqhq_table.join(""));
        }
    })
}



/***********************************************************************************************************/
/***********************************************************************************************************/
/*************************************************ETF 2015-09-15********************************************/
/***********************************************************************************************************/
/***********************************************************************************************************/
/*
    首页-产品-基金-ETF-专栏首页
    */
function etfHomeInit() {
    var $etf_table_id = $("#tableData_etf_hq table"); //table  data
    var $etf_table_sse_table_title2 = $("#tableData_etf_hq .sse_table_title2"); //table  sse_table_title2
    var $codes = "510050_510180_510300_510010_510020_510060";

    ajaxGetETFHome({
        code: $codes,
        id: $etf_table_id,
        tits: $etf_table_sse_table_title2
    });
    window.setInterval(function() {
        ajaxGetETFHome({
            code: $codes,
            id: $etf_table_id,
            tits: $etf_table_sse_table_title2
        });
    }, 60000);
}

function ajaxGetETFHome(obj) {
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/list/self/" + obj.code,
        jsonp: "callback",
        data: {
            select: 'code,name,last,chg_rate,volume,amount,prev_close'
        },
        cache: false,
        success: function(resultData) {
            var etfList = resultData.list;
            var nowTime = "" + resultData.time;
            if (nowTime.length == 5) {
                nowTime = "0" + resultData.time;
            }
            var _sysDateTime = resultData.date + "" + nowTime;
            //var _sysDateTime = resultData.date+""+resultData.time;
            //更新时间
            obj.tits.show();
            obj.tits.find("p").html("更新时间： " + _sysDateTime.substring(0, 4) + "-" + _sysDateTime.substring(4, 6) + "-" + _sysDateTime.substring(6, 8) +
                " " + _sysDateTime.substring(8, 10) + ":" + _sysDateTime.substring(10, 12) + ":" + _sysDateTime.substring(12));

            var etf_table = [];
            //etf_table.push("<tr><th>代码</th><th>名称</th><th>当前价</th><th>涨跌幅</th><th>成交量(手)</th><th>成交额(万元)</th></tr>");
            etf_table.push("<tr><th>代码</th><th>名称</th><th>当前价</th><th>涨跌幅</th><th>成交额(万元)</th></tr>");
            for (var i = 0; i < etfList.length; i++) {
                etf_table.push("<tr>");
                var _cName = etfList[i][1];
                var _cCode = etfList[i][0];
                etf_table.push("<td desc='code'><a href='/assortment/fund/list/etfinfo/basic/index.shtml?FUNDID=" + _cCode + "' target='_blank'>" + _cCode + "</a></td>");
                if (_cCode == '510010') {
                    _cName = '治理ETF';
                } else if (_cCode == '510020') {
                    _cName = '超大ETF';
                } else if (_cCode == '510060') {
                    _cName = '央企ETF';
                }

                etf_table.push("<td desc='name'>" + _cName + "</td>");

                var etf_last = etfList[i][2];
                var etf_chg_rate = etfList[i][3];
                var etf_prev_close = etfList[i][6];

                var etf_class = Comparative(etf_last, etf_prev_close);

                etf_table.push("<td desc='last' style='text-align: right;" + etf_class + "'>" + etf_last.toFixed(3) + "</td>");
                etf_table.push("<td desc='chg_rate' style='text-align: right;" + etf_class + "'>" + etf_chg_rate.toFixed(2) + "%</td>");
                //etf_table.push("<td desc='volume'>"+(etfList[i][4]/100).toFixed(0)+"</td>");
                var etf_amount = etfList[i][5] / 10000;
                etf_table.push("<td desc='amount' style='text-align: right;'>" + etf_amount.toFixed(2) + "</td>");
                etf_table.push("</tr>");
            }
            obj.id.html(etf_table.join(""));

        }
    })
}
/*
    ETF-专栏首页-ETF当前净值（IOPV）
    */

function etfIopvInit() {
    var $etf_table_id = $("#tableData_etf_iopv table"); //table  data
    var $etf_table_sse_table_title2 = $("#tableData_etf_iopv .sse_table_title2"); //table  sse_table_title2
    var $codes = "510011_510021_510031_510051_510061";

    ajaxGetETFIopv({
        code: $codes,
        id: $etf_table_id,
        tits: $etf_table_sse_table_title2
    });
    window.setInterval(function() {
        ajaxGetETFIopv({
            code: $codes,
            id: $etf_table_id,
            tits: $etf_table_sse_table_title2
        });
    }, 60000);
}
/**
    ETF当前净值（IOPV）
    */
function ajaxGetETFIopv(obj) {
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/list/self/" + obj.code,
        jsonp: "callback",
        data: {
            select: 'code,name,nav'
        },
        cache: false,
        success: function(resultData) {
            var etfList = resultData.list;
            var nowTime = "" + resultData.time;
            if (nowTime.length == 5) {
                nowTime = "0" + resultData.time;
            }
            var _sysDateTime = resultData.date + "" + nowTime;
            //更新时间
            obj.tits.show();
            obj.tits.find("p").html("更新时间： " + _sysDateTime.substring(0, 4) + "-" + _sysDateTime.substring(4, 6) + "-" + _sysDateTime.substring(6, 8) +
                " " + _sysDateTime.substring(8, 10) + ":" + _sysDateTime.substring(10, 12) + ":" + _sysDateTime.substring(12));

            var etf_table = [];
            etf_table.push("<tr><th>基金代码</th><th>基金名称</th><th>基金净值</th></tr>");
            for (var i = 0; i < etfList.length; i++) {
                etf_table.push("<tr>");
                etf_table.push("<td desc='code'>" + etfList[i][0] + "</td>");
                etf_table.push("<td desc='name'>" + etfList[i][1] + "</td>");
                etf_table.push("<td desc='nav'>" + etfList[i][1].toFixed(2) + "</td>");
                etf_table.push("</tr>");
            }
            obj.id.html(etf_table.join(""));

        }
    })
}


/**
    首页-产品-基金-ETF-ETF行情
    */
var $hq_etfHqInitPg = 1;

function hq_etfHqInit(p, pn) {
    var $etf_table_id = $("#tableData_etf_list table"); //table  data
    var $etf_table_sse_table_title2 = $("#tableData_etf_list .sse_table_title2"); //table  sse_table_title2
    var $tableData_etf_list_pagination = $("#tableData_etf_list .pagination"); //分页
    var $pageNum = sitePageSize;
    $hq_etfHqInitPg = p;
    // var $codes = "510010_510020_510030_510050_510060_510070_510090_510110_510120_510130_510150_510160_510170_510180_510190_510210_510220_510230_510260_510270_510280_510290_510300_510310_510330_510360_510410_510420_510430_510440_510450_510500_510510_510520_510560_510580_510610_510620_510630_510650_510660_510680_510700_510710_510880_510900_511010_511210_511220_512010_512070_512110_512120_512210_512220_512230_512300_512310_512330_512340_512500_512510_512600_512610_512640_512990_513030_513100_513500_513600_513660_518800_518880";
    //var $codes = "510010_510020_510030_510050_510060_510070_510090_510110_510120_510130_510150_510160_510170_510180_510190_510210_510220_510230_510260_510270_510280_510290_510300_510310_510330_510360_510410_510420_510430_510440_510450_510500_510510_510520_510560_510580_510610_510620_510630_510650_510660_510710_510880_510900_511010_511210_511220_512010_512070_512110_512120_512210_512220_512230_512300_512310_512330_512340_512500_512510_512600_512610_512640_512990_513030_513100_513500_513600_513660_518800_518880";
    var $codes = "";
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/list/exchange/ebs",
        jsonp: "callback",
        data: {
            select: 'code,tradephase'
        },
        cache: false,
        success: function(resultData) {
            var _codeList = resultData.list;
            var _strCode = "";
            for (var i = 0; i < _codeList.length; i++) {
                if (_codeList[i][1].replace(/\s/ig, '') != "P1") {
                    _strCode += _codeList[i][0] + "_";
                }

            }

            _strCode = _strCode.substring(0, _strCode.length - 1);
            $codes = _strCode;
            ajaxGetEtfHq({
                code: _strCode,
                id: $etf_table_id,
                pagination: $tableData_etf_list_pagination,
                pageIndex: $hq_etfHqInitPg * $pageNum - $pageNum,
                pagesize: $hq_etfHqInitPg * $pageNum,
                pageNum: $pageNum,
                method: hq_etfHqInit,
                tits: $etf_table_sse_table_title2
            });
        }
    })

    // ajaxGetEtfHq({
    //  code:$codes,
    //  id:$etf_table_id,
    //  pagination:$tableData_etf_list_pagination,
    //  pageIndex:$hq_etfHqInitPg*$pageNum-$pageNum,
    //  pagesize:$hq_etfHqInitPg*$pageNum,
    //  pageNum:$pageNum,
    //  method:hq_etfHqInit,
    //  tits:$etf_table_sse_table_title2
    // });

    window.setInterval(function() {
        ajaxGetEtfHq({
            code: $codes,
            id: $etf_table_id,
            pagination: $tableData_etf_list_pagination,
            pageIndex: $hq_etfHqInitPg * $pageNum - $pageNum,
            pagesize: $hq_etfHqInitPg * $pageNum,
            pageNum: $pageNum,
            method: hq_etfHqInit,
            tits: $etf_table_sse_table_title2
        });
    }, 15000);
}
var _isPage = true;

function ajaxGetEtfHq(obj) {
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/list/self/" + obj.code,
        jsonp: "callback",
        data: {
            select: 'code,name,open,high,low,last,prev_close,chg_rate,volume,amount'
        },
        cache: false,
        success: function(resultData) {
            var etfList = resultData.list;
            var nowTime = "" + resultData.time;
            if (nowTime.length == 5) {
                nowTime = "0" + resultData.time;
            }
            var _sysDateTime = resultData.date + "" + nowTime;
            //更新时间
            obj.tits.show();
            obj.tits.find("p").html("更新时间： " + _sysDateTime.substring(0, 4) + "-" + _sysDateTime.substring(4, 6) + "-" + _sysDateTime.substring(6, 8) +
                " " + _sysDateTime.substring(8, 10) + ":" + _sysDateTime.substring(10, 12) + ":" + _sysDateTime.substring(12));

            var etf_table = [];
            etf_table.push("<tr><th>证券代码</th><th>证券简介</th><th>开盘价</th><th>最高价</th><th>最低价</th><th>当前价</th><th>前日收盘价</th><th>涨跌幅</th><th>成交量(手)</th><th>成交额(万元)</th></tr>");


            var _total = resultData.total;
            obj.pagesize = obj.pagesize < _total ? obj.pagesize : _total;
            for (var i = obj.pageIndex; i < obj.pagesize; i++) {
                etf_table.push("<tr>");
                etf_table.push("<td><a href='/assortment/fund/list/etfinfo/basic/index.shtml?FUNDID=" + etfList[i][0] + "' target='_blank'>" + etfList[i][0] + "</a></td>");
                etf_table.push("<td>" + etfList[i][1] + "</td>");
                var _etf1 = etfList[i][2].toFixed(3);
                if (_etf1 <= 0) {
                    _etf1 = "--";
                }
                var _etf2 = etfList[i][3].toFixed(3);
                if (_etf2 <= 0) {
                    _etf2 = "--";
                }
                var _etf3 = etfList[i][4].toFixed(3);
                if (_etf3 <= 0) {
                    _etf3 = "--";
                }
                var _etf4 = etfList[i][5].toFixed(3);
                if (_etf4 <= 0) {
                    _etf4 = "--";
                }
                etf_table.push("<td style='text-align: right;" + Comparative(etfList[i][2], etfList[i][6]) + "'>" + _etf1 + "</td>");
                etf_table.push("<td style='text-align: right;" + Comparative(etfList[i][3], etfList[i][6]) + "'>" + _etf2 + "</td>");
                etf_table.push("<td style='text-align: right;" + Comparative(etfList[i][4], etfList[i][6]) + "'>" + _etf3 + "</td>");
                etf_table.push("<td style='text-align: right;" + Comparative(etfList[i][5], etfList[i][6]) + "'>" + _etf4 + "</td>");
                etf_table.push("<td style='text-align: right;'>" + etfList[i][6].toFixed(3) + "</td>");
                etf_table.push("<td style='" + Comparative(etfList[i][7], 0) + "'>" + etfList[i][7].toFixed(2) + "%</td>");
                etf_table.push("<td style='text-align: right;'>" + (etfList[i][8] / 100).toFixed(0) + "</td>");
                etf_table.push("<td style='text-align: right;'>" + (etfList[i][9] / 10000).toFixed(3) + "</td>");
                //qqhq_table.push("<td><a href='javascript:;'>行情</a></td>");
                etf_table.push("</tr>");
            }
            obj.id.html(etf_table.join(""));
            /****************************分页****************************/
            if (_isPage) {
                var pageNum = _total / obj.pageNum;
                if (_total % obj.pageNum > 0) {
                    pageNum = parseInt(_total / obj.pageNum) + 1;
                }
                if (pageNum > 1) {
                    //初始化分页
                    pageNav.go({
                        id: obj.pagination,
                        desc: obj.desc,
                        method: obj.method,
                        p: 1,
                        pn: pageNum
                    });
                    obj.pagination.parent().parent().show();
                    $("#tableData_etf_list .page-con-table").show();
                }

                _isPage = false;
            }
        }
    })
}
/**
    首页-产品-基金-ETF-ETF列表
    */
function hq_etflistLabInit() {
    var $etf_table_id = $("#tableData_etf_listLab table"); //table  data
    var $etf_table_sse_table_title2 = $("#tableData_etf_listLab .sse_table_title2"); //table  sse_table_title2
    //var $codes = "510010_510020_510030_510050_510060_510070_510090_510110_510120_510130_510150_510160_510170_510180_510190_510210_510220_510230_510260_510270_510280_510290_510300_510310_510330_510360_510410_510420_510430_510440_510450_510500_510510_510520_510560_510580_510610_510620_510630_510650_510660_510680_510700_510710_510880_510900_511010_511210_511220_512010_512070_512110_512120_512210_512220_512230_512300_512310_512330_512340_512500_512510_512600_512610_512640_512990_513030_513100_513500_513600_513660_518800_518880";
    var $codes = "";
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/list/exchange/ebs",
        jsonp: "callback",
        data: {
            select: 'code'
        },
        cache: false,
        success: function(resultData) {
            var _codeList = resultData.list;
            var _strCode = "";
            for (var i = 0; i < _codeList.length; i++) {
                if (_codeList[i][1].replace(/\s/ig, '') != "P1") {
                    _strCode += _codeList[i][0] + "_";
                }

            }

            _strCode = _strCode.substring(0, _strCode.length - 1);
            $codes = _strCode;
            ajaxGetEtfListLab({
                code: _strCode,
                id: $etf_table_id,
                tits: $etf_table_sse_table_title2
            });
        }
    })
    // ajaxGetEtfListLab({
    //  code:$codes,
    //  id:$etf_table_id,
    //  tits:$etf_table_sse_table_title2
    // });
    window.setInterval(function() {
        ajaxGetEtfListLab({
            code: $codes,
            id: $etf_table_id,
            tits: $etf_table_sse_table_title2
        });
    }, 30000);
}

function ajaxGetEtfListLab(obj) {
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/list/self/" + obj.code,
        jsonp: "callback",
        data: {
            select: 'code,name,open,high,low,last,prev_close,chg_rate,volume,amount'
        },
        cache: false,
        success: function(resultData) {
            var etfList = resultData.list;
            var nowTime = "" + resultData.time;
            if (nowTime.length == 5) {
                nowTime = "0" + resultData.time;
            }
            var _sysDateTime = resultData.date + "" + nowTime;
            //更新时间
            obj.tits.show();
            obj.tits.find("p").html("更新时间： " + _sysDateTime.substring(0, 4) + "-" + _sysDateTime.substring(4, 6) + "-" + _sysDateTime.substring(6, 8) +
                " " + _sysDateTime.substring(8, 10) + ":" + _sysDateTime.substring(10, 12) + ":" + _sysDateTime.substring(12));

            var etf_table = [];
            /*etf_table.push("<tr><th>证券代码</th><th>证券简介</th><th>开盘价</th><th>最高价</th><th>最低价</th><th>当前价</th><th>前日收盘价</th><th>涨跌幅</th><th>成交量(手)</th><th>成交金额(万)</th></tr>");
            for(var i = 0;i < etfList.length;i++){
                etf_table.push("<tr>");
                etf_table.push("<td>"+etfList[i][0]+"</td>");
                etf_table.push("<td>"+etfList[i][1]+"</td>");
                etf_table.push("<td style='"+Comparative(etfList[i][2],etfList[i][6])+"'>"+etfList[i][2].toFixed(3)+"</td>");
                etf_table.push("<td style='"+Comparative(etfList[i][3],etfList[i][6])+"'>"+etfList[i][3].toFixed(3)+"</td>");
                etf_table.push("<td style='"+Comparative(etfList[i][4],etfList[i][6])+"'>"+etfList[i][4].toFixed(3)+"</td>");
                etf_table.push("<td style='"+Comparative(etfList[i][5],etfList[i][6])+"'>"+etfList[i][5].toFixed(3)+"</td>");
                etf_table.push("<td>"+etfList[i][6].toFixed(3)+"</td>");
                etf_table.push("<td style='"+Comparative(etfList[i][7],0)+"'>"+etfList[i][7].toFixed(2)+"%</td>");
                etf_table.push("<td>"+(etfList[i][8]/100).toFixed(0)+"</td>");
                etf_table.push("<td>"+(etfList[i][9]/10000).toFixed(3)+"</td>");
                //qqhq_table.push("<td><a href='javascript:;'>行情</a></td>");
                etf_table.push("</tr>");
            }*/
            etf_table.push("<tr><th>证券代码</th><th>证券简介</th></tr>");
            for (var i = 0; i < etfList.length; i++) {
                etf_table.push("<tr>");
                etf_table.push("<td>" + etfList[i][0] + "</td>");
                etf_table.push("<td>" + etfList[i][1] + "</td>");
                etf_table.push("</tr>");
            }
            obj.id.html(etf_table.join(""));

        }
    })
}

/***********************************************************************************************************/
/***********************************************************************************************************/
/***********************************************************************************************************/

/**
    比较大小 赋值变色
    */
function Comparative(fir, las) {
    var _cls = "";
    if (Number(fir) > Number(las)) {
        _cls = "color:red;";
    } else if (Number(fir) < Number(las)) {
        _cls = "color:green;";
    }
    return _cls;
}

/***********************************************************************************************************/
/***********************************************************************************************************/
/*************************************************行情首页图 2015-09-15*************************************/
/***********************************************************************************************************/
/***********************************************************************************************************/
var _codeIndex = 0; //选项坐标
//初始化 行情首页
function hq_homeInit() {
    var hCodes = "000001_000016_000010_000009_000300";
    window.setInterval(function() {
        snapAjax(hCodes, _codeIndex);
    }, 15000);
    snapAjax(hCodes, 0);

    var isLoad = true;
    $(window).resize(function() {
        if (isLoad) {
            snapAjax(hCodes, _codeIndex);
            isLoad = false;
        }
    });
}


function snapAjax(_codeS, _codeIndex) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/list/self/" + _codeS,
        jsonp: "callback",
        data: {
            select: 'code,name,last,chg_rate,amount,open,prev_close'
        },
        cache: false,
        success: function(resultData) {
            var _snap_val = resultData.list;
            var _date = resultData.date + "" + resultData.time;
            _date = dateFormat2(_date);
            var ul01Arr = [];
            var ul02Arr = [];
            for (var i = 0; i < _snap_val.length; i++) {
                var color;
                var classs;
                var _name = _snap_val[i][1]; //名称
                var _xj = _snap_val[i][2]; //现价
                var _zs = _snap_val[i][6]; //昨收
                var _zdf = _snap_val[i][3].toFixed(2) + ''; //涨跌幅
                var _cje = _snap_val[i][4]; //成交额
                _cje = _cje / 100000000;
                ul01Arr.push("<li page='" + i + "' tis='true'>" + _name + "</li>");
                if (_zs != _xj) {
                    if (_zdf > 0) {
                        _zdf = "+" + _zdf;
                        classs = "col_red";
                    } else {
                        //_zdf = "-"+_zdf;
                        classs = "col_green";
                    }
                } else {
                    classs = "col_color";
                }

                //ul02Arr.push("<li page='"+i+"'><span class="+classs+">"+_xj.toFixed(2)+"</span><span class='"+classs+" float_right'>"+_cje.toFixed(2)+"亿元</span><span class='"+classs+" float_right'>"+_zdf+"%</span></li>");
                ul02Arr.push("<li page='" + i + "'><span class='" + classs + "'>" + _xj.toFixed(2) + "</span><span class='" + classs + "'>" + _zdf + "%</span><span class='" + classs + "' title='成交额'>" + _cje.toFixed(0) + "亿元</span></li>");

            }
            $("#ul01").html(ul01Arr.join(""));
            $("#ul02").html(ul02Arr.join(""));

            /*var _codes= new Array();
            _codes=(_codeS+"").split("_"); //字符分割 
            console.log(_codes[_codeIndex]);*/

            var _last = _snap_val[_codeIndex][2];
            var _open = _snap_val[_codeIndex][5];
            var _code = _snap_val[_codeIndex][0];
            var _codeName = _snap_val[_codeIndex][1];
            var _prev_close = _snap_val[_codeIndex][6];
            li_click(_codeS);
            cg_bgStyle(_codeIndex);
            $("._date").html(_date);
            ajax(_code, _last, _open, _codeName, _prev_close);
        }
    })
}

//点击切换
function li_click(_code) {

    $("#ul01 li").click(function() {
        snapAjax(_code, $(this).attr("page"));
        _codeIndex = $(this).attr("page");
    });
    $("#ul02 li").click(function() {
        snapAjax(_code, $(this).attr("page"));
        _codeIndex = $(this).attr("page");
    });
}

function cg_bgStyle(_page) {
    $(".ul01 li").removeClass("cl_bgColor1").removeClass("cl_bgColor2");
    $(".ul01 li").each(function() {
        if ($(this).attr("tis")) {
            if ($(this).attr("page") == _page) {
                $(this).addClass("cl_bgColor1");
            } else {
                $(this).addClass("cl_bgColor2");
            }
        } else if ($(this).attr("page") == _page) {
            $(this).addClass("cl_bgColor1");
            $(this).show();

            if ($(this).find("span").attr("class") == "col_green") {
                $(this).find("span").removeClass("col_green").addClass("col_green1");
            } else if ($(this).find("span").attr("class") == "col_red") {
                $(this).find("span").removeClass("col_red").addClass("col_red1");
            }

        } else {
            $(this).addClass("cl_bgColor2");
        }
    });
}


function dateFormat2(_staDate) {
    var year = _staDate.substring(0, 4);
    var month = _staDate.substring(4, 6);
    var day = _staDate.substring(6, 8);

    var hour = _staDate.substring(8, _staDate.length - 4);
    var minute = _staDate.substring(_staDate.length - 4, _staDate.length - 2);
    var second = _staDate.substring(_staDate.length - 2);
    return year + "年" + month + "月" + day + "日  " + hour + ":" + minute + ":" + second;
}

function dateFormat(_staDate) {
    var year = _staDate.substring(0, 4);
    var month = _staDate.substring(4, 6);
    var day = _staDate.substring(6, 8);
    var hour = _staDate.substring(8, 10);
    var minute = _staDate.substring(10, 12);
    var second = _staDate.substring(12);
    return year + "年" + month + "月" + day + "日  " + hour + ":" + minute + ":" + second;
}

Date.prototype.Format = function(fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    }

    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 * 获取日期对象，如果isUTC为true获取 日期的UTC对象，false则获取普通日期对象
 * @param date
 * @param isUTC
 * @returns
 */
function getDateUTCOrNot(date, isUTC) {
    if (!(date instanceof String)) {
        date += "";
    }
    var dArr = new Array();
    for (var hh = 0; hh < 5; hh++) {
        var numb;
        if (hh == 0) {
            numb = Number(date.slice(0, 4));
        } else {
            numb = Number(date.slice((hh - 1) * 2 + 4, hh * 2 + 4));
        }

        dArr.push(numb);
    }
    if (isUTC == false) {
        return new Date(dArr[0], dArr[1] - 1, dArr[2], dArr[3], dArr[4]);
    }
    var dateUTC = Number(Date.UTC(dArr[0], dArr[1] - 1, dArr[2], dArr[3], dArr[4])); //得出的UTC时间

    return dateUTC;
}

//数据补全
function appendTimeMessage(price_trend, volume, data, flag) {
    var date = data[data.length - 1][0] + "";
    var last_dataTime = getDateUTCOrNot(date, false);
    //股票交易早上最后的时间
    var am_lastTime = new Date(last_dataTime);
    am_lastTime.setHours(1, 30, 0, 0);
    //股票交易下午最后的时间
    var pm_startTime = new Date(last_dataTime);
    pm_startTime.setHours(5, 1, 0, 0);
    var pm_lastTime = new Date(last_dataTime);
    if (flag) {
        pm_lastTime.setHours(7, 30, 0, 0);
    } else {
        pm_lastTime.setHours(7, 0, 0, 0);
    }

    //如果获取的时间11：:30之前的计算
    if (last_dataTime < am_lastTime) {
        var i = last_dataTime;
        i.setMinutes((i.getMinutes() + 1));
        for (; i <= am_lastTime; i.setMinutes((i.getMinutes() + 1))) {
            price_trend.push({
                x: convertDateToUTC(i)
            });
            volume.push({
                x: convertDateToUTC(i)
            });
        }
        i = pm_startTime;
        for (; i <= pm_lastTime; i.setMinutes((i.getMinutes() + 1))) {
            price_trend.push({
                x: convertDateToUTC(i)
            });
            volume.push({
                x: convertDateToUTC(i)
            });
        }
    } else if (last_dataTime < pm_lastTime) { //获取的时间下午13:00之后的计算
        var i;
        if (Number(last_dataTime) == Number(am_lastTime)) {
            i = pm_startTime;
        } else {
            i = last_dataTime;
        }
        i.setMinutes((i.getMinutes() + 1));
        for (; i <= pm_lastTime; i.setMinutes((i.getMinutes() + 1))) {
            price_trend.push({
                x: convertDateToUTC(i)
            });
            volume.push({
                x: convertDateToUTC(i)
            });
        }
    }
}


function ajax(_code, _last, _open, _codeName, _prev_close) {
    //Ajax获取根据参数获取结果集
    $.ajax({
        type: 'POST',
        dataType: "jsonp",
        url: hq_queryUrl + "/v1/sh1/line/" + _code,
        data: {
            begin: 0,
            end: -1,
            select: 'time,price,volume'
        },
        jsonp: "callback",
        cache: false,
        success: function(resultData) {
            var dd = resultData;
            var d = dateConvert({
                data: dd,
                last: _last,
                open: _open
            });
            //var data = null;
            var data = d.line;
            //没数据时不显示图表
            if (data.length == 0) {
                $('#ticker01').html("<div class='chart_container'></div>");
                return;
            }
            Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                lang: {
                    loading: "加载中",
                    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    noData: "没有数据",
                    numericSymbols: ["千", "兆", "G", "T", "P", "E"],
                    printChart: "打印图表",
                    resetZoom: "恢复缩放",
                    resetZoomTitle: "恢复图表",
                    shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    thousandsSep: ",",
                    weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
                }
            });
            //初始化开------------------------
            var groupingUnits = [
                [
                    'minute', // unit name
                    [1] // allowed multiples
                ]
            ];
            var avg_pxyAxisMin; //Y轴最小值
            var avg_pxyAxisMax; //Y轴最大值 
            var percentageyAxisMin; //Y轴百分比最小
            var percentageyAxisMax; //Y轴百分比最大
            var volume_yAxisMin; //成交量最小
            var volume_yAxisMax; //成交量最大
            var red = "#ff0000";
            var blue = "#00a800";
            var price_trend = [],
                volume = [], //成交量
                i = 0;
            //图表上的成交量第一条的数据红绿的判断 是根据昨日的收盘价preclose_px 和今日的最新价last_px进行对比
            //同时获取的昨日收盘价  用于涨幅的计算
            var isFirstLineColorflag = true;
            //保存昨收数据
            var yesterdayClose;
            //容错判断
            if (data != undefined && data != null && data.length == 0) {
                try {
                    failCallback();
                } catch (e) {

                }
                return;
            }
            //今开
            var open_px = data[i][1];
            //昨收
            //var preclose_px=data[i][3];
            var preclose_px = d.prev_close;
            yesterdayClose = preclose_px;
            isFirstLineColorflag = open_px > preclose_px ? true : false;
            // split the data set into price_trend and volume
            //数据处理
            for (i; i < data.length; i += 1) {
                var _dates = data[i][0] + "";
                var _hours = _dates.substring(8, 10);
                var dateUTC = getDateUTCOrNot(_dates, true);
                var business_amount = data[i][2];
                var columnColor = red;
                if (i == 0) { //第一笔的 红绿柱 判断依据是根据 今天开盘价与昨日收盘价比较
                    if (isFirstLineColorflag == false) {
                        columnColor = blue;
                    }
                    avg_pxyAxisMin = data[i][1];
                    avg_pxyAxisMax = data[i][1];
                    percentageyAxisMin = Number(100 * (data[i][1] / yesterdayClose - 1));
                    percentageyAxisMax = Number(100 * (data[i][1] / yesterdayClose - 1));
                    volume_yAxisMin = data[i][2];
                    volume_yAxisMax = data[i][2];
                } else {

                    //除了第一笔，其它都是  返回的 last_px 与前一个对比
                    if (data[i - 1][1] - data[i][1] > 0) {
                        columnColor = blue;
                    }
                    //business_amount=data[i][2]-data[i-1][2];
                }
                avg_pxyAxisMin = avg_pxyAxisMin > data[i][1] ? data[i][1] : avg_pxyAxisMin;
                avg_pxyAxisMax = avg_pxyAxisMax > data[i][1] ? avg_pxyAxisMax : data[i][1];
                percentageyAxisMin = percentageyAxisMin > Number(100 * (data[i][1] / yesterdayClose - 1)) ? Number(100 * (data[i][1] / yesterdayClose - 1)) : percentageyAxisMin;
                percentageyAxisMax = percentageyAxisMax > Number(100 * (data[i][1] / yesterdayClose - 1)) ? percentageyAxisMax : Number(100 * (data[i][1] / yesterdayClose - 1));
                volume_yAxisMin = volume_yAxisMin > business_amount ? business_amount : volume_yAxisMin;
                volume_yAxisMax = volume_yAxisMax > business_amount ? volume_yAxisMax : business_amount;
                //将数据放入 price_trend volume 数组中

                price_trend.push({
                    x: dateUTC,
                    y: Number(data[i][1])
                });
                volume.push({
                    x: dateUTC,
                    y: Number(business_amount),
                    color: columnColor
                });
            }

            //将剩下的时间信息补全
            appendTimeMessage(price_trend, volume, data);
            //常量本地化
            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });

            var date;
            if (data.length > 0) {
                date = data[data.length - 1][0] + "";
                var dArr = new Array();
                for (var hh = 0; hh < 5; hh++) {
                    var numb;
                    if (hh == 0) {
                        numb = Number(date.slice(0, 4));
                    } else {
                        numb = Number(date.slice((hh - 1) * 2 + 4, hh * 2 + 4));
                    }

                    dArr.push(numb);
                }
            }
            var last_dataTime = new Date(dArr[0], dArr[1] - 1, dArr[2], dArr[3], dArr[4]);
            var $reporting = $("#report");
            $reporting.html("");
            // Create the chart
            var am_startTime = new Date(last_dataTime);
            am_startTime.setHours(1, 30, 0, 0);
            var am_startTimeUTC = convertDateToUTC(am_startTime);
            var am_midTime = new Date(last_dataTime);
            am_midTime.setHours(2, 30, 0, 0);
            var am_midTimeUTC = convertDateToUTC(am_midTime);

            //股票交易早上最后的时间
            var am_lastTime = new Date(last_dataTime);
            am_lastTime.setHours(3, 30, 0, 0);
            var am_lastTimeUTC = convertDateToUTC(am_lastTime);

            //股票交易下午最后的时间
            var pm_startTime = new Date(last_dataTime);
            pm_startTime.setHours(5, 1, 0, 0);
            var pm_startTimeUTC = convertDateToUTC(pm_startTime);

            var pm_midTime = new Date(last_dataTime);
            pm_midTime.setHours(6, 0, 0, 0);
            var pm_midTimeUTC = convertDateToUTC(pm_midTime);

            var pm_lastTime = new Date(last_dataTime);
            pm_lastTime.setHours(7, 0, 0, 0);
            var pm_lastTimeUTC = convertDateToUTC(pm_lastTime);


            //----------------------------------------------------------
            // Create the chart
            $('#ticker01').highcharts('StockChart', {
                chart: {
                    //关闭平移
                    panning: false,
                    zoomType: 'none',
                    pinchType: 'none',
                    renderTo: "line_map",
                    margin: [10, 57, 20, 1],
                    spacing: [0, 0, 0, 0],
                    plotBorderColor: '#3C94C4',
                    plotBorderWidth: 0, //边框
                    events: {
                        load: function() {
                            var chart = $("#ticker01").highcharts(); // Highcharts构造函数
                            //基准线
                            chart.yAxis[0].addPlotLine({ //在x轴上增加
                                value: yesterdayClose, //在值为2的地方             //在x轴上增加
                                width: 2, //标示线的宽度为2px
                                color: '#CCC', //标示线的颜色
                                zIndex: 1,
                                id: 'plot-line-' //标示线的id，在删除该标示线的时候需要该id标示
                            });
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    valueDecinale: 2,
                    useHTML: true,
                    formatter: function() {
                        //var _name = this.points[1].series.name;
                        var _name = _code;
                        var _date = Highcharts.dateFormat('%b%e日,%A,%H:%M', this.x);
                        var _y = this.points[0].y.toFixed(2);
                        //console.log(_y+"~"+_prev_close+"~"+Comparative(_y,_prev_close));
                        return '<p style="margin:0px;padding:0px;font-size:14px;"><span>' + _name + '  </span><span style="' + Comparative(_y, _prev_close) + ';">' + _y + '</span></p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>';
                        //var _yy = this.points[2].y;
                        //return '<p style="margin:0px;padding:0px;font-size:14px;">' + _name +  ' <span style="'+Comparative(_y,obj.prev_close)+';float:right;">'+_y+ '</span></p><p style="margin:0px;padding:0px;font-size:14px;">'+
                        //'成交量：' + ' <span style="float:right;">'+(_yy).toFixed(0)+ '</p><p style="margin:0px;padding:0px;color:#999">' + _date + '</p>'
                    }
                },
                plotOptions: {
                    series: {
                        /*关闭动画*/
                        animation: false
                    }
                },
                rangeSelector: {
                    enabled: false
                },
                /*导出配置*/
                exporting: {
                    enabled: false
                },
                /*创建者信息*/
                credits: {
                    enabled: false
                },
                /*下部时间拖拉选择*/
                navigator: {
                    enabled: false,
                    /*关闭时间选择*/
                    baseseries: 10
                },
                scrollbar: {
                    enabled: false /*关闭下方滚动条*/
                },
                /*底部滚动条*/
                scrollbar: {
                    enabled: false
                },

                xAxis: {
                    //type: 'datetime',
                    ordinal: false,
                    breaks: [{ // Nights
                        breakSize: 1,
                        from: am_lastTimeUTC,
                        to: pm_startTimeUTC
                    }],
                    //minRange: 14 * 24 * 36000, // fourteen days
                    showFirstLabel: true,
                    showLastLabel: true,
                    scrollbar: {
                        enabled: true
                    },
                    labels: {
                        // staggerLines:5
                        style: { //字体样式
                            font: 'normal 12px'
                        },
                        formatter: function() {
                            //var returnTime=Highcharts.dateFormat('%H:%M', this.value-Number(8 * 3600 * 1000));
                            var returnTime = Highcharts.dateFormat('%H:%M', this.value);
                            if (returnTime == "09:30") {
                                return '<span style="margin-left:33px;color:#aaa">09:30</span>';
                            }
                            if (returnTime == "11:30") {
                                return '<span style="color:#aaa">11:30/13:00</span>';
                            }
                            if (returnTime == "10:30") {
                                return "";
                            }
                            if (returnTime == "14:00") {
                                return "";
                            }
                            if (returnTime == "15:00") {
                                return '<span style="margin-right:35px;color:#aaa">15:00</span>';
                            }
                            return returnTime;

                        },
                        y: 15,
                        step: 1,
                        useHTML: true
                    },
                    tickLength: 5,
                    tickPositioner: function() {
                        var positions = [am_startTimeUTC, am_midTimeUTC, am_lastTimeUTC, pm_midTimeUTC, pm_lastTimeUTC];
                        //var positions = [am_startTimeUTC,  am_lastTimeUTC,pm_lastTimeUTC];
                        return positions;
                    },
                    gridLineDashStyle: 'ShortDash',
                    gridLineColor: '#f2f2f2',
                    gridLineWidth: 1
                },
                yAxis: [{
                        opposite: true, //是否把它显示到另一边（右边）
                        labels: {
                            enabled: false
                        },
                        title: {
                            text: ''
                        },
                        top: '0%',
                        height: '100%',
                        lineWidth: 0,
                        showFirstLabel: false,
                        showLastLabel: false,
                        gridLineWidth: 0,
                        x: 0,
                        y: 0,
                        tickPositioner: function() { //以yesterdayClose为界限，统一间隔值，从 最小到最大步进
                            positions = [],
                                tick = Number(avg_pxyAxisMin),
                                increment = Number((avg_pxyAxisMax - avg_pxyAxisMin) / 3);
                            var tickMin = Number(avg_pxyAxisMin),
                                tickMax = Number(avg_pxyAxisMax);
                            if (0 == data.length) { //还没有数据时，yesterdayClose 的幅值 在 -1% - 1%上下浮动
                                tickMin = 0.99 * yesterdayClose;
                                tickMax = 1.01 * yesterdayClose;
                            } else if (0 == increment) { //有数据了  但是数据都是一样的幅值
                                if (yesterdayClose > Number(avg_pxyAxisMin)) {
                                    tickMin = Number(avg_pxyAxisMin);
                                    tickMax = 2 * yesterdayClose - Number(avg_pxyAxisMin);
                                } else if (yesterdayClose < Number(avg_pxyAxisMin)) {
                                    tickMax = Number(avg_pxyAxisMax);
                                    tickMin = yesterdayClose - (Number(avg_pxyAxisMax) - yesterdayClose);
                                } else {
                                    tickMin = 0.99 * yesterdayClose;
                                    tickMax = 1.01 * yesterdayClose;
                                }
                            } else if ((avg_pxyAxisMin - yesterdayClose) < 0 && (avg_pxyAxisMax - yesterdayClose) > 0) { //最小值在昨日收盘价下面，最大值在昨日收盘价上面
                                var limit = Math.max(Math.abs(avg_pxyAxisMin - yesterdayClose), Math.abs(avg_pxyAxisMax - yesterdayClose));
                                tickMin = yesterdayClose - limit;
                                tickMax = yesterdayClose + limit;
                            } else if (avg_pxyAxisMin > yesterdayClose && avg_pxyAxisMax > yesterdayClose) { //最小最大值均在昨日收盘价上面
                                tickMax = avg_pxyAxisMax;
                                tickMin = yesterdayClose - (tickMax - yesterdayClose);

                            } else if (avg_pxyAxisMin < yesterdayClose && avg_pxyAxisMax < yesterdayClose) { //最小最大值均在昨日收盘价下面
                                tickMin = avg_pxyAxisMin;
                                tickMax = yesterdayClose + (yesterdayClose - tickMin);
                            }
                            if (tickMax > (2 * yesterdayClose)) { //数据超过100%了
                                tickMax = 2 * yesterdayClose;
                                tickMin = 0;
                            }
                            var interval = Number(tickMax - yesterdayClose) / 10;
                            tickMax += interval;
                            tickMin = yesterdayClose - (tickMax - yesterdayClose);
                            increment = (tickMax - yesterdayClose) / 2; //基准线位置
                            tick = tickMin;
                            var i = 0;
                            for (tick; i++ < 5; tick += increment) {
                                var _fix = (Number(tick)).toFixed(2);
                                positions.push(_fix);
                            }

                            return positions;
                        }
                    }, //y1
                    {
                        opposite: true, //是否把它显示到另一边（右边）
                        showFirstLabel: true,
                        showLastLabel: true,
                        labels: {
                            enabled: true,
                            overflow: 'justify',
                            style: { //字体样式
                                font: 'normal 12px'
                            },
                            align: 'right',
                            x: 55,
                            y: 6,
                            formatter: function() { //最新价  px_last/preclose昨收盘-1
                                //return 100*(((this.value/yesterdayClose)-1).toFixed(4))+"%";
                                return '<span style="color:#aaa;">' + this.value + '</span>';
                            }
                        },
                        useHTML: true,
                        title: {
                            text: ''
                        },
                        lineWidth: 1,
                        top: '0%',
                        height: '100%',
                        gridLineWidth: 1,
                        gridLineDashStyle: 'ShortDash',
                        gridLineColor: '#f2f2f2',
                        tickPositioner: function() {
                            return positions;
                        }
                    }
                ],
                series: [{
                    name: _codeName,
                    data: price_trend,
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    name: _codeName,
                    data: price_trend,
                    type: 'area',
                    cursor: 'pointer',
                    onSeries: 'candlestick',
                    color: 'transparent',
                    style: {
                        fontSize: '0px',
                        fontWeight: '0',
                        textAlign: 'center'
                    },
                    zIndex: -1000,
                    yAxis: 1,
                    fillColor: {
                        linearGradient: { //渐变方向
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    dataGrouping: {
                        units: groupingUnits
                    }
                }]
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //返回错误信息
            //console.log("Ajax返回错误信息:"+XMLHttpRequest.status+"~"+XMLHttpRequest.readyState+"~"+textStatus);
        }
    });
}

/***********************************************************************************************************/
/***********************************************************************************************************/
/*************************************************分页 2015-09-15*******************************************/
/***********************************************************************************************************/
/***********************************************************************************************************/

var pageNav = pageNav || {};
pageNav.fn = null;
//p为当前页码,pn为总页数
pageNav.nav = function(p, pn) {
    //只有一页,直接显示1
    if (pn <= 1) {
        this.p = 1;
        this.pn = 1;
        return this.pHtml2(true, 1);
    }
    if (pn < p) {
        p = pn;
    }

    var re = "";
    //第一页
    if (p <= 1) {
        p = 1;
    } else {
        //非第一页
        re += this.pHtmlnp(p - 1, pn, "glyphicon glyphicon-menu-left");
        //总是显示第一页页码
        re += this.pHtml(1, pn, "1");
    }
    //校正页码
    this.p = p;
    this.pn = pn;

    //开始页码
    var start = 2;
    var end = (pn < 5) ? pn : 5;
    //第五页时开始现实省略号
    if (p >= 5) {
        re += this.pHtml2(false, "...");
        start = p - 2; //省略号前 显示几页
        var e = p + 2; //省略号后 显示几页
        end = (pn < e) ? pn : e;
    }
    for (var i = start; i < p; i++) {
        re += this.pHtml(i, pn);
    }

    re += this.pHtml2(true, p);
    for (var i = p + 1; i <= end; i++) {
        re += this.pHtml(i, pn);
    }

    if (end < pn) {
        re += this.pHtml2(false, "...");
        //显示最后一页页码,如不需要则去掉下面这一句
        re += this.pHtml(pn, pn);
    }

    if (p < pn) {
        re += this.pHtmlnp(p + 1, pn, "glyphicon glyphicon-menu-right");
    }



    return re;
}

//显示非当前页
pageNav.pHtml = function(pageNo, pn, showPageNo) {
    showPageNo = showPageNo || pageNo;
    var H = "<li><a href='javascript:;' ipn='" + pageNo + "' page='" + pn + "' >" + showPageNo + "</a></li>";
    return H;

}


//显示当前页
pageNav.pHtml2 = function(isn, pageNo) {
    var H = "";
    if (isn) {
        H = "<li><a href='javascript:;' class='active' page='" + pageNo + "'>" + pageNo + "</a></li>";
    } else {
        H = "<li><a href='javascript:;' class='disable'>" + pageNo + "</a></li>";
    }

    return H;
}


//显示上下页
pageNav.pHtmlnp = function(pageNo, pn, showPageNo) {
    // showPageNo = showPageNo || pageNo;
    var H = "<li><a href='javascript:;' ipn='" + pageNo + "' page='" + pn + "' ><span aria-hidden='true' class='" + showPageNo + "'></span></a></li>";
    return H;
}



//输出页码,可根据需要重写此方法
pageNav.go = function(obj) {
    obj.id.html(this.nav(obj.p, obj.pn));
    obj.id.find("li a").click(function() {
        offsetTops(obj.id.parent().parent().parent());
        if ($(this).attr("ipn") != null && $(this).attr("page") != null) {
            pageNav.go({
                id: obj.id,
                desc: obj.desc,
                method: obj.method,
                p: Number($(this).attr("ipn")),
                pn: Number($(this).attr("page"))
            });
            obj.method(Number($(this).attr("ipn")), Number($(this).attr("page")));
        }

    });
    if (obj.desc != null) {
        obj.desc.html("当前页:" + obj.p + "  ,  总页: " + obj.pn);
    }

}



var $pages_index = 0;
var $pagesCount = 0;
var allcode = ""
$(function() {

    /*
        行情首页图 初始化
        */
    var _$hq_home = $('#ticker01');
    if (_$hq_home.length > 0) {
        if (checkBrowser()) {
            hq_homeInit();
        }

    }
    /*
        市场数据查询
        */
    var _$dataScsjSearch = $('.cScshSearch');
    if (_$dataScsjSearch.length > 0) {
        //alert("测试、请忽略！");
        dataScsjSearchInit();
    }
    /*
        首页数据行情信息行情走势

        */
    var _$search_market_L = $('.search_market_L');
    if (_$search_market_L.length > 0) {
        marketLineIni();
    }
    /*
        延时行情

        */
    var _$delayAjax_hq = $('.delayAjax_hq');
    if (_$delayAjax_hq.length > 0) {
        delayInit();
    }

    /*
        ETF首页行情 初始化
        */
    var _$hq_etfHome = $('#tableData_etf_hq');
    if (_$hq_etfHome.length > 0) {
        etfHomeInit();
    }

    /*
        ETF IOPV 初始化
        */
    var _$hq_etfIopv = $('#tableData_etf_iopv');
    if (_$hq_etfIopv.length > 0) {
        etfIopvInit();
    }

    /*
        ETF行情 初始化
        */
    var _$hq_etfLab = $('#tableData_etf_list');
    if (_$hq_etfLab.length > 0) {
        hq_etfHqInit(1, 10);
        $("#tableData_etf_list .mobile-page button").click(function() {
            offsetTops($("#tableData_etf_list"));
            if (!$(this).hasClass('next-page')) {
                //下一页
                var _nex = $("#tableData_etf_list .pagination li:first a");
                if (typeof(_nex.attr("ipn")) != "undefined") {
                    hq_etfHqInit(_nex.attr("ipn"), _nex.attr("page"));
                    //初始化分页
                    pageNav.go({
                        id: $("#tableData_etf_list .pagination"),
                        method: hq_etfHqInit,
                        p: Number(_nex.attr("ipn")),
                        pn: Number(_nex.attr("page"))
                    });
                }

            } else {
                //上一页
                var _pag = $("#tableData_etf_list .pagination li:last a");
                if (typeof(_pag.attr("ipn")) != "undefined") {
                    hq_etfHqInit(_pag.attr("ipn"), _pag.attr("page"));
                    //初始化分页
                    pageNav.go({
                        id: $("#tableData_etf_list .pagination"),
                        method: hq_etfHqInit,
                        p: Number(_pag.attr("ipn")),
                        pn: Number(_pag.attr("page"))
                    });
                }

            }

        });
    }

    /*
        ETF-ETF列表 初始化
        */
    var _$hq_etfListLab = $('#tableData_etf_listLab');
    if (_$hq_etfListLab.length > 0) {
        hq_etflistLabInit();
    }

    /*
        延时行情 初始化
        */
    var _$hq_qqhq_snapL = $('#tableData_qqhq_snapL');
    var _$hq_qqhq_listL = $('#tableData_qqhq_listL');
    if (_$hq_qqhq_snapL.length > 0 || _$hq_qqhq_listL.length > 0) {
        hq_yshqInit();
    }

    /*
        分级LOF基金行情 初始化
        */
    var _$tableData_hq_lofjj = $('#tableData_hq_lofjj');
    if (_$tableData_hq_lofjj.length > 0) {
        $.ajax({
            url: sseQueryURL + 'commonQuery.do',
            type: "POST",
            dataType: "jsonp",
            jsonp: "jsonCallBack",
            jsonpCallback: "jsonpCallback" + Math.floor(Math.random() * (100000 + 1)),
            data: {
                "sqlId": "COMMON_SSE_ZQPZ_FJLOFLB_L_NEW"
            },
            success: function(dataJson) {
                for (var ht_i = 0; ht_i < dataJson.result.length; ht_i++) {
                    allcode += dataJson.result[ht_i].FUND_CODE + '_' + dataJson.result[ht_i].SUB_CODE1 + '_' + dataJson.result[ht_i].SUB_CODE2 + '_';
                }
                lofFjInit(1, 10);
            }
        })

        $("#tableData_hq_lofjj .mobile-page button").click(function() {
            offsetTops($("#tableData_hq_lofjj"));
            if (!$(this).hasClass('next-page')) {
                //下一页
                var _nex = $("#tableData_hq_lofjj .pagination li:first a");
                if (typeof(_nex.attr("ipn")) != "undefined") {
                    lofFjInit(_nex.attr("ipn"), _nex.attr("page"));
                    //初始化分页
                    pageNav.go({
                        id: $("#tableData_hq_lofjj .pagination"),
                        method: lofFjInit,
                        p: Number(_nex.attr("ipn")),
                        pn: Number(_nex.attr("page"))
                    });
                }

            } else {
                //上一页
                var _pag = $("#tableData_hq_lofjj .pagination li:last a");
                if (typeof(_pag.attr("ipn")) != "undefined") {
                    lofFjInit(_pag.attr("ipn"), _pag.attr("page"));
                    //初始化分页
                    pageNav.go({
                        id: $("#tableData_hq_lofjj .pagination"),
                        method: lofFjInit,
                        p: Number(_pag.attr("ipn")),
                        pn: Number(_pag.attr("page"))
                    });
                }

            }

        });
    }
    /*
        上市开放式基金（LOF） 初始化
        */
    var _$tableData_hq_lofKfs = $('#tableData_hq_lofKfs');
    if (_$tableData_hq_lofKfs.length > 0) {
        lofKfsInit(1, 10);
        $("#tableData_hq_lofKfs .mobile-page button").click(function() {
            offsetTops($("#tableData_hq_lofKfs"));
            if (!$(this).hasClass('next-page')) {
                //下一页
                var _nex = $("#tableData_hq_lofKfs .pagination li:first a");
                if (typeof(_nex.attr("ipn")) != "undefined") {
                    lofKfsInit(_nex.attr("ipn"), _nex.attr("page"));
                    //初始化分页
                    pageNav.go({
                        id: $("#tableData_hq_lofKfs .pagination"),
                        method: lofKfsInit,
                        p: Number(_nex.attr("ipn")),
                        pn: Number(_nex.attr("page"))
                    });
                }

            } else {
                //上一页
                var _pag = $("#tableData_hq_lofKfs .pagination li:last a");
                if (typeof(_pag.attr("ipn")) != "undefined") {
                    lofKfsInit(_pag.attr("ipn"), _pag.attr("page"));
                    //初始化分页
                    pageNav.go({
                        id: $("#tableData_hq_lofKfs .pagination"),
                        method: lofKfsInit,
                        p: Number(_pag.attr("ipn")),
                        pn: Number(_pag.attr("page"))
                    });
                }

            }

        });
    }


    /*
        行情列表
        */
    var _$tableData_marketTabList = $('#tableData_marketTabList');
    if (_$tableData_marketTabList.length > 0) {
        marketSearchInit();
    }

    /*
        公司债实时行情
        */
    var _$tableData_ajaxGetMarketTabs = $('#tableData_ajaxGetMarketTabs');
    if (_$tableData_ajaxGetMarketTabs.length > 0) {
        ajaxGetMarketTabsInit();
    }
});