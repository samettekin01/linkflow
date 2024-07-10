import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store/store"
import { CategoryTypes, PostData, PostFormikValues } from "../../utils/types";
import { setIsOpenEditPost, setIsOpenSnackBar } from "../redux/slice/stateSlice";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../firebase/firebase";
import { addDoc, collection, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { useFormik } from "formik";
import { BsX } from "react-icons/bs";
import Styles from "./style.module.scss";
import { setUserContent } from "../redux/slice/contentSlice";
import { isValidURL } from "../AddPost/AddPost";
import { handleCategories, handleCategory } from "../redux/slice/categoriesSlice";
import { OrbitProgress } from "react-loading-indicators";

function EditPost() {
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user.user)
    const getCategories = useAppSelector(state => state.categories.categories)
    const getCategory = useAppSelector(state => state.categories.category)
    const isOpen = useAppSelector(state => state.post.getEditPost)
    const postContent = useAppSelector(state => state.content.currentPost)

    const categoriesID = process.env.REACT_APP_CATEGORIES_ID

    const categoriesRef = doc(db, "categories", `${categoriesID}`)
    const categoryRef = collection(db, "categoryId")
    const postsCollectionRef = collection(db, "postsCollection")

    const editPostContainer = useRef<HTMLDivElement | null>(null)
    const titleRef = useRef<HTMLInputElement | null>(null)

    const [allowedFiles, setAllowedFiles] = useState<string>("")
    const [submitStatus, setSubmitStatus] = useState<boolean>(false)
    const [categoryData, setCategoryData] = useState<CategoryTypes>()

    const time = new Date().valueOf()

    const initialValues: PostFormikValues = {
        title: `${postContent?.content.title}`,
        link: `${postContent?.content.link}`,
        description: `${postContent?.content.description}`,
        categories: {},
        selectedCategory: "",
        newCategory: "",
        img: null
    }

    const createPostCollectionRef = async () => {
        console.log("postCollection oluşturuluyor")
        const postsCollection = await addDoc(postsCollectionRef, {})
        return postsCollection.id
    }

    const createCategoryRef = async (categoryName: string, content: PostData) => {
        const currentPostsCollection = await createPostCollectionRef()
        const postCreateId = await addDoc(categoryRef, {
            categoryName: categoryName,
            createdAt: time,
            createdBy: user?.uid,
            createdName: user?.displayName,
            postsCollectionId: currentPostsCollection
        })
        await updateDoc(doc(db, "categoryId", postCreateId.id), { categoryId: postCreateId.id })
        await updateDoc(categoriesRef, {
            [categoryName]: postCreateId.id
        })
        await setDoc(doc(db, `postsCollection/${currentPostsCollection}/posts`, `${postContent?.postID}`), { ...content, categoryId: postCreateId.id, postsCollectionId: currentPostsCollection })
        await updateDoc(doc(db, `users/${postContent?.createdBy}/posts`, `${postContent?.postID}`), { categoryId: postCreateId.id, postsCollectionId: currentPostsCollection })
        await deleteDoc(doc(db, `postsCollection/${postContent?.postsCollectionId}/posts`, `${postContent?.postID}`))
        return postCreateId.id
    }

    const changeCategory = async (content: PostData) => {
        if (categoryData) {
            await setDoc(doc(db, `postsCollection/${categoryData.postsCollectionId}/posts`, `${postContent?.postID}`), {
                ...content,
                categoryId: categoryData.categoryId,
                category: categoryData.categoryName,
                postsCollectionId: categoryData.postsCollectionId
            })
            await updateDoc(doc(db, `users/${postContent?.createdBy}/posts`, `${postContent?.postID}`), {
                categoryId: categoryData.categoryId,
                category: categoryData.categoryName,
                postsCollectionId: categoryData.postsCollectionId
            })
            await deleteDoc(doc(db, `postsCollection/${postContent?.postsCollectionId}/posts`, `${postContent?.postID}`))
        }
    }

    const dowloadURL = async (postId: string | undefined) => {
        if (values.img) {
            if (user) {
                const storageRef = postId ? ref(storage, `photos/${postId}`) : ref(storage, `photos/${postContent?.commentsCollectionId}`)
                const snapshot = await uploadBytes(storageRef, values.img)
                const downdloadURL = await getDownloadURL(snapshot.ref)
                return downdloadURL
            }
        }
    }

    const { values, handleSubmit, handleChange, setFieldValue } = useFormik({
        initialValues,
        onSubmit: async (values) => {
            if (postContent) {
                const existingCategory = getCategory && getCategory.find((d: CategoryTypes) => values.newCategory === d.categoryName)

                if (!isValidURL(values.link)) return dispatch(setIsOpenSnackBar({ message: "Invalid URL", status: true }))
                if (getCategory && existingCategory) return dispatch(setIsOpenSnackBar({ message: "There is already the same category", status: true }))

                setSubmitStatus(true)
                const category = values.selectedCategory === "Other" ? values.newCategory : values.selectedCategory
                const getURL = values.img && await dowloadURL(postContent?.commentsCollectionId)
                const content: PostData = {
                    commentsCollectionId: `${postContent?.commentsCollectionId}`,
                    likesCollectionId: `${postContent?.likesCollectionId}`,
                    postsCollectionId: `${postContent?.postsCollectionId}`,
                    createdBy: `${postContent?.createdBy}`,
                    createdName: `${postContent?.createdName}`,
                    userImg: `${postContent?.userImg}`,
                    postID: postContent.postID,
                    createdAt: postContent?.createdAt,
                    updatedAt: time,
                    category: category || `${postContent?.category}`,
                    categoryId: getCategories[0][values.selectedCategory] || `${postContent?.categoryId}`,
                    content: {
                        title: values.title,
                        link: values.link,
                        description: values.description,
                        img: getURL || `${postContent?.content.img}`
                    }
                }
                await updateDoc(doc(db, `postsCollection/${postContent?.postsCollectionId}/posts`, `${postContent?.postID}`), { ...content })
                await updateDoc(doc(db, `users/${postContent.createdBy}/posts`, `${postContent?.postID}`), { ...content })
                if (values.selectedCategory !== postContent.category) {
                    await changeCategory(content)
                }
                if (values.selectedCategory === "Other") {
                    await createCategoryRef(values.newCategory, content)
                }
                setSubmitStatus(false)
                dispatch(setUserContent(postContent?.createdBy))
                dispatch(setIsOpenEditPost(false))
            }
            dispatch(handleCategory())
        }
    })

    useEffect(() => {
        dispatch(handleCategories())
        dispatch(handleCategory())
        const handleOutsideClick = (e: MouseEvent) => {
            if (editPostContainer.current && !editPostContainer.current.contains(e.target as Node)) {
                dispatch(setIsOpenEditPost(false));
            }
        };
        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.body.style.overflow = "";
            document.removeEventListener("mousedown", handleOutsideClick);
        }
        if (titleRef.current) {
            titleRef.current.focus();
        }
    }, [isOpen, dispatch]);

    return (
        <div className={Styles.editPostScreenContainer}>
            <div className={Styles.editPostScrenn} ref={editPostContainer}>
                <BsX className={Styles.exitButton} onClick={() => dispatch(setIsOpenEditPost(false))} />
                <form className={Styles.editPostDivContainer} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Edit Title"
                        value={values.title}
                        onChange={handleChange}
                        maxLength={80}
                        ref={titleRef}
                    />
                    <select
                        name="selectedCategory"
                        onChange={e => {
                            handleChange(e)
                            const selectedCategory = getCategory && getCategory.find((data: CategoryTypes) => data.categoryName === e.target.value)
                            selectedCategory && setCategoryData(selectedCategory)
                        }}
                        value={values.selectedCategory}
                    >
                        <option value="">Select Category</option>
                        {getCategory && getCategory.map((data: CategoryTypes) =>
                            <option key={data.categoryName} value={data.categoryName} >{data.categoryName}</option>
                        )}
                        <option value="Other">Other</option>
                    </select>
                    {values.selectedCategory === "Other" && <input
                        type="text"
                        name="newCategory"
                        placeholder="Edit Category"
                        onChange={handleChange}
                        value={values.newCategory}
                    />}
                    <input
                        type="text"
                        name="link"
                        placeholder="Edit Link"
                        value={values.link}
                        onChange={handleChange}
                    />
                    <textarea
                        name="description"
                        placeholder="Edit Description"
                        className={Styles.editPostInputDescription}
                        value={values.description}
                        rows={10}
                        cols={60}
                        maxLength={3000}
                        onChange={handleChange}
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
                    />
                    <div className={Styles.editPostButtonDiv}>
                        {submitStatus ? <OrbitProgress variant="track-disc" color="#880085" size="small" text="pending..." /> : <input
                            name="img"
                            type="submit"
                            className={Styles.postButton}
                            value="Done"
                            disabled={submitStatus}
                        />}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditPost