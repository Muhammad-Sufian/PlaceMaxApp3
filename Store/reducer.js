const initialState ={
    authToken:'222'
}

const reducer =(state=initialState, action)=>{
    console.log('reducer')
    switch (action.type){
        case 'addToken':
            {
                console.log('reducer case1')
                return {...state, authToken:action.data}
            }
        default:
            {
                console.log('reducer default case')
                return state;
            }
    }
}

export default reducer;