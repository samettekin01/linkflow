import { DocumentData } from "firebase/firestore"

export interface PostData {
    commentsCollectionId: string
    likesCollectionId: string
    postsCollectionId: string
    createdBy: string
    createdName: string
    userImg: string
    postID: string
    createdAt: number
    updatedAt: number
    category: string
    categoryId: string
    content: {
        title: string,
        link: string,
        description: string,
        img: string
    }
}
export interface PostState {
    createdById: string
    commentsCollectionId: string
    createdBy: string
    content: {
        createdAt: number
        description: string
        topic: string
        link: string
        title: string
    }
}

export interface UserInformations {
    displayName: string
    email: string
    uid: string
    photoURL: string
    createdAt: number
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
    userLikesCollection: DocumentData | undefined
    userLikesCollectionStatus: string
    user: Array<DocumentData>
    userStatus: string
    post: DocumentData | undefined
    postStatus: string
    content: DocumentData | undefined
    contentStatus: string
    currentPost: PostData | null
    comment: DocumentData | undefined
    commentStatus: string
    likesCount: number
    likesCountStatus: string
}

export interface IsOpen {
    post: boolean
    getPost: boolean
    getEditPost: boolean
    snackBar: {
        message: string
        status: boolean
    }
    getPostMenu: { [key: string]: boolean }
    getComment: { [key: string]: boolean }
}

export interface UserInitialState {
    user: UserInformations | null
    userStatus: string
}

export interface CategoriesTypes {
    categories: Array<DocumentData>
    categoriesStatus: string
    category: DocumentData | undefined
    categoryStatus: string
}

export interface PostState {
    currentPost: PostData;
}

export interface CategoryTypes {
    categoryId: string
    categoryName: string
    createdAt: number
    createdBy: string
    createdName: string
    postsCollectionId: string
}