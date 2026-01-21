import api from "../../constants/api";
import { 
    CREATE_USER, 
    RESEND_OTP, 
    VERIFY_EMAIL,
    LOGIN,
    FORGET_PASS,
    RESET_PASS

} from "../../constants/Paths";
import ToastMessage from "../../constants/ToastMessage";


export const reset_password = async (payload,token, cb) => {
    try{
        const res = await api.post(RESET_PASS, payload, {
            headers: {
                resetToken: token,
            }
        })
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}

export const forget_password = async (payload, cb) => {
    try{
        const res = await api.post(FORGET_PASS, payload)
        cb(res.data)
    }catch(e){
        cb(null);
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}

export const login_user = async (payload, cb) => {
    try{
        const res = await api.post(LOGIN, payload);
        cb(res.data)
    }catch(e){
        if(e.status == 409){
            cb({
                statusCode: 409
            })
            console.log(JSON.stringify(e?.response, null, 2))
        }else{
            cb(null)
            console.log(JSON.stringify(e?.response, null, 2))
            console.log("log ", e.status)
            ToastMessage("error", e?.response?.data?.message, 3000)
        }
    }
}

export const create_user = async (payload, cb) => {
    try{
        const res = await api.post(CREATE_USER, payload)

        cb(res.data)

    }catch(e){
        if(e.status == 409){
            cb({
                statusCode: 409
            })
            ToastMessage("error", "User is exist, Login please", 3000)
        }else{
            cb(null)
            console.log(JSON.stringify(e?.response, null, 2))
            console.log("log ", e.status)
            ToastMessage("error", "Enter valid information", 3000)
        }   
    }
}


export const verify_email = async (payload, cb) => {
    try{
        const res = await api.post(VERIFY_EMAIL, payload)
        cb(res.data)
    }catch(e){
        cb(null)
        console.log(JSON.stringify(e, null, 2))
        //ToastMessage("error", e?.response?.data?.message, 3000)
    }
}

export const resend_otp = async (payload, cb) => {
    try{
        const res = await api.post(RESEND_OTP, payload)
        cb(res.data)
    }catch(e){
        cb(null)
        console.log(JSON.stringify(e?.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}