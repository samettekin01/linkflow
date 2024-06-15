import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserInformations, UserInitialState } from "../../../utils/types";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../../firebase/firebase";

export const handleUserSign = createAsyncThunk<UserInformations | null>("user", () => {
    return new Promise(resolve => {
        onAuthStateChanged(auth, (user: User | null) => {
            if (user) {
                const userInfo: UserInformations = {
                    uid: user.uid,
                    displayName: user.displayName || "No Name",
                    email: user.email || "No Email",
                    photoURL: user.photoURL || "No Photo"
                };
                resolve(userInfo);
            } else {
                resolve(null);
            }
        });
    });
});

const initialState: UserInitialState = {
    user: null,
    userStatus: ""
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(handleUserSign.fulfilled, (state, action) => {
            state.user = action.payload;
            state.userStatus = "fulfilled"
        });
        builder.addCase(handleUserSign.pending, state => {
            state.userStatus = "pending"
        })
        builder.addCase(handleUserSign.rejected, state => {
            state.userStatus = "rejected"
        })
    }
});

export default userSlice.reducer;
