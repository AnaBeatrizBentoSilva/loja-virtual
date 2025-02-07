import axios from 'axios';

export class PermissionService{

    url = process.env.REACT_APP_URL_API;

    permission(){
        return axios.get(this.url+'/permission/');
    }

    insert(permission){
        return axios.post(this.url+'/permission/', permission);
    }

    alter(permission){
        return axios.put(this.url+'/permission/', permission);
    }

    delete(id){
        return axios.delete(this.url+'/permission/'+id);
    }
}