$(function () {
    var currentPage =1;//当前页
    var pageSize = 5;//每页条数
    //定义 用来存储已上传图片 的数组
    var picArr = [];

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
        $('#form').data("bootstrapValidator").updateStatus("brandId","VALID");
    });
    //4.利用文件上传插件进行文件上传初始化
    /*
   * 文件上传思路整理    多文件上传时，插件会遍历选中的图片，发送多次请求到服务器，将来响应多次，
   * 每次响应都会调用一次done方法。
   * 1.引包，2.准备结构，指定name将来后台用于接收文件，指定data-url，指定后台接口地址， multiple 多文件上传配置
   * 3.进行文件上传初始化，配置done回调函数
   * */
    $('#fileupload').fileupload({
        //返回的数据格式
        dataType:"json",
        //图片上传完成后会调用done回调函数
        done:function (e,data) {
            //data.result是后台响应的内容
            // console.log(data.result);
            //往数组的最前面追加图片对象
            picArr.unshift(data.result);
            //往imgBox最前面追加img元素
            $('#imgBox').prepend('<img src="'+data.result.picAddr+'" width="100" alt="">');
            //通过判断数组长度,如果数组长度大于3，将数组最后一项移除
            if(picArr.length > 3){
                //移除数组的最后一项
                picArr.pop();
                //移除imgBox中的最后一个图片
                // $('#imgBox img').eq(-1)
                $('#imgBox img:last-of-type').remove();
            }
            //如果处理后，图片数组的长度为3，那么就通过校验，手动将picstatus置成VALID
            if (picArr.length === 3) {
                // //手动重置隐藏域的校验状态
                $('#form').data("bootstrapValidator").updateStatus("picStatus","VALID");
            }
            console.log(picArr);

        }
    });
    //5.进行表单校验初始化
    $('#form').bootstrapValidator({
        //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        // 我们需要对隐藏域进行校验，所以不需要将隐藏域排除到校验范围外
        //重置排除项
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
            brandId:{
                validators:{
                    notEmpty:{
                        message:"请选择二级分类"
                    }
                }
            },
            proName:{
                validators:{
                    notEmpty:{
                        message:"请输入商品名称"
                    }
                }
            },
            proDesc:{
                validators:{
                    notEmpty:{
                        message:"请输入商品描述"
                    }
                }
            },
            //除了非空校验以外，要求必须是非零开头的数字
            num:{
                validators:{
                    notEmpty:{
                        message:"请输入商品库存"
                    },
                    //正则校验
                    regexp:{
                        regexp:/^[1-9]\d*$/,
                        message:'当前库存必须是非零开头的数字'
                    }
                }
            },
            //尺码，必须是xx-xx的格式，x为数字
            size:{
                validators:{
                    notEmpty:{
                        message:"请输入商品尺码"
                    },
                    //正则校验
                    regexp:{
                        regexp:/^\d{2}-\d{2}$/,
                        message:'尺码必须是xx-xx的格式，例如：32-40'
                    }
                }
            },
            oldPrice:{
                validators:{
                    notEmpty:{
                        message:"请输入商品原价"
                    }
                }
            },
            price:{
                validators:{
                    notEmpty:{
                        message:"请输入商品现价"
                    }
                }
            },

            picStatus:{
                validators:{
                    notEmpty:{
                        message:"请上传3张图片"
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
        //获取的是表单元素的数据
        var paramsStr = $('#form').serialize();
        //还需要拼接上图片的数据
        paramsStr += "&picName1="+picArr[0].picName+"&picAddr1="+picArr[0].picAddr;
        paramsStr += "&picName2="+picArr[1].picName+"&picAddr2="+picArr[1].picAddr;
        paramsStr += "&picName3="+picArr[2].picName+"&picAddr3="+picArr[2].picAddr;
        console.log(paramsStr);
        //通过ajax进行提交
        $.ajax({
            type:"post",
            url:"/product/addProduct",
            data:paramsStr,
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
                    //3.重置模态框的表单，不仅校验状态要重置，文本内容也很重要
                    $('#form').data("bootstrapValidator").resetForm(true);
                    //4.手动重置文本内容，(非表单元素)下拉列表和图片
                    $('#dropdownText').text("请选择二级分类");
                    $('#imgBox img').remove();
                }
            }
        });
    });
});