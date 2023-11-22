import _ from '../assets/utils';
import qs from 'qs';
import { Toast } from 'antd-mobile';

/* 核心方法 */
const http = function http(config) {
  // #region
  // 这是一个 JavaScript 函数，看起来是一个用于发送 HTTP 请求的封装函数。
  // 以下是该函数的详细分析：
  // 参数和默认配置：

  // 函数接受一个参数 config，用于配置 HTTP 请求的各种参数。
  // 利用 Object.assign 设置了默认的配置，包括 url、method、credentials、
  // headers、body、params、responseType、signal 等。
  // 对一些参数进行了简单的验证和初始化。
  // URL 参数拼接：

  // 如果存在 params 参数，将其转换为 URL 查询字符串，并附加到 url 上。
  // 请求体处理：

  // 如果 body 是一个普通对象，将其转换为 URL 编码的字符串，并设置请求头的
  // Content-Type 为 application/x-www-form-urlencoded。
  // Token 处理：

  // 从本地存储中获取名为 'tk' 的 token。
  // 如果存在 token，并且请求的 URL 符合一定条件（在 safeList 中定义的一些路径），
  // 则在请求头中添加 'authorization' 字段。
  // 发送请求：

  // 将请求方法转换为大写。
  // 构建最终的 config 对象，包括 method、credentials、headers、cache、signal 等。
  // 如果是 POST、PUT、PATCH 请求且存在请求体，则将请求体添加到 config.body。
  // 使用 fetch 函数发起 HTTP 请求。
  // 处理响应：

  // 在响应到达后，首先检查响应的状态码。如果是 2xx 或者 3xx，则根据 responseType 处理响应体。
  // 如果状态码不在 2xx 或者 3xx 范围内，使用 Promise.reject 返回一个包含错误信息的对象。
  // 错误处理：

  // 在请求过程中发生错误时（如网络错误），捕获错误并通过 Toast.show 方法显示一条包含错误信息的提示，
  // 并使用 Promise.reject 返回错误。
  // #endregion
  // initial config & validate
  if (!_.isPlainObject(config)) config = {};
  config = Object.assign({
    url: '',
    method: 'GET',
    credentials: 'include',
    headers: null,
    body: null,
    params: null,
    responseType: 'json',
    signal: null
  }, config);
  if (!config.url) throw new TypeError('url must be required');
  if (!_.isPlainObject(config.headers)) config.headers = {};
  if (config.params !== null && !_.isPlainObject(config.params)) config.params = null;

  let { url, method, credentials, headers, body, params, responseType, signal } = config;
  if (params) {
    url += `${url.includes('?') ? '&' : '?'}${qs.stringify(params)}`;
  }
  if (_.isPlainObject(body)) {
    body = qs.stringify(body);
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  // 处理Token
  let token = _.storage.get('tk'),
    safeList = ['/user_info', '/user_update', '/store', '/store_remove', '/store_list'];
  if (token) {
    let reg = /\/api(\/[^?#]+)/,
      [, $1] = reg.exec(url) || [];
    let isSafe = safeList.some(item => {
      return $1 === item;
    });
    if (isSafe) headers['authorization'] = token;
  }

  // send
  method = method.toUpperCase();
  config = {
    method,
    credentials,
    headers,
    cache: 'no-cache',
    signal
  };
  if (/^(POST|PUT|PATCH)$/i.test(method) && body) config.body = body;
  return fetch(url, config)
    .then(response => {
      let { status, statusText } = response;
      if (/^(2|3)\d{2}$/.test(status)) {
        let result;
        switch (responseType.toLowerCase()) {
          case 'text':
            result = response.text();
            break;
          case 'arraybuffer':
            result = response.arrayBuffer();
            break;
          case 'blob':
            result = response.blob();
            break;
          default:
            result = response.json();
        }
        return result;
      }
      return Promise.reject({
        code: -100,
        status,
        statusText
      });
    })
    .catch(reason => {
      Toast.show({
        icon: 'fail',
        content: '网络繁忙,请稍后再试!'
      });
      return Promise.reject(reason);
    });
};

/* 快捷方法 */
["GET", "HEAD", "DELETE", "OPTIONS"].forEach(item => {
  http[item.toLowerCase()] = function (url, config) {
    if (!_.isPlainObject(config)) config = {};
    config['url'] = url;
    config['method'] = item;
    return http(config);
  };
});
["POST", "PUT", "PATCH"].forEach(item => {
  http[item.toLowerCase()] = function (url, body, config) {
    if (!_.isPlainObject(config)) config = {};
    config['url'] = url;
    config['method'] = item;
    config['body'] = body;
    return http(config);
  };
});

export default http;