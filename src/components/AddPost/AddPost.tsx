import { ChangeEvent, useEffect, useRef, useState } from "react";
import { setIsOpen } from "../redux/slice/stateSlice"
import { useAppDispatch, useAppSelector } from "../redux/store/store"
import { getUserData } from "../redux/slice/userSlice";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../firebase/firebase";
import { PostFormikValues } from "../../utils/types";
import { handleCategory } from "../redux/slice/categoriesSlice";
import { useFormik } from "formik";
import { BsX } from "react-icons/bs";
import Styles from "./style.module.scss"


function AddPost() {
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user.user)
    const getCategories = useAppSelector(state => state.categories.categories)
    const getCategory = useAppSelector(state => state.categories.category)
    const isOpen = useAppSelector(state => state.post.post)
    const userDataRef = useAppSelector(state => state.user.userData)

    const categoriesID = process.env.REACT_APP_CATEGORIES_ID

    const postRef = collection(db, "posts")
    const commentsRef = collection(db, "commentsCollection")
    const categoryRef = collection(db, "categoryId")
    const categoriesRef = doc(db, "categories", `${categoriesID}`)

    const postContainer = useRef<HTMLDivElement | null>(null)
    const titleRef = useRef<HTMLInputElement | null>(null)
    const [allowedFiles, setAllowedFiles] = useState<string>("")
    const [submitStatus, setSubmitStatus] = useState<boolean>(false)


    const time = new Date().valueOf()

    const initialValues: PostFormikValues = {
        title: "",
        link: "",
        description: "",
        categories: {},
        selectedCategory: "",
        newCategory: "",
        img: null
    }
    const createPostRef = async (post: object) => {
        const postId = await addDoc(postRef, post)
        userDataRef && updateDoc(doc(db, "users", `${user?.uid}`), { posts: [...userDataRef.posts, postId.id] })
        return postId.id
    }

    const createCommentRef = async () => {
        const postCommentId = await addDoc(commentsRef, {})
        return postCommentId.id
    }

    const createCategoryRef = async (categoryName: string, postId: string) => {
        const cg = getCategories.map(d => d)
        const postCreateId = await addDoc(categoryRef, {
            [categoryName]: {
                createdAt: time,
                createdBy: user?.uid,
                createdName: user?.displayName,
                posts: [postId]
            }
        })
        cg.map(data => updateDoc(categoriesRef, {
            categories: {
                ...data.categories,
                [categoryName]: postCreateId.id
            }
        }
        ))
        return postCreateId.id
    }

    const updateCategory = async (postId: string) => {
        const post = getCategory && getCategory[values.selectedCategory]
        await updateDoc(doc(db, "categoryId", getCategories[0].categories[values.selectedCategory]), {
            [values.selectedCategory]: {
                ...post,
                posts: [...post.posts, postId]
            }
        });
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
            setSubmitStatus(true)
            const commentsId = await createCommentRef()
            const getURL = await dowloadURL(commentsId)
            const category = values.selectedCategory === "Other" ? values.newCategory : values.selectedCategory
            const content = {
                commentsId: commentsId,
                createdBy: user?.uid,
                createdName: user?.displayName,
                userImg: user?.photoURL,
                content: {
                    createdAt: time,
                    title: values.title,
                    category: category,
                    link: values.link,
                    description: values.description,
                    img: getURL
                }
            }
            const postId = await createPostRef(content);
            if (values.selectedCategory === "Other") {
                await createCategoryRef(values.newCategory, postId)
            } else {
                await updateCategory(postId)
            }
            setSubmitStatus(false)
            dispatch(setIsOpen(false))
        }
    })

    useEffect(() => {
        // dispatch(handleUserSign())
        dispatch(handleCategory(getCategories[0].categories[values.selectedCategory]))
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
        
    }, [isOpen, dispatch, values.selectedCategory]);

    return (
        <div className={Styles.postScreenContainer}>
            <div className={Styles.postScrenn} ref={postContainer}>
                <BsX className={Styles.exitButton} onClick={() => dispatch(setIsOpen(false))} />
                <form className={Styles.postDivContainer} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Add Title"
                        value={values.title}
                        onChange={handleChange}
                        ref={titleRef}
                        required
                    />
                    <select
                        name="selectedCategory"
                        onChange={handleChange}
                        value={values.selectedCategory}
                        required
                    >
                        <option value="">Select Category</option>
                        {getCategories && Object.keys(getCategories[0].categories).map(data =>
                            <option key={getCategories[0].categories[data]} value={data} >{data}</option>
                        )}
                        <option value="Other">Other</option>
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
                        className={Styles.postInputDescription}
                        value={values.description}
                        rows={5}
                        cols={60}
                        maxLength={3000}
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
                    <div className={Styles.postButtonDiv}>
                        <input
                            name="img"
                            type="submit"
                            className={Styles.postButton}
                            value="Done"
                            disabled={submitStatus}
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddPost