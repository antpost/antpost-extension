function searchGoogle(domain, keyword, normal, callback, errorCallback) {
    var searchUrl = "";
    if (!normal) {
        searchUrl = domain + "/search?q=" + encodeURIComponent(keyword) + "&num=100&&ie=utf-8&oe=utf-8&pws=0&safe=off";
    } else {
        searchUrl = domain + "/search?q=" + encodeURIComponent(keyword);
    }
    var x = new XMLHttpRequest();
    x.open('GET', searchUrl);
    // The Google image search API responds with JSON, so let Chrome parse it.
    x.responseType = 'html';
    x.onload = function () {
        // Parse and process the response from Google Image Search.
        var response = x.response;
        callback(response);
    };
    x.onerror = function () {
        errorCallback('Network error.');
    };
    x.send();
}

function RequestLinkUrl(linkUrl, callback, errorCallback) {
	try{
    var x = new XMLHttpRequest();
    x.open('GET', linkUrl);
    x.responseType = 'html';
    x.onload = function () {
        var response = x.response;
        callback(response);
    };
    x.onerror = function () {
        errorCallback('Network error.');
    };
    x.send();
	}catch(ex){
		errorCallback('Network error.');
	}
}

document.addEventListener('SearchKeyword', function (evt) {
    searchGoogle(evt.detail.searchEngine, evt.detail.keyword, evt.detail.normal, function (data) {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent('CheckPositionSuccess', true, false, data);
        document.dispatchEvent(event);
    }, function (data) {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent('CheckPositionError', true, false, data);
        document.dispatchEvent(event);
    }, evt.detail.lang);
});

document.addEventListener('RequestLink', function (evt) {
    RequestLinkUrl(evt.detail, function (data) {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent('RequestLinkSuccess', true, false, data);
        document.dispatchEvent(event);
    }, function (data) {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent('RequestLinkError', true, false, data);
        document.dispatchEvent(event);
    });
});

document.addEventListener('RequestWindow', function (evt) {
    var pid = evt.detail.pid;
    var urlPost = window.location.protocol + '//spineditor.com/Code/Web/WebService.asmx/PostForum?pid=' + pid;
    RequestLinkUrl(urlPost, function (data) {
        var data = JSON.parse($(data).contents().text()).Content;
        data = JSON.parse(data);
        chrome.runtime.sendMessage({ type: "OpenForum", obj: data });
    }, function (data) {

    });
});


var winName = "";
var docHeight = 1000;
var timeView = 10000;
var timeViewTotal = 10000;
var spinView = "";
var idView = "";
winName = window.name;

$(window).load(function () {
    docHeight = $(document).height();
    if (!winName.startsWith("spineditor")) {
        winName = window.name;
    }

    setTimeout(function () {
        window.onbeforeunload = function () { };
        if (winName.startsWith("spineditorview_")) {
            InitView();
        } else if (winName.startsWith("spineditorpost_")) {
            ProcessPostForum();
        } else if (winName.startsWith("spineditorcommentlike|")) {
            ProcessCommentLike();
        }
    }, 3000);

})

