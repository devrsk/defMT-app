import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url, setHeaders } from "./api";
import { toast } from "react-toastify";

const initialState = {
  items: [],
  status: null,
  createStatus: null,
};

export const productsFetch = createAsyncThunk(
  "products/productsFetch",
  async () => {
    try {
      const response = await axios.get(`${url}/products`);
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error("Error fetching products");
    }
  }
);

export const productsCreate = createAsyncThunk(
  "products/productsCreate",
  async (values, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("brand", values.brand);
      formData.append("price", values.price);
      formData.append("desc", values.desc);
      if (values.image) {
        formData.append("image", values.image);
      }

      const response = await axios.post(`${url}/products`, formData, setHeaders());
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data || "Error creating product");
      return rejectWithValue(error.response?.data);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: {
    [productsFetch.pending]: (state) => {
      state.status = "pending";
    },
    [productsFetch.fulfilled]: (state, action) => {
      state.items = action.payload;
      state.status = "success";
    },
    [productsFetch.rejected]: (state) => {
      state.status = "rejected";
    },
    [productsCreate.pending]: (state) => {
      state.createStatus = "pending";
    },
    [productsCreate.fulfilled]: (state, action) => {
      state.items.push(action.payload);
      state.createStatus = "success";
      toast.success("Product Created!");
    },
    [productsCreate.rejected]: (state) => {
      state.createStatus = "rejected";
    },
  },
});

export default productsSlice.reducer;
