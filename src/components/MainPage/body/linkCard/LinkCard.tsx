import { PostData } from "../../../../utils/types";
import Styles from "./style.module.scss"


function LinkCard({ data, onClick }: { data: PostData, onClick: any }) {

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
                        alt={data.content.title}
                    />
                    <div className={Styles.userInfo}>
                        <p>{data.createdName}</p>
                        <p> {formatUnixTimeStamp(data.createdAt)}</p>
                    </div>
                    {data.updatedAt > 0 && <div className={Styles.editPostDate}>
                        <p> Edited: </p>
                        <p>{formatUnixTimeStamp(data.updatedAt)}</p>
                    </div>}
                </div>
                <div className={Styles.linkCardContent}>
                    <div
                        className={Styles.linkCardImg}
                        style={{
                            backgroundImage: `url(${data.content.img})`
                        }}
                    >
                        <span className={Styles.categoryName}>{data.category}</span>
                    </div>
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