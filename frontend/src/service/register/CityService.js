import axios from 'axios';

export class CityService{

    url = process.env.REACT_APP_URL_API;

    city(){
        return axios.get(this.url+'/city/');
    }

    insert(city){
        return axios.post(this.url+'/city/', city);
    }

    alter(city){
        return axios.put(this.url+'/city/', city);
    }

    delete(id){
        return axios.delete(this.url+'/city/'+id);
    }
}