import axios from 'axios';

export class ProductService{

    url = process.env.REACT_APP_URL_API;

    product(){
        return axios.get(this.url+'/product/');
    }

    insert(product){
        return axios.post(this.url+'/product/', product);
    }

    alter(product){
        return axios.put(this.url+'/product/', product);
    }

    delete(id){
        return axios.delete(this.url+'/product/'+id);
    }
}