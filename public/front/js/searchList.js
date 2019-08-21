$(function () {
    var currentPage = 1;//当前页
    var pageSize = 2;//每页条数
    //整个页面的核心方法，在render方法中，处理了所有的参数，发送请求，获取数据
    function render(callback){
        //准备请求数据，渲染时，显示加载中的效果
        // $('.lt_product').html('<div class="loading"></div>');
        var params = {};
        //三个必传的参数
        params.proName = $('.search_input').val();
        params.page = currentPage;
        params.pageSize = pageSize;
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
                    //真正拿到数据后执行的操作，通过callback函数传递进来了
                    callback && callback(info);
                }
            });
        },500);
    }
    //功能1.获取地址栏传递过来的搜索关键字，设置给input
    var key = getSearch("key");
    //设置给input
    $('.search_input').val(key);
    // render();
    //配置下拉刷新和上拉加载注意点：
    //下拉刷新是对原有数据的覆盖，执行的是html方法
    // 上拉加载是在原有结构的基础上进行追加，追加到后面，执行的是append方法
    mui.init({
        //配置pullRefresh
        pullRefresh : {
            container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            //配置下拉刷新
            down : {
                auto: true,//可选,默认false.首次加载自动下拉刷新一次
                callback :function(){
                    console.log("下拉刷新了");
                    //拿到数据后需要执行的方法是不一样的，所以通过回调函数的方式，传进去执行
                    //加载第一页的数据
                    currentPage = 1;
                    render(function (info) {
                        var htmlStr = template("tpl",info);
                        $('.lt_product').html(htmlStr);
                        //ajax回来之后，需要结束下拉刷新，让内容回滚顶部，
                        // 注意：api做了更新，mui文档上还没有更新上,要使用原型上的endPulldownToRefresh方法来结束 下拉刷新
                        mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
                        //第一页的数据重新加载之后，又有数据可以进行上拉加载了，需要启用上拉加载
                        mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh();
                    });
                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            },
            //配置上拉加载
            up : {
                callback :function(){
                    console.log("执行了上拉加载");
                    //需要加载下一页的数据,更新当前页
                    currentPage++;
                    render(function (info) {
                        var htmlStr = template("tpl",info);
                        $('.lt_product').append(htmlStr);
                        //当数据回来之后，需要结束上拉加载
                        if (info.data.length === 0){
                            //没有更多数据了
                            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
                        } else{
                            //还有数据，正常结束上拉加载
                            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(false);
                        }

                    });
                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            }
        }
    });
    //功能2：点击搜索按钮实现搜索功能
    $('.search_btn').click(function () {
        //需要将搜索关键字，追加存储到本地存储中
        var key = $('.search_input').val();
        if(key.trim()=== ""){
            mui.toast("请输入搜索关键字");
            return;
        }
        //执行一次下拉刷新即可，在下拉刷新回调中，会进行页面渲染
        // 调用pulldownLoading执行下拉刷新
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
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
    //mui认为在下拉刷新和上拉加载容器中，使用click会有300ms延迟的话，性能方面不足，
    // 禁用了默认的a标签的click事件，需要通过tap事件绑定
    $('.lt_sort a[data-type]').on("tap",function () {
        if($(this).hasClass("current")){
            //有current类，切换箭头方向即可
            $(this).find("i").toggleClass("fa-angle-up").toggleClass("fa-angle-down");
        }else{
            //有current类，给自己加上current类，并且移除兄弟元素的current类
            $(this).addClass("current").siblings().removeClass("current");
        }
        //页面重新渲染即可，因为所有的参数都在render中实时获取处理好了
        //要重新渲染，只需要调用render
        //执行一次下拉刷新即可，在下拉刷新回调中，会进行页面渲染
        // 调用pulldownLoading执行下拉刷新
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
    });
    //功能4：点击每个商品实现页面跳转，注册点击事件，通过事件委托注册，注册tap事件
    $('.lt_product').on("tap","a",function () {
        var id = $(this).data("id");
        location.href = "product.html?productId="+id;
    })
});