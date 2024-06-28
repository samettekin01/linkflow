import { FormEvent, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store/store";
import { setIsOpenEditComment, setIsOpenPost } from "../redux/slice/stateSlice";
import { BsArrowUpCircleFill, BsX } from "react-icons/bs";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { handleCommentsCollection } from "../redux/slice/contentSlice";
import { CommentData } from "../../utils/types";
import Styles from "./style.module.scss"

const getFullDate = (time: number | undefined) => {
    if (time === undefined) return "Invalid Date";
    const date = new Date(time).toLocaleDateString()
    return date
}

function PostCard() {
    const getPostContainer = useRef<HTMLDivElement | null>(null)

    const user = useAppSelector(state => state.user.user)
    const isOpen = useAppSelector(state => state.post.getPost)
    const getPost = useAppSelector(state => state.content.currentPost)
    const comment = useAppSelector(state => state.content.comment)
    const commentCollection = useAppSelector(state => state.content.commentsCollection)
    const editCommentStatus = useAppSelector(state => state.post.getComment)

    const [commentText, setCommentText] = useState<string>("")
    const [commentStatus, setCommentStatus] = useState<boolean>(false)
    const [editCommentText, setEditCommentText] = useState<string>("")

    const commentRef = useRef<HTMLDivElement | null>(null)

    const dispatch = useAppDispatch()

    const time = new Date().valueOf()

    const setComment = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setCommentStatus(true)
        if (user) {
            if (comment) {
                if (commentText) {
                    const commentDoc = await addDoc(collection(db, "comments"), {
                        commentID: "",
                        createdAt: time || "",
                        commentsCollectionID: getPost?.commentsCollectionId || "",
                        postId: getPost?.postID || "",
                        userId: user?.uid || "",
                        username: user?.displayName || "",
                        userImg: user?.photoURL || "",
                        content: commentText || "",
                        updatedAt: 0 || "",
                        replies: {}

                    })
                    await updateDoc(doc(db, "comments", commentDoc.id), { commentID: commentDoc.id })
                    await updateDoc(doc(db, "commentsCollection", `${getPost?.commentsCollectionId}`), {
                        [commentDoc.id]: getPost?.commentsCollectionId
                    })
                    getPost && dispatch(handleCommentsCollection(getPost?.commentsCollectionId))
                    setCommentText("")
                    setCommentStatus(false)
                }
            }
        }
    }


    const editComment = (id: string, comment: string) => {
        if (!editCommentStatus[id]) {
            dispatch(setIsOpenEditComment({ [id]: true }))
        } else {
            dispatch(setIsOpenEditComment({ [id]: false }))
            if (editCommentText === "" || editCommentText === comment) {
                console.log("Değişiklik yapılmadı")
            } else {
                updateDoc(doc(db, "comments", id), {
                    content: editCommentText,
                    updatedAt: new Date().valueOf()
                })
                setEditCommentText("")
            }
        }
    }

    const deleteComment = (id: string) => {
        if (window.confirm("Are you sure you want to delete this comment")) {
            deleteDoc(doc(db, "comments", id)).then(() => console.log("Comment deleted successfully")).catch(e => console.log("Error deleting comment: ", e))
            getPost && dispatch(handleCommentsCollection(getPost?.commentsCollectionId))
        }
    }

    useEffect(() => {
        getPost && dispatch(handleCommentsCollection(getPost?.commentsCollectionId))
        const handleOutsideClick = (event: MouseEvent) => {
            if (getPostContainer.current && !getPostContainer.current.contains(event.target as Node)) {
                dispatch(setIsOpenPost(false));
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
        <div className={Styles.postCardContainer}>
            <div className={Styles.postContentContainer} ref={getPostContainer}>
                <div className={Styles.postScrenn} >
                    <BsX className={Styles.exitButton} onClick={() => dispatch(setIsOpenPost(false))} />
                    <div className={Styles.linkProfileDiv}>
                        <img
                            className={Styles.linkProfile}
                            src={getPost?.userImg}
                            alt={getPost?.content.title}
                        />
                        <div className={Styles.userInfo}>
                            <p>{getPost?.createdName}</p>
                            <p> {getFullDate(getPost?.createdAt)}</p>
                        </div>
                        {getPost && getPost?.updatedAt > 0 && <div className={Styles.editPostDate}>
                            <p>Edited: </p>
                            <p>{getFullDate(getPost?.createdAt)}</p>
                        </div>}
                    </div>
                    <h2>{getPost?.content.title}</h2>
                    <img
                        className={Styles.postImg}
                        src={getPost?.content.img}
                        alt={getPost?.content.title}
                    />
                    <a href={getPost?.content.link} target="_blank" rel="noreferrer">LinkFlow</a>
                    <div className={Styles.contentTextContainer}>
                        <p>{getPost?.content.description}</p>
                    </div>
                </div>
                <div className={Styles.postCommentsContainer}>
                    <div className={Styles.postComments} >
                        {commentCollection ? commentCollection.map((data: CommentData) =>
                            <div key={data.commentID} className={Styles.userCommentContainer}>
                                <div className={Styles.userProfileDiv}>
                                    <img
                                        className={Styles.commentsUserProfile}
                                        src={data.userImg}
                                        alt={data.username}
                                    />
                                    <div className={Styles.userInfoComponent}>
                                        <p>{data.username}</p>
                                        <p>{new Date(data.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div
                                    ref={commentRef}
                                    contentEditable={editCommentStatus[data.commentID]}
                                    suppressContentEditableWarning={true}
                                    onInput={e => setEditCommentText((e.target as HTMLDivElement).innerText)}
                                >{data.content}</div>
                                <span onClick={() => editComment(data.commentID, data.content)}>{editCommentStatus[data.commentID] ? "Done" : "Editing"}</span>
                                {editCommentStatus[data.commentID] && <span onClick={() => dispatch(setIsOpenEditComment({ [data.commentID]: false }))}>Cancel</span>}
                                <span onClick={() => deleteComment(data.commentID)}>Delete</span>
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