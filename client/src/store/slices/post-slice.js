const createPostSlice = (set) => ({
    userPost: undefined,
    userAllPost: [],
    openPostInfo:[],
    setUserPost: (userPost) => set({ userPost }),
    setUserAllPost: (userAllPost) => set({ userAllPost }),
    setOpenPostInfo: (openPostInfo) => set({ openPostInfo }),
})

export default createPostSlice;