import { BsFillTrash3Fill, BsPencil, BsThreeDotsVertical } from "react-icons/bs"
import { DocumentData, deleteDoc, doc } from "firebase/firestore"
import { useEffect, useRef } from "react"
import { setIsMenuOpen, setIsOpenEditPost, setIsOpenSnackBar } from "../redux/slice/stateSlice"
import { useAppDispatch, useAppSelector } from "../redux/store/store"
import { handleComment, setCurrentPost, setUserContent } from "../redux/slice/contentSlice"
import { db, storage } from "../../firebase/firebase"
import { deleteObject, ref } from "firebase/storage"
import Styles from "./style.module.scss"
import { PostData } from "../../utils/types"



function PostUtilsMenu({ post }: DocumentData) {
    const dispatch = useAppDispatch()
    const postMenuRef = useRef<HTMLDivElement>(null)

    const isOpen = useAppSelector(state => state.post.getPostMenu)
    const comments = useAppSelector(state => state.content.comment)

    const postEdit = (data: any) => {
        dispatch(setCurrentPost(data))
        dispatch(setIsOpenEditPost(true))
        dispatch(setIsMenuOpen({ [`${data}`]: false }))
    }

    const postDelete = async (d: PostData) => {
        if (window.confirm("Are you sure you want to delete this post")) {
            dispatch(setIsMenuOpen({ [d.postID]: false }))
            dispatch(setIsOpenSnackBar({ message: "post is being deleted...", status: true }))
            if (comments && d.commentsCollectionId && d.likesCollectionId && d.postsCollectionId && d.postID) {
                await deleteDoc(doc(db, `postsCollection/${d.postsCollectionId}/posts`, d.postID)).catch(e => {
                    console.log(`Error deleting post: ${e.message}`)
                    dispatch(setIsOpenSnackBar({ message: "Error deleting post", status: true }))
                })
                await deleteDoc(doc(db, `users/${d.createdBy}/posts`, d.postID)).catch(e => {
                    console.log(`Error deleting post: ${e.message}`)
                    dispatch(setIsOpenSnackBar({ message: "Error deleting post", status: true }))
                })
                await deleteObject(ref(storage, `photos/${d.commentsCollectionId}`)).catch(e => {
                    console.log(`Error deleting photo: ${e.message}`)
                    dispatch(setIsOpenSnackBar({ message: "Error deleting photo", status: true }))
                })
                await deleteDoc(doc(db, "commentsCollection", d.commentsCollectionId)).catch(e => {
                    console.log(`Error deleting commentsCollection: ${e.message}`)
                    dispatch(setIsOpenSnackBar({ message: "Error deleting commentsCollection", status: true }))
                })
                await deleteDoc(doc(db, `likesCollection`, d.likesCollectionId)).catch(e => {
                    console.log(`Error deleting likes: ${e.message}`)
                    dispatch(setIsOpenSnackBar({ message: "Error deleting likes", status: true }))
                })
                dispatch(setUserContent(d.createdBy))
                dispatch(setIsOpenSnackBar({ message: "Post deleted", status: true }))
            }else{
                dispatch(setIsOpenSnackBar({ message: "An error occurred while deleting the post.", status: true }))
            }
        }
    }

    const toggleMenu = (postID: string) => {
        dispatch(setIsMenuOpen({ [postID]: true }))
    }

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (postMenuRef.current && !postMenuRef.current?.contains(e.target as Node)) {
                dispatch(setIsMenuOpen({ [post.postID]: false }))
            }
        }
        if (post.postID) {
            document.addEventListener("mousedown", handleOutsideClick)
        } else {
            document.removeEventListener("mousedown", handleOutsideClick)
        }

    }, [dispatch, post.postID])

    return (
        <div>
            <button
                onClick={() => {
                    dispatch(handleComment(post.commentsCollectionId))
                    toggleMenu(post.postID)
                }}
                className={Styles.postMenuButton}
            >
                <BsThreeDotsVertical />
            </button>
            {isOpen[post.postID] && <div className={Styles.postMenuList} ref={postMenuRef}>
                <button onClick={() => postEdit(post)}>Düzenle <BsPencil /></button>
                <button onClick={() => postDelete(post)}>Sil <BsFillTrash3Fill /></button>
            </div>}
        </div>
    )
}

export default PostUtilsMenu