function ProcessCommentLike() {
	var pid=winName.split('|')[1];
	var type = winName.split('|')[2];
	var action = winName.split('|')[3];
	var accountId = winName.split('|')[4];
    var u = winName.split('|')[5];
    var p = winName.split('|')[6];
    var comment = winName.split('|')[7];
	var linkPost = winName.split('|')[8];
	
    if (type == 'facebook') {
		if(action=='logout'){
			window.name="spineditorcommentlike|"+pid+"|"+type+"|likecomment|"+accountId+"|"+u+"|"+p+"|"+comment+"|"+linkPost;
			window.location=linkPost;
		}else{
			if ($("#login_form").size() > 0) {
				$(".menu_login_container #email").val(u);
				$(".menu_login_container #pass").val(p);
				window.name="spineditorcommentlike|"+pid+"|"+type+"|likecomment|"+accountId+"|"+u+"|"+p+"|"+comment+"|"+linkPost;
				$(".menu_login_container #loginbutton").click();
			} else {
				if($("#profile_pic_header_"+accountId).size()==0 && action=='checkaccount'){
					pageLoginAnchor.click();	
					setTimeout(function(){
						window.name="spineditorcommentlike|"+pid+"|"+type+"|logout|"+accountId+"|"+u+"|"+p+"|"+comment+"|"+linkPost;
						$("#show_me_how_logout_1").submit();					
					},5000);
				}else{
					if(action=='comment'){
						$("#composerInput").val(comment);
						$("input[name='comment_text']").val(comment);
						$("button[name='submit']").removeAttr("disabled")
						$("button[name='submit']").click();
						setTimeout(function () {
							window.close();
						}, 10000);
					}else{
						if ($(".UFILikeLink").size() > 0) {
							var btnLike=$($(".UFILikeLink").get(0));
							btnLike.attr("id","btnLikeFb");
							if (btnLike.attr("aria-pressed") == "false") {
								btnLikeFb.click();
								if (comment != '') {
									window.name="spineditorcommentlike|"+pid+"|"+type+"|comment|"+accountId+"|"+u+"|"+p+"|"+comment+"|"+linkPost;
									window.location.hostname = 'm.facebook.com';
								}else{
									setTimeout(function () {
										window.close();
									}, 10000);								
								}
							} else {
								setTimeout(function () {
									window.close();
								}, 10000);
							}
						} else {
							setTimeout(function () {
								window.close();
							}, 10000);
						}
						var urlPost = window.location.protocol + '//spineditor.com/Code/Web/WebService.asmx/CommentLikeSuccess?pid=' + pid;
						RequestLinkUrl(urlPost, function (data) {},function (data) {});
					}
				}
			}
		}
    }else if(type=='googleplus'){
	    if ($("#gb_70").size() > 0) {
            window.name="spineditorcommentlike|"+pid+"|"+type+"|login|"+accountId+"|"+u+"|"+p+"|"+comment+"|"+linkPost;
			window.location='https://accounts.google.com/ServiceLogin?sacu=1';
			setTimeout(function(){
					window.close();
			},10000);
        }else{
			console.log(action);
			if(action=='login'){
				$("#identifierId").val(u);
				$("#identifierNext").click();
				setTimeout(function(){
					$("input[name=password]").val(p);
					$("#passwordNext").click();
					window.name="spineditorcommentlike|"+pid+"|"+type+"|redirect|"+accountId+"|"+u+"|"+p+"|"+comment+"|"+linkPost;
				},3000);
				setTimeout(function(){
					window.close();
				},10000);
			} if(action=='logout'){
				window.name="spineditorcommentlike|"+pid+"|"+type+"|login|"+accountId+"|"+u+"|"+p+"|"+comment+"|"+linkPost;
				window.location='https://accounts.google.com/ServiceLogin?sacu=1';
				setTimeout(function(){
					window.close();
				},10000);
			}else {
				if($(".gb_wb").html().trim()!=accountId.toLowerCase() && $(".gb_xb").html().trim()!=accountId.toLowerCase()){
					window.name="spineditorcommentlike|"+pid+"|"+type+"|logout|"+accountId+"|"+u+"|"+p+"|"+comment+"|"+linkPost;
					window.location='https://accounts.google.com/Logout';
				}else{
					if (action=='redirect'){
						window.name="spineditorcommentlike|"+pid+"|"+type+"|like|"+accountId+"|"+u+"|"+p+"|"+comment+"|"+linkPost;
						window.location=linkPost;
						setTimeout(function(){
							window.close();
						},10000);
					}else{
						if($(".KRktze .mUbCce.fKz7Od[aria-label='+1']").attr("aria-pressed")=="false"){
							$(".KRktze .mUbCce.fKz7Od[aria-label='+1']").click();
							setTimeout(function(){
								$(".KRktze>.mUbCce.fKz7Od[jsname='A5O8Yc']").click();
								setTimeout(function(){
									$(".FEgP2b[jsname='Yefshd']").text(comment);
									FillText($("#XPxXbf"),comment,function(){
										$(".WKhogf[jsname='tJHJj']").click();
										$(".oK8yAd .O0WRkf.oG5Srb[jsname='zfjAFe']").removeAttr("aria-disabled");
										$(".oK8yAd .O0WRkf.oG5Srb[jsname='zfjAFe']").click();	
									});
								},1000);
							},1000)
							setTimeout(function(){
								window.close();
							},10000);
						}else{
							setTimeout(function(){
								window.close();
							},10000);
						}
						var urlPost = window.location.protocol + '//spineditor.com/Code/Web/WebService.asmx/CommentLikeSuccess?pid=' + pid;
						RequestLinkUrl(urlPost, function (data) {},function (data) {});
					}
				}
			}
		}
	}
}

