import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Content from "./components/MainPage/content/Content";
import ErrorPage from "./components/ErrorPage/ErrorPage";

export const router = createBrowserRouter([

    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Content />
            },
            {
                path: "/category/:postsCollectionId/:categoryId",
                element: <Content />
            },
            {
                path: "/profile/:userId",
                element: <Content />
            },
            {
                path: "post/:postsCollectionId/:categoryId/:postID",
                element: <Content />
            }
        ]
    }
])
