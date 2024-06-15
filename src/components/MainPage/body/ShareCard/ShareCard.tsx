import { setIsOpen } from "../../../redux/slice/stateSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store";
import { useEffect } from "react";
import { handleUserSign } from "../../../redux/slice/userSlice";
import Styles from "./style.module.scss"

function ShareCard() {
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.user.user)
    useEffect(() => {
        dispatch(handleUserSign())
    }, [dispatch])
    return (
        <div className={Styles.shareCardDiv}>
            <div className={Styles.shareUser}>
                <img 
                className={Styles.shareProfile}
                src={`${user?.photoURL}`} 
                alt={user?.displayName} 
                />
                <span>{user?.displayName}</span>
            </div>
            <input className={Styles.shareInput} type="button" value="Share Link" onClick={() => dispatch(setIsOpen(true))} />
        </div>
    )
}

export default ShareCard