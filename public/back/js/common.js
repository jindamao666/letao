
//实现在第一个ajax发送的时候，开启进度条
//在所有的ajax请求都完成的时候，结束进度条

//ajax全局事件
//ajaxComolete  当每个ajax完成的时候，调用（不管成功还是失败都调用）
//ajaxError    当ajax请求失败的时候，调用
//ajaxSuccess  当ajax请求成功的时候，调用
//ajaxSend     在每个ajax请求发送前，调用
//ajaxStart   在第一个ajax发送时，调用
//ajaxStop    在所有的ajax请求完成时，调用

//ajaxStart   在第一个ajax发送时，调用
$(document).ajaxStart(function () {
//开启进度条
    NProgress.start();
});
//ajaxStop    在所有的ajax请求完成时，调用
$(document).ajaxStop(function () {
    setTimeout(function () {
        //结束进度条
        NProgress.done();
    },500);
});

//登录拦截功能,登录页面不需要校验，不用登录就能访问
//1.前后分离了，前端是不知道该用户是否登录了，但是后台知道，发送ajax请求，查询用户状态即可
//（1）用户已经登录，啥都不用做，让用户继续访问
//（2）用户未登录，拦截到登录页
if(location.href.indexOf("login.html") === -1){
    //地址栏中没有login.html，说明不是登录页，需要进行登录拦截
    $.ajax({
        type: "get",
        url: "/employee/checkRootLogin",
        dataType: "json",
        success:function (info) {
            console.log(info);
            if(info.success){
                //已登录 ,让用户继续访问
                console.log("用户已登录");
            }
            if(info.error === 400){
                //用户未登录，拦截到登录页
                location.href = "login.html";
            }
        }
    })
}


$(function () {
    //1.分类管理的切换功能
    $('.nav .category').click(function () {
        //切换child的显示隐藏
        $('.nav .child').slideToggle();
    });
    //2.左侧侧边栏切换功能
    $('.icon_menu').click(function () {
        $('.lt_aside').toggleClass("hidemenu");
        $('.lt_main').toggleClass("hidemenu");
        $('.lt_topbar').toggleClass("hidemenu");
    });
    //3.点击topbar退出按钮，弹出一个模态框
    $('.icon_logout').click(function() {
        // 让模态框显示
        $('#logoutModal').modal("show");
    });
    //4.点击模态框的退出按钮
    $('#logoutBtn').click(function () {
        //发送ajax请求，进行退出
        $.ajax({
            type:"get",
            url:"/employee/employeeLogout",
            dataType:"json",
            success:function (info) {
                console.log(info);
                if(info.success){
                    //退出成功,跳转到登录页
                    location.href = "login.html";

                }
            }
        })
    })
});