import { createSlice } from "@reduxjs/toolkit"
import { IsOpen } from "../../../utils/types"

const initialState: IsOpen = {
    post: false,
    getPost: false,
    getPostMenu: {},
    getEditPost: false,
    getComment: {},
    snackBar: {
        message: "",
        status: false
    }
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
        },
        setIsOpenEditComment: (state, action) => {
            state.getComment = action.payload
        },
        setIsOpenSnackBar: (state, action) => {
            state.snackBar = action.payload
        }
    }
})

export const { setIsOpen, setIsOpenPost, setIsMenuOpen, setIsOpenEditPost, setIsOpenEditComment, setIsOpenSnackBar } = stateSlice.actions
export default stateSlice.reducer