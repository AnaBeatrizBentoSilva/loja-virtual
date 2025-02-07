import axios from 'axios';

export class MarkService{

    url = process.env.REACT_APP_URL_API;

    mark(){
        return axios.get(this.url+'/mark/');
    }

    insert(mark){
        return axios.post(this.url+'/mark/', mark);
    }

    alter(mark){
        return axios.put(this.url+'/mark/', mark);
    }

    delete(id){
        return axios.delete(this.url+'/mark/'+id);
    }
}