import { BsFillTrash3Fill, BsPencil, BsThreeDotsVertical } from "react-icons/bs";
import Styles from "./style.module.scss"
import { DocumentData, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useRef } from "react";
import { setIsMenuOpen, setIsOpenEditPost, setIsOpenSnackBar } from "../redux/slice/stateSlice";
import { useAppDispatch, useAppSelector } from "../redux/store/store";
import { handleComment, setContent, setCurrentPost } from "../redux/slice/contentSlice";
import { db, storage } from "../../firebase/firebase";
import { deleteObject, ref } from "firebase/storage";


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

    const postDelete = (d: DocumentData) => {
        if (window.confirm("Are you sure you want to delete this post")) {
            dispatch(setIsMenuOpen({ [d.postID]: false }))
            if (comments) {
                deleteDoc(doc(db, "posts", d.postID))
                    .then(() =>
                        deleteDoc(doc(db, "commentsCollection", d.commentsCollectionId))
                            .then(() => {
                                comments.forEach((data: string) => {
                                    deleteDoc(doc(db, "comments", data)).then(() => {
                                        dispatch(setIsOpenSnackBar({ message: "Post ve commets deleted successfully", status: true }))
                                    })
                                })
                            }).catch(e => {
                                console.log("Error deleting file: ", e)
                                dispatch(setIsOpenSnackBar({ message: `Error deleting file`, status: true }))
                            }))
                    .catch(e => {
                        console.log("Error deleting post: ", e)
                        dispatch(setIsOpenSnackBar({ message: `Error deleting post: ${e}`, status: true }))
                    })
                deleteObject(ref(storage, `photos/${d.commentsCollectionId}`))
                    .then(() => dispatch(setIsOpenSnackBar({ message: `File deleted successfully`, status: true })))
                    .catch(e => {
                        console.log("Error deleting file: ", e)
                        dispatch(setIsOpenSnackBar({ message: `Error deleting file`, status: true }))
                    })
                dispatch(setContent(d.categoryId))
            }
        }
    }

    const toggleMenu = (postID: string) => {
        dispatch(setIsMenuOpen({ [postID]: true }));
    };

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (postMenuRef.current && !postMenuRef.current?.contains(e.target as Node)) {
                dispatch(setIsMenuOpen({ [post.postID]: false }));
            }
        };
        if (post.postID) {
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
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