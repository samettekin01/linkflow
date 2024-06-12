import { BsPersonFill } from "react-icons/bs";
import Styles from "./style.module.scss"

function ShareCard() {
    return (
        <div className={Styles.shareCardDiv}>
            <div className={Styles.shareUser}>
                <BsPersonFill className={Styles.shareProfile} />
                <p>User Name</p>
            </div>
            <input className={Styles.shareInput} type="text" placeholder="Share Link" />
        </div>
    )
}

export default ShareCard