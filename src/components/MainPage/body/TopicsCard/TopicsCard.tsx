import { useCallback, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../redux/store/store"
import { handleCategory } from "../../../redux/slice/categoriesSlice"
import { CategoryTypes } from "../../../../utils/types"
import { OrbitProgress } from "react-loading-indicators"
import { Link } from "react-router-dom"
import { collection, getCountFromServer } from "firebase/firestore"
import { db } from "../../../../firebase/firebase"
import Styles from "./style.module.scss"

function TopicsCard() {
    const { category } = useAppSelector(state => state.categories)
    const [postsCount, setPostsCount] = useState<{ [x: string]: number }>({})

    const dispatch = useAppDispatch()

    const getPostCount = useCallback(async () => {
        const postsArray: { [x: string]: number; } = {}
        if (category) {
            for (let i = 0; i < category.length; i++) {
                const postCollectionId = category[i].postsCollectionId
                const posts = (await getCountFromServer(collection(db, `postsCollection/${postCollectionId}/posts`))).data().count
                postsArray[postCollectionId] = posts
            }
        }
        setPostsCount(postsArray)
    }, [category])

    useEffect(() => { 
        getPostCount()
    }, [getPostCount])

    useEffect(() => {
        dispatch(handleCategory())
    }, [dispatch])

    return (
        <div className={Styles.topicsContainer}>
            <div className={Styles.topicsContainerNotch}></div>
            <div className={Styles.topicTitle}><h2>Topics</h2></div>
            {category && category.length > 0 ?
                category.map((data: CategoryTypes) =>
                    <Link
                        to={`/category/${data.postsCollectionId}/${data.categoryId}`}
                        key={data.categoryName}
                        className={Styles.topics}
                    >
                        {data.categoryName}
                        <span>{postsCount[data.postsCollectionId] || 0} posts</span>
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