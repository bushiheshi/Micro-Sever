<template>
<div class="container" id="app">
    <div class="forms-container">
    <div class="signin-signup">
        <el-form
        ref="loginRef"
        :model="loginForm"
        :rules="loginRules"
        class="sign-in-form"
        >
        <h2 class="title">登录</h2>
        <div class="input-field">
            <i class="fa-solid fa-user"></i>
            <el-form-item prop="mail">
            <el-input
                v-model="loginForm.mail"
                placeholder="邮箱"
                @keyup.enter="Login(loginForm)"
            />
            </el-form-item>
        </div>
        <div class="input-field">
            <i class="fa-solid fa-lock"></i>
            <el-form-item prop="password">
            <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="密码"
                autocomplete="off"
                show-password
                @keyup.enter="Login(loginForm)"
            />
            </el-form-item>
        </div>
        <el-button
            type="primary"
            :loading="loginLoading"
            @click="Login(loginForm)"
            class="btn form"
            round
        >
            {{loginLoading ? '登 录 中' : '登 录'}}
        </el-button>
        </el-form>
        <el-form
        ref="signUpRef"
        :model="signUpForm"
        :rules="signUpRules"
        class="sign-up-form"
        >
        <h2 class="title">注册</h2>
        <div class="input-field">
            <i class="fa-solid fa-inbox"></i>
            <el-form-item prop="mail">
            <el-input v-model="signUpForm.mail" placeholder="邮箱" />
            </el-form-item>
        </div>
        <div class="input-field">
            <i class="fa-solid fa-check"></i>
            <el-form-item prop="inputVerificationCode">
            <el-input v-model="signUpForm.inputVerificationCode" placeholder="验证码" />
            </el-form-item>
        </div>
        <el-button type="Success" :loading="sendloading" @click="SendMail" class="btn form" round>
            {{sendloading ? "已发送" : "发送验证码"}}
        </el-button>
        <div class="input-field">
            <i class="fa-solid fa-user"></i>
            <el-form-item prop="name">
            <el-input v-model="signUpForm.name" placeholder="姓名" />
            </el-form-item>
        </div>
        <div class="input-field">
            <i class="fa-solid fa-address-card"></i>
            <el-form-item prop="id">
            <el-input v-model="signUpForm.id" placeholder="身份证号" />
            </el-form-item>
        </div>
        <div class="input-field">
            <i class="fa-solid fa-lock"></i>
            <el-form-item prop="password">
            <el-input
                v-model="signUpForm.password"
                type="password"
                placeholder="密码"
                autocomplete="off"
                show-password
            />
            </el-form-item>
        </div>
        <div class="input-field">
            <i class="fa-solid fa-lock"></i>
            <el-form-item prop="confirmPassword">
            <el-input
                v-model="signUpForm.confirmPassword"
                type="password"
                placeholder="确认密码"
                autocomplete="off"
                show-password
            />
            </el-form-item>
        </div>
        <el-button
            type="primary"
            :loading="signUploading"
            @click="VerifyCode(signUpForm)"
            class="btn form"
            round
        >
            {{signUploading ? '注 册 中' : '注 册'}}
        </el-button>
        <div v-if="isPopupVisible" class="popup">
            <div class="input-field">
            <p>已发送验证码至您的邮箱，请输入验证码</p>
            
            <el-input v-model="inputVerificationCode" placeholder="验证码"></el-input>
            </div>
            <button @click="VerifyCode">验证</button>
        </div>
        </el-form>
    </div>
    </div>

    <div class="panels-container">
    <div class="panel left-panel">
        <div class="content">
        <h3>新用户 ?</h3>
        <p>输入您的信息成为我们的客户</p>
        <button class="btn transparent" id="sign-up-btn">注 册</button>
        </div>
        
    </div>
    <div class="panel right-panel">
        <div class="content">
        <h3>已有账号 ?</h3>
        <p>请登录以享受我们更多的服务</p>
        <button class="btn transparent" id="sign-in-btn">登 录</button>
        </div>
        
    </div>
    </div>
