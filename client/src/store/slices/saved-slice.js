const createSavedSlice = (set) => ({
    savedData: undefined,
    postId:[],
    setSavedData: (savedData) => set({savedData}),
    setPostId: (postId) => set({postId}),
})

export default createSavedSlice;