function ProcessPostForum() {
    if ($(".welcomelink").size() > 0 || $(".accountPopup").size() > 0) {
        winName = winName.replace('unlogin', 'login');
    }
    var login = winName.split('_')[1];
    var pid = winName.split('_')[2];
    var urlPost = window.location.protocol + '//spineditor.com/Code/Web/WebService.asmx/PostForum?pid=' + pid;
    RequestLinkUrl(urlPost, function (data) {
        var data = JSON.parse($(data).contents().text()).Content;
        data = JSON.parse(data);
        var name = data.Name;
        var detail = data.Detail;
        var forumType = data.ForumType;
		var tags=data.Tags;
		if(tags=='undefined'||tags==undefined){
			tags='';
		}
        if ($("#XenForo").size() > 0) {
            forumType = "XENFORO";
        }
        else if ($("#vbulletin_html").size() > 0) {
            forumType = "VBB";
        } else {
            var dataCheck = $("head").html();
            if (dataCheck.indexOf("vBulletin") != -1) {
                forumType = "VBB_OLD";
            }
        }
        var id = data.Id;
        var url = data.LinkPost;
        var detailBBCode = data.DetailBBCode;
        var username = data.Username;
        var pass = data.Password;
        var intervalContent = null;
        if (forumType == 'VBB') {
            if (login == "post") {
                $("#subject").val(name);
				$("#tagpopup_ctrl").val(tags);
                var mode = $("#vB_Editor_001_mode").val();
                if (mode == 0) {
                    intervalContent = setInterval(function () {
                        if ($("#vB_Editor_001 .cke_source.cke_enable_context_menu").size() > 0) {
                            $("#vB_Editor_001 .cke_source.cke_enable_context_menu").val(detailBBCode);
                            clearInterval(intervalContent);
                        }
                    }, 1000);
                } else {
                    intervalContent = setInterval(function () {
                        if ($("#cke_contents_vB_Editor_001_editor iframe").size() > 0) {
                            $("body", $("#cke_contents_vB_Editor_001_editor iframe").contents()).html(detail);
                            clearInterval(intervalContent);
                        }
                    }, 1000);
                }
            } else if (login == 'unlogin') {
                $("#navbar_username").val(username);
                $("#navbar_password").val(pass);
                window.name = "spineditorpost_login1_" + id;
                $("#navbar_loginform").submit();
            } else if (login == "login" || login == "login1") {
                window.name = "spineditorpost_post_" + id;
                window.location = url;
            }
        } else if (forumType == 'XENFORO') {
            if (login == "post") {
                $("#ctrl_title_thread_create").val(name);
				$("#XenForoUniq0").val(tags);
				var script_contents='var eve = $.Event("keypress");eve.which = 13;$("#XenForoUniq0_tag").val(",");$("#XenForoUniq0_tag").trigger(eve);$(".tag a").click()'
				window.location = 'javascript:'+script_contents;
				
                intervalContent = setInterval(function () {
                    if ($(".redactor_MessageEditor").size() > 0) {
                        $("body", $(".redactor_MessageEditor").contents()).html(detail);
                        clearInterval(intervalContent);
                    } else if ($("#ctrl_message_html_ifr").size() > 0) {
                        $("body", $("#ctrl_message_html_ifr").contents()).html(detail);
                        clearInterval(intervalContent);
                    }
                }, 1000);
            } else if (login == 'unlogin') {
                window.name = "spineditorpost_login1_" + id;
                $("#LoginControl").val(username);
                $("#ctrl_password").val(pass);
                $("#ctrl_pageLogin_login").val(username);
                $("#ctrl_pageLogin_password").val(pass);
                $("form#pageLogin").submit();
                $("form#login").submit();
            } else if (login == "login" || login == "login1") {
                window.name = "spineditorpost_post_" + id;
                window.location = url;
            }
        } else if (forumType == 'VBB_OLD') {
            if (login == "post") {
                $("form .fieldset .bginput").val(name);
                $("#subject").val(name);
				$("#tagpopup_ctrl").val(tags);
                intervalContent = setInterval(function () {
                    if ($("#vB_Editor_001_mode").size() > 0) {
                        var mode = $("#vB_Editor_001_mode").val();
                        if (mode == 0) {
                            if ($("#vB_Editor_001 .cke_source.cke_enable_context_menu").size() > 0) {
                                $("#vB_Editor_001 .cke_source.cke_enable_context_menu").val(detailBBCode);
                                clearInterval(intervalContent);
                            }
                        } else {
                            if ($("#cke_contents_vB_Editor_001_editor iframe").size() > 0) {
                                $("body", $("#cke_contents_vB_Editor_001_editor iframe").contents()).html(detail);
                                clearInterval(intervalContent);
                            }
                        }
                    } else if ($("#vB_Editor_001_textarea").size() > 0) {
                        $("#vB_Editor_001_textarea").val(detailBBCode);
                        clearInterval(intervalContent);
                    }

                }, 1000);
            } else if (login == 'unlogin') {
                if ($("#navbar_username").size() > 0) {
                    $("#navbar_username").val(username);
                    $("#navbar_password").val(pass);
                    window.name = "spineditorpost_login1_" + id;
                    $("form[action='login.php?do=login']").submit();
                } else {
                    window.name = "spineditorpost_post_" + id;
                    window.location = url;
                }
            } else if (login == "login" || login == "login1") {
                window.name = "spineditorpost_post_" + id;
                window.location = url;
            }
        }
    }, function (data) {
    });
}

