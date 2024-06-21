import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IsOpen } from "../../../utils/types"

const initialState: IsOpen = {
    post: false,
    getPost: false
}

const stateSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        setIsOpen: (state, action: PayloadAction<boolean>) => {
            state.post = action.payload
        },
        setIsPostOpen: (state, action: PayloadAction<boolean>) => {
            state.getPost = action.payload
        }
    }
})

export const { setIsOpen, setIsPostOpen } = stateSlice.actions
export default stateSlice.reducer