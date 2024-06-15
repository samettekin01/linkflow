import { configureStore } from "@reduxjs/toolkit";
import commentsReducer from "../slice/contentSlice"
import stateReducer from "../slice/stateSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import userReducer from "../slice/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    comments: commentsReducer,
    post: stateReducer
  },
})

export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector
export const useAppDispatch: () => typeof store.dispatch = useDispatch;