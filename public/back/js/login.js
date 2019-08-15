$(function () {
    // 1. 进行表单校验
    //    校验要求: (1) 用户名不能为空
    //              (2) 密码不能为空, 且必须是 6-12 位

    //配置的字段和input框中指定的name关联，所以必须要给input加上name
    $("#form").bootstrapValidator({
        //配置校验图标
        // 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',//校验成功
            invalid: 'glyphicon glyphicon-remove',//校验失败
            validating: 'glyphicon glyphicon-refresh'//校验中
        },
        //配置字段
        fields:{
            username:{
            // 配置校验规则
                validators:{
                    //非空
                    notEmpty:{
                        //提示信息
                        message:"用户名不能为空"
                    },
                    //长度校验
                    stringLength: {
                        min: 2,
                        max: 6,
                        message: '用户名长度必须在2到6之间'
                    },
                    //专门用于配置回调提示的规则
                    callback:{
                        message:'用户名不存在'
                    }
                }
            },
            password:{
                validators:{
                    //非空
                    notEmpty:{
                        //提示信息
                        message:"密码不能为空"
                    },
                    //长度校验
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: '用户名长度必须在6到12之间'
                    },
                    //专门用于配置回调提示的规则
                    callback:{
                        message:'密码错误'
                    }
                }
            }
        }
    });
    /*2.登录功能
    * 表单校验插件会在提交表单时进行校验
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
            url:"/employee/employeeLogin",
            data:$('#form').serialize(),
            dataType:"json",
            success:function ( info ) {
                console.log( info );
                if( info.success ){
                    //登录成功，跳转到首页
                    location.href = "index.html"
                }
                if( info.error === 1000 ){
                    // alert("当前用户名不存在");
                    //updateStatus  更新校验状态
                    //1.字段名称
                    //2.校验状态
                    // + NOT_VALIDATED：未校验的
                    // + VALIDATING：校验中的
                    // + INVALID ：校验失败的
                    // + VALID：校验成功的。
                    //3.校验规则，用于指定提示文本
                    $('#form').data("bootstrapValidator").updateStatus("username","INVALID","callback");
                }
                if( info.error === 1001 ){
                    // alert("密码错误");
                    $('#form').data("bootstrapValidator").updateStatus("password","INVALID","callback");
                }
            }
        })
    });

    //重置功能
    $('[type="reset"]').click(function () {
        //调用插件的方法，进行重置校验状态
        //传true，重置内容以及校验状态
        //传false，重置校验状态
        $('#form').data("bootstrapValidator").resetForm(true);
    });
});