//===========================
document.addEventListener('OpenView', function (evt) {
    chrome.runtime.sendMessage({ type: "OpenView", obj: evt.detail });
    var event = document.createEvent('CustomEvent');
    event.initCustomEvent('OpenViewDone', true, false, evt.detail);
    document.dispatchEvent(event);
});

function InitView() {
    var temp = winName.substring(winName.indexOf("_") + 1);
    idView = parseInt(temp.substring(0, temp.indexOf("_")));
    temp = temp.substring(temp.indexOf("_") + 1);
    timeView = parseInt(temp.substring(0, temp.indexOf("_")));
    timeViewTotal = timeView;
    temp = temp.substring(temp.indexOf("_") + 1);
    spinView = temp;
    timeView -= 5000;
    setInterval(function () {
        timeView -= 1000;
        if (timeView <= 0) {
            window.onbeforeunload = function () { };
            window.close();
        }
    }, 1000);
    ProcessSpinView(GetCurrentView());
}

function ProcessSpinView(val) {
    if (val != "") {
        if (window.location.hostname.startsWith("www.google.")) {
            if (val.startsWith("http")) {
                var oLink = FindLinkHref(val, $("#search"));
                if (oLink != null) {
                    var pos = getRealPosition(oLink);
                    ScrollDown(pos.y, function () {
                        EndPage(true);
                        LinkRedirect(oLink, true);
                    });
                } else {
                    oLink = $("#pnnext");
                    if ($("#pnnext").size() > 0) {
                        var pos = getRealPosition(oLink);
                        ScrollDown(pos.y, function () {
                            EndPage(false);
                            LinkRedirect($("#pnnext"));
                            setTimeout(function () { InitView(); }, 5000);
                        }, 1000);
                    } else {
                        EndPage(true);
                        window.location = val;
                    }
                }
            } else {
                FillText($("#lst-ib"), val, function () {
                    EndPage(true);
                    $("#tsf").submit();
                })
            }
        } else if (window.location.hostname.startsWith("ipv4.google.com")) {
            var viewnext = val;
            if (viewnext.startsWith("http")) {
                EndPage(true);
                window.location = viewnext;
            }
        } else if (window.location.hostname.startsWith("coccoc.com")) {
            if (val.startsWith("http")) {
                var oLink = FindLinkHref(val, $("#search-results"));
                if (oLink != null) {
                    var pos = getRealPosition(oLink);
                    ScrollDown(pos.y, function () {
                        EndPage(true);
                        LinkRedirect(oLink);
                    });
                } else {
                    oLink = $(".next");
                    if (oLink.size() > 0) {
                        var pos = getRealPosition(oLink);
                        ScrollDown(pos.y, function () {
                            EndPage(false);
                            LinkRedirect(oLink);
                            setTimeout(function () { InitView(); }, 5000);
                        }, 1000);
                    } else {
                        EndPage(true);
                        window.location = val;
                    }
                }
            } else {
                FillText($("#query"), val, function () {
                    EndPage(true);
                    $("form[name='form-search']").submit();
                })
            }
        } else if (window.location.hostname.startsWith("www.youtube.com")) {
            if (val.startsWith("http")) {
                var oLink = FindLinkHref(val);
                if (oLink != null) {
                    var pos = getRealPosition(oLink);
                    ScrollDown(pos.y, function () {
                        EndPage(true);
                        LinkRedirect(oLink);
                    });
                } else {
                    oLink = $("a[data-link-type='next']");
                    if (oLink.size() > 0) {
                        var pos = getRealPosition(oLink);
                        ScrollDown(pos.y, function () {
                            EndPage(false);
                            LinkRedirect(oLink);
                            setTimeout(function () { InitView(); }, 5000);
                        }, 1000);
                    } else {
                        EndPage(true);
                        window.location = val;
                    }
                }
            } else {
                FillText($("#masthead-search-term"), val, function () {
                    EndPage(true);
                    $("#masthead-search").submit();
                })
            }
        } else {
            var oLink = null;
            if (val.startsWith("http")) {
                if (window.location.hostname.indexOf(".facebook.com") != -1) {
                    FindLinkFacebook();
                    setTimeout(function () { oLink = FindLinkHref(val); }, 1000);
                } else {
                    oLink = FindLinkHref(val);
                }
            } else {
                oLink = FindLinkText(val);
            }
            setTimeout(function () {
                if (oLink != null) {
                    var minTimePage = (Math.ceil(Math.random() * 30) * 1000) + 30000;
                    var pos = getRealPosition(oLink);
                    ScrollDown(pos.y, function () {
                        if ((timeViewTotal - timeView) < minTimePage) {
                            setTimeout(function () {
                                EndPage(true);
                                LinkRedirect(oLink);
                            }, minTimePage - (timeViewTotal - timeView));
                        } else {
                            EndPage(true);
                            LinkRedirect(oLink);
                        }
                    });
                }
            }, 2000);
        }
    } else {
        if (!window.location.hostname.startsWith("www.youtube.com")) {
            ScrollDown(docHeight, function () {
                EndPage(true);
                if (timeView > (timeViewTotal / 2)) {
                    setTimeout(function () {
                        LinkRedirect(GetRamdomLink());
                    }, (timeViewTotal / 2) - timeView);
                } else {
                    LinkRedirect(GetRamdomLink());
                }
            }, Math.ceil(Math.random() * 3000) + 2000);
        } else {
            try {
                var str = $(".ytp-bound-time-right").text();
                var arrTime = str.split(":");
                var h = 0;
                var m = 0;
                var s = 0;
                if (arrTime.length == 3) {
                    h = parseInt(arrTime[0]);
                    m = parseInt(arrTime[1]);
                    s = parseInt(arrTime[2]);
                } else if (arrTime.length == 2) {
                    m = parseInt(arrTime[0]);
                    s = parseInt(arrTime[1]);
                }
                var time = s;
                time += (m * 60);
                time += (h * 3600);
                time = time * 1000;
                setTimeout(function () {
                    LinkRedirect(GetRamdomLink());
                }, time);
            } catch (ex) {
                ScrollDown(docHeight, function () {
                    EndPage(true);
                    LinkRedirect(GetRamdomLink());
                }, Math.ceil(Math.random() * 3000) + 2000);
            }
        }
    }
}


