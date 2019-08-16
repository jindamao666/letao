$(function () {
    //一进入页面，发送ajax请求获取用户列表数据，通过模版引擎渲染
    $.ajax({
        type:"get",
        url:"/user/queryUser",
        data:{
            page:1,
            pageSize:5
        },
        dataType:"json",
        success:function (info) {
            console.log(info);
            //template(模版id，数据对象)
            //在模版中可以任意使用数据对象中的属性
            var htmlStr = template('tpl',info);
            $('tbody').html(htmlStr);
        }
    })
})