import ShareCard from "../body/ShareCard/ShareCard"
import TopicsCard from "../body/TopicsCard/topicsCard"
import LinkCard from "../body/linkCard/LinkCard"
import Styles from "./style.module.scss"

function Content() {
    return (
        <div className={Styles.body}>
            <div className={Styles.bodyContainer}>
                <ShareCard />
                <div className={Styles.contentContainer}>
                    <LinkCard />
                    <LinkCard />
                    <LinkCard />
                    <LinkCard />
                </div>
            </div>
            <div className={Styles.topicsContainer}>
                <TopicsCard />
            </div>
        </div>
    )
}

export default Content