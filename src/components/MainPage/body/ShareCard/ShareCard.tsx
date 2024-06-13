import { BsPersonFill } from "react-icons/bs";
import Styles from "./style.module.scss"
import { handlePosts } from "../../../redux/slice/contentSlice";
import { addDoc, collection, connectFirestoreEmulator } from "firebase/firestore";
import { db } from "../../../../firebase/firebase";
import { PostState, EditUsersPost, EditComments } from "../../../../utils/types";
import { useState } from "react";

function ShareCard() {
    const time = new Date().valueOf()
    const createpost = collection(db, "posts")
    const editUsers = collection(db, "users")
    const editComments = collection(db, "comments")
    const [postId, setPostId] = useState("")
    const createPost = async () => {
        const postRef = await addDoc(createpost, {
            title: {
                created_at: time
            }
        })
        setPostId(postRef.id);
    }
    return (
        <div className={Styles.shareCardDiv}>
            <div className={Styles.shareUser}>
                <BsPersonFill className={Styles.shareProfile} />
                <p>User Name</p>
            </div>
            <input className={Styles.shareInput} type="text" placeholder="Share Link" />
            <button className={Styles.button} onClick={createPost}>Submit</button>
        </div>
    )
}

export default ShareCard