import Styles from "./style.module.scss"

function TopicsCard() {
    return (
        <div className={Styles.topicsContainer}>
            <div className={Styles.topicTitle}><h1>Topics</h1></div>
            <div className={Styles.topics}>#Topic</div>
            <div className={Styles.topics}>#Topic</div>
            <div className={Styles.topics}>#Topic</div>
            <div className={Styles.topics}>#Topic</div>
            <div className={Styles.topics}>#Topic</div>
        </div>
    )
}

export default TopicsCard