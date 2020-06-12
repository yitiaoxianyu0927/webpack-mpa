/*
   搭配页面core_config.js使用

*/

	
//全局变量
var PUBLIC_WEB_CTX =  CORE_CONFIG.BASE_API;
var PUBLIC_RES_CTX =  CORE_CONFIG.WEB_RES_BASE_URL;
var PUBLIC_PROVINCE = CORE_CONFIG.PROVINCE;//发布省份 
var PUBLIC_CURR_USER_ID = '';//当前用户ID
var PUBLIC_EXP_MAX_NUM = CORE_CONFIG.PUBLIC_EXP_MAX_NUM;//导出全部数据量上限常量
var PUBLIC_TOKEN_KEY = 'Admin-Token';
var PUBLIC_VERSION_ID = CORE_CONFIG.PUBLIC_VERSION_ID;
var PUBLIC_BASE_CTX = CORE_CONFIG.BASE_API;  ///后台地址


export function loadExtendHtJs(){

    document.write('<link rel="stylesheet" type="text/css" href="'+PUBLIC_RES_CTX+'/static/ht-4.3/css/ht-contextmenu.css?version='+PUBLIC_VERSION_ID+'" />');
    document.write('<link rel="stylesheet" type="text/css" href="'+PUBLIC_RES_CTX+'/static/ht-4.3/css/ht-dialog.css?version='+PUBLIC_VERSION_ID+'" />');
    document.write('<script type="text/javascript" src="'+PUBLIC_RES_CTX+'/static/ht-4.3/js/ht-default.js?version='+PUBLIC_VERSION_ID+'"></script>');
    document.write('<script type="text/javascript" src="'+PUBLIC_RES_CTX+'/static/ht-4.3/js/ht.js?version='+PUBLIC_VERSION_ID+'"></script>');
    document.write('<script type="text/javascript" src="'+PUBLIC_RES_CTX+'/static/ht-4.3/js/ht-propertypane.js?version='+PUBLIC_VERSION_ID+'"></script>');
    document.write('<script type="text/javascript" src="'+PUBLIC_RES_CTX+'/static/ht-4.3/js/ht-autolayout.js?version='+PUBLIC_VERSION_ID+'"></script>');
    document.write('<script type="text/javascript" src="'+PUBLIC_RES_CTX+'/static/ht-4.3/js/ht-contextmenu.js?version='+PUBLIC_VERSION_ID+'"></script>');
    document.write('<script type="text/javascript" src="'+PUBLIC_RES_CTX+'/static/ht-4.3/js/ht-telecom.js?version='+PUBLIC_VERSION_ID+'"></script>');
    document.write('<script type="text/javascript" src="'+PUBLIC_RES_CTX+'/static/ht-4.3/js/ht-form.js?version='+PUBLIC_VERSION_ID+'"></script>');
    document.write('<script type="text/javascript" src="'+PUBLIC_RES_CTX+'/static/ht-4.3/js/ht-cssanimation.js?version='+PUBLIC_VERSION_ID+'"></script>');
    document.write('<script type="text/javascript" src="'+PUBLIC_RES_CTX+'/static/ht-4.3/js/ht-dialog.js?version='+PUBLIC_VERSION_ID+'"></script>');
    document.write('<script type="text/javascript" src="'+PUBLIC_RES_CTX+'/static/ht-4.3/js/ht-quickfinder.js?version='+PUBLIC_VERSION_ID+'"></script>');
    document.write('<script type="text/javascript" src="'+PUBLIC_RES_CTX+'/static/ht-4.3/js/ht-edgetype.js?version='+PUBLIC_VERSION_ID+'"></script>');
    document.write('<script type="text/javascript" src="'+PUBLIC_RES_CTX+'/static/ht-4.3/js/ht-pagetable.js?version='+PUBLIC_VERSION_ID+'"></script>');
    document.write('<script type="text/javascript" src="'+PUBLIC_RES_CTX+'/static/ht-4.3/js/ht-flow.js?version='+PUBLIC_VERSION_ID+'"></script>');
    document.write('<script type="text/javascript" src="'+PUBLIC_RES_CTX+'/static/ht-4.3/js/ht-common.js?version='+PUBLIC_VERSION_ID+'"></script>');

}