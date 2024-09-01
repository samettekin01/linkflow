import { FormEvent, createRef, useCallback, useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../redux/store/store"
import { setIsOpenEditComment, setIsOpenPost, setIsOpenSnackBar } from "../redux/slice/stateSlice"
import { BsArrowUpCircleFill, BsChat, BsX } from "react-icons/bs"
import { DocumentData, addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, startAfter, updateDoc } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import LikeButton from "../LikeButton/LikeButton"
import { useNavigate, useParams } from "react-router-dom"
import Styles from "./style.module.scss"
import { OrbitProgress } from "react-loading-indicators"
import { setPost } from "../redux/slice/contentSlice"
import { PostData } from "../../utils/types"

const getFullDate = (time: number | undefined) => {
    if (time === undefined) return "Invalid Date"
    const date = new Date(time).toLocaleDateString()
    return date
}

function PostCard() {
    const currentPostContainer = useRef<HTMLDivElement | null>(null)
    const commentRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>({})

    const { user } = useAppSelector(state => state.user)
    const { getPost, getComment } = useAppSelector(state => state.post)
    const { currentPost, comment, post, content } = useAppSelector(state => state.content)

    const [commentText, setCommentText] = useState<string>("")
    const [commentStatus, setCommentStatus] = useState<boolean>(false)
    const [editCommentText, setEditCommentText] = useState<string>("")
    const [commentsContent, setCommentContent] = useState<boolean>(false)

    const [comments, setComments] = useState<DocumentData[]>([])
    const [lastVisible, setLastVisible] = useState<DocumentData | null>(null)
    const [loading, setLoading] = useState(false)
    const [handlePost, setHandlePost] = useState<DocumentData | PostData | undefined>(undefined)

    const dispatch = useAppDispatch()

    const { postsCollectionId, categoryId, postID } = useParams()
    const navigate = useNavigate()

    const time = new Date().valueOf()


    const setComment = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setCommentStatus(true)
        if (user) {
            if (comment) {
                if (commentText) {
                    const commentDoc = await addDoc(collection(db, `commentsCollection/${handlePost?.commentsCollectionId}/comments`), {
                        commentID: "",
                        createdAt: time || "",
                        commentsCollectionID: handlePost?.commentsCollectionId || "",
                        postId: handlePost?.postID || "",
                        userId: user?.uid || "",
                        username: user?.displayName || "",
                        userImg: user?.photoURL || "",
                        content: commentText || "",
                        updatedAt: 0 || "",
                        replies: {}
                    })
                    await updateDoc(doc(db, `commentsCollection/${handlePost?.commentsCollectionId}/comments`, commentDoc.id), { commentID: commentDoc.id })
                    fetchComments()
                    setCommentText("")
                    setCommentStatus(false)
                }
            }
        }
    }

    const editComment = (id: string, comment: string) => {
        const commentRef = commentRefs.current[id]?.current
        if (!getComment[id]) {
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
                updateDoc(doc(db, `commentsCollection/${handlePost?.commentsCollectionId}/comments`, id), {
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
            deleteDoc(doc(db, `commentsCollection/${handlePost?.commentsCollectionId}/comments`, id))
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
            collection(db, `commentsCollection/${handlePost?.commentsCollectionId}/comments`),
            orderBy("createdAt", "desc"),
            limit(10)
        ))
        const getComments = querySnapshot.docs.map(d => d.data())
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
        return { getComments, lastVisible }
    }, [handlePost?.commentsCollectionId])

    const nextComments = async (lastVisible: DocumentData | null) => {
        if (!lastVisible) return { getComments: [], lastVisible: null }

        const querySnapshot = await getDocs(query(
            collection(db, `commentsCollection/${handlePost?.commentsCollectionId}/comments`),
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

    const closePost = useCallback((status: boolean) => {
        dispatch(setIsOpenPost(status))
        if (content && content.length === 0) {
            navigate(`category/${postsCollectionId}/${categoryId}`)
        }
    }, [dispatch, content, navigate, categoryId, postsCollectionId])


    const handlePostContent = useCallback(async () => {
        if (!currentPost) {
            await dispatch(setPost({ postsCollectionId: `${postsCollectionId}`, postID: `${postID}` }))
            setHandlePost(post)
        } else {
            setHandlePost(currentPost)
        }
    }, [dispatch, postsCollectionId, postID, currentPost, post])

    useEffect(() => {
        handlePostContent()
        const handleOutsideClick = (event: MouseEvent) => {
            if (currentPostContainer.current && !currentPostContainer.current.contains(event.target as Node)) {
                closePost(false)
            }
        }

        const handleWindowResize = () => {
            if (window.innerWidth > 500) {
                setCommentContent(true)
            }
        }
        if (getPost) {
            document.body.style.overflow = "hidden"
            document.addEventListener("mousedown", handleOutsideClick)
            handleWindowResize()
        } else {
            document.body.style.overflow = ""
            document.removeEventListener("mousedown", handleOutsideClick)
        }

        window.addEventListener("resize", handleWindowResize)

        fetchComments()
    }, [getPost, fetchComments, closePost, handlePostContent])

    return (
        <div className={Styles.postCardContainer}>
            <div className={Styles.postContentContainer} ref={currentPostContainer}>
                <div className={Styles.exitButton}>
                    <BsX onClick={() => closePost(false)} />
                </div>
                {handlePost && handlePost.postsCollectionId ? <div className={Styles.postScrenn} >
                    <div className={Styles.linkProfileDiv}>
                        <img
                            className={Styles.linkProfile}
                            src={handlePost?.userImg}
                            alt={handlePost?.content.title}
                        />
                        <div className={Styles.userInfo}>
                            <p>{handlePost?.createdName}</p>
                            <p> {getFullDate(handlePost?.createdAt)}</p>
                        </div>
                        {handlePost && handlePost?.updatedAt > 0 && <div className={Styles.editPostDate}>
                            <p>Edited: </p>
                            <p>{getFullDate(handlePost?.createdAt)}</p>
                        </div>}
                    </div>
                    <h2>{handlePost?.content.title}</h2>
                    <img
                        className={Styles.postImg}
                        src={handlePost?.content.img}
                        alt={handlePost?.content.title}
                    />
                    <a href={handlePost?.content.link} target="_blank" rel="noreferrer">LinkFlow</a>
                    <LikeButton id={handlePost?.likesCollectionId}/>
                    <div className={Styles.contentTextContainer}>
                        <p>{handlePost?.content.description}</p>
                    </div>
                </div> : <OrbitProgress variant="track-disc" color="#880085" size="medium" text="loading..." />}
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
                                        contentEditable={getComment[data.commentID]}
                                        suppressContentEditableWarning={true}
                                        onInput={e => setEditCommentText((e.target as HTMLDivElement).innerText)}
                                        tabIndex={0}
                                    >
                                        {data.content}
                                    </div>
                                    {data.userId === user?.uid && <span onClick={() => editComment(data.commentID, data.content)}>{getComment[data.commentID] ? "Done" : "Editing"}</span>}
                                    {getComment[data.commentID] && <span onClick={() => cancelComment(data.commentID, data.content)}>Cancel</span>}
                                    {data.userId === user?.uid && <span onClick={() => deleteComment(data.commentID)}>Delete</span>}
                                </div>
                            )
                        }) : ""}
                        {lastVisible && <button className={Styles.moreButton} onClick={loadMoreComments}>...more comments</button>}
                    </div>
                    {user && handlePost && <form className={Styles.commentUtils} onSubmit={async (e) => await setComment(e)}>
                        <input
                            className={Styles.commentInput}
                            type="text"
                            placeholder="Comment"
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
