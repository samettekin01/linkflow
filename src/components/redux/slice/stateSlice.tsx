import { createSlice } from "@reduxjs/toolkit"
import { IsOpen } from "../../../utils/types"

const initialState: IsOpen = {
    post: false,
    getPost: false,
    getPostMenu: {},
    getEditPost: false
}

const stateSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        setIsOpen: (state, action) => {
            state.post = action.payload
        },
        setIsOpenPost: (state, action) => {
            state.getPost = action.payload
        },
        setIsOpenEditPost: (state, action) => {
            state.getEditPost = action.payload
        },
        setIsMenuOpen: (state, action) => {
            state.getPostMenu = action.payload
        }
    }
})

export const { setIsOpen, setIsOpenPost, setIsMenuOpen, setIsOpenEditPost } = stateSlice.actions
export default stateSlice.reducer