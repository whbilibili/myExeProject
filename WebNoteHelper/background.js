/*
 * @Author: wanghong52 wanghong52@meituan.com
 * @Date: 2025-04-01 19:51:32
 * @LastEditors: wanghong52 wanghong52@meituan.com
 * @LastEditTime: 2025-04-01 20:37:06
 * @FilePath: /MyExeProject/WebNoteHelper/background.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */



// 监听来自popup.js的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCurrentUrl') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        sendResponse({ url: tabs[0].url });
      } else {
        sendResponse({ url: null });
      }
    });
    return true; // 异步响应需要返回true
  }
});