import axios from "axios"
import URL from "../../config/api"

export const sendFcmToken=async(fcm_token,id)=>{
    try {
        const response=await axios.post(`${URL}/customer/updateCustomerFcmToken`,{
            id,
            fcm_token,
          })
        console.log(response)
    } catch (error) {
        console.log(error)
    }
}