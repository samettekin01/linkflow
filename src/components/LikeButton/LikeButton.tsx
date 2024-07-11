import { BsHeart, BsHeartFill } from "react-icons/bs"
import Styles from "./style.module.scss"
import { useAppDispatch, useAppSelector } from "../redux/store/store"
import { handleLike, likesCount } from "../redux/slice/contentSlice"
import { DocumentData, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { useCallback, useEffect, useState } from "react"

function LikeButton({ id, }: { id: string }) {
    const getPost = useAppSelector(state => state.content.currentPost)
    const likes = useAppSelector(state => state.content.likesCount)
    const user = useAppSelector(state => state.user.user)

    const [buttonStatus, setButtonStatus] = useState<boolean>(false)
    const [likeStatus, setLikeStatus] = useState<boolean>(false)
    const [userLike, setUserLike] = useState<DocumentData | null>([])
    const dispatch = useAppDispatch()

    const userLikeStatus = useCallback(async () => {
        if (getPost && user) {
            const getLike = (await getDocs(query(
                collection(db, `likesCollection/${id}/likes`),
                where("createdBy", "==", user?.uid)
            ))).docs.map(d => d.data())
            if (getLike.length > 0) {
                setUserLike(getLike[0])
                setLikeStatus(true)
            } else {
                setUserLike(null)
                setLikeStatus(false)
            }
            setButtonStatus(false)
        }
    }, [getPost, user, id])

    const currentLike = async () => {
        if (getPost && user) {
            setButtonStatus(true)
            await dispatch(handleLike({ data: getPost, user: user }))
            await userLikeStatus()
            getPost && await dispatch(likesCount(getPost?.likesCollectionId))
        }
    }

    const deleteLike = async () => {
        if (userLike) {
            await deleteDoc(doc(db, `likesCollection/${getPost?.likesCollectionId}/likes`, userLike.likeId))
            setButtonStatus(true)
            await userLikeStatus()
            getPost && await dispatch(likesCount(getPost?.likesCollectionId))
        }
    }

    useEffect(() => {
        userLikeStatus()
        getPost && dispatch(likesCount(getPost?.likesCollectionId))
    }, [getPost, userLikeStatus, dispatch])

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