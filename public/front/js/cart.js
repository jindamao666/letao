$(function () {
    //1.一进入页面，发送ajax请求，获取购物车数据，
    // 用户未登录，后台返回error，拦截到登录页，
    // 用户已登录，后台返回购物车数据，进行页面渲染
    function render(){
        setTimeout(function () {
            $.ajax({
                type:"get",
                url:"/cart/queryCart",
                dataType:"json",
                success:function (info) {
                    console.log(info);
                    //用户未登录，后台返回error，拦截到登录页，
                    if (info.error === 400){
                        location.href = "login.html";
                    }
                    //用户已登录，后台返回购物车数据，进行页面渲染
                    //注意：拿到的是数组，template方法参数2要求是一个对象，需要包装
                    var htmlStr = template("cartTpl",{arr:info});
                    $('.lt_main .mui-table-view').html(htmlStr);
                    mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
                }
            });
        },500);

    }

    //2.配置下拉刷新
    mui.init({
        pullRefresh : {
            container:".mui-scroll-wrapper",//下拉刷新容器标识，
            down : {
                auto:true,//一进入页面就下拉刷新一次
                callback :function(){
                    console.log("下拉刷新了");
                    render();
                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            }
        }
    });
    //3.删除功能，
    // （1）给删除按钮注册点击事件，事件委托，通过tap进行注册点击事件，
    // （2）获取在按钮中存储的id，
    // （3）发送ajax请求，执行删除操作
    // （4）页面重新渲染
        $('.lt_main').on("tap",".btn_del",function () {
            var id = $(this).data("id");
            $.ajax({
                type:"get",
                url:"/cart/deleteCart",
                //后台要求传的id是一个数组格式
                data:{
                    id:[id]
                },
                dataType: "json",
                success:function (info) {
                    console.log(info);
                    //删除成功，调用一次下拉刷新
                    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
                }
            })
        })
});