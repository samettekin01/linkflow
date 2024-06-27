import { DocumentData } from "firebase/firestore";
import Styles from "./style.module.scss"

function LinkCard({ data, onClick }: { data: DocumentData, onClick: any }) {
    const formatUnixTimeStamp = (time: number) => {
        const date = new Date(time).toLocaleDateString()
        return date
    }
    return (
        <div className={Styles.content} onClick={() => onClick(data)}>
            <div className={Styles.linkCard}>
                <div className={Styles.linkProfileDiv}>
                    <img
                        className={Styles.linkProfile}
                        src={data.userImg}
                        alt={data.title}
                    />
                    <p>{data.createdName}</p>
                    <p>.</p>
                    <p> {formatUnixTimeStamp(data.createdAt)}</p>
                    {data.updatedAt > 0 && <div className={Styles.editPostDate}>
                        <p> Edited: </p>
                        <p>{formatUnixTimeStamp(data.updatedAt)}</p>
                    </div>}
                </div>
                <div className={Styles.linkCardContent}>
                    <span className={Styles.categoryName}>{data.category}</span>
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