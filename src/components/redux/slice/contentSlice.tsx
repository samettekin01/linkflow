import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../../firebase/firebase"

interface InitialState {
    comments: Array<any>;
}

const initialState: InitialState = {
    comments: []
}

export const handleComments = createAsyncThunk("comments", async () => {
    const querySnapshot = await getDocs(collection(db, "comments"))
    const comment = querySnapshot.docs.map(doc => doc.data())
    return comment
})

export const handleUser = createAsyncThunk("users", async () => {
    const querySnapshot = await getDocs(collection(db, "users"))
    const users = querySnapshot.docs.map(doc => doc.data())
    return users
})

export const handlePosts = createAsyncThunk("posts", async () => {
    const querySnapshot = await getDocs(collection(db, "posts"))
    const posts = querySnapshot.docs.map(doc => doc.data())
    return posts
})

const commentsSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(handleComments.fulfilled, (state, action) => {
            state.comments = action.payload
        })
    }
})

export default commentsSlice.reducer;