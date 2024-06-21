import { useEffect } from "react"
import ShareCard from "../body/ShareCard/ShareCard"
import TopicsCard from "../body/TopicsCard/topicsCard"
import LinkCard from "../body/linkCard/LinkCard"
import Styles from "./style.module.scss"
import { useAppDispatch, useAppSelector } from "../../redux/store/store"
import { handleUserSign } from "../../redux/slice/userSlice"
import { handlePosts } from "../../redux/slice/contentSlice"

function Content() {
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.user.user)
    const content = useAppSelector(state => state.content.content)
    useEffect(() => {
        dispatch(handleUserSign())
        dispatch(handlePosts())
    }, [dispatch])
    return (
        <div className={Styles.body}>
            <div className={Styles.bodyContainer}>
                {user ? <ShareCard /> : ""}
                <div className={Styles.contentContainer}>
                    {
                        content ? content.map((d: any) => <LinkCard key={d.commentsId} data={d} />) : "...Loading"
                    }
                </div>
            </div>
            <div className={Styles.topicsContainer}>
                <TopicsCard />
            </div>
        </div>
    )
}

export default Content