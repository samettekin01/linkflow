import { ChangeEvent, useEffect, useRef, useState } from "react";
import { setIsOpen } from "../redux/slice/stateSlice"
import { useAppDispatch, useAppSelector } from "../redux/store/store"
import { getUserData, handleUserSign } from "../redux/slice/userSlice";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { handleCategories } from "../redux/slice/categoriesSlice";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../firebase/firebase";
import { PostFormikValues } from "../../utils/types";
import { useFormik } from "formik";
import { BsX } from "react-icons/bs";
import Style from "./style.module.scss"


function PostScreen() {
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user.user)
    const categoriesRef = useAppSelector(state => state.categories.categories)
    const isOpen = useAppSelector(state => state.post.post)
    const userDataRef = useAppSelector(state => state.user.userData)

    const postRef = collection(db, "posts")
    const commentsRef = collection(db, "comments")
    const categoryRef = collection(db, "categoryId")

    const postContainer = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLInputElement | null>(null)
    const [allowedFiles, setAllowedFiles] = useState<string>("")

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
        newCategory: "",
        img: null
    }
    const createPostRef = async (post: object) => {
        const postId = await addDoc(postRef, post)
        userDataRef && updateDoc(doc(db, "users", `${user?.uid}`), { posts: { ...userDataRef.posts, [postId.id]: time } })
        return postId.id
    }

    const createCommentRef = async () => {
        const postCommentId = await addDoc(commentsRef, {})
        return postCommentId.id
    }

    const createCategoryRef = async (categoryName: string, postId: string) => {
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

    const dowloadURL = async (postId: string) => {
        if (values.img) {
            if (user) {
                const storageRef = ref(storage, `photos/${postId}`)
                const snapshot = await uploadBytes(storageRef, values.img)
                const downdloadURL = await getDownloadURL(snapshot.ref)
                return downdloadURL
            }
        }
    }

    const { values, handleSubmit, handleChange, setFieldValue } = useFormik({
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
                    descripton: values.description,
                    img: await dowloadURL(commentsId)
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
        const handleOutsideClick = (event: MouseEvent) => {
            if (postContainer.current && !postContainer.current.contains(event.target as Node)) {
                dispatch(setIsOpen(false));
            }
        };

        user && dispatch(getUserData(user?.uid))
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.body.style.overflow = '';
            document.removeEventListener('mousedown', handleOutsideClick);
        }
        if (titleRef.current) {
            titleRef.current.focus();
        }
    }, [isOpen, dispatch]);

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
                        ref={titleRef}
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
                    {allowedFiles && <label>Invalid file</label>}
                    <input
                        type="file"
                        name="imgFile"
                        accept="image/png, image/jpeg, image/bmp"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const allowedTypes = ["image/png", "image/jpeg", "image/bmp"];
                            if (e.currentTarget.files && e.currentTarget.files[0]) {
                                const file = e.currentTarget.files
                                if (!allowedTypes.includes(file[0].type)) {
                                    setAllowedFiles("invalid file")
                                    e.currentTarget.value = ""
                                } else {
                                    setFieldValue("img", file[0])
                                    setAllowedFiles("")
                                }
                            }
                        }}
                        required
                    />
                    <div className={Style.postButtonDiv}>
                        <input
                            name="img"
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