</div>
</template>

<style>
      .el-button.is-round {
        border-radius: 49px;
      }

      .el-form-item {
        margin-bottom: 0;
      }

      .el-form-item.is-error .el-input__inner,
      .el-form-item.is-error .el-input__inner:focus,
      .el-form-item.is-error .el-select-v2__wrapper,
      .el-form-item.is-error .el-select-v2__wrapper:focus,
      .el-form-item.is-error .el-textarea__inner,
      .el-form-item.is-error .el-textarea__inner:focus {
        box-shadow: none;
      }

      .el-input {
        align-items: center;
        margin-right: 8px;
      }

      .el-input .el-input__icon {
        font-size: 1.4em;
      }
</style>
<style src='../../../static/css/fontawesome-all.min.css' scoped></style>
<style src='../../../static/css/style.css' scoped></style>

<<script>
import {ref,onBeforeMount,onMounted} from 'vue';
import axios  from 'axios';
import {ElMessage} from 'element-plus';
import router from '@/router';

export default {
    setup() {
        const loginLoading = ref(false);
        const signUploading = ref(false);
        const sendloading = ref(false);
        const isPopupVisible = ref(false);

        const loginRef = ref(null);
        const signUpRef = ref(null);

        const loginForm = ref({
        mail: "",
        password: "",
        });

        const signUpForm = ref({
        name:"",
        mail: "",
        inputVerificationCode: "",
        id: "",
        password: "",
        confirmPassword: "",
        });

        const loginRules = {
        mail: [
            {
            required: true,
            message: "请输入邮箱",
            type: "string",
            trigger: "blur",
            },
        ],
        password: [
            {
            required: true,
            message: "请输入密码",
            type: "string",
            trigger: "blur",
            },
        ],
        };

        const signUpRules = {
        name: [
            {
            required: true,
            message: "请输入姓名",
            type: "string",
            trigger: "blur",
            }
        ],
        mail: [
            {
            required: true,
            message: "请输入邮箱",
            type: "string",
            trigger: "blur",
            },
        ],
        inputVerificationCode: [
            {
            required: true,
            message: "请输入验证码",
            type: "string",
            trigger: "blur",
            },
        ],
        id: [
            {
            required: true,
            pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: "请输入正确身份证号",
            type: "string",
            trigger: "blur",
            },
        ],
        password: [
            {
            required: true,
            message: "请输入密码",
            type: "string",
            trigger: "blur",
            },
        ],
        confirmPassword: [
            {
            validator: (rule, value, callback) => {
                if (value === "") {
                callback(new Error("请再次输入密码"));
                } else if (value !== signUpForm.value.password) {
                callback(new Error("两次输入密码不一致!"));
                } else {
                callback();
                }
            },
            type: "string",
            trigger: "blur",
            },
        ],
        };

        onBeforeMount(() => {
        loginLoading.value = false;
        signUploading.value = false;
        const data = localStorage.getItem('microData');
        if (data != null){
            router.push('/login');
        }
        });

        onMounted(() => {
        const sign_in_btn = document.querySelector("#sign-in-btn");
        const sign_up_btn = document.querySelector("#sign-up-btn");
        const container = document.querySelector(".container")

        sign_in_btn.addEventListener("click", () => {
            container.classList.remove("sign-up-mode");
        });

        sign_up_btn.addEventListener("click", () => {
            container.classList.add("sign-up-mode");
        });
        });

        const Login = (formData) => {
        const loginApi = "http://121.40.197.3:10010/patient/login"
        loginRef.value.validate((valid) => {
            if (valid) {
            loginLoading.value = true;
            // TODO: axios 登录请求
            const params = {
                "email":loginForm.value.mail,
                "password":loginForm.value.password
            };
            axios.post(loginApi,params)
                .then(response => {
                // TODO：成功登录
                if(response.status == 200){
                    console.log("成功登录");
                    // 保存已登录信息
                    localStorage.setItem('microData',response.data);
                    setTimeout(() => {
                        ElMessage.success("成功登录");
                        loginLoading.value = false;
                    }, 500);
                    // 跳转主页
                    router.push('/login');
                    location.reload();
                }
                })
                .catch(
                    error => {
                        console.log("登录失败");
                        alert("邮箱或密码错误，请重试");
                        loginForm.value.mail = "";
                        loginForm.value.password = "";
                        loginLoading.value = false;
                    }
                );
                
            }
        });
        };

        
        const SendMail = () => {
        const mail = signUpForm.value.mail;
        if (mail == "" || mail == undefined){
            return
        }
        //生成验证码邮件
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        const apiUrl = "https://luckycola.com.cn/tools/customMail";
        
        const params = {
            "ColaKey": "sIli8jFmLa4jiO1732159217503LlGsusmJsx",// 官网获取
            "tomail": mail,// 邮件发给谁?
            "fromTitle": "医院注册验证",// 邮件标题
            "subject": "医院的邮箱验证码",
            "smtpCode": "ujiqonjgtssiddjb",
            "smtpEmail": "3042620284@qq.com",
            "smtpCodeType": "qq",
            "isTextContent": false,// 邮件内容是否是纯文本形式
            "content": `<div style='color: black'>您的邮箱验证码是<div style='color: red'>${verificationCode}</div><br>若不是本人操作，请忽视</div>`,// 邮件内容
        }
        // 调用api
        axios.post(apiUrl,params)
        sendloading.value = true;

        //存储验证码
        localStorage.setItem(mail, String(verificationCode));
        // 设定定时器，在3分钟后删除 localStorage 中的数据
        setTimeout(() => {
            localStorage.removeItem(mail);
            sendloading.value = false;
        }, 1000*60*3); // 3分钟有效
        };

        const VerifyCode = (formData) => {
        //查找localstore
        const mail = signUpForm.value.mail;
        const verCode = localStorage.getItem(mail);

        if (verCode) {
            console.log("已获取"+verCode)
        
            if (signUpForm.value.inputVerificationCode == verCode){
            //TODO:完成注册
            signUpRef.value.validate((valid) => {
                if (valid) {
                signUploading.value = true;
                // TODO: axios 注册请求
                const signUpApi = "http://121.40.197.3:10010/patient/createPatient";
                const getPatientIdApi = "http://121.40.197.3:10010/patient/getPatientIds";
                let patientId;
                //计算当前注册患者的id
                axios.get(getPatientIdApi)
                    .then(response => {
                    const ids = response.data;
                    patientId = Math.max(...ids) + 1;
                    })
                //参数
                const params = {
                    "patientId": patientId,
                    "email": mail,
                    "password": signUpForm.value.password,
                    "IDCardWord": signUpForm.value.id,
                    "name": signUpForm.value.name,
                    "gender": parseInt(signUpForm.value.id.charAt(16),10) % 2,
                };
                axios.post(signUpApi,params)

                setTimeout(() => {
                    console.log("验证码"+verCode)
                    ElMessage.success("注册成功");
                    signUpRef.value.resetFields();
                    document.getElementById("sign-in-btn").click();
                }, 500);
                signUploading.value = false;
                }
                else{
                alert("注册失败")
                }
            });
            signUploading.value = false;
            }
            else{
            alert("验证码错误")
            console.log("输入的验证码："+signUpForm.value.inputVerificationCode+"保存的验证码："+verificationCode)
            }
        }
        };

        const SignUp = (formData) => {
        signUpRef.value.validate((valid) => {
            if (valid) {
            signUploading.value = true;
            // TODO: axios 注册请求
            setTimeout(() => {
                ElMessage.success("注册成功");
                signUpRef.value.resetFields();
                document.getElementById("sign-in-btn").click();
            }, 500);
            }
        });
        signUploading.value = false;
        };
        return {
        loginLoading,
        signUploading,
        sendloading,
        loginRef,
        signUpRef,
        loginForm,
        signUpForm,
        loginRules,
        signUpRules,
        onMounted,
        isPopupVisible,
        Login,
        SignUp,
        SendMail,
        VerifyCode
        };
    }
}
</script>