import Style from "./style.module.scss"

function PostScrenn() {
    return (
        <div className={Style.postScreenContainer}>
            <div className={Style.postScrenn}>
                <div className={Style.postDivContainer}>
                    <input type="text" name="Title" placeholder="Add Title" />
                    <input type="text" name="Topic" placeholder="Add Topic" />
                    <input type="text" name="Link" placeholder="Add Link" />
                    <textarea
                        name="Description"
                        placeholder="AddDescription"
                        className={Style.postInputDescription}
                        rows={5}
                        cols={60}
                        maxLength={1000}
                    />
                </div>
                <div className={Style.postButtonDiv}>
                    <button className={Style.postButton}>Done</button>
                </div>
            </div>
        </div>
    )
}

export default PostScrenn