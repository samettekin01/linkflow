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
        postID: String
    }
    created_at: Number
    email: String
    posts: {
        postId: String
    }
    userName: String
}

export interface EditComments {
    comments: {
        comment_text: String
        created_at: Number
        userId: String
        username: String
    }
}

export interface UserInformations {
    displayName: String
    email: String
    uid: String
    photoURL: String
}