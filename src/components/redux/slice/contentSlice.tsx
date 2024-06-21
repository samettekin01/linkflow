import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { DocumentData, collection, doc, getDoc, getDocs } from "firebase/firestore"
import { db } from "../../../firebase/firebase"
import { ContentSliceTypes, PostData, PostState } from "../../../utils/types"

const initialState: ContentSliceTypes | PostState = {
    comments: [],
    commentsStatus: "",
    user: [],
    userStatus: "",
    post: [],
    postStatus: "",
    content: [],
    contentStatus: "",
    currentPost: null,
}

export const handleComments = createAsyncThunk("comments", async () => {
    const querySnapshot = await getDocs((collection(db, "comments")))
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

export const setContent = createAsyncThunk("content", async (id: string) => {
    const categoryRef = (await getDoc(doc(db, "categoryId", id))).data()
    let querySnapshot: DocumentData[] = []
    if (categoryRef) {
        for (const dataKey of Object.keys(categoryRef)) {
            for (const postID of categoryRef[dataKey].posts) {
                const postDoc = (await getDoc(doc(db, "posts", postID))).data()
                postDoc && querySnapshot.push({ ...postDoc, postID })
            }
        }
    }
    return querySnapshot
})

const contentSlice = createSlice({
    name: "content",
    initialState,
    reducers: {
        setCurrentPost: (state, action: PayloadAction<PostData>) => {
            state.currentPost = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(handleComments.fulfilled, (state, action) => {
            state.comments = action.payload
            state.commentsStatus = "fulfilled"
        })
        builder.addCase(handleComments.pending, state => {
            state.commentsStatus = "pending"
        })
        builder.addCase(handleComments.rejected, state => {
            state.commentsStatus = "rejected"
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
        builder.addCase(setContent.fulfilled, (state, action) => {
            state.content = action.payload
            state.contentStatus = "fulfilled"
        })
        builder.addCase(setContent.pending, state => {
            state.contentStatus = "pending"
        })
        builder.addCase(setContent.rejected, state => {
            state.contentStatus = "rejected"
        })
    }
})

export const { setCurrentPost } = contentSlice.actions;
export default contentSlice.reducer;