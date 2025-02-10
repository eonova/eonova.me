export function isWeChatMobileBrowser(): boolean {
  const ua = navigator.userAgent.toLowerCase();
  // 检测是否是微信浏览器
  const isWeChat = /micromessenger/i.test(ua);
  // 检测是否是移动设备
  const isMobile = /mobile|android|iphone|ipad|ipod|blackberry|windows phone/i.test(ua);

  return isWeChat && isMobile;
}

