$(function () {
    //功能1.获取地址栏传递过来的搜索关键字，设置给input
    var key = getSearch("key");
    //设置给input
    $('.search_input').val(key);
    render();
    //一进入页面，根据搜索关键字，发送请求，进行页面渲染
    function render(){
        //准备请求数据，渲染时，显示加载中的效果
        $('.lt_product').html('<div class="loading"></div>');
        var params = {};
        //三个必传的参数
        params.proName = $('.search_input').val();
        params.page = 1;
        params.pageSize = 100;
        //两个可传可不传的参数，
        // 1.需要根据高亮的a来判断传哪个参数，
        // 2.通过箭头判断，升序还是降序
        // 价格：price 1升序2降序
        // 库存：num 1升序 2降序
        var $current = $('.lt_sort a.current');
        if ($current.length > 0) {
            //有高亮的a，说明需要进行排序
            //获取传给后台的键
            var sortName = $current.data("type");
            console.log(sortName);
            //获取传给后台的值，通过箭头方向判断
            var sortValue = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;
            //添加到params中
            params[sortName] = sortValue;
        }
        setTimeout(function () {
            $.ajax({
                type:"get",
                url:"/product/queryProduct",
                data:params,
                dataType:"json",
                success:function (info) {
                    console.log(info);
                    var htmlStr = template("tpl",info);
                    $('.lt_product').html(htmlStr);
                }
            });
        },500);
    }
    //功能2：点击搜索按钮实现搜索功能
    $('.search_btn').click(function () {
        //需要将搜索关键字，追加存储到本地存储中
        var key = $('.search_input').val();
        if(key.trim()=== ""){
            mui.toast("请输入搜索关键字");
            return;
        }
        render();
        //获取数组,需要将jsonStr转换成数组 =》arr
        var history = localStorage.getItem("search_list")||'[]';
        var arr = JSON.parse(history);
        //1.删除重复项
        var index = arr.indexOf(key);
        if(index != -1){
            arr.splice(index,1);
        }
        //2.长度限制在10
        if(arr.length >= 10){
            //删除最后一项
            arr.pop();
        }
        //将关键字追加到arr最前面
        arr.unshift(key);
        //转成json，存到本地存储中
        localStorage.setItem("search_list",JSON.stringify(arr));

    });
    //功能3：排序功能
    //通过属性选择器给价格和库存添加点击事件
    //(1)如果自己有current类，切换箭头方向即可
    //(2)如果自己没有current类，给自己加上current类，并且移除兄弟元素的current类
    $('.lt_sort a[data-type]').click(function () {
        if($(this).hasClass("current")){
            //有current类，切换箭头方向即可
            $(this).find("i").toggleClass("fa-angle-up").toggleClass("fa-angle-down");
        }else{
            //有current类，给自己加上current类，并且移除兄弟元素的current类
            $(this).addClass("current").siblings().removeClass("current");
        }
        //页面重新渲染即可，因为所有的参数都在render中实时获取处理好了
        //要重新渲染，只需要调用render
        render();
    });
});