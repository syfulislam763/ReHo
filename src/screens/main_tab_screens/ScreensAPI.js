import api from "../../constants/api";
import axios from "axios";
import { 
    GET_ANALYTICS, 
    GET_LAST_ANALYTICS,
    INCOME,
    EXPENSE,
    EXPENSE_ANALYSIS,
    BUDGET,
    MONTHLY_BUDGET,
    BUDGET_ANALYSIS,
    DATE_NIGHT,
    SAVING_GOAL,
    SAVING_CALCULATOR,
    INFLATION_CALCULATOR,
    HISTORY_INFLATION_CALCULATOR,
    DEBTS,
    DEBTS_SUMMARY,
    NOTIFICATION_SETTINGS,
    CHANGE_PASS,
    PARTNER_REQUEST,
    PARTNER_REQUEST_ACCEPT,
    PARTNER_REQUEST_CANCELS,
    APPOINTMENT,
    LOAN_CALCULATOR,

    BUD_FEEDBACK,
    EXP_FEEDBACK,
    DEBT_FEEDBACK,

    CONTENT,
    NOTIFICATION,
    SUBSCRIPTION,
    UPDATE_PROFILE,
    AD_URL,
    DELETE_ACCOUNT,
    SAVINGS_TIPS,

    LOGOUT
} from "../../constants/Paths";
import ToastMessage from "../../constants/ToastMessage";



export const logout_user = async (payload, cb = () => {}) => {
    try{
        const res = await api.post(LOGOUT);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
       
    }
}

export const delete_account = async (cb=() => {}) => {
    try{
        const res = await api.delete(DELETE_ACCOUNT);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
       
    }
}
export const get_ad = async (cb=() => {}) => {
    try{
        const res = await api.get(AD_URL);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}

export const update_profile = async (payload, cb=() => {}) => {
    try{
        const res = await api.patch(UPDATE_PROFILE, payload, {headers:{
            'Content-Type': 'multipart/form-data',
        }});
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e, null, 2))
        ToastMessage("error", "Faild to upload image, Try Again!", 3000)
    }
}

export const post_subscription = async (payload, cb=() => {}) => {
    try{
        const res = await api.post(SUBSCRIPTION, payload);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}



export const get_notifications = async (cb=() => {}) => {
    try{
        const res = await api.get(NOTIFICATION);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}


export const get_savings_tips = async (token, cb=() => {}) => {
    try{
        const res = await axios.get(SAVINGS_TIPS, {
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });
        cb(res?.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e, null, 2))
        ToastMessage("error", e?.message, 3000)
    }
}
export const get_debt_suggestions = async (token, cb=() => {}) => {
    try{
        const res = await axios.get(DEBT_FEEDBACK, {
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });
        cb(res?.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e, null, 2))
        ToastMessage("error", e?.message, 3000)
    }
}

export const get_expence_suggestions = async (token, cb=() => {}) => {
    try{
        const res = await axios.get(EXP_FEEDBACK, {
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e, null, 2))
        ToastMessage("error", e?.message, 3000)
    }
}

export const get_budget_suggestions = async (token, cb=() => {}) => {
    try{
        const res = await axios.get(BUD_FEEDBACK, {
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e, null, 2))
        ToastMessage("error", e?.message, 3000)
    }
}



