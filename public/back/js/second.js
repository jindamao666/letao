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

    });
    //4.利用文件上传插件进行文件上传初始化
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
        }
    });
    /*
    * 文件上传思路整理
    * 1.引包
    * 2.准备结构，name data-url
    * 3.进行文件上传初始化，配置done回调函数
    * */

});