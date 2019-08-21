$(function () {
    //1.一进入页面，请求当前用户数据，进行页面渲染，
    // 用户已登录，后台返回用户数据，通过模版渲染，用户未登录，后台返回error，当前用户未登录
    $.ajax({
        type:"get",
        url:"/user/queryUserMessage",
        dataType:"json",
        success:function (info) {
            console.log(info);
            if(info.error===400){
                // 用户未登录，后台返回error，当前用户未登录
                location.href = "login.html";
            }
            //用户已登录，后台返回用户数据，通过模版渲染，
            var htmlStr = template("userTpl",info);
            $('#userInfo').html(htmlStr);
        }
    });
    //2.退出功能
    $('.logoutBtn').click(function () {
        //发送请求，进行退出操作即可
        $.ajax({
            type: "get",
            url:"/user/logout",
            dataType: "json",
            success:function (info) {
                console.log(info);
                //退出成功，跳转到登录页
                location.href = "login.html";
            }
        })
    })

});