export function urlParse() {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g
  let arr = url.match(reg);
  if (arr) {
    arr.forEach(item => {
      let [key, val] = item.substring(1).split('=');
      obj[decodeURIComponent(key)] = decodeURIComponent(val);
    })
  }
  return obj;
}