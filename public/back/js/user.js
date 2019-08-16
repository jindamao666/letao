$(function () {
    var currentPage = 1;
    var pageSize = 5;
    //一进入页面，发送ajax请求获取用户列表数据，通过模版引擎渲染
    render();
function render() {
    $.ajax({
        type:"get",
        url:"/user/queryUser",
        data:{
            page:currentPage,
            pageSize:pageSize
        },
        dataType:"json",
        success:function (info) {
            console.log(info);
            //template(模版id，数据对象)
            //在模版中可以任意使用数据对象中的属性
            var htmlStr = template('tpl',info);
            $('tbody').html(htmlStr);

            //分页初始化
            $('#paginator').bootstrapPaginator({
                //配置bootstrap版本
                bootstrapMajorVersion:3,
                //指定总页数
                totalPages:Math.ceil(info.total/info.size),
                //当前页
                currentPage:info.page,
                //当页码被点击时调用的回调函数
                onPageClicked:function (a,b,c,page) {
                    //通过page获取点击的页码
                    //更新当前页
                    currentPage = page;
                    //重新渲染
                    render();
                }
            });
        }
    });
}

});