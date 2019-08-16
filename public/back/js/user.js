$(function () {
    var currentPage = 1;//当前页
    var pageSize = 5;//每页多少条
    var currentId;//当前选中的用户id
    var isDelete;
    //1.一进入页面，发送ajax请求获取用户列表数据，通过模版引擎渲染
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
    //2.点击启用禁用按钮，显示模态框，通过事件委托绑定事件
    $('tbody').on("click",".btn",function () {
        //显示模态框
        $('#userModal').modal("show");
        //获取用户id,jquery 中提供了获取自定义属性的方法，data（）
        currentId = $(this).parent().data("id");
        //如果是禁用按钮，说明需要将该用户置成禁用状态，传0  1表示启用 ，0表示禁用，传给后台几，后台就设置该用户状态为几
        isDelete = $(this).hasClass("btn-danger") ? 0 : 1 ;
    });
    //3.点击确认按钮，发送ajax请求修改对应用户状态，需要两个参数（用户id，isDelete用户改成的状态)
    $('#submitBtn').click(function () {
        console.log(currentId);
        console.log(isDelete);
        $.ajax({
            type:"post",
            url:"/user/updateUser",
            data:{
                id:currentId,
                isDelete:isDelete
            },
            dataType: "json",
            success:function (info) {
                console.log(info);
                if(info.success){
                    //1.关闭模态框
                    $('#userModal').modal("hide");
                    //2.页面重新渲染
                    render();
                }

            }
        })

    })
});