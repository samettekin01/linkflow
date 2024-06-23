import { setIsOpen } from "../../../redux/slice/stateSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store";
import Styles from "./style.module.scss"

function ShareCard() {
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.user.user)
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