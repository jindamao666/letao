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
        //添加mui确认框
        // 参数1: 提示文本
        // 参数2: 标题
        // 参数3: 提示框按钮按钮, 要求是一个数组
        // 参数4: 点击按钮后的回调函数
        mui.confirm( "你确定要清空历史记录嘛?", "温馨提示", ["取消", "确认"], function( e ) {
            //e.index可以获取所点击的按钮的索引
            console.log( e );
            if ( e.index === 1 ) {
                // 点击了确认
                // 移除本地历史
                localStorage.removeItem("search_list");
                // 重新渲染
                render();
            }
        })
    });
    //功能3：删除单条历史记录
    // (1)注册事件，通过事件委托注册
    // (2)将下标存在删除按钮上，获取存储的下标
    // (3)从本地存储中读取数组
    // (4)通过下标从数组中，将对应项删除 splice
    // (5)将修改后的数组，转成jsonStr，存到本地存储中
    // (6)页面重新渲染
    $(".lt_history").on("click",".btn_del",function () {
        //将外层的this指向，存储在that中
        var that = this;
        //添加确认框
        mui.confirm( "你确定要删除该条记录嘛?", "温馨提示", ["取消", "确认"], function( e ) {
            //e.index可以获取所点击的按钮的索引
            console.log( e );
            if ( e.index === 1 ) {
                //用户点击了索引为1的确认按钮
                //获取下标
                var index = $(that).data("index");
                //获取数组
                var arr = getHistory();
                //根据下标删除数组的对应项
                //splice(从哪开始，删除几项，添加的项1，添加的项2，。。。。)
                arr.splice(index,1);
                //将修改后的数组，转成jsonStr，存到本地存储中
                localStorage.setItem("search_list",JSON.stringify(arr));
                //页面重新渲染
                render();
            }
        })
    });
    //功能4：添加历史记录功能
    //（1)给搜索按钮，添加点击事件
    $('.search_btn').click(function () {
        //（2)获取输入框的值
        var key = $('.search_input').val().trim();
        if(key === ""){
            alert("请输入搜索关键字");
            return;
        }
        //（3)获取本地历史中存的数组
        var arr = getHistory();
        //1.如果有重复的，先将重复的删除，将这项添加到最前面
        var index = arr.indexOf(key);
        if(index != -1){
            //说明在数组中可以找到重复的项，且索引为index
            arr.splice(index,1);
        }
        //2.长度不能超过10个
        if (arr.length >= 10){
            //删除最后一项
            arr.pop();
        }
        //（4)往数组的最前面追加
        arr.unshift(key);
        //（5)转成jsonStr，将修改后的存储到本地存储中
        localStorage.setItem("search_list",JSON.stringify(arr));
        //（6)页面重新渲染
        render();
        //清空输入框
        $('.search_input').val("");
        //添加跳转,跳转到产品列表页
        location.href = "searchList.html?key="+key;
    })



});