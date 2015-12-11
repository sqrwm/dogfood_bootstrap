(function() {
    var browser = getBrowserInfo();
    var df_domain = "YOUR_DOUMAIN"

    page('/', loadHomePage);
    page('/i/:bundleID', loadIOSDetailHtml);
    page('/a/:packageName', loadAndroidDetailHtml);
    page();

    function loadHomePage() {
        $(window).unbind('scroll');
        //var browser = getBrowserInfo();
        if(browser.versions.android) {
            $("#div-wrapper").load( "/app/android_home.html" , function() {
                loadLatestApks();
                bindScrollToNavhome();
            });
        } else if(browser.versions.ios) {
            $("#div-wrapper").load( "/app/ios_home.html" , function() {
                loadLatestIpas();
                bindScrollToNavhome();
            });
        } else {
            $("#div-wrapper").load( "/app/pc_home.html" , function() {
                loadLatestApks();
                loadLatestIpas();
                bindScrollToPCNavhome();
            });
        }
    }

     
    function loadLatestApks() {
        var latestApks = "http://" + df_domain + "/a/api/v1/all/latest";
        $.getJSON( latestApks )
        .done(function( json ) {
            $("#a-apps-list").empty(); 
            $.each( json, function( i, app ) {
                $("#a-apps-list").append(
                    '<li class="item" onclick=javascript:location.href="' + '/a/'+ app.package_name + '">'
                    + '<div class="d-product-img">' 
                    + '<img src="' + app.icon_path + '" alt="Product Image"></img>'
                    + '</div>'
                    + '<a href="' + '/a/'+ app.package_name + '" class="btn pull-right btn-info btn-custom vcenter" >详情</a>'
                    + '<div class="d-product-info">'
                    + '<span class="d-product-title">' + app.label + '</span>'
                    + '<span class="d-product-description">' + app.version + '</span>'
                    + '</div>'
                    + '</li>'
                    );
            });
        });
    }


    function loadLatestIpas() {
        var latestApks = "http://" + df_domain + "/i/api/v1/all/latest";
        $.getJSON( latestApks )
        .done(function( json ) {
            $("#i-apps-list").empty(); 
            $.each( json, function( i, app ) {
                $("#i-apps-list").append(
                    '<li class="item" onclick=javascript:location.href="' + '/i/'+ app.bundleID + '">'
                    + '<div class="d-product-img">' 
                    + '<img src="' + app.icon_path + '" alt="Product Image"></img>'
                    + '</div>'
                    + '<a href="' + '/i/'+ app.bundleID + '" class="btn pull-right btn-info btn-custom vcenter">详情</a>'
                    + '<div class="d-product-info">'
                    + '<span class="d-product-title">' + app.appName + '</span>'
                    + '<span class="d-product-description">' + app.uploadTime + '</span>'
                    + '</div>'
                    + '</li>'
                    );
            });
        });
    }


    function bindScrollToNavhome() {
        $(window).unbind('scroll');
        $(window).scroll(function(){
            var nav_height = $('#home-nav').height();
            var delta = $(".top-image").height() - nav_height;
            var trans_class = "navbar navbar-fixed-top home-nav show-shadow";
            var full_color_class = "navbar navbar-fixed-top";
            var ori_class = document.querySelector('#home-nav').className;  
            if($(this).scrollTop() >= delta && ori_class != trans_class){
                document.querySelector('#home-nav').className = trans_class;
            } else if($(this).scrollTop() < delta && ori_class != full_color_class){
                document.querySelector('#home-nav').className = full_color_class;
            }
        });
    }

    function bindScrollToPCNavhome() {
        $(window).unbind('scroll');
        $(window).scroll(function(){
            var nav_height = $('#home-nav').height();
            var delta = $(".top-image").height() - nav_height + 70;
            var trans_class = "navbar navbar-fixed-top home-nav show-shadow";
            var full_color_class = "navbar navbar-fixed-top pc-nav show-shadow";
            var ori_class = document.querySelector('#home-nav').className;  
            if($(this).scrollTop() >= delta && ori_class != trans_class){
                document.querySelector('#home-nav').className = trans_class;
            } else if($(this).scrollTop() < delta && ori_class != full_color_class){
                document.querySelector('#home-nav').className = full_color_class;
            }
        });
    }

    function bindScrollToDetailnav(packageName) {
        $(window).unbind('scroll');
        $(window).scroll(function(){
            var nav_height = $('#detail-nav').height();
            var delta = $(".top-detail-image").height() - nav_height;
            var trans_class = "navbar navbar-fixed-top black-nav";
            var full_color_class = "navbar navbar-fixed-top";
            var ori_class = document.querySelector('#detail-nav').className;
            if($(this).scrollTop() >= delta && ori_class != trans_class){
                document.querySelector('#detail-nav').className = trans_class;
            } else if($(this).scrollTop() < delta && ori_class != full_color_class){
                document.querySelector('#detail-nav').className = full_color_class;
            }
        });
    }


    function genLatestIpaHtml(json) {
        var latestApkHtml = ""; 
        json.forEach( function(app) {
            latestApkHtml = latestApkHtml +
                    '<li class="item transparent-bkg-list-item">'
                    + '<div class="d-product-img">' 
                    + '<img src="' + app.icon_path + '" alt="Product Image"></img>'
                    + '</div>'
                    + '<a href="itms-services://?action=download-manifest&url=https://' + df_domain + app.plistpath + '" class="btn pull-right btn-default vcenter" >安装</a>'
                    //+ '<a href="javascript:void(0)" onclick=javascript:installIpa("' + app.plistpath + '",' + browser.versions.ios + '); class="btn pull-right btn-default vcenter">安装</a>'
                    + '<div class="d-product-info">'
                    + '<span class="d-product-title white-content">' + app.appName + '</span>'
                    + '<span class="d-product-description white-content">' + app.uploadTime + '</span>'
                    + '</div>'
                    + '</li>'

        });

        return latestApkHtml;
    }

    function getLatestIpaJson(bundleID) {
        var url_str = "http://" + df_domain + "/i/api/v1/apps/" + bundleID;
        return $.ajax({
            url: url_str,
            dataType: "json",
        });        
    }

    function getIpaHistoryJson(bundleID) {
        var url_str = "http://" + df_domain + "/i/api/v1/apps/" + bundleID + "/history";
        return $.ajax({
            url: url_str,
            dataType: "json",
        });        
    }

    function getLatestApkJson(packageName) {
        var url_str = "http://" + df_domain + "/a/api/v1/apps/" + packageName;
        console.log(url_str)
        return $.ajax({
            url: url_str,
            dataType: "json",
        });        
    }

    function getApkHistoryJson(packageName) {
        var url_str = "http://" + df_domain + "/a/api/v1/apps/" + packageName + "/history";
        return $.ajax({
            url: url_str,
            dataType: "json",
        });        
    }

    function loadAndroidDetailHtml(ctx) {
        console.log(ctx.params.packageName);
        var packageName = ctx.params.packageName;
        bindScrollToDetailnav(packageName);
        
        //genTopImage();
        
        $.when(getLatestApkJson(packageName), getApkHistoryJson(packageName)).done(function(latestApkJson, apkHistoryJson){
            if(browser.versions.android) {
                $.get("/app/android_detail.html", function(data) {
                    console.log(data.constructor);
                    var template = $(data);
                    template.find("#a-latest-app").append(genLatestApkHtml(latestApkJson[0]));
                    template.find('#summery-content').append(genApkSummery(packageName));
                    template.find("#a-h-apps-list").append(genAndroidHistory(apkHistoryJson[0]));
                    $("#div-wrapper").empty();
                    template.appendTo($("#div-wrapper"));
                });
                
            } else if(browser.versions.ios) {

            } else {
                $.get("/app/android_detail.html", function(data) {
                    var template = $(data);
                    template.find("#a-latest-app").append(genLatestApkHtml(latestApkJson[0]));
                    template.find('#summery-content').append(genApkSummery(packageName));
                    template.find('#qrcode-content').append(genQrcodeHtml(latestApkJson[0]));
                    template.find("#a-h-apps-list").append(genAndroidHistory(apkHistoryJson[0]));
                    $("#div-wrapper").empty();
                    template.appendTo($("#div-wrapper"));
                });
            }          
        });       
    }   


    function loadIOSDetailHtml(ctx) {
        console.log(ctx.params.bundleID)
        var bundleID = ctx.params.bundleID;
        bindScrollToDetailnav(bundleID);

        //genTopImage();
        
        $.when(getLatestIpaJson(bundleID), getIpaHistoryJson(bundleID)).done(function(latestIpaJson, ipaHistoryJson){
            console.log(latestIpaJson[0])
            console.log(ipaHistoryJson)
            if(browser.versions.android) {

            } else if(browser.versions.ios) {
                $.get("/app/ios_detail.html", function(data) {
                    var template = $(data);
                    template.find("#i-latest-app").append(genLatestIpaHtml(latestIpaJson[0]));
                    template.find('#summery-content').append(genIpaSummery(bundleID));
                    template.find('#i-h-apps-list').append(genIosHistory(ipaHistoryJson[0]));
                    $("#div-wrapper").empty();
                    template.appendTo($("#div-wrapper"));

                });
            } else {
                $.get("/app/ios_detail.html", function(data) {
                    var template = $(data);
                    template.find("#i-latest-app").append(genLatestIpaHtml(latestIpaJson[0]));
                    template.find('#summery-content').append(genIpaSummery(bundleID));
                    template.find('#qrcode-content').append(genQrcodeHtml(latestIpaJson[0]));
                    template.find('#i-h-apps-list').append(genIosHistory(ipaHistoryJson[0]));
                    $("#div-wrapper").empty();
                    template.appendTo($("#div-wrapper"));
                });
            }
        });        
    }


    function genQrcodeHtml(json) {
        var qrcodeHtml = ""; 
        json.forEach( function(app) {
            qrcodeHtml = '<div class="highlight summery">'
            + '<div class="detail-center-block text-center">'
            + '<p>可以使用手机扫描下面二维码安装</p></div>'
            + '<div id="qrcode-img" class="detail-center-block qrcode-image">'
            + '<img src="' + app.qr_icon_path + '" class="qrcode-image img-thumbnail"></div></div>'
                    
        });
        return qrcodeHtml;
    }




    function genLatestApkHtml(json) {   
        var latestApkHtml = ""; 
        json.forEach( function(app) {
            latestApkHtml = latestApkHtml +
                    '<li class="item black-bkg-list-item">'
                    + '<div class="d-product-img">' 
                    + '<img src="' + app.icon_path + '" alt="Product Image"></img>'
                    + '</div>'
                    + '<a href="javascript:void(0)" onclick=javascript:installApk("' + app.downpath + '",' + browser.versions.mm + '); class="btn pull-right btn-default  vcenter">下载</a>'
                    + '<div class="d-product-info">'
                    + '<span class="d-product-title white-content">' + app.label + '</span>'
                    + '<span class="d-product-description white-content">' + app.build_time + '</span>'
                    + '</div>'
                    + '</li>'

        });
        
        return latestApkHtml;
    }


    function genApkSummery(packageName) {
        var summery = "";
        if (packageName==="") {

        } else if(packageName==="") {
        };

        return summery;
    }


    function genIpaSummery(bundleID) {
        var summery = "";

        return summery;

    }


    function genIosHistory(json) {   
        var iosHistoryHtml = ""; 
        json.forEach( function(app) {
            iosHistoryHtml = iosHistoryHtml +
                    '<li class="item">'
                    + '<div class="d-product-img">'
                    + '<img src="' + app.icon_path + '" alt="Product Image"></img>'
                    + '</div>'
                    //+ '<a href="javascript:void(0)" onclick=javascript:installIpa("' + app.plistpath + '",' + browser.versions.ios + '); class="btn pull-right btn-info btn-custom vcenter">安装</a>'
                    + '<a href="itms-services://?action=download-manifest&url=https://' + df_domain + app.plistpath + '" class="btn pull-right btn-info btn-custom vcenter" >安装</a>'
                    + '<div class="d-product-info">'
                    + '<span class="d-product-title">' + app.appName + '</span>'
                    + '<span class="d-product-description">' + app.uploadTime + '</span>'
                    + '</div>'
                    + '</li>'
        });
        
        return iosHistoryHtml;
    }


    function genAndroidHistory(json) {
        var history = "";
        json.forEach( function(app) {
            history = history +
                '<li class="item">'
                + '<div class="d-product-img">'
                + '<img src="' + app.icon_path + '" alt="Product Image"></img>'
                + '</div>'
                + '<a href="javascript:void(0)" onclick=javascript:installApk("' + app.downpath + '",' + browser.versions.mm + '); class="btn pull-right btn-info btn-custom vcenter">下载</a>'
                + '<div class="d-product-info">'
                + '<span class="d-product-title">' + app.label + '</span>'
                + '<span class="d-product-description">' + app.version + '</span>'
                + '</div>'
                + '</li>'
                
        });

        return history;

    }


    function getBrowserInfo() {
        var browser = {
            versions:function(){
                var u = navigator.userAgent, app = navigator.appVersion;
                return {
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                    iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                    mm: u.indexOf('MicroMessenger') > -1 //是否web应该程序，没有头部与底部
                };
            }(),
            language:(navigator.browserLanguage || navigator.language).toLowerCase()
        }
        console.log(navigator.userAgent);
        console.log(" 是否为移动终端: "+browser.versions.mobile);
        console.log(" ios终端: "+browser.versions.ios);
        console.log(" android终端: "+browser.versions.android);

        return browser;
    }

})();
