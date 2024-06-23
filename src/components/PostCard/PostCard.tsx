import { FormEvent, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store/store";
import { setIsPostOpen } from "../redux/slice/stateSlice";
import { BsArrowUpCircleFill, BsX } from "react-icons/bs";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Styles from "./style.module.scss"
import { handleCommentsCollection } from "../redux/slice/contentSlice";
import { CommentData } from "../../utils/types";

function PostCard() {
    const getPostContainer = useRef<HTMLDivElement | null>(null)
    const user = useAppSelector(state => state.user.user)
    const isOpen = useAppSelector(state => state.post.getPost)
    const getPost = useAppSelector(state => state.content.currentPost)
    const comment = useAppSelector(state => state.content.comment)
    const commentCollection = useAppSelector(state => state.content.commentsCollection)
    // const commentCollectionStatus = useAppSelector(state => state.content.commentsCollectionStatus)

    const [commentText, setCommentText] = useState<string>("")
    const [commentStatus, setCommentStatus] = useState<boolean>(false)

    const dispatch = useAppDispatch()

    const time = new Date().valueOf()

    const formatUnixTimeStamp = (time: number | undefined) => {
        if (time === undefined) return "Invalid Date";
        const date = new Date(time).toLocaleDateString()
        return date
    }

    const setComment = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setCommentStatus(true)
        if (user) {
            if (comment) {
                if (commentText) {
                    const comment = await addDoc(collection(db, "comments"), {
                        comment: {
                            commentsCollectionID: getPost?.commentsId || "",
                            postId: getPost?.postID || "",
                            userId: user?.uid || "",
                            username: user?.displayName || "",
                            userImg: user?.photoURL || "",
                            content: commentText || "",
                            createdAt: time || "",
                            updatedAt: 0 || "",
                            replies: {}
                        }
                    })
                    await updateDoc(doc(db, "commentsCollection", `${getPost?.commentsId}`), {
                        [comment.id]: getPost?.commentsId
                    })
                    getPost && dispatch(handleCommentsCollection(getPost?.commentsId))
                    setCommentText("")
                    setCommentStatus(false)
                }
            }
        }
    }

    useEffect(() => {
        if (getPost) dispatch(handleCommentsCollection(getPost?.commentsId))
        const handleOutsideClick = (event: MouseEvent) => {
            if (getPostContainer.current && !getPostContainer.current.contains(event.target as Node)) {
                dispatch(setIsPostOpen(false));
            }
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.body.style.overflow = '';
            document.removeEventListener('mousedown', handleOutsideClick);
        }
    }, [isOpen, dispatch, getPost]);
    return (
        <div className={Styles.PostCardContainer}>
            <div className={Styles.postContentContainer} ref={getPostContainer}>
                <div className={Styles.postScrenn} >
                    <BsX className={Styles.exitButton} onClick={() => dispatch(setIsPostOpen(false))} />
                    <div className={Styles.linkProfileDiv}>
                        <img
                            className={Styles.linkProfile}
                            src={getPost?.userImg}
                            alt={getPost?.content.title}
                        />
                        <p>{getPost?.createdName}</p>
                        <p>.</p>
                        <p> {formatUnixTimeStamp(getPost?.content.createdAt)}</p>
                    </div>
                    <h2>{getPost?.content.title}</h2>
                    <img
                        className={Styles.postImg}
                        src={getPost?.content.img}
                        alt={getPost?.content.title}
                    />
                    <div className={Styles.contentTextContainer}>
                        <p>{getPost?.content.description}</p>
                    </div>
                </div>
                <div className={Styles.postCommentsContainer}>
                    <div className={Styles.postComments}>
                        {commentCollection ? commentCollection.map((data: CommentData) =>
                            <div key={data.dataKey} className={Styles.userCommentContainer}>
                                <div className={Styles.userProfileDiv}>
                                    <img
                                        className={Styles.commentsUserProfile}
                                        src={data.comment.userImg}
                                        alt={data.comment.username}
                                    />
                                    <p>{data.comment.username}</p>
                                    <p>.</p>
                                    <p> {new Date(data.comment.createdAt).toLocaleDateString()}</p>
                                </div>
                                <p>{data.comment.content}</p>
                            </div>) : ""}
                    </div>
                    {user && getPost && <form className={Styles.commentUtils} onSubmit={async (e) => await setComment(e)}>
                        <input
                            className={Styles.commentInput}
                            type="text"
                            placeholder="Write comment"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button className={Styles.commentButton} disabled={commentStatus}>
                            <BsArrowUpCircleFill />
                        </button>
                    </form>}
                </div>
            </div>
        </div >
    )
}

export default PostCard