import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "../../../firebase/firebase"
import { CategoriesTypes } from "../../../utils/types"


const initialState: CategoriesTypes = {
    categories: [],
    categoriesStatus: "",
    category: [],
    categoryStatus: ""
}

export const handleCategories = createAsyncThunk("categories", async () => {
    const querySnapshot = await getDocs(query(collection(db, "categories"), orderBy("categories", "desc")))
    const categories = querySnapshot.docs.map(doc => doc.data())
    return categories
})

export const handleCategory = createAsyncThunk("category", async (id: string) => {
    const category = (await getDoc(doc(db, "categoryId", id))).data()
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