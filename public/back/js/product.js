$(function () {
    var currentPage =1;//当前页
    var pageSize = 5;//每页条数
    //1.一进入页面，请求商品数据，进行页面渲染
    render();
    function render() {
        //发送请求渲染
        $.ajax({
            type:"get",
            url:"/product/queryProductDetailList",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            dataType:"json",
            success:function (info) {
                console.log(info);
                //结合模版引擎渲染
                var htmlStr = template("productTpl",info);
                $('.lt_content tbody').html(htmlStr);
                //进行分页初始化
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    //总页数
                    totalPages:Math.ceil(info.total/info.size),
                    //当前页
                    currentPage:info.page,
                    //配置按钮大小
                    size:"normal",
                    //配置按钮文本
                    //每个按钮在初始化的时候，都会调用一次这个函数，通过返回值进行设置文本
                    //type 标记当前按钮的类型，取值：page first last prev next
                    //page 指当前这个按钮所指向的页码
                    //current 表示当前页
                    itemTexts:function(type,page,current){
                    switch (type) {
                        case"page":
                            return page;
                        case "first":
                            return "首页";
                        case "last":
                            return "尾页";
                        case "prev":
                            return "上一页";
                        case "next":
                            return "下一页";
                    }
                    },
                    //配置title提示信息
                    //每个按钮在初始化的时候，都会调用一次这个函数，通过返回值进行设置title文本

                    tooltipTitles:function(type,page,current){
                        switch (type) {
                            case"page":
                                return "前往第"+page+"页";
                            case "first":
                                return "首页";
                            case "last":
                                return "尾页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                        }
                    },
                    //使用bootstrap 的提示框
                    useBootstrapTooltip:true,
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
    //2.点击添加商品按钮，显示添加模态框
    $('#addBtn').click(function () {
        $('#addModal').modal("show");
        //发送ajax请求，获取二级分类全部数据，通过模版引擎渲染
        //通过，page=1，pagesize=100，模拟获取全部分类数据的接口
        $.ajax({
            type:"get",
            url:"/category/querySecondCategoryPaging",
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
        //获取选中的id 给隐藏域
        var id = $(this).data("id");
        //设置给隐藏域input框
        $('[name="brandId"]').val(id);
        //将隐藏域校验状态，设置成校验成功状态
        // $('#form').data("bootstrapValidator").updateStatus("categoryId","VALID");
    });
});