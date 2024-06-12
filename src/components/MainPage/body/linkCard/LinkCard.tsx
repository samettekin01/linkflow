import { BsPersonFill } from "react-icons/bs";
import Styles from "./style.module.scss"

function LinkCard() {
    return (
        <div className={Styles.content}>
            <div className={Styles.linkCard}>
                <div className={Styles.linkProfileDiv}>
                    <BsPersonFill className={Styles.linkProfile} />
                    <p>User Name</p>
                </div>
                <h1>Title</h1>
                <h3>Topic</h3>
                <p>Description</p>
            </div>
        </div>
    )
}

export default LinkCard