import { useAppDispatch, useAppSelector } from "../../../redux/store/store"
import { setContent } from "../../../redux/slice/contentSlice"
import Styles from "./style.module.scss"
import { useEffect } from "react"
import { handleCategory } from "../../../redux/slice/categoriesSlice"
import { DocumentData } from "firebase/firestore"

function TopicsCard() {
    const categories = useAppSelector(state => state.categories.category)
    const dispatch = useAppDispatch()
    const handleGetCategory = async (id: string) => {
        dispatch(setContent(id))
    }

    useEffect(() => {
        dispatch(handleCategory())
    }, [dispatch])

    return (
        <div className={Styles.topicsContainer}>
            <div className={Styles.topicsContainerNotch}></div>
            <div className={Styles.topicTitle}><h1>Topics</h1></div>
            {categories ?
                categories.map((data: DocumentData) =>
                    <div
                        key={data.categoryName}
                        className={Styles.topics}
                        onClick={() => handleGetCategory(data.categoryId)}
                    >
                        {data.categoryName}
                    </div>
                )
                : "...Loading"}
        </div >
    )
}

export default TopicsCard