import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store/store";
import { setIsPostOpen } from "../redux/slice/stateSlice";
import { BsPerson, BsX } from "react-icons/bs";
import Styles from "./style.module.scss"

function PostCard() {
    const getPostContainer = useRef<HTMLDivElement>(null)
    const isOpen = useAppSelector(state => state.post.getPost)
    const getPost = useAppSelector(state => state.content.currentPost)

    const dispatch = useAppDispatch()

    const formatUnixTimeStamp = (time: number | undefined) => {
        if (time === undefined) return "Invalid Date";
        const date = new Date(time).toLocaleDateString()
        return date
    }
    useEffect(() => {
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
            <div className={Styles.postContentContainer}>
                <div className={Styles.postScrenn} ref={getPostContainer}>
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
                    <div className={Styles.userCommentContainer}>
                        <div className={Styles.userProfileDiv}>
                            {/* <img
                            className={Styles.commentsUserProfile}
                            src={getPost?.userImg}
                            alt={getPost?.content.title}
                        /> */}
                            <BsPerson className={Styles.commentsUserProfile} />
                            <p>Username</p>
                            <p>.</p>
                            <p> {new Date().toLocaleDateString()}</p>
                        </div>
                        <p>Comment</p>
                    </div>
                    <div className={Styles.userCommentContainer}>
                        <div className={Styles.userProfileDiv}>
                            {/* <img
                            className={Styles.commentsUserProfile}
                            src={getPost?.userImg}
                            alt={getPost?.content.title}
                        /> */}
                            <BsPerson className={Styles.commentsUserProfile} />
                            <p>Username</p>
                            <p>.</p>
                            <p> {new Date().toLocaleDateString()}</p>
                        </div>
                        <p>Comment</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostCard