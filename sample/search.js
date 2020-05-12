var hotWords = GhotWords || []
  , searchStrObj = {
    quanzhansearchStr: "全站检索",
    searchConditionTit: "标题",
    searchConditionCon: "正文",
    searchConditionAll: "标题+正文",
    searchResultStr: "搜索结果",
    searchAllResultStr: "全部搜索结果",
    searchplaceholderStr: "请输入关键字",
    searchBtnStr: "搜索",
    noSearchDataStr: "无匹配的搜索结果！",
    pageCurStr: "当前第",
    pageCurNumStr: "页",
    pageAllStr: "共",
    containerStr: "包含",
    channelnameStr: "的网站栏目名称推荐",
    articleResultStr: "的文章搜索结果",
    sortByDateStr: "时间排序",
    sortByRelativeStr: "相关度排序",
    showResultStr: "显示结果",
    showDateAllStr: "全部时间",
    showDateMonth1Str: "最近一个月",
    showDateMonth3Str: "最近三个月",
    showDateMonth6Str: "最近半年",
    showDateYear1Str: "最近一年",
    hanqingRealTimeStr: "分时",
    hanqingDailyStr: "日线",
    hanqingWeeklyStr: "周线",
    hanqingMonthlyStr: "月线",
    hqKuohaoLeftStr: "(",
    hqKuohaoRightStr: ")",
    hqVolumeStr: "成交量",
    hqVolumeUnitStr: "手",
    hqVolumeUnit2Str: "张",
    hqAmountStr: "成交额",
    hqChangeStr: "涨跌",
    hqChangePercentStr: "涨幅",
    hqOpenStr: "今开",
    hqCloseStr: "昨收",
    hqHighStr: "最高",
    hqLowStr: "最低",
    hqpriceUnitStr: "价",
    stockproductSearchStr: "证券产品推荐结果"
};
window.util.isEnglish() && (searchStrObj = {
    quanzhansearchStr: "SEARCH",
    searchConditionTit: "Title",
    searchConditionCon: "Content",
    searchConditionAll: "Title+Content",
    searchResultStr: "Result",
    searchAllResultStr: "All Result",
    searchplaceholderStr: "Keyword",
    searchBtnStr: "GO",
    noSearchDataStr: "No data to find！",
    pageCurStr: "Current: Page",
    pageCurNumStr: "",
    pageAllStr: "Total:",
    containerStr: "",
    channelnameStr: "Links",
    articleResultStr: "Articles",
    sortByDateStr: "Sort By Date",
    sortByRelativeStr: "Sort By Relative",
    showResultStr: "",
    showDateAllStr: "ALL",
    showDateMonth1Str: "1 Month",
    showDateMonth3Str: "3 Months",
    showDateMonth6Str: "Half A Year",
    showDateYear1Str: "1 Year",
    hanqingRealTimeStr: "Real-time",
    hanqingDailyStr: "Daily",
    hanqingWeeklyStr: "Weekly",
    hanqingMonthlyStr: "Monthly",
    hqKuohaoLeftStr: "(",
    hqKuohaoRightStr: ")",
    hqVolumeStr: "Volume",
    hqVolumeUnitStr: "",
    hqAmountStr: "Amount",
    hqVolumeUnit2Str: "",
    hqChangeStr: "Change",
    hqChangePercentStr: "Change(%)",
    hqOpenStr: "Open",
    hqCloseStr: "Close",
    hqHighStr: "High",
    hqLowStr: "Low",
    hqpriceUnitStr: "",
    stockproductSearchStr: "Securities"
}),
$(document).ready(function() {
    var e = window.location.href
      , r = $(".search-container")
      , o = {
        templateUrl: "/modules/search/templates/searchTmp.htm",
        statsCountUrl: pathObj.search_path + "/terms/addSearchTerms",
        channleUrl: pathObj.search_path + "/channel",
        secInfoListUrl: pathObj.search_path + "/secInfoList",
        secCheckUrl: pathObj.search_path + "/secCheck",
        doccountUrl: pathObj.search_path + "/doccount",
        contentUrl: pathObj.search_path + "/content",
        suggestUrl: pathObj.search_path + "/suggest",
        minuteUrl: pathObj.market_path + "/ssjjhq/getTimeData",
        kUrl: pathObj.market_path + "/ssjjhq/getHistoryData",
        params: {
            time: "1",
            orderby: "score",
            treeId: "1"
        },
        charts: {},
        chartDataState: {},
        codeReg: /^399?/,
        hotWords: {
            hotWords: hotWords
        },
        placeholder: searchStrObj.searchplaceholderStr,
        regType: /html|link|doc|docx|pdf|txt/i,
        isLefu: -1 < e.indexOf(pathObj.lefu_domain_path),
        isInvestor: -1 < e.indexOf(pathObj.investor_domain_path),
        isBond: -1 < e.indexOf(pathObj.bond_domain_path),
        isSzhk: "szhk" === OTHERSETE,
        isOption: "option" === OTHERSETE,
        isRehearsal: "rehearsal" === OTHERSETE,
        isYdyl: "ydyl" === OTHERSETE,
        isEipo: -1 < e.indexOf(pathObj.eipo_domain_path),
        isSzsePLE: "szsePLE" === OTHERSETE,
        isEnglish: window.util.isEnglish(),
        isEnydyl: "enydyl" === OTHERSETE,
        isEnszhk: "enSzhk" === OTHERSETE,
        isFintech: -1 < e.indexOf(pathObj.fin_domain_path),
        isSecBond: "",
        isFirstEnter: !0
    };
    o.isChildSite = o.isLefu || o.isInvestor || o.isBond || o.isSzhk || o.isOption || o.isRehearsal || o.isYdyl || o.isEipo || o.isSzsePLE || o.isEnglish || o.isEnydyl || o.isEnszhk || o.isFintech;
    var i, t = window.util.getQueryString("keyword");
    t = t.replace(/\%26/g, "&");
    try {
        i = JSON.parse(window.util.getQueryString("channelCode"))
    } catch (e) {}
    var a = window.util.getQueryString("range");
    function c() {
        o.keyword && (o.loadding = window.Loading($(".search-result")),
        o.params.time = "1",
        o.params.orderby = "score",
        o.params.treeId = "1",
        o.isRuleSearch ? n() : o.isInvestor ? function() {
            var e = u("channle")
              , t = u("doccount");
            $.when(O({
                url: o.channleUrl,
                type: "POST",
                data: e
            }), O({
                url: o.doccountUrl,
                type: "POST",
                data: t
            })).done(function(e, t) {
                p({
                    channel: e,
                    articleTree: t
                }),
                m("result"),
                m("articleTree"),
                g("article"),
                v(o.params.orderby),
                S("article"),
                f("article"),
                T()
            })
        }() : function() {
            var e = u("channle")
              , t = u("doccount")
              , a = u("secCheck");
            $.when(O({
                url: o.channleUrl,
                type: "POST",
                data: e
            }), O({
                url: o.secCheckUrl,
                type: "POST",
                data: a
            }), O({
                url: o.doccountUrl,
                type: "POST",
                data: t
            })).done(function(e, t, a) {
                var n = {
                    channel: e,
                    articleTree: a
                };
                t.sec && (o.code = t.secCode,
                o.codeName = t.secName,
                t.url = pathObj.main_domain_path_http + "/certificate/individual/index.html?code=" + encodeURI(o.code),
                n.secCheckData = t),
                p(n),
                m("result"),
                m("articleTree"),
                t.sec && (o.chartDataState.index = 0,
                o.chartDataState.minute = !1,
                o.chartDataState.day = !1,
                o.chartDataState.week = !1,
                o.chartDataState.month = !1,
                h(),
                $(".secCheck-content .pic-tabs").delegate(">li", "click", function(e) {
                    var t = $(this).index();
                    o.chartDataState.index = t,
                    h(),
                    $(this).addClass("active").siblings("li").removeClass("active"),
                    $(".tab-panel", ".secCheck-content").removeClass("active").eq(t).addClass("active")
                }),
                function() {
                    var e = u("secInfoList");
                    $.when(O({
                        url: o.secInfoListUrl,
                        type: "POST",
                        data: e
                    })).done(function(e) {
                        o.secInfoList = e,
                        m("secInfoList"),
                        o.isChildSite || $(".secCheck-content .list-more").attr("href", pathObj.main_domain_path_http + "/disclosure/listed/notice/index.html?name=" + o.codeName + "&stock=" + o.code + "&r=" + Date.now()).show(),
                        g("secInfoList"),
                        f("secInfoList")
                    })
                }()),
                g("article"),
                v(o.params.orderby),
                S("article"),
                f("article"),
                T()
            })
        }())
    }
    function n(t) {
        var e = u("doccount");
        $.when(O({
            url: o.doccountUrl,
            type: "POST",
            data: e
        })).done(function(e) {
            p({
                channel: [],
                articleTree: e
            }),
            "timeRange" !== t && m("result"),
            m("articleTree"),
            g("article"),
            v(o.params.orderby),
            S("article"),
            f("article"),
            "timeRange" !== t && T()
        })
    }
    function l() {
        $.when(ajaxRequest({
            url: o.minuteUrl,
            type: "GET",
            data: u("minute"),
            loadingPlugin: window.Loading($(".market"))
        })).done(function(e) {
            e && "0" === e.code && (o.chartDataState.minute = !0),
            o.isSecBond = e.type && "bond" === e.type,
            $("#secChenkName").text(e.data.name),
            function(e) {
                var t = _.template(o.template.trendDetailTemplate);
                e.searchStrObj = searchStrObj,
                e.isIndex = o.codeReg.test(e.code),
                e.newIsDown = /^\-/.test(e.deltaPercent),
                e.openIsDown = +e.open < +e.close,
                e.highIsDown = +e.high < +e.close,
                e.lowIsDown = +e.low < +e.close,
                e.isSecBond = o.isSecBond,
                e.isEnglish = o.isEnglish,
                o.isEnglish ? function(e) {
                    1 <= e.volume / 1e8 ? (e.volume = (e.volume / 1e8).toFixed(2),
                    e.volumeUnit = "10Bil.") : 1 <= e.volume / 1e4 ? (e.volume = (e.volume / 1e4).toFixed(2),
                    e.volumeUnit = "Mil.") : e.volumeUnit = "100";
                    1 <= e.amount / 1e8 ? (e.amount = (e.amount / 1e8).toFixed(2),
                    e.amountUnit = "100Mil.") : 1 <= e.amount / 1e4 ? (e.amount = (e.amount / 1e4).toFixed(2),
                    e.amountUnit = "10,000") : e.amountUnit = "Yuan"
                }(e) : function(e) {
                    1 <= e.volume / 1e8 ? (e.volume = (e.volume / 1e8).toFixed(2),
                    e.volumeUnit = o.isSecBond ? "亿张" : "亿手") : 1 <= e.volume / 1e4 ? (e.volume = (e.volume / 1e4).toFixed(2),
                    e.volumeUnit = o.isSecBond ? "万张" : "万手") : e.volumeUnit = "";
                    1 <= e.amount / 1e8 ? (e.amount = (e.amount / 1e8).toFixed(2),
                    e.amountUnit = "亿元") : 1 <= e.amount / 1e4 ? (e.amount = (e.amount / 1e4).toFixed(2),
                    e.amountUnit = "万元") : e.amountUnit = ""
                }(e);
                var a = t(e);
                $(".trend-detail-wrap").empty().append(a)
            }(e.data),
            function(e) {
                var t = '<span class="trend-time">' + (e = e || "") + "</span>";
                $(".secCheck-content .market", r).append($(t))
            }(e.datetime),
            o.isChildSite || function(e) {
                var t = '<a class="trend-more" href="' + pathObj.main_domain_path_http + "/market/trend/index.html?code=" + e + '" target="_blank" >更多</a>';
                $(".secCheck-content .market", r).append($(t))
            }(e.data.code);
            var t = {
                data: e,
                grid: {
                    index: [["4%", 20, "48%", 65]],
                    sec: [["4%", 60, "48%", 60], ["66%", 60, "4%", 60]]
                }
            };
            new s.ui.controls.mLineChart("#minutely",t)
        })
    }
    function h() {
        o.chartDataState.index || o.chartDataState.minute || l(),
        1 !== o.chartDataState.index || o.chartDataState.day || $.when(ajaxRequest({
            url: o.kUrl,
            type: "GET",
            data: u("day"),
            loadingPlugin: window.Loading($("#daily"))
        })).done(function(e) {
            e && "0" === e.code && (o.chartDataState.day = !0);
            var t = {
                data: e,
                grid: [["4%", 85, "48%", 32], ["65%", 85, "16%", 32]]
            };
            new s.ui.controls.kLineChart("#daily",t)
        }),
        2 !== o.chartDataState.index || o.chartDataState.week || $.when(ajaxRequest({
            url: o.kUrl,
            type: "GET",
            data: u("week"),
            loadingPlugin: window.Loading($("#weekly"))
        })).done(function(e) {
            e && "0" === e.code && (o.chartDataState.week = !0);
            var t = {
                data: e,
                grid: [["4%", 85, "48%", 32], ["65%", 85, "16%", 32]]
            };
            new s.ui.controls.kLineChart($("#weekly"),t)
        }),
        3 !== o.chartDataState.index || o.chartDataState.month || $.when(ajaxRequest({
            url: o.kUrl,
            type: "GET",
            data: u("month"),
            loadingPlugin: window.Loading($("#monthly"))
        })).done(function(e) {
            e && "0" === e.code && (o.chartDataState.month = !0);
            var t = {
                data: e,
                grid: [["4%", 85, "48%", 32], ["65%", 85, "16%", 32]]
            };
            new s.ui.controls.kLineChart($("#monthly"),t)
        })
    }
    function d() {
        o.loadding = window.Loading($(".right-content"));
        var e = u("article");
        $.when(O({
            url: o.contentUrl,
            type: "POST",
            data: e
        })).done(function(e) {
            p(e, "article"),
            m("article"),
            g("page"),
            S("page"),
            f("page")
        })
    }
    function u(e) {
        var t;
        switch (e) {
        case "channle":
            t = {
                keyword: o.keyword,
                channelCode: o.params.rawChannelCode || []
            };
            break;
        case "secCheck":
            t = {
                keyword: o.keyword
            };
            break;
        case "secInfoList":
            t = {
                secCode: o.code,
                currentPage: 1,
                pageSize: 5
            };
            break;
        case "doccount":
            t = {
                keyword: o.keyword,
                range: o.params.range,
                time: o.params.time || 1,
                channelCode: o.params.rawChannelCode || []
            };
            break;
        case "article":
            t = {
                keyword: o.keyword,
                range: o.params.range,
                time: o.params.time || 1,
                orderby: o.params.orderby || "score",
                currentPage: o.params.currentPage || 1,
                pageSize: 20,
                channelCode: o.params.channelCode
            };
            break;
        case "minute":
            t = {
                marketId: 1,
                code: o.code
            };
            break;
        case "day":
            t = {
                cycleType: 32,
                marketId: 1,
                code: o.code
            };
            break;
        case "week":
            t = {
                cycleType: 33,
                marketId: 1,
                code: o.code
            };
            break;
        case "month":
            t = {
                cycleType: 34,
                marketId: 1,
                code: o.code
            }
        }
        return /channle|secCheck|doccount|article/.test(e) && (o.isLefu ? t.host = "fund" : o.isInvestor ? t.host = "investor" : o.isBond ? t.host = "bond" : o.isEipo ? t.host = "eipo" : o.isFintech && (t.host = "fintech")),
        o.isEnglish && (t.language = "EN"),
        t
    }
    function p(e, t) {
        if ("article" === t)
            e.formateDate = E,
            e.data = function(e) {
                var t = /<!--/g;
                return e.map(function(e) {
                    e.doctitle = e.doctitle ? e.doctitle.replace(/^\s+/, "").replace(t, "") : null,
                    e.doccontent = e.doccontent ? e.doccontent.replace(/^\s+/, "").replace(t, "") : null,
                    e.doctype = e.doctype.toLowerCase(),
                    o.regType.test(e.doctype) ? e.doctypeself = e.doctype : e.doctypeself = "other"
                }),
                e
            }(e.data),
            o.data.articles = e;
        else {
            var a = 0;
            e.articleTree.forEach(function(e, t) {
                a += +e.tags[0]
            }),
            o.isChildSite && (e.articleTree = $.isEmptyObject(e.articleTree) ? [] : e.articleTree[0].nodes);
            var n = {
                id: "1",
                text: searchStrObj.searchAllResultStr,
                tags: [a],
                nodes: e.articleTree
            }
              , r = 0 < e.channel.length || e.secCheckData && e.secCheckData.sec
              , i = r || 0 !== a;
            e.secCheckData && e.secCheckData.sec && o.isChildSite && (e.secCheckData.url = "javascript: void(0)"),
            o.data = {
                result: {
                    channel: e.channel,
                    secCheckData: e.secCheckData,
                    upperResult: r,
                    keyword: o.keyword,
                    totalSize: a,
                    flag: i
                },
                articleCategory: [n]
            }
        }
    }
    function m(e) {
        switch (e) {
        case "search":
            !function() {
                var e = _.template(o.template.searchTemplate);
                o.searchStrObj = searchStrObj;
                var t = e(o.hotWords);
                r.append(t)
            }();
            break;
        case "secInfoList":
            !function() {
                o.secInfoList.data.forEach(function(e) {
                    e.doctype = e.doctype.toLowerCase(),
                    o.regType.test(e.doctype) ? e.doctypeself = e.doctype : e.doctypeself = "other"
                });
                var e = _.template(o.template.secInfoListTemplate)(o.secInfoList);
                $(".secCheck-content > .infolist", r).empty().append(e)
            }();
            break;
        case "result":
            !function() {
                var e = _.template(o.template.upperResultTemplate);
                o.searchStrObj = searchStrObj;
                var t = e(o.data.result)
                  , a = $("<div>").append(t);
                o.isChildSite && (a.find(".secCheck-title a").removeAttr("href").removeAttr("target"),
                a.find(".secCheck-title .icon").remove());
                $(".search-result", r).empty().append(a.html())
            }();
            break;
        case "articleTree":
            !function() {
                var e = _.template(o.template.articleTreeTemplate)();
                $(".article-content", r).empty().append(e)
            }();
            break;
        case "article":
            !function() {
                var e = _.template(o.template.articleTemplate);
                o.searchStrObj = searchStrObj;
                var t = e(o.data.articles);
                $(".article-content .article-search-result", r).empty().append(t)
            }()
        }
    }
    function S(e) {
        switch (e) {
        case "search":
            !function() {
                var e = [{
                    text: searchStrObj.searchConditionTit,
                    value: "title"
                }, {
                    text: searchStrObj.searchConditionCon,
                    value: "body"
                }, {
                    text: searchStrObj.searchConditionAll,
                    value: "content"
                }];
                window.util.isEnglish() && (e = [{
                    text: searchStrObj.searchConditionAll,
                    value: "content"
                }]);
                var t = {
                    data: e,
                    onSelected: function(e, t) {
                        o.params.range = t.value
                    }
                }
                  , a = new s.ui.controls.Selectex(o.elements.searchSelect,t);
                o.keyword && !o.params.range ? (a.getApi().setValue("title"),
                o.params.range = "title") : o.keyword ? o.keyword && o.params.range && a.getApi().setValue(o.params.range) : (a.getApi().setValue("title"),
                o.params.range = "title");
                window.util.isEnglish() && (a.getApi().setValue("content"),
                o.params.range = "content");
                var n = {
                    items: 10,
                    parentWrap: ".search-wrap",
                    isParentWidth: !0,
                    isHighlight: !1,
                    map: '{"text": "name", "value": "value"}',
                    highlighterCustom: '<span class="red"></span>',
                    onSelected: function(e, t, a) {
                        rebuildRepairedPlaceholder(o.elements.searchInput, o.placeholder),
                        _.isEmpty(a) && (a = {
                            name: t,
                            value: t
                        }),
                        o.keyword = a.value.toString().replace(/<[^>]+>/g, ""),
                        c(),
                        j(a)
                    },
                    onChanged: function(e, t) {
                        var a = o.elements.clearKeword;
                        a.addClass("show"),
                        $.trim(t) || a.removeClass("show")
                    },
                    source: function(e, r) {
                        if (!window.util.isEnglish())
                            if (10 !== document.documentMode && 11 !== document.documentMode || !o.isFirstEnter) {
                                var t = window.localStorage.getItem("search")
                                  , a = t && t.replace(/<[^>]+>/g, "");
                                if (e)
                                    $.when(O({
                                        url: o.suggestUrl,
                                        type: "POST",
                                        data: {
                                            keyword: e,
                                            size: 10,
                                            host: (o.isLefu ? "fund" : o.isInvestor && "investor") || o.isBond && "bond" || o.isEipo && "eipo" || o.isFintech && "fintech" || void 0
                                        },
                                        noLoading: !0
                                    })).done(function(e) {
                                        for (var t = [], a = 0; a < e.length; a++) {
                                            var n = {};
                                            n = "TERM" === e[a].type ? {
                                                name: e[a].wordA,
                                                value: e[a].value,
                                                type: e[a].type
                                            } : {
                                                name: "[ " + e[a].wordB + " ] " + e[a].wordA,
                                                value: e[a].value,
                                                type: e[a].type
                                            },
                                            t.push(n)
                                        }
                                        r(t)
                                    });
                                else {
                                    if (!a)
                                        return;
                                    a = JSON.parse(a),
                                    r(a)
                                }
                            } else
                                o.isFirstEnter = !1
                    }
                };
                window.util.isEnglish() ? $(".search-input-wrap").on("keydown", function(e) {
                    13 == e.keyCode && w()
                }) : new s.ui.controls.searchHint(o.elements.searchInput,n);
                $(".search-input", r).val(o.keyword),
                iePlaceholderSuppose()
            }();
            break;
        case "article":
            !function() {
                var e = {
                    levels: "3",
                    showCheckbox: "none",
                    selectMode: "all",
                    multiSelect: !1,
                    data: o.data.articleCategory,
                    renderNode: function(e) {
                        e.text;
                        return '<span title="' + (e.text + "(" + e.tags[0] + ")") + '"><span class="text ellipsis">' + e.text + "</span><span>（" + e.tags[0] + "）</span></span>"
                    },
                    onNodeSelected: function(e, t) {
                        o.params.treeId = t.id,
                        o.isRuleSearch ? o.params.channelCode = function(e) {
                            var a = [];
                            return function t(e) {
                                a.push(e.id),
                                _.isEmpty(e.nodes) || _.forEach(e.nodes, function(e) {
                                    t(e)
                                })
                            }(e),
                            a
                        }(t) : "1" === t.id ? o.params.channelCode = o.isChildSite && o.params.rawChannelCode || [] : o.params.channelCode = t.id,
                        function(e) {
                            var t = $("<h4>" + searchStrObj.showResultStr + '<span class="keyword">' + e.text + '<span class="size">（' + e.tags[0] + "）</span></span></h4>");
                            $(".right-content-title", ".article-content").empty().append(t)
                        }(t),
                        d()
                    }
                };
                new s.ui.controls.Tree(o.elements.cTree,e).getApi().selectNodeByIds(o.params.treeId)
            }(),
            function() {
                var e = {
                    onSelected: function(e, t) {
                        o.params.time = t.value,
                        n("timeRange")
                    },
                    data: [{
                        text: searchStrObj.showDateAllStr,
                        value: "1"
                    }, {
                        text: searchStrObj.showDateMonth1Str,
                        value: "2"
                    }, {
                        text: searchStrObj.showDateMonth3Str,
                        value: "3"
                    }, {
                        text: searchStrObj.showDateMonth6Str,
                        value: "4"
                    }, {
                        text: searchStrObj.showDateYear1Str,
                        value: "5"
                    }]
                };
                new s.ui.controls.Selectex(o.elements.articleTime,e).getApi().setValue(o.params.time)
            }();
            break;
        case "page":
            !function() {
                var e = {
                    totalSize: o.data.articles.totalSize,
                    pageSize: o.data.articles.pageSize,
                    pageIndex: o.data.articles.currentPage - 1,
                    pageType: "intricacy",
                    onPageIndexChange: function(e, t) {
                        o.params.currentPage = t + 1,
                        d()
                    }
                };
                new s.ui.controls.Paginator(o.elements.searchPaginator,e);
                o.params.currentPage = 1
            }()
        }
    }
    function g(e) {
        o.elements = {
            clearKeword: $(".clear-keyword", r),
            searchBtn: $(".search-btn", r),
            searchInput: $(".search-input", r),
            searchSelect: $(".search-select", r),
            hotWords: $(".hotwords", r)
        },
        "secInfoList" === e && (o.elements.annonTitle = $(".infolist .text", r)),
        "article" === e && (o.elements.articleTabTime = $(".article-tab .tab-time", r),
        o.elements.articleTabScore = $(".article-tab .tab-score", r),
        o.elements.articleTime = $(".search-article .select-time", r),
        o.elements.articleTab = $(".article-tab", r),
        o.elements.cTree = $(".c-tree-demo", r)),
        "page" === e && (o.elements.searchPaginator = $(".search-article .search-paginator", r),
        o.elements.docTitle = $(".search-article .article-item .text", r))
    }
    function f(e) {
        "article" === e ? o.elements.articleTab.delegate("span", "click", y) : "secInfoList" === e ? o.elements.annonTitle.on("click", x) : "page" === e ? o.elements.docTitle.on("click", x) : (o.elements.searchBtn.on("click", w),
        o.elements.clearKeword.on("click", k),
        o.elements.searchInput.on("blur", C),
        o.elements.hotWords.on("click", "a", b))
    }
    function w() {
        var e = $.trim(o.elements.searchInput.val().replace(/<[^>]+>/g, ""));
        e && (o.keyword = e,
        c(),
        j({
            name: o.keyword,
            value: o.keyword
        }))
    }
    function y(e) {
        var t = $(e.currentTarget).index()
          , a = $(e.delegateTarget.children);
        o.params.orderby = "time",
        1 === t && (o.params.orderby = "score"),
        d(),
        $(a.eq(t)).addClass("tab-active").siblings().removeClass("tab-active")
    }
    function v(e) {
        o.elements.articleTab.find("span").removeClass("tab-active"),
        "time" === e ? o.elements.articleTabTime.addClass("tab-active") : o.elements.articleTabScore.addClass("tab-active")
    }
    function k() {
        o.elements.searchInput.val("").focus(),
        o.elements.clearKeword.removeClass("show")
    }
    function C() {
        e && clearTimeout(e);
        var e = setTimeout(function() {
            o.elements.clearKeword.removeClass("show")
        }, 300)
    }
    function b(e) {
        o.keyword = $(e.currentTarget).data("hotword"),
        $(".search-input", r).val(o.keyword),
        rebuildRepairedPlaceholder(o.elements.searchInput, o.placeholder),
        c(),
        j({
            name: o.keyword,
            value: o.keyword
        })
    }
    function T() {
        var e = {
            term: o.keyword
        };
        ajaxRequest({
            url: o.statsCountUrl,
            type: "POST",
            data: JSON.stringify(e),
            dataType: "text",
            contentType: "application/json",
            loadingPlugin: null
        })
    }
    function O(e) {
        var t = {
            url: e.url,
            type: e.type || "GET",
            data: e.data || {},
            dataType: e.dataType || "json",
            contentType: "application/x-www-form-urlencoded",
            loadingPlugin: o.loadding
        };
        return e.noLoading && (t.loadingPlugin = null),
        window.ajaxRequest(t)
    }
    function x(e) {
        e = e || event;
        var t = $(e.currentTarget)
          , a = t.data("annon")
          , n = t.data("pdfid")
          , r = t.data("attachformat")
          , i = t.data("urlpath");
        if (r = r && r.toLowerCase(),
        "disclosure" === a) {
            if ("html" != r && "pdf" != r)
                /txt|bmp|gif|jpeg|jpg|png|xml/i.test(r) ? (i = i.replace(/\/download?/, ""),
                t.attr("href", i)) : t.attr("target", "_self");
            else if ("pdf" === r || "html" === r) {
                i = "";
                i = o.isBond ? pathObj.bond_domain_path_http + "/disclosure/bizanno/pubinfoanno/notice/index.html?" + n : o.isLefu ? pathObj.lefu_domain_path_http + "/disclosure/notice/index.html?" + n : pathObj.main_domain_path_http + "/disclosure/listed/bulletinDetail/index.html?" + n,
                t.attr("href", i)
            }
        } else
            /html|pdf|txt|bmp|gif|jpeg|jpg|png|xml|link/i.test(r) ? (i = i.replace(/\/download?/, ""),
            t.attr("href", i)) : t.attr("target", "_self")
    }
    function j(n) {
        if (!(Object.keys(n).length < 0 || "" === n.value || null == n.value)) {
            var e = window.localStorage
              , t = e.getItem("search")
              , a = [];
            if (n.name = n.name.toString().replace(/<[^>]+>/g, ""),
            n.value = n.value.toString().replace(/<[^>]+>/g, ""),
            t) {
                var r = (a = JSON.parse(t)).length;
                a.forEach(function(e, t, a) {
                    e.value == n.value && a.splice(t, 1)
                }),
                10 <= (r = a.length) && a.splice(r - 1, 1)
            }
            a.unshift({
                name: n.name,
                value: n.value,
                type: n.type
            }),
            e.setItem("search", JSON.stringify(a))
        }
    }
    function E(e) {
        var t = new Date(e)
          , a = t.getFullYear()
          , n = t.getMonth() + 1
          , r = t.getDate();
        return a + "-" + (n < 10 ? "0" + n : n) + "-" + (r < 10 ? "0" + r : r)
    }
    i && "[object Array]" === Object.prototype.toString.call(i) && !$.isEmptyObject(i) && (o.isRuleSearch = !0,
    o.params.range = a,
    i.forEach(function(e, t, a) {
        var n = childChannles[e];
        n && (i = i.concat(n))
    }),
    o.params.rawChannelCode = i),
    o.isChildSite && (o.params.rawChannelCode = RawChannelCode),
    t && (o.keyword = t),
    o.loadding = window.Loading($(".search-container")),
    $.when(O({
        url: o.templateUrl,
        dataType: "html"
    })).done(function(e) {
        o.template = {
            searchTemplate: $(e).filter('script[id="search-input-template"]').html(),
            trendDetailTemplate: $(e).filter('script[id="trend-detail-template"]').html(),
            secInfoListTemplate: $(e).filter('script[id="secInfoList-template"]').html(),
            upperResultTemplate: $(e).filter('script[id="search-result-template"]').html(),
            articleTreeTemplate: $(e).filter('script[id="article-tree-template"]').html(),
            articleTemplate: $(e).filter('script[id="article-result-template"]').html()
        },
        m("search"),
        g(),
        S("search"),
        f(),
        c()
    })
});
