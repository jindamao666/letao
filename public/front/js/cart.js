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
        });
        //4.编辑功能
    $('.lt_main').on("tap",".btn_edit",function () {
        //html5里面有一个dedaset可以一次性获取所有的自定义属性
        var obj = this.dataset;
        var id = obj.id;
        console.log(obj);
        //生成htmlstr
        var htmlStr = template("editTpl",obj);
        //mui将模版中的\n换行标记，解析成<br>标签，就换行了，需要将模版中所有的\n去掉
        htmlStr = htmlStr.replace(/\n/g,"");
        //弹出确认框,确认框的内容，支持传递html模版
        mui.confirm(htmlStr,"编辑商品",["确认","取消"],function (e) {
            if(e.index === 0){
                //你点击的是确认按钮，进行获取id，尺码，数量进行ajax提交
                var size = $('.lt_size span.current').text();
                var num = $('.mui-numbox-input').val();
                $.ajax({
                    type:"post",
                    url:"/cart/updateCart",
                    data:{
                        id:id,
                        size:size,
                        num:num
                    },
                    dataType:"json",
                    success:function (info) {
                        console.log(info);
                        if(info.success){
                            //下拉刷新一次即可
                            mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
                        }
                    }
                });

            }
        });
        //进行数字框初始化
        mui('.mui-numbox').numbox();
    });
    //5.让尺码可以被选
    $('body').on("click",".lt_size span",function () {
        $(this).addClass("current").siblings().removeClass("current");
    })
});