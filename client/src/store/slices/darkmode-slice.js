const createDarkModeSlice = (set) => ({
    darkMode: false,
    setDarkMode: (darkMode) => set({ darkMode }),
})

export default createDarkModeSlice;