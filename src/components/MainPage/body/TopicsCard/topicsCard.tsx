import { useAppDispatch, useAppSelector } from "../../../redux/store/store"
import { setContent } from "../../../redux/slice/contentSlice"
import Styles from "./style.module.scss"

function TopicsCard() {
    const categories = useAppSelector(state => state.categories.categories)
    const dispatch = useAppDispatch()
    const handleGetCategory = async (id: string) => {
        dispatch(setContent(id))
    }
    return (
        <div className={Styles.topicsContainer}>
            <div className={Styles.topicTitle}><h1>Topics</h1></div>
            {categories.length > 0 ?
                Object.keys(categories[0].categories).map(data =>
                    <div
                        key={categories[0].categories[data]}
                        className={Styles.topics}
                        onClick={() => handleGetCategory(categories[0].categories[data])}
                    >
                        {data}
                    </div>
                )
                : "...Loading"}
        </div >
    )
}

export default TopicsCard