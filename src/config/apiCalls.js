import Axios from 'axios';
import { config } from './config';

export async function RefreshTokenFunction(){
    let authBody = {
        token: localStorage.getItem('refreshToken') ? localStorage.getItem('refreshToken') : ''
    }
    return Axios.post(`https://api.goonj.pk/v2/auth/refresh`, authBody)
    .then(res=>{
        let result = res.data;
        // console.log("refresh auth", result)
        localStorage.setItem('accessToken', result.access_token)
        localStorage.setItem('refreshToken', result.refresh_token)
        return result;
    })
    .catch(err =>{
        console.log(err)
    })
}