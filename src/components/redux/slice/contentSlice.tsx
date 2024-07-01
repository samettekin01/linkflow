import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore"
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
    commentStatus: "",
}

export const handleCommentsCollection = createAsyncThunk("comments", async (id: string) => {
    const getComments = (await getDocs(query(
        collection(db, "comments"),
        where("commentsCollectionID", "==", id),
        orderBy("createdAt", "desc"),
        limit(10)
    ))).docs.map(d => d.data())
    return getComments
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

export const setContent = createAsyncThunk("content", async (id: string | undefined) => {
    const getContent = (await getDocs(query(
        collection(db, "posts"),
        where("categoryId", "==", id),
        orderBy("createdAt", "desc"),
        limit(10)
    ))).docs.map(d => d.data())
    if(getContent.length === 0){
        await deleteDoc(doc(db,"categoryId", `${id}`)).catch(e => console.log("Error deleting category: ", e))
    }
    return getContent
})

export const setUserContent = createAsyncThunk("userContent", async (id: string | undefined) => {
    const getContent = (await getDocs(query(
        collection(db, "posts"),
        where("createdBy", "==", id),
        orderBy("createdAt", "desc"),
        limit(10)
    ))).docs.map(d => d.data())
    return getContent
})

export const recentContent = createAsyncThunk("recentContent", async () => {
    const getContent = (await getDocs(query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(10)
    ))).docs.map(d => d.data())
    return getContent
})

export const searchContent = createAsyncThunk("search", async (text: string) => {
    const lowerCaseText = text.toLowerCase();
    const getSearch = (await getDocs(query(
        collection(db, "posts"),
        where("content.title", "array-contains", lowerCaseText),
        orderBy("createdAt", "desc"),
        limit(10)
    ))).docs.map(d => d.data())
    return getSearch
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
        builder.addCase(setUserContent.fulfilled, (state, action) => {
            state.content = action.payload
            state.contentStatus = "fulfilled"
        })
        builder.addCase(setUserContent.pending, state => {
            state.contentStatus = "pending"
        })
        builder.addCase(setUserContent.rejected, state => {
            state.contentStatus = "rejected"
        })
        builder.addCase(recentContent.fulfilled, (state, action) => {
            state.content = action.payload
            state.contentStatus = "fulfilled"
        })
        builder.addCase(recentContent.pending, state => {
            state.contentStatus = "pending"
        })
        builder.addCase(recentContent.rejected, state => {
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
        builder.addCase(searchContent.fulfilled, (state, action) => {
            state.content = action.payload
            state.contentStatus = "fulfilled"
        })
        builder.addCase(searchContent.pending, state => {
            state.contentStatus = "pending"
        })
        builder.addCase(searchContent.rejected, state => {
            state.contentStatus = "rejected"
        })
    }
})

export const { setCurrentPost } = contentSlice.actions;
export default contentSlice.reducer;