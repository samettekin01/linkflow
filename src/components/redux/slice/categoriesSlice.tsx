import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "../../../firebase/firebase"
import { CategoriesTypes } from "../../../utils/types"


const initialState: CategoriesTypes = {
    categories: [],
    categoriesStatus: "",
    category: [],
    categoryStatus: ""
}

export const handleCategories = createAsyncThunk("categories", async () => {
    const querySnapshot = await getDocs(collection(db, "categories"))
    const categories = querySnapshot.docs.map(doc => doc.data())
    return categories
})

export const handleCategory = createAsyncThunk("category", async ()=> {
    const category = (await getDocs(query(collection(db,"categoryId"), orderBy("categoryName", "asc")))).docs.map(d => d.data())
    return category
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
        builder.addCase(handleCategory.fulfilled, (state, action) => {
            state.category = action.payload
            state.categoryStatus = "fulfilled"
        })
        builder.addCase(handleCategory.pending, state => {
            state.categoryStatus = "pending"
        })
        builder.addCase(handleCategory.rejected, state => {
            state.categoryStatus = "rejected"
        })
    }
})

export default categoriesSlice.reducer;