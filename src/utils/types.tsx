export interface PostState {
    created_by?: String
    commentsId?: String
    title?: {
        created_at?: Number
        description?: String
        topic?: String
    }
}

export interface EditUsersPost {
    comments: {
        postID: ""
    }
    created_at: Number
    email: ""
    posts: {
        postId: ""
    }
    userName: ""
}

export interface EditComments {
    comments: {
        comment_text: ""
        created_at: Number
        userId: ""
        username: ""
    }
}

export interface UserInformations {
    displayName: String
    email: String
    uid: String
}