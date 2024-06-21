import { DocumentData } from "firebase/firestore";
import Styles from "./style.module.scss"

function LinkCard({ data }: { data: DocumentData }) {
    const formatUnixTimeStamp = (time: number) => {
        const date = new Date(time).toLocaleDateString()
        return date
    }
    return (
        <div className={Styles.content}>
            <div className={Styles.linkCard}>
                <div className={Styles.linkProfileDiv}>
                    <img
                        src={data.userImg}
                        className={Styles.linkProfile}
                        alt={data.title}
                    />
                    <p>{data.createdName}</p>
                    <p>.</p>
                    <p> {formatUnixTimeStamp(data.content.createdAt)}</p>
                </div>
                <div className={Styles.linkCardContent}>
                    <div
                        className={Styles.linkCardImg}
                        style={{
                            backgroundImage: `url(${data.content.img})`
                        }}
                    />
                    <div className={Styles.cardContent}>
                        <h2>{data.content.title}</h2>
                        <p>{data.content.description}</p>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default LinkCard