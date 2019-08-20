$(function () {
    //注意：要进行本地存储localStorage的操作，进行历史记录管理，需要约定一个键名，search_list，
    //将来通过search_list进行读取或者设置操作
    //准备假数据：将下面三行代码，在控制台执行，可以添加假数据
    // var arr = ["耐克","阿迪","阿迪王","耐克王","新百伦"];
    // var jsonStr = JSON.stringify(arr);
    // localStorage.setItem("search_list",jsonStr);

    //功能1：列表渲染功能
    // （1）从本地存储中读取历史记录，读取的是jsonStr
    // （2）转换成数组
    // （3）通过模版引擎动态渲染
    render();
    //从本地存储中读取历史记录，以数组的形式返回
    function getHistory() {
        //如果没有读取到数据，默认初始化成一个空数组
        var history = localStorage.getItem("search_list")||'[]';//jsonstr
        var arr = JSON.parse(history);
        return arr;
    }
    //读取数组，进行页面渲染
    function render() {
        var arr = getHistory();
        var htmlStr = template("tpl",{arr:arr});
        $('.lt_history').html(htmlStr);
    }
    //功能2：清空历史记录功能
    // (1)注册事件，通过事件委托注册
    // (2)清空历史记录，removeItem
    // (3)页面重新渲染
    $('.lt_history').on("click",".btn_empty",function () {
        //清空记录
        localStorage.removeItem("search_list");
        //重新渲染
        render();
    })
});