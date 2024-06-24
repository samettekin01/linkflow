import ShareCard from "../body/ShareCard/ShareCard"
import TopicsCard from "../body/TopicsCard/TopicsCard"
import LinkCard from "../body/linkCard/LinkCard"
import Styles from "./style.module.scss"
import { useAppDispatch, useAppSelector } from "../../redux/store/store"
import { setIsPostOpen } from "../../redux/slice/stateSlice"
import { handleComment, setContent, setCurrentPost } from "../../redux/slice/contentSlice"
import { BsFillTrash3Fill, BsPencil, BsThreeDotsVertical } from "react-icons/bs"
import { DocumentData, deleteDoc, doc } from "firebase/firestore"
import { db, storage } from "../../../firebase/firebase"
import { useEffect, useRef, useState } from "react"
import { deleteObject, ref } from "firebase/storage"

function Content() {
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.user.user)
    const content = useAppSelector(state => state.content.content)
    const comments = useAppSelector(state => state.content.comment)
    const listMenuRef = useRef<HTMLDivElement | null>(null)
    const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)

    const handlePost = (data: any) => {
        dispatch(setIsPostOpen(true))
        dispatch(setCurrentPost(data))
    }

    const postEdit = (id: DocumentData) => {
        dispatch(setContent(id.categoryId))
        console.log(comments)
        setIsOpenMenu(isOpenMenu => !isOpenMenu)
    }

    const postDelete = (id: DocumentData) => {
        if (window.confirm("Are you sure you want to delete this post")) {
            if (comments) {
                deleteDoc(doc(db, "posts", id.postID))
                    .then(() =>
                        deleteDoc(doc(db, "commentsCollection", id.commentsId))
                            .then(() => {
                                comments.forEach((data: string) => {
                                    deleteDoc(doc(db, "comments", data)).then(() => {
                                        
                                        console.log("Post ve commets deleted successfully")
                                    })
                                })
                            }).catch(e => console.log("Error deleting file: ", e))).catch(e => console.log("Error deleting post: ", e))
                deleteObject(ref(storage, `photos/${id.commentsId}`)).then(() => console.log("File deleted successfully")).catch(e => console.log("Error deleting file: ", e))
                dispatch(setContent(id.categoryId))
                setIsOpenMenu(isOpenMenu => !isOpenMenu)
            }
        }
    }

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (listMenuRef.current && !listMenuRef.current.contains(event.target as Node)) {
                setIsOpenMenu(false);
            }
        };
        if (isOpenMenu) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.body.style.overflow = '';
            document.removeEventListener('mousedown', handleOutsideClick);
        }
    }, [isOpenMenu])

    return (
        <div className={Styles.body}>
            <div className={Styles.bodyContainer}>
                {user ? <ShareCard /> : ""}
                <div className={Styles.contentContainer}>
                    {
                        content ? content.map((d: any) =>
                            <div key={d.postID} className={Styles.linkCardContainer}>
                                {d.createdBy === user?.uid &&
                                    <div className={Styles.postMenuContainer}>
                                        <button
                                            onClick={() => {
                                                dispatch(handleComment(d.commentsId))
                                                setIsOpenMenu(isOpenMenu => !isOpenMenu)
                                            }}
                                            className={Styles.postMenuButton}
                                        >
                                            <BsThreeDotsVertical />
                                        </button>
                                        {isOpenMenu &&
                                            <div className={Styles.postMenuList} ref={listMenuRef}>
                                                <button onClick={() => postEdit(d)}>Düzenle <BsPencil /></button>
                                                <button onClick={() => postDelete(d)}>Sil <BsFillTrash3Fill /></button>
                                            </div>}
                                    </div>}
                                <LinkCard data={d} onClick={handlePost} />
                            </div>)
                            : "...Loading"
                    }
                </div>
            </div>
            <div className={Styles.topicsContainer}>
                <TopicsCard />
            </div>
        </div >
    )
}

export default Content