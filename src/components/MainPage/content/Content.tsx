import { useAppDispatch, useAppSelector } from "../../redux/store/store"
import { setIsMenuOpen, setIsOpenEditPost, setIsOpenPost } from "../../redux/slice/stateSlice"
import { handleComment, setContent, setCurrentPost } from "../../redux/slice/contentSlice"
import { BsThreeDotsVertical } from "react-icons/bs"
import PostUtilsMenu from "../../PostUtilsMenu/PostUtilsMenu"
import { DocumentData, deleteDoc, doc } from "firebase/firestore"
import { db, storage } from "../../../firebase/firebase"
import { deleteObject, ref } from "firebase/storage"
import ShareCard from "../body/ShareCard/ShareCard"
import TopicsCard from "../body/TopicsCard/TopicsCard"
import LinkCard from "../body/LinkCard/LinkCard"
import Styles from "./style.module.scss"

function Content() {
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.user.user)
    const content = useAppSelector(state => state.content.content)
    const comments = useAppSelector(state => state.content.comment)

    const handlePost = (data: any) => {
        dispatch(setIsOpenPost(true))
        dispatch(setCurrentPost(data))
    }

    const postEdit = (data: any) => {
        dispatch(setCurrentPost(data))
        dispatch(setIsOpenEditPost(true))
        dispatch(setIsMenuOpen({ [`${data}`]: false }))
    }

    const toggleMenu = (postID: string) => {
        dispatch(setIsMenuOpen({[postID]: true}));
    };

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
                                        console.log("Post ve commets deleted successfully")
                                    })
                                })
                            }).catch(e => console.log("Error deleting file: ", e))).catch(e => console.log("Error deleting post: ", e))
                deleteObject(ref(storage, `photos/${d.commentsCollectionId}`)).then(() => console.log("File deleted successfully")).catch(e => console.log("Error deleting file: ", e))
                dispatch(setContent(d.categoryId))
            }
        }
    }

    return (
        <div className={Styles.body}>
            <div className={Styles.bodyContainer}>
                {user ? <ShareCard /> : ""}
                <div className={Styles.contentContainer}>
                    {
                        content ? content.map((d: DocumentData) =>
                            <div key={d.postID} className={Styles.linkCardContainer}>
                                {d.createdBy === user?.uid &&
                                    <div className={Styles.postMenuContainer}>
                                        <button
                                            onClick={() => {
                                                dispatch(handleComment(d.commentsCollectionId))
                                                toggleMenu(d.postID)
                                            }}
                                            className={Styles.postMenuButton}
                                        >
                                            <BsThreeDotsVertical />
                                        </button>
                                        <PostUtilsMenu
                                            handleEdit={postEdit}
                                            handleDelete={postDelete}
                                            post={d}
                                        />
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