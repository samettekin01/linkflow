import { useEffect, useRef } from "react";
import { setIsOpen } from "../redux/slice/stateSlice"
import { useAppDispatch, useAppSelector } from "../redux/store/store"
import { useFormik } from "formik";
import { PostFormikValues } from "../../utils/types";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { BsX } from "react-icons/bs";
import Style from "./style.module.scss"
import { handleUserSign } from "../redux/slice/userSlice";


function PostScreen() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.user)
    const isOpen = useAppSelector(state => state.post.post)
    const postRef = collection(db, "posts")
    const commentsRef = collection(db, "comments")
    const postContainer = useRef<HTMLDivElement>(null)

    const postTime = new Date().valueOf()

    const initialValues: PostFormikValues = {
        title: "",
        topic: "",
        link: "",
        description: ""
    }

    const handleOutsideClick = (event: MouseEvent) => {
        if (postContainer.current && !postContainer.current.contains(event.target as Node)) {
            dispatch(setIsOpen(false));
        }
    };

    useEffect(() => {
        dispatch(handleUserSign())
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.body.style.overflow = '';
            document.removeEventListener('mousedown', handleOutsideClick);
        }
    }, [isOpen, dispatch]);

    const createCommentRef = async () => {
        const postCommentId = await addDoc(commentsRef, {})
        return postCommentId.id
    }

    const { values, handleSubmit, handleChange } = useFormik({
        initialValues,
        onSubmit: async (values) => {
            const commentsId = await createCommentRef()
            addDoc(postRef, {
                commnetsId: commentsId,
                createdBy: user?.uid,
                content: {
                    createdAt: postTime,
                    title: values.title,
                    topic: values.topic,
                    link: values.link,
                    descripton: values.description
                }
            })
            dispatch(setIsOpen(false))
        }
    })

    return (
        <div className={Style.postScreenContainer}>
            <div className={Style.postScrenn} ref={postContainer}>
                <BsX className={Style.exitButton} onClick={() => dispatch(setIsOpen(false))} />
                <form className={Style.postDivContainer} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Add Title"
                        value={values.title}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="topic"
                        placeholder="Add Topic"
                        value={values.topic}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="link"
                        placeholder="Add Link"
                        value={values.link}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="AddDescription"
                        className={Style.postInputDescription}
                        value={values.description}
                        rows={5}
                        cols={60}
                        maxLength={1000}
                        onChange={handleChange}
                        required
                    />
                    <div className={Style.postButtonDiv}>
                        <input
                            type="submit"
                            className={Style.postButton}
                            value="Done"
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PostScreen