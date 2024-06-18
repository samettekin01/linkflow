import { DocumentData } from "firebase/firestore"

export interface PostState {
    createdById: string
    commentsId: string
    createdBy: string
    content: {
        createdAt: number
        description: string
        topic: string
        link: string
        title: string
    }
}

export interface EditUsersPost {
    comments: {
        postID: string
    }
    createdAt: number
    email: string
    posts: {
        postId: string
    }
    userName: string
}

export interface EditComments {
    comments: {
        commentext: string
        createdAt: number
        userId: string
        username: string
    }
}

export interface UserInformations {
    displayName: string
    email: string
    uid: string
    photoURL: string
    createdAt: number
    posts: { [postId: string]: string }
    comments: {postID: string}
}

export interface PostFormikValues {
    title: string
    topic: string
    link: string
    description: string
    categories: { [key: string]: string }
    selectedCategory: string
    newCategory: string
}

export interface ContentSliceTypes {
    comments: Array<DocumentData>
    commnetsStatus: string
    user: Array<DocumentData>
    userStatus: string
    post: Array<DocumentData>
    postStatus: string
}

export interface IsOpen {
    post: boolean
}

export interface UserInitialState {
    user: UserInformations | null
    userStatus: string
}

export interface CategoriesTypes {
    categories: Array<DocumentData>
    categoriesStatus: string
}