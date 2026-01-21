import Toast from "react-native-toast-message"
import { Alert } from "react-native"
const capitalize = (str) => str?.charAt(0)?.toUpperCase() + str.slice(1);

const ToastMessage = (type, msg,duration=4000, goTo=()=>{}, show=()=>{}) => {
    // Toast.show({
    //     type: type,
    //     text1: type,
    //     text2: msg,
    //     visibilityTime: duration,
    //     position: 'center',
    //     onHide: () => goTo(),
    //     onShow: () => show()
    // })
    Alert.alert(capitalize(type), msg)
    goTo();
    show();
}

export default ToastMessage