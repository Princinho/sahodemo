import { Product } from "@/models/Product";
import axios from "axios";
export const getAllProducts = async () => {
    const resp = await axios.get<Product[]>("https://sahobackend.onrender.com/products");

    return resp.data;
};