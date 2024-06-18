import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../../firebase/firebase"
import { CategoriesTypes } from "../../../utils/types"


const initialState: CategoriesTypes = {
    categories: [],
    categoriesStatus: ""
}

export const handleCategories = createAsyncThunk("categories", async () => {
    const querySnapshot = await getDocs(collection(db, "categories"))
    const categories = querySnapshot.docs.map(doc => doc.data())
    return categories
})

const categoriesSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(handleCategories.fulfilled, (state, action) => {
            state.categories = action.payload
            state.categoriesStatus = "fulfilled"
        })
        builder.addCase(handleCategories.pending, state => {
            state.categoriesStatus = "pending"
        })
        builder.addCase(handleCategories.rejected, state => {
            state.categoriesStatus = "rejected"
        })
    }
})

export default categoriesSlice.reducer;