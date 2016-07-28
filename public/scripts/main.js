/**
 * Page Effect
 */
//event register
var ee = new EventEmitter();
var cAudio;

//all poems init

(function(){
    var htmlTmp = "";
    var source   = $("#entry-template").html();
    var template = Handlebars.compile(source);

    var htmlTmp = template({poemsData: poemsData});
    $('#tmp')[0].outerHTML=htmlTmp;
})();

//切换诗歌
$('.poem-hot').click(function(event) {
    var $this = $(this);
    var index = $this.data('index');
    cPoemData = poemsData[index];
    var url = cPoemData.recordUrl.replace("http://media.yueduapi.com/poem/user_mp3/","").replace(".mp3","");
    location.href = "/share/"+url;
});

ee.on('poem:init', function(){
    //设置文本内容
    var data = cPoemData;
    var arr =data.body.replace(/(<\/p>){0,1}<p.*?>/g, "_").replace("</p>","").split('_');
    do{
        arr.splice(arr.indexOf(""),1)
    }while(arr.indexOf("")>-1);
    var contentHtml  = "<span class='author'>（作者）"+data.author+"</span>";
    $.each(arr,function(index, item){
        var tmp = '<span>'+item+'</span>';
        contentHtml+=tmp;
    });
    $('.poem-content').first().html(contentHtml);
    //修改title
    $('#poem-spec div').first().text("《"+data.subject+"》");
    $('#poem-spec div').last().text(data.desc);

    //音频
    cAudio = new Audio();
    cAudio.src = cPoemData.recordUrl;
    cAudio.addEventListener('loadedmetadata', function() {
        cAudio.currentTime = 0;
    }, false);
    cAudio.addEventListener('ended', function() {
        ee.trigger('poem:pause');
        this.currentTime = 0;
    }, false);
    cAudio.addEventListener('timeupdate', function() {
        if(cAudio&&cAudio.duration!==0){
            var percentage = Number(this.currentTime / cAudio.duration * 100).toFixed(4) + '%';
            $('#bar').css('width', percentage);
        }
    }, false);
    cAudio.load();
})
ee.trigger('poem:init');

ee.on('poem:play', function(){
    cAudio.play();
    $('#play-btn').hide();
    $('#pause-btn').show();
})
ee.on('poem:pause', function(){
    cAudio.pause();
    $('#play-btn').show();
    $('#pause-btn').hide();
})
ee.on('poem:rest', function(){
    ee.trigger('poem:pause')
    $('.poem-content').css({
        'marginBottom': "1.67rem",
        'height': '65px'
    });
    $('.expand-btn').css('transform','rotate(0)');
})
$('#play-btn').click(function(event) {
    ee.trigger('poem:play');
});
$('#pause-btn').click(function(event) {
    ee.trigger('poem:pause');
});

//诗词切换
$('.expand-btn').click(function(event) {
    $('.poem-content').css({
        'marginBottom':0,
        'height': '100%'
    });
    $(this).css('transform','rotate(180deg)');
    $(this).hide();
});
$('#play-btn').click(function(event) {
    var $bar = $('#bar');
});

//点赞
$('#like').click(function(event) {
    var $this = $(this);
    $this.toggleClass('active');
});
//下载链接
$('#d-img-wrap img').click(function(event) {
    /* Act on the event */
    var os = getMobileOperatingSystem();
    var url;
    if(os=='iOS'){
        url = "http://a.app.qq.com/o/simple.jsp?pkgname=me.xieba.poems.app";
        location.href = url;
    }else if(os == 'Android'){
        if(!isWeiXin()){
            url = "http://media.yueduapi.com/pack/share/poemsforchildren.apk";
            location.href = url;
        }else{
            url = "http://a.app.qq.com/o/simple.jsp?pkgname=me.xieba.poems.app";
            location.href = url;
        }
    }else{
        url = "http://poem.beautifulreading.com";
        location.href = url;
    }
});


$('#share').click(function(){
    $('#shareWindow,#share-mask').show();
})
$('#share-title div').first().click(function(){
    $('#shareWindow,#share-mask').hide();
})
//分享跳转
//分享窗口效果
//为社会分享图标价url
var currentUrl = location.href;
var url = location.href;
var weiboUrl = 'http://www.jiathis.com/send/?webid=tsina&url='+ url +'&title=【给孩子的诗】这首诗很美，不信你听听。@美丽阅读&uid=yangsf@xieba.me';
var weixinUrl = 'http://www.jiathis.com/send/?webid=weixin&url='+ url +'&title=【给孩子的诗】这首诗很美，不信你听听。&uid=yangsf@xieba.me';
var qzoneUrl = 'http://www.jiathis.com/send/?webid=qzone&url='+ url +'&title=【给孩子的诗】这首诗很美，不信你听听。&uid=yangsf@xieba.me';
var qqUrl = 'http://www.jiathis.com/send/?webid=cqq&url='+ url +'&title=【给孩子的诗】这首诗很美，不信你听听。&uid=yangsf@xieba.me';
$('#share-wechat').click(function(event) {
    window.open(weixinUrl);
});
$('#share-weibo').click(function(event) {
    window.open(weiboUrl);
});
$('#share-qq').click(function(event) {
    window.open(qqUrl);
});
$('#share-qzone').click(function(event) {
    window.open(qzoneUrl);
});


/**
 * Determine the mobile operating system.
 * This function either returns 'iOS', 'Android' or 'unknown'
 *
 * @returns {String}
 */
function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
    {
        return 'iOS';

    }
    else if( userAgent.match( /Android/i ) )
    {

        return 'Android';
    }
    else
    {
        return 'unknown';
    }
}
function isPC(){
    var os = getMobileOperatingSystem();
    if(os!=="Android" && os!=="iOS"){
        return true;
    }
    return false;
}
/**
 * Determine the mobile operating system .
 * This function either returns 'true' or 'false'
 *
 * @returns {Boolean}
 */
function isWeiXin(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}

function brows(){//移动终端浏览器版本信息
    var ua = navigator.userAgent,
        $ = {};

    if (/mobile/i.test(ua))
        $.Mobile = true;

    if (/like Mac OS X/.test(ua)) {
        $.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.');
        $.iPhone = /iPhone/.test(ua);
        $.iPad = /iPad/.test(ua);
    }

    if (/Android/.test(ua))
        $.Android = /Android ([0-9\.]+)[\);]/.exec(ua)[1];
    if (/QQ/.test(ua)){
        $.QQ = true;
    }
    if (/webOS\//.test(ua))
        $.webOS = /webOS\/([0-9\.]+)[\);]/.exec(ua)[1];

    if (/(Intel|PPC) Mac OS X/.test(ua))
        $.Mac = /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(ua)[2].replace(/_/g, '.') || true;

    if (/Windows NT/.test(ua))
        $.Windows = /Windows NT ([0-9\._]+)[\);]/.exec(ua)[1];
    return $;
}
