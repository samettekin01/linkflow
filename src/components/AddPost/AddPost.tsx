import { ChangeEvent, useEffect, useRef, useState } from "react"
import { setIsOpen, setIsOpenSnackBar } from "../redux/slice/stateSlice"
import { useAppDispatch, useAppSelector } from "../redux/store/store"
import { addDoc, collection, doc, DocumentData, setDoc, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { db, storage } from "../../firebase/firebase"
import { CategoryTypes, PostData, PostFormikValues } from "../../utils/types"
import { useFormik } from "formik"
import { BsX } from "react-icons/bs"
import { handleCategories, handleCategory } from "../redux/slice/categoriesSlice"
import { recentContent } from "../redux/slice/contentSlice"
import Styles from "./style.module.scss"
import { OrbitProgress } from "react-loading-indicators"


export const isValidURL = (url: string) => {
    const regex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/
    return regex.test(url)
}

function AddPost() {
    const dispatch = useAppDispatch()

    const user = useAppSelector(state => state.user.user)
    const getCategories = useAppSelector(state => state.categories.categories)
    const getCategory = useAppSelector(state => state.categories.category)
    const isOpen = useAppSelector(state => state.post.post)

    const categoriesID = process.env.REACT_APP_CATEGORIES_ID

    const postsCollectionRef = collection(db, "postsCollection")
    const commentsRef = collection(db, "commentsCollection")
    const categoryRef = collection(db, "categoryId")
    const likesCollectionRef = collection(db, "likesCollection")
    const categoriesRef = doc(db, "categories", `${categoriesID}`)

    const postContainer = useRef<HTMLDivElement | null>(null)
    const titleRef = useRef<HTMLInputElement | null>(null)

    const [allowedFiles, setAllowedFiles] = useState<string>("")
    const [submitStatus, setSubmitStatus] = useState<boolean>(false)
    const [categoryData, setCategoryData] = useState<DocumentData>()


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

    const createPostRef = async (post: object, postsCollectionId: string) => {
        console.log("post oluşturuluyor", post, " ", postsCollectionId)
        const postId = await addDoc(collection(db, `postsCollection/${postsCollectionId}/posts`), post)
        await updateDoc(doc(db, `postsCollection/${postsCollectionId}/posts`, postId.id), { postID: postId.id })
        return postId.id
    }

    const createPostCollectionRef = async () => {
        console.log("postCollection oluşturuluyor")
        const postsCollection = await addDoc(postsCollectionRef, {})
        return postsCollection.id
    }

    const createCommentRef = async () => {
        console.log("commentCollection oluşturuluyor")
        const postCommentId = await addDoc(commentsRef, {})
        return postCommentId.id
    }

    const createLikeCollecitonRef = async () => {
        console.log("likeCollection oluşturuluyor")
        const likesCollection = await addDoc(likesCollectionRef, {})
        return likesCollection.id
    }

    const createCategoryRef = async (categoryName: string, postId: string, postsCollectionId: string) => {
        console.log("Category oluşturuluyor", categoryName, " postId: ", postId, "postsCollectionId: ", postsCollectionId)
        const postCreateId = await addDoc(categoryRef, {
            categoryName: categoryName,
            createdAt: time,
            createdBy: user?.uid,
            createdName: user?.displayName,
        })
        console.log(postsCollectionId)
        await updateDoc(doc(db, "categoryId", postCreateId.id), {
            categoryId: postCreateId.id,
            postsCollectionId: postsCollectionId
        })
        console.log("categoryId güncellendi.")
        await updateDoc(categoriesRef, {
            [categoryName]: postCreateId.id
        })
        console.log("categories güncellendi")
        await updateDoc(doc(db, `postsCollection/${postsCollectionId}/posts`, postId), { categoryId: postCreateId.id, postsCollectionId: postsCollectionId })
        console.log("post güncellendi")
        return { postsCollectionId, postCreateId }
    }

    const handleUserPost = async (post: PostData, postsCollectionId: string, categoryId: string, postId: string) => {
        await setDoc(doc(db, `users/${user?.uid}/posts`, postId), post)
        console.log("kullanıcı postu oluştuluyor.")
        if (user) {
            await updateDoc(doc(db, `users/${user?.uid}/posts`, postId), {
                postsCollectionId: postsCollectionId,
                categoryId: categoryId,
                postID: postId
            })
        }
    }


    const dowloadURL = async (postId: string) => {
        if (values.img) {
            if (user) {
                const storageRef = ref(storage, `photos/${postId}`)
                const snapshot = await uploadBytes(storageRef, values.img)
                const downdloadURL = await getDownloadURL(snapshot.ref)
                console.log("resim yüklendi.")
                return downdloadURL
            }
        }
    }

    const { values, handleSubmit, handleChange, setFieldValue } = useFormik({
        initialValues,
        onSubmit: async (values) => {
            if (user) {
                const existingCategory = getCategory && getCategory.find((d: CategoryTypes) => values.newCategory === d.categoryName)

                if (!isValidURL(values.link)) return dispatch(setIsOpenSnackBar({ message: "Invalid URL", status: true }))
                if (getCategory && existingCategory) return dispatch(setIsOpenSnackBar({ message: "There is already the same category", status: true }))

                console.log("oluşturma başladı")

                setSubmitStatus(true)
                dispatch(setIsOpenSnackBar({ message: "Please wait, Your post is being prepared...", status: true }))

                const commentsCollectionId = await createCommentRef()
                const likesCollectionId = await createLikeCollecitonRef()
                const getURL = await dowloadURL(commentsCollectionId)
                const category = values.selectedCategory === "Other" ? values.newCategory : values.selectedCategory
                const newPostsCollectionId = values.selectedCategory === "Other" ? await createPostCollectionRef() : categoryData && categoryData.postsCollectionId

                console.log("commentsCollectionId, likesCollectionId, getURL, category oluşturuldu.")

                if (getURL && newPostsCollectionId) {
                    const content: PostData = {
                        commentsCollectionId: commentsCollectionId,
                        likesCollectionId: likesCollectionId,
                        postsCollectionId: newPostsCollectionId || "",
                        createdBy: user?.uid,
                        createdName: user?.displayName,
                        userImg: user?.photoURL,
                        postID: "",
                        createdAt: time,
                        updatedAt: 0,
                        category: category,
                        categoryId: getCategories[0][values.selectedCategory] || "",
                        content: {
                            title: values.title,
                            link: values.link,
                            description: values.description,
                            img: getURL
                        }
                    }

                    const postId = await createPostRef(content, newPostsCollectionId)
                    if (values.selectedCategory === "Other") {
                        if (newPostsCollectionId) {
                            console.log("Other Seçildi")
                            const { postsCollectionId, postCreateId } = await createCategoryRef(values.newCategory, postId, newPostsCollectionId)
                            handleUserPost(content, postsCollectionId, postCreateId.id, postId)
                        }
                    } else {
                        console.log("kategori seçildi: ", newPostsCollectionId, " Id: ", newPostsCollectionId)
                        handleUserPost(content, newPostsCollectionId, getCategories[0][values.selectedCategory], postId)
                    }
                    await updateDoc(doc(db, "postsCollection", newPostsCollectionId), {
                        createdAt: time,
                        postID: postId,
                        postsCollectionId: newPostsCollectionId
                    })

                    console.log("oluşturma bitti")
                    
                    dispatch(recentContent())
                    dispatch(setIsOpen(false))
                    setSubmitStatus(false)
                    dispatch(setIsOpenSnackBar({ message: "Your post has been added", status: true }))
                }
            }
            dispatch(handleCategory())
        }
    })

    useEffect(() => {
        dispatch(handleCategories())
        dispatch(handleCategory())
        const handleOutsideClick = (e: MouseEvent) => {
            if (postContainer.current && !postContainer.current.contains(e.target as Node)) {
                dispatch(setIsOpen(false))
            }
        }
        if (isOpen) {
            document.body.style.overflow = "hidden"
            document.addEventListener("mousedown", handleOutsideClick)
        } else {
            document.body.style.overflow = ""
            document.removeEventListener("mousedown", handleOutsideClick)
        }
        if (titleRef.current) {
            titleRef.current.focus()
        }
    }, [isOpen, dispatch])

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
                        maxLength={80}
                        required
                    />
                    <select
                        name="selectedCategory"
                        onChange={e => {
                            handleChange(e)
                            const selectedCategory = getCategory && getCategory.find((data: CategoryTypes) => data.categoryName === e.target.value)
                            selectedCategory && setCategoryData(selectedCategory)
                        }}
                        value={values.selectedCategory}
                        required
                    >
                        <option value="">Select Category</option>
                        {getCategory && getCategory.map((data: CategoryTypes) =>
                            <option key={data.categoryId} value={data.categoryName}>{data.categoryName}</option>
                        )}
                        <option value="Other">Other</option>
                    </select>
                    {values.selectedCategory === "Other" && <input
                        type="text"
                        name="newCategory"
                        placeholder="Add Category"
                        onChange={handleChange}
                        value={values.newCategory}
                        maxLength={15}
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
                        placeholder="Add Description"
                        className={Styles.postInputDescription}
                        value={values.description}
                        rows={10}
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
                            const allowedTypes = ["image/png", "image/jpeg", "image/bmp"]
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

export default AddPost