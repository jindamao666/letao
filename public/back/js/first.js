$(function () {
    var currentPage = 1;//当前页
    var pageSize = 5;//每页条数
//1.一进入页面，发送ajax请求获取数据，通过模版引擎渲染
    render();
    function render() {
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            dataType:"json",
            success:function (info) {
                console.log(info);
                //将数据和模版相结合，进行页面渲染
                var htmlStr = template("tpl",info);
                $('tbody').html(htmlStr);
                //进行分页初始化
                $('#paginator').bootstrapPaginator({
                    //指定bootstrap版本
                    bootstrapMajorVersion:3,
                    //总页数
                    totalPages:Math.ceil(info.total/info.size),
                    //当前第几页
                    currentPage:info.page,
                    //注册按钮点击事件
                    onPageClicked:function (a,b,c,page) {
                        //更新当前页
                        currentPage = page;
                        //重新渲染
                        render();

                    }
                })
            }
        })
    };
//2.点击添加分类按钮，显示模态框
    $('#addBtn').click(function () {
        $('#addModal').modal("show");
    });
//3.使用表单校验插件，实现表单校验
    $('#form').bootstrapValidator({
        //配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',//校验成功
            invalid: 'glyphicon glyphicon-remove',//校验失败
            validating: 'glyphicon glyphicon-refresh'//校验中
        },
        //配置字段
        fields:{
            categoryName:{
                // 配置校验规则
                validators:{
                    //非空
                    notEmpty:{
                        //提示信息
                        message:"一级分类不能为空"
                    }
                }
            }
        }
    });
/* 4.表单校验插件会在提交表单时进行校验
    * （1） 校验成功 默认就提交表单，会发生页面跳转 ，注册表单校验成功事件，阻止默认的提交，通过ajax进行发送请求
    * （2） 校验失败 ，不会提交表单，按照插件提示用户即可
    * */
    //注册表单校验成功事件
    $("#form").on('success.form.bv',function (e) {
        //阻止默认的表单提交
        e.preventDefault();
        // console.log("校验成功后的表单提交被阻止了");
        //通过ajax进行提交
        $.ajax({
            type:"post",
            url:"/category/addTopCategory",
            data:$('#form').serialize(),
            dataType:"json",
            success:function ( info ) {
                console.log( info );
                if(info.success){
                    //添加成功
                    // 1.关闭模态框
                    $('#addModal').modal("hide");
                    //2.页面重新渲染第一页，让用户看到第一页的数据
                    currentPage = 1;
                    render();
                    //重置模态框
                    $('#form').data("bootstrapValidator").resetForm(true);
                }
            }
        })
    });
})
