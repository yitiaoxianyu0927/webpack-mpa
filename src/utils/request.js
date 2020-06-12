import axios from 'axios'
//import Store from '@/store'
import Qs from 'qs'
// import JsonP from 'jsonp'
import { Message } from 'element-ui'
import { Loading } from 'element-ui'
// import { getToken } from '@/utils/auth'
import { MessageBox } from 'element-ui'



//console.log("CORE_CONFIG",CORE_CONFIG,sessionStorage.getItem('Admin-Token'))

// create an axios instance
const RequestUtils = {};
// create an axios instance
const service = axios.create({
  baseURL: CORE_CONFIG.BASE_API,// api的base_url
  headers: {'Content-Type': 'application/json;charset=UTF-8'}, 
  timeout: 300000// request timeout
})

//允许携带cookie
//service.defaults.withCredentials = true;
//service.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
//service.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest';
service.defaults.responseType = 'json';

service.defaults.validateStatus = function (status) {
    return true;
};

// request interceptor
//请求拦截
service.interceptors.request.use(
  config => {
    // console.log("config config config config ");
    // Do something before request is sent
    // 让每个请求携带token-- ['x-token']为自定义key 请根据实际情况自行修改

    config.headers['x-token'] = sessionStorage.getItem('Admin-Token');
    if (config.method === 'post') {
      
        if( typeof config.data == "object"){
      
          config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
          config.data = Qs.stringify(config.data)// 防止post请求参数无法传到后台  在这里就用到了qs
      
        }

    }




    //分页查询总数不加载蒙版
    // if(config.url.indexOf("/totalcount")<0 && config.is_show_loading === true){
    
    console.log( RequestUtils.is_show_loading)

    if(config.url.indexOf("/totalcount")<0 && RequestUtils.is_show_loading){
      // 页面加载蒙版
      showFullScreenLoading();
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    // 页面加载蒙版
    hideFullScreenLoading();
    return Promise.reject(error)
  }
)

// respone interceptor
//响应拦截
service.interceptors.response.use(
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
   
    if(response.config.url.indexOf("/totalcount")<0){
      hideFullScreenLoading();
    }
    const res_status = response.status;
    // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
    if (res_status === 50008 || res_status === 50012 || res_status === 50014) {
      MessageBox.confirm('您的会话已失效或超时，请重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Store.dispatch('FedLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      });
      return;
    }

    //封装请求是否失败，如果失败弹出错误请提示；
    const result = response.data;

    if(RequestUtils.is_show_message){

      //正常返回数据
      if(result && (result === "success" || result.success === true) ){
        return response;
      }else{
        let err_msg = "操作失敗！";
        if(result && result.message){
          err_msg = result.message;
        }
        Message({
          message: err_msg,
          type: 'error',
          duration: 3 * 1000
        })
        return Promise.reject('error')
      }

    }else{

      return response; 

    }

  },
  error => {
    hideFullScreenLoading();
    console.log('request is error' + error) // for debug
    Message({
       message: error.message,
       type: 'error',
       duration: 3 * 1000
     })
    return Promise.reject(error)
  }
)


let loading;
function startLoading(text = '加载中……') {
 
//  loading = VM.$loading({
 loading = Loading.service({
  lock: true,
  text: text,
  background: 'rgba(0, 0, 0, 0.7)'
 })
}

function endLoading() {
 loading.close()
}

//loading层计数器，确保同时只加载一次
let needLoadingRequestCount = 0

