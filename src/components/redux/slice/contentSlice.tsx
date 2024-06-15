import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../../firebase/firebase"
import { ContentSliceTypes } from "../../../utils/types"

const initialState: ContentSliceTypes = {
    comments: [],
    commnetsStatus: "",
    user: [],
    userStatus: "",
    post: [],
    postStatus: ""
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
            state.commnetsStatus = "fulfilled"
        })
        builder.addCase(handleComments.pending, state => {
            state.commnetsStatus = "pending"
        })
        builder.addCase(handleComments.rejected, state => {
            state.commnetsStatus = "rejected"
        })
        builder.addCase(handleUser.fulfilled, (state, action) => {
            state.user = action.payload
            state.userStatus = "fulfilled"
        })
        builder.addCase(handleUser.pending, state => {
            state.userStatus = "pending"
        })
        builder.addCase(handleUser.rejected, state => {
            state.userStatus = "rejected"
        })
        builder.addCase(handlePosts.fulfilled, (state, action) => {
            state.post = action.payload
            state.postStatus = "fulfilled"
        })
        builder.addCase(handlePosts.pending, state => {
            state.postStatus = "pending"
        })
        builder.addCase(handlePosts.rejected, state => {
            state.postStatus = "rejected"
        })
    }
})

export default commentsSlice.reducer;