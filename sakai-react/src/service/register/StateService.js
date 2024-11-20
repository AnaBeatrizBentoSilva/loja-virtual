import axios from 'axios';

export class StateService{

    url = process.env.REACT_APP_URL_API;

    state(){
        return axios.get(this.url+'/state/');
    }

    insert(state){
        return axios.post(this.url+'/state/', state);
    }

    alter(state){
        return axios.put(this.url+'/state/', state);
    }

    delete(id){
        return axios.delete(this.url+'/state/'+id);
    }
}