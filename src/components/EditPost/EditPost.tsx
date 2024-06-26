import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store/store"
import { collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../firebase/firebase";
import { PostFormikValues } from "../../utils/types";
import { useFormik } from "formik";
import { BsX } from "react-icons/bs";
import Styles from "./style.module.scss"
import { setIsOpenEditPost } from "../redux/slice/stateSlice";

function EditPost() {
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user.user)
    const getCategories = useAppSelector(state => state.categories.categories)
    const isOpen = useAppSelector(state => state.post.getEditPost)
    const postContent = useAppSelector(state => state.content.currentPost)

    const categoriesID = process.env.REACT_APP_CATEGORIES_ID

    const editPostContainer = useRef<HTMLDivElement | null>(null)
    const titleRef = useRef<HTMLInputElement | null>(null)
    const [allowedFiles, setAllowedFiles] = useState<string>("")
    const [submitStatus, setSubmitStatus] = useState<boolean>(false)

    const time = new Date().valueOf()

    const initialValues: PostFormikValues = {
        title: `${postContent?.content.title}`,
        link: `${postContent?.content.link}`,
        description: `${postContent?.content.description}`,
        categories: {},
        selectedCategory: `${postContent?.category}`,
        newCategory: "",
        img: null
    }


    const { values, handleSubmit, handleChange, setFieldValue } = useFormik({
        initialValues,
        onSubmit: async (values) => {

        }
    })

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (editPostContainer.current && !editPostContainer.current.contains(event.target as Node)) {
                dispatch(setIsOpenEditPost(false));
            }
        };
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
        console.log(postContent)
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
                        ref={titleRef}
                        required
                    />
                    <select
                        name="selectedCategory"
                        onChange={handleChange}
                        value={values.selectedCategory}
                        required
                    >
                        <option value={values.selectedCategory}>{values.selectedCategory}</option>
                        {getCategories && Object.keys(getCategories[0].categories).sort().map(data =>
                            <option key={getCategories[0].categories[data]} value={data} >{data}</option>
                        )}
                        <option value="Other">Other</option>
                    </select>
                    {values.selectedCategory === "Other" && <input
                        type="text"
                        name="newCategory"
                        placeholder="Edit Category"
                        onChange={handleChange}
                        value={values.newCategory}
                        required
                    />}
                    <input
                        type="text"
                        name="link"
                        placeholder="Edit Link"
                        value={values.link}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Edit Description"
                        className={Styles.editPostInputDescription}
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
                    <div className={Styles.editPostButtonDiv}>
                        <input
                            name="img"
                            type="submit"
                            className={Styles.editPostButton}
                            value="Done"
                            disabled={submitStatus}
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditPost