$(function () {
    var currentPage =1;//当前页
    var pageSize = 5;//每页条数
    //1.已进入页面发送ajax请求，获取数据，通过模版引擎渲染
    render();
    function render() {
        $.ajax({
            type:"get",
            url:"/category/querySecondCategoryPaging",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            dataType:"json",
            success:function (info) {
                console.log(info);
                //结合模版引擎渲染
                var htmlStr = template("tpl",info);
                $('tbody').html(htmlStr);
                //进行分页初始化
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    //总页数
                    totalPages:Math.ceil(info.total/info.size),
                    //当前页
                    currentPage:info.page,
                    //添加页码点击事件
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
        //发送ajax请求，获取一级分类全部数据，通过模版引擎渲染
        //通过，page=1，pagesize=100，模拟获取全部分类数据的接口
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                page:1,
                pageSize:100
            },
            dataType:"json",
            success:function (info) {
                console.log(info);
                //结合模版引擎渲染
                var htmlStr = template("dropdownTpl",info);
                $('.dropdown-menu').html(htmlStr);
            }

        })
    });
    //3.通过事件委托，给dropdown-menu下的所有a绑定点击事件
    $('.dropdown-menu').on("click","a",function () {
        //获取a的文本
        var txt = $(this).text();
        //设置给dropdownText
        $('#dropdownText').text(txt);
        //获取选中的id
        var id = $(this).data("id");
        //设置给input框
        $('[name="categoryId"]').val(id);
        //将隐藏域校验状态，设置成校验成功状态
        $('#form').data("bootstrapValidator").updateStatus("categoryId","VALID");
    });
    //4.利用文件上传插件进行文件上传初始化
    /*
   * 文件上传思路整理
   * 1.引包
   * 2.准备结构，name data-url
   * 3.进行文件上传初始化，配置done回调函数
   * */
    $('#fileupload').fileupload({
        dataType:"json",
        //图片上传完成后会调用done回调函数
        done:function (e,data) {
            // console.log(data.result.picAddr)
            //获取上传得到的图片地址
            var imgUrl = data.result.picAddr;
            //赋值给img
            $('#imgBox img').attr("src",imgUrl);
            //将图片地址，设置给input
            $('[name="brandLogo"]').val(imgUrl);
            //手动重置隐藏域的校验状态
            $('#form').data("bootstrapValidator").updateStatus("brandLogo","VALID");
        }
    });
   //5.进行表单校验初始化
    $('#form').bootstrapValidator({
        //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        // 我们需要对隐藏域进行校验，所以不需要将隐藏域排除到校验范围外
        excluded: [],
        //配置校验图标
        // 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',//校验成功
            invalid: 'glyphicon glyphicon-remove',//校验失败
            validating: 'glyphicon glyphicon-refresh'//校验中
        },
        fields:{
            //categoryId   一级分类id
            //brandName    二级分类名称
            //brandLogo    图片地址
            categoryId:{
                validators:{
                    notEmpty:{
                        message:"请选择一级分类"
                    }
                }
            },
            brandName:{
                validators:{
                    notEmpty:{
                        message:"请输入二级分类名称"
                    }
                }
            },
            brandLogo:{
                validators:{
                    notEmpty:{
                        message:"请选择图片"
                    }
                }
            },
        }
    });
    //6.注册表单校验成功事件,阻止默认的表单提交,通过ajax进行提交,关闭模态框,页面重新渲染第一页，让用户看到第一页的数据,
    //重置模态框
    $("#form").on('success.form.bv',function (e) {
        //阻止默认的表单提交
        e.preventDefault();
        // console.log("校验成功后的表单提交被阻止了");
        //通过ajax进行提交
        $.ajax({
            type:"post",
            url:"/category/addSecondCategory",
            //获取表单元素的数据
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
                    //3.重置模态框的表单，不仅校验状态要重置，文本内容也很终重要
                    $('#form').data("bootstrapValidator").resetForm(true);
                    //4.手动重置文本内容，(非表单元素),和图片
                    $('#dropdownText').text("请选择一级分类");
                    $('#imgBox img').attr("src","images/none.png");
                }
            }
        })
    });

});