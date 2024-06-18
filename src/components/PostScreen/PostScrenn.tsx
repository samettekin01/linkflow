import { useEffect, useRef } from "react";
import { setIsOpen } from "../redux/slice/stateSlice"
import { useAppDispatch, useAppSelector } from "../redux/store/store"
import { useFormik } from "formik";
import { PostFormikValues } from "../../utils/types";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { BsX } from "react-icons/bs";
import { handleUserSign } from "../redux/slice/userSlice";
import Style from "./style.module.scss"
import { handleCategories } from "../redux/slice/categoriesSlice";


function PostScreen() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.user)
    const categoriesRef = useAppSelector(state => state.categories.categories)
    const isOpen = useAppSelector(state => state.post.post)
    const postRef = collection(db, "posts")
    const commentsRef = collection(db, "comments")
    const categoryRef = collection(db, "categoryId")
    const postContainer = useRef<HTMLDivElement>(null)
    const categoriesID = process.env.REACT_APP_CATEGORIES_ID

    const time = new Date().valueOf()

    const initialValues: PostFormikValues = {
        title: "",
        topic: "",
        link: "",
        description: "",
        categories: {
            css: "446546",
            framework: "65465465",
            react: "4+6546546",
            html: "56465465465",
            Other: ""
        },
        selectedCategory: "",
        newCategory: ""
    }

    const handleOutsideClick = (event: MouseEvent) => {
        if (postContainer.current && !postContainer.current.contains(event.target as Node)) {
            dispatch(setIsOpen(false));
        }
    };

    const createPostRef = async (post: object) => {
        const postId = await addDoc(postRef, post)
        return postId.id
    }

    const createCommentRef = async () => {
        const postCommentId = await addDoc(commentsRef, {})
        return postCommentId.id
    }

    const createCategoryRef = async (categoryName: string, postId: string,) => {
        const cg = categoriesRef.map(d => d)
        const postCreateId = await addDoc(categoryRef, {
            [categoryName]: {
                categoryID: postId,
                createdAt: time,
                craetedBy: user?.uid,
                createdName: user?.displayName,
            }
        })
        cg.map(data => updateDoc(doc(db, "categories", `${categoriesID}`), { categories: { ...data.categories, [categoryName]: postCreateId.id } }))
        return postCreateId.id
    }

    const { values, handleSubmit, handleChange } = useFormik({
        initialValues,
        onSubmit: async (values) => {
            const commentsId = await createCommentRef()
            const category = values.selectedCategory === "Other" ? values.newCategory : values.selectedCategory
            const content = {
                commnetsId: commentsId,
                createdBy: user?.uid,
                createdName: user?.displayName,
                content: {
                    createdAt: time,
                    title: values.title,
                    topic: values.topic,
                    categories: category,
                    link: values.link,
                    descripton: values.description
                }
            }
            const postId = await createPostRef(content);
            values.selectedCategory === "Other" && await createCategoryRef(values.newCategory, postId)
            dispatch(setIsOpen(false))
        }
    })

    useEffect(() => {
        dispatch(handleUserSign())
        dispatch(handleCategories())
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.body.style.overflow = '';
            document.removeEventListener('mousedown', handleOutsideClick);
        }
    }, [isOpen, dispatch, categoriesID]);

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
                    <select
                        name="selectedCategory"
                        onChange={handleChange}
                        value={values.selectedCategory}
                        required
                    >
                        <option value="">Please select a category</option>
                        {Object.keys(initialValues.categories).map((data, index) =>
                            <option key={index} value={data}>{data}</option>
                        )}
                    </select>
                    {values.selectedCategory === "Other" && <input
                        type="text"
                        name="newCategory"
                        placeholder="Add Category"
                        onChange={handleChange}
                        value={values.newCategory}
                        required
                    />}
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