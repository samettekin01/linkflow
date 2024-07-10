import { useAppDispatch, useAppSelector } from "../../redux/store/store"
import { setIsOpenPost } from "../../redux/slice/stateSlice"
import { recentContent, setContent, setCurrentPost, setPost, setUserContent } from "../../redux/slice/contentSlice"
import PostUtilsMenu from "../../PostUtilsMenu/PostUtilsMenu"
import ShareCard from "../body/ShareCard/ShareCard"
import TopicsCard from "../body/TopicsCard/TopicsCard"
import LinkCard from "../body/linkCard/LinkCard"
import { PostData } from "../../../utils/types"
import { OrbitProgress } from "react-loading-indicators"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useCallback, useEffect } from "react"
import { handleCategory } from "../../redux/slice/categoriesSlice"
import Styles from "./style.module.scss"

function Content() {
    const dispatch = useAppDispatch()

    const user = useAppSelector(state => state.user.user)
    const { content } = useAppSelector(state => state.content)

    const { postsCollectionId, categoryId, userId, postID } = useParams()
    const location = useLocation()
    const navigate = useNavigate()

    const handlePost = (data: PostData) => {
        dispatch(setIsOpenPost(true))
        dispatch(setCurrentPost(data))
        navigate(`/post/${data?.postsCollectionId}/${data?.categoryId}/${data?.postID}`, { replace: true })
    }

    const handleContent = useCallback(() => {
        if (location.pathname === `/post/${postsCollectionId}/${categoryId}/${postID}`) {
            dispatch(setIsOpenPost(true))
            dispatch(setPost({ postsCollectionId: `${postsCollectionId}`, postID: `${postID}` }))
        } else if (location.pathname === "/") {
            dispatch(recentContent())
        } else if (postsCollectionId && categoryId) {
            dispatch(setContent({ postsCollectionId: `${postsCollectionId}`, categoryId: `${categoryId}` }))
        } else if (user?.uid) {
            dispatch(setUserContent(userId))
        }
        dispatch(handleCategory())
    }, [dispatch, postsCollectionId, categoryId, user?.uid, userId, location, postID])

    useEffect(() => {
        handleContent()
    }, [handleContent])

    return (
        <div className={Styles.body}>
            <div className={Styles.bodyContainer}>
                {user && user.uid ? <ShareCard /> : ""}
                <div className={Styles.contentContainer}>
                    {
                        content && content.length > 0 ? content.map((data: PostData) =>
                            <div key={data.postID} className={Styles.linkCardContainer}>
                                {data.createdBy === user?.uid &&
                                    <div className={Styles.utilsMenu}>
                                        <PostUtilsMenu
                                            post={data}
                                        />
                                    </div>
                                }
                                <LinkCard data={data} onClick={handlePost} />
                            </div>
                        )
                            :
                            <div className={Styles.loadingContainer}>
                                <OrbitProgress variant="track-disc" color="#880085" size="medium" text="loading..." />
                            </div>
                    }
                </div>
            </div>
            <div className={Styles.topicsContainer}>
                <TopicsCard />
            </div>
        </div >
    )
}

export default Content