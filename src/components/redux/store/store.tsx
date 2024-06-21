import { configureStore } from "@reduxjs/toolkit";
import contentReducer from "../slice/contentSlice"
import stateReducer from "../slice/stateSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import userReducer from "../slice/userSlice";
import categoriesReducer from "../slice/categoriesSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    content: contentReducer,
    post: stateReducer,
    categories: categoriesReducer
  },
})

export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector
export const useAppDispatch: () => typeof store.dispatch = useDispatch;