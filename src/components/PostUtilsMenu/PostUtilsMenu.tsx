import { BsFillTrash3Fill, BsPencil } from "react-icons/bs";
import Styles from "./style.module.scss"
import { DocumentData } from "firebase/firestore";
import { useEffect, useRef } from "react";
import { setIsMenuOpen } from "../redux/slice/stateSlice";
import { useAppDispatch, useAppSelector } from "../redux/store/store";

interface MenuProps {
    handleEdit: (id: DocumentData) => void
    handleDelete: (id: DocumentData) => void
    post: DocumentData
}

function PostUtilsMenu({ handleEdit, handleDelete, post }: MenuProps) {
    const dispatch = useAppDispatch()
    const postMenuRef = useRef<HTMLDivElement>(null)
    const isOpen = useAppSelector(state => state.post.getPostMenu)
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (postMenuRef.current && !postMenuRef.current?.contains(e.target as Node)) {
                dispatch(setIsMenuOpen({ [post.postID]: false }));
            }
        };
        if (post.postID) {
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
        }

    }, [dispatch, post.postID])

    return (
        <div>
            {isOpen[post.postID] && <div className={Styles.postMenuList} ref={postMenuRef}>
                <button onClick={() => handleEdit(post)}>Düzenle <BsPencil /></button>
                <button onClick={() => handleDelete(post)}>Sil <BsFillTrash3Fill /></button>
            </div>}
        </div>
    )
}

export default PostUtilsMenu