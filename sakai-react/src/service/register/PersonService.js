import axios from 'axios';

export class PersonService{

    url = process.env.REACT_APP_URL_API;

    person(){
        return axios.get(this.url+'/person/');
    }

    insert(person){
        return axios.post(this.url+'/person/', person);
    }

    alter(person){
        return axios.put(this.url+'/person/', person);
    }

    delete(id){
        return axios.delete(this.url+'/person/'+id);
    }
}