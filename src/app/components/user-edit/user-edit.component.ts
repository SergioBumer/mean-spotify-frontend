import { Component, OnInit } from "@angular/core";

import {UserService} from '../../services/user.service';
import {User} from '../../models/user';
import { StorageProvider } from "src/app/services/storageProvider";
import { GLOBAL } from "../../services/global";



@Component({
    selector: 'user-edit',
    templateUrl: 'user-edit.html',
    styleUrls: ['./user-edit.component.css'],
    providers: [UserService, StorageProvider]
})

export class UserEditComponent implements OnInit {
    public titulo: String;
    public url: String;
    public user: User;
    public user_to_update: User;
    public identity;
    public token;
    public alertMessage = '';
    public errorMessage = '';
    public filesToUpload: Array<File> = [];

    constructor(public userService: UserService, public storageProvider: StorageProvider) {
        this.identity = this.storageProvider.getIdentity();
        this.token = this.storageProvider.getToken();
        this.url = GLOBAL.url;
        this.titulo = 'Actualizar mis datos';
        console.log(this.identity);
        
        this.user = new User('', '', '', '', '', 'ROLE_USER', '');
        
        this.user_to_update = this.identity;
    }

    ngOnInit(): void {

    }

    updateUserData() {
       this.userService
      .updateUser(this.user_to_update, this.identity, this.token)
      .then((response: any) => {
        console.log(response.user);
        if(!this.filesToUpload) {
          
        } else {
          this.makeFileRequest(`${GLOBAL.url}uploadImage/${this.identity._id}`, [], this.filesToUpload).then((response: any) => {
            this.user_to_update.image = response.image;
            localStorage.setItem('identity', JSON.stringify(this.user_to_update));
            const imagePath = `${this.url}/getImage/${this.user_to_update.image}`;
            // @ts-ignore: Object is possibly 'null'.
            document.getElementById('user-image').setAttribute('src', imagePath);
          }).catch((err)=>{
            console.log(err);
            
          });
        }
        this.alertMessage = 'Actualización Exitosa.'
        this.user_to_update = response.user;
        localStorage.setItem('identity', JSON.stringify(this.user_to_update));
      })
      .catch((err) => {
        console.log(err);
        this.errorMessage = err.message;
        
      });
    }

    fileChangeEvent(fileInput: any) {
      this.filesToUpload = <Array<File>> fileInput.target.files;
      console.log(this.filesToUpload);
      
    }

    makeFileRequest(url: string, params: Array<String>, files: Array<File>) {
      const token = this.storageProvider.getToken();
      
      return new Promise((resolve, reject) => {
        let formData: any = new FormData();
        let xhr = new XMLHttpRequest();

        for (let i = 0; i < files.length; i++) {
          formData.append('image', files[i], files[i].name);
        }
        xhr.onreadystatechange = () => {
          if(xhr.readyState == 4) {
            if(xhr.status == 200) {
              resolve(JSON.parse(xhr.response));
            } else {
              reject(xhr.response);
            }
          }
        }

        xhr.open('POST',url, true);
        xhr.setRequestHeader('Authorization', token);
        xhr.send(formData)
      });
    }
    
}