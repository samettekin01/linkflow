import { BsHeart, BsHeartFill } from "react-icons/bs"
import Styles from "./style.module.scss"
import { useAppDispatch, useAppSelector } from "../redux/store/store"
import { handleLike, likesCount } from "../redux/slice/contentSlice"
import { DocumentData, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { useCallback, useEffect, useState } from "react"

function LikeButton() {
    const getPost = useAppSelector(state => state.content.currentPost)
    const likes = useAppSelector(state => state.content.likesCount)

    const [buttonStatus, setButtonStatus] = useState<boolean>(false)
    const [likeStatus, setLikeStatus] = useState<boolean>(false)
    const [userLike, setUserLike] = useState<DocumentData | null>([])
    const dispatch = useAppDispatch()

    const userLikeStatus = useCallback(async () => {
        if (getPost) {
            const getLike = (await getDocs(query(
                collection(db, "likes"),
                where("createdBy", "==", getPost.createdBy),
                where("postId", "==", getPost.postID)
            ))).docs.map(d => ({ id: d.id, ...d.data() }))

            if (getLike.length > 0) {
                setUserLike(getLike[0])
                setLikeStatus(true)
            } else {
                setUserLike(null)
                setLikeStatus(false)
            }
            setButtonStatus(false)
        }
    }, [getPost])

    useEffect(() => {
        userLikeStatus()
        getPost && dispatch(likesCount(getPost?.postID))
    }, [getPost, userLikeStatus, dispatch])

    const currentLike = async () => {
        if (getPost) {
            setButtonStatus(true)
            await dispatch(handleLike(getPost))
            await userLikeStatus()
            getPost && await dispatch(likesCount(getPost?.postID))
        }
    }

    const deleteLike = async () => {
        if (userLike) {
            await deleteDoc(doc(db, "likes", userLike.id))
            setButtonStatus(true)
            await userLikeStatus()
            getPost && await dispatch(likesCount(getPost?.postID))
        }
    }

    return (
        <div className={Styles.heartContainer}>
            {likeStatus ?
                <button
                    onClick={deleteLike}
                    disabled={buttonStatus}
                >
                    <BsHeartFill className={Styles.fillHeart} />
                    {likes}
                </button> :
                <button
                    onClick={currentLike}
                    disabled={buttonStatus}
                >
                    <BsHeart className={Styles.heart} />{likes}</button>
            }
        </div>
    )
}

export default LikeButton