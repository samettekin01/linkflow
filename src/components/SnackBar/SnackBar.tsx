import { setIsOpenSnackBar } from "../redux/slice/stateSlice"
import { useAppDispatch, useAppSelector } from "../redux/store/store"
import Styles from "./style.module.scss"
import { BsExclamationTriangle } from "react-icons/bs"

function SnackBar() {
    const snackBarRef = useAppSelector(state => state.post.snackBar)
    const dispatch = useAppDispatch()
    if (snackBarRef.status === true) {
        setTimeout(() => dispatch(setIsOpenSnackBar({ message: "", status: false })), 5000)
    }
    return (
        <div className={Styles.snackBar}>
            <span>{snackBarRef.message}</span> <BsExclamationTriangle />
        </div>
    )
}

export default SnackBar