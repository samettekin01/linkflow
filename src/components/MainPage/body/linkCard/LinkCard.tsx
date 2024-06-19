import { BsPersonFill } from "react-icons/bs";
import { useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../../../firebase/firebase";
import Styles from "./style.module.scss"

function LinkCard() {
    const imgRef = ref(storage, "photos/xGnpP7jpA9MrnKhp2lbh")
    const [url, setURL] = useState<string | undefined>(undefined)
    getDownloadURL(imgRef)
        .then(p => setURL(p))
        .catch(e => console.log(e))
    return (
        <div className={Styles.content}>
            <div className={Styles.linkCard}>
                <div className={Styles.linkProfileDiv}>
                    <BsPersonFill className={Styles.linkProfile} />
                    <p>User Name</p>
                </div>
                <div className={Styles.linkCardContent}>
                    <div
                        className={Styles.linkCardImg}
                        style={{
                            backgroundImage: `url(${url})`
                        }}
                    />
                    <div>
                        <h2>Title</h2>
                        <h4>Topic</h4>
                        <p>Description</p>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default LinkCard