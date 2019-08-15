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
                    }
                }
            }
        }
    });
});