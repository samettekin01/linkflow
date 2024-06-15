import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IsOpen } from "../../../utils/types"

const initialState: IsOpen = {
    post: false
}

const stateSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        setIsOpen: (state, action: PayloadAction<boolean>) => {
            state.post = action.payload
        }
    }
})

export const { setIsOpen } = stateSlice.actions
export default stateSlice.reducer