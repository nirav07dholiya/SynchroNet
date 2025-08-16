const createOpenIdSlice = (set) => ({
    openIdData: undefined,
    setOpenIdData: (openIdData) => set({ openIdData }),
})

export default createOpenIdSlice;