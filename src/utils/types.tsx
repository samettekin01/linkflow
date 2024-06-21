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
    posts: []
    comments: { [key: string]: string }
}

export interface PostFormikValues {
    title: string
    link: string
    description: string
    categories: { [key: string]: string }
    selectedCategory: string
    newCategory: string
    img: Blob | Uint8Array | ArrayBuffer | null
}

export interface ContentSliceTypes {
    comments: Array<DocumentData>
    commentsStatus: string
    user: Array<DocumentData>
    userStatus: string
    post: Array<DocumentData>
    postStatus: string
    content: DocumentData | undefined
    contentStatus: string
}

export interface IsOpen {
    post: boolean
}

export interface UserInitialState {
    user: UserInformations | null
    userStatus: string
    userData: DocumentData | undefined
    userDataStatus: string
}

export interface CategoriesTypes {
    categories: Array<DocumentData>
    categoriesStatus: string
    category: DocumentData | undefined
    categoryStatus: string
}