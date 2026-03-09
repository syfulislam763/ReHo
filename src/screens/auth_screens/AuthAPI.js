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
        cb(res.data);
        //console.log("login data -> ", res.data)
    }catch(e){
        if(e.status == 409){
            cb({
                statusCode: 409
            })
          
        }else{
            cb(null)
            
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
           
            ToastMessage("error", "This account may deleted try different email", 3000)
        }   
    }
}


export const verify_email = async (payload, cb) => {
    try{
        const res = await api.post(VERIFY_EMAIL, payload)
        cb(res.data)
    }catch(e){
        cb(null)
    
        //ToastMessage("error", e?.response?.data?.message, 3000)
    }
}

export const resend_otp = async (payload, cb) => {
    try{
        const res = await api.post(RESEND_OTP, payload)
        cb(res.data)
    }catch(e){
        cb(null)

        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}