function GetRamdomLink() {
    var listLink = $("a[href^='/']");
    var listLink2 = $("a[href^='" + window.location.origin + "']");
    listLink2.each(function (i, e) {
        listLink.push(e);
    });
    var r = Math.floor(Math.random() * listLink.length);
    LinkRedirect(listLink.get(r));
}

function LinkRedirect(o, isGoogle) {
    if (o != null) {
        $(o).attr("target", "_self");
        $(o).unbind("click");
        $(o).off("click");
        if (isGoogle) {
            var id = "linkGoogleClick";
            $(o).attr("id", id);
            var script = $(o).attr("onmousedown");
            script = script.replace("this", id);
            script = script.replace("return", "");
            location.href = "javascript:" + script;
        }
        window.open = function (url, target) { };
        $(o).click();
        setTimeout(function () {
            window.location.href = $(o).attr("href");
        }, 5000);
    }
}

function EndPage(flag) {
    if (flag) {
        window.name = "spineditorview_" + idView + "_" + timeView + "_" + GetSpinViewNext();
    } else {
        window.name = "spineditorview_" + idView + "_" + timeView + "_" + spinView;
    }
}

function GetCurrentView() {
    if (spinView.indexOf(";") == -1) {
        return spinView;
    } else {
        return spinView.substring(0, spinView.indexOf(";"));
    }
}

