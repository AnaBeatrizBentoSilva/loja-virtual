import axios from 'axios';

export class CategoryService{

    url = process.env.REACT_APP_URL_API;

    category(){
        return axios.get(this.url+'/category/');
    }

    insert(category){
        return axios.post(this.url+'/category/', category);
    }

    alter(category){
        return axios.put(this.url+'/category/', category);
    }

    delete(id){
        return axios.delete(this.url+'/category/'+id);
    }
}