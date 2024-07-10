import { useAppDispatch, useAppSelector } from "../../../redux/store/store"
import { useEffect } from "react"
import { handleCategory } from "../../../redux/slice/categoriesSlice"
import { CategoryTypes } from "../../../../utils/types"
import { OrbitProgress } from "react-loading-indicators"
import Styles from "./style.module.scss"
import { Link } from "react-router-dom"

function TopicsCard() {
    const categories = useAppSelector(state => state.categories.category)

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(handleCategory())
    }, [dispatch])

    return (
        <div className={Styles.topicsContainer}>
            <div className={Styles.topicsContainerNotch}></div>
            <div className={Styles.topicTitle}><h1>Topics</h1></div>
            {categories && categories.length > 0 ?
                categories.map((data: CategoryTypes) =>
                    <Link
                        to={`/category/${data.postsCollectionId}/${data.categoryId}`}
                        key={data.categoryName}
                        className={Styles.topics}
                    >
                        {data.categoryName}
                    </Link>
                )
                :
                <div className={Styles.loadingContainer}>
                    <OrbitProgress variant="track-disc" color="#880085" size="small" text="loading..." />
                </div>
            }
        </div>
    )
}

export default TopicsCard