function GetSpinViewNext() {
    if (spinView.indexOf(";") == -1) {
        return "";
    } else {
        return spinView.substring(spinView.indexOf(";") + 1);
    }
}

function FindLinkFacebook() {
    var array = $("a[onmouseover]");
    var script = "";
    array.each(function (i, e) {
        var id = "tempspinview" + i;
        $(e).attr("id", id);
        var strOnmouseover = $(e).attr("onmouseover");
        if (script != "") {
            script += ";";
        }
        var temp = strOnmouseover;
        temp = temp.replace("this", id);
        script += temp;
    });
    window.location = "javascript:" + script;
}

function FindLinkHref(val, oParent) {
    var arr = [];
    var array = $("a");
    if (oParent) {
        array = $("a", oParent);
    }
    if (val.lastIndexOf("/") == (val.length - 1)) {
        val = val.substring(0, val.length - 1);
    }
    var orgin = window.location.origin;
    array.each(function (i, e) {
        var href = e.href + "";
        var dataHref = $(e).attr("data-href") + "";
        if (href.lastIndexOf("/") == (href.length - 1)) {
            href = href.substring(0, href.length - 1);
        }
        if (dataHref.lastIndexOf("/") == (dataHref.length - 1)) {
            dataHref = dataHref.substring(0, dataHref.length - 1);
        }
        var fullHref = orgin + href;
        if (href.startsWith(val)) {
            arr.push(e);
        } else if (dataHref.startsWith(val)) {
            arr.push(e);
        } else if (fullHref.startsWith(val)) {
            arr.push(e);
        }
    })
    if (arr.length == 0) {
        return null;
    }
    return arr[Math.floor(Math.random() * arr.length)];
}

function FindLinkText(val) {
    var arr = [];
    $('a').each(function (i, e) {
        var href = $(e).text();
        if (val == href) {
            arr.push(e);
        }
    })
    if (arr.length == 0) {
        return null;
    }
    return arr[Math.floor(Math.random() * arr.length)];
}

function FillText(o, val, callback) {
	o.val(val);
    $(o).click();
    $(o).focus();
    o.keydown();
    o.keyup();
    setTimeout(function () {
        callback();
    }, 3000);
}

function getRealPosition(el, parent) {
    el = $(el).get(0);
    pos = {
        x: 0,
        y: 0
    };
    while (el) {
        pos.x += el.offsetLeft;
        pos.y += el.offsetTop;
        el = el.offsetParent;
        if (parent) {
            if ($(el).is(parent)) {
                break;
            }
        }
    }
    return pos;
}

function ScrollDown(des, callback, timeScroll) {
    if (!timeScroll) {
        timeScroll = Math.ceil(Math.random() * 3000) + 1000;
    }
    if (des > 2500) {
        des = 2500;
    }
    timeOutScrollDown($(window).scrollTop(), des, callback, timeScroll);
}

function timeOutScrollDown(val, des, callback, timeScroll) {
    setTimeout(function () {
        $(window).scrollTop(val);
        val += 100;
        if ((val + 400) < des) {
            timeOutScrollDown(val, des, callback, timeScroll);
        } else {
            callback();
        }
    }, timeScroll);
}