import { configureStore } from "@reduxjs/toolkit";
import commentsReducer from "../slice/contentSlice"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    comments: commentsReducer
  },
})

export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector
export const useAppDispatch: () => typeof store.dispatch = useDispatch;