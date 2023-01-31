# Scheduling App (name TBD)





## React
React is a JavaScript library used to simplify frontend website development.

Documentation: https://reactjs.org/docs/getting-started.html



## React Router

React Router is a library used for routing (moving between different URLs) in React. 

Documentation: https://reactrouter.com/en/main
Tutorial: https://blog.logrocket.com/complete-guide-authentication-with-react-router-v6/



### <BrowserRouter>
The <BrowserRouter> component stores the current location in browser's address bar and is typically passed array of <Route> components.

#### Type Declaration
```js
function createBrowserRouter(
  routes: RouteObject[],
  opts?: {
    basename?: string;
    window?: Window;
  }
): RemixRouter;
```

#### Example:
```js
const router = createBrowserRouter([
  {
    path: "/",
    element: <Calendar />,
  }
]);
```



### <Route>
The <Route> component couples URLs to other React components

#### "Type Declaration":
```js
interface RouteObject {
  path?: string;
  index?: boolean;
  children?: React.ReactNode;
  caseSensitive?: boolean;
  id?: string;
  loader?: LoaderFunction;
  action?: ActionFunction;
  element?: React.ReactNode | null;
  errorElement?: React.ReactNode | null;
  handle?: RouteObject["handle"];
  shouldRevalidate?: ShouldRevalidateFunction;
}
```

#### Example:
```js
<Route
    element={<Calendar />}
    path="calendar/:groupID"
    loader={async ({ params }) => {
        return fetch(
            '/profiles/${params.userID}.json'
        );
    }}
    action={async ({ request }) => {
        return updateProfile(await request.profileData());
    }}
    errorElement={<ErrorComponent />}
/>
```