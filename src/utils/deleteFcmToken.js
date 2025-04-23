import axios from "axios";
import URL from "../config/api";
export const deleteFcmToken = async (id) => {
    const data = { id: id }
    try {
        const res = await axios.post(`${URL}/customer/deleteCustomerFcmToken`, data);
        console.log(res)
    } catch (error) {
        return null;
    }
};
