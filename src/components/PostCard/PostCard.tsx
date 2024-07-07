import { FormEvent, createRef, useCallback, useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../redux/store/store"
import { setIsOpenEditComment, setIsOpenPost, setIsOpenSnackBar } from "../redux/slice/stateSlice"
import { BsArrowUpCircleFill, BsChat, BsX } from "react-icons/bs"
import { DocumentData, addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, startAfter, updateDoc } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import Styles from "./style.module.scss"
import LikeButton from "../LikeButton/LikeButton"

const getFullDate = (time: number | undefined) => {
    if (time === undefined) return "Invalid Date"
    const date = new Date(time).toLocaleDateString()
    return date
}

function PostCard() {
    const getPostContainer = useRef<HTMLDivElement | null>(null)
    const commentRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>({})

    const user = useAppSelector(state => state.user.user)
    const isOpen = useAppSelector(state => state.post.getPost)
    const getPost = useAppSelector(state => state.content.currentPost)
    const comment = useAppSelector(state => state.content.comment)
    const editCommentStatus = useAppSelector(state => state.post.getComment)

    const [commentText, setCommentText] = useState<string>("")
    const [commentStatus, setCommentStatus] = useState<boolean>(false)
    const [editCommentText, setEditCommentText] = useState<string>("")
    const [commentsContent, setCommentContent] = useState<boolean>(false)

    const [comments, setComments] = useState<DocumentData[]>([])
    const [lastVisible, setLastVisible] = useState<DocumentData | null>(null)
    const [loading, setLoading] = useState(false)

    const dispatch = useAppDispatch()

    const time = new Date().valueOf()

    const setComment = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setCommentStatus(true)
        if (user) {
            if (comment) {
                if (commentText) {
                    const commentDoc = await addDoc(collection(db, `commentsCollection/${getPost?.commentsCollectionId}/comments`), {
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
                    await updateDoc(doc(db, `commentsCollection/${getPost?.commentsCollectionId}/comments`, commentDoc.id), { commentID: commentDoc.id })
                    fetchComments()
                    setCommentText("")
                    setCommentStatus(false)
                }
            }
        }
    }

    const editComment = (id: string, comment: string) => {
        const commentRef = commentRefs.current[id]?.current
        if (!editCommentStatus[id]) {
            dispatch(setIsOpenEditComment({ [id]: true }))
            setTimeout(() => {
                commentRefs.current[id].current?.classList.add(Styles.editComment)
                commentRefs.current[id]?.current?.focus()
            }, 0)
        } else {
            if (editCommentText === "" || editCommentText === comment) {
                if (commentRef) {
                    commentRef.innerText = comment
                }
                dispatch(setIsOpenEditComment({ [id]: false }))
            } else {
                if (editCommentText === "") return dispatch(setIsOpenSnackBar({ message: "Empty text area", status: true }))
                dispatch(setIsOpenEditComment({ [id]: false }))
                updateDoc(doc(db, `commentsCollection/${getPost?.commentsCollectionId}/comments`, id), {
                    content: editCommentText,
                    updatedAt: new Date().valueOf()
                })
                setEditCommentText("")
            }
            commentRefs.current[id].current?.classList.remove(Styles.editComment)
            fetchComments()
        }
    }

    const deleteComment = (id: string) => {
        if (window.confirm("Are you sure you want to delete this comment")) {
            deleteDoc(doc(db, `commentsCollection/${getPost?.commentsCollectionId}/comments`, id))
                .then(() => dispatch(setIsOpenSnackBar({ message: "Comment deleted successfully", status: true })))
                .catch(e => {
                    console.log("Error deleting comment: ", e)
                    dispatch(setIsOpenSnackBar({ message: "Error deleting comment", status: true }))
                })
            fetchComments()
        }
    }

    const cancelComment = (id: string, comment: string) => {
        const commentRef = commentRefs.current[id]?.current
        if (commentRef) {
            commentRef.blur()
            commentRef.innerText = comment
            dispatch(setIsOpenEditComment({ [id]: false }))
            commentRefs.current[id].current?.classList.remove(Styles.editComment)
        }
    }

    const commentsCollection = useCallback(async () => {
        const querySnapshot = await getDocs(query(
            collection(db, `commentsCollection/${getPost?.commentsCollectionId}/comments`),
            orderBy("createdAt", "desc"),
            limit(10)
        ))
        const getComments = querySnapshot.docs.map(d => d.data())
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
        return { getComments, lastVisible }
    }, [getPost?.commentsCollectionId])

    const nextComments = async (lastVisible: DocumentData | null) => {
        if (!lastVisible) return { getComments: [], lastVisible: null }

        const querySnapshot = await getDocs(query(
            collection(db, `commentsCollection/${getPost?.commentsCollectionId}/comments`),
            orderBy("createdAt", "desc"),
            startAfter(lastVisible),
            limit(10)
        ))
        const getComments = querySnapshot.docs.map(d => d.data())
        const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
        return { getComments, lastVisible: newLastVisible }
    }

    const loadMoreComments = async () => {
        if (loading || !lastVisible) return
        setLoading(true)
        const { getComments, lastVisible: newLastVisible } = await nextComments(lastVisible)
        setComments(prevComments => [...prevComments, ...getComments])
        setLastVisible(newLastVisible)
        setLoading(false)
    }

    const fetchComments = useCallback(async () => {
        setLoading(true)
        const { getComments, lastVisible } = await commentsCollection()
        setComments(getComments)
        setLastVisible(lastVisible)
        setLoading(false)
    }, [commentsCollection])

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (getPostContainer.current && !getPostContainer.current.contains(event.target as Node)) {
                dispatch(setIsOpenPost(false))
                closePost()
            }
        }

        const closePost = (id?: string) => {
            dispatch(setIsOpenEditComment({ [`${id}`]: false }))
        }

        const handleWindowResize = () => {
            if (window.innerWidth > 500) {
                setCommentContent(true)
            }
        }
        if (isOpen) {
            document.body.style.overflow = "hidden"
            document.addEventListener("mousedown", handleOutsideClick)
            handleWindowResize()
        } else {
            document.body.style.overflow = ""
            document.removeEventListener("mousedown", handleOutsideClick)
        }

        window.addEventListener("resize", handleWindowResize)

        fetchComments()
    }, [isOpen, dispatch, getPost, fetchComments])

    return (
        <div className={Styles.postCardContainer}>
            <div className={Styles.postContentContainer} ref={getPostContainer}>
                <div className={Styles.exitButton}>
                    <BsX onClick={() => dispatch(setIsOpenPost(false))} />
                </div>
                <div className={Styles.postScrenn} >
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
                    <LikeButton />
                    <div className={Styles.contentTextContainer}>
                        <p>{getPost?.content.description}</p>
                    </div>
                </div>
                {commentsContent && <div className={Styles.postCommentsContainer}>
                    <BsX className={Styles.commetsExit} style={window.innerWidth > 500 ? { display: "none" } : { display: "block" }} onClick={() => setCommentContent(false)} />
                    <div className={Styles.postComments} >
                        {comments ? comments.map((data: DocumentData) => {
                            if (!commentRefs.current[data.commentID]) {
                                commentRefs.current[data.commentID] = createRef<HTMLDivElement>()
                            }
                            return (
                                <div key={data.commentID} className={Styles.userCommentContainer}>
                                    <div className={Styles.userProfileDiv}>
                                        <img
                                            className={Styles.commentsUserProfile}
                                            src={data.userImg}
                                            alt={data.username}
                                        />
                                        <div className={Styles.userInfoComponent}>
                                            <p>{data.username}</p>
                                            <div>
                                                <p>{getFullDate(data.createdAt)}</p>
                                                {data.updatedAt > 0 && <span>Edited({getFullDate(data.updatedAt)})</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={`${Styles.commentDiv}`}
                                        ref={commentRefs.current[data.commentID]}
                                        contentEditable={editCommentStatus[data.commentID]}
                                        suppressContentEditableWarning={true}
                                        onInput={e => setEditCommentText((e.target as HTMLDivElement).innerText)}
                                        tabIndex={0}
                                    >
                                        {data.content}
                                    </div>
                                    {data.userId === user?.uid && <span onClick={() => editComment(data.commentID, data.content)}>{editCommentStatus[data.commentID] ? "Done" : "Editing"}</span>}
                                    {editCommentStatus[data.commentID] && <span onClick={() => cancelComment(data.commentID, data.content)}>Cancel</span>}
                                    {data.userId === user?.uid && <span onClick={() => deleteComment(data.commentID)}>Delete</span>}
                                </div>
                            )
                        }) : ""}
                        {lastVisible && <button className={Styles.moreButton} onClick={loadMoreComments}>...more comments</button>}
                    </div>
                    {user && getPost && <form className={Styles.commentUtils} onSubmit={async (e) => await setComment(e)}>
                        <input
                            className={Styles.commentInput}
                            type="text"
                            placeholder="comment"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onFocus={() => setCommentContent(true)}
                        />
                        <button className={Styles.commentButton} disabled={commentStatus}>
                            <BsArrowUpCircleFill />
                        </button>
                    </form>}
                </div>}
                <div className={Styles.postUtils} onClick={() => setCommentContent(true)}>
                    <BsChat /> <span>Comments</span>
                </div>
            </div>
        </div >
    )
}

export default PostCard
