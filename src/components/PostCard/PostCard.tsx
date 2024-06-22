import { FormEvent, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store/store";
import { setIsPostOpen } from "../redux/slice/stateSlice";
import { BsArrowUpCircleFill, BsX } from "react-icons/bs";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { handleComment } from "../redux/slice/contentSlice";
import Styles from "./style.module.scss"
import { CommentData } from "../../utils/types";

function PostCard() {
    const getPostContainer = useRef<HTMLDivElement | null>(null)
    const user = useAppSelector(state => state.user.user)
    const isOpen = useAppSelector(state => state.post.getPost)
    const getPost = useAppSelector(state => state.content.currentPost)
    const comment = useAppSelector(state => state.content.comment)

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
        let commentId: number = 0

        if (user) {
            if (comment) {
                commentId = Object.keys(comment).length + 1
                getPost && dispatch(handleComment(getPost?.commentsId))
                if (commentText) {
                    await updateDoc(doc(db, "comments", `${getPost?.commentsId}`), {
                        [`commentId${commentId}`]: {
                            commentId: getPost?.commentsId || "",
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
                    setCommentText("")
                    setCommentStatus(false)
                }
            }
        }
    }
    useEffect(() => {
        getPost && dispatch(handleComment(getPost?.commentsId))
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
    }, [isOpen, dispatch]);
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
                        {comment ? comment.map((data: CommentData) =>
                            <div key={data.key} className={Styles.userCommentContainer}>
                                <div className={Styles.userProfileDiv}>
                                    <img
                                        className={Styles.commentsUserProfile}
                                        src={data.value.userImg}
                                        alt={data.value.username}
                                    />
                                    <p>{data.value.username}</p>
                                    <p>.</p>
                                    <p> {new Date(data.value.createdAt).toLocaleString()}</p>
                                </div>
                                <p>{data.value.content}</p>
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