function showFullScreenLoading() {
 if (needLoadingRequestCount === 0) {
    startLoading()
 }
 needLoadingRequestCount++
}
function hideFullScreenLoading() {

 if (needLoadingRequestCount <= 0){
  needLoadingRequestCount = 0;
  return
 } 

 needLoadingRequestCount--

 if (needLoadingRequestCount === 0) {
  endLoading()
 }
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @param is_mock true/false dufault:false
 * @param is_show_loading true/false dufault:true
 * @param is_show_message true/false default:true
 * @returns {Promise}
 */
RequestUtils.requestServer = function(url,data = {},is_mock = false,is_show_loading = true,is_show_message = true,modulesUrl = ""){
  //console.log("excute requestServer: url,data,is_mock",url,data,is_mock);
  return new Promise((resolve,reject) => {
    let config = {};
    //是否显示loading层
    config.is_show_loading = is_show_loading;

    RequestUtils.is_show_loading = is_show_loading;

    RequestUtils.is_show_message = is_show_message;

    if(CORE_CONFIG.IS_ALWAYS_MOCK == true){
      config.baseURL = CORE_CONFIG.MOCK_API;//始终从mock上读取数据
    }else if(CORE_CONFIG.IS_ALWAYS_SERVER == true){
      config.baseURL = CORE_CONFIG.BASE_API; //始终从server端读取数据

      if(modulesUrl=="main"){

        config.baseURL = CORE_CONFIG.MAIN_BASE_API; //始终从server端读取数据

      } 
      
    }else{
      if(is_mock === true){ //当个API的特定参数，是否从mock或server端读取数据，匹配优先级最低
        config.baseURL = CORE_CONFIG.MOCK_API;
      }
    }

    service.post(url,data,config).then(
	    response => {
	      resolve(response.data);
	    },
	    err => {
	      reject(err)
	    }
    )
    
  })
}


/**
 * 导出全部公用方法,封装post请求
 * @param url control路径
 * @param data 参数对象
 * @param fileName 文件名称(不包含扩展名)
 * @param exp_columnnamesanddisplaynames 列的prop和显示名称的拼接字符串，如： prop1&列名1,prop2&列名2,prop3&列名3
 * @param columnDates 列的对象,可以为空
*/
RequestUtils.requestServerExportExcel = function(url,data = {},fileName = "导出文件",exp_columnnamesanddisplaynames = "",columnDates){
  console.log("excute request.requestServerExportExel");
  console.log("url",url);
  console.log("data",data);
  console.log("fileName",fileName);
  console.log("exp_columnnamesanddisplaynames",exp_columnnamesanddisplaynames);
  console.log("columnDates",columnDates);
  console.log("--------------------------------------------l");
  //参数补全
  data.exp_columnnamesanddisplaynames = exp_columnnamesanddisplaynames;
  data.fileName = fileName;
  data.number = CORE_CONFIG.EXPORT_MAX_NUMBER;//文件导出的最大上限
  startLoading('数据准备中.....');
  return new Promise((resolve, reject) => {
    axios({
      responseType: 'arraybuffer',
      url: url,
      method: 'post',
      baseURL:CORE_CONFIG.BASE_API,
      data:data,
      transformRequest: [function (data) {
        data = Qs.stringify(data);
        return data;
      }],
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        //'X-Requested-With':'XMLHttpRequest',
        'x-token':sessionStorage.getItem('Admin-Token')//getToken(),
      }
    }).then(res =>{
      endLoading();
      var fileDownload = require('js-file-download')
      // let fileName = res.headers['content-disposition'].match(/fushun(\S*)xls/)[0];
      // fileName = decodeURIComponent(fileName);
      let expFileName = data.fileName +'.xlsx';
      fileDownload(res.data,expFileName); 
      Message({
        type: 'success',
        message: '导出成功!',
        duration: 3 * 1000
      })
      resolve();
    }).catch(error =>{
      Message({
        type: 'error',
        message: '导出失败!',
        duration: 3 * 1000
      })
    })
  });
}

RequestUtils.requestServerExportFiles = function(url, data = {}, fileName = "导出文件"){
  //参数补全
  data.fileName = fileName;
  data.number = CORE_CONFIG.EXPORT_MAX_NUMBER;//文件导出的最大上限
  startLoading('数据准备中.....');
  return new Promise((resolve, reject) => {
    axios({
      responseType: 'arraybuffer',
      url: url,
      method: 'post',
      baseURL:CORE_CONFIG.BASE_API,
      data:data,
      transformRequest: [function (data) {
        data = Qs.stringify(data);
        return data;
      }],
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'x-token':sessionStorage.getItem('Admin-Token')//getToken(),
      }
    }).then(res =>{
      endLoading();
      var fileDownload = require('js-file-download')
      let expFileName = data.fileName;
      fileDownload(res.data,expFileName); 
      Message({
        type: 'success',
        message: '导出成功!',
        duration: 3 * 1000
      })
      resolve();
    }).catch(error =>{
      Message({
        type: 'error',
        message: '导出失败!',
        duration: 3 * 1000
      })
    })
  });
}

/**
 * 文件上传公用方法,封装post请求
 * @param url control路径
 * @param data 参数对象
*/
RequestUtils.requestServerFileUpLoad = function(url,data = {}){
  console.log("excute request.requestServerFileUpLoad");
  console.log("url",url);
  console.log("data",data);
  console.log("--------------------------------------------l");

  return new Promise((resolve, reject) => {
    axios({
      url: url,
      method: 'post',
      timeout: 30000,
      baseURL:CORE_CONFIG.BASE_API,
      data:data,
      onUploadProgress: function (progressEvent) {
        // 对原生进度事件的处理
  
      },
      headers:{
        'Content-Type': 'multipart/form-data',
        //'X-Requested-With':'XMLHttpRequest',
        'x-token':sessionStorage.getItem('Admin-Token')//getToken(),
      }
    }).then(res =>{
      Message({
        type: 'success',
        message: '上传成功!',
        duration: 3 * 1000
      });
      resolve(res.data);
    }).catch(error =>{
      Message({
        type: 'error',
        message: '上传失败!',
        duration: 3 * 1000
      })
    })
  });
}


export default RequestUtils;