export const get_contents = async (cb=() => {}) => {
    try{
        const res = await api.get(CONTENT);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}


export const calculate_loan = async (payload, cb=() => {}) => {
    try{
        const res = await api.post(LOAN_CALCULATOR, payload);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}

export const create_appointments = async (payload, cb=() => {}) => {
    try{
        const res = await api.post(APPOINTMENT, payload);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}

export const cancels_invitations = async (id, cb=() => {}) => {
    try{
        const res = await api.post(PARTNER_REQUEST_CANCELS+id);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}
export const accepts_invitations = async (id, cb=() => {}) => {
    try{
        const res = await api.post(PARTNER_REQUEST_ACCEPT+id);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}
export const send_invitations = async (payload, cb=() => {}) => {
    try{
        const res = await api.post(PARTNER_REQUEST, payload);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}
export const delete_invitations = async (id, cb=() => {}) => {
    try{
        const res = await api.delete(PARTNER_REQUEST+id);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}
export const get_partners_request = async (cb=() => {}) => {
    try{
        const res = await api.get(PARTNER_REQUEST);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}




export const change_password = async (payload, cb=() => {}) => {
    try{
        const res = await api.post(CHANGE_PASS, payload);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}


export const get_notification_settings = async (cb=() => {}) => {
    try{
        const res = await api.get(NOTIFICATION_SETTINGS);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("date night", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}

export const update_notification_settings = async (payload, cb=() => {}) => {
    try{
        const res = await api.patch(NOTIFICATION_SETTINGS, payload);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}

export const get_debts_summary = async (cb=() => {}) => {
    try{
        const res = await api.get(DEBTS_SUMMARY);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("date night", JSON.stringify(e.response, null, 2))
        //ToastMessage("error", e?.response?.data?.message, 3000)
    }
}

export const get_debts = async (cb=() => {}) => {
    try{
        const res = await api.get(DEBTS);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("date night", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}
export const delete_debts = async (id, cb=() => {}) => {
    try{
        const res = await api.delete(DEBTS+id);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}

export const post_debts = async (payload, cb=() => {}) => {
    try{
        const res = await api.post(DEBTS, payload);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}

export const calculate_historical_inflation = async (payload, cb=() => {}) => {
    try{
        const res = await api.post(HISTORY_INFLATION_CALCULATOR, payload);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}

export const calculate_inflation = async (payload, cb=() => {}) => {
    try{
        const res = await api.post(INFLATION_CALCULATOR, payload);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}

export const calculate_regular_savings = async (payload, cb=() => {}) => {
    try{
        const res = await api.post(SAVING_CALCULATOR, payload);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        //ToastMessage("error", e?.response?.data?.message, 3000)
    }
}
export const get_saving_goals = async (cb=() => {}) => {
    try{
        const res = await api.get(SAVING_GOAL);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("date night", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}
export const delete_saving_goal = async (id, cb=() => {}) => {
    try{
        const res = await api.delete(SAVING_GOAL+id);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}

export const post_saving_goal = async (payload, cb=() => {}) => {
    try{
        const res = await api.post(SAVING_GOAL, payload);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}
export const update_saving_goal = async (payload,id, cb=() => {}) => {
    try{
        const res = await api.patch(SAVING_GOAL+id, payload);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}



export const get_date_night = async (cb=() => {}) => {
    try{
        const res = await api.get(DATE_NIGHT);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("date night", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}


export const delete_date_night = async (id, cb=() => {}) => {
    try{
        const res = await api.delete(DATE_NIGHT+id);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}

export const post_date_night = async (payload, cb=() => {}) => {
    try{
        const res = await api.post(DATE_NIGHT, payload);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        //ToastMessage("error", e?.response?.data?.message, 3000)
    }
}
export const update_date_night = async (payload, id, cb=() => {}) => {
    try{
        const res = await api.patch(DATE_NIGHT+id, payload);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        //ToastMessage("error", e?.response?.data?.message, 3000)
    }
}

export const get_budget_analysis = async (cb=() => {}) => {
    try{
        const res = await api.get(BUDGET_ANALYSIS);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}


export const get_monthly_budget = async (type, cb=() => {}) => {
    let url = type == "all"? MONTHLY_BUDGET: `${MONTHLY_BUDGET}?type=${type}`;
    
    try{
        const res = await api.get(url);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e, null, 2))
        ToastMessage("error", "No date is found!", 3000)
    }
}

export const delete_budget = async (id, cb=() => {}) => {
    try{
        const res = await api.delete(BUDGET+id);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}

export const post_budget = async (payload, cb=() => {}) => {
    try{
        const res = await api.post(BUDGET, payload);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}
export const update_budget = async (payload,id, cb=() => {}) => {
    try{
        const res = await api.patch(BUDGET+id, payload);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
    }
}


export const get_expence = async (frequency, cb=() => {}) => {
    let url = EXPENSE;
    if(frequency != 'all'){
        url = `${EXPENSE}?frequency=${frequency}`
    }
    try{
        const res = await api.get(url);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}

export const delete_expence = async (id, cb=() => {}) => {
    try{
        const res = await api.delete(EXPENSE+id);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}


export const update_expense = async (id, payload, cb=() => {}) => {
    try{
        const res = await api.patch(EXPENSE+id, payload);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}

export const post_expence = async (payload, cb=() => {}) => {
    try{
        const res = await api.post(EXPENSE, payload);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
    }
}

export const get_expense_analysis = async (cb=() => {}) => {
    try{
        const res = await api.get(EXPENSE_ANALYSIS);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}


export const get_incomes = async (frequency, cb=() => {}) => {
    let url = INCOME
    if(frequency!='all'){
        url =  `${INCOME}?frequency=${frequency}`
    }


    try{
        const res = await api.get(url);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}
export const delete_income = async (id, cb=() => {}) => {
    try{
        const res = await api.delete(INCOME+id);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}

export const update_income = async (id, payload, cb=() => {}) => {
    try{
        const res = await api.patch(INCOME+id, payload);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}

export const post_incomes = async (payload, cb=() => {}) => {
    try{
        const res = await api.post(INCOME, payload);
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
    }
}

export const get_formated_time = (isoString) => {
  const date = new Date(isoString);

  const month = date.toLocaleString("en-US", { month: "long" }); // e.g. "October"
  const day = date.getDate();
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; 

  const time = `${hours}:${minutes} ${ampm}`;

  return {month, day,year, time};
}

export const get_analytics = async (cb) => {
    try{
        const res = await api.get(GET_ANALYTICS)
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}

export const get_last_analytics = async (cb) => {
    try{
        const res = await api.get(GET_LAST_ANALYTICS)
        cb(res.data)
    }catch(e){
        cb(null)
        console.log("re", JSON.stringify(e.response, null, 2))
        ToastMessage("error", e?.response?.data?.message, 3000)
    }
}