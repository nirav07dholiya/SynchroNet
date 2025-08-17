import axios from "axios";
import {HOST} from "@/utils/constant";

console.log({HOST});
console.log({HOST2:import.meta.env.VITE_BACKEND_URL});
export const apiClient = axios.create({
    baseURL:HOST,
})