$(function () {
    //1.一进入页面发送ajax请求，获取一级分类数据，进行渲染
    $.ajax({
        type:"get",
        url:"/category/queryTopCategory",
        dataType:"json",
        success:function (info) {
            console.log(info)
            var htmlStr = template("leftTpl",info);
            $('.lt_category_left ul').html(htmlStr);
            //一进入页面，渲染第一个一级分类所对应的二级分类
            renderSecondById(info.rows[0].id);
        }
    });
    //实现一个方法：专门用于根据一级分类id去渲染二级分类
    //2.点击一级分类，渲染二级分类
    $('.lt_category_left').on("click","a",function () {
        //给自己加上current，移除其他的current
        $(this).addClass("current").parent().siblings().find("a").removeClass("current");
        //获取id，通过id进行二级分类渲染
        var id = $(this).data("id");
        renderSecondById(id);
    });
    function renderSecondById(id) {
        //发送ajax请求
        $.ajax({
            type: "get",
            url: "/category/querySecondCategory",
            data:{
                id:id
            },
            dataType: "json",
            success:function (info) {
                console.log(info);
                var htmlStr = template("rightTpl",info);
                $('.lt_category_right ul').html(htmlStr);
            }
        })
    }
});