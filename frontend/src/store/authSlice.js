import {createSlice} from"@reduxjs/toolkit"

const authSlice = createSlice({
    name : 'auth',
    initialState : {
        isLoggedin : false,
        role : 'user',
    },
    reducers : {
        login(state) {
            console.log("login")
            state.isLoggedin = true
        },

        logout(state) {
            state.isLoggedin = false
        },

        changeRole(state,action){
            const role = action.payload
            state.role = role
        }
    }
})

export const authSliceActions = authSlice.actions
export default authSlice