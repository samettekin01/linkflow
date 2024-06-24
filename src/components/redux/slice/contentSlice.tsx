import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { collection, doc, getDoc, getDocs, limit, query, where } from "firebase/firestore"
import { ContentSliceTypes, PostData, PostState } from "../../../utils/types"
import { db } from "../../../firebase/firebase"

const initialState: ContentSliceTypes | PostState = {
    commentsCollection: [],
    commentsCollectionStatus: "",
    user: [],
    userStatus: "",
    post: [],
    postStatus: "",
    content: [],
    contentStatus: "",
    currentPost: null,
    comment: [],
    commentStatus: ""
}

// export const currentComment = createAsyncThunk("commentsCollection", async (id: string) => {
//     const commentCollection = (await getDoc((doc(db, "commentsCollection", id)))).data()
//     let querySnapshot: DocumentData[] = []
//     if (commentCollection) {
//         for (const dataKey of Object.keys(commentCollection)) {
//             const commentDoc = (await getDoc(doc(db, "comments", dataKey))).data()
//             commentDoc && querySnapshot.push({ ...commentDoc, dataKey })
//         }
//     }
//     return querySnapshot
// })

export const handleCommentsCollection = createAsyncThunk("comments", async (id: string) => {
    const getComments = (await getDocs(query(
        collection(db, "comments"),
        where("comment.commentsCollectionID", "==", id),
        limit(10)
    ))).docs.map(d => d.data())
    let sortComment = getComments.sort((a, b) => a.createdAt - b.createdAt)
    return sortComment
})


export const handleComment = createAsyncThunk("commentsCollection", async (id: string) => {
    const comment = (await getDoc(doc(db, "commentsCollection", id))).data()
    let getComment: string[] = []
    if (comment) {
        for (const [key] of Object.entries(comment)) {
            getComment.push(key)
        }
    }
    return getComment
})

// export const handleUser = createAsyncThunk("users", async () => {
//     const querySnapshot = await getDocs(collection(db, "users"))
//     const users = querySnapshot.docs.map(doc => doc.data())
//     return users
// })

// export const handlePosts = createAsyncThunk("posts", async () => {
//     const querySnapshot = await getDocs(collection(db, "posts"))
//     const posts = querySnapshot.docs.map(doc => doc.data())
//     return posts
// })

export const setContent = createAsyncThunk("content", async (id: string) => {
    const getContent = (await getDocs(query(
        collection(db, "posts"),
        where("categoryId", "==", id),
        limit(10)
    ))).docs.map(d => d.data())
    const sortPost = getContent.sort((a, b) => a.createdAt - b.createdAt)
    return sortPost
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
        builder.addCase(handleCommentsCollection.fulfilled, (state, action) => {
            state.commentsCollection = action.payload
            state.commentsCollectionStatus = "fulfilled"
        })
        builder.addCase(handleCommentsCollection.pending, state => {
            state.commentsCollectionStatus = "pending"
        })
        builder.addCase(handleCommentsCollection.rejected, state => {
            state.commentsCollectionStatus = "rejected"
        })
        // builder.addCase(handleUser.fulfilled, (state, action) => {
        //     state.user = action.payload
        //     state.userStatus = "fulfilled"
        // })
        // builder.addCase(handleUser.pending, state => {
        //     state.userStatus = "pending"
        // })
        // builder.addCase(handleUser.rejected, state => {
        //     state.userStatus = "rejected"
        // })
        // builder.addCase(handlePosts.fulfilled, (state, action) => {
        //     state.post = action.payload
        //     state.postStatus = "fulfilled"
        // })
        // builder.addCase(handlePosts.pending, state => {
        //     state.postStatus = "pending"
        // })
        // builder.addCase(handlePosts.rejected, state => {
        //     state.postStatus = "rejected"
        // })
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
        builder.addCase(handleComment.fulfilled, (state, action) => {
            state.comment = action.payload
            state.commentStatus = "fulfilled"
        })
        builder.addCase(handleComment.pending, state => {
            state.commentStatus = "pending"
        })
        builder.addCase(handleComment.rejected, state => {
            state.commentStatus = "rejected"
        })
    }
})

export const { setCurrentPost } = contentSlice.actions;
export default contentSlice.reducer;